import { type InjectionKey, type Ref } from 'vue'

export type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
export type ModalVariant = 'default' | 'glass' | 'bordered' | 'elevated'
export type ModalAnimation = 'fade' | 'scale' | 'slide-up' | 'slide-down' | 'zoom' | 'flip'
export type ModalPosition = 'center' | 'top' | 'bottom' | 'left' | 'right'

export interface SModalContext {
  close: () => void
  isOpen: Ref<boolean>
  size: ModalSize
  hasHeader: Ref<boolean>
  hasFooter: Ref<boolean>
  setHasHeader: (value: boolean) => void
  setHasFooter: (value: boolean) => void
  titleId: string
  descriptionId: string
}

export const SModalContextKey: InjectionKey<SModalContext> = Symbol('SModalContext')
