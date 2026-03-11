<script setup lang="ts">
import { ref, inject, onMounted, watch } from 'vue'

defineOptions({ inheritAttrs: false })

interface Props {
  src?: string
  alt?: string
  loading?: 'eager' | 'lazy'
  crossorigin?: 'anonymous' | 'use-credentials' | ''
  referrerpolicy?: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url'
}

const props = withDefaults(defineProps<Props>(), {
  src: undefined,
  alt: 'Avatar',
  loading: 'eager',
  crossorigin: undefined,
  referrerpolicy: undefined
})

const emit = defineEmits<{
  load: [event: Event]
  error: [event: Event]
}>()

// Inject avatar context
const avatarContext = inject<{
  state: { imageLoaded: boolean; imageFailed: boolean }
  setImageLoaded: (loaded: boolean) => void
  setImageFailed: (failed: boolean) => void
}>('avatarContext')

const imageRef = ref<HTMLImageElement | null>(null)
const isLoaded = ref(false)
const hasError = ref(false)

const handleLoad = (event: Event) => {
  isLoaded.value = true
  hasError.value = false
  avatarContext?.setImageLoaded(true)
  avatarContext?.setImageFailed(false)
  emit('load', event)
}

const handleError = (event: Event) => {
  isLoaded.value = false
  hasError.value = true
  avatarContext?.setImageLoaded(false)
  avatarContext?.setImageFailed(true)
  emit('error', event)
}

// Reset state when src changes
watch(() => props.src, () => {
  isLoaded.value = false
  hasError.value = false
  avatarContext?.setImageLoaded(false)
  avatarContext?.setImageFailed(false)
})

// Check if image is already cached
onMounted(() => {
  if (imageRef.value?.complete && imageRef.value?.naturalWidth > 0) {
    isLoaded.value = true
    avatarContext?.setImageLoaded(true)
  }
})
</script>

<template>
  <img
    v-if="src && !hasError"
    v-bind="$attrs"
    ref="imageRef"
    :src="src"
    :alt="alt"
    :loading="loading"
    :crossorigin="crossorigin"
    :referrerpolicy="referrerpolicy"
    class="absolute inset-0 w-full h-full object-cover"
    :class="{ 'opacity-0': !isLoaded }"
    @load="handleLoad"
    @error="handleError"
  />
</template>

<style scoped>
img {
  transition: opacity 0.2s ease-in-out;
}
</style>
