<template>
  <header class="navbar" :class="{ scrolled }" role="banner">
    <div class="nav-inner">

      <!-- Logo -->
      <RouterLink to="/" class="nav-logo" @click="closeMobileMenu">
        <img src="@/assets/icons/icon.png" alt="GFD" class="logo-img" />
        <span class="logo-txt">GFD</span>
      </RouterLink>

      <!-- Desktop centre links -->
      <nav class="nav-centre" aria-label="Main navigation">
        <RouterLink v-for="l in NAV_LINKS" :key="l.to" :to="l.to"
          class="nav-lnk" :class="{ active: isActive(l) }">
          {{ l.label }}
        </RouterLink>
      </nav>

      <!-- Desktop right actions -->
      <div class="nav-right">
        <!-- Theme toggle -->
        <button class="icon-btn" @click="toggle" :title="isDark ? 'Light mode' : 'Dark mode'">
          <span class="material-symbols-outlined" style="font-size:18px;font-variation-settings:'FILL' 1">
            {{ isDark ? 'light_mode' : 'dark_mode' }}
          </span>
        </button>

        <template v-if="isAuthenticated">
          <RouterLink to="/notifications" class="icon-btn" title="Notifications">
            <span class="material-symbols-outlined" style="font-size:18px">notifications</span>
          </RouterLink>
          <RouterLink to="/dashboard" class="user-pill" title="Dashboard">
            <span class="user-initials">{{ userInitials }}</span>
            <span class="user-name">{{ firstName }}</span>
            <span class="material-symbols-outlined" style="font-size:14px;opacity:.5">expand_more</span>
          </RouterLink>
        </template>
        <template v-else>
          <RouterLink to="/auth/login" class="btn-ghost-nav">Sign In</RouterLink>
          <RouterLink to="/auth/register" class="btn-primary-nav">
            Get Started
            <span class="material-symbols-outlined" style="font-size:14px">arrow_forward</span>
          </RouterLink>
        </template>
      </div>

      <!-- Mobile: theme + menu -->
      <div class="mob-right">
        <button class="icon-btn" @click="toggle">
          <span class="material-symbols-outlined" style="font-size:18px;font-variation-settings:'FILL' 1">
            {{ isDark ? 'light_mode' : 'dark_mode' }}
          </span>
        </button>
        <button class="icon-btn" @click="toggleMobileMenu" :aria-expanded="String(mobileMenuOpen)">
          <span class="material-symbols-outlined" style="font-size:22px">
            {{ mobileMenuOpen ? 'close' : 'menu' }}
          </span>
        </button>
      </div>

    </div>

    <!-- Mobile drawer -->
    <Transition name="drawer">
      <div v-if="mobileMenuOpen" class="mob-drawer">
        <nav class="mob-links">
          <RouterLink v-for="l in NAV_LINKS" :key="l.to" :to="l.to"
            class="mob-lnk" :class="{ active: isActive(l) }"
            @click="closeMobileMenu">
            {{ l.label }}
          </RouterLink>
        </nav>
        <div class="mob-actions">
          <template v-if="isAuthenticated">
            <RouterLink to="/dashboard" class="mob-btn mob-primary" @click="closeMobileMenu">Dashboard</RouterLink>
            <button class="mob-btn mob-ghost" @click="handleSignOut">Sign Out</button>
          </template>
          <template v-else>
            <RouterLink to="/auth/login" class="mob-btn mob-ghost" @click="closeMobileMenu">Sign In</RouterLink>
            <RouterLink to="/auth/register" class="mob-btn mob-primary" @click="closeMobileMenu">Get Started →</RouterLink>
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
  const name = user.value?.full_name || user.value?.name || 'GFD'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const firstName = computed(() => {
  const name = user.value?.full_name || user.value?.name || ''
  return name.split(' ')[0] || 'Account'
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

function onScroll() { scrolled.value = window.scrollY > 12 }
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
/* ── Shell ── */
.navbar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
  padding-top: env(safe-area-inset-top, 0px);
  transition: background .25s, border-color .2s, box-shadow .2s;
  /* Default: transparent, transitions to frosted glass on scroll */
  background: transparent;
  border-bottom: 1px solid transparent;
}
.navbar.scrolled {
  background: rgba(249,249,255,.82);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom-color: var(--outline-variant);
  box-shadow: 0 1px 32px rgba(0,0,0,.06);
}
[data-theme="dark"] .navbar.scrolled {
  background: rgba(13,13,20,.85);
  border-bottom-color: rgba(168,85,247,.12);
  box-shadow: 0 1px 32px rgba(0,0,0,.4);
}

/* ── Inner container ── */
.nav-inner {
  max-width: 1280px; margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between;
  height: 68px; padding: 0 1.25rem; gap: 1rem; box-sizing: border-box;
}
@media (min-width: 1024px) { .nav-inner { padding: 0 2rem; } }

/* ── Logo ── */
.nav-logo { display: flex; align-items: center; gap: .5rem; text-decoration: none; flex-shrink: 0; }
.logo-img { width: 32px; height: 32px; border-radius: 9px; object-fit: contain; }
.logo-txt {
  font-family: var(--font-headline); font-size: 1.2rem; font-weight: 900;
  color: var(--on-surface); letter-spacing: -.025em;
}

/* ── Centre nav ── */
.nav-centre {
  display: none; align-items: center; gap: .25rem;
  position: absolute; left: 50%; transform: translateX(-50%);
}
@media (min-width: 768px) { .nav-centre { display: flex; } }

.nav-lnk {
  padding: .45rem 1rem; border-radius: 999px;
  font-family: var(--font-headline); font-size: .875rem; font-weight: 500;
  color: var(--on-surface-variant); text-decoration: none;
  transition: color .15s, background .15s;
}
.nav-lnk:hover  { color: var(--on-surface); background: var(--surface-container); }
.nav-lnk.active { color: var(--primary); background: var(--primary-fixed); font-weight: 700; }

/* ── Right actions ── */
.nav-right { display: none; align-items: center; gap: .375rem; }
@media (min-width: 768px) { .nav-right { display: flex; } }

.icon-btn {
  width: 36px; height: 36px; border-radius: 10px; border: none; background: none;
  display: flex; align-items: center; justify-content: center;
  color: var(--on-surface-variant); cursor: pointer;
  transition: background .15s, color .15s; text-decoration: none; flex-shrink: 0;
}
.icon-btn:hover { background: var(--surface-container); color: var(--primary); }

.user-pill {
  display: flex; align-items: center; gap: .5rem;
  padding: .3rem .75rem .3rem .3rem; border-radius: 999px;
  background: var(--surface-container-low);
  border: 1px solid var(--outline-variant);
  text-decoration: none; cursor: pointer;
  transition: border-color .15s, background .15s;
}
.user-pill:hover { border-color: var(--primary); background: var(--primary-fixed); }
.user-initials {
  width: 28px; height: 28px; border-radius: 50%;
  background: var(--primary); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-headline); font-size: .68rem; font-weight: 800; flex-shrink: 0;
}
.user-name {
  font-family: var(--font-headline); font-size: .82rem; font-weight: 600;
  color: var(--on-surface); max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}

