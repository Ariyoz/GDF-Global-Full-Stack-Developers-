<template>
  <div class="hire-view">
    <!-- Hero -->
    <section class="page-hero">
      <div class="container-gfd hero-inner">
        <div class="hero-tag animate-fade-in-up">Start a Project</div>
        <h1 class="hero-headline animate-fade-in-up delay-100">
          <template v-if="targetDev">
            Hire <span class="text-gradient">{{ targetDev }}</span>
          </template>
          <template v-else>
            Hire <span class="text-gradient">World-Class Developers</span>
          </template>
        </h1>
        <p class="hero-sub animate-fade-in-up delay-200">
          <template v-if="targetDev">
            Send {{ targetDev }} a project request and get a response within 48 hours.
          </template>
          <template v-else>
            Tell us about your project and we'll match you with the perfect team within 48 hours.
          </template>
        </p>
      </div>
    </section>

    <!-- Form Section -->
    <section class="section-gfd hire-section">
      <div class="container-gfd hire-grid">

        <!-- Sidebar (desktop only) -->
        <aside class="hire-sidebar animate-slide-left">
          <h3 class="sidebar-title">How it works</h3>
          <div class="hire-steps">
            <div
              v-for="(step, i) in steps"
              :key="step.title"
              class="hire-step"
              :class="{ active: currentStep === i }"
            >
              <div class="hstep-num">{{ i + 1 }}</div>
              <div class="hstep-body">
                <p class="hstep-title">{{ step.title }}</p>
                <p class="hstep-desc">{{ step.desc }}</p>
              </div>
            </div>
          </div>
          <div class="hire-trust">
            <p class="trust-note">
              <span class="material-symbols-outlined" style="font-size:14px;color:var(--primary)">lock</span>
              Your information is 100% confidential
            </p>
            <p class="trust-note">
              <span class="material-symbols-outlined" style="font-size:14px;color:var(--primary)">bolt</span>
              Response within 48 hours
            </p>
            <p class="trust-note">
              <span class="material-symbols-outlined" style="font-size:14px;color:var(--primary)">check_circle</span>
              No commitment required
            </p>
          </div>
        </aside>

        <!-- Form Card -->
        <div class="hire-form-wrap animate-slide-right">
          <!-- Mobile step indicator -->
          <div class="mobile-steps">
            <div
              v-for="(step, i) in steps"
              :key="i"
              class="mobile-step-dot"
              :class="{ active: currentStep === i, done: currentStep > i }"
            />
          </div>

          <div class="glass-card-static hire-form-card">

            <!-- Step 1: Project Type -->
            <div v-if="currentStep === 0" class="form-step">
              <h3 class="step-heading">What are you building?</h3>
              <div class="project-types">
                <button
                  v-for="type in projectTypes"
                  :key="type.value"
                  type="button"
                  class="project-type-btn"
                  :class="{ active: form.projectType === type.value }"
                  @click="form.projectType = type.value"
                >
                  <span class="pt-icon">{{ type.icon }}</span>
                  <span class="pt-label">{{ type.label }}</span>
                </button>
              </div>
              <GfdButton variant="primary" :disabled="!form.projectType" @click="currentStep++" full>
                Continue →
              </GfdButton>
            </div>

            <!-- Step 2: Budget & Timeline -->
            <div v-else-if="currentStep === 1" class="form-step">
              <h3 class="step-heading">Budget & Timeline</h3>

              <div class="field-group">
                <label class="field-label">Budget Range</label>
                <div class="option-grid">
                  <button
                    v-for="b in BUDGET_RANGES"
                    :key="b.value"
                    type="button"
                    class="option-btn"
                    :class="{ active: form.budget === b.value }"
                    @click="form.budget = b.value"
                  >
                    <span class="opt-title">{{ b.desc }}</span>
                    <span class="opt-sub">{{ b.label }}</span>
                  </button>
                </div>
              </div>

              <div class="field-group">
                <label class="field-label">Timeline</label>
                <div class="timeline-grid">
                  <button
                    v-for="t in TIMELINES"
                    :key="t.value"
                    type="button"
                    class="timeline-btn"
                    :class="{ active: form.timeline === t.value }"
                    @click="form.timeline = t.value"
                  >
                    {{ t.label }}
                  </button>
                </div>
              </div>

              <div class="step-nav">
                <GfdButton variant="ghost" @click="currentStep--">← Back</GfdButton>
                <GfdButton variant="primary" :disabled="!form.budget || !form.timeline" @click="currentStep++">
                  Continue →
                </GfdButton>
              </div>
            </div>

            <!-- Step 3: Details -->
            <div v-else-if="currentStep === 2" class="form-step">
              <h3 class="step-heading">Project Details</h3>
              <div class="form-fields">
                <GfdInput v-model="form.name"        label="Your Name"            placeholder="Alex Morgan"              required />
                <GfdInput v-model="form.email"       label="Email"                type="email" placeholder="you@company.com" required />
                <GfdInput v-model="form.company"     label="Company"              placeholder="Your company (optional)" />
                <GfdInput v-model="form.description" label="Project Description"  type="textarea" :rows="4"
                  placeholder="Describe your project, goals, and requirements..." required />
              </div>
              <div class="step-nav">
                <GfdButton variant="ghost" @click="currentStep--">← Back</GfdButton>
                <GfdButton variant="primary" :loading="loading" @click="handleSubmit">Submit Request →</GfdButton>
              </div>
            </div>

            <!-- Success -->
            <div v-else class="success-state">
              <div class="success-icon-wrap">
                <span class="material-symbols-outlined success-icon" style="font-variation-settings:'FILL' 1">check_circle</span>
              </div>
              <h3 class="success-title">Request Submitted!</h3>
              <p class="success-desc">
                We've received your project request. Our team will review it and get back to you within 48 hours.
              </p>
              <RouterLink to="/" class="btn-primary" style="margin-top:0.5rem">Back to Home</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import GfdInput  from '@/components/ui/GfdInput.vue'
