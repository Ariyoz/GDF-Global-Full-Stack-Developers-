<template>
  <div class="settings-view">
    <div class="page-header">
      <h2 class="text-headline-md">Settings</h2>
      <p class="text-body-md" style="margin-top:0.25rem">Manage your account preferences.</p>
    </div>

    <!-- Tabs -->
    <div class="settings-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        class="settings-tab"
        :class="{ active: activeTab === tab.value }"
        @click="activeTab = tab.value"
      >
        <span class="material-symbols-outlined tab-icon">{{ tab.icon }}</span>
        {{ tab.label }}
      </button>
    </div>

    <!-- Profile Tab -->
    <div v-if="activeTab === 'profile'" class="tab-content">
      <div class="glass-card-static settings-card">
        <h3 class="settings-section-title">Profile Information</h3>

        <div class="avatar-upload">
          <div class="upload-avatar">
            <span class="upload-initials">{{ userInitials }}</span>
          </div>
          <div class="upload-info">
            <p class="upload-label">Profile Photo</p>
            <p class="upload-hint">JPG, PNG or GIF. Max 2MB.</p>
            <button class="btn-outline upload-btn">
              <span class="material-symbols-outlined" style="font-size:16px;">upload</span>
              Upload Photo
            </button>
          </div>
        </div>

        <div class="form-grid">
          <GfdInput v-model="profile.name"      label="Full Name"    placeholder="Your full name" />
          <GfdInput v-model="profile.email"     label="Email"        type="email" placeholder="your@email.com" />
          <GfdInput v-model="profile.jobTitle"  label="Job Title"    placeholder="e.g. Senior Full-Stack Developer" />
          <div class="form-field-wrap">
            <label class="field-label-sm">Location</label>
            <select v-model="profile.location" class="country-sel">
              <option value="">Select country…</option>
              <option v-for="c in COUNTRIES" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>
        </div>

        <GfdInput v-model="profile.bio" label="Bio" type="textarea" placeholder="Tell the world about yourself..." :rows="4" style="margin-top:1rem" />

        <div class="form-grid" style="margin-top:1rem">
          <div class="form-field-wrap">
            <label class="field-label-sm">GitHub</label>
            <div class="pfx-wrap">
              <span class="pfx">github.com/</span>
              <input v-model="profile.github" name="github" autocomplete="off" class="pfx-input" placeholder="username" @input="cleanGithub" />
            </div>
          </div>
          <div class="form-field-wrap">
            <label class="field-label-sm">LinkedIn</label>
            <div class="pfx-wrap">
              <span class="pfx">linkedin.com/in/</span>
              <input v-model="profile.linkedin" name="linkedin" autocomplete="off" class="pfx-input" placeholder="username" @input="cleanLinkedin" />
            </div>
          </div>
          <GfdInput v-model="profile.twitter"  label="Twitter"  placeholder="@username" />
          <GfdInput v-model="profile.website"  label="Website"  placeholder="https://yoursite.com" />
        </div>

        <div class="form-actions">
          <GfdButton variant="primary" :loading="saving" @click="saveProfile">Save Changes</GfdButton>
        </div>
      </div>
    </div>

    <!-- Security Tab -->
    <div v-if="activeTab === 'security'" class="tab-content">
      <div class="glass-card-static settings-card">
        <h3 class="settings-section-title">Change Password</h3>
        <div class="form-stack">
          <GfdInput v-model="security.current"  label="Current Password"  type="password" placeholder="••••••••" />
          <GfdInput v-model="security.newPass"   label="New Password"      type="password" placeholder="Min. 8 characters" />
          <GfdInput v-model="security.confirm"   label="Confirm Password"  type="password" placeholder="Repeat new password" />
        </div>
        <div class="form-actions">
          <GfdButton variant="primary" @click="changePassword">Update Password</GfdButton>
        </div>
      </div>

      <div class="glass-card-static settings-card">
        <h3 class="settings-section-title">Two-Factor Authentication</h3>
        <div class="toggle-row">
          <div>
            <p class="toggle-label">Enable 2FA</p>
            <p class="toggle-desc">Add an extra layer of security to your account.</p>
          </div>
          <button class="toggle-btn" :class="{ on: security.twoFA }" @click="security.twoFA = !security.twoFA">
            <span class="toggle-knob" />
          </button>
        </div>
      </div>

      <div class="glass-card-static settings-card">
        <h3 class="settings-section-title">Active Sessions</h3>
        <div class="sessions-list">
          <div v-for="session in sessions" :key="session.id" class="session-item">
            <div class="session-icon-wrap">
              <span class="material-symbols-outlined session-icon">{{ session.icon }}</span>
            </div>
            <div class="session-info">
              <p class="session-device">{{ session.device }}</p>
              <p class="session-meta">{{ session.location }} · {{ session.time }}</p>
            </div>
            <span v-if="session.current" class="chip chip-primary">Current</span>
            <button v-else class="btn-ghost session-revoke" @click="revokeSession(session)">Revoke</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Notifications Tab -->
    <div v-if="activeTab === 'notifications'" class="tab-content">
      <div class="glass-card-static settings-card">
        <h3 class="settings-section-title">Email Notifications</h3>
        <div class="toggle-list">
          <div v-for="item in emailNotifs" :key="item.key" class="toggle-row">
            <div>
              <p class="toggle-label">{{ item.label }}</p>
              <p class="toggle-desc">{{ item.desc }}</p>
            </div>
            <button class="toggle-btn" :class="{ on: item.enabled }" @click="item.enabled = !item.enabled">
              <span class="toggle-knob" />
            </button>
          </div>
        </div>
      </div>

      <div class="glass-card-static settings-card">
        <h3 class="settings-section-title">Push Notifications</h3>
        <div class="toggle-list">
          <div v-for="item in pushNotifs" :key="item.key" class="toggle-row">
            <div>
              <p class="toggle-label">{{ item.label }}</p>
              <p class="toggle-desc">{{ item.desc }}</p>
            </div>
            <button class="toggle-btn" :class="{ on: item.enabled }" @click="item.enabled = !item.enabled">
              <span class="toggle-knob" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Preferences Tab -->
    <div v-if="activeTab === 'preferences'" class="tab-content">
      <div class="glass-card-static settings-card">
        <h3 class="settings-section-title">Currency & Region</h3>
        <p class="settings-section-desc">
          Choose your display currency. All prices, earnings and wallet amounts will be shown in this currency.
        </p>

        <!-- Current selection banner -->
        <div class="curr-current">
          <div class="curr-flag-big">{{ currencyStore.current.symbol }}</div>
          <div>
            <p class="curr-sel-name">{{ currencyStore.current.name }}</p>
            <p class="curr-sel-code">{{ currencyStore.current.code }} · {{ currencyStore.current.country }}</p>
          </div>
          <span class="curr-active-chip">Active</span>
        </div>

        <!-- Search -->
        <div class="curr-search-wrap">
          <span class="material-symbols-outlined curr-search-ico">search</span>
          <input v-model="currSearch" name="currency_search" autocomplete="off" class="curr-search" placeholder="Search currency or country…" />
        </div>

        <!-- Currency grid -->
        <div class="curr-grid">
          <button
            v-for="c in filteredCurrencies" :key="c.code"
            class="curr-btn"
            :class="{ active: currencyStore.code === c.code }"
            @click="selectCurrency(c.code)"
          >
            <div class="curr-symbol">{{ c.symbol }}</div>
            <div class="curr-info">
              <p class="curr-code">{{ c.code }}</p>
              <p class="curr-name">{{ c.name }}</p>
              <p class="curr-country">{{ c.country }}</p>
            </div>
            <span v-if="currencyStore.code === c.code" class="material-symbols-outlined curr-check">check_circle</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Privacy Tab -->
    <div v-if="activeTab === 'privacy'" class="tab-content">      <div class="glass-card-static settings-card">
        <h3 class="settings-section-title">Profile Visibility</h3>
        <div class="radio-list">
          <label v-for="opt in visibilityOpts" :key="opt.value" class="radio-item">
            <input type="radio" name="profile_visibility" :value="opt.value" v-model="privacy.visibility" />
            <div>
              <p class="radio-label">{{ opt.label }}</p>
              <p class="radio-desc">{{ opt.desc }}</p>
            </div>
          </label>
        </div>
      </div>

      <div class="glass-card-static settings-card danger-zone">
        <h3 class="settings-section-title danger-title">Danger Zone</h3>
        <div class="danger-item">
          <div>
            <p class="toggle-label">Delete Account</p>
            <p class="toggle-desc">Permanently delete your account and all data. This cannot be undone.</p>
          </div>
          <GfdButton variant="danger" :loading="deletingAccount" @click="deleteAccount">Delete Account</GfdButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/store/auth'
