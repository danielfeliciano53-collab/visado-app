'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const BACKEND_URL = 'https://visado-backend.vercel.app'

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=604800; SameSite=Lax; Secure`
}


export default function LoginPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.location.hostname.startsWith('app.')) {
      window.location.href = 'https://app.visadoapp.com/login'
    }
  }, [])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  function handleGoogleLogin() {
    window.location.href = `${BACKEND_URL}/api/auth/google`
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${BACKEND_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setError(data.error || 'Incorrect email or password.')
      } else {
        setCookie('visado_token', data.token || data.access_token)
        setCookie('visado_user', JSON.stringify(data.user))
        if (!data.onboardingComplete) {
          router.push('/onboarding')
          return
        }
        router.push('/dashboard')
      }
    } catch (e) {
      console.error('Login error:', e)
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const res = await fetch(`${BACKEND_URL}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name: name }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Signup failed. Please try again.')
      } else {
        setSuccess('Check your email to confirm your account, then come back to log in.')
        setEmail('')
        setPassword('')
        setName('')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  const features = [
    'Personalized D7 & D8 visa roadmap',
    'AI guide who knows your situation',
    'Secure document vault',
    'Phase-by-phase journey tracking',
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Georgia, serif', background: '#F9F7F4' }}>

      {/* Left panel — hidden on mobile */}
      {!isMobile && (
        <div style={{ flex: '1 1 480px', background: '#0F6E56', display: 'flex', flexDirection: 'column', padding: '48px', position: 'relative', overflow: 'hidden' }}>
          {/* Background texture */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(29,158,117,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(15,110,86,0.4) 0%, transparent 50%)', pointerEvents: 'none' }} />

          {/* Logo */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <a href="https://visadoapp.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <span style={{ display: 'inline-block', width: 9, height: 9, borderRadius: '50%', background: '#9FE1CB' }} />
              <span style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>Visado</span>
            </a>
          </div>

          {/* Main copy */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 1, padding: '48px 0' }}>
            <h2 style={{ fontSize: 36, fontWeight: 700, color: '#fff', letterSpacing: '-1px', lineHeight: 1.2, margin: '0 0 16px' }}>
              Your move to Portugal<br />starts here.
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,0.72)', fontFamily: "'Helvetica Neue', sans-serif", margin: '0 0 40px', maxWidth: 380 }}>
              Joao and Andreia are ready to guide you through every step — from your first document to your residency card.
            </p>

            {/* Feature list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
              {features.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: "'Helvetica Neue', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>
                  <span style={{ color: '#9FE1CB', fontWeight: 700, fontSize: 14 }}>✓</span>
                  {f}
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: '20px 24px', borderLeft: '3px solid #9FE1CB' }}>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: 'rgba(255,255,255,0.85)', fontStyle: 'italic', margin: '0 0 10px' }}>
                "I wish I'd had this when we moved. Would have saved us weeks of confusion."
              </p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: 0, fontFamily: "'Helvetica Neue', sans-serif" }}>— American expat, Lisbon</p>
            </div>
          </div>

          {/* Bottom note */}
          <p style={{ position: 'relative', zIndex: 1, fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: "'Helvetica Neue', sans-serif", margin: 0 }}>
            Not legal advice. For complex situations, consult an immigration attorney.
          </p>
        </div>
      )}

      {/* Right panel */}
      <div style={{ flex: '1 1 480px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '40px 24px' : '48px 24px' }}>
        <div style={{ width: '100%', maxWidth: 440 }}>

          {/* Mobile logo */}
          {isMobile && (
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <a href="https://visadoapp.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#1D9E75' }} />
                <span style={{ fontSize: 22, fontWeight: 700, color: '#0F6E56' }}>Visado</span>
              </a>
            </div>
          )}

          {/* Tabs */}
          <div style={{ display: 'flex', background: '#EFEFEF', borderRadius: 10, padding: 4, marginBottom: 28 }}>
            {(['login', 'signup'] as const).map(t => (
              <button key={t} onClick={() => { setTab(t); setError(''); setSuccess('') }}
                style={{ flex: 1, padding: '9px', border: 'none', background: tab === t ? '#fff' : 'transparent', borderRadius: 8, fontSize: 14, fontWeight: tab === t ? 600 : 500, color: tab === t ? '#111510' : '#6B7280', cursor: 'pointer', fontFamily: "'Helvetica Neue', sans-serif", boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.15s' }}>
                {t === 'login' ? 'Log in' : 'Sign up'}
              </button>
            ))}
          </div>

          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#111510', letterSpacing: '-0.5px', margin: '0 0 6px' }}>
            {tab === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p style={{ fontSize: 15, color: '#6B7280', fontFamily: "'Helvetica Neue', sans-serif", margin: '0 0 24px' }}>
            {tab === 'login' ? 'Log in to continue your Portugal journey.' : 'Free to start. Your guide is waiting.'}
          </p>

          {/* Google button */}
          <button onClick={handleGoogleLogin} disabled={loading}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '12px', border: '1.5px solid #E5E7EB', borderRadius: 10, background: '#fff', fontSize: 15, fontWeight: 500, color: '#111510', cursor: 'pointer', fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 20, transition: 'all 0.15s' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            {tab === 'login' ? 'Continue with Google' : 'Sign up with Google'}
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
            <span style={{ fontSize: 12, color: '#6B7280', fontFamily: "'Helvetica Neue', sans-serif", whiteSpace: 'nowrap' }}>or continue with email</span>
            <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
          </div>

          {error && (
            <div style={{ background: '#FEF2F2', color: '#991B1B', fontSize: 14, padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontFamily: "'Helvetica Neue', sans-serif", border: '1px solid #FECACA' }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ background: '#F0FDF4', color: '#166534', fontSize: 14, padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontFamily: "'Helvetica Neue', sans-serif", border: '1px solid #BBF7D0' }}>
              {success}
            </div>
          )}

          <form onSubmit={tab === 'login' ? handleLogin : handleSignup}>
            {tab === 'signup' && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#111510', marginBottom: 6, fontFamily: "'Helvetica Neue', sans-serif" }}>Full name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Your name"
                  style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E5E7EB', borderRadius: 10, fontSize: 15, color: '#111510', background: '#fff', fontFamily: "'Helvetica Neue', sans-serif", outline: 'none', boxSizing: 'border-box' as const }} />
              </div>
            )}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#111510', marginBottom: 6, fontFamily: "'Helvetica Neue', sans-serif" }}>Email address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E5E7EB', borderRadius: 10, fontSize: 15, color: '#111510', background: '#fff', fontFamily: "'Helvetica Neue', sans-serif", outline: 'none', boxSizing: 'border-box' as const }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#111510', fontFamily: "'Helvetica Neue', sans-serif" }}>Password</label>
                {tab === 'login' && (
                  <a href="/reset-password" style={{ fontSize: 12, color: '#0F6E56', textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif" }}>Forgot password?</a>
                )}
              </div>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                placeholder={tab === 'signup' ? 'At least 8 characters' : 'Your password'}
                minLength={tab === 'signup' ? 8 : undefined}
                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E5E7EB', borderRadius: 10, fontSize: 15, color: '#111510', background: '#fff', fontFamily: "'Helvetica Neue', sans-serif", outline: 'none', boxSizing: 'border-box' as const }} />
            </div>
            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '13px', background: '#0F6E56', color: '#fff', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'Helvetica Neue', sans-serif", opacity: loading ? 0.7 : 1, marginBottom: 20 }}>
              {loading ? 'Please wait...' : tab === 'login' ? 'Log in →' : 'Create account →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 14, color: '#6B7280', fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 16 }}>
            {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => { setTab(tab === 'login' ? 'signup' : 'login'); setError(''); setSuccess('') }}
              style={{ background: 'none', border: 'none', color: '#0F6E56', fontWeight: 600, fontSize: 14, cursor: 'pointer', padding: 0, fontFamily: "'Helvetica Neue', sans-serif" }}>
              {tab === 'login' ? 'Sign up free' : 'Log in'}
            </button>
          </p>

          <p style={{ textAlign: 'center', fontSize: 12, color: '#6B7280', fontFamily: "'Helvetica Neue', sans-serif", lineHeight: 1.6 }}>
            By continuing, you agree to Visado's{' '}
            <a href="https://visado-backend.vercel.app/terms" style={{ color: '#6B7280', textDecoration: 'underline' }}>Terms</a>
            {' '}and{' '}
            <a href="https://visado-backend.vercel.app/privacy" style={{ color: '#6B7280', textDecoration: 'underline' }}>Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
