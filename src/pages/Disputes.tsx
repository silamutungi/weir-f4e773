import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { type FormEvent } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { type Dispute } from '../types'
import AppLayout from '../components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { AlertTriangle, Loader2, Plus } from 'lucide-react'
import { formatDate } from '../lib/utils'

const SEED: Dispute[] = [
  { id: '1', user_id: 'demo', detection_id: '4', reason: 'Company claims license was purchased but I never authorized it. No documentation provided.', status: 'under_review', resolution_notes: 'Our team is contacting the brand for proof of purchase.', created_at: new Date(Date.now() - 172800000).toISOString(), updated_at: new Date(Date.now() - 86400000).toISOString(), deleted_at: null },
  { id: '2', user_id: 'demo', detection_id: '3', reason: 'AI-generated deepfake used in a crypto promotion without consent.', status: 'open', resolution_notes: null, created_at: new Date(Date.now() - 259200000).toISOString(), updated_at: new Date(Date.now() - 259200000).toISOString(), deleted_at: null },
  { id: '3', user_id: 'demo', detection_id: '2', reason: 'Brand disputes CPM rate. Requesting renegotiation.', status: 'resolved', resolution_notes: 'Settled at $8.50 CPM. Payment received.', created_at: new Date(Date.now() - 604800000).toISOString(), updated_at: new Date(Date.now() - 432000000).toISOString(), deleted_at: null }
]

const STATUS_COLORS: Record<string, string> = {
  open: 'var(--color-warning)',
  under_review: 'var(--color-info)',
  resolved: 'var(--color-success)',
  rejected: 'var(--color-error)'
}

export default function Disputes() {
  const navigate = useNavigate()
  const [disputes, setDisputes] = useState<Dispute[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ detection_id: '', reason: '' })

  async function load() {
    setLoading(true)
    setError(null)
    if (!isSupabaseConfigured) {
      await new Promise((r) => setTimeout(r, 400))
      setDisputes(SEED)
      setLoading(false)
      return
    }
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { navigate('/login'); return }
      const result = await (supabase.from('weir_disputes').select('*').eq('user_id', session.user.id).is('deleted_at', null).order('created_at', { ascending: false }) as any)
      if (result.error) throw new Error(result.error.message)
      setDisputes(result.data ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load disputes')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    if (!isSupabaseConfigured) {
      const d: Dispute = { id: Date.now().toString(), user_id: 'demo', detection_id: form.detection_id, reason: form.reason, status: 'open', resolution_notes: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), deleted_at: null }
      setDisputes((prev) => [d, ...prev])
      setForm({ detection_id: '', reason: '' })
      setShowForm(false)
      setSaving(false)
      return
    }
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { navigate('/login'); return }
    await (supabase.from('weir_disputes').insert({ user_id: session.user.id, detection_id: form.detection_id, reason: form.reason, status: 'open' } as any) as any)
    setForm({ detection_id: '', reason: '' })
    setShowForm(false)
    setSaving(false)
    load()
  }

  useEffect(() => { load() }, [])

  return (
    <AppLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Disputes</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Challenge unauthorized use with full audit trails</p>
        </div>
        <Button onClick={() => setShowForm(true)} style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}>
          <Plus className="w-4 h-4 mr-2" />Open dispute
        </Button>
      </div>
      {showForm && (
        <Card className="mb-6 border" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
          <CardHeader><CardTitle style={{ color: 'var(--color-text)' }}>Open a dispute</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2"><Label>Detection ID</Label><Input required value={form.detection_id} onChange={(e) => setForm({ ...form, detection_id: e.target.value })} placeholder="Detection ID from your Detections page" /></div>
              <div className="space-y-2"><Label>Reason for dispute</Label><Input required value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Describe the unauthorized use in detail..." /></div>
              <div className="flex gap-3">
                <Button type="submit" disabled={saving} style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}>{saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</> : 'Submit dispute'}</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      <Card className="border" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--color-primary)' }} /></div>
          ) : error ? (
            <div className="text-center py-12"><p className="mb-4" style={{ color: 'var(--color-error)' }}>{error}</p><Button variant="outline" size="sm" onClick={load}>Retry</Button></div>
          ) : disputes.length === 0 ? (
            <div className="text-center py-16">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-border)' }} />
              <p className="font-medium mb-2" style={{ color: 'var(--color-text)' }}>No disputes filed</p>
              <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>When unauthorized use occurs, open a dispute to start the resolution process.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {disputes.map((d) => (
                <div key={d.id} className="rounded-lg border p-4" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <Badge style={{ backgroundColor: `${STATUS_COLORS[d.status]}18`, color: STATUS_COLORS[d.status], border: `1px solid ${STATUS_COLORS[d.status]}40` }}>{d.status.replace('_', ' ')}</Badge>
                    </div>
                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Filed {formatDate(d.created_at)}</span>
                  </div>
                  <p className="text-sm mb-2" style={{ color: 'var(--color-text)' }}>{d.reason}</p>
                  {d.resolution_notes && (
                    <div className="mt-3 px-3 py-2 rounded text-sm" style={{ backgroundColor: 'rgba(37,99,235,0.08)', color: 'var(--color-info)' }}>
                      <strong>Update:</strong> {d.resolution_notes}
                    </div>
                  )}
                  <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>Detection #{d.detection_id} · Last updated {formatDate(d.updated_at)}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  )
}
