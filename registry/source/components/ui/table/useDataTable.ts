import { ref, computed, watch, shallowRef, type Ref, type ComputedRef } from 'vue'
import type { TableColumn, SortState, SortDirection, PaginationState } from './index'

// ============================================================================
// Types
// ============================================================================

export interface UseDataTableOptions<T> {
  /** Initial data */
  data?: T[] | Ref<T[]>
  /** Column definitions */
  columns?: TableColumn<T>[] | Ref<TableColumn<T>[]>
  /** Function to get unique key from row */
  rowKey?: keyof T | ((row: T, index: number) => string | number)
  /** Initial sort state */
  initialSort?: SortState
  /** Enable pagination */
  pagination?: boolean | Partial<PaginationState>
  /** Enable selection */
  selection?: boolean
  /** Enable multi-select */
  multiSelect?: boolean
  /** Enable row expansion */
  expandable?: boolean
  /** Async data loader */
  loader?: (params: DataLoaderParams) => Promise<DataLoaderResult<T>>
  /** Debounce delay for async operations */
  debounce?: number
}

export interface DataLoaderParams {
  page: number
  pageSize: number
  sort: SortState
  filters?: Record<string, unknown>
}

export interface DataLoaderResult<T> {
  data: T[]
  total: number
}

export interface UseDataTableReturn<T> {
  // Data
  data: Ref<T[]>
  processedData: ComputedRef<T[]>
  paginatedData: ComputedRef<T[]>
  
  // Columns
  columns: Ref<TableColumn<T>[]>
  visibleColumns: ComputedRef<TableColumn<T>[]>
  
  // Sort
  sortState: Ref<SortState>
  toggleSort: (columnKey: string) => void
  setSort: (columnKey: string, direction: SortDirection) => void
  clearSort: () => void
  
  // Selection
  selectedKeys: Ref<Set<string | number>>
  selectedRows: ComputedRef<T[]>
  toggleRowSelection: (key: string | number) => void
  selectRow: (key: string | number) => void
  deselectRow: (key: string | number) => void
  selectAll: () => void
  deselectAll: () => void
  toggleAllSelection: () => void
  isRowSelected: (key: string | number) => boolean
  isAllSelected: ComputedRef<boolean>
  isSomeSelected: ComputedRef<boolean>
  
  // Expansion
  expandedKeys: Ref<Set<string | number>>
  toggleRowExpansion: (key: string | number) => void
  expandRow: (key: string | number) => void
  collapseRow: (key: string | number) => void
  expandAll: () => void
  collapseAll: () => void
  isRowExpanded: (key: string | number) => boolean
  
  // Pagination
  pagination: Ref<PaginationState>
  totalPages: ComputedRef<number>
  goToPage: (page: number) => void
  nextPage: () => void
  prevPage: () => void
  setPageSize: (size: number) => void
  
  // Column visibility
  showColumn: (key: string) => void
  hideColumn: (key: string) => void
  toggleColumn: (key: string) => void
  setColumnVisibility: (key: string, visible: boolean) => void
  
  // Loading
  loading: Ref<boolean>
  error: Ref<Error | null>
  
  // Utilities
  getRowKey: (row: T, index: number) => string | number
  refresh: () => Promise<void>
  setData: (newData: T[]) => void
}

// ============================================================================
// Composable
// ============================================================================

