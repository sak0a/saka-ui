# useAsync

A composable for handling async operations with automatic loading/error state management, retry logic, caching, and abort controller support.

## Installation

```typescript
import { useAsync } from '@sakoa/ui'
```

## Basic Usage

```typescript
import { useAsync } from '@sakoa/ui'

// Define your async function
async function fetchUsers() {
  const response = await fetch('/api/users')
  return response.json()
}

// Use the composable
const { data, loading, error, execute } = useAsync(fetchUsers)

// Execute manually
await execute()

// Access the data
console.log(data.value) // User data or null
```

## Immediate Execution

Execute the async function immediately when the component mounts:

```typescript
const { data, loading } = useAsync(fetchUsers, {
  immediate: true
})

// Data is automatically fetched on mount
```

## With Parameters

```typescript
async function fetchUser(id: string) {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}

const { data, execute } = useAsync(fetchUser)

// Execute with parameters
await execute('user-123')
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `immediate` | `boolean` | `false` | Execute immediately on mount |
| `retry` | `number` | `0` | Number of retry attempts on failure |
| `retryDelay` | `number` | `1000` | Delay between retries (ms) |
| `cache` | `boolean` | `false` | Cache results to prevent duplicate requests |
| `onSuccess` | `(data: T) => void` | `undefined` | Callback on success |
| `onError` | `(error: Error) => void` | `undefined` | Callback on error |
| `onFinally` | `() => void` | `undefined` | Callback when finished |
| `resetOnExecute` | `boolean` | `true` | Reset error state before each execution |
| `throwOnError` | `boolean` | `false` | Throw error instead of catching |

## Return Value

| Property | Type | Description |
|----------|------|-------------|
| `data` | `Ref<T \| null>` | The result data |
| `loading` | `Ref<boolean>` | Whether operation is in progress |
| `error` | `Ref<Error \| null>` | Error from last failed operation |
| `isFinished` | `Ref<boolean>` | Whether operation has been executed |
| `isSuccess` | `Ref<boolean>` | Whether last execution was successful |
| `isAborted` | `Ref<boolean>` | Whether operation was aborted |
| `execute` | `(...args) => Promise<T \| null>` | Execute the async function |
| `retry` | `() => Promise<T \| null>` | Retry the last execution |
| `reset` | `() => void` | Reset all state |
| `abort` | `() => void` | Abort current execution |

## Retry Logic

Automatically retry failed requests:

```typescript
const { data, error, retry } = useAsync(fetchData, {
  retry: 3,          // Retry up to 3 times
  retryDelay: 1000,  // Wait 1 second between retries
  onError: (err) => console.error('All retries failed:', err)
})

// Manual retry
async function handleRetry() {
  await retry() // Retries with the same arguments
}
```

## Caching

Prevent duplicate requests for the same arguments:

```typescript
const { data, execute } = useAsync(fetchUser, {
  cache: true
})

// First call fetches from API
await execute('user-123')

// Second call returns cached result immediately
await execute('user-123') // Uses cache

// Different arguments bypass cache
await execute('user-456') // New API call
```

### Clear Cache

```typescript
import { clearAsyncCache } from '@sakoa/ui'

// Clear all cached results
clearAsyncCache()
```

## Abort Controller

Cancel ongoing requests:

```typescript
const { data, execute, abort, isAborted } = useAsync(async () => {
  const response = await fetch('/api/data')
  return response.json()
})

// Start the request
execute()

// Cancel it
abort()

// Check if aborted
if (isAborted.value) {
  console.log('Request was cancelled')
}
```

## Callbacks

```typescript
const { data, execute } = useAsync(saveData, {
  onSuccess: (result) => {
    toast.success('Data saved!')
    console.log('Result:', result)
  },
  onError: (error) => {
    toast.error(`Failed: ${error.message}`)
  },
  onFinally: () => {
    console.log('Operation completed')
  }
})
```

## useLazyAsync

Alias for `useAsync` with `immediate: false`:

```typescript
import { useLazyAsync } from '@sakoa/ui'

const { data, execute, loading } = useLazyAsync(fetchUser)

