<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import {
  SButton,
  SApiSection,
  SApiTable,
  SApiKeyboard,
  // Morphing Modal
  SMorphingModal,
  SMorphingModalTrigger,
  SMorphingModalClose,
  SMorphingModalTitle,
  SMorphingModalSubtitle,
  SMorphingModalDescription,
  SMorphingModalImage
} from '../../index'
import type { ApiProp, ApiEvent, ApiSlot, KeyboardShortcut } from '../../index'

// Code snippets
const basicCode = `<SMorphingModal>
  <template #trigger>
    <SMorphingModalTrigger>
      <div class="card">
        <img src="/lamp.jpg" alt="Desk Lamp" />
        <SMorphingModalTitle>EB27</SMorphingModalTitle>
        <SMorphingModalSubtitle>Edouard Wilfrid Buquet</SMorphingModalSubtitle>
      </div>
    </SMorphingModalTrigger>
  </template>
  
  <template #content>
    <div class="expanded-content">
      <SMorphingModalImage src="/lamp.jpg" alt="Desk Lamp" />
      <div class="p-6">
        <div class="flex items-start justify-between">
          <div>
            <SMorphingModalTitle>EB27</SMorphingModalTitle>
            <SMorphingModalSubtitle>Edouard Wilfrid Buquet</SMorphingModalSubtitle>
          </div>
          <SMorphingModalClose />
        </div>
        <SMorphingModalDescription class="mt-4">
          A desk lamp designed in 1925...
        </SMorphingModalDescription>
      </div>
    </div>
  </template>
</SMorphingModal>`

const customDurationCode = `<SMorphingModal :duration="1000" easing="cubic-bezier(0.34, 1.56, 0.64, 1)">
  <template #trigger>
    <SMorphingModalTrigger>
      <!-- trigger content -->
    </SMorphingModalTrigger>
  </template>
  <template #content>
    <!-- expanded content -->
  </template>
</SMorphingModal>`

const imageCode = `<SMorphingModal>
  <template #trigger>
    <SMorphingModalTrigger>
      <div class="image-card">
        <SMorphingModalImage 
          src="/architecture.jpg" 
          alt="Sony Style Store" 
          object-fit="cover"
        />
      </div>
    </SMorphingModalTrigger>
  </template>
  <template #content>
    <SMorphingModalImage 
      src="/architecture.jpg" 
      alt="Sony Style Store" 
      image-class="aspect-video"
    />
    <div class="p-6">
      <SMorphingModalTitle>Sony Style Store</SMorphingModalTitle>
      <SMorphingModalClose />
    </div>
  </template>
</SMorphingModal>`

// API Documentation
const morphingModalProps: ApiProp[] = [
  { name: 'modelValue', type: 'boolean', default: 'false', description: 'Control modal visibility with v-model' },
  { name: 'duration', type: 'number', default: '700', description: 'Transition duration in milliseconds' },
  { name: 'easing', type: 'string', default: 'cubic-bezier(0.32, 0.72, 0, 1)', description: 'CSS easing function for the morph animation' },
  { name: 'closeOnBackdrop', type: 'boolean', default: 'true', description: 'Close when clicking the backdrop' },
  { name: 'closeOnEscape', type: 'boolean', default: 'true', description: 'Close on Escape key press' },
  { name: 'lockScroll', type: 'boolean', default: 'true', description: 'Lock body scroll when modal is open' },
  { name: 'zIndex', type: 'number', default: '1000', description: 'Z-index for the modal overlay' },
  { name: 'backdropBlur', type: 'boolean', default: 'true', description: 'Apply blur effect to the backdrop' }
]

const morphingModalEvents: ApiEvent[] = [
  { name: 'update:modelValue', payload: 'boolean', description: 'Emitted when visibility changes' },
  { name: 'open', payload: 'void', description: 'Emitted when modal starts opening' },
  { name: 'close', payload: 'void', description: 'Emitted when modal starts closing' },
  { name: 'opened', payload: 'void', description: 'Emitted after open animation completes' },
  { name: 'closed', payload: 'void', description: 'Emitted after close animation completes' }
]

const morphingModalSlots: ApiSlot[] = [
  { name: 'trigger', description: 'The trigger element that the modal morphs from. Should contain SMorphingModalTrigger.' },
  { name: 'content', description: 'The expanded modal content. Visible when the modal is open.' }
]

