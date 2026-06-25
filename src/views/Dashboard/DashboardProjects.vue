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
          <img v-if="project.cover_image" :src="project.cover_image" class="thumb-cover-img" />
          <span v-else class="material-symbols-outlined thumb-icon">{{ project.icon }}</span>
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

          <!-- Pending review notice -->
          <div v-if="project.statusKey === 'pending_review'" class="review-notice">
            <span class="material-symbols-outlined" style="font-size:14px;color:#f59e0b">schedule</span>
            Awaiting admin review — will go live once approved
          </div>

          <div class="project-meta">
            <span class="meta-item">
              <span class="material-symbols-outlined" style="font-size:14px;">visibility</span>
              {{ project.views }} views
            </span>
            <button class="meta-like-btn" :class="{ liked: project.liked }" @click.stop="toggleLike(project)">
              <span class="material-symbols-outlined" style="font-size:14px;">{{ project.liked ? 'favorite' : 'favorite_border' }}</span>
              {{ project.likes }}
            </button>
          </div>

          <div class="project-actions">
            <a v-if="project.live_url" :href="project.live_url" target="_blank" rel="noopener"
              class="btn-outline project-btn">
              <span class="material-symbols-outlined" style="font-size:16px;">rocket_launch</span>
              Live Demo
            </a>
            <a v-if="project.repo_url" :href="project.repo_url" target="_blank" rel="noopener"
              class="btn-outline project-btn">
              <span class="material-symbols-outlined" style="font-size:16px;">code</span>
              Repo
            </a>
            <button v-if="!project.live_url && !project.repo_url" class="btn-outline project-btn" disabled>
              <span class="material-symbols-outlined" style="font-size:16px;">link_off</span>
              No Link
            </button>
            <button class="btn-ghost project-btn" @click="deleteProject(project)">
              <span class="material-symbols-outlined" style="font-size:16px;">delete</span>
              Delete
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
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useUiStore } from '@/store/ui'
import http from '@/services/http'
import GfdBadge from '@/components/ui/GfdBadge.vue'

const router    = useRouter()
const route     = useRoute()
const authStore = useAuthStore()
const uiStore   = useUiStore()
const activeStatus = ref(route.query.tab || 'all')

function goToNewProject() { router.push({ name: 'project-upload' }) }

const statusTabs = ref([
  { value: 'all',            label: 'All',          count: 0 },
  { value: 'active',         label: 'Active',       count: 0 },
  { value: 'pending_review', label: 'In Review',    count: 0 },
  { value: 'completed',      label: 'Completed',    count: 0 },
])

const projects = ref([])

const filteredProjects = computed(() => {
  if (activeStatus.value === 'all') return projects.value
  return projects.value.filter(p => p.statusKey === activeStatus.value)
})

function mapProject(j, i) {
  // Normalize status — backend may return DRAFT or draft
  const st = (j.status || 'draft').toLowerCase()
  const statusMap = {
    open:           { label: 'Active',     variant: 'success', key: 'active' },
    in_progress:    { label: 'In Progress',variant: 'warning', key: 'active' },
    pending_review: { label: 'In Review',  variant: 'warning', key: 'pending_review' },
    draft:          { label: 'In Review',  variant: 'warning', key: 'pending_review' },
    completed:      { label: 'Completed',  variant: 'success', key: 'completed' },
    closed:         { label: 'Closed',     variant: 'default', key: 'completed' },
    cancelled:      { label: 'Declined',   variant: 'error',   key: 'completed' },
  }
  const s = statusMap[st] || { label: st, variant: 'default', key: st }
  return {
    id:           j.id,
    name:         j.title || '',
    desc:         (j.description || '').slice(0, 120),
    type:         j.project_type || 'contract',
    status:       s.label,
    statusVariant:s.variant,
    statusKey:    s.key,
    views:        j.view_count || 0,
    likes:        j.like_count || 0,
    liked:        false,
    cover_image:  j.cover_image || '',
    live_url:     j.live_url || '',
    repo_url:     j.repository_url || j.github_url || '',
    icon:         'work',
    gradient:     'linear-gradient(135deg,#630ed4,#7c3aed)',
  }
}

async function toggleLike(project) {
  try {
    const res = await http.post(`/projects/${project.id}/like`)
    project.liked = res.liked
    project.likes = project.liked ? project.likes + 1 : Math.max(0, project.likes - 1)
  } catch (e) {
    uiStore.showError('Could not update like')
  }
}

async function loadProjects() {
  try {
    const data = await http.get('/projects/mine?limit=50')
    projects.value = (data.projects || []).map(mapProject)
    statusTabs.value[0].count = projects.value.length
    statusTabs.value[1].count = projects.value.filter(p => p.statusKey === 'active').length
    statusTabs.value[2].count = projects.value.filter(p => p.statusKey === 'pending_review').length
    statusTabs.value[3].count = projects.value.filter(p => p.statusKey === 'completed').length
  } catch (err) {
    console.error('Failed to load projects:', err)
  }
}

async function deleteProject(project) {
  if (!confirm(`Delete "${project.name}"? This cannot be undone.`)) return
  try {
    await http.request({ method: 'DELETE', url: `/projects/${project.id}` })
    uiStore.showSuccess('Project deleted')
    projects.value = projects.value.filter(p => p.id !== project.id)
  } catch (e) {
    uiStore.showError(e?.response?.data?.detail || 'Failed to delete project')
  }
}

onMounted(loadProjects)
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
  overflow: hidden;
}

.thumb-icon { font-size: 3rem; color: rgba(255,255,255,0.85); }
.thumb-cover-img { position:absolute;inset:0;width:100%;height:100%;object-fit:cover; }

.review-notice {
  display: flex; align-items: center; gap: .4rem;
  font-size: .78rem; color: #f59e0b;
  background: rgba(245,158,11,.08);
  border: 1px solid rgba(245,158,11,.2);
  border-radius: 8px; padding: .4rem .75rem;
  margin-bottom: .5rem;
}

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

.project-meta { display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; }

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--on-surface-variant);
  font-family: var(--font-headline);
}

.meta-like-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-family: var(--font-headline);
  font-weight: 600;
  color: var(--on-surface-variant);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.15rem 0.4rem;
  border-radius: var(--radius-full);
  transition: color 0.15s, background 0.15s;
}
.meta-like-btn:hover { color: #ef4444; background: rgba(239,68,68,0.08); }
.meta-like-btn.liked { color: #ef4444; }

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
