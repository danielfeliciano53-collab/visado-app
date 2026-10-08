import { NextResponse } from 'next/server'

const BACKEND = 'https://visado-backend.vercel.app'

function sessionResponse(data: Record<string, unknown>) {
  const token = data.token as string | undefined
  const { token: _token, ...body } = data
  const response = NextResponse.json(body)
  if (token) {
    response.cookies.set('visado_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
  }
  return response
}

export async function POST(request: Request) {
  const payload = await request.json()
  const upstream = await fetch(`${BACKEND}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await upstream.json()
  return upstream.ok ? sessionResponse(data) : NextResponse.json(data, { status: upstream.status })
}
