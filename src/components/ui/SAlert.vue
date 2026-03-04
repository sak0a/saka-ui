<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

export interface Props {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'custom'
  size?: 'small' | 'medium' | 'large'
  title?: string
  description?: string
  icon?: string | boolean
  closable?: boolean
  autoDismiss?: boolean
  duration?: number
  showProgress?: boolean
  color?: string
  position?: 'static' | 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  elevation?: boolean
  border?: 'none' | 'left' | 'top' | 'all'
  rounded?: boolean
  dismissible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'info',
  size: 'medium',
  title: undefined,
  description: undefined,
  icon: true,
  closable: true,
  autoDismiss: false,
  duration: 5000,
  showProgress: true,
  color: undefined,
  position: 'static',
  elevation: true,
  border: 'left',
  rounded: true,
  dismissible: false
})

const emit = defineEmits<{
  close: []
  dismiss: []
}>()

// Refs
const isVisible = ref(true)
const isPaused = ref(false)
const progress = ref(100)
const dismissTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const progressInterval = ref<ReturnType<typeof setInterval> | null>(null)
const startTime = ref<number>(0)
const remainingTime = ref<number>(props.duration)

// Computed
const defaultIcons = computed(() => ({
  success: 'check-circle',
  warning: 'alert',
  error: 'alert-circle',
  info: 'information'
}))

const displayIcon = computed(() => {
  if (props.icon === false) return null
  if (typeof props.icon === 'string') return props.icon
  return defaultIcons.value[props.variant as keyof typeof defaultIcons.value] || 'information'
})

const variantColors = computed(() => {
  const colors = {
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/50',
      border: 'border-emerald-500',
      text: 'text-emerald-800 dark:text-emerald-200',
      icon: 'text-emerald-600 dark:text-emerald-400',
      progress: 'bg-emerald-500'
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-950/50',
      border: 'border-amber-500',
      text: 'text-amber-800 dark:text-amber-200',
      icon: 'text-amber-600 dark:text-amber-400',
      progress: 'bg-amber-500'
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-950/50',
      border: 'border-red-500',
      text: 'text-red-800 dark:text-red-200',
      icon: 'text-red-600 dark:text-red-400',
      progress: 'bg-red-500'
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-950/50',
      border: 'border-blue-500',
      text: 'text-blue-800 dark:text-blue-200',
      icon: 'text-blue-600 dark:text-blue-400',
      progress: 'bg-blue-500'
    },
    custom: {
      bg: 'bg-(--s-bg-secondary)',
      border: 'border-current',
      text: 'text-(--s-text-primary)',
      icon: 'text-current',
      progress: 'bg-current'
    }
  }
  return colors[props.variant]
})

const sizeClasses = computed(() => {
  const sizes = {
    small: {
      padding: 'p-3',
      gap: 'gap-2',
      iconSize: 'text-lg',
      titleSize: 'text-sm font-semibold',
      textSize: 'text-xs'
    },
    medium: {
      padding: 'p-4',
      gap: 'gap-3',
      iconSize: 'text-xl',
      titleSize: 'text-base font-semibold',
      textSize: 'text-sm'
    },
    large: {
      padding: 'p-5',
      gap: 'gap-4',
      iconSize: 'text-2xl',
      titleSize: 'text-lg font-semibold',
      textSize: 'text-base'
    }
  }
  return sizes[props.size]
})

const borderClasses = computed(() => {
  if (props.border === 'none') return ''
  if (props.border === 'left') return `border-l-4 ${variantColors.value.border}`
  if (props.border === 'top') return `border-t-4 ${variantColors.value.border}`
  if (props.border === 'all') return `border-2 ${variantColors.value.border}`
  return ''
})

const positionClasses = computed(() => {
  if (props.position === 'static') return ''
  
  const positions = {
    top: 'fixed top-4 left-1/2 -translate-x-1/2 z-50',
    bottom: 'fixed bottom-4 left-1/2 -translate-x-1/2 z-50',
    'top-left': 'fixed top-4 left-4 z-50',
    'top-right': 'fixed top-4 right-4 z-50',
    'bottom-left': 'fixed bottom-4 left-4 z-50',
    'bottom-right': 'fixed bottom-4 right-4 z-50'
  }
  return positions[props.position as keyof typeof positions] || ''
})

const customStyle = computed(() => {
  if (props.variant !== 'custom' || !props.color) return {}
  return {
    '--alert-color': props.color
  }
})

// Methods
function close() {
  isVisible.value = false
  clearTimers()
  emit('close')
}

function handleDismiss() {
  isVisible.value = false
  clearTimers()
  emit('dismiss')
}

