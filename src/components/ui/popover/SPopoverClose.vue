<script setup lang="ts">
/**
 * SPopoverClose - Close button for popover content
 */
defineOptions({ inheritAttrs: false })

import { inject } from 'vue'
import { cn } from '~/lib/utils'
import { SPopoverContextKey } from './context'

export interface Props {
  /** Disable the close button */
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const context = inject(SPopoverContextKey)

const handleClose = () => {
  if (!props.disabled) {
    context?.close()
    context?.triggerRef.value?.focus()
  }
}
</script>

<template>
  <button
    type="button"
    v-bind="$attrs"
    :class="cn(
      's-popover-close flex items-center justify-center w-7 h-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-(--s-duration-fast) outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-(--s-opacity-disabled) disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-muted-foreground',
      $attrs.class ?? ''
    )"
    :disabled="disabled"
    aria-label="Close popover"
    @click="handleClose"
  >
    <slot>
      <span class="mdi mdi-close text-lg" />
    </slot>
  </button>
</template>
