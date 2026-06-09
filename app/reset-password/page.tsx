'use client'
import { useState } from 'react'
import Link from 'next/link'

const GREEN = '#1D9E75'
const GREEN_DARK = '#0F6E56'
const GREEN_LIGHT = '#E1F5EE'
const OFF_WHITE = '#F9F7F4'
const DARK = '#111510'
const MUTED = '#6B7280'
const BORDER = '#E5E7EB'
const BACKEND_URL = 'https://visado-backend.vercel.app'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await fetch(`${BACKEND_URL}/api/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setDone(true)
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: OFF_WHITE, fontFamily: 'Georgia, serif', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 32 }}>
          <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: GREEN }} />
          <span style={{ fontSize: 18, fontWeight: 700, color: GREEN_DARK }}>Visado</span>
        </Link>

        {done ? (
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: DARK, marginBottom: 12 }}>Check your email</h1>
            <p style={{ fontSize: 15, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", lineHeight: 1.6, marginBottom: 24 }}>
              If an account exists for that email, we've sent a password reset link. Check your inbox and spam folder.
            </p>
            <Link href="/login" style={{ fontSize: 14, color: GREEN_DARK, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600, textDecoration: 'none' }}>
              ← Back to login
            </Link>
          </div>
        ) : (
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: DARK, marginBottom: 8 }}>Reset your password</h1>
            <p style={{ fontSize: 15, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 28 }}>Enter your email and we'll send you a reset link.</p>
            {error && (
              <div style={{ background: '#FEF2F2', color: '#991B1B', fontSize: 14, padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontFamily: "'Helvetica Neue', sans-serif", border: '1px solid #FECACA' }}>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: DARK, marginBottom: 6, fontFamily: "'Helvetica Neue', sans-serif" }}>Email address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
                  style={{ width: '100%', padding: '11px 14px', border: `1.5px solid ${BORDER}`, borderRadius: 10, fontSize: 15, color: DARK, background: '#fff', fontFamily: "'Helvetica Neue', sans-serif", outline: 'none', boxSizing: 'border-box' as const }} />
              </div>
              <button type="submit" disabled={loading}
                style={{ width: '100%', padding: '13px', background: GREEN_DARK, color: '#fff', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'Helvetica Neue', sans-serif", opacity: loading ? 0.7 : 1, marginBottom: 16 }}>
                {loading ? 'Sending...' : 'Send reset link'}
              </button>
            </form>
            <Link href="/login" style={{ display: 'block', textAlign: 'center', fontSize: 14, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", textDecoration: 'none' }}>
              ← Back to login
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
