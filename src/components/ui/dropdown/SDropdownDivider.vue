<script setup lang="ts">
defineOptions({ inheritAttrs: false })

export interface Props {
  /** Custom margin */
  margin?: string
}

withDefaults(defineProps<Props>(), {
  margin: '4px'
})
</script>

<template>
  <div
    class="s-dropdown-divider h-px bg-(--s-border)/60"
    role="separator"
    :style="{ marginTop: margin, marginBottom: margin }"
    v-bind="$attrs"
  />
</template>
