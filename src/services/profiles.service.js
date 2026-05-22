// ── Profiles Service — Real Backend ──
import http from './http'
import { API_ENDPOINTS } from '@/config/api'

const { users } = API_ENDPOINTS

export const profilesService = {
  async getById(userId) {
    try {
      return await http.get(users.byId(userId))
    } catch {
      return null
    }
  },

  async getByUsername(username) {
    // Search by username not directly supported yet, use ID
    return null
  },

  async update(userId, updates) {
    return http.patch(users.me, updates)
  },

  async listDevelopers({ page = 1, limit = 20, skills, search } = {}) {
    // TODO: implement developer listing endpoint
    return { data: [], count: 0 }
  },

  async listAll({ page = 1, limit = 20, search, role, status } = {}) {
    // Use admin endpoint
    try {
      const data = await http.get(`/admin/users?page=${page}&limit=${limit}`)
      return { data: data.users || [], count: data.users?.length || 0 }
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
}
