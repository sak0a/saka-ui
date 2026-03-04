<script lang="ts">
/**
 * SDrawerHeader - Drawer header component with title, description, and close button
 */
</script>

<script setup lang="ts">
import { inject, onMounted, onBeforeUnmount } from 'vue'
import { SDrawerContextKey, type SDrawerContext } from './SDrawer.vue'

export interface Props {
  /** Drawer title */
  title?: string
  /** Drawer description/subtitle */
  description?: string
  /** Show close button */
  closable?: boolean
  /** Show divider line */
  divider?: boolean
  /** Additional padding */
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /** Custom class */
  headerClass?: string
  /** Sticky header */
  sticky?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  description: undefined,
  closable: true,
  divider: true,
  padding: 'md',
  headerClass: '',
  sticky: false
})

const context = inject(SDrawerContextKey) as SDrawerContext

const paddingClasses = {
  none: '',
  sm: 'px-4 py-3',
  md: 'px-6 py-5',
  lg: 'px-8 py-6'
}

onMounted(() => {
  context?.setHasHeader(true)
})

onBeforeUnmount(() => {
  context?.setHasHeader(false)
})
</script>

<template>
  <div
    class="s-drawer-header flex items-start justify-between gap-4 shrink-0"
    :class="[
      paddingClasses[padding],
      divider ? 'border-b border-(--s-border)' : '',
      sticky ? 'sticky top-0 z-10 bg-(--s-bg-primary)' : '',
      headerClass
    ]"
  >
    <div class="flex-1 min-w-0">
      <!-- Title -->
      <h2
        v-if="title"
        :id="context?.titleId"
        class="text-lg font-semibold text-(--s-text-primary) tracking-tight"
      >
        {{ title }}
      </h2>
      
      <!-- Title slot for custom content -->
      <slot name="title" />

      <!-- Description -->
      <p
        v-if="description"
        :id="context?.descriptionId"
        class="mt-1.5 text-sm text-(--s-text-secondary) leading-relaxed"
      >
        {{ description }}
      </p>
      
      <!-- Description slot -->
      <slot name="description" />
    </div>

    <!-- Extra content (between title and close button) -->
    <slot name="extra" />

    <!-- Close button -->
    <button
      v-if="closable"
      type="button"
      class="s-drawer-close shrink-0 flex items-center justify-center w-8 h-8 -mt-1 -mr-2 rounded-lg text-(--s-text-tertiary) hover:text-(--s-text-primary) hover:bg-(--s-bg-tertiary) transition-all duration-150 outline-none focus:ring-2 focus:ring-(--s-primary)/30 focus:ring-offset-0"
      aria-label="Close drawer"
      @click="context?.close()"
    >
      <span class="mdi mdi-close text-xl" />
    </button>
  </div>
</template>

<style scoped>
.s-drawer-header {
  background: inherit;
}
</style>
