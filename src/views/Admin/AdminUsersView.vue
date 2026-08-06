<template>
  <div class="admin-users-view">
    <!-- Page Header -->
    <div class="page-header">
      <div class="page-header-left">
        <div class="page-header-icon">
          <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">group</span>
        </div>
        <div>
          <h1 class="page-title">User Management</h1>
          <p class="page-sub">Oversee the global ecosystem of developers and clients.</p>
        </div>
      </div>
      <div class="header-actions">
        <button class="btn-primary">
          <span class="material-symbols-outlined">person_add</span>
          Invite User
        </button>
        <button class="btn-outline">
          <span class="material-symbols-outlined">download</span>
          Export
        </button>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="user-stats">
      <div v-for="stat in userStats" :key="stat.label" class="user-stat-card">
        <div class="ustat-icon-wrap" :style="{ background: stat.bg }">
          <span class="material-symbols-outlined ustat-icon" :style="{ color: stat.color }">{{ stat.icon }}</span>
        </div>
        <div class="ustat-body">
          <p class="ustat-label">{{ stat.label }}</p>
          <h4 class="ustat-value" :style="stat.valueColor ? { color: stat.valueColor } : {}">{{ stat.value }}</h4>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="user-tabs">
      <button v-for="tab in tabs" :key="tab.value" class="user-tab" :class="{ active: activeTab === tab.value }" @click="activeTab = tab.value">
        {{ tab.label }}
        <span v-if="tab.badge" class="tab-badge">{{ tab.badge }}</span>
      </button>
    </div>

    <!-- Filters Bar -->
    <div class="user-filters">
      <div class="filters-left">
        <select v-model="roleFilter" class="filter-select">
          <option value="">All Roles</option>
          <option value="developer">Developer</option>
          <option value="client">Client</option>
          <option value="admin">Admin</option>
        </select>
        <select v-model="statusFilter" class="filter-select">
          <option value="">Any Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>
      <div class="search-wrap">
        <span class="material-symbols-outlined search-icon">search</span>
        <input v-model="searchQuery" name="search" autocomplete="off" class="search-input" placeholder="Search users…" />
      </div>
    </div>

    <!-- Table Card -->
    <div class="table-card">
      <div class="table-scroll">
        <table class="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Skill Tests</th>
              <th>Status</th>
              <th class="th-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id" class="user-row">
              <td>
                <div class="user-cell">
                  <div class="user-avatar" :class="{ suspended: user.status === 'suspended' }">
                    {{ user.name[0] }}
                  </div>
                  <div>
                    <p class="user-name" :class="{ 'line-through': user.status === 'suspended' }">{{ user.name }}</p>
                    <p class="user-email">{{ user.email }}</p>
                  </div>
                </div>
              </td>
              <td><span class="role-chip">{{ user.role }}</span></td>
              <td class="cell-muted">{{ user.joined }}</td>
              <td>
                <div class="skill-dots">
                  <span v-for="(dot, i) in user.skillDots" :key="i" class="skill-dot" :class="dot" />
                </div>
              </td>
              <td>
                <div class="status-cell">
                  <span class="status-dot" :class="statusDotClass(user.status)" />
                  <span :class="statusTextClass(user.status)">{{ user.statusLabel }}</span>
                </div>
              </td>
              <td>
                <div class="row-actions">
                  <button class="row-btn view" title="View Profile" @click="viewUserProfile(user)">
                    <span class="material-symbols-outlined">visibility</span>
                  </button>
                  <button class="row-btn"
                    :style="user.is_verified ? 'background:rgba(99,14,212,.12);color:var(--primary)' : ''"
                    :title="user.is_verified ? 'Remove Verified Badge' : 'Grant Verified Badge'"
                    @click="toggleVerified(user)">
                    <span class="material-symbols-outlined" :style="user.is_verified ? 'font-variation-settings:\'FILL\' 1' : ''">verified</span>
                  </button>
                  <button class="row-btn" :class="user.status === 'suspended' ? 'warn' : 'danger'"
                    :title="user.status === 'suspended' ? 'Lift Suspension' : 'Suspend User'"
                    @click="toggleSuspend(user)">
                    <span class="material-symbols-outlined">{{ user.status === 'suspended' ? 'lock_open' : 'block' }}</span>
                  </button>
                  <button class="row-btn" style="background:rgba(239,68,68,.1);color:#ef4444"
                    title="Delete User Permanently" @click="deleteUser(user)">
                    <span class="material-symbols-outlined">delete_forever</span>
                  </button>
                  <button class="row-btn" style="background:rgba(251,146,60,.1);color:#f97316"
                    title="Manage User Content" @click="openContentPanel(user)">
                    <span class="material-symbols-outlined">manage_accounts</span>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!filteredUsers.length">
              <td colspan="6" class="table-empty">
                <span class="material-symbols-outlined" style="font-size:28px;opacity:.3">group</span>
                <span>No users found</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="table-pagination">
        <p class="pagination-info">
          Showing {{ users.length }} of {{ totalUsers }} user{{ totalUsers !== 1 ? 's' : '' }}
          <span v-if="totalPages > 1"> · Page {{ currentPage }} of {{ totalPages }}</span>
        </p>
        <div class="pagination-btns">
          <button class="page-btn" :disabled="currentPage <= 1" @click="goToPage(currentPage - 1)">
            <span class="material-symbols-outlined">chevron_left</span>
          </button>
          <button v-for="p in visiblePages" :key="p" class="page-btn" :class="{ active: p === currentPage }" @click="goToPage(p)">{{ p }}</button>
          <button class="page-btn" :disabled="currentPage >= totalPages" @click="goToPage(currentPage + 1)">
            <span class="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Content Management Modal -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="contentPanel.show" class="modal-overlay" @click.self="contentPanel.show = false">
        <div class="content-modal">
          <div class="cm-header">
            <div>
              <h3 class="cm-title">Content Management</h3>
              <p class="cm-sub">{{ contentPanel.user?.name }}</p>
            </div>
            <button class="cm-close" @click="contentPanel.show = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="cm-body">
            <div v-if="contentPanel.loading" class="cm-loading">Loading content…</div>
            <template v-else>
              <div class="cm-section">
                <h4 class="cm-section-title">
                  <span class="material-symbols-outlined">article</span>
                  Posts ({{ contentPanel.posts.length }})
                </h4>
                <div v-if="!contentPanel.posts.length" class="cm-empty">No posts</div>
                <div v-for="post in contentPanel.posts" :key="post.id" class="cm-item">
                  <div class="cm-item-info">
                    <span class="cm-item-text">{{ post.content?.slice(0,80) || 'No text' }}</span>
                    <span class="cm-item-meta">{{ formatDate(post.created_at) }}</span>
                  </div>
                  <button class="cm-del-btn" @click="deleteContent('post', post.id)" title="Delete post">
                    <span class="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
              <div class="cm-section">
                <h4 class="cm-section-title">
                  <span class="material-symbols-outlined">folder</span>
                  Projects ({{ contentPanel.projects.length }})
                </h4>
                <div v-if="!contentPanel.projects.length" class="cm-empty">No projects</div>
                <div v-for="proj in contentPanel.projects" :key="proj.id" class="cm-item">
                  <div class="cm-item-info">
                    <span class="cm-item-text">{{ proj.title }}</span>
                    <span class="cm-item-meta">{{ proj.status }}</span>
                  </div>
                  <button class="cm-del-btn" @click="deleteContent('project', proj.id)" title="Delete project">
                    <span class="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
              <div class="cm-section">
                <h4 class="cm-section-title">
                  <span class="material-symbols-outlined">work</span>
                  Job Postings ({{ contentPanel.jobs.length }})
                </h4>
                <div v-if="!contentPanel.jobs.length" class="cm-empty">No job postings</div>
                <div v-for="job in contentPanel.jobs" :key="job.id" class="cm-item">
                  <div class="cm-item-info">
                    <span class="cm-item-text">{{ job.title }}</span>
                    <span class="cm-item-meta">{{ job.status }}</span>
                  </div>
                  <button class="cm-del-btn" @click="deleteContent('job', job.id)" title="Delete job">
                    <span class="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            </template>
          </div>
          <div class="cm-footer">
            <button class="cm-danger-btn" @click="deleteAllContent(contentPanel.user)">
              <span class="material-symbols-outlined">delete_sweep</span>
              Delete ALL Content
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { adminService } from '@/services/admin.service'
import http from '@/services/http'
import { useUiStore } from '@/store/ui'

