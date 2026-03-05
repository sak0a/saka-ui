<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <div
    v-bind="$attrs"
    class="s-otp-separator flex items-center justify-center px-1 text-(--s-text-tertiary) font-bold select-none text-2xl"
    role="separator"
  >
    <slot>-</slot>
  </div>
</template>
