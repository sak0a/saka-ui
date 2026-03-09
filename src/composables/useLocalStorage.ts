import { ref, watch, onMounted, onUnmounted, type Ref } from 'vue'

// ============================================================================
// Types
// ============================================================================

export interface Serializer<T> {
  /** Deserialize value from string */
  read: (value: string) => T
  /** Serialize value to string */
  write: (value: T) => string
}

export interface StorageOptions<T> {
  /** Custom serializer for the value */
  serializer?: Serializer<T>
  /** Whether to sync across tabs (localStorage only) */
  syncTabs?: boolean
  /** Callback when an error occurs */
  onError?: (error: Error) => void
  /** Whether to write the default value if the key doesn't exist */
  writeDefaults?: boolean
  /** Whether to listen for storage changes */
  listenToStorageChanges?: boolean
  /** Merge function for deep objects */
  mergeDefaults?: boolean | ((storageValue: T, defaults: T) => T)
}

export interface UseStorageReturn<T> {
  /** The reactive storage value */
  value: Ref<T>
  /** Remove the value from storage */
  remove: () => void
  /** Check if the key exists in storage */
  exists: () => boolean
  /** Force refresh the value from storage */
  refresh: () => void
}

// ============================================================================
// Default Serializers
// ============================================================================

export const jsonSerializer: Serializer<any> = {
  read: (value: string) => {
    try {
      return JSON.parse(value)
    } catch {
      return value
    }
  },
  write: (value: any) => JSON.stringify(value)
}

export const stringSerializer: Serializer<string> = {
  read: (value: string) => value,
  write: (value: string) => value
}

export const numberSerializer: Serializer<number> = {
  read: (value: string) => Number(value),
  write: (value: number) => String(value)
}

export const booleanSerializer: Serializer<boolean> = {
  read: (value: string) => value === 'true',
  write: (value: boolean) => String(value)
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if we're in a browser environment
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

/**
 * Get the appropriate serializer based on the default value type
 */
function getDefaultSerializer<T>(defaultValue: T): Serializer<T> {
  if (typeof defaultValue === 'string') {
    return stringSerializer as unknown as Serializer<T>
  }
  if (typeof defaultValue === 'number') {
    return numberSerializer as unknown as Serializer<T>
  }
  if (typeof defaultValue === 'boolean') {
    return booleanSerializer as unknown as Serializer<T>
  }
  return jsonSerializer as Serializer<T>
}

/**
 * Deep merge two objects
 */
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target }
  
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key]
      const targetValue = target[key]
      
      if (
        sourceValue !== null &&
        typeof sourceValue === 'object' &&
        !Array.isArray(sourceValue) &&
        targetValue !== null &&
        typeof targetValue === 'object' &&
        !Array.isArray(targetValue)
      ) {
        result[key] = deepMerge(targetValue, sourceValue)
      } else if (sourceValue !== undefined) {
        result[key] = sourceValue as T[Extract<keyof T, string>]
      }
    }
  }
  
  return result
}

/**
 * Core storage composable implementation
 */
