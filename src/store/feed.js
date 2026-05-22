// ── Feed Store — shared post state between compose sheet and feed view ──
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFeedStore = defineStore('feed', () => {
  const posts = ref([])

  // Prepend a new post to the top of the feed
  function addPost(post) {
    posts.value.unshift(post)
  }

  // Remove a post by id
  function deletePost(postId) {
    posts.value = posts.value.filter(p => p.id !== postId)
  }

  return { posts, addPost, deletePost }
})
