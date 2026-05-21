<template>
  <div class="contact-view">
    <!-- Hero -->
    <section class="page-hero section-gfd">
      <div class="container-gfd hero-inner">
        <div class="hero-tag animate-fade-in-up">
          <span class="material-symbols-outlined" style="font-size:16px;color:var(--primary);">mail</span>
          Get in Touch
        </div>
        <h1 class="text-headline-xl animate-fade-in-up delay-100">
          Let's <span class="text-gradient">Talk</span>
        </h1>
        <p class="text-body-lg animate-fade-in-up delay-200" style="max-width:520px;text-align:center;">
          Have a project in mind? Want to join our team? Or just want to say hello?
          We'd love to hear from you.
        </p>
      </div>
    </section>

    <!-- Content -->
    <section class="section-gfd contact-section">
      <div class="container-gfd contact-grid">

        <!-- Info Column -->
        <div class="contact-info animate-slide-left">
          <h2 class="info-title">Contact Information</h2>

          <div class="contact-items">
            <div v-for="item in contactItems" :key="item.label" class="contact-item glass-card-static">
              <div class="item-icon-wrap">
                <span class="material-symbols-outlined item-icon">{{ item.icon }}</span>
              </div>
              <div>
                <p class="item-label">{{ item.label }}</p>
                <p class="item-value">{{ item.value }}</p>
              </div>
            </div>
          </div>

          <div class="social-links">
            <a v-for="(url, name) in socialLinks" :key="name" :href="url" class="social-pill" target="_blank" rel="noopener">
              {{ name }}
            </a>
          </div>
        </div>

        <!-- Form Column -->
        <div class="contact-form-wrap animate-slide-right">
          <div class="glass-card-static form-card">
            <h3 class="form-title">Send a Message</h3>

            <Transition name="fade">
              <div v-if="sent" class="form-success">
                <span class="material-symbols-outlined" style="font-size:2rem;color:#16a34a;">check_circle</span>
                <div>
                  <p class="success-title">Message sent!</p>
                  <p class="success-desc">We'll get back to you within 24 hours.</p>
                </div>
              </div>
            </Transition>

            <form v-if="!sent" class="contact-form" @submit.prevent="handleSubmit" novalidate>
              <div class="form-row">
                <GfdInput v-model="form.name"    label="Name"    placeholder="Your name"       required />
                <GfdInput v-model="form.email"   label="Email"   type="email" placeholder="your@email.com" required />
              </div>
              <GfdInput v-model="form.subject"   label="Subject" placeholder="What's this about?" />
              <GfdInput v-model="form.message"   label="Message" type="textarea" placeholder="Tell us more..." :rows="5" required />
              <GfdButton type="submit" variant="primary" :loading="loading" full>
                Send Message →
              </GfdButton>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import GfdInput  from '@/components/ui/GfdInput.vue'
import GfdButton from '@/components/ui/GfdButton.vue'

const loading = ref(false)
const sent    = ref(false)
const form    = reactive({ name: '', email: '', subject: '', message: '' })

const contactItems = [
  { icon: 'mail',     label: 'Email',    value: 'hello@gfd.dev' },
  { icon: 'phone',    label: 'Phone',    value: '+1 (555) GFD-CODE' },
  { icon: 'public',   label: 'Location', value: 'Global · Remote-First' },
  { icon: 'schedule', label: 'Response', value: 'Within 24 hours' },
]

const socialLinks = {
  GitHub:   'https://github.com/gfd-dev',
  LinkedIn: 'https://linkedin.com/company/gfd-dev',
  Twitter:  'https://twitter.com/gfd_dev',
  Discord:  'https://discord.gg/gfd-dev',
}

async function handleSubmit() {
  if (!form.name || !form.email || !form.message) return
  loading.value = true
  await new Promise(r => setTimeout(r, 1200))
  loading.value = false
  sent.value    = true
}
</script>

<style scoped>
.contact-view { background: var(--background); }

/* Hero */
.page-hero { padding-top: 5rem; background: var(--background); }

.hero-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}

/* Hero tag — uses design tokens for dark mode */
.hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.875rem;
  background: var(--surface-container-low);
  border: 1px solid var(--glass-border-primary);
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--primary);
}

/* Contact section — uses design token for dark mode */
.contact-section { background: var(--surface-container-low); }

.contact-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
}

@media (min-width: 1024px) {
  .contact-grid { grid-template-columns: 1fr 1.5fr; }
}

/* Info */
.info-title {
  font-family: var(--font-headline);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--on-surface);
  margin-bottom: 1.5rem;
}

.contact-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: var(--radius-xl);
}

.item-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-lg);
  background: rgba(99,14,212,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.item-icon { font-size: 22px; color: var(--primary); }

.item-label { font-size: 0.7rem; color: var(--on-surface-variant); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
.item-value { font-family: var(--font-headline); font-size: 0.9rem; color: var(--on-surface); font-weight: 500; margin-top: 0.1rem; }

.social-links { display: flex; flex-wrap: wrap; gap: 0.5rem; }

.social-pill {
  padding: 0.35rem 0.875rem;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--on-surface-variant);
  text-decoration: none;
  transition: var(--transition-fast);
}
.social-pill:hover { border-color: var(--primary); color: var(--primary); }

/* Form */
.form-card { padding: 2rem; border-radius: var(--radius-xl); }

.form-title {
  font-family: var(--font-headline);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--on-surface);
  margin-bottom: 1.5rem;
}

.contact-form { display: flex; flex-direction: column; gap: 1.25rem; }

.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}
@media (min-width: 640px) { .form-row { grid-template-columns: 1fr 1fr; } }

/* Success */
.form-success {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(22,163,74,0.05);
  border: 1px solid rgba(22,163,74,0.2);
  border-radius: var(--radius-xl);
}

.success-title { font-family: var(--font-headline); font-size: 1rem; font-weight: 700; color: var(--on-surface); }
.success-desc  { font-size: 0.875rem; color: var(--on-surface-variant); margin-top: 0.2rem; }

/* Transition */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
