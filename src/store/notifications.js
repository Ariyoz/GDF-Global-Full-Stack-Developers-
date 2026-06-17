// ── Notifications Store — real-time, paginated, multi-session aware ──
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import http from '@/services/http'
import { API_ENDPOINTS } from '@/config/api'
import { websocketService } from '@/services/websocket.service'
import { useRouter } from 'vue-router'

const { notifications: eps } = API_ENDPOINTS

export const useNotificationsStore = defineStore('notifications', () => {
  const items = ref([])         // notification objects
  const unreadCount = ref(0)
  const loading = ref(false)
  const page = ref(1)
  const hasMore = ref(true)

  const unread = computed(() => items.value.filter(n => !n.is_read))

  // ── WebSocket handler ────────────────────────────────────────────────────
  websocketService.onEvent((event) => {
    if (event.type === 'notification') {
      const notif = event.data
      if (!notif) return

      // Prepend to list if not already present
      const exists = items.value.some(n => n.id === notif.id)
      if (!exists) {
        items.value.unshift({
          id: notif.id,
          type: notif.type,
          title: notif.title,
          body: notif.body,
          is_read: false,
          action_url: notif.action_url,
          data: notif.data || {},
          actor_id: notif.actor_id,
          created_at: new Date().toISOString(),
        })
        unreadCount.value++
      }
    }
  })

  // ── Actions ──────────────────────────────────────────────────────────────

  async function fetchNotifications(reset = false) {
    if (loading.value) return
    if (reset) {
      page.value = 1
      items.value = []
      hasMore.value = true
    }
    if (!hasMore.value) return

    loading.value = true
    try {
      const data = await http.get(`${eps.list}?page=${page.value}&limit=30`)
      const newItems = data.notifications || []
      items.value = reset ? newItems : [...items.value, ...newItems]
      hasMore.value = newItems.length === 30
      page.value++
    } catch (err) {
      console.error('Failed to fetch notifications:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchUnreadCount() {
    try {
      const data = await http.get(eps.unread)
      unreadCount.value = data.count || 0
    } catch {}
  }

  async function markAllRead() {
    try {
      await http.patch(eps.markAllRead, {})
      items.value.forEach(n => { n.is_read = true })
      unreadCount.value = 0
    } catch (err) {
      console.error('Failed to mark all read:', err)
    }
  }

  async function markRead(id) {
    try {
      await http.patch(eps.markRead(id), {})
      const n = items.value.find(n => n.id === id)
      if (n && !n.is_read) {
        n.is_read = true
        unreadCount.value = Math.max(0, unreadCount.value - 1)
      }
    } catch {}
  }

  async function deleteNotification(id) {
    try {
      await http.request({ method: 'DELETE', url: eps.delete(id) })
      const idx = items.value.findIndex(n => n.id === id)
      if (idx !== -1) {
        const wasUnread = !items.value[idx].is_read
        items.value.splice(idx, 1)
        if (wasUnread) unreadCount.value = Math.max(0, unreadCount.value - 1)
      }
    } catch (err) {
      console.error('Failed to delete notification:', err)
    }
  }

  async function clearAll() {
    try {
      await http.request({ method: 'DELETE', url: eps.clearAll })
      items.value = []
      unreadCount.value = 0
    } catch {}
  }

  // Called when user opens the notification panel — marks all visible as read
  async function onPanelOpen() {
    if (unreadCount.value > 0) {
      await markAllRead()
    }
  }

  // Navigate to the resource linked by the notification
  function handleNotificationClick(notification, router) {
    markRead(notification.id)
    if (notification.action_url) {
      router.push(notification.action_url)
    }
  }

  return {
    items, unread, unreadCount, loading, page, hasMore,
    fetchNotifications, fetchUnreadCount,
    markRead, markAllRead, deleteNotification, clearAll,
    onPanelOpen, handleNotificationClick,
  }
})
