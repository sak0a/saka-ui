<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import { SApiSection, SButton } from '../../index'

const brandOverrideCode = `/* In your app's global CSS (e.g. main.css) */
:root {
  --s-primary: #6366f1;           /* Indigo */
  --s-primary-foreground: #ffffff;
  --s-ring: #6366f1;
}

:root.dark {
  --s-primary: #818cf8;           /* Indigo lighter */
  --s-primary-foreground: #1e1b4b;
  --s-ring: #818cf8;
}`

const fullThemeCode = `/* Custom theme: Ocean */
:root {
  --s-background: #f8fafc;
  --s-foreground: #0f172a;
  --s-card: #ffffff;
  --s-card-foreground: #0f172a;
  --s-muted: #f1f5f9;
  --s-muted-foreground: #64748b;
  --s-primary: #0ea5e9;
  --s-primary-foreground: #ffffff;
  --s-secondary: #f1f5f9;
  --s-secondary-foreground: #0f172a;
  --s-accent: #e0f2fe;
  --s-accent-foreground: #0c4a6e;
  --s-border: #e2e8f0;
  --s-input: #e2e8f0;
  --s-ring: #0ea5e9;
}

:root.dark {
  --s-background: #0c1222;
  --s-foreground: #e2e8f0;
  --s-card: #0c1222;
  --s-card-foreground: #e2e8f0;
  --s-muted: #1e293b;
  --s-muted-foreground: #94a3b8;
  --s-primary: #38bdf8;
  --s-primary-foreground: #0c4a6e;
  --s-secondary: #1e293b;
  --s-secondary-foreground: #e2e8f0;
  --s-accent: #1e293b;
  --s-accent-foreground: #e2e8f0;
  --s-border: #1e293b;
  --s-input: #1e293b;
  --s-ring: #38bdf8;
}`

const radiusOverrideCode = `/* Sharp corners theme */
:root {
  --s-radius-sm: 0.125rem;  /* 2px */
  --s-radius-md: 0.25rem;   /* 4px */
  --s-radius-lg: 0.375rem;  /* 6px */
  --s-radius-xl: 0.5rem;    /* 8px */
}

/* Fully rounded theme */
:root {
  --s-radius-sm: 0.5rem;
  --s-radius-md: 0.75rem;
  --s-radius-lg: 1rem;
  --s-radius-xl: 1.5rem;
}`

const classOverrideCode = `<!-- Override background -->
<SButton class="bg-blue-500 hover:bg-blue-600 text-white">
  Custom Blue
</SButton>

<!-- Override multiple properties -->
<SCard class="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-none">
  <SCardContent>Gradient card</SCardContent>
</SCard>

<!-- Add shadow to a flat variant -->
<SButton variant="outlined" class="shadow-md">
  Elevated Outline
</SButton>`

const colorPropCode = `<!-- Per-instance color override -->
<SButton color="#ec4899">Pink</SButton>
<SButton color="#10b981" variant="outlined">Green</SButton>
<SChip color="#f59e0b">Amber</SChip>
<SBadge color="#8b5cf6">Purple</SBadge>

<!-- Works with CSS variables too -->
<SButton color="var(--my-brand-color)">Brand</SButton>`

const scopedOverrideCode = `<!-- Scoped theme section -->
<div style="
  --s-primary: #e11d48;
  --s-primary-foreground: #fff1f2;
">
  <!-- All components inside use rose theme -->
  <SButton>Rose Primary</SButton>
  <SButton variant="outlined">Rose Outlined</SButton>
  <SBadge>Rose Badge</SBadge>
</div>`

const darkModeCode = `<!-- Add .dark class to <html> for dark mode -->
<html class="dark">
  <!-- All tokens automatically flip -->
</html>

<!-- Using the useTheme composable -->
<script setup>
import { useTheme } from 'saka-ui'

const { theme, toggleTheme, setTheme } = useTheme()

// theme.value is 'light' | 'dark' | 'system'
setTheme('dark')
<\/script>`

