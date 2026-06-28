import Link from 'next/link'
const GREEN = '#1B2F6E'; const GREEN_DARK = '#111E47'; const GREEN_LIGHT = '#E8ECF7'; const OFF_WHITE = '#F9F7F4'; const DARK = '#111510'; const MUTED = '#6B7280'; const BORDER = '#E5E7EB';
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
          { title: '1. Who We Are', body: 'Visado is an AI-powered Portugal relocation platform operated by Red Tree Hill LLC. If you have questions about this policy or want to exercise your privacy rights, contact us at daniel@visadoapp.com.' },
          { title: '2. What We Collect', body: 'We collect information you provide directly: your name, email address, and profile details entered during onboarding (age range, visa type, family situation, work background, communication preferences). We collect documents you upload to the Document Vault. We collect your conversation history with your AI guide. We collect usage data such as checklist progress and feature interactions. We do not collect Social Security numbers, financial account numbers, or payment card details — Stripe handles all payment processing directly.' },
          { title: '3. How We Use Your Data', body: 'We use your data to provide and improve the Visado service, to personalize your AI guide\'s responses to your specific situation, to process payments through Stripe, and to send you service-related emails. We do not sell your personal data. We do not share your data with third parties for marketing purposes. Full stop.' },
          { title: '4. Who Has Access', body: 'Your data is accessible to: the Visado team (currently Daniel Feliciano, founder) for support and product improvement purposes; Anthropic (Claude AI) to generate your guide\'s responses — your messages are processed according to Anthropic\'s privacy policy and are not used to train their models under our API agreement; Supabase for database and file storage; Vercel for application hosting; Stripe for payment processing; and Resend for transactional emails. No other parties have access to your data.' },
          { title: '5. Document Storage', body: 'Documents you upload to the vault are stored in Supabase\'s encrypted cloud storage (AES-256 at rest, TLS in transit). Access is restricted to your account. We use signed URLs with short expiry times for document access — documents are never publicly accessible. We do not read, analyze, or share your documents. They exist in our system solely for you to retrieve them.' },
          { title: '6. AI Conversations', body: 'Your conversations with Joao and Andreia are sent to Anthropic\'s Claude API to generate responses. We send your message history and your onboarding profile (visa type, family situation, etc.) to provide relevant guidance. We do not send your uploaded documents to any AI system unless you explicitly use the "Analyze with Joao" feature. Anthropic does not use API conversations to train their models. We recommend not sharing sensitive identifiers like Social Security numbers or full bank account numbers in chat.' },
          { title: '7. Your Rights (GDPR)', body: 'If you are in the EU or EEA, you have the right to: access the personal data we hold about you; correct inaccurate data; request deletion of your data; object to processing; and receive your data in a portable format. To exercise any of these rights, email daniel@visadoapp.com. To delete your account and all associated data, go to Account settings and select Delete Account. We will permanently delete your profile, documents, and conversation history within 30 days.' },
          { title: '8. Data Retention', body: 'We retain your data for as long as your account is active. When you delete your account, we permanently delete your profile, vault documents, and conversation history within 30 days. Stripe retains payment transaction records as required by law. Anonymized, aggregated usage data (not linked to you personally) may be retained for product improvement.' },
          { title: '9. Cookies', body: 'We use one essential cookie for authentication (visado_token). We do not use advertising cookies, tracking pixels, or third-party analytics cookies. You can control cookies through your browser settings, but disabling the authentication cookie will prevent you from staying logged in.' },
          { title: '10. Changes to This Policy', body: 'We will notify you by email if we make material changes to this policy. The "last updated" date at the top of this page reflects the most recent revision. Continued use of Visado after changes constitutes acceptance of the updated policy.' },
          { title: '11. Contact', body: 'For privacy questions, data requests, or concerns: daniel@visadoapp.com. We aim to respond within 2 business days.' },
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
