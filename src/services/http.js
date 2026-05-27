// ── Axios HTTP Client — Secured ──
import axios from 'axios'
import { API_BASE_URL, API_TIMEOUT } from '@/config/api'

const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // CSRF protection
  },
  withCredentials: false, // Don't send cookies cross-origin
})

// ── Request Interceptor ──
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gfd_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response Interceptor ──
http.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config

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
        // Refresh failed — clear session and redirect to login
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
