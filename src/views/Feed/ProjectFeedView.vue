<template>
  <div class="feed-view">
    <div class="container-gfd feed-layout">

      <!-- Left Sidebar -->
      <aside class="feed-sidebar">
        <div class="glass-card-static sidebar-card">
          <div class="sidebar-profile">
            <div class="sidebar-avatar">
              <img v-if="user?.avatar" :src="user.avatar" alt="" class="sidebar-avatar-img" />
              <span v-else>{{ userInitials }}</span>
            </div>
            <div>
              <p class="sidebar-name">{{ user?.full_name || 'Developer' }}</p>
              <p class="sidebar-role">@{{ user?.username || 'member' }}</p>
            </div>
          </div>
          <div class="divider-gfd" style="margin:1rem 0" />
          <nav class="sidebar-nav">
            <a class="sidebar-link active" href="#">
              <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">home</span>
              Feed
            </a>
            <RouterLink to="/dashboard/projects" class="sidebar-link">
              <span class="material-symbols-outlined">bookmarks</span>
              Saved Projects
            </RouterLink>
            <RouterLink to="/dashboard/analytics" class="sidebar-link">
              <span class="material-symbols-outlined">analytics</span>
              Analytics
            </RouterLink>
          </nav>
        </div>
      </aside>

      <!-- Center Feed -->
      <main class="feed-main">
        <!-- Create Post -->
        <div class="glass-card-static create-post">
          <div class="create-post-top">
            <div class="post-avatar-sm">{{ userInitials }}</div>
            <button class="create-post-input" @click="showCompose = true">
              Share your latest build...
            </button>
          </div>
          <div class="create-post-actions">
            <button class="post-action-type" @click="showCompose = true; composeMode = 'photo'">
              <span class="material-symbols-outlined" style="color:var(--primary)">image</span>
              Photo
            </button>
          </div>
        </div>

        <!-- Compose Modal -->
        <Transition name="modal">
          <div v-if="showCompose" class="modal-overlay" @click.self="closeCompose">
            <div class="glass-modal compose-modal">
              <div class="compose-header">
                <h3 class="compose-title">Create Post</h3>
                <button class="btn-ghost icon-only" @click="closeCompose">
                  <span class="material-symbols-outlined">close</span>
                </button>
              </div>
              <div class="compose-body">
                <div class="compose-user">
                  <div class="post-avatar-sm">
                    <img v-if="user?.avatar" :src="user.avatar" alt="" class="post-avatar-img" />
                    <span v-else>{{ userInitials }}</span>
                  </div>
                  <p class="compose-name">{{ user?.full_name || 'Developer' }}</p>
                </div>
                <textarea
                  v-model="newPost"
                  class="compose-textarea"
                  placeholder="Share your latest build, insight, or project update..."
                  rows="5"
                  autofocus
                />
              </div>
              <div v-if="selectedImage" class="compose-image-preview">
                <img :src="selectedImage" alt="Selected post image" />
                <button type="button" class="btn-ghost remove-image-btn" @click="clearSelectedImage">
                  <span class="material-symbols-outlined">close</span>
                  Remove image
                </button>
              </div>
              <!-- Quote Preview -->
              <div v-if="quotePost" class="compose-quote-preview">
                <div class="quote-card">
                  <p class="quote-author">{{ quotePost.author }}</p>
                  <p class="quote-text">{{ quotePost.text?.slice(0, 120) }}{{ quotePost.text?.length > 120 ? '...' : '' }}</p>
                </div>
                <button type="button" class="btn-ghost remove-image-btn" @click="quotePost = null">
                  <span class="material-symbols-outlined">close</span>
                  Remove quote
                </button>
              </div>
              <div class="compose-footer">
                <div class="compose-tools">
                  <button type="button" class="btn-ghost image-option" @click="openImagePicker('gallery')">
                    <span class="material-symbols-outlined">photo_library</span>
                    Gallery
                  </button>
                  <button type="button" class="btn-ghost image-option" @click="openImagePicker('camera')">
                    <span class="material-symbols-outlined">photo_camera</span>
                    Camera
                  </button>
                  <input ref="imageInput" type="file" accept="image/*" class="hidden-file-input" @change="handleImageChange" />
                  <input ref="cameraInput" type="file" accept="image/*" capture="environment" class="hidden-file-input" @change="handleImageChange" />
                </div>
                <button class="btn-primary" :disabled="!newPost.trim() && !selectedImage" @click="submitPost">Post</button>
              </div>
            </div>
          </div>
        </Transition>

        <!-- Feed Tabs -->
        <div class="feed-tabs">
          <button class="feed-tab" :class="{ active: feedStore.feedType === 'explore' }" @click="switchFeedType('explore')">
            For You
          </button>
          <button class="feed-tab" :class="{ active: feedStore.feedType === 'following' }" @click="switchFeedType('following')">
            Following
          </button>
        </div>

        <!-- Feed Posts -->
        <div class="feed-posts">
          <article
            v-for="post in posts"
            :key="post.id"
            class="feed-post glass-card animate-fade-in-up"
          >
            <!-- Post Header -->
            <div class="post-header">
              <div class="post-author-info" @click="goToProfile(post.author?.id)">
                <div class="post-avatar">
                  <img v-if="post.author?.avatar" :src="post.author.avatar" :alt="post.author.full_name" class="post-avatar-img" />
                  <span v-else>{{ getInitials(post.author?.full_name || post.author) }}</span>
                </div>
                <div class="post-author-text">
                  <div class="post-author-line">
                    <span class="post-author-name">{{ post.author?.full_name || post.author }}</span>
                    <span class="post-author-username">@{{ post.author?.username || '' }}</span>
                    <span class="post-time-dot">·</span>
                    <span class="post-time">{{ formatTime(post.created_at) }}</span>
                  </div>
                </div>
              </div>
              <div class="post-menu-wrap">
                <button class="btn-ghost icon-only" @click="togglePostMenu(post.id)">
                  <span class="material-symbols-outlined">more_horiz</span>
                </button>
                <Transition name="dropdown">
                  <div v-if="openMenuId === post.id" class="post-dropdown">
                    <button class="dropdown-item dropdown-item--danger" @click="deletePost(post.id)">
                      <span class="material-symbols-outlined">delete</span>
                      Delete Post
                    </button>
                  </div>
                </Transition>
              </div>
            </div>

            <!-- Post Content -->
            <div class="post-content">
              <p v-if="post.content" class="post-text">{{ post.content }}</p>
              <p v-else-if="!post.media_urls?.length" class="post-text" style="color:var(--on-surface-variant);font-style:italic;">No content</p>

              <!-- Media (images/videos) — shown BELOW text -->
              <div v-if="post.media_urls && post.media_urls.length && post.media_urls[0]" class="post-media">
                <img
                  v-for="(url, idx) in post.media_urls.filter(u => u)"
                  :key="idx"
                  :src="url"
                  alt="Post media"
                  class="post-image"
                  loading="lazy"
                />
              </div>

              <!-- Code snippet -->
              <div v-if="post.code_snippet" class="post-code-block">
                <div class="code-header">
                  <span class="code-filename">{{ post.code_language || 'code' }}</span>
                </div>
                <pre class="code-content"><code>{{ post.code_snippet }}</code></pre>
              </div>

              <!-- Hashtags -->
              <div v-if="post.hashtags && post.hashtags.length" class="post-hashtags">
                <span v-for="tag in post.hashtags" :key="tag" class="hashtag">#{{ tag }}</span>
              </div>
            </div>

            <!-- Post Actions Bar (Twitter/X style) -->
            <div class="post-actions-bar">
              <button class="action-btn" @click="post.showComments = !post.showComments">
                <span class="material-symbols-outlined">chat_bubble_outline</span>
                <span v-if="post.comment_count" class="action-count">{{ post.comment_count }}</span>
              </button>
              <button class="action-btn repost-btn" :class="{ active: post.is_reposted }" @click="handleRetweet(post)">
                <span class="material-symbols-outlined">repeat</span>
                <span v-if="post.repost_count" class="action-count">{{ post.repost_count }}</span>
              </button>
              <button class="action-btn like-btn" :class="{ active: post.is_liked }" @click="toggleLike(post)">
                <span class="material-symbols-outlined" :class="{ filled: post.is_liked }">favorite</span>
                <span v-if="post.like_count" class="action-count">{{ post.like_count }}</span>
              </button>
              <button class="action-btn bookmark-btn" :class="{ active: post.is_bookmarked }" @click="toggleBookmark(post)">
                <span class="material-symbols-outlined" :class="{ filled: post.is_bookmarked }">bookmark</span>
              </button>
              <button class="action-btn" @click="sharePost(post)">
                <span class="material-symbols-outlined">share</span>
              </button>
            </div>

            <!-- Comments Section -->
            <div v-if="post.showComments" class="post-comments">
              <div v-if="post.commentList?.length" class="comments-list">
                <div v-for="comment in post.commentList" :key="comment.id" class="comment-item">
                  <div class="comment-avatar">{{ getInitials(comment.author || comment.content) }}</div>
                  <div class="comment-body">
                    <div class="comment-header-line">
                      <span class="comment-author-name">{{ comment.author || 'User' }}</span>
                      <span class="comment-time">{{ comment.time || formatTime(comment.created_at) }}</span>
                    </div>
                    <p class="comment-text">{{ comment.content || comment.text }}</p>
                  </div>
                </div>
              </div>
              <p v-else class="no-comments">No comments yet. Be the first!</p>

              <!-- Comment Input -->
              <div class="comment-input-row">
                <div class="post-avatar-sm">{{ userInitials }}</div>
                <input 
                  v-model="newComments[post.id]" 
                  class="comment-input" 
                  placeholder="Write a comment..." 
                  @keyup.enter="submitComment(post, $event)"
                />
                <button
                  class="comment-send-btn"
                  :disabled="!newComments[post.id]?.trim()"
                  @click="submitComment(post, $event)"
                  title="Send comment"
                >
                  <span class="material-symbols-outlined">send</span>
                </button>
              </div>
            </div>
          </article>

          <!-- Loading indicator -->
          <div v-if="feedStore.loading" class="feed-loading">
            <span class="material-symbols-outlined spinning">progress_activity</span>
            <p>Loading posts...</p>
          </div>

          <!-- Empty state -->
          <div v-if="!feedStore.loading && posts.length === 0" class="feed-empty">
            <span class="material-symbols-outlined" style="font-size:3rem;color:var(--on-surface-variant)">dynamic_feed</span>
            <p>No posts yet. Be the first to share something!</p>
          </div>

          <!-- End of feed -->
          <div v-if="!feedStore.hasMore && posts.length > 0" class="feed-end">
            <p>You're all caught up!</p>
          </div>
        </div>
      </main>

      <!-- Right Sidebar -->
      <aside class="feed-right-sidebar">
        <!-- Trending Skills -->
        <div class="glass-card-static sidebar-card">
          <h3 class="sidebar-section-title">
            <span class="material-symbols-outlined" style="font-size:18px;color:var(--primary)">trending_up</span>
            Trending Skills
          </h3>
          <div class="trending-skills">
            <span v-for="skill in trendingSkills" :key="skill.name" class="skill-chip" :class="{ hot: skill.hot }">
              {{ skill.name }}
            </span>
          </div>
          <button class="btn-ghost" style="width:100%;justify-content:center;margin-top:1rem;font-size:0.8rem">
            View Market Report
          </button>
        </div>

        <!-- Top Developers -->
        <div class="glass-card-static sidebar-card">
          <h3 class="sidebar-section-title">Top Developers</h3>
          <div class="top-devs">
            <div v-for="dev in topDevs" :key="dev.name" class="top-dev-item">
              <div class="top-dev-info">
                <div class="top-dev-avatar">{{ dev.name[0] }}</div>
                <div>
                  <p class="top-dev-name">{{ dev.name }}</p>
                  <p class="top-dev-meta">{{ dev.projects }} projects</p>
                </div>
              </div>
              <button class="follow-btn">Follow</button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useFeedStore }  from '@/store/feed'
