<script setup lang="ts">
import { provide, ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { cn } from '../../../lib/utils'
import { SCarouselContextKey, type SCarouselContext } from './context'

defineOptions({ inheritAttrs: false })

export type CarouselEffect = 
  | 'slide' | 'fade' | 'cube' | 'flip' | 'coverflow' | 'cards'
  | 'zoom' | 'creative' | 'parallax' | 'stack' | 'swirl' | 'kenburns'
export type CarouselDirection = 'horizontal' | 'vertical'
export type DotsPosition = 'bottom' | 'top' | 'left' | 'right'
export type DotsStyle = 'dots' | 'bars' | 'numbers' | 'fraction'
export type ArrowStyle = 'default' | 'minimal' | 'rounded' | 'square'
export type ArrowPlacement = 
  | 'sides'           // Classic left/right or top/bottom on sides (default)
  | 'bottom-right'    // Both arrows grouped in bottom-right corner
  | 'bottom-left'     // Both arrows grouped in bottom-left corner
  | 'top-right'       // Both arrows grouped in top-right corner
  | 'top-left'        // Both arrows grouped in top-left corner
  | 'bottom-center'   // Both arrows grouped at bottom center
  | 'top-center'      // Both arrows grouped at top center

export interface Props {
  modelValue?: number
  effect?: CarouselEffect
  direction?: CarouselDirection
  loop?: boolean
  rewind?: boolean
  autoplay?: boolean
  autoplayDelay?: number
  pauseOnHover?: boolean
  pauseOnInteraction?: boolean
  speed?: number
  easing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear' | 'spring' | 'bounce'
  showArrows?: boolean
  showDots?: boolean
  showProgress?: boolean
  showThumbnails?: boolean
  showCounter?: boolean
  arrowsInside?: boolean
  arrowStyle?: ArrowStyle
  arrowPlacement?: ArrowPlacement
  dotsPosition?: DotsPosition
  dotsStyle?: DotsStyle
  gap?: number
  slidesPerView?: number
  slidesPerGroup?: number
  centeredSlides?: boolean
  height?: string
  aspectRatio?: string
  borderRadius?: string
  arrowSize?: 'small' | 'medium' | 'large'
  mousewheel?: boolean
  grabCursor?: boolean
  watchSlidesProgress?: boolean
  virtualSlides?: boolean
  freeMode?: boolean
  freeModeSticky?: boolean
  resistance?: boolean
  resistanceRatio?: number
  touchSensitivity?: number
  preventClicks?: boolean
  slideVisibleClass?: string
  slideActiveClass?: string
  containerClass?: string
  a11y?: boolean
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  effect: 'slide',
  direction: 'horizontal',
  loop: false,
  rewind: false,
  autoplay: false,
  autoplayDelay: 3000,
  pauseOnHover: true,
  pauseOnInteraction: true,
  speed: 500,
  easing: 'ease-out',
  showArrows: true,
  showDots: true,
  showProgress: false,
  showThumbnails: false,
  showCounter: false,
  arrowsInside: true,
  arrowStyle: 'default',
  arrowPlacement: 'sides',
  dotsPosition: 'bottom',
  dotsStyle: 'dots',
  gap: 0,
  slidesPerView: 1,
  slidesPerGroup: 1,
  centeredSlides: false,
  height: '400px',
  aspectRatio: '',
  borderRadius: '16px',
  arrowSize: 'medium',
  mousewheel: false,
  grabCursor: true,
  watchSlidesProgress: false,
  virtualSlides: false,
  freeMode: false,
  freeModeSticky: false,
  resistance: true,
  resistanceRatio: 0.85,
  touchSensitivity: 1,
  preventClicks: true,
  slideVisibleClass: '',
  slideActiveClass: '',
  containerClass: '',
  a11y: true,
  ariaLabel: 'Image carousel'
})

