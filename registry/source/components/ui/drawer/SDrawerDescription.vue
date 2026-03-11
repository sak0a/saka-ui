<script setup lang="ts">
/**
 * SDrawerDescription - Drawer description component that automatically binds to ARIA
 */
defineOptions({ inheritAttrs: false })

import { inject, computed } from 'vue'
import { cn } from '../../../lib/utils'
import { SDrawerContextKey, type SDrawerContext } from './context'

export interface Props {
  /** HTML tag to use */
  as?: 'p' | 'span' | 'div'
  /** Additional CSS class */
  descriptionClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  as: 'p',
  descriptionClass: ''
})

const context = inject(SDrawerContextKey) as SDrawerContext

const tag = computed(() => props.as)
</script>

<template>
  <component
    :is="tag"
    v-bind="$attrs"
    :id="context?.descriptionId"
    :class="cn('text-sm text-muted-foreground leading-relaxed', descriptionClass, $attrs.class ?? '')"
  >
    <slot />
  </component>
</template>
