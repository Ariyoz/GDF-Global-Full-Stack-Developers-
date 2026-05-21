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
                  <button class="row-action-btn view" title="View Profile">
                    <span class="material-symbols-outlined">visibility</span>
                  </button>
                  <button class="row-action-btn edit" title="Edit">
                    <span class="material-symbols-outlined">edit</span>
                  </button>
                  <button class="row-action-btn danger" :title="user.status === 'suspended' ? 'Lift Ban' : 'Suspend'">
                    <span class="material-symbols-outlined">{{ user.status === 'suspended' ? 'lock_open' : 'block' }}</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="table-pagination">
        <p class="pagination-info">Showing 1–{{ filteredUsers.length }} of 12,842 users</p>
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
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab    = ref('all')
const roleFilter   = ref('')
const statusFilter = ref('')
const searchQuery  = ref('')

const tabs = [
  { value: 'all',          label: 'All Users',            badge: null },
  { value: 'verification', label: 'Verification Approval', badge: 42 },
  { value: 'suspended',    label: 'Suspended',             badge: null },
  { value: 'permissions',  label: 'Permissions',           badge: null },
]

const userStats = [
  { icon: 'group',          label: 'Total Users',     value: '12,842', color: 'var(--on-primary-fixed)', bg: 'var(--primary-fixed)' },
  { icon: 'verified_user',  label: 'Verified Pros',   value: '4,102',  color: 'var(--primary)',          bg: 'var(--surface-container-high)' },
  { icon: 'pending_actions',label: 'Pending Review',  value: '284',    color: 'var(--tertiary)',          bg: 'var(--tertiary-fixed)',        valueColor: 'var(--tertiary)' },
  { icon: 'block',          label: 'Flagged',         value: '12',     color: 'var(--on-error-container)',bg: 'var(--error-container)',       valueColor: 'var(--error)' },
]

const users = ref([
  { id: 1, name: 'Alex Rivera',    email: 'alex.riv@gfd.dev',    role: 'Full-Stack Dev',  joined: 'Oct 12, 2023', skillDots: ['active','active','active'],   status: 'active',    statusLabel: 'Active' },
  { id: 2, name: 'Jordan Smith',   email: 'j.smith@agency.io',   role: 'Client (Pro)',    joined: 'Nov 02, 2023', skillDots: [],                             status: 'pending',   statusLabel: 'Pending Review' },
  { id: 3, name: 'Elena Petrova',  email: 'elena.p@cloud.net',   role: 'DevOps Engineer', joined: 'Aug 19, 2023', skillDots: ['active','inactive'],          status: 'suspended', statusLabel: 'Suspended' },
  { id: 4, name: 'Marcus Thorne',  email: 'm.thorne@vector.com', role: 'Backend Dev',     joined: 'Sep 05, 2023', skillDots: ['active','active'],            status: 'active',    statusLabel: 'Active' },
  { id: 5, name: 'Priya Sharma',   email: 'priya@mobile.dev',    role: 'Mobile Dev',      joined: 'Dec 01, 2023', skillDots: ['active','active','active'],   status: 'active',    statusLabel: 'Active' },
])

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
</style>
