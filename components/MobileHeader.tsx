'use client'
import { useState } from 'react'
import Link from 'next/link'

const GREEN = '#1B2F6E'
const GREEN_DARK = '#111E47'
const GREEN_LIGHT = '#E8ECF7'
const MUTED = '#6B7280'
const BORDER = '#E5E7EB'
const DARK = '#111510'

interface Profile {
  full_name?: string
  plan?: string
}

interface MobileHeaderProps {
  activePage: string
  profile: Profile
  onLogout: () => void
}

const NAV = [
  { label: 'Overview', href: '/dashboard', icon: '⊞' },
  { label: 'Checklist', href: '/dashboard?tab=checklist', icon: '✓' },
  { label: 'Chat', href: '/chat', icon: '◎' },
  { label: 'Document Vault', href: '/vault', icon: '⊠' },
  { label: 'Account', href: '/account', icon: '◈' },
]

export default function MobileHeader({ activePage, profile, onLogout }: MobileHeaderProps) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 56, background: '#fff', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', zIndex: 100 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, fontWeight: 700, color: GREEN_DARK, textDecoration: 'none' }}>
          <img src="/visado-logo.png" alt="" width={22} height={22} style={{ borderRadius: 5 }} />
          Visado
        </Link>
        <button onClick={() => setOpen(!open)} style={{ background: 'none', border: 'none', fontSize: 22, color: DARK, cursor: 'pointer', padding: '4px 8px' }}>
          {open ? '✕' : '☰'}
        </button>
      </div>
      {open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200 }} onClick={() => setOpen(false)}>
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 280, background: '#fff', display: 'flex', flexDirection: 'column', padding: '24px 0', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, fontWeight: 700, color: GREEN_DARK, textDecoration: 'none', padding: '0 20px', marginBottom: 32 }}>
              <img src="/visado-logo.png" alt="" width={22} height={22} style={{ borderRadius: 5 }} />
              Visado
            </Link>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, padding: '0 12px' }}>
              {NAV.map((item) => {
                const isActive = activePage === item.href || activePage === item.label.toLowerCase()
                return (
                  <Link key={item.href} href={item.href} onClick={() => setOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, fontSize: 14, color: isActive ? GREEN_DARK : MUTED, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif", background: isActive ? GREEN_LIGHT : 'transparent', fontWeight: isActive ? 600 : 400 }}>
                    <span style={{ fontSize: 15, width: 18, textAlign: 'center' }}>{item.icon}</span>
                    {item.label}
                  </Link>
                )
              })}
            </nav>
            <div style={{ padding: '16px 20px', borderTop: `1px solid ${BORDER}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: GREEN_LIGHT, color: GREEN_DARK, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
                  {(profile?.full_name?.[0] || 'U').toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: DARK, fontFamily: "'Helvetica Neue', sans-serif" }}>{profile?.full_name || 'My Account'}</div>
                  <div style={{ fontSize: 11, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif" }}>{profile?.plan === 'pro' ? 'Pro plan' : 'Free plan'}</div>
                </div>
              </div>
              <button onClick={onLogout} style={{ display: 'block', width: '100%', textAlign: 'center', padding: '8px', background: 'none', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 13, color: MUTED, cursor: 'pointer', fontFamily: "'Helvetica Neue', sans-serif" }}>
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
