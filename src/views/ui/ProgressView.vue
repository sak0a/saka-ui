<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { SProgress, SProgressRange, SApiSection, SApiTable, SButton } from '../../index'
import type { ApiProp, ApiEvent, ApiSlot, RangeValue } from '../../index'
import DemoSection from '../../components/DemoSection.vue'

// State for demos
const basicProgress = ref(65)
const animatedProgress = ref(0)
const indeterminateActive = ref(true)
const bufferProgress = ref(45)
const bufferValue = ref(70)
const segmentProgress = ref(60)
const gradientProgress = ref(75)
const stripedProgress = ref(50)
const liquidProgress = ref(55)

// Size demos
const sizeProgress = ref(50)

// Vertical demos
const verticalProgress = ref(70)

// Range demos
const singleSlider = ref(40)
const rangeValue = ref<RangeValue>({ min: 20, max: 80 })
const priceRange = ref<RangeValue>({ min: 100, max: 500 })

// Animation demos
const pulseProgress = ref(60)
const waveProgress = ref(70)
const shimmerProgress = ref(55)
const flowProgress = ref(45)

// Live progress simulation
let progressInterval: ReturnType<typeof setInterval> | null = null
const isRunning = ref(false)

const startSimulation = () => {
  if (isRunning.value) return
  isRunning.value = true
  animatedProgress.value = 0
  progressInterval = setInterval(() => {
    if (animatedProgress.value >= 100) {
      animatedProgress.value = 0
    } else {
      animatedProgress.value += 2
    }
  }, 100)
}

const stopSimulation = () => {
  isRunning.value = false
  if (progressInterval) {
    clearInterval(progressInterval)
    progressInterval = null
  }
}

onMounted(() => {
  startSimulation()
})

onUnmounted(() => {
  stopSimulation()
})

// Code snippets
const basicCode = `<SProgress v-model="basicProgress" />`

const sizesCode = `<SProgress v-model="sizeProgress" size="xs" />
<SProgress v-model="sizeProgress" size="small" />
<SProgress v-model="sizeProgress" size="medium" />
<SProgress v-model="sizeProgress" size="large" />
<SProgress v-model="sizeProgress" size="xl" show-value value-position="inside" />`

const variantsCode = `<!-- Default -->
<SProgress v-model="basicProgress" />

<!-- Gradient -->
<SProgress
  v-model="gradientProgress"
  variant="gradient"
  :gradient-colors="['#06b6d4', '#3b82f6', '#8b5cf6']"
/>

<!-- Striped (animated) -->
<SProgress
  v-model="stripedProgress"
  variant="striped"
  animated
  animation-type="flow"
  color="#f59e0b"
/>

<!-- Buffer -->
<SProgress
  v-model="bufferProgress"
  variant="buffer"
  :buffer-value="bufferValue"
  color="#3b82f6"
/>

<!-- Segments -->
<SProgress
  v-model="segmentProgress"
  variant="segments"
  :segments="5"
  color="#10b981"
/>

<!-- Liquid -->
<SProgress
  v-model="liquidProgress"
  variant="liquid"
  size="large"
  color="#8b5cf6"
/>`

const animationsCode = `<!-- Pulse -->
<SProgress v-model="pulseProgress" animated animation-type="pulse" color="#ec4899" />

<!-- Wave -->
<SProgress v-model="waveProgress" animated animation-type="wave" color="#3b82f6" />

<!-- Shimmer -->
<SProgress v-model="shimmerProgress" animated animation-type="shimmer" color="#10b981" />

<!-- Flow (striped) -->
<SProgress
  v-model="flowProgress"
  variant="striped"
  animated
  animation-type="flow"
  color="#f59e0b"
/>

<!-- Indeterminate -->
<SProgress :indeterminate="indeterminateActive" color="#8b5cf6" />`

