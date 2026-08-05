<template>
  <div class="dash-home">

    <!-- ── Welcome Header ── -->
    <div class="dash-welcome animate-fade-in-up">
      <div class="welcome-left">
        <div class="welcome-time-badge">
          <span class="material-symbols-outlined" style="font-size:14px;font-variation-settings:'FILL' 1">
            {{ timeOfDay === 'morning' ? 'wb_sunny' : timeOfDay === 'afternoon' ? 'partly_cloudy_day' : 'bedtime' }}
          </span>
          Good {{ timeOfDay }}
        </div>
        <h2 class="welcome-name">{{ firstName }} <span class="wave">👋</span></h2>
        <p class="welcome-sub">Here's what's happening with your GFD account today.</p>
      </div>
      <div class="welcome-actions">
        <button class="btn-outline welcome-btn" @click="copyProfileLink">
          <span class="material-symbols-outlined" style="font-size:16px">share</span>
          Share Profile
        </button>
        <RouterLink to="/dashboard/projects" class="btn-primary welcome-btn">
          <span class="material-symbols-outlined" style="font-size:16px">add</span>
          New Project
        </RouterLink>
      </div>
    </div>

    <!-- ── Stats Row ── -->
    <div class="stats-row animate-fade-in-up delay-100">
      <div v-for="(stat, i) in engagementStats" :key="stat.label"
        class="stat-card glass-card hover-lift"
        :class="`delay-${i * 100}`">
        <div class="stat-top-bar" />
        <p class="stat-label-top">{{ stat.label }}</p>
        <p class="stat-value text-gradient">{{ stat.value }}</p>
        <p class="stat-trend">
          <span class="material-symbols-outlined" style="font-size:12px;color:#22c55e">trending_up</span>
          <span>+0 this week</span>
        </p>
      </div>
    </div>

    <!-- ── Bento Grid ── -->
    <div class="bento-grid">

      <!-- Engagement Chart (wide) -->
      <div class="glass-card-static bento-card bento-wide animate-fade-in-up delay-200">
        <div class="card-header">
          <div class="card-title-group">
            <span class="material-symbols-outlined card-ico">bar_chart</span>
            <h3 class="card-title">Engagement Overview</h3>
          </div>
          <span class="chip">Last 7 days</span>
        </div>

        <div class="chart-area">
          <div class="chart-bars">
            <div v-for="(day, i) in chartData" :key="day.label" class="bar-col">
              <div class="bar-wrap">
                <div class="bar-fill"
                  :style="{ height: (day.pct || 15) + '%', animationDelay: i * 0.07 + 's' }" />
              </div>
              <span class="bar-label">{{ day.label }}</span>
            </div>
          </div>
          <div class="chart-y-lines" aria-hidden="true">
            <div class="y-line" /><div class="y-line" /><div class="y-line" /><div class="y-line" />
          </div>
        </div>

        <div class="chart-stats">
          <div v-for="stat in engagementStats" :key="stat.label" class="cstat">
            <p class="cstat-val">{{ stat.value }}</p>
            <p class="cstat-lbl">{{ stat.label }}</p>
          </div>
        </div>
      </div>

      <!-- Job Requests (narrow) -->
      <div class="glass-card-static bento-card bento-narrow animate-fade-in-up delay-300">
        <div class="card-header">
          <div class="card-title-group">
            <span class="material-symbols-outlined card-ico">inbox</span>
            <h3 class="card-title">Job Requests</h3>
          </div>
          <span v-if="jobRequests.length" class="chip chip-primary">{{ jobRequests.length }} NEW</span>
          <span v-else class="chip">0</span>
        </div>

        <div class="requests-list">
          <div v-if="!jobRequests.length" class="empty-requests">
            <span class="material-symbols-outlined" style="font-size:2rem;color:var(--on-surface-variant);opacity:.4">work_off</span>
            <p>No job requests yet</p>
          </div>
          <div v-for="req in jobRequests" :key="req.id" class="req-item">
            <div class="req-avatar">{{ req.initials }}</div>
            <div class="req-info">
              <p class="req-name">{{ req.name }}</p>
              <p class="req-role">{{ req.role }}</p>
            </div>
            <div class="req-actions">
              <button class="icon-action accept" title="Accept">
                <span class="material-symbols-outlined" style="font-size:15px">check</span>
              </button>
              <button class="icon-action reject" title="Reject">
                <span class="material-symbols-outlined" style="font-size:15px">close</span>
              </button>
            </div>
          </div>
        </div>
        <RouterLink to="/dashboard/requests" class="view-all-link">
          View all requests
          <span class="material-symbols-outlined" style="font-size:14px">arrow_forward</span>
        </RouterLink>
      </div>

      <!-- Posted Projects (full width) -->
      <div class="bento-card bento-full animate-fade-in-up delay-300">
        <div class="card-header" style="margin-bottom:1.25rem">
          <div class="card-title-group">
            <span class="material-symbols-outlined card-ico">folder_open</span>
            <h3 class="card-title">Your Projects</h3>
          </div>
          <RouterLink to="/dashboard/projects" class="btn-ghost" style="font-size:0.8rem">
            View all
            <span class="material-symbols-outlined" style="font-size:14px">arrow_forward</span>
          </RouterLink>
        </div>

        <div class="projects-grid">
          <div v-for="project in postedProjects" :key="project.id" class="project-card glass-card">
            <div class="project-thumb" :style="{ background: project.gradient }">
              <span class="material-symbols-outlined project-thumb-icon">{{ project.icon }}</span>
            </div>
            <div class="project-body">
              <div class="project-top">
                <h4 class="project-name">{{ project.name }}</h4>
                <GfdBadge :variant="project.statusVariant">{{ project.status }}</GfdBadge>
              </div>
              <p class="project-desc">{{ project.desc }}</p>
              <div class="progress-bar" style="margin-top:0.75rem">
                <div class="progress-bar-fill" :style="{ width: project.progress + '%' }" />
              </div>
              <p class="progress-label">{{ project.progress }}% complete</p>
            </div>
          </div>

          <RouterLink to="/dashboard/projects" class="project-card project-add glass-card">
            <span class="material-symbols-outlined add-icon">add_circle</span>
            <p class="add-label">Post New Project</p>
          </RouterLink>
        </div>
      </div>

    </div><!-- /bento-grid -->

    <!-- ── Quick Links ── -->
    <div class="quick-links animate-fade-in-up delay-400">
      <p class="quick-links-label">Quick Access</p>
      <div class="quick-links-grid">
        <RouterLink v-for="q in QUICK_LINKS" :key="q.to" :to="q.to" class="quick-link glass-card">
          <div class="ql-icon">
            <span class="material-symbols-outlined" style="font-size:20px;font-variation-settings:'FILL' 1">{{ q.icon }}</span>
          </div>
          <span class="ql-label">{{ q.label }}</span>
          <span class="material-symbols-outlined ql-arrow">arrow_forward_ios</span>
        </RouterLink>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/store/auth'
