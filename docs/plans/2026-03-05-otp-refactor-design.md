# SOTP Component Refactor — Design Document

**Date:** 2026-03-05
**Status:** Approved
**Approach:** Headless Root + Visual Slots (Approach A)

## Goal

Refactor the monolithic SOTP component (1,218 lines, ~60 props) into a composable, shadcn-style compound component tree. Keep all existing features (5 animation systems, morph text, countdown/resend, variants, etc.) but restructure into small, focused components connected via `provide/inject`.

## Target API

```vue
<SOTP v-model="code" :maxlength="6" auto-submit @complete="verify">
  <SOTPGroup>
    <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
  </SOTPGroup>
</SOTP>
```

Grouped with separator:

```vue
<SOTP v-model="code" :maxlength="6">
  <SOTPGroup>
    <SOTPSlot :index="0" />
    <SOTPSlot :index="1" />
    <SOTPSlot :index="2" />
  </SOTPGroup>
  <SOTPSeparator>—</SOTPSeparator>
  <SOTPGroup>
    <SOTPSlot :index="3" />
    <SOTPSlot :index="4" />
    <SOTPSlot :index="5" />
  </SOTPGroup>
</SOTP>
```

## Component Architecture

### SOTP (Headless Root)

State manager. Owns all behavior logic: digits array, input handling, keyboard navigation, paste, validation, completion detection, countdown/resend, error/success state, morph animation logic. Renders no visual digit UI — just a wrapper `<div>` with `<slot>` plus optional label, messages, and resend sections.

Accepts optional visual-default props that cascade to SOTPSlot children via inject.

### SOTPSlot (Visual Digit Box)

Individual digit renderer. Injects context from SOTP. Contains the hidden `<input>`, display character, cursor blink, all per-slot animations. Accepts all visual props (variant, size, rounded, animations, morph settings) with fallback to root defaults.

Has `#placeholder`, `#digit`, `#mask` slots for custom rendering.

### SOTPGroup (Layout Wrapper)

Flex container that groups slots. Accepts `gap` prop. Purely layout, no inject needed.

### SOTPSeparator (Visual Divider)

Renders a visual divider between groups. Has a default slot for custom content. Replaces the old `separator` + `separatorPosition` props with declarative placement.

## Provide/Inject Context

```typescript
interface MorphData {
  from: string
  to: string
  progress: number
  phase: 'out' | 'in'
}

interface SOTPVisualDefaults {
  variant?: SOTPVariant
  size?: SOTPSize
  color?: string
  rounded?: SOTPRounded
  animation?: SOTPAnimation
  entryAnimation?: SOTPEntryAnimation
  inputAnimation?: SOTPInputAnimation
  successAnimation?: SOTPSuccessAnimation
  errorAnimation?: SOTPErrorAnimation
  morphText?: boolean
  morphDuration?: number
  showPlaceholder?: boolean
  placeholderChar?: string
  maskChar?: string
}

interface SOTPContext {
  // Reactive state
  digits: Ref<string[]>
  activeIndex: Ref<number>
  isComplete: Ref<boolean>
  showSuccess: Ref<boolean>
  showError: Ref<boolean>
  animatingIndices: Ref<Set<number>>
  morphingIndices: Ref<Map<number, MorphData>>

  // Behavior props (readonly refs)
  maxlength: Readonly<Ref<number>>
  mode: Readonly<Ref<'numeric' | 'alphanumeric' | 'alphabetic' | 'any'>>
  masked: Readonly<Ref<boolean>>
  disabled: Readonly<Ref<boolean>>
  readonly: Readonly<Ref<boolean>>
  loading: Readonly<Ref<boolean>>
  allowPaste: Readonly<Ref<boolean>>
  error: Readonly<Ref<string | boolean>>
  success: Readonly<Ref<string | boolean>>

  // Visual defaults (SOTPSlot falls back to these)
  defaults: Readonly<Ref<SOTPVisualDefaults>>

  // Methods
  registerInput: (index: number, el: HTMLInputElement | null) => void
  handleInput: (event: Event, index: number) => void
  handleKeydown: (event: KeyboardEvent, index: number) => void
  handlePaste: (event: ClipboardEvent, index: number) => void
  handleFocus: (index: number) => void
  handleBlur: (index: number) => void
  focusInput: (index: number) => void
  startMorphAnimation: (index: number, from: string, to: string) => void
  getMorphStyle: (index: number) => Record<string, any>
  getDisplayChar: (index: number) => string
}
```

