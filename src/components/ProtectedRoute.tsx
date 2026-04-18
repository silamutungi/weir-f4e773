import { useEffect, useState } from 'react'
import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { Loader2 } from 'lucide-react'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const [checking, setChecking] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAuthenticated(true)
      setChecking(false)
      return
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthenticated(!!session)
      setChecking(false)
    })
  }, [])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--color-primary)' }} />
      </div>
    )
  }

  return authenticated ? <>{children}</> : <Navigate to="/login" replace />
}
