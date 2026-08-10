<template>
  <aside class="admin-sidebar" :class="{ open }">
    <div class="admin-sidebar-inner">

      <!-- Logo Area -->
      <div class="sidebar-logo-area">
        <div class="sidebar-logo-left">
          <div class="sidebar-logo-mark">
            <img src="@/assets/icons/icon.png" alt="GFD" class="logo-img" />
          </div>
          <div class="sidebar-logo-text-wrap">
            <span class="sidebar-logo-title">GFD Admin</span>
            <span class="sidebar-logo-badge">Panel</span>
          </div>
        </div>
        <button class="sidebar-close-btn" @click="$emit('navigate')" aria-label="Close menu">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="admin-nav" role="navigation">

        <div class="nav-section-group">
          <p class="nav-section-label">Management</p>
          <RouterLink to="/admin" class="nav-link" :class="{ active: $route.path === '/admin' }" @click="$emit('navigate')">
            <span class="nav-link-icon material-symbols-outlined">dashboard</span>
            <span class="nav-link-label">Dashboard</span>
          </RouterLink>
          <RouterLink to="/admin/users" class="nav-link" :class="{ active: $route.path === '/admin/users' }" @click="$emit('navigate')">
            <span class="nav-link-icon material-symbols-outlined">group</span>
            <span class="nav-link-label">Users</span>
          </RouterLink>
          <RouterLink to="/admin/moderation" class="nav-link" :class="{ active: $route.path === '/admin/moderation' }" @click="$emit('navigate')">
            <span class="nav-link-icon material-symbols-outlined">gavel</span>
            <span class="nav-link-label">Moderation</span>
          </RouterLink>
          <RouterLink to="/admin/reports" class="nav-link" :class="{ active: $route.path === '/admin/reports' }" @click="$emit('navigate')">
            <span class="nav-link-icon material-symbols-outlined">flag</span>
            <span class="nav-link-label">Reports</span>
          </RouterLink>
          <RouterLink to="/admin/verification" class="nav-link" :class="{ active: $route.path === '/admin/verification' }" @click="$emit('navigate')">
            <span class="nav-link-icon material-symbols-outlined">verified</span>
            <span class="nav-link-label">Verification</span>
          </RouterLink>
          <RouterLink to="/admin/subscriptions" class="nav-link" :class="{ active: $route.path === '/admin/subscriptions' }" @click="$emit('navigate')">
            <span class="nav-link-icon material-symbols-outlined">credit_card</span>
            <span class="nav-link-label">Subscriptions</span>
          </RouterLink>
          <RouterLink to="/admin/wallet" class="nav-link" :class="{ active: $route.path === '/admin/wallet' }" @click="$emit('navigate')">
            <span class="nav-link-icon material-symbols-outlined">account_balance_wallet</span>
            <span class="nav-link-label">Wallet</span>
          </RouterLink>
          <RouterLink to="/admin/crypto" class="nav-link" :class="{ active: $route.path === '/admin/crypto' }" @click="$emit('navigate')">
            <span class="nav-link-icon" style="font-size:18px;width:24px;display:flex;align-items:center;justify-content:center">₿</span>
            <span class="nav-link-label">Crypto</span>
          </RouterLink>
          <RouterLink to="/admin/kyc" class="nav-link" :class="{ active: $route.path === '/admin/kyc' }" @click="$emit('navigate')">
            <span class="nav-link-icon material-symbols-outlined">verified_user</span>
            <span class="nav-link-label">KYC</span>
          </RouterLink>
          <RouterLink to="/admin/projects" class="nav-link" :class="{ active: $route.path === '/admin/projects' }" @click="$emit('navigate')">
            <span class="nav-link-icon material-symbols-outlined">folder_open</span>
            <span class="nav-link-label">Projects</span>
          </RouterLink>
        </div>

        <div class="nav-divider" />

        <div class="nav-section-group">
          <p class="nav-section-label">Systems</p>
          <RouterLink to="/admin/analytics" class="nav-link" :class="{ active: $route.path === '/admin/analytics' }" @click="$emit('navigate')">
            <span class="nav-link-icon material-symbols-outlined">analytics</span>
            <span class="nav-link-label">Analytics</span>
          </RouterLink>
          <RouterLink to="/admin/settings" class="nav-link" :class="{ active: $route.path === '/admin/settings' }" @click="$emit('navigate')">
            <span class="nav-link-icon material-symbols-outlined">settings</span>
            <span class="nav-link-label">Settings</span>
          </RouterLink>
        </div>
      </nav>

      <!-- Bottom section -->
      <div class="sidebar-bottom">
        <!-- Theme Toggle -->
        <div class="theme-toggle-row" @click="toggle" role="button" tabindex="0" :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'" @keydown.enter="toggle" @keydown.space.prevent="toggle">
          <div class="theme-toggle-left">
            <div class="theme-icon-wrap">
              <span class="material-symbols-outlined theme-icon">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
            </div>
            <span class="theme-label">{{ isDark ? 'Light Mode' : 'Dark Mode' }}</span>
          </div>
          <div class="toggle-pill" :class="{ active: isDark }">
            <div class="toggle-thumb" />
          </div>
        </div>

        <!-- Server Status -->
        <div class="server-status-card">
          <div class="server-status-row">
            <div class="status-pulse-wrap">
              <span class="status-pulse-dot" />
              <span class="status-pulse-ring" />
            </div>
            <span class="server-status-label">All Systems Operational</span>
          </div>
        </div>
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
/* ═══════════════════════════════════════════════
   Admin Sidebar — Premium Redesign
   ═══════════════════════════════════════════════ */

