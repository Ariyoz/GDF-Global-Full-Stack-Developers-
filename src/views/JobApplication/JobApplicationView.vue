<template>
  <div class="job-app-view">
    <div class="container-gfd job-app-inner">
      <!-- Back -->
      <RouterLink to="/projects" class="back-link">
        <span class="material-symbols-outlined" style="font-size:20px">arrow_back</span>
        Back to Projects
      </RouterLink>

      <h1 class="text-headline-lg" style="margin-bottom:1.5rem">Submit Application</h1>

      <div class="job-app-grid">
        <!-- Left: Job Summary -->
        <aside class="job-summary">
          <div class="glass-card-static summary-card">
            <div class="summary-header">
              <div>
                <span class="summary-category">Full-Stack Development</span>
                <h2 class="summary-title">Next.js SaaS Infrastructure</h2>
                <p class="summary-company">By <strong>Stellar AI Labs</strong></p>
              </div>
              <div class="summary-logo">
                <span class="material-symbols-outlined" style="font-size:2rem;color:var(--primary)">business</span>
              </div>
            </div>

            <div class="summary-details">
              <div v-for="detail in jobDetails" :key="detail.label" class="summary-detail">
                <span class="material-symbols-outlined detail-icon">{{ detail.icon }}</span>
                <div>
                  <p class="detail-label">{{ detail.label }}</p>
                  <p class="detail-value">{{ detail.value }}</p>
                </div>
              </div>
            </div>

            <div class="summary-stack">
              <h3 class="stack-title">Technical Stack</h3>
              <div class="stack-chips">
                <span v-for="tech in techStack" :key="tech" class="chip">{{ tech }}</span>
              </div>
            </div>
          </div>

          <div class="proposal-guide glass-card-static">
            <p class="guide-text">
              Need help with your application?
              <a href="#" class="guide-link">Read our Proposal Guide</a>
            </p>
          </div>
        </aside>

        <!-- Right: Application Form -->
        <section class="job-form-wrap">
          <div class="glass-card-static job-form-card">
            <form @submit.prevent="handleSubmit" novalidate>
              <!-- Cover Letter -->
              <div class="form-field">
                <label class="form-label">Cover Letter</label>
                <p class="form-hint">Explain why you're the perfect fit for this infrastructure project.</p>
                <textarea
                  v-model="form.coverLetter"
                  class="form-textarea"
                  placeholder="Describe your relevant experience and how you plan to approach the technical challenges..."
                  rows="8"
                />
              </div>

              <div class="form-row">
                <!-- Rate -->
                <div class="form-field">
                  <label class="form-label">Proposed Rate (USD)</label>
                  <div class="input-prefix-wrap">
                    <span class="input-prefix">$</span>
                    <input v-model="form.rate" type="number" class="form-input with-prefix" placeholder="0.00" />
                  </div>
                </div>

                <!-- Delivery -->
                <div class="form-field">
                  <label class="form-label">Estimated Delivery</label>
                  <select v-model="form.delivery" class="form-select">
                    <option value="2">2 Weeks</option>
                    <option value="4" selected>4 Weeks</option>
                    <option value="6">6 Weeks</option>
                    <option value="8">8+ Weeks</option>
                  </select>
                </div>
              </div>

              <!-- Portfolio Link -->
              <div class="form-field">
                <label class="form-label">Project-Specific Links <span class="optional">(Optional)</span></label>
                <input v-model="form.portfolio" type="url" class="form-input" placeholder="https://github.com/yourhandle/similar-project" />
              </div>

              <!-- Submit -->
              <div class="form-submit-row">
                <p class="submit-note">You can edit your proposal until the client starts review.</p>
                <GfdButton type="submit" variant="primary" :loading="loading">
                  Submit Application
                </GfdButton>
              </div>
            </form>

            <!-- Success State -->
            <Transition name="fade">
              <div v-if="submitted" class="submit-success">
                <span class="material-symbols-outlined success-icon" style="font-variation-settings:'FILL' 1">task_alt</span>
                <div>
                  <p class="success-title">Application Submitted!</p>
                  <p class="success-desc">Your proposal has been sent. The client will review it shortly.</p>
                </div>
              </div>
            </Transition>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import GfdButton from '@/components/ui/GfdButton.vue'

const loading   = ref(false)
const submitted = ref(false)

const form = reactive({
  coverLetter: '',
  rate:        '',
  delivery:    '4',
  portfolio:   '',
})

const jobDetails = [
  { icon: 'payments',      label: 'Budget Range',         value: '$4,500 – $6,000' },
  { icon: 'schedule',      label: 'Estimated Duration',   value: '4–6 Weeks' },
  { icon: 'verified_user', label: 'Experience Required',  value: 'Senior (5+ Years)' },
]

const techStack = ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'PostgreSQL']

