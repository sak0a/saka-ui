<script setup lang="ts">
import { computed, Teleport, TransitionGroup } from 'vue'
import { getToasts, getToastConfig, type ToastPosition } from '../../../composables/useToast'
import SToast from './SToast.vue'

defineOptions({ inheritAttrs: false })

export interface Props {
  /** Position to render toasts (defaults to global config) */
  position?: ToastPosition
  /** Maximum toasts to show (defaults to global config) */
  maxToasts?: number
  /** Gap between toasts in px */
  gap?: number
  /** Teleport target */
  teleport?: boolean | string
  /** Z-index for the container */
  zIndex?: number
}

const props = withDefaults(defineProps<Props>(), {
  position: undefined,
  maxToasts: undefined,
  gap: undefined,
  teleport: true,
  zIndex: 9999
})

const toasts = getToasts()
const config = getToastConfig()

const effectivePosition = computed(() => props.position ?? config.position)
const effectiveMaxToasts = computed(() => props.maxToasts ?? config.maxToasts)
const effectiveGap = computed(() => props.gap ?? config.gap)

// Filter toasts for this position
const positionToasts = computed(() => {
  const filtered = toasts.value.filter(t => {
    const toastPosition = t.options.position ?? config.position
    return toastPosition === effectivePosition.value
  })
  
  // Limit to max toasts
  return filtered.slice(0, effectiveMaxToasts.value)
})

// Position classes
const positionClasses = computed(() => {
  const classes: Record<ToastPosition, string> = {
    'top-left': 'top-4 left-4 items-start',
    'top-right': 'top-4 right-4 items-end',
    'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
    'bottom-left': 'bottom-4 left-4 items-start',
    'bottom-right': 'bottom-4 right-4 items-end',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center'
  }
  return classes[effectivePosition.value]
})

// Stack direction (bottom positions stack upward)
const isBottomPosition = computed(() => 
  effectivePosition.value.startsWith('bottom')
)

const teleportTarget = computed(() => {
  if (props.teleport === true) return 'body'
  if (typeof props.teleport === 'string') return props.teleport
  return undefined
})
</script>

<template>
  <Teleport v-if="teleportTarget" :to="teleportTarget" :disabled="!teleportTarget">
    <div
      v-if="positionToasts.length > 0"
      v-bind="$attrs"
      class="s-toast-container fixed flex flex-col pointer-events-none"
      :class="[positionClasses, isBottomPosition ? 'flex-col-reverse' : 'flex-col']"
      :style="{ 
        zIndex,
        gap: `${effectiveGap}px`
      }"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      <TransitionGroup
        :name="isBottomPosition ? 'toast-bottom' : 'toast-top'"
        tag="div"
        class="flex flex-col"
        :class="[isBottomPosition ? 'flex-col-reverse' : 'flex-col']"
        :style="{ gap: `${effectiveGap}px` }"
      >
        <div
          v-for="toast in positionToasts"
          :key="toast.id"
          class="pointer-events-auto"
        >
          <SToast
            :id="toast.id"
            :type="toast.type"
            :title="toast.options.title"
            :description="toast.options.description"
            :duration="toast.options.duration"
            :show-progress="toast.options.showProgress"
            :closable="toast.options.closable"
            :icon="toast.options.icon"
            :color="toast.options.color"
            :progress="toast.progress"
            :paused="toast.paused"
            :component="toast.options.component"
            :component-props="toast.options.componentProps"
            @click="toast.options.onClick?.()"
          />
        </div>
      </TransitionGroup>
    </div>
  </Teleport>

  <!-- Non-teleported fallback -->
  <template v-else>
    <div
      v-if="positionToasts.length > 0"
      v-bind="$attrs"
      class="s-toast-container fixed flex flex-col pointer-events-none"
      :class="[positionClasses, isBottomPosition ? 'flex-col-reverse' : 'flex-col']"
      :style="{ 
        zIndex,
        gap: `${effectiveGap}px`
      }"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      <TransitionGroup
        :name="isBottomPosition ? 'toast-bottom' : 'toast-top'"
        tag="div"
        class="flex flex-col"
        :class="[isBottomPosition ? 'flex-col-reverse' : 'flex-col']"
        :style="{ gap: `${effectiveGap}px` }"
      >
        <div
          v-for="toast in positionToasts"
          :key="toast.id"
          class="pointer-events-auto"
        >
          <SToast
            :id="toast.id"
            :type="toast.type"
            :title="toast.options.title"
            :description="toast.options.description"
            :duration="toast.options.duration"
            :show-progress="toast.options.showProgress"
            :closable="toast.options.closable"
            :icon="toast.options.icon"
            :color="toast.options.color"
            :progress="toast.progress"
            :paused="toast.paused"
            :component="toast.options.component"
            :component-props="toast.options.componentProps"
            @click="toast.options.onClick?.()"
          />
        </div>
      </TransitionGroup>
    </div>
  </template>
</template>

<style scoped>
/* Top position transitions */
.toast-top-enter-active,
.toast-top-leave-active {
  transition: all 0.3s ease;
}

.toast-top-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.toast-top-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.toast-top-move {
  transition: transform 0.3s ease;
}

/* Bottom position transitions */
.toast-bottom-enter-active,
.toast-bottom-leave-active {
  transition: all 0.3s ease;
}

.toast-bottom-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.toast-bottom-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.toast-bottom-move {
  transition: transform 0.3s ease;
}
</style>
