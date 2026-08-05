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
import { ref, watch, onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'
import { analyticsService } from '@/services/analytics.service'
import { walletService } from '@/services/wallet.service'
import { useCurrencyStore } from '@/store/currency'

const authStore     = useAuthStore()
const currencyStore = useCurrencyStore()
const period        = ref('7')
const loading       = ref(false)

const kpis = ref([
  { icon: 'edit_note',   color: 'var(--primary)', bg: 'rgba(99,14,212,0.08)',  label: 'Posts Published',      value: '0', change: '—', positive: true },
  { icon: 'group',       color: '#16a34a',         bg: 'rgba(22,163,74,0.08)', label: 'Followers',            value: '0', change: '—', positive: true },
  { icon: 'work',        color: 'var(--tertiary)', bg: 'rgba(161,81,0,0.08)',  label: 'Job Requests Received',value: '0', change: '—', positive: true },
  { icon: 'send',        color: '#f59e0b',          bg: 'rgba(245,158,11,0.08)',label: 'Applications Sent',    value: '0', change: '—', positive: true },
])

const chartData   = ref([])
const activityRows = ref([])

async function loadAnalytics() {
  loading.value = true
  try {
    const [data, wallet] = await Promise.all([
      analyticsService.getMyAnalytics(Number(period.value)),
      walletService.getWallet().catch(() => ({ balance: 0, total_earned: 0 })),
    ])

    kpis.value[0].value = String(data.post_count       || 0)
    kpis.value[1].value = String(data.follower_count   || 0)
    kpis.value[2].value = String(data.job_requests     || 0)
    kpis.value[3].value = String(data.applications_submitted || 0)

    // Normalise chart so tallest bar = 100%
    const maxPosts = Math.max(...(data.chart || []).map(d => d.posts), 1)
    chartData.value = (data.chart || []).map(d => ({
      label:  d.label,
      posts:  Math.round((d.posts / maxPosts) * 100),
      views:  0,
      clicks: 0,
      raw:    d.posts,
    }))

    // Build activity rows from real numbers
    activityRows.value = [
      { id: 1, icon: 'edit_note',   color: 'var(--primary)', bg: 'rgba(99,14,212,0.08)',  event: 'Posts published',          source: 'Your posts',     date: 'All time',   value: data.post_count,             positive: true },
      { id: 2, icon: 'group',       color: '#16a34a',         bg: 'rgba(22,163,74,0.08)', event: 'Total followers',           source: 'Your profile',   date: 'All time',   value: data.follower_count,         positive: true },
      { id: 3, icon: 'work',        color: 'var(--tertiary)', bg: 'rgba(161,81,0,0.08)',  event: 'Job applications received', source: 'Your jobs',      date: 'All time',   value: data.job_requests,           positive: true },
      { id: 4, icon: 'send',        color: '#f59e0b',          bg: 'rgba(245,158,11,0.08)',event: 'Applications submitted',    source: 'Jobs applied',   date: 'All time',   value: data.applications_submitted, positive: true },
      { id: 5, icon: 'account_balance_wallet', color: '#22c55e', bg: 'rgba(34,197,94,0.08)', event: 'Wallet balance',        source: 'Wallet',         date: 'Current',    value: `₦${Number(wallet.balance||0).toLocaleString()}`, positive: true },
    ]
  } catch (err) {
    console.error('Analytics load error:', err)
  } finally {
    loading.value = false
  }
}

watch(period, loadAnalytics)
onMounted(loadAnalytics)
</script>

<style scoped>
/* ── Layout ─────────────────────────────── */
.analytics-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* ── Page Header ─────────────────────────── */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

/* ── Period Select ───────────────────────── */
.period-select {
  padding: 0.5rem 1rem;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-lg);
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--on-surface);
  outline: none;
  cursor: pointer;
  transition: var(--transition-fast);
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23a0a0bc' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  padding-right: 2.25rem;
}
.period-select:hover {
  border-color: var(--primary);
  background-color: var(--surface-container-low);
}
.period-select:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99, 14, 212, 0.1);
}

