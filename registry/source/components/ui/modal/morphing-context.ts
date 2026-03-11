import { type InjectionKey, type Ref } from 'vue'

export interface SMorphingModalContext {
  isOpen: Ref<boolean>
  isExpanded: Ref<boolean>
  triggerRect: Ref<DOMRect | null>
  open: () => void
  close: () => void
  registerTrigger: (el: HTMLElement | null) => void
  uniqueId: string
}

export const SMorphingModalContextKey: InjectionKey<SMorphingModalContext> = Symbol('SMorphingModalContext')
