// ── Developers Store ──
// Merges seed developers with all registered users so new signups
// automatically appear in the Explore page and on their profile.
import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useAuthStore } from '@/store/auth'

// ── Seed / demo developers (empty — will populate from real users) ──
const SEED_DEVELOPERS = []

// Map a registered user object → developer card shape
function userToDeveloper(user) {
  // Parse skills from a comma-separated string or array
  let skills = []
  if (Array.isArray(user.skills)) {
    skills = user.skills
  } else if (typeof user.skills === 'string' && user.skills.trim()) {
    skills = user.skills.split(',').map(s => s.trim()).filter(Boolean)
  }

  // Derive a "type" from jobTitle for the role filter
  const title = (user.jobTitle || user.role || '').toLowerCase()
  let type = 'Full Stack'
  if (title.includes('frontend') || title.includes('react') || title.includes('vue'))  type = 'Frontend'
  else if (title.includes('backend') || title.includes('node') || title.includes('python')) type = 'Backend'
  else if (title.includes('mobile') || title.includes('ios') || title.includes('android'))  type = 'Mobile'
  else if (title.includes('ui') || title.includes('ux') || title.includes('design'))        type = 'UI/UX'
  else if (title.includes('devops') || title.includes('cloud') || title.includes('infra'))  type = 'DevOps'

  return {
    id: user.id,
    name: user.name || 'Developer',
    role: user.jobTitle || user.role || 'Developer',
    location: user.location || 'Remote',
    bio: user.bio || 'GFD community developer.',
    skills: skills.length ? skills : ['JavaScript', 'HTML', 'CSS'],
    rating: user.rating || '5.0',
    projects: user.projectCount || 0,
    available: user.available !== false, // default available
    verified: user.verified || false,
    type,
    // Extra profile fields
    github: user.github || '',
    linkedin: user.linkedin || '',
    website: user.website || '',
    isRegistered: true, // flag to distinguish from seed data
  }
}

export const useDevelopersStore = defineStore('developers', () => {
  const authStore = useAuthStore()

  // All developers = seed + every registered non-admin user
  const all = computed(() => {
    // Access mockUsers reactively — falls back to empty array if not available
    const rawUsers = authStore.mockUsers || []
    const registeredUsers = rawUsers
      .map(u => u.user)
      .filter(u => u && u.role !== 'admin')

    // Convert registered users to developer shape
    const registeredDevs = registeredUsers.map(userToDeveloper)

    // Merge: seed first, then registered users (avoid duplicates by id)
    const seedIds = new Set(SEED_DEVELOPERS.map(d => d.id))
    const newDevs = registeredDevs.filter(d => !seedIds.has(d.id))

    return [...SEED_DEVELOPERS, ...newDevs]
  })

  // Get a single developer by id (works for both seed and registered)
  function getById(id) {
    const numId = Number(id)
    return all.value.find(d => d.id === numId || d.id === id) || null
  }

  return { all, getById }
})
