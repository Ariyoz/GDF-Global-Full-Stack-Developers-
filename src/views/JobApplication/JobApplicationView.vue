<template>
  <div class="jd-root">

    <!-- Ambient bg -->
    <div class="jd-ambient" aria-hidden="true">
      <div class="amb-orb amb-1" /><div class="amb-orb amb-2" />
      <div class="amb-grid" />
    </div>

    <div class="container-gfd jd-inner">

      <!-- Back -->
      <RouterLink to="/jobs" class="back-link animate-fade-in-up">
        <span class="material-symbols-outlined">arrow_back</span>
        Back to Jobs
      </RouterLink>

      <!-- Loading -->
      <div v-if="loading" class="jd-skeleton">
        <div class="skeleton skel-title" />
        <div class="skeleton skel-meta" />
        <div class="jd-grid">
          <div class="skeleton skel-body" />
          <div class="skeleton skel-sidebar" />
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="jd-error glass-card-static animate-fade-in-up">
        <span class="material-symbols-outlined" style="font-size:3rem;color:var(--on-surface-variant)">work_off</span>
        <h2>Job not found</h2>
        <p>This listing may have been removed or closed.</p>
        <RouterLink to="/jobs" class="btn-primary">Browse All Jobs</RouterLink>
      </div>

      <!-- Content -->
      <div v-else class="jd-content animate-fade-in-up">

        <!-- Top breadcrumb chips -->
        <div class="jd-breadcrumb">
          <span class="bc-chip">
            <span class="material-symbols-outlined" style="font-size:13px">category</span>
            {{ formatType(job.job_type) }}
          </span>
          <span v-if="job.is_remote || job.location?.toLowerCase().includes('remote')" class="bc-chip bc-remote">
            <span class="material-symbols-outlined" style="font-size:13px">wifi</span>
            Remote
          </span>
          <span class="bc-chip bc-status" :class="job.status === 'closed' ? 'bc-closed' : 'bc-open'">
            <span class="material-symbols-outlined" style="font-size:11px;font-variation-settings:'FILL' 1">circle</span>
            {{ job.status === 'closed' ? 'Closed' : 'Actively Hiring' }}
          </span>
        </div>

        <!-- Job headline -->
        <h1 class="jd-title">{{ job.title }}</h1>

        <!-- Meta row -->
        <div class="jd-meta-row">
          <span v-if="job.location || job.is_remote" class="jd-meta-item">
            <span class="material-symbols-outlined">location_on</span>
            {{ job.is_remote ? 'Remote' : job.location }}
          </span>
          <span v-if="job.salary_min" class="jd-meta-item">
            <span class="material-symbols-outlined">payments</span>
            {{ fmtSalary(job.salary_min) }}{{ job.salary_max ? ' – ' + fmtSalary(job.salary_max) : '' }}
          </span>
          <span class="jd-meta-item">
            <span class="material-symbols-outlined">schedule</span>
            Posted {{ formatDate(job.created_at) }}
          </span>
          <span v-if="job.experience_level" class="jd-meta-item">
            <span class="material-symbols-outlined">workspace_premium</span>
            {{ job.experience_level }}
          </span>
        </div>

        <!-- Two-column layout -->
        <div class="jd-grid">

          <!-- ═══ LEFT: Job detail body ═══ -->
          <article class="jd-body glass-card-static">

            <!-- About the role -->
            <div v-if="job.description" class="jd-section">
              <p class="jd-section-label">About the Role</p>
              <h3 class="jd-section-title">About the Role</h3>
              <div class="jd-prose" v-html="renderText(job.description)" />
            </div>

            <!-- Requirements -->
            <div v-if="job.requirements" class="jd-section">
              <p class="jd-section-label">Requirements</p>
              <h3 class="jd-section-title">Requirements</h3>
              <div class="jd-prose" v-html="renderText(job.requirements)" />
            </div>

            <!-- Skills needed -->
            <div v-if="job.skills_required?.length" class="jd-section">
              <p class="jd-section-label">Skills</p>
              <h3 class="jd-section-title">Skills Required</h3>
              <div class="jd-skills">
                <span v-for="s in job.skills_required" :key="s" class="jd-skill-tag">{{ s }}</span>
              </div>
            </div>

            <!-- Company info -->
            <div v-if="job.company" class="jd-section jd-company-section">
              <p class="jd-section-label">Company</p>
              <div class="jd-company-card">
                <div class="jd-co-logo">
                  <img v-if="job.company_logo" :src="job.company_logo" :alt="job.company" @error="$event.target.style.display='none'" />
                  <span v-else class="material-symbols-outlined" style="font-size:24px;color:var(--primary)">business</span>
                </div>
                <div class="jd-co-info">
                  <h4 class="jd-co-name">{{ job.company }}</h4>
                  <a v-if="job.company_url" :href="job.company_url" target="_blank" rel="noopener" class="jd-co-link">
                    Visit website
                    <span class="material-symbols-outlined" style="font-size:13px">open_in_new</span>
                  </a>
                </div>
              </div>
            </div>

          </article>

          <!-- ═══ RIGHT: Sticky apply sidebar ═══ -->
          <aside class="jd-sidebar">

            <!-- Apply card -->
            <div class="jd-apply-card glass-card-static">

              <!-- Already applied -->
              <div v-if="applied" class="apply-success">
                <span class="material-symbols-outlined" style="font-size:2rem;color:#16a34a;font-variation-settings:'FILL' 1">task_alt</span>
                <div>
                  <p class="apply-success-title">Application Submitted!</p>
                  <p class="apply-success-desc">Your application has been sent. The client will review it shortly.</p>
                </div>
              </div>

              <template v-else-if="job.status !== 'closed'">
                <!-- Not logged in -->
                <template v-if="!authStore.isAuthenticated">
                  <RouterLink to="/auth/login" class="apply-btn-main">
                    Apply Now
                    <span class="material-symbols-outlined">arrow_forward</span>
                  </RouterLink>
                  <p class="apply-or">or</p>
                  <RouterLink to="/auth/login" class="apply-btn-secondary">
                    <span class="material-symbols-outlined">login</span>
                    Sign in to quick-apply
                  </RouterLink>
                  <p class="apply-hint">Have an account? Sign in for a faster experience.</p>
                </template>

                <!-- Logged in as developer -->
                <template v-else-if="isDeveloper">
                  <button class="apply-btn-main" @click="showForm = !showForm">
                    {{ showForm ? 'Hide Form' : 'Apply Now' }}
                    <span class="material-symbols-outlined">{{ showForm ? 'expand_less' : 'arrow_forward' }}</span>
                  </button>

                  <!-- Inline apply form -->
                  <Transition name="form-expand">
                    <div v-if="showForm" class="apply-form-inline">
                      <div class="aff-divider" />

                      <div class="aff-field">
                        <label>Cover Letter <span class="aff-req">*</span></label>
                        <textarea v-model="applyForm.cover_letter" rows="4"
                          placeholder="Why are you a great fit for this role?" />
                      </div>

                      <div class="aff-row">
                        <div class="aff-field">
                          <label>Resume URL</label>
                          <input v-model="applyForm.resume_url" type="url" placeholder="https://drive.google.com/…" />
                        </div>
                        <div class="aff-field">
                          <label>Portfolio URL</label>
                          <input v-model="applyForm.portfolio_url" type="url" placeholder="https://yoursite.com" />
                        </div>
                      </div>

                      <div class="aff-row">
                        <div class="aff-field">
                          <label>GitHub</label>
                          <input v-model="applyForm.github_url" type="url" placeholder="https://github.com/…" />
                        </div>
                        <div class="aff-field">
                          <label>Years Exp.</label>
                          <input v-model.number="applyForm.years_experience" type="number" placeholder="3" min="0" />
                        </div>
                      </div>

                      <div class="aff-field">
                        <label>Availability</label>
                        <select v-model="applyForm.availability">
                          <option value="immediately">Immediately</option>
                          <option value="2_weeks">2 Weeks Notice</option>
                          <option value="1_month">1 Month</option>
                          <option value="flexible">Flexible</option>
                        </select>
                      </div>

                      <button class="apply-btn-submit"
                        :disabled="!applyForm.cover_letter.trim() || submitting"
                        @click="submitApplication">
                        <span v-if="submitting" class="btn-spin" />
                        <template v-else>
                          <span class="material-symbols-outlined" style="font-size:16px;font-variation-settings:'FILL' 1">send</span>
                          Submit Application
                        </template>
                      </button>
                    </div>
                  </Transition>
                </template>

                <!-- Client view -->
                <template v-else-if="isClient">
                  <button class="apply-btn-applicants" @click="$router.push('/jobs')">
                    <span class="material-symbols-outlined">group</span>
                    View Applicants
                  </button>
                </template>
              </template>

              <!-- Closed -->
              <div v-else class="apply-closed">
                <span class="material-symbols-outlined" style="font-size:1.25rem">lock</span>
                This position is no longer accepting applications.
              </div>

              <p class="apply-view-all">
                <RouterLink to="/jobs">← View all open positions</RouterLink>
              </p>
            </div>

            <!-- Job details card -->
            <div class="jd-details-card glass-card-static">
              <p class="jd-details-label">Job Details</p>

              <div class="jd-detail-row" v-if="job.location || job.is_remote">
                <div class="jd-detail-ico">
                  <span class="material-symbols-outlined">location_on</span>
                </div>
                <div>
                  <p class="jd-detail-key">Location</p>
                  <p class="jd-detail-val">{{ job.is_remote ? 'Remote' : job.location }}</p>
                </div>
              </div>

              <div class="jd-detail-row">
                <div class="jd-detail-ico">
                  <span class="material-symbols-outlined">work</span>
                </div>
                <div>
                  <p class="jd-detail-key">Category</p>
                  <p class="jd-detail-val">{{ formatType(job.job_type) }}</p>
                </div>
              </div>

              <div class="jd-detail-row" v-if="job.salary_min">
                <div class="jd-detail-ico">
                  <span class="material-symbols-outlined">payments</span>
                </div>
                <div>
                  <p class="jd-detail-key">Salary</p>
                  <p class="jd-detail-val">{{ fmtSalary(job.salary_min) }}{{ job.salary_max ? ' – ' + fmtSalary(job.salary_max) : '' }}</p>
                </div>
              </div>

              <div class="jd-detail-row" v-if="job.company">
                <div class="jd-detail-ico">
                  <span class="material-symbols-outlined">business</span>
                </div>
                <div>
                  <p class="jd-detail-key">Company</p>
                  <p class="jd-detail-val">{{ job.company }}</p>
                </div>
              </div>

              <div class="jd-detail-row" v-if="job.experience_level">
                <div class="jd-detail-ico">
                  <span class="material-symbols-outlined">workspace_premium</span>
                </div>
                <div>
                  <p class="jd-detail-key">Experience</p>
                  <p class="jd-detail-val">{{ job.experience_level }}</p>
                </div>
              </div>

              <div class="jd-detail-row">
                <div class="jd-detail-ico">
                  <span class="material-symbols-outlined">group</span>
                </div>
                <div>
                  <p class="jd-detail-key">Applicants</p>
                  <p class="jd-detail-val">{{ job.application_count || 0 }}</p>
                </div>
              </div>

              <div class="jd-detail-row">
                <div class="jd-detail-ico">
                  <span class="material-symbols-outlined">visibility</span>
                </div>
                <div>
                  <p class="jd-detail-key">Views</p>
                  <p class="jd-detail-val">{{ job.view_count || 0 }}</p>
                </div>
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useUiStore } from '@/store/ui'
import { useCurrencyStore } from '@/store/currency'
import http from '@/services/http'

