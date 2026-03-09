<script setup lang="ts">
import { ref, computed } from 'vue'
import { SAccordion, SAccordionItem, SAccordionTrigger, SAccordionContent, SApiSection, SApiTable, SApiKeyboard } from '../../index'
import type { ApiProp, ApiEvent, ApiSlot, KeyboardShortcut } from '../../index'
import DemoSection from '../../components/DemoSection.vue'
import { useCustomizer } from '../../composables/useCustomizer'
import { getLucideImportName } from '../../lib/iconMap'

const { ri, iconPack } = useCustomizer()

// Code generation helpers
const cp = (mdiName: string, attr = 'icon') => {
  if (iconPack.value === 'mdi') return `${attr}="${mdiName}"`
  const name = getLucideImportName(mdiName)
  return name ? `:${attr}="${name}"` : `${attr}="${mdiName}"`
}

// Basic usage
const basicValue = ref<string | number>('item-1')

// Multiple mode
const multipleValue = ref<(string | number)[]>(['item-1'])

// Variants demo
const variantDefault = ref('item-1')
const variantBordered = ref('item-1')
const variantSeparated = ref('item-1')
const variantCard = ref('item-1')
const variantMinimal = ref('item-1')

// Sizes
const sizeValue = ref('item-1')

// Icon placement
const iconLeftValue = ref('item-1')

// Custom icons
const iconValue = ref('settings')

// Disabled
const disabledValue = ref('item-1')

// Nested
const nestedValue = ref('parent-1')
const nestedChildValue = ref('')

// FAQ example
const faqValue = ref('')

// Colors
const colorValue = ref('item-1')

// Custom arrow
const customArrowValue = ref('item-1')

// Dense mode
const denseValue = ref('item-1')

// Simple API
const simpleValue = ref('item-1')

// Code snippets
const basicCode = `<script setup>
import { ref } from 'vue'
import { SAccordion, SAccordionItem, SAccordionTrigger, SAccordionContent } from 'saka-ui'

const expanded = ref('item-1')
<\/script>

<template>
  <SAccordion v-model="expanded" type="bordered">
    <SAccordionItem name="item-1">
      <SAccordionTrigger>What is Vue.js?</SAccordionTrigger>
      <SAccordionContent>
        Vue.js is a progressive JavaScript framework for building user interfaces.
        It was created by Evan You and is designed to be incrementally adoptable.
      </SAccordionContent>
    </SAccordionItem>
    <SAccordionItem name="item-2">
      <SAccordionTrigger>Why choose Vue?</SAccordionTrigger>
      <SAccordionContent>
        Vue offers a gentle learning curve, excellent documentation, and a flexible
        architecture that scales from small widgets to enterprise applications.
      </SAccordionContent>
    </SAccordionItem>
    <SAccordionItem name="item-3">
      <SAccordionTrigger>How do I get started?</SAccordionTrigger>
      <SAccordionContent>
        Scaffold with Vite, install saka-ui, and start building.
        Check the official documentation at vuejs.org.
      </SAccordionContent>
    </SAccordionItem>
  </SAccordion>
</template>`

const multipleCode = `<SAccordion v-model="expanded" type="bordered" multiple>
  <SAccordionItem name="item-1">
    <SAccordionTrigger>
      <template #icon><span class="mdi mdi-star text-lg text-amber-400" /></template>
      Features
    </SAccordionTrigger>
    <SAccordionContent>
      Multiple items can be expanded at the same time.
    </SAccordionContent>
  </SAccordionItem>
  <SAccordionItem name="item-2">
    <SAccordionTrigger>
      <template #icon><span class="mdi mdi-speedometer text-lg text-blue-400" /></template>
      Performance
    </SAccordionTrigger>
    <SAccordionContent>
      Lazy loading available for heavy content.
    </SAccordionContent>
  </SAccordionItem>
  <SAccordionItem name="item-3">
    <SAccordionTrigger>
      <template #icon><span class="mdi mdi-palette text-lg text-violet-400" /></template>
      Customization
    </SAccordionTrigger>
    <SAccordionContent>
      Full control over styles, icons, colors, and content.
    </SAccordionContent>
  </SAccordionItem>
</SAccordion>`

const variantsCode = `<!-- Default -->
<SAccordion type="default">...</SAccordion>

<!-- Bordered -->
<SAccordion type="bordered">...</SAccordion>

<!-- Separated -->
<SAccordion type="separated">...</SAccordion>

<!-- Card -->
<SAccordion type="card">...</SAccordion>

<!-- Minimal -->
<SAccordion type="minimal">...</SAccordion>`

const sizesCode = `<SAccordion size="small">...</SAccordion>
<SAccordion size="medium">...</SAccordion>
<SAccordion size="large">...</SAccordion>`

