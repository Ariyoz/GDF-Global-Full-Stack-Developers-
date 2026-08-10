<template>
  <div class="admin-kyc-view">

    <!-- Header -->
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
    <div class="filter-tabs-wrap">
      <div class="filter-tabs">
        <button v-for="t in tabs" :key="t.value"
          class="filter-tab" :class="{ active: activeTab === t.value }"
          @click="activeTab = t.value; load()">
          {{ t.label }}
          <span class="tab-count" v-if="t.value === 'pending' && pendingCount > 0">{{ pendingCount }}</span>
        </button>
      </div>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="skel-grid">
      <div v-for="i in 3" :key="i" class="skel-card">
        <div class="shimmer skel-av"></div>
        <div class="skel-lines">
          <div class="shimmer skel-l1"></div>
          <div class="shimmer skel-l2"></div>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else-if="!submissions.length" class="empty-state">
      <span class="material-symbols-outlined" style="font-size:3rem;opacity:.2">verified_user</span>
      <p>No {{ activeTab }} KYC submissions</p>
    </div>

    <!-- Submission cards -->
    <div v-else class="sub-grid">
      <div v-for="sub in submissions" :key="sub.id" class="sub-card">

        <!-- Card header: user info + status badge -->
        <div class="sub-card-hdr">
          <div class="sub-user">
            <div class="sub-av" v-if="sub.user_avatar">
              <img :src="sub.user_avatar" class="sub-av-img" loading="lazy" />
            </div>
            <div class="sub-av sub-av-ph" v-else>{{ (sub.user_name || '?')[0].toUpperCase() }}</div>
            <div class="sub-user-info">
              <p class="sub-name">{{ sub.user_name }}</p>
              <p class="sub-email">{{ sub.user_email }}</p>
              <p class="sub-date">{{ fmtDate(sub.submitted_at) }}</p>
            </div>
          </div>
          <span class="status-badge" :class="sub.status">{{ sub.status }}</span>
        </div>

        <!-- ID details -->
        <div class="sub-details">
          <div class="detail-row">
            <span class="detail-lbl">Full Name</span>
            <span class="detail-val">{{ sub.full_name }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-lbl">Country</span>
            <span class="detail-val">{{ sub.country }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-lbl">ID Type</span>
            <span class="detail-val" style="text-transform:capitalize">{{ sub.id_type?.replace('_', ' ') }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-lbl">ID Number</span>
            <span class="detail-val mono">{{ sub.id_number }}</span>
          </div>
        </div>

        <!-- Document thumbnails -->
        <div class="sub-docs">
          <a v-if="sub.id_front_url && !sub.id_front_url.startsWith('pending') && !sub.id_front_url.startsWith('upload')"
            :href="sub.id_front_url" target="_blank" rel="noopener" class="doc-thumb">
            <img :src="sub.id_front_url" class="doc-img" loading="lazy" />
            <span class="doc-lbl">ID Front</span>
          </a>
          <div v-else-if="sub.id_front_url" class="doc-thumb doc-pending">
            <span class="material-symbols-outlined" style="font-size:24px;opacity:.4">image_not_supported</span>
            <span class="doc-lbl">ID Front</span>
            <span class="doc-pending-note">Upload pending</span>
          </div>

          <a v-if="sub.id_back_url && !sub.id_back_url.startsWith('pending') && !sub.id_back_url.startsWith('upload')"
            :href="sub.id_back_url" target="_blank" rel="noopener" class="doc-thumb">
            <img :src="sub.id_back_url" class="doc-img" loading="lazy" />
            <span class="doc-lbl">ID Back</span>
          </a>

          <a v-if="sub.selfie_url && !sub.selfie_url.startsWith('pending') && !sub.selfie_url.startsWith('upload')"
            :href="sub.selfie_url" target="_blank" rel="noopener" class="doc-thumb">
            <img :src="sub.selfie_url" class="doc-img" loading="lazy" />
            <span class="doc-lbl">Selfie</span>
          </a>
          <div v-else-if="sub.selfie_url" class="doc-thumb doc-pending">
            <span class="material-symbols-outlined" style="font-size:24px;opacity:.4">face</span>
            <span class="doc-lbl">Selfie</span>
            <span class="doc-pending-note">Upload pending</span>
          </div>
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
          <span class="material-symbols-outlined" style="font-size:15px;color:#16a34a" v-if="sub.status === 'approved'">verified_user</span>
          <span class="material-symbols-outlined" style="font-size:15px;color:#ef4444" v-else>cancel</span>
          {{ sub.status === 'approved' ? 'Approved' : 'Rejected' }}
          <span v-if="sub.reviewed_at"> · {{ fmtDate(sub.reviewed_at) }}</span>
        </div>

      </div>
    </div>

    <!-- Reject modal -->
    <Transition name="modal">
      <div v-if="rejectModal" class="modal-overlay" @click.self="rejectModal = null">
        <div class="modal-box">
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
            <div class="reject-user-info">
              <strong>{{ rejectModal.user_name }}</strong>
              <span>{{ rejectModal.user_email }}</span>
            </div>
            <p class="modal-sub">Give a reason so the user knows how to resubmit.</p>
            <textarea v-model="rejectReason" class="reject-textarea"
              placeholder="e.g. Image is blurry, ID number not visible, selfie face not clearly showing…"
              rows="4" />
            <div class="reject-presets">
              <button v-for="r in rejectPresets" :key="r"
                class="preset-tag" @click="rejectReason = r">{{ r }}</button>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-ghost" @click="rejectModal = null">Cancel</button>
            <button class="btn-danger" @click="reject" :disabled="!rejectReason.trim() || !!busy">
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

const rejectPresets = [
  'Image is blurry or unclear',
  'ID number not visible',
  'Selfie face not clearly visible',
  'ID appears expired',
  'Documents do not match',
]

function fmtDate(d) {
  if (!d || d === 'None') return '—'
  try {
    return new Date(d).toLocaleDateString('en-NG', {
      day: 'numeric', month: 'short', year: 'numeric'
    })
  } catch { return d }
}

async function load() {
  loading.value = true
  try {
    const data = await http.get(`/kyc/admin/list?status=${activeTab.value}`)
    submissions.value = data.submissions || []
    if (activeTab.value === 'pending') pendingCount.value = data.total || 0
  } catch (e) {
    uiStore.showError(e?.response?.data?.detail || 'Could not load submissions')
  } finally {
    loading.value = false
  }
}

async function approve(sub) {
  busy.value = sub.id
  try {
    await http.post(`/kyc/admin/${sub.id}/approve`, {})
    uiStore.showSuccess(`✓ ${sub.user_name} KYC approved`)
    await load()
  } catch (e) {
    uiStore.showError(e?.response?.data?.detail || 'Approval failed')
  } finally { busy.value = null }
}

function openReject(sub) {
  rejectModal.value = sub
  rejectReason.value = ''
}

async function reject() {
  if (!rejectModal.value || !rejectReason.value.trim()) return
  busy.value = rejectModal.value.id
  try {
    await http.post(`/kyc/admin/${rejectModal.value.id}/reject`, {
      reason: rejectReason.value.trim()
    })
    uiStore.showSuccess('Submission rejected')
    rejectModal.value = null
    await load()
  } catch (e) {
    uiStore.showError(e?.response?.data?.detail || 'Rejection failed')
  } finally { busy.value = null }
}

onMounted(load)
</script>

<style scoped>
.admin-kyc-view { display:flex; flex-direction:column; gap:1.25rem; padding-bottom:3rem; }

/* Header */
.page-header { display:flex; align-items:flex-start; justify-content:space-between; gap:1rem; flex-wrap:wrap; }
.pg-title    { font-family:var(--font-headline); font-size:1.4rem; font-weight:800; color:var(--on-surface); }
.pg-sub      { font-size:.82rem; color:var(--on-surface-variant); margin-top:.2rem; }
.btn-refresh { width:40px; height:40px; border-radius:50%; border:1.5px solid var(--outline-variant); background:var(--surface-container); color:var(--on-surface-variant); display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all .15s; flex-shrink:0; }
.btn-refresh:hover { border-color:var(--primary); color:var(--primary); }
.spin { animation:spin 1s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }

/* Tabs */
.filter-tabs-wrap { overflow-x:auto; scrollbar-width:none; }
.filter-tabs-wrap::-webkit-scrollbar { display:none; }
.filter-tabs  { display:flex; gap:.375rem; background:var(--surface-container-low); padding:.35rem; border-radius:12px; width:fit-content; min-width:100%; }
.filter-tab   { display:flex; align-items:center; gap:.4rem; padding:.5rem 1.125rem; border-radius:9px; border:none; background:transparent; font-family:var(--font-headline); font-size:.85rem; font-weight:700; color:var(--on-surface-variant); cursor:pointer; transition:all .15s; white-space:nowrap; flex:1; justify-content:center; }
.filter-tab.active { background:var(--surface-container-highest); color:var(--primary); }
.tab-count    { font-size:.68rem; font-weight:800; padding:.1rem .45rem; border-radius:999px; background:rgba(239,68,68,.15); color:#ef4444; }

/* Skeleton */
.skel-grid  { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:1rem; }
.skel-card  { background:var(--surface-container-lowest); border:1.5px solid var(--outline-variant); border-radius:20px; padding:1.25rem; display:flex; align-items:center; gap:.875rem; }
.skel-av    { width:48px; height:48px; border-radius:50%; flex-shrink:0; }
.skel-lines { flex:1; display:flex; flex-direction:column; gap:.4rem; }
.skel-l1    { height:12px; width:60%; border-radius:4px; }
.skel-l2    { height:10px; width:40%; border-radius:4px; }
.shimmer    { background:linear-gradient(90deg,var(--surface-container) 25%,var(--surface-container-high) 50%,var(--surface-container) 75%); background-size:200% 100%; animation:shimmer 1.4s infinite; }
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

/* Empty */
.empty-state { display:flex; flex-direction:column; align-items:center; gap:.75rem; padding:4rem 1rem; color:var(--on-surface-variant); text-align:center; }

/* Grid — 1 col mobile, 2 col tablet, 3 col desktop */
.sub-grid { display:grid; grid-template-columns:1fr; gap:1rem; }
@media (min-width:640px)  { .sub-grid { grid-template-columns:repeat(2,1fr); } }
@media (min-width:1100px) { .sub-grid { grid-template-columns:repeat(3,1fr); } }

/* Card */
.sub-card { background:var(--surface-container-lowest); border:1.5px solid var(--outline-variant); border-radius:20px; padding:1.25rem; display:flex; flex-direction:column; gap:.875rem; transition:box-shadow .2s; }
.sub-card:hover { box-shadow:0 4px 20px rgba(0,0,0,.08); }

/* Card header */
.sub-card-hdr { display:flex; align-items:flex-start; justify-content:space-between; gap:.75rem; }
.sub-user     { display:flex; align-items:center; gap:.75rem; flex:1; min-width:0; }
.sub-av       { width:44px; height:44px; border-radius:50%; flex-shrink:0; overflow:hidden; }
.sub-av-img   { width:100%; height:100%; object-fit:cover; }
.sub-av-ph    { background:var(--surface-container-high); display:flex; align-items:center; justify-content:center; font-family:var(--font-headline); font-weight:700; color:var(--on-surface-variant); font-size:1rem; }
.sub-user-info { flex:1; min-width:0; }
.sub-name     { font-family:var(--font-headline); font-size:.9rem; font-weight:700; color:var(--on-surface); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.sub-email    { font-size:.75rem; color:var(--on-surface-variant); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-top:.1rem; }
.sub-date     { font-size:.68rem; color:var(--on-surface-variant); opacity:.6; margin-top:.1rem; }

/* Status badges */
.status-badge  { padding:.25rem .75rem; border-radius:999px; font-size:.7rem; font-weight:800; text-transform:uppercase; letter-spacing:.04em; flex-shrink:0; }
.status-badge.pending  { background:rgba(245,158,11,.1); color:#f59e0b; border:1px solid rgba(245,158,11,.2); }
.status-badge.approved { background:rgba(22,163,74,.1);  color:#16a34a; border:1px solid rgba(22,163,74,.2); }
.status-badge.rejected { background:rgba(239,68,68,.1);  color:#ef4444; border:1px solid rgba(239,68,68,.2); }

/* Details */
.sub-details  { background:var(--surface-container-low); border-radius:12px; padding:.875rem 1rem; display:flex; flex-direction:column; gap:.5rem; }
.detail-row   { display:flex; align-items:center; justify-content:space-between; gap:.5rem; flex-wrap:wrap; }
.detail-lbl   { font-size:.75rem; color:var(--on-surface-variant); flex-shrink:0; }
.detail-val   { font-size:.82rem; font-weight:600; color:var(--on-surface); text-align:right; word-break:break-all; }
.mono         { font-family:monospace; letter-spacing:.05em; }

/* Documents */
.sub-docs     { display:flex; gap:.625rem; flex-wrap:wrap; }
.doc-thumb    { display:flex; flex-direction:column; align-items:center; gap:.3rem; text-decoration:none; cursor:pointer; }
.doc-img      { width:80px; height:60px; border-radius:10px; object-fit:cover; border:1.5px solid var(--outline-variant); transition:border-color .15s; }
.doc-thumb:hover .doc-img { border-color:var(--primary); }
.doc-lbl      { font-size:.65rem; color:var(--on-surface-variant); font-weight:600; }
.doc-pending  { width:80px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:.2rem; padding:.5rem; border:1.5px dashed var(--outline-variant); border-radius:10px; min-height:60px; }
.doc-pending-note { font-size:.6rem; color:var(--on-surface-variant); opacity:.6; text-align:center; }

/* Actions */
.sub-actions  { display:flex; gap:.625rem; }
.btn-approve  { flex:1; display:flex; align-items:center; justify-content:center; gap:.35rem; padding:.65rem; border-radius:12px; background:rgba(22,163,74,.1); border:1.5px solid rgba(22,163,74,.25); color:#16a34a; font-size:.85rem; font-weight:700; cursor:pointer; transition:all .15s; }
.btn-approve:hover { background:rgba(22,163,74,.2); }
.btn-reject   { flex:1; display:flex; align-items:center; justify-content:center; gap:.35rem; padding:.65rem; border-radius:12px; background:rgba(239,68,68,.08); border:1.5px solid rgba(239,68,68,.2); color:#ef4444; font-size:.85rem; font-weight:700; cursor:pointer; transition:all .15s; }
.btn-reject:hover { background:rgba(239,68,68,.15); }
.btn-approve:disabled, .btn-reject:disabled { opacity:.4; cursor:not-allowed; }
.btn-spinner-sm { width:14px; height:14px; border-radius:50%; border:2px solid currentColor; border-top-color:transparent; animation:spin 1s linear infinite; }

/* Reviewed state */
.sub-reviewed { display:flex; align-items:center; gap:.35rem; font-size:.8rem; color:var(--on-surface-variant); padding:.5rem 0; }

/* Modal */
.modal-overlay { position:fixed; inset:0; z-index:600; background:rgba(0,0,0,.6); backdrop-filter:blur(6px); display:flex; align-items:flex-end; justify-content:center; padding:0; }
@media (min-width:600px) { .modal-overlay { align-items:center; padding:1rem; } }
.modal-box     { width:100%; max-width:480px; background:var(--surface-container-lowest); border-radius:24px 24px 0 0; display:flex; flex-direction:column; max-height:92vh; overflow-y:auto; padding-bottom:calc(env(safe-area-inset-bottom,0px)); box-shadow:0 -8px 40px rgba(0,0,0,.2); }
@media (min-width:600px) { .modal-box { border-radius:24px; padding-bottom:0; } }
.modal-hdr     { display:flex; align-items:center; gap:.75rem; padding:1.25rem 1.5rem 1rem; border-bottom:1px solid var(--outline-variant); position:sticky; top:0; background:var(--surface-container-lowest); z-index:1; }
.modal-hdr-icon { width:40px; height:40px; border-radius:11px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.modal-title   { font-family:var(--font-headline); font-size:1.05rem; font-weight:800; color:var(--on-surface); flex:1; }
.modal-close   { width:34px; height:34px; border-radius:50%; border:none; background:var(--surface-container); color:var(--on-surface-variant); display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; }
.modal-body    { padding:1.25rem 1.5rem; display:flex; flex-direction:column; gap:.875rem; }
.modal-sub     { font-size:.875rem; color:var(--on-surface-variant); }
.modal-footer  { display:flex; gap:.75rem; padding:1rem 1.5rem 1.5rem; }
.reject-user-info { background:var(--surface-container-low); border-radius:10px; padding:.75rem 1rem; display:flex; flex-direction:column; gap:.15rem; }
.reject-user-info strong { font-family:var(--font-headline); font-size:.9rem; color:var(--on-surface); }
.reject-user-info span   { font-size:.78rem; color:var(--on-surface-variant); }
.reject-textarea { width:100%; padding:.875rem 1rem; border-radius:12px; border:1.5px solid var(--outline-variant); background:var(--surface-container); color:var(--on-surface); font-size:.875rem; resize:vertical; outline:none; font-family:inherit; min-height:100px; box-sizing:border-box; }
.reject-textarea:focus { border-color:var(--primary); }
.reject-presets { display:flex; flex-wrap:wrap; gap:.5rem; }
.preset-tag    { padding:.35rem .875rem; border-radius:999px; border:1.5px solid var(--outline-variant); background:var(--surface-container); font-size:.75rem; font-weight:600; color:var(--on-surface-variant); cursor:pointer; transition:all .15s; }
.preset-tag:hover { border-color:var(--primary); color:var(--primary); background:rgba(99,14,212,.06); }
.btn-ghost     { flex:1; display:flex; align-items:center; justify-content:center; gap:.4rem; padding:.75rem 1rem; border-radius:12px; background:transparent; border:1.5px solid var(--outline-variant); font-family:var(--font-headline); font-size:.9rem; font-weight:700; color:var(--on-surface); cursor:pointer; }
.btn-danger    { flex:2; display:flex; align-items:center; justify-content:center; gap:.4rem; padding:.75rem 1rem; border-radius:12px; background:#ef4444; color:#fff; border:none; font-family:var(--font-headline); font-size:.9rem; font-weight:700; cursor:pointer; }
.btn-danger:disabled { opacity:.5; cursor:not-allowed; }
.modal-enter-active, .modal-leave-active { transition:all .25s ease; }
.modal-enter-from, .modal-leave-to { opacity:0; transform:translateY(24px); }
</style>
