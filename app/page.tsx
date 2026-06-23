import Link from 'next/link'
import Image from 'next/image'
import CookieBanner from '../components/CookieBanner'
import LandingNav from '../components/LandingNav'

const NAVY = '#1B2F6E'
const NAVY_DARK = '#111E47'
const NAVY_LIGHT = '#E8ECF7'
const GOLD = '#C9942A'
const GOLD_LIGHT = '#FBF3E2'
const OFF_WHITE = '#F9F7F4'
const DARK = '#111510'
const MUTED = '#6B7280'
const BORDER = '#E5E7EB'

export default function HomePage() {
  return (
    <div style={{ fontFamily: 'Georgia, serif', background: OFF_WHITE, color: DARK }}>

      {/* NAV */}
      <LandingNav />
      <div style={{ height: 64 }} />

      {/* HERO */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px', display: 'flex', alignItems: 'center', gap: 60, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 400px' }}>
          <div style={{ display: 'inline-block', fontSize: 13, fontFamily: "'Helvetica Neue', sans-serif", color: NAVY_DARK, background: NAVY_LIGHT, padding: '4px 12px', borderRadius: 20, marginBottom: 24, border: `1px solid rgba(27,47,110,0.25)` }}>
            🇵🇹 Built by a family who did it. Four times.
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-1.5px', margin: '0 0 20px', color: DARK }}>
            Portugal isn't just a move.<br />
            <span style={{ color: GOLD }}>It's the beginning of something beautiful.</span>
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.7, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", margin: '0 0 32px', maxWidth: 480 }}>
            We've packed up our family and started over in the Netherlands, Malaysia, back to the US, and now the Algarve. Every time it was overwhelming, expensive, and lonely in ways we didn't expect. Visado is what we wished existed — not a lawyer, not a consultant. Just a calm, knowledgeable friend, available whenever the anxiety hits.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
            <Link href="/login" style={{ fontSize: 16, fontWeight: 600, color: '#fff', background: NAVY_DARK, padding: '14px 28px', borderRadius: 10, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif", display: 'inline-block' }}>
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
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: NAVY, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, fontFamily: "'Helvetica Neue', sans-serif", flexShrink: 0 }}>J</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: DARK, fontFamily: "'Helvetica Neue', sans-serif" }}>Joao · Visado guide</div>
              <div style={{ fontSize: 11, color: GOLD, fontFamily: "'Helvetica Neue', sans-serif" }}>● Online</div>
            </div>
            <div style={{ marginLeft: 'auto', fontSize: 10, padding: '2px 8px', borderRadius: 20, background: NAVY_LIGHT, color: NAVY_DARK, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600 }}>Direct mode</div>
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.6, color: DARK, background: '#F9F9F9', padding: '12px 14px', borderRadius: 10, marginBottom: 14, fontFamily: "'Helvetica Neue', sans-serif" }}>
            Your NIF is the next critical step. Without it, you cannot open a Portuguese bank account, sign a lease, or submit your D7 application.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
            {['Valid passport', 'Proof of US address', 'Simple form at office'].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: DARK, fontFamily: "'Helvetica Neue', sans-serif" }}>
                <span style={{ color: GOLD, fontWeight: 700 }}>✓</span>{item}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 13, color: NAVY_DARK, fontStyle: 'italic', fontFamily: "'Helvetica Neue', sans-serif", borderTop: `1px solid ${BORDER}`, paddingTop: 12 }}>
            Want me to walk you through where to go?
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section style={{ background: NAVY_DARK, padding: '32px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 20 }}>Trusted by Americans making the move</p>
          <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[['D7 visa', 'flagship route'], ['32 steps', 'fully guided'], ['5 min', 'to get started'], ['AES-256', 'vault security']].map(([val, label], i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: GOLD, letterSpacing: '-0.5px' }}>{val}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontFamily: "'Helvetica Neue', sans-serif", marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ padding: '60px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: GOLD, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 12 }}>How it works</div>
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
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: GOLD, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 12 }}>What's included</div>
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

      {/* LIFE CTA */}
      <section style={{ background: DARK, padding: '60px 24px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 24 }}>🌍</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#fff', letterSpacing: '-1px', marginBottom: 20 }}>You've thought about this for a long time.</h2>
          <p style={{ fontSize: 17, lineHeight: 1.75, color: 'rgba(255,255,255,0.65)', fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 36 }}>
            Moving abroad at any age takes courage. Moving in your 50s, 60s, or 70s takes something more. Visado was built for people who have earned the right to make this choice — and who deserve a guide that understands what it means.
          </p>
          <Link href="/login" style={{ display: 'inline-block', fontSize: 16, fontWeight: 600, color: NAVY_DARK, background: GOLD, padding: '15px 32px', borderRadius: 10, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif" }}>
            Talk to Andreia or Joao →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: OFF_WHITE, borderTop: `1px solid ${BORDER}`, padding: '40px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 16, fontWeight: 700, color: NAVY_DARK, marginRight: 'auto' }}>
            <Image src="/visado-logo.png" alt="Visado" width={20} height={20} style={{ borderRadius: 4 }} />
            Visado
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <Link href="/privacy" style={{ fontSize: 13, color: MUTED, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif" }}>Privacy Policy</Link>
            <Link href="/terms" style={{ fontSize: 13, color: MUTED, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif" }}>Terms of Service</Link>
            <Link href="/contact" style={{ fontSize: 13, color: MUTED, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif" }}>Contact</Link>
          </div>
          <div style={{ flexBasis: '100%', fontSize: 12, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif" }}>
            Not legal advice. For complex situations, consult an immigration attorney.
          </div>
        </div>
      </footer>
      <CookieBanner />
    </div>
  )
}
