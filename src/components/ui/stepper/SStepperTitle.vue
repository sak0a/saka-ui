<script setup lang="ts">
import { computed, inject } from 'vue'
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

// ─── Size Config ────────────────────────────────────────────────────────────────
const sizeClasses = computed(() => {
  const sizes: Record<string, string> = {
    small: 'text-xs leading-tight',
    medium: 'text-sm leading-tight',
    large: 'text-base leading-tight',
  }
  return sizes[ctx?.size ?? 'medium']
})

// ─── Classes ────────────────────────────────────────────────────────────────────
const titleClasses = computed(() => {
  const state = itemCtx?.state.value ?? 'inactive'
  return cn(
    's-stepper-title',
    'block font-semibold transition-colors duration-200',
    sizeClasses.value,
    state === 'error' ? 'text-destructive' : '',
    state !== 'error' && state === 'inactive' ? 'text-muted-foreground' : '',
    state !== 'error' && state !== 'inactive' ? 'text-foreground' : '',
    props.class,
  )
})
</script>

<template>
  <span
    v-bind="$attrs"
    :class="titleClasses"
    :data-state="itemCtx?.state.value"
  >
    <slot />
  </span>
</template>
