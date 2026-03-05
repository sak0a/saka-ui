<script setup lang="ts">
defineOptions({ inheritAttrs: false })

import { inject, computed, useAttrs } from 'vue'
import { cn } from '~/lib/utils'
import { STabsContextKey, type STabsContext } from './STabs.vue'

interface Props {
  value: string | number
  class?: string
}

const props = defineProps<Props>()
const attrs = useAttrs()

const ctx = inject<STabsContext>(STabsContextKey)
if (!ctx) console.warn('[STabsContent] Must be used inside STabs')

const isActive = computed(() => ctx?.activeTab.value === props.value)
const shouldMorph = computed(() => ctx?.animated ?? false)
</script>

<template>
  <Transition
    :name="shouldMorph ? 's-tab-morph' : 's-tab-fade'"
    mode="out-in"
  >
    <div
      v-if="isActive"
      :key="value"
      v-bind="attrs"
      :class="cn('s-tabs-content w-full', props.class)"
      role="tabpanel"
    >
      <slot />
    </div>
  </Transition>
</template>

<style scoped>
/* Base smooth fade transition (default) */
.s-tab-fade-enter-active {
  transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.s-tab-fade-leave-active {
  transition: opacity 0.12s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
}

.s-tab-fade-enter-from,
.s-tab-fade-leave-to {
  opacity: 0;
}

/* Enhanced morphing transition with blur + scale */
.s-tab-morph-enter-active {
  transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
              filter 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.s-tab-morph-leave-active {
  transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
              filter 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
}

.s-tab-morph-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
  filter: blur(6px);
}

.s-tab-morph-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
  filter: blur(6px);
}
</style>
