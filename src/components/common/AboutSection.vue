<template>
  <section class="section-gfd about-section">
    <div class="container-gfd">
      <SectionHeader
        tag="About GFD"
        title="Built by Developers, for the World"
        subtitle="We're a global software company and developer ecosystem on a mission to build powerful digital products and grow the next generation of world-class engineers."
      />

      <div class="about-grid">
        <!-- Mission -->
        <div class="about-card glass-card animate-fade-in-up">
          <div class="card-icon-wrap card-icon-primary">
            <span class="material-symbols-outlined card-icon">my_location</span>
          </div>
          <h3 class="card-title">Our Mission</h3>
          <p class="card-body">
            To deliver premium software solutions that transform businesses while building
            a thriving global community of elite developers.
          </p>
        </div>

        <!-- Vision -->
        <div class="about-card glass-card animate-fade-in-up delay-100">
          <div class="card-icon-wrap card-icon-blue">
            <span class="material-symbols-outlined card-icon">telescope</span>
          </div>
          <h3 class="card-title">Our Vision</h3>
          <p class="card-body">
            To become the world's most trusted full-stack development company and the
            go-to ecosystem for developers seeking growth, collaboration, and opportunity.
          </p>
        </div>

        <!-- Why GFD -->
        <div class="about-card glass-card animate-fade-in-up delay-200">
          <div class="card-icon-wrap card-icon-green">
            <span class="material-symbols-outlined card-icon">verified</span>
          </div>
          <h3 class="card-title">Why GFD?</h3>
          <ul class="why-list">
            <li v-for="item in whyItems" :key="item" class="why-item">
              <span class="material-symbols-outlined why-check" style="font-variation-settings:'FILL' 1">check_circle</span>
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>

        <!-- Values — full width -->
        <div class="about-card about-card-wide glass-card animate-fade-in-up delay-300">
          <div class="card-icon-wrap card-icon-amber">
            <span class="material-symbols-outlined card-icon">diamond</span>
          </div>
          <h3 class="card-title">Our Values</h3>
          <div class="values-grid">
            <div v-for="val in values" :key="val.title" class="value-item">
              <div class="value-icon-wrap">
                <span class="material-symbols-outlined value-icon">{{ val.icon }}</span>
              </div>
              <div>
                <p class="value-title">{{ val.title }}</p>
                <p class="value-desc">{{ val.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import SectionHeader from '@/components/ui/SectionHeader.vue'

const whyItems = [
  'Senior-level developers on every project',
  'Transparent communication & delivery',
  'Modern tech stack & best practices',
  'Dedicated project management',
  'Post-launch support & maintenance',
]

const values = [
  { icon: 'bolt',       title: 'Excellence',    desc: 'We ship premium quality, always.' },
  { icon: 'handshake',  title: 'Collaboration', desc: 'Better together, always.' },
  { icon: 'lock',       title: 'Integrity',     desc: 'Honest, transparent, reliable.' },
  { icon: 'rocket_launch', title: 'Innovation', desc: 'We push boundaries constantly.' },
]
</script>

<style scoped>
.about-section { background: var(--background); }

.about-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .about-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) {
  .about-grid { grid-template-columns: repeat(3, 1fr); }
}

.about-card {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  padding: 1.5rem;
}

.about-card-wide { grid-column: 1 / -1; }

/* Icon wraps */
.card-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Icon wrap backgrounds — use semi-transparent brand colors that work in both modes */
.card-icon-primary { background: rgba(99,14,212,0.12); }
.card-icon-blue    { background: rgba(59,130,246,0.12); }
.card-icon-green   { background: rgba(22,163,74,0.12); }
.card-icon-amber   { background: rgba(245,158,11,0.12); }

.card-icon { font-size: 24px; }
.card-icon-primary .card-icon { color: var(--primary); }
.card-icon-blue    .card-icon { color: #3b82f6; }
.card-icon-green   .card-icon { color: #16a34a; }
.card-icon-amber   .card-icon { color: #f59e0b; }

.card-title {
  font-family: var(--font-headline);
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--on-surface);
}

.card-body {
  font-size: 0.875rem;
  color: var(--on-surface-variant);
  line-height: 1.65;
  flex: 1;
}

/* Why list */
.why-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.why-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--on-surface-variant);
  line-height: 1.5;
}

.why-check { font-size: 16px; color: #16a34a; flex-shrink: 0; margin-top: 1px; }

/* Values grid */
.values-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
  margin-top: 0.25rem;
}

@media (min-width: 640px) {
  .values-grid { grid-template-columns: repeat(4, 1fr); }
}

.value-item { display: flex; align-items: flex-start; gap: 0.75rem; }

.value-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background: rgba(99,14,212,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.value-icon { font-size: 18px; color: var(--primary); }

.value-title {
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--on-surface);
  margin-bottom: 0.15rem;
}

.value-desc { font-size: 0.8rem; color: var(--on-surface-variant); line-height: 1.4; }
</style>
