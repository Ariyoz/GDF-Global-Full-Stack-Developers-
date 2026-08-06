<template>
  <div class="admin-reports-view">
    <div class="page-header">
      <div>
        <h1 class="text-headline-lg">Reports</h1>
        <p class="text-body-md" style="margin-top:0.25rem">User-submitted reports on profiles, posts, and projects.</p>
      </div>
      <div class="header-actions">
        <select v-model="statusFilter" class="filter-select">
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="investigating">Investigating</option>
          <option value="resolved">Resolved</option>
        </select>
        <select v-model="typeFilter" class="filter-select">
          <option value="">All Types</option>
          <option value="user">User</option>
          <option value="post">Post</option>
          <option value="project">Project</option>
          <option value="comment">Comment</option>
        </select>
      </div>
    </div>

    <!-- Stats -->
    <div class="report-stats">
      <div v-for="stat in reportStats" :key="stat.label" class="report-stat-card glass-card-static">
        <div class="rstat-icon-wrap" :style="{ background: stat.bg }">
          <span class="material-symbols-outlined rstat-icon" :style="{ color: stat.color }">{{ stat.icon }}</span>
        </div>
        <div>
          <p class="rstat-label">{{ stat.label }}</p>
          <h4 class="rstat-value" :style="stat.valueColor ? { color: stat.valueColor } : {}">{{ stat.value }}</h4>
        </div>
      </div>
    </div>

    <!-- Reports List -->
    <div class="reports-list">
      <div v-for="report in filteredReports" :key="report.id" class="report-card glass-card-static">
        <div class="report-header">
          <div class="report-meta-left">
            <span class="report-type-badge" :class="'type-' + report.type">{{ report.type }}</span>
            <span class="report-id">#{{ report.id }}</span>
            <span class="report-time">{{ report.time }}</span>
          </div>
          <span class="report-status-badge" :class="'status-' + report.status">{{ report.statusLabel }}</span>
        </div>

        <div class="report-body">
          <p class="report-reason"><strong>Reason:</strong> {{ report.reason }}</p>
          <p class="report-description">{{ report.description }}</p>
        </div>

        <div class="report-people">
          <div class="report-person">
            <span class="person-label">Reported by:</span>
            <div class="person-avatar">{{ report.reporter[0] }}</div>
            <span class="person-name">{{ report.reporter }}</span>
          </div>
          <div class="report-person">
            <span class="person-label">Against:</span>
            <div class="person-avatar person-avatar-target">{{ report.target[0] }}</div>
            <span class="person-name">{{ report.target }}</span>
          </div>
        </div>

        <div class="report-actions">
          <button v-if="report.status === 'open'" class="btn-outline report-action-btn" @click="report.status = 'investigating'; report.statusLabel = 'Investigating'">
            <span class="material-symbols-outlined" style="font-size:16px">search</span>
            Investigate
          </button>
          <button v-if="report.status !== 'resolved'" class="btn-outline report-action-btn" @click="report.status = 'resolved'; report.statusLabel = 'Resolved'">
            <span class="material-symbols-outlined" style="font-size:16px">check_circle</span>
            Resolve
          </button>
          <button v-if="report.status !== 'resolved'" class="btn-primary report-action-btn danger">
            <span class="material-symbols-outlined" style="font-size:16px">block</span>
            Take Action
          </button>
        </div>
      </div>

      <div v-if="filteredReports.length === 0" class="reports-empty glass-card-static">
        <span class="material-symbols-outlined" style="font-size:3rem;color:var(--outline)">inbox</span>
        <h3>No Reports</h3>
        <p>No reports match the current filters.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { adminService } from '@/services/admin.service'

const statusFilter = ref('')
const typeFilter = ref('')

