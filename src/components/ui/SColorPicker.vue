<script setup lang="ts">
defineOptions({ inheritAttrs: false })

import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

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

// State
const isOpen = ref(false)
const activeFormat = ref<'hex' | 'rgb' | 'hsl'>('hex')
const recentColors = ref<string[]>([])
const isDraggingSpectrum = ref(false)
const isDraggingHue = ref(false)
const isDraggingAlpha = ref(false)

// Refs
const containerRef = ref<HTMLElement | null>(null)
const spectrumRef = ref<HTMLElement | null>(null)
const hueRef = ref<HTMLElement | null>(null)
const alphaRef = ref<HTMLElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)

// Internal color state (HSV + Alpha)
const hsva = ref({ h: 210, s: 76, v: 96, a: 1 })

// Size configs - using aspect-ratio based heights for responsive spectrum
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

// Color conversions
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

// Computed values
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

const hueColor = computed(() => {
  const rgb = hsvToRgb(hsva.value.h, 100, 100)
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
})

const spectrumStyle = computed(() => ({
  background: `linear-gradient(to top, #000, transparent), 
               linear-gradient(to right, #fff, ${hueColor.value})`
}))

const spectrumCursorPosition = computed(() => ({
  left: `${hsva.value.s}%`,
  top: `${100 - hsva.value.v}%`
}))

const hueCursorPosition = computed(() => ({
  left: `${(hsva.value.h / 360) * 100}%`
}))

const alphaCursorPosition = computed(() => ({
  left: `${hsva.value.a * 100}%`
}))

const alphaGradient = computed(() => {
  const { r, g, b } = currentRgb.value
  return `linear-gradient(to right, transparent, rgb(${r}, ${g}, ${b}))`
})

// Input field values
const hexInput = ref('')
const rgbInputs = ref({ r: 0, g: 0, b: 0, a: 100 })
const hslInputs = ref({ h: 0, s: 0, l: 0, a: 100 })

// Sync inputs with current color
watch([currentHex, currentRgb, currentHsl], () => {
  hexInput.value = currentHex.value.toUpperCase()
  rgbInputs.value = { 
    r: currentRgb.value.r, 
    g: currentRgb.value.g, 
    b: currentRgb.value.b,
    a: Math.round(hsva.value.a * 100)
  }
  hslInputs.value = { 
    h: currentHsl.value.h, 
    s: currentHsl.value.s, 
    l: currentHsl.value.l,
    a: Math.round(hsva.value.a * 100)
  }
}, { immediate: true })

// Parse initial value
function parseColor(color: string) {
  if (!color) return
  
  // HEX
  if (color.startsWith('#')) {
    const rgb = hexToRgb(color)
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b)
    hsva.value = { ...hsv, a: rgb.a }
    return
  }
  
  // RGB/RGBA
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
  
  // HSL/HSLA
  const hslMatch = color.match(/hsla?\((\d+),\s*(\d+)%?,\s*(\d+)%?(?:,\s*([\d.]+))?\)/)
  if (hslMatch) {
    const h = parseInt(hslMatch[1])
    const s = parseInt(hslMatch[2])
    const l = parseInt(hslMatch[3])
    const a = hslMatch[4] ? parseFloat(hslMatch[4]) : 1
    // Convert HSL to HSV
    const sNorm = s / 100
    const lNorm = l / 100
    const v = lNorm + sNorm * Math.min(lNorm, 1 - lNorm)
    const sv = v === 0 ? 0 : 2 * (1 - lNorm / v)
    hsva.value = { h, s: sv * 100, v: v * 100, a }
  }
}

// Watch for external value changes
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    parseColor(newValue)
  }
}, { immediate: true })

// Emit changes
function emitChange() {
  emit('update:modelValue', outputValue.value)
  emit('change', outputValue.value)
  addToRecent(currentHex.value)
}

function emitInput() {
  emit('input', outputValue.value)
}

