<template>
  <div class="admin-users-view">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="text-headline-lg">User Management</h1>
        <p class="text-body-md" style="margin-top:0.25rem">Oversee the global ecosystem of developers and clients.</p>
      </div>
      <div class="header-actions">
        <button class="btn-primary">
          <span class="material-symbols-outlined" style="font-size:18px">person_add</span>
          Invite User
        </button>
        <button class="btn-outline">
          <span class="material-symbols-outlined" style="font-size:18px">download</span>
          Export Data
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="user-stats">
      <div v-for="stat in userStats" :key="stat.label" class="user-stat-card glass-card-static">
        <div class="ustat-icon-wrap" :style="{ background: stat.bg }">
          <span class="material-symbols-outlined ustat-icon" :style="{ color: stat.color }">{{ stat.icon }}</span>
        </div>
        <div>
          <p class="ustat-label">{{ stat.label }}</p>
          <h4 class="ustat-value" :style="stat.valueColor ? { color: stat.valueColor } : {}">{{ stat.value }}</h4>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="user-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        class="user-tab"
        :class="{ active: activeTab === tab.value }"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
        <span v-if="tab.badge" class="tab-badge">{{ tab.badge }}</span>
      </button>
    </div>

    <!-- Filters -->
    <div class="user-filters">
      <div class="filter-selects">
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
        <input v-model="searchQuery" class="search-input" placeholder="Search by name, email, or ID..." />
      </div>
    </div>

    <!-- Table -->
    <div class="glass-card-static users-table-card">
      <div class="users-table-wrap">
        <table class="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Skill Tests</th>
              <th>Status</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id" class="user-row">
              <td>
                <div class="user-cell">
                  <div class="user-cell-avatar" :class="{ suspended: user.status === 'suspended' }">
                    {{ user.name[0] }}
                  </div>
                  <div>
                    <p class="user-cell-name" :class="{ 'line-through': user.status === 'suspended' }">{{ user.name }}</p>
                    <p class="user-cell-email">{{ user.email }}</p>
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
                  <button class="row-action-btn view" title="View Profile"
                    @click="viewUserProfile(user)">
                    <span class="material-symbols-outlined">visibility</span>
                  </button>
                  <button class="row-action-btn" :class="user.status === 'suspended' ? 'edit' : 'danger'"
                    :title="user.status === 'suspended' ? 'Lift Suspension' : 'Suspend User'"
                    @click="toggleSuspend(user)">
                    <span class="material-symbols-outlined">{{ user.status === 'suspended' ? 'lock_open' : 'block' }}</span>
                  </button>
                  <button class="row-action-btn" style="background:rgba(239,68,68,.12);color:#ef4444"
                    title="Delete User Permanently" @click="deleteUser(user)">
                    <span class="material-symbols-outlined">delete_forever</span>
                  </button>
                  <button class="row-action-btn" style="background:rgba(251,146,60,.1);color:#f97316"
                    title="Manage User Content" @click="openContentPanel(user)">
                    <span class="material-symbols-outlined">manage_accounts</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="table-pagination">
        <p class="pagination-info">Showing {{ filteredUsers.length }} user{{ filteredUsers.length !== 1 ? 's' : '' }}</p>
        <div class="pagination-btns">
          <button class="page-btn" disabled>
            <span class="material-symbols-outlined">chevron_left</span>
          </button>
          <button v-for="p in [1,2,3]" :key="p" class="page-btn" :class="{ active: p === 1 }">{{ p }}</button>
          <button class="page-btn">
            <span class="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Content Management Modal — must be inside <template> -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="contentPanel.show" class="modal-overlay" @click.self="contentPanel.show = false">
      <div class="content-modal">
        <div class="cm-header">
          <div>
            <h3 class="cm-title">Content Management</h3>
            <p class="cm-sub">{{ contentPanel.user?.name }}</p>
          </div>
          <button class="icon-close" @click="contentPanel.show = false">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="cm-body">
          <!-- Loading -->
          <div v-if="contentPanel.loading" class="cm-loading">Loading content…</div>

          <template v-else>
            <!-- Posts section -->
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

            <!-- Projects section -->
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

            <!-- Jobs section -->
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

const router = useRouter()

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

