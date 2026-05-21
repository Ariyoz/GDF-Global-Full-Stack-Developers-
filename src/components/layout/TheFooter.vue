<template>
  <footer class="footer-gfd">
    <div class="divider-gfd" />
    <div class="container-gfd footer-inner">

      <!-- Brand -->
      <div class="footer-brand">
        <RouterLink to="/" class="footer-logo">GFD</RouterLink>
        <p class="footer-tagline">
          Elite developer marketplace for teams and builders.
        </p>
        <div class="footer-socials">
          <button class="social-icon-btn" aria-label="Website">
            <span class="material-symbols-outlined">public</span>
          </button>
          <button class="social-icon-btn" aria-label="GitHub">
            <span class="material-symbols-outlined">hub</span>
          </button>
          <button class="social-icon-btn" aria-label="Community">
            <span class="material-symbols-outlined">groups</span>
          </button>
        </div>
      </div>

      <!-- Links -->
      <div class="footer-links-grid">
        <div v-for="col in footerColumns" :key="col.title" class="footer-col">
          <h4 class="footer-col-title">{{ col.title }}</h4>
          <ul class="footer-col-list">
            <li v-for="link in col.links" :key="link.label">
              <RouterLink v-if="link.to" :to="link.to" class="footer-link">{{ link.label }}</RouterLink>
              <a v-else :href="link.href || '#'" class="footer-link">{{ link.label }}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Bottom -->
    <div class="footer-bottom">
      <div class="container-gfd footer-bottom-inner">
        <p class="footer-copy">© {{ year }} GFD Inc. Built for developers, by developers.</p>
        <div class="footer-bottom-links">
          <a href="#" class="footer-link">Privacy Policy</a>
          <a href="#" class="footer-link">Terms of Service</a>
          <a href="#" class="footer-link">Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()

const footerColumns = [
  {
    title: 'Platform',
    links: [
      { label: 'Developers',      to: '/explore' },
      { label: 'Projects',        to: '/projects' },
      { label: 'Stories',         to: '/community' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '#' },
      { label: 'Docs', href: '#' },
      { label: 'Support', to: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy',  href: '#' },
      { label: 'Terms of Service',href: '#' },
      { label: 'Cookie Policy',   href: '#' },
    ],
  },
]
</script>

<style scoped>
.footer-gfd {
  background: var(--surface-container-low);
  border-top: 1px solid var(--outline-variant);
  transition: background-color 0.3s ease;
}

.footer-inner {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
  padding-top: var(--space-lg);
  padding-bottom: var(--space-lg);
  align-items: stretch;
}

@media (min-width: 768px) {
  .footer-inner {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
}

/* Brand */
.footer-brand {
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.footer-logo {
  font-family: var(--font-headline);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary);
  text-decoration: none;
}

.footer-tagline {
  font-size: 1rem;
  color: var(--on-surface-variant);
  line-height: 1.6;
}

.footer-socials {
  display: flex;
  gap: var(--space-md);
}

.social-icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--outline);
  transition: var(--transition-fast);
  padding: 0;
  display: flex;
  align-items: center;
}

.social-icon-btn:hover { color: var(--primary); }

.social-icon-btn .material-symbols-outlined { font-size: 22px; }

/* Links */
.footer-links-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(120px, 1fr));
  gap: var(--space-lg);
  width: 100%;
  justify-items: center;
}

@media (min-width: 480px) {
  .footer-links-grid { grid-template-columns: repeat(3, minmax(140px, 1fr)); }
}

@media (min-width: 768px) {
  .footer-links-grid { grid-template-columns: repeat(3, minmax(180px, 1fr)); }
}

.footer-col {
  width: 100%;
  max-width: none;
}

.footer-col-title {
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--on-surface);
  margin-bottom: var(--space-md);
  letter-spacing: 0.01em;
}

.footer-col-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.footer-link {
  font-size: 1rem;
  color: var(--on-surface-variant);
  text-decoration: none;
  transition: var(--transition-fast);
}

@media (max-width: 639px) {
  .footer-col-title,
  .footer-col-list,
  .footer-link {
    text-align: center;
  }

  .footer-inner {
    align-items: center;
  }

  .footer-brand {
    align-items: center;
    text-align: center;
  }

  .footer-tagline {
    max-width: 320px;
  }
}

.footer-link:hover { color: var(--primary); }

/* Bottom */
.footer-bottom {
  border-top: 1px solid var(--outline-variant);
  padding: var(--space-md) 0;
}

.footer-bottom-inner {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
  text-align: center;
}

@media (min-width: 640px) {
  .footer-bottom-inner {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
    align-items: center;
  }
}

.footer-bottom-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-md);
}

@media (min-width: 640px) {
  .footer-bottom-links { justify-content: flex-end; }
}

/* Copyright text — uses design token so it adapts to dark mode */
.footer-copy {
  font-family: var(--font-headline);
  font-size: 0.875rem;
  color: var(--on-surface-variant);
  opacity: 0.7;
}

.footer-bottom-links {
  display: flex;
  gap: var(--space-md);
}

.footer-bottom-links .footer-link { font-size: 0.875rem; }
</style>
