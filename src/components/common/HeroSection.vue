<template>
  <section class="hero-section">
    <div class="hero-bg">
      <div class="glow-orb glow-orb-primary hero-orb-1" />
      <div class="glow-orb glow-orb-primary hero-orb-2" />
    </div>

    <div class="container-gfd hero-inner">
      <!-- Tag -->
      <div class="hero-tag animate-fade-in-up">
        <span class="material-symbols-outlined" style="font-size:14px;font-variation-settings:'FILL' 1;color:var(--primary);">stars</span>
        The leading platform for full-stack excellence
      </div>

      <!-- Headline -->
      <h1 class="hero-headline animate-fade-in-up delay-100">
        Hire Developers or
        <span class="text-gradient"> Showcase Your Work</span>
      </h1>

      <!-- Subheadline -->
      <p class="hero-sub animate-fade-in-up delay-200">
        The global marketplace for world-class full-stack engineers and high-impact digital products.
        Connect with verified talent or launch your next project.
      </p>

      <!-- Search Bar -->
      <div class="hero-search animate-fade-in-up delay-300">
        <div class="search-wrap">
          <span class="material-symbols-outlined search-icon">search</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search skills, projects, or talent..."
            class="search-input"
            @keyup.enter="handleSearch"
          />
          <button class="search-btn" @click="handleSearch">Search</button>
        </div>
      </div>

      <!-- CTAs -->
      <div class="hero-ctas animate-fade-in-up delay-400">
        <RouterLink to="/hire" class="btn-primary hero-cta-btn">Hire Talent</RouterLink>
        <RouterLink to="/auth/register" class="btn-outline hero-cta-btn">Join as Developer</RouterLink>
      </div>

      <!-- Trust Stats -->
      <div class="hero-stats animate-fade-in-up delay-500">
        <div v-for="stat in STATS" :key="stat.label" class="hero-stat">
          <span class="hero-stat-value">{{ stat.value }}</span>
          <span class="hero-stat-label">{{ stat.label }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { STATS } from '@/constants'

const router = useRouter()
const searchQuery = ref('')

function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push({ path: '/explore', query: { q: searchQuery.value } })
  }
}
</script>

<style scoped>
/* ── Hero Section ── */
.hero-section {
  min-height: 100svh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  background: var(--background);
  /* mobile: tighter top padding since navbar is 72px */
  padding: 5rem 1.25rem 3rem;
}

@media (min-width: 640px) {
  .hero-section { padding: 7rem 1.5rem 4rem; }
}

@media (min-width: 1024px) {
  .hero-section { padding: 8rem 2rem 5rem; }
}

/* Background orbs */
.hero-bg { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }

.hero-orb-1 {
  width: min(500px, 80vw);
  height: min(400px, 60vw);
  top: -80px;
  right: -80px;
  opacity: 0.5;
}

.hero-orb-2 {
  width: min(350px, 60vw);
  height: min(350px, 60vw);
  bottom: -80px;
  left: -80px;
  opacity: 0.25;
}

/* Inner */
.hero-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.25rem;
  position: relative;
  z-index: 1;
  width: 100%;
}

/* Hero tag — uses design tokens for dark mode */
.hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.75rem;
  background: var(--surface-container-low);
  border: 1px solid var(--glass-border-primary);
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--primary);
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (min-width: 480px) {
  .hero-tag { font-size: 0.875rem; padding: 0.35rem 0.875rem; }
}

/* Headline */
.hero-headline {
  font-family: var(--font-headline);
  font-size: clamp(1.9rem, 7vw, 3.5rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.025em;
  color: var(--on-surface);
  max-width: 720px;
  width: 100%;
}

/* Sub */
.hero-sub {
  font-family: var(--font-body);
  font-size: clamp(0.95rem, 2.5vw, 1.125rem);
  line-height: 1.65;
  color: var(--on-surface-variant);
  max-width: 560px;
  width: 100%;
}

/* Search */
.hero-search {
  width: 100%;
  max-width: 540px;
}

.search-wrap {
  display: flex;
  align-items: center;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-xl);
  padding: 0.375rem 0.375rem 0.375rem 0.875rem;
  box-shadow: var(--shadow-sm);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  gap: 0.5rem;
}

.search-wrap:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}

.search-icon {
  color: var(--outline);
  font-size: 18px;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--on-surface);
  outline: none;
}

.search-input::placeholder { color: var(--outline); }

.search-btn {
  flex-shrink: 0;
  padding: 0.5rem 1rem;
  background: var(--primary);
  color: var(--on-primary);
  border: none;
  border-radius: var(--radius-lg);
  font-family: var(--font-headline);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-spring);
  white-space: nowrap;
}

.search-btn:hover { background: var(--primary-container); }
.search-btn:active { transform: scale(0.97); }

/* CTAs */
.hero-ctas {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
}

.hero-cta-btn {
  padding: 0.7rem 1.5rem;
  font-size: 0.875rem;
  /* full width on very small screens */
}

@media (max-width: 400px) {
  .hero-ctas { flex-direction: column; align-items: stretch; }
  .hero-cta-btn { justify-content: center; text-align: center; }
}

/* Stats */
.hero-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 1rem;
  justify-items: stretch;
  width: 100%;
  max-width: 900px;
  margin-top: 1.25rem;
}

.hero-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.35rem 1rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-2xl);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.18);
  min-width: 0;
  text-align: center;
}

.hero-stat-value {
  font-family: var(--font-headline);
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 800;
  color: var(--primary);
  letter-spacing: -0.03em;
}

.hero-stat-label {
  font-size: 0.82rem;
  color: var(--on-surface-variant);
  font-weight: 500;
  text-transform: none;
  letter-spacing: normal;
}
</style>
