import Link from 'next/link'
const GREEN = '#1D9E75'; const GREEN_DARK = '#0F6E56'; const OFF_WHITE = '#F9F7F4'; const DARK = '#111510'; const MUTED = '#6B7280'; const BORDER = '#E5E7EB';
export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', background: OFF_WHITE, fontFamily: 'Georgia, serif' }}>
      <nav style={{ background: '#fff', borderBottom: `1px solid ${BORDER}`, padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, fontWeight: 700, color: GREEN_DARK, textDecoration: 'none' }}>
          <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: GREEN }} />Visado
        </Link>
        <Link href="/login" style={{ fontSize: 13, color: MUTED, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif" }}>Log in</Link>
      </nav>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 80px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: DARK, marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ fontSize: 14, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 40 }}>Last updated: June 2026</p>
        {[
          { title: '1. Who We Are', body: 'Visado is an AI-powered immigration guidance platform helping Americans relocate to Portugal. We are operated by Red Tree Hill LLC. Contact us at privacy@visadoapp.com.' },
          { title: '2. What We Collect', body: 'We collect information you provide directly: name, email address, and profile information during onboarding (age range, visa type, family situation, work background). We collect documents you upload to the vault. We collect conversation history from your AI guide sessions. We collect usage data such as checklist progress and feature interactions.' },
          { title: '3. How We Use Your Data', body: 'We use your data to provide and improve the Visado service, personalize your AI guide\'s responses to your situation, process payments via Stripe, send service-related emails, and comply with legal obligations. We do not sell your personal data to third parties.' },
          { title: '4. AI Processing', body: 'Your conversations are processed by Anthropic\'s Claude AI to generate guidance responses. Anthropic processes your messages according to their privacy policy. We recommend not sharing highly sensitive information like Social Security numbers or full financial account numbers in chat.' },
          { title: '5. Document Storage', body: 'Documents you upload are stored encrypted in Supabase\'s secure cloud storage. Access is restricted to your account only. Signed URLs with short expiry times are used for document access. We do not share your documents with third parties.' },
          { title: '6. Your Rights (GDPR)', body: 'If you are in the European Union or European Economic Area, you have the right to access your personal data, correct inaccurate data, request deletion of your data (available in Account settings), object to processing, and data portability. To exercise these rights, contact privacy@visadoapp.com.' },
          { title: '7. Data Retention', body: 'We retain your data for as long as your account is active. When you delete your account, we permanently delete your profile, documents, and conversation history within 30 days. Stripe retains payment records as required by law.' },
          { title: '8. Cookies', body: 'We use essential cookies for authentication. We do not use advertising or tracking cookies. You can control cookies through your browser settings.' },
          { title: '9. Contact', body: 'For privacy questions or to exercise your rights, contact us at privacy@visadoapp.com.' },
        ].map((s, i) => (
          <div key={i} style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: DARK, marginBottom: 10 }}>{s.title}</h2>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: '#374151', fontFamily: "'Helvetica Neue', sans-serif", margin: 0 }}>{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