function pause() {
  if (!props.autoDismiss || isPaused.value) return
  
  isPaused.value = true
  clearTimers()
  
  // Calculate remaining time
  const elapsed = Date.now() - startTime.value
  remainingTime.value = Math.max(0, remainingTime.value - elapsed)
}

function resume() {
  if (!props.autoDismiss || !isPaused.value) return
  
  isPaused.value = false
  startDismissTimer()
}

function startDismissTimer() {
  if (!props.autoDismiss) return
  
  startTime.value = Date.now()
  
  dismissTimer.value = setTimeout(() => {
    handleDismiss()
  }, remainingTime.value)
  
  if (props.showProgress) {
    startProgressAnimation()
  }
}

function startProgressAnimation() {
  const interval = 50 // Update every 50ms
  const totalSteps = remainingTime.value / interval
  let currentStep = 0
  
  progressInterval.value = setInterval(() => {
    currentStep++
    progress.value = Math.max(0, 100 - (currentStep / totalSteps) * 100)
    
    if (currentStep >= totalSteps) {
      clearInterval(progressInterval.value!)
      progressInterval.value = null
    }
  }, interval)
}

function clearTimers() {
  if (dismissTimer.value) {
    clearTimeout(dismissTimer.value)
    dismissTimer.value = null
  }
  if (progressInterval.value) {
    clearInterval(progressInterval.value)
    progressInterval.value = null
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.closable) {
    close()
  }
}

function handleAlertClick() {
  if (props.dismissible) {
    close()
  }
}

// Lifecycle
onMounted(() => {
  if (props.autoDismiss) {
    startDismissTimer()
  }
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  clearTimers()
  document.removeEventListener('keydown', handleKeydown)
})

// Watch for autoDismiss changes
watch(() => props.autoDismiss, (newVal) => {
  if (newVal) {
    remainingTime.value = props.duration
    startDismissTimer()
  } else {
    clearTimers()
  }
})

// Expose methods
defineExpose({
  close,
  pause,
  resume
})
</script>

<template>
  <Transition
    name="alert"
    @after-leave="() => emit('close')"
  >
    <div
      v-show="isVisible"
      class="s-alert relative overflow-hidden transition-all duration-300"
      :class="[
        variantColors.bg,
        variantColors.text,
        sizeClasses.padding,
        borderClasses,
        positionClasses,
        {
          'rounded-lg': rounded,
          'shadow-lg': elevation && position !== 'static',
          'shadow-md': elevation && position === 'static',
          'cursor-pointer': dismissible
        }
      ]"
      :style="customStyle"
      role="alert"
      aria-live="polite"
      @mouseenter="pause"
      @mouseleave="resume"
      @click="handleAlertClick"
    >
      <div class="flex items-start" :class="sizeClasses.gap">
        <!-- Icon -->
        <div v-if="displayIcon" class="shrink-0" :class="variantColors.icon">
          <slot name="icon">
            <span class="mdi" :class="[`mdi-${displayIcon}`, sizeClasses.iconSize]" />
          </slot>
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <!-- Title -->
          <div v-if="title || $slots.title" :class="sizeClasses.titleSize">
            <slot name="title">
              {{ title }}
            </slot>
          </div>

          <!-- Description/Default Content -->
          <div 
            v-if="description || $slots.default"
            :class="[
              sizeClasses.textSize,
              { 'mt-1': title || $slots.title }
            ]"
          >
            <slot>
              {{ description }}
            </slot>
          </div>

          <!-- Actions -->
          <div v-if="$slots.actions" class="mt-3 flex items-center gap-2">
            <slot name="actions" />
          </div>
        </div>

        <!-- Close Button -->
        <button
          v-if="closable"
          type="button"
          class="shrink-0 inline-flex items-center justify-center rounded-md px-1 transition-colors hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-offset-2"
          :class="variantColors.icon"
          aria-label="Close alert"
          @click.stop="close"
        >
          <span class="mdi mdi-close text-lg" />
        </button>
      </div>

      <!-- Progress Bar -->
      <div
        v-if="autoDismiss && showProgress"
        class="absolute bottom-0 left-0 h-1 transition-all duration-100 ease-linear"
        :class="variantColors.progress"
        :style="{ width: `${progress}%` }"
      />
    </div>
  </Transition>
</template>

<style scoped>
.s-alert {
  max-width: 600px;
  min-width: 300px;
}

/* Alert transitions */
.alert-enter-active,
.alert-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.alert-enter-from {
  opacity: 0;
  transform: translateY(-12px) scale(0.95);
}

.alert-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.95);
}

/* Custom variant with color prop */
.s-alert[style*="--alert-color"] .text-current {
  color: var(--alert-color);
}

.s-alert[style*="--alert-color"] .bg-current {
  background-color: var(--alert-color);
}

.s-alert[style*="--alert-color"] .border-current {
  border-color: var(--alert-color);
}
</style>