// Spectrum interactions
function handleSpectrumMouseDown(event: MouseEvent) {
  if (props.disabled || props.readonly) return
  isDraggingSpectrum.value = true
  updateSpectrumFromEvent(event)
  document.addEventListener('mousemove', handleSpectrumMouseMove)
  document.addEventListener('mouseup', handleSpectrumMouseUp)
}

function handleSpectrumTouchStart(event: TouchEvent) {
  if (props.disabled || props.readonly) return
  event.preventDefault()
  isDraggingSpectrum.value = true
  updateSpectrumFromTouch(event)
  document.addEventListener('touchmove', handleSpectrumTouchMove, { passive: false })
  document.addEventListener('touchend', handleSpectrumTouchEnd)
}

function handleSpectrumMouseMove(event: MouseEvent) {
  if (!isDraggingSpectrum.value) return
  updateSpectrumFromEvent(event)
}

function handleSpectrumTouchMove(event: TouchEvent) {
  if (!isDraggingSpectrum.value) return
  event.preventDefault()
  updateSpectrumFromTouch(event)
}

function handleSpectrumMouseUp() {
  isDraggingSpectrum.value = false
  document.removeEventListener('mousemove', handleSpectrumMouseMove)
  document.removeEventListener('mouseup', handleSpectrumMouseUp)
  emitChange()
}

function handleSpectrumTouchEnd() {
  isDraggingSpectrum.value = false
  document.removeEventListener('touchmove', handleSpectrumTouchMove)
  document.removeEventListener('touchend', handleSpectrumTouchEnd)
  emitChange()
}

function updateSpectrumFromEvent(event: MouseEvent) {
  if (!spectrumRef.value) return
  const rect = spectrumRef.value.getBoundingClientRect()
  const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width))
  const y = Math.max(0, Math.min(event.clientY - rect.top, rect.height))
  
  hsva.value.s = (x / rect.width) * 100
  hsva.value.v = 100 - (y / rect.height) * 100
  emitInput()
}

function updateSpectrumFromTouch(event: TouchEvent) {
  if (!spectrumRef.value || !event.touches[0]) return
  const rect = spectrumRef.value.getBoundingClientRect()
  const x = Math.max(0, Math.min(event.touches[0].clientX - rect.left, rect.width))
  const y = Math.max(0, Math.min(event.touches[0].clientY - rect.top, rect.height))
  
  hsva.value.s = (x / rect.width) * 100
  hsva.value.v = 100 - (y / rect.height) * 100
  emitInput()
}

// Hue slider interactions
function handleHueMouseDown(event: MouseEvent) {
  if (props.disabled || props.readonly) return
  isDraggingHue.value = true
  updateHueFromEvent(event)
  document.addEventListener('mousemove', handleHueMouseMove)
  document.addEventListener('mouseup', handleHueMouseUp)
}

function handleHueTouchStart(event: TouchEvent) {
  if (props.disabled || props.readonly) return
  event.preventDefault()
  isDraggingHue.value = true
  updateHueFromTouch(event)
  document.addEventListener('touchmove', handleHueTouchMove, { passive: false })
  document.addEventListener('touchend', handleHueTouchEnd)
}

function handleHueMouseMove(event: MouseEvent) {
  if (!isDraggingHue.value) return
  updateHueFromEvent(event)
}

function handleHueTouchMove(event: TouchEvent) {
  if (!isDraggingHue.value) return
  event.preventDefault()
  updateHueFromTouch(event)
}

function handleHueMouseUp() {
  isDraggingHue.value = false
  document.removeEventListener('mousemove', handleHueMouseMove)
  document.removeEventListener('mouseup', handleHueMouseUp)
  emitChange()
}

function handleHueTouchEnd() {
  isDraggingHue.value = false
  document.removeEventListener('touchmove', handleHueTouchMove)
  document.removeEventListener('touchend', handleHueTouchEnd)
  emitChange()
}

function updateHueFromEvent(event: MouseEvent) {
  if (!hueRef.value) return
  const rect = hueRef.value.getBoundingClientRect()
  const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width))
  hsva.value.h = (x / rect.width) * 360
  emitInput()
}

