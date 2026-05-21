<template>
  <div class="plans-view">

    <!-- Header -->
    <div class="plans-header">
      <div class="plans-tag">
        <span class="material-symbols-outlined" style="font-size:14px;font-variation-settings:'FILL' 1;color:var(--primary)">stars</span>
        GFD Membership
      </div>
      <h1 class="plans-title">Choose Your Plan</h1>
      <p class="plans-sub">
        Unlock more visibility, priority support, and exclusive features to grow your career on GFD.
      </p>

      <!-- Billing toggle -->
      <div class="billing-toggle">
        <span :class="['toggle-label', { active: billing === 'monthly' }]">Monthly</span>
        <button class="toggle-switch" :class="{ on: billing === 'yearly' }" @click="billing = billing === 'monthly' ? 'yearly' : 'monthly'">
          <span class="toggle-knob" />
        </button>
        <span :class="['toggle-label', { active: billing === 'yearly' }]">
          Yearly
          <span class="save-badge">Save 20%</span>
        </span>
      </div>
    </div>

    <!-- Plans Grid -->
    <div class="plans-grid">
      <div
        v-for="plan in plans"
        :key="plan.id"
        class="plan-card glass-card"
        :class="{ 'plan-card-featured': plan.featured }"
      >
        <!-- Popular badge -->
        <div v-if="plan.featured" class="popular-badge">
          <span class="material-symbols-outlined" style="font-size:14px;font-variation-settings:'FILL' 1">bolt</span>
          Most Popular
        </div>

        <!-- Plan header -->
        <div class="plan-header">
          <div class="plan-icon-wrap" :style="{ background: plan.iconBg }">
            <span class="material-symbols-outlined plan-icon" :style="{ color: plan.iconColor }">{{ plan.icon }}</span>
          </div>
          <div>
            <h2 class="plan-name">{{ plan.name }}</h2>
            <p class="plan-desc">{{ plan.desc }}</p>
          </div>
        </div>

        <!-- Price -->
        <div class="plan-price">
          <span class="price-currency">$</span>
          <span class="price-amount">{{ billing === 'yearly' ? plan.priceYearly : plan.priceMonthly }}</span>
          <span class="price-period">/ mo</span>
        </div>
        <p v-if="billing === 'yearly' && plan.priceMonthly > 0" class="price-billed">
          Billed ${{ plan.priceYearly * 12 }}/year
        </p>

        <!-- CTA -->
        <button
          class="plan-cta"
          :class="plan.featured ? 'btn-primary' : 'btn-outline'"
          :disabled="plan.id === currentPlan"
          @click="selectPlan(plan)"
        >
          <span v-if="plan.id === currentPlan" class="material-symbols-outlined" style="font-size:16px;font-variation-settings:'FILL' 1">check_circle</span>
          {{ plan.id === currentPlan ? 'Current Plan' : plan.cta }}
        </button>

        <!-- Divider -->
        <div class="divider-gfd" />

        <!-- Features -->
        <ul class="plan-features">
          <li v-for="feature in plan.features" :key="feature.text" class="plan-feature" :class="{ disabled: !feature.included }">
            <span
              class="material-symbols-outlined feature-check"
              :style="feature.included ? 'font-variation-settings:\'FILL\' 1' : ''"
            >{{ feature.included ? 'check_circle' : 'cancel' }}</span>
            <span class="feature-text">{{ feature.text }}</span>
            <span v-if="feature.badge" class="feature-badge">{{ feature.badge }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- FAQ -->
    <div class="plans-faq">
      <h2 class="faq-title">Frequently Asked Questions</h2>
      <div class="faq-list">
        <div
          v-for="(faq, i) in faqs"
          :key="i"
          class="faq-item glass-card-static"
          @click="openFaq = openFaq === i ? null : i"
        >
          <div class="faq-question">
            <span class="faq-q-text">{{ faq.q }}</span>
            <span class="material-symbols-outlined faq-chevron" :class="{ open: openFaq === i }">expand_more</span>
          </div>
          <Transition name="faq">
            <p v-if="openFaq === i" class="faq-answer">{{ faq.a }}</p>
          </Transition>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUiStore } from '@/store/ui'

const uiStore = useUiStore()
const billing    = ref('monthly')
const openFaq    = ref(null)
const currentPlan = ref('pro') // simulate user is on Pro

