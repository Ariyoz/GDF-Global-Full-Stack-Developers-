// ── Messaging Service — Real Backend ──
import http from './http'
import { API_ENDPOINTS } from '@/config/api'

const { messages } = API_ENDPOINTS

export const messagingService = {
  async getConversations(userId) {
    const data = await http.get(messages.conversations)
    return data.conversations || []
  },

  async getMessages(conversationId) {
    const data = await http.get(messages.messages(conversationId))
    return data.messages || []
  },

  async sendMessage(conversationId, senderId, content) {
    return http.post(messages.send(conversationId), { content })
  },

  async startConversation(userId, otherUserId) {
    return http.post(messages.conversations, { participant_ids: [otherUserId] })
  },

  async markAsRead() {},

  async getUnreadCount() {
    return 0
  },

  subscribeToMessages() {
    return { unsubscribe: () => {} }
  },
}
