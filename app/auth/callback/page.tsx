'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const BACKEND_URL = 'https://visado-backend.vercel.app'

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=604800; SameSite=Lax; Secure`
}

export default function AuthCallbackPage() {
  const router = useRouter()
  const [error, setError] = useState('')

  useEffect(() => {
    async function finishLogin() {
      const hash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash
      const params = new URLSearchParams(hash)
      const accessToken = params.get('access_token')

      if (!accessToken) {
        setError('Google sign-in did not return a valid token. Please try again.')
        return
      }

      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/google-session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: accessToken }),
        })
        const data = await res.json()
        if (!res.ok || data.error) {
          setError(data.error || 'Google sign-in failed. Please try again.')
          return
        }
        setCookie('visado_token', data.token)
        setCookie('visado_user', JSON.stringify(data.user))
        if (!data.onboardingComplete) {
          router.push('/onboarding')
          return
        }
        router.push('/dashboard')
      } catch (e) {
        console.error('Google callback error:', e)
        setError('Something went wrong finishing sign-in. Please try again.')
      }
    }
    finishLogin()
  }, [router])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', fontFamily: "'Helvetica Neue', sans-serif", background: '#F9F7F4' }}>
      <div style={{ textAlign: 'center' }}>
        {error ? (
          <>
            <p style={{ color: '#991B1B', marginBottom: 16 }}>{error}</p>
            <a href="/login" style={{ color: '#1B2F6E', fontWeight: 600 }}>Back to login</a>
          </>
        ) : (
          <p style={{ color: '#6B7280' }}>Finishing sign-in...</p>
        )}
      </div>
    </div>
  )
}
