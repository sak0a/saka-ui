import { onMounted, onUnmounted, unref, watch, type Ref, type MaybeRef } from 'vue'

// ============================================================================
// Types
// ============================================================================

export type MaybeElementRef = MaybeRef<HTMLElement | null | undefined>

export interface ClickOutsideOptions {
  /** Elements to exclude from triggering the callback */
  exclude?: MaybeElementRef[]
  /** Whether to trigger callback on Escape key press */
  triggerOnEscape?: boolean
  /** Whether the handler is active */
  enabled?: MaybeRef<boolean>
  /** Event to listen for */
  event?: 'click' | 'mousedown' | 'mouseup' | 'pointerdown' | 'pointerup'
  /** Whether to use capture phase */
  capture?: boolean
}

export type ClickOutsideHandler = (event: MouseEvent | KeyboardEvent) => void

export interface UseClickOutsideReturn {
  /** Stop listening for click outside events */
  stop: () => void
  /** Start listening for click outside events */
  start: () => void
  /** Whether the listener is currently active */
  isActive: boolean
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get the actual element from a ref or element
 */
function getElement(target: MaybeElementRef): HTMLElement | null {
  const el = unref(target)
  return el ?? null
}

/**
 * Check if an element is contained within any of the target elements
 */
function isContainedIn(
  element: HTMLElement | null,
  targets: (HTMLElement | null)[]
): boolean {
  if (!element) return false
  
  for (const target of targets) {
    if (target && target.contains(element)) {
      return true
    }
  }
  
  return false
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Detect clicks outside an element
 * 
 * @example
 * // Basic usage
 * const targetRef = ref<HTMLElement>()
 * 
 * useClickOutside(targetRef, () => {
 *   console.log('Clicked outside!')
 * })
 * 
 * @example
 * // With options
 * const dropdownRef = ref<HTMLElement>()
 * const buttonRef = ref<HTMLElement>()
 * 
 * useClickOutside(dropdownRef, () => {
 *   closeDropdown()
 * }, {
 *   exclude: [buttonRef],
 *   triggerOnEscape: true
 * })
 * 
 * @example
 * // Multiple targets
 * const refs = [ref<HTMLElement>(), ref<HTMLElement>()]
 * 
 * useClickOutside(refs, () => {
 *   closeAll()
 * })
 */
export function useClickOutside(
  target: MaybeElementRef | MaybeElementRef[],
  handler: ClickOutsideHandler,
  options: ClickOutsideOptions = {}
): UseClickOutsideReturn {
  const {
    exclude = [],
    triggerOnEscape = false,
    enabled = true,
    event = 'pointerdown',
    capture = true
  } = options

  let isListening = false
  let cleanup: (() => void) | null = null

  /**
   * Handle click/pointer events
   */
  function onClickOutside(e: MouseEvent) {
    // Check if enabled
    if (!unref(enabled)) return

    const clickedElement = e.target as HTMLElement

    // Get all target elements
    const targets = Array.isArray(target) ? target : [target]
    const targetElements = targets.map(getElement)

    // Check if clicked inside any target
    if (isContainedIn(clickedElement, targetElements)) {
      return
    }

    // Check if clicked inside any excluded element
    const excludedElements = exclude.map(getElement)
    if (isContainedIn(clickedElement, excludedElements)) {
      return
    }

    // Trigger the handler
    handler(e)
  }

  /**
   * Handle escape key press
   */
  function onEscape(e: KeyboardEvent) {
    // Check if enabled
    if (!unref(enabled)) return

    if (e.key === 'Escape') {
      handler(e)
    }
  }

  /**
   * Start listening for events
   */
  function start() {
    if (isListening) return

    document.addEventListener(event, onClickOutside, capture)
    
    if (triggerOnEscape) {
      document.addEventListener('keydown', onEscape, capture)
    }

    isListening = true

    cleanup = () => {
      document.removeEventListener(event, onClickOutside, capture)
      if (triggerOnEscape) {
        document.removeEventListener('keydown', onEscape, capture)
      }
      isListening = false
    }
  }

  /**
   * Stop listening for events
   */
  function stop() {
    cleanup?.()
    cleanup = null
  }

  // Watch enabled state
  if (typeof enabled === 'object' && 'value' in enabled) {
    watch(enabled as Ref<boolean>, (newVal) => {
      if (newVal) {
        start()
      } else {
        stop()
      }
    })
  }

  // Lifecycle hooks
  onMounted(() => {
    if (unref(enabled)) {
      start()
    }
  })

  onUnmounted(() => {
    stop()
  })

  return {
    stop,
    start,
    get isActive() {
      return isListening
    }
  }
}

/**
 * Directive-style helper for click outside
 * 
 * @example
 * const { onClickOutside } = createClickOutsideHandler(() => {
 *   isOpen.value = false
 * })
 * 
 * // Use in template: @clickoutside="onClickOutside"
 */
export function createClickOutsideHandler(handler: ClickOutsideHandler) {
  return {
    onClickOutside: handler
  }
}

export default useClickOutside
