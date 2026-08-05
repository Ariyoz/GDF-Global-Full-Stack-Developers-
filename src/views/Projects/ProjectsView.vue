<template>
  <div class="projects-view">
    <!-- ── HERO SECTION ── -->
    <section class="hero-section">
      <!-- Background ambient orbs -->
      <div class="hero-orb hero-orb-1"></div>
      <div class="hero-orb hero-orb-2"></div>
      <div class="hero-orb hero-orb-3"></div>
      <div class="hero-grid-pattern"></div>

      <div class="container-gfd hero-content">
        <!-- Badge pill -->
        <div class="hero-badge animate-fade-in-up">
          <span class="material-symbols-outlined">rocket_launch</span>
          Projects
        </div>

        <!-- Headline -->
        <h1 class="hero-headline animate-fade-in-up delay-100">
          Showcasing<br />
          <span class="text-gradient">World-Class Work</span>
        </h1>

        <!-- Subtext -->
        <p class="hero-sub animate-fade-in-up delay-200">
          A curated collection of digital products, platforms, and experiences
          built by the GFD community.
        </p>

        <!-- Stats row -->
        <div class="hero-stats animate-fade-in-up delay-300">
          <div class="hero-stat">
            <span class="hero-stat-value">{{ projects.length }}</span>
            <span class="hero-stat-label">Projects</span>
          </div>
          <div class="hero-stat-divider"></div>
          <div class="hero-stat">
            <span class="hero-stat-value">{{ totalLikes }}</span>
            <span class="hero-stat-label">Total Likes</span>
          </div>
        </div>

        <!-- CTA -->
        <RouterLink to="/projects/upload" class="btn-primary animate-fade-in-up delay-400">
          <span class="material-symbols-outlined">add</span>
          Upload Project
        </RouterLink>
      </div>
    </section>

    <!-- ── STICKY FILTER / SEARCH BAR ── -->
    <div class="filter-bar-sticky" :class="{ scrolled: isScrolled }">
      <div class="container-gfd filter-bar-inner">
        <!-- Filter chips -->
        <div class="filter-chips-wrapper">
          <div class="filter-chips">
            <button
              v-for="cat in PROJECT_CATEGORIES"
              :key="cat"
              class="filter-chip"
              :class="{ active: activeFilter === cat }"
              @click="activeFilter = cat"
            >
              <span v-if="catIcons[cat]" class="material-symbols-outlined">{{ catIcons[cat] }}</span>
              {{ cat }}
            </button>
          </div>
        </div>

        <!-- Right controls -->
        <div class="filter-right">
          <!-- Search input -->
          <div class="search-wrap">
            <span class="material-symbols-outlined search-icon">search</span>
            <input
              v-model="searchQuery"
              type="text"
              class="search-input"
              placeholder="Search projects..."
              aria-label="Search projects"
            />
            <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''" aria-label="Clear search">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- View toggle -->
          <div class="view-toggle">
            <button
              class="view-btn"
              :class="{ active: viewMode === 'grid' }"
              @click="viewMode = 'grid'"
              aria-label="Grid view"
              title="Grid view"
            >
              <span class="material-symbols-outlined">grid_view</span>
            </button>
            <button
              class="view-btn"
              :class="{ active: viewMode === 'list' }"
              @click="viewMode = 'list'"
              aria-label="List view"
              title="List view"
            >
              <span class="material-symbols-outlined">view_list</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Results count -->
      <div class="container-gfd results-row">
        <span class="results-text">
          Showing <strong>{{ filteredProjects.length }}</strong>
          {{ filteredProjects.length === 1 ? 'project' : 'projects' }}
          <template v-if="searchQuery"> for "<em>{{ searchQuery }}</em>"</template>
        </span>
      </div>
    </div>

    <!-- ── PROJECTS SECTION ── -->
    <section class="section-gfd projects-section">
      <div class="container-gfd">

        <!-- SKELETON LOADING -->
        <div v-if="loading" :class="['projects-grid', viewMode === 'list' ? 'list-mode' : '']">
          <div v-for="n in 6" :key="n" class="skeleton-card">
            <div class="skeleton skeleton-thumb"></div>
            <div class="skeleton-body">
              <div class="skeleton skeleton-line w-20"></div>
              <div class="skeleton skeleton-line w-60"></div>
              <div class="skeleton skeleton-line w-40"></div>
              <div class="skeleton-footer-row">
                <div class="skeleton skeleton-avatar"></div>
                <div class="skeleton skeleton-line w-30" style="height:10px"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- PROJECTS GRID / LIST -->
        <Transition name="fade" mode="out-in" v-else>
          <div :key="activeFilter + searchQuery + viewMode">
            <!-- Grid view -->
            <div v-if="viewMode === 'grid'" class="projects-grid">
              <div
                v-for="(project, i) in filteredProjects"
                :key="project.id || project.title"
                class="project-card glass-card animate-fade-in-up hover-lift"
                :class="`delay-${Math.min(i % 4, 3) * 100}`"
                @click="viewProject(project)"
                role="article"
              >
                <!-- Thumbnail -->
                <div class="project-thumb" :style="!project.cover_image ? { background: project.gradient } : {}">
                  <img
                    v-if="project.cover_image"
                    :src="project.cover_image"
                    :alt="project.title"
                    class="thumb-img"
                  />
                  <span v-else class="material-symbols-outlined thumb-cat-icon">{{ project.icon }}</span>

                  <!-- Hover overlay -->
                  <div class="thumb-hover-overlay">
                    <span class="view-project-btn">
                      <span class="material-symbols-outlined">open_in_new</span>
                      View Project
                    </span>
                  </div>

                  <!-- Top badges -->
                  <div class="thumb-badges">
                    <span class="cat-badge">
                      <span class="material-symbols-outlined" style="font-size:11px">{{ project.icon }}</span>
                      {{ project.category }}
                    </span>
                  </div>
                  <div class="thumb-status">
                    <span class="status-badge" :class="statusClass(project.status)">{{ formatStatus(project.status) }}</span>
                  </div>
                </div>

                <!-- Card body -->
                <div class="card-body">
                  <h3 class="card-title">{{ project.title }}</h3>
                  <p class="card-desc">{{ project.desc }}</p>

                  <!-- Tags -->
                  <div class="card-tags">
                    <span v-for="tag in project.tags.slice(0, 3)" :key="tag" class="chip chip-primary">{{ tag }}</span>
                    <span v-if="project.tags.length > 3" class="chip">+{{ project.tags.length - 3 }}</span>
                  </div>

                  <!-- Footer -->
                  <div class="card-footer">
                    <!-- Author -->
                    <div
                      class="author-row"
                      @click.stop="goToAuthorProfile(project, $event)"
                      :title="`View ${project.author}'s profile`"
                    >
                      <div class="author-avatar">
                        <img v-if="project.author_avatar" :src="project.author_avatar" :alt="project.author" />
                        <span v-else>{{ (project.author || 'U')[0].toUpperCase() }}</span>
                      </div>
                      <div class="author-info">
                        <span class="author-name">{{ project.author }}</span>
                        <span v-if="project.author_username" class="author-handle">@{{ project.author_username }}</span>
                      </div>
                    </div>

                    <!-- Actions -->
                    <div class="card-actions">
                      <a
                        v-if="project.live_url"
                        :href="project.live_url"
                        target="_blank"
                        rel="noopener"
                        class="action-btn action-link"
                        title="View live demo"
                        @click.stop
                      >
                        <span class="material-symbols-outlined">rocket_launch</span>
                      </a>
                      <a
                        v-if="project.repo_url"
                        :href="project.repo_url"
                        target="_blank"
                        rel="noopener"
                        class="action-btn action-link"
                        title="View source code"
                        @click.stop
                      >
                        <span class="material-symbols-outlined">code</span>
                      </a>
                      <span class="action-stat">
                        <span class="material-symbols-outlined">visibility</span>
                        {{ project.views }}
                      </span>
                      <button
                        class="action-btn like-btn"
                        :class="{ liked: project.is_liked }"
                        @click.stop="likeProject(project)"
                        :title="project.is_liked ? 'Unlike' : 'Like'"
                      >
                        <span
                          class="material-symbols-outlined"
                          :style="project.is_liked ? 'font-variation-settings:\'FILL\' 1' : ''"
                        >favorite</span>
                        {{ project.likes }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- List view -->
            <div v-else class="projects-list">
              <div
                v-for="(project, i) in filteredProjects"
                :key="project.id || project.title"
                class="list-card glass-card animate-fade-in-up"
                :class="`delay-${Math.min(i % 4, 3) * 100}`"
                @click="viewProject(project)"
                role="article"
              >
                <!-- Thumbnail -->
                <div class="list-thumb" :style="!project.cover_image ? { background: project.gradient } : {}">
                  <img v-if="project.cover_image" :src="project.cover_image" :alt="project.title" class="thumb-img" />
                  <span v-else class="material-symbols-outlined thumb-cat-icon" style="font-size:2rem">{{ project.icon }}</span>
                </div>

                <!-- Content -->
                <div class="list-content">
                  <div class="list-top">
                    <div class="list-title-row">
                      <h3 class="card-title">{{ project.title }}</h3>
                      <div class="list-badges">
                        <span class="cat-badge">{{ project.category }}</span>
                        <span class="status-badge" :class="statusClass(project.status)">{{ formatStatus(project.status) }}</span>
                      </div>
                    </div>
                    <p class="card-desc list-desc">{{ project.desc }}</p>
                  </div>

                  <div class="list-bottom">
                    <div class="card-tags">
                      <span v-for="tag in project.tags.slice(0, 3)" :key="tag" class="chip chip-primary">{{ tag }}</span>
                      <span v-if="project.tags.length > 3" class="chip">+{{ project.tags.length - 3 }}</span>
                    </div>
                    <div class="card-footer" style="padding-top:0;border-top:none">
                      <div class="author-row" @click.stop="goToAuthorProfile(project, $event)">
                        <div class="author-avatar">
                          <img v-if="project.author_avatar" :src="project.author_avatar" :alt="project.author" />
                          <span v-else>{{ (project.author || 'U')[0].toUpperCase() }}</span>
                        </div>
                        <span class="author-name">{{ project.author }}</span>
                      </div>
                      <div class="card-actions">
                        <a v-if="project.live_url" :href="project.live_url" target="_blank" rel="noopener" class="action-btn action-link" title="Live demo" @click.stop>
                          <span class="material-symbols-outlined">rocket_launch</span>
                        </a>
                        <a v-if="project.repo_url" :href="project.repo_url" target="_blank" rel="noopener" class="action-btn action-link" title="Source code" @click.stop>
                          <span class="material-symbols-outlined">code</span>
                        </a>
                        <span class="action-stat">
                          <span class="material-symbols-outlined">visibility</span>{{ project.views }}
                        </span>
                        <button class="action-btn like-btn" :class="{ liked: project.is_liked }" @click.stop="likeProject(project)">
                          <span class="material-symbols-outlined" :style="project.is_liked ? 'font-variation-settings:\'FILL\' 1' : ''">favorite</span>
                          {{ project.likes }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>

        <!-- EMPTY STATE -->
        <div v-if="!loading && filteredProjects.length === 0" class="empty-state glass-card-static animate-fade-in-up">
          <span class="material-symbols-outlined empty-icon">search_off</span>
          <h3 class="empty-title">
            <template v-if="searchQuery">No results for "{{ searchQuery }}"</template>
            <template v-else>No projects found</template>
          </h3>
          <p class="empty-desc">
            <template v-if="searchQuery">Try different keywords or clear your search.</template>
            <template v-else>No projects match the selected filter yet.</template>
          </p>
          <div class="empty-actions">
            <button class="btn-primary" @click="searchQuery = ''; activeFilter = 'All'">
              <span class="material-symbols-outlined">refresh</span>
              Clear Filter
            </button>
          </div>
        </div>

      </div>
    </section>

    <!-- ── CTA STRIP ── -->
    <section class="cta-strip">
      <div class="cta-orb cta-orb-1"></div>
      <div class="cta-orb cta-orb-2"></div>
      <div class="container-gfd cta-inner">
        <div class="cta-text">
          <h2 class="cta-headline">Have a project to showcase?</h2>
          <p class="cta-sub">Share your work with the GFD community and get noticed by top companies.</p>
        </div>
        <div class="cta-actions">
          <RouterLink to="/projects/upload" class="btn-primary">
            <span class="material-symbols-outlined">upload</span>
            Upload Your Project
          </RouterLink>
          <RouterLink to="/jobs" class="btn-outline">
            <span class="material-symbols-outlined">work</span>
            Browse Jobs
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useSeo, pageSeo } from '@/composables/useSeo'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { PROJECT_CATEGORIES } from '@/constants'
import http from '@/services/http'
import { useUiStore } from '@/store/ui'
import { useCurrencyStore } from '@/store/currency'

const currencyStore = useCurrencyStore()
useSeo(pageSeo.projects)
const uiStore = useUiStore()
const router = useRouter()
const activeFilter = ref('All')
const projects = ref([])

// New UI state
const loading = ref(true)
const searchQuery = ref('')
const viewMode = ref('grid')
const isScrolled = ref(false)

// Category icons for filter bar
const catIcons = {
  'All': 'apps',
  'Web App': 'web',
  'Mobile App': 'smartphone',
  'UI/UX Design': 'design_services',
  'API': 'api',
  'E-Commerce': 'shopping_bag',
  'SaaS': 'cloud',
}

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

function handleScroll() {
  isScrolled.value = window.scrollY > 300
}

onMounted(async () => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  try {
    const data = await http.get('/projects?limit=50')
    const seen = new Set()
    projects.value = (data.projects || [])
      .filter(p => { if (seen.has(p.id)) return false; seen.add(p.id); return true })
      .map((p, i) => ({
        id: p.id,
        title: p.title,
        desc: p.description || '',
        category: p.project_type || 'contract',
        tags: p.skills_needed || [],
        budget: p.budget_min
          ? `${currencyStore.format(p.budget_min)}${p.budget_max ? ' – ' + currencyStore.format(p.budget_max) : ''}`
          : 'Negotiable',
        status: p.status,
        duration: p.duration,
        views: p.view_count || 0,
        likes: p.like_count || 0,
        is_liked: false,
        cover_image: p.cover_image || '',
        author: p.author_name || 'Member',
        author_username: p.author_username || '',
        author_avatar: p.author_avatar || null,
        author_id: p.author_id || null,
        repo_url: p.repository_url || p.github_url || p.repo_url || null,
        live_url: p.live_url || null,
        year: p.created_at ? new Date(p.created_at).getFullYear() : new Date().getFullYear(),
        icon: categoryIcons[p.project_type] || 'code',
        gradient: categoryGradients[i % categoryGradients.length],
        created_at: p.created_at,
      }))
  } catch { /* leave empty */ }
  finally {
    loading.value = false
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

async function likeProject(project) {
  try {
    const res = await http.post(`/projects/${project.id}/like`)
    if (res.liked) { project.likes = (project.likes || 0) + 1; project.is_liked = true }
    else { project.likes = Math.max((project.likes || 1) - 1, 0); project.is_liked = false }
  } catch { /* ignore */ }
}

function goToAuthorProfile(project, e) {
  e.stopPropagation()
  if (project.author_id) router.push(`/developer/${project.author_id}`)
}

async function viewProject(project) {
  http.post(`/projects/${project.id}/view`).catch(() => {})
  project.views = (project.views || 0) + 1
}

const filteredProjects = computed(() => {
  let list = projects.value
  if (activeFilter.value !== 'All') {
    list = list.filter(p => p.category === activeFilter.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q) ||
      (p.tags || []).some(t => t.toLowerCase().includes(q))
    )
  }
  return list
})

const totalLikes = computed(() => projects.value.reduce((sum, p) => sum + (p.likes || 0), 0))

function statusClass(status) {
  if (!status) return 'status-open'
  const s = status.toLowerCase()
  if (s === 'open') return 'status-open'
  if (s === 'closed' || s === 'completed') return 'status-closed'
  if (s === 'in_progress' || s === 'in-progress') return 'status-progress'
  return 'status-open'
}

function formatStatus(status) {
  if (!status) return 'Open'
  const map = { open: 'Open', closed: 'Closed', completed: 'Done', in_progress: 'In Progress', 'in-progress': 'In Progress' }
  return map[status.toLowerCase()] || status
}
</script>

<style scoped>
/* ══════════════════════════════════════
   PROJECTS VIEW — Scoped Styles
   ══════════════════════════════════════ */
.projects-view {
  background: var(--background);
  min-height: 100vh;
}

/* ── HERO ── */
.hero-section {
  position: relative;
  overflow: hidden;
  padding: clamp(5rem, 10vw, 8rem) 0 clamp(3rem, 6vw, 5rem);
  background: var(--background);
}

.hero-orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(100px);
}

.hero-orb-1 {
  width: 600px;
  height: 600px;
  top: -200px;
  left: -100px;
  background: radial-gradient(circle, rgba(99,14,212,0.12) 0%, transparent 70%);
}

.hero-orb-2 {
  width: 500px;
  height: 500px;
  top: -100px;
  right: -150px;
  background: radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%);
}

