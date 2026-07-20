'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../components/Sidebar'
import MobileHeader from '../../components/MobileHeader'
import { apiFetch, deleteCookie } from '../../lib/api'

const GREEN = '#1B2F6E'
const GREEN_DARK = '#111E47'
const GREEN_LIGHT = '#E8ECF7'
const OFF_WHITE = '#F9F7F4'
const DARK = '#111510'
const MUTED = '#6B7280'
const BORDER = '#E5E7EB'
const DANGER = '#EF4444'
const GOLD = '#C9942A'

const STRIPE_PAYMENT_LINK = ''

const VISA_OPTIONS = [
  { value: 'd7', label: 'D7 Passive Income Visa' },
  { value: 'digital_nomad', label: 'Digital Nomad Visa (D8)' },
  { value: 'golden_visa', label: 'Golden Visa' },
  { value: 'nhr', label: 'NHR Tax Status' },
]

interface Profile {
  id?: string
  full_name?: string
  email?: string
  plan?: string
  visa_type?: string
  guide_choice?: string
  journey_stage?: string
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}` }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: DARK, fontFamily: "'Helvetica Neue', sans-serif" }}>{title}</h3>
      </div>
      <div style={{ padding: '20px' }}>
        {children}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

export default function AccountPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // Form state
  const [fullName, setFullName] = useState('')
  const [visaType, setVisaType] = useState('d7')
  const [guideChoice, setGuideChoice] = useState('joao')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [cancelConfirm, setCancelConfirm] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile((window.screen?.width || 1440) <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => { loadProfile() }, [])

  async function loadProfile() {
    setLoading(true)
    try {
      const res = await apiFetch('/api/profile')
      if (res.status === 401) { router.push('/login'); return }
      const data = await res.json()
      const p = data.profile || {}
      setProfile(p)
      setFullName(p.full_name || '')
      setVisaType(p.visa_type || 'd7')
      setGuideChoice(p.guide_choice || 'joao')
    } catch (e) {
      console.error('Profile load error', e)
    } finally {
      setLoading(false)
    }
  }

  async function saveProfile() {
    setSaving(true)
    setSuccessMsg('')
    setErrorMsg('')
    try {
      const res = await apiFetch('/api/profile', {
        method: 'PATCH',
        body: JSON.stringify({
          full_name: fullName,
          visa_type: visaType,
          guide_choice: guideChoice,
        }),
      })
      if (res.ok) {
        setSuccessMsg('Profile updated successfully.')
        setProfile(prev => ({ ...prev, full_name: fullName, visa_type: visaType, guide_choice: guideChoice }))
        setTimeout(() => setSuccessMsg(''), 3000)
      } else {
        const err = await res.json()
        setErrorMsg(err.error || 'Failed to save. Please try again.')
      }
    } catch (e) {
      setErrorMsg('Connection error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function changePassword() {
    if (!newPassword || !confirmPassword) { setErrorMsg('Please enter and confirm your new password.'); return }
    if (newPassword !== confirmPassword) { setErrorMsg('Passwords do not match.'); return }
    if (newPassword.length < 8) { setErrorMsg('Password must be at least 8 characters.'); return }

    setSavingPassword(true)
    setSuccessMsg('')
    setErrorMsg('')
    try {
      const res = await apiFetch('/api/change-password', {
        method: 'POST',
        body: JSON.stringify({ password: newPassword }),
      })
      if (res.ok) {
        setSuccessMsg('Password changed successfully.')
        setNewPassword('')
        setConfirmPassword('')
        setTimeout(() => setSuccessMsg(''), 3000)
      } else {
        const err = await res.json()
        setErrorMsg(err.error || 'Failed to change password.')
      }
    } catch (e) {
      setErrorMsg('Connection error. Please try again.')
    } finally {
      setSavingPassword(false)
    }
  }

  async function cancelSubscription() {
    try {
      const res = await apiFetch('/api/cancel-subscription', { method: 'POST' })
      if (res.ok) {
        setSuccessMsg('Subscription cancelled. You will retain Pro access until the end of your billing period.')
        setProfile(prev => ({ ...prev, plan: 'free' }))
        setCancelConfirm(false)
        setTimeout(() => setSuccessMsg(''), 5000)
      } else {
        const err = await res.json()
        setErrorMsg(err.error || 'Failed to cancel subscription.')
      }
    } catch (e) {
      setErrorMsg('Connection error. Please try again.')
    }
  }

  function handleLogout() {
    deleteCookie('visado_token')
    deleteCookie('visado_user')
    router.push('/login')
  }

  async function handleDeleteAccount() {
    try {
      const res = await apiFetch('/api/delete-account', { method: 'DELETE' })
      if (res.ok) {
        deleteCookie('visado_token')
        deleteCookie('visado_user')
        router.push('/')
      } else {
        const err = await res.json()
        setErrorMsg(err.error || 'Failed to delete account. Please contact support.')
      }
    } catch (e) {
      setErrorMsg('Connection error. Please try again.')
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: OFF_WHITE, fontFamily: "'Helvetica Neue', sans-serif", color: MUTED, fontSize: 13 }}>
        Loading your account...
      </div>
    )
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    border: `1.5px solid ${BORDER}`,
    borderRadius: 8,
    fontSize: 14,
    fontFamily: "'Helvetica Neue', sans-serif",
    color: DARK,
    background: OFF_WHITE,
    outline: 'none',
    boxSizing: 'border-box' as const,
  }

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer',
    appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    paddingRight: 32,
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: OFF_WHITE, fontFamily: 'Georgia, serif' }}>
      {!isMobile && <Sidebar activePage="account" profile={profile} onLogout={handleLogout} />}
      {isMobile && <MobileHeader activePage="account" profile={profile} onLogout={handleLogout} />}

      <div style={{ flex: 1, minWidth: 0, paddingTop: isMobile ? 56 : 0, overflowX: 'hidden' }}>
        <div style={{ padding: isMobile ? '24px 16px' : '32px', maxWidth: 640 }}>

          <h1 style={{ margin: '0 0 24px', fontSize: isMobile ? 22 : 26, fontWeight: 700, color: DARK }}>Account</h1>

          {/* Success / error messages */}
          {successMsg && (
            <div style={{ background: GREEN_LIGHT, border: `1px solid ${GREEN}`, borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: GREEN_DARK, fontFamily: "'Helvetica Neue', sans-serif" }}>
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#991B1B', fontFamily: "'Helvetica Neue', sans-serif" }}>
              {errorMsg}
            </div>
          )}

          {/* Plan status */}
          <Section title="Plan">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20, fontWeight: 700, color: DARK, fontFamily: "'Helvetica Neue', sans-serif" }}>
                    {profile.plan === 'pro' ? 'Pro' : 'Free'} Plan
                  </span>
                  <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 99, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 700, background: profile.plan === 'pro' ? GREEN_LIGHT : '#F3F4F6', color: profile.plan === 'pro' ? GREEN_DARK : MUTED }}>
                    {profile.plan === 'pro' ? 'ACTIVE' : 'FREE'}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginTop: 4 }}>
                  {profile.plan === 'pro'
                    ? 'Full access to all features including unlimited chat, vault storage, and priority support.'
                    : 'Upgrade to Pro for unlimited chat, full vault access, and priority support.'}
                </div>
              </div>
              {profile.plan !== 'pro' && (
                <button onClick={async () => {
                  try {
                    const res = await apiFetch('/api/stripe-checkout')
                    const json = await res.json()
                    if (json.url) window.location.href = json.url
                  } catch (e) {
                    console.error('Checkout error', e)
                  }
                }} style={{ padding: '10px 20px', background: GREEN_DARK, color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: "'Helvetica Neue', sans-serif", flexShrink: 0 }}>Upgrade to Pro</button>
              )}
            </div>

            {profile.plan === 'pro' && !cancelConfirm && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${BORDER}` }}>
                <button onClick={() => setCancelConfirm(true)}
                  style={{ fontSize: 13, color: DANGER, background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Helvetica Neue', sans-serif", padding: 0, textDecoration: 'underline' }}>
                  Cancel subscription
                </button>
              </div>
            )}

            {cancelConfirm && (
              <div style={{ marginTop: 16, padding: '14px', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: DARK, fontFamily: "'Helvetic Neue', sans-serif", marginBottom: 12, fontWeight: 600 }}>
                  Are you sure you want to cancel?
                </div>
                <div style={{ fontSize: 13, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 12 }}>
                  You'll retain Pro access until the end of your current billing period.
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={cancelSubscription}
                    style={{ padding: '8px 16px', background: DANGER, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Helvetica Neue', sans-serif" }}>
                    Yes, cancel
                  </button>
                  <button onClick={() => setCancelConfirm(false)}
                    style={{ padding: '8px 16px', background: '#fff', color: MUTED, border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: "'Helvetica Neue', sans-serif" }}>
                    Keep my plan
                  </button>
                </div>
              </div>
            )}
          </Section>

          {/* Profile */}
          <Section title="Profile">
            <Field label="Full Name">
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} style={inputStyle} placeholder="Your full name" />
            </Field>
            <Field label="Email">
              <input type="email" value={profile.email || ''} disabled style={{ ...inputStyle, background: '#F3F4F6', color: MUTED, cursor: 'not-allowed' }} />
              <div style={{ fontSize: 11, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginTop: 4 }}>Email cannot be changed.</div>
            </Field>
            <Field label="Visa Type">
              <select value={visaType} onChange={e => setVisaType(e.target.value)} style={selectStyle}>
                {VISA_OPTIONS.map(v => (
                  <option key={v.value} value={v.value}>{v.label}</option>
                ))}
              </select>
              <div style={{ fontSize: 11, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginTop: 4 }}>
                Changing your visa type will update your checklist and chat guidance.
              </div>
            </Field>

            <button onClick={saveProfile} disabled={saving}
              style={{ padding: '10px 24px', background: GREEN_DARK, color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, fontFamily: "'Helvetica Neue', sans-serif" }}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </Section>

          {/* Guide preference */}
          <Section title="Your Visado Guide">
            <div style={{ fontSize: 13, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 16 }}>
              Choose who guides you through your Portugal journey.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { value: 'joao', name: 'Joao', description: 'Warm, methodical, deeply practical. Former Lisbon architect turned expat guide.' },
                { value: 'andreia', name: 'Andreia', description: 'Energetic, direct, and funny. Navigated the D7 process herself and loves helping others.' },
              ].map(guide => (
                <div key={guide.value} onClick={() => setGuideChoice(guide.value)}
                  style={{ padding: 16, borderRadius: 10, border: `2px solid ${guideChoice === guide.value ? GREEN_DARK : BORDER}`, background: guideChoice === guide.value ? GREEN_LIGHT : '#fff', cursor: 'pointer', transition: 'all 0.15s' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: GREEN_DARK, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18, marginBottom: 10 }}>
                    {guide.name[0]}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: DARK, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 4 }}>{guide.name}</div>
                  <div style={{ fontSize: 12, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", lineHeight: 1.5 }}>{guide.description}</div>
                </div>
              ))}
            </div>
            <button onClick={saveProfile} disabled={saving}
              style={{ marginTop: 16, padding: '10px 24px', background: GREEN_DARK, color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, fontFamily: "'Helvetica Neue', sans-serif" }}>
              {saving ? 'Saving...' : 'Save Guide'}
            </button>
          </Section>

          {/* Change password */}
          <Section title="Change Password">
            <Field label="New Password">
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} style={inputStyle} placeholder="Min 8 characters" />
            </Field>
            <Field label="Confirm New Password">
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={inputStyle} placeholder="Re-enter new password" />
            </Field>
            <button onClick={changePassword} disabled={savingPassword}
              style={{ padding: '10px 24px', background: GREEN_DARK, color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: savingPassword ? 'not-allowed' : 'pointer', opacity: savingPassword ? 0.7 : 1, fontFamily: "'Helvetica Neue', sans-serif" }}>
              {savingPassword ? 'Changing...' : 'Change Password'}
            </button>
          </Section>

          {/* Danger zone */}
          <Section title="Session">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button onClick={handleLogout}
                style={{ padding: '10px 24px', background: '#fff', color: DANGER, border: `1px solid #FCA5A5`, borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'Helvetica Neue', sans-serif", alignSelf: 'flex-start' }}>
                Log out
              </button>
              {!deleteConfirm ? (
                <button onClick={() => setDeleteConfirm(true)}
                  style={{ padding: '10px 24px', background: 'none', color: MUTED, border: 'none', fontSize: 13, cursor: 'pointer', fontFamily: "'Helvetica Neue', sans-serif", textDecoration: 'underline', alignSelf: 'flex-start', paddingLeft: 0 }}>
                  Delete my account and all data
                </button>
              ) : (
                <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 8, padding: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: DARK, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 8 }}>
                    This will permanently delete your account, all documents, and all data. This cannot be undone.
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={handleDeleteAccount}
                      style={{ padding: '8px 16px', background: DANGER, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Helvetica Neue', sans-serif" }}>
                      Yes, delete everything
                    </button>
                    <button onClick={() => setDeleteConfirm(false)}
                      style={{ padding: '8px 16px', background: '#fff', color: MUTED, border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: "'Helvetica Neue', sans-serif" }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Section>

        </div>
      </div>
    </div>
  )
}