const emit = defineEmits<{
  'update:modelValue': [index: number]
  'change': [index: number]
  'slideStart': [index: number]
  'slideEnd': [index: number]
  'autoplayStart': []
  'autoplayStop': []
  'autoplayPause': []
  'autoplayResume': []
  'reachStart': []
  'reachEnd': []
  'touchStart': [event: TouchEvent | MouseEvent]
  'touchMove': [event: TouchEvent | MouseEvent]
  'touchEnd': []
  'click': [index: number]
  'doubleClick': [index: number]
}>()

// Refs
const containerRef = ref<HTMLElement | null>(null)
const activeIndex = ref(props.modelValue)
const slideElements = ref<Map<number, HTMLElement>>(new Map())
const slideProgress = ref<Map<number, number>>(new Map())
const isTransitioning = ref(false)
const isHovering = ref(false)
const isPaused = ref(false)
const autoplayTimer = ref<number | null>(null)
const progressPercent = ref(0)
const progressTimer = ref<number | null>(null)
const velocity = ref(0)
const lastMoveTime = ref(0)

// Touch/drag handling
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const dragOffset = ref(0)
const dragThreshold = 50

// Computed
const totalSlides = computed(() => slideElements.value.size)
const canGoPrev = computed(() => {
  if (props.loop) return true
  if (props.rewind && activeIndex.value === 0) return true
  return activeIndex.value > 0
})
const canGoNext = computed(() => {
  if (props.loop) return true
  if (props.rewind && activeIndex.value >= totalSlides.value - props.slidesPerView) return true
  return activeIndex.value < totalSlides.value - props.slidesPerView
})

