<script setup lang="ts">
import { computed, ref, inject, type CSSProperties } from 'vue'
import { cn } from '~/lib/utils'

defineOptions({ inheritAttrs: false })

export interface Props {
  modelValue?: any
  value?: any
  size?: 'small' | 'medium' | 'large'
  color?: string
  disabled?: boolean
  loading?: boolean
  label?: string
  labelPosition?: 'left' | 'right'
  variant?: 'default' | 'filled' | 'outlined' | 'button'
  icon?: string
  required?: boolean
  name?: string
  error?: string
  radioClass?: string
  labelClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  value: undefined,
  size: 'medium',
  color: undefined,
  disabled: false,
  loading: false,
  label: undefined,
  labelPosition: 'right',
  variant: 'default',
  icon: undefined,
  required: false,
  name: undefined,
  error: undefined,
  radioClass: undefined,
  labelClass: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: any]
  'change': [value: any, event: Event]
}>()

// Inject from RadioGroup if present
const groupValue = inject<{ value: any } | undefined>('radioGroupValue', undefined)
const groupDisabled = inject('radioGroupDisabled', false)
const groupSize = inject<string | undefined>('radioGroupSize', undefined)
const groupColor = inject<string | undefined>('radioGroupColor', undefined)
const groupVariant = inject<string | undefined>('radioGroupVariant', undefined)
const groupUpdate = inject<((val: any) => void) | undefined>('radioGroupUpdate', undefined)

// Ripple effect state
const isRippling = ref(false)

// Determine if controlled by group or standalone
const currentValue = computed(() => groupValue?.value ?? props.modelValue)
const isDisabled = computed(() => props.disabled || groupDisabled)
const currentSize = computed(() => groupSize ?? props.size)
const currentColor = computed(() => groupColor ?? props.color)
const currentVariant = computed(() => groupVariant ?? props.variant)

// Whether a custom color is set
const hasCustomColor = computed(() => !!currentColor.value)

// Determine checked state
const isChecked = computed(() => currentValue.value === props.value)

// Select this radio
const select = (event: Event) => {
  if (isDisabled.value || props.loading) return

  // Trigger ripple
  triggerRipple()

  if (groupUpdate) {
    groupUpdate(props.value)
  } else {
    emit('update:modelValue', props.value)
    emit('change', props.value, event)
  }
}

const triggerRipple = () => {
  isRippling.value = true
  setTimeout(() => {
    isRippling.value = false
  }, 500)
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault()
    select(e)
  }
}

// Size configurations
const sizeConfig = computed(() => {
  const sizes = {
    small: {
      outer: 'w-4 h-4',
      inner: 'w-1.5 h-1.5',
      icon: 'text-[8px]',
      label: 'text-xs',
      gap: 'gap-1.5',
      button: 'px-3 py-1.5 text-xs'
    },
    medium: {
      outer: 'w-5 h-5',
      inner: 'w-2.5 h-2.5',
      icon: 'text-[10px]',
      label: 'text-sm',
      gap: 'gap-2',
      button: 'px-4 py-2 text-sm'
    },
    large: {
      outer: 'w-6 h-6',
      inner: 'w-3 h-3',
      icon: 'text-xs',
      label: 'text-base',
      gap: 'gap-2.5',
      button: 'px-5 py-2.5 text-base'
    }
  }
  return sizes[currentSize.value as keyof typeof sizes]
})

// Computed styles for the radio
const radioStyle = computed<CSSProperties>(() => {
  if (isChecked.value && currentVariant.value !== 'button' && hasCustomColor.value) {
    return {
      borderColor: currentColor.value,
      boxShadow: `0 0 0 3px ${currentColor.value}20`
    }
  }
  return {}
})

const dotStyle = computed<CSSProperties>(() => {
  if (isChecked.value && hasCustomColor.value) {
    return {
      backgroundColor: currentColor.value
    }
  }
  return {}
})

const buttonStyle = computed<CSSProperties>(() => {
  if (currentVariant.value === 'button') {
    if (isChecked.value && hasCustomColor.value) {
      return {
        backgroundColor: currentColor.value,
        borderColor: currentColor.value,
        color: '#ffffff'
      }
    }
  }
  return {}
})
</script>