import GfdButton from '@/components/ui/GfdButton.vue'
import { BUDGET_RANGES, TIMELINES } from '@/constants'

const route = useRoute()

// Pre-fill developer name from query param when coming from a profile
const targetDev = computed(() => route.query.name ? decodeURIComponent(route.query.name) : null)

const currentStep = ref(0)
const loading     = ref(false)

const form = reactive({
  projectType: '', budget: '', timeline: '',
  name: '', email: '', company: '',
  description: targetDev.value ? `I'd like to hire ${targetDev.value} for my project. ` : '',
})

const steps = [
  { title: 'Project Type',  desc: 'What are you building?' },
  { title: 'Budget & Time', desc: 'Scope and timeline' },
  { title: 'Your Details',  desc: 'Tell us about you' },
  { title: 'Submitted',     desc: "We'll be in touch" },
]

const projectTypes = [
  { value: 'website',   icon: '🌐', label: 'Website' },
  { value: 'webapp',    icon: '⚡', label: 'Web App' },
  { value: 'mobile',    icon: '📱', label: 'Mobile App' },
  { value: 'fullstack', icon: '🚀', label: 'Full Stack' },
  { value: 'uiux',      icon: '🎨', label: 'UI/UX Design' },
  { value: 'api',       icon: '🔗', label: 'API / Backend' },
  { value: 'ecommerce', icon: '🛒', label: 'E-Commerce' },
  { value: 'custom',    icon: '💎', label: 'Custom Software' },
]

async function handleSubmit() {
  if (!form.name || !form.email || !form.description) return
  loading.value = true
  await new Promise(r => setTimeout(r, 1200))
  loading.value = false
  currentStep.value = 3
}
</script>

<style scoped>
.hire-view { background: var(--background); }

/* Hero border uses design token */
.page-hero {
  background: var(--background);
  padding: 5rem 1.25rem 3rem;
  border-bottom: 1px solid var(--outline-variant);
}

@media (min-width: 640px) {
  .page-hero { padding: 6rem 1.5rem 3.5rem; }
}

.hero-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.25rem;
}

/* Hero tag — uses design tokens for dark mode */
.hero-tag {
  display: inline-flex;
  padding: 0.3rem 0.875rem;
  background: var(--surface-container-low);
  border: 1px solid var(--glass-border-primary);
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--primary);
}

.hero-headline {
  font-family: var(--font-headline);
  font-size: clamp(1.75rem, 5vw, 3rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.025em;
  color: var(--on-surface);
  max-width: 640px;
}

.hero-sub {
  font-size: clamp(0.95rem, 2vw, 1.125rem);
  color: var(--on-surface-variant);
  line-height: 1.65;
  max-width: 520px;
}

/* Hire section — uses design token for dark mode */
.hire-section { background: var(--surface-container-low); }

.hire-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 1024px) {
  .hire-grid { grid-template-columns: 260px 1fr; gap: 3rem; }
}

