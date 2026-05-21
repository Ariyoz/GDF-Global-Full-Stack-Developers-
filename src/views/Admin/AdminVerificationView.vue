<template>
  <div class="admin-verification-view">
    <div class="page-header">
      <div>
        <h1 class="text-headline-lg">Verification</h1>
        <p class="text-body-md" style="margin-top:0.25rem">Review and approve developer identity and credential verifications.</p>
      </div>
      <div class="header-actions">
        <select v-model="categoryFilter" class="filter-select">
          <option value="">All Categories</option>
          <option value="identity">Identity</option>
          <option value="github">GitHub</option>
          <option value="degree">Degree</option>
          <option value="employment">Employment</option>
        </select>
      </div>
    </div>

    <!-- Stats -->
    <div class="verif-stats">
      <div v-for="stat in verifStats" :key="stat.label" class="verif-stat-card glass-card-static">
        <div class="vstat-icon-wrap" :style="{ background: stat.bg }">
          <span class="material-symbols-outlined vstat-icon" :style="{ color: stat.color }">{{ stat.icon }}</span>
        </div>
        <div>
          <p class="vstat-label">{{ stat.label }}</p>
          <h4 class="vstat-value">{{ stat.value }}</h4>
        </div>
      </div>
    </div>

    <!-- Verification Queue -->
    <div class="verif-queue">
      <div v-for="item in filteredItems" :key="item.id" class="verif-card glass-card-static">
        <div class="verif-card-header">
          <div class="verif-user">
            <div class="verif-avatar">{{ item.user[0] }}</div>
            <div>
              <p class="verif-user-name">{{ item.user }}</p>
              <p class="verif-user-email">{{ item.email }}</p>
            </div>
          </div>
          <div class="verif-meta">
            <span class="verif-category-badge" :class="'cat-' + item.category">{{ item.categoryLabel }}</span>
            <span class="verif-time">{{ item.submitted }}</span>
          </div>
        </div>

        <div class="verif-details">
          <div class="verif-detail-row" v-for="detail in item.details" :key="detail.label">
            <span class="detail-label">{{ detail.label }}:</span>
            <span class="detail-value">{{ detail.value }}</span>
          </div>
        </div>

        <div v-if="item.documents.length" class="verif-documents">
          <span class="docs-label">Documents:</span>
          <div class="docs-list">
            <div v-for="doc in item.documents" :key="doc" class="doc-chip">
              <span class="material-symbols-outlined" style="font-size:14px">description</span>
              {{ doc }}
            </div>
          </div>
        </div>

        <div class="verif-actions">
          <button class="btn-primary verif-action-btn approve" @click="approveItem(item.id)">
            <span class="material-symbols-outlined" style="font-size:16px">check</span>
            Approve
          </button>
          <button class="btn-outline verif-action-btn" @click="requestMore(item.id)">
            <span class="material-symbols-outlined" style="font-size:16px">help</span>
            Request More Info
          </button>
          <button class="btn-outline verif-action-btn reject" @click="rejectItem(item.id)">
            <span class="material-symbols-outlined" style="font-size:16px">close</span>
            Reject
          </button>
        </div>
      </div>

      <div v-if="filteredItems.length === 0" class="verif-empty glass-card-static">
        <span class="material-symbols-outlined" style="font-size:3rem;color:var(--outline)">verified</span>
        <h3>Queue Empty</h3>
        <p>All verification requests have been processed.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const categoryFilter = ref('')

const verifStats = [
  { icon: 'pending',   label: 'Pending',       value: '24',  color: 'var(--tertiary)', bg: 'var(--tertiary-fixed)' },
  { icon: 'verified',  label: 'Approved (7d)', value: '89',  color: 'var(--primary)',  bg: 'var(--primary-fixed)' },
  { icon: 'cancel',    label: 'Rejected (7d)', value: '7',   color: 'var(--error)',    bg: 'var(--error-container)' },
  { icon: 'speed',     label: 'Avg Time',      value: '2.1h', color: 'var(--on-surface-variant)', bg: 'var(--surface-container-high)' },
]

const verificationItems = ref([
  {
    id: 1, user: 'Alex Rivera', email: 'alex.riv@gfd.dev', category: 'identity', categoryLabel: 'Identity',
    submitted: '2 hours ago',
    details: [
      { label: 'Full Name', value: 'Alexander James Rivera' },
      { label: 'Country', value: 'United States' },
      { label: 'ID Type', value: 'Passport' },
    ],
    documents: ['passport_scan.pdf', 'selfie_verification.jpg'],
  },
  {
    id: 2, user: 'Priya Sharma', email: 'priya@mobile.dev', category: 'github', categoryLabel: 'GitHub',
    submitted: '4 hours ago',
    details: [
      { label: 'GitHub Username', value: '@priya-codes' },
      { label: 'Repositories', value: '47 public repos' },
      { label: 'Contributions', value: '1,284 in last year' },
    ],
    documents: [],
  },
  {
    id: 3, user: 'Marcus Thorne', email: 'm.thorne@vector.com', category: 'employment', categoryLabel: 'Employment',
    submitted: '6 hours ago',
    details: [
      { label: 'Company', value: 'Vector Technologies' },
      { label: 'Position', value: 'Senior Backend Engineer' },
      { label: 'Duration', value: 'Mar 2021 – Present' },
    ],
    documents: ['employment_letter.pdf'],
  },
  {
    id: 4, user: 'Elena Petrova', email: 'elena.p@cloud.net', category: 'degree', categoryLabel: 'Degree',
    submitted: '1 day ago',
    details: [
      { label: 'University', value: 'MIT' },
      { label: 'Degree', value: 'M.Sc. Computer Science' },
      { label: 'Year', value: '2020' },
    ],
    documents: ['degree_certificate.pdf', 'transcript.pdf'],
  },
  {
    id: 5, user: 'Jordan Smith', email: 'j.smith@agency.io', category: 'identity', categoryLabel: 'Identity',
    submitted: '1 day ago',
    details: [
      { label: 'Full Name', value: 'Jordan Michael Smith' },
      { label: 'Country', value: 'United Kingdom' },
      { label: 'ID Type', value: 'Driver License' },
    ],
    documents: ['license_front.jpg', 'license_back.jpg'],
  },
])

