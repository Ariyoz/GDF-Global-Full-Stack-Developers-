<template>
  <div class="upload-view">
    <div class="container-gfd upload-inner">
      <div class="upload-header">
        <RouterLink to="/dashboard/projects" class="back-link">
          <span class="material-symbols-outlined" style="font-size:20px">arrow_back</span>
          Back to Projects
        </RouterLink>
        <h1 class="text-headline-lg">Post a New Project</h1>
        <p class="text-body-md" style="margin-top:0.25rem">Share your work with 10,000+ developers and companies.</p>
      </div>

      <!-- Step Indicator -->
      <div class="step-indicator">
        <div
          v-for="(step, i) in steps"
          :key="step.label"
          class="step-item"
          :class="{ active: currentStep === i, done: currentStep > i }"
        >
          <div class="step-circle">
            <span v-if="currentStep > i" class="material-symbols-outlined" style="font-size:16px;font-variation-settings:'FILL' 1">check</span>
            <span v-else>{{ i + 1 }}</span>
          </div>
          <span class="step-label">{{ step.label }}</span>
          <div v-if="i < steps.length - 1" class="step-connector" />
        </div>
      </div>

      <!-- Form Card -->
      <div class="glass-card-static upload-card">

        <!-- Step 1: Project Basics -->
        <div v-if="currentStep === 0" class="form-step">
          <h2 class="step-heading">Project Basics</h2>
          <p class="step-sub">Tell us what you're building.</p>

          <div class="form-fields">
            <GfdInput v-model="form.title" label="Project Title" placeholder="e.g. Vortex Analytics Engine" required />

            <div class="form-field">
              <label class="field-label">Category</label>
              <div class="category-grid">
                <button
                  v-for="cat in categories"
                  :key="cat.value"
                  type="button"
                  class="category-btn"
                  :class="{ active: form.category === cat.value }"
                  @click="form.category = cat.value"
                >
                  <span class="material-symbols-outlined cat-icon">{{ cat.icon }}</span>
                  <span class="cat-label">{{ cat.label }}</span>
                </button>
              </div>
            </div>

            <GfdInput v-model="form.description" label="Short Description" type="textarea" :rows="3"
              placeholder="Describe your project in 2–3 sentences..." required />

            <div class="form-field">
              <label class="field-label">Tech Stack</label>
              <div class="tag-input-wrap">
                <div class="selected-tags">
                  <span v-for="tag in form.tags" :key="tag" class="selected-tag">
                    {{ tag }}
                    <button type="button" @click="removeTag(tag)">
                      <span class="material-symbols-outlined" style="font-size:14px">close</span>
                    </button>
                  </span>
                </div>
                <input
                  v-model="tagInput"
                  class="tag-input"
                  placeholder="Type a skill and press Enter..."
                  @keydown.enter.prevent="addTag"
                  @keydown.comma.prevent="addTag"
                />
              </div>
              <p class="field-hint">Press Enter or comma to add a tag</p>
            </div>
          </div>

          <div class="step-nav">
            <span />
            <GfdButton variant="primary" :disabled="!form.title || !form.category" @click="currentStep++">
              Continue →
            </GfdButton>
          </div>
        </div>

        <!-- Step 2: Media & Links -->
        <div v-else-if="currentStep === 1" class="form-step">
          <h2 class="step-heading">Media & Links</h2>
          <p class="step-sub">Add visuals and links to showcase your work.</p>

          <div class="form-fields">
            <!-- Cover Image Upload -->
            <div class="form-field">
              <label class="field-label">Cover Image</label>
              <div class="upload-zone" :class="{ 'has-file': form.coverImage }" @click="triggerFileInput">
                <input ref="fileInput" type="file" accept="image/*" style="display:none" @change="handleFileChange" />
                <template v-if="!form.coverImage">
                  <span class="material-symbols-outlined upload-zone-icon">cloud_upload</span>
                  <p class="upload-zone-text">Click to upload or drag & drop</p>
                  <p class="upload-zone-hint">PNG, JPG, GIF up to 10MB</p>
                </template>
                <template v-else>
                  <span class="material-symbols-outlined" style="font-size:2rem;color:#16a34a">check_circle</span>
                  <p class="upload-zone-text">{{ form.coverImage }}</p>
                  <button type="button" class="btn-ghost" style="font-size:0.8rem" @click.stop="form.coverImage = ''">Remove</button>
                </template>
              </div>
            </div>

            <GfdInput v-model="form.liveUrl"   label="Live Demo URL"  placeholder="https://your-project.com" />
            <GfdInput v-model="form.githubUrl" label="GitHub Repo"    placeholder="https://github.com/you/project" />
            <GfdInput v-model="form.videoUrl"  label="Demo Video URL" placeholder="https://youtube.com/watch?v=..." hint="Optional — add a walkthrough video" />
          </div>

          <div class="step-nav">
            <GfdButton variant="ghost" @click="currentStep--">← Back</GfdButton>
            <GfdButton variant="primary" @click="currentStep++">Continue →</GfdButton>
          </div>
        </div>

        <!-- Step 3: Visibility & Publish -->
        <div v-else-if="currentStep === 2" class="form-step">
          <h2 class="step-heading">Visibility & Publish</h2>
          <p class="step-sub">Choose how your project appears on GFD.</p>

          <div class="form-fields">
            <div class="form-field">
              <label class="field-label">Visibility</label>
              <div class="visibility-options">
                <label
                  v-for="opt in visibilityOpts"
                  :key="opt.value"
                  class="visibility-opt"
                  :class="{ active: form.visibility === opt.value }"
                >
                  <input type="radio" :value="opt.value" v-model="form.visibility" style="display:none" />
                  <span class="material-symbols-outlined vis-icon">{{ opt.icon }}</span>
                  <div>
                    <p class="vis-label">{{ opt.label }}</p>
                    <p class="vis-desc">{{ opt.desc }}</p>
                  </div>
                </label>
              </div>
            </div>

            <div class="form-field">
              <label class="field-label">Looking for Collaborators?</label>
              <div class="toggle-row">
                <div>
                  <p class="toggle-label">Open to collaboration</p>
                  <p class="toggle-desc">Allow other developers to request to join this project.</p>
                </div>
                <button type="button" class="toggle-btn" :class="{ on: form.openCollab }" @click="form.openCollab = !form.openCollab">
                  <span class="toggle-knob" />
                </button>
              </div>
            </div>

            <!-- Preview -->
            <div class="project-preview-card glass-card">
              <div class="preview-thumb">
                <span class="material-symbols-outlined" style="font-size:2.5rem;color:rgba(255,255,255,0.7)">{{ categoryIcon }}</span>
              </div>
              <div class="preview-body">
                <div class="preview-tags">
                  <span v-for="tag in form.tags.slice(0,3)" :key="tag" class="chip">{{ tag }}</span>
                </div>
                <h4 class="preview-title">{{ form.title || 'Your Project Title' }}</h4>
                <p class="preview-desc">{{ form.description || 'Your project description will appear here.' }}</p>
              </div>
            </div>
          </div>

          <div class="step-nav">
            <GfdButton variant="ghost" @click="currentStep--">← Back</GfdButton>
            <GfdButton variant="primary" :loading="loading" @click="handlePublish">
              <span class="material-symbols-outlined" style="font-size:18px">rocket_launch</span>
              Publish Project
            </GfdButton>
          </div>
        </div>

        <!-- Success -->
        <div v-else class="publish-success">
          <div class="success-icon-wrap">
            <span class="material-symbols-outlined" style="font-size:3rem;color:#16a34a;font-variation-settings:'FILL' 1">task_alt</span>
          </div>
          <h2 class="success-title">Project Published!</h2>
          <p class="success-desc">
            <strong>{{ form.title }}</strong> is now live on GFD and visible to thousands of developers and companies.
          </p>
          <div class="success-actions">
            <RouterLink to="/projects" class="btn-primary">View on GFD →</RouterLink>
            <RouterLink to="/dashboard/projects" class="btn-outline">My Projects</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import GfdInput  from '@/components/ui/GfdInput.vue'
