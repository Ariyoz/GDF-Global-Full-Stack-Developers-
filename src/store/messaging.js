// ── Messaging Store — upgraded with reactions, search, read receipts, attachments ──
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { messagingService } from '@/services/messaging.service'
import { websocketService } from '@/services/websocket.service'
import { useAuthStore } from '@/store/auth'

export const useMessagingStore = defineStore('messaging', () => {
  const conversations = ref([])
  const activeConversation = ref(null)
  const messages = ref([])
  const unreadCount = ref(0)
  const loading = ref(false)
  const sending = ref(false)
  const typingUsers = ref({}) // { conversationId: [userId, ...] }
  const callEvent = ref(null)
  const onlineUserIds = ref(new Set())
  const searchResults = ref([])
  const searchQuery = ref('')
  const isSearching = ref(false)

  // Total unread across all conversations
  const totalUnread = computed(() =>
    conversations.value.reduce((sum, c) => sum + (c.unread_count || 0), 0)
  )

  // ── WebSocket event handler ──────────────────────────────────────────────
  websocketService.onEvent((event) => {
    const authStore = useAuthStore()

    switch (event.type) {
      case 'message_sent': {
        const convId = event.conversation_id || event.data?.conversation_id
        const content = event.content || event.data?.content || ''
        const senderId = event.from || event.data?.sender_id
        if (senderId === authStore.user?.id) break

        if (convId && activeConversation.value?.id === convId) {
          messages.value.push({
            id: event.message_id || `ws-${Date.now()}`,
            content,
            time: _formatTime(new Date()),
            sender_id: senderId,
            created_at: new Date().toISOString(),
            is_read: false,
            mine: false,
            message_type: event.message_type || 'text',
            media_url: event.media_url || null,
            file_name: event.file_name || null,
            link_preview: event.link_preview || null,
            reply_preview: event.reply_preview || null,
            reactions: event.reactions || {},
            status: event.status || 'delivered',
          })
          // Auto-scroll handled by view via watch on messages
        }

        const conv = conversations.value.find(c => c.id === convId)
        if (conv) {
          conv.last_message_content = content || (event.file_name ? '📎 ' + event.file_name : '')
          conv.last_message_at = new Date().toISOString()
          if (activeConversation.value?.id !== convId) {
            conv.unread_count = (conv.unread_count || 0) + 1
          }
          _moveToTop(convId)
        } else {
          fetchConversations()
        }
        break
      }

      case 'message_reaction': {
        const { message_id, reactions } = event.data || {}
        if (message_id) {
          const msg = messages.value.find(m => m.id === message_id)
          if (msg) msg.reactions = reactions
        }
        break
      }

      case 'message_status_update': {
        const { message_id, status } = event.data || {}
        if (message_id) {
          const msg = messages.value.find(m => m.id === message_id)
          if (msg) msg.status = status
        }
        break
      }

      case 'messages_seen': {
        const { conversation_id, message_ids } = event.data || {}
        if (conversation_id && message_ids) {
          message_ids.forEach(id => {
            const msg = messages.value.find(m => m.id === id)
            if (msg) msg.status = 'seen'
          })
        }
        break
      }

      case 'message_delivered_ack': {
        const { message_id } = event.data || {}
        if (message_id) {
          const msg = messages.value.find(m => m.id === message_id)
          if (msg) msg.status = 'delivered'
        }
        break
      }

      case 'typing_start': {
        const convId = event.conversation_id || event.data?.conversation_id
        const fromId = event.from || event.data?.from
        if (convId && fromId) {
          if (!typingUsers.value[convId]) typingUsers.value[convId] = []
          if (!typingUsers.value[convId].includes(fromId)) {
            typingUsers.value[convId] = [...typingUsers.value[convId], fromId]
          }
        }
        break
      }

      case 'typing_stop': {
        const convId = event.conversation_id || event.data?.conversation_id
        const fromId = event.from || event.data?.from
        if (convId && typingUsers.value[convId]) {
          typingUsers.value[convId] = typingUsers.value[convId].filter(id => id !== fromId)
        }
        break
      }

      case 'user_online': {
        const userId = event.data?.user_id || event.user_id
        if (userId) {
          onlineUserIds.value.add(userId)
          _updateOnlineStatus(userId, true)
        }
        break
      }

      case 'user_offline': {
        const userId = event.data?.user_id || event.user_id
        if (userId) {
          onlineUserIds.value.delete(userId)
          _updateOnlineStatus(userId, false)
        }
        break
      }

      case 'online_users': {
        const onlineIds = event.data?.user_ids || []
        onlineIds.forEach(id => onlineUserIds.value.add(id))
        conversations.value.forEach(c => {
          if (onlineIds.includes(c.other_user_id)) c.online = true
        })
        break
      }

      default:
        if (['incoming_call', 'call_accepted', 'call_rejected', 'call_ended', 'webrtc_ice'].includes(event.type)) {
          callEvent.value = event
        }
    }
  })

  // ── Helpers ──────────────────────────────────────────────────────────────

  function _formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  function _moveToTop(convId) {
    const idx = conversations.value.findIndex(c => c.id === convId)
    if (idx > 0) {
      const [conv] = conversations.value.splice(idx, 1)
      conversations.value.unshift(conv)
    }
  }

  function _updateOnlineStatus(userId, online) {
    conversations.value.forEach(c => {
      if (c.other_user_id === userId) c.online = online
    })
    if (activeConversation.value?.other_user_id === userId) {
      activeConversation.value.online = online
    }
  }

  function _normaliseMessage(m) {
    const authStore = useAuthStore()
    return {
      id: m.id,
      content: m.content,
      time: m.created_at ? _formatTime(new Date(m.created_at)) : '',
      mine: m.mine ?? (m.sender_id === authStore.user?.id),
      sender_id: m.sender_id,
      message_type: m.message_type || 'text',
      media_url: m.media_url,
      file_name: m.file_name,
      file_size: m.file_size,
      file_type: m.file_type,
      is_read: m.is_read,
      is_edited: m.is_edited,
      is_deleted: m.is_deleted,
      reply_to_id: m.reply_to_id,
      reply_preview: m.reply_preview,
      link_preview: m.link_preview,
      reactions: m.reactions || {},
      status: m.status || 'sent',
      created_at: m.created_at,
    }
  }

  // ── Actions ──────────────────────────────────────────────────────────────

  async function fetchConversations() {
    const authStore = useAuthStore()
    if (!authStore.user) return
    loading.value = true
    try {
      const data = await messagingService.getConversations()
      conversations.value = data.map(c => ({
        ...c,
        online: c.online || onlineUserIds.value.has(c.other_user_id) || false,
        time: c.last_message_at ? _formatTime(new Date(c.last_message_at)) : '',
      }))
    } catch (err) {
      console.error('Failed to fetch conversations:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchMessages(conversationId, page = 1) {
    loading.value = true
    try {
      const data = await messagingService.getMessages(conversationId, page)
      if (page === 1) {
        messages.value = data.map(_normaliseMessage)
      } else {
        // Prepend older messages
        messages.value = [...data.map(_normaliseMessage), ...messages.value]
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err)
    } finally {
      loading.value = false
    }
  }

  async function sendMessage(payload) {
    // payload: { content, message_type, media_url, file_name, file_size, file_type, reply_to_id }
    if (!activeConversation.value) return
    const authStore = useAuthStore()
    sending.value = true

    // Optimistic message
    const tempId = `local-${Date.now()}`
    const optimistic = {
      id: tempId,
      content: payload.content || '',
      time: _formatTime(new Date()),
      mine: true,
      sender_id: authStore.user?.id,
      message_type: payload.message_type || 'text',
      media_url: payload.media_url || null,
      file_name: payload.file_name || null,
      file_size: payload.file_size || null,
      file_type: payload.file_type || null,
      is_read: false,
      is_edited: false,
      is_deleted: false,
      reply_to_id: payload.reply_to_id || null,
      reply_preview: null,
      link_preview: null,
      reactions: {},
      status: 'sent',
      created_at: new Date().toISOString(),
    }
    messages.value.push(optimistic)

    try {
      const result = await messagingService.sendMessage(activeConversation.value.id, payload)
      // Replace temp message with real one
      const idx = messages.value.findIndex(m => m.id === tempId)
      if (idx !== -1) {
        messages.value[idx] = {
          ...optimistic,
          id: result.id || tempId,
          status: result.status || 'sent',
          link_preview: result.link_preview || null,
        }
      }

      // Update conversation preview
      const conv = conversations.value.find(c => c.id === activeConversation.value?.id)
      if (conv) {
        conv.last_message_content = payload.content || (payload.file_name ? '📎 ' + payload.file_name : '')
        conv.time = _formatTime(new Date())
        _moveToTop(activeConversation.value.id)
      }

      return result
    } catch (err) {
      // Remove optimistic on error
      messages.value = messages.value.filter(m => m.id !== tempId)
      console.error('Failed to send message:', err)
      throw err
    } finally {
      sending.value = false
    }
  }

  async function reactToMessage(conversationId, messageId, emoji) {
    try {
      const result = await messagingService.reactToMessage(conversationId, messageId, emoji)
      // Optimistic update is handled via WebSocket event
      return result
    } catch (err) {
      console.error('Failed to react:', err)
    }
  }

  async function searchMessages(query) {
    if (!activeConversation.value || !query.trim()) {
      searchResults.value = []
      return
    }
    isSearching.value = true
    searchQuery.value = query
    try {
      const data = await messagingService.searchMessages(activeConversation.value.id, query)
      searchResults.value = data.map(_normaliseMessage)
    } catch (err) {
      console.error('Search failed:', err)
    } finally {
      isSearching.value = false
    }
  }

  async function uploadAttachment(file) {
    return messagingService.uploadAttachment(file)
  }

  async function deleteMessage(messageId) {
    try {
      await messagingService.deleteMessage(messageId)
      const msg = messages.value.find(m => m.id === messageId)
      if (msg) {
        msg.content = 'This message was deleted'
        msg.is_deleted = true
      }
    } catch (err) {
      console.error('Failed to delete message:', err)
    }
  }

  async function deleteConversation(convId) {
    try {
      await messagingService.deleteConversation(convId)
    } catch {}
    conversations.value = conversations.value.filter(c => c.id !== convId)
    if (activeConversation.value?.id === convId) {
      activeConversation.value = null
      messages.value = []
    }
  }

  async function startConversation(otherUserId, options = {}) {
    const authStore = useAuthStore()
    try {
      const conv = await messagingService.startConversation(
        otherUserId,
        options.type || 'direct',
        options.name,
        options.jobId,
      )
      await fetchConversations()
      return conv
    } catch (err) {
      console.error('Failed to start conversation:', err)
    }
  }

  function setActiveConversation(conv) {
    activeConversation.value = conv
    searchResults.value = []
    searchQuery.value = ''
    if (conv) {
      fetchMessages(conv.id)
      // Reset unread count locally
      const c = conversations.value.find(c => c.id === conv.id)
      if (c) c.unread_count = 0
    }
  }

  function sendTyping() {
    if (activeConversation.value) {
      websocketService.send({
        type: 'typing_start',
        conversation_id: activeConversation.value.id,
        to: activeConversation.value.other_user_id,
      })
    }
  }

  function sendStopTyping() {
    if (activeConversation.value) {
      websocketService.send({
        type: 'typing_stop',
        conversation_id: activeConversation.value.id,
        to: activeConversation.value.other_user_id,
      })
    }
  }

  function isUserTyping(conversationId) {
    return (typingUsers.value[conversationId] || []).length > 0
  }

  function isUserOnline(userId) {
    return onlineUserIds.value.has(userId)
  }

  function pinChat(convId) {
    const conv = conversations.value.find(c => c.id === convId)
    if (conv) {
      conv.pinned = !conv.pinned
      conversations.value.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1
        if (!a.pinned && b.pinned) return 1
        return 0
      })
    }
  }

  // ── Call Signaling ────────────────────────────────────────────────────────

  function sendCallSignal(type, data) {
    websocketService.send({ type, ...data })
  }

  function clearCallEvent() {
    callEvent.value = null
  }

  return {
    conversations, activeConversation, messages, unreadCount, totalUnread,
    loading, sending, typingUsers, callEvent, onlineUserIds,
    searchResults, searchQuery, isSearching,
    fetchConversations, fetchMessages, sendMessage, startConversation,
    setActiveConversation, sendTyping, sendStopTyping,
    reactToMessage, searchMessages, uploadAttachment,
    deleteMessage, deleteConversation,
    isUserTyping, isUserOnline, pinChat,
    sendCallSignal, clearCallEvent,
  }
})
