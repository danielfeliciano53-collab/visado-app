import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import LandingNav from '../../components/LandingNav'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Blog | Visado',
  description: 'Stories, guides, and honest advice from people who have actually moved abroad.',
}

const NAVY_DARK = '#111E47'
const GOLD = '#C9942A'
const OFF_WHITE = '#F9F7F4'
const DARK = '#111510'
const MUTED = '#6B7280'
const BORDER = '#E5E7EB'

const BACKEND_URL = 'https://visado-backend.vercel.app'

async function getPosts() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/blog`, { next: { revalidate: 60 } })
    if (!res.ok) return []
    const data = await res.json()
    return data.posts || []
  } catch {
    return []
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <div style={{ fontFamily: 'Georgia, serif', background: OFF_WHITE, minHeight: '100vh' }}>

      <LandingNav />

      {/* Header */}
      <div style={{ background: NAVY_DARK, padding: '64px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: GOLD, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 16 }}>
          From the field
        </div>
        <h1 style={{ margin: '0 0 16px', fontSize: 42, fontWeight: 700, color: '#fff' }}>The Visado Blog</h1>
        <p style={{ margin: 0, fontSize: 18, color: 'rgba(255,255,255,0.75)', maxWidth: 520, marginLeft: 'auto', marginRight: 'auto', fontFamily: "'Helvetica Neue', sans-serif", lineHeight: 1.6 }}>
          Honest stories, practical guides, and hard-won advice from people who've actually done this.
        </p>
      </div>

      {/* Posts */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '56px 24px' }}>
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0', color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", fontSize: 15 }}>
            No posts yet — check back soon.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {posts.map((post: any) => (
              <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden', transition: 'border-color 0.15s', cursor: 'pointer' }}>
                  {post.image_url && (
                    <img src={post.image_url} alt={post.title} style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
                  )}
                  <div style={{ padding: '28px 32px' }}>
                  <div style={{ fontSize: 12, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {post.author} · {formatDate(post.published_at || post.created_at)}
                  </div>
                  <h2 style={{ margin: '0 0 12px', fontSize: 22, fontWeight: 700, color: DARK, lineHeight: 1.3 }}>{post.title}</h2>
                  {post.excerpt && (
                    <p style={{ margin: '0 0 16px', fontSize: 15, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", lineHeight: 1.6 }}>{post.excerpt}</p>
                  )}
                  <span style={{ fontSize: 14, color: GOLD, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600 }}>Read more →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${BORDER}`, padding: '32px', textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: 13, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif" }}>
          © 2026 Visado · <Link href="/privacy" style={{ color: MUTED }}>Privacy</Link> · <Link href="/terms" style={{ color: MUTED }}>Terms</Link>
        </p>
      </footer>

    </div>
  )
}
