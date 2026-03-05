<script setup lang="ts">
import { computed, type CSSProperties, type Component } from 'vue'
import { cn } from '~/lib/utils'

defineOptions({ inheritAttrs: false })

export interface Props {
  component?: Component
  size?: number | string
  color?: string
  depth?: 1 | 2 | 3 | 4 | 5
}

const props = withDefaults(defineProps<Props>(), {
  component: undefined,
  size: 24,
  color: undefined,
  depth: undefined
})

const computedStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {}

  // Handle size
  if (props.size !== undefined) {
    const sizeVal = typeof props.size === 'number' ? `${props.size}px` : props.size
    style.fontSize = sizeVal
    style.width = sizeVal
    style.height = sizeVal
  }

  // Handle color
  if (props.color) {
    style.color = props.color
  }

  // Handle depth (opacity)
  if (props.depth) {
    const opacityMap: Record<number, string> = {
      1: '1',
      2: '0.82',
      3: '0.6',
      4: '0.38',
      5: '0.18'
    }
    style.opacity = opacityMap[props.depth] || '1'
  }

  return style
})
</script>

<template>
  <i
    :class="cn('inline-flex items-center justify-center align-middle leading-none', ($attrs as any).class)"
    :style="computedStyle"
    role="img"
    v-bind="{ ...$attrs, class: undefined }"
  >
    <component :is="component" v-if="component" />
    <slot v-else />
  </i>
</template>

<style scoped>
/* Ensure svg children scale correctly */
.inline-flex :deep(svg) {
  width: 1em;
  height: 1em;
  fill: currentColor;
}

/* Ensure font icons inherit size */
.inline-flex :deep(i),
.inline-flex :deep(span) {
  font-size: inherit;
}
</style>
