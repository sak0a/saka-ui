<script setup lang="ts">
import { computed, inject } from 'vue'
import { cn } from '~/lib/utils'
import { cardContextKey, type CardContext } from './index'

defineOptions({ inheritAttrs: false })

export interface Props {
  /** Show divider above footer */
  divider?: boolean
  /** Justify content */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  /** Alignment */
  align?: 'start' | 'center' | 'end' | 'stretch'
  /** Gap between items */
  gap?: 'none' | 'sm' | 'md' | 'lg'
  /** Custom padding */
  padding?: string
  /** Stack items vertically on mobile */
  stackOnMobile?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  divider: false,
  justify: 'end',
  align: 'center',
  gap: 'md',
  padding: undefined,
  stackOnMobile: false
})

// Card context available for future enhancements
inject(cardContextKey, {
  variant: 'elevated',
  hoverable: false,
  loading: false,
  horizontal: false
} as CardContext)

const justifyClasses = computed(() => {
  const justifications = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  }
  return justifications[props.justify]
})

const alignClasses = computed(() => {
  const alignments = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  }
  return alignments[props.align]
})

const gapClasses = computed(() => {
  const gaps = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4'
  }
  return gaps[props.gap]
})

const computedStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.padding) style.padding = props.padding
  return style
})
</script>

<template>
  <div
    v-bind="$attrs"
    :class="cn(
      's-card-footer flex flex-wrap',
      justifyClasses,
      alignClasses,
      gapClasses,
      {
        'pt-4 mt-4 border-t border-border': divider,
        'flex-col sm:flex-row': stackOnMobile
      },
      ($attrs.class as string)
    )"
    :style="computedStyle"
  >
    <slot />
  </div>
</template>

<style scoped>
.s-card-footer {
  /* Inherits from parent */
}
</style>