const triggerEvents: ApiEvent[] = [
  { name: 'click', payload: 'MouseEvent', description: 'Emitted when the trigger opens the modal' }
]

const triggerSlots: ApiSlot[] = [
  { name: 'default', description: 'Trigger card or element used as the morph origin' }
]

const triggerProps: ApiProp[] = [
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the trigger interaction' },
  { name: 'triggerClass', type: 'string', default: "''", description: 'Additional CSS class for the trigger wrapper' }
]

const titleProps: ApiProp[] = [
  { name: 'titleClass', type: 'string', default: "''", description: 'Additional CSS class for the title element' }
]

const titleSlots: ApiSlot[] = [
  { name: 'default', description: 'Title content for trigger and expanded states' }
]

const subtitleProps: ApiProp[] = [
  { name: 'subtitleClass', type: 'string', default: "''", description: 'Additional CSS class for the subtitle element' }
]

const subtitleSlots: ApiSlot[] = [
  { name: 'default', description: 'Subtitle content rendered below the title' }
]

const descriptionProps: ApiProp[] = [
  { name: 'descriptionClass', type: 'string', default: "''", description: 'Additional CSS class for the description element' },
  { name: 'disableLayoutAnimation', type: 'boolean', default: 'false', description: 'Disable the fade-in animation for the description' }
]

const descriptionSlots: ApiSlot[] = [
  { name: 'default', description: 'Expanded description content' }
]

const imageProps: ApiProp[] = [
  { name: 'src', type: 'string', default: '-', description: 'Image source URL (required)' },
  { name: 'alt', type: 'string', default: "''", description: 'Alt text for accessibility' },
  { name: 'imageClass', type: 'string', default: "''", description: 'Additional CSS class for the image element' },
  { name: 'objectFit', type: "'cover' | 'contain' | 'fill' | 'none'", default: "'cover'", description: 'CSS object-fit property' }
]

const closeProps: ApiProp[] = [
  { name: 'closeClass', type: 'string', default: "''", description: 'Additional CSS class for the close button' }
]

const closeSlots: ApiSlot[] = [
  { name: 'default', description: 'Custom close icon or label content' }
]

