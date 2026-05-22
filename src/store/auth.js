// ── Auth Store — Real Backend ──
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import http from '@/services/http'
import { API_ENDPOINTS } from '@/config/api'

const { auth, users } = API_ENDPOINTS

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
  async function init() {
    try {
      const token = localStorage.getItem('gfd_token')
      const refreshToken = localStorage.getItem('gfd_refresh_token')
      const storedUser = localStorage.getItem('gfd_user')

      if (token) {
        session.value = { access_token: token }

        if (storedUser) {
          user.value = JSON.parse(storedUser)
          profile.value = JSON.parse(storedUser)
        }

        // Try to fetch fresh profile in background (don't block)
        http.get(users.me).then(data => {
          user.value = data
          profile.value = data
          persistSession()
        }).catch(() => {
          // Token might be expired — try refresh silently
          if (refreshToken) {
            refreshTokenFn().catch(() => {
              // Only clear if refresh also fails
              clearSession()
            })
          }
        })
      }
    } catch (err) {
      console.error('Auth init error:', err)
    } finally {
      initialized.value = true
    }
  }

  function persistSession() {
    if (session.value) {
      localStorage.setItem('gfd_token', session.value.access_token)
    }
    if (user.value) {
      localStorage.setItem('gfd_user', JSON.stringify(user.value))
    }
  }

  function clearSession() {
    session.value = null
    user.value = null
    profile.value = null
    localStorage.removeItem('gfd_token')
    localStorage.removeItem('gfd_refresh_token')
    localStorage.removeItem('gfd_user')
  }

  // Fetch user profile
  async function fetchProfile() {
    try {
      const data = await http.get(users.me)
      user.value = data
      profile.value = data
      persistSession()
    } catch (err) {
      console.warn('Failed to fetch profile:', err)
    }
  }

  // Register
  async function register({ email, password, username, full_name, name, role }) {
    loading.value = true
    error.value = null
    try {
      const displayName = full_name || name || 'User'
      const uname = username || email.split('@')[0].replace(/[^a-zA-Z0-9_-]/g, '')

      const data = await http.post(auth.register, {
        email,
        password,
        username: uname,
        full_name: displayName,
        role: role || 'developer',
      })

      session.value = { access_token: data.access_token }
      localStorage.setItem('gfd_token', data.access_token)
      localStorage.setItem('gfd_refresh_token', data.refresh_token)

      user.value = { id: data.user_id, email, role: data.role }
      profile.value = { id: data.user_id, email, role: data.role, full_name: full_name || username }
      persistSession()

      // Fetch full profile
      await fetchProfile()

      return data
    } catch (err) {
      error.value = err.response?.data?.detail || err.message || 'Registration failed'
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
      const data = await http.post(auth.login, { email, password })

      session.value = { access_token: data.access_token }
      localStorage.setItem('gfd_token', data.access_token)
      localStorage.setItem('gfd_refresh_token', data.refresh_token)

      user.value = { id: data.user_id, email, role: data.role }
      profile.value = { id: data.user_id, email, role: data.role }
      persistSession()

      // Fetch full profile in background (don't block login)
      fetchProfile().catch(() => {})

      return data
    } catch (err) {
      error.value = err.response?.data?.detail || err.message || 'Invalid email or password'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Login with OAuth provider (GitHub/Google)
  async function loginWithProvider(provider) {
    loading.value = true
    error.value = null
    try {
      const endpoint = provider === 'github' ? auth.githubLogin : auth.googleLogin
      const data = await http.get(endpoint)
      // Redirect to OAuth provider
      window.location.href = data.url
    } catch (err) {
      error.value = err.message || `${provider} login failed`
      throw err
    } finally {
      loading.value = false
    }
  }

  // Handle OAuth callback (called from AuthCallbackView)
  async function handleOAuthCallback(tokenData) {
    session.value = { access_token: tokenData.access_token }
    localStorage.setItem('gfd_token', tokenData.access_token)
    localStorage.setItem('gfd_refresh_token', tokenData.refresh_token)

    user.value = { id: tokenData.user_id, role: tokenData.role }
    profile.value = { id: tokenData.user_id, role: tokenData.role }
    persistSession()

    await fetchProfile()
  }

  // Refresh token
  async function refreshTokenFn() {
    const refreshToken = localStorage.getItem('gfd_refresh_token')
    if (!refreshToken) throw new Error('No refresh token')

    const data = await http.post(auth.refresh, { refresh_token: refreshToken })

    session.value = { access_token: data.access_token }
    localStorage.setItem('gfd_token', data.access_token)
    localStorage.setItem('gfd_refresh_token', data.refresh_token)

    user.value = { ...user.value, id: data.user_id, role: data.role }
    return data
  }

  // Logout
  async function logout() {
    try {
      const refreshToken = localStorage.getItem('gfd_refresh_token')
      if (refreshToken) {
        await http.post(auth.logout, { refresh_token: refreshToken })
      }
    } catch {
      // Ignore logout errors
    }
    clearSession()
  }

  // Forgot password
  async function forgotPassword(email) {
    loading.value = true
    error.value = null
    try {
      await http.post(auth.forgotPassword, { email })
    } catch (err) {
      error.value = err.response?.data?.detail || 'Failed to send reset email'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update profile
  async function updateProfile(updates) {
    if (!user.value) return
    try {
      const data = await http.patch(users.me, updates)
      profile.value = { ...profile.value, ...updates }
      persistSession()
      return profile.value
    } catch (err) {
      error.value = err.response?.data?.detail || 'Failed to update profile'
      throw err
    }
  }

  // Upload avatar — updates globally
  async function uploadAvatar(file) {
    if (!user.value) return
    try {
      const formData = new FormData()
      formData.append('file', file)
      const data = await http.post('/uploads/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      // Update avatar in profile and user refs
      const newUrl = data.url
      if (profile.value) profile.value.avatar = newUrl
      if (user.value) user.value.avatar = newUrl
      persistSession()
      return newUrl
    } catch (err) {
      error.value = err.response?.data?.detail || 'Failed to upload avatar'
      throw err
    }
  }

  return {
    user, profile, session, loading, error, initialized,
    isAuthenticated, isAdmin, isDeveloper, isClient, isRecruiter,
    init, login, register, loginWithProvider, handleOAuthCallback, logout,
    forgotPassword, fetchProfile, updateProfile, uploadAvatar, refreshToken: refreshTokenFn,
  }
})
