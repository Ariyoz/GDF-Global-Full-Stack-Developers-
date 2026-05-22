// ── Messaging Service — Demo ──

export const messagingService = {
  async getConversations() {
    return []
  },

  async getMessages() {
    return []
  },

  async sendMessage(conversationId, senderId, content) {
    return {
      id: 'msg-' + Date.now(),
      conversation_id: conversationId,
      sender_id: senderId,
      content,
      created_at: new Date().toISOString(),
    }
  },

  async startConversation(userId, otherUserId) {
    return { id: 'conv-' + Date.now(), participant_1: userId, participant_2: otherUserId }
  },

  async markAsRead() {},

  async getUnreadCount() {
    return 0
  },

  subscribeToMessages() {
    return { unsubscribe: () => {} }
  },
}
