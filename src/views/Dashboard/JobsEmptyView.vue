<template>
  <div class="my-jobs-view">
    <div class="page-header">
      <div>
        <h1 class="text-headline-lg">My Jobs</h1>
        <p class="text-body-md" style="margin-top:0.25rem">
          {{ isClient ? 'Manage your posted jobs and applicants.' : 'Track your job applications and their status.' }}
        </p>
      </div>
      <button v-if="isClient" class="btn-primary post-btn" @click="goPostJob">
        <span class="material-symbols-outlined" style="font-size:18px">add</span>
        Post a Job
      </button>
    </div>

    <!-- Tabs (Client only) -->
    <div v-if="isClient" class="tab-row">
      <button class="tab-btn" :class="{ active: tab === 'open' }" @click="tab = 'open'">Open</button>
      <button class="tab-btn" :class="{ active: tab === 'closed' }" @click="tab = 'closed'">Closed</button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="jobs-grid">
      <div v-for="i in 3" :key="i" class="job-skeleton">
        <div class="sk sk-logo shimmer"></div>
        <div class="sk-lines">
          <div class="sk sk-t1 shimmer"></div>
          <div class="sk sk-t2 shimmer"></div>
        </div>
      </div>
    </div>

    <!-- CLIENT: Posted Jobs -->
    <template v-else-if="isClient">
      <div v-if="filteredPostedJobs.length" class="jobs-grid">
        <div v-for="job in filteredPostedJobs" :key="job.id" class="job-card-my">
          <div class="jcm-header">
            <div class="jcm-logo">
              <img v-if="job.company_logo" :src="job.company_logo" :alt="job.company" />
              <span v-else>{{ (job.company || 'C')[0] }}</span>
            </div>
            <div class="jcm-info">
              <h3 class="jcm-title">{{ job.title }}</h3>
              <p class="jcm-company">{{ job.company }}</p>
            </div>
            <span class="jcm-status-badge" :class="job.status">{{ job.status }}</span>
          </div>
          <div class="jcm-meta">
            <span class="job-tag">{{ job.job_type?.replace('_',' ') }}</span>
            <span v-if="job.is_remote" class="job-tag remote">Remote</span>
            <span v-if="job.location" class="job-tag">{{ job.location }}</span>
          </div>
          <div class="jcm-stats">
            <span><span class="material-symbols-outlined" style="font-size:13px">visibility</span> {{ job.view_count || 0 }} views</span>
            <span><span class="material-symbols-outlined" style="font-size:13px">description</span> {{ job.application_count || 0 }} applications</span>
            <span class="jcm-time">{{ formatTime(job.created_at) }}</span>
          </div>
          <div class="jcm-actions">
            <button class="jcm-btn jcm-btn-primary" @click="viewApplicants(job)">
              <span class="material-symbols-outlined">group</span>
              Applicants ({{ job.application_count || 0 }})
            </button>
            <button class="jcm-btn" @click="editJob(job)">
              <span class="material-symbols-outlined">edit</span>
              Edit
            </button>
            <button v-if="job.status !== 'closed'" class="jcm-btn jcm-btn-danger" @click="closeJob(job)">
              <span class="material-symbols-outlined">lock</span>
              Close
            </button>
            <button class="jcm-btn jcm-btn-del" @click="deleteJob(job)">
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <span class="material-symbols-outlined" style="font-size:3rem;opacity:.3">work_off</span>
        <p>No {{ tab }} jobs yet</p>
        <button class="btn-primary" @click="goPostJob">Post your first job</button>
      </div>
    </template>

    <!-- DEVELOPER: Applied Jobs -->
    <template v-else>
      <div v-if="myApplications.length" class="jobs-grid">
        <div v-for="app in myApplications" :key="app.id" class="app-card">
          <div class="app-header">
            <div class="app-info">
              <h3 class="app-title">{{ app.job_title }}</h3>
              <p class="app-company">{{ app.job_company }}</p>
              <p class="app-meta">{{ app.job_type?.replace('_',' ') }} · {{ app.is_remote ? 'Remote' : app.location }}</p>
            </div>
            <span class="app-status" :class="app.status">{{ app.status }}</span>
          </div>
          <div v-if="app.salary_min" class="app-salary">
            {{ fmtSalary(app.salary_min) }}{{ app.salary_max ? ' – ' + fmtSalary(app.salary_max) : '' }}/yr
          </div>
          <p class="app-date">Applied {{ formatTime(app.created_at) }}</p>
        </div>
      </div>
      <div v-else class="empty-state">
        <span class="material-symbols-outlined" style="font-size:3rem;opacity:.3">work_history</span>
        <p>No applications yet</p>
        <RouterLink to="/jobs" class="btn-primary">Browse Jobs</RouterLink>
      </div>
    </template>

    <!-- Applicants Modal -->
    <Transition name="modal">
      <div v-if="showApplicants" class="modal-overlay" @click.self="showApplicants = false">
        <div class="applicants-modal">
          <div class="modal-hdr">
            <h2>Applicants — {{ currentJob?.title }}</h2>
            <button @click="showApplicants = false"><span class="material-symbols-outlined">close</span></button>
          </div>
          <div class="modal-body">
            <div v-if="!applicants.length" class="empty-state" style="padding:2rem">
              <span class="material-symbols-outlined" style="font-size:2rem;opacity:.3">person_off</span>
              <p>No applicants yet</p>
            </div>
            <div v-for="a in applicants" :key="a.id" class="applicant-row">
              <div class="ap-av">
                <img v-if="a.applicant_avatar" :src="a.applicant_avatar" />
                <span v-else>{{ (a.applicant_name||'U')[0] }}</span>
              </div>
              <div class="ap-info">
                <p class="ap-name">{{ a.applicant_name }}</p>
                <p class="ap-meta">{{ a.years_experience ? a.years_experience + ' yrs' : '' }} · {{ a.availability || 'Flexible' }}</p>
                <p v-if="a.cover_letter" class="ap-cover">{{ a.cover_letter.slice(0,100) }}...</p>
                <div class="ap-links">
                  <a v-if="a.resume_url" :href="a.resume_url" target="_blank">📄 Resume</a>
                  <a v-if="a.portfolio_url" :href="a.portfolio_url" target="_blank">🌐 Portfolio</a>
                  <a v-if="a.github_url" :href="a.github_url" target="_blank">💻 GitHub</a>
                </div>
              </div>
              <div class="ap-status-col">
                <span class="applicant-status" :class="a.status">{{ a.status }}</span>
                <div class="ap-btns" v-if="a.status === 'pending' || a.status === 'reviewed'">
                  <button class="ap-btn ap-ok" @click="updateStatus(a,'shortlisted')">Shortlist</button>
                  <button class="ap-btn ap-no" @click="updateStatus(a,'rejected')">Decline</button>
                </div>
                <div class="ap-btns" v-else-if="a.status === 'shortlisted'">
                  <button class="ap-btn ap-ok" @click="updateStatus(a,'accepted')">Accept</button>
                  <button class="ap-btn ap-no" @click="updateStatus(a,'rejected')">Decline</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Edit Job Modal (reuse JobsView logic) -->
    <Transition name="modal">
      <div v-if="showEdit" class="modal-overlay" @click.self="showEdit = false">
        <div class="applicants-modal">
          <div class="modal-hdr">
            <h2>Edit Job</h2>
            <button @click="showEdit = false"><span class="material-symbols-outlined">close</span></button>
          </div>
          <div class="modal-body">
            <div class="form-fields">
              <div class="form-field"><label>Job Title *</label><input v-model="ef.title" type="text" /></div>
              <div class="form-field"><label>Company</label><input v-model="ef.company" type="text" /></div>
              <div class="form-field"><label>Company Logo URL</label><input v-model="ef.company_logo" type="url" placeholder="https://..." /></div>
              <div class="form-field"><label>Company Website</label><input v-model="ef.company_url" type="url" placeholder="https://..." /></div>
              <div class="form-field"><label>Description *</label><textarea v-model="ef.description" rows="3"></textarea></div>
              <div class="form-field"><label>Requirements</label><textarea v-model="ef.requirements" rows="2"></textarea></div>
              <div class="form-field"><label>Skills (comma separated)</label><input v-model="ef.skillsText" type="text" /></div>
              <div class="form-field"><label>Job Type</label>
                <select v-model="ef.job_type">
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="freelance">Freelance</option>
                  <option value="remote">Remote</option>
                </select>
              </div>
              <div class="form-field"><label>Location</label><input v-model="ef.location" type="text" /></div>
              <div class="form-row">
                <div class="form-field"><label>Min Salary ($)</label><input v-model.number="ef.salary_min" type="number" /></div>
                <div class="form-field"><label>Max Salary ($)</label><input v-model.number="ef.salary_max" type="number" /></div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-primary" @click="saveEdit" :disabled="editSaving">
              {{ editSaving ? 'Saving…' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useUiStore } from '@/store/ui'
import { useCurrencyStore } from '@/store/currency'
import http from '@/services/http'

const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUiStore()
const currencyStore = useCurrencyStore()

const isClient = computed(() => authStore.profile?.role === 'client' || authStore.profile?.role === 'admin')
const loading = ref(true)
const tab = ref('open')

// Client: posted jobs
const postedJobs = ref([])
const filteredPostedJobs = computed(() =>
  postedJobs.value.filter(j => tab.value === 'closed' ? j.status === 'closed' : j.status !== 'closed')
)

// Developer: applications
const myApplications = ref([])

// Applicants modal
const showApplicants = ref(false)
const currentJob = ref(null)
const applicants = ref([])

// Edit modal
const showEdit = ref(false)
const editSaving = ref(false)
const ef = ref({ id:'', title:'', company:'', company_logo:'', company_url:'', description:'', requirements:'', skillsText:'', job_type:'full_time', location:'', salary_min:null, salary_max:null })

const fmtSalary = (v) => currencyStore.format(v)

function formatTime(d) {
  if (!d) return ''
  const diff = (Date.now() - new Date(d)) / 1000
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff/86400)}d ago`
  return new Date(d).toLocaleDateString('en-US', { month:'short', day:'numeric' })
}

function goPostJob() { router.push('/jobs') }

async function load() {
  loading.value = true
  try {
    if (isClient.value) {
      const data = await http.get('/jobs/my-posted')
      postedJobs.value = data.jobs || []
    } else {
      const data = await http.get('/jobs/my-applications')
      myApplications.value = data.applications || []
    }
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

async function viewApplicants(job) {
  currentJob.value = job
  try {
    const data = await http.get(`/jobs/${job.id}/applications`)
    applicants.value = data.applications || []
    showApplicants.value = true
  } catch { uiStore.showError('Failed to load applicants') }
}

async function updateStatus(app, status) {
  try {
    await http.patch(`/jobs/applications/${app.id}`, { status })
    app.status = status
    uiStore.showSuccess(status === 'accepted' ? '🎉 Accepted!' : status === 'shortlisted' ? 'Shortlisted!' : 'Declined')
  } catch { uiStore.showError('Failed to update') }
}

function editJob(job) {
  ef.value = {
    id: job.id, title: job.title||'', company: job.company||'',
    company_logo: job.company_logo||'', company_url: job.company_url||'',
    description: job.description||'', requirements: job.requirements||'',
    skillsText: (job.skills_required||[]).join(', '),
    job_type: job.job_type||'full_time', location: job.location||'',
    salary_min: job.salary_min||null, salary_max: job.salary_max||null,
  }
  showEdit.value = true
}

async function saveEdit() {
  editSaving.value = true
  try {
    await http.patch(`/jobs/${ef.value.id}`, {
      title: ef.value.title, company: ef.value.company||undefined,
      company_logo: ef.value.company_logo||undefined, company_url: ef.value.company_url||undefined,
      description: ef.value.description, requirements: ef.value.requirements||undefined,
      skills_required: ef.value.skillsText ? ef.value.skillsText.split(',').map(s=>s.trim()).filter(Boolean) : [],
      job_type: ef.value.job_type, location: ef.value.location||undefined,
      salary_min: ef.value.salary_min||undefined, salary_max: ef.value.salary_max||undefined,
      is_remote: !ef.value.location || ef.value.location.toLowerCase().includes('remote'),
    })
    uiStore.showSuccess('Job updated!')
    showEdit.value = false
    await load()
  } catch { uiStore.showError('Failed to update job') }
  finally { editSaving.value = false }
}

async function closeJob(job) {
  if (!confirm('Close this job?')) return
  try {
    await http.patch(`/jobs/${job.id}/close`, {})
    job.status = 'closed'
    uiStore.showSuccess('Job closed')
  } catch { uiStore.showError('Failed to close job') }
}

async function deleteJob(job) {
  if (!confirm('Delete this job posting?')) return
  try {
    await http.request({ method:'DELETE', url:`/jobs/${job.id}` })
    postedJobs.value = postedJobs.value.filter(j => j.id !== job.id)
    uiStore.showSuccess('Job deleted')
  } catch { uiStore.showError('Failed to delete job') }
}

onMounted(load)
</script>

<style scoped>
.my-jobs-view { display:flex; flex-direction:column; gap:1.25rem; padding-bottom:2rem; }
.page-header { display:flex; align-items:flex-start; justify-content:space-between; gap:1rem; flex-wrap:wrap; }
.post-btn { display:flex; align-items:center; gap:.35rem; white-space:nowrap; }

/* Tabs */
.tab-row { display:flex; gap:.5rem; }
.tab-btn { padding:.45rem 1.25rem; border-radius:var(--radius-full); border:1.5px solid var(--outline-variant); background:var(--surface-container); font-size:.85rem; font-weight:600; color:var(--on-surface-variant); cursor:pointer; transition:.15s; }
.tab-btn.active { background:var(--primary); color:#fff; border-color:var(--primary); }

/* Skeleton */
.jobs-grid { display:flex; flex-direction:column; gap:.875rem; }
.job-skeleton { display:flex; align-items:center; gap:.75rem; padding:1rem; background:var(--surface-container-lowest); border:1px solid var(--outline-variant); border-radius:var(--radius-xl); }
.sk { border-radius:6px; }
.sk-logo { width:44px; height:44px; border-radius:var(--radius-lg); flex-shrink:0; }
.sk-lines { flex:1; display:flex; flex-direction:column; gap:.4rem; }
.sk-t1 { height:12px; width:60%; }
.sk-t2 { height:10px; width:35%; }
.shimmer { background:linear-gradient(90deg,var(--surface-container) 25%,var(--surface-container-high) 50%,var(--surface-container) 75%); background-size:200% 100%; animation:shimmer 1.4s infinite; }
@keyframes shimmer { 0%{background-position:200%}100%{background-position:-200%} }

/* Posted job card */
.job-card-my { padding:1rem; background:var(--surface-container-lowest); border:1px solid var(--outline-variant); border-radius:var(--radius-xl); display:flex; flex-direction:column; gap:.75rem; }
.jcm-header { display:flex; align-items:center; gap:.75rem; }
.jcm-logo { width:44px; height:44px; border-radius:var(--radius-lg); background:var(--primary-fixed); display:flex; align-items:center; justify-content:center; flex-shrink:0; overflow:hidden; font-family:var(--font-headline); font-weight:700; color:var(--primary); font-size:1rem; }
.jcm-logo img { width:100%; height:100%; object-fit:cover; }
.jcm-info { flex:1; min-width:0; }
.jcm-title { font-family:var(--font-headline); font-size:.9rem; font-weight:700; color:var(--on-surface); }
.jcm-company { font-size:.78rem; color:var(--on-surface-variant); }
.jcm-status-badge { padding:.2rem .6rem; border-radius:var(--radius-full); font-size:.68rem; font-weight:700; text-transform:capitalize; flex-shrink:0; }
.jcm-status-badge.open { background:rgba(34,197,94,.1); color:#16a34a; }
.jcm-status-badge.closed { background:rgba(239,68,68,.1); color:#ef4444; }
.jcm-meta { display:flex; flex-wrap:wrap; gap:.35rem; }
.job-tag { padding:.2rem .5rem; background:var(--surface-container); border-radius:var(--radius-full); font-size:.7rem; font-weight:500; color:var(--on-surface-variant); text-transform:capitalize; }
.job-tag.remote { background:rgba(34,197,94,.1); color:#16a34a; }
.jcm-stats { display:flex; gap:1rem; font-size:.75rem; color:var(--on-surface-variant); align-items:center; }
.jcm-stats span { display:flex; align-items:center; gap:.2rem; }
.jcm-time { margin-left:auto; }

/* Action buttons row */
.jcm-actions { display:flex; gap:.5rem; flex-wrap:wrap; }
.jcm-btn { display:flex; align-items:center; gap:.3rem; padding:.45rem .75rem; border-radius:var(--radius-lg); border:1px solid var(--outline-variant); background:var(--surface-container); font-size:.78rem; font-weight:600; color:var(--on-surface-variant); cursor:pointer; transition:.15s; white-space:nowrap; }
.jcm-btn:hover { border-color:var(--primary); color:var(--primary); }
.jcm-btn .material-symbols-outlined { font-size:15px; }
.jcm-btn-primary { background:var(--primary); color:#fff; border-color:var(--primary); flex:1; justify-content:center; }
.jcm-btn-primary:hover { background:var(--primary-container); border-color:var(--primary-container); color:#fff; }
.jcm-btn-danger:hover { border-color:rgba(239,68,68,.4); color:#ef4444; background:rgba(239,68,68,.06); }
.jcm-btn-del:hover { border-color:rgba(239,68,68,.4); color:#ef4444; background:rgba(239,68,68,.06); }

/* Application card */
.app-card { padding:1rem; background:var(--surface-container-lowest); border:1px solid var(--outline-variant); border-radius:var(--radius-xl); display:flex; flex-direction:column; gap:.5rem; }
.app-header { display:flex; align-items:flex-start; justify-content:space-between; gap:.5rem; }
.app-info { flex:1; min-width:0; }
.app-title { font-family:var(--font-headline); font-size:.9rem; font-weight:700; color:var(--on-surface); }
.app-company { font-size:.8rem; color:var(--on-surface-variant); }
.app-meta { font-size:.72rem; color:var(--on-surface-variant); text-transform:capitalize; }
.app-salary { font-family:var(--font-headline); font-size:.85rem; font-weight:600; color:var(--primary); }
.app-date { font-size:.72rem; color:var(--on-surface-variant); }
.app-status { padding:.25rem .65rem; border-radius:var(--radius-full); font-size:.7rem; font-weight:700; text-transform:capitalize; flex-shrink:0; }
.app-status.pending { background:rgba(251,146,60,.1); color:#f59e0b; }
.app-status.shortlisted { background:rgba(34,197,94,.1); color:#16a34a; }
.app-status.accepted { background:rgba(168,85,247,.1); color:var(--primary); }
.app-status.rejected { background:rgba(239,68,68,.1); color:#ef4444; }
.app-status.reviewed { background:rgba(99,102,241,.1); color:#6366f1; }

/* Empty state */
.empty-state { display:flex; flex-direction:column; align-items:center; gap:1rem; padding:3rem 1rem; color:var(--on-surface-variant); text-align:center; }

/* Applicants modal */
.modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.5); z-index:1000; display:flex; align-items:flex-end; }
@media(min-width:640px) { .modal-overlay { align-items:center; padding:1rem; } }
.applicants-modal { width:100%; max-width:580px; max-height:85vh; display:flex; flex-direction:column; background:var(--surface-container-lowest); border-radius:var(--radius-2xl) var(--radius-2xl) 0 0; overflow:hidden; margin:0 auto; }
@media(min-width:640px) { .applicants-modal { border-radius:var(--radius-2xl); max-height:80vh; } }
.modal-hdr { display:flex; align-items:center; justify-content:space-between; padding:1.25rem; border-bottom:1px solid var(--outline-variant); flex-shrink:0; }
.modal-hdr h2 { font-family:var(--font-headline); font-size:1rem; font-weight:700; color:var(--on-surface); }
.modal-hdr button { width:36px; height:36px; border-radius:50%; border:none; background:none; color:var(--on-surface-variant); cursor:pointer; display:flex; align-items:center; justify-content:center; }
.modal-hdr button:hover { background:var(--surface-container); }
.modal-body { flex:1; overflow-y:auto; padding:1rem; display:flex; flex-direction:column; gap:.875rem; }
.modal-footer { padding:.875rem 1.25rem; border-top:1px solid var(--outline-variant); flex-shrink:0; }
.applicant-row { display:flex; align-items:flex-start; gap:.75rem; padding:.875rem; background:var(--surface-container-low); border-radius:var(--radius-xl); }
.ap-av { width:40px; height:40px; border-radius:50%; background:var(--primary-fixed); display:flex; align-items:center; justify-content:center; flex-shrink:0; font-family:var(--font-headline); font-weight:700; color:var(--primary); overflow:hidden; }
.ap-av img { width:100%; height:100%; object-fit:cover; border-radius:50%; }
.ap-info { flex:1; min-width:0; }
.ap-name { font-family:var(--font-headline); font-size:.875rem; font-weight:700; color:var(--on-surface); }
.ap-meta { font-size:.75rem; color:var(--on-surface-variant); }
.ap-cover { font-size:.78rem; color:var(--on-surface-variant); margin-top:.25rem; line-height:1.4; }
.ap-links { display:flex; gap:.5rem; margin-top:.35rem; flex-wrap:wrap; }
.ap-links a { font-size:.75rem; color:var(--primary); text-decoration:none; }
.ap-links a:hover { text-decoration:underline; }
.ap-status-col { display:flex; flex-direction:column; align-items:flex-end; gap:.4rem; flex-shrink:0; }
.applicant-status { padding:.2rem .5rem; border-radius:var(--radius-full); font-size:.68rem; font-weight:700; text-transform:capitalize; }
.applicant-status.pending { background:rgba(251,146,60,.1); color:#f59e0b; }
.applicant-status.shortlisted { background:rgba(34,197,94,.1); color:#16a34a; }
.applicant-status.accepted { background:rgba(168,85,247,.1); color:var(--primary); }
.applicant-status.rejected { background:rgba(239,68,68,.1); color:#ef4444; }
.ap-btns { display:flex; gap:.3rem; }
.ap-btn { padding:.3rem .625rem; border-radius:var(--radius-lg); border:1px solid; font-size:.72rem; font-weight:600; cursor:pointer; }
.ap-ok { border-color:rgba(34,197,94,.3); background:rgba(34,197,94,.08); color:#16a34a; }
.ap-no { border-color:rgba(239,68,68,.3); background:rgba(239,68,68,.08); color:#ef4444; }

/* Form fields (edit modal) */
.form-fields { display:flex; flex-direction:column; gap:.875rem; }
.form-field { display:flex; flex-direction:column; gap:.3rem; }
.form-field label { font-family:var(--font-headline); font-size:.8rem; font-weight:600; color:var(--on-surface); }
.form-field input, .form-field textarea, .form-field select { padding:.6rem .75rem; background:var(--surface-container-low); border:1px solid var(--outline-variant); border-radius:var(--radius-lg); font-size:.85rem; color:var(--on-surface); outline:none; resize:none; width:100%; }
.form-field input:focus, .form-field textarea:focus, .form-field select:focus { border-color:var(--primary); }
.form-row { display:grid; grid-template-columns:1fr 1fr; gap:.75rem; }

/* Transitions */
.modal-enter-active, .modal-leave-active { transition:opacity .2s, transform .25s; }
.modal-enter-from, .modal-leave-to { opacity:0; transform:translateY(20px); }
</style>