import GfdButton from '@/components/ui/GfdButton.vue'
import { useUiStore } from '@/store/ui'
import http from '@/services/http'

const router = useRouter()
const uiStore = useUiStore()
const currentStep = ref(0)
const loading     = ref(false)
const tagInput    = ref('')
const fileInput   = ref(null)
const coverFile   = ref(null)

const form = reactive({
  title:       '',
  category:    '',
  description: '',
  tags:        [],
  coverImage:  '',
  liveUrl:     '',
  githubUrl:   '',
  videoUrl:    '',
  visibility:  'public',
  openCollab:  false,
})

const steps = [
  { label: 'Basics' },
  { label: 'Media' },
  { label: 'Publish' },
]

const categories = [
  { value: 'webapp',    icon: 'web',             label: 'Web App' },
  { value: 'mobile',    icon: 'smartphone',      label: 'Mobile App' },
  { value: 'api',       icon: 'api',             label: 'API / Backend' },
  { value: 'uiux',      icon: 'design_services', label: 'UI/UX Design' },
  { value: 'saas',      icon: 'cloud',           label: 'SaaS' },
  { value: 'opensource',icon: 'code',            label: 'Open Source' },
]

const visibilityOpts = [
  { value: 'public',   icon: 'public',   label: 'Public',   desc: 'Visible to everyone on GFD.' },
  { value: 'members',  icon: 'group',    label: 'Members',  desc: 'Only visible to GFD members.' },
  { value: 'private',  icon: 'lock',     label: 'Private',  desc: 'Only visible to you.' },
]

