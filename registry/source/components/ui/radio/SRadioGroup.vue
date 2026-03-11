<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue'
import { cn } from '../../../lib/utils'
import SRadio from './SRadio.vue'

defineOptions({ inheritAttrs: false })

export interface RadioOption {
  value: any
  label: string
  disabled?: boolean
  icon?: string
}

export interface Props {
  modelValue?: any
  options?: RadioOption[]
  orientation?: 'horizontal' | 'vertical' | 'grid'
  size?: 'small' | 'medium' | 'large'
  color?: string
  variant?: 'default' | 'filled' | 'outlined' | 'button'
  disabled?: boolean
  gap?: 'tight' | 'normal' | 'loose'
  gridCols?: number
  name?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  options: () => [],
  orientation: 'vertical',
  size: 'medium',
  color: undefined,
  variant: 'default',
  disabled: false,
  gap: 'normal',
  gridCols: 3,
  name: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: any]
  'change': [value: any]
}>()

// Internal value for keyboard navigation
const internalValue = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  internalValue.value = val
})

// Provide values to child SRadio components
provide('radioGroupValue', computed(() => internalValue.value))
provide('radioGroupDisabled', props.disabled)
provide('radioGroupSize', props.size)
provide('radioGroupColor', props.color)
provide('radioGroupVariant', props.variant)
provide('radioGroupUpdate', (val: any) => {
  internalValue.value = val
  emit('update:modelValue', val)
  emit('change', val)
})

// Gap configurations
const gapConfig = computed(() => {
  const gaps = {
    tight: {
      horizontal: 'gap-2',
      vertical: 'gap-1',
      grid: 'gap-2'
    },
    normal: {
      horizontal: 'gap-4',
      vertical: 'gap-2',
      grid: 'gap-3'
    },
    loose: {
      horizontal: 'gap-6',
      vertical: 'gap-4',
      grid: 'gap-4'
    }
  }
  return gaps[props.gap]
})

// Layout classes
const layoutClass = computed(() => {
  switch (props.orientation) {
    case 'horizontal':
      return `flex flex-wrap items-center ${gapConfig.value.horizontal}`
    case 'grid':
      return `grid ${gapConfig.value.grid}`
    case 'vertical':
    default:
      return `flex flex-col ${gapConfig.value.vertical}`
  }
})

// Grid columns style
const gridStyle = computed(() => {
  if (props.orientation === 'grid') {
    return {
      gridTemplateColumns: `repeat(${props.gridCols}, minmax(0, 1fr))`
    }
  }
  return {}
})

// Keyboard navigation
const handleKeydown = (e: KeyboardEvent) => {
  if (!props.options?.length) return

  const currentIndex = props.options.findIndex(opt => opt.value === internalValue.value)
  let newIndex = currentIndex

  const isVertical = props.orientation === 'vertical'
  const isGrid = props.orientation === 'grid'

  switch (e.key) {
    case 'ArrowDown':
      if (isVertical || isGrid) {
        e.preventDefault()
        if (isGrid) {
          newIndex = Math.min(currentIndex + props.gridCols, props.options.length - 1)
        } else {
          newIndex = currentIndex < props.options.length - 1 ? currentIndex + 1 : 0
        }
      }
      break
    case 'ArrowUp':
      if (isVertical || isGrid) {
        e.preventDefault()
        if (isGrid) {
          newIndex = Math.max(currentIndex - props.gridCols, 0)
        } else {
          newIndex = currentIndex > 0 ? currentIndex - 1 : props.options.length - 1
        }
      }
      break
    case 'ArrowRight':
      e.preventDefault()
      newIndex = currentIndex < props.options.length - 1 ? currentIndex + 1 : 0
      break
    case 'ArrowLeft':
      e.preventDefault()
      newIndex = currentIndex > 0 ? currentIndex - 1 : props.options.length - 1
      break
  }

  // Skip disabled options
  while (props.options[newIndex]?.disabled && newIndex !== currentIndex) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      newIndex = newIndex > 0 ? newIndex - 1 : props.options.length - 1
    } else {
      newIndex = newIndex < props.options.length - 1 ? newIndex + 1 : 0
    }
  }

  if (newIndex !== currentIndex && !props.options[newIndex]?.disabled) {
    internalValue.value = props.options[newIndex].value
    emit('update:modelValue', props.options[newIndex].value)
    emit('change', props.options[newIndex].value)
  }
}
</script>

<template>
  <div
    v-bind="$attrs"
    role="radiogroup"
    :class="cn(
      's-radio-group',
      layoutClass,
      { 'opacity-(--s-opacity-disabled)': disabled }
    )"
    :style="gridStyle"
    @keydown="handleKeydown"
  >
    <!-- Render from options prop -->
    <SRadio
      v-for="option in options"
      :key="option.value"
      :value="option.value"
      :label="option.label"
      :disabled="option.disabled"
      :icon="option.icon"
      :name="name"
    />

    <!-- Or render slotted content -->
    <slot />
  </div>
</template>

<style scoped>
.s-radio-group {
  outline: none;
}
</style>