const filteredItems = computed(() => {
  if (!categoryFilter.value) return verificationItems.value
  return verificationItems.value.filter(i => i.category === categoryFilter.value)
})

function approveItem(id) {
  verificationItems.value = verificationItems.value.filter(i => i.id !== id)
}

function rejectItem(id) {
  verificationItems.value = verificationItems.value.filter(i => i.id !== id)
}

function requestMore(id) {
  alert('Request for additional information sent.')
}
</script>

<style scoped>
.admin-verification-view { display: flex; flex-direction: column; gap: 1.25rem; padding: 1.5rem; min-height: 100vh; }
@media (min-width: 768px) { .admin-verification-view { padding: 2rem; } }

.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
.header-actions { display: flex; gap: 0.75rem; }

.filter-select {
  padding: 0.5rem 0.875rem; background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant); border-radius: var(--radius-lg);
  font-family: var(--font-headline); font-size: 0.875rem; color: var(--on-surface); outline: none; cursor: pointer;
}

.verif-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
@media (min-width: 768px) { .verif-stats { grid-template-columns: repeat(4, 1fr); } }

.verif-stat-card { display: flex; align-items: center; gap: 1rem; padding: 1.25rem; border-radius: var(--radius-xl); }
.vstat-icon-wrap { width: 48px; height: 48px; border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.vstat-icon { font-size: 24px; }
.vstat-label { font-size: 0.75rem; color: var(--on-surface-variant); font-family: var(--font-headline); }
.vstat-value { font-family: var(--font-headline); font-size: 1.375rem; font-weight: 700; color: var(--on-surface); }

.verif-queue { display: flex; flex-direction: column; gap: 1rem; }

.verif-card { padding: 1.25rem; border-radius: var(--radius-xl); display: flex; flex-direction: column; gap: 1rem; }

.verif-card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
.verif-user { display: flex; align-items: center; gap: 0.75rem; }
.verif-avatar {
  width: 42px; height: 42px; border-radius: var(--radius-lg);
  background: var(--primary-fixed); color: var(--primary);
  font-family: var(--font-headline); font-size: 0.9rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.verif-user-name { font-family: var(--font-headline); font-size: 0.9rem; font-weight: 700; color: var(--on-surface); }
.verif-user-email { font-size: 0.75rem; color: var(--on-surface-variant); }

.verif-meta { display: flex; align-items: center; gap: 0.75rem; }
.verif-time { font-size: 0.75rem; color: var(--on-surface-variant); }

.verif-category-badge {
  padding: 0.2rem 0.5rem; border-radius: var(--radius-full);
  font-family: var(--font-headline); font-size: 0.7rem; font-weight: 600;
}
.cat-identity { background: rgba(168,85,247,0.1); color: var(--primary); }
.cat-github { background: rgba(16,185,129,0.1); color: #10b981; }
.cat-degree { background: rgba(59,130,246,0.1); color: #3b82f6; }
.cat-employment { background: rgba(245,158,11,0.1); color: #f59e0b; }

.verif-details {
  padding: 0.875rem; background: var(--surface-container-low);
  border-radius: var(--radius-lg); border: 1px solid var(--outline-variant);
  display: flex; flex-direction: column; gap: 0.5rem;
}
.verif-detail-row { display: flex; gap: 0.75rem; font-size: 0.85rem; }
.detail-label { color: var(--on-surface-variant); font-weight: 600; font-family: var(--font-headline); min-width: 120px; }
.detail-value { color: var(--on-surface); }

.verif-documents { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
.docs-label { font-size: 0.75rem; color: var(--on-surface-variant); font-family: var(--font-headline); font-weight: 600; }
.docs-list { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.doc-chip {
  display: inline-flex; align-items: center; gap: 0.3rem;
  padding: 0.3rem 0.625rem; background: var(--surface-container-high);
  border-radius: var(--radius-full); font-size: 0.75rem; color: var(--on-surface-variant);
  font-family: var(--font-headline); font-weight: 500;
}

.verif-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; padding-top: 0.75rem; border-top: 1px solid var(--outline-variant); }
.verif-action-btn { font-size: 0.82rem; padding: 0.5rem 1rem; display: inline-flex; align-items: center; gap: 0.35rem; }
.verif-action-btn.approve { background: #16a34a; border: none; color: white; }
.verif-action-btn.approve:hover { opacity: 0.9; }
.verif-action-btn.reject { border-color: var(--error); color: var(--error); }
.verif-action-btn.reject:hover { background: rgba(239,68,68,0.08); }

.verif-empty { display: flex; flex-direction: column; align-items: center; padding: 3rem; text-align: center; border-radius: var(--radius-xl); gap: 0.5rem; }
.verif-empty h3 { font-family: var(--font-headline); font-size: 1.125rem; font-weight: 700; color: var(--on-surface); }
.verif-empty p { font-size: 0.875rem; color: var(--on-surface-variant); }
</style>
