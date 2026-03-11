<script setup lang="ts">
/**
 * SPopoverContent - Floating content panel
 */
defineOptions({ inheritAttrs: false })

import { inject, ref, computed, watch, onBeforeUnmount, nextTick } from 'vue'
import { cn } from '~/lib/utils'
import { SPopoverContextKey, type PopoverPlacement } from './context'

const context = inject(SPopoverContextKey)!
const contentRef = ref<HTMLElement | null>(null)

const menuPosition = ref<{
  top?: number
  bottom?: number
  left?: number
  right?: number
}>({})

// Variant classes
const variantClasses = computed(() => ({
  default: 'bg-popover text-popover-foreground border border-border shadow-xl',
  glass: 'bg-popover/80 backdrop-blur-xl text-popover-foreground border border-border/50 shadow-2xl',
  bordered: 'bg-popover text-popover-foreground border-2 border-border shadow-md',
  elevated: 'bg-popover text-popover-foreground shadow-2xl ring-1 ring-border/10',
}[context.variant]))

// Rounded classes
const roundedClasses = computed(() => ({
  none: 'rounded-none',
  xs: 'rounded-xs',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
  full: 'rounded-full',
}[context.rounded]))

// Animation classes — direction-aware based on actual placement
const animationClasses = computed(() => {
  const placement = context.actualPlacement.value
  const isTop = placement.startsWith('top')
  const isBottom = placement.startsWith('bottom')
  const isLeft = placement.startsWith('left')

  return {
    fade: {
      enter: 'transition-opacity duration-(--s-duration-normal) ease-out',
      enterFrom: 'opacity-0',
      enterTo: 'opacity-100',
      leave: 'transition-opacity duration-(--s-duration-fast) ease-in',
      leaveFrom: 'opacity-100',
      leaveTo: 'opacity-0',
    },
    scale: {
      enter: 'transition-all duration-(--s-duration-normal) ease-out',
      enterFrom: 'opacity-0 scale-95',
      enterTo: 'opacity-100 scale-100',
      leave: 'transition-all duration-(--s-duration-fast) ease-in',
      leaveFrom: 'opacity-100 scale-100',
      leaveTo: 'opacity-0 scale-95',
    },
    slide: {
      enter: 'transition-all duration-(--s-duration-normal) ease-out',
      enterFrom: `opacity-0 ${isTop ? 'translate-y-2' : isBottom ? '-translate-y-2' : isLeft ? 'translate-x-2' : '-translate-x-2'}`,
      enterTo: 'opacity-100 translate-x-0 translate-y-0',
      leave: 'transition-all duration-(--s-duration-fast) ease-in',
      leaveFrom: 'opacity-100 translate-x-0 translate-y-0',
      leaveTo: `opacity-0 ${isTop ? 'translate-y-2' : isBottom ? '-translate-y-2' : isLeft ? 'translate-x-2' : '-translate-x-2'}`,
    },
  }[context.animation]
})

const contentStyle = computed(() => {
  const style: Record<string, string> = {
    zIndex: context.zIndex.toString(),
  }
  if (menuPosition.value.top !== undefined) style.top = `${menuPosition.value.top}px`
  if (menuPosition.value.bottom !== undefined) style.bottom = `${menuPosition.value.bottom}px`
  if (menuPosition.value.left !== undefined) style.left = `${menuPosition.value.left}px`
  if (menuPosition.value.right !== undefined) style.right = `${menuPosition.value.right}px`
  return style
})

const teleportTarget = computed(() => {
  if (context.teleport === true) return 'body'
  if (typeof context.teleport === 'string') return context.teleport
  return undefined
})

// Positioning logic (same approach as SDropdown)
const calculatePosition = () => {
  if (!context.triggerRef.value) return

  const trigger = context.triggerRef.value.getBoundingClientRect()
  const viewport = { width: window.innerWidth, height: window.innerHeight }
  const offset = context.offset

  let placement = context.placement
  let top: number | undefined
  let bottom: number | undefined
  let left: number | undefined
  let right: number | undefined

  const positions: Record<PopoverPlacement, () => void> = {
    'top': () => { bottom = viewport.height - trigger.top + offset; left = trigger.left + trigger.width / 2 },
    'top-start': () => { bottom = viewport.height - trigger.top + offset; left = trigger.left },
    'top-end': () => { bottom = viewport.height - trigger.top + offset; right = viewport.width - trigger.right },
    'bottom': () => { top = trigger.bottom + offset; left = trigger.left + trigger.width / 2 },
    'bottom-start': () => { top = trigger.bottom + offset; left = trigger.left },
    'bottom-end': () => { top = trigger.bottom + offset; right = viewport.width - trigger.right },
    'left': () => { top = trigger.top + trigger.height / 2; right = viewport.width - trigger.left + offset },
    'left-start': () => { top = trigger.top; right = viewport.width - trigger.left + offset },
    'left-end': () => { bottom = viewport.height - trigger.bottom; right = viewport.width - trigger.left + offset },
    'right': () => { top = trigger.top + trigger.height / 2; left = trigger.right + offset },
    'right-start': () => { top = trigger.top; left = trigger.right + offset },
    'right-end': () => { bottom = viewport.height - trigger.bottom; left = trigger.right + offset },
  }

  positions[placement]()

  // Auto-flip if content overflows viewport
  const contentHeight = contentRef.value?.offsetHeight || 200
  const contentWidth = contentRef.value?.offsetWidth || 200

  if (placement.startsWith('bottom') && top !== undefined && top + contentHeight > viewport.height - 10) {
    placement = placement.replace('bottom', 'top') as PopoverPlacement
    top = undefined
    bottom = viewport.height - trigger.top + offset
  } else if (placement.startsWith('top') && bottom !== undefined && viewport.height - bottom + contentHeight > viewport.height - 10) {
    placement = placement.replace('top', 'bottom') as PopoverPlacement
    bottom = undefined
    top = trigger.bottom + offset
  }

  // Horizontal clamping
  if (left !== undefined && left + contentWidth > viewport.width - 10) {
    left = viewport.width - contentWidth - 10
  }
  if (left !== undefined && left < 10) {
    left = 10
  }

  context.actualPlacement.value = placement
  menuPosition.value = { top, bottom, left, right }
}

