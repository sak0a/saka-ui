<script setup lang="ts">
import { ref, watch, inject } from 'vue'
import { SColorPickerContextKey, type SColorPickerContext } from './context'

const ctx = inject<SColorPickerContext>(SColorPickerContextKey)
if (!ctx) console.warn('[SColorPickerInputs] Must be used inside SColorPicker')

const hexInput = ref('')
const rgbInputs = ref({ r: 0, g: 0, b: 0, a: 100 })
const hslInputs = ref({ h: 0, s: 0, l: 0, a: 100 })

// Sync inputs with current color
watch([() => ctx?.currentHex.value, () => ctx?.currentRgb.value, () => ctx?.currentHsl.value], () => {
  if (!ctx) return
  hexInput.value = ctx.currentHex.value.toUpperCase()
  rgbInputs.value = {
    r: ctx.currentRgb.value.r,
    g: ctx.currentRgb.value.g,
    b: ctx.currentRgb.value.b,
    a: Math.round(ctx.hsva.value.a * 100)
  }
  hslInputs.value = {
    h: ctx.currentHsl.value.h,
    s: ctx.currentHsl.value.s,
    l: ctx.currentHsl.value.l,
    a: Math.round(ctx.hsva.value.a * 100)
  }
}, { immediate: true })

function handleHexInput() {
  if (!ctx) return
  const hex = hexInput.value.startsWith('#') ? hexInput.value : '#' + hexInput.value
  if (/^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/.test(hex)) {
    ctx.parseColor(hex)
    ctx.emitChange()
  }
}

function handleRgbInput() {
  if (!ctx) return
  const { r, g, b, a } = rgbInputs.value
  if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
    const hsv = ctx.rgbToHsv(r, g, b)
    ctx.hsva.value = { ...hsv, a: a / 100 }
    ctx.emitChange()
  }
}

function handleHslInput() {
  if (!ctx) return
  const { h, s, l, a } = hslInputs.value
  if (h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100) {
    const sNorm = s / 100
    const lNorm = l / 100
    const v = lNorm + sNorm * Math.min(lNorm, 1 - lNorm)
    const sv = v === 0 ? 0 : 2 * (1 - lNorm / v)
    ctx.hsva.value = { h, s: sv * 100, v: v * 100, a: a / 100 }
    ctx.emitChange()
  }
}
</script>

<template>
  <div v-if="ctx" class="s-color-picker__inputs">
    <div class="s-color-picker__format-toggle">
      <button
        type="button"
        class="s-color-picker__format-btn"
        :class="ctx.sizeConfig.value?.input"
        @click="ctx.cycleFormat()"
      >
        {{ ctx.activeFormat.value.toUpperCase() }}
      </button>
    </div>

    <!-- HEX Input -->
    <div v-if="ctx.activeFormat.value === 'hex'" class="s-color-picker__input-group s-color-picker__input-group--hex">
      <input
        v-model="hexInput"
        type="text"
        class="s-color-picker__input"
        :class="ctx.sizeConfig.value?.input"
        :disabled="ctx.disabled.value || ctx.readonly.value"
        maxlength="9"
        @blur="handleHexInput"
        @keydown.enter="handleHexInput"
      />
    </div>

    <!-- RGB Inputs -->
    <div v-if="ctx.activeFormat.value === 'rgb'" class="s-color-picker__input-group s-color-picker__input-group--rgb">
      <div class="s-color-picker__input-field">
        <input v-model.number="rgbInputs.r" type="number" class="s-color-picker__input" :class="ctx.sizeConfig.value?.input" :disabled="ctx.disabled.value || ctx.readonly.value" min="0" max="255" @blur="handleRgbInput" @keydown.enter="handleRgbInput" />
        <span class="s-color-picker__input-label">R</span>
      </div>
      <div class="s-color-picker__input-field">
        <input v-model.number="rgbInputs.g" type="number" class="s-color-picker__input" :class="ctx.sizeConfig.value?.input" :disabled="ctx.disabled.value || ctx.readonly.value" min="0" max="255" @blur="handleRgbInput" @keydown.enter="handleRgbInput" />
        <span class="s-color-picker__input-label">G</span>
      </div>
      <div class="s-color-picker__input-field">
        <input v-model.number="rgbInputs.b" type="number" class="s-color-picker__input" :class="ctx.sizeConfig.value?.input" :disabled="ctx.disabled.value || ctx.readonly.value" min="0" max="255" @blur="handleRgbInput" @keydown.enter="handleRgbInput" />
        <span class="s-color-picker__input-label">B</span>
      </div>
      <div v-if="ctx.showAlpha.value" class="s-color-picker__input-field">
        <input v-model.number="rgbInputs.a" type="number" class="s-color-picker__input" :class="ctx.sizeConfig.value?.input" :disabled="ctx.disabled.value || ctx.readonly.value" min="0" max="100" @blur="handleRgbInput" @keydown.enter="handleRgbInput" />
        <span class="s-color-picker__input-label">A</span>
      </div>
    </div>

    <!-- HSL Inputs -->
    <div v-if="ctx.activeFormat.value === 'hsl'" class="s-color-picker__input-group s-color-picker__input-group--hsl">
      <div class="s-color-picker__input-field">
        <input v-model.number="hslInputs.h" type="number" class="s-color-picker__input" :class="ctx.sizeConfig.value?.input" :disabled="ctx.disabled.value || ctx.readonly.value" min="0" max="360" @blur="handleHslInput" @keydown.enter="handleHslInput" />
        <span class="s-color-picker__input-label">H</span>
      </div>
      <div class="s-color-picker__input-field">
        <input v-model.number="hslInputs.s" type="number" class="s-color-picker__input" :class="ctx.sizeConfig.value?.input" :disabled="ctx.disabled.value || ctx.readonly.value" min="0" max="100" @blur="handleHslInput" @keydown.enter="handleHslInput" />
        <span class="s-color-picker__input-label">S</span>
      </div>
      <div class="s-color-picker__input-field">
        <input v-model.number="hslInputs.l" type="number" class="s-color-picker__input" :class="ctx.sizeConfig.value?.input" :disabled="ctx.disabled.value || ctx.readonly.value" min="0" max="100" @blur="handleHslInput" @keydown.enter="handleHslInput" />
        <span class="s-color-picker__input-label">L</span>
      </div>
      <div v-if="ctx.showAlpha.value" class="s-color-picker__input-field">
        <input v-model.number="hslInputs.a" type="number" class="s-color-picker__input" :class="ctx.sizeConfig.value?.input" :disabled="ctx.disabled.value || ctx.readonly.value" min="0" max="100" @blur="handleHslInput" @keydown.enter="handleHslInput" />
        <span class="s-color-picker__input-label">A</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  background: var(--s-muted);
  color: var(--s-muted-foreground);
  font-weight: 600;
  font-size: 0.625rem;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 2.5rem;
}

.s-color-picker__format-btn:hover {
  background: var(--s-accent);
  color: var(--s-foreground);
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
  background: var(--s-muted);
  color: var(--s-foreground);
  text-align: center;
  transition: all 0.2s ease;
}

.s-color-picker__input:focus {
  outline: none;
  border-color: var(--s-primary);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--s-primary) 15%, transparent);
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
  color: var(--s-muted-foreground);
  text-align: center;
  text-transform: uppercase;
}

@media (max-width: 400px) {
  .s-color-picker__input-group--rgb,
  .s-color-picker__input-group--hsl {
    flex-wrap: wrap;
  }

  .s-color-picker__input-field {
    min-width: calc(50% - 0.25rem);
    flex: 1 1 calc(50% - 0.25rem);
  }
}
</style>