.hero-orb-3 {
  width: 400px;
  height: 400px;
  bottom: -100px;
  left: 50%;
  transform: translateX(-50%);
  background: radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%);
}

.hero-grid-pattern {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(99,14,212,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99,14,212,0.04) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
}

[data-theme="dark"] .hero-grid-pattern {
  background-image:
    linear-gradient(rgba(168,85,247,0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(168,85,247,0.06) 1px, transparent 1px);
}

.hero-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 1rem 0.4rem 0.75rem;
  background: rgba(99,14,212,0.08);
  border: 1px solid rgba(99,14,212,0.2);
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--primary);
  letter-spacing: 0.03em;
}

.hero-badge .material-symbols-outlined {
  font-size: 16px;
}

[data-theme="dark"] .hero-badge {
  background: rgba(168,85,247,0.12);
  border-color: rgba(168,85,247,0.25);
}

.hero-headline {
  font-family: var(--font-headline);
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 800;
  line-height: 1.1;
  color: var(--on-surface);
  margin: 0;
  letter-spacing: -0.02em;
}

.hero-sub {
  font-family: var(--font-body);
  font-size: clamp(1rem, 2vw, 1.125rem);
  color: var(--on-surface-variant);
  max-width: 520px;
  line-height: 1.7;
  margin: 0;
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 1rem 2rem;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-xl);
}

