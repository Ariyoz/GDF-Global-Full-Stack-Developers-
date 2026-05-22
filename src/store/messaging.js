// ── Messaging Store — Supabase ──
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { messagingService } from '@/services/messaging.service'
import { useAuthStore } from '@/store/auth'

export const useMessagingStore = defineStore('messaging', () => {
  const conversations = ref([])
  const activeConversation = ref(null)
  const messages = ref([])
  const unreadCount = ref(0)
  const loading = ref(false)
  let subscription = null

  async function fetchConversations() {
    const authStore = useAuthStore()
    if (!authStore.user) return
    loading.value = true
    try {
      const data = await messagingService.getConversations(authStore.user.id)
      conversations.value = data.map(c => {
        const other = c.participant_1 === authStore.user.id ? c.participant2 : c.participant1
        return {
          id: c.id,
          name: other?.full_name || 'User',
          avatar: other?.avatar,
          initials: (other?.full_name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
          lastMessage: c.last_message || '',
          time: c.last_message_at ? new Date(c.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
          unread: 0,
          online: false,
          otherId: other?.id,
        }
      })
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
        text: m.content,
        time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mine: m.sender_id === authStore.user.id,
        sender: m.sender,
      }))

      // Mark as read
      await messagingService.markAsRead(conversationId, authStore.user.id)

      // Subscribe to new messages
      if (subscription) subscription.unsubscribe()
      subscription = messagingService.subscribeToMessages(conversationId, (newMsg) => {
        messages.value.push({
          id: newMsg.id,
          text: newMsg.content,
          time: new Date(newMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mine: newMsg.sender_id === authStore.user.id,
        })
      })
    } catch (err) {
      console.error('Failed to fetch messages:', err)
    } finally {
      loading.value = false
    }
  }

  async function sendMessage(content) {
    if (!activeConversation.value) return
    const authStore = useAuthStore()
    try {
      await messagingService.sendMessage(activeConversation.value.id, authStore.user.id, content)
    } catch (err) {
      console.error('Failed to send message:', err)
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

  return {
    conversations, activeConversation, messages, unreadCount, loading,
    fetchConversations, fetchMessages, sendMessage, startConversation, setActiveConversation,
  }
})
