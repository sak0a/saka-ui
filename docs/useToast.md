# useToast

A toast notification composable for Vue 3 with queue management, positioning, and promise-based API.

## Installation

```typescript
import { useToast, SToastContainer } from 'saka-ui'
```

## Setup

Add `SToastContainer` to your app root (usually in `App.vue`):

```vue
<template>
  <RouterView />
  <SToastContainer />
</template>
```

You can have multiple containers for different positions:

```vue
<template>
  <RouterView />
  <SToastContainer position="top-right" />
  <SToastContainer position="bottom-left" />
</template>
```

## Basic Usage

```typescript
import { useToast } from 'saka-ui'

const toast = useToast()

// Simple messages
toast.success('Changes saved!')
toast.error('Failed to save')
toast.warning('Check your input')
toast.info('New update available')
```

## Toast Options

```typescript
toast.success({
  title: 'Success',
  description: 'Your changes have been saved successfully.',
  duration: 3000,
  position: 'top-right',
  showProgress: true,
  closable: true,
  icon: 'check',
  onClick: () => console.log('Toast clicked'),
  onClose: () => console.log('Toast closed')
})
```

## Loading Toasts

Loading toasts don't auto-dismiss:

```typescript
const loadingToast = toast.loading('Uploading file...')

// Later, dismiss it manually
loadingToast.dismiss()
```

## Promise-based Toasts

Show loading → success/error based on promise resolution:

```typescript
// With a promise
toast.promise(
  fetch('/api/save', { method: 'POST' }),
  {
    loading: 'Saving...',
    success: 'Saved successfully!',
    error: 'Failed to save'
  }
)

// With options objects
toast.promise(saveData(), {
  loading: { title: 'Saving', description: 'Please wait...' },
  success: { title: 'Success', description: 'Your data has been saved' },
  error: { title: 'Error', description: 'Something went wrong' }
})

// With dynamic success/error messages
toast.promise(submitForm(), {
  loading: 'Submitting form...',
  success: (data) => `Created item #${data.id}`,
  error: (err) => `Error: ${err.message}`
})
```

## Custom Toasts

```typescript
toast.custom({
  title: 'Custom Toast',
  description: 'With custom styling',
  color: '#8b5cf6',
  icon: 'star',
  duration: 8000
})
```

## Toast Instance

All toast methods return a `ToastInstance` with control methods:

```typescript
const myToast = toast.success('Hello!')

// Dismiss the toast
myToast.dismiss()

// Pause auto-dismiss (useful for interactions)
myToast.pause()
myToast.resume()

// Update toast content
myToast.update({
  title: 'Updated Title',
  description: 'New description'
})
```

## Global Configuration

```typescript
const toast = useToast()

toast.configure({
  position: 'bottom-right',  // Default position
  duration: 4000,            // Default duration (ms)
  maxToasts: 5,              // Max toasts per position
  gap: 8,                    // Gap between toasts (px)
  showProgress: true,        // Show progress bar
  closable: true             // Show close button
})
```

## Dismiss Toasts

```typescript
const toast = useToast()

// Dismiss by ID
const myToast = toast.success('Hello')
toast.dismiss(myToast.id)

// Dismiss all toasts
toast.dismissAll()
```

## Positions

Available positions:
- `top-left`
- `top-center`
- `top-right` (default)
- `bottom-left`
- `bottom-center`
- `bottom-right`

```typescript
toast.info({
  description: 'Bottom left notification',
  position: 'bottom-left'
})
```

## SToastContainer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `ToastPosition` | `'top-right'` | Position on screen |
| `maxToasts` | `number` | `5` | Maximum toasts to show |
| `gap` | `number` | `8` | Gap between toasts (px) |
| `teleport` | `boolean \| string` | `true` | Teleport target |
| `zIndex` | `number` | `9999` | Z-index for container |

## Toast Types

```typescript
type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading' | 'custom'

type ToastPosition = 
  | 'top-left' 
  | 'top-right' 
  | 'top-center'
  | 'bottom-left' 
  | 'bottom-right' 
  | 'bottom-center'

interface ToastOptions {
  title?: string
  description?: string
  duration?: number
  position?: ToastPosition
  showProgress?: boolean
  closable?: boolean
  icon?: string | boolean
  color?: string
  onClick?: () => void
  onClose?: () => void
}

interface ToastInstance {
  id: string
  type: ToastType
  options: ToastOptions
  dismiss: () => void
  pause: () => void
  resume: () => void
  update: (options: Partial<ToastOptions>) => void
}
```

## Complete Example

```vue
<script setup lang="ts">
import { useToast, SToastContainer } from 'saka-ui'

const toast = useToast()

async function handleSave() {
  await toast.promise(
    saveData(),
    {
      loading: 'Saving your changes...',
      success: 'Changes saved successfully!',
      error: (err) => `Failed to save: ${err.message}`
    }
  )
}

function showMultiple() {
  toast.info('First notification')
  toast.success('Second notification')
  toast.warning('Third notification')
}
</script>

<template>
  <div class="space-y-4">
    <button @click="toast.success('Quick success!')">
      Success Toast
    </button>
    
    <button @click="toast.error({ title: 'Error', description: 'Something went wrong' })">
      Error Toast
    </button>
    
    <button @click="handleSave">
      Save with Promise
    </button>
    
    <button @click="showMultiple">
      Show Multiple
    </button>
    
    <button @click="toast.dismissAll()">
      Dismiss All
    </button>
  </div>
  
  <SToastContainer />
</template>
```
