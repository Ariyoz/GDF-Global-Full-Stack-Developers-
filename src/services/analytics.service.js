// ── Analytics Service — Demo ──

export const analyticsService = {
  async getProfileViews() {
    return 0
  },

  async getWeeklyViews() {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const today = new Date().getDay()
    const days = []
    for (let i = 6; i >= 0; i--) {
      const idx = (today - i + 7) % 7
      days.push({ label: dayNames[idx], views: 0 })
    }
    return days
  },

  async logProfileView() {},

  async getJobRequestCount() {
    return 0
  },

  async getPostCount() {
    return 0
  },
}
