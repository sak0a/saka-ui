# SOTP Compound Component Refactor — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor the monolithic SOTP (1,218 lines) into 4 composable shadcn-style primitives: SOTP, SOTPSlot, SOTPGroup, SOTPSeparator.

**Architecture:** Headless root (SOTP) manages state via provide/inject. SOTPSlot renders individual digit boxes consuming context. SOTPGroup provides flex layout. SOTPSeparator is a declarative divider. Visual defaults cascade from root to slots.

**Tech Stack:** Vue 3 Composition API, TypeScript, Tailwind CSS v4, provide/inject

**Design Doc:** `docs/plans/2026-03-05-otp-refactor-design.md`

**Existing Pattern Reference:** `src/components/ui/accordion/SAccordion.vue` — uses `InjectionKey<T>` + `Symbol()` + register/unregister lifecycle.

**No test infrastructure exists.** Verification is via `bun run build:lib` (library builds without type errors) and manual inspection.

---

### Task 1: Create shared types (`types.ts`)

**Files:**
- Create: `src/components/ui/otp/types.ts`

**Step 1: Write the types file**

All shared type aliases extracted from the current SOTP props. These are used by both SOTP (for defaults) and SOTPSlot (for per-slot overrides).

```typescript
// types.ts
export type SOTPVariant = 'outlined' | 'filled' | 'underlined' | 'ghost' | 'morphing'
export type SOTPSize = 'small' | 'medium' | 'large' | 'xl'
export type SOTPRounded = 'none' | 'sm' | 'md' | 'lg' | 'full'
export type SOTPGap = 'tight' | 'normal' | 'wide'
export type SOTPMode = 'numeric' | 'alphanumeric' | 'alphabetic' | 'any'
export type SOTPAnimation = 'none' | 'bounce' | 'shake' | 'pulse' | 'flip' | 'morph' | 'glow' | 'wave'
export type SOTPEntryAnimation = 'none' | 'fade' | 'slide-up' | 'slide-down' | 'scale' | 'rotate' | 'blur'
export type SOTPInputAnimation = 'none' | 'pop' | 'squeeze' | 'jelly' | 'rubber'
export type SOTPSuccessAnimation = 'none' | 'celebrate' | 'check' | 'ripple'
export type SOTPErrorAnimation = 'none' | 'shake' | 'wobble' | 'flash'

export interface SOTPVisualDefaults {
  variant: SOTPVariant
  size: SOTPSize
  color: string
  rounded: SOTPRounded
  animation: SOTPAnimation
  entryAnimation: SOTPEntryAnimation
  inputAnimation: SOTPInputAnimation
  successAnimation: SOTPSuccessAnimation
  errorAnimation: SOTPErrorAnimation
  morphText: boolean
  morphDuration: number
  showPlaceholder: boolean
  placeholderChar: string
  maskChar: string
}
```

**Step 2: Verify no type errors**

Run: `bunx vue-tsc --noEmit --pretty 2>&1 | head -20` (or just check the file compiles in editor)

**Step 3: Commit**

```bash
git add src/components/ui/otp/types.ts
git commit -m "feat(otp): add shared type definitions for compound component refactor"
```

---

### Task 2: Create context composable (`useOTPContext.ts`)

**Files:**
- Create: `src/components/ui/otp/useOTPContext.ts`

**Step 1: Write the context file**

This defines the injection key, context interface, and `useSOTPContext()` helper. Follow the accordion pattern: `InjectionKey<T>` + `Symbol()`.

```typescript
// useOTPContext.ts
import type { InjectionKey, Ref } from 'vue'
import type { SOTPMode, SOTPVisualDefaults } from './types'

export interface MorphData {
  from: string
  to: string
  progress: number
  phase: 'out' | 'in'
}

export interface SOTPContext {
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
  mode: Readonly<Ref<SOTPMode>>
  masked: Readonly<Ref<boolean>>
  disabled: Readonly<Ref<boolean>>
  readonly: Readonly<Ref<boolean>>
  loading: Readonly<Ref<boolean>>
  allowPaste: Readonly<Ref<boolean>>
  error: Readonly<Ref<string | boolean>>
  success: Readonly<Ref<string | boolean>>

  // Visual defaults (SOTPSlot falls back to these)
  defaults: Readonly<Ref<SOTPVisualDefaults>>

  // Methods for SOTPSlot to call
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

export const SOTP_INJECTION_KEY: InjectionKey<SOTPContext> = Symbol('SOTPContext')

export function useSOTPContext(): SOTPContext {
  const ctx = inject(SOTP_INJECTION_KEY)
  if (!ctx) {
    throw new Error('[saka-ui] SOTPSlot must be used inside an SOTP component.')
  }
  return ctx
}
```

