<template>
  <div class="explore-root">

    <!-- ── Hero header ── -->
    <div class="explore-hero">
      <div class="hero-mesh" aria-hidden="true">
        <div class="mesh-blob mesh-1" /><div class="mesh-blob mesh-2" />
        <div class="hero-grid" />
      </div>
      <div class="container-gfd hero-body">
        <div class="hero-tag animate-fade-in-up">
          <span class="tag-dot" />
          {{ devStore.total || devStore.all.length }}+ verified developers
        </div>
        <h1 class="hero-h animate-fade-in-up delay-100">
          Find the perfect<br><span class="text-gradient">developer for hire</span>
        </h1>
        <p class="hero-sub animate-fade-in-up delay-200">
          Browse GitHub-verified full-stack engineers available for your next project.
        </p>

        <!-- Search bar -->
        <div class="search-bar animate-fade-in-up delay-300" :class="{ focused: searchFocused }">
          <span class="material-symbols-outlined s-icon">search</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by skill, name, or role…"
            class="s-input"
            @input="onSearchInput"
            @focus="searchFocused = true"
            @blur="searchFocused = false"
          />
          <button v-if="searchQuery" class="s-clear" @click="searchQuery=''; devStore.fetchDevelopers()">
            <span class="material-symbols-outlined" style="font-size:16px">close</span>
          </button>
          <button class="s-btn" @click="onSearchInput">Search</button>
        </div>

        <!-- Role chips -->
        <div class="role-chips animate-fade-in-up delay-400">
          <button v-for="r in ROLES" :key="r" class="role-chip"
            :class="{ active: activeRole === r }" @click="setRole(r)">
            {{ r }}
          </button>
        </div>
      </div>
    </div>

    <!-- ── Main content ── -->
    <div class="container-gfd explore-layout">

      <!-- Sidebar -->
      <aside class="sidebar" :class="{ open: drawerOpen }">
        <div class="sidebar-inner">
          <div class="sidebar-header">
            <h3 class="sidebar-title">Filters</h3>
            <button class="sidebar-close" @click="drawerOpen = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Availability -->
          <div class="filter-grp">
            <p class="filter-lbl">Availability</p>
            <label v-for="o in AVAIL" :key="o.v" class="filter-check">
              <input type="checkbox" :value="o.v" v-model="filters.availability" />
              <span>{{ o.l }}</span>
            </label>
          </div>

          <!-- Experience -->
          <div class="filter-grp">
            <p class="filter-lbl">Experience Level</p>
            <label v-for="o in EXP" :key="o.v" class="filter-check">
              <input type="checkbox" :value="o.v" v-model="filters.experience" />
              <span>{{ o.l }}</span>
            </label>
          </div>

          <!-- Skills -->
          <div class="filter-grp">
            <p class="filter-lbl">Skills</p>
            <div class="skill-cloud">
              <button v-for="s in SKILL_TAGS.slice(0,16)" :key="s"
                class="skill-chip" :class="{ active: filters.skills.includes(s) }"
                @click="toggleSkill(s)">{{ s }}</button>
            </div>
          </div>

          <button class="btn-reset" @click="resetFilters">
            <span class="material-symbols-outlined" style="font-size:15px">restart_alt</span>
            Reset all filters
          </button>
        </div>
      </aside>

      <!-- Overlay for mobile drawer -->
      <Transition name="fade">
        <div v-if="drawerOpen" class="drawer-overlay" @click="drawerOpen = false" />
      </Transition>

      <!-- Results area -->
      <main class="explore-main">

        <!-- Toolbar -->
        <div class="toolbar">
          <div class="toolbar-left">
            <button class="filter-toggle" @click="drawerOpen = true">
              <span class="material-symbols-outlined" style="font-size:18px">tune</span>
              Filters
              <span v-if="activeFilterCount" class="filter-badge">{{ activeFilterCount }}</span>
            </button>
            <span class="results-count">
              <strong>{{ filteredDevs.length }}</strong> developer{{ filteredDevs.length !== 1 ? 's' : '' }}
            </span>
          </div>
          <div class="toolbar-right">
            <select v-model="sortBy" class="sort-sel gfd-select">
              <option value="rating">Top Rated</option>
              <option value="projects">Most Projects</option>
              <option value="available">Available First</option>
            </select>
            <div class="view-toggle">
              <button :class="{ active: viewMode==='grid' }" @click="viewMode='grid'" title="Grid view">
                <span class="material-symbols-outlined" style="font-size:18px">grid_view</span>
              </button>
              <button :class="{ active: viewMode==='list' }" @click="viewMode='list'" title="List view">
                <span class="material-symbols-outlined" style="font-size:18px">view_list</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Active filter pills -->
        <div v-if="activeFilterCount" class="active-filters">
          <span v-if="activeRole !== 'All'" class="af-pill">
            {{ activeRole }}
            <button @click="setRole('All')"><span class="material-symbols-outlined" style="font-size:12px">close</span></button>
          </span>
          <span v-for="s in filters.skills" :key="s" class="af-pill">
            {{ s }}
            <button @click="toggleSkill(s)"><span class="material-symbols-outlined" style="font-size:12px">close</span></button>
          </span>
          <button class="af-clear" @click="resetFilters">Clear all</button>
        </div>

        <!-- Skeleton loading -->
        <div v-if="devStore.loading" :class="viewMode === 'grid' ? 'dev-grid' : 'dev-list'">
          <div v-for="i in 9" :key="i" class="dev-skel shimmer"
            :class="viewMode === 'list' ? 'dev-skel-list' : ''" />
        </div>

        <!-- Grid view -->
        <div v-else-if="filteredDevs.length && viewMode === 'grid'" class="dev-grid">
          <RouterLink
            v-for="(dev, i) in filteredDevs" :key="dev.id"
            :to="`/developer/${dev.id}`"
            class="dev-card animate-fade-in-up"
            :class="`delay-${(i%9)*50}`"
          >
            <!-- Cover — uses user's banner if set, otherwise gradient -->
            <div class="dc-cover"
              :style="dev.banner
                ? `background-image:url('${dev.banner}');background-size:cover;background-position:center`
                : `background:${COVER_GRADS[i % COVER_GRADS.length]}`">
              <span v-if="dev.available" class="dc-avail">
                <span class="live-dot" />Available
              </span>
              <span v-else class="dc-busy">Busy</span>
            </div>
            <!-- Avatar — bigger, circular, properly positioned -->
            <div class="dc-av-wrap">
              <img v-if="dev.avatar" :src="dev.avatar" :alt="dev.name" class="dc-av-img" />
              <div v-else class="dc-av-ini" :style="`background:${AV_COLORS[i % AV_COLORS.length]}`">
                {{ initials(dev.name) }}
              </div>
            </div>
            <!-- Body -->
            <div class="dc-body">
              <div class="dc-name-row">
                <h3 class="dc-name">{{ dev.name }}</h3>
                <span v-if="dev.verified" class="material-symbols-outlined dc-verified"
                  style="font-variation-settings:'FILL' 1">verified</span>
              </div>
              <p class="dc-role">{{ dev.role }}</p>
              <p v-if="dev.location" class="dc-loc">
                <span class="material-symbols-outlined" style="font-size:13px">location_on</span>
                {{ dev.location }}
              </p>
              <p class="dc-bio">{{ dev.bio || 'Available for hire on GFD.' }}</p>
              <div class="dc-skills">
                <span v-for="s in dev.skills.slice(0,3)" :key="s" class="dc-skill">{{ s }}</span>
                <span v-if="dev.skills.length > 3" class="dc-skill dc-more">+{{ dev.skills.length-3 }}</span>
              </div>
              <div class="dc-foot">
                <div class="dc-stat">
                  <span class="material-symbols-outlined" style="font-size:13px;color:#f59e0b;font-variation-settings:'FILL' 1">star</span>
                  {{ dev.rating }}
                </div>
                <div class="dc-stat">
                  <span class="material-symbols-outlined" style="font-size:13px;color:var(--outline)">work_outline</span>
                  {{ dev.projects }} projects
                </div>
                <button class="dc-hire-btn" @click.prevent="goHire(dev)">
                  Hire
                  <span class="material-symbols-outlined" style="font-size:13px">handshake</span>
                </button>
              </div>
            </div>
          </RouterLink>
        </div>

        <!-- List view -->
        <div v-else-if="filteredDevs.length && viewMode === 'list'" class="dev-list">
          <RouterLink
            v-for="(dev, i) in filteredDevs" :key="dev.id"
            :to="`/developer/${dev.id}`"
            class="dev-row animate-fade-in-up"
            :class="`delay-${(i%9)*40}`"
          >
            <div class="dr-av" :style="`background:${AV_COLORS[i % AV_COLORS.length]}`">
              <img v-if="dev.avatar" :src="dev.avatar" :alt="dev.name" class="dr-av-img" />
              <span v-else class="dr-av-ini">{{ initials(dev.name) }}</span>
              <span v-if="dev.available" class="dr-dot" />
            </div>
            <div class="dr-info">
              <div class="dr-name-row">
                <h3 class="dr-name">{{ dev.name }}</h3>
                <span v-if="dev.verified" class="material-symbols-outlined dr-ver"
                  style="font-variation-settings:'FILL' 1">verified</span>
              </div>
              <p class="dr-role">{{ dev.role }}</p>
              <div class="dr-skills">
                <span v-for="s in dev.skills.slice(0,4)" :key="s" class="dr-skill">{{ s }}</span>
                <span v-if="dev.skills.length > 4" class="dr-skill dr-more">+{{ dev.skills.length-4 }}</span>
              </div>
            </div>
            <div class="dr-meta">
              <p v-if="dev.location" class="dr-loc">
                <span class="material-symbols-outlined" style="font-size:13px">location_on</span>{{ dev.location }}
              </p>
              <div class="dr-stat">
                <span class="material-symbols-outlined" style="font-size:13px;color:#f59e0b;font-variation-settings:'FILL' 1">star</span>
                {{ dev.rating }}
              </div>
            </div>
            <div class="dr-actions">
              <span class="dr-avail-pill" :class="dev.available ? 'pill-avail' : 'pill-busy'">
                {{ dev.available ? 'Available' : 'Busy' }}
              </span>
              <button class="dr-hire" @click.prevent="goHire(dev)">Hire</button>
            </div>
          </RouterLink>
        </div>

        <!-- Empty state -->
        <div v-else-if="!devStore.loading" class="explore-empty">
          <div class="empty-ico-wrap">
            <span class="material-symbols-outlined" style="font-size:2.5rem;color:var(--outline)">person_search</span>
          </div>
          <h3 class="empty-title">No developers found</h3>
          <p class="empty-sub">Try different search terms or clear your filters.</p>
          <button class="btn-primary" @click="resetFilters">Clear all filters</button>
        </div>

        <!-- Load more -->
        <div v-if="filteredDevs.length && filteredDevs.length < devStore.total" class="load-more">
          <button class="btn-load-more" :disabled="devStore.loading" @click="loadMore">
            <span v-if="devStore.loading" class="spinner" />
            <span v-else>Load more developers</span>
          </button>
        </div>

      </main>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSeo, pageSeo } from '@/composables/useSeo'
