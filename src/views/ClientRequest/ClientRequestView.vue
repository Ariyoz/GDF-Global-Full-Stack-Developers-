<template>
  <div class="hire-root">

    <!-- Ambient background -->
    <div class="hire-ambient" aria-hidden="true">
      <div class="amb-orb amb-orb-1" />
      <div class="amb-orb amb-orb-2" />
      <div class="amb-orb amb-orb-3" />
      <div class="amb-grid" />
    </div>

    <!-- Split layout -->
    <div class="hire-split">

      <!-- ══ LEFT PANEL ══ -->
      <aside class="hire-left">
        <div class="left-inner">

          <!-- Back link -->
          <RouterLink to="/explore" class="back-link">
            <span class="material-symbols-outlined" style="font-size:18px">arrow_back</span>
            Back to Explore
          </RouterLink>

          <!-- Brand mark -->
          <div class="left-brand animate-fade-in-up">
            <div class="brand-icon">
              <span class="material-symbols-outlined" style="font-size:22px;font-variation-settings:'FILL' 1">bolt</span>
            </div>
            <span class="brand-label">GFD Hire</span>
          </div>

          <!-- Headline -->
          <div class="left-hero animate-fade-in-up delay-100">
            <h1 class="left-h1">
              <template v-if="targetDev">
                Hire <span class="text-grad">{{ targetDev }}</span><br />directly
              </template>
              <template v-else>
                Build your<br /><span class="text-grad">next big thing</span>
              </template>
            </h1>
            <p class="left-sub">
              {{ targetDev
                ? `Send a project brief to ${targetDev} and get a response within 48 hours.`
                : 'Tell us about your vision. We\'ll connect you with the perfect developer within 48 hours.' }}
            </p>
          </div>

          <!-- Trust badges -->
          <div class="trust-grid animate-fade-in-up delay-200">
            <div class="trust-item" v-for="t in TRUST" :key="t.label">
              <div class="trust-ico">
                <span class="material-symbols-outlined" style="font-size:17px;font-variation-settings:'FILL' 1">{{ t.icon }}</span>
              </div>
              <div>
                <p class="trust-val">{{ t.val }}</p>
                <p class="trust-lbl">{{ t.label }}</p>
              </div>
            </div>
          </div>

          <!-- Testimonial -->
          <div class="testimonial-card animate-fade-in-up delay-300">
            <div class="testimonial-stars">
              <span v-for="i in 5" :key="i" class="material-symbols-outlined" style="font-size:13px;color:#f59e0b;font-variation-settings:'FILL' 1">star</span>
            </div>
            <p class="testimonial-text">"Found an exceptional developer within 24 hours. The project was delivered ahead of schedule."</p>
            <div class="testimonial-author">
              <div class="testimonial-avatar">S</div>
              <div>
                <p class="t-name">Sarah Chen</p>
                <p class="t-role">CTO, StackFlow</p>
              </div>
            </div>
          </div>

          <!-- Dev avatars -->
          <div class="dev-row animate-fade-in-up delay-400">
            <div class="dev-avatars">
              <div v-for="(d, i) in DEV_AVATARS" :key="i" class="dev-av" :style="`--hue:${d.hue};z-index:${5-i}`">{{ d.init }}</div>
            </div>
            <p class="dev-row-text"><strong>500+</strong> verified developers ready</p>
          </div>

        </div>
      </aside>

      <!-- ══ RIGHT PANEL ══ -->
      <main class="hire-right">
        <div class="right-inner">

          <!-- Step indicator -->
          <div class="step-indicator" v-if="currentStep < STEPS.length">
            <div class="step-chips">
              <div v-for="(s, i) in STEPS" :key="i"
                class="step-chip"
                :class="{ active: currentStep === i, done: currentStep > i }"
                @click="currentStep > i && (currentStep = i)"
                :style="currentStep > i ? 'cursor:pointer' : ''">
                <span v-if="currentStep > i" class="material-symbols-outlined" style="font-size:12px;font-variation-settings:'FILL' 1">check</span>
                <span v-else>{{ i + 1 }}</span>
              </div>
            </div>
            <div class="step-progress">
              <div class="step-progress-fill" :style="`width:${((currentStep) / (STEPS.length - 1)) * 100}%`" />
            </div>
            <p class="step-label-text">{{ STEPS[currentStep]?.title }}</p>
          </div>

          <!-- ═══ FORM CARD ═══ -->
          <div class="form-glass">
            <Transition name="slide-fade" mode="out-in">

            <!-- ═ STEP 0: Project Type ═ -->
            <div v-if="currentStep === 0" key="s0" class="fstep">
              <div class="fstep-head">
                <div class="fstep-icon-wrap">
                  <span class="material-symbols-outlined fstep-icon" style="font-variation-settings:'FILL' 1">category</span>
                </div>
                <div>
                  <h2 class="fstep-title">What are you building?</h2>
                  <p class="fstep-desc">Select the type of project you need help with.</p>
                </div>
              </div>

              <div class="type-grid">
                <button v-for="t in PROJECT_TYPES" :key="t.value"
                  class="type-card"
                  :class="{ active: form.projectType === t.value }"
                  @click="form.projectType = t.value; nextStep()">
                  <div class="type-card-ico">
                    <span class="material-symbols-outlined" style="font-size:22px;font-variation-settings:'FILL' 1">{{ t.icon }}</span>
                  </div>
                  <div class="type-card-body">
                    <p class="type-card-lbl">{{ t.label }}</p>
                    <p class="type-card-desc">{{ t.desc }}</p>
                  </div>
                  <span v-if="form.projectType === t.value"
                    class="material-symbols-outlined type-check"
                    style="font-variation-settings:'FILL' 1">check_circle</span>
                  <span v-else class="material-symbols-outlined type-card-arrow">arrow_forward_ios</span>
                </button>
              </div>
            </div>

            <!-- ═ STEP 1: Skills ═ -->
            <div v-else-if="currentStep === 1" key="s1" class="fstep">
              <div class="fstep-head">
                <div class="fstep-icon-wrap">
                  <span class="material-symbols-outlined fstep-icon" style="font-variation-settings:'FILL' 1">code</span>
                </div>
                <div>
                  <h2 class="fstep-title">Tech Stack & Skills</h2>
                  <p class="fstep-desc">What technologies does your project involve? Pick all that apply.</p>
                </div>
              </div>

              <div class="skill-grid">
                <button v-for="s in SKILLS" :key="s"
                  class="skill-tag"
                  :class="{ active: form.skills.includes(s) }"
                  @click="toggleSkill(s)">
                  <span v-if="form.skills.includes(s)" class="material-symbols-outlined" style="font-size:13px;font-variation-settings:'FILL' 1">check</span>
                  {{ s }}
                </button>
              </div>
              <p class="skill-hint">{{ form.skills.length }} selected</p>

              <div class="step-nav">
                <button class="nav-back" @click="currentStep--">
                  <span class="material-symbols-outlined" style="font-size:16px">arrow_back</span> Back
                </button>
                <button class="nav-next" @click="nextStep()">
                  Continue <span class="material-symbols-outlined" style="font-size:16px">arrow_forward</span>
                </button>
              </div>
            </div>

            <!-- ═ STEP 2: Budget & Timeline ═ -->
            <div v-else-if="currentStep === 2" key="s2" class="fstep">
              <div class="fstep-head">
                <div class="fstep-icon-wrap">
                  <span class="material-symbols-outlined fstep-icon" style="font-variation-settings:'FILL' 1">payments</span>
                </div>
                <div>
                  <h2 class="fstep-title">Budget & Timeline</h2>
                  <p class="fstep-desc">Set your project scope so developers can plan accordingly.</p>
                </div>
              </div>

              <div class="field-section">
                <label class="field-label">Budget Range</label>
                <div class="budget-grid">
                  <button v-for="b in BUDGET_RANGES" :key="b.value"
                    class="budget-card"
                    :class="{ active: form.budget === b.value }"
                    @click="form.budget = b.value">
                    <span class="budget-range">{{ b.range }}</span>
                    <span class="budget-name">{{ b.label }}</span>
                    <span v-if="form.budget === b.value"
                      class="material-symbols-outlined budget-check"
                      style="font-variation-settings:'FILL' 1">check_circle</span>
                  </button>
                </div>
              </div>

              <div class="field-section">
                <label class="field-label">Project Timeline</label>
                <div class="timeline-row">
                  <button v-for="t in TIMELINES" :key="t.value"
                    class="timeline-pill"
                    :class="{ active: form.timeline === t.value }"
                    @click="form.timeline = t.value">
                    <span class="material-symbols-outlined" style="font-size:15px">{{ t.icon }}</span>
                    {{ t.label }}
                  </button>
                </div>
              </div>

              <div class="step-nav">
                <button class="nav-back" @click="currentStep--">
                  <span class="material-symbols-outlined" style="font-size:16px">arrow_back</span> Back
                </button>
                <button class="nav-next" :disabled="!form.budget || !form.timeline" @click="nextStep()">
                  Continue <span class="material-symbols-outlined" style="font-size:16px">arrow_forward</span>
                </button>
              </div>
            </div>

            <!-- ═ STEP 3: Details ═ -->
            <div v-else-if="currentStep === 3" key="s3" class="fstep">
              <div class="fstep-head">
                <div class="fstep-icon-wrap">
                  <span class="material-symbols-outlined fstep-icon" style="font-variation-settings:'FILL' 1">assignment</span>
                </div>
                <div>
                  <h2 class="fstep-title">Project Details</h2>
                  <p class="fstep-desc">Tell us about yourself and your vision.</p>
                </div>
              </div>

              <div class="detail-grid">
                <div class="inp-field" :class="{ focused: focus.name, filled: form.name }">
                  <label class="inp-label">Your Name <span class="req-dot">*</span></label>
                  <div class="inp-wrap">
                    <span class="material-symbols-outlined inp-icon">person</span>
                    <input v-model="form.name" type="text" placeholder="Alex Morgan"
                      @focus="focus.name=true" @blur="focus.name=false" />
                  </div>
                </div>

                <div class="inp-field" :class="{ focused: focus.email, filled: form.email }">
                  <label class="inp-label">Email Address <span class="req-dot">*</span></label>
                  <div class="inp-wrap">
                    <span class="material-symbols-outlined inp-icon">mail</span>
                    <input v-model="form.email" type="email" placeholder="you@company.com"
                      @focus="focus.email=true" @blur="focus.email=false" />
                  </div>
                </div>

                <div class="inp-field full-col" :class="{ focused: focus.company, filled: form.company }">
                  <label class="inp-label">Company <span class="optional-tag">optional</span></label>
                  <div class="inp-wrap">
                    <span class="material-symbols-outlined inp-icon">business</span>
                    <input v-model="form.company" type="text" placeholder="Your company or startup"
                      @focus="focus.company=true" @blur="focus.company=false" />
                  </div>
                </div>

                <div class="inp-field full-col textarea-field" :class="{ focused: focus.desc, filled: form.description }">
                  <label class="inp-label">Project Description <span class="req-dot">*</span></label>
                  <div class="inp-wrap">
                    <textarea v-model="form.description" rows="5"
                      placeholder="Describe your project goals, key features, preferred tech stack, and any specific requirements…"
                      @focus="focus.desc=true" @blur="focus.desc=false"
                      maxlength="1000" />
                  </div>
                  <div class="char-bar">
                    <div class="char-fill" :style="`width:${(form.description.length/1000)*100}%`" />
                  </div>
                  <p class="char-count">{{ form.description.length }}/1000</p>
                </div>
              </div>

              <!-- Summary preview -->
              <div class="summary-preview" v-if="form.projectType">
                <div class="summary-item">
                  <span class="material-symbols-outlined" style="font-size:15px">category</span>
                  {{ PROJECT_TYPES.find(t => t.value === form.projectType)?.label }}
                </div>
                <div class="summary-item" v-if="form.budget">
                  <span class="material-symbols-outlined" style="font-size:15px">payments</span>
                  {{ BUDGET_RANGES.find(b => b.value === form.budget)?.range }}
                </div>
                <div class="summary-item" v-if="form.timeline">
                  <span class="material-symbols-outlined" style="font-size:15px">schedule</span>
                  {{ TIMELINES.find(t => t.value === form.timeline)?.label }}
                </div>
                <div class="summary-item" v-if="form.skills.length">
                  <span class="material-symbols-outlined" style="font-size:15px">code</span>
                  {{ form.skills.slice(0,3).join(', ') }}{{ form.skills.length > 3 ? ` +${form.skills.length-3}` : '' }}
                </div>
              </div>

              <div class="step-nav">
                <button class="nav-back" @click="currentStep--">
                  <span class="material-symbols-outlined" style="font-size:16px">arrow_back</span> Back
                </button>
                <button class="nav-submit"
                  :disabled="!form.name || !form.email || !form.description || loading"
                  @click="handleSubmit">
                  <span v-if="loading" class="btn-spin" />
                  <template v-else>
                    <span class="material-symbols-outlined" style="font-size:16px;font-variation-settings:'FILL' 1">send</span>
                    Send Request
                  </template>
                </button>
              </div>
            </div>

            <!-- ═ SUCCESS ═ -->
            <div v-else key="done" class="success-panel">
              <div class="success-glow" />
              <div class="success-icon-ring">
                <span class="material-symbols-outlined" style="font-size:2.75rem;color:#22c55e;font-variation-settings:'FILL' 1">check_circle</span>
              </div>
              <h2 class="success-h2">Request Sent! 🎉</h2>
              <p class="success-p">
                {{ targetDev
                  ? `${targetDev} has been notified. A conversation has been opened in your messages.`
                  : "We've received your project brief. A matched developer will reach out within 48 hours." }}
              </p>
              <div class="success-next">
                <div v-for="(s, i) in SUCCESS_STEPS" :key="i" class="snext-item">
                  <div class="snext-num">{{ i + 1 }}</div>
                  <div>
                    <p class="snext-title">{{ s.title }}</p>
                    <p class="snext-desc">{{ s.desc }}</p>
                  </div>
                </div>
              </div>
              <div class="success-actions">
                <RouterLink to="/messaging" class="nav-submit" style="text-decoration:none">
                  <span class="material-symbols-outlined" style="font-size:16px">chat</span>
                  View Messages
                </RouterLink>
                <RouterLink to="/dashboard/requests" class="nav-submit" style="text-decoration:none;background:var(--surface-container);color:var(--primary);border:1.5px solid rgba(99,14,212,.25);box-shadow:none">
                  <span class="material-symbols-outlined" style="font-size:16px">handshake</span>
                  My Hire Requests
                </RouterLink>
                <RouterLink to="/explore" class="nav-back" style="text-decoration:none">
                  Explore More
                </RouterLink>
              </div>
            </div>
            </Transition>

          </div><!-- /form-glass -->
        </div><!-- /right-inner -->
      </main>

    </div><!-- /hire-split -->
  </div><!-- /hire-root -->
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { hireService } from '@/services/hire.service'

