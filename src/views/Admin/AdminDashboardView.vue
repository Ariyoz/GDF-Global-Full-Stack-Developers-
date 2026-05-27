<template>
  <div class="admin-dashboard-content">
    <!-- Header -->
    <div class="admin-page-header">
      <div>
        <h1 class="text-headline-lg">Platform Overview</h1>
        <p class="text-body-md" style="margin-top:0.25rem">Monitor growth, manage user reports, and verify credentials.</p>
      </div>
      <div class="admin-header-actions">
        <button class="btn-outline">
          <span class="material-symbols-outlined" style="font-size:18px">download</span>
          Export Data
        </button>
        <button class="btn-primary">
          <span class="material-symbols-outlined" style="font-size:18px">add</span>
          New Broadcast
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="admin-stats-grid">
      <div v-for="stat in platformStats" :key="stat.label" class="admin-stat-card glass-card">
        <div class="stat-icon-wrap" :style="{ background: stat.bg }">
          <span class="material-symbols-outlined stat-icon" :style="{ color: stat.color }">{{ stat.icon }}</span>
        </div>
        <div class="stat-info">
          <p class="stat-label">{{ stat.label }}</p>
          <h3 class="stat-value">{{ stat.value }}</h3>
        </div>
        <span class="stat-change" :class="stat.positive ? 'positive' : 'neutral'">{{ stat.change }}</span>
      </div>
    </div>

    <!-- Content Grid -->
    <div class="admin-content-grid">
      <!-- Activity Table -->
      <div class="glass-card-static admin-table-card">
        <div class="table-card-header">
          <h2 class="text-headline-md" style="font-size:1.1rem">Recent Activity</h2>
          <RouterLink to="/admin/moderation" class="view-all-link">View All</RouterLink>
        </div>
        <div class="admin-table-wrap">
          <table class="admin-table">
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
              <tr v-for="row in activityRows" :key="row.user">
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
                  <button class="btn-ghost icon-only">
                    <span class="material-symbols-outlined" style="font-size:18px">more_vert</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Right Panel -->
      <div class="admin-right-panel">
        <!-- Verification Queue -->
        <div class="glass-card-static admin-panel-card">
          <h3 class="panel-title">Verification Queue</h3>
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
        <div class="glass-card-static admin-panel-card">
          <h3 class="panel-title">Traffic Peak</h3>
          <p class="panel-sub">Last 24 Hours</p>
          <div class="traffic-chart">
            <div v-for="(bar, i) in trafficData" :key="i" class="traffic-bar-col">
              <div class="traffic-bar-wrap">
                <div class="traffic-bar" :style="{ height: bar.pct + '%', opacity: bar.active ? 1 : 0.25 }" />
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

    // Update verification queue with real data
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
      statusDot: u.status === 'active' ? 'status-dot-green' : 'status-dot-warning',
    }))
  } catch (err) {
    console.error('Failed to load admin analytics:', err)
  }
})
</script>

<style scoped>
.admin-dashboard-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

@media (min-width: 768px) { .admin-dashboard-content { padding: 2rem; } }

.admin-page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.admin-header-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }

/* Stats */
.admin-stats-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

@media (min-width: 640px) { .admin-stats-grid { grid-template-columns: repeat(3, 1fr); } }

.admin-stat-card {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1.25rem;
  position: relative;
}

.stat-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon { font-size: 22px; }

.stat-info { flex: 1; min-width: 0; }
.stat-label { font-size: 0.72rem; color: var(--on-surface-variant); font-family: var(--font-headline); margin-bottom: 0.2rem; }
.stat-value { font-family: var(--font-headline); font-size: 1.25rem; font-weight: 700; color: var(--on-surface); letter-spacing: -0.02em; line-height: 1.2; }

.stat-change {
  position: absolute;
  top: 0.875rem;
  right: 0.875rem;
  font-family: var(--font-headline);
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.15rem 0.4rem;
  border-radius: var(--radius-sm);
}

