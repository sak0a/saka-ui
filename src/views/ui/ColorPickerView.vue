<script setup lang="ts">
import { ref } from 'vue'
import {
  SColorPicker,
  SColorPickerSpectrum,
  SColorPickerHueSlider,
  SColorPickerAlphaSlider,
  SColorPickerPreview,
  SColorPickerEyeDropper,
  SColorPickerCopy,
  SColorPickerInputs,
  SColorPickerPresets,
  SColorPickerRecent,
  SApiSection,
  SApiTable
} from '../../index'
import type { ApiProp, ApiEvent, ApiSlot } from '../../index'
import DemoSection from '../../components/DemoSection.vue'

// Demo state
const basicColor = ref('#3b82f6')
const compoundColor = ref('#10b981')
const spectrumOnlyColor = ref('#ef4444')
const slidersOnlyColor = ref('#8b5cf6')
const customLayoutColor = ref('#f59e0b')
const presetsOnlyColor = ref('#06b6d4')
const dropdownColor = ref('#10b981')
const alphaColor = ref('#ec489980')
const formatHex = ref('#8b5cf6')
const formatRgb = ref('#f59e0b')
const formatHsl = ref('#06b6d4')
const sizeSmall = ref('#3b82f6')
const sizeMedium = ref('#10b981')
const sizeLarge = ref('#f59e0b')
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

const brandPresets = [
  '#1DA1F2', '#4267B2', '#E4405F', '#FF0000',
  '#25D366', '#7289DA', '#FF4500', '#1DB954'
]

// Code snippets
const basicCode = `<SColorPicker v-model="basicColor" />`

const compoundBasicCode = `<SColorPicker v-model="compoundColor" :show-alpha="true">
  <SColorPickerSpectrum />
  <SColorPickerHueSlider />
  <SColorPickerAlphaSlider />
  <div class="flex items-center gap-3">
    <SColorPickerPreview />
    <div class="flex gap-1">
      <SColorPickerEyeDropper />
      <SColorPickerCopy />
    </div>
  </div>
  <SColorPickerInputs />
  <SColorPickerPresets />
  <SColorPickerRecent />
</SColorPicker>`

const spectrumOnlyCode = `<SColorPicker v-model="spectrumOnlyColor">
  <SColorPickerSpectrum />
</SColorPicker>`

const slidersOnlyCode = `<SColorPicker v-model="slidersOnlyColor" :show-alpha="true">
  <SColorPickerHueSlider />
  <SColorPickerAlphaSlider />
  <SColorPickerInputs />
</SColorPicker>`

const customLayoutCode = `<SColorPicker v-model="customLayoutColor">
  <SColorPickerPresets :presets="brandPresets" label="Brand Colors" />
  <SColorPickerSpectrum />
  <SColorPickerHueSlider />
  <div class="flex items-center gap-3">
    <SColorPickerPreview />
    <SColorPickerCopy />
  </div>
</SColorPicker>`

const presetsOnlyCode = `<SColorPicker v-model="presetsOnlyColor">
  <SColorPickerPresets :presets="customPresets" label="Pick a color" />
  <div class="flex items-center gap-3">
    <SColorPickerPreview />
    <SColorPickerCopy />
  </div>
  <SColorPickerRecent />
</SColorPicker>`

const dropdownCode = `<SColorPicker v-model="dropdownColor" mode="dropdown" label="Choose Color" />`

const customTriggerCode = `<!-- Custom Button -->
<SColorPicker v-model="customTriggerColor" mode="dropdown">
  <template #trigger="{ color, isOpen }">
    <button
      class="flex items-center gap-2 px-4 py-2 rounded-lg border"
      :class="{ 'ring-2 ring-(--s-primary)': isOpen }"
    >
      <span class="w-5 h-5 rounded-md border" :style="{ backgroundColor: color }"></span>
      <span class="text-sm">Pick a color</span>
    </button>
  </template>
</SColorPicker>

<!-- Circle Swatch -->
<SColorPicker v-model="iconTriggerColor" mode="dropdown">
  <template #trigger="{ color, isOpen }">
    <div
      class="w-10 h-10 rounded-full border-2 border-white shadow-lg cursor-pointer"
      :class="{ 'ring-2 ring-(--s-primary) ring-offset-2': isOpen }"
      :style="{ backgroundColor: color }"
    ></div>
  </template>
</SColorPicker>

<!-- Text Link -->
<SColorPicker v-model="textTriggerColor" mode="dropdown">
  <template #trigger="{ displayValue, color }">
    <span class="text-sm underline cursor-pointer">
      Theme color: <code class="font-mono" :style="{ color: color }">{{ displayValue }}</code>
    </span>
  </template>
</SColorPicker>`

const alphaCode = `<SColorPicker v-model="alphaColor" :show-alpha="true" />`

