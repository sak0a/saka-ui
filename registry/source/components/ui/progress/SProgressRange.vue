<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { cn } from '../../../lib/utils'

defineOptions({ inheritAttrs: false })

export interface RangeValue {
  min: number
  max: number
}

export interface Props {
  // Core
  modelValue?: number | RangeValue
  min?: number
  max?: number
  step?: number
  range?: boolean // Enable dual-handle range mode
  
  // Visual
  size?: 'sm' | 'md' | 'lg'
  orientation?: 'horizontal' | 'vertical'
  rounded?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
  color?: string
  trackColor?: string
  activeTrackColor?: string
  handleColor?: string
  
  // Display
  showValue?: boolean
  showTooltip?: boolean
  tooltipPosition?: 'top' | 'bottom'
  showTicks?: boolean
  tickCount?: number
  showLabels?: boolean
  valueFormat?: (value: number) => string
  minLabel?: string
  maxLabel?: string
  label?: string
  
  // Behavior
  disabled?: boolean
  readonly?: boolean
  pushable?: number // Minimum distance between handles in range mode
  maxRange?: number // Maximum distance between handles in range mode
  swappable?: boolean // Allow handles to swap positions when crossing
  lazy?: boolean // Only emit on drag end
  marks?: { value: number; label?: string }[]
  snap?: boolean // Snap to marks/steps
  
  // Styling
  handleSize?: number
  trackHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  min: 0,
  max: 100,
  step: 1,
  range: false,
  size: 'md',
  orientation: 'horizontal',
  rounded: 'full',
  color: 'var(--s-primary)',
  trackColor: 'var(--s-accent)',
  activeTrackColor: undefined,
  handleColor: undefined,
  showValue: false,
  showTooltip: true,
  tooltipPosition: 'top',
  showTicks: false,
  tickCount: 5,
  showLabels: false,
  valueFormat: undefined,
  minLabel: undefined,
  maxLabel: undefined,
  label: undefined,
  disabled: false,
  readonly: false,
  pushable: 0,
  maxRange: undefined,
  swappable: true,
  lazy: false,
  marks: undefined,
  snap: false,
  handleSize: undefined,
  trackHeight: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: number | RangeValue]
  'change': [value: number | RangeValue]
  'drag-start': [handle: 'min' | 'max' | 'single']
  'drag-end': [value: number | RangeValue]
}>()

// Refs
const trackRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const activeHandle = ref<'min' | 'max' | 'single' | null>(null)
const hoverHandle = ref<'min' | 'max' | 'single' | null>(null)

// Internal values
const internalMin = ref(0)
const internalMax = ref(100)

// Initialize values
const initValues = () => {
  if (props.range && typeof props.modelValue === 'object') {
    internalMin.value = (props.modelValue as RangeValue).min
    internalMax.value = (props.modelValue as RangeValue).max
  } else if (typeof props.modelValue === 'number') {
    internalMin.value = props.modelValue
    internalMax.value = props.modelValue
  }
}

onMounted(() => {
  initValues()
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  document.addEventListener('touchmove', handleTouchMove, { passive: false })
  document.addEventListener('touchend', handleTouchEnd)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  document.removeEventListener('touchmove', handleTouchMove)
  document.removeEventListener('touchend', handleTouchEnd)
})

watch(() => props.modelValue, () => {
  if (!isDragging.value) {
    initValues()
  }
}, { deep: true })

// Computed
const sizeConfig = computed(() => {
  const sizes = {
    sm: { track: 4, handle: 14, fontSize: 'text-xs' },
    md: { track: 6, handle: 18, fontSize: 'text-sm' },
    lg: { track: 8, handle: 24, fontSize: 'text-base' }
  }
  return sizes[props.size]
})

const trackHeightValue = computed(() => props.trackHeight || sizeConfig.value.track)
const handleSizeValue = computed(() => props.handleSize || sizeConfig.value.handle)

const roundedClasses = computed(() => {
  const radii = {
    none: 'rounded-none',
    xs: 'rounded-xs',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    full: 'rounded-full'
  }
  return radii[props.rounded]
})

const valueToPercent = (value: number): number => {
  return ((value - props.min) / (props.max - props.min)) * 100
}

const percentToValue = (percent: number): number => {
  let value = (percent / 100) * (props.max - props.min) + props.min
  value = Math.round(value / props.step) * props.step
  return Math.min(Math.max(value, props.min), props.max)
}

