<script lang="ts">
/**
 * SDrawer - Advanced Drawer/Sheet Component
 * A fully accessible, animated drawer with swipe gestures, snap points, and keyboard navigation
 */
import { type InjectionKey, type Ref } from 'vue'

// Types
export type DrawerSide = 'left' | 'right' | 'top' | 'bottom'
export type DrawerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
export type DrawerVariant = 'default' | 'glass' | 'bordered' | 'elevated' | 'minimal'

export interface SDrawerContext {
  close: () => void
  isOpen: Ref<boolean>
  side: DrawerSide
  hasHeader: Ref<boolean>
  hasFooter: Ref<boolean>
  setHasHeader: (value: boolean) => void
  setHasFooter: (value: boolean) => void
  titleId: string
  descriptionId: string
  dragProgress: Ref<number>
  isDragging: Ref<boolean>
}

export const SDrawerContextKey: InjectionKey<SDrawerContext> = Symbol('SDrawerContext')
</script>

<script setup lang="ts">
import { ref, computed, provide, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

export interface Props {
  /** Control drawer visibility */
  modelValue?: boolean
  /** Which side the drawer slides from */
  side?: DrawerSide
  /** Drawer size */
  size?: DrawerSize
  /** Visual variant */
  variant?: DrawerVariant
  /** Show close button */
  closable?: boolean
  /** Close on backdrop click */
  closeOnBackdrop?: boolean
  /** Close on escape key */
  closeOnEscape?: boolean
  /** Lock body scroll when open */
  lockScroll?: boolean
  /** Trap focus within drawer */
  trapFocus?: boolean
  /** Show backdrop overlay */
  backdrop?: boolean
  /** Backdrop blur effect */
  backdropBlur?: boolean
  /** Custom backdrop class */
  backdropClass?: string
  /** Custom drawer panel class */
  panelClass?: string
  /** Teleport target */
  teleport?: boolean | string
  /** Z-index for the drawer */
  zIndex?: number
  /** Drawer title (alternative to header slot) */
  title?: string
  /** Drawer description */
  description?: string
  /** Hide the default header */
  hideHeader?: boolean
  /** Initial focus selector */
  initialFocus?: string
  /** Auto-focus first interactive element */
  autoFocus?: boolean
  /** Enable swipe/drag to close */
  swipeable?: boolean
  /** Swipe threshold to close (0-1) */
  swipeThreshold?: number
  /** Show drag handle indicator */
  showHandle?: boolean
  /** Snap points (percentages from 0-100) for bottom/top drawers */
  snapPoints?: number[]
  /** Default snap point index */
  defaultSnapPoint?: number
  /** Enable modal mode (adds rounded corners, handle) */
  modal?: boolean
  /** Custom rounded corners */
  rounded?: boolean
  /** Animation duration in ms */
  duration?: number
  /** Overlay opacity (0-1) */
  overlayOpacity?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  side: 'bottom',
  size: 'md',
  variant: 'default',
  closable: true,
  closeOnBackdrop: true,
  closeOnEscape: true,
  lockScroll: true,
  trapFocus: true,
  backdrop: true,
  backdropBlur: false,
  backdropClass: '',
  panelClass: '',
  teleport: true,
  zIndex: 1000,
  title: undefined,
  description: undefined,
  hideHeader: false,
  initialFocus: undefined,
  autoFocus: false,
  swipeable: true,
  swipeThreshold: 0.3,
  showHandle: true,
  snapPoints: () => [],
  defaultSnapPoint: 0,
  modal: false,
  rounded: true,
  duration: 300,
  overlayOpacity: 0.5
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'open': []
  'close': []
  'opened': []
  'closed': []
  'before-open': []
  'before-close': []
  'snap': [snapIndex: number, snapValue: number]
  'drag-start': []
  'drag-end': [progress: number]
}>()

// Generate unique IDs for ARIA
const uid = Math.random().toString(36).slice(2, 9)
const titleId = `drawer-title-${uid}`
const descriptionId = `drawer-desc-${uid}`

// Refs
const drawerRef = ref<HTMLElement | null>(null)
const backdropRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const isOpen = ref(props.modelValue)
const isAnimating = ref(false)
const hasHeader = ref(false)
const hasFooter = ref(false)
const previousActiveElement = ref<HTMLElement | null>(null)

// Drag/Swipe state
const isDragging = ref(false)
const dragProgress = ref(0)
const dragStartPos = ref(0)
const dragCurrentPos = ref(0)
const currentSnapIndex = ref(props.defaultSnapPoint)

// Focus trap elements
const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
let scrollbarWidth = 0

// Computed
const teleportTarget = computed(() => {
  if (props.teleport === true) return 'body'
  if (typeof props.teleport === 'string') return props.teleport
  return undefined
})

const isHorizontal = computed(() => props.side === 'left' || props.side === 'right')
const isVertical = computed(() => props.side === 'top' || props.side === 'bottom')

const sizeValue = computed(() => {
  const sizes = {
    xs: isHorizontal.value ? '280px' : '25vh',
    sm: isHorizontal.value ? '320px' : '35vh',
    md: isHorizontal.value ? '400px' : '50vh',
    lg: isHorizontal.value ? '540px' : '70vh',
    xl: isHorizontal.value ? '720px' : '85vh',
    full: '100%'
  }
  return sizes[props.size]
})

const sizeClasses = computed(() => {
  if (isHorizontal.value) {
    return `h-full ${props.size === 'full' ? 'w-full' : ''}`
  }
  return `w-full ${props.size === 'full' ? 'h-full' : ''}`
})

const positionClasses = computed(() => ({
  left: 'inset-y-0 left-0',
  right: 'inset-y-0 right-0',
  top: 'inset-x-0 top-0',
  bottom: 'inset-x-0 bottom-0'
}[props.side]))

const roundedClasses = computed(() => {
  if (!props.rounded || props.size === 'full') return ''
  
  const roundedMap = {
    left: 'rounded-r-3xl',
    right: 'rounded-l-3xl',
    top: 'rounded-b-3xl',
    bottom: 'rounded-t-3xl'
  }
  return props.modal ? roundedMap[props.side] : roundedMap[props.side]
})

const variantClasses = computed(() => ({
  default: 'bg-(--s-bg-primary) border-0 shadow-2xl',
  glass: 'bg-(--s-bg-primary)/90 backdrop-blur-2xl border border-(--s-border)/50 shadow-2xl',
  bordered: 'bg-(--s-bg-primary) border border-(--s-border) shadow-xl',
  elevated: 'bg-(--s-bg-primary) shadow-[0_-25px_80px_-12px_rgba(0,0,0,0.3)] dark:shadow-[0_-25px_80px_-12px_rgba(0,0,0,0.7)]',
  minimal: 'bg-(--s-bg-primary)'
}[props.variant]))

const borderClasses = computed(() => {
  if (props.variant === 'default' || props.variant === 'minimal') {
    const borderMap = {
      left: 'border-r border-(--s-border)',
      right: 'border-l border-(--s-border)',
      top: 'border-b border-(--s-border)',
      bottom: 'border-t border-(--s-border)'
    }
    return props.rounded ? '' : borderMap[props.side]
  }
  return ''
})

// Animation transform values
const getTransformValue = (progress: number = 0) => {
  const transforms = {
    left: `translateX(${-100 + progress * 100}%)`,
    right: `translateX(${100 - progress * 100}%)`,
    top: `translateY(${-100 + progress * 100}%)`,
    bottom: `translateY(${100 - progress * 100}%)`
  }
  return transforms[props.side]
}

const panelStyle = computed(() => {
  const style: Record<string, string> = {}
  
  // Set size
  if (isHorizontal.value && props.size !== 'full') {
    style.width = sizeValue.value
    style.maxWidth = '100vw'
  } else if (isVertical.value && props.size !== 'full') {
    style.height = sizeValue.value
    style.maxHeight = '100vh'
  }
  
  // Set transform during drag
  if (isDragging.value) {
    style.transform = getTransformValue(1 - dragProgress.value)
    style.transition = 'none'
  }
  
  return style
})

const backdropStyle = computed(() => {
  const opacity = isDragging.value 
    ? props.overlayOpacity * (1 - dragProgress.value)
    : props.overlayOpacity
  
  return {
    backgroundColor: `rgba(0, 0, 0, ${opacity})`
  }
})

// Methods
const getScrollbarWidth = () => {
  const outer = document.createElement('div')
  outer.style.visibility = 'hidden'
  outer.style.overflow = 'scroll'
  document.body.appendChild(outer)
  const inner = document.createElement('div')
  outer.appendChild(inner)
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth
  outer.parentNode?.removeChild(outer)
  return scrollbarWidth
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

const getFocusableElements = (): HTMLElement[] => {
  if (!panelRef.value) return []
  return Array.from(panelRef.value.querySelectorAll(focusableSelector))
    .filter(el => !el.hasAttribute('disabled') && el.getAttribute('tabindex') !== '-1') as HTMLElement[]
}

const focusFirstElement = () => {
  if (!props.trapFocus) return
  
  nextTick(() => {
    if (props.initialFocus && panelRef.value) {
      const initialElement = panelRef.value.querySelector(props.initialFocus) as HTMLElement
      if (initialElement) {
        initialElement.focus()
        return
      }
    }
    
    if (props.autoFocus) {
      const focusable = getFocusableElements()
      const targetIndex = focusable.length > 1 ? 1 : 0
      if (focusable.length > 0) {
        focusable[targetIndex].focus()
        return
      }
    }
    
    panelRef.value?.focus()
  })
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!isOpen.value) return
  
  if (event.key === 'Escape' && props.closeOnEscape) {
    event.preventDefault()
    event.stopPropagation()
    close()
    return
  }
  
  if (event.key === 'Tab' && props.trapFocus) {
    const focusable = getFocusableElements()
    if (focusable.length === 0) return
    
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    
    if (event.shiftKey) {
      if (document.activeElement === first) {
        event.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
  }
}

const handleBackdropClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  const isBackdropClick = target === backdropRef.value || target === drawerRef.value
  
  if (isBackdropClick && props.closeOnBackdrop) {
    close()
  }
}

// Drag/Swipe handling
const handleDragStart = (event: TouchEvent | MouseEvent) => {
  if (!props.swipeable || !isOpen.value) return
  
  isDragging.value = true
  dragProgress.value = 0
  
  if ('touches' in event) {
    dragStartPos.value = isHorizontal.value ? event.touches[0].clientX : event.touches[0].clientY
  } else {
    dragStartPos.value = isHorizontal.value ? event.clientX : event.clientY
  }
  
  dragCurrentPos.value = dragStartPos.value
  emit('drag-start')
}

const handleDragMove = (event: TouchEvent | MouseEvent) => {
  if (!isDragging.value || !panelRef.value) return
  
  let currentPos: number
  if ('touches' in event) {
    currentPos = isHorizontal.value ? event.touches[0].clientX : event.touches[0].clientY
  } else {
    currentPos = isHorizontal.value ? event.clientX : event.clientY
  }
  
  dragCurrentPos.value = currentPos
  const delta = currentPos - dragStartPos.value
  
  // Calculate progress based on side
  const panelSize = isHorizontal.value 
    ? panelRef.value.offsetWidth 
    : panelRef.value.offsetHeight
  
  let progress = 0
  
  if (props.side === 'left') {
    progress = Math.max(0, Math.min(1, -delta / panelSize))
  } else if (props.side === 'right') {
    progress = Math.max(0, Math.min(1, delta / panelSize))
  } else if (props.side === 'top') {
    progress = Math.max(0, Math.min(1, -delta / panelSize))
  } else if (props.side === 'bottom') {
    progress = Math.max(0, Math.min(1, delta / panelSize))
  }
  
  dragProgress.value = progress
}

const handleDragEnd = () => {
  if (!isDragging.value) return
  
  const shouldClose = dragProgress.value >= props.swipeThreshold
  
  emit('drag-end', dragProgress.value)
  
  isDragging.value = false
  
  if (shouldClose) {
    close()
  } else {
    // Animate back to open position
    dragProgress.value = 0
  }
}

const snapTo = (index: number) => {
  if (props.snapPoints.length === 0) return
  
  const snapValue = props.snapPoints[index]
  if (snapValue !== undefined) {
    currentSnapIndex.value = index
    emit('snap', index, snapValue)
  }
}

const open = () => {
  if (isOpen.value || isAnimating.value) return
  
  emit('before-open')
  previousActiveElement.value = document.activeElement as HTMLElement
  isOpen.value = true
  isAnimating.value = true
  
  lockBodyScroll()
  emit('update:modelValue', true)
  emit('open')
  
  nextTick(() => {
    focusFirstElement()
    setTimeout(() => {
      isAnimating.value = false
      emit('opened')
    }, props.duration)
  })
}

const close = () => {
  if (!isOpen.value || isAnimating.value) return
  
  emit('before-close')
  isAnimating.value = true
  isOpen.value = false
  
  unlockBodyScroll()
  emit('update:modelValue', false)
  emit('close')
  
  setTimeout(() => {
    isAnimating.value = false
    dragProgress.value = 0
    if (previousActiveElement.value) {
      previousActiveElement.value.focus()
    }
    emit('closed')
  }, props.duration)
}

// Watch modelValue
watch(() => props.modelValue, (value) => {
  if (value) {
    open()
  } else {
    close()
  }
}, { immediate: true })

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  unlockBodyScroll()
})

