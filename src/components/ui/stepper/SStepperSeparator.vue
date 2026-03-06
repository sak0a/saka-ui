<script setup lang="ts">
import { computed, inject, type CSSProperties } from 'vue'
import { cn } from '~/lib/utils'
import { SStepperContextKey } from './SStepper.vue'
import { SStepperItemContextKey } from './SStepperItem.vue'

// ─── Props ──────────────────────────────────────────────────────────────────────
export interface Props {
  class?: string
}

defineOptions({ inheritAttrs: false })

const props = defineProps<Props>()

// ─── Context ────────────────────────────────────────────────────────────────────
const ctx = inject(SStepperContextKey)
const itemCtx = inject(SStepperItemContextKey)

// ─── State ──────────────────────────────────────────────────────────────────────
const isCompleted = computed(() => itemCtx?.state.value === 'completed')
const isVertical = computed(() => ctx?.orientation === 'vertical')
const isLineVariant = computed(() => ctx?.variant === 'line')

// ─── Color Style ────────────────────────────────────────────────────────────────
const colorStyle = computed<CSSProperties | undefined>(() => {
  if (!ctx?.color) return undefined
  if (isCompleted.value) {
    return { backgroundColor: ctx.color }
  }
  return undefined
})

// ─── Classes ────────────────────────────────────────────────────────────────────
const separatorClasses = computed(() => {
  if (isLineVariant.value) {
    // Line variant: horizontal line positioned between indicators on the track
    // Absolutely positioned from center of this indicator to center of next
    const sizeOffset: Record<string, string> = {
      small: 'top-3.5',   // h-7/2
      medium: 'top-[18px]', // h-9/2
      large: 'top-[22px]', // h-11/2
    }
    return cn(
      's-stepper-separator',
      'absolute left-1/2 right-[-50%] transition-all duration-500',
      'h-0.5',
      sizeOffset[ctx?.size ?? 'medium'],
      !ctx?.color && {
        'bg-primary': isCompleted.value,
        'bg-border': !isCompleted.value,
      },
      props.class,
    )
  }

  if (isVertical.value) {
    // Vertical: line going down alongside content
    return cn(
      's-stepper-separator',
      'transition-all duration-500',
      'w-0.5 flex-1 min-h-4',
      !ctx?.color && {
        'bg-primary': isCompleted.value,
        'bg-border': !isCompleted.value,
      },
      props.class,
    )
  }

  // Default horizontal: line between steps
  const sizeMap: Record<string, string> = {
    small: 'h-0.5 mx-1.5',
    medium: 'h-0.5 mx-2',
    large: 'h-0.5 mx-3',
  }

  return cn(
    's-stepper-separator',
    'transition-all duration-500 flex-1 shrink-0',
    sizeMap[ctx?.size ?? 'medium'],
    !ctx?.color && {
      'bg-primary': isCompleted.value,
      'bg-border': !isCompleted.value,
    },
    props.class,
  )
})
</script>

<template>
  <div
    v-bind="$attrs"
    :class="separatorClasses"
    :style="colorStyle"
    :data-state="itemCtx?.state.value"
    :data-orientation="ctx?.orientation"
    :data-variant="ctx?.variant"
    role="separator"
    aria-hidden="true"
  />
</template>