async function handleSubmit() {
  if (!form.coverLetter.trim()) return
  loading.value = true
  await new Promise(r => setTimeout(r, 1200))
  loading.value   = false
  submitted.value = true
}
</script>

<style scoped>
.job-app-view { background: var(--background); min-height: 100vh; padding: 2rem 0; }

.job-app-inner { padding-top: 1rem; padding-bottom: 3rem; }

.back-link {
  display: inline-flex; align-items: center; gap: 0.35rem;
  font-family: var(--font-headline); font-size: 0.875rem; font-weight: 500;
  color: var(--primary); text-decoration: none; margin-bottom: 1.25rem;
  transition: opacity 0.15s ease;
}
.back-link:hover { opacity: 0.8; }

.job-app-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  align-items: start;
}

@media (min-width: 1024px) {
  .job-app-grid { grid-template-columns: 380px 1fr; }
}

/* Summary */
.summary-card { padding: 1.75rem; border-radius: var(--radius-xl); margin-bottom: 1rem; }

.summary-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.summary-category {
  display: inline-flex;
  padding: 0.25rem 0.75rem;
  background: rgba(168,85,247,0.08);
  color: var(--primary);
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.8rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.summary-title {
  font-family: var(--font-headline);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--on-surface);
  margin-bottom: 0.25rem;
}

.summary-company { font-size: 0.875rem; color: var(--on-surface-variant); }

.summary-logo {
  width: 56px; height: 56px;
  border-radius: var(--radius-lg);
  background: var(--surface-container);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.summary-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem 0;
  border-top: 1px solid var(--outline-variant);
  border-bottom: 1px solid var(--outline-variant);
  margin-bottom: 1.25rem;
}

.summary-detail { display: flex; align-items: flex-start; gap: 0.75rem; }

.detail-icon { font-size: 22px; color: var(--primary); flex-shrink: 0; margin-top: 1px; }
.detail-label { font-size: 0.75rem; color: var(--on-surface-variant); font-family: var(--font-headline); }
.detail-value { font-family: var(--font-headline); font-size: 0.9rem; font-weight: 700; color: var(--on-surface); margin-top: 0.1rem; }

.stack-title {
  font-family: var(--font-headline);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--on-surface);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 0.625rem;
}

.stack-chips { display: flex; flex-wrap: wrap; gap: 0.4rem; }

.proposal-guide {
  padding: 1rem 1.25rem;
  border-radius: var(--radius-xl);
  border: 1px dashed var(--outline-variant) !important;
  background: transparent !important;
  text-align: center;
}

.guide-text { font-size: 0.875rem; color: var(--on-surface-variant); line-height: 1.6; }
.guide-link { color: var(--primary); font-weight: 700; text-decoration: none; }
.guide-link:hover { text-decoration: underline; }

/* Form */
.job-form-card { padding: 2rem; border-radius: var(--radius-xl); }

.form-field { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1.25rem; }

.form-label {
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--on-surface);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.form-hint { font-size: 0.8rem; color: var(--on-surface-variant); margin-top: -0.2rem; }

.optional { font-weight: 400; text-transform: none; letter-spacing: 0; color: var(--on-surface-variant); }

.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--surface-container-low);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-lg);
  font-family: var(--font-body);
  font-size: 0.9375rem;
  color: var(--on-surface);
  resize: vertical;
  outline: none;
  line-height: 1.6;
}

.form-textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(168,85,247,0.1); }

.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}

@media (min-width: 640px) { .form-row { grid-template-columns: 1fr 1fr; } }

.input-prefix-wrap { position: relative; }
.input-prefix {
  position: absolute; left: 0.875rem; top: 50%; transform: translateY(-50%);
  color: var(--on-surface-variant); font-size: 0.9rem; pointer-events: none;
}

.form-input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  background: var(--surface-container-low);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-lg);
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--on-surface);
  outline: none;
}

.form-input.with-prefix { padding-left: 1.75rem; }
.form-input:focus { border-color: var(--primary); }

.form-select {
  width: 100%;
  padding: 0.625rem 0.875rem;
  background: var(--surface-container-low);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-lg);
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--on-surface);
  outline: none;
  cursor: pointer;
}

.form-submit-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--outline-variant);
  flex-wrap: wrap;
}

.submit-note { font-size: 0.8rem; color: var(--on-surface-variant); font-style: italic; }

/* Success */
.submit-success {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(22,163,74,0.06);
  border: 1px solid rgba(22,163,74,0.2);
  border-radius: var(--radius-xl);
  margin-top: 1rem;
}

.success-icon { font-size: 2rem; color: #16a34a; flex-shrink: 0; }
.success-title { font-family: var(--font-headline); font-size: 0.9375rem; font-weight: 700; color: var(--on-surface); }
.success-desc  { font-size: 0.8rem; color: var(--on-surface-variant); margin-top: 0.2rem; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
