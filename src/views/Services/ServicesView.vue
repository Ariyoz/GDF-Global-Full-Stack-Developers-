<template>
  <div class="services-view">
    <!-- Hero -->
    <section class="page-hero">
      <div class="container-gfd hero-inner">
        <div class="hero-tag animate-fade-in-up">What We Build</div>
        <h1 class="hero-headline animate-fade-in-up delay-100">
          Services Built for <span class="text-gradient">Scale</span>
        </h1>
        <p class="hero-sub animate-fade-in-up delay-200">
          From MVPs to enterprise platforms — end-to-end software solutions that drive real business results.
        </p>
        <RouterLink to="/hire" class="btn-primary animate-fade-in-up delay-300" style="margin-top:0.5rem">
          Start Your Project →
        </RouterLink>
      </div>
    </section>

    <ServicesSection />

    <!-- Process -->
    <section class="section-gfd process-section">
      <div class="container-gfd">
        <SectionHeader
          tag="Our Process"
          title="How We Work"
          subtitle="A streamlined, transparent process from discovery to delivery."
        />
        <div class="process-steps">
          <div
            v-for="(step, i) in steps"
            :key="step.title"
            class="process-step animate-fade-in-up"
            :class="`delay-${i * 100}`"
          >
            <div class="step-num">{{ String(i + 1).padStart(2, '0') }}</div>
            <div class="step-body">
              <h4 class="step-title">{{ step.title }}</h4>
              <p class="step-desc">{{ step.desc }}</p>
            </div>
            <div v-if="i < steps.length - 1" class="step-line" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import ServicesSection from '@/components/common/ServicesSection.vue'
import SectionHeader   from '@/components/ui/SectionHeader.vue'

const steps = [
  { title: 'Discovery',   desc: 'We learn your goals, audience, and technical requirements.' },
  { title: 'Design',      desc: 'Wireframes, prototypes, and design systems crafted to perfection.' },
  { title: 'Development', desc: 'Agile sprints with daily updates and transparent communication.' },
  { title: 'Testing',     desc: 'Rigorous QA, performance testing, and security audits.' },
  { title: 'Launch',      desc: 'Smooth deployment with monitoring and post-launch support.' },
]
</script>

<style scoped>
.services-view { background: var(--background); }

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
  max-width: 540px;
}

/* Process section — uses design token for dark mode */
.process-section { background: var(--surface-container-low); }

.process-steps {
  display: flex;
  flex-direction: column;
  max-width: 640px;
  margin: 0 auto;
}

.process-step {
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  position: relative;
  padding-bottom: 2rem;
}

.step-num {
  font-family: var(--font-headline);
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--primary);
  background: rgba(99,14,212,0.08);
  border: 1px solid rgba(99,14,212,0.15);
  border-radius: var(--radius-md);
  padding: 0.35rem 0.6rem;
  flex-shrink: 0;
  margin-top: 2px;
  letter-spacing: 0.02em;
}

.step-body { flex: 1; }

.step-title {
  font-family: var(--font-headline);
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--on-surface);
  margin-bottom: 0.3rem;
}

.step-desc {
  font-size: 0.875rem;
  color: var(--on-surface-variant);
  line-height: 1.6;
}

/* Step connector line — uses design token */
.step-line {
  position: absolute;
  left: 1.6rem;
  top: 2.25rem;
  bottom: 0;
  width: 1px;
  background: var(--outline-variant);
}
</style>
