'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const NAVY_DARK = '#111E47'
const MUTED = '#6B7280'
const BORDER = '#E5E7EB'
const OFF_WHITE = '#F9F7F4'

export default function LandingNav() {
  const [open, setOpen] = useState(false)

  const links = (
    <>
      <Link href="/#how" onClick={() => setOpen(false)} style={{ fontSize: 14, color: MUTED, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif", whiteSpace: 'nowrap' }}>How it works</Link>
      <Link href="/about" onClick={() => setOpen(false)} style={{ fontSize: 14, color: MUTED, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif", whiteSpace: 'nowrap' }}>About</Link>
      <Link href="/blog" onClick={() => setOpen(false)} style={{ fontSize: 14, color: MUTED, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif", whiteSpace: 'nowrap' }}>Blog</Link>
      <Link href="/pricing" onClick={() => setOpen(false)} style={{ fontSize: 14, color: MUTED, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif", whiteSpace: 'nowrap' }}>Pricing</Link>
    </>
  )

  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, background: 'rgba(249,247,244,0.95)', borderBottom: `1px solid ${BORDER}`, zIndex: 100, padding: '0 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, gap: 12 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 20, fontWeight: 700, letterSpacing: '-0.5px', color: NAVY_DARK, flexShrink: 0, textDecoration: 'none' }}>
          <Image src="/visado-logo.png" alt="Visado" width={28} height={28} style={{ borderRadius: 6 }} />
          Visado
        </Link>

        {/* Desktop links */}
        <div className="landing-nav-desktop" style={{ alignItems: 'center', gap: 18 }}>
          {links}
          <Link href="/login" style={{ fontSize: 14, fontWeight: 600, color: '#fff', background: NAVY_DARK, padding: '8px 18px', borderRadius: 8, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif", whiteSpace: 'nowrap' }}>Log In</Link>
        </div>

        {/* Mobile: standalone Log In + hamburger */}
        <div className="landing-nav-mobile-actions" style={{ alignItems: 'center', gap: 12 }}>
          <Link href="/login" style={{ fontSize: 14, fontWeight: 600, color: '#fff', background: NAVY_DARK, padding: '8px 16px', borderRadius: 8, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif", whiteSpace: 'nowrap' }}>Log In</Link>
          <button
            className="landing-nav-burger"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            style={{ background: 'none', border: 'none', fontSize: 24, color: NAVY_DARK, cursor: 'pointer', padding: 4, lineHeight: 1 }}
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile dropdown panel */}
      {open && (
        <div className="landing-nav-mobile-panel" style={{ display: 'flex', flexDirection: 'column', gap: 18, padding: '16px 0 24px', borderTop: `1px solid ${BORDER}`, background: OFF_WHITE }}>
          {links}
        </div>
      )}

      <style>{`
        .landing-nav-desktop { display: none; }
        .landing-nav-mobile-actions { display: flex; }
        @media (min-width: 768px) {
          .landing-nav-desktop { display: flex; }
          .landing-nav-mobile-actions { display: none !important; }
          .landing-nav-mobile-panel { display: none !important; }
        }
      `}</style>
    </nav>
  )
}