const formatsCode = `<SColorPicker v-model="formatHex" format="hex" />
<SColorPicker v-model="formatRgb" format="rgb" />
<SColorPicker v-model="formatHsl" format="hsl" />`

const sizesCode = `<SColorPicker v-model="sizeSmall" size="small" />
<SColorPicker v-model="sizeMedium" size="medium" />
<SColorPicker v-model="sizeLarge" size="large" />`

const themeCustomizerCode = `<SColorPicker v-model="primaryColor" mode="dropdown" label="Primary" />
<SColorPicker v-model="secondaryColor" mode="dropdown" label="Secondary" />
<SColorPicker v-model="accentColor" mode="dropdown" label="Accent" />
<SColorPicker v-model="backgroundColor" mode="dropdown" label="Background" />`

// API Reference data
const colorPickerProps: ApiProp[] = [
  { name: 'modelValue', type: 'string', default: "'#3b82f6'", description: 'v-model color value (HEX, RGB, or HSL string)', category: 'Core' },
  { name: 'mode', type: "'inline' | 'dropdown'", default: "'inline'", description: 'Display mode (inline or dropdown popup)', category: 'Core' },
  { name: 'format', type: "'hex' | 'rgb' | 'hsl'", default: "'hex'", description: 'Output color format for v-model', category: 'Core' },
  { name: 'size', type: "'small' | 'medium' | 'large'", default: "'medium'", description: 'Component size (affects panel width & heights)', category: 'Core' },
  { name: 'label', type: 'string', default: 'undefined', description: 'Label text above picker', category: 'Core' },
  { name: 'triggerStyle', type: "'button' | 'swatch'", default: "'button'", description: 'Built-in trigger style (simple API only)', category: 'Simple API' },
  { name: 'showSpectrum', type: 'boolean', default: 'true', description: 'Show the 2D saturation/brightness picker (simple API)', category: 'Simple API' },
  { name: 'showSliders', type: 'boolean', default: 'true', description: 'Show hue and alpha sliders (simple API)', category: 'Simple API' },
  { name: 'showAlpha', type: 'boolean', default: 'false', description: 'Show alpha/opacity slider', category: 'Core' },
  { name: 'showPreview', type: 'boolean', default: 'true', description: 'Show the color preview bar (simple API)', category: 'Simple API' },
  { name: 'showInputs', type: 'boolean', default: 'true', description: 'Show color value input fields (simple API)', category: 'Simple API' },
  { name: 'showPresets', type: 'boolean', default: 'true', description: 'Show preset color swatches (simple API)', category: 'Simple API' },
  { name: 'showRecent', type: 'boolean', default: 'true', description: 'Show recently used colors (simple API)', category: 'Simple API' },
  { name: 'showEyeDropper', type: 'boolean', default: 'true', description: 'Show eyedropper button (simple API)', category: 'Simple API' },
  { name: 'presets', type: 'string[]', default: 'Default palette', description: 'Custom preset colors (simple API)', category: 'Simple API' },
  { name: 'maxRecent', type: 'number', default: '8', description: 'Maximum number of recent colors to store', category: 'Core' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable all interactions', category: 'States' },
  { name: 'readonly', type: 'boolean', default: 'false', description: 'Read-only mode', category: 'States' },
]

const presetsProps: ApiProp[] = [
  { name: 'presets', type: 'string[]', default: 'Default palette', description: 'Array of color strings to display as swatches', category: 'Core' },
  { name: 'label', type: 'string', default: "'Presets'", description: 'Label text above the swatches', category: 'Core' },
]

const recentProps: ApiProp[] = [
  { name: 'label', type: 'string', default: "'Recent'", description: 'Label text above the recent colors', category: 'Core' },
]

const colorPickerEvents: ApiEvent[] = [
  { name: 'update:modelValue', payload: 'string', description: 'Emitted when color changes (for v-model)' },
  { name: 'change', payload: 'string', description: 'Emitted after user commits a color' },
  { name: 'input', payload: 'string', description: 'Emitted during color selection (while dragging)' },
]

const colorPickerSlots: ApiSlot[] = [
  { name: 'default', props: 'color, rgb, hsl, displayValue, hsva', description: 'Compound API: place subcomponents here for full layout control' },
  { name: 'trigger', props: 'color, displayValue, isOpen, toggle, rgb, hsl, disabled', description: 'Custom trigger element for dropdown mode' },
  { name: 'panel-before', props: '-', description: 'Content before the panel sections (simple API)' },
  { name: 'panel-after', props: '-', description: 'Content after the panel sections (simple API)' },
]

const eyeDropperSlots: ApiSlot[] = [
  { name: 'default', props: '-', description: 'Replace the default eyedropper icon content' }
]

const copySlots: ApiSlot[] = [
  { name: 'default', props: '{ copied }', description: 'Replace the copy button content and react to copied state' }
]
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- @component SColorPicker -->
    <!-- @props modelValue, mode, format, size, label, triggerStyle, showSpectrum, showSliders, showAlpha, showPreview, showInputs, showPresets, showRecent, showEyeDropper, presets, maxRecent, disabled, readonly -->
    <!-- @events update:modelValue, change, input -->
    <!-- @slots default, trigger, panel-before, panel-after -->
    <!-- @sections compound-api, custom-compositions, simple-api, dropdown-mode, custom-triggers, alpha-channel, color-formats, sizes, real-world-example, api-reference -->
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-(--s-text-primary) mb-2">Color Picker</h1>
      <p class="text-lg text-(--s-text-secondary)">A composable, feature-rich color picker with compound subcomponents for full layout control.</p>
    </header>

    <!-- Compound API: Full -->
    <section id="compound-api">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Compound API</h2>
      <DemoSection
        title="Full Compound Layout"
        description="Use subcomponents for complete control over which parts appear and their arrangement. This is the recommended API for custom layouts."
        :code="compoundBasicCode"
        language="vue"
      >
        <div class="flex flex-col gap-4">
          <SColorPicker v-model="compoundColor" :show-alpha="true">
            <SColorPickerSpectrum />
            <SColorPickerHueSlider />
            <SColorPickerAlphaSlider />
            <div class="flex items-center gap-3">
              <SColorPickerPreview />
              <div class="flex gap-1">
                <SColorPickerEyeDropper />
                <SColorPickerCopy />
              </div>
            </div>
            <SColorPickerInputs />
            <SColorPickerPresets />
            <SColorPickerRecent />
          </SColorPicker>
          <code class="font-mono text-xs text-emerald-400">{{ compoundColor }}</code>
        </div>
      </DemoSection>
    </section>

    <!-- Compound API: Spectrum Only -->
    <section id="custom-compositions">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Custom Compositions</h2>
      <DemoSection
        title="Spectrum Only"
        description="Just the 2D saturation/brightness picker — no sliders, inputs, or presets."
        :code="spectrumOnlyCode"
        language="vue"
      >
        <div class="flex flex-col gap-4">
          <SColorPicker v-model="spectrumOnlyColor">
            <SColorPickerSpectrum />
          </SColorPicker>
          <code class="font-mono text-xs text-red-400">{{ spectrumOnlyColor }}</code>
        </div>
      </DemoSection>
    </section>

    <!-- Compound API: Sliders + Inputs -->
    <section>
      <DemoSection
        title="Sliders + Inputs"
        description="Hue and alpha sliders with input fields — no spectrum or presets."
        :code="slidersOnlyCode"
        language="vue"
      >
        <div class="flex flex-col gap-4">
          <SColorPicker v-model="slidersOnlyColor" :show-alpha="true">
            <SColorPickerHueSlider />
            <SColorPickerAlphaSlider />
            <SColorPickerInputs />
          </SColorPicker>
          <code class="font-mono text-xs text-violet-400">{{ slidersOnlyColor }}</code>
        </div>
      </DemoSection>
    </section>

    <!-- Compound API: Custom Layout -->
    <section>
      <DemoSection
        title="Custom Arrangement"
        description="Presets on top, spectrum below — subcomponents can be arranged in any order."
        :code="customLayoutCode"
        language="vue"
      >
        <div class="flex flex-col gap-4">
          <SColorPicker v-model="customLayoutColor">
            <SColorPickerPresets :presets="brandPresets" label="Brand Colors" />
            <SColorPickerSpectrum />
            <SColorPickerHueSlider />
            <div class="flex items-center gap-3">
              <SColorPickerPreview />
              <SColorPickerCopy />
            </div>
          </SColorPicker>
          <code class="font-mono text-xs text-amber-400">{{ customLayoutColor }}</code>
        </div>
      </DemoSection>
    </section>

    <!-- Compound API: Presets Only -->
    <section>
      <DemoSection
        title="Presets-Only Picker"
        description="A minimal swatch grid — no spectrum or sliders at all."
        :code="presetsOnlyCode"
        language="vue"
      >
        <div class="flex flex-col gap-4">
          <SColorPicker v-model="presetsOnlyColor">
            <SColorPickerPresets :presets="customPresets" label="Pick a color" />
            <div class="flex items-center gap-3">
              <SColorPickerPreview />
              <SColorPickerCopy />
            </div>
            <SColorPickerRecent />
          </SColorPicker>
          <code class="font-mono text-xs text-cyan-400">{{ presetsOnlyColor }}</code>
        </div>
      </DemoSection>
    </section>

    <!-- Simple API -->
    <section id="simple-api">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Simple API</h2>
      <DemoSection
        title="Default Inline Picker"
        description="Without the default slot, the simple prop-based API renders all sections based on show* props."
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
    <section id="dropdown-mode">
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
    <section id="custom-triggers">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Custom Triggers</h2>
      <DemoSection
        title="Any Element as Trigger"
        description="Use the #trigger slot to make any element open the color picker."
        :code="customTriggerCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-8 items-center">
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
                </button>
              </template>
            </SColorPicker>
          </div>

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
        </div>
      </DemoSection>
    </section>

    <!-- Alpha Channel -->
    <section id="alpha-channel">
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
            <div class="w-8 h-8 rounded-lg border border-(--s-border) checkerboard">
              <div class="w-full h-full rounded-lg" :style="{ backgroundColor: alphaColor }"></div>
            </div>
            <code class="font-mono text-emerald-400">{{ alphaColor }}</code>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Color Formats -->
    <section id="color-formats">
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

    <!-- Sizes -->
    <section id="sizes">
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

    <!-- Real-World Example -->
    <section id="real-world-example">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Real-World Example</h2>
      <DemoSection
        title="Theme Customizer"
        description="A theme customization panel using multiple color pickers in dropdown mode."
        :code="themeCustomizerCode"
        language="vue"
      >
        <div class="flex flex-col md:flex-row gap-8">
          <div class="flex-1 space-y-4">
            <h3 class="font-semibold text-(--s-text-primary) mb-4">Theme Colors</h3>
            <div class="grid grid-cols-2 gap-4">
              <SColorPicker v-model="primaryColor" mode="dropdown" label="Primary" />
              <SColorPicker v-model="secondaryColor" mode="dropdown" label="Secondary" />
              <SColorPicker v-model="accentColor" mode="dropdown" label="Accent" />
              <SColorPicker v-model="backgroundColor" mode="dropdown" label="Background" />
            </div>
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-(--s-text-primary) mb-4">Preview</h3>
            <div class="rounded-xl p-6 transition-colors duration-300" :style="{ backgroundColor: backgroundColor }">
              <div class="space-y-3">
                <div class="h-10 rounded-lg flex items-center justify-center text-white font-semibold text-sm" :style="{ backgroundColor: primaryColor }">Primary Button</div>
                <div class="h-10 rounded-lg flex items-center justify-center text-white font-semibold text-sm" :style="{ backgroundColor: secondaryColor }">Secondary Button</div>
                <div class="h-8 rounded-lg flex items-center justify-center text-black font-semibold text-sm" :style="{ backgroundColor: accentColor }">Accent Element</div>
              </div>
            </div>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- API Reference -->
    <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">API Reference</h2>
    <SApiSection>
      <div class="space-y-8">
        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-eyedropper-variant text-(--s-primary)" />
            SColorPicker
          </h3>
          <SApiTable title="Props" type="props" :props="colorPickerProps" />
          <SApiTable title="Slots" type="slots" :slots="colorPickerSlots" class="mt-6" />
          <SApiTable title="Events" type="events" :events="colorPickerEvents" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-2">SColorPickerSpectrum</h3>
          <p class="text-sm text-(--s-text-secondary)">2D saturation/brightness surface used in compound layouts.</p>
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-2">SColorPickerHueSlider</h3>
          <p class="text-sm text-(--s-text-secondary)">Horizontal hue slider for shifting the current color across the 0–360 range.</p>
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-2">SColorPickerAlphaSlider</h3>
          <p class="text-sm text-(--s-text-secondary)">Optional alpha/opacity slider used when transparent colors are enabled.</p>
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-2">SColorPickerPreview</h3>
          <p class="text-sm text-(--s-text-secondary)">Preview swatch showing the current color, including checkerboard transparency feedback.</p>
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4">SColorPickerEyeDropper</h3>
          <p class="text-sm text-(--s-text-secondary) mb-4">Browser EyeDropper API trigger that automatically hides itself when the platform does not support eyedropper access.</p>
          <SApiTable title="Slots" type="slots" :slots="eyeDropperSlots" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4">SColorPickerCopy</h3>
          <p class="text-sm text-(--s-text-secondary) mb-4">Copy-to-clipboard action button with a temporary copied state for custom feedback.</p>
          <SApiTable title="Slots" type="slots" :slots="copySlots" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-2">SColorPickerInputs</h3>
          <p class="text-sm text-(--s-text-secondary)">HEX/RGB/HSL inputs with a built-in format toggle for direct value entry.</p>
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4">SColorPickerPresets</h3>
          <p class="text-sm text-(--s-text-secondary) mb-4">Preset swatch grid for offering a curated color palette alongside the picker.</p>
          <SApiTable title="Props" type="props" :props="presetsProps" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4">SColorPickerRecent</h3>
          <p class="text-sm text-(--s-text-secondary) mb-4">Recently used color list backed by the picker’s local history storage.</p>
          <SApiTable title="Props" type="props" :props="recentProps" />
        </div>
      </div>
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
