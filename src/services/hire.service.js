// ── Hire Service — Real Backend ──
import http from './http'
import { API_ENDPOINTS } from '@/config/api'

const { hire } = API_ENDPOINTS

export const hireService = {
  async sendHireRequest(developerId, data) {
    return http.post(hire.send(developerId), {
      project_title:  data.projectTitle  || 'New Project',
      project_type:   data.projectType   || '',
      description:    data.description   || '',
      budget:         data.budget        || '',
      duration:       data.duration      || '',
      skills_needed:  data.skills        || [],
      client_name:    data.clientName    || '',
      client_email:   data.clientEmail   || '',
      company:        data.company       || '',
    })
  },

  async getSentRequests() {
    const data = await http.get(hire.sentRequests)
    return data.requests || []
  },

  async getReceivedRequests() {
    const data = await http.get(hire.receivedRequests)
    return data.requests || []
  },
}
