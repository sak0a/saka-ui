<script setup lang="ts">
import { cn } from '../../../lib/utils'

defineOptions({ inheritAttrs: false })

export interface Props {
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Breadcrumb'
})
</script>

<template>
  <nav
    v-bind="{ ...$attrs, class: undefined }"
    :class="cn('s-breadcrumb w-full', ($attrs.class as string))"
    :aria-label="label"
  >
    <slot />
  </nav>
</template>