const keyboardShortcuts: KeyboardShortcut[] = [
  { keys: 'Escape', action: 'Close the modal (if closeOnEscape is true)' },
  { keys: 'Enter / Space', action: 'Open modal when trigger is focused' },
  { keys: 'Tab', action: 'Navigate between focusable elements' }
]
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- Header -->
    <header>
      <div class="flex items-center gap-3 mb-2">
        <span class="mdi mdi-transition text-3xl text-(--s-primary)"></span>
        <h1 class="text-4xl font-extrabold text-(--s-text-primary)">Morphing Modal</h1>
      </div>
      <p class="text-lg text-(--s-text-secondary)">
        A dialog that uses layout animations to transition content from a trigger element into a focused view.
        Inspired by <a href="https://motion-primitives.com/docs/morphing-dialog" target="_blank" class="text-(--s-primary) hover:underline">motion-primitives</a>.
      </p>
    </header>

    <!-- Features -->
    <article>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 rounded-xl bg-purple-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-transition text-xl text-purple-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Morph Animation</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Modal morphs from trigger position to center with smooth transitions.</p>
        </div>
        <div class="p-4 rounded-xl bg-cyan-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-blur text-xl text-cyan-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Backdrop Blur</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Beautiful backdrop blur effect for focus and depth.</p>
        </div>
        <div class="p-4 rounded-xl bg-emerald-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-keyboard text-xl text-emerald-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Keyboard Support</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">ESC to close, Enter/Space to open from trigger.</p>
        </div>
        <div class="p-4 rounded-xl bg-blue-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-eye text-xl text-blue-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">ARIA Accessible</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Full ARIA support with role, aria-modal, and focus management.</p>
        </div>
        <div class="p-4 rounded-xl bg-amber-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-tune text-xl text-amber-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Customizable</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Control duration, easing, and behavior via props.</p>
        </div>
        <div class="p-4 rounded-xl bg-red-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-puzzle text-xl text-red-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Composable</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Built with composable sub-components for flexibility.</p>
        </div>
      </div>
    </article>

    <!-- Basic Example -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Basic Example</h2>
      <DemoSection
        title="Morphing Dialog"
        description="Click on the card to see it morph into an expanded dialog. Click outside or press Escape to close."
        :code="basicCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-6">
          <!-- Lamp Example -->
          <SMorphingModal>
            <template #trigger>
              <SMorphingModalTrigger>
                <div class="group w-64 rounded-2xl overflow-hidden bg-(--s-bg-primary) border border-(--s-border) hover:border-(--s-primary)/50 hover:shadow-lg transition-all duration-300">
                  <div class="aspect-[4/3] overflow-hidden bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30">
                    <div class="w-full h-full flex items-center justify-center">
                      <div class="relative">
                        <div class="w-20 h-1 bg-gradient-to-r from-amber-600 to-orange-500 rounded-full shadow-lg" />
                        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-24 bg-gradient-to-b from-amber-600 to-amber-800 rounded-b-full" />
                        <div class="absolute -top-16 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-amber-400/20 blur-xl" />
                        <div class="absolute -top-12 left-1/2 -translate-x-1/2">
                          <div class="w-10 h-10 rotate-45 bg-gradient-to-br from-amber-400 to-orange-500 rounded-sm shadow-xl" />
                        </div>
                        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-2 bg-gradient-to-r from-zinc-700 to-zinc-600 rounded-full shadow" />
                      </div>
                    </div>
                  </div>
                  <div class="p-4">
                    <SMorphingModalTitle titleClass="text-base group-hover:text-(--s-primary) transition-colors">EB27</SMorphingModalTitle>
                    <SMorphingModalSubtitle subtitleClass="text-xs mt-1">Edouard Wilfrid Buquet</SMorphingModalSubtitle>
                  </div>
                </div>
              </SMorphingModalTrigger>
            </template>
            
            <template #content>
              <div class="overflow-hidden">
                <div class="aspect-video overflow-hidden bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30">
                  <div class="w-full h-full flex items-center justify-center">
                    <div class="relative scale-150">
                      <div class="w-20 h-1 bg-gradient-to-r from-amber-600 to-orange-500 rounded-full shadow-lg" />
                      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-24 bg-gradient-to-b from-amber-600 to-amber-800 rounded-b-full" />
                      <div class="absolute -top-16 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-amber-400/30 blur-2xl" />
                      <div class="absolute -top-12 left-1/2 -translate-x-1/2">
                        <div class="w-10 h-10 rotate-45 bg-gradient-to-br from-amber-400 to-orange-500 rounded-sm shadow-xl" />
                      </div>
                      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-2 bg-gradient-to-r from-zinc-700 to-zinc-600 rounded-full shadow" />
                    </div>
                  </div>
                </div>
                <div class="p-6">
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <SMorphingModalTitle titleClass="text-xl">EB27</SMorphingModalTitle>
                      <SMorphingModalSubtitle subtitleClass="mt-1">Edouard Wilfrid Buquet</SMorphingModalSubtitle>
                    </div>
                    <SMorphingModalClose />
                  </div>
                  <SMorphingModalDescription descriptionClass="mt-4 text-sm leading-relaxed">
                    A desk lamp designed by Edouard Wilfrid Buquet in 1925. It features a double-arm design 
                    and is made from nickel-plated brass, aluminium and varnished wood. This iconic piece 
                    of Art Deco design combines functionality with elegant aesthetics, and has been 
                    featured in numerous design museums worldwide.
                  </SMorphingModalDescription>
                </div>
              </div>
            </template>
          </SMorphingModal>

          <!-- Book Example -->
          <SMorphingModal>
            <template #trigger>
              <SMorphingModalTrigger>
                <div class="group w-52 rounded-2xl overflow-hidden bg-(--s-bg-primary) border border-(--s-border) hover:border-(--s-primary)/50 hover:shadow-lg transition-all duration-300">
                  <div class="aspect-[3/4] overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900/40 dark:to-indigo-900/40">
                    <div class="w-full h-full flex items-center justify-center p-6">
                      <div class="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 rounded shadow-xl flex items-center justify-center p-4 transform group-hover:scale-105 transition-transform duration-300">
                        <div class="text-white text-center">
                          <span class="mdi mdi-run text-4xl" />
                          <div class="mt-2 text-xs font-medium opacity-80">走ることについて語るときに僕の語ること</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="p-4">
                    <SMorphingModalTitle titleClass="text-sm leading-tight group-hover:text-(--s-primary) transition-colors">What I Talk About When I Talk About Running</SMorphingModalTitle>
                    <SMorphingModalSubtitle subtitleClass="text-xs mt-2">Haruki Murakami</SMorphingModalSubtitle>
                  </div>
                </div>
              </SMorphingModalTrigger>
            </template>
            
            <template #content>
              <div class="overflow-hidden">
                <div class="aspect-video overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900/40 dark:to-indigo-900/40">
                  <div class="w-full h-full flex items-center justify-center p-8">
                    <div class="w-32 h-44 bg-gradient-to-br from-blue-500 to-indigo-600 rounded shadow-2xl flex items-center justify-center p-4">
                      <div class="text-white text-center">
                        <span class="mdi mdi-run text-5xl" />
                        <div class="mt-2 text-xs font-medium opacity-80">走ることについて語るときに僕の語ること</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="p-6">
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <SMorphingModalTitle titleClass="text-lg">What I Talk About When I Talk About Running</SMorphingModalTitle>
                      <SMorphingModalSubtitle subtitleClass="mt-1">Haruki Murakami</SMorphingModalSubtitle>
                    </div>
                    <SMorphingModalClose />
                  </div>
                  <SMorphingModalDescription descriptionClass="mt-4 text-sm leading-relaxed">
                    A memoir in which Murakami reflects on his experiences as a runner and writer. 
                    The book explores the parallels between running and writing, discussing discipline, 
                    pain, and the pursuit of excellence. Published in 2007, it offers a unique insight 
                    into Murakami's philosophy of life and creativity.
                  </SMorphingModalDescription>
                </div>
              </div>
            </template>
          </SMorphingModal>
        </div>
      </DemoSection>
    </section>

    <!-- Image Gallery Example -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Image Gallery</h2>
      <DemoSection
        title="Image Gallery Modal"
        description="Perfect for image galleries where clicking an image expands it with more details."
        :code="imageCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-4">
          <!-- Architecture Image -->
          <SMorphingModal>
            <template #trigger>
              <SMorphingModalTrigger>
                <div class="group w-72 h-48 rounded-xl overflow-hidden border border-(--s-border) hover:border-(--s-primary)/50 hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <div class="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                    <div class="text-center">
                      <span class="mdi mdi-office-building text-5xl text-(--s-text-tertiary) group-hover:text-(--s-primary) transition-colors" />
                      <p class="mt-2 text-sm text-(--s-text-tertiary)">Sony Style Store</p>
                    </div>
                  </div>
                </div>
              </SMorphingModalTrigger>
            </template>
            
            <template #content>
              <div class="overflow-hidden">
                <div class="aspect-video bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                  <span class="mdi mdi-office-building text-8xl text-(--s-text-tertiary)" />
                </div>
                <div class="p-6">
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <SMorphingModalTitle titleClass="text-xl">Sony Style Store</SMorphingModalTitle>
                      <SMorphingModalSubtitle subtitleClass="mt-1">Berlin, Germany (2000)</SMorphingModalSubtitle>
                    </div>
                    <SMorphingModalClose />
                  </div>
                  <SMorphingModalDescription descriptionClass="mt-4 text-sm leading-relaxed">
                    The Sony Style Store was located in the Sony Center complex at Potsdamer Platz in Berlin.
                    The building featured innovative architecture with a distinctive glass and steel design
                    that became an iconic landmark of modern Berlin.
                  </SMorphingModalDescription>
                </div>
              </div>
            </template>
          </SMorphingModal>

          <!-- Nature Image -->
          <SMorphingModal>
            <template #trigger>
              <SMorphingModalTrigger>
                <div class="group w-72 h-48 rounded-xl overflow-hidden border border-(--s-border) hover:border-(--s-primary)/50 hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <div class="w-full h-full bg-gradient-to-br from-emerald-200 to-teal-300 dark:from-emerald-800 dark:to-teal-900 flex items-center justify-center">
                    <div class="text-center">
                      <span class="mdi mdi-pine-tree text-5xl text-(--s-text-tertiary) group-hover:text-emerald-600 transition-colors" />
                      <p class="mt-2 text-sm text-(--s-text-tertiary)">Forest Landscape</p>
                    </div>
                  </div>
                </div>
              </SMorphingModalTrigger>
            </template>
            
            <template #content>
              <div class="overflow-hidden">
                <div class="aspect-video bg-gradient-to-br from-emerald-200 to-teal-300 dark:from-emerald-800 dark:to-teal-900 flex items-center justify-center">
                  <span class="mdi mdi-pine-tree text-8xl text-emerald-600" />
                </div>
                <div class="p-6">
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <SMorphingModalTitle titleClass="text-xl">Forest Landscape</SMorphingModalTitle>
                      <SMorphingModalSubtitle subtitleClass="mt-1">Pacific Northwest</SMorphingModalSubtitle>
                    </div>
                    <SMorphingModalClose />
                  </div>
                  <SMorphingModalDescription descriptionClass="mt-4 text-sm leading-relaxed">
                    The Pacific Northwest is known for its lush evergreen forests, 
                    dramatic coastlines, and misty mountain ranges. This region supports 
                    some of the most biodiverse temperate rainforests in the world.
                  </SMorphingModalDescription>
                </div>
              </div>
            </template>
          </SMorphingModal>
        </div>
      </DemoSection>
    </section>

    <!-- Custom Duration Example -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Custom Animation</h2>
      <DemoSection
        title="Custom Duration & Easing"
        description="Customize the animation duration and easing function."
        :code="customDurationCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-4">
          <!-- Slow Animation -->
          <SMorphingModal :duration="1000" easing="cubic-bezier(0.34, 1.56, 0.64, 1)">
            <template #trigger>
              <SMorphingModalTrigger>
                <div class="group w-48 rounded-xl overflow-hidden bg-(--s-bg-primary) border border-(--s-border) hover:border-purple-500/50 hover:shadow-lg transition-all duration-300">
                  <div class="aspect-square bg-gradient-to-br from-purple-100 to-pink-200 dark:from-purple-900/40 dark:to-pink-900/40 flex items-center justify-center">
                    <span class="mdi mdi-timer-sand text-5xl text-purple-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <div class="p-4">
                    <SMorphingModalTitle titleClass="text-sm group-hover:text-purple-500 transition-colors">Slow Motion</SMorphingModalTitle>
                    <SMorphingModalSubtitle subtitleClass="text-xs mt-1">1000ms duration</SMorphingModalSubtitle>
                  </div>
                </div>
              </SMorphingModalTrigger>
            </template>
            
            <template #content>
              <div class="overflow-hidden">
                <div class="aspect-video bg-gradient-to-br from-purple-100 to-pink-200 dark:from-purple-900/40 dark:to-pink-900/40 flex items-center justify-center">
                  <span class="mdi mdi-timer-sand text-8xl text-purple-500" />
                </div>
                <div class="p-6">
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <SMorphingModalTitle titleClass="text-xl">Slow Motion</SMorphingModalTitle>
                      <SMorphingModalSubtitle subtitleClass="mt-1">With spring easing</SMorphingModalSubtitle>
                    </div>
                    <SMorphingModalClose />
                  </div>
                  <SMorphingModalDescription descriptionClass="mt-4 text-sm leading-relaxed">
                    This modal uses a 1000ms duration with a spring-like easing function 
                    that gives it a bouncy, elastic feel. Great for playful interfaces!
                  </SMorphingModalDescription>
                </div>
              </div>
            </template>
          </SMorphingModal>

          <!-- Fast Animation -->
          <SMorphingModal :duration="300" easing="ease-out">
            <template #trigger>
              <SMorphingModalTrigger>
                <div class="group w-48 rounded-xl overflow-hidden bg-(--s-bg-primary) border border-(--s-border) hover:border-cyan-500/50 hover:shadow-lg transition-all duration-300">
                  <div class="aspect-square bg-gradient-to-br from-cyan-100 to-blue-200 dark:from-cyan-900/40 dark:to-blue-900/40 flex items-center justify-center">
                    <span class="mdi mdi-lightning-bolt text-5xl text-cyan-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <div class="p-4">
                    <SMorphingModalTitle titleClass="text-sm group-hover:text-cyan-500 transition-colors">Lightning Fast</SMorphingModalTitle>
                    <SMorphingModalSubtitle subtitleClass="text-xs mt-1">300ms duration</SMorphingModalSubtitle>
                  </div>
                </div>
              </SMorphingModalTrigger>
            </template>
            
            <template #content>
              <div class="overflow-hidden">
                <div class="aspect-video bg-gradient-to-br from-cyan-100 to-blue-200 dark:from-cyan-900/40 dark:to-blue-900/40 flex items-center justify-center">
                  <span class="mdi mdi-lightning-bolt text-8xl text-cyan-500" />
                </div>
                <div class="p-6">
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <SMorphingModalTitle titleClass="text-xl">Lightning Fast</SMorphingModalTitle>
                      <SMorphingModalSubtitle subtitleClass="mt-1">Quick and snappy</SMorphingModalSubtitle>
                    </div>
                    <SMorphingModalClose />
                  </div>
                  <SMorphingModalDescription descriptionClass="mt-4 text-sm leading-relaxed">
                    This modal uses a quick 300ms duration with a simple ease-out curve.
                    Perfect for productivity apps where speed is essential.
                  </SMorphingModalDescription>
                </div>
              </div>
            </template>
          </SMorphingModal>
        </div>
      </DemoSection>
    </section>

    <!-- Component Structure -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Component Structure</h2>
      <div class="p-6 rounded-2xl bg-(--s-bg-primary) border border-(--s-border)">
        <pre class="text-sm text-(--s-text-secondary) overflow-x-auto"><code>&lt;SMorphingModal&gt;
  &lt;template #trigger&gt;
    &lt;SMorphingModalTrigger&gt;
      &lt;!-- Your trigger card/element --&gt;
      &lt;SMorphingModalTitle&gt;...&lt;/SMorphingModalTitle&gt;
      &lt;SMorphingModalSubtitle&gt;...&lt;/SMorphingModalSubtitle&gt;
    &lt;/SMorphingModalTrigger&gt;
  &lt;/template&gt;
  
  &lt;template #content&gt;
    &lt;!-- Expanded modal content --&gt;
    &lt;SMorphingModalImage /&gt;
    &lt;SMorphingModalTitle&gt;...&lt;/SMorphingModalTitle&gt;
    &lt;SMorphingModalSubtitle&gt;...&lt;/SMorphingModalSubtitle&gt;
    &lt;SMorphingModalClose /&gt;
    &lt;SMorphingModalDescription&gt;...&lt;/SMorphingModalDescription&gt;
  &lt;/template&gt;
