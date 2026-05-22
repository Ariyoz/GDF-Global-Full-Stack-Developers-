<template>
  <section class="section-gfd testimonials-section">
    <div class="container-gfd">
      <div class="section-top">
        <h2 class="text-headline-lg">Trusted by Builders Worldwide</h2>
        <p class="text-body-md section-sub">
          Don't take our word for it — hear from the clients and developers who've worked with GFD.
        </p>
      </div>

      <div class="testimonials-grid">
        <div
          v-for="(t, i) in testimonials"
          :key="t.name"
          class="testimonial-card glass-card animate-fade-in-up"
          :class="`delay-${(i % 3) * 100}`"
        >
          <div class="t-stars">
            <span v-for="n in 5" :key="n" class="material-symbols-outlined t-star" style="font-variation-settings:'FILL' 1;">star</span>
          </div>
          <p class="t-quote">"{{ t.quote }}"</p>
          <div class="t-author">
            <div class="t-avatar">{{ t.name[0] }}</div>
            <div>
              <p class="t-name">{{ t.name }}</p>
              <p class="t-role">{{ t.role }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const testimonials = []
</script>

<style scoped>
/* Subtle tinted background — adapts to dark mode via CSS variable */
.testimonials-section { background: var(--surface-container-low); }

.section-top {
  text-align: center;
  margin-bottom: var(--space-lg);
}

.section-sub {
  max-width: 560px;
  margin: 0.75rem auto 0;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
}

@media (min-width: 640px) {
  .testimonials-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) {
  .testimonials-grid { grid-template-columns: repeat(3, 1fr); }
}

.testimonial-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: var(--space-md);
}

.t-stars { display: flex; gap: 2px; }
.t-star  { font-size: 16px; color: #f59e0b; }

.t-quote {
  font-size: 0.9rem;
  color: var(--on-surface-variant);
  line-height: 1.7;
  flex: 1;
  font-style: italic;
}

/* Author divider uses the design token so it adapts to dark mode */
.t-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-top: 0.875rem;
  border-top: 1px solid var(--outline-variant);
}

.t-avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background: var(--primary-fixed);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--primary);
  flex-shrink: 0;
}

.t-name { font-family: var(--font-headline); font-size: 0.875rem; font-weight: 700; color: var(--on-surface); }
.t-role { font-size: 0.75rem; color: var(--on-surface-variant); margin-top: 0.1rem; }
</style>
