// ── Community Posts Service — Demo ──

const demoPosts = []

export const postsService = {
  async getFeed({ page = 1, limit = 20 } = {}) {
    const start = (page - 1) * limit
    return { data: demoPosts.slice(start, start + limit), count: demoPosts.length }
  },

  async create(postData) {
    const newPost = {
      id: 'post-' + Date.now(),
      ...postData,
      likes: 0,
      comment_count: 0,
      created_at: new Date().toISOString(),
      author: { id: postData.author_id, full_name: 'Demo User', avatar: '', role: 'developer' },
    }
    demoPosts.unshift(newPost)
    return newPost
  },

  async delete(postId) {
    const idx = demoPosts.findIndex(p => p.id === postId)
    if (idx !== -1) demoPosts.splice(idx, 1)
  },

  async like(postId) {
    const post = demoPosts.find(p => p.id === postId)
    if (post) post.likes = (post.likes || 0) + 1
  },

  async unlike(postId) {
    const post = demoPosts.find(p => p.id === postId)
    if (post) post.likes = Math.max((post.likes || 1) - 1, 0)
  },

  async hasLiked() {
    return false
  },

  async getComments() {
    return []
  },

  async addComment(postId, authorId, content) {
    return {
      id: 'comment-' + Date.now(),
      post_id: postId,
      author_id: authorId,
      content,
      created_at: new Date().toISOString(),
      author: { id: authorId, full_name: 'Demo User', avatar: '' },
    }
  },

  async deleteComment() {},
}
