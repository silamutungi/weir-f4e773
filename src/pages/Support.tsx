import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Support() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}>
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-6 py-20 w-full">
        <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>Support</h1>
        <p className="text-lg mb-8" style={{ color: 'var(--color-text-muted)' }}>We're here to help. Browse common topics below or reach out directly.</p>

        <div className="space-y-6">
          <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Getting Started</h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>Learn how to set up your WEIR account, add your identity assets, and start monitoring for unauthorized uses of your name, image, or likeness.</p>
          </div>

          <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Managing Detections</h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>Understand how WEIR identifies content matches across platforms and how to take action — take down, monetize, or approve with a single tap.</p>
          </div>

          <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Licenses & Earnings</h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>Set up license templates, configure monetization controls per platform, and track your earnings with our per-platform CPM dashboard.</p>
          </div>

          <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Contact Us</h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>Can't find what you need? Email us at{' '}
              <a href="mailto:support@weir.app" className="underline" style={{ color: 'var(--color-primary)' }}>support@weir.app</a>
              {' '}and we'll respond within one business day.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <Link to="/" className="text-sm underline" style={{ color: 'var(--color-text-muted)' }}>← Back to Home</Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