const categoryIcon = computed(() => {
  const cat = categories.find(c => c.value === form.category)
  return cat?.icon || 'web'
})

function addTag() {
  const tag = tagInput.value.trim().replace(',', '')
  if (tag && !form.tags.includes(tag) && form.tags.length < 8) {
    form.tags.push(tag)
  }
  tagInput.value = ''
}

function removeTag(tag) {
  form.tags = form.tags.filter(t => t !== tag)
}

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileChange(e) {
  const file = e.target.files[0]
  if (file) {
    coverFile.value = file
    form.coverImage = file.name
  }
}

async function handlePublish() {
  if (!form.title?.trim()) {
    uiStore.showError('Please add a project title')
    return
  }
  loading.value = true
  try {
    let coverImageUrl = ''

    // Upload cover image — non-blocking, project still posts if upload fails
    if (coverFile.value) {
      try {
        const formData = new FormData()
        formData.append('file', coverFile.value)
        const uploadResult = await http.post('/uploads/media', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 30000,
        })
        if (uploadResult?.url) coverImageUrl = uploadResult.url
      } catch (imgErr) {
        console.warn('Cover image upload failed (continuing without image):', imgErr?.message)
      }
    }

    const payload = {
      title:            form.title.trim(),
      description:      form.description?.trim() || '',
      skills_needed:    form.tags || [],
      requirements:     form.description?.trim() || '',
      experience_level: form.experience_level || 'mid',
      cover_image:      coverImageUrl || null,
      repository_url:   form.liveUrl || form.githubUrl || null,
      github_url:       form.githubUrl || null,
      live_url:         form.liveUrl || null,
    }

    await http.post('/projects/', payload, { timeout: 30000 })
    uiStore.showSuccess('Project published successfully!')
    currentStep.value = 3
  } catch (err) {
    console.error('Failed to publish project:', err)
    const detail = err?.response?.data?.detail
      || (err?.code === 'ECONNABORTED' ? 'Server is starting up — please wait 30 seconds and try again.' : null)
      || err?.message
      || 'Please check your connection and try again.'
    uiStore.showError(`Failed to publish: ${detail}`)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.upload-view { background: var(--background); min-height: 100vh; padding: 2rem 0; }

.upload-inner { padding-top: 1rem; padding-bottom: 3rem; max-width: 720px; }

.upload-header { margin-bottom: 2rem; }

.back-link {
  display: inline-flex; align-items: center; gap: 0.35rem;
  font-family: var(--font-headline); font-size: 0.875rem; font-weight: 500;
  color: var(--primary); text-decoration: none; margin-bottom: 1rem;
}

/* Step Indicator */
.step-indicator {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  overflow-x: auto;
  scrollbar-width: none;
}
.step-indicator::-webkit-scrollbar { display: none; }

.step-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.step-circle {
  width: 32px; height: 32px;
  border-radius: var(--radius-full);
  border: 2px solid var(--outline-variant);
  background: var(--surface-container-lowest);
  color: var(--on-surface-variant);
  font-family: var(--font-headline); font-size: 0.8rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.step-item.active .step-circle {
  border-color: var(--primary);
  background: var(--primary);
  color: var(--on-primary);
}

.step-item.done .step-circle {
  border-color: #16a34a;
  background: rgba(22,163,74,0.1);
  color: #16a34a;
}

.step-label {
  font-family: var(--font-headline); font-size: 0.8rem; font-weight: 600;
  color: var(--on-surface-variant);
  white-space: nowrap;
}

.step-item.active .step-label { color: var(--primary); }
.step-item.done  .step-label  { color: #16a34a; }

.step-connector {
  width: 40px; height: 2px;
  background: var(--outline-variant);
  margin: 0 0.5rem;
  flex-shrink: 0;
}

/* Card */
.upload-card { padding: 2rem; border-radius: var(--radius-xl); }

.form-step { display: flex; flex-direction: column; gap: 1.5rem; }

.step-heading {
  font-family: var(--font-headline); font-size: 1.25rem; font-weight: 700; color: var(--on-surface);
}
.step-sub { font-size: 0.875rem; color: var(--on-surface-variant); margin-top: -1rem; }

.form-fields { display: flex; flex-direction: column; gap: 1.25rem; }

.form-field { display: flex; flex-direction: column; gap: 0.4rem; }

.field-label {
  font-family: var(--font-headline); font-size: 0.875rem; font-weight: 500; color: var(--on-surface);
}

.field-hint { font-size: 0.75rem; color: var(--on-surface-variant); }

/* Category Grid */
.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.625rem;
}

@media (min-width: 480px) { .category-grid { grid-template-columns: repeat(6, 1fr); } }

.category-btn {
  display: flex; flex-direction: column; align-items: center; gap: 0.35rem;
  padding: 0.75rem 0.5rem;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-lg);
  cursor: pointer; transition: all 0.15s ease;
}

.category-btn:hover { border-color: rgba(168,85,247,0.3); }
.category-btn.active { border-color: var(--primary); background: rgba(168,85,247,0.07); }

.cat-icon { font-size: 22px; color: var(--on-surface-variant); }
.category-btn.active .cat-icon { color: var(--primary); }
.cat-label { font-family: var(--font-headline); font-size: 0.7rem; font-weight: 600; color: var(--on-surface-variant); }
.category-btn.active .cat-label { color: var(--primary); }

/* Tag Input */
.tag-input-wrap {
  display: flex; flex-wrap: wrap; gap: 0.4rem; align-items: center;
  padding: 0.5rem 0.75rem;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-lg);
  min-height: 44px;
  cursor: text;
}