const plans = [
  {
    id: 'free',
    name: 'Free',
    desc: 'Get started and explore the platform.',
    icon: 'person',
    iconBg: 'rgba(99,14,212,0.08)',
    iconColor: 'var(--primary)',
    priceMonthly: 0,
    priceYearly: 0,
    cta: 'Get Started',
    featured: false,
    features: [
      { text: 'Public developer profile',        included: true  },
      { text: 'Up to 3 portfolio projects',       included: true  },
      { text: 'Apply to 5 jobs/month',            included: true  },
      { text: 'Community access',                 included: true  },
      { text: 'Basic analytics',                  included: true  },
      { text: 'Priority search ranking',          included: false },
      { text: 'Unlimited job applications',       included: false },
      { text: 'Featured profile badge',           included: false },
      { text: 'Direct client messaging',          included: false },
      { text: 'Dedicated account manager',        included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    desc: 'For serious developers ready to grow.',
    icon: 'bolt',
    iconBg: 'rgba(99,14,212,0.12)',
    iconColor: 'var(--primary)',
    priceMonthly: 19,
    priceYearly: 15,
    cta: 'Upgrade to Pro',
    featured: true,
    features: [
      { text: 'Public developer profile',        included: true  },
      { text: 'Unlimited portfolio projects',     included: true  },
      { text: 'Unlimited job applications',       included: true  },
      { text: 'Community access',                 included: true  },
      { text: 'Advanced analytics & insights',    included: true  },
      { text: 'Priority search ranking',          included: true,  badge: 'New' },
      { text: 'Featured profile badge',           included: true  },
      { text: 'Direct client messaging',          included: true  },
      { text: 'Early access to new features',     included: true  },
      { text: 'Dedicated account manager',        included: false },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    desc: 'For agencies and high-volume teams.',
    icon: 'corporate_fare',
    iconBg: 'rgba(245,158,11,0.1)',
    iconColor: '#f59e0b',
    priceMonthly: 79,
    priceYearly: 63,
    cta: 'Contact Sales',
    featured: false,
    features: [
      { text: 'Everything in Pro',               included: true  },
      { text: 'Team workspace (up to 20 seats)', included: true  },
      { text: 'White-label profile options',     included: true  },
      { text: 'Custom integrations & API',       included: true  },
      { text: 'Priority support (24/7)',         included: true  },
      { text: 'Dedicated account manager',       included: true  },
      { text: 'Custom analytics dashboard',      included: true  },
      { text: 'Invoice billing',                 included: true  },
      { text: 'SLA guarantee',                   included: true  },
      { text: 'Onboarding & training session',   included: true  },
    ],
  },
]

const faqs = [
  {
    q: 'Can I cancel my plan at any time?',
    a: 'Yes. You can cancel your subscription at any time from your account settings. You\'ll retain access until the end of your current billing period.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit and debit cards (Visa, Mastercard, Amex), as well as PayPal. Enterprise customers can also pay via invoice.',
  },
  {
    q: 'Is there a free trial for Pro?',
    a: 'Yes — new users get a 14-day free trial of the Pro plan with no credit card required. You\'ll be notified before the trial ends.',
  },
  {
    q: 'What happens to my projects if I downgrade?',
    a: 'Your projects remain visible but you\'ll be limited to 3 active ones on the Free plan. Additional projects are archived and can be restored if you upgrade again.',
  },
  {
    q: 'Do you offer discounts for students?',
    a: 'Yes — verified students get 50% off the Pro plan. Contact us at hello@gfd.dev with your student email to apply.',
  },
]

function selectPlan(plan) {
  if (plan.id === currentPlan.value) return
  if (plan.id === 'enterprise') {
    uiStore.showInfo('Our sales team will reach out within 24 hours.')
    return
  }
  if (plan.id === 'free') {
    uiStore.showInfo('Downgraded to Free plan.')
    currentPlan.value = 'free'
    return
  }
  uiStore.showSuccess(`Upgraded to ${plan.name}! Welcome aboard.`)
  currentPlan.value = plan.id
}
</script>

<style scoped>
.plans-view {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  padding-bottom: 2rem;
}

/* ── Header ── */
.plans-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.875rem;
}

.plans-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.875rem;
  background: var(--surface-container-low);
  border: 1px solid var(--glass-border-primary);
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--primary);
}

.plans-title {
  font-family: var(--font-headline);
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  color: var(--on-surface);
  letter-spacing: -0.025em;
  line-height: 1.15;
}

.plans-sub {
  font-size: 0.9375rem;
  color: var(--on-surface-variant);
  line-height: 1.65;
  max-width: 480px;
}

/* Billing toggle */
.billing-toggle {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.25rem;
}

