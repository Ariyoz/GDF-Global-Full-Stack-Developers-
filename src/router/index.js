import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'

// ── Layouts ──
const DefaultLayout   = () => import('@/layouts/DefaultLayout.vue')
const AuthLayout      = () => import('@/layouts/AuthLayout.vue')
const DashboardLayout = () => import('@/layouts/DashboardLayout.vue')
const AdminLayout     = () => import('@/layouts/AdminLayout.vue')

// ── Public Views ──
const HomeView             = () => import('@/views/Home/HomeView.vue')
const ExploreView          = () => import('@/views/Explore/ExploreView.vue')
const SearchNoResultsView  = () => import('@/views/Explore/SearchNoResultsView.vue')
const AboutView            = () => import('@/views/About/AboutView.vue')
const ServicesView         = () => import('@/views/Services/ServicesView.vue')
const CommunityView        = () => import('@/views/Community/CommunityView.vue')
const ProjectsView         = () => import('@/views/Projects/ProjectsView.vue')
const CareersView          = () => import('@/views/Careers/CareersView.vue')
const ContactView          = () => import('@/views/Contact/ContactView.vue')
const ClientRequestView    = () => import('@/views/ClientRequest/ClientRequestView.vue')
const HireConfirmationView = () => import('@/views/HireConfirmation/HireConfirmationView.vue')
const DeveloperProfileView = () => import('@/views/DeveloperProfile/DeveloperProfileView.vue')
const JobApplicationView   = () => import('@/views/JobApplication/JobApplicationView.vue')
const VerificationView     = () => import('@/views/Verification/VerificationView.vue')

// ── Auth Views ──
const LoginView    = () => import('@/views/Auth/LoginView.vue')
const RegisterView = () => import('@/views/Auth/RegisterView.vue')
const ForgotView   = () => import('@/views/Auth/ForgotPasswordView.vue')
const AuthCallbackView = () => import('@/views/Auth/AuthCallbackView.vue')

// ── Dashboard Views ──
const DashboardHome      = () => import('@/views/Dashboard/DashboardHome.vue')
const DashboardProfile   = () => import('@/views/Dashboard/DashboardProfile.vue')
const DashboardRequests  = () => import('@/views/Dashboard/DashboardRequests.vue')
const DashboardProjects  = () => import('@/views/Dashboard/DashboardProjects.vue')
const DashboardAnalytics = () => import('@/views/Dashboard/DashboardAnalytics.vue')
const HiringOfferView    = () => import('@/views/Dashboard/HiringOfferView.vue')
const JobsEmptyView      = () => import('@/views/Dashboard/JobsEmptyView.vue')

// ── App Views (authenticated) ──
const ProjectFeedView    = () => import('@/views/Feed/ProjectFeedView.vue')
const MessagingView      = () => import('@/views/Messaging/MessagingView.vue')
const NotificationsView  = () => import('@/views/Notifications/NotificationsView.vue')
const WalletView         = () => import('@/views/Wallet/WalletView.vue')
const SettingsView       = () => import('@/views/Settings/SettingsView.vue')
const ProjectUploadView  = () => import('@/views/ProjectUpload/ProjectUploadView.vue')
const SafetyReportView   = () => import('@/views/SafetyReport/SafetyReportView.vue')

// ── Plans ──
const PlansView          = () => import('@/views/Plans/PlansView.vue')

// ── Courses ──
const CoursesView        = () => import('@/views/Courses/CoursesView.vue')

// ── Admin Views ──
const AdminDashboardView    = () => import('@/views/Admin/AdminDashboardView.vue')
const AdminUsersView        = () => import('@/views/Admin/AdminUsersView.vue')
const AdminModerationView   = () => import('@/views/Admin/AdminModerationView.vue')
const AdminSettingsView     = () => import('@/views/Admin/AdminSettingsView.vue')
const AdminReportsView      = () => import('@/views/Admin/AdminReportsView.vue')
const AdminVerificationView = () => import('@/views/Admin/AdminVerificationView.vue')
const AdminAnalyticsView    = () => import('@/views/Admin/AdminAnalyticsView.vue')
const AdminSubscriptionsView = () => import('@/views/Admin/AdminSubscriptionsView.vue')
const AdminProjectsView      = () => import('@/views/Admin/AdminProjectsView.vue')

// ── Error ──
const NotFoundView = () => import('@/views/NotFound.vue')

