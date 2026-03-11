<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { cn } from '../../../lib/utils'

defineOptions({ inheritAttrs: false })

export interface Props {
  // Core
  modelValue?: number
  min?: number
  max?: number
  
  // Visual
  variant?: 'default' | 'gradient' | 'striped' | 'buffer' | 'segments' | 'liquid'
  size?: 'xs' | 'small' | 'medium' | 'large' | 'xl'
  orientation?: 'horizontal' | 'vertical'
  rounded?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
  color?: string
  trackColor?: string
  gradientColors?: string[]
  
  // Buffer variant
  bufferValue?: number
  bufferColor?: string
  
  // Segments variant
  segments?: number
  segmentGap?: number
  
  // Animation
  animated?: boolean
  animationType?: 'pulse' | 'wave' | 'shimmer' | 'bounce' | 'flow' | 'none'
  animationSpeed?: 'slow' | 'normal' | 'fast'
  indeterminate?: boolean
  
  // Display
  showValue?: boolean
  valuePosition?: 'inside' | 'outside' | 'top' | 'tooltip'
  valueFormat?: (value: number, min: number, max: number) => string
  label?: string
  labelPosition?: 'top' | 'bottom' | 'left' | 'right'
  
  // States
  disabled?: boolean
  
  // Advanced
  height?: string
  width?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  min: 0,
  max: 100,
  variant: 'default',
  size: 'medium',
  orientation: 'horizontal',
  rounded: 'full',
  color: 'var(--s-primary)',
  trackColor: 'var(--s-accent)',
  gradientColors: () => ['#06b6d4', '#3b82f6', '#8b5cf6'],
  bufferValue: 0,
  bufferColor: 'color-mix(in srgb, var(--s-primary) 15%, transparent)',
  segments: 5,
  segmentGap: 3,
  animated: false,
  animationType: 'none',
  animationSpeed: 'normal',
  indeterminate: false,
  showValue: false,
  valuePosition: 'outside',
  label: undefined,
  labelPosition: 'top',
  disabled: false,
  height: undefined,
  width: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

// Refs
const progressRef = ref<HTMLElement | null>(null) // used as template ref
void progressRef
const showTooltip = ref(false)
const animatedValue = ref(0)

// Computed
const percentage = computed(() => {
  const range = props.max - props.min
  if (range <= 0) return 0
  return Math.min(100, Math.max(0, ((props.modelValue - props.min) / range) * 100))
})

const bufferPercentage = computed(() => {
  const range = props.max - props.min
  if (range <= 0) return 0
  return Math.min(100, Math.max(0, ((props.bufferValue - props.min) / range) * 100))
})

const displayValue = computed(() => {
  if (props.valueFormat) {
    return props.valueFormat(props.modelValue, props.min, props.max)
  }
  return `${Math.round(percentage.value)}%`
})

// Size config
const sizeConfig = computed(() => {
  const sizes = {
    xs: { height: '4px', fontSize: '10px', labelSize: 'text-xs' },
    small: { height: '6px', fontSize: '10px', labelSize: 'text-xs' },
    medium: { height: '10px', fontSize: '11px', labelSize: 'text-sm' },
    large: { height: '16px', fontSize: '12px', labelSize: 'text-sm' },
    xl: { height: '24px', fontSize: '14px', labelSize: 'text-base' }
  }
  return sizes[props.size]
})

// Rounded classes
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

// Animation speed
const animationDuration = computed(() => {
  const speeds = { slow: '2s', normal: '1.2s', fast: '0.8s' }
  return speeds[props.animationSpeed]
})

// Dynamic styles
const trackStyle = computed(() => {
  const style: Record<string, string> = {
    '--progress-track': props.trackColor,
    '--progress-color': props.color,
    '--progress-buffer': props.bufferColor,
    '--animation-duration': animationDuration.value
  }
  
  if (props.height) {
    style.height = props.height
  } else {
    style.height = sizeConfig.value.height
  }
  
  if (props.width) {
    style.width = props.width
  }
  
  if (props.orientation === 'vertical') {
    style.width = props.width || sizeConfig.value.height
    style.height = props.height || '200px'
  }
  
  return style
})

const fillStyle = computed(() => {
  const style: Record<string, string> = {}
  
  if (props.variant === 'gradient' && props.gradientColors.length >= 2) {
    style.background = `linear-gradient(90deg, ${props.gradientColors.join(', ')})`
  } else {
    style.background = props.color
  }
  
  if (props.orientation === 'horizontal') {
    style.width = props.indeterminate ? '30%' : `${percentage.value}%`
  } else {
    style.height = props.indeterminate ? '30%' : `${percentage.value}%`
  }
  
  return style
})

const bufferStyle = computed(() => ({
  width: props.orientation === 'horizontal' ? `${bufferPercentage.value}%` : '100%',
  height: props.orientation === 'vertical' ? `${bufferPercentage.value}%` : '100%'
}))

// Segment calculations
const segmentData = computed(() => {
  if (props.variant !== 'segments') return []
  const filledSegments = Math.floor((percentage.value / 100) * props.segments)
  const partialFill = ((percentage.value / 100) * props.segments) % 1
  
  return Array.from({ length: props.segments }, (_, i) => ({
    index: i,
    filled: i < filledSegments,
    partial: i === filledSegments ? partialFill * 100 : 0
  }))
})

// Animation classes
const animationClasses = computed(() => {
  if (!props.animated && !props.indeterminate) return ''
  
  const classes: string[] = []
  
  if (props.indeterminate) {
    classes.push('s-progress--indeterminate')
  }
  
  if (props.animated && props.animationType !== 'none') {
    classes.push(`s-progress--${props.animationType}`)
  }
  
  return classes.join(' ')
})

// Container classes
const containerClasses = computed(() => {
  const classes: string[] = ['s-progress']
  
  if (props.orientation === 'vertical') {
    classes.push('s-progress--vertical')
  }
  
  if (props.disabled) {
    classes.push('opacity-(--s-opacity-disabled) cursor-not-allowed')
  }
  
  return classes.join(' ')
})

// Animate value on mount
onMounted(() => {
  if (props.animated) {
    requestAnimationFrame(() => {
      animatedValue.value = props.modelValue
    })
  }
})

watch(() => props.modelValue, (newVal) => {
  if (props.animated) {
    animatedValue.value = newVal
  }
})
</script>

<template>
  <div
    v-bind="$attrs"
    :class="cn(
      containerClasses,
      labelPosition === 'left' || labelPosition === 'right' ? 'flex items-center gap-3' : 'flex flex-col gap-1.5',
      labelPosition === 'right' && 'flex-row-reverse',
      $attrs.class ?? ''
    )"
  >
    <!-- Label (top/left) -->
    <div 
      v-if="label && (labelPosition === 'top' || labelPosition === 'left')"
      class="flex items-center justify-between gap-2"
      :class="sizeConfig.labelSize"
    >
      <span class="text-muted-foreground font-medium">{{ label }}</span>
      <span 
        v-if="showValue && valuePosition === 'top' && labelPosition === 'top'"
        class="text-foreground font-semibold tabular-nums"
      >
        {{ displayValue }}
      </span>
    </div>

    <!-- Progress Track -->
    <div 
      class="s-progress__wrapper flex-1 relative min-w-0"
      :class="showValue && valuePosition === 'outside' ? 'flex items-center' : ''"
    >
      <!-- Default/Gradient/Striped/Buffer/Liquid variants -->
      <div 
        v-if="variant !== 'segments'"
        ref="progressRef"
        class="s-progress__track relative overflow-hidden flex-1"
        :class="roundedClasses"
        :style="trackStyle"
        role="progressbar"
        :aria-valuenow="modelValue"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-label="label"
        @mouseenter="valuePosition === 'tooltip' && (showTooltip = true)"
        @mouseleave="valuePosition === 'tooltip' && (showTooltip = false)"
      >
        <!-- Buffer fill (buffer variant) -->
        <div 
          v-if="variant === 'buffer'"
          class="s-progress__buffer absolute inset-0 transition-all duration-(--s-duration-slow) ease-out"
          :class="roundedClasses"
          :style="bufferStyle"
        />
        
        <!-- Main fill -->
        <div 
          class="s-progress__fill relative h-full transition-all duration-500 ease-out"
          :class="[
            roundedClasses,
            animationClasses,
            { 's-progress--striped': variant === 'striped' },
            { 's-progress--liquid': variant === 'liquid' }
          ]"
          :style="fillStyle"
        >
          <!-- Value inside -->
          <span 
            v-if="showValue && valuePosition === 'inside' && size !== 'xs' && size !== 'small'"
            :class="['absolute inset-0 flex items-center justify-center font-semibold drop-shadow-sm tabular-nums', color === 'var(--s-primary)' ? 'text-primary-foreground' : 'text-white']"
            :style="{ fontSize: sizeConfig.fontSize }"
          >
            {{ displayValue }}
          </span>
          
          <!-- Shimmer overlay -->
          <div 
            v-if="animated && animationType === 'shimmer'"
            class="s-progress__shimmer absolute inset-0"
          />
          
          <!-- Wave effect -->
          <div 
            v-if="animated && animationType === 'wave'"
            class="s-progress__wave absolute inset-0"
          />
          
          <!-- Liquid bubbles -->
          <div v-if="variant === 'liquid'" class="s-progress__bubbles absolute inset-0 overflow-hidden">
            <div class="bubble bubble-1" />
            <div class="bubble bubble-2" />
            <div class="bubble bubble-3" />
          </div>
        </div>
      </div>
      <!-- Segments variant -->
      <div 
        v-else
        class="s-progress__segments flex flex-1"
        :class="orientation === 'vertical' ? 'flex-col-reverse' : 'flex-row'"
        :style="{ gap: `${segmentGap}px`, ...trackStyle }"
        role="progressbar"
        :aria-valuenow="modelValue"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-label="label"
      >
        <div 
          v-for="segment in segmentData"
          :key="segment.index"
          class="s-progress__segment flex-1 overflow-hidden"
          :class="roundedClasses"
          :style="{ background: trackColor }"
        >
          <div 
            class="h-full transition-all duration-(--s-duration-slow) ease-out"
            :class="roundedClasses"
            :style="{
              background: color,
              width: segment.filled ? '100%' : `${segment.partial}%`
            }"
          />
        </div>
      </div>
      
      <!-- Tooltip (outside overflow:hidden container for non-segments) -->
      <Transition
        enter-active-class="transition-all duration-150 ease-out"
        enter-from-class="opacity-0 -translate-y-1 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition-all duration-100 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 -translate-y-1 scale-95"
      >
        <div 
          v-if="showValue && valuePosition === 'tooltip' && showTooltip && variant !== 'segments'"
          class="absolute z-10 px-2 py-1 rounded-md bg-muted border border-border shadow-lg text-xs font-semibold text-foreground whitespace-nowrap pointer-events-none"
          :style="{
            left: `${percentage}%`,
            transform: 'translateX(-50%)',
            bottom: 'calc(100% + 8px)'
          }"
        >
          {{ displayValue }}
          <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-muted" />
        </div>
      </Transition>

    </div>
    
    <!-- Value outside (right side) - using flex instead of absolute -->
    <span 
      v-if="showValue && valuePosition === 'outside'"
      class="font-semibold tabular-nums text-foreground shrink-0 whitespace-nowrap"
      :class="[
        sizeConfig.labelSize,
        orientation === 'horizontal' ? 'ml-3' : 'mb-2'
      ]"
    >
      {{ displayValue }}
    </span>

    <!-- Label (bottom/right) -->
    <div 
      v-if="label && (labelPosition === 'bottom' || labelPosition === 'right')"
      class="flex items-center justify-between gap-2"
      :class="sizeConfig.labelSize"
    >
      <span class="text-muted-foreground font-medium">{{ label }}</span>
      <span 
        v-if="showValue && valuePosition === 'top' && labelPosition === 'bottom'"
        class="text-foreground font-semibold tabular-nums"
      >
        {{ displayValue }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.s-progress__track {
  background: var(--progress-track);
  width: 100%;
}

.s-progress__buffer {
  background: var(--progress-buffer);
}

.s-progress__fill {
  transform-origin: left center;
}

.s-progress--vertical .s-progress__track {
  width: auto;
}

.s-progress--vertical .s-progress__fill {
  width: 100% !important;
  transform-origin: bottom center;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

/* Striped pattern */
.s-progress--striped {
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent
  );
  background-size: 1rem 1rem;
}

.s-progress--striped.s-progress--flow {
  animation: stripe-flow var(--animation-duration) linear infinite;
}

/* Indeterminate animation */
.s-progress--indeterminate {
  animation: indeterminate var(--animation-duration) ease-in-out infinite;
}

/* Pulse animation */
.s-progress--pulse {
  animation: pulse var(--animation-duration) ease-in-out infinite;
}

/* Wave animation overlay */
.s-progress__wave {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.4) 50%,
    transparent 100%
  );
  animation: wave var(--animation-duration) linear infinite;
}

