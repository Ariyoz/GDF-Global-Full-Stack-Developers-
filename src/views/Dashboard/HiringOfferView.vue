<template>
  <div class="hiring-view">
    <div class="container-gfd hiring-inner">

      <!-- Active Applications Sidebar -->
      <aside class="hiring-sidebar">
        <div class="glass-card-static sidebar-card">
          <h3 class="sidebar-section-title">Active Applications</h3>
          <div class="app-list">
            <div
              v-for="app in applications"
              :key="app.id"
              class="app-item"
              :class="{ active: activeApp === app.id }"
              @click="activeApp = app.id"
            >
              <p class="app-title">{{ app.title }}</p>
              <p class="app-company">{{ app.company }}</p>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Thread -->
      <section class="hiring-main glass-card-static">
        <!-- Header -->
        <div class="thread-header">
          <div class="thread-company">
            <div class="company-icon-wrap">
              <span class="material-symbols-outlined" style="font-size:24px;color:var(--primary)">business</span>
            </div>
            <div>
              <h1 class="company-name">Skyline Systems</h1>
              <p class="project-name">Project: Multi-Region Cloud Migration</p>
            </div>
          </div>
          <span class="negotiation-badge">Active Negotiation</span>
        </div>

        <!-- Messages -->
        <div class="thread-messages" ref="messagesEl">
          <!-- System milestone -->
          <div class="milestone-marker">Application Received — Oct 12</div>

          <!-- Recruiter message -->
          <div class="msg-row msg-theirs">
            <div class="msg-avatar">S</div>
            <div class="msg-bubble bubble-theirs">
              <p>Hi there! We've reviewed your portfolio and were really impressed by your implementation of the Kubernetes cluster management tool. We'd love to discuss this further.</p>
              <span class="msg-time">10:42 AM</span>
            </div>
          </div>

          <!-- Interview Invitation Card -->
          <div class="special-card interview-card">
            <div class="special-card-header">
              <div class="special-icon-wrap">
                <span class="material-symbols-outlined" style="font-size:22px;color:var(--primary)">video_call</span>
              </div>
              <h3 class="special-card-title">Interview Invitation</h3>
            </div>
            <p class="special-card-desc">Sarah Chen has requested a technical deep-dive session regarding the Cloud Migration project.</p>
            <div class="time-slots">
              <p class="slots-label">Proposed Slots (EST)</p>
              <button
                v-for="slot in timeSlots"
                :key="slot"
                class="time-slot"
                :class="{ selected: selectedSlot === slot }"
                @click="selectedSlot = slot"
              >
                <span>{{ slot }}</span>
                <span class="material-symbols-outlined slot-check" style="font-variation-settings:'FILL' 1">
                  {{ selectedSlot === slot ? 'check_circle' : 'radio_button_unchecked' }}
                </span>
              </button>
            </div>
            <GfdButton v-if="selectedSlot && !slotConfirmed" variant="primary" @click="slotConfirmed = true">
              Confirm Slot
            </GfdButton>
            <div v-if="slotConfirmed" class="slot-confirmed">
              <span class="material-symbols-outlined" style="font-size:16px;color:#16a34a;font-variation-settings:'FILL' 1">check_circle</span>
              Slot confirmed: {{ selectedSlot }}
            </div>
          </div>

          <!-- User reply -->
          <div class="msg-row msg-mine">
            <div class="msg-bubble bubble-mine">
              <p>Sounds great! I've selected the Friday morning slot. Looking forward to meeting the team.</p>
              <span class="msg-time">11:15 AM</span>
            </div>
            <div class="msg-avatar mine">{{ userInitials }}</div>
          </div>

          <!-- System milestone -->
          <div class="milestone-marker">Technical Review Passed</div>

          <!-- Official Offer Card -->
          <div class="special-card offer-card">
            <div class="offer-badge">New Offer</div>
            <div class="offer-header">
              <div class="offer-icon-wrap">
                <span class="material-symbols-outlined" style="font-size:2rem;color:var(--on-primary);font-variation-settings:'FILL' 1">verified_user</span>
              </div>
              <h2 class="offer-title">Official Project Offer</h2>
              <p class="offer-desc">Skyline Systems would like to bring you on board for the multi-region migration project.</p>
            </div>

            <div class="offer-terms">
              <div class="offer-term">
                <span class="term-label">Rate</span>
                <p class="term-value">{{ currencyStore.format(120) }}<span class="term-unit">/hr</span></p>
              </div>
              <div class="offer-term">
                <span class="term-label">Duration</span>
                <p class="term-value">6 Months</p>
              </div>
            </div>

            <div v-if="!offerDecided" class="offer-actions">
              <button class="btn-primary offer-accept" @click="offerDecided = 'accepted'">Accept Offer</button>
              <button class="offer-decline" @click="offerDecided = 'declined'">Decline</button>
            </div>

            <div v-if="offerDecided === 'accepted'" class="offer-result accepted">
              <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">check_circle</span>
              Offer Accepted! Welcome to Skyline Systems.
            </div>
            <div v-if="offerDecided === 'declined'" class="offer-result declined">
              <span class="material-symbols-outlined">cancel</span>
              Offer Declined.
            </div>

            <p class="offer-expiry">Offer expires in 48 hours · <a href="#" class="offer-link">Download Contract PDF</a></p>
          </div>
        </div>

        <!-- Input Bar -->
        <div class="thread-input">
          <div class="input-wrap">
            <button class="btn-ghost icon-only">
              <span class="material-symbols-outlined">add_circle</span>
            </button>
            <textarea
              v-model="newMessage"
              class="message-textarea"
              placeholder="Type your message..."
              rows="1"
              @keydown.enter.prevent="sendMessage"
            />
            <button class="send-btn" :disabled="!newMessage.trim()" @click="sendMessage">
              <span class="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Right Insights Sidebar -->
      <aside class="hiring-right-sidebar">
        <div class="glass-card-static sidebar-card">
          <h3 class="sidebar-section-title">Project Snapshot</h3>
          <div class="snapshot-map">
            <span class="material-symbols-outlined" style="font-size:3rem;color:var(--primary);opacity:0.3">public</span>
            <p class="snapshot-label">SKYLINE ARCHITECTURE</p>
          </div>
          <div class="fit-score">
            <div class="fit-score-row">
              <span class="fit-label">Technical Fit</span>
              <span class="fit-value">98%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-bar-fill" style="width:98%" />
            </div>
          </div>
        </div>

        <div class="glass-card-static sidebar-card tip-card">
          <h3 class="tip-title">GFD Tip</h3>
          <p class="tip-text">Skyline Systems typically processes offer acceptances within 2 hours. Review the 'Equity' clause in section 4.2 before signing.</p>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/store/auth'
