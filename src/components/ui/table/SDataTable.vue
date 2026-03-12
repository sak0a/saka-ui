<script setup lang="ts" generic="T extends Record<string, unknown>">
/**
 * SDataTable - Production-ready Data Table Component
 * 
 * A highly customizable, accessible table with sorting, selection,
 * pagination, and smooth animations.
 */
import { provide, computed, toRef, watch, ref, type Ref, type ComputedRef } from 'vue'
import { cn } from '~/lib/utils'
import {
  SDataTableContextKey,
  type TableColumn,
  type TableVariant,
  type TableSize,
  type SelectionMode,
  type SortState
} from './index'
import { useDataTable } from './useDataTable'
import { SPagination } from '../pagination'

defineOptions({ inheritAttrs: false })

interface Props {
  /** Table data array */
  data?: T[]
  /** Column definitions */
  columns?: TableColumn<T>[]
  /** Row key accessor */
  rowKey?: keyof T | ((row: T, index: number) => string | number)
  /** Visual variant */
  variant?: TableVariant
  /** Size preset */
  size?: TableSize
  /** Selection mode */
  selectionMode?: SelectionMode
  /** Enable hoverable rows */
  hoverable?: boolean
  /** Enable sticky header */
  stickyHeader?: boolean
  /** Sticky header offset (for fixed navbars) */
  stickyOffset?: string
  /** Enable row animations */
  animateRows?: boolean
  /** Loading state */
  loading?: boolean
  /** Number of skeleton rows when loading */
  skeletonRows?: number
  /** Enable pagination */
  pagination?: boolean
  /** Page size options */
  pageSizeOptions?: number[]
  /** Initial page size */
  pageSize?: number
  /** Enable multi-select (requires selectionMode="multiple") */
  multiSelect?: boolean
  /** Initial sort state */
  initialSort?: SortState
  /** Custom table class */
  tableClass?: string
  /** Fixed table layout */
  fixedLayout?: boolean
  /** Max height for scrollable body */
  maxHeight?: string
  /** Empty state message */
  emptyMessage?: string
  /** Empty state icon */
  emptyIcon?: string
  /** Caption for accessibility */
  caption?: string
  /** Caption placement */
  captionSide?: 'top' | 'bottom'
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  columns: () => [],
  rowKey: undefined,
  variant: 'default',
  size: 'md',
  selectionMode: 'none',
  hoverable: true,
  stickyHeader: false,
  stickyOffset: '0px',
  animateRows: true,
  loading: false,
  skeletonRows: 5,
  pagination: false,
  pageSizeOptions: () => [10, 25, 50, 100],
  pageSize: 10,
  multiSelect: false,
  initialSort: undefined,
  tableClass: '',
  fixedLayout: false,
  maxHeight: undefined,
  emptyMessage: 'No data available',
  emptyIcon: 'mdi-table-off',
  caption: undefined,
  captionSide: 'top'
})

const emit = defineEmits<{
  'update:selected': [keys: (string | number)[]]
  'row-click': [row: T, index: number, event: MouseEvent]
  'row-dblclick': [row: T, index: number, event: MouseEvent]
  'sort-change': [state: SortState]
  'selection-change': [selectedRows: T[], selectedKeys: (string | number)[]]
  'page-change': [page: number]
  'page-size-change': [size: number]
  'expanded-change': [expandedKeys: (string | number)[]]
}>()

// Initialize the headless table logic
const table = useDataTable<T>({
  data: toRef(props, 'data'),
  columns: toRef(props, 'columns'),
  rowKey: props.rowKey,
  initialSort: props.initialSort,
  pagination: props.pagination ? { pageSize: props.pageSize } : false,
  multiSelect: props.multiSelect
})

// Sync loading state
const loadingRef = ref(props.loading)
watch(() => props.loading, (val) => {
  loadingRef.value = val
})

// Watch for external changes and emit events
watch(table.sortState, (state) => {
  emit('sort-change', state)
}, { deep: true })

watch(table.selectedKeys, () => {
  emit('selection-change', table.selectedRows.value, Array.from(table.selectedKeys.value))
  emit('update:selected', Array.from(table.selectedKeys.value))
}, { deep: true })

watch(table.expandedKeys, () => {
  emit('expanded-change', Array.from(table.expandedKeys.value))
}, { deep: true })

watch(() => table.pagination.value.page, (page) => {
  emit('page-change', page)
})

