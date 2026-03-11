<script setup lang="ts">
import { cn } from '../../../lib/utils'

defineOptions({ inheritAttrs: false })
</script>

<template>
  <ol
    v-bind="{ ...$attrs, class: undefined }"
    :class="cn(
      's-breadcrumb-list m-0 flex list-none flex-wrap items-center gap-1.5 break-words p-0 text-sm text-muted-foreground sm:gap-2.5',
      ($attrs.class as string)
    )"
  >
    <slot />
  </ol>
</template>