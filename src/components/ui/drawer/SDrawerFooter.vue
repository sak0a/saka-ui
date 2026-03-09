<script setup lang="ts">
/**
 * SDrawerFooter - Drawer footer with action buttons
 */
defineOptions({ inheritAttrs: false })

import { inject, onMounted, onBeforeUnmount } from 'vue'
import { cn } from '~/lib/utils'
import { SDrawerContextKey, type SDrawerContext } from './SDrawer.vue'

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
  /** Sticky footer */
  sticky?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  align: 'right',
  divider: true,
  padding: 'md',
  gap: 'md',
  stackOnMobile: false,
  footerClass: '',
  sticky: false
})

const context = inject(SDrawerContextKey) as SDrawerContext

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
    v-bind="$attrs"
    :class="cn(
      's-drawer-footer flex items-center shrink-0',
      paddingClasses[padding],
      gapClasses[gap],
      alignClasses[align],
      divider ? 'border-t border-border' : '',
      stackOnMobile ? 'max-sm:flex-col max-sm:items-stretch' : '',
      sticky ? 'sticky bottom-0 z-10 bg-background' : '',
      footerClass,
      $attrs.class ?? ''
    )"
  >
    <slot />
  </div>
</template>

<style scoped>
.s-drawer-footer {
  background: inherit;
}
</style>
