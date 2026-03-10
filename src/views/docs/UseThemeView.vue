<script setup lang="ts">
import { computed } from 'vue'
import { 
  SButton, SApiSection, SApiTable, SCard, SCardContent
} from '../../index'
import { useTheme } from '../../composables/useTheme'
import type { ApiProp, ApiMethod } from '../../index'
import DemoSection from '../../components/DemoSection.vue'

// Demo
const { theme, toggleTheme } = useTheme()
const isDark = computed(() => {
  if (theme.value === 'system') {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return theme.value === 'dark'
})

// Code snippets
const basicCode = `import { useTheme } from '@sakoa/ui'

const { theme, toggleTheme, isDark } = useTheme()

// theme.value = 'light' | 'dark' | 'system'
// isDark.value = true/false (computed)
// toggleTheme() cycles through themes`

const customCode = `// Get current theme
const { theme } = useTheme()
console.log(theme.value) // 'dark'

// Check if dark mode is active
const { isDark } = useTheme()
if (isDark.value) {
  // Dark mode styling
}

// Toggle between light/dark/system
const { toggleTheme } = useTheme()
toggleTheme() // light → dark → system → light...`

const cssVarsCode = `/* Theme-aware CSS variables are automatically applied */
.my-element {
  background: var(--s-bg-primary);
  color: var(--s-text-primary);
  border: 1px solid var(--s-border);
}

/* Available variables: */
--s-bg-primary      /* Main background */
--s-bg-secondary    /* Secondary background */
--s-text-primary    /* Main text color */
--s-text-secondary  /* Secondary text */
--s-text-tertiary   /* Muted text */
--s-border          /* Border color */
--s-primary         /* Primary brand color */
--s-primary-alpha   /* Primary with transparency */`

// API
const themeProps: ApiProp[] = [
  { name: 'theme', type: "Ref<'light' | 'dark' | 'system'>", description: 'Current theme setting' },
  { name: 'isDark', type: 'ComputedRef<boolean>', description: 'Whether dark mode is currently active (accounts for system preference)' },
]

const themeMethods: ApiMethod[] = [
  { name: 'toggleTheme()', description: 'Cycles through themes: light → dark → system → light' },
]
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-(--s-text-primary) mb-2">useTheme</h1>
      <p class="text-lg text-(--s-text-secondary)">
        Composable for managing light/dark/system theme with automatic persistence.
      </p>
    </header>

    <!-- Features -->
    <article>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-theme-light-dark text-xl text-violet-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Light/Dark/System</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Three theme modes with system preference detection.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-content-save text-xl text-emerald-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Persistent</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Theme preference saved to localStorage.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-palette text-xl text-blue-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">CSS Variables</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Theme-aware CSS variables for easy styling.</p>
        </div>
      </div>
    </article>

    <!-- Basic Usage -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Basic Usage</h2>
      <DemoSection 
        title="Import & Use"
        description="The composable provides reactive theme state and toggle function."
        :code="basicCode"
        language="typescript"
      >
        <SCard variant="outlined" class="max-w-md mx-auto">
          <SCardContent class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-(--s-text-primary)">Current theme:</span>
              <span class="font-mono px-3 py-1 rounded bg-(--s-bg-secondary) text-(--s-primary)">{{ theme }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-(--s-text-primary)">Is dark mode:</span>
              <span class="font-mono px-3 py-1 rounded" :class="isDark ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'">
                {{ isDark }}
              </span>
            </div>
            <SButton block @click="toggleTheme">
              <span class="mdi mdi-theme-light-dark mr-2"></span>
              Toggle Theme
            </SButton>
          </SCardContent>
        </SCard>
      </DemoSection>
    </section>

    <!-- Examples -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Examples</h2>
      <DemoSection 
        title="Common Patterns"
        description="Different ways to use the theme composable."
        :code="customCode"
        language="typescript"
        code-only
      />
    </section>

    <!-- CSS Variables -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">CSS Variables</h2>
      <DemoSection 
        title="Theme-Aware Styling"
        description="Use CSS variables that automatically update with theme changes."
        :code="cssVarsCode"
        language="css"
        code-only
      />
    </section>

    <!-- API Reference -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">API Reference</h2>
      
      <SApiSection title="useTheme()">
        <SApiTable title="Returns" :props="themeProps" type="props" />
        <SApiTable title="Methods" :methods="themeMethods" type="methods" />
      </SApiSection>
    </section>
  </div>
</template>
