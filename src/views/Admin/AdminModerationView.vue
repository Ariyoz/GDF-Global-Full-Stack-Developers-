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
import { ref, computed, onMounted } from 'vue'
import { adminService } from '@/services/admin.service'

const activeTab = ref('pending')

const tabs = [
  { value: 'pending',  label: 'Pending Review', badge: null },
  { value: 'posts',    label: 'Flagged Posts',   badge: null },
  { value: 'comments', label: 'Flagged Comments', badge: null },
  { value: 'resolved', label: 'Resolved',        badge: null },
]

const modStats = ref([
  { icon: 'flag',           label: 'Pending Flags',   value: '0',  color: 'var(--error)',    bg: 'var(--error-container)',  valueColor: 'var(--error)' },
  { icon: 'gavel',          label: 'Resolved Today',  value: '0',  color: 'var(--primary)',  bg: 'var(--primary-fixed)' },
  { icon: 'person_off',     label: 'Users Warned',    value: '0',  color: 'var(--tertiary)', bg: 'var(--tertiary-fixed)',   valueColor: 'var(--tertiary)' },
  { icon: 'delete_forever', label: 'Content Removed', value: '0',  color: 'var(--on-surface-variant)', bg: 'var(--surface-container-high)' },
])

const moderationItems = ref([])

onMounted(async () => {
  try {
    const reports = await adminService.getReports({ status: 'pending' })
    moderationItems.value = (reports || []).map(r => ({
      id: r.id,
      type: r.content_type || 'Post',
      content: r.reason || 'Reported content',
      reporter: r.reporter_name || 'User',
      severity: r.severity || 'Medium',
      status: r.status || 'pending',
      created_at: r.created_at,
    }))
    modStats.value[0].value = String(moderationItems.value.length)
  } catch { /* ignore */ }
})

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
/* ═══════════════════════════════════════════════
   Admin Moderation — Elite Redesign
   ═══════════════════════════════════════════════ */

.admin-moderation-view {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  background: var(--background);
  min-height: 100%;
  padding: 1.5rem;
  animation: fadeInUp 0.35s ease forwards;
}

@media (min-width: 768px) {
  .admin-moderation-view { padding: 2rem 2rem 2.5rem; gap: 1.375rem; }
}

@keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

/* ── Page header ── */
.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }

.page-header h1 {
  font-family: var(--font-headline); font-size: 1.4rem; font-weight: 800;
  color: var(--on-surface); letter-spacing: -.02em; margin: 0;
}

.page-header p { color: var(--on-surface-variant); margin-top: 0.3rem; }

.header-actions { display: flex; gap: 0.625rem; align-items: center; }

/* Shared button */
.btn-outline {
  display: inline-flex; align-items: center; gap: .375rem;
  padding: .55rem 1.125rem; border-radius: var(--radius-lg);
  background: var(--surface-container-lowest); border: 1.5px solid var(--outline-variant);
  font-family: var(--font-headline); font-size: .8125rem; font-weight: 600;
  color: var(--on-surface); cursor: pointer; transition: border-color .15s, color .15s;
}
.btn-outline:hover { border-color: var(--primary); color: var(--primary); }
.btn-outline .material-symbols-outlined { font-size: 17px; }
.btn-primary {
  display: inline-flex; align-items: center; gap: .375rem;
  padding: .55rem 1.125rem; border-radius: var(--radius-lg);
  background: var(--gradient-primary); color: white; border: none;
  font-family: var(--font-headline); font-size: .8125rem; font-weight: 700;
  cursor: pointer; transition: opacity .15s, transform .15s;
  box-shadow: var(--shadow-primary);
}
.btn-primary:hover { opacity: .9; transform: translateY(-1px); }
.btn-primary .material-symbols-outlined { font-size: 17px; }

/* ── KPI Stats ── */
.mod-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media (min-width: 768px) { .mod-stats { grid-template-columns: repeat(4, 1fr); } }

.mod-stat-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.125rem 1.25rem 1rem;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.mod-stat-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 3px;
  background: var(--gradient-primary);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
}

.mod-stat-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }

.mstat-icon-wrap {
  width: 44px; height: 44px;
  border-radius: var(--radius-xl);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}

.mstat-icon { font-size: 22px; }

.mstat-label {
  font-size: 0.68rem; font-family: var(--font-headline); font-weight: 700;
  color: var(--on-surface-variant);
  text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 0.2rem;
}

.mstat-value {
  font-family: var(--font-headline); font-size: 1.625rem;
  font-weight: 800; color: var(--on-surface);
  letter-spacing: -0.03em; line-height: 1;
}

/* ── Tabs ── */
.mod-tabs {
  display: flex; gap: 0;
  border-bottom: 1px solid var(--outline-variant);
  overflow-x: auto; scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}
.mod-tabs::-webkit-scrollbar { display: none; }

.mod-tab {
  display: flex; align-items: center; gap: 0.3rem;
  padding: 0.625rem 1rem;
  background: none; border: none; border-bottom: 2px solid transparent;
  font-family: var(--font-headline); font-size: 0.875rem; font-weight: 500;
  color: var(--on-surface-variant); cursor: pointer; white-space: nowrap;
  transition: color 0.15s ease, border-color 0.15s ease;
  margin-bottom: -1px; flex-shrink: 0;
}
.mod-tab:hover { color: var(--primary); }
.mod-tab.active { color: var(--primary); border-bottom-color: var(--primary); font-weight: 700; }