import { useUiStore }   from '@/store/ui'
import http from '@/services/http'
import { useCurrencyStore, CURRENCIES } from '@/store/currency'
import GfdInput  from '@/components/ui/GfdInput.vue'
import GfdButton from '@/components/ui/GfdButton.vue'

const authStore     = useAuthStore()
const uiStore       = useUiStore()
const router        = useRouter()
const deletingAccount = ref(false)

async function deleteAccount() {
  const confirmed = confirm(
    'Are you absolutely sure? This will permanently delete your account, all your posts, projects, messages, and data. This CANNOT be undone.'
  )
  if (!confirmed) return

  const doubleConfirm = confirm('Last chance — delete your account forever?')
  if (!doubleConfirm) return

  deletingAccount.value = true
  try {
    await http.delete('/auth/delete-account')
    authStore.logout()
    router.push('/')
    uiStore.showSuccess('Your account has been permanently deleted.')
  } catch (e) {
    uiStore.showError(e?.response?.data?.detail || 'Failed to delete account. Please try again.')
  } finally {
    deletingAccount.value = false
  }
}
const currencyStore = useCurrencyStore()
const { user }      = storeToRefs(authStore)

const activeTab = ref('profile')
const saving    = ref(false)

const userInitials = computed(() => {
  const name = user.value?.name || 'GFD'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const tabs = [
  { value: 'profile',       label: 'Profile',       icon: 'person' },
  { value: 'security',      label: 'Security',      icon: 'lock' },
  { value: 'notifications', label: 'Notifications', icon: 'notifications' },
  { value: 'preferences',   label: 'Preferences',   icon: 'tune' },
  { value: 'privacy',       label: 'Privacy',       icon: 'shield' },
]

// ── Currency preference ──
const currSearch = ref('')
const filteredCurrencies = computed(() => {
  const q = currSearch.value.toLowerCase()
  if (!q) return CURRENCIES
  return CURRENCIES.filter(c =>
    c.code.toLowerCase().includes(q) ||
    c.name.toLowerCase().includes(q) ||
    c.country.toLowerCase().includes(q)
  )
})
function selectCurrency(code) {
  currencyStore.setCurrency(code)
  uiStore.showSuccess(`Currency changed to ${CURRENCIES.find(c => c.code === code)?.name}`)
}

const profile = ref({
  name: user.value?.name || user.value?.full_name || '',
  email: user.value?.email || '',
  jobTitle: user.value?.jobTitle || user.value?.experience_level || user.value?.role || '',
  location: user.value?.location || '',
  bio: user.value?.bio || '',
  github: _stripPfx(user.value?.github_url || user.value?.github, 'github.com/'),
  linkedin: _stripPfx(user.value?.linkedin_url || user.value?.linkedin, 'linkedin.com/in/'),
  twitter: user.value?.twitter || '',
  website: user.value?.website || user.value?.portfolio_url || '',
})

function _stripPfx(url, pfx) {
  if (!url) return ''
  return url.replace(/https?:\/\/(www\.)?/, '').replace(pfx, '').replace(/^\//, '')
}

function cleanGithub() {
  profile.value.github = profile.value.github.replace(/https?:\/\/(www\.)?github\.com\//g, '').replace(/^\//, '')
}

function cleanLinkedin() {
  profile.value.linkedin = profile.value.linkedin.replace(/https?:\/\/(www\.)?linkedin\.com\/in\//g, '').replace(/^\//, '')
}

const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Andorra','Angola','Argentina','Armenia','Australia',
  'Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Belarus','Belgium','Belize',
  'Benin','Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei','Bulgaria',
  'Burkina Faso','Burundi','Cambodia','Cameroon','Canada','Central African Republic',
  'Chad','Chile','China','Colombia','Congo','Costa Rica','Croatia','Cuba','Cyprus',
  'Czech Republic','Denmark','DR Congo','Ecuador','Egypt','El Salvador','Eritrea',
  'Estonia','Eswatini','Ethiopia','Fiji','Finland','France','Gabon','Gambia','Georgia',
  'Germany','Ghana','Greece','Guatemala','Guinea','Guyana','Haiti','Honduras','Hungary',
  'Iceland','India','Indonesia','Iran','Iraq','Ireland','Israel','Italy','Jamaica',
  'Japan','Jordan','Kazakhstan','Kenya','Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon',
  'Liberia','Libya','Lithuania','Luxembourg','Madagascar','Malawi','Malaysia','Mali',
  'Malta','Mauritania','Mauritius','Mexico','Moldova','Monaco','Mongolia','Montenegro',
  'Morocco','Mozambique','Myanmar','Namibia','Nepal','Netherlands','New Zealand',
  'Nicaragua','Niger','Nigeria','North Korea','North Macedonia','Norway','Oman',
  'Pakistan','Panama','Papua New Guinea','Paraguay','Peru','Philippines','Poland',
  'Portugal','Qatar','Romania','Russia','Rwanda','Saudi Arabia','Senegal','Serbia',
  'Sierra Leone','Singapore','Slovakia','Slovenia','Somalia','South Africa',
  'South Korea','South Sudan','Spain','Sri Lanka','Sudan','Sweden','Switzerland',
  'Syria','Taiwan','Tajikistan','Tanzania','Thailand','Togo','Trinidad and Tobago',
  'Tunisia','Turkey','Turkmenistan','Uganda','Ukraine','United Arab Emirates',
  'United Kingdom','United States','Uruguay','Uzbekistan','Venezuela','Vietnam',
  'Yemen','Zambia','Zimbabwe',
]

const security = ref({ current: '', newPass: '', confirm: '', twoFA: false })

const sessions = ref([
  { id: 1, icon: 'computer',     device: 'Chrome on Windows',  location: 'New York, US',    time: 'Active now',    current: true },
  { id: 2, icon: 'smartphone',   device: 'Safari on iPhone',   location: 'New York, US',    time: '2 hours ago',   current: false },
  { id: 3, icon: 'laptop_mac',   device: 'Firefox on macOS',   location: 'London, UK',      time: '3 days ago',    current: false },
])

const emailNotifs = ref([
  { key: 'job_requests',  label: 'Job Requests',     desc: 'When someone sends you a project request.',  enabled: true },
  { key: 'messages',      label: 'New Messages',     desc: 'When you receive a new message.',            enabled: true },
  { key: 'payments',      label: 'Payments',         desc: 'When you receive a payment.',                enabled: true },
  { key: 'reviews',       label: 'Reviews',          desc: 'When someone leaves you a review.',          enabled: false },
  { key: 'newsletter',    label: 'Newsletter',       desc: 'Weekly digest of platform updates.',         enabled: false },
])

const pushNotifs = ref([
  { key: 'push_jobs',     label: 'Job Requests',     desc: 'Push notification for new job requests.',    enabled: true },
  { key: 'push_messages', label: 'Messages',         desc: 'Push notification for new messages.',        enabled: true },
  { key: 'push_payments', label: 'Payments',         desc: 'Push notification for payments.',            enabled: false },
])

const visibilityOpts = [
  { value: 'public',   label: 'Public',   desc: 'Anyone can view your profile.' },
  { value: 'members',  label: 'Members Only', desc: 'Only GFD members can view your profile.' },
  { value: 'private',  label: 'Private',  desc: 'Only you can view your profile.' },
]

const privacy = ref({ visibility: 'public' })

async function saveProfile() {
  saving.value = true
  try {
    await authStore.updateProfile({
      full_name:    profile.value.name,
      experience_level: profile.value.jobTitle,
      location:     profile.value.location,
      bio:          profile.value.bio,
      github_url:   profile.value.github ? `https://github.com/${profile.value.github}` : '',
      linkedin_url: profile.value.linkedin ? `https://www.linkedin.com/in/${profile.value.linkedin}` : '',
      website_url:  profile.value.website,
      twitter_url:  profile.value.twitter,
    })
    uiStore.showSuccess('Profile updated successfully!')
  } catch {
    uiStore.showError('Failed to save profile.')
  } finally {
    saving.value = false
  }
}

function changePassword() {
  if (!security.value.current || !security.value.newPass) {
    uiStore.showError('Please fill in all password fields.')
    return
  }
  if (security.value.newPass !== security.value.confirm) {
    uiStore.showError('Passwords do not match.')
    return
  }
  uiStore.showSuccess('Password updated successfully!')
  security.value = { current: '', newPass: '', confirm: '', twoFA: security.value.twoFA }
}

function revokeSession(session) {
  sessions.value = sessions.value.filter(s => s.id !== session.id)
  uiStore.showSuccess('Session revoked.')
}
</script>

<style scoped>
.settings-view { display: flex; flex-direction: column; gap: 1.25rem; }

.page-header { margin-bottom: 0.25rem; }

/* Tabs */
.settings-tabs {
  display: flex;
  gap: 0.25rem;
  border-bottom: 1px solid var(--outline-variant);
  overflow-x: auto;
  scrollbar-width: none;
}
.settings-tabs::-webkit-scrollbar { display: none; }

@media (max-width: 640px) {
  .settings-tabs {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.5rem;
    border-bottom: none;
  }
  .settings-tab {
    justify-content: center;
    padding: 0.75rem 0.75rem;
    border-bottom: none;
    border-radius: var(--radius-lg);
    background: var(--surface-container);
  }
  .settings-tab.active {
    color: var(--primary);
    background: var(--surface-container-low);
    border-bottom-color: transparent;
  }
}

.settings-tab {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.625rem 1rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--on-surface-variant);
  cursor: pointer;
  transition: var(--transition-fast);
  white-space: nowrap;
  margin-bottom: -1px;
}
.settings-tab:hover { color: var(--primary); }
.settings-tab.active { color: var(--primary); border-bottom-color: var(--primary); }
.tab-icon { font-size: 18px; }

/* Cards */
.tab-content { display: flex; flex-direction: column; gap: 1rem; }

.settings-card {
  padding: 1.5rem;
  border-radius: var(--radius-xl);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.settings-section-title {
  font-family: var(--font-headline);
  font-size: 1rem;
  font-weight: 700;
  color: var(--on-surface);
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--outline-variant);
}

/* Avatar Upload */
.avatar-upload {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex-wrap: wrap;
}

.upload-avatar {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-xl);
  background: var(--primary-fixed);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.upload-initials {
  font-family: var(--font-headline);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
}

.upload-label { font-family: var(--font-headline); font-size: 0.875rem; font-weight: 600; color: var(--on-surface); }
.upload-hint  { font-size: 0.8rem; color: var(--on-surface-variant); margin-top: 0.2rem; }
.upload-btn   { margin-top: 0.5rem; font-size: 0.8rem; padding: 0.4rem 0.875rem; }

/* Form */
.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
@media (min-width: 640px) { .form-grid { grid-template-columns: repeat(2, 1fr); } }

.form-stack { display: flex; flex-direction: column; gap: 1rem; }

.form-actions { display: flex; justify-content: flex-end; padding-top: 0.5rem; }

/* Toggle */
.toggle-list { display: flex; flex-direction: column; gap: 1rem; }

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.toggle-label { font-family: var(--font-headline); font-size: 0.875rem; font-weight: 600; color: var(--on-surface); }
.toggle-desc  { font-size: 0.8rem; color: var(--on-surface-variant); margin-top: 0.15rem; }

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
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  transition: transform 0.2s ease;
  display: block;
}
.toggle-btn.on .toggle-knob { transform: translateX(20px); }

/* Sessions */
.sessions-list { display: flex; flex-direction: column; gap: 0.75rem; }

.session-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.75rem;
  border-radius: var(--radius-lg);
  background: var(--surface-container-low);
}

.session-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-lg);
  background: var(--surface-container);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.session-icon { font-size: 20px; color: var(--on-surface-variant); }

