import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { type DetectionStatus } from '../types'
import { useDetections } from '../context/DetectionsContext'
import AppLayout from '../components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Shield, Loader2, ExternalLink, CheckCircle, DollarSign, Trash2, AlertTriangle } from 'lucide-react'
import { formatRelativeTime } from '../lib/utils'

const STATUS_COLORS: Record<string, string> = {
  pending: 'var(--color-warning)',
  approved: 'var(--color-success)',
  takedown: 'var(--color-error)',
  monetized: 'var(--color-info)',
  disputed: 'var(--color-accent)'
}

export default function Detections() {
  const navigate = useNavigate()
  const { detections, loading, error, updateStatus, softDelete, reload } = useDetections()
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  async function handleUpdateStatus(id: string, status: DetectionStatus) {
    setActionLoading(id + status)
    await updateStatus(id, status)
    setActionLoading(null)
  }

  async function handleSoftDelete(id: string) {
    setActionLoading(id + 'delete')
    await softDelete(id)
    setActionLoading(null)
  }

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
            <div className="text-center py-12"><p className="mb-4" style={{ color: 'var(--color-error)' }}>{error}</p><Button variant="outline" size="sm" onClick={reload}>Retry</Button></div>
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
                      <Button variant="ghost" size="sm" onClick={() => handleUpdateStatus(d.id, 'approved')} disabled={actionLoading === d.id + 'approved'} aria-label="Approve" className="w-8 h-8 p-0">
                        <CheckCircle className="w-4 h-4" style={{ color: 'var(--color-success)' }} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleUpdateStatus(d.id, 'monetized')} disabled={actionLoading === d.id + 'monetized'} aria-label="Monetize" className="w-8 h-8 p-0">
                        <DollarSign className="w-4 h-4" style={{ color: 'var(--color-info)' }} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleUpdateStatus(d.id, 'takedown')} disabled={actionLoading === d.id + 'takedown'} aria-label="Takedown" className="w-8 h-8 p-0">
                        <AlertTriangle className="w-4 h-4" style={{ color: 'var(--color-error)' }} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleSoftDelete(d.id)} disabled={actionLoading === d.id + 'delete'} aria-label="Dismiss" className="w-8 h-8 p-0">
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
