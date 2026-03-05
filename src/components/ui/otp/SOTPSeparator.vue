<script setup lang="ts">
defineOptions({ inheritAttrs: false })

import { cn } from '~/lib/utils'
</script>

<template>
  <div
    v-bind="$attrs"
    :class="cn('s-otp-separator flex items-center justify-center px-1 text-muted-foreground font-bold select-none text-2xl', $attrs.class ?? '')"
    role="separator"
  >
    <slot>-</slot>
  </div>
</template>