.hero-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
}

.hero-stat-value {
  font-family: var(--font-headline);
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--primary);
  line-height: 1;
}

.hero-stat-label {
  font-size: 0.75rem;
  color: var(--on-surface-variant);
  font-family: var(--font-headline);
  font-weight: 500;
}

.hero-stat-divider {
  width: 1px;
  height: 40px;
  background: var(--outline-variant);
}

/* ── FILTER BAR ── */
.filter-bar-sticky {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--background);
  border-bottom: 1px solid var(--outline-variant);
  padding: 0.75rem 0 0;
  transition: background 0.25s ease, box-shadow 0.25s ease;
}

.filter-bar-sticky.scrolled {
  background: color-mix(in srgb, var(--background) 88%, transparent);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: var(--shadow-sm);
}

.filter-bar-inner {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: nowrap;
}

.filter-chips-wrapper {
  flex: 1;
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: none;
}

.filter-chips-wrapper::-webkit-scrollbar { display: none; }

.filter-chips {
  display: flex;
  gap: 0.375rem;
  padding-bottom: 0.75rem;
  white-space: nowrap;
  min-width: max-content;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 0.875rem;
  background: transparent;
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--on-surface-variant);
  cursor: pointer;
  transition: var(--transition-fast);
  white-space: nowrap;
}

