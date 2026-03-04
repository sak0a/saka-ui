<script lang="ts">
/**
 * SMorphingModalImage - Image element for morphing modal
 * Maintains aspect ratio during transition
 */
</script>

<script setup lang="ts">
export interface Props {
  /** Image source URL */
  src: string
  /** Alt text for accessibility */
  alt?: string
  /** Additional class */
  imageClass?: string
  /** Object fit style */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none'
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  imageClass: '',
  objectFit: 'cover'
})
</script>

<template>
  <img
    :src="src"
    :alt="alt"
    class="s-morphing-modal-image w-full"
    :class="[
      imageClass,
      `object-${objectFit}`
    ]"
  />
</template>

<style scoped>
.s-morphing-modal-image {
  transition: height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
