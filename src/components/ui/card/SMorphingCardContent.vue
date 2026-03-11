<script setup lang="ts">
/**
 * SMorphingCardContent - Content wrapper for expanded morphing card
 */
import { inject, computed } from 'vue'
import { SMorphingCardContextKey } from './morphing-context'

export interface Props {
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /** Additional class */
  contentClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  padding: 'md',
  contentClass: ''
})

const context = inject(SMorphingCardContextKey)

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
}

const isExpanded = computed(() => context?.isExpanded.value ?? false)
</script>

<template>
  <div
    :id="`${context?.uniqueId}-content`"
    class="s-morphing-card-content-inner flex flex-col h-full overflow-y-auto overscroll-contain"
    :class="[paddingClasses[padding], contentClass]"
  >
    <!-- Content with staggered fade-in animation -->
    <Transition
      enter-active-class="transition-all duration-(--s-duration-slow) ease-out delay-150"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div v-if="isExpanded" class="flex-1">
        <slot />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.s-morphing-card-content-inner {
  scrollbar-width: thin;
  scrollbar-color: var(--s-border) transparent;
}

.s-morphing-card-content-inner::-webkit-scrollbar {
  width: 6px;
}

.s-morphing-card-content-inner::-webkit-scrollbar-track {
  background: transparent;
}

.s-morphing-card-content-inner::-webkit-scrollbar-thumb {
  background: var(--s-border);
  border-radius: 3px;
}
</style>
