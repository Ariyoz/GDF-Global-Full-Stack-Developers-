// ── Auth Store ──
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// ── Mock credentials (works without a backend) ──
const INITIAL_MOCK_USERS = [
  {
    email: 'obikoyaayomikun33@gmail.com',
    password: '@$159357Ayo',
    user: {
      id: 1,
      name: 'Ayomikun Obikoya',
      email: 'obikoyaayomikun33@gmail.com',
      role: 'admin',
      jobTitle: 'Founder & CEO',
      location: 'Lagos, Nigeria',
      bio: 'Founder & CEO of Global Full-Stack Developers.',
      github: 'gfd-dev',
      linkedin: 'ayomikun-obikoya',
      website: 'https://gfd.io',
    },
  },
  {
    email: 'gdf@gmail.com',
    password: 'gdf12345',
    user: {
      id: 2,
      name: 'GFD Tester',
      email: 'gdf@gmail.com',
      role: 'developer',
      jobTitle: 'Test Account',
      location: '',
      bio: 'Default tester account for GFD platform.',
      github: '',
      linkedin: '',
      website: '',
    },
  },
  {
    email: 'gdfadmin@gmail.com',
    password: 'gdf12345',
    user: {
      id: 3,
      name: 'GFD Admin',
      email: 'gdfadmin@gmail.com',
      role: 'admin',
      jobTitle: 'Platform Admin',
      location: '',
      bio: 'Admin account for GFD platform management.',
      github: '',
      linkedin: '',
      website: '',
    },
  },
]

const MOCK_TOKEN = 'gfd_mock_token_dev_2024'

function loadMockUsers() {
  try {
    const stored = JSON.parse(localStorage.getItem('gfd_mock_users') || 'null')
    if (!Array.isArray(stored)) return INITIAL_MOCK_USERS
    // Merge: keep stored users but ensure all INITIAL_MOCK_USERS are present
    const merged = [...stored]
    for (const initial of INITIAL_MOCK_USERS) {
      if (!merged.find(u => u.email === initial.email)) {
        merged.push(initial)
      }
    }
    return merged
  } catch {
    return INITIAL_MOCK_USERS
  }
}

function saveMockUsers(users) {
  localStorage.setItem('gfd_mock_users', JSON.stringify(users))
}

export const useAuthStore = defineStore('auth', () => {
  const user    = ref(JSON.parse(localStorage.getItem('gfd_user') || 'null'))
  const token   = ref(localStorage.getItem('gfd_token') || null)
  const loading = ref(false)
  const error   = ref(null)
  const mockUsers = ref(loadMockUsers())

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin         = computed(() => user.value?.role === 'admin' || user.value?.role === 'ADMIN')
  const isDeveloper     = computed(() => user.value?.role === 'developer' || user.value?.role === 'DEVELOPER')

  function setSession(newToken, newUser) {
    token.value = newToken
    user.value  = newUser
    if (newToken) {
      localStorage.setItem('gfd_token', newToken)
      localStorage.setItem('gfd_user', JSON.stringify(newUser))
    } else {
      localStorage.removeItem('gfd_token')
      localStorage.removeItem('gfd_user')
    }
  }

  async function login(credentials) {
    loading.value = true
    error.value   = null

    // Simulate network delay
    await new Promise(r => setTimeout(r, 600))

    try {
      const match = mockUsers.value.find(
        u => u.email === credentials.email && u.password === credentials.password
      )

      if (match) {
        setSession(MOCK_TOKEN, match.user)
        return { token: MOCK_TOKEN, user: match.user }
      }

      error.value = 'Invalid email or password.'
      throw new Error('Invalid credentials')
    } finally {
      loading.value = false
    }
  }

  async function register(userData) {
    loading.value = true
    error.value   = null

    await new Promise(r => setTimeout(r, 800))

    try {
      const existing = mockUsers.value.find(u => u.email === userData.email)
      if (existing) {
        error.value = 'An account with that email already exists.'
        throw new Error('Duplicate email')
      }

      const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        role: userData.role || 'developer',
        jobTitle: userData.jobTitle || '',
        location: userData.location || '',
        bio: userData.bio || '',
        github: userData.github || '',
        linkedin: userData.linkedin || '',
        website: userData.website || '',
      }
      mockUsers.value.push({ email: newUser.email, password: userData.password, user: newUser })
      saveMockUsers(mockUsers.value)
      setSession(MOCK_TOKEN + '_' + Date.now(), newUser)
      return { token: MOCK_TOKEN, user: newUser }
    } catch (err) {
      if (!error.value) error.value = 'Registration failed. Please try again.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchMe() {
    // Restore user from localStorage if token exists
    if (!token.value) return
    const stored = localStorage.getItem('gfd_user')
    if (stored) {
      try { user.value = JSON.parse(stored) } catch { logout() }
    }
  }

  async function refreshToken() {
    // No-op for mock auth
  }

  function updateUser(updates) {
    user.value = { ...user.value, ...updates }
    if (token.value) {
      localStorage.setItem('gfd_user', JSON.stringify(user.value))
    }
  }

  function logout() {
    setSession(null, null)
  }

  return {
    user, token, loading, error, mockUsers,
    isAuthenticated, isAdmin, isDeveloper,
    login, register, fetchMe, refreshToken, logout, updateUser,
  }
})
