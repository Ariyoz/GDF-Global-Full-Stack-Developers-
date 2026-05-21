// ── Auth Service ──
import http from './http'
import { API_ENDPOINTS } from '@/config/api'

const { auth } = API_ENDPOINTS

export const authService = {
  async login(credentials) {
    return http.post(auth.login, credentials)
  },

  async register(userData) {
    return http.post(auth.register, userData)
  },

  async logout() {
    return http.post(auth.logout)
  },

  async refreshToken(refreshToken) {
    return http.post(auth.refresh, { refreshToken })
  },

  async forgotPassword(email) {
    return http.post(auth.forgotPassword, { email })
  },

  async resetPassword(token, password) {
    return http.post(auth.resetPassword, { token, password })
  },

  async getMe() {
    return http.get(auth.me)
  },
}