/* Sidebar — hidden on mobile */
.hire-sidebar { display: none; }

@media (min-width: 1024px) {
  .hire-sidebar { display: flex; flex-direction: column; gap: 1.5rem; }
}

.sidebar-title {
  font-family: var(--font-headline);
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--on-surface);
}

.hire-steps { display: flex; flex-direction: column; gap: 1rem; }

.hire-step {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  opacity: 0.35;
  transition: opacity 0.2s ease;
}

.hire-step.active { opacity: 1; }

.hstep-num {
  width: 26px;
  height: 26px;
  border-radius: var(--radius-full);
  background: var(--surface-container);
  border: 1px solid var(--outline-variant);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-headline);
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--on-surface-variant);
  flex-shrink: 0;
}

.hire-step.active .hstep-num {
  background: rgba(99,14,212,0.1);
  border-color: rgba(99,14,212,0.3);
  color: var(--primary);
}

.hstep-title { font-family: var(--font-headline); font-size: 0.875rem; font-weight: 600; color: var(--on-surface); }
.hstep-desc  { font-size: 0.78rem; color: var(--on-surface-variant); margin-top: 0.1rem; }

/* Trust notes divider — uses design token */
.hire-trust { display: flex; flex-direction: column; gap: 0.5rem; padding-top: 0.5rem; border-top: 1px solid var(--outline-variant); }

.trust-note {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: var(--on-surface-variant);
}

/* Mobile step dots */
.mobile-steps {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

@media (min-width: 1024px) { .mobile-steps { display: none; } }

.mobile-step-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--surface-container-high);
  transition: all 0.2s ease;
}

.mobile-step-dot.active {
  background: var(--primary);
  width: 24px;
  border-radius: 4px;
}

.mobile-step-dot.done { background: rgba(99,14,212,0.3); }

/* Form Card */
.hire-form-card { padding: 1.5rem; border-radius: var(--radius-xl); }

@media (min-width: 640px) { .hire-form-card { padding: 2rem; } }

.form-step { display: flex; flex-direction: column; gap: 1.5rem; }

.step-heading {
  font-family: var(--font-headline);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--on-surface);
}

/* Project type grid — 2 cols mobile, 4 cols tablet+ */
.project-types {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.625rem;
}

@media (min-width: 480px) {
  .project-types { grid-template-columns: repeat(4, 1fr); }
}

.project-type-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  padding: 0.875rem 0.5rem;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.15s ease;
}

.project-type-btn:hover {
  border-color: rgba(99,14,212,0.3);
  background: rgba(99,14,212,0.03);
}

.project-type-btn.active {
  border-color: var(--primary);
  background: rgba(99,14,212,0.07);
}

.pt-icon  { font-size: 1.375rem; }
.pt-label {
  font-family: var(--font-headline);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--on-surface-variant);
}
.project-type-btn.active .pt-label { color: var(--primary); }

/* Budget / Timeline */
.field-group { display: flex; flex-direction: column; gap: 0.625rem; }

.field-label {
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--on-surface);
}

.option-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.option-btn {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0.75rem 0.875rem;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;
}

.option-btn:hover { border-color: rgba(99,14,212,0.3); }

.option-btn.active {
  border-color: var(--primary);
  background: rgba(99,14,212,0.06);
}

.opt-title {
  font-family: var(--font-headline);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--on-surface);
}

.opt-sub {
  font-size: 0.75rem;
  color: var(--on-surface-variant);
  margin-top: 0.1rem;
}

.option-btn.active .opt-title,
.option-btn.active .opt-sub { color: var(--primary); }

.timeline-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.timeline-btn {
  padding: 0.45rem 0.875rem;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--on-surface-variant);
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.timeline-btn:hover { border-color: rgba(99,14,212,0.3); color: var(--primary); }

.timeline-btn.active {
  border-color: var(--primary);
  background: rgba(99,14,212,0.07);
  color: var(--primary);
}

/* Form fields */
.form-fields { display: flex; flex-direction: column; gap: 1.125rem; }

/* Step nav */
.step-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  padding-top: 0.25rem;
}

/* Success */
.success-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
  padding: 2rem 1rem;
}

.success-icon-wrap {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-full);
  background: rgba(22,163,74,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-icon { font-size: 2.5rem; color: #16a34a; }

.success-title {
  font-family: var(--font-headline);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--on-surface);
}

.success-desc {
  font-size: 0.9rem;
  color: var(--on-surface-variant);
  max-width: 380px;
  line-height: 1.6;
}
</style>
