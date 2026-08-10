<template>
  <div class="kyc-view">

    <!-- Header -->
    <div class="kyc-hdr">
      <div class="kyc-hdr-left">
        <RouterLink to="/wallet" class="back-btn">
          <span class="material-symbols-outlined">arrow_back</span>
        </RouterLink>
        <div>
          <h2 class="kyc-title">Identity Verification</h2>
          <p class="kyc-sub">Verify your identity to unlock higher limits</p>
        </div>
      </div>
    </div>

    <!-- Status banner -->
    <div v-if="kycStatus" class="status-banner" :class="kycStatus.status">
      <span class="material-symbols-outlined status-ico">{{ statusIcon }}</span>
      <div>
        <p class="status-title">{{ statusTitle }}</p>
        <p class="status-msg">{{ kycStatus.message }}</p>
        <p v-if="kycStatus.reject_reason" class="status-reason">
          Reason: {{ kycStatus.reject_reason }}
        </p>
      </div>
    </div>

    <!-- Limits comparison -->
    <div class="limits-card">
      <h3 class="limits-title">Transaction Limits</h3>
      <div class="limits-grid">
        <div class="limit-col">
          <p class="limit-col-hdr">
            <span class="material-symbols-outlined" style="font-size:16px">lock</span>
            Unverified
          </p>
          <div class="limit-row">
            <span>NGN Daily Send</span><span class="limit-val bad">₦50,000</span>
          </div>
          <div class="limit-row">
            <span>Crypto Daily Send</span><span class="limit-val bad">$500</span>
          </div>
          <div class="limit-row">
            <span>Withdrawal</span><span class="limit-val bad">₦100,000</span>
          </div>
        </div>
        <div class="limit-divider"></div>
        <div class="limit-col">
          <p class="limit-col-hdr" style="color:#16a34a">
            <span class="material-symbols-outlined" style="font-size:16px">verified</span>
            KYC Verified
          </p>
          <div class="limit-row">
            <span>NGN Daily Send</span><span class="limit-val good">₦5,000,000</span>
          </div>
          <div class="limit-row">
            <span>Crypto Daily Send</span><span class="limit-val good">$50,000</span>
          </div>
          <div class="limit-row">
            <span>Withdrawal</span><span class="limit-val good">Unlimited</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Already approved -->
    <div v-if="kycStatus?.status === 'approved'" class="approved-state">
      <div class="approved-icon">
        <span class="material-symbols-outlined" style="font-size:40px;color:#16a34a">verified_user</span>
      </div>
      <h3>You're Verified!</h3>
      <p>Your identity has been verified. You have access to all platform features and maximum limits.</p>
    </div>

    <!-- Pending -->
    <div v-else-if="kycStatus?.status === 'pending'" class="pending-state">
      <div class="pending-anim">
        <span class="material-symbols-outlined" style="font-size:40px;color:#f59e0b">hourglass_top</span>
      </div>
      <h3>Under Review</h3>
      <p>We're reviewing your documents. This usually takes 1–2 business days. We'll notify you once done.</p>
    </div>

    <!-- Submission form -->
    <div v-else class="kyc-form-card">
      <h3 class="form-section-title">
        <span class="material-symbols-outlined" style="font-size:18px;color:var(--primary)">badge</span>
        Personal Information
      </h3>

      <div class="form-grid">
        <div class="field-group">
          <label class="field-label">Full Legal Name</label>
          <input v-model="form.full_name" type="text" class="field-input"
            placeholder="Exactly as on your ID" autocomplete="name" />
        </div>
        <div class="field-group">
          <label class="field-label">Date of Birth</label>
          <input v-model="form.date_of_birth" type="date" class="field-input" />
        </div>
        <div class="field-group">
          <label class="field-label">Country</label>
          <select v-model="form.country" class="field-input">
            <option value="">Select country…</option>
            <option value="NG">Nigeria</option>
            <option value="GH">Ghana</option>
            <option value="KE">Kenya</option>
            <option value="ZA">South Africa</option>
            <option value="US">United States</option>
            <option value="GB">United Kingdom</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option v-for="c in otherCountries" :key="c.code" :value="c.code">{{ c.name }}</option>
          </select>
        </div>
        <div class="field-group">
          <label class="field-label">ID Type</label>
          <select v-model="form.id_type" class="field-input">
            <option value="">Select ID type…</option>
            <option value="national_id">National ID Card</option>
            <option value="passport">International Passport</option>
            <option value="drivers_license">Driver's License</option>
            <option value="voters_card">Voter's Card</option>
          </select>
        </div>
        <div class="field-group">
          <label class="field-label">ID Number</label>
          <input v-model="form.id_number" type="text" class="field-input"
            placeholder="ID document number" autocomplete="off" />
        </div>
      </div>

      <h3 class="form-section-title" style="margin-top:1.5rem">
        <span class="material-symbols-outlined" style="font-size:18px;color:var(--primary)">photo_camera</span>
        Document Upload
      </h3>
      <p class="upload-note">Upload clear, well-lit photos. All 4 corners must be visible. Max 10MB each.</p>

      <div class="upload-grid">
        <!-- ID Front -->
        <div class="upload-slot" @click="$refs.frontInput.click()" :class="{ filled: previews.front }">
          <input ref="frontInput" type="file" accept="image/*" class="hidden-file"
            @change="onFile('front', $event)" />
          <img v-if="previews.front" :src="previews.front" class="preview-img" />
          <div v-else class="upload-placeholder">
            <span class="material-symbols-outlined" style="font-size:32px;opacity:.4">photo_library</span>
            <p class="upload-label">ID Front</p>
            <p class="upload-hint">Required</p>
          </div>
          <div class="upload-overlay" v-if="previews.front">
            <span class="material-symbols-outlined" style="font-size:20px">edit</span>
          </div>
        </div>

        <!-- ID Back -->
        <div class="upload-slot" @click="$refs.backInput.click()" :class="{ filled: previews.back }">
          <input ref="backInput" type="file" accept="image/*" class="hidden-file"
            @change="onFile('back', $event)" />
          <img v-if="previews.back" :src="previews.back" class="preview-img" />
          <div v-else class="upload-placeholder">
            <span class="material-symbols-outlined" style="font-size:32px;opacity:.4">photo_library</span>
            <p class="upload-label">ID Back</p>
            <p class="upload-hint">Optional</p>
          </div>
          <div class="upload-overlay" v-if="previews.back">
            <span class="material-symbols-outlined" style="font-size:20px">edit</span>
          </div>
        </div>

        <!-- Selfie -->
        <div class="upload-slot selfie-slot" @click="$refs.selfieInput.click()" :class="{ filled: previews.selfie }">
          <input ref="selfieInput" type="file" accept="image/*" class="hidden-file"
            @change="onFile('selfie', $event)" />
          <img v-if="previews.selfie" :src="previews.selfie" class="preview-img" />
          <div v-else class="upload-placeholder">
            <span class="material-symbols-outlined" style="font-size:32px;opacity:.4">face</span>
            <p class="upload-label">Selfie with ID</p>
            <p class="upload-hint">Required · Hold ID next to face</p>
          </div>
          <div class="upload-overlay" v-if="previews.selfie">
            <span class="material-symbols-outlined" style="font-size:20px">edit</span>
          </div>
        </div>
      </div>

      <!-- Tips -->
      <div class="kyc-tips">
        <div class="tip"><span class="material-symbols-outlined" style="font-size:15px;color:#16a34a">check_circle</span> Ensure all text is clearly readable</div>
        <div class="tip"><span class="material-symbols-outlined" style="font-size:15px;color:#16a34a">check_circle</span> No glare or shadows on documents</div>
        <div class="tip"><span class="material-symbols-outlined" style="font-size:15px;color:#16a34a">check_circle</span> Selfie: face clearly visible, holding ID open</div>
        <div class="tip"><span class="material-symbols-outlined" style="font-size:15px;color:#f59e0b">warning</span> Blurry or cropped images will be rejected</div>
      </div>

      <!-- Privacy notice -->
      <div class="privacy-notice">
        <span class="material-symbols-outlined" style="font-size:16px;color:var(--primary)">shield</span>
        <p>Your documents are encrypted and stored securely. They are only used for identity verification and are never shared with third parties.</p>
      </div>

      <!-- Submit -->
      <button class="btn-primary submit-btn" :disabled="!canSubmit || submitting" @click="submitKyc">
        <span v-if="submitting" class="btn-spinner"></span>
        <span v-else class="material-symbols-outlined" style="font-size:18px">send</span>
        {{ submitting ? 'Uploading…' : 'Submit for Verification' }}
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import http from '@/services/http'
import { useUiStore } from '@/store/ui'

