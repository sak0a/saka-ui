<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  SCard, SCardContent, SCardHeader, SApiSection, SApiTable
} from '../../index'
import { 
  useIntersectionObserver, 
  useElementVisibility, 
  useElementHasBeenSeen 
} from '../../composables/useIntersectionObserver'
import type { ApiProp, ApiMethod } from '../../index'
import DemoSection from '../../components/DemoSection.vue'

// Demo: Basic visibility
const basicRef = ref<HTMLElement>()
const { isVisible: basicIsVisible, ratio: basicRatio } = useIntersectionObserver(basicRef, {
  threshold: [0, 0.25, 0.5, 0.75, 1]
})

// Demo: Has been seen (one-time animation)
const animatedRef = ref<HTMLElement>()
const hasBeenSeen = useElementHasBeenSeen(animatedRef, { threshold: 0.3 })

// Demo: Lazy load images
const images = [
  { id: 1, src: 'https://picsum.photos/400/300?random=1', loaded: ref(false) },
  { id: 2, src: 'https://picsum.photos/400/300?random=2', loaded: ref(false) },
  { id: 3, src: 'https://picsum.photos/400/300?random=3', loaded: ref(false) },
  { id: 4, src: 'https://picsum.photos/400/300?random=4', loaded: ref(false) }
]

const imageRefs = ref<(HTMLElement | null)[]>([])

images.forEach((image, index) => {
  const imgRef = computed(() => imageRefs.value[index])
  const isVisible = useElementVisibility(imgRef, { rootMargin: '50px' })
  
  // Watch for visibility and mark as loaded
  if (isVisible.value) {
    image.loaded.value = true
  }
})

// Demo: Progress indicator
const sections = ['Introduction', 'Features', 'Installation', 'Usage', 'Conclusion']
const sectionRefs = ref<(HTMLElement | null)[]>([])
const activeSections = ref<Set<string>>(new Set())

sections.forEach((section, index) => {
  const sectionRef = computed(() => sectionRefs.value[index])
  const { isVisible: _isVisible } = useIntersectionObserver(sectionRef, {
    threshold: 0.5,
    onChange: (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activeSections.value.add(section)
        } else {
          activeSections.value.delete(section)
        }
        activeSections.value = new Set(activeSections.value)
      })
    }
  })
})

// Code examples
const basicCode = `import { ref } from 'vue'
import { useIntersectionObserver } from 'saka-ui'

const targetRef = ref<HTMLElement>()
const { isVisible, ratio } = useIntersectionObserver(targetRef)

// isVisible.value is true when element is in viewport
// ratio.value is 0-1 indicating how much is visible`

const thresholdCode = `// Trigger when 50% visible
const { isVisible } = useIntersectionObserver(targetRef, {
  threshold: 0.5
})

// Multiple thresholds for progress tracking
const { ratio } = useIntersectionObserver(targetRef, {
  threshold: [0, 0.25, 0.5, 0.75, 1.0]
})`

const rootMarginCode = `// Trigger 100px before entering viewport (preload)
const { isVisible } = useIntersectionObserver(targetRef, {
  rootMargin: '100px'
})

// Trigger when 50px into viewport
const { isVisible } = useIntersectionObserver(targetRef, {
  rootMargin: '-50px'
})`

const hasBeenSeenCode = `import { useElementHasBeenSeen } from 'saka-ui'

const targetRef = ref<HTMLElement>()
const hasBeenSeen = useElementHasBeenSeen(targetRef)

// Value stays true once element has been visible
// Perfect for one-time animations
<div :class="{ 'animate-in': hasBeenSeen }">
  Content
</div>`

const lazyLoadCode = `import { useElementVisibility } from 'saka-ui'

const imageRef = ref<HTMLElement>()
const isVisible = useElementVisibility(imageRef, {
  rootMargin: '50px' // Start loading 50px before visible
})

<img 
  ref="imageRef"
  :src="isVisible ? actualSrc : placeholder"
/>`

