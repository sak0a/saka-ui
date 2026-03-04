<script setup lang="ts">
import { ref } from 'vue'
import { SAccordion, SAccordionItem, SApiSection, SApiTable, SApiKeyboard } from '../../index'
import type { ApiProp, ApiEvent, ApiSlot, KeyboardShortcut } from '../../index'
import DemoSection from '../../components/DemoSection.vue'

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

// Custom expand icons
const customExpandValue = ref('item-1')

// Dense mode
const denseValue = ref('item-1')

// Code snippets
const basicCode = `<script setup>
import { ref } from 'vue'
const expanded = ref('item-1')
<\/script>

<template>
  <SAccordion v-model="expanded">
    <SAccordionItem name="item-1" title="First Section">
      Content for the first section.
    </SAccordionItem>
    <SAccordionItem name="item-2" title="Second Section">
      Content for the second section.
    </SAccordionItem>
  </SAccordion>
</template>`

const multipleCode = `<SAccordion v-model="expanded" multiple>
  <SAccordionItem name="item-1" title="First Section">...</SAccordionItem>
  <SAccordionItem name="item-2" title="Second Section">...</SAccordionItem>
</SAccordion>`

const variantsCode = `<!-- Default -->
<SAccordion type="default">...items...</SAccordion>

<!-- Bordered -->
<SAccordion type="bordered">...items...</SAccordion>

<!-- Separated -->
<SAccordion type="separated">...items...</SAccordion>

<!-- Card -->
<SAccordion type="card">...items...</SAccordion>

<!-- Minimal -->
<SAccordion type="minimal">...items...</SAccordion>`

const sizesCode = `<SAccordion size="small">...</SAccordion>
<SAccordion size="medium">...</SAccordion>
<SAccordion size="large">...</SAccordion>`

const iconCode = `<SAccordion icon-placement="left">
  <SAccordionItem name="settings" icon="cog" title="Settings" />
  <SAccordionItem name="users" icon="account-group" title="Users" />
</SAccordion>`

const nestedCode = `<SAccordion v-model="parent">
  <SAccordionItem name="parent-1" title="Parent">
    <SAccordion v-model="child" type="card">
      <SAccordionItem name="child-1" title="Nested Item 1">
        Nested content
      </SAccordionItem>
    </SAccordion>
  </SAccordionItem>
</SAccordion>`

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
  { name: 'title', type: 'string', default: 'undefined', description: 'Header title text', category: 'Content' },
  { name: 'subtitle', type: 'string', default: 'undefined', description: 'Secondary text', category: 'Content' },
  { name: 'icon', type: 'string', default: 'undefined', description: 'MDI icon name', category: 'Content' },
  { name: 'expandIcon', type: 'string', default: "'chevron-down'", description: 'Custom expand icon (MDI name)', category: 'Content' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable this item', category: 'States' },
  { name: 'lazy', type: 'boolean', default: 'false', description: 'Lazy render content', category: 'States' }
]

