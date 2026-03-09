import { ref, watch, computed } from 'vue'
import { type IconPack, resolveIcon as _resolveIcon } from '../lib/iconMap'
import type { IconProp } from '../lib/icon'

export type { IconPack } from '../lib/iconMap'

const STORAGE_KEY = 'saka-ui-customizer'

interface CustomizerState {
  iconPack: IconPack
}

function loadState(): CustomizerState {
  if (typeof window === 'undefined') return { iconPack: 'mdi' }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return { iconPack: 'mdi' }
}

// Global singleton state
const state = ref<CustomizerState>(loadState())

watch(state, (v) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(v))
  }
}, { deep: true })

export function useCustomizer() {
  const iconPack = computed({
    get: () => state.value.iconPack,
    set: (v: IconPack) => { state.value.iconPack = v }
  })

  /** Resolve an MDI icon name to the correct IconProp for the current pack */
  const ri = (mdiName: string): IconProp => _resolveIcon(mdiName, state.value.iconPack)

  return {
    iconPack,
    ri,
  }
}
