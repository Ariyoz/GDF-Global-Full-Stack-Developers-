<template>
  <section class="section-gfd how-section">
    <div class="container-gfd">
      <div class="how-header">
        <h2 class="text-headline-lg">Streamlined Collaboration</h2>
        <p class="text-body-lg how-sub">
          From concept to deployment, we make hiring and building easier for everyone.
        </p>
      </div>

      <div class="how-grid">
        <div
          v-for="(step, i) in steps"
          :key="step.title"
          class="how-step animate-fade-in-up"
          :class="`delay-${i * 150}`"
        >
          <div class="step-icon-wrap">
            <span class="material-symbols-outlined step-icon">{{ step.icon }}</span>
          </div>
          <h3 class="step-title">{{ i + 1 }}. {{ step.title }}</h3>
          <p class="step-desc">{{ step.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const steps = [
  {
    icon: 'search_check',
    title: 'Find Talent',
    desc: 'Browse verified portfolios and GitHub-integrated profiles of world-class developers.',
  },
  {
    icon: 'payments',
    title: 'Secure Escrow',
    desc: 'Start projects with confidence using our smart-contract based payment protection system.',
  },
  {
    icon: 'rocket_launch',
    title: 'Ship Fast',
    desc: 'Collaborate via integrated tools and receive high-quality production code ready for scale.',
  },
]
</script>

<style scoped>
/* Subtle tinted background — adapts to dark mode via CSS variable */
.how-section { background: var(--surface-container-low); }

.how-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.how-sub {
  font-size: clamp(0.95rem, 2vw, 1.125rem);
  max-width: 520px;
  margin: 0.75rem auto 0;
  color: var(--on-surface-variant);
}

/* 1 col on mobile, 3 on desktop */
.how-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 640px) {
  .how-grid { grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
}

.how-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0 0.5rem;
}

/* On mobile, left-align for readability */
@media (max-width: 639px) {
  .how-step {
    flex-direction: row;
    align-items: flex-start;
    text-align: left;
    gap: 1rem;
    padding: 0;
  }
}

.step-icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-full);
  background: rgba(99, 14, 212, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-bottom: 1rem;
}

@media (max-width: 639px) {
  .step-icon-wrap { margin-bottom: 0; }
}

.step-icon { font-size: 1.75rem; color: var(--primary); }

.step-content { display: flex; flex-direction: column; }

.step-title {
  font-family: var(--font-headline);
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--on-surface);
  margin-bottom: 0.5rem;
}

.step-desc {
  font-size: 0.9rem;
  color: var(--on-surface-variant);
  line-height: 1.6;
}
</style>
