'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiFetch, deleteCookie } from '../../lib/api'

const GREEN = '#1D9E75'
const GREEN_DARK = '#0F6E56'
const GREEN_LIGHT = '#E1F5EE'
const OFF_WHITE = '#F9F7F4'
const DARK = '#111510'
const MUTED = '#6B7280'
const BORDER = '#E5E7EB'
const DANGER = '#EF4444'
const WARN = '#F59E0B'

const VISA_LABELS: Record<string, string> = {
  d7: 'D7 Passive Income',
  d7_visa: 'D7 Passive Income',
  digital_nomad: 'Digital Nomad (D8)',
  golden_visa: 'Golden Visa',
  nhr: 'NHR Tax Status',
  unknown: 'Unknown',
}

interface KPIs {
  totalUsers: number
  proUsers: number
  freeUsers: number
  newUsersThisWeek: number
  onboardedUsers: number
  activeChatterIds: number
}

interface UserProfile {
  id: string
  full_name: string | null
  email: string
  plan: string | null
  visa_type: string | null
  guide_choice: string | null
  created_at: string
  onboarding_done: boolean | null
}

interface AdminData {
  kpis: KPIs
  visaBreakdown: Record<string, number>
  recentUsers: UserProfile[]
  recentSignups: UserProfile[]
}

