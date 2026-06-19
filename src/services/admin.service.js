// ── Admin Service — Real Backend ──
import http from './http'
import { API_ENDPOINTS } from '@/config/api'

const { admin } = API_ENDPOINTS

export const adminService = {
  async getAnalytics() {
    const data = await http.get(admin.analytics)
    return {
      totalUsers: data.total_users || 0,
      totalPosts: data.total_posts || 0,
      totalProjects: data.total_projects || 0,
      activeJobs: data.total_projects || 0,
      pendingReports: data.pending_reports || 0,
      developers: data.developers || 0,
      clients: data.clients || 0,
      suspendedUsers: data.suspended_users || 0,
      verifiedUsers: data.verified_users || 0,
      totalMessages: data.total_messages || 0,
      pendingSubscriptions: data.pending_subscriptions || 0,
      activeSubscriptions: data.active_subscriptions || 0,
    }
  },

  async listUsers({ page = 1, limit = 20, search, role, status } = {}) {
    let url = `${admin.users}?page=${page}&limit=${limit}`
    if (search) url += `&search=${search}`
    if (role) url += `&role=${role}`
    if (status) url += `&status_filter=${status}`
    const data = await http.get(url)
    return { users: data.users || [], total: data.total || data.users?.length || 0 }
  },

  async suspendUser(userId, durationHours = 0, reason = '') {
    return http.patch(admin.suspend(userId), {
      duration_hours: durationHours,
      reason,
    })
  },

  async reinstateUser(userId) {
    return http.patch(admin.reinstate(userId))
  },

  async getReports({ status } = {}) {
    let url = admin.reports
    if (status) url += `?status_filter=${status}`
    const data = await http.get(url)
    return data.reports || []
  },

  async getRecentActivity(limit = 10) {
    const data = await http.get(`${admin.users}?limit=${limit}`)
    // Return the users array directly (the dashboard expects an array)
    return data.users || []
  },

  async updateUserRole(userId, role) {
    return http.patch(`/admin/users/${userId}/role`, { role })
  },
}
