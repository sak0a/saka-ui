# Saka-UI Roadmap

## ✅ Completed

### Infrastructure
- [x] Initialize Vue 3 + TypeScript project with Bun
- [x] Install Tailwind CSS v4.1 with Vite plugin
- [x] Configure Vite Library Mode in `vite.config.ts`
- [x] Set up `src/index.ts` for barrel exports
- [x] Implement Tailwind v4 CSS entry point
- [x] Set up TypeScript declaration bundling (`vite-plugin-dts`)
- [x] Vue Router for demo navigation

### UI Components (25+)
- [x] `SButton` — Buttons with variants, sizes, icons, loading
- [x] `SCheckbox` — Checkbox with indeterminate state
- [x] `SRadio` / `SRadioGroup` — Radio buttons
- [x] `SSwitch` — Toggle switch with icons & labels
- [x] `SSelect` / `SOption` / `SOptionGroup` — Dropdown select
- [x] `SDatePicker` — Date picker with range support
- [x] `SColorPicker` — Color picker with presets
- [x] `SBadge` — Status badges
- [x] `SChip` — Tags/chips
- [x] `SAvatar` / `SAvatarGroup` — User avatars
- [x] `SCarousel` / `SCarouselSlide` — Content carousel
- [x] `SAccordion` / `SAccordionItem` — Collapsible panels
- [x] `STabs` / `STabPane` — Tab navigation (5 variants)
- [x] `SIcon` — MDI icon wrapper
- [x] `SAlert` — Alert messages
- [x] `STooltip` — Rich tooltips

### Documentation
- [x] Component documentation views for all components
- [x] `DemoSection` component for code examples
- [x] Reusable API reference components (`SApiSection`, `SApiTable`, `SApiKeyboard`)
- [x] Type exports for API documentation interfaces

## 🚧 In Progress

- [ ] Finalize component APIs and props consistency
- [ ] Cross-browser testing

## 📋 Planned

### Components
- [ ] `SInput` — Text input with validation
- [ ] `STextarea` — Multi-line text input
- [ ] `SModal` / `SDialog` — Modal dialogs
- [ ] `SDrawer` — Slide-out drawer
- [ ] `SDropdown` — Dropdown menu
- [ ] `SPopover` — Popover content
- [ ] `SProgress` — Progress bar/circle
- [ ] `SSkeleton` — Loading skeleton
- [ ] `STable` — Data table
- [ ] `SPagination` — Pagination controls
- [ ] `SBreadcrumb` — Breadcrumb navigation
- [ ] `SMenu` — Navigation menu
- [ ] `SSlider` — Range slider
- [ ] `SRating` — Star rating

### Infrastructure
- [ ] Unit tests with Vitest
- [ ] Storybook integration
- [ ] Publish to npm
- [ ] Documentation website
- [ ] Changelog automation
- [ ] CI/CD pipeline

## 🎨 Design System

### Theme Variables
The library uses CSS custom properties for theming:
- `--s-primary` — Primary accent color
- `--s-bg-primary` / `--s-bg-secondary` / `--s-bg-tertiary` — Background colors
- `--s-text-primary` / `--s-text-secondary` / `--s-text-tertiary` — Text colors
- `--s-border` — Border color
