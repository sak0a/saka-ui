<script lang="ts">
/**
 * SMorphingCardTitle - Title element for morphing card
 */
</script>

<script setup lang="ts">
import { inject } from 'vue'
import { SMorphingCardContextKey } from './SMorphingCard.vue'

export interface Props {
  /** HTML tag to use */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div'
  /** Additional class */
  titleClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  as: 'h2',
  titleClass: ''
})

const context = inject(SMorphingCardContextKey)
</script>

<template>
  <component
    :is="as"
    :id="`${context?.uniqueId}-title`"
    class="s-morphing-card-title text-xl font-semibold text-(--s-text-primary) tracking-tight"
    :class="titleClass"
  >
    <slot />
  </component>
</template>