// Provide context to children
provide(SDataTableContextKey, {
  variant: props.variant,
  size: props.size,
  selectionMode: props.selectionMode,
  loading: loadingRef,
  hoverable: props.hoverable,
  stickyHeader: props.stickyHeader,
  animateRows: props.animateRows,
  columns: table.columns as Ref<TableColumn[]>,
  visibleColumns: table.visibleColumns as unknown as ComputedRef<TableColumn[]>,
  sortState: table.sortState,
  selectedKeys: table.selectedKeys,
  expandedKeys: table.expandedKeys,
  getRowKey: table.getRowKey as (row: unknown, index: number) => string | number,
  toggleSort: table.toggleSort,
  toggleRowSelection: table.toggleRowSelection,
  toggleAllSelection: table.toggleAllSelection,
  toggleRowExpansion: table.toggleRowExpansion,
  isRowSelected: table.isRowSelected,
  isRowExpanded: table.isRowExpanded,
  isAllSelected: table.isAllSelected,
  isSomeSelected: table.isSomeSelected,
  showColumn: table.showColumn,
  hideColumn: table.hideColumn,
  toggleColumn: table.toggleColumn
})

// Computed classes
const wrapperClasses = computed(() => {
  return [
    's-data-table-wrapper',
    'relative overflow-hidden rounded-xl',
    {
      'border border-border': props.variant === 'bordered',
    }
  ]
})

const tableClasses = computed(() => {
  const base = 'w-full border-collapse'
  
  const variants: Record<TableVariant, string> = {
    default: 's-table-default',
    compact: 's-table-compact',
    bordered: 's-table-bordered',
    striped: 's-table-striped',
    minimal: 's-table-minimal'
  }
  
  const sizes: Record<TableSize, string> = {
    sm: 's-table-sm',
    md: 's-table-md',
    lg: 's-table-lg'
  }
  
  return [
    base,
    variants[props.variant],
    sizes[props.size],
    props.tableClass,
    {
      'table-fixed': props.fixedLayout
    }
  ]
})

const containerStyles = computed(() => {
  const styles: Record<string, string> = {}
  if (props.maxHeight) {
    styles.maxHeight = props.maxHeight
    styles.overflowY = 'auto'
  }
  return styles
})

// Row click handlers
const handleRowClick = (row: T, index: number, event: MouseEvent) => {
  emit('row-click', row, index, event)
}

const handleRowDblClick = (row: T, index: number, event: MouseEvent) => {
  emit('row-dblclick', row, index, event)
}

// Helper to get cell value
function getCellValue(row: T, column: TableColumn<T>): unknown {
  if (typeof column.accessor === 'function') {
    return column.accessor(row, 0)
  }
  if (column.accessor) {
    return (row as Record<string, unknown>)[column.accessor as string]
  }
  return (row as Record<string, unknown>)[column.key]
}

// Expose table methods
defineExpose({
  ...table,
  refresh: table.refresh,
  selectAll: table.selectAll,
  deselectAll: table.deselectAll,
  expandAll: table.expandAll,
  collapseAll: table.collapseAll
})
</script>

