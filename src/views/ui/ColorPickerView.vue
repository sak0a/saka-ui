<script setup lang="ts">
import { ref } from 'vue'
import { SColorPicker, SApiSection, SApiTable } from '../../index'
import type { ApiProp, ApiEvent, ApiSlot } from '../../index'
import DemoSection from '../../components/DemoSection.vue'

// Demo state
const basicColor = ref('#3b82f6')
const dropdownColor = ref('#10b981')
const alphaColor = ref('#ec489980')
const formatHex = ref('#8b5cf6')
const formatRgb = ref('#f59e0b')
const formatHsl = ref('#06b6d4')
const presetColor = ref('#ef4444')
const sizeSmall = ref('#3b82f6')
const sizeMedium = ref('#10b981')
const sizeLarge = ref('#f59e0b')
const disabledColor = ref('#6b7280')
const readonlyColor = ref('#8b5cf6')

// Minimal configurations
const minimalColor = ref('#3b82f6')
const spectrumOnlyColor = ref('#ef4444')
const noPresetsColor = ref('#10b981')
const compactColor = ref('#f59e0b')

// Custom trigger
const customTriggerColor = ref('#8b5cf6')
const iconTriggerColor = ref('#ef4444')
const textTriggerColor = ref('#10b981')

// Theme customizer
const primaryColor = ref('#3b82f6')
const secondaryColor = ref('#10b981')
const accentColor = ref('#f59e0b')
const backgroundColor = ref('#1a1a2e')

// Custom presets
const customPresets = [
  '#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff',
  '#5f27cd', '#00d2d3', '#1dd1a1', '#ff9f43', '#ee5a24'
]

// Code snippets
const basicCode = `<script setup>
import { ref } from 'vue'
const color = ref('#3b82f6')
<\/script>

<template>
  <SColorPicker v-model="color" />
</template>`

const dropdownCode = `<SColorPicker 
  v-model="color" 
  mode="dropdown"
  label="Select Color"
/>`

const customTriggerCode = `<!-- Custom button trigger -->
<SColorPicker v-model="color" mode="dropdown">
  <template #trigger="{ color, displayValue, isOpen }">
    <button class="my-custom-button">
      <span :style="{ backgroundColor: color }"></span>
      Pick a color
    </button>
  </template>
</SColorPicker>

<!-- Icon-only trigger -->
<SColorPicker v-model="color" mode="dropdown">
  <template #trigger="{ color }">
    <div 
      class="w-10 h-10 rounded-full border-2 cursor-pointer"
      :style="{ backgroundColor: color }"
    />
  </template>
</SColorPicker>

<!-- Text link trigger -->
<SColorPicker v-model="color" mode="dropdown">
  <template #trigger="{ displayValue }">
    <span class="underline cursor-pointer">
      Color: {{ displayValue }}
    </span>
  </template>
</SColorPicker>`

const alphaCode = `<SColorPicker 
  v-model="color" 
  :show-alpha="true"
/>`

const formatsCode = `<!-- HEX output (default) -->
<SColorPicker v-model="hexColor" format="hex" />

<!-- RGB output -->
<SColorPicker v-model="rgbColor" format="rgb" />

<!-- HSL output -->
<SColorPicker v-model="hslColor" format="hsl" />`

const presetsCode = `<SColorPicker 
  v-model="color"
  :presets="[
    '#ff6b6b', '#feca57', '#48dbfb', 
    '#ff9ff3', '#54a0ff', '#5f27cd'
  ]"
/>`

const sizesCode = `<SColorPicker v-model="color" size="small" />
<SColorPicker v-model="color" size="medium" />
<SColorPicker v-model="color" size="large" />`

const statesCode = `<SColorPicker v-model="color" disabled />
<SColorPicker v-model="color" readonly />`

const minimalCode = `<!-- Spectrum only - no sliders, preview, inputs, or presets -->
<SColorPicker 
  v-model="color" 
  :show-sliders="false"
  :show-preview="false"
  :show-inputs="false"
  :show-presets="false"
  :show-recent="false"
/>

<!-- No preview bar -->
<SColorPicker 
  v-model="color" 
  :show-preview="false"
/>

<!-- No presets or recent -->
<SColorPicker 
  v-model="color" 
  :show-presets="false"
  :show-recent="false"
/>

<!-- Compact: spectrum + sliders only -->
<SColorPicker 
  v-model="color" 
  :show-preview="false"
  :show-inputs="false"
  :show-presets="false"
  :show-recent="false"
  size="small"
/>`

