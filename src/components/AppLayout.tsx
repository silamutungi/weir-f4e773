import { useState } from 'react'
import { type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { Shield, LogOut, Menu, X, LayoutDashboard, Search, FileText, DollarSign, AlertTriangle, Settings } from 'lucide-react'

import { Button } from './ui/button'

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/detections', label: 'Detections', icon: Search },
  { path: '/licenses', label: 'Licenses', icon: FileText },
  { path: '/earnings', label: 'Earnings', icon: DollarSign },
  { path: '/disputes', label: 'Disputes', icon: AlertTriangle },
  { path: '/settings', label: 'Settings', icon: Settings }
]

export default function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    if (isSupabaseConfigured) await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--color-bg)' }}>
      <aside className="hidden md:flex flex-col w-60 flex-shrink-0 border-r" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
        <div className="h-16 flex items-center px-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <Link to="/" className="flex items-center gap-2 font-bold text-lg" style={{ color: 'var(--color-text)', textDecoration: 'none' }}>
            <Shield className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
            WEIR
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path
            return (
              <Link
                key={path}
                to={path}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: active ? 'rgba(30,64,175,0.1)' : 'transparent',
                  color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)'
                }}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <Button variant="ghost" className="w-full justify-start gap-3 text-sm" onClick={handleLogout} style={{ color: 'var(--color-text-secondary)' }}>
            <LogOut className="w-4 h-4" />Sign out
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden h-14 flex items-center justify-between px-4 border-b" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
          <Link to="/" className="flex items-center gap-2 font-bold" style={{ color: 'var(--color-text)', textDecoration: 'none' }}>
            <Shield className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
            WEIR
          </Link>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="w-10 h-10 flex items-center justify-center rounded" aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'} style={{ color: 'var(--color-text)' }}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>
        {mobileOpen && (
          <div className="md:hidden border-b" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
            <nav className="p-3 space-y-1">
              {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
                <Link key={path} to={path} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium" style={{ color: location.pathname === path ? 'var(--color-primary)' : 'var(--color-text-secondary)', backgroundColor: location.pathname === path ? 'rgba(30,64,175,0.1)' : 'transparent' }} onClick={() => setMobileOpen(false)}>
                  <Icon className="w-4 h-4" />{label}
                </Link>
              ))}
              <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full" style={{ color: 'var(--color-text-secondary)' }} onClick={handleLogout}>
                <LogOut className="w-4 h-4" />Sign out
              </button>
            </nav>
          </div>
        )}
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
