# useDebounce / useThrottle

Debounce and throttle composables for Vue 3 with support for both values and callbacks.

## Installation

```typescript
import { useDebounce, useDebounceFn, useThrottle, useThrottleFn } from 'saka-ui'
```

## Basic Usage

### Value Debouncing

Debounce a reactive value - the returned value updates after the specified delay when the source value stops changing.

```typescript
import { ref } from 'vue'
import { useDebounce } from 'saka-ui'

const searchTerm = ref('')
const { value: debouncedSearch } = useDebounce(searchTerm, 300)

// Use debouncedSearch for API calls
watch(debouncedSearch, (value) => {
  fetchResults(value)
})
```

### Callback Debouncing

Create a debounced function that delays invoking until after the specified milliseconds have elapsed since the last call.

```typescript
import { useDebounceFn } from 'saka-ui'

const debouncedSearch = useDebounceFn(() => {
  console.log('Searching...')
}, 300)

// Call it multiple times - only executes once after 300ms of inactivity
debouncedSearch()
debouncedSearch()
debouncedSearch() // Only this triggers the actual search after 300ms
```

### Value Throttling

Throttle a value - the returned value updates at most once per specified interval.

```typescript
import { ref } from 'vue'
import { useThrottle } from 'saka-ui'

const scrollY = ref(0)
const { value: throttledScroll } = useThrottle(scrollY, 100)

// Updates at most every 100ms
window.addEventListener('scroll', () => {
  scrollY.value = window.scrollY
})
```

### Callback Throttling

Create a throttled function that only invokes at most once per specified interval.

```typescript
import { useThrottleFn } from 'saka-ui'

const throttledScroll = useThrottleFn(() => {
  console.log('Scrolled!')
}, 100)

window.addEventListener('scroll', throttledScroll)
```

## useDebounce

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `immediate` | `boolean` | `false` | Execute immediately on first call |
| `maxWait` | `number` | `undefined` | Maximum time to wait before forcing execution |

### Return Value

| Property | Type | Description |
|----------|------|-------------|
| `value` | `Ref<T>` | The debounced value |
| `cancel` | `() => void` | Cancel any pending update |
| `flush` | `() => void` | Immediately apply pending value |
| `isPending` | `Ref<boolean>` | Whether there's a pending update |

### Examples

```typescript
// With max wait - ensures execution after 2 seconds even if value keeps changing
const { value, cancel, flush, isPending } = useDebounce(inputValue, 500, { 
  maxWait: 2000 
})

// Cancel pending update
cancel()

// Force immediate update
flush()

// Check if update is pending
if (isPending.value) {
  console.log('Waiting to update...')
}
```

## useDebounceFn

### Options

Same as `useDebounce`:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `immediate` | `boolean` | `false` | Execute immediately on first call |
| `maxWait` | `number` | `undefined` | Maximum time to wait before forcing execution |

### Return Value

Returns a `DebouncedFn` with:

| Method | Type | Description |
|--------|------|-------------|
| `(call)` | `(...args) => void` | Call the debounced function |
| `cancel` | `() => void` | Cancel any pending execution |
| `flush` | `() => void` | Immediately execute pending call |
| `isPending` | `() => boolean` | Whether there's a pending execution |

### Examples

```typescript
// With immediate option - execute on first call, then debounce
const debouncedSave = useDebounceFn(
  (data) => saveData(data),
  1000,
  { immediate: true }
)

// With max wait - ensures execution every 1 second during continuous activity
const debouncedResize = useDebounceFn(
  () => recalculateLayout(),
  200,
  { maxWait: 1000 }
)

// Cancel pending execution
debouncedResize.cancel()

// Check if pending
if (debouncedResize.isPending()) {
  console.log('Resize pending...')
}
```

## useThrottle

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `leading` | `boolean` | `true` | Execute on the leading edge |
| `trailing` | `boolean` | `true` | Execute on the trailing edge |

### Return Value

| Property | Type | Description |
|----------|------|-------------|
| `value` | `Ref<T>` | The throttled value |
| `cancel` | `() => void` | Cancel any pending update |
| `isPending` | `Ref<boolean>` | Whether there's a pending update |

### Examples

