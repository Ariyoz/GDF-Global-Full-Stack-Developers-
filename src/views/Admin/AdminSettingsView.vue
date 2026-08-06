<template>
  <div class="admin-settings-view">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="text-headline-lg">Platform Settings</h1>
        <p class="text-body-md" style="margin-top:0.25rem">Configure platform-wide settings and preferences.</p>
      </div>
      <button class="btn-primary" @click="saveSettings">
        <span class="material-symbols-outlined" style="font-size:18px">save</span>
        Save All Changes
      </button>
    </div>

    <!-- Settings Tabs -->
    <div class="settings-tabs">
      <button v-for="tab in tabs" :key="tab.value" class="settings-tab" :class="{ active: activeTab === tab.value }" @click="activeTab = tab.value">
        <span class="material-symbols-outlined" style="font-size:18px">{{ tab.icon }}</span>
        {{ tab.label }}
      </button>
    </div>

    <!-- General Settings -->
    <div v-if="activeTab === 'general'" class="settings-content">
      <div class="settings-section glass-card-static">
        <h2 class="section-title">Site Information</h2>
        <div class="settings-list">
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Platform Name</p>
              <p class="setting-desc">Displayed in the navbar, emails, and browser tab</p>
            </div>
            <input v-model="settings.platformName" name="platformName" class="setting-input" />
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Tagline</p>
              <p class="setting-desc">Short description shown on the landing page</p>
            </div>
            <input v-model="settings.tagline" name="tagline" class="setting-input" />
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Support Email</p>
              <p class="setting-desc">Where user support inquiries are sent</p>
            </div>
            <input v-model="settings.supportEmail" name="supportEmail" autocomplete="email" class="setting-input" type="email" />
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Contact Phone</p>
              <p class="setting-desc">Displayed on the contact page</p>
            </div>
            <input v-model="settings.contactPhone" name="contactPhone" autocomplete="tel" class="setting-input" />
          </div>
        </div>
      </div>

      <div class="settings-section glass-card-static">
        <h2 class="section-title">Platform Status</h2>
        <div class="settings-list">
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
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Maintenance Message</p>
              <p class="setting-desc">Shown to users when maintenance mode is active</p>
            </div>
            <input v-model="settings.maintenanceMessage" name="maintenanceMessage" class="setting-input" />
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Show Announcement Banner</p>
              <p class="setting-desc">Display a banner at the top of all pages</p>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="settings.showBanner" />
              <span class="toggle-slider" />
            </label>
          </div>
          <div class="setting-row" v-if="settings.showBanner">
            <div class="setting-info">
              <p class="setting-label">Banner Text</p>
              <p class="setting-desc">Announcement message for all users</p>
            </div>
            <input v-model="settings.bannerText" name="bannerText" class="setting-input" />
          </div>
        </div>
      </div>
    </div>

    <!-- Users & Registration -->
    <div v-if="activeTab === 'users'" class="settings-content">
      <div class="settings-section glass-card-static">
        <h2 class="section-title">Registration</h2>
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
              <p class="setting-label">Require Profile Setup</p>
              <p class="setting-desc">Force new users to complete profile before using the platform</p>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="settings.requireProfileSetup" />
              <span class="toggle-slider" />
            </label>
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Default User Role</p>
              <p class="setting-desc">Role assigned to new users on registration</p>
            </div>
            <select v-model="settings.defaultRole" class="setting-select">
              <option value="developer">Developer</option>
              <option value="client">Client</option>
            </select>
          </div>
        </div>
      </div>

      <div class="settings-section glass-card-static">
        <h2 class="section-title">Profile Limits</h2>
        <div class="settings-list">
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Max Skill Tags</p>
              <p class="setting-desc">Maximum number of skill tags per user profile</p>
            </div>
            <input v-model="settings.maxSkillTags" name="maxSkillTags" type="number" class="setting-input setting-input-sm" />
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Max Bio Length</p>
              <p class="setting-desc">Character limit for user bio</p>
            </div>
            <input v-model="settings.maxBioLength" name="maxBioLength" type="number" class="setting-input setting-input-sm" />
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Max Avatar Size (MB)</p>
              <p class="setting-desc">Maximum file size for profile pictures</p>
            </div>
            <input v-model="settings.maxAvatarSize" name="maxAvatarSize" type="number" class="setting-input setting-input-sm" />
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Max Projects per User</p>
              <p class="setting-desc">How many projects a user can create</p>
            </div>
            <input v-model="settings.maxProjectsPerUser" name="maxProjectsPerUser" type="number" class="setting-input setting-input-sm" />
          </div>
        </div>
      </div>
    </div>

    <!-- Content & Moderation -->
    <div v-if="activeTab === 'content'" class="settings-content">
      <div class="settings-section glass-card-static">
        <h2 class="section-title">Posts & Feed</h2>
        <div class="settings-list">
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Max Post Length</p>
              <p class="setting-desc">Maximum characters per post</p>
            </div>
            <input v-model="settings.maxPostLength" name="maxPostLength" type="number" class="setting-input setting-input-sm" />
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Max Images per Post</p>
              <p class="setting-desc">Number of image attachments allowed</p>
            </div>
            <input v-model="settings.maxImagesPerPost" name="maxImagesPerPost" type="number" class="setting-input setting-input-sm" />
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
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Posts per Page</p>
              <p class="setting-desc">Number of posts loaded per scroll</p>
            </div>
            <input v-model="settings.postsPerPage" name="postsPerPage" type="number" class="setting-input setting-input-sm" />
          </div>
        </div>
      </div>

      <div class="settings-section glass-card-static">
        <h2 class="section-title">Moderation Rules</h2>
        <div class="settings-list">
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Auto-flag Threshold</p>
              <p class="setting-desc">Number of reports before content is auto-flagged for review</p>
            </div>
            <input v-model="settings.autoFlagThreshold" name="autoFlagThreshold" type="number" class="setting-input setting-input-sm" />
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Auto-suspend Threshold</p>
              <p class="setting-desc">Number of confirmed violations before auto-suspending a user</p>
            </div>
            <input v-model="settings.autoSuspendThreshold" name="autoSuspendThreshold" type="number" class="setting-input setting-input-sm" />
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Profanity Filter</p>
              <p class="setting-desc">Automatically filter offensive language in posts and comments</p>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="settings.profanityFilter" />
              <span class="toggle-slider" />
            </label>
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Spam Detection</p>
              <p class="setting-desc">Auto-detect and flag repetitive or promotional content</p>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="settings.spamDetection" />
              <span class="toggle-slider" />
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Security -->
    <div v-if="activeTab === 'security'" class="settings-content">
      <div class="settings-section glass-card-static">
        <h2 class="section-title">Authentication</h2>
        <div class="settings-list">
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Two-Factor Authentication</p>
              <p class="setting-desc">Require 2FA for admin accounts</p>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="settings.require2FA" />
              <span class="toggle-slider" />
            </label>
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Session Timeout (minutes)</p>
              <p class="setting-desc">Auto-logout after inactivity</p>
            </div>
            <input v-model="settings.sessionTimeout" name="sessionTimeout" type="number" class="setting-input setting-input-sm" />
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Max Login Attempts</p>
              <p class="setting-desc">Lock account after failed attempts</p>
            </div>
            <input v-model="settings.maxLoginAttempts" name="maxLoginAttempts" type="number" class="setting-input setting-input-sm" />
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Password Minimum Length</p>
              <p class="setting-desc">Minimum characters required for passwords</p>
            </div>
            <input v-model="settings.minPasswordLength" name="minPasswordLength" type="number" class="setting-input setting-input-sm" />
          </div>
        </div>
      </div>

      <div class="settings-section glass-card-static">
        <h2 class="section-title">Rate Limiting</h2>
        <div class="settings-list">
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">API Rate Limit (req/min)</p>
              <p class="setting-desc">Maximum API requests per user per minute</p>
            </div>
            <input v-model="settings.apiRateLimit" name="apiRateLimit" type="number" class="setting-input setting-input-sm" />
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Post Rate Limit (posts/hour)</p>
              <p class="setting-desc">Maximum posts a user can publish per hour</p>
            </div>
            <input v-model="settings.postRateLimit" name="postRateLimit" type="number" class="setting-input setting-input-sm" />
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Message Rate Limit (msg/min)</p>
              <p class="setting-desc">Maximum messages per minute in DMs</p>
            </div>
            <input v-model="settings.messageRateLimit" name="messageRateLimit" type="number" class="setting-input setting-input-sm" />
          </div>
        </div>
      </div>
    </div>

    <!-- Notifications -->
    <div v-if="activeTab === 'notifications'" class="settings-content">
      <div class="settings-section glass-card-static">
        <h2 class="section-title">Admin Alerts</h2>
        <div class="settings-list">
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Critical Flag Alerts</p>
              <p class="setting-desc">Email admins when critical content is flagged</p>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="settings.criticalFlagAlerts" />
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
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Daily Summary Email</p>
              <p class="setting-desc">Receive a daily digest of platform activity</p>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="settings.dailySummary" />
              <span class="toggle-slider" />
            </label>
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Downtime Alerts</p>
              <p class="setting-desc">Alert when services go down or error rate spikes</p>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="settings.downtimeAlerts" />
              <span class="toggle-slider" />
            </label>
          </div>
        </div>
      </div>

      <div class="settings-section glass-card-static">
        <h2 class="section-title">User Notifications</h2>
        <div class="settings-list">
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Welcome Email</p>
              <p class="setting-desc">Send welcome email to new users on registration</p>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="settings.welcomeEmail" />
              <span class="toggle-slider" />
            </label>
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Project Join Notifications</p>
              <p class="setting-desc">Notify project owners when someone requests to join</p>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="settings.joinNotifications" />
              <span class="toggle-slider" />
            </label>
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Weekly Digest for Users</p>
              <p class="setting-desc">Send users a weekly summary of activity they missed</p>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="settings.weeklyDigest" />
              <span class="toggle-slider" />
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Payments -->
    <div v-if="activeTab === 'payments'" class="settings-content">
      <div class="settings-section glass-card-static">
        <h2 class="section-title">Payment Gateway</h2>
        <div class="settings-list">
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Payment Provider</p>
              <p class="setting-desc">Active payment processing service</p>
            </div>
            <select v-model="settings.paymentProvider" class="setting-select">
              <option value="stripe">Stripe</option>
              <option value="paystack">Paystack</option>
              <option value="flutterwave">Flutterwave</option>
            </select>
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Platform Commission (%)</p>
              <p class="setting-desc">Percentage taken from each transaction</p>
            </div>
            <input v-model="settings.platformCommission" type="number" class="setting-input setting-input-sm" />
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Minimum Payout ($)</p>
              <p class="setting-desc">Minimum balance before a developer can withdraw</p>
            </div>
            <input v-model="settings.minimumPayout" type="number" class="setting-input setting-input-sm" />
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Enable Payments</p>
              <p class="setting-desc">Allow financial transactions on the platform</p>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="settings.paymentsEnabled" />
              <span class="toggle-slider" />
            </label>
          </div>
        </div>
      </div>

      <div class="settings-section glass-card-static">
        <h2 class="section-title">Subscription Plans</h2>
        <div class="settings-list">
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Free Tier Project Limit</p>
              <p class="setting-desc">Max projects for free users</p>
            </div>
            <input v-model="settings.freeProjectLimit" type="number" class="setting-input setting-input-sm" />
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Pro Plan Price ($/month)</p>
              <p class="setting-desc">Monthly subscription for Pro features</p>
            </div>
            <input v-model="settings.proPlanPrice" type="number" class="setting-input setting-input-sm" />
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Enable Pro Plan</p>
              <p class="setting-desc">Show Pro plan upgrade option to users</p>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="settings.proPlanEnabled" />
              <span class="toggle-slider" />
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="settings-footer">
      <button class="btn-outline" @click="resetSettings">Reset to Defaults</button>
      <button class="btn-primary" @click="saveSettings">
        <span class="material-symbols-outlined" style="font-size:18px">save</span>
        Save All Changes
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const activeTab = ref('general')