.tag-input-wrap:focus-within { border-color: var(--primary); }

.selected-tags { display: flex; flex-wrap: wrap; gap: 0.35rem; }

.selected-tag {
  display: inline-flex; align-items: center; gap: 0.2rem;
  padding: 0.2rem 0.5rem;
  background: rgba(168,85,247,0.1);
  border: 1px solid rgba(168,85,247,0.2);
  border-radius: var(--radius-full);
  font-family: var(--font-headline); font-size: 0.75rem; font-weight: 600; color: var(--primary);
}

.selected-tag button {
  background: none; border: none; cursor: pointer; color: var(--primary);
  display: flex; align-items: center; padding: 0;
}

.tag-input {
  flex: 1; min-width: 120px; border: none; background: transparent;
  font-family: var(--font-body); font-size: 0.875rem; color: var(--on-surface); outline: none;
}

/* Upload Zone */
.upload-zone {
  border: 2px dashed var(--outline-variant);
  border-radius: var(--radius-xl);
  padding: 2.5rem 1.5rem;
  display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
  cursor: pointer; transition: all 0.15s ease; text-align: center;
}

.upload-zone:hover { border-color: var(--primary); background: rgba(168,85,247,0.03); }
.upload-zone.has-file { border-color: #16a34a; background: rgba(22,163,74,0.04); }

.upload-zone-icon { font-size: 2.5rem; color: var(--outline); }
.upload-zone-text { font-family: var(--font-headline); font-size: 0.875rem; font-weight: 600; color: var(--on-surface); }
.upload-zone-hint { font-size: 0.75rem; color: var(--on-surface-variant); }

/* Visibility */
.visibility-options { display: flex; flex-direction: column; gap: 0.625rem; }

.visibility-opt {
  display: flex; align-items: flex-start; gap: 0.875rem;
  padding: 0.875rem 1rem;
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-lg);
  cursor: pointer; transition: all 0.15s ease;
}

