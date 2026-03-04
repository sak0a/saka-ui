import { ref, reactive, readonly, h, render, type Component, type VNode, markRaw } from 'vue'

// ============================================================================
// Types
// ============================================================================

export type DialogVariant = 'default' | 'danger' | 'warning' | 'success' | 'info'

export interface ConfirmOptions {
  /** Dialog title */
  title: string
  /** Dialog description/message */
  description?: string
  /** Confirm button text */
  confirmText?: string
  /** Cancel button text */
  cancelText?: string
  /** Dialog variant (affects confirm button style) */
  variant?: DialogVariant
  /** Icon name */
  icon?: string | boolean
  /** Close on backdrop click */
  closeOnBackdrop?: boolean
  /** Close on escape key */
  closeOnEscape?: boolean
}

export interface PromptOptions extends ConfirmOptions {
  /** Input placeholder */
  placeholder?: string
  /** Default input value */
  defaultValue?: string
  /** Whether input is required */
  required?: boolean
  /** Input type */
  inputType?: 'text' | 'password' | 'email' | 'number' | 'textarea'
  /** Minimum length for input */
  minLength?: number
  /** Maximum length for input */
  maxLength?: number
  /** Custom validation function */
  validate?: (value: string) => string | true
}

export interface AlertOptions extends Omit<ConfirmOptions, 'cancelText'> {
  /** Button text */
  buttonText?: string
}

export interface CustomDialogOptions<T = unknown> {
  /** Dialog title (optional for custom component) */
  title?: string
  /** Custom component to render */
  component: Component
  /** Props to pass to the component */
  props?: Record<string, unknown>
  /** Close on backdrop click */
  closeOnBackdrop?: boolean
  /** Close on escape key */
  closeOnEscape?: boolean
  /** Modal size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export interface DialogInstance {
  /** Unique dialog ID */
  id: string
  /** Dialog type */
  type: 'confirm' | 'prompt' | 'alert' | 'custom'
  /** Whether dialog is open */
  isOpen: boolean
  /** Resolve function */
  resolve: (value: unknown) => void
  /** Reject function */
  reject: (reason?: unknown) => void
}

// ============================================================================
// Global State
// ============================================================================

const dialogs = ref<DialogInstance[]>([])
const dialogContainer = ref<HTMLDivElement | null>(null)

// ============================================================================
// Helper Functions
// ============================================================================