<template>
  <div
    v-bind="$attrs"
    :class="cn(wrapperClasses, $attrs.class ?? '')"
    :style="containerStyles"
    role="region"
    :aria-busy="loading"
    aria-live="polite"
  >
    <!-- Toolbar slot -->
    <slot name="toolbar" :table="table" />
    
    <!-- Table container -->
    <div 
      class="s-table-container overflow-x-auto"
      :class="{ 's-table-scrollable': maxHeight }"
    >
      <table 
        :class="tableClasses"
        role="table"
      >
        <!-- Caption for accessibility -->
        <caption 
          v-if="caption" 
          class="sr-only"
          :style="{ captionSide }"
        >
          {{ caption }}
        </caption>
        
        <!-- Header slot or default -->
        <slot name="header" :columns="table.visibleColumns.value" :table="table">
          <thead 
            class="s-table-head"
            :class="{ 
              'sticky z-10': stickyHeader,
              'bg-background': stickyHeader
            }"
            :style="stickyHeader ? { top: stickyOffset } : {}"
          >
            <tr>
              <!-- Selection column -->
              <th 
                v-if="selectionMode !== 'none'"
                class="s-table-th s-table-th-select w-12"
                scope="col"
              >
                <slot name="select-header" :table="table">
                  <div 
                    v-if="selectionMode === 'multiple'" 
                    class="flex items-center justify-center"
                  >
                    <input
                      type="checkbox"
                      class="s-table-checkbox"
                      :checked="table.isAllSelected.value"
                      :indeterminate="table.isSomeSelected.value"
                      @change="table.toggleAllSelection()"
                      aria-label="Select all rows"
                    />
                  </div>
                </slot>
              </th>
              
              <!-- Column headers -->
              <th
                v-for="column in table.visibleColumns.value"
                :key="column.key"
                class="s-table-th"
                :class="[
                  column.headerClass,
                  {
                    's-table-th-sortable cursor-pointer select-none': column.sortable,
                    's-table-th-sorted': table.sortState.value.column === column.key,
                    'text-left': column.align === 'left' || !column.align,
                    'text-center': column.align === 'center',
                    'text-right': column.align === 'right',
                    'sticky left-0 z-5 bg-background': column.sticky === 'left',
                    'sticky right-0 z-5 bg-background': column.sticky === 'right'
                  }
                ]"
                :style="{
                  width: column.width,
                  minWidth: column.minWidth,
                  maxWidth: column.maxWidth
                }"
                scope="col"
                :aria-sort="
                  table.sortState.value.column === column.key 
                    ? (table.sortState.value.direction === 'asc' ? 'ascending' : 'descending')
                    : undefined
                "
                @click="column.sortable ? table.toggleSort(column.key) : undefined"
                @keydown.enter="column.sortable ? table.toggleSort(column.key) : undefined"
                @keydown.space.prevent="column.sortable ? table.toggleSort(column.key) : undefined"
                :tabindex="column.sortable ? 0 : undefined"
              >
                <slot 
                  :name="`header-${column.key}`" 
                  :column="column"
                  :sort-state="table.sortState.value"
                >
                  <div class="flex items-center gap-2" :class="{ 'justify-center': column.align === 'center', 'justify-end': column.align === 'right' }">
                    <span>{{ column.label || column.key }}</span>
                    
                    <!-- Sort indicator -->
                    <span 
                      v-if="column.sortable"
                      class="s-table-sort-icon inline-flex flex-col text-xs leading-none opacity-40 transition-opacity"
                      :class="{ 'opacity-100': table.sortState.value.column === column.key }"
                    >
                      <span 
                        class="mdi mdi-chevron-up transition-transform"
                        :class="{ 
                          'text-primary': table.sortState.value.column === column.key && table.sortState.value.direction === 'asc',
                          '-mb-1.5': true
                        }"
                      />
                      <span 
                        class="mdi mdi-chevron-down transition-transform"
                        :class="{ 
                          'text-primary': table.sortState.value.column === column.key && table.sortState.value.direction === 'desc'
                        }"
                      />
                    </span>
                  </div>
                </slot>
              </th>
              
              <!-- Actions column -->
              <th 
                v-if="$slots['row-actions']" 
                class="s-table-th s-table-th-actions"
                scope="col"
              >
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
        </slot>
        
        <!-- Body -->
        <tbody class="s-table-body">
          <!-- Loading state -->
          <template v-if="loading">
            <slot name="loading" :skeleton-rows="skeletonRows">
              <tr 
                v-for="i in skeletonRows" 
                :key="`skeleton-${i}`"
                class="s-table-row s-table-row-skeleton"
              >
                <td 
                  v-if="selectionMode !== 'none'"
                  class="s-table-td"
                >
                  <div class="s-skeleton w-4 h-4 rounded" />
                </td>
                <td 
                  v-for="column in table.visibleColumns.value"
                  :key="column.key"
                  class="s-table-td"
                >
                  <div class="s-skeleton h-4 rounded" :style="{ width: `${60 + Math.random() * 40}%` }" />
                </td>
                <td v-if="$slots['row-actions']" class="s-table-td">
                  <div class="s-skeleton w-8 h-4 rounded" />
                </td>
              </tr>
            </slot>
          </template>
          
          <!-- Empty state -->
          <template v-else-if="table.paginatedData.value.length === 0">
            <tr>
              <td 
                :colspan="table.visibleColumns.value.length + (selectionMode !== 'none' ? 1 : 0) + ($slots['row-actions'] ? 1 : 0)"
                class="s-table-td"
              >
                <slot name="empty">
                  <div class="s-table-empty flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <span :class="['mdi', emptyIcon, 'text-4xl mb-3 opacity-50']" />
                    <p class="text-sm">{{ emptyMessage }}</p>
                  </div>
                </slot>
              </td>
            </tr>
          </template>
          
          <!-- Data rows - using key on the wrapper to force clean re-render on page change -->
          <template v-else v-for="(row, index) in table.paginatedData.value" :key="`${table.pagination.value.page}-${table.getRowKey(row, index)}`">
            <tr
              class="s-table-row"
              :class="{
                's-table-row-hoverable': hoverable,
                's-table-row-selected': table.isRowSelected(table.getRowKey(row, index)),
                's-table-row-expanded': table.isRowExpanded(table.getRowKey(row, index)),
                's-table-row-even': index % 2 === 1 && variant === 'striped'
              }"
              :data-row-key="table.getRowKey(row, index)"
              :aria-selected="selectionMode !== 'none' ? table.isRowSelected(table.getRowKey(row, index)) : undefined"
              @click="handleRowClick(row, index, $event)"
              @dblclick="handleRowDblClick(row, index, $event)"
            >
              <!-- Selection cell -->
              <td 
                v-if="selectionMode !== 'none'"
                class="s-table-td s-table-td-select"
                @click.stop
              >
                <slot 
                  name="select-cell" 
                  :row="row" 
                  :index="index" 
                  :selected="table.isRowSelected(table.getRowKey(row, index))"
                  :toggle="() => table.toggleRowSelection(table.getRowKey(row, index))"
                >
                  <div class="flex items-center justify-center">
                    <input
                      :type="selectionMode === 'multiple' ? 'checkbox' : 'radio'"
                      class="s-table-checkbox"
                      :checked="table.isRowSelected(table.getRowKey(row, index))"
                      @change="table.toggleRowSelection(table.getRowKey(row, index))"
                      :aria-label="`Select row ${index + 1}`"
                    />
                  </div>
                </slot>
              </td>
              
              <!-- Data cells -->
              <td
                v-for="column in table.visibleColumns.value"
                :key="column.key"
                class="s-table-td"
                :class="[
                  column.cellClass,
                  {
                    'text-left': column.align === 'left' || !column.align,
                    'text-center': column.align === 'center',
                    'text-right': column.align === 'right',
                    'sticky left-0 bg-background': column.sticky === 'left',
                    'sticky right-0 bg-background': column.sticky === 'right'
                  }
                ]"
                :style="{
                  width: column.width,
                  minWidth: column.minWidth,
                  maxWidth: column.maxWidth
                }"
              >
                <slot 
                  :name="`cell-${column.key}`"
                  :row="row"
                  :column="column"
                  :index="index"
                  :value="getCellValue(row, column)"
                >
                  {{ getCellValue(row, column) }}
                </slot>
              </td>
              
              <!-- Actions cell -->
              <td 
                v-if="$slots['row-actions']" 
                class="s-table-td s-table-td-actions"
                @click.stop
              >
                <slot name="row-actions" :row="row" :index="index" />
              </td>
            </tr>
            
            <!-- Expanded content row -->
            <tr 
              v-if="table.isRowExpanded(table.getRowKey(row, index)) && $slots['expanded']"
              :key="`expanded-${table.pagination.value.page}-${table.getRowKey(row, index)}`"
              class="s-table-row-expansion"
            >
              <td 
                :colspan="table.visibleColumns.value.length + (selectionMode !== 'none' ? 1 : 0) + ($slots['row-actions'] ? 1 : 0)"
                class="s-table-td-expansion"
              >
                <slot name="expanded" :row="row" :index="index" />
              </td>
            </tr>
          </template>
        </tbody>
        
        <!-- Footer -->
        <slot name="footer" :table="table" />
      </table>
    </div>
    
    <!-- Pagination slot -->
    <slot
      name="pagination"
      :table="table"
      :page="table.pagination.value.page"
      :page-size="table.pagination.value.pageSize"
      :total="table.pagination.value.total || table.processedData.value.length"
      :total-pages="table.totalPages.value"
      :go-to-page="table.goToPage"
      :next-page="table.nextPage"
      :prev-page="table.prevPage"
      :set-page-size="(size: number) => { table.setPageSize(size); emit('page-size-change', size) }"
    >
      <SPagination
        v-if="pagination && !loading && table.paginatedData.value.length > 0"
        :model-value="table.pagination.value.page"
        :total="table.pagination.value.total || table.processedData.value.length"
        :page-size="table.pagination.value.pageSize"
        :page-size-options="pageSizeOptions"
        show-total
        show-page-size
        show-first-last
        size="sm"
        class="px-4 py-3 border-t border-border justify-between"
        @update:model-value="(page: number) => { table.goToPage(page); emit('page-change', page) }"
        @update:page-size="(size: number) => { table.setPageSize(size); emit('page-size-change', size) }"
      />
    </slot>
    
    <!-- Loading overlay -->
    <Transition name="fade">
      <div 
        v-if="loading && table.paginatedData.value.length > 0"
        class="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-20"
      >
        <div class="flex items-center gap-3">
          <span class="mdi mdi-loading animate-spin text-xl text-primary" />
          <span class="text-sm text-muted-foreground">Loading...</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* ===== CSS Variables ===== */
