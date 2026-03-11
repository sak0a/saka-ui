import type { InjectionKey } from 'vue'

export interface CardContext {
  variant: 'elevated' | 'outlined' | 'filled' | 'ghost' | 'glass'
  hoverable: boolean
  loading: boolean
  horizontal: boolean
}

export const cardContextKey = Symbol('cardContext') as InjectionKey<CardContext>

// Re-export components for convenience
export { default as SCard } from './SCard.vue'
export { default as SCardHeader } from './SCardHeader.vue'
export { default as SCardContent } from './SCardContent.vue'
export { default as SCardFooter } from './SCardFooter.vue'
export { default as SCardMedia } from './SCardMedia.vue'
export { default as SCardActions } from './SCardActions.vue'

// Glass Card
export { default as SGlassCard } from './SGlassCard.vue'

// Morphing Card exports
export { default as SMorphingCard } from './SMorphingCard.vue'
export { default as SMorphingCardTrigger } from './SMorphingCardTrigger.vue'
export { default as SMorphingCardContent } from './SMorphingCardContent.vue'
export { default as SMorphingCardImage } from './SMorphingCardImage.vue'
export { default as SMorphingCardTitle } from './SMorphingCardTitle.vue'
export { default as SMorphingCardDescription } from './SMorphingCardDescription.vue'
export { default as SMorphingCardClose } from './SMorphingCardClose.vue'

// Type exports
export type { SMorphingCardContext } from './morphing-context'
export { SMorphingCardContextKey } from './morphing-context'
