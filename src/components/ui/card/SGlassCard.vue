<script setup lang="ts">
import { computed, ref, provide, onMounted, onUnmounted } from 'vue'
import { cardContextKey } from './index'
import { useTheme } from '../../../composables/useTheme'
import { cn } from '~/lib/utils'

defineOptions({ inheritAttrs: false })

interface Props {
  /** Size preset affecting padding and spacing */
  size?: 'compact' | 'default' | 'comfortable'
  /** Border radius */
  rounded?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
  /** Enable hover animation effects */
  hoverable?: boolean
  /** Enable press/click effect */
  pressable?: boolean
  /** Make entire card clickable */
  clickable?: boolean
  /** Show loading skeleton state */
  loading?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Enable spotlight/glow effect on hover */
  spotlight?: boolean
  /** Spotlight color */
  spotlightColor?: string
  /** Horizontal layout (media on side) */
  horizontal?: boolean
  /** Flip media to right side in horizontal layout */
  mediaRight?: boolean
  /** Card width */
  width?: string
  /** Card height */
  height?: string
  /** Card max-width */
  maxWidth?: string
  /** Custom padding override */
  padding?: string
  /** Enable 3D tilt effect on hover */
  tilt?: boolean
  /** Tag element to render */
  tag?: string
  /** href for link cards */
  href?: string
  /** router-link to */
  to?: string | object