.s-data-table-wrapper {
  --table-header-bg: var(--s-muted);
  --table-row-hover: var(--s-accent);
  --table-row-selected: color-mix(in srgb, var(--s-primary) 15%, transparent);
  --table-border-color: var(--s-border);
}

/* ===== Base Table Styles ===== */
.s-table-head {
  background-color: var(--table-header-bg);
}

.s-table-th {
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--s-muted-foreground);
  white-space: nowrap;
}

.s-table-td {
  color: var(--s-foreground);
}

/* ===== Size Variants ===== */
.s-table-sm .s-table-th,
.s-table-sm .s-table-td {
  padding: 0.5rem 0.75rem;
  font-size: 0.8125rem;
}

.s-table-md .s-table-th,
.s-table-md .s-table-td {
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
}

.s-table-lg .s-table-th,
.s-table-lg .s-table-td {
  padding: 1rem 1.25rem;
  font-size: 0.9375rem;
}

/* ===== Variant Styles ===== */

/* Default */
.s-table-default .s-table-row {
  border-bottom: 1px solid var(--table-border-color);
}

/* Compact */
.s-table-compact .s-table-th,
.s-table-compact .s-table-td {
  padding: 0.375rem 0.5rem;
}

/* Bordered */
.s-table-bordered .s-table-th,
.s-table-bordered .s-table-td {
  border: 1px solid var(--table-border-color);
}

