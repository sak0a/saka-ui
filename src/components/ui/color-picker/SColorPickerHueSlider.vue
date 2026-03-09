<script setup lang="ts">
import { ref, computed, inject, onBeforeUnmount } from 'vue'
import { SColorPickerContextKey, type SColorPickerContext } from './context'

const ctx = inject<SColorPickerContext>(SColorPickerContextKey)
if (!ctx) console.warn('[SColorPickerHueSlider] Must be used inside SColorPicker')

const sliderRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)

const cursorPosition = computed(() => ({
  left: `${((ctx?.hsva.value.h ?? 0) / 360) * 100}%`
}))

function updateFromEvent(event: MouseEvent) {
  if (!sliderRef.value || !ctx) return
  const rect = sliderRef.value.getBoundingClientRect()
  const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width))
  ctx.hsva.value.h = (x / rect.width) * 360
  ctx.emitInput()
}

function updateFromTouch(event: TouchEvent) {
  if (!sliderRef.value || !ctx || !event.touches[0]) return
  const rect = sliderRef.value.getBoundingClientRect()
  const x = Math.max(0, Math.min(event.touches[0].clientX - rect.left, rect.width))
  ctx.hsva.value.h = (x / rect.width) * 360
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
    class="s-color-picker__slider s-color-picker__slider--hue"
    :class="ctx?.sizeConfig.value?.slider"
    @mousedown="onMouseDown"
    @touchstart="onTouchStart"
  >
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
