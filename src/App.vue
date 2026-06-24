<template>
  <RouterView v-slot="{ Component }">
    <Transition name="page" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>

  <!-- Global incoming notification popup -->
  <Transition name="page">
    <div v-if="incomingAlert" class="global-alert" @click="handleAlertClick">
      <div class="global-alert-inner">
        <div class="alert-avatar" :class="`alert-type-${incomingAlert.type}`">
          <img v-if="incomingAlert.avatar" :src="incomingAlert.avatar" alt="" class="alert-avatar-img" />
          <span v-else class="material-symbols-outlined alert-icon">{{ incomingAlert.icon || 'notifications' }}</span>
        </div>
        <div class="alert-content">
          <p class="alert-title">{{ incomingAlert.title }}</p>
          <p class="alert-body">{{ incomingAlert.body }}</p>
        </div>
        <button v-if="incomingAlert.type === 'call'" class="alert-accept" @click.stop="acceptAlert">
          <span class="material-symbols-outlined">call</span>
        </button>
        <button class="alert-dismiss" @click.stop="dismissAlert">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { websocketService } from '@/services/websocket.service'

const router = useRouter()
const incomingAlert = ref(null)
const alertQueue = ref([])
let alertTimeout = null
let keepAliveTimer = null

// ── Keep-alive ping: hits /health every 13 min to prevent Render cold starts ──
// Render free tier sleeps after 15 min of inactivity — we ping every 13 to stay awake
function startKeepAlive() {
  const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'https://gfd-backend.onrender.com/api/v1')
    .replace('/api/v1', '')

  const ping = () => {
    fetch(`${baseUrl}/health`, { method: 'GET', cache: 'no-cache' }).catch(() => {})
  }

  // Ping immediately, then again at 5s (double-hit to ensure server starts fast)
  ping()
  setTimeout(ping, 5000)
  // Then every 13 minutes to prevent sleep
  keepAliveTimer = setInterval(ping, 13 * 60 * 1000)
}

function stopKeepAlive() {
  if (keepAliveTimer) { clearInterval(keepAliveTimer); keepAliveTimer = null }
}

onUnmounted(stopKeepAlive)

onMounted(() => {
  startKeepAlive()

  websocketService.onEvent((event) => {
    // Incoming message
    if (event.type === 'message_sent') {
      const name = event.from_name || event.data?.from_name || 'New Message'
      const avatar = event.from_avatar || event.data?.from_avatar || ''
      const content = event.content || event.data?.content || 'Sent you a message'
      queueAlert({
        type: 'message',
        icon: 'chat',
        name: name,
        avatar: avatar,
        title: name,
        body: content.slice(0, 60),
        route: '/messaging',
      })
    }

    // Incoming call
    if (event.type === 'incoming_call') {
      queueAlert({
        type: 'call',
        icon: 'call',
        name: event.caller_name || 'Incoming Call',
        avatar: event.caller_avatar || '',
        title: event.caller_name || 'Incoming Call',
        body: event.call_type === 'video' ? '📹 Video call...' : '📞 Voice call...',
        route: '/messaging',
        duration: 30000,
      })
    }

    // Like on post
    if (event.type === 'post_liked') {
      const name = event.data?.liker_name || event.liker_name || event.actor_name || 'Someone'
      queueAlert({
        type: 'like',
        icon: 'favorite',
        name: name,
        avatar: event.data?.liker_avatar || event.actor_avatar || '',
        title: name,
        body: 'liked your post',
        route: '/feed',
      })
    }

    // Comment on post
    if (event.type === 'post_commented') {
      const name = event.data?.commenter_name || event.commenter_name || event.actor_name || 'Someone'
      queueAlert({
        type: 'comment',
        icon: 'chat_bubble',
        name: name,
        avatar: event.data?.commenter_avatar || event.actor_avatar || '',
        title: name,
        body: 'commented on your post',
        route: '/feed',
      })
    }

    // Repost
    if (event.type === 'post_reposted') {
      const name = event.data?.reposter_name || event.actor_name || 'Someone'
      queueAlert({
        type: 'repost',
        icon: 'repeat',
        name: name,
        avatar: event.data?.reposter_avatar || event.actor_avatar || '',
        title: name,
        body: 'reposted your post',
        route: '/feed',
      })
    }

    // Bookmark
    if (event.type === 'post_bookmarked') {
      const name = event.data?.bookmarker_name || event.actor_name || 'Someone'
      queueAlert({
        type: 'bookmark',
        icon: 'bookmark',
        name: name,
        avatar: event.data?.bookmarker_avatar || event.actor_avatar || '',
        title: name,
        body: 'bookmarked your post',
        route: '/feed',
      })
    }

    // New follower
    if (event.type === 'new_follower' || event.type === 'user_followed') {
      const name = event.data?.follower_name || event.actor_name || 'Someone'
      queueAlert({
        type: 'follow',
        icon: 'person_add',
        name: name,
        avatar: event.data?.follower_avatar || event.actor_avatar || '',
        title: name,
        body: 'started following you',
        route: '/notifications',
      })
    }

    // Generic notification (catch-all from backend)
    if (event.type === 'notification') {
      queueAlert({
        type: 'notification',
        icon: 'notifications',
        name: event.title || 'Notification',
        avatar: event.actor_avatar || '',
        title: event.title || 'Notification',
        body: event.body || event.message || '',
        route: '/notifications',
      })
    }
  })
})

