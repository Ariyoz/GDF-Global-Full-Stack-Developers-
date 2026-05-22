// ── Community Posts Service — Demo ──

export const postsService = {
  async getFeed() {
    return { data: [], count: 0 }
  },

  async create(postData) {
    return {
      id: 'post-' + Date.now(),
      ...postData,
      likes: 0,
      comment_count: 0,
      created_at: new Date().toISOString(),
      author: { id: postData.author_id, full_name: 'User', avatar: '', role: 'developer' },
    }
  },

  async delete() {},

  async like() {},

  async unlike() {},

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
      author: { id: authorId, full_name: 'User', avatar: '' },
    }
  },

  async deleteComment() {},
}
