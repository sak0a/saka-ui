<script setup lang="ts">
import { inject, ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { SAccordionContextKey, type SAccordionContext } from './SAccordion.vue'

export interface Props {
  /** Unique identifier for this item */
  name: string | number
  /** Header title text */
  title?: string
  /** Optional subtitle text */
  subtitle?: string
  /** MDI icon name for header */
  icon?: string
  /** Custom expand icon (MDI icon name, replaces default chevron) */
  expandIcon?: string
  /** Disable this item */
  disabled?: boolean
  /** Lazy render content */
  lazy?: boolean
  /** Custom header classes */
  headerClass?: string
  /** Custom content classes */
  contentClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  subtitle: undefined,
  icon: undefined,
  expandIcon: undefined,
  disabled: false,
  lazy: false,
  headerClass: '',
  contentClass: ''
})

const emit = defineEmits<{
  'toggle': [expanded: boolean]
}>()

// Inject context
const context = inject<SAccordionContext>(SAccordionContextKey)

if (!context) {
  console.warn('[SAccordionItem] Must be used inside SAccordion')
}

// Refs
const contentRef = ref<HTMLElement | null>(null)
const contentHeight = ref(0)
const hasBeenExpanded = ref(false)

// Computed
const isExpanded = computed(() => context?.isExpanded(props.name) ?? false)
const shouldRender = computed(() => {
  if (!props.lazy) return true
  return hasBeenExpanded.value
})

// Watch expansion state for lazy loading
watch(isExpanded, (expanded) => {
  if (expanded) {
    hasBeenExpanded.value = true
  }
  emit('toggle', expanded)
  nextTick(() => updateContentHeight())
})

// Update content height for animation
const updateContentHeight = () => {
  if (contentRef.value) {
    contentHeight.value = contentRef.value.scrollHeight
  }
}

// Register/unregister with parent
onMounted(() => {
  context?.registerItem({ name: props.name, disabled: props.disabled })
  updateContentHeight()
})

onBeforeUnmount(() => {
  context?.unregisterItem(props.name)
})

// Toggle handler
const toggle = () => {
  if (props.disabled) return
  context?.toggleItem(props.name)
}

// Keyboard handler
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    toggle()
  }
}

// Size configurations
const sizeConfig = computed(() => {
  const isDense = context?.dense ?? false
  
  const sizes = {
    small: {
      header: isDense ? 'py-1 px-2' : 'py-1 px-2',
      title: isDense ? 'text-xs' : 'text-sm',
      subtitle: 'text-[10px]',
      icon: 'text-sm',
      content: isDense ? 'px-2 pt-1 pb-2 text-xs' : 'px-2 pt-1 pb-2 text-sm',
      expandIcon: 'text-base'
    },
    medium: {
      header: isDense ? 'py-1 px-2' : 'py-1 px-3',
      title: isDense ? 'text-sm' : 'text-base',
      subtitle: isDense ? 'text-xs' : 'text-sm',
      icon: 'text-base',
      content: isDense ? 'px-2 pt-1 pb-2 text-sm' : 'px-2.5 pt-1.5 pb-2.5',
      expandIcon: isDense ? 'text-lg' : 'text-xl'
    },
    large: {
      header: isDense ? 'py-1 px-2.5' : 'py-1 px-2.5',
      title: isDense ? 'text-base' : 'text-lg',
      subtitle: isDense ? 'text-sm' : 'text-sm',
      icon: 'text-lg',
      content: isDense ? 'px-2.5 pt-1.5 pb-2.5' : 'px-3 pt-2 pb-3',
      expandIcon: isDense ? 'text-xl' : 'text-2xl'
    }
  }
  return sizes[context?.size ?? 'medium']
})

// Type-based classes
const itemClasses = computed(() => {
  const type = context?.type ?? 'default'
  
  const typeClasses = {
    default: '',
    bordered: '',
    separated: 'rounded-xl border border-(--s-border) overflow-hidden',
    card: 'rounded-xl bg-(--s-bg-primary) border border-(--s-border) shadow-sm overflow-hidden',
    minimal: ''
  }
  
  return typeClasses[type]
})

