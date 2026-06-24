<template>
  <div class="jobs-view">
    <!-- Header -->
    <div class="jobs-header">
      <h1 class="jobs-title">Jobs</h1>
      <div class="header-btns">
        <button v-if="isDeveloper" class="btn-my-apps" @click="fetchMyApplications">
          <span class="material-symbols-outlined">work_history</span>
          My Applications
        </button>
        <button v-if="isClient || authStore.profile?.role === 'admin'" class="btn-post-job" @click="showPostJob = true">
          <span class="material-symbols-outlined">add</span>
          Post Job
        </button>
      </div>
    </div>

    <!-- Search -->
    <div class="jobs-search">
      <span class="material-symbols-outlined search-icon">search</span>
      <input v-model="searchQuery" class="search-input" placeholder="Search jobs, skills, companies..." @input="debouncedSearch" />
    </div>

    <!-- Filters -->
    <div class="jobs-filters">
      <button v-for="f in filters" :key="f.value" class="filter-chip" :class="{ active: activeFilter === f.value }" @click="activeFilter = f.value; fetchJobs()">
        {{ f.label }}
      </button>
    </div>

    <!-- Jobs List -->
    <div class="jobs-list">
      <div v-for="job in jobs" :key="job.id" class="job-card" @click="selectedJob = job">
        <div class="job-card-header">
          <div class="job-company-logo">
            <img v-if="job.company_logo" :src="job.company_logo" :alt="job.company" class="company-logo-img" />
            <span v-else class="company-initials">{{ (job.company || 'C')[0] }}</span>
          </div>
          <div class="job-info">
            <h3 class="job-title">{{ job.title }}</h3>
            <p class="job-company">{{ job.company }}</p>
          </div>
        </div>
        <div class="job-meta">
          <span class="job-tag">{{ job.job_type?.replace('_', ' ') }}</span>
          <span v-if="job.is_remote" class="job-tag remote">Remote</span>
          <span v-if="job.location" class="job-tag">{{ job.location }}</span>
        </div>
        <p class="job-desc">{{ job.description?.slice(0, 120) }}{{ job.description?.length > 120 ? '...' : '' }}</p>
        <div class="job-footer">
          <span v-if="job.salary_min" class="job-salary">{{ fmtSalary(job.salary_min) }}{{ job.salary_max ? ' – ' + fmtSalary(job.salary_max) : '' }}/yr</span>
          <span class="job-time">{{ formatTime(job.created_at) }}</span>
          <button v-if="job.poster_name === authStore.profile?.full_name || isClient" class="job-delete-btn" @click.stop="deleteJob(job)" title="Delete job">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>

      <div v-if="loading" class="jobs-loading">
        <div v-for="i in 3" :key="i" class="skeleton-job">
          <div class="skeleton-shimmer" style="width:48px;height:48px;border-radius:12px;"></div>
          <div style="flex:1;">
            <div class="skeleton-shimmer" style="width:70%;height:14px;border-radius:4px;"></div>
            <div class="skeleton-shimmer" style="width:40%;height:12px;border-radius:4px;margin-top:6px;"></div>
          </div>
        </div>
      </div>

      <div v-if="!loading && jobs.length === 0" class="jobs-empty">
        <span class="material-symbols-outlined" style="font-size:3rem;color:var(--on-surface-variant)">work_off</span>
        <p>No jobs posted yet</p>
        <button v-if="isClient" class="btn-primary" @click="showPostJob = true">Post the first job</button>
        <p v-else style="font-size:0.85rem;">Check back later for new opportunities</p>
      </div>
    </div>

    <!-- Job Detail Modal -->
    <Transition name="modal">
      <div v-if="selectedJob" class="modal-overlay" @click.self="selectedJob = null">
        <div class="job-detail-modal">
          <div class="modal-header">
            <h2 class="modal-title">{{ selectedJob.title }}</h2>
            <button class="btn-ghost icon-only" @click="selectedJob = null">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="detail-company">
              <div class="job-company-logo">
                <img v-if="selectedJob.company_logo" :src="selectedJob.company_logo" class="company-logo-img" />
                <span v-else class="company-initials">{{ (selectedJob.company || 'C')[0] }}</span>
              </div>
              <div>
                <p class="detail-company-name">{{ selectedJob.company }}</p>
                <p class="detail-location">{{ selectedJob.location || 'Remote' }}</p>
              </div>
            </div>
            <div class="detail-tags">
              <span class="job-tag">{{ selectedJob.job_type?.replace('_', ' ') }}</span>
              <span v-if="selectedJob.is_remote" class="job-tag remote">Remote</span>
              <span v-if="selectedJob.experience_level" class="job-tag">{{ selectedJob.experience_level }}</span>
            </div>
            <div v-if="selectedJob.salary_min" class="detail-salary">
              💰 {{ fmtSalary(selectedJob.salary_min) }}{{ selectedJob.salary_max ? ' – ' + fmtSalary(selectedJob.salary_max) : '' }} / year
            </div>
            <div class="detail-section">
              <h4>Description</h4>
              <p>{{ selectedJob.description }}</p>
            </div>
            <div v-if="selectedJob.requirements" class="detail-section">
              <h4>Requirements</h4>
              <p>{{ selectedJob.requirements }}</p>
            </div>
            <div v-if="selectedJob.skills_required?.length" class="detail-section">
              <h4>Skills</h4>
              <div class="detail-skills">
                <span v-for="skill in selectedJob.skills_required" :key="skill" class="skill-chip">{{ skill }}</span>
              </div>
            </div>
            <div class="detail-stats">
              <span>👁 {{ selectedJob.view_count }} views</span>
              <span>📝 {{ selectedJob.application_count }} applications</span>
            </div>
          </div>
          <div class="modal-footer">
            <button v-if="isDeveloper" class="btn-primary apply-btn" @click="showApplyModal = true">
              <span class="material-symbols-outlined">send</span>
              Apply Now
            </button>
            <div v-else-if="isClient || selectedJob?.poster_name === authStore.profile?.full_name" class="modal-footer-row">
              <button class="btn-primary apply-btn" @click="viewApplicants(selectedJob); currentReviewJob.value = selectedJob">
                <span class="material-symbols-outlined">group</span>
                Applicants ({{ selectedJob?.application_count || 0 }})
              </button>
              <button v-if="selectedJob?.status !== 'closed'" class="btn-close-job" @click="closeJob(selectedJob)">
                <span class="material-symbols-outlined">lock</span>
                Close Job
              </button>
              <span v-else class="closed-badge">Closed</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Apply Modal -->
    <Transition name="modal">
      <div v-if="showApplyModal" class="modal-overlay" @click.self="showApplyModal = false">
        <div class="job-detail-modal">
          <div class="modal-header">
            <h2 class="modal-title">Apply to {{ selectedJob?.title }}</h2>
            <button class="btn-ghost icon-only" @click="showApplyModal = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-fields">
              <div class="form-field">
                <label>Cover Letter</label>
                <textarea v-model="applyForm.cover_letter" rows="4" placeholder="Why are you a great fit for this role?"></textarea>
              </div>
              <div class="form-field">
                <label>Resume URL</label>
                <input v-model="applyForm.resume_url" type="url" placeholder="https://drive.google.com/your-resume" />
              </div>
              <div class="form-field">
                <label>Portfolio URL</label>
                <input v-model="applyForm.portfolio_url" type="url" placeholder="https://yourportfolio.com" />
              </div>
              <div class="form-field">
                <label>GitHub URL</label>
                <input v-model="applyForm.github_url" type="url" placeholder="https://github.com/username" />
              </div>
              <div class="form-field">
                <label>Years of Experience</label>
                <input v-model.number="applyForm.years_experience" type="number" placeholder="3" />
              </div>
              <div class="form-field">
                <label>Availability</label>
                <select v-model="applyForm.availability">
                  <option value="immediately">Immediately</option>
                  <option value="2_weeks">2 Weeks Notice</option>
                  <option value="1_month">1 Month</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-primary apply-btn" @click="submitApplication" :disabled="!applyForm.cover_letter">
              Submit Application
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Post Job Modal -->
    <Transition name="modal">
      <div v-if="showPostJob" class="modal-overlay" @click.self="showPostJob = false">
        <div class="job-detail-modal">
          <div class="modal-header">
            <h2 class="modal-title">Post a Job</h2>
            <button class="btn-ghost icon-only" @click="showPostJob = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-fields">
              <div class="form-field">
                <label>Job Title *</label>
                <input v-model="jobForm.title" type="text" placeholder="Senior Frontend Developer" />
              </div>
              <div class="form-field">
                <label>Company Name</label>
                <input v-model="jobForm.company" type="text" placeholder="Your company name" />
              </div>
              <div class="form-field">
                <label>Description *</label>
                <textarea v-model="jobForm.description" rows="4" placeholder="Describe the role..."></textarea>
              </div>
              <div class="form-field">
                <label>Requirements</label>
                <textarea v-model="jobForm.requirements" rows="3" placeholder="What skills/experience are needed?"></textarea>
              </div>
              <div class="form-field">
                <label>Skills (comma separated)</label>
                <input v-model="jobForm.skillsText" type="text" placeholder="React, Node.js, TypeScript" />
              </div>
              <div class="form-field">
                <label>Job Type</label>
                <select v-model="jobForm.job_type">
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="freelance">Freelance</option>
                  <option value="remote">Remote</option>
                </select>
              </div>
              <div class="form-field">
                <label>Location</label>
                <input v-model="jobForm.location" type="text" placeholder="Remote / City, Country" />
              </div>
              <div class="form-row">
                <div class="form-field">
                  <label>Min Salary ($)</label>
                  <input v-model.number="jobForm.salary_min" type="number" placeholder="50000" />
                </div>
                <div class="form-field">
                  <label>Max Salary ($)</label>
                  <input v-model.number="jobForm.salary_max" type="number" placeholder="80000" />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-primary apply-btn" @click="postJob" :disabled="!jobForm.title || !jobForm.description">
              Post Job
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- My Applications Modal -->
    <Transition name="modal">
      <div v-if="showMyApplications" class="modal-overlay" @click.self="showMyApplications = false">
        <div class="job-detail-modal">
          <div class="modal-header">
            <h2 class="modal-title">My Applications</h2>
            <button class="btn-ghost icon-only" @click="showMyApplications = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="modal-body">
            <div v-if="myApplications.length === 0" class="jobs-empty" style="padding:1rem;">
              <span class="material-symbols-outlined" style="font-size:2.5rem;color:var(--on-surface-variant)">work_history</span>
              <p>No applications yet</p>
            </div>
            <div v-for="app in myApplications" :key="app.id" class="my-app-card">
              <div class="my-app-header">
                <div class="my-app-info">
                  <h4 class="my-app-title">{{ app.job_title }}</h4>
                  <p class="my-app-company">{{ app.company }}</p>
                  <p class="my-app-meta">{{ app.job_type?.replace('_',' ') }} · {{ app.is_remote ? 'Remote' : app.location }}</p>
                </div>
                <span class="applicant-status" :class="app.status">{{ app.status }}</span>
              </div>
              <p class="my-app-date">Applied {{ formatTime(app.created_at) }}</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
    <Transition name="modal">
      <div v-if="showApplicants" class="modal-overlay" @click.self="showApplicants = false">
        <div class="job-detail-modal">
          <div class="modal-header">
            <h2 class="modal-title">Applicants</h2>
            <button class="btn-ghost icon-only" @click="showApplicants = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="modal-body">
            <div v-if="applicants.length === 0" class="jobs-empty" style="padding:1rem;">
              <span class="material-symbols-outlined" style="font-size:2rem;color:var(--on-surface-variant)">person_off</span>
              <p>No applications yet</p>
            </div>
            <div v-for="app in applicants" :key="app.id" class="applicant-card">
              <div class="applicant-header">
                <div class="applicant-avatar">
                  <img v-if="app.applicant_avatar" :src="app.applicant_avatar" class="applicant-avatar-img" />
                  <span v-else>{{ (app.applicant_name || 'U')[0] }}</span>
                </div>
                <div class="applicant-info">
                  <h4 class="applicant-name">{{ app.applicant_name }}</h4>
                  <p class="applicant-meta">{{ app.years_experience ? app.years_experience + ' yrs exp' : '' }} · {{ app.availability || 'Flexible' }}</p>
                </div>
                <span class="applicant-status" :class="app.status">{{ app.status }}</span>
              </div>
              <p v-if="app.cover_letter" class="applicant-cover">{{ app.cover_letter }}</p>
              <div class="applicant-links">
                <a v-if="app.resume_url" :href="app.resume_url" target="_blank" class="app-link">📄 Resume</a>
                <a v-if="app.portfolio_url" :href="app.portfolio_url" target="_blank" class="app-link">🌐 Portfolio</a>
                <a v-if="app.github_url" :href="app.github_url" target="_blank" class="app-link">💻 GitHub</a>
              </div>
              <div v-if="app.status === 'pending' || app.status === 'reviewed'" class="applicant-actions">
                <button class="btn-approve" @click="updateApplicationStatus(app, 'shortlisted')">
                  <span class="material-symbols-outlined">check</span> Shortlist
                </button>
                <button class="btn-chat" @click="openHiringChat(selectedJob, app)">
                  <span class="material-symbols-outlined">chat</span> Message
                </button>
                <button class="btn-decline" @click="updateApplicationStatus(app, 'rejected')">
                  <span class="material-symbols-outlined">close</span> Decline
                </button>
              </div>
              <div v-else-if="app.status === 'shortlisted'" class="applicant-actions">
                <button class="btn-approve" style="background:rgba(168,85,247,0.1);border-color:rgba(168,85,247,0.3);color:var(--primary)" @click="updateApplicationStatus(app, 'accepted')">
                  <span class="material-symbols-outlined">how_to_reg</span> Accept
                </button>
                <button class="btn-chat" @click="openHiringChat(selectedJob, app)">
                  <span class="material-symbols-outlined">chat</span> Message
                </button>
                <button class="btn-decline" @click="updateApplicationStatus(app, 'rejected')">
                  <span class="material-symbols-outlined">close</span> Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { useSeo, pageSeo } from '@/composables/useSeo'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useUiStore } from '@/store/ui'
