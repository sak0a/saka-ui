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
  color?: string
}

withDefaults(defineProps<Props>(), {
  separator: '+',
  size: 'md',
  variant: 'default',
  color: undefined,
})
</script>

<template>
  <span
    v-bind="$attrs"
    :class="cn('inline-flex items-center gap-1', (attrs as Record<string, unknown>).class as string)"
  >
    <template v-for="(key, i) in keys" :key="i">
      <span v-if="i > 0" class="text-xs text-muted-foreground">{{ separator }}</span>
      <SKbd :size="size" :variant="variant" :color="color">{{ key }}</SKbd>
    </template>
  </span>
</template>