  // Glass-specific props
  /** Glass tint mode */
  tint?: 'auto' | 'light' | 'dark'
  /** Backdrop blur amount in px */
  blur?: number
  /** Backdrop saturation percentage */
  saturation?: number
  /** Specular highlight intensity (0-1) */
  highlightIntensity?: number
  /** Accent color for text */
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'default',
  rounded: 'lg',
  hoverable: false,
  pressable: false,
  clickable: false,
  loading: false,
  disabled: false,
  spotlight: false,
  spotlightColor: 'var(--s-primary)',
  horizontal: false,
  mediaRight: false,
  width: undefined,
  height: undefined,
  maxWidth: undefined,
  padding: undefined,
  tilt: false,
  tag: 'div',
  href: undefined,
  to: undefined,
  tint: 'auto',
  blur: 12,
  saturation: 150,
  highlightIntensity: 0.3,
  color: undefined,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

// Provide context to child components (variant 'glass' for sub-component compatibility)
provide(cardContextKey, {
  variant: 'glass',
  hoverable: props.hoverable,
  loading: props.loading,
  horizontal: props.horizontal
})

// Theme detection for auto tint
const { theme } = useTheme()

// System dark mode detection for 'system' theme
const systemDark = ref(false)
let mediaQuery: MediaQueryList | null = null

onMounted(() => {
  if (typeof window !== 'undefined') {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    systemDark.value = mediaQuery.matches
    const handler = (e: MediaQueryListEvent) => { systemDark.value = e.matches }
    mediaQuery.addEventListener('change', handler)
    onUnmounted(() => mediaQuery?.removeEventListener('change', handler))
  }

  // Inject SVG glass lens refraction filter (once globally, shared with SGlassButton)
  if (typeof document !== 'undefined' && !document.getElementById('s-glass-filters')) {
    const canvas = document.createElement('canvas')
    const mapW = 256
    const mapH = 256
    canvas.width = mapW
    canvas.height = mapH
    const ctx = canvas.getContext('2d')!
    const imgData = ctx.createImageData(mapW, mapH)
    const strength = 0.7

    for (let y = 0; y < mapH; y++) {
      for (let x = 0; x < mapW; x++) {
        const nx = (x / (mapW - 1)) * 2 - 1
        const ny = (y / (mapH - 1)) * 2 - 1
        const edgeX = 1 - Math.abs(nx)
        const edgeY = 1 - Math.abs(ny)
        const falloff = Math.pow(edgeX, 1.5) * Math.pow(edgeY, 1.5)
        const r = Math.round(128 + nx * strength * falloff * 127)
        const g = Math.round(128 + ny * strength * falloff * 127)
        const i = (y * mapW + x) * 4
        imgData.data[i] = r
        imgData.data[i + 1] = g
        imgData.data[i + 2] = 128
        imgData.data[i + 3] = 255
      }
    }
    ctx.putImageData(imgData, 0, 0)
    const lensDataUri = canvas.toDataURL('image/png')

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.id = 's-glass-filters'
    svg.setAttribute('style', 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none')
    svg.setAttribute('aria-hidden', 'true')
    svg.innerHTML = `<defs>
      <filter id="s-glass-refract" primitiveUnits="objectBoundingBox">
        <feImage href="${lensDataUri}" x="0" y="0" width="1" height="1" result="lens" />
        <feDisplacementMap in="SourceGraphic" in2="lens" scale="0.3" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>`
    document.body.appendChild(svg)
  }
})

const isDarkMode = computed(() => {
  if (theme.value === 'dark') return true
  if (theme.value === 'light') return false
  return systemDark.value
})

const effectiveTint = computed(() => {
  if (props.tint !== 'auto') return props.tint
  return isDarkMode.value ? 'light' : 'dark'
})

// Refs for interactive effects
const cardRef = ref<HTMLElement | null>(null)
const isHovered = ref(false)
const isPressed = ref(false)
const mousePosition = ref({ x: 0, y: 0 })
const tiltRotation = ref({ x: 0, y: 0 })

// Computed component tag
const componentTag = computed(() => {
  if (props.to) return 'router-link'
  if (props.href) return 'a'
  return props.tag
})

// Component bindings
const componentBindings = computed(() => {
  const bindings: Record<string, unknown> = {}
  if (props.to) bindings.to = props.to
  if (props.href) bindings.href = props.href
  return bindings
})

// Size configurations
const sizeClasses = computed(() => {
  if (props.padding) return ''
  const sizes = {
    compact: 'p-3',
    default: 'p-4 sm:p-5',
    comfortable: 'p-5 sm:p-6 lg:p-8'
  }
  return sizes[props.size]
})

// Border radius
const radiusClasses = computed(() => {
  const radii = {
    none: 'rounded-none',
    xs: 'rounded-xs',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    full: 'rounded-full'
  }
  return radii[props.rounded]
})

// Glass computed styles
const computedStyle = computed(() => {
  const style: Record<string, string> = {}
  const isLight = effectiveTint.value === 'light'

  // Glass surface
  style['--glass-blur'] = `${props.blur}px`
  style['--glass-saturation'] = `${props.saturation}%`

  // Background (slightly higher opacity than button for card surfaces)
  style['--glass-bg'] = isLight
    ? 'rgba(255, 255, 255, 0.08)'
    : 'rgba(0, 0, 0, 0.05)'

  // Text color
  if (props.color) {
    style['--glass-text'] = props.color
  } else {
    style['--glass-text'] = isLight ? '#ffffff' : '#1a1a1a'
  }

  // Inner glow
  style['--glass-glow'] = isLight
    ? 'rgba(255, 255, 255, 0.7)'
    : 'rgba(0, 0, 0, 0.15)'

  // Outer shadow
  style['--glass-shadow-outer'] = isLight
    ? '0 2px 16px rgba(0, 0, 0, 0.08)'
    : '0 2px 16px rgba(0, 0, 0, 0.04)'

  // Highlight
  style['--glass-highlight'] = `${props.highlightIntensity}`

  // Hover states
  style['--glass-bg-hover'] = isLight
    ? 'rgba(255, 255, 255, 0.15)'
    : 'rgba(0, 0, 0, 0.1)'
  style['--glass-shadow-hover'] = isLight
    ? '0 8px 32px rgba(0, 0, 0, 0.12)'
    : '0 8px 32px rgba(0, 0, 0, 0.08)'

  // Spotlight color
  if (props.spotlightColor) style['--spotlight-color'] = props.spotlightColor

  // Spotlight position
  if (props.spotlight && isHovered.value) {
    style['--mouse-x'] = `${mousePosition.value.x}px`
    style['--mouse-y'] = `${mousePosition.value.y}px`
  }

  // 3D tilt transform
  if (props.tilt && isHovered.value) {
    style.transform = `perspective(800px) rotateX(${tiltRotation.value.x}deg) rotateY(${tiltRotation.value.y}deg) scale3d(1.02, 1.02, 1.02)`
  }

  // Custom dimensions
  if (props.width) style.width = props.width
  if (props.height) style.height = props.height
  if (props.maxWidth) style.maxWidth = props.maxWidth
  if (props.padding) style.padding = props.padding

  return style
})

// Card classes for cn() merging
const cardClasses = computed(() => cn(
  's-glass-card relative overflow-hidden',
  sizeClasses.value,
  radiusClasses.value,
  props.horizontal && 'flex',
  props.horizontal && props.mediaRight && 'flex-row-reverse',
  (props.clickable || props.href || props.to) && 'cursor-pointer',
  props.disabled && 's-glass-card--disabled',
  props.hoverable && !props.disabled && 's-glass-card--hoverable',
  props.pressable && !props.disabled && 's-glass-card--pressable',
  isPressed.value && 's-glass-card--pressed',
  props.spotlight && 's-glass-card--spotlight',
))

// Event handlers
const handleMouseEnter = () => {
  if (props.disabled) return
  isHovered.value = true
}

const handleMouseLeave = () => {
  isHovered.value = false
  isPressed.value = false
  tiltRotation.value = { x: 0, y: 0 }
}

const handleMouseMove = (event: MouseEvent) => {
  if (!cardRef.value || props.disabled) return

  const rect = cardRef.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  mousePosition.value = { x, y }

  // Calculate tilt rotation
  if (props.tilt && isHovered.value) {
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -8
    const rotateY = ((x - centerX) / centerX) * 8
    tiltRotation.value = { x: rotateX, y: rotateY }
  }
}

const handleMouseDown = () => {
  if (props.pressable && !props.disabled) {
    isPressed.value = true
  }
}

const handleMouseUp = () => {
  isPressed.value = false
}

const handleClick = (event: MouseEvent) => {
  if (props.disabled) {
    event.preventDefault()
    return
  }
  if (props.clickable || props.href || props.to) {
    emit('click', event)
  }
}

// Expose for parent access
defineExpose({
  isHovered,
  isPressed
})
</script>

<template>
  <component
    :is="componentTag"
    ref="cardRef"
    v-bind="{ ...componentBindings, ...$attrs }"
    :class="cn(cardClasses, ($attrs.class as string))"
    :style="computedStyle"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @mousemove="handleMouseMove"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    @click="handleClick"
  >
    <!-- Spotlight effect -->
    <span
      v-if="spotlight && isHovered"
      class="s-glass-card__spotlight absolute inset-0 pointer-events-none transition-opacity duration-(--s-duration-slow) z-[2]"
      :class="{ 'opacity-100': isHovered, 'opacity-0': !isHovered }"
    />

    <!-- Shimmer effect for loading -->
    <Transition name="s-glass-card-fade">
      <div
        v-if="loading"
        class="absolute inset-0 z-50 flex items-center justify-center"
        :style="{ backgroundColor: effectiveTint === 'light' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)' }"
      >
        <div class="s-glass-card__shimmer absolute inset-0" />
        <div class="relative z-10 flex flex-col items-center gap-3">
          <span class="mdi mdi-loading animate-spin text-2xl" :style="{ color: 'var(--glass-text)' }" />
          <span class="text-sm" :style="{ color: 'var(--glass-text)', opacity: '0.7' }">Loading...</span>
        </div>
      </div>
    </Transition>

    <!-- Card content -->
    <slot />
  </component>
</template>

<style scoped>
/* === BASE GLASS SURFACE === */
.s-glass-card {
  background-color: var(--glass-bg);
  color: var(--glass-text);
  box-shadow: var(--glass-shadow-outer);
  transition:
    background-color 0.3s ease-out,
    box-shadow 0.3s ease-out,
    transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  isolation: isolate;
  transform-style: preserve-3d;
  will-change: transform, box-shadow;
}

/* === INNER GLOW + SPECULAR HIGHLIGHT === */
.s-glass-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow:
    inset 2px 2px 0px -2px var(--glass-glow),
    inset 0 0 3px 1px var(--glass-glow);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, var(--glass-highlight)) 0%,
    transparent 50%
  );
  pointer-events: none;
  z-index: 1;
  transition: opacity 0.2s ease-out;
}