function queueAlert(data) {
  if (incomingAlert.value) {
    // Queue it if one is already showing
    alertQueue.value.push(data)
  } else {
    showAlert(data)
  }
}

function showAlert(data) {
  incomingAlert.value = data
  if (alertTimeout) clearTimeout(alertTimeout)
  const duration = data.duration || 4000
  alertTimeout = setTimeout(() => {
    incomingAlert.value = null
    // Show next in queue
    if (alertQueue.value.length > 0) {
      const next = alertQueue.value.shift()
      setTimeout(() => showAlert(next), 300)
    }
  }, duration)
}

function handleAlertClick() {
  const route = incomingAlert.value?.route || '/notifications'
  incomingAlert.value = null
  router.push(route)
}

function acceptAlert() {
  router.push('/messaging')
  incomingAlert.value = null
}

function dismissAlert() {
  incomingAlert.value = null
  // Show next in queue
  if (alertQueue.value.length > 0) {
    const next = alertQueue.value.shift()
    setTimeout(() => showAlert(next), 300)
  }
}
</script>

<style>
/* Page transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Glassmorphism enhancement for glass cards */
.glass-card,
.glass-modal {
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
}

[data-theme="dark"] .glass-card,
[data-theme="dark"] .glass-modal {
  background: #1a1a2e;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* Modal styling */
.modal-overlay .edit-modal,
.modal-overlay .compose-modal,
.modal-overlay .glass-modal {
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.25);
}

[data-theme="dark"] .modal-overlay .edit-modal,
[data-theme="dark"] .modal-overlay .compose-modal,
[data-theme="dark"] .modal-overlay .glass-modal {
  background: #1a1a2e;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
}

/* ── Global Alert (incoming message/call) ── */
.global-alert {
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  width: calc(100% - 2rem);
  max-width: 360px;
}

.global-alert-inner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
  cursor: pointer;
}

[data-theme="dark"] .global-alert-inner {
  background: #1e1e2e;
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.alert-avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--surface-container);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.alert-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.alert-icon {
  font-size: 20px;
  color: var(--on-surface-variant);
}

.alert-type-like .alert-icon { color: #e91e63; }
.alert-type-like { background: rgba(233, 30, 99, 0.08); }
.alert-type-comment .alert-icon { color: #2196f3; }
.alert-type-comment { background: rgba(33, 150, 243, 0.08); }
.alert-type-repost .alert-icon { color: #00c853; }
.alert-type-repost { background: rgba(0, 200, 83, 0.08); }
.alert-type-follow .alert-icon { color: var(--primary); }
.alert-type-follow { background: rgba(168, 85, 247, 0.08); }
.alert-type-message .alert-icon { color: var(--primary); }
.alert-type-message { background: rgba(168, 85, 247, 0.08); }
.alert-type-bookmark .alert-icon { color: #3b82f6; }
.alert-type-bookmark { background: rgba(59, 130, 246, 0.08); }
.alert-type-call { background: rgba(34, 197, 94, 0.08); }
.alert-type-call .alert-icon { color: #22c55e; }

.alert-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.alert-title {
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--on-surface);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
  margin: 0;
}

.alert-body {
  font-size: 0.8rem;
  font-weight: 400;
  color: var(--on-surface-variant);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
  margin: 0;
}

.alert-accept {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #22c55e;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  flex-shrink: 0;
}

.alert-accept .material-symbols-outlined { font-size: 18px; }

.alert-dismiss {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--on-surface-variant);
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s;
}

.alert-dismiss:hover {
  background: var(--surface-container);
}

.alert-dismiss .material-symbols-outlined { font-size: 18px; }
</style>
