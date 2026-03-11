<script setup lang="ts">
/**
 * SPopover - Flexible popover component for contextual content
 */
import { ref, provide, watch, onBeforeUnmount } from 'vue'
import { cn } from '~/lib/utils'
import {
  SPopoverContextKey,
  type PopoverPlacement,
  type PopoverTrigger,
  type PopoverVariant,
  type PopoverAnimation,
  type PopoverRounded,
} from './context'

defineOptions({ inheritAttrs: false })

export interface Props {
  /** How to trigger the popover */
  trigger?: PopoverTrigger
  /** Placement of the popover */
  placement?: PopoverPlacement
  /** Visual variant */
  variant?: PopoverVariant
  /** Animation type */
  animation?: PopoverAnimation
  /** Offset from trigger (px) */
  offset?: number
  /** Disable opening */
  disabled?: boolean
  /** Teleport target */
  teleport?: boolean | string
  /** Z-index for content */
  zIndex?: number
  /** Delay before showing (hover trigger, ms) */
  showDelay?: number
  /** Delay before hiding (hover trigger, ms) */
  hideDelay?: number
  /** Close when clicking outside */
  closeOnClickOutside?: boolean
  /** Close on Escape key */
  closeOnEscape?: boolean
  /** Manual control of visibility */
  visible?: boolean
  /** Border radius */
  rounded?: PopoverRounded
}

const props = withDefaults(defineProps<Props>(), {
  trigger: 'click',
  placement: 'bottom',
  variant: 'default',
  animation: 'scale',
  offset: 8,
  disabled: false,
  teleport: true,
  zIndex: 1000,
  showDelay: 100,
  hideDelay: 150,
  closeOnClickOutside: true,
  closeOnEscape: true,
  visible: undefined,
  rounded: 'xl',
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'open': []
  'close': []
}>()

const isOpen = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const actualPlacement = ref<PopoverPlacement>(props.placement)

let showTimeout: ReturnType<typeof setTimeout> | null = null
let hideTimeout: ReturnType<typeof setTimeout> | null = null

const uniqueId = Math.random().toString(36).substring(2, 9)
const triggerId = `s-popover-trigger-${uniqueId}`
const contentId = `s-popover-content-${uniqueId}`

const open = () => {
  if (props.disabled || isOpen.value) return
  if (hideTimeout) { clearTimeout(hideTimeout); hideTimeout = null }
  isOpen.value = true
  emit('update:visible', true)
  emit('open')
}

const close = () => {
  if (!isOpen.value) return
  if (showTimeout) { clearTimeout(showTimeout); showTimeout = null }
  isOpen.value = false
  emit('update:visible', false)
  emit('close')
}

const toggle = () => {
  if (isOpen.value) close()
  else open()
}

// Manual control via visible prop
watch(() => props.visible, (val) => {
  if (props.trigger === 'manual' && val !== undefined) {
    if (val) open()
    else close()
  }
})

onBeforeUnmount(() => {
  if (showTimeout) clearTimeout(showTimeout)
  if (hideTimeout) clearTimeout(hideTimeout)
})

provide(SPopoverContextKey, {
  isOpen,
  open,
  close,
  toggle,
  triggerId,
  contentId,
  triggerRef,
  placement: props.placement,
  variant: props.variant,
  animation: props.animation,
  offset: props.offset,
  zIndex: props.zIndex,
  teleport: props.teleport,
  rounded: props.rounded,
  disabled: props.disabled,
  closeOnClickOutside: props.closeOnClickOutside,
  closeOnEscape: props.closeOnEscape,
  trigger: props.trigger,
  showDelay: props.showDelay,
  hideDelay: props.hideDelay,
  actualPlacement,
})

defineExpose({ open, close, toggle })
</script>

<template>
  <div :class="cn('s-popover relative inline-block', $attrs.class ?? '')" v-bind="$attrs">
    <slot />
  </div>
</template>
