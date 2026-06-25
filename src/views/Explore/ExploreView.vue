<template>
  <div class="explore-view">
    <!-- Page Header -->
    <div class="explore-header">
      <div class="container-gfd">
        <h1 class="text-headline-lg">Explore Talent</h1>
        <p class="text-body-md explore-sub">Discover world-class developers ready to build your next project.</p>

        <!-- Search + Filters -->
        <div class="explore-controls">
          <div class="search-wrap">
            <span class="material-symbols-outlined search-icon">search</span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search skills, name, or role..."
              class="search-input"
              @input="onSearchInput"
            />
          </div>
          <div class="filter-chips">
            <button
              v-for="role in roleFilters"
              :key="role"
              class="filter-chip"
              :class="{ active: activeRole === role }"
              @click="activeRole = role"
            >
              {{ role }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="container-gfd explore-content">
      <!-- Sidebar Filters -->
      <aside class="explore-sidebar">
        <div class="filter-section glass-card-static">
          <h3 class="filter-title">Filters</h3>

          <div class="filter-group">
            <p class="filter-group-label">Availability</p>
            <label v-for="opt in availabilityOpts" :key="opt.value" class="filter-checkbox">
              <input type="checkbox" name="availability" :value="opt.value" v-model="filters.availability" />
              <span>{{ opt.label }}</span>
            </label>
          </div>

          <div class="filter-group">
            <p class="filter-group-label">Experience Level</p>
            <label v-for="opt in experienceOpts" :key="opt.value" class="filter-checkbox">
              <input type="checkbox" name="experience" :value="opt.value" v-model="filters.experience" />
              <span>{{ opt.label }}</span>
            </label>
          </div>

          <div class="filter-group">
            <p class="filter-group-label">Skills</p>
            <div class="skill-chips">
              <button
                v-for="skill in SKILL_TAGS.slice(0, 12)"
                :key="skill"
                class="skill-chip"
                :class="{ active: filters.skills.includes(skill) }"
                @click="toggleSkill(skill)"
              >
                {{ skill }}
              </button>
            </div>
          </div>

          <button class="btn-outline filter-reset" @click="resetFilters">
            Reset Filters
          </button>
        </div>
      </aside>

      <!-- Developer Grid -->
      <div class="explore-main">
        <div class="results-meta">
          <span class="results-count">{{ filteredDevs.length }} developers found</span>
          <select v-model="sortBy" class="sort-select">
            <option value="rating">Top Rated</option>
            <option value="projects">Most Projects</option>
            <option value="recent">Recently Active</option>
          </select>
        </div>

        <div class="devs-grid">
          <div
            v-for="(dev, i) in filteredDevs"
            :key="dev.id"
            class="dev-card glass-card animate-fade-in-up"
            :class="`delay-${(i % 6) * 50}`"
          >
            <div class="dev-card-top">
              <div class="dev-avatar-wrap">
                <div class="dev-avatar">
                  <img v-if="dev.avatar" :src="dev.avatar" :alt="dev.name" class="dev-avatar-img" />
                  <span v-else class="dev-initials">{{ initials(dev.name) }}</span>
                </div>
                <span v-if="dev.available" class="online-dot" />
              </div>
              <div class="dev-info">
                <div class="dev-name-row">
                  <h3 class="dev-name">{{ dev.name }}</h3>
                  <span v-if="dev.verified" class="material-symbols-outlined verified-icon" style="font-variation-settings:'FILL' 1;">verified</span>
                </div>
                <p class="dev-role">{{ dev.role }}</p>
                <p class="dev-location">
                  <span class="material-symbols-outlined" style="font-size:14px;">location_on</span>
                  {{ dev.location }}
                </p>
              </div>
            </div>

            <div class="dev-tags">
              <span v-for="tag in dev.skills.slice(0, 4)" :key="tag" class="chip">{{ tag }}</span>
              <span v-if="dev.skills.length > 4" class="chip">+{{ dev.skills.length - 4 }}</span>
            </div>

            <p class="dev-bio">{{ dev.bio }}</p>

            <div class="dev-stats-row">
              <span class="dev-stat-item">
                <span class="material-symbols-outlined" style="font-size:14px;font-variation-settings:'FILL' 1;color:#f59e0b;">star</span>
                {{ dev.rating }}
              </span>
              <span class="dev-stat-item">
                <span class="material-symbols-outlined" style="font-size:14px;color:var(--outline);">work</span>
                {{ dev.projects }} projects
              </span>
              <span class="dev-stat-item" :class="dev.available ? 'available' : 'unavailable'">
                <span class="status-dot" :class="dev.available ? 'status-dot-green' : ''" style="width:6px;height:6px;" />
                {{ dev.available ? 'Available' : 'Busy' }}
              </span>
            </div>

            <div class="dev-actions">
              <RouterLink :to="`/developer/${dev.id}`" class="btn-view-profile">
                <span class="material-symbols-outlined" style="font-size:15px">person</span>
                Portfolio
              </RouterLink>
              <RouterLink :to="`/developer/${dev.id}`" class="dev-hire-btn btn-primary">
                <span class="material-symbols-outlined" style="font-size:15px">handshake</span>
                Hire
              </RouterLink>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredDevs.length === 0" class="empty-state glass-card-static">
          <span class="material-symbols-outlined empty-icon">search_off</span>
          <h3 class="empty-title">No developers found</h3>
          <p class="empty-desc">Try adjusting your filters or search query.</p>
          <button class="btn-primary" @click="resetFilters">Clear Filters</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSeo, pageSeo } from '@/composables/useSeo'
