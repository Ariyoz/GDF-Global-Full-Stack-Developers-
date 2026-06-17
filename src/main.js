import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App    from './App.vue'
import router from './router'

// ── Global Styles ──
import './styles/main.css'

// ── Bootstrap JS ──
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// ── Apply saved theme BEFORE mount to prevent flash ──
;(function () {
  const stored = localStorage.getItem('gfd_theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  if (stored === 'dark' || (!stored && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark')
  }
})()

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

// ── v-click-outside directive (used in Messaging and Jobs views) ──
app.directive('click-outside', {
  mounted(el, binding) {
    el._clickOutsideHandler = (event) => {
      if (!el.contains(event.target)) binding.value(event)
    }
    document.addEventListener('click', el._clickOutsideHandler, true)
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutsideHandler, true)
  },
})

app.mount('#app')

// ── Initialize auth (non-blocking) then pre-warm notification count ──
import { useAuthStore } from './store/auth'
import { useNotificationsStore } from './store/notifications'

const authStore = useAuthStore()

authStore.init().then(() => {
  if (authStore.isAuthenticated) {
    const notifsStore = useNotificationsStore()
    notifsStore.fetchUnreadCount()
  }
}).catch(() => {
  // init() may not return a promise in all versions — call it silently
})

// Fallback: if init doesn't return a promise, still call it
if (!authStore.initialized) {
  // authStore.init() was already called above; just guard against non-promise version
}