const route  = useRoute()
const auth   = useAuthStore()

const targetDev = computed(() => route.query.name || null)
const targetDevId = computed(() => route.query.dev || null)

// ── Constants ──────────────────────────────────────────────
const TRUST = [
  { icon: 'verified',      val: '500+',  label: 'Verified devs'     },
  { icon: 'bolt',          val: '48h',   label: 'Avg. response'     },
  { icon: 'lock',          val: '100%',  label: 'Confidential'      },
  { icon: 'star',          val: '4.9★',  label: 'Client rating'     },
]

const DEV_AVATARS = [
  { init: 'A', hue: 260 }, { init: 'K', hue: 200 }, { init: 'M', hue: 330 },
  { init: 'J', hue: 160 }, { init: 'R', hue: 30  },
]

const PROJECT_TYPES = [
  { value: 'web',      icon: 'public',          label: 'Web Application',    desc: 'Full-stack or frontend web app' },
  { value: 'mobile',   icon: 'smartphone',       label: 'Mobile App',         desc: 'iOS, Android or cross-platform' },
  { value: 'backend',  icon: 'settings_ethernet',label: 'API / Backend',      desc: 'REST, GraphQL, microservices'   },
  { value: 'design',   icon: 'palette',          label: 'UI/UX Design',       desc: 'Figma, prototypes, design systems' },
  { value: 'ai',       icon: 'smart_toy',        label: 'AI / ML',            desc: 'Models, pipelines, integrations'  },
  { value: 'devops',   icon: 'cloud_upload',     label: 'DevOps / Cloud',     desc: 'Infra, CI/CD, Kubernetes'         },
  { value: 'data',     icon: 'bar_chart',        label: 'Data Engineering',   desc: 'ETL, analytics, dashboards'       },
  { value: 'other',    icon: 'lightbulb',        label: 'Something Else',     desc: 'Tell us about your idea'          },
]

