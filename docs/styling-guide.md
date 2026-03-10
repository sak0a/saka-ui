# Saka UI — Styling Guide

This document defines the design token system, theming conventions, and styling patterns used across all Saka UI components. It serves as the single source of truth for colors, spacing, borders, shadows, typography, and animation defaults.

## Overview

Saka UI uses a **CSS custom properties** (design tokens) system mapped to **Tailwind CSS v4** via `@theme`. All tokens use the `--s-` prefix. Components reference tokens through Tailwind utility classes like `bg-primary`, `text-muted-foreground`, `border-border`, etc.

Customizing the theme is as simple as overriding CSS variables in your app's stylesheet.

---

## Color Tokens

All colors follow a **semantic naming** convention. Each color role has a base value and a `-foreground` counterpart for text rendered on top of it.

### Light Mode (default)

| Token | Value | Tailwind Class | Purpose |
|-------|-------|----------------|---------|
| `--s-background` | `#ffffff` | `bg-background` | Page background |
| `--s-foreground` | `#09090b` | `text-foreground` | Default body text |
| `--s-card` | `#ffffff` | `bg-card` | Card surfaces |
| `--s-card-foreground` | `#09090b` | `text-card-foreground` | Card text |
| `--s-popover` | `#ffffff` | `bg-popover` | Popover/dropdown surfaces |
| `--s-popover-foreground` | `#09090b` | `text-popover-foreground` | Popover text |
| `--s-muted` | `#f4f4f5` | `bg-muted` | Subtle/secondary backgrounds |
| `--s-muted-foreground` | `#71717a` | `text-muted-foreground` | Secondary/placeholder text |
| `--s-primary` | `#18181b` | `bg-primary` | Primary actions, buttons |
| `--s-primary-foreground` | `#fafafa` | `text-primary-foreground` | Text on primary |
| `--s-secondary` | `#f4f4f5` | `bg-secondary` | Secondary actions |
| `--s-secondary-foreground` | `#18181b` | `text-secondary-foreground` | Text on secondary |
| `--s-accent` | `#f4f4f5` | `bg-accent` | Highlighted/active items |
| `--s-accent-foreground` | `#18181b` | `text-accent-foreground` | Text on accent |
| `--s-destructive` | `#ef4444` | `bg-destructive` | Destructive/danger actions |
| `--s-destructive-foreground` | `#fafafa` | `text-destructive-foreground` | Text on destructive |
| `--s-success` | `#22c55e` | `bg-success` | Success states |
| `--s-success-foreground` | `#fafafa` | `text-success-foreground` | Text on success |
| `--s-warning` | `#f59e0b` | `bg-warning` | Warning states |
| `--s-warning-foreground` | `#fafafa` | `text-warning-foreground` | Text on warning |
| `--s-info` | `#3b82f6` | `bg-info` | Info states |
| `--s-info-foreground` | `#fafafa` | `text-info-foreground` | Text on info |

### Chrome (borders, inputs, focus)

| Token | Value | Tailwind Class | Purpose |
|-------|-------|----------------|---------|
| `--s-border` | `#e4e4e7` | `border-border` | Default borders |
| `--s-input` | `#e4e4e7` | `border-input` | Input field borders |
| `--s-ring` | `#18181b` | `ring-ring` | Focus ring color |

### Dark Mode

Dark mode activates when the `<html>` element has a `.dark` class. All tokens automatically flip:

| Token | Light | Dark |
|-------|-------|------|
| `--s-background` | `#ffffff` | `#09090b` |
| `--s-foreground` | `#09090b` | `#fafafa` |
| `--s-muted` | `#f4f4f5` | `#27272a` |
| `--s-muted-foreground` | `#71717a` | `#a1a1aa` |
| `--s-primary` | `#18181b` | `#fafafa` |
| `--s-primary-foreground` | `#fafafa` | `#18181b` |
| `--s-secondary` | `#f4f4f5` | `#27272a` |
| `--s-border` | `#e4e4e7` | `#27272a` |
| `--s-ring` | `#18181b` | `#d4d4d8` |
| `--s-destructive` | `#ef4444` | `#dc2626` |
| `--s-success` | `#22c55e` | `#16a34a` |
| `--s-warning` | `#f59e0b` | `#d97706` |
| `--s-info` | `#3b82f6` | `#2563eb` |

