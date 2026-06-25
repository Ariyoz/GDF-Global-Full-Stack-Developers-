<template>
  <div class="admin-projects-view">
    <div class="page-header">
      <div>
        <h1 class="pg-title">Project Review</h1>
        <p class="pg-sub">Review and approve user-submitted projects before they go live.</p>
      </div>
      <button class="btn-refresh" @click="loadProjects" :disabled="loading">
        <span class="material-symbols-outlined" :class="{ spin: loading }">refresh</span>
      </button>
    </div>

    <!-- Tabs -->
    <div class="rev-tabs">
      <button v-for="t in tabs" :key="t.v" class="rev-tab" :class="{ active: activeTab === t.v }"
        @click="activeTab = t.v">
        {{ t.label }}
        <span v-if="t.count > 0" class="rev-badge">{{ t.count }}</span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="rev-loading">
      <div v-for="i in 3" :key="i" class="rev-skel shimmer"></div>
    </div>

    <!-- Empty -->
    <div v-else-if="!filteredProjects.length" class="rev-empty">
      <span class="material-symbols-outlined" style="font-size:3rem;opacity:.3">task_alt</span>
      <p>No projects {{ activeTab === 'pending' ? 'awaiting review' : 'here' }}</p>
    </div>

    <!-- Project list -->
    <div v-else class="rev-grid">
      <div v-for="p in filteredProjects" :key="p.id" class="rev-card">
        <!-- Cover -->
        <div class="rev-cover">
          <img v-if="p.cover_image" :src="p.cover_image" class="rev-cover-img" />
          <div v-else class="rev-cover-placeholder">
            <span class="material-symbols-outlined" style="font-size:2rem;color:rgba(255,255,255,.5)">work</span>
          </div>
          <span class="rev-status-chip" :class="(p.status||'').toLowerCase()">{{ p.status }}</span>
        </div>

        <!-- Body -->
        <div class="rev-body">
          <div class="rev-author">
            <img v-if="p.author_avatar" :src="p.author_avatar" class="rev-av" />
            <span v-else class="rev-av-ini">{{ (p.author_name||'?')[0] }}</span>
            <div>
              <p class="rev-author-name">{{ p.author_name }}</p>
              <p class="rev-author-email">{{ p.author_email }}</p>
            </div>
          </div>
          <h3 class="rev-title">{{ p.title }}</h3>
          <p class="rev-desc">{{ p.description }}</p>
          <p class="rev-meta">{{ p.project_type }} · Submitted {{ fmtDate(p.created_at) }}</p>

          <!-- Project links preview -->
          <div v-if="p.live_url || p.github_url || p.repository_url" class="rev-links">
            <a v-if="p.live_url" :href="p.live_url" target="_blank" rel="noopener" class="rev-link-btn" @click.stop>
              <span class="material-symbols-outlined" style="font-size:14px">rocket_launch</span> Demo
            </a>
            <a v-if="p.github_url || p.repository_url" :href="p.github_url || p.repository_url" target="_blank" rel="noopener" class="rev-link-btn" @click.stop>
              <span class="material-symbols-outlined" style="font-size:14px">code</span> Repo
            </a>
          </div>

          <!-- Actions -->
          <div class="rev-actions" v-if="['draft','pending_review'].includes((p.status||'').toLowerCase())">
            <button class="rev-approve-btn" :disabled="acting === p.id" @click="approve(p)">
              <span class="material-symbols-outlined" style="font-size:16px">check_circle</span>
              Approve
            </button>
            <button class="rev-reject-btn" :disabled="acting === p.id" @click="openReject(p)">
              <span class="material-symbols-outlined" style="font-size:16px">cancel</span>
              Decline
            </button>
          </div>
          <div class="rev-actions" v-else>
            <button class="rev-delete-btn" @click="deleteProject(p)">
              <span class="material-symbols-outlined" style="font-size:16px">delete</span>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Reject modal -->
    <Transition name="modal">
      <div v-if="rejectModal.show" class="modal-overlay" @click.self="rejectModal.show = false">
        <div class="modal-box">
          <div class="modal-hdr">
            <h3 class="modal-title">Reject Project</h3>
            <button class="modal-close" @click="rejectModal.show = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="modal-body">
            <p style="font-size:.875rem;color:var(--on-surface-variant);margin-bottom:.75rem">
              Rejecting: <strong>{{ rejectModal.project?.title }}</strong>
            </p>
            <label style="font-size:.8rem;font-weight:600;color:var(--on-surface-variant)">Reason (shown to user)</label>
            <textarea v-model="rejectModal.reason" class="reject-ta"
              placeholder="e.g. Content violates platform guidelines, inappropriate imagery..." rows="3" />
          </div>
          <div class="modal-footer">
            <button class="btn-ghost" @click="rejectModal.show = false">Cancel</button>
            <button class="btn-reject-confirm" @click="confirmReject" :disabled="acting">
              Confirm Rejection
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import http from '@/services/http'
import { useUiStore } from '@/store/ui'

const uiStore  = useUiStore()
const loading  = ref(false)
const acting   = ref(null)
const projects = ref([])
const activeTab = ref('pending')

