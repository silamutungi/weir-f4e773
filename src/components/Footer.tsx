import { Link } from 'react-router-dom'
import { Shield } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t py-12" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg mb-2" style={{ color: 'var(--color-text)' }}>
              <Shield className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
              WEIR
            </div>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Protect your name, image, and likeness online.</p>
          </div>
          <div className="flex flex-wrap gap-6 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            <Link to="/pricing" className="hover:underline">Pricing</Link>
            <Link to="/login" className="hover:underline">Sign in</Link>
            <Link to="/signup" className="hover:underline">Sign up</Link>
            <Link to="/support" className="hover:underline">Support</Link>
            <Link to="/disputes" className="hover:underline">Disputes</Link>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t flex flex-col md:flex-row items-start md:items-center justify-between gap-2" style={{ borderColor: 'var(--color-border)' }}>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>&copy; {new Date().getFullYear()} WEIR. All rights reserved.</p>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Billing questions? Email <a href="mailto:billing@weir.app" className="underline">billing@weir.app</a> — we respond within 1 business day.</p>
        </div>
      </div>
    </footer>
  )
}
