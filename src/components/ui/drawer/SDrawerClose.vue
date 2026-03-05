<script lang="ts">
/**
 * SDrawerClose - Drawer close button that uses context
 */
</script>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

import { inject } from 'vue'
import { cn } from '~/lib/utils'
import { SDrawerContextKey, type SDrawerContext } from './SDrawer.vue'

export interface Props {
  /** Additional CSS class */
  closeClass?: string
  /** Disable the close button */
  disabled?: boolean
  /** Visual variant */
  variant?: 'default' | 'ghost' | 'subtle'
  /** Icon to display */
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  closeClass: '',
  disabled: false,
  variant: 'default',
  icon: 'close'
})

const context = inject(SDrawerContextKey) as SDrawerContext

const handleClose = () => {
  if (!props.disabled) {
    context?.close()
  }
}

const variantClasses = {
  default: 'text-muted-foreground hover:text-foreground hover:bg-accent',
  ghost: 'text-muted-foreground hover:text-foreground',
  subtle: 'text-muted-foreground hover:text-foreground hover:bg-muted'
}
</script>

<template>
  <button
    type="button"
    v-bind="$attrs"
    :class="cn(
      's-drawer-close flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-0',
      variantClasses[variant],
      disabled ? 'opacity-50 cursor-not-allowed' : '',
      closeClass,
      $attrs.class ?? ''
    )"
    :disabled="disabled"
    aria-label="Close drawer"
    @click="handleClose"
  >
    <span :class="`mdi mdi-${icon} text-xl`" />
  </button>
</template>
