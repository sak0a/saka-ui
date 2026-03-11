<script setup lang="ts">
import { computed, ref } from 'vue'
import { cn } from '../../../lib/utils'
import type { ToastType } from '../../../composables/useToast'
import { dismissToast, pauseToast, resumeToast } from '../../../composables/useToast'
import SIcon from '../SIcon.vue'

defineOptions({ inheritAttrs: false })

export interface Props {
  /** Unique toast ID */
  id: string
  /** Toast type */
  type: ToastType
  /** Toast title */
  title?: string
  /** Toast description */
  description?: string
  /** Duration in ms (for display purposes) */
  duration?: number
  /** Show progress bar */
  showProgress?: boolean
  /** Show close button */
  closable?: boolean
  /** Icon name or false to hide */
  icon?: string | boolean
  /** Custom color for custom type */
  color?: string
  /** Progress percentage (0-100) */
  progress?: number
  /** Whether toast is paused */
  paused?: boolean
  /** Custom component to render */
  component?: object
  /** Props for custom component */
  componentProps?: Record<string, unknown>
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  description: undefined,
  duration: 5000,
  showProgress: true,
  closable: true,
  icon: undefined,
  color: undefined,
  progress: 100,
  paused: false,
  component: undefined,
  componentProps: undefined
})

const emit = defineEmits<{
  close: []
  click: []
}>()

// Hover state for pause/resume
const isHovering = ref(false)

const handleMouseEnter = () => {
  isHovering.value = true
  pauseToast(props.id)
}

const handleMouseLeave = () => {
  isHovering.value = false
  resumeToast(props.id)
}

const handleClose = () => {
  dismissToast(props.id)
  emit('close')
}

const handleClick = () => {
  emit('click')
}

// Type-based styling
const typeConfig = computed(() => {
  const configs: Record<ToastType, { 
    bg: string
    border: string
    text: string
    icon: string
    iconColor: string
    progress: string
  }> = {
    success: {
      bg: 'bg-success-light',
      border: 'border-success-border',
      text: 'text-success-light-foreground',
      icon: 'check-circle',
      iconColor: 'text-success',
      progress: 'bg-success'
    },
    error: {
      bg: 'bg-error-light',
      border: 'border-error-border',
      text: 'text-error-light-foreground',
      icon: 'alert-circle',
      iconColor: 'text-error',
      progress: 'bg-error'
    },
    warning: {
      bg: 'bg-warning-light',
      border: 'border-warning-border',
      text: 'text-warning-light-foreground',
      icon: 'alert',
      iconColor: 'text-warning',
      progress: 'bg-warning'
    },
    info: {
      bg: 'bg-info-light',
      border: 'border-info-border',
      text: 'text-info-light-foreground',
      icon: 'information',
      iconColor: 'text-info',
      progress: 'bg-info'
    },
    loading: {
      bg: 'bg-loading-light',
      border: 'border-loading-border',
      text: 'text-loading-light-foreground',
      icon: 'loading',
      iconColor: 'text-loading-light-foreground',
      progress: 'bg-muted-foreground'
    },
    custom: {
      bg: 'bg-muted',
      border: 'border-border',
      text: 'text-foreground',
      icon: 'bell',
      iconColor: 'text-muted-foreground',
      progress: 'bg-primary'
    }
  }
  return configs[props.type]
})

const displayIcon = computed(() => {
  if (props.icon === false) return null
  if (typeof props.icon === 'string') return props.icon
  return typeConfig.value.icon
})

const customStyle = computed(() => {
  if (props.type === 'custom' && props.color) {
    return {
      '--toast-color': props.color,
      borderLeftColor: props.color
    }
  }
  return {}
})

const isLoading = computed(() => props.type === 'loading')
</script>

<template>
  <div
    v-bind="$attrs"
    :class="cn(
      's-toast relative flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm min-w-[320px] max-w-[420px] cursor-pointer transition-all duration-(--s-duration-normal)',
      typeConfig.bg,
      typeConfig.border,
      typeConfig.text,
      !isLoading && 'hover:scale-[1.02]',
      $attrs.class ?? ''
    )"
    :style="customStyle"
    role="alert"
    aria-live="polite"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @click="handleClick"
  >
    <!-- Icon -->
    <div 
      v-if="displayIcon" 
      class="flex-shrink-0 mt-0.5"
      :class="typeConfig.iconColor"
    >
      <SIcon 
        :name="displayIcon" 
        :class="{ 'animate-spin': isLoading }"
        size="20"
      />
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <!-- Custom component -->
      <component
        v-if="component"
        :is="component"
        v-bind="componentProps"
      />
      
      <!-- Default content -->
      <template v-else>
        <p 
          v-if="title" 
          class="font-semibold text-sm leading-tight"
          :class="typeConfig.text"
        >
          {{ title }}
        </p>
        <p 
          v-if="description" 
          class="text-sm opacity-90 mt-0.5"
          :class="{ 'mt-1': title }"
        >
          {{ description }}
        </p>
      </template>
    </div>

    <!-- Close button -->
    <button
      v-if="closable && !isLoading"
      type="button"
      class="flex-shrink-0 p-1 -m-1 rounded-lg opacity-60 hover:opacity-100 transition-opacity"
      :class="typeConfig.iconColor"
      aria-label="Dismiss"
      @click.stop="handleClose"
    >
      <SIcon name="close" size="16" />
    </button>

    <!-- Progress bar -->
    <div 
      v-if="showProgress && duration > 0 && !isLoading"
      class="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl overflow-hidden"
    >
      <div 
        class="h-full transition-all duration-100 ease-linear"
        :class="typeConfig.progress"
        :style="{ width: `${progress}%` }"
      />
    </div>
  </div>
</template>

<style scoped>
.s-toast {
  animation: toast-enter var(--s-duration-slow) ease-out;
}

@keyframes toast-enter {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
