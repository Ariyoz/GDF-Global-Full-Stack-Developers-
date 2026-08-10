<template>
  <div class="dash-layout" :class="{ 'messaging-fullscreen': $route.path.startsWith('/messaging'), 'feed-page': $route.path === '/feed' }">
    <!-- Top Nav -->
    <header class="dash-topnav glass-nav">
      <div class="dash-topnav-inner">
        <div class="dash-topnav-left">
          <RouterLink to="/" class="dash-logo">
            <img src="@/assets/icons/icon.png" alt="GFD" class="dash-logo-img" />
            <span class="dash-logo-text">GFD</span>
          </RouterLink>
          <nav class="dash-topnav-links">
            <RouterLink to="/dashboard" class="dash-topnav-link" :class="{ active: $route.name === 'dashboard' }">Dashboard</RouterLink>
            <RouterLink to="/explore"   class="dash-topnav-link">Explore</RouterLink>
            <RouterLink to="/projects"  class="dash-topnav-link">Projects</RouterLink>
            <RouterLink to="/courses"   class="dash-topnav-link">Courses</RouterLink>
          </nav>
        </div>
        <div class="dash-topnav-right">
          <!-- Theme Toggle -->
          <button class="icon-btn" :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'" @click="toggle">
            <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">
              {{ isDark ? 'light_mode' : 'dark_mode' }}
            </span>
          </button>
          <RouterLink to="/messaging" class="icon-btn topnav-hide-mobile" aria-label="Messages">
            <span class="material-symbols-outlined">mail</span>
            <span v-if="messagingStore.totalUnread > 0" class="nav-badge">{{ messagingStore.totalUnread > 9 ? '9+' : messagingStore.totalUnread }}</span>
          </RouterLink>
          <RouterLink to="/notifications" class="icon-btn topnav-hide-mobile" aria-label="Notifications" style="position:relative">
            <span class="material-symbols-outlined">notifications</span>
            <span v-if="notifsStore.unreadCount > 0" class="nav-badge">{{ notifsStore.unreadCount > 9 ? '9+' : notifsStore.unreadCount }}</span>
          </RouterLink>
          <!-- Wallet icon button -->
          <RouterLink to="/wallet" class="icon-btn topnav-hide-mobile" aria-label="Wallet">
            <span class="material-symbols-outlined">account_balance_wallet</span>
          </RouterLink>
          <!-- User pill: avatar + name + sign out â€” all in one row -->
          <div class="topnav-user-pill">
            <RouterLink to="/dashboard/profile" class="dash-avatar" aria-label="Profile">
              <span class="avatar-initials">{{ userInitials }}</span>
            </RouterLink>
            <span class="topnav-username">{{ (user?.full_name || profile?.full_name || 'Account').split(' ')[0] }}</span>
            <button type="button" class="dash-signout-btn" @click="handleSignOut">
              <span class="material-symbols-outlined">logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="dash-body">
      <!-- Sidebar -->
      <aside class="dash-sidebar">
        <nav class="sidebar-nav">
          <RouterLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="sidebar-link"
            active-class="sidebar-link-active"
          >
            <span class="material-symbols-outlined sidebar-icon" :style="item.fill ? 'font-variation-settings:\'FILL\' 1' : ''">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </RouterLink>
        </nav>

        <!-- Pro Plan Card -->
        <div class="sidebar-pro-card">
          <p class="pro-title">Pro Plan Active</p>
          <p class="pro-sub">Unlock higher visibility</p>
          <RouterLink to="/plans" class="btn-primary pro-btn">View Plan</RouterLink>
        </div>
      </aside>

      <!-- Main -->
      <main class="dash-main">
        <RouterView v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
    </div>

                <!-- Mobile Bottom Nav — floating pill -->
    <nav class="mobile-bottom-nav">
      <div class="nav-pill">
        <RouterLink to="/dashboard" class="pill-item" :class="{ active: $route.path === '/dashboard' }">
          <span class="material-symbols-outlined" :style="$route.path === '/dashboard' ? 'font-variation-settings:\'FILL\' 1' : ''">home</span>
          <span class="pill-label">Home</span>
        </RouterLink>
        <RouterLink to="/jobs" class="pill-item" :class="{ active: $route.path === '/jobs' }">
          <span class="material-symbols-outlined" :style="$route.path === '/jobs' ? 'font-variation-settings:\'FILL\' 1' : ''">work</span>
          <span class="pill-label">Jobs</span>
        </RouterLink>
        <button type="button" class="pill-center-btn" @click="openCompose">
          <span class="material-symbols-outlined">add</span>
        </button>
        <RouterLink to="/messaging" class="pill-item" :class="{ active: $route.path === '/messaging' }">
          <span class="material-symbols-outlined" :style="$route.path === '/messaging' ? 'font-variation-settings:\'FILL\' 1' : ''">chat</span>
          <span class="pill-label">Messages</span>
          <span v-if="messagingStore.totalUnread > 0" class="pill-badge">{{ messagingStore.totalUnread > 9 ? '9+' : messagingStore.totalUnread }}</span>
        </RouterLink>
        <button type="button" class="pill-item" :class="{ active: showMoreMenu }" @click="showMoreMenu = !showMoreMenu">
          <span class="material-symbols-outlined">grid_view</span>
          <span class="pill-label">More</span>
        </button>
      </div>
    </nav>

    <!-- Mobile More Menu Drawer -->
    <Transition name="sheet">
      <div v-if="showMoreMenu" class="more-overlay" @click.self="showMoreMenu = false">
        <div class="more-sheet">
          <div class="sheet-handle" />
          <div class="more-sheet-header">
            <p class="more-sheet-title">Menu</p>
            <button class="sheet-close" @click="showMoreMenu = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="more-grid">
            <RouterLink
              v-for="item in moreNavItems"
              :key="item.to"
              :to="item.to"
              class="more-item"
              :class="{ active: $route.path.startsWith(item.to) }"
              @click="showMoreMenu = false"
            >
              <div class="more-item-icon">
                <span class="material-symbols-outlined">{{ item.icon }}</span>
              </div>
              <span class="more-item-label">{{ item.label }}</span>
            </RouterLink>
          </div>
          <div class="more-sheet-footer">
            <button class="more-signout-btn" @click="handleSignOut">
              <span class="material-symbols-outlined">logout</span>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- â”€â”€ Mobile Compose Sheet â”€â”€ -->
    <Transition name="sheet">
      <div v-if="showCompose" class="compose-overlay" @click.self="closeCompose">
        <div class="compose-sheet">
          <!-- Handle -->
          <div class="sheet-handle" />

          <!-- Header -->
          <div class="sheet-header">
            <div class="sheet-user">
              <div class="sheet-avatar">{{ userInitials }}</div>
              <div>
                <p class="sheet-name">{{ user?.name || 'Developer' }}</p>
                <div class="sheet-audience">
                  <span class="material-symbols-outlined" style="font-size:14px">public</span>
                  Public
                </div>
              </div>
            </div>
            <button class="sheet-close" @click="closeCompose">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Textarea -->
          <textarea
            ref="composeTextarea"
            v-model="composeText"
            class="sheet-textarea"
            placeholder="Share your latest build, insight, or project update..."
            rows="5"
          />

          <!-- Type Chips -->
          <div class="sheet-types">
            <button
              v-for="t in postTypes"
              :key="t.value"
              class="type-chip"
              :class="{ active: postType === t.value }"
              @click="t.value === 'image' ? triggerImageUpload() : (postType = t.value)"
            >
              <span class="material-symbols-outlined" style="font-size:16px">{{ t.icon }}</span>
              {{ t.label }}
            </button>
          </div>

          <!-- Hidden file input for image upload -->
          <input
            ref="imageInput"
            type="file"
            accept="image/*"
            class="hidden-input"
            @change="handleImageSelect"
          />

          <!-- Image preview -->
          <div v-if="selectedImagePreview" class="sheet-image-preview">
            <img :src="selectedImagePreview" alt="Selected image" class="preview-img" />
            <button class="preview-remove" @click="clearImage">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Extra: Code snippet input -->
          <div v-if="postType === 'code'" class="sheet-code-wrap">
            <div class="code-lang-row">
              <span class="code-lang-label">Language</span>
              <select v-model="codeLang" class="code-lang-select">
                <option v-for="l in codeLangs" :key="l" :value="l">{{ l }}</option>
              </select>
            </div>
            <textarea
              v-model="codeSnippet"
              class="sheet-code-input"
              placeholder="Paste your code snippet here..."
              rows="5"
              spellcheck="false"
            />
          </div>

          <!-- Extra: Link input -->
          <div v-if="postType === 'link'" class="sheet-link-wrap">
            <span class="material-symbols-outlined link-icon">link</span>
            <input v-model="postLink" class="sheet-link-input" placeholder="https://your-project.com" />
          </div>

          <!-- Footer -->
          <div class="sheet-footer">
            <div class="sheet-tools">
              <button class="tool-btn" @click="triggerImageUpload()">
                <span class="material-symbols-outlined">image</span>
              </button>
              <button class="tool-btn" @click="postType = postType === 'code' ? 'text' : 'code'">
                <span class="material-symbols-outlined">code</span>
              </button>
              <button class="tool-btn" @click="postType = postType === 'link' ? 'text' : 'link'">
                <span class="material-symbols-outlined">link</span>
              </button>
            </div>
            <button
              class="btn-primary sheet-post-btn"
              :disabled="!composeText.trim() && !selectedImageFile"
              @click="submitCompose"
            >
              <span class="material-symbols-outlined" style="font-size:16px">send</span>
              Post
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <ToastContainer />
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/store/auth'
import { useTheme }     from '@/composables/useTheme'
import { useFeedStore } from '@/store/feed'
import { useUiStore }   from '@/store/ui'
import { useMessagingStore } from '@/store/messaging'
import { useNotificationsStore } from '@/store/notifications'
import ToastContainer from '@/components/ui/ToastContainer.vue'

