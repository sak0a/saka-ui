<script lang="ts">
/**
 * SMorphingCard - Morphing Card Component
 * A card that expands from a thumbnail/preview state to a full detail view
 * with smooth layout animations.
 */
import { type InjectionKey, type Ref } from 'vue'

export interface SMorphingCardContext {
  isOpen: Ref<boolean>
  isExpanded: Ref<boolean>
  triggerRect: Ref<DOMRect | null>
  open: () => void
  close: () => void
  registerTrigger: (el: HTMLElement | null) => void
  uniqueId: string
}

export const SMorphingCardContextKey: InjectionKey<SMorphingCardContext> = Symbol('SMorphingCardContext')
</script>

<script setup lang="ts">
import { ref, computed, provide, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { cn } from '~/lib/utils'

defineOptions({ inheritAttrs: false })

export interface Props {
  /** Control card expansion */
  modelValue?: boolean
  /** Transition duration in ms for opening */
  duration?: number
  /** Transition duration in ms for closing (defaults to duration * 1.2) */
  closeDuration?: number
  /** Easing function for opening */
  easing?: string
  /** Easing function for closing (defaults to a smoother ease-out) */
  closeEasing?: string
  /** Close on backdrop click */
  closeOnBackdrop?: boolean
  /** Close on escape key */
  closeOnEscape?: boolean
  /** Lock body scroll when open */
  lockScroll?: boolean
  /** Z-index for the expanded card */
  zIndex?: number
  /** Backdrop blur effect */
  backdropBlur?: boolean
  /** Expanded card max width */
  maxWidth?: number
  /** Expanded card max height */
  maxHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  duration: 500,
  closeDuration: undefined,
  easing: 'cubic-bezier(0.32, 0.72, 0, 1)',
  closeEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  closeOnBackdrop: true,
  closeOnEscape: true,
  lockScroll: true,
  zIndex: 1000,
  backdropBlur: true,
  maxWidth: 600,
  maxHeight: 700
})

// Computed durations
const actualCloseDuration = computed(() => props.closeDuration ?? Math.round(props.duration * 1.2))

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'open': []
  'close': []
  'opened': []
  'closed': []
}>()

// Generate unique ID
const uniqueId = `morphing-card-${Math.random().toString(36).slice(2, 9)}`

// Refs
const isVisible = ref(false)
const isExpanded = ref(false)
const isOpen = ref(props.modelValue)
const isClosing = ref(false)
const triggerElement = ref<HTMLElement | null>(null)
const triggerRect = ref<DOMRect | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const previousActiveElement = ref<HTMLElement | null>(null)

// Store the actual dimensions when expanded for smooth close transition
const expandedRect = ref<{ width: number; height: number; top: number; left: number } | null>(null)

// Trigger visibility strategy:
// - During open: overlay (0->1) expands while trigger (1->0) is visible.
// - During close: overlay (1->0) collapses while trigger (0->1) fades back in.
// This creates a symmetric "backwards" morph.
const triggerOpacity = computed(() => (isExpanded.value ? 0 : 1))

const triggerWrapperStyle = computed(() => {
  const isClosingState = isClosing.value
  const duration = isClosingState ? actualCloseDuration.value : props.duration
  const easing = isClosingState ? props.closeEasing : props.easing

  return {
    opacity: triggerOpacity.value,
    pointerEvents: isVisible.value ? 'none' : 'auto',
    transitionProperty: 'opacity',
    transitionDuration: `${duration}ms`,
    transitionTimingFunction: easing
  }
})

// Scrollbar width calculation
let scrollbarWidth = 0

const getScrollbarWidth = () => {
  const outer = document.createElement('div')
  outer.style.visibility = 'hidden'
  outer.style.overflow = 'scroll'
  document.body.appendChild(outer)
  const inner = document.createElement('div')
  outer.appendChild(inner)
  const sw = outer.offsetWidth - inner.offsetWidth
  outer.parentNode?.removeChild(outer)
  return sw
}