const route         = useRoute()
const authStore     = useAuthStore()
const uiStore       = useUiStore()
const currencyStore = useCurrencyStore()

const loading    = ref(true)
const error      = ref(false)
const job        = ref({})
const showForm   = ref(false)
const submitting = ref(false)
const applied    = ref(false)

const isDeveloper = computed(() => authStore.profile?.role === 'developer')
const isClient    = computed(() => ['client','admin'].includes(authStore.profile?.role))

const fmtSalary = (v) => currencyStore.format(v)

const applyForm = reactive({
  cover_letter: '', resume_url: '', portfolio_url: '',
  github_url: '', years_experience: null, availability: 'immediately',
})

onMounted(async () => {
  const jobId = route.params.id
  try {
    const data = await http.get(`/jobs/${jobId}`)
    job.value = data
    // Count view
    http.post(`/jobs/${jobId}/view`).catch(() => {})
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
})

async function submitApplication() {
  submitting.value = true
  try {
    await http.post(`/jobs/${job.value.id}/apply`, {
      cover_letter:     applyForm.cover_letter,
      resume_url:       applyForm.resume_url     || undefined,
      portfolio_url:    applyForm.portfolio_url   || undefined,
      github_url:       applyForm.github_url      || undefined,
      years_experience: applyForm.years_experience || undefined,
      availability:     applyForm.availability,
    })
    applied.value  = true
    showForm.value = false
    uiStore.showSuccess('Application submitted!')
  } catch (err) {
    uiStore.showError(err?.response?.data?.detail || 'Failed to apply. Please try again.')
  } finally {
    submitting.value = false
  }
}

function formatType(t) {
  if (!t) return 'Full Time'
  return { full_time: 'Full Time', part_time: 'Part Time', contract: 'Contract',
    freelance: 'Freelance', remote: 'Remote', internship: 'Internship' }[t] || t.replace('_', ' ')
}

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}