const minPercent = computed(() => valueToPercent(internalMin.value))
const maxPercent = computed(() => valueToPercent(internalMax.value))

const formatValue = (value: number): string => {
  if (props.valueFormat) return props.valueFormat(value)
  return value.toString()
}

// Calculate ticks
const ticks = computed(() => {
  if (!props.showTicks && !props.marks) return []
  
  if (props.marks) {
    return props.marks.map(mark => ({
      value: mark.value,
      percent: valueToPercent(mark.value),
      label: mark.label || formatValue(mark.value)
    }))
  }
  
  const result = []
  const step = (props.max - props.min) / (props.tickCount - 1)
  
  for (let i = 0; i < props.tickCount; i++) {
    const value = props.min + step * i
    result.push({
      value,
      percent: valueToPercent(value),
      label: formatValue(Math.round(value))
    })
  }
  
  return result
})

// Event handlers
const getPercentFromEvent = (event: MouseEvent | Touch): number => {
  if (!trackRef.value) return 0
  const rect = trackRef.value.getBoundingClientRect()
  
  if (props.orientation === 'vertical') {
    const y = event.clientY - rect.top
    return 100 - (y / rect.height) * 100
  }
  
  const x = event.clientX - rect.left
  return (x / rect.width) * 100
}

const updateValue = (percent: number) => {
  if (props.disabled || props.readonly) return
  
  let newValue = percentToValue(Math.min(100, Math.max(0, percent)))
  
  if (props.range) {
    if (activeHandle.value === 'min') {
      // Check if we should swap handles (when swappable and crossing over)
      if (props.swappable && newValue > internalMax.value) {
        // Swap: the min handle becomes max, max becomes min
        const oldMax = internalMax.value
        internalMax.value = newValue
        internalMin.value = oldMax
        activeHandle.value = 'max'
      } else {
        // Apply pushable constraint
        const maxAllowed = internalMax.value - props.pushable
        internalMin.value = Math.min(newValue, maxAllowed)
      }
      
      // Apply maxRange constraint
      if (props.maxRange !== undefined) {
        if (internalMax.value - internalMin.value > props.maxRange) {
          if (activeHandle.value === 'min') {
            internalMin.value = internalMax.value - props.maxRange
          } else {
            internalMax.value = internalMin.value + props.maxRange
          }
        }
      }
    } else if (activeHandle.value === 'max') {
      // Check if we should swap handles (when swappable and crossing over)
      if (props.swappable && newValue < internalMin.value) {
        // Swap: the max handle becomes min, min becomes max
        const oldMin = internalMin.value
        internalMin.value = newValue
        internalMax.value = oldMin
        activeHandle.value = 'min'
      } else {
        // Apply pushable constraint
        const minAllowed = internalMin.value + props.pushable
        internalMax.value = Math.max(newValue, minAllowed)
      }
      
      // Apply maxRange constraint
      if (props.maxRange !== undefined) {
        if (internalMax.value - internalMin.value > props.maxRange) {
          if (activeHandle.value === 'max') {
            internalMax.value = internalMin.value + props.maxRange
          } else {
            internalMin.value = internalMax.value - props.maxRange
          }
        }
      }
    }
    
    // Ensure values stay within bounds
    internalMin.value = Math.max(props.min, Math.min(internalMin.value, props.max))
    internalMax.value = Math.max(props.min, Math.min(internalMax.value, props.max))
    
    if (!props.lazy || !isDragging.value) {
      emit('update:modelValue', { min: internalMin.value, max: internalMax.value })
    }
  } else {
    internalMin.value = newValue
    if (!props.lazy || !isDragging.value) {
      emit('update:modelValue', newValue)
    }
  }
}

const handleTrackClick = (event: MouseEvent) => {
  if (props.disabled || props.readonly) return
  
  const percent = getPercentFromEvent(event)
  const clickValue = percentToValue(percent)
  
  if (props.range) {
    // Determine which handle to move
    const minDist = Math.abs(clickValue - internalMin.value)
    const maxDist = Math.abs(clickValue - internalMax.value)
    activeHandle.value = minDist <= maxDist ? 'min' : 'max'
  } else {
    activeHandle.value = 'single'
  }
  
  updateValue(percent)
  emit('change', props.range ? { min: internalMin.value, max: internalMax.value } : internalMin.value)
}

