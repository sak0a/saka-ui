<script setup lang="ts">
import { computed, ref } from 'vue'

defineOptions({ inheritAttrs: false })

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
  icon?: string
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
  color: 'var(--s-primary)',
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

// Size configurations
const sizeConfig = computed(() => {
  const sizes = {
    small: {
      box: 'w-4 h-4',
      icon: 'text-[10px]',
      label: 'text-xs',
      gap: 'gap-1.5'
    },
    medium: {
      box: 'w-5 h-5',
      icon: 'text-xs',
      label: 'text-sm',
      gap: 'gap-2'
    },
    large: {
      box: 'w-6 h-6',
      icon: 'text-sm',
      label: 'text-base',
      gap: 'gap-2.5'
    }
  }
  return sizes[props.size]
})

// Computed styles for the checkbox box
const boxStyle = computed(() => {
  if (isChecked.value || props.indeterminate) {
    return {
      backgroundColor: props.color,
      borderColor: props.color
    }
  }
  return {}
})

// Determine which icon to show
const displayIcon = computed(() => {
  if (props.indeterminate) return 'minus'
  return props.icon
})
</script>

<template>
  <div class="s-checkbox-container" v-bind="$attrs">
    <label 
      class="s-checkbox-wrapper relative inline-flex items-center cursor-pointer select-none"
      :class="[
        sizeConfig.gap,
        { 'opacity-50 cursor-not-allowed': disabled },
        { 'flex-row-reverse': labelPosition === 'left' }
      ]"
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
      class="s-checkbox-box relative inline-flex items-center justify-center shrink-0 border-2 transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-(--s-primary)"
      :class="[
        sizeConfig.box,
        rounded ? 'rounded-full' : 'rounded-md',
        isChecked || indeterminate
          ? 'border-transparent'
          : 'border-(--s-border) bg-(--s-bg-primary) hover:border-(--s-text-tertiary)',
        { 'cursor-not-allowed': disabled || loading },
        checkboxClass
      ]"
      :style="boxStyle"
      @click.prevent="toggle"
      @keydown="handleKeydown"
    >
      <!-- Ripple Effect -->
      <span 
        v-if="isRippling" 
        class="absolute inset-0 animate-ping opacity-30 z-0"
        :class="rounded ? 'rounded-full' : 'rounded-md'"
        :style="{ backgroundColor: color }"
      />
      
      <!-- Loading Spinner -->
      <span 
        v-if="loading" 
        class="mdi mdi-loading animate-spin"
        :class="[sizeConfig.icon, isChecked || indeterminate ? 'text-white' : 'text-(--s-text-primary)']"
      />
      
      <!-- Check Icon / Indeterminate Icon -->
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="scale-0 opacity-0"
        enter-to-class="scale-100 opacity-100"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="scale-100 opacity-100"
        leave-to-class="scale-0 opacity-0"
      >
        <span 
          v-if="(isChecked || indeterminate) && !loading"
          class="absolute inset-0 flex items-center justify-center text-white"
          :class="sizeConfig.icon"
        >
          <slot name="icon">
            <span :class="['mdi', `mdi-${displayIcon}`]" />
          </slot>
        </span>
      </Transition>
    </span>
    
    <!-- Label -->
    <span 
      v-if="label || $slots.default" 
      class="s-checkbox-label text-(--s-text-secondary) transition-colors"
      :class="[
        sizeConfig.label,
        { 'text-(--s-text-primary)': isChecked },
        labelClass
      ]"
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
  animation: checkBounce 0.2s ease-out;
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
