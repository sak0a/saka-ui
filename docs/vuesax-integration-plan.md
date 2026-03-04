# Vuesax Integration Plan

This document outlines the plan to integrate animation and interaction patterns from the **Vuesax** Vue framework into our Saka UI component library.

## Overview

The Vuesax framework (located in `vuesax_framework/`) contains beautiful animations and smooth transitions that we want to adopt for our components. This document tracks which features to port and their implementation status.

---

## Key Vuesax Features to Adopt

### 1. Label-Placeholder Animation (Float Label Pattern)

**Description:** Vuesax implements a "label-placeholder" pattern where the placeholder text animates from inside the input field to a label position above the input when focused or when a value is present.

**Source Reference:**
- `vuesax_framework/vuesax/src/components/vsInput/Base/style.sass` (lines 96-130)
- `vuesax_framework/vuesax/src/components/vsSelect/Base/style.sass` (lines 133-156)

**CSS Animation Details:**
```scss
// The label starts inside the field (like a placeholder)
// On focus or when has value:
transform: translate(-3%, -77%);  // Moves up and slightly left
font-size: .75rem;                // Shrinks to label size
opacity: 1;
visibility: visible;
transition: all .25s ease;
```

**Components to Update:**
- [ ] `SInput.vue` - Add `labelPlaceholder` prop
- [x] `SSelect.vue` - Add `labelPlaceholder` prop ✅ **IMPLEMENTED**
- [ ] `SFormField.vue` - Consider adding support

---

### 2. Inline Search/Filter (No Separate Search Field)

**Description:** In Vuesax, when `filter` is enabled on the Select component, the main input becomes searchable - users type directly into the select trigger rather than a separate search input inside the dropdown.

**Source Reference:**
- `vuesax_framework/vuesax/src/components/vsSelect/Base/vsSelect.ts` (lines 477-509, 529-552)
- Demo: https://vuesax.com/docs/components/Select.html#filter

**Current Implementation:**
Our `SSelect.vue` uses a **separate search input** inside the dropdown (`searchable` prop). This works but is a different UX pattern.

**Proposed Changes:**
- Add a new prop `filter` (or `inlineSearch`) that enables typing directly in the trigger
- The trigger input shows the search query when typing, then shows selected value when not focused
- Support both patterns for flexibility

✅ **IMPLEMENTED** - The `filter` prop is now available on `SSelect.vue`

---

### 3. Lift/Float Animation on Focus

**Description:** Vuesax inputs and selects lift slightly upward (`translate(0, -4px)`) with a shadow when focused or hovered, creating a sense of depth.

**Source Reference:**
```scss
// From vsSelect style.sass
&:hover, &:focus
  background: -color('background')
  box-shadow: 0px 5px 25px -4px rgba(0,0,0, var(--shadow-opacity))
  transform: translate(0, -4px)
  transition: all .25s ease
```

**Components to Update:**
- [ ] `SInput.vue`
- [ ] `SSelect.vue`
- [ ] `SFormField.vue`
- Consider making this an opt-in behavior via `elevate` or `lift` prop

---

### 4. Dropdown Animation (Top/Bottom Placement)

**Description:** Vuesax dropdown animations adjust based on whether the dropdown appears above or below the trigger, with appropriate slide directions.

**Source Reference:**
```scss
// Dropdown opening animation
.vs-select-enter
  opacity: 0
  transform: translate(0, -10px)  // or +10px for top placement
  transition: all .25s ease
  box-shadow: 0px 0px 0px 0px rgba(0,0,0, var(--shadow-opacity))
```

**Status:** ✅ Already partially implemented in our `SSelect.vue`

---

### 5. Loading Animation

**Description:** Vuesax has a distinctive loading animation with dashed border spinning effect.

**Source Reference:**
```scss
// Dual-ring loading animation
&:after
  border: 2px solid -color('primary', 1)
  border-top: 2px solid transparent
  animation: rotateInputLoading .8s ease infinite

&:before
  border: 2px dashed -color('primary', 1)
  border-top: 2px solid transparent
  animation: rotateInputLoading .8s linear infinite
  opacity: .2
```

---

### 6. State/Color Variations

**Description:** Vuesax supports state-based coloring (`success`, `danger`, `warn`, `dark`, `primary`) that affects the entire component appearance including background, border, label, and icon colors.

**Source Reference:**
- `vuesax_framework/vuesax/src/components/vsSelect/Base/style.sass` (lines 4-39)

---

## Implementation Priority

### Phase 1: Select Component Enhancements ✅ COMPLETED
1. **Label-Placeholder Animation** - ✅ Implemented via `labelPlaceholder` prop
2. **Inline Filter/Search** - ✅ Implemented via `filter` prop

### Phase 2: Input Component Enhancements
1. **Label-Placeholder Animation** for SInput
2. **Lift/Float Animation** as opt-in feature

### Phase 3: Form-Wide Features
1. Apply consistent patterns to all form components
2. Add state-based color theming

---

## Technical Notes

### Vuesax Framework Location
- Docs: `vuesax_framework/docs/`
- Components: `vuesax_framework/vuesax/src/components/`

### Key Style Patterns Used by Vuesax
1. Uses SASS with custom `-color()` mixin for theming
2. Heavy use of CSS transitions (`.25s ease` is common)
3. Box-shadow for elevation effects
4. Transform for micro-interactions

### Our Approach
- Use Tailwind CSS classes where possible
- Add scoped CSS for complex animations
- Keep props API consistent with our existing patterns
- Make animations performant (GPU-accelerated transforms)

---

## References

- [Vuesax Select Component](https://vuesax.com/docs/components/Select.html)
- [Vuesax Input Component](https://vuesax.com/docs/components/Input.html)
- Local Vuesax source: `vuesax_framework/vuesax/src/`
