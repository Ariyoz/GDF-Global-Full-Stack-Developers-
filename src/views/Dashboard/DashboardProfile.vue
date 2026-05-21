<template>
  <div class="profile-view">

    <!-- Profile Header Card -->
    <div class="glass-card profile-header-card">
      <div class="profile-avatar-lg">{{ userInitials }}</div>
      <div class="profile-meta">
        <h2 class="profile-name">{{ user?.name || 'Developer' }}</h2>
        <p class="profile-title">{{ user?.jobTitle || user?.role || 'Member' }}</p>
        <p class="profile-email">{{ user?.email }}</p>
        <p v-if="user?.location" class="profile-location">
          <span class="material-symbols-outlined" style="font-size:16px">location_on</span>
          {{ user.location }}
        </p>
        <div class="profile-badges">
          <GfdBadge variant="success">{{ user?.role || 'Developer' }}</GfdBadge>
          <RouterLink :to="`/developer/${user?.id}`" class="btn-ghost view-public-btn">
            <span class="material-symbols-outlined" style="font-size:15px">open_in_new</span>
            View Public Profile
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Edit Form -->
    <div class="glass-card-static profile-form-card">
      <h3 class="form-section-title">Edit Profile</h3>
      <form class="profile-form" @submit.prevent="handleSave">

        <div class="form-row">
          <GfdInput v-model="form.name"     label="Full Name"  placeholder="Your name" />
          <GfdInput v-model="form.email"    label="Email"      type="email" placeholder="your@email.com" />
        </div>
        <div class="form-row">
          <GfdInput v-model="form.jobTitle" label="Job Title"  placeholder="Senior Full-Stack Engineer" />
          <GfdInput v-model="form.location" label="Location"   placeholder="City, Country" />
        </div>

        <GfdInput v-model="form.bio" label="Bio" type="textarea" placeholder="Tell the community about your expertise..." :rows="3" />

        <!-- Skills tag input -->
        <div class="skills-field">
          <label class="field-label">
            Skills
            <span class="field-hint">Press Enter or comma to add · max 10</span>
          </label>
          <div class="skills-input-wrap" :class="{ focused: skillsFocused }">
            <span v-for="skill in form.skills" :key="skill" class="skill-tag">
              {{ skill }}
              <button type="button" class="skill-remove" @click="removeSkill(skill)">
                <span class="material-symbols-outlined" style="font-size:13px">close</span>
              </button>
            </span>
            <input
              v-model="skillInput"
              class="skills-input"
              placeholder="e.g. React, Node.js..."
              @focus="skillsFocused = true"
              @blur="onSkillBlur"
              @keydown="onSkillKeydown"
            />
          </div>
        </div>

        <!-- Availability toggle -->
        <div class="availability-row">
          <div>
            <p class="field-label">Available for hire</p>
            <p class="field-hint-block">Show as "Available" on your public profile</p>
          </div>
          <button
            type="button"
            class="toggle-btn"
            :class="{ on: form.available }"
            @click="form.available = !form.available"
          >
            <span class="toggle-knob" />
          </button>
        </div>

        <div class="form-row">
          <GfdInput v-model="form.github"   label="GitHub"   prefix="github.com/"    placeholder="username" />
          <GfdInput v-model="form.linkedin" label="LinkedIn" prefix="linkedin.com/in/" placeholder="username" />
        </div>
        <GfdInput v-model="form.website" label="Website" placeholder="https://yourportfolio.com" />

        <div class="form-actions">
          <GfdButton type="submit" variant="primary" :loading="saving">
            <span class="material-symbols-outlined" style="font-size:16px">save</span>
            Save Changes
          </GfdButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/store/auth'
import { useUiStore }   from '@/store/ui'
import GfdInput  from '@/components/ui/GfdInput.vue'
import GfdButton from '@/components/ui/GfdButton.vue'
import GfdBadge  from '@/components/ui/GfdBadge.vue'

const authStore = useAuthStore()
const uiStore   = useUiStore()
const { user }  = storeToRefs(authStore)

