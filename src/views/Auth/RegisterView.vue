<template>
  <div class="auth-card glass-modal">
    <div class="auth-head">
      <h1 class="auth-title">Join GFD</h1>
      <p class="auth-sub">Create your account and start building</p>
    </div>

    <form class="auth-form" @submit.prevent="handleRegister" novalidate>

      <!-- Basic Info -->
      <GfdInput
        v-model="form.name"
        label="Full Name"
        placeholder="Alex Morgan"
        :error="errors.name"
        required
      />
      <GfdInput
        v-model="form.email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        :error="errors.email"
        required
      />
      <GfdInput
        v-model="form.password"
        label="Password"
        type="password"
        placeholder="Min. 8 characters"
        :error="errors.password"
        required
      />

      <!-- Role selector -->
      <div class="role-field">
        <label class="field-label">I am a</label>
        <div class="role-options">
          <button
            v-for="r in roles"
            :key="r.value"
            type="button"
            class="role-btn"
            :class="{ active: form.role === r.value }"
            @click="form.role = r.value"
          >
            <span class="material-symbols-outlined role-icon">{{ r.icon }}</span>
            <span>{{ r.label }}</span>
          </button>
        </div>
      </div>

      <!-- Developer profile fields — only shown for developers -->
      <template v-if="form.role === 'developer'">
        <div class="section-divider">
          <span class="section-divider-label">Your Developer Profile</span>
        </div>

        <div class="form-row">
          <GfdInput
            v-model="form.jobTitle"
            label="Job Title"
            placeholder="Senior Full-Stack Engineer"
            :error="errors.jobTitle"
            required
          />
          <GfdInput
            v-model="form.location"
            label="Location"
            placeholder="San Francisco, CA"
            :error="errors.location"
            required
          />
        </div>

        <!-- Skills tag input -->
        <div class="skills-field">
          <label class="field-label">
            Skills
            <span class="field-hint">Press Enter or comma to add · max 10</span>
          </label>
          <div
            class="skills-input-wrap"
            :class="{ focused: skillsFocused }"
            @click="skillsInputEl?.focus()"
          >
            <span v-for="skill in form.skills" :key="skill" class="skill-tag">
              {{ skill }}
              <button type="button" class="skill-remove" @click.stop="removeSkill(skill)">
                <span class="material-symbols-outlined" style="font-size:13px">close</span>
              </button>
            </span>
            <input
              ref="skillsInputEl"
              v-model="skillInput"
              class="skills-input"
              placeholder="e.g. React, Node.js, Python..."
              @focus="skillsFocused = true"
              @blur="onSkillBlur"
              @keydown="onSkillKeydown"
            />
          </div>
          <p v-if="form.skills.length === 0" class="field-hint-block">
            Add at least one skill to appear in search results
          </p>
        </div>

        <GfdInput
          v-model="form.bio"
          label="About You"
          type="textarea"
          placeholder="Tell the community about your expertise and what you build..."
          :rows="3"
        />

        <div class="form-row">
          <GfdInput v-model="form.github"   label="GitHub"   prefix="github.com/"     placeholder="username" />
          <GfdInput v-model="form.linkedin" label="LinkedIn" prefix="linkedin.com/in/" placeholder="username" />
        </div>
        <GfdInput v-model="form.website" label="Website" placeholder="https://yoursite.com" />
      </template>

      <!-- Client fields -->
      <template v-else>
        <div class="section-divider">
          <span class="section-divider-label">Your Details</span>
        </div>
        <div class="form-row">
          <GfdInput
            v-model="form.company"
            label="Company"
            placeholder="Your company name"
          />
          <GfdInput
            v-model="form.location"
            label="Location"
            placeholder="City, Country"
            :error="errors.location"
          />
        </div>
      </template>

      <GfdButton type="submit" variant="primary" :loading="loading" full>
        Create Account
      </GfdButton>
    </form>

    <p class="auth-footer">
      Already have an account?
      <RouterLink to="/auth/login" class="auth-link">Sign in →</RouterLink>
    </p>

    <p class="auth-terms">
      By creating an account you agree to our
      <a href="#" class="auth-link">Terms of Service</a> and
      <RouterLink to="/privacy-policy" class="auth-link">Privacy Policy</RouterLink>.
    </p>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter }    from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useUiStore }   from '@/store/ui'
import GfdInput  from '@/components/ui/GfdInput.vue'
import GfdButton from '@/components/ui/GfdButton.vue'

const router    = useRouter()
const authStore = useAuthStore()
const uiStore   = useUiStore()

const loading       = ref(false)
const skillInput    = ref('')
const skillsFocused = ref(false)
const skillsInputEl = ref(null)

const form = reactive({
  name:     '',
  email:    '',
  password: '',
  role:     'developer',
  jobTitle: '',
  location: '',
  company:  '',
  bio:      '',
  skills:   [],
  github:   '',
  linkedin: '',
  website:  '',
})

