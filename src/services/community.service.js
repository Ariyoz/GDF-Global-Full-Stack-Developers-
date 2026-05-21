// ── Community Service ──
import http from './http'
import { API_ENDPOINTS } from '@/config/api'

const { community } = API_ENDPOINTS

export const communityService = {
  async getMembers(params = {}) {
    return http.get(community.members, { params })
  },

  async getJobs(params = {}) {
    return http.get(community.jobs, { params })
  },

  async getProjects(params = {}) {
    return http.get(community.projects, { params })
  },

  async join(data) {
    return http.post(community.join, data)
  },
}