.session-info { flex: 1; }
.session-device { font-family: var(--font-headline); font-size: 0.875rem; font-weight: 600; color: var(--on-surface); }
.session-meta   { font-size: 0.75rem; color: var(--on-surface-variant); margin-top: 0.1rem; }

.session-revoke { font-size: 0.8rem; color: var(--error); }

/* Radio */
.radio-list { display: flex; flex-direction: column; gap: 0.75rem; }

.radio-item {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--outline-variant);
  transition: var(--transition-fast);
}
.radio-item:hover { border-color: var(--primary); background: var(--surface-container-low); }
.radio-item input { accent-color: var(--primary); margin-top: 2px; flex-shrink: 0; }
.radio-label { font-family: var(--font-headline); font-size: 0.875rem; font-weight: 600; color: var(--on-surface); }
.radio-desc  { font-size: 0.8rem; color: var(--on-surface-variant); margin-top: 0.15rem; }

/* Danger Zone */
.danger-zone { border-color: rgba(186,26,26,0.2); }
.danger-title { color: var(--error); }
.danger-item { display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }

/* Country select & prefix inputs */
.form-field-wrap { display:flex; flex-direction:column; gap:.3rem; }
.field-label-sm { font-family:var(--font-headline); font-size:.8rem; font-weight:600; color:var(--on-surface); }
.country-sel {
  width:100%; padding:.65rem .875rem;
  background:var(--surface-container-low);
  border:1px solid var(--outline-variant);
  border-radius:var(--radius-lg);
  font-size:.875rem; color:var(--on-surface); outline:none; cursor:pointer;
}
.country-sel:focus { border-color:var(--primary); }
.pfx-wrap { display:flex; align-items:center; background:var(--surface-container-low); border:1px solid var(--outline-variant); border-radius:var(--radius-lg); overflow:hidden; }
.pfx-wrap:focus-within { border-color:var(--primary); }
.pfx { padding:0 .6rem 0 .875rem; font-size:.78rem; color:var(--on-surface-variant); white-space:nowrap; flex-shrink:0; border-right:1px solid var(--outline-variant); background:var(--surface-container); line-height:2.6rem; }
.pfx-input { flex:1; padding:.65rem .875rem; background:transparent; border:none; outline:none; font-size:.875rem; color:var(--on-surface); min-width:0; }

