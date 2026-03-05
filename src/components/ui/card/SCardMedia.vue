<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { cn } from '~/lib/utils'
import { cardContextKey, type CardContext } from './index'

defineOptions({ inheritAttrs: false })

export interface Props {
  /** Image source URL */
  src?: string
  /** Video source URL */
  video?: string
  /** Alt text for image */
  alt?: string
  /** Aspect ratio */
  ratio?: 'auto' | '1/1' | '4/3' | '16/9' | '21/9' | '3/4' | '9/16'
  /** Height override */
  height?: string
  /** Object fit */
  fit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  /** Enable zoom on hover */
  zoom?: boolean
  /** Zoom scale factor */
  zoomScale?: number
  /** Overlay color (gradient or solid) */
  overlay?: string
  /** Overlay opacity (0-1) */
  overlayOpacity?: number
  /** Show overlay content always or on hover */
  overlayMode?: 'always' | 'hover'
  /** Position in card layout */
  position?: 'top' | 'bottom' | 'left' | 'right' | 'background'
  /** Border radius override */
  rounded?: 'none' | 'inherit' | 'sm' | 'md' | 'lg' | 'xl'
  /** Video autoplay */
  autoplay?: boolean
  /** Video loop */
  loop?: boolean
  /** Video muted */
  muted?: boolean
  /** Video controls */
  controls?: boolean
  /** Lazy load image */
  lazy?: boolean
  /** Placeholder blur */
  placeholder?: string
  /** Skeleton loading */
  skeleton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  src: undefined,
  video: undefined,
  alt: '',
  ratio: 'auto',
  height: undefined,
  fit: 'cover',
  zoom: false,
  zoomScale: 1.1,
  overlay: undefined,
  overlayOpacity: 0.5,
  overlayMode: 'always',
  position: 'top',
  rounded: 'inherit',
  autoplay: false,
  loop: true,
  muted: true,
  controls: false,
  lazy: true,
  placeholder: undefined,
  skeleton: false
})

const cardContext = inject(cardContextKey, {
  variant: 'elevated',
  hoverable: false,
  loading: false,
  horizontal: false
} as CardContext)

const isLoaded = ref(!props.lazy)
const isHovered = ref(false)
const hasError = ref(false)

const aspectRatioClasses = computed(() => {
  if (props.height || props.ratio === 'auto') return ''
  
  const ratios = {
    '1/1': 'aspect-square',
    '4/3': 'aspect-[4/3]',
    '16/9': 'aspect-video',
    '21/9': 'aspect-[21/9]',
    '3/4': 'aspect-[3/4]',
    '9/16': 'aspect-[9/16]',
    'auto': ''
  }
  return ratios[props.ratio]
})

const fitClasses = computed(() => {
  const fits = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down'
  }
  return fits[props.fit]
})

const roundedClasses = computed(() => {
  const radii = {
    none: 'rounded-none',
    inherit: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl'
  }
  return radii[props.rounded]
})

const positionClasses = computed(() => {
  const positions = {
    top: '-mx-4 -mt-4 sm:-mx-5 sm:-mt-5 mb-4',
    bottom: '-mx-4 -mb-4 sm:-mx-5 sm:-mb-5 mt-4',
    left: '',
    right: '',
    background: 'absolute inset-0 -z-10'
  }
  return positions[props.position]
})

const computedStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.height) style.height = props.height
  return style
})

const overlayStyle = computed(() => {
  if (!props.overlay) return {}
  
  const style: Record<string, string> = {
    background: props.overlay.includes('gradient') 
      ? props.overlay 
      : props.overlay,
    opacity: String(props.overlayOpacity)
  }
  return style
})

const handleLoad = () => {
  isLoaded.value = true
}

const handleError = () => {
  hasError.value = true
  isLoaded.value = true
}
</script>

<template>
  <div
    v-bind="$attrs"
    :class="cn(
      's-card-media relative overflow-hidden',
      aspectRatioClasses,
      roundedClasses,
      positionClasses,
      {
        'rounded-t-lg': position === 'top' && rounded === 'inherit',
        'rounded-b-lg': position === 'bottom' && rounded === 'inherit',
        'w-1/3 shrink-0': cardContext.horizontal && (position === 'left' || position === 'right')
      },
      ($attrs.class as string)
    )"
    :style="computedStyle"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- Skeleton loading -->
    <div 
      v-if="skeleton || cardContext.loading || (!isLoaded && !hasError)" 
      class="absolute inset-0 bg-accent animate-pulse"
    >
      <div class="absolute inset-0 s-card-media-shimmer" />
    </div>
    
    <!-- Placeholder/blur while loading -->
    <img 
      v-if="placeholder && !isLoaded" 
      :src="placeholder"
      :alt="alt"
      class="absolute inset-0 w-full h-full blur-lg scale-110"
      :class="fitClasses"
    />
    
    <!-- Main image -->
    <img 
      v-if="src && !hasError"
      :src="src"
      :alt="alt"
      :loading="lazy ? 'lazy' : 'eager'"
      class="w-full h-full transition-all duration-500"
      :class="[
        fitClasses,
        {
          'opacity-0': !isLoaded,
          'opacity-100': isLoaded,
          'scale-100': !isHovered || !zoom,
          'scale-110': isHovered && zoom
        }
      ]"
      :style="{ transform: zoom && isHovered ? `scale(${zoomScale})` : undefined }"
      @load="handleLoad"
      @error="handleError"
    />
    
    <!-- Video -->
    <video 
      v-if="video"
      :src="video"
      :autoplay="autoplay"
      :loop="loop"
      :muted="muted"
      :controls="controls"
      playsinline
      class="w-full h-full transition-transform duration-500"
      :class="[
        fitClasses,
        {
          'scale-100': !isHovered || !zoom,
          'scale-110': isHovered && zoom
        }
      ]"
      @loadeddata="handleLoad"
      @error="handleError"
    />
    
    <!-- Error state -->
    <div 
      v-if="hasError" 
      class="absolute inset-0 flex flex-col items-center justify-center bg-accent text-muted-foreground"
    >
      <span class="mdi mdi-image-broken-variant text-4xl mb-2" />
      <span class="text-sm">Failed to load media</span>
    </div>
    
    <!-- Overlay -->
    <div 
      v-if="overlay || $slots.overlay"
      class="absolute inset-0 flex items-end transition-opacity duration-300"
      :class="{
        'opacity-0': overlayMode === 'hover' && !isHovered,
        'opacity-100': overlayMode === 'always' || isHovered
      }"
      :style="overlayStyle"
    >
      <slot name="overlay" />
    </div>
    
    <!-- Content overlay (for text on image) -->
    <div 
      v-if="$slots.default" 
      class="absolute inset-0 flex items-center justify-center p-4"
    >
      <slot />
    </div>
    
    <!-- Badge slot (top corner) -->
    <div 
      v-if="$slots.badge" 
      class="absolute top-3 right-3 z-10"
    >
      <slot name="badge" />
    </div>
    
    <!-- Action slot (bottom) -->
    <div 
      v-if="$slots.actions" 
      class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300"
      :class="{
        'opacity-0': overlayMode === 'hover' && !isHovered,
        'opacity-100': overlayMode === 'always' || isHovered
      }"
    >
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
.s-card-media-shimmer {
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--s-muted) 50%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