const routes = [
  // ── Public Routes ──
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '',                name: 'home',              component: HomeView },
      { path: 'explore',         name: 'explore',           component: ExploreView },
      { path: 'explore/no-results', name: 'no-results',     component: SearchNoResultsView },
      { path: 'about',           name: 'about',             component: AboutView },
      { path: 'services',        name: 'services',          component: ServicesView },
      { path: 'community',       name: 'community',         component: CommunityView },
      { path: 'projects',        name: 'projects',          component: ProjectsView },
      { path: 'careers',         name: 'careers',           component: CareersView },
      { path: 'contact',         name: 'contact',           component: ContactView },
      { path: 'hire',            name: 'hire',              component: ClientRequestView },
      { path: 'hire/confirmation', name: 'hire-confirmation', component: HireConfirmationView },
      { path: 'developer/:id',   name: 'developer-profile', component: DeveloperProfileView },
      { path: 'apply/:id',       name: 'job-application',   component: JobApplicationView },
      { path: 'verification',    name: 'verification',      component: VerificationView },
    ],
  },

  // ── Auth Routes ──
  {
    path: '/auth',
    component: AuthLayout,
    meta: { guestOnly: true },
    children: [
      { path: 'login',           name: 'login',    component: LoginView },
      { path: 'register',        name: 'register', component: RegisterView },
      { path: 'forgot-password', name: 'forgot',   component: ForgotView },
      { path: 'callback',        name: 'auth-callback', component: AuthCallbackView },
    ],
  },

  // ── Dashboard Routes ──
  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '',           name: 'dashboard',            component: DashboardHome },
      { path: 'profile',    name: 'dashboard-profile',    component: DashboardProfile },
      { path: 'requests',   name: 'dashboard-requests',   component: DashboardRequests },
      { path: 'projects',   name: 'dashboard-projects',   component: DashboardProjects },
      { path: 'analytics',  name: 'dashboard-analytics',  component: DashboardAnalytics },
      { path: 'hiring',     name: 'hiring-offer',         component: HiringOfferView },
      { path: 'jobs',       name: 'jobs-empty',           component: JobsEmptyView },
    ],
  },

  // ── App Routes (DashboardLayout, authenticated) ──
  {
    path: '/feed',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [{ path: '', name: 'feed', component: ProjectFeedView }],
  },
  {
    path: '/messaging',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [{ path: '', name: 'messaging', component: MessagingView }],
  },
  {
    path: '/jobs',
    component: DashboardLayout,
    children: [{ path: '', name: 'jobs', component: () => import('@/views/Jobs/JobsView.vue') }],
  },
  {
    path: '/notifications',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [{ path: '', name: 'notifications', component: NotificationsView }],
  },
  {
    path: '/wallet',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [{ path: '', name: 'wallet', component: WalletView }],
  },
  {
    path: '/settings',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [{ path: '', name: 'settings', component: SettingsView }],
  },
  {
    path: '/projects/upload',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [{ path: '', name: 'project-upload', component: ProjectUploadView }],
  },
  {
    path: '/report',
    component: DefaultLayout,
    children: [{ path: '', name: 'safety-report', component: SafetyReportView }],
  },

  // ── Plans ──
  {
    path: '/plans',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [{ path: '', name: 'plans', component: PlansView }],
  },

  // ── Courses ──
  {
    path: '/courses',
    component: DefaultLayout,
    children: [{ path: '', name: 'courses', component: CoursesView }],
  },

  // ── Admin Routes ──
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: '',             name: 'admin',              component: AdminDashboardView },
      { path: 'users',        name: 'admin-users',        component: AdminUsersView },
      { path: 'moderation',   name: 'admin-moderation',   component: AdminModerationView },
      { path: 'reports',      name: 'admin-reports',      component: AdminReportsView },
      { path: 'verification', name: 'admin-verification', component: AdminVerificationView },
      { path: 'analytics',    name: 'admin-analytics',    component: AdminAnalyticsView },
      { path: 'subscriptions', name: 'admin-subscriptions', component: AdminSubscriptionsView },
      { path: 'projects',     name: 'admin-projects',     component: AdminProjectsView },
      { path: 'settings',     name: 'admin-settings',     component: AdminSettingsView },
    ],
  },

  // ── Legal ──
  {
    path: '/privacy-policy',
    component: DefaultLayout,
    children: [{ path: '', name: 'privacy-policy', component: () => import('@/views/Legal/PrivacyPolicyView.vue') }],
  },

  // ── 404 ──
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0, behavior: 'smooth' }
  },
})

// ── Navigation Guards ──
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()

  // Wait for auth to initialize (max 3 seconds)
  if (!authStore.initialized) {
    await Promise.race([
      new Promise(resolve => {
        const check = setInterval(() => {
          if (authStore.initialized) { clearInterval(check); resolve() }
        }, 50)
      }),
      new Promise(resolve => setTimeout(resolve, 3000)),
    ])
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }

  // Only redirect away from guest-only pages if truly authenticated AND not mid-login
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return next({ name: 'dashboard' })
  }

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return next({ name: 'dashboard' })
  }

  next()
})

export default router