const SKILLS = [
  'React','Vue','Next.js','Angular','TypeScript','JavaScript',
  'Node.js','Python','Django','FastAPI','Go','Rust',
  'PostgreSQL','MongoDB','Redis','GraphQL','Docker','Kubernetes',
  'AWS','GCP','Azure','Figma','Flutter','React Native',
]

const BUDGET_RANGES = [
  { value: 'starter',      range: '$500 – $2K',    label: 'Starter'      },
  { value: 'professional', range: '$2K – $8K',     label: 'Professional' },
  { value: 'business',     range: '$8K – $25K',    label: 'Business'     },
  { value: 'enterprise',   range: '$25K+',          label: 'Enterprise'   },
]

const TIMELINES = [
  { value: 'rush',     icon: 'flash_on',   label: '< 1 Week'   },
  { value: 'short',    icon: 'speed',      label: '1–2 Weeks'  },
  { value: 'medium',   icon: 'schedule',   label: '1–2 Months' },
  { value: 'long',     icon: 'calendar_month', label: '3+ Months'  },
]

const STEPS = [
  { title: 'Project Type',  icon: 'category'   },
  { title: 'Tech Stack',    icon: 'code'        },
  { title: 'Budget & Time', icon: 'payments'    },
  { title: 'Your Details',  icon: 'person'      },
]

