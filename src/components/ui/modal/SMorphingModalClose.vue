<script lang="ts">
/**
 * SMorphingModalClose - Close button for morphing modal
 */
</script>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

import { inject } from 'vue'
import { SMorphingModalContextKey } from './SMorphingModal.vue'

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
    class="s-morphing-modal-close flex items-center justify-center w-8 h-8 rounded-lg text-(--s-text-tertiary) hover:text-(--s-text-primary) hover:bg-(--s-bg-tertiary) transition-all duration-150 outline-none focus:ring-2 focus:ring-(--s-primary)/30"
    :class="closeClass"
    aria-label="Close dialog"
    @click="handleClose"
  >
    <slot>
      <span class="mdi mdi-close text-xl" />
    </slot>
  </button>
</template>
