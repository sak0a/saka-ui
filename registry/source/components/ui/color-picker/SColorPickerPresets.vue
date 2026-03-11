<script setup lang="ts">
import { inject } from 'vue'
import { SColorPickerContextKey, type SColorPickerContext } from './context'

export interface Props {
  presets?: string[]
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  presets: () => [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
    '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
    '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#000000',
    '#ffffff', '#6b7280'
  ],
  label: 'Presets'
})

const ctx = inject<SColorPickerContext>(SColorPickerContextKey)
if (!ctx) console.warn('[SColorPickerPresets] Must be used inside SColorPicker')
</script>

<template>
  <div v-if="ctx && presets.length" class="s-color-picker__presets">
    <div class="s-color-picker__presets-label">{{ label }}</div>
    <div class="s-color-picker__swatches">
      <button
        v-for="color in presets"
        :key="color"
        type="button"
        class="s-color-picker__swatch"
        :class="[ctx.sizeConfig.value?.swatch, { 's-color-picker__swatch--active': ctx.currentHex.value.toUpperCase() === color.toUpperCase() }]"
        :style="{ backgroundColor: color }"
        :title="color"
        :disabled="ctx.disabled.value || ctx.readonly.value"
        @click="ctx.selectPreset(color)"
      ></button>
    </div>
  </div>
</template>

<style scoped>
.s-color-picker__presets {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.s-color-picker__presets-label {
  font-size: 0.625rem;
  font-weight: 600;
  color: var(--s-muted-foreground);
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
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--s-primary) 15%, transparent);
}

@media (max-width: 400px) {
  .s-color-picker__swatches {
    justify-content: flex-start;
  }
}
</style>
