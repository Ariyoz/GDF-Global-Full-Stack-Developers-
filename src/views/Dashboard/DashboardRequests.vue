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
/* ── Layout ─────────────────────────────── */
.requests-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* ── Header ──────────────────────────────── */
.requests-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.requests-title {
  font-family: var(--font-headline);
  font-size: 1.375rem;
  font-weight: 800;
  color: var(--on-surface);
  letter-spacing: -0.02em;
}

/* btn-gfd-primary alias for btn-primary */
.btn-gfd-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1.125rem;
  background: var(--gradient-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-lg);
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: var(--transition-fast);
  box-shadow: var(--shadow-primary);
  white-space: nowrap;
}
.btn-gfd-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: var(--shadow-primary-lg);
}
.btn-gfd-primary:active {
  transform: translateY(0);
}

/* ── Requests Table ──────────────────────── */
.requests-table {
  padding: 0;
  overflow: hidden;
  border-radius: var(--radius-xl);
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 0.875rem 1.5rem;
  background: var(--surface-container);
  border-bottom: 1px solid var(--outline-variant);
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--on-surface-variant);
  text-transform: uppercase;
  letter-spacing: 0.07em;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--outline-variant);
  align-items: center;
  font-size: 0.875rem;
  transition: background 0.15s ease;
}
.table-row:last-child {
  border-bottom: none;
}
.table-row:hover {
  background: var(--surface-container-low);
}

.req-name {
  font-family: var(--font-headline);
  font-weight: 600;
  color: var(--on-surface);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.req-type {
  color: var(--on-surface-variant);
  font-size: 0.8125rem;
}
.req-budget {
  color: var(--on-surface-variant);
  font-family: var(--font-headline);
  font-weight: 600;
  font-size: 0.8125rem;
}
.req-date {
  color: var(--on-surface-variant);
  font-family: var(--font-mono);
  font-size: 0.775rem;
}

/* ── Empty State ─────────────────────────── */
.empty-requests {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.875rem;
  padding: 4rem 2rem;
  border-radius: var(--radius-xl);
}

.empty-icon {
  font-size: 3rem;
  line-height: 1;
  filter: grayscale(0.2);
}
.empty-title {
  font-family: var(--font-headline);
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--on-surface);
  letter-spacing: -0.01em;
}
.empty-desc {
  font-size: 0.875rem;
  color: var(--on-surface-variant);
  max-width: 400px;
  line-height: 1.6;
}

/* ── Responsive ──────────────────────────── */
@media (max-width: 640px) {
  .table-header,
  .table-row {
    grid-template-columns: 2fr 1fr 1fr;
  }
  /* Hide budget and date columns on very small screens */
  .table-header span:nth-child(4),
  .table-header span:nth-child(5),
  .table-row .req-budget,
  .table-row .req-date {
    display: none;
  }
}
</style>