const handleMouseDown = (event: MouseEvent, handle: 'min' | 'max' | 'single') => {
  if (props.disabled || props.readonly) return
  event.preventDefault()
  isDragging.value = true
  activeHandle.value = handle
  emit('drag-start', handle)
}

const handleMouseMove = (event: MouseEvent) => {
  if (!isDragging.value || !activeHandle.value) return
  const percent = getPercentFromEvent(event)
  updateValue(percent)
}

const handleMouseUp = () => {
  if (isDragging.value) {
    isDragging.value = false
    if (props.lazy) {
      const value = props.range 
        ? { min: internalMin.value, max: internalMax.value }
        : internalMin.value
      emit('update:modelValue', value)
      emit('change', value)
    }
    emit('drag-end', props.range ? { min: internalMin.value, max: internalMax.value } : internalMin.value)
    activeHandle.value = null
  }
}

const handleTouchStart = (_event: TouchEvent, handle: 'min' | 'max' | 'single') => {
  if (props.disabled || props.readonly) return
  isDragging.value = true
  activeHandle.value = handle
  emit('drag-start', handle)
}

const handleTouchMove = (event: TouchEvent) => {
  if (!isDragging.value || !activeHandle.value) return
  event.preventDefault()
  const percent = getPercentFromEvent(event.touches[0])
  updateValue(percent)
}

const handleTouchEnd = () => {
  handleMouseUp()
}

const handleKeyDown = (event: KeyboardEvent, handle: 'min' | 'max' | 'single') => {
  if (props.disabled || props.readonly) return
  
  let delta = 0
  if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
    delta = -props.step
  } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
    delta = props.step
  } else if (event.key === 'Home') {
    delta = props.min - (handle === 'max' && props.range ? internalMax.value : internalMin.value)
  } else if (event.key === 'End') {
    delta = props.max - (handle === 'max' && props.range ? internalMax.value : internalMin.value)
  }
  
  if (delta !== 0) {
    event.preventDefault()
    activeHandle.value = handle
    
    if (props.range) {
      let newMin = internalMin.value
      let newMax = internalMax.value
      
      if (handle === 'min') {
        newMin = internalMin.value + delta
        // Check for swap
        if (props.swappable && newMin > internalMax.value) {
          const oldMax = internalMax.value
          newMax = newMin
          newMin = oldMax
        } else {
          newMin = Math.min(Math.max(newMin, props.min), internalMax.value - props.pushable)
        }
      } else {
        newMax = internalMax.value + delta
        // Check for swap
        if (props.swappable && newMax < internalMin.value) {
          const oldMin = internalMin.value
          newMin = newMax
          newMax = oldMin
        } else {
          newMax = Math.max(Math.min(newMax, props.max), internalMin.value + props.pushable)
        }
      }
      
      // Apply maxRange constraint
      if (props.maxRange !== undefined && newMax - newMin > props.maxRange) {
        if (handle === 'min') {
          newMin = newMax - props.maxRange
        } else {
          newMax = newMin + props.maxRange
        }
      }
      
      // Clamp to bounds
      newMin = Math.max(props.min, Math.min(newMin, props.max))
      newMax = Math.max(props.min, Math.min(newMax, props.max))
      
      internalMin.value = newMin
      internalMax.value = newMax
      
      emit('update:modelValue', { min: internalMin.value, max: internalMax.value })
      emit('change', { min: internalMin.value, max: internalMax.value })
    } else {
      internalMin.value = Math.min(Math.max(internalMin.value + delta, props.min), props.max)
      emit('update:modelValue', internalMin.value)
      emit('change', internalMin.value)
    }
  }
}

// Computed z-index for handles - active/hovered handle should be on top
const minHandleZIndex = computed(() => {
  if (activeHandle.value === 'min' || activeHandle.value === 'single') return 20
  if (hoverHandle.value === 'min' || hoverHandle.value === 'single') return 15
  return 10
})

const maxHandleZIndex = computed(() => {
  if (activeHandle.value === 'max') return 20
  if (hoverHandle.value === 'max') return 15
  return 10
})
</script>

