// ── Feed Store — Real Backend ──
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
      const result = await postsService.getFeed({ page: page.value, limit: 20, feed_type: 'explore' })
      const newPosts = result.data || []

      if (reset) {
        posts.value = newPosts
      } else {
        posts.value.push(...newPosts)
      }
      hasMore.value = result.hasMore || newPosts.length === 20
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
        post_type: postData.post_type || 'text',
        media_urls: postData.imageUrls || postData.media_urls || [],
        hashtags: postData.hashtags || [],
      })

      // Add to top of feed with author info
      const postForFeed = {
        id: newPost.id,
        content: newPost.content || postData.text || postData.content,
        post_type: newPost.post_type || 'text',
        media_urls: newPost.media_urls || [],
        hashtags: newPost.hashtags || [],
        like_count: 0,
        comment_count: 0,
        repost_count: 0,
        bookmark_count: 0,
        is_liked: false,
        is_bookmarked: false,
        created_at: newPost.created_at || new Date().toISOString(),
        author: newPost.author || {
          id: authStore.user.id || authStore.profile?.id,
          username: authStore.profile?.username,
          full_name: authStore.profile?.full_name,
          avatar: authStore.profile?.avatar,
        },
      }

      posts.value.unshift(postForFeed)
      return postForFeed
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
    try {
      await postsService.like(postId)
      const post = posts.value.find(p => p.id === postId)
      if (post) {
        post.like_count = (post.like_count || 0) + 1
        post.is_liked = true
      }
    } catch (err) {
      // Ignore duplicate like errors
    }
  }

  async function unlikePost(postId) {
    try {
      await postsService.unlike(postId)
      const post = posts.value.find(p => p.id === postId)
      if (post) {
        post.like_count = Math.max((post.like_count || 1) - 1, 0)
        post.is_liked = false
      }
    } catch (err) {
      error.value = err.message
    }
  }

  async function bookmarkPost(postId) {
    try {
      await postsService.bookmark(postId)
      const post = posts.value.find(p => p.id === postId)
      if (post) {
        post.bookmark_count = (post.bookmark_count || 0) + 1
        post.is_bookmarked = true
      }
    } catch (err) {
      // Ignore
    }
  }

  return { posts, loading, error, hasMore, fetchFeed, addPost, deletePost, likePost, unlikePost, bookmarkPost }
})
