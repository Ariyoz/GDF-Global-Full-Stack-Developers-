// ── Profiles Service — Demo ──

const demoProfiles = [
  {
    id: 'demo-user-001',
    email: 'user@gfd.demo',
    full_name: 'Alex Developer',
    username: 'alexdev',
    avatar: '',
    role: 'developer',
    status: 'active',
    bio: 'Full-stack developer passionate about building great products.',
    skills: ['Vue.js', 'Node.js', 'TypeScript', 'Python', 'React'],
    location: 'San Francisco, CA',
    github_url: 'https://github.com/alexdev',
    portfolio: 'https://alexdev.io',
    company: '',
    experience_level: 'Senior Developer',
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'demo-user-002',
    email: 'sarah@example.com',
    full_name: 'Sarah Chen',
    username: 'sarahchen',
    avatar: '',
    role: 'developer',
    status: 'active',
    bio: 'Frontend specialist with a love for design systems and accessibility.',
    skills: ['React', 'TypeScript', 'Figma', 'CSS', 'Next.js'],
    location: 'Toronto, Canada',
    github_url: 'https://github.com/sarahchen',
    portfolio: 'https://sarahchen.dev',
    company: '',
    experience_level: 'Mid-Level Developer',
    created_at: '2024-02-10T08:00:00Z',
  },
  {
    id: 'demo-user-003',
    email: 'marcus@example.com',
    full_name: 'Marcus Johnson',
    username: 'marcusj',
    avatar: '',
    role: 'client',
    status: 'active',
    bio: 'Startup founder looking for talented developers.',
    skills: [],
    location: 'New York, NY',
    github_url: '',
    portfolio: '',
    company: 'TechCorp',
    experience_level: '',
    created_at: '2024-03-05T14:00:00Z',
  },
]

export const profilesService = {
  async getById(userId) {
    return demoProfiles.find(p => p.id === userId) || null
  },

  async getByUsername(username) {
    return demoProfiles.find(p => p.username === username) || null
  },

  async update(userId, updates) {
    const profile = demoProfiles.find(p => p.id === userId)
    if (profile) Object.assign(profile, updates)
    return profile
  },

  async listDevelopers({ page = 1, limit = 20, skills, search } = {}) {
    let filtered = demoProfiles.filter(p => p.role === 'developer' && p.status === 'active')
    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter(p => p.full_name.toLowerCase().includes(q) || p.username.toLowerCase().includes(q) || p.bio.toLowerCase().includes(q))
    }
    if (skills && skills.length) {
      filtered = filtered.filter(p => p.skills.some(s => skills.includes(s)))
    }
    const start = (page - 1) * limit
    return { data: filtered.slice(start, start + limit), count: filtered.length }
  },

  async listAll({ page = 1, limit = 20, search, role, status } = {}) {
    let filtered = [...demoProfiles]
    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter(p => p.full_name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q))
    }
    if (role) filtered = filtered.filter(p => p.role === role)
    if (status) filtered = filtered.filter(p => p.status === status)
    const start = (page - 1) * limit
    return { data: filtered.slice(start, start + limit), count: filtered.length }
  },

  async uploadAvatar(userId, file) {
    const url = URL.createObjectURL(file)
    const profile = demoProfiles.find(p => p.id === userId)
    if (profile) profile.avatar = url
    return url
  },
}
