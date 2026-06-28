import Link from 'next/link'
const GREEN = '#1B2F6E'; const GREEN_DARK = '#111E47'; const GREEN_LIGHT = '#E8ECF7'; const GOLD = '#C9942A'; const OFF_WHITE = '#F9F7F4'; const DARK = '#111510'; const MUTED = '#6B7280'; const BORDER = '#E5E7EB';
export default function ContactPage() {
  return (
    <div style={{ minHeight: '100vh', background: OFF_WHITE, fontFamily: 'Georgia, serif' }}>
      <nav style={{ background: '#fff', borderBottom: `1px solid ${BORDER}`, padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, fontWeight: 700, color: GREEN_DARK, textDecoration: 'none' }}>
          <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: GREEN }} />Visado
        </Link>
        <Link href="/login" style={{ fontSize: 13, color: MUTED, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif" }}>Log in</Link>
      </nav>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '64px 24px 80px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: DARK, marginBottom: 12 }}>Get in touch</h1>
        <p style={{ fontSize: 16, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", lineHeight: 1.7, marginBottom: 48 }}>
          We're a small team. You'll hear from a real person, usually within one to two business days.
        </p>
        <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 16, padding: 32, marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Email us</div>
          <a href="mailto:daniel@visadoapp.com" style={{ fontSize: 20, fontWeight: 700, color: GREEN_DARK, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif" }}>daniel@visadoapp.com</a>
          <p style={{ fontSize: 14, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginTop: 8, marginBottom: 0, lineHeight: 1.6 }}>Response time: within 1–2 business days</p>
        </div>
        <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 16, padding: 32 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>Feel free to ask about these topics or anything else</div>
          {[
            { icon: '◎', label: 'General questions', sub: 'How Visado works, visa questions, feature requests' },
            { icon: '⊠', label: 'Account & billing', sub: 'Login issues, subscription changes, refund requests' },
            { icon: '🔒', label: 'Document vault', sub: 'Upload problems, access issues, document deletion' },
            { icon: '⚖️', label: 'Privacy requests', sub: 'Data access, correction, or deletion under GDPR' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, padding: '14px 0', borderBottom: i < 3 ? `1px solid ${BORDER}` : 'none' }}>
              <span style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: DARK, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontSize: 13, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif" }}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
