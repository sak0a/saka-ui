# useIntersectionObserver

A composable for detecting element visibility using the Intersection Observer API. Perfect for lazy loading, infinite scroll, and scroll-triggered animations.

## Installation

```typescript
import { useIntersectionObserver } from '@sakoa/ui'
```

## Basic Usage

```typescript
import { ref } from 'vue'
import { useIntersectionObserver } from '@sakoa/ui'

const targetRef = ref<HTMLElement>()
const { isVisible } = useIntersectionObserver(targetRef)

// isVisible.value is true when element is in viewport
```

```vue
<template>
  <div ref="targetRef">
    <img v-if="isVisible" :src="imageSrc" />
    <div v-else class="placeholder">Loading...</div>
  </div>
</template>
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `root` | `MaybeRef<HTMLElement \| null>` | `null` | Viewport element (null = browser viewport) |
| `rootMargin` | `string` | `'0px'` | Margin around root (CSS-like values) |
| `threshold` | `number \| number[]` | `0` | Visibility threshold(s) (0.0 to 1.0) |
| `immediate` | `boolean` | `true` | Start observing immediately |
| `onChange` | `(entries) => void` | `undefined` | Callback when intersection changes |

## Return Value

| Property | Type | Description |
|----------|------|-------------|
| `isVisible` | `Ref<boolean>` | Whether element is visible |
| `entry` | `Ref<IntersectionObserverEntry \| null>` | Current intersection entry |
| `ratio` | `Ref<number>` | Intersection ratio (0.0 to 1.0) |
| `stop` | `() => void` | Stop observing |
| `start` | `() => void` | Start observing |
| `isActive` | `Ref<boolean>` | Whether observer is active |

## Threshold

Control when the visibility changes are triggered:

```typescript
// Trigger when any part is visible (default)
const { isVisible } = useIntersectionObserver(targetRef, {
  threshold: 0
})

// Trigger when 50% visible
const { isVisible } = useIntersectionObserver(targetRef, {
  threshold: 0.5
})

// Trigger when fully visible
const { isVisible } = useIntersectionObserver(targetRef, {
  threshold: 1.0
})

// Multiple thresholds - track visibility ratio
const { ratio } = useIntersectionObserver(targetRef, {
  threshold: [0, 0.25, 0.5, 0.75, 1.0]
})
```

## Root Margin

Expand or contract the viewport for triggering:

```typescript
// Trigger 100px before element enters viewport (preload)
const { isVisible } = useIntersectionObserver(targetRef, {
  rootMargin: '100px'
})

// Trigger when element is 50px into viewport
const { isVisible } = useIntersectionObserver(targetRef, {
  rootMargin: '-50px'
})

// Different margins for each side
const { isVisible } = useIntersectionObserver(targetRef, {
  rootMargin: '50px 0px 100px 0px' // top right bottom left
})
```

## Custom Root Element

Observe intersection with a scrollable container instead of the viewport:

```typescript
const containerRef = ref<HTMLElement>()
const itemRef = ref<HTMLElement>()

const { isVisible } = useIntersectionObserver(itemRef, {
  root: containerRef
})
```

```vue
<template>
  <div ref="containerRef" class="overflow-auto h-96">
    <div ref="itemRef">
      Content
    </div>
  </div>
</template>
```

## Callback

Execute code when visibility changes:

```typescript
const { isVisible } = useIntersectionObserver(targetRef, {
  onChange: (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        console.log('Element entered viewport')
        trackImpression()
      } else {
        console.log('Element left viewport')
      }
    })
  }
})
```

## Manual Control

Start and stop observing manually:

```typescript
const { isVisible, stop, start, isActive } = useIntersectionObserver(targetRef, {
  immediate: false // Don't start automatically
})

// Start observing later
onMounted(() => {
  start()
})

// Stop observing
function handleComplete() {
  stop()
}
```

## Multiple Elements

Observe multiple elements efficiently with a single observer:

```typescript
import { useIntersectionObserverMultiple } from '@sakoa/ui'

const imageRefs = ref<HTMLImageElement[]>([])

const { entries, isElementVisible } = useIntersectionObserverMultiple(imageRefs, {
  rootMargin: '50px',
  onChange: (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement
        img.src = img.dataset.src || ''
      }
    })
  }
})

// Check specific element
const isFirstVisible = computed(() => {
  return imageRefs.value[0] ? isElementVisible(imageRefs.value[0]) : false
})
```

## Element Visibility Helper

Simple boolean visibility check:

```typescript
import { useElementVisibility } from '@sakoa/ui'

const targetRef = ref<HTMLElement>()
const isVisible = useElementVisibility(targetRef)

// Just returns a boolean ref
watch(isVisible, (visible) => {
  if (visible) {
    trackView()
  }
})
```

## Has Been Seen

Track when an element has been seen at least once (stays true after first visibility):

```typescript
import { useElementHasBeenSeen } from '@sakoa/ui'