const tabs = [
  { value: 'general',       label: 'General',       icon: 'tune' },
  { value: 'users',         label: 'Users',         icon: 'group' },
  { value: 'content',       label: 'Content',       icon: 'article' },
  { value: 'security',      label: 'Security',      icon: 'lock' },
  { value: 'notifications', label: 'Notifications', icon: 'notifications' },
  { value: 'payments',      label: 'Payments',      icon: 'payments' },
]

const settings = reactive({
  // General
  platformName: 'Global Full-Stack Developers',
  tagline: 'The leading platform for full-stack excellence',
  supportEmail: 'support@gfd.io',
  contactPhone: '+1 (555) 000-0000',
  maintenanceMode: false,
  maintenanceMessage: 'We are performing scheduled maintenance. Back soon!',
  showBanner: false,
  bannerText: '',

  // Users
  openRegistration: true,
  requireEmailVerification: true,
  requireProfileSetup: true,
  defaultRole: 'developer',
  maxSkillTags: 20,
  maxBioLength: 500,
  maxAvatarSize: 2,
  maxProjectsPerUser: 10,

  // Content
  maxPostLength: 2000,
  maxImagesPerPost: 4,
  allowImageUploads: true,
  postsPerPage: 20,
  autoFlagThreshold: 3,
  autoSuspendThreshold: 5,
  profanityFilter: true,
  spamDetection: true,

  // Security
  require2FA: false,
  sessionTimeout: 60,
  maxLoginAttempts: 5,
  minPasswordLength: 8,
  apiRateLimit: 100,
  postRateLimit: 10,
  messageRateLimit: 30,

  // Notifications
  criticalFlagAlerts: true,
  newUserNotifications: false,
  dailySummary: true,
  downtimeAlerts: true,
  welcomeEmail: true,
  joinNotifications: true,
  weeklyDigest: false,

  // Payments
  paymentProvider: 'stripe',
  platformCommission: 10,
  minimumPayout: 50,
  paymentsEnabled: false,
  freeProjectLimit: 3,
  proPlanPrice: 29,
  proPlanEnabled: false,
})