import http from '@/services/http'

const authStore = useAuthStore()
const feedStore = useFeedStore()
const { posts } = storeToRefs(feedStore)

// Use profile for display
const user = computed(() => authStore.profile || { full_name: authStore.user?.email || 'User', role: 'member' })

const router = typeof useRouter !== 'undefined' ? useRouter() : null

// Fetch feed on mount
onMounted(() => {
  if (authStore.isAuthenticated) {
    feedStore.fetchFeed(true)
  }

  // Infinite scroll
  window.addEventListener('scroll', handleScroll)
})

function handleScroll() {
  const scrollBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 500
  if (scrollBottom && feedStore.hasMore && !feedStore.loading) {
    feedStore.loadMore()
  }
}

function goToProfile(userId) {
  if (userId) window.location.href = `/developer/${userId}`
}

function toggleLike(post) {
  if (post.is_liked) {
    feedStore.unlikePost(post.id)
  } else {
    feedStore.likePost(post.id)
  }
}

function toggleBookmark(post) {
  if (!post.is_bookmarked) {
    feedStore.bookmarkPost(post.id)
  }
}

function sharePost(post) {
  const url = window.location.origin + '/feed'
  if (navigator.share) {
    navigator.share({ title: 'GFD Post', text: post.content, url })
  } else {
    navigator.clipboard.writeText(url)
  }
}

