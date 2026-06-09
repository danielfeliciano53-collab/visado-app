'use client'
import { useState, useEffect } from 'react'

const GREEN_DARK = '#0F6E56'
const GREEN_LIGHT = '#E1F5EE'
const BORDER = '#E5E7EB'
const DARK = '#111510'
const MUTED = '#6B7280'

export default function CookieBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('visado_cookie_consent')
    if (!consent) setShow(true)
  }, [])

  function accept() {
    localStorage.setItem('visado_cookie_consent', 'accepted')
    setShow(false)
  }

  function decline() {
    localStorage.setItem('visado_cookie_consent', 'essential_only')
    setShow(false)
  }

  if (!show) return null

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000, padding: '16px 24px', background: '#fff', borderTop: `1px solid ${BORDER}`, boxShadow: '0 -4px 20px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
      <p style={{ margin: 0, fontSize: 13, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", flex: '1 1 400px', lineHeight: 1.6 }}>
        We use essential cookies for authentication and to keep you logged in. We don't use advertising or tracking cookies.{' '}
        <a href="/privacy" style={{ color: GREEN_DARK, textDecoration: 'underline' }}>Privacy Policy</a>
      </p>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button onClick={decline} style={{ padding: '8px 16px', background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 13, color: MUTED, cursor: 'pointer', fontFamily: "'Helvetica Neue', sans-serif" }}>
          Essential only
        </button>
        <button onClick={accept} style={{ padding: '8px 16px', background: GREEN_DARK, border: 'none', borderRadius: 8, fontSize: 13, color: '#fff', fontWeight: 600, cursor: 'pointer', fontFamily: "'Helvetica Neue', sans-serif" }}>
          Accept
        </button>
      </div>
    </div>
  )
}
