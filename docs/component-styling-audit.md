# Saka UI — Component Styling Audit

Cross-component comparison of sizing, spacing, typography, border-radius, icons, and variant conventions.
Generated from source code analysis of all 32 registry components.

---

## 1. Size Scale Naming Conventions

Components use **standardized abbreviated size naming** across the framework:

| Scale | Components Using It |
|-------|-------------------|
| `xs / sm / md / lg / xl` | SButton, SGlassButton, SProgress, SOTP (uses `xl` too), SPagination |
| `sm / md / lg` | SInput, SSelect, SChip, SSwitch, SAlert, SCheckbox, SRadio, SDropdown, SAccordion, STabs, SOption, SDatePicker, SColorPicker, SCarousel (arrows only), SDataTable, SBadge |
| `xs / sm / md / lg` | SKbd |
| `xs / sm / md / lg / xl / 2xl` | SAvatar |
| `xs / sm / md / lg / xl / full` | SModal, SDrawer |
| `compact / default / comfortable` | SCard, SGlassCard (semantic sizing, intentionally different) |
| No sizes (custom via props) | SIcon, SSkeleton, STooltip, SToast, SBreadcrumb, SCarousel (main) |

### Convention

All components use abbreviated size names (`xs`, `sm`, `md`, `lg`, `xl`, `2xl`) as the standard convention.

- **Card/GlassCard** are the intentional exception, using semantic names (`compact / default / comfortable`) because they describe layout density rather than physical size.
- **Modal/Drawer** already used abbreviated names and were not changed.

---

## 2. Font Size Scale by Component & Size

| Component | Small/xs | Medium/md | Large/lg | XL |
|-----------|----------|-----------|----------|-----|
| **SButton** | `text-xs` | `text-sm` | `text-base` | `text-lg` |
| **SGlassButton** | `text-xs` | `text-sm` | `text-base` | `text-lg` |
| **SInput** | `text-xs` | `text-sm` | `text-base` | — |
| **SSelect** | `text-xs` | `text-sm` | `text-base` | — |
| **SChip** | `text-xs` | `text-sm` | `text-base` | — |
| **SKbd** | xs:`text-[10px]` sm:`text-xs` | `text-xs` | `text-sm` | — |
| **SBadge** | `text-[10px]` | `text-xs` | `text-sm` | — |
| **SAlert** | `text-xs` (body) | `text-sm` (body) | `text-base` (body) | — |
| **STabs** | `text-xs` | `text-sm` | `text-base` | — |
| **SCheckbox** | (box only) | (box only) | (box only) | — |
| **SRadio** | label:`text-xs` | label:`text-sm` | label:`text-base` | — |
| **SSwitch** | label:`text-xs` | label:`text-sm` | label:`text-base` | — |
| **SDropdown** | `text-xs` | `text-sm` | `text-base` | — |
| **SAccordion** | title:`text-sm` | title:`text-base` | title:`text-lg` | — |
| **SPagination** | xs:`text-xs` sm:`text-sm` | `text-sm` | `text-base` | `text-lg` |
| **SDatePicker** | `text-xs` | `text-sm` | `text-base` | — |
| **SColorPicker** | `text-xs` | `text-sm` | `text-base` | — |
| **STooltip** | — (single: `text-sm`) | — | — | — |
| **SToast** | — (single: `text-sm` title, `text-xs` desc) | — | — | — |
| **SOTP** | `text-lg` | `text-2xl` | `text-3xl` | `text-4xl` |

**Pattern**: Most components follow `text-xs → text-sm → text-base → text-lg` progression. This is consistent.

**Outliers**:
- **SKbd** uses `text-[10px]` for xs and `text-xs` for both sm and md — md should arguably be `text-sm`
- **SBadge** uses `text-[10px]` for small — matches kbd xs but badge calls it "small"
- **SOTP** uses much larger text (display-like sizing, appropriate for OTP inputs)

---

## 3. Icon Size Scale by Component & Size