function renderText(text) {
  if (!text) return ''
  // Convert markdown-style bullets and bold to HTML
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^[-•]\s(.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .split('\n\n').map(p => p.trim() ? `<p>${p}</p>` : '').join('')
}
</script>

<style scoped>
/* ══════════════════════════════════════
   ROOT
══════════════════════════════════════ */
.jd-root {
  background: var(--background);
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.jd-ambient { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
.amb-orb { position: absolute; border-radius: 50%; filter: blur(110px); }
.amb-1 { width: 500px; height: 500px; top: -150px; right: -100px;
  background: radial-gradient(circle, rgba(99,14,212,0.08) 0%, transparent 70%); }
.amb-2 { width: 400px; height: 400px; bottom: -100px; left: -80px;
  background: radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%); }
[data-theme="dark"] .amb-1 { background: radial-gradient(circle, rgba(168,85,247,0.13) 0%, transparent 70%); }
[data-theme="dark"] .amb-2 { background: radial-gradient(circle, rgba(99,14,212,0.10) 0%, transparent 70%); }
.amb-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(99,14,212,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99,14,212,0.025) 1px, transparent 1px);
  background-size: 60px 60px;
}
[data-theme="dark"] .amb-grid {
  background-image:
    linear-gradient(rgba(168,85,247,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(168,85,247,0.04) 1px, transparent 1px);
}

.jd-inner {
  position: relative;
  z-index: 1;
  padding-top: 2rem;
  padding-bottom: 5rem;
}

/* Back link */
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-family: var(--font-headline);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--on-surface-variant);
  text-decoration: none;
  margin-bottom: 1.75rem;
  transition: color 0.15s ease;
}
.back-link .material-symbols-outlined { font-size: 18px; }
.back-link:hover { color: var(--primary); }