const reportStats = ref([
  { icon: 'report',       label: 'Open Reports',    value: '0',   color: 'var(--error)',    bg: 'var(--error-container)',  valueColor: 'var(--error)' },
  { icon: 'search',       label: 'Investigating',   value: '0',   color: 'var(--tertiary)', bg: 'var(--tertiary-fixed)',   valueColor: 'var(--tertiary)' },
  { icon: 'check_circle', label: 'Resolved (7d)',   value: '0',   color: 'var(--primary)',  bg: 'var(--primary-fixed)' },
  { icon: 'timer',        label: 'Avg Resolution',  value: '—',   color: 'var(--on-surface-variant)', bg: 'var(--surface-container-high)' },
])

const reports = ref([])

onMounted(async () => {
  try {
    const data = await adminService.getReports({ status: 'pending' })
    reports.value = (data || []).map(r => ({
      id: r.id,
      type: r.content_type || 'Post',
      reason: r.reason || 'Reported',
      reporter: r.reporter_name || 'User',
      status: r.status || 'pending',
      created_at: r.created_at,
    }))
    reportStats.value[0].value = String(reports.value.length)
  } catch { /* ignore */ }
})

const filteredReports = computed(() => {
  let list = reports.value
  if (statusFilter.value) list = list.filter(r => r.status === statusFilter.value)
  if (typeFilter.value) list = list.filter(r => r.type === typeFilter.value)
  return list
})
</script>

<style scoped>
.admin-reports-view { display: flex; flex-direction: column; gap: 1.25rem; padding: 1.5rem; min-height: 100%; animation: fadeInUp .35s ease forwards; }
@media (min-width: 768px) { .admin-reports-view { padding: 2rem 2rem 2.5rem; } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
.page-header h1 {
  font-family: var(--font-headline); font-size: 1.4rem; font-weight: 800;
  color: var(--on-surface); letter-spacing: -.02em; margin: 0;
}
.page-header p { color: var(--on-surface-variant); margin-top: .25rem; font-size: .875rem; }
.header-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }

.btn-outline {
  display: inline-flex; align-items: center; gap: .375rem;
  padding: .55rem 1.125rem; border-radius: var(--radius-lg);
  background: var(--surface-container-lowest); border: 1.5px solid var(--outline-variant);
  font-family: var(--font-headline); font-size: .8125rem; font-weight: 600;
  color: var(--on-surface); cursor: pointer; transition: border-color .15s, color .15s;
}
.btn-outline:hover { border-color: var(--primary); color: var(--primary); }
.btn-primary {
  display: inline-flex; align-items: center; gap: .375rem;
  padding: .55rem 1.125rem; border-radius: var(--radius-lg);
  background: var(--gradient-primary); color: white; border: none;
  font-family: var(--font-headline); font-size: .8125rem; font-weight: 700;
  cursor: pointer; transition: opacity .15s;
}
.btn-primary:hover { opacity: .9; }

.filter-select {
  appearance: none; -webkit-appearance: none;
  padding: .45rem 1.875rem .45rem .75rem;
  background: var(--surface-container-low)
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237b7487' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")
    no-repeat right .6rem center / 12px;
  border: 1.5px solid var(--outline-variant); border-radius: var(--radius-full);
  font-family: var(--font-headline); font-size: .875rem; color: var(--on-surface); outline: none; cursor: pointer;
  transition: border-color .15s;
}
.filter-select:focus { border-color: var(--primary); }
.filter-select:hover { border-color: var(--primary); }
[data-theme="dark"] .filter-select { background-color: var(--surface-container); }

.report-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
@media (min-width: 768px) { .report-stats { grid-template-columns: repeat(4, 1fr); } }