async function fetchUsers() {
  loading.value = true
  try {
    const status = activeTab.value === 'suspended' ? 'suspended' : statusFilter.value || undefined
    const { users: data, total } = await adminService.listUsers({
      search: searchQuery.value || undefined,
      role: roleFilter.value || undefined,
      status,
    })
    users.value = data.map(u => ({
      id: u.id,
      name: u.full_name || u.email,
      email: u.email,
      role: u.role || 'developer',
      joined: new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      skillDots: [],
      status: u.status || 'active',
      statusLabel: u.status === 'active' ? 'Active' : u.status === 'suspended' ? 'Suspended' : 'Pending',
    }))
    totalUsers.value = total

    userStats.value[0].value = String(total)
  } catch (err) {
    console.error('Failed to fetch users:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchUsers)
watch([activeTab, roleFilter, statusFilter, searchQuery], fetchUsers)

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
  return { 'status-dot-green': status === 'active', 'status-dot-warning': status === 'pending', 'status-dot-error': status === 'suspended' }
}

function statusTextClass(status) {
  return { 'text-active': status === 'active', 'text-pending': status === 'pending', 'text-error': status === 'suspended' }
}

async function toggleSuspend(user) {
  if (user.status === 'suspended') {
    // Reinstate immediately
    try {
      await adminService.reinstateUser(user.id)
      user.status = 'active'
      user.statusLabel = 'Active'
    } catch (err) {
      console.error('Failed to reinstate user:', err)
    }
    return
  }

  // Show timed suspension dialog
  const options = [
    '1 hour', '6 hours', '12 hours', '24 hours',
    '3 days', '7 days', '30 days', 'Indefinite'
  ]
  const hoursMap = {
    '1 hour': 1, '6 hours': 6, '12 hours': 12, '24 hours': 24,
    '3 days': 72, '7 days': 168, '30 days': 720, 'Indefinite': 0
  }

  const choice = prompt(
    `Suspend ${user.name}?\n\nChoose duration:\n${options.map((o, i) => `${i+1}. ${o}`).join('\n')}\n\nEnter number (1-${options.length}):`
  )
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
      // Remove from local list — all content deleted
      users.value = users.value.filter(u => u.id !== user.id)
      alert(`${user.name} has been permanently suspended and all their content deleted.`)
    } else {
      alert(`${user.name} has been suspended for ${label}.`)
    }
  } catch (err) {
    console.error('Failed to suspend user:', err)
  }
}

// ── Delete user permanently ────────────────────────────────────────────────
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

// ── View user profile ──────────────────────────────────────────────────────
function viewUserProfile(user) {
  if (user.id) router.push(`/developer/${user.id}`)
}

// ── Content management panel ───────────────────────────────────────────────
const contentPanel = ref({ show: false, user: null, loading: false, posts: [], projects: [], jobs: [] })

async function openContentPanel(user) {
  contentPanel.value = { show: true, user, loading: true, posts: [], projects: [], jobs: [] }
  try {
    // Fetch posts
    const feedData = await http.get(`/feed?feed_type=user&user_id=${user.id}&limit=50`)
    contentPanel.value.posts = feedData.posts || []
    // Fetch projects
    const projData = await http.get(`/projects?limit=50`)
    contentPanel.value.projects = (projData.projects || []).filter(p => p.author_id === user.id)
    // Fetch jobs
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
.admin-users-view { display: flex; flex-direction: column; gap: 1.25rem; background: var(--background); min-height: 100vh; padding: 1.5rem; }

.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
.header-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }

/* Stats */
.user-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
@media (min-width: 768px) { .user-stats { grid-template-columns: repeat(4, 1fr); } }

.user-stat-card { display: flex; align-items: center; gap: 0.75rem; padding: 1rem; border-radius: var(--radius-xl); }

.ustat-icon-wrap { width: 42px; height: 42px; border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ustat-icon { font-size: 22px; }
.ustat-label { font-size: 0.7rem; color: var(--on-surface-variant); font-family: var(--font-headline); margin-bottom: 0.15rem; }
.ustat-value { font-family: var(--font-headline); font-size: 1.2rem; font-weight: 700; color: var(--on-surface); line-height: 1.2; }

/* Tabs */
.user-tabs { display: flex; gap: 0.25rem; border-bottom: 1px solid var(--outline-variant); overflow-x: auto; scrollbar-width: none; }
.user-tabs::-webkit-scrollbar { display: none; }

.user-tab {
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0.625rem 1rem;
  background: none; border: none; border-bottom: 2px solid transparent;
  font-family: var(--font-headline); font-size: 0.875rem; font-weight: 500;
  color: var(--on-surface-variant); cursor: pointer; white-space: nowrap;
  transition: all 0.15s ease; margin-bottom: -1px;
}
.user-tab:hover { color: var(--primary); }
.user-tab.active { color: var(--primary); border-bottom-color: var(--primary); }

.tab-badge {
  min-width: 18px; height: 18px; border-radius: var(--radius-full);
  background: var(--tertiary); color: var(--on-tertiary);
  font-size: 0.65rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center; padding: 0 4px;
}

/* Filters */
.user-filters { display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }

.filter-selects { display: flex; gap: 0.75rem; flex-wrap: wrap; }

.filter-select {
  padding: 0.5rem 0.875rem;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-lg);
  font-family: var(--font-headline); font-size: 0.875rem;
  color: var(--on-surface); outline: none; cursor: pointer;
}

.search-wrap { position: relative; width: 100%; max-width: 320px; }
.search-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); font-size: 18px; color: var(--outline); pointer-events: none; }
.search-input {
  width: 100%; padding: 0.5rem 0.875rem 0.5rem 2.5rem;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant); border-radius: var(--radius-lg);
  font-family: var(--font-body); font-size: 0.875rem; color: var(--on-surface); outline: none;
}
.search-input:focus { border-color: var(--primary); }