function updateHueFromTouch(event: TouchEvent) {
  if (!hueRef.value || !event.touches[0]) return
  const rect = hueRef.value.getBoundingClientRect()
  const x = Math.max(0, Math.min(event.touches[0].clientX - rect.left, rect.width))
  hsva.value.h = (x / rect.width) * 360
  emitInput()
}

// Alpha slider interactions
function handleAlphaMouseDown(event: MouseEvent) {
  if (props.disabled || props.readonly) return
  isDraggingAlpha.value = true
  updateAlphaFromEvent(event)
  document.addEventListener('mousemove', handleAlphaMouseMove)
  document.addEventListener('mouseup', handleAlphaMouseUp)
}

function handleAlphaTouchStart(event: TouchEvent) {
  if (props.disabled || props.readonly) return
  event.preventDefault()
  isDraggingAlpha.value = true
  updateAlphaFromTouch(event)
  document.addEventListener('touchmove', handleAlphaTouchMove, { passive: false })
  document.addEventListener('touchend', handleAlphaTouchEnd)
}

function handleAlphaMouseMove(event: MouseEvent) {
  if (!isDraggingAlpha.value) return
  updateAlphaFromEvent(event)
}

function handleAlphaTouchMove(event: TouchEvent) {
  if (!isDraggingAlpha.value) return
  event.preventDefault()
  updateAlphaFromTouch(event)
}

function handleAlphaMouseUp() {
  isDraggingAlpha.value = false
  document.removeEventListener('mousemove', handleAlphaMouseMove)
  document.removeEventListener('mouseup', handleAlphaMouseUp)
  emitChange()
}

function handleAlphaTouchEnd() {
  isDraggingAlpha.value = false
  document.removeEventListener('touchmove', handleAlphaTouchMove)
  document.removeEventListener('touchend', handleAlphaTouchEnd)
  emitChange()
}

function updateAlphaFromEvent(event: MouseEvent) {
  if (!alphaRef.value) return
  const rect = alphaRef.value.getBoundingClientRect()
  const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width))
  hsva.value.a = x / rect.width
  emitInput()
}

function updateAlphaFromTouch(event: TouchEvent) {
  if (!alphaRef.value || !event.touches[0]) return
  const rect = alphaRef.value.getBoundingClientRect()
  const x = Math.max(0, Math.min(event.touches[0].clientX - rect.left, rect.width))
  hsva.value.a = x / rect.width
  emitInput()
}

// Input handlers
function handleHexInput() {
  const hex = hexInput.value.startsWith('#') ? hexInput.value : '#' + hexInput.value
  if (/^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/.test(hex)) {
    parseColor(hex)
    emitChange()
  }
}

function handleRgbInput() {
  const { r, g, b, a } = rgbInputs.value
  if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
    const hsv = rgbToHsv(r, g, b)
    hsva.value = { ...hsv, a: a / 100 }
    emitChange()
  }
}

function handleHslInput() {
  const { h, s, l, a } = hslInputs.value
  if (h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100) {
    // Convert HSL to HSV
    const sNorm = s / 100
    const lNorm = l / 100
    const v = lNorm + sNorm * Math.min(lNorm, 1 - lNorm)
    const sv = v === 0 ? 0 : 2 * (1 - lNorm / v)
    hsva.value = { h, s: sv * 100, v: v * 100, a: a / 100 }
    emitChange()
  }
}

// Preset selection
function selectPreset(color: string) {
  if (props.disabled || props.readonly) return
  parseColor(color)
  emitChange()
}

// Recent colors
function addToRecent(color: string) {
  const normalized = color.toUpperCase()
  recentColors.value = [
    normalized,
    ...recentColors.value.filter(c => c !== normalized)
  ].slice(0, props.maxRecent)
  
  // Persist to localStorage
  try {
    localStorage.setItem('s-color-picker-recent', JSON.stringify(recentColors.value))
  } catch {
    // Ignore storage errors
  }
}

