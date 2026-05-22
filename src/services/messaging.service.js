// ── Messaging Service — Real Backend with WebSocket ──
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

  async sendMessage(conversationId, senderId, content, type = 'text', mediaUrl = null) {
    return http.post(messages.send(conversationId), {
      content,
      message_type: type,
      media_url: mediaUrl,
    })
  },

  async startConversation(userId, otherUserId) {
    const data = await http.post(messages.conversations, {
      participant_ids: [otherUserId],
      type: 'direct',
    })
    return data
  },

  async markAsRead(conversationId) {
    // Will be handled via WebSocket
  },

  async getUnreadCount() {
    return 0
  },

  // WebSocket connection for real-time messaging
  connectWebSocket(token, onMessage) {
    const wsUrl = import.meta.env.VITE_API_BASE_URL?.replace('https://', 'wss://').replace('http://', 'ws://').replace('/api/v1', '')
    if (!wsUrl || !token) return null

    try {
      const ws = new WebSocket(`${wsUrl}/ws/${token}`)

      ws.onopen = () => {
        console.log('WebSocket connected')
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (onMessage) onMessage(data)
        } catch (e) {
          console.warn('WebSocket message parse error:', e)
        }
      }

      ws.onclose = () => {
        console.log('WebSocket disconnected')
        // Auto-reconnect after 5 seconds
        setTimeout(() => {
          this.connectWebSocket(token, onMessage)
        }, 5000)
      }

      ws.onerror = (err) => {
        console.warn('WebSocket error:', err)
      }

      return ws
    } catch {
      return null
    }
  },

  // Send typing indicator via WebSocket
  sendTyping(ws, conversationId, toUserId) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'typing_start',
        conversation_id: conversationId,
        to: toUserId,
      }))
    }
  },

  sendStopTyping(ws, conversationId, toUserId) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'typing_stop',
        conversation_id: conversationId,
        to: toUserId,
      }))
    }
  },
}