function generateId(): string {
  return `dialog-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function getVariantConfig(variant: DialogVariant) {
  const configs: Record<DialogVariant, { 
    confirmColor: string
    icon: string
    iconColor: string
  }> = {
    default: {
      confirmColor: 'var(--s-primary, #3b82f6)',
      icon: 'help-circle',
      iconColor: 'text-blue-500'
    },
    danger: {
      confirmColor: '#ef4444',
      icon: 'alert-circle',
      iconColor: 'text-red-500'
    },
    warning: {
      confirmColor: '#f59e0b',
      icon: 'alert',
      iconColor: 'text-amber-500'
    },
    success: {
      confirmColor: '#10b981',
      icon: 'check-circle',
      iconColor: 'text-emerald-500'
    },
    info: {
      confirmColor: '#3b82f6',
      icon: 'information',
      iconColor: 'text-blue-500'
    }
  }
  return configs[variant]
}

function ensureContainer(): HTMLDivElement {
  if (!dialogContainer.value) {
    dialogContainer.value = document.createElement('div')
    dialogContainer.value.id = 'saka-dialog-container'
    document.body.appendChild(dialogContainer.value)
  }
  return dialogContainer.value
}

function removeDialog(id: string) {
  const index = dialogs.value.findIndex(d => d.id === id)
  if (index !== -1) {
    dialogs.value.splice(index, 1)
  }
}

// ============================================================================
// Dialog Component (Inline)
// ============================================================================

interface DialogContentProps {
  id: string
  type: 'confirm' | 'prompt' | 'alert' | 'custom'
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  buttonText?: string
  variant: DialogVariant
  icon?: string | boolean
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
  // Prompt specific
  placeholder?: string
  defaultValue?: string
  required?: boolean
  inputType?: string
  minLength?: number
  maxLength?: number
  validate?: (value: string) => string | true
  // Custom specific
  component?: Component
  componentProps?: Record<string, unknown>
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  // Callbacks
  onConfirm: (value?: string) => void
  onCancel: () => void
}

function createDialogVNode(props: DialogContentProps): VNode {
  const variantConfig = getVariantConfig(props.variant)
  
  // Size classes
  const sizeClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  }[props.size || 'sm']

  // Icon to display
  const displayIcon = props.icon === false ? null : 
    (typeof props.icon === 'string' ? props.icon : variantConfig.icon)

  return h('div', {
    class: 'fixed inset-0 z-[10000] flex items-center justify-center p-4',
    onClick: (e: MouseEvent) => {
      if (props.closeOnBackdrop && e.target === e.currentTarget) {
        props.onCancel()
      }
    },
    onKeydown: (e: KeyboardEvent) => {
      if (props.closeOnEscape && e.key === 'Escape') {
        props.onCancel()
      }
    }
  }, [
    // Backdrop
    h('div', {
      class: 'absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm',
      'aria-hidden': 'true'
    }),
    // Dialog panel
    h('div', {
      class: `relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full ${sizeClasses} overflow-hidden animate-dialog-enter`,
      role: 'dialog',
      'aria-modal': 'true',
      'aria-labelledby': `dialog-title-${props.id}`
    }, [
      // Content wrapper
      h('div', { class: 'p-6' }, [
        // Icon and title row
        h('div', { class: 'flex items-start gap-4' }, [
          // Icon
          displayIcon ? h('div', {
            class: `flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              props.variant === 'danger' ? 'bg-red-100 dark:bg-red-900/30' :
              props.variant === 'warning' ? 'bg-amber-100 dark:bg-amber-900/30' :
              props.variant === 'success' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
              'bg-blue-100 dark:bg-blue-900/30'
            }`
          }, [
            h('span', {
              class: `mdi mdi-${displayIcon} text-xl ${variantConfig.iconColor}`
            })
          ]) : null,
          // Title and description
          h('div', { class: 'flex-1 min-w-0' }, [
            props.title ? h('h3', {
              id: `dialog-title-${props.id}`,
              class: 'text-lg font-semibold text-slate-900 dark:text-white'
            }, props.title) : null,
            props.description ? h('p', {
              class: 'mt-2 text-sm text-slate-600 dark:text-slate-400'
            }, props.description) : null,
            // Prompt input
            props.type === 'prompt' ? h('div', { class: 'mt-4' }, [
              h('input', {
                type: props.inputType || 'text',
                class: 'w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                placeholder: props.placeholder || '',
                value: props.defaultValue || '',
                id: `dialog-input-${props.id}`,
                minlength: props.minLength,
                maxlength: props.maxLength,
                required: props.required,
                autofocus: true
              })
            ]) : null,
            // Custom component
            props.type === 'custom' && props.component ? h('div', { class: 'mt-4' }, [
              h(props.component, {
                ...props.componentProps,
                onConfirm: props.onConfirm,
                onCancel: props.onCancel
              })
            ]) : null
          ])
        ])
      ]),
      // Actions (not for custom dialogs without buttons)
      props.type !== 'custom' ? h('div', {
        class: 'flex justify-end gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700'
      }, [
        // Cancel button (not for alert)
        props.type !== 'alert' ? h('button', {
          class: 'px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors',
          onClick: props.onCancel
        }, props.cancelText || 'Cancel') : null,
        // Confirm button
        h('button', {
          class: 'px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors',
          style: { backgroundColor: variantConfig.confirmColor },
          onClick: () => {
            if (props.type === 'prompt') {
              const input = document.getElementById(`dialog-input-${props.id}`) as HTMLInputElement
              const value = input?.value || ''
              
              // Validate if required
              if (props.required && !value.trim()) {
                input?.focus()
                return
              }
              
              // Custom validation
              if (props.validate) {
                const result = props.validate(value)
                if (result !== true) {
                  // Show error (could be enhanced)
                  input?.focus()
                  return
                }
              }
              
              props.onConfirm(value)
            } else {
              props.onConfirm()
            }
          }
        }, props.type === 'alert' 
          ? (props.buttonText || 'OK')
          : (props.confirmText || 'Confirm')
        )
      ]) : null
    ])
  ])
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Dialog composable for programmatic dialogs
 * 
 * @example
 * const dialog = useDialog()
 * 
 * // Confirm dialog
 * const confirmed = await dialog.confirm({
 *   title: 'Delete Item',
 *   description: 'Are you sure?',
 *   variant: 'danger'
 * })
 * 
 * // Prompt dialog
 * const name = await dialog.prompt({
 *   title: 'Enter Name',
 *   placeholder: 'John Doe'
 * })
 * 
 * // Alert dialog
 * await dialog.alert({
 *   title: 'Success',
 *   description: 'Operation completed!'
 * })
 */
export function useDialog() {
  /**
   * Show a confirm dialog
   * @returns Promise that resolves to true (confirmed) or false (cancelled)
   */
  function confirm(options: ConfirmOptions): Promise<boolean> {
    return new Promise((resolve) => {
      const id = generateId()
      const container = ensureContainer()
      
      const instance: DialogInstance = reactive({
        id,
        type: 'confirm',
        isOpen: true,
        resolve: resolve as (value: unknown) => void,
        reject: () => resolve(false)
      })
      
      dialogs.value.push(instance)
      
      const cleanup = () => {
        removeDialog(id)
        render(null, container)
      }
      
      const vnode = createDialogVNode({
        id,
        type: 'confirm',
        title: options.title,
        description: options.description,
        confirmText: options.confirmText ?? 'Confirm',
        cancelText: options.cancelText ?? 'Cancel',
        variant: options.variant ?? 'default',
        icon: options.icon,
        closeOnBackdrop: options.closeOnBackdrop ?? true,
        closeOnEscape: options.closeOnEscape ?? true,
        onConfirm: () => {
          cleanup()
          resolve(true)
        },
        onCancel: () => {
          cleanup()
          resolve(false)
        }
      })
      
      render(vnode, container)
    })
  }

  /**
   * Show a prompt dialog
   * @returns Promise that resolves to the entered value or null if cancelled
   */
  function prompt(options: PromptOptions): Promise<string | null> {
    return new Promise((resolve) => {
      const id = generateId()
      const container = ensureContainer()
      
      const instance: DialogInstance = reactive({
        id,
        type: 'prompt',
        isOpen: true,
        resolve: resolve as (value: unknown) => void,
        reject: () => resolve(null)
      })
      
      dialogs.value.push(instance)
      
      const cleanup = () => {
        removeDialog(id)
        render(null, container)
      }
      
      const vnode = createDialogVNode({
        id,
        type: 'prompt',
        title: options.title,
        description: options.description,
        confirmText: options.confirmText ?? 'Submit',
        cancelText: options.cancelText ?? 'Cancel',
        variant: options.variant ?? 'default',
        icon: options.icon,
        closeOnBackdrop: options.closeOnBackdrop ?? true,
        closeOnEscape: options.closeOnEscape ?? true,
        placeholder: options.placeholder,
        defaultValue: options.defaultValue,
        required: options.required,
        inputType: options.inputType,
        minLength: options.minLength,
        maxLength: options.maxLength,
        validate: options.validate,
        onConfirm: (value?: string) => {
          cleanup()
          resolve(value ?? null)
        },
        onCancel: () => {
          cleanup()
          resolve(null)
        }
      })
      
      render(vnode, container)
    })
  }

  /**
   * Show an alert dialog (single button)
   * @returns Promise that resolves when dismissed
   */
  function alert(options: AlertOptions): Promise<void> {
    return new Promise((resolve) => {
      const id = generateId()
      const container = ensureContainer()
      
      const instance: DialogInstance = reactive({
        id,
        type: 'alert',
        isOpen: true,
        resolve: resolve as (value: unknown) => void,
        reject: () => resolve()
      })
      
      dialogs.value.push(instance)
      
      const cleanup = () => {
        removeDialog(id)
        render(null, container)
      }
      
      const vnode = createDialogVNode({
        id,
        type: 'alert',
        title: options.title,
        description: options.description,
        buttonText: options.buttonText ?? 'OK',
        variant: options.variant ?? 'info',
        icon: options.icon,
        closeOnBackdrop: options.closeOnBackdrop ?? true,
        closeOnEscape: options.closeOnEscape ?? true,
        onConfirm: () => {
          cleanup()
          resolve()
        },
        onCancel: () => {
          cleanup()
          resolve()
        }
      })
      
      render(vnode, container)
    })
  }

  /**
   * Show a custom dialog
   * @returns Promise that resolves with the value passed to onConfirm
   */
  function custom<T = unknown>(options: CustomDialogOptions<T>): Promise<T | null> {
    return new Promise((resolve) => {
      const id = generateId()
      const container = ensureContainer()
      
      const instance: DialogInstance = reactive({
        id,
        type: 'custom',
        isOpen: true,
        resolve: resolve as (value: unknown) => void,
        reject: () => resolve(null)
      })
      
      dialogs.value.push(instance)
      
      const cleanup = () => {
        removeDialog(id)
        render(null, container)
      }
      
      const vnode = createDialogVNode({
        id,
        type: 'custom',
        title: options.title,
        variant: 'default',
        closeOnBackdrop: options.closeOnBackdrop ?? true,
        closeOnEscape: options.closeOnEscape ?? true,
        component: markRaw(options.component),
        componentProps: options.props,
        size: options.size ?? 'md',
        onConfirm: (value?: unknown) => {
          cleanup()
          resolve(value as T)
        },
        onCancel: () => {
          cleanup()
          resolve(null)
        }
      })
      
      render(vnode, container)
    })
  }

  /**
   * Close all open dialogs
   */
  function closeAll() {
    const container = dialogContainer.value
    if (container) {
      render(null, container)
    }
    dialogs.value = []
  }

  return {
    confirm,
    prompt,
    alert,
    custom,
    closeAll,
    // State (readonly)
    dialogs: readonly(dialogs)
  }
}

// ============================================================================
// Convenience exports
// ============================================================================

/** Shorthand for confirm dialog */
export async function confirm(options: ConfirmOptions | string): Promise<boolean> {
  const dialog = useDialog()
  if (typeof options === 'string') {
    return dialog.confirm({ title: options })
  }
  return dialog.confirm(options)
}

/** Shorthand for prompt dialog */
export async function prompt(options: PromptOptions | string): Promise<string | null> {
  const dialog = useDialog()
  if (typeof options === 'string') {
    return dialog.prompt({ title: options })
  }
  return dialog.prompt(options)
}

/** Shorthand for alert dialog */
export async function alertDialog(options: AlertOptions | string): Promise<void> {
  const dialog = useDialog()
  if (typeof options === 'string') {
    return dialog.alert({ title: options })
  }
  return dialog.alert(options)
}

export default useDialog
