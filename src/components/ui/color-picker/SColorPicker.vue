<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, provide, useSlots } from 'vue'
import { SColorPickerContextKey, type SColorPickerContext } from './context'
import SColorPickerSpectrum from './SColorPickerSpectrum.vue'
import SColorPickerHueSlider from './SColorPickerHueSlider.vue'
import SColorPickerAlphaSlider from './SColorPickerAlphaSlider.vue'
import SColorPickerPreview from './SColorPickerPreview.vue'
import SColorPickerEyeDropper from './SColorPickerEyeDropper.vue'
import SColorPickerCopy from './SColorPickerCopy.vue'
import SColorPickerInputs from './SColorPickerInputs.vue'
import SColorPickerPresets from './SColorPickerPresets.vue'
import SColorPickerRecent from './SColorPickerRecent.vue'
import { cn } from '~/lib/utils'

defineOptions({ inheritAttrs: false })

// ──── Props ────
export interface Props {
  modelValue?: string
  mode?: 'inline' | 'dropdown'
  format?: 'hex' | 'rgb' | 'hsl'
  showAlpha?: boolean
  showSpectrum?: boolean
  showSliders?: boolean
  showPreview?: boolean
  showInputs?: boolean
  showPresets?: boolean
  presets?: string[]
  showEyeDropper?: boolean
  showRecent?: boolean
  maxRecent?: number
  size?: 'small' | 'medium' | 'large'
  triggerStyle?: 'button' | 'swatch'
  disabled?: boolean
  readonly?: boolean
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '#3b82f6',
  mode: 'inline',
  format: 'hex',
  showAlpha: false,
  showSpectrum: true,
  showSliders: true,
  showPreview: true,
  showInputs: true,
  showPresets: true,
  presets: () => [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
    '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
    '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#000000',
    '#ffffff', '#6b7280'
  ],
  showEyeDropper: true,
  showRecent: true,
  maxRecent: 8,
  size: 'medium',
  triggerStyle: 'button',
  disabled: false,
  readonly: false,
  label: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [value: string]
  'input': [value: string]
}>()

const slots = useSlots()

// ──── State ────
const isOpen = ref(false)
const activeFormat = ref<'hex' | 'rgb' | 'hsl'>('hex')
const recentColors = ref<string[]>([])

// Refs
const containerRef = ref<HTMLElement | null>(null)

// Internal color state (HSV + Alpha)
const hsva = ref({ h: 210, s: 76, v: 96, a: 1 })

// ──── Size configs ────
const sizeConfig = computed(() => ({
  small: {
    panelWidth: 'w-52 min-w-52 max-w-full',
    spectrumHeight: 'h-32',
    slider: 'h-3',
    swatch: 'w-5 h-5',
    input: 'text-xs px-2 py-1',
    label: 'text-xs'
  },
  medium: {
    panelWidth: 'w-72 min-w-64 max-w-full',
    spectrumHeight: 'h-44',
    slider: 'h-4',
    swatch: 'w-6 h-6',
    input: 'text-sm px-2.5 py-1.5',
    label: 'text-sm'
  },
  large: {
    panelWidth: 'w-80 min-w-72 max-w-full',
    spectrumHeight: 'h-52',
    slider: 'h-5',
    swatch: 'w-7 h-7',
    input: 'text-base px-3 py-2',
    label: 'text-base'
  }
}[props.size]))

// ──── Color conversions ────
function hexToRgb(hex: string): { r: number; g: number; b: number; a: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex)
  if (result) {
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
      a: result[4] ? parseInt(result[4], 16) / 255 : 1
    }
  }
  return { r: 0, g: 0, b: 0, a: 1 }
}

