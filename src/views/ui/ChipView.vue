<script setup lang="ts">
import { ref } from 'vue'
import { SChip, SApiSection, SApiTable } from '../../index'
import type { ApiProp, ApiEvent, ApiSlot } from '../../index'
import DemoSection from '../../components/DemoSection.vue'

// State for interactive demos
const frameworks = ref(['React', 'Vue.js', 'Angular', 'Svelte', 'Next.js'])
const selectedTags = ref([
  { name: 'Design', color: '#ec4899' },
  { name: 'Development', color: '#3b82f6' },
  { name: 'UX', color: '#10b981' }
])

const handleRemoveFramework = (index: number) => {
  frameworks.value.splice(index, 1)
}

const handleRemoveTag = (index: number) => {
  selectedTags.value.splice(index, 1)
}

const handleChipClick = (label: string) => {
  console.log('Chip clicked:', label)
}

// Code snippets for demos
const basicUsageCode = `<SChip>Basic Chip</SChip>
<SChip color="#3b82f6">Custom Color</SChip>
<SChip color="#ec4899">Pink Chip</SChip>
<SChip color="#f59e0b">Orange Chip</SChip>`

const variantsCode = `<SChip variant="filled" color="#10b981">Filled</SChip>
<SChip variant="outlined" color="#10b981">Outlined</SChip>
<SChip variant="light" color="#10b981">Light</SChip>`

const sizesCode = `<SChip size="small" color="#8b5cf6">Small</SChip>
<SChip size="medium" color="#8b5cf6">Medium</SChip>
<SChip size="large" color="#8b5cf6">Large</SChip>`

const closableCode = `<SChip 
  v-for="(framework, index) in frameworks" 
  :key="framework"
  closable 
  color="#3b82f6"
  @close="handleRemoveFramework(index)"
>
  {{ framework }}
</SChip>`

const disabledCode = `<SChip disabled color="#6366f1">Disabled Filled</SChip>
<SChip disabled variant="outlined" color="#6366f1">Disabled Outlined</SChip>
<SChip disabled variant="light" color="#6366f1">Disabled Light</SChip>`

const clickableCode = `<SChip 
  color="#ec4899" 
  @click="handleChipClick('Design')"
>
  Design
</SChip>
<SChip 
  color="#f59e0b" 
  @click="handleChipClick('Development')"
>
  Development
</SChip>
<SChip 
  color="#8b5cf6" 
  @click="handleChipClick('Marketing')"
>
  Marketing
</SChip>`

const combinedCode = `<SChip 
  v-for="(tag, index) in selectedTags" 
  :key="tag.name"
  variant="light"
  closable
  size="medium"
  :color="tag.color"
  @close="handleRemoveTag(index)"
  @click="handleChipClick(tag.name)"
>
  {{ tag.name }}
</SChip>`

const iconsCode = `<SChip color="#3b82f6">
  <span class="mdi mdi-home mr-1"></span>
  Home
</SChip>
<SChip color="#10b981" variant="outlined">
  <span class="mdi mdi-account mr-1"></span>
  Profile
</SChip>
<SChip color="#f59e0b" variant="light">
  <span class="mdi mdi-cog mr-1"></span>
  Settings
</SChip>
<SChip color="#ec4899">
  Notifications
  <span class="mdi mdi-bell ml-1"></span>
</SChip>`

