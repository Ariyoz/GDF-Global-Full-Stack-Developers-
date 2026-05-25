<template>
  <div class="projects-view">
    <!-- Hero -->
    <section class="page-hero section-gfd">
      <div class="container-gfd hero-inner">
        <div class="hero-tag animate-fade-in-up">Our Work</div>
        <h1 class="text-headline-xl animate-fade-in-up delay-100">
          Projects We're <span class="text-gradient">Proud Of</span>
        </h1>
        <p class="text-body-lg animate-fade-in-up delay-200" style="max-width:520px;text-align:center;">
          A showcase of digital products, platforms, and experiences built for clients worldwide.
        </p>
      </div>
    </section>

    <!-- Projects -->
    <section class="section-gfd">
      <div class="container-gfd">
        <!-- Filters -->
        <div class="filter-row animate-fade-in-up">
          <button
            v-for="cat in PROJECT_CATEGORIES"
            :key="cat"
            class="filter-chip"
            :class="{ active: activeFilter === cat }"
            @click="activeFilter = cat"
          >
            {{ cat }}
          </button>
        </div>

        <!-- Grid -->
        <div class="projects-grid">
          <div
            v-for="(project, i) in filteredProjects"
            :key="project.id || project.title"
            class="project-card glass-card animate-fade-in-up"
            :class="`delay-${(i % 3) * 100}`"
            @click="viewProject(project)"
          >
            <div class="project-thumb" :style="{ background: project.gradient }">
              <img v-if="project.cover_image" :src="project.cover_image" alt="" class="project-thumb-img" />
              <span v-else class="material-symbols-outlined thumb-icon">{{ project.icon }}</span>
              <div class="thumb-overlay">
                <span class="thumb-badge">{{ project.category }}</span>
              </div>
            </div>
            <div class="project-body">
              <div class="project-meta">
                <span class="project-year">{{ project.year }}</span>
              </div>
              <h3 class="project-title">{{ project.title }}</h3>
              <p class="project-desc">{{ project.desc }}</p>
              <div class="project-tags">
                <span v-for="tag in project.tags.slice(0, 4)" :key="tag" class="chip">{{ tag }}</span>
              </div>
              <div class="project-footer">
                <div class="project-author">
                  <div class="author-avatar">{{ project.author[0] }}</div>
                  <span class="author-name">{{ project.author }}</span>
                </div>
                <div class="project-stats">
                  <span class="pstat">
                    <span class="material-symbols-outlined" style="font-size:14px;">visibility</span>
                    {{ project.views }}
                  </span>
                  <button class="pstat like-btn" :class="{ liked: project.is_liked }" @click="likeProject(project)">
                    <span class="material-symbols-outlined" style="font-size:14px;" :style="project.is_liked ? 'font-variation-settings:\'FILL\' 1' : ''">favorite</span>
                    {{ project.likes }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredProjects.length === 0" class="empty-state glass-card-static">
          <span class="material-symbols-outlined" style="font-size:3rem;color:var(--on-surface-variant)">search_off</span>
          <p class="text-headline-md" style="margin-top:1rem">No projects found</p>
          <button class="btn-primary" style="margin-top:1rem" @click="activeFilter = 'All'">Clear Filter</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { PROJECT_CATEGORIES } from '@/constants'
import http from '@/services/http'
import { useUiStore } from '@/store/ui'

const uiStore = useUiStore()
const activeFilter = ref('All')

const projects = ref([])

const categoryIcons = {
  webapp: 'web', mobile: 'smartphone', api: 'api',
  uiux: 'design_services', saas: 'cloud', opensource: 'code',
  full_time: 'work', part_time: 'schedule', contract: 'handshake',
  freelance: 'person', internship: 'school',
}

const categoryGradients = [
  'linear-gradient(135deg, #1a0840 0%, #2a1060 100%)',
  'linear-gradient(135deg, #0d1b2a 0%, #1b2838 100%)',
  'linear-gradient(135deg, #1a1040 0%, #0d0520 100%)',
  'linear-gradient(135deg, #0a2540 0%, #1a3a5c 100%)',
  'linear-gradient(135deg, #2d1b4e 0%, #1a0840 100%)',
]

onMounted(async () => {
  try {
    const data = await http.get('/projects?limit=50')
    projects.value = (data.projects || []).map((p, i) => ({
      id: p.id,
      title: p.title,
      desc: p.description || '',
      category: p.project_type || 'contract',
      tags: p.skills_needed || [],
      budget: p.budget_min ? `$${p.budget_min}${p.budget_max ? ' - $' + p.budget_max : ''}` : 'Negotiable',
      status: p.status,
      duration: p.duration,
      views: p.view_count || 0,
      likes: p.like_count || 0,
      is_liked: false,
      cover_image: p.cover_image || '',
      author: 'Developer',
      year: p.created_at ? new Date(p.created_at).getFullYear() : new Date().getFullYear(),
      icon: categoryIcons[p.project_type] || 'code',
      gradient: categoryGradients[i % categoryGradients.length],
      created_at: p.created_at,
    }))
  } catch { /* leave empty */ }
})

async function likeProject(project) {
  try {
    await http.post(`/projects/${project.id}/like`)
    project.likes = (project.likes || 0) + 1
    project.is_liked = true
    uiStore.showSuccess('Project liked!')
  } catch { /* ignore */ }
}

async function viewProject(project) {
  try {
    await http.post(`/projects/${project.id}/view`)
    project.views = (project.views || 0) + 1
  } catch { /* ignore */ }
}

const filteredProjects = computed(() => {
  if (activeFilter.value === 'All') return projects.value
  return projects.value.filter(p => p.category === activeFilter.value)
})
</script>

<style scoped>
.projects-view { background: var(--background); }

.page-hero { padding-top: 5rem; }

.hero-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}

