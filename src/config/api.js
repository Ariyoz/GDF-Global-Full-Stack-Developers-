// ── API Configuration ──

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
export const API_TIMEOUT  = 15000

export const API_ENDPOINTS = {
  // Auth
  auth: {
    login:          '/auth/login',
    register:       '/auth/register',
    logout:         '/auth/logout',
    refresh:        '/auth/refresh',
    forgotPassword: '/auth/forgot-password',
    resetPassword:  '/auth/reset-password',
    me:             '/auth/me',
  },

  // Users
  users: {
    profile:  '/users/profile',
    update:   '/users/profile',
    list:     '/users',
    byId:     (id) => `/users/${id}`,
  },

  // Client Requests
  requests: {
    submit: '/requests',
    list:   '/requests',
    byId:   (id) => `/requests/${id}`,
    update: (id) => `/requests/${id}`,
  },

  // Community
  community: {
    members: '/community/members',
    jobs:    '/community/jobs',
    projects:'/community/projects',
    join:    '/community/join',
  },

  // Projects / Portfolio
  projects: {
    list:   '/projects',
    byId:   (id) => `/projects/${id}`,
    bySlug: (slug) => `/projects/slug/${slug}`,
  },

  // Contact
  contact: {
    send: '/contact',
  },

  // Newsletter
  newsletter: {
    subscribe: '/newsletter/subscribe',
  },
}
