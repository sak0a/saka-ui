<script lang="ts">
/**
 * SMorphingModalSubtitle - Subtitle element for morphing modal
 */
</script>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

export interface Props {
  /** Additional class */
  subtitleClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  subtitleClass: ''
})
</script>

<template>
  <p
    v-bind="$attrs"
    class="s-morphing-modal-subtitle text-sm text-(--s-text-secondary)"
    :class="subtitleClass"
  >
    <slot />
  </p>
</template>