Injection key: `Symbol('sotp')` via `useOTPContext.ts`.

## Prop Distribution

### SOTP (root)

Behavior: `modelValue`, `maxlength` (renamed from `length`), `mode`, `autoSubmit`, `masked`, `clearOnError`, `allowPaste`, `autoFocus`, `disabled`, `readonly`, `loading`

State signals: `error`, `success`

Messages: `label`, `hint`, `errorMessage`, `successMessage`

Countdown: `countdown`, `resendText`

Accessibility: `ariaLabel`

Visual defaults (cascade): `variant`, `size`, `color`, `rounded`, `gap`, `animation`, `entryAnimation`, `inputAnimation`, `successAnimation`, `errorAnimation`, `morphText`, `morphDuration`, `showPlaceholder`, `placeholderChar`, `maskChar`

### SOTPSlot

Required: `index`

Visual overrides (fall back to root defaults): `variant`, `size`, `color`, `rounded`, `animation`, `entryAnimation`, `inputAnimation`, `successAnimation`, `errorAnimation`, `morphText`, `morphDuration`, `showPlaceholder`, `placeholderChar`, `maskChar`

### SOTPGroup

`gap` — overrides root default gap.

### SOTPSeparator

No props. Default slot for content.

## Removed Props

- `separator` — replaced by `<SOTPSeparator>` with slot content
- `separatorPosition` — replaced by declarative `<SOTPSeparator>` placement
- `length` — renamed to `maxlength`

## Animation Architecture

| Animation Type | Logic Owner | Render Owner | Trigger |
|---|---|---|---|
| Entry (fade, slide-up, scale, etc.) | SOTPSlot CSS | SOTPSlot | Mount, staggered by `index * 50ms` |
| Input (pop, squeeze, jelly, rubber) | SOTP context (animatingIndices) | SOTPSlot CSS class | handleInput adds index |
| Morph (3D flip text) | SOTP context (startMorphAnimation, rAF) | SOTPSlot inline style | Character change |
| Error (shake, wobble, flash) | SOTP context (showError) | SOTPSlot CSS class | triggerError() or error prop |
| Success per-slot (celebrate, ripple) | SOTP context (showSuccess) | SOTPSlot CSS class | Completion |
| Success global (check) | SOTP root | SOTP root overlay | Completion |

Per-slot effects render in SOTPSlot. Global overlays (checkmark badge) render in SOTP root.

All `@keyframes` CSS moves from the monolith into SOTPSlot's `<style scoped>`.

## File Structure

```
src/components/ui/otp/
├── index.ts              # re-exports all components + types
├── SOTP.vue              # headless root (state + provide)
├── SOTPSlot.vue          # visual digit box
├── SOTPGroup.vue         # flex layout wrapper
├── SOTPSeparator.vue     # visual divider
├── useOTPContext.ts       # injection key, types, useSOTPContext()
└── types.ts              # shared type definitions
```

## Registry Manifest

```json
{
  "name": "otp",
  "displayName": "SOTP",
  "description": "Composable OTP input with headless root, visual slots, groups, and separators. Supports 5 animation systems, text morphing, masked input, countdown/resend.",
  "version": "0.2.0",
  "files": [
    "components/ui/otp/index.ts",
    "components/ui/otp/SOTP.vue",
    "components/ui/otp/SOTPSlot.vue",
    "components/ui/otp/SOTPGroup.vue",
    "components/ui/otp/SOTPSeparator.vue",
    "components/ui/otp/useOTPContext.ts",
    "components/ui/otp/types.ts"
  ],
  "dependencies": [],
  "composables": [],
  "peerDependencies": { "vue": "^3.2.0" },
  "devDependencies": { "@mdi/font": "^7.0.0" }
}
```

## Breaking Changes

This is a full API rewrite. The old single-component `<SOTP :length="6" />` API is replaced with the compound component tree. Acceptable since saka-ui uses shadcn-style copy-paste distribution — each consumer owns their copy.

## Emits (unchanged)

`update:modelValue`, `complete`, `change`, `input`, `focus`, `blur`, `paste`, `resend`, `error`, `success`

## Exposed Methods (unchanged)

`clear()`, `focus()`, `blur()`, `focusInput(index)`, `triggerError(message?)`, `getValue()`, `isComplete()`
