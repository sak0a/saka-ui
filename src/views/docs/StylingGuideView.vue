<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import { SApiSection } from '../../index'

const colorTokensCode = `:root {
  /* Backgrounds */
  --s-background: #ffffff;
  --s-foreground: #09090b;
  --s-card: #ffffff;
  --s-card-foreground: #09090b;
  --s-popover: #ffffff;
  --s-popover-foreground: #09090b;
  --s-muted: #f4f4f5;
  --s-muted-foreground: #71717a;

  /* Brand / Actions */
  --s-primary: #18181b;
  --s-primary-foreground: #fafafa;
  --s-secondary: #f4f4f5;
  --s-secondary-foreground: #18181b;
  --s-accent: #f4f4f5;
  --s-accent-foreground: #18181b;

  /* Semantic */
  --s-destructive: #ef4444;
  --s-success: #22c55e;
  --s-warning: #f59e0b;
  --s-info: #3b82f6;

  /* Chrome */
  --s-border: #e4e4e7;
  --s-input: #e4e4e7;
  --s-ring: #18181b;
}`

const darkTokensCode = `:root.dark {
  --s-background: #09090b;
  --s-foreground: #fafafa;
  --s-muted: #27272a;
  --s-muted-foreground: #a1a1aa;
  --s-primary: #fafafa;
  --s-primary-foreground: #18181b;
  --s-secondary: #27272a;
  --s-accent: #27272a;
  --s-border: #27272a;
  --s-input: #27272a;
  --s-ring: #d4d4d8;
  --s-destructive: #dc2626;
  --s-success: #16a34a;
  --s-warning: #d97706;
  --s-info: #2563eb;
}`

const themeBlockCode = `@theme {
  --color-background: var(--s-background);
  --color-foreground: var(--s-foreground);
  --color-primary: var(--s-primary);
  --color-primary-foreground: var(--s-primary-foreground);
  --color-muted: var(--s-muted);
  --color-muted-foreground: var(--s-muted-foreground);
  --color-accent: var(--s-accent);
  --color-border: var(--s-border);
  --color-input: var(--s-input);
  --color-ring: var(--s-ring);
  /* ... more mappings */
}`

const cvaCode = `import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '~/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-all',
  {
    variants: {
      variant: {
        filled: 'bg-primary text-primary-foreground hover:brightness-110',
        outlined: 'border border-primary text-primary hover:bg-primary/10',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary hover:underline',
      },
      size: {
        small: 'px-2 py-0.5 text-sm',
        medium: 'px-2 py-0.5 text-sm',
        large: 'px-2.5 py-0.5 text-base',
      },
    },
    defaultVariants: {
      variant: 'filled',
      size: 'medium',
    },
  }
)

export type ButtonVariants = VariantProps<typeof buttonVariants>`

const cnUsageCode = `<template>
  <button
    :class="cn(
      buttonVariants({ variant, size }),
      $attrs.class
    )"
  >
    <slot />
  </button>
</template>`

const cnOverrideCode = `<!-- Override background color -->
<SButton class="bg-blue-500 hover:bg-blue-600">Custom</SButton>

<!-- Override border radius -->
<SButton class="rounded-full">Pill</SButton>

<!-- Add extra utility classes -->
<SButton class="shadow-lg">Elevated</SButton>`

const colorPropCode = `<!-- Uses the theme's --s-primary (default) -->
<SButton>Default</SButton>

<!-- Uses a custom inline color -->
<SButton color="#6366f1">Indigo</SButton>
<SButton color="#ec4899">Pink</SButton>

<!-- Works with all variants -->
<SButton color="#10b981" variant="outlined">Green Outlined</SButton>
<SButton color="#f59e0b" variant="light">Amber Light</SButton>`

