<script setup lang="ts">
/**
 * STabPane - Tab Panel Component
 * Used as a child of STabs to define tab content
 */
defineOptions({ inheritAttrs: false })

import { inject, onMounted, onUnmounted, computed, watch } from 'vue'
import { cn } from '~/lib/utils'
import type { IconProp } from '~/lib/icon'
import { STabsContextKey, type TabPaneInfo } from './context'

// Props
interface Props {
  /** Unique tab identifier (required) */
  name: string | number
  /** Tab label text (required) */
  tab: string
  /** Optional icon */
  icon?: IconProp
  /** Disable this tab */
  disabled?: boolean
  /** Override parent closable setting */
  closable?: boolean
  /** Additional classes for this tab button */
  tabClass?: string
}

const props = defineProps<Props>()

// Inject parent context
const context = inject(STabsContextKey)

if (!context) {
  console.warn('[STabPane] Must be used inside an STabs component')
}

// Computed visibility
const isActive = computed(() => context?.activeTab.value === props.name)

// Register this pane with parent
const paneInfo = computed<TabPaneInfo>(() => ({
  name: props.name,
  tab: props.tab,
  icon: props.icon,
  disabled: props.disabled,
  closable: props.closable,
  tabClass: props.tabClass
}))

onMounted(() => {
  context?.registerPane(paneInfo.value)
})

// Watch for prop changes to update registration
watch(paneInfo, (newInfo) => {
  context?.unregisterPane(props.name)
  context?.registerPane(newInfo)
}, { deep: true })

onUnmounted(() => {
  context?.unregisterPane(props.name)
})

// Animation state - always use smooth base, morph adds blur
const shouldMorph = computed(() => context?.animated ?? false)
</script>

<template>
  <Transition 
    :name="shouldMorph ? 's-tab-morph' : 's-tab-fade'" 
    mode="out-in"
  >
    <div v-if="isActive" :key="name" v-bind="$attrs" :class="cn('s-tab-pane', $attrs.class ?? '')">
      <slot />
    </div>
  </Transition>
</template>

<style scoped>
.s-tab-pane {
  width: 100%;
}

/* Base smooth fade transition (default) */
.s-tab-fade-enter-active {
  transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.s-tab-fade-leave-active {
  transition: opacity 0.12s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
}

.s-tab-fade-enter-from,
.s-tab-fade-leave-to {
  opacity: 0;
}

/* Enhanced morphing transition with blur + scale */
.s-tab-morph-enter-active {
  transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
              filter 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.s-tab-morph-leave-active {
  transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
              filter 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
}

.s-tab-morph-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
  filter: blur(6px);
}

.s-tab-morph-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
  filter: blur(6px);
}
</style>
