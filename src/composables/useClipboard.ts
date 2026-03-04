import { ref, readonly } from 'vue'
import { useToast } from './useToast'

// ============================================================================
// Types
// ============================================================================

export interface CopyOptions {
  /** Show toast notification on copy */
  showToast?: boolean
  /** Custom success message for toast */
  successMessage?: string
  /** Custom error message for toast */
  errorMessage?: string
}

export interface ClipboardState {
  /** Whether the last copy was successful */
  copied: boolean
  /** The last copied text */
  text: string | null
  /** Any error from the last operation */
  error: Error | null
}

export interface UseClipboardReturn {
  /** Copy text to clipboard */
  copy: (text: string, options?: CopyOptions) => Promise<boolean>
  /** Copy text content from an element */
  copyFromElement: (element: HTMLElement | null, options?: CopyOptions) => Promise<boolean>
  /** Whether the Clipboard API is supported */
  isSupported: boolean
  /** Last copied state */
  state: ClipboardState
  /** Reset the state */
  reset: () => void
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if Clipboard API is supported
 */
function isClipboardSupported(): boolean {
  return typeof navigator !== 'undefined' && 
         'clipboard' in navigator && 
         typeof navigator.clipboard.writeText === 'function'
}

/**
 * Fallback copy using execCommand (for older browsers)
 */
function fallbackCopy(text: string): boolean {
  const textArea = document.createElement('textarea')
  textArea.value = text
  
  // Avoid scrolling to bottom
  textArea.style.top = '0'
  textArea.style.left = '0'
  textArea.style.position = 'fixed'
  textArea.style.opacity = '0'
  textArea.style.pointerEvents = 'none'
  
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  
  let success = false
  try {
    success = document.execCommand('copy')
  } catch {
    success = false
  }
  
  document.body.removeChild(textArea)
  return success
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Clipboard composable for copying text
 * 
 * @example
 * const clipboard = useClipboard()
 * 
 * // Basic usage
 * await clipboard.copy('Hello, World!')
 * 
 * // With toast notification
 * await clipboard.copy('Hello, World!', { showToast: true })
 * 
 * // Copy from element
 * const elementRef = ref<HTMLElement>()
 * await clipboard.copyFromElement(elementRef.value)
 */
export function useClipboard(): UseClipboardReturn {
  const toast = useToast()
  
  const state = ref<ClipboardState>({
    copied: false,
    text: null,
    error: null
  })
  
  const isSupported = isClipboardSupported()
  
  /**
   * Copy text to clipboard
   */
  async function copy(text: string, options: CopyOptions = {}): Promise<boolean> {
    const {
      showToast = false,
      successMessage = 'Copied to clipboard!',
      errorMessage = 'Failed to copy to clipboard'
    } = options
    
    // Reset state
    state.value.error = null
    state.value.copied = false
    
    try {
      if (isSupported) {
        // Modern Clipboard API
        await navigator.clipboard.writeText(text)
        state.value.copied = true
        state.value.text = text
      } else {
        // Fallback for older browsers
        const success = fallbackCopy(text)
        if (!success) {
          throw new Error('execCommand copy failed')
        }
        state.value.copied = true
        state.value.text = text
      }
      
      if (showToast) {
        toast.success(successMessage)
      }
      
      return true
    } catch (err) {
      state.value.error = err instanceof Error ? err : new Error('Copy failed')
      state.value.copied = false
      
      if (showToast) {
        toast.error(errorMessage)
      }
      
      return false
    }
  }
  
  /**
   * Copy text content from an element
   */
  async function copyFromElement(
    element: HTMLElement | null,
    options: CopyOptions = {}
  ): Promise<boolean> {
    if (!element) {
      state.value.error = new Error('Element is null')
      if (options.showToast) {
        toast.error(options.errorMessage ?? 'Failed to copy - no element')
      }
      return false
    }
    
    const text = element.textContent ?? element.innerText ?? ''
    return copy(text, options)
  }
  
  /**
   * Reset the clipboard state
   */
  function reset() {
    state.value.copied = false
    state.value.text = null
    state.value.error = null
  }
  
  return {
    copy,
    copyFromElement,
    isSupported,
    state: readonly(state).value,
    reset
  }
}

export default useClipboard