const lockBodyScroll = () => {
  if (!props.lockScroll) return
  scrollbarWidth = getScrollbarWidth()
  const hasScrollbar = window.innerWidth > document.documentElement.clientWidth
  document.body.style.overflow = 'hidden'
  if (hasScrollbar) {
    document.body.style.paddingRight = `${scrollbarWidth}px`
  }
}

const unlockBodyScroll = () => {
  if (!props.lockScroll) return
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
}

// Computed styles for collapsed state (at trigger position)
const collapsedStyle = computed(() => {
  if (!triggerRect.value) return {}
  
  const rect = triggerRect.value
  return {
    position: 'fixed' as const,
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    borderRadius: '16px',
    // Keep opacity 1 for closing morph - the morph IS the effect
    // Only fade for opening initial state
    opacity: 1,
    transform: 'scale(1)'
  }
})

// Computed styles for expanded state (centered)
const expandedStyle = computed(() => {
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1024
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 768
  
  const cardWidth = Math.min(viewportWidth * 0.9, props.maxWidth)
  const cardHeight = Math.min(viewportHeight * 0.85, props.maxHeight)
  
  return {
    position: 'fixed' as const,
    top: `${(viewportHeight - cardHeight) / 2}px`,
    left: `${(viewportWidth - cardWidth) / 2}px`,
    width: `${cardWidth}px`,
    height: 'auto',
    maxHeight: `${cardHeight}px`,
    borderRadius: '24px'
  }
})

// Style for the "from" state when closing (captures actual expanded dimensions)
const closeFromStyle = computed(() => {
  if (!expandedRect.value) return expandedStyle.value
  
  return {
    position: 'fixed' as const,
    top: `${expandedRect.value.top}px`,
    left: `${expandedRect.value.left}px`,
    width: `${expandedRect.value.width}px`,
    height: `${expandedRect.value.height}px`,
    borderRadius: '24px',
    opacity: 1,
    transform: 'scale(1)'
  }
})

// Current style based on expansion state with transitions
const contentStyle = computed(() => {
  // Use different timing for open vs close
  const isClosingState = isClosing.value
  const currentDuration = isClosingState ? actualCloseDuration.value : props.duration
  const currentEasing = isClosingState ? props.closeEasing : props.easing
  
  const baseStyle = {
    transitionProperty: 'top, left, width, height, max-height, border-radius, opacity, transform',
    transitionDuration: `${currentDuration}ms`,
    transitionTimingFunction: currentEasing,
    willChange: 'top, left, width, height, border-radius, opacity, transform',
    transformOrigin: 'top left'
  }
  
  // When expanded - show at expanded position
  if (isExpanded.value && !isClosing.value) {
    return { ...baseStyle, ...expandedStyle.value, opacity: 1, transform: 'scale(1)' }
  }
  
  // When closing but animation hasn't started yet - stay at captured expanded position
  if (isClosing.value && isExpanded.value) {
    return { ...baseStyle, ...closeFromStyle.value }
  }
  
  // When closing and animation has started - animate to collapsed position
  // Return to the exact same state the opening started from: collapsed position, opacity 0, scale 0.95.
  if (isClosing.value && !isExpanded.value) {
    return { ...baseStyle, ...collapsedStyle.value, opacity: 0, transform: 'scale(0.95)' }
  }
  
  // Initial collapsed state (opening) - start faded and slightly scaled down
  return { ...baseStyle, ...collapsedStyle.value, opacity: 0, transform: 'scale(0.95)' }
})

// Methods
const registerTrigger = (el: HTMLElement | null) => {
  triggerElement.value = el
}

const updateTriggerRect = () => {
  if (triggerElement.value) {
    triggerRect.value = triggerElement.value.getBoundingClientRect()
  }
}

