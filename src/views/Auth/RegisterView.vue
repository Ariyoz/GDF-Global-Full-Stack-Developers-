<template>
  <div class="reg-wrap">

    <!-- Step indicator -->
    <div class="step-track">
      <div v-for="s in totalSteps" :key="s"
        class="step-dot"
        :class="{ active: s === step, done: s < step }"
      />
    </div>

    <!-- Step 1: Account basics -->
    <Transition :name="stepDir" mode="out-in">
    <div v-if="step === 1" key="s1" class="step-body">
      <div class="step-hero">
        <h1 class="step-title">Create your<br>account<span class="dot">.</span></h1>
        <p class="step-sub">Join thousands of developers and clients on GFD</p>
      </div>

      <div class="fields">
        <div class="field-wrap">
          <label class="field-lbl">Full Name</label>
          <div class="input-row" :class="{ 'input-focus': focus.name, 'input-err': errors.name }">
            <span class="material-symbols-outlined inp-ico">person</span>
            <input v-model="form.name" type="text" placeholder="Alex Morgan" class="inp"
              autocomplete="name" @focus="focus.name=true" @blur="focus.name=false" />
          </div>
          <p v-if="errors.name" class="field-err">{{ errors.name }}</p>
        </div>

        <div class="field-wrap">
          <label class="field-lbl">Email</label>
          <div class="input-row" :class="{ 'input-focus': focus.email, 'input-err': errors.email }">
            <span class="material-symbols-outlined inp-ico">mail</span>
            <input v-model="form.email" type="email" placeholder="you@example.com" class="inp"
              autocomplete="email" inputmode="email" @focus="focus.email=true" @blur="focus.email=false" />
          </div>
          <p v-if="errors.email" class="field-err">{{ errors.email }}</p>
        </div>

        <div class="field-wrap">
          <label class="field-lbl">Password</label>
          <div class="input-row" :class="{ 'input-focus': focus.pass, 'input-err': errors.password }">
            <span class="material-symbols-outlined inp-ico">lock</span>
            <input v-model="form.password" :type="showPass?'text':'password'"
              placeholder="Min. 8 characters" class="inp" autocomplete="new-password"
              @focus="focus.pass=true" @blur="focus.pass=false" />
            <button type="button" class="eye-btn" @click="showPass=!showPass" tabindex="-1">
              <span class="material-symbols-outlined" style="font-size:18px">{{ showPass?'visibility_off':'visibility' }}</span>
            </button>
          </div>
          <p v-if="errors.password" class="field-err">{{ errors.password }}</p>
        </div>
      </div>

      <button class="btn-next" @click="goStep2">Continue →</button>
      <p class="signin-nudge">Have an account? <RouterLink to="/auth/login" class="signin-lnk">Sign in</RouterLink></p>
    </div>
    </Transition>

    <!-- Step 2: Role -->
    <Transition :name="stepDir" mode="out-in">
    <div v-if="step === 2" key="s2" class="step-body">
      <div class="step-hero">
        <h1 class="step-title">I am a<span class="dot">.</span></h1>
        <p class="step-sub">Choose how you'll use GFD</p>
      </div>

      <div class="role-cards">
        <button
          v-for="r in roles" :key="r.value"
          class="role-card"
          :class="{ selected: form.role === r.value }"
          @click="form.role = r.value"
        >
          <div class="role-card-ico" :style="form.role===r.value ? 'background:var(--primary)' : ''">
            <span class="material-symbols-outlined" style="font-size:26px;color:#fff">{{ r.icon }}</span>
          </div>
          <p class="role-card-name">{{ r.label }}</p>
          <p class="role-card-desc">{{ r.desc }}</p>
          <span v-if="form.role===r.value" class="role-check material-symbols-outlined">check_circle</span>
        </button>
      </div>

      <div class="step-nav">
        <button class="btn-back" @click="step=1; stepDir='slide-back'">← Back</button>
        <button class="btn-next flex-1" @click="step=3; stepDir='slide-fwd'">Continue →</button>
      </div>
    </div>
    </Transition>

    <!-- Step 3: Profile details -->
    <Transition :name="stepDir" mode="out-in">
    <div v-if="step === 3" key="s3" class="step-body">
      <div class="step-hero">
        <h1 class="step-title">Your profile<span class="dot">.</span></h1>
        <p class="step-sub">{{ form.role === 'developer' ? 'Tell us about your work' : 'Tell us about your company' }}</p>
      </div>

      <div class="fields">
        <!-- Developer fields -->
        <template v-if="form.role === 'developer'">
          <div class="field-wrap">
            <label class="field-lbl">Job Title</label>
            <div class="input-row" :class="{ 'input-focus': focus.title, 'input-err': errors.jobTitle }">
              <span class="material-symbols-outlined inp-ico">work</span>
              <input v-model="form.jobTitle" type="text" placeholder="Senior Full-Stack Engineer" class="inp"
                @focus="focus.title=true" @blur="focus.title=false" />
            </div>
            <p v-if="errors.jobTitle" class="field-err">{{ errors.jobTitle }}</p>
          </div>

          <div class="field-wrap">
            <label class="field-lbl">Location</label>
            <div class="input-row" :class="{ 'input-focus': focus.loc }">
              <span class="material-symbols-outlined inp-ico">location_on</span>
              <input v-model="form.location" type="text" placeholder="Lagos, Nigeria" class="inp"
                @focus="focus.loc=true" @blur="focus.loc=false" />
            </div>
          </div>

          <div class="field-wrap">
            <label class="field-lbl">
              Skills
              <span class="field-hint">Press Enter to add · max 10</span>
            </label>
            <div class="skills-wrap" :class="{ focused: focus.skills }" @click="skillsRef?.focus()">
              <span v-for="sk in form.skills" :key="sk" class="skill-chip">
                {{ sk }}
                <button type="button" class="sk-rm" @click.stop="removeSkill(sk)">
                  <span class="material-symbols-outlined" style="font-size:12px">close</span>
                </button>
              </span>
              <input
                ref="skillsRef"
                v-model="skillInput"
                class="skills-inp"
                placeholder="React, Node.js, Python…"
                @focus="focus.skills=true"
                @blur="focus.skills=false; addSkill()"
                @keydown="onSkillKey"
              />
            </div>
          </div>
        </template>

        <!-- Client fields -->
        <template v-else>
          <div class="field-wrap">
            <label class="field-lbl">Company (optional)</label>
            <div class="input-row" :class="{ 'input-focus': focus.company }">
              <span class="material-symbols-outlined inp-ico">business</span>
              <input v-model="form.company" type="text" placeholder="Your company name" class="inp"
                @focus="focus.company=true" @blur="focus.company=false" />
            </div>
          </div>
          <div class="field-wrap">
            <label class="field-lbl">Location</label>
            <div class="input-row" :class="{ 'input-focus': focus.loc }">
              <span class="material-symbols-outlined inp-ico">location_on</span>
              <input v-model="form.location" type="text" placeholder="City, Country" class="inp"
                @focus="focus.loc=true" @blur="focus.loc=false" />
            </div>
          </div>
        </template>
      </div>

      <!-- Error banner -->
      <Transition name="err-drop">
        <div v-if="submitError" class="error-banner">
          <span class="material-symbols-outlined" style="font-size:16px;flex-shrink:0">error_outline</span>
          {{ submitError }}
        </div>
      </Transition>

      <div class="step-nav">
        <button class="btn-back" @click="step=2; stepDir='slide-back'">← Back</button>
        <button class="btn-next flex-1" :disabled="loading" @click="handleRegister">
          <span v-if="loading" class="btn-spin" />
          <span v-else>Create Account</span>
        </button>
      </div>

      <p class="auth-terms">
        By signing up you agree to our
        <RouterLink to="/privacy-policy" class="signin-lnk">Privacy Policy</RouterLink>.
      </p>
    </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useUiStore }   from '@/store/ui'

