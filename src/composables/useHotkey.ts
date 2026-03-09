import { onMounted, onUnmounted, unref, watch, type MaybeRef, type Ref } from 'vue'

// ============================================================================
// Types
// ============================================================================

export type ModifierKey = 'ctrl' | 'alt' | 'shift' | 'meta'
export type KeyCombo = string // e.g., 'ctrl+k', 'shift+alt+s', 'escape'

export interface HotkeyOptions {
  /** Target element to attach the listener to (default: window) */
  target?: MaybeRef<HTMLElement | Window | Document | null>
  /** Prevent default browser behavior */
  preventDefault?: boolean
  /** Stop event propagation */
  stopPropagation?: boolean
  /** Whether the hotkey is enabled */
  enabled?: MaybeRef<boolean>
  /** Event to listen for */
  event?: 'keydown' | 'keyup'
  /** Only trigger when focused on specific element types */
  scope?: 'global' | 'input' | 'non-input'
  /** Whether to use capture phase */
  capture?: boolean
  /** Repeat while key is held down */
  repeat?: boolean
}

export interface HotkeyHandler {
  (event: KeyboardEvent): void
}

export interface UseHotkeyReturn {
  /** Stop listening for the hotkey */
  stop: () => void
  /** Start listening for the hotkey */
  start: () => void
  /** Whether the listener is currently active */
  isActive: boolean
}

export interface ParsedHotkey {
  key: string
  ctrl: boolean
  alt: boolean
  shift: boolean
  meta: boolean
}

// ============================================================================
// Constants
// ============================================================================

const KEY_ALIASES: Record<string, string> = {
  // Modifier aliases
  'control': 'ctrl',
  'option': 'alt',
  'command': 'meta',
  'cmd': 'meta',
  // Arrow keys
  'up': 'arrowup',
  'down': 'arrowdown',
  'left': 'arrowleft',
  'right': 'arrowright',
  // Special keys
  'esc': 'escape',
  'space': ' ',
  'spacebar': ' ',
  'del': 'delete',
  'ins': 'insert',
  'pgup': 'pageup',
  'pgdn': 'pagedown',
  'plus': '+',
  'minus': '-'
}

const INPUT_ELEMENTS = ['INPUT', 'TEXTAREA', 'SELECT']

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Parse a key combination string into its components
 */
function parseHotkey(combo: string): ParsedHotkey {
  const parts = combo.toLowerCase().split('+').map(p => p.trim())
  
  const result: ParsedHotkey = {
    key: '',
    ctrl: false,
    alt: false,
    shift: false,
    meta: false
  }

  for (const part of parts) {
    const normalizedPart = KEY_ALIASES[part] || part

    if (normalizedPart === 'ctrl') {
      result.ctrl = true
    } else if (normalizedPart === 'alt') {
      result.alt = true
    } else if (normalizedPart === 'shift') {
      result.shift = true
    } else if (normalizedPart === 'meta') {
      result.meta = true
    } else {
      // It's the main key
      result.key = KEY_ALIASES[normalizedPart] || normalizedPart
    }
  }

  return result
}

/**
 * Check if the event matches the hotkey
 */
function matchesHotkey(event: KeyboardEvent, parsed: ParsedHotkey): boolean {
  // Check modifiers
  if (parsed.ctrl !== event.ctrlKey) return false
  if (parsed.alt !== event.altKey) return false
  if (parsed.shift !== event.shiftKey) return false
  if (parsed.meta !== event.metaKey) return false

  // Check the main key
  const eventKey = event.key.toLowerCase()
  const eventCode = event.code.toLowerCase()

  // Handle special cases
  if (parsed.key === eventKey) return true
  if (parsed.key === eventCode) return true

  // Handle letter keys (e.g., 'keya' for 'a')
  if (eventCode.startsWith('key') && parsed.key === eventCode.slice(3)) return true
  
  // Handle digit keys
  if (eventCode.startsWith('digit') && parsed.key === eventCode.slice(5)) return true

  // Handle numpad keys
  if (eventCode.startsWith('numpad') && parsed.key === eventCode.slice(6)) return true

  return false
}

/**
 * Check if we're in a browser environment
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

/**
 * Check if the active element is an input
 */