function switchFeedType(type) {
  feedStore.setFeedType(type)
}

function deletePost(postId) {
  feedStore.deletePost(postId)
  openMenuId.value = null
}

const showCompose = ref(false)
const newPost        = ref('')
const newComments    = ref({})
const composeMode    = ref('text')
const quotePost      = ref(null)
const imageInput     = ref(null)
const cameraInput    = ref(null)
const selectedImage  = ref(null)
const selectedImageFile = ref(null)

const reactionEmojis = [] // Removed — using Twitter-style actions now

const openMenuId = ref(null)

function togglePostMenu(postId) {
  openMenuId.value = openMenuId.value === postId ? null : postId
}

function handleRetweet(post) {
  feedStore.repostPost(post.id)
}

function handleQuote(post) {
  newPost.value = ''
  quotePost.value = post
  showCompose.value = true
  openMenuId.value = null
}

const userInitials = computed(() => {
  const name = user.value?.full_name || user.value?.name || 'U'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

function getInitials(name) {
  if (!name || typeof name !== 'string') return 'U'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diff = (now - date) / 1000

  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// Seed data is now in the store — no local posts array needed

const trendingSkills = []

const topDevs = []

function toggleReaction(post, emoji) {
  if (!post.reactions) post.reactions = {}
  if (!post.reactions[emoji]) post.reactions[emoji] = []

  const userId = authStore.user?.uid || 'current-user'
  const hasReacted = post.reactions[emoji].includes(userId)

  if (hasReacted) {
    post.reactions[emoji] = post.reactions[emoji].filter(id => id !== userId)
  } else {
    post.reactions[emoji].push(userId)
  }
}

function openImagePicker(source) {
  composeMode.value = 'photo'
  if (source === 'camera' && cameraInput.value) {
    cameraInput.value.click()
  } else if (imageInput.value) {
    imageInput.value.click()
  }
}

function handleImageChange(event) {
  const file = event.target.files?.[0]
  if (!file) return
  if (selectedImage.value) {
    URL.revokeObjectURL(selectedImage.value)
  }
  selectedImageFile.value = file
  selectedImage.value = URL.createObjectURL(file)
}

function clearSelectedImage() {
  if (selectedImage.value) {
    URL.revokeObjectURL(selectedImage.value)
  }
  selectedImage.value = null
  selectedImageFile.value = null
  if (imageInput.value) imageInput.value.value = ''
}

function closeCompose() {
  showCompose.value = false
  clearSelectedImage()
  composeMode.value = 'text'
  quotePost.value = null
}

async function submitPost() {
  if (!newPost.value.trim() && !selectedImage.value && !quotePost.value) return

  try {
    let mediaUrls = []

    // Upload image to Cloudinary if selected
    if (selectedImageFile.value) {
      try {
        const formData = new FormData()
        formData.append('file', selectedImageFile.value)
        const uploadResult = await http.post('/uploads/media', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        if (uploadResult.url) {
          mediaUrls.push(uploadResult.url)
        }
      } catch (uploadErr) {
        console.error('Image upload failed:', uploadErr)
      }
    }

    await feedStore.addPost({
      content: newPost.value,
      text: newPost.value,
      media_urls: mediaUrls,
      post_type: mediaUrls.length > 0 ? 'image' : 'text',
    })
  } catch {
    // Fallback — add locally
    const post = {
      id: 'local-' + Date.now(),
      author: { full_name: user.value?.full_name || 'You', avatar: user.value?.avatar, username: user.value?.username },
      content: newPost.value,
      like_count: 0,
      comment_count: 0,
      repost_count: 0,
      media_urls: selectedImage.value ? [selectedImage.value] : [],
      created_at: new Date().toISOString(),
    }
    feedStore.posts.unshift(post)
  }

  newPost.value = ''
  clearSelectedImage()
  composeMode.value = 'text'
  quotePost.value = null
  showCompose.value = false
}

function submitComment(post, e) {
  const text = newComments.value[post.id]?.trim()
  if (!text) return

  feedStore.commentOnPost(post.id, text)
  newComments.value[post.id] = ''
}
</script>

<style scoped>
.feed-view {
  background: var(--background);
  min-height: 100vh;
  padding-top: 0.5rem;
  padding-bottom: 2rem;
}

/* ── Layout: single col mobile → 3-col desktop ── */
.feed-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding: 0.75rem 0 2rem;
  /* No extra horizontal padding — container-gfd handles it */
}

@media (min-width: 1024px) {
  .feed-layout {
    grid-template-columns: 220px 1fr 240px;
    gap: 1.5rem;
    align-items: start;
    padding-top: 1rem;
  }
}

/* ── Sidebars: hidden on mobile ── */
.feed-sidebar,
.feed-right-sidebar { display: none; }

@media (min-width: 1024px) {
  .feed-sidebar,
  .feed-right-sidebar {
    display: block;
    position: sticky;
    top: 80px;
  }
}

.sidebar-card {
  padding: 1.25rem;
  border-radius: var(--radius-xl);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.sidebar-profile { display: flex; align-items: center; gap: 0.75rem; }

.sidebar-avatar {
  width: 48px; height: 48px;
  border-radius: var(--radius-full);
  background: var(--primary-fixed);
  color: var(--primary);
  font-family: var(--font-headline);
  font-size: 1rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.sidebar-avatar-img {
  width: 100%; height: 100%;
  object-fit: cover;
  border-radius: var(--radius-full);
}

.sidebar-name { font-family: var(--font-headline); font-size: 0.9rem; font-weight: 700; color: var(--on-surface); }
.sidebar-role { font-size: 0.75rem; color: var(--on-surface-variant); text-transform: capitalize; }

.sidebar-nav { display: flex; flex-direction: column; gap: 0.125rem; }

.sidebar-link {
  display: flex; align-items: center; gap: 0.625rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-lg);
  font-family: var(--font-headline); font-size: 0.875rem; font-weight: 500;
  color: var(--on-surface-variant); text-decoration: none;
  transition: all 0.15s ease;
}
.sidebar-link:hover, .sidebar-link.active { background: rgba(168,85,247,0.07); color: var(--primary); font-weight: 600; }
.sidebar-link .material-symbols-outlined { font-size: 20px; }

/* ── Feed Main ── */
.feed-main { display: flex; flex-direction: column; gap: 0.875rem; min-width: 0; }

/* ── Create Post ── */
.create-post {
  padding: 1rem;
  border-radius: var(--radius-xl);
}

.create-post-top {
  display: flex; align-items: center; gap: 0.75rem;
  margin-bottom: 0.875rem;
}

.post-avatar-sm {
  width: 36px; height: 36px;
  border-radius: var(--radius-full);
  background: var(--primary-fixed); color: var(--primary);
  font-family: var(--font-headline); font-size: 0.75rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.create-post-input {
  flex: 1; min-width: 0;
  padding: 0.5rem 0.875rem;
  background: var(--surface-container);
  border: none; border-radius: var(--radius-full);
  font-family: var(--font-body); font-size: 0.875rem;
  color: var(--on-surface-variant); text-align: left;
  cursor: pointer; transition: background 0.15s ease;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.create-post-input:hover { background: var(--surface-container-high); }

.create-post-actions {
  display: flex; gap: 0;
  padding-top: 0.625rem;
  border-top: 1px solid var(--outline-variant);
}

.post-action-type {
  flex: 1;
  display: flex; align-items: center; justify-content: center; gap: 0.3rem;
  padding: 0.4rem 0.5rem;
  background: none; border: none; border-radius: var(--radius-lg);
  font-family: var(--font-headline); font-size: 0.75rem; font-weight: 500;
  color: var(--on-surface-variant); cursor: pointer;
  transition: background 0.15s ease;
}
.post-action-type:hover { background: var(--surface-container); }
.post-action-type .material-symbols-outlined { font-size: 18px; }

/* ── Feed Posts ── */
.feed-posts { display: flex; flex-direction: column; gap: 0.875rem; }

.feed-post { padding: 0; overflow: hidden; }

/* Post Header */
.post-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  padding: 0.75rem 1rem 0;
}

.post-author-info { display: flex; align-items: center; gap: 0.5rem; min-width: 0; }

.post-avatar {
  width: 40px; height: 40px;
  border-radius: var(--radius-full);
  background: var(--surface-container); color: var(--primary);
  font-family: var(--font-headline); font-size: 0.875rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.post-avatar-img {
  width: 100%; height: 100%;
  object-fit: cover;
  border-radius: var(--radius-full);
}

.post-author-name {
  font-family: var(--font-headline); font-size: 0.875rem; font-weight: 700;
  color: var(--on-surface);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.post-author-line {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  flex-wrap: wrap;
}

.post-author-username {
  font-size: 0.8rem;
  color: var(--on-surface-variant);
  font-weight: 400;
}

.post-time-dot {
  font-size: 0.75rem;
  color: var(--on-surface-variant);
}

.post-time {
  font-size: 0.75rem;
  color: var(--on-surface-variant);
}

.post-meta { font-size: 0.7rem; color: var(--on-surface-variant); margin-top: 1px; }

/* Post Content */
.post-content { padding: 0.5rem 1rem 0.5rem 3.5rem; }

.post-text {
  font-size: 0.9rem; color: var(--on-surface); line-height: 1.65;
  margin-bottom: 0.75rem; word-break: break-word;
}

/* Image */
.post-image-wrap { border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 0.75rem; }

.post-image {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  border-radius: var(--radius-lg);
  max-height: 320px;
}

.post-image-caption {
  margin-top: 0.5rem;
  color: var(--on-surface-variant);
  font-size: 0.82rem;
}

.post-image-placeholder {
  height: 180px;
  background: var(--surface-container);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  border-radius: var(--radius-lg);
}

.compose-image-preview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.compose-image-preview img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: var(--radius-lg);
  border: 1px solid var(--outline-variant);
}

.remove-image-btn {
  min-width: auto;
  padding: 0.5rem 0.75rem;
}

.image-option {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.6rem 0.75rem;
  font-size: 0.82rem;
}

.hidden-file-input {
  display: none;
}

/* Code — scrollable on mobile */
.post-code-block {
  background: #111827;
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.code-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.5rem 0.875rem;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.code-filename {
  font-family: var(--font-mono); font-size: 0.7rem;
  color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.08em;
}

.code-content {
  padding: 0.875rem;
  font-family: var(--font-mono); font-size: 0.75rem;
  line-height: 1.6; color: #e2e8f0;
  overflow-x: auto; /* scroll horizontally on mobile */
  margin: 0; white-space: pre;
  -webkit-overflow-scrolling: touch;
}

/* Links */
.post-links { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.5rem; }

.post-link-btn {
  display: inline-flex; align-items: center; gap: 0.3rem;
  padding: 0.4rem 0.875rem;
  background: var(--primary); color: var(--on-primary);
  border-radius: var(--radius-lg);
  font-family: var(--font-headline); font-size: 0.75rem; font-weight: 600;
  text-decoration: none; transition: opacity 0.15s ease;
}
.post-link-btn:hover { opacity: 0.9; }
.post-link-btn:nth-child(2) {
  background: transparent; border: 1px solid var(--outline-variant); color: var(--on-surface-variant);
}
.post-link-btn:nth-child(2):hover { background: var(--surface-container); }

/* ── Twitter/X Style Actions Bar ── */
.post-actions-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  border-top: 1px solid var(--outline-variant);
  max-width: 400px;
}

.post-actions-bar .action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 0.6rem;
  background: none;
  border: none;
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--on-surface-variant);
  cursor: pointer;
  transition: all 0.15s ease;
}

.post-actions-bar .action-btn:hover {
  background: rgba(99,14,212,0.08);
  color: var(--primary);
}

.post-actions-bar .action-btn .material-symbols-outlined {
  font-size: 20px;
}

.post-actions-bar .action-count {
  font-size: 0.75rem;
}

.post-actions-bar .like-btn.active {
  color: #e91e63;
}
.post-actions-bar .like-btn:hover {
  background: rgba(233,30,99,0.08);
  color: #e91e63;
}

.post-actions-bar .repost-btn.active {
  color: #00c853;
}
.post-actions-bar .repost-btn:hover {
  background: rgba(0,200,83,0.08);
  color: #00c853;
}

.post-actions-bar .bookmark-btn.active {
  color: var(--primary);
}

.material-symbols-outlined.filled {
  font-variation-settings: 'FILL' 1;
}

/* ── Feed Tabs ── */
.feed-tabs {
  display: flex;
  border-bottom: 1px solid var(--outline-variant);
  margin-bottom: 0.5rem;
  background: var(--surface-container-lowest);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  overflow: hidden;
}

.feed-tab {
  flex: 1;
  padding: 0.875rem 1rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--on-surface-variant);
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: center;
}

.feed-tab:hover {
  background: rgba(99,14,212,0.04);
  color: var(--on-surface);
}

.feed-tab.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
}

/* ── Feed Loading / Empty / End ── */
.feed-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 2rem;
  color: var(--on-surface-variant);
  font-size: 0.875rem;
}

.feed-loading .spinning {
  font-size: 2rem;
  color: var(--primary);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.feed-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 3rem 1rem;
  text-align: center;
  color: var(--on-surface-variant);
  font-size: 0.9rem;
}

.feed-end {
  text-align: center;
  padding: 1.5rem;
  color: var(--on-surface-variant);
  font-size: 0.8rem;
  font-style: italic;
}

/* ── Post Media ── */
.post-media {
  margin-top: 0.75rem;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.post-media img {
  width: 100%;
  max-height: 500px;
  object-fit: cover;
  border-radius: var(--radius-lg);
  border: 1px solid var(--outline-variant);
}

/* ── Hashtags ── */
.post-hashtags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.5rem;
}

.hashtag {
  font-family: var(--font-headline);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--primary);
  cursor: pointer;
}
.hashtag:hover { text-decoration: underline; }

