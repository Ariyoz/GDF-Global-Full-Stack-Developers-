<template>
  <div class="jobs-root">

    <!-- ══ HERO ══ -->
    <div class="jobs-hero">
      <div class="hero-mesh" aria-hidden="true">
        <div class="mesh-blob mesh-1" />
        <div class="mesh-blob mesh-2" />
        <div class="mesh-blob mesh-3" />
        <div class="hero-grid" />
      </div>

      <div class="container-gfd hero-body">
        <!-- Top row: tag + actions -->
        <div class="hero-toprow animate-fade-in-up">
          <div class="hero-tag">
            <span class="tag-dot" />
            {{ jobs.length }} open positions
          </div>
          <div class="hero-actions">
            <button v-if="isDeveloper" class="btn-my-apps" @click="fetchMyApplications">
              <span class="material-symbols-outlined">work_history</span>
              My Applications
            </button>
            <button v-if="isClient || authStore.profile?.role === 'admin'" class="btn-post" @click="showPostJob = true">
              <span class="material-symbols-outlined">add</span>
              Post a Job
            </button>
          </div>
        </div>

        <!-- Headline -->
        <h1 class="hero-h animate-fade-in-up delay-100">
          Find your next<br /><span class="text-gradient">dream opportunity</span>
        </h1>
        <p class="hero-sub animate-fade-in-up delay-200">
          Browse hundreds of remote and on-site roles from verified companies and clients.
        </p>

        <!-- Search bar -->
        <div class="search-bar animate-fade-in-up delay-300" :class="{ focused: searchFocused }">
          <span class="material-symbols-outlined s-ico">search</span>
          <input
            v-model="searchQuery" type="text"
            placeholder="Search job title, skill, or company…"
            class="s-inp" autocomplete="off"
            @input="debouncedSearch"
            @focus="searchFocused = true"
            @blur="searchFocused = false"
          />
          <button v-if="searchQuery" class="s-clear" @click="searchQuery = ''; fetchJobs()">
            <span class="material-symbols-outlined" style="font-size:16px">close</span>
          </button>
          <button class="s-btn" @click="fetchJobs">Search</button>
        </div>

        <!-- Filter chips -->
        <div class="filter-chips animate-fade-in-up delay-400">
          <button
            v-for="f in JOB_FILTERS" :key="f.value"
            class="fchip" :class="{ active: activeFilter === f.value }"
            @click="activeFilter = f.value; fetchJobs()"
          >{{ f.label }}</button>
        </div>
      </div>
    </div>

    <!-- ══ CONTENT AREA ══ -->
    <div class="container-gfd jobs-content">

      <!-- Toolbar -->
      <div class="jobs-toolbar">
        <span class="results-count">
          <strong>{{ jobs.length }}</strong> job{{ jobs.length !== 1 ? 's' : '' }} found
        </span>
        <div class="toolbar-right">
          <select v-model="sortBy" class="sort-sel gfd-select">
            <option value="newest">Newest First</option>
            <option value="salary">Highest Salary</option>
            <option value="applications">Most Applied</option>
          </select>
          <div class="view-toggle">
            <button :class="{ active: viewMode === 'grid' }" @click="viewMode = 'grid'" title="Grid view">
              <span class="material-symbols-outlined" style="font-size:18px">grid_view</span>
            </button>
            <button :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'" title="List view">
              <span class="material-symbols-outlined" style="font-size:18px">table_rows</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Skeleton loading -->
      <div v-if="loading" class="jobs-grid">
        <div v-for="i in 6" :key="i" class="job-skel">
          <div class="skel-strip shimmer" />
          <div class="skel-body">
            <div class="skel-row">
              <div class="skel-logo shimmer" />
              <div class="skel-lines">
                <div class="skel-line shimmer" style="width:60%" />
                <div class="skel-line shimmer" style="width:40%;margin-top:.4rem" />
              </div>
            </div>
            <div class="skel-line shimmer" style="width:90%;margin-top:1rem" />
            <div class="skel-line shimmer" style="width:75%;margin-top:.4rem" />
            <div class="skel-tags">
              <div class="skel-tag shimmer" />
              <div class="skel-tag shimmer" />
              <div class="skel-tag shimmer" />
            </div>
          </div>
        </div>
      </div>

      <!-- Jobs grid -->
      <div v-else-if="sortedJobs.length" :class="viewMode === 'grid' ? 'jobs-grid' : 'jobs-list'">

        <!-- Grid cards -->
        <template v-if="viewMode === 'grid'">
        <article
          v-for="job in sortedJobs" :key="job.id"
          class="job-card animate-fade-in-up"
          @click="openJobDetail(job)"
          tabindex="0"
          :aria-label="`${job.title} at ${job.company || job.poster_name}`"
        >
          <!-- Coloured top strip -->
          <div class="jc-strip" :data-type="job.job_type || 'full_time'" />

          <!-- Card header -->
          <div class="jc-top">
            <div class="jc-logo">
              <img v-if="job.company_logo" :src="job.company_logo" :alt="job.company"
                class="jc-logo-img" @error="$event.target.style.display='none'" />
              <span v-else class="jc-logo-ini">{{ (job.company || 'C')[0] }}</span>
            </div>
            <div class="jc-info">
              <h3 class="jc-title">{{ job.title }}</h3>
              <p class="jc-company">
                <span class="material-symbols-outlined" style="font-size:13px;vertical-align:-2px">business</span>
                {{ job.company || job.poster_name }}
              </p>
            </div>
            <button
              v-if="isClient || job.poster_name === authStore.profile?.full_name"
              class="jc-del" title="Delete job" @click.stop="deleteJob(job)"
            >
              <span class="material-symbols-outlined" style="font-size:16px">delete</span>
            </button>
          </div>

          <!-- Location -->
          <p v-if="job.location || job.is_remote" class="jc-location">
            <span class="material-symbols-outlined" style="font-size:13px">location_on</span>
            {{ job.is_remote ? 'Remote' : job.location }}
          </p>

          <!-- Type / remote / level chips -->
          <div class="jc-tags">
            <span class="jc-tag">{{ (job.job_type || 'full_time').replace('_', ' ') }}</span>
            <span v-if="job.is_remote" class="jc-tag jc-remote">Remote</span>
            <span v-if="job.experience_level" class="jc-tag">{{ job.experience_level }}</span>
          </div>

          <!-- 1-line description -->
          <p class="jc-desc">
            {{ (job.description || '').slice(0, 110) }}{{ (job.description || '').length > 110 ? '…' : '' }}
          </p>

          <!-- Skills -->
          <div v-if="job.skills_required?.length" class="jc-skills">
            <span v-for="s in job.skills_required.slice(0, 3)" :key="s" class="jc-skill">{{ s }}</span>
            <span v-if="job.skills_required.length > 3" class="jc-skill jc-more">+{{ job.skills_required.length - 3 }}</span>
          </div>

          <!-- Footer -->
          <div class="jc-foot">
            <span v-if="job.salary_min" class="jc-salary">
              {{ fmtSalary(job.salary_min) }}{{ job.salary_max ? ' – ' + fmtSalary(job.salary_max) : '' }}
              <span class="jc-salary-period">/yr</span>
            </span>
            <span v-else class="jc-salary-empty">Salary undisclosed</span>
            <div class="jc-meta-right">
              <span class="jc-stat">
                <span class="material-symbols-outlined" style="font-size:13px">group</span>
                {{ job.application_count || 0 }}
              </span>
              <span class="jc-time">{{ formatTime(job.created_at) }}</span>
            </div>
          </div>
        </article>
        </template>

        <!-- List view rows -->
        <template v-else>
          <div v-for="job in sortedJobs" :key="job.id"
            class="job-row animate-fade-in-up"
            @click="openJobDetail(job)">
            <!-- Type strip (left border) -->
            <div class="jr-strip" :data-type="job.job_type || 'full_time'" />
            <!-- Logo -->
            <div class="jr-logo">
              <img v-if="job.company_logo" :src="job.company_logo" :alt="job.company"
                class="jr-logo-img" @error="$event.target.style.display='none'" />
              <span v-else class="jr-logo-ini">{{ (job.company || 'C')[0] }}</span>
            </div>
            <!-- Info -->
            <div class="jr-info">
              <h3 class="jr-title">{{ job.title }}</h3>
              <p class="jr-company">{{ job.company || job.poster_name }}</p>
              <div class="jr-tags">
                <span class="jc-tag">{{ (job.job_type || 'full_time').replace('_', ' ') }}</span>
                <span v-if="job.is_remote" class="jc-tag jc-remote">Remote</span>
                <span v-if="job.location && !job.is_remote" class="jc-tag">{{ job.location }}</span>
                <span v-for="s in (job.skills_required || []).slice(0, 2)" :key="s" class="jc-skill">{{ s }}</span>
              </div>
              <!-- Salary + meta visible on mobile inside the info block -->
              <div class="jr-salary-row">
                <span v-if="job.salary_min" class="jr-salary">
                  {{ fmtSalary(job.salary_min) }}{{ job.salary_max ? '–' + fmtSalary(job.salary_max) : '' }}
                  <span class="jc-salary-period">/yr</span>
                </span>
                <span v-else class="jr-salary-empty">Undisclosed</span>
                <div class="jr-bottom-meta">
                  <span class="jc-stat">
                    <span class="material-symbols-outlined" style="font-size:13px">group</span>
                    {{ job.application_count || 0 }}
                  </span>
                  <span class="jc-time">{{ formatTime(job.created_at) }}</span>
                </div>
              </div>
            </div>
            <!-- Right meta — desktop only -->
            <div class="jr-meta">
              <span v-if="job.salary_min" class="jr-salary">
                {{ fmtSalary(job.salary_min) }}{{ job.salary_max ? '–' + fmtSalary(job.salary_max) : '' }}<span class="jc-salary-period">/yr</span>
              </span>
              <span v-else class="jr-salary-empty" style="font-size:.75rem">Undisclosed</span>
              <div style="display:flex;align-items:center;gap:.5rem">
                <span class="jc-stat"><span class="material-symbols-outlined" style="font-size:13px">group</span>{{ job.application_count || 0 }}</span>
                <span class="jc-time">{{ formatTime(job.created_at) }}</span>
              </div>
            </div>
          </div>
        </template>

      </div>

      <!-- Empty state -->
      <div v-else class="jobs-empty">
        <div class="empty-ico-wrap">
          <span class="material-symbols-outlined">work_off</span>
        </div>
        <h3 class="empty-title">No jobs found</h3>
        <p class="empty-sub">Try different search terms or check back later.</p>
        <button v-if="isClient" class="btn-primary" @click="showPostJob = true">Post the first job</button>
      </div>

    </div>

    <!-- ══════════════════════════════════════════════ -->
    <!-- JOB DETAIL MODAL                               -->
    <!-- ══════════════════════════════════════════════ -->
    <Transition name="modal">
      <div v-if="selectedJob" class="modal-overlay" @click.self="selectedJob = null">
        <div class="modal-sheet">
          <div class="modal-handle" />

          <!-- Company header -->
          <div class="modal-hdr">
            <div class="modal-hdr-left">
              <div class="modal-logo">
                <img v-if="selectedJob.company_logo" :src="selectedJob.company_logo" class="modal-logo-img" alt="" />
                <span v-else class="modal-logo-ini">{{ (selectedJob.company || 'C')[0] }}</span>
              </div>
              <div>
                <h2 class="modal-title">{{ selectedJob.title }}</h2>
                <a v-if="selectedJob.company_url" :href="selectedJob.company_url" target="_blank" rel="noopener"
                  class="modal-company-lnk" @click.stop>
                  {{ selectedJob.company }}
                  <span class="material-symbols-outlined" style="font-size:11px">open_in_new</span>
                </a>
                <p v-else class="modal-company">{{ selectedJob.company }}</p>
              </div>
            </div>
            <button class="modal-close" @click="selectedJob = null" aria-label="Close">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Scrollable body -->
          <div class="modal-body">
            <!-- Salary -->
            <div v-if="selectedJob.salary_min" class="modal-salary">
              <span class="material-symbols-outlined">payments</span>
              {{ fmtSalary(selectedJob.salary_min) }}{{ selectedJob.salary_max ? ' – ' + fmtSalary(selectedJob.salary_max) : '' }} / year
            </div>

            <!-- Tags -->
            <div class="modal-tags">
              <span class="jc-tag">{{ (selectedJob.job_type || 'full_time').replace('_', ' ') }}</span>
              <span v-if="selectedJob.is_remote" class="jc-tag jc-remote">Remote</span>
              <span v-if="selectedJob.location" class="jc-tag">{{ selectedJob.location }}</span>
              <span v-if="selectedJob.experience_level" class="jc-tag">{{ selectedJob.experience_level }}</span>
            </div>

            <!-- Stats -->
            <div class="modal-stats">
              <div class="mstat">
                <span class="material-symbols-outlined">visibility</span>
                {{ selectedJob.view_count || 0 }} views
              </div>
              <div class="mstat">
                <span class="material-symbols-outlined">description</span>
                {{ selectedJob.application_count || 0 }} applicants
              </div>
              <div class="mstat">
                <span class="material-symbols-outlined">schedule</span>
                {{ formatTime(selectedJob.created_at) }}
              </div>
            </div>

            <!-- Description -->
            <div class="modal-section">
              <h4 class="modal-section-title">Description</h4>
              <p class="modal-section-body" style="white-space:pre-line">{{ selectedJob.description }}</p>
            </div>
            <div v-if="selectedJob.requirements" class="modal-section">
              <h4 class="modal-section-title">Requirements</h4>
              <p class="modal-section-body" style="white-space:pre-line">{{ selectedJob.requirements }}</p>
            </div>
            <div v-if="selectedJob.skills_required?.length" class="modal-section">
              <h4 class="modal-section-title">Skills needed</h4>
              <div class="modal-skills">
                <span v-for="s in selectedJob.skills_required" :key="s" class="modal-skill">{{ s }}</span>
              </div>
            </div>
          </div>

          <!-- Sticky footer -->
          <div class="modal-foot">
            <button v-if="isDeveloper" class="btn-apply" @click="showApplyModal = true">
              <span class="material-symbols-outlined">send</span>
              Apply Now
            </button>
            <template v-else-if="isClient || selectedJob?.poster_name === authStore.profile?.full_name">
              <button class="btn-applicants" @click="viewApplicants(selectedJob)">
                <span class="material-symbols-outlined">group</span>
                Applicants ({{ selectedJob?.application_count || 0 }})
              </button>
              <button class="btn-edit" @click="openEditJob(selectedJob)">
                <span class="material-symbols-outlined">edit</span>Edit
              </button>
              <button v-if="selectedJob?.status !== 'closed'" class="btn-close-job" @click="closeJob(selectedJob)">
                <span class="material-symbols-outlined">lock</span>Close
              </button>
              <span v-else class="closed-badge">Closed</span>
            </template>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ══════════════════════════════════════════════ -->
    <!-- APPLY MODAL                                    -->
    <!-- ══════════════════════════════════════════════ -->
    <Transition name="modal">
      <div v-if="showApplyModal" class="modal-overlay" @click.self="showApplyModal = false">
        <div class="modal-sheet modal-form">
          <div class="modal-handle" />
          <div class="modal-hdr">
            <h2 class="modal-title">Apply — {{ selectedJob?.title }}</h2>
            <button class="modal-close" @click="showApplyModal = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-fields">
              <div class="form-field">
                <label>Cover Letter <span class="req">*</span></label>
                <textarea v-model="applyForm.cover_letter" rows="4" placeholder="Why are you a great fit?" />
              </div>
              <div class="form-row">
                <div class="form-field">
                  <label>Resume URL</label>
                  <input v-model="applyForm.resume_url" type="url" placeholder="https://drive.google.com/…" />
                </div>
                <div class="form-field">
                  <label>Portfolio URL</label>
                  <input v-model="applyForm.portfolio_url" type="url" placeholder="https://yoursite.com" />
                </div>
              </div>
              <div class="form-row">
                <div class="form-field">
                  <label>GitHub URL</label>
                  <input v-model="applyForm.github_url" type="url" placeholder="https://github.com/…" />
                </div>
                <div class="form-field">
                  <label>Years Experience</label>
                  <input v-model.number="applyForm.years_experience" type="number" placeholder="3" />
                </div>
              </div>
              <div class="form-field">
                <label>Availability</label>
                <select v-model="applyForm.availability">
                  <option value="immediately">Immediately</option>
                  <option value="2_weeks">2 Weeks Notice</option>
                  <option value="1_month">1 Month</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>
          </div>
          <div class="modal-foot">
            <button class="btn-apply" @click="submitApplication" :disabled="!applyForm.cover_letter">
              <span class="material-symbols-outlined">send</span>
              Submit Application
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ══════════════════════════════════════════════ -->
    <!-- POST JOB MODAL                                 -->
    <!-- ══════════════════════════════════════════════ -->
    <Transition name="modal">
      <div v-if="showPostJob" class="modal-overlay" @click.self="showPostJob = false">
        <div class="modal-sheet modal-form">
          <div class="modal-handle" />
          <div class="modal-hdr">
            <h2 class="modal-title">Post a Job</h2>
            <button class="modal-close" @click="showPostJob = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-fields">
              <div class="form-field">
                <label>Job Title <span class="req">*</span></label>
                <input v-model="jobForm.title" type="text" placeholder="Senior Frontend Developer" />
              </div>
              <div class="form-row">
                <div class="form-field"><label>Company</label>
                  <input v-model="jobForm.company" type="text" placeholder="Company name" />
                </div>
                <div class="form-field"><label>Location</label>
                  <input v-model="jobForm.location" type="text" placeholder="Remote / City" />
                </div>
              </div>
              <div class="form-field">
                <label>Company Logo</label>
                <div class="logo-box">
                  <div class="logo-preview" :class="{ filled: jobForm.company_logo }">
                    <img v-if="jobForm.company_logo" :src="jobForm.company_logo" @error="jobForm.company_logo = ''" alt="Logo" />
                    <span v-else class="material-symbols-outlined" style="font-size:22px;color:var(--on-surface-variant)">add_photo_alternate</span>
                  </div>
                  <div class="logo-opts">
                    <button type="button" class="logo-upload-btn" @click="$refs.logoFileInput.click()" :disabled="logoUploading">
                      <span class="material-symbols-outlined" style="font-size:14px">upload</span>
                      {{ logoUploading ? 'Uploading…' : 'Upload' }}
                    </button>
                    <input ref="logoFileInput" type="file" accept="image/*" class="hidden-f" @change="uploadLogoFile" />
                    <span style="font-size:.72rem;color:var(--on-surface-variant)">or</span>
                    <input v-model="jobForm.company_logo" type="url" placeholder="Paste logo URL" class="logo-url-inp" />
                  </div>
                </div>
              </div>
              <div class="form-field">
                <label>Description <span class="req">*</span></label>
                <textarea v-model="jobForm.description" rows="4" placeholder="Describe the role…" />
              </div>
              <div class="form-field">
                <label>Requirements</label>
                <textarea v-model="jobForm.requirements" rows="3" placeholder="Skills / experience needed…" />
              </div>
              <div class="form-field">
                <label>Skills <span class="field-hint">(comma separated)</span></label>
                <input v-model="jobForm.skillsText" type="text" placeholder="React, Node.js, TypeScript" />
              </div>
              <div class="form-row">
                <div class="form-field"><label>Job Type</label>
                  <select v-model="jobForm.job_type">
                    <option value="full_time">Full Time</option>
                    <option value="part_time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="freelance">Freelance</option>
                    <option value="remote">Remote</option>
                  </select>
                </div>
                <div class="form-field"><label>Company Website</label>
                  <input v-model="jobForm.company_url" type="url" placeholder="https://…" />
                </div>
              </div>
              <div class="form-row">
                <div class="form-field"><label>Min Salary ($)</label>
                  <input v-model.number="jobForm.salary_min" type="number" placeholder="50000" />
                </div>
                <div class="form-field"><label>Max Salary ($)</label>
                  <input v-model.number="jobForm.salary_max" type="number" placeholder="80000" />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-foot">
            <button class="btn-apply" @click="postJob" :disabled="!jobForm.title || !jobForm.description">
              <span class="material-symbols-outlined">publish</span>
              Post Job
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ══════════════════════════════════════════════ -->
    <!-- EDIT JOB MODAL                                 -->
    <!-- ══════════════════════════════════════════════ -->
    <Transition name="modal">
      <div v-if="showEditJob" class="modal-overlay" @click.self="showEditJob = false">
        <div class="modal-sheet modal-form">
          <div class="modal-handle" />
          <div class="modal-hdr">
            <h2 class="modal-title">Edit Job</h2>
            <button class="modal-close" @click="showEditJob = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-fields">
              <div class="form-field">
                <label>Job Title <span class="req">*</span></label>
                <input v-model="editForm.title" type="text" />
              </div>
              <div class="form-row">
                <div class="form-field"><label>Company</label>
                  <input v-model="editForm.company" type="text" />
                </div>
                <div class="form-field"><label>Location</label>
                  <input v-model="editForm.location" type="text" />
                </div>
              </div>
              <div class="form-field">
                <label>Description <span class="req">*</span></label>
                <textarea v-model="editForm.description" rows="4" />
              </div>
              <div class="form-field">
                <label>Requirements</label>
                <textarea v-model="editForm.requirements" rows="3" />
              </div>
              <div class="form-field">
                <label>Skills <span class="field-hint">(comma separated)</span></label>
                <input v-model="editForm.skillsText" type="text" />
              </div>
              <div class="form-row">
                <div class="form-field"><label>Job Type</label>
                  <select v-model="editForm.job_type">
                    <option value="full_time">Full Time</option>
                    <option value="part_time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="freelance">Freelance</option>
                    <option value="remote">Remote</option>
                  </select>
                </div>
                <div class="form-field"><label>Company Logo URL</label>
                  <input v-model="editForm.company_logo" type="url" />
                </div>
              </div>
              <div class="form-row">
                <div class="form-field"><label>Min Salary ($)</label>
                  <input v-model.number="editForm.salary_min" type="number" />
                </div>
                <div class="form-field"><label>Max Salary ($)</label>
                  <input v-model.number="editForm.salary_max" type="number" />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-foot">
            <button class="btn-apply" @click="saveEditJob" :disabled="!editForm.title || !editForm.description || editSaving">
              <span v-if="editSaving" class="btn-spin" />
              <span v-else class="material-symbols-outlined">save</span>
              {{ editSaving ? 'Saving…' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ══════════════════════════════════════════════ -->
    <!-- MY APPLICATIONS MODAL                          -->
    <!-- ══════════════════════════════════════════════ -->
    <Transition name="modal">
      <div v-if="showMyApplications" class="modal-overlay" @click.self="showMyApplications = false">
        <div class="modal-sheet">
          <div class="modal-handle" />
          <div class="modal-hdr">
            <h2 class="modal-title">My Applications</h2>
            <button class="modal-close" @click="showMyApplications = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="modal-body">
            <div v-if="!myApplications.length" class="jobs-empty" style="padding:2rem 0">
              <span class="material-symbols-outlined" style="font-size:2.5rem;color:var(--outline)">work_history</span>
              <p>No applications yet</p>
            </div>
            <div v-for="app in myApplications" :key="app.id" class="app-card">
              <div class="app-card-header">
                <div>
                  <h4 class="app-title">{{ app.job_title }}</h4>
                  <p class="app-company">{{ app.company }} · {{ app.job_type?.replace('_', ' ') }}</p>
                  <p class="app-date">Applied {{ formatTime(app.created_at) }}</p>
                </div>
                <span class="app-status" :class="app.status">{{ app.status }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ══════════════════════════════════════════════ -->
    <!-- APPLICANTS MODAL                               -->
    <!-- ══════════════════════════════════════════════ -->
    <Transition name="modal">
      <div v-if="showApplicants" class="modal-overlay" @click.self="showApplicants = false">
        <div class="modal-sheet">
          <div class="modal-handle" />
          <div class="modal-hdr">
            <h2 class="modal-title">Applicants</h2>
            <button class="modal-close" @click="showApplicants = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="modal-body">
            <div v-if="!applicants.length" class="jobs-empty" style="padding:2rem 0">
              <span class="material-symbols-outlined" style="font-size:2rem;color:var(--outline)">person_off</span>
              <p>No applications yet</p>
            </div>
            <div v-for="app in applicants" :key="app.id" class="applicant-card">
              <div class="applicant-hdr">
                <div class="applicant-av">
                  <img v-if="app.applicant_avatar" :src="app.applicant_avatar" class="applicant-av-img" alt="" />
                  <span v-else>{{ (app.applicant_name || 'U')[0] }}</span>
                </div>
                <div class="applicant-info">
                  <div style="display:flex;align-items:center;gap:.5rem;flex-wrap:wrap">
                    <h4 class="applicant-name">{{ app.applicant_name }}</h4>
                    <RouterLink v-if="app.applicant_id" :to="`/developer/${app.applicant_id}`" target="_blank" class="profile-link">
                      <span class="material-symbols-outlined" style="font-size:12px">open_in_new</span>Profile
                    </RouterLink>
                  </div>
                  <p class="applicant-meta">
                    {{ app.years_experience ? app.years_experience + ' yrs' : '' }}
                    {{ app.availability ? '· ' + app.availability.replace('_', ' ') : '' }}
                  </p>
                </div>
                <span class="app-status" :class="app.status">{{ app.status }}</span>
              </div>
              <div v-if="app.cover_letter" class="applicant-cover">{{ app.cover_letter }}</div>
              <div class="applicant-links">
                <a v-if="app.resume_url"    :href="app.resume_url"    target="_blank" class="app-link">📄 Resume</a>
                <a v-if="app.portfolio_url" :href="app.portfolio_url" target="_blank" class="app-link">🌐 Portfolio</a>
                <a v-if="app.github_url"    :href="app.github_url"    target="_blank" class="app-link">💻 GitHub</a>
              </div>
              <div v-if="['pending','reviewed','shortlisted'].includes(app.status)" class="applicant-actions">
                <button class="act-shortlist" v-if="app.status !== 'shortlisted'" @click="updateApplicationStatus(app, 'shortlisted')">
                  <span class="material-symbols-outlined" style="font-size:14px">check</span>Shortlist
                </button>
                <button class="act-accept" v-if="app.status === 'shortlisted'" @click="updateApplicationStatus(app, 'accepted')">
                  <span class="material-symbols-outlined" style="font-size:14px">how_to_reg</span>Accept
                </button>
                <button class="act-chat" @click="openHiringChat(selectedJob, app)">
                  <span class="material-symbols-outlined" style="font-size:14px">chat</span>Message
                </button>
                <button class="act-decline" @click="updateApplicationStatus(app, 'rejected')">
                  <span class="material-symbols-outlined" style="font-size:14px">close</span>Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { useSeo, pageSeo } from '@/composables/useSeo'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useUiStore } from '@/store/ui'
import { useCurrencyStore } from '@/store/currency'
import http from '@/services/http'

useSeo(pageSeo.jobs)
const authStore     = useAuthStore()
const uiStore       = useUiStore()
const router        = useRouter()
const currencyStore = useCurrencyStore()
const fmtSalary     = (usd) => currencyStore.format(usd)

const jobs             = ref([])
const loading          = ref(true)
const searchQuery      = ref('')
const searchFocused    = ref(false)
const activeFilter     = ref('all')
const sortBy           = ref('newest')
const selectedJob      = ref(null)
const showApplyModal   = ref(false)
const showPostJob      = ref(false)
const showEditJob      = ref(false)
const showApplicants   = ref(false)
const showMyApplications = ref(false)
const applicants       = ref([])
const myApplications   = ref([])
const logoUploading    = ref(false)
const editSaving       = ref(false)
const currentReviewJob = ref(null)
const viewMode         = ref('grid')

const isClient    = computed(() => ['client','admin'].includes(authStore.profile?.role))
const isDeveloper = computed(() => authStore.profile?.role === 'developer')

const JOB_FILTERS = [
  { value: 'all',       label: 'All Jobs' },
  { value: 'full_time', label: 'Full Time' },
  { value: 'remote',    label: 'Remote' },
  { value: 'contract',  label: 'Contract' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'part_time', label: 'Part Time' },
]

const sortedJobs = computed(() => {
  const list = [...jobs.value]
  if (sortBy.value === 'salary')       list.sort((a,b) => (b.salary_min||0) - (a.salary_min||0))
  if (sortBy.value === 'applications') list.sort((a,b) => (b.application_count||0) - (a.application_count||0))
  return list
})

const applyForm = ref({ cover_letter:'', resume_url:'', portfolio_url:'', github_url:'', years_experience:null, availability:'immediately' })
const jobForm   = ref({ title:'', company:'', company_logo:'', company_url:'', description:'', requirements:'', skillsText:'', job_type:'full_time', location:'', salary_min:null, salary_max:null })
const editForm  = ref({ id:'', title:'', company:'', company_logo:'', company_url:'', description:'', requirements:'', skillsText:'', job_type:'full_time', location:'', salary_min:null, salary_max:null })

let searchTimeout = null
function debouncedSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(fetchJobs, 450)
}

async function fetchJobs() {
  loading.value = true
  try {
    let url = '/jobs?limit=50'
    if (activeFilter.value !== 'all') url += `&job_type=${activeFilter.value}`
    if (searchQuery.value) url += `&search=${encodeURIComponent(searchQuery.value)}`
    try {
      const data = await http.get(url)
      jobs.value = data.jobs || []
    } catch {
      const base = import.meta.env.VITE_API_BASE_URL || 'https://gfd-backend.onrender.com/api/v1'
      const res = await fetch(`${base}${url}`)
      if (res.ok) jobs.value = (await res.json()).jobs || []
    }
  } catch { jobs.value = [] }
  finally { loading.value = false }
}

async function openJobDetail(job) {
  // Navigate to the full-page job detail / apply view
  router.push(`/apply/${job.id}`)
}

async function postJob() {
  try {
    await http.post('/jobs/', {
      title: jobForm.value.title, company: jobForm.value.company || undefined,
      company_logo: jobForm.value.company_logo || undefined, company_url: jobForm.value.company_url || undefined,
      description: jobForm.value.description, requirements: jobForm.value.requirements || undefined,
      skills_required: jobForm.value.skillsText ? jobForm.value.skillsText.split(',').map(s=>s.trim()).filter(Boolean) : [],
      job_type: jobForm.value.job_type, location: jobForm.value.location || undefined,
      is_remote: !jobForm.value.location || jobForm.value.location.toLowerCase().includes('remote'),
      salary_min: jobForm.value.salary_min || undefined, salary_max: jobForm.value.salary_max || undefined,
    })
    uiStore.showSuccess('Job posted!')
    showPostJob.value = false
    jobForm.value = { title:'', company:'', company_logo:'', company_url:'', description:'', requirements:'', skillsText:'', job_type:'full_time', location:'', salary_min:null, salary_max:null }
    fetchJobs()
  } catch (err) { uiStore.showError(err?.response?.data?.detail || 'Failed to post job') }
}

async function uploadLogoFile(e) {
  const file = e.target.files?.[0]; if (!file) return
  logoUploading.value = true
  try {
    const fd = new FormData(); fd.append('file', file)
    const data = await http.post('/uploads/media', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    if (data.url) jobForm.value.company_logo = data.url
  } catch { uiStore.showError('Upload failed') }
  finally { logoUploading.value = false; e.target.value = '' }
}

function openEditJob(job) {
  editForm.value = { id:job.id, title:job.title||'', company:job.company||'', company_logo:job.company_logo||'', company_url:job.company_url||'', description:job.description||'', requirements:job.requirements||'', skillsText:(job.skills_required||[]).join(', '), job_type:job.job_type||'full_time', location:job.location||'', salary_min:job.salary_min||null, salary_max:job.salary_max||null }
  selectedJob.value = null; showEditJob.value = true
}

async function saveEditJob() {
  editSaving.value = true
  try {
    await http.patch(`/jobs/${editForm.value.id}`, { ...editForm.value, skills_required: editForm.value.skillsText ? editForm.value.skillsText.split(',').map(s=>s.trim()).filter(Boolean) : [], is_remote: !editForm.value.location || editForm.value.location.toLowerCase().includes('remote') })
    uiStore.showSuccess('Job updated!'); showEditJob.value = false; fetchJobs()
  } catch (err) { uiStore.showError(err?.response?.data?.detail || 'Failed to update') }
  finally { editSaving.value = false }
}

async function submitApplication() {
  if (!selectedJob.value) return
  try {
    await http.post(`/jobs/${selectedJob.value.id}/apply`, applyForm.value)
    uiStore.showSuccess('Application submitted!')
    showApplyModal.value = false; selectedJob.value = null
    applyForm.value = { cover_letter:'', resume_url:'', portfolio_url:'', github_url:'', years_experience:null, availability:'immediately' }
  } catch (err) { uiStore.showError(err?.response?.data?.detail || 'Failed to apply') }
}

async function deleteJob(job) {
  if (!confirm('Delete this job posting?')) return
  try { await http.request({ method:'DELETE', url:`/jobs/${job.id}` }); jobs.value = jobs.value.filter(j=>j.id!==job.id); uiStore.showSuccess('Job deleted') }
  catch { uiStore.showError('Failed to delete') }
}

async function viewApplicants(job) {
  if (!job) return; currentReviewJob.value = job
  try { const data = await http.get(`/jobs/${job.id}/applications`); applicants.value = data.applications||[]; showApplicants.value = true; selectedJob.value = null }
  catch (err) { uiStore.showError(err?.response?.data?.detail || 'Failed to load applicants') }
}

async function updateApplicationStatus(app, status) {
  try {
    await http.patch(`/jobs/applications/${app.id}`, { status })
    app.status = status
    uiStore.showSuccess(status === 'accepted' ? '🎉 Accepted!' : status === 'shortlisted' ? 'Shortlisted!' : 'Status updated')
  } catch { uiStore.showError('Failed to update status') }
}

async function openHiringChat(job, app) {
  if (!app?.applicant_id) { uiStore.showError('Applicant not found'); return }
  try {
    const data = await http.post('/messages/conversations', { participant_ids:[app.applicant_id], type:'direct' })
    showApplicants.value = false; router.push({ path:'/messaging', query:{ conv:data.id } })
  } catch (err) { uiStore.showError(err?.response?.data?.detail || 'Could not open chat') }
}

async function closeJob(job) {
  if (!confirm('Close this job?')) return
  try { await http.patch(`/jobs/${job.id}/close`, {}); job.status='closed'; jobs.value.forEach(j=>{ if(j.id===job.id) j.status='closed' }); uiStore.showSuccess('Job closed'); selectedJob.value = null }
  catch { uiStore.showError('Failed to close job') }
}

async function fetchMyApplications() {
  try { const data = await http.get('/jobs/my-applications'); myApplications.value = data.applications||[]; showMyApplications.value = true }
  catch (err) { uiStore.showError(err?.response?.data?.detail || 'Failed to load applications') }
}

function formatTime(d) {
  if (!d) return ''
  const diff = (Date.now() - new Date(d)) / 1000
  if (diff < 3600)   return `${Math.floor(diff/60)}m ago`
  if (diff < 86400)  return `${Math.floor(diff/3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff/86400)}d ago`
  return new Date(d).toLocaleDateString('en-US',{month:'short',day:'numeric'})
}

let refreshInterval = null
onMounted(() => { fetchJobs(); refreshInterval = setInterval(fetchJobs, 30000) })
onUnmounted(() => { if (refreshInterval) clearInterval(refreshInterval) })
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════ */
.jobs-root { background: var(--background); min-height: 100vh; }

/* ═══════════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════════ */
.jobs-hero {
  position: relative; overflow: hidden;
  background: var(--background);
  padding: calc(5rem + env(safe-area-inset-top, 0px)) 0 3.5rem;
}

/* Mesh background */
.hero-mesh { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.mesh-blob { position: absolute; border-radius: 50%; filter: blur(90px); animation: blobFloat 8s ease-in-out infinite; }
.mesh-1 {
  width: 600px; height: 480px; top: -140px; right: -100px;
  background: radial-gradient(circle, rgba(99,14,212,.13) 0%, transparent 70%);
  animation-delay: 0s;
}
.mesh-2 {
  width: 400px; height: 400px; bottom: -100px; left: -80px;
  background: radial-gradient(circle, rgba(168,85,247,.1) 0%, transparent 70%);
  animation-delay: -4s;
}
.mesh-3 {
  width: 300px; height: 300px; top: 40%; left: 40%;
  background: radial-gradient(circle, rgba(99,14,212,.07) 0%, transparent 70%);
  animation-delay: -2s;
}

@keyframes blobFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33%       { transform: translate(12px, -16px) scale(1.04); }
  66%       { transform: translate(-8px, 10px) scale(.97); }
}

/* Dot grid */
.hero-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(var(--outline-variant) 1px, transparent 1px),
    linear-gradient(90deg, var(--outline-variant) 1px, transparent 1px);
  background-size: 60px 60px;
  opacity: .22;
  mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
}

/* Hero body */
.hero-body {
  position: relative; z-index: 1;
  display: flex; flex-direction: column; align-items: center; text-align: center; gap: 1.25rem;
}

/* Top row: tag + action buttons */
.hero-toprow {
  display: flex; align-items: center; justify-content: space-between;
  width: 100%; max-width: 780px; flex-wrap: wrap; gap: .75rem;
}
.hero-tag {
  display: inline-flex; align-items: center; gap: .4rem;
  padding: .3rem .875rem;
  background: var(--surface-container-low);
  border: 1px solid var(--outline-variant);
  border-radius: 999px;
  font-family: var(--font-headline); font-size: .8rem; font-weight: 600; color: var(--primary);
}
.tag-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: #22c55e; box-shadow: 0 0 6px rgba(34,197,94,.65); flex-shrink: 0;
}
.hero-actions { display: flex; align-items: center; gap: .5rem; }
.btn-my-apps, .btn-post {
  display: inline-flex; align-items: center; gap: .35rem;
  padding: .45rem 1rem; border-radius: 12px;
  font-family: var(--font-headline); font-size: .8rem; font-weight: 700;
  cursor: pointer; transition: all .2s; border: 1.5px solid transparent;
}
.btn-my-apps {
  background: var(--surface-container-lowest);
  border-color: var(--outline-variant); color: var(--on-surface);
}
.btn-my-apps:hover { border-color: var(--primary); color: var(--primary); }
.btn-post {
  background: var(--primary); color: #fff;
}
.btn-post:hover { opacity: .9; transform: translateY(-1px); }
.btn-my-apps .material-symbols-outlined,
.btn-post .material-symbols-outlined { font-size: 16px; }

