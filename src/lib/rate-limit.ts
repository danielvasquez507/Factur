const store = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(
  ip: string,
  maxAttempts: number = 5
) {
  const now = Date.now()
  const entry = store.get(ip)

  if (!entry || now > entry.resetAt) {
    return { success: true, remaining: maxAttempts }
  }

  if (entry.count >= maxAttempts) {
    return { success: false, remaining: 0 }
  }

  return { success: true, remaining: maxAttempts - entry.count }
}

export function incrementRateLimit(
  ip: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000,
) {
  const now = Date.now()
  const entry = store.get(ip)

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + windowMs })
    return { success: true, remaining: maxAttempts - 1 }
  }

  entry.count++
  if (entry.count >= maxAttempts) {
    return { success: false, remaining: 0 }
  }

  return { success: true, remaining: maxAttempts - entry.count }
}

export function resetRateLimit(ip: string) {
  store.delete(ip)
}

setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key)
  }
}, 60_000)
