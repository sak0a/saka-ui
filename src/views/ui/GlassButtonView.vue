<script setup lang="ts">
import { ref } from 'vue'
import { SGlassButton, SApiSection, SApiTable, SApiKeyboard } from '../../index'
import type { ApiProp, ApiEvent, ApiSlot, KeyboardShortcut } from '../../index'
import DemoSection from '../../components/DemoSection.vue'

// State for interactive demos
const isLoading = ref(false)

const simulateLoading = () => {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
  }, 2000)
}

// Code snippets
const basicUsageCode = `<SGlassButton tint="light">Glass Button</SGlassButton>
<SGlassButton tint="light" color="#93c5fd">Blue Accent</SGlassButton>
<SGlassButton tint="light" color="#f9a8d4">Pink Accent</SGlassButton>
<SGlassButton tint="light" color="#fcd34d">Orange Accent</SGlassButton>`

const tintModesCode = `<!-- Light tint (for dark backgrounds) -->
<SGlassButton tint="light">Light Tint</SGlassButton>

<!-- Dark tint (for light backgrounds) -->
<SGlassButton tint="dark">Dark Tint</SGlassButton>

<!-- Auto tint (adapts to theme) -->
<SGlassButton tint="auto">Auto Tint</SGlassButton>`

const darkBgCode = `<SGlassButton tint="light">On Black</SGlassButton>
<SGlassButton tint="light" size="large">Large Glass</SGlassButton>
<SGlassButton tint="light" iconLeft="star">Starred</SGlassButton>
<SGlassButton tint="light" iconOnly rounded="full">
  <span class="mdi mdi-heart"></span>
</SGlassButton>`

const lightBgCode = `<SGlassButton tint="dark">On White</SGlassButton>
<SGlassButton tint="dark" size="large">Large Glass</SGlassButton>
<SGlassButton tint="dark" iconLeft="star">Starred</SGlassButton>
<SGlassButton tint="dark" iconOnly rounded="full">
  <span class="mdi mdi-heart"></span>
</SGlassButton>`

const imageBgCode = `<!-- Scrollable image background with sticky glass buttons -->
<div class="rounded-2xl overflow-hidden">
  <div class="h-80 overflow-y-auto">
    <div class="relative" style="min-height: 180%;">
      <img src="https://images.unsplash.com/photo-..."
           class="absolute inset-0 w-full h-full object-cover" />
      <div class="sticky top-0 z-10 p-6">
        <SGlassButton tint="light" iconLeft="pine-tree">
          Explore Nature
        </SGlassButton>
      </div>
    </div>
  </div>
</div>`

const sizesCode = `<SGlassButton size="xs" tint="light">Extra Small</SGlassButton>
<SGlassButton size="small" tint="light">Small</SGlassButton>
<SGlassButton size="medium" tint="light">Medium</SGlassButton>
<SGlassButton size="large" tint="light">Large</SGlassButton>
<SGlassButton size="xl" tint="light">Extra Large</SGlassButton>`

const roundedCode = `<SGlassButton rounded="none" tint="light">None</SGlassButton>
<SGlassButton rounded="sm" tint="light">Small</SGlassButton>
<SGlassButton rounded="md" tint="light">Medium</SGlassButton>
<SGlassButton rounded="lg" tint="light">Large</SGlassButton>
<SGlassButton rounded="full" tint="light">Pill</SGlassButton>`

const iconsCode = `<SGlassButton tint="light" iconLeft="home">Home</SGlassButton>
<SGlassButton tint="light" iconRight="arrow-right">Continue</SGlassButton>
<SGlassButton tint="light" iconLeft="plus" iconRight="chevron-down">New Item</SGlassButton>
<SGlassButton tint="light" iconOnly rounded="full">
  <span class="mdi mdi-heart"></span>
</SGlassButton>
<SGlassButton tint="light" iconOnly>
  <span class="mdi mdi-cog"></span>
</SGlassButton>
<SGlassButton tint="light" iconOnly>
  <span class="mdi mdi-bell"></span>
</SGlassButton>`

