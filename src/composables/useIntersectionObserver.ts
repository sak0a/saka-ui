import { ref, watch, onMounted, onUnmounted, unref, type Ref, type MaybeRef, readonly, type DeepReadonly } from 'vue'

// ============================================================================
// Types
// ============================================================================

export interface IntersectionObserverOptions {
  /** The element that is used as the viewport. Defaults to the browser viewport. */
  root?: MaybeRef<HTMLElement | null>
  /** Margin around the root. Can be values similar to CSS margin. */
  rootMargin?: string
  /** A single number or array of thresholds (0.0 to 1.0) */
  threshold?: number | number[]
  /** Whether to start observing immediately */
  immediate?: boolean
  /** Callback when intersection changes */
  onChange?: (entries: IntersectionObserverEntry[]) => void
}

export interface UseIntersectionObserverReturn {
  /** Whether the element is currently visible */
  isVisible: DeepReadonly<Ref<boolean>>
  /** The current intersection entry */
  entry: DeepReadonly<Ref<IntersectionObserverEntry | null>>
  /** The intersection ratio (0.0 to 1.0) */
  ratio: DeepReadonly<Ref<number>>
  /** Stop observing */
  stop: () => void
  /** Start observing */
  start: () => void
  /** Whether the observer is currently active */
  isActive: Ref<boolean>
}

