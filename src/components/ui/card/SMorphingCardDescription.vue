<script lang="ts">
/**
 * SMorphingCardDescription - Description content for morphing card
 * Only visible when the card is expanded
 */
</script>

<script setup lang="ts">
import { inject, computed } from 'vue'
import { SMorphingCardContextKey } from './SMorphingCard.vue'

export interface Props {
  /** Additional class */
  descriptionClass?: string
  /** Show even when collapsed (useful in trigger) */
  alwaysShow?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  descriptionClass: '',
  alwaysShow: false
})

const context = inject(SMorphingCardContextKey)

const isVisible = computed(() => props.alwaysShow || (context?.isExpanded.value ?? false))
</script>

<template>
  <Transition
    v-if="!alwaysShow"
    enter-active-class="transition-all duration-300 ease-out delay-200"
    enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-150 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-2"
  >
    <div
      v-if="isVisible"
      class="s-morphing-card-description text-(--s-text-secondary) leading-relaxed"
      :class="descriptionClass"
    >
      <slot />
    </div>
  </Transition>
  
  <div
    v-else
    class="s-morphing-card-description text-(--s-text-secondary) leading-relaxed"
    :class="descriptionClass"
  >
    <slot />
  </div>
</template>