const router    = useRouter()
const authStore = useAuthStore()
const feedStore = useFeedStore()
const uiStore   = useUiStore()
const messagingStore = useMessagingStore()
const notifsStore = useNotificationsStore()
const { user, isAdmin }  = storeToRefs(authStore)
const { isDark, toggle } = useTheme()

// Pre-fetch unread counts when layout mounts
onMounted(() => {
  if (authStore.isAuthenticated) {
    notifsStore.fetchUnreadCount()
    messagingStore.fetchConversations()
  }
})

// â”€â”€ Compose Sheet â”€â”€
const showCompose     = ref(false)
const composeText     = ref('')
const composeTextarea = ref(null)
const postType        = ref('text')
const codeSnippet     = ref('')
const codeLang        = ref('JavaScript')
const postLink        = ref('')

const codeLangs = ['JavaScript', 'TypeScript', 'Python', 'Go', 'Rust', 'CSS', 'HTML', 'SQL', 'Bash']

const postTypes = [
  { value: 'text',  icon: 'notes',    label: 'Text'    },
  { value: 'code',  icon: 'code',     label: 'Snippet' },
  { value: 'link',  icon: 'link',     label: 'Link'    },
  { value: 'image', icon: 'image',    label: 'Photo'   },
]

const selectedImageFile = ref(null)
const selectedImagePreview = ref(null)
const imageInput = ref(null)

