// ── useTheme — manages light/dark mode ──
import { ref, watch, onMounted } from 'vue'

const STORAGE_KEY = 'gfd_theme'
const isDark = ref(false)

function applyTheme(dark) {
  if (dark) {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
}

export function useTheme() {
  function init() {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      isDark.value = stored === 'dark'
    } else {
      // Respect OS preference on first visit
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    applyTheme(isDark.value)
  }

  function toggle() {
    isDark.value = !isDark.value
    localStorage.setItem(STORAGE_KEY, isDark.value ? 'dark' : 'light')
    applyTheme(isDark.value)
  }

  function setDark(value) {
    isDark.value = value
    localStorage.setItem(STORAGE_KEY, value ? 'dark' : 'light')
    applyTheme(value)
  }

  onMounted(init)

  return { isDark, toggle, setDark, init }
}