.toggle-label {
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--on-surface-variant);
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: color 0.15s ease;
}
.toggle-label.active { color: var(--on-surface); font-weight: 700; }

.toggle-switch {
  width: 44px;
  height: 24px;
  border-radius: var(--radius-full);
  background: var(--surface-container-high);
  border: none;
  cursor: pointer;
  position: relative;
  transition: background 0.2s ease;
  flex-shrink: 0;
}
.toggle-switch.on { background: var(--primary); }

.toggle-knob {
  position: absolute;
  top: 2px; left: 2px;
  width: 20px; height: 20px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  transition: transform 0.2s ease;
  display: block;
}
.toggle-switch.on .toggle-knob { transform: translateX(20px); }

.save-badge {
  padding: 0.1rem 0.45rem;
  background: rgba(22,163,74,0.12);
  border: 1px solid rgba(22,163,74,0.25);
  border-radius: var(--radius-full);
  font-size: 0.65rem;
  font-weight: 700;
  color: #16a34a;
  letter-spacing: 0.02em;
}

/* ── Plans Grid ── */
.plans-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .plans-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) {
  .plans-grid { grid-template-columns: repeat(3, 1fr); }
}

/* Plan Card */
.plan-card {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.5rem;
  position: relative;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.plan-card-featured {
  border-color: var(--primary) !important;
  box-shadow: 0 0 0 2px var(--primary), var(--shadow-md);
}

/* Popular badge */
.popular-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.875rem;
  background: var(--primary);
  color: var(--on-primary);
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

/* Plan header */
.plan-header {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
}

.plan-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.plan-icon { font-size: 22px; }

.plan-name {
  font-family: var(--font-headline);
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--on-surface);
  line-height: 1.2;
}

.plan-desc {
  font-size: 0.8rem;
  color: var(--on-surface-variant);
  margin-top: 0.2rem;
  line-height: 1.4;
}

/* Price */
.plan-price {
  display: flex;
  align-items: flex-end;
  gap: 0.1rem;
  line-height: 1;
}

.price-currency {
  font-family: var(--font-headline);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--on-surface);
  margin-bottom: 0.35rem;
}

.price-amount {
  font-family: var(--font-headline);
  font-size: 2.75rem;
  font-weight: 800;
  color: var(--on-surface);
  letter-spacing: -0.03em;
}

.price-period {
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--on-surface-variant);
  margin-bottom: 0.5rem;
  margin-left: 0.1rem;
}

.price-billed {
  font-size: 0.75rem;
  color: var(--on-surface-variant);
  margin-top: -0.75rem;
}

/* CTA */
.plan-cta {
  width: 100%;
  justify-content: center;
  padding: 0.7rem 1rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  border-radius: var(--radius-lg);
  font-family: var(--font-headline);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.plan-cta:disabled {
  opacity: 0.6;
  cursor: default;
  pointer-events: none;
}

/* Features list */
.plan-features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  flex: 1;
}

.plan-feature {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--on-surface);
  line-height: 1.45;
}

.plan-feature.disabled {
  opacity: 0.4;
}

.feature-check {
  font-size: 16px;
  flex-shrink: 0;
  margin-top: 1px;
}

.plan-feature:not(.disabled) .feature-check { color: #16a34a; }
.plan-feature.disabled .feature-check { color: var(--outline); }

.feature-text { flex: 1; }

.feature-badge {
  padding: 0.1rem 0.4rem;
  background: rgba(99,14,212,0.1);
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.62rem;
  font-weight: 700;
  color: var(--primary);
  letter-spacing: 0.03em;
  flex-shrink: 0;
}

/* ── FAQ ── */
.plans-faq {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 720px;
  margin: 0 auto;
  width: 100%;
}

.faq-title {
  font-family: var(--font-headline);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--on-surface);
  text-align: center;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.faq-item {
  padding: 1rem 1.25rem;
  border-radius: var(--radius-xl);
  cursor: pointer;
  transition: background 0.15s ease;
}

.faq-item:hover { background: var(--surface-container-low); }

.faq-question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.faq-q-text {
  font-family: var(--font-headline);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--on-surface);
  line-height: 1.4;
}

.faq-chevron {
  font-size: 22px;
  color: var(--on-surface-variant);
  flex-shrink: 0;
  transition: transform 0.2s ease;
}
.faq-chevron.open { transform: rotate(180deg); }

.faq-answer {
  font-size: 0.875rem;
  color: var(--on-surface-variant);
  line-height: 1.65;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--outline-variant);
}

/* FAQ transition */
.faq-enter-active, .faq-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.faq-enter-from, .faq-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
