// ── Community Posts Service — Real Backend ──
import http from './http'
import { API_ENDPOINTS } from '@/config/api'

const { feed } = API_ENDPOINTS

export const postsService = {
  async getFeed({ page = 1, limit = 20 } = {}) {
    const data = await http.get(`${feed.list}?page=${page}&limit=${limit}`)
    return { data: data.posts || [], count: data.posts?.length || 0 }
  },

  async create(postData) {
    return http.post(feed.create, postData)
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
    return []
  },

  async addComment(postId, authorId, content) {
    return http.post(feed.comment(postId), { content })
  },

  async deleteComment() {},
}
