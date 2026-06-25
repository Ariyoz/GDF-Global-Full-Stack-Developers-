<template>
  <header class="navbar-gfd" :class="{ 'navbar-scrolled': scrolled }" role="banner">
    <div class="navbar-inner container-gfd">

      <!-- Logo -->
      <RouterLink to="/" class="navbar-logo" @click="closeMobileMenu">
        <span class="logo-text">GFD</span>
      </RouterLink>

      <!-- Desktop Nav -->
      <nav class="navbar-links" aria-label="Main navigation">
        <RouterLink
          v-for="link in NAV_LINKS"
          :key="link.to"
          :to="link.to"
          class="nav-link"
          :class="{ 'nav-link-active': isActive(link) }"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <!-- Desktop Actions -->
      <div class="navbar-actions">
        <!-- Theme Toggle -->
        <button class="icon-btn theme-btn" :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'" @click="toggle">
          <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">
            {{ isDark ? 'light_mode' : 'dark_mode' }}
          </span>
        </button>

        <template v-if="isAuthenticated">
          <button type="button" class="btn-ghost nav-signout" @click="handleSignOut">Sign Out</button>
          <RouterLink to="/messaging" class="icon-btn" aria-label="Messages">
            <span class="material-symbols-outlined">mail</span>
          </RouterLink>
          <RouterLink to="/notifications" class="icon-btn" aria-label="Notifications">
            <span class="material-symbols-outlined">notifications</span>
          </RouterLink>
          <RouterLink to="/dashboard" class="nav-avatar" aria-label="Dashboard">
            <span class="avatar-initials">{{ userInitials }}</span>
          </RouterLink>
        </template>
        <template v-else>
          <RouterLink to="/auth/login" class="btn-ghost nav-signin">Sign In</RouterLink>
          <RouterLink to="/hire" class="btn-primary nav-hire">Hire Talent</RouterLink>
        </template>
      </div>

      <!-- Mobile right side: theme toggle + hamburger -->
      <div class="mobile-right">
        <button class="icon-btn theme-btn" :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'" @click="toggle">
          <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">
            {{ isDark ? 'light_mode' : 'dark_mode' }}
          </span>
        </button>
        <button
          class="navbar-toggle"
          :aria-expanded="String(mobileMenuOpen)"
          aria-label="Toggle navigation"
          @click="toggleMobileMenu"
        >
          <span class="material-symbols-outlined">{{ mobileMenuOpen ? 'close' : 'menu' }}</span>
        </button>
      </div>
    </div>

    <!-- Mobile Drawer -->
    <Transition name="mobile-menu">
      <div v-if="mobileMenuOpen" class="mobile-menu" role="navigation" aria-label="Mobile navigation">
        <nav class="mobile-nav">
          <RouterLink
            v-for="link in NAV_LINKS"
            :key="link.to"
            :to="link.to"
            class="mobile-nav-link"
            :class="{ 'mobile-nav-link-active': isActive(link) }"
            @click="closeMobileMenu"
          >
            {{ link.label }}
          </RouterLink>
        </nav>
        <div class="mobile-actions">
          <template v-if="isAuthenticated">
            <button type="button" class="mobile-action-btn mobile-action-outline" @click="handleSignOut">
              Sign Out
            </button>
            <RouterLink to="/messaging" class="mobile-action-btn mobile-action-outline" @click="closeMobileMenu">
              Messages
            </RouterLink>
            <RouterLink to="/dashboard" class="mobile-action-btn mobile-action-primary" @click="closeMobileMenu">
              Dashboard
            </RouterLink>
          </template>
          <template v-else>
            <RouterLink to="/auth/login" class="mobile-action-btn mobile-action-outline" @click="closeMobileMenu">
              Sign In
            </RouterLink>
            <RouterLink to="/hire" class="mobile-action-btn mobile-action-primary" @click="closeMobileMenu">
              Hire Talent
            </RouterLink>
          </template>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUiStore }   from '@/store/ui'
import { useAuthStore } from '@/store/auth'
import { NAV_LINKS }    from '@/constants'
import { useTheme }     from '@/composables/useTheme'

const route     = useRoute()
const router    = useRouter()
const uiStore   = useUiStore()
const authStore = useAuthStore()

const { mobileMenuOpen }                    = storeToRefs(uiStore)
const { isAuthenticated, user }             = storeToRefs(authStore)
const { toggleMobileMenu, closeMobileMenu } = uiStore
const { isDark, toggle }                    = useTheme()

const scrolled = ref(false)