import { ref, computed, onMounted } from 'vue'
import { SKILL_TAGS } from '@/constants'
import { useDevelopersStore } from '@/store/developers'

useSeo(pageSeo.explore)

const devStore    = useDevelopersStore()

onMounted(() => {
  devStore.fetchDevelopers()
})
const searchQuery = ref('')
const activeRole  = ref('All')
const sortBy      = ref('rating')

// Debounced search — calls backend when user types
let searchTimeout = null
function onSearchInput() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    if (searchQuery.value.trim()) {
      devStore.fetchDevelopers({ search: searchQuery.value.trim() })
    } else {
      devStore.fetchDevelopers()
    }
  }, 500)
}

const filters = ref({
  availability: [],
  experience:   [],
  skills:       [],
})

const roleFilters = ['All', 'Frontend', 'Backend', 'Full Stack', 'Mobile', 'UI/UX', 'DevOps']

const availabilityOpts = [
  { value: 'available', label: 'Available Now' },
  { value: 'soon',      label: 'Available Soon' },
]

const experienceOpts = [
  { value: 'junior',  label: 'Junior (0–2 yrs)' },
  { value: 'mid',     label: 'Mid (2–5 yrs)' },
  { value: 'senior',  label: 'Senior (5+ yrs)' },
  { value: 'lead',    label: 'Lead / Principal' },
]

const filteredDevs = computed(() => {
  let devs = [...devStore.all]

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    devs = devs.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.role.toLowerCase().includes(q) ||
      d.skills.some(s => s.toLowerCase().includes(q))
    )
  }
  if (activeRole.value !== 'All') {
    devs = devs.filter(d => d.type === activeRole.value)
  }
  if (filters.value.availability.includes('available')) {
    devs = devs.filter(d => d.available)
  }
  if (filters.value.skills.length) {
    devs = devs.filter(d => filters.value.skills.some(s => d.skills.includes(s)))
  }
  if (sortBy.value === 'rating')   devs.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
  if (sortBy.value === 'projects') devs.sort((a, b) => b.projects - a.projects)
  return devs
})

function initials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function toggleSkill(skill) {
  const idx = filters.value.skills.indexOf(skill)
  if (idx === -1) filters.value.skills.push(skill)
  else filters.value.skills.splice(idx, 1)
}

function resetFilters() {
  searchQuery.value = ''
  activeRole.value  = 'All'
  filters.value = { availability: [], experience: [], skills: [] }
}
</script>

<style scoped>
.explore-view { background: var(--background); min-height: 100vh; }

.explore-header {
  background: var(--surface-container-low);
  border-bottom: 1px solid var(--outline-variant);
  padding: var(--space-lg) 0 var(--space-md);
}

.explore-sub { margin-top: 0.25rem; margin-bottom: var(--space-md); }

.explore-controls { display: flex; flex-direction: column; gap: var(--space-sm); }

.search-wrap {
  display: flex;
  align-items: center;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-xl);
  padding: 0.5rem 1rem;
  gap: 0.5rem;
  max-width: 560px;
  transition: var(--transition-base);
}

.search-wrap:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(124,58,237,0.1);
}

.search-icon { color: var(--outline); font-size: 20px; flex-shrink: 0; }

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--on-surface);
  outline: none;
}

.search-input::placeholder { color: var(--outline); }

.filter-chips { display: flex; flex-wrap: wrap; gap: var(--space-xs); }

.filter-chip {
  padding: 0.35rem 0.875rem;
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

/* Content Layout */
.explore-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-lg);
  padding-top: var(--space-lg);
  padding-bottom: var(--space-lg);
}