.filter-chip .material-symbols-outlined {
  font-size: 14px;
}

.filter-chip:hover {
  background: rgba(99,14,212,0.06);
  border-color: rgba(99,14,212,0.25);
  color: var(--primary);
}

.filter-chip.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(99,14,212,0.25);
}

[data-theme="dark"] .filter-chip.active {
  box-shadow: 0 4px 12px rgba(168,85,247,0.3);
}

.filter-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
  padding-bottom: 0.75rem;
}

/* Search */
.search-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 0.625rem;
  font-size: 18px;
  color: var(--on-surface-variant);
  pointer-events: none;
}

.search-input {
  width: 200px;
  padding: 0.45rem 2rem 0.45rem 2.25rem;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-full);
  font-family: var(--font-body);
  font-size: 0.8rem;
  color: var(--on-surface);
  outline: none;
  transition: var(--transition-fast);
}

.search-input::placeholder { color: var(--on-surface-variant); }

.search-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99,14,212,0.1);
  width: 240px;
}

.search-clear {
  position: absolute;
  right: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--on-surface-variant);
  display: flex;
  align-items: center;
  padding: 0;
  border-radius: 50%;
  transition: color 0.15s;
}

.search-clear .material-symbols-outlined { font-size: 16px; }
.search-clear:hover { color: var(--on-surface); }