| Component | Small/xs | Medium/md | Large/lg | XL |
|-----------|----------|-----------|----------|-----|
| **SButton** | `text-xs` | `text-base` | `text-lg` | `text-xl` |
| **SGlassButton** | `text-xs` | `text-base` | `text-lg` | `text-xl` |
| **SInput** | `text-sm` | `text-base` | `text-lg` | — |
| **SSelect** | `text-sm` | `text-base` | `text-lg` | — |
| **SOption** | `text-sm` | `text-base` | `text-lg` | — |
| **SDropdown** | `text-sm` | `text-base` | `text-lg` | — |
| **SCheckbox** | `text-[10px]` | `text-xs` | `text-sm` | — |
| **SRadio** | `text-[8px]` | `text-[10px]` | `text-xs` | — |
| **SSwitch (inset)** | `text-[8px]` | `text-[10px]` | `text-xs` | — |
| **SAlert** | `text-lg` | `text-xl` | `text-2xl` | — |
| **SAccordion** | `text-sm` | `text-base` | `text-lg` | — |
| **SPagination** | xs:`text-sm` sm:`text-base` | `text-lg` | `text-xl` | `text-2xl` |
| **SDatePicker** | `text-sm` | `text-base` | `text-lg` | — |
| **SColorPicker** | (no icons) | — | — | — |
| **SCarousel arrows** | `text-lg` | `text-xl` | `text-2xl` | — |
| **SToast** | — (fixed: `size="20"`) | — | — | — |
| **SIcon** | — (custom: default `24px`) | — | — | — |

**Pattern**: Form controls consistently use `text-sm → text-base → text-lg`.
**Outlier**: Button uses `text-xs` for small icons (skips `text-sm`), while Input/Select use `text-sm`. This means at "small" size, a button icon is smaller than an input icon.

---

## 4. Horizontal Padding (px) by Component & Size

| Component | Small/xs | Medium/md | Large/lg | XL |
|-----------|----------|-----------|----------|-----|
| **SButton** | `px-1.5` (6px) | `px-2` (8px) | `px-2.5` (10px) | `px-3` (12px) |
| **SGlassButton** | `px-1.5` | `px-2` | `px-2.5` | `px-3` |
| **SInput** | `px-2.5` (10px) | `px-3` (12px) | `px-4` (16px) | — |
| **SSelect** | `px-2.5` | `px-3` | `px-4` | — |
| **SChip** | `px-2` (8px) | `px-3` (12px) | `px-4` (16px) | — |
| **SKbd** | xs:`px-1` sm:`px-1.5` | `px-1.5` | `px-2` | — |
| **SBadge** | `px-1` (4px) | `px-1.5` (6px) | `px-2` (8px) | — |
| **STabs** | `px-2.5` (10px) | `px-4` (16px) | `px-5` (20px) | — |
| **SDropdown trigger** | `px-2` | `px-2` | `px-2.5` | — |
| **SDropdown item** | `px-2` | `px-2` | `px-2.5` | — |
| **SDatePicker** | `px-2` | `px-2` | `px-2.5` | — |
| **SPagination** | xs:`px-1.5` sm:`px-2` | `px-3` | `px-4` | `px-5` |
| **STooltip** | — (fixed: `px-3`) | — | — | — |
| **SToast** | — (fixed: `p-4`) | — | — | — |

**Pattern**: Buttons are the most compact (px-2 at medium). Form controls (Input, Select) use px-3 at medium. There's a noticeable gap: buttons feel tighter than inputs by design.

---

## 5. Vertical Padding (py) by Component & Size

| Component | Small/xs | Medium/md | Large/lg |
|-----------|----------|-----------|----------|
| **SButton** | `py-0.5` (2px) | `py-0.5` (2px) | `py-0.5` (2px) |
| **SGlassButton** | `py-0.5` | `py-0.5` | `py-0.5` |
| **SInput** | `py-1.5` (6px) | `py-2` (8px) | `py-2.5` (10px) |
| **SChip** | `py-0.5` | `py-1` | `py-1.5` |
| **SKbd** | xs:`py-0.5` | `py-1` | `py-1` |
| **STabs** | `py-1.5` | `py-2` | `py-2.5` |
| **SDropdown trigger** | `py-0.5` | `py-0.5` | `py-0.5` |
| **SDropdown item** | `py-0.5` | `py-0.5` | `py-0.5` |
| **SOption** | `py-1.5` | `py-2` | `py-2.5` |
| **STooltip** | — (fixed: `py-2`) | — | — |

**Note**: SButton and SDropdown use a consistently minimal `py-0.5` across ALL sizes. Height is controlled by font-size + line-height rather than padding.