/* ── Post Author Clickable ── */
.post-author-info {
  cursor: pointer;
}
.post-author-info:hover .post-author-name {
  text-decoration: underline;
}
.emoji-btn.active .emoji-count { color: var(--primary); }

.post-actions {
  display: flex; gap: 0.875rem;
  flex-shrink: 0; /* always visible */
}

.action-btn {
  display: flex; align-items: center; gap: 0.25rem;
  background: none; border: none;
  font-family: var(--font-headline); font-size: 0.8rem; font-weight: 500;
  color: var(--on-surface-variant); cursor: pointer;
  transition: color 0.15s ease; padding: 0;
  white-space: nowrap;
}
.action-btn:hover { color: var(--primary); }
.action-btn .material-symbols-outlined { font-size: 18px; }

.retweet-btn.retweeted { color: #00ba7c; }
.retweet-btn.retweeted .material-symbols-outlined { color: #00ba7c; }
.retweet-btn:hover { color: #00ba7c; }

.repost-btn:hover { color: var(--primary); }

/* ── Reposted Label ── */
.reposted-label {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--on-surface-variant);
  margin-bottom: 0.4rem;
}

/* ── Quoted Post Embed ── */
.quoted-post-embed {
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-lg);
  padding: 0.75rem;
  background: var(--surface-container-low);
  margin-top: 0.5rem;
}

.quoted-author {
  font-family: var(--font-headline);
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--on-surface);
  margin-bottom: 0.25rem;
}