```typescript
// Leading and trailing (default)
const { value } = useThrottle(mousePosition, 50)

// Leading only - update immediately, then wait
const { value } = useThrottle(scrollY, 100, {
  leading: true,
  trailing: false
})

// Trailing only - wait, then update
const { value } = useThrottle(inputValue, 100, {
  leading: false,
  trailing: true
})
```

## useThrottleFn

### Options

Same as `useThrottle`:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `leading` | `boolean` | `true` | Execute on the leading edge |
| `trailing` | `boolean` | `true` | Execute on the trailing edge |

### Return Value

Returns a `ThrottledFn` with:

| Method | Type | Description |
|--------|------|-------------|
| `(call)` | `(...args) => void` | Call the throttled function |
| `cancel` | `() => void` | Cancel any pending execution |
| `isPending` | `() => boolean` | Whether there's a pending execution |

### Examples

```typescript
// Leading only - execute immediately, then wait
const throttledClick = useThrottleFn(
  () => handleClick(),
  1000,
  { leading: true, trailing: false }
)

// Trailing only - wait, then execute
const throttledResize = useThrottleFn(
  () => recalculate(),
  200,
  { leading: false, trailing: true }
)
```

## Types

```typescript
interface DebounceOptions {
  /** Execute immediately on first call, then debounce subsequent calls */
  immediate?: boolean
  /** Maximum time to wait before forcing execution */
  maxWait?: number
}

interface ThrottleOptions {
  /** Execute on the leading edge */
  leading?: boolean
  /** Execute on the trailing edge */
  trailing?: boolean
}

interface DebouncedFn<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void
  cancel: () => void
  flush: () => void
  isPending: () => boolean
}

interface ThrottledFn<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void
  cancel: () => void
  isPending: () => boolean
}

interface UseDebounceReturn<T> {
  value: Ref<T>
  cancel: () => void
  flush: () => void
  isPending: Ref<boolean>
}

interface UseThrottleReturn<T> {
  value: Ref<T>
  cancel: () => void
  isPending: Ref<boolean>
}
```

## Complete Example

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDebounce, useDebounceFn, useThrottleFn } from 'saka-ui'

// Search with debounced value
const searchQuery = ref('')
const { value: debouncedQuery, isPending } = useDebounce(searchQuery, 300)
const searchResults = ref<string[]>([])

watch(debouncedQuery, async (query) => {
  if (query) {
    searchResults.value = await fetchSearchResults(query)
  } else {
    searchResults.value = []
  }
})

// Debounced save function
const formData = ref({ name: '', email: '' })
const isSaving = ref(false)

const debouncedSave = useDebounceFn(async () => {
  isSaving.value = true
  await saveToServer(formData.value)
  isSaving.value = false
}, 1000)

// Auto-save on form changes
watch(formData, () => {
  debouncedSave()
}, { deep: true })

// Throttled scroll handler
const scrollPosition = ref(0)

const throttledScrollHandler = useThrottleFn(() => {
  scrollPosition.value = window.scrollY
  updateProgressBar()
}, 100)

onMounted(() => {
  window.addEventListener('scroll', throttledScrollHandler)
})

onUnmounted(() => {
  window.removeEventListener('scroll', throttledScrollHandler)
})
</script>

<template>
  <div class="space-y-6">
    <!-- Search with debounce -->
    <div>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search..."
        class="input"
      />
      <span v-if="isPending" class="text-sm text-gray-500">Searching...</span>
      
      <ul v-if="searchResults.length">
        <li v-for="result in searchResults" :key="result">
          {{ result }}
        </li>
      </ul>
    </div>
    
    <!-- Auto-save form -->
    <div>
      <input v-model="formData.name" placeholder="Name" />
      <input v-model="formData.email" placeholder="Email" />
      <span v-if="isSaving">Saving...</span>
      <span v-else>Auto-saved</span>
    </div>
    
    <!-- Scroll position -->
    <div class="fixed bottom-4 right-4">
      Scroll: {{ scrollPosition }}px
    </div>
  </div>
</template>
```

## Use Cases

- **Search input**: Debounce API calls while user types
- **Form auto-save**: Debounce save operations to prevent excessive writes
- **Window resize**: Throttle layout recalculations
- **Scroll events**: Throttle scroll handlers for performance
- **Button clicks**: Prevent double-clicks with throttle
- **API rate limiting**: Control request frequency
