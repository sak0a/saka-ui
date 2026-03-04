import { ref, onMounted, onUnmounted, readonly, type Ref, type DeepReadonly } from 'vue'

// ============================================================================
// Types
// ============================================================================

export type MediaQueryInput = string | Record<string, string>

export interface UseMediaQueryReturn {
  /** Whether the media query matches */
  matches: DeepReadonly<Ref<boolean>>
  /** The original query string */
  query: string
}

export type UseMediaQueryObjectReturn<T extends Record<string, string>> = {
  [K in keyof T]: DeepReadonly<Ref<boolean>>
}

// ============================================================================
// Predefined Breakpoints
// ============================================================================

export const breakpoints = {
  /** Extra small devices (phones, 480px and below) */
  xs: '(max-width: 480px)',
  /** Small devices (phones, 640px and below) */
  sm: '(max-width: 640px)',
  /** Medium devices (tablets, 768px and below) */
  md: '(max-width: 768px)',
  /** Large devices (desktops, 1024px and below) */
  lg: '(max-width: 1024px)',
  /** Extra large devices (large desktops, 1280px and below) */
  xl: '(max-width: 1280px)',
  /** 2x Extra large devices (1536px and below) */
  '2xl': '(max-width: 1536px)',
  
  // Min-width variants
  /** Mobile and up */
  'sm-up': '(min-width: 640px)',
  /** Tablet and up */
  'md-up': '(min-width: 768px)',
  /** Desktop and up */
  'lg-up': '(min-width: 1024px)',
  /** Large desktop and up */
  'xl-up': '(min-width: 1280px)',
  
  // Common queries
  /** Prefers dark mode */
  dark: '(prefers-color-scheme: dark)',
  /** Prefers light mode */
  light: '(prefers-color-scheme: light)',
  /** Prefers reduced motion */
  reducedMotion: '(prefers-reduced-motion: reduce)',
  /** Portrait orientation */
  portrait: '(orientation: portrait)',
  /** Landscape orientation */
  landscape: '(orientation: landscape)',
  /** Touch device (primary input is touch) */
  touch: '(hover: none) and (pointer: coarse)',
  /** Mouse/pointer device */
  mouse: '(hover: hover) and (pointer: fine)',
  /** High resolution display */
  retina: '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)'
} as const

export type BreakpointKey = keyof typeof breakpoints

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if we're in a browser environment
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
}

/**
 * Create a single media query listener
 */
function createMediaQueryRef(query: string): {
  matches: Ref<boolean>
  cleanup: () => void
} {
  const matches = ref(false)
  let mediaQueryList: MediaQueryList | null = null
  let handler: ((e: MediaQueryListEvent) => void) | null = null

  if (isBrowser()) {
    mediaQueryList = window.matchMedia(query)
    matches.value = mediaQueryList.matches

    handler = (e: MediaQueryListEvent) => {
      matches.value = e.matches
    }

    // Modern API
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handler)
    } else {
      // Legacy API (Safari < 14)
      mediaQueryList.addListener(handler)
    }
  }

  const cleanup = () => {
    if (mediaQueryList && handler) {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', handler)
      } else {
        mediaQueryList.removeListener(handler)
      }
    }
  }

  return { matches, cleanup }
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Reactive media query composable
 * 
 * @example
 * // Single query
 * const isMobile = useMediaQuery('(max-width: 768px)')
 * 
 * if (isMobile.value) {
 *   // Mobile layout
 * }
 * 
 * @example
 * // Using predefined breakpoints
 * import { useMediaQuery, breakpoints } from 'saka-ui'
 * 
 * const isDark = useMediaQuery(breakpoints.dark)
 * const isMobile = useMediaQuery(breakpoints.md)
 * 
 * @example
 * // Multiple queries
 * const { isMobile, isTablet, isDesktop } = useMediaQueries({
 *   isMobile: '(max-width: 767px)',
 *   isTablet: '(min-width: 768px) and (max-width: 1023px)',
 *   isDesktop: '(min-width: 1024px)'
 * })
 */
export function useMediaQuery(query: string): DeepReadonly<Ref<boolean>> {
  const { matches, cleanup } = createMediaQueryRef(query)

  onMounted(() => {
    // Re-check on mount in case SSR value was wrong
    if (isBrowser()) {
      matches.value = window.matchMedia(query).matches
    }
  })

  onUnmounted(() => {
    cleanup()
  })

  return readonly(matches)
}

/**
 * Multiple media queries at once
 * 
 * @example
 * const { isMobile, isTablet, isDesktop } = useMediaQueries({
 *   isMobile: '(max-width: 767px)',
 *   isTablet: '(min-width: 768px) and (max-width: 1023px)',
 *   isDesktop: '(min-width: 1024px)'
 * })
 */
export function useMediaQueries<T extends Record<string, string>>(
  queries: T
): UseMediaQueryObjectReturn<T> {
  const cleanups: (() => void)[] = []
  const result = {} as UseMediaQueryObjectReturn<T>

  for (const [key, query] of Object.entries(queries)) {
    const { matches, cleanup } = createMediaQueryRef(query)
    result[key as keyof T] = readonly(matches)
    cleanups.push(cleanup)
  }

  onMounted(() => {
    // Re-check on mount in case SSR values were wrong
    if (isBrowser()) {
      for (const [key, query] of Object.entries(queries)) {
        const mediaQuery = window.matchMedia(query)
        ;(result[key as keyof T] as unknown as Ref<boolean>).value = mediaQuery.matches
      }
    }
  })

  onUnmounted(() => {
    cleanups.forEach(cleanup => cleanup())
  })

  return result
}

/**
 * Common responsive breakpoint helpers
 * 
 * @example
 * const { isMobile, isTablet, isDesktop } = useBreakpoints()
 * 
 * // In template
 * <MobileNav v-if="isMobile" />
 * <DesktopNav v-else />
 */
export function useBreakpoints() {
  return useMediaQueries({
    isMobile: '(max-width: 767px)',
    isTablet: '(min-width: 768px) and (max-width: 1023px)',
    isDesktop: '(min-width: 1024px)',
    isTouch: '(hover: none) and (pointer: coarse)',
    isDark: '(prefers-color-scheme: dark)',
    prefersReducedMotion: '(prefers-reduced-motion: reduce)'
  })
}

/**
 * Check a predefined breakpoint
 * 
 * @example
 * const isMobile = useBreakpoint('md')
 * const isDark = useBreakpoint('dark')
 */
export function useBreakpoint(key: BreakpointKey): DeepReadonly<Ref<boolean>> {
  return useMediaQuery(breakpoints[key])
}

export default useMediaQuery