import { useCurrencyStore } from '@/store/currency'
import http from '@/services/http'

const currencyStore = useCurrencyStore()
// Salaries are stored in USD
const fmtSalary = (usd) => currencyStore.format(usd)

useSeo(pageSeo.jobs)

const authStore = useAuthStore()
const uiStore = useUiStore()
const router = useRouter()

const jobs = ref([])
const loading = ref(true)
const searchQuery = ref('')
const activeFilter = ref('all')
const selectedJob = ref(null)
const showApplyModal = ref(false)
const showPostJob = ref(false)
const showApplicants = ref(false)
const applicants = ref([])

const isClient = computed(() => authStore.profile?.role === 'client' || authStore.profile?.role === 'admin')
const isDeveloper = computed(() => authStore.profile?.role === 'developer')

const filters = [
  { value: 'all', label: 'All' },
  { value: 'full_time', label: 'Full Time' },
  { value: 'remote', label: 'Remote' },
  { value: 'contract', label: 'Contract' },
  { value: 'freelance', label: 'Freelance' },
]

const applyForm = ref({
  cover_letter: '',
  resume_url: '',
  portfolio_url: '',
  github_url: '',
  years_experience: null,
  availability: 'immediately',
})

const jobForm = ref({
  title: '',
  company: '',
  description: '',
  requirements: '',
  skillsText: '',
  job_type: 'full_time',
  location: '',
  salary_min: null,
  salary_max: null,
})