/* View toggle */
.view-toggle {
  display: flex;
  gap: 2px;
  background: var(--surface-container);
  border-radius: var(--radius-lg);
  padding: 2px;
}

.view-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  color: var(--on-surface-variant);
  cursor: pointer;
  transition: var(--transition-fast);
}

.view-btn .material-symbols-outlined { font-size: 18px; }

.view-btn:hover { color: var(--on-surface); }

.view-btn.active {
  background: var(--surface-container-lowest);
  color: var(--primary);
  box-shadow: var(--shadow-sm);
}

/* Results row */
.results-row {
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
}

.results-text {
  font-size: 0.78rem;
  color: var(--on-surface-variant);
  font-family: var(--font-body);
}

.results-text strong { color: var(--on-surface); font-weight: 600; }
.results-text em { font-style: italic; }

/* ── PROJECTS SECTION ── */
.projects-section { padding-top: 2rem; }

/* Grid */
.projects-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

@media (min-width: 640px) {
  .projects-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) {
  .projects-grid { grid-template-columns: repeat(3, 1fr); }
}

/* Project card */
.project-card {
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease, border-color 0.25s ease;
  display: flex;
  flex-direction: column;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: rgba(99,14,212,0.3);
}

[data-theme="dark"] .project-card:hover {
  border-color: rgba(168,85,247,0.35);
}

