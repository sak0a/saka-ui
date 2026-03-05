<script lang="ts">
/**
 * SMorphingCardTrigger - Trigger element for morphing card
 * The card preview that users click to expand
 */
</script>

<script setup lang="ts">
import { ref, inject, onMounted, onBeforeUnmount, computed } from 'vue'
import { SMorphingCardContextKey } from './SMorphingCard.vue'
import { cn } from '~/lib/utils'

defineOptions({ inheritAttrs: false })

export interface Props {
  /** Additional class for the trigger */
  triggerClass?: string
  /** Disable the trigger */
  disabled?: boolean
  /** Cursor style when hovering */
  cursor?: 'pointer' | 'zoom-in' | 'default'
}

const props = withDefaults(defineProps<Props>(), {
  triggerClass: '',
  disabled: false,
  cursor: 'pointer'
})

const context = inject(SMorphingCardContextKey)
const triggerRef = ref<HTMLElement | null>(null)

const cursorClass = computed(() => {
  if (props.disabled) return 'cursor-not-allowed'
  return {
    'pointer': 'cursor-pointer',
    'zoom-in': 'cursor-zoom-in',
    'default': 'cursor-default'
  }[props.cursor]
})

const handleClick = () => {
  if (!props.disabled) {
    context?.open()
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!props.disabled && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault()
    context?.open()
  }
}

onMounted(() => {
  context?.registerTrigger(triggerRef.value)
})

onBeforeUnmount(() => {
  context?.registerTrigger(null)
})
</script>

<template>
  <div
    ref="triggerRef"
    v-bind="$attrs"
    :class="cn(
      's-morphing-card-trigger relative rounded-2xl overflow-hidden bg-background border border-border shadow-lg transition-all duration-300',
      cursorClass,
      disabled ? 'opacity-60' : 'hover:shadow-xl hover:scale-[1.02] hover:border-input',
      triggerClass
    )"
    role="button"
    :tabindex="disabled ? -1 : 0"
    :aria-disabled="disabled"
    :aria-expanded="context?.isOpen.value"
    :aria-controls="`${context?.uniqueId}-content`"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <slot />
    
    <!-- Invisible overlay that indicates the card is clickable -->
    <div
      v-if="!disabled"
      class="absolute inset-0 bg-white/0 dark:bg-black/0 transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/5"
      aria-hidden="true"
    />
  </div>
</template>

<style scoped>
.s-morphing-card-trigger {
  transform-origin: center center;
}

.s-morphing-card-trigger:focus-visible {
  outline: 2px solid var(--s-primary);
  outline-offset: 2px;
}
</style>
