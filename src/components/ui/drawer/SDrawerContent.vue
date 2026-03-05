<script lang="ts">
/**
 * SDrawerContent - Scrollable drawer content area
 */
</script>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

import { cn } from '~/lib/utils'

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
    :class="cn(
      's-drawer-content flex-1',
      paddingClasses[padding],
      centered ? 'flex flex-col items-center justify-center text-center' : '',
      scrollable ? 'overflow-y-auto overscroll-contain' : 'overflow-hidden',
      contentClass,
      $attrs.class ?? ''
    )"
    :style="maxHeight ? { maxHeight } : {}"
  >
    <slot />
  </div>
</template>

<style scoped>
.s-drawer-content {
  scrollbar-width: thin;
  scrollbar-color: var(--s-border) transparent;
}

.s-drawer-content::-webkit-scrollbar {
  width: 6px;
}

.s-drawer-content::-webkit-scrollbar-track {
  background: transparent;
}

.s-drawer-content::-webkit-scrollbar-thumb {
  background: var(--s-border);
  border-radius: 3px;
}

.s-drawer-content::-webkit-scrollbar-thumb:hover {
  background: var(--s-input);
}
</style>
