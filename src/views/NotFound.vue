<template>
  <div class="notfound-view">
    <div class="notfound-bg">
      <div class="glow-orb glow-orb-primary" style="width:400px;height:400px;top:50%;left:50%;transform:translate(-50%,-50%);opacity:0.3;" />
    </div>
    <div class="notfound-inner">
      <p class="notfound-code text-gradient">404</p>
      <h1 class="text-headline-lg notfound-title">Page Not Found</h1>
      <p class="text-body-lg notfound-desc">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div class="notfound-actions">
        <RouterLink to="/" class="btn-primary">← Back to Home</RouterLink>
        <RouterLink to="/contact" class="btn-outline">Contact Support</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notfound-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background);
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.notfound-bg { position: absolute; inset: 0; pointer-events: none; }

.notfound-inner {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  position: relative;
  z-index: 1;
}

.notfound-code {
  font-family: var(--font-headline);
  font-size: clamp(6rem, 20vw, 12rem);
  font-weight: 900;
  letter-spacing: -0.05em;
  line-height: 1;
}

.notfound-title { color: var(--on-surface); }

.notfound-desc {
  max-width: 400px;
  color: var(--on-surface-variant);
}

.notfound-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 0.5rem;
}
</style>
