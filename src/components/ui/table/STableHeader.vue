<script setup lang="ts">
/**
 * STableHeader - Standalone header component for custom table layouts
 */
import { inject, computed } from 'vue'
import { SDataTableContextKey } from './index'

interface Props {
  /** Custom class for thead */
  headerClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  headerClass: ''
})

defineOptions({ inheritAttrs: false })

const context = inject(SDataTableContextKey)

const headerClasses = computed(() => {
  return [
    's-table-head',
    props.headerClass,
    {
      'sticky z-10': context?.stickyHeader,
      'bg-(--s-bg-secondary)': true
    }
  ]
})
</script>

<template>
  <thead v-bind="$attrs" :class="headerClasses">
    <slot>
      <tr v-if="context">
        <th
          v-for="column in context.visibleColumns.value"
          :key="column.key"
          class="s-table-th"
          :class="[
            column.headerClass,
            {
              's-table-th-sortable cursor-pointer select-none': column.sortable,
              's-table-th-sorted': context.sortState.value.column === column.key,
              'text-left': column.align === 'left' || !column.align,
              'text-center': column.align === 'center',
              'text-right': column.align === 'right'
            }
          ]"
          :style="{
            width: column.width,
            minWidth: column.minWidth,
            maxWidth: column.maxWidth
          }"
          scope="col"
          :aria-sort="
            context.sortState.value.column === column.key 
              ? (context.sortState.value.direction === 'asc' ? 'ascending' : 'descending')
              : undefined
          "
          @click="column.sortable ? context.toggleSort(column.key) : undefined"
          @keydown.enter="column.sortable ? context.toggleSort(column.key) : undefined"
          @keydown.space.prevent="column.sortable ? context.toggleSort(column.key) : undefined"
          :tabindex="column.sortable ? 0 : undefined"
        >
          <slot :name="`header-${column.key}`" :column="column">
            <div 
              class="flex items-center gap-2" 
              :class="{ 
                'justify-center': column.align === 'center', 
                'justify-end': column.align === 'right' 
              }"
            >
              <span>{{ column.label || column.key }}</span>
              
              <!-- Sort indicator -->
              <span 
                v-if="column.sortable"
                class="s-table-sort-icon inline-flex flex-col text-xs leading-none opacity-40 transition-opacity"
                :class="{ 'opacity-100': context.sortState.value.column === column.key }"
              >
                <span 
                  class="mdi mdi-chevron-up transition-transform -mb-1.5"
                  :class="{ 
                    'text-(--s-primary)': context.sortState.value.column === column.key && context.sortState.value.direction === 'asc'
                  }"
                />
                <span 
                  class="mdi mdi-chevron-down transition-transform"
                  :class="{ 
                    'text-(--s-primary)': context.sortState.value.column === column.key && context.sortState.value.direction === 'desc'
                  }"
                />
              </span>
            </div>
          </slot>
        </th>
      </tr>
    </slot>
  </thead>
</template>

<style scoped>
.s-table-head {
  background-color: var(--s-bg-secondary);
}

.s-table-th {
  padding: 0.75rem 1rem;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--s-text-secondary);
  white-space: nowrap;
}

.s-table-th-sortable {
  transition: background-color 0.15s ease;
}

.s-table-th-sortable:hover {
  background-color: var(--s-bg-tertiary);
}

.s-table-th-sortable:focus-visible {
  outline: 2px solid var(--s-primary);
  outline-offset: -2px;
}
</style>