import { SKILL_TAGS } from '@/constants'
import { useDevelopersStore } from '@/store/developers'

useSeo(pageSeo.explore)

const router   = useRouter()
const devStore = useDevelopersStore()

const ROLES = ['All','Frontend','Backend','Full Stack','Mobile','UI/UX','DevOps']
const AVAIL = [{ v:'available', l:'Available Now' }, { v:'soon', l:'Available Soon' }]
const EXP   = [
  { v:'junior', l:'Junior (0–2 yrs)' },
  { v:'mid',    l:'Mid (2–5 yrs)' },
  { v:'senior', l:'Senior (5+ yrs)' },
  { v:'lead',   l:'Lead / Principal' },
]
const COVER_GRADS = [
  'linear-gradient(135deg,#1a0840 0%,#3b0f82 100%)',
  'linear-gradient(135deg,#041036 0%,#0c2ea8 100%)',
  'linear-gradient(135deg,#052010 0%,#0a6630 100%)',
  'linear-gradient(135deg,#2a0020 0%,#8b0060 100%)',
  'linear-gradient(135deg,#1a1000 0%,#7a4500 100%)',
  'linear-gradient(135deg,#000f2a 0%,#00408a 100%)',
]
const AV_COLORS = ['#7c3aed','#2563eb','#16a34a','#db2777','#d97706','#0891b2']