.stat-change.positive { background: rgba(22,163,74,0.1); color: #16a34a; }
.stat-change.neutral  { background: rgba(168,85,247,0.1); color: var(--primary); }

/* Content Grid */
.admin-content-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 1024px) { .admin-content-grid { grid-template-columns: 1fr 280px; } }

/* Table */
.admin-table-card { padding: 0; overflow: hidden; border-radius: var(--radius-xl); }

.table-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--outline-variant);
}

.view-all-link { font-family: var(--font-headline); font-size: 0.875rem; font-weight: 600; color: var(--primary); text-decoration: none; }

.admin-table-wrap { overflow-x: auto; }

.admin-table { width: 100%; border-collapse: collapse; }

.admin-table thead tr { background: rgba(240,243,255,0.5); }

.admin-table th {
  padding: 0.75rem 1.25rem;
  font-family: var(--font-headline);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--on-surface-variant);
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.admin-table tbody tr { border-bottom: 1px solid var(--outline-variant); transition: background 0.15s ease; }
.admin-table tbody tr:hover { background: rgba(168,85,247,0.03); }
.admin-table tbody tr:last-child { border-bottom: none; }

.admin-table td { padding: 0.875rem 1.25rem; }

.table-user { display: flex; align-items: center; gap: 0.75rem; }

.table-avatar {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-lg);
  background: var(--surface-container);
  color: var(--primary);
  font-family: var(--font-headline);
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.table-user-name { font-family: var(--font-headline); font-size: 0.875rem; font-weight: 600; color: var(--on-surface); }
.table-user-role { font-size: 0.75rem; color: var(--on-surface-variant); }
.table-event     { font-size: 0.875rem; color: var(--on-surface); }

.table-flag {
  display: inline-flex;
  padding: 0.2rem 0.625rem;
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.72rem;
  font-weight: 600;
}

.flag-error   { background: var(--error-container); color: var(--on-error-container); }
.flag-neutral { background: var(--surface-container); color: var(--on-surface-variant); }

.table-status { display: flex; align-items: center; gap: 0.4rem; font-size: 0.875rem; color: var(--on-surface-variant); }

.status-dot-warning { background: #f59e0b; }

/* Right Panel */
.admin-right-panel { display: flex; flex-direction: column; gap: 1rem; }

.admin-panel-card { padding: 1.25rem; border-radius: var(--radius-xl); }

.panel-title { font-family: var(--font-headline); font-size: 0.9375rem; font-weight: 700; color: var(--on-surface); margin-bottom: 0.875rem; }
.panel-sub   { font-size: 0.75rem; color: var(--on-surface-variant); margin-top: -0.625rem; margin-bottom: 1rem; }

.queue-list { display: flex; flex-direction: column; gap: 0.5rem; }

.queue-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.625rem 0.875rem;
  background: var(--surface-container-low);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-lg);
}

.queue-item-left { display: flex; align-items: center; gap: 0.625rem; }
.queue-icon { font-size: 20px; }
.queue-label { font-family: var(--font-headline); font-size: 0.875rem; font-weight: 500; color: var(--on-surface); }
.queue-count { font-family: var(--font-headline); font-size: 0.875rem; font-weight: 700; color: var(--primary); }

/* Traffic Chart */
.traffic-chart {
  display: flex;
  align-items: flex-end;
  gap: 0.25rem;
  height: 80px;
  margin-bottom: 0.5rem;
}

.traffic-bar-col { flex: 1; height: 100%; display: flex; align-items: flex-end; }

.traffic-bar-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  background: var(--surface-container);
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  overflow: hidden;
}

.traffic-bar {
  width: 100%;
  background: var(--primary);
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  transition: height 0.6s ease;
}

.traffic-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.65rem;
  color: var(--on-surface-variant);
  font-family: var(--font-headline);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>