function KPICard({ label, value, sub, color = DARK }: { label: string, value: string | number, sub?: string, color?: string }) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20 }}>
      <div style={{ fontSize: 11, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color, fontFamily: "'Helvetica Neue', sans-serif" }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function AdminPage() {
  const router = useRouter()
  const [data, setData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'revenue'>('dashboard')
  const [userFilter, setUserFilter] = useState<'all' | 'pro' | 'free' | 'cancelled'>('all')
  const [pinVerified, setPinVerified] = useState(false)
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState(false)
  const ADMIN_PIN = '1975'

  useEffect(() => { loadStats() }, [])

  async function loadStats() {
    setLoading(true)
    try {
      const res = await apiFetch('/api/admin/stats')
      if (res.status === 401) { router.push('/login'); return }
      if (res.status === 403) { setError('Access denied — admin only.'); setLoading(false); return }
      if (!res.ok) { setError('Failed to load stats.'); setLoading(false); return }
      const json = await res.json()
      setData(json)
    } catch (e) {
      setError('Connection error.')
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    deleteCookie('visado_token')
    deleteCookie('visado_user')
    router.push('/login')
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: OFF_WHITE, fontFamily: "'Helvetica Neue', sans-serif", color: MUTED, fontSize: 13 }}>
        Loading admin dashboard...
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: OFF_WHITE, fontFamily: "'Helvetica Neue', sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 16, color: DANGER, marginBottom: 16 }}>{error}</div>
          <button onClick={() => router.push('/dashboard')} style={{ padding: '10px 20px', background: GREEN_DARK, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: "'Helvetica Neue', sans-serif" }}>
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (!pinVerified) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: OFF_WHITE, fontFamily: "'Helvetica Neue', sans-serif" }}>
        <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 16, padding: 40, width: 320, textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
            <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: GREEN }} />
            <span style={{ fontSize: 18, fontWeight: 700, color: GREEN_DARK }}>Visado Admin</span>
          </div>
          <p style={{ fontSize: 14, color: MUTED, marginBottom: 20 }}>Enter admin PIN to continue</p>
          <input
            type="password"
            value={pinInput}
            onChange={e => setPinInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                if (pinInput === ADMIN_PIN) { setPinVerified(true) } else { setPinError(true); setPinInput('') }
              }
            }}
            placeholder="••••"
            style={{ width: '100%', padding: '11px 12px', border: `1.5px solid ${pinError ? DANGER : BORDER}`, borderRadius: 10, fontSize: 18, textAlign: 'center', letterSpacing: 8, fontFamily: "'Helvetica Neue', sans-serif", outline: 'none', boxSizing: 'border-box', marginBottom: 12 }}
          />
          {pinError && <div style={{ fontSize: 12, color: DANGER, marginBottom: 12, fontFamily: "'Helvetica Neue', sans-serif" }}>Incorrect PIN. Try again.</div>}
          <button
            onClick={() => { if (pinInput === ADMIN_PIN) { setPinVerified(true) } else { setPinError(true); setPinInput('') } }}
            style={{ width: '100%', padding: '11px', background: GREEN_DARK, color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'Helvetica Neue', sans-serif" }}>
            Enter
          </button>
        </div>
      </div>
    )
  }

  const { kpis, visaBreakdown, recentUsers, recentSignups } = data!

  // User filtering
  const filteredUsers = recentUsers.filter(u => {
    if (userFilter === 'pro') return u.plan === 'pro'
    if (userFilter === 'free') return u.plan !== 'pro' && u.plan !== 'cancelled'
    if (userFilter === 'cancelled') return u.plan === 'cancelled'
    return true
  })

  // Revenue estimates (based on pro users at $19.99/mo)
  const MRR = kpis.proUsers * 19.99
  const ARR = MRR * 12
  const cancelledUsers = recentUsers.filter(u => u.plan === 'cancelled')
  const churnRate = kpis.totalUsers > 0 ? Math.round((cancelledUsers.length / kpis.totalUsers) * 100) : 0

  return (
    <div style={{ minHeight: '100vh', background: OFF_WHITE, fontFamily: 'Georgia, serif' }}>

      {/* Header */}
      <div style={{ background: '#fff', borderBottom: `1px solid ${BORDER}`, padding: '0 32px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <a href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, fontWeight: 700, color: GREEN_DARK, textDecoration: 'none' }}>
            <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: GREEN }} />
            Visado
          </a>
          <span style={{ fontSize: 12, background: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: 99, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600 }}>ADMIN</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={loadStats} style={{ fontSize: 13, color: MUTED, background: 'none', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontFamily: "'Helvetica Neue', sans-serif" }}>
            ↻ Refresh
          </button>
          <button onClick={handleLogout} style={{ fontSize: 13, color: MUTED, background: 'none', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontFamily: "'Helvetica Neue', sans-serif" }}>
            Log out
          </button>
        </div>
      </div>

      <div style={{ padding: '32px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 700, color: DARK }}>Admin Dashboard</h1>
          <div style={{ fontSize: 13, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif" }}>
            Last updated: {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, borderBottom: `1px solid ${BORDER}`, marginBottom: 28 }}>
          {(['dashboard', 'users', 'revenue'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: '8px 16px', fontSize: 14, fontWeight: activeTab === tab ? 600 : 400, color: activeTab === tab ? GREEN_DARK : MUTED, background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Helvetica Neue', sans-serif", borderBottom: activeTab === tab ? `2px solid ${GREEN_DARK}` : '2px solid transparent', marginBottom: -1 }}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* ── DASHBOARD TAB ── */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* KPI cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <KPICard label="Total Users" value={kpis.totalUsers} sub="all time" />
              <KPICard label="Pro Users" value={kpis.proUsers} sub={`${Math.round((kpis.proUsers / Math.max(kpis.totalUsers, 1)) * 100)}% conversion`} color={GREEN_DARK} />
              <KPICard label="Free Users" value={kpis.freeUsers} sub="upgrade opportunity" />
              <KPICard label="New This Week" value={kpis.newUsersThisWeek} sub="last 7 days" color={kpis.newUsersThisWeek > 0 ? GREEN_DARK : DARK} />
              <KPICard label="Onboarded" value={kpis.onboardedUsers} sub={`${Math.round((kpis.onboardedUsers / Math.max(kpis.totalUsers, 1)) * 100)}% completed onboarding`} />
              <KPICard label="Active Chatters" value={kpis.activeChatterIds} sub="sent a message this week" color={kpis.activeChatterIds > 0 ? GREEN_DARK : DARK} />
              <KPICard label="Est. MRR" value={`$${MRR.toFixed(0)}`} sub="based on active Pro users" color={GREEN_DARK} />
            </div>

            {/* Visa breakdown */}
            <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24 }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: DARK, fontFamily: "'Helvetica Neue', sans-serif" }}>Visa Type Breakdown</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {Object.entries(visaBreakdown).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
                  <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 160, fontSize: 13, color: DARK, fontFamily: "'Helvetica Neue', sans-serif", flexShrink: 0 }}>
                      {VISA_LABELS[type] || type}
                    </div>
                    <div style={{ flex: 1, background: OFF_WHITE, borderRadius: 99, height: 8 }}>
                      <div style={{ background: GREEN, borderRadius: 99, height: 8, width: `${Math.round((count / kpis.totalUsers) * 100)}%`, transition: 'width 0.6s ease' }} />
                    </div>
                    <div style={{ width: 32, fontSize: 13, fontWeight: 600, color: DARK, fontFamily: "'Helvetica Neue', sans-serif", textAlign: 'right', flexShrink: 0 }}>{count}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Churned users */}
            <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: DARK, fontFamily: "'Helvetica Neue', sans-serif" }}>
                  Churned Users ({cancelledUsers.length})
                </h3>
                <span style={{ fontSize: 12, color: cancelledUsers.length > 0 ? DANGER : MUTED, fontFamily: "'Helvetica Neue', sans-serif" }}>
                  {churnRate}% churn rate
                </span>
              </div>
              {cancelledUsers.length === 0 ? (
                <div style={{ fontSize: 13, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif" }}>No churned users yet. 🎉</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {cancelledUsers.map(user => (
                    <div key={user.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: '#FEF2F2', borderRadius: 8, border: '1px solid #FCA5A5' }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#FCA5A5', color: DANGER, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                        {(user.full_name?.[0] || user.email[0]).toUpperCase()}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: DARK, fontFamily: "'Helvetica Neue', sans-serif" }}>{user.full_name || 'No name'}</div>
                        <div style={{ fontSize: 12, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif" }}>{user.email}</div>
                      </div>
                      <div style={{ fontSize: 11, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif" }}>{formatDate(user.created_at)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent signups */}
            <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24 }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: DARK, fontFamily: "'Helvetica Neue', sans-serif" }}>
                New Signups This Week ({recentSignups.length})
              </h3>
              {recentSignups.length === 0 ? (
                <div style={{ fontSize: 13, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif" }}>No new signups this week yet. Time to launch! 🚀</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {recentSignups.map(user => (
                    <div key={user.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: GREEN_LIGHT, borderRadius: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: GREEN_DARK, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                        {(user.full_name?.[0] || user.email[0]).toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: DARK, fontFamily: "'Helvetica Neue', sans-serif" }}>{user.full_name || 'No name'}</div>
                        <div style={{ fontSize: 12, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif" }}>{user.email} · {VISA_LABELS[user.visa_type || ''] || 'No visa selected'}</div>
                      </div>
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600, background: user.plan === 'pro' ? GREEN_LIGHT : '#F3F4F6', color: user.plan === 'pro' ? GREEN_DARK : MUTED, border: `1px solid ${user.plan === 'pro' ? GREEN : BORDER}`, flexShrink: 0 }}>
                        {user.plan === 'pro' ? 'Pro' : 'Free'}
                      </span>
                      <div style={{ fontSize: 11, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", flexShrink: 0 }}>
                        {formatDate(user.created_at)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── USERS TAB ── */}
        {activeTab === 'users' && (
          <div>
            {/* Filter buttons */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              {(['all', 'pro', 'free', 'cancelled'] as const).map(f => (
                <button key={f} onClick={() => setUserFilter(f)}
                  style={{ padding: '7px 16px', borderRadius: 20, border: `1px solid ${userFilter === f ? GREEN_DARK : BORDER}`, background: userFilter === f ? GREEN_LIGHT : '#fff', color: userFilter === f ? GREEN_DARK : MUTED, fontSize: 13, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: userFilter === f ? 600 : 400, cursor: 'pointer' }}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                  {f === 'all' && ` (${recentUsers.length})`}
                  {f === 'pro' && ` (${recentUsers.filter(u => u.plan === 'pro').length})`}
                  {f === 'free' && ` (${recentUsers.filter(u => u.plan !== 'pro' && u.plan !== 'cancelled').length})`}
                  {f === 'cancelled' && ` (${recentUsers.filter(u => u.plan === 'cancelled').length})`}
                </button>
              ))}
            </div>

            <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: "'Helvetica Neue', sans-serif" }}>
                  <thead>
                    <tr style={{ background: OFF_WHITE }}>
                      {['Name', 'Email', 'Plan', 'Visa', 'Guide', 'Onboarded', 'Joined'].map(h => (
                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `1px solid ${BORDER}`, whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr><td colSpan={7} style={{ padding: '24px 16px', textAlign: 'center', color: MUTED }}>No users in this category.</td></tr>
                    ) : filteredUsers.map((user, i) => (
                      <tr key={user.id} style={{ borderBottom: `1px solid ${BORDER}`, background: i % 2 === 0 ? '#fff' : OFF_WHITE }}>
                        <td style={{ padding: '10px 16px', color: DARK, fontWeight: 500 }}>{user.full_name || '—'}</td>
                        <td style={{ padding: '10px 16px', color: MUTED }}>{user.email}</td>
                        <td style={{ padding: '10px 16px' }}>
                          <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, fontWeight: 600, background: user.plan === 'pro' ? GREEN_LIGHT : user.plan === 'cancelled' ? '#FEF2F2' : '#F3F4F6', color: user.plan === 'pro' ? GREEN_DARK : user.plan === 'cancelled' ? DANGER : MUTED }}>
                            {user.plan === 'pro' ? 'Pro' : user.plan === 'cancelled' ? 'Cancelled' : 'Free'}
                          </span>
                        </td>
                        <td style={{ padding: '10px 16px', color: MUTED }}>{VISA_LABELS[user.visa_type || ''] || '—'}</td>
                        <td style={{ padding: '10px 16px', color: MUTED }}>{user.guide_choice ? (user.guide_choice === 'andreia' ? 'Andreia' : 'Joao') : '—'}</td>
                        <td style={{ padding: '10px 16px' }}>
                          <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, fontWeight: 600, background: user.onboarding_done ? GREEN_LIGHT : '#FEF3C7', color: user.onboarding_done ? GREEN_DARK : '#92400E' }}>
                            {user.onboarding_done ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td style={{ padding: '10px 16px', color: MUTED, whiteSpace: 'nowrap' }}>
                          {formatDate(user.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── REVENUE TAB ── */}
        {activeTab === 'revenue' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <KPICard label="MRR" value={`$${MRR.toFixed(2)}`} sub="monthly recurring revenue" color={GREEN_DARK} />
              <KPICard label="ARR" value={`$${ARR.toFixed(2)}`} sub="annualized run rate" color={GREEN_DARK} />
              <KPICard label="Paying Users" value={kpis.proUsers} sub={`at $19.99/mo`} color={GREEN_DARK} />
            </div>

            <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24 }}>
              <h3 style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 600, color: DARK, fontFamily: "'Helvetica Neue', sans-serif" }}>Revenue Note</h3>
              <p style={{ margin: 0, fontSize: 13, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", lineHeight: 1.6 }}>
                Revenue figures are estimated based on Pro user count at $19.99/month. For real-time revenue data, transaction history, and payout details, visit your{' '}
                <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer" style={{ color: GREEN_DARK, fontWeight: 600 }}>Stripe Dashboard</a>.
                {' '}Once Stripe webhook data is fully integrated, actual payment amounts will appear here automatically.
              </p>
            </div>

            <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24 }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: DARK, fontFamily: "'Helvetica Neue', sans-serif" }}>Subscription Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'Active Pro subscriptions', value: kpis.proUsers, color: GREEN_DARK },
                  { label: 'Free users (upgrade potential)', value: kpis.freeUsers, color: MUTED },
                  { label: 'Cancelled subscriptions', value: cancelledUsers.length, color: cancelledUsers.length > 0 ? DANGER : MUTED },
                  { label: 'Conversion rate (free → pro)', value: `${Math.round((kpis.proUsers / Math.max(kpis.totalUsers, 1)) * 100)}%`, color: GREEN_DARK },
                  { label: 'Churn rate', value: `${churnRate}%`, color: churnRate > 10 ? DANGER : churnRate > 5 ? WARN : GREEN_DARK },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 4 ? `1px solid ${BORDER}` : 'none' }}>
                    <span style={{ fontSize: 13, color: DARK, fontFamily: "'Helvetica Neue', sans-serif" }}>{row.label}</span>
                    <span style={{ fontSize: 15, fontWeight: 700, color: row.color, fontFamily: "'Helvetica Neue', sans-serif" }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
