<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'

export interface Props {
  // Core
  modelValue?: string
  length?: number
  mode?: 'numeric' | 'alphanumeric' | 'alphabetic' | 'any'
  
  // Visual Design
  variant?: 'outlined' | 'filled' | 'underlined' | 'ghost' | 'morphing'
  size?: 'small' | 'medium' | 'large' | 'xl'
  color?: string
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  gap?: 'tight' | 'normal' | 'wide'
  
  // Animations
  animation?: 'none' | 'bounce' | 'shake' | 'pulse' | 'flip' | 'morph' | 'glow' | 'wave'
  entryAnimation?: 'none' | 'fade' | 'slide-up' | 'slide-down' | 'scale' | 'rotate' | 'blur'
  inputAnimation?: 'none' | 'pop' | 'squeeze' | 'jelly' | 'rubber'
  successAnimation?: 'none' | 'celebrate' | 'check' | 'confetti' | 'ripple'
  errorAnimation?: 'none' | 'shake' | 'wobble' | 'flash'
  
  // Text Morphing
  morphText?: boolean
  morphDuration?: number
  showPlaceholder?: boolean
  placeholderChar?: string
  maskChar?: string
  
  // States
  disabled?: boolean
  readonly?: boolean
  loading?: boolean
  error?: string | boolean
  success?: string | boolean
  autoFocus?: boolean
  
  // Behavior
  autoSubmit?: boolean
  masked?: boolean
  clearOnError?: boolean
  allowPaste?: boolean
  separator?: string
  separatorPosition?: number[] // e.g., [3] for XXX-XXX format
  
  // Label & Messages
  label?: string
  hint?: string
  errorMessage?: string
  successMessage?: string
  
  // Advanced
  countdown?: number // seconds countdown for resend
  resendText?: string
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  length: 6,
  mode: 'numeric',
  variant: 'outlined',
  size: 'medium',
  color: 'var(--s-primary)',
  rounded: 'md',
  gap: 'normal',
  animation: 'bounce',
  entryAnimation: 'scale',
  inputAnimation: 'pop',
  successAnimation: 'celebrate',
  errorAnimation: 'shake',
  morphText: true,
  morphDuration: 150,
  showPlaceholder: true,
  placeholderChar: '○',
  maskChar: '●',
  disabled: false,
  readonly: false,
  loading: false,
  autoFocus: true,
  autoSubmit: true,
  masked: false,
  clearOnError: false,
  allowPaste: true,
  separator: '',
  resendText: 'Resend code',
  countdown: 0
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'complete': [value: string]
  'change': [value: string]
  'input': [index: number, value: string]
  'focus': [index: number]
  'blur': [index: number]
  'paste': [value: string]
  'resend': []
  'error': [message: string]
  'success': []
}>()

// Refs
const inputRefs = ref<(HTMLInputElement | null)[]>([])
const containerRef = ref<HTMLElement | null>(null)
const digits = ref<string[]>(Array(props.length).fill(''))
const activeIndex = ref(-1)
const isComplete = ref(false)
const showSuccess = ref(false)
const showError = ref(false)
const animatingIndices = ref<Set<number>>(new Set())
const morphingIndices = ref<Map<number, { from: string; to: string; progress: number; phase: 'out' | 'in' }>>(new Map())

// Countdown
const countdownValue = ref(props.countdown)
const countdownInterval = ref<ReturnType<typeof setInterval> | null>(null)

// Computed
const isNumericMode = computed(() => props.mode === 'numeric')
const inputPattern = computed(() => {
  switch (props.mode) {
    case 'numeric': return '[0-9]'
    case 'alphabetic': return '[a-zA-Z]'
    case 'alphanumeric': return '[a-zA-Z0-9]'
    default: return '.'
  }
})

const inputMode = computed(() => {
  return props.mode === 'numeric' ? 'numeric' : 'text'
})

