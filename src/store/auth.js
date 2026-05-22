// ── Auth Store — Demo Mode ──
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Demo accounts
const DEMO_ACCOUNTS = {
  user: {
    id: 'demo-user-001',
    email: 'user@gfd.demo',
    full_name: 'Alex Developer',
    avatar: '',
    role: 'developer',
    status: 'active',
    bio: 'Full-stack developer passionate about building great products.',
    skills: ['Vue.js', 'Node.js', 'TypeScript', 'Python', 'React'],
    location: 'San Francisco, CA',
    github_url: 'https://github.com/alexdev',
    portfolio: 'https://alexdev.io',
    company: '',
    experience_level: 'Senior Developer',
    username: 'alexdev',
    created_at: '2024-01-15T10:00:00Z',
  },
  admin: {
    id: 'demo-admin-001',
    email: 'admin@gfd.demo',
    full_name: 'GFD Admin',
    avatar: '',
    role: 'admin',
    status: 'active',
    bio: 'Platform administrator.',
    skills: [],
    location: 'Remote',
    github_url: '',
    portfolio: '',
    company: 'GFD',
    experience_level: '',
    username: 'gfdadmin',
    created_at: '2024-01-01T00:00:00Z',
  },
}

const DEMO_PASSWORD = 'demo1234'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const profile = ref(null)
  const session = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const initialized = ref(false)

  const isAuthenticated = computed(() => !!session.value)
  const isAdmin = computed(() => profile.value?.role === 'admin')
  const isDeveloper = computed(() => profile.value?.role === 'developer')
  const isClient = computed(() => profile.value?.role === 'client')
  const isRecruiter = computed(() => profile.value?.role === 'recruiter')

  // Initialize auth state from localStorage
  function init() {
    try {
      const stored = localStorage.getItem('gfd_demo_session')
      if (stored) {
        const data = JSON.parse(stored)
        session.value = data.session
        user.value = data.user
        profile.value = data.profile
      }
    } catch (err) {
      console.error('Auth init error:', err)
      localStorage.removeItem('gfd_demo_session')
    } finally {
      initialized.value = true
    }
  }

  // Persist session to localStorage
  function persistSession() {
    localStorage.setItem('gfd_demo_session', JSON.stringify({
      session: session.value,
      user: user.value,
      profile: profile.value,
    }))
  }

  // Fetch user profile (returns stored profile)
  async function fetchProfile() {
    // Profile is already loaded from demo data
    return profile.value
  }

  // Register (demo — just logs in as user)
  async function register({ email, password, name, role }) {
    loading.value = true
    error.value = null
    try {
      // In demo mode, registration creates a session as the user account
      const demoProfile = {
        ...DEMO_ACCOUNTS.user,
        id: 'demo-' + Date.now(),
        email,
        full_name: name || 'New User',
        role: role || 'developer',
      }

      user.value = { id: demoProfile.id, email: demoProfile.email }
      session.value = { access_token: 'demo-token-' + Date.now(), user: user.value }
      profile.value = demoProfile
      persistSession()
      return { session: session.value, user: user.value }
    } catch (err) {
      error.value = err.message || 'Registration failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Login with email/password
  async function login({ email, password }) {
    loading.value = true
    error.value = null
    try {
      // Check demo credentials
      let matchedAccount = null

      if (email === DEMO_ACCOUNTS.user.email && password === DEMO_PASSWORD) {
        matchedAccount = DEMO_ACCOUNTS.user
      } else if (email === DEMO_ACCOUNTS.admin.email && password === DEMO_PASSWORD) {
        matchedAccount = DEMO_ACCOUNTS.admin
      } else {
        throw new Error('Invalid email or password. Use demo credentials.')
      }

      user.value = { id: matchedAccount.id, email: matchedAccount.email }
      session.value = { access_token: 'demo-token-' + Date.now(), user: user.value }
      profile.value = { ...matchedAccount }
      persistSession()

      return { session: session.value, user: user.value }
    } catch (err) {
      error.value = err.message || 'Invalid email or password'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Login with OAuth provider (demo — not supported)
  async function loginWithProvider(provider) {
    error.value = `OAuth login is not available in demo mode. Use demo credentials instead.`
    throw new Error(error.value)
  }

  // Logout
  async function logout() {
    session.value = null
    user.value = null
    profile.value = null
    localStorage.removeItem('gfd_demo_session')
  }

  // Forgot password (demo — no-op)
  async function forgotPassword(email) {
    // In demo mode, just show a success message
    return true
  }

  // Update profile
  async function updateProfile(updates) {
    if (!user.value) return
    profile.value = { ...profile.value, ...updates }
    persistSession()
    return profile.value
  }

  // Upload avatar (demo — use object URL)
  async function uploadAvatar(file) {
    if (!user.value) return
    const url = URL.createObjectURL(file)
    profile.value = { ...profile.value, avatar: url }
    persistSession()
    return url
  }

  return {
    user, profile, session, loading, error, initialized,
    isAuthenticated, isAdmin, isDeveloper, isClient, isRecruiter,
    init, login, register, loginWithProvider, logout,
    forgotPassword, fetchProfile, updateProfile, uploadAvatar,
  }
})
