<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '~/lib/utils'

defineOptions({ inheritAttrs: false })

// Type definitions
export interface ApiProp {
  name: string
  type: string
  default?: string
  description: string
  category?: string
}

export interface ApiEvent {
  name: string
  payload?: string
  description: string
}

export interface ApiSlot {
  name: string
  props?: string
  description: string
}

export interface ApiMethod {
  name: string
  description: string
}

export type TableType = 'props' | 'events' | 'slots' | 'methods'

interface Props {
  /** Title of the table section (e.g., "SButton Props") */
  title: string
  /** Type of table to render */
  type: TableType
  /** Props data (when type="props") */
  props?: ApiProp[]
  /** Events data (when type="events") */
  events?: ApiEvent[]
  /** Slots data (when type="slots") */
  slots?: ApiSlot[]
  /** Methods data (when type="methods") */
  methods?: ApiMethod[]
}

const props = defineProps<Props>()

// Organize props by category if categories exist
const organizedProps = computed(() => {
  if (!props.props) return []
  
  const hasCategories = props.props.some(p => p.category)
  if (!hasCategories) {
    return props.props.map(p => ({ ...p, isCategory: false }))
  }

  // Group by category
  const result: (ApiProp & { isCategory?: boolean })[] = []
  let currentCategory = ''
  
  for (const prop of props.props) {
    if (prop.category && prop.category !== currentCategory) {
      currentCategory = prop.category
      result.push({ name: prop.category, type: '', description: '', isCategory: true })
    }
    result.push({ ...prop, isCategory: false })
  }
  
  return result
})

// Column configurations for different table types
const columns = computed(() => {
  switch (props.type) {
    case 'props':
      return [
        { key: 'name', label: 'Prop' },
        { key: 'type', label: 'Type' },
        { key: 'default', label: 'Default' },
        { key: 'description', label: 'Description' }
      ]
    case 'events':
      return [
        { key: 'name', label: 'Event' },
        { key: 'payload', label: 'Payload' },
        { key: 'description', label: 'Description' }
      ]
    case 'slots':
      return [
        { key: 'name', label: 'Slot' },
        { key: 'props', label: 'Scope Props' },
        { key: 'description', label: 'Description' }
      ]
    case 'methods':
      return [
        { key: 'name', label: 'Method' },
        { key: 'description', label: 'Description' }
      ]
    default:
      return []
  }
})

// Get the appropriate data array based on type
const tableData = computed(() => {
  switch (props.type) {
    case 'props':
      return organizedProps.value
    case 'events':
      return props.events || []
    case 'slots':
      return props.slots || []
    case 'methods':
      return props.methods || []
    default:
      return []
  }
})
</script>

<template>
  <article v-bind="$attrs">
    <h3 class="text-xl font-semibold text-foreground mt-4 mb-2 ">{{ title }}</h3>
    <div class="overflow-x-auto rounded-xl border border-border">
      <table class="w-full text-sm text-left">
        <thead class="text-muted-foreground bg-muted text-xs uppercase tracking-wider">
          <tr>
            <th v-for="col in columns" :key="col.key" class="py-3 px-4">
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody class="text-muted-foreground bg-muted/40">
          <template v-for="(row, index) in tableData" :key="index">
            <!-- Category row (for props with categories) -->
            <tr v-if="type === 'props' && (row as ApiProp & { isCategory?: boolean }).isCategory" 
                class="border-t border-border bg-accent/30">
              <td :colspan="columns.length" 
                  class="py-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {{ row.name }}
              </td>
            </tr>
            <!-- Regular data row -->
            <tr v-else class="border-t border-border">
              <!-- Name column (always first, styled as code) -->
              <td class="py-3 px-4">
                <code class="text-emerald-400 font-mono">{{ row.name }}</code>
              </td>
              <!-- Type column (props only) -->
              <td v-if="type === 'props'" class="py-3 px-4 text-muted-foreground">
                {{ (row as ApiProp).type }}
              </td>
              <!-- Default column (props only) -->
              <td v-if="type === 'props'" class="py-3 px-4">
                {{ (row as ApiProp).default ?? '—' }}
              </td>
              <!-- Payload column (events only) -->
              <td v-if="type === 'events'" class="py-3 px-4 text-muted-foreground">
                {{ (row as ApiEvent).payload || '—' }}
              </td>
              <!-- Props column (slots only) -->
              <td v-if="type === 'slots'" class="py-3 px-4 text-muted-foreground">
                {{ (row as ApiSlot).props || '—' }}
              </td>
              <!-- Description column (always last) -->
              <td class="py-3 px-4">
                {{ row.description }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <!-- Additional content slot (for examples, etc.) -->
    <slot />
  </article>
</template>
