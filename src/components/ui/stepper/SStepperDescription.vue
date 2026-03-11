<script setup lang="ts">
import { computed, inject } from 'vue'
import { cn } from '~/lib/utils'
import { SStepperContextKey, SStepperItemContextKey } from './context'

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
    small: 'text-[10px] leading-tight',
    medium: 'text-xs leading-tight',
    large: 'text-sm leading-tight',
  }
  return sizes[ctx?.size ?? 'medium']
})

// ─── Classes ────────────────────────────────────────────────────────────────────
const descClasses = computed(() =>
  cn(
    's-stepper-description',
    'block transition-colors duration-(--s-duration-normal) mt-0.5',
    sizeClasses.value,
    itemCtx?.state.value === 'error' ? 'text-error/70' : 'text-muted-foreground',
    props.class,
  ),
)
</script>

<template>
  <span
    v-bind="$attrs"
    :class="descClasses"
    :data-state="itemCtx?.state.value"
  >
    <slot />
  </span>
</template>
