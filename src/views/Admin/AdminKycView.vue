<template>
  <div class="admin-kyc-view">

    <div class="page-header">
      <div>
        <h1 class="pg-title">KYC Review</h1>
        <p class="pg-sub">Review and approve identity verification submissions.</p>
      </div>
      <button class="btn-refresh" @click="load" :disabled="loading">
        <span class="material-symbols-outlined" :class="{ spin: loading }">refresh</span>
      </button>
    </div>

    <!-- Status tabs -->
    <div class="filter-tabs">
      <button v-for="t in tabs" :key="t.value"
        class="filter-tab" :class="{ active: activeTab === t.value }"
        @click="activeTab = t.value; load()">
        {{ t.label }}
        <span class="tab-count" v-if="t.value === 'pending' && pendingCount > 0">{{ pendingCount }}</span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="empty-state">
      <div class="spinner"></div>
    </div>

    <!-- Empty -->
    <div v-else-if="!submissions.length" class="empty-state">
      <span class="material-symbols-outlined" style="font-size:3rem;opacity:.2">badge</span>
      <p>No {{ activeTab }} submissions</p>
    </div>

    <!-- Submissions grid -->
    <div v-else class="submissions-grid">
      <div v-for="sub in submissions" :key="sub.id" class="sub-card">

        <!-- User info -->
        <div class="sub-user">
          <img v-if="sub.user_avatar" :src="sub.user_avatar" class="sub-av" />
          <div v-else class="sub-av-ph">{{ sub.user_name?.[0] }}</div>
          <div class="sub-user-info">
            <p class="sub-name">{{ sub.user_name }}</p>
            <p class="sub-email">{{ sub.user_email }}</p>
            <span class="sub-date">{{ fmtDate(sub.submitted_at) }}</span>
          </div>
          <span class="sub-status-badge" :class="sub.status">{{ sub.status }}</span>
        </div>

        <!-- ID details -->
        <div class="sub-details">
          <div class="sub-row"><span class="sub-lbl">Full Name</span><span class="sub-val">{{ sub.full_name }}</span></div>
          <div class="sub-row"><span class="sub-lbl">Country</span><span class="sub-val">{{ sub.country }}</span></div>
          <div class="sub-row"><span class="sub-lbl">ID Type</span><span class="sub-val" style="text-transform:capitalize">{{ sub.id_type?.replace('_',' ') }}</span></div>
          <div class="sub-row"><span class="sub-lbl">ID Number</span><span class="sub-val mono">{{ sub.id_number }}</span></div>
        </div>

        <!-- Documents -->
        <div class="sub-docs">
          <a v-if="sub.id_front_url" :href="sub.id_front_url" target="_blank" class="doc-thumb" title="ID Front">
            <img :src="sub.id_front_url" class="doc-img" />
            <span class="doc-label">ID Front</span>
          </a>
          <a v-if="sub.id_back_url" :href="sub.id_back_url" target="_blank" class="doc-thumb" title="ID Back">
            <img :src="sub.id_back_url" class="doc-img" />
            <span class="doc-label">ID Back</span>
          </a>
          <a v-if="sub.selfie_url" :href="sub.selfie_url" target="_blank" class="doc-thumb" title="Selfie">
            <img :src="sub.selfie_url" class="doc-img" />
            <span class="doc-label">Selfie</span>
          </a>
        </div>

        <!-- Actions -->
        <div v-if="sub.status === 'pending'" class="sub-actions">
          <button class="btn-approve" @click="approve(sub)" :disabled="busy === sub.id">
            <span v-if="busy === sub.id" class="btn-spinner-sm"></span>
            <span v-else class="material-symbols-outlined" style="font-size:16px">check_circle</span>
            Approve
          </button>
          <button class="btn-reject" @click="openReject(sub)" :disabled="busy === sub.id">
            <span class="material-symbols-outlined" style="font-size:16px">cancel</span>
            Reject
          </button>
        </div>
        <div v-else class="sub-reviewed">
          <span class="material-symbols-outlined" style="font-size:15px">event</span>
          Reviewed {{ fmtDate(sub.reviewed_at) }}
        </div>

      </div>
    </div>

    <!-- Reject modal -->
    <Transition name="modal">
      <div v-if="rejectModal" class="modal-overlay" @click.self="rejectModal = null">
        <div class="modal-box" style="max-width:420px">
          <div class="modal-hdr">
            <div class="modal-hdr-icon" style="background:rgba(239,68,68,.1)">
              <span class="material-symbols-outlined" style="color:#ef4444;font-size:20px">cancel</span>
            </div>
            <h3 class="modal-title">Reject KYC</h3>
            <button class="modal-close" @click="rejectModal = null">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="modal-body">
            <p class="modal-sub">Provide a reason so the user can resubmit correctly.</p>
            <textarea v-model="rejectReason" class="reject-textarea"
              placeholder="e.g. Image is blurry, ID number not visible, selfie face not clear…"
              rows="4"></textarea>
          </div>
          <div class="modal-footer">
            <button class="btn-ghost" @click="rejectModal = null">Cancel</button>
            <button class="btn-danger" @click="reject" :disabled="!rejectReason.trim() || busy">
              <span v-if="busy" class="btn-spinner-sm"></span>
              Reject Submission
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import http from '@/services/http'
import { useUiStore } from '@/store/ui'

