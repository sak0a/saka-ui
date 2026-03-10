<script setup lang="ts">
import { computed, ref, type CSSProperties } from 'vue'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '~/lib/utils'
import { type IconProp, isIconComponent } from '~/lib/icon'

defineOptions({ inheritAttrs: false })

const checkboxVariants = cva(
  'relative inline-flex items-center justify-center shrink-0 border-2 transition-all duration-(--s-duration-normal) ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring',
  {
    variants: {
      size: {
        small: 'w-4 h-4',
        medium: 'w-5 h-5',
        large: 'w-6 h-6',
      },
    },
    defaultVariants: {
      size: 'medium',
    },
  }
)

export type CheckboxVariants = VariantProps<typeof checkboxVariants>

export interface Props {
  modelValue?: boolean | string | number | any[]
  value?: any
  size?: 'small' | 'medium' | 'large'
  color?: string
  disabled?: boolean
  loading?: boolean
  indeterminate?: boolean
  label?: string
  labelPosition?: 'left' | 'right'
  rounded?: boolean
  icon?: IconProp
  required?: boolean
  name?: string
  error?: string
  checkboxClass?: string
  labelClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  value: undefined,
  size: 'medium',
  color: undefined,
  disabled: false,
  loading: false,
  indeterminate: false,
  label: undefined,
  labelPosition: 'right',
  rounded: false,
  icon: 'check',
  required: false,
  name: undefined,
  error: undefined,
  checkboxClass: undefined,
  labelClass: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean | string | number | any[]]
  'change': [value: boolean | string | number | any[], event: Event]
}>()

// Ripple effect state
const isRippling = ref(false)

// Determine if this is an array-based checkbox group
const isArrayModel = computed(() => Array.isArray(props.modelValue))

// Determine checked state
const isChecked = computed(() => {
  if (isArrayModel.value) {
    return (props.modelValue as any[]).includes(props.value)
  }
  return props.modelValue === true || props.modelValue === props.value
})

// Toggle checkbox
const toggle = (event: Event) => {
  if (props.disabled || props.loading) return

  // Trigger ripple
  triggerRipple()

  let newValue: boolean | string | number | any[]

  if (isArrayModel.value) {
    const arr = [...(props.modelValue as any[])]
    const index = arr.indexOf(props.value)
    if (index === -1) {
      arr.push(props.value)
    } else {
      arr.splice(index, 1)
    }
    newValue = arr
  } else {
    newValue = !isChecked.value
  }

  emit('update:modelValue', newValue)
  emit('change', newValue, event)
}

const triggerRipple = () => {
  isRippling.value = true
  setTimeout(() => {
    isRippling.value = false
  }, 400)
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault()
    toggle(e)
  }
}

// Size configurations for icon and label
const sizeConfig = computed(() => {
  const sizes = {
    small: {
      icon: 'text-[10px]',
      label: 'text-xs',
      gap: 'gap-1.5'
    },
    medium: {
      icon: 'text-xs',
      label: 'text-sm',
      gap: 'gap-2'
    },
    large: {
      icon: 'text-sm',
      label: 'text-base',
      gap: 'gap-2.5'
    }
  }
  return sizes[props.size]
})

// Custom color override style (only when color prop is explicitly set)
const colorStyle = computed<CSSProperties | undefined>(() => {
  if (!props.color) return undefined
  if (!(isChecked.value || props.indeterminate)) return undefined
  return {
    backgroundColor: props.color,
    borderColor: props.color
  }
})

// Ripple color style
const rippleStyle = computed<CSSProperties | undefined>(() => {
  if (!props.color) return undefined
  return { backgroundColor: props.color }
})

// Determine which icon to show
const displayIcon = computed(() => {
  if (props.indeterminate) return 'minus'
  return props.icon
})

