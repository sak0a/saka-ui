<script setup lang="ts">
import { computed, inject, type CSSProperties } from 'vue'
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
    small: 'h-7 w-7 text-xs',
    medium: 'h-9 w-9 text-sm',
    large: 'h-11 w-11 text-base',
  }
  return sizes[ctx?.size ?? 'medium']
})

// ─── Color Style ────────────────────────────────────────────────────────────────
const colorStyle = computed<CSSProperties | undefined>(() => {
  const state = itemCtx?.state.value
  if (state === 'error') return undefined // error uses destructive colors
  if (!ctx?.color) return undefined
  if (state === 'active' || state === 'completed') {
    return {
      backgroundColor: ctx.color,
      borderColor: ctx.color,
      color: '#fff',
    }
  }
  return undefined
})

// ─── Classes ────────────────────────────────────────────────────────────────────
const indicatorClasses = computed(() => {
  const state = itemCtx?.state.value ?? 'inactive'
  return cn(
    's-stepper-indicator',
    'relative z-10 inline-flex items-center justify-center rounded-full',
    'border-2 font-medium shrink-0',
    'transition-all duration-300',
    sizeClasses.value,
    // State-based colors (when no custom color)
    state === 'error' && 'bg-destructive border-destructive text-white',
    state === 'loading' && 'bg-muted border-primary text-primary animate-pulse',
    state !== 'error' && state !== 'loading' && !ctx?.color && (state === 'active' || state === 'completed')
      && 'bg-primary border-primary text-primary-foreground',
    state !== 'error' && state !== 'loading' && !ctx?.color && state === 'inactive'
      && 'bg-muted border-border text-muted-foreground',
    props.class,
  )
})
</script>

<template>
  <span
    v-bind="$attrs"
    :class="indicatorClasses"
    :style="colorStyle"
    :data-state="itemCtx?.state.value"
    aria-hidden="true"
  >
    <!-- Loading -->
    <template v-if="itemCtx?.state.value === 'loading'">
      <slot name="loading" :step="itemCtx?.step">
        <span class="mdi mdi-loading mdi-spin text-current" />
      </slot>
    </template>

    <!-- Error -->
    <template v-else-if="itemCtx?.state.value === 'error'">
      <slot name="error" :step="itemCtx?.step">
        <span class="mdi mdi-alert-circle text-current" />
      </slot>
    </template>

    <!-- Completed -->
    <template v-else-if="itemCtx?.state.value === 'completed'">
      <Transition v-if="ctx?.animated" name="s-stepper-check" mode="out-in">
        <slot name="completed" :step="itemCtx?.step">
          <span key="check" class="mdi mdi-check text-current" />
        </slot>
      </Transition>
      <slot v-else name="completed" :step="itemCtx?.step">
        <span class="mdi mdi-check text-current" />
      </slot>
    </template>

    <!-- Default: step number or custom content -->
    <template v-else>
      <Transition v-if="ctx?.animated" name="s-stepper-check" mode="out-in">
        <slot :step="itemCtx?.step">
          <span key="number">{{ itemCtx?.step }}</span>
        </slot>
      </Transition>
      <slot v-else :step="itemCtx?.step">
        <span>{{ itemCtx?.step }}</span>
      </slot>
    </template>
  </span>
</template>

<style scoped>
.s-stepper-check-enter-active,
.s-stepper-check-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.s-stepper-check-enter-from {
  opacity: 0;
  transform: scale(0.5);
}

.s-stepper-check-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
</style>
