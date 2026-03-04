import { ref, shallowRef, readonly, onUnmounted, type Ref, type DeepReadonly } from 'vue'

// ============================================================================
// Types
// ============================================================================

export interface UseAsyncOptions<T> {
  /** Execute immediately on mount */
  immediate?: boolean
  /** Number of retry attempts on failure */
  retry?: number
  /** Delay between retry attempts in ms */
  retryDelay?: number
  /** Cache the result and prevent duplicate requests */
  cache?: boolean
  /** Callback when the async operation succeeds */
  onSuccess?: (data: T) => void
  /** Callback when the async operation fails */
  onError?: (error: Error) => void
  /** Callback when the async operation finishes (success or error) */
  onFinally?: () => void
  /** Reset error state before each execution */
  resetOnExecute?: boolean
  /** Throw error instead of catching it */
  throwOnError?: boolean
}

export interface UseAsyncReturn<T, P extends any[]> {
  /** The result data */
  data: DeepReadonly<Ref<T | null>>
  /** Whether the async operation is in progress */
  loading: DeepReadonly<Ref<boolean>>
  /** Error from the last failed operation */
  error: DeepReadonly<Ref<Error | null>>
  /** Whether the operation has been executed at least once */
  isFinished: DeepReadonly<Ref<boolean>>
  /** Whether the last execution was successful */
  isSuccess: DeepReadonly<Ref<boolean>>
  /** Execute the async function */
  execute: (...args: P) => Promise<T | null>
  /** Retry the last execution */
  retry: () => Promise<T | null>
  /** Reset the state */
  reset: () => void
  /** Abort the current execution */
  abort: () => void
  /** Whether the operation is currently aborted */
  isAborted: DeepReadonly<Ref<boolean>>
}

export type AsyncFn<T, P extends any[]> = (...args: P) => Promise<T>

// ============================================================================
// Cache Implementation
// ============================================================================

const cache = new Map<string, { data: any; timestamp: number }>()
const DEFAULT_CACHE_TTL = 5 * 60 * 1000 // 5 minutes

function getCacheKey(fn: Function, args: any[]): string {
  return `${fn.toString()}-${JSON.stringify(args)}`
}

function getFromCache<T>(key: string): T | null {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < DEFAULT_CACHE_TTL) {
    return cached.data
  }
  cache.delete(key)
  return null
}

function setToCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() })
}

/**
 * Clear the async cache
 */
