<script setup lang="ts">
import { ref } from 'vue'
import {
  SGlassCard,
  SCardHeader,
  SCardContent,
  SCardFooter,
  SCardMedia,
  SButton,
  SApiSection,
  SApiTable,
  SApiKeyboard
} from '../../index'
import type { ApiProp, ApiEvent, ApiSlot, KeyboardShortcut } from '../../index'
import DemoSection from '../../components/DemoSection.vue'

const isLoading = ref(false)
const simulateLoading = () => {
  isLoading.value = true
  setTimeout(() => { isLoading.value = false }, 2000)
}

// Code snippets
const basicUsageCode = `<SGlassCard tint="light">
  <SCardHeader title="Glass Card" subtitle="Liquid glass surface" icon="blur" />
  <SCardContent>
    <p>A translucent card with backdrop blur, specular highlight, and barrel-distortion refraction.</p>
  </SCardContent>
  <SCardFooter>
    <SButton size="small">Learn More</SButton>
  </SCardFooter>
</SGlassCard>`

const tintModesCode = `<!-- Light tint (for dark backgrounds) -->
<SGlassCard tint="light">...</SGlassCard>

<!-- Dark tint (for light backgrounds) -->
<SGlassCard tint="dark">...</SGlassCard>

<!-- Auto tint (adapts to theme) -->
<SGlassCard tint="auto">...</SGlassCard>`

const sizesCode = `<SGlassCard size="compact">...</SGlassCard>
<SGlassCard size="default">...</SGlassCard>
<SGlassCard size="comfortable">...</SGlassCard>`

const interactiveCode = `<SGlassCard hoverable tint="light">Hoverable</SGlassCard>
<SGlassCard pressable tint="light">Pressable</SGlassCard>
<SGlassCard clickable tint="light" @click="handle">Clickable</SGlassCard>`

const spotlightCode = `<SGlassCard spotlight tilt tint="light">
  <SCardHeader title="Spotlight + Tilt" />
  <SCardContent>Move your mouse over this card.</SCardContent>
</SGlassCard>`

const customizationCode = `<SGlassCard :blur="6" tint="light">Subtle blur</SGlassCard>
<SGlassCard :blur="24" tint="light">Heavy blur</SGlassCard>
<SGlassCard :highlight-intensity="0" tint="light">No highlight</SGlassCard>
<SGlassCard :highlight-intensity="0.5" tint="light">Bright</SGlassCard>`

// API data
const glassCardProps: ApiProp[] = [
  { name: 'tint', type: "'auto' | 'light' | 'dark'", default: "'auto'", description: 'Glass tint mode. Auto adapts to theme. Light = white-frosted glass, Dark = dark-frosted glass.', category: 'Glass Effect' },
  { name: 'blur', type: 'number', default: '12', description: 'Backdrop blur strength in pixels', category: 'Glass Effect' },
  { name: 'saturation', type: 'number', default: '150', description: 'Backdrop saturation percentage', category: 'Glass Effect' },
  { name: 'highlightIntensity', type: 'number', default: '0.3', description: 'Specular highlight intensity (0 to 1)', category: 'Glass Effect' },
  { name: 'color', type: 'string', default: 'undefined', description: 'Accent text color', category: 'Glass Effect' },
  { name: 'size', type: "'compact' | 'default' | 'comfortable'", default: "'default'", description: 'Size preset affecting padding', category: 'Appearance' },
  { name: 'rounded', type: "'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'", default: "'lg'", description: 'Border radius', category: 'Appearance' },
  { name: 'width', type: 'string', default: 'undefined', description: 'Card width (CSS value)', category: 'Appearance' },
  { name: 'height', type: 'string', default: 'undefined', description: 'Card height (CSS value)', category: 'Appearance' },
  { name: 'maxWidth', type: 'string', default: 'undefined', description: 'Card max-width (CSS value)', category: 'Appearance' },
  { name: 'padding', type: 'string', default: 'undefined', description: 'Custom padding override', category: 'Appearance' },
  { name: 'horizontal', type: 'boolean', default: 'false', description: 'Horizontal layout (media on side)', category: 'Layout' },
  { name: 'mediaRight', type: 'boolean', default: 'false', description: 'Flip media to right side in horizontal layout', category: 'Layout' },
  { name: 'hoverable', type: 'boolean', default: 'false', description: 'Enable hover lift animation', category: 'Interaction' },
  { name: 'pressable', type: 'boolean', default: 'false', description: 'Enable press/click scale effect', category: 'Interaction' },
  { name: 'clickable', type: 'boolean', default: 'false', description: 'Make entire card clickable', category: 'Interaction' },
  { name: 'spotlight', type: 'boolean', default: 'false', description: 'Enable radial glow on hover', category: 'Interaction' },
  { name: 'spotlightColor', type: 'string', default: "'var(--s-primary)'", description: 'Spotlight color', category: 'Interaction' },
  { name: 'tilt', type: 'boolean', default: 'false', description: 'Enable 3D tilt on hover', category: 'Interaction' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Show loading shimmer overlay', category: 'State' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disabled state', category: 'State' },
  { name: 'href', type: 'string', default: 'undefined', description: 'URL for anchor tag', category: 'Navigation' },
  { name: 'to', type: 'string | object', default: 'undefined', description: 'Vue Router destination', category: 'Navigation' },
  { name: 'tag', type: 'string', default: "'div'", description: 'HTML tag to render', category: 'HTML Attributes' },
]