/* ── Breadcrumb chips ── */
.jd-breadcrumb {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.bc-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.75rem;
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--on-surface-variant);
  background: var(--surface-container-low);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.bc-remote { color: var(--primary); border-color: rgba(99,14,212,0.2); background: rgba(99,14,212,0.05); }
.bc-open   { color: #16a34a; border-color: rgba(34,197,94,0.25); background: rgba(34,197,94,0.06); }
.bc-closed { color: var(--error); border-color: rgba(239,68,68,0.2); background: rgba(239,68,68,0.05); }

/* ── Job title ── */
.jd-title {
  font-family: var(--font-headline);
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 800;
  color: var(--on-surface);
  letter-spacing: -0.02em;
  line-height: 1.15;
  margin-bottom: 1rem;
}

/* ── Meta row ── */
.jd-meta-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--outline-variant);
}
.jd-meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.875rem;
  color: var(--on-surface-variant);
  font-family: var(--font-headline);
}
.jd-meta-item .material-symbols-outlined { font-size: 16px; color: var(--primary); }

/* ── Two-column grid ── */
.jd-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 1.75rem;
  align-items: start;
}
@media (max-width: 1024px) {
  .jd-grid { grid-template-columns: 1fr; }
}

/* ══ LEFT: Body ══ */
.jd-body {
  padding: 0;
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.jd-section {
  padding: 1.75rem 2rem;
  border-bottom: 1px solid var(--outline-variant);
}
.jd-section:last-child { border-bottom: none; }

@media (max-width: 640px) { .jd-section { padding: 1.25rem 1rem; } }

.jd-section-label {
  font-family: var(--font-headline);
  font-size: 0.675rem;
  font-weight: 700;
  color: var(--on-surface-variant);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.625rem;
}
.jd-section-title {
  font-family: var(--font-headline);
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--on-surface);
  margin-bottom: 1rem;
}

