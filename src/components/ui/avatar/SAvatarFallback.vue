<script setup lang="ts">
defineOptions({ inheritAttrs: false })

import { inject, computed, ref, watchEffect } from 'vue'

interface Props {
  delayMs?: number
  color?: string
  bgColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  delayMs: 0,
  color: undefined,
  bgColor: undefined
})

// Inject avatar context
const avatarContext = inject<{
  state: { imageLoaded: boolean; imageFailed: boolean }
  setImageLoaded: (loaded: boolean) => void
  setImageFailed: (failed: boolean) => void
}>('avatarContext')

const canRender = ref(props.delayMs === 0)

// Show fallback logic
const shouldShow = computed(() => {
  if (!avatarContext) return canRender.value
  // Show fallback if image failed OR if image hasn't loaded yet
  return canRender.value && (!avatarContext.state.imageLoaded || avatarContext.state.imageFailed)
})

// Handle delay
watchEffect(() => {
  if (props.delayMs > 0 && !canRender.value) {
    const timer = setTimeout(() => {
      canRender.value = true
    }, props.delayMs)
    
    return () => clearTimeout(timer)
  }
})

// Custom styles
const customStyles = computed(() => {
  const styles: Record<string, string> = {}
  if (props.color) styles.color = props.color
  if (props.bgColor) styles.backgroundColor = props.bgColor
  return styles
})
</script>

<template>
  <span
    v-if="shouldShow"
    v-bind="$attrs"
    class="flex items-center justify-center w-full h-full uppercase font-medium"
    :style="customStyles"
  >
    <slot>
      <!-- Default fallback icon -->
      <span class="mdi mdi-account text-[1.2em]" />
    </slot>
  </span>
</template>
