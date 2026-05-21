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
]

const MOCK_TOKEN = 'gfd_mock_token_dev_2024'

function loadMockUsers() {
  try {
    const stored = JSON.parse(localStorage.getItem('gfd_mock_users') || 'null')
    return Array.isArray(stored) ? stored : INITIAL_MOCK_USERS
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
  const isAdmin         = computed(() => user.value?.role === 'admin')
  const isDeveloper     = computed(() => user.value?.role === 'developer')

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
      // ── Mock auth: check against MOCK_USERS ──
      const match = mockUsers.value.find(
        u => u.email === credentials.email && u.password === credentials.password
      )

      if (match) {
        setSession(MOCK_TOKEN, match.user)
        return { token: MOCK_TOKEN, user: match.user }
      }

      // If no match, try real API (will fail gracefully if no backend)
      try {
        const { authService } = await import('@/services/auth.service')
        const res = await authService.login(credentials)
        setSession(res.token, res.user)
        return res
      } catch {
        // API not available — show friendly error
        error.value = 'Invalid email or password.'
        throw new Error('Invalid credentials')
      }
    } finally {
      loading.value = false
    }
  }

  async function register(userData) {
    loading.value = true
    error.value   = null

    await new Promise(r => setTimeout(r, 800))

    try {
      // Mock register — create a session for any new user and persist them
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
      error.value = 'Registration failed. Please try again.'
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