function loadRecentColors() {
  try {
    const stored = localStorage.getItem('s-color-picker-recent')
    if (stored) {
      recentColors.value = JSON.parse(stored)
    }
  } catch {
    // Ignore storage errors
  }
}

// Eyedropper
const supportsEyeDropper = ref(false)

async function openEyeDropper() {
  if (props.disabled || props.readonly || !supportsEyeDropper.value) return
  
  try {
    // @ts-expect-error EyeDropper API may not be in types
    const eyeDropper = new EyeDropper()
    const result = await eyeDropper.open()
    parseColor(result.sRGBHex)
    emitChange()
  } catch {
    // User cancelled or error
  }
}

// Copy to clipboard
const copied = ref(false)

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(displayValue.value)
    copied.value = true
    setTimeout(() => copied.value = false, 1500)
  } catch {
    // Fallback
    const textarea = document.createElement('textarea')
    textarea.value = displayValue.value
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    copied.value = true
    setTimeout(() => copied.value = false, 1500)
  }
}

// Dropdown handling
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

// Format cycling
function cycleFormat() {
  const formats: Array<'hex' | 'rgb' | 'hsl'> = ['hex', 'rgb', 'hsl']
  const currentIndex = formats.indexOf(activeFormat.value)
  activeFormat.value = formats[(currentIndex + 1) % formats.length]
}

// Lifecycle
onMounted(() => {
  loadRecentColors()
  supportsEyeDropper.value = typeof window !== 'undefined' && 'EyeDropper' in window
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  // Mouse events cleanup
  document.removeEventListener('mousemove', handleSpectrumMouseMove)
  document.removeEventListener('mouseup', handleSpectrumMouseUp)
  document.removeEventListener('mousemove', handleHueMouseMove)
  document.removeEventListener('mouseup', handleHueMouseUp)
  document.removeEventListener('mousemove', handleAlphaMouseMove)
  document.removeEventListener('mouseup', handleAlphaMouseUp)
  // Touch events cleanup
  document.removeEventListener('touchmove', handleSpectrumTouchMove)
  document.removeEventListener('touchend', handleSpectrumTouchEnd)
  document.removeEventListener('touchmove', handleHueTouchMove)
  document.removeEventListener('touchend', handleHueTouchEnd)
  document.removeEventListener('touchmove', handleAlphaTouchMove)
  document.removeEventListener('touchend', handleAlphaTouchEnd)
})
</script>

