import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import TakedownButton from '../components/TakedownButton'
import { useTakedownHandler } from '../hooks/useTakedownHandler'
import type { Detection } from '../hooks/useTakedownHandler'
import {
  Search,
  Filter,
  CheckCircle2,
  DollarSign,
  ShieldOff,
  ExternalLink,
  AlertTriangle,
  RefreshCw,
  ChevronDown
} from 'lucide-react'

const MOCK_DETECTIONS: Detection[] = [
  { id: 'det-001', platform: 'Instagram', url: 'https://instagram.com/p/example-001', detectedAt: '2024-01-15T10:23:00Z', type: 'image', confidence: 0.97, thumbnailBg: '#1E3A5F' },
  { id: 'det-002', platform: 'TikTok', url: 'https://tiktok.com/@user/video/example-002', detectedAt: '2024-01-15T08:11:00Z', type: 'video', confidence: 0.91, thumbnailBg: '#2D1B4E' },
  { id: 'det-003', platform: 'YouTube', url: 'https://youtube.com/watch?v=example-003', detectedAt: '2024-01-14T22:05:00Z', type: 'video', confidence: 0.88, thumbnailBg: '#3B1A1A' },
  { id: 'det-004', platform: 'Twitter', url: 'https://x.com/user/status/example-004', detectedAt: '2024-01-14T17:44:00Z', type: 'deepfake', confidence: 0.79, thumbnailBg: '#0D2137' },
  { id: 'det-005', platform: 'Facebook', url: 'https://facebook.com/posts/example-005', detectedAt: '2024-01-14T14:30:00Z', type: 'image', confidence: 0.94, thumbnailBg: '#1B3A2D' },
  { id: 'det-006', platform: 'Reddit', url: 'https://reddit.com/r/example/posts/006', detectedAt: '2024-01-13T09:17:00Z', type: 'image', confidence: 0.85, thumbnailBg: '#3A2A0D' }
]

const TYPE_LABELS: Record<string, string> = {
  image: 'Image',
  video: 'Video',
  text: 'Text',
  deepfake: 'AI Deepfake'
}

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  image: { bg: 'rgba(37,99,235,0.12)', text: 'var(--color-info)' },
  video: { bg: 'rgba(124,58,237,0.12)', text: '#7c3aed' },
  text: { bg: 'rgba(15,118,110,0.12)', text: '#0f766e' },
  deepfake: { bg: 'rgba(220,38,38,0.12)', text: 'var(--color-error)' }
}