/* Table */
.users-table-card { padding: 0; overflow: hidden; border-radius: var(--radius-xl); }
.users-table-wrap { overflow-x: auto; }

.users-table { width: 100%; border-collapse: collapse; }

.users-table thead tr { background: rgba(240,243,255,0.5); }

.users-table th {
  padding: 0.75rem 1.25rem;
  font-family: var(--font-headline); font-size: 0.7rem; font-weight: 700;
  color: var(--on-surface-variant); text-align: left;
  text-transform: uppercase; letter-spacing: 0.06em;
}

.users-table .text-right { text-align: right; }

.user-row { border-bottom: 1px solid var(--outline-variant); transition: background 0.15s ease; }
.user-row:hover { background: rgba(168,85,247,0.03); }
.user-row:last-child { border-bottom: none; }

.users-table td { padding: 0.875rem 1.25rem; }

.user-cell { display: flex; align-items: center; gap: 0.75rem; }

.user-cell-avatar {
  width: 40px; height: 40px; border-radius: var(--radius-lg);
  background: var(--primary-fixed); color: var(--primary);
  font-family: var(--font-headline); font-size: 0.875rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}

.user-cell-avatar.suspended { filter: grayscale(1); opacity: 0.6; }

.user-cell-name { font-family: var(--font-headline); font-size: 0.875rem; font-weight: 700; color: var(--on-surface); }
.user-cell-name.line-through { text-decoration: line-through; }
.user-cell-email { font-size: 0.75rem; color: var(--on-surface-variant); }

.role-chip {
  display: inline-flex; padding: 0.2rem 0.625rem;
  background: var(--secondary-container); color: var(--on-secondary-container);
  border-radius: var(--radius-full); font-family: var(--font-headline); font-size: 0.75rem; font-weight: 500;
}

.cell-muted { font-size: 0.875rem; color: var(--on-surface-variant); }

.skill-dots { display: flex; gap: 4px; }
.skill-dot { width: 8px; height: 8px; border-radius: 50%; }
.skill-dot.active   { background: var(--primary); }
.skill-dot.inactive { background: var(--outline-variant); }

