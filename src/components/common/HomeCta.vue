<template>
  <section class="section-gfd home-cta-section">
    <div class="container-gfd">
      <div class="cta-card animate-fade-in-up">
        <div class="cta-glow cta-glow-right" />
        <div class="cta-glow cta-glow-left" />

        <!-- Left: text -->
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

        <!-- Right: video -->
        <div class="cta-video-wrap">
          <video
            class="cta-video"
            autoplay
            muted
            loop
            playsinline
            preload="metadata"
          >
            <source src="@/assets/images/IMG_1469.MP4" type="video/mp4" />
          </video>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
.home-cta-section { background: var(--background); }

.cta-card {
  background: linear-gradient(135deg, #1a0840 0%, #2d1060 50%, #1a1a2e 100%);
  border-radius: 1.5rem;
  padding: 2.5rem 1.5rem;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(168,85,247,0.15);
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
}

@media (min-width: 768px) {
  .cta-card {
    flex-direction: row;
    align-items: center;
    padding: 3.5rem 3rem;
    gap: 3rem;
    border-radius: 2rem;
  }
}

@media (min-width: 1024px) {
  .cta-card { padding: 4rem 4rem; }
}

.cta-glow {
  position: absolute;
  width: 200px;
  height: 200px;
  background: var(--primary);
  filter: blur(100px);
  opacity: 0.3;
  pointer-events: none;
}
.cta-glow-right { top: -100px; right: -100px; }
.cta-glow-left  { bottom: -100px; left: -100px; }

/* Left column */
.cta-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  flex: 1;
  text-align: center;
}

@media (min-width: 768px) {
  .cta-content {
    text-align: left;
    align-items: flex-start;
  }
}

.cta-title {
  font-family: var(--font-headline);
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.025em;
  line-height: 1.15;
}

.cta-highlight { color: var(--primary-fixed); }

.cta-desc {
  font-size: clamp(0.875rem, 1.5vw, 1rem);
  color: rgba(255,255,255,0.65);
  max-width: 440px;
  line-height: 1.6;
}

.cta-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

@media (min-width: 768px) {
  .cta-actions { justify-content: flex-start; }
}

@media (max-width: 400px) {
  .cta-actions { flex-direction: column; align-items: stretch; }
}

/* Right column — video */
.cta-video-wrap {
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  width: 100%;
  max-width: 340px;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(168,85,247,0.2);
}

@media (min-width: 768px) {
  .cta-video-wrap {
    width: 42%;
    max-width: 420px;
  }
}

.cta-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 1rem;
}

/* Buttons */
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
