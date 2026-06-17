<template>
  <div class="legal-view">
    <div class="container-gfd legal-container">

      <!-- Header -->
      <div class="legal-header">
        <RouterLink to="/" class="back-link">
          <span class="material-symbols-outlined">arrow_back</span>
          Back to Home
        </RouterLink>
        <div class="legal-badge">Legal</div>
        <h1 class="legal-title">Privacy Policy</h1>
        <p class="legal-meta">Last updated: June 9, 2025</p>
      </div>

      <!-- Content -->
      <div class="legal-content glass-card-static">

        <p class="legal-intro">
          This Privacy Policy describes how <strong>GFD Global Full-Stack Developers</strong> ("we", "us", or "our")
          collects, uses, and protects your data on our website
          <a href="https://globalfd.xyz/" class="legal-link">https://globalfd.xyz/</a>.
        </p>

        <div class="legal-section">
          <h2 class="legal-section-title">
            <span class="section-num">1</span>
            Data We Collect
          </h2>
          <p>We collect the following data:</p>
          <ul class="legal-list">
            <li>Name</li>
            <li>Email address</li>
            <li>IP Address</li>
            <li>Cookies</li>
          </ul>
        </div>

        <div class="legal-section">
          <h2 class="legal-section-title">
            <span class="section-num">2</span>
            Use of Data
          </h2>
          <p>Collected data is used to:</p>
          <ul class="legal-list">
            <li>Provide and operate our services</li>
            <li>Improve the website and user experience</li>
            <li>Analytics and performance monitoring</li>
          </ul>
        </div>

        <div class="legal-section">
          <h2 class="legal-section-title">
            <span class="section-num">3</span>
            Data Protection
          </h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal
            data against unauthorized access, loss, or disclosure.
          </p>
        </div>

        <div class="legal-section">
          <h2 class="legal-section-title">
            <span class="section-num">4</span>
            Sharing Data with Third Parties
          </h2>
          <p>
            We do not sell or share your personal data with third parties, except as required by
            applicable law or to operate core platform services (e.g., cloud hosting, email delivery).
          </p>
        </div>

        <div class="legal-section">
          <h2 class="legal-section-title">
            <span class="section-num">5</span>
            Your Rights
          </h2>
          <p>
            You have the right to request access to, correction of, or deletion of your personal
            data at any time. To exercise these rights, contact us at:
          </p>
          <a href="mailto:obikoyaayomikun33@gmail.com" class="legal-email">
            <span class="material-symbols-outlined" style="font-size:16px">mail</span>
            obikoyaayomikun33@gmail.com
          </a>
        </div>

        <div class="legal-section">
          <h2 class="legal-section-title">
            <span class="section-num">6</span>
            Contact Us
          </h2>
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>
          <a href="mailto:obikoyaayomikun33@gmail.com" class="legal-email">
            <span class="material-symbols-outlined" style="font-size:16px">mail</span>
            obikoyaayomikun33@gmail.com
          </a>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { useSeo } from '@/composables/useSeo'

useSeo({
  title: 'Privacy Policy',
  description: 'Learn how GFD Global Full-Stack Developers collects, uses, and protects your personal data.',
  path: '/privacy-policy',
})
</script>

<style scoped>
.legal-view {
  background: var(--background);
  min-height: 100vh;
  padding: calc(80px + 2rem) 0 4rem;
}

.legal-container {
  max-width: 760px;
}

/* Header */
.legal-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--on-surface-variant);
  text-decoration: none;
  transition: color 0.15s;
  width: fit-content;
}

.back-link:hover { color: var(--primary); }
.back-link .material-symbols-outlined { font-size: 18px; }

.legal-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  background: rgba(99,14,212,0.08);
  border: 1px solid rgba(99,14,212,0.15);
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--primary);
  width: fit-content;
}

.legal-title {
  font-family: var(--font-headline);
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  color: var(--on-surface);
  letter-spacing: -0.02em;
  line-height: 1.15;
}

.legal-meta {
  font-size: 0.875rem;
  color: var(--on-surface-variant);
}

/* Content card */
.legal-content {
  padding: 2rem;
  border-radius: var(--radius-xl);
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media (max-width: 640px) {
  .legal-content { padding: 1.25rem; }
}

.legal-intro {
  font-size: 1rem;
  color: var(--on-surface-variant);
  line-height: 1.7;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--outline-variant);
}

.legal-link {
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
}
.legal-link:hover { text-decoration: underline; }

/* Sections */
.legal-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.legal-section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: var(--font-headline);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--on-surface);
}

.section-num {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  min-width: 28px;
  background: rgba(99,14,212,0.08);
  border: 1px solid rgba(99,14,212,0.15);
  border-radius: var(--radius-md);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--primary);
}

.legal-section p {
  font-size: 0.9375rem;
  color: var(--on-surface-variant);
  line-height: 1.7;
}

.legal-list {
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.legal-list li {
  font-size: 0.9375rem;
  color: var(--on-surface-variant);
  line-height: 1.6;
}

.legal-email {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  background: rgba(99,14,212,0.06);
  border: 1px solid rgba(99,14,212,0.15);
  border-radius: var(--radius-lg);
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--primary);
  text-decoration: none;
  width: fit-content;
  transition: background 0.15s, border-color 0.15s;
}

.legal-email:hover {
  background: rgba(99,14,212,0.1);
  border-color: rgba(99,14,212,0.3);
}
</style>
