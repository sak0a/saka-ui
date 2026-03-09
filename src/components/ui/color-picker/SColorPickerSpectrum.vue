<script setup lang="ts">
import { ref, computed, inject, onBeforeUnmount } from 'vue'
import { SColorPickerContextKey, type SColorPickerContext } from './context'

const ctx = inject<SColorPickerContext>(SColorPickerContextKey)
if (!ctx) console.warn('[SColorPickerSpectrum] Must be used inside SColorPicker')

const spectrumRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)

const hueColor = computed(() => {
  if (!ctx) return 'rgb(0,0,0)'
  const rgb = ctx.hsvToRgb(ctx.hsva.value.h, 100, 100)
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
})

const spectrumStyle = computed(() => ({
  background: `linear-gradient(to top, #000, transparent),
               linear-gradient(to right, #fff, ${hueColor.value})`
}))

const cursorPosition = computed(() => ({
  left: `${ctx?.hsva.value.s ?? 0}%`,
  top: `${100 - (ctx?.hsva.value.v ?? 0)}%`
}))

function updateFromEvent(event: MouseEvent) {
  if (!spectrumRef.value || !ctx) return
  const rect = spectrumRef.value.getBoundingClientRect()
  const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width))
  const y = Math.max(0, Math.min(event.clientY - rect.top, rect.height))
  ctx.hsva.value.s = (x / rect.width) * 100
  ctx.hsva.value.v = 100 - (y / rect.height) * 100
  ctx.emitInput()
}

function updateFromTouch(event: TouchEvent) {
  if (!spectrumRef.value || !ctx || !event.touches[0]) return
  const rect = spectrumRef.value.getBoundingClientRect()
  const x = Math.max(0, Math.min(event.touches[0].clientX - rect.left, rect.width))
  const y = Math.max(0, Math.min(event.touches[0].clientY - rect.top, rect.height))
  ctx.hsva.value.s = (x / rect.width) * 100
  ctx.hsva.value.v = 100 - (y / rect.height) * 100
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
    ref="spectrumRef"
    class="s-color-picker__spectrum w-full"
    :class="ctx?.sizeConfig.value?.spectrumHeight"
    :style="spectrumStyle"
    @mousedown="onMouseDown"
    @touchstart="onTouchStart"
  >
    <div
      class="s-color-picker__spectrum-cursor"
      :class="{ 's-color-picker__spectrum-cursor--dragging': isDragging }"
      :style="cursorPosition"
    >
      <div class="s-color-picker__spectrum-cursor-inner" :style="{ backgroundColor: ctx?.currentHex.value }"></div>
    </div>
  </div>
</template>

<style scoped>
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
</style>