@media (min-width: 1024px) {
  .explore-content { grid-template-columns: 260px 1fr; }
}

/* Sidebar */
.explore-sidebar { display: none; }

@media (min-width: 1024px) {
  .explore-sidebar { display: block; }
}

.filter-section {
  padding: var(--space-md);
  position: sticky;
  top: 88px;
}

.filter-title {
  font-family: var(--font-headline);
  font-size: 1rem;
  font-weight: 700;
  color: var(--on-surface);
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--outline-variant);
}

.filter-group { margin-bottom: var(--space-md); }

.filter-group-label {
  font-family: var(--font-headline);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--on-surface);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-sm);
}

.filter-checkbox {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: 0.875rem;
  color: var(--on-surface-variant);
  cursor: pointer;
  padding: 0.25rem 0;
}

.filter-checkbox input { accent-color: var(--primary); }

.skill-chips { display: flex; flex-wrap: wrap; gap: var(--space-xs); }

.skill-chip {
  padding: 0.2rem 0.625rem;
  background: var(--surface-container);
  border: 1px solid transparent;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--on-surface-variant);
  cursor: pointer;
  transition: var(--transition-fast);
}

.skill-chip.active {
  background: rgba(99,14,212,0.1);
  border-color: rgba(99,14,212,0.3);
  color: var(--primary);
}

.filter-reset {
  width: 100%;
  justify-content: center;
  font-size: 0.875rem;
  margin-top: var(--space-sm);
}

/* Main */
.results-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-md);
}

.results-count {
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--on-surface-variant);
}

.sort-select {
  padding: 0.35rem 0.75rem;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-lg);
  font-family: var(--font-headline);
  font-size: 0.875rem;
  color: var(--on-surface);
  outline: none;
  cursor: pointer;
}

.devs-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
}

@media (min-width: 640px) {
  .devs-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1280px) {
  .devs-grid { grid-template-columns: repeat(3, 1fr); }
}

/* Dev Card */
.dev-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  padding: var(--space-md);
}

.dev-card-top { display: flex; align-items: flex-start; gap: var(--space-md); }

.dev-avatar-wrap { position: relative; flex-shrink: 0; }

.dev-avatar {
  width: 100px;
  height: 100px;
  border-radius: var(--radius-full);
  background: var(--surface-container);
  border: 2px solid var(--outline-variant);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.dev-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--radius-full);
}

.dev-initials {
  font-family: var(--font-headline);
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--primary);
}

.online-dot {
  position: absolute;
  bottom: -3px;
  right: -3px;
  width: 14px;
  height: 14px;
  background: #22c55e;
  border-radius: 50%;
  border: 2px solid var(--surface-container-lowest);
}

.dev-name-row {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.dev-name {
  font-family: var(--font-headline);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--on-surface);
}

.verified-icon { font-size: 18px; color: var(--primary); }

.dev-role {
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--primary);
  margin-top: 2px;
}

.dev-location {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 0.8rem;
  color: var(--on-surface-variant);
  margin-top: 4px;
}

.dev-tags { display: flex; flex-wrap: wrap; gap: var(--space-xs); }

.dev-bio {
  font-size: 1rem;
  color: var(--on-surface-variant);
  line-height: 1.5;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.dev-stats-row {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  flex-wrap: wrap;
}

.dev-stat-item {
  display: flex;
  align-items: center;
  gap: 3px;
  font-family: var(--font-headline);
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--on-surface-variant);
}

.available { color: #16a34a; }
.unavailable { color: var(--outline); }

.dev-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  width: 100%;
}

/* Both buttons equal width, compact */
.btn-view-profile,
.dev-hire-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  padding: 0.5rem 0.625rem;
  border-radius: var(--radius-lg);
  font-family: var(--font-headline);
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  transition: var(--transition-base);
}

.btn-view-profile {
  background: var(--surface-container-high);
  border: 1px solid var(--outline-variant);
  color: var(--on-surface);
}
.btn-view-profile:hover {
  background: var(--surface-container-highest);
  border-color: var(--outline);
  color: var(--on-surface);
}

/* Override btn-primary padding for the hire button */
.dev-hire-btn {
  padding: 0.5rem 0.625rem !important;
  font-size: 0.8rem !important;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-md);
  padding: var(--space-xl) var(--space-md);
  grid-column: 1 / -1;
}

.empty-icon { font-size: 3rem; color: var(--outline); }
.empty-title { font-family: var(--font-headline); font-size: 1.25rem; font-weight: 600; color: var(--on-surface); }
.empty-desc  { font-size: 1rem; color: var(--on-surface-variant); }
</style>
