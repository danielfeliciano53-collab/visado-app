import Link from 'next/link'
import Image from 'next/image'

const NAVY = '#1B2F6E'
const NAVY_DARK = '#111E47'
const NAVY_LIGHT = '#E8ECF7'
const GOLD = '#C9942A'
const GOLD_LIGHT = '#FBF3E2'
const OFF_WHITE = '#F9F7F4'
const DARK = '#111510'
const MUTED = '#6B7280'
const BORDER = '#E5E7EB'

export default function PricingPage() {
  return (
    <div style={{ minHeight: '100vh', background: OFF_WHITE, fontFamily: 'Georgia, serif' }}>

      {/* NAV */}
      <nav style={{ background: 'rgba(249,247,244,0.95)', borderBottom: `1px solid ${BORDER}`, padding: '0 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 20, fontWeight: 700, color: NAVY_DARK, textDecoration: 'none' }}>
            <Image src="/visado-logo.png" alt="Visado" width={28} height={28} style={{ borderRadius: 6 }} />
            Visado
          </Link>
          <Link href="/login" style={{ fontSize: 14, fontWeight: 600, color: '#fff', background: NAVY_DARK, padding: '8px 18px', borderRadius: 8, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif" }}>
            Log In
          </Link>
        </div>
      </nav>

      {/* PRICING */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: GOLD, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 12 }}>Pricing</div>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, letterSpacing: '-1px', margin: '0 0 16px', color: DARK }}>Start free. Upgrade when you're ready.</h1>
            <p style={{ fontSize: 16, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", margin: 0 }}>Use code <strong style={{ color: NAVY_DARK }}>BETA2026</strong> for your first month free.</p>
          </div>

          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'center' }}>

            {/* Free */}
            <div style={{ flex: '1 1 280px', maxWidth: 380, background: '#fff', borderRadius: 16, padding: 32, border: `1px solid ${BORDER}` }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 8 }}>Free</div>
              <div style={{ fontSize: 48, fontWeight: 700, color: DARK, letterSpacing: '-2px', marginBottom: 4 }}>$0<span style={{ fontSize: 18, fontWeight: 400, color: MUTED }}>/mo</span></div>
              <div style={{ fontSize: 14, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 24 }}>Get your bearings</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                {['D7 visa checklist', 'Document list', 'Country overview', 'Basic guidance'].map((f, i) => (
                  <div key={i} style={{ fontSize: 14, color: DARK, fontFamily: "'Helvetica Neue', sans-serif", display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: GOLD, fontWeight: 700 }}>✓</span>{f}
                  </div>
                ))}
              </div>
              <Link href="/login" style={{ display: 'block', textAlign: 'center', padding: '13px', borderRadius: 10, border: `2px solid ${NAVY_DARK}`, color: NAVY_DARK, fontWeight: 600, fontSize: 15, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif" }}>
                Get started free
              </Link>
            </div>

            {/* Pro */}
            <div style={{ flex: '1 1 280px', maxWidth: 380, background: NAVY_DARK, borderRadius: 16, padding: 32, position: 'relative' }}>
              <div style={{ position: 'absolute', top: -12, left: 32, fontSize: 11, fontWeight: 700, color: NAVY_DARK, background: GOLD_LIGHT, padding: '3px 10px', borderRadius: 20, fontFamily: "'Helvetica Neue', sans-serif" }}>Most popular</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)', fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 8 }}>Pro</div>
              <div style={{ fontSize: 48, fontWeight: 700, color: '#fff', letterSpacing: '-2px', marginBottom: 4 }}>$19<span style={{ fontSize: 18, fontWeight: 400, color: 'rgba(255,255,255,0.6)' }}>/mo</span></div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 24 }}>Everything you need</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                {['Everything in Free', 'Joao or Andreia AI guide', 'Secure document vault', 'Adaptive pacing + tone', 'Phase-by-phase journey', 'Weekly updated info', 'Priority support'].map((f, i) => (
                  <div key={i} style={{ fontSize: 14, color: NAVY_LIGHT, fontFamily: "'Helvetica Neue', sans-serif", display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: GOLD, fontWeight: 700 }}>✓</span>{f}
                  </div>
                ))}
              </div>
              <Link href="/login" style={{ display: 'block', textAlign: 'center', padding: '13px', borderRadius: 10, background: GOLD, color: NAVY_DARK, fontWeight: 700, fontSize: 15, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif" }}>
                Start with Pro →
              </Link>
              <div style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: "'Helvetica Neue', sans-serif", marginTop: 10 }}>Cancel anytime</div>
            </div>
          </div>

          {/* FAQ */}
          <div style={{ marginTop: 64, maxWidth: 640, margin: '64px auto 0' }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: DARK, marginBottom: 32, textAlign: 'center' }}>Common questions</h2>
            {[
              { q: 'What does the free plan include?', a: 'The free plan gives you access to the D7 visa checklist, document list, and basic country overview. It\'s a great way to get oriented before committing.' },
              { q: 'Can I cancel anytime?', a: 'Yes — cancel from your Account page at any time. You\'ll keep Pro access until the end of your billing period.' },
              { q: 'Is BETA2026 really 100% off?', a: 'Yes. During beta, use code BETA2026 at checkout for your first month completely free. No catch.' },
              { q: 'Is my data secure?', a: 'Your documents are stored encrypted in a private vault. We never share your information with third parties. See our Privacy Policy for full details.' },
              { q: 'What visa types do you support?', a: 'Currently D7 Passive Income Visa and D8 Digital Nomad Visa. Golden Visa guidance coming soon.' },
            ].map((item, i) => (
              <div key={i} style={{ borderBottom: `1px solid ${BORDER}`, padding: '20px 0' }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: DARK, marginBottom: 8 }}>{item.q}</div>
                <div style={{ fontSize: 15, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", lineHeight: 1.6 }}>{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${BORDER}`, padding: '32px 24px', marginTop: 40 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 16, fontWeight: 700, color: NAVY_DARK, textDecoration: 'none' }}>
            <Image src="/visado-logo.png" alt="Visado" width={20} height={20} style={{ borderRadius: 4 }} />
            Visado
          </Link>
          <div style={{ fontSize: 12, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif" }}>Not legal advice. For complex situations, consult an immigration attorney.</div>
        </div>
      </footer>
    </div>
  )
}
