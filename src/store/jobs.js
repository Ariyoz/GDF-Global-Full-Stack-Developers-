// ── Jobs Store — hiring marketplace ──
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { jobsService } from '@/services/jobs.service'

export const useJobsStore = defineStore('jobs', () => {
  const jobs = ref([])
  const total = ref(0)
  const currentJob = ref(null)
  const applications = ref([])    // for the active job (poster view)
  const myApplications = ref([])  // developer's own applications
  const loading = ref(false)
  const applying = ref(false)
  const filters = ref({
    page: 1,
    limit: 20,
    search: '',
    jobType: '',
    experienceLevel: '',
    isRemote: undefined,
  })

  async function fetchJobs(reset = false) {
    loading.value = true
    if (reset) filters.value.page = 1
    try {
      const result = await jobsService.list(filters.value)
      jobs.value = reset ? result.data : [...jobs.value, ...result.data]
      total.value = result.total
    } catch (err) {
      console.error('Failed to fetch jobs:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchJob(id) {
    loading.value = true
    try {
      currentJob.value = await jobsService.getById(id)
    } catch (err) {
      console.error('Failed to fetch job:', err)
    } finally {
      loading.value = false
    }
  }

  async function createJob(data) {
    const result = await jobsService.create(data)
    await fetchJobs(true)
    return result
  }

  async function closeJob(id) {
    await jobsService.close(id)
    const job = jobs.value.find(j => j.id === id)
    if (job) job.status = 'closed'
    if (currentJob.value?.id === id) currentJob.value.status = 'closed'
  }

  async function deleteJob(id) {
    await jobsService.delete(id)
    jobs.value = jobs.value.filter(j => j.id !== id)
    if (currentJob.value?.id === id) currentJob.value = null
  }

  async function applyToJob(jobId, applicationData) {
    applying.value = true
    try {
      const result = await jobsService.apply(jobId, applicationData)
      return result
    } finally {
      applying.value = false
    }
  }

  async function fetchApplications(jobId) {
    applications.value = await jobsService.getApplications(jobId)
  }

  async function fetchMyApplications() {
    myApplications.value = await jobsService.getMyApplications()
  }

  async function updateApplicationStatus(applicationId, status) {
    await jobsService.updateApplicationStatus(applicationId, status)
    const app = applications.value.find(a => a.id === applicationId)
    if (app) app.status = status
  }

  async function inviteDeveloper(jobId, developerId) {
    return jobsService.inviteDeveloper(jobId, developerId)
  }

  async function openHiringChat(jobId, applicationId) {
    return jobsService.openHiringChat(jobId, applicationId)
  }

  function setFilter(key, value) {
    filters.value[key] = value
    filters.value.page = 1
  }

  function nextPage() {
    filters.value.page++
    fetchJobs()
  }

  return {
    jobs, total, currentJob, applications, myApplications,
    loading, applying, filters,
    fetchJobs, fetchJob, createJob, closeJob, deleteJob,
    applyToJob, fetchApplications, fetchMyApplications,
    updateApplicationStatus, inviteDeveloper, openHiringChat,
    setFilter, nextPage,
  }
})
