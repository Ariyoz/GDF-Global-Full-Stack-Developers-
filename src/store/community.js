// ── Community Store — Real Backend ──
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { profilesService } from '@/services/profiles.service'
import { jobsService } from '@/services/jobs.service'

export const useCommunityStore = defineStore('community', () => {
  const members = ref([])
  const jobs = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchMembers(params = {}) {
    loading.value = true
    error.value = null
    try {
      const { data } = await profilesService.listDevelopers(params)
      members.value = data || []
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function fetchJobs() {
    loading.value = true
    try {
      const { data } = await jobsService.list({ limit: 10 })
      jobs.value = data || []
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return { members, jobs, loading, error, fetchMembers, fetchJobs }
})
