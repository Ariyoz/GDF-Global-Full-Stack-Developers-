<template>
  <div class="admin-dashboard-content">
    <!-- Welcome Banner -->
    <div class="welcome-banner">
      <div class="welcome-banner-bg" />
      <div class="welcome-text">
        <h1 class="welcome-title">Platform Overview</h1>
        <p class="welcome-sub">Monitor growth, manage user reports, and verify credentials.</p>
      </div>
      <div class="welcome-actions">
        <button class="btn-outline">
          <span class="material-symbols-outlined">download</span>
          Export Data
        </button>
        <button class="btn-primary">
          <span class="material-symbols-outlined">add</span>
          New Broadcast
        </button>
      </div>
    </div>

    <!-- KPI Stats Grid -->
    <div class="kpi-grid">
      <div v-for="stat in platformStats" :key="stat.label" class="kpi-card">
        <div class="kpi-card-top">
          <div class="kpi-icon-wrap" :style="{ background: stat.bg }">
            <span class="material-symbols-outlined kpi-icon" :style="{ color: stat.color }">{{ stat.icon }}</span>
          </div>
          <span class="kpi-change" :class="stat.positive ? 'positive' : 'neutral'">
            <span class="material-symbols-outlined" style="font-size:12px">{{ stat.positive ? 'trending_up' : 'remove' }}</span>
            {{ stat.change }}
          </span>
        </div>
        <h3 class="kpi-value">{{ stat.value }}</h3>
        <p class="kpi-label">{{ stat.label }}</p>
      </div>
    </div>

    <!-- Content Grid -->
    <div class="content-grid">
      <!-- Activity Table -->
      <div class="activity-card">
        <div class="card-header">
          <div class="card-header-left">
            <span class="material-symbols-outlined card-header-icon">history</span>
            <h2 class="card-title">Recent Activity</h2>
          </div>
          <RouterLink to="/admin/moderation" class="view-all-link">
            View All
            <span class="material-symbols-outlined" style="font-size:14px">arrow_forward</span>
          </RouterLink>
        </div>
        <div class="table-wrap">
          <table class="activity-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Event</th>
                <th>Flag</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in activityRows" :key="row.user" class="table-row">
                <td>
                  <div class="table-user">
                    <div class="table-avatar">{{ row.user[0] }}</div>
                    <div>
                      <p class="table-user-name">{{ row.user }}</p>
                      <p class="table-user-role">{{ row.role }}</p>
                    </div>
                  </div>
                </td>
                <td class="table-event">{{ row.event }}</td>
                <td>
                  <span class="table-flag" :class="row.flagClass">{{ row.flag }}</span>
                </td>
                <td>
                  <div class="table-status">
                    <span class="status-dot" :class="row.statusDot" />
                    {{ row.status }}
                  </div>
                </td>
                <td>
                  <button class="table-action-btn">
                    <span class="material-symbols-outlined" style="font-size:16px">more_vert</span>
                  </button>
                </td>
              </tr>
              <tr v-if="!activityRows.length">
                <td colspan="5" class="table-empty-row">
                  <span class="material-symbols-outlined" style="font-size:24px;opacity:.3">inbox</span>
                  <span>No recent activity</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Right Panel -->
      <div class="right-panel">
        <!-- Verification Queue -->
        <div class="panel-card">
          <div class="panel-card-header">
            <span class="material-symbols-outlined panel-icon">checklist</span>
            <h3 class="panel-title">Verification Queue</h3>
          </div>
          <div class="queue-list">
            <div v-for="item in verificationQueue" :key="item.label" class="queue-item">
              <div class="queue-item-left">
                <span class="material-symbols-outlined queue-icon" :style="{ color: item.color }">{{ item.icon }}</span>
                <span class="queue-label">{{ item.label }}</span>
              </div>
              <span class="queue-count">{{ item.count }}</span>
            </div>
          </div>
        </div>

        <!-- Traffic Chart -->
        <div class="panel-card">
          <div class="panel-card-header">
            <span class="material-symbols-outlined panel-icon">bar_chart</span>
            <div>
              <h3 class="panel-title">Traffic Peak</h3>
              <p class="panel-sub">Last 24 Hours</p>
            </div>
          </div>
          <div class="traffic-chart">
            <div v-for="(bar, i) in trafficData" :key="i" class="traffic-bar-col">
              <div class="traffic-bar-wrap">
                <div class="traffic-bar" :style="{ height: bar.pct + '%', opacity: bar.active ? 1 : 0.22 }" />
              </div>
            </div>
          </div>
          <div class="traffic-labels">
            <span>00:00</span>
            <span>12:00</span>
            <span>23:59</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminService } from '@/services/admin.service'