const router    = useRouter()
const authStore = useAuthStore()
const uiStore   = useUiStore()

const step        = ref(1)
const totalSteps  = 3
const stepDir     = ref('slide-fwd')
const loading     = ref(false)
const showPass    = ref(false)
const submitError = ref('')
const skillInput  = ref('')
const skillsRef   = ref(null)

const focus = reactive({ name:false, email:false, pass:false, title:false, loc:false, skills:false, company:false })

const form = reactive({
  name:'', email:'', password:'', role:'developer',
  jobTitle:'', location:'', company:'', bio:'',
  skills:[], github:'', linkedin:'', website:'',
})

const errors = reactive({ name:'', email:'', password:'', jobTitle:'' })

const roles = [
  { value:'developer', icon:'code',     label:'Developer', desc:'I build products and offer services' },
  { value:'client',    icon:'business', label:'Client',    desc:'I need developers for my projects'   },
]

// Skills
function addSkill() {
  const s = skillInput.value.replace(/,/g,'').trim()
  if (s && !form.skills.includes(s) && form.skills.length < 10) form.skills.push(s)
  skillInput.value = ''
}
function removeSkill(sk) { form.skills.splice(form.skills.indexOf(sk), 1) }
function onSkillKey(e) {
  if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addSkill() }
  if (e.key === 'Backspace' && !skillInput.value && form.skills.length) form.skills.pop()
}

