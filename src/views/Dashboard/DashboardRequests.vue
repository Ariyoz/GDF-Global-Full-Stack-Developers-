<template>
  <div class="requests-view">
    <div class="requests-header">
      <h2 class="requests-title">My Project Requests</h2>
      <RouterLink to="/hire" class="btn-gfd-primary">+ New Request</RouterLink>
    </div>

    <div v-if="requests.length" class="requests-table glass-card">
      <div class="table-header">
        <span>Project</span>
        <span>Type</span>
        <span>Budget</span>
        <span>Status</span>
        <span>Date</span>
      </div>
      <div v-for="req in requests" :key="req.id" class="table-row">
        <span class="req-name">{{ req.title }}</span>
        <span class="req-type">{{ req.type }}</span>
        <span class="req-budget">{{ req.budget }}</span>
        <GfdBadge :variant="statusVariant(req.status)">{{ req.status }}</GfdBadge>
        <span class="req-date">{{ req.date }}</span>
      </div>
    </div>

    <div v-else class="empty-requests glass-card">
      <div class="empty-icon">📋</div>
      <h3 class="empty-title">No requests yet</h3>
      <p class="empty-desc">Submit your first project request and our team will get back to you within 48 hours.</p>
      <RouterLink to="/hire" class="btn-gfd-primary">Submit a Project →</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import GfdBadge from '@/components/ui/GfdBadge.vue'

const requests = ref([])

function statusVariant(status) {
  const map = { pending: 'blue', active: 'green', completed: 'dark', cancelled: 'red' }
  return map[status] || 'dark'
}
</script>

<style scoped>
.requests-view { display: flex; flex-direction: column; gap: 1.5rem; }

.requests-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.requests-title { font-size: 1.25rem; font-weight: 800; color: var(--gfd-white); }

.requests-table { padding: 0; overflow: hidden; }

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 0.875rem 1.5rem;
  background: var(--glass-bg);
  border-bottom: 1px solid var(--glass-border);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--gfd-gray-600);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--glass-border);
  align-items: center;
  font-size: 0.875rem;
  transition: var(--transition-fast);
}

.table-row:last-child { border-bottom: none; }
.table-row:hover { background: var(--glass-bg); }

.req-name   { font-weight: 600; color: var(--gfd-white); }
.req-type   { color: var(--gfd-gray-600); }
.req-budget { color: var(--gfd-gray-600); }
.req-date   { color: var(--gfd-gray-600); font-family: var(--font-mono); font-size: 0.8rem; }

.empty-requests {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
  padding: 4rem 2rem;
}

.empty-icon  { font-size: 3rem; }
.empty-title { font-size: 1.1rem; font-weight: 700; color: var(--gfd-white); }
.empty-desc  { font-size: 0.875rem; color: var(--gfd-gray-600); max-width: 400px; line-height: 1.6; }
</style>
