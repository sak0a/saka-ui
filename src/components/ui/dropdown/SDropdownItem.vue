<script setup lang="ts">
defineOptions({ inheritAttrs: false })

import { inject, computed, onMounted, onBeforeUnmount } from 'vue'
import { cn } from '~/lib/utils'
import { SDropdownContextKey, type SDropdownContext } from './SDropdown.vue'

export interface Props {
  /** Unique key for the item */
  itemKey: string
  /** Item label text */
  label?: string
  /** Leading icon (MDI icon name) */
  icon?: string
  /** Trailing icon */
  trailingIcon?: string
  /** Description text below label */
  description?: string
  /** Keyboard shortcut display */
  shortcut?: string
  /** Disable the item */
  disabled?: boolean
  /** Danger/destructive styling */
  danger?: boolean
  /** Checkable state (undefined = not checkable) */
  checked?: boolean
  /** Custom color for this item */
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  icon: undefined,
  trailingIcon: undefined,
  description: undefined,
  shortcut: undefined,
  disabled: false,
  danger: false,
  checked: undefined,
  color: undefined
})

const emit = defineEmits<{
  'click': [event: MouseEvent]
  'update:checked': [checked: boolean]
}>()

// Inject context from parent dropdown
const context = inject<SDropdownContext>(SDropdownContextKey)

// Register with parent
let itemIndex = -1

onMounted(() => {
  if (context) {
    itemIndex = context.registerItem({ 
      key: props.itemKey, 
      disabled: props.disabled 
    })
  }
})

onBeforeUnmount(() => {
  if (context) {
    context.unregisterItem(props.itemKey)
  }
})

// Size configurations - reduced padding for tighter, cleaner look
const sizeConfig = computed(() => ({
  small: {
    item: 'px-2 py-1 text-xs',
    icon: 'text-sm'
  },
  medium: {
    item: 'px-2.5 py-1.5 text-sm',
    icon: 'text-base'
  },
  large: {
    item: 'px-3 py-2 text-base',
    icon: 'text-lg'
  }
}[context?.size ?? 'medium']))

const accentColor = computed(() => props.color ?? context?.color ?? 'var(--s-primary)')

const isHighlighted = computed(() => {
  if (!context) return false
  return context.highlightedIndex.value === itemIndex
})

const handleClick = (event: MouseEvent) => {
  if (props.disabled) return
  
  emit('click', event)
  
  if (props.checked !== undefined) {
    emit('update:checked', !props.checked)
  }
  
  if (context) {
    context.selectItem(props.itemKey)
  }
}
</script>

<template>
  <div
    role="menuitem"
    :tabindex="disabled ? -1 : 0"
    :class="cn('s-dropdown-item relative flex items-center cursor-pointer transition-all duration-150 select-none rounded-lg group', sizeConfig.item, {
        'opacity-50 cursor-not-allowed': disabled,
        'text-red-500 hover:bg-red-500/10': danger && !disabled,
        'text-foreground hover:bg-accent': !danger && !disabled,
        'bg-accent': isHighlighted && !disabled
      }, $attrs.class ?? '')"
    v-bind="$attrs"
    @click="handleClick"
  >
    <!-- Checkbox for checkable items -->
    <span 
      v-if="checked !== undefined"
      class="mdi mr-2.5 transition-all duration-150"
      :class="[
        checked ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline',
        sizeConfig.icon,
        checked ? '' : 'text-muted-foreground'
      ]"
      :style="checked ? { color: accentColor } : {}"
    />
    
    <!-- Leading icon -->
    <span 
      v-else-if="icon"
      :class="['mdi', `mdi-${icon}`, sizeConfig.icon, 'mr-2.5', danger ? '' : 'text-muted-foreground group-hover:text-foreground']"
    />

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <slot>
        <div class="truncate">{{ label }}</div>
      </slot>
      <div 
        v-if="description" 
        class="text-xs truncate mt-0.5"
        :class="danger ? 'text-red-400' : 'text-muted-foreground'"
      >
        {{ description }}
      </div>
    </div>

    <!-- Trailing content -->
    <div class="flex items-center gap-2 ml-4 shrink-0">
      <!-- Keyboard shortcut -->
      <kbd 
        v-if="shortcut"
        class="px-1.5 py-0.5 text-[10px] font-mono rounded bg-background text-muted-foreground border border-border"
      >
        {{ shortcut }}
      </kbd>
      
      <!-- Trailing icon -->
      <span 
        v-if="trailingIcon"
        :class="['mdi', `mdi-${trailingIcon}`, sizeConfig.icon, 'text-muted-foreground']"
      />
      
      <!-- Custom trailing slot -->
      <slot name="trailing" />
    </div>
  </div>
</template>

<style scoped>
.s-dropdown-item:focus-visible {
  outline: none;
  background-color: var(--s-accent);
}
</style>
