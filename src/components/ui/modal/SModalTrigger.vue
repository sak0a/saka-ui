<script setup lang="ts">
/**
 * SModalTrigger - Trigger element that opens the modal
 */
defineOptions({ inheritAttrs: false })

import { cn } from '~/lib/utils'

export interface Props {
  /** Trigger element type */
  as?: string
  /** Disable trigger */
  disabled?: boolean
  /** Additional class */
  triggerClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
  disabled: false,
  triggerClass: ''
})

const emit = defineEmits<{
  'click': [event: MouseEvent]
}>()

const modalOpen = defineModel<boolean>({ default: false })

const handleClick = (event: MouseEvent) => {
  if (props.disabled) return
  
  modalOpen.value = true
  emit('click', event)
}
</script>

<template>
  <component
    :is="as"
    v-bind="$attrs"
    :type="as === 'button' ? 'button' : undefined"
    :class="cn('s-modal-trigger inline-flex outline-none', disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer', triggerClass, $attrs.class ?? '')"
    :disabled="disabled && as === 'button'"
    :aria-disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </component>
</template>

<style scoped>
.s-modal-trigger:focus-visible {
  outline: 2px solid var(--s-primary);
  outline-offset: 2px;
  border-radius: 4px;
}
</style>
