<script setup lang="ts">
/**
 * SMorphingModalTrigger - Trigger element for morphing modal
 * Captures its position for the morphing animation
 */
defineOptions({ inheritAttrs: false })

import { ref, inject, onMounted, onBeforeUnmount, computed } from 'vue'
import { cn } from '~/lib/utils'
import { SMorphingModalContextKey } from './morphing-context'

export interface Props {
  /** Disable trigger */
  disabled?: boolean
  /** Additional class */
  triggerClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  triggerClass: ''
})

const emit = defineEmits<{
  'click': [event: MouseEvent]
}>()

const triggerRef = ref<HTMLElement | null>(null)
const context = inject(SMorphingModalContextKey)

// Trigger visibility follows isExpanded state
// When modal is expanded, trigger is invisible
// When modal is collapsing, trigger fades back in with the modal
const triggerOpacity = computed(() => context?.isExpanded.value ? 0 : 1)

const handleClick = (event: MouseEvent) => {
  if (props.disabled) return
  
  emit('click', event)
  context?.open()
}

const handleKeydown = (_event: KeyboardEvent) => {
  if (props.disabled) return
  
  context?.open()
}

onMounted(() => {
  if (triggerRef.value) {
    context?.registerTrigger(triggerRef.value)
  }
})

onBeforeUnmount(() => {
  context?.registerTrigger(null)
})
</script>

<template>
  <div
    ref="triggerRef"
    v-bind="$attrs"
    :class="cn('s-morphing-modal-trigger cursor-pointer outline-none', disabled ? 'opacity-(--s-opacity-disabled) cursor-not-allowed' : '', triggerClass, $attrs.class ?? '')"
    :style="{ 
      opacity: triggerOpacity,
      transitionProperty: 'opacity',
      transitionDuration: '500ms',
      transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)'
    }"
    role="button"
    tabindex="0"
    :aria-disabled="disabled"
    @click="handleClick"
    @keydown.enter="handleKeydown"
    @keydown.space.prevent="handleKeydown"
  >
    <slot />
  </div>
</template>

<style scoped>
.s-morphing-modal-trigger {
  display: inline-block;
}

.s-morphing-modal-trigger:focus-visible {
  outline: 2px solid var(--s-primary);
  outline-offset: 2px;
  border-radius: 8px;
}
</style>