/* Shimmer animation */
.s-progress__shimmer {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 20%,
    rgba(255, 255, 255, 0.5) 50%,
    rgba(255, 255, 255, 0.3) 80%,
    transparent 100%
  );
  animation: shimmer var(--animation-duration) ease-in-out infinite;
}

/* Bounce animation */
.s-progress--bounce {
  animation: bounce-progress var(--animation-duration) ease-in-out infinite;
}

/* Flow animation (for striped) */
.s-progress--flow {
  animation: stripe-flow var(--animation-duration) linear infinite;
}

/* Liquid variant */
.s-progress--liquid {
  position: relative;
  overflow: hidden;
}

.s-progress__bubbles .bubble {
  position: absolute;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: bubble-rise 2s ease-in-out infinite;
}

.bubble-1 {
  width: 6px;
  height: 6px;
  left: 20%;
  animation-delay: 0s;
}

.bubble-2 {
  width: 4px;
  height: 4px;
  left: 50%;
  animation-delay: 0.5s;
}

.bubble-3 {
  width: 5px;
  height: 5px;
  left: 75%;
  animation-delay: 1s;
}

/* Keyframes */
@keyframes indeterminate {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(400%);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

@keyframes wave {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-150%);
  }
  100% {
    transform: translateX(150%);
  }
}

@keyframes bounce-progress {
  0%, 100% {
    transform: scaleX(1);
  }
  50% {
    transform: scaleX(1.02);
  }
}

@keyframes stripe-flow {
  0% {
    background-position: 1rem 0;
  }
  100% {
    background-position: 0 0;
  }
}

@keyframes bubble-rise {
  0% {
    bottom: -10%;
    opacity: 0;
  }
  20% {
    opacity: 0.8;
  }
  80% {
    opacity: 0.6;
  }
  100% {
    bottom: 110%;
    opacity: 0;
  }
}

/* Vertical orientation adjustments */
.s-progress--vertical .s-progress--indeterminate {
  animation: indeterminate-vertical var(--animation-duration) ease-in-out infinite;
}

@keyframes indeterminate-vertical {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(-400%);
  }
}
</style>
