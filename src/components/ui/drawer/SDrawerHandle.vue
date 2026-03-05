<script lang="ts">
/**
 * SDrawerHandle - Drag handle for swipe gestures
 */
</script>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

import { inject, computed } from 'vue'
import { SDrawerContextKey, type SDrawerContext } from './SDrawer.vue'

export interface Props {
  /** Size of the handle */
  size?: 'sm' | 'md' | 'lg'
  /** Custom class */
  handleClass?: string
  /** Show when dragging */
  showProgress?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  handleClass: '',
  showProgress: false
})

const context = inject(SDrawerContextKey) as SDrawerContext

const sizeClasses = computed(() => ({
  sm: 'w-8 h-1',
  md: 'w-12 h-1.5',
  lg: 'w-16 h-2'
}[props.size]))

const progressWidth = computed(() => {
  if (!props.showProgress || !context) return 0
  return Math.round(context.dragProgress.value * 100)
})
</script>

<template>
  <div
    v-bind="$attrs"
    class="s-drawer-handle flex items-center justify-center py-3 cursor-grab active:cursor-grabbing"
    :class="handleClass"
  >
    <div 
      class="relative rounded-full bg-(--s-text-tertiary)/30 transition-all duration-150 hover:bg-(--s-text-tertiary)/50"
      :class="[
        sizeClasses,
        context?.isDragging?.value ? 'bg-(--s-text-tertiary)/50 scale-110' : ''
      ]"
    >
      <!-- Progress indicator -->
      <div
        v-if="showProgress && context?.isDragging?.value"
        class="absolute inset-y-0 left-0 rounded-full bg-(--s-primary) transition-none"
        :style="{ width: `${progressWidth}%` }"
      />
    </div>
  </div>
</template>

<style scoped>
.s-drawer-handle {
  touch-action: none;
  user-select: none;
}

.s-drawer-handle:hover > div {
  animation: handle-pulse 1.5s ease-in-out infinite;
}

@keyframes handle-pulse {
  0%, 100% { transform: scaleX(1); }
  50% { transform: scaleX(1.08); }
}
</style>
