<template>
  <div class="notif-view">
    <!-- Header -->
    <div class="notif-header">
      <div class="notif-title-row">
        <h2 class="notif-title">Notifications</h2>
        <span v-if="store.unreadCount > 0" class="unread-badge">{{ store.unreadCount }}</span>
      </div>
      <div class="notif-actions">
        <button class="btn-ghost action-btn" @click="store.markAllRead()" :disabled="store.unreadCount === 0">
          <span class="material-symbols-outlined">done_all</span>
          Mark all read
        </button>
        <button class="btn-ghost action-btn danger-btn" @click="store.clearAll()">
          <span class="material-symbols-outlined">delete_sweep</span>
          Clear all
        </button>
      </div>
    </div>

    <!-- Filter tabs -->
    <div class="notif-tabs">
      <button v-for="tab in tabs" :key="tab.value"
        class="notif-tab" :class="{ active: activeTab === tab.value }"
        @click="activeTab = tab.value">
        {{ tab.label }}
        <span v-if="tab.value === 'unread' && store.unreadCount > 0" class="tab-badge">{{ store.unreadCount }}</span>
      </button>
    </div>

    <!-- List -->
    <div class="notif-list" @scroll="onScroll" ref="listEl">

      <!-- Skeletons while loading -->
      <template v-if="store.loading && !store.items.length">
        <div v-for="i in 6" :key="i" class="notif-skeleton">
          <div class="skeleton-icon shimmer"></div>
          <div class="skeleton-lines">
            <div class="shimmer" style="width:65%;height:13px;border-radius:4px;"></div>
            <div class="shimmer" style="width:45%;height:11px;border-radius:4px;margin-top:5px;"></div>
          </div>
        </div>
      </template>

      <!-- Notification items -->
      <TransitionGroup name="notif-list-anim" tag="div">
        <div v-for="notif in filteredItems" :key="notif.id"
          class="notif-item" :class="{ unread: !notif.is_read }"
          @click="handleClick(notif)">

          <!-- Icon -->
          <div class="notif-icon-wrap" :style="{ background: iconBg(notif.type) }">
            <span class="material-symbols-outlined notif-icon" :style="{ color: iconColor(notif.type) }">
              {{ iconName(notif.type) }}
            </span>
          </div>

          <!-- Content -->
          <div class="notif-body">
            <p class="notif-title-text">{{ notif.title }}</p>
            <p v-if="notif.body" class="notif-desc">{{ notif.body }}</p>
            <p class="notif-time">{{ formatTime(notif.created_at) }}</p>
          </div>

          <!-- Unread dot -->
          <div v-if="!notif.is_read" class="unread-dot"></div>

          <!-- Delete button -->
          <button class="notif-del-btn" @click.stop="store.deleteNotification(notif.id)" title="Dismiss">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
      </TransitionGroup>

      <!-- Load more trigger -->
      <div v-if="store.hasMore && !store.loading" class="load-more" @click="store.fetchNotifications()">
        Load more
      </div>

      <!-- Empty -->
      <div v-if="!store.loading && !filteredItems.length" class="notif-empty">
        <span class="material-symbols-outlined">notifications_off</span>
        <h3>All caught up!</h3>
        <p>{{ activeTab === 'unread' ? 'No unread notifications.' : 'Nothing here yet.' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationsStore } from '@/store/notifications'

const store = useNotificationsStore()
const router = useRouter()

const activeTab = ref('all')
const listEl = ref(null)

const tabs = [
  { value: 'all',     label: 'All' },
  { value: 'unread',  label: 'Unread' },
  { value: 'message', label: 'Messages' },
  { value: 'job',     label: 'Jobs' },
  { value: 'social',  label: 'Social' },
  { value: 'wallet',  label: 'Wallet' },
]

const WALLET_TYPES = ['transfer_received', 'money_request', 'request_accepted', 'request_rejected']
const JOB_TYPES = ['job_invitation', 'application_received', 'application_accepted', 'application_rejected', 'job_invite', 'hire_request']
const SOCIAL_TYPES = ['like', 'comment', 'follow', 'mention', 'repost']

const filteredItems = computed(() => {
  switch (activeTab.value) {
    case 'unread':  return store.items.filter(n => !n.is_read)
    case 'message': return store.items.filter(n => n.type === 'message')
    case 'job':     return store.items.filter(n => JOB_TYPES.includes(n.type))
    case 'social':  return store.items.filter(n => SOCIAL_TYPES.includes(n.type))
    case 'wallet':  return store.items.filter(n => WALLET_TYPES.includes(n.type))
    default:        return store.items
  }
})

function iconName(type) {
  const map = {
    like: 'favorite', comment: 'chat_bubble', follow: 'person_add',
    mention: 'alternate_email', repost: 'repeat', message: 'chat',
    application_received: 'work', application_accepted: 'check_circle',
    application_rejected: 'cancel', job_invitation: 'mail',
    project_update: 'folder', system: 'info', admin_alert: 'warning',
    transfer_received: 'account_balance_wallet',
    money_request: 'request_quote',
    request_accepted: 'check_circle',
    request_rejected: 'cancel',
    hire_request: 'handshake',
    job_invite: 'mail',
  }
  return map[type] || 'notifications'
}

function iconBg(type) {
  if (['like', 'repost'].includes(type))            return 'rgba(239,68,68,0.12)'
  if (['comment', 'mention'].includes(type))         return 'rgba(59,130,246,0.12)'
  if (['follow'].includes(type))                     return 'rgba(34,197,94,0.12)'
  if (['message'].includes(type))                    return 'rgba(168,85,247,0.12)'
  if (['application_accepted', 'request_accepted'].includes(type)) return 'rgba(34,197,94,0.12)'
  if (['application_rejected', 'request_rejected'].includes(type)) return 'rgba(239,68,68,0.12)'
  if (['job_invitation', 'application_received', 'job_invite'].includes(type)) return 'rgba(251,146,60,0.12)'
  if (['transfer_received'].includes(type))          return 'rgba(34,197,94,0.12)'
  if (['money_request'].includes(type))              return 'rgba(245,158,11,0.12)'
  if (['hire_request'].includes(type))               return 'rgba(99,14,212,0.12)'
  return 'rgba(168,85,247,0.10)'
}

function iconColor(type) {
  if (['like', 'repost'].includes(type))             return '#ef4444'
  if (['comment', 'mention'].includes(type))          return '#3b82f6'
  if (['follow'].includes(type))                      return '#22c55e'
  if (['message'].includes(type))                     return '#a855f7'
  if (['application_accepted', 'request_accepted'].includes(type)) return '#22c55e'
  if (['application_rejected', 'request_rejected'].includes(type)) return '#ef4444'
  if (['job_invitation', 'application_received', 'job_invite'].includes(type)) return '#f97316'
  if (['transfer_received'].includes(type))           return '#22c55e'
  if (['money_request'].includes(type))               return '#f59e0b'
  if (['hire_request'].includes(type))                return 'var(--primary)'
  return '#a855f7'
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const diff = (Date.now() - d) / 1000
  if (diff < 60)     return 'Just now'
  if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function handleClick(notif) {
  store.handleNotificationClick(notif, router)
}

function onScroll() {
  if (!listEl.value) return
  const { scrollTop, scrollHeight, clientHeight } = listEl.value
  if (scrollHeight - scrollTop - clientHeight < 100 && store.hasMore && !store.loading) {
    store.fetchNotifications()
  }
}

// Mark all visible as read when panel opens
onMounted(async () => {
  await store.fetchNotifications(true)
  store.onPanelOpen()
})

watch(activeTab, () => {
  if (activeTab.value !== 'unread') store.onPanelOpen()
})
</script>

<style scoped>
.notif-view {
  max-width: 680px;
  margin: 0 auto;
  padding: 1rem 1rem 5rem;
  min-height: 100vh;
}

/* Header */
.notif-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 0.5rem 0 1rem;
}
.notif-title-row { display: flex; align-items: center; gap: 0.5rem; }
.notif-title {
  font-family: var(--font-headline);
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--on-surface);
}
.unread-badge {
  min-width: 22px; height: 22px;
  border-radius: 11px;
  background: var(--primary);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  padding: 0 5px;
}
.notif-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.action-btn {
  display: flex; align-items: center; gap: 0.3rem;
  padding: 0.4rem 0.875rem;
  border-radius: var(--radius-full);
  font-size: 0.78rem;
  font-weight: 600;
}
.action-btn .material-symbols-outlined { font-size: 16px; }
.danger-btn { color: #ef4444; }
.danger-btn:hover { background: rgba(239,68,68,0.08); }

/* Tabs */
.notif-tabs {
  display: flex;
  gap: 0.25rem;
  overflow-x: auto;
  scrollbar-width: none;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--outline-variant);
  margin-bottom: 0.75rem;
}
.notif-tabs::-webkit-scrollbar { display: none; }
.notif-tab {
  display: flex; align-items: center; gap: 0.3rem;
  padding: 0.45rem 1rem;
  border-radius: var(--radius-full);
  border: 1px solid transparent;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--on-surface-variant);
  background: none;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
}
.notif-tab:hover { background: var(--surface-container-low); }
.notif-tab.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}
.tab-badge {
  min-width: 16px; height: 16px;
  border-radius: 8px;
  background: #fff;
  color: var(--primary);
  font-size: 0.62rem;
  font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  padding: 0 3px;
}

