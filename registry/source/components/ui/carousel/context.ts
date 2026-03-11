import { type InjectionKey, type Ref } from 'vue'

export interface SlideInfo {
  index: number
  isActive: boolean
  isVisible: boolean
}

export interface SCarouselContext {
  registerSlide: (el: HTMLElement | null, index: number) => void
  unregisterSlide: (index: number) => void
  activeIndex: Ref<number>
  effect: string
  direction: string
  slidesPerView: number
}

export const SCarouselContextKey: InjectionKey<SCarouselContext> = Symbol('SCarouselContext')