/* ── KPI Grid ────────────────────────────── */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}
@media (min-width: 768px) {
  .kpi-grid { grid-template-columns: repeat(4, 1fr); }
}

.kpi-card {
  padding: 1.25rem 1.25rem 1.125rem;
  border-radius: var(--radius-xl);
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  position: relative;
  overflow: hidden;
  border-left: 3px solid var(--primary);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.kpi-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--gradient-primary);
}
.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.kpi-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.kpi-icon { font-size: 22px; }

.kpi-info { display: flex; flex-direction: column; gap: 0.2rem; }

.kpi-value {
  font-family: var(--font-headline);
  font-size: 1.625rem;
  font-weight: 800;
  color: var(--on-surface);
  letter-spacing: -0.03em;
  line-height: 1.1;
}
.kpi-label {
  font-size: 0.75rem;
  color: var(--on-surface-variant);
  font-weight: 500;
  line-height: 1.4;
}

.kpi-change {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  font-family: var(--font-headline);
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-full);
  width: fit-content;
}
.kpi-change.positive {
  color: #16a34a;
  background: rgba(22, 163, 74, 0.1);
}
.kpi-change.negative {
  color: var(--error);
  background: rgba(186, 26, 26, 0.08);
}
[data-theme="dark"] .kpi-change.negative {
  color: #f87171;
  background: rgba(248, 113, 113, 0.1);
}

/* ── Chart Card ──────────────────────────── */
.chart-card {
  padding: 1.5rem;
  border-radius: var(--radius-xl);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.card-title {
  color: var(--on-surface);
  font-family: var(--font-headline);
  font-weight: 700;
  font-size: 0.9375rem;
  letter-spacing: -0.01em;
}

/* ── Chart Legend ────────────────────────── */
.chart-legend {
  display: flex;
  gap: 1rem;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  color: var(--on-surface-variant);
  font-family: var(--font-headline);
  font-weight: 500;
}
.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.legend-dot.primary   { background: var(--primary); }
.legend-dot.secondary {
  background: var(--surface-container-high);
  border: 1.5px solid var(--outline-variant);
}

/* ── Chart Bars ──────────────────────────── */
.chart-bars {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  height: 150px;
}

.bar-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
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
  transition: height 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.primary-bar {
  background: var(--gradient-primary);
  box-shadow: 0 -2px 8px rgba(99, 14, 212, 0.25);
}
.secondary-bar {
  background: var(--surface-container-high);
}

.bar-label {
  font-size: 0.68rem;
  color: var(--on-surface-variant);
  font-family: var(--font-headline);
  font-weight: 500;
  letter-spacing: 0.01em;
}

/* ── Table Card ──────────────────────────── */
.table-card {
  padding: 1.5rem;
  border-radius: var(--radius-xl);
}

.activity-table {
  display: flex;
  flex-direction: column;
}

.table-head {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 0.5rem 0.875rem;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--on-surface-variant);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  border-bottom: 1px solid var(--outline-variant);
  margin-bottom: 0.375rem;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 0.75rem 0.875rem;
  border-radius: var(--radius-lg);
  align-items: center;
  transition: background 0.15s ease;
}
.table-row:hover {
  background: var(--surface-container-low);
}

.row-event {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.event-icon-wrap {
  width: 34px;
  height: 34px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.event-icon { font-size: 16px; }

.event-name {
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--on-surface);
}
.row-source {
  font-size: 0.8rem;
  color: var(--on-surface-variant);
}
.row-date {
  font-size: 0.8rem;
  color: var(--on-surface-variant);
}
.row-value {
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--on-surface-variant);
}
.row-value.positive {
  color: #16a34a;
}
[data-theme="dark"] .row-value.positive {
  color: #4ade80;
}
</style>
