// ── Messaging Store — Supabase ──
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export const useMessagingStore = defineStore('messaging', () => {
  const conversations = ref([])
  const activeConversation = ref(null)
  const messages = ref([])
  const unreadCount = ref(0)
  const loading = ref(false)

  function setActiveConversation(conv) {
    activeConversation.value = conv
    if (conv) conv.unread = 0
    recalcUnread()
  }

  function recalcUnread() {
    unreadCount.value = conversations.value.reduce((sum, c) => sum + (c.unread || 0), 0)
  }

  function addMessage(convId, message) {
    messages.value.push({ convId, ...message })
  }

  return {
    conversations, activeConversation, messages, unreadCount, loading,
    setActiveConversation, addMessage, recalcUnread,
  }
})