function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime()
  const hours = Math.floor(diff / 3_600_000)
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function Detections() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<'all' | Detection['type']>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [bulkSelected, setBulkSelected] = useState<Set<string>>(new Set())
  const [bulkResult, setBulkResult] = useState<{ succeeded: number; failed: number } | null>(null)
  const [isBulkPending, setIsBulkPending] = useState(false)

  const { bulkTakedown, getStatus } = useTakedownHandler()

  const filtered = MOCK_DETECTIONS.filter((d) => {
    const matchesFilter = filter === 'all' || d.type === filter
    const matchesSearch =
      searchQuery === '' ||
      d.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.url.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const toggleSelect = useCallback((id: string) => {
    setBulkSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const handleBulkTakedown = useCallback(async () => {
    const selected = MOCK_DETECTIONS.filter((d) => bulkSelected.has(d.id))
    if (selected.length === 0) return
    setIsBulkPending(true)
    setBulkResult(null)
    const result = await bulkTakedown(selected, 'unauthorized_use')
    setBulkResult(result)
    setIsBulkPending(false)
    setBulkSelected(new Set())
  }, [bulkSelected, bulkTakedown])

  const handleTakedownSuccess = useCallback((referenceId: string) => {
    console.info('[WEIR] Takedown submitted:', referenceId)
  }, [])

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
              Content Detections
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
              {MOCK_DETECTIONS.length} matches found across {new Set(MOCK_DETECTIONS.map((d) => d.platform)).size} platforms
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh scan
          </Button>
        </div>

        {/* Bulk action bar */}
        {bulkSelected.size > 0 && (
          <div
            className="flex flex-wrap items-center gap-4 mb-6 px-5 py-3 rounded-xl border"
            style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}
          >
            <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
              {bulkSelected.size} selected
            </span>
            <Button
              size="sm"
              onClick={handleBulkTakedown}
              disabled={isBulkPending}
              className="flex items-center gap-1.5"
              style={{ backgroundColor: 'var(--color-error)', color: '#ffffff' }}
            >
              {isBulkPending ? (
                <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Submitting…</>
              ) : (
                <><ShieldOff className="w-3.5 h-3.5" /> Bulk Takedown</>
              )}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setBulkSelected(new Set())} style={{ color: 'var(--color-text-secondary)' }}>
              Clear
            </Button>
          </div>
        )}

        {/* Bulk result feedback */}
        {bulkResult && (
          <div
            className="flex items-center gap-3 mb-6 px-5 py-3 rounded-xl border text-sm"
            style={{
              backgroundColor: bulkResult.failed === 0 ? 'rgba(22,163,74,0.08)' : 'rgba(220,38,38,0.08)',
              borderColor: bulkResult.failed === 0 ? 'rgba(22,163,74,0.25)' : 'rgba(220,38,38,0.25)',
              color: bulkResult.failed === 0 ? 'var(--color-success)' : 'var(--color-error)'
            }}
          >
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>
              {bulkResult.succeeded} takedown{bulkResult.succeeded !== 1 ? 's' : ''} submitted successfully
              {bulkResult.failed > 0 ? `, ${bulkResult.failed} failed` : ''}.
            </span>
            <button
              onClick={() => setBulkResult(null)}
              className="ml-auto text-xs opacity-60 hover:opacity-100"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Filters + Search */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              placeholder="Search platform or URL…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border"
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
                outline: 'none'
              }}
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'image', 'video', 'deepfake'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors"
                style={{
                  backgroundColor: filter === f ? 'var(--color-primary)' : 'var(--color-bg-surface)',
                  borderColor: filter === f ? 'var(--color-primary)' : 'var(--color-border)',
                  color: filter === f ? '#ffffff' : 'var(--color-text-secondary)'
                }}
              >
                {f === 'all' ? 'All' : TYPE_LABELS[f]}
              </button>
            ))}
          </div>
        </div>

        {/* Detection cards */}
        <div className="flex flex-col gap-3">
          {filtered.length === 0 && (
            <div className="text-center py-16" style={{ color: 'var(--color-text-secondary)' }}>
              <Search className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <p>No detections match your filters.</p>
            </div>
          )}

          {filtered.map((detection) => {
            const typeStyle = TYPE_COLORS[detection.type] ?? TYPE_COLORS.image
            const isSelected = bulkSelected.has(detection.id)
            const takedownStatus = getStatus(detection.id)

            return (
              <div
                key={detection.id}
                className="rounded-xl border p-5 transition-colors"
                style={{
                  backgroundColor: 'var(--color-bg-surface)',
                  borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)'
                }}
              >
                <div className="flex flex-wrap items-start gap-4">
                  {/* Checkbox */}
                  <div className="flex items-center pt-0.5">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(detection.id)}
                      disabled={takedownStatus === 'submitted' || takedownStatus === 'pending'}
                      className="w-4 h-4 rounded cursor-pointer accent-blue-600"
                    />
                  </div>

                  {/* Thumbnail placeholder */}
                  <div
                    className="w-16 h-16 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-mono"
                    style={{ backgroundColor: detection.thumbnailBg ?? '#1e293b', color: 'rgba(255,255,255,0.4)' }}
                  >
                    {detection.type === 'deepfake' ? (
                      <AlertTriangle className="w-5 h-5" style={{ color: 'var(--color-error)' }} />
                    ) : (
                      <span className="text-lg">📷</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>{detection.platform}</span>
                      <Badge
                        className="text-xs px-2 py-0.5"
                        style={{ backgroundColor: typeStyle.bg, color: typeStyle.text, border: 'none' }}
                      >
                        {TYPE_LABELS[detection.type]}
                      </Badge>
                      {detection.type === 'deepfake' && (
                        <Badge className="text-xs px-2 py-0.5" style={{ backgroundColor: 'rgba(220,38,38,0.12)', color: 'var(--color-error)', border: 'none' }}>
                          AI Generated
                        </Badge>
                      )}
                    </div>
                    <p
                      className="text-xs mb-1 truncate"
                      style={{ color: 'var(--color-text-secondary)', maxWidth: '380px' }}
                    >
                      {detection.url}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      <span>{formatRelativeTime(detection.detectedAt)}</span>
                      <span>·</span>
                      <span>{Math.round(detection.confidence * 100)}% confidence</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                    <TakedownButton
                      detection={detection}
                      reason={detection.type === 'deepfake' ? 'deepfake' : 'unauthorized_use'}
                      onSuccess={handleTakedownSuccess}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1.5 text-xs"
                      style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
                      onClick={() => navigate('/earnings')}
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      Monetize
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="flex items-center gap-1.5 text-xs"
                      style={{ color: 'var(--color-text-muted)' }}
                      onClick={() => window.open(detection.url, '_blank', 'noopener,noreferrer')}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      <Footer />
    </div>
  )
}