const SUCCESS_STEPS = [
  { title: 'Developer Reviews',  desc: "They'll review your brief and requirements." },
  { title: 'Discovery Call',     desc: 'Schedule a call to align on scope and timeline.' },
  { title: 'Proposal & Escrow',  desc: 'Receive a detailed proposal and fund the secure escrow.' },
  { title: 'Development Begins', desc: 'Work starts with daily updates and milestone tracking.' },
]

// ── State ──────────────────────────────────────────────────
const currentStep = ref(0)
const loading     = ref(false)

const form = reactive({
  projectType:  '',
  skills:       [],
  budget:       '',
  timeline:     '',
  name:         auth.user?.full_name || '',
  email:        auth.user?.email     || '',
  company:      '',
  description:  '',
})

const focus = reactive({ name: false, email: false, company: false, desc: false })

// ── Methods ────────────────────────────────────────────────
function toggleSkill(s) {
  const idx = form.skills.indexOf(s)
  if (idx === -1) form.skills.push(s)
  else form.skills.splice(idx, 1)
}

function nextStep() {
  if (currentStep.value < STEPS.length - 1) currentStep.value++
}

async function handleSubmit() {
  loading.value = true
  try {
    const devId = targetDevId.value
    const budgetLabel = BUDGET_RANGES.find(b => b.value === form.budget)?.range || form.budget
    const timelineLabel = TIMELINES.find(t => t.value === form.timeline)?.label || form.timeline
    const projectTypeLabel = PROJECT_TYPES.find(t => t.value === form.projectType)?.label || form.projectType

    await hireService.sendHireRequest(devId, {
      projectTitle:  projectTypeLabel,
      projectType:   form.projectType,
      description:   form.description,
      budget:        budgetLabel,
      duration:      timelineLabel,
      skills:        form.skills,
      clientName:    form.name,
      clientEmail:   form.email,
      company:       form.company,
    })
    currentStep.value = STEPS.length // show success
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* ════════════════════════════════════════════
   HIRE PAGE — Root & Layout
   ════════════════════════════════════════════ */
.hire-root {
  min-height: 100vh;
  background: var(--background);
  position: relative;
  overflow: hidden;
}

/* Ambient background */
.hire-ambient {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}
.amb-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
}
.amb-orb-1 {
  width: 600px; height: 600px;
  top: -200px; left: -100px;
  background: radial-gradient(circle, rgba(99,14,212,0.10) 0%, transparent 70%);
}
.amb-orb-2 {
  width: 500px; height: 500px;
  top: 40%; right: -100px;
  background: radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%);
}
.amb-orb-3 {
  width: 400px; height: 400px;
  bottom: -100px; left: 30%;
  background: radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%);
}
[data-theme="dark"] .amb-orb-1 { background: radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%); }
[data-theme="dark"] .amb-orb-2 { background: radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%); }
[data-theme="dark"] .amb-orb-3 { background: radial-gradient(circle, rgba(99,14,212,0.08) 0%, transparent 70%); }

