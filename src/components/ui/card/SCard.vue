<script setup lang="ts">
import { computed, ref, provide } from 'vue'
import { cn } from '~/lib/utils'
import { cva } from 'class-variance-authority'
import { cardContextKey } from './index'

const cardVariants = cva('s-card relative overflow-hidden', {
  variants: {
    variant: {
      elevated: 'bg-card shadow-lg shadow-black/10 dark:shadow-black/40',
      outlined: 'bg-transparent border border-border',
      filled: 'bg-muted',
      ghost: 'bg-transparent',
      glass: 'bg-card/60 dark:bg-card/40 backdrop-blur-xl border border-border'
    },
    size: {
      compact: 'p-3',
      default: 'p-4 sm:p-5',
      comfortable: 'p-5 sm:p-6 lg:p-8'
    },
    rounded: {
      none: 'rounded-none',
      xs: 'rounded-xs',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      '2xl': 'rounded-2xl',
      '3xl': 'rounded-3xl',
      full: 'rounded-full'
    }
  },
  defaultVariants: {
    variant: 'elevated',
    size: 'default',
    rounded: 'lg'
  }
})

interface Props {
  /** Visual style variant */
  variant?: 'elevated' | 'outlined' | 'filled' | 'ghost' | 'glass'
  /** Size preset affecting padding and spacing */
  size?: 'compact' | 'default' | 'comfortable'
  /** Border radius */
  rounded?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
  /** Enable hover animation effects */
  hoverable?: boolean
  /** Enable press/click effect */
  pressable?: boolean
  /** Make entire card clickable */
  clickable?: boolean
  /** Show loading skeleton state */
  loading?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Custom background color */
  bgColor?: string
  /** Custom border color */
  borderColor?: string
  /** Gradient border (CSS gradient string) */
  gradientBorder?: string
  /** Gradient background (CSS gradient string) */
  gradientBg?: string
  /** Enable spotlight/glow effect on hover */
  spotlight?: boolean
  /** Spotlight color */
  spotlightColor?: string
  /** Horizontal layout (media on side) */
  horizontal?: boolean
  /** Flip media to right side in horizontal layout */
  mediaRight?: boolean
  /** Card width */
  width?: string
  /** Card height */
  height?: string
  /** Card max-width */
  maxWidth?: string
  /** Custom padding override */
  padding?: string
  /** Enable 3D tilt effect on hover */
  tilt?: boolean
  /** Tag element to render */
  tag?: string
  /** href for link cards */
  href?: string
  /** router-link to */
  to?: string | object
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'elevated',
  size: 'default',
  rounded: 'lg',
  hoverable: false,
  pressable: false,
  clickable: false,
  loading: false,
  disabled: false,
  bgColor: undefined,
  borderColor: undefined,
  gradientBorder: undefined,
  gradientBg: undefined,
  spotlight: false,
  spotlightColor: 'var(--s-primary)',
  horizontal: false,
  mediaRight: false,
  width: undefined,
  height: undefined,
  maxWidth: undefined,
  padding: undefined,
  tilt: false,
  tag: 'div',
  href: undefined,
  to: undefined
})

defineOptions({ inheritAttrs: false })

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

// Provide context to child components
provide(cardContextKey, {
  variant: props.variant,
  hoverable: props.hoverable,
  loading: props.loading,
  horizontal: props.horizontal
})

// Refs for effects
const cardRef = ref<HTMLElement | null>(null)
const isHovered = ref(false)
const isPressed = ref(false)
const mousePosition = ref({ x: 0, y: 0 })
const tiltRotation = ref({ x: 0, y: 0 })

// Computed component tag
const componentTag = computed(() => {
  if (props.to) return 'router-link'
  if (props.href) return 'a'
  return props.tag
})

// Component bindings
const componentBindings = computed(() => {
  const bindings: Record<string, unknown> = {}
  if (props.to) bindings.to = props.to
  if (props.href) bindings.href = props.href
  return bindings
})



// Radius classes (needed for sub-elements like gradient border spans)
const radiusClasses = computed(() => {
  const radii = {
    none: 'rounded-none',
    xs: 'rounded-xs',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    full: 'rounded-full'
  }
  return radii[props.rounded]
})

// Computed variant class for gradient override
const variantOverride = computed(() => {
  if (props.gradientBorder || props.gradientBg) return 'bg-card'
  return undefined
})

