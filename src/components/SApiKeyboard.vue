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

import SKbd from '~/components/ui/SKbd.vue'

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
  <article v-bind="$attrs" class="space-y-3">
    <div class="flex items-center gap-3">
      <h4 class="text-sm font-semibold tracking-tight text-foreground">{{ title }}</h4>
      <div class="h-px flex-1 bg-border/70" aria-hidden="true" />
    </div>
    
    <!-- Grid variant -->
    <div v-if="variant === 'grid'" 
         class="rounded-xl border border-border/70 bg-background/80 p-6 shadow-sm">
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
          class="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/35 px-4 py-3"
        >
          <span class="flex items-center gap-1">
            <template v-for="(key, keyIndex) in normalizeKeys(shortcut.keys)" :key="keyIndex">
              <span v-if="keyIndex > 0" class="text-muted-foreground text-xs">/</span>
              <SKbd>{{ key }}</SKbd>
            </template>
          </span>
          <span class="text-sm text-muted-foreground">{{ shortcut.action }}</span>
        </div>
      </div>
    </div>

    <!-- Table variant -->
    <div v-else class="overflow-x-auto rounded-xl border border-border/70 bg-background/80 shadow-sm">
      <table class="w-full min-w-full text-left text-sm">
        <caption v-if="title" class="sr-only">{{ title }}</caption>
        <thead class="bg-muted/55 text-xs uppercase tracking-[0.16em] text-muted-foreground">
          <tr>
            <th class="px-4 py-3 font-semibold">Key</th>
            <th class="px-4 py-3 font-semibold">Action</th>
          </tr>
        </thead>
        <tbody class="bg-background/40 text-muted-foreground">
          <tr 
            v-for="(shortcut, index) in shortcuts" 
            :key="index"
            class="border-t border-border/70 align-top"
          >
            <td class="px-4 py-3 align-top">
              <span class="flex items-center gap-1">
                <template v-for="(key, keyIndex) in normalizeKeys(shortcut.keys)" :key="keyIndex">
                  <span v-if="keyIndex > 0" class="text-muted-foreground text-xs mx-1">/</span>
                  <SKbd>{{ key }}</SKbd>
                </template>
              </span>
            </td>
            <td class="px-4 py-3 align-top text-foreground/90">{{ shortcut.action }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </article>
</template>
