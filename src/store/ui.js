// ── UI Store ──
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const mobileMenuOpen  = ref(false)
  const pageLoading     = ref(false)
  const toasts          = ref([])
  let toastId = 0

  function toggleMobileMenu() {
    mobileMenuOpen.value = !mobileMenuOpen.value
  }

  function closeMobileMenu() {
    mobileMenuOpen.value = false
  }

  function setPageLoading(val) {
    pageLoading.value = val
  }

  function addToast({ message, type = 'info', duration = 4000 }) {
    const id = ++toastId
    toasts.value.push({ id, message, type })
    setTimeout(() => removeToast(id), duration)
  }

  function removeToast(id) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function showSuccess(message) { addToast({ message, type: 'success' }) }
  function showError(message)   { addToast({ message, type: 'error' }) }
  function showInfo(message)    { addToast({ message, type: 'info' }) }

  return {
    mobileMenuOpen, pageLoading, toasts,
    toggleMobileMenu, closeMobileMenu, setPageLoading,
    addToast, removeToast, showSuccess, showError, showInfo,
  }
})