const displayCode = `<!-- With label and value -->
<SProgress
  v-model="animatedProgress"
  label="Downloading files..."
  show-value
  color="#3b82f6"
/>

<!-- Value inside (xl size) -->
<SProgress
  v-model="basicProgress"
  size="xl"
  show-value
  value-position="inside"
  color="#10b981"
/>

<!-- Value tooltip -->
<SProgress
  v-model="basicProgress"
  show-value
  value-position="tooltip"
  color="#ec4899"
/>

<!-- Custom format -->
<SProgress
  v-model="basicProgress"
  label="Upload Progress"
  show-value
  :value-format="(v) => \`\${v} MB / 100 MB\`"
  color="#8b5cf6"
/>`

const verticalCode = `<SProgress
  v-model="verticalProgress"
  orientation="vertical"
  height="150px"
  color="#3b82f6"
/>

<SProgress
  v-model="gradientProgress"
  orientation="vertical"
  height="150px"
  variant="gradient"
  :gradient-colors="['#f59e0b', '#ef4444', '#ec4899']"
/>

<SProgress
  v-model="segmentProgress"
  orientation="vertical"
  height="150px"
  variant="segments"
  :segments="5"
  color="#10b981"
/>

<SProgress
  :indeterminate="true"
  orientation="vertical"
  height="150px"
  color="#8b5cf6"
/>`

const rangeCode = `<!-- Single Slider -->
<SProgressRange
  v-model="singleSlider"
  show-value
  show-labels
  color="#3b82f6"
/>

<!-- Range Slider (Dual Handles) -->
<SProgressRange
  v-model="rangeValue"
  range
  show-value
  show-labels
  color="#10b981"
/>`

const priceFilterCode = `<SProgressRange
  v-model="priceRange"
  range
  :min="0"
  :max="1000"
  :step="10"
  :pushable="50"
  show-value
  show-ticks
  :tick-count="5"
  :value-format="(v) => \`$\${v}\`"
  label="Price Range"
  color="#8b5cf6"
/>`

const maxRangeCode = `<SProgressRange
  v-model="limitedRange"
  range
  :min="0"
  :max="1500"
  :max-range="500"
  :step="10"
  show-value
  show-labels
  :value-format="(v) => \`€\${v}\`"
  color="#10b981"
/>`

const liveCode = `<SProgress
  v-model="animatedProgress"
  variant="gradient"
  :gradient-colors="['#06b6d4', '#3b82f6', '#8b5cf6']"
  size="large"
  show-value
  value-position="inside"
  animated
  animation-type="shimmer"
  label="Processing..."
/>`

const marksCode = `<SProgressRange
  v-model="singleSlider"
  :marks="[
    { value: 0, label: 'Cold' },
    { value: 25, label: 'Cool' },
    { value: 50, label: 'Warm' },
    { value: 75, label: 'Hot' },
    { value: 100, label: 'Extreme' }
  ]"
  show-ticks
  color="#ef4444"
/>`

