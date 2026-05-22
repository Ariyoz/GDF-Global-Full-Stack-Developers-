// ── Jobs Service ──
import { supabase } from '@/lib/supabase'

export const jobsService = {
  // List jobs
  async list({ page = 1, limit = 20, status = 'open', search, skills } = {}) {
    let query = supabase
      .from('jobs')
      .select('*, client:profiles!client_id(id, full_name, avatar, company)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (status) query = query.eq('status', status)
    if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    if (skills && skills.length) query = query.overlaps('skills_required', skills)

    const { data, error, count } = await query
    if (error) throw error
    return { data, count }
  },

  // Get single job
  async getById(jobId) {
    const { data, error } = await supabase
      .from('jobs')
      .select('*, client:profiles!client_id(id, full_name, avatar, company)')
      .eq('id', jobId)
      .single()
    if (error) throw error
    return data
  },

  // Create job
  async create(jobData) {
    const { data, error } = await supabase
      .from('jobs')
      .insert(jobData)
      .select()
      .single()
    if (error) throw error
    return data
  },

  // Update job
  async update(jobId, updates) {
    const { data, error } = await supabase
      .from('jobs')
      .update(updates)
      .eq('id', jobId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  // Delete job
  async delete(jobId) {
    const { error } = await supabase.from('jobs').delete().eq('id', jobId)
    if (error) throw error
  },

  // Apply for job
  async apply(jobId, developerId, coverLetter) {
    const { data, error } = await supabase
      .from('job_applications')
      .insert({ job_id: jobId, developer_id: developerId, cover_letter: coverLetter })
      .select()
      .single()
    if (error) throw error
    return data
  },

  // Get applications for a job (client view)
  async getApplications(jobId) {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*, developer:profiles!developer_id(id, full_name, avatar, skills, experience_level)')
      .eq('job_id', jobId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  // Get my applications (developer view)
  async getMyApplications(developerId) {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*, job:jobs!job_id(id, title, budget, status, client:profiles!client_id(full_name, company))')
      .eq('developer_id', developerId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  // Save/unsave job
  async saveJob(userId, jobId) {
    const { error } = await supabase.from('saved_jobs').insert({ user_id: userId, job_id: jobId })
    if (error) throw error
  },

  async unsaveJob(userId, jobId) {
    const { error } = await supabase.from('saved_jobs').delete().eq('user_id', userId).eq('job_id', jobId)
    if (error) throw error
  },

  async getSavedJobs(userId) {
    const { data, error } = await supabase
      .from('saved_jobs')
      .select('*, job:jobs!job_id(*)')
      .eq('user_id', userId)
    if (error) throw error
    return data
  },
}
