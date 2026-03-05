<script setup lang="ts">
import { computed, inject } from 'vue'
import { cn } from '~/lib/utils'
import { cardContextKey, type CardContext } from './index'

defineOptions({ inheritAttrs: false })

export interface Props {
  /** Title text */
  title?: string
  /** Subtitle text */
  subtitle?: string
  /** Avatar image URL */
  avatar?: string
  /** Avatar fallback text (initials) */
  avatarFallback?: string
  /** Icon name (MDI) */
  icon?: string
  /** Icon color */
  iconColor?: string
  /** Show divider below header */
  divider?: boolean
  /** Layout direction */
  layout?: 'horizontal' | 'vertical'
  /** Alignment */
  align?: 'start' | 'center' | 'end'
  /** Custom padding */
  padding?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  subtitle: undefined,
  avatar: undefined,
  avatarFallback: undefined,
  icon: undefined,
  iconColor: 'var(--s-primary)',
  divider: false,
  layout: 'horizontal',
  align: 'start'
})

// Card context available for future enhancements
inject(cardContextKey, {
  variant: 'elevated',
  hoverable: false,
  loading: false,
  horizontal: false
} as CardContext)

const alignmentClasses = computed(() => {
  if (props.layout === 'vertical') {
    const alignments = {
      start: 'items-start text-left',
      center: 'items-center text-center',
      end: 'items-end text-right'
    }
    return alignments[props.align]
  }
  return ''
})

const computedStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.padding) style.padding = props.padding
  return style
})
</script>

<template>
  <div
    v-bind="$attrs"
    :class="cn(
      's-card-header',
      {
        'flex items-center gap-3': layout === 'horizontal',
        'flex flex-col gap-2': layout === 'vertical',
        'pb-4 border-b border-border': divider
      },
      alignmentClasses,
      ($attrs.class as string)
    )"
    :style="computedStyle"
  >
    <!-- Avatar/Icon -->
    <div 
      v-if="avatar || avatarFallback || icon || $slots.avatar" 
      class="shrink-0"
    >
      <slot name="avatar">
        <!-- Avatar with image -->
        <div 
          v-if="avatar" 
          class="w-10 h-10 rounded-full overflow-hidden ring-2 ring-border"
        >
          <img 
            :src="avatar" 
            :alt="title || 'Avatar'"
            class="w-full h-full object-cover"
          />
        </div>
        
        <!-- Avatar with fallback -->
        <div 
          v-else-if="avatarFallback" 
          class="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-sm font-semibold text-muted-foreground"
        >
          {{ avatarFallback }}
        </div>
        
        <!-- Icon -->
        <div 
          v-else-if="icon" 
          class="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center"
        >
          <span 
            class="mdi text-xl"
            :class="`mdi-${icon}`"
            :style="{ color: iconColor }"
          />
        </div>
      </slot>
    </div>
    
    <!-- Text content -->
    <div class="flex-1 min-w-0">
      <slot name="title">
        <h3 
          v-if="title" 
          class="text-base font-semibold text-foreground leading-tight truncate"
        >
          {{ title }}
        </h3>
      </slot>
      
      <slot name="subtitle">
        <p 
          v-if="subtitle" 
          class="text-sm text-muted-foreground mt-0.5 truncate"
        >
          {{ subtitle }}
        </p>
      </slot>
    </div>
    
    <!-- Actions slot (right side) -->
    <div 
      v-if="$slots.actions" 
      class="shrink-0 flex items-center gap-2"
    >
      <slot name="actions" />
    </div>
    
    <!-- Default slot for custom content -->
    <slot />
  </div>
</template>

<style scoped>
.s-card-header {
  /* Inherits from parent */
}
</style>
