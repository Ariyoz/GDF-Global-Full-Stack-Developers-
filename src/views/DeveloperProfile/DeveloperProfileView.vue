<template>
  <div class="profile-view">
    <!-- Banner -->
    <div class="profile-banner">
      <div class="banner-bg" />
      <div class="banner-overlay" />
    </div>

    <!-- Profile Header -->
    <div class="container-gfd profile-header-wrap">
      <div class="profile-header">
        <div class="profile-left">
          <div class="avatar-wrap">
            <div class="profile-avatar">
              <span class="avatar-initials">{{ initials(dev.name) }}</span>
            </div>
            <span class="online-indicator" />
          </div>
          <div class="profile-meta">
            <h1 class="profile-name">
              {{ dev.name }}
              <span class="material-symbols-outlined verified-icon" style="font-variation-settings:'FILL' 1;">verified</span>
              <RouterLink v-if="isOwnProfile" to="/dashboard/profile" class="btn-edit-round" title="Edit Profile">
                <span class="material-symbols-outlined" style="font-size:16px;">edit</span>
              </RouterLink>
            </h1>
            <p class="profile-role">{{ dev.role }}</p>
            <p class="profile-location">
              <span class="material-symbols-outlined" style="font-size:16px;">location_on</span>
              {{ dev.location }}
            </p>
          </div>
        </div>
      </div>

      <!-- Action Buttons — always visible below header -->
      <div class="profile-actions">
        <button
          class="btn-follow"
          :class="{ following: isFollowing }"
          @click="toggleFollow"
        >
          <span class="material-symbols-outlined" style="font-size:18px;">{{ isFollowing ? 'person_remove' : 'person_add' }}</span>
          {{ isFollowing ? 'Following' : 'Follow' }}
        </button>
        <RouterLink :to="`/hire?dev=${dev.id}&name=${encodeURIComponent(dev.name)}`" class="btn-primary">
          <span class="material-symbols-outlined" style="font-size:18px;">handshake</span>
          Hire {{ dev.name.split(' ')[0] }}
        </RouterLink>
        <button class="btn-outline" @click="startMessage">
          <span class="material-symbols-outlined" style="font-size:18px;">chat</span>
          Message
        </button>
      </div>
    </div>

    <!-- Body -->
    <div class="container-gfd profile-body">
      <!-- Left Column -->
      <aside class="profile-aside">
        <div class="glass-card-static aside-card">
          <h3 class="aside-title">About</h3>
          <p class="text-body-md">{{ dev.bio }}</p>
        </div>

        <div class="glass-card-static aside-card">
          <h3 class="aside-title">Skills</h3>
          <div class="skills-wrap">
            <span v-for="skill in dev.skills" :key="skill" class="chip chip-primary">{{ skill }}</span>
          </div>
        </div>

        <div class="glass-card-static aside-card">
          <h3 class="aside-title">Experience</h3>
          <div class="exp-list">
            <div v-for="exp in dev.experience" :key="exp.company" class="exp-item">
              <div class="exp-icon-wrap">
                <span class="material-symbols-outlined exp-icon">terminal</span>
              </div>
              <div>
                <p class="exp-title">{{ exp.title }}</p>
                <p class="exp-company">{{ exp.company }} · {{ exp.period }}</p>
                <p class="exp-desc">{{ exp.desc }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="glass-card-static aside-card stats-card">
          <div v-for="stat in profileStats" :key="stat.label" class="pstat">
            <p class="pstat-value">{{ stat.value }}</p>
            <p class="pstat-label">{{ stat.label }}</p>
          </div>
        </div>
      </aside>

      <!-- Right Column -->
      <div class="profile-main">
        <!-- Portfolio -->
        <div class="glass-card-static main-card">
          <div class="main-card-header">
            <h3 class="aside-title">Portfolio Projects</h3>
            <a v-if="dev.projects.length" href="#" class="view-all-link">
              View All <span class="material-symbols-outlined" style="font-size:16px;">arrow_forward</span>
            </a>
          </div>

          <!-- Portfolio Items -->
          <div v-if="dev.projects.length || portfolioItems.length" class="portfolio-grid">
            <div v-for="project in dev.projects" :key="project.name" class="portfolio-card">
              <div class="portfolio-thumb" :style="{ background: project.gradient }">
                <span class="material-symbols-outlined portfolio-icon">{{ project.icon }}</span>
                <div class="portfolio-hover">
                  <span class="portfolio-hover-btn">View Details</span>
                </div>
              </div>
              <h4 class="portfolio-name">{{ project.name }}</h4>
              <p class="portfolio-desc">{{ project.desc }}</p>
            </div>

            <!-- User-uploaded portfolio items -->
            <div v-for="item in portfolioItems" :key="item.id" class="portfolio-card">
              <a v-if="item.type === 'link'" :href="item.url" target="_blank" rel="noopener" class="portfolio-thumb portfolio-thumb--link">
                <span class="material-symbols-outlined portfolio-icon">link</span>
                <div class="portfolio-hover">
                  <span class="portfolio-hover-btn">Open Link</span>
                </div>
              </a>
              <div v-else-if="item.type === 'image'" class="portfolio-thumb portfolio-thumb--img">
                <img :src="item.url" :alt="item.name" class="portfolio-img" />
                <div class="portfolio-hover">
                  <span class="portfolio-hover-btn">View Image</span>
                </div>
              </div>
              <div v-else class="portfolio-thumb portfolio-thumb--file">
                <span class="material-symbols-outlined portfolio-icon">description</span>
                <div class="portfolio-hover">
                  <a :href="item.url" target="_blank" class="portfolio-hover-btn">Open PDF</a>
                </div>
              </div>
              <h4 class="portfolio-name">{{ item.name }}</h4>
              <p class="portfolio-desc">{{ item.type === 'link' ? item.url : item.type.toUpperCase() }}</p>
              <button v-if="isOwnProfile" class="portfolio-remove" @click="removePortfolioItem(item.id)">
                <span class="material-symbols-outlined" style="font-size:16px;">close</span>
              </button>
            </div>
          </div>

          <!-- Empty state -->
          <div v-if="!dev.projects.length && !portfolioItems.length" class="portfolio-empty">
            <span class="material-symbols-outlined" style="font-size:2.5rem;color:var(--on-surface-variant);">folder_open</span>
            <p>No portfolio items yet.</p>
          </div>

          <!-- Upload section (own profile only) -->
          <div v-if="isOwnProfile" class="portfolio-upload-section">
            <div class="upload-divider" />
            <h4 class="upload-title">Add to Portfolio</h4>
            <div class="upload-options">
              <!-- File upload (PDF/Image) -->
              <label class="upload-btn">
                <span class="material-symbols-outlined" style="font-size:18px;">upload_file</span>
                Upload File
                <input type="file" accept=".pdf,image/*" class="upload-input-hidden" @change="handleFileUpload" />
              </label>
              <!-- Link input -->
              <div class="upload-link-row">
                <input
                  v-model="portfolioLink"
                  type="url"
                  class="upload-link-input"
                  placeholder="https://your-project-link.com"
                  @keydown.enter.prevent="addPortfolioLink"
                />
                <button type="button" class="upload-link-btn" @click="addPortfolioLink" :disabled="!portfolioLink.trim()">
                  <span class="material-symbols-outlined" style="font-size:18px;">add_link</span>
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Activity Feed -->
        <div class="glass-card-static main-card">
          <h3 class="aside-title" style="margin-bottom:1.25rem;">Recent Activity</h3>
          <div class="activity-list">
            <div v-for="post in dev.activity" :key="post.id" class="activity-post">
              <div class="post-header">
                <div class="post-avatar">{{ initials(dev.name) }}</div>
                <div>
                  <p class="post-author">{{ dev.name }}</p>
                  <p class="post-time">{{ post.time }}</p>
                </div>
              </div>
              <p class="post-text">{{ post.text }}</p>
              <div class="post-actions">
                <button class="post-action-btn">
                  <span class="material-symbols-outlined" style="font-size:18px;">thumb_up</span>
                  {{ post.likes }}
                </button>
                <button class="post-action-btn">
                  <span class="material-symbols-outlined" style="font-size:18px;">comment</span>
                  {{ post.comments }}
                </button>
                <button class="post-action-btn">
                  <span class="material-symbols-outlined" style="font-size:18px;">share</span>
                </button>
              </div>
            </div>
          </div>
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

const route    = useRoute()
const router   = useRouter()
const devStore = useDevelopersStore()
const authStore = useAuthStore()

const isFollowing = ref(false)
const followerCount = ref(0)
const portfolioItems = ref([])
const portfolioLink = ref('')

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

// Load the developer profile — use auth profile if it's the logged-in user
const dev = computed(() => {
  const profileId = route.params.id

  // If viewing own profile, use auth store data
  if (authStore.profile && authStore.profile.id === profileId) {
    const p = authStore.profile
    return {
      id: p.id,
      name: p.full_name || 'User',
      role: p.experience_level || p.role || 'Developer',
      location: p.location || '',
      bio: p.bio || '',
      skills: Array.isArray(p.skills) ? p.skills : [],
      github: p.github_url || '',
      linkedin: '',
      website: p.portfolio || '',
      available: p.available !== false,
      verified: true,
      rating: '5.0',
      experience: [
        { title: p.experience_level || 'Developer', company: 'GFD Community', period: '2024–Present', desc: p.bio || '' },
      ],
      projects: [],
      activity: [],
    }
  }

  // Try loading from developers store
  const found = devStore.getById(profileId)
  if (found) {
    return {
      id: found.id,
      name: found.full_name || found.name || 'Developer',
      role: found.experience_level || found.role || 'Developer',
      location: found.location || '',
      bio: found.bio || '',
      skills: Array.isArray(found.skills) ? found.skills : [],
      github: found.github_url || '',
      linkedin: '',
      website: found.portfolio || '',
      available: found.available !== false,
      verified: true,
      rating: '5.0',
      experience: found.experience || [],
      projects: found.projects || [],
      activity: found.activity || [],
    }
  }

  // Fallback — empty profile
  return {
    id: profileId || '',
    name: 'User',
    role: 'Developer',
    location: '',
    bio: 'No bio available.',
    skills: [],
    github: '',
    linkedin: '',
    website: '',
    available: false,
    verified: false,
    rating: '—',
    experience: [],
    projects: [],
    activity: [],
  }
})

const profileStats = computed(() => [
  { value: followerCount.value, label: 'Followers' },
  { value: dev.value.projects?.length || 0, label: 'Projects' },
  { value: dev.value.available ? 'Yes' : 'No', label: 'Available' },
  { value: dev.value.verified ? '✓' : '—', label: 'Verified' },
])

function initials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}
</script>

