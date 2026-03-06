<script setup lang="ts">
defineOptions({ inheritAttrs: false })

import { inject, computed, useAttrs } from 'vue'
import { cn } from '~/lib/utils'
import { STabsContextKey, type STabsContext, type TabType } from './STabs.vue'
import { STabsListContextKey, type STabsListContext } from './STabsList.vue'

interface Props {
  value: string | number
  disabled?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  class: undefined
})

const attrs = useAttrs()

const ctx = inject<STabsContext>(STabsContextKey)
const listCtx = inject<STabsListContext>(STabsListContextKey)

if (!ctx) console.warn('[STabsTrigger] Must be used inside STabs')

const isActive = computed(() => ctx?.activeTab.value === props.value)

const effectiveType = computed((): TabType => listCtx?.type.value ?? ctx?.type ?? 'line')

// Register ref with STabsList for indicator positioning
const setRef = (el: HTMLElement | null) => {
  listCtx?.setTriggerRef(props.value, el)
}

const handleClick = () => {
  if (props.disabled) return
  ctx?.setActiveTab(props.value)
}

const handleMouseEnter = () => {
  if (props.disabled) return
  if (ctx?.trigger === 'hover') {
    ctx.setActiveTab(props.value)
  }
}

// Size classes
const sizeClasses = computed(() => {
  const size = ctx?.size ?? 'medium'
  const sizes = {
    small: 'text-xs px-2.5 py-1.5',
    medium: 'text-sm px-4 py-2',
    large: 'text-base px-5 py-2.5'
  }
  return sizes[size]
})

// Is the indicator a background type (chip/segment/card)
const isBackgroundIndicator = computed(() => {
  return effectiveType.value === 'chip' || effectiveType.value === 'segment' || effectiveType.value === 'card'
})

const triggerClasses = computed(() => {
  const active = isActive.value
  const type = effectiveType.value

  const base = `
    relative cursor-pointer
    flex items-center gap-2 whitespace-nowrap
    transition-all duration-300 ease-out
    ${sizeClasses.value}
  `

  const disabledClass = props.disabled ? 'opacity-40 cursor-not-allowed' : ''

  // For background indicator types, the trigger just needs text styling (z-index above indicator)
  const typeStyles: Record<TabType, string> = {
    line: active
      ? 'text-foreground font-medium'
      : 'text-muted-foreground hover:text-foreground',
    card: active
      ? 'text-primary-foreground font-medium rounded-xl'
      : 'text-muted-foreground rounded-xl hover:text-foreground',
    segment: active
      ? 'text-primary-foreground font-medium rounded-lg'
      : 'text-muted-foreground rounded-lg hover:text-foreground',
    bar: active
      ? 'text-foreground font-medium'
      : 'text-muted-foreground hover:text-foreground',
    chip: active
      ? 'text-primary-foreground font-medium rounded-full'
      : 'text-muted-foreground rounded-full hover:text-foreground'
  }

  const zIndex = isBackgroundIndicator.value ? 'z-[1]' : ''

  return `${base} ${disabledClass} ${typeStyles[type]} ${zIndex}`
})
</script>

<template>
  <button
    :ref="(el) => setRef(el as HTMLElement)"
    v-bind="attrs"
    type="button"
    :class="cn(triggerClasses, props.class)"
    :disabled="disabled"
    :aria-selected="isActive"
    :aria-disabled="disabled"
    role="tab"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
  >
    <slot :active="isActive" :disabled="disabled" />
  </button>
</template>

<style scoped>
button:focus-visible {
  outline: 2px solid rgba(99, 226, 183, 0.5);
  outline-offset: 2px;
}
</style>