/* Headline */
.hero-h {
  font-family: var(--font-headline); font-size: clamp(2rem, 5.5vw, 3.2rem);
  font-weight: 900; line-height: 1.07; letter-spacing: -.04em;
  color: var(--on-surface); max-width: 640px;
}
.text-gradient {
  background: linear-gradient(135deg, #a855f7 0%, #630ed4 50%, #a855f7 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero-sub {
  font-size: clamp(.95rem, 2vw, 1.1rem); color: var(--on-surface-variant);
  line-height: 1.65; max-width: 500px;
}

/* ═══════════════════════════════════════════════════════════
   SEARCH BAR
═══════════════════════════════════════════════════════════ */
.search-bar {
  display: flex; align-items: center; gap: .5rem;
  width: 100%; max-width: 600px;
  background: var(--surface-container-lowest);
  border: 1.5px solid var(--outline-variant);
  border-radius: 16px; padding: .5rem .5rem .5rem 1rem;
  box-shadow: 0 2px 12px rgba(0,0,0,.07);
  transition: border-color .2s, box-shadow .2s;
}
.search-bar.focused { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(99,14,212,.1); }
.s-ico { color: var(--outline); font-size: 20px; flex-shrink: 0; }
.s-inp {
  flex: 1; border: none; background: transparent;
  font-family: var(--font-body); font-size: .95rem; color: var(--on-surface);
  outline: none; min-width: 0;
}
.s-inp::placeholder { color: var(--outline); }
.s-clear {
  border: none; background: none; cursor: pointer; color: var(--outline);
  display: flex; align-items: center; padding: .25rem; flex-shrink: 0;
}
.s-clear:hover { color: var(--on-surface); }
.s-btn {
  flex-shrink: 0; padding: .55rem 1.2rem;
  background: var(--primary); color: #fff; border: none; border-radius: 12px;
  font-family: var(--font-headline); font-size: .85rem; font-weight: 700;
  cursor: pointer; transition: opacity .15s, transform .15s; white-space: nowrap;
}
.s-btn:hover { opacity: .9; transform: translateY(-1px); }

/* ═══════════════════════════════════════════════════════════
   FILTER CHIPS
═══════════════════════════════════════════════════════════ */
.filter-chips {
  display: flex; flex-wrap: wrap; gap: .4rem; justify-content: center;
}
.fchip {
  padding: .4rem .9rem; border-radius: 999px;
  border: 1.5px solid var(--outline-variant);
  background: none; font-family: var(--font-headline); font-size: .8rem; font-weight: 600;
  color: var(--on-surface-variant); cursor: pointer; transition: all .15s; white-space: nowrap;
}
.fchip:hover { border-color: var(--primary); color: var(--primary); }
.fchip.active {
  border-color: var(--primary); background: var(--primary-fixed); color: var(--primary);
}

/* ═══════════════════════════════════════════════════════════
   CONTENT AREA
═══════════════════════════════════════════════════════════ */
.jobs-content {
  padding-top: 2rem; padding-bottom: 4rem;
}

/* Toolbar */
.jobs-toolbar {
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: .75rem; margin-bottom: 1.5rem;
}
.results-count {
  font-family: var(--font-headline); font-size: .875rem; color: var(--on-surface-variant);
}
.results-count strong { color: var(--on-surface); }
.toolbar-right { display: flex; align-items: center; gap: .5rem; }
.sort-sel {
  padding: .45rem .875rem; border-radius: 12px;
  background: var(--surface-container-lowest); border: 1.5px solid var(--outline-variant);
  color: var(--on-surface); font-family: var(--font-headline); font-size: .82rem; font-weight: 600;
  cursor: pointer; outline: none; transition: border-color .2s;
}
.sort-sel:focus { border-color: var(--primary); }

/* View toggle — matches explore page */
.view-toggle {
  display: flex; gap: .25rem;
  background: var(--surface-container-low);
  border: 1px solid var(--outline-variant);
  border-radius: 12px; padding: .25rem;
}
.view-toggle button {
  width: 32px; height: 32px; border-radius: 8px; border: none;
  background: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: var(--on-surface-variant); transition: all .15s;
}
.view-toggle button.active {
  background: var(--surface-container-highest); color: var(--primary);
}
.view-toggle button:hover:not(.active) { color: var(--on-surface); }

/* ═══════════════════════════════════════════════════════════
   SKELETON LOADING
═══════════════════════════════════════════════════════════ */
@keyframes shimmerMove {
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
.shimmer {
  background: linear-gradient(90deg,
    var(--surface-container-low) 25%,
    var(--surface-container) 50%,
    var(--surface-container-low) 75%
  );
  background-size: 800px 100%;
  animation: shimmerMove 1.4s infinite linear;
  border-radius: 8px;
}
.job-skel {
  border-radius: 18px; overflow: hidden;
  border: 1px solid var(--outline-variant);
  background: var(--surface-container-lowest);
}
.skel-strip { height: 6px; border-radius: 0; }
.skel-body { padding: 1.25rem; display: flex; flex-direction: column; gap: .5rem; }
.skel-row { display: flex; gap: .875rem; align-items: flex-start; }
.skel-logo { width: 48px; height: 48px; border-radius: 12px; flex-shrink: 0; }
.skel-lines { flex: 1; }
.skel-line { height: 14px; border-radius: 6px; }
.skel-tags { display: flex; gap: .4rem; margin-top: .5rem; }
.skel-tag { height: 22px; width: 64px; border-radius: 999px; }

/* ═══════════════════════════════════════════════════════════
   JOBS GRID
═══════════════════════════════════════════════════════════ */
.jobs-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}
@media (min-width: 640px) {
  .jobs-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1100px) {
  .jobs-grid { grid-template-columns: repeat(3, 1fr); }
}

/* ═══════════════════════════════════════════════════════════
   JOBS LIST
═══════════════════════════════════════════════════════════ */
.jobs-list { display: flex; flex-direction: column; gap: .625rem; }

.job-row {
  display: flex; align-items: flex-start; gap: .875rem;
  background: var(--surface-container-lowest);
  border: 1.5px solid var(--outline-variant);
  border-radius: 16px; overflow: hidden;
  cursor: pointer; transition: transform .15s, border-color .15s, box-shadow .15s;
  padding: .875rem 1rem .875rem 1.25rem;
  position: relative;
}
.job-row:hover { transform: translateX(3px); border-color: var(--primary); box-shadow: 0 4px 20px rgba(99,14,212,.1); }

/* Coloured left strip */
.jr-strip {
  position: absolute; left: 0; top: 0; bottom: 0; width: 4px; flex-shrink: 0;
}
.jr-strip[data-type="full_time"]  { background: linear-gradient(180deg, #630ed4, #a855f7); }
.jr-strip[data-type="remote"]     { background: linear-gradient(180deg, #059669, #34d399); }
.jr-strip[data-type="contract"]   { background: linear-gradient(180deg, #d97706, #fbbf24); }
.jr-strip[data-type="freelance"]  { background: linear-gradient(180deg, #0284c7, #38bdf8); }
.jr-strip[data-type="part_time"]  { background: linear-gradient(180deg, #be185d, #f472b6); }

.jr-logo {
  width: 44px; height: 44px; border-radius: 11px; flex-shrink: 0;
  background: var(--surface-container); border: 1px solid var(--outline-variant);
  display: flex; align-items: center; justify-content: center; overflow: hidden;
}
.jr-logo-img { width: 100%; height: 100%; object-fit: cover; border-radius: 11px; }
.jr-logo-ini { font-family: var(--font-headline); font-size: 1.1rem; font-weight: 800; color: var(--primary); text-transform: uppercase; }

/* Main info block — takes all remaining space */
.jr-info {
  flex: 1; min-width: 0;
  display: flex; flex-direction: column; gap: .3rem;
}

/* Title never truncates — wraps instead */
.jr-title {
  font-family: var(--font-headline); font-size: .925rem; font-weight: 800;
  color: var(--on-surface); margin: 0; line-height: 1.3;
  white-space: normal; word-break: break-word;
}
.jr-company { font-size: .75rem; color: var(--on-surface-variant); margin: 0; }
.jr-tags { display: flex; flex-wrap: wrap; gap: .3rem; margin-top: .15rem; }

/* Salary + meta — below tags on mobile, right-aligned on desktop */
.jr-salary-row {
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: .3rem; margin-top: .375rem;
  padding-top: .375rem; border-top: 1px solid var(--outline-variant);
}
.jr-salary { font-family: var(--font-headline); font-size: .82rem; font-weight: 800; color: #059669; }
.jr-salary-empty { font-size: .75rem; color: var(--outline); font-style: italic; }
.jr-bottom-meta { display: flex; align-items: center; gap: .5rem; }

/* On desktop — keep meta column on the right */
@media (min-width: 640px) {
  .job-row { align-items: center; }
  .jr-info { gap: .2rem; }
  .jr-salary-row { display: none; }
  .jr-meta {
    display: flex; flex-direction: column; align-items: flex-end; gap: .3rem;
    flex-shrink: 0;
  }
  .jr-meta .jr-salary { display: block; }
}
@media (max-width: 639px) {
  .jr-meta { display: none; }
}

/* ═══════════════════════════════════════════════════════════
   JOB CARD
═══════════════════════════════════════════════════════════ */
.job-card {
  display: flex; flex-direction: column;
  background: var(--surface-container-lowest);
  border: 1.5px solid var(--outline-variant);
  border-radius: 18px; overflow: hidden;
  cursor: pointer; transition: transform .2s ease, border-color .2s ease, box-shadow .2s ease;
  position: relative;
}
.job-card:hover {
  transform: translateY(-4px);
  border-color: var(--primary);
  box-shadow: 0 8px 32px rgba(99,14,212,.12);
}
.job-card:focus { outline: 2px solid var(--primary); outline-offset: 2px; }

/* Coloured top strip */
.jc-strip {
  height: 6px; width: 100%; flex-shrink: 0;
}
.jc-strip[data-type="full_time"]  { background: linear-gradient(90deg, #630ed4, #a855f7); }
.jc-strip[data-type="remote"]     { background: linear-gradient(90deg, #059669, #34d399); }
.jc-strip[data-type="contract"]   { background: linear-gradient(90deg, #d97706, #fbbf24); }
.jc-strip[data-type="freelance"]  { background: linear-gradient(90deg, #0284c7, #38bdf8); }
.jc-strip[data-type="part_time"]  { background: linear-gradient(90deg, #be185d, #f472b6); }

/* Card header */
.jc-top {
  display: flex; align-items: flex-start; gap: .875rem;
  padding: 1.125rem 1.125rem .625rem;
}
.jc-logo {
  width: 48px; height: 48px; border-radius: 12px; flex-shrink: 0;
  background: var(--surface-container); border: 1px solid var(--outline-variant);
  display: flex; align-items: center; justify-content: center; overflow: hidden;
}
.jc-logo-img { width: 100%; height: 100%; object-fit: cover; border-radius: 12px; }
.jc-logo-ini {
  font-family: var(--font-headline); font-size: 1.2rem; font-weight: 800;
  color: var(--primary); text-transform: uppercase;
}
.jc-info { flex: 1; min-width: 0; }
.jc-title {
  font-family: var(--font-headline); font-size: .975rem; font-weight: 800;
  color: var(--on-surface); margin: 0; line-height: 1.3;
  /* allow wrapping on mobile instead of truncating */
  white-space: normal;
  word-break: break-word;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.jc-company {
  font-size: .8rem; color: var(--on-surface-variant); margin: .2rem 0 0;
  display: flex; align-items: center; gap: .2rem;
}
.jc-del {
  border: none; background: none; cursor: pointer; color: var(--outline);
  display: flex; align-items: center; padding: 4px; border-radius: 8px;
  flex-shrink: 0; transition: color .15s, background .15s;
}
.jc-del:hover { color: #ef4444; background: rgba(239,68,68,.08); }

/* Location line */
.jc-location {
  display: flex; align-items: center; gap: .25rem;
  font-size: .78rem; color: var(--on-surface-variant);
  padding: 0 1.125rem; margin-top: -.25rem;
}

/* Type / level tags */
.jc-tags {
  display: flex; flex-wrap: wrap; gap: .3rem;
  padding: .5rem 1.125rem 0;
}
.jc-tag {
  display: inline-flex; align-items: center; gap: .2rem;
  padding: .2rem .6rem; border-radius: 999px;
  background: var(--surface-container); border: 1px solid var(--outline-variant);
  font-family: var(--font-headline); font-size: .72rem; font-weight: 600;
  color: var(--on-surface-variant); text-transform: capitalize; white-space: nowrap;
}
.jc-remote { background: rgba(5,150,105,.1); border-color: rgba(5,150,105,.25); color: #059669; }

/* Description */
.jc-desc {
  font-size: .825rem; color: var(--on-surface-variant); line-height: 1.55;
  padding: .625rem 1.125rem 0;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  flex: 1;
}

/* Skills chips */
.jc-skills {
  display: flex; flex-wrap: wrap; gap: .3rem;
  padding: .625rem 1.125rem 0;
}
.jc-skill {
  padding: .18rem .55rem; border-radius: 6px;
  background: rgba(99,14,212,.07); border: 1px solid rgba(99,14,212,.15);
  font-family: var(--font-headline); font-size: .7rem; font-weight: 700; color: var(--primary);
}
.jc-more { background: var(--surface-container); border-color: var(--outline-variant); color: var(--on-surface-variant); }

/* Card footer — stack on very small screens */
.jc-foot {
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: .4rem;
  padding: .75rem 1.125rem 1rem; margin-top: auto;
  border-top: 1px solid var(--outline-variant);
}
.jc-salary {
  font-family: var(--font-headline); font-size: .875rem; font-weight: 800; color: #059669;
  white-space: nowrap;
}
.jc-salary-period { font-size: .7rem; font-weight: 600; opacity: .8; }
.jc-salary-empty { font-size: .78rem; color: var(--outline); font-style: italic; }
.jc-meta-right { display: flex; align-items: center; gap: .5rem; flex-shrink: 0; }
.jc-stat {
  display: flex; align-items: center; gap: .2rem;
  font-size: .78rem; color: var(--on-surface-variant);
}
.jc-time { font-size: .75rem; color: var(--outline); }

/* ═══════════════════════════════════════════════════════════
   EMPTY STATE
═══════════════════════════════════════════════════════════ */
.jobs-empty {
  display: flex; flex-direction: column; align-items: center;
  gap: .75rem; padding: 4rem 1rem; text-align: center;
}
.empty-ico-wrap {
  width: 72px; height: 72px; border-radius: 20px;
  background: var(--surface-container-lowest); border: 1px solid var(--outline-variant);
  display: flex; align-items: center; justify-content: center;
}
.empty-ico-wrap .material-symbols-outlined { font-size: 2.2rem; color: var(--outline); }
.empty-title { font-family: var(--font-headline); font-size: 1.15rem; font-weight: 800; color: var(--on-surface); margin: 0; }
.empty-sub { font-size: .875rem; color: var(--on-surface-variant); margin: 0; }
.btn-primary {
  padding: .6rem 1.5rem; border-radius: 12px;
  background: var(--primary); color: #fff; border: none;
  font-family: var(--font-headline); font-size: .875rem; font-weight: 700;
  cursor: pointer; transition: opacity .15s;
}
.btn-primary:hover { opacity: .9; }

/* ═══════════════════════════════════════════════════════════
   MODAL OVERLAY
═══════════════════════════════════════════════════════════ */
.modal-overlay {
  position: fixed; inset: 0; z-index: 700;
  background: rgba(0,0,0,.55); backdrop-filter: blur(6px);
  display: flex; align-items: flex-end; justify-content: center;
}
@media (min-width: 680px) {
  .modal-overlay { align-items: center; }
}

/* Modal sheet */
.modal-sheet {
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: 24px 24px 0 0;
  width: 100%; max-width: 720px;
  max-height: 90vh; display: flex; flex-direction: column;
  overflow: hidden;
  box-shadow: 0 -8px 40px rgba(0,0,0,.2);
}
@media (min-width: 680px) {
  .modal-sheet {
    border-radius: 24px;
    max-height: 85vh;
    margin: 1rem;
  }
}
.modal-handle {
  width: 36px; height: 4px; border-radius: 999px;
  background: var(--outline-variant); margin: .75rem auto .25rem; flex-shrink: 0;
}
@media (min-width: 680px) { .modal-handle { display: none; } }

/* Modal header */
.modal-hdr {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem;
  padding: 1rem 1.25rem .75rem; flex-shrink: 0;
  border-bottom: 1px solid var(--outline-variant);
}
.modal-hdr-left { display: flex; align-items: flex-start; gap: .875rem; }
.modal-logo {
  width: 52px; height: 52px; border-radius: 14px; flex-shrink: 0;
  background: var(--surface-container); border: 1px solid var(--outline-variant);
  display: flex; align-items: center; justify-content: center; overflow: hidden;
}
.modal-logo-img { width: 100%; height: 100%; object-fit: cover; }
.modal-logo-ini {
  font-family: var(--font-headline); font-size: 1.4rem; font-weight: 800;
  color: var(--primary); text-transform: uppercase;
}
.modal-title { font-family: var(--font-headline); font-size: 1.05rem; font-weight: 800; color: var(--on-surface); margin: 0 0 .2rem; }
.modal-company { font-size: .85rem; color: var(--on-surface-variant); margin: 0; }
.modal-company-lnk {
  display: inline-flex; align-items: center; gap: .2rem;
  font-size: .85rem; color: var(--primary); text-decoration: none;
}
.modal-company-lnk:hover { text-decoration: underline; }
.modal-close {
  border: none; background: none; cursor: pointer; color: var(--on-surface-variant);
  display: flex; align-items: center; padding: 6px; border-radius: 10px;
  flex-shrink: 0; transition: background .15s, color .15s;
}
.modal-close:hover { background: var(--surface-container); color: var(--on-surface); }

/* Modal body (scrollable) */
.modal-body { flex: 1; overflow-y: auto; padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; }
.modal-body::-webkit-scrollbar { width: 6px; }
.modal-body::-webkit-scrollbar-track { background: transparent; }
.modal-body::-webkit-scrollbar-thumb { background: var(--outline-variant); border-radius: 3px; }

/* Salary */
.modal-salary {
  display: inline-flex; align-items: center; gap: .375rem;
  padding: .5rem 1rem; border-radius: 12px;
  background: rgba(5,150,105,.08); border: 1px solid rgba(5,150,105,.2);
  font-family: var(--font-headline); font-size: 1.05rem; font-weight: 800; color: #059669;
  align-self: flex-start;
}
.modal-salary .material-symbols-outlined { font-size: 16px; }

/* Tags in modal */
.modal-tags { display: flex; flex-wrap: wrap; gap: .35rem; }

/* Stats row */
.modal-stats {
  display: flex; flex-wrap: wrap; gap: .75rem;
  padding: .75rem; border-radius: 14px;
  background: var(--surface-container); border: 1px solid var(--outline-variant);
}
.mstat {
  display: flex; align-items: center; gap: .35rem;
  font-size: .82rem; color: var(--on-surface-variant);
}
.mstat .material-symbols-outlined { font-size: 15px; }

/* Description / Requirements sections */
.modal-section { display: flex; flex-direction: column; gap: .5rem; }
.modal-section-title {
  font-family: var(--font-headline); font-size: .8rem; font-weight: 800;
  text-transform: uppercase; letter-spacing: .07em; color: var(--primary);
  margin: 0;
}
.modal-section-body { font-size: .875rem; color: var(--on-surface-variant); line-height: 1.7; margin: 0; }
.modal-skills { display: flex; flex-wrap: wrap; gap: .4rem; }
.modal-skill {
  padding: .3rem .75rem; border-radius: 8px;
  background: rgba(99,14,212,.08); border: 1px solid rgba(99,14,212,.18);
  font-family: var(--font-headline); font-size: .78rem; font-weight: 700; color: var(--primary);
}

/* Modal sticky footer */
.modal-foot {
  display: flex; align-items: center; gap: .75rem; flex-wrap: wrap;
  padding: 1rem 1.25rem calc(1rem + env(safe-area-inset-bottom, 0px));
  border-top: 1px solid var(--outline-variant); flex-shrink: 0;
  background: var(--surface-container-lowest);
}

/* Footer buttons */
.btn-apply {
  display: inline-flex; align-items: center; gap: .4rem; flex: 1; justify-content: center;
  padding: .7rem 1.5rem; border-radius: 14px;
  background: var(--primary); color: #fff; border: none;
  font-family: var(--font-headline); font-size: .9rem; font-weight: 700;
  cursor: pointer; transition: opacity .15s, transform .15s;
}
.btn-apply:hover:not(:disabled) { opacity: .9; transform: translateY(-1px); }
.btn-apply:disabled { opacity: .5; cursor: not-allowed; }
.btn-apply .material-symbols-outlined { font-size: 18px; }

.btn-applicants {
  display: inline-flex; align-items: center; gap: .35rem;
  padding: .6rem 1.1rem; border-radius: 12px;
  background: var(--surface-container); border: 1.5px solid var(--outline-variant);
  color: var(--on-surface); font-family: var(--font-headline); font-size: .82rem; font-weight: 700;
  cursor: pointer; transition: all .15s;
}
.btn-applicants:hover { border-color: var(--primary); color: var(--primary); }
.btn-applicants .material-symbols-outlined { font-size: 16px; }

.btn-edit {
  display: inline-flex; align-items: center; gap: .3rem;
  padding: .6rem .9rem; border-radius: 12px;
  background: none; border: 1.5px solid var(--outline-variant);
  color: var(--on-surface-variant); font-family: var(--font-headline); font-size: .82rem; font-weight: 700;
  cursor: pointer; transition: all .15s;
}
.btn-edit:hover { border-color: var(--primary); color: var(--primary); }
.btn-edit .material-symbols-outlined { font-size: 15px; }

.btn-close-job {
  display: inline-flex; align-items: center; gap: .3rem;
  padding: .6rem .9rem; border-radius: 12px;
  background: none; border: 1.5px solid rgba(239,68,68,.3);
  color: #ef4444; font-family: var(--font-headline); font-size: .82rem; font-weight: 700;
  cursor: pointer; transition: all .15s;
}
.btn-close-job:hover { background: rgba(239,68,68,.07); border-color: #ef4444; }
.btn-close-job .material-symbols-outlined { font-size: 15px; }
.closed-badge {
  padding: .4rem .875rem; border-radius: 999px;
  background: var(--surface-container); font-family: var(--font-headline);
  font-size: .8rem; font-weight: 700; color: var(--outline);
}

/* Spinner */
.btn-spin {
  width: 16px; height: 16px; border: 2px solid rgba(255,255,255,.35);
  border-top-color: #fff; border-radius: 50%;
  animation: spin .6s linear infinite; display: inline-block; flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ═══════════════════════════════════════════════════════════
   FORM MODALS
═══════════════════════════════════════════════════════════ */
.modal-form .modal-sheet { max-width: 680px; }

.form-fields { display: flex; flex-direction: column; gap: 1rem; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; }
@media (max-width: 520px) { .form-row { grid-template-columns: 1fr; } }

.form-field { display: flex; flex-direction: column; gap: .35rem; }
.form-field label {
  font-family: var(--font-headline); font-size: .78rem; font-weight: 700;
  color: var(--on-surface); text-transform: uppercase; letter-spacing: .06em;
}
.req { color: #ef4444; }
.field-hint { font-weight: 500; text-transform: none; letter-spacing: 0; opacity: .7; }

.form-field input,
.form-field textarea,
.form-field select {
  padding: .6rem .875rem; border-radius: 12px;
  background: var(--surface-container); border: 1.5px solid var(--outline-variant);
  color: var(--on-surface); font-family: var(--font-body); font-size: .9rem;
  outline: none; transition: border-color .2s;
  resize: vertical;
}
.form-field input:focus,
.form-field textarea:focus,
.form-field select:focus { border-color: var(--primary); }
.form-field input::placeholder,
.form-field textarea::placeholder { color: var(--outline); }

/* Logo box */
.logo-box { display: flex; align-items: center; gap: .875rem; }
.logo-preview {
  width: 52px; height: 52px; border-radius: 12px; flex-shrink: 0;
  background: var(--surface-container); border: 1.5px dashed var(--outline-variant);
  display: flex; align-items: center; justify-content: center; overflow: hidden;
}
.logo-preview.filled { border-style: solid; }
.logo-preview img { width: 100%; height: 100%; object-fit: cover; }
.logo-opts { display: flex; align-items: center; gap: .5rem; flex-wrap: wrap; flex: 1; }
.logo-upload-btn {
  display: inline-flex; align-items: center; gap: .3rem;
  padding: .4rem .8rem; border-radius: 10px;
  background: var(--surface-container); border: 1.5px solid var(--outline-variant);
  font-family: var(--font-headline); font-size: .78rem; font-weight: 700; color: var(--on-surface);
  cursor: pointer; transition: border-color .15s;
}
.logo-upload-btn:hover { border-color: var(--primary); color: var(--primary); }
.logo-upload-btn:disabled { opacity: .5; cursor: not-allowed; }
.logo-url-inp { flex: 1; min-width: 100px; }
.hidden-f { display: none; }

/* ═══════════════════════════════════════════════════════════
   MY APPLICATIONS LIST
═══════════════════════════════════════════════════════════ */
.app-card {
  padding: 1rem; border-radius: 14px;
  background: var(--surface-container); border: 1px solid var(--outline-variant);
  margin-bottom: .75rem;
}
.app-card:last-child { margin-bottom: 0; }
.app-card-header { display: flex; justify-content: space-between; align-items: flex-start; gap: .75rem; }
.app-title { font-family: var(--font-headline); font-size: .95rem; font-weight: 800; color: var(--on-surface); margin: 0 0 .2rem; }
.app-company { font-size: .8rem; color: var(--on-surface-variant); margin: 0 0 .2rem; }
.app-date { font-size: .75rem; color: var(--outline); margin: 0; }

/* ═══════════════════════════════════════════════════════════
   STATUS BADGES
═══════════════════════════════════════════════════════════ */
.app-status {
  padding: .25rem .75rem; border-radius: 999px; flex-shrink: 0;
  font-family: var(--font-headline); font-size: .72rem; font-weight: 800;
  text-transform: capitalize;
}
.app-status.pending    { background: rgba(234,179,8,.12);  color: #ca8a04; border: 1px solid rgba(234,179,8,.25); }
.app-status.reviewed   { background: rgba(99,102,241,.1); color: #6366f1; border: 1px solid rgba(99,102,241,.25); }
.app-status.shortlisted{ background: rgba(14,165,233,.1);  color: #0ea5e9; border: 1px solid rgba(14,165,233,.25); }
.app-status.accepted   { background: rgba(34,197,94,.1);   color: #16a34a; border: 1px solid rgba(34,197,94,.25); }
.app-status.rejected   { background: rgba(239,68,68,.08);  color: #ef4444; border: 1px solid rgba(239,68,68,.2); }

/* ═══════════════════════════════════════════════════════════
   APPLICANT CARDS
═══════════════════════════════════════════════════════════ */
.applicant-card {
  padding: 1rem; border-radius: 14px;
  background: var(--surface-container); border: 1px solid var(--outline-variant);
  margin-bottom: .75rem; display: flex; flex-direction: column; gap: .75rem;
}
.applicant-card:last-child { margin-bottom: 0; }
.applicant-hdr { display: flex; align-items: flex-start; gap: .75rem; }
.applicant-av {
  width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;
  background: var(--primary-fixed); border: 1px solid var(--outline-variant);
  display: flex; align-items: center; justify-content: center; overflow: hidden;
  font-family: var(--font-headline); font-size: 1rem; font-weight: 800; color: var(--primary);
}
.applicant-av-img { width: 100%; height: 100%; object-fit: cover; }
.applicant-info { flex: 1; }
.applicant-name { font-family: var(--font-headline); font-size: .9rem; font-weight: 800; color: var(--on-surface); margin: 0; }
.applicant-meta { font-size: .78rem; color: var(--on-surface-variant); margin: .1rem 0 0; }
.profile-link {
  display: inline-flex; align-items: center; gap: .2rem;
  font-size: .72rem; color: var(--primary); text-decoration: none; font-weight: 600;
}
.profile-link:hover { text-decoration: underline; }
.applicant-cover {
  font-size: .84rem; color: var(--on-surface-variant); line-height: 1.6;
  padding: .75rem; border-radius: 10px; background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
}
.applicant-links { display: flex; flex-wrap: wrap; gap: .5rem; }
.app-link {
  display: inline-flex; align-items: center; gap: .25rem;
  padding: .28rem .7rem; border-radius: 8px;
  background: var(--surface-container-lowest); border: 1px solid var(--outline-variant);
  font-family: var(--font-headline); font-size: .75rem; font-weight: 600;
  color: var(--on-surface); text-decoration: none; transition: border-color .15s, color .15s;
}
.app-link:hover { border-color: var(--primary); color: var(--primary); }
.applicant-actions { display: flex; flex-wrap: wrap; gap: .5rem; }
.act-shortlist, .act-accept, .act-chat, .act-decline {
  display: inline-flex; align-items: center; gap: .3rem;
  padding: .35rem .8rem; border-radius: 10px;
  font-family: var(--font-headline); font-size: .78rem; font-weight: 700;
  cursor: pointer; border: 1.5px solid; transition: all .15s;
}
.act-shortlist { background: rgba(14,165,233,.07); border-color: rgba(14,165,233,.3); color: #0ea5e9; }
.act-shortlist:hover { background: rgba(14,165,233,.15); }
.act-accept { background: rgba(34,197,94,.07); border-color: rgba(34,197,94,.3); color: #16a34a; }
.act-accept:hover { background: rgba(34,197,94,.15); }
.act-chat { background: rgba(99,14,212,.07); border-color: rgba(99,14,212,.2); color: var(--primary); }
.act-chat:hover { background: rgba(99,14,212,.14); }
.act-decline { background: rgba(239,68,68,.06); border-color: rgba(239,68,68,.2); color: #ef4444; }
.act-decline:hover { background: rgba(239,68,68,.12); }

/* ═══════════════════════════════════════════════════════════
   MODAL TRANSITIONS
═══════════════════════════════════════════════════════════ */
.modal-enter-active { animation: modalIn .28s ease; }
.modal-leave-active { animation: modalOut .22s ease; }
@keyframes modalIn  { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
@keyframes modalOut { from { opacity: 1; transform: translateY(0); }   to { opacity: 0; transform: translateY(16px); } }

/* ═══════════════════════════════════════════════════════════
   CARD ENTRANCE ANIMATION
═══════════════════════════════════════════════════════════ */
.animate-fade-in-up {
  animation: fadeInUp .45s ease both;
}
.delay-100 { animation-delay: .1s; }
.delay-200 { animation-delay: .2s; }
.delay-300 { animation-delay: .3s; }
.delay-400 { animation-delay: .4s; }
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ═══════════════════════════════════════════════════════════
   CONTAINER HELPER (matches explore page)
═══════════════════════════════════════════════════════════ */
.container-gfd {
  width: 100%; max-width: 1280px; margin-inline: auto;
  padding-inline: clamp(1rem, 4vw, 2.5rem);
}
</style>
