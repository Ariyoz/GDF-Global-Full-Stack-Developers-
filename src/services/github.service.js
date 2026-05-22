// ── GitHub Integration Service ──
import { supabase } from '@/lib/supabase'

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

  // Save GitHub profile to database
  async saveProfile(userId, githubData) {
    const profileData = {
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

    const { data, error } = await supabase
      .from('github_profiles')
      .upsert(profileData, { onConflict: 'user_id' })
      .select()
      .single()
    if (error) throw error
    return data
  },

  // Save repositories to database
  async saveRepositories(userId, repos) {
    // Delete old repos first
    await supabase.from('github_repositories').delete().eq('user_id', userId)

    const repoData = repos.map(repo => ({
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

    const { data, error } = await supabase
      .from('github_repositories')
      .insert(repoData)
      .select()
    if (error) throw error
    return data
  },

  // Get stored GitHub profile
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('github_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  // Get stored repositories
  async getRepositories(userId, featuredOnly = false) {
    let query = supabase
      .from('github_repositories')
      .select('*')
      .eq('user_id', userId)
      .order('stars', { ascending: false })

    if (featuredOnly) query = query.eq('is_featured', true)

    const { data, error } = await query
    if (error) throw error
    return data
  },

  // Toggle featured repository
  async toggleFeatured(repoId, isFeatured) {
    const { error } = await supabase
      .from('github_repositories')
      .update({ is_featured: isFeatured })
      .eq('id', repoId)
    if (error) throw error
  },

  // Full sync: fetch from GitHub API and save to database
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
