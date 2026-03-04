<script setup lang="ts">
import { ref } from 'vue'
import DemoSection from '../../components/DemoSection.vue'
import {
  SMorphingCard,
  SMorphingCardTrigger,
  SMorphingCardContent,
  SMorphingCardImage,
  SMorphingCardTitle,
  SMorphingCardDescription,
  SMorphingCardClose,
  SButton,
  SApiSection,
  SApiTable,
  SApiKeyboard
} from '../../index'
import type { ApiProp, ApiEvent, KeyboardShortcut } from '../../index'

// Demo images
const demoImages = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    title: 'Mountain Sunrise',
    subtitle: 'Swiss Alps',
    description: 'Experience the breathtaking beauty of sunrise over the Swiss Alps. The golden light paints the snow-capped peaks in warm hues, creating a magical moment that photographers dream of capturing. This stunning panorama showcases nature at its most majestic.'
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
    title: 'Forest Path',
    subtitle: 'Pacific Northwest',
    description: 'Wander through ancient forests where towering trees create a natural cathedral of green. The soft light filters through the canopy, illuminating ferns and moss-covered logs. Every step deeper into this enchanted woodland reveals new wonders.'
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&q=80',
    title: 'Ocean Waves',
    subtitle: 'Coastal Beauty',
    description: 'The eternal dance of waves against the shore creates a mesmerizing rhythm. Watch as turquoise waters crash against weathered rocks, sending spray into the air. The salt-tinged breeze carries the essence of the sea.'
  }
]

// Code snippets
const basicCode = `<SMorphingCard>
  <template #trigger>
    <SMorphingCardTrigger>
      <SMorphingCardImage
        src="https://example.com/image.jpg"
        aspect-ratio="16/9"
      />
      <div class="p-4">
        <SMorphingCardTitle>Card Title</SMorphingCardTitle>
        <p class="text-sm text-gray-500 mt-1">Click to expand</p>
      </div>
    </SMorphingCardTrigger>
  </template>
  
  <template #content>
    <SMorphingCardClose />
    <SMorphingCardImage
      src="https://example.com/image.jpg"
      aspect-ratio="16/9"
    />
    <SMorphingCardContent>
      <SMorphingCardTitle>Card Title</SMorphingCardTitle>
      <SMorphingCardDescription class="mt-2">
        Detailed description that appears when expanded...
      </SMorphingCardDescription>
    </SMorphingCardContent>
  </template>
</SMorphingCard>`

const galleryCode = `<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
  <SMorphingCard v-for="image in images" :key="image.id">
    <template #trigger>
      <SMorphingCardTrigger cursor="zoom-in">
        <SMorphingCardImage :src="image.src" />
        <div class="p-4">
          <SMorphingCardTitle as="h3">{{ image.title }}</SMorphingCardTitle>
        </div>
      </SMorphingCardTrigger>
    </template>
    
    <template #content>
      <SMorphingCardClose />
      <SMorphingCardImage :src="image.src" />
      <SMorphingCardContent>
        <SMorphingCardTitle>{{ image.title }}</SMorphingCardTitle>
        <SMorphingCardDescription>{{ image.description }}</SMorphingCardDescription>
      </SMorphingCardContent>
    </template>
  </SMorphingCard>
</div>`

// API Documentation
const cardProps: ApiProp[] = [
  { name: 'modelValue', type: 'boolean', default: 'false', description: 'Control card expansion with v-model' },
  { name: 'duration', type: 'number', default: '500', description: 'Transition duration in milliseconds' },
  { name: 'easing', type: 'string', default: 'cubic-bezier(0.32, 0.72, 0, 1)', description: 'CSS easing function' },
  { name: 'closeOnBackdrop', type: 'boolean', default: 'true', description: 'Close when clicking backdrop' },
  { name: 'closeOnEscape', type: 'boolean', default: 'true', description: 'Close on Escape key press' },
  { name: 'lockScroll', type: 'boolean', default: 'true', description: 'Lock body scroll when expanded' },
  { name: 'zIndex', type: 'number', default: '1000', description: 'Z-index for expanded card' },
  { name: 'backdropBlur', type: 'boolean', default: 'true', description: 'Enable backdrop blur effect' },
  { name: 'maxWidth', type: 'number', default: '600', description: 'Maximum width of expanded card in pixels' },
  { name: 'maxHeight', type: 'number', default: '700', description: 'Maximum height of expanded card in pixels' }
]

