// ── Community Posts Service ──
import { supabase } from '@/lib/supabase'

export const postsService = {
  // Get feed (paginated)
  async getFeed({ page = 1, limit = 20 } = {}) {
    const { data, error, count } = await supabase
      .from('community_posts')
      .select('*, author:profiles!author_id(id, full_name, avatar, role)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)
    if (error) throw error
    return { data, count }
  },

  // Create post
  async create(postData) {
    const { data, error } = await supabase
      .from('community_posts')
      .insert(postData)
      .select('*, author:profiles!author_id(id, full_name, avatar, role)')
      .single()
    if (error) throw error
    return data
  },

  // Delete post
  async delete(postId) {
    const { error } = await supabase.from('community_posts').delete().eq('id', postId)
    if (error) throw error
  },

  // Like post
  async like(postId, userId) {
    const { error } = await supabase.from('post_likes').insert({ post_id: postId, user_id: userId })
    if (error && error.code !== '23505') throw error // ignore duplicate
    // Increment likes count
    await supabase.rpc('increment_likes', { post_id: postId })
  },

  // Unlike post
  async unlike(postId, userId) {
    const { error } = await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', userId)
    if (error) throw error
    await supabase.rpc('decrement_likes', { post_id: postId })
  },

  // Check if user liked a post
  async hasLiked(postId, userId) {
    const { data } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single()
    return !!data
  },

  // Get comments for a post
  async getComments(postId) {
    const { data, error } = await supabase
      .from('post_comments')
      .select('*, author:profiles!author_id(id, full_name, avatar)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
    if (error) throw error
    return data
  },

  // Add comment
  async addComment(postId, authorId, content, parentId = null) {
    const { data, error } = await supabase
      .from('post_comments')
      .insert({ post_id: postId, author_id: authorId, content, parent_id: parentId })
      .select('*, author:profiles!author_id(id, full_name, avatar)')
      .single()
    if (error) throw error
    // Increment comment count
    await supabase
      .from('community_posts')
      .update({ comment_count: supabase.rpc ? undefined : 0 })
      .eq('id', postId)
    return data
  },

  // Delete comment
  async deleteComment(commentId) {
    const { error } = await supabase.from('post_comments').delete().eq('id', commentId)
    if (error) throw error
  },
}
