<template>
  <div class="profile-view">
    <!-- Banner (X/Twitter style) -->
    <div class="profile-banner" @click="isOwnProfile && triggerBannerUpload()">
      <img v-if="dev.banner" :src="dev.banner" alt="Banner" class="banner-img" />
      <div v-else class="banner-bg" />
      <input v-if="isOwnProfile" ref="bannerInput" type="file" accept="image/*" class="hidden-input" @change="handleBannerUpload" />
    </div>

    <!-- Profile Header (X/Twitter style) -->
    <div class="container-gfd profile-header-wrap">
      <!-- Avatar overlapping banner -->
      <div class="profile-avatar-section">
        <div class="profile-avatar" @click="isOwnProfile && triggerAvatarUpload()">
          <img v-if="dev.avatar" :src="dev.avatar" :alt="dev.name" class="profile-avatar-img" />
          <span v-else class="avatar-initials">{{ initials(dev.name) }}</span>
          <div v-if="isOwnProfile" class="avatar-edit-overlay">
            <span class="material-symbols-outlined">photo_camera</span>
          </div>
        </div>
        <input v-if="isOwnProfile" ref="avatarInputProfile" type="file" accept="image/*" class="hidden-input" @change="handleAvatarUploadProfile" />

        <!-- Action buttons (right side) -->
        <div class="profile-header-actions">
          <button v-if="isOwnProfile" class="btn-edit-profile" @click="$router.push('/dashboard/profile')">
            Edit profile
          </button>
          <template v-else>
            <button class="btn-follow" :class="{ following: isFollowing }" @click="toggleFollow">
              {{ isFollowing ? 'Following' : 'Follow' }}
            </button>
            <button class="btn-outline btn-sm" @click="startMessage">
              <span class="material-symbols-outlined" style="font-size:18px;">mail</span>
            </button>
          </template>
        </div>
      </div>

      <!-- Name, username, bio -->
      <div class="profile-info">
        <h1 class="profile-name">
          {{ dev.name }}
          <span v-if="dev.verified" class="material-symbols-outlined verified-icon" style="font-variation-settings:'FILL' 1;">verified</span>
        </h1>
        <p class="profile-username">@{{ dev.username }}</p>
        <p v-if="dev.bio" class="profile-bio">{{ dev.bio }}</p>

        <!-- Meta row (location, website, join date) -->
        <div class="profile-meta-row">
          <span v-if="dev.location" class="meta-item">
            <span class="material-symbols-outlined" style="font-size:16px;">location_on</span>
            {{ dev.location }}
          </span>
          <span v-if="dev.website" class="meta-item">
            <span class="material-symbols-outlined" style="font-size:16px;">link</span>
            <a :href="dev.website" target="_blank" class="meta-link">{{ dev.website.replace('https://', '') }}</a>
          </span>
          <span v-if="dev.github" class="meta-item">
            <span class="material-symbols-outlined" style="font-size:16px;">code</span>
            <a :href="dev.github" target="_blank" class="meta-link">GitHub</a>
          </span>
        </div>

        <!-- Followers/Following -->
        <div class="profile-follow-row">
          <span class="follow-stat"><strong>{{ dev.following_count || 0 }}</strong> Following</span>
          <span class="follow-stat"><strong>{{ followerCount }}</strong> Followers</span>
        </div>

        <!-- Skills -->
        <div v-if="dev.skills && dev.skills.length" class="profile-skills">
          <span v-for="skill in dev.skills" :key="skill" class="skill-chip">{{ skill }}</span>
        </div>
      </div>

      <!-- Profile Tabs -->
      <div class="profile-tabs">
        <button class="profile-tab" :class="{ active: activeTab === 'posts' }" @click="activeTab = 'posts'">Posts</button>
        <button class="profile-tab" :class="{ active: activeTab === 'media' }" @click="activeTab = 'media'">Media</button>
        <button class="profile-tab" :class="{ active: activeTab === 'likes' }" @click="activeTab = 'likes'">Likes</button>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="container-gfd profile-content">
      <!-- Posts Tab -->
      <div v-if="activeTab === 'posts'" class="tab-content">
        <div v-if="userPosts.length" class="user-posts-list">
          <div v-for="post in userPosts" :key="post.id" class="user-post-item">
            <div class="post-header-mini">
              <div class="post-avatar-mini">
                <img v-if="dev.avatar" :src="dev.avatar" :alt="dev.name" class="post-avatar-img" />
                <span v-else>{{ initials(dev.name) }}</span>
              </div>
              <div>
                <span class="post-author-name">{{ dev.name }}</span>
                <span class="post-username-mini">@{{ dev.username }} · {{ formatTime(post.created_at) }}</span>
              </div>
            </div>
            <p v-if="post.content" class="post-text-content">{{ post.content }}</p>
            <div v-if="post.media_urls && post.media_urls.length && post.media_urls[0]" class="post-media-grid">
              <img v-for="(url, idx) in post.media_urls.filter(u => u)" :key="idx" :src="url" alt="Post media" class="post-media-img" />
            </div>
            <div class="post-stats-mini">
              <span>💬 {{ post.comment_count || 0 }}</span>
              <span>🔁 {{ post.repost_count || 0 }}</span>
              <span>❤️ {{ post.like_count || 0 }}</span>
              <span>📊 {{ (post.like_count || 0) + (post.comment_count || 0) }}</span>
            </div>
          </div>
        </div>
        <div v-else class="no-posts">
          <span class="material-symbols-outlined" style="font-size:2.5rem;color:var(--on-surface-variant)">article</span>
          <p style="margin-top:0.5rem;color:var(--on-surface-variant)">No posts yet</p>
        </div>
      </div>

      <!-- Media Tab -->
      <div v-if="activeTab === 'media'" class="tab-content">
        <div v-if="userPosts.filter(p => p.media_urls?.length).length" class="media-grid">
          <template v-for="post in userPosts" :key="post.id">
            <img v-for="(url, idx) in (post.media_urls || []).filter(u => u)" :key="idx" :src="url" alt="Media" class="media-grid-img" />
          </template>
        </div>
        <div v-else class="no-posts">
          <span class="material-symbols-outlined" style="font-size:2.5rem;color:var(--on-surface-variant)">image</span>
          <p style="margin-top:0.5rem;color:var(--on-surface-variant)">No media yet</p>
        </div>
      </div>

      <!-- Likes Tab -->
      <div v-if="activeTab === 'likes'" class="tab-content">
        <div class="no-posts">
          <span class="material-symbols-outlined" style="font-size:2.5rem;color:var(--on-surface-variant)">favorite</span>
          <p style="margin-top:0.5rem;color:var(--on-surface-variant)">Liked posts will appear here</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDevelopersStore } from '@/store/developers'
