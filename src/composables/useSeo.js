/**
 * useSeo — Dynamic per-route meta tag management.
 *
 * Usage:
 *   import { useSeo } from '@/composables/useSeo'
 *   useSeo({ title: 'Page Title', description: '...', ... })
 */

const SITE_NAME = 'GFD — Global Full-Stack Developers'
const BASE_URL  = 'https://www.globalfd.xyz'
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`

/**
 * @param {object} options
 * @param {string} options.title        - Page title (without site suffix)
 * @param {string} options.description  - Meta description (max ~160 chars)
 * @param {string} [options.path]       - Canonical path, e.g. '/hire'
 * @param {string} [options.image]      - OG image URL
 * @param {string} [options.type]       - OG type, default 'website'
 * @param {string[]} [options.keywords] - Extra keywords to append
 * @param {object}  [options.schema]    - Additional JSON-LD schema object
 */
export function useSeo({
  title,
  description,
  path = '',
  image = DEFAULT_IMAGE,
  type = 'website',
  keywords = [],
  schema = null,
} = {}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const canonical = `${BASE_URL}${path || window.location.pathname}`

  // ── Title ──
  document.title = fullTitle

  // Helper: upsert a <meta> tag
  function setMeta(selector, attribute, value) {
    if (!value) return
    let el = document.querySelector(selector)
    if (!el) {
      el = document.createElement('meta')
      const [attr, val] = selector.replace('meta[', '').replace(']', '').split('="')
      el.setAttribute(attr, val.replace('"', ''))
      document.head.appendChild(el)
    }
    el.setAttribute(attribute, value)
  }

  // Helper: upsert a <link> tag
  function setLink(rel, href) {
    let el = document.querySelector(`link[rel="${rel}"]`)
    if (!el) {
      el = document.createElement('link')
      el.setAttribute('rel', rel)
      document.head.appendChild(el)
    }
    el.setAttribute('href', href)
  }

  // ── Standard meta ──
  setMeta('meta[name="description"]',                   'content', description)
  setMeta('meta[name="robots"]',                        'content', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1')

  if (keywords.length) {
    const base = 'hire developers, freelance developers, full-stack developers, developer marketplace'
    setMeta('meta[name="keywords"]', 'content', `${base}, ${keywords.join(', ')}`)
  }

  // ── Canonical ──
  setLink('canonical', canonical)

  // ── Open Graph ──
  setMeta('meta[property="og:title"]',       'content', fullTitle)
  setMeta('meta[property="og:description"]', 'content', description)
  setMeta('meta[property="og:url"]',         'content', canonical)
  setMeta('meta[property="og:image"]',       'content', image)
  setMeta('meta[property="og:type"]',        'content', type)
  setMeta('meta[property="og:site_name"]',   'content', SITE_NAME)

  // ── Twitter Card ──
  setMeta('meta[name="twitter:title"]',       'content', fullTitle)
  setMeta('meta[name="twitter:description"]', 'content', description)
  setMeta('meta[name="twitter:image"]',       'content', image)
  setMeta('meta[name="twitter:card"]',        'content', 'summary_large_image')

  // ── JSON-LD structured data ──
  if (schema) {
    const id = 'dynamic-schema'
    let el = document.getElementById(id)
    if (!el) {
      el = document.createElement('script')
      el.id = id
      el.type = 'application/ld+json'
      document.head.appendChild(el)
    }
    el.textContent = JSON.stringify(schema)
  }
}

/** Pre-built SEO configs for key routes */
export const pageSeo = {
  home: {
    title: 'Hire World-Class Full-Stack Developers',
    description:
      'GFD is the global developer marketplace to hire elite full-stack engineers, post freelance projects, and find software jobs. A smarter alternative to Fiverr and Upwork — built for serious dev work.',
    path: '/',
    keywords: ['developer for hire', 'software engineer marketplace', 'fiverr alternative', 'upwork alternative'],
  },
  hire: {
    title: 'Hire a Full-Stack Developer',
    description:
      'Post your project and connect with vetted full-stack developers ready to build. Fixed-price or hourly — find the right developer on GFD in minutes.',
    path: '/hire',
    keywords: ['hire developer', 'post a project', 'find full-stack developer', 'hire programmer online'],
  },
  explore: {
    title: 'Explore Developers & Projects',
    description:
      'Browse thousands of developer profiles and open projects on GFD. Filter by skills, experience, hourly rate, and availability.',
    path: '/explore',
    keywords: ['browse developers', 'developer profiles', 'find programmer', 'software developer search'],
  },
  jobs: {
    title: 'Software Engineering Jobs',
    description:
      'Find full-time, part-time, remote, and freelance software engineering jobs on GFD. Apply directly to companies hiring top developers.',
    path: '/jobs',
    keywords: ['software jobs', 'developer jobs', 'remote developer jobs', 'full-stack jobs', 'programming jobs'],
  },
  projects: {
    title: 'Freelance Projects for Developers',
    description:
      'Browse open freelance software projects on GFD. Submit proposals, set your rate, and work with clients globally.',
    path: '/projects',
    keywords: ['freelance projects', 'software projects', 'developer gigs', 'coding projects for hire'],
  },
  services: {
    title: 'Developer Services',
    description:
      'GFD offers full-stack development, web apps, mobile apps, APIs, and more. Explore our service catalog and hire the right expert for your tech stack.',
    path: '/services',
    keywords: ['web development services', 'app development', 'full-stack services', 'custom software development'],
  },
  community: {
    title: 'Developer Community',
    description:
      'Join the GFD developer community. Share code, discuss tech, follow top engineers, and grow your network.',
    path: '/community',
    keywords: ['developer community', 'programmer network', 'software developer forum', 'tech community'],
  },
  careers: {
    title: 'Tech Careers & Opportunities',
    description:
      'Explore career opportunities for software developers on GFD. From internships to senior roles, find your next tech position.',
    path: '/careers',
    keywords: ['tech careers', 'developer careers', 'software engineer jobs', 'programming career'],
  },
  about: {
    title: 'About GFD',
    description:
      'Learn about Global Full-Stack Developers (GFD) — our mission to connect world-class engineers with meaningful software projects worldwide.',
    path: '/about',
    keywords: ['about GFD', 'developer platform', 'global developers'],
  },
  courses: {
    title: 'Developer Courses & Learning',
    description:
      'Level up your skills with GFD courses. Learn full-stack development, modern frameworks, and land better projects.',
    path: '/courses',
    keywords: ['developer courses', 'programming courses', 'full-stack learning', 'coding tutorials'],
  },
}
