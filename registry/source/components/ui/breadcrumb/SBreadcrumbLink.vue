<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../../../lib/utils'

defineOptions({ inheritAttrs: false })

export interface Props {
  tag?: string
  href?: string
  to?: string | object
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'a',
  href: undefined,
  to: undefined
})

const componentTag = computed(() => {
  if (props.to) return 'router-link'
  if (props.href) return 'a'
  return props.tag
})

const componentBindings = computed(() => {
  const bindings: Record<string, unknown> = {}

  if (props.to) bindings.to = props.to
  if (props.href) bindings.href = props.href

  return bindings
})
</script>

<template>
  <component
    :is="componentTag"
    v-bind="{ ...componentBindings, ...$attrs, class: undefined }"
    :class="cn(
      's-breadcrumb-link inline-flex items-center gap-1 rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2',
      ($attrs.class as string)
    )"
  >
    <slot />
  </component>
</template>