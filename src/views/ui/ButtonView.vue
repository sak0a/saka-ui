<script setup lang="ts">
import { ref, computed } from 'vue'
import { SButton, SKbdShortcut, SApiSection, SApiTable, SApiKeyboard } from '../../index'
import type { ApiProp, ApiEvent, ApiSlot, KeyboardShortcut } from '../../index'
import DemoSection from '../../components/DemoSection.vue'
import { Palette, Sparkles, LoaderCircle } from 'lucide-vue-next'
import { useCustomizer } from '../../composables/useCustomizer'
import { iconToCode, getLucideImportName, lucideImportStatement } from '../../lib/iconMap'

const { ri, iconPack } = useCustomizer()

// Code generation helpers
const _cv = (mdiName: string) => iconToCode(mdiName, iconPack.value)
const cp = (mdiName: string, attr = 'icon') => {
  if (iconPack.value === 'mdi') return `${attr}="${mdiName}"`
  const name = getLucideImportName(mdiName)
  return name ? `:${attr}="${name}"` : `${attr}="${mdiName}"`
}
const li = (...mdiNames: string[]) => {
  if (iconPack.value === 'mdi') return ''
  return '\n' + lucideImportStatement(mdiNames)
}
/** Render an inline icon element for code snippets: MDI span or Lucide component */
const si = (mdiName: string, extraClass = '') => {
  if (iconPack.value === 'mdi') {
    const cls = extraClass ? `mdi mdi-${mdiName} ${extraClass}` : `mdi mdi-${mdiName}`
    return `<span class="${cls}"></span>`
  }
  const name = getLucideImportName(mdiName)
  if (!name) {
    const cls = extraClass ? `mdi mdi-${mdiName} ${extraClass}` : `mdi mdi-${mdiName}`
    return `<span class="${cls}"></span>`
  }
  const cls = extraClass ? `class="w-4 h-4 ${extraClass}"` : 'class="w-4 h-4"'
  return `<${name} ${cls} />`
}

// State for interactive demos
const isLoading = ref(false)

const simulateLoading = () => {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
  }, 2000)
}

const handleClick = (label: string) => {
  console.log('Button clicked:', label)
}

// Code snippets for demos
const basicUsageCode = `<SButton>Default Button</SButton>
<SButton color="#3b82f6">Blue Button</SButton>
<SButton color="#ec4899">Pink Button</SButton>
<SButton color="#f59e0b">Orange Button</SButton>`

const variantsCode = `<SButton variant="filled">Filled</SButton>
<SButton variant="outlined">Outlined</SButton>
<SButton variant="light">Light</SButton>
<SButton variant="ghost">Ghost</SButton>
<SButton variant="link">Link</SButton>`

const variantColorsCode = `<SButton color="#8b5cf6" variant="filled">Filled</SButton>
<SButton color="#8b5cf6" variant="outlined">Outlined</SButton>
<SButton color="#8b5cf6" variant="light">Light</SButton>
<SButton color="#8b5cf6" variant="ghost">Ghost</SButton>

<SButton color="#ef4444" variant="filled">Filled</SButton>
<SButton color="#ef4444" variant="outlined">Outlined</SButton>
<SButton color="#ef4444" variant="light">Light</SButton>
<SButton color="#ef4444" variant="ghost">Ghost</SButton>

<SButton color="#06b6d4" variant="filled">Filled</SButton>
<SButton color="#06b6d4" variant="outlined">Outlined</SButton>
<SButton color="#06b6d4" variant="light">Light</SButton>
<SButton color="#06b6d4" variant="ghost">Ghost</SButton>`

const sizesCode = `<SButton size="xs">Extra Small</SButton>
<SButton size="small">Small</SButton>
<SButton size="medium">Medium</SButton>
<SButton size="large">Large</SButton>
<SButton size="xl">Extra Large</SButton>`

