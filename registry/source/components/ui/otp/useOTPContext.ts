import { inject } from 'vue'
import type { InjectionKey, Ref } from 'vue'
import type { SOTPMode, SOTPVisualDefaults } from './types'

export interface MorphData {
  from: string
  to: string
  progress: number
  phase: 'out' | 'in'
}

export interface SOTPContext {
  // Reactive state
  digits: Ref<string[]>
  activeIndex: Ref<number>
  isComplete: Ref<boolean>
  showSuccess: Ref<boolean>
  showError: Ref<boolean>
  animatingIndices: Ref<Set<number>>
  morphingIndices: Ref<Map<number, MorphData>>

  // Behavior props (readonly refs)
  maxlength: Readonly<Ref<number>>
  mode: Readonly<Ref<SOTPMode>>
  masked: Readonly<Ref<boolean>>
  disabled: Readonly<Ref<boolean>>
  readonly: Readonly<Ref<boolean>>
  loading: Readonly<Ref<boolean>>
  allowPaste: Readonly<Ref<boolean>>
  error: Readonly<Ref<string | boolean>>
  success: Readonly<Ref<string | boolean>>
  ariaLabel: Readonly<Ref<string>>

  // Visual defaults (SOTPSlot falls back to these)
  defaults: Readonly<Ref<SOTPVisualDefaults>>

  // Computed helpers
  inputPattern: Readonly<Ref<string>>
  inputMode: Readonly<Ref<'text' | 'numeric' | 'none' | 'search' | 'email' | 'tel' | 'url' | 'decimal'>>

  // Methods for SOTPSlot to call
  registerInput: (index: number, el: HTMLInputElement | null) => void
  handleInput: (event: Event, index: number) => void
  handleKeydown: (event: KeyboardEvent, index: number) => void
  handlePaste: (event: ClipboardEvent, index: number) => void
  handleFocus: (index: number) => void
  handleBlur: (index: number) => void
  focusInput: (index: number) => void
  startMorphAnimation: (index: number, from: string, to: string) => void
  getMorphStyle: (index: number) => Record<string, any>
  getDisplayChar: (index: number) => string
}

export const SOTP_INJECTION_KEY: InjectionKey<SOTPContext> = Symbol('SOTPContext')

export function useSOTPContext(): SOTPContext {
  const ctx = inject(SOTP_INJECTION_KEY)
  if (!ctx) {
    throw new Error('[saka-ui] SOTPSlot must be used inside an SOTP component.')
  }
  return ctx
}
