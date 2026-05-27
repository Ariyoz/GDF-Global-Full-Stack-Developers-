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

      <!-- Billing toggle removed — plans show both options as separate cards -->
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
          <span class="price-amount">{{ plan.priceMonthly }}</span>
          <span class="price-period">/ mo</span>
        </div>
        <p v-if="plan.priceYearly > 0" class="price-billed">
          ${{ plan.priceYearly }}/year total
        </p>

        <!-- CTA -->
        <button
          class="plan-cta"
          :class="plan.featured ? 'btn-primary' : 'btn-outline'"
          :disabled="plan.id === currentPlan || subscribing"
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

    <!-- Payment Modal (USDT Crypto) -->
    <Transition name="modal">
      <div v-if="showPaymentModal" class="modal-overlay" @click.self="showPaymentModal = false">
        <div class="payment-modal">
          <div class="payment-modal-header">
            <h2 class="payment-modal-title">Complete Payment</h2>
            <button class="btn-ghost icon-only" @click="showPaymentModal = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="payment-modal-body">
            <div class="payment-plan-summary">
              <div class="payment-plan-name">{{ selectedPlanForPayment?.name }}</div>
              <div class="payment-plan-price">
                <span class="payment-amount">${{ selectedPlanForPayment?.id === 'pro_yearly' ? selectedPlanForPayment?.priceYearly : selectedPlanForPayment?.priceMonthly }}</span>
                <span class="payment-cycle">{{ selectedPlanForPayment?.id === 'pro_yearly' ? '/year' : '/month' }}</span>
              </div>
            </div>

            <div class="payment-divider"></div>

            <div class="payment-instructions">
              <h4 class="payment-section-title">
                <span class="material-symbols-outlined" style="font-size:18px;">currency_bitcoin</span>
                Pay with USDT (BEP20)
              </h4>
              <p class="payment-note">Send the exact amount in USDT (BEP20 network) to the wallet address below, then confirm your payment.</p>

              <div class="bank-details">
                <div class="bank-detail-row">
                  <span class="bank-label">Network</span>
                  <span class="bank-value">BEP20 (BSC)</span>
                </div>
                <div class="bank-detail-row">
                  <span class="bank-label">Token</span>
                  <span class="bank-value">USDT</span>
                </div>
                <div class="bank-detail-row">
                  <span class="bank-label">Wallet Address</span>
                  <span class="bank-value copyable" @click="copyToClipboard('0xd2849d446C3001B0C4d4174a5E62cf229e6cf5f5')">
                    0xd284...cf5f5
                    <span class="material-symbols-outlined" style="font-size:14px;">content_copy</span>
                  </span>
                </div>
                <div class="wallet-full-address" @click="copyToClipboard('0xd2849d446C3001B0C4d4174a5E62cf229e6cf5f5')">
                  <code>0xd2849d446C3001B0C4d4174a5E62cf229e6cf5f5</code>
                  <span class="material-symbols-outlined" style="font-size:14px;">content_copy</span>
                </div>
                <div class="bank-detail-row">
                  <span class="bank-label">Amount</span>
                  <span class="bank-value amount-highlight">
                    ${{ selectedPlanForPayment?.id === 'pro_yearly' ? selectedPlanForPayment?.priceYearly : selectedPlanForPayment?.priceMonthly }} USDT
                  </span>
                </div>
              </div>

              <div class="payment-methods-note">
                <span class="material-symbols-outlined" style="font-size:16px;color:#f59e0b;">warning</span>
                <span>Make sure to send on BEP20 (BSC) network only. Only USDT is accepted.</span>
              </div>
            </div>

            <div class="payment-divider"></div>

            <!-- Username confirmation -->
            <div class="confirm-section">
              <h4 class="payment-section-title">
                <span class="material-symbols-outlined" style="font-size:18px;">person</span>
                Confirm Your Identity
              </h4>
              <div class="confirm-input-wrap">
                <label class="confirm-label">Enter your GFD username</label>
                <input
                  v-model="confirmUsername"
                  type="text"
                  class="confirm-input"
                  :placeholder="authStore.profile?.username || 'your_username'"
                />
              </div>
            </div>
          </div>
          <div class="payment-modal-footer">
            <button
              class="btn-primary payment-confirm-btn"
              :disabled="subscribing || !confirmUsername.trim()"
              @click="confirmPaymentSent"
            >
              <span class="material-symbols-outlined" style="font-size:18px;">check_circle</span>
              {{ subscribing ? 'Submitting...' : "I've Sent Payment — Confirm" }}
            </button>
            <p class="payment-footer-note">Your verified badge will be activated once payment is confirmed by admin.</p>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUiStore } from '@/store/ui'