import { useCurrencyStore } from '@/store/currency'
import GfdButton from '@/components/ui/GfdButton.vue'

const authStore     = useAuthStore()
const currencyStore = useCurrencyStore()
const { user }  = storeToRefs(authStore)

const activeApp     = ref(1)
const selectedSlot  = ref('')
const slotConfirmed = ref(false)
const offerDecided  = ref(null)
const newMessage    = ref('')
const messagesEl    = ref(null)

const userInitials = computed(() => {
  const name = user.value?.name || 'GFD'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const applications = [
  { id: 1, title: 'Cloud Architect',  company: 'Skyline Systems' },
  { id: 2, title: 'Full-Stack Dev',   company: 'Vortex Media' },
]

const timeSlots = [
  'Oct 14, 10:00 AM – 11:00 AM',
  'Oct 15, 02:00 PM – 03:00 PM',
]

function sendMessage() {
  if (!newMessage.value.trim()) return
  newMessage.value = ''
  nextTick(() => {
    if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight
  })
}
</script>

<style scoped>
.hiring-view { background: var(--background); min-height: 100vh; padding: 1rem 0 2rem; }

.hiring-inner {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding-top: 1rem;
  padding-bottom: 2rem;
  height: calc(100vh - 80px);
}

@media (min-width: 1024px) {
  .hiring-inner { grid-template-columns: 220px 1fr 240px; }
}

/* Sidebars */
.hiring-sidebar,
.hiring-right-sidebar { display: none; }

@media (min-width: 1024px) {
  .hiring-sidebar,
  .hiring-right-sidebar { display: flex; flex-direction: column; gap: 1rem; }
}

.sidebar-card { padding: 1.25rem; border-radius: var(--radius-xl); }

.sidebar-section-title {
  font-family: var(--font-headline);
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--outline);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 1rem;
}

.app-list { display: flex; flex-direction: column; gap: 0.375rem; }

.app-item {
  padding: 0.75rem;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.15s ease;
}

.app-item:hover { background: var(--surface-container-low); }
.app-item.active { background: rgba(168,85,247,0.08); }

.app-title { font-family: var(--font-headline); font-size: 0.875rem; font-weight: 700; color: var(--primary); }
.app-company { font-size: 0.75rem; color: var(--on-surface-variant); margin-top: 1px; }

/* Main Thread */
.hiring-main {
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-xl);
  overflow: hidden;
  height: 100%;
}

