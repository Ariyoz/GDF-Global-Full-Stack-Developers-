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

        <!-- Connector lines (desktop only) drawn between steps -->
        <div class="step-connectors" aria-hidden="true">
          <div class="connector" />
          <div class="connector" />
        </div>

        <div v-for="(step, i) in steps" :key="step.title"
          class="how-step animate-fade-in-up"
          :class="`delay-${i * 150}`">

          <!-- Number badge -->
          <div class="step-num-wrap">
            <span class="step-num">{{ String(i + 1).padStart(2, '0') }}</span>
          </div>

          <!-- Icon -->
          <div class="step-ico-wrap" :style="`background:${step.bg}`">
            <span class="material-symbols-outlined step-ico" :style="`color:${step.color}`">
              {{ step.icon }}
            </span>
          </div>

          <!-- Text -->
          <h3 class="step-title">{{ step.title }}</h3>
          <p class="step-desc">{{ step.desc }}</p>

          <!-- Points -->
          <ul class="step-points">
            <li v-for="p in step.points" :key="p">
              <span class="material-symbols-outlined"
                style="font-size:14px;font-variation-settings:'FILL' 1;color:#22c55e;flex-shrink:0">
                check_circle
              </span>
              {{ p }}
            </li>
          </ul>

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

/* Header */
.how-header {
  text-align: center; margin-bottom: 4rem;
  display: flex; flex-direction: column; align-items: center; gap: .75rem;
}
.section-badge {
  display: inline-flex; padding: .3rem .875rem;
  background: var(--primary-fixed); color: var(--primary);
  border-radius: 999px; font-family: var(--font-headline);
  font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em;
}
.how-title {
  font-family: var(--font-headline); font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 900; letter-spacing: -.03em; line-height: 1.1; color: var(--on-surface);
}
.how-sub {
  font-size: 1rem; color: var(--on-surface-variant);
  max-width: 420px; line-height: 1.6; text-align: center;
}

/* Steps container — relative so connectors can be positioned */
.how-steps {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
}
@media (min-width: 768px) {
  .how-steps { grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
}

/* Connector lines — desktop only, drawn between step circles */
.step-connectors {
  display: none;
}
@media (min-width: 768px) {
  .step-connectors {
    display: flex;
    position: absolute;
    top: 38px; /* vertically centred with the icon circle */
    left: calc(33.333% - 24px);
    right: calc(33.333% - 24px);
    justify-content: space-between;
    pointer-events: none;
    z-index: 0;
  }
  .connector {
    flex: 1;
    height: 2px;
    background: linear-gradient(90deg, var(--outline-variant) 0%, var(--outline-variant) 100%);
    background-size: 8px 2px;
    background-image: repeating-linear-gradient(
      90deg,
      var(--outline-variant) 0,
      var(--outline-variant) 4px,
      transparent 4px,
      transparent 10px
    );
    margin: 0 3rem;
  }
}

/* Each step — centered */
.how-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: .75rem;
  position: relative;
  z-index: 1;
}

/* Number */
.step-num-wrap {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--surface-container-lowest);
  border: 2px solid var(--outline-variant);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: .25rem;
}
.step-num {
  font-family: var(--font-headline); font-size: .75rem; font-weight: 800;
  color: var(--primary); letter-spacing: .02em;
}

/* Icon */
.step-ico-wrap {
  width: 60px; height: 60px; border-radius: 18px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.step-ico { font-size: 1.75rem; }

/* Text */
.step-title {
  font-family: var(--font-headline); font-size: 1.1rem; font-weight: 800;
  color: var(--on-surface); letter-spacing: -.02em;
}
.step-desc {
  font-size: .875rem; color: var(--on-surface-variant);
  line-height: 1.6; max-width: 240px;
}

/* Bullet points */
.step-points {
  list-style: none;
  display: flex; flex-direction: column;
  align-items: center; gap: .375rem;
  margin-top: .25rem;
}
.step-points li {
  display: flex; align-items: center; gap: .375rem;
  font-size: .8rem; color: var(--on-surface-variant);
  font-family: var(--font-headline); font-weight: 500;
}
</style>