const roundedCode = `<SButton rounded="none" color="#3b82f6">None</SButton>
<SButton rounded="sm" color="#3b82f6">Small</SButton>
<SButton rounded="md" color="#3b82f6">Medium</SButton>
<SButton rounded="lg" color="#3b82f6">Large</SButton>
<SButton rounded="full" color="#3b82f6">Pill</SButton>`

const iconsCode = computed(() => {
  const imports = li('home', 'arrow-right', 'plus', 'chevron-down', 'heart', 'cog', 'bell')
  const scriptBlock = imports ? `<script setup>${imports}\n<\/script>\n\n` : ''
  return `${scriptBlock}<SButton ${cp('home', 'iconLeft')}>Home</SButton>
<SButton ${cp('arrow-right', 'iconRight')} color="#3b82f6">Continue</SButton>
<SButton ${cp('plus', 'iconLeft')} ${cp('chevron-down', 'iconRight')} variant="outlined">New Item</SButton>
<SButton iconOnly rounded="full" color="#ec4899">
  ${si('heart')}
</SButton>
<SButton iconOnly variant="ghost">
  ${si('cog')}
</SButton>
<SButton iconOnly variant="light" color="#8b5cf6">
  ${si('bell')}
</SButton>`
})

const loadingCode = computed(() => `<SButton :loading="isLoading">
  {{ isLoading ? 'Loading...' : 'Click to Load' }}
</SButton>
<SButton loading variant="outlined">Loading...</SButton>
<SButton loading variant="light" color="#8b5cf6">Processing</SButton>
<SButton loading size="small" color="#ec4899">Wait</SButton>

<!-- With preserveSize to maintain button width -->
<SButton :loading="isLoading" preserveSize>
  Submit Order
</SButton>
<SButton loading preserveSize variant="outlined" ${cp('cloud-upload', 'iconLeft')}>
  Upload File
</SButton>
<SButton loading preserveSize variant="light" color="#8b5cf6" ${cp('arrow-right', 'iconRight')}>
  Continue
</SButton>`)

const disabledCode = `<SButton disabled>Disabled Filled</SButton>
<SButton disabled variant="outlined">Disabled Outlined</SButton>
<SButton disabled variant="light">Disabled Light</SButton>
<SButton disabled variant="ghost">Disabled Ghost</SButton>
<SButton disabled variant="link">Disabled Link</SButton>`

const rippleCode = `<SButton size="large" color="#3b82f6">Click me for ripple!</SButton>
<SButton size="large" :ripple="false" variant="outlined">No Ripple</SButton>`

const blockCode = computed(() => `<SButton block size="large" ${cp('rocket-launch', 'iconLeft')}>Full Width Button</SButton>
<SButton block variant="outlined" color="#3b82f6">Full Width Outlined</SButton>
<SButton block variant="light" color="#8b5cf6">Full Width Light</SButton>`)

const linksCode = computed(() => `<SButton href="https://google.com" target="_blank" ${cp('open-in-new', 'iconRight')}>
  External Link
</SButton>
<SButton to="/ui/chips" variant="light" ${cp('arrow-left', 'iconLeft')}>
  Go to Chips
</SButton>
<SButton to="/ui/switch" variant="outlined" ${cp('arrow-right', 'iconRight')}>
  Go to Switch
</SButton>`)

const combinedCode = computed(() => `<SButton
  variant="filled"
  size="large"
  color="#8b5cf6"
  ${cp('rocket-launch', 'iconLeft')}
  rounded="lg"
>
  Launch Project
</SButton>

<SButton
  variant="outlined"
  size="small"
  color="#10b981"
  ${cp('check', 'iconRight')}
  rounded="full"
>
  Completed
</SButton>

<SButton
  variant="light"
  color="#ef4444"
  ${cp('trash-can', 'iconLeft')}
>
  Delete
</SButton>

<SButton
  variant="ghost"
  ${cp('share-variant', 'iconLeft')}
>
  Share
</SButton>`)

