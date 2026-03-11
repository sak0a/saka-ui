import { type InjectionKey, type Ref } from 'vue'
import type { IconProp } from '../../../lib/icon'

export type TabType = 'line' | 'card' | 'segment' | 'bar' | 'chip'
export type TabSize = 'small' | 'medium' | 'large'
export type TabPlacement = 'top' | 'left' | 'right' | 'bottom'
export type TabJustify = 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'

export interface TabPaneInfo {
  name: string | number
  tab: string
  icon?: IconProp
  disabled?: boolean
  closable?: boolean
  tabClass?: string
}

export interface STabsContext {
  activeTab: Ref<string | number>
  type: TabType
  size: TabSize
  placement: TabPlacement
  animated: boolean
  closable: boolean
  barColor: string
  justifyContent: TabJustify
  trigger: 'click' | 'hover'
  registerPane: (pane: TabPaneInfo) => void
  unregisterPane: (name: string | number) => void
  setActiveTab: (name: string | number) => void
  setListRef: (el: HTMLElement) => void
}

export const STabsContextKey: InjectionKey<STabsContext> = Symbol('STabsContext')
