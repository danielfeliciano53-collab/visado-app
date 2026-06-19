'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const BACKEND_URL = 'https://visado-backend.vercel.app'
const NAVY = '#1B2F6E'
const NAVY_DARK = '#111E47'
const NAVY_LIGHT = '#E8ECF7'
const GOLD = '#C9942A'
const OFF_WHITE = '#F9F7F4'
const DARK = '#111510'
const MUTED = '#6B7280'
const BORDER = '#E5E7EB'
const DANGER = '#EF4444'

interface KBEntry {
  id: string
  title: string
  content: string
  category: string
  country_code: string | null
  created_at: string
}

const CATEGORIES = ['General', 'Visa & Immigration', 'Housing', 'Banking & Finance', 'Healthcare', 'Daily Life', 'Legal']

function emptyForm() {
  return { id: '', title: '', content: '', category: 'General', country_code: '' }
}

export default function KnowledgeBasePage() {
  const router = useRouter()
  const [entries, setEntries] = useState<KBEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm())
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  function getToken() {
    return typeof window !== 'undefined' ? localStorage.getItem('visado_admin_token') : null
  }

  async function authedFetch(path: string, options: RequestInit = {}) {
    const token = getToken()
    if (!token) {
      router.push('/admin/login')
      throw new Error('No admin token')
    }
    const res = await fetch(`${BACKEND_URL}${path}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    })
    if (res.status === 401) {
      router.push('/admin/login')
      throw new Error('Unauthorized')
    }
    return res
  }

  useEffect(() => { loadEntries() }, [])

  async function loadEntries() {
    setLoading(true)
    setError('')
    try {
      const res = await authedFetch('/api/admin/knowledge-base')
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Failed to load knowledge base.')
        setLoading(false)
        return
      }
      const data = await res.json()
      setEntries(data.entries || [])
    } catch (e) {
      // redirect already handled in authedFetch, or genuine connection error
      setError((e as Error).message === 'No admin token' || (e as Error).message === 'Unauthorized' ? '' : 'Connection error.')
    } finally {
      setLoading(false)
    }
  }

  function openNewForm() {
    setForm(emptyForm())
    setShowForm(true)
  }

  function openEditForm(entry: KBEntry) {
    setForm({
      id: entry.id,
      title: entry.title,
      content: entry.content,
      category: entry.category || 'General',
      country_code: entry.country_code || '',
    })
    setShowForm(true)
  }

  async function handleSave() {
    if (!form.title.trim() || !form.content.trim()) {
      setError('Title and content are required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const isEdit = !!form.id
      const res = await authedFetch('/api/admin/knowledge-base', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(isEdit ? { id: form.id } : {}),
          title: form.title.trim(),
          content: form.content.trim(),
          category: form.category,
          country_code: form.country_code.trim() || null,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Failed to save entry.')
        setSaving(false)
        return
      }
      setShowForm(false)
      setForm(emptyForm())
      await loadEntries()
    } catch (e) {
      setError('Connection error while saving.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    setError('')
    try {
      const res = await authedFetch(`/api/admin/knowledge-base?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Failed to delete entry.')
        setDeletingId(null)
        return
      }
      await loadEntries()
    } catch (e) {
      setError('Connection error while deleting.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: OFF_WHITE, fontFamily: 'Georgia, serif' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: `1px solid ${BORDER}`, padding: '0 32px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <a href="/admin" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, fontWeight: 700, color: NAVY_DARK, textDecoration: 'none' }}>
            <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: NAVY }} />
            Visado
          </a>
          <span style={{ fontSize: 12, background: '#FBF3E2', color: GOLD, padding: '2px 8px', borderRadius: 99, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600 }}>ADMIN</span>
        </div>
        <a href="/admin" style={{ fontSize: 13, color: MUTED, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif", border: `1px solid ${BORDER}`, borderRadius: 8, padding: '6px 14px' }}>
          ← Dashboard
        </a>
      </div>

      <div style={{ padding: '32px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 700, color: DARK }}>Knowledge Base</h1>
            <div style={{ fontSize: 13, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif" }}>
              {entries.length} {entries.length === 1 ? 'entry' : 'entries'} · feeds Joao &amp; Andreia's chat context
            </div>
          </div>
          <button onClick={openNewForm} style={{ padding: '10px 20px', background: NAVY_DARK, color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'Helvetica Neue', sans-serif" }}>
            + New Entry
          </button>
        </div>

        {error && (
          <div style={{ background: '#FEF2F2', color: '#991B1B', fontSize: 13, padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontFamily: "'Helvetica Neue', sans-serif", border: '1px solid #FECACA' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", fontSize: 13 }}>
            Loading entries...
          </div>
        ) : entries.length === 0 ? (
          <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 12, padding: 48, textAlign: 'center', color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", fontSize: 13 }}>
            No knowledge base entries yet. Click "New Entry" to add the first one.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {entries.map(entry => (
              <div key={entry.id} style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 10, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 15, fontWeight: 600, color: DARK, fontFamily: "'Helvetica Neue', sans-serif" }}>{entry.title}</span>
                      <span style={{ fontSize: 11, background: NAVY_LIGHT, color: NAVY_DARK, padding: '2px 8px', borderRadius: 99, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600 }}>{entry.category}</span>
                      {entry.country_code && (
                        <span style={{ fontSize: 11, background: '#FBF3E2', color: GOLD, padding: '2px 8px', borderRadius: 99, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600 }}>{entry.country_code}</span>
                      )}
                    </div>
                    <div style={{ fontSize: 13, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
                      {entry.content}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button onClick={() => openEditForm(entry)} style={{ fontSize: 12, padding: '6px 12px', background: 'none', border: `1px solid ${BORDER}`, borderRadius: 6, cursor: 'pointer', color: NAVY_DARK, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600 }}>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      disabled={deletingId === entry.id}
                      style={{ fontSize: 12, padding: '6px 12px', background: 'none', border: '1px solid #FCA5A5', borderRadius: 6, cursor: deletingId === entry.id ? 'not-allowed' : 'pointer', color: DANGER, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600, opacity: deletingId === entry.id ? 0.5 : 1 }}
                    >
                      {deletingId === entry.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(17,21,16,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 560, maxHeight: '85vh', overflowY: 'auto' }}>
            <h2 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700, color: DARK, fontFamily: 'Georgia, serif' }}>
              {form.id ? 'Edit Entry' : 'New Entry'}
            </h2>

            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: DARK, marginBottom: 6, fontFamily: "'Helvetica Neue', sans-serif" }}>Title</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', border: `1.5px solid ${BORDER}`, borderRadius: 8, fontSize: 14, marginBottom: 16, boxSizing: 'border-box', fontFamily: "'Helvetica Neue', sans-serif", outline: 'none' }}
            />

            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: DARK, marginBottom: 6, fontFamily: "'Helvetica Neue', sans-serif" }}>Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', border: `1.5px solid ${BORDER}`, borderRadius: 8, fontSize: 14, boxSizing: 'border-box', fontFamily: "'Helvetica Neue', sans-serif", outline: 'none', background: '#fff' }}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: DARK, marginBottom: 6, fontFamily: "'Helvetica Neue', sans-serif" }}>Country code (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. PT"
                  value={form.country_code}
                  onChange={e => setForm({ ...form, country_code: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', border: `1.5px solid ${BORDER}`, borderRadius: 8, fontSize: 14, boxSizing: 'border-box', fontFamily: "'Helvetica Neue', sans-serif", outline: 'none' }}
                />
              </div>
            </div>

            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: DARK, marginBottom: 6, fontFamily: "'Helvetica Neue', sans-serif" }}>Content</label>
            <textarea
              value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
              rows={8}
              style={{ width: '100%', padding: '10px 12px', border: `1.5px solid ${BORDER}`, borderRadius: 8, fontSize: 14, marginBottom: 20, boxSizing: 'border-box', fontFamily: "'Helvetica Neue', sans-serif", outline: 'none', resize: 'vertical' as any }}
            />

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowForm(false); setForm(emptyForm()) }} style={{ padding: '10px 18px', background: 'none', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 14, cursor: 'pointer', color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600 }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} style={{ padding: '10px 18px', background: NAVY_DARK, color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600, opacity: saving ? 0.6 : 1 }}>
                {saving ? 'Saving...' : 'Save Entry'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
