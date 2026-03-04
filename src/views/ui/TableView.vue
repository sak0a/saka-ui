<script setup lang="ts">
import { ref, computed } from 'vue'
import { SDataTable, SButton, SChip, SApiSection, SApiTable, SApiKeyboard } from '../../index'
import type { ApiProp, ApiEvent, ApiSlot, KeyboardShortcut, TableColumn } from '../../index'
import DemoSection from '../../components/DemoSection.vue'

// ============================================================================
// Sample Data
// ============================================================================

interface User {
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
      size="sm"
    >
      {{ value }}
    </SChip>
  </template>
  
  <!-- Row actions -->
  <template #row-actions="{ row }">
    <SButton size="sm" variant="ghost" @click="edit(row)">
      <span class="mdi mdi-pencil" />
    </SButton>
    <SButton size="sm" variant="ghost" color="danger" @click="remove(row)">
      <span class="mdi mdi-delete" />
    </SButton>
  </template>
</SDataTable>`

const paginationCode = `<SDataTable 
  :data="largeDataset" 
  :columns="columns"
  pagination
  :page-size="10"
  :page-size-options="[10, 25, 50, 100]"
  @page-change="(page) => console.log('Page:', page)"
  @page-size-change="(size) => console.log('Size:', size)"
/>`

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
      <SButton size="sm" class="mt-4">Add First Record</SButton>
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
  { name: 'initialSort', type: 'SortState', default: 'undefined', description: 'Initial sort state' },
  { name: 'maxHeight', type: 'string', default: 'undefined', description: 'Max height for scrollable body' },
  { name: 'emptyMessage', type: 'string', default: "'No data available'", description: 'Message shown when data is empty' },
  { name: 'emptyIcon', type: 'string', default: "'mdi-table-off'", description: 'Icon shown in empty state' },
  { name: 'caption', type: 'string', default: 'undefined', description: 'Accessible caption for the table' }
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

const keyboardShortcuts: KeyboardShortcut[] = [
  { keys: ['Tab'], description: 'Navigate between sortable columns' },
  { keys: ['Enter', 'Space'], description: 'Toggle sort on focused column header' },
  { keys: ['↑', '↓'], description: 'Navigate rows (when row focus enabled)' }
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
            size="sm" 
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
            <SChip :color="getStatusColor(value as string)" size="sm">
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
          <SChip :color="getStatusColor(value as string)" size="sm">
            {{ value }}
          </SChip>
        </template>
        
        <template #cell-salary="{ value }">
          <span class="font-mono">{{ formatSalary(value as number) }}</span>
        </template>
        
        <template #row-actions="{ row }">
          <div class="flex gap-1">
            <SButton size="sm" variant="ghost" title="Edit">
              <span class="mdi mdi-pencil" />
            </SButton>
            <SButton size="sm" variant="ghost" color="danger" title="Delete">
              <span class="mdi mdi-delete" />
            </SButton>
          </div>
        </template>
      </SDataTable>
    </DemoSection>

    <!-- Pagination -->
    <DemoSection
      title="Pagination"
      description="Built-in pagination for large datasets."
      :code="paginationCode"
    >
      <SDataTable
        :data="extendedUsers"
        :columns="basicColumns"
        pagination
        :page-size="5"
        :page-size-options="[5, 10, 25]"
      >
        <template #cell-status="{ value }">
          <SChip :color="getStatusColor(value as string)" size="sm">
            {{ value }}
          </SChip>
        </template>
      </SDataTable>
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
            <SChip :color="getStatusColor(value as string)" size="sm">
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
                <SButton size="sm">
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
          <SChip :color="getStatusColor(value as string)" size="sm">
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
      <!-- SDataTable Props -->
      <SApiTable
        title="SDataTable Props"
        type="props"
        :props="tableProps"
      />

      <!-- Column Definition -->
      <SApiTable
        title="TableColumn Definition"
        type="props"
        :props="columnProps"
      />

      <!-- Events -->
      <SApiTable
        title="Events"
        type="events"
        :events="tableEvents"
      />

      <!-- Slots -->
      <SApiTable
        title="Slots"
        type="slots"
        :slots="tableSlots"
      />

      <!-- Keyboard -->
      <SApiKeyboard
        :shortcuts="keyboardShortcuts"
        variant="table"
      />
    </SApiSection>

    <!-- Accessibility Notes -->
    <section class="space-y-4">
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
    <section class="space-y-4">
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