---

## 6. Min-Height by Component & Size

| Component | Small | Medium | Large |
|-----------|-------|--------|-------|
| **SInput** | `min-h-8` (32px) | `min-h-10` (40px) | `min-h-12` (48px) |
| **SSelect** | `min-h-8` (32px) | `min-h-10` (40px) | `min-h-12` (48px) |
| **SDatePicker** | `min-h-8` (32px) | `min-h-10` (40px) | `min-h-12` (48px) |
| **SButton (icon-only)** | `w-8 h-8` (32px) | `w-10 h-10` (40px) | `w-12 h-12` (48px) |

**Consistent**: All form-like components follow the 32px → 40px → 48px height scale.

---

## 7. Gap Scale by Component & Size

| Component | Small/xs | Medium/md | Large/lg | XL |
|-----------|----------|-----------|----------|-----|
| **SButton** | `gap-1` (4px) | `gap-2` (8px) | `gap-2` (8px) | `gap-2.5` (10px) |
| **SGlassButton** | `gap-1` | `gap-2` | `gap-2` | `gap-2.5` |
| **SChip** | `gap-1` | `gap-1.5` | `gap-2` | — |
| **SCheckbox** | `gap-1.5` | `gap-2` | `gap-2.5` | — |
| **SRadio** | `gap-1.5` | `gap-2` | `gap-2.5` | — |
| **SDropdown** | `gap-1.5` | `gap-2` | `gap-2.5` | — |
| **SOption** | `gap-2` | `gap-2.5` | `gap-3` | — |
| **SPagination** | xs:`gap-0.5` sm:`gap-1` | `gap-1.5` | `gap-2` | `gap-2.5` |
| **SAlert** | `gap-2` | `gap-3` | `gap-4` | — |
| **SSwitch** | — (fixed: `gap-2`) | — | — | — |
| **SToast** | — (fixed: `gap-3`) | — | — | — |

**Pattern**: Most components use `gap-1.5 → gap-2 → gap-2.5` for small → medium → large. Button skips gap-1.5 (uses gap-1 for small). Option is slightly more spacious than others.

---

## 8. Border Radius Conventions

### Components using the `rounded` prop with shared scale:

| Value | Tailwind Class | Components Using |
|-------|---------------|-----------------|
| `none` | `rounded-none` | SButton, SGlassButton, SInput, SCard, SGlassCard, SProgress, SDatePicker |
| `sm` | `rounded` (4px) | SButton, SGlassButton, SInput, SCard, SGlassCard, SProgress, SDatePicker |
| `md` | `rounded-lg` (8px) | SButton, SGlassButton, SInput, SCard, SGlassCard, SProgress, SDatePicker |
| `lg` | `rounded-xl` (12px) | SButton, SGlassButton, SInput, SCard, SGlassCard, SProgress, SDatePicker |
| `full` | `rounded-full` | SButton, SGlassButton, SInput, SCard (as `rounded-3xl`), SProgress, SDatePicker |
| `xl` | `rounded-xl` | SCard, SGlassCard only |
| `2xl` | `rounded-2xl` | SCard, SGlassCard only |

### Components with fixed/hardcoded border radius:

| Component | Border Radius |
|-----------|--------------|
| **SBadge** | `rounded-full` (always pill) |
| **SChip** | `rounded-full` (always pill) |
| **STooltip** | `rounded-md` (fixed) |
| **SToast** | `rounded-xl` (fixed) |
| **SKbd** | xs: `rounded`, sm/md/lg: `rounded-md` |
| **SModal** | `rounded-2xl` (from panelClasses) |
| **SAccordion (separated/card)** | `rounded-xl` |
| **SPagination** | shape prop: `rounded`→`rounded-lg`, `pill`→`rounded-full`, `square`→`rounded-none` |
| **SSwitch** | `rounded-full` (always pill) |
| **SCheckbox** | Configurable via `rounded` prop |

### Inconsistency Note:
The `rounded` prop mapping `sm → rounded` means 4px (Tailwind default), but the design token `--s-radius-sm` is `0.375rem` (6px). The Tailwind mapping in `@theme` maps `--radius-sm` to 6px, so there may be a mismatch between components using raw Tailwind classes vs token-mapped classes.

