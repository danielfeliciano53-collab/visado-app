'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiFetch } from '../../lib/api'

const GREEN = '#1D9E75'
const GREEN_DARK = '#0F6E56'
const GREEN_LIGHT = '#E1F5EE'
const OFF_WHITE = '#F9F7F4'
const DARK = '#111510'
const MUTED = '#6B7280'
const BORDER = '#E5E7EB'

const TOTAL_STEPS = 4

function OptionCard({ selected, onClick, children }: { selected: boolean, onClick: () => void, children: React.ReactNode }) {
  return (
    <div onClick={onClick} style={{
      padding: '14px 16px',
      borderRadius: 10,
      border: `2px solid ${selected ? GREEN_DARK : BORDER}`,
      background: selected ? GREEN_LIGHT : '#fff',
      cursor: 'pointer',
      transition: 'all 0.15s',
      fontFamily: "'Helvetica Neue', sans-serif",
      fontSize: 14,
      color: selected ? GREEN_DARK : DARK,
      fontWeight: selected ? 600 : 400,
    }}>
      {children}
    </div>
  )
}

function StepHeader({ step, title, subtitle }: { step: number, title: string, subtitle: string }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 12, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 8 }}>
        Step {step} of {TOTAL_STEPS}
      </div>
      <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 700, color: DARK }}>{title}</h2>
      <p style={{ margin: 0, fontSize: 14, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", lineHeight: 1.6 }}>{subtitle}</p>
    </div>
  )
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Step 1
  const [fullName, setFullName] = useState('')
  const [ageRange, setAgeRange] = useState('')
  const [originState, setOriginState] = useState('')

  // Step 2
  const [visaType, setVisaType] = useState('')
  const [moveDate, setMoveDate] = useState('')
  const [familySituation, setFamilySituation] = useState('')

  // Step 3
  const [workBackground, setWorkBackground] = useState('')
  const [bureaucracyComfort, setBureaucracyComfort] = useState('')
  const [biggestConcern, setBiggestConcern] = useState('')

  // Step 4
  const [guideChoice, setGuideChoice] = useState('')
  const [commStyle, setCommStyle] = useState('')

  function canProceed() {
    if (step === 1) return fullName.trim() && ageRange && originState.trim()
    if (step === 2) return visaType && familySituation
    if (step === 3) return workBackground && bureaucracyComfort && biggestConcern
    if (step === 4) return guideChoice && commStyle
    return false
  }

  async function finish() {
    setSaving(true)
    setError('')
    try {
      const res = await apiFetch('/api/profile', {
        method: 'PATCH',
        body: JSON.stringify({
          full_name: fullName.trim(),
          age_range: ageRange,
          origin_state: originState.trim(),
          visa_type: visaType,
          move_date: moveDate || null,
          family_situation: familySituation,
          work_background: workBackground,
          bureaucracy_comfort: bureaucracyComfort,
          biggest_concern: biggestConcern,
          guide_choice: guideChoice,
          comm_style: commStyle,
          onboarding_done: true,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        setError(err.error || 'Failed to save. Please try again.')
        return
      }
      router.push('/dashboard')
    } catch (e) {
      setError('Connection error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const progressPct = ((step - 1) / TOTAL_STEPS) * 100

  return (
    <div style={{ minHeight: '100vh', background: OFF_WHITE, fontFamily: 'Georgia, serif', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ background: '#fff', borderBottom: `1px solid ${BORDER}`, padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="https://visadoapp.com" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, fontWeight: 700, color: GREEN_DARK, textDecoration: 'none' }}>
          <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: GREEN }} />
          Visado
        </a>
        <div style={{ fontSize: 13, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif" }}>
          {step} of {TOTAL_STEPS}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ background: BORDER, height: 3 }}>
        <div style={{ background: GREEN, height: 3, width: `${progressPct}%`, transition: 'width 0.4s ease' }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 520 }}>

          {error && (
            <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: 8, padding: '10px 14px', marginBottom: 20, fontSize: 13, color: '#991B1B', fontFamily: "'Helvetica Neue', sans-serif" }}>
              {error}
            </div>
          )}

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div>
              <StepHeader step={1} title="Let's get to know you" subtitle="This helps us personalize your experience and guide you more effectively." />

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="First and last name"
                  style={{ width: '100%', padding: '11px 12px', border: `1.5px solid ${BORDER}`, borderRadius: 10, fontSize: 14, fontFamily: "'Helvetica Neue', sans-serif", color: DARK, background: '#fff', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your age range</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {['25–35', '36–45', '46–55', '56–65', '65+'].map(a => (
                    <OptionCard key={a} selected={ageRange === a} onClick={() => setAgeRange(a)}>{a}</OptionCard>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Where are you moving from?</label>
                <input
                  type="text"
                  value={originState}
                  onChange={e => setOriginState(e.target.value)}
                  placeholder="e.g. California, New York, Texas..."
                  style={{ width: '100%', padding: '11px 12px', border: `1.5px solid ${BORDER}`, borderRadius: 10, fontSize: 14, fontFamily: "'Helvetica Neue', sans-serif", color: DARK, background: '#fff', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <div>
              <StepHeader step={2} title="Tell us about your move" subtitle="We'll build your personalized checklist and timeline based on this." />

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Which visa are you pursuing?</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { value: 'd7', label: 'D7 Passive Income Visa', sub: 'Pension, dividends, rental income — min €920/month' },
                    { value: 'digital_nomad', label: 'Digital Nomad Visa (D8)', sub: 'Remote workers with foreign employer or clients' },
                    { value: 'golden_visa', label: 'Golden Visa', sub: 'Investment route — real estate or funds' },
                    { value: 'nhr', label: 'NHR Tax Status', sub: 'Already in Portugal, optimizing for tax benefits' },
                  ].map(v => (
                    <OptionCard key={v.value} selected={visaType === v.value} onClick={() => setVisaType(v.value)}>
                      <div style={{ fontWeight: 600 }}>{v.label}</div>
                      <div style={{ fontSize: 12, color: visaType === v.value ? GREEN_DARK : MUTED, marginTop: 2 }}>{v.sub}</div>
                    </OptionCard>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Estimated move date (optional)</label>
                <input
                  type="month"
                  value={moveDate}
                  onChange={e => setMoveDate(e.target.value)}
                  style={{ width: '100%', padding: '11px 12px', border: `1.5px solid ${BORDER}`, borderRadius: 10, fontSize: 14, fontFamily: "'Helvetica Neue', sans-serif", color: DARK, background: '#fff', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Who's making the move?</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[
                    { value: 'solo', label: 'Just me' },
                    { value: 'couple', label: 'Me + partner' },
                    { value: 'family', label: 'Family with kids' },
                    { value: 'single_parent', label: 'Single parent' },
                  ].map(f => (
                    <OptionCard key={f.value} selected={familySituation === f.value} onClick={() => setFamilySituation(f.value)}>{f.label}</OptionCard>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3 ── */}
          {step === 3 && (
            <div>
              <StepHeader step={3} title="A little about your background" subtitle="This helps your guide understand where you're coming from and tailor advice to your situation." />

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>What best describes your work or income?</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { value: 'remote_tech', label: '💻 Remote worker / Tech' },
                    { value: 'freelancer', label: '🎨 Freelancer / Creative' },
                    { value: 'retiree', label: '🌅 Retiree / Pension' },
                    { value: 'business_owner', label: '🏢 Business owner' },
                    { value: 'investor', label: '📈 Investor / Passive income' },
                    { value: 'other', label: '✦ Other' },
                  ].map(w => (
                    <OptionCard key={w.value} selected={workBackground === w.value} onClick={() => setWorkBackground(w.value)}>{w.label}</OptionCard>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>How comfortable are you with paperwork and bureaucracy?</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { value: 'first_time', label: "🤯 I've never done anything like this" },
                    { value: 'some_experience', label: "📋 I've navigated some official processes before" },
                    { value: 'experienced', label: '💪 I eat paperwork for breakfast' },
                  ].map(b => (
                    <OptionCard key={b.value} selected={bureaucracyComfort === b.value} onClick={() => setBureaucracyComfort(b.value)}>{b.label}</OptionCard>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>What's your biggest concern right now?</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { value: 'finances_visa', label: '💰 Finances and visa approval' },
                    { value: 'housing', label: '🏠 Finding housing in Portugal' },
                    { value: 'language_culture', label: '🗣️ Language and cultural adjustment' },
                    { value: 'family_logistics', label: '👨‍👩‍👧 Family logistics (school, healthcare)' },
                    { value: 'tax_legal', label: '⚖️ Tax and legal questions' },
                    { value: 'where_to_start', label: '🗺️ Just figuring out where to start' },
                  ].map(c => (
                    <OptionCard key={c.value} selected={biggestConcern === c.value} onClick={() => setBiggestConcern(c.value)}>{c.label}</OptionCard>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 4 ── */}
          {step === 4 && (
            <div>
              <StepHeader step={4} title="Choose your guide" subtitle="They'll be with you every step of the way. You can always switch later in Account settings." />

              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 8 }}>
                  {[
                    { value: 'joao', name: 'Joao', emoji: '👨', description: 'Warm, methodical, deeply practical. Former Lisbon architect turned expat guide. Great for retirees and families.' },
                    { value: 'andreia', name: 'Andreia', emoji: '👩', description: 'Energetic, direct, and funny. Navigated the D7 herself and loves helping others. Great for remote workers and go-getters.' },
                  ].map(guide => (
                    <div key={guide.value} onClick={() => setGuideChoice(guide.value)}
                      style={{ padding: 16, borderRadius: 12, border: `2px solid ${guideChoice === guide.value ? GREEN_DARK : BORDER}`, background: guideChoice === guide.value ? GREEN_LIGHT : '#fff', cursor: 'pointer', transition: 'all 0.15s' }}>
                      <div style={{ fontSize: 32, marginBottom: 10 }}>{guide.emoji}</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: DARK, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 6 }}>{guide.name}</div>
                      <div style={{ fontSize: 12, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", lineHeight: 1.5 }}>{guide.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>How do you like to receive information?</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { value: 'friendly', label: '😊 Friendly and conversational — talk to me like a friend' },
                    { value: 'professional', label: '📊 Professional and thorough — give me all the details' },
                    { value: 'direct', label: '⚡ Just the bullet points — I\'m busy, keep it tight' },
                  ].map(c => (
                    <OptionCard key={c.value} selected={commStyle === c.value} onClick={() => setCommStyle(c.value)}>{c.label}</OptionCard>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32 }}>
            {step > 1 ? (
              <button onClick={() => setStep(step - 1)}
                style={{ padding: '11px 24px', background: '#fff', color: MUTED, border: `1px solid ${BORDER}`, borderRadius: 10, fontSize: 14, cursor: 'pointer', fontFamily: "'Helvetica Neue', sans-serif" }}>
                ← Back
              </button>
            ) : <div />}

            {step < TOTAL_STEPS ? (
              <button onClick={() => setStep(step + 1)} disabled={!canProceed()}
                style={{ padding: '11px 28px', background: canProceed() ? GREEN_DARK : BORDER, color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: canProceed() ? 'pointer' : 'not-allowed', fontFamily: "'Helvetica Neue', sans-serif" }}>
                Continue →
              </button>
            ) : (
              <button onClick={finish} disabled={!canProceed() || saving}
                style={{ padding: '11px 28px', background: canProceed() && !saving ? GREEN_DARK : BORDER, color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: canProceed() && !saving ? 'pointer' : 'not-allowed', fontFamily: "'Helvetica Neue', sans-serif" }}>
                {saving ? 'Setting up your account...' : "Let's go →"}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