import { useAuthStore } from '@/store/auth'
import { messagingService } from '@/services/messaging.service'
import { profilesService } from '@/services/profiles.service'
import http from '@/services/http'

const route    = useRoute()
const router   = useRouter()
const devStore = useDevelopersStore()
const authStore = useAuthStore()

const isFollowing = ref(false)
const followerCount = ref(0)
const portfolioItems = ref([])
const portfolioLink = ref('')
const activeTab = ref('posts')
const bannerInput = ref(null)
const avatarInputProfile = ref(null)

// Load follow state from localStorage
function loadFollowState() {
  try {
    const stored = localStorage.getItem('gfd_following_' + route.params.id)
    if (stored === 'true') {
      isFollowing.value = true
      followerCount.value = 1
    }
  } catch { /* ignore */ }
}
loadFollowState()

// Load saved portfolio items from localStorage
function loadPortfolio() {
  try {
    const stored = localStorage.getItem('gfd_portfolio_' + route.params.id)
    if (stored) portfolioItems.value = JSON.parse(stored)
  } catch { /* ignore */ }
}
loadPortfolio()

function savePortfolio() {
  localStorage.setItem('gfd_portfolio_' + route.params.id, JSON.stringify(portfolioItems.value))
}

// Check if this is the logged-in user's own profile
const isOwnProfile = computed(() => {
  return authStore.profile?.id === route.params.id
})

function toggleFollow() {
  if (isFollowing.value) {
    profilesService.unfollow(route.params.id).catch(() => {})
    isFollowing.value = false
    followerCount.value = Math.max(followerCount.value - 1, 0)
  } else {
    profilesService.follow(route.params.id).catch(() => {})
    isFollowing.value = true
    followerCount.value++
  }
  localStorage.setItem('gfd_following_' + route.params.id, isFollowing.value.toString())
}

async function startMessage() {
  try {
    const conv = await messagingService.startConversation(authStore.user?.id, route.params.id)
    router.push('/messaging')
  } catch {
    router.push('/messaging')
  }
}

