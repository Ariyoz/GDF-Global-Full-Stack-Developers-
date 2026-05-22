// ── Hire Service — Real Backend ──
import http from './http'
import { API_ENDPOINTS } from '@/config/api'

const { hire } = API_ENDPOINTS

export const hireService = {
  async sendHireRequest(developerId, data) {
    return http.post(hire.send(developerId), {
      project_title: data.projectTitle || data.title || 'New Project',
      description: data.description || '',
      budget: data.budget || '',
      duration: data.duration || '',
      skills_needed: data.skills || [],
    })
  },
}
