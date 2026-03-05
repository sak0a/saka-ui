<script setup lang="ts">
defineOptions({ inheritAttrs: false })

import { computed, provide } from 'vue'
import { cn } from '~/lib/utils'

interface Props {
  max?: number
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number
  spacing?: 'tight' | 'normal' | 'loose' | number
  bordered?: boolean
  borderColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  max: undefined,
  size: 'md',
  spacing: 'normal',
  bordered: true,
  borderColor: 'var(--s-background)'
})

// Provide group context to children
provide('avatarGroupContext', {
  size: props.size,
  bordered: props.bordered,
  borderColor: props.borderColor
})

// Spacing value
const spacingValue = computed(() => {
  if (typeof props.spacing === 'number') {
    return `-${props.spacing}px`
  }
  const spacings: Record<string, string> = {
    tight: '-0.75rem',
    normal: '-0.5rem',
    loose: '-0.25rem'
  }
  return spacings[props.spacing] || spacings.normal
})
</script>

<template>
  <div
    v-bind="$attrs"
    :class="cn('s-avatar-group flex items-center flex-row-reverse justify-end', $attrs.class ?? '')"
    :style="{ '--avatar-spacing': spacingValue }"
  >
    <slot />
  </div>
</template>

<style scoped>
.s-avatar-group :deep(.s-avatar) {
  margin-left: var(--avatar-spacing);
  box-shadow: 0 0 0 2px var(--s-background);
}

.s-avatar-group :deep(.s-avatar:first-child) {
  margin-left: 0;
}

.s-avatar-group :deep(.s-avatar:hover) {
  z-index: 10;
  transform: translateY(-2px);
  transition: transform 0.2s ease;
}
</style>
