<template>
  <div class="hire-confirm-view">
    <div class="container-gfd confirm-inner">
      <!-- Success Card -->
      <div class="glass-card-static confirm-card animate-scale-in">
        <div class="confirm-icon-wrap">
          <span class="material-symbols-outlined confirm-icon" style="font-variation-settings:'FILL' 1">check_circle</span>
        </div>

        <h1 class="confirm-title">Hire Request Sent!</h1>
        <p class="confirm-desc">
          Your request has been sent to <strong>{{ developer.name }}</strong>.
          They typically respond within <strong>2 hours</strong>.
        </p>

        <!-- Developer Card -->
        <div class="dev-summary glass-card">
          <div class="dev-summary-avatar">{{ developer.name[0] }}</div>
          <div class="dev-summary-info">
            <p class="dev-summary-name">{{ developer.name }}</p>
            <p class="dev-summary-role">{{ developer.role }}</p>
            <div class="dev-summary-tags">
              <span v-for="tag in developer.tags" :key="tag" class="chip">{{ tag }}</span>
            </div>
          </div>
          <div class="dev-summary-rating">
            <span class="material-symbols-outlined" style="font-size:16px;color:#f59e0b;font-variation-settings:'FILL' 1">star</span>
            {{ developer.rating }}
          </div>
        </div>

        <!-- Project Details -->
        <div class="confirm-details">
          <div v-for="detail in projectDetails" :key="detail.label" class="confirm-detail">
            <span class="material-symbols-outlined detail-icon">{{ detail.icon }}</span>
            <div>
              <p class="detail-label">{{ detail.label }}</p>
              <p class="detail-value">{{ detail.value }}</p>
            </div>
          </div>
        </div>

        <!-- Next Steps -->
        <div class="next-steps">
          <h3 class="next-steps-title">What happens next?</h3>
          <div class="steps-list">
            <div v-for="(step, i) in nextSteps" :key="step.title" class="step-item">
              <div class="step-num">{{ i + 1 }}</div>
              <div>
                <p class="step-title">{{ step.title }}</p>
                <p class="step-desc">{{ step.desc }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="confirm-actions">
          <RouterLink to="/messaging" class="btn-primary">
            <span class="material-symbols-outlined" style="font-size:18px">chat</span>
            Message {{ developer.name.split(' ')[0] }}
          </RouterLink>
          <RouterLink to="/dashboard/requests" class="btn-outline">View My Requests</RouterLink>
          <RouterLink to="/explore" class="btn-ghost">Browse More Talent</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const developer = {
  name:   'Alex Rivera',
  role:   'Senior Full-Stack Engineer',
  tags:   ['React', 'Node.js', 'PostgreSQL'],
  rating: '4.9',
}

const projectDetails = [
  { icon: 'work',      label: 'Project Type',  value: 'Full Stack Web App' },
  { icon: 'payments',  label: 'Budget',         value: '$4,500 – $6,000' },
  { icon: 'schedule',  label: 'Timeline',       value: '4–6 Weeks' },
]

const nextSteps = [
  { title: 'Developer Reviews',  desc: 'Alex will review your project brief and requirements.' },
  { title: 'Initial Call',       desc: 'Schedule a discovery call to align on scope and timeline.' },
  { title: 'Proposal & Escrow',  desc: 'Receive a detailed proposal and fund the secure escrow.' },
  { title: 'Development Begins', desc: 'Work starts with daily updates and milestone tracking.' },
]
</script>

<style scoped>
.hire-confirm-view {
  background: var(--background);
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 2rem 0;
}

.confirm-inner {
  display: flex;
  justify-content: center;
  padding-top: 1rem;
  padding-bottom: 3rem;
}

.confirm-card {
  width: 100%;
  max-width: 600px;
  padding: 2.5rem;
  border-radius: var(--radius-2xl);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
}

.confirm-icon-wrap {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-full);
  background: rgba(22,163,74,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.confirm-icon { font-size: 2.5rem; color: #16a34a; }

.confirm-title {
  font-family: var(--font-headline);
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
  color: var(--on-surface);
  letter-spacing: -0.02em;
}

.confirm-desc {
  font-size: 1rem;
  color: var(--on-surface-variant);
  line-height: 1.65;
  max-width: 440px;
}

/* Dev Summary */
.dev-summary {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  text-align: left;
}

.dev-summary-avatar {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-lg);
  background: var(--primary-fixed);
  color: var(--primary);
  font-family: var(--font-headline);
  font-size: 1.1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dev-summary-info { flex: 1; }
.dev-summary-name { font-family: var(--font-headline); font-size: 0.9375rem; font-weight: 700; color: var(--on-surface); }
.dev-summary-role { font-size: 0.8rem; color: var(--primary); font-family: var(--font-headline); font-weight: 500; margin-top: 1px; }
.dev-summary-tags { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-top: 0.4rem; }

.dev-summary-rating {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--on-surface);
  flex-shrink: 0;
}

/* Details */
.confirm-details {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding: 1.25rem;
  background: var(--surface-container-low);
  border-radius: var(--radius-xl);
  text-align: left;
}

@media (max-width: 480px) { .confirm-details { grid-template-columns: 1fr; } }

.confirm-detail { display: flex; align-items: flex-start; gap: 0.625rem; }
.detail-icon { font-size: 20px; color: var(--primary); flex-shrink: 0; margin-top: 1px; }
.detail-label { font-size: 0.7rem; color: var(--on-surface-variant); font-family: var(--font-headline); text-transform: uppercase; letter-spacing: 0.04em; }
.detail-value { font-family: var(--font-headline); font-size: 0.875rem; font-weight: 700; color: var(--on-surface); margin-top: 0.1rem; }

/* Next Steps */
.next-steps { width: 100%; text-align: left; }

.next-steps-title {
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--on-surface);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}

.steps-list { display: flex; flex-direction: column; gap: 0.875rem; }

.step-item { display: flex; align-items: flex-start; gap: 0.875rem; }

.step-num {
  width: 26px;
  height: 26px;
  border-radius: var(--radius-full);
  background: rgba(168,85,247,0.1);
  border: 1px solid rgba(168,85,247,0.2);
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

.step-title { font-family: var(--font-headline); font-size: 0.875rem; font-weight: 700; color: var(--on-surface); }
.step-desc  { font-size: 0.8rem; color: var(--on-surface-variant); margin-top: 0.15rem; line-height: 1.5; }

/* Actions */
.confirm-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
}

@media (max-width: 480px) {
  .confirm-actions { flex-direction: column; }
  .confirm-actions .btn-primary,
  .confirm-actions .btn-outline,
  .confirm-actions .btn-ghost { justify-content: center; }
}
</style>