function triggerBannerUpload() {
  bannerInput.value?.click()
}

function triggerAvatarUpload() {
  avatarInputProfile.value?.click()
}

async function handleBannerUpload(e) {
  const file = e.target.files?.[0]
  if (!file) return
  try {
    const formData = new FormData()
    formData.append('file', file)
    const data = await http.post('/uploads/banner', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    if (data.url && profileData.value) profileData.value.banner = data.url
  } catch { /* ignore */ }
}

async function handleAvatarUploadProfile(e) {
  const file = e.target.files?.[0]
  if (!file) return
  try {
    await authStore.uploadAvatar(file)
    if (profileData.value) profileData.value.avatar = authStore.profile?.avatar
  } catch { /* ignore */ }
}

function handleFileUpload(e) {
  const file = e.target.files?.[0]
  if (!file) return
  const isImage = file.type.startsWith('image/')
  const url = URL.createObjectURL(file)
  portfolioItems.value.push({
    id: 'pf-' + Date.now(),
    name: file.name,
    type: isImage ? 'image' : 'pdf',
    url,
  })
  savePortfolio()
  e.target.value = ''
}

function addPortfolioLink() {
  const link = portfolioLink.value.trim()
  if (!link) return
  // Basic URL validation
  const url = link.startsWith('http') ? link : 'https://' + link
  portfolioItems.value.push({
    id: 'pf-' + Date.now(),
    name: new URL(url).hostname.replace('www.', ''),
    type: 'link',
    url,
  })
  savePortfolio()
  portfolioLink.value = ''
}

function removePortfolioItem(id) {
  portfolioItems.value = portfolioItems.value.filter(i => i.id !== id)
  savePortfolio()
}

// Load the developer profile from the backend API
const profileData = ref(null)
const userPosts = ref([])
const loadingProfile = ref(true)

async function loadProfile() {
  loadingProfile.value = true
  const profileId = route.params.id

  try {
    // Fetch user profile from backend
    const data = await http.get(`/users/${profileId}`)
    profileData.value = data

    // Update follower count from backend
    followerCount.value = data.follower_count || 0

    // Check if we're following this user
    isFollowing.value = data.is_following || false

    // Fetch user's posts
    try {
      const feedData = await http.get(`/feed?feed_type=user&user_id=${profileId}&limit=20`)
      userPosts.value = feedData.posts || []
    } catch { userPosts.value = [] }
  } catch (err) {
    console.error('Failed to load profile:', err)
  } finally {
    loadingProfile.value = false
  }
}

// Load on mount
import { onMounted } from 'vue'
onMounted(() => {
  loadProfile()
})

const dev = computed(() => {
  const profileId = route.params.id

  // If we fetched from backend, use that
  if (profileData.value) {
    const p = profileData.value
    return {
      id: p.id,
      name: p.full_name || p.username || 'User',
      username: p.username || '',
      avatar: p.avatar || '',
      banner: p.banner || '',
      role: p.experience_level || p.role || 'Developer',
      location: p.location || '',
      bio: p.bio || '',
      skills: Array.isArray(p.skills) ? p.skills : [],
      tech_stack: Array.isArray(p.tech_stack) ? p.tech_stack : [],
      github: p.github_url || '',
      linkedin: p.linkedin_url || '',
      website: p.portfolio_url || p.website_url || '',
      available: p.available_for_hire !== false,
      verified: p.is_verified || false,
      hourly_rate: p.hourly_rate,
      experience_level: p.experience_level || '',
      follower_count: p.follower_count || 0,
      following_count: p.following_count || 0,
      post_count: p.post_count || 0,
      experience: [],
      projects: [],
      activity: [],
    }
  }

  // If viewing own profile, use auth store data
  if (authStore.profile && authStore.profile.id === profileId) {
    const p = authStore.profile
    return {
      id: p.id,
      name: p.full_name || 'User',
      username: p.username || '',
      avatar: p.avatar || '',
      role: p.experience_level || p.role || 'Developer',
      location: p.location || '',
      bio: p.bio || '',
      skills: Array.isArray(p.skills) ? p.skills : [],
      tech_stack: [],
      github: p.github_url || '',
      linkedin: '',
      website: p.portfolio_url || '',
      available: true,
      verified: true,
      experience: [],
      projects: [],
      activity: [],
    }
  }

  // Loading state
  return {
    id: profileId || '',
    name: 'Loading...',
    username: '',
    avatar: '',
    role: '',
    location: '',
    bio: '',
    skills: [],
    tech_stack: [],
    github: '',
    linkedin: '',
    website: '',
    available: false,
    verified: false,
    experience: [],
    projects: [],
    activity: [],
  }
})

const profileStats = computed(() => [
  { value: followerCount.value, label: 'Followers' },
  { value: dev.value.following_count || 0, label: 'Following' },
  { value: dev.value.post_count || userPosts.value.length || 0, label: 'Posts' },
  { value: dev.value.available ? 'Yes' : 'No', label: 'Available' },
])

function initials(name) {
  if (!name || typeof name !== 'string') return 'U'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diff = (now - date) / 1000
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>

<style scoped>
.profile-view { background: var(--background); min-height: 100vh; }

/* Banner (X style) */
.profile-banner {
  height: 200px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

@media (min-width: 768px) { .profile-banner { height: 250px; } }

.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #1a0840 0%, #2a1060 40%, #630ed4 100%);
}

.hidden-input { display: none; }

/* Profile Header */
.profile-header-wrap { position: relative; z-index: 1; }

.profile-avatar-section {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-top: -40px;
  padding: 0 0.5rem;
}

.profile-avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 4px solid var(--background);
  background: var(--primary-fixed);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  cursor: pointer;
}

@media (min-width: 768px) {
  .profile-avatar { width: 120px; height: 120px; margin-top: -50px; }
}

.profile-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  font-family: var(--font-headline);
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary);
}