// Step 1 validation
function goStep2() {
  errors.name = errors.email = errors.password = ''
  let ok = true
  if (!form.name.trim())                          { errors.name='Name is required'; ok=false }
  if (!form.email.trim())                         { errors.email='Email is required'; ok=false }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { errors.email='Enter a valid email'; ok=false }
  if (!form.password || form.password.length < 8) { errors.password='Min. 8 characters'; ok=false }
  if (!ok) return
  stepDir.value = 'slide-fwd'
  step.value = 2
}

// Final submit
async function handleRegister() {
  errors.jobTitle = ''
  if (form.role === 'developer' && !form.jobTitle.trim()) {
    errors.jobTitle = 'Job title is required'
    return
  }
  loading.value = true
  submitError.value = ''
  try {
    await authStore.register(form)
    uiStore.showSuccess('Welcome to GFD! 🎉')
    router.push('/dashboard')
  } catch (e) {
    submitError.value = authStore.error || e?.response?.data?.detail || 'Registration failed. Try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.reg-wrap { display:flex; flex-direction:column; gap:1.5rem; width:100%; }

/* Step dots */
.step-track { display:flex; gap:.5rem; align-items:center; }
.step-dot {
  width:8px; height:8px; border-radius:999px;
  background: var(--outline-variant);
  transition: all .25s ease;
}
.step-dot.active { width:24px; background:var(--primary); }
.step-dot.done   { background:var(--primary); opacity:.4; }

/* Step body */
.step-body { display:flex; flex-direction:column; gap:1.25rem; }

/* Hero */
.step-hero {}
.step-title {
  font-family:var(--font-headline); font-size:clamp(2rem,7vw,2.8rem);
  font-weight:900; line-height:1.05; color:var(--on-surface); letter-spacing:-0.03em;
}
.dot { color:var(--primary); }
.step-sub { font-size:.9rem; color:var(--on-surface-variant); margin-top:.4rem; }

/* Fields */
.fields { display:flex; flex-direction:column; gap:.875rem; }
.field-wrap { display:flex; flex-direction:column; gap:.375rem; }
.field-lbl { font-size:.8rem; font-weight:600; color:var(--on-surface-variant); }
.field-hint { font-size:.72rem; font-weight:400; color:var(--outline); margin-left:.25rem; }
.field-err  { font-size:.75rem; color:#ef4444; }

.input-row {
  display:flex; align-items:center; gap:.5rem; padding:0 1rem;
  background:var(--surface-container-low); border:1.5px solid var(--outline-variant);
  border-radius:14px; height:52px; transition:border-color .15s, box-shadow .15s;
}
.input-row.input-focus { border-color:var(--primary); box-shadow:0 0 0 3px rgba(168,85,247,.12); }
.input-row.input-err   { border-color:#ef4444; }
.inp-ico { font-size:18px; color:var(--on-surface-variant); flex-shrink:0; }
.inp {
  flex:1; border:none; background:transparent; outline:none;
  font-size:.95rem; color:var(--on-surface); font-family:var(--font-body);
}
.inp::placeholder { color:var(--outline); }
.eye-btn { background:none; border:none; cursor:pointer; color:var(--on-surface-variant); display:flex; align-items:center; padding:0; }

/* Role cards */
.role-cards { display:grid; grid-template-columns:1fr 1fr; gap:.75rem; }
.role-card {
  position:relative; display:flex; flex-direction:column; align-items:center; gap:.5rem;
  padding:1.25rem .875rem; border-radius:16px; cursor:pointer;
  background:var(--surface-container-low); border:2px solid var(--outline-variant);
  transition:all .15s; text-align:center;
}
.role-card:hover { border-color:var(--primary); }
.role-card.selected { border-color:var(--primary); background:rgba(168,85,247,.06); }
.role-card-ico {
  width:52px; height:52px; border-radius:14px;
  background:var(--surface-container); display:flex; align-items:center; justify-content:center;
  transition:background .15s;
}
.role-card-name { font-family:var(--font-headline); font-size:.95rem; font-weight:700; color:var(--on-surface); }
.role-card-desc { font-size:.75rem; color:var(--on-surface-variant); line-height:1.4; }
.role-check { position:absolute; top:.625rem; right:.625rem; font-size:18px; color:var(--primary); }

/* Skills */
.skills-wrap {
  display:flex; flex-wrap:wrap; gap:.375rem; align-items:center;
  padding:.5rem .875rem; background:var(--surface-container-low);
  border:1.5px solid var(--outline-variant); border-radius:14px;
  min-height:52px; cursor:text; transition:border-color .15s, box-shadow .15s;
}
.skills-wrap.focused { border-color:var(--primary); box-shadow:0 0 0 3px rgba(168,85,247,.12); }
.skill-chip {
  display:inline-flex; align-items:center; gap:.2rem;
  padding:.2rem .5rem .2rem .625rem;
  background:rgba(168,85,247,.12); border:1px solid rgba(168,85,247,.25);
  border-radius:999px; font-size:.75rem; font-weight:600; color:var(--primary);
}
.sk-rm { background:none; border:none; cursor:pointer; color:var(--primary); display:flex; align-items:center; padding:0; opacity:.7; }
.sk-rm:hover { opacity:1; }
.skills-inp { flex:1; min-width:80px; border:none; background:transparent; outline:none; font-size:.875rem; color:var(--on-surface); }
.skills-inp::placeholder { color:var(--outline); }

/* Error banner */
.error-banner {
  display:flex; align-items:center; gap:.5rem; padding:.75rem 1rem;
  background:rgba(239,68,68,.1); border:1px solid rgba(239,68,68,.25);
  border-radius:12px; color:#ef4444; font-size:.85rem; font-weight:500;
}
.err-drop-enter-active,.err-drop-leave-active { transition:all .2s ease; }
.err-drop-enter-from,.err-drop-leave-to { opacity:0; transform:translateY(-8px); }

/* Buttons */
.btn-next {
  width:100%; height:52px; border-radius:14px;
  background:var(--primary); color:#fff; border:none;
  font-family:var(--font-headline); font-size:1rem; font-weight:700;
  cursor:pointer; display:flex; align-items:center; justify-content:center; gap:.5rem;
  box-shadow:0 4px 20px rgba(168,85,247,.35);
  transition:opacity .15s, transform .1s;
}
.btn-next:hover:not(:disabled) { opacity:.9; transform:translateY(-1px); }
.btn-next:disabled { opacity:.6; cursor:not-allowed; }
.btn-next.flex-1 { flex:1; width:auto; }
.btn-back {
  height:52px; padding:0 1.25rem; border-radius:14px;
  background:var(--surface-container-low); border:1.5px solid var(--outline-variant);
  font-family:var(--font-headline); font-size:.9rem; font-weight:600;
  color:var(--on-surface-variant); cursor:pointer;
  transition:border-color .15s;
}
.btn-back:hover { border-color:var(--primary); color:var(--primary); }
.step-nav { display:flex; gap:.75rem; align-items:center; }

.btn-spin {
  width:20px; height:20px; border-radius:50%;
  border:2.5px solid rgba(255,255,255,.3); border-top-color:#fff;
  animation:spin .7s linear infinite;
}
@keyframes spin { to { transform:rotate(360deg); } }

/* Footer text */
.signin-nudge { text-align:center; font-size:.875rem; color:var(--on-surface-variant); }
.signin-lnk { font-weight:700; color:var(--primary); text-decoration:none; }
.signin-lnk:hover { text-decoration:underline; }
.auth-terms { text-align:center; font-size:.78rem; color:var(--on-surface-variant); line-height:1.5; }

/* Step transitions */
.slide-fwd-enter-active,.slide-fwd-leave-active,
.slide-back-enter-active,.slide-back-leave-active {
  transition:opacity .2s ease, transform .2s ease;
}
.slide-fwd-enter-from  { opacity:0; transform:translateX(30px); }
.slide-fwd-leave-to    { opacity:0; transform:translateX(-30px); }
.slide-back-enter-from { opacity:0; transform:translateX(-30px); }
.slide-back-leave-to   { opacity:0; transform:translateX(30px); }
</style>