const open = () => {
  if (isVisible.value) return
  
  previousActiveElement.value = document.activeElement as HTMLElement
  updateTriggerRect()
  
  isVisible.value = true
  isOpen.value = true
  isClosing.value = false
  
  lockBodyScroll()
  emit('update:modelValue', true)
  emit('open')
  
  // Wait for DOM update, then trigger expansion
  nextTick(() => {
    // Force a reflow to ensure the collapsed position is applied first
    contentRef.value?.offsetHeight
    
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        isExpanded.value = true
        
        setTimeout(() => {
          emit('opened')
          contentRef.value?.focus()
        }, props.duration)
      })
    })
  })
}

const close = () => {
  if (!isVisible.value || isClosing.value) return
  
  // Capture current expanded dimensions before closing
  // This is crucial for smooth transitions since 'height: auto' can't be animated
  if (contentRef.value) {
    const rect = contentRef.value.getBoundingClientRect()
    expandedRect.value = {
      width: rect.width,
      height: rect.height,
      top: rect.top,
      left: rect.left
    }
  }
  
  updateTriggerRect()
  isClosing.value = true
  
  emit('close')
  
  // Use nextTick + requestAnimationFrame like opening for consistency
  nextTick(() => {
    // Force reflow to ensure the captured dimensions are applied
    contentRef.value?.offsetHeight
    
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        isExpanded.value = false
        
        // Wait for the morph transition to complete using close duration
        setTimeout(() => {
          isVisible.value = false
          isOpen.value = false
          isClosing.value = false
          expandedRect.value = null
          unlockBodyScroll()
          emit('update:modelValue', false)
          emit('closed')
          
          if (previousActiveElement.value) {
            previousActiveElement.value.focus()
          }
        }, actualCloseDuration.value)
      })
    })
  })
}

const handleBackdropClick = (event: MouseEvent) => {
  if (props.closeOnBackdrop && event.target === event.currentTarget) {
    close()
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.closeOnEscape && isVisible.value && !isClosing.value) {
    event.preventDefault()
    event.stopPropagation()
    close()
  }
}

// Watch modelValue
watch(() => props.modelValue, (value) => {
  if (value && !isVisible.value) {
    open()
  } else if (!value && isVisible.value && !isClosing.value) {
    close()
  }
})

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  unlockBodyScroll()
})

// Provide context
provide(SMorphingCardContextKey, {
  isOpen,
  isExpanded,
  triggerRect,
  open,
  close,
  registerTrigger,
  uniqueId
})

// Expose for external control
defineExpose({
  open,
  close,
  isOpen,
  isExpanded
})
</script>

<template>
  <div v-bind="$attrs" :class="cn('s-morphing-card-wrapper')">
    <!-- Trigger Slot (always visible) -->
    <div
      class="s-morphing-card-trigger-wrapper"
      :style="triggerWrapperStyle"
      :aria-hidden="isOpen"
    >
      <slot name="trigger" />
    </div>
    
    <Teleport to="body">
      <!-- Backdrop -->
      <div
        v-if="isVisible"
        class="s-morphing-card-backdrop fixed inset-0"
        :class="[
          'bg-black/60 dark:bg-black/70',
          backdropBlur ? 'backdrop-blur-md' : '',
          isExpanded ? 'opacity-100' : 'opacity-0'
        ]"
        :style="{ 
          zIndex,
          transitionProperty: 'opacity',
          transitionDuration: `${isClosing ? actualCloseDuration : duration}ms`,
          transitionTimingFunction: isClosing ? closeEasing : easing
        }"
        aria-hidden="true"
        @click="handleBackdropClick"
      />
      
      <!-- Expanded Card Content -->
      <div
        v-if="isVisible"
        ref="contentRef"
        :class="cn('s-morphing-card-content bg-background shadow-2xl overflow-hidden outline-none border border-border')"
        :style="{ ...contentStyle, zIndex: zIndex + 1 }"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="`${uniqueId}-title`"
        tabindex="-1"
        @click.stop
      >
        <slot name="content" />
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.s-morphing-card-backdrop {
  will-change: opacity;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.s-morphing-card-content {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
</style>