const rejectModal = ref({ show: false, project: null, reason: '' })

const tabs = computed(() => [
  { v: 'pending',  label: 'Pending Review', count: projects.value.filter(p => ['pending_review','draft','DRAFT','PENDING_REVIEW'].includes(p.status)).length },
  { v: 'approved', label: 'Approved',       count: projects.value.filter(p => ['open','OPEN'].includes(p.status)).length },
  { v: 'rejected', label: 'Rejected',       count: projects.value.filter(p => ['cancelled','CANCELLED'].includes(p.status)).length },
  { v: 'all',      label: 'All',            count: projects.value.length },
])

const filteredProjects = computed(() => {
  const s = (v) => v?.toLowerCase()
  if (activeTab.value === 'pending')  return projects.value.filter(p => ['pending_review','draft'].includes(s(p.status)))
  if (activeTab.value === 'approved') return projects.value.filter(p => s(p.status) === 'open')
  if (activeTab.value === 'rejected') return projects.value.filter(p => s(p.status) === 'cancelled')
  return projects.value
})

function fmtDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
}

async function loadProjects() {
  loading.value = true
  try {
    // Use /admin/projects/all — clean endpoint with no routing conflicts
    const data = await http.get('/admin/projects/all')
    projects.value = data.projects || []
    console.log('[Admin] Loaded', projects.value.length, 'projects')
  } catch (e) {
    console.error('Failed to load projects:', e)
    uiStore.showError('Failed to load projects: ' + (e?.response?.data?.detail || e?.message || 'Unknown error'))
  } finally {
    loading.value = false
  }
}

async function approve(p) {
  acting.value = p.id
  try {
    await http.post(`/admin/projects/${p.id}/approve`, {})
    p.status = 'open'
    uiStore.showSuccess(`"${p.title}" approved and now live!`)
  } catch (e) {
    uiStore.showError(e?.response?.data?.detail || 'Approval failed')
  } finally {
    acting.value = null
  }
}

function openReject(p) {
  rejectModal.value = { show: true, project: p, reason: '' }
}

async function confirmReject() {
  const p = rejectModal.value.project
  if (!p) return
  acting.value = p.id
  try {
    await http.post(`/admin/projects/${p.id}/reject`, { reason: rejectModal.value.reason })
    p.status = 'cancelled'
    uiStore.showSuccess(`"${p.title}" rejected`)
    rejectModal.value.show = false
  } catch (e) {
    uiStore.showError(e?.response?.data?.detail || 'Rejection failed')
  } finally {
    acting.value = null
  }
}

async function deleteProject(p) {
  if (!confirm(`Permanently delete "${p.title}"?`)) return
  try {
    await http.request({ method: 'DELETE', url: `/admin/projects/${p.id}` })
    projects.value = projects.value.filter(x => x.id !== p.id)
    uiStore.showSuccess('Project deleted')
  } catch (e) {
    uiStore.showError(e?.response?.data?.detail || 'Delete failed')
  }
}

onMounted(loadProjects)
</script>

