<script setup lang="ts">
import { ref } from 'vue'
import { SBadge, SButton, SApiSection, SApiTable } from '../../index'
import type { ApiProp, ApiEvent, ApiSlot } from '../../index'
import DemoSection from '../../components/DemoSection.vue'

// State for interactive demos
const notificationCount = ref(5)

const incrementNotifications = () => {
  notificationCount.value++
}

const clearNotifications = () => {
  notificationCount.value = 0
}

// Code snippets for demos
const basicUsageCode = `<SBadge :content="5" standalone>
</SBadge>
<SBadge content="New" standalone color="#3b82f6">
</SBadge>
<SBadge content="99" standalone color="#ec4899">
</SBadge>`

const overlayCode = `<SBadge :content="5">
  <SButton iconOnly iconLeft="bell" />
</SBadge>

<SBadge :content="12" color="#ec4899">
  <SButton iconOnly iconLeft="email" />
</SBadge>`

const variantsCode = `<SBadge content="5" variant="filled" standalone />
<SBadge content="5" variant="outlined" standalone />
<SBadge content="5" variant="light" standalone />`

const sizesCode = `<SBadge content="5" size="small" standalone />
<SBadge content="5" size="medium" standalone />
<SBadge content="5" size="large" standalone />`

const dotCode = `<SBadge dot>
  <SButton iconOnly iconLeft="bell" />
</SBadge>

<SBadge dot color="#f59e0b">
  <span class="mdi mdi-account text-3xl"></span>
</SBadge>`

const maxCode = `<SBadge :content="100" :max="99">
  <SButton iconOnly iconLeft="email" />
</SBadge>

<SBadge :content="1000" :max="999" color="#ec4899">
  <SButton iconOnly iconLeft="message" />
</SBadge>`

const positionsCode = `<SBadge :content="1" position="top-right">
  <div class="w-10 h-10 bg-gray-700 rounded-lg"></div>
</SBadge>
<SBadge :content="2" position="top-left">
  <div class="w-10 h-10 bg-gray-700 rounded-lg"></div>
</SBadge>
<SBadge :content="3" position="bottom-right">
  <div class="w-10 h-10 bg-gray-700 rounded-lg"></div>
</SBadge>
<SBadge :content="4" position="bottom-left">
  <div class="w-10 h-10 bg-gray-700 rounded-lg"></div>
</SBadge>`

const borderedCode = `<SBadge :content="5" bordered>
  <div class="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full"></div>
</SBadge>

<SBadge dot bordered color="#10b981">
  <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full"></div>
</SBadge>`

const pulseCode = `<SBadge dot pulse color="#ef4444">
  <SButton iconOnly iconLeft="bell" />
</SBadge>

<SBadge :content="3" pulse color="#f59e0b">
  <SButton iconOnly iconLeft="email" />
</SBadge>`

const colorsCode = `<SBadge content="1" standalone color="#ef4444" />
<SBadge content="2" standalone color="#f59e0b" />
<SBadge content="3" standalone color="#10b981" />
<SBadge content="4" standalone color="#3b82f6" />
<SBadge content="5" standalone color="#8b5cf6" />
<SBadge content="6" standalone color="#ec4899" />`

const interactiveCode = `<SBadge :content="notificationCount">
  <SButton iconOnly iconLeft="bell" @click="incrementNotifications" />
</SBadge>

<button @click="clearNotifications">Clear</button>`

// API Reference data
const badgeProps: ApiProp[] = [
  { name: 'variant', type: "'filled' | 'outlined' | 'light'", default: "'filled'", description: 'Visual style variant', category: 'Appearance' },
  { name: 'size', type: "'small' | 'medium' | 'large'", default: "'medium'", description: 'Badge size', category: 'Appearance' },
  { name: 'color', type: 'string', default: "'var(--s-primary)'", description: 'Badge color (any valid CSS color)', category: 'Appearance' },
  { name: 'bordered', type: 'boolean', default: 'false', description: 'Add border around badge', category: 'Appearance' },
  { name: 'content', type: 'string | number', default: 'undefined', description: 'Badge content', category: 'Content' },
  { name: 'max', type: 'number', default: '99', description: 'Max value before showing overflow (e.g., 99+)', category: 'Content' },
  { name: 'showZero', type: 'boolean', default: 'false', description: 'Show badge when content is 0', category: 'Content' },
  { name: 'dot', type: 'boolean', default: 'false', description: 'Show as dot indicator instead of content', category: 'Content' },
  { name: 'position', type: "'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'", default: "'top-right'", description: 'Badge position when used as overlay', category: 'Positioning' },
  { name: 'offset', type: '[number, number]', default: '[0, 0]', description: 'Fine-tune position [x, y] in pixels', category: 'Positioning' },
  { name: 'standalone', type: 'boolean', default: 'false', description: 'Render as inline element without positioning', category: 'Positioning' },
  { name: 'pulse', type: 'boolean', default: 'false', description: 'Add pulse animation', category: 'Animation' }
]

