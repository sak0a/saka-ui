<script setup lang="ts">
/**
 * STableCell - Table cell component
 */
import { inject, computed } from 'vue'
import { cn } from '../../../lib/utils'
import { SDataTableContextKey, type ColumnAlign } from './index'

interface Props {
  /** Cell alignment */
  align?: ColumnAlign
  /** Custom cell class */
  cellClass?: string
  /** Column key (for accessing column config) */
  columnKey?: string
  /** Whether this is a header cell */
  header?: boolean
  /** Colspan */
  colspan?: number
  /** Rowspan */
  rowspan?: number
  /** Cell width */
  width?: string
  /** Min width */
  minWidth?: string
  /** Max width */
  maxWidth?: string
  /** Sticky position */
  sticky?: 'left' | 'right'
  /** Truncate overflow text */
  truncate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  align: 'left',
  cellClass: '',
  columnKey: undefined,
  header: false,
  colspan: undefined,
  rowspan: undefined,
  width: undefined,
  minWidth: undefined,
  maxWidth: undefined,
  sticky: undefined,
  truncate: false
})

defineOptions({ inheritAttrs: false })

const context = inject(SDataTableContextKey)

// Get size from context
const sizeClass = computed(() => {
  const sizes = {
    sm: 's-table-cell-sm',
    md: 's-table-cell-md',
    lg: 's-table-cell-lg'
  }
  return context ? sizes[context.size] : sizes.md
})

const cellClasses = computed(() => {
  return [
    props.header ? 's-table-th' : 's-table-td',
    sizeClass.value,
    props.cellClass,
    {
      'text-left': props.align === 'left',
      'text-center': props.align === 'center',
      'text-right': props.align === 'right',
      'sticky left-0 bg-background z-5': props.sticky === 'left',
      'sticky right-0 bg-background z-5': props.sticky === 'right',
      'truncate': props.truncate
    }
  ]
})

const cellStyles = computed(() => {
  const styles: Record<string, string> = {}
  if (props.width) styles.width = props.width
  if (props.minWidth) styles.minWidth = props.minWidth
  if (props.maxWidth) styles.maxWidth = props.maxWidth
  return styles
})
</script>

<template>
  <th
    v-if="header"
    v-bind="$attrs"
    :class="cn(cellClasses, $attrs.class ?? '')"
    :style="cellStyles"
    :colspan="colspan"
    :rowspan="rowspan"
    scope="col"
  >
    <slot />
  </th>
  <td
    v-else
    v-bind="$attrs"
    :class="cn(cellClasses, $attrs.class ?? '')"
    :style="cellStyles"
    :colspan="colspan"
    :rowspan="rowspan"
  >
    <slot />
  </td>
</template>

<style scoped>
.s-table-th,
.s-table-td {
  color: var(--s-foreground);
}

.s-table-th {
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--s-muted-foreground);
  white-space: nowrap;
}

/* Size variants */
.s-table-cell-sm {
  padding: 0.5rem 0.75rem;
  font-size: 0.8125rem;
}

.s-table-cell-md {
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
}

.s-table-cell-lg {
  padding: 1rem 1.25rem;
  font-size: 0.9375rem;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