/* ── Currency Preferences ── */
.settings-section-desc { font-size: .875rem; color: var(--on-surface-variant); margin: -.25rem 0 1rem; }
.curr-current {
  display: flex; align-items: center; gap: 1rem;
  padding: .875rem 1rem;
  background: color-mix(in srgb,var(--primary) 8%,transparent);
  border: 1.5px solid color-mix(in srgb,var(--primary) 25%,transparent);
  border-radius: 12px; margin-bottom: 1.25rem;
}
.curr-flag-big { font-size: 1.75rem; min-width: 2.5rem; text-align: center; }
.curr-sel-name { font-family: var(--font-headline); font-size: .95rem; font-weight: 700; color: var(--on-surface); }
.curr-sel-code { font-size: .75rem; color: var(--on-surface-variant); margin-top: .1rem; }
.curr-active-chip {
  margin-left: auto;
  padding: .25rem .75rem; border-radius: 999px;
  background: var(--primary); color: #fff;
  font-size: .7rem; font-weight: 700; text-transform: uppercase; letter-spacing: .04em;
  flex-shrink: 0;
}
.curr-search-wrap {
  position: relative; margin-bottom: 1rem;
}
.curr-search-ico {
  position: absolute; left: .875rem; top: 50%; transform: translateY(-50%);
  font-size: 18px; color: var(--on-surface-variant); pointer-events: none;
}
.curr-search {
  width: 100%; padding: .625rem .875rem .625rem 2.5rem;
  background: var(--surface-container);
  border: 1.5px solid var(--outline-variant); border-radius: 10px;
  font-size: .875rem; color: var(--on-surface); outline: none;
  transition: border-color .15s;
}
.curr-search:focus { border-color: var(--primary); }
.curr-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: .625rem;
  max-height: 420px;
  overflow-y: auto;
  padding-right: .25rem;
}
@media (max-width: 600px) { .curr-grid { grid-template-columns: 1fr 1fr; } }
.curr-btn {
  display: flex; align-items: center; gap: .625rem;
  padding: .75rem .875rem;
  border: 1.5px solid var(--outline-variant);
  border-radius: 12px;
  background: var(--surface-container);
  cursor: pointer; transition: all .12s;
  text-align: left; position: relative;
}
.curr-btn:hover { border-color: var(--primary); background: color-mix(in srgb,var(--primary) 5%,transparent); }
.curr-btn.active {
  border-color: var(--primary);
  background: color-mix(in srgb,var(--primary) 8%,transparent);
  box-shadow: 0 0 0 1px var(--primary);
}
.curr-symbol {
  font-size: 1.2rem; font-weight: 800; font-family: var(--font-headline);
  min-width: 2rem; text-align: center; color: var(--primary); flex-shrink: 0;
}
.curr-info { flex: 1; min-width: 0; }
.curr-code { font-family: var(--font-headline); font-size: .8rem; font-weight: 700; color: var(--on-surface); }
.curr-name { font-size: .72rem; color: var(--on-surface-variant); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.curr-country { font-size: .67rem; color: var(--on-surface-variant); opacity: .75; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.curr-check { font-size: 18px; color: var(--primary); position: absolute; top: .5rem; right: .5rem; }
</style>
