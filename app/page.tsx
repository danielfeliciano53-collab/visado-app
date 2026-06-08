import Link from 'next/link'

const GREEN = '#1D9E75'
const GREEN_DARK = '#0F6E56'
const GREEN_LIGHT = '#E1F5EE'
const OFF_WHITE = '#F9F7F4'
const DARK = '#111510'
const MUTED = '#6B7280'
const BORDER = '#E5E7EB'

export default function HomePage() {
  return (
    <div style={{ fontFamily: 'Georgia, serif', background: OFF_WHITE, color: DARK }}>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, background: 'rgba(249,247,244,0.95)', borderBottom: `1px solid ${BORDER}`, zIndex: 100, padding: '0 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 20, fontWeight: 700, letterSpacing: '-0.5px', color: GREEN_DARK }}>
            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: GREEN }} />
            Visado
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <a href="#how" style={{ fontSize: 14, color: MUTED, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif" }}>How it works</a>
              <a href="#pricing" style={{ fontSize: 14, color: MUTED, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif" }}>Pricing</a>
              <Link href="/login" style={{ fontSize: 14, fontWeight: 600, color: '#fff', background: GREEN_DARK, padding: '8px 18px', borderRadius: 8, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif" }}>Log In</Link>
            </div>
        </div>
      </nav>
      <div style={{ height: 64 }} />

      {/* HERO */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px', display: 'flex', alignItems: 'center', gap: 60, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 400px' }}>
          <div style={{ display: 'inline-block', fontSize: 13, fontFamily: "'Helvetica Neue', sans-serif", color: GREEN_DARK, background: GREEN_LIGHT, padding: '4px 12px', borderRadius: 20, marginBottom: 24, border: `1px solid rgba(29,158,117,0.3)` }}>
            🇵🇹 Built by someone who did it
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-1.5px', margin: '0 0 20px', color: DARK }}>
            Your move to Portugal,<br />
            <span style={{ color: GREEN }}>without the chaos.</span>
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.7, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", margin: '0 0 32px', maxWidth: 480 }}>
            Visado is an AI immigration guide built from real experience. Every document, every deadline, every bureaucratic curveball — organized, explained, and handled.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
            <Link href="/login" style={{ fontSize: 16, fontWeight: 600, color: '#fff', background: GREEN_DARK, padding: '14px 28px', borderRadius: 10, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif", display: 'inline-block' }}>
              Start your journey →
            </Link>
            <a href="#how" style={{ fontSize: 16, color: MUTED, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif", display: 'inline-flex', alignItems: 'center', padding: '14px 0' }}>
              See how it works
            </a>
          </div>
          <p style={{ fontSize: 13, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif" }}>Free to start · No credit card required</p>
        </div>

        {/* Hero card */}
        <div style={{ flex: '1 1 320px', background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 4px 40px rgba(0,0,0,0.08)', border: `1px solid ${BORDER}`, maxWidth: 420 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: GREEN, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, fontFamily: "'Helvetica Neue', sans-serif", flexShrink: 0 }}>J</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: DARK, fontFamily: "'Helvetica Neue', sans-serif" }}>Joao · Visado guide</div>
              <div style={{ fontSize: 11, color: GREEN, fontFamily: "'Helvetica Neue', sans-serif" }}>● Online</div>
            </div>
            <div style={{ marginLeft: 'auto', fontSize: 10, padding: '2px 8px', borderRadius: 20, background: GREEN_LIGHT, color: GREEN_DARK, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600 }}>Direct mode</div>
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.6, color: DARK, background: '#F9F9F9', padding: '12px 14px', borderRadius: 10, marginBottom: 14, fontFamily: "'Helvetica Neue', sans-serif" }}>
            Your NIF is the next critical step. Without it, you cannot open a Portuguese bank account, sign a lease, or submit your D7 application.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
            {['Valid passport', 'Proof of US address', 'Simple form at office'].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: DARK, fontFamily: "'Helvetica Neue', sans-serif" }}>
                <span style={{ color: GREEN, fontWeight: 700 }}>✓</span>{item}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 13, color: GREEN_DARK, fontStyle: 'italic', fontFamily: "'Helvetica Neue', sans-serif", borderTop: `1px solid ${BORDER}`, paddingTop: 12 }}>
            Want me to walk you through where to go?
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section style={{ background: GREEN_DARK, padding: '32px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 20 }}>Trusted by Americans making the move</p>
          <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[['D7 visa', 'flagship route'], ['32 steps', 'fully guided'], ['5 min', 'to get started'], ['AES-256', 'vault security']].map(([val, label], i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>{val}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontFamily: "'Helvetica Neue', sans-serif", marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ padding: '60px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: GREEN, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 12 }}>How it works</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, letterSpacing: '-1px', margin: '0 0 48px', color: DARK }}>From overwhelmed to on your way</h2>
          <div>
            {[
              { num: '01', title: 'Tell us about yourself', desc: "A quick 4-step survey. We learn who you are, where you're going, and how you like to communicate. Then we match you with Joao or Andreia — your personal guide." },
              { num: '02', title: 'Get your personalized roadmap', desc: 'Your D7 checklist, document list, and timeline — built around your situation. Couples, families, solo movers. We know the difference.' },
              { num: '03', title: 'Upload once, use everywhere', desc: 'Your passport goes into your secure vault once. Every time a step needs it, your guide already has it. No hunting. No reprinting.' },
              { num: '04', title: 'Ask anything, get real answers', desc: 'Not vague AI responses. Real guidance from someone who lived the process — NIF, AIMA, NHR, banking, housing. Joao and Andreia know it all.' },
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 32, padding: '32px 0', borderBottom: `1px solid ${BORDER}` }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(0,0,0,0.15)', fontFamily: "'Helvetica Neue', sans-serif", flexShrink: 0, paddingTop: 4, width: 28 }}>{step.num}</div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: DARK, marginBottom: 8 }}>{step.title}</div>
                  <div style={{ fontSize: 15, lineHeight: 1.7, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif" }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '60px 24px', background: OFF_WHITE }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: GREEN, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 12 }}>What's included</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, letterSpacing: '-1px', margin: '0 0 48px', color: DARK }}>Everything you need. Nothing you don't.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {[
              { icon: '🤖', title: 'AI guide that adapts to you', desc: 'Joao or Andreia learns your pace and communication style. Detailed or direct — your call.' },
              { icon: '🔐', title: 'Secure document vault', desc: 'Passport, NIF, medical records. Encrypted. Upload once, referenced forever.' },
              { icon: '📋', title: '32-step journey checklist', desc: 'From your first document to your residency card. Every step, in the right order.' },
              { icon: '⏰', title: 'Deadline tracking', desc: 'AIMA appointments, visa expiry, insurance renewal. Never miss a date.' },
              { icon: '🏛️', title: 'Real insider knowledge', desc: 'The ticket machine at AIMA. The Coimbra vs Faro difference. The things no government website tells you.' },
              { icon: '🔄', title: 'Weekly updated info', desc: 'Portuguese government sites monitored weekly. Your guide always has current information.' },
            ].map((f, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 12, padding: '28px 24px', border: `1px solid ${BORDER}` }}>
                <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: DARK, marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 14, lineHeight: 1.65, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif" }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: '60px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: GREEN, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 12 }}>Pricing</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, letterSpacing: '-1px', margin: '0 0 48px', color: DARK }}>Start free. Upgrade when you're ready.</h2>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            {/* Free */}
            <div style={{ flex: '1 1 280px', background: OFF_WHITE, borderRadius: 16, padding: 32, border: `1px solid ${BORDER}` }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 8 }}>Free</div>
              <div style={{ fontSize: 48, fontWeight: 700, color: DARK, letterSpacing: '-2px', marginBottom: 4 }}>$0<span style={{ fontSize: 18, fontWeight: 400, color: MUTED }}>/mo</span></div>
              <div style={{ fontSize: 14, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 24 }}>Get your bearings</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                {['D7 visa checklist', 'Document list', 'Country overview', 'Basic guidance'].map((f, i) => (
                  <div key={i} style={{ fontSize: 14, color: DARK, fontFamily: "'Helvetica Neue', sans-serif", display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: GREEN, fontWeight: 700 }}>✓</span>{f}
                  </div>
                ))}
              </div>
              <Link href="/login" style={{ display: 'block', textAlign: 'center', padding: '13px', borderRadius: 10, border: `2px solid ${GREEN_DARK}`, color: GREEN_DARK, fontWeight: 600, fontSize: 15, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif" }}>
                Get started free
              </Link>
            </div>
            {/* Pro */}
            <div style={{ flex: '1 1 280px', background: GREEN_DARK, borderRadius: 16, padding: 32, position: 'relative' }}>
              <div style={{ position: 'absolute', top: -12, left: 32, fontSize: 11, fontWeight: 700, color: GREEN_DARK, background: '#9FE1CB', padding: '3px 10px', borderRadius: 20, fontFamily: "'Helvetica Neue', sans-serif" }}>Most popular</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)', fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 8 }}>Pro</div>
              <div style={{ fontSize: 48, fontWeight: 700, color: '#fff', letterSpacing: '-2px', marginBottom: 4 }}>$19<span style={{ fontSize: 18, fontWeight: 400, color: 'rgba(255,255,255,0.6)' }}>/mo</span></div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 24 }}>Everything you need</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                {['Everything in Free', 'Joao or Andreia AI guide', 'Secure document vault', 'Adaptive pacing + tone', 'Deadline tracker', 'Weekly updated info', 'Priority support'].map((f, i) => (
                  <div key={i} style={{ fontSize: 14, color: '#E1F5EE', fontFamily: "'Helvetica Neue', sans-serif", display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#9FE1CB', fontWeight: 700 }}>✓</span>{f}
                  </div>
                ))}
              </div>
              <Link href="/login" style={{ display: 'block', textAlign: 'center', padding: '13px', borderRadius: 10, background: '#fff', color: GREEN_DARK, fontWeight: 700, fontSize: 15, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif" }}>
                Start with Pro →
              </Link>
              <div style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: "'Helvetica Neue', sans-serif", marginTop: 10 }}>Cancel anytime</div>
            </div>
          </div>
        </div>
      </section>

      {/* LIFE CTA */}
      <section style={{ background: DARK, padding: '60px 24px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 24 }}>🌍</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#fff', letterSpacing: '-1px', marginBottom: 20 }}>You've thought about this for a long time.</h2>
          <p style={{ fontSize: 17, lineHeight: 1.75, color: 'rgba(255,255,255,0.65)', fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 36 }}>
            Moving abroad at any age takes courage. Moving in your 50s, 60s, or 70s takes something more. Visado was built for people who have earned the right to make this choice — and who deserve a guide that understands what it means.
          </p>
          <Link href="/login" style={{ display: 'inline-block', fontSize: 16, fontWeight: 600, color: GREEN_DARK, background: '#fff', padding: '15px 32px', borderRadius: 10, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif" }}>
            Talk to Andreia or Joao →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: OFF_WHITE, borderTop: `1px solid ${BORDER}`, padding: '40px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 16, fontWeight: 700, color: GREEN_DARK, marginRight: 'auto' }}>
            <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: GREEN }} />
            Visado
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <a href="https://visado-backend.vercel.app/privacy" target="_blank" style={{ fontSize: 13, color: MUTED, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif" }}>Privacy Policy</a>
            <a href="https://visado-backend.vercel.app/terms" target="_blank" style={{ fontSize: 13, color: MUTED, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif" }}>Terms of Service</a>
            <Link href="/contact" style={{ fontSize: 13, color: MUTED, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif" }}>Contact</Link>
          </div>
          <div style={{ flexBasis: '100%', fontSize: 12, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif" }}>
            Not legal advice. For complex situations, consult an immigration attorney.
          </div>
        </div>
      </footer>
    </div>
  )
}