function triggerImageUpload() {
  imageInput.value?.click()
}

function handleImageSelect(e) {
  const file = e.target.files?.[0]
  if (!file) return
  selectedImageFile.value = file
  selectedImagePreview.value = URL.createObjectURL(file)
  postType.value = 'image'
}

function clearImage() {
  if (selectedImagePreview.value) URL.revokeObjectURL(selectedImagePreview.value)
  selectedImageFile.value = null
  selectedImagePreview.value = null
}

async function openCompose() {
  showCompose.value = true
  await nextTick()
  composeTextarea.value?.focus()
}

function closeCompose() {
  showCompose.value = false
  composeText.value  = ''
  codeSnippet.value  = ''
  postLink.value     = ''
  postType.value     = 'text'
  clearImage()
}

async function submitCompose() {
  if (!composeText.value.trim() && !selectedImageFile.value) return

  let mediaUrls = []

  // Upload image to Cloudinary if selected
  if (selectedImageFile.value) {
    try {
      const formData = new FormData()
      formData.append('file', selectedImageFile.value)
      const { default: http } = await import('@/services/http')
      const data = await http.post('/uploads/media', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      if (data.url) mediaUrls.push(data.url)
    } catch (err) {
      console.error('Image upload failed:', err)
    }
  }

  // Submit to feed store (which calls the real backend)
  await feedStore.addPost({
    content: composeText.value,
    text: composeText.value,
    post_type: mediaUrls.length ? 'image' : postType.value === 'code' ? 'code' : 'text',
    media_urls: mediaUrls,
    code_snippet: postType.value === 'code' ? codeSnippet.value : undefined,
    code_language: postType.value === 'code' ? codeLang.value : undefined,
  })

  uiStore.showSuccess('Posted successfully!')
  closeCompose()
  router.push({ name: 'feed' })
}

// â”€â”€ User â”€â”€
const userInitials = computed(() => {
  const name = user.value?.full_name || authStore.profile?.full_name || user.value?.email || 'GFD'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

// â”€â”€ More menu (all sections reachable on mobile) â”€â”€
const showMoreMenu = ref(false)

const navItems = [
  { to: '/dashboard',          icon: 'dashboard',               label: 'Dashboard',    fill: true },
  { to: '/feed',               icon: 'dynamic_feed',            label: 'Project Feed' },
  { to: '/dashboard/projects', icon: 'folder',                  label: 'Projects' },
  { to: '/jobs',               icon: 'work',                    label: 'Jobs' },
  { to: '/dashboard/analytics',icon: 'analytics',               label: 'Analytics' },
  { to: '/dashboard/requests', icon: 'inbox',                   label: 'Requests' },
  { to: '/messaging',          icon: 'chat',                    label: 'Messages' },
  { to: '/wallet',             icon: 'account_balance_wallet',  label: 'Wallet' },
  { to: '/kyc',               icon: 'verified_user',           label: 'KYC Verify' },
  { to: '/settings',           icon: 'settings',                label: 'Settings' },
  ...(isAdmin.value ? [
    { to: '/admin',          icon: 'shield',  label: 'Admin Panel' },
    { to: '/admin/users',    icon: 'group',   label: 'User Management' },
    { to: '/admin/projects', icon: 'folder_open', label: 'Project Review' },
  ] : []),
]

// All sections shown in the "More" drawer on mobile
const moreNavItems = [
  { to: '/dashboard',           icon: 'dashboard',              label: 'Dashboard'  },
  { to: '/feed',                icon: 'dynamic_feed',           label: 'Feed'       },
  { to: '/jobs',                icon: 'work',                   label: 'Jobs'       },
  { to: '/explore',             icon: 'search',                 label: 'Explore'    },
  { to: '/dashboard/projects',  icon: 'folder',                 label: 'Projects'   },
  { to: '/dashboard/analytics', icon: 'analytics',              label: 'Analytics'  },
  { to: '/dashboard/requests',  icon: 'inbox',                  label: 'Requests'   },
  { to: '/wallet',              icon: 'account_balance_wallet', label: 'Wallet'     },
  { to: '/kyc',                 icon: 'verified_user',          label: 'KYC'        },
  { to: '/notifications',       icon: 'notifications',          label: 'Notifs'     },
  { to: '/courses',             icon: 'school',                 label: 'Courses'    },
  { to: '/messaging',           icon: 'chat',                   label: 'Messages'   },
  { to: '/dashboard/profile',   icon: 'person',                 label: 'Profile'    },
  { to: '/settings',            icon: 'settings',               label: 'Settings'   },
  { to: '/plans',               icon: 'workspace_premium',      label: 'Plans'      },
  ...(isAdmin.value ? [
    { to: '/admin',          icon: 'shield',       label: 'Admin'          },
    { to: '/admin/users',    icon: 'group',        label: 'Users'          },
    { to: '/admin/projects', icon: 'folder_open',  label: 'Project Review' },
    { to: '/admin/wallet',   icon: 'account_balance_wallet', label: 'Withdrawals' },
  ] : []),
]

function handleSignOut() {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.dash-layout {
  min-height: 100vh;
  background: var(--background);
  display: flex;
  flex-direction: column;
  transition: background-color 0.3s ease;
}

/* Top Nav */
.dash-topnav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  height: calc(72px + env(safe-area-inset-top, 0px));
  padding-top: env(safe-area-inset-top, 0px);
  background: var(--surface-container-lowest);
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--outline-variant);
  transition: background-color 0.3s ease;
}

/* Dark mode topnav — elevated surface so content is visible */
:global([data-theme="dark"]) .dash-topnav {
  background: #16161f;
  border-bottom-color: rgba(168, 85, 247, 0.12);
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

:global([data-theme="dark"]) .dash-logo { color: #ffffff; }
:global([data-theme="dark"]) .dash-topnav-link { color: rgba(255,255,255,0.7); }
:global([data-theme="dark"]) .dash-topnav-link:hover,
:global([data-theme="dark"]) .dash-topnav-link.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
}

.dash-topnav-inner {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--space-gutter);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-base);
}

.dash-topnav-left {
  display: flex;
  align-items: center;
  gap: var(--space-base);
}

.dash-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}
.dash-logo-img {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  object-fit: contain;
  flex-shrink: 0;
}
.dash-logo-text {
  font-family: var(--font-headline);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--on-surface);
}

