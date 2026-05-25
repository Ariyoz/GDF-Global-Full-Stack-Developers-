<template>
  <div class="dash-projects">
    <div class="page-header">
      <div>
        <h2 class="text-headline-md">My Projects</h2>
        <p class="text-body-md" style="margin-top:0.25rem">Manage and track all your active projects.</p>
      </div>
      <button class="btn-primary" @click="goToNewProject">
        <span class="material-symbols-outlined" style="font-size:16px;">add</span>
        New Project
      </button>
    </div>

    <!-- Filter Tabs -->
    <div class="filter-tabs">
      <button
        v-for="tab in statusTabs"
        :key="tab.value"
        class="filter-tab"
        :class="{ active: activeStatus === tab.value }"
        @click="activeStatus = tab.value"
      >
        {{ tab.label }}
        <span v-if="tab.count" class="tab-count">{{ tab.count }}</span>
      </button>
    </div>

    <!-- Projects Grid -->
    <div class="projects-grid">
      <div
        v-for="(project, i) in filteredProjects"
        :key="project.id"
        class="project-card glass-card animate-fade-in-up"
        :class="`delay-${i * 100}`"
      >
        <div class="project-thumb" :style="{ background: project.gradient }">
          <span class="material-symbols-outlined thumb-icon">{{ project.icon }}</span>
          <div class="thumb-badge">
            <GfdBadge :variant="project.statusVariant">{{ project.status }}</GfdBadge>
          </div>
        </div>

        <div class="project-body">
          <div class="project-top">
            <h3 class="project-name">{{ project.name }}</h3>
            <span class="chip">{{ project.type }}</span>
          </div>
          <p class="project-desc">{{ project.desc }}</p>

          <div class="project-meta">
            <span class="meta-item">
              <span class="material-symbols-outlined" style="font-size:14px;">calendar_today</span>
              {{ project.deadline }}
            </span>
            <span class="meta-item">
              <span class="material-symbols-outlined" style="font-size:14px;">group</span>
              {{ project.team }} members
            </span>
          </div>

          <div class="progress-section">
            <div class="progress-header">
              <span class="progress-label">Progress</span>
              <span class="progress-pct">{{ project.progress }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-bar-fill" :style="{ width: project.progress + '%' }" />
            </div>
          </div>

          <div class="project-actions">
            <button class="btn-outline project-btn">
              <span class="material-symbols-outlined" style="font-size:16px;">open_in_new</span>
              View
            </button>
            <button class="btn-ghost project-btn">
              <span class="material-symbols-outlined" style="font-size:16px;">edit</span>
              Edit
            </button>
          </div>
        </div>
      </div>

      <!-- Add New Card -->
      <button class="project-add-card" @click="goToNewProject">
        <div class="add-icon-wrap">
          <span class="material-symbols-outlined add-icon">add_circle</span>
        </div>
        <p class="add-title">Post New Project</p>
        <p class="add-desc">Draft a new proposal to get more job invitations.</p>
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="filteredProjects.length === 0" class="empty-state glass-card-static">
      <span class="material-symbols-outlined" style="font-size:3rem;color:var(--on-surface-variant)">folder_open</span>
      <p class="text-headline-md" style="margin-top:1rem">No projects found</p>
      <p class="text-body-md" style="margin-top:0.5rem">Start by posting your first project.</p>
      <button class="btn-primary" style="margin-top:1rem" @click="goToNewProject">Post a Project</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import http from '@/services/http'
import GfdBadge from '@/components/ui/GfdBadge.vue'

const router = useRouter()
const authStore = useAuthStore()
const activeStatus = ref('all')

function goToNewProject() {
  router.push({ name: 'project-upload' })
}

const statusTabs = ref([
  { value: 'all',       label: 'All',        count: 0 },
  { value: 'active',    label: 'Active',     count: 0 },
  { value: 'review',    label: 'In Review',  count: 0 },
  { value: 'pending',   label: 'Pending',    count: 0 },
  { value: 'completed', label: 'Completed',  count: 0 },
])

const projects = ref([])

const filteredProjects = computed(() => {
  if (activeStatus.value === 'all') return projects.value
  return projects.value.filter(p => p.statusKey === activeStatus.value)
})

onMounted(async () => {
  const userId = authStore.user?.id
  if (!userId) return

  try {
    const data = await http.get('/projects/mine?limit=50')

    projects.value = (data.projects || []).map(j => ({
      id: j.id,
      name: j.title,
      desc: j.description?.slice(0, 100) || '',
      type: j.project_type || 'Web App',
      status: j.status === 'open' ? 'Active' : j.status === 'in_progress' ? 'In Review' : j.status === 'completed' ? 'Completed' : 'Pending',
      statusVariant: j.status === 'open' ? 'success' : j.status === 'in_progress' ? 'warning' : j.status === 'completed' ? 'success' : 'default',
      statusKey: j.status === 'open' ? 'active' : j.status === 'in_progress' ? 'review' : j.status === 'completed' ? 'completed' : 'pending',
      progress: j.status === 'completed' ? 100 : j.status === 'in_progress' ? 50 : j.status === 'open' ? 25 : 10,
      deadline: j.deadline ? new Date(j.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—',
      views: j.view_count || 0,
      likes: j.like_count || 0,
      team: 0,
      icon: 'work',
      gradient: 'linear-gradient(135deg,#630ed4,#7c3aed)',
    }))

    // Update tab counts
    statusTabs.value[0].count = projects.value.length
    statusTabs.value[1].count = projects.value.filter(p => p.statusKey === 'active').length
    statusTabs.value[2].count = projects.value.filter(p => p.statusKey === 'review').length
    statusTabs.value[3].count = projects.value.filter(p => p.statusKey === 'pending').length
    statusTabs.value[4].count = projects.value.filter(p => p.statusKey === 'completed').length
  } catch (err) {
    console.error('Failed to load projects:', err)
  }
})
</script>

<style scoped>
.dash-projects { display: flex; flex-direction: column; gap: 1.25rem; }

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-tabs {
  display: flex;
  gap: 0.25rem;
  border-bottom: 1px solid var(--outline-variant);
  overflow-x: auto;
  scrollbar-width: none;
}
.filter-tabs::-webkit-scrollbar { display: none; }

.filter-tab {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.625rem 1rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--on-surface-variant);
  cursor: pointer;
  transition: var(--transition-fast);
  white-space: nowrap;
  margin-bottom: -1px;
}
.filter-tab:hover { color: var(--primary); }
.filter-tab.active { color: var(--primary); border-bottom-color: var(--primary); }

.tab-count {
  min-width: 18px;
  height: 18px;
  border-radius: var(--radius-full);
  background: var(--surface-container);
  color: var(--on-surface-variant);
  font-size: 0.65rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.project-card { padding: 0; overflow: hidden; }

.project-thumb {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.thumb-icon { font-size: 3rem; color: rgba(255,255,255,0.85); }

.thumb-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
}

.project-body { padding: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; }

.project-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
}

.project-name {
  font-family: var(--font-headline);
  font-size: 1rem;
  font-weight: 700;
  color: var(--on-surface);
}

.project-desc {
  font-size: 0.8rem;
  color: var(--on-surface-variant);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-meta { display: flex; gap: 1rem; flex-wrap: wrap; }

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--on-surface-variant);
  font-family: var(--font-headline);
}

