<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '~/lib/utils'
import { type IconProp, isIconComponent } from '~/lib/icon'

defineOptions({ inheritAttrs: false })

const alertVariants = cva(
  'relative overflow-hidden transition-all duration-300 max-w-[600px] min-w-[300px]',
  {
    variants: {
      variant: {
        success: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200',
        warning: 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-200',
        error: 'bg-red-50 dark:bg-red-950/50 text-red-800 dark:text-red-200',
        info: 'bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-200',
        custom: 'bg-muted text-foreground',
      },
      size: {
        small: 'p-3',
        medium: 'p-4',
        large: 'p-5',
      },
    },
    defaultVariants: {
      variant: 'info',
      size: 'medium',
    },
  }
)

export type AlertVariants = VariantProps<typeof alertVariants>

const variantIconColors: Record<string, string> = {
  success: 'text-emerald-600 dark:text-emerald-400',
  warning: 'text-amber-600 dark:text-amber-400',
  error: 'text-red-600 dark:text-red-400',
  info: 'text-blue-600 dark:text-blue-400',
  custom: 'text-current',
}

const variantBorderColors: Record<string, string> = {
  success: 'border-emerald-500',
  warning: 'border-amber-500',
  error: 'border-red-500',
  info: 'border-blue-500',
  custom: 'border-current',
}

const variantProgressColors: Record<string, string> = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  custom: 'bg-current',
}

const sizeConfig: Record<string, { gap: string; iconSize: string; titleSize: string; textSize: string }> = {
  small: { gap: 'gap-2', iconSize: 'text-lg', titleSize: 'text-sm font-semibold', textSize: 'text-xs' },
  medium: { gap: 'gap-3', iconSize: 'text-xl', titleSize: 'text-base font-semibold', textSize: 'text-sm' },
  large: { gap: 'gap-4', iconSize: 'text-2xl', titleSize: 'text-lg font-semibold', textSize: 'text-base' },
}

export interface Props {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'custom'
  size?: 'small' | 'medium' | 'large'
  title?: string
  description?: string
  icon?: IconProp | boolean
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
  contentClass?: string
  iconClass?: string
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
  dismissible: false,
  contentClass: undefined,
  iconClass: undefined,
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
  info: 'information',
}))

const displayIcon = computed(() => {
  if (props.icon === false) return null
  if (props.icon === true || props.icon === undefined) {
    return defaultIcons.value[props.variant as keyof typeof defaultIcons.value] || 'information'
  }
  return props.icon // could be string or Component
})

const sizes = computed(() => sizeConfig[props.size])

const borderClasses = computed(() => {
  if (props.border === 'none') return ''
  const borderColor = variantBorderColors[props.variant]
  if (props.border === 'left') return `border-l-4 ${borderColor}`
  if (props.border === 'top') return `border-t-4 ${borderColor}`
  if (props.border === 'all') return `border-2 ${borderColor}`
  return ''
})

const positionClasses = computed(() => {
  if (props.position === 'static') return ''
  const positions: Record<string, string> = {
    top: 'fixed top-4 left-1/2 -translate-x-1/2 z-50',
    bottom: 'fixed bottom-4 left-1/2 -translate-x-1/2 z-50',
    'top-left': 'fixed top-4 left-4 z-50',
    'top-right': 'fixed top-4 right-4 z-50',
    'bottom-left': 'fixed bottom-4 left-4 z-50',
    'bottom-right': 'fixed bottom-4 right-4 z-50',
  }
  return positions[props.position] || ''
})

const customStyle = computed(() => {
  if (props.variant !== 'custom' || !props.color) return undefined
  return { '--alert-color': props.color }
})

const alertClasses = computed(() => {
  return cn(
    alertVariants({ variant: props.variant, size: props.size }),
    borderClasses.value,
    positionClasses.value,
    {
      'rounded-lg': props.rounded,
      'shadow-lg': props.elevation && props.position !== 'static',
      'shadow-md': props.elevation && props.position === 'static',
      'cursor-pointer': props.dismissible,
    },
  )
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
  const interval = 50
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

watch(() => props.autoDismiss, (newVal) => {
  if (newVal) {
    remainingTime.value = props.duration
    startDismissTimer()
  } else {
    clearTimers()
  }
})

defineExpose({
  close,
  pause,
  resume,
})
</script>

<template>
  <Transition
    name="alert"
    @after-leave="() => emit('close')"
  >
    <div
      v-show="isVisible"
      v-bind="$attrs"
      :class="cn(alertClasses, ($attrs.class as string))"
      :style="customStyle"
      role="alert"
      aria-live="polite"
      @mouseenter="pause"
      @mouseleave="resume"
      @click="handleAlertClick"
    >
      <div class="flex items-start" :class="sizes.gap">
        <!-- Icon -->
        <div v-if="displayIcon != null" class="shrink-0" :class="[variantIconColors[variant], iconClass]">
          <slot name="icon">
            <component v-if="isIconComponent(displayIcon)" :is="displayIcon" :class="[sizes.iconSize]" />
            <span v-else class="mdi" :class="[`mdi-${displayIcon}`, sizes.iconSize]" />
          </slot>
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0" :class="contentClass">
          <div v-if="title || $slots.title" :class="sizes.titleSize">
            <slot name="title">
              {{ title }}
            </slot>
          </div>

          <div
            v-if="description || $slots.default"
            :class="[sizes.textSize, { 'mt-1': title || $slots.title }]"
          >
            <slot>
              {{ description }}
            </slot>
          </div>

          <div v-if="$slots.actions" class="mt-3 flex items-center gap-2">
            <slot name="actions" />
          </div>
        </div>

        <!-- Close Button -->
        <button
          v-if="closable"
          type="button"
          :class="cn(
            'shrink-0 inline-flex items-center justify-center rounded-md px-1 transition-colors hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-offset-2',
            variantIconColors[variant]
          )"
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
        :class="variantProgressColors[variant]"
        :style="{ width: `${progress}%` }"
      />
    </div>
  </Transition>
</template>

<style scoped>
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
[style*="--alert-color"] .text-current {
  color: var(--alert-color);
}

[style*="--alert-color"] .bg-current {
  background-color: var(--alert-color);
}

[style*="--alert-color"] .border-current {
  border-color: var(--alert-color);
}
</style>
