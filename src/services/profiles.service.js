// ── Profiles Service — Real Backend ──
import http from './http'
import { API_ENDPOINTS } from '@/config/api'

const { users, explore } = API_ENDPOINTS

export const profilesService = {
  async getById(userId) {
    try {
      return await http.get(users.byId(userId))
    } catch {
      return null
    }
  },

  async getByUsername(username) {
    try {
      const data = await http.get(`${explore.search}?q=${username}&limit=1`)
      return data.results?.[0] || null
    } catch {
      return null
    }
  },

  async update(userId, updates) {
    return http.patch(users.me, updates)
  },

  async listDevelopers({ page = 1, limit = 20, skills, search, location, experience_level } = {}) {
    let url = `${explore.developers}?page=${page}&limit=${limit}`
    if (search) url += `&search=${search}`
    if (skills && skills.length) url += `&skills=${skills.join(',')}`
    if (location) url += `&location=${location}`
    if (experience_level) url += `&experience_level=${experience_level}`

    const data = await http.get(url)
    return { data: data.developers || [], count: data.total || 0 }
  },

  async listAll({ page = 1, limit = 20, search, role, status } = {}) {
    try {
      const data = await http.get(`/admin/users?page=${page}&limit=${limit}${search ? '&search=' + search : ''}${role ? '&role=' + role : ''}`)
      return { data: data.users || [], count: data.total || data.users?.length || 0 }
    } catch {
      return { data: [], count: 0 }
    }
  },

  async uploadAvatar(userId, file) {
    const formData = new FormData()
    formData.append('file', file)
    const data = await http.post('/uploads/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.url
  },

  async follow(userId) {
    return http.post(users.follow(userId))
  },

  async unfollow(userId) {
    return http.delete(users.follow(userId))
  },

  async getFollowers(userId) {
    return http.get(users.followers(userId))
  },

  async getFollowing(userId) {
    return http.get(users.following(userId))
  },
}
