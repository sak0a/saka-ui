<script setup lang="ts">
/**
 * STabs - Custom Tab Component
 * Supports both simple (STabPane) and compound (STabsList + STabsTrigger + STabsContent) APIs
 */
defineOptions({ inheritAttrs: false })

import { type Ref, provide, ref, computed, watch, nextTick, onMounted } from 'vue'
import { cn } from '~/lib/utils'
import { isIconComponent } from '~/lib/icon'
import { STabsContextKey, type TabType, type TabSize, type TabPlacement, type TabJustify, type TabPaneInfo } from './context'

// Props
export interface Props {
  /** Active tab value (v-model) */
  modelValue?: string | number
  /** Tab style variant */
  type?: TabType
  /** Tab size */
  size?: TabSize
  /** Enable panel transition animations */
  animated?: boolean
  /** Tab position */
  placement?: TabPlacement
  /** Tab alignment */
  justifyContent?: TabJustify
  /** Show close button on tabs */
  closable?: boolean
  /** Additional classes for tabs */
  tabClass?: string
  /** Classes for active tab */
  activeTabClass?: string
  /** Classes for content panel */
  panelClass?: string
  /** Active indicator/chip color */
  barColor?: string
  /** Chip background color (for chip type) */
  chipColor?: string
  /** Active chip background color (for chip type) */
  chipActiveColor?: string
  /** Classes for tabs wrapper */
  tabsWrapperClass?: string
  /** Trigger mode for switching tabs */
  trigger?: 'click' | 'hover'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  type: 'line',
  size: 'medium',
  animated: false,
  placement: 'top',
  justifyContent: 'flex-start',
  closable: false,
  tabClass: '',
  activeTabClass: '',
  panelClass: '',
  barColor: 'var(--s-primary)',
  chipColor: 'var(--s-accent)',
  chipActiveColor: 'var(--s-primary)',
  tabsWrapperClass: '',
  trigger: 'click'
})

// Events
const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'close', name: string | number): void
  (e: 'before-leave', from: string | number, to: string | number): void
}>()

// State
const registeredPanes = ref<TabPaneInfo[]>([])
const internalActiveTab = ref<string | number>('')

// Refs for sliding indicator (simple API)
const tabsWrapperRef = ref<HTMLElement | null>(null)
const tabRefs = ref<Map<string | number, HTMLElement>>(new Map())
const indicatorStyle = ref<Record<string, string>>({
  left: '0px',
  width: '0px',
  opacity: '0'
})

// Computed
const activeTab = computed({
  get: () => props.modelValue ?? internalActiveTab.value,
  set: (value) => {
    internalActiveTab.value = value
    emit('update:modelValue', value)
  }
})

// Detect compound API: if registeredPanes stays empty, we're in compound mode
// (STabsTrigger/STabsContent don't register panes)
const isSimpleApi = computed(() => registeredPanes.value.length > 0)

// Update indicator position when active tab changes (simple API only)
const updateIndicator = async () => {
  await nextTick()

  const wrapper = tabsWrapperRef.value
  const activeTabEl = tabRefs.value.get(activeTab.value)

  if (!wrapper || !activeTabEl) {
    indicatorStyle.value = { ...indicatorStyle.value, opacity: '0' }
    return
  }

  const wrapperRect = wrapper.getBoundingClientRect()
  const tabRect = activeTabEl.getBoundingClientRect()

  const isVertical = props.placement === 'left' || props.placement === 'right'

  if (isVertical) {
    indicatorStyle.value = {
      top: `${tabRect.top - wrapperRect.top}px`,
      height: `${tabRect.height}px`,
      width: '2px',
      opacity: '1'
    }
  } else {
    indicatorStyle.value = {
      left: `${tabRect.left - wrapperRect.left}px`,
      width: `${tabRect.width}px`,
      height: '2px',
      opacity: '1'
    }
  }
}

// Set tab ref (simple API)
const setTabRef = (name: string | number, el: HTMLElement | null) => {
  if (el) {
    tabRefs.value.set(name, el)
  } else {
    tabRefs.value.delete(name)
  }
}

// Allow STabsList to register its ref for compound API
const setListRef = (_el: HTMLElement) => {
  // Not needed for simple API indicator, but kept for potential future use
}