const loadingCode = `<SGlassButton tint="light" :loading="isLoading">
  {{ isLoading ? 'Loading...' : 'Click to Load' }}
</SGlassButton>
<SGlassButton tint="light" loading>Loading...</SGlassButton>
<SGlassButton tint="light" loading size="small">Wait</SGlassButton>
<SGlassButton tint="light" :loading="isLoading" preserveSize>Submit Order</SGlassButton>
<SGlassButton tint="light" loading preserveSize iconLeft="cloud-upload">Upload File</SGlassButton>`

const disabledCode = `<SGlassButton tint="light" disabled>Disabled Light</SGlassButton>
<SGlassButton tint="light" disabled iconLeft="lock">Locked</SGlassButton>
<SGlassButton tint="dark" disabled>Disabled Dark</SGlassButton>
<SGlassButton tint="dark" disabled iconLeft="lock">Locked</SGlassButton>`

const blockCode = `<SGlassButton block size="large" tint="light" iconLeft="rocket-launch">
  Full Width Glass Button
</SGlassButton>
<SGlassButton block tint="light" iconRight="arrow-right">Continue</SGlassButton>`

const customizationCode = `<!-- Subtle blur -->
<SGlassButton :blur="6" tint="light">Subtle</SGlassButton>

<!-- Heavy blur -->
<SGlassButton :blur="24" tint="light">Heavy Blur</SGlassButton>

<!-- No specular highlight -->
<SGlassButton :highlight-intensity="0" tint="light">No Highlight</SGlassButton>

<!-- Prominent highlight -->
<SGlassButton :highlight-intensity="0.5" tint="light">Bright</SGlassButton>

<!-- High saturation -->
<SGlassButton :saturation="200" tint="light">Vivid</SGlassButton>`

const animateCode = `<!-- Slide animation -->
<SGlassButton tint="light">
  Home
  <template #animate>
    <span class="mdi mdi-home"></span> Go Home
  </template>
</SGlassButton>

<!-- Vertical animation -->
<SGlassButton animation-type="vertical" tint="light">
  Message
  <template #animate>
    <span class="mdi mdi-email-send"></span> Send
  </template>
</SGlassButton>`

const colorTintCode = `<SGlassButton tint="light" color="#93c5fd">Blue</SGlassButton>
<SGlassButton tint="light" color="#f9a8d4">Pink</SGlassButton>
<SGlassButton tint="light" color="#6ee7b7">Green</SGlassButton>
<SGlassButton tint="light" color="#fcd34d">Amber</SGlassButton>
<SGlassButton tint="light" color="#c4b5fd">Purple</SGlassButton>`

const linksCode = `<SGlassButton href="https://google.com" tint="light" iconRight="open-in-new">
  External Link
</SGlassButton>
<SGlassButton to="/ui/buttons" tint="light" iconLeft="arrow-left">
  Go to Buttons
</SGlassButton>`

// API Reference data
const glassButtonProps: ApiProp[] = [
  // Glass-specific
  { name: 'tint', type: "'auto' | 'light' | 'dark'", default: "'auto'", description: 'Glass tint mode. Auto adapts to light/dark theme. Light = white-frosted glass, Dark = dark-frosted glass.', category: 'Glass Effect' },
  { name: 'blur', type: 'number', default: '12', description: 'Backdrop blur strength in pixels', category: 'Glass Effect' },
  { name: 'saturation', type: 'number', default: '150', description: 'Backdrop saturation percentage', category: 'Glass Effect' },
  { name: 'highlightIntensity', type: 'number', default: '0.3', description: 'Specular highlight intensity (0 to 1)', category: 'Glass Effect' },
  // Appearance
  { name: 'size', type: "'xs' | 'small' | 'medium' | 'large' | 'xl'", default: "'medium'", description: 'Button size', category: 'Appearance' },
  { name: 'color', type: 'string', default: 'undefined', description: 'Accent color for text. If not set, text is white (light tint) or dark (dark tint)', category: 'Appearance' },
  { name: 'rounded', type: "'none' | 'sm' | 'md' | 'lg' | 'full'", default: "'md'", description: 'Border radius variant', category: 'Appearance' },
  { name: 'block', type: 'boolean', default: 'false', description: 'Full-width button', category: 'Appearance' },
  // Icons
  { name: 'iconLeft', type: 'string', default: 'undefined', description: 'MDI icon name for left icon', category: 'Icons' },
  { name: 'iconRight', type: 'string', default: 'undefined', description: 'MDI icon name for right icon', category: 'Icons' },
  { name: 'iconOnly', type: 'boolean', default: 'false', description: 'Icon-only button (square)', category: 'Icons' },
  // State
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable button interaction', category: 'State' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Show loading spinner', category: 'State' },
  { name: 'preserveSize', type: 'boolean', default: 'false', description: 'Keep button size when loading', category: 'State' },
  { name: 'ripple', type: 'boolean', default: 'true', description: 'Enable glass ripple effect on click', category: 'State' },
  // Animation
  { name: 'animationType', type: "'slide' | 'vertical' | 'scale' | 'rotate'", default: "'slide'", description: 'Animation type for animate slot', category: 'Animation' },
  { name: 'animateInactive', type: 'boolean', default: 'false', description: 'Disable hover animation', category: 'Animation' },
  // Navigation
  { name: 'href', type: 'string', default: 'undefined', description: 'URL for anchor tag', category: 'Navigation' },
  { name: 'to', type: 'string | object', default: 'undefined', description: 'Vue Router destination', category: 'Navigation' },
  // HTML
  { name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", description: 'Button type attribute', category: 'HTML Attributes' },
  { name: 'tag', type: 'string', default: "'button'", description: 'HTML tag to render', category: 'HTML Attributes' },
]