.quoted-text {
  font-size: 0.82rem;
  color: var(--on-surface-variant);
  line-height: 1.5;
}

.quoted-image {
  width: 100%;
  max-height: 150px;
  object-fit: cover;
  border-radius: var(--radius-md, 8px);
  margin-top: 0.5rem;
}

/* ── Compose Quote Preview ── */
.compose-quote-preview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.quote-card {
  flex: 1;
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-lg);
  padding: 0.6rem 0.75rem;
  background: var(--surface-container-low);
}

.quote-card .quote-author {
  font-family: var(--font-headline);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--on-surface);
  margin-bottom: 0.2rem;
}

.quote-card .quote-text {
  font-size: 0.78rem;
  color: var(--on-surface-variant);
  line-height: 1.4;
}

/* ── Comments ── */
.post-comments {
  padding: 1rem;
  border-top: 1px solid var(--outline-variant);
  background: var(--surface-container-low);
}

.comments-list { display: flex; flex-direction: column; gap: 0.875rem; margin-bottom: 0.875rem; }

.comment-item { display: flex; gap: 0.5rem; }

.comment-avatar {
  width: 28px; height: 28px;
  border-radius: var(--radius-full);
  background: var(--surface-container); color: var(--primary);
  font-family: var(--font-headline); font-size: 0.65rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.comment-body { flex: 1; min-width: 0; }

.comment-header-line {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.comment-author-name {
  font-family: var(--font-headline);
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--on-surface);
}

.comment-time { font-size: 0.68rem; color: var(--on-surface-variant); }

.comment-text {
  font-size: 0.84rem; color: var(--on-surface);
  margin-top: 0.15rem; line-height: 1.5; word-break: break-word;
}

.no-comments {
  font-size: 0.8rem;
  color: var(--on-surface-variant);
  text-align: center;
  padding: 0.5rem 0;
  font-style: italic;
}

.comment-content { flex: 1; min-width: 0; }

.comment-header { display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; }

.comment-author { font-family: var(--font-headline); font-size: 0.78rem; font-weight: 600; color: var(--on-surface); }

.comment-actions { display: flex; gap: 0.625rem; margin-top: 0.375rem; }

.comment-action {
  font-size: 0.72rem; color: var(--on-surface-variant);
  background: none; border: none; cursor: pointer;
  font-family: var(--font-headline); font-weight: 600;
  transition: color 0.15s ease; padding: 0;
}
.comment-action:hover { color: var(--primary); }

.comment-input-row { display: flex; align-items: center; gap: 0.625rem; }

.comment-input {
  flex: 1; min-width: 0;
  padding: 0.45rem 0.75rem;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-full);
  font-family: var(--font-body); font-size: 0.85rem;
  color: var(--on-surface); outline: none;
}
.comment-input:focus { border-color: var(--primary); }

