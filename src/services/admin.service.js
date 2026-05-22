// ── Admin Service — Demo ──

const demoUsers = [
  { id: 'demo-user-001', full_name: 'Alex Developer', email: 'user@gfd.demo', role: 'developer', status: 'active', created_at: '2024-01-15T10:00:00Z' },
  { id: 'demo-admin-001', full_name: 'GFD Admin', email: 'admin@gfd.demo', role: 'admin', status: 'active', created_at: '2024-01-01T00:00:00Z' },
  { id: 'demo-user-002', full_name: 'Sarah Chen', email: 'sarah@example.com', role: 'developer', status: 'active', created_at: '2024-02-10T08:00:00Z' },
  { id: 'demo-user-003', full_name: 'Marcus Johnson', email: 'marcus@example.com', role: 'client', status: 'active', created_at: '2024-03-05T14:00:00Z' },
]

export const adminService = {
  async getAnalytics() {
    return { totalUsers: 4, totalPosts: 12, totalJobs: 6, activeJobs: 3 }
  },

  async listUsers({ page = 1, limit = 20, search, role, status } = {}) {
    let filtered = [...demoUsers]
    if (search) filtered = filtered.filter(u => u.full_name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
    if (role) filtered = filtered.filter(u => u.role === role)
    if (status) filtered = filtered.filter(u => u.status === status)
    return { users: filtered, total: filtered.length }
  },

  async suspendUser(userId) {
    const user = demoUsers.find(u => u.id === userId)
    if (user) user.status = 'suspended'
    return user
  },

  async reinstateUser(userId) {
    const user = demoUsers.find(u => u.id === userId)
    if (user) user.status = 'active'
    return user
  },

  async getReports() {
    return []
  },

  async getRecentActivity(limit = 10) {
    return demoUsers.slice(0, limit)
  },

  async updateUserRole(userId, role) {
    const user = demoUsers.find(u => u.id === userId)
    if (user) user.role = role
    return user
  },
}
