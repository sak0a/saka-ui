import { type InjectionKey, type Ref } from 'vue'

export type DrawerSide = 'left' | 'right' | 'top' | 'bottom'
export type DrawerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
export type DrawerVariant = 'default' | 'glass' | 'bordered' | 'elevated' | 'minimal'

export interface SDrawerContext {
  close: () => void
  isOpen: Ref<boolean>
  side: DrawerSide
  hasHeader: Ref<boolean>
  hasFooter: Ref<boolean>
  setHasHeader: (value: boolean) => void
  setHasFooter: (value: boolean) => void
  titleId: string
  descriptionId: string
  dragProgress: Ref<number>
  isDragging: Ref<boolean>
}

export const SDrawerContextKey: InjectionKey<SDrawerContext> = Symbol('SDrawerContext')
