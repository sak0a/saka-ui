<script setup lang="ts">
defineOptions({ inheritAttrs: false })

import { computed } from 'vue'
import { cn } from '~/lib/utils'
import { useSOTPContext } from './useOTPContext'
import type {
  SOTPVariant, SOTPSize, SOTPRounded,
  SOTPAnimation, SOTPEntryAnimation, SOTPInputAnimation,
  SOTPSuccessAnimation, SOTPErrorAnimation
} from './types'

interface Props {
  index: number
  variant?: SOTPVariant
  size?: SOTPSize
  color?: string
  rounded?: SOTPRounded
  animation?: SOTPAnimation
  entryAnimation?: SOTPEntryAnimation
  inputAnimation?: SOTPInputAnimation
  successAnimation?: SOTPSuccessAnimation
  errorAnimation?: SOTPErrorAnimation
  morphText?: boolean
  morphDuration?: number
  showPlaceholder?: boolean
  placeholderChar?: string
  maskChar?: string
}

const props = defineProps<Props>()
const ctx = useSOTPContext()

// Resolve visual props: own prop > root default
const r = computed(() => {
  const d = ctx.defaults.value
  return {
    variant: props.variant ?? d.variant,
    size: props.size ?? d.size,
    color: props.color ?? d.color,
    rounded: props.rounded ?? d.rounded,
    animation: props.animation ?? d.animation,
    entryAnimation: props.entryAnimation ?? d.entryAnimation,
    inputAnimation: props.inputAnimation ?? d.inputAnimation,
    successAnimation: props.successAnimation ?? d.successAnimation,
    errorAnimation: props.errorAnimation ?? d.errorAnimation,
    morphText: props.morphText ?? d.morphText,
    morphDuration: props.morphDuration ?? d.morphDuration,
    showPlaceholder: props.showPlaceholder ?? d.showPlaceholder,
    placeholderChar: props.placeholderChar ?? d.placeholderChar,
    maskChar: props.maskChar ?? d.maskChar,
  }
})

// Size configurations
const sizeConfig = computed(() => {
  const sizes: Record<SOTPSize, { box: string; text: string }> = {
    small: { box: 'w-9 h-10', text: 'text-lg' },
    medium: { box: 'w-12 h-14', text: 'text-2xl' },
    large: { box: 'w-14 h-16', text: 'text-3xl' },
    xl: { box: 'w-18 h-20', text: 'text-4xl' }
  }
  return sizes[r.value.size]
})

// Rounded configurations
const roundedConfig = computed(() => {
  const radii: Record<SOTPRounded, string> = {
    none: 'rounded-none',
    sm: 'rounded',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    full: 'rounded-full'
  }
  return radii[r.value.rounded]
})

// Variant classes
const variantClasses = computed(() => {
  const base: Record<SOTPVariant, string> = {
    outlined: 'border-2 bg-background border-border',
    filled: 'border-2 border-transparent bg-accent',
    underlined: 'border-b-2 border-t-0 border-l-0 border-r-0 rounded-none! bg-transparent border-border',
    ghost: 'border-2 border-transparent bg-transparent',
    morphing: 'border-2 bg-muted border-border shadow-inner'
  }
  return base[r.value.variant]
})

// Template ref callback — registers input element with parent context
const setInputRef = (el: any) => {
  ctx.registerInput(props.index, el as HTMLInputElement | null)
}

// Convenience accessors
const digit = computed(() => ctx.digits.value[props.index])
const isFocused = computed(() => ctx.activeIndex.value === props.index)
const isAnimating = computed(() => ctx.animatingIndices.value.has(props.index))
const isMorphing = computed(() => ctx.morphingIndices.value.has(props.index))
</script>