const uiStore   = useUiStore()
const kycStatus = ref(null)
const loading   = ref(false)
const submitting = ref(false)

const form = ref({
  full_name:     '',
  date_of_birth: '',
  country:       '',
  id_type:       '',
  id_number:     '',
})
const files    = ref({ front: null, back: null, selfie: null })
const previews = ref({ front: null, back: null, selfie: null })

const otherCountries = [
  { code: 'AE', name: 'UAE' }, { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' }, { code: 'MX', name: 'Mexico' },
  { code: 'NG', name: 'Nigeria' },
]

const canSubmit = computed(() =>
  form.value.full_name.trim().length > 2 &&
  form.value.date_of_birth &&
  form.value.country &&
  form.value.id_type &&
  form.value.id_number.trim().length > 3 &&
  files.value.front &&
  files.value.selfie
)

const statusIcon = computed(() => ({
  pending:  'hourglass_top',
  approved: 'verified_user',
  rejected: 'cancel',
  not_submitted: 'badge',
}[kycStatus.value?.status] || 'badge'))

const statusTitle = computed(() => ({
  pending:  'Under Review',
  approved: 'Verified ✓',
  rejected: 'Rejected — Please Resubmit',
  not_submitted: 'Not Submitted',
}[kycStatus.value?.status] || ''))

function onFile(slot, e) {
  const file = e.target.files[0]
  if (!file) return
  if (file.size > 10 * 1024 * 1024) {
    uiStore.showError('File too large. Max 10MB.')
    return
  }
  files.value[slot] = file
  previews.value[slot] = URL.createObjectURL(file)
}

async function loadStatus() {
  try {
    kycStatus.value = await http.get('/kyc/status')
  } catch { /* silent */ }
}

async function submitKyc() {
  if (!canSubmit.value) return
  submitting.value = true
  try {
    const fd = new FormData()
    fd.append('full_name',     form.value.full_name.trim())
    fd.append('date_of_birth', form.value.date_of_birth)
    fd.append('country',       form.value.country)
    fd.append('id_type',       form.value.id_type)
    fd.append('id_number',     form.value.id_number.trim())
    fd.append('id_front',      files.value.front)
    fd.append('selfie',        files.value.selfie)
    if (files.value.back) fd.append('id_back', files.value.back)

    await http.post('/kyc/submit', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    })
    uiStore.showSuccess('KYC submitted! We\'ll review within 1–2 business days.')
    await loadStatus()
  } catch (e) {
    uiStore.showError(e?.response?.data?.detail || 'Submission failed. Please try again.')
  } finally {
    submitting.value = false
  }
}

