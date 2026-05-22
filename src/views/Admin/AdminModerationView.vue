<template>
  <div class="admin-moderation-view">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="text-headline-lg">Content Moderation</h1>
        <p class="text-body-md" style="margin-top:0.25rem">Review flagged posts, comments, and reported content.</p>
      </div>
      <div class="header-actions">
        <button class="btn-outline" @click="refreshQueue">
          <span class="material-symbols-outlined" style="font-size:18px">refresh</span>
          Refresh
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="mod-stats">
      <div v-for="stat in modStats" :key="stat.label" class="mod-stat-card glass-card-static">
        <div class="mstat-icon-wrap" :style="{ background: stat.bg }">
          <span class="material-symbols-outlined mstat-icon" :style="{ color: stat.color }">{{ stat.icon }}</span>
        </div>
        <div>
          <p class="mstat-label">{{ stat.label }}</p>
          <h4 class="mstat-value" :style="stat.valueColor ? { color: stat.valueColor } : {}">{{ stat.value }}</h4>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="mod-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        class="mod-tab"
        :class="{ active: activeTab === tab.value }"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
        <span v-if="tab.badge" class="tab-badge">{{ tab.badge }}</span>
      </button>
    </div>

    <!-- Moderation Queue -->
    <div class="mod-queue">
      <div
        v-for="item in filteredItems"
        :key="item.id"
        class="mod-item glass-card-static"
      >
        <!-- Item Header -->
        <div class="mod-item-header">
          <div class="mod-item-user">
            <div class="mod-avatar">{{ item.author[0] }}</div>
            <div>
              <p class="mod-author-name">{{ item.author }}</p>
              <p class="mod-meta">{{ item.time }} · {{ item.type }}</p>
            </div>
          </div>
          <div class="mod-item-flags">
            <span class="flag-chip" :class="severityClass(item.severity)">
              <span class="material-symbols-outlined" style="font-size:14px">flag</span>
              {{ item.severity }}
            </span>
            <span class="report-count">{{ item.reportCount }} report{{ item.reportCount > 1 ? 's' : '' }}</span>
          </div>
        </div>

        <!-- Item Content -->
        <div class="mod-item-content">
          <p class="mod-text">{{ item.content }}</p>
          <img v-if="item.imageUrl" :src="item.imageUrl" class="mod-image" alt="Flagged content" />
        </div>

        <!-- Report Reasons -->
        <div class="mod-reasons">
          <span class="reason-label">Reported for:</span>
          <span v-for="reason in item.reasons" :key="reason" class="reason-chip">{{ reason }}</span>
        </div>

        <!-- Actions -->
        <div class="mod-item-actions">
          <button class="btn-outline mod-action-btn" @click="dismissItem(item.id)">
            <span class="material-symbols-outlined" style="font-size:16px">check_circle</span>
            Dismiss
          </button>
          <button class="btn-outline mod-action-btn warn" @click="warnUser(item)">
            <span class="material-symbols-outlined" style="font-size:16px">warning</span>
            Warn User
          </button>
          <button class="btn-primary mod-action-btn danger" @click="removeContent(item.id)">
            <span class="material-symbols-outlined" style="font-size:16px">delete</span>
            Remove Content
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredItems.length === 0" class="mod-empty glass-card-static">
        <span class="material-symbols-outlined" style="font-size:3rem;color:var(--outline)">verified_user</span>
        <h3 class="mod-empty-title">All Clear!</h3>
        <p class="mod-empty-desc">No flagged content in this category. The community is behaving well.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('pending')

const tabs = [
  { value: 'pending',  label: 'Pending Review', badge: 8 },
  { value: 'posts',    label: 'Flagged Posts',   badge: 5 },
  { value: 'comments', label: 'Flagged Comments', badge: 3 },
  { value: 'resolved', label: 'Resolved',        badge: null },
]

const modStats = [
  { icon: 'flag',           label: 'Pending Flags',   value: '0',  color: 'var(--error)',    bg: 'var(--error-container)',  valueColor: 'var(--error)' },
  { icon: 'gavel',          label: 'Resolved Today',  value: '0',  color: 'var(--primary)',  bg: 'var(--primary-fixed)' },
  { icon: 'person_off',     label: 'Users Warned',    value: '0',  color: 'var(--tertiary)', bg: 'var(--tertiary-fixed)',   valueColor: 'var(--tertiary)' },
  { icon: 'delete_forever', label: 'Content Removed', value: '0',  color: 'var(--on-surface-variant)', bg: 'var(--surface-container-high)' },
]

const moderationItems = ref([])

const filteredItems = computed(() => {
  if (activeTab.value === 'pending') return moderationItems.value.filter(i => i.status === 'pending')
  if (activeTab.value === 'posts') return moderationItems.value.filter(i => i.type === 'Post' && i.status === 'pending')
  if (activeTab.value === 'comments') return moderationItems.value.filter(i => i.type === 'Comment' && i.status === 'pending')
  if (activeTab.value === 'resolved') return moderationItems.value.filter(i => i.status === 'resolved')
  return moderationItems.value
})

function severityClass(severity) {
  if (severity === 'Critical') return 'severity-critical'
  if (severity === 'High') return 'severity-high'
  if (severity === 'Medium') return 'severity-medium'
  return 'severity-low'
}

function dismissItem(id) {
  const item = moderationItems.value.find(i => i.id === id)
  if (item) item.status = 'resolved'
}

function warnUser(item) {
  alert(`Warning sent to ${item.author}`)
  item.status = 'resolved'
}

