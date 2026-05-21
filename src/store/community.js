import { defineStore } from 'pinia'
import { ref } from 'vue'
import { communityService } from '@/services/community.service'

export const useCommunityStore = defineStore('community', () => {
  const members = ref([])
  const jobs    = ref([])
  const loading = ref(false)
  const error   = ref(null)

  async function fetchMembers(params = {}) {
    loading.value = true
    try {
      const res = await communityService.getMembers(params)
      members.value = res.data || res
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function fetchJobs(params = {}) {
    loading.value = true
    try {
      const res = await communityService.getJobs(params)
      jobs.value = res.data || res
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return { members, jobs, loading, error, fetchMembers, fetchJobs }
})