const router   = useRouter()
const uiStore  = useUiStore()

const activeTab    = ref('all')
const roleFilter   = ref('')
const statusFilter = ref('')
const searchQuery  = ref('')
const loading      = ref(false)

const tabs = [
  { value: 'all',          label: 'All Users',            badge: null },
  { value: 'verification', label: 'Verification Approval', badge: null },
  { value: 'suspended',    label: 'Suspended',             badge: null },
  { value: 'permissions',  label: 'Permissions',           badge: null },
]

const userStats = ref([
  { icon: 'group',          label: 'Total Users',     value: '0', color: 'var(--on-primary-fixed)', bg: 'var(--primary-fixed)' },
  { icon: 'verified_user',  label: 'Verified Pros',   value: '0', color: 'var(--primary)',          bg: 'var(--surface-container-high)' },
  { icon: 'pending_actions',label: 'Pending Review',  value: '0', color: 'var(--tertiary)',          bg: 'var(--tertiary-fixed)',        valueColor: 'var(--tertiary)' },
  { icon: 'block',          label: 'Suspended',       value: '0', color: 'var(--on-error-container)',bg: 'var(--error-container)',       valueColor: 'var(--error)' },
])

const users = ref([])
const totalUsers = ref(0)
const currentPage = ref(1)
const totalPages  = ref(1)
const PAGE_SIZE   = 50

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end   = Math.min(totalPages.value, start + 4)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

