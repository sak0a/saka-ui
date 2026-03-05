<script setup lang="ts">
export interface KeyboardShortcut {
  /** Key or keys to display (e.g., "Enter", "Ctrl+C", ["Enter", "Space"]) */
  keys: string | string[]
  /** Description of what the shortcut does */
  action: string
}

interface Props {
  /** Title of the keyboard section */
  title?: string
  /** Array of keyboard shortcuts */
  shortcuts: KeyboardShortcut[]
  /** Display as a table instead of grid */
  variant?: 'grid' | 'table'
  /** Maximum number of columns for grid layout */
  columns?: 2 | 3 | 4
}

import { cn } from '~/lib/utils'

defineOptions({ inheritAttrs: false })

withDefaults(defineProps<Props>(), {
  title: 'Keyboard Shortcuts',
  variant: 'grid',
  columns: 2
})

// Helper to ensure keys is always an array
const normalizeKeys = (keys: string | string[]): string[] => {
  return Array.isArray(keys) ? keys : [keys]
}
</script>

<template>
  <article v-bind="$attrs">
    <h3 class="text-xl font-semibold text-foreground mt-4 mb-2">{{ title }}</h3>
    
    <!-- Grid variant -->
    <div v-if="variant === 'grid'" 
         class="bg-muted/50 p-6 rounded-xl border border-border">
      <div 
        class="grid gap-4"
        :class="{
          'grid-cols-2': columns === 2,
          'grid-cols-3': columns === 3,
          'grid-cols-4': columns === 4,
          'max-w-md': columns === 2,
          'max-w-2xl': columns === 3,
          'max-w-4xl': columns === 4
        }"
      >
        <div 
          v-for="(shortcut, index) in shortcuts" 
          :key="index"
          class="flex items-center gap-3"
        >
          <span class="flex items-center gap-1">
            <template v-for="(key, keyIndex) in normalizeKeys(shortcut.keys)" :key="keyIndex">
              <span v-if="keyIndex > 0" class="text-muted-foreground text-xs">/</span>
              <kbd class="px-2 py-1 bg-accent rounded text-xs font-mono text-foreground">
                {{ key }}
              </kbd>
            </template>
          </span>
          <span class="text-sm text-muted-foreground">{{ shortcut.action }}</span>
        </div>
      </div>
    </div>

    <!-- Table variant -->
    <div v-else class="overflow-x-auto rounded-xl border border-border">
      <table class="w-full text-sm text-left">
        <thead class="text-muted-foreground bg-muted text-xs uppercase tracking-wider">
          <tr>
            <th class="py-3 px-4">Key</th>
            <th class="py-3 px-4">Action</th>
          </tr>
        </thead>
        <tbody class="text-muted-foreground bg-muted/40">
          <tr 
            v-for="(shortcut, index) in shortcuts" 
            :key="index"
            class="border-t border-border"
          >
            <td class="py-3 px-4">
              <span class="flex items-center gap-1">
                <template v-for="(key, keyIndex) in normalizeKeys(shortcut.keys)" :key="keyIndex">
                  <span v-if="keyIndex > 0" class="text-muted-foreground text-xs mx-1">/</span>
                  <kbd class="px-2 py-1 bg-accent rounded text-xs font-mono text-foreground">
                    {{ key }}
                  </kbd>
                </template>
              </span>
            </td>
            <td class="py-3 px-4">{{ shortcut.action }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </article>
</template>