.admin-sidebar {
  width: 240px;
  flex-shrink: 0;
  background: var(--surface-container-lowest);
  border-right: 1px solid var(--outline-variant);
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 400;
  scrollbar-width: thin;
  scrollbar-color: var(--outline-variant) transparent;

  /* Mobile: off-screen drawer */
  position: fixed;
  top: 0; left: 0; bottom: 0;
  transform: translateX(-100%);
  transition: transform var(--transition-spring);
}

.admin-sidebar::-webkit-scrollbar { width: 4px; }
.admin-sidebar::-webkit-scrollbar-track { background: transparent; }
.admin-sidebar::-webkit-scrollbar-thumb { background: var(--outline-variant); border-radius: 4px; }

.admin-sidebar.open { transform: translateX(0); }

/* Desktop: static sidebar */
@media (min-width: 768px) {
  .admin-sidebar {
    position: sticky;
    top: 0;
    height: 100vh;
    transform: none;
  }
}

/* ── Inner layout ── */
.admin-sidebar-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0;
  min-height: 100vh;
}

/* ── Logo Area ── */
.sidebar-logo-area {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.125rem 1rem 1rem;
  border-bottom: 1px solid var(--outline-variant);
  flex-shrink: 0;
}

.sidebar-logo-left { display: flex; align-items: center; gap: 0.625rem; }

.sidebar-logo-mark {
  width: 34px; height: 34px;
  background: var(--gradient-primary);
  border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(99,14,212,0.3);
  overflow: hidden;
}

.logo-img {
  width: 100%; height: 100%;
  object-fit: contain;
  border-radius: 9px;
}

.sidebar-logo-text-wrap {
  display: flex; flex-direction: column; gap: 0.1rem;
}

.sidebar-logo-title {
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 800;
  color: var(--on-surface);
  letter-spacing: -0.02em;
  line-height: 1;
}

.sidebar-logo-badge {
  font-family: var(--font-headline);
  font-size: 0.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--primary);
  background: rgba(99,14,212,0.08);
  border: 1px solid rgba(99,14,212,0.18);
  padding: 0.08rem 0.35rem;
  border-radius: var(--radius-full);
  line-height: 1.4;
  width: fit-content;
}

[data-theme="dark"] .sidebar-logo-badge {
  background: rgba(168,85,247,0.1);
  border-color: rgba(168,85,247,0.25);
}

.sidebar-close-btn {
  width: 28px; height: 28px;
  display: flex; align-items: center; justify-content: center;
  background: none; border: none; border-radius: var(--radius-md);
  color: var(--on-surface-variant); cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
  flex-shrink: 0;
}
.sidebar-close-btn:hover { background: var(--surface-container); color: var(--on-surface); }
.sidebar-close-btn .material-symbols-outlined { font-size: 18px; }

