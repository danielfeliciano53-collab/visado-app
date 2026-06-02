'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BACKEND, setCookie } from '../../lib/api'

const GREEN = '#1D9E75'
const GREEN_DARK = '#0F6E56'
const GREEN_LIGHT = '#E1F5EE'
const OFF_WHITE = '#F9F7F4'
const DARK = '#111510'
const MUTED = '#6B7280'
const BORDER = '#E5E7EB'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!email || !password) { setError('Please enter your email and password.'); return }
    setLoading(true)
    setError('')
    try {
      const endpoint = isSignup ? '/api/signup' : '/api/login'
      const res = await fetch(`${BACKEND}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Something went wrong.'); return }
      setCookie('visado_token', data.token || data.access_token, 30)
      setCookie('visado_user', JSON.stringify(data.user || {}), 30)
      if (isSignup || data.onboardingComplete === false) {
        router.push('/onboarding')
      } else {
        router.push('/dashboard')
      }
    } catch (e) {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div style={{ minHeight: '100vh', background: OFF_WHITE, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'Georgia, serif' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <a href="https://visadoapp.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 24, fontWeight: 700, color: GREEN_DARK, textDecoration: 'none' }}>
            <span style={{ display: 'inline-block', width: 9, height: 9, borderRadius: '50%', background: GREEN }} />
            Visado
          </a>
          <p style={{ marginTop: 12, fontSize: 16, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif" }}>
            {isSignup ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, border: `1px solid ${BORDER}`, padding: 32 }}>
          {error && (
            <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: 8, padding: '10px 14px', marginBottom: 20, fontSize: 13, color: '#991B1B', fontFamily: "'Helvetica Neue', sans-serif" }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: DARK, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 6 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={handleKey}
              placeholder="you@example.com"
              style={{ width: '100%', padding: '11px 12px', border: `1.5px solid ${BORDER}`, borderRadius: 10, fontSize: 14, fontFamily: "'Helvetica Neue', sans-serif", color: DARK, background: OFF_WHITE, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: DARK, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 6 }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={handleKey}
              placeholder="••••••••"
              style={{ width: '100%', padding: '11px 12px', border: `1.5px solid ${BORDER}`, borderRadius: 10, fontSize: 14, fontFamily: "'Helvetica Neue', sans-serif", color: DARK, background: OFF_WHITE, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ width: '100%', padding: '13px', background: GREEN_DARK, color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, fontFamily: "'Helvetica Neue', sans-serif", cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Please wait...' : isSignup ? 'Create Account' : 'Log In'}
          </button>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif" }}>
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button onClick={() => { setIsSignup(!isSignup); setError('') }} style={{ background: 'none', border: 'none', color: GREEN_DARK, fontWeight: 600, cursor: 'pointer', fontSize: 13, fontFamily: "'Helvetica Neue', sans-serif" }}>
              {isSignup ? 'Log in' : 'Sign up'}
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 11, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif" }}>
          By continuing you agree to our{' '}
          <a href="https://visado-backend.vercel.app/terms" style={{ color: GREEN_DARK }}>Terms</a>
          {' '}and{' '}
          <a href="https://visado-backend.vercel.app/privacy" style={{ color: GREEN_DARK }}>Privacy Policy</a>
        </p>
      </div>
    </div>
  )
}
