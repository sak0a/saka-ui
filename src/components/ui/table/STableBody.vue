<script setup lang="ts">
/**
 * STableBody - Table body wrapper with animation support
 */
import { inject, computed } from 'vue'
import { SDataTableContextKey } from './index'

interface Props {
  /** Enable row animations */
  animate?: boolean
  /** Custom class for tbody */
  bodyClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  animate: undefined,
  bodyClass: ''
})

const context = inject(SDataTableContextKey)

const shouldAnimate = computed(() => {
  if (props.animate !== undefined) return props.animate
  return context?.animateRows ?? true
})

const prefersReducedMotion = typeof window !== 'undefined' 
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
  : false
</script>

<template>
  <TransitionGroup 
    v-if="shouldAnimate && !prefersReducedMotion"
    name="s-table-row"
    tag="tbody"
    :class="['s-table-body', bodyClass]"
  >
    <slot />
  </TransitionGroup>
  
  <tbody v-else :class="['s-table-body', bodyClass]">
    <slot />
  </tbody>
</template>

<style scoped>
/* Row Animation */
.s-table-row-enter-active,
.s-table-row-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.s-table-row-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.s-table-row-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.s-table-row-move {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
