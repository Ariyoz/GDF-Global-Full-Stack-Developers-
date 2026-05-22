// ── Jobs Service — Real Backend ──
import http from './http'
import { API_ENDPOINTS } from '@/config/api'

const { projects } = API_ENDPOINTS

export const jobsService = {
  async list({ page = 1, limit = 20, status, search, skills } = {}) {
    let url = `${projects.list}?page=${page}&limit=${limit}`
    if (status) url += `&status_filter=${status}`
    if (search) url += `&search=${search}`
    const data = await http.get(url)
    return { data: data.projects || [], count: data.projects?.length || 0 }
  },

  async getById(jobId) {
    return http.get(projects.byId(jobId))
  },

  async create(jobData) {
    return http.post(projects.create, jobData)
  },

  async update(jobId, updates) {
    return http.patch(projects.byId(jobId), updates)
  },

  async delete(jobId) {
    return http.delete(projects.byId(jobId))
  },

  async apply(jobId, developerId, coverLetter) {
    return http.post(projects.apply(jobId), { cover_letter: coverLetter })
  },

  async getApplications(jobId) {
    const data = await http.get(projects.applications(jobId))
    return data || []
  },

  async getMyApplications() {
    return []
  },

  async saveJob() {},
  async unsaveJob() {},
  async getSavedJobs() { return [] },
}