// Provide context
provide(SDrawerContextKey, {
  close,
  isOpen,
  side: props.side,
  hasHeader,
  hasFooter,
  setHasHeader: (value: boolean) => hasHeader.value = value,
  setHasFooter: (value: boolean) => hasFooter.value = value,
  titleId,
  descriptionId,
  dragProgress,
  isDragging
})

// Expose for external control
defineExpose({
  open,
  close,
  isOpen,
  snapTo
})
</script>

<template>
  <Teleport v-if="teleportTarget" :to="teleportTarget" :disabled="!teleportTarget">
    <Transition
      enter-active-class="transition-opacity ease-out"
      :enter-active-class="`transition-opacity duration-${duration} ease-out`"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity ease-in"
      :leave-active-class="`transition-opacity duration-${Math.round(duration * 0.7)} ease-in`"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        ref="drawerRef"
        class="s-drawer fixed inset-0"
        :style="{ zIndex }"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="title ? titleId : undefined"
        :aria-describedby="description ? descriptionId : undefined"
        @mousedown="handleBackdropClick"
      >
        <!-- Backdrop -->
        <div
          v-if="backdrop"
          ref="backdropRef"
          class="s-drawer-backdrop absolute inset-0 -z-1 transition-colors"
          :class="[
            backdropBlur ? 'backdrop-blur-sm' : '',
            backdropClass
          ]"
          :style="backdropStyle"
          aria-hidden="true"
        />

        <!-- Drawer Panel -->
        <Transition
          appear
          :enter-active-class="`transition-transform duration-[${duration}ms] ease-[cubic-bezier(0.32,0.72,0,1)]`"
          :enter-from-class="side === 'left' ? '-translate-x-full' : side === 'right' ? 'translate-x-full' : side === 'top' ? '-translate-y-full' : 'translate-y-full'"
          enter-to-class="translate-x-0 translate-y-0"
          :leave-active-class="`transition-transform duration-[${Math.round(duration * 0.7)}ms] ease-[cubic-bezier(0.32,0.72,0,1)]`"
          leave-from-class="translate-x-0 translate-y-0"
          :leave-to-class="side === 'left' ? '-translate-x-full' : side === 'right' ? 'translate-x-full' : side === 'top' ? '-translate-y-full' : 'translate-y-full'"
        >
          <div
            v-show="isOpen"
            ref="panelRef"
            class="s-drawer-panel absolute flex flex-col outline-none overflow-hidden"
            :class="[
              sizeClasses,
              positionClasses,
              roundedClasses,
              variantClasses,
              borderClasses,
              panelClass
            ]"
            :style="panelStyle"
            tabindex="-1"
            @mousedown.stop
            @touchstart.passive="handleDragStart"
            @touchmove.passive="handleDragMove"
            @touchend.passive="handleDragEnd"
          >
            <!-- Drag Handle Zone (for bottom/top drawers) - Large touch target for easy swiping -->
            <div
              v-if="showHandle && (side === 'bottom' || side === 'top' || modal)"
              class="s-drawer-handle-zone relative shrink-0 cursor-grab active:cursor-grabbing select-none touch-none"
              :class="side === 'top' ? 'order-last' : ''"
              @mousedown="handleDragStart"
              @mousemove="handleDragMove"
              @mouseup="handleDragEnd"
              @mouseleave="handleDragEnd"
            >
              <!-- Extended touch target area - invisible but interactive -->
              <div class="absolute inset-x-0 -top-3 h-[60px] z-10" />
              
              <!-- Visual handle container -->
              <div class="s-drawer-handle flex items-center justify-center py-4 pt-5">
                <div class="w-12 h-1.5 rounded-full bg-(--s-text-tertiary)/40 transition-all duration-200 hover:bg-(--s-text-tertiary)/60 hover:w-16 hover:scale-105" />
              </div>
            </div>

            <!-- Default Header (if title is provided and hideHeader is false) -->
            <!-- Also serves as a drag target for swiping -->
            <div
              v-if="(title || closable) && !hideHeader && !$slots.header"
              class="s-drawer-header flex items-start justify-between gap-4 px-6 py-5 border-b border-(--s-border) shrink-0"
              :class="swipeable && isVertical ? 'cursor-grab active:cursor-grabbing touch-none' : ''"
              @mousedown="swipeable && isVertical ? handleDragStart($event) : undefined"
              @mousemove="swipeable && isVertical ? handleDragMove($event) : undefined"
              @mouseup="swipeable && isVertical ? handleDragEnd() : undefined"
              @mouseleave="swipeable && isVertical ? handleDragEnd() : undefined"
            >
              <div class="flex-1 min-w-0">
                <h2
                  v-if="title"
                  :id="titleId"
                  class="text-lg font-semibold text-(--s-text-primary) tracking-tight"
                >
                  {{ title }}
                </h2>
                <p
                  v-if="description"
                  :id="descriptionId"
                  class="mt-1.5 text-sm text-(--s-text-secondary)"
                >
                  {{ description }}
                </p>
              </div>
              
              <button
                v-if="closable"
                type="button"
                class="s-drawer-close shrink-0 flex items-center justify-center w-8 h-8 -mt-1 -mr-2 rounded-lg text-(--s-text-tertiary) hover:text-(--s-text-primary) hover:bg-(--s-bg-tertiary) transition-all duration-150 outline-none focus:ring-2 focus:ring-(--s-primary)/30"
                aria-label="Close drawer"
                @click="close"
              >
                <span class="mdi mdi-close text-xl" />
              </button>
            </div>

            <!-- Header Slot -->
            <slot name="header" />

            <!-- Content -->
            <div class="s-drawer-body flex-1 overflow-y-auto overscroll-contain">
              <slot />
            </div>

            <!-- Footer Slot -->
            <slot name="footer" />
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>

  <!-- Non-teleported fallback -->
  <template v-else>
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        ref="drawerRef"
        class="s-drawer fixed inset-0"
        :style="{ zIndex }"
        role="dialog"
        aria-modal="true"
        @mousedown="handleBackdropClick"
      >
        <div
          v-if="backdrop"
          ref="backdropRef"
          class="s-drawer-backdrop absolute inset-0 -z-1"
          :class="[backdropBlur ? 'backdrop-blur-sm' : '', backdropClass]"
          :style="backdropStyle"
          aria-hidden="true"
        />
        
        <div
          v-show="isOpen"
          ref="panelRef"
          class="s-drawer-panel absolute flex flex-col outline-none overflow-hidden"
          :class="[sizeClasses, positionClasses, roundedClasses, variantClasses, borderClasses, panelClass]"
          :style="panelStyle"
          tabindex="-1"
          @mousedown.stop
        >
          <slot />
        </div>
      </div>
    </Transition>
  </template>