const easingFunction = computed(() => {
  const easings: Record<string, string> = {
    'ease': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    'ease-in': 'cubic-bezier(0.42, 0, 1, 1)',
    'ease-out': 'cubic-bezier(0, 0, 0.58, 1)',
    'ease-in-out': 'cubic-bezier(0.42, 0, 0.58, 1)',
    'linear': 'linear',
    'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  }
  return easings[props.easing]
})

const arrowSizeClasses = computed(() => {
  const sizes = {
    small: 'w-8 h-8 text-lg',
    medium: 'w-10 h-10 text-xl',
    large: 'w-12 h-12 text-2xl'
  }
  return sizes[props.arrowSize]
})

const arrowStyleClasses = computed(() => {
  const styles: Record<string, string> = {
    'default': 'rounded-full',
    'minimal': 'bg-transparent! shadow-none! hover:bg-background/50!',
    'rounded': 'rounded-2xl',
    'square': 'rounded-lg'
  }
  return styles[props.arrowStyle]
})

// Effect-specific styles
const trackStyle = computed(() => {
  const baseStyle: Record<string, string> = {
    '--carousel-speed': `${props.speed}ms`,
    '--carousel-gap': `${props.gap}px`,
    '--carousel-easing': easingFunction.value
  }
  
  if (props.effect === 'slide' || props.effect === 'parallax') {
    const offset = props.direction === 'horizontal'
      ? `translateX(calc(-${activeIndex.value * 100}% - ${activeIndex.value * props.gap}px + ${isDragging.value ? dragOffset.value : 0}px))`
      : `translateY(calc(-${activeIndex.value * 100}% - ${activeIndex.value * props.gap}px + ${isDragging.value ? dragOffset.value : 0}px))`
    baseStyle.transform = offset
  }
  
  return baseStyle
})

const containerStyle = computed(() => {
  const style: Record<string, string> = {
    borderRadius: props.borderRadius
  }
  
  if (props.aspectRatio) {
    style.aspectRatio = props.aspectRatio
  } else {
    style.height = props.height
  }
  
  return style
})

// Methods
const registerSlide = (el: HTMLElement | null, index: number) => {
  if (el) {
    slideElements.value.set(index, el)
  }
}

const unregisterSlide = (index: number) => {
  slideElements.value.delete(index)
  slideProgress.value.delete(index)
}

const updateSlideProgress = () => {
  if (!props.watchSlidesProgress) return
  
  slideElements.value.forEach((_el, index) => {
    const progress = Math.abs(index - activeIndex.value)
    slideProgress.value.set(index, progress)
  })
}

const goTo = (index: number, skipTransition = false) => {
  if (isTransitioning.value && !skipTransition) return
  
  let targetIndex = index
  
  if (props.loop) {
    if (index < 0) targetIndex = totalSlides.value - 1
    else if (index >= totalSlides.value) targetIndex = 0
  } else if (props.rewind) {
    if (index < 0) targetIndex = totalSlides.value - 1
    else if (index >= totalSlides.value) targetIndex = 0
  } else {
    targetIndex = Math.max(0, Math.min(index, totalSlides.value - props.slidesPerView))
  }
  
  if (targetIndex === activeIndex.value && !skipTransition) return
  
  // Check for edge events
  if (targetIndex === 0) emit('reachStart')
  if (targetIndex === totalSlides.value - 1) emit('reachEnd')
  
  isTransitioning.value = true
  emit('slideStart', targetIndex)
  
  activeIndex.value = targetIndex
  emit('update:modelValue', targetIndex)
  emit('change', targetIndex)
  
  updateSlideProgress()
  
  setTimeout(() => {
    isTransitioning.value = false
    emit('slideEnd', targetIndex)
  }, props.speed)
}

const next = () => goTo(activeIndex.value + props.slidesPerGroup)
const prev = () => goTo(activeIndex.value - props.slidesPerGroup)

// Autoplay
const startAutoplay = () => {
  if (!props.autoplay || autoplayTimer.value || isPaused.value) return
  
  emit('autoplayStart')
  progressPercent.value = 0
  
  // Progress animation
  if (props.showProgress) {
    const startTime = Date.now()
    const animate = () => {
      const elapsed = Date.now() - startTime
      progressPercent.value = Math.min((elapsed / props.autoplayDelay) * 100, 100)
      if (progressPercent.value < 100) {
        progressTimer.value = requestAnimationFrame(animate)
      }
    }
    progressTimer.value = requestAnimationFrame(animate)
  }
  
  autoplayTimer.value = window.setTimeout(() => {
    next()
    autoplayTimer.value = null
    progressPercent.value = 0
    startAutoplay()
  }, props.autoplayDelay)
}

const stopAutoplay = () => {
  if (autoplayTimer.value) {
    clearTimeout(autoplayTimer.value)
    autoplayTimer.value = null
  }
  if (progressTimer.value) {
    cancelAnimationFrame(progressTimer.value)
    progressTimer.value = null
  }
  progressPercent.value = 0
  emit('autoplayStop')
}

const pauseAutoplay = () => {
  isPaused.value = true
  stopAutoplay()
  emit('autoplayPause')
}

const resumeAutoplay = () => {
  isPaused.value = false
  startAutoplay()
  emit('autoplayResume')
}

const start = () => startAutoplay()
const stop = () => stopAutoplay()
const pause = () => pauseAutoplay()
const resume = () => resumeAutoplay()

// Mouse/Touch handlers
const handleMouseEnter = () => {
  isHovering.value = true
  if (props.pauseOnHover && props.autoplay) {
    stopAutoplay()
  }
}

const handleMouseLeave = () => {
  isHovering.value = false
  if (props.pauseOnHover && props.autoplay && !isPaused.value) {
    startAutoplay()
  }
}

const handleDragStart = (e: MouseEvent | TouchEvent) => {
  if (isTransitioning.value) return
  
  emit('touchStart', e)
  isDragging.value = true
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
  dragStart.value = { x: clientX, y: clientY }
  dragOffset.value = 0
  lastMoveTime.value = Date.now()
  velocity.value = 0
  
  if (props.pauseOnInteraction && props.autoplay) stopAutoplay()
}

const handleDragMove = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return
  
  emit('touchMove', e)
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
  
  const newOffset = props.direction === 'horizontal'
    ? (clientX - dragStart.value.x) * props.touchSensitivity
    : (clientY - dragStart.value.y) * props.touchSensitivity
  
  // Calculate velocity for momentum
  const now = Date.now()
  const dt = now - lastMoveTime.value
  if (dt > 0) {
    velocity.value = (newOffset - dragOffset.value) / dt
  }
  lastMoveTime.value = now
  
  // Apply resistance at edges
  if (props.resistance && !props.loop) {
    const isAtStart = activeIndex.value === 0 && newOffset > 0
    const isAtEnd = activeIndex.value >= totalSlides.value - 1 && newOffset < 0
    if (isAtStart || isAtEnd) {
      dragOffset.value = newOffset * props.resistanceRatio
      return
    }
  }
  
  dragOffset.value = newOffset
}

