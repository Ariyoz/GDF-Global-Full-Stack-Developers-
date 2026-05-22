// ── Service Requests Store — Supabase ──
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export const useRequestsStore = defineStore('requests', () => {
  const requests = ref([])
  const current = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function submitRequest(data) {
    loading.value = true
    error.value = null
    try {
      const { data: result, error: err } = await supabase
        .from('service_requests')
        .insert(data)
        .select()
        .single()
      if (err) throw err
      return result
    } catch (err) {
      error.value = err.message || 'Submission failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchRequests(userId) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase
        .from('service_requests')
        .select('*')
        .eq('client_id', userId)
        .order('created_at', { ascending: false })
      if (err) throw err
      requests.value = data || []
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id) {
    loading.value = true
    try {
      const { data, error: err } = await supabase
        .from('service_requests')
        .select('*')
        .eq('id', id)
        .single()
      if (err) throw err
      current.value = data
    } finally {
      loading.value = false
    }
  }

  return { requests, current, loading, error, submitRequest, fetchRequests, fetchById }
})
