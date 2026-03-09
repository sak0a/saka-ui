<script setup lang="ts">
defineOptions({ inheritAttrs: false })

import { inject, computed, useAttrs } from 'vue'
import { cn } from '~/lib/utils'
import { SAccordionItemContextKey, SAccordionContextKey, type SAccordionItemContext, type SAccordionContext } from './context'

export interface Props {
  /** Hide the default arrow indicator */
  hideArrow?: boolean
  /** Custom classes for the trigger button */
  triggerClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  hideArrow: false,
  triggerClass: ''
})

const attrs = useAttrs()
const itemContext = inject<SAccordionItemContext>(SAccordionItemContextKey)
const accordionContext = inject<SAccordionContext>(SAccordionContextKey)

if (!itemContext) {
  console.warn('[SAccordionTrigger] Must be used inside SAccordionItem')
}

const isExpanded = computed(() => itemContext?.isExpanded.value ?? false)
const disabled = computed(() => itemContext?.disabled.value ?? false)
const sizeConfig = computed(() => itemContext?.sizeConfig.value)

const toggle = () => {
  if (disabled.value) return
  itemContext?.toggle()
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    toggle()
  }
}

const headerClasses = computed(() => {
  const type = accordionContext?.type ?? 'default'
  const base = `
    w-full flex items-center gap-3 cursor-pointer select-none
    transition-all duration-300 ease-out
    focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
  `

  const typeStyles: Record<string, string> = {
    default: 'hover:bg-accent',
    bordered: 'hover:bg-accent',
    separated: 'bg-background hover:bg-accent',
    card: 'hover:bg-accent',
    minimal: 'hover:text-primary'
  }

  const disabledStyles = disabled.value
    ? 'opacity-50 cursor-not-allowed'
    : ''

  const expandedStyles = isExpanded.value && !disabled.value
    ? 'bg-accent/50'
    : ''

  return cn(
    base,
    sizeConfig.value?.header,
    typeStyles[type],
    disabledStyles,
    expandedStyles,
    props.triggerClass,
    (attrs.class as string) ?? ''
  )
})

const arrowStyle = computed(() => {
  const rotation = isExpanded.value ? (accordionContext?.iconRotation ?? 180) : 0
  return {
    transform: `rotate(${rotation}deg)`,
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    color: isExpanded.value && !disabled.value ? accordionContext?.color : undefined
  }
})

const iconPlacement = computed(() => accordionContext?.iconPlacement ?? 'right')
</script>

<template>
  <button
    v-bind="{ ...$attrs, class: undefined }"
    type="button"
    role="button"
    :aria-expanded="isExpanded"
    :aria-disabled="disabled"
    :disabled="disabled"
    :class="headerClasses"
    :style="{ justifyContent: iconPlacement === 'left' ? 'flex-start' : 'space-between' }"
    @click="toggle"
    @keydown="handleKeydown"
  >
    <div
      class="flex items-center gap-3 flex-1 min-w-0"
      :class="iconPlacement === 'left' ? 'flex-row-reverse' : ''"
    >
      <!-- Icon slot: place a leading icon (any component, not just MDI) -->
      <slot name="icon" :expanded="isExpanded" :disabled="disabled" />

      <!-- Default slot: trigger label content -->
      <div class="flex flex-col items-start min-w-0 flex-1">
        <span :class="[sizeConfig?.title, 'font-medium text-foreground truncate w-full text-left']">
          <slot :expanded="isExpanded" :disabled="disabled" />
        </span>
      </div>
    </div>

    <!-- Arrow slot: the expand/collapse indicator -->
    <template v-if="!hideArrow">
      <slot name="arrow" :expanded="isExpanded" :disabled="disabled">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          :class="cn('shrink-0 text-muted-foreground', sizeConfig?.expandIcon)"
          :style="arrowStyle"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </slot>
    </template>
  </button>
</template>

<style scoped>
button:active:not(:disabled) {
  transform: scale(0.995);
}
</style>
