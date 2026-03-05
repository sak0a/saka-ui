<script lang="ts">
/**
 * SDrawerTrigger - Button that triggers drawer open
 */
</script>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

import { inject } from 'vue'
import { SDrawerContextKey, type SDrawerContext } from './SDrawer.vue'

export interface Props {
  /** Disable the trigger */
  disabled?: boolean
  /** Render as child (passes click to first child) */
  asChild?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  asChild: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

// Note: Trigger typically doesn't need context, it's just a wrapper
// that emits events to be handled by parent
const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<template>
  <slot v-if="asChild" @click="handleClick" />
  <button
    v-else
    type="button"
    v-bind="$attrs"
    :disabled="disabled"
    class="s-drawer-trigger"
    @click="handleClick"
  >
    <slot />
  </button>
</template>