import { useUiStore }   from '@/store/ui'
import GfdBadge from '@/components/ui/GfdBadge.vue'
import http from '@/services/http'

const authStore = useAuthStore()
const uiStore   = useUiStore()
const { user }  = storeToRefs(authStore)
const profile = computed(() => authStore.profile)

const timeOfDay = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
})

const firstName = computed(() => {
  const name = profile.value?.full_name || profile.value?.username || user.value?.email || 'Developer'
  return name.split(' ')[0]
})

const chartData = ref([
  { label: 'Mon', pct: 0 }, { label: 'Tue', pct: 0 }, { label: 'Wed', pct: 0 },
  { label: 'Thu', pct: 0 }, { label: 'Fri', pct: 0 }, { label: 'Sat', pct: 0 },
  { label: 'Sun', pct: 0 },
])

const engagementStats = ref([
  { value: '0', label: 'Followers' },
  { value: '0', label: 'Posts' },
  { value: '0', label: 'Job Requests' },
  { value: '0', label: 'Applications' },
])

const jobRequests    = ref([])
const postedProjects = ref([])

const QUICK_LINKS = [
  { to: '/explore',             icon: 'search',                   label: 'Explore Developers' },
  { to: '/jobs',                icon: 'work',                     label: 'Browse Jobs' },
  { to: '/dashboard/analytics', icon: 'analytics',                label: 'My Analytics' },
  { to: '/messaging',           icon: 'chat',                     label: 'Messages' },
  { to: '/wallet',              icon: 'account_balance_wallet',   label: 'Wallet' },
]

onMounted(async () => {
  try {
    const [me, analytics] = await Promise.all([
      http.get('/users/me'),
      http.get('/users/me/analytics?period=30').catch(() => null),
    ])
    engagementStats.value = [
      { value: String(me.follower_count || 0),                        label: 'Followers' },
      { value: String(me.post_count || 0),                            label: 'Posts' },
      { value: String(analytics?.job_requests || 0),                  label: 'Job Requests' },
      { value: String(analytics?.applications_submitted || 0),        label: 'Applications' },
    ]
  } catch { /* ignore */ }
})

function copyProfileLink() {
  const id = profile.value?.id || user.value?.id || 'me'
  navigator.clipboard?.writeText(window.location.origin + '/developer/' + id)
  uiStore.showSuccess('Profile link copied!')
}
</script>

<style scoped>
/* ══════════════════════════════════════
   ROOT
══════════════════════════════════════ */
.dash-home {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  padding-bottom: 3rem;
}