function saveSettings() {
  alert('Settings saved successfully!')
}

function resetSettings() {
  if (confirm('Reset all settings to defaults? This cannot be undone.')) {
    location.reload()
  }
}
</script>

<style scoped>
.admin-settings-view { display: flex; flex-direction: column; gap: 1.25rem; padding: 1.5rem; min-height: 100%; animation: fadeInUp .35s ease forwards; }
@media (min-width: 768px) { .admin-settings-view { padding: 2rem 2rem 2.5rem; } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }

.btn-primary {
  display: inline-flex; align-items: center; gap: .375rem;
  padding: .55rem 1.125rem; border-radius: var(--radius-lg);
  background: var(--gradient-primary); color: white; border: none;
  font-family: var(--font-headline); font-size: .8125rem; font-weight: 700;
  cursor: pointer; transition: opacity .15s, transform .15s;
  box-shadow: var(--shadow-primary);
}
.btn-primary:hover { opacity: .9; transform: translateY(-1px); }
.btn-primary .material-symbols-outlined { font-size: 17px; }
.btn-outline {
  display: inline-flex; align-items: center; gap: .375rem;
  padding: .55rem 1.125rem; border-radius: var(--radius-lg);
  background: var(--surface-container-lowest); border: 1.5px solid var(--outline-variant);
  font-family: var(--font-headline); font-size: .8125rem; font-weight: 600;
  color: var(--on-surface); cursor: pointer; transition: border-color .15s, color .15s;
}
.btn-outline:hover { border-color: var(--primary); color: var(--primary); }

