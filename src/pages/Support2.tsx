import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Support2() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}>
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-6 py-20 w-full">
        <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>Disputes</h1>
        <p className="text-lg mb-8" style={{ color: 'var(--color-text-muted)' }}>Found unauthorized use of your identity in an ad or campaign? We'll help you resolve it.</p>

        <div className="space-y-6">
          <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>How Disputes Work</h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>When WEIR detects unauthorized commercial use of your name, image, or likeness, you can open a formal dispute directly from your detections dashboard. Our team reviews the case and coordinates with the platform or advertiser on your behalf.</p>
          </div>

          <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Unauthorized Ad Usage</h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>If your likeness appears in paid advertising without your consent, you may be entitled to compensation or takedown. WEIR documents the evidence and initiates the dispute process automatically.</p>
          </div>

          <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Resolution Timelines</h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>Most platform takedowns are processed within 3–5 business days. Monetization disputes and ad revenue claims may take up to 30 days depending on platform policies.</p>
          </div>

          <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Open a Dispute</h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>To open a dispute manually, email{' '}
              <a href="mailto:disputes@weir.app" className="underline" style={{ color: 'var(--color-primary)' }}>disputes@weir.app</a>
              {' '}with a description of the unauthorized use and any supporting links or screenshots.
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