**Important:** Add `import { inject } from 'vue'` at the top.

**Step 2: Commit**

```bash
git add src/components/ui/otp/useOTPContext.ts
git commit -m "feat(otp): add provide/inject context and injection key"
```

---

### Task 3: Create SOTPGroup component

**Files:**
- Create: `src/components/ui/otp/SOTPGroup.vue`

**Step 1: Write SOTPGroup**

Simplest component — purely layout. A flex container with configurable gap.

```vue
<script setup lang="ts">
defineOptions({ inheritAttrs: false })

import type { SOTPGap } from './types'

interface Props {
  gap?: SOTPGap
}

const props = withDefaults(defineProps<Props>(), {
  gap: 'normal'
})

const gapClasses: Record<SOTPGap, string> = {
  tight: 'gap-1',
  normal: 'gap-2',
  wide: 'gap-4'
}
</script>

<template>
  <div
    v-bind="$attrs"
    class="s-otp-group flex items-center"
    :class="gapClasses[props.gap]"
  >
    <slot />
  </div>
</template>
```

**Step 2: Commit**

```bash
git add src/components/ui/otp/SOTPGroup.vue
git commit -m "feat(otp): add SOTPGroup layout component"
```

---

### Task 4: Create SOTPSeparator component

**Files:**
- Create: `src/components/ui/otp/SOTPSeparator.vue`

**Step 1: Write SOTPSeparator**

Simple component with a default slot. Renders a dash by default.

```vue
<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <div
    v-bind="$attrs"
    class="s-otp-separator flex items-center justify-center px-1 text-(--s-text-tertiary) font-bold select-none text-2xl"
    role="separator"
  >
    <slot>-</slot>
  </div>
</template>
```

**Step 2: Commit**

```bash
git add src/components/ui/otp/SOTPSeparator.vue
git commit -m "feat(otp): add SOTPSeparator divider component"
```

---

### Task 5: Rewrite SOTP as headless root

**Files:**
- Modify: `src/components/ui/otp/SOTP.vue` (full rewrite)

This is the biggest task. Take the existing 1,218-line monolith and restructure it:
- **Keep:** All `<script setup>` logic (refs, computed, watchers, handlers, lifecycle)
- **Remove:** All visual digit rendering from `<template>` (the v-for loop with boxes)
- **Add:** `provide()` call with full context
- **Add:** Visual default props that cascade to children
- **Keep:** Label, messages, resend sections in template (they stay in root)
- **Keep:** Check overlay (global success effect)

**Step 1: Rewrite SOTP.vue**

The `<script setup>` section keeps all existing logic but:
- Rename `length` prop to `maxlength`
- Add visual-default props (variant, size, etc.) with defaults matching current behavior
- Add `provide(SOTP_INJECTION_KEY, context)` at the end
- Add `registerInput` method for SOTPSlot to register its input element
- Export `inputPattern` and `inputMode` as computed refs in context

The `<template>` becomes:
```vue
<template>
  <div ref="containerRef" v-bind="$attrs" class="s-otp-wrapper flex flex-col items-center w-fit"
    :class="{ 'opacity-50 pointer-events-none': disabled }">
    <!-- Label -->
    <label v-if="label" class="s-otp-label font-medium text-(--s-text-secondary) mb-3 text-center"
      :class="sizeConfig.label">{{ label }}</label>

    <!-- Slot content (SOTPGroup > SOTPSlot tree goes here) -->
    <div class="s-otp-container relative flex items-center" :class="gapConfig">
      <slot />
      <!-- Loading indicator -->
      <div v-if="loading" class="ml-3 flex items-center">
        <span class="mdi mdi-loading animate-spin text-(--s-primary)" :class="sizeConfig.icon" />
      </div>
      <!-- Success check overlay (global) -->
      <!-- ... keep existing Transition for check overlay ... -->
    </div>

    <!-- Messages section (error/success/hint) — keep as-is -->
    <!-- Resend section — keep as-is -->
  </div>
</template>
```