import { useAuthStore } from '@/store/auth'
import http from '@/services/http'

const uiStore = useUiStore()
const authStore = useAuthStore()
const openFaq    = ref(null)
const currentPlan = ref('free')
const subscribing = ref(false)

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
    cta: 'Current Plan',
    featured: false,
    features: [
      { text: 'Public developer profile',        included: true  },
      { text: 'Up to 3 portfolio projects',       included: true  },
      { text: 'Apply to 5 jobs/month',            included: true  },
      { text: 'Community access',                 included: true  },
      { text: 'Basic analytics',                  included: true  },
      { text: 'Verified badge (purple tick)',     included: false },
      { text: 'Priority search ranking',          included: false },
      { text: 'Unlimited job applications',       included: false },
      { text: 'Direct client messaging',          included: false },
    ],
  },
  {
    id: 'pro_monthly',
    name: 'Pro (Monthly)',
    desc: 'Pay month by month, cancel anytime.',
    icon: 'bolt',
    iconBg: 'rgba(99,14,212,0.12)',
    iconColor: 'var(--primary)',
    priceMonthly: 7,
    priceYearly: 84,
    cta: 'Subscribe — $7/mo',
    featured: false,
    features: [
      { text: 'Everything in Free',              included: true  },
      { text: 'Verified badge (purple tick)',    included: true, badge: '✓' },
      { text: 'Unlimited portfolio projects',     included: true  },
      { text: 'Unlimited job applications',       included: true  },
      { text: 'Priority search ranking',          included: true  },
      { text: 'Advanced analytics & insights',    included: true  },
      { text: 'Direct client messaging',          included: true  },
      { text: 'Early access to new features',     included: true  },
    ],
  },
  {
    id: 'pro_yearly',
    name: 'Pro (Yearly)',
    desc: 'Best value — save $24/year.',
    icon: 'workspace_premium',
    iconBg: 'rgba(245,158,11,0.1)',
    iconColor: '#f59e0b',
    priceMonthly: 5,
    priceYearly: 60,
    cta: 'Subscribe — $5/mo',
    featured: true,
    features: [
      { text: 'Everything in Free',              included: true  },
      { text: 'Verified badge (purple tick)',    included: true, badge: '✓' },
      { text: 'Unlimited portfolio projects',     included: true  },
      { text: 'Unlimited job applications',       included: true  },
      { text: 'Priority search ranking',          included: true  },
      { text: 'Advanced analytics & insights',    included: true  },
      { text: 'Direct client messaging',          included: true  },
      { text: 'Early access to new features',     included: true  },
      { text: 'Save $24 compared to monthly',    included: true, badge: 'Save' },
    ],
  },
]

const faqs = [
  {
    q: 'How do I pay?',
    a: 'Send USDT to our wallet address shown after selecting a plan. Once you\'ve sent the payment, enter your username and click confirm. Your badge will be activated after we verify the payment.',
  },
  {
    q: 'How long does activation take?',
    a: 'Once we confirm your USDT payment, your verified badge and Pro features are activated within 24 hours. Most activations happen within a few hours.',
  },
  {
    q: 'What happens when my subscription expires?',
    a: 'Your verified badge (purple tick) will be automatically removed when your subscription period ends. You can renew anytime.',
  },
  {
    q: 'Can I cancel my plan at any time?',
    a: 'Yes. You can cancel your subscription at any time. Your badge stays active until the end of your billing period.',
  },
  {
    q: 'What network should I use?',
    a: 'Send USDT on the BEP20 (Binance Smart Chain) network only. Do not send on other networks or your funds may be lost.',
  },
]

const showPaymentModal = ref(false)
const selectedPlanForPayment = ref(null)
const confirmUsername = ref('')

function selectPlan(plan) {
  if (plan.id === currentPlan.value) return
  if (plan.id === 'free') {
    downgradeToFree()
    return
  }
  // Show payment modal with USDT wallet
  selectedPlanForPayment.value = plan
  confirmUsername.value = authStore.profile?.username || ''
  showPaymentModal.value = true
}

async function downgradeToFree() {
  try {
    await http.post('/subscriptions/subscribe', { plan: 'free', billing_cycle: 'monthly' })
    currentPlan.value = 'free'
    if (authStore.profile) authStore.profile.is_verified = false
    uiStore.showInfo('Downgraded to Free plan.')
  } catch {
    uiStore.showError('Failed to downgrade. Please try again.')
  }
}