const colorTokens = [
  { name: 'background', light: '#ffffff', dark: '#09090b', tailwind: 'bg-background', desc: 'Page background' },
  { name: 'foreground', light: '#09090b', dark: '#fafafa', tailwind: 'text-foreground', desc: 'Default text' },
  { name: 'card', light: '#ffffff', dark: '#09090b', tailwind: 'bg-card', desc: 'Card surfaces' },
  { name: 'muted', light: '#f4f4f5', dark: '#27272a', tailwind: 'bg-muted', desc: 'Subtle backgrounds' },
  { name: 'muted-foreground', light: '#71717a', dark: '#a1a1aa', tailwind: 'text-muted-foreground', desc: 'Secondary text' },
  { name: 'primary', light: '#18181b', dark: '#fafafa', tailwind: 'bg-primary', desc: 'Primary actions' },
  { name: 'primary-foreground', light: '#fafafa', dark: '#18181b', tailwind: 'text-primary-foreground', desc: 'Text on primary' },
  { name: 'secondary', light: '#f4f4f5', dark: '#27272a', tailwind: 'bg-secondary', desc: 'Secondary actions' },
  { name: 'accent', light: '#f4f4f5', dark: '#27272a', tailwind: 'bg-accent', desc: 'Highlighted items' },
  { name: 'destructive', light: '#ef4444', dark: '#dc2626', tailwind: 'bg-destructive', desc: 'Danger actions' },
  { name: 'success', light: '#22c55e', dark: '#16a34a', tailwind: 'bg-success', desc: 'Success states' },
  { name: 'warning', light: '#f59e0b', dark: '#d97706', tailwind: 'bg-warning', desc: 'Warning states' },
  { name: 'info', light: '#3b82f6', dark: '#2563eb', tailwind: 'bg-info', desc: 'Info states' },
  { name: 'border', light: '#e4e4e7', dark: '#27272a', tailwind: 'border-border', desc: 'Default borders' },
  { name: 'input', light: '#e4e4e7', dark: '#27272a', tailwind: 'border-input', desc: 'Input borders' },
  { name: 'ring', light: '#18181b', dark: '#d4d4d8', tailwind: 'ring-ring', desc: 'Focus rings' },
]

const radiusTokens = [
  { token: '--s-radius-sm', value: '0.375rem (6px)', tailwind: 'rounded-sm', usage: 'Badges, chips, small elements' },
  { token: '--s-radius-md', value: '0.625rem (10px)', tailwind: 'rounded-md', usage: 'Buttons, inputs (default)' },
  { token: '--s-radius-lg', value: '0.875rem (14px)', tailwind: 'rounded-lg', usage: 'Cards, modals' },
  { token: '--s-radius-xl', value: '1.25rem (20px)', tailwind: 'rounded-xl', usage: 'Large panels, hero sections' },
  { token: '--s-radius-full', value: '9999px', tailwind: 'rounded-full', usage: 'Pills, avatars, circular buttons' },
]

const shadowTokens = [
  { token: '--s-shadow-xs', tailwind: 'shadow-xs', usage: 'Subtle lift (badges, chips)' },
  { token: '--s-shadow-sm', tailwind: 'shadow-sm', usage: 'Slight elevation (cards)' },
  { token: '--s-shadow-md', tailwind: 'shadow-md', usage: 'Medium elevation (dropdowns)' },
  { token: '--s-shadow-lg', tailwind: 'shadow-lg', usage: 'High elevation (modals)' },
  { token: '--s-shadow-xl', tailwind: 'shadow-xl', usage: 'Maximum elevation (notifications)' },
]

const animationTokens = [
  { token: '--s-duration-fast', value: '150ms', usage: 'Hover states, toggles' },
  { token: '--s-duration-normal', value: '200ms', usage: 'Default transitions' },
  { token: '--s-duration-slow', value: '300ms', usage: 'Modal/drawer transitions' },
  { token: '--s-duration-slower', value: '500ms', usage: 'Page transitions' },
  { token: '--s-ease-default', value: 'cubic-bezier(0.4, 0, 0.2, 1)', usage: 'General transitions' },
  { token: '--s-ease-bounce', value: 'cubic-bezier(0.34, 1.56, 0.64, 1)', usage: 'Playful/bouncy effects' },
]