.btn-ghost-nav {
  padding: .45rem .875rem; border-radius: 999px;
  background: none; border: 1.5px solid var(--outline-variant);
  font-family: var(--font-headline); font-size: .85rem; font-weight: 600;
  color: var(--on-surface); text-decoration: none; white-space: nowrap;
  transition: border-color .15s, color .15s;
}
.btn-ghost-nav:hover { border-color: var(--primary); color: var(--primary); }

.btn-primary-nav {
  display: inline-flex; align-items: center; gap: .3rem;
  padding: .5rem 1.125rem; border-radius: 999px;
  background: var(--primary); color: #fff; border: none;
  font-family: var(--font-headline); font-size: .85rem; font-weight: 700;
  text-decoration: none; white-space: nowrap;
  box-shadow: 0 2px 16px rgba(99,14,212,.3);
  transition: opacity .15s, transform .1s;
}
.btn-primary-nav:hover { opacity: .9; transform: translateY(-1px); }

/* ── Mobile right ── */
.mob-right { display: flex; align-items: center; gap: .25rem; }
@media (min-width: 768px) { .mob-right { display: none; } }

/* ── Mobile drawer ── */
.mob-drawer {
  border-top: 1px solid var(--outline-variant);
  background: var(--surface-container-lowest);
  padding: .875rem 1.25rem calc(1.5rem + env(safe-area-inset-bottom,0px));
}
[data-theme="dark"] .mob-drawer { background: #111118; }

.mob-links { display: flex; flex-direction: column; gap: .125rem; margin-bottom: 1rem; }
.mob-lnk {
  display: block; padding: .75rem 1rem; border-radius: 12px;
  font-family: var(--font-headline); font-size: .95rem; font-weight: 500;
  color: var(--on-surface-variant); text-decoration: none;
  transition: background .15s, color .15s;
}
.mob-lnk:hover, .mob-lnk.active { background: var(--primary-fixed); color: var(--primary); font-weight: 700; }

.mob-actions {
  display: flex; flex-direction: column; gap: .5rem;
  padding-top: .875rem; border-top: 1px solid var(--outline-variant);
}
.mob-btn {
  display: flex; align-items: center; justify-content: center; width: 100%;
  padding: .8rem 1rem; border-radius: 14px;
  font-family: var(--font-headline); font-size: .9rem; font-weight: 700;
  text-decoration: none; cursor: pointer; border: none; transition: all .15s;
}
.mob-primary { background: var(--primary); color: #fff; box-shadow: 0 2px 12px rgba(99,14,212,.3); }
.mob-primary:hover { opacity: .9; }
.mob-ghost { background: none; border: 1.5px solid var(--outline-variant); color: var(--on-surface); }
.mob-ghost:hover { border-color: var(--primary); color: var(--primary); }

/* ── Transition ── */
.drawer-enter-active, .drawer-leave-active { transition: opacity .18s, transform .18s; }
.drawer-enter-from, .drawer-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
