<script lang="ts">
/**
 * SDrawerDescription - Drawer description component that automatically binds to ARIA
 */
</script>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

import { inject, computed } from 'vue'
import { SDrawerContextKey, type SDrawerContext } from './SDrawer.vue'

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
    class="text-sm text-(--s-text-secondary) leading-relaxed"
    :class="descriptionClass"
  >
    <slot />
  </component>
</template>
