import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import { Shield, AlertTriangle, DollarSign, FileText, TrendingUp, Eye, Clock } from 'lucide-react'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'

interface Detection {
  id: string
  platform: string
  url: string
  status: string
  detected_at: string
  match_confidence: number
}

interface Earning {
  id: string
  platform: string
  amount: number
  period: string
  created_at: string
}

interface License {
  id: string
  title: string
  platform: string
  status: string
  created_at: string
}

interface DashboardStats {
  totalDetections: number
  pendingActions: number
  totalEarnings: number
  activeLicenses: number
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats>({ totalDetections: 0, pendingActions: 0, totalEarnings: 0, activeLicenses: 0 })
  const [recentDetections, setRecentDetections] = useState<Detection[]>([])
  const [recentEarnings, setRecentEarnings] = useState<Earning[]>([])
  const [recentLicenses, setRecentLicenses] = useState<License[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    try {
      setLoading(true)
      setError(null)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        navigate('/login')
        return
      }
      setUserEmail(user.email ?? null)

      const [detectionsRes, earningsRes, licensesRes] = await Promise.all([
        supabase
          .from('detections')
          .select('*')
          .eq('user_id', user.id)
          .order('detected_at', { ascending: false })
          .limit(5),
        supabase
          .from('earnings')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('licenses')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5)
      ])

      if (detectionsRes.error) throw detectionsRes.error
      if (earningsRes.error) throw earningsRes.error
      if (licensesRes.error) throw licensesRes.error

      const detections: Detection[] = detectionsRes.data ?? []
      const earnings: Earning[] = earningsRes.data ?? []
      const licenses: License[] = licensesRes.data ?? []

      setRecentDetections(detections)
      setRecentEarnings(earnings)
      setRecentLicenses(licenses)

      const pendingCount = detections.filter((d) => d.status === 'pending').length
      const totalEarningsSum = earnings.reduce((sum, e) => sum + (e.amount ?? 0), 0)
      const activeLicensesCount = licenses.filter((l) => l.status === 'active').length

      const { count: totalDetectionsCount } = await supabase
        .from('detections')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      const { data: allEarnings } = await supabase
        .from('earnings')
        .select('amount')
        .eq('user_id', user.id)

      const { count: allActiveLicenses } = await supabase
        .from('licenses')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'active')

      const { count: allPendingDetections } = await supabase
        .from('detections')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'pending')

      const totalEarningsAll = (allEarnings ?? []).reduce((sum, e) => sum + (e.amount ?? 0), 0)

      setStats({
        totalDetections: totalDetectionsCount ?? 0,
        pendingActions: allPendingDetections ?? 0,
        totalEarnings: totalEarningsAll,
        activeLicenses: allActiveLicenses ?? 0
      })
    } catch (err: unknown) {
      console.error('Dashboard fetch error:', err)
      setError('Failed to load dashboard data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  function statusColor(status: string) {
    switch (status) {
      case 'pending': return 'var(--color-warning)'
      case 'approved': return 'var(--color-success)'
      case 'takedown': return 'var(--color-error)'
      case 'active': return 'var(--color-success)'
      case 'expired': return 'var(--color-text-muted)'
      default: return 'var(--color-text-secondary)'
    }
  }

  const statCards = [
    { icon: <Eye className="w-5 h-5" />, label: 'Total Detections', value: stats.totalDetections.toString(), action: () => navigate('/detections') },
    { icon: <AlertTriangle className="w-5 h-5" />, label: 'Pending Actions', value: stats.pendingActions.toString(), action: () => navigate('/detections') },
    { icon: <DollarSign className="w-5 h-5" />, label: 'Total Earnings', value: formatCurrency(stats.totalEarnings), action: () => navigate('/earnings') },
    { icon: <FileText className="w-5 h-5" />, label: 'Active Licenses', value: stats.activeLicenses.toString(), action: () => navigate('/licenses') }
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
            Dashboard
          </h1>
          {userEmail && (
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Signed in as {userEmail}
            </p>
          )}
        </div>

        {error && (
          <div className="mb-6 rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: 'rgba(220,38,38,0.08)', color: 'var(--color-error)', border: '1px solid rgba(220,38,38,0.2)' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }} />
              <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Loading your dashboard…</span>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {statCards.map((card) => (
                <button
                  key={card.label}
                  onClick={card.action}
                  className="text-left rounded-xl p-5 border transition-all hover:shadow-md"
                  style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}
                >
                  <div className="flex items-center gap-2 mb-3" style={{ color: 'var(--color-primary)' }}>
                    {card.icon}
                  </div>
                  <div className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>{card.value}</div>
                  <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{card.label}</div>
                </button>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 rounded-xl border p-6" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-semibold text-base" style={{ color: 'var(--color-text)' }}>Recent Detections</h2>
                  <Button size="sm" variant="outline" onClick={() => navigate('/detections')} className="text-xs">
                    View all
                  </Button>
                </div>
                {recentDetections.length === 0 ? (
                  <div className="py-10 text-center">
                    <Shield className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--color-text-muted)' }} />
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>No detections yet. Your scans will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentDetections.map((detection) => (
                      <div key={detection.id} className="flex items-center justify-between py-3 border-b last:border-b-0" style={{ borderColor: 'var(--color-border)' }}>
                        <div className="flex-1 min-w-0 mr-4">
                          <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text)' }}>{detection.platform}</p>
                          <p className="text-xs truncate mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>{detection.url}</p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                            <Clock className="w-3 h-3 inline mr-1" />
                            {formatDate(detection.detected_at)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                            {Math.round(detection.match_confidence * 100)}%
                          </span>
                          <Badge
                            className="text-xs capitalize"
                            style={{ backgroundColor: `${statusColor(detection.status)}22`, color: statusColor(detection.status), border: `1px solid ${statusColor(detection.status)}44` }}
                          >
                            {detection.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-semibold text-base" style={{ color: 'var(--color-text)' }}>Recent Earnings</h2>
                    <Button size="sm" variant="outline" onClick={() => navigate('/earnings')} className="text-xs">
                      View all
                    </Button>
                  </div>
                  {recentEarnings.length === 0 ? (
                    <div className="py-8 text-center">
                      <TrendingUp className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--color-text-muted)' }} />
                      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>No earnings yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentEarnings.map((earning) => (
                        <div key={earning.id} className="flex items-center justify-between py-2 border-b last:border-b-0" style={{ borderColor: 'var(--color-border)' }}>
                          <div>
                            <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{earning.platform}</p>
                            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{earning.period}</p>
                          </div>
                          <span className="text-sm font-semibold" style={{ color: 'var(--color-success)' }}>
                            {formatCurrency(earning.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-semibold text-base" style={{ color: 'var(--color-text)' }}>Recent Licenses</h2>
                    <Button size="sm" variant="outline" onClick={() => navigate('/licenses')} className="text-xs">
                      View all
                    </Button>
                  </div>
                  {recentLicenses.length === 0 ? (
                    <div className="py-8 text-center">
                      <FileText className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--color-text-muted)' }} />
                      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>No licenses yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentLicenses.map((license) => (
                        <div key={license.id} className="flex items-center justify-between py-2 border-b last:border-b-0" style={{ borderColor: 'var(--color-border)' }}>
                          <div className="flex-1 min-w-0 mr-2">
                            <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text)' }}>{license.title}</p>
                            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{license.platform}</p>
                          </div>
                          <Badge
                            className="text-xs capitalize flex-shrink-0"
                            style={{ backgroundColor: `${statusColor(license.status)}22`, color: statusColor(license.status), border: `1px solid ${statusColor(license.status)}44` }}
                          >
                            {license.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