.jd-prose { line-height: 1.75; color: var(--on-surface-variant); font-size: 0.9375rem; }
.jd-prose :deep(p) { margin-bottom: 0.875rem; }
.jd-prose :deep(ul) { padding-left: 1.25rem; margin-bottom: 0.875rem; }
.jd-prose :deep(li) { margin-bottom: 0.375rem; }
.jd-prose :deep(strong) { color: var(--on-surface); font-weight: 700; }

.jd-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.jd-skill-tag {
  padding: 0.35rem 0.875rem;
  background: rgba(99,14,212,0.07);
  border: 1px solid rgba(99,14,212,0.15);
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--primary);
}
[data-theme="dark"] .jd-skill-tag {
  background: rgba(168,85,247,0.1);
  border-color: rgba(168,85,247,0.2);
}

.jd-company-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--surface-container-low);
  border-radius: var(--radius-lg);
  border: 1px solid var(--outline-variant);
}
.jd-co-logo {
  width: 52px; height: 52px;
  border-radius: var(--radius-lg);
  background: var(--surface-container);
  display: flex; align-items: center; justify-content: center;
  overflow: hidden; flex-shrink: 0;
}
.jd-co-logo img { width: 100%; height: 100%; object-fit: contain; }
.jd-co-name {
  font-family: var(--font-headline);
  font-size: 1rem;
  font-weight: 700;
  color: var(--on-surface);
}
.jd-co-link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: var(--primary);
  text-decoration: none;
  margin-top: 0.2rem;
  font-family: var(--font-headline);
  font-weight: 500;
}
.jd-co-link:hover { text-decoration: underline; }

/* ══ RIGHT: Sidebar ══ */
.jd-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: sticky;
  top: 1.5rem;
}

/* Apply card */
.jd-apply-card {
  padding: 1.5rem;
  border-radius: var(--radius-xl);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.apply-btn-main {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: var(--gradient-primary);
  border: none;
  border-radius: var(--radius-lg);
  font-family: var(--font-headline);
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
  box-shadow: 0 6px 24px rgba(99,14,212,0.35);
  text-decoration: none;
  letter-spacing: 0.01em;
}
.apply-btn-main:hover { transform: translateY(-2px); box-shadow: 0 10px 36px rgba(99,14,212,0.45); }
.apply-btn-main:active { transform: scale(0.98); }

.apply-or {
  text-align: center;
  font-size: 0.8rem;
  color: var(--on-surface-variant);
  margin: 0;
}

.apply-btn-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1.25rem;
  background: var(--surface-container-low);
  border: 1.5px solid var(--outline-variant);
  border-radius: var(--radius-lg);
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--on-surface);
  cursor: pointer;
  transition: var(--transition-base);
  text-decoration: none;
}
.apply-btn-secondary:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: rgba(99,14,212,0.04);
}

.apply-hint {
  font-size: 0.75rem;
  color: var(--on-surface-variant);
  text-align: center;
  margin: 0;
  line-height: 1.5;
}

.apply-btn-applicants {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1.25rem;
  background: rgba(99,14,212,0.08);
  border: 1.5px solid rgba(99,14,212,0.2);
  border-radius: var(--radius-lg);
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--primary);
  cursor: pointer;
  transition: var(--transition-base);
}
.apply-btn-applicants:hover { background: rgba(99,14,212,0.12); }

.apply-view-all {
  text-align: center;
  font-size: 0.78rem;
  color: var(--on-surface-variant);
  margin: 0.25rem 0 0;
}
.apply-view-all a {
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
}
.apply-view-all a:hover { text-decoration: underline; }

.apply-closed {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem;
  background: var(--surface-container);
  border-radius: var(--radius-lg);
  font-size: 0.85rem;
  color: var(--on-surface-variant);
  font-family: var(--font-headline);
  font-weight: 500;
  text-align: center;
}