function isInputElement(element: Element | null): boolean {
  if (!element) return false
  return INPUT_ELEMENTS.includes(element.tagName) || 
         (element as HTMLElement).isContentEditable
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Register a keyboard hotkey handler.
 * 
 * @example
 * // Basic usage
 * useHotkey('ctrl+k', () => {
 *   openCommandPalette()
 * })
 * 
 * @example
 * // With options
 * useHotkey('ctrl+s', () => {
 *   saveDocument()
 * }, {
 *   preventDefault: true,
 *   stopPropagation: true
 * })
 * 
 * @example
 * // Multiple modifiers
 * useHotkey('ctrl+shift+s', () => {
 *   saveAsDocument()
 * })
 * 
 * @example
 * // Scoped to element
 * const editorRef = ref<HTMLElement>()
 * 
 * useHotkey('escape', () => {
 *   closeEditor()
 * }, {
 *   target: editorRef
 * })
 * 
 * @example
 * // Only when not in input
 * useHotkey('/', () => {
 *   focusSearch()
 * }, {
 *   scope: 'non-input'
 * })
 * 
 * @example
 * // Mac-style command key
 * useHotkey('meta+c', () => {
 *   copy()
 * })
 * // Or use 'cmd' alias
 * useHotkey('cmd+v', () => {
 *   paste()
 * })
 */
export function useHotkey(
  combo: KeyCombo,
  handler: HotkeyHandler,
  options: HotkeyOptions = {}
): UseHotkeyReturn {
  const {
    target,
    preventDefault = false,
    stopPropagation = false,
    enabled = true,
    event: eventType = 'keydown',
    scope = 'global',
    capture = false,
    repeat = false
  } = options

  const parsedHotkey = parseHotkey(combo)
  let isListening = false
  let cleanup: (() => void) | null = null

  /**
   * Handle keyboard events
   */
  function onKeyEvent(event: Event) {
    // Check if enabled
    if (!unref(enabled)) return

    const keyEvent = event as KeyboardEvent

    // Check repeat behavior
    if (keyEvent.repeat && !repeat) return

    // Check scope
    const activeElement = document.activeElement
    if (scope === 'input' && !isInputElement(activeElement)) return
    if (scope === 'non-input' && isInputElement(activeElement)) return

    // Check if hotkey matches
    if (!matchesHotkey(keyEvent, parsedHotkey)) return

    // Prevent default if configured
    if (preventDefault) {
      keyEvent.preventDefault()
    }

    // Stop propagation if configured
    if (stopPropagation) {
      keyEvent.stopPropagation()
    }

    // Call the handler
    handler(keyEvent)
  }

  /**
   * Start listening for the hotkey
   */
  function start() {
    if (!isBrowser() || isListening) return

    const targetElement = unref(target) ?? window

    targetElement.addEventListener(eventType, onKeyEvent, capture)
    isListening = true

    cleanup = () => {
      targetElement.removeEventListener(eventType, onKeyEvent, capture)
      isListening = false
    }
  }

  /**
   * Stop listening for the hotkey
   */
  function stop() {
    cleanup?.()
    cleanup = null
  }

  // Watch enabled state
  if (typeof enabled === 'object' && 'value' in enabled) {
    watch(enabled as Ref<boolean>, (newVal) => {
      if (newVal && !isListening) {
        start()
      }
    })
  }

  // Watch target changes
  if (target && typeof target === 'object' && 'value' in target) {
    watch(target as Ref<HTMLElement | null>, () => {
      if (isListening) {
        stop()
        start()
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
 * Register multiple hotkeys at once.
 * 
 * @example
 * useHotkeys({
 *   'ctrl+s': () => save(),
 *   'ctrl+z': () => undo(),
 *   'ctrl+shift+z': () => redo(),
 *   'escape': () => close()
 * }, {
 *   preventDefault: true
 * })
 */
export function useHotkeys(
  bindings: Record<KeyCombo, HotkeyHandler>,
  options: HotkeyOptions = {}
): UseHotkeyReturn {
  const stopFunctions: (() => void)[] = []
  const startFunctions: (() => void)[] = []

  for (const [combo, handler] of Object.entries(bindings)) {
    const { stop, start } = useHotkey(combo, handler, options)
    stopFunctions.push(stop)
    startFunctions.push(start)
  }

  return {
    stop: () => stopFunctions.forEach(fn => fn()),
    start: () => startFunctions.forEach(fn => fn()),
    get isActive() {
      return stopFunctions.length > 0
    }
  }
}

/**
 * Create a hotkey handler that can be used with v-on.
 * 
 * @example
 * const onKeyDown = createHotkeyHandler({
 *   'enter': () => submit(),
 *   'escape': () => cancel()
 * })
 * 
 * // Use in template: @keydown="onKeyDown"
 */
export function createHotkeyHandler(
  bindings: Record<KeyCombo, HotkeyHandler>,
  options: Omit<HotkeyOptions, 'target' | 'enabled'> = {}
): (event: KeyboardEvent) => void {
  const {
    preventDefault = false,
    stopPropagation = false,
    scope = 'global',
    repeat = false
  } = options

  const parsedBindings = Object.entries(bindings).map(([combo, handler]) => ({
    parsed: parseHotkey(combo),
    handler
  }))

  return (event: KeyboardEvent) => {
    // Check repeat behavior
    if (event.repeat && !repeat) return

    // Check scope
    const activeElement = document.activeElement
    if (scope === 'input' && !isInputElement(activeElement)) return
    if (scope === 'non-input' && isInputElement(activeElement)) return

    for (const { parsed, handler } of parsedBindings) {
      if (matchesHotkey(event, parsed)) {
        if (preventDefault) {
          event.preventDefault()
        }
        if (stopPropagation) {
          event.stopPropagation()
        }
        handler(event)
        break
      }
    }
  }
}

/**
 * Check if a hotkey combo is currently pressed.
 * Useful for detecting held keys.
 * 
 * @example
 * const isCtrlPressed = useKeyPressed('ctrl')
 * const isShiftCtrlK = useKeyPressed('ctrl+shift+k')
 */
export function useKeyPressed(combo: KeyCombo): Ref<boolean> {
  const pressed = ref(false)
  const parsedHotkey = parseHotkey(combo)

  function onKeyDown(event: KeyboardEvent) {
    if (matchesHotkey(event, parsedHotkey)) {
      pressed.value = true
    }
  }

  function onKeyUp(event: KeyboardEvent) {
    // Check if any part of the combo was released
    const key = event.key.toLowerCase()
    if (
      key === parsedHotkey.key ||
      (parsedHotkey.ctrl && !event.ctrlKey) ||
      (parsedHotkey.alt && !event.altKey) ||
      (parsedHotkey.shift && !event.shiftKey) ||
      (parsedHotkey.meta && !event.metaKey)
    ) {
      pressed.value = false
    }
  }

  onMounted(() => {
    if (isBrowser()) {
      window.addEventListener('keydown', onKeyDown)
      window.addEventListener('keyup', onKeyUp)
      window.addEventListener('blur', () => { pressed.value = false })
    }
  })

  onUnmounted(() => {
    if (isBrowser()) {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  })

  return pressed
}

// Default exports
export default useHotkey
