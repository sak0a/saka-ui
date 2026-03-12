import type { InjectionKey, Ref, ComputedRef } from 'vue'

// ============================================================================
// Types
// ============================================================================

/** Table design variants */
export type TableVariant = 'default' | 'compact' | 'bordered' | 'striped' | 'minimal'

/** Table size presets */
export type TableSize = 'sm' | 'md' | 'lg'

/** Sort direction */
export type SortDirection = 'asc' | 'desc' | null

/** Column alignment */
export type ColumnAlign = 'left' | 'center' | 'right'

/** Selection mode */
export type SelectionMode = 'none' | 'single' | 'multiple'

/** Column definition */
export interface TableColumn<T = unknown> {
  /** Unique key for the column */
  key: string
  /** Display label for header */
  label?: string
  /** Data accessor - can be a key of T or a function */
  accessor?: keyof T | ((row: T, index: number) => unknown)
  /** Column width (CSS value) */
  width?: string
  /** Minimum width */
  minWidth?: string
  /** Maximum width */
  maxWidth?: string
  /** Text alignment */
  align?: ColumnAlign
  /** Whether column is sortable */
  sortable?: boolean
  /** Custom sort function */
  sortFn?: (a: T, b: T, direction: SortDirection) => number
  /** Whether column is visible */
  visible?: boolean
  /** Sticky column position */
  sticky?: 'left' | 'right'
  /** Custom header class */
  headerClass?: string
  /** Custom cell class */
  cellClass?: string
  /** Render priority for responsive hiding */
  priority?: number
}

/** Sort state */
export interface SortState {
  column: string | null
  direction: SortDirection
}

/** Pagination state */
export interface PaginationState {
  page: number
  pageSize: number
  total: number
}

/** Row data with meta */
export interface TableRowData<T = unknown> {
  data: T
  index: number
  originalIndex: number
  selected: boolean
  expanded: boolean
}

/** Context provided to table children */
export interface SDataTableContext<T = unknown> {
  // Config
  variant: TableVariant
  size: TableSize
  selectionMode: SelectionMode
  loading: Ref<boolean>
  hoverable: boolean
  stickyHeader: boolean
  animateRows: boolean
  
  // State
  columns: Ref<TableColumn<T>[]>
  visibleColumns: ComputedRef<TableColumn<T>[]>
  sortState: Ref<SortState>
  selectedKeys: Ref<Set<string | number>>
  expandedKeys: Ref<Set<string | number>>
  
  // Methods
  getRowKey: (row: T, index: number) => string | number
  toggleSort: (column: string) => void
  toggleRowSelection: (key: string | number) => void
  toggleAllSelection: () => void
  toggleRowExpansion: (key: string | number) => void
  isRowSelected: (key: string | number) => boolean
  isRowExpanded: (key: string | number) => boolean
  isAllSelected: ComputedRef<boolean>
  isSomeSelected: ComputedRef<boolean>
  
  // Column management
  showColumn: (key: string) => void
  hideColumn: (key: string) => void
  toggleColumn: (key: string) => void
}

// Injection key
export const SDataTableContextKey: InjectionKey<SDataTableContext> = Symbol('SDataTableContext')

// ============================================================================
// Re-exports
// ============================================================================

export { default as SDataTable } from './SDataTable.vue'
export { default as STableHeader } from './STableHeader.vue'
export { default as STableBody } from './STableBody.vue'
export { default as STableRow } from './STableRow.vue'
export { default as STableCell } from './STableCell.vue'
export { default as STableColumn } from './STableColumn.vue'
export { default as STableSkeleton } from './STableSkeleton.vue'
export { default as STableEmpty } from './STableEmpty.vue'
export { useDataTable } from './useDataTable'
