<script setup lang="ts">
import { ref } from 'vue'
import { SCarousel, SCarouselSlide, SApiSection, SApiTable, SButton } from '../../index'
import type { ApiProp, ApiEvent, ApiMethod, ApiSlot } from '../../index'
import DemoSection from '../../components/DemoSection.vue'

// State for demos
const basicIndex = ref(0)
const effectIndex = ref(0)
const currentEffect = ref<'slide' | 'fade' | 'cube' | 'flip' | 'coverflow' | 'cards' | 'zoom' | 'creative' | 'parallax' | 'stack' | 'swirl' | 'kenburns'>('slide')
const autoplayIndex = ref(0)
const autoplayEnabled = ref(true)
const verticalIndex = ref(0)
const loopIndex = ref(0)
const customIndex = ref(0)
const dotsStyleIndex = ref(0)
const currentDotsStyle = ref<'dots' | 'bars' | 'numbers' | 'fraction'>('dots')
const easingIndex = ref(0)
const currentEasing = ref<'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear' | 'spring' | 'bounce'>('ease-out')
const mousewheelIndex = ref(0)
const thumbnailIndex = ref(0)
const arrowPlacementIndex = ref(0)
const currentArrowPlacement = ref<'sides' | 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'bottom-center' | 'top-center'>('sides')

// Demo carousel ref for method demos
const carouselRef = ref<InstanceType<typeof SCarousel> | null>(null)

