// ── Admin Service — Demo ──

export const adminService = {
  async getAnalytics() {
    return { totalUsers: 0, totalPosts: 0, totalJobs: 0, activeJobs: 0 }
  },

  async listUsers() {
    return { users: [], total: 0 }
  },

  async suspendUser() {
    return null
  },

  async reinstateUser() {
    return null
  },

  async getReports() {
    return []
  },

  async getRecentActivity() {
    return []
  },

  async updateUserRole() {
    return null
  },
}