@media (min-width: 768px) { .sidebar-close-btn { display: none; } }

/* ── Navigation ── */
.admin-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0.875rem 0.75rem;
  overflow-y: auto;
}

.nav-section-group { display: flex; flex-direction: column; gap: 0.125rem; }

.nav-section-label {
  font-family: var(--font-headline);
  font-size: 0.6rem;
  font-weight: 700;
  color: var(--on-surface-variant);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0.5rem 0.5rem 0.35rem;
  opacity: 0.6;
}

.nav-divider {
  height: 1px;
  background: var(--outline-variant);
  margin: 0.625rem 0.25rem;
  opacity: 0.6;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 0.625rem;
  border-radius: var(--radius-lg);
  font-family: var(--font-headline);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--on-surface-variant);
  text-decoration: none;
  transition: all 0.15s ease;
  position: relative;
  overflow: hidden;
}

.nav-link:hover {
  background: var(--surface-container-low);
  color: var(--on-surface);
}

.nav-link.active {
  background: rgba(99,14,212,0.08);
  color: var(--primary);
  font-weight: 700;
  border-left: 3px solid var(--primary);
  padding-left: calc(0.625rem - 3px);
}

[data-theme="dark"] .nav-link.active {
  background: rgba(168,85,247,0.1);
}

.nav-link.active::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(99,14,212,0.06), transparent);
  pointer-events: none;
}

[data-theme="dark"] .nav-link.active::before {
  background: linear-gradient(90deg, rgba(168,85,247,0.08), transparent);
}

.nav-link-icon {
  font-size: 18px;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.nav-link.active .nav-link-icon { font-variation-settings: 'FILL' 1; }
.nav-link:hover .nav-link-icon { transform: translateX(1px); }

.nav-link-label { line-height: 1; }

/* ── Bottom Section ── */
.sidebar-bottom {
  flex-shrink: 0;
  padding: 0.75rem;
  border-top: 1px solid var(--outline-variant);
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

/* Theme Toggle Row */
.theme-toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0.625rem;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: background 0.15s ease;
  user-select: none;
}

.theme-toggle-row:hover { background: var(--surface-container-low); }

.theme-toggle-left { display: flex; align-items: center; gap: 0.6rem; }

.theme-icon-wrap {
  width: 28px; height: 28px;
  border-radius: var(--radius-md);
  background: var(--surface-container);
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s ease;
}

.theme-icon { font-size: 16px; color: var(--on-surface-variant); }

.theme-label {
  font-family: var(--font-headline);
  font-size: 0.79rem;
  font-weight: 500;
  color: var(--on-surface-variant);
}

/* Toggle Pill */
.toggle-pill {
  width: 36px; height: 20px;
  background: var(--outline-variant);
  border-radius: 10px;
  padding: 2px;
  transition: background 0.2s ease;
  flex-shrink: 0;
  position: relative;
}

.toggle-pill.active { background: var(--primary); }

.toggle-thumb {
  width: 16px; height: 16px;
  background: white;
  border-radius: 50%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
}

.toggle-pill.active .toggle-thumb { transform: translateX(16px); }

/* Server Status */
.server-status-card {
  padding: 0.625rem 0.75rem;
  background: rgba(22,163,74,0.06);
  border: 1px solid rgba(22,163,74,0.2);
  border-radius: var(--radius-lg);
}

.server-status-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-pulse-wrap {
  position: relative;
  width: 10px; height: 10px;
  flex-shrink: 0;
}

.status-pulse-dot {
  position: absolute;
  inset: 1px;
  background: #16a34a;
  border-radius: 50%;
}

.status-pulse-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1.5px solid rgba(22,163,74,0.5);
  animation: pulse-ring 2s ease-out infinite;
}

@keyframes pulse-ring {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(2.2); opacity: 0; }
}

.server-status-label {
  font-family: var(--font-headline);
  font-size: 0.72rem;
  font-weight: 600;
  color: #16a34a;
}
</style>
