// ── Profiles Service ──
import { supabase } from '@/lib/supabase'

export const profilesService = {
  // Get profile by user ID
  async getById(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (error) throw error
    return data
  },

  // Get profile by username
  async getByUsername(username) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single()
    if (error) throw error
    return data
  },

  // Update profile
  async update(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  // List developers
  async listDevelopers({ page = 1, limit = 20, skills, search } = {}) {
    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .eq('role', 'developer')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,username.ilike.%${search}%,bio.ilike.%${search}%`)
    }

    if (skills && skills.length) {
      query = query.overlaps('skills', skills)
    }

    const { data, error, count } = await query
    if (error) throw error
    return { data, count }
  },

  // List all users (admin)
  async listAll({ page = 1, limit = 20, search, role, status } = {}) {
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
    return { data, count }
  },

  // Upload avatar
  async uploadAvatar(userId, file) {
    const fileExt = file.name.split('.').pop()
    const filePath = `avatars/${userId}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true })
    if (uploadError) throw uploadError

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)

    await supabase
      .from('profiles')
      .update({ avatar: data.publicUrl })
      .eq('id', userId)

    return data.publicUrl
  },
}
