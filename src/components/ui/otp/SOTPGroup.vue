<script setup lang="ts">
import type { SOTPGap } from './types'

defineOptions({ inheritAttrs: false })

interface Props {
  gap?: SOTPGap
}

const props = withDefaults(defineProps<Props>(), {
  gap: 'normal'
})

const gapClasses: Record<SOTPGap, string> = {
  tight: 'gap-1',
  normal: 'gap-2',
  wide: 'gap-4'
}
</script>

<template>
  <div
    v-bind="$attrs"
    class="s-otp-group flex items-center"
    :class="gapClasses[props.gap]"
  >
    <slot />
  </div>
</template>
