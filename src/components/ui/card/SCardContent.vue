<script setup lang="ts">
import { computed, inject } from 'vue'
import { cn } from '~/lib/utils'
import { cardContextKey, type CardContext } from './index'

defineOptions({ inheritAttrs: false })

export interface Props {
  /** Custom padding */
  padding?: string
  /** Text alignment */
  align?: 'left' | 'center' | 'right' | 'justify'
  /** Make content scrollable with max height */
  maxHeight?: string
  /** Show skeleton loading state */
  skeleton?: boolean
  /** Number of skeleton lines */
  skeletonLines?: number
}

const props = withDefaults(defineProps<Props>(), {
  padding: undefined,
  align: 'left',
  maxHeight: undefined,
  skeleton: false,
  skeletonLines: 3
})

const cardContext = inject(cardContextKey, {
  variant: 'elevated',
  hoverable: false,
  loading: false,
  horizontal: false
} as CardContext)

const alignClasses = computed(() => {
  const alignments = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify'
  }
  return alignments[props.align]
})

const computedStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.padding) style.padding = props.padding
  if (props.maxHeight) {
    style.maxHeight = props.maxHeight
    style.overflowY = 'auto'
  }
  return style
})

// Generate random widths for skeleton lines
const skeletonWidths = computed(() => {
  const widths = ['100%', '80%', '90%', '70%', '85%', '75%', '95%']
  return Array.from({ length: props.skeletonLines }, (_, i) => 
    widths[i % widths.length]
  )
})
</script>

<template>
  <div
    v-bind="$attrs"
    :class="cn(
      's-card-content text-muted-foreground',
      alignClasses,
      ($attrs.class as string)
    )"
    :style="computedStyle"
  >
    <!-- Skeleton loading state -->
    <template v-if="skeleton || cardContext.loading">
      <div class="space-y-3 animate-pulse">
        <div 
          v-for="(width, index) in skeletonWidths" 
          :key="index"
          class="h-4 bg-accent rounded"
          :style="{ width }"
        />
      </div>
    </template>
    
    <!-- Normal content -->
    <template v-else>
      <slot />
    </template>
  </div>
</template>

<style scoped>
.s-card-content {
  line-height: 1.6;
}

/* Custom scrollbar for scrollable content */
.s-card-content::-webkit-scrollbar {
  width: 6px;
}

.s-card-content::-webkit-scrollbar-track {
  background: var(--s-accent);
  border-radius: 3px;
}

.s-card-content::-webkit-scrollbar-thumb {
  background: var(--s-input);
  border-radius: 3px;
}

.s-card-content::-webkit-scrollbar-thumb:hover {
  background: var(--s-muted-foreground);
}
</style>