</template>

<style scoped>
.s-drawer-panel {
  scrollbar-width: thin;
  scrollbar-color: var(--s-border) transparent;
  will-change: transform;
}

.s-drawer-panel::-webkit-scrollbar {
  width: 6px;
}

.s-drawer-panel::-webkit-scrollbar-track {
  background: transparent;
}

.s-drawer-panel::-webkit-scrollbar-thumb {
  background: var(--s-border);
  border-radius: 3px;
}

.s-drawer-body {
  scrollbar-width: thin;
  scrollbar-color: var(--s-border) transparent;
}

.s-drawer-body::-webkit-scrollbar {
  width: 6px;
}

.s-drawer-body::-webkit-scrollbar-track {
  background: transparent;
}

.s-drawer-body::-webkit-scrollbar-thumb {
  background: var(--s-border);
  border-radius: 3px;
}

/* Smooth spring-like animation */
.s-drawer-panel {
  transition-timing-function: cubic-bezier(0.32, 0.72, 0, 1);
}

/* Handle zone - large touch target */
.s-drawer-handle-zone {
  min-height: 44px; /* iOS recommended touch target */
}

/* Handle visual indicator */
.s-drawer-handle > div {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Handle pulse animation on hover */
.s-drawer-handle-zone:hover .s-drawer-handle > div {
  animation: handle-pulse 1.5s ease-in-out infinite;
}

/* Active state when dragging */
.s-drawer-handle-zone:active .s-drawer-handle > div {
  transform: scaleY(1.3);
  background-color: var(--s-text-secondary) !important;
}

@keyframes handle-pulse {
  0%, 100% { transform: scaleX(1); }
  50% { transform: scaleX(1.15); }
}
</style>