/* Thumbnail */
.project-thumb {
  position: relative;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}

.thumb-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-cat-icon {
  font-size: 3.5rem;
  color: rgba(255,255,255,0.75);
  z-index: 1;
}

.thumb-hover-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.25s ease;
  z-index: 3;
}

.project-card:hover .thumb-hover-overlay { opacity: 1; }

.view-project-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1.125rem;
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.35);
  border-radius: var(--radius-full);
  color: #fff;
  font-family: var(--font-headline);
  font-size: 0.8rem;
  font-weight: 600;
  transform: translateY(8px);
  transition: transform 0.25s ease;
}

.project-card:hover .view-project-btn { transform: translateY(0); }

.view-project-btn .material-symbols-outlined { font-size: 16px; }

.thumb-badges {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  z-index: 4;
}

.thumb-status {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 4;
}

.cat-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.6rem;
  background: rgba(0,0,0,0.45);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.68rem;
  font-weight: 700;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.03em;
}

.status-open {
  background: rgba(34,197,94,0.2);
  color: #16a34a;
  border: 1px solid rgba(34,197,94,0.4);
}

.status-closed {
  background: rgba(239,68,68,0.2);
  color: #dc2626;
  border: 1px solid rgba(239,68,68,0.35);
}

.status-progress {
  background: rgba(245,158,11,0.2);
  color: #d97706;
  border: 1px solid rgba(245,158,11,0.35);
}

[data-theme="dark"] .status-open { color: #4ade80; }
[data-theme="dark"] .status-closed { color: #f87171; }
[data-theme="dark"] .status-progress { color: #fbbf24; }

/* Card body */
.card-body {
  padding: 1.125rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  flex: 1;
}

.card-title {
  font-family: var(--font-headline);
  font-size: 1rem;
  font-weight: 700;
  color: var(--on-surface);
  line-height: 1.35;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-desc {
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--on-surface-variant);
  line-height: 1.55;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

/* Card footer */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.75rem;
  border-top: 1px solid var(--outline-variant);
  margin-top: auto;
  gap: 0.5rem;
}

.author-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  border-radius: var(--radius-md);
  padding: 0.2rem 0.4rem 0.2rem 0;
  transition: opacity 0.15s;
  min-width: 0;
}

.author-row:hover { opacity: 0.75; }

.author-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--primary-fixed);
  color: var(--primary);
  font-family: var(--font-headline);
  font-size: 0.7rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.author-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.author-name {
  font-family: var(--font-headline);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--on-surface);
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80px;
}

.author-handle {
  font-size: 0.65rem;
  color: var(--outline);
  white-space: nowrap;
}

/* Card actions */
.card-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  padding: 0.3rem 0.5rem;
  background: none;
  border: none;
  border-radius: var(--radius-md);
  color: var(--on-surface-variant);
  font-family: var(--font-headline);
  font-size: 0.75rem;
  cursor: pointer;
  transition: var(--transition-fast);
  text-decoration: none;
}

.action-btn .material-symbols-outlined { font-size: 15px; }

.action-btn:hover {
  background: var(--surface-container);
  color: var(--on-surface);
}

.action-link:hover {
  background: rgba(99,14,212,0.08);
  color: var(--primary);
}

.action-stat {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.75rem;
  color: var(--on-surface-variant);
  padding: 0.3rem 0.35rem;
}

.action-stat .material-symbols-outlined { font-size: 15px; }

