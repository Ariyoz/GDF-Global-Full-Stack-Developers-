<template>
  <Teleport to="body">
    <div class="toast-container" aria-live="polite" aria-atomic="false">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast-item"
          :class="`toast-${toast.type}`"
          role="alert"
        >
          <span class="material-symbols-outlined toast-icon">{{ icons[toast.type] }}</span>
          <span class="toast-message">{{ toast.message }}</span>
          <button class="toast-close" @click="removeToast(toast.id)" aria-label="Dismiss">
            <span class="material-symbols-outlined" style="font-size:16px;">close</span>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useUiStore } from '@/store/ui'

const uiStore = useUiStore()
const { toasts } = storeToRefs(uiStore)
const { removeToast } = uiStore

const icons = {
  success: 'check_circle',
  error:   'error',
  info:    'info',
  warning: 'warning',
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 360px;
  width: calc(100vw - 3rem);
}

.toast-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: var(--radius-xl);
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  box-shadow: var(--shadow-md);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--on-surface);
}

.toast-success { border-color: rgba(22,163,74,0.4); }
.toast-error   { border-color: rgba(186,26,26,0.4); }
.toast-info    { border-color: rgba(99,14,212,0.3); }
.toast-warning { border-color: rgba(161,81,0,0.3); }

.toast-icon { font-size: 20px; flex-shrink: 0; }
.toast-success .toast-icon { color: #16a34a; }
.toast-error   .toast-icon { color: var(--error); }
.toast-info    .toast-icon { color: var(--primary); }
.toast-warning .toast-icon { color: var(--tertiary); }

.toast-message { flex: 1; line-height: 1.4; }

.toast-close {
  background: none;
  border: none;
  color: var(--outline);
  cursor: pointer;
  padding: 0.1rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  transition: var(--transition-fast);
}
.toast-close:hover { color: var(--on-surface); }

.toast-enter-active { transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); }
.toast-leave-active { transition: all 0.2s ease; }
.toast-enter-from   { opacity: 0; transform: translateX(100%); }
.toast-leave-to     { opacity: 0; transform: translateX(100%); }
</style>
