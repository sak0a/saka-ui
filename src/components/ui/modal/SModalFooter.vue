<script lang="ts">
/**
 * SModalFooter - Modal footer with action buttons
 */
</script>

<script setup lang="ts">
import { inject, onMounted, onBeforeUnmount } from 'vue'
import { SModalContextKey, type SModalContext } from './SModal.vue'

export interface Props {
  /** Button alignment */
  align?: 'left' | 'center' | 'right' | 'between' | 'stretch'
  /** Show divider line */
  divider?: boolean
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /** Gap between items */
  gap?: 'none' | 'sm' | 'md' | 'lg'
  /** Stack buttons vertically on mobile */
  stackOnMobile?: boolean
  /** Additional class */
  footerClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  align: 'right',
  divider: true,
  padding: 'md',
  gap: 'md',
  stackOnMobile: false,
  footerClass: ''
})

const context = inject(SModalContextKey) as SModalContext

const paddingClasses = {
  none: '',
  sm: 'px-4 py-3',
  md: 'px-6 py-4',
  lg: 'px-8 py-5'
}

const gapClasses = {
  none: '',
  sm: 'gap-2',
  md: 'gap-3',
  lg: 'gap-4'
}

const alignClasses = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
  between: 'justify-between',
  stretch: 'justify-stretch [&>*]:flex-1'
}

onMounted(() => {
  context?.setHasFooter(true)
})

onBeforeUnmount(() => {
  context?.setHasFooter(false)
})
</script>

<template>
  <div
    class="s-modal-footer flex items-center shrink-0"
    :class="[
      paddingClasses[padding],
      gapClasses[gap],
      alignClasses[align],
      divider ? 'border-t border-(--s-border)' : '',
      stackOnMobile ? 'max-sm:flex-col max-sm:items-stretch' : '',
      footerClass
    ]"
  >
    <slot />
  </div>
</template>

<style scoped>
.s-modal-footer {
  background: inherit;
}
</style>
