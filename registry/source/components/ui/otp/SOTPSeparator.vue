<script setup lang="ts">
import { cn } from '../../../lib/utils'

defineOptions({ inheritAttrs: false })
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