.avatar-edit-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  opacity: 0;
  transition: opacity 0.2s;
  border-radius: 50%;
}
.profile-avatar:hover .avatar-edit-overlay { opacity: 1; }

.profile-header-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-top: 0.75rem;
}

.btn-edit-profile {
  padding: 0.5rem 1.25rem;
  border: 1.5px solid var(--outline-variant);
  border-radius: var(--radius-full);
  background: transparent;
  font-family: var(--font-headline);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--on-surface);
  cursor: pointer;
  transition: var(--transition-fast);
}
.btn-edit-profile:hover { background: var(--surface-container); }

.btn-sm {
  padding: 0.4rem 0.6rem;
  border-radius: var(--radius-full);
}

/* Profile Info */
.profile-info {
  padding: 0.75rem 0.5rem 0;
}

.profile-name {
  font-family: var(--font-headline);
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--on-surface);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.verified-icon { font-size: 20px; color: var(--primary); }

.profile-username {
  font-size: 0.875rem;
  color: var(--on-surface-variant);
  margin-top: 0.1rem;
}

.profile-bio {
  font-size: 0.9rem;
  color: var(--on-surface);
  line-height: 1.5;
  margin-top: 0.75rem;
}

.profile-meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.8rem;
  color: var(--on-surface-variant);
}

.meta-link {
  color: var(--primary);
  text-decoration: none;
}
.meta-link:hover { text-decoration: underline; }

.profile-follow-row {
  display: flex;
  gap: 1.25rem;
  margin-top: 0.75rem;
}

.follow-stat {
  font-size: 0.85rem;
  color: var(--on-surface-variant);
}
.follow-stat strong {
  color: var(--on-surface);
  font-weight: 700;
}

.profile-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 0.75rem;
}

.skill-chip {
  padding: 0.2rem 0.6rem;
  background: rgba(99,14,212,0.1);
  border: 1px solid rgba(99,14,212,0.2);
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--primary);
}

/* Profile Tabs */
.profile-tabs {
  display: flex;
  border-bottom: 1px solid var(--outline-variant);
  margin-top: 1rem;
  overflow-x: auto;
}

.profile-tab {
  flex: 1;
  padding: 0.875rem 1rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  font-family: var(--font-headline);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--on-surface-variant);
  cursor: pointer;
  transition: all 0.15s;
  text-align: center;
  white-space: nowrap;
}
.profile-tab:hover { background: rgba(99,14,212,0.04); }
.profile-tab.active { color: var(--on-surface); border-bottom-color: var(--primary); }

/* Tab Content */
.profile-content { padding: 0 0.5rem; }

.tab-content { padding: 0.5rem 0; }

.user-posts-list { display: flex; flex-direction: column; }

.user-post-item {
  padding: 1rem 0;
  border-bottom: 1px solid var(--outline-variant);
}