The `<style scoped>` keeps ONLY the success check animations and any root-level animations. All per-slot keyframes move to SOTPSlot in Task 6.

**Step 2: Verify build**

Run: `bun run build:lib`
Expected: Build succeeds (SOTPSlot doesn't exist yet but SOTP just provides context and renders a slot)

**Step 3: Commit**

```bash
git add src/components/ui/otp/SOTP.vue
git commit -m "feat(otp): rewrite SOTP as headless root with provide/inject context"
```

---

### Task 6: Create SOTPSlot component

**Files:**
- Create: `src/components/ui/otp/SOTPSlot.vue`

This is the second biggest task. SOTPSlot renders a single digit box by:
1. Injecting SOTP context via `useSOTPContext()`
2. Accepting visual props with fallback to `ctx.defaults`
3. Rendering the hidden input + display character + cursor + animations
4. Delegating all events to context methods

**Step 1: Write SOTPSlot.vue**

```vue
<script setup lang="ts">
defineOptions({ inheritAttrs: false })

import { computed, onMounted, onBeforeUnmount } from 'vue'
import { useSOTPContext } from './useOTPContext'
import type {
  SOTPVariant, SOTPSize, SOTPRounded,
  SOTPAnimation, SOTPEntryAnimation, SOTPInputAnimation,
  SOTPSuccessAnimation, SOTPErrorAnimation
} from './types'

interface Props {
  index: number
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

const props = defineProps<Props>()
const ctx = useSOTPContext()

// Resolve visual props: own prop > root default
const resolved = computed(() => {
  const d = ctx.defaults.value
  return {
    variant: props.variant ?? d.variant,
    size: props.size ?? d.size,
    color: props.color ?? d.color,
    rounded: props.rounded ?? d.rounded,
    animation: props.animation ?? d.animation,
    entryAnimation: props.entryAnimation ?? d.entryAnimation,
    inputAnimation: props.inputAnimation ?? d.inputAnimation,
    successAnimation: props.successAnimation ?? d.successAnimation,
    errorAnimation: props.errorAnimation ?? d.errorAnimation,
    morphText: props.morphText ?? d.morphText,
    morphDuration: props.morphDuration ?? d.morphDuration,
    showPlaceholder: props.showPlaceholder ?? d.showPlaceholder,
    placeholderChar: props.placeholderChar ?? d.placeholderChar,
    maskChar: props.maskChar ?? d.maskChar,
  }
})

// Size/variant/rounded configs — same computed maps from old SOTP
const sizeConfig = computed(() => { /* ... copy from old SOTP lines 137-169 ... */ })
const roundedConfig = computed(() => { /* ... copy from old SOTP lines 182-191 ... */ })
const variantClasses = computed(() => { /* ... copy from old SOTP lines 194-203 ... */ })

// Input mode for this slot
const inputMode = computed(() => ctx.mode.value === 'numeric' ? 'numeric' : 'text')

// Template ref callback
const setInputRef = (el: any) => {
  ctx.registerInput(props.index, el as HTMLInputElement | null)
}
</script>

<template>
  <!-- The entire digit box div from old SOTP lines 657-819, but using ctx.* for state -->
  <div v-bind="$attrs" class="s-otp-box relative flex items-center justify-center overflow-hidden transition-all duration-200"
    style="perspective: 500px;"
    :class="[sizeConfig.box, roundedConfig, variantClasses, { /* ...all conditional classes using ctx.activeIndex, ctx.showSuccess, ctx.showError, resolved.entryAnimation, etc... */ }]"
    :style="{ '--entry-delay': `${props.index * 50}ms`, animationDelay: `${props.index * 50}ms` }"
    @click="ctx.focusInput(props.index)">

    <!-- Glow effect for morphing variant -->
    <!-- Background pulse on input -->
    <!-- Hidden input (using setInputRef, ctx.handleInput, ctx.handleKeydown, etc.) -->
    <!-- Display character span (using ctx.getDisplayChar, ctx.getMorphStyle, ctx.animatingIndices, etc.) -->
    <!--   #placeholder, #digit, #mask slots -->
    <!-- Cursor blink -->
  </div>
</template>

<style scoped>
/* ALL @keyframes from old SOTP: entry, input, error, success per-slot animations */
</style>
```

The full implementation copies the visual rendering from old SOTP lines 657-819 (the digit box `<div>`) and all `@keyframes` from lines 972-1208.

Every reference to `digits[index]`, `activeIndex`, `showSuccess`, `showError`, `animatingIndices`, `morphingIndices` changes to `ctx.digits.value[props.index]`, `ctx.activeIndex.value`, etc.

Every reference to `variant`, `size`, `rounded`, `entryAnimation`, `inputAnimation`, etc. changes to `resolved.value.variant`, `resolved.value.size`, etc.

**Step 2: Verify build**

Run: `bun run build:lib`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/components/ui/otp/SOTPSlot.vue
git commit -m "feat(otp): add SOTPSlot visual digit box component"
```

---

### Task 7: Update index.ts exports

**Files:**
- Modify: `src/components/ui/otp/index.ts`

**Step 1: Rewrite index.ts**

```typescript
export { default as SOTP } from './SOTP.vue'
export { default as SOTPSlot } from './SOTPSlot.vue'
export { default as SOTPGroup } from './SOTPGroup.vue'
export { default as SOTPSeparator } from './SOTPSeparator.vue'
export { SOTP_INJECTION_KEY, useSOTPContext } from './useOTPContext'
export type { SOTPContext, MorphData } from './useOTPContext'
export type * from './types'
```

**Step 2: Verify build**

Run: `bun run build:lib`
Expected: Build succeeds with all exports resolved

**Step 3: Commit**

```bash
git add src/components/ui/otp/index.ts
git commit -m "feat(otp): update index exports for compound component API"
```

---

### Task 8: Update registry manifest

**Files:**
- Modify: `registry/components/otp.json`

**Step 1: Update manifest**

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
  "peerDependencies": {
    "vue": "^3.2.0"
  },
  "devDependencies": {
    "@mdi/font": "^7.0.0"
  }
}
```

**Step 2: Rebuild registry**

Run: `bun run build:registry`
Expected: Registry rebuilds successfully, source mirror includes all 7 OTP files

**Step 3: Commit**

```bash
git add registry/components/otp.json
git commit -m "feat(otp): update registry manifest for compound component structure"
```

---

### Task 9: Full build verification

**Files:** None (verification only)

**Step 1: Run full build**

Run: `bun run build:all`
Expected: Library build + registry build + CLI build all pass

**Step 2: Verify CLI lists component correctly**

Run: `bunx tsx cli/index.ts list`
Expected: `otp` appears in the component list

**Step 3: Verify registry source files**

Run: `ls registry/source/components/ui/otp/`
Expected: All 7 files present: `index.ts`, `SOTP.vue`, `SOTPSlot.vue`, `SOTPGroup.vue`, `SOTPSeparator.vue`, `useOTPContext.ts`, `types.ts`

**Step 4: Final commit if any cleanup needed**

```bash
git add -A && git commit -m "chore(otp): verify full build pipeline for compound OTP"
```

---

## Task Dependency Graph

```
Task 1 (types.ts) ──┐
                     ├──> Task 2 (useOTPContext.ts) ──> Task 5 (SOTP.vue rewrite) ──> Task 6 (SOTPSlot.vue) ──┐
Task 3 (SOTPGroup)   │                                                                                        ├──> Task 7 (index.ts) ──> Task 8 (manifest) ──> Task 9 (verify)
Task 4 (SOTPSeparator)┘
```

Tasks 1, 3, 4 are independent and can run in parallel.
Task 2 depends on Task 1 (imports types).
Task 5 depends on Task 2 (imports context).
Task 6 depends on Tasks 2 + 5 (imports context, needs SOTP to provide it).
Tasks 7-9 are sequential finalization.

## Parallel Agent Dispatch Strategy

**Batch 1** (independent): Tasks 1, 3, 4 — types, SOTPGroup, SOTPSeparator
**Batch 2** (sequential): Task 2 — useOTPContext (needs types from Batch 1)
**Batch 3** (sequential): Task 5 — SOTP.vue rewrite (needs context from Batch 2)
**Batch 4** (sequential): Task 6 — SOTPSlot.vue (needs SOTP from Batch 3)
**Batch 5** (sequential): Tasks 7, 8, 9 — exports, manifest, verification
