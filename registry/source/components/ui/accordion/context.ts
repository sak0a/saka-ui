import { type InjectionKey, type Ref } from 'vue'

export type AccordionType = 'default' | 'bordered' | 'separated' | 'card' | 'minimal'
export type AccordionSize = 'sm' | 'md' | 'lg'
export type IconPlacement = 'left' | 'right'

export interface AccordionItemInfo {
  name: string | number
  disabled?: boolean
}

export interface SAccordionContext {
  activeItems: Ref<Set<string | number>>
  type: AccordionType
  size: AccordionSize
  multiple: boolean
  collapsible: boolean
  iconPlacement: IconPlacement
  iconRotation: number
  animated: boolean
  divider: boolean
  dense: boolean
  color: string
  registerItem: (item: AccordionItemInfo) => void
  unregisterItem: (name: string | number) => void
  toggleItem: (name: string | number) => void
  isExpanded: (name: string | number) => boolean
}

export const SAccordionContextKey: InjectionKey<SAccordionContext> = Symbol('SAccordionContext')

export interface SAccordionItemContext {
  isExpanded: Ref<boolean>
  disabled: Ref<boolean>
  toggle: () => void
  contentRef: Ref<HTMLElement | null>
  contentHeight: Ref<number>
  updateContentHeight: () => void
  shouldRender: Ref<boolean>
  contentWrapperStyle: Ref<Record<string, string>>
  sizeConfig: Ref<{ header: string; title: string; subtitle: string; icon: string; content: string; expandIcon: string }>
  accordionContext: SAccordionContext | undefined
}

export const SAccordionItemContextKey: InjectionKey<SAccordionItemContext> = Symbol('SAccordionItemContext')