const spacingTable = [
  { component: 'Button (xs)', padding: 'px-1.5 py-0.5', gap: 'gap-1' },
  { component: 'Button (sm)', padding: 'px-2 py-0.5', gap: 'gap-1.5' },
  { component: 'Button (md)', padding: 'px-2 py-0.5', gap: 'gap-2' },
  { component: 'Button (lg)', padding: 'px-2.5 py-0.5', gap: 'gap-2' },
  { component: 'Button (xl)', padding: 'px-3 py-0.5', gap: 'gap-2.5' },
  { component: 'Input', padding: 'px-2.5 py-2', gap: '-' },
  { component: 'Card (compact)', padding: 'p-3', gap: '-' },
  { component: 'Card (default)', padding: 'p-4 sm:p-5', gap: '-' },
  { component: 'Card (comfortable)', padding: 'p-5 sm:p-6 lg:p-8', gap: '-' },
  { component: 'Modal', padding: 'p-6', gap: 'gap-4' },
]

const statePatterns = [
  { state: 'Hover', pattern: 'Lighten/darken 10%', example: 'hover:brightness-110' },
  { state: 'Active', pattern: 'Scale down slightly', example: 'active:scale-[0.98]' },
  { state: 'Focus', pattern: 'Ring outline', example: 'focus-visible:ring-2 ring-ring ring-offset-2' },
  { state: 'Disabled', pattern: 'Reduced opacity', example: 'opacity-50 cursor-not-allowed' },
  { state: 'Loading', pattern: 'Spinner + dimmed', example: 'opacity-50 + animate-spin' },
]
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-12">
    <!-- Page Header -->
    <div>
      <h1 class="text-4xl font-bold text-foreground mb-3">Styling Guide</h1>
      <p class="text-lg text-muted-foreground">
        The complete reference for Saka UI's design token system, component patterns, and customization approach.
      </p>
    </div>

    <!-- Architecture Overview -->
    <SApiSection title="Architecture" id="architecture">
      <div class="space-y-4 text-muted-foreground">
        <p>
          Saka UI uses a three-layer styling architecture that makes components both consistent and fully customizable:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-muted rounded-xl p-4 border border-border">
            <div class="font-semibold text-foreground mb-1">1. CSS Custom Properties</div>
            <p class="text-sm">All design decisions live as <code class="text-xs bg-accent px-1 py-0.5 rounded">--s-*</code> tokens in <code class="text-xs bg-accent px-1 py-0.5 rounded">style.css</code>. Override any token to customize.</p>
          </div>
          <div class="bg-muted rounded-xl p-4 border border-border">
            <div class="font-semibold text-foreground mb-1">2. Tailwind @theme Mapping</div>
            <p class="text-sm">Tokens are mapped to Tailwind utilities via <code class="text-xs bg-accent px-1 py-0.5 rounded">@theme</code>. Write <code class="text-xs bg-accent px-1 py-0.5 rounded">bg-primary</code> instead of <code class="text-xs bg-accent px-1 py-0.5 rounded">bg-[var(--s-primary)]</code>.</p>
          </div>
          <div class="bg-muted rounded-xl p-4 border border-border">
            <div class="font-semibold text-foreground mb-1">3. cva + cn()</div>
            <p class="text-sm">Components define variants with <code class="text-xs bg-accent px-1 py-0.5 rounded">class-variance-authority</code> and merge classes with <code class="text-xs bg-accent px-1 py-0.5 rounded">cn()</code> for overrides.</p>
          </div>
        </div>
      </div>
    </SApiSection>

    <!-- Color Tokens -->
    <SApiSection title="Color Tokens" id="color-tokens">
      <p class="text-muted-foreground mb-6">
        All colors follow semantic naming. Each role has a base token and a <code class="text-xs bg-accent px-1 py-0.5 rounded">-foreground</code> counterpart for text rendered on top.
        Components use Tailwind utility classes (not raw CSS vars) to reference tokens.
      </p>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-border">
              <th class="text-left py-3 px-2 text-foreground font-semibold">Token</th>
              <th class="text-left py-3 px-2 text-foreground font-semibold">Light</th>
              <th class="text-left py-3 px-2 text-foreground font-semibold">Dark</th>
              <th class="text-left py-3 px-2 text-foreground font-semibold">Tailwind</th>
              <th class="text-left py-3 px-2 text-foreground font-semibold">Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in colorTokens" :key="t.name" class="border-b border-border/50">
              <td class="py-2.5 px-2 font-mono text-xs text-foreground">--s-{{ t.name }}</td>
              <td class="py-2.5 px-2">
                <div class="flex items-center gap-2">
                  <span class="w-5 h-5 rounded border border-border shrink-0" :style="{ backgroundColor: t.light }" />
                  <span class="font-mono text-xs text-muted-foreground">{{ t.light }}</span>
                </div>
              </td>
              <td class="py-2.5 px-2">
                <div class="flex items-center gap-2">
                  <span class="w-5 h-5 rounded border border-border shrink-0" :style="{ backgroundColor: t.dark }" />
                  <span class="font-mono text-xs text-muted-foreground">{{ t.dark }}</span>
                </div>
              </td>
              <td class="py-2.5 px-2 font-mono text-xs text-primary">{{ t.tailwind }}</td>
              <td class="py-2.5 px-2 text-muted-foreground">{{ t.desc }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </SApiSection>

    <!-- Color Swatches Visual -->
    <SApiSection title="Color Palette" id="color-palette">
      <p class="text-muted-foreground mb-6">
        Live swatches showing the current theme colors. Toggle dark mode to see how tokens adapt.
      </p>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="space-y-1.5">
          <div class="h-16 rounded-lg bg-background border border-border" />
          <div class="text-xs text-muted-foreground font-mono">background</div>
        </div>
        <div class="space-y-1.5">
          <div class="h-16 rounded-lg bg-foreground" />
          <div class="text-xs text-muted-foreground font-mono">foreground</div>
        </div>
        <div class="space-y-1.5">
          <div class="h-16 rounded-lg bg-primary" />
          <div class="text-xs text-muted-foreground font-mono">primary</div>
        </div>
        <div class="space-y-1.5">
          <div class="h-16 rounded-lg bg-muted" />
          <div class="text-xs text-muted-foreground font-mono">muted</div>
        </div>
        <div class="space-y-1.5">
          <div class="h-16 rounded-lg bg-accent" />
          <div class="text-xs text-muted-foreground font-mono">accent</div>
        </div>
        <div class="space-y-1.5">
          <div class="h-16 rounded-lg bg-destructive" />
          <div class="text-xs text-muted-foreground font-mono">destructive</div>
        </div>
        <div class="space-y-1.5">
          <div class="h-16 rounded-lg bg-success" />
          <div class="text-xs text-muted-foreground font-mono">success</div>
        </div>
        <div class="space-y-1.5">
          <div class="h-16 rounded-lg bg-warning" />
          <div class="text-xs text-muted-foreground font-mono">warning</div>
        </div>
        <div class="space-y-1.5">
          <div class="h-16 rounded-lg bg-info" />
          <div class="text-xs text-muted-foreground font-mono">info</div>
        </div>
        <div class="space-y-1.5">
          <div class="h-16 rounded-lg bg-secondary" />
          <div class="text-xs text-muted-foreground font-mono">secondary</div>
        </div>
        <div class="space-y-1.5">
          <div class="h-16 rounded-lg border-2 border-border" />
          <div class="text-xs text-muted-foreground font-mono">border</div>
        </div>
        <div class="space-y-1.5">
          <div class="h-16 rounded-lg border-2 border-ring" />
          <div class="text-xs text-muted-foreground font-mono">ring</div>
        </div>
      </div>
    </SApiSection>

    <!-- Token CSS Code -->
    <DemoSection title="Light Mode Tokens" :code="colorTokensCode" language="css" code-only />
    <DemoSection title="Dark Mode Tokens" :code="darkTokensCode" language="css" code-only />
    <DemoSection title="Tailwind @theme Mapping" :code="themeBlockCode" language="css" code-only description="Maps CSS tokens to Tailwind utility classes so you can write bg-primary instead of bg-[var(--s-primary)]." />

    <!-- Border Radius -->
    <SApiSection title="Border Radius" id="border-radius">
      <div class="overflow-x-auto mb-6">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-border">
              <th class="text-left py-3 px-2 text-foreground font-semibold">Token</th>
              <th class="text-left py-3 px-2 text-foreground font-semibold">Value</th>
              <th class="text-left py-3 px-2 text-foreground font-semibold">Tailwind</th>
              <th class="text-left py-3 px-2 text-foreground font-semibold">Usage</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in radiusTokens" :key="r.token" class="border-b border-border/50">
              <td class="py-2.5 px-2 font-mono text-xs text-foreground">{{ r.token }}</td>
              <td class="py-2.5 px-2 font-mono text-xs text-muted-foreground">{{ r.value }}</td>
              <td class="py-2.5 px-2 font-mono text-xs text-primary">{{ r.tailwind }}</td>
              <td class="py-2.5 px-2 text-muted-foreground">{{ r.usage }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Radius visual -->
      <div class="flex items-end gap-4 flex-wrap">
        <div class="text-center space-y-2">
          <div class="w-16 h-16 bg-primary rounded-sm" />
          <span class="text-xs text-muted-foreground font-mono">sm</span>
        </div>
        <div class="text-center space-y-2">
          <div class="w-16 h-16 bg-primary rounded-md" />
          <span class="text-xs text-muted-foreground font-mono">md</span>
        </div>
        <div class="text-center space-y-2">
          <div class="w-16 h-16 bg-primary rounded-lg" />
          <span class="text-xs text-muted-foreground font-mono">lg</span>
        </div>
        <div class="text-center space-y-2">
          <div class="w-16 h-16 bg-primary rounded-xl" />
          <span class="text-xs text-muted-foreground font-mono">xl</span>
        </div>
        <div class="text-center space-y-2">
          <div class="w-16 h-16 bg-primary rounded-full" />
          <span class="text-xs text-muted-foreground font-mono">full</span>
        </div>
      </div>
    </SApiSection>

    <!-- Shadows -->
    <SApiSection title="Shadows" id="shadows">
      <div class="overflow-x-auto mb-6">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-border">
              <th class="text-left py-3 px-2 text-foreground font-semibold">Token</th>
              <th class="text-left py-3 px-2 text-foreground font-semibold">Tailwind</th>
              <th class="text-left py-3 px-2 text-foreground font-semibold">Usage</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in shadowTokens" :key="s.token" class="border-b border-border/50">
              <td class="py-2.5 px-2 font-mono text-xs text-foreground">{{ s.token }}</td>
              <td class="py-2.5 px-2 font-mono text-xs text-primary">{{ s.tailwind }}</td>
              <td class="py-2.5 px-2 text-muted-foreground">{{ s.usage }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Shadow visual -->
      <div class="flex items-center gap-6 flex-wrap">
        <div class="w-20 h-20 rounded-lg bg-card shadow-xs flex items-center justify-center text-xs text-muted-foreground font-mono">xs</div>
        <div class="w-20 h-20 rounded-lg bg-card shadow-sm flex items-center justify-center text-xs text-muted-foreground font-mono">sm</div>
        <div class="w-20 h-20 rounded-lg bg-card shadow-md flex items-center justify-center text-xs text-muted-foreground font-mono">md</div>
        <div class="w-20 h-20 rounded-lg bg-card shadow-lg flex items-center justify-center text-xs text-muted-foreground font-mono">lg</div>
        <div class="w-20 h-20 rounded-lg bg-card shadow-xl flex items-center justify-center text-xs text-muted-foreground font-mono">xl</div>
      </div>
    </SApiSection>

    <!-- Typography -->
    <SApiSection title="Typography" id="typography">
      <div class="space-y-4">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-border">
                <th class="text-left py-3 px-2 text-foreground font-semibold">Token</th>
                <th class="text-left py-3 px-2 text-foreground font-semibold">Value</th>
                <th class="text-left py-3 px-2 text-foreground font-semibold">Tailwind</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-border/50">
                <td class="py-2.5 px-2 font-mono text-xs text-foreground">--s-font-sans</td>
                <td class="py-2.5 px-2 text-muted-foreground text-xs">"Geist", system-ui, sans-serif</td>
                <td class="py-2.5 px-2 font-mono text-xs text-primary">font-sans</td>
              </tr>
              <tr class="border-b border-border/50">
                <td class="py-2.5 px-2 font-mono text-xs text-foreground">--s-font-mono</td>
                <td class="py-2.5 px-2 text-muted-foreground text-xs">"Geist Mono", ui-monospace, monospace</td>
                <td class="py-2.5 px-2 font-mono text-xs text-primary">font-mono</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="space-y-3 mt-6">
          <div class="flex items-baseline gap-4">
            <span class="w-16 text-xs text-muted-foreground font-mono shrink-0">text-xs</span>
            <span class="text-xs text-foreground">The quick brown fox (12px)</span>
          </div>
          <div class="flex items-baseline gap-4">
            <span class="w-16 text-xs text-muted-foreground font-mono shrink-0">text-sm</span>
            <span class="text-sm text-foreground">The quick brown fox (14px)</span>
          </div>
          <div class="flex items-baseline gap-4">
            <span class="w-16 text-xs text-muted-foreground font-mono shrink-0">text-base</span>
            <span class="text-base text-foreground">The quick brown fox (16px)</span>
          </div>
          <div class="flex items-baseline gap-4">
            <span class="w-16 text-xs text-muted-foreground font-mono shrink-0">text-lg</span>
            <span class="text-lg text-foreground">The quick brown fox (18px)</span>
          </div>
          <div class="flex items-baseline gap-4">
            <span class="w-16 text-xs text-muted-foreground font-mono shrink-0">text-xl</span>
            <span class="text-xl text-foreground">The quick brown fox (20px)</span>
          </div>
          <div class="flex items-baseline gap-4">
            <span class="w-16 text-xs text-muted-foreground font-mono shrink-0">text-2xl</span>
            <span class="text-2xl text-foreground">The quick brown fox (24px)</span>
          </div>
        </div>
      </div>
    </SApiSection>

    <!-- Spacing -->
    <SApiSection title="Spacing Conventions" id="spacing">
      <p class="text-muted-foreground mb-4">
        Components follow consistent spacing using Tailwind's default rem-based scale.
      </p>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-border">
              <th class="text-left py-3 px-2 text-foreground font-semibold">Component</th>
              <th class="text-left py-3 px-2 text-foreground font-semibold">Padding</th>
              <th class="text-left py-3 px-2 text-foreground font-semibold">Gap</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in spacingTable" :key="s.component" class="border-b border-border/50">
              <td class="py-2.5 px-2 text-foreground">{{ s.component }}</td>
              <td class="py-2.5 px-2 font-mono text-xs text-primary">{{ s.padding }}</td>
              <td class="py-2.5 px-2 font-mono text-xs text-muted-foreground">{{ s.gap }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </SApiSection>

    <!-- Animation -->
    <SApiSection title="Animation Tokens" id="animation">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-border">
              <th class="text-left py-3 px-2 text-foreground font-semibold">Token</th>
              <th class="text-left py-3 px-2 text-foreground font-semibold">Value</th>
              <th class="text-left py-3 px-2 text-foreground font-semibold">Usage</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="a in animationTokens" :key="a.token" class="border-b border-border/50">
              <td class="py-2.5 px-2 font-mono text-xs text-foreground">{{ a.token }}</td>
              <td class="py-2.5 px-2 font-mono text-xs text-muted-foreground">{{ a.value }}</td>
              <td class="py-2.5 px-2 text-muted-foreground">{{ a.usage }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </SApiSection>

    <!-- Interactive States -->
    <SApiSection title="Interactive States" id="states">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-border">
              <th class="text-left py-3 px-2 text-foreground font-semibold">State</th>
              <th class="text-left py-3 px-2 text-foreground font-semibold">Pattern</th>
              <th class="text-left py-3 px-2 text-foreground font-semibold">Example Classes</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in statePatterns" :key="s.state" class="border-b border-border/50">
              <td class="py-2.5 px-2 text-foreground font-medium">{{ s.state }}</td>
              <td class="py-2.5 px-2 text-muted-foreground">{{ s.pattern }}</td>
              <td class="py-2.5 px-2 font-mono text-xs text-primary">{{ s.example }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </SApiSection>

    <!-- Component Variant Pattern (cva) -->
    <SApiSection title="Component Variant Pattern" id="cva-pattern">
      <p class="text-muted-foreground mb-4">
        All Saka UI components define their visual variants using <code class="text-xs bg-accent px-1 py-0.5 rounded">class-variance-authority</code> (cva).
        This provides type-safe variant definitions with Tailwind classes.
      </p>
    </SApiSection>

    <DemoSection title="Defining Variants with cva" :code="cvaCode" language="javascript" code-only description="Components declare their variants, sizes, and defaults in a cva() call." />

    <!-- cn() Usage -->
    <SApiSection title="Class Merging with cn()" id="cn-pattern">
      <p class="text-muted-foreground mb-4">
        Every component's root element uses <code class="text-xs bg-accent px-1 py-0.5 rounded">cn()</code> (powered by <code class="text-xs bg-accent px-1 py-0.5 rounded">clsx</code> + <code class="text-xs bg-accent px-1 py-0.5 rounded">tailwind-merge</code>) to merge variant classes with user-provided class overrides. This means any Tailwind class you pass will properly override the component's defaults.
      </p>
    </SApiSection>

    <DemoSection title="cn() in Templates" :code="cnUsageCode" language="vue" code-only />
    <DemoSection title="Overriding Component Classes" :code="cnOverrideCode" language="vue" code-only description="Because cn() uses tailwind-merge, your classes properly override component defaults." />

    <!-- Color Prop -->
    <SApiSection title="The color Prop" id="color-prop">
      <p class="text-muted-foreground mb-4">
        Components that accept a <code class="text-xs bg-accent px-1 py-0.5 rounded">color</code> prop use it as an inline override for the primary theme color.
        When unset, the component uses theme tokens. When set, inline CSS properties override the token-based styling per-variant.
      </p>
    </SApiSection>

    <DemoSection title="Using the color Prop" :code="colorPropCode" language="vue" code-only />

    <!-- Dependencies -->
    <SApiSection title="Required Dependencies" id="dependencies">
      <p class="text-muted-foreground mb-4">
        When using the open-code (copy) installation model, these packages are required:
      </p>
      <div class="bg-accent rounded-lg p-4 font-mono text-sm text-foreground space-y-1">
        <div>clsx <span class="text-muted-foreground">^2.1.0</span></div>
        <div>tailwind-merge <span class="text-muted-foreground">^3.0.0</span></div>
        <div>class-variance-authority <span class="text-muted-foreground">^0.7.1</span></div>
      </div>
      <p class="text-sm text-muted-foreground mt-3">
        These are automatically installed when using <code class="text-xs bg-accent px-1 py-0.5 rounded">saka-ui add &lt;component&gt;</code>.
      </p>
    </SApiSection>
  </div>
</template>
