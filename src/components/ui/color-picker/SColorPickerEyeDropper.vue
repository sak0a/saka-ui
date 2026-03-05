<script setup lang="ts">
import { ref, inject, onMounted } from 'vue'
import { SColorPickerContextKey, type SColorPickerContext } from './SColorPicker.vue'

const ctx = inject<SColorPickerContext>(SColorPickerContextKey)
if (!ctx) console.warn('[SColorPickerEyeDropper] Must be used inside SColorPicker')

const supportsEyeDropper = ref(false)

onMounted(() => {
  supportsEyeDropper.value = typeof window !== 'undefined' && 'EyeDropper' in window
})

async function openEyeDropper() {
  if (ctx?.disabled.value || ctx?.readonly.value || !supportsEyeDropper.value) return

  try {
    // @ts-expect-error EyeDropper API may not be in types
    const eyeDropper = new EyeDropper()
    const result = await eyeDropper.open()
    ctx?.parseColor(result.sRGBHex)
    ctx?.emitChange()
  } catch {
    // User cancelled or error
  }
}
</script>

<template>
  <button
    v-if="supportsEyeDropper"
    type="button"
    class="s-color-picker__tool-btn"
    title="Pick color from screen"
    :disabled="ctx?.disabled.value || ctx?.readonly.value"
    @click="openEyeDropper"
  >
    <slot>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m2 22 1-1h3l9-9" />
        <path d="M3 21v-3l9-9" />
        <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z" />
      </svg>
    </slot>
  </button>
</template>

<style scoped>
.s-color-picker__tool-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem;
  border: 1px solid var(--s-border);
  background: var(--s-muted);
  color: var(--s-muted-foreground);
  cursor: pointer;
  transition: all 0.2s ease;
}

.s-color-picker__tool-btn:hover:not(:disabled) {
  background: var(--s-accent);
  color: var(--s-foreground);
  border-color: var(--s-primary);
}
</style>
