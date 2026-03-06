<script setup lang="ts">
import { cn } from '~/lib/utils'

defineOptions({ inheritAttrs: false })
</script>

<template>
  <li
    v-bind="{ ...$attrs, class: undefined }"
    :class="cn('s-breadcrumb-item inline-flex min-w-0 items-center gap-1.5', ($attrs.class as string))"
  >
    <slot />
  </li>
</template>