<template>
  <div
    v-bind="$attrs"
    style="perspective: 500px;"
    :class="cn(
      's-otp-box relative flex items-center justify-center overflow-hidden transition-all duration-200',
      sizeConfig.box,
      roundedConfig,
      variantClasses,
      {
        // Focus states
        'ring-2 ring-primary/40 border-primary!': isFocused && r.variant !== 'underlined',
        'border-primary!': isFocused && r.variant === 'underlined',

        // Success state
        'border-emerald-500! ring-emerald-500/30': ctx.showSuccess.value,
        'bg-emerald-500/10': ctx.showSuccess.value && (r.variant === 'filled' || r.variant === 'morphing'),

        // Error state
        'border-red-500!': ctx.showError.value || ctx.error.value,
        'bg-red-500/10': (ctx.showError.value || ctx.error.value) && (r.variant === 'filled' || r.variant === 'morphing'),

        // Entry animation
        'animate-fade-in': r.entryAnimation === 'fade',
        'animate-slide-up': r.entryAnimation === 'slide-up',
        'animate-slide-down': r.entryAnimation === 'slide-down',
        'animate-scale-in': r.entryAnimation === 'scale',
        'animate-rotate-in': r.entryAnimation === 'rotate',
        'animate-blur-in': r.entryAnimation === 'blur',

        // Error animation
        'animate-shake': ctx.showError.value && r.errorAnimation === 'shake',
        'animate-wobble': ctx.showError.value && r.errorAnimation === 'wobble',
        'animate-flash': ctx.showError.value && r.errorAnimation === 'flash',

        // Success animation
        'animate-celebrate': ctx.showSuccess.value && r.successAnimation === 'celebrate',
        'animate-check-pop': ctx.showSuccess.value && r.successAnimation === 'check',
        'animate-success-ripple': ctx.showSuccess.value && r.successAnimation === 'ripple',

        // Hover state
        'hover:border-input': !ctx.disabled.value && !isFocused && !ctx.showSuccess.value && !ctx.showError.value && !ctx.error.value,

        // Morphing variant special styles
        'shadow-lg': r.variant === 'morphing' && isFocused
      },
      $attrs.class ?? ''
    )"
    :style="{
      '--entry-delay': `${props.index * 50}ms`,
      animationDelay: `${props.index * 50}ms`
    }"
    @click="ctx.focusInput(props.index)"
  >
    <!-- Glow effect for morphing variant -->
    <div
      v-if="r.variant === 'morphing' && isFocused"
      class="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent animate-pulse rounded-inherit"
    />

    <!-- Background pulse on input -->
    <div
      v-if="isAnimating && r.inputAnimation !== 'none'"
      class="absolute inset-0 bg-primary/10 animate-ping-once rounded-inherit"
    />

    <!-- Hidden input -->
    <input
      :ref="setInputRef"
      type="text"
      :inputmode="ctx.inputMode.value"
      :value="digit"
      :disabled="ctx.disabled.value"
      :readonly="ctx.readonly.value"
      :aria-label="`${ctx.ariaLabel.value || 'OTP'} digit ${props.index + 1}`"
      class="absolute inset-0 w-full h-full text-center bg-transparent outline-none opacity-0 cursor-pointer"
      :class="{ 'cursor-not-allowed': ctx.disabled.value }"
      maxlength="2"
      autocomplete="one-time-code"
      @input="ctx.handleInput($event, props.index)"
      @keydown="ctx.handleKeydown($event, props.index)"
      @paste="ctx.handlePaste($event, props.index)"
      @focus="ctx.handleFocus(props.index)"
      @blur="ctx.handleBlur(props.index)"
    />

    <!-- Display character with morph animation -->
    <span
      class="s-otp-char relative z-10 font-bold text-foreground select-none pointer-events-none flex items-center justify-center"
      :class="[
        sizeConfig.text,
        {
          // Character animations (only when not morphing)
          'animate-pop': isAnimating && !isMorphing && r.inputAnimation === 'pop' && digit,
          'animate-squeeze': isAnimating && !isMorphing && r.inputAnimation === 'squeeze' && digit,
          'animate-jelly': isAnimating && !isMorphing && r.inputAnimation === 'jelly' && digit,
          'animate-rubber': isAnimating && !isMorphing && r.inputAnimation === 'rubber' && digit,

          // Placeholder styling
          'text-muted-foreground': !digit && !isMorphing,
          'opacity-60': !digit && !isMorphing,

          // Masked styling
          'text-primary': ctx.masked.value && digit,

          // Active digit glow
          'drop-shadow-[0_0_8px_color-mix(in_srgb,var(--s-primary)_50%,transparent)]': isFocused && digit,

          // Success color
          'text-emerald-500!': ctx.showSuccess.value && digit,

          // Morphing 3D perspective
          'will-change-transform': isMorphing
        }
      ]"
      :style="ctx.getMorphStyle(props.index)"
    >
      <!-- Custom placeholder slot for empty unfilled state -->
      <template v-if="!digit && !isMorphing">
        <slot
          name="placeholder"
          :index="props.index"
          :is-focused="isFocused"
          :size="r.size"
        >
          {{ r.placeholderChar }}
        </slot>
      </template>

      <!-- Custom mask slot for hidden/masked input -->
      <template v-else-if="ctx.masked.value && digit && !isMorphing">
        <slot
          name="mask"
          :index="props.index"
          :value="digit"
          :size="r.size"
        >
          {{ r.maskChar }}
        </slot>
      </template>

      <!-- Custom digit slot for displayed value -->
      <template v-else-if="digit && !isMorphing">
        <slot
          name="digit"
          :index="props.index"
          :value="digit"
          :size="r.size"
        >
          {{ digit.toUpperCase() }}
        </slot>
      </template>

      <!-- Morphing animation state (no slot customization during morph) -->
      <template v-else>
        {{ ctx.getDisplayChar(props.index) }}
      </template>
    </span>

    <!-- Cursor blink for empty focused -->
    <span
      v-if="isFocused && !digit && !ctx.disabled.value && !ctx.readonly.value"
      class="absolute h-1/2 w-0.5 bg-primary animate-blink rounded-full"
    />
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
