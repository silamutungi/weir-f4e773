import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Shield } from 'lucide-react'
import { Button } from './ui/button'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { type User } from '@supabase/supabase-js'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isSupabaseConfigured) return
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [open])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  const navLinks = [
    { to: '/features', label: 'Features' },
    { to: '/pricing', label: 'Pricing' },
  ]

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          backgroundColor: 'rgba(15,23,42,0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(241,245,249,0.1)',
        }}
      >
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-lg text-white"
            style={{ textDecoration: 'none', cursor: 'pointer' }}
            aria-label="WEIR home"
          >
            <Shield className="w-6 h-6" style={{ color: 'var(--color-info)' }} />
            WEIR
          </Link>

          {/* Desktop nav — hidden below md */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-sm font-medium hover:text-white transition-colors"
                style={{ color: 'rgba(241,245,249,0.72)' }}
              >
                {label}
              </Link>
            ))}
            {user ? (
              <>
                <Button
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                  style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}
                  className="font-semibold"
                >
                  Go to dashboard
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium hover:text-white transition-colors"
                  style={{ color: 'rgba(241,245,249,0.72)' }}
                >
                  Sign in
                </Link>
                <Button
                  size="sm"
                  onClick={() => navigate('/signup')}
                  style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}
                  className="font-semibold"
                >
                  Start free
                </Button>
              </>
            )}
          </div>

          {/* Hamburger button — visible only below md */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            style={{ color: 'white' }}
          >
            {open ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="4" x2="16" y2="16" />
                <line x1="16" y1="4" x2="4" y2="16" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="5" x2="17" y2="5" />
                <line x1="3" y1="10" x2="17" y2="10" />
                <line x1="3" y1="15" x2="17" y2="15" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Backdrop overlay */}
      <div
        className="md:hidden fixed inset-0 z-40"
        style={{
          backgroundColor: 'rgba(15,23,42,0.5)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 250ms ease',
        }}
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />

      {/* Slide-in drawer */}
      <div
        ref={drawerRef}
        className="md:hidden fixed top-0 left-0 bottom-0 z-50 w-72 flex flex-col"
        style={{
          backgroundColor: 'var(--color-bg-surface, #ffffff)',
          boxShadow: '4px 0 24px rgba(15,23,42,0.18)',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 280ms cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'transform',
        }}
        aria-hidden={!open}
      >
        {/* Drawer header */}
        <div
          className="h-16 flex items-center px-6"
          style={{ borderBottom: '1px solid var(--color-border, rgba(15,23,42,0.12))' }}
        >
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-lg"
            style={{ color: 'var(--color-text, #0f172a)', textDecoration: 'none', cursor: 'pointer' }}
            onClick={() => setOpen(false)}
            aria-label="WEIR home"
          >
            <Shield className="w-6 h-6" style={{ color: 'var(--color-info)' }} />
            WEIR
          </Link>
        </div>

        {/* Drawer nav links */}
        <nav className="flex flex-col px-4 pt-4 gap-1 flex-1">
          {navLinks.map(({ to, label }) => {
            const isActive = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className="flex items-center px-3 py-3 rounded-lg text-sm transition-colors"
                style={{
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text, #0f172a)',
                  backgroundColor: isActive ? 'rgba(var(--color-primary-rgb, 220,38,38),0.08)' : 'transparent',
                  fontWeight: isActive ? 600 : 500,
                }}
              >
                {label}
              </Link>
            )
          })}
          {user ? (
            <button
              onClick={() => { setOpen(false); navigate('/dashboard') }}
              className="flex items-center px-3 py-3 rounded-lg text-sm transition-colors text-left font-semibold"
              style={{
                color: 'var(--color-primary)',
                backgroundColor: 'rgba(var(--color-primary-rgb, 220,38,38),0.08)',
              }}
            >
              Go to dashboard
            </button>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="flex items-center px-3 py-3 rounded-lg text-sm transition-colors"
                style={{
                  color: location.pathname === '/login' ? 'var(--color-primary)' : 'var(--color-text, #0f172a)',
                  backgroundColor: location.pathname === '/login' ? 'rgba(220,38,38,0.08)' : 'transparent',
                  fontWeight: location.pathname === '/login' ? 600 : 500,
                }}
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                onClick={() => setOpen(false)}
                className="flex items-center px-3 py-3 rounded-lg text-sm transition-colors"
                style={{
                  color: location.pathname === '/signup' ? 'var(--color-primary)' : 'var(--color-text, #0f172a)',
                  backgroundColor: location.pathname === '/signup' ? 'rgba(220,38,38,0.08)' : 'transparent',
                  fontWeight: location.pathname === '/signup' ? 600 : 500,
                }}
              >
                Start free
              </Link>
            </>
          )}
        </nav>

        {/* Drawer CTA */}
        {!user && (
          <div className="px-6 pb-8">
            <Button
              className="w-full font-semibold"
              onClick={() => {
                setOpen(false)
                navigate('/signup')
              }}
              style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}
            >
              Start free
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
