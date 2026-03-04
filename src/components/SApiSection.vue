<script setup lang="ts">
interface Props {
  /** Title of the API section (e.g., "API Reference") */
  title?: string
}

withDefaults(defineProps<Props>(), {
  title: 'API Reference'
})
</script>

<template>
  <section data-toc-section>
    <slot />
  </section>
</template>