const presetColors = [
  { name: 'Zinc (default)', light: '#18181b', dark: '#fafafa' },
  { name: 'Blue', light: '#2563eb', dark: '#60a5fa' },
  { name: 'Green', light: '#16a34a', dark: '#4ade80' },
  { name: 'Violet', light: '#7c3aed', dark: '#a78bfa' },
  { name: 'Orange', light: '#ea580c', dark: '#fb923c' },
  { name: 'Rose', light: '#e11d48', dark: '#fb7185' },
  { name: 'Sky', light: '#0284c7', dark: '#38bdf8' },
  { name: 'Amber', light: '#d97706', dark: '#fbbf24' },
]
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-12">
    <!-- Page Header -->
    <div>
      <h1 class="text-4xl font-bold text-foreground mb-3">Customization</h1>
      <p class="text-lg text-muted-foreground">
        Customize Saka UI to match your brand. Override CSS tokens, use the color prop, or pass class overrides.
      </p>
    </div>

    <!-- Quick Start -->
    <SApiSection title="Quick Start: Brand Color" id="brand-color">
      <p class="text-muted-foreground mb-4">
        The fastest way to brand Saka UI is overriding the primary color tokens.
        All components using <code class="text-xs bg-accent px-1 py-0.5 rounded">bg-primary</code>, <code class="text-xs bg-accent px-1 py-0.5 rounded">text-primary</code>, etc. will automatically reflect your brand color.
      </p>
    </SApiSection>

    <DemoSection title="Override Primary Color" :code="brandOverrideCode" language="css" code-only />

    <!-- Preset Colors -->
    <SApiSection title="Preset Color Options" id="preset-colors">
      <p class="text-muted-foreground mb-4">
        Here are some ready-to-use primary color values. Click to see how they look in both light and dark modes.
      </p>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div v-for="c in presetColors" :key="c.name" class="space-y-2">
          <div class="flex gap-1">
            <div class="flex-1 h-12 rounded-l-lg" :style="{ backgroundColor: c.light }" />
            <div class="flex-1 h-12 rounded-r-lg" :style="{ backgroundColor: c.dark }" />
          </div>
          <div class="text-xs text-center">
            <div class="text-foreground font-medium">{{ c.name }}</div>
            <div class="text-muted-foreground font-mono">{{ c.light }}</div>
          </div>
        </div>
      </div>
    </SApiSection>

    <!-- Full Theme Override -->
    <SApiSection title="Full Theme Override" id="full-theme">
      <p class="text-muted-foreground mb-4">
        For a completely custom look, override all the semantic color tokens. This example shows an "Ocean" theme:
      </p>
    </SApiSection>

    <DemoSection title="Complete Theme Example" :code="fullThemeCode" language="css" code-only />

    <!-- Border Radius Override -->
    <SApiSection title="Border Radius" id="border-radius">
      <p class="text-muted-foreground mb-4">
        Change the feel of all components from sharp to fully rounded by overriding the radius scale:
      </p>
    </SApiSection>

    <DemoSection title="Radius Override Examples" :code="radiusOverrideCode" language="css" code-only />

    <!-- Three Layers of Customization -->
    <SApiSection title="Three Layers of Customization" id="layers">
      <div class="space-y-6">
        <!-- Layer 1: Theme Tokens -->
        <div class="bg-muted rounded-xl p-5 border border-border">
          <div class="flex items-center gap-3 mb-3">
            <span class="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</span>
            <h3 class="text-lg font-semibold text-foreground">Theme Tokens (Global)</h3>
          </div>
          <p class="text-sm text-muted-foreground mb-3">
            Override CSS custom properties to change the entire app. All components reading the same token update together.
          </p>
          <div class="font-mono text-xs text-primary bg-accent rounded px-3 py-2">
            :root { --s-primary: #6366f1; }
          </div>
        </div>

        <!-- Layer 2: Color Prop -->
        <div class="bg-muted rounded-xl p-5 border border-border">
          <div class="flex items-center gap-3 mb-3">
            <span class="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</span>
            <h3 class="text-lg font-semibold text-foreground">Color Prop (Per-Instance)</h3>
          </div>
          <p class="text-sm text-muted-foreground mb-3">
            Pass a <code class="text-xs bg-accent px-1 py-0.5 rounded">color</code> prop to override the accent color for a single component instance.
          </p>
          <div class="flex gap-2 flex-wrap">
            <SButton color="#ec4899" size="small">Pink</SButton>
            <SButton color="#10b981" size="small">Green</SButton>
            <SButton color="#f59e0b" size="small">Amber</SButton>
            <SButton color="#8b5cf6" size="small">Violet</SButton>
          </div>
        </div>

        <!-- Layer 3: Class Override -->
        <div class="bg-muted rounded-xl p-5 border border-border">
          <div class="flex items-center gap-3 mb-3">
            <span class="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</span>
            <h3 class="text-lg font-semibold text-foreground">Class Override (Full Control)</h3>
          </div>
          <p class="text-sm text-muted-foreground mb-3">
            Pass Tailwind classes directly. Thanks to <code class="text-xs bg-accent px-1 py-0.5 rounded">cn()</code> (tailwind-merge), your classes properly override defaults.
          </p>
          <div class="flex gap-2 flex-wrap">
            <SButton class="bg-gradient-to-r from-purple-500 to-pink-500 border-none text-white" size="small">Gradient</SButton>
            <SButton class="rounded-none" size="small">Sharp</SButton>
            <SButton class="shadow-xl" size="small" variant="outlined">Elevated</SButton>
          </div>
        </div>
      </div>
    </SApiSection>

    <!-- Code Examples -->
    <DemoSection title="Class Overrides" :code="classOverrideCode" language="vue" code-only description="Pass Tailwind classes to any component. cn() ensures they override the defaults." />
    <DemoSection title="Color Prop" :code="colorPropCode" language="vue" code-only description="Per-instance accent color override. Works with all variants." />
    <DemoSection title="Scoped Theme Sections" :code="scopedOverrideCode" language="vue" code-only description="Override tokens on a parent element to theme an entire section." />

    <!-- Dark Mode -->
    <SApiSection title="Dark Mode" id="dark-mode">
      <p class="text-muted-foreground mb-4">
        Saka UI uses class-based dark mode. Add <code class="text-xs bg-accent px-1 py-0.5 rounded">.dark</code> to the <code class="text-xs bg-accent px-1 py-0.5 rounded">&lt;html&gt;</code> element to activate dark mode. All tokens automatically flip — components do <strong>not</strong> use Tailwind's <code class="text-xs bg-accent px-1 py-0.5 rounded">dark:</code> variant.
      </p>
    </SApiSection>

    <DemoSection title="Dark Mode Setup" :code="darkModeCode" language="vue" code-only />

    <!-- Open Code Model -->
    <SApiSection title="Open Code Model" id="open-code">
      <div class="space-y-4 text-muted-foreground">
        <p>
          Saka UI follows the open-code (copy-paste) model popularized by shadcn. Components are copied into your project, giving you full ownership:
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="bg-muted rounded-xl p-4 border border-border">
            <div class="font-semibold text-foreground mb-2">Install via CLI</div>
            <div class="font-mono text-xs text-primary bg-accent rounded px-3 py-2">
              npx saka-ui add button card input
            </div>
            <p class="text-sm mt-2">Components are copied to your project with proper imports rewritten.</p>
          </div>
          <div class="bg-muted rounded-xl p-4 border border-border">
            <div class="font-semibold text-foreground mb-2">Full Ownership</div>
            <p class="text-sm">
              Modify any component directly. No version lock-in, no abstraction layer.
              Your code, your rules.
            </p>
          </div>
        </div>
        <p class="text-sm">
          Required utilities: <code class="text-xs bg-accent px-1 py-0.5 rounded">src/lib/utils.ts</code> (cn function) is automatically installed alongside components.
        </p>
      </div>
    </SApiSection>
  </div>
</template>