export function clearAsyncCache(): void {
  cache.clear()
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Sleep utility for retry delay
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Handle async operations with automatic loading/error state management.
 * 
 * @example
 * // Basic usage
 * const { data, loading, error, execute } = useAsync(async () => {
 *   const response = await fetch('/api/users')
 *   return response.json()
 * })
 * 
 * // Execute on button click
 * <button @click="execute" :disabled="loading">
 *   {{ loading ? 'Loading...' : 'Fetch Users' }}
 * </button>
 * 
 * @example
 * // With immediate execution
 * const { data, loading } = useAsync(fetchUsers, {
 *   immediate: true,
 *   onSuccess: (users) => console.log('Loaded', users.length, 'users')
 * })
 * 
 * @example
 * // With retry logic
 * const { data, execute, retry, error } = useAsync(
 *   async (id: string) => fetchUser(id),
 *   {
 *     retry: 3,
 *     retryDelay: 1000,
 *     onError: (err) => console.error('Failed after 3 retries:', err)
 *   }
 * )
 * 
 * // Retry the last call
 * <button v-if="error" @click="retry">Retry</button>
 * 
 * @example
 * // With abort controller
 * const { data, execute, abort, isAborted } = useAsync(
 *   async (signal: AbortSignal) => {
 *     const response = await fetch('/api/data', { signal })
 *     return response.json()
 *   }
 * )
 * 
 * // Cancel ongoing request
 * <button @click="abort">Cancel</button>
 * 
 * @example
 * // With caching
 * const { data, execute } = useAsync(fetchData, { cache: true })
 * 
 * // Second call returns cached result
 * await execute('same-args')
 * await execute('same-args') // Uses cache
 */
export function useAsync<T, P extends any[] = []>(
  asyncFn: AsyncFn<T, P>,
  options: UseAsyncOptions<T> = {}
): UseAsyncReturn<T, P> {
  const {
    immediate = false,
    retry: retryCount = 0,
    retryDelay = 1000,
    cache: useCache = false,
    onSuccess,
    onError,
    onFinally,
    resetOnExecute = true,
    throwOnError = false
  } = options

  // State
  const data = shallowRef<T | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const isFinished = ref(false)
  const isSuccess = ref(false)
  const isAborted = ref(false)

  // Internals
  let abortController: AbortController | null = null
  let lastArgs: P | null = null

  /**
   * Execute the async function
   */
  async function execute(...args: P): Promise<T | null> {
    // Store args for retry
    lastArgs = args

    // Reset state if configured
    if (resetOnExecute) {
      error.value = null
      isAborted.value = false
    }

    // Check cache
    if (useCache) {
      const cacheKey = getCacheKey(asyncFn, args)
      const cachedResult = getFromCache<T>(cacheKey)
      if (cachedResult !== null) {
        data.value = cachedResult
        isSuccess.value = true
        isFinished.value = true
        onSuccess?.(cachedResult)
        onFinally?.()
        return cachedResult
      }
    }

    // Create abort controller
    abortController = new AbortController()
    const signal = abortController.signal

    loading.value = true
    isFinished.value = false
    isSuccess.value = false

    let attempts = 0
    const maxAttempts = retryCount + 1

    while (attempts < maxAttempts) {
      attempts++

      try {
        // Check if aborted
        if (signal.aborted) {
          isAborted.value = true
          loading.value = false
          return null
        }

        // Execute the async function
        // Pass abort signal if the function expects it
        const result = await asyncFn(...args)

        // Check if aborted after execution
        if (signal.aborted) {
          isAborted.value = true
          loading.value = false
          return null
        }

        // Success
        data.value = result
        error.value = null
        isSuccess.value = true
        isFinished.value = true
        loading.value = false

        // Cache result
        if (useCache) {
          const cacheKey = getCacheKey(asyncFn, args)
          setToCache(cacheKey, result)
        }

        onSuccess?.(result)
        onFinally?.()

        return result
      } catch (err) {
        // Check if aborted
        if (signal.aborted || (err instanceof Error && err.name === 'AbortError')) {
          isAborted.value = true
          loading.value = false
          return null
        }

        // If we have retries left, wait and try again
        if (attempts < maxAttempts) {
          await sleep(retryDelay)
          continue
        }

        // No more retries, handle the error
        const errorInstance = err instanceof Error ? err : new Error(String(err))
        error.value = errorInstance
        isSuccess.value = false
        isFinished.value = true
        loading.value = false

        onError?.(errorInstance)
        onFinally?.()

        if (throwOnError) {
          throw errorInstance
        }

        return null
      }
    }

    return null
  }

  /**
   * Retry the last execution
   */
  async function retryFn(): Promise<T | null> {
    if (lastArgs) {
      return execute(...lastArgs)
    }
    return execute(...([] as unknown as P))
  }

  /**
   * Reset the state
   */
  function reset(): void {
    data.value = null
    error.value = null
    loading.value = false
    isFinished.value = false
    isSuccess.value = false
    isAborted.value = false
    lastArgs = null
  }

  /**
   * Abort the current execution
   */
  function abort(): void {
    if (abortController) {
      abortController.abort()
      isAborted.value = true
      loading.value = false
    }
  }

  // Execute immediately if configured
  if (immediate) {
    execute(...([] as unknown as P))
  }

  // Cleanup on unmount
  onUnmounted(() => {
    abort()
  })

  return {
    data: readonly(data),
    loading: readonly(loading),
    error: readonly(error),
    isFinished: readonly(isFinished),
    isSuccess: readonly(isSuccess),
    execute,
    retry: retryFn,
    reset,
    abort,
    isAborted: readonly(isAborted)
  }
}

/**
 * Create a lazy async composable that only executes when called.
 * This is an alias for useAsync with immediate: false.
 * 
 * @example
 * const { data, execute, loading } = useLazyAsync(fetchUser)
 * 
 * // Execute with parameters
 * const user = await execute(userId)
 */
export function useLazyAsync<T, P extends any[] = []>(
  asyncFn: AsyncFn<T, P>,
  options: Omit<UseAsyncOptions<T>, 'immediate'> = {}
): UseAsyncReturn<T, P> {
  return useAsync(asyncFn, { ...options, immediate: false })
}

/**
 * Execute an async function with loading state management.
 * Returns a promise that resolves to the result.
 * 
 * @example
 * const { loading, run } = useAsyncState()
 * 
 * const result = await run(async () => {
 *   const response = await fetch('/api/data')
 *   return response.json()
 * })
 */
export function useAsyncState() {
  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function run<T>(fn: () => Promise<T>): Promise<T | null> {
    loading.value = true
    error.value = null

    try {
      const result = await fn()
      return result
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    run
  }
}

// Default exports
export default useAsync