/* Striped */
.s-table-striped .s-table-row-even {
  background-color: var(--s-muted);
}

/* Minimal */
.s-table-minimal .s-table-head {
  background-color: transparent;
  border-bottom: 2px solid var(--table-border-color);
}

.s-table-minimal .s-table-th {
  font-weight: 500;
  text-transform: none;
  letter-spacing: normal;
}

/* ===== Row States ===== */
.s-table-row-hoverable {
  transition: background-color 0.15s ease;
}

.s-table-row-hoverable:hover {
  background-color: var(--table-row-hover);
}

.s-table-row-selected {
  background-color: var(--table-row-selected) !important;
}

.s-table-row-selected:hover {
  background-color: var(--table-row-selected) !important;
}

/* ===== Sortable Header ===== */
.s-table-th-sortable {
  transition: background-color 0.15s ease;
}

.s-table-th-sortable:hover {
  background-color: var(--s-accent);
}

.s-table-th-sortable:focus-visible {
  outline: 2px solid var(--s-primary);
  outline-offset: -2px;
}

/* ===== Checkbox ===== */
.s-table-checkbox {
  width: 1rem;
  height: 1rem;
  accent-color: var(--s-primary);
  cursor: pointer;
}

.s-table-checkbox:focus-visible {
  outline: 2px solid var(--s-primary);
  outline-offset: 2px;
}

/* ===== Skeleton Loading ===== */
.s-skeleton {
  background: linear-gradient(
    90deg,
    var(--s-accent) 25%,
    var(--s-muted) 50%,
    var(--s-accent) 75%
  );
  background-size: 200% 100%;
  animation: s-skeleton-shimmer 1.5s infinite;
}

@keyframes s-skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* ===== Row Animation ===== */
.s-table-row-enter-active,
.s-table-row-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.s-table-row-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.s-table-row-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.s-table-row-move {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ===== Fade Transition ===== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ===== Expansion Row ===== */
.s-table-td-expansion {
  padding: 1rem;
  background-color: var(--s-muted);
}

/* ===== Reduced Motion ===== */
@media (prefers-reduced-motion: reduce) {
  .s-table-row-enter-active,
  .s-table-row-leave-active,
  .s-table-row-move {
    transition: none;
  }
  
  .s-skeleton {
    animation: none;
    background: var(--s-accent);
  }
}

/* ===== Scrollable Container ===== */
.s-table-scrollable {
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--s-border) transparent;
}

.s-table-scrollable::-webkit-scrollbar {
  width: 6px;
}

.s-table-scrollable::-webkit-scrollbar-track {
  background: transparent;
}

.s-table-scrollable::-webkit-scrollbar-thumb {
  background-color: var(--s-border);
  border-radius: 3px;
}


/* ===== Screen Reader Only ===== */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
