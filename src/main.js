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
app.mount('#app')

// Initialize auth state after mount (non-blocking)
import { useAuthStore } from './store/auth'
const authStore = useAuthStore()
authStore.init()