<style scoped>
.admin-projects-view { display: flex; flex-direction: column; gap: 1.25rem; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; }
.pg-title { font-family: var(--font-headline); font-size: 1.5rem; font-weight: 800; color: var(--on-surface); }
.pg-sub   { font-size: .85rem; color: var(--on-surface-variant); margin-top: .25rem; }
.btn-refresh { width: 38px; height: 38px; border-radius: 50%; border: 1px solid var(--outline-variant); background: var(--surface-container); color: var(--on-surface-variant); display: flex; align-items: center; justify-content: center; cursor: pointer; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Tabs */
.rev-tabs { display: flex; gap: .25rem; border-bottom: 1px solid var(--outline-variant); overflow-x: auto; scrollbar-width: none; }
.rev-tabs::-webkit-scrollbar { display: none; }
.rev-tab { display: flex; align-items: center; gap: .4rem; padding: .625rem 1rem; background: none; border: none; border-bottom: 2.5px solid transparent; font-family: var(--font-headline); font-size: .875rem; font-weight: 500; color: var(--on-surface-variant); cursor: pointer; white-space: nowrap; }
.rev-tab.active { color: var(--primary); border-bottom-color: var(--primary); }
.rev-badge { min-width: 18px; height: 18px; border-radius: 9px; background: var(--primary); color: #fff; font-size: .62rem; font-weight: 800; display: flex; align-items: center; justify-content: center; padding: 0 4px; }

/* Skeleton */
.rev-skel { height: 120px; border-radius: 12px; }
.shimmer { background: linear-gradient(90deg,var(--surface-container) 25%,var(--surface-container-high) 50%,var(--surface-container) 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

/* Empty */
.rev-empty { display: flex; flex-direction: column; align-items: center; gap: .5rem; padding: 3rem; color: var(--on-surface-variant); }

/* Grid */
.rev-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; }
.rev-card {
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: 16px; overflow: hidden;
  display: flex; flex-direction: column;
  transition: border-color .15s, transform .15s;
}
.rev-card:hover { border-color: rgba(168,85,247,.3); transform: translateY(-2px); }

/* Cover */
.rev-cover { position: relative; height: 140px; background: linear-gradient(135deg,#1a0840,#2e1065); }
.rev-cover-img { width: 100%; height: 100%; object-fit: cover; }
.rev-cover-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
.rev-status-chip { position: absolute; top: .625rem; right: .625rem; padding: .2rem .625rem; border-radius: 999px; font-size: .68rem; font-weight: 700; text-transform: uppercase; }
.rev-status-chip.pending_review, .rev-status-chip.draft { background: rgba(245,158,11,.2); color: #f59e0b; }
.rev-status-chip.open   { background: rgba(34,197,94,.15); color: #16a34a; }
.rev-status-chip.cancelled { background: rgba(239,68,68,.12); color: #ef4444; }

/* Body */
.rev-body { padding: 1rem; display: flex; flex-direction: column; gap: .75rem; flex: 1; }
.rev-author { display: flex; align-items: center; gap: .625rem; }
.rev-av { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; }
.rev-av-ini { width: 32px; height: 32px; border-radius: 50%; background: var(--primary-fixed); display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--primary); font-size: .85rem; flex-shrink: 0; }
.rev-author-name { font-family: var(--font-headline); font-size: .85rem; font-weight: 700; color: var(--on-surface); }
.rev-author-email { font-size: .72rem; color: var(--on-surface-variant); }
.rev-title { font-family: var(--font-headline); font-size: 1rem; font-weight: 800; color: var(--on-surface); margin: 0; }
.rev-desc { font-size: .8rem; color: var(--on-surface-variant); line-height: 1.5; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; }
.rev-meta { font-size: .75rem; color: var(--on-surface-variant); }

/* Link preview buttons */
.rev-links { display: flex; gap: .4rem; flex-wrap: wrap; }
.rev-link-btn {
  display: inline-flex; align-items: center; gap: .25rem;
  padding: .2rem .6rem; border-radius: 999px;
  background: var(--surface-container);
  border: 1px solid var(--outline-variant);
  font-family: var(--font-headline); font-size: .72rem; font-weight: 600;
  color: var(--primary); text-decoration: none;
  transition: background .15s, border-color .15s;
}
.rev-link-btn:hover { background: rgba(168,85,247,.08); border-color: var(--primary); }

/* Actions */
.rev-actions { display: flex; gap: .5rem; margin-top: auto; }
.rev-approve-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: .35rem; padding: .6rem; border-radius: 10px; border: none; background: rgba(34,197,94,.1); color: #16a34a; font-family: var(--font-headline); font-size: .85rem; font-weight: 700; cursor: pointer; }
.rev-approve-btn:hover { background: rgba(34,197,94,.2); }
.rev-reject-btn  { flex: 1; display: flex; align-items: center; justify-content: center; gap: .35rem; padding: .6rem; border-radius: 10px; border: none; background: rgba(239,68,68,.08); color: #ef4444; font-family: var(--font-headline); font-size: .85rem; font-weight: 700; cursor: pointer; }
.rev-reject-btn:hover { background: rgba(239,68,68,.15); }
.rev-delete-btn  { display: flex; align-items: center; gap: .35rem; padding: .5rem 1rem; border-radius: 10px; border: 1px solid var(--outline-variant); background: none; color: #ef4444; font-size: .85rem; cursor: pointer; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.5); z-index: 500; display: flex; align-items: center; justify-content: center; padding: 1rem; }
.modal-box { background: var(--surface-container-lowest); border-radius: 16px; width: 100%; max-width: 460px; display: flex; flex-direction: column; }
.modal-hdr { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem 0; }
.modal-title { font-family: var(--font-headline); font-size: 1.05rem; font-weight: 800; color: var(--on-surface); }
.modal-close { width: 32px; height: 32px; border-radius: 50%; background: var(--surface-container); border: none; cursor: pointer; color: var(--on-surface-variant); display: flex; align-items: center; justify-content: center; }
.modal-body { padding: 1rem 1.5rem; }
.reject-ta { width: 100%; padding: .75rem; background: var(--surface-container); border: 1.5px solid var(--outline-variant); border-radius: 10px; font-size: .875rem; color: var(--on-surface); outline: none; resize: vertical; margin-top: .4rem; font-family: var(--font-body); }
.reject-ta:focus { border-color: #ef4444; }
.modal-footer { display: flex; gap: .75rem; justify-content: flex-end; padding: .875rem 1.5rem 1.5rem; border-top: 1px solid var(--outline-variant); }
.btn-ghost { padding: .6rem 1.25rem; border-radius: 10px; border: 1px solid var(--outline-variant); background: none; color: var(--on-surface-variant); font-size: .875rem; cursor: pointer; }
.btn-reject-confirm { padding: .6rem 1.5rem; border-radius: 10px; background: #ef4444; color: #fff; border: none; font-family: var(--font-headline); font-size: .875rem; font-weight: 700; cursor: pointer; }
.modal-enter-active, .modal-leave-active { transition: all .2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(.96); }

.rev-loading { display: flex; flex-direction: column; gap: .75rem; }
</style>