.dash-back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  color: var(--on-surface-variant);
  text-decoration: none;
  transition: background 0.15s ease, color 0.15s ease;
}

.dash-back-btn:hover {
  background: rgba(168, 85, 247, 0.08);
  color: var(--primary);
}

.dash-back-btn .material-symbols-outlined {
  font-size: 20px;
}

.dash-topnav-links {
  display: none;
  align-items: center;
  gap: var(--space-lg);
  margin-left: var(--space-lg);
}

@media (min-width: 768px) {
  .dash-topnav-links { display: flex; }
}

.dash-topnav-link {
  font-size: 1rem;
  color: var(--on-surface-variant);
  text-decoration: none;
  font-weight: 400;
  transition: var(--transition-fast);
  border-bottom: 2px solid transparent;
  padding-bottom: 2px;
}

.dash-topnav-link:hover,
.dash-topnav-link.active {
  color: var(--primary);
  font-weight: 700;
  border-bottom-color: var(--primary);
}

.dash-topnav-right {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
}

.icon-btn {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: var(--radius-full);
  color: var(--on-surface-variant);
  cursor: pointer;
  transition: var(--transition-fast);
  text-decoration: none;
  flex-shrink: 0;
}

.icon-btn:hover { background: rgba(168,85,247,0.08); color: var(--primary); }
.icon-btn .material-symbols-outlined { font-size: 20px; }
.icon-btn { position: relative; }
.nav-badge {
  position: absolute; top: 2px; right: 2px;
  min-width: 16px; height: 16px; border-radius: 8px;
  background: var(--primary); color: #fff;
  font-size: 0.6rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  padding: 0 3px; pointer-events: none;
  border: 1.5px solid var(--surface-container-lowest);
}

