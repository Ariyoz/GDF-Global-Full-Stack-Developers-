<template>
  <div class="profile-view">

    <!-- Profile Header Card -->
    <div class="glass-card profile-header-card">
      <div class="profile-avatar-lg" @click="triggerAvatarUpload" title="Click to change photo">
        <img v-if="profile?.avatar" :src="profile.avatar" alt="Avatar" class="avatar-img" />
        <span v-else>{{ userInitials }}</span>
        <div class="avatar-overlay">
          <span class="material-symbols-outlined" style="font-size:20px;">photo_camera</span>
        </div>
        <input ref="avatarInput" type="file" accept="image/jpeg,image/png,image/webp" class="hidden-input" @change="handleAvatarUpload" />
      </div>
      <div class="profile-meta">
        <h2 class="profile-name">{{ profile?.full_name || 'Developer' }}</h2>
        <p class="profile-title">{{ profile?.experience_level || profile?.role || 'Member' }}</p>
        <p class="profile-email">{{ profile?.email }}</p>
        <p v-if="profile?.location" class="profile-location">
          <span class="material-symbols-outlined" style="font-size:16px">location_on</span>
          {{ profile.location }}
        </p>
        <div class="profile-badges">
          <GfdBadge variant="success">{{ profile?.role || 'Developer' }}</GfdBadge>
          <RouterLink :to="`/developer/${profile?.id}`" class="btn-ghost view-public-btn">
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
          <GfdInput v-model="form.full_name" label="Full Name" placeholder="Your name" />
          <GfdInput v-model="form.email" label="Email" type="email" placeholder="your@email.com" disabled />
        </div>
        <div class="form-row">
          <GfdInput v-model="form.experience_level" label="Job Title" placeholder="Senior Full-Stack Engineer" />
          <div class="form-field-wrap">
            <label class="input-label">Location</label>
            <select v-model="form.location" class="country-select">
              <option value="">Select country…</option>
              <option v-for="c in COUNTRIES" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>
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
          <div class="form-field-wrap">
            <label class="input-label">GitHub</label>
            <div class="prefix-input-wrap">
              <span class="input-prefix">github.com/</span>
              <input v-model="form.github_url" name="github_url" autocomplete="url" class="prefix-input" placeholder="username" @input="fixGithub" />
            </div>
          </div>
          <div class="form-field-wrap">
            <label class="input-label">LinkedIn</label>
            <div class="prefix-input-wrap">
              <span class="input-prefix">linkedin.com/in/</span>
              <input v-model="form.linkedin_url" name="linkedin_url" autocomplete="url" class="prefix-input" placeholder="username" @input="fixLinkedin" />
            </div>
          </div>
        </div>
        <div class="form-row">
          <GfdInput v-model="form.portfolio" label="Portfolio Website" placeholder="https://yourportfolio.com" />
        </div>

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
import { ref, reactive, computed, watch } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useUiStore }   from '@/store/ui'
import GfdInput  from '@/components/ui/GfdInput.vue'
import GfdButton from '@/components/ui/GfdButton.vue'
import GfdBadge  from '@/components/ui/GfdBadge.vue'

const authStore = useAuthStore()
const uiStore   = useUiStore()

const profile = computed(() => authStore.profile)

const saving      = ref(false)
const skillInput  = ref('')
const skillsFocused = ref(false)
const avatarInput = ref(null)

function triggerAvatarUpload() {
  avatarInput.value?.click()
}

async function handleAvatarUpload(e) {
  const file = e.target.files?.[0]
  if (!file) return

  // Validate file type
  const allowed = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowed.includes(file.type)) {
    uiStore.showError('Only JPG, PNG, and WEBP images are allowed')
    return
  }

  // Validate size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    uiStore.showError('Image must be under 5MB')
    return
  }

  try {
    await authStore.uploadAvatar(file)
    uiStore.showSuccess('Profile photo updated!')
  } catch {
    uiStore.showError('Failed to upload photo')
  }

  // Reset input
  if (avatarInput.value) avatarInput.value.value = ''
}

const form = reactive({
  full_name:        profile.value?.full_name || '',
  email:            profile.value?.email || '',
  experience_level: profile.value?.experience_level || '',
  location:         profile.value?.location || '',
  bio:              profile.value?.bio || '',
  skills:           Array.isArray(profile.value?.skills) ? [...profile.value.skills] : [],
  available:        profile.value?.available !== false,
  github_url:       _stripPrefix(profile.value?.github_url, 'https://github.com/'),
  linkedin_url:     _stripPrefix(profile.value?.linkedin_url, 'https://www.linkedin.com/in/'),
  portfolio:        profile.value?.portfolio || '',
})

