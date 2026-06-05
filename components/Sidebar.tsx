'use client'
import Link from 'next/link'

const GREEN = '#1D9E75'
const GREEN_DARK = '#0F6E56'
const GREEN_LIGHT = '#E1F5EE'
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
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, fontWeight: 700, color: GREEN_DARK, textDecoration: 'none', padding: '0 20px', marginBottom: 32 }}>
        <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: GREEN }} />
        Visado
      </Link>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, padding: '0 12px' }}>
        {NAV.map((item) => {
          const isActive = activePage === item.href || activePage === item.label.toLowerCase()
          return (
            <Link key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, fontSize: 14, color: isActive ? GREEN_DARK : MUTED, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif", background: isActive ? GREEN_LIGHT : 'transparent', fontWeight: isActive ? 600 : 400 }}>
              <span style={{ fontSize: 15, width: 18, textAlign: 'center' }}>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div style={{ padding: '16px 20px', borderTop: `1px solid ${BORDER}` }}>
        <Link href="/account" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: GREEN_LIGHT, color: GREEN_DARK, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
            {(profile?.full_name?.[0] || 'U').toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: DARK, fontFamily: "'Helvetica Neue', sans-serif" }}>{profile?.full_name || 'My Account'}</div>
            <div style={{ fontSize: 11, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif" }}>{profile?.plan === 'pro' ? 'Pro plan' : 'Free plan'}</div>
          </div>
        </Link>
        {profile?.plan !== 'pro' && (
          <Link href="https://buy.stripe.com/4gM4gA2t94561v1cVMabK00" style={{ display: 'block', textAlign: 'center', padding: '9px', background: GREEN_DARK, color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 8 }}>
            Upgrade to Pro
          </Link>
        )}
        <button onClick={onLogout} style={{ display: 'block', width: '100%', textAlign: 'center', padding: '8px', background: 'none', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 13, color: MUTED, cursor: 'pointer', fontFamily: "'Helvetica Neue', sans-serif" }}>
          Log out
        </button>
      </div>
    </div>
  )
}
