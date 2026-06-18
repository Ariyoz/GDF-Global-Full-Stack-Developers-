// ── Messaging Service — upgraded with reactions, search, attachments, read receipts ──
import http from './http'
import { API_ENDPOINTS } from '@/config/api'

const { messages } = API_ENDPOINTS

export const messagingService = {
  async getConversations() {
    const data = await http.get(messages.conversations)
    return data.conversations || []
  },

  async getMessages(conversationId, page = 1) {
    const data = await http.get(`${messages.messages(conversationId)}?page=${page}&limit=50`)
    return data.messages || []
  },

  async sendMessage(conversationId, payload) {
    // payload: { content, message_type, media_url, file_name, file_size, file_type, reply_to_id }
    return http.post(messages.send(conversationId), payload)
  },

  async searchMessages(conversationId, query, page = 1) {
    const data = await http.get(`${messages.search(conversationId)}?q=${encodeURIComponent(query)}&page=${page}`)
    return data.messages || []
  },

  async reactToMessage(conversationId, messageId, emoji) {
    return http.post(messages.react(conversationId, messageId), { emoji })
  },

  async markDelivered(conversationId, messageId) {
    return http.post(messages.delivered(conversationId, messageId), {})
  },

  async markRead(messageId) {
    return http.patch(messages.markRead(messageId), {})
  },

  async deleteMessage(messageId) {
    return http.request({ method: 'DELETE', url: messages.deleteMsg(messageId) })
  },

  async editMessage(messageId, content) {
    return http.patch(messages.editMsg(messageId), { content })
  },

  async deleteConversation(conversationId) {
    return http.request({ method: 'DELETE', url: messages.deleteConv(conversationId) })
  },

  async startConversation(otherUserId, type = 'direct', name = null, jobId = null) {
    const payload = { participant_ids: [otherUserId], type }
    if (name) payload.name = name
    if (jobId) payload.job_id = jobId
    const data = await http.post(messages.conversations, payload)
    return data
  },

  async uploadAttachment(file) {
    const formData = new FormData()
    formData.append('file', file)
    return http.post(messages.uploadAttachment, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}
