<script setup lang="ts">
import { cn } from '../../../lib/utils'

defineOptions({ inheritAttrs: false })
</script>

<template>
  <span
    v-bind="{ ...$attrs, class: undefined }"
    :class="cn('s-breadcrumb-ellipsis inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground/70', ($attrs.class as string))"
  >
    <slot>
      <span class="mdi mdi-dots-horizontal" aria-hidden="true"></span>
      <span class="sr-only">More breadcrumb items</span>
    </slot>
  </span>
</template>