<template>
  <div
    ref="containerRef"
    v-bind="$attrs"
    class="s-color-picker"
    :class="[
      `s-color-picker--${size}`,
      { 
        's-color-picker--disabled': disabled,
        's-color-picker--readonly': readonly 
      }
    ]"
  >
    <!-- Label -->
    <label v-if="label" class="s-color-picker__label" :class="sizeConfig.label">
      {{ label }}
    </label>

    <!-- Custom Trigger Slot -->
    <div 
      v-if="mode === 'dropdown' && $slots.trigger"
      ref="triggerRef"
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

    <!-- Dropdown Trigger: Button Style -->
    <button
      v-if="mode === 'dropdown' && !$slots.trigger && triggerStyle === 'button'"
      ref="triggerRef"
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
      <span class="mdi mdi-chevron-down s-color-picker__trigger-icon" :class="{ 'rotate-180': isOpen }"></span>
    </button>

    <!-- Dropdown Trigger: Swatch Style -->
    <button
      v-if="mode === 'dropdown' && !$slots.trigger && triggerStyle === 'swatch'"
      ref="triggerRef"
      type="button"
      class="s-color-picker__trigger-swatch-bar"
      :disabled="disabled"
      @click.stop="toggle"
    >
      <span 
        class="s-color-picker__trigger-swatch-bar-color"
        :style="{ backgroundColor: props.showAlpha ? `rgba(${currentRgb.r}, ${currentRgb.g}, ${currentRgb.b}, ${hsva.a})` : currentHex }"
      ></span>
    </button>

    <!-- Color Picker Panel -->
    <div 
      v-show="mode === 'inline' || isOpen"
      ref="dropdownRef"
      class="s-color-picker__panel"
      :class="[sizeConfig.panelWidth, { 's-color-picker__panel--dropdown': mode === 'dropdown' }]"
    >
      <!-- Spectrum (Saturation/Brightness) -->
      <div
        v-if="showSpectrum"
        ref="spectrumRef"
        class="s-color-picker__spectrum w-full"
        :class="sizeConfig.spectrumHeight"
        :style="spectrumStyle"
        @mousedown="handleSpectrumMouseDown"
        @touchstart="handleSpectrumTouchStart"
      >
        <div 
          class="s-color-picker__spectrum-cursor"
          :class="{ 's-color-picker__spectrum-cursor--dragging': isDraggingSpectrum }"
          :style="spectrumCursorPosition"
        >
          <div class="s-color-picker__spectrum-cursor-inner" :style="{ backgroundColor: currentHex }"></div>
        </div>
      </div>

      <!-- Sliders -->
      <div v-if="showSliders" class="s-color-picker__sliders">
        <!-- Hue Slider -->
        <div
          ref="hueRef"
          class="s-color-picker__slider s-color-picker__slider--hue"
          :class="sizeConfig.slider"
          @mousedown="handleHueMouseDown"
          @touchstart="handleHueTouchStart"
        >
          <div 
            class="s-color-picker__slider-cursor"
            :class="{ 's-color-picker__slider-cursor--dragging': isDraggingHue }"
            :style="hueCursorPosition"
          ></div>
        </div>

        <!-- Alpha Slider -->
        <div
          v-if="showAlpha"
          ref="alphaRef"
          class="s-color-picker__slider s-color-picker__slider--alpha"
          :class="sizeConfig.slider"
          @mousedown="handleAlphaMouseDown"
          @touchstart="handleAlphaTouchStart"
        >
          <div class="s-color-picker__slider-alpha-bg"></div>
          <div 
            class="s-color-picker__slider-alpha-gradient"
            :style="{ background: alphaGradient }"
          ></div>
          <div 
            class="s-color-picker__slider-cursor"
            :class="{ 's-color-picker__slider-cursor--dragging': isDraggingAlpha }"
            :style="alphaCursorPosition"
          ></div>
        </div>
      </div>

      <!-- Preview & Tools -->
      <div v-if="showPreview" class="s-color-picker__preview-row">
        <div class="s-color-picker__preview">
          <div 
            class="s-color-picker__preview-color"
            :style="{ backgroundColor: props.showAlpha ? `rgba(${currentRgb.r}, ${currentRgb.g}, ${currentRgb.b}, ${hsva.a})` : currentHex }"
          ></div>
        </div>
        
        <div class="s-color-picker__tools">
          <button 
            v-if="showEyeDropper && supportsEyeDropper"
            type="button"
            class="s-color-picker__tool-btn"
            title="Pick color from screen"
            :disabled="disabled || readonly"
            @click="openEyeDropper"
          >
            <span class="mdi mdi-eyedropper"></span>
          </button>
          <button 
            type="button"
            class="s-color-picker__tool-btn"
            :class="{ 's-color-picker__tool-btn--copied': copied }"
            title="Copy color"
            @click="copyToClipboard"
          >
            <span :class="['mdi', copied ? 'mdi-check' : 'mdi-content-copy']"></span>
          </button>
        </div>
      </div>

      <!-- Inputs -->
      <div v-if="showInputs" class="s-color-picker__inputs">
        <div class="s-color-picker__format-toggle">
          <button 
            type="button"
            class="s-color-picker__format-btn"
            :class="sizeConfig.input"
            @click="cycleFormat"
          >
            {{ activeFormat.toUpperCase() }}
          </button>
        </div>
        
        <!-- HEX Input -->
        <div v-if="activeFormat === 'hex'" class="s-color-picker__input-group s-color-picker__input-group--hex">
          <input
            v-model="hexInput"
            type="text"
            class="s-color-picker__input"
            :class="sizeConfig.input"
            :disabled="disabled || readonly"
            maxlength="9"
            @blur="handleHexInput"
            @keydown.enter="handleHexInput"
          />
        </div>

        <!-- RGB Inputs -->
        <div v-if="activeFormat === 'rgb'" class="s-color-picker__input-group s-color-picker__input-group--rgb">
          <div class="s-color-picker__input-field">
            <input
              v-model.number="rgbInputs.r"
              type="number"
              class="s-color-picker__input"
              :class="sizeConfig.input"
              :disabled="disabled || readonly"
              min="0"
              max="255"
              @blur="handleRgbInput"
              @keydown.enter="handleRgbInput"
            />
            <span class="s-color-picker__input-label">R</span>
          </div>
          <div class="s-color-picker__input-field">
            <input
              v-model.number="rgbInputs.g"
              type="number"
              class="s-color-picker__input"
              :class="sizeConfig.input"
              :disabled="disabled || readonly"
              min="0"
              max="255"
              @blur="handleRgbInput"
              @keydown.enter="handleRgbInput"
            />
            <span class="s-color-picker__input-label">G</span>
          </div>
          <div class="s-color-picker__input-field">
            <input
              v-model.number="rgbInputs.b"
              type="number"
              class="s-color-picker__input"
              :class="sizeConfig.input"
              :disabled="disabled || readonly"
              min="0"
              max="255"
              @blur="handleRgbInput"
              @keydown.enter="handleRgbInput"
            />
            <span class="s-color-picker__input-label">B</span>
          </div>
          <div v-if="showAlpha" class="s-color-picker__input-field">
            <input
              v-model.number="rgbInputs.a"
              type="number"
              class="s-color-picker__input"
              :class="sizeConfig.input"
              :disabled="disabled || readonly"
              min="0"
              max="100"
              @blur="handleRgbInput"
              @keydown.enter="handleRgbInput"
            />
            <span class="s-color-picker__input-label">A</span>
          </div>
        </div>

        <!-- HSL Inputs -->
        <div v-if="activeFormat === 'hsl'" class="s-color-picker__input-group s-color-picker__input-group--hsl">
          <div class="s-color-picker__input-field">
            <input
              v-model.number="hslInputs.h"
              type="number"
              class="s-color-picker__input"
              :class="sizeConfig.input"
              :disabled="disabled || readonly"
              min="0"
              max="360"
              @blur="handleHslInput"
              @keydown.enter="handleHslInput"
            />
            <span class="s-color-picker__input-label">H</span>
          </div>
          <div class="s-color-picker__input-field">
            <input
              v-model.number="hslInputs.s"
              type="number"
              class="s-color-picker__input"
              :class="sizeConfig.input"
              :disabled="disabled || readonly"
              min="0"
              max="100"
              @blur="handleHslInput"
              @keydown.enter="handleHslInput"
            />
            <span class="s-color-picker__input-label">S</span>
          </div>
          <div class="s-color-picker__input-field">
            <input
              v-model.number="hslInputs.l"
              type="number"
              class="s-color-picker__input"
              :class="sizeConfig.input"
              :disabled="disabled || readonly"
              min="0"
              max="100"
              @blur="handleHslInput"
              @keydown.enter="handleHslInput"
            />
            <span class="s-color-picker__input-label">L</span>
          </div>
          <div v-if="showAlpha" class="s-color-picker__input-field">
            <input
              v-model.number="hslInputs.a"
              type="number"
              class="s-color-picker__input"
              :class="sizeConfig.input"
              :disabled="disabled || readonly"
              min="0"
              max="100"
              @blur="handleHslInput"
              @keydown.enter="handleHslInput"
            />
            <span class="s-color-picker__input-label">A</span>
          </div>
        </div>
      </div>

      <!-- Presets -->
      <div v-if="showPresets && presets.length" class="s-color-picker__presets">
        <div class="s-color-picker__presets-label">Presets</div>
        <div class="s-color-picker__swatches">
          <button
            v-for="color in presets"
            :key="color"
            type="button"
            class="s-color-picker__swatch"
            :class="[sizeConfig.swatch, { 's-color-picker__swatch--active': currentHex.toUpperCase() === color.toUpperCase() }]"
            :style="{ backgroundColor: color }"
            :title="color"
            :disabled="disabled || readonly"
            @click="selectPreset(color)"
          ></button>
        </div>
      </div>

      <!-- Recent Colors -->
      <div v-if="showRecent && recentColors.length" class="s-color-picker__recent">
        <div class="s-color-picker__presets-label">Recent</div>
        <div class="s-color-picker__swatches">
          <button
            v-for="color in recentColors"
            :key="color"
            type="button"
            class="s-color-picker__swatch"
            :class="[sizeConfig.swatch, { 's-color-picker__swatch--active': currentHex.toUpperCase() === color.toUpperCase() }]"
            :style="{ backgroundColor: color }"
            :title="color"
            :disabled="disabled || readonly"
            @click="selectPreset(color)"
          ></button>
        </div>
      </div>
    </div>
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
  color: var(--s-text-secondary);
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
  background: var(--s-bg-primary);
  color: var(--s-text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 180px;
}

