// ── Service Requests Store — Demo ──
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRequestsStore = defineStore('requests', () => {
  const requests = ref([])
  const current = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function submitRequest(data) {
    loading.value = true
    error.value = null
    try {
      const result = { id: 'req-' + Date.now(), ...data, status: 'pending', created_at: new Date().toISOString() }
      requests.value.unshift(result)
      return result
    } catch (err) {
      error.value = err.message || 'Submission failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchRequests() {
    loading.value = true
    error.value = null
    try {
      // Demo — return stored requests
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id) {
    loading.value = true
    try {
      current.value = requests.value.find(r => r.id === id) || null
    } finally {
      loading.value = false
    }
  }

  return { requests, current, loading, error, submitRequest, fetchRequests, fetchById }
})
