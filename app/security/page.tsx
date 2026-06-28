import Link from 'next/link'
const GREEN = '#1B2F6E'; const GREEN_DARK = '#111E47'; const GREEN_LIGHT = '#E8ECF7'; const GOLD = '#C9942A'; const OFF_WHITE = '#F9F7F4'; const DARK = '#111510'; const MUTED = '#6B7280'; const BORDER = '#E5E7EB';
export default function SecurityPage() {
  return (
    <div style={{ minHeight: '100vh', background: OFF_WHITE, fontFamily: 'Georgia, serif' }}>
      <nav style={{ background: '#fff', borderBottom: `1px solid ${BORDER}`, padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, fontWeight: 700, color: GREEN_DARK, textDecoration: 'none' }}>
          <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: GREEN }} />Visado
        </Link>
        <Link href="/login" style={{ fontSize: 13, color: MUTED, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif" }}>Log in</Link>
      </nav>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ background: GREEN_DARK, borderRadius: 16, padding: '28px 32px', marginBottom: 48 }}>
          <p style={{ margin: 0, fontSize: 16, color: 'rgba(255,255,255,0.9)', fontFamily: "'Helvetica Neue', sans-serif", lineHeight: 1.7 }}>
            "You're uploading your passport and your family's documents. You should know exactly what happens to them. Here's the full picture." — Daniel, Founder
          </p>
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: DARK, marginBottom: 8 }}>Security & AI Use</h1>
        <p style={{ fontSize: 14, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 48 }}>Last updated: June 2026</p>
        {[
          {
            title: 'Document Security',
            items: [
              { label: 'Encryption at rest', body: 'All documents uploaded to your vault are encrypted using AES-256 encryption in Supabase\'s cloud storage. This is the same standard used by major financial institutions.' },
              { label: 'Encryption in transit', body: 'All data transmitted between your browser and our servers uses TLS 1.2 or higher. Your documents are never sent over an unencrypted connection.' },
              { label: 'Access control', body: 'Your documents are accessible only to your account. We use signed URLs with short expiry times — there are no permanent public links to your files. Visado team members can only access your documents if you explicitly request support that requires it.' },
              { label: 'Retention and deletion', body: 'Your documents are stored for as long as your account is active. When you delete your account, all vault documents are permanently deleted within 30 days. We do not retain copies.' },
            ]
          },
          {
            title: 'AI Use — What You Should Know',
            items: [
              { label: 'Joao and Andreia are AI', body: 'Your guides are AI personas powered by Anthropic\'s Claude language model. They are not human advisors. They provide general guidance based on publicly available information and your onboarding profile.' },
              { label: 'What we send to Anthropic', body: 'When you chat with your guide, we send your message, your recent conversation history, and your onboarding profile (visa type, family situation, work background) to Anthropic\'s Claude API. This is what allows your guide to give personalized, contextual responses.' },
              { label: 'What we do not send', body: 'We do not send your uploaded documents to any AI system. Your vault contents stay in your vault. The only exception is the optional "Analyze with Joao" feature, which you must explicitly activate per document.' },
              { label: 'AI model training', body: 'Anthropic does not use conversations processed through the API to train their models. Your conversations are not used to improve Claude or any other AI system.' },
              { label: 'Not legal or immigration advice', body: 'Joao and Andreia provide general information and guidance. Nothing they say constitutes legal advice, immigration advice, or tax advice. For decisions with legal or financial consequences, consult a qualified Portuguese immigration lawyer or tax advisor.' },
            ]
          },
          {
            title: 'What Visado Does Not Do',
            items: [
              { label: 'We do not sell your data', body: 'We do not sell, rent, or trade your personal data or documents to any third party. Ever.' },
              { label: 'We do not share your documents', body: 'Your documents are not shared with any third party except the infrastructure providers required to store them (Supabase). Those providers cannot read your documents — they store encrypted bytes.' },
              { label: 'We do not use your documents for AI', body: 'Your vault documents are never automatically sent to any AI system. They are stored for your use only.' },
              { label: 'We do not use advertising trackers', body: 'Visado does not use advertising cookies, tracking pixels, or third-party analytics. The only cookie we set is the authentication token that keeps you logged in.' },
            ]
          },
          {
            title: 'Infrastructure & Providers',
            items: [
              { label: 'Supabase', body: 'Database and file storage. SOC 2 Type 2 certified. Data hosted on AWS infrastructure.' },
              { label: 'Vercel', body: 'Application hosting and edge delivery. SOC 2 Type 2 certified.' },
              { label: 'Anthropic', body: 'AI model provider (Claude). Powers Joao and Andreia. API data is not used for model training.' },
              { label: 'Stripe', body: 'Payment processing. PCI DSS Level 1 certified. Visado never sees or stores your card details.' },
              { label: 'Resend', body: 'Transactional email delivery (signup confirmation, password reset). No marketing emails without your consent.' },
            ]
          },
        ].map((section, si) => (
          <div key={si} style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: DARK, marginBottom: 20, paddingBottom: 12, borderBottom: `2px solid ${GREEN_LIGHT}` }}>{section.title}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {section.items.map((item, ii) => (
                <div key={ii} style={{ display: 'flex', gap: 16 }}>
                  <div style={{ width: 4, borderRadius: 2, background: GREEN_LIGHT, flexShrink: 0, marginTop: 4 }} />
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: DARK, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 4 }}>{item.label}</div>
                    <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: '#374151', fontFamily: "'Helvetica Neue', sans-serif" }}>{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div style={{ background: GREEN_LIGHT, borderRadius: 12, padding: '20px 24px', marginTop: 16 }}>
          <p style={{ margin: 0, fontSize: 14, color: GREEN_DARK, fontFamily: "'Helvetica Neue', sans-serif", lineHeight: 1.6 }}>
            Questions about security or how we handle your data? Email <strong>daniel@visadoapp.com</strong>. We'll respond within 2 business days.
          </p>
        </div>
      </div>
    </div>
  )
}
