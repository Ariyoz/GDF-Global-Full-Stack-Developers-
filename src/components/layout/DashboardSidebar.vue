<template>
  <aside class="dash-sidebar" :class="{ open: sidebarOpen }">
    <div class="sidebar-header">
      <RouterLink to="/" class="sidebar-logo">
        <span class="logo-badge">GFD</span>
      </RouterLink>
      <button class="sidebar-close" @click="sidebarOpen = false">✕</button>
    </div>

    <nav class="sidebar-nav">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="sidebar-link"
        active-class="sidebar-link-active"
      >
        <span class="sidebar-icon">{{ item.icon }}</span>
        <span>{{ item.label }}</span>
      </RouterLink>

      <!-- Admin links (only for admin users) -->
      <template v-if="authStore.isAdmin">
        <div class="sidebar-divider" />
        <RouterLink
          v-for="item in adminNavItems"
          :key="item.to"
          :to="item.to"
          class="sidebar-link sidebar-link-admin"
          active-class="sidebar-link-active"
        >
          <span class="sidebar-icon">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </RouterLink>
      </template>
    </nav>

    <div class="sidebar-footer">
      <div class="sidebar-user">
        <div class="user-avatar">{{ userInitials }}</div>
        <div class="user-info">
          <p class="user-name">{{ user?.name || 'Developer' }}</p>
          <p class="user-role">{{ user?.role || 'Member' }}</p>
        </div>
      </div>
      <button class="btn-gfd-ghost sidebar-logout" @click="handleLogout">
        ⎋ Sign Out
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/store/auth'

const router    = useRouter()
const authStore = useAuthStore()
const { user }  = storeToRefs(authStore)

const sidebarOpen = ref(false)

const userInitials = computed(() => {
  const name = user.value?.name || 'GFD'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const navItems = [
  { to: '/dashboard',          icon: '⊞', label: 'Overview' },
  { to: '/dashboard/requests', icon: '📋', label: 'My Requests' },
  { to: '/dashboard/profile',  icon: '◉', label: 'Profile' },
]

const adminNavItems = [
  { to: '/admin', icon: '🛡️', label: 'Admin Panel' },
]

async function handleLogout() {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.dash-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 260px;
  background: var(--gfd-black-soft);
  border-right: 1px solid var(--glass-border);
  display: flex;
  flex-direction: column;
  z-index: 200;
  transition: transform 0.3s ease;
}

@media (max-width: 1024px) {
  .dash-sidebar {
    transform: translateX(-100%);
  }
  .dash-sidebar.open {
    transform: translateX(0);
  }
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.25rem;
  border-bottom: 1px solid var(--glass-border);
}

.sidebar-logo { text-decoration: none; }

.logo-badge {
  font-size: 0.9rem;
  font-weight: 900;
  color: var(--gfd-green);
  background: var(--gfd-green-dim);
  border: 1px solid var(--glass-border-green);
  padding: 0.3rem 0.7rem;
  border-radius: var(--radius-sm);
}

.sidebar-close {
  background: none;
  border: none;
  color: var(--gfd-gray-600);
  cursor: pointer;
  font-size: 1rem;
  display: none;
}

@media (max-width: 1024px) {
  .sidebar-close { display: block; }
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  overflow-y: auto;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--gfd-gray-600);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: var(--transition-fast);
}

.sidebar-link:hover {
  color: var(--gfd-white);
  background: var(--glass-bg);
}

.sidebar-link-active {
  color: var(--gfd-green);
  background: var(--gfd-green-dim);
  border: 1px solid var(--glass-border-green);
}

.sidebar-icon { font-size: 1rem; }

.sidebar-divider {
  height: 1px;
  background: var(--glass-border);
  margin: 0.5rem 0;
}

.sidebar-link-admin {
  color: var(--gfd-gray-600);
}

.sidebar-footer {
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--glass-border);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.sidebar-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--gfd-green-dim);
  border: 1px solid var(--glass-border-green);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--gfd-green);
  flex-shrink: 0;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--gfd-white);
}

.user-role {
  font-size: 0.75rem;
  color: var(--gfd-gray-600);
  text-transform: capitalize;
}

.sidebar-logout {
  width: 100%;
  justify-content: center;
  font-size: 0.85rem;
}
</style>
