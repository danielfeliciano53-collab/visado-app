import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'About Us | Visado',
  description: 'Daniel and Laura Feliciano built Visado after four international moves across three continents. This is their story.',
}

const NAVY = '#1B2F6E'
const NAVY_DARK = '#111E47'
const NAVY_LIGHT = '#E8ECF7'
const GOLD = '#C9942A'
const GOLD_LIGHT = '#FBF3E2'
const OFF_WHITE = '#F9F7F4'
const DARK = '#111510'
const MUTED = '#6B7280'
const BORDER = '#E5E7EB'

export default function AboutPage() {
  return (
    <div style={{ fontFamily: 'Georgia, serif', background: OFF_WHITE, minHeight: '100vh' }}>

      {/* Nav */}
      <nav style={{ background: '#fff', borderBottom: `1px solid ${BORDER}`, padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <Image src="/visado-logo.png" alt="Visado" width={28} height={28} style={{ borderRadius: 6 }} />
          <span style={{ fontSize: 20, fontWeight: 700, color: NAVY_DARK }}>Visado</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Link href="/about" style={{ fontSize: 14, color: NAVY_DARK, textDecoration: 'none', fontWeight: 600, fontFamily: "'Helvetica Neue', sans-serif" }}>About</Link>
          <Link href="/blog" style={{ fontSize: 14, color: MUTED, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif" }}>Blog</Link>
          <Link href="/pricing" style={{ fontSize: 14, color: MUTED, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif" }}>Pricing</Link>
          <Link href="/login" style={{ fontSize: 14, background: NAVY_DARK, color: '#fff', padding: '8px 18px', borderRadius: 8, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600 }}>Sign In</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ position: 'relative', height: 480, overflow: 'hidden', background: NAVY_DARK }}>
        <Image
          src="/about-hero.jpg"
          alt="Daniel and Laura Feliciano"
          fill
          style={{ objectFit: 'cover', opacity: 0.5 }}
          priority
        />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: GOLD, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 16 }}>
            Our Story
          </div>
          <h1 style={{ margin: '0 0 16px', fontSize: 48, fontWeight: 700, color: '#fff', lineHeight: 1.15, maxWidth: 700 }}>
            We didn't just build this app. We lived it.
          </h1>
          <p style={{ margin: 0, fontSize: 18, color: 'rgba(255,255,255,0.85)', maxWidth: 560, lineHeight: 1.6, fontFamily: "'Helvetica Neue', sans-serif" }}>
            Four countries. Three continents. Two kids born abroad. One company built to make your move easier than ours was.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '64px 24px' }}>

        {/* Intro */}
        <p style={{ fontSize: 20, lineHeight: 1.8, color: DARK, marginBottom: 32 }}>
          Hi, we're Daniel and Laura Feliciano. We've moved our family across four countries on three continents — the Netherlands, Malaysia, the United States, and now Portugal — and we've learned every lesson the hard way.
        </p>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 56, padding: '32px', background: '#fff', borderRadius: 16, border: `1px solid ${BORDER}` }}>
          {[
            { number: '74', label: 'Countries visited\n(Daniel)', color: NAVY_DARK },
            { number: '50+', label: 'Countries visited\n(Laura)', color: GOLD },
            { number: '4', label: 'International\nmoves as a family', color: NAVY_DARK },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '8px 0' }}>
              <div style={{ fontSize: 42, fontWeight: 700, color: stat.color, lineHeight: 1 }}>{stat.number}</div>
              <div style={{ fontSize: 13, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginTop: 8, whiteSpace: 'pre-line', lineHeight: 1.4 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Story sections */}
        <h2 style={{ fontSize: 28, fontWeight: 700, color: DARK, marginBottom: 16 }}>From Marine pilot to global nomad</h2>
        <p style={{ fontSize: 17, lineHeight: 1.8, color: DARK, marginBottom: 24 }}>
          Daniel spent years as a Marine pilot before moving into the energy sector, where he led multi-billion dollar global initiatives at Shell. Laura has been by his side through every posting, every time zone, every bureaucratic nightmare. Together, they've navigated visa applications, foreign school systems, expat healthcare, and the particular chaos of moving a family across continents.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.8, color: DARK, marginBottom: 48 }}>
          They've lived through the sleepless logistics of international moves — the document hunts, the consulate appointments, the moments where you're standing in a foreign office with a stack of papers and absolutely no idea if you have the right ones. Those experiences aren't background noise. They're the reason Visado exists.
        </p>

        {/* Pull quote */}
        <div style={{ background: GOLD_LIGHT, borderLeft: `4px solid ${GOLD}`, borderRadius: '0 12px 12px 0', padding: '24px 28px', marginBottom: 48 }}>
          <p style={{ margin: 0, fontSize: 20, color: NAVY_DARK, lineHeight: 1.7, fontStyle: 'italic' }}>
            "Our son was born in Miri, on the island of Borneo in Malaysia. To get him his US passport, we had to travel from Miri to Kuala Lumpur with a newborn who technically had no nationality yet — not Malaysian under their law, not yet American until we reached the embassy. We've been in situations most relocation guides only theorize about."
          </p>
          <p style={{ margin: '16px 0 0', fontSize: 14, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600 }}>— Daniel Feliciano, Co-founder</p>
        </div>

        <h2 style={{ fontSize: 28, fontWeight: 700, color: DARK, marginBottom: 16 }}>A daughter born where kings are born</h2>
        <p style={{ fontSize: 17, lineHeight: 1.8, color: DARK, marginBottom: 24 }}>
          Before Malaysia, there was the Netherlands. Their daughter Tosca was born at the same hospital in the Netherlands where Dutch royalty have been born for generations — a detail that still makes them smile. Living in northern Europe, then Southeast Asia, then back to the US, and now settling in Faro, Portugal, has given Daniel and Laura a depth of expat experience that spans every climate, culture, and continent.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.8, color: DARK, marginBottom: 48 }}>
          Each move taught them something the previous one hadn't. Northern Europe is orderly but cold in ways that go beyond temperature. Southeast Asia is warm and chaotic and extraordinary. Repatriation to the US carries its own reverse culture shock that nobody warns you about. And southern Europe — Portugal specifically — is something else entirely: slower, warmer, more human. They're still learning it, and that's the point. The journey doesn't end.
        </p>

        <h2 style={{ fontSize: 28, fontWeight: 700, color: DARK, marginBottom: 16 }}>Why Visado</h2>
        <p style={{ fontSize: 17, lineHeight: 1.8, color: DARK, marginBottom: 24 }}>
          When Daniel started building Clotheslyne — a laundry marketplace app — he learned how to build technology companies the hard way too. That experience, combined with a lifetime of international moves, led to a simple question: why does every expat still have to figure this out alone?
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.8, color: DARK, marginBottom: 48 }}>
          Visado is the guide Daniel and Laura wish they'd had. Not a directory of lawyers. Not a forum thread from 2019. A real companion — one that knows the documents, the deadlines, the pitfalls, and the things nobody tells you until it's too late. Built by people who've actually been there.
        </p>

        {/* CTA */}
        <div style={{ background: NAVY_DARK, borderRadius: 20, padding: '48px 40px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 26, fontWeight: 700, color: '#fff' }}>Ready to start your journey?</h3>
          <p style={{ margin: '0 0 28px', fontSize: 16, color: 'rgba(255,255,255,0.8)', fontFamily: "'Helvetica Neue', sans-serif", lineHeight: 1.6 }}>
            Meet Joao or Andreia — your AI guide, built on real experience.
          </p>
          <Link href="/login" style={{ display: 'inline-block', background: GOLD, color: '#fff', padding: '14px 32px', borderRadius: 10, fontSize: 16, fontWeight: 700, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif" }}>
            Start for free →
          </Link>
        </div>

      </div>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${BORDER}`, padding: '32px', textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: 13, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif" }}>
          © 2026 Visado · <Link href="/privacy" style={{ color: MUTED }}>Privacy</Link> · <Link href="/terms" style={{ color: MUTED }}>Terms</Link>
        </p>
      </footer>

    </div>
  )
}
