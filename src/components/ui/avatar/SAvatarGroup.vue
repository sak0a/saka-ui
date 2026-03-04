<script setup lang="ts">
import { computed, provide } from 'vue'

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
  borderColor: 'var(--s-bg-primary)'
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
    class="s-avatar-group flex items-center flex-row-reverse justify-end"
    :style="{ '--avatar-spacing': spacingValue }"
  >
    <slot />
  </div>
</template>

<style scoped>
.s-avatar-group :deep(.s-avatar) {
  margin-left: var(--avatar-spacing);
  box-shadow: 0 0 0 2px var(--s-bg-primary);
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