const themeCode = `<script setup>
const primary = ref('#3b82f6')
const secondary = ref('#10b981')
const accent = ref('#f59e0b')
const background = ref('#1a1a2e')
<\/script>

<template>
  <div class="theme-panel">
    <SColorPicker v-model="primary" label="Primary" mode="dropdown" />
    <SColorPicker v-model="secondary" label="Secondary" mode="dropdown" />
    <SColorPicker v-model="accent" label="Accent" mode="dropdown" />
    <SColorPicker v-model="background" label="Background" mode="dropdown" />
  </div>
</template>`

// API Reference data
const colorPickerProps: ApiProp[] = [
  { name: 'modelValue', type: 'string', default: "'#3b82f6'", description: 'v-model color value (HEX, RGB, or HSL string)', category: 'Core' },
  { name: 'mode', type: "'inline' | 'dropdown'", default: "'inline'", description: 'Display mode (inline or dropdown popup)', category: 'Core' },
  { name: 'format', type: "'hex' | 'rgb' | 'hsl'", default: "'hex'", description: 'Output color format for v-model', category: 'Core' },
  { name: 'size', type: "'small' | 'medium' | 'large'", default: "'medium'", description: 'Component size (affects panel width & heights)', category: 'Core' },
  { name: 'label', type: 'string', default: 'undefined', description: 'Label text above picker', category: 'Core' },
  { name: 'triggerStyle', type: "'button' | 'swatch'", default: "'button'", description: 'Built-in trigger style (ignored when using #trigger slot)', category: 'Dropdown Mode' },
  { name: 'dropdownPlacement', type: "'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'", default: "'bottom-start'", description: 'Position of the dropdown panel', category: 'Dropdown Mode' },
  { name: 'showSpectrum', type: 'boolean', default: 'true', description: 'Show the 2D saturation/brightness picker', category: 'Show/Hide Features' },
  { name: 'showSliders', type: 'boolean', default: 'true', description: 'Show hue and alpha sliders', category: 'Show/Hide Features' },
  { name: 'showAlpha', type: 'boolean', default: 'false', description: 'Show alpha/opacity slider', category: 'Show/Hide Features' },
  { name: 'showPreview', type: 'boolean', default: 'true', description: 'Show the color preview bar', category: 'Show/Hide Features' },
  { name: 'showInputs', type: 'boolean', default: 'true', description: 'Show color value input fields', category: 'Show/Hide Features' },
  { name: 'showPresets', type: 'boolean', default: 'true', description: 'Show preset color swatches', category: 'Show/Hide Features' },
  { name: 'showRecent', type: 'boolean', default: 'true', description: 'Show recently used colors', category: 'Show/Hide Features' },
  { name: 'showEyeDropper', type: 'boolean', default: 'true', description: 'Show eyedropper button (if browser supports it)', category: 'Show/Hide Features' },
  { name: 'presets', type: 'string[]', default: 'Default palette', description: 'Custom preset colors array', category: 'Data' },
  { name: 'maxRecent', type: 'number', default: '8', description: 'Maximum number of recent colors to store', category: 'Data' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable all interactions', category: 'States' },
  { name: 'readonly', type: 'boolean', default: 'false', description: 'Read-only mode (can view but not change)', category: 'States' },
]

const colorPickerEvents: ApiEvent[] = [
  { name: 'update:modelValue', payload: 'string', description: 'Emitted when color changes (for v-model)' },
  { name: 'change', payload: 'string', description: 'Emitted after user commits a color' },
  { name: 'input', payload: 'string', description: 'Emitted during color selection (while dragging)' },
]

const colorPickerSlots: ApiSlot[] = [
  { name: '#trigger', props: 'color, displayValue, isOpen, toggle, rgb, hsl, disabled', description: 'Custom trigger element for dropdown mode' },
]
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-(--s-text-primary) mb-2">Color Picker</h1>
      <p class="text-lg text-(--s-text-secondary)">A stunning, feature-rich color picker with multiple formats, presets, and advanced customization.</p>
    </header>

        <!-- Features -->
        <article>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4">Features</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="p-4 rounded-xl bg-(--s-bg-secondary) border border-(--s-border)">
              <div class="flex items-center gap-3 mb-2">
                <span class="mdi mdi-palette text-xl text-emerald-400"></span>
                <span class="font-semibold text-(--s-text-primary)">Color Spectrum</span>
              </div>
              <p class="text-sm text-(--s-text-secondary)">2D picker for saturation and brightness with smooth gradients.</p>
            </div>
            <div class="p-4 rounded-xl bg-(--s-bg-secondary) border border-(--s-border)">
              <div class="flex items-center gap-3 mb-2">
                <span class="mdi mdi-tune text-xl text-blue-400"></span>
                <span class="font-semibold text-(--s-text-primary)">Hue & Alpha Sliders</span>
              </div>
              <p class="text-sm text-(--s-text-secondary)">Dedicated sliders for hue and optional transparency.</p>
            </div>
            <div class="p-4 rounded-xl bg-(--s-bg-secondary) border border-(--s-border)">
              <div class="flex items-center gap-3 mb-2">
                <span class="mdi mdi-eyedropper text-xl text-violet-400"></span>
                <span class="font-semibold text-(--s-text-primary)">Eyedropper Tool</span>
              </div>
              <p class="text-sm text-(--s-text-secondary)">Pick colors directly from anywhere on your screen.</p>
            </div>
            <div class="p-4 rounded-xl bg-(--s-bg-secondary) border border-(--s-border)">
              <div class="flex items-center gap-3 mb-2">
                <span class="mdi mdi-content-copy text-xl text-amber-400"></span>
                <span class="font-semibold text-(--s-text-primary)">Copy to Clipboard</span>
              </div>
              <p class="text-sm text-(--s-text-secondary)">One-click copy of the color value in any format.</p>
            </div>
            <div class="p-4 rounded-xl bg-(--s-bg-secondary) border border-(--s-border)">
              <div class="flex items-center gap-3 mb-2">
                <span class="mdi mdi-swap-horizontal text-xl text-pink-400"></span>
                <span class="font-semibold text-(--s-text-primary)">Format Switching</span>
              </div>
              <p class="text-sm text-(--s-text-secondary)">Toggle between HEX, RGB, and HSL formats.</p>
            </div>
            <div class="p-4 rounded-xl bg-(--s-bg-secondary) border border-(--s-border)">
              <div class="flex items-center gap-3 mb-2">
                <span class="mdi mdi-history text-xl text-cyan-400"></span>
                <span class="font-semibold text-(--s-text-primary)">Recent Colors</span>
              </div>
              <p class="text-sm text-(--s-text-secondary)">Remembers your recently used colors for quick access.</p>
            </div>
            <div class="p-4 rounded-xl bg-(--s-bg-secondary) border border-(--s-border)">
              <div class="flex items-center gap-3 mb-2">
                <span class="mdi mdi-gesture-tap text-xl text-orange-400"></span>
                <span class="font-semibold text-(--s-text-primary)">Touch Support</span>
              </div>
              <p class="text-sm text-(--s-text-secondary)">Full touch support for mobile devices and tablets.</p>
            </div>
            <div class="p-4 rounded-xl bg-(--s-bg-secondary) border border-(--s-border)">
              <div class="flex items-center gap-3 mb-2">
                <span class="mdi mdi-puzzle text-xl text-rose-400"></span>
                <span class="font-semibold text-(--s-text-primary)">Custom Triggers</span>
              </div>
              <p class="text-sm text-(--s-text-secondary)">Use any element as dropdown trigger with the #trigger slot.</p>
            </div>
            <div class="p-4 rounded-xl bg-(--s-bg-secondary) border border-(--s-border)">
              <div class="flex items-center gap-3 mb-2">
                <span class="mdi mdi-responsive text-xl text-teal-400"></span>
                <span class="font-semibold text-(--s-text-primary)">Responsive</span>
              </div>
              <p class="text-sm text-(--s-text-secondary)">Adapts beautifully to any screen size.</p>
            </div>
          </div>
        </article>

    <!-- Basic Usage -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Basic Usage</h2>
      <DemoSection 
        title="Inline Color Picker"
        description="The default inline mode displays the full color picker panel."
        :code="basicCode"
        language="vue"
      >
        <div class="flex flex-col gap-4">
          <SColorPicker v-model="basicColor" />
          <div class="flex items-center gap-3">
            <span class="text-sm text-(--s-text-secondary)">Selected:</span>
            <div 
              class="w-8 h-8 rounded-lg border border-(--s-border)"
              :style="{ backgroundColor: basicColor }"
            ></div>
            <code class="font-mono text-emerald-400">{{ basicColor }}</code>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Dropdown Mode -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Dropdown Mode</h2>
      <DemoSection 
        title="Trigger Button with Popup"
        description="Use dropdown mode to show the picker in a popup triggered by a button."
        :code="dropdownCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-6 items-start">
          <SColorPicker v-model="dropdownColor" mode="dropdown" label="Choose Color" />
          <div class="flex items-center gap-3">
            <span class="text-sm text-(--s-text-secondary)">Value:</span>
            <code class="font-mono text-emerald-400">{{ dropdownColor }}</code>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Custom Triggers -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Custom Triggers</h2>
      <DemoSection 
        title="Any Element as Trigger"
        description="Use the #trigger slot to make any element open the color picker. The slot provides color, displayValue, rgb, hsl, isOpen, toggle, and disabled props."
        :code="customTriggerCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-8 items-center">
          <!-- Custom button trigger -->
          <div class="flex flex-col gap-2">
            <span class="text-xs font-semibold text-(--s-text-secondary)">Custom Button</span>
            <SColorPicker v-model="customTriggerColor" mode="dropdown">
              <template #trigger="{ color, isOpen }">
                <button 
                  class="flex items-center gap-2 px-4 py-2 rounded-lg border border-(--s-border) bg-(--s-bg-secondary) hover:bg-(--s-bg-tertiary) transition-colors"
                  :class="{ 'ring-2 ring-(--s-primary)': isOpen }"
                >
                  <span 
                    class="w-5 h-5 rounded-md border border-(--s-border)"
                    :style="{ backgroundColor: color }"
                  ></span>
                  <span class="text-sm text-(--s-text-primary)">Pick a color</span>
                  <span class="mdi mdi-chevron-down text-(--s-text-tertiary)" :class="{ 'rotate-180': isOpen }"></span>
                </button>
              </template>
            </SColorPicker>
          </div>

          <!-- Circle swatch trigger -->
          <div class="flex flex-col gap-2">
            <span class="text-xs font-semibold text-(--s-text-secondary)">Circle Swatch</span>
            <SColorPicker v-model="iconTriggerColor" mode="dropdown">
              <template #trigger="{ color, isOpen }">
                <div 
                  class="w-10 h-10 rounded-full border-2 border-white shadow-lg cursor-pointer transition-transform hover:scale-110"
                  :class="{ 'ring-2 ring-(--s-primary) ring-offset-2': isOpen }"
                  :style="{ backgroundColor: color }"
                ></div>
              </template>
            </SColorPicker>
          </div>

          <!-- Text link trigger -->
          <div class="flex flex-col gap-2">
            <span class="text-xs font-semibold text-(--s-text-secondary)">Text Link</span>
            <SColorPicker v-model="textTriggerColor" mode="dropdown">
              <template #trigger="{ displayValue, color }">
                <span class="text-sm underline cursor-pointer hover:text-(--s-primary) transition-colors">
                  Theme color: <code class="font-mono" :style="{ color: color }">{{ displayValue }}</code>
                </span>
              </template>
            </SColorPicker>
          </div>

          <!-- Icon button trigger -->
          <div class="flex flex-col gap-2">
            <span class="text-xs font-semibold text-(--s-text-secondary)">Icon Button</span>
            <SColorPicker v-model="customTriggerColor" mode="dropdown">
              <template #trigger="{ color, isOpen }">
                <button 
                  class="w-9 h-9 flex items-center justify-center rounded-lg border border-(--s-border) bg-(--s-bg-secondary) hover:bg-(--s-bg-tertiary) transition-colors"
                  :class="{ 'ring-2 ring-(--s-primary)': isOpen }"
                >
                  <span class="mdi mdi-palette text-lg" :style="{ color: color }"></span>
                </button>
              </template>
            </SColorPicker>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Alpha Channel -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Alpha Channel</h2>
      <DemoSection 
        title="Transparency Support"
        description="Enable the alpha slider for colors with transparency."
        :code="alphaCode"
        language="vue"
      >
        <div class="flex flex-col gap-4">
          <SColorPicker v-model="alphaColor" :show-alpha="true" />
          <div class="flex items-center gap-3">
            <span class="text-sm text-(--s-text-secondary)">With Alpha:</span>
            <div 
              class="w-8 h-8 rounded-lg border border-(--s-border) checkerboard"
            >
              <div 
                class="w-full h-full rounded-lg"
                :style="{ backgroundColor: alphaColor }"
              ></div>
            </div>
            <code class="font-mono text-emerald-400">{{ alphaColor }}</code>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Color Formats -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Color Formats</h2>
      <DemoSection 
        title="Output Formats"
        description="Choose between HEX, RGB, or HSL output formats."
        :code="formatsCode"
        language="vue"
      >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="flex flex-col gap-3">
            <span class="text-sm font-semibold text-(--s-text-primary)">HEX Format</span>
            <SColorPicker v-model="formatHex" format="hex" />
            <code class="font-mono text-xs text-violet-400 break-all">{{ formatHex }}</code>
          </div>
          <div class="flex flex-col gap-3">
            <span class="text-sm font-semibold text-(--s-text-primary)">RGB Format</span>
            <SColorPicker v-model="formatRgb" format="rgb" />
            <code class="font-mono text-xs text-amber-400 break-all">{{ formatRgb }}</code>
          </div>
          <div class="flex flex-col gap-3">
            <span class="text-sm font-semibold text-(--s-text-primary)">HSL Format</span>
            <SColorPicker v-model="formatHsl" format="hsl" />
            <code class="font-mono text-xs text-cyan-400 break-all">{{ formatHsl }}</code>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Custom Presets -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Custom Presets</h2>
      <DemoSection 
        title="Custom Color Swatches"
        description="Provide your own preset colors for quick selection."
        :code="presetsCode"
        language="vue"
      >
        <SColorPicker v-model="presetColor" :presets="customPresets" />
      </DemoSection>
    </section>

    <!-- Sizes -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Sizes</h2>
      <DemoSection 
        title="Size Variants"
        description="Three size options: small, medium (default), and large."
        :code="sizesCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-8 items-start">
          <div class="flex flex-col items-center gap-3">
            <SColorPicker v-model="sizeSmall" size="small" />
            <span class="text-xs font-mono text-(--s-text-secondary)">small</span>
          </div>
          <div class="flex flex-col items-center gap-3">
            <SColorPicker v-model="sizeMedium" size="medium" />
            <span class="text-xs font-mono text-(--s-text-secondary)">medium</span>
          </div>
          <div class="flex flex-col items-center gap-3">
            <SColorPicker v-model="sizeLarge" size="large" />
            <span class="text-xs font-mono text-(--s-text-secondary)">large</span>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- States -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">States</h2>
      <DemoSection 
        title="Disabled & Readonly"
        description="Disable interaction or make the picker read-only."
        :code="statesCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-8 items-start">
          <div class="flex flex-col gap-3">
            <span class="text-sm font-semibold text-(--s-text-primary)">Disabled</span>
            <SColorPicker v-model="disabledColor" disabled />
          </div>
          <div class="flex flex-col gap-3">
            <span class="text-sm font-semibold text-(--s-text-primary)">Readonly</span>
            <SColorPicker v-model="readonlyColor" readonly />
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Minimal Configurations -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Minimal Configurations</h2>
      <DemoSection 
        title="Customizable Feature Visibility"
        description="Hide specific parts of the color picker for a cleaner or more compact UI. Disable preview, inputs, presets, or even sliders based on your needs."
        :code="minimalCode"
        language="vue"
      >
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="flex flex-col gap-3">
            <span class="text-sm font-semibold text-(--s-text-primary)">Spectrum Only</span>
            <span class="text-xs text-(--s-text-secondary)">No sliders, preview, inputs, or presets</span>
            <SColorPicker 
              v-model="spectrumOnlyColor" 
              :show-sliders="false"
              :show-preview="false"
              :show-inputs="false"
              :show-presets="false"
              :show-recent="false"
            />
            <code class="font-mono text-xs text-red-400">{{ spectrumOnlyColor }}</code>
          </div>
          
          <div class="flex flex-col gap-3">
            <span class="text-sm font-semibold text-(--s-text-primary)">No Preview Bar</span>
            <span class="text-xs text-(--s-text-secondary)">Hides the color preview and tool buttons</span>
            <SColorPicker 
              v-model="minimalColor" 
              :show-preview="false"
            />
            <code class="font-mono text-xs text-blue-400">{{ minimalColor }}</code>
          </div>
          
          <div class="flex flex-col gap-3">
            <span class="text-sm font-semibold text-(--s-text-primary)">No Presets</span>
            <span class="text-xs text-(--s-text-secondary)">Hides preset swatches and recent colors</span>
            <SColorPicker 
              v-model="noPresetsColor" 
              :show-presets="false"
              :show-recent="false"
            />
            <code class="font-mono text-xs text-emerald-400">{{ noPresetsColor }}</code>
          </div>
          
          <div class="flex flex-col gap-3">
            <span class="text-sm font-semibold text-(--s-text-primary)">Compact Mode</span>
            <span class="text-xs text-(--s-text-secondary)">Small size with spectrum and sliders only</span>
            <SColorPicker 
              v-model="compactColor" 
              :show-preview="false"
              :show-inputs="false"
              :show-presets="false"
              :show-recent="false"
              size="small"
            />
            <code class="font-mono text-xs text-amber-400">{{ compactColor }}</code>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Real-World Example -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Real-World Example</h2>
      <DemoSection 
        title="Theme Customizer"
        description="A theme customization panel using multiple color pickers."
        :code="themeCode"
        language="vue"
      >
        <div class="flex flex-col md:flex-row gap-8">
          <!-- Color Pickers -->
          <div class="flex-1 space-y-4">
            <h3 class="font-semibold text-(--s-text-primary) mb-4">Theme Colors</h3>
            <div class="grid grid-cols-2 gap-4">
              <SColorPicker v-model="primaryColor" mode="dropdown" label="Primary" />
              <SColorPicker v-model="secondaryColor" mode="dropdown" label="Secondary" />
              <SColorPicker v-model="accentColor" mode="dropdown" label="Accent" />
              <SColorPicker v-model="backgroundColor" mode="dropdown" label="Background" />
            </div>
          </div>
          
          <!-- Preview -->
          <div class="flex-1">
            <h3 class="font-semibold text-(--s-text-primary) mb-4">Preview</h3>
            <div 
              class="rounded-xl p-6 transition-colors duration-300"
              :style="{ backgroundColor: backgroundColor }"
            >
              <div class="space-y-3">
                <div 
                  class="h-10 rounded-lg flex items-center justify-center text-white font-semibold text-sm"
                  :style="{ backgroundColor: primaryColor }"
                >
                  Primary Button
                </div>
                <div 
                  class="h-10 rounded-lg flex items-center justify-center text-white font-semibold text-sm"
                  :style="{ backgroundColor: secondaryColor }"
                >
                  Secondary Button
                </div>
                <div 
                  class="h-8 rounded-lg flex items-center justify-center text-black font-semibold text-sm"
                  :style="{ backgroundColor: accentColor }"
                >
                  Accent Element
                </div>
              </div>
            </div>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- API Reference -->
    <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">API Reference</h2>
    <SApiSection>
      <SApiTable title="Props" type="props" :props="colorPickerProps" />
      <SApiTable title="Slots" type="slots" :slots="colorPickerSlots" />
      <SApiTable title="Events" type="events" :events="colorPickerEvents" />
    </SApiSection>
  </div>
</template>

<style scoped>
.checkerboard {
  background-image: linear-gradient(45deg, #ccc 25%, transparent 25%),
                    linear-gradient(-45deg, #ccc 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #ccc 75%),
                    linear-gradient(-45deg, transparent 75%, #ccc 75%);
  background-size: 8px 8px;
  background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
}
</style>