function _stripPrefix(url, prefix) {
  if (!url) return ''
  return url.replace(prefix, '').replace('https://github.com/', '').replace('https://linkedin.com/in/', '').replace('linkedin.com/in/', '').replace('github.com/', '')
}

function fixGithub() {
  form.github_url = form.github_url.replace(/https?:\/\/(www\.)?github\.com\//g, '').replace(/^\//, '')
}

function fixLinkedin() {
  form.linkedin_url = form.linkedin_url.replace(/https?:\/\/(www\.)?linkedin\.com\/in\//g, '').replace(/^\//, '')
}

const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Andorra','Angola','Argentina','Armenia','Australia',
  'Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Belarus','Belgium','Belize',
  'Benin','Bhutan','Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei',
  'Bulgaria','Burkina Faso','Burundi','Cambodia','Cameroon','Canada','Cape Verde',
  'Central African Republic','Chad','Chile','China','Colombia','Comoros','Congo',
  'Costa Rica','Croatia','Cuba','Cyprus','Czech Republic','Denmark','Djibouti',
  'Dominican Republic','DR Congo','Ecuador','Egypt','El Salvador','Equatorial Guinea',
  'Eritrea','Estonia','Eswatini','Ethiopia','Fiji','Finland','France','Gabon','Gambia',
  'Georgia','Germany','Ghana','Greece','Guatemala','Guinea','Guinea-Bissau','Guyana',
  'Haiti','Honduras','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland',
  'Israel','Italy','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kuwait','Kyrgyzstan',
  'Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein','Lithuania',
  'Luxembourg','Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Mauritania',
  'Mauritius','Mexico','Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique',
  'Myanmar','Namibia','Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria',
  'North Korea','North Macedonia','Norway','Oman','Pakistan','Panama','Papua New Guinea',
  'Paraguay','Peru','Philippines','Poland','Portugal','Qatar','Romania','Russia','Rwanda',
  'Saudi Arabia','Senegal','Serbia','Sierra Leone','Singapore','Slovakia','Slovenia',
  'Somalia','South Africa','South Korea','South Sudan','Spain','Sri Lanka','Sudan',
  'Sweden','Switzerland','Syria','Taiwan','Tajikistan','Tanzania','Thailand','Togo',
  'Trinidad and Tobago','Tunisia','Turkey','Turkmenistan','Uganda','Ukraine',
  'United Arab Emirates','United Kingdom','United States','Uruguay','Uzbekistan',
  'Venezuela','Vietnam','Yemen','Zambia','Zimbabwe',
]

// Sync form when profile loads/changes
watch(profile, (p) => {
  if (p) {
    form.full_name = p.full_name || ''
    form.email = p.email || ''
    form.experience_level = p.experience_level || ''
    form.location = p.location || ''
    form.bio = p.bio || ''
    form.skills = Array.isArray(p.skills) ? [...p.skills] : []
    form.available = p.available !== false
    form.github_url = _stripPrefix(p.github_url, 'https://github.com/')
    form.linkedin_url = _stripPrefix(p.linkedin_url, 'https://www.linkedin.com/in/')
    form.portfolio = p.portfolio || ''
  }
}, { immediate: true })

const userInitials = computed(() => {
  const name = profile.value?.full_name || 'GFD'
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
  try {
    await authStore.updateProfile({
      full_name:        form.full_name,
      experience_level: form.experience_level,
      location:         form.location,
      bio:              form.bio,
      skills:           [...form.skills],
      available:        form.available,
      github_url:       form.github_url ? `https://github.com/${form.github_url}` : '',
      linkedin_url:     form.linkedin_url ? `https://www.linkedin.com/in/${form.linkedin_url}` : '',
      portfolio:        form.portfolio,
    })
    uiStore.showSuccess('Profile updated!')
  } catch {
    uiStore.showError('Failed to save profile.')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.profile-view { display: flex; flex-direction: column; gap: 1.25rem; }

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
  position: relative;
  cursor: pointer;
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--radius-xl);
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  opacity: 0;
  transition: opacity 0.2s ease;
  border-radius: var(--radius-xl);
}

.profile-avatar-lg:hover .avatar-overlay {
  opacity: 1;
}

.hidden-input {
  display: none;
}

.profile-meta { display: flex; flex-direction: column; gap: 0.3rem; flex: 1; min-width: 0; }

.profile-name { font-family: var(--font-headline); font-size: 1.25rem; font-weight: 700; color: var(--on-surface); }
.profile-title { font-size: 0.9rem; color: var(--primary); font-weight: 500; }
.profile-email { font-size: 0.8rem; color: var(--on-surface-variant); }
.profile-location { display: inline-flex; align-items: center; gap: 0.2rem; font-size: 0.8rem; color: var(--on-surface-variant); }

.profile-badges { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; margin-top: 0.25rem; }

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

.form-row { display: grid; grid-template-columns: 1fr; gap: 1.25rem; }
@media (min-width: 640px) { .form-row { grid-template-columns: 1fr 1fr; } }

.form-actions { display: flex; justify-content: flex-end; padding-top: 0.25rem; }

.field-label { font-family: var(--font-headline); font-size: 0.875rem; font-weight: 500; color: var(--on-surface); display: block; margin-bottom: 0.4rem; }
.field-hint { font-size: 0.72rem; font-weight: 400; color: var(--on-surface-variant); margin-left: 0.4rem; }
.field-hint-block { font-size: 0.78rem; color: var(--on-surface-variant); margin-top: 0.15rem; }

.skills-field { display: flex; flex-direction: column; }

.skills-input-wrap {
  display: flex; flex-wrap: wrap; gap: 0.375rem; align-items: center;
  padding: 0.5rem 0.75rem; background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant); border-radius: var(--radius-lg);
  min-height: 46px; cursor: text; transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.skills-input-wrap.focused { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(168,85,247,0.1); }

.skill-tag {
  display: inline-flex; align-items: center; gap: 0.2rem;
  padding: 0.2rem 0.5rem 0.2rem 0.625rem;
  background: rgba(168,85,247,0.12); border: 1px solid rgba(168,85,247,0.25);
  border-radius: var(--radius-full); font-family: var(--font-headline);
  font-size: 0.75rem; font-weight: 600; color: var(--primary);
}

.skill-remove { background: none; border: none; cursor: pointer; color: var(--primary); display: flex; align-items: center; padding: 0; opacity: 0.7; }
.skill-remove:hover { opacity: 1; }

.skills-input { flex: 1; min-width: 100px; border: none; background: transparent; font-family: var(--font-body); font-size: 0.875rem; color: var(--on-surface); outline: none; }
.skills-input::placeholder { color: var(--outline); }

.availability-row {
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  padding: 0.875rem 1rem; background: var(--surface-container-low);
  border: 1px solid var(--outline-variant); border-radius: var(--radius-lg);
}

.toggle-btn { width: 44px; height: 24px; border-radius: var(--radius-full); background: var(--surface-container-high); border: none; cursor: pointer; position: relative; transition: background 0.2s ease; flex-shrink: 0; }
.toggle-btn.on { background: var(--primary); }

.toggle-knob { position: absolute; top: 2px; left: 2px; width: 20px; height: 20px; border-radius: 50%; background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.2); transition: transform 0.2s ease; display: block; }
.toggle-btn.on .toggle-knob { transform: translateX(20px); }

/* ── Country select & prefix inputs ── */
.form-field-wrap { display: flex; flex-direction: column; gap: 0.3rem; flex: 1; min-width: 0; }
.input-label { font-family: var(--font-headline); font-size: 0.8rem; font-weight: 600; color: var(--on-surface); }
.country-select {
  width: 100%; padding: 0.65rem 0.875rem;
  background: var(--surface-container-low);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-lg);
  font-size: 0.875rem; color: var(--on-surface);
  outline: none; cursor: pointer;
}
.country-select:focus { border-color: var(--primary); }

.prefix-input-wrap {
  display: flex; align-items: center;
  background: var(--surface-container-low);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-lg);
  overflow: hidden;
}
.prefix-input-wrap:focus-within { border-color: var(--primary); }
.input-prefix {
  padding: 0 0.6rem 0 0.875rem;
  font-size: 0.82rem; color: var(--on-surface-variant);
  white-space: nowrap; flex-shrink: 0;
  border-right: 1px solid var(--outline-variant);
  background: var(--surface-container);
  line-height: 2.6rem;
}
.prefix-input {
  flex: 1; padding: 0.65rem 0.875rem;
  background: transparent; border: none; outline: none;
  font-size: 0.875rem; color: var(--on-surface);
  min-width: 0;
}
</style>