// Computed styles
const computedStyle = computed(() => {
  const style: Record<string, string> = {}
  
  if (props.bgColor) style['--card-bg'] = props.bgColor
  if (props.borderColor) style['--card-border'] = props.borderColor
  if (props.width) style.width = props.width
  if (props.height) style.height = props.height
  if (props.maxWidth) style.maxWidth = props.maxWidth
  if (props.padding) style.padding = props.padding
  if (props.spotlightColor) style['--spotlight-color'] = props.spotlightColor
  
  // Spotlight position
  if (props.spotlight && isHovered.value) {
    style['--mouse-x'] = `${mousePosition.value.x}px`
    style['--mouse-y'] = `${mousePosition.value.y}px`
  }
  
  // 3D tilt transform
  if (props.tilt && isHovered.value) {
    style.transform = `perspective(1000px) rotateX(${tiltRotation.value.x}deg) rotateY(${tiltRotation.value.y}deg) scale3d(1.02, 1.02, 1.02)`
  }
  
  return style
})

// Event handlers
const handleMouseEnter = () => {
  if (props.disabled) return
  isHovered.value = true
}

const handleMouseLeave = () => {
  isHovered.value = false
  isPressed.value = false
  tiltRotation.value = { x: 0, y: 0 }
}

const handleMouseMove = (event: MouseEvent) => {
  if (!cardRef.value || props.disabled) return
  
  const rect = cardRef.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  mousePosition.value = { x, y }
  
  // Calculate tilt rotation
  if (props.tilt && isHovered.value) {
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -8
    const rotateY = ((x - centerX) / centerX) * 8
    tiltRotation.value = { x: rotateX, y: rotateY }
  }
}

const handleMouseDown = () => {
  if (props.pressable && !props.disabled) {
    isPressed.value = true
  }
}

const handleMouseUp = () => {
  isPressed.value = false
}

const handleClick = (event: MouseEvent) => {
  if (props.disabled) {
    event.preventDefault()
    return
  }
  if (props.clickable || props.href || props.to) {
    emit('click', event)
  }
}

// Expose for parent access
defineExpose({
  isHovered,
  isPressed
})
</script>

<template>
  <component
    :is="componentTag"
    ref="cardRef"
    v-bind="{ ...componentBindings, ...$attrs }"
    :class="cn(
      cardVariants({
        variant: (gradientBorder || gradientBg) ? undefined : variant,
        size: padding ? undefined : size,
        rounded
      }),
      variantOverride,
      {
        // Layout
        'flex': horizontal,
        'flex-row-reverse': horizontal && mediaRight,
        
        // Interactive states
        'cursor-pointer': clickable || href || to,
        'cursor-not-allowed opacity-(--s-opacity-disabled)': disabled,
        
        // Hover effects - enhanced animations
        's-card-hoverable': hoverable && !disabled,
        's-card-hoverable-elevated': hoverable && !disabled && variant === 'elevated',
        's-card-hoverable-outlined': hoverable && !disabled && variant === 'outlined',
        's-card-hoverable-filled': hoverable && !disabled && variant === 'filled',
        's-card-hoverable-glass': hoverable && !disabled && variant === 'glass',
        's-card-hoverable-ghost': hoverable && !disabled && variant === 'ghost',
        
        // Press effect
        's-card-pressable': pressable && !disabled,
        's-card-pressed': isPressed,
        
        // Spotlight
        's-card-spotlight': spotlight,
        
        // Gradient styles
        's-card-gradient-border': gradientBorder,
        's-card-gradient-bg': gradientBg
      },
      ($attrs.class as string)
    )"
    :style="computedStyle"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @mousemove="handleMouseMove"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    @click="handleClick"
  >
    <!-- Gradient border pseudo-element -->
    <span 
      v-if="gradientBorder" 
      class="absolute inset-0 -z-10 p-px"
      :class="radiusClasses"
      :style="{ background: gradientBorder }"
    >
      <span 
        class="absolute inset-px bg-card"
        :class="radiusClasses"
      />
    </span>
    
    <!-- Gradient background -->
    <span 
      v-if="gradientBg" 
      class="absolute inset-0 -z-10 opacity-10"
      :style="{ background: gradientBg }"
    />
    
    <!-- Spotlight effect -->
    <span 
      v-if="spotlight && isHovered" 
      class="s-card-spotlight-effect absolute inset-0 pointer-events-none transition-opacity duration-(--s-duration-slow)"
      :class="{ 'opacity-100': isHovered, 'opacity-0': !isHovered }"
    />
    
    <!-- Shimmer effect for loading -->
    <Transition name="fade">
      <div 
        v-if="loading" 
        class="absolute inset-0 z-50 bg-card/80 backdrop-blur-sm flex items-center justify-center"
      >
        <div class="s-card-shimmer absolute inset-0" />
        <div class="relative z-10 flex flex-col items-center gap-3">
          <span class="mdi mdi-loading animate-spin text-2xl text-primary" />
          <span class="text-sm text-muted-foreground">Loading...</span>
        </div>
      </div>
    </Transition>
    
    <!-- Card content -->
    <slot />
  </component>