const uiStore  = useUiStore()
const loading  = ref(false)
const busy     = ref(null)
const activeTab = ref('pending')
const submissions = ref([])
const pendingCount = ref(0)
const rejectModal  = ref(null)
const rejectReason = ref('')

const tabs = [
  { label: 'Pending',  value: 'pending'  },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
]

function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-NG', { day:'numeric', month:'short', year:'numeric' })
}

async function load() {
  loading.value = true
  try {
    const data = await http.get(`/kyc/admin/list?status=${activeTab.value}`)
    submissions.value = data.submissions || []
    if (activeTab.value === 'pending') pendingCount.value = data.total || 0
  } catch { /* silent */ }
  finally { loading.value = false }
}

async function approve(sub) {
  busy.value = sub.id
  try {
    await http.post(`/kyc/admin/${sub.id}/approve`, {})
    uiStore.showSuccess(`${sub.user_name} KYC approved`)
    await load()
  } catch (e) {
    uiStore.showError(e?.response?.data?.detail || 'Failed')
  } finally { busy.value = null }
}

function openReject(sub) {
  rejectModal.value = sub
  rejectReason.value = ''
}

async function reject() {
  if (!rejectModal.value) return
  busy.value = rejectModal.value.id
  try {
    await http.post(`/kyc/admin/${rejectModal.value.id}/reject`, { reason: rejectReason.value.trim() })
    uiStore.showSuccess('Submission rejected')
    rejectModal.value = null
    await load()
  } catch (e) {
    uiStore.showError(e?.response?.data?.detail || 'Failed')
  } finally { busy.value = null }
}

onMounted(load)
</script>

<style scoped>
.admin-kyc-view { display:flex; flex-direction:column; gap:1.25rem; padding-bottom:3rem; }
.page-header    { display:flex; align-items:flex-start; justify-content:space-between; gap:1rem; }
.pg-title       { font-family:var(--font-headline); font-size:1.5rem; font-weight:800; color:var(--on-surface); }
.pg-sub         { font-size:.85rem; color:var(--on-surface-variant); margin-top:.2rem; }
.btn-refresh    { width:40px; height:40px; border-radius:50%; border:1.5px solid var(--outline-variant); background:var(--surface-container); color:var(--on-surface-variant); display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; transition:all .15s; }
.btn-refresh:hover { border-color:var(--primary); color:var(--primary); }
.spin           { animation:spin 1s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }

.filter-tabs    { display:flex; gap:.375rem; background:var(--surface-container-low); padding:.3rem; border-radius:12px; width:fit-content; }
.filter-tab     { display:flex; align-items:center; gap:.4rem; padding:.45rem 1rem; border-radius:9px; border:none; background:transparent; font-family:var(--font-headline); font-size:.82rem; font-weight:700; color:var(--on-surface-variant); cursor:pointer; transition:all .15s; }
.filter-tab.active { background:var(--surface-container-highest); color:var(--primary); }
.tab-count      { font-size:.68rem; font-weight:800; padding:.1rem .45rem; border-radius:999px; background:rgba(239,68,68,.15); color:#ef4444; }

.empty-state    { display:flex; flex-direction:column; align-items:center; gap:.75rem; padding:4rem 1rem; color:var(--on-surface-variant); }
.spinner        { width:28px; height:28px; border-radius:50%; border:3px solid rgba(99,14,212,.15); border-top-color:var(--primary); animation:spin 1s linear infinite; }

.submissions-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(340px,1fr)); gap:1rem; }
.sub-card       { background:var(--surface-container-lowest); border:1.5px solid var(--outline-variant); border-radius:20px; padding:1.25rem; display:flex; flex-direction:column; gap:.875rem; }

