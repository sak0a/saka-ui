# useLocalStorage / useSessionStorage

Reactive localStorage and sessionStorage composables for Vue 3 with cross-tab synchronization, type safety, and SSR support.

## Installation

```typescript
import { useLocalStorage, useSessionStorage } from 'saka-ui'
```

## Basic Usage

### localStorage

```typescript
import { useLocalStorage } from 'saka-ui'

// String value
const { value: theme } = useLocalStorage('theme', 'light')
theme.value = 'dark' // Automatically synced to localStorage

// Object value
const { value: user } = useLocalStorage('user', { name: 'Guest', email: '' })
user.value.name = 'John' // Deep reactivity, synced to localStorage

// Number value
const { value: count } = useLocalStorage('count', 0)
count.value++
```

### sessionStorage

```typescript
import { useSessionStorage } from 'saka-ui'

// Session data (cleared when browser closes)
const { value: session } = useSessionStorage('session', {
  token: null,
  expiresAt: null
})

// Form state that persists during the session
const { value: formData } = useSessionStorage('checkout-form', {
  step: 1,
  items: []
})
```

## Cross-Tab Synchronization

localStorage values automatically sync across browser tabs:

```typescript
const { value: cart } = useLocalStorage('cart', { items: [] })

// When another tab updates the cart, this value updates automatically
watch(cart, (newCart) => {
  console.log('Cart updated:', newCart)
})
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `serializer` | `Serializer<T>` | Auto | Custom serializer for the value |
| `syncTabs` | `boolean` | `true` | Whether to sync across tabs (localStorage only) |
| `onError` | `(error: Error) => void` | `console.error` | Error callback |
| `writeDefaults` | `boolean` | `false` | Write default value if key doesn't exist |
| `listenToStorageChanges` | `boolean` | `true` | Listen for storage changes |
| `mergeDefaults` | `boolean \| function` | `false` | Merge stored value with defaults |

## Return Value

| Property | Type | Description |
|----------|------|-------------|
| `value` | `Ref<T>` | Reactive storage value |
| `remove` | `() => void` | Remove the value from storage |
| `exists` | `() => boolean` | Check if the key exists in storage |
| `refresh` | `() => void` | Force refresh from storage |

## Custom Serializers

By default, values are serialized using JSON. You can provide custom serializers:

```typescript
import { useLocalStorage } from 'saka-ui'

// Date serializer
const { value: lastVisit } = useLocalStorage('lastVisit', new Date(), {
  serializer: {
    read: (v) => new Date(v),
    write: (v) => v.toISOString()
  }
})

// Set serializer
const { value: favorites } = useLocalStorage('favorites', new Set<string>(), {
  serializer: {
    read: (v) => new Set(JSON.parse(v)),
    write: (v) => JSON.stringify([...v])
  }
})
```

### Built-in Serializers

```typescript
import { 
  jsonSerializer,    // Default for objects/arrays
  stringSerializer,  // For plain strings
  numberSerializer,  // For numbers
  booleanSerializer  // For booleans
} from 'saka-ui'

// Use specific serializer
const { value } = useLocalStorage('data', initialValue, {
  serializer: jsonSerializer
})
```

## Merge Defaults

Useful when your default value has new properties that stored values might not have:

```typescript
// Simple merge
const { value: settings } = useLocalStorage('settings', {
  theme: 'light',
  notifications: true,
  newFeature: false  // New property not in stored value
}, {
  mergeDefaults: true
})

// Custom merge function
const { value: config } = useLocalStorage('config', defaultConfig, {
  mergeDefaults: (stored, defaults) => ({
    ...defaults,
    ...stored,
    // Ensure certain fields always come from defaults
    version: defaults.version
  })
})
```

## Error Handling

Handle storage errors (e.g., quota exceeded):

```typescript
const { value: largeData } = useLocalStorage('largeData', {}, {
  onError: (error) => {
    console.error('Storage error:', error)
    toast.error('Failed to save data')
  }
})
```

## SSR Safety

Both composables are SSR-safe. On the server, they return the default value:

```typescript
// Works in SSR - returns default value on server, real value on client
const { value: user } = useLocalStorage('user', { name: 'Guest' })
```

## Remove and Check Existence

```typescript
const { value, remove, exists, refresh } = useLocalStorage('data', {})

