<script setup lang="ts">
import { computed, useAttrs, type CSSProperties } from 'vue'
import { cn } from '../../lib/utils'
import { kbdVariants } from './kbd'

export interface Props {
  variant?: 'default' | 'outlined' | 'flat' | 'ghost'
  size?: 'xs' | 'small' | 'medium' | 'large'
  color?: string
}

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'medium',
  color: undefined,
})

const colorStyle = computed<CSSProperties | undefined>(() => {
  if (!props.color) return undefined

  const c = props.color

  if (props.variant === 'default') {
    return {
      backgroundColor: `color-mix(in srgb, ${c} 15%, transparent)`,
      color: c,
      borderColor: c,
      boxShadow: `0 -1px 0 0 rgba(255,255,255,0.06) inset, 0 2px 0 0 color-mix(in srgb, ${c} 25%, transparent)`,
    }
  } else if (props.variant === 'outlined') {
    return { borderColor: c, color: c }
  } else if (props.variant === 'flat') {
    return {
      backgroundColor: `color-mix(in srgb, ${c} 15%, transparent)`,
      color: c,
    }
  } else if (props.variant === 'ghost') {
    return { color: c }
  }

  return undefined
})

const kbdClasses = computed(() => {
  return cn(
    kbdVariants({
      variant: props.variant,
      size: props.size,
    }),
    (attrs as Record<string, unknown>).class as string,
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