const cardEvents: ApiEvent[] = [
  { name: 'update:modelValue', payload: 'boolean', description: 'Emitted when expansion state changes' },
  { name: 'open', payload: 'void', description: 'Emitted when card starts opening' },
  { name: 'close', payload: 'void', description: 'Emitted when card starts closing' },
  { name: 'opened', payload: 'void', description: 'Emitted after open animation completes' },
  { name: 'closed', payload: 'void', description: 'Emitted after close animation completes' }
]

const triggerProps: ApiProp[] = [
  { name: 'triggerClass', type: 'string', default: "''", description: 'Additional CSS class' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the trigger' },
  { name: 'cursor', type: "'pointer' | 'zoom-in' | 'default'", default: "'pointer'", description: 'Cursor style on hover' }
]

const contentProps: ApiProp[] = [
  { name: 'padding', type: "'none' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Padding size' },
  { name: 'contentClass', type: 'string', default: "''", description: 'Additional CSS class' }
]

const imageProps: ApiProp[] = [
  { name: 'src', type: 'string', default: '-', description: 'Image source URL (required)' },
  { name: 'alt', type: 'string', default: "''", description: 'Alt text for accessibility' },
  { name: 'aspectRatio', type: 'string', default: "'16/9'", description: 'Aspect ratio of the container' },
  { name: 'objectFit', type: "'cover' | 'contain' | 'fill' | 'none'", default: "'cover'", description: 'Object fit style' },
  { name: 'loading', type: "'lazy' | 'eager'", default: "'lazy'", description: 'Image loading strategy' }
]

const closeProps: ApiProp[] = [
  { name: 'closeClass', type: 'string', default: "''", description: 'Additional CSS class' },
  { name: 'position', type: "'top-right' | 'top-left' | 'inline'", default: "'top-right'", description: 'Button position' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Button size' }
]

const keyboardShortcuts: KeyboardShortcut[] = [
  { keys: 'Escape', action: 'Close expanded card' },
  { keys: 'Enter / Space', action: 'Open card (when trigger is focused)' }
]
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-(--s-text-primary) mb-2">Morphing Card</h1>
      <p class="text-lg text-(--s-text-secondary)">
        A card that expands with smooth layout animations from preview to full detail view.
      </p>
    </header>

    <!-- Features -->
    <article>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-animation-play text-xl text-purple-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Smooth Morphing</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Card smoothly transitions from trigger position to expanded view.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-image-multiple text-xl text-blue-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Image Gallery Ready</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Perfect for portfolios, product cards, and photo galleries.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-keyboard text-xl text-emerald-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Keyboard Support</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Full keyboard navigation with ESC to close.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-blur text-xl text-cyan-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Backdrop Blur</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Beautiful frosted glass backdrop effect.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-puzzle text-xl text-amber-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Composable</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Flexible sub-components for complete customization.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-eye text-xl text-red-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Accessible</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">ARIA compliant with focus management.</p>
        </div>
      </div>
    </article>

    <!-- Basic Example -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Basic Usage</h2>
      <DemoSection
        title="Single Card"
        description="Click the card to see it expand with a smooth morphing animation."
        :code="basicCode"
        language="vue"
      >
        <div class="max-w-sm">
          <SMorphingCard>
            <template #trigger>
              <SMorphingCardTrigger cursor="zoom-in">
                <SMorphingCardImage
                  :src="demoImages[0].src"
                  aspect-ratio="4/3"
                />
                <div class="p-4">
                  <SMorphingCardTitle as="h3" title-class="text-base">
                    {{ demoImages[0].title }}
                  </SMorphingCardTitle>
                  <p class="text-sm text-(--s-text-tertiary) mt-1">{{ demoImages[0].subtitle }}</p>
                </div>
              </SMorphingCardTrigger>
            </template>
            
            <template #content>
              <SMorphingCardClose />
              <SMorphingCardImage
                :src="demoImages[0].src"
                aspect-ratio="16/9"
              />
              <SMorphingCardContent>
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-xs px-2 py-0.5 rounded-full bg-(--s-primary)/10 text-(--s-primary)">
                    {{ demoImages[0].subtitle }}
                  </span>
                </div>
                <SMorphingCardTitle>{{ demoImages[0].title }}</SMorphingCardTitle>
                <SMorphingCardDescription class="mt-3">
                  {{ demoImages[0].description }}
                </SMorphingCardDescription>
                <div class="mt-6 flex gap-3">
                  <SButton size="small" variant="secondary">
                    <span class="mdi mdi-share-variant mr-2" />
                    Share
                  </SButton>
                  <SButton size="small">
                    <span class="mdi mdi-download mr-2" />
                    Download
                  </SButton>
                </div>
              </SMorphingCardContent>
            </template>
          </SMorphingCard>
        </div>
      </DemoSection>
    </section>

    <!-- Gallery Example -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Image Gallery</h2>
      <DemoSection
        title="Gallery Grid"
        description="Multiple cards in a responsive grid layout."
        :code="galleryCode"
        language="vue"
      >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SMorphingCard v-for="image in demoImages" :key="image.id">
            <template #trigger>
              <SMorphingCardTrigger cursor="zoom-in">
                <SMorphingCardImage
                  :src="image.src"
                  :alt="image.title"
                  aspect-ratio="4/3"
                />
                <div class="p-4">
                  <SMorphingCardTitle as="h3" title-class="text-base">
                    {{ image.title }}
                  </SMorphingCardTitle>
                  <p class="text-sm text-(--s-text-tertiary) mt-1">{{ image.subtitle }}</p>
                </div>
              </SMorphingCardTrigger>
            </template>
            
            <template #content>
              <SMorphingCardClose />
              <SMorphingCardImage
                :src="image.src"
                :alt="image.title"
                aspect-ratio="16/9"
              />
              <SMorphingCardContent>
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-xs px-2 py-0.5 rounded-full bg-(--s-primary)/10 text-(--s-primary)">
                    {{ image.subtitle }}
                  </span>
                </div>
                <SMorphingCardTitle>{{ image.title }}</SMorphingCardTitle>
                <SMorphingCardDescription class="mt-3">
                  {{ image.description }}
                </SMorphingCardDescription>
              </SMorphingCardContent>
            </template>
          </SMorphingCard>
        </div>
      </DemoSection>
    </section>

    <!-- API Reference -->
    <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">API Reference</h2>
    <SApiSection>
      <SApiTable
        title="SMorphingCard Props"
        type="props"
        :props="cardProps"
      />

      <SApiTable
        title="Events"
        type="events"
        :events="cardEvents"
      />

      <SApiTable
        title="SMorphingCardTrigger Props"
        type="props"
        :props="triggerProps"
      />

      <SApiTable
        title="SMorphingCardContent Props"
        type="props"
        :props="contentProps"
      />

      <SApiTable
        title="SMorphingCardImage Props"
        type="props"
        :props="imageProps"
      />

      <SApiTable
        title="SMorphingCardClose Props"
        type="props"
        :props="closeProps"
      />

      <SApiKeyboard :shortcuts="keyboardShortcuts" />
    </SApiSection>
  </div>
</template>
