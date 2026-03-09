<script setup lang="ts">
import { ref, computed } from 'vue'
import { SDataTable, SPagination, SButton, SChip, SApiSection, SApiTable, SApiKeyboard } from '../../index'
import type { ApiProp, ApiEvent, ApiSlot, KeyboardShortcut, TableColumn } from '../../index'
import DemoSection from '../../components/DemoSection.vue'

// ============================================================================
// Sample Data
// ============================================================================

interface User {
  [key: string]: unknown
  id: number
  name: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'pending'
  department: string
  joinDate: string
  salary: number
}

const sampleUsers: User[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'active', department: 'Engineering', joinDate: '2023-01-15', salary: 95000 },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Developer', status: 'active', department: 'Engineering', joinDate: '2023-03-22', salary: 82000 },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Designer', status: 'inactive', department: 'Design', joinDate: '2022-11-08', salary: 75000 },
  { id: 4, name: 'David Brown', email: 'david@example.com', role: 'Manager', status: 'active', department: 'Product', joinDate: '2021-06-01', salary: 110000 },
  { id: 5, name: 'Eva Martinez', email: 'eva@example.com', role: 'Developer', status: 'pending', department: 'Engineering', joinDate: '2024-01-02', salary: 78000 },
  { id: 6, name: 'Frank Lee', email: 'frank@example.com', role: 'QA', status: 'active', department: 'Engineering', joinDate: '2023-07-18', salary: 72000 },
  { id: 7, name: 'Grace Kim', email: 'grace@example.com', role: 'Designer', status: 'active', department: 'Design', joinDate: '2023-09-05', salary: 80000 },
  { id: 8, name: 'Henry Wilson', email: 'henry@example.com', role: 'Developer', status: 'inactive', department: 'Engineering', joinDate: '2022-04-12', salary: 88000 },
]

// Extended data for pagination demo
const extendedUsers = computed(() => {
  const result: User[] = []
  for (let i = 0; i < 5; i++) {
    sampleUsers.forEach((user, idx) => {
      result.push({
        ...user,
        id: i * sampleUsers.length + idx + 1,
        name: `${user.name}${i > 0 ? ` ${i + 1}` : ''}`,
        email: user.email.replace('@', `${i > 0 ? i + 1 : ''}@`)
      })
    })
  }
  return result
})

// ============================================================================
// Demo States
// ============================================================================

// Basic columns
const basicColumns: TableColumn<User>[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'status', label: 'Status' }
]

// Sortable columns
const sortableColumns: TableColumn<User>[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'department', label: 'Department', sortable: true },
  { key: 'salary', label: 'Salary', sortable: true, align: 'right' }
]

// Full columns
const fullColumns: TableColumn<User>[] = [
  { key: 'id', label: 'ID', width: '60px', align: 'center' },
  { key: 'name', label: 'Name', sortable: true, minWidth: '150px' },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'department', label: 'Dept', sortable: true },
  { key: 'status', label: 'Status', align: 'center' },
  { key: 'joinDate', label: 'Join Date', sortable: true },
  { key: 'salary', label: 'Salary', sortable: true, align: 'right' }
]

// Selection
const selectedKeys = ref<(string | number)[]>([])

// Loading states
const isLoading = ref(false)
const simulateLoading = () => {
  isLoading.value = true
  setTimeout(() => { isLoading.value = false }, 2000)
}

// Empty state
const emptyData = ref<User[]>([])

// ============================================================================
// Code Snippets
// ============================================================================

const basicCode = `<script setup>
import { SDataTable } from 'saka-ui'

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' }
]

const data = [
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Admin' },
  { id: 2, name: 'Bob', email: 'bob@example.com', role: 'User' }
]
<\/script>

<template>
  <SDataTable :data="data" :columns="columns" />
</template>`

const variantsCode = `<!-- Default -->
<SDataTable variant="default" :data="data" :columns="columns" />

<!-- Compact -->
<SDataTable variant="compact" :data="data" :columns="columns" />

<!-- Bordered -->
<SDataTable variant="bordered" :data="data" :columns="columns" />

<!-- Striped -->
<SDataTable variant="striped" :data="data" :columns="columns" />

<!-- Minimal -->
<SDataTable variant="minimal" :data="data" :columns="columns" />`

const selectionCode = `<script setup>
import { ref } from 'vue'
const selectedKeys = ref([])
<\/script>

<template>
  <SDataTable 
    :data="data" 
    :columns="columns"
    selection-mode="multiple"
    v-model:selected="selectedKeys"
    @selection-change="(rows, keys) => console.log('Selected:', keys)"
  />
</template>`

const sortingCode = `const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { 
    key: 'salary', 
    label: 'Salary', 
    sortable: true,
    sortFn: (a, b, dir) => {
      const diff = a.salary - b.salary
      return dir === 'desc' ? -diff : diff
    }
  }
]

<SDataTable 
  :data="data" 
  :columns="columns"
  :initial-sort="{ column: 'name', direction: 'asc' }"
  @sort-change="(state) => console.log('Sort:', state)"
/>`

const customCellsCode = `<SDataTable :data="data" :columns="columns">
  <!-- Custom cell for status column -->
  <template #cell-status="{ value }">
    <SChip
      :color="value === 'active' ? 'success' : 'danger'"
      size="small"
    >
      {{ value }}
    </SChip>
  </template>
  
  <!-- Row actions -->
  <template #row-actions="{ row }">
    <SButton size="small" variant="ghost" @click="edit(row)">
      <span class="mdi mdi-pencil" />
    </SButton>
    <SButton size="small" variant="ghost" color="danger" @click="remove(row)">
      <span class="mdi mdi-delete" />
    </SButton>
  </template>
</SDataTable>`

