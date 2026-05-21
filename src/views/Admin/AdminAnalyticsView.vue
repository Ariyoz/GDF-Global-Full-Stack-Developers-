<template>
  <div class="admin-analytics-view">
    <div class="page-header">
      <div>
        <h1 class="text-headline-lg">Platform Analytics</h1>
        <p class="text-body-md" style="margin-top:0.25rem">Comprehensive metrics and growth insights for the GFD platform.</p>
      </div>
      <div class="header-actions">
        <select v-model="timeRange" class="filter-select">
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="1y">Last Year</option>
        </select>
        <button class="btn-outline">
          <span class="material-symbols-outlined" style="font-size:18px">download</span>
          Export
        </button>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="analytics-stats">
      <div v-for="stat in keyMetrics" :key="stat.label" class="analytics-stat-card glass-card-static">
        <div class="astat-header">
          <span class="material-symbols-outlined astat-icon" :style="{ color: stat.color }">{{ stat.icon }}</span>
          <span class="astat-change" :class="stat.positive ? 'positive' : 'negative'">{{ stat.change }}</span>
        </div>
        <h3 class="astat-value">{{ stat.value }}</h3>
        <p class="astat-label">{{ stat.label }}</p>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="charts-grid">
      <!-- User Growth -->
      <div class="chart-card glass-card-static">
        <h3 class="chart-title">User Growth</h3>
        <p class="chart-sub">New registrations over time</p>
        <div class="bar-chart">
          <div v-for="bar in userGrowthData" :key="bar.label" class="bar-col">
            <div class="bar-fill" :style="{ height: bar.pct + '%' }" />
            <span class="bar-label">{{ bar.label }}</span>
          </div>
        </div>
      </div>

      <!-- Engagement -->
      <div class="chart-card glass-card-static">
        <h3 class="chart-title">Engagement</h3>
        <p class="chart-sub">Posts, comments, and reactions per day</p>
        <div class="bar-chart">
          <div v-for="bar in engagementData" :key="bar.label" class="bar-col">
            <div class="bar-fill bar-fill-secondary" :style="{ height: bar.pct + '%' }" />
            <span class="bar-label">{{ bar.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Metrics -->
    <div class="metrics-grid">
      <!-- Top Skills -->
      <div class="metric-card glass-card-static">
        <h3 class="metric-title">Top Skills</h3>
        <div class="metric-list">
          <div v-for="skill in topSkills" :key="skill.name" class="metric-row">
            <span class="metric-row-label">{{ skill.name }}</span>
            <div class="metric-bar-wrap">
              <div class="metric-bar" :style="{ width: skill.pct + '%' }" />
            </div>
            <span class="metric-row-value">{{ skill.count }}</span>
          </div>
        </div>
      </div>

      <!-- Top Projects -->
      <div class="metric-card glass-card-static">
        <h3 class="metric-title">Most Active Projects</h3>
        <div class="metric-list">
          <div v-for="project in topProjects" :key="project.name" class="metric-row">
            <span class="metric-row-label">{{ project.name }}</span>
            <div class="metric-bar-wrap">
              <div class="metric-bar metric-bar-alt" :style="{ width: project.pct + '%' }" />
            </div>
            <span class="metric-row-value">{{ project.collaborators }}</span>
          </div>
        </div>
      </div>

      <!-- Geographic Distribution -->
      <div class="metric-card glass-card-static">
        <h3 class="metric-title">Geographic Distribution</h3>
        <div class="metric-list">
          <div v-for="region in geoData" :key="region.name" class="metric-row">
            <span class="metric-row-label">{{ region.flag }} {{ region.name }}</span>
            <div class="metric-bar-wrap">
              <div class="metric-bar metric-bar-geo" :style="{ width: region.pct + '%' }" />
            </div>
            <span class="metric-row-value">{{ region.users }}</span>
          </div>
        </div>
      </div>

      <!-- Platform Health -->
      <div class="metric-card glass-card-static">
        <h3 class="metric-title">Platform Health</h3>
        <div class="health-grid">
          <div v-for="item in healthMetrics" :key="item.label" class="health-item">
            <div class="health-indicator" :class="item.status" />
            <div>
              <p class="health-label">{{ item.label }}</p>
              <p class="health-value">{{ item.value }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const timeRange = ref('30d')

const keyMetrics = [
  { icon: 'group',        label: 'Total Users',       value: '12,842',  change: '+12.3%', positive: true,  color: 'var(--primary)' },
  { icon: 'article',      label: 'Total Posts',       value: '48,291',  change: '+8.7%',  positive: true,  color: '#3b82f6' },
  { icon: 'folder_open',  label: 'Active Projects',   value: '1,847',   change: '+15.2%', positive: true,  color: '#10b981' },
  { icon: 'handshake',    label: 'Collaborations',    value: '3,412',   change: '+22.1%', positive: true,  color: '#f59e0b' },
  { icon: 'visibility',   label: 'Page Views (30d)',  value: '2.4M',    change: '+5.8%',  positive: true,  color: 'var(--primary)' },
  { icon: 'timer',        label: 'Avg Session',       value: '8m 42s',  change: '-2.1%',  positive: false, color: 'var(--error)' },
]

const userGrowthData = [
  { label: 'Mon', pct: 45 },
  { label: 'Tue', pct: 62 },
  { label: 'Wed', pct: 78 },
  { label: 'Thu', pct: 55 },
  { label: 'Fri', pct: 90 },
  { label: 'Sat', pct: 40 },
  { label: 'Sun', pct: 35 },
]

const engagementData = [
  { label: 'Mon', pct: 60 },
  { label: 'Tue', pct: 75 },
  { label: 'Wed', pct: 85 },
  { label: 'Thu', pct: 70 },
  { label: 'Fri', pct: 95 },
  { label: 'Sat', pct: 50 },
  { label: 'Sun', pct: 45 },
]

const topSkills = [
  { name: 'React',       count: '4,281', pct: 95 },
  { name: 'TypeScript',  count: '3,892', pct: 87 },
  { name: 'Node.js',     count: '3,541', pct: 79 },
  { name: 'Python',      count: '2,987', pct: 67 },
  { name: 'Rust',        count: '1,842', pct: 41 },
]

const topProjects = [
  { name: 'GFD Platform',     collaborators: '24 devs', pct: 100 },
  { name: 'DevConnect API',   collaborators: '18 devs', pct: 75 },
  { name: 'CodeReview Bot',   collaborators: '12 devs', pct: 50 },
  { name: 'SkillMatch AI',    collaborators: '9 devs',  pct: 38 },
  { name: 'OpenDeploy',       collaborators: '7 devs',  pct: 29 },
]

const geoData = [
  { flag: '🇺🇸', name: 'United States', users: '3,842', pct: 100 },
  { flag: '🇳🇬', name: 'Nigeria',       users: '2,104', pct: 55 },
  { flag: '🇮🇳', name: 'India',         users: '1,987', pct: 52 },
  { flag: '🇬🇧', name: 'United Kingdom', users: '1,241', pct: 32 },
  { flag: '🇩🇪', name: 'Germany',       users: '892',   pct: 23 },
]

const healthMetrics = [
  { label: 'API Response Time',  value: '42ms avg',     status: 'healthy' },
  { label: 'Database Load',      value: '23% capacity', status: 'healthy' },
  { label: 'Error Rate',         value: '0.02%',        status: 'healthy' },
  { label: 'CDN Cache Hit',      value: '94.7%',        status: 'healthy' },
  { label: 'Auth Service',       value: 'Operational',  status: 'healthy' },
  { label: 'Storage Usage',      value: '67% used',     status: 'warning' },
]
</script>

<style scoped>
.admin-analytics-view { display: flex; flex-direction: column; gap: 1.5rem; padding: 1.5rem; min-height: 100vh; }
@media (min-width: 768px) { .admin-analytics-view { padding: 2rem; } }

.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
.header-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }

.filter-select {
  padding: 0.5rem 0.875rem; background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant); border-radius: var(--radius-lg);
  font-family: var(--font-headline); font-size: 0.875rem; color: var(--on-surface); outline: none; cursor: pointer;
}

/* Key Metrics */
.analytics-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
@media (min-width: 768px) { .analytics-stats { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 1024px) { .analytics-stats { grid-template-columns: repeat(6, 1fr); } }

.analytics-stat-card { padding: 1.25rem; border-radius: var(--radius-xl); display: flex; flex-direction: column; gap: 0.5rem; }
.astat-header { display: flex; align-items: center; justify-content: space-between; }
.astat-icon { font-size: 22px; }
.astat-change { font-family: var(--font-headline); font-size: 0.7rem; font-weight: 700; padding: 0.15rem 0.4rem; border-radius: var(--radius-sm); }
.astat-change.positive { background: rgba(22,163,74,0.1); color: #16a34a; }
.astat-change.negative { background: rgba(239,68,68,0.1); color: #ef4444; }
.astat-value { font-family: var(--font-headline); font-size: 1.25rem; font-weight: 700; color: var(--on-surface); }
.astat-label { font-size: 0.72rem; color: var(--on-surface-variant); font-family: var(--font-headline); }

/* Charts */
.charts-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
@media (min-width: 768px) { .charts-grid { grid-template-columns: 1fr 1fr; } }

.chart-card { padding: 1.5rem; border-radius: var(--radius-xl); }
.chart-title { font-family: var(--font-headline); font-size: 1rem; font-weight: 700; color: var(--on-surface); }
.chart-sub { font-size: 0.75rem; color: var(--on-surface-variant); margin-top: 0.25rem; margin-bottom: 1.25rem; }

.bar-chart { display: flex; align-items: flex-end; gap: 0.5rem; height: 140px; }
.bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; justify-content: flex-end; gap: 0.4rem; }
.bar-fill { width: 100%; background: var(--primary); border-radius: var(--radius-sm) var(--radius-sm) 0 0; transition: height 0.4s ease; min-height: 4px; }
.bar-fill-secondary { background: #3b82f6; }
.bar-label { font-size: 0.65rem; color: var(--on-surface-variant); font-family: var(--font-headline); }

/* Metrics Grid */
.metrics-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
@media (min-width: 768px) { .metrics-grid { grid-template-columns: 1fr 1fr; } }

.metric-card { padding: 1.5rem; border-radius: var(--radius-xl); }
.metric-title { font-family: var(--font-headline); font-size: 1rem; font-weight: 700; color: var(--on-surface); margin-bottom: 1rem; }

.metric-list { display: flex; flex-direction: column; gap: 0.75rem; }
.metric-row { display: flex; align-items: center; gap: 0.75rem; }
.metric-row-label { font-family: var(--font-headline); font-size: 0.82rem; font-weight: 500; color: var(--on-surface); min-width: 100px; white-space: nowrap; }
.metric-bar-wrap { flex: 1; height: 8px; background: var(--surface-container-high); border-radius: 4px; overflow: hidden; }
.metric-bar { height: 100%; background: var(--primary); border-radius: 4px; transition: width 0.4s ease; }
.metric-bar-alt { background: #10b981; }
.metric-bar-geo { background: #3b82f6; }
.metric-row-value { font-family: var(--font-headline); font-size: 0.78rem; font-weight: 600; color: var(--on-surface-variant); min-width: 60px; text-align: right; }

/* Health */
.health-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
.health-item { display: flex; align-items: center; gap: 0.625rem; }
.health-indicator { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.health-indicator.healthy { background: #16a34a; }
.health-indicator.warning { background: #f59e0b; }
.health-indicator.error { background: #ef4444; }
.health-label { font-size: 0.75rem; color: var(--on-surface-variant); font-family: var(--font-headline); }
.health-value { font-family: var(--font-headline); font-size: 0.82rem; font-weight: 600; color: var(--on-surface); }
</style>
