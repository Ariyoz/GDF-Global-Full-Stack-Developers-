// ── Notifications Service — Real Backend ──
import http from './http'
import { API_ENDPOINTS } from '@/config/api'

const { notifications } = API_ENDPOINTS

export const notificationsService = {
  async getAll(userId, { limit = 50 } = {}) {
    const data = await http.get(`${notifications.list}?limit=${limit}`)
    return data.notifications || []
  },

  async getUnreadCount() {
    const data = await http.get(notifications.unread)
    return data.count || 0
  },

  async markAsRead(notificationId) {
    return http.patch(notifications.markRead(notificationId))
  },

  async markAllAsRead() {
    return http.patch(notifications.markAllRead)
  },

  subscribeToNotifications() {
    return { unsubscribe: () => {} }
  },
}
