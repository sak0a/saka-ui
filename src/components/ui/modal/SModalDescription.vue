<script lang="ts">
/**
 * SModalDescription - Description element for modal
 * Automatically binds to ARIA describedby via context
 */
</script>

<script setup lang="ts">
import { inject } from 'vue'
import { SModalContextKey } from './SModal.vue'

export interface Props {
  /** HTML tag to use */
  as?: 'p' | 'span' | 'div'
  /** Additional class */
  descriptionClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  as: 'p',
  descriptionClass: ''
})

const context = inject(SModalContextKey)
</script>

<template>
  <component
    :is="as"
    :id="context?.descriptionId"
    class="s-modal-description text-sm text-(--s-text-secondary) leading-relaxed"
    :class="descriptionClass"
  >
    <slot />
  </component>
</template>