const customIconCode = `<SAccordion v-model="expanded" type="separated">
  <SAccordionItem name="settings">
    <SAccordionTrigger>
      <template #icon>
        <!-- Any SVG, Lucide, Heroicons, or emoji -->
        <svg class="w-[18px] h-[18px] text-muted-foreground">...</svg>
      </template>
      Settings
    </SAccordionTrigger>
    <SAccordionContent>
      Customize your application settings, notifications, and more.
    </SAccordionContent>
  </SAccordionItem>
  <SAccordionItem name="users">
    <SAccordionTrigger>
      <template #icon><svg><!-- users icon --></svg></template>
      Team Members
    </SAccordionTrigger>
    <SAccordionContent>
      Add, remove, or modify team member permissions and roles.
    </SAccordionContent>
  </SAccordionItem>
  <SAccordionItem name="security">
    <SAccordionTrigger>
      <template #icon><svg><!-- shield icon --></svg></template>
      Security
    </SAccordionTrigger>
    <SAccordionContent>
      Enable two-factor authentication, manage sessions, and security keys.
    </SAccordionContent>
  </SAccordionItem>
  <SAccordionItem name="billing">
    <SAccordionTrigger>
      <template #icon><svg><!-- credit card icon --></svg></template>
      Billing
    </SAccordionTrigger>
    <SAccordionContent>
      View invoices, update payment methods, and manage subscriptions.
    </SAccordionContent>
  </SAccordionItem>
</SAccordion>`

const customArrowCode = `<SAccordion v-model="expanded" type="card">
  <SAccordionItem name="item-1">
    <SAccordionTrigger>
      <template #icon><svg><!-- info icon --></svg></template>
      Custom right-chevron arrow
      <template #arrow="{ expanded }">
        <!-- Replace the default chevron with anything -->
        <svg :class="expanded ? 'rotate-90' : ''"><!-- chevron-right --></svg>
      </template>
    </SAccordionTrigger>
    <SAccordionContent>
      The #arrow slot receives { expanded, disabled } so you can animate it.
    </SAccordionContent>
  </SAccordionItem>
  <SAccordionItem name="item-2">
    <SAccordionTrigger>
      <template #icon><svg><!-- plus icon --></svg></template>
      Plus/minus arrow
      <template #arrow="{ expanded }">
        <svg :class="expanded ? 'rotate-45' : ''"><!-- plus --></svg>
      </template>
    </SAccordionTrigger>
    <SAccordionContent>
      A plus icon that rotates 45 degrees to become an X when expanded.
    </SAccordionContent>
  </SAccordionItem>
  <SAccordionItem name="item-3">
    <SAccordionTrigger :hide-arrow="true">
      <template #icon><span>🚀</span></template>
      No arrow at all (hideArrow)
    </SAccordionTrigger>
    <SAccordionContent>
      Set hide-arrow on SAccordionTrigger to remove the indicator entirely.
    </SAccordionContent>
  </SAccordionItem>
</SAccordion>`

const nestedCode = `<SAccordion v-model="parent" type="bordered">
  <SAccordionItem name="parent-1">
    <SAccordionTrigger>
      <template #icon><span class="mdi mdi-folder text-lg text-amber-400" /></template>
      Project Files
    </SAccordionTrigger>
    <SAccordionContent>
      <SAccordion v-model="child" type="card">
        <SAccordionItem name="child-1">
          <SAccordionTrigger>
            <template #icon><span class="mdi mdi-file-document text-lg" /></template>
            README.md
          </SAccordionTrigger>
          <SAccordionContent>Documentation for the project.</SAccordionContent>
        </SAccordionItem>
        <SAccordionItem name="child-2">
          <SAccordionTrigger>
            <template #icon><span class="mdi mdi-file-code text-lg" /></template>
            package.json
          </SAccordionTrigger>
          <SAccordionContent>Project dependencies and scripts.</SAccordionContent>
        </SAccordionItem>
        <SAccordionItem name="child-3">
          <SAccordionTrigger>
            <template #icon><span class="mdi mdi-folder-open text-lg" /></template>
            src/
          </SAccordionTrigger>
          <SAccordionContent>Source code directory.</SAccordionContent>
        </SAccordionItem>
      </SAccordion>
    </SAccordionContent>
  </SAccordionItem>
  <SAccordionItem name="parent-2">
    <SAccordionTrigger>
      <template #icon><span class="mdi mdi-cog text-lg" /></template>
      Configuration
    </SAccordionTrigger>
    <SAccordionContent>
      Configure project settings: build, environment variables, plugins.
    </SAccordionContent>
  </SAccordionItem>
</SAccordion>`

const simpleApiCode = computed(() => `<!-- Simple API: title prop instead of subcomponents -->
<SAccordion v-model="expanded" type="separated" color="#8b5cf6">
  <SAccordionItem name="item-1" ${cp('cog')} title="Settings" subtitle="Configure your preferences">
    Customize your application settings, notifications, and more.
  </SAccordionItem>
  <SAccordionItem name="item-2" ${cp('account-group')} title="Team Members" subtitle="Manage your team">
    Add, remove, or modify team member permissions and roles.
  </SAccordionItem>
  <SAccordionItem name="item-3" ${cp('shield-lock')} title="Security" subtitle="Keep your account safe">
    Enable two-factor authentication, manage sessions, and security keys.
  </SAccordionItem>
</SAccordion>`)

// API Reference data
const accordionProps: ApiProp[] = [
  { name: 'modelValue', type: 'string | number | array', default: 'undefined', description: 'Currently expanded item(s)', category: 'Core' },
  { name: 'multiple', type: 'boolean', default: 'false', description: 'Allow multiple items open', category: 'Core' },
  { name: 'collapsible', type: 'boolean', default: 'true', description: 'Allow all items to be collapsed', category: 'Core' },
  { name: 'type', type: "'default' | 'bordered' | 'separated' | 'card' | 'minimal'", default: "'default'", description: 'Visual variant', category: 'Appearance' },
  { name: 'size', type: "'small' | 'medium' | 'large'", default: "'medium'", description: 'Size variant', category: 'Appearance' },
  { name: 'color', type: 'string', default: "'var(--s-primary)'", description: 'Accent color', category: 'Appearance' },
  { name: 'dense', type: 'boolean', default: 'false', description: 'Compact mode with reduced padding', category: 'Appearance' },
  { name: 'iconPlacement', type: "'left' | 'right'", default: "'right'", description: 'Expand icon position', category: 'Icons' },
  { name: 'animated', type: 'boolean', default: 'true', description: 'Enable smooth animations', category: 'Animation' }
]