const searchQuery  = ref('')
const searchFocused = ref(false)
const activeRole   = ref('All')
const sortBy       = ref('rating')
const viewMode     = ref('grid')
const drawerOpen   = ref(false)
const currentPage  = ref(1)

const filters = ref({ availability: [], experience: [], skills: [] })

onMounted(() => devStore.fetchDevelopers({ limit: 50 }))

let searchTimeout = null
function onSearchInput() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    devStore.fetchDevelopers({ search: searchQuery.value.trim() || undefined, limit: 50 })
  }, 450)
}

function setRole(r) {
  activeRole.value = r
  currentPage.value = 1
  devStore.fetchDevelopers({
    experience_level: r === 'All' ? undefined : r.toLowerCase().replace(' ', '_'),
    limit: 50,
  })
}

function toggleSkill(s) {
  const idx = filters.value.skills.indexOf(s)
  if (idx === -1) filters.value.skills.push(s)
  else filters.value.skills.splice(idx, 1)
}

function resetFilters() {
  searchQuery.value = ''
  activeRole.value  = 'All'
  currentPage.value = 1
  filters.value = { availability: [], experience: [], skills: [] }
  devStore.fetchDevelopers({ limit: 50 })
}

async function loadMore() {
  currentPage.value++
  await devStore.fetchDevelopers({ page: currentPage.value, limit: 50 })
}