const animateCode = computed(() => {
  const imports = li('home', 'email-send', 'heart', 'cog')
  const scriptBlock = imports ? `<script setup>${imports}\n<\/script>\n\n` : ''
  return `${scriptBlock}<!-- Slide animation (default) -->
<SButton size="large">
  Home
  <template #animate>
    ${si('home', 'mr-1')} Go Home
  </template>
</SButton>

<!-- Vertical animation -->
<SButton size="large" animation-type="vertical" color="#10b981">
  Message
  <template #animate>
    ${si('email-send', 'mr-1')} Send
  </template>
</SButton>

<!-- Scale animation -->
<SButton size="large" animation-type="scale" color="#8b5cf6">
  Like
  <template #animate>
    ${si('heart', 'text-lg')}
  </template>
</SButton>

<!-- Rotate animation -->
<SButton size="large" animation-type="rotate" color="#f59e0b">
  Settings
  <template #animate>
    ${si('cog', 'text-lg')}
  </template>
</SButton>`
})

const buttonGroupCode = computed(() => {
  const imports = li('format-bold', 'format-italic', 'format-underline')
  const scriptBlock = imports ? `<script setup>${imports}\n<\/script>\n\n` : ''
  return `${scriptBlock}<div class="inline-flex">
  <SButton rounded="none" class="rounded-l-lg border-r-0">Left</SButton>
  <SButton rounded="none" variant="outlined" class="border-x-0">Center</SButton>
  <SButton rounded="none" class="rounded-r-lg border-l-0">Right</SButton>
</div>

<div class="inline-flex">
  <SButton rounded="none" variant="outlined" color="#8b5cf6" class="rounded-l-lg">
    ${si('format-bold')}
  </SButton>
  <SButton rounded="none" variant="outlined" color="#8b5cf6">
    ${si('format-italic')}
  </SButton>
  <SButton rounded="none" variant="outlined" color="#8b5cf6" class="rounded-r-lg">
    ${si('format-underline')}
  </SButton>
</div>`
})

const kbdShortcutCode = `<SButton variant="outlined">
  Search
  <SKbdShortcut :keys="['⌘', 'K']" size="xs" variant="flat" class="ml-2 opacity-70" />
</SButton>

<SButton variant="light">
  Save
  <SKbdShortcut :keys="['⌘', 'S']" size="xs" variant="flat" class="ml-2 opacity-70" />
</SButton>

<SButton variant="ghost">
  Undo
  <SKbdShortcut :keys="['⌘', 'Z']" size="xs" variant="ghost" class="ml-1 opacity-60" />
</SButton>`

// API Reference data
const buttonProps: ApiProp[] = [
  // Appearance
  { name: 'variant', type: "'filled' | 'outlined' | 'light' | 'ghost' | 'link'", default: "'filled'", description: 'Visual style variant', category: 'Appearance' },
  { name: 'size', type: "'xs' | 'small' | 'medium' | 'large' | 'xl'", default: "'medium'", description: 'Button size', category: 'Appearance' },
  { name: 'color', type: 'string', default: "'var(--s-primary)'", description: 'Button color (CSS color or variable)', category: 'Appearance' },
  { name: 'rounded', type: "'none' | 'sm' | 'md' | 'lg' | 'full'", default: "'md'", description: 'Border radius variant', category: 'Appearance' },
  { name: 'block', type: 'boolean', default: 'false', description: 'Full-width button', category: 'Appearance' },
  // Icons
  { name: 'iconLeft', type: 'string', default: 'undefined', description: 'MDI icon name for left icon', category: 'Icons' },
  { name: 'iconRight', type: 'string', default: 'undefined', description: 'MDI icon name for right icon', category: 'Icons' },
  { name: 'iconOnly', type: 'boolean', default: 'false', description: 'Icon-only button (square)', category: 'Icons' },
  // State
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable button interaction', category: 'State' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Show loading spinner', category: 'State' },
  { name: 'preserveSize', type: 'boolean', default: 'false', description: 'Keep button size when loading (content becomes invisible but takes up space)', category: 'State' },
  { name: 'ripple', type: 'boolean', default: 'true', description: 'Enable ripple effect on click', category: 'State' },
  // Animation
  { name: 'animationType', type: "'slide' | 'vertical' | 'scale' | 'rotate'", default: "'slide'", description: 'Animation type when using the animate slot', category: 'Animation' },
  { name: 'animateInactive', type: 'boolean', default: 'false', description: 'Disable hover animation (useful for toggle states)', category: 'Animation' },
  // Navigation
  { name: 'href', type: 'string', default: 'undefined', description: 'URL for anchor tag', category: 'Navigation' },
  { name: 'to', type: 'string | object', default: 'undefined', description: 'Vue Router destination', category: 'Navigation' },
  // HTML Attributes
  { name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", description: 'Button type attribute', category: 'HTML Attributes' },
  { name: 'tag', type: 'string', default: "'button'", description: 'HTML tag to render', category: 'HTML Attributes' }
]

