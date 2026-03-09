<script setup lang="ts">
/**
 * SMorphingModalImage - Image element for morphing modal
 * Maintains aspect ratio during transition
 */
defineOptions({ inheritAttrs: false })

import { cn } from '~/lib/utils'

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
    v-bind="$attrs"
    :src="src"
    :alt="alt"
    :class="cn('s-morphing-modal-image w-full', imageClass, `object-${objectFit}`, $attrs.class ?? '')"
  />
</template>

<style scoped>
.s-morphing-modal-image {
  transition: height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