const accordionItemSlots: ApiSlot[] = [
  { name: 'default', description: 'Accordion panel content' },
  { name: '#header', props: '{ expanded, toggle, disabled }', description: 'Custom header content replacing the default header' },
  { name: '#title', description: 'Custom title content' },
  { name: '#subtitle', description: 'Custom subtitle content' },
  { name: '#icon', props: '{ expanded }', description: 'Custom expand/collapse icon' },
  { name: '#extra', description: 'Extra content in header area' }
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
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-(--s-text-primary) mb-2">Accordion</h1>
      <p class="text-lg text-(--s-text-secondary)">A stunning, customizable accordion component for expandable content sections.</p>
    </header>

    <!-- Features -->
    <article>
      <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4">Features</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 rounded-xl bg-(--s-bg-secondary) border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-view-sequential text-xl text-emerald-400"></span>
            <span class="font-semibold text-(--s-text-primary)">Multiple Variants</span>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Five visual styles: default, bordered, separated, card, and minimal.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary) border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-checkbox-multiple-marked text-xl text-blue-400"></span>
            <span class="font-semibold text-(--s-text-primary)">Single & Multiple</span>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Toggle between single or multiple items open at once.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary) border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-animation text-xl text-violet-400"></span>
            <span class="font-semibold text-(--s-text-primary)">Smooth Animations</span>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Hardware-accelerated expand/collapse animations.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary) border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-folder-multiple text-xl text-amber-400"></span>
            <span class="font-semibold text-(--s-text-primary)">Nested Support</span>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Full support for accordion inside accordion structures.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary) border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-keyboard text-xl text-pink-400"></span>
            <span class="font-semibold text-(--s-text-primary)">Keyboard Navigation</span>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Full keyboard support with Tab, Enter, and Space.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary) border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-palette text-xl text-cyan-400"></span>
            <span class="font-semibold text-(--s-text-primary)">Custom Colors</span>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Customize accent colors for headers and icons.</p>
        </div>
      </div>
    </article>

    <!-- Basic Usage -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Basic Usage</h2>
      <DemoSection 
        title="Simple Accordion"
        description="Click headers to expand and collapse sections. Only one item can be open at a time by default."
        :code="basicCode"
        language="vue"
      >
        <div class="max-w-2xl">
          <SAccordion v-model="basicValue" type="bordered">
            <SAccordionItem name="item-1" title="What is Vue.js?">
              Vue.js is a progressive JavaScript framework for building user interfaces. It was created by Evan You and is designed to be incrementally adoptable.
            </SAccordionItem>
            <SAccordionItem name="item-2" title="Why choose Vue?">
              Vue offers a gentle learning curve, excellent documentation, and a flexible architecture that scales from small widgets to enterprise applications.
            </SAccordionItem>
            <SAccordionItem name="item-3" title="How do I get started?">
              You can start by including Vue via CDN, using the Vue CLI, or scaffolding with Vite. Check the official documentation at vuejs.org.
            </SAccordionItem>
          </SAccordion>
          <p class="text-sm text-(--s-text-secondary) mt-4">
            Currently expanded: <code class="font-mono text-emerald-400">{{ basicValue || 'none' }}</code>
          </p>
        </div>
      </DemoSection>
    </section>

    <!-- Multiple Expansion -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Multiple Expansion</h2>
      <DemoSection 
        title="Allow Multiple Open Items"
        description="Enable multiple mode to allow several sections open simultaneously."
        :code="multipleCode"
        language="vue"
      >
        <div class="max-w-2xl">
          <SAccordion v-model="multipleValue" type="bordered" multiple>
            <SAccordionItem name="item-1" title="Features" icon="star">
              Multiple items can be expanded at the same time. Click multiple headers to open them all.
            </SAccordionItem>
            <SAccordionItem name="item-2" title="Performance" icon="speedometer">
              Lazy loading available for heavy content. Animations are optimized with hardware acceleration.
            </SAccordionItem>
            <SAccordionItem name="item-3" title="Customization" icon="palette">
              Full control over styles, icons, colors, and content via props and slots.
            </SAccordionItem>
          </SAccordion>
          <p class="text-sm text-(--s-text-secondary) mt-4">
            Expanded items: <code class="font-mono text-emerald-400">{{ multipleValue.length > 0 ? multipleValue.join(', ') : 'none' }}</code>
          </p>
        </div>
      </DemoSection>
    </section>

    <!-- Variants -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Variants</h2>
      <DemoSection 
        title="Visual Style Variants"
        description="Five distinct visual styles for different design contexts."
        :code="variantsCode"
        language="vue"
      >
        <div class="space-y-8">
          <!-- Default -->
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3 font-medium">Default</p>
            <div class="max-w-xl">
              <SAccordion v-model="variantDefault" type="default">
                <SAccordionItem name="item-1" title="Default Style">
                  Clean, minimal appearance with subtle hover effects.
                </SAccordionItem>
                <SAccordionItem name="item-2" title="Another Section">
                  Works great for simple use cases.
                </SAccordionItem>
              </SAccordion>
            </div>
          </div>

          <!-- Bordered -->
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3 font-medium">Bordered</p>
            <div class="max-w-xl">
              <SAccordion v-model="variantBordered" type="bordered">
                <SAccordionItem name="item-1" title="Bordered Style">
                  Items contained within a bordered container.
                </SAccordionItem>
                <SAccordionItem name="item-2" title="Another Section">
                  Great for grouping related content.
                </SAccordionItem>
              </SAccordion>
            </div>
          </div>

          <!-- Separated -->
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3 font-medium">Separated</p>
            <div class="max-w-xl">
              <SAccordion v-model="variantSeparated" type="separated">
                <SAccordionItem name="item-1" title="Separated Style">
                  Each item is visually separate with its own border.
                </SAccordionItem>
                <SAccordionItem name="item-2" title="Another Section">
                  Adds visual distinction between sections.
                </SAccordionItem>
              </SAccordion>
            </div>
          </div>

          <!-- Card -->
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3 font-medium">Card</p>
            <div class="max-w-xl">
              <SAccordion v-model="variantCard" type="card">
                <SAccordionItem name="item-1" title="Card Style">
                  Elevated cards with shadows for premium feel.
                </SAccordionItem>
                <SAccordionItem name="item-2" title="Another Section">
                  Perfect for important content sections.
                </SAccordionItem>
              </SAccordion>
            </div>
          </div>

          <!-- Minimal -->
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3 font-medium">Minimal</p>
            <div class="max-w-xl">
              <SAccordion v-model="variantMinimal" type="minimal">
                <SAccordionItem name="item-1" title="Minimal Style">
                  Ultra-clean with no containers or dividers.
                </SAccordionItem>
                <SAccordionItem name="item-2" title="Another Section">
                  Headers highlight on hover.
                </SAccordionItem>
              </SAccordion>
            </div>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Sizes -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Sizes</h2>
      <DemoSection 
        title="Size Variants"
        description="Three size options for different contexts."
        :code="sizesCode"
        language="vue"
      >
        <div class="space-y-6">
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Small</p>
            <div class="max-w-md">
              <SAccordion v-model="sizeValue" type="bordered" size="small">
                <SAccordionItem name="item-1" title="Small Size">
                  Compact accordion for tight spaces.
                </SAccordionItem>
              </SAccordion>
            </div>
          </div>
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Medium (default)</p>
            <div class="max-w-md">
              <SAccordion v-model="sizeValue" type="bordered" size="medium">
                <SAccordionItem name="item-1" title="Medium Size">
                  Standard size for most use cases.
                </SAccordionItem>
              </SAccordion>
            </div>
          </div>
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Large</p>
            <div class="max-w-md">
              <SAccordion v-model="sizeValue" type="bordered" size="large">
                <SAccordionItem name="item-1" title="Large Size">
                  Larger padding for emphasis.
                </SAccordionItem>
              </SAccordion>
            </div>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Dense Mode -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Dense Mode</h2>
      <DemoSection 
        title="Compact Layout"
        description="Use dense mode for a more compact accordion with reduced padding."
        :code="`<SAccordion dense>...</SAccordion>`"
        language="vue"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Normal</p>
            <SAccordion v-model="denseValue" type="card">
              <SAccordionItem name="item-1" title="Standard Padding">
                This accordion uses normal padding.
              </SAccordionItem>
              <SAccordionItem name="item-2" title="More Space">
                Standard space for better readability.
              </SAccordionItem>
            </SAccordion>
          </div>
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Dense</p>
            <SAccordion v-model="denseValue" type="card" dense>
              <SAccordionItem name="item-1" title="Compact Padding">
                This accordion uses dense mode with reduced padding.
              </SAccordionItem>
              <SAccordionItem name="item-2" title="Less Space">
                Great for sidebars, menus, or information-dense UIs.
              </SAccordionItem>
            </SAccordion>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Icon Placement -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Icon Placement</h2>
      <DemoSection 
        title="Expand Icon Position"
        description="Place the expand chevron on the left or right side."
        :code="iconCode"
        language="vue"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Right (default)</p>
            <SAccordion v-model="iconLeftValue" type="card" icon-placement="right">
              <SAccordionItem name="item-1" icon="cog" title="Settings">
                Settings content here.
              </SAccordionItem>
              <SAccordionItem name="item-2" icon="account" title="Profile">
                Profile content here.
              </SAccordionItem>
            </SAccordion>
          </div>
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Left</p>
            <SAccordion v-model="iconLeftValue" type="card" icon-placement="left">
              <SAccordionItem name="item-1" icon="cog" title="Settings">
                Settings content here.
              </SAccordionItem>
              <SAccordionItem name="item-2" icon="account" title="Profile">
                Profile content here.
              </SAccordionItem>
            </SAccordion>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Custom Expand Icons -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Custom Expand Icons</h2>
      <DemoSection 
        title="Replace the Default Chevron"
        description="Use the expandIcon prop to replace the default arrow with any MDI icon."
        :code="`<SAccordionItem expandIcon='plus' title='With Plus Icon' />`"
        language="vue"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Plus/Minus Icons</p>
            <SAccordion v-model="customExpandValue" type="card">
              <SAccordionItem name="item-1" expand-icon="plus" title="Click to Expand">
                This item uses a plus icon instead of the default chevron.
              </SAccordionItem>
              <SAccordionItem name="item-2" expand-icon="plus" title="Another Section">
                The icon rotates 180° when expanded, showing as a minus-like cross.
              </SAccordionItem>
            </SAccordion>
          </div>
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Arrow Icons</p>
            <SAccordion v-model="customExpandValue" type="card">
              <SAccordionItem name="item-1" expand-icon="arrow-down-circle" title="Circle Arrow">
                Using arrow-down-circle icon.
              </SAccordionItem>
              <SAccordionItem name="item-2" expand-icon="menu-down" title="Menu Arrow">
                Using menu-down icon.
              </SAccordionItem>
            </SAccordion>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Custom Icons -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Custom Icons</h2>
      <DemoSection 
        title="Header Icons"
        description="Add MDI icons to accordion headers for visual context."
        :code="iconCode"
        language="vue"
      >
        <div class="max-w-xl">
          <SAccordion v-model="iconValue" type="separated" color="#8b5cf6">
            <SAccordionItem name="settings" icon="cog" title="Settings" subtitle="Configure your preferences">
              Customize your application settings, notifications, and more.
            </SAccordionItem>
            <SAccordionItem name="users" icon="account-group" title="Team Members" subtitle="Manage your team">
              Add, remove, or modify team member permissions and roles.
            </SAccordionItem>
            <SAccordionItem name="security" icon="shield-lock" title="Security" subtitle="Keep your account safe">
              Enable two-factor authentication, manage sessions, and security keys.
            </SAccordionItem>
            <SAccordionItem name="billing" icon="credit-card" title="Billing" subtitle="Payment and invoices">
              View invoices, update payment methods, and manage subscriptions.
            </SAccordionItem>
          </SAccordion>
        </div>
      </DemoSection>
    </section>

    <!-- Disabled Items -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Disabled Items</h2>
      <DemoSection 
        title="Disabled State"
        description="Individual items can be disabled to prevent interaction."
        :code="`<SAccordionItem name='item' disabled title='Disabled' />`"
        language="vue"
      >
        <div class="max-w-xl">
          <SAccordion v-model="disabledValue" type="bordered">
            <SAccordionItem name="item-1" title="Available Section">
              This section is fully interactive.
            </SAccordionItem>
            <SAccordionItem name="item-2" title="Disabled Section" disabled>
              You cannot expand this section.
            </SAccordionItem>
            <SAccordionItem name="item-3" title="Another Available Section">
              This one works too!
            </SAccordionItem>
          </SAccordion>
        </div>
      </DemoSection>
    </section>

    <!-- Nested -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Nested Accordions</h2>
      <DemoSection 
        title="Accordions Inside Accordions"
        description="Full support for nested accordion structures."
        :code="nestedCode"
        language="vue"
      >
        <div class="max-w-xl">
          <SAccordion v-model="nestedValue" type="bordered">
            <SAccordionItem name="parent-1" icon="folder" title="Project Files">
              <SAccordion v-model="nestedChildValue" type="card" class="mt-2">
                <SAccordionItem name="child-1" icon="file-document" title="README.md">
                  Documentation for the project.
                </SAccordionItem>
                <SAccordionItem name="child-2" icon="file-code" title="package.json">
                  Project dependencies and scripts.
                </SAccordionItem>
                <SAccordionItem name="child-3" icon="folder-open" title="src/">
                  Source code directory.
                </SAccordionItem>
              </SAccordion>
            </SAccordionItem>
            <SAccordionItem name="parent-2" icon="cog" title="Configuration">
              <p class="mb-3">Configure project settings:</p>
              <ul class="list-disc list-inside space-y-1 text-sm">
                <li>Build configuration</li>
                <li>Environment variables</li>
                <li>Plugin settings</li>
              </ul>
            </SAccordionItem>
          </SAccordion>
        </div>
      </DemoSection>
    </section>

    <!-- Custom Colors -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Custom Colors</h2>
      <DemoSection 
        title="Accent Color Customization"
        description="Change the accent color for headers and icons."
        :code="`<SAccordion color='#ec4899'>...</SAccordion>`"
        language="vue"
      >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SAccordion v-model="colorValue" type="card" color="#3b82f6">
            <SAccordionItem name="item-1" icon="water" title="Blue Theme">
              Content with blue accent.
            </SAccordionItem>
          </SAccordion>
          <SAccordion v-model="colorValue" type="card" color="#ec4899">
            <SAccordionItem name="item-1" icon="heart" title="Pink Theme">
              Content with pink accent.
            </SAccordionItem>
          </SAccordion>
          <SAccordion v-model="colorValue" type="card" color="#f59e0b">
            <SAccordionItem name="item-1" icon="star" title="Amber Theme">
              Content with amber accent.
            </SAccordionItem>
          </SAccordion>
        </div>
      </DemoSection>
    </section>

    <!-- FAQ Example -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Real-World Example</h2>
      <DemoSection 
        title="FAQ Section"
        description="A practical FAQ implementation with the accordion component."
        :code="`<SAccordion type='separated' collapsible>...</SAccordion>`"
        language="vue"
      >
        <div class="max-w-2xl">
          <div class="mb-6">
            <h3 class="text-xl font-semibold text-(--s-text-primary) mb-2">Frequently Asked Questions</h3>
            <p class="text-(--s-text-secondary)">Find answers to common questions below.</p>
          </div>
          <SAccordion v-model="faqValue" type="separated" collapsible>
            <SAccordionItem name="faq-1" title="How do I reset my password?">
              <p>To reset your password, click the "Forgot Password" link on the login page. Enter your email address, and we'll send you a password reset link. The link expires in 24 hours for security.</p>
            </SAccordionItem>
            <SAccordionItem name="faq-2" title="What payment methods do you accept?">
              <p class="mb-2">We accept the following payment methods:</p>
              <ul class="list-disc list-inside space-y-1 text-sm">
                <li>Visa, Mastercard, American Express</li>
                <li>PayPal</li>
                <li>Apple Pay and Google Pay</li>
                <li>Bank transfers (for enterprise plans)</li>
              </ul>
            </SAccordionItem>
            <SAccordionItem name="faq-3" title="Can I cancel my subscription anytime?">
              <p>Yes! You can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period. We don't offer refunds for partial months.</p>
            </SAccordionItem>
            <SAccordionItem name="faq-4" title="Do you offer a free trial?">
              <p>Absolutely! We offer a 14-day free trial for all new users. No credit card required to start. You'll have access to all premium features during the trial period.</p>
            </SAccordionItem>
            <SAccordionItem name="faq-5" title="How do I contact support?">
              <p>You can reach our support team through:</p>
              <div class="mt-2 space-y-2">
                <div class="flex items-center gap-2 text-sm">
                  <span class="mdi mdi-email text-(--s-primary)"></span>
                  support@example.com
                </div>
                <div class="flex items-center gap-2 text-sm">
                  <span class="mdi mdi-chat text-(--s-primary)"></span>
                  Live chat (bottom-right corner)
                </div>
              </div>
            </SAccordionItem>
          </SAccordion>
        </div>
      </DemoSection>
    </section>

    <!-- API Reference -->
    <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">API Reference</h2>
    <SApiSection>
      <SApiTable title="SAccordion Props" type="props" :props="accordionProps" />
      <SApiTable title="SAccordionItem Props" type="props" :props="accordionItemProps" />
      <SApiTable title="SAccordionItem Slots" type="slots" :slots="accordionItemSlots">
        <div class="mt-4 p-4 rounded-xl bg-(--s-bg-tertiary) border border-(--s-border)">
          <h4 class="text-sm font-semibold text-(--s-text-primary) mb-3">Header Slot Example</h4>
          <pre class="text-xs text-(--s-text-secondary) overflow-x-auto"><code>&lt;SAccordionItem name="custom"&gt;
  &lt;template #header="{ expanded, toggle, disabled }"&gt;
    &lt;div @click="toggle" class="custom-header"&gt;
      &lt;span&gt;My Custom Header&lt;/span&gt;
      &lt;span v-if="expanded"&gt;▲&lt;/span&gt;
      &lt;span v-else&gt;▼&lt;/span&gt;
    &lt;/div&gt;
  &lt;/template&gt;
  Content goes here...
&lt;/SAccordionItem&gt;</code></pre>
        </div>
      </SApiTable>
      <SApiTable title="SAccordion Events" type="events" :events="accordionEvents" />
      <SApiKeyboard :shortcuts="keyboardShortcuts" variant="table" />
    </SApiSection>
  </div>
</template>
