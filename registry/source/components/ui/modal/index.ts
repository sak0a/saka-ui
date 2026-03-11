// Modal Component Exports
export { default as SModal } from './SModal.vue'
export { default as SModalHeader } from './SModalHeader.vue'
export { default as SModalContent } from './SModalContent.vue'
export { default as SModalFooter } from './SModalFooter.vue'
export { default as SModalTrigger } from './SModalTrigger.vue'
export { default as SModalTitle } from './SModalTitle.vue'
export { default as SModalDescription } from './SModalDescription.vue'
export { default as SModalClose } from './SModalClose.vue'

// Morphing Modal Exports
export { default as SMorphingModal } from './SMorphingModal.vue'
export { default as SMorphingModalTrigger } from './SMorphingModalTrigger.vue'
export { default as SMorphingModalClose } from './SMorphingModalClose.vue'
export { default as SMorphingModalTitle } from './SMorphingModalTitle.vue'
export { default as SMorphingModalSubtitle } from './SMorphingModalSubtitle.vue'
export { default as SMorphingModalDescription } from './SMorphingModalDescription.vue'
export { default as SMorphingModalImage } from './SMorphingModalImage.vue'

// Type exports
export type {
  ModalSize,
  ModalVariant,
  ModalAnimation,
  ModalPosition,
  SModalContext
} from './context'

export { SModalContextKey } from './context'

export type { SMorphingModalContext } from './morphing-context'
export { SMorphingModalContextKey } from './morphing-context'
