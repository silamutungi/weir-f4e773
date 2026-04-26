import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { type Detection } from '../types'
import AppLayout from '../components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Shield, DollarSign, AlertTriangle, CheckCircle, Loader2, RefreshCw } from 'lucide-react'

import { formatCurrency, formatRelativeTime } from '../lib/utils'

const SEED_DETECTIONS: Detection[] = [
  { id: '1', user_id: 'demo', platform: 'Instagram', url: 'https://instagram.com/p/demo1', title: 'Nike ad using your photo in a reel', thumbnail_url: null, status: 'pending', match_confidence: 97, detected_at: new Date(Date.now() - 3600000).toISOString(), created_at: new Date(Date.now() - 3600000).toISOString(), deleted_at: null },
  { id: '2', user_id: 'demo', platform: 'YouTube', url: 'https://youtube.com/watch?v=demo2', title: 'Fitness brand thumbnail featuring your likeness', thumbnail_url: null, status: 'monetized', match_confidence: 92, detected_at: new Date(Date.now() - 86400000).toISOString(), created_at: new Date(Date.now() - 86400000).toISOString(), deleted_at: null },
  { id: '3', user_id: 'demo', platform: 'TikTok', url: 'https://tiktok.com/@demo3', title: 'AI-generated deepfake in sports clip', thumbnail_url: null, status: 'takedown', match_confidence: 88, detected_at: new Date(Date.now() - 172800000).toISOString(), created_at: new Date(Date.now() - 172800000).toISOString(), deleted_at: null }
]

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'var(--color-warning)' },
  approved: { label: 'Approved', color: 'var(--color-success)' },
  takedown: { label: 'Takedown', color: 'var(--color-error)' },
  monetized: { label: 'Monetized', color: 'var(--color-info)' },
  disputed: { label: 'Disputed', color: 'var(--color-accent)' }
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [detections, setDetections] = useState<Detection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalEarnings, setTotalEarnings] = useState(2400)

  async function loadData() {
    setLoading(true)
    setError(null)
    if (!isSupabaseConfigured) {
      await new Promise((r) => setTimeout(r, 600))
      setDetections(SEED_DETECTIONS)
      setLoading(false)
      return
    }
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { navigate('/login'); return }
      const result = await (supabase.from('weir_detections').select('*').eq('user_id', session.user.id).is('deleted_at', null).order('detected_at', { ascending: false }).limit(10) as any)
      if (result.error) throw new Error(result.error.message)
      setDetections(result.data ?? [])
      const earningsResult = await (supabase.from('weir_earnings').select('amount_usd').eq('user_id', session.user.id) as any)
      if (!earningsResult.error && earningsResult.data) {
        setTotalEarnings(earningsResult.data.reduce((s: number, r: { amount_usd: number }) => s + r.amount_usd, 0))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const pending = isSupabaseConfigured ? detections.filter((d) => d.status === 'pending').length : 2
  const monetized = isSupabaseConfigured ? detections.filter((d) => d.status === 'monetized').length : 12
  const totalDetections = isSupabaseConfigured ? detections.length : 8
  const displayEarnings = isSupabaseConfigured ? totalEarnings : 2400

  return (
    <AppLayout>
      {!isSupabaseConfigured && (
        <div className="mb-6 px-4 py-3 rounded-lg text-sm border" style={{ backgroundColor: 'rgba(37,99,235,0.08)', borderColor: 'rgba(37,99,235,0.25)', color: 'var(--color-info)' }}>
          Viewing sample data — connect your database to go live.
        </div>
      )}
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Dashboard</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Your likeness protection at a glance</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: <AlertTriangle className="w-5 h-5" />, label: 'Pending Review', value: pending.toString(), color: 'var(--color-warning)' },
          { icon: <DollarSign className="w-5 h-5" />, label: 'Total Earned', value: formatCurrency(displayEarnings), color: 'var(--color-success)' },
          { icon: <CheckCircle className="w-5 h-5" />, label: 'Monetized', value: monetized.toString(), color: 'var(--color-info)' },
          { icon: <Shield className="w-5 h-5" />, label: 'Total Detections', value: totalDetections.toString(), color: 'var(--color-primary)' }
        ].map((m) => (
          <Card key={m.label} className="border" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 mb-2" style={{ color: m.color }}>{m.icon}<span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>{m.label}</span></div>
              <div className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{m.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="border" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle style={{ color: 'var(--color-text)' }}>Recent Detections</CardTitle>
          <Button variant="ghost" size="sm" onClick={loadData} disabled={loading} aria-label="Refresh detections">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--color-primary)' }} />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="mb-4" style={{ color: 'var(--color-error)' }}>{error}</p>
              <Button variant="outline" size="sm" onClick={loadData}>Retry</Button>
            </div>
          ) : detections.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-border)' }} />
              <p className="font-medium mb-2" style={{ color: 'var(--color-text)' }}>No detections yet</p>
              <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>Add your platforms to start scanning for unauthorized use.</p>
              <Button onClick={() => navigate('/settings')} style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}>Set up monitoring</Button>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {detections.map((d) => (
                <div key={d.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-2 h-2 rounded-full flex-shrink-0 pulse-dot" style={{ backgroundColor: d.status === 'pending' ? 'var(--color-warning)' : 'var(--color-success)' }} />
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate" style={{ color: 'var(--color-text)' }}>{d.title}</p>
                      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{d.platform} · {formatRelativeTime(d.detected_at)} · {d.match_confidence}% match</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge style={{ backgroundColor: `${STATUS_CONFIG[d.status]?.color}18`, color: STATUS_CONFIG[d.status]?.color, border: `1px solid ${STATUS_CONFIG[d.status]?.color}40` }}>
                      {STATUS_CONFIG[d.status]?.label}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/detections')} style={{ color: 'var(--color-primary)' }}>Review</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {detections.length > 0 && (
            <div className="pt-4">
              <Button variant="outline" className="w-full" onClick={() => navigate('/detections')}>View all detections</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  )
}
