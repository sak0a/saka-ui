<script setup lang="ts">
import { SIcon, SApiSection, SApiTable } from '../../index'
import type { ApiProp } from '../../index'
import DemoSection from '../../components/DemoSection.vue'
import { CashOutline, LogoVue, LogoReact, LogoAngular, LogoNodejs } from '@vicons/ionicons5'

const depthLevelsCode = `<SIcon :component="CashOutline" :size="48" :depth="1" color="#10b981" />
<SIcon :component="CashOutline" :size="48" :depth="2" color="#10b981" />
<SIcon :component="CashOutline" :size="48" :depth="3" color="#10b981" />
<SIcon :component="CashOutline" :size="48" :depth="4" color="#10b981" />
<SIcon :component="CashOutline" :size="48" :depth="5" color="#10b981" />`

const sizesCode = `<SIcon :component="LogoVue" :size="24" color="#42b883" />
<SIcon :component="LogoVue" :size="32" color="#42b883" />
<SIcon :component="LogoVue" :size="48" color="#42b883" />
<SIcon :component="LogoVue" :size="64" color="#42b883" />`

const colorsCode = `<SIcon :component="LogoReact" :size="40" color="#61dafb" />
<SIcon :component="LogoAngular" :size="40" color="#dd1b16" />
<SIcon :component="LogoNodejs" :size="40" color="#68a063" />
<SIcon :component="CashOutline" :size="40" color="#f59e0b" />`

const mdiFontCode = `<SIcon :size="48" color="#3b82f6" :depth="1">
  <span class="mdi mdi-home" />
</SIcon>
<SIcon :size="56" color="#ec4899" :depth="1">
  <span class="mdi mdi-heart" />
</SIcon>
<SIcon :size="64" color="#f59e0b" :depth="1">
  <span class="mdi mdi-bell" />
</SIcon>
<SIcon :size="48" color="#8b5cf6" :depth="3">
  <span class="mdi mdi-cog" />
</SIcon>`