.amb-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(99,14,212,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99,14,212,0.03) 1px, transparent 1px);
  background-size: 48px 48px;
}
[data-theme="dark"] .amb-grid {
  background-image:
    linear-gradient(rgba(168,85,247,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(168,85,247,0.05) 1px, transparent 1px);
}

/* ── Split layout ── */
.hire-split {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 420px 1fr;
  min-height: 100vh;
}

@media (max-width: 1024px) {
  .hire-split { grid-template-columns: 1fr; }
}

/* ════════════════════════════════════════════
   LEFT PANEL
   ════════════════════════════════════════════ */
.hire-left {
  background: linear-gradient(160deg, rgba(99,14,212,0.06) 0%, transparent 60%);
  border-right: 1px solid var(--outline-variant);
  padding: 2rem 0;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  scrollbar-width: none;
}
.hire-left::-webkit-scrollbar { display: none; }

[data-theme="dark"] .hire-left {
  background: linear-gradient(160deg, rgba(168,85,247,0.08) 0%, transparent 60%);
  border-right-color: rgba(168,85,247,0.12);
}

@media (max-width: 1024px) {
  .hire-left {
    position: relative;
    height: auto;
    border-right: none;
    border-bottom: 1px solid var(--outline-variant);
    padding: 1.5rem 0;
  }
}

.left-inner {
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Back link */
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--on-surface-variant);
  font-family: var(--font-headline);
  font-size: 0.8125rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.15s ease;
  width: fit-content;
}
.back-link:hover { color: var(--primary); }

/* Brand */
.left-brand {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}
.brand-icon {
  width: 36px; height: 36px;
  border-radius: var(--radius-md);
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 4px 16px rgba(99,14,212,0.3);
}
.brand-label {
  font-family: var(--font-headline);
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--on-surface);
  letter-spacing: -0.01em;
}

/* Headline */
.left-h1 {
  font-family: var(--font-headline);
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 800;
  color: var(--on-surface);
  line-height: 1.15;
  letter-spacing: -0.03em;
}
.text-grad {
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.left-sub {
  font-size: 0.9375rem;
  color: var(--on-surface-variant);
  line-height: 1.6;
  margin-top: 0.75rem;
}

/* Trust grid */
.trust-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}
.trust-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-lg);
  transition: border-color 0.15s ease;
}
.trust-item:hover { border-color: rgba(99,14,212,0.25); }
.trust-ico {
  width: 32px; height: 32px;
  border-radius: var(--radius-md);
  background: rgba(99,14,212,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  flex-shrink: 0;
}
[data-theme="dark"] .trust-ico { background: rgba(168,85,247,0.12); }
.trust-val {
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--on-surface);
  line-height: 1;
}
.trust-lbl {
  font-size: 0.7rem;
  color: var(--on-surface-variant);
  margin-top: 1px;
}

/* Testimonial */
.testimonial-card {
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-xl);
  padding: 1.25rem;
  position: relative;
  overflow: hidden;
}
.testimonial-card::before {
  content: '"';
  position: absolute;
  top: -10px; right: 12px;
  font-size: 5rem;
  color: var(--primary);
  opacity: 0.08;
  font-family: var(--font-headline);
  line-height: 1;
}
.testimonial-stars { display: flex; gap: 2px; margin-bottom: 0.625rem; }
.testimonial-text {
  font-size: 0.875rem;
  color: var(--on-surface);
  line-height: 1.6;
  font-style: italic;
  margin-bottom: 0.875rem;
}
.testimonial-author { display: flex; align-items: center; gap: 0.625rem; }
.testimonial-avatar {
  width: 32px; height: 32px;
  border-radius: var(--radius-full);
  background: var(--gradient-primary);
  color: #fff;
  font-family: var(--font-headline);
  font-size: 0.8125rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.t-name {
  font-family: var(--font-headline);
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--on-surface);
}
.t-role { font-size: 0.7rem; color: var(--on-surface-variant); }

/* Dev row */
.dev-row { display: flex; align-items: center; gap: 0.75rem; }
.dev-avatars { display: flex; }
.dev-av {
  width: 32px; height: 32px;
  border-radius: var(--radius-full);
  border: 2px solid var(--background);
  background: hsl(var(--hue), 65%, 55%);
  color: #fff;
  font-family: var(--font-headline);
  font-size: 0.7rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -8px;
  position: relative;
}
.dev-av:first-child { margin-left: 0; }
.dev-row-text { font-size: 0.8125rem; color: var(--on-surface-variant); }
.dev-row-text strong { color: var(--on-surface); }

