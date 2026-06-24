// ── Analytics Service ──
import http from './http'

export const analyticsService = {
  async getMyAnalytics(period = 7) {
    return http.get(`/users/me/analytics?period=${period}`)
  },
}