/* Tabs */
.settings-tabs {
  display: flex; gap: 0.25rem; overflow-x: auto; scrollbar-width: none;
  border-bottom: 1px solid var(--outline-variant); padding-bottom: 0;
  -webkit-overflow-scrolling: touch;
}
.settings-tabs::-webkit-scrollbar { display: none; }

.settings-tab {
  display: flex; align-items: center; gap: 0.35rem;
  padding: 0.6rem 0.75rem;
  background: none; border: none; border-bottom: 2px solid transparent;
  font-family: var(--font-headline); font-size: 0.8rem; font-weight: 500;
  color: var(--on-surface-variant); cursor: pointer; white-space: nowrap;
  transition: all 0.15s ease; margin-bottom: -1px; flex-shrink: 0;
}
.settings-tab:hover { color: var(--primary); }
.settings-tab.active { color: var(--primary); border-bottom-color: var(--primary); font-weight: 600; }

/* Content */
.settings-content { display: flex; flex-direction: column; gap: 1.25rem; }

.settings-section {
  background: var(--surface-container-lowest); border: 1px solid var(--outline-variant);
  padding: 1.25rem; border-radius: var(--radius-xl);
}
@media (min-width: 768px) { .settings-section { padding: 1.5rem; } }

.section-title {
  font-family: var(--font-headline); font-size: 0.95rem; font-weight: 700;
  color: var(--on-surface); margin-bottom: 1.25rem;
  padding-bottom: 0.75rem; border-bottom: 1px solid var(--outline-variant);
}

.settings-list { display: flex; flex-direction: column; gap: 1rem; }

.setting-row {
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  padding: 0.5rem 0;
}

@media (max-width: 600px) {
  .setting-row { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
  .setting-input, .setting-select { width: 100%; }
}

.setting-info { flex: 1; min-width: 0; }
.setting-label { font-family: var(--font-headline); font-size: 0.85rem; font-weight: 600; color: var(--on-surface); }
.setting-desc { font-size: 0.72rem; color: var(--on-surface-variant); margin-top: 0.15rem; }

.setting-input {
  width: 220px; padding: 0.5rem 0.75rem;
  background: var(--surface-container-lowest);
  border: 1.5px solid var(--outline-variant); border-radius: var(--radius-lg);
  font-family: var(--font-body); font-size: 0.85rem; color: var(--on-surface); outline: none;
  transition: border-color .15s, box-shadow .15s;
}
.setting-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(99,14,212,.1); }
.setting-input-sm { width: 90px; text-align: center; }

.setting-select {
  appearance: none; -webkit-appearance: none;
  width: 220px; padding: 0.5rem 2rem 0.5rem 0.75rem;
  background: var(--surface-container-lowest)
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237b7487' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")
    no-repeat right .6rem center / 12px;
  border: 1.5px solid var(--outline-variant); border-radius: var(--radius-lg);
  font-family: var(--font-headline); font-size: 0.85rem; color: var(--on-surface); outline: none; cursor: pointer;
  transition: border-color .15s;
}
.setting-select:focus { border-color: var(--primary); }
[data-theme="dark"] .setting-select { background-color: var(--surface-container); }

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