let searchTimeout = null
function debouncedSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(fetchJobs, 500)
}

async function fetchJobs() {
  loading.value = true
  try {
    let url = '/jobs?limit=30'
    if (activeFilter.value !== 'all') url += `&job_type=${activeFilter.value}`
    if (searchQuery.value) url += `&search=${searchQuery.value}`

    // Try with auth first, fallback to public fetch
    try {
      const data = await http.get(url)
      jobs.value = data.jobs || []
    } catch {
      // Fallback: fetch without auth token
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://gfd-backend.onrender.com/api/v1'
      const res = await fetch(`${baseUrl}${url}`)
      if (res.ok) {
        const data = await res.json()
        jobs.value = data.jobs || []
      }
    }
  } catch (err) {
    console.error('Fetch jobs error:', err)
    jobs.value = []
  }
  finally { loading.value = false }
}

async function postJob() {
  try {
    const payload = {
      title: jobForm.value.title,
      company: jobForm.value.company || undefined,
      description: jobForm.value.description,
      requirements: jobForm.value.requirements || undefined,
      skills_required: jobForm.value.skillsText ? jobForm.value.skillsText.split(',').map(s => s.trim()).filter(Boolean) : [],
      job_type: jobForm.value.job_type || 'full_time',
      location: jobForm.value.location || undefined,
      is_remote: !jobForm.value.location || jobForm.value.location.toLowerCase().includes('remote'),
      salary_min: jobForm.value.salary_min || undefined,
      salary_max: jobForm.value.salary_max || undefined,
    }
    await http.post('/jobs/', payload)
    uiStore.showSuccess('Job posted successfully!')
    showPostJob.value = false
    jobForm.value = { title: '', company: '', description: '', requirements: '', skillsText: '', job_type: 'full_time', location: '', salary_min: null, salary_max: null }
    fetchJobs()
  } catch (err) {
    console.error('Post job error:', err.response?.data || err)
    uiStore.showError(err.response?.data?.detail || 'Failed to post job. Please try again.')
  }
}