const targetRef = ref<HTMLElement>()
const hasBeenSeen = useElementHasBeenSeen(targetRef)

// Perfect for one-time animations
```

```vue
<template>
  <div 
    ref="targetRef" 
    :class="{ 'animate-fade-in': hasBeenSeen }"
  >
    Content that animates once when scrolled into view
  </div>
</template>
```

## Types

```typescript
interface IntersectionObserverOptions {
  root?: MaybeRef<HTMLElement | null>
  rootMargin?: string
  threshold?: number | number[]
  immediate?: boolean
  onChange?: (entries: IntersectionObserverEntry[]) => void
}

interface UseIntersectionObserverReturn {
  isVisible: DeepReadonly<Ref<boolean>>
  entry: DeepReadonly<Ref<IntersectionObserverEntry | null>>
  ratio: DeepReadonly<Ref<number>>
  stop: () => void
  start: () => void
  isActive: Ref<boolean>
}

interface UseIntersectionObserverMultipleReturn {
  entries: DeepReadonly<Ref<Map<Element, IntersectionObserverEntry>>>
  stop: () => void
  start: () => void
  isActive: Ref<boolean>
  isElementVisible: (element: Element) => boolean
}
```

## Complete Example

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  useIntersectionObserver, 
  useIntersectionObserverMultiple,
  useElementHasBeenSeen 
} from '@sakoa/ui'

interface LazyImage {
  id: number
  src: string
  alt: string
}

const images: LazyImage[] = [
  { id: 1, src: '/images/photo1.jpg', alt: 'Photo 1' },
  { id: 2, src: '/images/photo2.jpg', alt: 'Photo 2' },
  // ... more images
]

// Track loaded images
const loadedImages = ref(new Set<number>())
const imageRefs = ref<HTMLImageElement[]>([])

// Observe all images
const { entries } = useIntersectionObserverMultiple(imageRefs, {
  rootMargin: '100px', // Start loading 100px before visible
  onChange: (observerEntries) => {
    observerEntries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement
        const id = parseInt(img.dataset.id || '0')
        if (!loadedImages.value.has(id)) {
          img.src = img.dataset.src || ''
          loadedImages.value.add(id)
        }
      }
    })
  }
})

// Infinite scroll trigger
const loadMoreRef = ref<HTMLElement>()
const { isVisible: shouldLoadMore } = useIntersectionObserver(loadMoreRef, {
  rootMargin: '200px'
})

watch(shouldLoadMore, (visible) => {
  if (visible) {
    loadMoreImages()
  }
})

// Scroll-triggered animation
const heroRef = ref<HTMLElement>()
const { ratio: heroVisibility } = useIntersectionObserver(heroRef, {
  threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
})

const heroOpacity = computed(() => heroVisibility.value)

// One-time animation sections
const sections = ref<HTMLElement[]>([])
</script>

<template>
  <div>
    <!-- Hero with parallax-like effect -->
    <div 
      ref="heroRef" 
      class="hero"
      :style="{ opacity: heroOpacity }"
    >
      <h1>Welcome</h1>
    </div>
    
    <!-- Lazy-loaded image gallery -->
    <div class="gallery">
      <img
        v-for="image in images"
        :key="image.id"
        ref="imageRefs"
        :data-id="image.id"
        :data-src="image.src"
        :alt="image.alt"
        class="lazy-image"
        :class="{ 'loaded': loadedImages.has(image.id) }"
      />
    </div>
    
    <!-- Animated sections -->
    <section
      v-for="(section, index) in ['Features', 'About', 'Contact']"
      :key="section"
      ref="sections"
    >
      <AnimatedSection :title="section" />
    </section>
    
    <!-- Infinite scroll trigger -->
    <div ref="loadMoreRef" class="load-more">
      <span v-if="shouldLoadMore">Loading more...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
// AnimatedSection component using useElementHasBeenSeen
</script>
```

```vue
<!-- AnimatedSection.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { useElementHasBeenSeen } from '@sakoa/ui'

defineProps<{ title: string }>()

const sectionRef = ref<HTMLElement>()
const hasBeenSeen = useElementHasBeenSeen(sectionRef, {
  threshold: 0.2
})
</script>

<template>
  <section
    ref="sectionRef"
    class="section"
    :class="{ 'visible': hasBeenSeen }"
  >
    <h2>{{ title }}</h2>
    <slot />
  </section>
</template>

<style scoped>
.section {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s, transform 0.6s;
}

.section.visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
```

## Use Cases

- **Lazy loading images**: Only load images when they enter the viewport
- **Infinite scroll**: Load more content when reaching the bottom
- **Scroll animations**: Trigger animations when elements become visible
- **Analytics tracking**: Track impressions when elements are viewed
- **Video autoplay**: Play videos when visible, pause when not
- **Sticky elements**: Detect when to make elements sticky
- **Read progress**: Track how much of an article has been read