async function fetchUsers() {
  loading.value = true
  try {
    const status = activeTab.value === 'suspended' ? 'suspended' : statusFilter.value || undefined
    const { users: data, total, pages } = await adminService.listUsers({
      search: searchQuery.value || undefined,
      role: roleFilter.value || undefined,
      status,
      page: currentPage.value,
      limit: PAGE_SIZE,
    })
    users.value = data.map(u => ({
      id: u.id,
      name: u.full_name || u.username || u.email,
      email: u.email,
      username: u.username,
      role: u.role || 'developer',
      is_verified: u.is_verified || false,
      joined: new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      skillDots: [],
      status: u.status || 'active',
      statusLabel: u.status === 'active' ? 'Active' : u.status === 'suspended' ? 'Suspended' : 'Pending',
    }))
    totalUsers.value = total || 0
    totalPages.value = pages || Math.ceil((total || 0) / PAGE_SIZE) || 1
    userStats.value[0].value = String(total || 0)
  } catch (err) {
    console.error('Failed to fetch users:', err)
  } finally {
    loading.value = false
  }
}

function goToPage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  fetchUsers()
}

onMounted(fetchUsers)
watch([activeTab, roleFilter, statusFilter, searchQuery], () => {
  currentPage.value = 1
  fetchUsers()
})

const filteredUsers = computed(() => {
  let list = users.value
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
  }
  if (roleFilter.value)   list = list.filter(u => u.role.toLowerCase().includes(roleFilter.value))
  if (statusFilter.value) list = list.filter(u => u.status === statusFilter.value)
  if (activeTab.value === 'suspended') list = list.filter(u => u.status === 'suspended')
  if (activeTab.value === 'verification') list = list.filter(u => u.status === 'pending')
  return list
})

function statusDotClass(status) {
  return { 'dot-green': status === 'active', 'dot-warning': status === 'pending', 'dot-error': status === 'suspended' }
}

function statusTextClass(status) {
  return { 'text-active': status === 'active', 'text-pending': status === 'pending', 'text-error': status === 'suspended' }
}