// Sample images with gradients
const demoSlides = [
  { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', title: 'Slide One', desc: 'Beautiful gradient background', emoji: '🎨' },
  { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', title: 'Slide Two', desc: 'Stunning pink gradient', emoji: '🌸' },
  { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', title: 'Slide Three', desc: 'Cool blue gradient', emoji: '💎' },
  { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', title: 'Slide Four', desc: 'Fresh green gradient', emoji: '🌿' },
  { bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', title: 'Slide Five', desc: 'Warm sunset gradient', emoji: '🌅' },
]

const effects: Array<typeof currentEffect.value> = [
  'slide', 'fade', 'cube', 'flip', 'coverflow', 'cards',
  'zoom', 'creative', 'parallax', 'stack', 'swirl', 'kenburns'
]

const effectDescriptions: Record<string, string> = {
  slide: 'Classic horizontal sliding',
  fade: 'Smooth crossfade with scale',
  cube: '3D cube rotation',
  flip: '3D card flip',
  coverflow: 'Apple-style 3D carousel',
  cards: 'Stacked cards with depth',
  zoom: 'Dramatic zoom in/out',
  creative: '3D perspective slide',
  parallax: 'Content parallax effect',
  stack: 'Stacked from bottom',
  swirl: '3D rotation swirl',
  kenburns: 'Cinematic pan & zoom'
}

const dotsStyles: Array<typeof currentDotsStyle.value> = ['dots', 'bars', 'numbers', 'fraction']
const easings: Array<typeof currentEasing.value> = ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear', 'spring', 'bounce']
const arrowPlacements: Array<typeof currentArrowPlacement.value> = ['sides', 'bottom-right', 'bottom-left', 'top-right', 'top-left', 'bottom-center', 'top-center']

// Code snippets
const basicCode = `<SCarousel v-model="basicIndex" height="280px" border-radius="12px">
  <SCarouselSlide v-for="(slide, i) in demoSlides" :key="i">
    <div
      class="w-full h-full flex flex-col items-center justify-center text-white"
      :style="{ background: slide.bg }"
    >
      <span class="text-5xl mb-3">{{ slide.emoji }}</span>
      <h3 class="text-3xl font-bold mb-2">{{ slide.title }}</h3>
      <p class="text-white/80">{{ slide.desc }}</p>
    </div>
  </SCarouselSlide>
</SCarousel>`

const effectsCode = `<SCarousel
  v-model="effectIndex"
  :effect="currentEffect"
  height="280px"
  border-radius="12px"
  :speed="currentEffect === 'kenburns' ? 1000 : 600"
  easing="spring"
>
  <SCarouselSlide v-for="(slide, i) in demoSlides" :key="i">
    <div
      class="w-full h-full flex flex-col items-center justify-center text-white rounded-xl"
      :style="{ background: slide.bg }"
    >
      <span class="text-6xl mb-4">{{ slide.emoji }}</span>
      <h3 class="text-2xl font-bold">{{ currentEffect.toUpperCase() }}</h3>
      <p class="text-white/70 mt-2">Slide {{ i + 1 }} of {{ demoSlides.length }}</p>
    </div>
  </SCarouselSlide>
</SCarousel>`

const autoplayCode = `<SCarousel
  v-model="autoplayIndex"
  :autoplay="autoplayEnabled"
  :autoplay-delay="2500"
  :pause-on-hover="true"
  :show-progress="true"
  :show-counter="true"
  :loop="true"
  height="250px"
  border-radius="12px"
>
  <SCarouselSlide v-for="(slide, i) in demoSlides" :key="i">
    <div
      class="w-full h-full flex flex-col items-center justify-center text-white"
      :style="{ background: slide.bg }"
    >
      <span class="text-5xl mb-3">&#x1F3AC;</span>
      <h3 class="text-2xl font-bold">{{ slide.title }}</h3>
    </div>
  </SCarouselSlide>
</SCarousel>`

const dotsStyleCode = `<SCarousel
  v-model="dotsStyleIndex"
  height="220px"
  border-radius="12px"
  :dots-style="currentDotsStyle"
>
  <SCarouselSlide v-for="(slide, i) in demoSlides.slice(0, 4)" :key="i">
    <div
      class="w-full h-full flex items-center justify-center text-white"
      :style="{ background: slide.bg }"
    >
      <span class="text-4xl">{{ slide.emoji }}</span>
    </div>
  </SCarouselSlide>
</SCarousel>`

const easingCode = `<SCarousel
  v-model="easingIndex"
  height="200px"
  border-radius="12px"
  :easing="currentEasing"
  :speed="700"
>
  <SCarouselSlide v-for="(slide, i) in demoSlides.slice(0, 3)" :key="i">
    <div
      class="w-full h-full flex items-center justify-center text-white"
      :style="{ background: slide.bg }"
    >
      <div class="text-center">
        <span class="text-4xl">{{ slide.emoji }}</span>
        <p class="mt-2 font-semibold">{{ currentEasing }}</p>
      </div>
    </div>
  </SCarouselSlide>
</SCarousel>`

const mousewheelCode = `<SCarousel
  v-model="mousewheelIndex"
  :mousewheel="true"
  :grab-cursor="true"
  height="220px"
  border-radius="12px"
>
  <SCarouselSlide v-for="(slide, i) in demoSlides" :key="i">
    <div
      class="w-full h-full flex items-center justify-center text-white"
      :style="{ background: slide.bg }"
    >
      <div class="text-center">
        <span class="text-5xl">&#x1F5B1;&#xFE0F;</span>
        <p class="mt-3 font-semibold">Scroll to navigate!</p>
      </div>
    </div>
  </SCarouselSlide>
</SCarousel>`

const arrowPlacementCode = `<SCarousel
  v-model="arrowPlacementIndex"
  height="260px"
  border-radius="12px"
  :arrow-placement="currentArrowPlacement"
  :show-dots="false"
>
  <SCarouselSlide v-for="(slide, i) in demoSlides.slice(0, 4)" :key="i">
    <div
      class="w-full h-full flex flex-col items-center justify-center text-white"
      :style="{ background: slide.bg }"
    >
      <span class="text-5xl mb-3">&#x1F3AF;</span>
      <h3 class="text-xl font-bold">{{ currentArrowPlacement }}</h3>
      <p class="text-white/70 mt-2 text-sm">Arrow placement demo</p>
    </div>
  </SCarouselSlide>
</SCarousel>`

const thumbnailsCode = `<SCarousel
  v-model="thumbnailIndex"
  height="280px"
  border-radius="12px"
  :autoplay="true"
  :autoplay-delay="4000"
  :pause-on-hover="true"
  :loop="true"
>
  <SCarouselSlide v-for="(slide, i) in demoSlides" :key="i">
    <div
      class="w-full h-full flex flex-col items-center justify-center text-white"
      :style="{ background: slide.bg }"
    >
      <span class="text-5xl mb-3">{{ slide.emoji }}</span>
      <h3 class="text-xl font-bold">{{ slide.title }}</h3>
      <p class="text-white/70 text-sm">Product {{ i + 1 }}</p>
    </div>
  </SCarouselSlide>
</SCarousel>`

const verticalCode = `<SCarousel
  v-model="verticalIndex"
  direction="vertical"
  height="300px"
  border-radius="12px"
  :mousewheel="true"
>
  <SCarouselSlide v-for="(slide, i) in demoSlides.slice(0, 4)" :key="i">
    <div
      class="w-full h-full flex items-center justify-center text-white"
      :style="{ background: slide.bg }"
    >
      <div class="text-center">
        <span class="text-5xl">\\u2B06\\uFE0F\\u2B07\\uFE0F</span>
        <h3 class="text-xl font-bold mt-4">Vertical Slide {{ i + 1 }}</h3>
      </div>
    </div>
  </SCarouselSlide>
</SCarousel>`

const loopCode = `<SCarousel
  v-model="loopIndex"
  :loop="true"
  height="220px"
  border-radius="12px"
  easing="bounce"
>
  <SCarouselSlide v-for="(slide, i) in demoSlides.slice(0, 3)" :key="i">
    <div
      class="w-full h-full flex items-center justify-center text-white"
      :style="{ background: slide.bg }"
    >
      <div class="text-center">
        <span class="text-5xl">\\uD83D\\uDD04</span>
        <h3 class="text-xl font-bold mt-4">{{ slide.title }}</h3>
        <p class="text-white/70 text-sm">Loop enabled - navigate infinitely!</p>
      </div>
    </div>
  </SCarouselSlide>
</SCarousel>`

const methodsCode = `<script setup>
const carouselRef = ref()

carouselRef.value?.next()
carouselRef.value?.prev()
carouselRef.value?.goTo(2)
carouselRef.value?.pause()
carouselRef.value?.resume()
<\/script>`

// API Reference data
const carouselProps: ApiProp[] = [
  { name: 'modelValue', type: 'number', default: '0', description: 'Active slide index (v-model)', category: 'Core' },
  { name: 'direction', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Slide direction', category: 'Core' },
  { name: 'effect', type: '12 options', default: "'slide'", description: 'slide, fade, cube, flip, coverflow, cards, zoom, creative, parallax, stack, swirl, kenburns', category: 'Animation' },
  { name: 'easing', type: '7 options', default: "'ease-out'", description: 'ease, ease-in, ease-out, ease-in-out, linear, spring, bounce', category: 'Animation' },
  { name: 'speed', type: 'number', default: '500', description: 'Transition duration (ms)', category: 'Animation' },
  { name: 'loop', type: 'boolean', default: 'false', description: 'Enable infinite loop', category: 'Navigation' },
  { name: 'rewind', type: 'boolean', default: 'false', description: 'Jump to first/last slide at edges', category: 'Navigation' },
  { name: 'mousewheel', type: 'boolean', default: 'false', description: 'Navigate with mouse wheel', category: 'Navigation' },
  { name: 'grabCursor', type: 'boolean', default: 'true', description: 'Show grab cursor on hover', category: 'Navigation' },
  { name: 'touchSensitivity', type: 'number', default: '1', description: 'Touch gesture sensitivity multiplier', category: 'Navigation' },
  { name: 'autoplay', type: 'boolean', default: 'false', description: 'Enable auto-advancement', category: 'Autoplay' },
  { name: 'autoplayDelay', type: 'number', default: '3000', description: 'Delay between slides (ms)', category: 'Autoplay' },
  { name: 'dotsStyle', type: '4 options', default: "'dots'", description: 'dots, bars, numbers, fraction', category: 'UI Elements' },
  { name: 'arrowStyle', type: '4 options', default: "'default'", description: 'default, minimal, rounded, square', category: 'UI Elements' },
  { name: 'showCounter', type: 'boolean', default: 'false', description: 'Show slide counter (1/5)', category: 'UI Elements' },
  { name: 'showThumbnails', type: 'boolean', default: 'false', description: 'Show thumbnail navigation', category: 'UI Elements' },
  { name: 'aspectRatio', type: 'string', default: "''", description: "CSS aspect-ratio (e.g., '16/9')", category: 'UI Elements' }
]

const carouselEvents: ApiEvent[] = [
  { name: 'change', payload: 'number', description: 'Slide changed' },
  { name: 'slideStart / slideEnd', payload: 'number', description: 'Transition started/ended' },
  { name: 'reachStart / reachEnd', payload: '—', description: 'Reached first/last slide' },
  { name: 'click / doubleClick', payload: 'number', description: 'Slide clicked/double-clicked' },
  { name: 'touchStart / touchMove / touchEnd', payload: 'Event', description: 'Touch gesture events' }
]

const carouselMethods: ApiMethod[] = [
  { name: 'next() / prev()', description: 'Navigate to next/previous slide' },
  { name: 'goTo(index)', description: 'Jump to specific slide' },
  { name: 'start() / stop()', description: 'Start/stop autoplay' },
  { name: 'pause() / resume()', description: 'Pause/resume autoplay' }
]

const carouselSlots: ApiSlot[] = [
  { name: 'default', props: '-', description: 'Slide content made up of SCarouselSlide children' },
  { name: 'thumbnail', props: '{ index, isActive }', description: 'Custom thumbnail renderer when thumbnail navigation is enabled' }
]

const carouselSlideProps: ApiProp[] = [
  { name: 'lazy', type: 'boolean', default: 'false', description: 'Delay rendering slide content until the slide becomes visible' }
]

const carouselSlideSlots: ApiSlot[] = [
  { name: 'default', props: '{ isActive, isVisible, index }', description: 'Main slide content' },
  { name: 'overlay', props: '{ isActive, isVisible, index }', description: 'Overlay content positioned over the slide' }
]
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- @component SCarousel -->
    <!-- @props modelValue, direction, effect, easing, speed, loop, rewind, mousewheel, grabCursor, touchSensitivity, autoplay, autoplayDelay, dotsStyle, arrowStyle, showCounter, showThumbnails, aspectRatio -->
    <!-- @events change, slideStart, slideEnd, reachStart, reachEnd, click, doubleClick, touchStart, touchMove, touchEnd -->
    <!-- @slots default, thumbnail -->
    <!-- @sections basic-usage, 12-transition-effects, pagination-styles, arrow-placement, easing-functions, autoplay-&-counter, mousewheel-navigation, vertical-direction, loop-&-rewind, programmatic-control, real-world-examples, api-reference -->
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-(--s-text-primary) mb-2">Carousel</h1>
      <p class="text-lg text-(--s-text-secondary)">
        A highly customizable carousel with <strong>12 stunning visual effects</strong> and smooth animations.
      </p>
    </header>

    <!-- Features -->
    <article id="features">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 rounded-xl bg-emerald-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-animation text-xl text-emerald-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">12 Visual Effects</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Slide, fade, cube, flip, coverflow, cards, zoom, creative, parallax, stack, swirl, kenburns.</p>
        </div>
        <div class="p-4 rounded-xl bg-blue-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-timer-outline text-xl text-blue-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Autoplay</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Auto-advance with configurable delay, pause on hover, and progress bar.</p>
        </div>
        <div class="p-4 rounded-xl bg-purple-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-gesture-swipe-horizontal text-xl text-purple-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Touch & Mousewheel</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Full touch gesture support and mousewheel navigation.</p>
        </div>
        <div class="p-4 rounded-xl bg-amber-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-arrow-all text-xl text-amber-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Flexible Navigation</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">7 arrow placements, 4 pagination styles, and programmatic control.</p>
        </div>
        <div class="p-4 rounded-xl bg-red-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-swap-vertical text-xl text-red-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Vertical Mode</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Horizontal or vertical slide direction with full feature support.</p>
        </div>
        <div class="p-4 rounded-xl bg-cyan-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-infinity text-xl text-cyan-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Loop & Rewind</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Infinite loop for seamless navigation or rewind for jump-back behavior.</p>
        </div>
      </div>
    </article>

    <!-- Basic Usage -->
    <section id="basic-usage">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Basic Usage</h2>
      <DemoSection 
        title="Simple Carousel"
        description="A basic carousel with navigation arrows and pagination dots."
        :code="basicCode"
        language="vue"
      >
        <SCarousel 
          v-model="basicIndex" 
          height="280px"
          border-radius="12px"
        >
          <SCarouselSlide v-for="(slide, i) in demoSlides" :key="i">
            <div 
              class="w-full h-full flex flex-col items-center justify-center text-white"
              :style="{ background: slide.bg }"
            >
              <span class="text-5xl mb-3">{{ slide.emoji }}</span>
              <h3 class="text-3xl font-bold mb-2">{{ slide.title }}</h3>
              <p class="text-white/80">{{ slide.desc }}</p>
            </div>
          </SCarouselSlide>
        </SCarousel>
        <p class="mt-4 text-sm text-(--s-text-secondary)">
          Current slide: <code class="font-mono text-emerald-400">{{ basicIndex }}</code>
        </p>
      </DemoSection>
    </section>

    <!-- Effects Showcase - 12 EFFECTS -->
    <section id="12-transition-effects">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">12 Transition Effects</h2>
      <DemoSection 
        title="Stunning Visual Effects"
        description="Choose from 12 unique transition effects including 3D transformations and cinematic animations."
        :code="effectsCode"
        language="vue"
      >
        <div class="space-y-4">
          <!-- Effect selector -->
          <div class="flex flex-wrap gap-2">
            <SButton
              v-for="effect in effects"
              :key="effect"
              :variant="currentEffect === effect ? 'light' : 'ghost'"
              size="sm"
              @click="currentEffect = effect; effectIndex = 0"
            >
              {{ effect.charAt(0).toUpperCase() + effect.slice(1) }}
            </SButton>
          </div>
          
          <p class="text-sm text-(--s-text-tertiary)">{{ effectDescriptions[currentEffect] }}</p>
          
          <SCarousel 
            v-model="effectIndex"
            :effect="currentEffect"
            height="280px"
            border-radius="12px"
            :speed="currentEffect === 'kenburns' ? 1000 : 600"
            easing="spring"
          >
            <SCarouselSlide v-for="(slide, i) in demoSlides" :key="i">
              <div 
                class="w-full h-full flex flex-col items-center justify-center text-white rounded-xl"
                :style="{ background: slide.bg }"
              >
                <span class="text-6xl mb-4">{{ slide.emoji }}</span>
                <h3 class="text-2xl font-bold">{{ currentEffect.toUpperCase() }}</h3>
                <p class="text-white/70 mt-2">Slide {{ i + 1 }} of {{ demoSlides.length }}</p>
              </div>
            </SCarouselSlide>
          </SCarousel>
        </div>
      </DemoSection>
    </section>

    <!-- Pagination Styles -->
    <section id="pagination-styles">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Pagination Styles</h2>
      <DemoSection 
        title="4 Pagination Variants"
        description="Choose from dots, bars, numbers, or fraction pagination styles."
        :code="dotsStyleCode"
        language="vue"
      >
        <div class="space-y-4">
          <div class="flex gap-2">
            <SButton
              v-for="style in dotsStyles"
              :key="style"
              :variant="currentDotsStyle === style ? 'light' : 'ghost'"
              size="sm"
              @click="currentDotsStyle = style"
            >
              {{ style.charAt(0).toUpperCase() + style.slice(1) }}
            </SButton>
          </div>
          
          <SCarousel 
            v-model="dotsStyleIndex"
            height="220px"
            border-radius="12px"
            :dots-style="currentDotsStyle"
          >
            <SCarouselSlide v-for="(slide, i) in demoSlides.slice(0, 4)" :key="i">
              <div 
                class="w-full h-full flex items-center justify-center text-white"
                :style="{ background: slide.bg }"
              >
                <span class="text-4xl">{{ slide.emoji }}</span>
              </div>
            </SCarouselSlide>
          </SCarousel>
        </div>
      </DemoSection>
    </section>

    <!-- Arrow Placement -->
    <section id="arrow-placement">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Arrow Placement</h2>
      <DemoSection 
        title="7 Arrow Positioning Options"
        description="Position navigation arrows in corners, center, or classic side placement."
        :code="arrowPlacementCode"
        language="vue"
      >
        <div class="space-y-4">
          <div class="flex flex-wrap gap-2">
            <SButton
              v-for="placement in arrowPlacements"
              :key="placement"
              :variant="currentArrowPlacement === placement ? 'light' : 'ghost'"
              size="sm"
              @click="currentArrowPlacement = placement"
            >
              {{ placement }}
            </SButton>
          </div>
          
          <SCarousel 
            v-model="arrowPlacementIndex"
            height="260px"
            border-radius="12px"
            :arrow-placement="currentArrowPlacement"
            :show-dots="false"
          >
            <SCarouselSlide v-for="(slide, i) in demoSlides.slice(0, 4)" :key="i">
              <div 
                class="w-full h-full flex flex-col items-center justify-center text-white"
                :style="{ background: slide.bg }"
              >
                <span class="text-5xl mb-3">🎯</span>
                <h3 class="text-xl font-bold">{{ currentArrowPlacement }}</h3>
                <p class="text-white/70 mt-2 text-sm">Arrow placement demo</p>
              </div>
            </SCarouselSlide>
          </SCarousel>
        </div>
      </DemoSection>
    </section>

    <!-- Easing Functions -->
    <section id="easing-functions">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Easing Functions</h2>
      <DemoSection 
        title="7 Easing Options"
        description="Customize animation feel with different easing curves including spring and bounce."
        :code="easingCode"
        language="vue"
      >
        <div class="space-y-4">
          <div class="flex flex-wrap gap-2">
            <SButton
              v-for="easing in easings"
              :key="easing"
              :variant="currentEasing === easing ? 'light' : 'ghost'"
              size="sm"
              @click="currentEasing = easing"
            >
              {{ easing }}
            </SButton>
          </div>
          
          <SCarousel 
            v-model="easingIndex"
            height="200px"
            border-radius="12px"
            :easing="currentEasing"
            :speed="700"
          >
            <SCarouselSlide v-for="(slide, i) in demoSlides.slice(0, 3)" :key="i">
              <div 
                class="w-full h-full flex items-center justify-center text-white"
                :style="{ background: slide.bg }"
              >
                <div class="text-center">
                  <span class="text-4xl">{{ slide.emoji }}</span>
                  <p class="mt-2 font-semibold">{{ currentEasing }}</p>
                </div>
              </div>
            </SCarouselSlide>
          </SCarousel>
        </div>
      </DemoSection>
    </section>

    <!-- Autoplay with Counter -->
    <section id="autoplay-&-counter">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Autoplay & Counter</h2>
      <DemoSection 
        title="Auto-Advancing with Progress & Counter"
        description="Automatically advance slides with progress bar and slide counter. Hover to pause."
        :code="autoplayCode"
        language="vue"
      >
        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <SButton
              :variant="autoplayEnabled ? 'light' : 'ghost'"
              size="sm"
              @click="autoplayEnabled = !autoplayEnabled"
            >
              {{ autoplayEnabled ? '⏸ Pause' : '▶ Play' }}
            </SButton>
            <span class="text-sm text-(--s-text-secondary)">Hover over carousel to pause</span>
          </div>
          
          <SCarousel 
            v-model="autoplayIndex"
            :autoplay="autoplayEnabled"
            :autoplay-delay="2500"
            :pause-on-hover="true"
            :show-progress="true"
            :show-counter="true"
            :loop="true"
            height="250px"
            border-radius="12px"
          >
            <SCarouselSlide v-for="(slide, i) in demoSlides" :key="i">
              <div 
                class="w-full h-full flex flex-col items-center justify-center text-white"
                :style="{ background: slide.bg }"
              >
                <span class="text-5xl mb-3">🎬</span>
                <h3 class="text-2xl font-bold">{{ slide.title }}</h3>
              </div>
            </SCarouselSlide>
          </SCarousel>
        </div>
      </DemoSection>
    </section>

    <!-- Mousewheel -->
    <section id="mousewheel-navigation">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Mousewheel Navigation</h2>
      <DemoSection 
        title="Scroll to Navigate"
        description="Navigate slides using mousewheel or trackpad gestures."
        :code="mousewheelCode"
        language="vue"
      >
        <div class="space-y-2">
          <p class="text-sm text-(--s-text-tertiary)">🖱️ Try scrolling with your mouse wheel!</p>
          <SCarousel 
            v-model="mousewheelIndex"
            :mousewheel="true"
            :grab-cursor="true"
            height="220px"
            border-radius="12px"
          >
            <SCarouselSlide v-for="(slide, i) in demoSlides" :key="i">
              <div 
                class="w-full h-full flex items-center justify-center text-white"
                :style="{ background: slide.bg }"
              >
                <div class="text-center">
                  <span class="text-5xl">🖱️</span>
                  <p class="mt-3 font-semibold">Scroll to navigate!</p>
                </div>
              </div>
            </SCarouselSlide>
          </SCarousel>
        </div>
      </DemoSection>
    </section>

    <!-- Vertical -->
    <section id="vertical-direction">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Vertical Direction</h2>
      <DemoSection 
        title="Vertical Carousel"
        description="Slides arranged vertically with up/down navigation."
        :code="verticalCode"
        language="vue"
      >
        <SCarousel 
          v-model="verticalIndex"
          direction="vertical"
          height="300px"
          border-radius="12px"
          :mousewheel="true"
        >
          <SCarouselSlide v-for="(slide, i) in demoSlides.slice(0, 4)" :key="i">
            <div 
              class="w-full h-full flex items-center justify-center text-white"
              :style="{ background: slide.bg }"
            >
              <div class="text-center">
                <span class="text-5xl">⬆️⬇️</span>
                <h3 class="text-xl font-bold mt-4">Vertical Slide {{ i + 1 }}</h3>
              </div>
            </div>
          </SCarouselSlide>
        </SCarousel>
      </DemoSection>
    </section>

    <!-- Loop & Rewind -->
    <section id="loop-&-rewind">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Loop & Rewind</h2>
      <DemoSection 
        title="Infinite Navigation"
        description="Loop mode for seamless infinite scroll, or rewind for jump-back behavior."
        :code="loopCode"
        language="vue"
      >
        <SCarousel 
          v-model="loopIndex"
          :loop="true"
          height="220px"
          border-radius="12px"
          easing="bounce"
        >
          <SCarouselSlide v-for="(slide, i) in demoSlides.slice(0, 3)" :key="i">
            <div 
              class="w-full h-full flex items-center justify-center text-white"
              :style="{ background: slide.bg }"
            >
              <div class="text-center">
                <span class="text-5xl">🔄</span>
                <h3 class="text-xl font-bold mt-4">{{ slide.title }}</h3>
                <p class="text-white/70 text-sm">Loop enabled - navigate infinitely!</p>
              </div>
            </div>
          </SCarouselSlide>
        </SCarousel>
      </DemoSection>
    </section>

    <!-- Programmatic Control -->
    <section id="programmatic-control">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Programmatic Control</h2>
      <DemoSection 
        title="Exposed Methods & API"
        description="Control the carousel programmatically using exposed methods like next(), prev(), pause(), resume()."
        :code="methodsCode"
        language="vue"
      >
        <div class="space-y-4">
          <div class="flex flex-wrap gap-2">
            <SButton
              variant="ghost"
              size="sm"
              @click="carouselRef?.prev()"
            >
              ← Prev
            </SButton>
            <SButton
              variant="ghost"
              size="sm"
              @click="carouselRef?.next()"
            >
              Next →
            </SButton>
            <SButton
              v-for="i in 5"
              :key="i"
              variant="ghost"
              size="sm"
              :class="customIndex === i - 1 ? 'ring-2 ring-primary' : ''"
              @click="carouselRef?.goTo(i - 1)"
            >
              {{ i }}
            </SButton>
          </div>
          
          <SCarousel 
            ref="carouselRef"
            v-model="customIndex"
            height="200px"
            border-radius="12px"
            :show-arrows="false"
            :show-dots="false"
            easing="spring"
          >
            <SCarouselSlide v-for="(slide, i) in demoSlides" :key="i">
              <div 
                class="w-full h-full flex items-center justify-center text-white"
                :style="{ background: slide.bg }"
              >
                <div class="text-center">
                  <span class="text-4xl">🎮</span>
                  <h3 class="text-xl font-bold mt-3">Slide {{ i + 1 }}</h3>
                </div>
              </div>
            </SCarouselSlide>
          </SCarousel>
        </div>
      </DemoSection>
    </section>

    <!-- Real-World Examples -->
    <section id="real-world-examples">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Real-World Examples</h2>
      <DemoSection 
        title="Product Gallery"
        description="A typical e-commerce product image carousel with thumbnails and autoplay."
        :code="thumbnailsCode"
        language="vue"
      >
        <SCarousel 
          v-model="thumbnailIndex"
          height="280px"
          border-radius="12px"
          :autoplay="true"
          :autoplay-delay="4000"
          :pause-on-hover="true"
          :loop="true"
        >
          <SCarouselSlide v-for="(slide, i) in demoSlides" :key="i">
            <div 
              class="w-full h-full flex flex-col items-center justify-center text-white"
              :style="{ background: slide.bg }"
            >
              <span class="text-5xl mb-3">{{ slide.emoji }}</span>
              <h3 class="text-xl font-bold">{{ slide.title }}</h3>
              <p class="text-white/70 text-sm">Product {{ i + 1 }}</p>
            </div>
          </SCarouselSlide>
        </SCarousel>
      </DemoSection>
    </section>

    <!-- API Reference -->
    <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">API Reference</h2>
    <SApiSection>
      <div class="space-y-8">
        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-view-carousel text-(--s-primary)" />
            SCarousel
          </h3>
          <SApiTable title="Props" type="props" :props="carouselProps" />
          <SApiTable title="Events" type="events" :events="carouselEvents" class="mt-6" />
          <SApiTable title="Slots" type="slots" :slots="carouselSlots" class="mt-6" />
          <SApiTable title="Exposed Methods" type="methods" :methods="carouselMethods" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-image-outline text-(--s-primary)" />
            SCarouselSlide
          </h3>
          <SApiTable title="Props" type="props" :props="carouselSlideProps" />
          <SApiTable title="Slots" type="slots" :slots="carouselSlideSlots" class="mt-6" />
        </div>
      </div>
    </SApiSection>
  </div>
</template>