.progress-section { display: flex; flex-direction: column; gap: 0.35rem; }

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-label { font-size: 0.75rem; color: var(--on-surface-variant); font-family: var(--font-headline); }
.progress-pct   { font-size: 0.75rem; font-weight: 700; color: var(--primary); font-family: var(--font-headline); }

.project-actions { display: flex; gap: 0.5rem; }

.project-btn {
  flex: 1;
  justify-content: center;
  font-size: 0.8rem;
  padding: 0.4rem 0.75rem;
}

/* Add Card */
.project-add-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  min-height: 240px;
  border: 2px dashed var(--outline-variant);
  border-radius: var(--radius-xl);
  background: transparent;
  cursor: pointer;
  transition: var(--transition-fast);
  padding: 1.5rem;
  text-align: center;
}
.project-add-card:hover { border-color: var(--primary); background: var(--surface-container-low); }

.add-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  background: var(--surface-container-high);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-fast);
}
.project-add-card:hover .add-icon-wrap { background: rgba(99,14,212,0.1); }

.add-icon { font-size: 24px; color: var(--primary); }

.add-title { font-family: var(--font-headline); font-size: 0.875rem; font-weight: 600; color: var(--on-surface); }
.add-desc  { font-size: 0.8rem; color: var(--on-surface-variant); }

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3rem 2rem;
  border-radius: var(--radius-xl);
}
</style>
