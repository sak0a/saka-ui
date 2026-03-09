import { ref, reactive, readonly, markRaw, type Component } from 'vue'

// ============================================================================
// Types
// ============================================================================

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading' | 'custom'

export type ToastPosition = 
  | 'top-left' 
  | 'top-right' 
  | 'top-center'
  | 'bottom-left' 
  | 'bottom-right' 
  | 'bottom-center'

export interface ToastOptions {
  /** Toast title */
  title?: string
  /** Toast description/message */
  description?: string
  /** Duration in ms before auto-dismiss (0 = no auto-dismiss) */
  duration?: number
  /** Position on screen */
  position?: ToastPosition
  /** Show progress bar */
  showProgress?: boolean
  /** Show close button */
  closable?: boolean
  /** Custom icon (mdi icon name, or false to hide) */
  icon?: string | boolean
  /** Custom color for 'custom' type */
  color?: string
  /** Callback when toast is clicked */
  onClick?: () => void
  /** Callback when toast is closed */
  onClose?: () => void
  /** Custom component to render */
  component?: Component
  /** Props for custom component */
  componentProps?: Record<string, unknown>
}

export interface ToastInstance {
  /** Unique toast ID */
  id: string
  /** Toast type */
  type: ToastType
  /** Toast options */
  options: ToastOptions
  /** Creation timestamp */
  createdAt: number
  /** Whether toast is paused */
  paused: boolean
  /** Remaining time when paused */
  remainingTime: number
  /** Progress percentage (0-100) */
  progress: number
  /** Dismiss this toast */
  dismiss: () => void
  /** Pause auto-dismiss */
  pause: () => void
  /** Resume auto-dismiss */
  resume: () => void
  /** Update toast content */
  update: (options: Partial<ToastOptions>) => void
}

export interface ToastPromiseOptions<T> {
  loading: string | ToastOptions
  success: string | ToastOptions | ((data: T) => string | ToastOptions)
  error: string | ToastOptions | ((err: unknown) => string | ToastOptions)
}

export interface ToastConfig {
  /** Default position for all toasts */
  position?: ToastPosition
  /** Default duration in ms */
  duration?: number
  /** Maximum toasts per position */
  maxToasts?: number
  /** Gap between toasts in px */
  gap?: number
  /** Whether to show progress bar by default */
  showProgress?: boolean
  /** Whether toasts are closable by default */
  closable?: boolean
}

// ============================================================================
// Global State
// ============================================================================

const defaultConfig: Required<ToastConfig> = {
  position: 'top-right',
  duration: 5000,
  maxToasts: 5,
  gap: 8,
  showProgress: true,
  closable: true
}

const globalConfig = reactive<Required<ToastConfig>>({ ...defaultConfig })
const toasts = ref<ToastInstance[]>([])
const timers = new Map<string, ReturnType<typeof setInterval>>()

// ============================================================================
// Helper Functions
// ============================================================================