const handleDragEnd = () => {
  if (!isDragging.value) return
  
  emit('touchEnd')
  isDragging.value = false
  
  // Use velocity for momentum-based navigation in free mode
  const threshold = props.freeMode ? dragThreshold / 2 : dragThreshold
  const velocityThreshold = 0.3
  
  const shouldNavigate = Math.abs(dragOffset.value) > threshold || 
    (props.freeMode && Math.abs(velocity.value) > velocityThreshold)
  
  if (shouldNavigate) {
    if (dragOffset.value > 0 || (props.freeMode && velocity.value > velocityThreshold)) {
      prev()
    } else {
      next()
    }
  }
  
  dragOffset.value = 0
  velocity.value = 0
  
  if (props.autoplay && !isHovering.value && !isPaused.value) {
    startAutoplay()
  }
}

// Mousewheel navigation
const handleWheel = (e: WheelEvent) => {
  if (!props.mousewheel) return
  
  e.preventDefault()
  
  if (isTransitioning.value) return
  
  const delta = props.direction === 'horizontal' ? e.deltaX || e.deltaY : e.deltaY
  
  if (delta > 0) {
    next()
  } else if (delta < 0) {
    prev()
  }
}

// Keyboard navigation
const handleKeydown = (e: KeyboardEvent) => {
  if (props.direction === 'horizontal') {
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
    if (e.key === 'ArrowRight') { e.preventDefault(); next() }
  } else {
    if (e.key === 'ArrowUp') { e.preventDefault(); prev() }
    if (e.key === 'ArrowDown') { e.preventDefault(); next() }
  }
  if (e.key === 'Home') { e.preventDefault(); goTo(0) }
  if (e.key === 'End') { e.preventDefault(); goTo(totalSlides.value - 1) }
}

// Watch for external modelValue changes
watch(() => props.modelValue, (newVal) => {
  if (newVal !== activeIndex.value) {
    goTo(newVal)
  }
})

// Lifecycle
onMounted(() => {
  if (containerRef.value) {
    containerRef.value.addEventListener('keydown', handleKeydown)
    if (props.mousewheel) {
      containerRef.value.addEventListener('wheel', handleWheel, { passive: false })
    }
  }
  
  nextTick(() => {
    if (props.autoplay) {
      startAutoplay()
    }
    updateSlideProgress()
  })
})

onUnmounted(() => {
  stopAutoplay()
  if (containerRef.value) {
    containerRef.value.removeEventListener('keydown', handleKeydown)
    containerRef.value.removeEventListener('wheel', handleWheel)
  }
})

// Provide context to slides
provide<SCarouselContext>(SCarouselContextKey, {
  registerSlide,
  unregisterSlide,
  activeIndex,
  effect: props.effect,
  direction: props.direction,
  slidesPerView: props.slidesPerView
})

// Expose methods
defineExpose({
  next,
  prev,
  goTo,
  start,
  stop,
  pause,
  resume,
  activeIndex,
  totalSlides,
  isTransitioning,
  slideProgress
})
</script>

