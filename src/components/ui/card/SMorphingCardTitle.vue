<script setup lang="ts">
/**
 * SMorphingCardTitle - Title element for morphing card
 */
import { inject } from 'vue'
import { SMorphingCardContextKey } from './morphing-context'
import { cn } from '~/lib/utils'

defineOptions({ inheritAttrs: false })

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

const context = inject(SMorphingCardContextKey)
</script>

<template>
  <component
    :is="as"
    :id="`${context?.uniqueId}-title`"
    v-bind="$attrs"
    :class="cn('s-morphing-card-title text-xl font-semibold text-foreground tracking-tight', titleClass)"
  >
    <slot />
  </component>
</template>
