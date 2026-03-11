<script setup lang="ts">
import { cn } from '../../../lib/utils'

defineOptions({ inheritAttrs: false })
</script>

<template>
  <span
    v-bind="{ ...$attrs, class: undefined }"
    :class="cn('s-breadcrumb-page inline-flex items-center gap-1 rounded-md font-medium text-foreground', ($attrs.class as string))"
    aria-current="page"
  >
    <slot />
  </span>
</template>