export interface UseIntersectionObserverMultipleReturn {
  /** Map of element to visibility state */
  entries: DeepReadonly<Ref<Map<Element, IntersectionObserverEntry>>>
  /** Stop observing all elements */
  stop: () => void
  /** Start observing all elements */
  start: () => void
  /** Whether the observer is currently active */
  isActive: Ref<boolean>
  /** Check if a specific element is visible */
  isElementVisible: (element: Element) => boolean
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if we're in a browser environment
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof IntersectionObserver !== 'undefined'
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Observe an element's intersection with its parent or the viewport.
 * Useful for lazy loading, infinite scroll, and scroll animations.
 * 
 * @example
 * // Basic usage with template ref
 * const targetRef = ref<HTMLElement>()
 * const { isVisible } = useIntersectionObserver(targetRef)
 * 
 * // In template:
 * <div ref="targetRef">
 *   <img v-if="isVisible" :src="imageSrc" />
 * </div>
 * 
 * @example
 * // With threshold
 * const { isVisible, ratio } = useIntersectionObserver(targetRef, {
 *   threshold: 0.5 // Trigger when 50% visible
 * })
 * 
 * @example
 * // With root margin for early triggering
 * const { isVisible } = useIntersectionObserver(targetRef, {
 *   rootMargin: '100px' // Trigger 100px before entering viewport
 * })
 * 
 * @example
 * // With callback
 * const { isVisible } = useIntersectionObserver(targetRef, {
 *   onChange: (entries) => {
 *     entries.forEach(entry => {
 *       console.log('Visibility changed:', entry.isIntersecting)
 *     })
 *   }
 * })
 * 
 * @example
 * // Manual control
 * const { isVisible, stop, start } = useIntersectionObserver(targetRef, {
 *   immediate: false
 * })
 * 
 * // Start observing later
 * onMounted(() => {
 *   start()
 * })
 * 
 * // Stop observing
 * onBeforeUnmount(() => {
 *   stop()
 * })
 */
export function useIntersectionObserver(
  target: MaybeRef<HTMLElement | null | undefined>,
  options: IntersectionObserverOptions = {}
): UseIntersectionObserverReturn {
  const {
    root,
    rootMargin = '0px',
    threshold = 0,
    immediate = true,
    onChange
  } = options

  const isVisible = ref(false)
  const entry = ref<IntersectionObserverEntry | null>(null)
  const ratio = ref(0)
  const isActive = ref(false)

  let observer: IntersectionObserver | null = null

  /**
   * Intersection callback
   */
  function callback(entries: IntersectionObserverEntry[]) {
    for (const e of entries) {
      isVisible.value = e.isIntersecting
      entry.value = e
      ratio.value = e.intersectionRatio
    }

    onChange?.(entries)
  }

  /**
   * Create and start the observer
   */
  function start() {
    if (!isBrowser()) return

    stop()

    const targetElement = unref(target)
    if (!targetElement) return

    const rootElement = unref(root)

    observer = new IntersectionObserver(callback, {
      root: rootElement,
      rootMargin,
      threshold
    })

    observer.observe(targetElement)
    isActive.value = true
  }

  /**
   * Stop observing
   */
  function stop() {
    if (observer) {
      observer.disconnect()
      observer = null
      isActive.value = false
    }
  }

  // Watch for target changes
  watch(
    () => unref(target),
    (newTarget, oldTarget) => {
      if (isActive.value) {
        if (oldTarget && observer) {
          observer.unobserve(oldTarget)
        }
        if (newTarget && observer) {
          observer.observe(newTarget)
        } else if (newTarget && !observer) {
          start()
        }
      }
    }
  )

  // Watch for root changes
  if (root && typeof root === 'object' && 'value' in root) {
    watch(root as Ref<HTMLElement | null>, () => {
      if (isActive.value) {
        start()
      }
    })
  }

  // Lifecycle hooks
  onMounted(() => {
    if (immediate) {
      start()
    }
  })

  onUnmounted(() => {
    stop()
  })

  return {
    isVisible: readonly(isVisible),
    entry: readonly(entry),
    ratio: readonly(ratio),
    stop,
    start,
    isActive
  }
}

/**
 * Observe multiple elements at once.
 * More efficient than creating multiple observers.
 * 
 * @example
 * const elements = ref<HTMLElement[]>([])
 * const { entries, isElementVisible } = useIntersectionObserverMultiple(elements)
 * 
 * // Check specific element
 * const isFirstVisible = computed(() => {
 *   return elements.value[0] ? isElementVisible(elements.value[0]) : false
 * })
 * 
 * @example
 * // Lazy load images
 * const imageRefs = ref<HTMLImageElement[]>([])
 * 
 * const { entries } = useIntersectionObserverMultiple(imageRefs, {
 *   rootMargin: '50px',
 *   onChange: (entries) => {
 *     entries.forEach(entry => {
 *       if (entry.isIntersecting) {
 *         const img = entry.target as HTMLImageElement
 *         img.src = img.dataset.src || ''
 *       }
 *     })
 *   }
 * })
 */
export function useIntersectionObserverMultiple(
  targets: MaybeRef<(HTMLElement | null | undefined)[]>,
  options: IntersectionObserverOptions = {}
): UseIntersectionObserverMultipleReturn {
  const {
    root,
    rootMargin = '0px',
    threshold = 0,
    immediate = true,
    onChange
  } = options

  const entries = ref(new Map<Element, IntersectionObserverEntry>())
  const isActive = ref(false)

  let observer: IntersectionObserver | null = null

  /**
   * Intersection callback
   */
  function callback(newEntries: IntersectionObserverEntry[]) {
    for (const entry of newEntries) {
      entries.value.set(entry.target, entry)
    }

    // Trigger reactivity
    entries.value = new Map(entries.value)

    onChange?.(newEntries)
  }

  /**
   * Check if an element is visible
   */
  function isElementVisible(element: Element): boolean {
    const entry = entries.value.get(element)
    return entry?.isIntersecting ?? false
  }

  /**
   * Create and start the observer
   */
  function start() {
    if (!isBrowser()) return

    stop()

    const rootElement = unref(root)

    observer = new IntersectionObserver(callback, {
      root: rootElement,
      rootMargin,
      threshold
    })

    const targetElements = unref(targets)
    for (const target of targetElements) {
      if (target) {
        observer.observe(target)
      }
    }

    isActive.value = true
  }

  /**
   * Stop observing
   */
  function stop() {
    if (observer) {
      observer.disconnect()
      observer = null
      isActive.value = false
      entries.value.clear()
    }
  }

  // Watch for target changes
  watch(
    () => unref(targets),
    (newTargets, oldTargets) => {
      if (!isActive.value || !observer) return

      // Unobserve removed elements
      if (oldTargets) {
        for (const target of oldTargets) {
          if (target && !newTargets.includes(target)) {
            observer.unobserve(target)
            entries.value.delete(target)
          }
        }
      }

      // Observe new elements
      for (const target of newTargets) {
        if (target && (!oldTargets || !oldTargets.includes(target))) {
          observer.observe(target)
        }
      }
    },
    { deep: true }
  )

  // Lifecycle hooks
  onMounted(() => {
    if (immediate) {
      start()
    }
  })

  onUnmounted(() => {
    stop()
  })

  return {
    entries: readonly(entries),
    stop,
    start,
    isActive,
    isElementVisible
  }
}

/**
 * Simple visibility check - triggers once when element becomes visible.
 * Useful for one-time animations or analytics tracking.
 * 
 * @example
 * const targetRef = ref<HTMLElement>()
 * const hasBeenSeen = useElementVisibility(targetRef)
 * 
 * watch(hasBeenSeen, (visible) => {
 *   if (visible) {
 *     trackImpression()
 *   }
 * })
 * 
 * @example
 * // With threshold
 * const isHalfVisible = useElementVisibility(targetRef, { threshold: 0.5 })
 */
export function useElementVisibility(
  target: MaybeRef<HTMLElement | null | undefined>,
  options: Pick<IntersectionObserverOptions, 'root' | 'rootMargin' | 'threshold'> = {}
): DeepReadonly<Ref<boolean>> {
  const { isVisible } = useIntersectionObserver(target, options)
  return isVisible
}

/**
 * Track when an element has been seen at least once.
 * The value stays true once the element becomes visible.
 * 
 * @example
 * const targetRef = ref<HTMLElement>()
 * const hasBeenSeen = useElementHasBeenSeen(targetRef)
 * 
 * // Trigger animation once
 * <div ref="targetRef" :class="{ 'animate-in': hasBeenSeen }">
 *   Content
 * </div>
 */
export function useElementHasBeenSeen(
  target: MaybeRef<HTMLElement | null | undefined>,
  options: Pick<IntersectionObserverOptions, 'root' | 'rootMargin' | 'threshold'> = {}
): DeepReadonly<Ref<boolean>> {
  const hasBeenSeen = ref(false)

  const { isVisible, stop } = useIntersectionObserver(target, {
    ...options,
    onChange: () => {
      if (isVisible.value && !hasBeenSeen.value) {
        hasBeenSeen.value = true
        stop() // Stop observing once seen
      }
    }
  })

  return readonly(hasBeenSeen)
}

// Default exports
export default useIntersectionObserver
