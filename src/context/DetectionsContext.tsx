import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { type Detection, type DetectionStatus } from '../types'

export const SEED_DETECTIONS: Detection[] = [
  { id: '1', user_id: 'demo', platform: 'Instagram', url: 'https://instagram.com/p/demo1', title: 'Nike ad using your photo in a reel', thumbnail_url: null, status: 'pending', match_confidence: 97, detected_at: new Date(Date.now() - 3600000).toISOString(), created_at: new Date(Date.now() - 3600000).toISOString(), deleted_at: null },
  { id: '2', user_id: 'demo', platform: 'YouTube', url: 'https://youtube.com/watch?v=demo2', title: 'Fitness brand thumbnail featuring your likeness', thumbnail_url: null, status: 'monetized', match_confidence: 92, detected_at: new Date(Date.now() - 86400000).toISOString(), created_at: new Date(Date.now() - 86400000).toISOString(), deleted_at: null },
  { id: '3', user_id: 'demo', platform: 'TikTok', url: 'https://tiktok.com/@demo3', title: 'AI-generated deepfake in sports clip', thumbnail_url: null, status: 'takedown', match_confidence: 88, detected_at: new Date(Date.now() - 172800000).toISOString(), created_at: new Date(Date.now() - 172800000).toISOString(), deleted_at: null },
  { id: '4', user_id: 'demo', platform: 'Twitter', url: 'https://twitter.com/demo4', title: 'Crypto project using your image in banner', thumbnail_url: null, status: 'disputed', match_confidence: 95, detected_at: new Date(Date.now() - 259200000).toISOString(), created_at: new Date(Date.now() - 259200000).toISOString(), deleted_at: null },
  { id: '5', user_id: 'demo', platform: 'Facebook', url: 'https://facebook.com/demo5', title: 'Local business ad with your photo', thumbnail_url: null, status: 'approved', match_confidence: 99, detected_at: new Date(Date.now() - 345600000).toISOString(), created_at: new Date(Date.now() - 345600000).toISOString(), deleted_at: null }
]

interface DetectionsContextValue {
  detections: Detection[]
  loading: boolean
  error: string | null
  updateStatus: (id: string, status: DetectionStatus) => Promise<void>
  softDelete: (id: string) => Promise<void>
  reload: () => Promise<void>
}

const DetectionsContext = createContext<DetectionsContextValue | null>(null)

export function DetectionsProvider({ children }: { children: ReactNode }) {
  const [detections, setDetections] = useState<Detection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    if (!isSupabaseConfigured) {
      await new Promise((r) => setTimeout(r, 500))
      setDetections(SEED_DETECTIONS)
      setLoading(false)
      return
    }
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setLoading(false)
        return
      }
      const result = await (supabase.from('weir_detections').select('*').eq('user_id', session.user.id).is('deleted_at', null).order('detected_at', { ascending: false }) as any)
      if (result.error) throw new Error(result.error.message)
      setDetections(result.data ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load detections')
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(id: string, status: DetectionStatus) {
    if (!isSupabaseConfigured) {
      setDetections((prev) => prev.map((d) => d.id === id ? { ...d, status } : d))
      return
    }
    await (supabase.from('weir_detections').update({ status } as any).eq('id', id) as any)
    setDetections((prev) => prev.map((d) => d.id === id ? { ...d, status } : d))
  }

  async function softDelete(id: string) {
    if (!isSupabaseConfigured) {
      setDetections((prev) => prev.filter((d) => d.id !== id))
      return
    }
    await (supabase.from('weir_detections').update({ deleted_at: new Date().toISOString() } as any).eq('id', id) as any)
    setDetections((prev) => prev.filter((d) => d.id !== id))
  }

  useEffect(() => { load() }, [])

  return (
    <DetectionsContext.Provider value={{ detections, loading, error, updateStatus, softDelete, reload: load }}>
      {children}
    </DetectionsContext.Provider>
  )
}

export function useDetections(): DetectionsContextValue {
  const ctx = useContext(DetectionsContext)
  if (!ctx) throw new Error('useDetections must be used within DetectionsProvider')
  return ctx
}
