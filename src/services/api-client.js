export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const pendingRequests = new Map()

function normalizeHeaders(headers) {
  const normalized = { Accept: 'application/json' }

  if (!headers) {
    return normalized
  }

  if (headers instanceof Headers) {
    headers.forEach((value, key) => {
      normalized[key] = value
    })
    return normalized
  }

  if (Array.isArray(headers)) {
    for (const [key, value] of headers) {
      normalized[key] = value
    }
    return normalized
  }

  return { ...normalized, ...headers }
}

function createRequestKey(input, init) {
  const method = (init.method || 'GET').toUpperCase()
  const body = typeof init.body === 'string' ? init.body : ''
  return `${method}:${input}:${body}`
}

function getErrorMessage(payload, fallback) {
  if (payload && typeof payload === 'object') {
    if (typeof payload.error === 'string' && payload.error.trim()) {
      return payload.error
    }

    if (typeof payload.message === 'string' && payload.message.trim()) {
      return payload.message
    }
  }

  return fallback
}

export async function fetchJson(input, init = {}, options = {}) {
  const useDedupe = options.dedupe !== false
  const requestKey = useDedupe ? createRequestKey(input, init) : null

  if (requestKey && pendingRequests.has(requestKey)) {
    return pendingRequests.get(requestKey)
  }

  const requestPromise = (async () => {
    const response = await fetch(input, {
      ...init,
      cache: init.cache || 'no-store',
      headers: normalizeHeaders(init.headers),
    })

    let payload = null

    try {
      payload = await response.json()
    } catch {
      payload = null
    }

    if (!response.ok) {
      const fallback = `Request failed with status ${response.status}`
      throw new ApiError(getErrorMessage(payload, fallback), response.status)
    }

    return payload
  })()

  if (requestKey) {
    pendingRequests.set(requestKey, requestPromise)
  }

  try {
    return await requestPromise
  } finally {
    if (requestKey) {
      pendingRequests.delete(requestKey)
    }
  }
}