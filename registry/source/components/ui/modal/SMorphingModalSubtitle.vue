<script setup lang="ts">
/**
 * SMorphingModalSubtitle - Subtitle element for morphing modal
 */
defineOptions({ inheritAttrs: false })

import { cn } from '../../../lib/utils'

export interface Props {
  /** Additional class */
  subtitleClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  subtitleClass: ''
})
</script>

<template>
  <p
    v-bind="$attrs"
    :class="cn('s-morphing-modal-subtitle text-sm text-muted-foreground', subtitleClass, $attrs.class ?? '')"
  >
    <slot />
  </p>
</template>
