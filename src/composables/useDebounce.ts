import { ref, watch, unref, onUnmounted, type Ref, type MaybeRef } from 'vue'

// ============================================================================
// Types
// ============================================================================

export interface DebounceOptions {
  /** Execute immediately on first call, then debounce subsequent calls */
  immediate?: boolean
  /** Maximum time to wait before forcing execution */
  maxWait?: number
}

export interface ThrottleOptions {
  /** Execute on the leading edge */
  leading?: boolean
  /** Execute on the trailing edge */
  trailing?: boolean
}

export interface DebouncedFn<T extends (...args: any[]) => any> {
  /** The debounced function */
  (...args: Parameters<T>): void
  /** Cancel any pending execution */
  cancel: () => void
  /** Immediately execute any pending call */
  flush: () => void
  /** Whether there's a pending execution */
  isPending: () => boolean
}

export interface ThrottledFn<T extends (...args: any[]) => any> {
  /** The throttled function */
  (...args: Parameters<T>): void
  /** Cancel any pending execution */
  cancel: () => void
  /** Whether there's a pending execution */
  isPending: () => boolean
}

export interface UseDebounceReturn<T> {
  /** The debounced value */
  value: Ref<T>
  /** Cancel any pending update */
  cancel: () => void
  /** Immediately apply pending value */
  flush: () => void
  /** Whether there's a pending update */
  isPending: Ref<boolean>
}

export interface UseThrottleReturn<T> {
  /** The throttled value */
  value: Ref<T>
  /** Cancel any pending update */
  cancel: () => void
  /** Whether there's a pending update */
  isPending: Ref<boolean>
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Create a debounced function
 */
function createDebouncedFn<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
  options: DebounceOptions = {}
): DebouncedFn<T> {
  const { immediate = false, maxWait } = options

  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let maxWaitTimeoutId: ReturnType<typeof setTimeout> | null = null
  let lastArgs: Parameters<T> | null = null
  let hasBeenCalled = false

  function invoke() {
    if (lastArgs) {
      fn(...lastArgs)
      lastArgs = null
      hasBeenCalled = true
    }
    clearTimeouts()
  }

  function clearTimeouts() {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    if (maxWaitTimeoutId) {
      clearTimeout(maxWaitTimeoutId)
      maxWaitTimeoutId = null
    }
  }

  const debouncedFn = function (...args: Parameters<T>) {
    lastArgs = args

    // Immediate mode: execute on first call
    if (immediate && !hasBeenCalled && !timeoutId) {
      invoke()
      return
    }

    // Clear existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    // Set up new timeout
    timeoutId = setTimeout(invoke, delay)

    // Set up max wait timeout if configured
    if (maxWait !== undefined && !maxWaitTimeoutId) {
      maxWaitTimeoutId = setTimeout(invoke, maxWait)
    }
  } as DebouncedFn<T>

  debouncedFn.cancel = () => {
    clearTimeouts()
    lastArgs = null
    hasBeenCalled = false
  }

  debouncedFn.flush = () => {
    if (lastArgs) {
      invoke()
    }
  }

  debouncedFn.isPending = () => timeoutId !== null

  return debouncedFn
}

/**
 * Create a throttled function
 */
function createThrottledFn<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
  options: ThrottleOptions = {}
): ThrottledFn<T> {
  const { leading = true, trailing = true } = options

  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let lastArgs: Parameters<T> | null = null
  let lastCallTime = 0

  function invoke() {
    if (lastArgs) {
      fn(...lastArgs)
      lastCallTime = Date.now()
      lastArgs = null
    }
    timeoutId = null
  }

  const throttledFn = function (...args: Parameters<T>) {
    const now = Date.now()
    const elapsed = now - lastCallTime

    lastArgs = args

    // Leading edge
    if (elapsed >= delay && leading) {
      fn(...args)
      lastCallTime = now
      lastArgs = null
      return
    }

    // Trailing edge - schedule execution
    if (trailing && !timeoutId) {
      const remaining = delay - elapsed
      timeoutId = setTimeout(invoke, remaining > 0 ? remaining : 0)
    }
  } as ThrottledFn<T>

  throttledFn.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    lastArgs = null
  }

  throttledFn.isPending = () => timeoutId !== null

  return throttledFn
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Debounce a value - the returned value updates after the specified delay
 * when the source value stops changing.
 * 
 * @example
 * // Basic usage
 * const searchTerm = ref('')
 * const debouncedSearch = useDebounce(searchTerm, 300)
 * 
 * // Use debouncedSearch.value for API calls
 * watch(debouncedSearch.value, (value) => {
 *   fetchResults(value)
 * })
 * 
 * @example
 * // With max wait
 * const { value, cancel, flush } = useDebounce(inputValue, 500, { maxWait: 2000 })
 */
