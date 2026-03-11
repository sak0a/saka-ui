<script setup lang="ts">
/**
 * SPopoverTrigger - Element that opens/closes the popover
 */
defineOptions({ inheritAttrs: false })

import { inject, ref, onMounted, onBeforeUnmount } from 'vue'
import { cn } from '~/lib/utils'
import { SPopoverContextKey } from './context'

export interface Props {
  /** Render as a different element */
  as?: string
  /** Disable trigger */
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
  disabled: false,
})

const context = inject(SPopoverContextKey)!
const elRef = ref<HTMLElement | null>(null)

let showTimeout: ReturnType<typeof setTimeout> | null = null
let hideTimeout: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  if (elRef.value) {
    context.triggerRef.value = elRef.value
  }
})

onBeforeUnmount(() => {
  if (showTimeout) clearTimeout(showTimeout)
  if (hideTimeout) clearTimeout(hideTimeout)
})

const handleClick = (event: MouseEvent) => {
  if (props.disabled || context.disabled) return
  if (context.trigger === 'click') {
    event.preventDefault()
    context.toggle()
  }
}

const handleMouseEnter = () => {
  if (props.disabled || context.disabled || context.trigger !== 'hover') return
  if (hideTimeout) { clearTimeout(hideTimeout); hideTimeout = null }
  showTimeout = setTimeout(() => context.open(), context.showDelay)
}

const handleMouseLeave = () => {
  if (context.trigger !== 'hover') return
  if (showTimeout) { clearTimeout(showTimeout); showTimeout = null }
  hideTimeout = setTimeout(() => context.close(), context.hideDelay)
}

const handleFocus = () => {
  if (props.disabled || context.disabled || context.trigger !== 'focus') return
  context.open()
}

const handleBlur = () => {
  if (context.trigger !== 'focus') return
  context.close()
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    if (context.trigger === 'click') {
      event.preventDefault()
      context.toggle()
    }
  }
}
</script>

<template>
  <component
    :is="as"
    ref="elRef"
    v-bind="$attrs"
    :id="context.triggerId"
    :type="as === 'button' ? 'button' : undefined"
    :class="cn(
      's-popover-trigger inline-flex outline-none',
      (disabled || context.disabled) ? 'opacity-(--s-opacity-disabled) cursor-not-allowed' : 'cursor-pointer',
      $attrs.class ?? ''
    )"
    :disabled="(disabled || context.disabled) && as === 'button'"
    :aria-expanded="context.isOpen.value"
    :aria-haspopup="'dialog'"
    :aria-controls="context.isOpen.value ? context.contentId : undefined"
    :aria-disabled="disabled || context.disabled"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @focus="handleFocus"
    @blur="handleBlur"
    @keydown="handleKeydown"
  >
    <slot />
  </component>
</template>

<style scoped>
.s-popover-trigger:focus-visible {
  outline: 2px solid var(--s-primary);
  outline-offset: 2px;
  border-radius: 4px;
}
</style>