---

## 9. Variant Conventions

### Shared variant names across components:

| Variant | Components Using |
|---------|-----------------|
| `filled` | SButton, SChip, SBadge, SCheckbox (checked state) |
| `outlined` | SButton, SChip, SBadge, SInput, SKbd |
| `light` | SButton, SChip, SBadge |
| `ghost` | SButton, SInput, SKbd |
| `glass` | SButton, SCard, SModal, SDrawer |
| `link` | SButton only |
| `dashed` | SButton only |
| `elevated` | SCard, SModal (as `elevated`), SDrawer |
| `bordered` | SModal, SDrawer, SAccordion |
| `default` | SKbd, SModal, SDrawer, SAccordion, SDataTable |

**Pattern**: The core trio `filled / outlined / light` is consistent across action/display components (Button, Chip, Badge). Glass variant is available on container components (Card, Modal, Drawer, Button).

### Visual variant styling consistency:

| Variant | Background | Text | Border |
|---------|-----------|------|--------|
| `filled` | `bg-primary` | `text-primary-foreground` | `border-transparent` |
| `outlined` | `bg-transparent` | `text-primary` | `border-primary` (1.5px) |
| `light` | `bg-primary/15` | `text-primary` | `border-transparent` |
| `ghost` | `bg-transparent` | `text-primary` | `border-transparent` |

This is applied consistently across SButton, SChip, and SBadge.

---

## 10. Color System Compliance

### Custom color handling (via `color` prop):

All components that accept a `color` prop follow the same pattern:
1. When `color` is set, skip CVA variant classes for color-specific properties
2. Apply color via inline `CSSProperties` (computed)
3. Keep structural classes (sizing, spacing, layout) from CVA

### Semantic `type` prop:

Components with `type` prop for semantic colors: **SButton**, **SAlert**, **SToast**

Type-to-color mapping in SButton:
```
primary → var(--s-primary)
error → var(--s-error)
success → var(--s-success)
info → var(--s-info)
warning → var(--s-warning)
```

### Alert/Toast color approach

SAlert and SToast now use **semantic state surface tokens** (`bg-error-light`, `text-error-light-foreground`, `border-error-border`, etc.) derived via `color-mix()`. These auto-adapt in dark mode without `dark:` variants, consistent with the token-based theming rule.

### Intentional `dark:` exceptions

The following components retain `dark:` variants as documented acceptable exceptions:

- **SCard**: shadow adjustments for visual depth differences between light/dark
- **SModal / SDrawer**: backdrop opacity differences between light/dark modes

---

## 11. Component Internal Padding (Container Components)

| Component | Compact/Small | Default/Medium | Comfortable/Large |
|-----------|--------------|----------------|-------------------|
| **SCard** | `p-3` (12px) | `p-4 sm:p-5` (16-20px) | `p-5 sm:p-6 lg:p-8` (20-32px) |
| **SGlassCard** | `p-3` | `p-4 sm:p-5` | `p-5 sm:p-6 lg:p-8` |
| **SModal** | — (fixed: content in subcomponents) | — | — |
| **SAlert** | `p-3` | `p-4` | `p-5` |
| **SToast** | — (fixed: `p-4`) | — | — |

Card and GlassCard are perfectly aligned. Alert follows a simpler 3/4/5 scale.

---

## 12. Animation & Transition Conventions

| Property | Value | Components Using |
|----------|-------|-----------------|
| `duration-(--s-duration-normal)` | 200ms | SButton, SBadge, SKbd, SCheckbox |
| `duration-(--s-duration-slow)` | 300ms | SChip, SSwitch, STabs, SAccordion, SDrawer, SInput |
| `ease-out` | | SButton, SInput |
| `ease-in-out` | | SSwitch |

**Design tokens available** (from `style.css`):
- `--s-duration-fast`: 150ms
- `--s-duration-normal`: 200ms
- `--s-duration-slow`: 300ms
- `--s-duration-slower`: 500ms

**Resolved**: Components now reference `duration-(--s-duration-normal)` (200ms) and `duration-(--s-duration-slow)` (300ms) tokens. Action components (Button, Badge, Kbd) use normal; interactive controls (Switch, Chip, Tabs) use slow. This intentional split is now documented in the styling guide.

---

## 13. Focus & Accessibility Patterns

