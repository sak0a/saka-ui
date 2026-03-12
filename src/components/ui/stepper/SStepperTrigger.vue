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

if (!itemCtx) console.warn('[SStepperTrigger] Must be used inside SStepperItem')

// ─── Handlers ───────────────────────────────────────────────────────────────────
const handleClick = () => {
  if (itemCtx?.disabled.value) return
  if (!itemCtx?.canNavigate.value) return
  ctx?.setStep(itemCtx.step)
}

// ─── Size Config ────────────────────────────────────────────────────────────────
const sizeClasses = computed(() => {
  const isLine = ctx?.variant === 'line'
  if (isLine) {
    // Line variant: vertical stack, no horizontal padding
    const sizes: Record<string, string> = {
      sm: 'gap-1.5 p-1',
      md: 'gap-2 p-1.5',
      lg: 'gap-2.5 p-2',
    }
    return sizes[ctx?.size ?? 'md']
  }
  const sizes: Record<string, string> = {
    sm: 'gap-2 px-1.5 py-1',
    md: 'gap-3 px-2 py-1.5',
    lg: 'gap-3.5 px-2.5 py-2',
  }
  return sizes[ctx?.size ?? 'md']
})

// ─── Classes ────────────────────────────────────────────────────────────────────
const isLineVariant = computed(() => ctx?.variant === 'line')

const triggerClasses = computed(() =>
  cn(
    's-stepper-trigger',
    'flex rounded-lg',
    'transition-colors duration-(--s-duration-normal)',
    'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    sizeClasses.value,
    isLineVariant.value
      ? 'flex-col items-center text-center'
      : 'flex-row items-center',
    itemCtx?.canNavigate.value && !itemCtx?.disabled.value
      ? 'cursor-pointer hover:bg-accent/50'
      : '',
    itemCtx?.disabled.value
      ? 'opacity-(--s-opacity-disabled) cursor-not-allowed'
      : '',
    props.class,
  ),
)
</script>

<template>
  <button
    v-bind="$attrs"
    type="button"
    :class="triggerClasses"
    :data-state="itemCtx?.state.value"
    :data-variant="ctx?.variant"
    :aria-disabled="itemCtx?.disabled.value || !itemCtx?.canNavigate.value || undefined"
    :tabindex="itemCtx?.disabled.value ? -1 : 0"
    role="tab"
    :aria-selected="itemCtx?.state.value === 'active'"
    @click="handleClick"
  >
    <slot :state="itemCtx?.state.value ?? 'inactive'" />
  </button>
</template>
