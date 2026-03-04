<script setup lang="ts">
import { computed } from 'vue'

export interface Props {
  variant?: 'filled' | 'outlined' | 'light'
  size?: 'small' | 'medium' | 'large'
  color?: string
  content?: string | number
  max?: number
  showZero?: boolean
  dot?: boolean
  bordered?: boolean
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  offset?: [number, number]
  standalone?: boolean
  pulse?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'filled',
  size: 'medium',
  color: 'var(--s-primary)',
  max: 99,
  showZero: false,
  dot: false,
  bordered: false,
  position: 'top-right',
  offset: () => [0, 0],
  standalone: false,
  pulse: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

// Compute display content with max overflow
const displayContent = computed(() => {
  if (props.dot) return ''
  if (props.content === undefined || props.content === null) return ''
  
  const numContent = typeof props.content === 'string' 
    ? parseInt(props.content, 10) 
    : props.content
  
  if (isNaN(numContent)) return props.content
  if (numContent === 0 && !props.showZero) return ''
  if (numContent > props.max) return `${props.max}+`
  
  return String(numContent)
})

// Check if badge should be visible
const isVisible = computed(() => {
  if (props.dot) return true
  if (props.content === undefined || props.content === null) return false
  
  const numContent = typeof props.content === 'string' 
    ? parseInt(props.content, 10) 
    : props.content
  
  if (isNaN(numContent)) return true // Non-numeric content is always shown
  if (numContent === 0 && !props.showZero) return false
  
  return true
})

// Compute badge styles
const badgeStyle = computed(() => {
  const style: Record<string, string> = {}
  const colorValue = props.color
  
  if (props.variant === 'filled') {
    style.backgroundColor = colorValue
    style.color = '#fff'
  } else if (props.variant === 'outlined') {
    style.border = `1.5px solid ${colorValue}`
    style.color = colorValue
    style.backgroundColor = 'var(--s-bg-primary)'
  } else if (props.variant === 'light') {
    if (colorValue.includes('var(--s-primary)')) {
      style.backgroundColor = 'var(--s-primary-alpha)'
    } else {
      style.backgroundColor = `${colorValue}20`
    }
    style.color = colorValue
  }
  
  if (props.bordered) {
    style.boxShadow = '0 0 0 2px var(--s-bg-primary)'
  }
  
  return style
})

// Position styles for overlay mode
const positionStyle = computed(() => {
  if (props.standalone) return {}
  
  const [offsetX, offsetY] = props.offset
  const positions: Record<string, Record<string, string>> = {
    'top-right': {
      top: `${offsetY}px`,
      right: `${offsetX}px`,
      transform: 'translate(50%, -50%)'
    },
    'top-left': {
      top: `${offsetY}px`,
      left: `${offsetX}px`,
      transform: 'translate(-50%, -50%)'
    },
    'bottom-right': {
      bottom: `${offsetY}px`,
      right: `${offsetX}px`,
      transform: 'translate(50%, 50%)'
    },
    'bottom-left': {
      bottom: `${offsetY}px`,
      left: `${offsetX}px`,
      transform: 'translate(-50%, 50%)'
    }
  }
  
  return positions[props.position]
})

// Size classes
const sizeClasses = computed(() => {
  if (props.dot) {
    const dotSizes = {
      small: 'w-1.5 h-1.5',
      medium: 'w-2 h-2',
      large: 'w-2.5 h-2.5'
    }
    return dotSizes[props.size]
  }
  
  const sizes = {
    small: 'text-[10px] min-w-4 h-4 px-1',
    medium: 'text-xs min-w-5 h-5 px-1.5',
    large: 'text-sm min-w-6 h-6 px-2'
  }
  return sizes[props.size]
})

const handleClick = (e: MouseEvent) => {
  emit('click', e)
}
</script>

<template>
  <div v-if="standalone" class="s-badge-standalone inline-flex">
    <span
      v-if="isVisible"
      class="s-badge inline-flex items-center justify-center rounded-full font-medium transition-all duration-200"
      :class="[sizeClasses, { 'cursor-pointer hover:brightness-110': $attrs.onClick }]"
      :style="badgeStyle"
      @click="handleClick"
    >
      <slot name="content">{{ displayContent }}</slot>
    </span>
  </div>
  
  <div v-else class="s-badge-wrapper relative inline-flex">
    <slot />
    
    <span
      v-if="isVisible"
      class="s-badge absolute inline-flex items-center justify-center rounded-full font-medium transition-all duration-200"
      :class="[
        sizeClasses, 
        { 'cursor-pointer hover:brightness-110': $attrs.onClick },
        { 's-badge-pulse': pulse }
      ]"
      :style="{ ...badgeStyle, ...positionStyle }"
      @click="handleClick"
    >
      <slot name="content">{{ displayContent }}</slot>
    </span>
  </div>
</template>

<style scoped>
.s-badge {
  user-select: none;
  -webkit-user-select: none;
  z-index: 10;
  white-space: nowrap;
}

.s-badge-pulse::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: inherit;
  animation: pulse-ring 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-ring {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.5);
    opacity: 0;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.s-badge-wrapper {
  vertical-align: middle;
}

.s-badge-standalone {
  vertical-align: middle;
}
</style>
