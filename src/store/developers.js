// ── Developers Store — Real Backend ──
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { profilesService } from '@/services/profiles.service'

export const useDevelopersStore = defineStore('developers', () => {
  const all = ref([])
  const loading = ref(false)
  const error = ref(null)
  const total = ref(0)

  async function fetchDevelopers({ page = 1, limit = 20, search, skills, location, experience_level } = {}) {
    loading.value = true
    error.value = null
    try {
      const { data, count } = await profilesService.listDevelopers({ page, limit, search, skills, location, experience_level })
      // Map backend fields to what the explore template expects
      all.value = (data || []).map(d => ({
        id: d.id,
        name: d.full_name || d.username || 'Developer',
        username: d.username,
        avatar: d.avatar,
        role: d.experience_level || 'Developer',
        type: d.experience_level || 'Full Stack',
        skills: d.skills || [],
        bio: d.bio || '',
        location: d.location || '',
        available: d.available_for_hire !== false,
        rating: '5.0',
        projects: 0,
        hourly_rate: d.hourly_rate,
        github_url: d.github_url,
        follower_count: d.follower_count || 0,
      }))
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