const platformStats = ref([
  { icon: 'person_add', label: 'Total Users',  value: '0', change: '—', positive: false, color: 'var(--primary)',  bg: 'rgba(168,85,247,0.1)' },
  { icon: 'verified',   label: 'Verified',     value: '0', change: '—', positive: false, color: '#16a34a',         bg: 'rgba(22,163,74,0.1)' },
  { icon: 'article',    label: 'Total Posts',   value: '0', change: '—', positive: false, color: 'var(--primary-container)', bg: 'rgba(99,14,212,0.08)' },
  { icon: 'credit_card',label: 'Pending Payments', value: '0', change: '—', positive: false, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
])

const activityRows = ref([])

const verificationQueue = ref([
  { icon: 'credit_card', label: 'Pending Payments', count: 0, color: '#f59e0b' },
  { icon: 'verified',    label: 'Verified Users',   count: 0, color: 'var(--primary)' },
  { icon: 'flag',        label: 'Pending Reports',  count: 0, color: '#ef4444' },
])

const trafficData = [
  { pct: 0, active: false },
  { pct: 0, active: false },
  { pct: 0, active: false },
  { pct: 0, active: false },
  { pct: 0, active: false },
  { pct: 0, active: false },
  { pct: 0, active: false },
]

onMounted(async () => {
  try {
    const analytics = await adminService.getAnalytics()
    platformStats.value[0].value = String(analytics.totalUsers)
    platformStats.value[0].change = `${analytics.developers} devs, ${analytics.clients} clients`
    platformStats.value[1].value = String(analytics.verifiedUsers)
    platformStats.value[1].change = `${analytics.activeSubscriptions || 0} active subs`
    platformStats.value[2].value = String(analytics.totalPosts)
    platformStats.value[3].value = String(analytics.pendingSubscriptions || 0)
    platformStats.value[3].change = analytics.pendingSubscriptions > 0 ? 'Needs approval' : 'All clear'
    platformStats.value[3].positive = analytics.pendingSubscriptions > 0
    verificationQueue.value[0].count = analytics.pendingSubscriptions || 0
    verificationQueue.value[1].count = analytics.verifiedUsers || 0
    verificationQueue.value[2].count = analytics.pendingReports || 0
    const recent = await adminService.getRecentActivity(5)
    activityRows.value = recent.map(u => ({
      user: u.full_name || u.email,
      role: u.role || 'developer',
      event: 'Registered',
      flag: u.status === 'active' ? 'Active' : u.status,
      flagClass: u.status === 'active' ? 'flag-neutral' : 'flag-error',
      status: u.status === 'active' ? 'Active' : 'Pending',
      statusDot: u.status === 'active' ? 'dot-green' : 'dot-warning',
    }))
  } catch (err) {
    console.error('Failed to load admin analytics:', err)
  }
})
</script>

<style scoped>
/* ═══════════════════════════════════════════════
   Admin Dashboard — Premium Redesign
   ═══════════════════════════════════════════════ */

.admin-dashboard-content {
  display: flex; flex-direction: column; gap: 1.5rem;
  padding: 1.5rem; min-height: 100%;
  animation: fadeInUp 0.35s ease forwards;
}
@media (min-width: 768px) { .admin-dashboard-content { padding: 2rem 2rem 2.5rem; } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

/* ── Welcome Banner ── */
.welcome-banner {
  position: relative; overflow: hidden;
  display: flex; align-items: center; justify-content: space-between;
  gap: 1rem; flex-wrap: wrap;
  padding: 1.5rem 1.75rem;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-sm);
}

.welcome-banner-bg {
  position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(135deg, rgba(99,14,212,0.06) 0%, rgba(124,58,237,0.03) 50%, transparent 100%);
  border-radius: inherit;
}

[data-theme="dark"] .welcome-banner-bg {
  background: linear-gradient(135deg, rgba(168,85,247,0.08) 0%, rgba(124,58,237,0.04) 50%, transparent 100%);
}

.welcome-text { position: relative; z-index: 1; }

.welcome-title {
  font-family: var(--font-headline); font-size: 1.5rem; font-weight: 800;
  letter-spacing: -0.02em; line-height: 1.2;
  background: var(--gradient-text);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}

.welcome-sub { color: var(--on-surface-variant); margin-top: 0.25rem; font-size: 0.875rem; }

.welcome-actions { display: flex; gap: 0.625rem; align-items: center; flex-wrap: wrap; position: relative; z-index: 1; }

/* Shared button styles */
.btn-primary {
  display: inline-flex; align-items: center; gap: 0.375rem;
  padding: 0.55rem 1.125rem; border-radius: var(--radius-lg);
  background: var(--gradient-primary); color: white; border: none;
  font-family: var(--font-headline); font-size: 0.8125rem; font-weight: 700;
  cursor: pointer; transition: opacity 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
  box-shadow: var(--shadow-primary);
}
.btn-primary:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: var(--shadow-primary-lg); }
.btn-primary .material-symbols-outlined { font-size: 17px; }

