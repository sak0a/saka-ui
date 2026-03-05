<script setup lang="ts">
/**
 * STableEmpty - Empty state component for tables
 * 
 * Features:
 * - Customizable icon and message
 * - Action button slot
 * - Multiple visual variants
 */
import { computed } from 'vue'

interface Props {
  /** Icon class (MDI icons) */
  icon?: string
  /** Primary message */
  title?: string
  /** Secondary description */
  description?: string
  /** Visual variant */
  variant?: 'default' | 'minimal' | 'illustrated'
  /** Icon size */
  iconSize?: 'sm' | 'md' | 'lg' | 'xl'
  /** Column span (for td colspan) */
  colspan?: number
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'mdi-table-off',
  title: 'No data available',
  description: '',
  variant: 'default',
  iconSize: 'lg',
  colspan: 1
})

defineOptions({ inheritAttrs: false })

defineSlots<{
  /** Custom icon */
  icon?: () => unknown
  /** Custom title */
  title?: () => unknown
  /** Custom description */
  description?: () => unknown
  /** Action button(s) */
  action?: () => unknown
}>()

const iconSizeClasses = computed(() => {
  const sizes = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
    xl: 'text-5xl'
  }
  return sizes[props.iconSize]
})

const containerClasses = computed(() => {
  const base = 's-table-empty flex flex-col items-center justify-center py-12'
  
  const variants = {
    default: 'text-(--s-text-tertiary)',
    minimal: 'text-(--s-text-secondary) py-8',
    illustrated: 'text-(--s-text-tertiary) py-16'
  }
  
  return `${base} ${variants[props.variant]}`
})
</script>

<template>
  <tr v-bind="$attrs" class="s-table-empty-row">
    <td :colspan="colspan" class="s-table-td p-0">
      <div :class="containerClasses">
        <!-- Icon -->
        <slot name="icon">
          <div 
            class="s-table-empty-icon mb-4 opacity-40"
            :class="iconSizeClasses"
          >
            <span :class="['mdi', icon]" />
          </div>
        </slot>
        
        <!-- Title -->
        <slot name="title">
          <h3 
            v-if="title" 
            class="s-table-empty-title text-base font-medium mb-1"
          >
            {{ title }}
          </h3>
        </slot>
        
        <!-- Description -->
        <slot name="description">
          <p 
            v-if="description" 
            class="s-table-empty-description text-sm opacity-70 max-w-xs text-center"
          >
            {{ description }}
          </p>
        </slot>
        
        <!-- Action slot -->
        <div v-if="$slots.action" class="s-table-empty-action mt-4">
          <slot name="action" />
        </div>
      </div>
    </td>
  </tr>
</template>

<style scoped>
.s-table-empty-row {
  background: transparent;
}

.s-table-empty-row:hover {
  background: transparent !important;
}

/* Illustrated variant decoration */
.s-table-empty-icon {
  transition: transform 0.3s ease;
}

.s-table-empty:hover .s-table-empty-icon {
  transform: scale(1.05);
}

/* Subtle animation */
@keyframes empty-state-appear {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.s-table-empty {
  animation: empty-state-appear 0.4s ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .s-table-empty {
    animation: none;
  }
  
  .s-table-empty:hover .s-table-empty-icon {
    transform: none;
  }
}
</style>
