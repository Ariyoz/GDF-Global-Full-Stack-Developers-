// ── Messaging Store — Real Backend ──
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { messagingService } from '@/services/messaging.service'
import { websocketService } from '@/services/websocket.service'
import { useAuthStore } from '@/store/auth'
import http from '@/services/http'

export const useMessagingStore = defineStore('messaging', () => {
  const conversations = ref([])
  const activeConversation = ref(null)
  const messages = ref([])
  const unreadCount = ref(0)
  const loading = ref(false)
  const typingUsers = ref({}) // { conversationId: [userId, ...] }

  // Listen for WebSocket events
  websocketService.onEvent((event) => {
    if (event.type === 'message_sent') {
      // New message received
      if (activeConversation.value?.id === event.data?.conversation_id) {
        messages.value.push({
          id: Date.now(),
          content: event.data.content_preview,
          sender_id: event.data.sender_id,
          created_at: new Date().toISOString(),
          is_read: false,
          mine: false,
        })
      }
      unreadCount.value++
      fetchConversations() // Refresh conversation list
    }

    if (event.type === 'typing_start') {
      const convId = event.data?.conversation_id
      if (convId) {
        if (!typingUsers.value[convId]) typingUsers.value[convId] = []
        if (!typingUsers.value[convId].includes(event.from)) {
          typingUsers.value[convId].push(event.from)
        }
      }
    }

    if (event.type === 'typing_stop') {
      const convId = event.data?.conversation_id
      if (convId && typingUsers.value[convId]) {
        typingUsers.value[convId] = typingUsers.value[convId].filter(id => id !== event.from)
      }
    }
  })

  async function fetchConversations() {
    const authStore = useAuthStore()
    if (!authStore.user) return
    loading.value = true
    try {
      const data = await messagingService.getConversations(authStore.user.id)
      conversations.value = data.map(c => ({
        id: c.id,
        name: c.name || 'User',
        avatar: c.avatar,
        lastMessage: c.last_message_content || '',
        time: c.last_message_at ? new Date(c.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        unread: 0,
        type: c.type,
        otherUserId: c.other_user_id,
      }))
    } catch (err) {
      console.error('Failed to fetch conversations:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchMessages(conversationId) {
    loading.value = true
    try {
      const authStore = useAuthStore()
      const data = await messagingService.getMessages(conversationId)
      messages.value = data.map(m => ({
        id: m.id,
        content: m.content,
        time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mine: m.sender_id === authStore.user?.id,
        sender_id: m.sender_id,
        message_type: m.message_type,
        media_url: m.media_url,
        is_read: m.is_read,
        created_at: m.created_at,
      }))
    } catch (err) {
      console.error('Failed to fetch messages:', err)
    } finally {
      loading.value = false
    }
  }

  async function sendMessage(content, type = 'text', mediaUrl = null) {
    if (!activeConversation.value) return
    const authStore = useAuthStore()
    try {
      const result = await messagingService.sendMessage(
        activeConversation.value.id,
        authStore.user.id,
        content,
        type,
        mediaUrl,
      )

      // Add to local messages immediately
      messages.value.push({
        id: result?.id || Date.now(),
        content,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mine: true,
        sender_id: authStore.user.id,
        message_type: type,
        media_url: mediaUrl,
        is_read: false,
        is_edited: false,
        created_at: new Date().toISOString(),
      })

      // Send via WebSocket for instant delivery
      websocketService.send({
        type: 'message',
        conversation_id: activeConversation.value.id,
        content,
        to: activeConversation.value.otherUserId,
      })
    } catch (err) {
      console.error('Failed to send message:', err)
    }
  }

  async function deleteConversation(convId) {
    try {
      await http.request({ method: 'DELETE', url: `/messages/conversations/${convId}` })
    } catch (err) {
      console.error('Failed to delete conversation:', err)
    }
    // Remove from local state regardless
    conversations.value = conversations.value.filter(c => c.id !== convId)
    if (activeConversation.value?.id === convId) {
      activeConversation.value = null
      messages.value = []
    }
  }

  async function deleteMessage(messageId) {
    try {
      await http.request({ method: 'DELETE', url: `/messages/messages/${messageId}` })
      const msg = messages.value.find(m => m.id === messageId)
      if (msg) {
        msg.content = 'This message was deleted'
        msg.is_deleted = true
      }
    } catch (err) {
      console.error('Failed to delete message:', err)
    }
  }

  function pinChat(convId) {
    const conv = conversations.value.find(c => c.id === convId)
    if (conv) {
      conv.pinned = !conv.pinned
      // Sort: pinned first, then by time
      conversations.value.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1
        if (!a.pinned && b.pinned) return 1
        return 0
      })
    }
  }

  async function createGroupChat(name, participantIds) {
    const authStore = useAuthStore()
    try {
      const data = await messagingService.startConversation(authStore.user.id, participantIds[0])
      // For group, we'd need a different endpoint — using existing for now
      await fetchConversations()
      return data
    } catch (err) {
      console.error('Failed to create group:', err)
    }
  }

  async function startConversation(otherUserId) {
    const authStore = useAuthStore()
    try {
      const conv = await messagingService.startConversation(authStore.user.id, otherUserId)
      await fetchConversations()
      return conv
    } catch (err) {
      console.error('Failed to start conversation:', err)
    }
  }

  function setActiveConversation(conv) {
    activeConversation.value = conv
    if (conv) fetchMessages(conv.id)
  }

  function sendTyping() {
    if (activeConversation.value) {
      websocketService.send({
        type: 'typing_start',
        conversation_id: activeConversation.value.id,
        to: activeConversation.value.otherUserId,
      })
    }
  }

  function sendStopTyping() {
    if (activeConversation.value) {
      websocketService.send({
        type: 'typing_stop',
        conversation_id: activeConversation.value.id,
        to: activeConversation.value.otherUserId,
      })
    }
  }

  // ── Call Signaling ──
  const callEvent = ref(null)

  function sendCallSignal(type, data) {
    websocketService.send({ type, ...data })
  }

  function clearCallEvent() {
    callEvent.value = null
  }

  // Listen for call events from WebSocket
  websocketService.onEvent((event) => {
    if (['incoming_call', 'call_accepted', 'call_rejected', 'call_ended'].includes(event.type)) {
      callEvent.value = event
    }
  })

  return {
    conversations, activeConversation, messages, unreadCount, loading, typingUsers,
    callEvent,
    fetchConversations, fetchMessages, sendMessage, startConversation,
    setActiveConversation, sendTyping, sendStopTyping, deleteConversation, deleteMessage,
    pinChat, createGroupChat, sendCallSignal, clearCallEvent,
  }
})
