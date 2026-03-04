<script setup lang="ts">
import { ref } from 'vue'
import {
  SButton, SCard, SCardContent, SCardHeader, SApiSection, SApiTable, SInput
} from '../../index'
import { useAsync, useLazyAsync } from '../../composables/useAsync'
import type { ApiProp, ApiMethod } from '../../index'
import DemoSection from '../../components/DemoSection.vue'

// Demo: Basic async
interface User {
  id: number
  name: string
  email: string
}

const mockUsers: User[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
  { id: 3, name: 'Carol Williams', email: 'carol@example.com' }
]

async function fetchUsers(): Promise<User[]> {
  await new Promise(resolve => setTimeout(resolve, 1500))
  return mockUsers
}

async function fetchUser(id: number): Promise<User> {
  await new Promise(resolve => setTimeout(resolve, 800))
  const user = mockUsers.find(u => u.id === id)
  if (!user) throw new Error(`User ${id} not found`)
  return user
}

async function failingRequest(): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 500))
  throw new Error('Network request failed')
}

const {
  data: users,
  loading: loadingUsers,
  error: usersError,
  execute: fetchAllUsers,
  isFinished: usersFetched
} = useAsync(fetchUsers)

// Demo: With parameters
const selectedUserId = ref(1)
const {
  data: selectedUser,
  loading: loadingUser,
  execute: fetchSelectedUser
} = useLazyAsync(fetchUser)

// Demo: Retry logic
const {
  data: retryData,
  loading: retryLoading,
  error: retryError,
  execute: executeRetry,
  retry: retryRequest,
  isSuccess: retrySuccess
} = useAsync(failingRequest, {
  retry: 2,
  retryDelay: 500
})

// Demo: Abort
const {
  data: abortData,
  loading: abortLoading,
  execute: executeAbort,
  abort: abortRequest,
  isAborted
} = useAsync(async () => {
  await new Promise(resolve => setTimeout(resolve, 5000))
  return 'Completed!'
})

// Code examples
const basicCode = `import { useAsync } from 'saka-ui'

async function fetchUsers() {
  const response = await fetch('/api/users')
  return response.json()
}

const { data, loading, error, execute } = useAsync(fetchUsers)

// Execute the function
await execute()

// Access the data
console.log(data.value) // User[] or null`

const immediateCode = `// Execute immediately on mount
const { data, loading } = useAsync(fetchUsers, {
  immediate: true
})

// Data is automatically fetched when component mounts`

const paramsCode = `const { data, execute } = useAsync(fetchUser)

// Execute with parameters
await execute(userId)

// Or use useLazyAsync
const { execute: fetchById } = useLazyAsync(
  (id: string) => fetch(\`/api/users/\${id}\`).then(r => r.json())
)`

const retryCode = `const { data, error, retry } = useAsync(fetchData, {
  retry: 3,          // Retry up to 3 times
  retryDelay: 1000,  // Wait 1 second between retries
  onError: (err) => console.error('All retries failed:', err)
})

// Manual retry with same arguments
await retry()`

const abortCode = `const { data, execute, abort, isAborted } = useAsync(longRunningTask)

// Start the task
execute()

// Cancel it
abort()

// Check if aborted
if (isAborted.value) {
  console.log('Request was cancelled')
}`

const callbacksCode = `const { execute } = useAsync(saveData, {
  onSuccess: (result) => {
    toast.success('Saved!')
  },
  onError: (error) => {
    toast.error(\`Failed: \${error.message}\`)
  },
  onFinally: () => {
    console.log('Operation completed')
  }
})`

// API Tables
const composableMethods: ApiMethod[] = [
  { name: 'useAsync(fn, options?)', description: 'Create async state with loading/error management' },
  { name: 'useLazyAsync(fn, options?)', description: 'Same as useAsync with immediate: false' },
  { name: 'useAsyncState()', description: 'Simple loading state wrapper for inline async functions' },
  { name: 'clearAsyncCache()', description: 'Clear all cached async results' }
]

