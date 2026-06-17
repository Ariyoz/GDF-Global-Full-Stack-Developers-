// ── Posts Service — upgraded with link previews, video, documents, hashtags ──
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
      content: postData.content || postData.text || '',
      post_type: postData.post_type || 'text',
      media_urls: postData.media_urls || [],
      video_url: postData.video_url || null,
      document_url: postData.document_url || null,
      document_name: postData.document_name || null,
      hashtags: postData.hashtags || [],
      code_snippet: postData.code_snippet || null,
      code_language: postData.code_language || null,
      visibility: postData.visibility || 'public',
    })
    return response.post || response
  },

  async getById(postId) {
    const data = await http.get(feed.byId(postId))
    return data
  },

  async delete(postId) {
    return http.request({ method: 'DELETE', url: feed.byId(postId) })
  },

  async like(postId) {
    return http.post(feed.like(postId))
  },

  async unlike(postId) {
    return http.request({ method: 'DELETE', url: feed.unlike(postId) })
  },

  async getComments(postId) {
    const data = await http.get(feed.comments(postId))
    return data.comments || []
  },

  async addComment(postId, parentId, content) {
    return http.post(feed.comment(postId), {
      content,
      parent_id: parentId || null,
    })
  },

  async deleteComment(postId, commentId) {
    return http.request({ method: 'DELETE', url: feed.deleteComment(postId, commentId) })
  },

  async bookmark(postId) {
    return http.post(feed.bookmark(postId))
  },

  async removeBookmark(postId) {
    return http.request({ method: 'DELETE', url: feed.bookmark(postId) })
  },

  async repost(postId) {
    return http.post(feed.repost(postId))
  },

  async getTrendingPosts() {
    const data = await http.get(feed.trendingPosts)
    return data.posts || []
  },

  async getRecommendedPosts() {
    const data = await http.get(feed.recommendedPosts)
    return data.posts || []
  },

  async getBookmarks(page = 1) {
    const data = await http.get(`${feed.bookmarks}?page=${page}&limit=20`)
    return data.posts || []
  },
}
