<script lang="ts">
import { type InjectionKey, type Ref } from 'vue'

// ─── Types ──────────────────────────────────────────────────────────────────────
export type StepperOrientation = 'horizontal' | 'vertical'
export type StepperSize = 'small' | 'medium' | 'large'
export type StepperVariant = 'default' | 'line'

export interface StepperItemInfo {
  step: number
  disabled: boolean
  loading: boolean
  error: boolean
  optional: boolean
}

export interface SStepperContext {
  modelValue: Ref<number>
  orientation: StepperOrientation
  variant: StepperVariant
  linear: boolean
  size: StepperSize
  color: string
  animated: boolean
  clickable: boolean
  totalSteps: Ref<number>
  completedSteps: Ref<Set<number>>
  items: Ref<Map<number, StepperItemInfo>>
  registerItem: (item: StepperItemInfo) => void
  unregisterItem: (step: number) => void
  setStep: (step: number) => void
  markCompleted: (step: number) => void
  unmarkCompleted: (step: number) => void
  isCompleted: (step: number) => boolean
  isActive: (step: number) => boolean
  getState: (step: number) => 'active' | 'completed' | 'inactive' | 'error' | 'loading'
  canNavigateTo: (step: number) => boolean
}

export const SStepperContextKey: InjectionKey<SStepperContext> = Symbol('SStepperContext')
</script>

<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue'
import { cn } from '~/lib/utils'

// ─── Props ──────────────────────────────────────────────────────────────────────
export interface Props {
  modelValue?: number
  defaultValue?: number
  orientation?: StepperOrientation
  variant?: StepperVariant
  linear?: boolean
  size?: StepperSize
  color?: string
  animated?: boolean
  clickable?: boolean
  class?: string
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  defaultValue: 1,
  orientation: 'horizontal',
  variant: 'default',
  linear: true,
  size: 'medium',
  color: undefined,
  animated: true,
  clickable: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
  'change': [value: number, oldValue: number]
}>()

// ─── State ──────────────────────────────────────────────────────────────────────
const items = ref<Map<number, StepperItemInfo>>(new Map())
const completedSteps = ref<Set<number>>(new Set())
const internalValue = ref(props.defaultValue)

const activeStep = computed({
  get: () => props.modelValue ?? internalValue.value,
  set: (val: number) => {
    const old = activeStep.value
    internalValue.value = val
    emit('update:modelValue', val)
    if (old !== val) {
      emit('change', val, old)
    }
  },
})

watch(
  () => props.modelValue,
  (val) => {
    if (val !== undefined) internalValue.value = val
  },
)

const totalSteps = computed(() => items.value.size)

// ─── Methods ────────────────────────────────────────────────────────────────────
const registerItem = (item: StepperItemInfo) => {
  items.value.set(item.step, item)
}

const unregisterItem = (step: number) => {
  items.value.delete(step)
}

const canNavigateTo = (step: number) => {
  if (!props.clickable) return false

  const targetItem = items.value.get(step)
  // Can never navigate to a disabled step
  if (targetItem?.disabled) return false

  // Non-linear: any non-disabled step is reachable
  if (!props.linear) return true

  // Linear: going backward is always allowed
  if (step < activeStep.value) return true

  // Linear: staying on current step
  if (step === activeStep.value) return true

  // Linear: going forward — check that no step between current and target
  // is in an error, loading, or disabled state (those block progression)
  const sorted = sortedSteps.value
  const currentIdx = sorted.indexOf(activeStep.value)
  const targetIdx = sorted.indexOf(step)
  for (let i = currentIdx; i < targetIdx; i++) {
    const s = sorted[i]
    const info = items.value.get(s)
    if (info?.error) return false
    if (info?.loading) return false
    if (info?.disabled) return false
    // In linear mode, each step before target must be completed
    if (!completedSteps.value.has(s) && s !== activeStep.value && !(s < activeStep.value)) return false
  }

  return true
}

