// ── Axios HTTP Client — Secured + Optimized ──
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

// ── Request Interceptor ──
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gfd_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Deduplicate identical GET requests made within 300ms
    if (config.method === 'get') {
      const key = `${config.url}${JSON.stringify(config.params || {})}`
      if (pendingRequests.has(key)) {
        // Cancel duplicate — return the in-flight promise via signal abort
        const controller = new AbortController()
        config.signal = controller.signal
        controller.abort('Duplicate request')
      } else {
        const controller = new AbortController()
        config._dedupKey = key
        config._controller = controller
        pendingRequests.set(key, controller)
        // Auto-clear after 300ms
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
    // Clear dedup entry on success
    if (response.config._dedupKey) {
      pendingRequests.delete(response.config._dedupKey)
    }
    return response.data
  },
  async (error) => {
    // Clear dedup entry on error too
    if (error.config?._dedupKey) {
      pendingRequests.delete(error.config._dedupKey)
    }

    // Silently ignore aborted duplicate requests
    if (axios.isCancel(error) || error.message === 'Duplicate request') {
      return Promise.reject(error)
    }

    const originalRequest = error.config

    if (!error.response) {
      return Promise.reject(error)
    }

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

    return Promise.reject(error)
  }
)

export default http
