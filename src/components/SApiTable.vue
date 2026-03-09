<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

// Type definitions
export interface ApiProp {
  name: string
  type: string
  default?: string
  description: string
  category?: string
  required?: boolean
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
  <article v-bind="$attrs" class="space-y-3">
    <div class="flex items-center gap-3">
      <h4 class="text-sm font-semibold tracking-tight text-foreground">{{ title }}</h4>
      <div class="h-px flex-1 bg-border/70" aria-hidden="true" />
    </div>

    <div class="overflow-x-auto rounded-xl border border-border/70 bg-background/80 shadow-sm">
      <table class="w-full min-w-full text-left text-sm">
        <caption class="sr-only">{{ title }}</caption>
        <thead class="bg-muted/55 text-xs uppercase tracking-[0.16em] text-muted-foreground">
          <tr>
            <th v-for="col in columns" :key="col.key" class="px-4 py-3 font-semibold">
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-background/40 text-muted-foreground">
          <template v-for="(row, index) in tableData" :key="index">
            <!-- Category row (for props with categories) -->
            <tr v-if="type === 'props' && 'isCategory' in row && (row as any).isCategory" 
                class="border-t border-border/70 bg-muted/60">
              <td :colspan="columns.length" 
                  class="px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {{ row.name }}
              </td>
            </tr>
            <!-- Regular data row -->
            <tr v-else class="border-t border-border/70 align-top">
              <!-- Name column (always first, styled as code) -->
              <td class="px-4 py-3 align-top">
                <code class="inline-flex rounded-md bg-muted px-2 py-1 text-xs font-mono text-foreground">
                  {{ row.name }}
                </code>
              </td>
              <!-- Type column (props only) -->
              <td v-if="type === 'props'" class="px-4 py-3 align-top font-mono text-xs text-muted-foreground">
                {{ (row as ApiProp).type }}
              </td>
              <!-- Default column (props only) -->
              <td v-if="type === 'props'" class="px-4 py-3 align-top font-mono text-xs text-muted-foreground">
                {{ (row as ApiProp).default ?? '—' }}
              </td>
              <!-- Payload column (events only) -->
              <td v-if="type === 'events'" class="px-4 py-3 align-top font-mono text-xs text-muted-foreground">
                {{ (row as ApiEvent).payload || '—' }}
              </td>
              <!-- Props column (slots only) -->
              <td v-if="type === 'slots'" class="px-4 py-3 align-top font-mono text-xs text-muted-foreground">
                {{ (row as ApiSlot).props || '—' }}
              </td>
              <!-- Description column (always last) -->
              <td class="px-4 py-3 align-top text-foreground/90">
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