function rgbToHex(r: number, g: number, b: number, a?: number): string {
  const toHex = (n: number) => Math.round(n).toString(16).padStart(2, '0')
  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`
  if (a !== undefined && a < 1) {
    return hex + toHex(a * 255)
  }
  return hex
}

function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const d = max - min
  let h = 0
  const s = max === 0 ? 0 : d / max * 100
  const v = max * 100

  if (max !== min) {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h *= 60
  }
  return { h, s, v }
}

function hsvToRgb(h: number, s: number, v: number): { r: number; g: number; b: number } {
  s /= 100; v /= 100
  const c = v * s
  const x = c * (1 - Math.abs((h / 60) % 2 - 1))
  const m = v - c
  let r = 0, g = 0, b = 0

  if (h >= 0 && h < 60) { r = c; g = x; b = 0 }
  else if (h >= 60 && h < 120) { r = x; g = c; b = 0 }
  else if (h >= 120 && h < 180) { r = 0; g = c; b = x }
  else if (h >= 180 && h < 240) { r = 0; g = x; b = c }
  else if (h >= 240 && h < 300) { r = x; g = 0; b = c }
  else { r = c; g = 0; b = x }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  }
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

// ──── Computed values ────
const currentRgb = computed(() => {
  const rgb = hsvToRgb(hsva.value.h, hsva.value.s, hsva.value.v)
  return { ...rgb, a: hsva.value.a }
})

const currentHex = computed(() => {
  const { r, g, b } = currentRgb.value
  return rgbToHex(r, g, b, props.showAlpha ? hsva.value.a : undefined)
})

const currentHsl = computed(() => {
  const { r, g, b } = currentRgb.value
  return { ...rgbToHsl(r, g, b), a: hsva.value.a }
})

const displayValue = computed(() => {
  const { r, g, b, a } = currentRgb.value
  const { h, s, l } = currentHsl.value

  switch (activeFormat.value) {
    case 'rgb':
      return props.showAlpha
        ? `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`
        : `rgb(${r}, ${g}, ${b})`
    case 'hsl':
      return props.showAlpha
        ? `hsla(${h}, ${s}%, ${l}%, ${a.toFixed(2)})`
        : `hsl(${h}, ${s}%, ${l}%)`
    default:
      return currentHex.value.toUpperCase()
  }
})

const outputValue = computed(() => {
  const { r, g, b, a } = currentRgb.value
  const { h, s, l } = currentHsl.value

  switch (props.format) {
    case 'rgb':
      return props.showAlpha
        ? `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`
        : `rgb(${r}, ${g}, ${b})`
    case 'hsl':
      return props.showAlpha
        ? `hsla(${h}, ${s}%, ${l}%, ${a.toFixed(2)})`
        : `hsl(${h}, ${s}%, ${l}%)`
    default:
      return currentHex.value.toUpperCase()
  }
})

// ──── Parse color ────
function parseColor(color: string) {
  if (!color) return

  if (color.startsWith('#')) {
    const rgb = hexToRgb(color)
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b)
    hsva.value = { ...hsv, a: rgb.a }
    return
  }

  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1])
    const g = parseInt(rgbMatch[2])
    const b = parseInt(rgbMatch[3])
    const a = rgbMatch[4] ? parseFloat(rgbMatch[4]) : 1
    const hsv = rgbToHsv(r, g, b)
    hsva.value = { ...hsv, a }
    return
  }

  const hslMatch = color.match(/hsla?\((\d+),\s*(\d+)%?,\s*(\d+)%?(?:,\s*([\d.]+))?\)/)
  if (hslMatch) {
    const h = parseInt(hslMatch[1])
    const s = parseInt(hslMatch[2])
    const l = parseInt(hslMatch[3])
    const a = hslMatch[4] ? parseFloat(hslMatch[4]) : 1
    const sNorm = s / 100
    const lNorm = l / 100
    const v = lNorm + sNorm * Math.min(lNorm, 1 - lNorm)
    const sv = v === 0 ? 0 : 2 * (1 - lNorm / v)
    hsva.value = { h, s: sv * 100, v: v * 100, a }
  }
}

// Watch for external value changes
watch(() => props.modelValue, (newValue) => {
  if (newValue) parseColor(newValue)
}, { immediate: true })

// ──── Emit helpers ────
function emitChange() {
  emit('update:modelValue', outputValue.value)
  emit('change', outputValue.value)
  addToRecent(currentHex.value)
}

function emitInput() {
  emit('input', outputValue.value)
}

// ──── Preset / Recent ────
function selectPreset(color: string) {
  if (props.disabled || props.readonly) return
  parseColor(color)
  emitChange()
}

function addToRecent(color: string) {
  const normalized = color.toUpperCase()
  recentColors.value = [
    normalized,
    ...recentColors.value.filter(c => c !== normalized)
  ].slice(0, props.maxRecent)

  try {
    localStorage.setItem('s-color-picker-recent', JSON.stringify(recentColors.value))
  } catch { /* ignore */ }
}

function loadRecentColors() {
  try {
    const stored = localStorage.getItem('s-color-picker-recent')
    if (stored) recentColors.value = JSON.parse(stored)
  } catch { /* ignore */ }
}

// ──── Format cycling ────
function cycleFormat() {
  const formats: Array<'hex' | 'rgb' | 'hsl'> = ['hex', 'rgb', 'hsl']
  const currentIndex = formats.indexOf(activeFormat.value)
  activeFormat.value = formats[(currentIndex + 1) % formats.length]
}

// ──── Dropdown handling ────
function toggle() {
  if (props.disabled) return
  isOpen.value = !isOpen.value
}

function handleClickOutside(event: MouseEvent) {
  if (props.mode !== 'dropdown' || !isOpen.value) return
  const target = event.target as Node
  if (containerRef.value && !containerRef.value.contains(target)) {
    isOpen.value = false
  }
}

// ──── Compound API detection ────
const isCompound = computed(() => !!slots.default)

// ──── Provide context ────
const context: SColorPickerContext = {
  hsva,
  currentRgb,
  currentHex,
  currentHsl,
  displayValue,
  activeFormat,
  recentColors,
  showAlpha: computed(() => props.showAlpha),
  disabled: computed(() => props.disabled),
  readonly: computed(() => props.readonly),
  size: computed(() => props.size),
  sizeConfig,
  parseColor,
  emitChange,
  emitInput,
  cycleFormat,
  selectPreset,
  addToRecent,
  hsvToRgb,
  rgbToHsv,
  rgbToHsl,
  hexToRgb,
  rgbToHex
}

provide(SColorPickerContextKey, context)

// ──── Lifecycle ────
onMounted(() => {
  loadRecentColors()
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div
    ref="containerRef"
    v-bind="$attrs"
    :class="cn('s-color-picker', `s-color-picker--${size}`, {
        's-color-picker--disabled': disabled,
        's-color-picker--readonly': readonly
      })"
  >
    <!-- Label -->
    <label v-if="label" class="s-color-picker__label" :class="sizeConfig.label">
      {{ label }}
    </label>

    <!-- Custom Trigger Slot (simple API) -->
    <div
      v-if="mode === 'dropdown' && $slots.trigger"
      class="s-color-picker__trigger-custom"
      @click.stop="toggle"
    >
      <slot
        name="trigger"
        :color="currentHex"
        :display-value="displayValue"
        :rgb="currentRgb"
        :hsl="currentHsl"
        :is-open="isOpen"
        :toggle="toggle"
        :disabled="disabled"
      />
    </div>

    <!-- Dropdown Trigger: Button Style (simple API) -->
    <button
      v-if="mode === 'dropdown' && !$slots.trigger && triggerStyle === 'button' && !isCompound"
      type="button"
      class="s-color-picker__trigger"
      :class="sizeConfig.input"
      :disabled="disabled"
      @click.stop="toggle"
    >
      <span
        class="s-color-picker__trigger-swatch"
        :style="{ backgroundColor: currentHex }"
      ></span>
      <span class="s-color-picker__trigger-value">{{ displayValue }}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="s-color-picker__trigger-icon"
        :class="{ 'rotate-180': isOpen }"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>

    <!-- Dropdown Trigger: Swatch Style (simple API) -->
    <button
      v-if="mode === 'dropdown' && !$slots.trigger && triggerStyle === 'swatch' && !isCompound"
      type="button"
      class="s-color-picker__trigger-swatch-bar"
      :disabled="disabled"
      @click.stop="toggle"
    >
      <span
        class="s-color-picker__trigger-swatch-bar-color"
        :style="{ backgroundColor: showAlpha ? `rgba(${currentRgb.r}, ${currentRgb.g}, ${currentRgb.b}, ${hsva.a})` : currentHex }"
      ></span>
    </button>

    <!-- Compound API: render default slot directly -->
    <template v-if="isCompound">
      <div
        v-show="mode === 'inline' || isOpen"
        class="s-color-picker__panel"
        :class="[sizeConfig.panelWidth, { 's-color-picker__panel--dropdown': mode === 'dropdown' }]"
      >
        <slot
          :color="currentHex"
          :rgb="currentRgb"
          :hsl="currentHsl"
          :display-value="displayValue"
          :hsva="hsva"
        />
      </div>
    </template>

    <!-- Simple API: render all sections based on show* props -->
    <template v-else>
      <div
        v-show="mode === 'inline' || isOpen"
        class="s-color-picker__panel"
        :class="[sizeConfig.panelWidth, { 's-color-picker__panel--dropdown': mode === 'dropdown' }]"
      >
        <slot name="panel-before" />

        <!-- Spectrum -->
        <SColorPickerSpectrum v-if="showSpectrum" />

        <!-- Sliders -->
        <div v-if="showSliders" class="s-color-picker__sliders">
          <SColorPickerHueSlider />
          <SColorPickerAlphaSlider v-if="showAlpha" />
        </div>

        <!-- Preview & Tools -->
        <div v-if="showPreview" class="s-color-picker__preview-row">
          <SColorPickerPreview />
          <div class="s-color-picker__tools">
            <SColorPickerEyeDropper v-if="showEyeDropper" />
            <SColorPickerCopy />
          </div>
        </div>

        <!-- Inputs -->
        <SColorPickerInputs v-if="showInputs" />

        <!-- Presets -->
        <SColorPickerPresets v-if="showPresets && presets.length" :presets="presets" />

        <!-- Recent -->
        <SColorPickerRecent v-if="showRecent" />

        <slot name="panel-after" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.s-color-picker {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  gap: 0.5rem;
  font-family: inherit;
}

.s-color-picker--disabled {
  opacity: 0.5;
  pointer-events: none;
}

.s-color-picker--readonly {
  pointer-events: none;
}

.s-color-picker__label {
  color: var(--s-muted-foreground);
  font-weight: 500;
}

/* Dropdown Trigger */
.s-color-picker__trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid var(--s-border);
  background: var(--s-background);
  color: var(--s-foreground);
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 180px;
}

.s-color-picker__trigger:hover:not(:disabled) {
  border-color: var(--s-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--s-primary) 15%, transparent);
}

.s-color-picker__trigger:focus {
  outline: none;
  border-color: var(--s-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--s-primary) 15%, transparent);
}

.s-color-picker__trigger-swatch {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 0.25rem;
  border: 1px solid var(--s-border);
  flex-shrink: 0;
}

.s-color-picker__trigger-value {
  flex: 1;
  text-align: left;
  font-family: ui-monospace, monospace;
  font-size: 0.875rem;
}

/* Swatch Bar Trigger */
.s-color-picker__trigger-swatch-bar {
  display: block;
  width: 100%;
  min-width: 180px;
  height: 2.5rem;
  padding: 0.25rem;
  border-radius: 0.5rem;
  border: 1px solid var(--s-border);
  background: var(--s-background);
  cursor: pointer;
  transition: all 0.2s ease;
  background-image:
    linear-gradient(45deg, var(--s-border) 25%, transparent 25%),
    linear-gradient(-45deg, var(--s-border) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, var(--s-border) 75%),
    linear-gradient(-45deg, transparent 75%, var(--s-border) 75%);
  background-size: 10px 10px;
  background-position: 0 0, 0 5px, 5px -5px, -5px 0px;
}

.s-color-picker__trigger-swatch-bar:hover:not(:disabled) {
  border-color: var(--s-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--s-primary) 15%, transparent);
}

.s-color-picker__trigger-swatch-bar:focus {
  outline: none;
  border-color: var(--s-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--s-primary) 15%, transparent);
}

.s-color-picker__trigger-swatch-bar-color {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 0.25rem;
  transition: background-color 0.15s ease;
}

.s-color-picker__trigger-icon {
  color: var(--s-muted-foreground);
  transition: transform 0.2s ease;
}

.s-color-picker__trigger-custom {
  display: inline-block;
  cursor: pointer;
}

/* Panel */
.s-color-picker__panel {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 1rem;
  background: var(--s-background);
  border: 1px solid var(--s-border);
  box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.2),
              0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  backdrop-filter: blur(20px);
  box-sizing: border-box;
}

@media (max-width: 400px) {
  .s-color-picker__panel {
    min-width: 100% !important;
    width: 100% !important;
    padding: 0.75rem;
  }
}

.s-color-picker__panel--dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 999;
  margin-top: 0.5rem;
  animation: s-color-picker-fade-in 0.2s ease;
}

@keyframes s-color-picker-fade-in {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Sliders container */
.s-color-picker__sliders {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Preview Row */
.s-color-picker__preview-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.s-color-picker__tools {
  display: flex;
  gap: 0.25rem;
}

/* Size adjustments */
.s-color-picker--small .s-color-picker__panel {
  padding: 0.75rem;
  gap: 0.5rem;
}

.s-color-picker--large .s-color-picker__panel {
  padding: 1.25rem;
  gap: 1rem;
}

@media (max-width: 400px) {
  .s-color-picker__trigger {
    min-width: 140px;
  }
  .s-color-picker__trigger-swatch-bar {
    min-width: 140px;
  }
}
</style>