const saving      = ref(false)
const skillInput  = ref('')
const skillsFocused = ref(false)

// Parse existing skills — could be array or comma string
function parseSkills(raw) {
  if (Array.isArray(raw)) return [...raw]
  if (typeof raw === 'string' && raw.trim()) return raw.split(',').map(s => s.trim()).filter(Boolean)
  return []
}

const form = reactive({
  name:      user.value?.name      || '',
  email:     user.value?.email     || '',
  jobTitle:  user.value?.jobTitle  || '',
  location:  user.value?.location  || '',
  bio:       user.value?.bio       || '',
  skills:    parseSkills(user.value?.skills),
  available: user.value?.available !== false,
  github:    user.value?.github    || '',
  linkedin:  user.value?.linkedin  || '',
  website:   user.value?.website   || '',
})

const userInitials = computed(() => {
  const name = user.value?.name || 'GFD'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

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
  if (skillInput.value.trim()) addSkill()
}

async function handleSave() {
  saving.value = true
  await new Promise(r => setTimeout(r, 600))
  authStore.updateUser({
    name:      form.name,
    email:     form.email,
    jobTitle:  form.jobTitle,
    location:  form.location,
    bio:       form.bio,
    skills:    [...form.skills],
    available: form.available,
    github:    form.github,
    linkedin:  form.linkedin,
    website:   form.website,
  })
  saving.value = false
  uiStore.showSuccess('Profile updated! Your Explore card is now live.')
}
</script>

<style scoped>
.profile-view { display: flex; flex-direction: column; gap: 1.25rem; }

/* ── Header Card ── */
.profile-header-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.75rem;
  flex-wrap: wrap;
}

.profile-avatar-lg {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-xl);
  background: var(--primary-fixed);
  border: 2px solid rgba(168,85,247,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-headline);
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--primary);
  flex-shrink: 0;
}

.profile-meta { display: flex; flex-direction: column; gap: 0.3rem; flex: 1; min-width: 0; }

.profile-name {
  font-family: var(--font-headline);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--on-surface);
}

.profile-title { font-size: 0.9rem; color: var(--primary); font-weight: 500; }
.profile-email { font-size: 0.8rem; color: var(--on-surface-variant); }

.profile-location {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.8rem;
  color: var(--on-surface-variant);
}

.profile-badges {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 0.25rem;
}

.view-public-btn {
  font-size: 0.78rem;
  padding: 0.25rem 0.625rem;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  text-decoration: none;
  color: var(--primary);
  border: 1px solid var(--glass-border-primary);
  border-radius: var(--radius-full);
  transition: background 0.15s ease;
}
.view-public-btn:hover { background: rgba(168,85,247,0.08); }

/* ── Form Card ── */
.profile-form-card { padding: 1.75rem; border-radius: var(--radius-xl); }

.form-section-title {
  font-family: var(--font-headline);
  font-size: 1rem;
  font-weight: 700;
  color: var(--on-surface);
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--outline-variant);
}

.profile-form { display: flex; flex-direction: column; gap: 1.25rem; }

.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}
@media (min-width: 640px) { .form-row { grid-template-columns: 1fr 1fr; } }

.form-actions { display: flex; justify-content: flex-end; padding-top: 0.25rem; }

/* ── Field labels ── */
.field-label {
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--on-surface);
  display: block;
  margin-bottom: 0.4rem;
}

.field-hint {
  font-size: 0.72rem;
  font-weight: 400;
  color: var(--on-surface-variant);
  margin-left: 0.4rem;
}

.field-hint-block {
  font-size: 0.78rem;
  color: var(--on-surface-variant);
  margin-top: 0.15rem;
}

/* ── Skills tag input ── */
.skills-field { display: flex; flex-direction: column; }

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
  opacity: 0.7;
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

/* ── Availability toggle ── */
.availability-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.875rem 1rem;
  background: var(--surface-container-low);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-lg);
}

.toggle-btn {
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
.toggle-btn.on { background: var(--primary); }

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
.toggle-btn.on .toggle-knob { transform: translateX(20px); }
</style>