// API Reference data
const chipProps: ApiProp[] = [
  { name: 'variant', type: "'filled' | 'outlined' | 'light'", default: "'filled'", description: 'Visual style variant', category: 'Appearance' },
  { name: 'size', type: "'small' | 'medium' | 'large'", default: "'medium'", description: 'Chip size', category: 'Appearance' },
  { name: 'color', type: 'string', default: "'#63e2b7'", description: 'Chip color (any valid CSS color)', category: 'Appearance' },
  { name: 'closable', type: 'boolean', default: 'false', description: 'Show close button', category: 'Behavior' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable interaction', category: 'Behavior' },
]

const chipEvents: ApiEvent[] = [
  { name: '@close', payload: '-', description: 'Emitted when close button is clicked' },
  { name: '@click', payload: '-', description: 'Emitted when chip is clicked' },
]

const chipSlots: ApiSlot[] = [
  { name: 'default', props: '-', description: 'Chip content (text, icons, or custom elements)' },
]
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-(--s-text-primary) mb-2">Chips</h1>
      <p class="text-lg text-(--s-text-secondary)">Compact elements that represent an input, attribute, or action.</p>
    </header>

    <!-- Features -->
    <article>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-palette-outline text-xl text-emerald-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Three Variants</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Filled, outlined, and light variants with custom color support.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-close-circle text-xl text-blue-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Closable</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Add a close button for removable tags and filters.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-cursor-default-click text-xl text-purple-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Clickable</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Handle click events for interactive chip actions.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-resize text-xl text-amber-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Three Sizes</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Small, medium, and large sizes for different contexts.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-shape text-xl text-red-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Icon Support</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Add icons before or after chip text using the default slot.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-format-color-fill text-xl text-cyan-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Custom Colors</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Any valid CSS color value for fully customized styling.</p>
        </div>
      </div>
    </article>

    <!-- Basic Usage -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Basic Usage</h2>
      <DemoSection 
        title="Basic Chips"
        description="Chips display compact information and can be customized with different colors."
        :code="basicUsageCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-3 items-center">
          <SChip>Basic Chip</SChip>
          <SChip color="#3b82f6">Custom Color</SChip>
          <SChip color="#ec4899">Pink Chip</SChip>
          <SChip color="#f59e0b">Orange Chip</SChip>
        </div>
      </DemoSection>
    </section>

    <!-- Icons -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">With Icons</h2>
      <DemoSection 
        title="Chips with Icons"
        description="Add MDI icons before or after chip text using the default slot."
        :code="iconsCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-3 items-center">
          <SChip color="#3b82f6">
            <span class="mdi mdi-home mr-1"></span>
            Home
          </SChip>
          <SChip color="#10b981" variant="outlined">
            <span class="mdi mdi-account mr-1"></span>
            Profile
          </SChip>
          <SChip color="#f59e0b" variant="light">
            <span class="mdi mdi-cog mr-1"></span>
            Settings
          </SChip>
          <SChip color="#ec4899">
            Notifications
            <span class="mdi mdi-bell ml-1"></span>
          </SChip>
        </div>
      </DemoSection>
    </section>

    <!-- Variants -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Variants</h2>
      <DemoSection 
        title="Chip Variants"
        description="Three variants available: filled (default), outlined, and light."
        :code="variantsCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-4 items-center">
          <div class="flex flex-col items-center gap-2">
            <SChip variant="filled" color="#10b981">Filled</SChip>
            <span class="text-xs font-mono text-(--s-text-secondary)">filled</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SChip variant="outlined" color="#10b981">Outlined</SChip>
            <span class="text-xs font-mono text-(--s-text-secondary)">outlined</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SChip variant="light" color="#10b981">Light</SChip>
            <span class="text-xs font-mono text-(--s-text-secondary)">light</span>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Sizes -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Sizes</h2>
      <DemoSection 
        title="Chip Sizes"
        description="Three size options: small, medium (default), and large."
        :code="sizesCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-4 items-center">
          <div class="flex flex-col items-center gap-2">
            <SChip size="small" color="#8b5cf6">Small</SChip>
            <span class="text-xs font-mono text-(--s-text-secondary)">small</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SChip size="medium" color="#8b5cf6">Medium</SChip>
            <span class="text-xs font-mono text-(--s-text-secondary)">medium</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SChip size="large" color="#8b5cf6">Large</SChip>
            <span class="text-xs font-mono text-(--s-text-secondary)">large</span>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Closable -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Closable Chips</h2>
      <DemoSection 
        title="Closable"
        description="Add a close button by setting the closable prop. Click the X to remove chips."
        :code="closableCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-3 items-center">
          <SChip 
            v-for="(framework, index) in frameworks" 
            :key="framework"
            closable 
            color="#3b82f6"
            @close="handleRemoveFramework(index)"
          >
            {{ framework }}
          </SChip>
        </div>
        <p v-if="frameworks.length === 0" class="p-4 text-center text-(--s-text-secondary) rounded-xl mt-4 border border-dashed border-(--s-border)">
          All chips removed! Refresh to reset.
        </p>
      </DemoSection>
    </section>

    <!-- Disabled -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Disabled State</h2>
      <DemoSection 
        title="Disabled Chips"
        description="Disabled chips have reduced opacity and cannot be interacted with."
        :code="disabledCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-3 items-center">
          <SChip disabled color="#6366f1">Disabled Filled</SChip>
          <SChip disabled variant="outlined" color="#6366f1">Disabled Outlined</SChip>
          <SChip disabled variant="light" color="#6366f1">Disabled Light</SChip>
        </div>
      </DemoSection>
    </section>

    <!-- Clickable -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Clickable Chips</h2>
      <DemoSection 
        title="Click Events"
        description="Chips can handle click events. Open the console to see click events."
        :code="clickableCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-3 items-center">
          <SChip 
            color="#ec4899" 
            @click="handleChipClick('Design')"
          >
            Design
          </SChip>
          <SChip 
            color="#f59e0b" 
            @click="handleChipClick('Development')"
          >
            Development
          </SChip>
          <SChip 
            color="#8b5cf6" 
            @click="handleChipClick('Marketing')"
          >
            Marketing
          </SChip>
        </div>
      </DemoSection>
    </section>

    <!-- Combined Features -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Combined Features</h2>
      <DemoSection 
        title="Interactive Tags"
        description="Combine multiple features: light variant, closable, clickable with custom colors."
        :code="combinedCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-3 items-center">
          <SChip 
            v-for="(tag, index) in selectedTags" 
            :key="tag.name"
            variant="light"
            closable
            size="medium"
            :color="tag.color"
            @close="handleRemoveTag(index)"
            @click="handleChipClick(tag.name)"
          >
            {{ tag.name }}
          </SChip>
        </div>
        <p v-if="selectedTags.length === 0" class="p-4 text-center text-(--s-text-secondary) rounded-xl mt-4 border border-dashed border-(--s-border)">
          All tags removed! Refresh to reset.
        </p>
      </DemoSection>
    </section>

    <!-- Real-World Examples -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Real-World Examples</h2>
      <DemoSection 
        title="Filter Tags"
        description="Using chips as filter tags in a search interface."
        :code="combinedCode"
        language="vue"
      >
        <div class="space-y-4">
          <p class="text-sm text-(--s-text-secondary)">Active Filters:</p>
          <div class="flex flex-wrap gap-2">
            <SChip color="#3b82f6" variant="light" closable size="small">Category: Electronics</SChip>
            <SChip color="#10b981" variant="light" closable size="small">Price: $50-$200</SChip>
            <SChip color="#f59e0b" variant="light" closable size="small">Rating: 4+ Stars</SChip>
            <SChip color="#8b5cf6" variant="light" closable size="small">In Stock</SChip>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- API Reference -->
    <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">API Reference</h2>
    <SApiSection>
      <SApiTable title="Props" type="props" :props="chipProps" />
      <SApiTable title="Events" type="events" :events="chipEvents" />
      <SApiTable title="Slots" type="slots" :slots="chipSlots" />
    </SApiSection>
  </div>
</template>
