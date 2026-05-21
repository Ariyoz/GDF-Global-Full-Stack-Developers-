<template>
  <div class="about-view">
    <!-- Hero -->
    <section class="page-hero">
      <div class="container-gfd hero-inner">
        <div class="hero-tag animate-fade-in-up">About GFD</div>
        <h1 class="hero-headline animate-fade-in-up delay-100">
          We Are <span class="text-gradient">Global Full-Stack Developers</span>
        </h1>
        <p class="hero-sub animate-fade-in-up delay-200">
          A premium software company and developer ecosystem building the future of digital products,
          one line of code at a time.
        </p>
      </div>
    </section>

    <AboutSection />
    <TeamSection />
  </div>
</template>

<script setup>
import AboutSection from '@/components/common/AboutSection.vue'
import TeamSection  from '@/components/common/TeamSection.vue'
</script>

<style scoped>
.about-view { background: var(--background); }

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
  align-items: center;
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
  max-width: 700px;
}

.hero-sub {
  font-size: clamp(0.95rem, 2vw, 1.125rem);
  color: var(--on-surface-variant);
  line-height: 1.65;
  max-width: 560px;
}
</style>