.comment-send-btn {
  flex-shrink: 0;
  width: 34px; height: 34px;
  display: flex; align-items: center; justify-content: center;
  background: var(--primary); color: var(--on-primary);
  border: none; border-radius: var(--radius-full);
  cursor: pointer; transition: opacity 0.15s ease;
}
.comment-send-btn:hover:not(:disabled) { opacity: 0.85; }
.comment-send-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.comment-send-btn .material-symbols-outlined { font-size: 17px; }

.delete-post-btn { color: var(--on-surface-variant); }
.delete-post-btn:hover { color: #ef4444; background: rgba(239,68,68,0.08); }

/* ── Post Menu Dropdown ── */
.post-menu-wrap { position: relative; }

.post-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 100;
  min-width: 160px;
  padding: 0.4rem;
  background: var(--surface-container-high);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-lg);
  box-shadow: 0 8px 24px rgba(0,0,0,0.35);
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 0.75rem;
  background: none;
  border: none;
  border-radius: var(--radius-md, 8px);
  font-family: var(--font-headline);
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--on-surface);
  cursor: pointer;
  transition: background 0.12s ease;
  text-align: left;
  width: 100%;
}
.dropdown-item:hover { background: var(--surface-container); }
.dropdown-item .material-symbols-outlined { font-size: 18px; color: var(--on-surface-variant); }

