import { NextResponse } from 'next/server'

const BACKEND = 'https://visado-backend.vercel.app'

export async function POST(request: Request) {
  const { token } = await request.json()
  const upstream = await fetch(`${BACKEND}/api/auth/google-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  })
  const data = await upstream.json()
  if (!upstream.ok) return NextResponse.json(data, { status: upstream.status })

  const { token: _token, ...body } = data
  const response = NextResponse.json(body)
  response.cookies.set('visado_token', token, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 })
  return response
}