| Pattern | Components |
|---------|-----------|
| `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` | SButton, SCheckbox, SSwitch |
| `focus:outline-none` + above | SButton, SCheckbox |
| No explicit focus styles | SChip, SBadge, SKbd |

**Concern**: Not all interactive components have visible focus indicators. SChip is clickable/closable but lacks focus-visible styles.

---

## 14. Disabled State Conventions

| Pattern | Components |
|---------|-----------|
| `opacity-(--s-opacity-disabled) cursor-not-allowed` | SSwitch, SChip, SButton (via variant) |
| `opacity-(--s-opacity-disabled) cursor-not-allowed` | SCheckbox, SRadio |
| `--s-opacity-disabled: 0.5` | Token referenced by all components above |

**Resolved**: Components now use `opacity-(--s-opacity-disabled)` instead of hardcoded `opacity-50`.

---

## 15. Icon Component (SIcon) Defaults

- Default size: `24px` (set via inline style, not Tailwind class)
- Size prop accepts `number` (px) or `string` (CSS value)
- No predefined size scale — fully custom
- Depth prop maps to opacity: `1 → 1.0`, `2 → 0.82`, `3 → 0.6`, `4 → 0.38`, `5 → 0.18`

---

## 16. Drawer & Modal Size Comparison

### Modal widths:
| Size | Max Width |
|------|-----------|
| `xs` | `max-w-xs` (320px) |
| `sm` | `max-w-sm` (384px) |
| `md` | `max-w-lg` (512px) |
| `lg` | `max-w-2xl` (672px) |
| `xl` | `max-w-4xl` (896px) |
| `full` | `calc(100vw - 2rem)` |

### Drawer sizes (horizontal / vertical):
| Size | Horizontal (width) | Vertical (height) |
|------|-------------------|-------------------|
| `xs` | 280px | 25vh |
| `sm` | 320px | 35vh |
| `md` | 400px | 50vh |
| `lg` | 540px | 70vh |
| `xl` | 720px | 85vh |
| `full` | 100% | 100% |

---

## 17. Summary of Inconsistencies

### Critical (should fix for design system consistency):

1. **Size naming**: **RESOLVED** — All components now use abbreviated `sm/md/lg` convention (with `xs`, `xl`, `2xl` where applicable). Card/GlassCard intentionally use semantic names.
2. **Alert/Toast use `dark:` variants**: **RESOLVED** — now uses semantic state surface tokens (`color-mix()` based) that auto-adapt in dark mode.
3. **Disabled opacity hardcoded**: **RESOLVED** — now uses `opacity-(--s-opacity-disabled)` token.
4. **Animation durations hardcoded**: **RESOLVED** — now uses `duration-(--s-duration-normal)` and `duration-(--s-duration-slow)` tokens.

### Minor (acceptable but worth documenting):

5. **Button icon at small is `text-xs`** while Input/Select icon at small is `text-sm` — 1 step smaller.
6. **Card uses semantic size names** (`compact/default/comfortable`) while all others use t-shirt sizing.
7. **SKbd md size uses `text-xs`** (same as sm) — could be `text-sm` for differentiation.
8. **Focus styles inconsistent**: Not all interactive components have `focus-visible` ring.
9. **Border width**: SButton uses `border-[1.5px]`, SChip/SBadge outlined uses `border-[1.5px]`, but SInput uses default `border` (1px). Consider standardizing.

---

## 18. Recommended Standard (for future alignment)

Based on the most common patterns across components:

### Size Scale Standard:
```
sm → text-xs,  icon: text-sm,   px-2.5, min-h-8  (32px), gap-1.5
md → text-sm,  icon: text-base, px-3,   min-h-10 (40px), gap-2
lg → text-base, icon: text-lg,  px-4,   min-h-12 (48px), gap-2.5
```

### Border Radius Standard:
```
none → rounded-none
sm   → rounded       (4px)
md   → rounded-lg    (8px)  ← default
lg   → rounded-xl    (12px)
full → rounded-full
```

### Variant Standard:
```
filled   → bg-primary, text-primary-foreground
outlined → bg-transparent, border-[1.5px] border-primary, text-primary
light    → bg-primary/15, text-primary
ghost    → bg-transparent, text-primary, hover:bg-accent
```
