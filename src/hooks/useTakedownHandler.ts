import { useState, useCallback } from 'react'

export type TakedownStatus = 'idle' | 'pending' | 'submitted' | 'error'

export interface Detection {
  id: string
  platform: string
  url: string
  detectedAt: string
  type: 'image' | 'video' | 'text' | 'deepfake'
  confidence: number
  thumbnailBg?: string
}

export interface TakedownRequest {
  detectionId: string
  platform: string
  url: string
  reason: 'unauthorized_use' | 'deepfake' | 'commercial_use' | 'impersonation'
  notes?: string
  submittedAt: string
  status: TakedownStatus
  referenceId?: string
}

export interface TakedownResult {
  success: boolean
  referenceId?: string
  message: string
  estimatedResolution?: string
}

const PLATFORM_ENDPOINTS: Record<string, { name: string; avgResolutionHours: number }> = {
  instagram: { name: 'Instagram', avgResolutionHours: 48 },
  tiktok: { name: 'TikTok', avgResolutionHours: 24 },
  youtube: { name: 'YouTube', avgResolutionHours: 72 },
  twitter: { name: 'X (Twitter)', avgResolutionHours: 36 },
  facebook: { name: 'Facebook', avgResolutionHours: 96 },
  linkedin: { name: 'LinkedIn', avgResolutionHours: 48 },
  reddit: { name: 'Reddit', avgResolutionHours: 24 },
  default: { name: 'Unknown Platform', avgResolutionHours: 72 }
}

function generateReferenceId(platform: string, detectionId: string): string {
  const platformCode = platform.slice(0, 3).toUpperCase()
  const timestamp = Date.now().toString(36).toUpperCase()
  const detectionSuffix = detectionId.slice(-4).toUpperCase()
  return `WR-${platformCode}-${timestamp}-${detectionSuffix}`
}

function detectPlatform(url: string): string {
  const lower = url.toLowerCase()
  if (lower.includes('instagram.com')) return 'instagram'
  if (lower.includes('tiktok.com')) return 'tiktok'
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'youtube'
  if (lower.includes('twitter.com') || lower.includes('x.com')) return 'twitter'
  if (lower.includes('facebook.com') || lower.includes('fb.com')) return 'facebook'
  if (lower.includes('linkedin.com')) return 'linkedin'
  if (lower.includes('reddit.com')) return 'reddit'
  return 'default'
}

async function submitTakedownRequest(request: TakedownRequest): Promise<TakedownResult> {
  // Simulate network latency for async submission
  await new Promise((resolve) => setTimeout(resolve, 1200 + Math.random() * 800))

  // Simulate a ~5% error rate for realism
  if (Math.random() < 0.05) {
    throw new Error('Submission service temporarily unavailable. Please try again.')
  }

  const platformKey = detectPlatform(request.url)
  const platformInfo = PLATFORM_ENDPOINTS[platformKey] ?? PLATFORM_ENDPOINTS.default
  const referenceId = generateReferenceId(platformKey, request.detectionId)

  const now = new Date()
  const resolution = new Date(now.getTime() + platformInfo.avgResolutionHours * 60 * 60 * 1000)
  const resolutionStr = resolution.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })

  return {
    success: true,
    referenceId,
    message: `Takedown notice submitted to ${platformInfo.name}. Reference: ${referenceId}`,
    estimatedResolution: resolutionStr
  }
}

export function useTakedownHandler() {
  const [statuses, setStatuses] = useState<Record<string, TakedownStatus>>({})
  const [requests, setRequests] = useState<Record<string, TakedownRequest>>({})
  const [results, setResults] = useState<Record<string, TakedownResult>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const initiateTakedown = useCallback(
    async (
      detection: Detection,
      reason: TakedownRequest['reason'] = 'unauthorized_use',
      notes?: string
    ): Promise<TakedownResult | null> => {
      const { id, url, platform } = detection

      // Prevent duplicate submissions
      if (statuses[id] === 'pending' || statuses[id] === 'submitted') {
        return results[id] ?? null
      }

      const request: TakedownRequest = {
        detectionId: id,
        platform,
        url,
        reason,
        notes,
        submittedAt: new Date().toISOString(),
        status: 'pending'
      }

      setStatuses((prev) => ({ ...prev, [id]: 'pending' }))
      setRequests((prev) => ({ ...prev, [id]: request }))
      setErrors((prev) => { const next = { ...prev }; delete next[id]; return next })

      try {
        const result = await submitTakedownRequest(request)

        const completedRequest: TakedownRequest = {
          ...request,
          status: 'submitted',
          referenceId: result.referenceId
        }

        setStatuses((prev) => ({ ...prev, [id]: 'submitted' }))
        setRequests((prev) => ({ ...prev, [id]: completedRequest }))
        setResults((prev) => ({ ...prev, [id]: result }))

        return result
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Takedown submission failed.'
        setStatuses((prev) => ({ ...prev, [id]: 'error' }))
        setErrors((prev) => ({ ...prev, [id]: message }))
        return null
      }
    },
    [statuses, results]
  )

  const getStatus = useCallback(
    (detectionId: string): TakedownStatus => statuses[detectionId] ?? 'idle',
    [statuses]
  )

  const getResult = useCallback(
    (detectionId: string): TakedownResult | undefined => results[detectionId],
    [results]
  )

  const getRequest = useCallback(
    (detectionId: string): TakedownRequest | undefined => requests[detectionId],
    [requests]
  )

  const getError = useCallback(
    (detectionId: string): string | undefined => errors[detectionId],
    [errors]
  )

  const resetTakedown = useCallback((detectionId: string) => {
    setStatuses((prev) => { const next = { ...prev }; delete next[detectionId]; return next })
    setRequests((prev) => { const next = { ...prev }; delete next[detectionId]; return next })
    setResults((prev) => { const next = { ...prev }; delete next[detectionId]; return next })
    setErrors((prev) => { const next = { ...prev }; delete next[detectionId]; return next })
  }, [])

  const bulkTakedown = useCallback(
    async (
      detections: Detection[],
      reason: TakedownRequest['reason'] = 'unauthorized_use'
    ): Promise<{ succeeded: number; failed: number }> => {
      const results_arr = await Promise.allSettled(
        detections.map((d) => initiateTakedown(d, reason))
      )
      const succeeded = results_arr.filter(
        (r) => r.status === 'fulfilled' && r.value !== null
      ).length
      const failed = results_arr.length - succeeded
      return { succeeded, failed }
    },
    [initiateTakedown]
  )

  return {
    initiateTakedown,
    bulkTakedown,
    getStatus,
    getResult,
    getRequest,
    getError,
    resetTakedown,
    statuses,
    results,
    errors
  }
}