.thread-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--outline-variant);
  background: var(--surface-container-lowest);
  flex-wrap: wrap;
  gap: 0.75rem;
}

.thread-company { display: flex; align-items: center; gap: 1rem; }

.company-icon-wrap {
  width: 48px; height: 48px; border-radius: var(--radius-xl);
  background: var(--surface-container);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.company-name { font-family: var(--font-headline); font-size: 1.25rem; font-weight: 700; color: var(--on-surface); }
.project-name { font-size: 0.8rem; color: var(--on-surface-variant); margin-top: 1px; }

.negotiation-badge {
  padding: 0.25rem 0.75rem;
  background: var(--tertiary-fixed);
  color: var(--on-tertiary-fixed-variant);
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

/* Messages */
.thread-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  background: var(--surface-container-low);
}

.milestone-marker {
  display: flex;
  justify-content: center;
}

.milestone-marker::before {
  content: attr(data-label);
}

.milestone-marker {
  font-family: var(--font-headline);
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--outline);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: var(--surface-container-lowest);
  padding: 0.25rem 1rem;
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-sm);
  align-self: center;
}

.msg-row { display: flex; align-items: flex-end; gap: 0.75rem; max-width: 80%; }
.msg-row.msg-mine { align-self: flex-end; flex-direction: row-reverse; }

.msg-avatar {
  width: 32px; height: 32px; border-radius: var(--radius-full);
  background: var(--surface-container);
  color: var(--primary);
  font-family: var(--font-headline); font-size: 0.75rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}

.msg-avatar.mine { background: var(--primary-fixed); }

.msg-bubble {
  padding: 0.875rem 1rem;
  border-radius: var(--radius-xl);
  font-size: 0.9rem;
  line-height: 1.6;
}

.bubble-theirs {
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-bottom-left-radius: var(--radius-sm);
  color: var(--on-surface);
}

.bubble-mine {
  background: var(--gradient-primary);
  color: #fff;
  border-bottom-right-radius: var(--radius-sm);
}

.msg-time {
  display: block;
  font-size: 0.65rem;
  opacity: 0.6;
  margin-top: 0.35rem;
  text-align: right;
}

/* Special Cards */
.special-card {
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-left: 4px solid var(--primary);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  max-width: 480px;
  align-self: flex-start;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.special-card-header { display: flex; align-items: center; gap: 0.75rem; }

.special-icon-wrap {
  width: 40px; height: 40px; border-radius: var(--radius-full);
  background: rgba(168,85,247,0.1);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}

.special-card-title { font-family: var(--font-headline); font-size: 1.1rem; font-weight: 700; color: var(--on-surface); }
.special-card-desc  { font-size: 0.875rem; color: var(--on-surface-variant); line-height: 1.6; }

.time-slots { display: flex; flex-direction: column; gap: 0.5rem; }

.slots-label {
  font-family: var(--font-headline);
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--outline);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 0.25rem;
}

.time-slot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: var(--surface-container-low);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-lg);
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--on-surface);
  cursor: pointer;
  transition: all 0.15s ease;
}

.time-slot:hover { border-color: var(--primary); background: rgba(168,85,247,0.04); }
.time-slot.selected { border-color: var(--primary); background: rgba(168,85,247,0.07); color: var(--primary); }

.slot-check { font-size: 20px; color: var(--outline-variant); }
.time-slot.selected .slot-check { color: var(--primary); }

.slot-confirmed {
  display: flex; align-items: center; gap: 0.5rem;
  font-family: var(--font-headline); font-size: 0.875rem; font-weight: 600; color: #16a34a;
}