</template>

<style scoped>
.s-card {
  /* Custom property support */
  background-color: var(--card-bg, var(--s-card));
  border-color: var(--card-border, transparent);
  transition: 
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.3s ease,
    background-color 0.2s ease;
  transform-style: preserve-3d;
  will-change: transform, box-shadow;
}

/* ===== HOVER ANIMATIONS ===== */

/* Base hoverable - smooth lift */
.s-card-hoverable {
  transition: 
    transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    background-color 0.2s ease;
}

.s-card-hoverable:hover {
  transform: translateY(-6px) scale(1.01);
}

/* Elevated variant - enhanced shadow */
.s-card-hoverable-elevated:hover {
  box-shadow: 
    0 20px 40px -12px rgba(0, 0, 0, 0.2),
    0 8px 16px -8px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(var(--s-primary-rgb), 0.05);
}

:root.dark .s-card-hoverable-elevated:hover {
  box-shadow: 
    0 20px 40px -12px rgba(0, 0, 0, 0.5),
    0 8px 16px -8px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.05);
}

/* Outlined variant - border glow */
.s-card-hoverable-outlined:hover {
  border-color: var(--s-primary);
  box-shadow:
    0 0 0 1px var(--s-primary),
    0 8px 24px -8px rgba(var(--s-primary-rgb), 0.2);
}

/* Filled variant - subtle lift with bg change */
.s-card-hoverable-filled:hover {
  background-color: var(--s-accent);
  box-shadow: 0 8px 24px -8px rgba(0, 0, 0, 0.15);
}

:root.dark .s-card-hoverable-filled:hover {
  box-shadow: 0 8px 24px -8px rgba(0, 0, 0, 0.4);
}

/* Glass variant - enhanced blur and glow */
.s-card-hoverable-glass:hover {
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  box-shadow: 
    0 8px 32px -8px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

:root.dark .s-card-hoverable-glass:hover {
  background-color: rgba(255, 255, 255, 0.08);
  box-shadow: 
    0 8px 32px -8px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

/* Ghost variant - subtle bg appear */
.s-card-hoverable-ghost:hover {
  background-color: var(--s-muted);
}

/* ===== PRESS EFFECT ===== */
.s-card-pressable {
  transition: 
    transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.15s ease;
}

.s-card-pressable:active,
.s-card-pressed {
  transform: translateY(0) scale(0.98) !important;
  box-shadow: 
    0 2px 8px -4px rgba(0, 0, 0, 0.2) !important;
}

/* ===== SPOTLIGHT EFFECT ===== */
.s-card-spotlight::before {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.4s ease;
  background: radial-gradient(
    600px circle at var(--mouse-x) var(--mouse-y),
    color-mix(in srgb, var(--spotlight-color) 15%, transparent),
    transparent 40%
  );
  pointer-events: none;
  z-index: 1;
}

.s-card-spotlight:hover::before {
  opacity: 1;
}

.s-card-spotlight-effect {
  background: radial-gradient(
    400px circle at var(--mouse-x) var(--mouse-y),
    color-mix(in srgb, var(--spotlight-color) 8%, transparent),
    transparent 50%
  );
}

/* ===== SHIMMER LOADING ===== */
.s-card-shimmer {
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--s-accent) 50%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Gradient border support */
.s-card-gradient-border {
  position: relative;
  background: transparent;
  border: none;
}
</style>