const paginationCode = `<!-- Default: uses SPagination internally -->
<SDataTable
  :data="largeDataset"
  :columns="columns"
  pagination
  :page-size="10"
  :page-size-options="[10, 25, 50, 100]"
  @page-change="(page) => console.log('Page:', page)"
  @page-size-change="(size) => console.log('Size:', size)"
/>

<!-- Custom: override the pagination slot with your own SPagination -->
<SDataTable :data="data" :columns="columns" pagination>
  <template #pagination="{ page, total, pageSize, goToPage, setPageSize }">
    <SPagination
      :model-value="page"
      :total="total"
      :page-size="pageSize"
      show-total
      show-page-size
      show-first-last
      show-quick-jump
      @update:model-value="goToPage"
      @update:page-size="setPageSize"
    />
  </template>
</SDataTable>`

const loadingCode = `<SDataTable 
  :data="data" 
  :columns="columns"
  :loading="isLoading"
  :skeleton-rows="5"
/>

<!-- Or control the skeleton via slot -->
<SDataTable :data="data" :columns="columns" :loading="isLoading">
  <template #loading="{ skeletonRows }">
    <STableSkeleton :rows="skeletonRows" animation="pulse" />
  </template>
</SDataTable>`

const emptyCode = `<SDataTable :data="[]" :columns="columns">
  <template #empty>
    <div class="flex flex-col items-center py-12">
      <span class="mdi mdi-folder-open-outline text-4xl opacity-40 mb-3" />
      <p>No records found</p>
      <SButton size="small" class="mt-4">Add First Record</SButton>
    </div>
  </template>
</SDataTable>`

const stickyHeaderCode = `<SDataTable 
  :data="data" 
  :columns="columns"
  sticky-header
  sticky-offset="64px"
  max-height="400px"
/>`

const headlessCode = `<script setup>
import { useDataTable } from 'saka-ui'

const { 
  processedData,
  sortState,
  toggleSort,
  selectedKeys,
  toggleRowSelection,
  pagination,
  goToPage
} = useDataTable({
  data: myData,
  columns: myColumns,
  rowKey: 'id',
  pagination: { pageSize: 10 }
})
<\/script>

<!-- Build your own table UI using the composable -->
<template>
  <table>
    <thead>
      <tr>
        <th @click="toggleSort('name')">Name</th>
        <th @click="toggleSort('email')">Email</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in processedData" :key="row.id">
        <td>{{ row.name }}</td>
        <td>{{ row.email }}</td>
      </tr>
    </tbody>
  </table>
</template>`

// ============================================================================
// API Documentation
// ============================================================================