Components do **not** use `dark:` Tailwind variants. Instead, they reference semantic tokens that automatically adapt.

---

## Customizing the Primary Color

The default theme uses a neutral zinc palette. To brand your app with a custom accent color, override the primary tokens:

```css
/* Your app's global CSS */
:root {
  --s-primary: #6366f1;           /* indigo-500 */
  --s-primary-foreground: #ffffff;
  --s-ring: #6366f1;
}

:root.dark {
  --s-primary: #818cf8;           /* indigo-400 */
  --s-primary-foreground: #1e1b4b;
  --s-ring: #818cf8;
}
```

All components using `bg-primary`, `text-primary-foreground`, etc. will automatically pick up your brand color.

### Preset Color Examples

| Brand | `--s-primary` (light) | `--s-primary` (dark) |
|-------|----------------------|---------------------|
| Zinc (default) | `#18181b` | `#fafafa` |
| Blue | `#2563eb` | `#60a5fa` |
| Green | `#16a34a` | `#4ade80` |
| Violet | `#7c3aed` | `#a78bfa` |
| Orange | `#ea580c` | `#fb923c` |
| Rose | `#e11d48` | `#fb7185` |

---

## Border Radius

A consistent radius scale used across all components:

| Token | Value | Tailwind Class | Usage |
|-------|-------|----------------|-------|
| `--s-radius-sm` | `0.375rem` (6px) | `rounded-sm` | Small elements, badges, chips |
| `--s-radius-md` | `0.625rem` (10px) | `rounded-md` | Buttons, inputs, cards (default) |
| `--s-radius-lg` | `0.875rem` (14px) | `rounded-lg` | Larger cards, modals |
| `--s-radius-xl` | `1.25rem` (20px) | `rounded-xl` | Panels, hero sections |
| `--s-radius-full` | `9999px` | `rounded-full` | Pills, avatars, circular buttons |

To change the base radius globally:

```css
:root {
  --s-radius-sm: 0.25rem;
  --s-radius-md: 0.5rem;
  --s-radius-lg: 0.75rem;
  --s-radius-xl: 1rem;
}
```

---

## Shadows

Elevation scale for depth perception:

| Token | Tailwind Class | Usage |
|-------|----------------|-------|
| `--s-shadow-xs` | `shadow-xs` | Subtle lift (badges, chips) |
| `--s-shadow-sm` | `shadow-sm` | Slight elevation (cards, buttons) |
| `--s-shadow-md` | `shadow-md` | Medium elevation (dropdowns) |
| `--s-shadow-lg` | `shadow-lg` | High elevation (modals, drawers) |
| `--s-shadow-xl` | `shadow-xl` | Maximum elevation (notifications) |

Shadows are automatically softer in dark mode.

---

## Typography

| Token | Value | Tailwind Class |
|-------|-------|----------------|
| `--s-font-sans` | `"Geist", ui-sans-serif, system-ui, sans-serif` | `font-sans` |
| `--s-font-mono` | `"Geist Mono", ui-monospace, monospace` | `font-mono` |

### Font Size Scale (Tailwind defaults)

| Class | Size | Usage |
|-------|------|-------|
| `text-xs` | 12px | Badges, captions, helper text |
| `text-sm` | 14px | Buttons (default), inputs, labels |
| `text-base` | 16px | Body text, large buttons |
| `text-lg` | 18px | Subheadings, XL buttons |
| `text-xl` | 20px | Card titles |
| `text-2xl` | 24px | Section headings |

---

## Spacing Conventions

Components follow a consistent spacing approach using Tailwind's default scale:

### Component Internal Padding

| Component | Padding | Classes |
|-----------|---------|---------|
| Button (xs) | 6px 6px | `px-1.5 py-0.5` |
| Button (sm) | 8px 2px | `px-2 py-0.5` |
| Button (md) | 8px 2px | `px-2 py-0.5` |
| Button (lg) | 10px 2px | `px-2.5 py-0.5` |
| Button (xl) | 12px 2px | `px-3 py-0.5` |
| Input | 8px 10px | `px-2.5 py-2` |
| Card | 16px–24px | `p-4` to `p-6` |
| Modal | 24px | `p-6` |

### Gap Scale

| Usage | Class | Size |
|-------|-------|------|
| Tight (icons beside text) | `gap-1` to `gap-1.5` | 4–6px |
| Default (button content) | `gap-2` | 8px |
| Comfortable (card sections) | `gap-3` to `gap-4` | 12–16px |
| Spacious (page sections) | `gap-6` to `gap-8` | 24–32px |

