<template>
  <div class="dash-home">
    <!-- Welcome Header -->
    <div class="dash-welcome">
      <div>
        <h2 class="text-headline-md">Good {{ timeOfDay }}, {{ firstName }} 👋</h2>
        <p class="text-body-md" style="margin-top:0.25rem">Here's what's happening with your GFD account.</p>
      </div>
      <div class="welcome-actions">
        <button class="btn-outline" @click="copyProfileLink">
          <span class="material-symbols-outlined" style="font-size:16px">share</span>
          Share Profile
        </button>
        <RouterLink to="/dashboard/projects" class="btn-primary">
          <span class="material-symbols-outlined" style="font-size:16px">add</span>
          New Project
        </RouterLink>
      </div>
    </div>

    <!-- Bento Grid -->
    <div class="bento-grid">
      <!-- Engagement Overview (col-span-8) -->
      <div class="glass-card-static bento-card bento-wide">
        <div class="card-header">
          <h3 class="text-label-md card-title">Engagement Overview</h3>
          <span class="chip">Last 7 days</span>
        </div>
        <div class="chart-bars">
          <div v-for="(day, i) in chartData" :key="day.label" class="bar-col">
            <div class="bar-wrap">
              <div
                class="bar-fill"
                :style="{ height: day.pct + '%', animationDelay: i * 0.05 + 's' }"
              />
            </div>
            <span class="bar-label">{{ day.label }}</span>
          </div>
        </div>
        <div class="stats-row">
          <div v-for="stat in engagementStats" :key="stat.label" class="stat-item">
            <p class="stat-value">{{ stat.value }}</p>
            <p class="stat-label">{{ stat.label }}</p>
          </div>
        </div>
      </div>

      <!-- Job Requests (col-span-4) -->
      <div class="glass-card-static bento-card bento-narrow">
        <div class="card-header">
          <h3 class="text-label-md card-title">Job Requests</h3>
          <span v-if="jobRequests.length" class="chip chip-primary">{{ jobRequests.length }} NEW</span>
          <span v-else class="chip">0</span>
        </div>
        <div class="requests-list">
          <div v-if="jobRequests.length === 0" style="padding:1rem;text-align:center;color:var(--on-surface-variant);font-size:0.85rem;">
            No job requests yet
          </div>
          <div v-for="req in jobRequests" :key="req.id" class="req-item">
            <div class="req-avatar">{{ req.initials }}</div>
            <div class="req-info">
              <p class="req-name">{{ req.name }}</p>
              <p class="req-role">{{ req.role }}</p>
            </div>
            <div class="req-actions">
              <button class="icon-action accept" title="Accept">
                <span class="material-symbols-outlined">check</span>
              </button>
              <button class="icon-action reject" title="Reject">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>
        </div>
        <RouterLink to="/dashboard/requests" class="view-all-link">View all requests →</RouterLink>
      </div>

      <!-- Posted Projects (col-span-12) -->
      <div class="bento-card bento-full">
        <div class="card-header" style="margin-bottom:1rem">
          <h3 class="text-label-md card-title">Posted Projects</h3>
          <RouterLink to="/dashboard/projects" class="btn-ghost" style="font-size:0.8rem">View all</RouterLink>
        </div>
        <div class="projects-row">
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

          <!-- Add new project card -->
          <RouterLink to="/dashboard/projects" class="project-card project-add glass-card">
            <span class="material-symbols-outlined add-icon">add_circle</span>
            <p class="add-label">Post New Project</p>
          </RouterLink>
        </div>
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
  { label: 'Mon', pct: 0 },
  { label: 'Tue', pct: 0 },
  { label: 'Wed', pct: 0 },
  { label: 'Thu', pct: 0 },
  { label: 'Fri', pct: 0 },
  { label: 'Sat', pct: 0 },
  { label: 'Sun', pct: 0 },
])

const engagementStats = ref([
  { value: '0', label: 'Total Views' },
  { value: '0%', label: 'Click Rate' },
  { value: '—', label: 'Avg Time' },
])

const jobRequests = ref([])
const postedProjects = ref([])

