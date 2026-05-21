<template>
  <div class="admin-settings-view">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="text-headline-lg">Platform Settings</h1>
        <p class="text-body-md" style="margin-top:0.25rem">Configure platform-wide settings and preferences.</p>
      </div>
    </div>

    <!-- Settings Sections -->
    <div class="settings-grid">
      <!-- General -->
      <div class="settings-section glass-card-static">
        <h2 class="section-title">
          <span class="material-symbols-outlined" style="font-size:20px;color:var(--primary)">tune</span>
          General
        </h2>
        <div class="settings-list">
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Platform Name</p>
              <p class="setting-desc">The public-facing name of the platform</p>
            </div>
            <input v-model="settings.platformName" class="setting-input" />
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Support Email</p>
              <p class="setting-desc">Email address for user support inquiries</p>
            </div>
            <input v-model="settings.supportEmail" class="setting-input" />
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Maintenance Mode</p>
              <p class="setting-desc">Temporarily disable access for non-admin users</p>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="settings.maintenanceMode" />
              <span class="toggle-slider" />
            </label>
          </div>
        </div>
      </div>

      <!-- Registration & Access -->
      <div class="settings-section glass-card-static">
        <h2 class="section-title">
          <span class="material-symbols-outlined" style="font-size:20px;color:var(--primary)">person_add</span>
          Registration & Access
        </h2>
        <div class="settings-list">
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Open Registration</p>
              <p class="setting-desc">Allow new users to sign up without an invite</p>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="settings.openRegistration" />
              <span class="toggle-slider" />
            </label>
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Require Email Verification</p>
              <p class="setting-desc">Users must verify email before accessing features</p>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="settings.requireEmailVerification" />
              <span class="toggle-slider" />
            </label>
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Max Skill Tags per User</p>
              <p class="setting-desc">Limit the number of skill tags on profiles</p>
            </div>
            <input v-model="settings.maxSkillTags" type="number" class="setting-input setting-input-sm" />
          </div>
        </div>
      </div>

      <!-- Content & Moderation -->
      <div class="settings-section glass-card-static">
        <h2 class="section-title">
          <span class="material-symbols-outlined" style="font-size:20px;color:var(--primary)">shield</span>
          Content & Moderation
        </h2>
        <div class="settings-list">
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Auto-flag Threshold</p>
              <p class="setting-desc">Number of reports before content is auto-flagged</p>
            </div>
            <input v-model="settings.autoFlagThreshold" type="number" class="setting-input setting-input-sm" />
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Max Post Length</p>
              <p class="setting-desc">Maximum characters allowed per post</p>
            </div>
            <input v-model="settings.maxPostLength" type="number" class="setting-input setting-input-sm" />
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Allow Image Uploads</p>
              <p class="setting-desc">Let users attach images to posts</p>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="settings.allowImageUploads" />
              <span class="toggle-slider" />
            </label>
          </div>
        </div>
      </div>

      <!-- Notifications -->
      <div class="settings-section glass-card-static">
        <h2 class="section-title">
          <span class="material-symbols-outlined" style="font-size:20px;color:var(--primary)">notifications</span>
          Notifications
        </h2>
        <div class="settings-list">
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Admin Email Alerts</p>
              <p class="setting-desc">Receive email when critical flags are raised</p>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="settings.adminEmailAlerts" />
              <span class="toggle-slider" />
            </label>
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">New User Notifications</p>
              <p class="setting-desc">Get notified when new users register</p>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="settings.newUserNotifications" />
              <span class="toggle-slider" />
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Button -->
    <div class="settings-footer">
      <button class="btn-outline" @click="resetSettings">Reset to Defaults</button>
      <button class="btn-primary" @click="saveSettings">
        <span class="material-symbols-outlined" style="font-size:18px">save</span>
        Save Settings
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const settings = reactive({
  platformName: 'Global Full-Stack Developers',
  supportEmail: 'support@gfd.io',
  maintenanceMode: false,
  openRegistration: true,
  requireEmailVerification: true,
  maxSkillTags: 20,
  autoFlagThreshold: 3,
  maxPostLength: 2000,
  allowImageUploads: true,
  adminEmailAlerts: true,
  newUserNotifications: false,
})

function saveSettings() {
  alert('Settings saved successfully!')
}

function resetSettings() {
  settings.platformName = 'Global Full-Stack Developers'
  settings.supportEmail = 'support@gfd.io'
  settings.maintenanceMode = false
  settings.openRegistration = true
  settings.requireEmailVerification = true
  settings.maxSkillTags = 20
  settings.autoFlagThreshold = 3
  settings.maxPostLength = 2000
  settings.allowImageUploads = true
  settings.adminEmailAlerts = true
  settings.newUserNotifications = false
}
</script>

<style scoped>
.admin-settings-view { display: flex; flex-direction: column; gap: 1.5rem; padding: 1.5rem; min-height: 100vh; }
@media (min-width: 768px) { .admin-settings-view { padding: 2rem; } }

.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }

.settings-grid { display: flex; flex-direction: column; gap: 1.25rem; }

.settings-section { padding: 1.5rem; border-radius: var(--radius-xl); }

.section-title {
  display: flex; align-items: center; gap: 0.5rem;
  font-family: var(--font-headline); font-size: 1rem; font-weight: 700;
  color: var(--on-surface); margin-bottom: 1.25rem;
  padding-bottom: 0.75rem; border-bottom: 1px solid var(--outline-variant);
}

.settings-list { display: flex; flex-direction: column; gap: 1rem; }

.setting-row {
  display: flex; align-items: center; justify-content: space-between; gap: 1.5rem;
  padding: 0.75rem 0;
}

.setting-info { flex: 1; min-width: 0; }
.setting-label { font-family: var(--font-headline); font-size: 0.875rem; font-weight: 600; color: var(--on-surface); }
.setting-desc { font-size: 0.75rem; color: var(--on-surface-variant); margin-top: 0.2rem; }

.setting-input {
  width: 220px; padding: 0.5rem 0.75rem;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant); border-radius: var(--radius-lg);
  font-family: var(--font-body); font-size: 0.875rem; color: var(--on-surface); outline: none;
}
.setting-input:focus { border-color: var(--primary); }
.setting-input-sm { width: 100px; text-align: center; }

/* Toggle Switch */
.toggle { position: relative; display: inline-block; width: 44px; height: 24px; flex-shrink: 0; }
.toggle input { opacity: 0; width: 0; height: 0; }
.toggle-slider {
  position: absolute; inset: 0; cursor: pointer;
  background: var(--outline-variant); border-radius: 24px;
  transition: background 0.2s ease;
}
.toggle-slider::before {
  content: ''; position: absolute;
  width: 18px; height: 18px; left: 3px; bottom: 3px;
  background: white; border-radius: 50%;
  transition: transform 0.2s ease;
}
.toggle input:checked + .toggle-slider { background: var(--primary); }
.toggle input:checked + .toggle-slider::before { transform: translateX(20px); }

/* Footer */
.settings-footer {
  display: flex; align-items: center; justify-content: flex-end; gap: 0.75rem;
  padding-top: 1rem; border-top: 1px solid var(--outline-variant);
}
</style>