// Click outside handling
const handleClickOutside = (event: MouseEvent) => {
  if (!context.closeOnClickOutside) return
  const target = event.target as Node
  if (
    context.triggerRef.value &&
    contentRef.value &&
    !context.triggerRef.value.contains(target) &&
    !contentRef.value.contains(target)
  ) {
    context.close()
  }
}

// Escape key handling
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && context.closeOnEscape) {
    event.preventDefault()
    context.close()
    context.triggerRef.value?.focus()
  }
}

// Focus management — move focus into content on open
const focusContent = async () => {
  await nextTick()
  if (!contentRef.value) return
  const focusable = contentRef.value.querySelector<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  if (focusable) {
    focusable.focus()
  } else {
    contentRef.value.focus()
  }
}

// Hover handling for content (keeps popover open when hovering over content)
let hideTimeout: ReturnType<typeof setTimeout> | null = null

const handleContentMouseEnter = () => {
  if (context.trigger !== 'hover') return
  if (hideTimeout) { clearTimeout(hideTimeout); hideTimeout = null }
}

const handleContentMouseLeave = () => {
  if (context.trigger !== 'hover') return
  hideTimeout = setTimeout(() => context.close(), context.hideDelay)
}

watch(() => context.isOpen.value, async (val) => {
  if (val) {
    await nextTick()
    calculatePosition()
    focusContent()
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeydown)
    window.addEventListener('scroll', calculatePosition, true)
    window.addEventListener('resize', calculatePosition)
  } else {
    document.removeEventListener('mousedown', handleClickOutside)
    document.removeEventListener('keydown', handleKeydown)
    window.removeEventListener('scroll', calculatePosition, true)
    window.removeEventListener('resize', calculatePosition)
  }
})

onBeforeUnmount(() => {
  if (hideTimeout) clearTimeout(hideTimeout)
  document.removeEventListener('mousedown', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('scroll', calculatePosition, true)
  window.removeEventListener('resize', calculatePosition)
})
</script>

<template>
  <Teleport v-if="teleportTarget" :to="teleportTarget">
    <Transition
      :enter-active-class="animationClasses.enter"
      :enter-from-class="animationClasses.enterFrom"
      :enter-to-class="animationClasses.enterTo"
      :leave-active-class="animationClasses.leave"
      :leave-from-class="animationClasses.leaveFrom"
      :leave-to-class="animationClasses.leaveTo"
    >
      <div
        v-if="context.isOpen.value"
        ref="contentRef"
        v-bind="$attrs"
        :id="context.contentId"
        role="dialog"
        :aria-labelledby="context.triggerId"
        tabindex="-1"
        :class="cn(
          's-popover-content fixed p-4',
          variantClasses,
          roundedClasses,
          $attrs.class ?? ''
        )"
        :style="contentStyle"
        @mouseenter="handleContentMouseEnter"
        @mouseleave="handleContentMouseLeave"
      >
        <slot />
      </div>
    </Transition>
  </Teleport>

  <template v-else>
    <Transition
      :enter-active-class="animationClasses.enter"
      :enter-from-class="animationClasses.enterFrom"
      :enter-to-class="animationClasses.enterTo"
      :leave-active-class="animationClasses.leave"
      :leave-from-class="animationClasses.leaveFrom"
      :leave-to-class="animationClasses.leaveTo"
    >
      <div
        v-if="context.isOpen.value"
        ref="contentRef"
        v-bind="$attrs"
        :id="context.contentId"
        role="dialog"
        :aria-labelledby="context.triggerId"
        tabindex="-1"
        :class="cn(
          's-popover-content fixed p-4',
          variantClasses,
          roundedClasses,
          $attrs.class ?? ''
        )"
        :style="contentStyle"
        @mouseenter="handleContentMouseEnter"
        @mouseleave="handleContentMouseLeave"
      >
        <slot />
      </div>
    </Transition>
  </template>
</template>

<style scoped>
.s-popover-content {
  outline: none;
}

.s-popover-content:focus-visible {
  outline: none;
}
</style>