/* List */
.notif-list { display: flex; flex-direction: column; gap: 0.4rem; }

/* Item */
.notif-item {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-xl);
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  position: relative;
}
.notif-item:hover { background: var(--surface-container-low); border-color: var(--primary); }
.notif-item.unread {
  background: color-mix(in srgb, var(--primary) 5%, var(--surface-container-lowest));
  border-color: color-mix(in srgb, var(--primary) 20%, var(--outline-variant));
}

.notif-icon-wrap {
  width: 42px; height: 42px;
  border-radius: var(--radius-lg);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.notif-icon { font-size: 20px; }

.notif-body { flex: 1; min-width: 0; }
.notif-title-text {
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--on-surface);
  line-height: 1.4;
  margin: 0;
}
.notif-desc {
  font-size: 0.8rem;
  color: var(--on-surface-variant);
  margin: 0.2rem 0 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.notif-time {
  font-size: 0.72rem;
  color: var(--on-surface-variant);
  margin-top: 0.3rem;
}

.unread-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--primary);
  flex-shrink: 0;
  margin-top: 0.35rem;
}

.notif-del-btn {
  width: 28px; height: 28px;
  border-radius: 50%;
  background: none;
  border: none;
  color: var(--on-surface-variant);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.15s, background 0.15s;
}
.notif-del-btn .material-symbols-outlined { font-size: 16px; }
.notif-item:hover .notif-del-btn { opacity: 1; }
.notif-del-btn:hover { background: var(--surface-container); }

