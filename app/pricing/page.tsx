export default function PricingPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif', background: '#F9F7F4' }}>
      <div style={{ textAlign: 'center', maxWidth: 500, padding: '0 24px' }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, color: '#111510', marginBottom: 16 }}>Pricing</h1>
        <p style={{ fontSize: 18, color: '#6B7280', fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 32 }}>Simple pricing. Start free, upgrade when you're ready.</p>
        <a href="https://app.visadoapp.com/login" style={{ display: 'inline-block', padding: '14px 32px', background: '#0F6E56', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontFamily: "'Helvetica Neue', sans-serif", fontSize: 16 }}>Get started free →</a>
      </div>
    </div>
  )
}
