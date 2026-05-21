// ── Client Requests Service ──
import http from './http'
import { API_ENDPOINTS } from '@/config/api'

const { requests } = API_ENDPOINTS

export const requestsService = {
  async submit(data) {
    return http.post(requests.submit, data)
  },

  async getAll(params = {}) {
    return http.get(requests.list, { params })
  },

  async getById(id) {
    return http.get(requests.byId(id))
  },

  async update(id, data) {
    return http.patch(requests.update(id), data)
  },
}
