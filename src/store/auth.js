// ── Auth Store — Supabase ──
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import { supabaseAuthService } from '@/services/supabase-auth.service'
import { profilesService } from '@/services/profiles.service'

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

  // Initialize auth state from Supabase session
  async function init() {
    try {
      const currentSession = await supabaseAuthService.getSession()
      if (currentSession) {
        session.value = currentSession
        user.value = currentSession.user
        await fetchProfile()
      }
    } catch (err) {
      console.error('Auth init error:', err)
    } finally {
      initialized.value = true
    }

    // Listen for auth changes
    supabaseAuthService.onAuthStateChange(async (event, newSession) => {
      session.value = newSession
      user.value = newSession?.user || null

      if (event === 'SIGNED_IN' && newSession) {
        await fetchProfile()
      } else if (event === 'SIGNED_OUT') {
        profile.value = null
      }
    })
  }

  // Fetch user profile from profiles table
  async function fetchProfile() {
    if (!user.value) return
    try {
      profile.value = await profilesService.getById(user.value.id)
    } catch (err) {
      // Profile might not exist yet (new user)
      console.warn('Profile not found, may need setup:', err)
    }
  }

  // Register with email/password
  async function register({ email, password, name, role, jobTitle, location, company, bio, skills, github, linkedin, website }) {
    loading.value = true
    error.value = null
    try {
      const data = await supabaseAuthService.register({ email, password, fullName: name })
      session.value = data.session
      user.value = data.user

      // Wait a moment for the trigger to create the profile
      if (data.session) {
        await new Promise(r => setTimeout(r, 500))

        // Update profile with additional fields
        const profileUpdates = {
          role: role || 'developer',
          bio: bio || '',
          skills: skills || [],
          location: location || '',
          github_url: github ? `https://github.com/${github}` : '',
          portfolio: website || '',
          company: company || '',
          experience_level: jobTitle || '',
        }

        await profilesService.update(data.user.id, profileUpdates)
        await fetchProfile()
      }

      return data
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
      const data = await supabaseAuthService.login({ email, password })
      session.value = data.session
      user.value = data.user
      await fetchProfile()
      return data
    } catch (err) {
      error.value = err.message || 'Invalid email or password'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Login with OAuth provider (github/google)
  async function loginWithProvider(provider) {
    loading.value = true
    error.value = null
    try {
      return await supabaseAuthService.loginWithProvider(provider)
    } catch (err) {
      error.value = err.message || `${provider} login failed`
      throw err
    } finally {
      loading.value = false
    }
  }

  // Logout
  async function logout() {
    try {
      await supabaseAuthService.logout()
    } catch (err) {
      console.error('Logout error:', err)
    }
    session.value = null
    user.value = null
    profile.value = null
  }

  // Forgot password
  async function forgotPassword(email) {
    loading.value = true
    error.value = null
    try {
      await supabaseAuthService.forgotPassword(email)
    } catch (err) {
      error.value = err.message || 'Failed to send reset email'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update profile
  async function updateProfile(updates) {
    if (!user.value) return
    try {
      profile.value = await profilesService.update(user.value.id, updates)
      return profile.value
    } catch (err) {
      error.value = err.message || 'Failed to update profile'
      throw err
    }
  }

  // Upload avatar
  async function uploadAvatar(file) {
    if (!user.value) return
    try {
      const url = await profilesService.uploadAvatar(user.value.id, file)
      profile.value = { ...profile.value, avatar: url }
      return url
    } catch (err) {
      error.value = err.message || 'Failed to upload avatar'
      throw err
    }
  }

  return {
    user, profile, session, loading, error, initialized,
    isAuthenticated, isAdmin, isDeveloper, isClient, isRecruiter,
    init, login, register, loginWithProvider, logout,
    forgotPassword, fetchProfile, updateProfile, uploadAvatar,
  }
})