.dropdown-item--danger { color: #ef4444; }
.dropdown-item--danger:hover { background: rgba(239,68,68,0.08); }
.dropdown-item--danger .material-symbols-outlined { color: #ef4444; }

/* Dropdown transition */
.dropdown-enter-active, .dropdown-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-4px) scale(0.95); }

/* ── Right Sidebar ── */
.sidebar-section-title {
  display: flex; align-items: center; gap: 0.4rem;
  font-family: var(--font-headline); font-size: 0.9rem; font-weight: 700;
  color: var(--on-surface); margin-bottom: 0.875rem;
}

.trending-skills { display: flex; flex-wrap: wrap; gap: 0.4rem; }

.skill-chip {
  padding: 0.25rem 0.625rem;
  background: var(--surface-container); border: 1px solid var(--outline-variant);
  border-radius: var(--radius-full);
  font-family: var(--font-headline); font-size: 0.75rem; font-weight: 500;
  color: var(--on-surface-variant); cursor: pointer; transition: all 0.15s ease;
}
.skill-chip.hot { background: rgba(168,85,247,0.08); border-color: rgba(168,85,247,0.2); color: var(--primary); }

.top-devs { display: flex; flex-direction: column; gap: 0.875rem; }

.top-dev-item { display: flex; align-items: center; justify-content: space-between; }
.top-dev-info { display: flex; align-items: center; gap: 0.625rem; }

