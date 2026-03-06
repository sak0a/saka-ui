<script lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'

export const kbdVariants = cva(
  'inline-flex items-center justify-center font-mono font-medium select-none whitespace-nowrap leading-none',
  {
    variants: {
      variant: {
        default: 'border border-border bg-muted text-foreground rounded-md shadow-[0_-1px_0_0_rgba(255,255,255,0.06)_inset,0_2px_0_0_var(--s-border)]',
        outlined: 'border border-border text-foreground bg-transparent rounded-md',
        flat: 'bg-muted text-foreground rounded-md',
        ghost: 'text-muted-foreground',
      },
      size: {
        xs: 'text-[10px] px-1 py-0.5 min-w-4 h-4 rounded',
        sm: 'text-xs px-1.5 py-0.5 min-w-5 h-5 rounded-md',
        md: 'text-xs px-1.5 py-1 min-w-6 h-6 rounded-md',
        lg: 'text-sm px-2 py-1 min-w-7 h-7 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export type KbdVariants = VariantProps<typeof kbdVariants>

export interface Props {
  variant?: 'default' | 'outlined' | 'flat' | 'ghost'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  color?: string
}
</script>

<script setup lang="ts">
import { computed, useAttrs, type CSSProperties } from 'vue'
import { cn } from '~/lib/utils'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  color: undefined,
})

const colorStyle = computed<CSSProperties | undefined>(() => {
  if (!props.color) return undefined

  const c = props.color

  if (props.variant === 'default') {
    const bg = c.startsWith('var(') ? `color-mix(in srgb, ${c} 15%, transparent)` : `${c}20`
    return { backgroundColor: bg, color: c, borderColor: c, boxShadow: `0 -1px 0 0 rgba(255,255,255,0.06) inset, 0 2px 0 0 ${c}40` }
  } else if (props.variant === 'outlined') {
    return { borderColor: c, color: c }
  } else if (props.variant === 'flat') {
    const bg = c.startsWith('var(') ? `color-mix(in srgb, ${c} 15%, transparent)` : `${c}20`
    return { backgroundColor: bg, color: c }
  } else if (props.variant === 'ghost') {
    return { color: c }
  }

  return undefined
})

const kbdClasses = computed(() => {
  return cn(
    kbdVariants({
      variant: props.color ? undefined : props.variant,
      size: props.size,
    }),
    props.color && 'inline-flex items-center justify-center font-mono font-medium select-none whitespace-nowrap leading-none',
    props.color && props.size === 'xs' && 'text-[10px] px-1 py-0.5 min-w-4 h-4 rounded',
    props.color && props.size === 'sm' && 'text-xs px-1.5 py-0.5 min-w-5 h-5 rounded-md',
    props.color && props.size === 'md' && 'text-xs px-1.5 py-1 min-w-6 h-6 rounded-md',
    props.color && props.size === 'lg' && 'text-sm px-2 py-1 min-w-7 h-7 rounded-md',
    (attrs as Record<string, unknown>).class,
  )
})
</script>

<template>
  <kbd
    v-bind="$attrs"
    :class="kbdClasses"
    :style="colorStyle"
  >
    <slot />
  </kbd>
</template>
