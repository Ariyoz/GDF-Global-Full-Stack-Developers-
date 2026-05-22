// ── GFD Constants — Global Full-Stack Developers ──

export const APP_NAME = 'Global Full-Stack Developers'
export const APP_SHORT = 'GFD'
export const APP_TAGLINE = 'Hire Developers or Showcase Your Work'
export const APP_DESCRIPTION =
  'The global marketplace for world-class full-stack engineers and high-impact digital products.'

export const CONTACT_EMAIL = 'hello@gfd.dev'
export const CONTACT_PHONE = '+1 (555) GFD-CODE'

export const SOCIAL_LINKS = {
  github:   'https://github.com/gfd-dev',
  linkedin: 'https://linkedin.com/company/gfd-dev',
  twitter:  'https://twitter.com/gfd_dev',
  discord:  'https://discord.gg/gfd-dev',
  youtube:  'https://youtube.com/@gfd-dev',
}

export const NAV_LINKS = [
  { label: 'Explore',   to: '/explore',   exact: false },
  { label: 'Hire',      to: '/hire',      exact: false },
  { label: 'Projects',  to: '/projects',  exact: false },
  { label: 'Community', to: '/community', exact: false },
  { label: 'Careers',   to: '/careers',   exact: false },
]

export const SERVICES = [
  {
    id: 'frontend',
    icon: 'palette',
    title: 'Frontend Development',
    description: 'Pixel-perfect, performant UIs built with Vue, React, and modern CSS.',
    tags: ['Vue.js', 'React', 'Tailwind', 'Bootstrap'],
  },
  {
    id: 'backend',
    icon: 'settings',
    title: 'Backend Development',
    description: 'Scalable APIs and server-side systems built for production.',
    tags: ['Node.js', 'Python', 'PostgreSQL', 'Redis'],
  },
  {
    id: 'fullstack',
    icon: 'rocket_launch',
    title: 'Full Stack Development',
    description: 'End-to-end digital products from database to deployment.',
    tags: ['Full Stack', 'DevOps', 'CI/CD'],
  },
  {
    id: 'mobile',
    icon: 'smartphone',
    title: 'Mobile App Development',
    description: 'Cross-platform mobile apps with native performance.',
    tags: ['React Native', 'Flutter', 'iOS', 'Android'],
  },
  {
    id: 'uiux',
    icon: 'design_services',
    title: 'UI/UX Design',
    description: 'Premium design systems and user experiences that convert.',
    tags: ['Figma', 'Design Systems', 'Prototyping'],
  },
  {
    id: 'api',
    icon: 'api',
    title: 'API Development',
    description: 'RESTful and GraphQL APIs built for scale and reliability.',
    tags: ['REST', 'GraphQL', 'WebSockets'],
  },
  {
    id: 'website',
    icon: 'language',
    title: 'Website Development',
    description: 'Fast, SEO-optimized websites that drive business results.',
    tags: ['SEO', 'Performance', 'CMS'],
  },
  {
    id: 'custom',
    icon: 'diamond',
    title: 'Custom Software',
    description: 'Bespoke software solutions tailored to your exact needs.',
    tags: ['Enterprise', 'SaaS', 'Automation'],
  },
]

export const STATS = [
  { value: '0', label: 'Developers' },
  { value: '0', label: 'Companies Hiring' },
  { value: '0', label: 'Projects Delivered' },
  { value: '0', label: 'Countries' },
]

export const TEAM = {
  founder: {
    name: 'Alex Morgan',
    role: 'Founder & CEO',
    bio: 'Full-stack architect with 10+ years building scalable digital products for global companies.',
    avatar: null,
    social: { github: '#', linkedin: '#', twitter: '#' },
  },
  coFounders: [
    {
      name: 'Sarah Chen',
      role: 'Co-Founder & CTO',
      bio: 'Backend systems expert specializing in distributed architecture and cloud infrastructure.',
      avatar: null,
      social: { github: '#', linkedin: '#' },
    },
    {
      name: 'Marcus Williams',
      role: 'Co-Founder & Design Lead',
      bio: 'Award-winning UI/UX designer crafting premium digital experiences for top-tier brands.',
      avatar: null,
      social: { linkedin: '#', twitter: '#' },
    },
    {
      name: 'Priya Patel',
      role: 'Co-Founder & Community Lead',
      bio: 'Developer advocate and community builder connecting talent with opportunity worldwide.',
      avatar: null,
      social: { github: '#', linkedin: '#', twitter: '#' },
    },
  ],
}

export const PROJECT_CATEGORIES = [
  'All', 'Web App', 'Mobile App', 'UI/UX Design', 'API', 'E-Commerce', 'SaaS',
]

export const BUDGET_RANGES = [
  { value: 'starter',      label: '$500 – $2,000',     desc: 'Starter' },
  { value: 'professional', label: '$2,000 – $10,000',  desc: 'Professional' },
  { value: 'business',     label: '$10,000 – $50,000', desc: 'Business' },
  { value: 'enterprise',   label: '$50,000+',           desc: 'Enterprise' },
]

export const TIMELINES = [
  { value: '1-2weeks',  label: '1–2 Weeks' },
  { value: '1month',    label: '1 Month' },
  { value: '2-3months', label: '2–3 Months' },
  { value: '3-6months', label: '3–6 Months' },
  { value: '6months+',  label: '6+ Months' },
]

export const DEVELOPER_ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Mobile Developer',
  'UI/UX Designer',
  'DevOps Engineer',
  'QA Engineer',
]

export const SKILL_TAGS = [
  'React', 'Vue.js', 'Angular', 'Next.js', 'Node.js', 'Python', 'Django',
  'TypeScript', 'JavaScript', 'Go', 'Rust', 'PostgreSQL', 'MongoDB',
  'AWS', 'Docker', 'Kubernetes', 'GraphQL', 'Tailwind CSS', 'Figma',
  'React Native', 'Flutter', 'iOS', 'Android',
]