<template>
  <div
    ref="containerRef"
    v-bind="$attrs"
    :class="cn('s-carousel relative overflow-hidden bg-muted select-none', [
      `s-carousel--${effect}`,
      `s-carousel--${direction}`,
      { 's-carousel--dragging': isDragging },
      { 'cursor-grab': grabCursor && !isDragging },
      { 'cursor-grabbing': grabCursor && isDragging },
      containerClass
    ], $attrs.class ?? '')"
    :style="containerStyle"
    tabindex="0"
    :role="a11y ? 'region' : undefined"
    :aria-roledescription="a11y ? 'carousel' : undefined"
    :aria-label="a11y ? ariaLabel : undefined"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @mousedown="handleDragStart"
    @mousemove="handleDragMove"
    @mouseup="handleDragEnd"
    @mouseleave.capture="handleDragEnd"
    @touchstart.passive="handleDragStart"
    @touchmove.passive="handleDragMove"
    @touchend="handleDragEnd"
  >
    <!-- Track / Slides Container -->
    <div
      class="s-carousel__track h-full"
      :class="{
        'flex': ['slide', 'parallax'].includes(effect),
        'flex-row': ['slide', 'parallax'].includes(effect) && direction === 'horizontal',
        'flex-col': ['slide', 'parallax'].includes(effect) && direction === 'vertical',
        'relative': !['slide', 'parallax'].includes(effect),
      }"
      :style="trackStyle"
    >
      <slot />
    </div>
    
    <!-- Progress Bar -->
    <div
      v-if="showProgress && autoplay"
      class="s-carousel__progress absolute bottom-0 left-0 right-0 h-1 bg-black/20 z-30"
    >
      <div
        class="h-full bg-primary transition-none"
        :style="{ width: `${progressPercent}%` }"
      />
    </div>
    
    <!-- Slide Counter -->
    <div
      v-if="showCounter"
      class="s-carousel__counter absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm font-medium"
    >
      {{ activeIndex + 1 }} / {{ totalSlides }}
    </div>
    
    <!-- Navigation Arrows -->
    <template v-if="showArrows">
      <!-- Grouped Arrow Placements (corner/center positions) -->
      <div
        v-if="arrowPlacement !== 'sides'"
        class="s-carousel__arrows absolute z-20 flex gap-2"
        :class="{
          'bottom-4 right-4': arrowPlacement === 'bottom-right',
          'bottom-4 left-4': arrowPlacement === 'bottom-left',
          'top-4 right-4': arrowPlacement === 'top-right',
          'top-4 left-4': arrowPlacement === 'top-left',
          'bottom-4 left-1/2 -translate-x-1/2': arrowPlacement === 'bottom-center',
          'top-4 left-1/2 -translate-x-1/2': arrowPlacement === 'top-center',
        }"
      >
        <button
          class="s-carousel__arrow s-carousel__arrow--prev flex items-center justify-center bg-background/90 backdrop-blur-sm text-foreground shadow-lg transition-all duration-300 hover:scale-110 hover:bg-background disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
          :class="[arrowSizeClasses, arrowStyleClasses]"
          :disabled="!canGoPrev"
          @click.stop="prev"
          :aria-label="a11y ? 'Previous slide' : undefined"
        >
          <span class="mdi mdi-chevron-left" />
        </button>
        
        <button
          class="s-carousel__arrow s-carousel__arrow--next flex items-center justify-center bg-background/90 backdrop-blur-sm text-foreground shadow-lg transition-all duration-300 hover:scale-110 hover:bg-background disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
          :class="[arrowSizeClasses, arrowStyleClasses]"
          :disabled="!canGoNext"
          @click.stop="next"
          :aria-label="a11y ? 'Next slide' : undefined"
        >
          <span class="mdi mdi-chevron-right" />
        </button>
      </div>
      
      <!-- Side Arrow Placement (classic left/right or top/bottom) -->
      <template v-else>
        <button
          class="s-carousel__arrow s-carousel__arrow--prev absolute z-20 flex items-center justify-center bg-background/90 backdrop-blur-sm text-foreground shadow-lg transition-all duration-300 hover:scale-110 hover:bg-background disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
          :class="[
            arrowSizeClasses,
            arrowStyleClasses,
            direction === 'horizontal' 
              ? (arrowsInside ? 'left-4 top-1/2 -translate-y-1/2' : '-left-14 top-1/2 -translate-y-1/2')
              : (arrowsInside ? 'top-4 left-1/2 -translate-x-1/2' : 'top-4 left-1/2 -translate-x-1/2')
          ]"
          :disabled="!canGoPrev"
          @click.stop="prev"
          :aria-label="a11y ? 'Previous slide' : undefined"
        >
          <span 
            class="mdi" 
            :class="direction === 'horizontal' ? 'mdi-chevron-left' : 'mdi-chevron-up'"
          />
        </button>
        
        <button
          class="s-carousel__arrow s-carousel__arrow--next absolute z-20 flex items-center justify-center bg-background/90 backdrop-blur-sm text-foreground shadow-lg transition-all duration-300 hover:scale-110 hover:bg-background disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
          :class="[
            arrowSizeClasses,
            arrowStyleClasses,
            direction === 'horizontal' 
              ? (arrowsInside ? 'right-4 top-1/2 -translate-y-1/2' : '-right-14 top-1/2 -translate-y-1/2')
              : (arrowsInside ? 'bottom-4 left-1/2 -translate-x-1/2' : 'bottom-4 left-1/2 -translate-x-1/2')
          ]"
          :disabled="!canGoNext"
          @click.stop="next"
          :aria-label="a11y ? 'Next slide' : undefined"
        >
          <span 
            class="mdi" 
            :class="direction === 'horizontal' ? 'mdi-chevron-right' : 'mdi-chevron-down'"
          />
        </button>
      </template>
    </template>
    
    <!-- Pagination -->
    <div
      v-if="showDots && totalSlides > 1"
      class="s-carousel__dots absolute z-20 flex gap-2"
      :class="{
        'bottom-4 left-1/2 -translate-x-1/2 flex-row': dotsPosition === 'bottom',
        'top-4 left-1/2 -translate-x-1/2 flex-row': dotsPosition === 'top',
        'left-4 top-1/2 -translate-y-1/2 flex-col': dotsPosition === 'left',
        'right-4 top-1/2 -translate-y-1/2 flex-col': dotsPosition === 'right',
      }"
      role="tablist"
    >
      <!-- Dots Style -->
      <template v-if="dotsStyle === 'dots'">
        <button
          v-for="i in totalSlides"
          :key="i - 1"
          class="s-carousel__dot w-2.5 h-2.5 rounded-full transition-all duration-300"
          :class="activeIndex === i - 1 
            ? 'bg-primary scale-125' 
            : 'bg-muted-foreground/50 hover:bg-muted-foreground'"
          role="tab"
          :aria-selected="activeIndex === i - 1"
          :aria-label="a11y ? `Go to slide ${i}` : undefined"
          @click.stop="goTo(i - 1)"
        />
      </template>
      
      <!-- Bars Style -->
      <template v-else-if="dotsStyle === 'bars'">
        <button
          v-for="i in totalSlides"
          :key="i - 1"
          class="s-carousel__bar h-1 rounded-full transition-all duration-300"
          :class="activeIndex === i - 1 
            ? 'bg-primary w-8' 
            : 'bg-muted-foreground/50 hover:bg-muted-foreground w-4'"
          role="tab"
          :aria-selected="activeIndex === i - 1"
          @click.stop="goTo(i - 1)"
        />
      </template>
      
      <!-- Numbers Style -->
      <template v-else-if="dotsStyle === 'numbers'">
        <button
          v-for="i in totalSlides"
          :key="i - 1"
          class="s-carousel__num w-7 h-7 rounded-full text-xs font-medium flex items-center justify-center transition-all duration-300"
          :class="activeIndex === i - 1 
            ? 'bg-primary text-primary-foreground scale-110'
            : 'bg-accent/80 text-muted-foreground hover:bg-background'"
          role="tab"
          :aria-selected="activeIndex === i - 1"
          @click.stop="goTo(i - 1)"
        >
          {{ i }}
        </button>
      </template>
      
      <!-- Fraction Style -->
      <template v-else-if="dotsStyle === 'fraction'">
        <div class="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm font-medium">
          <span class="font-bold">{{ activeIndex + 1 }}</span>
          <span class="mx-1 opacity-60">/</span>
          <span class="opacity-80">{{ totalSlides }}</span>
        </div>
      </template>
    </div>
    
    <!-- Thumbnails -->
    <div
      v-if="showThumbnails"
      class="s-carousel__thumbnails absolute bottom-0 left-0 right-0 z-20 flex gap-2 p-4 bg-gradient-to-t from-black/60 to-transparent"
    >
      <button
        v-for="i in totalSlides"
        :key="i - 1"
        class="s-carousel__thumb w-16 h-12 rounded-lg overflow-hidden border-2 transition-all duration-300"
        :class="activeIndex === i - 1 
          ? 'border-primary scale-105 opacity-100' 
          : 'border-transparent opacity-60 hover:opacity-80'"
        @click.stop="goTo(i - 1)"
      >
        <slot name="thumbnail" :index="i - 1" :isActive="activeIndex === i - 1">
          <div class="w-full h-full bg-accent" />
        </slot>
      </button>
    </div>
  </div>