// Size configurations
const sizeConfig = computed(() => {
  const sizes = {
    small: {
      box: 'w-9 h-10',
      text: 'text-lg',
      label: 'text-xs',
      hint: 'text-xs',
      icon: 'text-sm'
    },
    medium: {
      box: 'w-12 h-14',
      text: 'text-2xl',
      label: 'text-sm',
      hint: 'text-xs',
      icon: 'text-base'
    },
    large: {
      box: 'w-14 h-16',
      text: 'text-3xl',
      label: 'text-base',
      hint: 'text-sm',
      icon: 'text-lg'
    },
    xl: {
      box: 'w-18 h-20',
      text: 'text-4xl',
      label: 'text-lg',
      hint: 'text-base',
      icon: 'text-xl'
    }
  }
  return sizes[props.size]
})

// Gap configurations
const gapConfig = computed(() => {
  const gaps = {
    tight: 'gap-1',
    normal: 'gap-2',
    wide: 'gap-4'
  }
  return gaps[props.gap]
})

// Rounded configurations
const roundedConfig = computed(() => {
  const radii = {
    none: 'rounded-none',
    sm: 'rounded',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    full: 'rounded-full'
  }
  return radii[props.rounded]
})

// Variant classes
const variantClasses = computed(() => {
  const base = {
    outlined: 'border-2 bg-(--s-bg-primary) border-(--s-border)',
    filled: 'border-2 border-transparent bg-(--s-bg-tertiary)',
    underlined: 'border-b-2 border-t-0 border-l-0 border-r-0 rounded-none! bg-transparent border-(--s-border)',
    ghost: 'border-2 border-transparent bg-transparent',
    morphing: 'border-2 bg-(--s-bg-secondary) border-(--s-border) shadow-inner'
  }
  return base[props.variant]
})

// Check if value at index is valid
const isValidChar = (char: string): boolean => {
  if (!char) return true
  const regex = new RegExp(`^${inputPattern.value}$`)
  return regex.test(char)
}

// Get display character - handles morphing animation phases
const getDisplayChar = (index: number): string => {
  const morphData = morphingIndices.value.get(index)
  
  if (morphData) {
    // During morph animation, show old char during 'out' phase, new char during 'in' phase
    const char = morphData.phase === 'out' ? morphData.from : morphData.to
    if (!char) return props.showPlaceholder ? props.placeholderChar : ''
    if (props.masked && char) return props.maskChar
    return char.toUpperCase()
  }
  
  const char = digits.value[index]
  if (!char) return props.showPlaceholder ? props.placeholderChar : ''
  if (props.masked) return props.maskChar
  return char.toUpperCase()
}

// Get morph transform style for enhanced animation
const getMorphStyle = (index: number) => {
  const morphData = morphingIndices.value.get(index)
  if (!morphData) return {}
  
  const { progress, phase } = morphData
  
  if (phase === 'out') {
    // Old character: scale down, rotate, blur, fade out
    const scale = 1 - progress * 0.5
    const rotateY = progress * 90
    const blur = progress * 4
    const opacity = 1 - progress
    return {
      transform: `scale(${scale}) rotateY(${rotateY}deg) translateZ(0)`,
      filter: `blur(${blur}px)`,
      opacity
    }
  } else {
    // New character: scale up, rotate in, unblur, fade in
    const scale = 0.5 + progress * 0.5
    const rotateY = -90 + progress * 90
    const blur = (1 - progress) * 4
    const opacity = progress
    return {
      transform: `scale(${scale}) rotateY(${rotateY}deg) translateZ(0)`,
      filter: `blur(${blur}px)`,
      opacity
    }
  }
}

// Check if OTP is complete
const checkComplete = () => {
  const value = digits.value.join('')
  isComplete.value = value.length === props.length && digits.value.every(d => d !== '')
  
  if (isComplete.value && props.autoSubmit) {
    showSuccess.value = true
    emit('complete', value)
    emit('success')
    
    // Reset success after animation
    setTimeout(() => {
      showSuccess.value = false
    }, 1500)
  }
}