// Check if key exists in storage
if (exists()) {
  console.log('Data found in storage')
}

// Remove from storage
remove()

// Force refresh from storage
refresh()
```

## createStorage

Create a storage composable with a custom storage implementation:

```typescript
import { createStorage } from 'saka-ui'

// Custom memory storage
const memoryStorage: Storage = {
  data: new Map(),
  getItem(key) { return this.data.get(key) ?? null },
  setItem(key, value) { this.data.set(key, value) },
  removeItem(key) { this.data.delete(key) },
  clear() { this.data.clear() },
  get length() { return this.data.size },
  key(index) { return Array.from(this.data.keys())[index] ?? null }
}

const { value } = createStorage('key', 'default', memoryStorage)
```

## Types

```typescript
interface Serializer<T> {
  read: (value: string) => T
  write: (value: T) => string
}

interface StorageOptions<T> {
  serializer?: Serializer<T>
  syncTabs?: boolean
  onError?: (error: Error) => void
  writeDefaults?: boolean
  listenToStorageChanges?: boolean
  mergeDefaults?: boolean | ((storageValue: T, defaults: T) => T)
}

interface UseStorageReturn<T> {
  value: Ref<T>
  remove: () => void
  exists: () => boolean
  refresh: () => void
}
```

## Complete Example

```vue
<script setup lang="ts">
import { useLocalStorage, useSessionStorage } from 'saka-ui'

// User preferences (persisted)
const { value: preferences } = useLocalStorage('preferences', {
  theme: 'system',
  language: 'en',
  notifications: true,
  sidebar: 'expanded'
})

// Shopping cart (persisted)
const { value: cart, remove: clearCart } = useLocalStorage('cart', {
  items: [] as { id: number; quantity: number }[],
  coupon: null as string | null
})

// Session-only authentication
const { value: auth, remove: logout } = useSessionStorage('auth', {
  token: null as string | null,
  user: null as { id: number; name: string } | null
})

function addToCart(productId: number) {
  const existing = cart.value.items.find(i => i.id === productId)
  if (existing) {
    existing.quantity++
  } else {
    cart.value.items.push({ id: productId, quantity: 1 })
  }
}

function handleLogout() {
  logout() // Clears session storage
  clearCart() // Clears local storage cart
}

function toggleTheme() {
  preferences.value.theme = preferences.value.theme === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <div>
    <!-- Theme toggle -->
    <button @click="toggleTheme">
      Theme: {{ preferences.theme }}
    </button>
    
    <!-- Cart display -->
    <div v-if="cart.items.length">
      <h3>Cart ({{ cart.items.length }} items)</h3>
      <ul>
        <li v-for="item in cart.items" :key="item.id">
          Product #{{ item.id }} x{{ item.quantity }}
        </li>
      </ul>
      <button @click="clearCart">Clear Cart</button>
    </div>
    
    <!-- User info -->
    <div v-if="auth.user">
      <p>Welcome, {{ auth.user.name }}</p>
      <button @click="handleLogout">Logout</button>
    </div>
    
    <!-- Settings -->
    <div>
      <label>
        <input type="checkbox" v-model="preferences.notifications" />
        Enable notifications
      </label>
      
      <select v-model="preferences.language">
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
      </select>
    </div>
  </div>
</template>
```

## Use Cases

- **User preferences**: Theme, language, sidebar state
- **Shopping cart**: Persist cart across page reloads
- **Form drafts**: Auto-save form data while editing
- **Authentication tokens**: Store tokens in sessionStorage for security
- **Recently viewed items**: Track browsing history
- **Feature flags**: Store user-specific feature states
