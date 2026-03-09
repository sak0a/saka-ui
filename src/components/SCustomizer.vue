<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useCustomizer, type IconPack } from '../composables/useCustomizer'

const { iconPack } = useCustomizer()
const isOpen = ref(false)
const panelRef = ref<HTMLElement | null>(null)
const buttonRef = ref<HTMLElement | null>(null)

const toggle = () => { isOpen.value = !isOpen.value }

const handleClickOutside = (e: MouseEvent) => {
  if (!isOpen.value) return
  const target = e.target as Node
  if (panelRef.value?.contains(target) || buttonRef.value?.contains(target)) return
  isOpen.value = false
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('mousedown', handleClickOutside))

const packs: { value: IconPack; label: string; desc: string }[] = [
  { value: 'mdi', label: 'MDI', desc: 'Material Design Icons' },
  { value: 'lucide', label: 'Lucide', desc: 'Lucide Icons' },
]
</script>

<template>
  <div class="fixed bottom-6 right-6 z-[9998]">
    <!-- Popover panel -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-2 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-2 scale-95"
    >
      <div
        v-if="isOpen"
        ref="panelRef"
        class="absolute bottom-16 right-0 w-72 rounded-xl border border-border bg-card shadow-2xl shadow-black/20 overflow-hidden"
      >
        <!-- Header -->
        <div class="px-4 py-3 border-b border-border bg-muted/30">
          <h3 class="text-sm font-semibold text-foreground">Customizer</h3>
          <p class="text-xs text-muted-foreground mt-0.5">Adjust demo appearance</p>
        </div>

        <!-- Icon Pack -->
        <div class="p-4 space-y-3">
          <div>
            <label class="text-xs font-medium text-muted-foreground uppercase tracking-wider">Icon Pack</label>
            <div class="mt-2 grid grid-cols-2 gap-2">
              <button
                v-for="pack in packs"
                :key="pack.value"
                @click="iconPack = pack.value"
                class="relative px-3 py-2.5 rounded-lg border text-left transition-all duration-150"
                :class="iconPack === pack.value
                  ? 'border-primary bg-primary/10 text-foreground ring-1 ring-primary/30'
                  : 'border-border bg-background text-muted-foreground hover:border-border hover:bg-muted/50'"
              >
                <div class="text-sm font-medium">{{ pack.label }}</div>
                <div class="text-[10px] opacity-70 mt-0.5">{{ pack.desc }}</div>
                <!-- Active indicator -->
                <div
                  v-if="iconPack === pack.value"
                  class="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary"
                />
              </button>
            </div>
          </div>

          <!-- Placeholder for future options -->
          <div class="pt-2 border-t border-border">
            <p class="text-[10px] text-muted-foreground/60 text-center">More options coming soon</p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Trigger button -->
    <button
      ref="buttonRef"
      @click="toggle"
      class="w-11 h-11 rounded-full border border-border bg-card shadow-lg shadow-black/15 flex items-center justify-center transition-all duration-200 hover:scale-105 hover:shadow-xl hover:border-primary/40 active:scale-95"
      :class="isOpen ? 'border-primary/50 bg-primary/10' : ''"
      title="Customizer"
    >
      <span class="mdi mdi-palette-swatch-variant text-lg" :class="isOpen ? 'text-primary' : 'text-muted-foreground'" />
    </button>
  </div>
</template>