const tableProps: ApiProp[] = [
  { name: 'data', type: 'T[]', default: '[]', description: 'Array of row data objects' },
  { name: 'columns', type: 'TableColumn<T>[]', default: '[]', description: 'Column definitions array' },
  { name: 'rowKey', type: 'keyof T | ((row, index) => string | number)', default: '"id"', description: 'Unique key accessor for rows' },
  { name: 'variant', type: "'default' | 'compact' | 'bordered' | 'striped' | 'minimal'", default: "'default'", description: 'Visual style variant' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size preset for padding and typography' },
  { name: 'selectionMode', type: "'none' | 'single' | 'multiple'", default: "'none'", description: 'Row selection mode' },
  { name: 'hoverable', type: 'boolean', default: 'true', description: 'Enable hover effect on rows' },
  { name: 'stickyHeader', type: 'boolean', default: 'false', description: 'Make header sticky on scroll' },
  { name: 'stickyOffset', type: 'string', default: "'0px'", description: 'Top offset for sticky header' },
  { name: 'animateRows', type: 'boolean', default: 'true', description: 'Animate row insertion/removal' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Show loading skeleton state' },
  { name: 'skeletonRows', type: 'number', default: '5', description: 'Number of skeleton rows when loading' },
  { name: 'pagination', type: 'boolean', default: 'false', description: 'Enable pagination' },
  { name: 'pageSize', type: 'number', default: '10', description: 'Initial page size' },
  { name: 'pageSizeOptions', type: 'number[]', default: '[10, 25, 50, 100]', description: 'Available page size options' },
  { name: 'multiSelect', type: 'boolean', default: 'false', description: 'Enable multi-select (requires selectionMode="multiple")' },
  { name: 'initialSort', type: 'SortState', default: 'undefined', description: 'Initial sort state' },
  { name: 'tableClass', type: 'string', default: "''", description: 'Custom classes for the table element' },
  { name: 'fixedLayout', type: 'boolean', default: 'false', description: 'Enable fixed table layout' },
  { name: 'maxHeight', type: 'string', default: 'undefined', description: 'Max height for scrollable body' },
  { name: 'emptyMessage', type: 'string', default: "'No data available'", description: 'Message shown when data is empty' },
  { name: 'emptyIcon', type: 'string', default: "'mdi-table-off'", description: 'Icon shown in empty state' },
  { name: 'caption', type: 'string', default: 'undefined', description: 'Accessible caption for the table' },
  { name: 'captionSide', type: "'top' | 'bottom'", default: "'top'", description: 'Caption placement' }
]

const columnProps: ApiProp[] = [
  { name: 'key', type: 'string', default: '-', required: true, description: 'Unique column identifier' },
  { name: 'label', type: 'string', default: 'key', description: 'Header display text' },
  { name: 'accessor', type: 'keyof T | ((row, index) => unknown)', default: 'key', description: 'Data accessor function or key' },
  { name: 'width', type: 'string', default: 'undefined', description: 'Column width (CSS value)' },
  { name: 'minWidth', type: 'string', default: 'undefined', description: 'Minimum column width' },
  { name: 'maxWidth', type: 'string', default: 'undefined', description: 'Maximum column width' },
  { name: 'align', type: "'left' | 'center' | 'right'", default: "'left'", description: 'Cell text alignment' },
  { name: 'sortable', type: 'boolean', default: 'false', description: 'Enable sorting for this column' },
  { name: 'sortFn', type: '(a, b, direction) => number', default: 'undefined', description: 'Custom sort comparison function' },
  { name: 'visible', type: 'boolean', default: 'true', description: 'Column visibility' },
  { name: 'sticky', type: "'left' | 'right'", default: 'undefined', description: 'Sticky column position' },
  { name: 'headerClass', type: 'string', default: 'undefined', description: 'Custom class for header cell' },
  { name: 'cellClass', type: 'string', default: 'undefined', description: 'Custom class for data cells' }
]

const tableEvents: ApiEvent[] = [
  { name: 'row-click', payload: '(row: T, index: number, event: MouseEvent)', description: 'Emitted when a row is clicked' },
  { name: 'row-dblclick', payload: '(row: T, index: number, event: MouseEvent)', description: 'Emitted when a row is double-clicked' },
  { name: 'sort-change', payload: '(state: SortState)', description: 'Emitted when sort state changes' },
  { name: 'selection-change', payload: '(rows: T[], keys: (string | number)[])', description: 'Emitted when selection changes' },
  { name: 'update:selected', payload: '(keys: (string | number)[])', description: 'v-model binding for selected keys' },
  { name: 'page-change', payload: '(page: number)', description: 'Emitted when page changes' },
  { name: 'page-size-change', payload: '(size: number)', description: 'Emitted when page size changes' },
  { name: 'expanded-change', payload: '(keys: (string | number)[])', description: 'Emitted when expanded rows change' }
]

const tableSlots: ApiSlot[] = [
  { name: 'toolbar', description: 'Content above the table (search, filters, etc.)', props: '{ table }' },
  { name: 'header', description: 'Custom table header content', props: '{ columns, table }' },
  { name: 'header-{key}', description: 'Custom header cell for specific column', props: '{ column, sortState }' },
  { name: 'cell-{key}', description: 'Custom cell content for specific column', props: '{ row, column, index, value }' },
  { name: 'row-actions', description: 'Action buttons for each row', props: '{ row, index }' },
  { name: 'select-header', description: 'Custom select-all header content', props: '{ table }' },
  { name: 'select-cell', description: 'Custom selection cell content', props: '{ row, index, selected, toggle }' },
  { name: 'expanded', description: 'Expanded row content', props: '{ row, index }' },
  { name: 'loading', description: 'Custom loading state', props: '{ skeletonRows }' },
  { name: 'empty', description: 'Custom empty state', props: '-' },
  { name: 'pagination', description: 'Custom pagination controls', props: '{ table, page, pageSize, total, totalPages, ... }' },
  { name: 'footer', description: 'Table footer content', props: '{ table }' }
]

const headerProps: ApiProp[] = [
  { name: 'headerClass', type: 'string', default: "''", description: 'Additional CSS class for the generated <thead> element' }
]

const headerSlots: ApiSlot[] = [
  { name: 'default', description: 'Override the full header row markup', props: '-' },
  { name: 'header-{columnKey}', description: 'Customize a generated header cell for a specific column. For headless column definitions with explicit sort state, use the `header` slot on `STableColumn`.', props: '{ column }' }
]

const bodyProps: ApiProp[] = [
  { name: 'animate', type: 'boolean', default: 'inherits animateRows', description: 'Override row transition animations for this tbody' },
  { name: 'bodyClass', type: 'string', default: "''", description: 'Additional CSS class for the <tbody> element' }
]

const bodySlots: ApiSlot[] = [
  { name: 'default', description: 'Row content rendered inside the table body' }
]

const rowProps: ApiProp[] = [
  { name: 'rowKey', type: 'string | number', default: 'undefined', description: 'Unique key used for selection and expansion state' },
  { name: 'hoverable', type: 'boolean', default: 'inherits table hoverable', description: 'Override hover styling for this row' },
  { name: 'rowClass', type: 'string', default: "''", description: 'Additional CSS class for the <tr> element' },
  { name: 'index', type: 'number', default: '0', description: 'Zero-based row index used for striped styles' }
]

const rowEvents: ApiEvent[] = [
  { name: 'click', payload: 'MouseEvent', description: 'Emitted when the row is clicked' },
  { name: 'dblclick', payload: 'MouseEvent', description: 'Emitted when the row is double-clicked' }
]

const rowSlots: ApiSlot[] = [
  { name: 'default', description: 'Cells rendered inside the row' }
]

const cellProps: ApiProp[] = [
  { name: 'align', type: "'left' | 'center' | 'right'", default: "'left'", description: 'Horizontal alignment for the cell content' },
  { name: 'cellClass', type: 'string', default: "''", description: 'Additional CSS class for the rendered cell' },
  { name: 'columnKey', type: 'string', default: 'undefined', description: 'Column key used to inherit table column settings' },
  { name: 'header', type: 'boolean', default: 'false', description: 'Render a <th> instead of a <td>' },
  { name: 'colspan', type: 'number', default: 'undefined', description: 'HTML colspan value' },
  { name: 'rowspan', type: 'number', default: 'undefined', description: 'HTML rowspan value' },
  { name: 'width', type: 'string', default: 'undefined', description: 'Explicit width for the cell' },
  { name: 'minWidth', type: 'string', default: 'undefined', description: 'Minimum width for the cell' },
  { name: 'maxWidth', type: 'string', default: 'undefined', description: 'Maximum width for the cell' },
  { name: 'sticky', type: "'left' | 'right'", default: 'undefined', description: 'Stick the cell to one table edge' },
  { name: 'truncate', type: 'boolean', default: 'false', description: 'Apply single-line truncation styles' }
]

const cellSlots: ApiSlot[] = [
  { name: 'default', description: 'Cell content' }
]

const tableColumnProps: ApiProp[] = [
  { name: 'columnKey', type: 'string', default: '-', required: true, description: 'Unique column key used by the table context' },
  { name: 'label', type: 'string', default: 'undefined', description: 'Display label for the generated header cell' },
  { name: 'accessor', type: 'string', default: 'undefined', description: 'Property name used to read the cell value from each row' },
  { name: 'width', type: 'string', default: 'undefined', description: 'Preferred width for the column' },
  { name: 'minWidth', type: 'string', default: 'undefined', description: 'Minimum width for the column' },
  { name: 'maxWidth', type: 'string', default: 'undefined', description: 'Maximum width for the column' },
  { name: 'align', type: "'left' | 'center' | 'right'", default: "'left'", description: 'Alignment applied to header and data cells' },
  { name: 'sortable', type: 'boolean', default: 'false', description: 'Enable sorting from the generated header cell' },
  { name: 'visible', type: 'boolean', default: 'true', description: 'Whether the column is included in visibleColumns' },
  { name: 'sticky', type: "'left' | 'right'", default: 'undefined', description: 'Sticky positioning for the column' },
  { name: 'headerClass', type: 'string', default: "''", description: 'Additional CSS class for generated header cells' },
  { name: 'cellClass', type: 'string', default: "''", description: 'Additional CSS class for generated data cells' },
  { name: 'priority', type: 'number', default: '0', description: 'Responsive priority for future column-hiding logic' }
]

const columnSlots: ApiSlot[] = [
  { name: 'header', description: 'Custom header cell content for this column definition', props: '{ column, sortState }' },
  { name: 'default', description: 'Custom cell renderer for this column', props: '{ row, value, index }' }
]

const skeletonProps: ApiProp[] = [
  { name: 'rows', type: 'number', default: '5', description: 'Number of skeleton rows to render' },
  { name: 'columns', type: 'number', default: 'context visible column count', description: 'Explicit number of skeleton columns' },
  { name: 'showSelection', type: 'boolean', default: 'false', description: 'Reserve a selection checkbox column' },
  { name: 'showActions', type: 'boolean', default: 'false', description: 'Reserve a row actions column' },
  { name: 'skeletonClass', type: 'string', default: "''", description: 'Additional CSS class for each skeleton row' },
  { name: 'animation', type: "'shimmer' | 'pulse' | 'none'", default: "'shimmer'", description: 'Loading animation style' },
  { name: 'progressive', type: 'boolean', default: 'false', description: 'Reveal skeleton rows progressively' },
  { name: 'progressiveDelay', type: 'number', default: '100', description: 'Delay between progressive rows in milliseconds' }
]

const emptyProps: ApiProp[] = [
  { name: 'icon', type: 'string', default: "'mdi-table-off'", description: 'MDI icon class for the empty state' },
  { name: 'title', type: 'string', default: "'No data available'", description: 'Primary empty-state title' },
  { name: 'description', type: 'string', default: "''", description: 'Secondary explanatory text' },
  { name: 'variant', type: "'default' | 'minimal' | 'illustrated'", default: "'default'", description: 'Visual treatment for the empty state' },
  { name: 'iconSize', type: "'sm' | 'md' | 'lg' | 'xl'", default: "'lg'", description: 'Icon size preset' },
  { name: 'colspan', type: 'number', default: '1', description: 'Number of columns the empty row should span' }
]

const emptySlots: ApiSlot[] = [
  { name: 'icon', description: 'Custom empty-state icon' },
  { name: 'title', description: 'Custom empty-state title' },
  { name: 'description', description: 'Custom empty-state description' },
  { name: 'action', description: 'Action button or CTA rendered below the message' }
]

const useDataTableOptions: ApiProp[] = [
  { name: 'data', type: 'T[] | Ref<T[]>', default: '[]', description: 'Initial table rows' },
  { name: 'columns', type: 'TableColumn<T>[] | Ref<TableColumn<T>[]>', default: '[]', description: 'Reactive column definitions' },
  { name: 'rowKey', type: 'keyof T | ((row, index) => string | number)', default: 'undefined', description: 'Unique key accessor for each row' },
  { name: 'initialSort', type: 'SortState', default: 'undefined', description: 'Initial sorting state' },
  { name: 'pagination', type: 'boolean | Partial<PaginationState>', default: 'false', description: 'Enable pagination or configure its initial state' },
  { name: 'selection', type: 'boolean', default: 'false', description: 'Enable row selection helpers' },
  { name: 'multiSelect', type: 'boolean', default: 'false', description: 'Allow selecting multiple rows at once' },
  { name: 'expandable', type: 'boolean', default: 'false', description: 'Enable row expansion helpers' },
  { name: 'loader', type: '(params) => Promise<DataLoaderResult<T>>', default: 'undefined', description: 'Async loader for remote data sources' },
  { name: 'debounce', type: 'number', default: '0', description: 'Debounce delay for async loader refreshes' }
]

const useDataTableReturn: ApiProp[] = [
  { name: 'data', type: 'Ref<T[]>', default: '-', description: 'Reactive raw table rows before sorting and pagination' },
  { name: 'processedData', type: 'ComputedRef<T[]>', default: '-', description: 'Sorted and filtered rows before pagination' },
  { name: 'paginatedData', type: 'ComputedRef<T[]>', default: '-', description: 'Rows for the active page' },
  { name: 'columns', type: 'Ref<TableColumn<T>[]>', default: '-', description: 'Reactive column definitions registered with the table' },
  { name: 'visibleColumns', type: 'ComputedRef<TableColumn<T>[]>', default: '-', description: 'Columns that are currently visible' },
  { name: 'sortState', type: 'Ref<SortState>', default: '-', description: 'Reactive sort state' },
  { name: 'toggleSort', type: '(columnKey: string) => void', default: '-', description: 'Cycle the sort direction for a column' },
  { name: 'setSort', type: '(columnKey: string, direction: SortDirection) => void', default: '-', description: 'Explicitly set the sort column and direction' },
  { name: 'clearSort', type: '() => void', default: '-', description: 'Reset sorting back to the unsorted state' },
  { name: 'selectedKeys', type: 'Ref<Set<string | number>>', default: '-', description: 'Currently selected row keys' },
  { name: 'selectedRows', type: 'ComputedRef<T[]>', default: '-', description: 'Selected row objects' },
  { name: 'toggleRowSelection', type: '(key: string | number) => void', default: '-', description: 'Toggle selection for a single row key' },
  { name: 'selectRow', type: '(key: string | number) => void', default: '-', description: 'Select a single row key' },
  { name: 'deselectRow', type: '(key: string | number) => void', default: '-', description: 'Clear selection for a single row key' },
  { name: 'selectAll', type: '() => void', default: '-', description: 'Select every currently processed row' },
  { name: 'deselectAll', type: '() => void', default: '-', description: 'Clear all selected row keys' },
  { name: 'toggleAllSelection', type: '() => void', default: '-', description: 'Toggle between select-all and deselect-all' },
  { name: 'isRowSelected', type: '(key: string | number) => boolean', default: '-', description: 'Check whether a row key is selected' },
  { name: 'isAllSelected', type: 'ComputedRef<boolean>', default: '-', description: 'Whether all processed rows are selected' },
  { name: 'isSomeSelected', type: 'ComputedRef<boolean>', default: '-', description: 'Whether some, but not all, processed rows are selected' },
  { name: 'expandedKeys', type: 'Ref<Set<string | number>>', default: '-', description: 'Currently expanded row keys' },
  { name: 'toggleRowExpansion', type: '(key: string | number) => void', default: '-', description: 'Toggle expansion for a single row key' },
  { name: 'expandRow', type: '(key: string | number) => void', default: '-', description: 'Expand a single row key' },
  { name: 'collapseRow', type: '(key: string | number) => void', default: '-', description: 'Collapse a single row key' },
  { name: 'expandAll', type: '() => void', default: '-', description: 'Expand every currently processed row' },
  { name: 'collapseAll', type: '() => void', default: '-', description: 'Collapse all expanded row keys' },
  { name: 'isRowExpanded', type: '(key: string | number) => boolean', default: '-', description: 'Check whether a row key is expanded' },
  { name: 'pagination', type: 'Ref<PaginationState>', default: '-', description: 'Current pagination state' },
  { name: 'totalPages', type: 'ComputedRef<number>', default: '-', description: 'Derived page count' },
  { name: 'goToPage', type: '(page: number) => void', default: '-', description: 'Jump to a specific page number' },
  { name: 'nextPage', type: '() => void', default: '-', description: 'Advance to the next page when available' },
  { name: 'prevPage', type: '() => void', default: '-', description: 'Go back to the previous page when available' },
  { name: 'setPageSize', type: '(size: number) => void', default: '-', description: 'Update the active page size' },
  { name: 'showColumn', type: '(key: string) => void', default: '-', description: 'Mark a column as visible' },
  { name: 'hideColumn', type: '(key: string) => void', default: '-', description: 'Hide a column from visibleColumns' },
  { name: 'toggleColumn', type: '(key: string) => void', default: '-', description: 'Toggle visibility for a column key' },
  { name: 'setColumnVisibility', type: '(key: string, visible: boolean) => void', default: '-', description: 'Set an explicit visibility state for a column' },
  { name: 'loading', type: 'Ref<boolean>', default: '-', description: 'Async loading state' },
  { name: 'error', type: 'Ref<Error | null>', default: '-', description: 'Last async loader error' },
  { name: 'getRowKey', type: '(row: T, index: number) => string | number', default: '-', description: 'Resolve the stable key used for row operations' },
  { name: 'refresh', type: '() => Promise<void>', default: '-', description: 'Re-run the async loader when configured' },
  { name: 'setData', type: '(newData: T[]) => void', default: '-', description: 'Replace the raw data source' }
]

const keyboardShortcuts: KeyboardShortcut[] = [
  { keys: ['Tab'], action: 'Navigate between sortable column headers' },
  { keys: ['Enter', 'Space'], action: 'Toggle sort on the focused column header' },
  { keys: ['↑', '↓'], action: 'Move between rows when custom row focus management is enabled' }
]

// Helper for status colors - returns actual color values
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    active: '#22c55e',
    inactive: '#ef4444',
    pending: '#f59e0b'
  }
  return colors[status] || 'var(--s-primary)'
}