onMounted(async () => {
  try {
    // Fetch real stats from analytics + profile
    const [me, analytics] = await Promise.all([
      http.get('/users/me'),
      http.get('/users/me/analytics?period=30').catch(() => null),
    ])
    engagementStats.value = [
      { value: String(me.follower_count || 0),                            label: 'Followers' },
      { value: String(me.post_count || 0),                                label: 'Posts' },
      { value: String(analytics?.job_requests || 0),                      label: 'Job Requests' },
      { value: String(analytics?.applications_submitted || 0),            label: 'Applications' },
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
.dash-home { display: flex; flex-direction: column; gap: 1.5rem; }

.dash-welcome {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.welcome-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }

/* Bento Grid */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1rem;
}

.bento-card { padding: 1.5rem; }
.bento-wide  { grid-column: span 12; }
.bento-narrow { grid-column: span 12; }
.bento-full  { grid-column: span 12; }

@media (min-width: 1024px) {
  .bento-wide   { grid-column: span 8; }
  .bento-narrow { grid-column: span 4; }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.card-title { color: var(--on-surface); }

/* Chart */
.chart-bars {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  height: 120px;
  margin-bottom: 1.25rem;
}

.bar-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
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
}

.bar-fill {
  width: 100%;
  background: var(--gradient-primary);
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  animation: barGrow 0.6s ease forwards;
  animation-delay: var(--delay, 0s);
}

.bar-label {
  font-size: 0.7rem;
  color: var(--on-surface-variant);
  font-family: var(--font-headline);
}

.stats-row {
  display: flex;
  gap: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--outline-variant);
}

.stat-item { display: flex; flex-direction: column; gap: 0.2rem; }
.stat-value { font-family: var(--font-headline); font-size: 1.25rem; font-weight: 700; color: var(--on-surface); }
.stat-label { font-size: 0.75rem; color: var(--on-surface-variant); }

/* Requests */
.requests-list { display: flex; flex-direction: column; gap: 0.75rem; flex: 1; }

.req-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem;
  border-radius: var(--radius-lg);
  background: var(--surface-container-low);
}

.req-avatar {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background: var(--primary-fixed);
  color: var(--primary);
  font-family: var(--font-headline);
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.req-info { flex: 1; min-width: 0; }
.req-name { font-size: 0.8rem; font-weight: 600; color: var(--on-surface); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.req-role { font-size: 0.7rem; color: var(--on-surface-variant); }

.req-actions { display: flex; gap: 0.25rem; }

.icon-action {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-fast);
}
.icon-action .material-symbols-outlined { font-size: 16px; }
.icon-action.accept { background: rgba(22,163,74,0.1); color: #16a34a; }
.icon-action.accept:hover { background: rgba(22,163,74,0.2); }
.icon-action.reject { background: rgba(186,26,26,0.1); color: var(--error); }
.icon-action.reject:hover { background: rgba(186,26,26,0.2); }

.view-all-link {
  font-size: 0.8rem;
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
  margin-top: 0.75rem;
  display: block;
}

/* Projects Row */
.projects-row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}

.project-card { padding: 0; overflow: hidden; }

.project-thumb {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.project-thumb-icon { font-size: 2.5rem; color: rgba(255,255,255,0.9); }

.project-body { padding: 1rem; }

.project-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
}

.project-name { font-family: var(--font-headline); font-size: 0.875rem; font-weight: 600; color: var(--on-surface); }
.project-desc { font-size: 0.75rem; color: var(--on-surface-variant); line-height: 1.5; }
.progress-label { font-size: 0.7rem; color: var(--on-surface-variant); margin-top: 0.25rem; }

.project-add {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  min-height: 180px;
  border: 2px dashed var(--outline-variant) !important;
  background: transparent !important;
  text-decoration: none;
  transition: var(--transition-fast);
}
.project-add:hover { border-color: var(--primary) !important; }
.add-icon { font-size: 2rem; color: var(--on-surface-variant); }
.add-label { font-size: 0.875rem; font-weight: 600; color: var(--on-surface-variant); font-family: var(--font-headline); }
.project-add:hover .add-icon,
.project-add:hover .add-label { color: var(--primary); }
</style>
