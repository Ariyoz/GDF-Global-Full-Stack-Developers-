# GFD Frontend — Global Full-Stack Developers

> Premium Vue.js frontend for the GFD software company and developer ecosystem.

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| Vue.js | 3.x | Frontend framework |
| Vite | 8.x | Build tool |
| Vue Router | 4.x | Client-side routing |
| Pinia | 2.x | State management |
| Axios | 1.x | HTTP client |
| Bootstrap | 5.3 | Grid & components |
| Tailwind CSS | 4.x | Utility classes |
| ESLint | 9.x | Code linting |
| Prettier | 3.x | Code formatting |

## Getting Started

```bash
# Clone the repo
git clone https://github.com/gfd-dev/gfd-frontend.git
cd gfd-frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

## Scripts

```bash
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run format   # Run Prettier
```

## Project Structure

```
src/
├── assets/          # Images, fonts, icons
├── components/
│   ├── common/      # Page sections (Hero, About, Services...)
│   ├── layout/      # Navbar, Footer, Sidebar, Topbar
│   └── ui/          # Reusable primitives (Button, Card, Input...)
├── composables/     # Reusable Vue composables
├── config/          # API config, app config
├── constants/       # App-wide constants
├── layouts/         # Page layouts (Default, Auth, Dashboard)
├── router/          # Vue Router config + guards
├── services/        # API service layer (Axios)
├── store/           # Pinia stores
├── styles/          # Global CSS (variables, glass, animations)
├── utils/           # Helper functions
└── views/           # Page components
    ├── Home/
    ├── About/
    ├── Services/
    ├── Community/
    ├── Projects/
    ├── Careers/
    ├── Contact/
    ├── ClientRequest/
    ├── Auth/
    └── Dashboard/
```

## VS Code Setup

Install recommended extensions when prompted, or manually:
- **Vue - Official** (Volar)
- **ESLint**
- **Prettier**
- **Tailwind CSS IntelliSense**
- **GitLens**

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full Git workflow and coding standards.

## License

© 2024 Global Full-Stack Developers. All rights reserved.
