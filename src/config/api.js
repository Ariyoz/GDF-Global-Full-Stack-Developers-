// ── API Configuration ──

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://gfd-backend.onrender.com/api/v1'
export const API_TIMEOUT  = 30000

export const API_ENDPOINTS = {
  // Auth
  auth: {
    login:          '/auth/login',
    register:       '/auth/register',
    logout:         '/auth/logout',
    refresh:        '/auth/refresh',
    forgotPassword: '/auth/forgot-password',
    resetPassword:  '/auth/reset-password',
    me:             '/users/me',
    githubLogin:    '/auth/github/login',
    googleLogin:    '/auth/google/login',
  },

  // Users
  users: {
    me:       '/users/me',
    byId:     (id) => `/users/${id}`,
    follow:   (id) => `/users/${id}/follow`,
    followers:(id) => `/users/${id}/followers`,
    following:(id) => `/users/${id}/following`,
  },

  // Feed / Social
  feed: {
    list:      '/feed',
    create:    '/feed',
    byId:      (id) => `/feed/${id}`,
    like:      (id) => `/feed/${id}/like`,
    comment:   (id) => `/feed/${id}/comment`,
    bookmark:  (id) => `/feed/${id}/bookmark`,
    trending:  '/feed/trending/hashtags',
  },

  // Explore & Discovery
  explore: {
    developers: '/explore/developers',
    search:     '/explore/search',
    suggestions:'/explore/suggestions',
    trending:   '/explore/trending',
  },

  // Direct Hiring
  hire: {
    send: (devId) => `/hire/${devId}`,
  },

  // Projects / Hiring
  projects: {
    list:         '/projects',
    create:       '/projects',
    byId:         (id) => `/projects/${id}`,
    apply:        (id) => `/projects/${id}/apply`,
    applications: (id) => `/projects/${id}/applications`,
  },

  // Messaging
  messages: {
    conversations: '/messages/conversations',
    messages:      (convId) => `/messages/conversations/${convId}/messages`,
    send:          (convId) => `/messages/conversations/${convId}/messages`,
  },

  // Notifications
  notifications: {
    list:       '/notifications',
    unread:     '/notifications/unread-count',
    markRead:   (id) => `/notifications/${id}/read`,
    markAllRead:'/notifications/read-all',
  },

  // GitHub
  github: {
    sync:    '/github/sync',
    profile: '/github/profile',
    repos:   '/github/repos',
  },

  // Uploads
  uploads: {
    avatar: '/uploads/avatar',
    banner: '/uploads/banner',
    media:  '/uploads/media',
    file:   '/uploads/file',
  },

  // Admin
  admin: {
    analytics:  '/admin/analytics',
    users:      '/admin/users',
    suspend:    (id) => `/admin/users/${id}/suspend`,
    reinstate:  (id) => `/admin/users/${id}/reinstate`,
    reports:    '/admin/reports',
    resolveReport: (id) => `/admin/reports/${id}`,
  },
}
