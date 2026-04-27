import { useCallback } from 'react'
import { Loader2, ShieldOff, CheckCircle2, AlertCircle, RotateCcw } from 'lucide-react'
import { Button } from './ui/button'
import type { Detection, TakedownRequest } from '../hooks/useTakedownHandler'
import { useTakedownHandler } from '../hooks/useTakedownHandler'

interface TakedownButtonProps {
  detection: Detection
  reason?: TakedownRequest['reason']
  notes?: string
  size?: 'sm' | 'default' | 'lg'
  onSuccess?: (referenceId: string) => void
  onError?: (message: string) => void
  className?: string
}

export default function TakedownButton({
  detection,
  reason = 'unauthorized_use',
  notes,
  size = 'sm',
  onSuccess,
  onError,
  className = ''
}: TakedownButtonProps) {
  const { initiateTakedown, getStatus, getResult, getError, resetTakedown } = useTakedownHandler()
  const status = getStatus(detection.id)
  const result = getResult(detection.id)
  const error = getError(detection.id)

  const handleClick = useCallback(async () => {
    if (status === 'error') {
      resetTakedown(detection.id)
      return
    }
    const res = await initiateTakedown(detection, reason, notes)
    if (res?.success && res.referenceId) {
      onSuccess?.(res.referenceId)
    } else if (error) {
      onError?.(error)
    }
  }, [status, detection, reason, notes, initiateTakedown, resetTakedown, onSuccess, onError, error])

  if (status === 'submitted' && result) {
    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        <div
          className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md"
          style={{ backgroundColor: 'rgba(22,163,74,0.12)', color: 'var(--color-success)' }}
        >
          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Takedown submitted</span>
        </div>
        {result.referenceId && (
          <span
            className="text-xs font-mono pl-0.5"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {result.referenceId}
          </span>
        )}
        {result.estimatedResolution && (
          <span className="text-xs pl-0.5" style={{ color: 'var(--color-text-muted)' }}>
            Est. resolution: {result.estimatedResolution}
          </span>
        )}
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        <div
          className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md"
          style={{ backgroundColor: 'rgba(220,38,38,0.1)', color: 'var(--color-error)' }}
        >
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Submission failed</span>
        </div>
        <Button
          size={size}
          variant="outline"
          onClick={handleClick}
          className={`flex items-center gap-1.5 text-xs ${className}`}
          style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)' }}
        >
          <RotateCcw className="w-3 h-3" />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <Button
      size={size}
      variant="outline"
      onClick={handleClick}
      disabled={status === 'pending'}
      className={`flex items-center gap-1.5 ${className}`}
      style={{
        borderColor: status === 'pending' ? 'var(--color-border)' : 'var(--color-error)',
        color: status === 'pending' ? 'var(--color-text-muted)' : 'var(--color-error)'
      }}
    >
      {status === 'pending' ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Submitting…
        </>
      ) : (
        <>
          <ShieldOff className="w-3.5 h-3.5" />
          Request Takedown
        </>
      )}
    </Button>
  )
}
