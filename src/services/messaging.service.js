// ── Messaging Service — Supabase ──
import { supabase } from '@/lib/supabase'

export const messagingService = {
  // Get all conversations for a user
  async getConversations(userId) {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        participant1:profiles!participant_1(id, full_name, avatar),
        participant2:profiles!participant_2(id, full_name, avatar)
      `)
      .or(`participant_1.eq.${userId},participant_2.eq.${userId}`)
      .order('last_message_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  // Get messages for a conversation
  async getMessages(conversationId) {
    const { data, error } = await supabase
      .from('messages')
      .select('*, sender:profiles!sender_id(id, full_name, avatar)')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
    if (error) throw error
    return data || []
  },

  // Send a message
  async sendMessage(conversationId, senderId, content) {
    const { data, error } = await supabase
      .from('messages')
      .insert({ conversation_id: conversationId, sender_id: senderId, content })
      .select('*, sender:profiles!sender_id(id, full_name, avatar)')
      .single()
    if (error) throw error
    return data
  },

  // Start a new conversation
  async startConversation(userId, otherUserId) {
    // Check if conversation already exists
    const { data: existing } = await supabase
      .from('conversations')
      .select('*')
      .or(`and(participant_1.eq.${userId},participant_2.eq.${otherUserId}),and(participant_1.eq.${otherUserId},participant_2.eq.${userId})`)
      .single()

    if (existing) return existing

    const { data, error } = await supabase
      .from('conversations')
      .insert({ participant_1: userId, participant_2: otherUserId })
      .select()
      .single()
    if (error) throw error
    return data
  },

  // Mark messages as read
  async markAsRead(conversationId, userId) {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('conversation_id', conversationId)
      .neq('sender_id', userId)
      .eq('is_read', false)
    if (error) throw error
  },

  // Get unread count
  async getUnreadCount(userId) {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .neq('sender_id', userId)
      .eq('is_read', false)
      .in('conversation_id', 
        supabase.from('conversations').select('id').or(`participant_1.eq.${userId},participant_2.eq.${userId}`)
      )
    if (error) return 0
    return count || 0
  },

  // Subscribe to new messages in a conversation
  subscribeToMessages(conversationId, callback) {
    return supabase
      .channel(`messages:${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      }, (payload) => callback(payload.new))
      .subscribe()
  },
}
