// ── Axios HTTP Client ──
import axios from 'axios'
import { API_BASE_URL, API_TIMEOUT } from '@/config/api'
import { useAuthStore } from '@/store/auth'
import router from '@/router'

const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
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
        const authStore = useAuthStore()
        await authStore.refreshToken()
        const newToken = localStorage.getItem('gfd_token')
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return http(originalRequest)
      } catch {
        const authStore = useAuthStore()
        authStore.logout()
        router.push('/auth/login')
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)

export default http
