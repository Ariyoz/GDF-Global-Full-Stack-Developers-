<template>
  <div class="safety-view">
    <div class="safety-inner">
      <!-- Header -->
      <div class="safety-header">
        <button class="btn-ghost back-btn" @click="$router.back()">
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h1 class="safety-title">Report Content</h1>
          <p class="safety-sub">Help us keep GFD safe for everyone.</p>
        </div>
      </div>

      <!-- Report Form -->
      <div v-if="!submitted" class="glass-card-static safety-card">
        <!-- Reported Item Preview -->
        <div class="reported-item">
          <div class="reported-avatar">{{ reportedUser[0] }}</div>
          <div class="reported-info">
            <p class="reported-name">{{ reportedUser }}</p>
            <p class="reported-type">{{ reportedType }}</p>
          </div>
        </div>

        <div class="divider-gfd" />

        <!-- Reason Selection -->
        <div class="form-section">
          <h3 class="form-section-title">Why are you reporting this?</h3>
          <div class="reason-list">
            <label
              v-for="reason in reasons"
              :key="reason.value"
              class="reason-item"
              :class="{ active: selectedReason === reason.value }"
            >
              <input type="radio" :value="reason.value" v-model="selectedReason" style="display:none" />
              <div class="reason-icon-wrap">
                <span class="material-symbols-outlined reason-icon" :style="{ color: reason.color }">{{ reason.icon }}</span>
              </div>
              <div class="reason-text">
                <p class="reason-label">{{ reason.label }}</p>
                <p class="reason-desc">{{ reason.desc }}</p>
              </div>
              <span class="material-symbols-outlined reason-check" style="font-variation-settings:'FILL' 1">
                {{ selectedReason === reason.value ? 'radio_button_checked' : 'radio_button_unchecked' }}
              </span>
            </label>
          </div>
        </div>

        <!-- Additional Details -->
        <div v-if="selectedReason" class="form-section">
          <h3 class="form-section-title">Additional Details <span style="font-weight:400;color:var(--on-surface-variant)">(Optional)</span></h3>
          <textarea
            v-model="details"
            class="details-textarea"
            placeholder="Provide any additional context that might help our team review this report..."
            rows="4"
          />
        </div>

        <!-- Submit -->
        <div class="safety-actions">
          <GfdButton
            variant="danger"
            :disabled="!selectedReason"
            :loading="loading"
            full
            @click="handleSubmit"
          >
            <span class="material-symbols-outlined" style="font-size:18px">flag</span>
            Submit Report
          </GfdButton>
          <button class="btn-ghost" style="width:100%;justify-content:center" @click="$router.back()">
            Cancel
          </button>
        </div>
      </div>

      <!-- Success State -->
      <div v-else class="glass-card-static safety-card success-state">
        <div class="success-icon-wrap">
          <span class="material-symbols-outlined" style="font-size:2.5rem;color:#16a34a;font-variation-settings:'FILL' 1">task_alt</span>
        </div>
        <h2 class="success-title">Report Submitted</h2>
        <p class="success-desc">
          Thank you for helping keep GFD safe. Our trust & safety team will review your report within 24 hours.
        </p>
        <div class="success-note">
          <span class="material-symbols-outlined" style="font-size:16px;color:var(--primary)">info</span>
          <p>You won't be notified of the outcome to protect user privacy, but we take all reports seriously.</p>
        </div>
        <GfdButton variant="primary" full @click="$router.push('/')">Back to Home</GfdButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import GfdButton from '@/components/ui/GfdButton.vue'

const reportedUser = ref('Alex Rivera')
const reportedType = ref('Developer Profile')
const selectedReason = ref('')
const details  = ref('')
const loading  = ref(false)
const submitted = ref(false)

