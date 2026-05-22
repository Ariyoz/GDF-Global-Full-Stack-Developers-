// ── Feed Store — Demo ──
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { postsService } from '@/services/posts.service'
import { useAuthStore } from '@/store/auth'

export const useFeedStore = defineStore('feed', () => {
  const posts = ref([])
  const loading = ref(false)
  const error = ref(null)
  const page = ref(1)
  const hasMore = ref(true)

  async function fetchFeed(reset = false) {
    if (loading.value) return
    loading.value = true
    error.value = null

    if (reset) {
      page.value = 1
      posts.value = []
      hasMore.value = true
    }

    try {
      const { data, count } = await postsService.getFeed({ page: page.value, limit: 20 })
      if (reset) {
        posts.value = data
      } else {
        posts.value.push(...data)
      }
      hasMore.value = data.length === 20
      page.value++
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function addPost(postData) {
    const authStore = useAuthStore()
    if (!authStore.user) return

    try {
      const newPost = await postsService.create({
        content: postData.text || postData.content,
        author_id: authStore.user.id,
        title: postData.title || null,
        image_urls: postData.imageUrls || [],
      })
      posts.value.unshift(newPost)
      return newPost
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function deletePost(postId) {
    try {
      await postsService.delete(postId)
      posts.value = posts.value.filter(p => p.id !== postId)
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function likePost(postId) {
    const authStore = useAuthStore()
    if (!authStore.user) return

    try {
      await postsService.like(postId, authStore.user.id)
      const post = posts.value.find(p => p.id === postId)
      if (post) post.likes = (post.likes || 0) + 1
    } catch (err) {
      // Ignore duplicate like errors
    }
  }

  async function unlikePost(postId) {
    const authStore = useAuthStore()
    if (!authStore.user) return

    try {
      await postsService.unlike(postId, authStore.user.id)
      const post = posts.value.find(p => p.id === postId)
      if (post) post.likes = Math.max((post.likes || 1) - 1, 0)
    } catch (err) {
      error.value = err.message
    }
  }

  return { posts, loading, error, hasMore, fetchFeed, addPost, deletePost, likePost, unlikePost }
})
