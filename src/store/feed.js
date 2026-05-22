// ── Feed Store — Real Backend with Real-time ──
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { postsService } from '@/services/posts.service'
import { websocketService } from '@/services/websocket.service'
import { useAuthStore } from '@/store/auth'

export const useFeedStore = defineStore('feed', () => {
  const posts = ref([])
  const loading = ref(false)
  const error = ref(null)
  const page = ref(1)
  const hasMore = ref(true)
  const feedType = ref('explore') // 'explore', 'following'

  // Listen for real-time post events
  websocketService.onEvent((event) => {
    if (event.type === 'post_created' && event.data) {
      // New post from someone — add to top of feed if not already there
      const exists = posts.value.find(p => p.id === event.data.post_id)
      if (!exists) {
        posts.value.unshift({
          id: event.data.post_id,
          content: event.data.content,
          post_type: event.data.post_type || 'text',
          media_urls: [],
          hashtags: [],
          like_count: 0,
          comment_count: 0,
          repost_count: 0,
          bookmark_count: 0,
          is_liked: false,
          is_bookmarked: false,
          created_at: event.data.created_at || new Date().toISOString(),
          author: {
            id: event.data.author_id,
            full_name: event.data.author_name,
            avatar: event.data.author_avatar,
          },
        })
      }
    }

    if (event.type === 'post_liked' && event.data) {
      const post = posts.value.find(p => p.id === event.data.post_id)
      if (post) post.like_count = event.data.like_count
    }

    if (event.type === 'post_commented' && event.data) {
      const post = posts.value.find(p => p.id === event.data.post_id)
      if (post) post.comment_count = event.data.comment_count
    }

    if (event.type === 'post_deleted' && event.data) {
      posts.value = posts.value.filter(p => p.id !== event.data.post_id)
    }
  })

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
      const result = await postsService.getFeed({
        page: page.value,
        limit: 20,
        feed_type: feedType.value,
      })
      const newPosts = result.data || []

      if (reset) {
        posts.value = newPosts
      } else {
        // Avoid duplicates
        const existingIds = new Set(posts.value.map(p => p.id))
        const unique = newPosts.filter(p => !existingIds.has(p.id))
        posts.value.push(...unique)
      }
      hasMore.value = result.hasMore || newPosts.length === 20
      page.value++
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  function setFeedType(type) {
    if (feedType.value !== type) {
      feedType.value = type
      fetchFeed(true)
    }
  }

  async function addPost(postData) {
    const authStore = useAuthStore()
    if (!authStore.user) return

    try {
      const newPost = await postsService.create({
        content: postData.content || postData.text,
        post_type: postData.post_type || (postData.media_urls?.length ? 'image' : 'text'),
        media_urls: postData.media_urls || [],
        hashtags: postData.hashtags || [],
        code_snippet: postData.code_snippet,
        code_language: postData.code_language,
      })

      const postForFeed = {
        id: newPost.id,
        content: newPost.content || postData.content || postData.text,
        post_type: newPost.post_type || 'text',
        media_urls: newPost.media_urls || postData.media_urls || [],
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
      const result = await postsService.like(postId)
      const post = posts.value.find(p => p.id === postId)
      if (post) {
        post.like_count = result?.like_count || (post.like_count || 0) + 1
        post.is_liked = true
      }
    } catch { /* ignore duplicate */ }
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

  async function commentOnPost(postId, content) {
    try {
      const result = await postsService.addComment(postId, null, content)
      const post = posts.value.find(p => p.id === postId)
      if (post) {
        post.comment_count = result?.comment_count || (post.comment_count || 0) + 1
        if (!post.commentList) post.commentList = []
        post.commentList.push({
          id: result?.id || Date.now(),
          content,
          author: useAuthStore().profile?.full_name || 'You',
          created_at: new Date().toISOString(),
        })
      }
      return result
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function repostPost(postId) {
    try {
      await postsService.repost(postId)
      const post = posts.value.find(p => p.id === postId)
      if (post) {
        post.repost_count = (post.repost_count || 0) + 1
        post.is_reposted = true
      }
    } catch { /* ignore */ }
  }

  async function bookmarkPost(postId) {
    try {
      await postsService.bookmark(postId)
      const post = posts.value.find(p => p.id === postId)
      if (post) {
        post.bookmark_count = (post.bookmark_count || 0) + 1
        post.is_bookmarked = true
      }
    } catch { /* ignore */ }
  }

  async function loadMore() {
    if (hasMore.value && !loading.value) {
      await fetchFeed(false)
    }
  }

  return {
    posts, loading, error, hasMore, feedType,
    fetchFeed, setFeedType, addPost, deletePost,
    likePost, unlikePost, commentOnPost, repostPost, bookmarkPost, loadMore,
  }
})
