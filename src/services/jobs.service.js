// ── Jobs Service — Demo ──

export const jobsService = {
  async list() {
    return { data: [], count: 0 }
  },

  async getById() {
    return null
  },

  async create(jobData) {
    return { id: 'job-' + Date.now(), ...jobData, created_at: new Date().toISOString() }
  },

  async update(jobId, updates) {
    return { id: jobId, ...updates }
  },

  async delete() {},

  async apply(jobId, developerId, coverLetter) {
    return { id: 'app-' + Date.now(), job_id: jobId, developer_id: developerId, cover_letter: coverLetter, status: 'pending' }
  },

  async getApplications() {
    return []
  },

  async getMyApplications() {
    return []
  },

  async saveJob() {},
  async unsaveJob() {},
  async getSavedJobs() { return [] },
}
