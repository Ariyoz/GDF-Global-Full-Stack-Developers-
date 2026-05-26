<template>
  <RouterView v-slot="{ Component }">
    <Transition name="page" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>

  <!-- Global incoming message/call alert -->
  <Transition name="page">
    <div v-if="incomingAlert" class="global-alert" @click="handleAlertClick">
      <div class="global-alert-inner">
        <div class="alert-avatar">
          <img v-if="incomingAlert.avatar" :src="incomingAlert.avatar" alt="" class="alert-avatar-img" />
          <span v-else class="alert-initials">{{ (incomingAlert.name || 'U')[0] }}</span>
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
let alertTimeout = null

onMounted(() => {
  websocketService.onEvent((event) => {
    // Incoming message notification
    if (event.type === 'message_sent' && event.from) {
      showAlert({
        type: 'message',
        name: event.from_name || 'New Message',
        avatar: event.from_avatar || '',
        title: event.from_name || 'New Message',
        body: event.content?.slice(0, 60) || 'Sent you a message',
      })
    }

    // Incoming call notification
    if (event.type === 'incoming_call') {
      showAlert({
        type: 'call',
        name: event.caller_name || 'Incoming Call',
        avatar: event.caller_avatar || '',
        title: event.caller_name || 'Incoming Call',
        body: event.call_type === 'video' ? '📹 Video call...' : '📞 Voice call...',
      })
    }
  })
})

function showAlert(data) {
  incomingAlert.value = data
  if (alertTimeout) clearTimeout(alertTimeout)
  alertTimeout = setTimeout(() => {
    incomingAlert.value = null
  }, data.type === 'call' ? 30000 : 5000)
}

function handleAlertClick() {
  router.push('/messaging')
  incomingAlert.value = null
}

function acceptAlert() {
  router.push('/messaging')
  incomingAlert.value = null
}

function dismissAlert() {
  incomingAlert.value = null
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
  max-width: 400px;
}

.global-alert-inner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
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
  width: 44px;
  height: 44px;
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

.alert-initials {
  font-family: var(--font-headline);
  font-size: 1rem;
  font-weight: 700;
  color: var(--primary);
}

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