async function toggleVerified(user) {
  const newState = !user.is_verified
  const action = newState ? 'Grant verified badge to' : 'Remove verified badge from'
  if (!confirm(`${action} ${user.name}?`)) return
  try {
    await http.patch(`/admin/users/${user.id}/verify`, { is_verified: newState })
    user.is_verified = newState
    uiStore.showSuccess(newState ? `Verified badge granted to ${user.name}` : `Verified badge removed from ${user.name}`)
  } catch {
    uiStore.showError('Failed to update verification status')
  }
}

async function toggleSuspend(user) {
  if (user.status === 'suspended') {
    try {
      await adminService.reinstateUser(user.id)
      user.status = 'active'
      user.statusLabel = 'Active'
    } catch (err) {
      console.error('Failed to reinstate user:', err)
    }
    return
  }
  const options = ['1 hour', '6 hours', '12 hours', '24 hours', '3 days', '7 days', '30 days', 'Indefinite']
  const hoursMap = { '1 hour': 1, '6 hours': 6, '12 hours': 12, '24 hours': 24, '3 days': 72, '7 days': 168, '30 days': 720, 'Indefinite': 0 }
  const choice = prompt(`Suspend ${user.name}?\n\nChoose duration:\n${options.map((o, i) => `${i+1}. ${o}`).join('\n')}\n\nEnter number (1-${options.length}):`)
  if (!choice) return
  const idx = parseInt(choice) - 1
  if (isNaN(idx) || idx < 0 || idx >= options.length) return
  const label = options[idx]
  const hours = hoursMap[label]
  const reason = prompt(`Reason for suspension (optional):`) || ''
  try {
    await adminService.suspendUser(user.id, hours, reason)
    user.status = 'suspended'
    user.statusLabel = hours > 0 ? `Suspended (${label})` : 'Suspended (Indefinite)'
    if (hours === 0) {
      users.value = users.value.filter(u => u.id !== user.id)
      alert(`${user.name} has been permanently suspended and all their content deleted.`)
    } else {
      alert(`${user.name} has been suspended for ${label}.`)
    }
  } catch (err) {
    console.error('Failed to suspend user:', err)
  }
}

async function deleteUser(user) {
  if (!confirm(`PERMANENTLY DELETE ${user.name}?\n\nThis will delete their account AND all their posts, projects, and jobs. This cannot be undone.`)) return
  try {
    await http.request({ method: 'DELETE', url: `/admin/users/${user.id}/delete` })
    users.value = users.value.filter(u => u.id !== user.id)
    alert(`${user.name} has been permanently deleted.`)
  } catch (err) {
    alert('Failed to delete user: ' + (err.response?.data?.detail || err.message))
  }
}

function viewUserProfile(user) {
  if (user.id) router.push(`/developer/${user.id}`)
}

const contentPanel = ref({ show: false, user: null, loading: false, posts: [], projects: [], jobs: [] })

async function openContentPanel(user) {
  contentPanel.value = { show: true, user, loading: true, posts: [], projects: [], jobs: [] }
  try {
    const feedData = await http.get(`/feed?feed_type=user&user_id=${user.id}&limit=50`)
    contentPanel.value.posts = feedData.posts || []
    const projData = await http.get(`/projects?limit=50`)
    contentPanel.value.projects = (projData.projects || []).filter(p => p.author_id === user.id)
    const jobData = await http.get(`/jobs?limit=50`)
    contentPanel.value.jobs = (jobData.jobs || []).filter(j => j.poster_name === user.name)
  } catch (err) {
    console.error('Failed to load user content:', err)
  } finally {
    contentPanel.value.loading = false
  }
}

async function deleteContent(type, id) {
  if (!confirm(`Delete this ${type}?`)) return
  try {
    await http.request({ method: 'DELETE', url: `/admin/content/${type}/${id}` })
    if (type === 'post') contentPanel.value.posts = contentPanel.value.posts.filter(p => p.id !== id)
    if (type === 'project') contentPanel.value.projects = contentPanel.value.projects.filter(p => p.id !== id)
    if (type === 'job') contentPanel.value.jobs = contentPanel.value.jobs.filter(j => j.id !== id)
  } catch (err) {
    alert('Failed to delete: ' + (err.response?.data?.detail || err.message))
  }
}

