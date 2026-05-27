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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { websocketService } from '@/services/websocket.service'

const router = useRouter()
const incomingAlert = ref(null)
const alertQueue = ref([])
let alertTimeout = null

onMounted(() => {
  websocketService.onEvent((event) => {
    // Incoming message
    if (event.type === 'message_sent' && event.from) {
      queueAlert({
        type: 'message',
        icon: 'chat',
        name: event.from_name || 'New Message',
        avatar: event.from_avatar || '',
        title: event.from_name || 'New Message',
        body: event.content?.slice(0, 60) || 'Sent you a message',
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
      queueAlert({
        type: 'like',
        icon: 'favorite',
        name: event.actor_name || 'Someone',
        avatar: event.actor_avatar || '',
        title: event.actor_name || 'Someone',
        body: 'liked your post',
        route: '/feed',
      })
    }

    // Comment on post
    if (event.type === 'post_commented') {
      queueAlert({
        type: 'comment',
        icon: 'chat_bubble',
        name: event.actor_name || 'Someone',
        avatar: event.actor_avatar || '',
        title: event.actor_name || 'Someone',
        body: 'commented on your post',
        route: '/feed',
      })
    }

    // Repost
    if (event.type === 'post_reposted') {
      queueAlert({
        type: 'repost',
        icon: 'repeat',
        name: event.actor_name || 'Someone',
        avatar: event.actor_avatar || '',
        title: event.actor_name || 'Someone',
        body: 'reposted your post',
        route: '/feed',
      })
    }

    // New follower
    if (event.type === 'new_follower' || event.type === 'user_followed') {
      queueAlert({
        type: 'follow',
        icon: 'person_add',
        name: event.actor_name || 'Someone',
        avatar: event.actor_avatar || '',
        title: event.actor_name || 'Someone',
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
  width: calc(100% - 3rem);
  max-width: 320px;
}

.global-alert-inner {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.7rem 0.875rem;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-xl);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

[data-theme="dark"] .global-alert-inner {
  background: #1a1a2e;
  border-color: rgba(168, 85, 247, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.alert-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--primary-fixed);
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
  border-radius: 50%;
}

.alert-icon {
  font-size: 22px;
  color: var(--primary);
}

.alert-type-like .alert-icon { color: #e91e63; }
.alert-type-like { background: rgba(233, 30, 99, 0.1); }
.alert-type-comment .alert-icon { color: #2196f3; }
.alert-type-comment { background: rgba(33, 150, 243, 0.1); }
.alert-type-repost .alert-icon { color: #00c853; }
.alert-type-repost { background: rgba(0, 200, 83, 0.1); }
.alert-type-follow .alert-icon { color: var(--primary); }
.alert-type-follow { background: rgba(168, 85, 247, 0.1); }
.alert-type-message .alert-icon { color: var(--primary); }
.alert-type-call { background: rgba(34, 197, 94, 0.1); }
.alert-type-call .alert-icon { color: #22c55e; }

.alert-content {
  flex: 1;
  min-width: 0;
}

.alert-title {
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--on-surface);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.alert-body {
  font-size: 0.8rem;
  color: var(--on-surface-variant);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 0.1rem;
}

.alert-accept {
  width: 40px;
  height: 40px;
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

.alert-accept .material-symbols-outlined { font-size: 20px; }

.alert-dismiss {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--surface-container);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--on-surface-variant);
  cursor: pointer;
  flex-shrink: 0;
}

.alert-dismiss .material-symbols-outlined { font-size: 16px; }
</style>
