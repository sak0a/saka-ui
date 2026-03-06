<script setup lang="ts">
import { useAttrs } from 'vue'
import { cn } from '~/lib/utils'
import SKbd from './SKbd.vue'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()

interface Props {
  keys: string[]
  separator?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outlined' | 'flat' | 'ghost'
}

withDefaults(defineProps<Props>(), {
  separator: '+',
  size: 'md',
  variant: 'default',
})
</script>

<template>
  <span
    v-bind="$attrs"
    :class="cn('inline-flex items-center gap-1', (attrs as Record<string, unknown>).class)"
  >
    <template v-for="(key, i) in keys" :key="i">
      <span v-if="i > 0" class="text-xs text-muted-foreground">{{ separator }}</span>
      <SKbd :size="size" :variant="variant">{{ key }}</SKbd>
    </template>
  </span>
</template>
