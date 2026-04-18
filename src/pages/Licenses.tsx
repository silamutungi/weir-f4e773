import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { type FormEvent } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { type License } from '../types'
import AppLayout from '../components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { FileText, Loader2, Plus, Trash2 } from 'lucide-react'
import { formatCurrency, formatDate } from '../lib/utils'

const SEED: License[] = [
  { id: '1', user_id: 'demo', name: 'Instagram Editorial', platform: 'Instagram', usage_type: 'Editorial', price_usd: 500, duration_days: 30, terms: 'Single use, editorial only. No commercial redistribution.', active: true, created_at: new Date().toISOString(), deleted_at: null },
  { id: '2', user_id: 'demo', name: 'YouTube Brand Integration', platform: 'YouTube', usage_type: 'Commercial', price_usd: 2500, duration_days: 90, terms: 'One video, one brand, no exclusivity. Full credits required.', active: true, created_at: new Date().toISOString(), deleted_at: null },
  { id: '3', user_id: 'demo', name: 'TikTok Viral License', platform: 'TikTok', usage_type: 'Commercial', price_usd: 800, duration_days: 14, terms: 'Short-form content only. Must link to original source.', active: false, created_at: new Date().toISOString(), deleted_at: null }
]

export default function Licenses() {
  const navigate = useNavigate()
  const [licenses, setLicenses] = useState<License[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', platform: '', usage_type: '', price_usd: '', duration_days: '', terms: '' })

  async function load() {
    setLoading(true)
    setError(null)
    if (!isSupabaseConfigured) {
      await new Promise((r) => setTimeout(r, 400))
      setLicenses(SEED)
      setLoading(false)
      return
    }
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { navigate('/login'); return }
      const result = await (supabase.from('weir_licenses').select('*').eq('user_id', session.user.id).is('deleted_at', null).order('created_at', { ascending: false }) as any)
      if (result.error) throw new Error(result.error.message)
      setLicenses(result.data ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load licenses')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    if (!isSupabaseConfigured) {
      const newLicense: License = { id: Date.now().toString(), user_id: 'demo', name: form.name, platform: form.platform, usage_type: form.usage_type, price_usd: parseFloat(form.price_usd), duration_days: parseInt(form.duration_days), terms: form.terms, active: true, created_at: new Date().toISOString(), deleted_at: null }
      setLicenses((prev) => [newLicense, ...prev])
      setForm({ name: '', platform: '', usage_type: '', price_usd: '', duration_days: '', terms: '' })
      setShowForm(false)
      setSaving(false)
      return
    }
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { navigate('/login'); return }
    await (supabase.from('weir_licenses').insert({ user_id: session.user.id, name: form.name, platform: form.platform, usage_type: form.usage_type, price_usd: parseFloat(form.price_usd), duration_days: parseInt(form.duration_days), terms: form.terms, active: true } as any) as any)
    setForm({ name: '', platform: '', usage_type: '', price_usd: '', duration_days: '', terms: '' })
    setShowForm(false)
    setSaving(false)
    load()
  }

  async function deleteLicense(id: string) {
    if (!isSupabaseConfigured) {
      setLicenses((prev) => prev.filter((l) => l.id !== id))
      return
    }
    await (supabase.from('weir_licenses').update({ deleted_at: new Date().toISOString() } as any).eq('id', id) as any)
    setLicenses((prev) => prev.filter((l) => l.id !== id))
  }

  useEffect(() => { load() }, [])

  return (
    <AppLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Licenses</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Set your terms and pricing for authorized use</p>
        </div>
        <Button onClick={() => setShowForm(true)} style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}>
          <Plus className="w-4 h-4 mr-2" />New license
        </Button>
      </div>
      {showForm && (
        <Card className="mb-6 border" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
          <CardHeader><CardTitle style={{ color: 'var(--color-text)' }}>Create license template</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>License name</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Instagram Editorial" /></div>
              <div className="space-y-2"><Label>Platform</Label><Input required value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} placeholder="e.g. Instagram" /></div>
              <div className="space-y-2"><Label>Usage type</Label><Input required value={form.usage_type} onChange={(e) => setForm({ ...form, usage_type: e.target.value })} placeholder="e.g. Commercial" /></div>
              <div className="space-y-2"><Label>Price (USD)</Label><Input required type="number" min="0" step="0.01" value={form.price_usd} onChange={(e) => setForm({ ...form, price_usd: e.target.value })} placeholder="500" /></div>
              <div className="space-y-2"><Label>Duration (days)</Label><Input required type="number" min="1" value={form.duration_days} onChange={(e) => setForm({ ...form, duration_days: e.target.value })} placeholder="30" /></div>
              <div className="space-y-2 md:col-span-2"><Label>Terms</Label><Input required value={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.value })} placeholder="Single use, editorial only..." /></div>
              <div className="md:col-span-2 flex gap-3">
                <Button type="submit" disabled={saving} style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}>{saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : 'Create license'}</Button>
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
          ) : licenses.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-border)' }} />
              <p className="font-medium mb-2" style={{ color: 'var(--color-text)' }}>No licenses yet</p>
              <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>Create a license template to start monetizing approved uses.</p>
              <Button onClick={() => setShowForm(true)} style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}>Create your first license</Button>
            </div>
          ) : (
            <div className="space-y-3">
              {licenses.map((l) => (
                <div key={l.id} className="rounded-lg border p-4 flex items-center justify-between gap-4" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>{l.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: l.active ? 'rgba(22,163,74,0.12)' : 'rgba(15,23,42,0.08)', color: l.active ? 'var(--color-success)' : 'var(--color-text-muted)' }}>{l.active ? 'Active' : 'Inactive'}</span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{l.platform} · {l.usage_type} · {formatCurrency(l.price_usd)} · {l.duration_days} days · Created {formatDate(l.created_at)}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>{l.terms}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => deleteLicense(l.id)} aria-label="Delete license" className="w-8 h-8 p-0 flex-shrink-0">
                    <Trash2 className="w-4 h-4" style={{ color: 'var(--color-error)' }} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  )
}
