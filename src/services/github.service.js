// ── GitHub Integration Service — Demo ──

export const githubService = {
  // Fetch GitHub profile data from GitHub API
  async fetchGitHubProfile(username) {
    const res = await fetch(`https://api.github.com/users/${username}`)
    if (!res.ok) throw new Error('Failed to fetch GitHub profile')
    return res.json()
  },

  // Fetch public repositories
  async fetchRepositories(username, perPage = 30) {
    const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=${perPage}&sort=updated`)
    if (!res.ok) throw new Error('Failed to fetch repositories')
    return res.json()
  },

  // Save GitHub profile (demo — no-op)
  async saveProfile(userId, githubData) {
    return {
      user_id: userId,
      github_id: String(githubData.id),
      username: githubData.login,
      avatar: githubData.avatar_url,
      bio: githubData.bio || '',
      followers: githubData.followers,
      following: githubData.following,
      public_repos: githubData.public_repos,
      github_url: githubData.html_url,
    }
  },

  // Save repositories (demo — no-op)
  async saveRepositories(userId, repos) {
    return repos.map(repo => ({
      user_id: userId,
      repo_name: repo.name,
      description: repo.description || '',
      language: repo.language || '',
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      repo_url: repo.html_url,
      topics: repo.topics || [],
      updated_at: repo.updated_at,
    }))
  },

  // Get stored GitHub profile (demo — returns null)
  async getProfile() {
    return null
  },

  // Get stored repositories (demo — returns empty)
  async getRepositories() {
    return []
  },

  // Toggle featured repository (demo — no-op)
  async toggleFeatured() {},

  // Full sync
  async syncGitHubData(userId, username) {
    const [profile, repos] = await Promise.all([
      this.fetchGitHubProfile(username),
      this.fetchRepositories(username),
    ])
    const savedProfile = await this.saveProfile(userId, profile)
    const savedRepos = await this.saveRepositories(userId, repos)
    return { profile: savedProfile, repositories: savedRepos }
  },
}