.btn-outline {
  display: inline-flex; align-items: center; gap: 0.375rem;
  padding: 0.55rem 1.125rem; border-radius: var(--radius-lg);
  background: var(--surface-container-lowest);
  border: 1.5px solid var(--outline-variant);
  font-family: var(--font-headline); font-size: 0.8125rem; font-weight: 600;
  color: var(--on-surface); cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease;
}
.btn-outline:hover { border-color: var(--primary); background: rgba(99,14,212,0.04); color: var(--primary); }
.btn-outline .material-symbols-outlined { font-size: 17px; }

/* ── KPI Grid ── */
.kpi-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;
}
@media (min-width: 900px) { .kpi-grid { grid-template-columns: repeat(4, 1fr); } }

.kpi-card {
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-xl);
  padding: 1.25rem 1.25rem 1rem;
  display: flex; flex-direction: column; gap: 0.5rem;
  position: relative; overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.kpi-card::after {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: var(--gradient-primary); border-radius: var(--radius-xl) var(--radius-xl) 0 0;
}
.kpi-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); border-color: rgba(99,14,212,0.2); }
[data-theme="dark"] .kpi-card:hover { border-color: rgba(168,85,247,0.25); }

.kpi-card-top { display: flex; align-items: center; justify-content: space-between; }

