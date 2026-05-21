import http from './http'
import { API_ENDPOINTS } from '@/config/api'

export const projectsService = {
  async getAll(params = {}) {
    return http.get(API_ENDPOINTS.projects.list, { params })
  },
  async getById(id) {
    return http.get(API_ENDPOINTS.projects.byId(id))
  },
  async getBySlug(slug) {
    return http.get(API_ENDPOINTS.projects.bySlug(slug))
  },
}