// API Reference data
const iconProps: ApiProp[] = [
  { name: 'component', type: 'Component', default: 'undefined', description: 'The icon component to display' },
  { name: 'size', type: 'number | string', default: '24', description: 'Icon size (px if number)' },
  { name: 'color', type: 'string', default: 'undefined', description: 'Icon color' },
  { name: 'depth', type: '1 | 2 | 3 | 4 | 5', default: 'undefined', description: 'Opacity level (1=1.0 ... 5=0.18)' },
]
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-(--s-text-primary) mb-2">Icons</h1>
      <p class="text-lg text-(--s-text-secondary)">A flexible icon wrapper component with depth, size, and color support.</p>
    </header>

    <!-- Basic Usage (Depth) -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Depth Levels</h2>
      <DemoSection 
        title="Depth Levels"
        description="Use the depth prop to control the opacity of the icon. Useful for creating visual hierarchy."
        :code="depthLevelsCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-8 items-center justify-center">
          <div class="flex flex-col items-center gap-3">
            <SIcon :component="CashOutline" :size="48" :depth="1" color="#10b981" />
            <span class="text-xs font-mono text-(--s-text-secondary)">depth="1" (1.0)</span>
          </div>
          <div class="flex flex-col items-center gap-3">
            <SIcon :component="CashOutline" :size="48" :depth="2" color="#10b981" />
            <span class="text-xs font-mono text-(--s-text-secondary)">depth="2" (0.82)</span>
          </div>
          <div class="flex flex-col items-center gap-3">
            <SIcon :component="CashOutline" :size="48" :depth="3" color="#10b981" />
            <span class="text-xs font-mono text-(--s-text-secondary)">depth="3" (0.60)</span>
          </div>
          <div class="flex flex-col items-center gap-3">
            <SIcon :component="CashOutline" :size="48" :depth="4" color="#10b981" />
            <span class="text-xs font-mono text-(--s-text-secondary)">depth="4" (0.38)</span>
          </div>
          <div class="flex flex-col items-center gap-3">
            <SIcon :component="CashOutline" :size="48" :depth="5" color="#10b981" />
            <span class="text-xs font-mono text-(--s-text-secondary)">depth="5" (0.18)</span>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Sizes & Colors -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Sizes & Colors</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Sizes -->
        <DemoSection 
          title="Sizes"
          description="Size accepts number (px) or string values."
          :code="sizesCode"
          language="vue"
        >
          <div class="flex items-end gap-4">
            <SIcon :component="LogoVue" :size="24" color="#42b883" />
            <SIcon :component="LogoVue" :size="32" color="#42b883" />
            <SIcon :component="LogoVue" :size="48" color="#42b883" />
            <SIcon :component="LogoVue" :size="64" color="#42b883" />
          </div>
        </DemoSection>

        <!-- Colors -->
        <DemoSection 
          title="Colors"
          description="Any valid CSS color string is supported."
          :code="colorsCode"
          language="vue"
        >
          <div class="flex items-center gap-6 justify-around">
            <SIcon :component="LogoReact" :size="40" color="#61dafb" />
            <SIcon :component="LogoAngular" :size="40" color="#dd1b16" />
            <SIcon :component="LogoNodejs" :size="40" color="#68a063" />
            <SIcon :component="CashOutline" :size="40" color="#f59e0b" />
          </div>
        </DemoSection>
      </div>
    </section>

    <!-- MDI Font Icons -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">MDI Font Icons</h2>
      <DemoSection 
        title="MDI Font Icons"
        description="SIcon also works with font-based icons (like MDI) passed via the default slot. Props like size, color, and depth are inherited."
        :code="mdiFontCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-8 items-center justify-center">
          <div class="flex flex-col items-center gap-3">
             <SIcon :size="48" color="#3b82f6" :depth="1">
               <span class="mdi mdi-home" />
             </SIcon>
             <span class="text-xs font-mono text-(--s-text-secondary)">size="48"</span>
          </div>
          <div class="flex flex-col items-center gap-3">
             <SIcon :size="56" color="#ec4899" :depth="1">
               <span class="mdi mdi-heart" />
             </SIcon>
             <span class="text-xs font-mono text-(--s-text-secondary)">size="56"</span>
          </div>
           <div class="flex flex-col items-center gap-3">
             <SIcon :size="64" color="#f59e0b" :depth="1">
               <span class="mdi mdi-bell" />
             </SIcon>
             <span class="text-xs font-mono text-(--s-text-secondary)">size="64"</span>
          </div>
           <div class="flex flex-col items-center gap-3">
             <SIcon :size="48" color="#8b5cf6" :depth="3">
               <span class="mdi mdi-cog" />
             </SIcon>
             <span class="text-xs font-mono text-(--s-text-secondary)">depth="3"</span>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Real-World Examples -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Real-World Examples</h2>
      <DemoSection 
        title="Icon Navigation Bar"
        description="Common icon usage in navigation elements."
        :code="mdiFontCode"
        language="vue"
      >
        <div class="flex items-center justify-around bg-(--s-bg-secondary) p-4 rounded-xl max-w-md mx-auto">
          <SIcon :size="28" color="var(--s-primary)" :depth="1">
            <span class="mdi mdi-home" />
          </SIcon>
          <SIcon :size="28" color="var(--s-text-secondary)" :depth="2">
            <span class="mdi mdi-magnify" />
          </SIcon>
          <SIcon :size="28" color="var(--s-text-secondary)" :depth="2">
            <span class="mdi mdi-heart-outline" />
          </SIcon>
          <SIcon :size="28" color="var(--s-text-secondary)" :depth="2">
            <span class="mdi mdi-account-outline" />
          </SIcon>
        </div>
      </DemoSection>
    </section>

    <!-- API Reference -->
    <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">API Reference</h2>
    <SApiSection>
      <SApiTable title="Props" type="props" :props="iconProps" />
    </SApiSection>
  </div>
</template>