.kpi-icon-wrap {
  width: 40px; height: 40px; border-radius: var(--radius-lg);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.kpi-icon { font-size: 20px; }

.kpi-change {
  display: inline-flex; align-items: center; gap: 0.2rem;
  font-family: var(--font-headline); font-size: 0.65rem; font-weight: 700;
  padding: 0.175rem 0.4rem; border-radius: var(--radius-full);
}
.kpi-change.positive { background: rgba(22,163,74,0.1); color: #16a34a; }
.kpi-change.neutral { background: rgba(99,14,212,0.08); color: var(--primary); }
[data-theme="dark"] .kpi-change.neutral { background: rgba(168,85,247,0.12); }

.kpi-value {
  font-family: var(--font-headline); font-size: 1.875rem; font-weight: 800;
  letter-spacing: -0.03em; line-height: 1;
  background: var(--gradient-text);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}

.kpi-label {
  font-family: var(--font-headline); font-size: 0.7rem; font-weight: 600;
  color: var(--on-surface-variant); text-transform: uppercase; letter-spacing: 0.06em;
}

/* ── Content Grid ── */
.content-grid {
  display: grid; grid-template-columns: 1fr; gap: 1.25rem;
}
@media (min-width: 1080px) { .content-grid { grid-template-columns: 1fr 296px; } }

/* ── Activity Card ── */
.activity-card {
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.card-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1rem 1.25rem;
  background: var(--surface-container-low);
  border-bottom: 1px solid var(--outline-variant);
}
.card-header-left { display: flex; align-items: center; gap: 0.5rem; }

.card-header-icon {
  font-size: 18px; color: var(--primary);
  font-variation-settings: 'FILL' 0;
}

.card-title {
  font-family: var(--font-headline); font-size: 0.9rem; font-weight: 700; color: var(--on-surface);
}

.view-all-link {
  display: inline-flex; align-items: center; gap: 0.25rem;
  font-family: var(--font-headline); font-size: 0.78rem; font-weight: 600; color: var(--primary);
  text-decoration: none; padding: 0.25rem 0.6rem;
  border-radius: var(--radius-full); border: 1px solid rgba(99,14,212,0.2);
  transition: all 0.15s ease;
}
.view-all-link:hover { background: rgba(99,14,212,0.06); border-color: var(--primary); }
[data-theme="dark"] .view-all-link { border-color: rgba(168,85,247,0.25); }

.table-wrap { overflow-x: auto; }

.activity-table { width: 100%; border-collapse: collapse; min-width: 520px; }
.activity-table thead tr { background: var(--surface-container); }
.activity-table th {
  padding: 0.625rem 1rem; font-family: var(--font-headline); font-size: 0.65rem;
  font-weight: 700; color: var(--on-surface-variant); text-align: left;
  text-transform: uppercase; letter-spacing: 0.08em; white-space: nowrap;
}
.activity-table th:last-child { text-align: right; }

.table-row { border-bottom: 1px solid var(--outline-variant); transition: background 0.12s ease; }
.table-row:hover { background: rgba(99,14,212,0.03); }
[data-theme="dark"] .table-row:hover { background: rgba(168,85,247,0.05); }
.table-row:last-child { border-bottom: none; }
.activity-table td { padding: 0.8rem 1rem; vertical-align: middle; }
.activity-table td:last-child { text-align: right; }

.table-user { display: flex; align-items: center; gap: 0.625rem; }
.table-avatar {
  width: 32px; height: 32px; border-radius: var(--radius-md);
  background: linear-gradient(135deg, rgba(99,14,212,0.12), rgba(124,58,237,0.2));
  border: 1.5px solid rgba(99,14,212,0.18);
  color: var(--primary); font-family: var(--font-headline); font-size: 0.78rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
[data-theme="dark"] .table-avatar {
  background: linear-gradient(135deg, rgba(168,85,247,0.15), rgba(124,58,237,0.2));
  border-color: rgba(168,85,247,0.25);
}
.table-user-name { font-family: var(--font-headline); font-size: 0.8125rem; font-weight: 600; color: var(--on-surface); }
.table-user-role { font-size: 0.7rem; color: var(--on-surface-variant); text-transform: capitalize; }
.table-event { font-size: 0.8125rem; color: var(--on-surface); }

.table-flag {
  display: inline-flex; padding: 0.175rem 0.525rem;
  border-radius: var(--radius-full); font-family: var(--font-headline); font-size: 0.68rem; font-weight: 700;
}
.flag-error { background: rgba(186,26,26,0.1); color: var(--error); }
.flag-neutral { background: var(--surface-container-high); color: var(--on-surface-variant); }

.table-status { display: flex; align-items: center; gap: 0.35rem; font-size: 0.8rem; color: var(--on-surface-variant); }
.status-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.dot-green { background: #16a34a; box-shadow: 0 0 5px rgba(22,163,74,0.4); }
.dot-warning { background: #f59e0b; }

.table-action-btn {
  width: 28px; height: 28px; border-radius: var(--radius-md);
  background: none; border: none; color: var(--on-surface-variant);
  display: flex; align-items: center; justify-content: center; cursor: pointer;
  transition: background 0.15s ease;
}
.table-action-btn:hover { background: var(--surface-container); color: var(--on-surface); }

.table-empty-row {
  padding: 2.5rem; text-align: center;
  color: var(--on-surface-variant); font-size: 0.875rem;
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
}

/* ── Right Panel ── */
.right-panel { display: flex; flex-direction: column; gap: 1rem; }

.panel-card {
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-xl);
  padding: 1.125rem;
}

.panel-card-header {
  display: flex; align-items: center; gap: 0.5rem;
  margin-bottom: 0.875rem;
}

.panel-icon { font-size: 17px; color: var(--primary); }

.panel-title {
  font-family: var(--font-headline); font-size: 0.875rem; font-weight: 700; color: var(--on-surface);
  line-height: 1;
}

.panel-sub { font-size: 0.7rem; color: var(--on-surface-variant); margin-top: 0.1rem; }

/* Queue */
.queue-list { display: flex; flex-direction: column; gap: 0.375rem; }

.queue-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.55rem 0.75rem;
  background: var(--surface-container-low);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-lg);
  transition: border-color 0.15s ease, background 0.15s ease;
}
.queue-item:hover { border-color: rgba(99,14,212,0.25); background: var(--surface-container); }
[data-theme="dark"] .queue-item:hover { border-color: rgba(168,85,247,0.25); }

.queue-item-left { display: flex; align-items: center; gap: 0.5rem; }
.queue-icon { font-size: 16px; }
.queue-label { font-family: var(--font-headline); font-size: 0.78rem; font-weight: 500; color: var(--on-surface); }
.queue-count {
  font-family: var(--font-headline); font-size: 0.875rem; font-weight: 800;
  background: var(--gradient-text);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}

/* Traffic Chart */
.traffic-chart {
  display: flex; align-items: flex-end; gap: 3px;
  height: 80px; margin-bottom: 0.5rem;
}
.traffic-bar-col { flex: 1; height: 100%; display: flex; align-items: flex-end; }
.traffic-bar-wrap {
  width: 100%; height: 100%;
  display: flex; align-items: flex-end;
  background: var(--surface-container);
  border-radius: 3px 3px 0 0; overflow: hidden;
}
.traffic-bar {
  width: 100%; background: var(--gradient-primary);
  border-radius: 3px 3px 0 0;
  transition: height 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.traffic-labels {
  display: flex; justify-content: space-between;
  font-size: 0.6rem; color: var(--on-surface-variant);
  font-family: var(--font-headline); text-transform: uppercase; letter-spacing: 0.05em;
  padding-top: 0.3rem; border-top: 1px solid var(--outline-variant);
}
</style>
