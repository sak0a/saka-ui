<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '~/lib/utils'

defineOptions({ inheritAttrs: false })

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full font-medium transition-all duration-(--s-duration-normal) select-none whitespace-nowrap z-10',
  {
    variants: {
      variant: {
        filled: 'bg-primary text-primary-foreground',
        outlined: 'border-[1.5px] border-primary text-primary bg-background',
        light: 'bg-primary/15 text-primary',
      },
      size: {
        sm: 'text-[10px] min-w-4 h-4 px-1',
        md: 'text-xs min-w-5 h-5 px-1.5',
        lg: 'text-sm min-w-6 h-6 px-2',
      },
    },
    defaultVariants: {
      variant: 'filled',
      size: 'md',
    },
  }
)

const dotSizeClasses = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5',
}

export type BadgeVariants = VariantProps<typeof badgeVariants>

export interface Props {
  variant?: 'filled' | 'outlined' | 'light'
  size?: 'sm' | 'md' | 'lg'
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
  badgeClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'filled',
  size: 'md',
  color: undefined,
  max: 99,
  showZero: false,
  dot: false,
  bordered: false,
  position: 'top-right',
  offset: () => [0, 0],
  standalone: false,
  pulse: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

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

const isVisible = computed(() => {
  if (props.dot) return true
  if (props.content === undefined || props.content === null) return false

  const numContent = typeof props.content === 'string'
    ? parseInt(props.content, 10)
    : props.content

  if (isNaN(numContent)) return true
  if (numContent === 0 && !props.showZero) return false

  return true
})

// Custom color override: when color prop is explicitly set, inject as CSS variable
const colorStyle = computed<CSSProperties | undefined>(() => {
  if (!props.color) return undefined

  const style: CSSProperties = {}
  const c = props.color

  if (props.variant === 'filled') {
    style.backgroundColor = c
    style.color = '#fff'
  } else if (props.variant === 'outlined') {
    style.borderColor = c
    style.color = c
  } else if (props.variant === 'light') {
    style.backgroundColor = c.startsWith('var(') ? `color-mix(in srgb, ${c} 15%, transparent)` : `${c}20`
    style.color = c
  }

  if (props.bordered) {
    style.boxShadow = '0 0 0 2px var(--s-background)'
  }

  return style
})

const borderedStyle = computed<CSSProperties | undefined>(() => {
  if (!props.bordered || props.color) return undefined
  return { boxShadow: '0 0 0 2px var(--s-background)' }
})

const badgeClasses = computed(() => {
  if (props.dot) {
    return cn(
      'inline-flex rounded-full transition-all duration-(--s-duration-normal) select-none z-10',
      props.variant === 'filled' && !props.color && 'bg-primary',
      props.variant === 'outlined' && !props.color && 'border-[1.5px] border-primary bg-background',
      props.variant === 'light' && !props.color && 'bg-primary/15',
      dotSizeClasses[props.size],
      'cursor-pointer hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      props.badgeClass,
    )
  }

  return cn(
    badgeVariants({ variant: props.color ? undefined : props.variant, size: props.size }),
    // When color is set, skip variant styling (handled by inline style)
    props.color && 'inline-flex items-center justify-center rounded-full font-medium transition-all duration-(--s-duration-normal) select-none whitespace-nowrap z-10',
    'cursor-pointer hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    props.badgeClass,
  )
})

const positionStyle = computed<CSSProperties>(() => {
  if (props.standalone) return {}

  const [offsetX, offsetY] = props.offset
  const positions: Record<string, CSSProperties> = {
    'top-right': {
      top: `${offsetY}px`,
      right: `${offsetX}px`,
      transform: 'translate(50%, -50%)',
    },
    'top-left': {
      top: `${offsetY}px`,
      left: `${offsetX}px`,
      transform: 'translate(-50%, -50%)',
    },
    'bottom-right': {
      bottom: `${offsetY}px`,
      right: `${offsetX}px`,
      transform: 'translate(50%, 50%)',
    },
    'bottom-left': {
      bottom: `${offsetY}px`,
      left: `${offsetX}px`,
      transform: 'translate(-50%, 50%)',
    },
  }

  return positions[props.position]
})

const handleClick = (e: MouseEvent) => {
  emit('click', e)
}
</script>

<template>
  <div v-if="standalone" v-bind="$attrs" class="inline-flex align-middle">
    <span
      v-if="isVisible"
      :class="badgeClasses"
      :style="colorStyle ?? borderedStyle"
      role="status"
      tabindex="0"
      @click="handleClick"
    >
      <slot name="content">{{ displayContent }}</slot>
    </span>
  </div>

  <div v-else v-bind="$attrs" class="relative inline-flex align-middle">
    <slot />

    <span
      v-if="isVisible"
      :class="cn(badgeClasses, 'absolute', { 's-badge-pulse': pulse })"
      :style="{ ...(colorStyle ?? borderedStyle), ...positionStyle }"
      role="status"
      tabindex="0"
      @click="handleClick"
    >
      <slot name="content">{{ displayContent }}</slot>
    </span>
  </div>
</template>

<style scoped>
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
</style>