.bottom-badge {
  position: absolute; top: 0; right: 2px;
  min-width: 15px; height: 15px; border-radius: 8px;
  background: var(--primary); color: #fff;
  font-size: 0.55rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  padding: 0 3px; pointer-events: none;
}

.topnav-user-pill {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.375rem 0.25rem 0.25rem;
  background: var(--surface-container);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-full);
  margin-left: 0.25rem;
  flex-shrink: 0;
}

.dash-avatar {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  border: 1.5px solid rgba(168,85,247,0.3);
  background: var(--primary-fixed);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  flex-shrink: 0;
}

.avatar-initials {
  font-family: var(--font-headline);
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--primary);
}

.topnav-username {
  font-family: var(--font-headline);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--on-surface);
  white-space: nowrap;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dash-signout-btn {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: var(--radius-full);
  color: var(--on-surface-variant);
  cursor: pointer;
  transition: color 0.15s ease, background 0.15s ease;
  flex-shrink: 0;
  padding: 0;
}
.dash-signout-btn:hover { color: var(--error); background: rgba(186,26,26,0.08); }
.dash-signout-btn .material-symbols-outlined { font-size: 16px; }

/* Hide mail/notifications on small screens — accessible via bottom nav */
@media (max-width: 767px) {
  .topnav-hide-mobile { display: none; }
  .topnav-username { display: none; }

  /* ── Mobile top nav: glass, 60px, cleaner ── */
  .dash-topnav {
    height: calc(60px + env(safe-area-inset-top, 0px));
    background: rgba(255,255,255,0.82);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    backdrop-filter: blur(20px) saturate(180%);
    border-bottom: 1px solid rgba(168,85,247,0.10);
  }

  /* Hide back arrow on mobile */
  .dash-back-btn { display: none; }

  /* Bigger logo on mobile */
  .dash-logo-img { width: 32px; height: 32px; border-radius: 9px; }
  .dash-logo-text { font-size: 1.35rem; }

  /* Avatar: 32px, purple gradient */
  .dash-avatar {
    width: 32px;
    height: 32px;
    background: var(--gradient-primary);
    border: none;
  }
  .avatar-initials {
    font-size: 0.7rem;
    font-weight: 800;
    color: #fff;
  }

  /* Pill: slimmer on mobile */
  .topnav-user-pill {
    padding: 0.2rem 0.3rem 0.2rem 0.2rem;
    gap: 0.3rem;
  }
}

/* dark mode glass top nav on mobile */
@media (max-width: 767px) {
  :global([data-theme="dark"]) .dash-topnav {
    background: rgba(17,17,24,0.88);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    backdrop-filter: blur(20px) saturate(180%);
    border-bottom-color: rgba(168,85,247,0.18);
  }
}

/* Body */
.dash-body {
  display: flex;
  padding-top: calc(72px + env(safe-area-inset-top, 0px));
  min-height: 100vh;
}

@media (max-width: 767px) {
  .dash-body {
    padding-top: calc(60px + env(safe-area-inset-top, 0px));
  }
}

/* Sidebar — FIXED so it never scrolls with the content */
.dash-sidebar {
  display: none;
  width: 256px;
  flex-direction: column;
  background: var(--surface-container-lowest);
  border-right: 1px solid var(--outline-variant);
  position: fixed;
  top: calc(72px + env(safe-area-inset-top, 0px));
  left: 0;
  height: calc(100vh - 72px - env(safe-area-inset-top, 0px));
  padding: var(--space-md);
  overflow-y: auto;
  overflow-x: hidden;
  transition: background-color 0.3s ease;
  z-index: 100;
  scrollbar-width: thin;
  scrollbar-color: var(--outline-variant) transparent;
}

:global([data-theme="dark"]) .dash-sidebar {
  background: #13131c;
  border-right-color: rgba(168, 85, 247, 0.1);
}

:global([data-theme="dark"]) .sidebar-link {
  color: rgba(255, 255, 255, 0.65);
}
:global([data-theme="dark"]) .sidebar-link:hover {
  background: rgba(168, 85, 247, 0.1);
  color: rgba(255, 255, 255, 0.9);
}
:global([data-theme="dark"]) .sidebar-link-active {
  background: rgba(168, 85, 247, 0.15);
  color: var(--primary);
}

@media (min-width: 768px) {
  .dash-sidebar { display: flex; }
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  flex: 1;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-sm);
  border-radius: var(--radius-lg);
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--on-surface-variant);
  text-decoration: none;
  transition: var(--transition-fast);
}

.sidebar-link:hover {
  background: var(--surface-container-low);
  color: var(--on-surface);
}

.sidebar-link-active {
  background: var(--surface-container-low);
  color: var(--primary);
  font-weight: 600;
}