const activeFilterCount = computed(() => {
  let n = filters.value.skills.length + filters.value.availability.length + filters.value.experience.length
  if (activeRole.value !== 'All') n++
  return n
})

const filteredDevs = computed(() => {
  let devs = [...devStore.all]
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    devs = devs.filter(d =>
      d.name.toLowerCase().includes(q) ||
      (d.role || '').toLowerCase().includes(q) ||
      d.skills.some(s => s.toLowerCase().includes(q))
    )
  }
  if (activeRole.value !== 'All')
    devs = devs.filter(d => (d.type || d.role || '').toLowerCase().includes(activeRole.value.toLowerCase()))
  if (filters.value.availability.includes('available'))
    devs = devs.filter(d => d.available)
  if (filters.value.skills.length)
    devs = devs.filter(d => filters.value.skills.some(s => d.skills.includes(s)))
  if (sortBy.value === 'rating')    devs.sort((a,b) => parseFloat(b.rating) - parseFloat(a.rating))
  if (sortBy.value === 'projects')  devs.sort((a,b) => b.projects - a.projects)
  if (sortBy.value === 'available') devs.sort((a,b) => (b.available ? 1 : 0) - (a.available ? 1 : 0))
  return devs
})

function initials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function goHire(dev) {
  router.push(`/hire?dev=${dev.id}&name=${encodeURIComponent(dev.name)}`)
}
</script>

<style scoped>
/* ── Root ── */
.explore-root { background: var(--background); min-height: 100vh; }

/* ── Hero ── */
.explore-hero {
  position: relative; overflow: hidden;
  background: var(--background);
  padding: calc(5rem + env(safe-area-inset-top,0px)) 0 3rem;
}
.hero-mesh { position:absolute; inset:0; pointer-events:none; overflow:hidden; }
.mesh-blob { position:absolute; border-radius:50%; filter:blur(80px); }
.mesh-1 { width:500px; height:400px; top:-100px; right:-80px; background:radial-gradient(circle,rgba(99,14,212,.12) 0%,transparent 70%); }
.mesh-2 { width:350px; height:350px; bottom:-80px; left:-60px; background:radial-gradient(circle,rgba(168,85,247,.09) 0%,transparent 70%); }
.hero-grid {
  position:absolute; inset:0;
  background-image: linear-gradient(var(--outline-variant) 1px,transparent 1px), linear-gradient(90deg,var(--outline-variant) 1px,transparent 1px);
  background-size:60px 60px; opacity:.25;
  mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 30%,transparent 100%);
  -webkit-mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 30%,transparent 100%);
}
.hero-body { position:relative; z-index:1; display:flex; flex-direction:column; align-items:center; text-align:center; gap:1.25rem; }

