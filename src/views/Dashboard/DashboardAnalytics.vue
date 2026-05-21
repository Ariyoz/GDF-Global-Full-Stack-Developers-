<template>
  <div class="analytics-view">
    <div class="page-header">
      <div>
        <h2 class="text-headline-md">Analytics</h2>
        <p class="text-body-md" style="margin-top:0.25rem">Track your profile performance and earnings.</p>
      </div>
      <select v-model="period" class="period-select">
        <option value="7">Last 7 days</option>
        <option value="30">Last 30 days</option>
        <option value="90">Last 90 days</option>
      </select>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-grid">
      <div v-for="kpi in kpis" :key="kpi.label" class="kpi-card glass-card-static">
        <div class="kpi-icon-wrap" :style="{ background: kpi.bg }">
          <span class="material-symbols-outlined kpi-icon" :style="{ color: kpi.color }">{{ kpi.icon }}</span>
        </div>
        <div class="kpi-info">
          <p class="kpi-value">{{ kpi.value }}</p>
          <p class="kpi-label">{{ kpi.label }}</p>
        </div>
        <span class="kpi-change" :class="kpi.positive ? 'positive' : 'negative'">
          <span class="material-symbols-outlined" style="font-size:14px;">{{ kpi.positive ? 'trending_up' : 'trending_down' }}</span>
          {{ kpi.change }}
        </span>
      </div>
    </div>

    <!-- Engagement Chart -->
    <div class="glass-card-static chart-card">
      <div class="card-header">
        <h3 class="card-title text-label-md">Engagement Overview</h3>
        <div class="chart-legend">
          <span class="legend-item"><span class="legend-dot primary" />Views</span>
          <span class="legend-item"><span class="legend-dot secondary" />Clicks</span>
        </div>
      </div>
      <div class="chart-bars">
        <div v-for="(day, i) in chartData" :key="day.label" class="bar-group">
          <div class="bar-pair">
            <div class="bar-wrap">
              <div class="bar-fill primary-bar" :style="{ height: day.views + '%', animationDelay: i * 0.05 + 's' }" />
            </div>
            <div class="bar-wrap">
              <div class="bar-fill secondary-bar" :style="{ height: day.clicks + '%', animationDelay: i * 0.05 + 's' }" />
            </div>
          </div>
          <span class="bar-label">{{ day.label }}</span>
        </div>
      </div>
    </div>

    <!-- Activity Table -->
    <div class="glass-card-static table-card">
      <div class="card-header" style="margin-bottom:1rem">
        <h3 class="card-title text-label-md">Recent Activity</h3>
        <button class="btn-ghost" style="font-size:0.8rem">Export CSV</button>
      </div>
      <div class="activity-table">
        <div class="table-head">
          <span>Event</span>
          <span>Source</span>
          <span>Date</span>
          <span>Value</span>
        </div>
        <div v-for="row in activityRows" :key="row.id" class="table-row">
          <div class="row-event">
            <div class="event-icon-wrap" :style="{ background: row.bg }">
              <span class="material-symbols-outlined event-icon" :style="{ color: row.color }">{{ row.icon }}</span>
            </div>
            <span class="event-name">{{ row.event }}</span>
          </div>
          <span class="row-source">{{ row.source }}</span>
          <span class="row-date">{{ row.date }}</span>
          <span class="row-value" :class="row.positive ? 'positive' : ''">{{ row.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const period = ref('7')

const kpis = [
  { icon: 'visibility',   color: 'var(--primary)',  bg: 'rgba(99,14,212,0.08)',  label: 'Profile Views',  value: '12,480', change: '+18%', positive: true },
  { icon: 'ads_click',    color: '#16a34a',          bg: 'rgba(22,163,74,0.08)', label: 'Click Rate',     value: '4.7%',   change: '+0.4%', positive: true },
  { icon: 'work',         color: 'var(--tertiary)',  bg: 'rgba(161,81,0,0.08)',  label: 'Job Requests',   value: '23',     change: '+5',    positive: true },
  { icon: 'payments',     color: '#f59e0b',          bg: 'rgba(245,158,11,0.08)',label: 'Earnings',       value: '$4,280', change: '+12%',  positive: true },
]

const chartData = [
  { label: 'Mon', views: 45, clicks: 30 },
  { label: 'Tue', views: 72, clicks: 55 },
  { label: 'Wed', views: 58, clicks: 40 },
  { label: 'Thu', views: 88, clicks: 70 },
  { label: 'Fri', views: 65, clicks: 50 },
  { label: 'Sat', views: 40, clicks: 25 },
  { label: 'Sun', views: 55, clicks: 35 },
]

const activityRows = [
  { id: 1, icon: 'visibility',  color: 'var(--primary)', bg: 'rgba(99,14,212,0.08)',  event: 'Profile View',    source: 'Google Search',  date: 'Jun 14',  value: '—',      positive: false },
  { id: 2, icon: 'work',        color: '#16a34a',         bg: 'rgba(22,163,74,0.08)', event: 'Job Request',     source: 'Direct',         date: 'Jun 14',  value: '+1',     positive: true },
  { id: 3, icon: 'payments',    color: '#f59e0b',         bg: 'rgba(245,158,11,0.08)',event: 'Payment',         source: 'FinTrack',       date: 'Jun 13',  value: '+$800',  positive: true },
  { id: 4, icon: 'star',        color: '#f59e0b',         bg: 'rgba(245,158,11,0.08)',event: 'New Review',      source: 'ShopFlow',       date: 'Jun 12',  value: '5★',     positive: true },
  { id: 5, icon: 'person_add',  color: 'var(--primary)', bg: 'rgba(99,14,212,0.08)',  event: 'New Follower',    source: 'Community',      date: 'Jun 11',  value: '+1',     positive: true },
]
</script>

<style scoped>
.analytics-view { display: flex; flex-direction: column; gap: 1.25rem; }

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.period-select {
  padding: 0.5rem 0.875rem;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-lg);
  font-family: var(--font-headline);
  font-size: 0.875rem;
  color: var(--on-surface);
  outline: none;
  cursor: pointer;
}

/* KPI Grid */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}
@media (min-width: 768px) { .kpi-grid { grid-template-columns: repeat(4, 1fr); } }