async function submitApplication() {
  if (!selectedJob.value) return
  try {
    await http.post(`/jobs/${selectedJob.value.id}/apply`, applyForm.value)
    uiStore.showSuccess('Application submitted!')
    showApplyModal.value = false
    selectedJob.value = null
    applyForm.value = { cover_letter: '', resume_url: '', portfolio_url: '', github_url: '', years_experience: null, availability: 'immediately' }
  } catch (err) {
    uiStore.showError(err.response?.data?.detail || 'Failed to apply')
  }
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diff = (now - date) / 1000
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

async function deleteJob(job) {
  if (!confirm('Are you sure you want to delete this job posting?')) return
  try {
    await http.request({ method: 'DELETE', url: `/jobs/${job.id}` })
    jobs.value = jobs.value.filter(j => j.id !== job.id)
    uiStore.showSuccess('Job deleted')
  } catch {
    uiStore.showError('Failed to delete job')
  }
}

async function viewApplicants(job) {
  if (!job) return
  currentReviewJob.value = job
  try {
    const data = await http.get(`/jobs/${job.id}/applications`)
    applicants.value = data.applications || []
    showApplicants.value = true
    selectedJob.value = null
  } catch (err) {
    const msg = err?.response?.data?.detail || err?.message || 'Failed to load applicants'
    uiStore.showError(msg)
    console.error('[job-applications]', err?.response?.status, err?.response?.data)
  }
}

async function updateApplicationStatus(app, newStatus) {
  try {
    await http.patch(`/jobs/applications/${app.id}`, { status: newStatus })
    app.status = newStatus
    uiStore.showSuccess(
      newStatus === 'shortlisted' ? 'Applicant shortlisted!' :
      newStatus === 'accepted' ? '🎉 Applicant accepted!' :
      newStatus === 'rejected' ? 'Application declined' : 'Status updated'
    )
  } catch {
    uiStore.showError('Failed to update status')
  }
}

async function openHiringChat(job, app) {
  const jobToUse = job || currentReviewJob.value
  if (!jobToUse) { uiStore.showError('Job not found'); return }
  if (!app?.applicant_id) { uiStore.showError('Applicant not found'); return }
  try {
    // Start or open a direct conversation with the applicant
    const { default: http2 } = await import('@/services/http')
    const data = await http2.post('/messages/conversations', {
      participant_ids: [app.applicant_id],
      type: 'direct',
    })
    uiStore.showSuccess('Opening chat with ' + (app.applicant_name || 'applicant'))
    showApplicants.value = false
    router.push({ path: '/messaging', query: { conv: data.id } })
  } catch (err) {
    uiStore.showError(err?.response?.data?.detail || 'Could not open chat')
  }
}

async function closeJob(job) {
  if (!confirm('Close this job? No more applications will be accepted.')) return
  try {
    await http.patch(`/jobs/${job.id}/close`, {})
    job.status = 'closed'
    jobs.value.forEach(j => { if (j.id === job.id) j.status = 'closed' })
    uiStore.showSuccess('Job closed')
    selectedJob.value = null
  } catch {
    uiStore.showError('Failed to close job')
  }
}

const currentReviewJob = ref(null)

const myApplications = ref([])
const showMyApplications = ref(false)

async function fetchMyApplications() {
  try {
    const data = await http.get('/jobs/my-applications')
    myApplications.value = data.applications || []
    showMyApplications.value = true
  } catch (err) {
    const msg = err?.response?.data?.detail || err?.message || 'Failed to load your applications'
    uiStore.showError(msg)
    console.error('[my-applications]', err?.response?.status, err?.response?.data)
  }
}

let refreshInterval = null
onMounted(() => {
  fetchJobs()
  refreshInterval = setInterval(fetchJobs, 30000)
})
onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval)
})
</script>

