// ── Axios HTTP Client — Hardened + Secured ──
import axios from 'axios'
import { API_BASE_URL, API_TIMEOUT } from '@/config/api'

const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: false,
})

// ── In-flight request deduplication (GET only) ──
const pendingRequests = new Map()

// ── Security: strip any accidentally injected HTML/script from string values ──
function sanitizeValue(val) {
  if (typeof val !== 'string') return val
  // Remove script tags and event handlers that sneak into request bodies
  return val
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
}

function sanitizePayload(data) {
  if (!data || typeof data !== 'object') return data
  if (Array.isArray(data)) return data.map(sanitizePayload)
  const out = {}
  for (const [k, v] of Object.entries(data)) {
    out[k] = typeof v === 'object' ? sanitizePayload(v) : sanitizeValue(v)
  }
  return out
}

// ── Request Interceptor ──
http.interceptors.request.use(
  (config) => {
    // Attach auth token
    const token = localStorage.getItem('gfd_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Sanitize outgoing JSON bodies (defence against stored XSS via API)
    if (config.data && ['post', 'put', 'patch'].includes(config.method)) {
      try {
        const parsed = typeof config.data === 'string'
          ? JSON.parse(config.data)
          : config.data
        config.data = sanitizePayload(parsed)
      } catch { /* leave as-is if not JSON */ }
    }

    // Deduplicate identical GET requests within 300ms
    if (config.method === 'get') {
      const key = `${config.url}${JSON.stringify(config.params || {})}`
      if (pendingRequests.has(key)) {
        const controller = new AbortController()
        config.signal = controller.signal
        controller.abort('Duplicate request')
      } else {
        const controller = new AbortController()
        config._dedupKey = key
        config._controller = controller
        pendingRequests.set(key, controller)
        setTimeout(() => pendingRequests.delete(key), 300)
      }
    }

    return config
  },
  (error) => Promise.reject(error)
)

// ── Response Interceptor ──
http.interceptors.response.use(
  (response) => {
    if (response.config._dedupKey) {
      pendingRequests.delete(response.config._dedupKey)
    }
    return response.data
  },
  async (error) => {
    if (error.config?._dedupKey) {
      pendingRequests.delete(error.config._dedupKey)
    }

    if (axios.isCancel(error) || error.message === 'Duplicate request') {
      return Promise.reject(error)
    }

    const originalRequest = error.config
    if (!error.response) return Promise.reject(error)

    // ── Token refresh on 401 ──
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshToken = localStorage.getItem('gfd_refresh_token')
        if (!refreshToken) throw new Error('No refresh token')

        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        })

        localStorage.setItem('gfd_token', data.access_token)
        localStorage.setItem('gfd_refresh_token', data.refresh_token)
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`
        return http(originalRequest)
      } catch {
        localStorage.removeItem('gfd_token')
        localStorage.removeItem('gfd_refresh_token')
        localStorage.removeItem('gfd_user')
        window.location.href = '/auth/login'
        return Promise.reject(error)
      }
    }

    // ── Rate limit back-off ──
    if (error.response?.status === 429) {
      const retryAfter = parseInt(error.response.headers['retry-after'] || '60', 10)
      console.warn(`Rate limited. Retry after ${retryAfter}s`)
    }

    return Promise.reject(error)
  }
)

export default http
