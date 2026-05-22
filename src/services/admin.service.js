// ── Admin Service — Supabase ──
import { supabase } from '@/lib/supabase'

export const adminService = {
  // Get platform analytics
  async getAnalytics() {
    const [users, posts, jobs, activeJobs] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('community_posts').select('*', { count: 'exact', head: true }),
      supabase.from('jobs').select('*', { count: 'exact', head: true }),
      supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'open'),
    ])

    return {
      totalUsers: users.count || 0,
      totalPosts: posts.count || 0,
      totalJobs: jobs.count || 0,
      activeJobs: activeJobs.count || 0,
    }
  },

  // List all users (admin)
  async listUsers({ page = 1, limit = 20, search, role, status } = {}) {
    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
    }
    if (role) query = query.eq('role', role)
    if (status) query = query.eq('status', status)

    const { data, error, count } = await query
    if (error) throw error
    return { users: data || [], total: count || 0 }
  },

  // Suspend user
  async suspendUser(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ status: 'suspended' })
      .eq('id', userId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  // Reinstate user
  async reinstateUser(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ status: 'active' })
      .eq('id', userId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  // Get flagged content (using community_posts with reports)
  async getReports({ status } = {}) {
    // For now, return notifications marked as reports
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('type', 'report')
      .order('created_at', { ascending: false })

    if (status === 'unread') query = query.eq('is_read', false)

    const { data, error } = await query
    if (error) throw error
    return data || []
  },

  // Get recent activity
  async getRecentActivity(limit = 10) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, role, status, created_at')
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) throw error
    return data || []
  },

  // Update user role
  async updateUserRole(userId, role) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)
      .select()
      .single()
    if (error) throw error
    return data
  },
}
