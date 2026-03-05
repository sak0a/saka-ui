<script lang="ts">
/**
 * SModalClose - Close button for modal
 * Uses context to close the modal when clicked
 */
</script>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

import { inject } from 'vue'
import { SModalContextKey } from './SModal.vue'

export interface Props {
  /** Additional class */
  closeClass?: string
  /** Disable the button */
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  closeClass: '',
  disabled: false
})

const context = inject(SModalContextKey)

const handleClose = () => {
  if (!props.disabled) {
    context?.close()
  }
}
</script>

<template>
  <button
    type="button"
    v-bind="$attrs"
    class="s-modal-close flex items-center justify-center w-8 h-8 rounded-lg text-(--s-text-tertiary) hover:text-(--s-text-primary) hover:bg-(--s-bg-tertiary) transition-all duration-150 outline-none focus:ring-2 focus:ring-(--s-primary)/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-(--s-text-tertiary)"
    :class="closeClass"
    :disabled="disabled"
    aria-label="Close modal"
    @click="handleClose"
  >
    <slot>
      <span class="mdi mdi-close text-xl" />
    </slot>
  </button>
</template>
