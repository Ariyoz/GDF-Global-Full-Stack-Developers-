<template>
  <aside class="admin-sidebar" :class="{ open }">
    <div class="admin-sidebar-inner">
      <div class="admin-sidebar-top">
        <div class="admin-logo">
          <span class="material-symbols-outlined" style="color:var(--primary)">shield</span>
          <span class="admin-logo-text">GFD Admin</span>
        </div>
        <button class="sidebar-close-btn" @click="$emit('navigate')">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <nav class="admin-nav">
        <p class="admin-nav-section">Management</p>
        <RouterLink to="/admin" class="admin-nav-link" :class="{ active: $route.path === '/admin' }" @click="$emit('navigate')">
          <span class="material-symbols-outlined">dashboard</span> Dashboard
        </RouterLink>
        <RouterLink to="/admin/users" class="admin-nav-link" :class="{ active: $route.path === '/admin/users' }" @click="$emit('navigate')">
          <span class="material-symbols-outlined">group</span> Users
        </RouterLink>
        <RouterLink to="/admin/moderation" class="admin-nav-link" :class="{ active: $route.path === '/admin/moderation' }" @click="$emit('navigate')">
          <span class="material-symbols-outlined">gavel</span> Moderation
        </RouterLink>
        <RouterLink to="/admin/reports" class="admin-nav-link" :class="{ active: $route.path === '/admin/reports' }" @click="$emit('navigate')">
          <span class="material-symbols-outlined">flag</span> Reports
        </RouterLink>
        <RouterLink to="/admin/verification" class="admin-nav-link" :class="{ active: $route.path === '/admin/verification' }" @click="$emit('navigate')">
          <span class="material-symbols-outlined">verified</span> Verification
        </RouterLink>
        <RouterLink to="/admin/subscriptions" class="admin-nav-link" :class="{ active: $route.path === '/admin/subscriptions' }" @click="$emit('navigate')">
          <span class="material-symbols-outlined">credit_card</span> Subscriptions
        </RouterLink>
        <RouterLink to="/admin/wallet" class="admin-nav-link" :class="{ active: $route.path === '/admin/wallet' }" @click="$emit('navigate')">
          <span class="material-symbols-outlined">account_balance_wallet</span> Wallet & Withdrawals
        </RouterLink>
        <div class="admin-nav-divider" />
        <p class="admin-nav-section">Systems</p>
        <RouterLink to="/admin/analytics" class="admin-nav-link" :class="{ active: $route.path === '/admin/analytics' }" @click="$emit('navigate')">
          <span class="material-symbols-outlined">analytics</span> Platform Analytics
        </RouterLink>
        <RouterLink to="/admin/settings" class="admin-nav-link" :class="{ active: $route.path === '/admin/settings' }" @click="$emit('navigate')">
          <span class="material-symbols-outlined">settings</span> Settings
        </RouterLink>
      </nav>
      <div class="admin-theme-toggle">
        <button class="theme-toggle-btn" @click="toggle">
          <span class="material-symbols-outlined" style="font-size:18px">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
          <span>{{ isDark ? 'Light Mode' : 'Dark Mode' }}</span>
        </button>
      </div>
      <div class="admin-server-status glass-card-static">
        <div class="server-status-row">
          <span class="status-dot status-dot-green" />
          <span class="server-status-label">Server Status</span>
        </div>
        <p class="server-status-desc">All systems operational</p>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { useTheme } from '@/composables/useTheme'

defineProps({
  open: { type: Boolean, default: false }
})
defineEmits(['navigate'])

const { isDark, toggle } = useTheme()
</script>

<style scoped>
.admin-sidebar {
  width: 260px;
  flex-shrink: 0;
  background: var(--surface-container-lowest);
  border-right: 1px solid var(--outline-variant);
  overflow-y: auto;
  z-index: 400;

  /* Mobile: off-screen drawer */
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  transform: translateX(-100%);
  transition: transform 0.25s ease;
}

.admin-sidebar.open {
  transform: translateX(0);
}

/* Desktop: static sidebar */
@media (min-width: 768px) {
  .admin-sidebar {
    position: sticky;
    top: 0;
    height: 100vh;
    transform: none;
  }
}

.admin-sidebar-inner {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 1rem;
}

.admin-sidebar-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.admin-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
}

.admin-logo-text {
  font-family: var(--font-headline);
  font-size: 1rem;
  font-weight: 700;
  color: var(--on-surface);
}

.sidebar-close-btn {
  width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center;
  background: none; border: none; border-radius: var(--radius-lg);
  color: var(--on-surface-variant); cursor: pointer;
  transition: background 0.15s ease;
}
.sidebar-close-btn:hover { background: var(--surface-container); }

@media (min-width: 768px) { .sidebar-close-btn { display: none; } }

.admin-nav { display: flex; flex-direction: column; gap: 0.125rem; flex: 1; }

.admin-nav-section {
  font-family: var(--font-headline);
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--on-surface-variant);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.5rem 0.5rem 0.25rem;
}

.admin-nav-link {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.6rem 0.75rem;
  border-radius: var(--radius-lg);
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--on-surface-variant);
  text-decoration: none;
  transition: all 0.15s ease;
}

.admin-nav-link:hover { background: var(--surface-container-low); color: var(--on-surface); }
.admin-nav-link.active { background: rgba(168,85,247,0.08); color: var(--primary); font-weight: 700; }
.admin-nav-link .material-symbols-outlined { font-size: 20px; }

.admin-nav-divider { height: 1px; background: var(--outline-variant); margin: 0.5rem 0; }

.admin-server-status { padding: 0.875rem; border-radius: var(--radius-lg); }

.admin-theme-toggle { margin-top: auto; }

.theme-toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  width: 100%;
  padding: 0.6rem 0.75rem;
  background: var(--surface-container-low);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-lg);
  font-family: var(--font-headline);
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--on-surface-variant);
  cursor: pointer;
  transition: all 0.15s ease;
}
.theme-toggle-btn:hover { background: var(--surface-container); color: var(--on-surface); }

.server-status-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.server-status-label { font-family: var(--font-headline); font-size: 0.8rem; font-weight: 700; color: var(--on-surface); }
.server-status-desc  { font-size: 0.75rem; color: var(--on-surface-variant); }

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot-green { background: #16a34a; }
</style>
