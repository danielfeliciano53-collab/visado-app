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

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  author: string
  published: boolean
  published_at: string | null
  created_at: string
}

function emptyForm() {
  return { id: '', title: '', slug: '', excerpt: '', content: '', author: 'Daniel Feliciano', published: false }
}

function titleToSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function AdminBlogPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<BlogPost[]>([])
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
    if (!token) { router.push('/admin/login'); throw new Error('No token') }
    const res = await fetch(`${BACKEND_URL}${path}`, {
      ...options,
      headers: { ...(options.headers || {}), Authorization: `Bearer ${token}` },
    })
    if (res.status === 401) { router.push('/admin/login'); throw new Error('Unauthorized') }
    return res
  }

  useEffect(() => { loadPosts() }, [])

  async function loadPosts() {
    setLoading(true)
    setError('')
    try {
      // Admin sees all posts including drafts — fetch via authed route
      const token = getToken()
      if (!token) { router.push('/admin/login'); return }
      const res = await fetch(`${BACKEND_URL}/api/blog/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 401) { router.push('/admin/login'); return }
      if (!res.ok) {
        // Fallback to public endpoint if admin endpoint not yet available
        const pubRes = await fetch(`${BACKEND_URL}/api/blog`)
        const pubData = await pubRes.json()
        setPosts(pubData.posts || [])
        return
      }
      const data = await res.json()
      setPosts(data.posts || [])
    } catch {
      setError('Connection error.')
    } finally {
      setLoading(false)
    }
  }

  function openNewForm() {
    setForm(emptyForm())
    setShowForm(true)
  }

  function openEditForm(post: BlogPost) {
    setForm({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content,
      author: post.author,
      published: post.published,
    })
    setShowForm(true)
  }

  function handleTitleChange(title: string) {
    setForm(f => ({
      ...f,
      title,
      slug: f.id ? f.slug : titleToSlug(title), // auto-slug only on new posts
    }))
  }

  async function handleSave(publish?: boolean) {
    if (!form.title.trim() || !form.content.trim()) {
      setError('Title and content are required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const isEdit = !!form.id
      const body = {
        ...(isEdit ? { id: form.id } : {}),
        title: form.title.trim(),
        slug: form.slug.trim(),
        excerpt: form.excerpt.trim() || null,
        content: form.content.trim(),
        author: form.author.trim(),
        published: publish !== undefined ? publish : form.published,
      }
      const res = await authedFetch('/api/blog', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Failed to save post.')
        setSaving(false)
        return
      }
      setShowForm(false)
      setForm(emptyForm())
      await loadPosts()
    } catch {
      setError('Connection error while saving.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this post permanently?')) return
    setDeletingId(id)
    try {
      const res = await authedFetch(`/api/blog?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Failed to delete post.')
      } else {
        await loadPosts()
      }
    } catch {
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
          <a href="/admin" style={{ fontSize: 18, fontWeight: 700, color: NAVY_DARK, textDecoration: 'none' }}>Visado</a>
          <span style={{ fontSize: 12, background: '#FBF3E2', color: GOLD, padding: '2px 8px', borderRadius: 99, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600 }}>ADMIN</span>
        </div>
        <a href="/admin" style={{ fontSize: 13, color: MUTED, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif", border: `1px solid ${BORDER}`, borderRadius: 8, padding: '6px 14px' }}>← Dashboard</a>
      </div>

      <div style={{ padding: '32px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 700, color: DARK }}>Blog Posts</h1>
            <div style={{ fontSize: 13, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif" }}>
              {posts.filter(p => p.published).length} published · {posts.filter(p => !p.published).length} drafts
            </div>
          </div>
          <button onClick={openNewForm} style={{ padding: '10px 20px', background: NAVY_DARK, color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'Helvetica Neue', sans-serif" }}>
            + New Post
          </button>
        </div>

        {error && (
          <div style={{ background: '#FEF2F2', color: '#991B1B', fontSize: 13, padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontFamily: "'Helvetica Neue', sans-serif", border: '1px solid #FECACA' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", fontSize: 13 }}>Loading posts...</div>
        ) : posts.length === 0 ? (
          <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 12, padding: 48, textAlign: 'center', color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", fontSize: 13 }}>
            No posts yet. Click "New Post" to write your first one.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {posts.map(post => (
              <div key={post.id} style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 10, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 15, fontWeight: 600, color: DARK, fontFamily: "'Helvetica Neue', sans-serif" }}>{post.title}</span>
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600, background: post.published ? '#F0FDF4' : '#F3F4F6', color: post.published ? '#166534' : MUTED }}>
                        {post.published ? '● Published' : '○ Draft'}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif" }}>
                      /{post.slug} · {post.author} · {formatDate(post.published_at || post.created_at)}
                    </div>
                    {post.excerpt && (
                      <div style={{ fontSize: 13, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginTop: 4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' as any }}>
                        {post.excerpt}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    {post.published && (
                      <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: 12, padding: '6px 12px', background: 'none', border: `1px solid ${BORDER}`, borderRadius: 6, color: MUTED, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif" }}>
                        View
                      </a>
                    )}
                    <button onClick={() => openEditForm(post)}
                      style={{ fontSize: 12, padding: '6px 12px', background: 'none', border: `1px solid ${BORDER}`, borderRadius: 6, cursor: 'pointer', color: NAVY_DARK, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600 }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(post.id)} disabled={deletingId === post.id}
                      style={{ fontSize: 12, padding: '6px 12px', background: 'none', border: '1px solid #FCA5A5', borderRadius: 6, cursor: 'pointer', color: DANGER, fontFamily: "'Helvetica Neue', sans-serif", opacity: deletingId === post.id ? 0.5 : 1 }}>
                      {deletingId === post.id ? '...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Write/Edit Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(17,21,16,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 720, maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700, color: DARK, fontFamily: 'Georgia, serif' }}>
              {form.id ? 'Edit Post' : 'New Post'}
            </h2>

            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: DARK, marginBottom: 6, fontFamily: "'Helvetica Neue', sans-serif" }}>Title</label>
            <input type="text" value={form.title} onChange={e => handleTitleChange(e.target.value)}
              placeholder="Your post title"
              style={{ width: '100%', padding: '10px 12px', border: `1.5px solid ${BORDER}`, borderRadius: 8, fontSize: 15, marginBottom: 14, boxSizing: 'border-box', fontFamily: 'Georgia, serif', outline: 'none' }} />

            <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: DARK, marginBottom: 6, fontFamily: "'Helvetica Neue', sans-serif" }}>Slug (URL)</label>
                <input type="text" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })}
                  placeholder="your-post-slug"
                  style={{ width: '100%', padding: '10px 12px', border: `1.5px solid ${BORDER}`, borderRadius: 8, fontSize: 13, boxSizing: 'border-box', fontFamily: "'Helvetica Neue', sans-serif", outline: 'none' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: DARK, marginBottom: 6, fontFamily: "'Helvetica Neue', sans-serif" }}>Author</label>
                <input type="text" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', border: `1.5px solid ${BORDER}`, borderRadius: 8, fontSize: 13, boxSizing: 'border-box', fontFamily: "'Helvetica Neue', sans-serif", outline: 'none' }} />
              </div>
            </div>

            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: DARK, marginBottom: 6, fontFamily: "'Helvetica Neue', sans-serif" }}>Excerpt (shown on blog index)</label>
            <textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })}
              placeholder="A short summary of the post — 1-2 sentences"
              rows={2}
              style={{ width: '100%', padding: '10px 12px', border: `1.5px solid ${BORDER}`, borderRadius: 8, fontSize: 14, marginBottom: 14, boxSizing: 'border-box', fontFamily: "'Helvetica Neue', sans-serif", outline: 'none', resize: 'none' }} />

            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: DARK, marginBottom: 6, fontFamily: "'Helvetica Neue', sans-serif" }}>
              Content <span style={{ fontWeight: 400, color: MUTED }}>(use ## for headings, double line break for new paragraph)</span>
            </label>
            <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
              placeholder="Write your post here..."
              rows={16}
              style={{ width: '100%', padding: '10px 12px', border: `1.5px solid ${BORDER}`, borderRadius: 8, fontSize: 14, marginBottom: 20, boxSizing: 'border-box', fontFamily: "'Helvetica Neue', sans-serif", outline: 'none', resize: 'vertical' }} />

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowForm(false); setForm(emptyForm()) }}
                style={{ padding: '10px 18px', background: 'none', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 14, cursor: 'pointer', color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600 }}>
                Cancel
              </button>
              <button onClick={() => handleSave(false)} disabled={saving}
                style={{ padding: '10px 18px', background: '#F3F4F6', color: DARK, border: 'none', borderRadius: 8, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600, opacity: saving ? 0.6 : 1 }}>
                Save Draft
              </button>
              <button onClick={() => handleSave(true)} disabled={saving}
                style={{ padding: '10px 18px', background: NAVY_DARK, color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600, opacity: saving ? 0.6 : 1 }}>
                {saving ? 'Saving...' : '● Publish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