/* Skeleton */
.notif-skeleton {
  display: flex; align-items: center; gap: 0.875rem;
  padding: 0.875rem 1rem;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-xl);
}
.skeleton-icon {
  width: 42px; height: 42px; border-radius: var(--radius-lg); flex-shrink: 0;
}
.skeleton-lines { flex: 1; display: flex; flex-direction: column; gap: 0; }
.shimmer {
  background: linear-gradient(90deg,
    var(--surface-container) 25%,
    var(--surface-container-high) 50%,
    var(--surface-container) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

/* Load more */
.load-more {
  text-align: center;
  padding: 0.875rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--primary);
  cursor: pointer;
  border-radius: var(--radius-xl);
  background: var(--surface-container-low);
}
.load-more:hover { background: var(--surface-container); }

/* Empty */
.notif-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 4rem 1rem;
  text-align: center;
  color: var(--on-surface-variant);
}
.notif-empty .material-symbols-outlined { font-size: 3.5rem; }
.notif-empty h3 {
  font-family: var(--font-headline);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--on-surface);
  margin: 0;
}
.notif-empty p { font-size: 0.875rem; margin: 0; }

/* List animation */
.notif-list-anim-enter-active { transition: all 0.25s ease; }
.notif-list-anim-leave-active { transition: all 0.2s ease; }
.notif-list-anim-enter-from { opacity: 0; transform: translateX(-12px); }
.notif-list-anim-leave-to { opacity: 0; transform: translateX(12px); }

@media (max-width: 640px) {
  .notif-view { padding: 0.75rem 0.75rem 5rem; }
  .notif-header { flex-direction: column; align-items: flex-start; }
}
</style>
