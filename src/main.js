import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App    from './App.vue'
import router from './router'

// ── Global Styles ──
import './styles/main.css'

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

// ── Initialize auth synchronously from localStorage (no network) ──
// then defer non-critical work to after first frame
import { useAuthStore } from './store/auth'
import { useNotificationsStore } from './store/notifications'

const authStore = useAuthStore()

// init() reads localStorage — fast and synchronous in effect
const initResult = authStore.init()

const afterInit = () => {
  if (authStore.isAuthenticated) {
    // Defer notification count — not needed for initial render
    const schedule = window.requestIdleCallback || ((fn) => setTimeout(fn, 200))
    schedule(() => {
      const notifsStore = useNotificationsStore()
      notifsStore.fetchUnreadCount()
    })
  }
}

if (initResult && typeof initResult.then === 'function') {
  initResult.then(afterInit).catch(() => {})
} else {
  setTimeout(afterInit, 0)
}