// Text morphing animation - two phase: out (old char fades/flips out) then in (new char fades/flips in)
const startMorphAnimation = (index: number, from: string, to: string) => {
  if (!props.morphText) return
  
  // If no actual change, just trigger input animation
  if (from === to) {
    animatingIndices.value.add(index)
    setTimeout(() => animatingIndices.value.delete(index), 300)
    return
  }
  
  const halfDuration = props.morphDuration
  const totalDuration = halfDuration * 2
  
  // Start with 'out' phase
  morphingIndices.value.set(index, { from, to, progress: 0, phase: 'out' })
  animatingIndices.value.add(index)
  
  const startTime = performance.now()
  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime
    const totalProgress = Math.min(elapsed / totalDuration, 1)
    
    if (totalProgress < 0.5) {
      // Phase 1: "out" - old character morphs away
      const outProgress = totalProgress * 2 // 0 to 1 during first half
      morphingIndices.value.set(index, { from, to, progress: outProgress, phase: 'out' })
    } else {
      // Phase 2: "in" - new character morphs in
      const inProgress = (totalProgress - 0.5) * 2 // 0 to 1 during second half
      morphingIndices.value.set(index, { from, to, progress: inProgress, phase: 'in' })
    }
    
    if (totalProgress < 1) {
      requestAnimationFrame(animate)
    } else {
      morphingIndices.value.delete(index)
      animatingIndices.value.delete(index)
    }
  }
  
  requestAnimationFrame(animate)
}

// Handle input
const handleInput = (event: Event, index: number) => {
  const target = event.target as HTMLInputElement
  let value = target.value.slice(-1) // Take only the last character
  
  // Validate character
  if (value && !isValidChar(value)) {
    target.value = digits.value[index]
    return
  }
  
  // Format for mode
  if (props.mode === 'alphabetic' || props.mode === 'alphanumeric') {
    value = value.toUpperCase()
  }
  
  const oldValue = digits.value[index]
  digits.value[index] = value
  
  // Trigger morph animation
  startMorphAnimation(index, oldValue, value)
  
  // Emit events
  const fullValue = digits.value.join('')
  emit('update:modelValue', fullValue)
  emit('input', index, value)
  emit('change', fullValue)
  
  // Move to next input
  if (value && index < props.length - 1) {
    nextTick(() => {
      focusInput(index + 1)
    })
  }
  
  checkComplete()
}

// Handle keydown
const handleKeydown = (event: KeyboardEvent, index: number) => {
  const key = event.key
  
  if (key === 'Backspace') {
    event.preventDefault()
    
    if (digits.value[index]) {
      // Clear current digit
      const oldValue = digits.value[index]
      digits.value[index] = ''
      startMorphAnimation(index, oldValue, '')
    } else if (index > 0) {
      // Move to previous and clear
      focusInput(index - 1)
      const oldValue = digits.value[index - 1]
      digits.value[index - 1] = ''
      startMorphAnimation(index - 1, oldValue, '')
    }
    
    const fullValue = digits.value.join('')
    emit('update:modelValue', fullValue)
    emit('change', fullValue)
    isComplete.value = false
    
  } else if (key === 'Delete') {
    event.preventDefault()
    if (digits.value[index]) {
      const oldValue = digits.value[index]
      digits.value[index] = ''
      startMorphAnimation(index, oldValue, '')
      
      const fullValue = digits.value.join('')
      emit('update:modelValue', fullValue)
      emit('change', fullValue)
      isComplete.value = false
    }
    
  } else if (key === 'ArrowLeft') {
    event.preventDefault()
    if (index > 0) {
      focusInput(index - 1)
    }
    
  } else if (key === 'ArrowRight') {
    event.preventDefault()
    if (index < props.length - 1) {
      focusInput(index + 1)
    }
    
  } else if (key === 'Home') {
    event.preventDefault()
    focusInput(0)
    
  } else if (key === 'End') {
    event.preventDefault()
    focusInput(props.length - 1)
  }
}

