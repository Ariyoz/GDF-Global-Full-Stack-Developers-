<template>
  <div class="feed-view">
    <div class="container-gfd feed-layout">

      <!-- Left Sidebar -->
      <aside class="feed-sidebar">
        <div class="glass-card-static sidebar-card">
          <div class="sidebar-profile">
            <div class="sidebar-avatar">{{ userInitials }}</div>
            <div>
              <p class="sidebar-name">{{ user?.name || 'Developer' }}</p>
              <p class="sidebar-role">{{ user?.role || 'Member' }}</p>
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
            <button class="post-action-type">
              <span class="material-symbols-outlined" style="color:var(--primary)">image</span>
              Photo
            </button>
            <button class="post-action-type">
              <span class="material-symbols-outlined" style="color:var(--primary)">code</span>
              Snippet
            </button>
            <button class="post-action-type">
              <span class="material-symbols-outlined" style="color:var(--primary)">videocam</span>
              Demo
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
                  <div class="post-avatar-sm">{{ userInitials }}</div>
                  <p class="compose-name">{{ user?.name || 'Developer' }}</p>
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
              <div class="compose-footer">
                <div class="compose-tools">
                  <button type="button" class="btn-ghost image-option" @click="openImagePicker('gallery')">
                    <span class="material-symbols-outlined">photo_library</span>
                    Photo
                  </button>
                  <button type="button" class="btn-ghost image-option" @click="selectSnippet">
                    <span class="material-symbols-outlined">code</span>
                    Snippet
                  </button>
                  <button type="button" class="btn-ghost image-option" @click="selectDemo">
                    <span class="material-symbols-outlined">videocam</span>
                    Demo
                  </button>
                  <input ref="imageInput" type="file" accept="image/*" class="hidden-file-input" @change="handleImageChange" />
                </div>
                <button class="btn-primary" :disabled="!newPost.trim() && !selectedImage" @click="submitPost">Post</button>
              </div>
            </div>
          </div>
        </Transition>

        <!-- Feed Posts -->
        <div class="feed-posts">
          <article
            v-for="post in posts"
            :key="post.id"
            class="feed-post glass-card animate-fade-in-up"
          >
            <!-- Post Header -->
            <div class="post-header">
              <div class="post-author-info">
                <div class="post-avatar">{{ post.author[0] }}</div>
                <div>
                  <p class="post-author-name">{{ post.author }}</p>
                  <p class="post-meta">{{ post.time }} · {{ post.category }}</p>
                </div>
              </div>
              <div class="post-menu-wrap">
                <button class="btn-ghost icon-only" @click="togglePostMenu(post.id)">
                  <span class="material-symbols-outlined">more_horiz</span>
                </button>
                <Transition name="dropdown">
                  <div v-if="openMenuId === post.id" class="post-dropdown">
                    <button class="dropdown-item" @click="handleRetweet(post)">
                      <span class="material-symbols-outlined">repeat</span>
                      Retweet
                    </button>
                    <button class="dropdown-item" @click="handleRepost(post)">
                      <span class="material-symbols-outlined">forward</span>
                      Repost
                    </button>
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
              <p class="post-text">{{ post.text }}</p>

              <!-- Image post -->
              <div v-if="post.type === 'image'" class="post-image-wrap">
                <img v-if="post.imageUrl" :src="post.imageUrl" alt="Post image" class="post-image" />
                <div v-else class="post-image-placeholder">
                  <span class="material-symbols-outlined" style="font-size:3rem;color:var(--outline)">image</span>
                  <p style="font-size:0.8rem;color:var(--on-surface-variant);margin-top:0.5rem">{{ post.imageCaption }}</p>
                </div>
                <p v-if="post.imageCaption" class="post-image-caption">{{ post.imageCaption }}</p>
              </div>

              <!-- Code post -->
              <div v-if="post.type === 'code'" class="post-code-block">
                <div class="code-header">
                  <span class="code-filename">{{ post.filename }}</span>
                  <button class="btn-ghost icon-only" style="padding:0.2rem">
                    <span class="material-symbols-outlined" style="font-size:16px">content_copy</span>
                  </button>
                </div>
                <pre class="code-content"><code>{{ post.code }}</code></pre>
              </div>

              <!-- Links -->
              <div v-if="post.links" class="post-links">
                <a
                  v-for="link in post.links"
                  :key="link.label"
                  :href="link.href || '#'"
                  class="post-link-btn"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span class="material-symbols-outlined" style="font-size:16px">{{ link.icon }}</span>
                  {{ link.label }}
                </a>
              </div>
            </div>

            <!-- Post Reactions Bar -->
            <div class="post-reactions-bar">
              <div class="reaction-emojis">
                <button
                  v-for="emoji in reactionEmojis"
                  :key="emoji"
                  class="emoji-btn"
                  :class="{ active: (post.reactions?.[emoji] || []).includes(authStore.user?.uid) }"
                  @click="toggleReaction(post, emoji)"
                  :title="emoji"
                >
                  <span class="emoji">{{ emoji }}</span>
                  <span v-if="post.reactions?.[emoji]?.length > 0" class="emoji-count">{{ post.reactions[emoji].length }}</span>
                </button>
              </div>
              <div class="post-actions">
                <button class="action-btn" @click="post.showComments = !post.showComments">
                  <span class="material-symbols-outlined">chat_bubble</span>
                  {{ post.commentList?.length || 0 }}
                </button>
                <button class="action-btn">
                  <span class="material-symbols-outlined">share</span>
                </button>
              </div>
            </div>

            <!-- Comments Section -->
            <div v-if="post.showComments" class="post-comments">
              <!-- Comments List -->
              <div v-if="post.commentList?.length" class="comments-list">
                <div v-for="comment in post.commentList" :key="comment.id" class="comment-item">
                  <div class="comment-avatar">{{ comment.author[0] }}</div>
                  <div class="comment-content">
                    <div class="comment-header">
                      <p class="comment-author">{{ comment.author }}</p>
                      <p class="comment-time">{{ comment.time }}</p>
                    </div>
                    <p class="comment-text">{{ comment.text }}</p>
                    <div class="comment-actions">
                      <button class="comment-action">Like</button>
                      <button class="comment-action">Reply</button>
                    </div>
                  </div>
                </div>
              </div>

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
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/store/auth'
import { useFeedStore }  from '@/store/feed'