function removeContent(id) {
  moderationItems.value = moderationItems.value.filter(i => i.id !== id)
}

function refreshQueue() {
  // In production this would re-fetch from the API
}
</script>

<style scoped>
.admin-moderation-view { display: flex; flex-direction: column; gap: 1rem; background: var(--background); min-height: 100vh; padding: 1rem; }
@media (min-width: 768px) { .admin-moderation-view { padding: 1.5rem; gap: 1.25rem; } }

.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
.header-actions { display: flex; gap: 0.75rem; }

/* Stats */
.mod-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
@media (min-width: 768px) { .mod-stats { grid-template-columns: repeat(4, 1fr); } }

.mod-stat-card { display: flex; align-items: center; gap: 0.75rem; padding: 1rem; border-radius: var(--radius-xl); }

.mstat-icon-wrap { width: 42px; height: 42px; border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.mstat-icon { font-size: 22px; }
.mstat-label { font-size: 0.7rem; color: var(--on-surface-variant); font-family: var(--font-headline); margin-bottom: 0.15rem; }
.mstat-value { font-family: var(--font-headline); font-size: 1.2rem; font-weight: 700; color: var(--on-surface); line-height: 1.2; }

/* Tabs */
.mod-tabs { display: flex; gap: 0; border-bottom: 1px solid var(--outline-variant); overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
.mod-tabs::-webkit-scrollbar { display: none; }

.mod-tab {
  display: flex; align-items: center; gap: 0.3rem;
  padding: 0.625rem 0.75rem;
  background: none; border: none; border-bottom: 2px solid transparent;
  font-family: var(--font-headline); font-size: 0.8rem; font-weight: 500;
  color: var(--on-surface-variant); cursor: pointer; white-space: nowrap;
  transition: all 0.15s ease; margin-bottom: -1px;
  flex-shrink: 0;
}
.mod-tab:hover { color: var(--primary); }
.mod-tab.active { color: var(--primary); border-bottom-color: var(--primary); }

.tab-badge {
  min-width: 16px; height: 16px; border-radius: var(--radius-full);
  background: var(--error); color: white;
  font-size: 0.6rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center; padding: 0 3px;
  flex-shrink: 0;
}

/* Queue */
.mod-queue { display: flex; flex-direction: column; gap: 1rem; }

.mod-item { padding: 1.25rem; border-radius: var(--radius-xl); display: flex; flex-direction: column; gap: 1rem; }

.mod-item-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }

.mod-item-user { display: flex; align-items: center; gap: 0.75rem; }

.mod-avatar {
  width: 40px; height: 40px; border-radius: var(--radius-lg);
  background: var(--surface-container); color: var(--primary);
  font-family: var(--font-headline); font-size: 0.875rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}

.mod-author-name { font-family: var(--font-headline); font-size: 0.875rem; font-weight: 700; color: var(--on-surface); }
.mod-meta { font-size: 0.75rem; color: var(--on-surface-variant); }

.mod-item-flags { display: flex; align-items: center; gap: 0.75rem; }

.flag-chip {
  display: inline-flex; align-items: center; gap: 0.25rem;
  padding: 0.25rem 0.625rem; border-radius: var(--radius-full);
  font-family: var(--font-headline); font-size: 0.72rem; font-weight: 600;
}

.severity-critical { background: var(--error-container); color: var(--on-error-container); }
.severity-high { background: rgba(239,68,68,0.1); color: #ef4444; }
.severity-medium { background: rgba(245,158,11,0.1); color: #f59e0b; }
.severity-low { background: var(--surface-container-high); color: var(--on-surface-variant); }

.report-count { font-size: 0.75rem; color: var(--on-surface-variant); font-family: var(--font-headline); font-weight: 500; }

/* Content */
.mod-item-content { padding: 0.875rem; background: var(--surface-container-low); border-radius: var(--radius-lg); border: 1px solid var(--outline-variant); }

.mod-text { font-size: 0.9rem; color: var(--on-surface); line-height: 1.6; }

.mod-image { width: 100%; max-height: 200px; object-fit: cover; border-radius: var(--radius-lg); margin-top: 0.75rem; }

/* Reasons */
.mod-reasons { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }

.reason-label { font-size: 0.75rem; color: var(--on-surface-variant); font-family: var(--font-headline); font-weight: 600; }

.reason-chip {
  padding: 0.2rem 0.5rem; border-radius: var(--radius-full);
  background: var(--surface-container-high); color: var(--on-surface-variant);
  font-family: var(--font-headline); font-size: 0.72rem; font-weight: 500;
}

/* Actions */
.mod-item-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; padding-top: 0.5rem; border-top: 1px solid var(--outline-variant); }

.mod-action-btn { font-size: 0.78rem; padding: 0.45rem 0.75rem; display: inline-flex; align-items: center; gap: 0.3rem; }
.mod-action-btn.warn { border-color: #f59e0b; color: #f59e0b; }
.mod-action-btn.warn:hover { background: rgba(245,158,11,0.08); }
.mod-action-btn.danger { background: var(--error); color: white; border: none; }
.mod-action-btn.danger:hover { opacity: 0.9; }

/* Empty State */
.mod-empty {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 3rem; text-align: center; border-radius: var(--radius-xl);
}

.mod-empty-title { font-family: var(--font-headline); font-size: 1.125rem; font-weight: 700; color: var(--on-surface); margin-top: 1rem; }
.mod-empty-desc { font-size: 0.875rem; color: var(--on-surface-variant); margin-top: 0.5rem; max-width: 320px; }
</style>
