<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'

export interface Props {
  variant?: 'filled' | 'outlined' | 'light' | 'ghost' | 'link'
  size?: 'xs' | 'small' | 'medium' | 'large' | 'xl'
  color?: string
  disabled?: boolean
  loading?: boolean
  preserveSize?: boolean
  block?: boolean
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  iconLeft?: string
  iconRight?: string
  iconOnly?: boolean
  tag?: string
  href?: string
  to?: string | object
  type?: 'button' | 'submit' | 'reset'
  ripple?: boolean
  animationType?: 'slide' | 'vertical' | 'scale' | 'rotate'
  animateInactive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'filled',
  size: 'medium',
  color: 'var(--s-primary)',
  disabled: false,
  loading: false,
  preserveSize: false,
  block: false,
  rounded: 'md',
  iconLeft: undefined,
  iconRight: undefined,
  iconOnly: false,
  tag: 'button',
  href: undefined,
  to: undefined,
  type: 'button',
  ripple: true,
  animationType: 'slide',
  animateInactive: false
})

const slots = useSlots()
const hasAnimateSlot = computed(() => !!slots.animate)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

// Ripple effect state
const ripples = ref<{ id: number; x: number; y: number; size: number }[]>([])
let rippleId = 0

const createRipple = (event: MouseEvent) => {
  if (!props.ripple || props.disabled || props.loading) return
  
  const button = event.currentTarget as HTMLElement
  const rect = button.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height) * 2
  const x = event.clientX - rect.left - size / 2
  const y = event.clientY - rect.top - size / 2
  
  const id = rippleId++
  ripples.value.push({ id, x, y, size })
  
  setTimeout(() => {
    ripples.value = ripples.value.filter(r => r.id !== id)
  }, 600)
}

const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) {
    event.preventDefault()
    return
  }
  createRipple(event)
  emit('click', event)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (props.disabled || props.loading) return
  if (event.key === ' ' || event.key === 'Enter') {
    event.preventDefault()
    const mouseEvent = new MouseEvent('click', {
      bubbles: true,
      clientX: (event.target as HTMLElement).getBoundingClientRect().left + 20,
      clientY: (event.target as HTMLElement).getBoundingClientRect().top + 20
    })
    ;(event.target as HTMLElement).dispatchEvent(mouseEvent)
  }
}

// Computed component tag
const componentTag = computed(() => {
  if (props.to) return 'router-link'
  if (props.href) return 'a'
  return props.tag
})

// Size configurations
const sizeClasses = computed(() => {
  if (props.iconOnly) {
    const iconOnlySizes = {
      xs: 'w-6 h-6 text-xs',
      small: 'w-8 h-8 text-sm',
      medium: 'w-10 h-10 text-base',
      large: 'w-12 h-12 text-lg',
      xl: 'w-14 h-14 text-xl'
    }
    return iconOnlySizes[props.size]
  }
  
  const sizes = {
    xs: 'px-1.5 py-0.5 text-xs gap-1',
    small: 'px-2 py-0.5 text-sm gap-1.5',
    medium: 'px-2 py-0.5 text-sm gap-2',
    large: 'px-2.5 py-0.5 text-base gap-2',
    xl: 'px-3 py-0.5 text-lg gap-2.5'
  }
  return sizes[props.size]
})

const iconSizes = computed(() => {
  const sizes = {
    xs: 'text-xs',
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xl: 'text-xl'
  }
  return sizes[props.size]
})

// Border radius
const radiusClasses = computed(() => {
  const radii = {
    none: 'rounded-none',
    sm: 'rounded',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    full: 'rounded-full'
  }
  return radii[props.rounded]
})

// Computed styles based on variant and color
const computedStyle = computed(() => {
  const style: Record<string, string> = {}
  const colorValue = props.color
  
  if (props.variant === 'filled') {
    style['--btn-bg'] = colorValue
    style['--btn-bg-hover'] = colorValue
    style['--btn-text'] = '#fff'
    style['--btn-border'] = 'transparent'
  } else if (props.variant === 'outlined') {
    style['--btn-bg'] = 'transparent'
    style['--btn-bg-hover'] = colorValue.includes('var(') ? 'var(--s-primary-alpha)' : `${colorValue}15`
    style['--btn-text'] = colorValue
    style['--btn-border'] = colorValue
  } else if (props.variant === 'light') {
    style['--btn-bg'] = colorValue.includes('var(') ? 'var(--s-primary-alpha)' : `${colorValue}20`
    style['--btn-bg-hover'] = colorValue.includes('var(') ? 'var(--s-primary-alpha)' : `${colorValue}30`
    style['--btn-text'] = colorValue
    style['--btn-border'] = 'transparent'
  } else if (props.variant === 'ghost') {
    style['--btn-bg'] = 'transparent'
    style['--btn-bg-hover'] = 'var(--s-bg-tertiary)'
    style['--btn-text'] = colorValue
    style['--btn-border'] = 'transparent'
  } else if (props.variant === 'link') {
    style['--btn-bg'] = 'transparent'
    style['--btn-bg-hover'] = 'transparent'
    style['--btn-text'] = colorValue
    style['--btn-border'] = 'transparent'
  }
  
  return style
})

