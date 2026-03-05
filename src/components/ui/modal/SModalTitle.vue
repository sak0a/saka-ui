<script lang="ts">
/**
 * SModalTitle - Title element for modal
 * Automatically binds to ARIA labelledby via context
 */
</script>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

import { inject } from 'vue'
import { SModalContextKey } from './SModal.vue'

export interface Props {
  /** HTML tag to use */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div'
  /** Additional class */
  titleClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  as: 'h2',
  titleClass: ''
})

const context = inject(SModalContextKey)
</script>

<template>
  <component
    :is="as"
    v-bind="$attrs"
    :id="context?.titleId"
    class="s-modal-title text-lg font-semibold text-(--s-text-primary) tracking-tight"
    :class="titleClass"
  >
    <slot />
  </component>
</template>