// Watch for active tab changes and update indicator
watch(activeTab, () => {
  if (isSimpleApi.value) updateIndicator()
})

// Watch for panes changes
watch(registeredPanes, () => {
  nextTick(() => {
    if (isSimpleApi.value) updateIndicator()
  })
}, { deep: true })

// Set first tab as default when panes register
watch(registeredPanes, (panes) => {
  if (panes.length > 0 && !activeTab.value) {
    const firstEnabled = panes.find(p => !p.disabled)
    if (firstEnabled) {
      activeTab.value = firstEnabled.name
    }
  }
}, { immediate: true })

// Initial indicator setup
onMounted(() => {
  setTimeout(() => {
    if (isSimpleApi.value) updateIndicator()
  }, 50)
})

// Methods
const registerPane = (pane: TabPaneInfo) => {
  if (!registeredPanes.value.find(p => p.name === pane.name)) {
    registeredPanes.value.push(pane)
  }
}

const unregisterPane = (name: string | number) => {
  const index = registeredPanes.value.findIndex(p => p.name === name)
  if (index > -1) {
    registeredPanes.value.splice(index, 1)
  }
}

const setActiveTab = (name: string | number) => {
  // For simple API, check pane disabled state
  const pane = registeredPanes.value.find(p => p.name === name)
  if (pane?.disabled) return

  emit('before-leave', activeTab.value, name)
  activeTab.value = name
}

const handleMouseEnter = (name: string | number) => {
  if (props.trigger === 'hover') {
    setActiveTab(name)
  }
}

const handleClose = (name: string | number, event: Event) => {
  event.stopPropagation()
  emit('close', name)
}

// Size classes
const sizeClasses = computed(() => {
  const sizes = {
    small: 'text-xs px-2.5 py-1.5',
    medium: 'text-sm px-4 py-2',
    large: 'text-base px-5 py-2.5'
  }
  return sizes[props.size]
})

// Type-specific classes for tabs wrapper (simple API)
const wrapperClasses = computed(() => {
  const base = 'relative flex transition-colors duration-300'
  const placement = props.placement === 'left' || props.placement === 'right'
    ? 'flex-col'
    : 'flex-row'

  const typeClasses = {
    line: 'gap-1',
    card: 'gap-2',
    segment: 'gap-0.5 bg-muted p-1 rounded-xl shadow-sm border border-border',
    bar: 'gap-1',
    chip: 'gap-2 flex-wrap'
  }

  return `${base} ${placement} ${typeClasses[props.type]} ${props.tabsWrapperClass}`
})

// Container layout based on placement
const containerClasses = computed(() => {
  if (props.placement === 'left') return 'flex flex-row gap-4'
  if (props.placement === 'right') return 'flex flex-row-reverse gap-4'
  if (props.placement === 'bottom') return 'flex flex-col-reverse gap-3'
  return 'flex flex-col gap-3'
})

// Tab button classes (simple API)
const getTabClasses = (pane: TabPaneInfo) => {
  const isActive = activeTab.value === pane.name
  const isDisabled = pane.disabled

  const base = `
    relative cursor-pointer
    flex items-center gap-2 whitespace-nowrap
    transition-all duration-300 ease-out
    ${sizeClasses.value}
    ${props.tabClass}
    ${pane.tabClass || ''}
  `

  const disabledClass = isDisabled
    ? 'opacity-40 cursor-not-allowed'
    : ''

  const typeStyles = {
    line: isActive
      ? `text-foreground font-medium ${props.activeTabClass}`
      : 'text-muted-foreground hover:text-foreground',
    card: isActive
      ? `bg-muted text-foreground rounded-xl border border-border shadow-md ${props.activeTabClass}`
      : 'text-muted-foreground border border-transparent hover:border-border rounded-xl hover:bg-accent',
    segment: isActive
      ? `bg-background text-foreground rounded-lg shadow-sm font-medium ${props.activeTabClass}`
      : 'text-muted-foreground rounded-lg hover:text-foreground',
    bar: isActive
      ? `text-foreground font-medium ${props.activeTabClass}`
      : 'text-muted-foreground hover:text-foreground',
    chip: isActive
      ? `text-background font-medium rounded-full shadow-md ${props.activeTabClass}`
      : 'text-muted-foreground rounded-full hover:text-foreground'
  }

  return `${base} ${disabledClass} ${typeStyles[props.type]}`
}

