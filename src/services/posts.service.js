// ── Community Posts Service — Real Backend ──
import http from './http'
import { API_ENDPOINTS } from '@/config/api'

const { feed } = API_ENDPOINTS

export const postsService = {
  async getFeed({ page = 1, limit = 20, feed_type = 'explore' } = {}) {
    const data = await http.get(`${feed.list}?page=${page}&limit=${limit}&feed_type=${feed_type}`)
    return { data: data.posts || [], count: data.posts?.length || 0, hasMore: data.has_more || false }
  },

  async create(postData) {
    const response = await http.post(feed.create, {
      content: postData.content || postData.text,
      post_type: postData.post_type || 'text',
      media_urls: postData.media_urls || postData.imageUrls || [],
      hashtags: postData.hashtags || [],
      code_snippet: postData.code_snippet,
      code_language: postData.code_language,
    })
    // Return the post object for the feed store
    return response.post || response
  },

  async delete(postId) {
    return http.delete(feed.byId(postId))
  },

  async like(postId) {
    return http.post(feed.like(postId))
  },

  async unlike(postId) {
    return http.delete(feed.like(postId))
  },

  async hasLiked() {
    return false
  },

  async getComments(postId) {
    const data = await http.get(feed.byId(postId))
    return data.comments || []
  },

  async addComment(postId, authorId, content) {
    return http.post(feed.comment(postId), { content })
  },

  async deleteComment() {},

  async bookmark(postId) {
    return http.post(feed.bookmark(postId))
  },

  async removeBookmark(postId) {
    return http.delete(feed.bookmark(postId))
  },

  async repost(postId) {
    return http.post(`${feed.byId(postId)}/repost`)
  },
}
