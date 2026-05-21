// ── useIntersectionObserver ──
// Triggers animations when elements enter the viewport
import { ref, onMounted, onUnmounted } from 'vue'

export function useIntersectionObserver(options = {}) {
  const isVisible = ref(false)
  const target    = ref(null)

  const defaultOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px',
    ...options,
  }

  let observer = null

  onMounted(() => {
    if (!target.value) return
    observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true
        observer?.disconnect()
      }
    }, defaultOptions)
    observer.observe(target.value)
  })

  onUnmounted(() => observer?.disconnect())

  return { isVisible, target }
}