// API Tables
const composableMethods: ApiMethod[] = [
  { name: 'useIntersectionObserver(target, options?)', description: 'Observe element intersection with viewport' },
  { name: 'useIntersectionObserverMultiple(targets, options?)', description: 'Observe multiple elements efficiently' },
  { name: 'useElementVisibility(target, options?)', description: 'Simple boolean visibility check' },
  { name: 'useElementHasBeenSeen(target, options?)', description: 'Track if element has ever been visible' }
]

const optionsProps: ApiProp[] = [
  { name: 'root', type: 'MaybeRef<HTMLElement | null>', default: 'null', description: 'Viewport element (null = browser viewport)' },
  { name: 'rootMargin', type: 'string', default: "'0px'", description: 'Margin around root' },
  { name: 'threshold', type: 'number | number[]', default: '0', description: 'Visibility threshold(s) (0.0 to 1.0)' },
  { name: 'immediate', type: 'boolean', default: 'true', description: 'Start observing immediately' },
  { name: 'onChange', type: '(entries) => void', description: 'Callback when intersection changes' }
]

const returnProps: ApiProp[] = [
  { name: 'isVisible', type: 'Ref<boolean>', description: 'Whether element is visible' },
  { name: 'entry', type: 'Ref<IntersectionObserverEntry | null>', description: 'Current intersection entry' },
  { name: 'ratio', type: 'Ref<number>', description: 'Intersection ratio (0.0 to 1.0)' },
  { name: 'stop', type: '() => void', description: 'Stop observing' },
  { name: 'start', type: '() => void', description: 'Start observing' },
  { name: 'isActive', type: 'Ref<boolean>', description: 'Whether observer is active' }
]
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-(--s-text-primary) mb-2">useIntersectionObserver</h1>
      <p class="text-lg text-(--s-text-secondary)">
        Detect element visibility using the Intersection Observer API. Perfect for lazy loading, infinite scroll, and scroll-triggered animations.
      </p>
    </header>

    <!-- Basic Visibility Demo -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Basic Visibility</h2>
      <SCard variant="outlined">
        <SCardHeader>
          <h3 class="font-semibold text-(--s-text-primary)">Scroll to See Visibility Change</h3>
        </SCardHeader>
        <SCardContent>
          <div class="flex items-center gap-4 mb-4">
            <div 
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-all',
                basicIsVisible 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-slate-200 dark:bg-slate-700 text-(--s-text-secondary)'
              ]"
            >
              {{ basicIsVisible ? 'Visible' : 'Not Visible' }}
            </div>
            <div class="text-sm text-(--s-text-secondary)">
              Visibility ratio: {{ Math.round(basicRatio * 100) }}%
            </div>
          </div>
          
          <!-- Progress bar -->
          <div class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              class="h-full bg-emerald-500 transition-all duration-100"
              :style="{ width: `${basicRatio * 100}%` }"
            />
          </div>
        </SCardContent>
      </SCard>

      <!-- Target element -->
      <div 
        ref="basicRef"
        class="mt-8 p-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center"
      >
        <h3 class="text-2xl font-bold mb-2">Observed Element</h3>
        <p>Scroll up and down to see the visibility change</p>
        <p class="mt-4 text-4xl font-bold">{{ Math.round(basicRatio * 100) }}%</p>
      </div>
    </section>

    <!-- Has Been Seen Demo -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">One-Time Animation</h2>
      <SCard variant="outlined">
        <SCardHeader>
          <h3 class="font-semibold text-(--s-text-primary)">Scroll to Trigger Animation</h3>
          <p class="text-sm text-(--s-text-secondary)">Animation only plays once when element becomes visible</p>
        </SCardHeader>
        <SCardContent>
          <div class="text-sm text-(--s-text-secondary) mb-4">
            Has been seen: {{ hasBeenSeen ? 'Yes' : 'No' }}
          </div>
        </SCardContent>
      </SCard>

      <div 
        ref="animatedRef"
        :class="[
          'mt-8 p-8 rounded-lg text-center transition-all duration-700',
          hasBeenSeen 
            ? 'opacity-100 translate-y-0 bg-gradient-to-r from-emerald-500 to-teal-500' 
            : 'opacity-0 translate-y-8 bg-slate-300 dark:bg-slate-700'
        ]"
      >
        <h3 class="text-2xl font-bold text-white mb-2">
          {{ hasBeenSeen ? 'I appeared!' : 'Waiting to appear...' }}
        </h3>
        <p class="text-white/80">
          This element animates in once and stays visible
        </p>
      </div>
    </section>

    <!-- Lazy Load Demo -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Lazy Loading</h2>
      <SCard variant="outlined">
        <SCardHeader>
          <h3 class="font-semibold text-(--s-text-primary)">Lazy Loaded Images</h3>
          <p class="text-sm text-(--s-text-secondary)">Images load as they approach the viewport</p>
        </SCardHeader>
        <SCardContent>
          <div class="grid grid-cols-2 gap-4">
            <div 
              v-for="(image, index) in images" 
              :key="image.id"
              :ref="el => imageRefs[index] = el as HTMLElement"
              class="aspect-video rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700"
            >
              <img 
                v-if="image.loaded.value"
                :src="image.src"
                class="w-full h-full object-cover"
                loading="lazy"
              />
              <div 
                v-else 
                class="w-full h-full flex items-center justify-center text-(--s-text-secondary)"
              >
                Loading...
              </div>
            </div>
          </div>
        </SCardContent>
      </SCard>
    </section>

    <!-- Section Progress Demo -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Reading Progress</h2>
      <SCard variant="outlined">
        <SCardHeader>
          <h3 class="font-semibold text-(--s-text-primary)">Active Sections</h3>
        </SCardHeader>
        <SCardContent>
          <div class="flex flex-wrap gap-2 mb-4">
            <div 
              v-for="section in sections" 
              :key="section"
              :class="[
                'px-3 py-1 rounded-full text-sm font-medium transition-all',
                activeSections.has(section)
                  ? 'bg-blue-500 text-white' 
                  : 'bg-slate-200 dark:bg-slate-700 text-(--s-text-secondary)'
              ]"
            >
              {{ section }}
            </div>
          </div>
        </SCardContent>
      </SCard>

      <div class="mt-8 space-y-4">
        <div 
          v-for="(section, index) in sections" 
          :key="section"
          :ref="el => sectionRefs[index] = el as HTMLElement"
          :class="[
            'p-6 rounded-lg transition-all duration-300',
            activeSections.has(section)
              ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500' 
              : 'bg-slate-100 dark:bg-slate-800'
          ]"
        >
          <h4 class="font-semibold text-(--s-text-primary)">{{ section }}</h4>
          <p class="text-sm text-(--s-text-secondary) mt-2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
            incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>
    </section>

    <!-- Code Examples -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Code Examples</h2>
      
      <div class="space-y-6">
        <DemoSection
          title="Basic Usage"
          :code="basicCode"
          language="typescript"
          code-only
        />

        <DemoSection
          title="Threshold"
          :code="thresholdCode"
          language="typescript"
          code-only
        />

        <DemoSection
          title="Root Margin"
          :code="rootMarginCode"
          language="typescript"
          code-only
        />

        <DemoSection
          title="Has Been Seen"
          :code="hasBeenSeenCode"
          language="typescript"
          code-only
        />

        <DemoSection
          title="Lazy Loading"
          :code="lazyLoadCode"
          language="typescript"
          code-only
        />
      </div>
    </section>

    <!-- API Reference -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">API Reference</h2>
      
      <SApiSection title="Composables">
        <SApiTable title="Functions" :methods="composableMethods" type="methods" />
      </SApiSection>

      <div class="mt-8">
        <SApiSection title="IntersectionObserverOptions">
          <SApiTable title="Properties" :props="optionsProps" type="props" />
        </SApiSection>
      </div>

      <div class="mt-8">
        <SApiSection title="Return Value">
          <SApiTable title="Properties" :props="returnProps" type="props" />
        </SApiSection>
      </div>
    </section>
  </div>
</template>