const authStore = useAuthStore()
const feedStore = useFeedStore()
const { user }  = storeToRefs(authStore)
const { posts } = storeToRefs(feedStore)

function deletePost(postId) {
  feedStore.deletePost(postId)
  openMenuId.value = null
}

const showCompose = ref(false)
const newPost        = ref('')
const newComments    = ref({})
const composeMode    = ref('text')
const imageInput     = ref(null)
const selectedImage  = ref(null)
const selectedImageFile = ref(null)

const reactionEmojis = ['👍', '❤️', '🔥', '🚀', '🎉']

const openMenuId = ref(null)

function togglePostMenu(postId) {
  openMenuId.value = openMenuId.value === postId ? null : postId
}

function handleRetweet(post) {
  const retweet = {
    id: Date.now(),
    author: user.value?.name || 'You',
    time: 'Just now',
    category: user.value?.role || 'Developer',
    text: `🔁 Retweeted from ${post.author}: "${post.text}"`,
    type: 'text',
    reactions: {},
    commentList: [],
    showComments: false,
  }
  feedStore.addPost(retweet)
  openMenuId.value = null
}

function handleRepost(post) {
  const repost = {
    id: Date.now(),
    author: user.value?.name || 'You',
    time: 'Just now',
    category: user.value?.role || 'Developer',
    text: post.text,
    type: post.type,
    imageUrl: post.imageUrl,
    imageCaption: post.imageCaption,
    code: post.code,
    filename: post.filename,
    links: post.links,
    reactions: {},
    commentList: [],
    showComments: false,
  }
  feedStore.addPost(repost)
  openMenuId.value = null
}

