<template>
  <section class="section-gfd home-cta">
    <div class="container-gfd">
      <div class="cta-wrap glass-green animate-fade-in-up">
        <div class="cta-glow" />
        <div class="cta-body">
          <div class="badge-gfd cta-tag">Get Started Today</div>
          <h2 class="display-section cta-title">
            Ready to Build Something
            <span class="text-gradient"> Extraordinary?</span>
          </h2>
          <p class="body-lg cta-desc">
            Whether you're a client with a vision or a developer seeking your next challenge —
            GFD is where great things get built.
          </p>
          <div class="cta-actions">
            <RouterLink to="/hire" class="btn-gfd-primary">
              Hire Our Team →
            </RouterLink>
            <RouterLink to="/community" class="btn-gfd-outline">
              Join as Developer
            </RouterLink>
            <RouterLink to="/contact" class="btn-gfd-ghost">
              Talk to Us
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-cta {
  background: var(--gfd-black);
}

.cta-wrap {
  padding: 4rem 3rem;
  border-radius: var(--radius-xl);
  position: relative;
  overflow: hidden;
  text-align: center;
}

.cta-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 300px;
  background: radial-gradient(ellipse, rgba(0,208,132,0.12) 0%, transparent 70%);
  pointer-events: none;
}

.cta-body {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.cta-title {
  max-width: 600px;
}

.cta-desc {
  max-width: 520px;
}

.cta-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
