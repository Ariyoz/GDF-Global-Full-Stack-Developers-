<template>
  <footer class="footer">

    <!-- Top gradient divider -->
    <div class="footer-gradient" />

    <div class="footer-wrap">

      <!-- Brand + newsletter column -->
      <div class="footer-brand">
        <RouterLink to="/" class="f-logo">
          <img src="@/assets/icons/icon.png" alt="GFD" class="f-logo-img" />
          <span class="f-logo-txt">GFD</span>
        </RouterLink>
        <p class="f-tagline">
          The global marketplace for elite full-stack developers and ambitious clients.
          Build the future, faster.
        </p>

        <!-- Status pill -->
        <div class="f-status">
          <span class="status-dot" />
          <span>All systems operational</span>
        </div>

        <!-- Socials -->
        <div class="f-socials">
          <a href="https://github.com" target="_blank" rel="noopener" class="f-social" aria-label="GitHub">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58v-2.03c-3.34.72-4.04-1.6-4.04-1.6-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 013-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.65.25 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57C20.57 21.8 24 17.3 24 12 24 5.37 18.63 0 12 0z"/>
            </svg>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener" class="f-social" aria-label="X / Twitter">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener" class="f-social" aria-label="LinkedIn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>
      </div>

      <!-- Link columns -->
      <div class="footer-cols">
        <div v-for="col in cols" :key="col.title" class="f-col">
          <h4 class="f-col-title">{{ col.title }}</h4>
          <ul class="f-col-list">
            <li v-for="lnk in col.links" :key="lnk.label">
              <RouterLink v-if="lnk.to" :to="lnk.to" class="f-link">{{ lnk.label }}</RouterLink>
              <a v-else :href="lnk.href || '#'" class="f-link">{{ lnk.label }}</a>
            </li>
          </ul>
        </div>
      </div>

    </div>

    <!-- Bottom bar -->
    <div class="footer-bottom">
      <div class="footer-bottom-inner">
        <p class="bottom-copy">© {{ year }} Global Full-Stack Developers · Built for developers, by developers.</p>
        <div class="bottom-links">
          <RouterLink to="/privacy-policy" class="bottom-lnk">Privacy</RouterLink>
          <span class="bottom-sep" />
          <a href="#" class="bottom-lnk">Terms</a>
          <span class="bottom-sep" />
          <a href="#" class="bottom-lnk">Cookies</a>
        </div>
      </div>
    </div>

  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
const cols = [
  {
    title: 'Platform',
    links: [
      { label: 'Browse Developers', to: '/explore' },
      { label: 'Post a Project',    to: '/hire' },
      { label: 'Job Board',         to: '/jobs' },
      { label: 'Projects',          to: '/projects' },
      { label: 'Courses',           to: '/courses' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us',  to: '/about' },
      { label: 'Careers',   to: '/careers' },
      { label: 'Community', to: '/community' },
      { label: 'Contact',   to: '/contact' },
      { label: 'Services',  to: '/services' },
    ],
  },
  {
    title: 'Developers',
    links: [
      { label: 'Join GFD',       to: '/auth/register' },
      { label: 'Dashboard',      to: '/dashboard' },
      { label: 'Wallet',         to: '/wallet' },
      { label: 'Upload Project', to: '/projects/upload' },
      { label: 'Plans',          to: '/plans' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy',   to: '/privacy-policy' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy',    href: '#' },
      { label: 'Safety Report',    to: '/report' },
    ],
  },
]
</script>

<style scoped>
.footer {
  background: var(--background);
  position: relative;
}

/* Gradient line at top */
.footer-gradient {
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--primary) 30%,
    rgba(168,85,247,.5) 50%,
    var(--primary) 70%,
    transparent 100%
  );
  opacity: .4;
}

/* ── Main body ── */
.footer-wrap {
  max-width: 1280px; margin: 0 auto;
  display: grid; grid-template-columns: 1fr;
  gap: 2.5rem; padding: 3.5rem 1.25rem 2.5rem;
  box-sizing: border-box;
}
@media (min-width: 768px) {
  .footer-wrap { grid-template-columns: 280px 1fr; gap: 4rem; padding: 4rem 2rem 3rem; }
}

/* ── Brand column ── */
.footer-brand { display: flex; flex-direction: column; gap: 1.125rem; }

.f-logo { display: inline-flex; align-items: center; gap: .5rem; text-decoration: none; }
.f-logo-img { width: 34px; height: 34px; border-radius: 10px; object-fit: contain; }
.f-logo-txt {
  font-family: var(--font-headline); font-size: 1.2rem; font-weight: 900;
  color: var(--on-surface); letter-spacing: -.025em;
}

.f-tagline { font-size: .875rem; color: var(--on-surface-variant); line-height: 1.7; max-width: 260px; }

.f-status {
  display: inline-flex; align-items: center; gap: .5rem;
  padding: .3rem .75rem; border-radius: 999px;
  background: rgba(34,197,94,.08); border: 1px solid rgba(34,197,94,.2);
  font-size: .75rem; font-weight: 600; color: #16a34a;
  width: fit-content;
}
.status-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: #22c55e; box-shadow: 0 0 6px rgba(34,197,94,.6); flex-shrink: 0;
}

.f-socials { display: flex; gap: .5rem; }
.f-social {
  width: 36px; height: 36px; border-radius: 10px;
  background: var(--surface-container-low);
  border: 1px solid var(--outline-variant);
  display: flex; align-items: center; justify-content: center;
  color: var(--on-surface-variant); text-decoration: none;
  transition: all .15s;
}
.f-social:hover { background: var(--primary-fixed); border-color: var(--primary); color: var(--primary); transform: translateY(-2px); }

/* ── Link columns ── */
.footer-cols {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem;
}
@media (min-width: 640px) { .footer-cols { grid-template-columns: repeat(4, 1fr); gap: 1.5rem; } }

.f-col-title {
  font-family: var(--font-headline); font-size: .72rem; font-weight: 800;
  color: var(--on-surface); text-transform: uppercase; letter-spacing: .1em;
  margin-bottom: 1rem;
}
.f-col-list { list-style: none; display: flex; flex-direction: column; gap: .5rem; }
.f-link {
  font-size: .875rem; color: var(--on-surface-variant); text-decoration: none;
  transition: color .15s; display: inline-block;
}
.f-link:hover { color: var(--primary); transform: translateX(2px); }

/* ── Bottom bar ── */
.footer-bottom {
  border-top: 1px solid var(--outline-variant);
}
.footer-bottom-inner {
  max-width: 1280px; margin: 0 auto;
  display: flex; flex-direction: column; align-items: center;
  gap: .625rem; padding: 1.125rem 1.25rem;
  text-align: center;
}
@media (min-width: 640px) {
  .footer-bottom-inner { flex-direction: row; justify-content: space-between; text-align: left; }
}
.bottom-copy { font-size: .78rem; color: var(--on-surface-variant); opacity: .65; }
.bottom-links { display: flex; align-items: center; gap: .625rem; }
.bottom-lnk { font-size: .78rem; color: var(--on-surface-variant); text-decoration: none; transition: color .15s; }
.bottom-lnk:hover { color: var(--primary); }
.bottom-sep {
  width: 3px; height: 3px; border-radius: 50%;
  background: var(--outline-variant); flex-shrink: 0;
}
</style>
