<script setup lang="ts">
/**
 * SModal - Advanced Modal/Dialog Component
 * A fully accessible, animated modal with keyboard navigation and focus trapping
 */
defineOptions({ inheritAttrs: false })

import { ref, computed, provide, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { cn } from '~/lib/utils'
import { SModalContextKey, type ModalSize, type ModalVariant, type ModalAnimation, type ModalPosition } from './context'

export interface Props {
  /** Control modal visibility */
  modelValue?: boolean
  /** Modal size variant */
  size?: ModalSize
  /** Visual variant */
  variant?: ModalVariant
  /** Animation style */
  animation?: ModalAnimation
  /** Position on screen */
  position?: ModalPosition
  /** Show close button */
  closable?: boolean
  /** Close on backdrop click */
  closeOnBackdrop?: boolean
  /** Close on escape key */
  closeOnEscape?: boolean
  /** Lock body scroll when open */
  lockScroll?: boolean
  /** Trap focus within modal */
  trapFocus?: boolean
  /** Show backdrop overlay */
  backdrop?: boolean
  /** Backdrop blur effect */
  backdropBlur?: boolean
  /** Custom backdrop class */
  backdropClass?: string
  /** Custom modal panel class */
  panelClass?: string
  /** Teleport target */
  teleport?: boolean | string
  /** Z-index for the modal */
  zIndex?: number
  /** Persistent mode (can't be closed by backdrop/escape) */
  persistent?: boolean
  /** Fullscreen mode */
  fullscreen?: boolean
  /** Modal title (alternative to header slot) */
  title?: string
  /** Modal description */
  description?: string
  /** Hide the default header */
  hideHeader?: boolean
  /** Initial focus selector */
  initialFocus?: string
  /** Auto-focus first interactive element (default: false, focuses panel instead) */
  autoFocus?: boolean
  /** Stacked modal order (for nested modals) */
  stackOrder?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  size: 'md',
  variant: 'default',
  animation: 'scale',
  position: 'center',
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
  persistent: false,
  fullscreen: false,
  title: undefined,
  description: undefined,
  hideHeader: false,
  initialFocus: undefined,
  autoFocus: false,
  stackOrder: 0
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'open': []
  'close': []
  'opened': []
  'closed': []
  'before-open': []
  'before-close': []
}>()

// Generate unique IDs for ARIA
const uid = Math.random().toString(36).slice(2, 9)
const titleId = `modal-title-${uid}`
const descriptionId = `modal-desc-${uid}`

// Refs
const modalRef = ref<HTMLElement | null>(null)
const backdropRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const isOpen = ref(props.modelValue)
const isAnimating = ref(false)
const hasHeader = ref(false)
const hasFooter = ref(false)
const previousActiveElement = ref<HTMLElement | null>(null)

// Focus trap elements
const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
let scrollbarWidth = 0

// Computed
const teleportTarget = computed(() => {
  if (props.teleport === true) return 'body'
  if (typeof props.teleport === 'string') return props.teleport
  return undefined
})

const effectiveZIndex = computed(() => props.zIndex + (props.stackOrder * 10))

const sizeClasses = computed(() => {
  if (props.fullscreen) return 'w-full h-full max-w-full max-h-full rounded-none'
  
  return {
    xs: 'w-full max-w-xs',
    sm: 'w-full max-w-sm',
    md: 'w-full max-w-lg',
    lg: 'w-full max-w-2xl',
    xl: 'w-full max-w-4xl',
    full: 'w-full max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]'
  }[props.size]
})

const positionClasses = computed(() => {
  if (props.fullscreen) return 'items-stretch justify-center'
  
  return {
    center: 'items-center justify-center',
    top: 'items-start justify-center pt-16',
    bottom: 'items-end justify-center pb-16',
    left: 'items-center justify-start pl-4',
    right: 'items-center justify-end pr-4'
  }[props.position]
})

const variantClasses = computed(() => ({
  default: 'bg-background border border-border shadow-2xl',
  glass: 'bg-background/80 backdrop-blur-2xl border border-border/50 shadow-2xl',
  bordered: 'bg-background border-2 border-primary/30 shadow-xl',
  elevated: 'bg-background shadow-[0_25px_80px_-12px_rgba(0,0,0,0.4)] dark:shadow-[0_25px_80px_-12px_rgba(0,0,0,0.8)]'
}[props.variant]))

// Animation configurations
const panelAnimations = computed(() => {
  const animations = {
    fade: {
      enter: 'transition-all duration-(--s-duration-slow) ease-out',
      enterFrom: 'opacity-0',
      enterTo: 'opacity-100',
      leave: 'transition-all duration-(--s-duration-normal) ease-in',
      leaveFrom: 'opacity-100',
      leaveTo: 'opacity-0'
    },
    scale: {
      enter: 'transition-all duration-(--s-duration-slow) ease-[cubic-bezier(0.34,1.56,0.64,1)]',
      enterFrom: 'opacity-0 scale-90',
      enterTo: 'opacity-100 scale-100',
      leave: 'transition-all duration-(--s-duration-normal) ease-in',
      leaveFrom: 'opacity-100 scale-100',
      leaveTo: 'opacity-0 scale-95'
    },
    'slide-up': {
      enter: 'transition-all duration-(--s-duration-slow) ease-out',
      enterFrom: 'opacity-0 translate-y-12',
      enterTo: 'opacity-100 translate-y-0',
      leave: 'transition-all duration-(--s-duration-normal) ease-in',
      leaveFrom: 'opacity-100 translate-y-0',
      leaveTo: 'opacity-0 translate-y-8'
    },
    'slide-down': {
      enter: 'transition-all duration-(--s-duration-slow) ease-out',
      enterFrom: 'opacity-0 -translate-y-12',
      enterTo: 'opacity-100 translate-y-0',
      leave: 'transition-all duration-(--s-duration-normal) ease-in',
      leaveFrom: 'opacity-100 translate-y-0',
      leaveTo: 'opacity-0 -translate-y-8'
    },
    zoom: {
      enter: 'transition-all duration-(--s-duration-slow) ease-[cubic-bezier(0.16,1,0.3,1)]',
      enterFrom: 'opacity-0 scale-50',
      enterTo: 'opacity-100 scale-100',
      leave: 'transition-all duration-(--s-duration-normal) ease-in',
      leaveFrom: 'opacity-100 scale-100',
      leaveTo: 'opacity-0 scale-75'
    },
    flip: {
      enter: 'transition-all duration-400 ease-out [transform-style:preserve-3d]',
      enterFrom: 'opacity-0 [transform:rotateX(-15deg)_scale(0.95)]',
      enterTo: 'opacity-100 [transform:rotateX(0deg)_scale(1)]',
      leave: 'transition-all duration-(--s-duration-normal) ease-in [transform-style:preserve-3d]',
      leaveFrom: 'opacity-100 [transform:rotateX(0deg)_scale(1)]',
      leaveTo: 'opacity-0 [transform:rotateX(15deg)_scale(0.95)]'
    }
  }
  return animations[props.animation]
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
    // If initialFocus is specified, focus that element
    if (props.initialFocus && panelRef.value) {
      const initialElement = panelRef.value.querySelector(props.initialFocus) as HTMLElement
      if (initialElement) {
        initialElement.focus()
        return
      }
    }
    
    // If autoFocus is enabled, focus the first interactive element
    if (props.autoFocus) {
      const focusable = getFocusableElements()
      // Skip close button (first element) if there are other focusable elements
      const targetIndex = focusable.length > 1 ? 1 : 0
      if (focusable.length > 0) {
        focusable[targetIndex].focus()
        return
      }
    }
    
    // Otherwise, focus the panel itself (not the close button)
    // This prevents the focus ring on the close button while maintaining accessibility
    // Users can Tab to navigate to interactive elements
    panelRef.value?.focus()
  })
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!isOpen.value) return
  
  // Escape key
  if (event.key === 'Escape' && props.closeOnEscape && !props.persistent) {
    event.preventDefault()
    event.stopPropagation()
    close()
    return
  }
  
  // Focus trap
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
  // Only close if clicking directly on the backdrop or modal wrapper, not the panel
  const target = event.target as HTMLElement
  const isBackdropClick = target === backdropRef.value || target === modalRef.value
  
  if (isBackdropClick && props.closeOnBackdrop && !props.persistent) {
    close()
  } else if (isBackdropClick && props.persistent) {
    // Shake animation for persistent modals
    panelRef.value?.classList.add('animate-shake')
    setTimeout(() => panelRef.value?.classList.remove('animate-shake'), 300)
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
    }, 300)
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
    if (previousActiveElement.value) {
      previousActiveElement.value.focus()
    }
    emit('closed')
  }, 200)
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
provide(SModalContextKey, {
  close,
  isOpen,
  size: props.size,
  hasHeader,
  hasFooter,
  setHasHeader: (value: boolean) => hasHeader.value = value,
  setHasFooter: (value: boolean) => hasFooter.value = value,
  titleId,
  descriptionId
})

