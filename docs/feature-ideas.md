# Feature Ideas for Saka UI

This document contains ideas for new composables and components that could enhance the Saka UI framework.

## High Priority Suggestions

### 1. `useToast` Composable + `SToastContainer` Component
A comprehensive toast notification system with a composable API.

**Why it's useful:**
- You already have `SAlert` that can work as toasts, but a dedicated composable would provide:
  - Programmatic API: `toast.success('Saved!')`, `toast.error('Failed')`
  - Queue management (stacking, max count)
  - Auto-dismiss with progress indicator
  - Position management (top-right, bottom-left, etc.)
  - Promise-based toasts (show loading → success/error)

**Features:**
- Multiple toast types: success, error, warning, info, custom
- Configurable duration, position, and styling
- Queue management (max toasts, stacking behavior)
- Progress indicator for auto-dismiss
- Promise-based API for async operations
- Accessibility support (ARIA labels, keyboard navigation)

---

### 2. `useDialog` / `useConfirm` Composable
Confirmation dialogs and programmatic dialogs.

**Why it's useful:**
- Common pattern for confirmations, prompts, and custom dialogs:
  - `confirm('Delete item?')` → returns Promise<boolean>
  - `prompt('Enter name')` → returns Promise<string | null>
  - Custom dialogs with full control

**Features:**
- Simple confirm dialogs (yes/no)
- Prompt dialogs (text input)
- Custom dialog content
- Promise-based API
- Keyboard shortcuts (Enter/Escape)
- Focus management

---

### 3. `useClipboard` Composable
Copy to clipboard with feedback.

**Why it's useful:**
- Simple utility for copy operations:
  - `copy(text)` → returns Promise<boolean>
  - Auto-fallback for older browsers
  - Optional toast on success

**Features:**
- Modern Clipboard API with fallback
- Success/error feedback
- Optional toast notification
- Type-safe API

---

### 4. `useClickOutside` Composable
Detect clicks outside an element.

**Why it's useful:**
- Useful for dropdowns, modals, popovers:
  - Returns ref to attach to element
  - Configurable (exclude elements, keyboard events)

**Features:**
- Element ref attachment
- Exclude specific elements from detection
- Keyboard event support (Escape key)
- Multiple element support

---

### 5. `useMediaQuery` Composable
Reactive media query breakpoints.

**Why it's useful:**
- Responsive design helper:
  - `const isMobile = useMediaQuery('(max-width: 768px)')`
  - Matches your `useTheme` pattern
  - Useful for conditional rendering

**Features:**
- Reactive media query matching
- Multiple breakpoint support
- SSR-safe
- Matches existing `useTheme` pattern

---

## Medium Priority Suggestions

### 6. `useDebounce` / `useThrottle` Composables
Debounce and throttle values/callbacks.

**Why it's useful:**
- Common utilities for search, resize, scroll:
  - `const debouncedSearch = useDebounce(searchTerm, 300)`
  - `const throttledScroll = useThrottle(onScroll, 100)`

**Features:**
- Value debouncing/throttling
- Callback debouncing/throttling
- Configurable delay
- Immediate execution option

---

### 7. `useLocalStorage` / `useSessionStorage` Composables
Reactive localStorage/sessionStorage.

**Why it's useful:**
- Reactive storage that syncs across tabs:
  - `const user = useLocalStorage('user', { name: '' })`
  - Auto-sync between tabs
  - Type-safe with TypeScript

**Features:**
- Reactive refs for storage values
- Type-safe with TypeScript generics
- Cross-tab synchronization
- SSR-safe
- Custom serialization support

---

### 8. `useAsync` Composable
Handle async operations with loading/error states.

**Why it's useful:**
- Common pattern for API calls:
  - `const { data, loading, error, execute } = useAsync(fetchUsers)`
  - Automatic loading/error state management
  - Retry logic, caching options

**Features:**
- Automatic loading state
- Error handling
- Retry logic
- Caching support
- Abort controller integration

---

### 9. `useHotkey` Composable
Keyboard shortcuts.

**Why it's useful:**
- Useful for power users:
  - `useHotkey('ctrl+k', () => openCommandPalette())`
  - Modifier key support (ctrl, alt, shift, meta)
  - Prevent default option

**Features:**
- Single and combination key support
- Modifier keys (ctrl, alt, shift, meta)
- Prevent default option
- Global or scoped hotkeys
- Type-safe key combinations

---

### 10. `useIntersectionObserver` Composable
Lazy loading and scroll animations.

**Why it's useful:**
- Performance optimization:
  - `const { isVisible, ref } = useIntersectionObserver()`
  - Lazy load images/components
  - Trigger animations on scroll

**Features:**
- Element visibility detection
- Threshold configuration
- Root margin support
- Multiple element observation

---

## Component Suggestions

### 11. `SToast` / `SToastContainer` Components
Dedicated toast components (if you prefer components over composable).

**Features:**
- Toast item component
- Container component for positioning
- Animation support
- Queue management

---

### 12. `SBreadcrumbs` Component
Breadcrumb navigation.

**Features:**
- Hierarchical navigation display
- Separator customization
- Link support
- Responsive design

---

### 13. `SStepper` / `SWizard` Component
Multi-step forms/wizards.

**Features:**
- Step navigation
- Progress indicator
- Validation per step
- Optional/required steps

---

### 14. `SPopover` Component
Popover (different from tooltip - can contain interactive content).

**Features:**
- Position management
- Trigger element support
- Interactive content
- Arrow indicator

---

### 15. `SCommandPalette` / `SCommandMenu` Component
Command palette (Cmd+K style).

**Features:**
- Keyboard navigation
- Search/filter
- Categories/groups
- Keyboard shortcuts display

---

### 16. `SFileUpload` / `SDropzone` Component
File upload with drag & drop.

**Features:**
- Drag and drop support
- File validation
- Progress indicator
- Preview support
- Multiple files

---

### 17. `SRating` Component
Star rating input/display.

**Features:**
- Read-only and editable modes
- Half-star support
- Custom icons
- Size variants

---

### 18. `SSlider` / `SRangeSlider` Component
Range slider input.

**Features:**
- Single and range modes
- Step configuration
- Min/max values
- Custom styling
- Tooltip display

---

### 19. `STimeline` Component
Timeline/activity feed display.

**Features:**
- Vertical and horizontal layouts
- Custom icons
- Date/time display
- Interactive items

---

### 20. `STreeView` Component
Hierarchical tree view.

**Features:**
- Expand/collapse
- Selection support
- Drag and drop
- Lazy loading
- Custom node rendering

---

## Implementation Priority

**Recommended order:**
1. ✅ `useToast` - Most commonly needed
2. ✅ `useDialog` / `useConfirm` - Very useful
3. ✅ `useClipboard` - Simple and frequently used
4. ✅ `useClickOutside` - Useful for many components
5. ✅ `useMediaQuery` - Matches existing patterns
6. ✅ `useDebounce` / `useThrottle` - Common utilities
7. ✅ `useLocalStorage` / `useSessionStorage` - Reactive storage
8. ✅ `useAsync` - Common async pattern
9. ✅ `useHotkey` - Power user feature
10. ✅ `useIntersectionObserver` - Performance optimization

Components can be added as needed based on specific use cases.