// Handle paste
const handlePaste = (event: ClipboardEvent, index: number) => {
  if (!props.allowPaste) {
    event.preventDefault()
    return
  }
  
  event.preventDefault()
  const pastedData = event.clipboardData?.getData('text') || ''
  const cleanedData = pastedData.replace(new RegExp(`[^${inputPattern.value.slice(1, -1)}]`, 'gi'), '')
  
  if (!cleanedData) return
  
  emit('paste', cleanedData)
  
  // Fill digits starting from current index
  const chars = cleanedData.split('').slice(0, props.length - index)
  chars.forEach((char, i) => {
    if (index + i < props.length) {
      const oldValue = digits.value[index + i]
      const newValue = props.mode !== 'numeric' ? char.toUpperCase() : char
      digits.value[index + i] = newValue
      startMorphAnimation(index + i, oldValue, newValue)
    }
  })
  
  const fullValue = digits.value.join('')
  emit('update:modelValue', fullValue)
  emit('change', fullValue)
  
  // Focus the next empty input or last filled
  const nextEmptyIndex = digits.value.findIndex((d, i) => i >= index && !d)
  if (nextEmptyIndex !== -1) {
    focusInput(nextEmptyIndex)
  } else {
    focusInput(Math.min(index + chars.length, props.length - 1))
  }
  
  checkComplete()
}

// Handle focus
const handleFocus = (index: number) => {
  activeIndex.value = index
  emit('focus', index)
  
  // Select the input content
  const input = inputRefs.value[index]
  if (input) {
    input.select()
  }
}

// Handle blur
const handleBlur = (index: number) => {
  activeIndex.value = -1
  emit('blur', index)
}

// Focus specific input
const focusInput = (index: number) => {
  const input = inputRefs.value[index]
  if (input && !props.disabled && !props.readonly) {
    input.focus()
    input.select()
  }
}

// Clear all
const clear = () => {
  digits.value = Array(props.length).fill('')
  emit('update:modelValue', '')
  emit('change', '')
  isComplete.value = false
  focusInput(0)
}

// Trigger error state
const triggerError = (message?: string) => {
  showError.value = true
  emit('error', message || props.errorMessage || 'Invalid code')
  
  if (props.clearOnError) {
    setTimeout(() => {
      clear()
    }, 500)
  }
  
  setTimeout(() => {
    showError.value = false
  }, 600)
}

// Start countdown
const startCountdown = () => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
  }
  
  countdownValue.value = props.countdown
  
  countdownInterval.value = setInterval(() => {
    if (countdownValue.value > 0) {
      countdownValue.value--
    } else if (countdownInterval.value) {
      clearInterval(countdownInterval.value)
      countdownInterval.value = null
    }
  }, 1000)
}

// Handle resend
const handleResend = () => {
  if (countdownValue.value > 0) return
  
  emit('resend')
  clear()
  
  if (props.countdown > 0) {
    startCountdown()
  }
}

// Format countdown
const formattedCountdown = computed(() => {
  const minutes = Math.floor(countdownValue.value / 60)
  const seconds = countdownValue.value % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

// Should show separator after index
const shouldShowSeparator = (index: number): boolean => {
  if (!props.separator || !props.separatorPosition?.length) return false
  return props.separatorPosition.includes(index + 1) && index < props.length - 1
}

// Expose methods
defineExpose({
  clear,
  focusInput,
  focus: () => focusInput(0),
  blur: () => inputRefs.value[activeIndex.value]?.blur(),
  triggerError,
  getValue: () => digits.value.join(''),
  isComplete: () => isComplete.value
})

// Lifecycle
onMounted(() => {
  if (props.autoFocus) {
    nextTick(() => {
      // Find first empty input
      const firstEmptyIndex = digits.value.findIndex(d => !d)
      focusInput(firstEmptyIndex !== -1 ? firstEmptyIndex : 0)
    })
  }
  
  if (props.countdown > 0) {
    startCountdown()
  }
})

onUnmounted(() => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
  }
})

// Initialize digits from modelValue
watch(() => props.modelValue, (newValue) => {
  const chars = newValue.split('').slice(0, props.length)
  digits.value = [...chars, ...Array(props.length - chars.length).fill('')]
  checkComplete()
}, { immediate: true })

// Watch for length prop changes
watch(() => props.length, (newLength, oldLength) => {
  if (newLength !== oldLength) {
    const currentValue = digits.value.join('')
    const chars = currentValue.split('').slice(0, newLength)
    digits.value = [...chars, ...Array(newLength - chars.length).fill('')]
    emit('update:modelValue', digits.value.join(''))
    checkComplete()
  }
})