.visibility-opt:hover { border-color: rgba(168,85,247,0.3); }
.visibility-opt.active { border-color: var(--primary); background: rgba(168,85,247,0.05); }

.vis-icon { font-size: 22px; color: var(--on-surface-variant); flex-shrink: 0; margin-top: 1px; }
.visibility-opt.active .vis-icon { color: var(--primary); }
.vis-label { font-family: var(--font-headline); font-size: 0.875rem; font-weight: 600; color: var(--on-surface); }
.vis-desc  { font-size: 0.8rem; color: var(--on-surface-variant); margin-top: 0.1rem; }

/* Toggle */
.toggle-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.toggle-label { font-family: var(--font-headline); font-size: 0.875rem; font-weight: 600; color: var(--on-surface); }
.toggle-desc  { font-size: 0.8rem; color: var(--on-surface-variant); margin-top: 0.15rem; }

.toggle-btn {
  width: 44px; height: 24px; border-radius: var(--radius-full);
  background: var(--surface-container-high); border: none; cursor: pointer;
  position: relative; transition: background 0.2s ease; flex-shrink: 0;
}
.toggle-btn.on { background: var(--primary); }
.toggle-knob {
  position: absolute; top: 2px; left: 2px;
  width: 20px; height: 20px; border-radius: 50%;
  background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  transition: transform 0.2s ease; display: block;
}
.toggle-btn.on .toggle-knob { transform: translateX(20px); }

/* Preview Card */
.project-preview-card { padding: 0; overflow: hidden; }

.preview-thumb {
  height: 120px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%);
  display: flex; align-items: center; justify-content: center;
}

.preview-body { padding: 1rem; }
.preview-tags { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-bottom: 0.5rem; }
.preview-title { font-family: var(--font-headline); font-size: 0.9375rem; font-weight: 700; color: var(--on-surface); }
.preview-desc  { font-size: 0.8rem; color: var(--on-surface-variant); margin-top: 0.25rem; line-height: 1.5; }

/* Step Nav */
.step-nav { display: flex; justify-content: space-between; align-items: center; padding-top: 0.5rem; }

/* Success */
.publish-success {
  display: flex; flex-direction: column; align-items: center;
  text-align: center; gap: 1.25rem; padding: 2rem 1rem;
}

.success-icon-wrap {
  width: 80px; height: 80px; border-radius: var(--radius-full);
  background: rgba(22,163,74,0.1);
  display: flex; align-items: center; justify-content: center;
}

.success-title { font-family: var(--font-headline); font-size: 1.75rem; font-weight: 700; color: var(--on-surface); }
.success-desc  { font-size: 0.9375rem; color: var(--on-surface-variant); max-width: 400px; line-height: 1.65; }

.success-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center; }
</style>
