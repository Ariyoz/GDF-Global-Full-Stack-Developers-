// ── Analytics Service — Supabase ──
import { supabase } from '@/lib/supabase'

export const analyticsService = {
  // Get profile view count
  async getProfileViews(userId) {
    const { count, error } = await supabase
      .from('profile_views')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', userId)
    if (error) return 0
    return count || 0
  },

  // Get profile views for last 7 days (daily breakdown)
  async getWeeklyViews(userId) {
    const days = []
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const start = new Date(date); start.setHours(0, 0, 0, 0)
      const end = new Date(date); end.setHours(23, 59, 59, 999)

      const { count } = await supabase
        .from('profile_views')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', userId)
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString())

      days.push({ label: dayNames[date.getDay()], views: count || 0 })
    }

    return days
  },

  // Log a profile view
  async logProfileView(profileId, viewerId) {
    if (profileId === viewerId) return // Don't count self-views
    await supabase.from('profile_views').insert({ profile_id: profileId, viewer_id: viewerId })
  },

  // Get job request count for user
  async getJobRequestCount(userId) {
    const { count, error } = await supabase
      .from('job_applications')
      .select('*', { count: 'exact', head: true })
      .eq('developer_id', userId)
    if (error) return 0
    return count || 0
  },

  // Get post count for user
  async getPostCount(userId) {
    const { count, error } = await supabase
      .from('community_posts')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', userId)
    if (error) return 0
    return count || 0
  },
}
