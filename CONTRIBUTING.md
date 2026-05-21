# GFD Frontend — Contributing Guide

## Branch Strategy

```
main              ← Production (protected, merge via PR only)
development       ← Integration branch (all features merge here first)
feature/*         ← New features
fix/*             ← Bug fixes
refactor/*        ← Code improvements
```

## Branch Naming

```bash
feature/navbar
feature/auth-pages
feature/dashboard-ui
feature/client-request
feature/community-section
fix/mobile-layout
fix/auth-redirect
refactor/component-cleanup
```

## Developer Responsibilities

| Developer | Ownership |
|-----------|-----------|
| Dev 1 | Navbar, Hero Section, Footer |
| Dev 2 | Auth pages (Login, Register, Forgot Password) |
| Dev 3 | Dashboard UI (Overview, Profile, Requests) |
| Dev 4 | Client Request flow (multi-step form) |
| Dev 5 | Community, Jobs, Careers sections |

## Workflow

```bash
# 1. Always branch from development
git checkout development
git pull origin development
git checkout -b feature/your-feature

# 2. Make your changes
# 3. Commit with conventional commits
git add src/components/layout/TheNavbar.vue
git commit -m "feat(navbar): add glassmorphism scroll effect"

# 4. Push and open PR to development
git push -u origin feature/your-feature
```

## Commit Convention

```
feat(scope): add new feature
fix(scope): fix a bug
style(scope): UI/CSS changes
refactor(scope): code restructure
docs(scope): documentation update
chore(scope): config/tooling changes
```

## Component Naming

- **Files**: PascalCase — `TheNavbar.vue`, `HeroSection.vue`
- **Common components**: `src/components/common/`
- **Layout components**: `src/components/layout/`
- **UI primitives**: `src/components/ui/`
- **Page-specific**: inside the view folder

## Code Standards

- Use `<script setup>` syntax
- Use Composition API with composables
- No TypeScript — plain JavaScript
- Tailwind for utilities, CSS variables for theming
- All colors via CSS variables (never hardcode hex)
- Responsive: mobile-first approach
- Accessibility: semantic HTML, aria labels on interactive elements

## PR Rules

1. PRs target `development`, never `main`
2. At least 1 reviewer approval required
3. ESLint must pass
4. Build must succeed
5. Screenshots required for UI changes