.sidebar-icon { font-size: 20px; }

/* Pro Card */
.sidebar-pro-card {
  margin-top: auto;
  padding: var(--space-sm);
  background: var(--primary-fixed);
  border-radius: var(--radius-xl);
  border: 1px solid rgba(168,85,247,0.15);
}

.pro-title {
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--on-primary-fixed);
}

.pro-sub {
  font-size: 0.75rem;
  color: var(--on-primary-fixed-variant);
  margin-top: var(--space-xs);
}

.pro-btn {
  margin-top: var(--space-sm);
  width: 100%;
  padding: var(--space-xs) var(--space-sm);
  font-size: 0.875rem;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(99,14,212,0.2);
}

.dash-main {
  flex: 1;
  padding: 1rem;
  max-width: 1200px;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  overflow-x: hidden;
  min-height: calc(100vh - 72px);
}

@media (min-width: 768px) {
  .dash-main {
    padding: var(--space-lg);
    margin-left: 256px;
  }
}

/* ─────────────────────────────────────────────────
   Mobile Bottom Nav — premium floating pill
───────────────────────────────────────────────── */
.mobile-bottom-nav {
  display: none;
  position: fixed;
  bottom: 0; left: 0; right: 0;
  z-index: 500;
  justify-content: center;
  align-items: flex-end;
  padding: 0 1rem calc(0.875rem + env(safe-area-inset-bottom, 0px));
  background: transparent;
  pointer-events: none;
}

@media (max-width: 767px) {
  .mobile-bottom-nav { display: flex; }
  .dash-main { padding-bottom: 100px; }
  .messaging-fullscreen .mobile-bottom-nav { display: none !important; }
  .messaging-fullscreen .dash-topnav { display: none !important; }
  .messaging-fullscreen .dash-body { padding-top: 0 !important; }
}

/* The pill itself */
.nav-pill {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: 999px;
  padding: 0.55rem 0.875rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10);
  width: 100%;
  max-width: 380px;
  position: relative;
  pointer-events: all;
  height: 64px;
  box-sizing: border-box;
}

:global([data-theme="dark"]) .nav-pill {
  background: #1a1a2e;
  border-color: rgba(168,85,247,0.2);
  box-shadow:
    0 8px 32px rgba(0,0,0,0.55),
    0 0 0 1px rgba(168,85,247,0.08) inset;
}

/* Nav pill items */
.pill-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  text-decoration: none;
  color: var(--on-surface-variant);
  font-family: var(--font-headline);
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.35rem 0.6rem;
  border-radius: 999px;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  background: none;
  border: none;
  cursor: pointer;
  position: relative;
  flex: 1;
  min-width: 0;
}

.pill-item .material-symbols-outlined { font-size: 22px; transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }

/* iOS-style active pill background behind icon+label */
.pill-item.active {
  color: var(--primary);
  background: rgba(99,14,212,0.10);
}
:global([data-theme="dark"]) .pill-item.active {
  background: rgba(168,85,247,0.14);
  color: var(--primary);
}
.pill-item.active .material-symbols-outlined {
  transform: scale(1.1);
}

:global([data-theme="dark"]) .pill-item { color: rgba(255,255,255,0.5); }

.pill-label { font-size: 0.65rem; font-weight: 600; white-space: nowrap; }

.pill-badge {
  position: absolute; top: 1px; right: 2px;
  min-width: 16px; height: 16px; border-radius: 8px;
  background: #22c55e; color: #fff;
  font-size: 0.55rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center; padding: 0 3px;
}

/* FAB center button — circular, gradient, glow */
.pill-center-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--gradient-primary);
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  margin: -22px 0.35rem 0;
  box-shadow:
    0 4px 20px rgba(99,14,212,0.55),
    0 0 0 4px var(--surface-container-lowest),
    0 0 0 5px rgba(99,14,212,0.15);
  transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.18s ease;
  position: relative;
  z-index: 1;
}

:global([data-theme="dark"]) .pill-center-btn {
  box-shadow:
    0 4px 24px rgba(168,85,247,0.6),
    0 0 0 4px #1a1a2e,
    0 0 0 5px rgba(168,85,247,0.2);
}

.pill-center-btn:active {
  transform: scale(0.93);
  box-shadow:
    0 2px 10px rgba(99,14,212,0.45),
    0 0 0 4px var(--surface-container-lowest);
}

.pill-center-btn:hover { transform: scale(1.07); }
.pill-center-btn .material-symbols-outlined { font-size: 26px; }

.pill-avatar { width:24px; height:24px; border-radius:50%; overflow:hidden; flex-shrink:0; }
.pill-avatar-img { width:100%; height:100%; object-fit:cover; border-radius:50%; }