const reasons = [
  { value: 'harassment',   icon: 'sentiment_very_dissatisfied', label: 'Harassment or Bullying',  desc: 'Threatening, abusive, or intimidating behavior.',  color: 'var(--error)' },
  { value: 'spam',         icon: 'mark_email_unread',           label: 'Spam or Misleading',      desc: 'Fake profiles, misleading info, or unsolicited messages.', color: 'var(--tertiary)' },
  { value: 'fraud',        icon: 'gavel',                       label: 'Fraud or Scam',           desc: 'Attempting to deceive or defraud other users.',    color: 'var(--error)' },
  { value: 'inappropriate',icon: 'block',                       label: 'Inappropriate Content',   desc: 'Content that violates GFD community guidelines.',  color: '#f59e0b' },
  { value: 'ip',           icon: 'copyright',                   label: 'Intellectual Property',   desc: 'Unauthorized use of copyrighted work or IP.',      color: 'var(--primary)' },
  { value: 'other',        icon: 'more_horiz',                  label: 'Other',                   desc: 'Something else not listed above.',                 color: 'var(--outline)' },
]

async function handleSubmit() {
  if (!selectedReason.value) return
  loading.value = true
  await new Promise(r => setTimeout(r, 1000))
  loading.value  = false
  submitted.value = true
}
</script>

<style scoped>
.safety-view {
  background: var(--background);
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 1.5rem 1rem 3rem;
}

.safety-inner {
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Header */
.safety-header {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.back-btn { padding: 0.4rem; flex-shrink: 0; margin-top: 2px; }

.safety-title {
  font-family: var(--font-headline);
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--on-surface);
}

.safety-sub { font-size: 0.875rem; color: var(--on-surface-variant); margin-top: 0.2rem; }

/* Card */
.safety-card {
  padding: 1.5rem;
  border-radius: var(--radius-xl);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Reported Item */
.reported-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.reported-avatar {
  width: 44px; height: 44px; border-radius: var(--radius-lg);
  background: var(--surface-container);
  color: var(--primary);
  font-family: var(--font-headline); font-size: 1rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}

.reported-name { font-family: var(--font-headline); font-size: 0.9375rem; font-weight: 700; color: var(--on-surface); }
.reported-type { font-size: 0.8rem; color: var(--on-surface-variant); margin-top: 1px; }

/* Form Section */
.form-section { display: flex; flex-direction: column; gap: 0.75rem; }

.form-section-title {
  font-family: var(--font-headline);
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--on-surface);
}

/* Reasons */
.reason-list { display: flex; flex-direction: column; gap: 0.5rem; }

.reason-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.15s ease;
}

.reason-item:hover { border-color: rgba(168,85,247,0.3); background: rgba(168,85,247,0.02); }
.reason-item.active { border-color: var(--primary); background: rgba(168,85,247,0.05); }

.reason-icon-wrap {
  width: 36px; height: 36px; border-radius: var(--radius-md);
  background: var(--surface-container);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}

.reason-icon { font-size: 20px; }

.reason-text { flex: 1; }
.reason-label { font-family: var(--font-headline); font-size: 0.875rem; font-weight: 600; color: var(--on-surface); }
.reason-desc  { font-size: 0.75rem; color: var(--on-surface-variant); margin-top: 0.1rem; }

.reason-check { font-size: 20px; color: var(--outline-variant); flex-shrink: 0; }
.reason-item.active .reason-check { color: var(--primary); }

/* Details */
.details-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--surface-container-low);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-lg);
  font-family: var(--font-body); font-size: 0.875rem; color: var(--on-surface);
  resize: none; outline: none; line-height: 1.6;
}
.details-textarea:focus { border-color: var(--primary); }

/* Actions */
.safety-actions { display: flex; flex-direction: column; gap: 0.5rem; }

/* Success */
.success-state { align-items: center; text-align: center; }

.success-icon-wrap {
  width: 72px; height: 72px; border-radius: var(--radius-full);
  background: rgba(22,163,74,0.1);
  display: flex; align-items: center; justify-content: center;
}

.success-title { font-family: var(--font-headline); font-size: 1.375rem; font-weight: 700; color: var(--on-surface); }
.success-desc  { font-size: 0.9rem; color: var(--on-surface-variant); line-height: 1.65; }

.success-note {
  display: flex; align-items: flex-start; gap: 0.5rem;
  padding: 0.875rem 1rem;
  background: rgba(168,85,247,0.05);
  border: 1px solid rgba(168,85,247,0.15);
  border-radius: var(--radius-lg);
  text-align: left;
  font-size: 0.8rem; color: var(--on-surface-variant); line-height: 1.5;
}
</style>
