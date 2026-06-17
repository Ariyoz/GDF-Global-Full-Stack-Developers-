// ── Jobs Service — upgraded with invitations, hiring chat, and my-applications ──
import http from './http'
import { API_ENDPOINTS } from '@/config/api'

const { jobs } = API_ENDPOINTS

export const jobsService = {
  async list({ page = 1, limit = 20, jobType, experienceLevel, isRemote, search } = {}) {
    let url = `${jobs.list}?page=${page}&limit=${limit}`
    if (jobType)        url += `&job_type=${jobType}`
    if (experienceLevel) url += `&experience_level=${experienceLevel}`
    if (isRemote !== undefined) url += `&is_remote=${isRemote}`
    if (search)         url += `&search=${encodeURIComponent(search)}`
    const data = await http.get(url)
    return { data: data.jobs || [], total: data.total || 0 }
  },

  async getById(jobId) {
    return http.get(jobs.byId(jobId))
  },

  async create(jobData) {
    return http.post(jobs.create, jobData)
  },

  async close(jobId) {
    return http.patch(jobs.close(jobId), {})
  },

  async delete(jobId) {
    return http.request({ method: 'DELETE', url: jobs.delete(jobId) })
  },

  async apply(jobId, applicationData) {
    // applicationData: { cover_letter, resume_url, portfolio_url, github_url, linkedin_url,
    //                    years_experience, expected_salary, availability }
    return http.post(jobs.apply(jobId), applicationData)
  },

  async getApplications(jobId) {
    const data = await http.get(jobs.applications(jobId))
    return data.applications || []
  },

  async getMyApplications() {
    const data = await http.get(jobs.myApplications)
    return data.applications || []
  },

  async updateApplicationStatus(applicationId, status) {
    return http.patch(jobs.updateApplication(applicationId), { status })
  },

  async inviteDeveloper(jobId, developerId) {
    return http.post(jobs.invite(jobId, developerId), {})
  },

  async openHiringChat(jobId, applicationId) {
    return http.post(jobs.openChat(jobId, applicationId), {})
  },
}