const buttonEvents: ApiEvent[] = [
  { name: '@click', payload: 'MouseEvent', description: 'Emitted when button is clicked (unless disabled/loading)' }
]

const buttonSlots: ApiSlot[] = [
  { name: 'default', description: 'Button text content' },
  { name: 'icon-left', description: 'Custom left icon element (overrides iconLeft prop)' },
  { name: 'icon-right', description: 'Custom right icon element (overrides iconRight prop)' },
  { name: 'animate', description: 'Content shown on hover with animation (requires animationType prop)' }
]

const keyboardShortcuts: KeyboardShortcut[] = [
  { keys: 'Enter', action: 'Activate button' },
  { keys: 'Space', action: 'Activate button' },
  { keys: 'Tab', action: 'Focus next element' }
]
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- @component SButton -->
    <!-- @props variant, size, color, rounded, block, iconLeft, iconRight, iconOnly, disabled, loading, preserveSize, ripple, animationType, animateInactive, href, to, type, tag -->
    <!-- @events @click -->
    <!-- @slots default, icon-left, icon-right, animate -->
    <!-- @sections features, basic-usage, variants, variant-colors, sizes, border-radius, with-icons, loading-state, disabled-state, block-full-width, as-links, button-groups, combined-features, ripple-effect, hover-animations, with-keyboard-shortcuts, api-reference -->
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-(--s-text-primary) mb-2">Buttons</h1>
      <p class="text-lg text-(--s-text-secondary)">Versatile button component with multiple variants, sizes, and advanced features.</p>
    </header>

    <!-- Features -->
    <article id="features">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 rounded-xl bg-emerald-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <Palette class="w-5 h-5 text-emerald-500" />
            <h3 class="font-semibold text-(--s-text-primary)">Five Variants</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Filled, outlined, light, ghost, and link variants with custom color support.</p>
        </div>
        <div class="p-4 rounded-xl bg-blue-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-resize text-xl text-blue-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Five Sizes</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">From extra small to extra large sizes for any context.</p>
        </div>
        <div class="p-4 rounded-xl bg-purple-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <Sparkles class="w-5 h-5 text-purple-500" />
            <h3 class="font-semibold text-(--s-text-primary)">Ripple Effect</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Built-in ripple animation on click for tactile feedback.</p>
        </div>
        <div class="p-4 rounded-xl bg-amber-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-link-variant text-xl text-amber-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Link Support</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Render as anchor links or Vue Router links with href/to props.</p>
        </div>
        <div class="p-4 rounded-xl bg-red-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <LoaderCircle class="w-5 h-5 text-red-500" />
            <h3 class="font-semibold text-(--s-text-primary)">Loading State</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Built-in loading spinner with automatic interaction prevention.</p>
        </div>
        <div class="p-4 rounded-xl bg-cyan-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-keyboard text-xl text-cyan-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Keyboard Support</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Full keyboard navigation with Enter and Space activation.</p>
        </div>
      </div>
    </article>

    <!-- Basic Usage -->
    <section id="basic-usage">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Basic Usage</h2>
      <DemoSection 
        title="Basic Buttons"
        description="Buttons can be customized with different colors using the color prop."
        :code="basicUsageCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-3 items-center">
          <SButton @click="handleClick('Default')">Default Button</SButton>
          <SButton color="#3b82f6" @click="handleClick('Blue')">Blue Button</SButton>
          <SButton color="#ec4899" @click="handleClick('Pink')">Pink Button</SButton>
          <SButton color="#f59e0b" @click="handleClick('Orange')">Orange Button</SButton>
        </div>
      </DemoSection>
    </section>

    <!-- Variants -->
    <section id="variants">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Variants</h2>
      <DemoSection 
        title="Button Variants"
        description="Five variants available: filled (default), outlined, light, ghost, and link."
        :code="variantsCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-4 items-center">
          <div class="flex flex-col items-center gap-2">
            <SButton variant="filled">Filled</SButton>
            <span class="text-xs font-mono text-(--s-text-secondary)">filled</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SButton variant="outlined">Outlined</SButton>
            <span class="text-xs font-mono text-(--s-text-secondary)">outlined</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SButton variant="light">Light</SButton>
            <span class="text-xs font-mono text-(--s-text-secondary)">light</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SButton variant="ghost">Ghost</SButton>
            <span class="text-xs font-mono text-(--s-text-secondary)">ghost</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SButton variant="link">Link</SButton>
            <span class="text-xs font-mono text-(--s-text-secondary)">link</span>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Variant Colors -->
    <section id="variant-colors">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Variant Colors</h2>
      <DemoSection 
        title="Colored Variants"
        description="All variants adapt to the color prop."
        :code="variantColorsCode"
        language="vue"
      >
        <div class="space-y-4">
          <div class="flex flex-wrap gap-3 items-center">
            <SButton color="#8b5cf6" variant="filled">Filled</SButton>
            <SButton color="#8b5cf6" variant="outlined">Outlined</SButton>
            <SButton color="#8b5cf6" variant="light">Light</SButton>
            <SButton color="#8b5cf6" variant="ghost">Ghost</SButton>
          </div>
          <div class="flex flex-wrap gap-3 items-center">
            <SButton color="#ef4444" variant="filled">Filled</SButton>
            <SButton color="#ef4444" variant="outlined">Outlined</SButton>
            <SButton color="#ef4444" variant="light">Light</SButton>
            <SButton color="#ef4444" variant="ghost">Ghost</SButton>
          </div>
          <div class="flex flex-wrap gap-3 items-center">
            <SButton color="#06b6d4" variant="filled">Filled</SButton>
            <SButton color="#06b6d4" variant="outlined">Outlined</SButton>
            <SButton color="#06b6d4" variant="light">Light</SButton>
            <SButton color="#06b6d4" variant="ghost">Ghost</SButton>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Sizes -->
    <section id="sizes">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Sizes</h2>
      <DemoSection 
        title="Button Sizes"
        description="Five size options: xs, small, medium (default), large, and xl."
        :code="sizesCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-4 items-end">
          <div class="flex flex-col items-center gap-2">
            <SButton size="xs">Extra Small</SButton>
            <span class="text-xs font-mono text-(--s-text-secondary)">xs</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SButton size="small">Small</SButton>
            <span class="text-xs font-mono text-(--s-text-secondary)">small</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SButton size="medium">Medium</SButton>
            <span class="text-xs font-mono text-(--s-text-secondary)">medium</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SButton size="large">Large</SButton>
            <span class="text-xs font-mono text-(--s-text-secondary)">large</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SButton size="xl">Extra Large</SButton>
            <span class="text-xs font-mono text-(--s-text-secondary)">xl</span>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Border Radius -->
    <section id="border-radius">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Border Radius</h2>
      <DemoSection 
        title="Rounded Corners"
        description="Control the border radius with the rounded prop."
        :code="roundedCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-4 items-center">
          <div class="flex flex-col items-center gap-2">
            <SButton rounded="none" color="#3b82f6">None</SButton>
            <span class="text-xs font-mono text-(--s-text-secondary)">none</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SButton rounded="sm" color="#3b82f6">Small</SButton>
            <span class="text-xs font-mono text-(--s-text-secondary)">sm</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SButton rounded="md" color="#3b82f6">Medium</SButton>
            <span class="text-xs font-mono text-(--s-text-secondary)">md</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SButton rounded="lg" color="#3b82f6">Large</SButton>
            <span class="text-xs font-mono text-(--s-text-secondary)">lg</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SButton rounded="full" color="#3b82f6">Pill</SButton>
            <span class="text-xs font-mono text-(--s-text-secondary)">full</span>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Icons -->
    <section id="with-icons">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">With Icons</h2>
      <DemoSection 
        title="Icon Buttons"
        description="Add icons using iconLeft, iconRight props, or use iconOnly for icon-only buttons."
        :code="iconsCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-3 items-center">
          <SButton :iconLeft="ri('home')">Home</SButton>
          <SButton :iconRight="ri('arrow-right')" color="#3b82f6">Continue</SButton>
          <SButton :iconLeft="ri('plus')" :iconRight="ri('chevron-down')" variant="outlined">New Item</SButton>
          <SButton iconOnly rounded="full" color="#ec4899">
            <span class="mdi mdi-heart"></span>
          </SButton>
          <SButton iconOnly variant="ghost">
            <span class="mdi mdi-cog"></span>
          </SButton>
          <SButton iconOnly variant="light" color="#8b5cf6">
            <span class="mdi mdi-bell"></span>
          </SButton>
        </div>
      </DemoSection>
    </section>

    <!-- Loading State -->
    <section id="loading-state">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Loading State</h2>
      <DemoSection 
        title="Loading Buttons"
        description="Show a loading spinner and prevent interaction. Click the first button to see it in action."
        :code="loadingCode"
        language="vue"
      >
        <div class="space-y-4">
          <div class="flex flex-wrap gap-3 items-center">
            <SButton :loading="isLoading" @click="simulateLoading">
              {{ isLoading ? 'Loading...' : 'Click to Load' }}
            </SButton>
            <SButton loading variant="outlined">Loading...</SButton>
            <SButton loading variant="light" color="#8b5cf6">Processing</SButton>
            <SButton loading size="small" color="#ec4899">Wait</SButton>
          </div>
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-2">With <code class="px-1.5 py-0.5 rounded bg-(--s-bg-tertiary) text-(--s-text-primary) text-xs">preserveSize</code> to maintain button width:</p>
            <div class="flex flex-wrap gap-3 items-center">
              <SButton :loading="isLoading" preserveSize @click="simulateLoading">
                Submit Order
              </SButton>
              <SButton loading preserveSize variant="outlined" :iconLeft="ri('cloud-upload')">
                Upload File
              </SButton>
              <SButton loading preserveSize variant="light" color="#8b5cf6" :iconRight="ri('arrow-right')">
                Continue
              </SButton>
            </div>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Disabled State -->
    <section id="disabled-state">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Disabled State</h2>
      <DemoSection 
        title="Disabled Buttons"
        description="Disabled buttons have reduced opacity and cannot be interacted with."
        :code="disabledCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-3 items-center">
          <SButton disabled>Disabled Filled</SButton>
          <SButton disabled variant="outlined">Disabled Outlined</SButton>
          <SButton disabled variant="light">Disabled Light</SButton>
          <SButton disabled variant="ghost">Disabled Ghost</SButton>
          <SButton disabled variant="link">Disabled Link</SButton>
        </div>
      </DemoSection>
    </section>

    <!-- Block/Full Width -->
    <section id="block-full-width">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Block / Full Width</h2>
      <DemoSection 
        title="Full Width Buttons"
        description="Use the block prop to make buttons span the full width of their container."
        :code="blockCode"
        language="vue"
      >
        <div class="space-y-3 max-w-md">
          <SButton block size="large" :iconLeft="ri('rocket-launch')">Full Width Button</SButton>
          <SButton block variant="outlined" color="#3b82f6">Full Width Outlined</SButton>
          <SButton block variant="light" color="#8b5cf6">Full Width Light</SButton>
        </div>
      </DemoSection>
    </section>

    <!-- As Links -->
    <section id="as-links">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">As Links</h2>
      <DemoSection 
        title="Button Links"
        description="Use href for external links or to for Vue Router navigation."
        :code="linksCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-3 items-center">
          <SButton href="https://google.com" target="_blank" :iconRight="ri('open-in-new')">
            External Link
          </SButton>
          <SButton to="/ui/chips" variant="light" :iconLeft="ri('arrow-left')">
            Go to Chips
          </SButton>
          <SButton to="/ui/switch" variant="outlined" :iconRight="ri('arrow-right')">
            Go to Switch
          </SButton>
        </div>
      </DemoSection>
    </section>

    <!-- Button Groups -->
    <section id="button-groups">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Button Groups</h2>
      <DemoSection 
        title="Grouped Buttons"
        description="Create button groups by combining buttons with custom border radius."
        :code="buttonGroupCode"
        language="vue"
      >
        <div class="space-y-4">
          <div class="inline-flex">
            <SButton rounded="none" class="rounded-l-lg border-r-0">Left</SButton>
            <SButton rounded="none" variant="outlined" class="border-x-0">Center</SButton>
            <SButton rounded="none" class="rounded-r-lg border-l-0">Right</SButton>
          </div>
          <div class="inline-flex ml-4">
            <SButton rounded="none" variant="outlined" color="#8b5cf6" class="rounded-l-lg">
              <span class="mdi mdi-format-bold"></span>
            </SButton>
            <SButton rounded="none" variant="outlined" color="#8b5cf6">
              <span class="mdi mdi-format-italic"></span>
            </SButton>
            <SButton rounded="none" variant="outlined" color="#8b5cf6" class="rounded-r-lg">
              <span class="mdi mdi-format-underline"></span>
            </SButton>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Combined Features -->
    <section id="combined-features">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Combined Features</h2>
      <DemoSection 
        title="Real-world Examples"
        description="Combine multiple features for common use cases."
        :code="combinedCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-4 items-center">
          <SButton
            variant="filled"
            size="large"
            color="#8b5cf6"
            :iconLeft="ri('rocket-launch')"
            rounded="lg"
          >
            Launch Project
          </SButton>
          <SButton
            variant="outlined"
            size="small"
            color="#10b981"
            :iconRight="ri('check')"
            rounded="full"
          >
            Completed
          </SButton>
          <SButton
            variant="light"
            color="#ef4444"
            :iconLeft="ri('trash-can')"
          >
            Delete
          </SButton>
          <SButton
            variant="ghost"
            :iconLeft="ri('share-variant')"
          >
            Share
          </SButton>
        </div>
      </DemoSection>
    </section>

    <!-- Ripple Effect Demo -->
    <section id="ripple-effect">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Ripple Effect</h2>
      <DemoSection 
        title="Click Animation"
        description="Buttons include a ripple effect on click. Disable it with :ripple='false'."
        :code="rippleCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-3 items-center">
          <SButton size="large" color="#3b82f6">Click me for ripple!</SButton>
          <SButton size="large" :ripple="false" variant="outlined">No Ripple</SButton>
        </div>
      </DemoSection>
    </section>

    <!-- Animate Slot -->
    <section id="hover-animations">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Hover Animations</h2>
      <DemoSection 
        title="Animated Buttons"
        description="Use the #animate slot to show different content on hover. Choose from slide, vertical, scale, or rotate animations."
        :code="animateCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-4 items-center">
          <!-- Slide (default) -->
          <div class="flex flex-col items-center gap-2">
            <SButton size="large">
              Home
              <template #animate>
                <span class="mdi mdi-home mr-1"></span> Go Home
              </template>
            </SButton>
            <span class="text-xs font-mono text-(--s-text-secondary)">slide</span>
          </div>
          
          <!-- Vertical -->
          <div class="flex flex-col items-center gap-2">
            <SButton size="large" animation-type="vertical" color="#10b981">
              Message
              <template #animate>
                <span class="mdi mdi-email-send mr-1"></span> Send
              </template>
            </SButton>
            <span class="text-xs font-mono text-(--s-text-secondary)">vertical</span>
          </div>
          
          <!-- Scale -->
          <div class="flex flex-col items-center gap-2">
            <SButton size="large" animation-type="scale" color="#8b5cf6">
              Like
              <template #animate>
                <span class="mdi mdi-heart text-lg"></span>
              </template>
            </SButton>
            <span class="text-xs font-mono text-(--s-text-secondary)">scale</span>
          </div>
          
          <!-- Rotate -->
          <div class="flex flex-col items-center gap-2">
            <SButton size="large" animation-type="rotate" color="#f59e0b">
              Settings
              <template #animate>
                <span class="mdi mdi-cog text-lg"></span>
              </template>
            </SButton>
            <span class="text-xs font-mono text-(--s-text-secondary)">rotate</span>
          </div>
        </div>
        
        <!-- More examples with variants -->
        <div class="mt-6 pt-6 border-t border-(--s-border)">
          <p class="text-sm text-(--s-text-secondary) mb-4">Works with all variants:</p>
          <div class="flex flex-wrap gap-3 items-center">
            <SButton variant="outlined" animation-type="vertical" color="#3b82f6">
              Download
              <template #animate>
                <span class="mdi mdi-download"></span> Get File
              </template>
            </SButton>
            <SButton variant="light" animation-type="scale" color="#ec4899">
              Favorite
              <template #animate>
                <span class="mdi mdi-star"></span>
              </template>
            </SButton>
            <SButton variant="ghost" animation-type="rotate">
              Refresh
              <template #animate>
                <span class="mdi mdi-refresh"></span>
              </template>
            </SButton>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- With Keyboard Shortcuts -->
    <section id="with-keyboard-shortcuts">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">With Keyboard Shortcuts</h2>
      <DemoSection
        title="Shortcut Hints"
        description="Use SKbd or SKbdShortcut inside buttons to display keyboard shortcut hints."
        :code="kbdShortcutCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-3 items-center">
          <SButton variant="outlined">
            Search
            <SKbdShortcut :keys="['⌘', 'K']" size="xs" variant="flat" class="ml-2 opacity-70" />
          </SButton>
          <SButton variant="light">
            Save
            <SKbdShortcut :keys="['⌘', 'S']" size="xs" variant="flat" class="ml-2 opacity-70" />
          </SButton>
          <SButton variant="ghost">
            Undo
            <SKbdShortcut :keys="['⌘', 'Z']" size="xs" variant="ghost" class="ml-1 opacity-60" />
          </SButton>
        </div>
      </DemoSection>
    </section>

    <!-- API Reference -->
    <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">API Reference</h2>
    <SApiSection>
      <SApiTable
        title="Props"
        type="props"
        :props="buttonProps"
      />

      <SApiTable 
        title="Events" 
        type="events" 
        :events="buttonEvents" 
      />

      <SApiTable 
        title="Slots" 
        type="slots" 
        :slots="buttonSlots"
      >
        <!-- Slot Example -->
        <div class="mt-4 p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <h4 class="text-sm font-semibold text-(--s-text-primary) mb-3">Example: Custom icon slots</h4>
          <pre class="text-xs bg-(--s-bg-tertiary) p-3 rounded-lg overflow-x-auto"><code class="text-(--s-text-secondary)">&lt;SButton color="#8b5cf6"&gt;
  &lt;template #icon-left&gt;
    &lt;span class="mdi mdi-rocket-launch"&gt;&lt;/span&gt;
  &lt;/template&gt;
  Launch Project
&lt;/SButton&gt;</code></pre>
        </div>
      </SApiTable>

      <SApiKeyboard :shortcuts="keyboardShortcuts" />
    </SApiSection>
  </div>
</template>
