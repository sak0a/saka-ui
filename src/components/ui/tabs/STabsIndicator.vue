<script setup lang="ts">
import { inject, ref, computed, watch, onMounted, nextTick } from 'vue'
import { STabsContextKey, type STabsContext } from './context'
import { STabsListContextKey, type STabsListContext } from './list-context'

interface Props {
  color?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: undefined,
  class: undefined
})

const ctx = inject<STabsContext>(STabsContextKey)
const listCtx = inject<STabsListContext>(STabsListContextKey)

if (!ctx) console.warn('[STabsIndicator] Must be used inside STabs')
if (!listCtx) console.warn('[STabsIndicator] Must be used inside STabsList')

const indicatorStyle = ref<Record<string, string>>({
  left: '0px',
  width: '0px',
  opacity: '0'
})

const effectiveType = computed(() => listCtx?.type.value ?? ctx?.type ?? 'line')
const effectiveColor = computed(() => props.color ?? ctx?.barColor ?? 'var(--s-primary)')

const isVertical = computed(() => {
  const placement = ctx?.placement ?? 'top'
  return placement === 'left' || placement === 'right'
})

// Determine indicator variant based on type
const isBackground = computed(() => {
  return effectiveType.value === 'chip' || effectiveType.value === 'segment' || effectiveType.value === 'card'
})

const updateIndicator = async () => {
  await nextTick()

  const wrapper = listCtx?.listRef.value
  const activeTabEl = listCtx?.triggerRefs.value.get(ctx?.activeTab.value ?? '')

  if (!wrapper || !activeTabEl) {
    indicatorStyle.value = { ...indicatorStyle.value, opacity: '0' }
    return
  }

  const wrapperRect = wrapper.getBoundingClientRect()
  const tabRect = activeTabEl.getBoundingClientRect()

  if (isBackground.value) {
    // Background pill/card indicator
    indicatorStyle.value = {
      left: `${tabRect.left - wrapperRect.left}px`,
      top: `${tabRect.top - wrapperRect.top}px`,
      width: `${tabRect.width}px`,
      height: `${tabRect.height}px`,
      opacity: '1'
    }
  } else if (isVertical.value) {
    // Vertical line indicator
    indicatorStyle.value = {
      top: `${tabRect.top - wrapperRect.top}px`,
      height: `${tabRect.height}px`,
      width: '2px',
      opacity: '1'
    }
  } else {
    // Horizontal line/bar indicator
    indicatorStyle.value = {
      left: `${tabRect.left - wrapperRect.left}px`,
      width: `${tabRect.width}px`,
      height: '2px',
      opacity: '1'
    }
  }
}

// Watch active tab
watch(() => ctx?.activeTab.value, () => updateIndicator())

// Watch trigger refs changes (new triggers registered)
watch(() => listCtx?.triggerRefs.value.size, () => {
  nextTick(() => updateIndicator())
})

onMounted(() => {
  setTimeout(() => updateIndicator(), 50)
})

const computedStyle = computed(() => {
  const base: Record<string, string> = {
    ...indicatorStyle.value,
    position: 'absolute',
    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
    pointerEvents: 'none',
    zIndex: isBackground.value ? '0' : '1'
  }

  if (isBackground.value) {
    base.backgroundColor = effectiveColor.value
    base.borderRadius = effectiveType.value === 'chip' ? '9999px'
      : effectiveType.value === 'segment' ? '0.5rem'
      : '0.75rem'
  } else {
    base.backgroundColor = effectiveColor.value
    base.borderRadius = '2px'
    if (!isVertical.value) {
      base.bottom = '0'
    } else {
      const placement = ctx?.placement ?? 'top'
      base[placement === 'left' ? 'right' : 'left'] = '0'
    }
  }

  return base
})
</script>

<template>
  <span
    :class="['s-tabs-indicator', props.class]"
    :style="computedStyle"
  />
</template>
