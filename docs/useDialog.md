# useDialog

A programmatic dialog composable for Vue 3 with confirm, prompt, and alert dialogs.

## Installation

```typescript
import { useDialog } from '@sakoa/ui'
```

## Basic Usage

```typescript
import { useDialog } from '@sakoa/ui'

const dialog = useDialog()

// Confirm dialog
async function handleDelete() {
  const confirmed = await dialog.confirm({
    title: 'Delete Item',
    description: 'Are you sure you want to delete this item? This action cannot be undone.',
    variant: 'danger'
  })
  
  if (confirmed) {
    await deleteItem()
  }
}

// Prompt dialog
async function handleRename() {
  const newName = await dialog.prompt({
    title: 'Rename Item',
    description: 'Enter a new name for this item.',
    placeholder: 'New name',
    defaultValue: currentName
  })
  
  if (newName) {
    await renameItem(newName)
  }
}

// Alert dialog
async function showMessage() {
  await dialog.alert({
    title: 'Success',
    description: 'Your changes have been saved successfully.',
    variant: 'success'
  })
}
```

## Confirm Dialog

Returns `Promise<boolean>` - `true` if confirmed, `false` if cancelled.

```typescript
const confirmed = await dialog.confirm({
  title: 'Confirm Action',
  description: 'Are you sure you want to proceed?',
  confirmText: 'Yes, proceed',
  cancelText: 'Cancel',
  variant: 'default',
  icon: 'help-circle',
  closeOnBackdrop: true,
  closeOnEscape: true
})
```

### Confirm Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | `string` | required | Dialog title |
| `description` | `string` | `undefined` | Dialog description |
| `confirmText` | `string` | `'Confirm'` | Confirm button text |
| `cancelText` | `string` | `'Cancel'` | Cancel button text |
| `variant` | `DialogVariant` | `'default'` | Visual variant |
| `icon` | `string \| boolean` | Auto | Icon name or false |
| `closeOnBackdrop` | `boolean` | `true` | Close on backdrop click |
| `closeOnEscape` | `boolean` | `true` | Close on Escape key |

## Prompt Dialog

Returns `Promise<string | null>` - entered value or `null` if cancelled.

```typescript
const name = await dialog.prompt({
  title: 'Enter Name',
  description: 'Please enter your full name.',
  placeholder: 'John Doe',
  defaultValue: '',
  required: true,
  inputType: 'text',
  minLength: 2,
  maxLength: 100,
  validate: (value) => {
    if (value.length < 2) return 'Name must be at least 2 characters'
    return true
  }
})
```

### Prompt Options

Extends `ConfirmOptions` with:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `placeholder` | `string` | `undefined` | Input placeholder |
| `defaultValue` | `string` | `''` | Default input value |
| `required` | `boolean` | `false` | Whether input is required |
| `inputType` | `string` | `'text'` | Input type (text, password, email, etc.) |
| `minLength` | `number` | `undefined` | Minimum input length |
| `maxLength` | `number` | `undefined` | Maximum input length |
| `validate` | `function` | `undefined` | Custom validation function |

## Alert Dialog

Returns `Promise<void>` - resolves when dismissed.

```typescript
await dialog.alert({
  title: 'Information',
  description: 'This is an important message.',
  buttonText: 'Got it',
  variant: 'info'
})
```

### Alert Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | `string` | required | Dialog title |
| `description` | `string` | `undefined` | Dialog description |
| `buttonText` | `string` | `'OK'` | Button text |
| `variant` | `DialogVariant` | `'info'` | Visual variant |
| `icon` | `string \| boolean` | Auto | Icon name or false |

## Custom Dialog

Render a custom component inside the dialog.

```typescript
import MyCustomForm from './MyCustomForm.vue'

const result = await dialog.custom({
  title: 'Edit Profile',
  component: MyCustomForm,
  props: { userId: 123 },
  size: 'lg',
  closeOnBackdrop: false
})
```

Your custom component receives `onConfirm` and `onCancel` props:

```vue
<!-- MyCustomForm.vue -->
<script setup lang="ts">
const props = defineProps<{
  userId: number
  onConfirm: (value: unknown) => void
  onCancel: () => void
}>()

function handleSubmit() {
  props.onConfirm({ success: true })
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <!-- Your form content -->
    <button type="button" @click="onCancel">Cancel</button>
    <button type="submit">Submit</button>
  </form>
</template>
```

## Dialog Variants

| Variant | Use Case | Confirm Button Color |
|---------|----------|---------------------|
| `default` | General confirmations | Blue |
| `danger` | Destructive actions | Red |
| `warning` | Cautionary actions | Amber |
| `success` | Positive confirmations | Green |
| `info` | Informational | Blue |

```typescript
// Danger variant for delete actions
await dialog.confirm({
  title: 'Delete Account',
  description: 'This will permanently delete your account and all data.',
  variant: 'danger',
  confirmText: 'Delete Account'
})

// Warning variant for important changes
await dialog.confirm({
  title: 'Change Plan',
  description: 'You will be billed at the new rate starting today.',
  variant: 'warning'
})
```

## Shorthand Functions

For convenience, you can also import shorthand functions:

```typescript
import { confirm, prompt, alertDialog } from '@sakoa/ui'

// Simple string usage
const confirmed = await confirm('Are you sure?')
const name = await prompt('Enter your name')
await alertDialog('Operation completed')

// With options
const confirmed = await confirm({
  title: 'Delete Item',
  variant: 'danger'
})
```

## Close All Dialogs

```typescript
const dialog = useDialog()

// Close all open dialogs
dialog.closeAll()
```

## Types

```typescript
type DialogVariant = 'default' | 'danger' | 'warning' | 'success' | 'info'

interface ConfirmOptions {
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: DialogVariant
  icon?: string | boolean
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
}

interface PromptOptions extends ConfirmOptions {
  placeholder?: string
  defaultValue?: string
  required?: boolean
  inputType?: 'text' | 'password' | 'email' | 'number' | 'textarea'
  minLength?: number
  maxLength?: number
  validate?: (value: string) => string | true
}

interface AlertOptions {
  title: string
  description?: string
  buttonText?: string
  variant?: DialogVariant
  icon?: string | boolean
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
}

interface CustomDialogOptions<T = unknown> {
  title?: string
  component: Component
  props?: Record<string, unknown>
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}
```

## Complete Example

```vue
<script setup lang="ts">
import { useDialog, useToast } from '@sakoa/ui'

const dialog = useDialog()
const toast = useToast()

interface Item {
  id: number
  name: string
}

const items = ref<Item[]>([
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' }
])

async function deleteItem(item: Item) {
  const confirmed = await dialog.confirm({
    title: 'Delete Item',
    description: `Are you sure you want to delete "${item.name}"?`,
    variant: 'danger',
    confirmText: 'Delete'
  })
  
  if (confirmed) {
    items.value = items.value.filter(i => i.id !== item.id)
    toast.success(`"${item.name}" has been deleted`)
  }
}

async function renameItem(item: Item) {
  const newName = await dialog.prompt({
    title: 'Rename Item',
    placeholder: 'Enter new name',
    defaultValue: item.name,
    required: true
  })
  
  if (newName) {
    item.name = newName
    toast.success('Item renamed successfully')
  }
}

async function addItem() {
  const name = await dialog.prompt({
    title: 'Add New Item',
    placeholder: 'Item name',
    required: true
  })
  
  if (name) {
    items.value.push({ id: Date.now(), name })
    toast.success('Item added successfully')
  }
}
</script>

<template>
  <div class="space-y-4">
    <button @click="addItem">Add Item</button>
    
    <ul>
      <li v-for="item in items" :key="item.id" class="flex gap-2">
        <span>{{ item.name }}</span>
        <button @click="renameItem(item)">Rename</button>
        <button @click="deleteItem(item)">Delete</button>
      </li>
    </ul>
  </div>
</template>
```

## Accessibility

- Dialogs trap focus within the modal
- Escape key closes the dialog (configurable)
- Proper ARIA attributes for screen readers
- Auto-focus on input for prompt dialogs