const optionsProps: ApiProp[] = [
  { name: 'immediate', type: 'boolean', default: 'false', description: 'Execute immediately on mount' },
  { name: 'retry', type: 'number', default: '0', description: 'Number of retry attempts on failure' },
  { name: 'retryDelay', type: 'number', default: '1000', description: 'Delay between retries (ms)' },
  { name: 'cache', type: 'boolean', default: 'false', description: 'Cache results to prevent duplicates' },
  { name: 'onSuccess', type: '(data: T) => void', description: 'Callback on success' },
  { name: 'onError', type: '(error: Error) => void', description: 'Callback on error' },
  { name: 'onFinally', type: '() => void', description: 'Callback when finished' },
  { name: 'resetOnExecute', type: 'boolean', default: 'true', description: 'Reset error before each execution' },
  { name: 'throwOnError', type: 'boolean', default: 'false', description: 'Throw instead of catching errors' }
]

const returnProps: ApiProp[] = [
  { name: 'data', type: 'Ref<T | null>', description: 'The result data' },
  { name: 'loading', type: 'Ref<boolean>', description: 'Whether operation is in progress' },
  { name: 'error', type: 'Ref<Error | null>', description: 'Error from last failed operation' },
  { name: 'isFinished', type: 'Ref<boolean>', description: 'Whether operation has been executed' },
  { name: 'isSuccess', type: 'Ref<boolean>', description: 'Whether last execution succeeded' },
  { name: 'isAborted', type: 'Ref<boolean>', description: 'Whether operation was aborted' },
  { name: 'execute', type: '(...args) => Promise<T | null>', description: 'Execute the async function' },
  { name: 'retry', type: '() => Promise<T | null>', description: 'Retry last execution' },
  { name: 'reset', type: '() => void', description: 'Reset all state' },
  { name: 'abort', type: '() => void', description: 'Abort current execution' }
]
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-(--s-text-primary) mb-2">useAsync</h1>
      <p class="text-lg text-(--s-text-secondary)">
        Handle async operations with automatic loading/error state management, retry logic, and abort support.
      </p>
    </header>

    <!-- Basic Demo -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Basic Usage</h2>
      <SCard variant="outlined">
        <SCardHeader>
          <h3 class="font-semibold text-(--s-text-primary)">Fetch Users</h3>
        </SCardHeader>
        <SCardContent class="space-y-4">
          <div class="flex items-center gap-3">
            <SButton @click="fetchAllUsers" :disabled="loadingUsers">
              {{ loadingUsers ? 'Loading...' : 'Fetch Users' }}
            </SButton>
            <span v-if="loadingUsers" class="text-sm text-(--s-text-secondary)">
              Simulating 1.5s API call...
            </span>
          </div>

          <div v-if="usersError" class="text-red-500 text-sm">
            Error: {{ usersError.message }}
          </div>

          <ul v-if="users" class="space-y-2">
            <li 
              v-for="user in users" 
              :key="user.id"
              class="p-3 rounded bg-slate-100 dark:bg-slate-800"
            >
              <div class="font-medium">{{ user.name }}</div>
              <div class="text-sm text-(--s-text-secondary)">{{ user.email }}</div>
            </li>
          </ul>

          <div class="text-sm text-(--s-text-secondary)">
            Status: {{ loadingUsers ? 'Loading' : usersFetched ? 'Finished' : 'Not started' }}
          </div>
        </SCardContent>
      </SCard>
    </section>

    <!-- With Parameters Demo -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">With Parameters</h2>
      <SCard variant="outlined">
        <SCardHeader>
          <h3 class="font-semibold text-(--s-text-primary)">Fetch Single User</h3>
        </SCardHeader>
        <SCardContent class="space-y-4">
          <div class="flex items-center gap-3">
            <select 
              v-model.number="selectedUserId"
              class="px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
            >
              <option :value="1">User 1</option>
              <option :value="2">User 2</option>
              <option :value="3">User 3</option>
              <option :value="999">User 999 (will fail)</option>
            </select>
            <SButton @click="fetchSelectedUser(selectedUserId)" :disabled="loadingUser">
              {{ loadingUser ? 'Loading...' : 'Fetch User' }}
            </SButton>
          </div>

          <div v-if="selectedUser" class="p-4 rounded bg-emerald-100 dark:bg-emerald-900/30">
            <div class="font-medium">{{ selectedUser.name }}</div>
            <div class="text-sm">{{ selectedUser.email }}</div>
          </div>
        </SCardContent>
      </SCard>
    </section>

    <!-- Retry Demo -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Retry Logic</h2>
      <SCard variant="outlined">
        <SCardHeader>
          <h3 class="font-semibold text-(--s-text-primary)">Failing Request with Retry</h3>
          <p class="text-sm text-(--s-text-secondary)">This request always fails - watch the retry behavior</p>
        </SCardHeader>
        <SCardContent class="space-y-4">
          <div class="flex items-center gap-3">
            <SButton @click="executeRetry" :disabled="retryLoading" variant="outlined">
              {{ retryLoading ? 'Retrying...' : 'Execute (Will Fail)' }}
            </SButton>
            <SButton v-if="retryError" @click="retryRequest" :disabled="retryLoading" variant="ghost">
              Manual Retry
            </SButton>
          </div>

          <div v-if="retryLoading" class="text-sm text-amber-500">
            Attempting request (will retry 2 times on failure)...
          </div>

          <div v-if="retryError" class="text-red-500 text-sm">
            Error after all retries: {{ retryError.message }}
          </div>
        </SCardContent>
      </SCard>
    </section>

    <!-- Abort Demo -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Abort Controller</h2>
      <SCard variant="outlined">
        <SCardHeader>
          <h3 class="font-semibold text-(--s-text-primary)">Long Running Task</h3>
          <p class="text-sm text-(--s-text-secondary)">5 second task that can be cancelled</p>
        </SCardHeader>
        <SCardContent class="space-y-4">
          <div class="flex items-center gap-3">
            <SButton @click="executeAbort" :disabled="abortLoading">
              {{ abortLoading ? 'Running...' : 'Start Task' }}
            </SButton>
            <SButton 
              v-if="abortLoading" 
              @click="abortRequest" 
              variant="outlined"
              color="danger"
            >
              Cancel
            </SButton>
          </div>

          <div v-if="abortLoading" class="text-sm text-amber-500 animate-pulse">
            Task running... (will complete in 5 seconds)
          </div>

          <div v-if="isAborted" class="text-sm text-orange-500">
            Task was cancelled
          </div>

          <div v-if="abortData" class="text-sm text-emerald-500">
            Result: {{ abortData }}
          </div>
        </SCardContent>
      </SCard>
    </section>

    <!-- Code Examples -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Code Examples</h2>
      
      <div class="space-y-6">
        <DemoSection
          title="Basic Usage"
          :code="basicCode"
          language="typescript"
          code-only
        />

        <DemoSection
          title="Immediate Execution"
          :code="immediateCode"
          language="typescript"
          code-only
        />

        <DemoSection
          title="With Parameters"
          :code="paramsCode"
          language="typescript"
          code-only
        />

        <DemoSection
          title="Retry Logic"
          :code="retryCode"
          language="typescript"
          code-only
        />

        <DemoSection
          title="Abort Controller"
          :code="abortCode"
          language="typescript"
          code-only
        />

        <DemoSection
          title="Callbacks"
          :code="callbacksCode"
          language="typescript"
          code-only
        />
      </div>
    </section>

    <!-- API Reference -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">API Reference</h2>
      
      <SApiSection title="Composables">
        <SApiTable title="Functions" :methods="composableMethods" type="methods" />
      </SApiSection>

      <div class="mt-8">
        <SApiSection title="UseAsyncOptions">
          <SApiTable title="Properties" :props="optionsProps" type="props" />
        </SApiSection>
      </div>

      <div class="mt-8">
        <SApiSection title="Return Value">
          <SApiTable title="Properties" :props="returnProps" type="props" />
        </SApiSection>
      </div>
    </section>
  </div>
</template>