<template>
  <div
    v-bind="$attrs"
    :class="cn(
      's-progress-range',
      orientation === 'vertical' ? 'flex flex-col items-center' : 'w-full',
      disabled && 'opacity-(--s-opacity-disabled) cursor-not-allowed',
      $attrs.class ?? ''
    )"
  >
    <!-- Label -->
    <div 
      v-if="label || showValue"
      class="flex items-center justify-between mb-2"
      :class="sizeConfig.fontSize"
    >
      <span v-if="label" class="text-muted-foreground font-medium">{{ label }}</span>
      <span 
        v-if="showValue && !range"
        class="text-foreground font-semibold tabular-nums"
      >
        {{ formatValue(internalMin) }}
      </span>
      <span 
        v-else-if="showValue && range"
        class="text-foreground font-semibold tabular-nums"
      >
        {{ formatValue(internalMin) }} – {{ formatValue(internalMax) }}
      </span>
    </div>

    <!-- Track wrapper -->
    <div 
      class="s-progress-range__wrapper relative"
      :style="{
        height: orientation === 'vertical' ? '200px' : `${handleSizeValue + 8}px`,
        width: orientation === 'vertical' ? `${handleSizeValue + 8}px` : '100%'
      }"
    >
      <!-- Track -->
      <div 
        ref="trackRef"
        class="s-progress-range__track absolute cursor-pointer"
        :class="[
          roundedClasses,
          orientation === 'vertical' ? 'w-full' : 'top-1/2 -translate-y-1/2 left-0 right-0'
        ]"
        :style="{
          background: trackColor,
          height: orientation === 'vertical' ? '100%' : `${trackHeightValue}px`,
          width: orientation === 'vertical' ? `${trackHeightValue}px` : undefined,
          left: orientation === 'vertical' ? '50%' : undefined,
          transform: orientation === 'vertical' ? 'translateX(-50%)' : undefined
        }"
        @click="handleTrackClick"
      >
        <!-- Active track -->
        <div 
          class="s-progress-range__active-track absolute transition-all duration-100"
          :class="roundedClasses"
          :style="{
            background: activeTrackColor || color,
            height: orientation === 'vertical' ? `${maxPercent - minPercent}%` : '100%',
            width: orientation === 'vertical' ? '100%' : `${range ? maxPercent - minPercent : minPercent}%`,
            left: orientation === 'vertical' ? '0' : `${range ? minPercent : 0}%`,
            bottom: orientation === 'vertical' ? `${minPercent}%` : undefined
          }"
        />

        <!-- Tick marks -->
        <div 
          v-if="(showTicks || marks) && ticks.length > 0"
          class="absolute inset-0"
        >
          <div 
            v-for="tick in ticks"
            :key="tick.value"
            class="absolute"
            :style="{
              left: orientation === 'horizontal' ? `${tick.percent}%` : '50%',
              bottom: orientation === 'vertical' ? `${tick.percent}%` : undefined,
              top: orientation === 'horizontal' ? '50%' : undefined,
              transform: 'translate(-50%, -50%)'
            }"
          >
            <div 
              class="w-1.5 h-1.5 rounded-full transition-colors"
              :class="[
                (range ? tick.value >= internalMin && tick.value <= internalMax : tick.value <= internalMin)
                  ? 'bg-primary-foreground'
                  : 'bg-muted-foreground'
              ]"
            />
          </div>
        </div>
      </div>

      <!-- Min handle (or single handle) -->
      <div 
        class="s-progress-range__handle absolute"
        :class="[
          'transition-shadow duration-(--s-duration-normal)',
          (isDragging && activeHandle === (range ? 'min' : 'single')) && 'ring-4 ring-opacity-30',
          disabled ? 'cursor-not-allowed' : 'cursor-grab'
        ]"
        :style="{
          width: `${handleSizeValue}px`,
          height: `${handleSizeValue}px`,
          background: handleColor || color,
          borderRadius: rounded === 'none' ? '2px' : '50%',
          left: orientation === 'horizontal' ? `calc(${minPercent}% - ${handleSizeValue / 2}px)` : '50%',
          top: orientation === 'horizontal' ? '50%' : undefined,
          bottom: orientation === 'vertical' ? `calc(${minPercent}% - ${handleSizeValue / 2}px)` : undefined,
          transform: orientation === 'horizontal' ? 'translateY(-50%)' : 'translateX(-50%)',
          '--tw-ring-color': color,
          zIndex: minHandleZIndex
        }"
        role="slider"
        tabindex="0"
        :aria-valuenow="internalMin"
        :aria-valuemin="min"
        :aria-valuemax="range ? internalMax - pushable : max"
        :aria-label="range ? 'Minimum value' : 'Value'"
        @mousedown="handleMouseDown($event, range ? 'min' : 'single')"
        @touchstart="handleTouchStart($event, range ? 'min' : 'single')"
        @keydown="handleKeyDown($event, range ? 'min' : 'single')"
        @mouseenter="hoverHandle = range ? 'min' : 'single'"
        @mouseleave="hoverHandle = null"
      >
        <!-- Tooltip -->
        <Transition
          enter-active-class="transition-all duration-150 ease-out"
          enter-from-class="opacity-0 scale-90"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-100"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-90"
        >
          <div 
            v-if="showTooltip && (isDragging && activeHandle === (range ? 'min' : 'single') || hoverHandle === (range ? 'min' : 'single'))"
            class="absolute whitespace-nowrap px-2 py-1 rounded-md bg-muted border border-border shadow-lg text-xs font-semibold text-foreground"
            :class="[
              tooltipPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2',
              'left-1/2 -translate-x-1/2'
            ]"
          >
            {{ formatValue(internalMin) }}
          </div>
        </Transition>
      </div>

      <!-- Max handle (range mode only) -->
      <div 
        v-if="range"
        class="s-progress-range__handle absolute"
        :class="[
          'transition-shadow duration-(--s-duration-normal)',
          (isDragging && activeHandle === 'max') && 'ring-4 ring-opacity-30',
          disabled ? 'cursor-not-allowed' : 'cursor-grab'
        ]"
        :style="{
          width: `${handleSizeValue}px`,
          height: `${handleSizeValue}px`,
          background: handleColor || color,
          borderRadius: rounded === 'none' ? '2px' : '50%',
          left: orientation === 'horizontal' ? `calc(${maxPercent}% - ${handleSizeValue / 2}px)` : '50%',
          top: orientation === 'horizontal' ? '50%' : undefined,
          bottom: orientation === 'vertical' ? `calc(${maxPercent}% - ${handleSizeValue / 2}px)` : undefined,
          transform: orientation === 'horizontal' ? 'translateY(-50%)' : 'translateX(-50%)',
          '--tw-ring-color': color,
          zIndex: maxHandleZIndex
        }"
        role="slider"
        tabindex="0"
        :aria-valuenow="internalMax"
        :aria-valuemin="internalMin + pushable"
        :aria-valuemax="max"
        aria-label="Maximum value"
        @mousedown="handleMouseDown($event, 'max')"
        @touchstart="handleTouchStart($event, 'max')"
        @keydown="handleKeyDown($event, 'max')"
        @mouseenter="hoverHandle = 'max'"
        @mouseleave="hoverHandle = null"
      >
        <!-- Tooltip -->
        <Transition
          enter-active-class="transition-all duration-150 ease-out"
          enter-from-class="opacity-0 scale-90"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-100"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-90"
        >
          <div 
            v-if="showTooltip && (isDragging && activeHandle === 'max' || hoverHandle === 'max')"
            class="absolute whitespace-nowrap px-2 py-1 rounded-md bg-muted border border-border shadow-lg text-xs font-semibold text-foreground"
            :class="[
              tooltipPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2',
              'left-1/2 -translate-x-1/2'
            ]"
          >
            {{ formatValue(internalMax) }}
          </div>
        </Transition>
      </div>
    </div>

    <!-- Labels / Ticks below -->
    <div 
      v-if="showLabels || (showTicks && ticks.length > 0)"
      class="s-progress-range__labels relative mt-2"
      :class="orientation === 'horizontal' ? 'w-full' : 'h-full'"
    >
      <div 
        v-if="showLabels"
        class="flex justify-between text-xs text-muted-foreground"
      >
        <span>{{ minLabel || formatValue(min) }}</span>
        <span>{{ maxLabel || formatValue(max) }}</span>
      </div>
      <div 
        v-else-if="showTicks"
        class="relative h-5"
      >
        <span 
          v-for="tick in ticks"
          :key="tick.value"
          class="absolute text-xs text-muted-foreground -translate-x-1/2"
          :style="{ left: `${tick.percent}%` }"
        >
          {{ tick.label }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.s-progress-range__handle {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.s-progress-range__handle:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.s-progress-range__handle:active {
  cursor: grabbing;
}

.s-progress-range__handle:focus {
  outline: none;
}

.s-progress-range__handle:focus-visible {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--s-primary) 15%, transparent);
}
</style>