// Expose for external control
defineExpose({
  open,
  close,
  isOpen
})
</script>

<template>
  <Teleport v-if="teleportTarget" :to="teleportTarget" :disabled="!teleportTarget">
    <Transition
      enter-active-class="transition-opacity duration-(--s-duration-slow) ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-(--s-duration-normal) ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        ref="modalRef"
        v-bind="$attrs"
        :class="cn('s-modal fixed inset-0 flex overflow-hidden', positionClasses, fullscreen ? 'p-0' : 'p-4', $attrs.class ?? '')"
        :style="{ zIndex: effectiveZIndex }"
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
          class="s-modal-backdrop absolute inset-0 -z-1"
          :class="[
            'bg-black/60 dark:bg-black/70',
            backdropBlur ? 'backdrop-blur-sm' : '',
            backdropClass
          ]"
          aria-hidden="true"
        />

        <!-- Modal Panel -->
        <Transition
          appear
          :enter-active-class="panelAnimations.enter"
          :enter-from-class="panelAnimations.enterFrom"
          :enter-to-class="panelAnimations.enterTo"
          :leave-active-class="panelAnimations.leave"
          :leave-from-class="panelAnimations.leaveFrom"
          :leave-to-class="panelAnimations.leaveTo"
        >
          <div
            v-show="isOpen"
            ref="panelRef"
            class="s-modal-panel relative flex flex-col overflow-hidden outline-none"
            :class="[
              sizeClasses,
              variantClasses,
              fullscreen ? '' : 'rounded-2xl',
              'max-h-[calc(100vh-2rem)]',
              panelClass
            ]"
            tabindex="-1"
            @mousedown.stop
          >
            <!-- Default Header (if title is provided and hideHeader is false) -->
            <div
              v-if="(title || closable) && !hideHeader && !$slots.header"
              class="s-modal-header flex items-start justify-between gap-4 px-6 py-5 border-b border-border shrink-0"
            >
              <div class="flex-1 min-w-0">
                <h2
                  v-if="title"
                  :id="titleId"
                  class="text-lg font-semibold text-foreground tracking-tight"
                >
                  {{ title }}
                </h2>
                <p
                  v-if="description"
                  :id="descriptionId"
                  class="mt-1.5 text-sm text-muted-foreground"
                >
                  {{ description }}
                </p>
              </div>
              
              <button
                v-if="closable"
                type="button"
                class="s-modal-close shrink-0 flex items-center justify-center w-8 h-8 -mt-1 -mr-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-150 outline-none focus:ring-2 focus:ring-primary/30"
                aria-label="Close modal"
                @click="close"
              >
                <span class="mdi mdi-close text-xl" />
              </button>
            </div>

            <!-- Header Slot -->
            <slot name="header" />

            <!-- Content -->
            <div class="s-modal-body flex-1 overflow-y-auto overscroll-contain">
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
      enter-active-class="transition-opacity duration-(--s-duration-slow) ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-(--s-duration-normal) ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        ref="modalRef"
        v-bind="$attrs"
        :class="cn('s-modal fixed inset-0 flex overflow-hidden', positionClasses, fullscreen ? 'p-0' : 'p-4', $attrs.class ?? '')"
        :style="{ zIndex: effectiveZIndex }"
        role="dialog"
        aria-modal="true"
        @mousedown="handleBackdropClick"
      >
        <div
          v-if="backdrop"
          ref="backdropRef"
          class="s-modal-backdrop absolute inset-0 -z-1 bg-black/60 dark:bg-black/70"
          :class="[backdropBlur ? 'backdrop-blur-sm' : '', backdropClass]"
          aria-hidden="true"
        />
        
        <Transition
          appear
          :enter-active-class="panelAnimations.enter"
          :enter-from-class="panelAnimations.enterFrom"
          :enter-to-class="panelAnimations.enterTo"
          :leave-active-class="panelAnimations.leave"
          :leave-from-class="panelAnimations.leaveFrom"
          :leave-to-class="panelAnimations.leaveTo"
        >
          <div
            v-show="isOpen"
            ref="panelRef"
            class="s-modal-panel relative flex flex-col overflow-hidden rounded-2xl outline-none"
            :class="[sizeClasses, variantClasses, 'max-h-[calc(100vh-2rem)]', panelClass]"
            tabindex="-1"
            @mousedown.stop
          >
            <slot />
          </div>
        </Transition>
      </div>
    </Transition>
  </template>
</template>

<style scoped>
.s-modal {
  perspective: 1000px;
}

.s-modal-panel {
  transform-style: preserve-3d;
  scrollbar-width: thin;
  scrollbar-color: var(--s-border) transparent;
}

.s-modal-panel::-webkit-scrollbar {
  width: 6px;
}

.s-modal-panel::-webkit-scrollbar-track {
  background: transparent;
}

.s-modal-panel::-webkit-scrollbar-thumb {
  background: var(--s-border);
  border-radius: 3px;
}

.s-modal-body {
  scrollbar-width: thin;
  scrollbar-color: var(--s-border) transparent;
}

.s-modal-body::-webkit-scrollbar {
  width: 6px;
}

.s-modal-body::-webkit-scrollbar-track {
  background: transparent;
}

.s-modal-body::-webkit-scrollbar-thumb {
  background: var(--s-border);
  border-radius: 3px;
}

/* Shake animation for persistent modals */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}

.animate-shake {
  animation: shake 0.3s ease-in-out;
}
</style>
