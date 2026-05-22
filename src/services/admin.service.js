// ── Admin Service — Real Backend ──
import http from './http'
import { API_ENDPOINTS } from '@/config/api'

const { admin } = API_ENDPOINTS

export const adminService = {
  async getAnalytics() {
    return http.get(admin.analytics)
  },

  async listUsers({ page = 1, limit = 20, search, role, status } = {}) {
    let url = `${admin.users}?page=${page}&limit=${limit}`
    if (search) url += `&search=${search}`
    if (role) url += `&role=${role}`
    if (status) url += `&status_filter=${status}`
    return http.get(url)
  },

  async suspendUser(userId) {
    return http.patch(admin.suspend(userId))
  },

  async reinstateUser(userId) {
    return http.patch(admin.reinstate(userId))
  },

  async getReports({ status } = {}) {
    let url = admin.reports
    if (status) url += `?status_filter=${status}`
    return http.get(url)
  },

  async getRecentActivity(limit = 10) {
    return http.get(`${admin.users}?limit=${limit}`)
  },

  async updateUserRole(userId, role) {
    return http.patch(admin.suspend(userId).replace('/suspend', ''), { role })
  },
}