&lt;/SMorphingModal&gt;</code></pre>
      </div>
    </section>

    <!-- API Reference -->
    <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">API Reference</h2>
    <SApiSection>
      <div class="space-y-8">
        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-transition text-(--s-primary)" />
            SMorphingModal
          </h3>
          <SApiTable title="Props" type="props" :props="morphingModalProps" />
          <SApiTable title="Events" type="events" :events="morphingModalEvents" class="mt-6" />
          <SApiTable title="Slots" type="slots" :slots="morphingModalSlots" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-cursor-default-click-outline text-(--s-primary)" />
            SMorphingModalTrigger
          </h3>
          <SApiTable title="Props" type="props" :props="triggerProps" />
          <SApiTable title="Events" type="events" :events="triggerEvents" class="mt-6" />
          <SApiTable title="Slots" type="slots" :slots="triggerSlots" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-close-circle-outline text-(--s-primary)" />
            SMorphingModalClose
          </h3>
          <SApiTable title="Props" type="props" :props="closeProps" />
          <SApiTable title="Slots" type="slots" :slots="closeSlots" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-format-title text-(--s-primary)" />
            SMorphingModalTitle
          </h3>
          <SApiTable title="Props" type="props" :props="titleProps" />
          <SApiTable title="Slots" type="slots" :slots="titleSlots" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-format-subscript text-(--s-primary)" />
            SMorphingModalSubtitle
          </h3>
          <SApiTable title="Props" type="props" :props="subtitleProps" />
          <SApiTable title="Slots" type="slots" :slots="subtitleSlots" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-text text-(--s-primary)" />
            SMorphingModalDescription
          </h3>
          <SApiTable title="Props" type="props" :props="descriptionProps" />
          <SApiTable title="Slots" type="slots" :slots="descriptionSlots" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-image-outline text-(--s-primary)" />
            SMorphingModalImage
          </h3>
          <SApiTable title="Props" type="props" :props="imageProps" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-keyboard-outline text-(--s-primary)" />
            Keyboard Navigation
          </h3>
          <SApiKeyboard :shortcuts="keyboardShortcuts" />
        </div>
      </div>
    </SApiSection>
  </div>
</template>

<style scoped>
pre {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
</style>
