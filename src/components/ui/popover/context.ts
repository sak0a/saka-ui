import type { InjectionKey, Ref } from 'vue'

export type PopoverPlacement =
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end'
  | 'right' | 'right-start' | 'right-end'

export type PopoverTrigger = 'click' | 'hover' | 'focus' | 'manual'
export type PopoverVariant = 'default' | 'glass' | 'bordered' | 'elevated'
export type PopoverAnimation = 'fade' | 'scale' | 'slide'
export type PopoverRounded = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'

export interface SPopoverContext {
  isOpen: Ref<boolean>
  open: () => void
  close: () => void
  toggle: () => void
  triggerId: string
  contentId: string
  triggerRef: Ref<HTMLElement | null>
  placement: PopoverPlacement
  variant: PopoverVariant
  animation: PopoverAnimation
  offset: number
  zIndex: number
  teleport: boolean | string
  rounded: PopoverRounded
  disabled: boolean
  closeOnClickOutside: boolean
  closeOnEscape: boolean
  trigger: PopoverTrigger
  showDelay: number
  hideDelay: number
  actualPlacement: Ref<PopoverPlacement>
}

export const SPopoverContextKey: InjectionKey<SPopoverContext> = Symbol('SPopoverContext')
