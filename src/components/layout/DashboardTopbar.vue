<template>
  <header class="dash-topbar">
    <div class="topbar-left">
      <h1 class="topbar-title">{{ pageTitle }}</h1>
    </div>
    <div class="topbar-right">
      <RouterLink to="/" class="btn-gfd-ghost topbar-btn">← Back to Site</RouterLink>
      <div class="topbar-avatar">{{ userInitials }}</div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/store/auth'

const route     = useRoute()
const authStore = useAuthStore()
const { user }  = storeToRefs(authStore)

const pageTitles = {
  dashboard:           'Overview',
  'dashboard-requests':'My Requests',
  'dashboard-profile': 'Profile',
}

const pageTitle = computed(() => pageTitles[route.name] || 'Dashboard')

const userInitials = computed(() => {
  const name = user.value?.name || 'GFD'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})
</script>

<style scoped>
.dash-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  border-bottom: 1px solid var(--glass-border);
  background: var(--gfd-black-soft);
  position: sticky;
  top: 0;
  z-index: 100;
}

.topbar-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--gfd-white);
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.topbar-btn {
  font-size: 0.85rem;
}

.topbar-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--gfd-green-dim);
  border: 1px solid var(--glass-border-green);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--gfd-green);
  cursor: pointer;
}
</style>
