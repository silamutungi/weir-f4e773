import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Button } from '../components/ui/button'
import { Shield } from 'lucide-react'

const plans = [
  {
    name: 'Free', price: '$0', period: '/month', highlight: false,
    features: ['50 scans/month', '3 platform monitors', 'Email takedown notices', 'Community support'],
    cta: 'Start free'
  },
  {
    name: 'Pro', price: '$29', period: '/month', highlight: true,
    features: ['Unlimited scans', '50+ platforms', 'AI deepfake detection', 'License templates', 'CPM earnings dashboard', 'Priority human support (24hr SLA)'],
    cta: 'Start free trial'
  },
  {
    name: 'Enterprise', price: '$99', period: '/month', highlight: false,
    features: ['Everything in Pro', 'Team seats (5)', 'API access', 'Custom license terms', 'Dedicated account manager', 'Guaranteed SLA'],
    cta: 'Contact sales'
  }
]

const faqs = [
  { q: 'How does billing work?', a: 'You are billed on the same day each month. We email you 7 days before renewal. Cancel any time from Settings — no questions asked, effective immediately.' },
  { q: 'What counts as a scan?', a: 'Each platform search for your likeness across image, video, and text counts as one scan. Free plan covers 50 scans per month reset on your billing date.' },
  { q: 'How does the takedown process work?', a: 'We generate a DMCA or NIL cease-and-desist notice pre-filled with your details. You review, sign electronically, and we file it. You receive proof of filing within 24 hours.' },
  { q: 'What is the AI deepfake detection?', a: 'Our model detects synthetic media trained on or resembling your face. If a deepfake is found, it is flagged as high-priority and escalated to our legal team immediately.' },
  { q: 'Can I dispute a charge?', a: 'Yes. Email disputes@weir.app with your invoice number. We resolve all disputes within 5 business days and issue refunds where applicable. No exceptions, no runarounds.' }
]

export default function Pricing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-20 md:py-32">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-text)', letterSpacing: '-0.02em' }}>Simple, honest pricing</h1>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>No hidden recurring charges. No opaque cancellation. Every tier shows exactly what you pay and why.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-24">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl p-8 border ${plan.highlight ? 'ring-2 ring-blue-600' : ''}`}
              style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: plan.highlight ? 'var(--color-primary)' : 'var(--color-border)' }}
            >
              {plan.highlight && <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>Most Popular</div>}
              <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>{plan.name}</h2>
              <div className="mb-6">
                <span className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>{plan.price}</span>
                <span style={{ color: 'var(--color-text-muted)' }}>{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    <Shield className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-success)' }} />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full font-semibold"
                variant={plan.highlight ? 'default' : 'outline'}
                onClick={() => navigate('/signup')}
                style={plan.highlight ? { backgroundColor: 'var(--color-primary)', color: '#ffffff' } : {}}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-8" style={{ color: 'var(--color-text)' }}>Frequently asked questions</h2>
          <div className="space-y-6">
            {faqs.map((f) => (
              <div key={f.q} className="border-b pb-6" style={{ borderColor: 'var(--color-border)' }}>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--color-text)' }}>{f.q}</h3>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)', lineHeight: '1.7' }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