.status-cell { display: flex; align-items: center; gap: 0.4rem; font-size: 0.875rem; }
.status-dot-error   { background: var(--error); }
.status-dot-warning { background: #f59e0b; }
.text-active  { color: var(--primary); }
.text-pending { color: var(--tertiary); }
.text-error   { color: var(--error); }

.row-actions { display: flex; align-items: center; justify-content: flex-end; gap: 0.25rem; }

.row-action-btn {
  width: 32px; height: 32px; border-radius: var(--radius-lg);
  border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: background 0.15s ease;
}
.row-action-btn .material-symbols-outlined { font-size: 18px; }
.row-action-btn.view  { background: transparent; color: var(--primary); }
.row-action-btn.view:hover  { background: var(--primary-fixed); }
.row-action-btn.edit  { background: transparent; color: var(--primary); }
.row-action-btn.edit:hover  { background: var(--primary-fixed); }
.row-action-btn.danger { background: transparent; color: var(--error); }
.row-action-btn.danger:hover { background: var(--error-container); }

/* Pagination */
.table-pagination {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.875rem 1.25rem;
  background: rgba(240,243,255,0.3);
  border-top: 1px solid var(--outline-variant);
  flex-wrap: wrap; gap: 0.75rem;
}

.pagination-info { font-size: 0.875rem; color: var(--on-surface-variant); font-family: var(--font-headline); }

.pagination-btns { display: flex; gap: 0.375rem; }

.page-btn {
  min-width: 36px; height: 36px; padding: 0 0.5rem;
  border: 1px solid var(--outline-variant); border-radius: var(--radius-md);
  background: transparent; font-family: var(--font-headline); font-size: 0.875rem;
  color: var(--on-surface); cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: all 0.15s ease;
}
.page-btn:hover:not(:disabled) { background: var(--surface-container); }
.page-btn.active { background: var(--primary-fixed); color: var(--on-primary-fixed); border-color: transparent; font-weight: 700; }
.page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.page-btn .material-symbols-outlined { font-size: 20px; }

/* ── Content Modal ── */
.modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.55); z-index:1000; display:flex; align-items:center; justify-content:center; padding:1rem; }
.content-modal { background:var(--surface-container-lowest); border:1px solid var(--outline-variant); border-radius:var(--radius-2xl); width:100%; max-width:560px; max-height:85vh; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 16px 48px rgba(0,0,0,.4); }
.cm-header { display:flex; align-items:center; justify-content:space-between; padding:1.25rem 1.25rem .75rem; border-bottom:1px solid var(--outline-variant); flex-shrink:0; }
.cm-title { font-family:var(--font-headline); font-size:1.05rem; font-weight:700; color:var(--on-surface); margin:0; }
.cm-sub { font-size:.8rem; color:var(--on-surface-variant); margin:.15rem 0 0; }
.icon-close { width:32px; height:32px; border-radius:50%; background:var(--surface-container); border:none; display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--on-surface-variant); }
.icon-close .material-symbols-outlined { font-size:18px; }

.cm-body { flex:1; overflow-y:auto; padding:1rem 1.25rem; display:flex; flex-direction:column; gap:1.25rem; }
.cm-loading { text-align:center; color:var(--on-surface-variant); padding:2rem; font-size:.875rem; }
.cm-section { display:flex; flex-direction:column; gap:.5rem; }
.cm-section-title { display:flex; align-items:center; gap:.4rem; font-family:var(--font-headline); font-size:.85rem; font-weight:700; color:var(--on-surface); margin:0; }
.cm-section-title .material-symbols-outlined { font-size:16px; color:var(--primary); }
.cm-empty { font-size:.78rem; color:var(--on-surface-variant); padding:.4rem .5rem; }

.cm-item { display:flex; align-items:center; gap:.75rem; padding:.55rem .75rem; background:var(--surface-container-low); border-radius:var(--radius-lg); border:1px solid var(--outline-variant); }
.cm-item-info { flex:1; min-width:0; display:flex; flex-direction:column; gap:.1rem; }
.cm-item-text { font-size:.82rem; color:var(--on-surface); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.cm-item-meta { font-size:.7rem; color:var(--on-surface-variant); }
.cm-del-btn { width:28px; height:28px; border-radius:50%; background:rgba(239,68,68,.1); border:none; color:#ef4444; display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; }
.cm-del-btn:hover { background:rgba(239,68,68,.2); }
.cm-del-btn .material-symbols-outlined { font-size:16px; }

.cm-footer { padding:.875rem 1.25rem; border-top:1px solid var(--outline-variant); flex-shrink:0; }
.cm-danger-btn { display:flex; align-items:center; gap:.4rem; width:100%; padding:.65rem 1rem; background:rgba(239,68,68,.1); border:1px solid rgba(239,68,68,.3); border-radius:var(--radius-lg); color:#ef4444; font-family:var(--font-headline); font-size:.875rem; font-weight:600; cursor:pointer; justify-content:center; }
.cm-danger-btn:hover { background:rgba(239,68,68,.2); }
.cm-danger-btn .material-symbols-outlined { font-size:18px; }

.modal-enter-active, .modal-leave-active { transition:opacity .2s ease, transform .2s ease; }
.modal-enter-from, .modal-leave-to { opacity:0; transform:scale(.96); }
</style>