/* Offer Card */
.offer-card {
  align-self: center;
  max-width: 520px;
  width: 100%;
  border-left: none;
  border: 1px solid rgba(168,85,247,0.3);
  box-shadow: 0 8px 32px rgba(168,85,247,0.1);
  position: relative;
}

.offer-badge {
  position: absolute;
  top: 1rem; right: 1rem;
  padding: 0.2rem 0.75rem;
  background: var(--primary);
  color: var(--on-primary);
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.offer-header { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 0.75rem; }

.offer-icon-wrap {
  width: 64px; height: 64px; border-radius: var(--radius-xl);
  background: var(--primary);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 20px rgba(168,85,247,0.3);
}

.offer-title { font-family: var(--font-headline); font-size: 1.25rem; font-weight: 700; color: var(--on-surface); }
.offer-desc  { font-size: 0.875rem; color: var(--on-surface-variant); line-height: 1.6; }

.offer-terms {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.offer-term {
  padding: 1rem;
  background: var(--surface-container);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-xl);
  text-align: center;
}

.term-label { font-family: var(--font-headline); font-size: 0.7rem; font-weight: 700; color: var(--outline); text-transform: uppercase; letter-spacing: 0.06em; }
.term-value { font-family: var(--font-headline); font-size: 1.375rem; font-weight: 700; color: var(--on-surface); margin-top: 0.25rem; }
.term-unit  { font-size: 0.875rem; font-weight: 400; color: var(--on-surface-variant); }

.offer-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }

.offer-accept { justify-content: center; }

.offer-decline {
  padding: 0.75rem;
  background: var(--surface-container-high);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-lg);
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--on-surface-variant);
  cursor: pointer;
  transition: all 0.15s ease;
}

.offer-decline:hover { background: var(--error-container); color: var(--error); border-color: rgba(186,26,26,0.3); }

.offer-result {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.875rem 1rem;
  border-radius: var(--radius-lg);
  font-family: var(--font-headline); font-size: 0.875rem; font-weight: 700;
}

.offer-result.accepted { background: rgba(22,163,74,0.08); color: #16a34a; border: 1px solid rgba(22,163,74,0.2); }
.offer-result.declined  { background: var(--error-container); color: var(--error); border: 1px solid rgba(186,26,26,0.2); }

.offer-expiry { font-size: 0.75rem; color: var(--outline); text-align: center; font-style: italic; }
.offer-link   { color: var(--primary); font-weight: 700; text-decoration: none; }

/* Input Bar */
.thread-input {
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--outline-variant);
  background: var(--surface-container-lowest);
}

.input-wrap {
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
  background: var(--surface-container-low);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-xl);
  padding: 0.5rem 0.5rem 0.5rem 0.75rem;
}

.message-textarea {
  flex: 1;
  background: transparent;
  border: none;
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--on-surface);
  resize: none;
  outline: none;
  line-height: 1.5;
  max-height: 120px;
  overflow-y: auto;
}

.message-textarea::placeholder { color: var(--outline); }

.send-btn {
  width: 36px; height: 36px;
  background: var(--primary);
  color: var(--on-primary);
  border: none;
  border-radius: var(--radius-lg);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: opacity 0.15s ease;
  flex-shrink: 0;
}

.send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.send-btn .material-symbols-outlined { font-size: 18px; }

/* Right Sidebar */
.snapshot-map {
  height: 120px;
  background: var(--surface-container);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;
}

.snapshot-label {
  font-family: var(--font-headline);
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--outline);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  position: absolute;
  bottom: 0.5rem;
  left: 0.75rem;
}

.fit-score-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.35rem;
}

.fit-label { font-size: 0.75rem; color: var(--on-surface-variant); }
.fit-value { font-family: var(--font-headline); font-size: 0.875rem; font-weight: 700; color: var(--primary); }

.tip-card { background: rgba(168,85,247,0.04) !important; border-color: rgba(168,85,247,0.15) !important; }
.tip-title { font-family: var(--font-headline); font-size: 0.75rem; font-weight: 700; color: var(--primary); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.5rem; }
.tip-text  { font-size: 0.8rem; color: var(--on-surface-variant); line-height: 1.6; }
</style>
