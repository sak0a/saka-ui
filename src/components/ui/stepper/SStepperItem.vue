<script lang="ts">
import { type InjectionKey, type Ref } from 'vue'

// ─── Types ──────────────────────────────────────────────────────────────────────
export interface SStepperItemContext {
  step: number
  state: Ref<'active' | 'completed' | 'inactive' | 'error' | 'loading'>
  disabled: Ref<boolean>
  loading: Ref<boolean>
  error: Ref<boolean>
  optional: Ref<boolean>
  canNavigate: Ref<boolean>
}

export const SStepperItemContextKey: InjectionKey<SStepperItemContext> = Symbol('SStepperItemContext')
</script>

<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, provide, watch } from 'vue'
import { cn } from '~/lib/utils'
import { SStepperContextKey } from './SStepper.vue'

// ─── Props ──────────────────────────────────────────────────────────────────────
export interface Props {
  step: number
  completed?: boolean
  disabled?: boolean
  loading?: boolean
  error?: boolean
  optional?: boolean
  class?: string
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<Props>(), {
  completed: undefined,
  disabled: false,
  loading: false,
  error: false,
  optional: false,
})

// ─── Context ────────────────────────────────────────────────────────────────────
const ctx = inject(SStepperContextKey)
if (!ctx) console.warn('[SStepperItem] Must be used inside SStepper')

// ─── Registration ───────────────────────────────────────────────────────────────
onMounted(() => {
  ctx?.registerItem({
    step: props.step,
    disabled: props.disabled,
    loading: props.loading,
    error: props.error,
    optional: props.optional,
  })
  if (props.completed) ctx?.markCompleted(props.step)
})

// Watch for prop changes and re-register
watch(
  () => [props.disabled, props.loading, props.error, props.optional],
  () => {
    ctx?.registerItem({
      step: props.step,
      disabled: props.disabled,
      loading: props.loading,
      error: props.error,
      optional: props.optional,
    })
  },
)

onUnmounted(() => {
  ctx?.unregisterItem(props.step)
})

// ─── Computed State ─────────────────────────────────────────────────────────────
const state = computed(() => {
  if (props.loading) return 'loading' as const
  if (props.error) return 'error' as const
  if (props.completed === true && !ctx?.isActive(props.step)) return 'completed' as const
  return ctx?.getState(props.step) ?? ('inactive' as const)
})

const isDisabled = computed(() => props.disabled)
const isLoading = computed(() => props.loading)
const isError = computed(() => props.error)
const isOptional = computed(() => props.optional)
const canNavigate = computed(() => ctx?.canNavigateTo(props.step) ?? false)

// ─── Provide item context to children ───────────────────────────────────────────
provide(SStepperItemContextKey, {
  step: props.step,
  state,
  disabled: isDisabled,
  loading: isLoading,
  error: isError,
  optional: isOptional,
  canNavigate,
})

// ─── Classes ────────────────────────────────────────────────────────────────────
const isLineVariant = computed(() => ctx?.variant === 'line')

const itemClasses = computed(() =>
  cn(
    's-stepper-item group',
    isLineVariant.value
      ? 'flex flex-col items-center flex-1 relative'
      : ctx?.orientation === 'vertical'
        ? 'flex flex-row gap-4'
        : 'flex flex-row items-center flex-1',
    props.class,
  ),
)
</script>

<template>
  <div
    v-bind="$attrs"
    :class="itemClasses"
    :data-state="state"
    :data-disabled="disabled || undefined"
    :data-orientation="ctx?.orientation"
    :data-variant="ctx?.variant"
  >
    <slot :state="state" />
  </div>
</template>