.post-header-mini { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem; }

.post-avatar-mini {
  width: 32px; height: 32px; border-radius: 50%;
  background: var(--primary-fixed); color: var(--primary);
  font-size: 0.7rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden; flex-shrink: 0;
}
.post-avatar-mini .post-avatar-img { width: 100%; height: 100%; object-fit: cover; }

.post-author-name { font-family: var(--font-headline); font-size: 0.85rem; font-weight: 700; color: var(--on-surface); }
.post-username-mini { font-size: 0.78rem; color: var(--on-surface-variant); margin-left: 0.3rem; }

.post-text-content { font-size: 0.9rem; color: var(--on-surface); line-height: 1.5; margin: 0.25rem 0; }

.post-media-grid { margin-top: 0.5rem; border-radius: var(--radius-lg); overflow: hidden; }
.post-media-img { width: 100%; max-height: 400px; object-fit: cover; border-radius: var(--radius-lg); border: 1px solid var(--outline-variant); }

.post-stats-mini { display: flex; gap: 1.25rem; margin-top: 0.5rem; font-size: 0.78rem; color: var(--on-surface-variant); }

.no-posts { display: flex; flex-direction: column; align-items: center; padding: 3rem; text-align: center; }

/* Media Grid */
.media-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.25rem;
}
.media-grid-img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 4px;
}

.btn-follow {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.625rem 1.25rem;
  background: var(--surface-container-lowest);
  border: 1.5px solid var(--primary);
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--primary);
  cursor: pointer;
  transition: var(--transition-fast);
}
.btn-follow:hover {
  background: rgba(99,14,212,0.08);
}
.btn-follow.following {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}
.btn-follow.following:hover {
  background: rgba(99,14,212,0.85);
}

/* Body */
.profile-body {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  padding-top: 0;
  padding-bottom: var(--space-lg);
}

@media (min-width: 1024px) {
  .profile-body { grid-template-columns: 320px 1fr; }
}

/* Aside */
.profile-aside { display: flex; flex-direction: column; gap: 1rem; }

.aside-card { padding: 1.5rem; border-radius: var(--radius-xl); }

.aside-title {
  font-family: var(--font-headline);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--on-surface);
  margin-bottom: 1rem;
}

.skills-wrap { display: flex; flex-wrap: wrap; gap: 0.5rem; }

.exp-list { display: flex; flex-direction: column; gap: 1.25rem; }

.exp-item { display: flex; gap: 0.875rem; }

.exp-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-lg);
  background: var(--surface-container);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.exp-icon { font-size: 20px; color: var(--primary); }

.exp-title { font-family: var(--font-headline); font-size: 0.875rem; font-weight: 700; color: var(--on-surface); }
.exp-company { font-size: 0.8rem; color: var(--on-surface-variant); margin-top: 0.1rem; }
.exp-desc { font-size: 0.8rem; color: var(--on-surface-variant); margin-top: 0.35rem; line-height: 1.5; }

.stats-card {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  padding: 1.25rem;
}

.pstat { text-align: center; }
.pstat-value { font-family: var(--font-headline); font-size: 1.25rem; font-weight: 700; color: var(--primary); }
.pstat-label { font-size: 0.75rem; color: var(--on-surface-variant); margin-top: 0.15rem; }

/* Main */
.profile-main { display: flex; flex-direction: column; gap: 1rem; }

.main-card { padding: 1.5rem; border-radius: var(--radius-xl); }

.main-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.view-all-link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--primary);
  text-decoration: none;
}

/* Portfolio */
.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.portfolio-card { cursor: pointer; }

.portfolio-thumb {
  aspect-ratio: 16/9;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  margin-bottom: 0.625rem;
}

.portfolio-icon { font-size: 2.5rem; color: rgba(255,255,255,0.8); }

.portfolio-hover {
  position: absolute;
  inset: 0;
  background: rgba(99,14,212,0.0);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: var(--transition-base);
}

.portfolio-card:hover .portfolio-hover {
  background: rgba(99,14,212,0.25);
  opacity: 1;
}

.portfolio-hover-btn {
  padding: 0.5rem 1rem;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-lg);
  font-family: var(--font-headline);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--primary);
  box-shadow: var(--shadow-md);
}

