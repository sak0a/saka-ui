<script lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'

export const buttonVariants = cva(
  'relative inline-flex items-center justify-center font-medium transition-all duration-200 ease-out overflow-hidden select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border-[1.5px] border-transparent',
  {
    variants: {
      variant: {
        filled: 'bg-primary text-primary-foreground hover:brightness-110 active:scale-[0.98]',
        outlined: 'bg-transparent border-primary text-primary hover:bg-primary/10',
        light: 'bg-primary/15 text-primary hover:bg-primary/25',
        ghost: 'bg-transparent text-primary hover:bg-accent',
        link: 'bg-transparent text-primary hover:underline',
      },
      size: {
        xs: 'px-1.5 py-0.5 text-xs gap-1',
        small: 'px-2 py-0.5 text-sm gap-1.5',
        medium: 'px-2 py-0.5 text-sm gap-2',
        large: 'px-2.5 py-0.5 text-base gap-2',
        xl: 'px-3 py-0.5 text-lg gap-2.5',
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded',
        md: 'rounded-lg',
        lg: 'rounded-xl',
        full: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'filled',
      size: 'medium',
      rounded: 'md',
    },
  }
)

export type ButtonVariants = VariantProps<typeof buttonVariants>

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
  contentClass?: string
  iconClass?: string
}
</script>

<script setup lang="ts">
import { computed, ref, useSlots, type CSSProperties } from 'vue'
import { cn } from '~/lib/utils'

const iconOnlySizes: Record<string, string> = {
  xs: 'w-6 h-6 text-xs',
  small: 'w-8 h-8 text-sm',
  medium: 'w-10 h-10 text-base',
  large: 'w-12 h-12 text-lg',
  xl: 'w-14 h-14 text-xl',
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'filled',
  size: 'medium',
  color: undefined,
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
  animateInactive: false,
  contentClass: undefined,
  iconClass: undefined,
})

defineOptions({ inheritAttrs: false })

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
      clientY: (event.target as HTMLElement).getBoundingClientRect().top + 20,
    })
    ;(event.target as HTMLElement).dispatchEvent(mouseEvent)
  }
}

const componentTag = computed(() => {
  if (props.to) return 'router-link'
  if (props.href) return 'a'
  return props.tag
})

const iconSizes = computed(() => {
  const sizes: Record<string, string> = {
    xs: 'text-xs',
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xl: 'text-xl',
  }
  return sizes[props.size]
})

// Custom color override: when color prop is set, use inline styles for color-specific properties
const colorStyle = computed<CSSProperties | undefined>(() => {
  if (!props.color) return undefined

  const c = props.color

  if (props.variant === 'filled') {
    return { backgroundColor: c, color: '#fff', borderColor: 'transparent' }
  } else if (props.variant === 'outlined') {
    return { backgroundColor: 'transparent', borderColor: c, color: c }
  } else if (props.variant === 'light') {
    const bg = c.startsWith('var(') ? `color-mix(in srgb, ${c} 15%, transparent)` : `${c}20`
    return { backgroundColor: bg, color: c, borderColor: 'transparent' }
  } else if (props.variant === 'ghost') {
    return { backgroundColor: 'transparent', color: c, borderColor: 'transparent' }
  } else if (props.variant === 'link') {
    return { backgroundColor: 'transparent', color: c, borderColor: 'transparent' }
  }

  return undefined
})

const buttonClasses = computed(() => {
  return cn(
    // Base + size + rounded from cva; skip variant when color is set (inline style handles it)
    buttonVariants({
      variant: props.color ? null : props.variant,
      size: props.iconOnly ? null : props.size,
      rounded: props.rounded,
    }),
    props.iconOnly && iconOnlySizes[props.size],
    // Hover/active interactions when color is set
    props.color && props.variant === 'filled' && 'hover:brightness-110 active:scale-[0.98]',
    props.color && props.variant === 'link' && 'hover:underline',
    {
      'w-full': props.block,
      'opacity-50 cursor-not-allowed': props.disabled || props.loading,
      'cursor-pointer': !props.disabled && !props.loading,
      's-button--animate': hasAnimateSlot.value && !props.animateInactive,
      [`s-button--animate-${props.animationType}`]: hasAnimateSlot.value && !props.animateInactive,
    },
  )
})

const componentBindings = computed(() => {
  const bindings: Record<string, unknown> = {}

  if (props.to) bindings.to = props.to
  if (props.href) bindings.href = props.href
  if (componentTag.value === 'button') bindings.type = props.type
  if (props.disabled) bindings.disabled = true

  return bindings
})
</script>

<template>
  <component
    :is="componentTag"
    v-bind="{ ...componentBindings, ...$attrs }"
    :class="cn(buttonClasses, ($attrs.class as string))"
    :style="colorStyle"
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
        height: `${ripple.size}px`,
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
      :class="[contentClass, { 'opacity-0': loading && preserveSize }]"
    >
      <template v-if="!loading || preserveSize">
        <slot name="icon-left">
          <span
            v-if="iconLeft"
            :class="['mdi', `mdi-${iconLeft}`, iconSizes, iconClass]"
          />
        </slot>
      </template>

      <span v-if="!iconOnly && (!loading || preserveSize)">
        <slot />
      </span>

      <template v-if="iconOnly && (!loading || preserveSize) && !iconLeft">
        <slot />
      </template>

      <template v-if="!loading || preserveSize">
        <slot name="icon-right">
          <span
            v-if="iconRight"
            :class="['mdi', `mdi-${iconRight}`, iconSizes, iconClass]"
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

/* Slide animation (default) */
.s-button__animate--slide {
  transform: translateX(100%);
}

.s-button--animate-slide:hover .s-button__content {
  transform: translateX(-100%);
}

.s-button--animate-slide:hover .s-button__animate--slide {
  transform: translateX(0);
}

/* Vertical animation */
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

/* Scale animation */
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

/* Rotate animation */
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
