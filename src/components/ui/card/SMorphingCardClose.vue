<script lang="ts">
/**
 * SMorphingCardClose - Close button for morphing card
 */
</script>

<script setup lang="ts">
import { inject, computed } from 'vue'
import { SMorphingCardContextKey } from './SMorphingCard.vue'
import { cn } from '~/lib/utils'

defineOptions({ inheritAttrs: false })

export interface Props {
  /** Additional class */
  closeClass?: string
  /** Position of the close button */
  position?: 'top-right' | 'top-left' | 'inline'
  /** Button size */
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  closeClass: '',
  position: 'top-right',
  size: 'md'
})

const context = inject(SMorphingCardContextKey)

const isVisible = computed(() => context?.isExpanded.value ?? false)

const positionClasses = computed(() => {
  if (props.position === 'inline') return ''
  return {
    'top-right': 'absolute top-4 right-4',
    'top-left': 'absolute top-4 left-4'
  }[props.position]
})

const sizeClasses = computed(() => ({
  sm: 'w-7 h-7 text-lg',
  md: 'w-9 h-9 text-xl',
  lg: 'w-11 h-11 text-2xl'
}[props.size]))

const handleClose = () => {
  context?.close()
}
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-200 ease-out delay-300"
    enter-from-class="opacity-0 scale-75"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition-all duration-100 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-75"
  >
    <button
      v-if="isVisible"
      type="button"
      :class="cn('s-morphing-card-close flex items-center justify-center rounded-full bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:bg-muted border border-border/50 shadow-lg transition-all duration-150 outline-none focus:ring-2 focus:ring-primary/30 z-10', positionClasses, sizeClasses, closeClass)"
      aria-label="Close"
      @click="handleClose"
    >
      <slot>
        <span class="mdi mdi-close" />
      </slot>
    </button>
  </Transition>
</template>