<template>
  <div class="s-radio-container" v-bind="$attrs">
  <!-- Button Variant -->
  <button
    v-if="currentVariant === 'button'"
    type="button"
    role="radio"
    :aria-checked="isChecked"
    :aria-disabled="isDisabled || loading"
    :disabled="isDisabled || loading"
    :class="cn(
      's-radio-button relative inline-flex items-center justify-center border-2 rounded-lg font-medium transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring select-none',
      sizeConfig.button,
      isChecked
        ? hasCustomColor
          ? 'border-transparent shadow-lg'
          : 'border-transparent shadow-lg bg-primary text-primary-foreground'
        : 'border-border bg-background text-muted-foreground hover:border-input hover:text-foreground',
      { 'opacity-50 cursor-not-allowed': isDisabled || loading },
      { 'cursor-pointer': !isDisabled && !loading }
    )"
    :style="buttonStyle"
    @click="select"
    @keydown="handleKeydown"
  >
    <!-- Loading Spinner -->
    <span
      v-if="loading"
      class="mdi mdi-loading animate-spin mr-2"
    ></span>

    <!-- Icon -->
    <span
      v-if="icon && !loading"
      :class="['mdi', `mdi-${icon}`, 'mr-2']"
    ></span>

    <!-- Label -->
    <slot>{{ label }}</slot>

    <!-- Ripple Effect -->
    <span
      v-if="isRippling"
      class="absolute inset-0 rounded-lg animate-ping opacity-20"
      :style="hasCustomColor ? { backgroundColor: currentColor } : {}"
      :class="{ 'bg-primary': !hasCustomColor }"
    />
  </button>

  <!-- Standard Radio Variants -->
  <label
    v-else
    :class="cn(
      's-radio-wrapper relative inline-flex items-center cursor-pointer select-none',
      sizeConfig.gap,
      { 'opacity-50 cursor-not-allowed': isDisabled },
      { 'flex-row-reverse': labelPosition === 'left' }
    )"
  >
    <!-- Hidden input for form compatibility -->
    <input
      type="radio"
      :name="name"
      :value="value"
      :checked="isChecked"
      :disabled="isDisabled || loading"
      :required="required"
      tabindex="-1"
      class="sr-only"
      @change="select"
    />

    <!-- Radio Circle -->
    <span
      role="radio"
      :aria-checked="isChecked"
      :aria-disabled="isDisabled || loading"
      tabindex="0"
      :class="cn(
        's-radio-outer relative inline-flex items-center justify-center shrink-0 rounded-full border-2 transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring',
        sizeConfig.outer,
        isChecked
          ? hasCustomColor
            ? ''
            : 'border-primary shadow-[0_0_0_3px_color-mix(in_srgb,var(--s-ring)_12%,transparent)]'
          : 'border-border hover:border-input',
        currentVariant === 'filled' && isChecked ? 'border-transparent' : '',
        currentVariant === 'outlined' && isChecked ? 'border-2' : '',
        { 'cursor-not-allowed': isDisabled || loading },
        radioClass
      )"
      :style="radioStyle"
      @click.prevent="select"
      @keydown="handleKeydown"
    >
      <!-- Ripple Effect -->
      <span
        v-if="isRippling"
        class="absolute inset-0 rounded-full animate-ping opacity-30"
        :style="hasCustomColor ? { backgroundColor: currentColor } : {}"
        :class="{ 'bg-primary': !hasCustomColor }"
      />

      <!-- Background for filled variant -->
      <span
        v-if="currentVariant === 'filled' && isChecked"
        class="absolute inset-0 rounded-full transition-all duration-300"
        :style="hasCustomColor ? { backgroundColor: currentColor } : {}"
        :class="{ 'bg-primary': !hasCustomColor }"
      />

      <!-- Loading Spinner -->
      <span
        v-if="loading"
        class="mdi mdi-loading animate-spin z-10"
        :class="[sizeConfig.icon, isChecked && currentVariant === 'filled' ? 'text-white' : 'text-foreground']"
      />

      <!-- Inner Dot / Icon -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="scale-0 opacity-0"
        enter-to-class="scale-100 opacity-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="scale-100 opacity-100"
        leave-to-class="scale-0 opacity-0"
      >
        <span
          v-if="isChecked && !loading"
          class="z-10"
          :class="currentVariant === 'filled' ? 'text-white' : ''"
        >
          <slot name="icon">
            <span
              v-if="icon"
              :class="cn('mdi', `mdi-${icon}`, sizeConfig.icon, currentVariant !== 'filled' && !hasCustomColor ? 'text-primary' : '')"
              :style="currentVariant !== 'filled' && hasCustomColor ? { color: currentColor } : {}"
            />
            <span
              v-else
              :class="cn(
                's-radio-inner block rounded-full transition-all duration-300',
                sizeConfig.inner,
                currentVariant === 'filled' ? 'bg-white' : '',
                currentVariant !== 'filled' && !hasCustomColor ? 'bg-primary' : ''
              )"
              :style="currentVariant !== 'filled' && hasCustomColor ? dotStyle : {}"
            />
          </slot>
        </span>
      </Transition>
    </span>

    <!-- Label -->
    <span
      v-if="label || $slots.default"
      :class="cn(
        's-radio-label text-muted-foreground transition-colors duration-200',
        sizeConfig.label,
        { 'text-foreground': isChecked },
        labelClass
      )"
    >
      <slot>{{ label }}</slot>
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </span>
  </label>

  <!-- Error message -->
  <p v-if="error" class="mt-1 text-xs text-red-500 flex items-center gap-1">
    <span class="mdi mdi-alert-circle" />
    {{ error }}
  </p>
  </div>
</template>

<style scoped>
.s-radio-outer {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  background: var(--s-background);
  overflow: hidden;
}

.s-radio-wrapper:hover:not(.cursor-not-allowed) .s-radio-outer:not([aria-disabled="true"]) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  transform: scale(1.05);
}

.s-radio-outer:focus-visible {
  box-shadow: 0 0 0 3px rgba(var(--s-primary-rgb, 16, 185, 129), 0.25);
}

/* Spring bounce animation for the inner dot */
.s-radio-inner {
  animation: radioBounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes radioBounce {
  0% {
    transform: scale(0);
  }
  60% {
    transform: scale(1.3);
  }
  80% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}

/* Button variant hover lift */
.s-radio-button:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.s-radio-button:not(:disabled):active {
  transform: translateY(0);
}

/* Pulse animation for highlighted options */
.s-radio-outer[data-pulse="true"]::before {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 9999px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0;
    transform: scale(0.8);
  }
  50% {
    opacity: 0.3;
    transform: scale(1.2);
  }
}
</style>