/* ════════════════════════════════════════════
   RIGHT PANEL
   ════════════════════════════════════════════ */
.hire-right {
  padding: 2rem 0;
  overflow-y: auto;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}
.right-inner {
  width: 100%;
  max-width: 620px;
  padding: 2rem 2rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

@media (max-width: 640px) {
  .right-inner { padding: 1.5rem 1rem 5rem; }
}

/* Step indicator */
.step-indicator { display: flex; flex-direction: column; gap: 0.5rem; }
.step-chips { display: flex; gap: 0.5rem; }
.step-chip {
  width: 28px; height: 28px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-headline);
  font-size: 0.7rem;
  font-weight: 700;
  border: 2px solid var(--outline-variant);
  color: var(--on-surface-variant);
  background: var(--surface-container-low);
  transition: all 0.2s ease;
}
.step-chip.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
  box-shadow: 0 4px 12px rgba(99,14,212,0.35);
}
.step-chip.done {
  background: rgba(34,197,94,0.12);
  border-color: #22c55e;
  color: #22c55e;
}
.step-progress {
  height: 3px;
  background: var(--surface-container-high);
  border-radius: var(--radius-full);
  overflow: hidden;
}
.step-progress-fill {
  height: 100%;
  background: var(--gradient-primary);
  border-radius: var(--radius-full);
  transition: width 0.4s cubic-bezier(0.4,0,0.2,1);
}
.step-label-text {
  font-family: var(--font-headline);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--on-surface-variant);
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

/* ════════════════════════════════════════════
   FORM GLASS CARD
   ════════════════════════════════════════════ */
.form-glass {
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-2xl);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.25s ease;
}
.form-glass:hover { box-shadow: var(--shadow-md); }

/* ── Form step base ── */
.fstep { padding: 2rem; }

@media (max-width: 480px) { .fstep { padding: 1.25rem; } }

.fstep-head {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.75rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--outline-variant);
}
.fstep-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-lg);
  background: rgba(99,14,212,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
[data-theme="dark"] .fstep-icon-wrap {
  background: rgba(168,85,247,0.12);
}
.fstep-icon {
  font-size: 22px !important;
  color: var(--primary);
}
.fstep-title {
  font-family: var(--font-headline);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--on-surface);
  letter-spacing: -0.02em;
  margin-bottom: 0.25rem;
}
.fstep-desc {
  font-size: 0.875rem;
  color: var(--on-surface-variant);
  line-height: 1.5;
}

/* ── TYPE GRID ── */
.type-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}
@media (max-width: 480px) { .type-grid { grid-template-columns: 1fr; } }

.type-card {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1rem;
  background: var(--surface-container-low);
  border: 1.5px solid var(--outline-variant);
  border-radius: var(--radius-xl);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
  text-align: left;
  position: relative;
  overflow: hidden;
}
.type-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--gradient-primary);
  opacity: 0;
  transition: opacity 0.2s ease;
}
.type-card:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(99,14,212,0.12);
}
.type-card.active {
  border-color: var(--primary);
  background: rgba(99,14,212,0.04);
  box-shadow: 0 0 0 3px rgba(99,14,212,0.12);
}
[data-theme="dark"] .type-card.active {
  background: rgba(168,85,247,0.08);
  box-shadow: 0 0 0 3px rgba(168,85,247,0.15);
}
.type-card-ico {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: rgba(99,14,212,0.07);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  flex-shrink: 0;
  z-index: 1;
  position: relative;
  transition: background 0.2s ease;
}
.type-card:hover .type-card-ico,
.type-card.active .type-card-ico {
  background: rgba(99,14,212,0.14);
}
[data-theme="dark"] .type-card-ico { background: rgba(168,85,247,0.10); }
[data-theme="dark"] .type-card:hover .type-card-ico,
[data-theme="dark"] .type-card.active .type-card-ico { background: rgba(168,85,247,0.18); }
.type-card-body { flex: 1; z-index: 1; position: relative; }
.type-card-lbl {
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--on-surface);
}
.type-card-desc {
  font-size: 0.75rem;
  color: var(--on-surface-variant);
  margin-top: 1px;
  line-height: 1.4;
}
.type-check {
  color: var(--primary);
  font-size: 18px !important;
  z-index: 1;
  position: relative;
  flex-shrink: 0;
}
.type-card-arrow {
  font-size: 14px !important;
  color: var(--on-surface-variant);
  transition: transform 0.2s ease, color 0.2s ease;
  z-index: 1;
  position: relative;
  flex-shrink: 0;
}
.type-card:hover .type-card-arrow { transform: translateX(3px); color: var(--primary); }
.type-card.active .type-card-arrow { display: none; }

/* ── SKILL GRID ── */
.skill-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
.skill-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 0.875rem;
  background: var(--surface-container-low);
  border: 1.5px solid var(--outline-variant);
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--on-surface-variant);
  cursor: pointer;
  transition: all 0.18s ease;
}
.skill-tag:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: rgba(99,14,212,0.04);
}
.skill-tag.active {
  background: rgba(99,14,212,0.08);
  border-color: var(--primary);
  color: var(--primary);
  font-weight: 600;
}
[data-theme="dark"] .skill-tag.active {
  background: rgba(168,85,247,0.12);
  border-color: var(--primary);
}
.skill-hint {
  font-size: 0.75rem;
  color: var(--on-surface-variant);
  margin-bottom: 1.5rem;
}