.portfolio-name { font-family: var(--font-headline); font-size: 0.875rem; font-weight: 700; color: var(--on-surface); }
.portfolio-desc { font-size: 0.8rem; color: var(--on-surface-variant); margin-top: 0.2rem; }

/* Activity */
.activity-list { display: flex; flex-direction: column; gap: 1.5rem; }

.activity-post {
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--outline-variant);
}
.activity-post:last-child { border-bottom: none; padding-bottom: 0; }

.post-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.875rem; }

.post-avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background: var(--primary-fixed);
  color: var(--primary);
  font-family: var(--font-headline);
  font-size: 0.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.post-author { font-family: var(--font-headline); font-size: 0.875rem; font-weight: 700; color: var(--on-surface); }
.post-time   { font-size: 0.75rem; color: var(--on-surface-variant); }

.post-text { font-size: 1rem; color: var(--on-surface-variant); line-height: 1.6; margin-bottom: 0.875rem; }

.post-actions { display: flex; gap: 1.25rem; }

.post-action-btn {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background: none;
  border: none;
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--on-surface-variant);
  cursor: pointer;
  transition: var(--transition-fast);
  padding: 0;
}
.post-action-btn:hover { color: var(--primary); }

/* ── User Posts on Profile ── */
.user-posts-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.user-post-item {
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--outline-variant);
}
.user-post-item:last-child { border-bottom: none; padding-bottom: 0; }

.post-header-mini {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 0.5rem;
}

.post-avatar-mini {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background: var(--primary-fixed);
  color: var(--primary);
  font-family: var(--font-headline);
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.post-avatar-mini .post-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-meta-mini {
  font-size: 0.75rem;
  color: var(--on-surface-variant);
}

.post-text-content {
  font-size: 0.9rem;
  color: var(--on-surface);
  line-height: 1.5;
  margin-bottom: 0.5rem;
}

.post-media-grid {
  margin-top: 0.5rem;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.post-media-img {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: var(--radius-lg);
  border: 1px solid var(--outline-variant);
}

.post-stats-mini {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: var(--on-surface-variant);
}

.no-posts {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  text-align: center;
}

/* Portfolio Upload */
.portfolio-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 2rem;
  text-align: center;
  color: var(--on-surface-variant);
  font-size: 0.875rem;
}

.portfolio-thumb--link,
.portfolio-thumb--file {
  background: linear-gradient(135deg, #1a0840, #2a1060);
  text-decoration: none;
}

.portfolio-thumb--img {
  background: var(--surface-container);
  position: relative;
  overflow: hidden;
}

.portfolio-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  inset: 0;
}

.portfolio-card {
  position: relative;
}

.portfolio-remove {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  background: rgba(0,0,0,0.6);
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.15s ease;
}
.portfolio-card:hover .portfolio-remove { opacity: 1; }

.portfolio-upload-section {
  margin-top: 1.5rem;
}

.upload-divider {
  height: 1px;
  background: var(--outline-variant);
  margin-bottom: 1.25rem;
}

.upload-title {
  font-family: var(--font-headline);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--on-surface);
  margin-bottom: 1rem;
}

.upload-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.upload-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.625rem 1.25rem;
  background: var(--surface-container-lowest);
  border: 1.5px dashed var(--outline-variant);
  border-radius: var(--radius-lg);
  font-family: var(--font-headline);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--on-surface-variant);
  cursor: pointer;
  transition: var(--transition-fast);
  width: fit-content;
}
.upload-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: rgba(99,14,212,0.03);
}

.upload-input-hidden {
  display: none;
}

.upload-link-row {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.upload-link-input {
  flex: 1;
  min-width: 200px;
  padding: 0.625rem 0.875rem;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-lg);
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--on-surface);
  outline: none;
  transition: border-color 0.15s ease;
}
.upload-link-input:focus {
  border-color: var(--primary);
}
.upload-link-input::placeholder {
  color: var(--outline);
}

.upload-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.625rem 1rem;
  background: var(--primary);
  border: none;
  border-radius: var(--radius-lg);
  font-family: var(--font-headline);
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition: var(--transition-fast);
  white-space: nowrap;
}
.upload-link-btn:hover { background: rgba(99,14,212,0.85); }
.upload-link-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* Responsive portfolio grid */
@media (max-width: 640px) {
  .portfolio-grid { grid-template-columns: 1fr; }
  .upload-link-row { flex-direction: column; }
  .upload-link-input { min-width: 0; }
}
</style>