const userInitials = computed(() => {
  const name = user.value?.name || 'GFD'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

function isActive(link) {
  if (link.exact) return route.path === link.to
  return route.path.startsWith(link.to)
}

function handleSignOut() {
  authStore.logout()
  closeMobileMenu()
  router.push('/')
}

function handleScroll() {
  scrolled.value = window.scrollY > 10
}

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
/* ── Shell ── */
.navbar-gfd {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 1000;
  width: 100%;
  max-width: 100vw;
  overflow: hidden;
  padding-top: env(safe-area-inset-top, 0px);
  background: rgba(249, 249, 255, 0.92);
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.3s ease;
}

.navbar-gfd.navbar-scrolled {
  border-bottom-color: var(--outline-variant);
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
}

/* ── Inner ── */
.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  gap: 0.75rem;
  padding: 0 1rem;
  width: 100%;
  box-sizing: border-box;
}

@media (max-width: 640px) {
  .navbar-inner {
    gap: 0.5rem;
    padding: 0 0.75rem;
  }
  .mobile-right {
    gap: 0.25rem;
  }
}

/* ── Logo ── */
.navbar-logo { text-decoration: none; flex-shrink: 0; }

.logo-text {
  font-family: var(--font-headline);
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--on-surface);
  letter-spacing: -0.02em;
  transition: color 0.3s ease;
}

/* ── Desktop nav ── */
.navbar-links {
  display: none;
  align-items: center;
  gap: 0.125rem;
  flex: 1;
}
@media (min-width: 768px) { .navbar-links { display: flex; } }

.nav-link {
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 400;
  color: var(--on-surface-variant);
  text-decoration: none;
  padding: 0.375rem 0.625rem;
  border-radius: var(--radius-lg);
  transition: color 0.15s ease, background 0.15s ease;
}
.nav-link:hover { color: var(--primary); background: rgba(168,85,247,0.06); }
.nav-link-active { color: var(--primary); font-weight: 600; background: rgba(168,85,247,0.08); }

/* ── Desktop actions ── */
.navbar-actions {
  display: none;
  align-items: center;
  gap: 0.375rem;
  margin-left: auto;
  flex-shrink: 0;
}
@media (min-width: 768px) { .navbar-actions { display: flex; } }

/* ── Icon button (shared) ── */
.icon-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: var(--radius-full);
  color: var(--on-surface-variant);
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
  text-decoration: none;
  flex-shrink: 0;
}
.icon-btn:hover { background: rgba(168,85,247,0.08); color: var(--primary); }
.icon-btn .material-symbols-outlined { font-size: 20px; }

/* Theme button */
.theme-btn { color: var(--on-surface-variant); }
.theme-btn:hover { color: var(--primary); }

/* ── Avatar ── */
.nav-avatar {
  width: 34px;
  height: 34px;
  border-radius: var(--radius-full);
  border: 1.5px solid var(--outline-variant);
  background: var(--surface-container);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  cursor: pointer;
  transition: border-color 0.15s ease;
}
.nav-avatar:hover { border-color: var(--primary); }

.avatar-initials {
  font-family: var(--font-headline);
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--primary);
}

/* Compact nav buttons — tighter padding so they don't overflow */
.nav-signin {
  font-size: 0.8rem;
  padding: 0.35rem 0.75rem;
  border-radius: var(--radius-lg);
  white-space: nowrap;
}
.nav-signout {
  font-size: 0.8rem;
  padding: 0.35rem 0.75rem;
  border-radius: var(--radius-lg);
  white-space: nowrap;
}
.nav-hire {
  font-size: 0.8rem;
  padding: 0.4rem 0.875rem;
  white-space: nowrap;
}

/* ── Mobile right cluster ── */
.mobile-right {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-left: auto;
}
@media (min-width: 768px) { .mobile-right { display: none; } }

/* ── Hamburger ── */
.navbar-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--on-surface);
  padding: 0.375rem;
  border-radius: var(--radius-lg);
  transition: background 0.15s ease;
}
.navbar-toggle:hover { background: rgba(168,85,247,0.06); }
.navbar-toggle .material-symbols-outlined { font-size: 24px; }

/* ── Mobile Drawer ── */
.mobile-menu {
  background: var(--surface-container-lowest);
  border-top: 1px solid var(--outline-variant);
  padding: 0.75rem 0.75rem 1.25rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  margin-bottom: 1rem;
}

.mobile-nav-link {
  display: block;
  padding: 0.75rem 1rem;
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 400;
  color: var(--on-surface-variant);
  text-decoration: none;
  border-radius: var(--radius-lg);
  transition: color 0.15s ease, background 0.15s ease;
}
.mobile-nav-link:hover,
.mobile-nav-link-active { color: var(--primary); background: rgba(168,85,247,0.06); }
.mobile-nav-link-active { font-weight: 600; }

.mobile-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--outline-variant);
}

.mobile-action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-lg);
  font-family: var(--font-headline);
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.15s ease;
  cursor: pointer;
  border: none;
  color: var(--on-surface);
  background: var(--surface-container);
}

.mobile-action-btn:hover {
  background: var(--surface-container-low);
}

.mobile-action-outline {
  background: transparent;
  border: 1px solid var(--outline-variant);
  color: var(--on-surface);
}
.mobile-action-outline:hover { border-color: var(--primary); color: var(--primary); }

.mobile-action-primary {
  background: var(--primary);
  color: var(--on-primary);
  box-shadow: 0 2px 12px rgba(168,85,247,0.3);
}
.mobile-action-primary:hover { background: var(--primary-container); }

/* ── Transition ── */
.mobile-menu-enter-active,
.mobile-menu-leave-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.mobile-menu-enter-from,
.mobile-menu-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
