'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const BACKEND_URL = 'https://visado-backend.vercel.app'

export default function UpdatePasswordPage() {
  const [token, setToken] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [complete, setComplete] = useState(false)

  useEffect(() => {
    const hash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash
    const accessToken = new URLSearchParams(hash).get('access_token')
    if (!accessToken) {
      setError('This password reset link is invalid or has expired. Please request a new one.')
      return
    }
    setToken(accessToken)
  }, [])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError('')

    if (!token) {
      setError('This password reset link is invalid or has expired. Please request a new one.')
      return
    }
    if (password.length < 8) {
      setError('Your new password must be at least 8 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('The passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${BACKEND_URL}/api/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      })
      const data = await response.json()
      if (!response.ok || data.error) {
        setError(data.error || 'Unable to update your password. Please request a new reset link.')
        return
      }
      setComplete(true)
      setPassword('')
      setConfirmPassword('')
    } catch {
      setError('Unable to update your password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9F7F4', padding: 24, fontFamily: "'Helvetica Neue', sans-serif" }}>
      <section style={{ width: '100%', maxWidth: 420 }}>
        <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 32, color: '#0F6E56', fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 700, textDecoration: 'none' }}>
          <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#1D9E75' }} />
          Visado
        </Link>

        {complete ? (
          <div>
            <h1 style={{ margin: '0 0 12px', color: '#111510', fontFamily: 'Georgia, serif', fontSize: 26 }}>Password updated</h1>
            <p style={{ margin: '0 0 24px', color: '#6B7280', fontSize: 15, lineHeight: 1.6 }}>Your password has been changed. You can now sign in with your new password.</p>
            <Link href="/login" style={{ color: '#0F6E56', fontWeight: 600, textDecoration: 'none' }}>Go to login</Link>
          </div>
        ) : (
          <>
            <h1 style={{ margin: '0 0 8px', color: '#111510', fontFamily: 'Georgia, serif', fontSize: 26 }}>Choose a new password</h1>
            <p style={{ margin: '0 0 28px', color: '#6B7280', fontSize: 15, lineHeight: 1.6 }}>Use at least 8 characters and keep it unique to Visado.</p>
            {error && <p role="alert" style={{ margin: '0 0 16px', border: '1px solid #FECACA', borderRadius: 8, background: '#FEF2F2', color: '#991B1B', padding: '10px 14px', fontSize: 14 }}>{error}</p>}
            <form onSubmit={handleSubmit}>
              <label style={{ display: 'block', marginBottom: 16, color: '#111510', fontSize: 13, fontWeight: 600 }}>
                New password
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required autoComplete="new-password" style={{ boxSizing: 'border-box', display: 'block', width: '100%', marginTop: 6, border: '1.5px solid #E5E7EB', borderRadius: 10, padding: '11px 14px', fontSize: 15 }} />
              </label>
              <label style={{ display: 'block', marginBottom: 20, color: '#111510', fontSize: 13, fontWeight: 600 }}>
                Confirm new password
                <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength={8} required autoComplete="new-password" style={{ boxSizing: 'border-box', display: 'block', width: '100%', marginTop: 6, border: '1.5px solid #E5E7EB', borderRadius: 10, padding: '11px 14px', fontSize: 15 }} />
              </label>
              <button type="submit" disabled={loading || !token} style={{ width: '100%', border: 0, borderRadius: 10, background: '#0F6E56', color: '#fff', cursor: loading || !token ? 'not-allowed' : 'pointer', opacity: loading || !token ? 0.7 : 1, padding: '13px', fontSize: 16, fontWeight: 600 }}>
                {loading ? 'Updating…' : 'Update password'}
              </button>
            </form>
          </>
        )}
      </section>
    </main>
  )
}
