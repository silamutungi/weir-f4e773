import { useNavigate } from 'react-router-dom'
import { type Detection } from '../types'
import AppLayout from '../components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Shield, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react'

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

const DETECTION_AMOUNTS: Record<string, string> = {
  '1': '$0 (pending)',
  '2': '$847.50',
  '3': '$0 (disputed)'
}

interface DashboardProps {
  pendingReview?: number
  totalEarned?: number
  monetized?: number
  totalDetections?: number
}

export default function Dashboard({ pendingReview, totalEarned, monetized, totalDetections }: DashboardProps) {
  const navigate = useNavigate()
  const detections = SEED_DETECTIONS
  const pending = pendingReview ?? 2
  const monetizedCount = monetized ?? 12
  const detectionsCount = totalDetections ?? 8
  const displayEarnings = totalEarned ?? 2400

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Dashboard</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Your likeness protection at a glance</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: <AlertTriangle className="w-5 h-5" />, label: 'Pending Review', value: pending.toString(), color: 'var(--color-warning)' },
          { icon: <DollarSign className="w-5 h-5" />, label: 'Total Earned', value: formatCurrency(displayEarnings), color: 'var(--color-success)' },
          { icon: <CheckCircle className="w-5 h-5" />, label: 'Monetized', value: monetizedCount.toString(), color: 'var(--color-info)' },
          { icon: <Shield className="w-5 h-5" />, label: 'Total Detections', value: detectionsCount.toString(), color: 'var(--color-primary)' }
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
        </CardHeader>
        <CardContent>
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
                  <span className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>{DETECTION_AMOUNTS[d.id]}</span>
                  <Badge style={{ backgroundColor: `${STATUS_CONFIG[d.status]?.color}18`, color: STATUS_CONFIG[d.status]?.color, border: `1px solid ${STATUS_CONFIG[d.status]?.color}40` }}>
                    {STATUS_CONFIG[d.status]?.label}
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/detections')} style={{ color: 'var(--color-primary)' }}>Review</Button>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-4">
            <Button variant="outline" className="w-full" onClick={() => navigate('/detections')}>View all detections</Button>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  )
}