</template>

<style scoped>
.s-carousel {
  --carousel-speed: 500ms;
  --carousel-gap: 0px;
  --carousel-easing: cubic-bezier(0.25, 0.1, 0.25, 1);
}

.s-carousel:focus {
  outline: 2px solid var(--s-primary);
  outline-offset: 2px;
}

/* Prevent text selection during drag */
.s-carousel--dragging {
  cursor: grabbing !important;
}

.s-carousel--dragging * {
  pointer-events: none;
}

/* Track transitions */
.s-carousel--slide .s-carousel__track,
.s-carousel--parallax .s-carousel__track {
  transition: transform var(--carousel-speed) var(--carousel-easing);
  gap: var(--carousel-gap);
}

.s-carousel--dragging .s-carousel__track {
  transition: none;
}

/* ===== FADE EFFECT ===== */
.s-carousel--fade .s-carousel__track {
  position: relative;
}

.s-carousel--fade :deep(.s-carousel-slide) {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity var(--carousel-speed) ease-in-out, transform var(--carousel-speed) ease-in-out;
  transform: scale(0.95);
}

.s-carousel--fade :deep(.s-carousel-slide--active) {
  opacity: 1;
  transform: scale(1);
  z-index: 1;
}

/* ===== CUBE EFFECT ===== */
.s-carousel--cube {
  perspective: 1200px;
}

