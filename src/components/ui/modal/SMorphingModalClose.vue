<script setup lang="ts">
/**
 * SMorphingModalClose - Close button for morphing modal
 */
defineOptions({ inheritAttrs: false })

import { inject } from 'vue'
import { cn } from '~/lib/utils'
import { SMorphingModalContextKey } from './morphing-context'

export interface Props {
  /** Additional class */
  closeClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  closeClass: ''
})

const context = inject(SMorphingModalContextKey)

const handleClose = () => {
  context?.close()
}
</script>

<template>
  <button
    type="button"
    v-bind="$attrs"
    :class="cn('s-morphing-modal-close flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-150 outline-none focus:ring-2 focus:ring-primary/30', closeClass, $attrs.class ?? '')"
    aria-label="Close dialog"
    @click="handleClose"
  >
    <slot>
      <span class="mdi mdi-close text-xl" />
    </slot>
  </button>
</template>
