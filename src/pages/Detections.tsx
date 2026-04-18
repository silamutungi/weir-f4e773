import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { type Detection, type DetectionStatus } from '../types'
import AppLayout from '../components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Shield, Loader2, ExternalLink, CheckCircle, DollarSign, Trash2, AlertTriangle } from 'lucide-react'
import { formatRelativeTime } from '../lib/utils'

const SEED: Detection[] = [
  { id: '1', user_id: 'demo', platform: 'Instagram', url: 'https://instagram.com/p/demo1', title: 'Nike ad using your photo in a reel', thumbnail_url: null, status: 'pending', match_confidence: 97, detected_at: new Date(Date.now() - 3600000).toISOString(), created_at: new Date(Date.now() - 3600000).toISOString(), deleted_at: null },
  { id: '2', user_id: 'demo', platform: 'YouTube', url: 'https://youtube.com/watch?v=demo2', title: 'Fitness brand thumbnail featuring your likeness', thumbnail_url: null, status: 'monetized', match_confidence: 92, detected_at: new Date(Date.now() - 86400000).toISOString(), created_at: new Date(Date.now() - 86400000).toISOString(), deleted_at: null },
  { id: '3', user_id: 'demo', platform: 'TikTok', url: 'https://tiktok.com/@demo3', title: 'AI-generated deepfake in sports clip', thumbnail_url: null, status: 'takedown', match_confidence: 88, detected_at: new Date(Date.now() - 172800000).toISOString(), created_at: new Date(Date.now() - 172800000).toISOString(), deleted_at: null },
  { id: '4', user_id: 'demo', platform: 'Twitter', url: 'https://twitter.com/demo4', title: 'Crypto project using your image in banner', thumbnail_url: null, status: 'disputed', match_confidence: 95, detected_at: new Date(Date.now() - 259200000).toISOString(), created_at: new Date(Date.now() - 259200000).toISOString(), deleted_at: null },
  { id: '5', user_id: 'demo', platform: 'Facebook', url: 'https://facebook.com/demo5', title: 'Local business ad with your photo', thumbnail_url: null, status: 'approved', match_confidence: 99, detected_at: new Date(Date.now() - 345600000).toISOString(), created_at: new Date(Date.now() - 345600000).toISOString(), deleted_at: null }
]

const STATUS_COLORS: Record<string, string> = {
  pending: 'var(--color-warning)',
  approved: 'var(--color-success)',
  takedown: 'var(--color-error)',
  monetized: 'var(--color-info)',
  disputed: 'var(--color-accent)'
}

export default function Detections() {
  const navigate = useNavigate()
  const [detections, setDetections] = useState<Detection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    if (!isSupabaseConfigured) {
      await new Promise((r) => setTimeout(r, 500))
      setDetections(SEED)
      setLoading(false)
      return
    }
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { navigate('/login'); return }
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
    setActionLoading(id + status)
    if (!isSupabaseConfigured) {
      setDetections((prev) => prev.map((d) => d.id === id ? { ...d, status } : d))
      setActionLoading(null)
      return
    }
    await (supabase.from('weir_detections').update({ status } as any).eq('id', id) as any)
    setDetections((prev) => prev.map((d) => d.id === id ? { ...d, status } : d))
    setActionLoading(null)
  }

  async function softDelete(id: string) {
    setActionLoading(id + 'delete')
    if (!isSupabaseConfigured) {
      setDetections((prev) => prev.filter((d) => d.id !== id))
      setActionLoading(null)
      return
    }
    await (supabase.from('weir_detections').update({ deleted_at: new Date().toISOString() } as any).eq('id', id) as any)
    setDetections((prev) => prev.filter((d) => d.id !== id))
    setActionLoading(null)
  }

  useEffect(() => { load() }, [])

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Detections</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Every instance of your likeness found online</p>
      </div>
      <Card className="border" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
        <CardHeader><CardTitle style={{ color: 'var(--color-text)' }}>All detections</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--color-primary)' }} /></div>
          ) : error ? (
            <div className="text-center py-12"><p className="mb-4" style={{ color: 'var(--color-error)' }}>{error}</p><Button variant="outline" size="sm" onClick={load}>Retry</Button></div>
          ) : detections.length === 0 ? (
            <div className="text-center py-16">
              <Shield className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-border)' }} />
              <p className="font-medium mb-2" style={{ color: 'var(--color-text)' }}>No detections yet</p>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Scans run every 6 hours. Your first results will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {detections.map((d) => (
                <div key={d.id} className="rounded-lg border p-4" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge style={{ backgroundColor: `${STATUS_COLORS[d.status]}18`, color: STATUS_COLORS[d.status], border: `1px solid ${STATUS_COLORS[d.status]}40`, fontSize: '0.75rem' }}>{d.status}</Badge>
                        <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>{d.match_confidence}% match</span>
                      </div>
                      <p className="font-medium text-sm mb-1" style={{ color: 'var(--color-text)' }}>{d.title}</p>
                      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{d.platform} · {formatRelativeTime(d.detected_at)}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <a href={d.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-8 h-8 rounded" aria-label="View source">
                        <ExternalLink className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                      </a>
                      <Button variant="ghost" size="sm" onClick={() => updateStatus(d.id, 'approved')} disabled={actionLoading === d.id + 'approved'} aria-label="Approve" className="w-8 h-8 p-0">
                        <CheckCircle className="w-4 h-4" style={{ color: 'var(--color-success)' }} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => updateStatus(d.id, 'monetized')} disabled={actionLoading === d.id + 'monetized'} aria-label="Monetize" className="w-8 h-8 p-0">
                        <DollarSign className="w-4 h-4" style={{ color: 'var(--color-info)' }} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => updateStatus(d.id, 'takedown')} disabled={actionLoading === d.id + 'takedown'} aria-label="Takedown" className="w-8 h-8 p-0">
                        <AlertTriangle className="w-4 h-4" style={{ color: 'var(--color-error)' }} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => softDelete(d.id)} disabled={actionLoading === d.id + 'delete'} aria-label="Dismiss" className="w-8 h-8 p-0">
                        <Trash2 className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  )
}
