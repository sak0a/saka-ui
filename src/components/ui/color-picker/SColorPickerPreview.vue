<script setup lang="ts">
import { computed, inject } from 'vue'
import { SColorPickerContextKey, type SColorPickerContext } from './SColorPicker.vue'

const ctx = inject<SColorPickerContext>(SColorPickerContextKey)
if (!ctx) console.warn('[SColorPickerPreview] Must be used inside SColorPicker')

const bgColor = computed(() => {
  if (!ctx) return '#000'
  if (ctx.showAlpha.value) {
    const { r, g, b } = ctx.currentRgb.value
    return `rgba(${r}, ${g}, ${b}, ${ctx.hsva.value.a})`
  }
  return ctx.currentHex.value
})
</script>

<template>
  <div class="s-color-picker__preview">
    <div
      class="s-color-picker__preview-color"
      :style="{ backgroundColor: bgColor }"
    ></div>
  </div>
</template>

<style scoped>
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
</style>
