<script setup lang="ts">
/**
 * SMorphingModalDescription - Description content for morphing modal
 * Only visible when the modal is expanded
 */
defineOptions({ inheritAttrs: false })

import { inject, computed } from 'vue'
import { cn } from '../../../lib/utils'
import { SMorphingModalContextKey } from './morphing-context'

export interface Props {
  /** Additional class */
  descriptionClass?: string
  /** Disable layout animation */
  disableLayoutAnimation?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  descriptionClass: '',
  disableLayoutAnimation: false
})

const context = inject(SMorphingModalContextKey)

const isVisible = computed(() => context?.isExpanded.value ?? false)
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-(--s-duration-slow) ease-out delay-150"
    enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-150 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-2"
  >
    <div
      v-if="isVisible"
      v-bind="$attrs"
      :class="cn('s-morphing-modal-description text-muted-foreground', descriptionClass, $attrs.class ?? '')"
    >
      <slot />
    </div>
  </Transition>
</template>
