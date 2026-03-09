<script setup lang="ts">
/**
 * SMorphingCardImage - Image element for morphing card
 * Used in both trigger and expanded content
 */
import { inject, computed, ref } from 'vue'
import { SMorphingCardContextKey } from './SMorphingCard.vue'
import { cn } from '~/lib/utils'

defineOptions({ inheritAttrs: false })

export interface Props {
  /** Image source */
  src: string
  /** Alt text */
  alt?: string
  /** Aspect ratio for the image container */
  aspectRatio?: string
  /** Object fit style */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none'
  /** Object position */
  objectPosition?: string
  /** Additional class */
  imageClass?: string
  /** Container class */
  containerClass?: string
  /** Show loading state */
  loading?: 'lazy' | 'eager'
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  aspectRatio: '16/9',
  objectFit: 'cover',
  objectPosition: 'center',
  imageClass: '',
  containerClass: '',
  loading: 'lazy'
})

const context = inject(SMorphingCardContextKey)
const isLoaded = ref(false)
const hasError = ref(false)

const containerStyle = computed(() => ({
  aspectRatio: props.aspectRatio
}))

const imageStyle = computed(() => ({
  objectFit: props.objectFit,
  objectPosition: props.objectPosition
}))

const handleLoad = () => {
  isLoaded.value = true
}

const handleError = () => {
  hasError.value = true
}
</script>

<template>
  <div
    v-bind="$attrs"
    :class="cn('s-morphing-card-image relative overflow-hidden bg-muted', containerClass)"
    :style="containerStyle"
  >
    <!-- Loading placeholder -->
    <div
      v-if="!isLoaded && !hasError"
      class="absolute inset-0 flex items-center justify-center bg-muted"
    >
      <div class="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
    </div>
    
    <!-- Error placeholder -->
    <div
      v-if="hasError"
      class="absolute inset-0 flex flex-col items-center justify-center bg-muted text-muted-foreground"
    >
      <span class="mdi mdi-image-broken-variant text-4xl mb-2" />
      <span class="text-sm">Failed to load image</span>
    </div>
    
    <!-- Actual image -->
    <img
      v-show="isLoaded && !hasError"
      :src="src"
      :alt="alt"
      :loading="loading"
      class="w-full h-full transition-opacity duration-300"
      :class="[imageClass, isLoaded ? 'opacity-100' : 'opacity-0']"
      :style="imageStyle"
      @load="handleLoad"
      @error="handleError"
    >
  </div>
</template>

<style scoped>
.s-morphing-card-image {
  flex-shrink: 0;
}
</style>