async function deleteAllContent(user) {
  if (!confirm(`Delete ALL content from ${user.name}? (posts, projects, jobs)`)) return
  const ids = {
    posts: contentPanel.value.posts.map(p => p.id),
    projects: contentPanel.value.projects.map(p => p.id),
    jobs: contentPanel.value.jobs.map(j => j.id),
  }
  try {
    for (const id of ids.posts) await http.request({ method: 'DELETE', url: `/admin/content/post/${id}` })
    for (const id of ids.projects) await http.request({ method: 'DELETE', url: `/admin/content/project/${id}` })
    for (const id of ids.jobs) await http.request({ method: 'DELETE', url: `/admin/content/job/${id}` })
    contentPanel.value.posts = []
    contentPanel.value.projects = []
    contentPanel.value.jobs = []
    alert('All content deleted.')
  } catch (err) {
    alert('Some deletions failed: ' + (err.response?.data?.detail || err.message))
  }
}

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<style scoped>
/* ═══════════════════════════════════════════════
   Admin Users — Premium Redesign
   ═══════════════════════════════════════════════ */
.admin-users-view {
  display: flex; flex-direction: column; gap: 1.25rem;
  padding: 1.5rem; min-height: 100%;
  animation: fadeInUp 0.35s ease forwards;
}
@media (min-width: 768px) { .admin-users-view { padding: 2rem 2rem 2.5rem; } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

/* ── Page Header ── */
.page-header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
.page-header-left { display: flex; align-items: center; gap: 0.875rem; }
.page-header-icon {
  width: 46px; height: 46px; border-radius: 13px; flex-shrink: 0;
  background: linear-gradient(135deg, rgba(99,14,212,.15), rgba(99,14,212,.08));
  border: 1px solid rgba(99,14,212,.2);
  display: flex; align-items: center; justify-content: center; color: var(--primary);
}
.page-header-icon .material-symbols-outlined { font-size: 22px; }
.page-title { font-family: var(--font-headline); font-size: 1.4rem; font-weight: 800; color: var(--on-surface); letter-spacing: -.02em; margin: 0; }
.page-sub { font-size: .82rem; color: var(--on-surface-variant); margin: .1rem 0 0; }
.header-actions { display: flex; gap: .5rem; flex-wrap: wrap; align-items: center; }

.btn-primary {
  display: inline-flex; align-items: center; gap: .375rem;
  padding: .55rem 1.125rem; border-radius: var(--radius-lg);
  background: var(--gradient-primary); color: white; border: none;
  font-family: var(--font-headline); font-size: .8125rem; font-weight: 700;
  cursor: pointer; transition: opacity .15s, transform .15s, box-shadow .15s;
  box-shadow: var(--shadow-primary);
}
.btn-primary:hover { opacity: .9; transform: translateY(-1px); }
.btn-primary .material-symbols-outlined { font-size: 17px; }

.btn-outline {
  display: inline-flex; align-items: center; gap: .375rem;
  padding: .55rem 1.125rem; border-radius: var(--radius-lg);
  background: var(--surface-container-lowest); border: 1.5px solid var(--outline-variant);
  font-family: var(--font-headline); font-size: .8125rem; font-weight: 600;
  color: var(--on-surface); cursor: pointer; transition: border-color .15s, color .15s;
}
.btn-outline:hover { border-color: var(--primary); color: var(--primary); }
.btn-outline .material-symbols-outlined { font-size: 17px; }

/* ── Stats ── */
.user-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: .875rem; }
@media (min-width: 768px) { .user-stats { grid-template-columns: repeat(4, 1fr); } }

