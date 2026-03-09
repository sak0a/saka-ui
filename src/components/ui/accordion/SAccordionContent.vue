<script setup lang="ts">
defineOptions({ inheritAttrs: false })

import { inject, computed, watch, nextTick, onMounted } from 'vue'
import { cn } from '~/lib/utils'
import { SAccordionItemContextKey, SAccordionContextKey, type SAccordionItemContext, type SAccordionContext } from './context'

export interface Props {
  /** Custom content classes */
  contentClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  contentClass: ''
})

const itemContext = inject<SAccordionItemContext>(SAccordionItemContextKey)
const accordionContext = inject<SAccordionContext>(SAccordionContextKey)

if (!itemContext) {
  console.warn('[SAccordionContent] Must be used inside SAccordionItem')
}

const isExpanded = computed(() => itemContext?.isExpanded.value ?? false)
const shouldRender = computed(() => itemContext?.shouldRender.value ?? true)
const sizeConfig = computed(() => itemContext?.sizeConfig.value)

const wrapperStyle = computed(() => {
  if (!accordionContext?.animated) {
    return isExpanded.value ? {} : { display: 'none' }
  }

  return {
    maxHeight: isExpanded.value ? `${itemContext?.contentHeight.value ?? 0}px` : '0px',
    opacity: isExpanded.value ? '1' : '0',
    overflow: 'hidden',
    transition: 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease'
  }
})

// Keep height in sync
watch(isExpanded, () => {
  nextTick(() => itemContext?.updateContentHeight())
})

onMounted(() => {
  itemContext?.updateContentHeight()
})

// Show divider
const showDivider = computed(() => {
  if (!accordionContext?.divider) return false
  const type = accordionContext?.type ?? 'default'
  return type === 'default' || type === 'bordered'
})
</script>

<template>
  <!-- Divider before content -->
  <div
    v-if="showDivider && !isExpanded"
    class="border-b border-border"
  />

  <!-- Content wrapper -->
  <div
    :ref="(el) => { if (itemContext) itemContext.contentRef.value = el as HTMLElement }"
    :style="wrapperStyle"
    role="region"
    :aria-hidden="!isExpanded"
  >
    <div
      v-if="shouldRender"
      v-bind="{ ...$attrs, class: undefined }"
      :class="cn(sizeConfig?.content, 'text-muted-foreground', props.contentClass, ($attrs.class as string) ?? '')"
    >
      <slot />
    </div>
  </div>

  <!-- Bottom divider for expanded state -->
  <div
    v-if="showDivider && isExpanded"
    class="border-b border-border"
  />
</template>