/* ─────────────────────────────────────────────────
   Page transition — native slide + fade
───────────────────────────────────────────────── */
.page-enter-active {
  transition: opacity 0.22s ease, transform 0.22s cubic-bezier(0.4, 0, 0.2, 1);
}
.page-leave-active {
  transition: opacity 0.18s ease, transform 0.18s cubic-bezier(0.4, 0, 0.2, 1);
}
.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* ─────────────────────────────────────────────────
   Compose Sheet — Twitter/X style
───────────────────────────────────────────────── */
.compose-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 600;
  display: flex;
  align-items: flex-end;
}

.compose-sheet {
  width: 100%;
  background: var(--surface-container-lowest);
  border-radius: var(--radius-2xl) var(--radius-2xl) 0 0;
  padding: 0.75rem 1.25rem calc(1.5rem + env(safe-area-inset-bottom, 0px));
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 90vh;
  overflow-y: auto;
}

:global([data-theme="dark"]) .compose-sheet {
  background: #16161f;
  border-top: 1px solid rgba(168,85,247,0.15);
}

/* Drag handle */
.sheet-handle {
  width: 40px;
  height: 4px;
  background: var(--outline-variant);
  border-radius: var(--radius-full);
  margin: 0 auto 0.25rem;
  flex-shrink: 0;
}

/* Sheet header — frosted glass feel */
.sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  background: var(--surface-container);
  border-radius: var(--radius-xl);
  margin-bottom: 0.25rem;
}

:global([data-theme="dark"]) .sheet-header {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
}

.sheet-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.sheet-avatar {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  background: var(--gradient-primary);
  color: #fff;
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sheet-name {
  font-family: var(--font-headline);
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--on-surface);
}

.sheet-audience {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  margin-top: 0.2rem;
  padding: 0.15rem 0.5rem;
  background: var(--surface-container);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--on-surface-variant);
}

.sheet-close {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background: var(--surface-container);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--on-surface-variant);
  flex-shrink: 0;
  transition: background 0.15s ease, color 0.15s ease;
}

.sheet-close:hover { background: var(--surface-container-high); color: var(--on-surface); }
.sheet-close .material-symbols-outlined { font-size: 20px; }

/* Textarea — larger, colored focus border */
.sheet-textarea {
  width: 100%;
  background: transparent;
  border: 2px solid transparent;
  border-radius: var(--radius-lg);
  outline: none;
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--on-surface);
  line-height: 1.65;
  resize: none;
  min-height: 140px;
  padding: 0.5rem 0.25rem;
  transition: border-color 0.2s ease;
}

.sheet-textarea:focus {
  border-color: rgba(99,14,212,0.35);
  background: rgba(99,14,212,0.03);
}

:global([data-theme="dark"]) .sheet-textarea:focus {
  border-color: rgba(168,85,247,0.3);
  background: rgba(168,85,247,0.04);
}

.sheet-textarea::placeholder { color: var(--outline); }

/* Post type chips */
.sheet-types {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.type-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.35rem 0.75rem;
  background: var(--surface-container);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--on-surface-variant);
  cursor: pointer;
  transition: all 0.15s ease;
}

.type-chip.active {
  background: var(--primary-fixed);
  border-color: var(--primary);
  color: var(--primary);
}

/* Code input */
.sheet-code-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--outline-variant);
}

.code-lang-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.875rem;
  background: var(--surface-container);
  border-bottom: 1px solid var(--outline-variant);
}

.code-lang-label {
  font-family: var(--font-headline);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--on-surface-variant);
}

.code-lang-select {
  background: var(--surface-container-high);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-md);
  padding: 0.2rem 0.5rem;
  font-family: var(--font-headline);
  font-size: 0.75rem;
  color: var(--on-surface);
  outline: none;
  cursor: pointer;
}

.sheet-code-input {
  width: 100%;
  padding: 0.875rem;
  background: #111827;
  border: none;
  outline: none;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: #e2e8f0;
  line-height: 1.6;
  resize: none;
  min-height: 120px;
}

/* Link input */
.sheet-link-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.875rem;
  background: var(--surface-container-low);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-lg);
}

.link-icon { font-size: 20px; color: var(--primary); flex-shrink: 0; }

.sheet-link-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--on-surface);
}

.sheet-link-input::placeholder { color: var(--outline); }

/* Hidden file input */
.hidden-input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}

/* Image preview */
.sheet-image-preview {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--outline-variant);
}

.preview-img {
  width: 100%;
  max-height: 240px;
  object-fit: cover;
  display: block;
}

.preview-remove {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background: rgba(0, 0, 0, 0.6);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;
  transition: background 0.15s ease;
}

.preview-remove:hover { background: rgba(0, 0, 0, 0.8); }
.preview-remove .material-symbols-outlined { font-size: 18px; }

/* Compose footer — bigger, more app-like */
.sheet-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.875rem;
  border-top: 1px solid var(--outline-variant);
}

