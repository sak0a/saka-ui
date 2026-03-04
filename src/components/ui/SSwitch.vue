<script setup lang="ts">
import { computed } from 'vue'

export interface Props {
  modelValue?: boolean | string | number
  type?: 'inset' | 'outset'
  size?: 'small' | 'medium' | 'large'
  color?: string
  disabled?: boolean
  loading?: boolean
  checkedValue?: boolean | string | number
  uncheckedValue?: boolean | string | number
  labelBefore?: string
  labelAfter?: string
  checkedIcon?: string
  uncheckedIcon?: string
  checkedText?: string
  uncheckedText?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  type: 'inset',
  size: 'medium',
  color: 'var(--s-primary)',
  disabled: false,
  loading: false,
  checkedValue: true,
  uncheckedValue: false,
  labelBefore: undefined,
  labelAfter: undefined,
  checkedIcon: undefined,
  uncheckedIcon: undefined,
  checkedText: undefined,
  uncheckedText: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean | string | number]
  'change': [value: boolean | string | number]
}>()

const isChecked = computed(() => props.modelValue === props.checkedValue)
const hasTrackText = computed(() => props.checkedText || props.uncheckedText)

const toggle = () => {
  if (props.disabled || props.loading) return
  const newValue = isChecked.value ? props.uncheckedValue : props.checkedValue
  emit('update:modelValue', newValue)
  emit('change', newValue)
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault()
    toggle()
  }
}

// Size configurations for inset type (thumb inside track)
const insetSizes = {
  small: {
    track: 'w-8 h-4',
    thumb: 'w-3 h-3',
    thumbTranslate: 'translate-x-4',
    icon: 'text-[8px]',
    label: 'text-xs',
    trackText: 'text-[8px]'
  },
  medium: {
    track: 'w-11 h-6',
    thumb: 'w-5 h-5',
    thumbTranslate: 'translate-x-5',
    icon: 'text-[10px]',
    label: 'text-sm',
    trackText: 'text-[10px]'
  },
  large: {
    track: 'w-14 h-7',
    thumb: 'w-6 h-6',
    thumbTranslate: 'translate-x-7',
    icon: 'text-xs',
    label: 'text-base',
    trackText: 'text-xs'
  }
}

// Size configurations for outset type (thumb larger than track)
const outsetSizes = {
  small: {
    track: 'w-7 h-3',
    thumb: 'w-4 h-4',
    thumbTranslate: 'translate-x-3',
    icon: 'text-[8px]',
    label: 'text-xs',
    trackText: 'text-[6px]'
  },
  medium: {
    track: 'w-10 h-4',
    thumb: 'w-6 h-6',
    thumbTranslate: 'translate-x-4',
    icon: 'text-[10px]',
    label: 'text-sm',
    trackText: 'text-[8px]'
  },
  large: {
    track: 'w-12 h-5',
    thumb: 'w-7 h-7',
    thumbTranslate: 'translate-x-5',
    icon: 'text-xs',
    label: 'text-base',
    trackText: 'text-[10px]'
  }
}

const sizeConfig = computed(() => {
  const sizes = props.type === 'outset' ? outsetSizes : insetSizes
  return sizes[props.size]
})

const trackStyle = computed(() => {
  if (isChecked.value) {
    return { backgroundColor: props.color }
  }
  return {}
})
</script>

<template>
  <div 
    class="s-switch-wrapper inline-flex items-center gap-2"
    :class="{ 'opacity-50 cursor-not-allowed': disabled }"
  >
    <!-- Label Before -->
    <span 
      v-if="labelBefore" 
      class="s-switch-label text-(--s-text-secondary)"
      :class="sizeConfig.label"
    >
      {{ labelBefore }}
    </span>
    
    <!-- Switch Track -->
    <button
      type="button"
      role="switch"
      :aria-checked="isChecked"
      :disabled="disabled || loading"
      class="s-switch-track relative inline-flex items-center shrink-0 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-(--s-primary)"
      :class="[
        hasTrackText ? 'min-w-16 px-1' : sizeConfig.track,
        !hasTrackText && (isChecked ? '' : 'bg-(--s-bg-tertiary)'),
        hasTrackText && (isChecked ? '' : 'bg-(--s-bg-tertiary)'),
        { 'cursor-pointer': !disabled && !loading, 'cursor-not-allowed': disabled || loading },
        { 'h-6': hasTrackText && size === 'medium', 'h-5': hasTrackText && size === 'small', 'h-7': hasTrackText && size === 'large' }
      ]"
      :style="trackStyle"
      @click="toggle"
      @keydown="handleKeydown"
    >
      <!-- Track Text (unchecked - right side) -->
      <span 
        v-if="hasTrackText && !isChecked && uncheckedText"
        class="absolute right-2 text-white font-semibold select-none"
        :class="sizeConfig.trackText"
      >
        {{ uncheckedText }}
      </span>
      
      <!-- Track Text (checked - left side) -->
      <span 
        v-if="hasTrackText && isChecked && checkedText"
        class="absolute left-2 text-white font-semibold select-none"
        :class="sizeConfig.trackText"
      >
        {{ checkedText }}
      </span>

      <!-- Thumb -->
      <span
        class="s-switch-thumb inline-flex items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 ease-in-out z-10"
        :class="[
          hasTrackText ? 'w-5 h-5' : sizeConfig.thumb,
          hasTrackText 
            ? (isChecked ? 'ml-auto' : 'mr-auto') 
            : (isChecked ? sizeConfig.thumbTranslate : 'translate-x-0.5')
        ]"
      >
        <!-- Loading Spinner -->
        <span 
          v-if="loading" 
          class="mdi mdi-loading animate-spin text-(--s-text-tertiary)"
          :class="sizeConfig.icon"
        ></span>
        
        <!-- Custom Icons via Slots -->
        <template v-else>
          <slot v-if="isChecked" name="checked-icon">
            <span 
              v-if="checkedIcon" 
              :class="['mdi', `mdi-${checkedIcon}`, sizeConfig.icon]"
              :style="{ color: color }"
            ></span>
          </slot>
          <slot v-else name="unchecked-icon">
            <span 
              v-if="uncheckedIcon" 
              :class="['mdi', `mdi-${uncheckedIcon}`, sizeConfig.icon, 'text-(--s-text-tertiary)']"
            ></span>
          </slot>
        </template>
      </span>
    </button>
    
    <!-- Label After -->
    <span 
      v-if="labelAfter" 
      class="s-switch-label text-(--s-text-secondary)"
      :class="sizeConfig.label"
    >
      {{ labelAfter }}
    </span>
  </div>
</template>

<style scoped>
.s-switch-track {
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.s-switch-thumb {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.1);
}

.s-switch-wrapper:hover:not(.cursor-not-allowed) .s-switch-thumb {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.12);
}

.s-switch-label {
  user-select: none;
}
</style>