const errors = reactive({
  name:     '',
  email:    '',
  password: '',
  jobTitle: '',
  location: '',
})

const roles = [
  { value: 'developer', icon: 'code',     label: 'Developer' },
  { value: 'client',    icon: 'business', label: 'Client'    },
]

// ── Skills helpers ──
function addSkill() {
  const s = skillInput.value.replace(/,/g, '').trim()
  if (s && !form.skills.includes(s) && form.skills.length < 10) {
    form.skills.push(s)
  }
  skillInput.value = ''
}

function removeSkill(skill) {
  const idx = form.skills.indexOf(skill)
  if (idx !== -1) form.skills.splice(idx, 1)
}

function onSkillKeydown(e) {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault()
    addSkill()
  }
  // Backspace on empty input removes last tag
  if (e.key === 'Backspace' && !skillInput.value && form.skills.length) {
    form.skills.splice(form.skills.length - 1, 1)
  }
}

function onSkillBlur() {
  skillsFocused.value = false
  // Add whatever is typed when user leaves the field
  if (skillInput.value.trim()) addSkill()
}

// ── Validation ──
function validate() {
  errors.name = errors.email = errors.password = errors.jobTitle = errors.location = ''
  let ok = true
  if (!form.name.trim())                          { errors.name     = 'Name is required';       ok = false }
  if (!form.email.trim())                         { errors.email    = 'Email is required';      ok = false }
  if (!form.password || form.password.length < 8) { errors.password = 'Min. 8 characters';     ok = false }
  if (form.role === 'developer') {
    if (!form.jobTitle.trim()) { errors.jobTitle = 'Job title is required'; ok = false }
    if (!form.location.trim()) { errors.location = 'Location is required';  ok = false }
  }
  return ok
}

// ── Submit ──
async function handleRegister() {
  if (!validate()) return
  loading.value = true
  try {
    await authStore.register(form)
    uiStore.showSuccess('Account created! Welcome to GFD.')
    router.push('/dashboard')
  } catch {
    uiStore.showError(authStore.error || 'Registration failed. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-card { padding: 2rem; width: 100%; }

.auth-head { text-align: center; margin-bottom: 1.75rem; }

.auth-title {
  font-family: var(--font-headline);
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--on-surface);
  letter-spacing: -0.02em;
}

.auth-sub { font-size: 0.9rem; color: var(--on-surface-variant); margin-top: 0.35rem; }

.auth-form { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.25rem; }

/* ── Role selector ── */
.role-field { display: flex; flex-direction: column; gap: 0.5rem; }

.field-label {
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--on-surface);
}

.field-hint {
  font-size: 0.72rem;
  font-weight: 400;
  color: var(--on-surface-variant);
  margin-left: 0.35rem;
}

.field-hint-block {
  font-size: 0.75rem;
  color: var(--on-surface-variant);
  margin-top: 0.25rem;
}

.role-options { display: grid; grid-template-columns: 1fr 1fr; gap: 0.625rem; }

.role-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-lg);
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--on-surface-variant);
  cursor: pointer;
  transition: var(--transition-fast);
}

.role-btn:hover { border-color: var(--primary); color: var(--primary); }

.role-btn.active {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--primary-fixed);
}

.role-icon { font-size: 18px; }

/* ── Section divider ── */
.section-divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0.25rem 0;
}

.section-divider::before,
.section-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--outline-variant);
}

.section-divider-label {
  font-family: var(--font-headline);
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--on-surface-variant);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  white-space: nowrap;
}

/* ── Form row ── */
.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
@media (min-width: 480px) {
  .form-row { grid-template-columns: 1fr 1fr; }
}

/* ── Skills tag input ── */
.skills-field { display: flex; flex-direction: column; gap: 0.4rem; }

.skills-input-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-lg);
  min-height: 46px;
  cursor: text;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.skills-input-wrap.focused {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(168,85,247,0.1);
}

.skill-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  padding: 0.2rem 0.5rem 0.2rem 0.625rem;
  background: rgba(168,85,247,0.12);
  border: 1px solid rgba(168,85,247,0.25);
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--primary);
}

.skill-remove {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--primary);
  display: flex;
  align-items: center;
  padding: 0;
  opacity: 0.65;
  transition: opacity 0.15s;
}
.skill-remove:hover { opacity: 1; }

.skills-input {
  flex: 1;
  min-width: 100px;
  border: none;
  background: transparent;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--on-surface);
  outline: none;
}
.skills-input::placeholder { color: var(--outline); }

/* ── Footer ── */
.auth-footer {
  text-align: center;
  font-size: 0.875rem;
  color: var(--on-surface-variant);
  margin-bottom: 0.75rem;
}

.auth-link {
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--primary);
  text-decoration: none;
}
.auth-link:hover { text-decoration: underline; }

.auth-terms {
  text-align: center;
  font-size: 0.78rem;
  color: var(--on-surface-variant);
  line-height: 1.5;
}
</style>