const userInitials = computed(() => {
  const name = user.value?.name || 'GFD'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

// Seed data is now in the store — no local posts array needed

const trendingSkills = [
  { name: 'Rust', hot: true },
  { name: 'WebAssembly', hot: false },
  { name: 'Go', hot: false },
  { name: 'Solidity', hot: true },
  { name: 'Kubernetes', hot: false },
  { name: 'Tailwind', hot: false },
]

const topDevs = [
  { name: 'Marcus Burn', projects: 324 },
  { name: 'Lina Low',    projects: 189 },
  { name: 'Ray Vance',   projects: 412 },
]

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

function openImagePicker() {
  if (!imageInput.value) return
  composeMode.value = 'photo'
  imageInput.value.click()
}

function selectSnippet() {
  composeMode.value = 'snippet'
  if (!newPost.value.trim()) {
    newPost.value = 'const example = "Your code snippet here"\nconsole.log(example);'
  }
}

function selectDemo() {
  composeMode.value = 'demo'
  if (!newPost.value.trim()) {
    newPost.value = 'https://your-demo-link.com'
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
}

function submitPost() {
  if (!newPost.value.trim() && !selectedImage.value) return
  const post = {
    id:          Date.now(),
    author:      user.value?.name || 'You',
    time:        'Just now',
    category:    user.value?.role || 'Developer',
    text:        newPost.value,
    reactions:   {},
    commentList: [],
    showComments: false,
  }

  if (selectedImage.value) {
    post.type = 'image'
    post.imageUrl = selectedImage.value
    post.imageCaption = newPost.value.trim() || 'Shared an update with an image.'
  } else if (composeMode.value === 'snippet') {
    post.type = 'code'
    post.filename = 'snippet.js'
    post.code = newPost.value
  } else if (composeMode.value === 'demo') {
    post.type = 'text'
    post.links = [
      {
        label: 'Live Demo',
        icon: 'videocam',
        href: newPost.value.trim() || '#',
      },
    ]
  } else {
    post.type = 'text'
  }

  feedStore.addPost(post)
  newPost.value = ''
  clearSelectedImage()
  composeMode.value = 'text'
  showCompose.value = false
}

function submitComment(post, e) {
  const text = newComments.value[post.id]?.trim()
  if (!text) return

  if (!post.commentList) post.commentList = []

  post.commentList.push({
    id:     Date.now(),
    author: user.value?.name || 'You',
    time:   'Just now',
    text,
  })

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
  padding: 1rem 1rem 0;
}

.post-author-info { display: flex; align-items: center; gap: 0.625rem; min-width: 0; }

.post-avatar {
  width: 38px; height: 38px;
  border-radius: var(--radius-full);
  background: var(--surface-container); color: var(--primary);
  font-family: var(--font-headline); font-size: 0.875rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.post-author-name {
  font-family: var(--font-headline); font-size: 0.875rem; font-weight: 700;
  color: var(--on-surface);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.post-meta { font-size: 0.7rem; color: var(--on-surface-variant); margin-top: 1px; }

/* Post Content */
.post-content { padding: 0.75rem 1rem; }

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

/* ── Reactions Bar — mobile-first ── */
.post-reactions-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-top: 1px solid var(--outline-variant);
  background: var(--surface-container-lowest);
  flex-wrap: nowrap;
  overflow: hidden;
}

.reaction-emojis {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  overflow-x: auto;
  scrollbar-width: none;
  flex-shrink: 1;
  min-width: 0;
  -webkit-overflow-scrolling: touch;
}
.reaction-emojis::-webkit-scrollbar { display: none; }

.emoji-btn {
  display: inline-flex; align-items: center; gap: 0.2rem;
  padding: 0.3rem 0.5rem;
  background: var(--surface-container);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-full);
  cursor: pointer; transition: all 0.15s ease;
  flex-shrink: 0; /* don't shrink — scroll instead */
  white-space: nowrap;
}
.emoji-btn:hover { background: var(--primary); border-color: var(--primary); }
.emoji-btn.active { background: var(--primary-fixed); border-color: var(--primary); }

.emoji { font-size: 0.9rem; line-height: 1; }

.emoji-count {
  font-family: var(--font-headline); font-size: 0.65rem; font-weight: 600;
  color: var(--on-surface-variant);
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

/* ── Comments ── */
.post-comments {
  padding: 1rem;
  border-top: 1px solid var(--outline-variant);
  background: var(--surface-container-low);
}

.comments-list { display: flex; flex-direction: column; gap: 0.875rem; margin-bottom: 0.875rem; }

.comment-item { display: flex; gap: 0.625rem; }

.comment-avatar {
  width: 30px; height: 30px;
  border-radius: var(--radius-full);
  background: var(--surface-container); color: var(--primary);
  font-family: var(--font-headline); font-size: 0.7rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.comment-content { flex: 1; min-width: 0; }

.comment-header { display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; }

.comment-author { font-family: var(--font-headline); font-size: 0.78rem; font-weight: 600; color: var(--on-surface); }
.comment-time   { font-size: 0.7rem; color: var(--on-surface-variant); }

.comment-text {
  font-size: 0.85rem; color: var(--on-surface);
  margin-top: 0.2rem; line-height: 1.5; word-break: break-word;
}

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