/* ══════════════════════════════════════
   WELCOME HEADER
══════════════════════════════════════ */
.dash-welcome {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.25rem;
  flex-wrap: wrap;
  padding: 1.5rem 1.75rem;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-2xl);
  position: relative;
  overflow: hidden;
}
.dash-welcome::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: var(--gradient-primary);
}

.welcome-time-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.75rem;
  background: rgba(99,14,212,0.07);
  border: 1px solid rgba(99,14,212,0.15);
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 0.625rem;
}
[data-theme="dark"] .welcome-time-badge {
  background: rgba(168,85,247,0.1);
  border-color: rgba(168,85,247,0.2);
}

.welcome-name {
  font-family: var(--font-headline);
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 800;
  color: var(--on-surface);
  letter-spacing: -0.025em;
  margin-bottom: 0.25rem;
}
.wave { font-style: normal; }

.welcome-sub {
  font-size: 0.9rem;
  color: var(--on-surface-variant);
  line-height: 1.5;
}

.welcome-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-self: center;
}
.welcome-btn {
  font-size: 0.875rem;
  padding: 0.625rem 1.25rem;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

/* ══════════════════════════════════════
   STATS ROW
══════════════════════════════════════ */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}
@media (max-width: 900px) { .stats-row { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .stats-row { grid-template-columns: 1fr 1fr; } }

.stat-card {
  padding: 1.25rem 1.25rem 1rem;
  border-radius: var(--radius-xl);
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  position: relative;
  overflow: hidden;
  border-left: 3px solid var(--primary) !important;
  background: linear-gradient(135deg, rgba(99,14,212,0.03) 0%, transparent 60%) !important;
}
[data-theme="dark"] .stat-card {
  background: linear-gradient(135deg, rgba(168,85,247,0.05) 0%, transparent 60%) !important;
}
.stat-top-bar {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: var(--gradient-primary);
  opacity: 0.6;
}
.stat-label-top {
  font-family: var(--font-headline);
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--on-surface-variant);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.stat-value {
  font-family: var(--font-headline);
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
  margin: 0.1rem 0;
}
.stat-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.72rem;
  color: var(--on-surface-variant);
}

/* ══════════════════════════════════════
   BENTO GRID
══════════════════════════════════════ */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1rem;
}
.bento-card   { padding: 1.5rem; }
.bento-wide   { grid-column: span 12; }
.bento-narrow { grid-column: span 12; }
.bento-full   { grid-column: span 12; }

@media (min-width: 1024px) {
  .bento-wide   { grid-column: span 8; }
  .bento-narrow { grid-column: span 4; }
}

/* Card header */
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  gap: 0.75rem;
}
.card-title-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.card-ico {
  font-size: 18px;
  color: var(--primary);
}
.card-title {
  font-family: var(--font-headline);
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--on-surface);
}

/* ── Chart ── */
.chart-area {
  position: relative;
  margin-bottom: 1.25rem;
}
.chart-y-lines {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  pointer-events: none;
}
.y-line {
  width: 100%;
  height: 1px;
  background: var(--outline-variant);
  opacity: 0.4;
}
.chart-bars {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  height: 140px;
  position: relative;
  z-index: 1;
}
.bar-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  height: 100%;
}
.bar-wrap {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
  background: var(--surface-container);
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  overflow: hidden;
  position: relative;
}
.bar-fill {
  width: 100%;
  background: var(--gradient-primary);
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  animation: barGrow 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards;
  min-height: 4px;
  opacity: 0.9;
}
@keyframes barGrow {
  from { height: 0 !important; }
  to   { height: var(--target-h, 100%); }
}
.bar-label {
  font-size: 0.68rem;
  color: var(--on-surface-variant);
  font-family: var(--font-headline);
  font-weight: 500;
}
.chart-stats {
  display: flex;
  gap: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--outline-variant);
  flex-wrap: wrap;
}
.cstat { display: flex; flex-direction: column; gap: 0.2rem; }
.cstat-val {
  font-family: var(--font-headline);
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--on-surface);
  letter-spacing: -0.02em;
}
.cstat-lbl { font-size: 0.72rem; color: var(--on-surface-variant); }