.user-stat-card {
  display: flex; align-items: center; gap: .75rem;
  padding: 1rem 1.125rem;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant); border-radius: var(--radius-xl);
  position: relative; overflow: hidden;
  transition: transform .2s, box-shadow .2s;
}
.user-stat-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: var(--gradient-primary); border-radius: var(--radius-xl) var(--radius-xl) 0 0;
}
.user-stat-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
.ustat-icon-wrap { width: 42px; height: 42px; border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ustat-icon { font-size: 20px; }
.ustat-label { font-size: .67rem; font-family: var(--font-headline); font-weight: 700; color: var(--on-surface-variant); text-transform: uppercase; letter-spacing: .07em; }
.ustat-value { font-family: var(--font-headline); font-size: 1.5rem; font-weight: 800; color: var(--on-surface); letter-spacing: -.03em; line-height: 1; margin-top: .2rem; }

/* ── Tabs ── */
.user-tabs { display: flex; gap: 0; border-bottom: 1px solid var(--outline-variant); overflow-x: auto; scrollbar-width: none; }
.user-tabs::-webkit-scrollbar { display: none; }
.user-tab {
  display: flex; align-items: center; gap: .3rem;
  padding: .625rem 1rem; background: none; border: none; border-bottom: 2px solid transparent;
  font-family: var(--font-headline); font-size: .875rem; font-weight: 500;
  color: var(--on-surface-variant); cursor: pointer; white-space: nowrap;
  transition: color .15s, border-color .15s; margin-bottom: -1px; flex-shrink: 0;
}
.user-tab:hover { color: var(--primary); }
.user-tab.active { color: var(--primary); border-bottom-color: var(--primary); font-weight: 700; }
.tab-badge {
  min-width: 17px; height: 17px; border-radius: var(--radius-full);
  background: var(--tertiary); color: var(--on-tertiary);
  font-size: .6rem; font-weight: 700; display: flex; align-items: center; justify-content: center; padding: 0 3px;
}

/* ── Filters ── */
.user-filters { display: flex; align-items: center; justify-content: space-between; gap: .75rem; flex-wrap: wrap; }
.filters-left { display: flex; gap: .5rem; flex-wrap: wrap; }

.filter-select {
  appearance: none; -webkit-appearance: none;
  padding: .45rem 1.875rem .45rem .75rem;
  background: var(--surface-container-low)
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237b7487' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")
    no-repeat right .6rem center / 12px;
  border: 1.5px solid var(--outline-variant); border-radius: var(--radius-full);
  font-family: var(--font-headline); font-size: .8rem; font-weight: 500;
  color: var(--on-surface); outline: none; cursor: pointer;
  transition: border-color .15s, box-shadow .15s;
}
.filter-select:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(99,14,212,.1); }
[data-theme="dark"] .filter-select {
  background-color: var(--surface-container);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23a0a0bc' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
}

.search-wrap { position: relative; width: 100%; max-width: 300px; }
.search-icon { position: absolute; left: .75rem; top: 50%; transform: translateY(-50%); font-size: 16px; color: var(--on-surface-variant); pointer-events: none; }
.search-input {
  width: 100%; padding: .45rem .875rem .45rem 2.375rem;
  background: var(--surface-container-low); border: 1.5px solid var(--outline-variant);
  border-radius: var(--radius-full);
  font-family: var(--font-body); font-size: .875rem; color: var(--on-surface); outline: none;
  transition: border-color .15s, box-shadow .15s;
}
.search-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(99,14,212,.1); background: var(--surface-container-lowest); }
.search-input::placeholder { color: var(--on-surface-variant); }

/* ── Table Card ── */
.table-card { background: var(--surface-container-lowest); border: 1px solid var(--outline-variant); border-radius: var(--radius-xl); overflow: hidden; }
.table-scroll { overflow-x: auto; }
.users-table { width: 100%; border-collapse: collapse; min-width: 620px; }
.users-table thead tr { background: var(--surface-container); }
.users-table th {
  padding: .625rem 1.125rem; font-family: var(--font-headline); font-size: .65rem;
  font-weight: 700; color: var(--on-surface-variant); text-align: left;
  text-transform: uppercase; letter-spacing: .08em; white-space: nowrap;
}
.th-right { text-align: right; }
.user-row { border-bottom: 1px solid var(--outline-variant); transition: background .12s; }
.user-row:hover { background: rgba(99,14,212,.03); }
[data-theme="dark"] .user-row:hover { background: rgba(168,85,247,.05); }
.user-row:last-child { border-bottom: none; }
.users-table td { padding: .8rem 1.125rem; vertical-align: middle; }

