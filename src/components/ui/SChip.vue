<script setup lang="ts">
import { computed } from 'vue'

export interface Props {
  variant?: 'filled' | 'outlined' | 'light'
  size?: 'small' | 'medium' | 'large'
  color?: string
  closable?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'filled',
  size: 'medium',
  color: 'var(--s-primary)',
  closable: false,
  disabled: false
})

const emit = defineEmits<{
  close: []
  click: []
}>()

const computedStyle = computed(() => {
  const style: Record<string, string> = {}
  
  // Use the color prop directly if it's a hex/rgba, 
  // or it will use the CSS variable provided by default
  const colorValue = props.color
  
  if (props.variant === 'filled') {
    style.backgroundColor = colorValue
    style.color = '#fff' // Maintain white text for filled chips unless we want theme-aware text
  } else if (props.variant === 'outlined') {
    style.border = `1.5px solid ${colorValue}`
    style.color = colorValue
    style.backgroundColor = 'transparent'
  } else if (props.variant === 'light') {
    // If it's a variable, we use alpha from CSS variable if available
    if (colorValue.includes('var(--s-primary)')) {
      style.backgroundColor = 'var(--s-primary-alpha)'
    } else {
      style.backgroundColor = `${colorValue}20`
    }
    style.color = colorValue
  }
  
  if (props.disabled) {
    style.opacity = '0.5'
    style.cursor = 'not-allowed'
  }
  
  return style
})

const sizeClasses = computed(() => {
  const sizes = {
    small: 'text-xs px-2 py-0.5 gap-1',
    medium: 'text-sm px-3 py-1 gap-1.5',
    large: 'text-base px-4 py-1.5 gap-2'
  }
  return sizes[props.size]
})

const handleClose = (e: Event) => {
  e.stopPropagation()
  if (!props.disabled) {
    emit('close')
  }
}

const handleClick = () => {
  if (!props.disabled) {
    emit('click')
  }
}
</script>

<template>
  <div 
    class="s-chip inline-flex items-center rounded-full font-medium transition-all duration-300"
    :class="[sizeClasses, { 'cursor-pointer hover:brightness-110 active:scale-95': !disabled }]"
    :style="computedStyle"
    @click="handleClick"
  >
    <span class="chip-content">
      <slot />
    </span>
    <button
      v-if="closable"
      class="chip-close-btn ml-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
      :class="{
        'w-3.5 h-3.5 text-xs': size === 'small',
        'w-4.5 h-4.5 text-sm': size === 'medium',
        'w-5.5 h-5.5 text-base': size === 'large'
      }"
      @click="handleClose"
      :disabled="disabled"
    >
      <span class="leading-none">×</span>
    </button>
  </div>
</template>

<style scoped>
.s-chip {
  user-select: none;
  -webkit-user-select: none;
  border: 1px solid transparent;
}

.chip-close-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.chip-close-btn:disabled {
  cursor: not-allowed;
}

.chip-content {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.s-chip:not(.disabled):active {
  transform: scale(0.98);
}
</style>