const badgeEvents: ApiEvent[] = [
  { name: '@click', payload: 'MouseEvent', description: 'Emitted when badge is clicked' }
]

const badgeSlots: ApiSlot[] = [
  { name: 'default', description: 'Content to wrap with badge overlay (not used in standalone mode)' },
  { name: 'content', description: 'Custom badge content (replaces the content prop)' }
]
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-(--s-text-primary) mb-2">Badges</h1>
      <p class="text-lg text-(--s-text-secondary)">Small status descriptors for UI elements, icons, or avatars.</p>
    </header>

    <!-- Features -->
    <article>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-palette-outline text-xl text-emerald-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Three Variants</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Filled, outlined, and light variants with custom color support for any design.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-dots-horizontal text-xl text-blue-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Dot Mode</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Show minimal dot indicators for subtle status without content.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-numeric-9-plus text-xl text-purple-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Max Value</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Cap displayed numbers with overflow indicator (e.g., 99+).</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-arrow-all text-xl text-amber-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Flexible Positioning</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Four corner positions with custom pixel offset support.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-pulse text-xl text-red-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Pulse Animation</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Animated pulse effect to draw attention to important notifications.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-view-dashboard-outline text-xl text-cyan-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Standalone Mode</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Use as inline elements or as overlays on buttons and icons.</p>
        </div>
      </div>
    </article>

    <!-- Basic Usage -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Basic Usage</h2>
      <DemoSection 
        title="Standalone Badges"
        description="Badges can be used standalone to display counts or labels."
        :code="basicUsageCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-4 items-center">
          <SBadge :content="5" standalone />
          <SBadge content="New" standalone color="#3b82f6" />
          <SBadge content="99" standalone color="#ec4899" />
          <SBadge content="Hot" standalone color="#f59e0b" />
        </div>
      </DemoSection>
    </section>

    <!-- Overlay Badges -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Overlay Badges</h2>
      <DemoSection 
        title="Badge Overlays"
        description="Wrap any element with SBadge to add a badge overlay."
        :code="overlayCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-6 items-center">
          <SBadge :content="5">
            <SButton iconOnly iconLeft="bell" />
          </SBadge>
          <SBadge :content="12" color="#ec4899">
            <SButton iconOnly iconLeft="email" />
          </SBadge>
          <SBadge :content="3" color="#3b82f6">
            <SButton iconOnly iconLeft="message" />
          </SBadge>
          <SBadge content="NEW" color="#f59e0b" size="small">
            <SButton iconOnly iconLeft="gift" />
          </SBadge>
        </div>
      </DemoSection>
    </section>

    <!-- Variants -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Variants</h2>
      <DemoSection 
        title="Badge Variants"
        description="Three variants available: filled (default), outlined, and light."
        :code="variantsCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-6 items-center">
          <div class="flex flex-col items-center gap-2">
            <SBadge :content="5" variant="filled" standalone />
            <span class="text-xs font-mono text-(--s-text-secondary)">filled</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SBadge :content="5" variant="outlined" standalone />
            <span class="text-xs font-mono text-(--s-text-secondary)">outlined</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SBadge :content="5" variant="light" standalone />
            <span class="text-xs font-mono text-(--s-text-secondary)">light</span>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Sizes -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Sizes</h2>
      <DemoSection 
        title="Badge Sizes"
        description="Three size options: small, medium (default), and large."
        :code="sizesCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-6 items-center">
          <div class="flex flex-col items-center gap-2">
            <SBadge :content="5" size="small" standalone />
            <span class="text-xs font-mono text-(--s-text-secondary)">small</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SBadge :content="5" size="medium" standalone />
            <span class="text-xs font-mono text-(--s-text-secondary)">medium</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SBadge :content="5" size="large" standalone />
            <span class="text-xs font-mono text-(--s-text-secondary)">large</span>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Colors -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Colors</h2>
      <DemoSection 
        title="Custom Colors"
        description="Use any valid CSS color value for the color prop."
        :code="colorsCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-3 items-center">
          <SBadge :content="1" standalone color="#ef4444" />
          <SBadge :content="2" standalone color="#f59e0b" />
          <SBadge :content="3" standalone color="#10b981" />
          <SBadge :content="4" standalone color="#3b82f6" />
          <SBadge :content="5" standalone color="#8b5cf6" />
          <SBadge :content="6" standalone color="#ec4899" />
        </div>
      </DemoSection>
    </section>

    <!-- Dot Badges -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Dot Badges</h2>
      <DemoSection 
        title="Dot Mode"
        description="Use the dot prop to show a small indicator without content."
        :code="dotCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-6 items-center">
          <SBadge dot>
            <SButton iconOnly iconLeft="bell" />
          </SBadge>
          <SBadge dot color="#f59e0b">
            <span class="mdi mdi-account text-3xl text-(--s-text-secondary)"></span>
          </SBadge>
          <SBadge dot color="#ef4444">
            <div class="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-full"></div>
          </SBadge>
          <SBadge dot color="#10b981" size="large">
            <SButton iconOnly iconLeft="wifi" />
          </SBadge>
        </div>
      </DemoSection>
    </section>

    <!-- Max Value -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Max Value</h2>
      <DemoSection 
        title="Overflow Handling"
        description="Use the max prop to cap the displayed number. Exceeding values show as max+."
        :code="maxCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-6 items-center">
          <div class="flex flex-col items-center gap-2">
            <SBadge :content="100" :max="99">
              <SButton iconOnly iconLeft="email" />
            </SBadge>
            <span class="text-xs font-mono text-(--s-text-secondary)">max: 99</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SBadge :content="1000" :max="999" color="#ec4899">
              <SButton iconOnly iconLeft="message" />
            </SBadge>
            <span class="text-xs font-mono text-(--s-text-secondary)">max: 999</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SBadge :content="50" :max="10" color="#3b82f6">
              <SButton iconOnly iconLeft="inbox" />
            </SBadge>
            <span class="text-xs font-mono text-(--s-text-secondary)">max: 10</span>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Positions -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Positions</h2>
      <DemoSection 
        title="Badge Positioning"
        description="Control badge placement with the position prop."
        :code="positionsCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-8 items-center">
          <div class="flex flex-col items-center gap-2">
            <SBadge :content="1" position="top-right" color="#ef4444">
              <div class="w-12 h-12 bg-(--s-bg-tertiary) rounded-lg"></div>
            </SBadge>
            <span class="text-xs font-mono text-(--s-text-secondary)">top-right</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SBadge :content="2" position="top-left" color="#f59e0b">
              <div class="w-12 h-12 bg-(--s-bg-tertiary) rounded-lg"></div>
            </SBadge>
            <span class="text-xs font-mono text-(--s-text-secondary)">top-left</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SBadge :content="3" position="bottom-right" color="#10b981">
              <div class="w-12 h-12 bg-(--s-bg-tertiary) rounded-lg"></div>
            </SBadge>
            <span class="text-xs font-mono text-(--s-text-secondary)">bottom-right</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SBadge :content="4" position="bottom-left" color="#3b82f6">
              <div class="w-12 h-12 bg-(--s-bg-tertiary) rounded-lg"></div>
            </SBadge>
            <span class="text-xs font-mono text-(--s-text-secondary)">bottom-left</span>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Bordered -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Bordered Badges</h2>
      <DemoSection 
        title="With Border"
        description="Add a border around the badge that matches the background."
        :code="borderedCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-6 items-center">
          <SBadge :content="5" bordered color="#ef4444">
            <div class="w-12 h-12 bg-linear-to-br from-pink-500 to-purple-600 rounded-full"></div>
          </SBadge>
          <SBadge dot bordered color="#10b981">
            <div class="w-12 h-12 bg-linear-to-br from-blue-500 to-cyan-500 rounded-full"></div>
          </SBadge>
          <SBadge content="NEW" bordered color="#f59e0b" size="small">
            <div class="w-12 h-12 bg-linear-to-br from-orange-500 to-red-500 rounded-full"></div>
          </SBadge>
          <SBadge :content="99" bordered variant="outlined">
            <div class="w-12 h-12 bg-linear-to-br from-emerald-500 to-teal-500 rounded-full"></div>
          </SBadge>
        </div>
      </DemoSection>
    </section>

    <!-- Pulse Animation -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Pulse Animation</h2>
      <DemoSection 
        title="Animated Badges"
        description="Use pulse to draw attention to important notifications."
        :code="pulseCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-6 items-center">
          <SBadge dot pulse color="#ef4444">
            <SButton iconOnly iconLeft="bell" />
          </SBadge>
          <SBadge :content="3" pulse color="#f59e0b">
            <SButton iconOnly iconLeft="email" />
          </SBadge>
          <SBadge dot pulse color="#10b981" size="large">
            <span class="mdi mdi-circle text-3xl text-(--s-text-secondary)"></span>
          </SBadge>
        </div>
      </DemoSection>
    </section>

    <!-- Interactive Demo -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Interactive Demo</h2>
      <DemoSection 
        title="Dynamic Badges"
        description="Badges update reactively with your data."
        :code="interactiveCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-4 items-center">
          <SBadge :content="notificationCount" :showZero="true">
            <SButton 
              iconOnly 
              iconLeft="bell" 
              @click="incrementNotifications"
            />
          </SBadge>
          <button 
            @click="clearNotifications"
            class="px-4 py-2 text-sm bg-(--s-bg-tertiary) text-(--s-text-secondary) rounded-lg hover:bg-(--s-bg-secondary) hover:text-(--s-text-primary) transition-colors"
          >
            Clear
          </button>
          <span class="text-sm text-(--s-text-secondary)">
            Count: {{ notificationCount }}
          </span>
        </div>
      </DemoSection>
    </section>

    <!-- Show Zero -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Show Zero</h2>
      <DemoSection 
        title="Zero Value Display"
        description="Control whether to show the badge when content is 0."
        code="<SBadge :content='0' :showZero='false' /> <!-- Hidden -->