function generateId(): string {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function normalizeOptions(
  messageOrOptions: string | ToastOptions,
  _type: ToastType
): ToastOptions {
  if (typeof messageOrOptions === 'string') {
    return { description: messageOrOptions }
  }
  return messageOrOptions
}

function getDefaultIcon(type: ToastType): string {
  const icons: Record<ToastType, string> = {
    success: 'check-circle',
    error: 'alert-circle',
    warning: 'alert',
    info: 'information',
    loading: 'loading',
    custom: 'bell'
  }
  return icons[type]
}

function startTimer(toast: ToastInstance) {
  const duration = toast.options.duration ?? globalConfig.duration
  if (duration <= 0) return

  const startTime = Date.now()
  const initialRemaining = toast.remainingTime > 0 ? toast.remainingTime : duration

  const intervalId = setInterval(() => {
    if (toast.paused) return

    const elapsed = Date.now() - startTime
    const remaining = initialRemaining - elapsed
    
    if (remaining <= 0) {
      toast.dismiss()
    } else {
      toast.remainingTime = remaining
      toast.progress = (remaining / duration) * 100
    }
  }, 50)

  timers.set(toast.id, intervalId)
}

function stopTimer(toastId: string) {
  const timerId = timers.get(toastId)
  if (timerId) {
    clearInterval(timerId)
    timers.delete(toastId)
  }
}

function removeToast(id: string) {
  stopTimer(id)
  const index = toasts.value.findIndex(t => t.id === id)
  if (index !== -1) {
    const toast = toasts.value[index]
    toast.options.onClose?.()
    toasts.value.splice(index, 1)
  }
}

function enforceMaxToasts(position: ToastPosition) {
  const positionToasts = toasts.value.filter(t => 
    (t.options.position ?? globalConfig.position) === position
  )
  
  while (positionToasts.length > globalConfig.maxToasts) {
    const oldest = positionToasts.shift()
    if (oldest) {
      removeToast(oldest.id)
    }
  }
}

// ============================================================================
// Core Functions
// ============================================================================

function createToast(type: ToastType, options: ToastOptions): ToastInstance {
  const id = generateId()
  const position = options.position ?? globalConfig.position
  const duration = options.duration ?? globalConfig.duration

  const toast: ToastInstance = reactive({
    id,
    type,
    options: {
      ...options,
      position,
      duration,
      showProgress: options.showProgress ?? globalConfig.showProgress,
      closable: options.closable ?? globalConfig.closable,
      icon: options.icon ?? getDefaultIcon(type),
      component: options.component ? markRaw(options.component) : undefined
    },
    createdAt: Date.now(),
    paused: false,
    remainingTime: duration,
    progress: 100,
    dismiss: () => removeToast(id),
    pause: () => {
      toast.paused = true
      stopTimer(id)
    },
    resume: () => {
      toast.paused = false
      startTimer(toast)
    },
    update: (newOptions: Partial<ToastOptions>) => {
      Object.assign(toast.options, newOptions)
    }
  })

  // Add to queue
  toasts.value.push(toast)
  
  // Enforce max toasts
  enforceMaxToasts(position)
  
  // Start auto-dismiss timer
  if (type !== 'loading') {
    startTimer(toast)
  }

  return toast
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Toast notification composable
 * 
 * @example
 * const toast = useToast()
 * 
 * // Basic usage
 * toast.success('Saved successfully!')
 * toast.error('Failed to save')
 * 
 * // With options
 * toast.success({
 *   title: 'Success',
 *   description: 'Your changes have been saved',
 *   duration: 3000
 * })
 * 
 * // Promise-based
 * toast.promise(saveData(), {
 *   loading: 'Saving...',
 *   success: 'Saved!',
 *   error: 'Failed to save'
 * })
 */
export function useToast() {
  /**
   * Show a success toast
   */
  function success(messageOrOptions: string | ToastOptions): ToastInstance {
    const options = normalizeOptions(messageOrOptions, 'success')
    return createToast('success', options)
  }

  /**
   * Show an error toast
   */
  function error(messageOrOptions: string | ToastOptions): ToastInstance {
    const options = normalizeOptions(messageOrOptions, 'error')
    return createToast('error', options)
  }

  /**
   * Show a warning toast
   */
  function warning(messageOrOptions: string | ToastOptions): ToastInstance {
    const options = normalizeOptions(messageOrOptions, 'warning')
    return createToast('warning', options)
  }

  /**
   * Show an info toast
   */
  function info(messageOrOptions: string | ToastOptions): ToastInstance {
    const options = normalizeOptions(messageOrOptions, 'info')
    return createToast('info', options)
  }

  /**
   * Show a loading toast (no auto-dismiss)
   */
  function loading(messageOrOptions: string | ToastOptions): ToastInstance {
    const options = normalizeOptions(messageOrOptions, 'loading')
    return createToast('loading', { ...options, duration: 0, showProgress: false })
  }

  /**
   * Show a custom toast
   */
  function custom(options: ToastOptions): ToastInstance {
    return createToast('custom', options)
  }

  /**
   * Show a promise-based toast
   * Displays loading → success/error based on promise resolution
   */
  async function promise<T>(
    promiseOrFn: Promise<T> | (() => Promise<T>),
    options: ToastPromiseOptions<T>
  ): Promise<T> {
    const actualPromise = typeof promiseOrFn === 'function' ? promiseOrFn() : promiseOrFn
    
    // Show loading toast
    const loadingOptions = normalizeOptions(options.loading, 'loading')
    const loadingToast = loading(loadingOptions)

    try {
      const result = await actualPromise
      
      // Dismiss loading and show success
      loadingToast.dismiss()
      
      let successOptions: ToastOptions
      if (typeof options.success === 'function') {
        const successResult = options.success(result)
        successOptions = normalizeOptions(successResult, 'success')
      } else {
        successOptions = normalizeOptions(options.success, 'success')
      }
      success(successOptions)
      
      return result
    } catch (err) {
      // Dismiss loading and show error
      loadingToast.dismiss()
      
      let errorOptions: ToastOptions
      if (typeof options.error === 'function') {
        const errorResult = options.error(err)
        errorOptions = normalizeOptions(errorResult, 'error')
      } else {
        errorOptions = normalizeOptions(options.error, 'error')
      }
      error(errorOptions)
      
      throw err
    }
  }

  /**
   * Dismiss a specific toast by ID
   */
  function dismiss(toastId: string) {
    removeToast(toastId)
  }

  /**
   * Dismiss all toasts
   */
  function dismissAll() {
    const ids = toasts.value.map(t => t.id)
    ids.forEach(removeToast)
  }

  /**
   * Configure global toast defaults
   */
  function configure(config: ToastConfig) {
    Object.assign(globalConfig, config)
  }

  return {
    // Toast methods
    success,
    error,
    warning,
    info,
    loading,
    custom,
    promise,
    // Management
    dismiss,
    dismissAll,
    configure,
    // State (readonly)
    toasts: readonly(toasts),
    config: readonly(globalConfig)
  }
}

// ============================================================================
// Exports
// ============================================================================

/** Get all active toasts (for use in SToastContainer) */
export function getToasts() {
  return readonly(toasts)
}

/** Get global toast config */
export function getToastConfig() {
  return readonly(globalConfig)
}

/** Dismiss a toast by ID (for use in SToast) */
export function dismissToast(id: string) {
  removeToast(id)
}

/** Pause a toast by ID */
export function pauseToast(id: string) {
  const toast = toasts.value.find(t => t.id === id)
  toast?.pause()
}

/** Resume a toast by ID */
export function resumeToast(id: string) {
  const toast = toasts.value.find(t => t.id === id)
  toast?.resume()
}

export default useToast