.kpi-card {
  padding: 1.25rem;
  border-radius: var(--radius-xl);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.kpi-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
}
.kpi-icon { font-size: 22px; }

.kpi-value { font-family: var(--font-headline); font-size: 1.5rem; font-weight: 700; color: var(--on-surface); letter-spacing: -0.02em; }
.kpi-label { font-size: 0.75rem; color: var(--on-surface-variant); margin-top: 0.1rem; }

.kpi-change {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  font-family: var(--font-headline);
  font-size: 0.75rem;
  font-weight: 700;
}
.kpi-change.positive { color: #16a34a; }
.kpi-change.negative { color: var(--error); }

/* Chart */
.chart-card { padding: 1.5rem; border-radius: var(--radius-xl); }

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.card-title { color: var(--on-surface); }

.chart-legend { display: flex; gap: 1rem; }
.legend-item { display: flex; align-items: center; gap: 0.35rem; font-size: 0.75rem; color: var(--on-surface-variant); font-family: var(--font-headline); }
.legend-dot { width: 8px; height: 8px; border-radius: 50%; }
.legend-dot.primary   { background: var(--primary); }
.legend-dot.secondary { background: var(--surface-container-high); border: 1px solid var(--outline-variant); }

.chart-bars {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  height: 140px;
}

.bar-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  height: 100%;
}

.bar-pair {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
  gap: 2px;
}

.bar-wrap {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: flex-end;
  background: var(--surface-container);
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  overflow: hidden;
}

.bar-fill {
  width: 100%;
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  animation: barGrow 0.6s ease forwards;
}

.primary-bar   { background: var(--primary); }
.secondary-bar { background: var(--surface-container-high); }

.bar-label { font-size: 0.7rem; color: var(--on-surface-variant); font-family: var(--font-headline); }

/* Table */
.table-card { padding: 1.5rem; border-radius: var(--radius-xl); }

.activity-table { display: flex; flex-direction: column; }

.table-head {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--on-surface-variant);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--outline-variant);
  margin-bottom: 0.5rem;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: var(--radius-lg);
  align-items: center;
  transition: var(--transition-fast);
}
.table-row:hover { background: var(--surface-container-low); }

.row-event { display: flex; align-items: center; gap: 0.75rem; }

.event-icon-wrap {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.event-icon { font-size: 16px; }

.event-name { font-family: var(--font-headline); font-size: 0.875rem; font-weight: 600; color: var(--on-surface); }
.row-source { font-size: 0.8rem; color: var(--on-surface-variant); }
.row-date   { font-size: 0.8rem; color: var(--on-surface-variant); }
.row-value  { font-family: var(--font-headline); font-size: 0.875rem; font-weight: 700; color: var(--on-surface-variant); }
.row-value.positive { color: #16a34a; }
</style>
