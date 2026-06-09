import Link from 'next/link'
const GREEN = '#1D9E75'; const GREEN_DARK = '#0F6E56'; const OFF_WHITE = '#F9F7F4'; const DARK = '#111510'; const MUTED = '#6B7280'; const BORDER = '#E5E7EB';
export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: OFF_WHITE, fontFamily: 'Georgia, serif' }}>
      <nav style={{ background: '#fff', borderBottom: `1px solid ${BORDER}`, padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, fontWeight: 700, color: GREEN_DARK, textDecoration: 'none' }}>
          <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: GREEN }} />Visado
        </Link>
        <Link href="/login" style={{ fontSize: 13, color: MUTED, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif" }}>Log in</Link>
      </nav>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 80px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: DARK, marginBottom: 8 }}>Terms of Service</h1>
        <p style={{ fontSize: 14, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 40 }}>Last updated: June 2026</p>
        {[
          { title: '1. Acceptance', body: 'By using Visado, you agree to these Terms of Service. If you do not agree, do not use the service.' },
          { title: '2. Not Legal Advice', body: 'Visado provides general immigration guidance and information only. Nothing in the service constitutes legal advice. For complex immigration situations, consult a licensed immigration attorney. Immigration laws change — always verify information with official Portuguese government sources.' },
          { title: '3. Service Description', body: 'Visado is an AI-powered project management and guidance tool for Americans relocating to Portugal. We provide checklists, document organization, and AI-generated guidance based on your situation.' },
          { title: '4. Account Responsibilities', body: 'You are responsible for maintaining the security of your account credentials. You must provide accurate information during signup and onboarding. You may not use the service for any unlawful purpose or share your account with others.' },
          { title: '5. Document Vault', body: 'You retain ownership of all documents you upload. By uploading, you grant Visado a limited license to store and display documents to you within the service. We do not share your documents with third parties.' },
          { title: '6. Payments', body: 'Pro subscriptions are billed monthly. You may cancel at any time from your Account page. Refunds are handled on a case-by-case basis — contact support@visadoapp.com.' },
          { title: '7. Limitation of Liability', body: 'Visado is provided "as is" without warranties. We are not liable for immigration decisions, visa denials, or outcomes based on guidance provided. Our total liability is limited to the amount you paid in the last 3 months.' },
          { title: '8. Termination', body: 'We may suspend or terminate accounts that violate these terms. You may delete your account at any time from Account settings.' },
          { title: '9. Changes', body: 'We may update these terms. Continued use after changes constitutes acceptance. We will notify users of material changes by email.' },
          { title: '10. Contact', body: 'Questions about these terms: legal@visadoapp.com.' },
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
