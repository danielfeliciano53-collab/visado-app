export const BACKEND = 'https://visado-backend.vercel.app'

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : null
}

export function setCookie(name: string, value: string, days = 30) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`
}

export function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0`
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getCookie('visado_token')
  const res = await fetch(`${BACKEND}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  return res
}