---

## Animation

| Token | Value | Usage |
|-------|-------|-------|
| `--s-duration-fast` | `150ms` | Hover states, toggles |
| `--s-duration-normal` | `200ms` | Default transitions |
| `--s-duration-slow` | `300ms` | Modal open/close, drawers |
| `--s-duration-slower` | `500ms` | Page transitions, complex animations |
| `--s-ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | General transitions |
| `--s-ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Exit animations |
| `--s-ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Enter animations |
| `--s-ease-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful/bouncy effects |

Default transition for interactive elements:

```
transition-all duration-200 ease-out
```

---

## States

| State | Pattern | Example |
|-------|---------|---------|
| Hover | Lighten/darken by 10% | `hover:bg-primary/90` |
| Active/Pressed | Scale down slightly | `active:scale-[0.98]` |
| Focus | Ring outline | `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` |
| Disabled | Reduced opacity + no pointer | `opacity-50 cursor-not-allowed` |
| Loading | Reduced opacity + spinner | `opacity-50` + loading indicator |

Disabled opacity is controlled by `--s-opacity-disabled: 0.5`.

---

## Component Variant Patterns

Components use `class-variance-authority` (cva) to define variants declaratively:

```typescript
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '~/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-all duration-200 ease-out',
  {
    variants: {
      variant: {
        filled: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outlined: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        small: 'px-2 py-0.5 text-sm rounded-sm',
        medium: 'px-2 py-0.5 text-sm rounded-md',
        large: 'px-2.5 py-0.5 text-base rounded-md',
      },
    },
    defaultVariants: {
      variant: 'filled',
      size: 'medium',
    },
  }
)
```

### Class Merging with cn()

All components use `cn()` on their root element to allow class overrides:

```vue
<template>
  <button :class="cn(buttonVariants({ variant, size }), $attrs.class)">
    <slot />
  </button>
</template>
```

This means users can override any Tailwind class:

```vue
<!-- Override the background color -->
<SButton class="bg-blue-500 hover:bg-blue-600">Custom</SButton>

<!-- Override the border radius -->
<SButton class="rounded-full">Pill</SButton>
```

### The `type` Prop (Semantic Colors)

Components that accept a `type` prop map semantic names to theme CSS variables. This is the recommended way to apply semantic colors:

```vue
<SButton type="primary">Primary</SButton>
<SButton type="success">Success</SButton>
<SButton type="warning">Warning</SButton>
<SButton type="error">Error</SButton>
<SButton type="info">Info</SButton>
```

| Type | Maps to | Foreground |
|------|---------|------------|
| `primary` | `--s-primary` | `--s-primary-foreground` |
| `error` | `--s-destructive` | `--s-destructive-foreground` |
| `success` | `--s-success` | `--s-success-foreground` |
| `warning` | `--s-warning` | `--s-warning-foreground` |
| `info` | `--s-info` | `--s-info-foreground` |

> **Note:** The `error` type maps to `--s-destructive` (not `--s-error`) since the design token system uses "destructive" for danger/error semantics.

The `type` prop takes precedence over `color` when both are set. When `type` is `'default'` or unset, the `color` prop is used instead.

### The `color` Prop

Components that accept a `color` prop use it as an escape hatch for custom accent colors. When `color` is set, it injects inline styles that override the token-based styling:

```vue
<!-- Uses the theme's --s-primary token (default) -->
<SButton>Default</SButton>

<!-- Uses a custom color -->
<SButton color="#6366f1">Indigo</SButton>
```

Prefer `type` for standard semantic colors and `color` for one-off custom colors.

---

## File Structure

```
src/
├── style.css              # Token definitions + @theme mapping
├── lib/
│   ├── utils.ts           # cn() utility (clsx + tailwind-merge)
│   └── icon.ts            # IconProp helpers for icon-capable components
└── components/ui/
    ├── button.ts          # cva variants
    └── SButton.vue        # Uses cva + cn + tokens
```

### Required Dependencies

When using the open-code (copy) model, these packages are needed:

```json
{
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.5.0",
  "class-variance-authority": "^0.7.1"
}
```

The CLI copies source files but does not install npm packages for you. Add any missing dependencies to your project when using open-code mode.
