<script setup lang="ts">
import { cn } from '../../../lib/utils'

defineOptions({ inheritAttrs: false })
</script>

<template>
  <li
    v-bind="{ ...$attrs, class: undefined }"
    :class="cn('s-breadcrumb-separator inline-flex items-center justify-center text-muted-foreground/70', ($attrs.class as string))"
    role="presentation"
    aria-hidden="true"
  >
    <slot>
      <span class="mdi mdi-chevron-right text-sm"></span>
    </slot>
  </li>
</template>