const accordionItemProps: ApiProp[] = [
  { name: 'name', type: 'string | number', default: 'required', description: 'Unique identifier', category: 'Core' },
  { name: 'title', type: 'string', default: 'undefined', description: 'Header title text (simple API)', category: 'Content' },
  { name: 'subtitle', type: 'string', default: 'undefined', description: 'Secondary text (simple API)', category: 'Content' },
  { name: 'icon', type: 'string', default: 'undefined', description: 'MDI icon name (simple API)', category: 'Content' },
  { name: 'expandIcon', type: 'string', default: "'chevron-down'", description: 'Custom expand icon MDI name (simple API)', category: 'Content' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable this item', category: 'States' },
  { name: 'lazy', type: 'boolean', default: 'false', description: 'Lazy render content', category: 'States' }
]

const accordionItemSlots: ApiSlot[] = [
  { name: 'default', description: 'SAccordionTrigger + SAccordionContent (compound) or plain content (simple API with title prop)' }
]

const triggerProps: ApiProp[] = [
  { name: 'hideArrow', type: 'boolean', default: 'false', description: 'Hide the default arrow indicator', category: 'Appearance' },
  { name: 'triggerClass', type: 'string', default: "''", description: 'Additional CSS classes for the trigger button', category: 'Appearance' }
]

const triggerSlots: ApiSlot[] = [
  { name: 'default', props: '{ expanded, disabled }', description: 'Trigger label text' },
  { name: '#icon', props: '{ expanded, disabled }', description: 'Leading icon slot — any component (Lucide, SVG, MDI, emoji)' },
  { name: '#arrow', props: '{ expanded, disabled }', description: 'Expand indicator — replaces the default chevron SVG' }
]

const contentProps: ApiProp[] = [
  { name: 'contentClass', type: 'string', default: "''", description: 'Additional CSS classes for the content area', category: 'Appearance' }
]

const accordionEvents: ApiEvent[] = [
  { name: 'update:modelValue', payload: 'value', description: 'Active item(s) changed' },
  { name: 'change', payload: '(name, expanded)', description: 'Item toggled' },
  { name: 'before-expand', payload: '(name)', description: 'Before item expands' },
  { name: 'after-expand', payload: '(name)', description: 'After item expanded' },
  { name: 'before-collapse', payload: '(name)', description: 'Before item collapses' },
  { name: 'after-collapse', payload: '(name)', description: 'After item collapsed' }
]

const keyboardShortcuts: KeyboardShortcut[] = [
  { keys: 'Tab', action: 'Move focus between headers' },
  { keys: ['Enter', 'Space'], action: 'Toggle focused accordion item' }
]
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- @component SAccordion -->
    <!-- @props modelValue, multiple, collapsible, type, size, color, dense, iconPlacement, animated -->
    <!-- @events update:modelValue, change, before-expand, after-expand, before-collapse, after-collapse -->
    <!-- @slots default, #icon, #arrow -->
    <!-- @sections features, basic-usage, custom-icons, custom-arrow, multiple-expansion, variants, sizes, dense-mode, icon-placement, disabled-items, nested-accordions, custom-colors, real-world-example, simple-api -->
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-foreground mb-2">Accordion</h1>
      <p class="text-lg text-muted-foreground">A compound accordion component with full control over trigger, icons, and content.</p>
    </header>

    <!-- Features -->
    <article id="features">
      <h3 class="text-xl font-semibold text-foreground mb-4">Features</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 rounded-xl bg-emerald-500/5 border border-border">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-puzzle text-xl text-emerald-400"></span>
            <span class="font-semibold text-foreground">Compound API</span>
          </div>
          <p class="text-sm text-muted-foreground">SAccordionTrigger + SAccordionContent for full composability.</p>
        </div>
        <div class="p-4 rounded-xl bg-blue-500/5 border border-border">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-image-filter-vintage text-xl text-blue-400"></span>
            <span class="font-semibold text-foreground">Any Icon Library</span>
          </div>
          <p class="text-sm text-muted-foreground">Use Lucide, Heroicons, SVGs, or emoji via #icon and #arrow slots.</p>
        </div>
        <div class="p-4 rounded-xl bg-violet-500/5 border border-border">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-view-sequential text-xl text-violet-400"></span>
            <span class="font-semibold text-foreground">Five Variants</span>
          </div>
          <p class="text-sm text-muted-foreground">Default, bordered, separated, card, and minimal styles.</p>
        </div>
        <div class="p-4 rounded-xl bg-amber-500/5 border border-border">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-animation text-xl text-amber-400"></span>
            <span class="font-semibold text-foreground">Smooth Animations</span>
          </div>
          <p class="text-sm text-muted-foreground">Hardware-accelerated expand/collapse with configurable timing.</p>
        </div>
        <div class="p-4 rounded-xl bg-pink-500/5 border border-border">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-keyboard text-xl text-pink-400"></span>
            <span class="font-semibold text-foreground">Keyboard Navigation</span>
          </div>
          <p class="text-sm text-muted-foreground">Full keyboard support with Tab, Enter, and Space.</p>
        </div>
        <div class="p-4 rounded-xl bg-cyan-500/5 border border-border">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-checkbox-multiple-marked text-xl text-cyan-400"></span>
            <span class="font-semibold text-foreground">Single & Multiple</span>
          </div>
          <p class="text-sm text-muted-foreground">Toggle between single or multiple items open at once.</p>
        </div>
      </div>
    </article>

    <!-- Basic Usage -->
    <section id="basic-usage">
      <h2 class="text-2xl font-bold text-foreground mb-6">Basic Usage</h2>
      <DemoSection
        title="Compound API"
        description="Use SAccordionTrigger for the header and SAccordionContent for the body. Click to expand/collapse."
        :code="basicCode"
        language="vue"
      >
        <div class="max-w-2xl">
          <SAccordion v-model="basicValue" type="bordered">
            <SAccordionItem name="item-1">
              <SAccordionTrigger>What is Vue.js?</SAccordionTrigger>
              <SAccordionContent>
                Vue.js is a progressive JavaScript framework for building user interfaces. It was created by Evan You and is designed to be incrementally adoptable.
              </SAccordionContent>
            </SAccordionItem>
            <SAccordionItem name="item-2">
              <SAccordionTrigger>Why choose Vue?</SAccordionTrigger>
              <SAccordionContent>
                Vue offers a gentle learning curve, excellent documentation, and a flexible architecture that scales from small widgets to enterprise applications.
              </SAccordionContent>
            </SAccordionItem>
            <SAccordionItem name="item-3">
              <SAccordionTrigger>How do I get started?</SAccordionTrigger>
              <SAccordionContent>
                Scaffold with Vite, install saka-ui, and start building. Check the official documentation at vuejs.org.
              </SAccordionContent>
            </SAccordionItem>
          </SAccordion>
          <p class="text-sm text-muted-foreground mt-4">
            Currently expanded: <code class="font-mono text-emerald-400">{{ basicValue || 'none' }}</code>
          </p>
        </div>
      </DemoSection>
    </section>

    <!-- Custom Icons -->
    <section id="custom-icons">
      <h2 class="text-2xl font-bold text-foreground mb-6">Custom Icons</h2>
      <DemoSection
        title="#icon Slot"
        description="Place any component in the #icon slot — Lucide, Heroicons, inline SVGs, or even emoji. No dependency on MDI."
        :code="customIconCode"
        language="vue"
      >
        <div class="max-w-xl">
          <SAccordion v-model="iconValue" type="separated">
            <SAccordionItem name="settings">
              <SAccordionTrigger>
                <template #icon>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground shrink-0"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                </template>
                Settings
              </SAccordionTrigger>
              <SAccordionContent>
                Customize your application settings, notifications, and more.
              </SAccordionContent>
            </SAccordionItem>
            <SAccordionItem name="users">
              <SAccordionTrigger>
                <template #icon>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground shrink-0"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </template>
                Team Members
              </SAccordionTrigger>
              <SAccordionContent>
                Add, remove, or modify team member permissions and roles.
              </SAccordionContent>
            </SAccordionItem>
            <SAccordionItem name="security">
              <SAccordionTrigger>
                <template #icon>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground shrink-0"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                </template>
                Security
              </SAccordionTrigger>
              <SAccordionContent>
                Enable two-factor authentication, manage sessions, and security keys.
              </SAccordionContent>
            </SAccordionItem>
            <SAccordionItem name="billing">
              <SAccordionTrigger>
                <template #icon>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground shrink-0"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                </template>
                Billing
              </SAccordionTrigger>
              <SAccordionContent>
                View invoices, update payment methods, and manage subscriptions.
              </SAccordionContent>
            </SAccordionItem>
          </SAccordion>
        </div>
      </DemoSection>
    </section>

    <!-- Custom Arrow -->
    <section id="custom-arrow">
      <h2 class="text-2xl font-bold text-foreground mb-6">Custom Arrow</h2>
      <DemoSection
        title="#arrow Slot & hideArrow"
        description="Replace the default chevron with any component via #arrow, or hide it entirely with the hideArrow prop."
        :code="customArrowCode"
        language="vue"
      >
        <div class="max-w-2xl">
          <SAccordion v-model="customArrowValue" type="card">
            <SAccordionItem name="item-1">
              <SAccordionTrigger>
                <template #icon>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500 shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                </template>
                Custom right-chevron arrow
                <template #arrow="{ expanded }">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 text-muted-foreground transition-transform duration-300" :class="expanded ? 'rotate-90' : ''"><path d="m9 18 6-6-6-6"/></svg>
                </template>
              </SAccordionTrigger>
              <SAccordionContent>
                The #arrow slot receives <code class="text-xs bg-accent px-1 py-0.5 rounded">{ expanded, disabled }</code> so you can animate it however you like.
              </SAccordionContent>
            </SAccordionItem>
            <SAccordionItem name="item-2">
              <SAccordionTrigger>
                <template #icon>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-violet-500 shrink-0"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
                </template>
                Plus/minus arrow
                <template #arrow="{ expanded }">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 text-muted-foreground transition-transform duration-300" :class="expanded ? 'rotate-45' : ''"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
                </template>
              </SAccordionTrigger>
              <SAccordionContent>
                A plus icon that rotates 45° to become an X when expanded.
              </SAccordionContent>
            </SAccordionItem>
            <SAccordionItem name="item-3">
              <SAccordionTrigger :hide-arrow="true">
                <template #icon>
                  <span class="text-lg">🚀</span>
                </template>
                No arrow at all (hideArrow)
              </SAccordionTrigger>
              <SAccordionContent>
                Set <code class="text-xs bg-accent px-1 py-0.5 rounded">hide-arrow</code> on SAccordionTrigger to remove the indicator entirely.
              </SAccordionContent>
            </SAccordionItem>
          </SAccordion>
        </div>
      </DemoSection>
    </section>

    <!-- Multiple Expansion -->
    <section id="multiple-expansion">
      <h2 class="text-2xl font-bold text-foreground mb-6">Multiple Expansion</h2>
      <DemoSection
        title="Allow Multiple Open Items"
        description="Enable multiple mode to allow several sections open simultaneously."
        :code="multipleCode"
        language="vue"
      >
        <div class="max-w-2xl">
          <SAccordion v-model="multipleValue" type="bordered" multiple>
            <SAccordionItem name="item-1">
              <SAccordionTrigger>
                <template #icon><span class="mdi mdi-star text-lg text-amber-400 shrink-0"></span></template>
                Features
              </SAccordionTrigger>
              <SAccordionContent>
                Multiple items can be expanded at the same time. Click multiple headers to open them all.
              </SAccordionContent>
            </SAccordionItem>
            <SAccordionItem name="item-2">
              <SAccordionTrigger>
                <template #icon><span class="mdi mdi-speedometer text-lg text-blue-400 shrink-0"></span></template>
                Performance
              </SAccordionTrigger>
              <SAccordionContent>
                Lazy loading available for heavy content. Animations are optimized with hardware acceleration.
              </SAccordionContent>
            </SAccordionItem>
            <SAccordionItem name="item-3">
              <SAccordionTrigger>
                <template #icon><span class="mdi mdi-palette text-lg text-violet-400 shrink-0"></span></template>
                Customization
              </SAccordionTrigger>
              <SAccordionContent>
                Full control over styles, icons, colors, and content via props and slots.
              </SAccordionContent>
            </SAccordionItem>
          </SAccordion>
          <p class="text-sm text-muted-foreground mt-4">
            Expanded items: <code class="font-mono text-emerald-400">{{ multipleValue.length > 0 ? multipleValue.join(', ') : 'none' }}</code>
          </p>
        </div>
      </DemoSection>
    </section>

    <!-- Variants -->
    <section id="variants">
      <h2 class="text-2xl font-bold text-foreground mb-6">Variants</h2>
      <DemoSection
        title="Visual Style Variants"
        description="Five distinct visual styles for different design contexts."
        :code="variantsCode"
        language="vue"
      >
        <div class="space-y-8">
          <div>
            <p class="text-sm text-muted-foreground mb-3 font-medium">Default</p>
            <div class="max-w-xl">
              <SAccordion v-model="variantDefault" type="default">
                <SAccordionItem name="item-1">
                  <SAccordionTrigger>Default Style</SAccordionTrigger>
                  <SAccordionContent>Clean, minimal appearance with subtle hover effects.</SAccordionContent>
                </SAccordionItem>
                <SAccordionItem name="item-2">
                  <SAccordionTrigger>Another Section</SAccordionTrigger>
                  <SAccordionContent>Works great for simple use cases.</SAccordionContent>
                </SAccordionItem>
              </SAccordion>
            </div>
          </div>

          <div>
            <p class="text-sm text-muted-foreground mb-3 font-medium">Bordered</p>
            <div class="max-w-xl">
              <SAccordion v-model="variantBordered" type="bordered">
                <SAccordionItem name="item-1">
                  <SAccordionTrigger>Bordered Style</SAccordionTrigger>
                  <SAccordionContent>Items contained within a bordered container.</SAccordionContent>
                </SAccordionItem>
                <SAccordionItem name="item-2">
                  <SAccordionTrigger>Another Section</SAccordionTrigger>
                  <SAccordionContent>Great for grouping related content.</SAccordionContent>
                </SAccordionItem>
              </SAccordion>
            </div>
          </div>

          <div>
            <p class="text-sm text-muted-foreground mb-3 font-medium">Separated</p>
            <div class="max-w-xl">
              <SAccordion v-model="variantSeparated" type="separated">
                <SAccordionItem name="item-1">
                  <SAccordionTrigger>Separated Style</SAccordionTrigger>
                  <SAccordionContent>Each item is visually separate with its own border.</SAccordionContent>
                </SAccordionItem>
                <SAccordionItem name="item-2">
                  <SAccordionTrigger>Another Section</SAccordionTrigger>
                  <SAccordionContent>Adds visual distinction between sections.</SAccordionContent>
                </SAccordionItem>
              </SAccordion>
            </div>
          </div>

          <div>
            <p class="text-sm text-muted-foreground mb-3 font-medium">Card</p>
            <div class="max-w-xl">
              <SAccordion v-model="variantCard" type="card">
                <SAccordionItem name="item-1">
                  <SAccordionTrigger>Card Style</SAccordionTrigger>
                  <SAccordionContent>Elevated cards with shadows for premium feel.</SAccordionContent>
                </SAccordionItem>
                <SAccordionItem name="item-2">
                  <SAccordionTrigger>Another Section</SAccordionTrigger>
                  <SAccordionContent>Perfect for important content sections.</SAccordionContent>
                </SAccordionItem>
              </SAccordion>
            </div>
          </div>

          <div>
            <p class="text-sm text-muted-foreground mb-3 font-medium">Minimal</p>
            <div class="max-w-xl">
              <SAccordion v-model="variantMinimal" type="minimal">
                <SAccordionItem name="item-1">
                  <SAccordionTrigger>Minimal Style</SAccordionTrigger>
                  <SAccordionContent>Ultra-clean with no containers or dividers.</SAccordionContent>
                </SAccordionItem>
                <SAccordionItem name="item-2">
                  <SAccordionTrigger>Another Section</SAccordionTrigger>
                  <SAccordionContent>Headers highlight on hover.</SAccordionContent>
                </SAccordionItem>
              </SAccordion>
            </div>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Sizes -->
    <section id="sizes">
      <h2 class="text-2xl font-bold text-foreground mb-6">Sizes</h2>
      <DemoSection
        title="Size Variants"
        description="Three size options for different contexts."
        :code="sizesCode"
        language="vue"
      >
        <div class="space-y-6">
          <div>
            <p class="text-sm text-muted-foreground mb-3">Small</p>
            <div class="max-w-md">
              <SAccordion v-model="sizeValue" type="bordered" size="small">
                <SAccordionItem name="item-1">
                  <SAccordionTrigger>Small Size</SAccordionTrigger>
                  <SAccordionContent>Compact accordion for tight spaces.</SAccordionContent>
                </SAccordionItem>
              </SAccordion>
            </div>
          </div>
          <div>
            <p class="text-sm text-muted-foreground mb-3">Medium (default)</p>
            <div class="max-w-md">
              <SAccordion v-model="sizeValue" type="bordered" size="medium">
                <SAccordionItem name="item-1">
                  <SAccordionTrigger>Medium Size</SAccordionTrigger>
                  <SAccordionContent>Standard size for most use cases.</SAccordionContent>
                </SAccordionItem>
              </SAccordion>
            </div>
          </div>
          <div>
            <p class="text-sm text-muted-foreground mb-3">Large</p>
            <div class="max-w-md">
              <SAccordion v-model="sizeValue" type="bordered" size="large">
                <SAccordionItem name="item-1">
                  <SAccordionTrigger>Large Size</SAccordionTrigger>
                  <SAccordionContent>Larger padding for emphasis.</SAccordionContent>
                </SAccordionItem>
              </SAccordion>
            </div>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Dense Mode -->
    <section id="dense-mode">
      <h2 class="text-2xl font-bold text-foreground mb-6">Dense Mode</h2>
      <DemoSection
        title="Compact Layout"
        description="Use dense mode for a more compact accordion with reduced padding."
        :code="`<SAccordion dense>...</SAccordion>`"
        language="vue"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p class="text-sm text-muted-foreground mb-3">Normal</p>
            <SAccordion v-model="denseValue" type="card">
              <SAccordionItem name="item-1">
                <SAccordionTrigger>Standard Padding</SAccordionTrigger>
                <SAccordionContent>This accordion uses normal padding.</SAccordionContent>
              </SAccordionItem>
              <SAccordionItem name="item-2">
                <SAccordionTrigger>More Space</SAccordionTrigger>
                <SAccordionContent>Standard space for better readability.</SAccordionContent>
              </SAccordionItem>
            </SAccordion>
          </div>
          <div>
            <p class="text-sm text-muted-foreground mb-3">Dense</p>
            <SAccordion v-model="denseValue" type="card" dense>
              <SAccordionItem name="item-1">
                <SAccordionTrigger>Compact Padding</SAccordionTrigger>
                <SAccordionContent>This accordion uses dense mode with reduced padding.</SAccordionContent>
              </SAccordionItem>
              <SAccordionItem name="item-2">
                <SAccordionTrigger>Less Space</SAccordionTrigger>
                <SAccordionContent>Great for sidebars, menus, or information-dense UIs.</SAccordionContent>
              </SAccordionItem>
            </SAccordion>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Icon Placement -->
    <section id="icon-placement">
      <h2 class="text-2xl font-bold text-foreground mb-6">Icon Placement</h2>
      <DemoSection
        title="Expand Arrow Position"
        description="Place the expand chevron on the left or right side."
        :code="`<SAccordion icon-placement=&quot;left&quot;>...</SAccordion>`"
        language="vue"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p class="text-sm text-muted-foreground mb-3">Right (default)</p>
            <SAccordion v-model="iconLeftValue" type="card" icon-placement="right">
              <SAccordionItem name="item-1">
                <SAccordionTrigger>
                  <template #icon><span class="mdi mdi-cog text-lg text-muted-foreground shrink-0"></span></template>
                  Settings
                </SAccordionTrigger>
                <SAccordionContent>Settings content here.</SAccordionContent>
              </SAccordionItem>
              <SAccordionItem name="item-2">
                <SAccordionTrigger>
                  <template #icon><span class="mdi mdi-account text-lg text-muted-foreground shrink-0"></span></template>
                  Profile
                </SAccordionTrigger>
                <SAccordionContent>Profile content here.</SAccordionContent>
              </SAccordionItem>
            </SAccordion>
          </div>
          <div>
            <p class="text-sm text-muted-foreground mb-3">Left</p>
            <SAccordion v-model="iconLeftValue" type="card" icon-placement="left">
              <SAccordionItem name="item-1">
                <SAccordionTrigger>
                  <template #icon><span class="mdi mdi-cog text-lg text-muted-foreground shrink-0"></span></template>
                  Settings
                </SAccordionTrigger>
                <SAccordionContent>Settings content here.</SAccordionContent>
              </SAccordionItem>
              <SAccordionItem name="item-2">
                <SAccordionTrigger>
                  <template #icon><span class="mdi mdi-account text-lg text-muted-foreground shrink-0"></span></template>
                  Profile
                </SAccordionTrigger>
                <SAccordionContent>Profile content here.</SAccordionContent>
              </SAccordionItem>
            </SAccordion>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Disabled Items -->
    <section id="disabled-items">
      <h2 class="text-2xl font-bold text-foreground mb-6">Disabled Items</h2>
      <DemoSection
        title="Disabled State"
        description="Individual items can be disabled to prevent interaction."
        :code="`<SAccordionItem name='item' disabled>...</SAccordionItem>`"
        language="vue"
      >
        <div class="max-w-xl">
          <SAccordion v-model="disabledValue" type="bordered">
            <SAccordionItem name="item-1">
              <SAccordionTrigger>Available Section</SAccordionTrigger>
              <SAccordionContent>This section is fully interactive.</SAccordionContent>
            </SAccordionItem>
            <SAccordionItem name="item-2" disabled>
              <SAccordionTrigger>Disabled Section</SAccordionTrigger>
              <SAccordionContent>You cannot expand this section.</SAccordionContent>
            </SAccordionItem>
            <SAccordionItem name="item-3">
              <SAccordionTrigger>Another Available Section</SAccordionTrigger>
              <SAccordionContent>This one works too!</SAccordionContent>
            </SAccordionItem>
          </SAccordion>
        </div>
      </DemoSection>
    </section>

    <!-- Nested -->
    <section id="nested-accordions">
      <h2 class="text-2xl font-bold text-foreground mb-6">Nested Accordions</h2>
      <DemoSection
        title="Accordions Inside Accordions"
        description="Full support for nested accordion structures."
        :code="nestedCode"
        language="vue"
      >
        <div class="max-w-xl">
          <SAccordion v-model="nestedValue" type="bordered">
            <SAccordionItem name="parent-1">
              <SAccordionTrigger>
                <template #icon><span class="mdi mdi-folder text-lg text-amber-400 shrink-0"></span></template>
                Project Files
              </SAccordionTrigger>
              <SAccordionContent>
                <SAccordion v-model="nestedChildValue" type="card" class="mt-2">
                  <SAccordionItem name="child-1">
                    <SAccordionTrigger>
                      <template #icon><span class="mdi mdi-file-document text-lg text-muted-foreground shrink-0"></span></template>
                      README.md
                    </SAccordionTrigger>
                    <SAccordionContent>Documentation for the project.</SAccordionContent>
                  </SAccordionItem>
                  <SAccordionItem name="child-2">
                    <SAccordionTrigger>
                      <template #icon><span class="mdi mdi-file-code text-lg text-muted-foreground shrink-0"></span></template>
                      package.json
                    </SAccordionTrigger>
                    <SAccordionContent>Project dependencies and scripts.</SAccordionContent>
                  </SAccordionItem>
                  <SAccordionItem name="child-3">
                    <SAccordionTrigger>
                      <template #icon><span class="mdi mdi-folder-open text-lg text-muted-foreground shrink-0"></span></template>
                      src/
                    </SAccordionTrigger>
                    <SAccordionContent>Source code directory.</SAccordionContent>
                  </SAccordionItem>
                </SAccordion>
              </SAccordionContent>
            </SAccordionItem>
            <SAccordionItem name="parent-2">
              <SAccordionTrigger>
                <template #icon><span class="mdi mdi-cog text-lg text-muted-foreground shrink-0"></span></template>
                Configuration
              </SAccordionTrigger>
              <SAccordionContent>
                <p class="mb-3">Configure project settings:</p>
                <ul class="list-disc list-inside space-y-1 text-sm">
                  <li>Build configuration</li>
                  <li>Environment variables</li>
                  <li>Plugin settings</li>
                </ul>
              </SAccordionContent>
            </SAccordionItem>
          </SAccordion>
        </div>
      </DemoSection>
    </section>

    <!-- Custom Colors -->
    <section id="custom-colors">
      <h2 class="text-2xl font-bold text-foreground mb-6">Custom Colors</h2>
      <DemoSection
        title="Accent Color Customization"
        description="Change the accent color for headers and icons."
        :code="`<SAccordion color='#ec4899'>...</SAccordion>`"
        language="vue"
      >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SAccordion v-model="colorValue" type="card" color="#3b82f6">
            <SAccordionItem name="item-1">
              <SAccordionTrigger>
                <template #icon><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500 shrink-0"><path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></template>
                Blue Theme
              </SAccordionTrigger>
              <SAccordionContent>Content with blue accent.</SAccordionContent>
            </SAccordionItem>
          </SAccordion>
          <SAccordion v-model="colorValue" type="card" color="#ec4899">
            <SAccordionItem name="item-1">
              <SAccordionTrigger>
                <template #icon><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-pink-500 shrink-0"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg></template>
                Pink Theme
              </SAccordionTrigger>
              <SAccordionContent>Content with pink accent.</SAccordionContent>
            </SAccordionItem>
          </SAccordion>
          <SAccordion v-model="colorValue" type="card" color="#f59e0b">
            <SAccordionItem name="item-1">
              <SAccordionTrigger>
                <template #icon><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-500 shrink-0"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></template>
                Amber Theme
              </SAccordionTrigger>
              <SAccordionContent>Content with amber accent.</SAccordionContent>
            </SAccordionItem>
          </SAccordion>
        </div>
      </DemoSection>
    </section>

    <!-- FAQ Example -->
    <section id="real-world-example">
      <h2 class="text-2xl font-bold text-foreground mb-6">Real-World Example</h2>
      <DemoSection
        title="FAQ Section"
        description="A practical FAQ implementation with the compound accordion API."
        :code="`<SAccordion type='separated' collapsible>...</SAccordion>`"
        language="vue"
      >
        <div class="max-w-2xl">
          <div class="mb-6">
            <h3 class="text-xl font-semibold text-foreground mb-2">Frequently Asked Questions</h3>
            <p class="text-muted-foreground">Find answers to common questions below.</p>
          </div>
          <SAccordion v-model="faqValue" type="separated" collapsible>
            <SAccordionItem name="faq-1">
              <SAccordionTrigger>How do I reset my password?</SAccordionTrigger>
              <SAccordionContent>
                <p>To reset your password, click the "Forgot Password" link on the login page. Enter your email address, and we'll send you a password reset link. The link expires in 24 hours for security.</p>
              </SAccordionContent>
            </SAccordionItem>
            <SAccordionItem name="faq-2">
              <SAccordionTrigger>What payment methods do you accept?</SAccordionTrigger>
              <SAccordionContent>
                <p class="mb-2">We accept the following payment methods:</p>
                <ul class="list-disc list-inside space-y-1 text-sm">
                  <li>Visa, Mastercard, American Express</li>
                  <li>PayPal</li>
                  <li>Apple Pay and Google Pay</li>
                  <li>Bank transfers (for enterprise plans)</li>
                </ul>
              </SAccordionContent>
            </SAccordionItem>
            <SAccordionItem name="faq-3">
              <SAccordionTrigger>Can I cancel my subscription anytime?</SAccordionTrigger>
              <SAccordionContent>
                <p>Yes! You can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period.</p>
              </SAccordionContent>
            </SAccordionItem>
            <SAccordionItem name="faq-4">
              <SAccordionTrigger>Do you offer a free trial?</SAccordionTrigger>
              <SAccordionContent>
                <p>Absolutely! We offer a 14-day free trial for all new users. No credit card required to start.</p>
              </SAccordionContent>
            </SAccordionItem>
          </SAccordion>
        </div>
      </DemoSection>
    </section>

    <!-- Simple API (legacy) -->
    <section id="simple-api">
      <h2 class="text-2xl font-bold text-foreground mb-6">Simple API</h2>
      <DemoSection
        title="Title Prop Shorthand"
        description="For quick use, pass title, subtitle, and icon props directly to SAccordionItem instead of using subcomponents."
        :code="simpleApiCode"
        language="vue"
      >
        <div class="max-w-xl">
          <SAccordion v-model="simpleValue" type="separated" color="#8b5cf6">
            <SAccordionItem name="item-1" :icon="ri('cog')" title="Settings" subtitle="Configure your preferences">
              Customize your application settings, notifications, and more.
            </SAccordionItem>
            <SAccordionItem name="item-2" :icon="ri('account-group')" title="Team Members" subtitle="Manage your team">
              Add, remove, or modify team member permissions and roles.
            </SAccordionItem>
            <SAccordionItem name="item-3" :icon="ri('shield-lock')" title="Security" subtitle="Keep your account safe">
              Enable two-factor authentication, manage sessions, and security keys.
            </SAccordionItem>
          </SAccordion>
        </div>
      </DemoSection>
    </section>

    <!-- API Reference -->
    <h2 class="text-2xl font-bold text-foreground mb-6">API Reference</h2>
    <SApiSection>
      <div class="space-y-8">
        <div>
          <h3 class="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <span class="mdi mdi-view-sequential text-primary" />
            SAccordion
          </h3>
          <SApiTable title="Props" type="props" :props="accordionProps" />
          <SApiTable title="Events" type="events" :events="accordionEvents" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <span class="mdi mdi-format-list-bulleted text-primary" />
            SAccordionItem
          </h3>
          <SApiTable title="Props" type="props" :props="accordionItemProps" />
          <SApiTable title="Slots" type="slots" :slots="accordionItemSlots" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <span class="mdi mdi-chevron-down text-primary" />
            SAccordionTrigger
          </h3>
          <SApiTable title="Props" type="props" :props="triggerProps" />
          <SApiTable title="Slots" type="slots" :slots="triggerSlots" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <span class="mdi mdi-text-box-outline text-primary" />
            SAccordionContent
          </h3>
          <SApiTable title="Props" type="props" :props="contentProps" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <span class="mdi mdi-keyboard-outline text-primary" />
            Keyboard Navigation
          </h3>
          <SApiKeyboard :shortcuts="keyboardShortcuts" variant="table" />
        </div>
      </div>
    </SApiSection>
  </div>
</template>
