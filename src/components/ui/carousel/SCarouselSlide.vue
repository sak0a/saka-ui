<script lang="ts">
/**
 * SCarouselSlide - Carousel Slide Component
 * Child component for slide content within SCarousel
 */
import { type InjectionKey, type Ref } from 'vue'

export interface SlideInfo {
  index: number
  isActive: boolean
  isVisible: boolean
}

export interface SCarouselContext {
  registerSlide: (el: HTMLElement | null, index: number) => void
  unregisterSlide: (index: number) => void
  activeIndex: Ref<number>
  effect: string
  direction: string
  slidesPerView: number
}

export const SCarouselContextKey: InjectionKey<SCarouselContext> = Symbol('SCarouselContext')
</script>

<script setup lang="ts">
import { inject, ref, computed, onMounted, onUnmounted } from 'vue'

export interface Props {
  lazy?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  lazy: false
})

const context = inject(SCarouselContextKey)
const slideRef = ref<HTMLElement | null>(null)
const slideIndex = ref(-1)

// Determine slide index from parent
onMounted(() => {
  if (context && slideRef.value) {
    const parent = slideRef.value.parentElement
    if (parent) {
      const slides = Array.from(parent.querySelectorAll('.s-carousel-slide'))
      slideIndex.value = slides.indexOf(slideRef.value)
      context.registerSlide(slideRef.value, slideIndex.value)
    }
  }
})

onUnmounted(() => {
  if (context && slideIndex.value >= 0) {
    context.unregisterSlide(slideIndex.value)
  }
})

const isActive = computed(() => {
  if (!context) return false
  return context.activeIndex.value === slideIndex.value
})

const isVisible = computed(() => {
  if (!context) return true
  const { activeIndex, slidesPerView } = context
  const start = activeIndex.value
  const end = start + slidesPerView
  return slideIndex.value >= start && slideIndex.value < end
})

const shouldLoad = computed(() => {
  if (!props.lazy) return true
  return isVisible.value || isActive.value
})
</script>

<template>
  <div
    ref="slideRef"
    class="s-carousel-slide shrink-0 w-full h-full relative overflow-hidden"
    :class="{
      's-carousel-slide--active': isActive,
      's-carousel-slide--visible': isVisible
    }"
    :data-index="slideIndex"
  >
    <template v-if="shouldLoad">
      <slot :isActive="isActive" :isVisible="isVisible" :index="slideIndex" />
    </template>
    
    <!-- Overlay slot -->
    <div v-if="$slots.overlay" class="absolute inset-0 pointer-events-none">
      <slot name="overlay" :isActive="isActive" :isVisible="isVisible" :index="slideIndex" />
    </div>
  </div>
</template>

<style scoped>
.s-carousel-slide {
  user-select: none;
  -webkit-user-drag: none;
}
</style>
