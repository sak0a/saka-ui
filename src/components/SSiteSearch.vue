<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHotkey } from '../composables/useHotkey'
import { searchSite } from '../data/siteNavigation'

const route = useRoute()
const router = useRouter()

const isOpen = ref(false)
const query = ref('')
const activeIndex = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)

const shortcutLabel = computed(() => {
  if (typeof navigator === 'undefined') return 'Ctrl K'
  return /Mac|iPhone|iPad|iPod/i.test(navigator.platform) ? 'Cmd K' : 'Ctrl K'
})

const results = computed(() => searchSite(query.value, route.path, 9))
const hasQuery = computed(() => query.value.trim().length > 0)

function focusInput() {
  nextTick(() => {
    inputRef.value?.focus()
    inputRef.value?.select()
  })
}

function openSearch() {
  isOpen.value = true
  focusInput()
}

function closeSearch() {
  isOpen.value = false
  query.value = ''
  activeIndex.value = 0
}

async function goToResult(index: number) {
  const target = results.value[index]
  if (!target) return

  await router.push(target.href)
  closeSearch()
}

function moveSelection(direction: 1 | -1) {
  if (!results.value.length) return

  const nextIndex = activeIndex.value + direction
  if (nextIndex < 0) {
    activeIndex.value = results.value.length - 1
    return
  }

  if (nextIndex >= results.value.length) {
    activeIndex.value = 0
    return
  }

  activeIndex.value = nextIndex
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    moveSelection(1)
    return
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    moveSelection(-1)
    return
  }

  if (event.key === 'Enter') {
    event.preventDefault()
    goToResult(activeIndex.value)
  }
}

watch(results, (newResults) => {
  if (!newResults.length) {
    activeIndex.value = 0
    return
  }

  if (activeIndex.value >= newResults.length) {
    activeIndex.value = 0
  }
})

watch(isOpen, (open) => {
  if (open) focusInput()
})

watch(() => route.fullPath, () => {
  if (isOpen.value) closeSearch()
})

useHotkey('meta+k', (event) => {
  event.preventDefault()
  if (isOpen.value) {
    closeSearch()
    return
  }

  openSearch()
}, { preventDefault: true })

useHotkey('ctrl+k', (event) => {
  event.preventDefault()
  if (isOpen.value) {
    closeSearch()
    return
  }

  openSearch()
}, { preventDefault: true })
</script>

<template>
  <div class="contents">
    <button
      type="button"
      class="inline-flex min-w-0 items-center gap-3 rounded-xl border border-border bg-background px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground md:min-w-72"
      @click="openSearch"
      aria-label="Open site search"
    >
      <span class="mdi mdi-magnify text-lg"></span>
      <span class="min-w-0 flex-1 truncate hidden sm:inline">Search docs, components, examples...</span>
      <span class="sm:hidden">Search</span>
      <span class="hidden rounded-md border border-border bg-card px-2 py-0.5 text-xs sm:inline">{{ shortcutLabel }}</span>
    </button>

    <teleport to="body">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 bg-black/45 px-4 py-8 backdrop-blur-sm"
        @click.self="closeSearch"
      >
        <div class="mx-auto flex max-w-3xl flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
          <div class="border-b border-border px-4 py-4 sm:px-5">
            <div class="flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3 focus-within:border-primary/40">
              <span class="mdi mdi-magnify text-xl text-muted-foreground"></span>
              <input
                ref="inputRef"
                v-model="query"
                type="text"
                class="min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
                placeholder="Search docs, components, examples, composables..."
                @keydown="onKeydown"
              />
              <button
                type="button"
                class="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                @click="closeSearch"
              >
                Esc
              </button>
            </div>
          </div>

          <div class="max-h-[70vh] overflow-y-auto p-3">
            <div v-if="results.length" class="space-y-2">
              <button
                v-for="(result, index) in results"
                :key="result.id"
                type="button"
                class="flex w-full items-start gap-4 rounded-2xl px-4 py-3 text-left transition-colors"
                :class="index === activeIndex
                  ? 'bg-primary/10 text-foreground'
                  : 'hover:bg-muted/80 text-foreground'"
                @mouseenter="activeIndex = index"
                @click="goToResult(index)"
              >
                <div class="mt-0.5 rounded-xl bg-background px-2 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  {{ result.category }}
                </div>

                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2">
                    <p class="truncate text-sm font-semibold">{{ result.title }}</p>
                    <span
                      v-if="index === 0 && hasQuery"
                      class="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-medium text-primary"
                    >
                      Best match
                    </span>
                  </div>

                  <p class="mt-1 text-sm text-muted-foreground">{{ result.description }}</p>

                  <div class="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span class="rounded-full bg-background px-2 py-1">{{ result.href }}</span>
                    <span class="truncate">{{ result.reasons[0] }}</span>
                  </div>
                </div>

                <span class="mdi mdi-arrow-top-right text-lg text-muted-foreground"></span>
              </button>
            </div>

            <div v-else class="rounded-2xl border border-dashed border-border px-6 py-12 text-center">
              <p class="text-sm font-medium text-foreground">No results for "{{ query }}"</p>
              <p class="mt-2 text-sm text-muted-foreground">
                Try component names, composables, setup terms like "install" or "theme", or example flows like "auth".
              </p>
            </div>
          </div>

          <div class="border-t border-border bg-background/80 px-4 py-3 text-xs text-muted-foreground sm:px-5">
            <div class="flex flex-wrap items-center gap-3">
              <span><span class="font-medium text-foreground">Enter</span> open</span>
              <span><span class="font-medium text-foreground">Up/Down</span> move</span>
              <span><span class="font-medium text-foreground">{{ shortcutLabel }}</span> toggle</span>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>