const glassCardEvents: ApiEvent[] = [
  { name: '@click', payload: 'MouseEvent', description: 'Emitted when card is clicked (if clickable, href, or to is set)' }
]

const glassCardSlots: ApiSlot[] = [
  { name: 'default', description: 'Card content. Use SCardHeader, SCardContent, SCardFooter sub-components.' }
]

const keyboardShortcuts: KeyboardShortcut[] = [
  { keys: 'Tab', action: 'Focus card (if clickable)' },
  { keys: 'Enter', action: 'Activate card link' }
]
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-(--s-text-primary) mb-2">Glass Card</h1>
      <p class="text-lg text-(--s-text-secondary)">A translucent card with liquid glass effect, compatible with all SCard sub-components.</p>
    </header>

    <!-- Features -->
    <article>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-blur text-xl text-cyan-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Liquid Glass Effect</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Backdrop blur, specular highlight, and SVG barrel-distortion refraction.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-puzzle text-xl text-purple-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Sub-component Compatible</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Works with SCardHeader, SCardContent, SCardFooter, SCardMedia, and SCardActions.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-theme-light-dark text-xl text-emerald-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Tint Modes</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Auto, light, and dark tints adapt to any background context.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-card-outline text-xl text-amber-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Full SCard Parity</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Hoverable, pressable, spotlight, tilt, loading, sizes, links - everything SCard has.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-image-multiple text-xl text-red-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Backdrop Aware</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Looks beautiful on dark, light, gradient, and image backgrounds.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-tune-vertical text-xl text-blue-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Customizable</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Fine-tune blur, saturation, and highlight intensity per usage context.</p>
        </div>
      </div>
    </article>

    <!-- Basic Usage -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Basic Usage</h2>
      <DemoSection
        title="Glass Card on Gradient"
        description="Glass cards shine on colorful backgrounds. Use tint='light' for dark/colorful backdrops."
        :code="basicUsageCode"
        language="vue"
      >
        <div class="relative rounded-2xl overflow-hidden p-8">
          <div class="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500"></div>
          <div class="absolute inset-0">
            <div class="absolute top-4 left-[10%] w-40 h-40 bg-cyan-400/30 rounded-full blur-3xl"></div>
            <div class="absolute bottom-4 right-[15%] w-48 h-48 bg-pink-400/30 rounded-full blur-3xl"></div>
          </div>
          <div class="relative max-w-sm">
            <SGlassCard tint="light">
              <SCardHeader title="Glass Card" subtitle="Liquid glass surface" icon="blur" />
              <SCardContent>
                <p>A translucent card with backdrop blur, specular highlight, and barrel-distortion refraction.</p>
              </SCardContent>
              <SCardFooter>
                <SButton size="small" variant="ghost">Cancel</SButton>
                <SButton size="small">Learn More</SButton>
              </SCardFooter>
            </SGlassCard>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Tint Modes -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Tint Modes</h2>
      <DemoSection
        title="Light, Dark & Auto Tint"
        description="Control how the glass adapts to its background."
        :code="tintModesCode"
        language="vue"
      >
        <div class="space-y-6">
          <!-- Light tint on dark bg -->
          <div>
            <p class="text-xs font-mono text-(--s-text-secondary) mb-2">tint="light" (for dark backgrounds)</p>
            <div class="relative rounded-2xl overflow-hidden p-6">
              <div class="absolute inset-0 bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900"></div>
              <div class="relative max-w-xs">
                <SGlassCard tint="light">
                  <SCardHeader title="Light Tint" subtitle="White-frosted glass" icon="white-balance-sunny" />
                  <SCardContent>
                    <p>Best for dark or colorful backgrounds.</p>
                  </SCardContent>
                </SGlassCard>
              </div>
            </div>
          </div>
          <!-- Dark tint on light bg -->
          <div>
            <p class="text-xs font-mono text-(--s-text-secondary) mb-2">tint="dark" (for light backgrounds)</p>
            <div class="rounded-2xl p-6 bg-white border border-gray-200">
              <div class="max-w-xs">
                <SGlassCard tint="dark">
                  <SCardHeader title="Dark Tint" subtitle="Dark-frosted glass" icon="moon-waning-crescent" />
                  <SCardContent>
                    <p>Best for light or white backgrounds.</p>
                  </SCardContent>
                </SGlassCard>
              </div>
            </div>
          </div>
          <!-- Auto tint -->
          <div>
            <p class="text-xs font-mono text-(--s-text-secondary) mb-2">tint="auto" (adapts to current theme)</p>
            <div class="rounded-2xl p-6 bg-(--s-bg-primary) border border-(--s-border)">
              <div class="max-w-xs">
                <SGlassCard tint="auto">
                  <SCardHeader title="Auto Tint" subtitle="Theme-aware" icon="theme-light-dark" />
                  <SCardContent>
                    <p>Toggle the theme to see it switch.</p>
                  </SCardContent>
                </SGlassCard>
              </div>
            </div>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- On Gradient Backgrounds -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">On Gradient Backgrounds</h2>
      <DemoSection
        title="Multiple Gradient Palettes"
        description="Glass cards adapt beautifully to any gradient background."
        :code="basicUsageCode"
        language="vue"
      >
        <div class="space-y-6">
          <!-- Indigo-Purple-Pink -->
          <div class="relative rounded-2xl overflow-hidden p-8">
            <div class="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500"></div>
            <div class="relative grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SGlassCard tint="light">
                <SCardHeader title="Analytics" subtitle="Dashboard overview" icon="chart-line" />
                <SCardContent>
                  <p>View your real-time analytics and performance metrics at a glance.</p>
                </SCardContent>
              </SGlassCard>
              <SGlassCard tint="light">
                <SCardHeader title="Reports" subtitle="Weekly summary" icon="file-document-outline" />
                <SCardContent>
                  <p>Automated reports delivered to your inbox every Monday morning.</p>
                </SCardContent>
              </SGlassCard>
            </div>
          </div>
          <!-- Emerald-Teal-Cyan -->
          <div class="relative rounded-2xl overflow-hidden p-8">
            <div class="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-500"></div>
            <div class="relative max-w-sm">
              <SGlassCard tint="light">
                <SCardHeader title="Eco Stats" subtitle="Carbon footprint tracker" icon="leaf" />
                <SCardContent>
                  <div class="space-y-2">
                    <div class="flex justify-between text-sm">
                      <span>Trees planted</span>
                      <span class="font-semibold">1,247</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span>CO2 offset</span>
                      <span class="font-semibold">52.3 tons</span>
                    </div>
                  </div>
                </SCardContent>
              </SGlassCard>
            </div>
          </div>
          <!-- Amber-Orange-Red -->
          <div class="relative rounded-2xl overflow-hidden p-8">
            <div class="absolute inset-0 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500"></div>
            <div class="relative max-w-sm">
              <SGlassCard tint="light">
                <SCardHeader title="Weather" subtitle="San Francisco, CA" icon="weather-partly-cloudy" />
                <SCardContent>
                  <div class="flex items-center gap-4">
                    <span class="text-4xl font-light">72&deg;F</span>
                    <div class="text-sm">
                      <p>Partly cloudy</p>
                      <p class="opacity-70">H: 76&deg; L: 58&deg;</p>
                    </div>
                  </div>
                </SCardContent>
              </SGlassCard>
            </div>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- On Dark Backgrounds -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">On Dark Backgrounds</h2>
      <DemoSection
        title="Pure Black Background"
        description="Glass cards with light tint on a pure black background."
        :code="tintModesCode"
        language="vue"
      >
        <div class="rounded-2xl p-8 bg-black">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <!-- Profile card -->
            <SGlassCard tint="light">
              <SCardHeader
                title="Alex Morgan"
                subtitle="Product Designer"
                avatar="https://i.pravatar.cc/100?img=32"
              />
              <SCardContent>
                <p class="text-sm">Crafting beautiful user experiences since 2018.</p>
              </SCardContent>
            </SGlassCard>
            <!-- Stats card -->
            <SGlassCard tint="light">
              <SCardContent>
                <div class="text-center space-y-1">
                  <span class="mdi mdi-trending-up text-3xl text-emerald-400"></span>
                  <p class="text-3xl font-bold">89.2%</p>
                  <p class="text-sm opacity-70">Conversion Rate</p>
                </div>
              </SCardContent>
            </SGlassCard>
            <!-- Notification card -->
            <SGlassCard tint="light">
              <SCardHeader title="Notifications" icon="bell-outline" />
              <SCardContent>
                <div class="space-y-2 text-sm">
                  <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>Build succeeded</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span>PR review requested</span>
                  </div>
                </div>
              </SCardContent>
            </SGlassCard>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- On Light Backgrounds -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">On Light Backgrounds</h2>
      <DemoSection
        title="White Background"
        description="Glass cards with dark tint on white."
        :code="tintModesCode"
        language="vue"
      >
        <div class="rounded-2xl p-8 bg-white border border-gray-200">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SGlassCard tint="dark">
              <SCardHeader title="Settings" subtitle="Account preferences" icon="cog-outline" />
              <SCardContent>
                <p>Manage your account settings and notification preferences.</p>
              </SCardContent>
              <SCardFooter>
                <SButton size="small">Save Changes</SButton>
              </SCardFooter>
            </SGlassCard>
            <SGlassCard tint="dark">
              <SCardHeader title="Security" subtitle="Two-factor auth" icon="shield-check-outline" />
              <SCardContent>
                <p>Enable two-factor authentication for enhanced account protection.</p>
              </SCardContent>
              <SCardFooter>
                <SButton size="small">Enable 2FA</SButton>
              </SCardFooter>
            </SGlassCard>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- On Image Backgrounds -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">On Image Backgrounds</h2>
      <DemoSection
        title="Real Photo Backgrounds"
        description="Glass cards over photographs. Scroll to see the refraction effect over different image areas."
        :code="basicUsageCode"
        language="vue"
      >
        <div class="space-y-6">
          <!-- Mountain Lake -->
          <div>
            <p class="text-xs font-mono text-(--s-text-secondary) mb-2">Mountain landscape (scroll to explore)</p>
            <div class="rounded-2xl overflow-hidden">
              <div class="h-96 overflow-y-auto overscroll-contain" style="scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.3) transparent;">
                <div class="relative" style="min-height: 200%;">
                  <img
                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80"
                    alt="Mountain lake landscape"
                    class="absolute inset-0 w-full h-full object-cover"
                  />
                  <div class="sticky top-0 z-10 p-6">
                    <p class="text-xs text-white/60 mb-3 drop-shadow-md">Scroll down to see glass over different parts &darr;</p>
                    <div class="max-w-sm">
                      <SGlassCard tint="light">
                        <SCardHeader title="Mountain Retreat" subtitle="Yosemite Valley" icon="image-filter-hdr" />
                        <SCardContent>
                          <p>Discover the serenity of alpine lakes and towering granite cliffs.</p>
                        </SCardContent>
                        <SCardFooter>
                          <SButton size="small" variant="ghost">Details</SButton>
                          <SButton size="small">Book Now</SButton>
                        </SCardFooter>
                      </SGlassCard>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- City Skyline -->
          <div>
            <p class="text-xs font-mono text-(--s-text-secondary) mb-2">City skyline at night (scroll to explore)</p>
            <div class="rounded-2xl overflow-hidden">
              <div class="h-96 overflow-y-auto overscroll-contain" style="scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.3) transparent;">
                <div class="relative" style="min-height: 200%;">
                  <img
                    src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80"
                    alt="City skyline at night"
                    class="absolute inset-0 w-full h-full object-cover"
                  />
                  <div class="sticky top-0 z-10 p-6">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                      <SGlassCard tint="light">
                        <SCardContent>
                          <div class="text-center space-y-1">
                            <span class="mdi mdi-city-variant text-2xl"></span>
                            <p class="text-2xl font-bold">8.3M</p>
                            <p class="text-sm opacity-70">Population</p>
                          </div>
                        </SCardContent>
                      </SGlassCard>
                      <SGlassCard tint="light">
                        <SCardContent>
                          <div class="text-center space-y-1">
                            <span class="mdi mdi-office-building text-2xl"></span>
                            <p class="text-2xl font-bold">12,847</p>
                            <p class="text-sm opacity-70">Skyscrapers</p>
                          </div>
                        </SCardContent>
                      </SGlassCard>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- With Sub-components -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">With Sub-components</h2>
      <DemoSection
        title="SCardHeader, SCardContent, SCardFooter"
        description="All SCard sub-components work inside SGlassCard via provide/inject."
        :code="basicUsageCode"
        language="vue"
      >
        <div class="relative rounded-2xl overflow-hidden p-8">
          <div class="absolute inset-0 bg-gradient-to-br from-violet-700 via-purple-600 to-fuchsia-600"></div>
          <div class="relative grid grid-cols-1 sm:grid-cols-2 gap-6">
            <!-- With avatar header -->
            <SGlassCard tint="light">
              <SCardHeader
                title="Sarah Chen"
                subtitle="Senior Engineer"
                avatar="https://i.pravatar.cc/100?img=47"
              />
              <SCardContent>
                <p>Leading the frontend architecture team and mentoring junior developers.</p>
              </SCardContent>
              <SCardFooter divider>
                <SButton size="small" variant="ghost">Message</SButton>
                <SButton size="small">View Profile</SButton>
              </SCardFooter>
            </SGlassCard>
            <!-- With icon header -->
            <SGlassCard tint="light">
              <SCardHeader title="Project Update" subtitle="Sprint 14" icon="rocket-launch" divider />
              <SCardContent>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span>Completed tasks</span>
                    <span class="font-semibold">23/28</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Sprint velocity</span>
                    <span class="font-semibold">42 pts</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Days remaining</span>
                    <span class="font-semibold">3</span>
                  </div>
                </div>
              </SCardContent>
              <SCardFooter divider>
                <SButton size="small">View Board</SButton>
              </SCardFooter>
            </SGlassCard>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Sizes -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Sizes</h2>
      <DemoSection
        title="Card Sizes"
        description="Three size presets: compact, default, and comfortable."
        :code="sizesCode"
        language="vue"
      >
        <div class="relative rounded-2xl overflow-hidden p-8">
          <div class="absolute inset-0 bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-700"></div>
          <div class="relative grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="space-y-2">
              <SGlassCard tint="light" size="compact">
                <SCardHeader title="Compact" icon="arrow-collapse" />
                <SCardContent><p class="text-sm">Tight padding for dense layouts.</p></SCardContent>
              </SGlassCard>
              <span class="text-xs font-mono text-white/60 block text-center">compact</span>
            </div>
            <div class="space-y-2">
              <SGlassCard tint="light" size="default">
                <SCardHeader title="Default" icon="arrow-expand-horizontal" />
                <SCardContent><p class="text-sm">Balanced padding for most use cases.</p></SCardContent>
              </SGlassCard>
              <span class="text-xs font-mono text-white/60 block text-center">default</span>
            </div>
            <div class="space-y-2">
              <SGlassCard tint="light" size="comfortable">
                <SCardHeader title="Comfortable" icon="arrow-expand" />
                <SCardContent><p class="text-sm">Generous padding for spacious layouts.</p></SCardContent>
              </SGlassCard>
              <span class="text-xs font-mono text-white/60 block text-center">comfortable</span>
            </div>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Interactive -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Interactive Cards</h2>
      <DemoSection
        title="Hoverable, Pressable, Clickable"
        description="Add interactive effects to glass cards."
        :code="interactiveCode"
        language="vue"
      >
        <div class="relative rounded-2xl overflow-hidden p-8">
          <div class="absolute inset-0 bg-gradient-to-br from-rose-600 via-pink-600 to-fuchsia-600"></div>
          <div class="relative grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SGlassCard tint="light" hoverable>
              <SCardHeader title="Hoverable" icon="cursor-default-click-outline" />
              <SCardContent><p class="text-sm">Hover to see the lift animation.</p></SCardContent>
            </SGlassCard>
            <SGlassCard tint="light" pressable>
              <SCardHeader title="Pressable" icon="gesture-tap" />
              <SCardContent><p class="text-sm">Click/press to see the scale effect.</p></SCardContent>
            </SGlassCard>
            <SGlassCard tint="light" hoverable pressable clickable @click="() => {}">
              <SCardHeader title="All Combined" icon="star" />
              <SCardContent><p class="text-sm">Hoverable + pressable + clickable.</p></SCardContent>
            </SGlassCard>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Spotlight & Tilt -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Spotlight & Tilt</h2>
      <DemoSection
        title="Mouse-tracking Effects"
        description="Spotlight adds a radial glow following the mouse. Tilt adds 3D perspective rotation."
        :code="spotlightCode"
        language="vue"
      >
        <div class="rounded-2xl p-8 bg-black">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <SGlassCard tint="light" spotlight>
              <SCardHeader title="Spotlight" icon="flashlight" />
              <SCardContent><p>Move your mouse over this card to see the radial glow.</p></SCardContent>
            </SGlassCard>
            <SGlassCard tint="light" spotlight tilt>
              <SCardHeader title="Spotlight + Tilt" icon="rotate-3d-variant" />
              <SCardContent><p>Move your mouse for 3D perspective rotation with spotlight glow.</p></SCardContent>
            </SGlassCard>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Blur & Highlight Customization -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Blur & Highlight Customization</h2>
      <DemoSection
        title="Fine-tuning the Glass Effect"
        description="Adjust blur, saturation, and highlight intensity per card."
        :code="customizationCode"
        language="vue"
      >
        <div class="relative rounded-2xl overflow-hidden p-8">
          <div class="absolute inset-0 bg-gradient-to-br from-amber-600 via-orange-500 to-red-500"></div>
          <div class="absolute inset-0">
            <div class="absolute top-4 left-[20%] w-36 h-36 bg-yellow-300/30 rounded-full blur-3xl"></div>
            <div class="absolute bottom-4 right-[10%] w-44 h-44 bg-red-400/20 rounded-full blur-3xl"></div>
          </div>
          <div class="relative space-y-6">
            <div>
              <p class="text-xs text-white/60 mb-3">Blur levels:</p>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SGlassCard :blur="6" tint="light" size="compact">
                  <SCardContent><p class="text-sm text-center">Subtle (6px)</p></SCardContent>
                </SGlassCard>
                <SGlassCard :blur="12" tint="light" size="compact">
                  <SCardContent><p class="text-sm text-center">Default (12px)</p></SCardContent>
                </SGlassCard>
                <SGlassCard :blur="24" tint="light" size="compact">
                  <SCardContent><p class="text-sm text-center">Heavy (24px)</p></SCardContent>
                </SGlassCard>
              </div>
            </div>
            <div>
              <p class="text-xs text-white/60 mb-3">Highlight intensity:</p>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SGlassCard :highlight-intensity="0" tint="light" size="compact">
                  <SCardContent><p class="text-sm text-center">None (0)</p></SCardContent>
                </SGlassCard>
                <SGlassCard :highlight-intensity="0.3" tint="light" size="compact">
                  <SCardContent><p class="text-sm text-center">Default (0.3)</p></SCardContent>
                </SGlassCard>
                <SGlassCard :highlight-intensity="0.5" tint="light" size="compact">
                  <SCardContent><p class="text-sm text-center">Bright (0.5)</p></SCardContent>
                </SGlassCard>
              </div>
            </div>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Loading & Disabled -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Loading & Disabled States</h2>
      <DemoSection
        title="State Variants"
        description="Loading shows a glass shimmer overlay. Disabled reduces opacity."
        :code="basicUsageCode"
        language="vue"
      >
        <div class="relative rounded-2xl overflow-hidden p-8">
          <div class="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700"></div>
          <div class="relative grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="space-y-2">
              <SGlassCard tint="light" :loading="isLoading" @click="simulateLoading" clickable>
                <SCardHeader title="Loading" icon="loading" />
                <SCardContent><p class="text-sm">Click to toggle loading state.</p></SCardContent>
              </SGlassCard>
              <span class="text-xs font-mono text-white/60 block text-center">click to test</span>
            </div>
            <div class="space-y-2">
              <SGlassCard tint="light" loading>
                <SCardHeader title="Always Loading" icon="timer-sand" />
                <SCardContent><p class="text-sm">Permanent loading state.</p></SCardContent>
              </SGlassCard>
              <span class="text-xs font-mono text-white/60 block text-center">loading</span>
            </div>
            <div class="space-y-2">
              <SGlassCard tint="light" disabled>
                <SCardHeader title="Disabled" icon="cancel" />
                <SCardContent><p class="text-sm">Cannot interact with this card.</p></SCardContent>
              </SGlassCard>
              <span class="text-xs font-mono text-white/60 block text-center">disabled</span>
            </div>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- As Links -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">As Links</h2>
      <DemoSection
        title="Card Links"
        description="Use href for external links or to for Vue Router navigation."
        :code="basicUsageCode"
        language="vue"
      >
        <div class="relative rounded-2xl overflow-hidden p-8">
          <div class="absolute inset-0 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700"></div>
          <div class="relative grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
            <SGlassCard tint="light" hoverable to="/ui/card">
              <SCardHeader title="Router Link" icon="arrow-left" />
              <SCardContent><p class="text-sm">Navigate to SCard page via Vue Router.</p></SCardContent>
            </SGlassCard>
            <SGlassCard tint="light" hoverable href="https://vuejs.org" tag="a">
              <SCardHeader title="External Link" icon="open-in-new" />
              <SCardContent><p class="text-sm">Opens vuejs.org in the same tab.</p></SCardContent>
            </SGlassCard>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- API Reference -->
    <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">API Reference</h2>
    <SApiSection>
      <SApiTable title="Props" type="props" :props="glassCardProps" />
      <SApiTable title="Events" type="events" :events="glassCardEvents" />
      <SApiTable title="Slots" type="slots" :slots="glassCardSlots" />
      <SApiKeyboard :shortcuts="keyboardShortcuts" />
    </SApiSection>
  </div>
</template>