.hero-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.875rem;
  background: rgba(99,14,212,0.05);
  border: 1px solid rgba(99,14,212,0.1);
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--primary);
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.filter-chip {
  padding: 0.4rem 1rem;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--on-surface-variant);
  cursor: pointer;
  transition: var(--transition-fast);
}

.filter-chip.active,
.filter-chip:hover {
  background: rgba(99,14,212,0.08);
  border-color: rgba(99,14,212,0.3);
  color: var(--primary);
}

.projects-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
}

@media (min-width: 640px) {
  .projects-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) {
  .projects-grid { grid-template-columns: repeat(3, 1fr); }
}

.project-card { padding: 0; overflow: hidden; }

.project-thumb {
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.thumb-icon { font-size: 3.5rem; color: rgba(255,255,255,0.8); }

.project-thumb-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-overlay {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
}

.thumb-badge {
  padding: 0.2rem 0.625rem;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.7rem;
  font-weight: 700;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.project-body { padding: 1.25rem; display: flex; flex-direction: column; gap: 0.625rem; }

.project-meta { display: flex; align-items: center; justify-content: flex-end; }

.project-year {
  font-family: var(--font-headline);
  font-size: 0.75rem;
  color: var(--on-surface-variant);
}

.project-title {
  font-family: var(--font-headline);
  font-size: 1rem;
  font-weight: 700;
  color: var(--on-surface);
}

.project-desc {
  font-size: 0.875rem;
  color: var(--on-surface-variant);
  line-height: 1.5;
}

.project-tags { display: flex; flex-wrap: wrap; gap: var(--space-xs); }

.project-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.625rem;
  border-top: 1px solid rgba(204,195,216,0.3);
}

.project-author { display: flex; align-items: center; gap: 0.5rem; }

.author-avatar {
  width: 24px;
  height: 24px;
  border-radius: var(--radius-full);
  background: var(--primary-fixed);
  color: var(--primary);
  font-family: var(--font-headline);
  font-size: 0.65rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.author-name { font-size: 0.75rem; color: var(--on-surface-variant); font-family: var(--font-headline); }

.project-stats { display: flex; gap: 0.75rem; }

.pstat {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.75rem;
  color: var(--on-surface-variant);
}

.like-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.2rem 0.4rem;
  border-radius: var(--radius-full);
  transition: all 0.15s ease;
}

.like-btn:hover {
  background: rgba(233, 30, 99, 0.08);
  color: #e91e63;
}

.like-btn.liked {
  color: #e91e63;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3rem 2rem;
  border-radius: var(--radius-xl);
}
</style>
