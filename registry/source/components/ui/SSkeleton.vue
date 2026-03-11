<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

defineOptions({ inheritAttrs: false })

const skeletonVariants = cva(
  'block bg-muted',
  {
    variants: {
      shape: {
        rectangular: 'rounded-md',
        circular: 'rounded-full',
        rounded: 'rounded-full',
      },
      animation: {
        wave: 's-skeleton-wave',
        pulse: 's-skeleton-pulse',
        none: '',
      },
    },
    defaultVariants: {
      shape: 'rectangular',
      animation: 'wave',
    },
  }
)

export type SkeletonVariants = VariantProps<typeof skeletonVariants>

export interface Props {
  /** Shape variant */
  shape?: 'rectangular' | 'circular' | 'rounded'
  /** Animation type */
  animation?: 'wave' | 'pulse' | 'none'
  /** Width (CSS value) */
  width?: string
  /** Height (CSS value) */
  height?: string
  /** Shorthand for equal width and height */
  size?: string
  /** Custom border radius override */
  borderRadius?: string
  /** Number of lines to render (for text-like skeletons) */
  lines?: number
  /** Gap between lines */
  lineGap?: string
  /** Additional class */
  skeletonClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  shape: 'rectangular',
  animation: 'wave',
  width: undefined,
  height: undefined,
  size: undefined,
  borderRadius: undefined,
  lines: 1,
  lineGap: '0.75rem',
})

const containerStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {}

  if (props.size) {
    style.width = props.size
    style.height = props.size
  } else {
    if (props.width) style.width = props.width
    if (props.height) style.height = props.height
  }

  if (!props.size && !props.height) {
    style.height = props.shape === 'circular' ? props.width ?? '3rem' : '1rem'
  }

  if (!props.size && !props.width) {
    style.width = props.shape === 'circular' ? props.height ?? '3rem' : '100%'
  }

  if (props.borderRadius) {
    style.borderRadius = props.borderRadius
  }

  return style
})

const skeletonClasses = computed(() =>
  cn(
    skeletonVariants({ shape: props.shape, animation: props.animation }),
    props.skeletonClass,
  )
)

const lineWidths = computed(() => {
  if (props.lines <= 1) return ['100%']
  return Array.from({ length: props.lines }, (_, i) => {
    if (i === props.lines - 1) return '60%'
    return '100%'
  })
})
</script>

<template>
  <div
    v-if="lines > 1"
    v-bind="$attrs"
    class="flex flex-col"
    :style="{ gap: lineGap }"
  >
    <div
      v-for="(lineWidth, i) in lineWidths"
      :key="i"
      :class="skeletonClasses"
      :style="{ ...containerStyle, width: lineWidth }"
    />
  </div>

  <div
    v-else
    v-bind="$attrs"
    :class="skeletonClasses"
    :style="containerStyle"
  />
</template>

<style>
/* Pulse animation — smooth opacity fade */
.s-skeleton-pulse {
  animation: s-skeleton-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes s-skeleton-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

/* Wave / shimmer animation — gradient slide */
.s-skeleton-wave {
  position: relative;
  overflow: hidden;
}

.s-skeleton-wave::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.08) 20%,
    rgba(255, 255, 255, 0.18) 50%,
    rgba(255, 255, 255, 0.08) 80%,
    transparent
  );
  animation: s-skeleton-wave 1.8s ease-in-out infinite;
}

:root:not(.dark) .s-skeleton-wave::after {
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3) 20%,
    rgba(255, 255, 255, 0.6) 50%,
    rgba(255, 255, 255, 0.3) 80%,
    transparent
  );
}

@keyframes s-skeleton-wave {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