.s-carousel--cube .s-carousel__track {
  transform-style: preserve-3d;
  position: relative;
}

.s-carousel--cube :deep(.s-carousel-slide) {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  transition: transform var(--carousel-speed) var(--carousel-easing);
}

/* ===== FLIP EFFECT ===== */
.s-carousel--flip {
  perspective: 1200px;
}

.s-carousel--flip .s-carousel__track {
  transform-style: preserve-3d;
  position: relative;
}

.s-carousel--flip :deep(.s-carousel-slide) {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  transition: transform var(--carousel-speed) var(--carousel-easing), opacity var(--carousel-speed) ease;
  transform: rotateY(180deg);
  opacity: 0;
}

.s-carousel--flip :deep(.s-carousel-slide--active) {
  transform: rotateY(0deg);
  opacity: 1;
  z-index: 1;
}

/* ===== COVERFLOW EFFECT ===== */
.s-carousel--coverflow {
  perspective: 1000px;
}

.s-carousel--coverflow .s-carousel__track {
  display: flex;
  align-items: center;
  justify-content: center;
}

.s-carousel--coverflow :deep(.s-carousel-slide) {
  flex-shrink: 0;
  width: 60%;
  transition: transform var(--carousel-speed) ease, opacity var(--carousel-speed) ease;
  transform-origin: center;
}

/* ===== CARDS EFFECT ===== */
.s-carousel--cards .s-carousel__track {
  position: relative;
}

