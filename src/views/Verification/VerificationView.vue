<template>
  <div class="verify-view">
    <div class="container-gfd verify-inner">
      <!-- Header -->
      <div class="verify-header">
        <div class="verify-badge">
          <span class="material-symbols-outlined" style="font-size:16px;font-variation-settings:'FILL' 1">verified</span>
          GFD Verified
        </div>
        <h1 class="text-headline-lg">Get Verified on GFD</h1>
        <p class="text-body-lg verify-sub">
          Verified developers get 3× more profile views, priority placement in search results,
          and a trust badge that clients love.
        </p>
      </div>

      <!-- Benefits -->
      <div class="verify-benefits">
        <div v-for="benefit in benefits" :key="benefit.title" class="benefit-card glass-card">
          <div class="benefit-icon-wrap" :style="{ background: benefit.bg }">
            <span class="material-symbols-outlined benefit-icon" :style="{ color: benefit.color }">{{ benefit.icon }}</span>
          </div>
          <h3 class="benefit-title">{{ benefit.title }}</h3>
          <p class="benefit-desc">{{ benefit.desc }}</p>
        </div>
      </div>

      <!-- Verification Steps -->
      <div class="verify-steps-section">
        <h2 class="section-title">Verification Process</h2>
        <div class="verify-steps">
          <div
            v-for="(step, i) in verifySteps"
            :key="step.title"
            class="verify-step glass-card-static"
            :class="{ completed: step.completed, active: step.active }"
          >
            <div class="vstep-left">
              <div class="vstep-num" :class="{ completed: step.completed, active: step.active }">
                <span v-if="step.completed" class="material-symbols-outlined" style="font-size:16px;font-variation-settings:'FILL' 1">check</span>
                <span v-else>{{ i + 1 }}</span>
              </div>
              <div class="vstep-info">
                <h4 class="vstep-title">{{ step.title }}</h4>
                <p class="vstep-desc">{{ step.desc }}</p>
              </div>
            </div>
            <div class="vstep-right">
              <span v-if="step.completed" class="vstep-status completed">Completed</span>
              <span v-else-if="step.active" class="vstep-status active">In Progress</span>
              <span v-else class="vstep-status pending">Pending</span>
              <button v-if="step.action && !step.completed" class="btn-primary vstep-btn"
                @click="handleStepAction(step)">
                {{ step.action }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Trust Indicators -->
      <div class="trust-section glass-card-static">
        <div class="trust-header">
          <span class="material-symbols-outlined" style="font-size:24px;color:var(--primary)">security</span>
          <h3 class="trust-title">Your data is safe with us</h3>
        </div>
        <div class="trust-items">
          <div v-for="item in trustItems" :key="item" class="trust-item">
            <span class="material-symbols-outlined" style="font-size:16px;color:#16a34a;font-variation-settings:'FILL' 1">check_circle</span>
            <span>{{ item }}</span>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="verify-cta">
        <GfdButton variant="primary" size="lg" @click="startVerification">
          <span class="material-symbols-outlined" style="font-size:18px">verified</span>
          Start Verification
        </GfdButton>
        <p class="verify-cta-note">Free for all GFD members · Takes ~5 minutes</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import GfdButton from '@/components/ui/GfdButton.vue'

const benefits = [
  { icon: 'trending_up',  title: '3× More Views',       desc: 'Verified profiles appear higher in search and get significantly more client views.',  color: 'var(--primary)',  bg: 'rgba(168,85,247,0.1)' },
  { icon: 'payments',     title: 'Higher Rates',         desc: 'Verified developers command 40% higher rates on average compared to unverified.',     color: '#16a34a',          bg: 'rgba(22,163,74,0.1)' },
  { icon: 'shield',       title: 'Trust Badge',          desc: 'A verified badge on your profile signals credibility to clients and collaborators.',   color: '#3b82f6',          bg: 'rgba(59,130,246,0.1)' },
  { icon: 'priority_high',title: 'Priority Support',     desc: 'Verified members get priority access to GFD support and exclusive opportunities.',    color: '#f59e0b',          bg: 'rgba(245,158,11,0.1)' },
]

const verifySteps = ref([
  { title: 'Email Verification',    desc: 'Confirm your email address to get started.',                    action: 'Verify Email',    completed: true,  active: false },
  { title: 'Identity Verification', desc: 'Upload a government-issued ID for identity confirmation.',      action: 'Upload ID',       completed: false, active: true  },
  { title: 'Skills Assessment',     desc: 'Complete a short technical assessment for your primary skill.', action: 'Take Assessment', completed: false, active: false },
  { title: 'GitHub Integration',    desc: 'Connect your GitHub to showcase your real contributions.',      action: 'Connect GitHub',  completed: false, active: false },
])

const trustItems = [
  'Your documents are encrypted and never shared with third parties',
  'Identity data is deleted after verification is complete',
  'We comply with GDPR and global data protection regulations',
  'Verification is reviewed by our trained trust & safety team',
]

function startVerification() {
  const nextStep = verifySteps.value.find(s => !s.completed)
  if (nextStep) handleStepAction(nextStep)
}

function handleStepAction(step) {
  step.active = true
  if (step.action === 'Upload ID') {
    router.push('/kyc')
  } else if (step.action === 'Connect GitHub') {
    const backendUrl = (import.meta.env.VITE_API_BASE_URL || 'https://gfd-backend.onrender.com/api/v1').replace('/api/v1', '')
    const clientId = 'Ov23liIFAyUPGivCRcp1'
    const redirectUri = encodeURIComponent(`${backendUrl}/api/v1/auth/github/callback`)
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=read:user,user:email`
  } else if (step.action === 'Take Assessment') {
    router.push('/dashboard')
  }
}
</script>

<style scoped>
.verify-view { background: var(--background); min-height: 100vh; padding: 2rem 0; }

.verify-inner { padding-top: 1rem; padding-bottom: 3rem; display: flex; flex-direction: column; gap: 2.5rem; }

/* Header */
.verify-header { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem; }

.verify-badge {
  display: inline-flex; align-items: center; gap: 0.4rem;
  padding: 0.35rem 0.875rem;
  background: rgba(168,85,247,0.08);
  border: 1px solid rgba(168,85,247,0.2);
  border-radius: var(--radius-full);
  font-family: var(--font-headline); font-size: 0.875rem; font-weight: 600; color: var(--primary);
}

.verify-sub { max-width: 560px; }

/* Benefits */
.verify-benefits {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media (min-width: 768px) { .verify-benefits { grid-template-columns: repeat(4, 1fr); } }

.benefit-card { display: flex; flex-direction: column; gap: 0.75rem; padding: 1.5rem; }

.benefit-icon-wrap {
  width: 48px; height: 48px; border-radius: var(--radius-lg);
  display: flex; align-items: center; justify-content: center;
}

.benefit-icon { font-size: 24px; }
.benefit-title { font-family: var(--font-headline); font-size: 0.9375rem; font-weight: 700; color: var(--on-surface); }
.benefit-desc  { font-size: 0.8rem; color: var(--on-surface-variant); line-height: 1.55; }

/* Steps */
.section-title {
  font-family: var(--font-headline); font-size: 1.25rem; font-weight: 700; color: var(--on-surface);
  margin-bottom: 1rem;
}

.verify-steps { display: flex; flex-direction: column; gap: 0.75rem; }

.verify-step {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-radius: var(--radius-xl);
  flex-wrap: wrap;
  transition: all 0.2s ease;
}

.verify-step.active { border-color: rgba(168,85,247,0.3) !important; background: rgba(168,85,247,0.03) !important; }
.verify-step.completed { opacity: 0.7; }

.vstep-left { display: flex; align-items: flex-start; gap: 1rem; flex: 1; }

.vstep-num {
  width: 32px; height: 32px; border-radius: var(--radius-full);
  border: 2px solid var(--outline-variant);
  background: var(--surface-container-lowest);
  color: var(--on-surface-variant);
  font-family: var(--font-headline); font-size: 0.8rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  transition: all 0.2s ease;
}

.vstep-num.active    { border-color: var(--primary); background: var(--primary); color: var(--on-primary); }
.vstep-num.completed { border-color: #16a34a; background: rgba(22,163,74,0.1); color: #16a34a; }

.vstep-title { font-family: var(--font-headline); font-size: 0.9375rem; font-weight: 700; color: var(--on-surface); }
.vstep-desc  { font-size: 0.8rem; color: var(--on-surface-variant); margin-top: 0.2rem; }

.vstep-right { display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0; }

.vstep-status {
  font-family: var(--font-headline); font-size: 0.75rem; font-weight: 600;
  padding: 0.2rem 0.625rem; border-radius: var(--radius-full);
}

.vstep-status.completed { background: rgba(22,163,74,0.1); color: #16a34a; }
.vstep-status.active    { background: rgba(168,85,247,0.1); color: var(--primary); }
.vstep-status.pending   { background: var(--surface-container); color: var(--on-surface-variant); }

.vstep-btn { font-size: 0.8rem; padding: 0.4rem 0.875rem; }

/* Trust */
.trust-section { padding: 1.5rem; border-radius: var(--radius-xl); }

.trust-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }

.trust-title { font-family: var(--font-headline); font-size: 1rem; font-weight: 700; color: var(--on-surface); }

.trust-items { display: grid; grid-template-columns: 1fr; gap: 0.625rem; }
@media (min-width: 640px) { .trust-items { grid-template-columns: repeat(2, 1fr); } }

.trust-item {
  display: flex; align-items: flex-start; gap: 0.5rem;
  font-size: 0.875rem; color: var(--on-surface-variant); line-height: 1.5;
}

/* CTA */
.verify-cta { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; }
.verify-cta-note { font-size: 0.8rem; color: var(--on-surface-variant); }
</style>
