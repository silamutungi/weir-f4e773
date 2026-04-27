import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

type DashboardStats = {
  total_detections: number
  pending_actions: number
  total_earnings: number
  takedown_success_rate: number
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      setLoading(true)
      setError(null)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          navigate('/login')
          return
        }

        const { data, error: dbError } = await supabase
          .from('dashboard_stats')
          .select('total_detections, pending_actions, total_earnings, takedown_success_rate')
          .eq('user_id', user.id)
          .single()

        if (dbError) throw dbError
        setStats(data)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data.')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [navigate])

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--color-text)', letterSpacing: '-0.02em' }}>Dashboard</h1>

        {loading && (
          <p style={{ color: 'var(--color-text-secondary)' }}>Loading your data…</p>
        )}

        {error && (
          <p style={{ color: 'var(--color-error)' }}>{error}</p>
        )}

        {!loading && !error && stats && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-xl p-6 border" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
              <div className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Total Detections</div>
              <div className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>{stats.total_detections.toLocaleString()}</div>
            </div>
            <div className="rounded-xl p-6 border" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
              <div className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Pending Actions</div>
              <div className="text-3xl font-bold" style={{ color: 'var(--color-warning)' }}>{stats.pending_actions.toLocaleString()}</div>
            </div>
            <div className="rounded-xl p-6 border" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
              <div className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Total Earnings</div>
              <div className="text-3xl font-bold" style={{ color: 'var(--color-success)' }}>${stats.total_earnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div className="rounded-xl p-6 border" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
              <div className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Takedown Success</div>
              <div className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>{stats.takedown_success_rate}%</div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