.top-dev-avatar {
  width: 32px; height: 32px; border-radius: var(--radius-full);
  background: var(--surface-container); color: var(--primary);
  font-family: var(--font-headline); font-size: 0.75rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}

.top-dev-name { font-family: var(--font-headline); font-size: 0.875rem; font-weight: 600; color: var(--on-surface); }
.top-dev-meta { font-size: 0.7rem; color: var(--on-surface-variant); text-transform: uppercase; letter-spacing: 0.04em; }

.follow-btn {
  background: none; border: none;
  font-family: var(--font-headline); font-size: 0.8rem; font-weight: 700;
  color: var(--primary); cursor: pointer;
}
.follow-btn:hover { text-decoration: underline; }

/* ── Compose Modal ── */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.4); backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex; align-items: flex-end; /* bottom sheet on mobile */
  padding: 0;
}

@media (min-width: 640px) {
  .modal-overlay { align-items: center; padding: 1rem; }
}

.compose-modal {
  width: 100%;
  max-width: 560px;
  padding: 1.25rem;
  border-radius: var(--radius-2xl) var(--radius-2xl) 0 0;
}

@media (min-width: 640px) {
  .compose-modal { border-radius: var(--radius-2xl); }
}

.compose-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 1rem;
}

.compose-title { font-family: var(--font-headline); font-size: 1rem; font-weight: 700; color: var(--on-surface); }

.compose-body { display: flex; flex-direction: column; gap: 0.875rem; margin-bottom: 0.875rem; }
.compose-user { display: flex; align-items: center; gap: 0.75rem; }
.compose-name { font-family: var(--font-headline); font-size: 0.875rem; font-weight: 600; color: var(--on-surface); }

.compose-textarea {
  width: 100%; padding: 0.75rem;
  background: var(--surface-container-low);
  border: 1px solid var(--outline-variant); border-radius: var(--radius-lg);
  font-family: var(--font-body); font-size: 0.9375rem;
  color: var(--on-surface); resize: none; outline: none; line-height: 1.6;
}
.compose-textarea:focus { border-color: var(--primary); }

.compose-footer {
  display: flex; align-items: center; justify-content: space-between;
  padding-top: 0.75rem; border-top: 1px solid var(--outline-variant);
}

.compose-tools { display: flex; gap: 0.25rem; }
.icon-only { padding: 0.4rem; }

/* Modal transition */
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease, transform 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: translateY(20px); }
</style>
