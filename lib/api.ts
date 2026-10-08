export function deleteCookie(name: string) {
  if (name === 'visado_token' && typeof navigator !== 'undefined') {
    navigator.sendBeacon('/api/auth/logout', '')
    return
  }
  document.cookie = `${name}=; path=/; max-age=0`
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(path, {
    ...options,
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  return res
}
