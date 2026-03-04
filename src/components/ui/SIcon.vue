<script setup lang="ts">
import { computed, type Component } from 'vue'

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

const computedStyle = computed(() => {
  const style: Record<string, string> = {}
  
  // Handle size
  if (props.size !== undefined) {
    style.fontSize = typeof props.size === 'number' ? `${props.size}px` : props.size
    style.width = typeof props.size === 'number' ? `${props.size}px` : props.size
    style.height = typeof props.size === 'number' ? `${props.size}px` : props.size
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
  <i class="s-icon" :style="computedStyle" role="img">
    <component :is="component" v-if="component" />
    <slot v-else />
  </i>
</template>

<style scoped>
.s-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  line-height: 1;
}

/* Ensure svg children scale correctly */
.s-icon :deep(svg) {
  width: 1em;
  height: 1em;
  fill: currentColor;
}

/* Ensure font icons inherit size */
.s-icon :deep(i), 
.s-icon :deep(span) {
  font-size: inherit;
}
</style>
