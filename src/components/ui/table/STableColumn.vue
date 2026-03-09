<script setup lang="ts">
/**
 * STableColumn - Declarative column definition component
 * 
 * Use this component to define columns declaratively:
 * <SDataTable :data="data">
 *   <STableColumn key="name" label="Name" sortable />
 *   <STableColumn key="email" label="Email" />
 * </SDataTable>
 */
import { inject, onMounted, onUnmounted, watch } from 'vue'
import { SDataTableContextKey, type TableColumn, type ColumnAlign, type SortDirection } from './index'

interface Props {
  /** Unique column key (required) */
  columnKey: string
  /** Display label for header */
  label?: string
  /** Data accessor key */
  accessor?: string
  /** Column width */
  width?: string
  /** Minimum width */
  minWidth?: string
  /** Maximum width */
  maxWidth?: string
  /** Text alignment */
  align?: ColumnAlign
  /** Whether column is sortable */
  sortable?: boolean
  /** Whether column is visible */
  visible?: boolean
  /** Sticky position */
  sticky?: 'left' | 'right'
  /** Custom header class */
  headerClass?: string
  /** Custom cell class */
  cellClass?: string
  /** Render priority for responsive hiding */
  priority?: number
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  accessor: undefined,
  width: undefined,
  minWidth: undefined,
  maxWidth: undefined,
  align: 'left',
  sortable: false,
  visible: true,
  sticky: undefined,
  headerClass: '',
  cellClass: '',
  priority: 0
})

defineSlots<{
  /** Header cell content */
  header?: (props: { column: TableColumn; sortState: { column: string | null; direction: SortDirection } }) => unknown
  /** Cell content */
  default?: (props: { row: unknown; value: unknown; index: number }) => unknown
}>()

defineOptions({ inheritAttrs: false })

const context = inject(SDataTableContextKey)

// Build column definition
const buildColumn = (): TableColumn => ({
  key: props.columnKey,
  label: props.label,
  accessor: props.accessor as keyof unknown | undefined,
  width: props.width,
  minWidth: props.minWidth,
  maxWidth: props.maxWidth,
  align: props.align,
  sortable: props.sortable,
  visible: props.visible,
  sticky: props.sticky,
  headerClass: props.headerClass,
  cellClass: props.cellClass,
  priority: props.priority
})

// Register column with parent
onMounted(() => {
  if (context) {
    const existingIdx = context.columns.value.findIndex(c => c.key === props.columnKey)
    if (existingIdx === -1) {
      context.columns.value.push(buildColumn())
    }
  }
})

// Watch for prop changes
watch(() => props, () => {
  if (context) {
    const idx = context.columns.value.findIndex(c => c.key === props.columnKey)
    if (idx !== -1) {
      context.columns.value[idx] = buildColumn()
    }
  }
}, { deep: true })

// Unregister on unmount
onUnmounted(() => {
  if (context) {
    const idx = context.columns.value.findIndex(c => c.key === props.columnKey)
    if (idx !== -1) {
      context.columns.value.splice(idx, 1)
    }
  }
})
</script>

<template>
  <!-- This is a renderless component - slots are used by SDataTable -->
  <slot :row="undefined as unknown" :value="undefined as unknown" :index="0" />
</template>
