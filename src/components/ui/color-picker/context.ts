import { type InjectionKey, type Ref, type ComputedRef } from 'vue'

export interface SColorPickerContext {
  hsva: Ref<{ h: number; s: number; v: number; a: number }>
  currentRgb: ComputedRef<{ r: number; g: number; b: number; a: number }>
  currentHex: ComputedRef<string>
  currentHsl: ComputedRef<{ h: number; s: number; l: number; a: number }>
  displayValue: ComputedRef<string>
  activeFormat: Ref<'hex' | 'rgb' | 'hsl'>
  recentColors: Ref<string[]>
  showAlpha: ComputedRef<boolean>
  disabled: ComputedRef<boolean>
  readonly: ComputedRef<boolean>
  size: ComputedRef<'sm' | 'md' | 'lg'>
  sizeConfig: ComputedRef<{
    panelWidth: string
    spectrumHeight: string
    slider: string
    swatch: string
    input: string
    label: string
  }>
  parseColor: (color: string) => void
  emitChange: () => void
  emitInput: () => void
  cycleFormat: () => void
  selectPreset: (color: string) => void
  addToRecent: (color: string) => void
  hsvToRgb: (h: number, s: number, v: number) => { r: number; g: number; b: number }
  rgbToHsv: (r: number, g: number, b: number) => { h: number; s: number; v: number }
  rgbToHsl: (r: number, g: number, b: number) => { h: number; s: number; l: number }
  hexToRgb: (hex: string) => { r: number; g: number; b: number; a: number }
  rgbToHex: (r: number, g: number, b: number, a?: number) => string
}

export const SColorPickerContextKey: InjectionKey<SColorPickerContext> = Symbol('SColorPickerContext')
