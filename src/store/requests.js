// ── Client Requests Store ──
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { requestsService } from '@/services/requests.service'

export const useRequestsStore = defineStore('requests', () => {
  const requests = ref([])
  const current  = ref(null)
  const loading  = ref(false)
  const error    = ref(null)

  async function submitRequest(data) {
    loading.value = true
    error.value   = null
    try {
      const res = await requestsService.submit(data)
      return res
    } catch (err) {
      error.value = err.response?.data?.message || 'Submission failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchRequests(params) {
    loading.value = true
    try {
      const res = await requestsService.getAll(params)
      requests.value = res.data || res
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load requests'
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id) {
    loading.value = true
    try {
      const res = await requestsService.getById(id)
      current.value = res
    } finally {
      loading.value = false
    }
  }

  return { requests, current, loading, error, submitRequest, fetchRequests, fetchById }
})
