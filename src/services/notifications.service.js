// ── Notifications Service — Demo ──

export const notificationsService = {
  async getAll() {
    return []
  },

  async getUnreadCount() {
    return 0
  },

  async markAsRead() {},

  async markAllAsRead() {},

  subscribeToNotifications() {
    return { unsubscribe: () => {} }
  },
}