// Get chip background style (simple API)
const getChipStyle = (pane: TabPaneInfo) => {
  if (props.type !== 'chip') return {}

  const isActive = activeTab.value === pane.name
  return {
    backgroundColor: isActive ? props.chipActiveColor : props.chipColor,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  }
}

// Sliding indicator position and style (simple API)
const slidingIndicatorStyle = computed(() => {
  const isVertical = props.placement === 'left' || props.placement === 'right'

  if (isVertical) {
    return {
      ...indicatorStyle.value,
      backgroundColor: props.barColor,
      borderRadius: '2px',
      position: 'absolute' as const,
      [props.placement === 'left' ? 'right' : 'left']: '0',
      transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }

  return {
    ...indicatorStyle.value,
    backgroundColor: props.barColor,
    borderRadius: '2px',
    position: 'absolute' as const,
    bottom: '0',
    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)'
  }
})

// Check if sliding indicator should be shown (simple API)
const showSlidingIndicator = computed(() => {
  return props.type === 'line' || props.type === 'bar'
})

// Provide context to all children
provide(STabsContextKey, {
  activeTab: activeTab as Ref<string | number>,
  type: props.type,
  size: props.size,
  placement: props.placement,
  animated: props.animated,
  closable: props.closable,
  barColor: props.barColor,
  justifyContent: props.justifyContent,
  trigger: props.trigger,
  registerPane,
  unregisterPane,
  setActiveTab,
  setListRef
})
</script>

<template>
  <div v-bind="$attrs" :class="cn(containerClasses, $attrs.class ?? '')">
    <!-- Simple API: auto-render tabs from registered panes -->
    <template v-if="isSimpleApi">
      <div
        ref="tabsWrapperRef"
        :class="wrapperClasses"
        :style="{ justifyContent: justifyContent }"
        role="tablist"
      >
        <!-- Sliding indicator (for line and bar types) -->
        <span
          v-if="showSlidingIndicator"
          class="s-tab-sliding-indicator"
          :style="slidingIndicatorStyle"
        />

        <button
          v-for="pane in registeredPanes"
          :key="pane.name"
          :ref="(el) => setTabRef(pane.name, el as HTMLElement)"
          :class="getTabClasses(pane)"
          :style="getChipStyle(pane)"
          :disabled="pane.disabled"
          :aria-selected="activeTab === pane.name"
          :aria-disabled="pane.disabled"
          role="tab"
          @click="setActiveTab(pane.name)"
          @mouseenter="handleMouseEnter(pane.name)"
        >
          <!-- Custom tab template slot -->
          <slot
            name="tab"
            :pane="pane"
            :active="activeTab === pane.name"
            :disabled="pane.disabled"
            :close="() => emit('close', pane.name)"
          >
            <!-- Icon -->
            <component v-if="pane.icon && isIconComponent(pane.icon)" :is="pane.icon" :class="[{ 'scale-110': activeTab === pane.name }]" />
            <span
              v-else-if="pane.icon"
              class="mdi transition-transform duration-300"
              :class="[`mdi-${pane.icon}`, { 'scale-110': activeTab === pane.name }]"
            />

            <!-- Label -->
            <span>{{ pane.tab }}</span>

            <!-- Close button -->
            <span
              v-if="(closable || pane.closable) && !pane.disabled"
              class="ml-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-1 transition-all duration-200 hover:scale-110"
              @click="handleClose(pane.name, $event)"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </span>
          </slot>
        </button>
      </div>

      <!-- Panels (simple API - STabPane children render here) -->
      <div :class="['flex-1 relative overflow-hidden', panelClass]" role="tabpanel">
        <slot />
      </div>
    </template>

    <!-- Compound API: everything in default slot (STabsList, STabsContent, etc.) -->
    <template v-else>
      <slot />
    </template>
  </div>
</template>

<style scoped>
/* Sliding indicator base styles */
.s-tab-sliding-indicator {
  pointer-events: none;
  z-index: 1;
}

/* Focus styles */
button:focus-visible {
  outline: 2px solid rgba(99, 226, 183, 0.5);
  outline-offset: 2px;
}
</style>