const headerClasses = computed(() => {
  const type = context?.type ?? 'default'
  const base = `
    w-full flex items-center gap-3 cursor-pointer select-none
    transition-all duration-300 ease-out
    focus:outline-none focus-visible:ring-2 focus-visible:ring-(--s-primary) focus-visible:ring-offset-2
  `
  
  const typeStyles = {
    default: 'hover:bg-(--s-bg-tertiary)',
    bordered: 'hover:bg-(--s-bg-tertiary)',
    separated: 'bg-(--s-bg-primary) hover:bg-(--s-bg-tertiary)',
    card: 'hover:bg-(--s-bg-tertiary)',
    minimal: 'hover:text-(--s-primary)'
  }
  
  const disabledStyles = props.disabled 
    ? 'opacity-50 cursor-not-allowed' 
    : ''
  
  const expandedStyles = isExpanded.value && !props.disabled
    ? 'bg-(--s-bg-tertiary)/50'
    : ''
  
  return `${base} ${sizeConfig.value.header} ${typeStyles[type]} ${disabledStyles} ${expandedStyles} ${props.headerClass}`
})

const contentWrapperStyle = computed(() => {
  if (!context?.animated) {
    return isExpanded.value ? {} : { display: 'none' }
  }
  
  return {
    maxHeight: isExpanded.value ? `${contentHeight.value}px` : '0px',
    opacity: isExpanded.value ? '1' : '0',
    overflow: 'hidden',
    transition: 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease'
  }
})

const expandIconStyle = computed(() => {
  const rotation = isExpanded.value ? context?.iconRotation ?? 180 : 0
  return {
    transform: `rotate(${rotation}deg)`,
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    color: isExpanded.value && !props.disabled ? context?.color : undefined
  }
})

// Show divider
const showDivider = computed(() => {
  if (!context?.divider) return false
  const type = context?.type ?? 'default'
  return type === 'default' || type === 'bordered'
})

// Flex direction for icon placement
const headerFlexClass = computed(() => {
  return context?.iconPlacement === 'left' ? 'flex-row-reverse' : ''
})
</script>

<template>
  <div 
    class="s-accordion-item"
    :class="itemClasses"
  >
    <!-- Header -->
    <button
      type="button"
      role="button"
      :aria-expanded="isExpanded"
      :aria-disabled="disabled"
      :disabled="disabled"
      :class="headerClasses"
      :style="{ justifyContent: context?.iconPlacement === 'left' ? 'flex-start' : 'space-between' }"
      @click="toggle"
      @keydown="handleKeydown"
    >
      <div 
        class="flex items-center gap-3 flex-1 min-w-0"
        :class="headerFlexClass"
      >
        <!-- Custom Header Slot -->
        <slot 
          name="header" 
          :expanded="isExpanded" 
          :toggle="toggle" 
          :disabled="disabled"
        >
          <!-- Icon -->
          <span 
            v-if="icon" 
            :class="['mdi', `mdi-${icon}`, sizeConfig.icon, 'shrink-0 text-(--s-text-secondary)']"
            :style="isExpanded ? { color: context?.color } : {}"
          />
          
          <!-- Title & Subtitle -->
          <div class="flex flex-col items-start min-w-0 flex-1">
            <slot name="title">
              <span 
                :class="[sizeConfig.title, 'font-medium text-(--s-text-primary) truncate w-full text-left']"
              >
                {{ title }}
              </span>
            </slot>
            <slot name="subtitle">
              <span 
                v-if="subtitle"
                :class="[sizeConfig.subtitle, 'text-(--s-text-secondary) truncate w-full text-left']"
              >
                {{ subtitle }}
              </span>
            </slot>
          </div>
        </slot>
        
        <!-- Extra Slot -->
        <slot name="extra" />
      </div>
        
      <!-- Expand Icon -->
      <slot name="icon" :expanded="isExpanded">
        <span 
          :class="['mdi shrink-0', `mdi-${expandIcon || 'chevron-down'}`, sizeConfig.expandIcon, 'text-(--s-text-secondary)']"
          :style="expandIconStyle"
        />
      </slot>
    </button>
    
    <!-- Divider -->
    <div 
      v-if="showDivider && !isExpanded"
      class="border-b border-(--s-border)"
    />
    
    <!-- Content -->
    <div 
      ref="contentRef"
      :style="contentWrapperStyle"
      role="region"
      :aria-hidden="!isExpanded"
    >
      <div 
        v-if="shouldRender"
        :class="[sizeConfig.content, 'text-(--s-text-secondary)', contentClass]"
      >
        <slot />
      </div>
    </div>
    
    <!-- Bottom Divider for expanded state -->
    <div 
      v-if="showDivider && isExpanded"
      class="border-b border-(--s-border)"
    />
  </div>
</template>

<style scoped>
.s-accordion-item {
  background: transparent;
}

/* Active state highlight */
button:active:not(:disabled) {
  transform: scale(0.995);
}
</style>