.sub-user       { display:flex; align-items:flex-start; gap:.75rem; }
.sub-av         { width:44px; height:44px; border-radius:50%; object-fit:cover; flex-shrink:0; }
.sub-av-ph      { width:44px; height:44px; border-radius:50%; background:var(--surface-container-high); display:flex; align-items:center; justify-content:center; font-family:var(--font-headline); font-weight:700; color:var(--on-surface-variant); font-size:1rem; flex-shrink:0; }
.sub-user-info  { flex:1; min-width:0; }
.sub-name       { font-family:var(--font-headline); font-size:.9rem; font-weight:700; color:var(--on-surface); }
.sub-email      { font-size:.75rem; color:var(--on-surface-variant); margin-top:.1rem; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.sub-date       { font-size:.7rem; color:var(--on-surface-variant); opacity:.6; }
.sub-status-badge { padding:.2rem .625rem; border-radius:999px; font-size:.68rem; font-weight:800; text-transform:uppercase; flex-shrink:0; }
.sub-status-badge.pending  { background:rgba(245,158,11,.1); color:#f59e0b; }
.sub-status-badge.approved { background:rgba(22,163,74,.1);  color:#16a34a; }
.sub-status-badge.rejected { background:rgba(239,68,68,.1);  color:#ef4444; }

.sub-details    { display:flex; flex-direction:column; gap:.4rem; background:var(--surface-container-low); border-radius:12px; padding:.875rem; }
.sub-row        { display:flex; justify-content:space-between; align-items:center; gap:.5rem; }
.sub-lbl        { font-size:.75rem; color:var(--on-surface-variant); flex-shrink:0; }
.sub-val        { font-size:.82rem; font-weight:600; color:var(--on-surface); text-align:right; }
.mono           { font-family:monospace; }

.sub-docs       { display:flex; gap:.625rem; flex-wrap:wrap; }
.doc-thumb      { display:flex; flex-direction:column; align-items:center; gap:.3rem; text-decoration:none; cursor:pointer; }
.doc-img        { width:80px; height:56px; border-radius:8px; object-fit:cover; border:1.5px solid var(--outline-variant); transition:border-color .15s; }
.doc-thumb:hover .doc-img { border-color:var(--primary); }
.doc-label      { font-size:.65rem; color:var(--on-surface-variant); font-weight:600; }

.sub-actions    { display:flex; gap:.625rem; }
.btn-approve    { flex:1; display:flex; align-items:center; justify-content:center; gap:.35rem; padding:.625rem; border-radius:10px; background:rgba(22,163,74,.1); border:1.5px solid rgba(22,163,74,.25); color:#16a34a; font-size:.83rem; font-weight:700; cursor:pointer; transition:all .15s; }
.btn-approve:hover { background:rgba(22,163,74,.18); }
.btn-reject     { flex:1; display:flex; align-items:center; justify-content:center; gap:.35rem; padding:.625rem; border-radius:10px; background:rgba(239,68,68,.08); border:1.5px solid rgba(239,68,68,.2); color:#ef4444; font-size:.83rem; font-weight:700; cursor:pointer; transition:all .15s; }
.btn-reject:hover { background:rgba(239,68,68,.15); }
.btn-approve:disabled, .btn-reject:disabled { opacity:.4; cursor:not-allowed; }
.sub-reviewed   { display:flex; align-items:center; gap:.35rem; font-size:.75rem; color:var(--on-surface-variant); }
.btn-spinner-sm { width:14px; height:14px; border-radius:50%; border:2px solid currentColor; border-top-color:transparent; animation:spin 1s linear infinite; }

/* modal */
.modal-overlay  { position:fixed; inset:0; z-index:600; background:rgba(0,0,0,.6); backdrop-filter:blur(6px); display:flex; align-items:center; justify-content:center; padding:1rem; }
.modal-box      { width:100%; background:var(--surface-container-lowest); border-radius:24px; display:flex; flex-direction:column; box-shadow:var(--shadow-lg); }
.modal-hdr      { display:flex; align-items:center; gap:.75rem; padding:1.25rem 1.5rem 1rem; border-bottom:1px solid var(--outline-variant); }
.modal-hdr-icon { width:40px; height:40px; border-radius:11px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.modal-title    { font-family:var(--font-headline); font-size:1.05rem; font-weight:800; color:var(--on-surface); flex:1; }
.modal-close    { width:34px; height:34px; border-radius:50%; border:none; background:var(--surface-container); color:var(--on-surface-variant); display:flex; align-items:center; justify-content:center; cursor:pointer; }
.modal-body     { padding:1.25rem 1.5rem; display:flex; flex-direction:column; gap:.875rem; }
.modal-sub      { font-size:.875rem; color:var(--on-surface-variant); }
.modal-footer   { display:flex; gap:.75rem; padding:1rem 1.5rem 1.5rem; }
.reject-textarea { width:100%; padding:.875rem 1rem; border-radius:12px; border:1.5px solid var(--outline-variant); background:var(--surface-container); color:var(--on-surface); font-size:.875rem; resize:vertical; outline:none; font-family:inherit; }
.reject-textarea:focus { border-color:var(--primary); }
.btn-danger     { flex:1; display:flex; align-items:center; justify-content:center; gap:.4rem; padding:.75rem 1rem; border-radius:12px; background:#ef4444; color:#fff; border:none; font-family:var(--font-headline); font-size:.9rem; font-weight:700; cursor:pointer; }
.btn-danger:disabled { opacity:.5; cursor:not-allowed; }
.modal-enter-active, .modal-leave-active { transition:all .25s ease; }
.modal-enter-from, .modal-leave-to { opacity:0; transform:scale(.96); }
</style>
