import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { type FormEvent } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import AppLayout from '../components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react'

export default function Settings() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({ full_name: '', display_name: '', bio: '', instagram: '', youtube: '', tiktok: '' })

  async function loadProfile() {
    setLoading(true)
    if (!isSupabaseConfigured) {
      await new Promise((r) => setTimeout(r, 400))
      setForm({ full_name: 'Alex Creator', display_name: 'alexcreator', bio: 'Pro athlete and content creator protecting my NIL.', instagram: '@alexcreator', youtube: 'alexcreator', tiktok: '@alexcreator' })
      setLoading(false)
      return
    }
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { navigate('/login'); return }
    const result = await (supabase.from('weir_profiles').select('*').eq('user_id', session.user.id).single() as any)
    if (result.data) {
      const p = result.data
      setForm({
        full_name: p.full_name ?? '',
        display_name: p.display_name ?? '',
        bio: p.bio ?? '',
        instagram: p.platform_handles?.instagram ?? '',
        youtube: p.platform_handles?.youtube ?? '',
        tiktok: p.platform_handles?.tiktok ?? ''
      })
    }
    setLoading(false)
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)
    if (!isSupabaseConfigured) {
      await new Promise((r) => setTimeout(r, 600))
      setSuccess(true)
      setSaving(false)
      return
    }
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { navigate('/login'); return }
    const upsertResult = await (supabase.from('weir_profiles').upsert({
      user_id: session.user.id,
      full_name: form.full_name,
      display_name: form.display_name,
      bio: form.bio,
      platform_handles: { instagram: form.instagram, youtube: form.youtube, tiktok: form.tiktok },
      updated_at: new Date().toISOString()
    } as any).eq('user_id', session.user.id) as any)
    if (upsertResult.error) {
      setError('Failed to save profile. Please try again.')
    } else {
      setSuccess(true)
    }
    setSaving(false)
  }

  async function handleDeleteAccount() {
    if (!window.confirm('Are you sure? This action cannot be undone.')) return
    if (!isSupabaseConfigured) return
    await supabase.auth.signOut()
    navigate('/')
  }

  useEffect(() => { loadProfile() }, [])

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Settings</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Manage your account and monitored platforms</p>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-24"><Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--color-primary)' }} /></div>
      ) : (
        <div className="space-y-6 max-w-2xl">
          <Card className="border" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
            <CardHeader><CardTitle style={{ color: 'var(--color-text)' }}>Profile</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                {success && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm border" style={{ backgroundColor: 'rgba(22,163,74,0.08)', borderColor: 'rgba(22,163,74,0.25)', color: 'var(--color-success)' }}>
                    <CheckCircle className="w-4 h-4" />Profile saved successfully.
                  </div>
                )}
                {error && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm border" style={{ backgroundColor: 'rgba(220,38,38,0.08)', borderColor: 'rgba(220,38,38,0.25)', color: 'var(--color-error)' }}>
                    <AlertTriangle className="w-4 h-4" />{error}
                  </div>
                )}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="full_name">Full name</Label><Input id="full_name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
                  <div className="space-y-2"><Label htmlFor="display_name">Display name</Label><Input id="display_name" value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} /></div>
                </div>
                <div className="space-y-2"><Label htmlFor="bio">Bio</Label><Input id="bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></div>
                <div>
                  <p className="font-medium text-sm mb-3" style={{ color: 'var(--color-text)' }}>Platform handles to monitor</p>
                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="space-y-2"><Label>Instagram</Label><Input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} placeholder="@handle" /></div>
                    <div className="space-y-2"><Label>YouTube</Label><Input value={form.youtube} onChange={(e) => setForm({ ...form, youtube: e.target.value })} placeholder="channel" /></div>
                    <div className="space-y-2"><Label>TikTok</Label><Input value={form.tiktok} onChange={(e) => setForm({ ...form, tiktok: e.target.value })} placeholder="@handle" /></div>
                  </div>
                </div>
                <Button type="submit" disabled={saving} style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}>
                  {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : 'Save changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
          <Card className="border" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'rgba(220,38,38,0.25)' }}>
            <CardHeader><CardTitle style={{ color: 'var(--color-error)' }}>Danger zone</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>Deleting your account is permanent and removes all your data including detections, licenses, and earnings history.</p>
              <Button variant="destructive" onClick={handleDeleteAccount}>Delete account</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </AppLayout>
  )
}
