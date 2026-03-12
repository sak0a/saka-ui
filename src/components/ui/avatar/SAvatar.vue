<script setup lang="ts">
import { provide, reactive, computed } from 'vue'
import { cn } from '~/lib/utils'

defineOptions({ inheritAttrs: false })

export interface AvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number
  shape?: 'circle' | 'square' | 'rounded'
  bordered?: boolean
  borderColor?: string
  ring?: boolean
  ringColor?: string
  status?: 'online' | 'offline' | 'busy' | 'away' | null
  statusPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

const props = withDefaults(defineProps<AvatarProps>(), {
  size: 'md',
  shape: 'circle',
  bordered: false,
  borderColor: 'var(--s-border)',
  ring: false,
  ringColor: 'var(--s-primary)',
  status: null,
  statusPosition: 'bottom-right'
})

// Provide context for child components
const avatarState = reactive({
  imageLoaded: false,
  imageFailed: false
})

provide('avatarContext', {
  state: avatarState,
  setImageLoaded: (loaded: boolean) => {
    avatarState.imageLoaded = loaded
  },
  setImageFailed: (failed: boolean) => {
    avatarState.imageFailed = failed
  }
})

// Size mapping
const sizeValue = computed(() => {
  if (typeof props.size === 'number') {
    return `${props.size}px`
  }
  const sizes: Record<string, string> = {
    xs: '1.5rem',
    sm: '2rem',
    md: '2.5rem',
    lg: '3rem',
    xl: '4rem',
    '2xl': '5rem'
  }
  return sizes[props.size] || sizes.medium
})

// Font size for fallback
const fontSizeValue = computed(() => {
  if (typeof props.size === 'number') {
    return `${props.size * 0.4}px`
  }
  const sizes: Record<string, string> = {
    xs: '0.625rem',
    sm: '0.75rem',
    md: '0.875rem',
    lg: '1rem',
    xl: '1.25rem',
    '2xl': '1.5rem'
  }
  return sizes[props.size] || sizes.medium
})

// Shape classes
const shapeClasses = computed(() => {
  const shapes: Record<string, string> = {
    circle: 'rounded-full',
    square: 'rounded-none',
    rounded: 'rounded-lg'
  }
  return shapes[props.shape]
})

// Status dot size
const statusSize = computed(() => {
  if (typeof props.size === 'number') {
    return `${Math.max(props.size * 0.25, 8)}px`
  }
  const sizes: Record<string, string> = {
    xs: '0.375rem',
    sm: '0.5rem',
    md: '0.5rem',
    lg: '0.625rem',
    xl: '0.75rem',
    '2xl': '0.875rem'
  }
  return sizes[props.size] || sizes.medium
})

// Status colors
const statusColors: Record<string, string> = {
  online: '#22c55e',
  offline: '#6b7280',
  busy: '#ef4444',
  away: '#f59e0b'
}

// Status position classes
const statusPositionClasses = computed(() => {
  const positions: Record<string, string> = {
    'top-right': 'top-0 right-0',
    'top-left': 'top-0 left-0',
    'bottom-right': 'bottom-0 right-0',
    'bottom-left': 'bottom-0 left-0'
  }
  return positions[props.statusPosition]
})
</script>

<template>
  <div
    v-bind="$attrs"
    :class="cn('s-avatar relative inline-flex shrink-0 select-none', $attrs.class ?? '')"
    :style="{
      width: sizeValue,
      height: sizeValue,
      fontSize: fontSizeValue
    }"
  >
    <!-- Inner container for image/fallback with overflow hidden -->
    <div
      class="s-avatar-inner relative w-full h-full flex items-center justify-center overflow-hidden bg-accent text-muted-foreground"
      :class="[
        shapeClasses,
        {
          'ring-2': bordered,
          'ring-3 ring-offset-2 ring-offset-background': ring
        }
      ]"
      :style="{
        '--tw-ring-color': bordered ? borderColor : ringColor
      }"
    >
      <slot />
    </div>
    
    <!-- Status indicator (outside overflow container) -->
    <span
      v-if="status"
      class="absolute z-10 rounded-full ring-2 ring-background"
      :class="statusPositionClasses"
      :style="{
        width: statusSize,
        height: statusSize,
        backgroundColor: statusColors[status]
      }"
    />
  </div>
</template>

<style scoped>
.s-avatar {
  line-height: 1;
  font-weight: 500;
}
</style>
