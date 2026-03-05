<script setup lang="ts">
import { ref, inject } from 'vue'
import { SColorPickerContextKey, type SColorPickerContext } from './SColorPicker.vue'

const ctx = inject<SColorPickerContext>(SColorPickerContextKey)
if (!ctx) console.warn('[SColorPickerCopy] Must be used inside SColorPicker')

const copied = ref(false)

async function copyToClipboard() {
  if (!ctx) return

  try {
    await navigator.clipboard.writeText(ctx.displayValue.value)
    copied.value = true
    setTimeout(() => copied.value = false, 1500)
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = ctx.displayValue.value
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    copied.value = true
    setTimeout(() => copied.value = false, 1500)
  }
}
</script>

<template>
  <button
    type="button"
    class="s-color-picker__tool-btn"
    :class="{ 's-color-picker__tool-btn--copied': copied }"
    title="Copy color"
    @click="copyToClipboard"
  >
    <slot :copied="copied">
      <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 6 9 17l-5-5" />
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

.s-color-picker__tool-btn--copied {
  background: var(--s-primary);
  color: white;
  border-color: var(--s-primary);
}
</style>
