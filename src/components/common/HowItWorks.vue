<template>
  <section class="section-gfd how-section">
    <div class="container-gfd">

      <!-- Header -->
      <div class="how-header">
        <div class="section-badge">How it works</div>
        <h2 class="how-title">From idea to<br><span class="text-gradient">deployed product</span></h2>
        <p class="how-sub">Three simple steps to build your next big thing with world-class talent.</p>
      </div>

      <!-- Steps -->
      <div class="how-steps">
        <div v-for="(step, i) in steps" :key="step.title" class="how-step animate-fade-in-up" :class="`delay-${i*150}`">
          <!-- Number + connector -->
          <div class="step-track">
            <div class="step-num">{{ String(i+1).padStart(2,'0') }}</div>
            <div v-if="i < steps.length-1" class="step-line" />
          </div>
          <!-- Content -->
          <div class="step-body">
            <div class="step-ico-wrap" :style="`background:${step.bg}`">
              <span class="material-symbols-outlined step-ico" :style="`color:${step.color}`">{{ step.icon }}</span>
            </div>
            <h3 class="step-title">{{ step.title }}</h3>
            <p class="step-desc">{{ step.desc }}</p>
            <ul class="step-points">
              <li v-for="p in step.points" :key="p">
                <span class="material-symbols-outlined" style="font-size:14px;font-variation-settings:'FILL' 1;color:#22c55e">check_circle</span>
                {{ p }}
              </li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
const steps = [
  {
    icon: 'person_search',
    title: 'Post your project',
    desc: 'Describe what you need — tech stack, timeline, budget. Our smart matching finds the right talent instantly.',
    bg: 'rgba(99,14,212,.1)', color: 'var(--primary)',
    points: ['Free to post', 'Smart skill matching', 'Real-time responses'],
  },
  {
    icon: 'verified_user',
    title: 'Hire verified talent',
    desc: 'Review GitHub-verified profiles, chat directly, and hire with full confidence. No middlemen.',
    bg: 'rgba(59,130,246,.1)', color: '#3b82f6',
    points: ['GitHub verification', 'Portfolio reviews', 'Direct messaging'],
  },
  {
    icon: 'rocket_launch',
    title: 'Build & get paid',
    desc: 'Collaborate with built-in tools, track progress, and receive secure payments directly to your wallet.',
    bg: 'rgba(22,163,74,.1)', color: '#16a34a',
    points: ['Built-in wallet', 'Bank withdrawal', 'Milestone payments'],
  },
]
</script>

<style scoped>
.how-section { background: var(--surface-container-low); }

.how-header { text-align: center; margin-bottom: 3.5rem; display: flex; flex-direction: column; align-items: center; gap: .75rem; }

.section-badge {
  display: inline-flex; padding: .3rem .875rem;
  background: var(--primary-fixed); color: var(--primary);
  border-radius: 999px; font-family: var(--font-headline);
  font-size: .75rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em;
}
.how-title {
  font-family: var(--font-headline); font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 900; letter-spacing: -.03em; line-height: 1.1; color: var(--on-surface);
}
.how-sub { font-size: 1rem; color: var(--on-surface-variant); max-width: 460px; line-height: 1.6; }

/* Steps */
.how-steps {
  display: grid; grid-template-columns: 1fr; gap: 2.5rem;
}
@media (min-width: 768px) {
  .how-steps { grid-template-columns: repeat(3, 1fr); gap: 2rem; }
}

.how-step { display: flex; flex-direction: column; gap: 1rem; }

/* Track: number + line (horizontal on desktop) */
.step-track {
  display: flex; align-items: center; gap: 0;
}
@media (min-width: 768px) {
  .step-track { flex-direction: row; }
}
.step-num {
  font-family: var(--font-headline); font-size: 2.5rem; font-weight: 900;
  color: var(--outline-variant); line-height: 1; flex-shrink: 0;
  letter-spacing: -.05em;
}
.step-line {
  display: none;
}
@media (min-width: 768px) {
  .step-line {
    display: block; flex: 1; height: 2px; margin: 0 1rem;
    background: linear-gradient(90deg, var(--outline-variant) 0%, transparent 100%);
  }
}

.step-body { display: flex; flex-direction: column; gap: .625rem; }

.step-ico-wrap {
  width: 52px; height: 52px; border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
}
.step-ico { font-size: 1.6rem; }

.step-title {
  font-family: var(--font-headline); font-size: 1.15rem; font-weight: 800;
  color: var(--on-surface); letter-spacing: -.02em;
}
.step-desc { font-size: .875rem; color: var(--on-surface-variant); line-height: 1.6; }

.step-points {
  list-style: none; display: flex; flex-direction: column; gap: .35rem; margin-top: .25rem;
}
.step-points li {
  display: flex; align-items: center; gap: .375rem;
  font-size: .8rem; color: var(--on-surface-variant); font-family: var(--font-headline); font-weight: 500;
}
</style>
