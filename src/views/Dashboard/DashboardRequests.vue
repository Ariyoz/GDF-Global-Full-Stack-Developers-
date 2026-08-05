<template>
  <div class="req-view">

    <!-- Header -->
    <div class="req-header">
      <div class="req-header-left">
        <div class="req-header-icon">
          <span class="material-symbols-outlined" style="font-size:22px">handshake</span>
        </div>
        <div>
          <h2 class="req-title">{{ view === 'sent' ? 'Hire Requests Sent' : 'Incoming Hire Requests' }}</h2>
          <p class="req-sub">{{ view === 'sent' ? 'Track all developers you have reached out to hire' : 'Developers who want to work with you' }}</p>
        </div>
      </div>
      <div class="req-header-actions">
        <button class="req-refresh-btn" @click="load" :disabled="loading">
          <span class="material-symbols-outlined" :class="{ spin: loading }">refresh</span>
        </button>
        <RouterLink v-if="isClient" to="/explore" class="req-new-btn">
          <span class="material-symbols-outlined" style="font-size:16px">search</span>
          Find Developers
        </RouterLink>
      </div>
    </div>

    <!-- View toggle (developer sees both tabs) -->
    <div class="req-tabs" v-if="!isClientOnly">
      <button class="req-tab" :class="{ active: view === 'received' }" @click="view = 'received'; load()">
        <span class="material-symbols-outlined" style="font-size:16px">inbox</span>
        Received
        <span v-if="received.length" class="req-tab-badge">{{ received.length }}</span>
      </button>
      <button class="req-tab" :class="{ active: view === 'sent' }" @click="view = 'sent'; load()">
        <span class="material-symbols-outlined" style="font-size:16px">send</span>
        Sent
        <span v-if="sent.length" class="req-tab-badge req-tab-badge-muted">{{ sent.length }}</span>
      </button>
    </div>

    <!-- Loading skeletons -->
    <template v-if="loading && !items.length">
      <div v-for="i in 4" :key="i" class="req-skel">
        <div class="skel-av shimmer"></div>
        <div class="skel-body">
          <div class="shimmer skel-line skel-l1"></div>
          <div class="shimmer skel-line skel-l2"></div>
        </div>
        <div class="shimmer skel-badge"></div>
      </div>
    </template>

    <!-- Empty state -->
    <div v-else-if="!items.length" class="req-empty">
      <div class="req-empty-icon">
        <span class="material-symbols-outlined">{{ view === 'received' ? 'inbox' : 'send' }}</span>
      </div>
      <h3 class="req-empty-title">{{ view === 'received' ? 'No hire requests yet' : 'No hires sent yet' }}</h3>
      <p class="req-empty-sub">
        {{ view === 'received'
          ? 'When clients want to hire you, their requests will appear here.'
          : 'Browse developers on Explore and send your first hire request.' }}
      </p>
      <RouterLink v-if="view === 'sent'" to="/explore" class="req-new-btn">
        <span class="material-symbols-outlined" style="font-size:16px">search</span>
        Find a Developer
      </RouterLink>
    </div>

    <!-- Request cards -->
    <div v-else class="req-list">
      <div
        v-for="(req, i) in items" :key="req.id"
        class="req-card animate-fade-in-up"
        :class="`delay-${i * 60}`"
        @click="openConversation(req)"
      >
        <!-- Left: avatar + info -->
        <div class="req-card-left">
          <div class="req-av-wrap">
            <img v-if="view === 'received' ? req.client_avatar : req.developer_avatar"
              :src="view === 'received' ? req.client_avatar : req.developer_avatar"
              class="req-av-img" alt="" />
            <div v-else class="req-av-ini">
              {{ initials(view === 'received' ? req.client_name : req.developer_name) }}
            </div>
            <div class="req-av-badge">
              <span class="material-symbols-outlined" style="font-size:11px">
                {{ view === 'received' ? 'person' : 'code' }}
              </span>
            </div>
          </div>

          <div class="req-card-info">
            <div class="req-card-top">
              <span class="req-person-name">
                {{ view === 'received' ? req.client_name : req.developer_name }}
              </span>
              <span class="req-card-time">{{ formatTime(req.created_at) }}</span>
            </div>
            <div class="req-project-row">
              <span class="material-symbols-outlined" style="font-size:13px;color:var(--primary)">folder</span>
              <span class="req-project-name">{{ req.project_title }}</span>
            </div>
            <p class="req-preview">{{ cleanPreview(req.preview) }}</p>
          </div>
        </div>

        <!-- Right: status + action -->
        <div class="req-card-right">
          <span class="req-status-badge" :class="statusClass(req.status)">
            <span class="req-status-dot"></span>
            {{ statusLabel(req.status) }}
          </span>
          <button class="req-open-btn" @click.stop="openConversation(req)">
            <span class="material-symbols-outlined" style="font-size:16px">chat</span>
            {{ view === 'received' ? 'Reply' : 'View' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useMessagingStore } from '@/store/messaging'
import { hireService } from '@/services/hire.service'

const router = useRouter()
const authStore = useAuthStore()
const messagingStore = useMessagingStore()

const loading  = ref(false)
const sent     = ref([])
const received = ref([])
const view     = ref('received')

// Show both tabs for everyone — anyone can send or receive hire requests
const isClient     = computed(() => authStore.isClient)
const isClientOnly = computed(() => false) // always show both tabs

const items = computed(() => view.value === 'sent' ? sent.value : received.value)

async function load() {
  loading.value = true
  try {
    // Always fetch both — any user can send AND receive hire requests
    const [s, r] = await Promise.all([
      hireService.getSentRequests().catch(() => []),
      hireService.getReceivedRequests().catch(() => []),
    ])
    sent.value     = s
    received.value = r
  } catch (e) {
    console.error('Failed to load hire requests:', e)
  } finally {
    loading.value = false
  }
}

function initials(name) {
  if (!name) return 'U'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function cleanPreview(text) {
  if (!text) return ''
  // Strip the hire request header lines
  return text
    .replace(/──.*──+/g, '')
    .replace(/From:.*\n?/g, '')
    .replace(/Company:.*\n?/g, '')
    .replace(/Email:.*\n?/g, '')
    .replace(/Project Type:.*\n?/g, '')
    .replace(/\n{2,}/g, ' ')
    .trim()
    .slice(0, 100)
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const diff = (Date.now() - d) / 1000
  if (diff < 60)     return 'just now'
  if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function statusClass(status) {
  if (status === 'sent' || status === 'pending') return 'status-pending'
  if (status === 'active') return 'status-active'
  if (status === 'completed') return 'status-done'
  return 'status-pending'
}

function statusLabel(status) {
  if (status === 'sent') return 'Sent'
  if (status === 'pending') return 'Pending'
  if (status === 'active') return 'Active'
  if (status === 'completed') return 'Completed'
  return 'Pending'
}

async function openConversation(req) {
  if (!req.conversation_id) return
  // Navigate to messaging with this conversation open
  router.push(`/messaging?conv=${req.conversation_id}`)
}

onMounted(async () => {
  // Start on sent tab so user immediately sees what they sent
  view.value = 'sent'
  await load()
})
</script>

<style scoped>
/* ══ Layout ══════════════════════════════════════════════════════════════════ */
.req-view {
  display: flex; flex-direction: column; gap: 1.5rem;
  padding-bottom: 3rem;
}

/* ══ Header ══════════════════════════════════════════════════════════════════ */
.req-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 1rem; flex-wrap: wrap;
}
.req-header-left { display: flex; align-items: center; gap: 1rem; }
.req-header-icon {
  width: 48px; height: 48px; border-radius: 14px;
  background: linear-gradient(135deg, rgba(99,14,212,.15) 0%, rgba(99,14,212,.08) 100%);
  border: 1px solid rgba(99,14,212,.2);
  display: flex; align-items: center; justify-content: center;
  color: var(--primary); flex-shrink: 0;
}
.req-title {
  font-family: var(--font-headline); font-size: 1.35rem; font-weight: 800;
  color: var(--on-surface); letter-spacing: -.02em; margin: 0;
}
.req-sub { font-size: .82rem; color: var(--on-surface-variant); margin: .15rem 0 0; }
.req-header-actions { display: flex; align-items: center; gap: .625rem; flex-shrink: 0; }
.req-refresh-btn {
  width: 38px; height: 38px; border-radius: 50%; border: 1.5px solid var(--outline-variant);
  background: var(--surface-container); color: var(--on-surface-variant);
  display: flex; align-items: center; justify-content: center; cursor: pointer;
  transition: all .15s;
}
.req-refresh-btn:hover { border-color: var(--primary); color: var(--primary); }
.req-refresh-btn .material-symbols-outlined { font-size: 18px; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.req-new-btn {
  display: inline-flex; align-items: center; gap: .375rem;
  padding: .6rem 1.25rem; border-radius: 12px;
  background: var(--gradient-primary); color: #fff; border: none;
  font-family: var(--font-headline); font-size: .875rem; font-weight: 700;
  text-decoration: none; cursor: pointer; transition: all .2s;
  box-shadow: 0 4px 16px rgba(99,14,212,.3); white-space: nowrap;
}
.req-new-btn:hover { opacity: .9; transform: translateY(-1px); }

/* ══ Tabs ════════════════════════════════════════════════════════════════════ */
.req-tabs {
  display: flex; gap: .375rem;
  background: var(--surface-container-low);
  border: 1px solid var(--outline-variant);
  border-radius: 14px; padding: .3rem; width: fit-content;
}
.req-tab {
  display: flex; align-items: center; gap: .375rem;
  padding: .5rem 1rem; border-radius: 10px; border: none;
  font-family: var(--font-headline); font-size: .85rem; font-weight: 600;
  color: var(--on-surface-variant); background: none; cursor: pointer;
  transition: all .2s; white-space: nowrap;
}
.req-tab.active {
  background: var(--surface-container-lowest); color: var(--primary);
  box-shadow: 0 1px 4px rgba(0,0,0,.08);
}
.req-tab-badge {
  min-width: 20px; height: 20px; border-radius: 10px;
  background: var(--primary); color: #fff;
  font-size: .6rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center; padding: 0 4px;
}
.req-tab-badge-muted { background: var(--surface-container-high); color: var(--on-surface-variant); }

/* ══ Skeletons ═══════════════════════════════════════════════════════════════ */
.req-skel {
  display: flex; align-items: center; gap: 1rem;
  padding: 1.125rem 1.25rem;
  background: var(--surface-container-lowest); border: 1px solid var(--outline-variant);
  border-radius: 16px;
}
.skel-av { width: 48px; height: 48px; border-radius: 50%; flex-shrink: 0; }
.skel-body { flex: 1; display: flex; flex-direction: column; gap: .5rem; }
.skel-line { height: 12px; border-radius: 4px; }
.skel-l1 { width: 55%; }
.skel-l2 { width: 35%; }
.skel-badge { width: 72px; height: 26px; border-radius: 8px; flex-shrink: 0; }
.shimmer {
  background: linear-gradient(90deg, var(--surface-container) 25%, var(--surface-container-high) 50%, var(--surface-container) 75%);
  background-size: 200% 100%; animation: shimmer 1.4s infinite;
}
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

/* ══ Empty State ══════════════════════════════════════════════════════════════ */
.req-empty {
  display: flex; flex-direction: column; align-items: center; gap: .875rem;
  padding: 4rem 1.5rem; text-align: center;
  background: var(--surface-container-lowest); border: 1.5px dashed var(--outline-variant);
  border-radius: 20px;
}
.req-empty-icon {
  width: 72px; height: 72px; border-radius: 50%;
  background: var(--surface-container);
  display: flex; align-items: center; justify-content: center;
}
.req-empty-icon .material-symbols-outlined { font-size: 32px; color: var(--on-surface-variant); opacity: .4; }
.req-empty-title { font-family: var(--font-headline); font-size: 1.05rem; font-weight: 700; color: var(--on-surface); margin: 0; }
.req-empty-sub { font-size: .875rem; color: var(--on-surface-variant); max-width: 340px; line-height: 1.6; margin: 0; }

/* ══ Request List ══════════════════════════════════════════════════════════════ */
.req-list { display: flex; flex-direction: column; gap: .75rem; }

.req-card {
  display: flex; align-items: center; gap: 1rem;
  padding: 1.125rem 1.25rem;
  background: var(--surface-container-lowest);
  border: 1.5px solid var(--outline-variant);
  border-radius: 18px;
  cursor: pointer;
  transition: all .2s cubic-bezier(0.34,1.56,0.64,1);
  position: relative; overflow: hidden;
}
.req-card::before {
  content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
  background: var(--gradient-primary); border-radius: 2px 0 0 2px;
  opacity: 0; transition: opacity .2s;
}
.req-card:hover {
  border-color: rgba(99,14,212,.3);
  box-shadow: 0 4px 20px rgba(99,14,212,.08);
  transform: translateY(-2px);
}
.req-card:hover::before { opacity: 1; }

/* Card left side */
.req-card-left {
  display: flex; align-items: center; gap: .875rem; flex: 1; min-width: 0;
}

/* Avatar */
.req-av-wrap {
  width: 48px; height: 48px; border-radius: 50%;
  position: relative; flex-shrink: 0;
}
.req-av-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block; }
.req-av-ini {
  width: 100%; height: 100%; border-radius: 50%;
  background: var(--gradient-primary);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-headline); font-size: .875rem; font-weight: 800; color: #fff;
}
.req-av-badge {
  position: absolute; bottom: -2px; right: -2px;
  width: 18px; height: 18px; border-radius: 50%;
  background: var(--surface-container-lowest); border: 1.5px solid var(--outline-variant);
  display: flex; align-items: center; justify-content: center;
  color: var(--primary);
}

/* Card info */
.req-card-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: .2rem; }
.req-card-top { display: flex; align-items: center; justify-content: space-between; gap: .5rem; }
.req-person-name {
  font-family: var(--font-headline); font-size: .9rem; font-weight: 700;
  color: var(--on-surface); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.req-card-time { font-size: .7rem; color: var(--on-surface-variant); flex-shrink: 0; }
.req-project-row {
  display: flex; align-items: center; gap: .3rem;
}
.req-project-name {
  font-family: var(--font-headline); font-size: .8rem; font-weight: 600; color: var(--primary);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.req-preview {
  font-size: .75rem; color: var(--on-surface-variant); line-height: 1.4;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin: 0;
}

/* Card right side */
.req-card-right {
  display: flex; flex-direction: column; align-items: flex-end; gap: .5rem; flex-shrink: 0;
}
.req-status-badge {
  display: inline-flex; align-items: center; gap: .3rem;
  padding: .2rem .625rem; border-radius: 999px;
  font-size: .68rem; font-weight: 700; text-transform: capitalize;
}
.req-status-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
.status-pending .req-status-dot { background: #f59e0b; }
.status-pending { background: rgba(245,158,11,.1); color: #f59e0b; }
.status-active .req-status-dot { background: #22c55e; animation: pulse-dot 1.5s ease-in-out infinite; }
.status-active { background: rgba(34,197,94,.1); color: #16a34a; }
.status-done .req-status-dot { background: var(--primary); }
.status-done { background: rgba(99,14,212,.1); color: var(--primary); }
@keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:.4} }

.req-open-btn {
  display: inline-flex; align-items: center; gap: .25rem;
  padding: .35rem .875rem; border-radius: 8px;
  background: var(--surface-container); border: 1.5px solid var(--outline-variant);
  font-family: var(--font-headline); font-size: .75rem; font-weight: 700;
  color: var(--on-surface); cursor: pointer; transition: all .15s; white-space: nowrap;
}
.req-open-btn:hover { border-color: var(--primary); color: var(--primary); background: rgba(99,14,212,.06); }

/* ══ Mobile ══════════════════════════════════════════════════════════════════ */
@media (max-width: 640px) {
  .req-card { flex-direction: column; align-items: flex-start; gap: .875rem; }
  .req-card-left { width: 100%; }
  .req-card-right { flex-direction: row; align-items: center; width: 100%; justify-content: space-between; }
  .req-card-top { flex-direction: column; align-items: flex-start; gap: .1rem; }
  .req-card-time { align-self: flex-end; }
  .req-title { font-size: 1.15rem; }
  .req-header-left { gap: .75rem; }
  .req-header-icon { width: 40px; height: 40px; border-radius: 12px; }
}
</style>
