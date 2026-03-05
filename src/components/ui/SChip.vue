<script setup lang="ts">
import { computed, useAttrs, type CSSProperties } from 'vue'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '~/lib/utils'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()

const chipVariants = cva(
  'inline-flex items-center rounded-full font-medium transition-all duration-300 select-none border border-transparent',
  {
    variants: {
      variant: {
        filled: 'bg-primary text-primary-foreground',
        outlined: 'border-[1.5px] border-primary text-primary bg-transparent',
        light: 'bg-primary/15 text-primary',
      },
      size: {
        small: 'text-xs px-2 py-0.5 gap-1',
        medium: 'text-sm px-3 py-1 gap-1.5',
        large: 'text-base px-4 py-1.5 gap-2',
      },
    },
    defaultVariants: {
      variant: 'filled',
      size: 'medium',
    },
  }
)

export type ChipVariants = VariantProps<typeof chipVariants>

export interface Props {
  variant?: 'filled' | 'outlined' | 'light'
  size?: 'small' | 'medium' | 'large'
  color?: string
  closable?: boolean
  disabled?: boolean
  contentClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'filled',
  size: 'medium',
  color: undefined,
  closable: false,
  disabled: false
})

const emit = defineEmits<{
  close: []
  click: []
}>()

// Custom color override: when color prop is explicitly set, use inline styles
const colorStyle = computed<CSSProperties | undefined>(() => {
  if (!props.color) return undefined

  const c = props.color

  if (props.variant === 'filled') {
    return { backgroundColor: c, color: '#fff' }
  } else if (props.variant === 'outlined') {
    return { border: `1.5px solid ${c}`, color: c, backgroundColor: 'transparent' }
  } else if (props.variant === 'light') {
    const bg = c.startsWith('var(') ? `color-mix(in srgb, ${c} 15%, transparent)` : `${c}20`
    return { backgroundColor: bg, color: c }
  }

  return undefined
})

const chipClasses = computed(() => {
  return cn(
    chipVariants({
      variant: props.color ? undefined : props.variant,
      size: props.size,
    }),
    // When color is set, skip variant styling (handled by inline style) but keep base classes
    props.color && 'inline-flex items-center rounded-full font-medium transition-all duration-300 select-none border border-transparent',
    // Hover/active interactions when color is set and filled
    props.color && props.variant === 'filled' && 'hover:brightness-110',
    {
      'cursor-pointer hover:brightness-110 active:scale-95': !props.disabled,
      'opacity-50 cursor-not-allowed': props.disabled,
    },
    (attrs as Record<string, unknown>).class,
  )
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
    v-bind="$attrs"
    :class="chipClasses"
    :style="colorStyle"
    @click="handleClick"
  >
    <span class="inline-flex items-center gap-1" :class="contentClass">
      <slot />
    </span>
    <button
      v-if="closable"
      class="inline-flex items-center justify-center rounded-full border-none bg-transparent p-0 leading-none cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors disabled:cursor-not-allowed"
      :class="{
        'w-3.5 h-3.5 text-xs': size === 'small',
        'w-4.5 h-4.5 text-sm': size === 'medium',
        'w-5.5 h-5.5 text-base': size === 'large'
      }"
      @click="handleClose"
      :disabled="disabled"
    >
      <span class="leading-none">&times;</span>
    </button>
  </div>
</template>