// Watch for error prop changes
watch(() => props.error, (hasError) => {
  if (hasError) {
    showError.value = true
    setTimeout(() => {
      showError.value = false
    }, 600)
  }
})
</script>

<template>
  <div 
    ref="containerRef"
    class="s-otp-wrapper flex flex-col items-center w-fit"
    :class="{ 'opacity-50 pointer-events-none': disabled }"
  >
    <!-- Label -->
    <label 
      v-if="label"
      class="s-otp-label font-medium text-(--s-text-secondary) mb-3 text-center"
      :class="sizeConfig.label"
    >
      {{ label }}
    </label>

    <!-- OTP Container -->
    <div 
      class="s-otp-container relative flex items-center"
      :class="gapConfig"
    >
      <template v-for="(_, index) in length" :key="index">
        <!-- Custom box slot for complete digit box customization -->
        <slot 
          v-if="$slots.box" 
          name="box"
          :index="index"
          :value="digits[index]"
          :is-focused="activeIndex === index"
          :is-filled="!!digits[index]"
          :is-success="showSuccess"
          :is-error="showError || !!error"
          :size="size"
          :focus="() => focusInput(index)"
        >
        </slot>
        
        <!-- Default Single Digit Box -->
        <div
          v-else
          class="s-otp-box relative flex items-center justify-center overflow-hidden transition-all duration-200"
          style="perspective: 500px;"
          :class="[
            sizeConfig.box,
            roundedConfig,
            variantClasses,
            {
              // Focus states - using ring without offset to avoid white border in dark mode
              'ring-2 ring-(--s-primary)/40 border-(--s-primary)!': activeIndex === index && variant !== 'underlined',
              'border-(--s-primary)!': activeIndex === index && variant === 'underlined',
              
              // Success state
              'border-emerald-500! ring-emerald-500/30': showSuccess,
              'bg-emerald-500/10': showSuccess && (variant === 'filled' || variant === 'morphing'),
              
              // Error state
              'border-red-500!': showError || error,
              'bg-red-500/10': (showError || error) && (variant === 'filled' || variant === 'morphing'),
              
              // Entry animation
              'animate-fade-in': entryAnimation === 'fade',
              'animate-slide-up': entryAnimation === 'slide-up',
              'animate-slide-down': entryAnimation === 'slide-down',
              'animate-scale-in': entryAnimation === 'scale',
              'animate-rotate-in': entryAnimation === 'rotate',
              'animate-blur-in': entryAnimation === 'blur',
              
              // Error animation
              'animate-shake': showError && errorAnimation === 'shake',
              'animate-wobble': showError && errorAnimation === 'wobble',
              'animate-flash': showError && errorAnimation === 'flash',
              
              // Success animation
              'animate-celebrate': showSuccess && successAnimation === 'celebrate',
              'animate-check-pop': showSuccess && successAnimation === 'check',
              'animate-success-ripple': showSuccess && successAnimation === 'ripple',
              
              // Hover state
              'hover:border-(--s-border-hover)': !disabled && activeIndex !== index && !showSuccess && !showError && !error,
              
              // Morphing variant special styles
              'shadow-lg': variant === 'morphing' && activeIndex === index
            }
          ]"
          :style="{
            '--entry-delay': `${index * 50}ms`,
            animationDelay: `${index * 50}ms`
          }"
          @click="focusInput(index)"
        >
          <!-- Glow effect for morphing variant -->
          <div 
            v-if="variant === 'morphing' && activeIndex === index"
            class="absolute inset-0 bg-gradient-to-br from-(--s-primary)/20 to-transparent animate-pulse rounded-inherit"
          />
          
          <!-- Background pulse on input -->
          <div 
            v-if="animatingIndices.has(index) && inputAnimation !== 'none'"
            class="absolute inset-0 bg-(--s-primary)/10 animate-ping-once rounded-inherit"
          />
          
          <!-- Hidden input -->
          <input
            :ref="el => inputRefs[index] = el as HTMLInputElement"
            type="text"
            :inputmode="inputMode"
            :value="digits[index]"
            :disabled="disabled"
            :readonly="readonly"
            :aria-label="`${ariaLabel || 'OTP'} digit ${index + 1}`"
            class="absolute inset-0 w-full h-full text-center bg-transparent outline-none opacity-0 cursor-pointer"
            :class="{ 'cursor-not-allowed': disabled }"
            maxlength="2"
            autocomplete="one-time-code"
            @input="handleInput($event, index)"
            @keydown="handleKeydown($event, index)"
            @paste="handlePaste($event, index)"
            @focus="handleFocus(index)"
            @blur="handleBlur(index)"
          />
          
          <!-- Display character with morph animation -->
          <span 
            class="s-otp-char relative z-10 font-bold text-(--s-text-primary) select-none pointer-events-none flex items-center justify-center"
            :class="[
              sizeConfig.text,
              {
                // Character animations (only when not morphing)
                'animate-pop': animatingIndices.has(index) && !morphingIndices.has(index) && inputAnimation === 'pop' && digits[index],
                'animate-squeeze': animatingIndices.has(index) && !morphingIndices.has(index) && inputAnimation === 'squeeze' && digits[index],
                'animate-jelly': animatingIndices.has(index) && !morphingIndices.has(index) && inputAnimation === 'jelly' && digits[index],
                'animate-rubber': animatingIndices.has(index) && !morphingIndices.has(index) && inputAnimation === 'rubber' && digits[index],
                
                // Placeholder styling
                'text-(--s-text-tertiary)': !digits[index] && !morphingIndices.has(index),
                'opacity-60': !digits[index] && !morphingIndices.has(index),
                
                // Masked styling
                'text-(--s-primary)': props.masked && digits[index],
                
                // Active digit glow
                'drop-shadow-[0_0_8px_rgba(var(--s-primary-rgb),0.5)]': activeIndex === index && digits[index],
                
                // Success color
                'text-emerald-500!': showSuccess && digits[index],
                
                // Morphing 3D perspective
                'will-change-transform': morphingIndices.has(index)
              }
            ]"
            :style="getMorphStyle(index)"
          >
            <!-- Custom placeholder slot for empty unfilled state -->
            <template v-if="!digits[index] && !morphingIndices.has(index)">
              <slot 
                name="placeholder" 
                :index="index" 
                :is-focused="activeIndex === index"
                :size="size"
              >
                {{ placeholderChar }}
              </slot>
            </template>
            
            <!-- Custom mask slot for hidden/masked input -->
            <template v-else-if="masked && digits[index] && !morphingIndices.has(index)">
              <slot 
                name="mask" 
                :index="index" 
                :value="digits[index]"
                :size="size"
              >
                {{ maskChar }}
              </slot>
            </template>
            
            <!-- Custom digit slot for displayed value -->
            <template v-else-if="digits[index] && !morphingIndices.has(index)">
              <slot 
                name="digit" 
                :index="index" 
                :value="digits[index]"
                :size="size"
              >
                {{ digits[index].toUpperCase() }}
              </slot>
            </template>
            
            <!-- Morphing animation state (no slot customization during morph) -->
            <template v-else>
              {{ getDisplayChar(index) }}
            </template>
          </span>
          
          <!-- Cursor blink for empty focused -->
          <span 
            v-if="activeIndex === index && !digits[index] && !disabled && !readonly"
            class="absolute h-1/2 w-0.5 bg-(--s-primary) animate-blink rounded-full"
          />
          
        </div>
        
        <!-- Separator -->
        <span 
          v-if="shouldShowSeparator(index)"
          class="s-otp-separator text-(--s-text-tertiary) font-bold select-none"
          :class="sizeConfig.text"
        >
          {{ separator }}
        </span>
      </template>
      
      <!-- Loading indicator -->
      <div 
        v-if="loading"
        class="ml-3 flex items-center"
      >
        <span class="mdi mdi-loading animate-spin text-(--s-primary)" :class="sizeConfig.icon" />
      </div>
      
      <!-- Success checkmark overlay - spans entire OTP area -->
      <Transition
        enter-active-class="transition-all duration-400 ease-out"
        enter-from-class="opacity-0 scale-50"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-50"
      >
        <div 
          v-if="showSuccess && successAnimation === 'check'"
          class="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
        >
          <div 
            class="flex items-center justify-center bg-emerald-500 text-white rounded-full shadow-lg shadow-emerald-500/50 animate-check-bounce"
            :class="{
              'w-12 h-12 text-2xl': size === 'small',
              'w-16 h-16 text-3xl': size === 'medium',
              'w-20 h-20 text-4xl': size === 'large',
              'w-24 h-24 text-5xl': size === 'xl'
            }"
          >
            <span class="mdi mdi-check-bold animate-check-draw" />
          </div>
        </div>
      </Transition>
    </div>

    <!-- Messages -->
    <div class="s-otp-messages mt-3 text-center min-h-5">
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
        mode="out-in"
      >
        <!-- Error message -->
        <p 
          v-if="error || showError"
          key="error"
          class="text-red-500 flex items-center justify-center gap-1"
          :class="sizeConfig.hint"
        >
          <span class="mdi mdi-alert-circle" />
          {{ typeof error === 'string' ? error : errorMessage || 'Invalid code' }}
        </p>
        
        <!-- Success message -->
        <p 
          v-else-if="success || showSuccess"
          key="success"
          class="text-emerald-500 flex items-center justify-center gap-1"
          :class="sizeConfig.hint"
        >
          <span class="mdi mdi-check-circle" />
          {{ typeof success === 'string' ? success : successMessage || 'Code verified!' }}
        </p>
        
        <!-- Hint -->
        <p 
          v-else-if="hint"
          key="hint"
          class="text-(--s-text-tertiary)"
          :class="sizeConfig.hint"
        >
          {{ hint }}
        </p>
        
        <span v-else key="empty" />
      </Transition>
    </div>

    <!-- Resend section -->
    <div 
      v-if="countdown > 0 || $slots.resend"
      class="s-otp-resend mt-4 text-center"
    >
      <slot name="resend">
        <button
          type="button"
          class="text-sm transition-all duration-200"
          :class="[
            countdownValue > 0 
              ? 'text-(--s-text-tertiary) cursor-not-allowed' 
              : 'text-(--s-primary) hover:underline cursor-pointer'
          ]"
          :disabled="countdownValue > 0"
          @click="handleResend"
        >
          <template v-if="countdownValue > 0">
            {{ resendText }} in {{ formattedCountdown }}
          </template>
          <template v-else>
            {{ resendText }}
          </template>
        </button>
      </slot>
    </div>

    <!-- Confetti overlay for success -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-500"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div 
          v-if="showSuccess && successAnimation === 'confetti'"
          class="fixed inset-0 pointer-events-none z-[9999] overflow-hidden"
        >
          <div 
            v-for="i in 50" 
            :key="i"
            class="confetti-piece absolute"
            :style="{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 0.5}s`,
              backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'][i % 5]
            }"
          />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* Entry animations */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in {
  animation: fade-in 0.3s ease-out both;
  animation-delay: var(--entry-delay);
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-up {
  animation: slide-up 0.4s ease-out both;
  animation-delay: var(--entry-delay);
}

@keyframes slide-down {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-down {
  animation: slide-down 0.4s ease-out both;
  animation-delay: var(--entry-delay);
}

@keyframes scale-in {
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
}
.animate-scale-in {
  animation: scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  animation-delay: var(--entry-delay);
}

@keyframes rotate-in {
  from { opacity: 0; transform: rotate(-180deg) scale(0.5); }
  to { opacity: 1; transform: rotate(0) scale(1); }
}
.animate-rotate-in {
  animation: rotate-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  animation-delay: var(--entry-delay);
}

@keyframes blur-in {
  from { opacity: 0; filter: blur(10px); }
  to { opacity: 1; filter: blur(0); }
}
.animate-blur-in {
  animation: blur-in 0.4s ease-out both;
  animation-delay: var(--entry-delay);
}

/* Input animations */
@keyframes pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}
.animate-pop {
  animation: pop 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes squeeze {
  0% { transform: scale(1, 1); }
  30% { transform: scale(1.2, 0.8); }
  50% { transform: scale(0.9, 1.1); }
  70% { transform: scale(1.05, 0.95); }
  100% { transform: scale(1, 1); }
}
.animate-squeeze {
  animation: squeeze 0.3s ease-out;
}

@keyframes jelly {
  0% { transform: scale(1, 1); }
  25% { transform: scale(0.9, 1.1); }
  50% { transform: scale(1.1, 0.9); }
  75% { transform: scale(0.95, 1.05); }
  100% { transform: scale(1, 1); }
}
.animate-jelly {
  animation: jelly 0.4s ease-out;
}

@keyframes rubber {
  0% { transform: scale(1, 1); }
  30% { transform: scale(1.25, 0.75); }
  40% { transform: scale(0.75, 1.25); }
  50% { transform: scale(1.15, 0.85); }
  65% { transform: scale(0.95, 1.05); }
  75% { transform: scale(1.05, 0.95); }
  100% { transform: scale(1, 1); }
}
.animate-rubber {
  animation: rubber 0.5s ease-out;
}

/* Error animations */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}
.animate-shake {
  animation: shake 0.5s ease-out;
}

@keyframes wobble {
  0% { transform: translateX(0) rotate(0); }
  15% { transform: translateX(-8px) rotate(-5deg); }
  30% { transform: translateX(6px) rotate(3deg); }
  45% { transform: translateX(-4px) rotate(-3deg); }
  60% { transform: translateX(2px) rotate(2deg); }
  75% { transform: translateX(-1px) rotate(-1deg); }
  100% { transform: translateX(0) rotate(0); }
}
.animate-wobble {
  animation: wobble 0.6s ease-out;
}

@keyframes flash {
  0%, 50%, 100% { opacity: 1; }
  25%, 75% { opacity: 0.3; }
}
.animate-flash {
  animation: flash 0.5s ease-out;
}

/* Success animations */
@keyframes celebrate {
  0% { transform: scale(1); }
  10% { transform: scale(1.1) rotate(-3deg); }
  20% { transform: scale(1.1) rotate(3deg); }
  30% { transform: scale(1.1) rotate(-3deg); }
  40% { transform: scale(1.1) rotate(3deg); }
  50% { transform: scale(1.1) rotate(0); }
  100% { transform: scale(1) rotate(0); }
}
.animate-celebrate {
  animation: celebrate 0.6s ease-out;
}

@keyframes check-pop {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
.animate-check-pop {
  animation: check-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes check-bounce {
  0% { transform: scale(0) rotate(-45deg); }
  50% { transform: scale(1.2) rotate(10deg); }
  70% { transform: scale(0.9) rotate(-5deg); }
  100% { transform: scale(1) rotate(0deg); }
}
.animate-check-bounce {
  animation: check-bounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes check-draw {
  0% { 
    clip-path: inset(0 100% 0 0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% { 
    clip-path: inset(0 0 0 0);
    opacity: 1;
  }
}
.animate-check-draw {
  animation: check-draw 0.4s ease-out 0.1s both;
}

@keyframes success-ripple {
  0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
  100% { box-shadow: 0 0 0 20px rgba(16, 185, 129, 0); }
}
.animate-success-ripple {
  animation: success-ripple 0.6s ease-out;
}

/* Cursor blink */
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
.animate-blink {
  animation: blink 1s step-end infinite;
}

/* Ping once */
@keyframes ping-once {
  0% { transform: scale(1); opacity: 0.5; }
  100% { transform: scale(1.5); opacity: 0; }
}
.animate-ping-once {
  animation: ping-once 0.3s ease-out forwards;
}

/* Confetti */
@keyframes confetti-fall {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

.confetti-piece {
  width: 10px;
  height: 10px;
  animation: confetti-fall 2s ease-out forwards;
}

.confetti-piece:nth-child(odd) {
  border-radius: 50%;
}

.confetti-piece:nth-child(even) {
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}

/* Rounded inherit utility */
.rounded-inherit {
  border-radius: inherit;
}

/* Size for xl */
.w-18 {
  width: 4.5rem;
}
.h-20 {
  height: 5rem;
}
</style>
