<script setup lang="ts">
/**
 * STableRow - Table row component with selection and expansion support
 */
import { inject, computed } from 'vue'
import { SDataTableContextKey } from './index'

interface Props {
  /** Unique row key */
  rowKey?: string | number
  /** Override hoverable state */
  hoverable?: boolean
  /** Custom row class */
  rowClass?: string
  /** Striped index (for striped variant) */
  index?: number
}

const props = withDefaults(defineProps<Props>(), {
  rowKey: undefined,
  hoverable: undefined,
  rowClass: '',
  index: 0
})

const emit = defineEmits<{
  click: [event: MouseEvent]
  dblclick: [event: MouseEvent]
}>()

const context = inject(SDataTableContextKey)

const isHoverable = computed(() => {
  if (props.hoverable !== undefined) return props.hoverable
  return context?.hoverable ?? true
})

const isSelected = computed(() => {
  if (!props.rowKey || !context) return false
  return context.isRowSelected(props.rowKey)
})

const isExpanded = computed(() => {
  if (!props.rowKey || !context) return false
  return context.isRowExpanded(props.rowKey)
})

const rowClasses = computed(() => {
  return [
    's-table-row',
    props.rowClass,
    {
      's-table-row-hoverable': isHoverable.value,
      's-table-row-selected': isSelected.value,
      's-table-row-expanded': isExpanded.value,
      's-table-row-even': props.index % 2 === 1 && context?.variant === 'striped'
    }
  ]
})

const handleClick = (event: MouseEvent) => {
  emit('click', event)
}

const handleDblClick = (event: MouseEvent) => {
  emit('dblclick', event)
}
</script>

<template>
  <tr
    :class="rowClasses"
    :data-row-key="rowKey"
    :aria-selected="context?.selectionMode !== 'none' ? isSelected : undefined"
    @click="handleClick"
    @dblclick="handleDblClick"
  >
    <slot />
  </tr>
</template>

<style scoped>
.s-table-row {
  border-bottom: 1px solid var(--s-border);
}

.s-table-row-hoverable {
  transition: background-color 0.15s ease;
}

.s-table-row-hoverable:hover {
  background-color: var(--s-bg-tertiary);
}

.s-table-row-selected {
  background-color: var(--s-primary-alpha) !important;
}

.s-table-row-even {
  background-color: var(--s-bg-secondary);
}
</style>