// Demo values for max range
const limitedRange = ref<RangeValue>({ min: 200, max: 600 })
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-(--s-text-primary) mb-2">Progress</h1>
      <p class="text-lg text-(--s-text-secondary)">
        Advanced progress bars and range sliders with rich customization, animations, and multi-range support.
      </p>
    </header>

    <!-- Features -->
    <article class="space-y-4">
      <h2 class="text-2xl font-bold text-(--s-text-primary)">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 rounded-xl bg-cyan-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-palette text-2xl text-cyan-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">6 Visual Variants</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Default, gradient, striped, buffer, segments, and liquid styles.</p>
        </div>
        <div class="p-4 rounded-xl bg-violet-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-animation text-2xl text-violet-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Rich Animations</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Pulse, wave, shimmer, flow, bounce and indeterminate modes.</p>
        </div>
        <div class="p-4 rounded-xl bg-emerald-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-arrow-left-right text-2xl text-emerald-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Range Slider</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Single or dual-handle sliders for filter controls like price ranges.</p>
        </div>
        <div class="p-4 rounded-xl bg-amber-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-resize text-2xl text-amber-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">5 Size Options</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Extra small to extra large sizes for any use case.</p>
        </div>
        <div class="p-4 rounded-xl bg-rose-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-rotate-3d text-2xl text-rose-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Vertical & Horizontal</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Both orientations with full feature support.</p>
        </div>
        <div class="p-4 rounded-xl bg-blue-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-slot-machine text-2xl text-blue-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Custom Templates</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Labels, value formatting, tooltips and custom display positions.</p>
        </div>
      </div>
    </article>

    <!-- Basic Usage -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Basic Usage</h2>
      <DemoSection
        title="Simple Progress Bar"
        description="A basic progress bar with v-model binding."
        :code="basicCode"
        language="vue"
      >
        <div class="space-y-4 max-w-md">
          <SProgress v-model="basicProgress" />
          <div class="flex items-center gap-4">
            <input 
              v-model.number="basicProgress" 
              type="range" 
              min="0" 
              max="100"
              class="flex-1"
            />
            <span class="text-sm font-mono text-(--s-text-secondary) w-12">{{ basicProgress }}%</span>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Sizes -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Sizes</h2>
      <DemoSection
        title="Progress Bar Sizes"
        description="Five size options from extra small to extra large."
        :code="sizesCode"
        language="vue"
      >
        <div class="space-y-6 max-w-md">
          <div class="space-y-2">
            <span class="text-xs font-mono text-(--s-text-secondary)">xs</span>
            <SProgress v-model="sizeProgress" size="xs" />
          </div>
          <div class="space-y-2">
            <span class="text-xs font-mono text-(--s-text-secondary)">small</span>
            <SProgress v-model="sizeProgress" size="small" />
          </div>
          <div class="space-y-2">
            <span class="text-xs font-mono text-(--s-text-secondary)">medium (default)</span>
            <SProgress v-model="sizeProgress" size="medium" />
          </div>
          <div class="space-y-2">
            <span class="text-xs font-mono text-(--s-text-secondary)">large</span>
            <SProgress v-model="sizeProgress" size="large" />
          </div>
          <div class="space-y-2">
            <span class="text-xs font-mono text-(--s-text-secondary)">xl</span>
            <SProgress v-model="sizeProgress" size="xl" show-value value-position="inside" />
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Variants -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Variants</h2>
      <DemoSection
        title="Visual Variants"
        description="Different visual styles for various use cases."
        :code="variantsCode"
        language="vue"
      >
        <div class="space-y-8 max-w-lg">
          <div class="space-y-2">
            <span class="text-xs font-mono text-(--s-text-secondary)">default</span>
            <SProgress v-model="basicProgress" />
          </div>
          <div class="space-y-2">
            <span class="text-xs font-mono text-(--s-text-secondary)">gradient</span>
            <SProgress 
              v-model="gradientProgress" 
              variant="gradient"
              :gradient-colors="['#06b6d4', '#3b82f6', '#8b5cf6']"
            />
          </div>
          <div class="space-y-2">
            <span class="text-xs font-mono text-(--s-text-secondary)">striped (animated)</span>
            <SProgress 
              v-model="stripedProgress" 
              variant="striped" 
              animated 
              animation-type="flow"
              color="#f59e0b"
            />
          </div>
          <div class="space-y-2">
            <span class="text-xs font-mono text-(--s-text-secondary)">buffer</span>
            <SProgress 
              v-model="bufferProgress" 
              variant="buffer"
              :buffer-value="bufferValue"
              color="#3b82f6"
            />
          </div>
          <div class="space-y-2">
            <span class="text-xs font-mono text-(--s-text-secondary)">segments</span>
            <SProgress 
              v-model="segmentProgress" 
              variant="segments" 
              :segments="5"
              color="#10b981"
            />
          </div>
          <div class="space-y-2">
            <span class="text-xs font-mono text-(--s-text-secondary)">liquid</span>
            <SProgress 
              v-model="liquidProgress" 
              variant="liquid"
              size="large"
              color="#8b5cf6"
            />
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Animations -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Animations</h2>
      <DemoSection
        title="Animation Types"
        description="Various animation effects for active progress states."
        :code="animationsCode"
        language="vue"
      >
        <div class="space-y-8 max-w-lg">
          <div class="space-y-2">
            <span class="text-xs font-mono text-(--s-text-secondary)">pulse</span>
            <SProgress v-model="pulseProgress" animated animation-type="pulse" color="#ec4899" />
          </div>
          <div class="space-y-2">
            <span class="text-xs font-mono text-(--s-text-secondary)">wave</span>
            <SProgress v-model="waveProgress" animated animation-type="wave" color="#3b82f6" />
          </div>
          <div class="space-y-2">
            <span class="text-xs font-mono text-(--s-text-secondary)">shimmer</span>
            <SProgress v-model="shimmerProgress" animated animation-type="shimmer" color="#10b981" />
          </div>
          <div class="space-y-2">
            <span class="text-xs font-mono text-(--s-text-secondary)">flow (striped)</span>
            <SProgress 
              v-model="flowProgress" 
              variant="striped" 
              animated 
              animation-type="flow"
              color="#f59e0b"
            />
          </div>
          <div class="space-y-2">
            <span class="text-xs font-mono text-(--s-text-secondary)">indeterminate</span>
            <SProgress 
              :indeterminate="indeterminateActive" 
              color="#8b5cf6"
            />
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Display Options -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Display Options</h2>
      <DemoSection
        title="Labels & Values"
        description="Various ways to display progress information."
        :code="displayCode"
        language="vue"
      >
        <div class="space-y-8 max-w-lg">
          <div>
            <SProgress 
              v-model="animatedProgress" 
              label="Downloading files..." 
              show-value
              color="#3b82f6"
            />
          </div>
          <div>
            <SProgress 
              v-model="basicProgress" 
              size="xl"
              show-value 
              value-position="inside"
              color="#10b981"
            />
          </div>
          <div>
            <SProgress 
              v-model="basicProgress"
              show-value 
              value-position="tooltip"
              color="#ec4899"
            />
            <p class="text-xs text-(--s-text-tertiary) mt-1">Hover to see tooltip</p>
          </div>
          <div>
            <SProgress 
              v-model="basicProgress"
              label="Upload Progress"
              show-value
              :value-format="(v) => `${v} MB / 100 MB`"
              color="#8b5cf6"
            />
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Vertical -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Vertical Orientation</h2>
      <DemoSection
        title="Vertical Progress Bars"
        description="Progress bars can be displayed vertically."
        :code="verticalCode"
        language="vue"
      >
        <div class="flex gap-8 items-end">
          <div class="flex flex-col items-center gap-2">
            <SProgress 
              v-model="verticalProgress" 
              orientation="vertical"
              height="150px"
              color="#3b82f6"
            />
            <span class="text-xs font-mono text-(--s-text-secondary)">default</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SProgress 
              v-model="gradientProgress" 
              orientation="vertical"
              height="150px"
              variant="gradient"
              :gradient-colors="['#f59e0b', '#ef4444', '#ec4899']"
            />
            <span class="text-xs font-mono text-(--s-text-secondary)">gradient</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SProgress 
              v-model="segmentProgress" 
              orientation="vertical"
              height="150px"
              variant="segments"
              :segments="5"
              color="#10b981"
            />
            <span class="text-xs font-mono text-(--s-text-secondary)">segments</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SProgress 
              :indeterminate="true" 
              orientation="vertical"
              height="150px"
              color="#8b5cf6"
            />
            <span class="text-xs font-mono text-(--s-text-secondary)">indeterminate</span>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Range Slider -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Range Slider</h2>
      <DemoSection
        title="Single & Dual Handle Sliders"
        description="Interactive sliders for value selection with single or dual handles."
        :code="rangeCode"
        language="vue"
      >
        <div class="space-y-10 max-w-lg">
          <div class="space-y-4">
            <h4 class="text-sm font-semibold text-(--s-text-primary)">Single Slider</h4>
            <SProgressRange 
              v-model="singleSlider"
              show-value
              show-labels
              color="#3b82f6"
            />
          </div>
          <div class="space-y-4">
            <h4 class="text-sm font-semibold text-(--s-text-primary)">Range Slider (Dual Handles)</h4>
            <SProgressRange 
              v-model="rangeValue"
              range
              show-value
              show-labels
              color="#10b981"
            />
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Price Filter Example -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Real-World Example</h2>
      <DemoSection
        title="Price Range Filter"
        description="A practical price filter implementation with formatted values."
        :code="priceFilterCode"
        language="vue"
      >
        <div class="p-6 rounded-xl bg-(--s-bg-primary) border border-(--s-border) max-w-md">
          <h3 class="text-lg font-semibold text-(--s-text-primary) mb-6">Filter Products</h3>
          
          <SProgressRange 
            v-model="priceRange"
            range
            :min="0"
            :max="1000"
            :step="10"
            :pushable="50"
            show-value
            show-ticks
            :tick-count="5"
            :value-format="(v) => `$${v}`"
            label="Price Range"
            color="#8b5cf6"
          />
          
          <div class="mt-6 pt-4 border-t border-(--s-border)">
            <div class="flex items-center justify-between text-sm">
              <span class="text-(--s-text-secondary)">Selected range:</span>
              <span class="font-semibold text-(--s-text-primary)">
                ${{ priceRange.min }} – ${{ priceRange.max }}
              </span>
            </div>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Max Range Constraint -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Max Range Constraint</h2>
      <DemoSection
        title="Limited Selection Span"
        description="Limit the maximum span users can select. Handles can also swap positions when crossed."
        :code="maxRangeCode"
        language="vue"
      >
        <div class="p-6 rounded-xl bg-(--s-bg-primary) border border-(--s-border) max-w-md">
          <h3 class="text-lg font-semibold text-(--s-text-primary) mb-6">Budget Range (Max €500 span)</h3>
          
          <SProgressRange 
            v-model="limitedRange"
            range
            :min="0"
            :max="1500"
            :max-range="500"
            :step="10"
            show-value
            show-labels
            :value-format="(v) => `€${v}`"
            color="#10b981"
          />
          
          <div class="mt-6 pt-4 border-t border-(--s-border) space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span class="text-(--s-text-secondary)">Selected range:</span>
              <span class="font-semibold text-(--s-text-primary)">
                €{{ limitedRange.min }} – €{{ limitedRange.max }}
              </span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-(--s-text-secondary)">Span:</span>
              <span class="font-semibold text-emerald-400">
                €{{ limitedRange.max - limitedRange.min }}
              </span>
            </div>
            <p class="text-xs text-(--s-text-tertiary) mt-2">
              💡 Try dragging one handle past the other - they'll swap positions!
            </p>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Range with Marks -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Range with Marks</h2>
      <DemoSection
        title="Custom Tick Marks"
        description="Display custom marks at specific values."
        :code="marksCode"
        language="vue"
      >
        <div class="max-w-lg">
          <SProgressRange 
            v-model="singleSlider"
            :marks="[
              { value: 0, label: 'Cold' },
              { value: 25, label: 'Cool' },
              { value: 50, label: 'Warm' },
              { value: 75, label: 'Hot' },
              { value: 100, label: 'Extreme' }
            ]"
            show-ticks
            color="#ef4444"
          />
        </div>
      </DemoSection>
    </section>

    <!-- Live Demo -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Live Demo</h2>
      <DemoSection
        title="Animated Progress Simulation"
        description="See the progress bar in action with live updates."
        :code="liveCode"
        language="vue"
      >
        <div class="space-y-6 max-w-lg">
          <SProgress 
            v-model="animatedProgress"
            variant="gradient"
            :gradient-colors="['#06b6d4', '#3b82f6', '#8b5cf6']"
            size="large"
            show-value
            value-position="inside"
            animated
            animation-type="shimmer"
            label="Processing..."
          />
          
          <div class="flex gap-3">
            <SButton 
              :disabled="isRunning"
              @click="startSimulation"
              icon-left="play"
              color="#10b981"
            >
              Start
            </SButton>
            <SButton 
              :disabled="!isRunning"
              @click="stopSimulation"
              icon-left="stop"
              color="#ef4444"
            >
              Stop
            </SButton>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- API Reference -->
    <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">API Reference</h2>
    <SApiSection>
      <SApiTable
        title="SProgress Props"
        type="props"
        :props="([
          { name: 'modelValue', type: 'number', default: '0', description: 'Current progress value', category: 'Core' },
          { name: 'min', type: 'number', default: '0', description: 'Minimum value', category: 'Core' },
          { name: 'max', type: 'number', default: '100', description: 'Maximum value', category: 'Core' },
          { name: 'variant', type: 'string', default: '\'default\'', description: 'Visual style: default, gradient, striped, buffer, segments, liquid', category: 'Visual' },
          { name: 'size', type: 'string', default: '\'medium\'', description: 'Size: xs, small, medium, large, xl', category: 'Visual' },
          { name: 'orientation', type: 'string', default: '\'horizontal\'', description: 'Orientation: horizontal or vertical', category: 'Visual' },
          { name: 'rounded', type: 'string', default: '\'full\'', description: 'Border radius: none, sm, md, lg, full', category: 'Visual' },
          { name: 'color', type: 'string', default: 'var(--s-primary)', description: 'Fill color', category: 'Visual' },
          { name: 'trackColor', type: 'string', default: 'var(--s-bg-tertiary)', description: 'Track background color', category: 'Visual' },
          { name: 'gradientColors', type: 'string[]', default: '[\'#06b6d4\', \'#3b82f6\', \'#8b5cf6\']', description: 'Colors for gradient variant', category: 'Visual' },
          { name: 'bufferValue', type: 'number', default: '0', description: 'Buffer progress value (buffer variant)', category: 'Buffer' },
          { name: 'bufferColor', type: 'string', default: 'var(--s-primary-alpha)', description: 'Buffer fill color', category: 'Buffer' },
          { name: 'segments', type: 'number', default: '5', description: 'Number of segments (segments variant)', category: 'Segments' },
          { name: 'segmentGap', type: 'number', default: '3', description: 'Gap between segments in pixels', category: 'Segments' },
          { name: 'animated', type: 'boolean', default: 'false', description: 'Enable animation', category: 'Animation' },
          { name: 'animationType', type: 'string', default: '\'none\'', description: 'Animation type: pulse, wave, shimmer, bounce, flow', category: 'Animation' },
          { name: 'animationSpeed', type: 'string', default: '\'normal\'', description: 'Animation speed: slow, normal, fast', category: 'Animation' },
          { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Show indeterminate animation', category: 'Animation' },
          { name: 'showValue', type: 'boolean', default: 'false', description: 'Display progress value', category: 'Display' },
          { name: 'valuePosition', type: 'string', default: '\'outside\'', description: 'Value position: inside, outside, top, tooltip', category: 'Display' },
          { name: 'valueFormat', type: 'function', default: 'undefined', description: 'Custom value formatter function', category: 'Display' },
          { name: 'label', type: 'string', default: 'undefined', description: 'Label text', category: 'Display' },
          { name: 'labelPosition', type: 'string', default: '\'top\'', description: 'Label position: top, bottom, left, right', category: 'Display' },
          { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the progress bar', category: 'State' }
        ] as ApiProp[])"
      />

      <SApiTable
        title="SProgressRange Props"
        type="props"
        :props="([
          { name: 'modelValue', type: 'number | RangeValue', default: '0', description: 'Current value or { min, max } for range mode', category: 'Core' },
          { name: 'min', type: 'number', default: '0', description: 'Minimum value', category: 'Core' },
          { name: 'max', type: 'number', default: '100', description: 'Maximum value', category: 'Core' },
          { name: 'step', type: 'number', default: '1', description: 'Step increment', category: 'Core' },
          { name: 'range', type: 'boolean', default: 'false', description: 'Enable dual-handle range mode', category: 'Core' },
          { name: 'size', type: 'string', default: '\'medium\'', description: 'Size: small, medium, large', category: 'Visual' },
          { name: 'orientation', type: 'string', default: '\'horizontal\'', description: 'Orientation: horizontal or vertical', category: 'Visual' },
          { name: 'color', type: 'string', default: 'var(--s-primary)', description: 'Active track and handle color', category: 'Visual' },
          { name: 'trackColor', type: 'string', default: 'var(--s-bg-tertiary)', description: 'Track background color', category: 'Visual' },
          { name: 'showValue', type: 'boolean', default: 'false', description: 'Show current value(s) above slider', category: 'Display' },
          { name: 'showTooltip', type: 'boolean', default: 'true', description: 'Show tooltip on hover/drag', category: 'Display' },
          { name: 'showTicks', type: 'boolean', default: 'false', description: 'Show tick marks', category: 'Display' },
          { name: 'tickCount', type: 'number', default: '5', description: 'Number of tick marks', category: 'Display' },
          { name: 'showLabels', type: 'boolean', default: 'false', description: 'Show min/max labels', category: 'Display' },
          { name: 'valueFormat', type: 'function', default: 'undefined', description: 'Custom value formatter', category: 'Display' },
          { name: 'label', type: 'string', default: 'undefined', description: 'Label text', category: 'Display' },
          { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable interaction', category: 'State' },
          { name: 'readonly', type: 'boolean', default: 'false', description: 'Make read-only', category: 'State' },
          { name: 'pushable', type: 'number', default: '0', description: 'Minimum distance between handles in range mode', category: 'Behavior' },
          { name: 'maxRange', type: 'number', default: 'undefined', description: 'Maximum distance between handles in range mode', category: 'Behavior' },
          { name: 'swappable', type: 'boolean', default: 'true', description: 'Allow handles to swap positions when crossing', category: 'Behavior' },
          { name: 'lazy', type: 'boolean', default: 'false', description: 'Only emit value on drag end', category: 'Behavior' },
          { name: 'marks', type: 'array', default: 'undefined', description: 'Custom marks: [{ value, label }]', category: 'Display' }
        ] as ApiProp[])"
      />

      <SApiTable
        title="SProgress Events"
        type="events"
        :events="([
          { name: 'update:modelValue', payload: 'number', description: 'Emitted when value changes' }
        ] as ApiEvent[])"
      />

      <SApiTable
        title="SProgressRange Events"
        type="events"
        :events="([
          { name: 'update:modelValue', payload: 'number | RangeValue', description: 'Emitted when value changes' },
          { name: 'change', payload: 'number | RangeValue', description: 'Emitted when value changes (on interaction end if lazy)' },
          { name: 'drag-start', payload: '\'min\' | \'max\' | \'single\'', description: 'Emitted when drag starts' },
          { name: 'drag-end', payload: 'number | RangeValue', description: 'Emitted when drag ends' }
        ] as ApiEvent[])"
      />

      <SApiTable
        title="SProgress Slots"
        type="slots"
        :slots="([
          { name: 'default', props: '{ value, percentage }', description: 'Custom content inside the progress bar' }
        ] as ApiSlot[])"
      />
    </SApiSection>
  </div>
</template>
