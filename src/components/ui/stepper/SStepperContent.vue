<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue'
import { cn } from '~/lib/utils'
import { SStepperContextKey } from './SStepper.vue'

// ─── Props ──────────────────────────────────────────────────────────────────────
export interface Props {
  step: number
  forceMount?: boolean
  class?: string
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<Props>(), {
  forceMount: false,
})

// ─── Context ────────────────────────────────────────────────────────────────────
const ctx = inject(SStepperContextKey)

// ─── State ──────────────────────────────────────────────────────────────────────
const isActive = computed(() => ctx?.isActive(props.step) ?? false)
const direction = ref<'forward' | 'backward'>('forward')

watch(
  () => ctx?.modelValue.value,
  (newVal, oldVal) => {
    if (newVal !== undefined && oldVal !== undefined) {
      direction.value = newVal > oldVal ? 'forward' : 'backward'
    }
  },
)

// ─── Transition Name ────────────────────────────────────────────────────────────
const transitionName = computed(() => {
  if (!ctx?.animated) return ''
  return direction.value === 'forward'
    ? 's-stepper-forward'
    : 's-stepper-backward'
})

// ─── Classes ────────────────────────────────────────────────────────────────────
const contentClasses = computed(() =>
  cn(
    's-stepper-content',
    props.class,
  ),
)
</script>

<template>
  <Transition :name="transitionName" mode="out-in">
    <div
      v-if="isActive || forceMount"
      v-show="isActive"
      v-bind="$attrs"
      :key="step"
      :class="contentClasses"
      :data-state="isActive ? 'active' : 'inactive'"
      :data-orientation="ctx?.orientation"
      role="tabpanel"
    >
      <slot />
    </div>
  </Transition>
</template>

<style scoped>
/* Forward navigation (entering from right) */
.s-stepper-forward-enter-active {
  transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
              filter 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.s-stepper-forward-leave-active {
  transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
              filter 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
}

.s-stepper-forward-enter-from {
  opacity: 0;
  transform: translateX(16px) scale(0.98);
  filter: blur(4px);
}

.s-stepper-forward-leave-to {
  opacity: 0;
  transform: translateX(-12px) scale(0.98);
  filter: blur(4px);
}

/* Backward navigation (entering from left) */
.s-stepper-backward-enter-active {
  transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
              filter 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.s-stepper-backward-leave-active {
  transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
              filter 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
}

.s-stepper-backward-enter-from {
  opacity: 0;
  transform: translateX(-16px) scale(0.98);
  filter: blur(4px);
}

.s-stepper-backward-leave-to {
  opacity: 0;
  transform: translateX(12px) scale(0.98);
  filter: blur(4px);
}
</style>
