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
|-----------|-------------|
| `SButton` | Versatile button with variants, sizes, icons, and loading states |
| `SCheckbox` | Checkbox with indeterminate state and custom styling |
| `SRadio` / `SRadioGroup` | Radio buttons with group management |
| `SSwitch` | Toggle switch with icons, labels, and track text |
| `SSelect` / `SOption` / `SOptionGroup` | Feature-rich dropdown with search, multiple selection, and grouping |
| `SDatePicker` | Date picker with range selection and calendar view |
| `SColorPicker` | Color picker with presets and custom color input |

### Data Display
| Component | Description |
|-----------|-------------|
| `SBadge` | Status badges with dot indicators and colors |
| `SChip` | Tags/chips with icons and close functionality |
| `SAvatar` / `SAvatarGroup` | User avatars with fallback and grouping |
| `SCarousel` / `SCarouselSlide` | Image/content carousel with autoplay |
| `SAccordion` / `SAccordionItem` | Collapsible content panels |
| `STabs` / `STabPane` | Tab navigation with 5 style variants |
| `SIcon` | MDI icon wrapper component |

### Feedback
| Component | Description |
|-----------|-------------|
| `SAlert` | Alert messages with variants and dismissible option |
| `STooltip` | Rich tooltips with 12 placements and interactive mode |

### Documentation
| Component | Description |
|-----------|-------------|
| `SApiSection` | API reference section wrapper |
| `SApiTable` | Props/events/slots/methods documentation table |
| `SApiKeyboard` | Keyboard shortcuts display |

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Start dev server
bun run dev

# Build for production
bun run build
```

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