const glassButtonEvents: ApiEvent[] = [
  { name: '@click', payload: 'MouseEvent', description: 'Emitted when button is clicked (unless disabled/loading)' }
]

const glassButtonSlots: ApiSlot[] = [
  { name: 'default', description: 'Button text content' },
  { name: 'icon-left', description: 'Custom left icon element (overrides iconLeft prop)' },
  { name: 'icon-right', description: 'Custom right icon element (overrides iconRight prop)' },
  { name: 'animate', description: 'Content shown on hover with animation (requires animationType prop)' }
]

const keyboardShortcuts: KeyboardShortcut[] = [
  { keys: 'Enter', action: 'Activate button' },
  { keys: 'Space', action: 'Activate button' },
  { keys: 'Tab', action: 'Focus next element' }
]
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- @component SGlassButton -->
    <!-- @props tint, blur, saturation, highlightIntensity, size, color, rounded, block, iconLeft, iconRight, iconOnly, disabled, loading, preserveSize, ripple, animationType, animateInactive, href, to, type, tag -->
    <!-- @events @click -->
    <!-- @slots default, icon-left, icon-right, animate -->
    <!-- @sections features, basic-usage, tint-modes, on-dark-backgrounds, on-light-backgrounds, on-image-backgrounds, sizes, border-radius, with-icons, loading-state, disabled-state, block-full-width, blur-highlight-customization, hover-animations, color-tinting, as-links, api-reference -->
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-(--s-text-primary) mb-2">Glass Button</h1>
      <p class="text-lg text-(--s-text-secondary)">A translucent button inspired by Apple's liquid glass design, with adaptive tinting for any background.</p>
    </header>

    <!-- Features -->
    <article id="features">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 rounded-xl bg-cyan-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-blur text-xl text-cyan-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Liquid Glass Effect</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Backdrop blur, specular highlight, and rim light create a realistic glass surface.</p>
        </div>
        <div class="p-4 rounded-xl bg-purple-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-theme-light-dark text-xl text-purple-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Three Tint Modes</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Auto, light, and dark tints adapt the glass to any background context.</p>
        </div>
        <div class="p-4 rounded-xl bg-emerald-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-button-cursor text-xl text-emerald-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Full SButton Parity</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Sizes, icons, loading, ripple, animations, links - everything SButton has.</p>
        </div>
        <div class="p-4 rounded-xl bg-amber-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-image-multiple text-xl text-amber-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Backdrop Aware</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Looks beautiful on dark, light, gradient, and image backgrounds.</p>
        </div>
        <div class="p-4 rounded-xl bg-red-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-tune-vertical text-xl text-red-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Customizable</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Fine-tune blur, saturation, and highlight intensity per usage context.</p>
        </div>
        <div class="p-4 rounded-xl bg-blue-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-shimmer text-xl text-blue-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Glass Ripple</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Softer, more ethereal ripple effect tuned for the glass aesthetic.</p>
        </div>
      </div>
    </article>

    <!-- Basic Usage -->
    <section id="basic-usage">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Basic Usage</h2>
      <DemoSection
        title="Glass Buttons on Gradient"
        description="Glass buttons shine on colorful backgrounds. Use tint='light' for dark/colorful backdrops."
        :code="basicUsageCode"
        language="vue"
      >
        <div class="relative rounded-2xl overflow-hidden p-8">
          <div class="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500"></div>
          <div class="absolute inset-0">
            <div class="absolute top-4 left-[10%] w-40 h-40 bg-cyan-400/30 rounded-full blur-3xl"></div>
            <div class="absolute bottom-4 right-[15%] w-48 h-48 bg-pink-400/30 rounded-full blur-3xl"></div>
          </div>
          <div class="relative flex flex-wrap gap-3 items-center">
            <SGlassButton tint="light">Glass Button</SGlassButton>
            <SGlassButton tint="light" color="#93c5fd">Blue Accent</SGlassButton>
            <SGlassButton tint="light" color="#f9a8d4">Pink Accent</SGlassButton>
            <SGlassButton tint="light" color="#fcd34d">Orange Accent</SGlassButton>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Tint Modes -->
    <section id="tint-modes">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Tint Modes</h2>
      <DemoSection
        title="Light, Dark & Auto Tint"
        description="Control how the glass adapts to its background. Auto mode switches based on the current theme."
        :code="tintModesCode"
        language="vue"
      >
        <div class="space-y-6">
          <!-- Light tint on dark bg -->
          <div>
            <p class="text-xs font-mono text-(--s-text-secondary) mb-2">tint="light" (for dark backgrounds)</p>
            <div class="relative rounded-2xl overflow-hidden p-6">
              <div class="absolute inset-0 bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900"></div>
              <div class="relative flex flex-wrap gap-3 items-center">
                <SGlassButton tint="light">Light Tint</SGlassButton>
                <SGlassButton tint="light" iconLeft="star">With Icon</SGlassButton>
                <SGlassButton tint="light" size="large">Large</SGlassButton>
              </div>
            </div>
          </div>
          <!-- Dark tint on light bg -->
          <div>
            <p class="text-xs font-mono text-(--s-text-secondary) mb-2">tint="dark" (for light backgrounds)</p>
            <div class="rounded-2xl p-6 bg-white border border-gray-200">
              <div class="flex flex-wrap gap-3 items-center">
                <SGlassButton tint="dark">Dark Tint</SGlassButton>
                <SGlassButton tint="dark" iconLeft="star">With Icon</SGlassButton>
                <SGlassButton tint="dark" size="large">Large</SGlassButton>
              </div>
            </div>
          </div>
          <!-- Auto tint -->
          <div>
            <p class="text-xs font-mono text-(--s-text-secondary) mb-2">tint="auto" (adapts to current theme - toggle the theme to see it switch)</p>
            <div class="rounded-2xl p-6 bg-(--s-bg-primary) border border-(--s-border)">
              <div class="flex flex-wrap gap-3 items-center">
                <SGlassButton tint="auto">Auto Tint</SGlassButton>
                <SGlassButton tint="auto" iconLeft="theme-light-dark">Theme Aware</SGlassButton>
              </div>
            </div>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- On Dark Backgrounds -->
    <section id="on-dark-backgrounds">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">On Dark Backgrounds</h2>
      <DemoSection
        title="Pure Black Background"
        description="Glass buttons with light tint on a pure black background."
        :code="darkBgCode"
        language="vue"
      >
        <div class="rounded-2xl p-8 bg-black">
          <div class="flex flex-wrap gap-3 items-center">
            <SGlassButton tint="light">On Black</SGlassButton>
            <SGlassButton tint="light" size="large">Large Glass</SGlassButton>
            <SGlassButton tint="light" iconLeft="star">Starred</SGlassButton>
            <SGlassButton tint="light" iconOnly rounded="full">
              <span class="mdi mdi-heart"></span>
            </SGlassButton>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- On Light Backgrounds -->
    <section id="on-light-backgrounds">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">On Light Backgrounds</h2>
      <DemoSection
        title="Pure White Background"
        description="Glass buttons with dark tint on a pure white background."
        :code="lightBgCode"
        language="vue"
      >
        <div class="rounded-2xl p-8 bg-white border border-gray-200">
          <div class="flex flex-wrap gap-3 items-center">
            <SGlassButton tint="dark">On White</SGlassButton>
            <SGlassButton tint="dark" size="large">Large Glass</SGlassButton>
            <SGlassButton tint="dark" iconLeft="star">Starred</SGlassButton>
            <SGlassButton tint="dark" iconOnly rounded="full">
              <span class="mdi mdi-heart"></span>
            </SGlassButton>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- On Image Backgrounds -->
    <section id="on-image-backgrounds">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">On Image Backgrounds</h2>
      <DemoSection
        title="Real Photo Backgrounds"
        description="Glass buttons over real stock photos. Scroll each panel to see how the glass effect looks over changing imagery."
        :code="imageBgCode"
        language="vue"
      >
        <div class="space-y-6">
          <!-- Mountain Lake - scrollable -->
          <div>
            <p class="text-xs font-mono text-(--s-text-secondary) mb-2">Mountain landscape (scroll to explore)</p>
            <div class="rounded-2xl overflow-hidden">
              <div class="h-80 overflow-y-auto overscroll-contain" style="scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.3) transparent;">
                <div class="relative" style="min-height: 220%;">
                  <img
                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80"
                    alt="Mountain lake landscape"
                    class="absolute inset-0 w-full h-full object-cover"
                  />
                  <div class="sticky top-0 z-10 p-6 backdrop-blur-[1px]">
                    <p class="text-xs text-white/60 mb-3 drop-shadow-md">Scroll down to see glass over different parts of the image ↓</p>
                    <div class="flex flex-wrap gap-3">
                      <SGlassButton tint="light" iconLeft="image-filter-hdr" size="large">Mountain View</SGlassButton>
                      <SGlassButton tint="light" iconLeft="pine-tree">Explore</SGlassButton>
                      <SGlassButton tint="light" iconOnly rounded="full">
                        <span class="mdi mdi-heart"></span>
                      </SGlassButton>
                      <SGlassButton tint="light" iconOnly rounded="full">
                        <span class="mdi mdi-share-variant"></span>
                      </SGlassButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- City Skyline - scrollable -->
          <div>
            <p class="text-xs font-mono text-(--s-text-secondary) mb-2">City skyline at night (scroll to explore)</p>
            <div class="rounded-2xl overflow-hidden">
              <div class="h-80 overflow-y-auto overscroll-contain" style="scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.3) transparent;">
                <div class="relative" style="min-height: 220%;">
                  <img
                    src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80"
                    alt="City skyline at night"
                    class="absolute inset-0 w-full h-full object-cover"
                  />
                  <div class="sticky top-0 z-10 p-6">
                    <div class="flex flex-wrap gap-3 items-center">
                      <SGlassButton tint="light" iconLeft="city-variant" size="large">City Lights</SGlassButton>
                      <SGlassButton tint="light" iconLeft="map-marker">Navigate</SGlassButton>
                      <SGlassButton tint="light" iconLeft="camera">Capture</SGlassButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tropical Beach - scrollable -->
          <div>
            <p class="text-xs font-mono text-(--s-text-secondary) mb-2">Tropical beach (scroll to explore)</p>
            <div class="rounded-2xl overflow-hidden">
              <div class="h-80 overflow-y-auto overscroll-contain" style="scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.3) transparent;">
                <div class="relative" style="min-height: 220%;">
                  <img
                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80"
                    alt="Tropical beach with clear water"
                    class="absolute inset-0 w-full h-full object-cover"
                  />
                  <div class="sticky top-0 z-10 p-6">
                    <div class="flex flex-wrap gap-3 items-center">
                      <SGlassButton tint="light" iconLeft="waves" size="large">Beach Vibes</SGlassButton>
                      <SGlassButton tint="light" iconLeft="white-balance-sunny">Book Trip</SGlassButton>
                      <SGlassButton tint="light" iconOnly rounded="full">
                        <span class="mdi mdi-compass"></span>
                      </SGlassButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Aurora - static (non-scrollable for contrast) -->
          <div>
            <p class="text-xs font-mono text-(--s-text-secondary) mb-2">Aurora borealis (static)</p>
            <div class="rounded-2xl overflow-hidden relative h-56">
              <img
                src="https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200&q=80"
                alt="Aurora borealis northern lights"
                class="absolute inset-0 w-full h-full object-cover"
              />
              <div class="relative p-6 h-full flex items-end">
                <div class="flex flex-wrap gap-3 items-center">
                  <SGlassButton tint="light" iconLeft="weather-night-partly-cloudy" size="large">Northern Lights</SGlassButton>
                  <SGlassButton tint="light" iconLeft="star-shooting">Stargaze</SGlassButton>
                  <SGlassButton tint="light" iconOnly rounded="full">
                    <span class="mdi mdi-telescope"></span>
                  </SGlassButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Sizes -->
    <section id="sizes">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Sizes</h2>
      <DemoSection
        title="Button Sizes"
        description="Five size options matching SButton: xs, small, medium (default), large, and xl."
        :code="sizesCode"
        language="vue"
      >
        <div class="relative rounded-2xl overflow-hidden p-8">
          <div class="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700"></div>
          <div class="relative flex flex-wrap gap-4 items-end">
            <div class="flex flex-col items-center gap-2">
              <SGlassButton size="xs" tint="light">Extra Small</SGlassButton>
              <span class="text-xs font-mono text-white/60">xs</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <SGlassButton size="small" tint="light">Small</SGlassButton>
              <span class="text-xs font-mono text-white/60">small</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <SGlassButton size="medium" tint="light">Medium</SGlassButton>
              <span class="text-xs font-mono text-white/60">medium</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <SGlassButton size="large" tint="light">Large</SGlassButton>
              <span class="text-xs font-mono text-white/60">large</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <SGlassButton size="xl" tint="light">Extra Large</SGlassButton>
              <span class="text-xs font-mono text-white/60">xl</span>
            </div>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Border Radius -->
    <section id="border-radius">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Border Radius</h2>
      <DemoSection
        title="Rounded Corners"
        description="Control the border radius with the rounded prop."
        :code="roundedCode"
        language="vue"
      >
        <div class="relative rounded-2xl overflow-hidden p-8">
          <div class="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800"></div>
          <div class="relative flex flex-wrap gap-4 items-center">
            <div class="flex flex-col items-center gap-2">
              <SGlassButton rounded="none" tint="light">None</SGlassButton>
              <span class="text-xs font-mono text-white/60">none</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <SGlassButton rounded="sm" tint="light">Small</SGlassButton>
              <span class="text-xs font-mono text-white/60">sm</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <SGlassButton rounded="md" tint="light">Medium</SGlassButton>
              <span class="text-xs font-mono text-white/60">md</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <SGlassButton rounded="lg" tint="light">Large</SGlassButton>
              <span class="text-xs font-mono text-white/60">lg</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <SGlassButton rounded="full" tint="light">Pill</SGlassButton>
              <span class="text-xs font-mono text-white/60">full</span>
            </div>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Icons -->
    <section id="with-icons">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">With Icons</h2>
      <DemoSection
        title="Icon Buttons"
        description="Add icons using iconLeft, iconRight props, or use iconOnly for icon-only buttons."
        :code="iconsCode"
        language="vue"
      >
        <div class="relative rounded-2xl overflow-hidden p-8">
          <div class="absolute inset-0 bg-gradient-to-br from-rose-600 via-pink-600 to-fuchsia-600"></div>
          <div class="relative flex flex-wrap gap-3 items-center">
            <SGlassButton tint="light" iconLeft="home">Home</SGlassButton>
            <SGlassButton tint="light" iconRight="arrow-right">Continue</SGlassButton>
            <SGlassButton tint="light" iconLeft="plus" iconRight="chevron-down">New Item</SGlassButton>
            <SGlassButton tint="light" iconOnly rounded="full">
              <span class="mdi mdi-heart"></span>
            </SGlassButton>
            <SGlassButton tint="light" iconOnly>
              <span class="mdi mdi-cog"></span>
            </SGlassButton>
            <SGlassButton tint="light" iconOnly>
              <span class="mdi mdi-bell"></span>
            </SGlassButton>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Loading State -->
    <section id="loading-state">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Loading State</h2>
      <DemoSection
        title="Loading Buttons"
        description="Show a loading spinner. Click the first button to see it in action."
        :code="loadingCode"
        language="vue"
      >
        <div class="relative rounded-2xl overflow-hidden p-8">
          <div class="absolute inset-0 bg-gradient-to-br from-blue-800 via-indigo-700 to-purple-800"></div>
          <div class="relative space-y-4">
            <div class="flex flex-wrap gap-3 items-center">
              <SGlassButton tint="light" :loading="isLoading" @click="simulateLoading">
                {{ isLoading ? 'Loading...' : 'Click to Load' }}
              </SGlassButton>
              <SGlassButton tint="light" loading>Loading...</SGlassButton>
              <SGlassButton tint="light" loading size="small">Wait</SGlassButton>
            </div>
            <div>
              <p class="text-xs text-white/60 mb-2">With preserveSize:</p>
              <div class="flex flex-wrap gap-3 items-center">
                <SGlassButton tint="light" :loading="isLoading" preserveSize @click="simulateLoading">Submit Order</SGlassButton>
                <SGlassButton tint="light" loading preserveSize iconLeft="cloud-upload">Upload File</SGlassButton>
              </div>
            </div>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Disabled State -->
    <section id="disabled-state">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Disabled State</h2>
      <DemoSection
        title="Disabled Buttons"
        description="Disabled glass buttons have reduced opacity and cannot be interacted with."
        :code="disabledCode"
        language="vue"
      >
        <div class="space-y-4">
          <div class="relative rounded-2xl overflow-hidden p-6">
            <div class="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900"></div>
            <div class="relative flex flex-wrap gap-3 items-center">
              <SGlassButton tint="light" disabled>Disabled Light</SGlassButton>
              <SGlassButton tint="light" disabled iconLeft="lock">Locked</SGlassButton>
            </div>
          </div>
          <div class="rounded-2xl p-6 bg-white border border-gray-200">
            <div class="flex flex-wrap gap-3 items-center">
              <SGlassButton tint="dark" disabled>Disabled Dark</SGlassButton>
              <SGlassButton tint="dark" disabled iconLeft="lock">Locked</SGlassButton>
            </div>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Block / Full Width -->
    <section id="block-full-width">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Block / Full Width</h2>
      <DemoSection
        title="Full Width Buttons"
        description="Use the block prop to make buttons span the full width of their container."
        :code="blockCode"
        language="vue"
      >
        <div class="relative rounded-2xl overflow-hidden p-8">
          <div class="absolute inset-0 bg-gradient-to-br from-emerald-700 via-teal-600 to-cyan-600"></div>
          <div class="relative space-y-3 max-w-md">
            <SGlassButton block size="large" tint="light" iconLeft="rocket-launch">Full Width Glass Button</SGlassButton>
            <SGlassButton block tint="light" iconRight="arrow-right">Continue</SGlassButton>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Blur & Highlight Customization -->
    <section id="blur-highlight-customization">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Blur & Highlight Customization</h2>
      <DemoSection
        title="Fine-tuning the Glass Effect"
        description="Adjust blur, saturation, and highlight intensity to fit your context."
        :code="customizationCode"
        language="vue"
      >
        <div class="relative rounded-2xl overflow-hidden p-8">
          <div class="absolute inset-0 bg-gradient-to-br from-amber-600 via-orange-500 to-red-500"></div>
          <div class="absolute inset-0">
            <div class="absolute top-4 left-[20%] w-36 h-36 bg-yellow-300/30 rounded-full blur-3xl"></div>
            <div class="absolute bottom-4 right-[10%] w-44 h-44 bg-red-400/20 rounded-full blur-3xl"></div>
          </div>
          <div class="relative space-y-4">
            <div>
              <p class="text-xs text-white/60 mb-2">Blur levels:</p>
              <div class="flex flex-wrap gap-3 items-center">
                <SGlassButton :blur="6" tint="light">Subtle (6px)</SGlassButton>
                <SGlassButton :blur="12" tint="light">Default (12px)</SGlassButton>
                <SGlassButton :blur="24" tint="light">Heavy (24px)</SGlassButton>
              </div>
            </div>
            <div>
              <p class="text-xs text-white/60 mb-2">Highlight intensity:</p>
              <div class="flex flex-wrap gap-3 items-center">
                <SGlassButton :highlight-intensity="0" tint="light">None (0)</SGlassButton>
                <SGlassButton :highlight-intensity="0.3" tint="light">Default (0.3)</SGlassButton>
                <SGlassButton :highlight-intensity="0.5" tint="light">Bright (0.5)</SGlassButton>
              </div>
            </div>
            <div>
              <p class="text-xs text-white/60 mb-2">Saturation:</p>
              <div class="flex flex-wrap gap-3 items-center">
                <SGlassButton :saturation="100" tint="light">Neutral (100%)</SGlassButton>
                <SGlassButton :saturation="150" tint="light">Default (150%)</SGlassButton>
                <SGlassButton :saturation="200" tint="light">Vivid (200%)</SGlassButton>
              </div>
            </div>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Hover Animations -->
    <section id="hover-animations">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Hover Animations</h2>
      <DemoSection
        title="Animated Glass Buttons"
        description="Use the #animate slot to show different content on hover."
        :code="animateCode"
        language="vue"
      >
        <div class="relative rounded-2xl overflow-hidden p-8">
          <div class="absolute inset-0 bg-gradient-to-br from-violet-700 via-purple-600 to-fuchsia-600"></div>
          <div class="relative flex flex-wrap gap-4 items-center">
            <div class="flex flex-col items-center gap-2">
              <SGlassButton tint="light" size="large">
                Home
                <template #animate>
                  <span class="mdi mdi-home mr-1"></span> Go Home
                </template>
              </SGlassButton>
              <span class="text-xs font-mono text-white/60">slide</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <SGlassButton tint="light" size="large" animation-type="vertical">
                Message
                <template #animate>
                  <span class="mdi mdi-email-send mr-1"></span> Send
                </template>
              </SGlassButton>
              <span class="text-xs font-mono text-white/60">vertical</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <SGlassButton tint="light" size="large" animation-type="scale">
                Like
                <template #animate>
                  <span class="mdi mdi-heart text-lg"></span>
                </template>
              </SGlassButton>
              <span class="text-xs font-mono text-white/60">scale</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <SGlassButton tint="light" size="large" animation-type="rotate">
                Settings
                <template #animate>
                  <span class="mdi mdi-cog text-lg"></span>
                </template>
              </SGlassButton>
              <span class="text-xs font-mono text-white/60">rotate</span>
            </div>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Color Tinting -->
    <section id="color-tinting">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Color Tinting</h2>
      <DemoSection
        title="Accent Colors"
        description="Use the color prop to set the text color accent."
        :code="colorTintCode"
        language="vue"
      >
        <div class="relative rounded-2xl overflow-hidden p-8">
          <div class="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900"></div>
          <div class="relative flex flex-wrap gap-3 items-center">
            <SGlassButton tint="light" color="#93c5fd">Blue</SGlassButton>
            <SGlassButton tint="light" color="#f9a8d4">Pink</SGlassButton>
            <SGlassButton tint="light" color="#6ee7b7">Green</SGlassButton>
            <SGlassButton tint="light" color="#fcd34d">Amber</SGlassButton>
            <SGlassButton tint="light" color="#c4b5fd">Purple</SGlassButton>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- As Links -->
    <section id="as-links">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">As Links</h2>
      <DemoSection
        title="Button Links"
        description="Use href for external links or to for Vue Router navigation."
        :code="linksCode"
        language="vue"
      >
        <div class="relative rounded-2xl overflow-hidden p-8">
          <div class="absolute inset-0 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700"></div>
          <div class="relative flex flex-wrap gap-3 items-center">
            <SGlassButton href="https://google.com" tint="light" iconRight="open-in-new">External Link</SGlassButton>
            <SGlassButton to="/ui/buttons" tint="light" iconLeft="arrow-left">Go to Buttons</SGlassButton>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- API Reference -->
    <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">API Reference</h2>
    <SApiSection>
      <SApiTable
        title="Props"
        type="props"
        :props="glassButtonProps"
      />

      <SApiTable
        title="Events"
        type="events"
        :events="glassButtonEvents"
      />

      <SApiTable
        title="Slots"
        type="slots"
        :slots="glassButtonSlots"
      />

      <SApiKeyboard :shortcuts="keyboardShortcuts" />
    </SApiSection>
  </div>
</template>
