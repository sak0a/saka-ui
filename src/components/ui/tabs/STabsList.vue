<script setup lang="ts">
defineOptions({ inheritAttrs: false })

import { type InjectionKey, type Ref, inject, ref, computed, provide, onMounted, useAttrs } from 'vue'
import { cn } from '~/lib/utils'
import { STabsContextKey, type STabsContext, type TabType } from './STabs.vue'

export interface STabsListContext {
  listRef: Ref<HTMLElement | null>
  type: Ref<TabType>
  triggerRefs: Ref<Map<string | number, HTMLElement>>
  setTriggerRef: (name: string | number, el: HTMLElement | null) => void
}

export const STabsListContextKey: InjectionKey<STabsListContext> = Symbol('STabsListContext')

interface Props {
  type?: TabType
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: undefined,
  class: undefined
})

const attrs = useAttrs()

const ctx = inject<STabsContext>(STabsContextKey)
if (!ctx) console.warn('[STabsList] Must be used inside STabs')

const listRef = ref<HTMLElement | null>(null)
const triggerRefs = ref<Map<string | number, HTMLElement>>(new Map())

const effectiveType = computed(() => props.type ?? ctx?.type ?? 'line')

const setTriggerRef = (name: string | number, el: HTMLElement | null) => {
  if (el) {
    triggerRefs.value.set(name, el)
  } else {
    triggerRefs.value.delete(name)
  }
}

const isVertical = computed(() => {
  const placement = ctx?.placement ?? 'top'
  return placement === 'left' || placement === 'right'
})

const wrapperClasses = computed(() => {
  const base = 'relative flex transition-colors duration-300'
  const dir = isVertical.value ? 'flex-col' : 'flex-row'

  const typeClasses: Record<TabType, string> = {
    line: 'gap-1',
    card: 'gap-2',
    segment: 'gap-0.5 bg-muted p-1 rounded-xl shadow-sm border border-border',
    bar: 'gap-1',
    chip: 'gap-2 flex-wrap'
  }

  return `${base} ${dir} ${typeClasses[effectiveType.value]}`
})

// Provide list context for STabsIndicator
provide(STabsListContextKey, {
  listRef,
  type: effectiveType,
  triggerRefs,
  setTriggerRef
})

// Also register the list ref with the parent tabs context so the simple API indicator still works
onMounted(() => {
  if (ctx && listRef.value) {
    ctx.setListRef(listRef.value)
  }
})
</script>

<template>
  <div
    ref="listRef"
    v-bind="attrs"
    :class="cn(wrapperClasses, props.class)"
    :style="{ justifyContent: ctx?.justifyContent ?? 'flex-start' }"
    role="tablist"
  >
    <slot />
  </div>
</template>