<style scoped>
.profile-view { background: var(--background); min-height: 100vh; }

/* Banner */
.profile-banner {
  height: 240px;
  position: relative;
  overflow: hidden;
}

@media (min-width: 768px) { .profile-banner { height: 280px; } }

.banner-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #1a0840 0%, #2a1060 40%, #630ed4 100%);
}

.banner-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 50%, rgba(249,249,255,0.3) 100%);
}

/* Profile Header */
.profile-header-wrap { position: relative; z-index: 1; }

.profile-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: -4rem;
  padding-bottom: 1.5rem;
}

@media (min-width: 768px) {
  .profile-header {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
}

.profile-left { display: flex; align-items: flex-end; gap: 1.25rem; }

.avatar-wrap { position: relative; }

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: var(--radius-xl);
  border: 4px solid var(--surface);
  background: var(--primary-fixed);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
}

.avatar-initials {
  font-family: var(--font-headline);
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary);
}

.online-indicator {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  background: #22c55e;
  border-radius: 50%;
  border: 3px solid var(--surface);
}

.profile-name {
  font-family: var(--font-headline);
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  color: var(--on-surface);
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.verified-icon { font-size: 22px; color: var(--primary); }

.profile-role {
  font-family: var(--font-headline);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--on-surface-variant);
  margin-top: 0.25rem;
}

.profile-location {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: var(--on-surface-variant);
  margin-top: 0.35rem;
}

.profile-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  padding-top: 1rem;
  padding-bottom: 1.5rem;
}

.btn-edit-round {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--surface-container);
  border: 1px solid var(--outline-variant);
  color: var(--on-surface-variant);
  text-decoration: none;
  transition: var(--transition-fast);
  margin-left: 0.25rem;
}
.btn-edit-round:hover {
  background: rgba(99,14,212,0.1);
  border-color: var(--primary);
  color: var(--primary);
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