.report-stat-card {
  display: flex; align-items: center; gap: .75rem; padding: 1rem 1.125rem;
  background: var(--surface-container-lowest); border: 1px solid var(--outline-variant);
  border-radius: var(--radius-xl); position: relative; overflow: hidden;
  transition: transform .2s, box-shadow .2s;
}
.report-stat-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: var(--gradient-primary); border-radius: var(--radius-xl) var(--radius-xl) 0 0;
}
.report-stat-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
.rstat-icon-wrap { width: 42px; height: 42px; border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.rstat-icon { font-size: 22px; }
.rstat-label { font-size: .67rem; color: var(--on-surface-variant); font-family: var(--font-headline); font-weight: 700; text-transform: uppercase; letter-spacing: .07em; margin-bottom: .15rem; }
.rstat-value { font-family: var(--font-headline); font-size: 1.5rem; font-weight: 800; color: var(--on-surface); line-height: 1; letter-spacing: -.03em; }

.reports-list { display: flex; flex-direction: column; gap: 1rem; }

.report-card {
  background: var(--surface-container-lowest); border: 1px solid var(--outline-variant);
  border-radius: var(--radius-xl); padding: 1.25rem;
  display: flex; flex-direction: column; gap: 1rem;
  transition: border-color .15s, box-shadow .15s;
}
.report-card:hover { border-color: rgba(99,14,212,.2); box-shadow: 0 4px 16px rgba(99,14,212,.06); }
[data-theme="dark"] .report-card:hover { border-color: rgba(168,85,247,.2); }

.report-header { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; flex-wrap: wrap; }
.report-meta-left { display: flex; align-items: center; gap: 0.625rem; }

.report-type-badge {
  padding: 0.2rem 0.5rem; border-radius: var(--radius-full);
  font-family: var(--font-headline); font-size: 0.7rem; font-weight: 600; text-transform: capitalize;
}
.type-user { background: rgba(168,85,247,0.1); color: var(--primary); }
.type-post { background: rgba(59,130,246,0.1); color: #3b82f6; }
.type-comment { background: rgba(245,158,11,0.1); color: #f59e0b; }
.type-project { background: rgba(16,185,129,0.1); color: #10b981; }

.report-id { font-family: var(--font-headline); font-size: 0.8rem; font-weight: 700; color: var(--on-surface-variant); }
.report-time { font-size: 0.75rem; color: var(--on-surface-variant); }

.report-status-badge {
  padding: 0.25rem 0.625rem; border-radius: var(--radius-full);
  font-family: var(--font-headline); font-size: 0.72rem; font-weight: 600;
}
.status-open { background: var(--error-container); color: var(--on-error-container); }
.status-investigating { background: rgba(245,158,11,0.1); color: #f59e0b; }
.status-resolved { background: rgba(22,163,74,0.1); color: #16a34a; }

.report-body { padding: 0.75rem; background: var(--surface-container-low); border-radius: var(--radius-lg); border: 1px solid var(--outline-variant); }
.report-reason { font-size: 0.85rem; color: var(--on-surface); margin-bottom: 0.4rem; }
.report-description { font-size: 0.85rem; color: var(--on-surface-variant); line-height: 1.5; }

.report-people { display: flex; gap: 2rem; flex-wrap: wrap; }
.report-person { display: flex; align-items: center; gap: 0.5rem; }
.person-label { font-size: 0.72rem; color: var(--on-surface-variant); font-family: var(--font-headline); font-weight: 600; }
.person-avatar {
  width: 28px; height: 28px; border-radius: var(--radius-full);
  background: var(--primary-fixed); color: var(--primary);
  font-family: var(--font-headline); font-size: 0.7rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
.person-avatar-target { background: var(--error-container); color: var(--error); }
.person-name { font-family: var(--font-headline); font-size: 0.82rem; font-weight: 600; color: var(--on-surface); }

.report-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; padding-top: 0.75rem; border-top: 1px solid var(--outline-variant); }
.report-action-btn { font-size: 0.82rem; padding: 0.5rem 1rem; display: inline-flex; align-items: center; gap: 0.35rem; }
.report-action-btn.danger { background: var(--error); color: white; border: none; }

.reports-empty { display: flex; flex-direction: column; align-items: center; padding: 3rem; text-align: center; border-radius: var(--radius-xl); gap: 0.5rem; }
.reports-empty h3 { font-family: var(--font-headline); font-size: 1.125rem; font-weight: 700; color: var(--on-surface); }
.reports-empty p { font-size: 0.875rem; color: var(--on-surface-variant); }
</style>