export function useDebounce<T>(
  value: MaybeRef<T>,
  delay: MaybeRef<number> = 200,
  options: DebounceOptions = {}
): UseDebounceReturn<T> {
  const debouncedValue = ref(unref(value)) as Ref<T>
  const isPending = ref(false)

  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let maxWaitTimeoutId: ReturnType<typeof setTimeout> | null = null

  function updateValue(newValue: T) {
    debouncedValue.value = newValue
    isPending.value = false
    clearTimeouts()
  }

  function clearTimeouts() {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    if (maxWaitTimeoutId) {
      clearTimeout(maxWaitTimeoutId)
      maxWaitTimeoutId = null
    }
  }

  function cancel() {
    clearTimeouts()
    isPending.value = false
  }

  function flush() {
    if (isPending.value) {
      updateValue(unref(value))
    }
  }

  // Watch for value changes
  watch(
    () => unref(value),
    (newValue) => {
      const delayMs = unref(delay)
      const { immediate = false, maxWait } = options

      // Immediate mode
      if (immediate && !isPending.value) {
        updateValue(newValue)
        return
      }

      isPending.value = true
      clearTimeouts()

      // Set debounce timeout
      timeoutId = setTimeout(() => updateValue(newValue), delayMs)

      // Set max wait timeout
      if (maxWait !== undefined && !maxWaitTimeoutId) {
        maxWaitTimeoutId = setTimeout(() => updateValue(newValue), maxWait)
      }
    },
    { immediate: false }
  )

  // Cleanup on unmount
  onUnmounted(() => {
    cancel()
  })

  return {
    value: debouncedValue,
    cancel,
    flush,
    isPending
  }
}

/**
 * Create a debounced function that delays invoking until after the specified
 * milliseconds have elapsed since the last call.
 * 
 * @example
 * // Basic usage
 * const debouncedSearch = useDebounceFn(() => {
 *   console.log('Searching...')
 * }, 300)
 * 
 * // Call it multiple times - only executes once after 300ms of inactivity
 * debouncedSearch()
 * debouncedSearch()
 * debouncedSearch()
 * 
 * @example
 * // With immediate option
 * const debouncedSave = useDebounceFn(
 *   (data) => saveData(data),
 *   1000,
 *   { immediate: true }
 * )
 * 
 * @example
 * // With max wait
 * const debouncedResize = useDebounceFn(
 *   () => recalculateLayout(),
 *   200,
 *   { maxWait: 1000 }
 * )
 */
export function useDebounceFn<T extends (...args: any[]) => any>(
  fn: T,
  delay: MaybeRef<number> = 200,
  options: DebounceOptions = {}
): DebouncedFn<T> {
  const debouncedFn = createDebouncedFn(fn, unref(delay), options)

  // Cleanup on unmount
  onUnmounted(() => {
    debouncedFn.cancel()
  })

  return debouncedFn
}

/**
 * Throttle a value - the returned value updates at most once per specified interval.
 * 
 * @example
 * // Basic usage
 * const scrollY = ref(0)
 * const throttledScroll = useThrottle(scrollY, 100)
 * 
 * // Updates at most every 100ms
 * window.addEventListener('scroll', () => {
 *   scrollY.value = window.scrollY
 * })
 * 
 * @example
 * // With options
 * const { value } = useThrottle(mousePosition, 50, {
 *   leading: true,
 *   trailing: false
 * })
 */
export function useThrottle<T>(
  value: MaybeRef<T>,
  delay: MaybeRef<number> = 200,
  options: ThrottleOptions = {}
): UseThrottleReturn<T> {
  const { leading = true, trailing = true } = options

  const throttledValue = ref(unref(value)) as Ref<T>
  const isPending = ref(false)

  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let lastCallTime = 0

  function updateValue(newValue: T) {
    throttledValue.value = newValue
    lastCallTime = Date.now()
    isPending.value = false
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  function cancel() {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    isPending.value = false
  }

  // Watch for value changes
  watch(
    () => unref(value),
    (newValue) => {
      const delayMs = unref(delay)
      const now = Date.now()
      const elapsed = now - lastCallTime

      // Leading edge
      if (elapsed >= delayMs && leading) {
        updateValue(newValue)
        return
      }

      // Trailing edge
      if (trailing) {
        isPending.value = true
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
        const remaining = delayMs - elapsed
        timeoutId = setTimeout(() => {
          updateValue(newValue)
        }, remaining > 0 ? remaining : 0)
      }
    },
    { immediate: false }
  )

  // Cleanup on unmount
  onUnmounted(() => {
    cancel()
  })

  return {
    value: throttledValue,
    cancel,
    isPending
  }
}

/**
 * Create a throttled function that only invokes at most once per specified interval.
 * 
 * @example
 * // Basic usage
 * const throttledScroll = useThrottleFn(() => {
 *   console.log('Scrolled!')
 * }, 100)
 * 
 * window.addEventListener('scroll', throttledScroll)
 * 
 * @example
 * // Leading only (execute immediately, then wait)
 * const throttledClick = useThrottleFn(
 *   () => handleClick(),
 *   1000,
 *   { leading: true, trailing: false }
 * )
 * 
 * @example
 * // Trailing only (wait, then execute)
 * const throttledResize = useThrottleFn(
 *   () => recalculate(),
 *   200,
 *   { leading: false, trailing: true }
 * )
 */
export function useThrottleFn<T extends (...args: any[]) => any>(
  fn: T,
  delay: MaybeRef<number> = 200,
  options: ThrottleOptions = {}
): ThrottledFn<T> {
  const throttledFn = createThrottledFn(fn, unref(delay), options)

  // Cleanup on unmount
  onUnmounted(() => {
    throttledFn.cancel()
  })

  return throttledFn
}

// Default exports
export default useDebounce
