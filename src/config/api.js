// ── API Configuration ──

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://gfd-backend.onrender.com/api/v1'
export const API_TIMEOUT  = 60000 // 60s to handle Render cold starts

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
    unfollow: (id) => `/users/${id}/follow`,
    followers:(id) => `/users/${id}/followers`,
    following:(id) => `/users/${id}/following`,
  },

  // Feed / Social
  feed: {
    list:             '/feed',
    create:           '/feed',
    byId:             (id) => `/feed/${id}`,
    like:             (id) => `/feed/${id}/like`,
    unlike:           (id) => `/feed/${id}/like`,
    comment:          (id) => `/feed/${id}/comment`,
    comments:         (id) => `/feed/${id}/comments`,
    deleteComment:    (postId, commentId) => `/feed/${postId}/comments/${commentId}`,
    bookmark:         (id) => `/feed/${id}/bookmark`,
    repost:           (id) => `/feed/${id}/repost`,
    trendingPosts:    '/feed/trending-posts',
    recommendedPosts: '/feed/recommended-posts',
    bookmarks:        '/feed/bookmarks/me',
  },

  // Explore & Discovery
  explore: {
    developers: '/explore/developers',
    search:     '/explore/search',
    suggestions:'/explore/suggestions',
    trending:   '/explore/trending',
    stats:      '/explore/stats',
  },

  // Direct Hiring
  hire: {
    send:             (devId) => `/hire/${devId}`,
    sentRequests:     '/hire/requests/sent',
    receivedRequests: '/hire/requests/received',
  },

  // Projects / Hiring
  projects: {
    list:         '/projects',
    mine:         '/projects/mine',
    create:       '/projects',
    byId:         (id) => `/projects/${id}`,
    apply:        (id) => `/projects/${id}/apply`,
    applications: (id) => `/projects/${id}/applications`,
    like:         (id) => `/projects/${id}/like`,
    view:         (id) => `/projects/${id}/view`,
  },

  // Jobs Board
  jobs: {
    list:              '/jobs',
    create:            '/jobs',
    byId:              (id) => `/jobs/${id}`,
    apply:             (id) => `/jobs/${id}/apply`,
    applications:      (id) => `/jobs/${id}/applications`,
    delete:            (id) => `/jobs/${id}`,
    close:             (id) => `/jobs/${id}/close`,
    invite:            (jobId, devId) => `/jobs/${jobId}/invite/${devId}`,
    openChat:          (jobId, appId) => `/jobs/${jobId}/applications/${appId}/open-chat`,
    myApplications:    '/jobs/my-applications',
    updateApplication: (appId) => `/jobs/applications/${appId}`,
  },

  // Messaging
  messages: {
    conversations:    '/messages/conversations',
    messages:         (convId) => `/messages/conversations/${convId}/messages`,
    send:             (convId) => `/messages/conversations/${convId}/messages`,
    react:            (convId, msgId) => `/messages/conversations/${convId}/messages/${msgId}/react`,
    markRead:         (convId) => `/messages/conversations/${convId}/read`,
    deleteMsg:        (msgId) => `/messages/messages/${msgId}`,
    editMsg:          (msgId) => `/messages/messages/${msgId}`,
    deleteConv:       (convId) => `/messages/conversations/${convId}`,
    uploadAttachment: '/messages/upload-attachment',
  },

  // Notifications
  notifications: {
    list:        '/notifications',
    unread:      '/notifications/unread-count',
    markRead:    (id) => `/notifications/${id}/read`,
    markAllRead: '/notifications/read-all',
    delete:      (id) => `/notifications/${id}`,
    clearAll:    '/notifications/clear-all',
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

  // Crypto Wallet
  crypto: {
    coins:          '/crypto/coins',
    balance:        '/crypto/balance',
    transactions:   '/crypto/transactions',
    depositAddress: (coin) => `/crypto/deposit-address/${coin}`,
    webhook:        '/crypto/webhook/nowpayments',
  },

  // Admin
  admin: {
    analytics:     '/admin/analytics',
    users:         '/admin/users',
    suspend:       (id) => `/admin/users/${id}/suspend`,
    reinstate:     (id) => `/admin/users/${id}/reinstate`,
    reports:       '/admin/reports',
    resolveReport: (id) => `/admin/reports/${id}`,
    subscriptions: '/admin/subscriptions',
    approveSub:    (id) => `/admin/subscriptions/${id}/approve`,
    revokeSub:     (id) => `/admin/subscriptions/${id}/revoke`,
  },
}