/* ── BUDGET GRID ── */
.field-section { margin-bottom: 1.5rem; }
.field-label {
  display: block;
  font-family: var(--font-headline);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--on-surface);
  margin-bottom: 0.625rem;
  letter-spacing: 0.01em;
}
.budget-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.625rem;
}
@media (max-width: 400px) { .budget-grid { grid-template-columns: 1fr; } }

.budget-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.2rem;
  padding: 0.875rem 1rem;
  background: var(--surface-container-low);
  border: 1.5px solid var(--outline-variant);
  border-radius: var(--radius-xl);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  text-align: left;
}
.budget-card:hover {
  border-color: var(--primary);
  background: rgba(99,14,212,0.03);
}
.budget-card.active {
  border-color: var(--primary);
  background: rgba(99,14,212,0.06);
  box-shadow: 0 0 0 3px rgba(99,14,212,0.10);
}
[data-theme="dark"] .budget-card.active {
  background: rgba(168,85,247,0.10);
  box-shadow: 0 0 0 3px rgba(168,85,247,0.14);
}
.budget-range {
  font-family: var(--font-headline);
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--on-surface);
  line-height: 1;
}
.budget-name {
  font-size: 0.75rem;
  color: var(--on-surface-variant);
}
.budget-check {
  position: absolute;
  top: 0.625rem;
  right: 0.625rem;
  font-size: 16px !important;
  color: var(--primary);
}

/* ── TIMELINE ROW ── */
.timeline-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.timeline-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  background: var(--surface-container-low);
  border: 1.5px solid var(--outline-variant);
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--on-surface-variant);
  cursor: pointer;
  transition: all 0.18s ease;
}
.timeline-pill:hover { border-color: var(--primary); color: var(--primary); }
.timeline-pill.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
  box-shadow: 0 4px 12px rgba(99,14,212,0.3);
}

/* ── DETAIL FIELDS ── */
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.25rem;
}
@media (max-width: 520px) { .detail-grid { grid-template-columns: 1fr; } }

.full-col { grid-column: 1 / -1; }

.inp-field { display: flex; flex-direction: column; gap: 0.375rem; }
.inp-label {
  font-family: var(--font-headline);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--on-surface-variant);
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: color 0.15s ease;
}
.inp-field.focused .inp-label { color: var(--primary); }
.req-dot {
  color: var(--primary);
  font-size: 1rem;
  line-height: 1;
}
.optional-tag {
  font-size: 0.7rem;
  font-weight: 400;
  color: var(--on-surface-variant);
  background: var(--surface-container);
  padding: 1px 6px;
  border-radius: var(--radius-full);
}
.inp-wrap {
  display: flex;
  align-items: center;
  background: var(--surface-container-low);
  border: 1.5px solid var(--outline-variant);
  border-radius: var(--radius-lg);
  transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
  overflow: hidden;
}
.inp-field.focused .inp-wrap {
  border-color: var(--primary);
  background: var(--surface-container-lowest);
  box-shadow: 0 0 0 3px rgba(99,14,212,0.10);
}
[data-theme="dark"] .inp-field.focused .inp-wrap {
  box-shadow: 0 0 0 3px rgba(168,85,247,0.14);
}
.inp-icon {
  font-size: 16px !important;
  color: var(--on-surface-variant);
  padding: 0 0.625rem 0 0.875rem;
  flex-shrink: 0;
  transition: color 0.15s ease;
}
.inp-field.focused .inp-icon { color: var(--primary); }
.inp-wrap input,
.inp-wrap textarea {
  flex: 1;
  padding: 0.6875rem 0.75rem 0.6875rem 0;
  background: transparent;
  border: none;
  outline: none;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--on-surface);
  resize: none;
  width: 100%;
  min-width: 0;
}
.inp-wrap input::placeholder,
.inp-wrap textarea::placeholder {
  color: var(--on-surface-variant);
  opacity: 0.5;
}
.textarea-field .inp-wrap { align-items: flex-start; }
.textarea-field .inp-icon { padding-top: 0.8rem; }

.char-bar {
  height: 2px;
  background: var(--surface-container-high);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-top: 0.25rem;
}
.char-fill {
  height: 100%;
  background: var(--gradient-primary);
  border-radius: var(--radius-full);
  transition: width 0.2s ease;
}
.char-count {
  font-size: 0.7rem;
  color: var(--on-surface-variant);
  text-align: right;
  margin-top: 0.15rem;
}

/* ── Summary Preview ── */
.summary-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  background: rgba(99,14,212,0.04);
  border: 1px solid rgba(99,14,212,0.12);
  border-radius: var(--radius-lg);
  margin-bottom: 1.25rem;
}
[data-theme="dark"] .summary-preview {
  background: rgba(168,85,247,0.06);
  border-color: rgba(168,85,247,0.15);
}
.summary-item {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-family: var(--font-headline);
  font-size: 0.775rem;
  font-weight: 600;
  color: var(--primary);
}