<style scoped>
.jobs-view { padding: 0.5rem 0; min-height: 100vh; background: var(--background); padding-bottom: 80px; }
.jobs-header { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; }
.jobs-title { font-family: var(--font-headline); font-size: 1.25rem; font-weight: 700; color: var(--on-surface); }
.btn-post-job { display: flex; align-items: center; gap: 0.3rem; padding: 0.5rem 1rem; background: var(--primary); color: #fff; border: none; border-radius: var(--radius-full); font-family: var(--font-headline); font-size: 0.8rem; font-weight: 600; cursor: pointer; }
.btn-post-job .material-symbols-outlined { font-size: 18px; }

.jobs-search { padding: 0 1rem 0.75rem; position: relative; }
.search-icon { position: absolute; left: 1.75rem; top: 50%; transform: translateY(-50%); font-size: 20px; color: var(--on-surface-variant); pointer-events: none; margin-top: -0.375rem; }
.search-input { width: 100%; padding: 0.6rem 0.75rem 0.6rem 2.75rem; background: var(--surface-container-low); border: 1px solid var(--outline-variant); border-radius: var(--radius-full); font-size: 0.875rem; color: var(--on-surface); outline: none; }
.search-input:focus { border-color: var(--primary); }

.jobs-filters { display: flex; gap: 0.4rem; padding: 0 1rem 0.75rem; overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
.jobs-filters::-webkit-scrollbar { display: none; }
.filter-chip { padding: 0.4rem 1rem; background: var(--surface-container); border: 1px solid var(--outline-variant); border-radius: var(--radius-full); font-size: 0.8rem; font-weight: 600; color: var(--on-surface-variant); cursor: pointer; white-space: nowrap; flex-shrink: 0; transition: all 0.15s; }
.filter-chip.active { background: var(--primary); color: #fff; border-color: var(--primary); }

.jobs-list { padding: 0 1rem; display: flex; flex-direction: column; gap: 0.75rem; }
.job-card { padding: 1rem; background: var(--surface-container-lowest); border: 1px solid var(--outline-variant); border-radius: var(--radius-xl); cursor: pointer; transition: border-color 0.15s; }
.job-card:hover { border-color: var(--primary); }
.job-card-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; }
.job-company-logo { width: 44px; height: 44px; border-radius: var(--radius-lg); background: var(--primary-fixed); display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; }
.company-logo-img { width: 100%; height: 100%; object-fit: cover; }
.company-initials { font-family: var(--font-headline); font-size: 1rem; font-weight: 700; color: var(--primary); }
.job-info { flex: 1; min-width: 0; }
.job-title { font-family: var(--font-headline); font-size: 0.9rem; font-weight: 700; color: var(--on-surface); }
.job-company { font-size: 0.8rem; color: var(--on-surface-variant); }
.job-meta { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 0.5rem; }
.job-tag { padding: 0.2rem 0.5rem; background: var(--surface-container); border-radius: var(--radius-full); font-size: 0.7rem; font-weight: 500; color: var(--on-surface-variant); text-transform: capitalize; }
.job-tag.remote { background: rgba(34, 197, 94, 0.1); color: #16a34a; }
.job-desc { font-size: 0.82rem; color: var(--on-surface-variant); line-height: 1.5; margin-bottom: 0.5rem; }
.job-footer { display: flex; justify-content: space-between; align-items: center; }
.job-salary { font-family: var(--font-headline); font-size: 0.8rem; font-weight: 600; color: var(--primary); }
.job-time { font-size: 0.72rem; color: var(--on-surface-variant); }
.job-delete-btn { background: none; border: none; color: var(--on-surface-variant); cursor: pointer; padding: 0.3rem; border-radius: 50%; transition: all 0.15s; margin-left: auto; }
.job-delete-btn:hover { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
.job-delete-btn .material-symbols-outlined { font-size: 18px; }

.jobs-loading { display: flex; flex-direction: column; gap: 1rem; }
.skeleton-job { display: flex; align-items: center; gap: 0.75rem; padding: 1rem; background: var(--surface-container-lowest); border-radius: var(--radius-xl); }
.skeleton-shimmer { background: linear-gradient(90deg, var(--surface-container) 25%, var(--surface-container-high) 50%, var(--surface-container) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

.jobs-empty { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; padding: 3rem 1rem; text-align: center; color: var(--on-surface-variant); }

/* Modals */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: flex-end; padding: 0; overflow: hidden; }
@media (min-width: 640px) { .modal-overlay { align-items: center; padding: 1rem; } }
.job-detail-modal { width: 100%; max-width: 560px; max-height: 85vh; display: flex; flex-direction: column; background: var(--surface-container-lowest); border-radius: var(--radius-2xl) var(--radius-2xl) 0 0; overflow: hidden; }
@media (min-width: 640px) { .job-detail-modal { border-radius: var(--radius-2xl); margin: 0 auto; max-height: 80vh; } }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.25rem 0.75rem; flex-shrink: 0; border-bottom: 1px solid var(--outline-variant); }
.modal-title { font-family: var(--font-headline); font-size: 1.1rem; font-weight: 700; color: var(--on-surface); }
.modal-body { display: flex; flex-direction: column; gap: 1rem; padding: 1rem 1.25rem; overflow-y: auto; flex: 1; min-height: 0; }
.modal-footer { padding: 0.75rem 1.25rem 1.25rem; border-top: 1px solid var(--outline-variant); flex-shrink: 0; }

.detail-company { display: flex; align-items: center; gap: 0.75rem; }
.detail-company-name { font-family: var(--font-headline); font-size: 0.9rem; font-weight: 600; color: var(--on-surface); }
.detail-location { font-size: 0.8rem; color: var(--on-surface-variant); }
.detail-tags { display: flex; flex-wrap: wrap; gap: 0.35rem; }
.detail-salary { font-family: var(--font-headline); font-size: 1rem; font-weight: 700; color: var(--primary); }
.detail-section h4 { font-family: var(--font-headline); font-size: 0.875rem; font-weight: 700; color: var(--on-surface); margin-bottom: 0.35rem; }
.detail-section p { font-size: 0.85rem; color: var(--on-surface-variant); line-height: 1.6; white-space: pre-line; }
.detail-skills { display: flex; flex-wrap: wrap; gap: 0.35rem; }
.skill-chip { padding: 0.25rem 0.6rem; background: rgba(168,85,247,0.08); border: 1px solid rgba(168,85,247,0.2); border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 500; color: var(--primary); }
.detail-stats { display: flex; gap: 1rem; font-size: 0.8rem; color: var(--on-surface-variant); }

.apply-btn { width: 100%; justify-content: center; padding: 0.75rem; font-size: 0.9rem; display: flex; align-items: center; gap: 0.4rem; }
.posted-by-you { font-size: 0.85rem; color: var(--on-surface-variant); text-align: center; font-style: italic; }

/* Applicant Cards */
.applicant-card { padding: 1rem; background: var(--surface-container-low); border: 1px solid var(--outline-variant); border-radius: var(--radius-xl); display: flex; flex-direction: column; gap: 0.6rem; }
.applicant-header { display: flex; align-items: center; gap: 0.75rem; }
.applicant-avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--primary-fixed); display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; font-family: var(--font-headline); font-size: 0.9rem; font-weight: 700; color: var(--primary); }
.applicant-avatar-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
.applicant-info { flex: 1; min-width: 0; }
.applicant-name { font-family: var(--font-headline); font-size: 0.9rem; font-weight: 700; color: var(--on-surface); }
.applicant-meta { font-size: 0.75rem; color: var(--on-surface-variant); }
.applicant-status { padding: 0.2rem 0.5rem; border-radius: var(--radius-full); font-size: 0.7rem; font-weight: 600; text-transform: capitalize; }
.applicant-status.pending { background: rgba(251, 146, 60, 0.1); color: #f59e0b; }
.applicant-status.shortlisted { background: rgba(34, 197, 94, 0.1); color: #16a34a; }
.applicant-status.rejected { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
.applicant-status.accepted { background: rgba(168, 85, 247, 0.1); color: var(--primary); }
.applicant-cover { font-size: 0.82rem; color: var(--on-surface-variant); line-height: 1.5; }
.applicant-links { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.app-link { font-size: 0.78rem; color: var(--primary); text-decoration: none; font-weight: 500; }
.app-link:hover { text-decoration: underline; }
.applicant-actions { display: flex; gap: 0.5rem; padding-top: 0.5rem; border-top: 1px solid var(--outline-variant); }
.btn-approve { flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.3rem; padding: 0.5rem; background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: var(--radius-lg); color: #16a34a; font-size: 0.8rem; font-weight: 600; cursor: pointer; }
.btn-approve:hover { background: rgba(34, 197, 94, 0.2); }
.btn-approve .material-symbols-outlined { font-size: 16px; }
.btn-decline { flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.3rem; padding: 0.5rem; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: var(--radius-lg); color: #ef4444; font-size: 0.8rem; font-weight: 600; cursor: pointer; }
.btn-decline:hover { background: rgba(239, 68, 68, 0.2); }
.btn-decline .material-symbols-outlined { font-size: 16px; }

.form-fields { display: flex; flex-direction: column; gap: 0.875rem; }
.form-field { display: flex; flex-direction: column; gap: 0.3rem; }
.form-field label { font-family: var(--font-headline); font-size: 0.8rem; font-weight: 600; color: var(--on-surface); }
.form-field input, .form-field textarea, .form-field select { padding: 0.6rem 0.75rem; background: var(--surface-container-low); border: 1px solid var(--outline-variant); border-radius: var(--radius-lg); font-size: 0.85rem; color: var(--on-surface); outline: none; resize: none; }
.form-field input:focus, .form-field textarea:focus, .form-field select:focus { border-color: var(--primary); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }

.modal-enter-active, .modal-leave-active { transition: opacity 0.2s, transform 0.25s; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: translateY(20px); }

/* New styles */
.header-btns { display:flex; align-items:center; gap:0.5rem; }
.btn-my-apps { display:flex; align-items:center; gap:0.3rem; padding:0.5rem 0.875rem; background:var(--surface-container); border:1px solid var(--outline-variant); border-radius:var(--radius-full); font-family:var(--font-headline); font-size:0.8rem; font-weight:600; color:var(--on-surface); cursor:pointer; }
.btn-my-apps .material-symbols-outlined { font-size:16px; }
.modal-footer-row { display:flex; gap:0.5rem; align-items:center; }
.btn-close-job { display:flex; align-items:center; gap:0.3rem; padding:0.65rem 1rem; background:var(--surface-container); border:1px solid var(--outline-variant); border-radius:var(--radius-lg); font-size:0.85rem; font-weight:600; color:var(--on-surface-variant); cursor:pointer; }
.btn-close-job:hover { background:rgba(239,68,68,0.08); color:#ef4444; border-color:rgba(239,68,68,0.3); }
.closed-badge { padding:0.35rem 0.75rem; background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.2); border-radius:var(--radius-full); font-size:0.78rem; font-weight:600; color:#ef4444; }
.btn-chat { flex:1; display:flex; align-items:center; justify-content:center; gap:0.3rem; padding:0.5rem; background:rgba(99,102,241,0.08); border:1px solid rgba(99,102,241,0.2); border-radius:var(--radius-lg); color:var(--primary); font-size:0.8rem; font-weight:600; cursor:pointer; }
.btn-chat:hover { background:rgba(99,102,241,0.15); }
.btn-chat .material-symbols-outlined { font-size:16px; }
.my-app-card { padding:0.875rem; background:var(--surface-container-low); border:1px solid var(--outline-variant); border-radius:var(--radius-xl); display:flex; flex-direction:column; gap:0.4rem; }
.my-app-header { display:flex; align-items:flex-start; justify-content:space-between; gap:0.5rem; }
.my-app-info { flex:1; min-width:0; }
.my-app-title { font-family:var(--font-headline); font-size:0.9rem; font-weight:700; color:var(--on-surface); }
.my-app-company { font-size:0.8rem; color:var(--on-surface-variant); }
.my-app-meta { font-size:0.75rem; color:var(--on-surface-variant); text-transform:capitalize; }
.my-app-date { font-size:0.72rem; color:var(--on-surface-variant); }
</style>