.sheet-tools {
  display: flex;
  gap: 0.35rem;
}

/* Tool buttons: subtle background, bigger tap target */
.tool-btn {
  width: 42px;
  height: 42px;
  border-radius: var(--radius-full);
  background: var(--surface-container);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--on-surface-variant);
  cursor: pointer;
  transition: all 0.15s ease;
}

.tool-btn:hover {
  background: rgba(99,14,212,0.10);
  color: var(--primary);
}

:global([data-theme="dark"]) .tool-btn {
  background: rgba(255,255,255,0.06);
}
:global([data-theme="dark"]) .tool-btn:hover {
  background: rgba(168,85,247,0.14);
  color: var(--primary);
}

.tool-btn .material-symbols-outlined { font-size: 22px; }

/* Post button — full gradient pill */
.sheet-post-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.65rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 700;
  border-radius: var(--radius-full);
  background: var(--gradient-primary);
  border: none;
  color: #fff;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(99,14,212,0.4);
  transition: all 0.18s ease;
}

.sheet-post-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(99,14,212,0.5);
}

.sheet-post-btn:active { transform: scale(0.97); }

.sheet-post-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Sheet slide-up transition — spring */
.sheet-enter-active {
  transition: transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease;
}
.sheet-leave-active {
  transition: transform 0.25s ease, opacity 0.2s ease;
}
.sheet-enter-from  { transform: translateY(100%); opacity: 0; }
.sheet-leave-to    { transform: translateY(100%); opacity: 0; }

/* ─────────────────────────────────────────────────
   More Menu Drawer — premium bottom sheet
───────────────────────────────────────────────── */
.more-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 600;
  display: flex;
  align-items: flex-end;
}

.more-sheet {
  width: 100%;
  background: var(--surface-container-lowest);
  border-radius: var(--radius-2xl) var(--radius-2xl) 0 0;
  padding: 0.75rem 1.25rem calc(1.5rem + env(safe-area-inset-bottom, 0px));
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 85vh;
  overflow-y: auto;
}

:global([data-theme="dark"]) .more-sheet {
  background: #16161f;
  border-top: 1px solid rgba(168,85,247,0.15);
}

/* Frosted glass header with user info */
.more-sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.625rem 0.875rem;
  background: var(--surface-container);
  border-radius: var(--radius-xl);
}

:global([data-theme="dark"]) .more-sheet-header {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
}

.more-sheet-title {
  font-family: var(--font-headline);
  font-size: 1rem;
  font-weight: 700;
  color: var(--on-surface);
}

/* 4-column icon grid */
.more-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

/* More items — compact native feel */
.more-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 0.625rem 0.25rem;
  border-radius: var(--radius-xl);
  background: var(--surface-container-low);
  border: 1px solid var(--outline-variant);
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
  overflow: hidden; /* prevent label overflow */
  min-width: 0;
}

.more-item:hover,
.more-item.active {
  background: rgba(99,14,212,0.08);
  border-color: rgba(99,14,212,0.3);
  transform: scale(1.04);
}

:global([data-theme="dark"]) .more-item:hover,
:global([data-theme="dark"]) .more-item.active {
  background: rgba(168,85,247,0.12);
  border-color: rgba(168,85,247,0.3);
}

/* Colored circle icons per item */
.more-item-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--surface-container);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease;
}

.more-item:hover .more-item-icon,
.more-item.active .more-item-icon {
  background: rgba(99,14,212,0.12);
}

:global([data-theme="dark"]) .more-item:hover .more-item-icon,
:global([data-theme="dark"]) .more-item.active .more-item-icon {
  background: rgba(168,85,247,0.15);
}

.more-item .material-symbols-outlined {
  font-size: 20px;
  color: var(--on-surface-variant);
  transition: color 0.15s ease;
}

.more-item:hover .material-symbols-outlined,
.more-item.active .material-symbols-outlined {
  color: var(--primary);
}

.more-item-label {
  font-family: var(--font-headline);
  font-size: 0.6rem;
  font-weight: 600;
  color: var(--on-surface-variant);
  text-align: center;
  transition: color 0.15s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.more-item:hover .more-item-label,
.more-item.active .more-item-label {
  color: var(--primary);
}

.more-sheet-footer {
  padding-top: 0.75rem;
  border-top: 1px solid var(--outline-variant);
}

.more-signout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  background: var(--surface-container);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-lg);
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--on-surface-variant);
  cursor: pointer;
  transition: all 0.15s ease;
}

.more-signout-btn:hover {
  background: rgba(186,26,26,0.08);
  border-color: var(--error);
  color: var(--error);
}

.more-signout-btn .material-symbols-outlined { font-size: 18px; }

/* Feed page on mobile: hide user pill, keep back + GFD logo + theme toggle */
@media (max-width: 767px) {
  .feed-page .topnav-user-pill { display: none !important; }
}
</style>