/* === GLASS BLUR (backdrop layer) === */
.s-glass-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  z-index: -1;
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));
  pointer-events: none;
}

/* === DISABLED === */
.s-glass-card--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* === HOVER === */
.s-glass-card--hoverable {
  transition:
    background-color 0.3s ease-out,
    box-shadow 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.s-glass-card--hoverable:hover {
  background-color: var(--glass-bg-hover);
  box-shadow: var(--glass-shadow-hover);
  transform: translateY(-4px);
}

/* === PRESS === */
.s-glass-card--pressable {
  transition:
    transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.15s ease;
}

.s-glass-card--pressable:active,
.s-glass-card--pressed {
  transform: translateY(0) scale(0.98) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06) !important;
}

/* === SPOTLIGHT === */
.s-glass-card--spotlight::after {
  /* Spotlight shares the ::after layer -- we add a separate element instead */
}

.s-glass-card__spotlight {
  background: radial-gradient(
    600px circle at var(--mouse-x) var(--mouse-y),
    color-mix(in srgb, var(--spotlight-color) 12%, transparent),
    transparent 40%
  );
}

/* === SHIMMER LOADING === */
.s-glass-card__shimmer {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.08) 50%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: s-glass-card-shimmer 1.5s infinite;
}

@keyframes s-glass-card-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Fade transition */
.s-glass-card-fade-enter-active,
.s-glass-card-fade-leave-active {
  transition: opacity 0.3s ease;
}
.s-glass-card-fade-enter-from,
.s-glass-card-fade-leave-to {
  opacity: 0;
}
</style>