const setStep = (step: number) => {
  if (!canNavigateTo(step)) return
  activeStep.value = step
}

const markCompleted = (step: number) => {
  completedSteps.value.add(step)
}

const unmarkCompleted = (step: number) => {
  completedSteps.value.delete(step)
}

const isCompleted = (step: number) => completedSteps.value.has(step)
const isActive = (step: number) => activeStep.value === step

const getState = (step: number): 'active' | 'completed' | 'inactive' | 'error' | 'loading' => {
  const item = items.value.get(step)
  if (item?.loading) return 'loading'
  if (item?.error) return 'error'
  if (isActive(step)) return 'active'
  // A step is completed if explicitly marked AND before active step,
  // or in linear mode any step before active is auto-completed
  if (step < activeStep.value && (isCompleted(step) || props.linear)) return 'completed'
  // Non-linear: explicitly completed steps after active can still show completed
  if (!props.linear && isCompleted(step)) return 'completed'
  return 'inactive'
}

// ─── Navigation helpers ─────────────────────────────────────────────────────────
const sortedSteps = computed(() =>
  [...items.value.keys()].sort((a, b) => a - b),
)

const activeIndex = computed(() =>
  sortedSteps.value.indexOf(activeStep.value),
)

const nextStep = () => {
  if (!canGoNext.value) return
  markCompleted(activeStep.value)
  activeStep.value = sortedSteps.value[activeIndex.value + 1]
}

const prevStep = () => {
  // Going back is always allowed (user needs to fix errors)
  if (!canGoPrev.value) return
  const target = sortedSteps.value[activeIndex.value - 1]
  // Unmark completed for all steps from target onward (going back invalidates them)
  for (const s of sortedSteps.value) {
    if (s >= target) completedSteps.value.delete(s)
  }
  activeStep.value = target
}

const goToStep = (step: number) => setStep(step)

// Whether forward/backward navigation is possible right now
const canGoNext = computed(() => {
  if (activeIndex.value >= sortedSteps.value.length - 1) return false
  const currentItem = items.value.get(activeStep.value)
  if (currentItem?.error || currentItem?.loading) return false
  const nextStepNum = sortedSteps.value[activeIndex.value + 1]
  const nextItem = items.value.get(nextStepNum)
  if (nextItem?.disabled) return false
  return true
})

const canGoPrev = computed(() => activeIndex.value > 0)

const isFirstStep = computed(() =>
  activeStep.value === sortedSteps.value[0],
)

const isLastStep = computed(() =>
  activeStep.value === sortedSteps.value[sortedSteps.value.length - 1],
)

// ─── Context ────────────────────────────────────────────────────────────────────
provide(SStepperContextKey, {
  modelValue: activeStep as Ref<number>,
  orientation: props.orientation,
  variant: props.variant,
  linear: props.linear,
  size: props.size,
  color: props.color ?? '',
  animated: props.animated,
  clickable: props.clickable,
  totalSteps,
  completedSteps,
  items,
  registerItem,
  unregisterItem,
  setStep,
  markCompleted,
  unmarkCompleted,
  isCompleted,
  isActive,
  getState,
  canNavigateTo,
})

// ─── Classes ────────────────────────────────────────────────────────────────────
const rootClasses = computed(() =>
  cn(
    's-stepper flex flex-col',
    props.class,
  ),
)
</script>

<template>
  <div
    v-bind="$attrs"
    :class="rootClasses"
    :data-orientation="orientation"
    :data-variant="variant"
    :data-linear="linear || undefined"
    role="group"
    aria-label="Progress"
  >
    <slot
      :model-value="activeStep"
      :total-steps="totalSteps"
      :is-first-step="isFirstStep"
      :is-last-step="isLastStep"
      :can-go-next="canGoNext"
      :can-go-prev="canGoPrev"
      :next-step="nextStep"
      :prev-step="prevStep"
      :go-to-step="goToStep"
      :is-completed="isCompleted"
      :is-active="isActive"
    />
  </div>
</template>