/* Apply success */
.apply-success {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  padding: 1rem;
  background: rgba(22,163,74,0.06);
  border: 1px solid rgba(22,163,74,0.2);
  border-radius: var(--radius-lg);
}
.apply-success-title { font-family: var(--font-headline); font-size: 0.9375rem; font-weight: 700; color: var(--on-surface); }
.apply-success-desc  { font-size: 0.8rem; color: var(--on-surface-variant); margin-top: 0.2rem; }

/* Inline apply form */
.aff-divider { height: 1px; background: var(--outline-variant); }

.aff-field {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.aff-field label {
  font-family: var(--font-headline);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--on-surface-variant);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.aff-req { color: var(--primary); }
.aff-field input,
.aff-field textarea,
.aff-field select {
  padding: 0.55rem 0.75rem;
  background: var(--surface-container-low);
  border: 1.5px solid var(--outline-variant);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--on-surface);
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  width: 100%;
  resize: vertical;
}
.aff-field input:focus,
.aff-field textarea:focus,
.aff-field select:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99,14,212,0.1);
}
.aff-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.625rem;
}
@media (max-width: 400px) { .aff-row { grid-template-columns: 1fr; } }

.apply-btn-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  background: var(--gradient-primary);
  border: none;
  border-radius: var(--radius-lg);
  font-family: var(--font-headline);
  font-size: 0.9375rem;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 16px rgba(99,14,212,0.3);
}
.apply-btn-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(99,14,212,0.4); }
.apply-btn-submit:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: none; }

/* Job details card */
.jd-details-card {
  padding: 1.25rem;
  border-radius: var(--radius-xl);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.jd-details-label {
  font-family: var(--font-headline);
  font-size: 0.675rem;
  font-weight: 700;
  color: var(--on-surface-variant);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.jd-detail-row {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}
.jd-detail-ico {
  width: 32px; height: 32px;
  border-radius: var(--radius-md);
  background: rgba(99,14,212,0.07);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.jd-detail-ico .material-symbols-outlined { font-size: 16px; color: var(--primary); }
[data-theme="dark"] .jd-detail-ico { background: rgba(168,85,247,0.1); }
.jd-detail-key {
  font-size: 0.675rem;
  font-family: var(--font-headline);
  font-weight: 700;
  color: var(--on-surface-variant);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.jd-detail-val {
  font-family: var(--font-headline);
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--on-surface);
  margin-top: 0.1rem;
}

/* Skeleton */
.jd-skeleton { padding-top: 0.5rem; }
.skel-title  { height: 48px; width: 60%; border-radius: var(--radius-lg); margin-bottom: 1rem; }
.skel-meta   { height: 20px; width: 80%; border-radius: var(--radius-md); margin-bottom: 2rem; }
.jd-grid .skel-body    { height: 500px; border-radius: var(--radius-xl); }
.jd-grid .skel-sidebar { height: 400px; border-radius: var(--radius-xl); }

/* Error state */
.jd-error {
  display: flex; flex-direction: column; align-items: center;
  text-align: center; padding: 4rem 2rem; gap: 1rem;
  border-radius: var(--radius-2xl); margin-top: 2rem;
}
.jd-error h2 { font-family: var(--font-headline); font-size: 1.5rem; font-weight: 700; color: var(--on-surface); }
.jd-error p  { color: var(--on-surface-variant); }

/* Spinner */
.btn-spin {
  width: 16px; height: 16px;
  border: 2.5px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Form expand transition */
.form-expand-enter-active { transition: all 0.3s ease; }
.form-expand-leave-active { transition: all 0.2s ease; }
.form-expand-enter-from,
.form-expand-leave-to { opacity: 0; transform: translateY(-8px); }

/* apply-form-inline fields gap */
.apply-form-inline {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (max-width: 1024px) {
  .jd-sidebar { position: relative; top: 0; }
  .jd-sidebar { flex-direction: row; flex-wrap: wrap; }
  .jd-apply-card  { flex: 1; min-width: 280px; }
  .jd-details-card { flex: 1; min-width: 240px; }
}

@media (max-width: 640px) {
  .jd-sidebar { flex-direction: column; }
  .jd-apply-card, .jd-details-card { min-width: 0; width: 100%; }
}
</style>
