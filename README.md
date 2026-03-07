# Saka-UI

A modern, high-performance Vue 3 component library built with Tailwind CSS v4 and Vite.

## ✨ Features

- 🎨 **Beautiful Design** — Modern, clean aesthetics with dark/light theme support
- ⚡ **Vue 3 Composition API** — Built with `<script setup>` and TypeScript
- 🎯 **Tailwind CSS v4** — Utility-first styling with CSS variables
- 📦 **Tree-shakable** — Import only what you need
- 🔧 **Fully Typed** — Complete TypeScript support with exported types
- ♿ **Accessible** — Keyboard navigation and ARIA support

## 📦 Components

### Form Controls

| Component | Description |
| --- | --- |
| SButton | Versatile button with variants, sizes, icons, and loading states |
| SCheckbox | Checkbox with indeterminate state and custom styling |
| SRadio / SRadioGroup | Radio buttons with group management |
| SSwitch | Toggle switch with icons, labels, and track text |
| SSelect / SOption / SOptionGroup | Feature-rich dropdown with search, multiple selection, and grouping |
| SDatePicker | Date picker with range selection and calendar view |
| SColorPicker | Color picker with presets and custom color input |

### Data Display

| Component | Description |
| --- | --- |
| SBadge | Status badges with dot indicators and colors |
| SChip | Tags/chips with icons and close functionality |
| SAvatar / SAvatarGroup | User avatars with fallback and grouping |
| SCarousel / SCarouselSlide | Image/content carousel with autoplay |
| SAccordion / SAccordionItem | Collapsible content panels |
| STabs / STabPane | Tab navigation with 5 style variants |
| SIcon | MDI icon wrapper component |

### Feedback

| Component | Description |
| --- | --- |
| SAlert | Alert messages with variants and dismissible option |
| STooltip | Rich tooltips with 12 placements and interactive mode |

### Documentation

| Component | Description |
| --- | --- |
| SApiSection | API reference section wrapper |
| SApiTable | Props/events/slots/methods documentation table |
| SApiKeyboard | Keyboard shortcuts display |

## 🚀 Quick Start

```bash
# Install dependencies (requires Bun — https://bun.sh)
bun install

# Start dev server
bun run dev

# Build the default production artifacts (type-check + library + registry)
bun run build
```

## 🧑‍💻 Development

This project uses [**Bun**](https://bun.sh/) as its package manager and script runner.

### Local Verification

Before pushing, run the same install/build/smoke steps that CI executes:

```bash
# 1. Install dependencies with a frozen lockfile
bun install --frozen-lockfile

# 2. Build the component library bundle
bun run build:lib:bundle

# 3. Build registry source artifacts
bun run build:registry

# 4. Build the CLI tool
bun run build:cli

# 5. Run the CLI smoke test
bun run test:smoke
```

All five steps must pass locally for CI to be green.

### Available Scripts

| Command | Description |
| --- | --- |
| bun run dev | Start the Vite dev server |
| bun run build | Full production build (type-check → library → registry) |
| bun run build:lib | Build the component library with declaration generation |
| bun run build:lib:bundle | Build the component library bundle only (clean CI check) |
| bun run build:cli | Build the CLI tool (via tsup) |
| bun run build:registry | Build the component registry |
| bun run build:all | Build library + registry + CLI |
| bun run test:smoke | Run CLI smoke tests (requires build:cli first) |
| bun run preview | Preview the production build locally |

### Continuous Integration

A GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push and pull request to `main`. It performs:

1. **Install** — `bun install --frozen-lockfile`
2. **Build library bundle** — `bun run build:lib:bundle`
3. **Build registry sources** — `bun run build:registry`
4. **Build CLI** — `bun run build:cli`
5. **CLI smoke test** — `bun run test:smoke`

CI uses the latest Bun version on Ubuntu. The frozen lockfile flag ensures reproducible installs. The workflow intentionally gates on checks that fail loudly today: the bundle-only library build, registry source generation, CLI build, and CLI smoke path.

### GitHub Pages Deployment

A dedicated GitHub Actions workflow (`.github/workflows/pages.yml`) deploys the demo/docs site to GitHub Pages. It runs automatically on pushes to `main` and can also be started manually from the Actions tab.

The workflow installs dependencies with Bun, runs the Pages-specific build command (`npm run build:pages`), uploads the generated `dist-pages/` artifact, and deploys it to the repository's GitHub Pages environment.

To enable publishing, set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**. After the workflow succeeds, the site will be available at `https://<owner>.github.io/saka-ui/`.

## 🛠️ Tech Stack

- **Framework**: [Vue 3](https://vuejs.org/) with Composition API
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **Runtime**: [Bun](https://bun.sh/)
- **Icons**: [Material Design Icons](https://pictogrammers.com/library/mdi/)
- **Types**: TypeScript with `vite-plugin-dts`

## 📋 Project Status

- [x] Vue 3 + TypeScript + Vite setup
- [x] Tailwind CSS v4.1 with Vite plugin
- [x] 25+ UI components implemented
- [x] Component documentation views
- [x] Reusable API reference components
- [x] Vite Library Mode configured
- [x] TypeScript declaration generation
- [x] GitHub Actions CI (bundle + registry + CLI smoke)
- [ ] Unit tests
- [ ] Storybook integration
- [ ] npm package publishing

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/           # Core UI components
│   ├── SApiSection.vue
│   ├── SApiTable.vue
│   ├── SApiKeyboard.vue
│   └── DemoSection.vue
├── views/
│   └── ui/           # Component documentation pages
├── index.ts          # Library exports
├── style.css         # Tailwind entry point
└── App.vue           # Demo application
```

## 📄 License

MIT