.tab-badge {
  min-width: 16px; height: 16px; border-radius: var(--radius-full);
  background: var(--error); color: white;
  font-size: 0.6rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center; padding: 0 3px; flex-shrink: 0;
}

/* ── Moderation queue ── */
.mod-queue { display: flex; flex-direction: column; gap: 1rem; }

.mod-item {
  padding: 1.25rem;
  border-radius: var(--radius-xl);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.mod-item:hover { box-shadow: var(--shadow-sm); }

/* ── Item header ── */
.mod-item-header {
  display: flex; align-items: flex-start;
  justify-content: space-between;
  gap: 1rem; flex-wrap: wrap;
}

.mod-item-user { display: flex; align-items: center; gap: 0.75rem; }

.mod-avatar {
  width: 40px; height: 40px; border-radius: var(--radius-lg);
  background: linear-gradient(135deg, rgba(99,14,212,0.12), rgba(124,58,237,0.18));
  border: 1.5px solid rgba(99,14,212,0.18);
  color: var(--primary);
  font-family: var(--font-headline); font-size: 0.875rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}

[data-theme="dark"] .mod-avatar {
  background: linear-gradient(135deg, rgba(168,85,247,0.15), rgba(124,58,237,0.2));
  border-color: rgba(168,85,247,0.25);
}

.mod-author-name { font-family: var(--font-headline); font-size: 0.875rem; font-weight: 700; color: var(--on-surface); }
.mod-meta { font-size: 0.72rem; color: var(--on-surface-variant); margin-top: 0.1rem; }

.mod-item-flags { display: flex; align-items: center; gap: 0.625rem; }

.flag-chip {
  display: inline-flex; align-items: center; gap: 0.25rem;
  padding: 0.225rem 0.6rem; border-radius: var(--radius-full);
  font-family: var(--font-headline); font-size: 0.7rem; font-weight: 700;
  letter-spacing: 0.02em;
}

.severity-critical { background: rgba(186,26,26,0.12); color: var(--error); border: 1px solid rgba(186,26,26,0.2); }
.severity-high { background: rgba(239,68,68,0.1); color: #ef4444; border: 1px solid rgba(239,68,68,0.18); }
.severity-medium { background: rgba(245,158,11,0.1); color: #f59e0b; border: 1px solid rgba(245,158,11,0.18); }
.severity-low { background: var(--surface-container-high); color: var(--on-surface-variant); border: 1px solid var(--outline-variant); }

.report-count { font-size: 0.75rem; color: var(--on-surface-variant); font-family: var(--font-headline); font-weight: 600; }

/* ── Item content preview ── */
.mod-item-content {
  padding: 0.875rem 1rem;
  background: var(--surface-container-low);
  border-radius: var(--radius-lg);
  border: 1px solid var(--outline-variant);
}

.mod-text { font-size: 0.875rem; color: var(--on-surface); line-height: 1.65; }

.mod-image {
  width: 100%; max-height: 200px; object-fit: cover;
  border-radius: var(--radius-md); margin-top: 0.75rem;
}

/* ── Report reasons ── */
.mod-reasons { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }

.reason-label {
  font-size: 0.72rem; color: var(--on-surface-variant);
  font-family: var(--font-headline); font-weight: 700;
}

.reason-chip {
  padding: 0.175rem 0.5rem; border-radius: var(--radius-full);
  background: var(--surface-container-high); color: var(--on-surface-variant);
  font-family: var(--font-headline); font-size: 0.7rem; font-weight: 600;
  border: 1px solid var(--outline-variant);
}

/* ── Action buttons ── */
.mod-item-actions {
  display: flex; gap: 0.5rem; flex-wrap: wrap;
  padding-top: 0.75rem;
  border-top: 1px solid var(--outline-variant);
}

.mod-action-btn {
  font-size: 0.78rem; padding: 0.45rem 0.875rem;
  display: inline-flex; align-items: center; gap: 0.3rem;
  border-radius: var(--radius-lg);
}

.mod-action-btn.warn { border-color: rgba(245,158,11,0.4); color: #f59e0b; background: rgba(245,158,11,0.06); }
.mod-action-btn.warn:hover { background: rgba(245,158,11,0.12); border-color: #f59e0b; }

.mod-action-btn.danger { background: var(--error); color: white; border: none; box-shadow: 0 2px 8px rgba(186,26,26,0.25); }
.mod-action-btn.danger:hover { opacity: 0.88; box-shadow: 0 4px 12px rgba(186,26,26,0.35); }

/* ── Empty state ── */
.mod-empty {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 4rem 2rem; text-align: center; border-radius: var(--radius-xl);
  border: 2px dashed var(--outline-variant);
  background: transparent;
}

.mod-empty-title {
  font-family: var(--font-headline); font-size: 1.125rem; font-weight: 700;
  color: var(--on-surface); margin-top: 1rem;
}

.mod-empty-desc {
  font-size: 0.875rem; color: var(--on-surface-variant);
  margin-top: 0.5rem; max-width: 320px; line-height: 1.6;
}
</style>