<SBadge :content='0' :showZero='true' />  <!-- Visible -->"
        language="vue"
      >
        <div class="flex flex-wrap gap-8 items-center">
          <div class="flex flex-col items-center gap-2">
            <SBadge :content="0" :showZero="false">
              <SButton iconOnly iconLeft="bell" />
            </SBadge>
            <span class="text-xs font-mono text-(--s-text-secondary)">showZero: false</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SBadge :content="0" :showZero="true">
              <SButton iconOnly iconLeft="bell" />
            </SBadge>
            <span class="text-xs font-mono text-(--s-text-secondary)">showZero: true</span>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Real-World Examples -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Real-World Examples</h2>
      <DemoSection 
        title="Navigation Badges"
        description="Common badge patterns for navigation items showing unread counts and status indicators."
        :code="interactiveCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-6 items-center p-4 bg-(--s-bg-secondary) rounded-xl">
          <SBadge :content="3" color="#ef4444">
            <SButton variant="ghost" iconOnly iconLeft="bell" />
          </SBadge>
          <SBadge :content="12" color="#3b82f6">
            <SButton variant="ghost" iconOnly iconLeft="email" />
          </SBadge>
          <SBadge dot color="#10b981" pulse>
            <SButton variant="ghost" iconOnly iconLeft="account" />
          </SBadge>
        </div>
      </DemoSection>
    </section>

    <!-- API Reference -->
    <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">API Reference</h2>
    <SApiSection>
      <SApiTable title="Props" type="props" :props="badgeProps" />
      <SApiTable title="Events" type="events" :events="badgeEvents" />
      <SApiTable title="Slots" type="slots" :slots="badgeSlots">
        <div class="mt-4 p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <h4 class="text-sm font-semibold text-(--s-text-primary) mb-3">Example: Badge overlay on a button</h4>
          <pre class="text-xs bg-(--s-bg-tertiary) p-3 rounded-lg overflow-x-auto"><code class="text-(--s-text-secondary)">&lt;SBadge :content="5" color="#ef4444"&gt;
  &lt;SButton iconOnly iconLeft="bell" /&gt;
&lt;/SBadge&gt;</code></pre>
        </div>
      </SApiTable>
    </SApiSection>
  </div>
</template>