const boxClasses = computed(() => {
  return cn(
    checkboxVariants({ size: props.size }),
    rounded.value ? 'rounded-full' : 'rounded-md',
    isChecked.value || props.indeterminate
      ? props.color
        ? 'border-transparent'
        : 'border-transparent bg-primary'
      : 'border-border bg-background hover:border-muted-foreground',
    { 'cursor-not-allowed': props.disabled || props.loading },
    props.checkboxClass
  )
})

const rounded = computed(() => props.rounded)
</script>

<template>
  <div v-bind="$attrs">
    <label
      :class="cn(
        'relative inline-flex items-center cursor-pointer select-none',
        sizeConfig.gap,
        { 'opacity-(--s-opacity-disabled) cursor-not-allowed': disabled },
        { 'flex-row-reverse': labelPosition === 'left' }
      )"
  >
    <!-- Hidden input for form compatibility -->
    <input
      type="checkbox"
      :name="name"
      :checked="isChecked"
      :disabled="disabled || loading"
      :required="required"
      tabindex="-1"
      class="sr-only"
      @change="toggle"
    />

    <!-- Checkbox Box -->
    <span
      role="checkbox"
      :aria-checked="indeterminate ? 'mixed' : isChecked"
      :aria-disabled="disabled || loading"
      tabindex="0"
      :class="boxClasses"
      :style="colorStyle"
      @click.prevent="toggle"
      @keydown="handleKeydown"
    >
      <!-- Ripple Effect -->
      <span
        v-if="isRippling"
        class="absolute inset-0 animate-ping opacity-30 z-0"
        :class="[rounded ? 'rounded-full' : 'rounded-md', !color && 'bg-primary']"
        :style="rippleStyle"
      />

      <!-- Loading Spinner -->
      <span
        v-if="loading"
        :class="cn(
          'mdi mdi-loading animate-spin',
          sizeConfig.icon,
          isChecked || indeterminate ? (color ? 'text-white' : 'text-primary-foreground') : 'text-foreground'
        )"
      />

      <!-- Check Icon / Indeterminate Icon -->
      <Transition
        enter-active-class="transition-all duration-(--s-duration-normal) ease-out"
        enter-from-class="scale-0 opacity-0"
        enter-to-class="scale-100 opacity-100"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="scale-100 opacity-100"
        leave-to-class="scale-0 opacity-0"
      >
        <span
          v-if="(isChecked || indeterminate) && !loading"
          :class="cn('absolute inset-0 flex items-center justify-center', color ? 'text-white' : 'text-primary-foreground', sizeConfig.icon)"
        >
          <slot name="icon">
            <component v-if="isIconComponent(displayIcon)" :is="displayIcon" />
            <span v-else :class="['mdi', `mdi-${displayIcon}`]" />
          </slot>
        </span>
      </Transition>
    </span>

    <!-- Label -->
    <span
      v-if="label || $slots.default"
      :class="cn(
        'transition-colors text-muted-foreground',
        sizeConfig.label,
        { 'text-foreground': isChecked },
        labelClass
      )"
    >
      <slot>{{ label }}</slot>
      <span v-if="required" class="text-error ml-0.5">*</span>
    </span>
  </label>

  <!-- Error message -->
  <p v-if="error" class="mt-1 text-xs text-error flex items-center gap-1">
    <span class="mdi mdi-alert-circle" />
    {{ error }}
  </p>
  </div>
</template>

<style scoped>
.s-checkbox-box {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.s-checkbox-wrapper:hover:not(.cursor-not-allowed) .s-checkbox-box:not([aria-disabled="true"]) {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transform: scale(1.02);
}

.s-checkbox-box:focus-visible {
  box-shadow: 0 0 0 3px rgba(var(--s-primary-rgb, 16, 185, 129), 0.2);
}

/* Bounce animation for check icon */
.s-checkbox-box span[class*="mdi-check"],
.s-checkbox-box span[class*="mdi-minus"] {
  animation: checkBounce var(--s-duration-normal) ease-out;
}

@keyframes checkBounce {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
