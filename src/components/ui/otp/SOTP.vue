<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted, provide, toRef } from 'vue'
import { cn } from '~/lib/utils'
import type { SOTPVariant, SOTPSize, SOTPRounded, SOTPGap, SOTPMode, SOTPAnimation, SOTPEntryAnimation, SOTPInputAnimation, SOTPSuccessAnimation, SOTPErrorAnimation, SOTPVisualDefaults } from './types'
import { SOTP_INJECTION_KEY } from './useOTPContext'
import type { SOTPContext } from './useOTPContext'

defineOptions({ inheritAttrs: false })

export interface Props {
  // Core
  modelValue?: string
  maxlength?: number
  mode?: SOTPMode

  // Visual Design
  variant?: SOTPVariant
  size?: SOTPSize
  color?: string
  rounded?: SOTPRounded
  gap?: SOTPGap

  // Animations
  animation?: SOTPAnimation
  entryAnimation?: SOTPEntryAnimation
  inputAnimation?: SOTPInputAnimation
  successAnimation?: SOTPSuccessAnimation
  errorAnimation?: SOTPErrorAnimation

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
  maxlength: 6,
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
const containerRef = ref<HTMLElement | null>(null) // used as template ref
void containerRef
const digits = ref<string[]>(Array(props.maxlength).fill(''))
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
  isComplete.value = value.length === props.maxlength && digits.value.every(d => d !== '')

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
  if (value && index < props.maxlength - 1) {
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
    if (index < props.maxlength - 1) {
      focusInput(index + 1)
    }

  } else if (key === 'Home') {
    event.preventDefault()
    focusInput(0)

  } else if (key === 'End') {
    event.preventDefault()
    focusInput(props.maxlength - 1)
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
  const chars = cleanedData.split('').slice(0, props.maxlength - index)
  chars.forEach((char, i) => {
    if (index + i < props.maxlength) {
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
    focusInput(Math.min(index + chars.length, props.maxlength - 1))
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
  digits.value = Array(props.maxlength).fill('')
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

// Register input from SOTPSlot
const registerInput = (index: number, el: HTMLInputElement | null) => {
  inputRefs.value[index] = el
}

// Visual defaults computed
const defaults = computed<SOTPVisualDefaults>(() => ({
  variant: props.variant,
  size: props.size,
  color: props.color,
  rounded: props.rounded,
  animation: props.animation,
  entryAnimation: props.entryAnimation,
  inputAnimation: props.inputAnimation,
  successAnimation: props.successAnimation,
  errorAnimation: props.errorAnimation,
  morphText: props.morphText,
  morphDuration: props.morphDuration,
  showPlaceholder: props.showPlaceholder,
  placeholderChar: props.placeholderChar,
  maskChar: props.maskChar,
}))

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

// Provide context for SOTPSlot children
provide(SOTP_INJECTION_KEY, {
  digits,
  activeIndex,
  isComplete: isComplete as any,
  showSuccess,
  showError,
  animatingIndices,
  morphingIndices,
  maxlength: toRef(props, 'maxlength'),
  mode: toRef(props, 'mode'),
  masked: toRef(props, 'masked'),
  disabled: toRef(props, 'disabled'),
  readonly: toRef(props, 'readonly'),
  loading: toRef(props, 'loading'),
  allowPaste: toRef(props, 'allowPaste'),
  error: toRef(props, 'error') as any,
  success: toRef(props, 'success') as any,
  ariaLabel: toRef(props, 'ariaLabel') as any,
  defaults,
  inputPattern,
  inputMode,
  registerInput,
  handleInput,
  handleKeydown,
  handlePaste,
  handleFocus,
  handleBlur,
  focusInput,
  startMorphAnimation,
  getMorphStyle,
  getDisplayChar,
} satisfies SOTPContext)

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
  const chars = newValue.split('').slice(0, props.maxlength)
  digits.value = [...chars, ...Array(props.maxlength - chars.length).fill('')]
  checkComplete()
}, { immediate: true })

// Watch for maxlength prop changes
watch(() => props.maxlength, (newLength, oldLength) => {
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
    v-bind="$attrs"
    :class="cn(
      's-otp-wrapper flex flex-col items-center w-fit',
      disabled && 'opacity-50 pointer-events-none',
      $attrs.class ?? ''
    )"
  >
    <!-- Label -->
    <label
      v-if="label"
      class="s-otp-label font-medium text-muted-foreground mb-3 text-center"
      :class="sizeConfig.label"
    >
      {{ label }}
    </label>

    <!-- OTP Container — children (SOTPGroup > SOTPSlot) go here -->
    <div
      class="s-otp-container relative flex items-center"
      :class="gapConfig"
    >
      <slot />

      <!-- Loading indicator -->
      <div v-if="loading" class="ml-3 flex items-center">
        <span class="mdi mdi-loading animate-spin text-primary" :class="sizeConfig.icon" />
      </div>

      <!-- Success checkmark overlay (global effect) -->
      <Transition
        enter-active-class="transition-all duration-400 ease-out"
        enter-from-class="opacity-0 scale-50"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-50"
      >
        <div
          v-if="showSuccess && defaults.successAnimation === 'check'"
          class="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
        >
          <div
            class="flex items-center justify-center bg-emerald-500 text-white rounded-full shadow-lg shadow-emerald-500/50 animate-check-bounce"
            :class="{
              'w-12 h-12 text-2xl': defaults.size === 'small',
              'w-16 h-16 text-3xl': defaults.size === 'medium',
              'w-20 h-20 text-4xl': defaults.size === 'large',
              'w-24 h-24 text-5xl': defaults.size === 'xl'
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
          class="text-muted-foreground"
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
              ? 'text-muted-foreground cursor-not-allowed'
              : 'text-primary hover:underline cursor-pointer'
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

  </div>
</template>

<style scoped>
/* Success check animations */
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
</style>