.user-cell { display: flex; align-items: center; gap: .625rem; }
.user-avatar {
  width: 36px; height: 36px; border-radius: var(--radius-md);
  background: linear-gradient(135deg, rgba(99,14,212,.12), rgba(124,58,237,.2));
  border: 1.5px solid rgba(99,14,212,.18); color: var(--primary);
  font-family: var(--font-headline); font-size: .82rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
[data-theme="dark"] .user-avatar { background: linear-gradient(135deg, rgba(168,85,247,.15), rgba(124,58,237,.2)); border-color: rgba(168,85,247,.25); }
.user-avatar.suspended { filter: grayscale(1); opacity: .5; }
.user-name { font-family: var(--font-headline); font-size: .875rem; font-weight: 700; color: var(--on-surface); }
.user-name.line-through { text-decoration: line-through; opacity: .6; }
.user-email { font-size: .72rem; color: var(--on-surface-variant); margin-top: .1rem; }

.role-chip {
  display: inline-flex; padding: .175rem .55rem;
  background: rgba(99,14,212,.08); color: var(--primary);
  border-radius: var(--radius-full); font-family: var(--font-headline);
  font-size: .7rem; font-weight: 600; text-transform: capitalize;
  border: 1px solid rgba(99,14,212,.15);
}
[data-theme="dark"] .role-chip { background: rgba(168,85,247,.1); border-color: rgba(168,85,247,.2); }

.cell-muted { font-size: .8rem; color: var(--on-surface-variant); }
.skill-dots { display: flex; gap: 3px; }
.skill-dot { width: 7px; height: 7px; border-radius: 50%; }
.skill-dot.active { background: var(--primary); }
.skill-dot.inactive { background: var(--outline-variant); }

.status-cell { display: flex; align-items: center; gap: .35rem; font-size: .8rem; font-family: var(--font-headline); font-weight: 500; }
.status-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.dot-green { background: #16a34a; box-shadow: 0 0 4px rgba(22,163,74,.5); }
.dot-warning { background: #f59e0b; }
.dot-error { background: var(--error); }
.text-active { color: #16a34a; }
.text-pending { color: #f59e0b; }
.text-error { color: var(--error); }

.row-actions { display: flex; align-items: center; justify-content: flex-end; gap: .375rem; flex-wrap: nowrap; }
.row-btn {
  width: 30px; height: 30px; border-radius: var(--radius-md); border: none;
  background: var(--surface-container); color: var(--on-surface-variant);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all .15s; flex-shrink: 0;
}
.row-btn .material-symbols-outlined { font-size: 16px; }
.row-btn:hover { background: var(--surface-container-high); color: var(--on-surface); }
.row-btn.view { background: rgba(99,14,212,.08); color: var(--primary); }
.row-btn.view:hover { background: rgba(99,14,212,.16); }
.row-btn.warn { background: rgba(245,158,11,.1); color: #f59e0b; }
.row-btn.warn:hover { background: rgba(245,158,11,.18); }
.row-btn.danger { background: rgba(239,68,68,.1); color: #ef4444; }
.row-btn.danger:hover { background: rgba(239,68,68,.18); }

.table-empty {
  padding: 2.5rem; text-align: center; color: var(--on-surface-variant);
  display: flex; align-items: center; justify-content: center; gap: .5rem; font-size: .875rem;
}

/* ── Pagination ── */
.table-pagination {
  display: flex; align-items: center; justify-content: space-between;
  padding: .875rem 1.125rem; border-top: 1px solid var(--outline-variant);
  flex-wrap: wrap; gap: .625rem;
}
.pagination-info { font-family: var(--font-headline); font-size: .78rem; color: var(--on-surface-variant); }
.pagination-btns { display: flex; gap: .25rem; }
.page-btn {
  min-width: 32px; height: 32px; border-radius: var(--radius-md); border: 1.5px solid var(--outline-variant);
  background: var(--surface-container-lowest); color: var(--on-surface-variant);
  font-family: var(--font-headline); font-size: .8rem; font-weight: 600;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all .15s; padding: 0 .35rem;
}
.page-btn .material-symbols-outlined { font-size: 17px; }
.page-btn:hover:not(:disabled) { border-color: var(--primary); color: var(--primary); background: rgba(99,14,212,.05); }
.page-btn.active { background: var(--gradient-primary); color: white; border-color: transparent; box-shadow: var(--shadow-primary); }
.page-btn:disabled { opacity: .35; cursor: not-allowed; }

/* ── Content Modal ── */
.modal-overlay {
  position: fixed; inset: 0; z-index: 600;
  background: rgba(0,0,0,.55); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; padding: 1rem;
}
.content-modal {
  background: var(--surface-container-lowest); border: 1px solid var(--outline-variant);
  border-radius: var(--radius-2xl); width: 100%; max-width: 520px;
  max-height: 85vh; display: flex; flex-direction: column;
  box-shadow: var(--shadow-lg);
}
.cm-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--outline-variant);
  flex-shrink: 0;
}
.cm-title { font-family: var(--font-headline); font-size: 1rem; font-weight: 800; color: var(--on-surface); }
.cm-sub { font-size: .8rem; color: var(--on-surface-variant); margin-top: .15rem; }
.cm-close {
  width: 30px; height: 30px; border-radius: var(--radius-md);
  background: var(--surface-container); border: none; cursor: pointer; color: var(--on-surface-variant);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.cm-close:hover { background: var(--surface-container-high); color: var(--on-surface); }
.cm-close .material-symbols-outlined { font-size: 17px; }
.cm-body { overflow-y: auto; flex: 1; padding: 1.125rem 1.5rem; display: flex; flex-direction: column; gap: 1.125rem; }
.cm-loading { text-align: center; color: var(--on-surface-variant); padding: 2rem; font-size: .875rem; }
.cm-section { display: flex; flex-direction: column; gap: .5rem; }
.cm-section-title {
  display: flex; align-items: center; gap: .375rem;
  font-family: var(--font-headline); font-size: .82rem; font-weight: 700; color: var(--on-surface);
  padding-bottom: .5rem; border-bottom: 1px solid var(--outline-variant);
}
.cm-section-title .material-symbols-outlined { font-size: 16px; color: var(--primary); }
.cm-empty { font-size: .78rem; color: var(--on-surface-variant); padding: .5rem 0; font-style: italic; }
.cm-item {
  display: flex; align-items: center; justify-content: space-between; gap: .75rem;
  padding: .5rem .625rem; border-radius: var(--radius-lg);
  background: var(--surface-container-low); border: 1px solid var(--outline-variant);
}
.cm-item-info { flex: 1; min-width: 0; }
.cm-item-text { font-size: .8rem; color: var(--on-surface); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
.cm-item-meta { font-size: .7rem; color: var(--on-surface-variant); margin-top: .1rem; display: block; }
.cm-del-btn {
  width: 26px; height: 26px; border-radius: var(--radius-md); border: none;
  background: rgba(239,68,68,.1); color: #ef4444; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
}
.cm-del-btn:hover { background: rgba(239,68,68,.2); }
.cm-del-btn .material-symbols-outlined { font-size: 15px; }
.cm-footer { padding: .875rem 1.5rem; border-top: 1px solid var(--outline-variant); flex-shrink: 0; }
.cm-danger-btn {
  display: inline-flex; align-items: center; gap: .375rem;
  padding: .55rem 1.125rem; border-radius: var(--radius-lg);
  background: rgba(239,68,68,.1); border: 1.5px solid rgba(239,68,68,.25);
  color: #ef4444; font-family: var(--font-headline); font-size: .82rem; font-weight: 700; cursor: pointer;
  transition: all .15s;
}
.cm-danger-btn:hover { background: rgba(239,68,68,.18); border-color: #ef4444; }
.cm-danger-btn .material-symbols-outlined { font-size: 17px; }
.modal-enter-active { transition: all .25s ease; }
.modal-leave-active { transition: all .2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(.97) translateY(8px); }
</style>
