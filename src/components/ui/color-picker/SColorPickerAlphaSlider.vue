<script setup lang="ts">
import { ref, computed, inject, onBeforeUnmount } from 'vue'
import { SColorPickerContextKey, type SColorPickerContext } from './SColorPicker.vue'

const ctx = inject<SColorPickerContext>(SColorPickerContextKey)
if (!ctx) console.warn('[SColorPickerAlphaSlider] Must be used inside SColorPicker')

const sliderRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)

const cursorPosition = computed(() => ({
  left: `${(ctx?.hsva.value.a ?? 1) * 100}%`
}))

const alphaGradient = computed(() => {
  if (!ctx) return ''
  const { r, g, b } = ctx.currentRgb.value
  return `linear-gradient(to right, transparent, rgb(${r}, ${g}, ${b}))`
})

function updateFromEvent(event: MouseEvent) {
  if (!sliderRef.value || !ctx) return
  const rect = sliderRef.value.getBoundingClientRect()
  const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width))
  ctx.hsva.value.a = x / rect.width
  ctx.emitInput()
}

function updateFromTouch(event: TouchEvent) {
  if (!sliderRef.value || !ctx || !event.touches[0]) return
  const rect = sliderRef.value.getBoundingClientRect()
  const x = Math.max(0, Math.min(event.touches[0].clientX - rect.left, rect.width))
  ctx.hsva.value.a = x / rect.width
  ctx.emitInput()
}

function onMouseDown(event: MouseEvent) {
  if (ctx?.disabled.value || ctx?.readonly.value) return
  isDragging.value = true
  updateFromEvent(event)
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

function onTouchStart(event: TouchEvent) {
  if (ctx?.disabled.value || ctx?.readonly.value) return
  event.preventDefault()
  isDragging.value = true
  updateFromTouch(event)
  document.addEventListener('touchmove', onTouchMove, { passive: false })
  document.addEventListener('touchend', onTouchEnd)
}

function onMouseMove(event: MouseEvent) {
  if (!isDragging.value) return
  updateFromEvent(event)
}

function onTouchMove(event: TouchEvent) {
  if (!isDragging.value) return
  event.preventDefault()
  updateFromTouch(event)
}

function onMouseUp() {
  isDragging.value = false
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
  ctx?.emitChange()
}

function onTouchEnd() {
  isDragging.value = false
  document.removeEventListener('touchmove', onTouchMove)
  document.removeEventListener('touchend', onTouchEnd)
  ctx?.emitChange()
}

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
  document.removeEventListener('touchmove', onTouchMove)
  document.removeEventListener('touchend', onTouchEnd)
})
</script>

<template>
  <div
    ref="sliderRef"
    class="s-color-picker__slider s-color-picker__slider--alpha"
    :class="ctx?.sizeConfig.value?.slider"
    @mousedown="onMouseDown"
    @touchstart="onTouchStart"
  >
    <div class="s-color-picker__slider-alpha-bg"></div>
    <div
      class="s-color-picker__slider-alpha-gradient"
      :style="{ background: alphaGradient }"
    ></div>
    <div
      class="s-color-picker__slider-cursor"
      :class="{ 's-color-picker__slider-cursor--dragging': isDragging }"
      :style="cursorPosition"
    ></div>
  </div>
</template>

<style scoped>
.s-color-picker__slider {
  position: relative;
  border-radius: 999px;
  cursor: pointer;
  overflow: hidden;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
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
</style>
