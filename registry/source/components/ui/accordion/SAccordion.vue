<script setup lang="ts">
/**
 * SAccordion - Advanced Accordion Component
 * A highly customizable accordion component styled with TailwindCSS
 */
defineOptions({ inheritAttrs: false })

import { provide, ref, computed, watch } from 'vue'
import { cn } from '../../../lib/utils'
import { SAccordionContextKey, type AccordionType, type AccordionSize, type IconPlacement, type AccordionItemInfo } from './context'

export interface Props {
  /** Active item(s) - array for multiple mode, single value for single mode */
  modelValue?: string | number | (string | number)[]
  /** Visual variant */
  type?: AccordionType
  /** Size variant */
  size?: AccordionSize
  /** Allow multiple items to be expanded */
  multiple?: boolean
  /** Allow all items to be collapsed (in single mode) */
  collapsible?: boolean
  /** Expand icon position */
  iconPlacement?: IconPlacement
  /** Icon rotation angle when expanded */
  iconRotation?: number
  /** Enable height transitions */
  animated?: boolean
  /** Show dividers between items */
  divider?: boolean
  /** Active/accent color */
  color?: string
  /** Dense mode for compact layout */
  dense?: boolean
  /** Additional classes for the accordion */
  accordionClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  type: 'default',
  size: 'md',
  multiple: false,
  collapsible: true,
  iconPlacement: 'right',
  iconRotation: 180,
  animated: true,
  divider: true,
  color: 'var(--s-primary)',
  dense: false,
  accordionClass: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | (string | number)[]]
  'change': [name: string | number, expanded: boolean]
  'before-expand': [name: string | number]
  'after-expand': [name: string | number]
  'before-collapse': [name: string | number]
  'after-collapse': [name: string | number]
}>()

// State
const registeredItems = ref<AccordionItemInfo[]>([])
const activeItems = ref<Set<string | number>>(new Set())

// Initialize from modelValue
const initializeActiveItems = () => {
  if (props.modelValue === undefined) return
  
  activeItems.value.clear()
  if (Array.isArray(props.modelValue)) {
    props.modelValue.forEach(v => activeItems.value.add(v))
  } else if (props.modelValue !== null) {
    activeItems.value.add(props.modelValue)
  }
}

// Watch modelValue changes
watch(() => props.modelValue, initializeActiveItems, { immediate: true })

// Methods
const registerItem = (item: AccordionItemInfo) => {
  if (!registeredItems.value.find(i => i.name === item.name)) {
    registeredItems.value.push(item)
  }
}

const unregisterItem = (name: string | number) => {
  const index = registeredItems.value.findIndex(i => i.name === name)
  if (index > -1) {
    registeredItems.value.splice(index, 1)
  }
}

const isExpanded = (name: string | number): boolean => {
  return activeItems.value.has(name)
}

const toggleItem = (name: string | number) => {
  const item = registeredItems.value.find(i => i.name === name)
  if (item?.disabled) return

  const currentlyExpanded = isExpanded(name)

  if (currentlyExpanded) {
    // Collapsing
    if (!props.collapsible && !props.multiple && activeItems.value.size === 1) {
      return // Can't collapse if not collapsible and it's the only one open
    }
    
    emit('before-collapse', name)
    activeItems.value.delete(name)
    emit('change', name, false)
    
    setTimeout(() => emit('after-collapse', name), props.animated ? 300 : 0)
  } else {
    // Expanding
    emit('before-expand', name)
    
    if (!props.multiple) {
      // Close all others first
      activeItems.value.forEach(n => {
        if (n !== name) {
          emit('before-collapse', n)
          emit('change', n, false)
          setTimeout(() => emit('after-collapse', n), props.animated ? 300 : 0)
        }
      })
      activeItems.value.clear()
    }
    
    activeItems.value.add(name)
    emit('change', name, true)
    
    setTimeout(() => emit('after-expand', name), props.animated ? 300 : 0)
  }

  // Emit modelValue update
  emitModelValue()
}

const emitModelValue = () => {
  if (props.multiple) {
    emit('update:modelValue', Array.from(activeItems.value))
  } else {
    const first = activeItems.value.values().next().value
    emit('update:modelValue', first ?? ('' as string | number))
  }
}

// Computed classes
const accordionClasses = computed(() => {
  const base = 'w-full'
  
  const typeClasses = {
    default: '',
    bordered: 'border border-border rounded-xl overflow-hidden',
    separated: 'space-y-3',
    card: 'space-y-3',
    minimal: ''
  }
  
  return `${base} ${typeClasses[props.type]} ${props.accordionClass}`
})

// Provide context
provide(SAccordionContextKey, {
  activeItems,
  type: props.type,
  size: props.size,
  multiple: props.multiple,
  collapsible: props.collapsible,
  iconPlacement: props.iconPlacement,
  iconRotation: props.iconRotation,
  animated: props.animated,
  divider: props.divider,
  dense: props.dense,
  color: props.color,
  registerItem,
  unregisterItem,
  toggleItem,
  isExpanded
})
</script>

<template>
  <div
    v-bind="$attrs"
    :class="cn(accordionClasses, $attrs.class ?? '')"
    role="region"
    aria-label="Accordion"
  >
    <slot />
  </div>
</template>

<style scoped>
/* Base accordion styles */
</style>