onMounted(loadStatus)
</script>

<style scoped>
.kyc-view { display: flex; flex-direction: column; gap: 1.25rem; padding-bottom: 3rem; max-width: 680px; }

.kyc-hdr        { display: flex; align-items: center; }
.kyc-hdr-left   { display: flex; align-items: center; gap: .875rem; }
.back-btn       { width: 38px; height: 38px; border-radius: 50%; border: 1.5px solid var(--outline-variant); background: var(--surface-container); display: flex; align-items: center; justify-content: center; cursor: pointer; text-decoration: none; color: var(--on-surface); transition: all .15s; flex-shrink: 0; }
.back-btn:hover { border-color: var(--primary); color: var(--primary); }
.kyc-title      { font-family: var(--font-headline); font-size: 1.4rem; font-weight: 800; color: var(--on-surface); }
.kyc-sub        { font-size: .82rem; color: var(--on-surface-variant); margin-top: .15rem; }

/* Status banner */
.status-banner  { display: flex; align-items: flex-start; gap: .875rem; padding: 1rem 1.25rem; border-radius: 16px; border: 1.5px solid; }
.status-banner.approved { background: rgba(22,163,74,.07); border-color: rgba(22,163,74,.25); }
.status-banner.pending  { background: rgba(245,158,11,.07); border-color: rgba(245,158,11,.25); }
.status-banner.rejected { background: rgba(239,68,68,.07);  border-color: rgba(239,68,68,.25); }
.status-ico     { font-size: 24px; flex-shrink: 0; margin-top: .1rem; }
.status-banner.approved .status-ico { color: #16a34a; }
.status-banner.pending  .status-ico { color: #f59e0b; }
.status-banner.rejected .status-ico { color: #ef4444; }
.status-title   { font-family: var(--font-headline); font-size: .95rem; font-weight: 700; color: var(--on-surface); }
.status-msg     { font-size: .82rem; color: var(--on-surface-variant); margin-top: .2rem; }
.status-reason  { font-size: .8rem; color: #ef4444; margin-top: .3rem; font-weight: 600; }

/* Limits */
.limits-card    { background: var(--surface-container-lowest); border: 1.5px solid var(--outline-variant); border-radius: 20px; padding: 1.5rem; }
.limits-title   { font-family: var(--font-headline); font-size: 1rem; font-weight: 700; color: var(--on-surface); margin-bottom: 1rem; }
.limits-grid    { display: flex; gap: 1.5rem; align-items: flex-start; }
.limit-col      { flex: 1; display: flex; flex-direction: column; gap: .625rem; }
.limit-col-hdr  { display: flex; align-items: center; gap: .35rem; font-family: var(--font-headline); font-size: .82rem; font-weight: 700; color: var(--on-surface-variant); margin-bottom: .25rem; }
.limit-row      { display: flex; justify-content: space-between; align-items: center; font-size: .82rem; color: var(--on-surface-variant); }
.limit-val      { font-weight: 700; font-family: var(--font-headline); font-size: .82rem; }
.limit-val.good { color: #16a34a; }
.limit-val.bad  { color: var(--on-surface-variant); opacity: .7; }
.limit-divider  { width: 1px; background: var(--outline-variant); align-self: stretch; }

/* States */
.approved-state, .pending-state { display: flex; flex-direction: column; align-items: center; gap: .875rem; padding: 3rem 1rem; text-align: center; background: var(--surface-container-lowest); border: 1.5px solid var(--outline-variant); border-radius: 20px; }
.approved-state h3, .pending-state h3 { font-family: var(--font-headline); font-size: 1.2rem; font-weight: 800; color: var(--on-surface); }
.approved-state p, .pending-state p { font-size: .875rem; color: var(--on-surface-variant); max-width: 360px; line-height: 1.5; }
.approved-icon, .pending-anim { width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.approved-icon { background: rgba(22,163,74,.1); }
.pending-anim  { background: rgba(245,158,11,.1); }

/* Form */
.kyc-form-card    { background: var(--surface-container-lowest); border: 1.5px solid var(--outline-variant); border-radius: 20px; padding: 1.75rem; display: flex; flex-direction: column; gap: 1rem; }
.form-section-title { display: flex; align-items: center; gap: .5rem; font-family: var(--font-headline); font-size: .95rem; font-weight: 700; color: var(--on-surface); }
.form-grid        { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px,1fr)); gap: .875rem; }
.field-group      { display: flex; flex-direction: column; gap: .4rem; }
.field-label      { font-size: .78rem; font-weight: 700; color: var(--on-surface-variant); font-family: var(--font-headline); text-transform: uppercase; letter-spacing: .04em; }
.field-input      { padding: .75rem 1rem; border-radius: 12px; border: 1.5px solid var(--outline-variant); background: var(--surface-container); color: var(--on-surface); font-size: .9rem; outline: none; transition: border-color .15s; }
.field-input:focus { border-color: var(--primary); }

/* Upload */
.upload-note      { font-size: .8rem; color: var(--on-surface-variant); }
.upload-grid      { display: grid; grid-template-columns: 1fr 1fr; gap: .875rem; }
.selfie-slot      { grid-column: 1 / -1; }
.upload-slot      { position: relative; border-radius: 16px; border: 2px dashed var(--outline-variant); background: var(--surface-container-low); min-height: 140px; display: flex; align-items: center; justify-content: center; cursor: pointer; overflow: hidden; transition: border-color .15s; }
.upload-slot:hover, .upload-slot.filled { border-color: var(--primary); }
.hidden-file      { display: none; }
.upload-placeholder { display: flex; flex-direction: column; align-items: center; gap: .5rem; text-align: center; padding: 1rem; }
.upload-label     { font-family: var(--font-headline); font-size: .88rem; font-weight: 700; color: var(--on-surface); }
.upload-hint      { font-size: .72rem; color: var(--on-surface-variant); }
.preview-img      { width: 100%; height: 160px; object-fit: cover; }
.upload-overlay   { position: absolute; inset: 0; background: rgba(0,0,0,.45); display: flex; align-items: center; justify-content: center; color: white; opacity: 0; transition: opacity .15s; }
.upload-slot:hover .upload-overlay { opacity: 1; }

/* Tips */
.kyc-tips         { display: flex; flex-direction: column; gap: .4rem; background: var(--surface-container-low); border-radius: 12px; padding: .875rem 1rem; }
.tip              { display: flex; align-items: center; gap: .4rem; font-size: .8rem; color: var(--on-surface-variant); }

/* Privacy */
.privacy-notice   { display: flex; align-items: flex-start; gap: .5rem; padding: .875rem 1rem; border-radius: 12px; background: rgba(99,14,212,.06); border: 1px solid rgba(99,14,212,.15); font-size: .8rem; color: var(--on-surface-variant); line-height: 1.45; }

.submit-btn       { display: flex; align-items: center; justify-content: center; gap: .5rem; padding: .9rem; font-size: .95rem; width: 100%; margin-top: .5rem; }
</style>
