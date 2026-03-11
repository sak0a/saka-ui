<script setup lang="ts">
/**
 * SModalContent - Scrollable modal content area
 */
defineOptions({ inheritAttrs: false })

import { cn } from '../../../lib/utils'

export interface Props {
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  /** Center content */
  centered?: boolean
  /** Additional class */
  contentClass?: string
  /** Max height (enables scrolling) */
  maxHeight?: string
  /** Enable scrolling */
  scrollable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  padding: 'md',
  centered: false,
  contentClass: '',
  maxHeight: undefined,
  scrollable: true
})

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10'
}
</script>

<template>
  <div
    v-bind="$attrs"
    :class="cn('s-modal-content flex-1', paddingClasses[padding], centered ? 'flex flex-col items-center justify-center text-center' : '', scrollable ? 'overflow-y-auto overscroll-contain' : 'overflow-hidden', contentClass, $attrs.class ?? '')"
    :style="maxHeight ? { maxHeight } : {}"
  >
    <slot />
  </div>
</template>

<style scoped>
.s-modal-content {
  scrollbar-width: thin;
  scrollbar-color: var(--s-border) transparent;
}

.s-modal-content::-webkit-scrollbar {
  width: 6px;
}

.s-modal-content::-webkit-scrollbar-track {
  background: transparent;
}

.s-modal-content::-webkit-scrollbar-thumb {
  background: var(--s-border);
  border-radius: 3px;
}

.s-modal-content::-webkit-scrollbar-thumb:hover {
  background: var(--s-input);
}
</style>