export function useDataTable<T extends Record<string, unknown>>(
  options: UseDataTableOptions<T> = {}
): UseDataTableReturn<T> {
  // ─────────────────────────────────────────────────────────────────────────
  // Initialize refs
  // ─────────────────────────────────────────────────────────────────────────
  
  const rawData = shallowRef<T[]>(
    Array.isArray(options.data) ? options.data : (options.data?.value ?? [])
  )
  
  const columns = ref<TableColumn<T>[]>(
    Array.isArray(options.columns) ? options.columns : (options.columns?.value ?? [])
  ) as Ref<TableColumn<T>[]>
  
  const loading = ref(false)
  const error = ref<Error | null>(null)
  
  // Sort state
  const sortState = ref<SortState>(
    options.initialSort ?? { column: null, direction: null }
  )
  
  // Selection state
  const selectedKeys = ref<Set<string | number>>(new Set())
  
  // Expansion state
  const expandedKeys = ref<Set<string | number>>(new Set())
  
  // Pagination state
  const pagination = ref<PaginationState>({
    page: 1,
    pageSize: typeof options.pagination === 'object' ? (options.pagination.pageSize ?? 10) : 10,
    total: 0
  })
  
  // ─────────────────────────────────────────────────────────────────────────
  // Row key extraction
  // ─────────────────────────────────────────────────────────────────────────
  
  const getRowKey = (row: T, index: number): string | number => {
    if (!options.rowKey) {
      // Try common key fields
      if ('id' in row) return row.id as string | number
      if ('key' in row) return row.key as string | number
      if ('_id' in row) return row._id as string | number
      return index
    }
    
    if (typeof options.rowKey === 'function') {
      return options.rowKey(row, index)
    }
    
    return row[options.rowKey] as string | number
  }
  
  // ─────────────────────────────────────────────────────────────────────────
  // Visible columns
  // ─────────────────────────────────────────────────────────────────────────
  
  const visibleColumns = computed(() => {
    return columns.value.filter(col => col.visible !== false)
  })
  
  // ─────────────────────────────────────────────────────────────────────────
  // Sorting
  // ─────────────────────────────────────────────────────────────────────────
  
  const toggleSort = (columnKey: string) => {
    const column = columns.value.find(c => c.key === columnKey)
    if (!column?.sortable) return
    
    if (sortState.value.column !== columnKey) {
      sortState.value = { column: columnKey, direction: 'asc' }
    } else if (sortState.value.direction === 'asc') {
      sortState.value = { column: columnKey, direction: 'desc' }
    } else {
      sortState.value = { column: null, direction: null }
    }
  }
  
  const setSort = (columnKey: string, direction: SortDirection) => {
    sortState.value = { column: columnKey, direction }
  }
  
  const clearSort = () => {
    sortState.value = { column: null, direction: null }
  }
  
  // ─────────────────────────────────────────────────────────────────────────
  // Processed data (sorted)
  // ─────────────────────────────────────────────────────────────────────────
  
  const processedData = computed(() => {
    let result = [...rawData.value]
    
    // Apply sorting
    if (sortState.value.column && sortState.value.direction) {
      const column = columns.value.find(c => c.key === sortState.value.column)
      if (column) {
        result = [...result].sort((a, b) => {
          if (column.sortFn) {
            return column.sortFn(a, b, sortState.value.direction)
          }
          
          // Default sort
          const aVal = getCellValue(a, column)
          const bVal = getCellValue(b, column)
          
          let comparison = 0
          if (aVal === bVal) {
            comparison = 0
          } else if (aVal === null || aVal === undefined) {
            comparison = 1
          } else if (bVal === null || bVal === undefined) {
            comparison = -1
          } else if (typeof aVal === 'string' && typeof bVal === 'string') {
            comparison = aVal.localeCompare(bVal)
          } else {
            comparison = aVal < bVal ? -1 : 1
          }
          
          return sortState.value.direction === 'desc' ? -comparison : comparison
        })
      }
    }
    
    return result
  })
  
  // ─────────────────────────────────────────────────────────────────────────
  // Pagination
  // ─────────────────────────────────────────────────────────────────────────
  
  const totalPages = computed(() => {
    const total = pagination.value.total || processedData.value.length
    return Math.ceil(total / pagination.value.pageSize) || 1
  })
  
  const paginatedData = computed(() => {
    if (!options.pagination) return processedData.value
    
    const start = (pagination.value.page - 1) * pagination.value.pageSize
    const end = start + pagination.value.pageSize
    return processedData.value.slice(start, end)
  })
  
  const goToPage = (page: number) => {
    pagination.value.page = Math.max(1, Math.min(page, totalPages.value))
  }
  
  const nextPage = () => goToPage(pagination.value.page + 1)
  const prevPage = () => goToPage(pagination.value.page - 1)
  
  const setPageSize = (size: number) => {
    pagination.value.pageSize = size
    pagination.value.page = 1
  }
  
  // ─────────────────────────────────────────────────────────────────────────
  // Selection
  // ─────────────────────────────────────────────────────────────────────────
  
  const toggleRowSelection = (key: string | number) => {
    const newSet = new Set(selectedKeys.value)
    if (newSet.has(key)) {
      newSet.delete(key)
    } else {
      if (!options.multiSelect) {
        newSet.clear()
      }
      newSet.add(key)
    }
    selectedKeys.value = newSet
  }
  
  const selectRow = (key: string | number) => {
    const newSet = new Set(selectedKeys.value)
    if (!options.multiSelect) {
      newSet.clear()
    }
    newSet.add(key)
    selectedKeys.value = newSet
  }
  
  const deselectRow = (key: string | number) => {
    const newSet = new Set(selectedKeys.value)
    newSet.delete(key)
    selectedKeys.value = newSet
  }
  
  const selectAll = () => {
    if (!options.multiSelect) return
    const keys = processedData.value.map((row, i) => getRowKey(row, i))
    selectedKeys.value = new Set(keys)
  }
  
  const deselectAll = () => {
    selectedKeys.value = new Set()
  }
  
  const toggleAllSelection = () => {
    if (isAllSelected.value) {
      deselectAll()
    } else {
      selectAll()
    }
  }
  
  const isRowSelected = (key: string | number) => selectedKeys.value.has(key)
  
  const isAllSelected = computed(() => {
    if (processedData.value.length === 0) return false
    return processedData.value.every((row, i) => 
      selectedKeys.value.has(getRowKey(row, i))
    )
  })
  
  const isSomeSelected = computed(() => {
    return selectedKeys.value.size > 0 && !isAllSelected.value
  })
  
  const selectedRows = computed(() => {
    return processedData.value.filter((row, i) => 
      selectedKeys.value.has(getRowKey(row, i))
    )
  })
  
  // ─────────────────────────────────────────────────────────────────────────
  // Expansion
  // ─────────────────────────────────────────────────────────────────────────
  
  const toggleRowExpansion = (key: string | number) => {
    const newSet = new Set(expandedKeys.value)
    if (newSet.has(key)) {
      newSet.delete(key)
    } else {
      newSet.add(key)
    }
    expandedKeys.value = newSet
  }
  
  const expandRow = (key: string | number) => {
    const newSet = new Set(expandedKeys.value)
    newSet.add(key)
    expandedKeys.value = newSet
  }
  
  const collapseRow = (key: string | number) => {
    const newSet = new Set(expandedKeys.value)
    newSet.delete(key)
    expandedKeys.value = newSet
  }
  
  const expandAll = () => {
    const keys = processedData.value.map((row, i) => getRowKey(row, i))
    expandedKeys.value = new Set(keys)
  }
  
  const collapseAll = () => {
    expandedKeys.value = new Set()
  }
  
  const isRowExpanded = (key: string | number) => expandedKeys.value.has(key)
  
  // ─────────────────────────────────────────────────────────────────────────
  // Column visibility
  // ─────────────────────────────────────────────────────────────────────────
  
  const setColumnVisibility = (key: string, visible: boolean) => {
    const idx = columns.value.findIndex(c => c.key === key)
    if (idx !== -1) {
      columns.value[idx] = { ...columns.value[idx], visible }
    }
  }
  
  const showColumn = (key: string) => setColumnVisibility(key, true)
  const hideColumn = (key: string) => setColumnVisibility(key, false)
  const toggleColumn = (key: string) => {
    const col = columns.value.find(c => c.key === key)
    if (col) setColumnVisibility(key, col.visible === false)
  }
  
  // ─────────────────────────────────────────────────────────────────────────
  // Async loading
  // ─────────────────────────────────────────────────────────────────────────
  
  const refresh = async () => {
    if (!options.loader) return
    
    loading.value = true
    error.value = null
    
    try {
      const result = await options.loader({
        page: pagination.value.page,
        pageSize: pagination.value.pageSize,
        sort: sortState.value
      })
      
      rawData.value = result.data
      pagination.value.total = result.total
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e))
    } finally {
      loading.value = false
    }
  }
  
  const setData = (newData: T[]) => {
    rawData.value = newData
    pagination.value.total = newData.length
  }
  
  // Watch for external data changes
  if (options.data && !Array.isArray(options.data)) {
    watch(options.data, (newData) => {
      rawData.value = newData
      pagination.value.total = newData.length
    }, { deep: true })
  }
  
  // Watch for column changes
  if (options.columns && !Array.isArray(options.columns)) {
    watch(options.columns, (newCols) => {
      columns.value = newCols
    }, { deep: true })
  }
  
  // ─────────────────────────────────────────────────────────────────────────
  // Utilities
  // ─────────────────────────────────────────────────────────────────────────
  
  function getCellValue<T>(row: T, column: TableColumn<T>): unknown {
    if (typeof column.accessor === 'function') {
      return column.accessor(row, 0)
    }
    if (column.accessor) {
      return (row as Record<string, unknown>)[column.accessor as string]
    }
    return (row as Record<string, unknown>)[column.key]
  }
  
  // ─────────────────────────────────────────────────────────────────────────
  // Return
  // ─────────────────────────────────────────────────────────────────────────
  
  return {
    // Data
    data: rawData as Ref<T[]>,
    processedData,
    paginatedData,
    
    // Columns
    columns,
    visibleColumns,
    
    // Sort
    sortState,
    toggleSort,
    setSort,
    clearSort,
    
    // Selection
    selectedKeys,
    selectedRows,
    toggleRowSelection,
    selectRow,
    deselectRow,
    selectAll,
    deselectAll,
    toggleAllSelection,
    isRowSelected,
    isAllSelected,
    isSomeSelected,
    
    // Expansion
    expandedKeys,
    toggleRowExpansion,
    expandRow,
    collapseRow,
    expandAll,
    collapseAll,
    isRowExpanded,
    
    // Pagination
    pagination,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    setPageSize,
    
    // Column visibility
    showColumn,
    hideColumn,
    toggleColumn,
    setColumnVisibility,
    
    // Loading
    loading,
    error,
    
    // Utilities
    getRowKey,
    refresh,
    setData
  }
}

export default useDataTable
