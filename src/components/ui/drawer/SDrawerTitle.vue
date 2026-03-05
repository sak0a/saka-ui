<script lang="ts">
/**
 * SDrawerTitle - Drawer title component that automatically binds to ARIA
 */
</script>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

import { inject, computed } from 'vue'
import { SDrawerContextKey, type SDrawerContext } from './SDrawer.vue'

export interface Props {
  /** HTML tag to use */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div'
  /** Additional CSS class */
  titleClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  as: 'h2',
  titleClass: ''
})

const context = inject(SDrawerContextKey) as SDrawerContext

const tag = computed(() => props.as)
</script>

<template>
  <component
    :is="tag"
    v-bind="$attrs"
    :id="context?.titleId"
    class="text-lg font-semibold text-(--s-text-primary) tracking-tight"
    :class="titleClass"
  >
    <slot />
  </component>
</template>