// Execute when needed
const user = await execute(userId)
```

## useAsyncState

Simple loading state wrapper:

```typescript
import { useAsyncState } from '@sakoa/ui'

const { loading, error, run } = useAsyncState()

async function handleClick() {
  const result = await run(async () => {
    const response = await fetch('/api/data')
    return response.json()
  })
  
  if (result) {
    console.log('Success:', result)
  }
}
```

## Types

```typescript
type AsyncFn<T, P extends any[]> = (...args: P) => Promise<T>

interface UseAsyncOptions<T> {
  immediate?: boolean
  retry?: number
  retryDelay?: number
  cache?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  onFinally?: () => void
  resetOnExecute?: boolean
  throwOnError?: boolean
}

interface UseAsyncReturn<T, P extends any[]> {
  data: DeepReadonly<Ref<T | null>>
  loading: DeepReadonly<Ref<boolean>>
  error: DeepReadonly<Ref<Error | null>>
  isFinished: DeepReadonly<Ref<boolean>>
  isSuccess: DeepReadonly<Ref<boolean>>
  isAborted: DeepReadonly<Ref<boolean>>
  execute: (...args: P) => Promise<T | null>
  retry: () => Promise<T | null>
  reset: () => void
  abort: () => void
}
```

## Complete Example

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useAsync, useToast } from '@sakoa/ui'

interface User {
  id: string
  name: string
  email: string
}

const toast = useToast()

// Fetch users list
const {
  data: users,
  loading: loadingUsers,
  error: usersError,
  execute: fetchUsers,
  retry: retryUsers
} = useAsync<User[]>(
  async () => {
    const response = await fetch('/api/users')
    if (!response.ok) throw new Error('Failed to fetch users')
    return response.json()
  },
  {
    immediate: true,
    retry: 2,
    onError: (err) => toast.error(err.message)
  }
)

// Fetch single user with caching
const {
  data: selectedUser,
  loading: loadingUser,
  execute: fetchUser
} = useAsync<User, [string]>(
  async (id: string) => {
    const response = await fetch(`/api/users/${id}`)
    if (!response.ok) throw new Error('User not found')
    return response.json()
  },
  {
    cache: true
  }
)

// Delete user with confirmation
const {
  loading: deleting,
  execute: deleteUser
} = useAsync<void, [string]>(
  async (id: string) => {
    const response = await fetch(`/api/users/${id}`, { method: 'DELETE' })
    if (!response.ok) throw new Error('Failed to delete')
  },
  {
    onSuccess: () => {
      toast.success('User deleted')
      fetchUsers() // Refresh the list
    },
    onError: (err) => toast.error(err.message)
  }
)

async function handleUserClick(userId: string) {
  await fetchUser(userId)
}

async function handleDelete(userId: string) {
  if (confirm('Are you sure?')) {
    await deleteUser(userId)
  }
}
</script>

<template>
  <div class="space-y-4">
    <!-- Loading state -->
    <div v-if="loadingUsers" class="loading">
      Loading users...
    </div>
    
    <!-- Error state -->
    <div v-else-if="usersError" class="error">
      <p>{{ usersError.message }}</p>
      <button @click="retryUsers">Retry</button>
    </div>
    
    <!-- Users list -->
    <ul v-else-if="users">
      <li 
        v-for="user in users" 
        :key="user.id"
        class="flex justify-between items-center p-2"
      >
        <button @click="handleUserClick(user.id)">
          {{ user.name }}
        </button>
        <button 
          @click="handleDelete(user.id)"
          :disabled="deleting"
        >
          Delete
        </button>
      </li>
    </ul>
    
    <!-- Selected user details -->
    <div v-if="selectedUser" class="user-details">
      <h2>{{ selectedUser.name }}</h2>
      <p>{{ selectedUser.email }}</p>
    </div>
    <div v-else-if="loadingUser">
      Loading user details...
    </div>
  </div>
</template>
```

## Use Cases

- **API calls**: Fetch data with loading/error states
- **Form submissions**: Submit with loading indicator
- **File uploads**: Track progress and handle errors
- **Search**: Debounced search with caching
- **Infinite scroll**: Load more data with retry logic
- **Background sync**: Automatic retry on network errors
