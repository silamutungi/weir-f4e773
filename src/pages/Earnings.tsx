import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { type Earning } from '../types'
import AppLayout from '../components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { DollarSign, Loader2, TrendingUp } from 'lucide-react'
import { formatCurrency, formatDate } from '../lib/utils'

const SEED: Earning[] = [
  { id: '1', user_id: 'demo', detection_id: '2', platform: 'YouTube', amount_usd: 847.50, cpm: 12.40, impressions: 68347, earned_at: new Date(Date.now() - 86400000).toISOString(), created_at: new Date().toISOString() },
  { id: '2', user_id: 'demo', detection_id: '1', platform: 'Instagram', amount_usd: 620.00, cpm: 8.90, impressions: 69663, earned_at: new Date(Date.now() - 172800000).toISOString(), created_at: new Date().toISOString() },
  { id: '3', user_id: 'demo', detection_id: null, platform: 'TikTok', amount_usd: 480.00, cpm: 6.20, impressions: 77419, earned_at: new Date(Date.now() - 259200000).toISOString(), created_at: new Date().toISOString() },
  { id: '4', user_id: 'demo', detection_id: null, platform: 'Twitter', amount_usd: 380.00, cpm: 4.10, impressions: 92682, earned_at: new Date(Date.now() - 345600000).toISOString(), created_at: new Date().toISOString() },
  { id: '5', user_id: 'demo', detection_id: null, platform: 'Facebook', amount_usd: 520.00, cpm: 7.30, impressions: 71232, earned_at: new Date(Date.now() - 432000000).toISOString(), created_at: new Date().toISOString() }
]

const PLATFORM_COLORS: Record<string, string> = {
  YouTube: '#FF0000',
  Instagram: '#E1306C',
  TikTok: '#010101',
  Twitter: '#1DA1F2',
  Facebook: '#1877F2'
}

export default function Earnings() {
  const navigate = useNavigate()
  const [earnings, setEarnings] = useState<Earning[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    if (!isSupabaseConfigured) {
      await new Promise((r) => setTimeout(r, 400))
      setEarnings(SEED)
      setLoading(false)
      return
    }
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { navigate('/login'); return }
      const result = await (supabase.from('weir_earnings').select('*').eq('user_id', session.user.id).order('earned_at', { ascending: false }) as any)
      if (result.error) throw new Error(result.error.message)
      setEarnings(result.data ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load earnings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const total = earnings.reduce((s, e) => s + e.amount_usd, 0)
  const byPlatform = earnings.reduce<Record<string, number>>((acc, e) => {
    acc[e.platform] = (acc[e.platform] ?? 0) + e.amount_usd
    return acc
  }, {})

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Earnings</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Revenue from licensed and monetized uses</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <Card className="border" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2" style={{ color: 'var(--color-success)' }}>
              <DollarSign className="w-5 h-5" />
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Total earned</span>
            </div>
            <div className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>{formatCurrency(total)}</div>
          </CardContent>
        </Card>
        <Card className="border" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2" style={{ color: 'var(--color-info)' }}>
              <TrendingUp className="w-5 h-5" />
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Platforms</span>
            </div>
            <div className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>{Object.keys(byPlatform).length}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
          <CardHeader><CardTitle style={{ color: 'var(--color-text)' }}>Per-platform CPM breakdown</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--color-primary)' }} /></div>
            ) : Object.entries(byPlatform).length === 0 ? (
              <p className="text-sm py-4" style={{ color: 'var(--color-text-muted)' }}>No platform data yet.</p>
            ) : (
              <div className="space-y-3">
                {earnings.reduce<{ platform: string; avg_cpm: number; total: number }[]>((acc, e) => {
                  const existing = acc.find((a) => a.platform === e.platform)
                  if (existing) { existing.total += e.amount_usd; existing.avg_cpm = (existing.avg_cpm + e.cpm) / 2 }
                  else acc.push({ platform: e.platform, avg_cpm: e.cpm, total: e.amount_usd })
                  return acc
                }, []).map((p) => (
                  <div key={p.platform} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: PLATFORM_COLORS[p.platform] ?? 'var(--color-primary)' }} />
                      <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{p.platform}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{formatCurrency(p.total)}</div>
                      <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>${p.avg_cpm.toFixed(2)} CPM</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="border" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
          <CardHeader><CardTitle style={{ color: 'var(--color-text)' }}>Transaction history</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--color-primary)' }} /></div>
            ) : error ? (
              <div className="text-center py-8"><p className="mb-3" style={{ color: 'var(--color-error)' }}>{error}</p><Button variant="outline" size="sm" onClick={load}>Retry</Button></div>
            ) : earnings.length === 0 ? (
              <p className="text-sm py-4" style={{ color: 'var(--color-text-muted)' }}>No earnings yet — monetize your first detection to start earning.</p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {earnings.map((e) => (
                  <div key={e.id} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: 'var(--color-border)' }}>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{e.platform}</p>
                      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{formatDate(e.earned_at)} · {new Intl.NumberFormat().format(e.impressions)} impressions</p>
                    </div>
                    <span className="font-semibold text-sm" style={{ color: 'var(--color-success)' }}>+{formatCurrency(e.amount_usd)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