// Format salary
const formatSalary = (value: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}
</script>

<template>
  <div class="space-y-12">
    <!-- @component SDataTable -->
    <!-- @props data, columns, rowKey, variant, size, selectionMode, hoverable, stickyHeader, stickyOffset, animateRows, loading, skeletonRows, pagination, pageSize, pageSizeOptions, multiSelect, initialSort, tableClass, fixedLayout, maxHeight, emptyMessage, emptyIcon, caption, captionSide -->
    <!-- @events row-click, row-dblclick, sort-change, selection-change, update:selected, page-change, page-size-change, expanded-change -->
    <!-- @slots toolbar, header, header-{key}, cell-{key}, row-actions, select-header, select-cell, expanded, loading, empty, pagination, footer -->
    <!-- @sections accessibility, performance -->
    <!-- Page Header -->
    <div>
      <h1 class="text-3xl font-bold text-(--s-text-primary) mb-2">Data Table</h1>
      <p class="text-(--s-text-secondary) text-lg">
        A highly customizable, production-ready table component with sorting, selection,
        pagination, and smooth animations.
      </p>
    </div>

    <!-- Basic Usage -->
    <DemoSection
      title="Basic Usage"
      description="A simple table with column definitions and sortable columns."
      :code="basicCode"
    >
      <SDataTable
        :data="sampleUsers.slice(0, 5)"
        :columns="basicColumns"
      />
    </DemoSection>

    <!-- Variants -->
    <DemoSection
      title="Variants"
      description="Different visual styles for various contexts."
      :code="variantsCode"
    >
      <div class="space-y-8">
        <div>
          <h4 class="text-sm font-medium text-(--s-text-secondary) mb-3">Default</h4>
          <SDataTable
            variant="default"
            :data="sampleUsers.slice(0, 3)"
            :columns="basicColumns.slice(0, 3)"
          />
        </div>
        
        <div>
          <h4 class="text-sm font-medium text-(--s-text-secondary) mb-3">Compact</h4>
          <SDataTable
            variant="compact"
            size="sm"
            :data="sampleUsers.slice(0, 3)"
            :columns="basicColumns.slice(0, 3)"
          />
        </div>
        
        <div>
          <h4 class="text-sm font-medium text-(--s-text-secondary) mb-3">Bordered</h4>
          <SDataTable
            variant="bordered"
            :data="sampleUsers.slice(0, 3)"
            :columns="basicColumns.slice(0, 3)"
          />
        </div>
        
        <div>
          <h4 class="text-sm font-medium text-(--s-text-secondary) mb-3">Striped</h4>
          <SDataTable
            variant="striped"
            :data="sampleUsers.slice(0, 4)"
            :columns="basicColumns.slice(0, 3)"
          />
        </div>
        
        <div>
          <h4 class="text-sm font-medium text-(--s-text-secondary) mb-3">Minimal</h4>
          <SDataTable
            variant="minimal"
            :data="sampleUsers.slice(0, 3)"
            :columns="basicColumns.slice(0, 3)"
          />
        </div>
      </div>
    </DemoSection>

    <!-- Sorting -->
    <DemoSection
      title="Sorting"
      description="Click column headers to sort. Supports ascending, descending, and unsorted states."
      :code="sortingCode"
    >
      <SDataTable
        :data="sampleUsers"
        :columns="sortableColumns"
        :initial-sort="{ column: 'name', direction: 'asc' }"
      >
        <template #cell-salary="{ value }">
          {{ formatSalary(value as number) }}
        </template>
      </SDataTable>
    </DemoSection>

    <!-- Selection -->
    <DemoSection
      title="Row Selection"
      description="Enable single or multiple row selection with checkbox controls."
      :code="selectionCode"
    >
      <div class="space-y-4">
        <div class="flex items-center gap-4">
          <span class="text-sm text-(--s-text-secondary)">
            Selected: {{ selectedKeys.length }} rows
          </span>
          <SButton
            v-if="selectedKeys.length > 0"
            size="small"
            variant="ghost"
            @click="selectedKeys = []"
          >
            Clear Selection
          </SButton>
        </div>
        
        <SDataTable
          :data="sampleUsers"
          :columns="basicColumns"
          selection-mode="multiple"
          v-model:selected="selectedKeys"
        >
          <template #cell-status="{ value }">
            <SChip :color="getStatusColor(value as string)" size="small">
              {{ value }}
            </SChip>
          </template>
        </SDataTable>
      </div>
    </DemoSection>

    <!-- Custom Cells -->
    <DemoSection
      title="Custom Cell Rendering"
      description="Use slots to customize cell content and add row actions."
      :code="customCellsCode"
    >
      <SDataTable
        :data="sampleUsers"
        :columns="fullColumns"
      >
        <template #cell-status="{ value }">
          <SChip :color="getStatusColor(value as string)" size="small">
            {{ value }}
          </SChip>
        </template>
        
        <template #cell-salary="{ value }">
          <span class="font-mono">{{ formatSalary(value as number) }}</span>
        </template>
        
        <template #row-actions="{ row: _row }">
          <div class="flex gap-1">
            <SButton size="small" variant="ghost" title="Edit">
              <span class="mdi mdi-pencil" />
            </SButton>
            <SButton size="small" variant="ghost" color="danger" title="Delete">
              <span class="mdi mdi-delete" />
            </SButton>
          </div>
        </template>
      </SDataTable>
    </DemoSection>

    <!-- Pagination -->
    <DemoSection
      title="Pagination"
      description="Uses the SPagination component internally. You can also override via the pagination slot."
      :code="paginationCode"
    >
      <div class="space-y-8">
        <div>
          <h4 class="text-sm font-medium text-(--s-text-secondary) mb-3">Default (SPagination built-in)</h4>
          <SDataTable
            :data="extendedUsers"
            :columns="basicColumns"
            pagination
            :page-size="5"
            :page-size-options="[5, 10, 25]"
          >
            <template #cell-status="{ value }">
              <SChip :color="getStatusColor(value as string)" size="small">
                {{ value }}
              </SChip>
            </template>
          </SDataTable>
        </div>

        <div>
          <h4 class="text-sm font-medium text-(--s-text-secondary) mb-3">Custom Pagination Slot</h4>
          <SDataTable
            :data="extendedUsers"
            :columns="basicColumns"
            pagination
            :page-size="5"
            :page-size-options="[5, 10, 25]"
          >
            <template #cell-status="{ value }">
              <SChip :color="getStatusColor(value as string)" size="small">
                {{ value }}
              </SChip>
            </template>
            <template #pagination="{ page, total, pageSize, goToPage, setPageSize }">
              <SPagination
                :model-value="page"
                :total="total"
                :page-size="pageSize"
                :page-size-options="[5, 10, 25]"
                show-total
                show-page-size
                show-first-last
                show-quick-jump
                class="px-4 py-3 border-t border-border justify-between"
                @update:model-value="goToPage"
                @update:page-size="setPageSize"
              />
            </template>
          </SDataTable>
        </div>
      </div>
    </DemoSection>

    <!-- Loading State -->
    <DemoSection
      title="Loading State"
      description="Skeleton loading with shimmer animation."
      :code="loadingCode"
    >
      <div class="space-y-4">
        <SButton @click="simulateLoading" :disabled="isLoading">
          {{ isLoading ? 'Loading...' : 'Simulate Loading' }}
        </SButton>
        
        <SDataTable
          :data="sampleUsers.slice(0, 5)"
          :columns="basicColumns"
          :loading="isLoading"
          :skeleton-rows="5"
        >
          <template #cell-status="{ value }">
            <SChip :color="getStatusColor(value as string)" size="small">
              {{ value }}
            </SChip>
          </template>
        </SDataTable>
      </div>
    </DemoSection>

    <!-- Empty State -->
    <DemoSection
      title="Empty State"
      description="Customizable empty state when no data is available."
      :code="emptyCode"
    >
      <div class="space-y-8">
        <div>
          <h4 class="text-sm font-medium text-(--s-text-secondary) mb-3">Default Empty State</h4>
          <SDataTable
            :data="emptyData"
            :columns="basicColumns"
          />
        </div>
        
        <div>
          <h4 class="text-sm font-medium text-(--s-text-secondary) mb-3">Custom Empty State</h4>
          <SDataTable
            :data="emptyData"
            :columns="basicColumns"
          >
            <template #empty>
              <div class="flex flex-col items-center py-12">
                <span class="mdi mdi-folder-open-outline text-5xl opacity-40 mb-4" />
                <p class="text-(--s-text-secondary) mb-4">No users found</p>
                <SButton size="small">
                  <span class="mdi mdi-plus mr-2" />
                  Add First User
                </SButton>
              </div>
            </template>
          </SDataTable>
        </div>
      </div>
    </DemoSection>

    <!-- Sticky Header -->
    <DemoSection
      title="Sticky Header & Max Height"
      description="Keep header visible when scrolling through large tables."
      :code="stickyHeaderCode"
    >
      <SDataTable
        :data="extendedUsers"
        :columns="fullColumns"
        sticky-header
        max-height="400px"
      >
        <template #cell-status="{ value }">
          <SChip :color="getStatusColor(value as string)" size="small">
            {{ value }}
          </SChip>
        </template>
        
        <template #cell-salary="{ value }">
          <span class="font-mono">{{ formatSalary(value as number) }}</span>
        </template>
      </SDataTable>
    </DemoSection>

    <!-- Headless Usage -->
    <DemoSection
      title="Headless Usage (useDataTable)"
      description="Use the composable directly for complete control over rendering."
      :code="headlessCode"
    >
      <div class="p-4 bg-(--s-bg-secondary) rounded-lg">
        <p class="text-sm text-(--s-text-secondary)">
          The <code class="px-1.5 py-0.5 bg-(--s-bg-tertiary) rounded text-(--s-primary)">useDataTable</code> 
          composable provides all the logic (sorting, selection, pagination, etc.) without any UI.
          Build your own custom table design while leveraging the powerful state management.
        </p>
        
        <div class="mt-4 text-sm">
          <strong class="text-(--s-text-primary)">Features:</strong>
          <ul class="list-disc list-inside mt-2 text-(--s-text-secondary) space-y-1">
            <li>Reactive sorted/filtered/paginated data</li>
            <li>Row selection (single/multi)</li>
            <li>Row expansion</li>
            <li>Column visibility management</li>
            <li>Async data loading support</li>
            <li>TypeScript support with generics</li>
          </ul>
        </div>
      </div>
    </DemoSection>

    <!-- API Documentation -->
    <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">API Reference</h2>
    <SApiSection>
      <div class="space-y-8">
        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-table text-(--s-primary)" />
            SDataTable
          </h3>
          <SApiTable title="Props" type="props" :props="tableProps" />
          <SApiTable title="Events" type="events" :events="tableEvents" class="mt-6" />
          <SApiTable title="Slots" type="slots" :slots="tableSlots" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-table-row text-(--s-primary)" />
            STableHeader
          </h3>
          <SApiTable title="Props" type="props" :props="headerProps" />
          <SApiTable title="Slots" type="slots" :slots="headerSlots" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-table-row-group text-(--s-primary)" />
            STableBody
          </h3>
          <SApiTable title="Props" type="props" :props="bodyProps" />
          <SApiTable title="Slots" type="slots" :slots="bodySlots" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-table-row-plus-after text-(--s-primary)" />
            STableRow
          </h3>
          <SApiTable title="Props" type="props" :props="rowProps" />
          <SApiTable title="Events" type="events" :events="rowEvents" class="mt-6" />
          <SApiTable title="Slots" type="slots" :slots="rowSlots" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-table-column text-(--s-primary)" />
            STableCell
          </h3>
          <SApiTable title="Props" type="props" :props="cellProps" />
          <SApiTable title="Slots" type="slots" :slots="cellSlots" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-view-column-outline text-(--s-primary)" />
            STableColumn
          </h3>
          <SApiTable title="Props" type="props" :props="tableColumnProps" />
          <SApiTable title="Slots" type="slots" :slots="columnSlots" class="mt-6" />
          <SApiTable title="TableColumn&lt;T&gt; Interface" type="props" :props="columnProps" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-loading text-(--s-primary)" />
            STableSkeleton
          </h3>
          <SApiTable title="Props" type="props" :props="skeletonProps" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-table-off text-(--s-primary)" />
            STableEmpty
          </h3>
          <SApiTable title="Props" type="props" :props="emptyProps" />
          <SApiTable title="Slots" type="slots" :slots="emptySlots" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-function-variant text-(--s-primary)" />
            useDataTable
          </h3>
          <SApiTable title="Options" type="props" :props="useDataTableOptions" />
          <SApiTable title="Return Value" type="props" :props="useDataTableReturn" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-keyboard-outline text-(--s-primary)" />
            Keyboard Navigation
          </h3>
          <SApiKeyboard
            :shortcuts="keyboardShortcuts"
            variant="table"
          />
        </div>
      </div>
    </SApiSection>

    <!-- Accessibility Notes -->
    <section id="accessibility" class="space-y-4">
      <h2 class="text-xl font-semibold text-(--s-text-primary)">Accessibility</h2>
      <div class="bg-(--s-bg-secondary) rounded-xl p-6 space-y-3">
        <div class="flex gap-3">
          <span class="mdi mdi-check-circle text-(--s-primary)" />
          <p class="text-sm text-(--s-text-secondary)">
            Uses semantic <code>&lt;table&gt;</code>, <code>&lt;thead&gt;</code>, <code>&lt;tbody&gt;</code>, 
            <code>&lt;tr&gt;</code>, <code>&lt;th&gt;</code>, and <code>&lt;td&gt;</code> elements
          </p>
        </div>
        <div class="flex gap-3">
          <span class="mdi mdi-check-circle text-(--s-primary)" />
          <p class="text-sm text-(--s-text-secondary)">
            Sortable columns announce sort state via <code>aria-sort</code>
          </p>
        </div>
        <div class="flex gap-3">
          <span class="mdi mdi-check-circle text-(--s-primary)" />
          <p class="text-sm text-(--s-text-secondary)">
            Selection state communicated via <code>aria-selected</code> on rows
          </p>
        </div>
        <div class="flex gap-3">
          <span class="mdi mdi-check-circle text-(--s-primary)" />
          <p class="text-sm text-(--s-text-secondary)">
            Loading state announced via <code>aria-busy</code> and <code>aria-live</code>
          </p>
        </div>
        <div class="flex gap-3">
          <span class="mdi mdi-check-circle text-(--s-primary)" />
          <p class="text-sm text-(--s-text-secondary)">
            Keyboard navigable with focus indicators
          </p>
        </div>
        <div class="flex gap-3">
          <span class="mdi mdi-check-circle text-(--s-primary)" />
          <p class="text-sm text-(--s-text-secondary)">
            Respects <code>prefers-reduced-motion</code> for animations
          </p>
        </div>
      </div>
    </section>

    <!-- Performance Notes -->
    <section id="performance" class="space-y-4">
      <h2 class="text-xl font-semibold text-(--s-text-primary)">Performance</h2>
      <div class="bg-(--s-bg-secondary) rounded-xl p-6 space-y-3">
        <div class="flex gap-3">
          <span class="mdi mdi-lightning-bolt text-amber-500" />
          <p class="text-sm text-(--s-text-secondary)">
            <strong>Computed Memoization:</strong> Sorted and paginated data are computed refs, 
            only recalculating when dependencies change
          </p>
        </div>
        <div class="flex gap-3">
          <span class="mdi mdi-lightning-bolt text-amber-500" />
          <p class="text-sm text-(--s-text-secondary)">
            <strong>Shallow Refs:</strong> Data uses <code>shallowRef</code> to avoid deep reactivity overhead
          </p>
        </div>
        <div class="flex gap-3">
          <span class="mdi mdi-lightning-bolt text-amber-500" />
          <p class="text-sm text-(--s-text-secondary)">
            <strong>Key-based Rendering:</strong> Rows use unique keys for efficient DOM updates
          </p>
        </div>
        <div class="flex gap-3">
          <span class="mdi mdi-package-variant text-(--s-primary)" />
          <p class="text-sm text-(--s-text-secondary)">
            <strong>Virtualization Ready:</strong> The architecture supports plugging in virtual scrolling 
            libraries like <code>vue-virtual-scroller</code> for 10k+ rows. See documentation for integration guide.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
