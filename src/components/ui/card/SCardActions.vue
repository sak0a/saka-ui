<script setup lang="ts">
import { computed, inject } from 'vue'
import { cardContextKey, type CardContext } from './index'

export interface Props {
  /** Justify content */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  /** Alignment */
  align?: 'start' | 'center' | 'end' | 'stretch'
  /** Gap between items */
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg'
  /** Direction */
  direction?: 'row' | 'column'
  /** Custom padding */
  padding?: string
  /** Full width buttons */
  fullWidth?: boolean
  /** Stack vertically on mobile */
  stackOnMobile?: boolean
  /** Reversed order */
  reverse?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  justify: 'start',
  align: 'center',
  gap: 'sm',
  direction: 'row',
  padding: undefined,
  fullWidth: false,
  stackOnMobile: false,
  reverse: false
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
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4'
  }
  return gaps[props.gap]
})

const directionClasses = computed(() => {
  if (props.stackOnMobile) {
    return props.direction === 'row' 
      ? (props.reverse ? 'flex-col-reverse sm:flex-row-reverse' : 'flex-col sm:flex-row')
      : (props.reverse ? 'flex-row-reverse sm:flex-col-reverse' : 'flex-row sm:flex-col')
  }
  
  const directions = {
    row: props.reverse ? 'flex-row-reverse' : 'flex-row',
    column: props.reverse ? 'flex-col-reverse' : 'flex-col'
  }
  return directions[props.direction]
})

const computedStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.padding) style.padding = props.padding
  return style
})
</script>

<template>
  <div 
    class="s-card-actions flex flex-wrap"
    :class="[
      justifyClasses,
      alignClasses,
      gapClasses,
      directionClasses,
      {
        'w-full': fullWidth
      }
    ]"
    :style="computedStyle"
  >
    <slot />
  </div>
</template>

<style scoped>
.s-card-actions {
  /* Inherits from parent */
}

/* Full width buttons inside */
.s-card-actions.w-full :deep(> *) {
  flex: 1;
}
</style>