.s-color-picker__trigger:hover:not(:disabled) {
  border-color: var(--s-primary);
  box-shadow: 0 0 0 3px var(--s-primary-alpha);
}

.s-color-picker__trigger:focus {
  outline: none;
  border-color: var(--s-primary);
  box-shadow: 0 0 0 3px var(--s-primary-alpha);
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
  background: var(--s-bg-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  /* Checkerboard pattern for transparent colors */
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
  box-shadow: 0 0 0 3px var(--s-primary-alpha);
}

.s-color-picker__trigger-swatch-bar:focus {
  outline: none;
  border-color: var(--s-primary);
  box-shadow: 0 0 0 3px var(--s-primary-alpha);
}

.s-color-picker__trigger-swatch-bar-color {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 0.25rem;
  transition: background-color 0.15s ease;
}

.s-color-picker__trigger-icon {
  color: var(--s-text-tertiary);
  transition: transform 0.2s ease;
}

/* Custom Trigger */
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
  background: var(--s-bg-primary);
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

/* Spectrum */
.s-color-picker__spectrum {
  position: relative;
  border-radius: 0.75rem;
  cursor: crosshair;
  overflow: hidden;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.15);
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
}

.s-color-picker__spectrum-cursor {
  position: absolute;
  width: 1.25rem;
  height: 1.25rem;
  transform: translate(-50%, -50%);
  pointer-events: none;
  transition: transform 0.1s ease;
}