/* ── Requests ── */
.requests-list {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  flex: 1;
  min-height: 80px;
}
.empty-requests {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.5rem 0;
  text-align: center;
  font-size: 0.8rem;
  color: var(--on-surface-variant);
}
.req-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: var(--radius-lg);
  background: var(--surface-container-low);
  border: 1px solid var(--outline-variant);
  transition: border-color 0.15s ease;
}
.req-item:hover { border-color: rgba(99,14,212,0.2); }
.req-avatar {
  width: 36px; height: 36px;
  border-radius: var(--radius-full);
  background: rgba(99,14,212,0.1);
  color: var(--primary);
  font-family: var(--font-headline);
  font-size: 0.75rem;
  font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.req-info { flex: 1; min-width: 0; }
.req-name { font-size: 0.8rem; font-weight: 600; color: var(--on-surface); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.req-role { font-size: 0.7rem; color: var(--on-surface-variant); }
.req-actions { display: flex; gap: 0.25rem; }
.icon-action {
  width: 28px; height: 28px;
  border-radius: var(--radius-full);
  border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: var(--transition-fast);
}
.icon-action.accept { background: rgba(22,163,74,0.1); color: #16a34a; }
.icon-action.accept:hover { background: rgba(22,163,74,0.2); }
.icon-action.reject { background: rgba(186,26,26,0.1); color: var(--error); }
.icon-action.reject:hover { background: rgba(186,26,26,0.2); }
.view-all-link {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  color: var(--primary);
  text-decoration: none;
  font-family: var(--font-headline);
  font-weight: 600;
  margin-top: 0.875rem;
  transition: gap 0.15s ease;
}
.view-all-link:hover { gap: 0.5rem; }

/* ── Projects ── */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}
.project-card { padding: 0; overflow: hidden; transition: transform 0.2s ease, box-shadow 0.2s ease; }
.project-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
.project-thumb {
  height: 100px;
  display: flex; align-items: center; justify-content: center;
}
.project-thumb-icon { font-size: 2.5rem; color: rgba(255,255,255,0.9); }
.project-body { padding: 1rem; }
.project-top {
  display: flex; align-items: flex-start;
  justify-content: space-between; gap: 0.5rem; margin-bottom: 0.4rem;
}
.project-name { font-family: var(--font-headline); font-size: 0.875rem; font-weight: 700; color: var(--on-surface); }
.project-desc { font-size: 0.75rem; color: var(--on-surface-variant); line-height: 1.5;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.progress-label { font-size: 0.7rem; color: var(--on-surface-variant); margin-top: 0.25rem; }

.project-add {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 0.75rem; min-height: 180px;
  border: 2px dashed var(--outline-variant) !important;
  background: transparent !important;
  text-decoration: none;
  transition: var(--transition-fast);
}
.project-add:hover { border-color: var(--primary) !important; }
.add-icon { font-size: 2rem; color: var(--on-surface-variant); transition: color 0.15s; }
.add-label { font-size: 0.875rem; font-weight: 600; color: var(--on-surface-variant); font-family: var(--font-headline); transition: color 0.15s; }
.project-add:hover .add-icon,
.project-add:hover .add-label { color: var(--primary); }

/* ══════════════════════════════════════
   QUICK LINKS
══════════════════════════════════════ */
.quick-links { display: flex; flex-direction: column; gap: 0.75rem; }
.quick-links-label {
  font-family: var(--font-headline);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--on-surface-variant);
}
.quick-links-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.75rem;
}
@media (max-width: 900px)  { .quick-links-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 540px)  { .quick-links-grid { grid-template-columns: repeat(2, 1fr); } }

.quick-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  text-decoration: none;
  border-radius: var(--radius-xl);
  transition: all 0.2s ease;
}
.quick-link:hover {
  border-color: rgba(99,14,212,0.25) !important;
  background: rgba(99,14,212,0.04) !important;
  transform: translateY(-2px);
}
[data-theme="dark"] .quick-link:hover {
  border-color: rgba(168,85,247,0.3) !important;
  background: rgba(168,85,247,0.06) !important;
}
.ql-icon {
  width: 36px; height: 36px;
  border-radius: var(--radius-md);
  background: rgba(99,14,212,0.08);
  display: flex; align-items: center; justify-content: center;
  color: var(--primary); flex-shrink: 0;
  transition: background 0.2s ease;
}
[data-theme="dark"] .ql-icon { background: rgba(168,85,247,0.12); }
.quick-link:hover .ql-icon { background: var(--primary); color: #fff; }
.ql-label {
  flex: 1;
  font-family: var(--font-headline);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--on-surface);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ql-arrow {
  font-size: 12px !important;
  color: var(--on-surface-variant);
  transition: transform 0.2s ease, color 0.2s ease;
}
.quick-link:hover .ql-arrow { transform: translateX(2px); color: var(--primary); }

/* ══════════════════════════════════════
   RESPONSIVE
══════════════════════════════════════ */
@media (max-width: 640px) {
  .dash-home { gap: 1.25rem; }
  .bento-card { padding: 1.125rem; }
  .dash-welcome { padding: 1.25rem; }
  .welcome-actions { width: 100%; }
  .welcome-btn { flex: 1; justify-content: center; }
}
</style>
