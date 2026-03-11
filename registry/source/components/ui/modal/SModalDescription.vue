<script setup lang="ts">
/**
 * SModalDescription - Description element for modal
 * Automatically binds to ARIA describedby via context
 */
defineOptions({ inheritAttrs: false })

import { inject } from 'vue'
import { cn } from '../../../lib/utils'
import { SModalContextKey } from './context'

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
    v-bind="$attrs"
    :id="context?.descriptionId"
    :class="cn('s-modal-description text-sm text-muted-foreground leading-relaxed', descriptionClass, $attrs.class ?? '')"
  >
    <slot />
  </component>
</template>
