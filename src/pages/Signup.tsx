import { useState } from 'react'
import { type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Shield, Loader2, CheckCircle } from 'lucide-react'
import Navbar from '../components/Navbar'

export default function Signup() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!isSupabaseConfigured) {
      navigate('/dashboard')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    setError(null)
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    })
    setLoading(false)
    if (authError) {
      setError(authError.message)
      return
    }
    setSuccess(true)
  }

  if (success) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--color-bg)', paddingTop: '4rem' }}>
          <div className="text-center max-w-sm">
            <CheckCircle className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-success)' }} />
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Check your email</h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.</p>
            <Button className="mt-6" onClick={() => navigate('/login')} style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}>Back to sign in</Button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--color-bg)', paddingTop: '4rem' }}>
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4" style={{ backgroundColor: 'var(--color-primary)' }}>
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Protect your likeness</h1>
            <p className="mt-2" style={{ color: 'var(--color-text-secondary)' }}>Free plan. No credit card required.</p>
          </div>
          <div className="rounded-xl border p-8" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm border" style={{ backgroundColor: 'rgba(220,38,38,0.08)', borderColor: 'rgba(220,38,38,0.25)', color: 'var(--color-error)' }}>
                  <Shield className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" />
              </div>
              <Button type="submit" className="w-full font-semibold" disabled={loading} style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}>
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating account...</> : 'Start free'}
              </Button>
              <p className="text-xs text-center" style={{ color: 'var(--color-text-muted)' }}>By signing up you agree to our Terms of Service and Privacy Policy.</p>
            </form>
            <p className="mt-6 text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Already have an account?{' '}
              <Link to="/login" className="font-semibold hover:underline" style={{ color: 'var(--color-primary)' }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