.like-btn:hover {
  background: rgba(233,30,99,0.08);
  color: #e91e63;
}

.like-btn.liked {
  color: #e91e63;
}

/* ── LIST VIEW ── */
.projects-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.list-card {
  display: flex;
  gap: 0;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.list-card:hover {
  transform: translateX(2px);
  box-shadow: var(--shadow-md);
  border-color: rgba(99,14,212,0.25);
}

.list-thumb {
  width: 120px;
  min-height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  position: relative;
  border-radius: var(--radius-xl) 0 0 var(--radius-xl);
}

.list-content {
  flex: 1;
  padding: 0.875rem 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
  gap: 0.5rem;
}

.list-top { display: flex; flex-direction: column; gap: 0.3rem; }

.list-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.list-badges { display: flex; gap: 0.4rem; flex-shrink: 0; }

.list-desc {
  -webkit-line-clamp: 1;
}

.list-bottom {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* ── SKELETON ── */
.skeleton-card {
  border-radius: var(--radius-xl);
  overflow: hidden;
  border: 1px solid var(--outline-variant);
}

.skeleton-thumb {
  height: 200px;
  border-radius: 0;
}

.skeleton-body {
  padding: 1.125rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.skeleton-line {
  height: 14px;
  border-radius: var(--radius-sm);
}

.skeleton-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
}

.skeleton-footer-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.w-20 { width: 20%; }
.w-30 { width: 30%; }
.w-40 { width: 40%; }
.w-60 { width: 60%; }

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── EMPTY STATE ── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 4rem 2rem;
  border-radius: var(--radius-2xl);
  margin-top: 1rem;
}

.empty-icon {
  font-size: 4rem;
  color: var(--on-surface-variant);
  opacity: 0.5;
}

.empty-title {
  font-family: var(--font-headline);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--on-surface);
  margin: 1rem 0 0.5rem;
}

.empty-desc {
  font-size: 0.9rem;
  color: var(--on-surface-variant);
  max-width: 320px;
  margin: 0 0 1.5rem;
}

.empty-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center; }

/* ── CTA STRIP ── */
.cta-strip {
  position: relative;
  overflow: hidden;
  background: var(--gradient-primary);
  padding: clamp(3rem, 5vw, 4rem) 0;
  margin-top: 4rem;
}

.cta-orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(80px);
}

.cta-orb-1 {
  width: 400px;
  height: 400px;
  top: -100px;
  left: -80px;
  background: rgba(255,255,255,0.1);
}

.cta-orb-2 {
  width: 350px;
  height: 350px;
  bottom: -100px;
  right: -60px;
  background: rgba(255,255,255,0.07);
}

.cta-inner {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
}

.cta-text { flex: 1; min-width: 0; }

.cta-headline {
  font-family: var(--font-headline);
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 800;
  color: #fff;
  margin: 0 0 0.5rem;
}

.cta-sub {
  font-size: 0.95rem;
  color: rgba(255,255,255,0.8);
  margin: 0;
}

.cta-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  flex-shrink: 0;
}

.cta-strip .btn-primary {
  background: #fff;
  color: var(--primary);
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}

.cta-strip .btn-primary:hover {
  background: rgba(255,255,255,0.9);
  color: var(--primary);
}

.cta-strip .btn-outline {
  border-color: rgba(255,255,255,0.5);
  color: #fff;
}

.cta-strip .btn-outline:hover {
  background: rgba(255,255,255,0.12);
  border-color: #fff;
  color: #fff;
}

/* ── FADE TRANSITION ── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .filter-bar-inner { gap: 0.5rem; }

  .search-input { width: 140px; }
  .search-input:focus { width: 160px; }

  .hero-stats { gap: 1.25rem; padding: 0.875rem 1.25rem; }
  .hero-stat-value { font-size: 1.4rem; }

  .cta-inner { flex-direction: column; text-align: center; }
  .cta-actions { justify-content: center; width: 100%; }
  .cta-actions .btn-primary,
  .cta-actions .btn-outline { flex: 1; justify-content: center; }

  .list-thumb { width: 90px; min-height: 80px; }
  .list-title-row { flex-direction: column; gap: 0.4rem; }
}

@media (max-width: 480px) {
  .filter-right { gap: 0.35rem; }
  .view-toggle { display: none; }
  .search-input { width: 120px; }
  .search-input:focus { width: 140px; }
}
</style>
