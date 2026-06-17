'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const BACKEND_URL = 'https://visado-backend.vercel.app'
const NAVY = '#1B2F6E'
const NAVY_DARK = '#111E47'
const BORDER = '#E5E7EB'
const MUTED = '#6B7280'
const DARK = '#111510'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Incorrect password.')
        setLoading(false)
        return
      }
      localStorage.setItem('visado_admin_token', data.token)
      router.push('/admin')
    } catch (e) {
      setError('Connection error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9F7F4', fontFamily: 'Georgia, serif', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Image src="/visado-logo.png" alt="Visado" width={40} height={40} style={{ borderRadius: 8, marginBottom: 12 }} />
          <h1 style={{ fontSize: 22, fontWeight: 700, color: DARK, margin: 0 }}>Admin Access</h1>
          <p style={{ fontSize: 13, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginTop: 6 }}>Restricted area</p>
        </div>

        <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 16, padding: 32, border: `1px solid ${BORDER}` }}>
          {error && (
            <div style={{ background: '#FEF2F2', color: '#991B1B', fontSize: 13, padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontFamily: "'Helvetica Neue', sans-serif", border: '1px solid #FECACA' }}>
              {error}
            </div>
          )}
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: DARK, marginBottom: 8, fontFamily: "'Helvetica Neue', sans-serif" }}>
            Admin Password
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoFocus
            style={{ width: '100%', padding: '12px 14px', border: `1.5px solid ${BORDER}`, borderRadius: 10, fontSize: 15, color: DARK, background: '#fff', fontFamily: "'Helvetica Neue', sans-serif", outline: 'none', boxSizing: 'border-box', marginBottom: 20 }}
          />
          <button
            type="submit"
            disabled={loading || !password}
            style={{ width: '100%', padding: '13px', background: NAVY_DARK, color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: loading || !password ? 'not-allowed' : 'pointer', fontFamily: "'Helvetica Neue', sans-serif", opacity: loading || !password ? 0.6 : 1 }}
          >
            {loading ? 'Checking...' : 'Enter →'}
          </button>
        </form>
      </div>
    </div>
  )
}
