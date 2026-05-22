<template>
  <div class="notif-view">
    <div class="page-header">
      <div>
        <h2 class="text-headline-md">Notifications</h2>
        <p class="text-body-md" style="margin-top:0.25rem">Stay up to date with your activity.</p>
      </div>
      <button class="btn-ghost mark-all-btn" @click="markAllRead">
        <span class="material-symbols-outlined" style="font-size:16px;">done_all</span>
        Mark all read
      </button>
    </div>

    <!-- Filter Tabs -->
    <div class="filter-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        class="filter-tab"
        :class="{ active: activeTab === tab.value }"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
        <span v-if="tab.count" class="tab-count">{{ tab.count }}</span>
      </button>
    </div>

    <!-- Notifications List -->
    <div class="notif-list">
      <div
        v-for="notif in filteredNotifs"
        :key="notif.id"
        class="notif-item glass-card"
        :class="{ unread: !notif.read }"
        @click="markRead(notif)"
      >
        <div class="notif-icon-wrap" :style="{ background: notif.bg }">
          <span class="material-symbols-outlined notif-icon" :style="{ color: notif.color }">{{ notif.icon }}</span>
        </div>
        <div class="notif-content">
          <p class="notif-title">{{ notif.title }}</p>
          <p class="notif-desc">{{ notif.desc }}</p>
          <p class="notif-time">{{ notif.time }}</p>
        </div>
        <div v-if="!notif.read" class="unread-dot" />
      </div>

      <div v-if="!filteredNotifs.length" class="empty-state glass-card-static">
        <span class="material-symbols-outlined" style="font-size:3rem;color:var(--on-surface-variant)">notifications_off</span>
        <p class="text-headline-md" style="margin-top:1rem">All caught up!</p>
        <p class="text-body-md" style="margin-top:0.5rem">No notifications to show.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'
import { notificationsService } from '@/services/notifications.service'

const authStore = useAuthStore()
const activeTab = ref('all')

const tabs = ref([
  { value: 'all',      label: 'All',      count: 0 },
  { value: 'unread',   label: 'Unread',   count: 0 },
  { value: 'mentions', label: 'Mentions', count: 0 },
])

const notifications = ref([])

const filteredNotifs = computed(() => {
  if (activeTab.value === 'unread')   return notifications.value.filter(n => !n.read)
  if (activeTab.value === 'mentions') return notifications.value.filter(n => n.type === 'mentions')
  return notifications.value
})

async function markRead(notif) {
  notif.read = true
  await notificationsService.markAsRead(notif.id)
  updateCounts()
}

async function markAllRead() {
  const userId = authStore.user?.id
  if (!userId) return
  await notificationsService.markAllAsRead(userId)
  notifications.value.forEach(n => { n.read = true })
  updateCounts()
}

function updateCounts() {
  tabs.value[0].count = notifications.value.length
  tabs.value[1].count = notifications.value.filter(n => !n.read).length
  tabs.value[2].count = notifications.value.filter(n => n.type === 'mentions').length
}

onMounted(async () => {
  const userId = authStore.user?.id
  if (!userId) return

  try {
    const data = await notificationsService.getAll(userId)
    notifications.value = (data || []).map(n => ({
      id: n.id,
      icon: n.type === 'message' ? 'chat' : n.type === 'job' ? 'work' : n.type === 'like' ? 'favorite' : 'notifications',
      color: 'var(--primary)',
      bg: 'rgba(99,14,212,0.08)',
      title: n.message,
      desc: '',
      time: new Date(n.created_at).toLocaleString(),
      read: n.is_read,
      type: n.type || 'all',
    }))
    updateCounts()

    // Subscribe to real-time notifications
    notificationsService.subscribeToNotifications(userId, (newNotif) => {
      notifications.value.unshift({
        id: newNotif.id,
        icon: 'notifications',
        color: 'var(--primary)',
        bg: 'rgba(99,14,212,0.08)',
        title: newNotif.message,
        desc: '',
        time: 'Just now',
        read: false,
        type: newNotif.type || 'all',
      })
      updateCounts()
    })
  } catch (err) {
    console.error('Failed to load notifications:', err)
  }
})
</script>

<style scoped>
.notif-view { display: flex; flex-direction: column; gap: 1.25rem; }

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.mark-all-btn { font-size: 0.875rem; }

.filter-tabs {
  display: flex;
  gap: 0.25rem;
  border-bottom: 1px solid var(--outline-variant);
  padding-bottom: 0;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.625rem 1rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--on-surface-variant);
  cursor: pointer;
  transition: var(--transition-fast);
  margin-bottom: -1px;
}

.filter-tab:hover { color: var(--primary); }

.filter-tab.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
}

.tab-count {
  min-width: 18px;
  height: 18px;
  border-radius: var(--radius-full);
  background: var(--primary);
  color: var(--on-primary);
  font-size: 0.65rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

.notif-list { display: flex; flex-direction: column; gap: 0.625rem; }

.notif-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  cursor: pointer;
  position: relative;
  transition: var(--transition-fast);
}

.notif-item.unread {
  background: var(--surface-container-low);
  border-color: var(--glass-border-primary);
}

.notif-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notif-icon { font-size: 22px; }

.notif-content { flex: 1; min-width: 0; }

.notif-title {
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--on-surface);
}

.notif-desc {
  font-size: 0.8rem;
  color: var(--on-surface-variant);
  margin-top: 0.2rem;
  line-height: 1.5;
}

.notif-time {
  font-size: 0.75rem;
  color: var(--outline);
  margin-top: 0.35rem;
}

.unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--primary);
  flex-shrink: 0;
  margin-top: 0.35rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3rem 2rem;
  border-radius: var(--radius-xl);
}
</style>
