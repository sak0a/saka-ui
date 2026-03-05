<script setup lang="ts">
defineOptions({ inheritAttrs: false })

import { inject, computed } from 'vue'
import { SDropdownContextKey, type SDropdownContext } from './SDropdown.vue'

export interface Props {
  /** Group header label */
  label: string
  /** Icon for the header */
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  icon: undefined
})

// Inject context from parent dropdown
const context = inject<SDropdownContext>(SDropdownContextKey)

const sizeConfig = computed(() => ({
  small: 'px-2 pt-1.5 pb-0.5 text-[10px]',
  medium: 'px-2.5 pt-2 pb-1 text-[11px]',
  large: 'px-3 pt-2.5 pb-1 text-xs'
}[context?.size ?? 'medium']))
</script>

<template>
  <div class="s-dropdown-group" v-bind="$attrs">
    <!-- Group header -->
    <div 
      class="font-semibold uppercase tracking-wider text-(--s-text-tertiary) flex items-center gap-2 sticky top-0 bg-(--s-bg-primary)/95 backdrop-blur-sm"
      :class="sizeConfig"
    >
      <span v-if="icon" :class="['mdi', `mdi-${icon}`, 'text-xs']" />
      <span>{{ label }}</span>
    </div>
    
    <!-- Group items -->
    <div class="s-dropdown-group-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.s-dropdown-group + .s-dropdown-group {
  margin-top: 4px;
  padding-top: 4px;
  border-top: 1px solid var(--s-border);
}
</style>
