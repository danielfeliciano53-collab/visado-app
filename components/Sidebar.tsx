'use client'
import Link from 'next/link'
import Image from 'next/image'
import { apiFetch } from '../lib/api'

const NAVY = '#1B2F6E'
const NAVY_DARK = '#111E47'
const NAVY_LIGHT = '#E8ECF7'
const GOLD = '#C9942A'
const GOLD_LIGHT = '#FBF3E2'
const MUTED = '#6B7280'
const BORDER = '#E5E7EB'
const DARK = '#111510'

interface Profile {
  full_name?: string
  email?: string
  plan?: string
}

interface SidebarProps {
  activePage: string
  profile: Profile
  onLogout: () => void
}

const NAV = [
  { label: 'Dashboard', href: '/dashboard', icon: '⊞' },
  { label: 'Checklist', href: '/dashboard?tab=checklist', icon: '✓' },
  { label: 'Chat', href: '/chat', icon: '◎' },
  { label: 'Document Vault', href: '/vault', icon: '⊠' },
  { label: 'Account', href: '/account', icon: '◈' },
]

export default function Sidebar({ activePage, profile, onLogout }: SidebarProps) {
  return (
    <div style={{ width: 240, minHeight: '100vh', background: '#fff', borderRight: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', padding: '24px 0', flexShrink: 0 }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, fontWeight: 700, color: NAVY_DARK, textDecoration: 'none', padding: '0 20px', marginBottom: 32 }}>
        <Image src="/visado-logo.png" alt="Visado" width={28} height={28} style={{ borderRadius: 6 }} />
        Visado
      </Link>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, padding: '0 12px' }}>
        {NAV.map((item) => {
          const isActive = activePage === item.href || activePage === item.label.toLowerCase()
          return (
            <Link key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, fontSize: 14, color: isActive ? NAVY_DARK : MUTED, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif", background: isActive ? NAVY_LIGHT : 'transparent', fontWeight: isActive ? 600 : 400 }}>
              <span style={{ fontSize: 15, width: 18, textAlign: 'center' }}>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div style={{ padding: '16px 20px', borderTop: `1px solid ${BORDER}` }}>
        <Link href="/account" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: NAVY_LIGHT, color: NAVY_DARK, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
            {(profile?.full_name?.[0] || 'U').toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: DARK, fontFamily: "'Helvetica Neue', sans-serif" }}>{profile?.full_name || 'My Account'}</div>
            <div style={{ fontSize: 11, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif" }}>{profile?.plan === 'pro' ? 'Pro plan' : 'Free plan'}</div>
          </div>
        </Link>
        {profile?.plan !== 'pro' && (
          <button onClick={async () => {
            try {
              const res = await apiFetch('/api/stripe-checkout')
              const json = await res.json()
              if (json.url) window.location.href = json.url
            } catch (e) {
              console.error('Checkout error', e)
            }
          }} style={{ display: 'block', width: '100%', textAlign: 'center', padding: '9px', background: GOLD, color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 8 }}>
            Upgrade to Pro
          </button>
        )}
        <button onClick={onLogout} style={{ display: 'block', width: '100%', textAlign: 'center', padding: '8px', background: 'none', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 13, color: MUTED, cursor: 'pointer', fontFamily: "'Helvetica Neue', sans-serif" }}>
          Log out
        </button>
      </div>
    </div>
  )
}
