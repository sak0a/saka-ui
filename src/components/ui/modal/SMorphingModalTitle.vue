<script lang="ts">
/**
 * SMorphingModalTitle - Title element for morphing modal
 */
</script>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

import { inject } from 'vue'
import { cn } from '~/lib/utils'
import { SMorphingModalContextKey } from './SMorphingModal.vue'

export interface Props {
  /** Additional class */
  titleClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  titleClass: ''
})

const context = inject(SMorphingModalContextKey)
</script>

<template>
  <h2
    v-bind="$attrs"
    :id="`${context?.uniqueId}-title`"
    :class="cn('s-morphing-modal-title text-lg font-semibold text-foreground', titleClass, $attrs.class ?? '')"
  >
    <slot />
  </h2>
</template>