// Component bindings
const componentBindings = computed(() => {
  const bindings: Record<string, unknown> = {}
  
  if (props.to) {
    bindings.to = props.to
  }
  if (props.href) {
    bindings.href = props.href
  }
  if (componentTag.value === 'button') {
    bindings.type = props.type
  }
  if (props.disabled) {
    bindings.disabled = true
  }
  
  return bindings
})
</script>

<template>
  <component
    :is="componentTag"
    v-bind="componentBindings"
    class="s-button relative inline-flex items-center justify-center font-medium transition-all duration-200 ease-out overflow-hidden select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-(--s-primary)"
    :class="[
      sizeClasses,
      radiusClasses,
      {
        'w-full': block,
        'opacity-50 cursor-not-allowed': disabled || loading,
        'cursor-pointer': !disabled && !loading,
        'hover:brightness-110 active:scale-[0.98]': variant === 'filled' && !disabled && !loading,
        'hover:underline': variant === 'link' && !disabled && !loading,
        's-button--animate': hasAnimateSlot && !animateInactive,
        [`s-button--animate-${animationType}`]: hasAnimateSlot && !animateInactive,
      }
    ]"
    :style="computedStyle"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <!-- Ripple effects -->
    <span 
      v-for="ripple in ripples" 
      :key="ripple.id"
      class="absolute rounded-full bg-white/30 animate-ripple pointer-events-none"
      :style="{
        left: `${ripple.x}px`,
        top: `${ripple.y}px`,
        width: `${ripple.size}px`,
        height: `${ripple.size}px`
      }"
    />
    
    <!-- Loading spinner (absolute when preserveSize) -->
    <span 
      v-if="loading" 
      class="mdi mdi-loading animate-spin"
      :class="[iconSizes, { 'absolute inset-0 flex items-center justify-center': preserveSize }]"
    />
    
    <!-- Default content wrapper -->
    <span 
      class="s-button__content flex items-center justify-center gap-2"
      :class="{ 'opacity-0': loading && preserveSize }"
    >
      <!-- Left icon -->
      <template v-if="!loading || preserveSize">
        <slot name="icon-left">
          <span 
            v-if="iconLeft" 
            :class="['mdi', `mdi-${iconLeft}`, iconSizes]"
          />
        </slot>
      </template>
      
      <!-- Content -->
      <span v-if="!iconOnly && (!loading || preserveSize)">
        <slot />
      </span>
      
      <!-- Icon only content -->
      <template v-if="iconOnly && (!loading || preserveSize) && !iconLeft">
        <slot />
      </template>
      
      <!-- Right icon -->
      <template v-if="!loading || preserveSize">
        <slot name="icon-right">
          <span 
            v-if="iconRight" 
            :class="['mdi', `mdi-${iconRight}`, iconSizes]"
          />
        </slot>
      </template>
    </span>
    
    <!-- Animate slot content -->
    <span 
      v-if="hasAnimateSlot"
      class="s-button__animate flex items-center justify-center gap-2"
      :class="[`s-button__animate--${animationType}`]"
    >
      <slot name="animate" />
    </span>
  </component>
</template>

<style scoped>
.s-button {
  background-color: var(--btn-bg);
  color: var(--btn-text);
  border: 1.5px solid var(--btn-border);
}

.s-button:not(:disabled):not(.opacity-50):hover {
  background-color: var(--btn-bg-hover);
}

/* Ripple animation */
@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

.animate-ripple {
  animation: ripple 0.6s ease-out forwards;
}

/* Focus ring offset matches background */
.s-button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--s-bg-primary), 0 0 0 4px var(--s-primary);
}

/* Button content wrapper */
.s-button__content {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

/* Animate slot - positioned absolute over content */
.s-button__animate {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

/* Slide animation (default) - slides horizontally */
.s-button__animate--slide {
  transform: translateX(100%);
}

.s-button--animate-slide:hover .s-button__content {
  transform: translateX(-100%);
}

.s-button--animate-slide:hover .s-button__animate--slide {
  transform: translateX(0);
}

/* Vertical animation - slides vertically */
.s-button__animate--vertical {
  transform: translateY(100%);
}

.s-button--animate-vertical:hover .s-button__content {
  transform: translateY(-100%);
  opacity: 0;
}

.s-button--animate-vertical:hover .s-button__animate--vertical {
  transform: translateY(0);
}

/* Scale animation - scales in/out */
.s-button__animate--scale {
  transform: scale(0.5);
  opacity: 0;
}

.s-button--animate-scale:hover .s-button__content {
  transform: scale(1.4);
  opacity: 0;
}

.s-button--animate-scale:hover .s-button__animate--scale {
  transform: scale(1);
  opacity: 1;
}

/* Rotate animation - rotates in/out */
.s-button__animate--rotate {
  transform: rotate(-180deg);
  opacity: 0;
}

.s-button--animate-rotate:hover .s-button__content {
  transform: rotate(180deg);
  opacity: 0;
}

.s-button--animate-rotate:hover .s-button__animate--rotate {
  transform: rotate(0);
  opacity: 1;
}
</style>