function useStorage<T>(
  key: string,
  defaultValue: T,
  storage: Storage | null,
  options: StorageOptions<T> = {}
): UseStorageReturn<T> {
  const {
    serializer = getDefaultSerializer(defaultValue),
    syncTabs = true,
    onError = console.error,
    writeDefaults = false,
    listenToStorageChanges = true,
    mergeDefaults = false
  } = options

  // Initialize with default value
  const data = ref(defaultValue) as Ref<T>

  /**
   * Read value from storage
   */
  function read(): T | null {
    if (!storage) return null

    try {
      const rawValue = storage.getItem(key)
      if (rawValue === null) {
        return null
      }

      let parsedValue = serializer.read(rawValue)

      // Handle merge defaults
      if (mergeDefaults && typeof defaultValue === 'object' && !Array.isArray(defaultValue)) {
        if (typeof mergeDefaults === 'function') {
          parsedValue = mergeDefaults(parsedValue, defaultValue)
        } else {
          parsedValue = deepMerge(defaultValue as Record<string, any>, parsedValue as Partial<Record<string, any>>) as T
        }
      }

      return parsedValue
    } catch (error) {
      onError(error instanceof Error ? error : new Error(String(error)))
      return null
    }
  }

  /**
   * Write value to storage
   */
  function write(value: T): void {
    if (!storage) return

    try {
      const serializedValue = serializer.write(value)
      storage.setItem(key, serializedValue)
    } catch (error) {
      onError(error instanceof Error ? error : new Error(String(error)))
    }
  }

  /**
   * Remove value from storage
   */
  function remove(): void {
    if (!storage) return

    try {
      storage.removeItem(key)
      data.value = defaultValue
    } catch (error) {
      onError(error instanceof Error ? error : new Error(String(error)))
    }
  }

  /**
   * Check if key exists in storage
   */
  function exists(): boolean {
    if (!storage) return false
    return storage.getItem(key) !== null
  }

  /**
   * Refresh value from storage
   */
  function refresh(): void {
    const storedValue = read()
    if (storedValue !== null) {
      data.value = storedValue
    } else {
      data.value = defaultValue
    }
  }

  // Initialize value from storage
  if (isBrowser() && storage) {
    const storedValue = read()
    if (storedValue !== null) {
      data.value = storedValue
    } else if (writeDefaults) {
      write(defaultValue)
    }
  }

  // Watch for changes and sync to storage
  watch(
    data,
    (newValue) => {
      write(newValue)
    },
    { deep: true }
  )

  // Handle storage events for cross-tab sync
  let storageListener: ((event: StorageEvent) => void) | null = null

  onMounted(() => {
    // Re-read on mount (SSR hydration)
    if (storage) {
      const storedValue = read()
      if (storedValue !== null) {
        data.value = storedValue
      }
    }

    // Set up cross-tab sync listener
    if (syncTabs && listenToStorageChanges && isBrowser()) {
      storageListener = (event: StorageEvent) => {
        if (event.key === key && event.storageArea === storage) {
          if (event.newValue === null) {
            data.value = defaultValue
          } else {
            try {
              let parsedValue = serializer.read(event.newValue)
              
              // Handle merge defaults
              if (mergeDefaults && typeof defaultValue === 'object' && !Array.isArray(defaultValue)) {
                if (typeof mergeDefaults === 'function') {
                  parsedValue = mergeDefaults(parsedValue, defaultValue)
                } else {
                  parsedValue = deepMerge(defaultValue as Record<string, any>, parsedValue as Partial<Record<string, any>>) as T
                }
              }
              
              data.value = parsedValue
            } catch (error) {
              onError(error instanceof Error ? error : new Error(String(error)))
            }
          }
        }
      }

      window.addEventListener('storage', storageListener)
    }
  })

  onUnmounted(() => {
    if (storageListener) {
      window.removeEventListener('storage', storageListener)
    }
  })

  return {
    value: data,
    remove,
    exists,
    refresh
  }
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Reactive localStorage with cross-tab synchronization.
 * 
 * @example
 * // Basic usage
 * const { value: user } = useLocalStorage('user', { name: 'Guest' })
 * 
 * // Update value
 * user.value.name = 'John'
 * 
 * @example
 * // With custom serializer
 * const { value } = useLocalStorage('date', new Date(), {
 *   serializer: {
 *     read: (v) => new Date(v),
 *     write: (v) => v.toISOString()
 *   }
 * })
 * 
 * @example
 * // String value
 * const { value: token } = useLocalStorage('token', '')
 * 
 * @example
 * // With error handling
 * const { value, remove, exists } = useLocalStorage('settings', {}, {
 *   onError: (error) => console.error('Storage error:', error)
 * })
 * 
 * // Check if exists
 * if (exists()) {
 *   console.log('Settings found')
 * }
 * 
 * // Remove from storage
 * remove()
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  options: StorageOptions<T> = {}
): UseStorageReturn<T> {
  const storage = isBrowser() ? window.localStorage : null
  return useStorage(key, defaultValue, storage, options)
}

/**
 * Reactive sessionStorage with the same API as useLocalStorage.
 * Note: sessionStorage does not sync across tabs.
 * 
 * @example
 * // Basic usage
 * const { value: session } = useSessionStorage('session', { id: null })
 * 
 * @example
 * // Form state that persists during the session
 * const { value: formData } = useSessionStorage('checkout-form', {
 *   step: 1,
 *   items: []
 * })
 * 
 * @example
 * // Temporary authentication state
 * const { value: auth, remove } = useSessionStorage('temp-auth', {
 *   token: null,
 *   expires: null
 * })
 * 
 * // Clear on logout
 * function logout() {
 *   remove()
 * }
 */
export function useSessionStorage<T>(
  key: string,
  defaultValue: T,
  options: Omit<StorageOptions<T>, 'syncTabs'> = {}
): UseStorageReturn<T> {
  const storage = isBrowser() ? window.sessionStorage : null
  return useStorage(key, defaultValue, storage, { ...options, syncTabs: false })
}

/**
 * Create a storage composable for a custom storage implementation.
 * 
 * @example
 * // Custom storage implementation
 * const memoryStorage: Storage = {
 *   data: new Map(),
 *   getItem(key) { return this.data.get(key) ?? null },
 *   setItem(key, value) { this.data.set(key, value) },
 *   removeItem(key) { this.data.delete(key) },
 *   clear() { this.data.clear() },
 *   get length() { return this.data.size },
 *   key(index) { return Array.from(this.data.keys())[index] ?? null }
 * }
 * 
 * const { value } = createStorage('key', 'default', memoryStorage)
 */
export function createStorage<T>(
  key: string,
  defaultValue: T,
  storage: Storage | null,
  options: StorageOptions<T> = {}
): UseStorageReturn<T> {
  return useStorage(key, defaultValue, storage, options)
}

// Default exports
export default useLocalStorage
