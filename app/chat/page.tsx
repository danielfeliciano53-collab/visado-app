'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../components/Sidebar'
import MobileHeader from '../../components/MobileHeader'
import { apiFetch, deleteCookie } from '../../lib/api'

const GREEN = '#1D9E75'
const GREEN_DARK = '#0F6E56'
const GREEN_LIGHT = '#E1F5EE'
const OFF_WHITE = '#F9F7F4'
const DARK = '#111510'
const MUTED = '#6B7280'
const BORDER = '#E5E7EB'

const BACKEND = 'https://visado-backend.vercel.app'

interface Message {
  role: 'user' | 'assistant'
  content: string
  time: string
}

interface Profile {
  full_name?: string
  email?: string
  plan?: string
  guide_choice?: string
  visa_type?: string
}

function now() {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

const QUICK_REPLIES = [
  'What documents do I need for my NIF?',
  'What should I expect at my AIMA appointment?',
  'Tell me about the D7 income requirements',
  'What documents do I still need?',
]

export default function ChatPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<Profile>({})
  const [authReady, setAuthReady] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const check = () => setIsMobile((window.screen?.width || 1440) <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    loadProfile()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function loadProfile() {
    try {
      const res = await apiFetch('/api/profile')
      if (res.status === 401) { router.push('/login'); return }
      const data = await res.json()
      const p = data.profile || {}
      setProfile(p)
      const guideName = p.guide_choice === 'andreia' ? 'Andreia' : 'Joao'
      setMessages([{
        role: 'assistant',
        content: `Good ${new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}${p.full_name ? ', ' + p.full_name.split(' ')[0] : ''}! Ready to help with your Portugal move. What would you like to work on today?`,
        time: now(),
      }])
    } catch (e) {
      console.error('Profile load error', e)
    } finally {
      setAuthReady(true)
    }
  }

  async function sendMessage(text?: string) {
    const userMsg = text || input.trim()
    if (!userMsg) return
    setInput('')
    const newMessages: Message[] = [...messages, { role: 'user', content: userMsg, time: now() }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const res = await apiFetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setMessages(prev => [...prev, { role: 'assistant', content: data.message, time: now() }])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.', time: now() }])
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please check your internet and try again.', time: now() }])
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  function handleLogout() {
    deleteCookie('visado_token')
    deleteCookie('visado_user')
    router.push('/login')
  }

  const guideName = profile.guide_choice === 'andreia' ? 'Andreia' : 'Joao'

  if (!authReady) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: OFF_WHITE, fontFamily: "'Helvetica Neue', sans-serif", color: MUTED, fontSize: 13 }}>
        Loading...
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', height: '100dvh', background: OFF_WHITE, fontFamily: 'Georgia, serif', overflow: 'hidden' }}>
      {!isMobile && <Sidebar activePage="chat" profile={profile} onLogout={handleLogout} />}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100dvh', overflow: 'hidden' }}>

        {/* Mobile header */}
        {isMobile && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 56, background: '#fff', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', zIndex: 100 }}>
            <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, fontWeight: 700, color: GREEN_DARK, textDecoration: 'none' }}>
              <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: GREEN }} />
              Visado
            </a>
          </div>
        )}

        {/* Chat header */}
        <div style={{ paddingTop: isMobile ? 56 : 0, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#fff', borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: GREEN_DARK, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 17, flexShrink: 0 }}>
                {guideName[0]}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: DARK, fontFamily: "'Helvetica Neue', sans-serif" }}>{guideName} · Visado guide</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginTop: 2 }}>
                  <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: GREEN }} />
                  Online · D7 · Portugal
                </div>
              </div>
            </div>
            <a href="/dashboard" style={{ fontSize: 13, color: MUTED, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif" }}>← Dashboard</a>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 16, boxSizing: 'border-box' }}>
          <div style={{ textAlign: 'center', fontSize: 12, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 4 }}>Today</div>

          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 8 }}>
              {msg.role === 'assistant' && (
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: GREEN_DARK, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
                  {guideName[0]}
                </div>
              )}
              <div style={{
                maxWidth: '75%',
                padding: '10px 14px',
                borderRadius: 16,
                fontSize: 14,
                lineHeight: 1.65,
                fontFamily: "'Helvetica Neue', sans-serif",
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                whiteSpace: 'pre-wrap',
                ...(msg.role === 'user'
                  ? { background: GREEN_DARK, color: '#fff', borderBottomRightRadius: 4 }
                  : { background: '#fff', border: `1px solid ${BORDER}`, borderBottomLeftRadius: 4, color: DARK })
              }}>
                {msg.content}
                <div style={{ fontSize: 11, marginTop: 6, fontFamily: "'Helvetica Neue', sans-serif", ...(msg.role === 'user' ? { color: 'rgba(255,255,255,0.6)', textAlign: 'right' } : { color: MUTED }) }}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: GREEN_DARK, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
                {guideName[0]}
              </div>
              <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 16, borderBottomLeftRadius: 4, padding: '14px 18px' }}>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: MUTED, display: 'inline-block', animation: `bounce 1.2s infinite ${delay}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quick replies — show after first message only */}
          {messages.length <= 1 && !loading && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
              {QUICK_REPLIES.map((qr, i) => (
                <button key={i} onClick={() => sendMessage(qr)}
                  style={{ fontSize: 13, padding: '8px 14px', border: `1px solid ${BORDER}`, borderRadius: 20, background: '#fff', color: GREEN_DARK, cursor: 'pointer', fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 500 }}>
                  {qr}
                </button>
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input bar — fixed to bottom on mobile */}
        <div style={{ flexShrink: 0, padding: '10px 12px 20px', background: '#fff', borderTop: `1px solid ${BORDER}`, boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <textarea
              style={{ flex: 1, minWidth: 0, padding: '11px 12px', border: `1.5px solid ${BORDER}`, borderRadius: 12, fontSize: 14, fontFamily: "'Helvetica Neue', sans-serif", color: DARK, resize: 'none', outline: 'none', lineHeight: 1.5, background: OFF_WHITE, boxSizing: 'border-box' }}
              placeholder={`Ask ${guideName} anything about your move...`}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              rows={1}
              disabled={loading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              style={{ width: 42, height: 42, minWidth: 42, borderRadius: 10, background: GREEN_DARK, border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: input.trim() && !loading ? 1 : 0.4 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div style={{ fontSize: 11, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginTop: 6, textAlign: 'center' }}>
            {guideName} gives guidance based on real experience — not legal advice.
          </div>
        </div>

      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
