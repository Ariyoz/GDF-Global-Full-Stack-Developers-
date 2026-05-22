// ── Jobs Service — Demo ──

const demoJobs = [
  {
    id: 'job-001',
    title: 'Full-Stack Vue.js Developer',
    description: 'Build a modern SaaS dashboard with Vue 3, Pinia, and TailwindCSS.',
    status: 'open',
    budget: '$3,000 - $5,000',
    skills_required: ['Vue.js', 'Node.js', 'TailwindCSS'],
    project_type: 'Web App',
    deadline: '2025-03-01',
    created_at: '2024-12-01T10:00:00Z',
    client_id: 'demo-user-003',
    client: { id: 'demo-user-003', full_name: 'Marcus Johnson', avatar: '', company: 'TechCorp' },
  },
  {
    id: 'job-002',
    title: 'React Native Mobile App',
    description: 'Cross-platform mobile app for a fitness tracking startup.',
    status: 'open',
    budget: '$5,000 - $8,000',
    skills_required: ['React Native', 'TypeScript', 'Firebase'],
    project_type: 'Mobile App',
    deadline: '2025-04-15',
    created_at: '2024-12-10T14:00:00Z',
    client_id: 'demo-user-003',
    client: { id: 'demo-user-003', full_name: 'Marcus Johnson', avatar: '', company: 'TechCorp' },
  },
]

export const jobsService = {
  async list({ page = 1, limit = 20, status, search, skills } = {}) {
    let filtered = [...demoJobs]
    if (status) filtered = filtered.filter(j => j.status === status)
    if (search) filtered = filtered.filter(j => j.title.toLowerCase().includes(search.toLowerCase()))
    if (skills && skills.length) filtered = filtered.filter(j => j.skills_required.some(s => skills.includes(s)))
    return { data: filtered, count: filtered.length }
  },

  async getById(jobId) {
    return demoJobs.find(j => j.id === jobId) || null
  },

  async create(jobData) {
    const newJob = { id: 'job-' + Date.now(), ...jobData, created_at: new Date().toISOString() }
    demoJobs.push(newJob)
    return newJob
  },

  async update(jobId, updates) {
    const job = demoJobs.find(j => j.id === jobId)
    if (job) Object.assign(job, updates)
    return job
  },

  async delete(jobId) {
    const idx = demoJobs.findIndex(j => j.id === jobId)
    if (idx !== -1) demoJobs.splice(idx, 1)
  },

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
