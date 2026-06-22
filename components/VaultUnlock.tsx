'use client'
import { useState } from 'react'
import { useVault } from '../lib/vaultContext'

const NAVY = '#1B2F6E'
const NAVY_DARK = '#111E47'
const NAVY_LIGHT = '#E8ECF7'
const GOLD = '#C9942A'
const DARK = '#111510'
const MUTED = '#6B7280'
const BORDER = '#E5E7EB'
const DANGER = '#EF4444'
const OFF_WHITE = '#F9F7F4'

interface VaultUnlockProps {
  userId: string
  isFirstTime: boolean
  onUnlocked: () => void
}

export default function VaultUnlock({ userId, isFirstTime, onUnlocked }: VaultUnlockProps) {
  const { unlock } = useVault()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [acknowledged, setAcknowledged] = useState(false)

  async function handleSubmit() {
    setError('')
    if (!password) { setError('Please enter a vault password.'); return }

    if (isFirstTime) {
      if (password.length < 8) { setError('Vault password must be at least 8 characters.'); return }
      if (password !== confirm) { setError('Passwords do not match.'); return }
      if (!acknowledged) { setError('You must acknowledge the recovery warning before continuing.'); return }
    }

    setLoading(true)
    try {
      await unlock(password, userId)
      onUnlocked()
    } catch (e) {
      setError('Failed to unlock vault. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(17,21,16,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 20 }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 36, width: '100%', maxWidth: 460, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>

        {/* Icon */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔐</div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: DARK, fontFamily: 'Georgia, serif' }}>
            {isFirstTime ? 'Set Up Your Vault' : 'Unlock Your Vault'}
          </h2>
          <p style={{ margin: '8px 0 0', fontSize: 14, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", lineHeight: 1.5 }}>
            {isFirstTime
              ? 'Create a separate password to protect your documents. This is different from your account password.'
              : 'Enter your vault password to access your documents.'}
          </p>
        </div>

        {/* First-time warning */}
        {isFirstTime && (
          <div style={{ background: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: 10, padding: 14, marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: '#92400E', fontFamily: "'Helvetica Neue', sans-serif", lineHeight: 1.6, fontWeight: 500 }}>
              ⚠️ <strong>Important:</strong> If you forget your vault password, your documents cannot be recovered — not by you, not by Visado support, not by anyone. There is no reset option. Write it down and keep it somewhere safe.
            </div>
          </div>
        )}

        {error && (
          <div style={{ background: '#FEF2F2', color: '#991B1B', fontSize: 13, padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontFamily: "'Helvetica Neue', sans-serif", border: '1px solid #FECACA' }}>
            {error}
          </div>
        )}

        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: DARK, marginBottom: 6, fontFamily: "'Helvetica Neue', sans-serif" }}>
          {isFirstTime ? 'Create Vault Password' : 'Vault Password'}
        </label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !isFirstTime && handleSubmit()}
          autoFocus
          placeholder={isFirstTime ? 'At least 8 characters' : 'Enter your vault password'}
          style={{ width: '100%', padding: '11px 14px', border: `1.5px solid ${BORDER}`, borderRadius: 10, fontSize: 15, marginBottom: 14, boxSizing: 'border-box', fontFamily: "'Helvetica Neue', sans-serif", outline: 'none' }}
        />

        {isFirstTime && (
          <>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: DARK, marginBottom: 6, fontFamily: "'Helvetica Neue', sans-serif" }}>
              Confirm Vault Password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Re-enter your vault password"
              style={{ width: '100%', padding: '11px 14px', border: `1.5px solid ${BORDER}`, borderRadius: 10, fontSize: 15, marginBottom: 16, boxSizing: 'border-box', fontFamily: "'Helvetica Neue', sans-serif", outline: 'none' }}
            />

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', marginBottom: 20 }}>
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={e => setAcknowledged(e.target.checked)}
                style={{ marginTop: 2, flexShrink: 0, width: 16, height: 16, cursor: 'pointer' }}
              />
              <span style={{ fontSize: 13, color: DARK, fontFamily: "'Helvetica Neue', sans-serif", lineHeight: 1.5 }}>
                I understand that if I forget my vault password, my documents are permanently unrecoverable and cannot be reset by Visado support.
              </span>
            </label>
          </>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !password}
          style={{ width: '100%', padding: '13px', background: NAVY_DARK, color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: loading || !password ? 'not-allowed' : 'pointer', fontFamily: "'Helvetica Neue', sans-serif", opacity: loading || !password ? 0.6 : 1 }}
        >
          {loading ? 'Unlocking...' : isFirstTime ? 'Create Vault Password →' : 'Unlock Vault →'}
        </button>

        {!isFirstTime && (
          <p style={{ textAlign: 'center', fontSize: 12, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginTop: 16, lineHeight: 1.5 }}>
            Your vault password is never sent to our servers. If you've forgotten it, unfortunately your documents cannot be recovered.
          </p>
        )}
      </div>
    </div>
  )
}
