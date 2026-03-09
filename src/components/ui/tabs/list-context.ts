import { type InjectionKey, type Ref } from 'vue'
import type { TabType } from './context'

export interface STabsListContext {
  listRef: Ref<HTMLElement | null>
  type: Ref<TabType>
  triggerRefs: Ref<Map<string | number, HTMLElement>>
  setTriggerRef: (name: string | number, el: HTMLElement | null) => void
}

export const STabsListContextKey: InjectionKey<STabsListContext> = Symbol('STabsListContext')
