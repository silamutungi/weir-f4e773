import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Menu, X } from 'lucide-react'
import { Button } from './ui/button'

export default function Navbar() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(241,245,249,0.1)' }}>
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-white" aria-label="WEIR home">
          <Shield className="w-6 h-6" style={{ color: '#60a5fa' }} />
          WEIR
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link to="/pricing" className="text-sm font-medium hover:text-white transition-colors" style={{ color: 'rgba(241,245,249,0.72)' }}>Pricing</Link>
          <Link to="/login" className="text-sm font-medium hover:text-white transition-colors" style={{ color: 'rgba(241,245,249,0.72)' }}>Sign in</Link>
          <Button size="sm" onClick={() => navigate('/signup')} style={{ backgroundColor: '#1E40AF', color: '#ffffff' }} className="font-semibold">Start free</Button>
        </div>
        <button className="md:hidden flex items-center justify-center w-10 h-10 rounded" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} style={{ color: 'white' }}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden px-6 pb-6 space-y-4" style={{ backgroundColor: 'rgba(15,23,42,0.95)' }}>
          <Link to="/pricing" className="block text-sm font-medium py-2" style={{ color: 'rgba(241,245,249,0.8)' }} onClick={() => setOpen(false)}>Pricing</Link>
          <Link to="/login" className="block text-sm font-medium py-2" style={{ color: 'rgba(241,245,249,0.8)' }} onClick={() => setOpen(false)}>Sign in</Link>
          <Button className="w-full font-semibold" onClick={() => { setOpen(false); navigate('/signup') }} style={{ backgroundColor: '#1E40AF', color: '#ffffff' }}>Start free</Button>
        </div>
      )}
    </nav>
  )
}
