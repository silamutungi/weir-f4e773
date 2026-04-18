import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Shield, Zap, DollarSign, Search, FileText, AlertTriangle } from 'lucide-react'

export default function Home() {
  const navigate = useNavigate()

  const features = [
    { icon: <Search className="w-8 h-8" />, title: 'Real-Time Detection', desc: 'Scan 200+ platforms every 6 hours. Know within the hour when your likeness appears without permission.' },
    { icon: <Zap className="w-8 h-8" />, title: 'One-Tap Actions', desc: 'Approve, monetize, or send a takedown notice in a single tap. No lawyers, no waiting.' },
    { icon: <DollarSign className="w-8 h-8" />, title: 'Earn What You Are Worth', desc: 'Monetize every approved use with per-platform CPM breakdowns. Average creator earns $2,400 in year one.' },
    { icon: <FileText className="w-8 h-8" />, title: 'License Templates', desc: 'Pre-built license agreements for Instagram, YouTube, TikTok, and editorial. Ready in 30 seconds.' },
    { icon: <AlertTriangle className="w-8 h-8" />, title: 'AI Deepfake Detection', desc: 'Flag AI-generated impersonations before they spread. The only NIL platform with synthetic media detection.' },
    { icon: <Shield className="w-8 h-8" />, title: 'Dispute Resolution', desc: 'Clear workflows, proof-of-action logs, and human support that responds within 24 hours. No black holes.' }
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <Navbar />

      <section
        className="relative min-h-[100svh] flex items-center overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1617037202148-ee39291799d7?ixid=M3w5MTM0MDN8MHwxfHNlYXJjaHwxfHxBJTIwY29uZmlkZW50JTIwY3JlYXRvciUyMHNtaWxpbmclMjB3aGlsZSUyMGNoZWNraW5nJTIwdGhlaXIlMjBwaG9uZSUyQyUyMHN1cnJ8ZW58MHwwfHx8MTc3NjUzNjkwNnww&ixlib=rb-4.1.0&w=1920&h=1080&fit=crop&crop=center&q=80&auto=format)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.35) 100%)' }} />
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-32">
          <Badge className="mb-6 text-sm font-semibold px-4 py-2" style={{ backgroundColor: 'rgba(59,130,246,0.25)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.4)' }}>
            Now detecting AI deepfakes
          </Badge>
          <h1 className="font-bold text-white mb-6" style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', lineHeight: '1.1', letterSpacing: '-0.02em', maxWidth: '720px' }}>
            Your likeness earns money every time it appears online.
          </h1>
          <p className="text-lg mb-10 max-w-xl" style={{ color: 'rgba(255,255,255,0.82)', lineHeight: '1.6' }}>
            WEIR detects unauthorized use of your name, image, and likeness in real time — then gives you one tap to take action, demand payment, or send a takedown.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="text-base font-semibold min-h-[52px] px-8" onClick={() => navigate('/signup')} style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}>
              Start free
            </Button>
            <Button size="lg" variant="outline" className="text-base font-semibold min-h-[52px] px-8 text-white border-white/40 hover:bg-gray-900/10" onClick={() => navigate('/pricing')}>
              See pricing
            </Button>
          </div>
          <p className="mt-6 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>No credit card required. Free plan covers 50 scans/month.</p>
        </div>
      </section>

      <section className="py-20 md:py-32" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-text)', letterSpacing: '-0.02em' }}>Everything you need to protect and monetize your likeness</h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem' }}>Built for athletes, influencers, musicians, and anyone whose face or name drives commercial value.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card-hover rounded-xl p-6 border" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
                <div className="mb-4" style={{ color: 'var(--color-primary)' }}>{f.icon}</div>
                <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--color-text)' }}>{f.title}</h3>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6', fontSize: '0.9375rem' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28" style={{ backgroundColor: 'var(--color-bg-surface)' }}>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-text)', letterSpacing: '-0.02em' }}>Stop losing money to unauthorized use</h2>
          <p className="text-lg mb-12 max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>Creators using WEIR recover an average of $2,400 in the first year and save 14 hours of manual monitoring per month.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { stat: '$2,400', label: 'Average first-year recovery' },
              { stat: '14 hrs', label: 'Saved per month on monitoring' },
              { stat: '94%', label: 'Takedown success rate' }
            ].map((s) => (
              <div key={s.label}>
                <div className="text-4xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>{s.stat}</div>
                <div style={{ color: 'var(--color-text-secondary)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 md:py-32" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-text)', letterSpacing: '-0.02em' }}>Simple, honest pricing</h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem' }}>No hidden charges. Cancel anytime. We show exactly what you pay and why.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Free', price: '$0', period: '/month', features: ['50 scans/month', '3 platform monitors', 'Email takedown notices', 'Community support'], cta: 'Start free', highlight: false },
              { name: 'Pro', price: '$29', period: '/month', features: ['Unlimited scans', '50+ platforms', 'AI deepfake detection', 'License templates', 'CPM earnings dashboard', 'Priority support 24hr'], cta: 'Start free trial', highlight: true },
              { name: 'Enterprise', price: '$99', period: '/month', features: ['Everything in Pro', 'Team seats (5)', 'API access', 'Custom license terms', 'Dedicated account manager', 'SLA guarantee'], cta: 'Contact sales', highlight: false }
            ].map((plan) => (
              <div key={plan.name} className={`rounded-xl p-8 border ${plan.highlight ? 'ring-2' : ''}`} style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: plan.highlight ? 'var(--color-primary)' : 'var(--color-border)', ...(plan.highlight ? { ringColor: 'var(--color-primary)' } : {}) }}>
                {plan.highlight && <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>Most Popular</div>}
                <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>{plan.name}</h3>
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
        </div>
      </section>

      <Footer />
    </div>
  )
}