.hero-tag { display:inline-flex; align-items:center; gap:.4rem; padding:.3rem .875rem; background:var(--surface-container-low); border:1px solid var(--glass-border-primary); border-radius:999px; font-family:var(--font-headline); font-size:.8rem; font-weight:600; color:var(--primary); }
.tag-dot { width:7px; height:7px; border-radius:50%; background:#22c55e; box-shadow:0 0 6px rgba(34,197,94,.6); flex-shrink:0; }

.hero-h { font-family:var(--font-headline); font-size:clamp(1.9rem,5vw,3rem); font-weight:900; line-height:1.08; letter-spacing:-.035em; color:var(--on-surface); max-width:600px; }
.hero-sub { font-size:clamp(.95rem,2vw,1.1rem); color:var(--on-surface-variant); line-height:1.65; max-width:480px; }

/* Search bar */
.search-bar {
  display:flex; align-items:center; gap:.5rem;
  width:100%; max-width:580px;
  background:var(--surface-container-lowest);
  border:1.5px solid var(--outline-variant);
  border-radius:16px; padding:.5rem .5rem .5rem 1rem;
  box-shadow:var(--shadow-sm);
  transition:border-color .2s, box-shadow .2s;
}
.search-bar.focused { border-color:var(--primary); box-shadow:0 0 0 4px rgba(99,14,212,.1); }
.s-icon { color:var(--outline); font-size:20px; flex-shrink:0; }
.s-input { flex:1; border:none; background:transparent; font-family:var(--font-body); font-size:.95rem; color:var(--on-surface); outline:none; min-width:0; }
.s-input::placeholder { color:var(--outline); }
.s-clear { border:none; background:none; cursor:pointer; color:var(--outline); display:flex; align-items:center; padding:.25rem; }
.s-clear:hover { color:var(--on-surface); }
.s-btn { flex-shrink:0; padding:.55rem 1.125rem; background:var(--primary); color:#fff; border:none; border-radius:12px; font-family:var(--font-headline); font-size:.85rem; font-weight:700; cursor:pointer; transition:opacity .15s; white-space:nowrap; }
.s-btn:hover { opacity:.9; }

/* Role chips */
.role-chips { display:flex; flex-wrap:wrap; gap:.375rem; justify-content:center; }
.role-chip { padding:.4rem .875rem; border-radius:999px; border:1.5px solid var(--outline-variant); background:none; font-family:var(--font-headline); font-size:.8rem; font-weight:600; color:var(--on-surface-variant); cursor:pointer; transition:all .15s; white-space:nowrap; }
.role-chip:hover { border-color:var(--primary); color:var(--primary); }
.role-chip.active { border-color:var(--primary); background:var(--primary-fixed); color:var(--primary); }

/* ── Layout ── */
.explore-layout {
  display:grid; grid-template-columns:1fr;
  gap:1.5rem; padding-top:1.5rem; padding-bottom:3rem;
}
@media (min-width:1024px) { .explore-layout { grid-template-columns:256px 1fr; gap:2rem; padding-top:2rem; } }

/* ── Sidebar ── */
.sidebar {
  display:none;
}
@media (min-width:1024px) {
  .sidebar { display:block; }
}
/* Mobile drawer */
@media (max-width:1023px) {
  .sidebar.open {
    display:block; position:fixed; top:0; left:0; bottom:0; z-index:600;
    width:min(300px, 85vw); overflow-y:auto;
    animation:slideInLeft .22s ease;
  }
}
@keyframes slideInLeft { from{transform:translateX(-100%)} to{transform:translateX(0)} }
.drawer-overlay { position:fixed; inset:0; z-index:599; background:rgba(0,0,0,.45); backdrop-filter:blur(2px); }
.fade-enter-active,.fade-leave-active { transition:opacity .2s; }
.fade-enter-from,.fade-leave-to { opacity:0; }

.sidebar-inner {
  background:var(--surface-container-lowest);
  border:1px solid var(--outline-variant);
  border-radius:18px; padding:1.25rem;
  position:sticky; top:88px;
  display:flex; flex-direction:column; gap:1.25rem;
}
@media (max-width:1023px) { .sidebar-inner { border-radius:0; border:none; min-height:100%; } }

.sidebar-header { display:flex; align-items:center; justify-content:space-between; }
.sidebar-title { font-family:var(--font-headline); font-size:1rem; font-weight:800; color:var(--on-surface); }
.sidebar-close { display:none; border:none; background:none; cursor:pointer; color:var(--on-surface-variant); }
@media (max-width:1023px) { .sidebar-close { display:flex; align-items:center; } }

.filter-grp { display:flex; flex-direction:column; gap:.5rem; }
.filter-lbl { font-family:var(--font-headline); font-size:.72rem; font-weight:800; color:var(--on-surface); text-transform:uppercase; letter-spacing:.08em; padding-bottom:.25rem; border-bottom:1px solid var(--outline-variant); }
.filter-check { display:flex; align-items:center; gap:.625rem; font-size:.875rem; color:var(--on-surface-variant); cursor:pointer; padding:.2rem 0; }
.filter-check input { accent-color:var(--primary); width:15px; height:15px; flex-shrink:0; }

.skill-cloud { display:flex; flex-wrap:wrap; gap:.3rem; }
.skill-chip { padding:.2rem .6rem; border-radius:999px; background:var(--surface-container); border:1px solid transparent; font-family:var(--font-headline); font-size:.72rem; font-weight:600; color:var(--on-surface-variant); cursor:pointer; transition:all .15s; }
.skill-chip.active { background:rgba(99,14,212,.1); border-color:rgba(99,14,212,.3); color:var(--primary); }
.skill-chip:hover { border-color:var(--outline); }

.btn-reset { display:flex; align-items:center; gap:.375rem; justify-content:center; padding:.55rem; border-radius:12px; background:none; border:1.5px solid var(--outline-variant); font-family:var(--font-headline); font-size:.82rem; font-weight:600; color:var(--on-surface-variant); cursor:pointer; transition:all .15s; }
.btn-reset:hover { border-color:var(--primary); color:var(--primary); }

/* ── Toolbar ── */
.toolbar { display:flex; align-items:center; justify-content:space-between; gap:.75rem; margin-bottom:1rem; flex-wrap:wrap; }
.toolbar-left { display:flex; align-items:center; gap:.75rem; }
.toolbar-right { display:flex; align-items:center; gap:.5rem; }

.filter-toggle { display:flex; align-items:center; gap:.375rem; padding:.45rem .875rem; border-radius:10px; background:var(--surface-container-low); border:1.5px solid var(--outline-variant); font-family:var(--font-headline); font-size:.82rem; font-weight:600; color:var(--on-surface); cursor:pointer; transition:all .15s; }
.filter-toggle:hover { border-color:var(--primary); color:var(--primary); }
@media (min-width:1024px) { .filter-toggle { display:none; } }
.filter-badge { background:var(--primary); color:#fff; font-size:.62rem; font-weight:800; padding:.1rem .35rem; border-radius:999px; }

.results-count { font-family:var(--font-headline); font-size:.875rem; color:var(--on-surface-variant); }
.results-count strong { color:var(--on-surface); }

.sort-sel { font-size:.82rem; padding:.4rem .7rem; }

.view-toggle { display:flex; gap:.25rem; background:var(--surface-container-low); border:1px solid var(--outline-variant); border-radius:10px; padding:.2rem; }
.view-toggle button { width:30px; height:30px; border-radius:7px; border:none; background:none; cursor:pointer; display:flex; align-items:center; justify-content:center; color:var(--on-surface-variant); transition:all .15s; }
.view-toggle button.active { background:var(--surface-container-highest); color:var(--primary); }

/* Active filter pills */
.active-filters { display:flex; flex-wrap:wrap; gap:.375rem; margin-bottom:.875rem; align-items:center; }
.af-pill { display:inline-flex; align-items:center; gap:.3rem; padding:.2rem .625rem; background:var(--primary-fixed); border:1px solid rgba(99,14,212,.2); border-radius:999px; font-family:var(--font-headline); font-size:.72rem; font-weight:600; color:var(--primary); }
.af-pill button { border:none; background:none; cursor:pointer; color:var(--primary); display:flex; align-items:center; padding:0; }
.af-clear { border:none; background:none; cursor:pointer; font-family:var(--font-headline); font-size:.75rem; font-weight:600; color:var(--on-surface-variant); text-decoration:underline; }

/* ── Grid ── */
.dev-grid { display:grid; grid-template-columns:1fr; gap:.875rem; }
@media (min-width:480px) { .dev-grid { grid-template-columns:repeat(2,1fr); } }
@media (min-width:1280px) { .dev-grid { grid-template-columns:repeat(3,1fr); } }

/* Skeleton */
.dev-skel { height:300px; border-radius:18px; }
.dev-skel-list { height:72px; border-radius:14px; }
.shimmer { background:linear-gradient(90deg,var(--surface-container) 25%,var(--surface-container-high) 50%,var(--surface-container) 75%); background-size:200% 100%; animation:shimmer 1.4s infinite; }
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

/* Card — NO overflow:hidden so avatar is never clipped */
.dev-card { display:flex; flex-direction:column; border-radius:18px; background:var(--surface-container-lowest); border:1px solid var(--outline-variant); text-decoration:none; transition:transform .2s, box-shadow .2s, border-color .2s; cursor:pointer; }
.dev-card:hover { transform:translateY(-4px); box-shadow:var(--shadow-md); border-color:var(--primary); }

.dc-cover { position:relative; height:90px; flex-shrink:0; border-radius:17px 17px 0 0; overflow:hidden; }
.dc-avail { position:absolute; top:.625rem; right:.625rem; display:inline-flex; align-items:center; gap:.3rem; padding:.2rem .625rem; border-radius:999px; background:rgba(0,0,0,.45); backdrop-filter:blur(8px); color:#4ade80; font-size:.62rem; font-weight:700; border:1px solid rgba(34,197,94,.3); }
.dc-busy  { position:absolute; top:.625rem; right:.625rem; padding:.2rem .625rem; border-radius:999px; background:rgba(0,0,0,.4); backdrop-filter:blur(8px); color:rgba(255,255,255,.55); font-size:.62rem; font-weight:700; }
.live-dot { width:5px; height:5px; border-radius:50%; background:#22c55e; flex-shrink:0; animation:pulse 2s ease-in-out infinite; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }

/* Avatar sits in dc-body as FIRST element, pulled up with negative margin-top */
/* The card has NO overflow:hidden so it won't clip */
.dc-av-wrap {
  width: 64px; height: 64px;
  border-radius: 50%;
  border: 3px solid var(--surface-container-lowest);
  overflow: hidden;
  box-shadow: 0 4px 18px rgba(0,0,0,.3);
  flex-shrink: 0;
  background: var(--surface-container);
  margin-top: -32px;
  margin-left: 1rem;
  position: relative;
  z-index: 10;
}
.dc-av-img  { width:100%; height:100%; object-fit:cover; display:block; }
.dc-av-ini  {
  width:100%; height:100%;
  display:flex; align-items:center; justify-content:center;
  font-family:var(--font-headline); font-size:1.2rem; font-weight:800; color:#fff;
}

.dc-body { padding:.75rem 1.125rem 1rem; display:flex; flex-direction:column; gap:.5rem; flex:1; }
.dc-name-row { display:flex; align-items:center; gap:.3rem; margin-top:.5rem; }
.dc-name { font-family:var(--font-headline); font-size:.95rem; font-weight:800; color:var(--on-surface); }
.dc-verified { font-size:16px; color:var(--primary); flex-shrink:0; }
.dc-role { font-size:.75rem; color:var(--primary); font-weight:600; }
.dc-loc { display:flex; align-items:center; gap:.2rem; font-size:.72rem; color:var(--on-surface-variant); }
.dc-bio { font-size:.8rem; color:var(--on-surface-variant); line-height:1.5; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; flex:1; }
.dc-skills { display:flex; flex-wrap:wrap; gap:.275rem; }
.dc-skill { padding:.15rem .5rem; border-radius:999px; background:var(--surface-container); border:1px solid var(--outline-variant); font-family:var(--font-headline); font-size:.65rem; font-weight:600; color:var(--on-surface-variant); }
.dc-more { background:var(--primary-fixed); color:var(--primary); border-color:transparent; }

.dc-foot { display:flex; align-items:center; gap:.5rem; padding-top:.625rem; border-top:1px solid var(--outline-variant); margin-top:auto; }
.dc-stat { display:flex; align-items:center; gap:.2rem; font-family:var(--font-headline); font-size:.72rem; font-weight:600; color:var(--on-surface-variant); }
.dc-hire-btn { margin-left:auto; padding:.35rem .875rem; border-radius:8px; background:var(--primary); color:#fff; border:none; font-family:var(--font-headline); font-size:.75rem; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:.25rem; transition:opacity .15s; box-shadow:0 2px 10px rgba(99,14,212,.25); }
.dc-hire-btn:hover { opacity:.9; }

/* ── List view ── */
.dev-list { display:flex; flex-direction:column; gap:.5rem; }
.dev-row { display:flex; align-items:center; gap:.875rem; padding:.875rem 1rem; border-radius:14px; background:var(--surface-container-lowest); border:1px solid var(--outline-variant); text-decoration:none; transition:border-color .15s, transform .15s; }
.dev-row:hover { border-color:var(--primary); transform:translateX(3px); }
.dr-av { width:44px; height:44px; border-radius:12px; flex-shrink:0; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden; }
.dr-av-img { width:100%; height:100%; object-fit:cover; }
.dr-av-ini { font-family:var(--font-headline); font-size:.9rem; font-weight:800; color:#fff; }
.dr-dot { position:absolute; bottom:-2px; right:-2px; width:10px; height:10px; border-radius:50%; background:#22c55e; border:2px solid var(--surface-container-lowest); }
.dr-info { flex:1; min-width:0; display:flex; flex-direction:column; gap:.25rem; }
.dr-name-row { display:flex; align-items:center; gap:.25rem; }
.dr-name { font-family:var(--font-headline); font-size:.9rem; font-weight:700; color:var(--on-surface); }
.dr-ver { font-size:14px; color:var(--primary); font-variation-settings:'FILL' 1; }
.dr-role { font-size:.72rem; color:var(--primary); font-weight:600; }
.dr-skills { display:flex; flex-wrap:wrap; gap:.25rem; }
.dr-skill { padding:.12rem .45rem; border-radius:999px; background:var(--surface-container); font-family:var(--font-headline); font-size:.62rem; font-weight:600; color:var(--on-surface-variant); border:1px solid var(--outline-variant); }
.dr-more { background:var(--primary-fixed); color:var(--primary); border-color:transparent; }
.dr-meta { display:flex; flex-direction:column; gap:.25rem; align-items:flex-end; flex-shrink:0; }
.dr-loc { display:flex; align-items:center; gap:.2rem; font-size:.72rem; color:var(--on-surface-variant); }
.dr-stat { display:flex; align-items:center; gap:.2rem; font-family:var(--font-headline); font-size:.75rem; font-weight:600; color:var(--on-surface-variant); }
.dr-actions { display:flex; flex-direction:column; align-items:flex-end; gap:.375rem; flex-shrink:0; }
.dr-avail-pill { padding:.18rem .55rem; border-radius:999px; font-size:.65rem; font-weight:700; }
.pill-avail { background:rgba(34,197,94,.1); color:#16a34a; }
.pill-busy  { background:var(--surface-container); color:var(--on-surface-variant); }
.dr-hire { padding:.4rem .875rem; border-radius:8px; background:var(--primary); color:#fff; border:none; font-family:var(--font-headline); font-size:.78rem; font-weight:700; cursor:pointer; transition:opacity .15s; }
.dr-hire:hover { opacity:.9; }

/* ── Empty ── */
.explore-empty { display:flex; flex-direction:column; align-items:center; gap:.875rem; padding:4rem 1rem; text-align:center; }
.empty-ico-wrap { width:80px; height:80px; border-radius:24px; background:var(--surface-container-low); border:1px solid var(--outline-variant); display:flex; align-items:center; justify-content:center; }
.empty-title { font-family:var(--font-headline); font-size:1.15rem; font-weight:800; color:var(--on-surface); }
.empty-sub { font-size:.875rem; color:var(--on-surface-variant); max-width:320px; line-height:1.6; }

/* ── Load more ── */
.load-more { display:flex; justify-content:center; padding-top:1.5rem; }
.btn-load-more { padding:.7rem 2rem; border-radius:14px; background:var(--surface-container-low); border:1.5px solid var(--outline-variant); font-family:var(--font-headline); font-size:.9rem; font-weight:700; color:var(--on-surface); cursor:pointer; display:flex; align-items:center; gap:.5rem; transition:all .15s; }
.btn-load-more:hover:not(:disabled) { border-color:var(--primary); color:var(--primary); }
.btn-load-more:disabled { opacity:.5; cursor:not-allowed; }
.spinner { width:16px; height:16px; border-radius:50%; border:2px solid var(--outline-variant); border-top-color:var(--primary); animation:spin .7s linear infinite; }
@keyframes spin { to{transform:rotate(360deg)} }
</style>
