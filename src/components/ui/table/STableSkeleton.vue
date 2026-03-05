<script setup lang="ts">
/**
 * STableSkeleton - Skeleton loading state for tables
 * 
 * Features:
 * - Configurable row count
 * - Column-aware skeleton widths
 * - Shimmer animation
 * - Respects prefers-reduced-motion
 */
import { inject, computed } from 'vue'
import { SDataTableContextKey } from './index'

interface Props {
  /** Number of skeleton rows to show */
  rows?: number
  /** Number of columns (auto-detected from context if available) */
  columns?: number
  /** Show selection column */
  showSelection?: boolean
  /** Show actions column */
  showActions?: boolean
  /** Custom class for skeleton rows */
  skeletonClass?: string
  /** Animation style */
  animation?: 'shimmer' | 'pulse' | 'none'
  /** Progressive loading - stagger row appearance */
  progressive?: boolean
  /** Delay between progressive rows (ms) */
  progressiveDelay?: number
}

const props = withDefaults(defineProps<Props>(), {
  rows: 5,
  columns: undefined,
  showSelection: false,
  showActions: false,
  skeletonClass: '',
  animation: 'shimmer',
  progressive: false,
  progressiveDelay: 100
})

defineOptions({ inheritAttrs: false })

const context = inject(SDataTableContextKey)

const columnCount = computed(() => {
  if (props.columns !== undefined) return props.columns
  if (context) return context.visibleColumns.value.length
  return 4
})

const hasSelection = computed(() => {
  if (props.showSelection) return true
  return context?.selectionMode !== 'none'
})

// Generate random widths for more realistic skeleton
const generateWidths = (count: number): string[] => {
  return Array.from({ length: count }, () => `${40 + Math.random() * 50}%`)
}

const rowWidths = computed(() => {
  return Array.from({ length: props.rows }, () => generateWidths(columnCount.value))
})

// Animation class
const animationClass = computed(() => {
  const classes: Record<string, string> = {
    shimmer: 's-skeleton-shimmer',
    pulse: 's-skeleton-pulse',
    none: ''
  }
  return classes[props.animation]
})
</script>

<template>
  <tbody v-bind="$attrs" class="s-table-skeleton-body">
    <tr
      v-for="(widths, rowIndex) in rowWidths"
      :key="`skeleton-row-${rowIndex}`"
      class="s-table-row s-table-row-skeleton"
      :class="skeletonClass"
      :style="progressive ? { animationDelay: `${rowIndex * progressiveDelay}ms` } : {}"
    >
      <!-- Selection skeleton -->
      <td v-if="hasSelection" class="s-table-td s-table-td-skeleton-select">
        <div :class="['s-skeleton s-skeleton-checkbox', animationClass]" />
      </td>
      
      <!-- Data cells -->
      <td
        v-for="(width, colIndex) in widths"
        :key="`skeleton-cell-${rowIndex}-${colIndex}`"
        class="s-table-td"
      >
        <div 
          :class="['s-skeleton', animationClass]" 
          :style="{ width }"
        />
      </td>
      
      <!-- Actions skeleton -->
      <td v-if="showActions" class="s-table-td s-table-td-skeleton-actions">
        <div class="flex gap-2">
          <div :class="['s-skeleton s-skeleton-action', animationClass]" />
          <div :class="['s-skeleton s-skeleton-action', animationClass]" />
        </div>
      </td>
    </tr>
  </tbody>
</template>

<style scoped>
.s-table-row-skeleton {
  pointer-events: none;
}

.s-table-td {
  padding: 0.75rem 1rem;
}

/* Base skeleton */
.s-skeleton {
  height: 1rem;
  border-radius: 0.25rem;
  background-color: var(--s-bg-tertiary);
}

.s-skeleton-checkbox {
  width: 1rem;
  height: 1rem;
}

.s-skeleton-action {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.375rem;
}

/* Shimmer animation */
.s-skeleton-shimmer {
  background: linear-gradient(
    90deg,
    var(--s-bg-tertiary) 25%,
    var(--s-bg-secondary) 50%,
    var(--s-bg-tertiary) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite;
}

@keyframes skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Pulse animation */
.s-skeleton-pulse {
  animation: skeleton-pulse 2s ease-in-out infinite;
}

@keyframes skeleton-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

/* Progressive loading animation */
@keyframes skeleton-row-appear {
  0% {
    opacity: 0;
    transform: translateY(-4px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.s-table-row-skeleton {
  animation: skeleton-row-appear 0.3s ease-out forwards;
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .s-skeleton-shimmer,
  .s-skeleton-pulse {
    animation: none;
    background: var(--s-bg-tertiary);
  }
  
  .s-table-row-skeleton {
    animation: none;
    opacity: 1;
  }
}
</style>