.s-carousel--cards :deep(.s-carousel-slide) {
  position: absolute;
  inset: 5%;
  width: 90%;
  height: 90%;
  margin: auto;
  transition: transform var(--carousel-speed) var(--carousel-easing), 
              opacity var(--carousel-speed) ease,
              box-shadow var(--carousel-speed) ease;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.s-carousel--cards :deep(.s-carousel-slide--active) {
  z-index: 10;
  transform: scale(1) translateY(0);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

/* ===== ZOOM EFFECT ===== */
.s-carousel--zoom .s-carousel__track {
  position: relative;
}

.s-carousel--zoom :deep(.s-carousel-slide) {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity var(--carousel-speed) ease-in-out, 
              transform var(--carousel-speed) var(--carousel-easing);
  transform: scale(1.3);
}

.s-carousel--zoom :deep(.s-carousel-slide--active) {
  opacity: 1;
  transform: scale(1);
  z-index: 1;
}

/* ===== CREATIVE EFFECT ===== */
.s-carousel--creative {
  perspective: 1200px;
}

.s-carousel--creative .s-carousel__track {
  transform-style: preserve-3d;
  position: relative;
}

.s-carousel--creative :deep(.s-carousel-slide) {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: all var(--carousel-speed) var(--carousel-easing);
  transform: translateX(100%) rotateY(-25deg) scale(0.8);
  transform-origin: left center;
}

.s-carousel--creative :deep(.s-carousel-slide--active) {
  opacity: 1;
  transform: translateX(0) rotateY(0) scale(1);
  z-index: 1;
}

/* ===== PARALLAX EFFECT ===== */
.s-carousel--parallax :deep(.s-carousel-slide) {
  overflow: hidden;
}

.s-carousel--parallax :deep(.s-carousel-slide > *:first-child) {
  transition: transform var(--carousel-speed) var(--carousel-easing);
  transform: scale(1.2);
}

.s-carousel--parallax :deep(.s-carousel-slide--active > *:first-child) {
  transform: scale(1);
}

/* ===== STACK EFFECT ===== */
.s-carousel--stack .s-carousel__track {
  position: relative;
}

.s-carousel--stack :deep(.s-carousel-slide) {
  position: absolute;
  inset: 0;
  transition: all var(--carousel-speed) var(--carousel-easing);
  transform-origin: center bottom;
}

.s-carousel--stack :deep(.s-carousel-slide:not(.s-carousel-slide--active)) {
  transform: scale(0.9) translateY(10%);
  opacity: 0.5;
  z-index: 0;
}

.s-carousel--stack :deep(.s-carousel-slide--active) {
  transform: scale(1) translateY(0);
  opacity: 1;
  z-index: 10;
}

/* ===== SWIRL EFFECT ===== */
.s-carousel--swirl {
  perspective: 1500px;
}

.s-carousel--swirl .s-carousel__track {
  transform-style: preserve-3d;
  position: relative;
}

.s-carousel--swirl :deep(.s-carousel-slide) {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: all var(--carousel-speed) var(--carousel-easing);
  transform: rotateZ(15deg) rotateY(45deg) scale(0.7);
}

.s-carousel--swirl :deep(.s-carousel-slide--active) {
  opacity: 1;
  transform: rotateZ(0) rotateY(0) scale(1);
  z-index: 1;
}

/* ===== KEN BURNS EFFECT ===== */
.s-carousel--kenburns .s-carousel__track {
  position: relative;
}

.s-carousel--kenburns :deep(.s-carousel-slide) {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity calc(var(--carousel-speed) * 1.5) ease-in-out;
  overflow: hidden;
}

.s-carousel--kenburns :deep(.s-carousel-slide > *:first-child) {
  transition: transform 8s ease-out;
  transform: scale(1);
}

.s-carousel--kenburns :deep(.s-carousel-slide--active) {
  opacity: 1;
  z-index: 1;
}

.s-carousel--kenburns :deep(.s-carousel-slide--active > *:first-child) {
  animation: kenburns 8s ease-out forwards;
}

@keyframes kenburns {
  0% { transform: scale(1) translate(0, 0); }
  100% { transform: scale(1.2) translate(-2%, -1%); }
}

/* Arrow hover effects */
.s-carousel__arrow {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.s-carousel__arrow:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

/* Dot/bar active animation */
.s-carousel__dot,
.s-carousel__bar,
.s-carousel__num {
  transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
}

/* Thumbnail styling */
.s-carousel__thumb {
  flex-shrink: 0;
}
</style>
