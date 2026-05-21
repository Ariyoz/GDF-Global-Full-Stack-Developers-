// ── Developers Store ──
// Merges seed developers with all registered users so new signups
// automatically appear in the Explore page and on their profile.
import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useAuthStore } from '@/store/auth'

// ── Seed / demo developers (always visible) ──
const SEED_DEVELOPERS = [
  {
    id: 1,
    name: 'Marcus Chen',
    role: 'Senior Full-Stack Lead',
    location: 'San Francisco, CA',
    bio: 'Building scalable microservices and intuitive frontend experiences for high-growth tech startups.',
    skills: ['React', 'Go', 'AWS', 'PostgreSQL', 'Docker'],
    rating: '4.9',
    projects: 34,
    available: true,
    verified: true,
    type: 'Full Stack',
  },
  {
    id: 2,
    name: 'Elena Rodriguez',
    role: 'Next.js Specialist',
    location: 'Madrid, Spain',
    bio: 'Expert in crafting performant, SEO-optimized web applications with a focus on UI/UX precision.',
    skills: ['TypeScript', 'Prisma', 'Tailwind', 'Next.js'],
    rating: '5.0',
    projects: 28,
    available: true,
    verified: true,
    type: 'Frontend',
  },
  {
    id: 3,
    name: 'Alex Rivera',
    role: 'Python & Django Expert',
    location: 'Austin, TX',
    bio: 'Specializing in complex data architecture and API development for fintech and healthtech.',
    skills: ['Python', 'PostgreSQL', 'Docker', 'Redis'],
    rating: '4.8',
    projects: 41,
    available: false,
    verified: true,
    type: 'Backend',
  },
  {
    id: 4,
    name: 'Priya Sharma',
    role: 'React Native Developer',
    location: 'Bangalore, India',
    bio: 'Cross-platform mobile expert with 6 years building consumer apps with millions of users.',
    skills: ['React Native', 'iOS', 'Android', 'Firebase'],
    rating: '4.7',
    projects: 22,
    available: true,
    verified: false,
    type: 'Mobile',
  },
  {
    id: 5,
    name: 'James Okafor',
    role: 'UI/UX Designer & Dev',
    location: 'Lagos, Nigeria',
    bio: 'Award-winning designer who codes. Bridging the gap between beautiful design and clean implementation.',
    skills: ['Figma', 'Vue.js', 'CSS', 'Design Systems'],
    rating: '4.9',
    projects: 19,
    available: true,
    verified: true,
    type: 'UI/UX',
  },
  {
    id: 6,
    name: 'Lena Müller',
    role: 'DevOps & Cloud Engineer',
    location: 'Berlin, Germany',
    bio: 'Infrastructure specialist focused on Kubernetes, CI/CD pipelines, and cloud cost optimization.',
    skills: ['AWS', 'Kubernetes', 'Terraform', 'Docker'],
    rating: '4.8',
    projects: 31,
    available: false,
    verified: true,
    type: 'DevOps',
  },
]

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
