import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

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

      {/* Nav */}
      <nav style={{ background: '#fff', borderBottom: `1px solid ${BORDER}`, padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <Image src="/visado-logo.png" alt="Visado" width={28} height={28} style={{ borderRadius: 6 }} />
          <span style={{ fontSize: 20, fontWeight: 700, color: NAVY_DARK }}>Visado</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Link href="/about" style={{ fontSize: 14, color: MUTED, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif" }}>About</Link>
          <Link href="/blog" style={{ fontSize: 14, color: NAVY_DARK, textDecoration: 'none', fontWeight: 600, fontFamily: "'Helvetica Neue', sans-serif" }}>Blog</Link>
          <Link href="/pricing" style={{ fontSize: 14, color: MUTED, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif" }}>Pricing</Link>
          <Link href="/login" style={{ fontSize: 14, background: NAVY_DARK, color: '#fff', padding: '8px 18px', borderRadius: 8, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600 }}>Sign In</Link>
        </div>
      </nav>

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
                <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 16, padding: '28px 32px', transition: 'border-color 0.15s', cursor: 'pointer' }}>
                  <div style={{ fontSize: 12, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {post.author} · {formatDate(post.published_at || post.created_at)}
                  </div>
                  <h2 style={{ margin: '0 0 12px', fontSize: 22, fontWeight: 700, color: DARK, lineHeight: 1.3 }}>{post.title}</h2>
                  {post.excerpt && (
                    <p style={{ margin: '0 0 16px', fontSize: 15, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", lineHeight: 1.6 }}>{post.excerpt}</p>
                  )}
                  <span style={{ fontSize: 14, color: GOLD, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600 }}>Read more →</span>
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