.s-color-picker__spectrum-cursor--dragging {
  transform: translate(-50%, -50%) scale(1.2);
}

.s-color-picker__spectrum-cursor-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3),
              inset 0 0 0 1px rgba(0, 0, 0, 0.1);
}

/* Sliders */
.s-color-picker__sliders {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.s-color-picker__slider {
  position: relative;
  border-radius: 999px;
  cursor: pointer;
  overflow: hidden;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
}

.s-color-picker__slider--hue {
  background: linear-gradient(
    to right,
    hsl(0, 100%, 50%),
    hsl(60, 100%, 50%),
    hsl(120, 100%, 50%),
    hsl(180, 100%, 50%),
    hsl(240, 100%, 50%),
    hsl(300, 100%, 50%),
    hsl(360, 100%, 50%)
  );
}

.s-color-picker__slider--alpha {
  position: relative;
}

.s-color-picker__slider-alpha-bg {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background-image: linear-gradient(45deg, #ccc 25%, transparent 25%),
                    linear-gradient(-45deg, #ccc 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #ccc 75%),
                    linear-gradient(-45deg, transparent 75%, #ccc 75%);
  background-size: 8px 8px;
  background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
}

.s-color-picker__slider-alpha-gradient {
  position: absolute;
  inset: 0;
  border-radius: 999px;
}

.s-color-picker__slider-cursor {
  position: absolute;
  top: 50%;
  width: 1rem;
  height: 1rem;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
  pointer-events: none;
  transition: transform 0.1s ease;
}

.s-color-picker__slider-cursor--dragging {
  transform: translate(-50%, -50%) scale(1.2);
}

/* Preview Row */
.s-color-picker__preview-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.s-color-picker__preview {
  flex: 1;
  height: 2.5rem;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid var(--s-border);
  background-image: linear-gradient(45deg, #ccc 25%, transparent 25%),
                    linear-gradient(-45deg, #ccc 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #ccc 75%),
                    linear-gradient(-45deg, transparent 75%, #ccc 75%);
  background-size: 10px 10px;
  background-position: 0 0, 0 5px, 5px -5px, -5px 0px;
}

.s-color-picker__preview-color {
  width: 100%;
  height: 100%;
}

.s-color-picker__tools {
  display: flex;
  gap: 0.25rem;
}

.s-color-picker__tool-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem;
  border: 1px solid var(--s-border);
  background: var(--s-bg-secondary);
  color: var(--s-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.s-color-picker__tool-btn:hover:not(:disabled) {
  background: var(--s-bg-tertiary);
  color: var(--s-text-primary);
  border-color: var(--s-primary);
}

.s-color-picker__tool-btn--copied {
  background: var(--s-primary);
  color: white;
  border-color: var(--s-primary);
}

/* Inputs */
.s-color-picker__inputs {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
}

.s-color-picker__format-toggle {
  flex-shrink: 0;
}

.s-color-picker__format-btn {
  padding: 0.375rem 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid var(--s-border);
  background: var(--s-bg-secondary);
  color: var(--s-text-secondary);
  font-weight: 600;
  font-size: 0.625rem;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 2.5rem;
}

.s-color-picker__format-btn:hover {
  background: var(--s-bg-tertiary);
  color: var(--s-text-primary);
}

.s-color-picker__input-group {
  display: flex;
  gap: 0.375rem;
  flex: 1;
}

.s-color-picker__input-group--hex .s-color-picker__input {
  flex: 1;
  font-family: ui-monospace, monospace;
}

.s-color-picker__input-field {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  flex: 1;
  min-width: 0;
}

.s-color-picker__input {
  width: 100%;
  padding: 0.375rem 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid var(--s-border);
  background: var(--s-bg-secondary);
  color: var(--s-text-primary);
  text-align: center;
  transition: all 0.2s ease;
}

.s-color-picker__input:focus {
  outline: none;
  border-color: var(--s-primary);
  box-shadow: 0 0 0 2px var(--s-primary-alpha);
}

.s-color-picker__input::-webkit-inner-spin-button,
.s-color-picker__input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.s-color-picker__input[type='number'] {
  appearance: textfield;
  -moz-appearance: textfield;
}

.s-color-picker__input-label {
  font-size: 0.625rem;
  font-weight: 600;
  color: var(--s-text-tertiary);
  text-align: center;
  text-transform: uppercase;
}

/* Presets & Recent */
.s-color-picker__presets,
.s-color-picker__recent {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.s-color-picker__presets-label {
  font-size: 0.625rem;
  font-weight: 600;
  color: var(--s-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.s-color-picker__swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.s-color-picker__swatch {
  border-radius: 0.375rem;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
}

.s-color-picker__swatch:hover:not(:disabled) {
  transform: scale(1.15);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.s-color-picker__swatch--active {
  border-color: var(--s-primary);
  box-shadow: 0 0 0 2px var(--s-primary-alpha);
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

/* Responsive adjustments */
@media (max-width: 400px) {
  .s-color-picker__input-group--rgb,
  .s-color-picker__input-group--hsl {
    flex-wrap: wrap;
  }
  
  .s-color-picker__input-field {
    min-width: calc(50% - 0.25rem);
    flex: 1 1 calc(50% - 0.25rem);
  }
  
  .s-color-picker__swatches {
    justify-content: flex-start;
  }
  
  .s-color-picker__trigger {
    min-width: 140px;
  }
  
  .s-color-picker__trigger-swatch-bar {
    min-width: 140px;
  }
}
</style>
