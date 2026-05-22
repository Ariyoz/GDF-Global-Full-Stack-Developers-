// ── Profiles Service — Demo ──

export const profilesService = {
  async getById() {
    return null
  },

  async getByUsername() {
    return null
  },

  async update(userId, updates) {
    return { id: userId, ...updates }
  },

  async listDevelopers() {
    return { data: [], count: 0 }
  },

  async listAll() {
    return { data: [], count: 0 }
  },

  async uploadAvatar(userId, file) {
    return URL.createObjectURL(file)
  },
}
