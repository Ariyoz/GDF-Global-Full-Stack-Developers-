// ── Developers Store — Supabase ──
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { profilesService } from '@/services/profiles.service'

export const useDevelopersStore = defineStore('developers', () => {
  const all = ref([])
  const loading = ref(false)
  const error = ref(null)
  const total = ref(0)

  async function fetchDevelopers({ page = 1, limit = 20, search, skills } = {}) {
    loading.value = true
    error.value = null
    try {
      const { data, count } = await profilesService.listDevelopers({ page, limit, search, skills })
      all.value = data || []
      total.value = count || 0
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  function getById(id) {
    return all.value.find(d => d.id === id) || null
  }

  return { all, loading, error, total, fetchDevelopers, getById }
})