async function confirmPaymentSent() {
  if (!selectedPlanForPayment.value || !confirmUsername.value.trim()) return
  subscribing.value = true
  try {
    const plan = selectedPlanForPayment.value
    const billingCycle = plan.id === 'pro_yearly' ? 'yearly' : 'monthly'
    await http.post('/subscriptions/subscribe', {
      plan: plan.id,
      billing_cycle: billingCycle,
      username: confirmUsername.value.trim(),
    })
    showPaymentModal.value = false
    selectedPlanForPayment.value = null
    confirmUsername.value = ''
    uiStore.showSuccess('Payment submitted! Your verified badge will be activated once admin confirms your payment.')
  } catch (err) {
    uiStore.showError(err.response?.data?.detail || 'Failed to submit. Please try again.')
  } finally {
    subscribing.value = false
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
  uiStore.showSuccess('Copied to clipboard!')
}

onMounted(async () => {
  try {
    const data = await http.get('/subscriptions/my-subscription')
    if (data.plan && data.plan !== 'free') currentPlan.value = data.plan
  } catch {
    currentPlan.value = 'free'
  }
})
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

/* ── Payment Modal ── */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem; }
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

.payment-modal {
  width: 100%;
  max-width: 440px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-2xl);
  overflow: hidden;
}

[data-theme="dark"] .payment-modal {
  background: #1a1a2e;
  border-color: rgba(255,255,255,0.08);
}

.payment-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--outline-variant);
}

.payment-modal-title {
  font-family: var(--font-headline);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--on-surface);
}

.payment-modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.payment-plan-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: rgba(168, 85, 247, 0.06);
  border: 1px solid rgba(168, 85, 247, 0.15);
  border-radius: var(--radius-xl);
}

.payment-plan-name {
  font-family: var(--font-headline);
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--on-surface);
}

.payment-plan-price {
  font-family: var(--font-headline);
  font-size: 0.85rem;
  color: var(--on-surface-variant);
}

.payment-amount {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--primary);
}

.payment-total {
  font-size: 0.75rem;
  color: var(--on-surface-variant);
}

.payment-divider {
  height: 1px;
  background: var(--outline-variant);
}

.payment-instructions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.payment-section-title {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--font-headline);
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--on-surface);
}

.payment-note {
  font-size: 0.82rem;
  color: var(--on-surface-variant);
  line-height: 1.5;
}

.bank-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--surface-container-low);
  border-radius: var(--radius-xl);
}

.bank-detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.bank-label {
  font-size: 0.78rem;
  color: var(--on-surface-variant);
  font-weight: 500;
}

.bank-value {
  font-family: var(--font-headline);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--on-surface);
  text-align: right;
}

.bank-value.copyable {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  cursor: pointer;
  color: var(--primary);
}

.bank-value.copyable:hover { text-decoration: underline; }

.amount-highlight {
  color: var(--primary);
  font-weight: 700;
}

.payment-methods-note {
  display: flex;
  align-items: flex-start;
  gap: 0.4rem;
  font-size: 0.78rem;
  color: var(--on-surface-variant);
  line-height: 1.4;
  padding: 0.6rem 0.75rem;
  background: var(--surface-container-low);
  border-radius: var(--radius-lg);
}

.wallet-full-address {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.75rem;
  background: var(--surface-container);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: background 0.15s;
  margin-top: 0.25rem;
}

.wallet-full-address:hover { background: var(--surface-container-high); }

.wallet-full-address code {
  font-size: 0.68rem;
  color: var(--on-surface);
  word-break: break-all;
  flex: 1;
}

.confirm-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.confirm-input-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.confirm-label {
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--on-surface-variant);
}

.confirm-input {
  width: 100%;
  padding: 0.6rem 0.875rem;
  background: var(--surface-container-low);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-lg);
  font-size: 0.875rem;
  color: var(--on-surface);
  outline: none;
  font-family: var(--font-body);
}

.confirm-input:focus { border-color: var(--primary); }

.payment-cycle {
  font-size: 0.8rem;
  color: var(--on-surface-variant);
}

.payment-modal-footer {
  padding: 1rem 1.5rem 1.5rem;
  border-top: 1px solid var(--outline-variant);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

.payment-confirm-btn {
  width: 100%;
  justify-content: center;
  padding: 0.75rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.payment-footer-note {
  font-size: 0.72rem;
  color: var(--on-surface-variant);
  text-align: center;
}
</style>
