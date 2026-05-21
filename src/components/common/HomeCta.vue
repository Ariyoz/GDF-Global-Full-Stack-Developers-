<template>
  <section class="section-gfd home-cta-section">
    <div class="container-gfd">
      <div class="cta-card animate-fade-in-up">
        <div class="cta-glow cta-glow-right" />
        <div class="cta-glow cta-glow-left" />
        <div class="cta-content">
          <h2 class="cta-title">
            Ready to build something
            <span class="cta-highlight"> extraordinary?</span>
          </h2>
          <p class="cta-desc">
            Join 10,000+ developers and companies building the future of the web.
          </p>
          <div class="cta-actions">
            <RouterLink to="/auth/register" class="cta-btn-primary">
              Get Started Today
            </RouterLink>
            <RouterLink to="/contact" class="cta-btn-ghost">
              Contact Sales
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-cta-section { background: var(--background); }

.cta-card {
  /* Always dark — use a deep purple-dark gradient that works in both modes */
  background: linear-gradient(135deg, #1a0840 0%, #2d1060 50%, #1a1a2e 100%);
  border-radius: 1.5rem;
  padding: 2.5rem 1.5rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(168,85,247,0.15);
}

@media (min-width: 640px) {
  .cta-card { padding: 3.5rem 2.5rem; border-radius: 2rem; }
}

@media (min-width: 1024px) {
  .cta-card { padding: 5rem 3rem; }
}

.cta-glow {
  position: absolute;
  width: 200px;
  height: 200px;
  background: var(--primary);
  filter: blur(100px);
  opacity: 0.35;
  pointer-events: none;
}

.cta-glow-right { top: -100px; right: -100px; }
.cta-glow-left  { bottom: -100px; left: -100px; }

.cta-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}

.cta-title {
  font-family: var(--font-headline);
  font-size: clamp(1.5rem, 5vw, 2.75rem);
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.025em;
  line-height: 1.15;
  max-width: 640px;
}

.cta-highlight { color: var(--primary-fixed); }

.cta-desc {
  font-size: clamp(0.9rem, 2vw, 1.1rem);
  color: rgba(255,255,255,0.65);
  max-width: 480px;
  line-height: 1.6;
}

.cta-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
}

/* On very small screens, stack buttons */
@media (max-width: 400px) {
  .cta-actions { flex-direction: column; align-items: stretch; }
}

.cta-btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.75rem;
  background: var(--primary);
  color: var(--on-primary);
  border: none;
  border-radius: var(--radius-lg);
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 6px 24px rgba(99,14,212,0.4);
  white-space: nowrap;
}

.cta-btn-primary:hover {
  background: var(--primary-container);
  transform: translateY(-1px);
  box-shadow: 0 10px 32px rgba(99,14,212,0.5);
}

.cta-btn-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.75rem;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: var(--radius-lg);
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 500;
  color: #fff;
  text-decoration: none;
  transition: var(--transition-base);
  white-space: nowrap;
}

.cta-btn-ghost:hover {
  background: rgba(255,255,255,0.1);
  border-color: rgba(255,255,255,0.35);
}
</style>