/* ── NAV BUTTONS ── */
.step-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--outline-variant);
  margin-top: 1.5rem;
}
.nav-back {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.6875rem 1.25rem;
  background: transparent;
  border: 1.5px solid var(--outline-variant);
  border-radius: var(--radius-lg);
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--on-surface-variant);
  cursor: pointer;
  transition: all 0.18s ease;
  text-decoration: none;
}
.nav-back:hover {
  border-color: var(--outline);
  color: var(--on-surface);
  background: var(--surface-container-low);
}
.nav-next {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.6875rem 1.5rem;
  background: var(--gradient-primary);
  border: none;
  border-radius: var(--radius-lg);
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
  box-shadow: 0 4px 16px rgba(99,14,212,0.3);
}
.nav-next:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(99,14,212,0.4);
}
.nav-next:active:not(:disabled) { transform: scale(0.97); }
.nav-next:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  box-shadow: none;
}
.nav-submit {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.75rem;
  background: var(--gradient-primary);
  border: none;
  border-radius: var(--radius-lg);
  font-family: var(--font-headline);
  font-size: 0.9375rem;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
  box-shadow: 0 4px 24px rgba(99,14,212,0.35);
  text-decoration: none;
  letter-spacing: 0.01em;
}
.nav-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 36px rgba(99,14,212,0.45);
}
.nav-submit:active:not(:disabled) { transform: scale(0.97); }
.nav-submit:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  box-shadow: none;
}

/* Loading spinner */
.btn-spin {
  width: 16px; height: 16px;
  border: 2.5px solid rgba(255,255,255,0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spinSlow 0.7s linear infinite;
  display: inline-block;
}
@keyframes spinSlow { to { transform: rotate(360deg); } }

/* ════════════════════════════════════════════
   SUCCESS PANEL
   ════════════════════════════════════════════ */
.success-panel {
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
  position: relative;
  overflow: hidden;
}
.success-glow {
  position: absolute;
  width: 300px; height: 300px;
  top: -80px; left: 50%;
  transform: translateX(-50%);
  background: radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%);
  pointer-events: none;
}
.success-icon-ring {
  width: 88px; height: 88px;
  border-radius: var(--radius-full);
  background: rgba(34,197,94,0.10);
  border: 2px solid rgba(34,197,94,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1);
}
@keyframes scaleIn {
  from { transform: scale(0.6); opacity: 0; }
  to   { transform: scale(1);   opacity: 1; }
}
.success-h2 {
  font-family: var(--font-headline);
  font-size: 1.625rem;
  font-weight: 800;
  color: var(--on-surface);
  letter-spacing: -0.02em;
}
.success-p {
  font-size: 0.9375rem;
  color: var(--on-surface-variant);
  line-height: 1.65;
  max-width: 420px;
}
.success-next {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  text-align: left;
  padding: 1.25rem;
  background: var(--surface-container-low);
  border-radius: var(--radius-xl);
  border: 1px solid var(--outline-variant);
}
.snext-item { display: flex; align-items: flex-start; gap: 0.875rem; }
.snext-num {
  width: 26px; height: 26px;
  border-radius: var(--radius-full);
  background: rgba(99,14,212,0.10);
  border: 1px solid rgba(99,14,212,0.18);
  color: var(--primary);
  font-family: var(--font-headline);
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}
[data-theme="dark"] .snext-num {
  background: rgba(168,85,247,0.12);
  border-color: rgba(168,85,247,0.2);
}
.snext-title {
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--on-surface);
}
.snext-desc {
  font-size: 0.8rem;
  color: var(--on-surface-variant);
  margin-top: 0.15rem;
  line-height: 1.5;
}
.success-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}
@media (max-width: 400px) {
  .success-actions { flex-direction: column; width: 100%; }
  .success-actions .nav-submit,
  .success-actions .nav-back { justify-content: center; }
}

/* ════════════════════════════════════════════
   TRANSITIONS
   ════════════════════════════════════════════ */
.slide-fade-enter-active { transition: all 0.3s cubic-bezier(0.4,0,0.2,1); }
.slide-fade-leave-active { transition: all 0.2s cubic-bezier(0.4,0,0.2,1); }
.slide-fade-enter-from   { opacity: 0; transform: translateX(20px); }
.slide-fade-leave-to     { opacity: 0; transform: translateX(-20px); }

/* ════════════════════════════════════════════
   MOBILE OVERRIDES
   ════════════════════════════════════════════ */
@media (max-width: 1024px) {
  .hire-left {
    padding: 2rem 0 1rem;
  }
  .left-inner {
    gap: 1.25rem;
  }
  .trust-grid { grid-template-columns: repeat(4, 1fr); }
  .testimonial-card { display: none; }
  .dev-row { display: none; }
}

@media (max-width: 768px) {
  .trust-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 480px) {
  .type-grid { grid-template-columns: 1fr; }
  .step-nav { flex-direction: column-reverse; }
  .nav-back, .nav-next, .nav-submit { width: 100%; justify-content: center; }
}

/* Autofill fix */
.inp-wrap input:-webkit-autofill,
.inp-wrap input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 1000px var(--surface-container-low) inset !important;
  -webkit-text-fill-color: var(--on-surface) !important;
}
</style>
