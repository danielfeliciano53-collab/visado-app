'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import LandingNav from '../../../components/LandingNav'

const NAVY_DARK = '#111E47'
const GOLD = '#C9942A'
const OFF_WHITE = '#F9F7F4'
const DARK = '#111510'
const MUTED = '#6B7280'
const BORDER = '#E5E7EB'
const BACKEND_URL = 'https://visado-backend.vercel.app'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    fetch(`${BACKEND_URL}/api/blog?slug=${encodeURIComponent(slug)}`)
      .then(res => {
        if (!res.ok) { setNotFound(true); setLoading(false); return null }
        return res.json()
      })
      .then(data => {
        if (!data) return
        if (!data.post) { setNotFound(true); setLoading(false); return }
        setPost(data.post)
        setLoading(false)
      })
      .catch(() => { setNotFound(true); setLoading(false) })
  }, [slug])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: OFF_WHITE, fontFamily: "'Helvetica Neue', sans-serif", color: MUTED, fontSize: 14 }}>
        Loading...
      </div>
    )
  }

  if (notFound) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: OFF_WHITE, fontFamily: "'Helvetica Neue', sans-serif" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>404</div>
        <div style={{ fontSize: 16, color: MUTED, marginBottom: 24 }}>Post not found</div>
        <Link href="/blog" style={{ color: GOLD, textDecoration: 'none', fontWeight: 600 }}>← Back to Blog</Link>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: 'Georgia, serif', background: OFF_WHITE, minHeight: '100vh' }}>

      <LandingNav />

      <article style={{ maxWidth: 720, margin: '0 auto', padding: '56px 24px' }}>

        <Link href="/blog" style={{ fontSize: 14, color: MUTED, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif", display: 'inline-block', marginBottom: 32 }}>
          ← Back to Blog
        </Link>

        <div style={{ fontSize: 12, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {post.author} · {formatDate(post.published_at || post.created_at)}
        </div>

        {post.image_url && (
          <img src={post.image_url} alt={post.title} style={{ width: '100%', maxHeight: 380, objectFit: 'cover', borderRadius: 12, marginBottom: 32, display: 'block' }} />
        )}
        <h1 style={{ margin: '0 0 24px', fontSize: 38, fontWeight: 700, color: DARK, lineHeight: 1.2 }}>{post.title}</h1>

        {post.excerpt && (
          <p style={{ margin: '0 0 40px', fontSize: 19, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", lineHeight: 1.6, borderBottom: `1px solid ${BORDER}`, paddingBottom: 40 }}>
            {post.excerpt}
          </p>
        )}

        <div style={{ fontSize: 17, lineHeight: 1.85, color: DARK }}>
          {post.content.split('\n\n').map((paragraph: string, i: number) => (
            paragraph.startsWith('## ') ? (
              <h2 key={i} style={{ fontSize: 26, fontWeight: 700, color: DARK, margin: '40px 0 16px' }}>
                {paragraph.replace('## ', '')}
              </h2>
            ) : paragraph.startsWith('# ') ? (
              <h1 key={i} style={{ fontSize: 32, fontWeight: 700, color: DARK, margin: '40px 0 16px' }}>
                {paragraph.replace('# ', '')}
              </h1>
            ) : (
              <p key={i} style={{ margin: '0 0 24px', fontFamily: "'Helvetica Neue', sans-serif" }}>
                {paragraph}
              </p>
            )
          ))}
        </div>

        <div style={{ background: NAVY_DARK, borderRadius: 16, padding: '36px 32px', textAlign: 'center', marginTop: 56 }}>
          <h3 style={{ margin: '0 0 10px', fontSize: 22, fontWeight: 700, color: '#fff' }}>Ready to start your Portugal journey?</h3>
          <p style={{ margin: '0 0 24px', fontSize: 15, color: 'rgba(255,255,255,0.75)', fontFamily: "'Helvetica Neue', sans-serif" }}>
            Meet Joao or Andreia — your AI guide, built on real experience.
          </p>
          <Link href="/login" style={{ display: 'inline-block', background: GOLD, color: '#fff', padding: '13px 28px', borderRadius: 8, fontSize: 15, fontWeight: 700, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif" }}>
            Start for free →
          </Link>
        </div>

      </article>

      <footer style={{ borderTop: `1px solid ${BORDER}`, padding: '32px', textAlign: 'center', marginTop: 32 }}>
        <p style={{ margin: 0, fontSize: 13, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif" }}>
          © 2026 Visado · <Link href="/privacy" style={{ color: MUTED }}>Privacy</Link> · <Link href="/terms" style={{ color: MUTED }}>Terms</Link>
        </p>
      </footer>

    </div>
  )
}
