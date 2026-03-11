<script setup lang="ts">
import { ref, computed } from 'vue'
import { SPagination, SSelect, SSwitch, SApiSection, SApiTable, SApiKeyboard } from '../../index'
import type { ApiProp, ApiEvent, ApiSlot, KeyboardShortcut, PaginationVariant, PaginationSize, PaginationShape, SelectOption } from '../../index'
import DemoSection from '../../components/DemoSection.vue'

// Select options for interactive demo
const variantOptions: SelectOption[] = [
  { value: 'default', label: 'Default' },
  { value: 'outlined', label: 'Outlined' },
  { value: 'ghost', label: 'Ghost' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'dots', label: 'Dots' }
]

const sizeOptions: SelectOption[] = [
  { value: 'xs', label: 'Extra Small' },
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
  { value: 'xl', label: 'Extra Large' }
]

const shapeOptions: SelectOption[] = [
  { value: 'rounded', label: 'Rounded' },
  { value: 'square', label: 'Square' },
  { value: 'pill', label: 'Pill' }
]

// Demo state
const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = ref(200)
const isLoading = ref(false)

// Interactive demo
const interactiveVariant = ref<PaginationVariant>('default')
const interactiveSize = ref<PaginationSize>('medium')
const interactiveShape = ref<PaginationShape>('rounded')
const interactiveColor = ref('#059669')
const showFirstLast = ref(false)
const showTotal = ref(false)
const showQuickJump = ref(false)
const showProgress = ref(false)
const isSimple = ref(false)
const hasBackground = ref(false)

// Simulated data
const items = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return Array.from({ length: pageSize.value }, (_, i) => ({
    id: start + i + 1,
    name: `Item ${start + i + 1}`,
    status: ['Active', 'Pending', 'Complete'][Math.floor(Math.random() * 3)]
  }))
})

const simulateLoading = async () => {
  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 800))
  isLoading.value = false
}

const handlePageChange = async (_page: number) => {
  await simulateLoading()
}

// Code snippets
const basicCode = `<SPagination 
  v-model="currentPage" 
  :total="200" 
  :page-size="10" 
/>`

const variantsCode = `<!-- Default -->
<SPagination variant="default" :total="100" :model-value="3" />

<!-- Outlined -->
<SPagination variant="outlined" :total="100" :model-value="3" />

<!-- Ghost -->
<SPagination variant="ghost" :total="100" :model-value="3" />

<!-- Minimal -->
<SPagination variant="minimal" :total="100" :model-value="3" />

<!-- Dots -->
<SPagination variant="dots" :total="50" :page-size="10" :model-value="3" />`

const sizesCode = `<SPagination size="xs" :total="100" :model-value="3" />
<SPagination size="small" :total="100" :model-value="3" />
<SPagination size="medium" :total="100" :model-value="3" />
<SPagination size="large" :total="100" :model-value="3" />
<SPagination size="xl" :total="100" :model-value="3" />`

const shapesCode = `<SPagination shape="rounded" :total="100" :model-value="3" />
<SPagination shape="square" :total="100" :model-value="3" />
<SPagination shape="pill" :total="100" :model-value="3" />`

const colorsCode = `<SPagination color="#3b82f6" :total="100" :model-value="3" />
<SPagination color="#ec4899" :total="100" :model-value="3" />
<SPagination color="#f59e0b" :total="100" :model-value="3" />
<SPagination color="#8b5cf6" :total="100" :model-value="3" />`

const simpleCode = `<SPagination simple :total="100" :page-size="10" :model-value="5" />
<SPagination simple :total="100" :page-size="10" :model-value="5" color="#8b5cf6" variant="outlined" />`

const fullFeaturedCode = `<SPagination 
  v-model="currentPage" 
  :total="500"
  :page-size="20"
  show-first-last
  show-total
  show-quick-jump
  show-page-size
  :page-size-options="[10, 20, 50, 100]"
  show-progress
  background
/>`

const customTemplatesCode = `<!-- Custom prev/next buttons -->
<SPagination :total="100" :model-value="5">
  <template #prev>
    <span class="flex items-center gap-1.5">
      <span class="mdi mdi-arrow-left-bold"></span>
      Back
    </span>
  </template>
  <template #next>
    <span class="flex items-center gap-1.5">
      Forward
      <span class="mdi mdi-arrow-right-bold"></span>
    </span>
  </template>
</SPagination>

<!-- Custom total format -->
<SPagination
  :total="247"
  :page-size="10"
  :model-value="3"
  show-total
  :total-format="(total, range) => \`Showing \${range[0]} to \${range[1]} of \${total} entries\`"
/>

<!-- Custom ellipsis -->
<SPagination :total="200" :model-value="10">
  <template #ellipsis>
    <span class="text-(--s-text-tertiary) text-xs">...</span>
  </template>
</SPagination>`

const animationsCode = `<SPagination animation="scale" :total="100" color="#10b981" />
<SPagination animation="fade" :total="100" color="#3b82f6" />
<SPagination animation="slide" :total="100" color="#ec4899" />
<SPagination animation="flip" :total="100" color="#f59e0b" />`

const statesCode = `<SPagination :total="100" :model-value="3" loading />
<SPagination :total="100" :model-value="3" disabled />`

// API Reference data
const paginationProps: ApiProp[] = [
  // Core
  { name: 'modelValue', type: 'number', default: '1', description: 'Current page (v-model)', category: 'Core' },
  { name: 'total', type: 'number', default: 'required', description: 'Total number of items', category: 'Core' },
  { name: 'pageSize', type: 'number', default: '10', description: 'Items per page', category: 'Core' },
  { name: 'maxVisiblePages', type: 'number', default: '7', description: 'Maximum visible page buttons', category: 'Core' },
  // Appearance
  { name: 'variant', type: "'default' | 'outlined' | 'ghost' | 'minimal' | 'dots'", default: "'default'", description: 'Visual style variant', category: 'Appearance' },
  { name: 'size', type: "'xs' | 'small' | 'medium' | 'large' | 'xl'", default: "'medium'", description: 'Button size', category: 'Appearance' },
  { name: 'shape', type: "'rounded' | 'square' | 'pill'", default: "'rounded'", description: 'Button shape', category: 'Appearance' },
  { name: 'color', type: 'string', default: "'var(--s-primary)'", description: 'Primary color for active state', category: 'Appearance' },
  { name: 'background', type: 'boolean', default: 'false', description: 'Show background container', category: 'Appearance' },
  // Features
  { name: 'showFirstLast', type: 'boolean', default: 'false', description: 'Show first/last page buttons', category: 'Features' },
  { name: 'showPrevNext', type: 'boolean', default: 'true', description: 'Show prev/next buttons', category: 'Features' },
  { name: 'showTotal', type: 'boolean', default: 'false', description: 'Show total items info', category: 'Features' },
  { name: 'showQuickJump', type: 'boolean', default: 'false', description: 'Show quick jump input', category: 'Features' },
  { name: 'showPageSize', type: 'boolean', default: 'false', description: 'Show page size selector', category: 'Features' },
  { name: 'showProgress', type: 'boolean', default: 'false', description: 'Show progress bar', category: 'Features' },
  { name: 'pageSizeOptions', type: 'number[]', default: '[10, 20, 50, 100]', description: 'Page size options', category: 'Features' },
  // Modes
  { name: 'simple', type: 'boolean', default: 'false', description: 'Simple mode - only prev/next with page info', category: 'Modes' },
  { name: 'compact', type: 'boolean', default: 'false', description: 'Compact mode', category: 'Modes' },
  { name: 'hideSinglePage', type: 'boolean', default: 'false', description: 'Hide when only one page', category: 'Modes' },
  // State
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable all interactions', category: 'State' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Show loading state', category: 'State' },
  // Animation
  { name: 'animation', type: "'none' | 'slide' | 'fade' | 'scale' | 'flip'", default: "'scale'", description: 'Animation type for transitions', category: 'Animation' },
  // Custom text
  { name: 'prevText', type: 'string', default: 'undefined', description: 'Custom previous button text', category: 'Custom Text' },
  { name: 'nextText', type: 'string', default: 'undefined', description: 'Custom next button text', category: 'Custom Text' },
  { name: 'firstText', type: 'string', default: 'undefined', description: 'Custom first button text', category: 'Custom Text' },
  { name: 'lastText', type: 'string', default: 'undefined', description: 'Custom last button text', category: 'Custom Text' },
  // Accessibility
  { name: 'keyboard', type: 'boolean', default: 'true', description: 'Enable keyboard navigation', category: 'Accessibility' },
  { name: 'totalFormat', type: '(total, range) => string', default: 'undefined', description: 'Custom format for total text', category: 'Custom Text' }
]

const paginationEvents: ApiEvent[] = [
  { name: '@update:modelValue', payload: 'number', description: 'Emitted when page changes (v-model)' },
  { name: '@change', payload: 'number', description: 'Emitted when page changes' },
  { name: '@update:pageSize', payload: 'number', description: 'Emitted when page size changes' },
  { name: '@pageSizeChange', payload: 'number', description: 'Emitted when page size changes' }
]

const paginationSlots: ApiSlot[] = [
  { name: 'prev', description: 'Custom previous button content' },
  { name: 'next', description: 'Custom next button content' },
  { name: 'first', description: 'Custom first button content' },
  { name: 'last', description: 'Custom last button content' },
  { name: 'page', description: 'Custom page button content. Slot props: { page, active }' },
  { name: 'ellipsis', description: 'Custom ellipsis content' },
  { name: 'total', description: 'Custom total display. Slot props: { total, range }' },
  { name: 'pageSize', description: 'Custom page size selector. Slot props: { size, options, change }' },
  { name: 'quickJump', description: 'Custom quick jump input. Slot props: { value, jump }' },
  { name: 'simple-content', description: 'Custom simple mode content. Slot props: { current, total }' }
]

const keyboardShortcuts: KeyboardShortcut[] = [
  { keys: '←', action: 'Go to previous page' },
  { keys: '→', action: 'Go to next page' },
  { keys: 'Home', action: 'Go to first page' },
  { keys: 'End', action: 'Go to last page' },
  { keys: 'Tab', action: 'Focus next element' }
]
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- @component SPagination -->
    <!-- @props modelValue, total, pageSize, maxVisiblePages, variant, size, shape, color, background, showFirstLast, showPrevNext, showTotal, showQuickJump, showPageSize, showProgress, pageSizeOptions, simple, compact, hideSinglePage, disabled, loading, animation, prevText, nextText, firstText, lastText, keyboard, totalFormat -->
    <!-- @events @update:modelValue, @change, @update:pageSize, @pageSizeChange -->
    <!-- @slots prev, next, first, last, page, ellipsis, total, pageSize, quickJump, simple-content -->
    <!-- @sections interactive-demo, basic-usage, variants, sizes, shapes, colors, simple-mode, full-featured, animations, custom-templates, states, real-world-example, api-reference -->
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-(--s-text-primary) mb-2">Pagination</h1>
      <p class="text-lg text-(--s-text-secondary)">Advanced pagination component with rich features, animations, and extensive customization options.</p>
    </header>

    <!-- Features -->
    <article id="features">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 rounded-xl bg-emerald-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-palette-outline text-xl text-emerald-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Five Variants</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Default, outlined, ghost, minimal, and dots variants with custom colors.</p>
        </div>
        <div class="p-4 rounded-xl bg-blue-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-animation text-xl text-blue-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Smooth Animations</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Scale, fade, slide, and flip animations for page transitions.</p>
        </div>
        <div class="p-4 rounded-xl bg-purple-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-puzzle-outline text-xl text-purple-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Rich Templates</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">10 template slots for complete control over every element.</p>
        </div>
        <div class="p-4 rounded-xl bg-amber-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-lightning-bolt text-xl text-amber-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Quick Jump</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Jump to any page instantly with the built-in quick jump input.</p>
        </div>
        <div class="p-4 rounded-xl bg-red-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-keyboard text-xl text-red-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Keyboard Navigation</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Full keyboard support with arrow keys, Home, and End.</p>
        </div>
        <div class="p-4 rounded-xl bg-cyan-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-progress-check text-xl text-cyan-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Progress Bar</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Visual progress indicator showing current position.</p>
        </div>
      </div>
    </article>

    <!-- Interactive Demo -->
    <section id="interactive-demo">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Interactive Demo</h2>
      <div class="p-6 rounded-2xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
        <!-- Controls -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <SSelect
            v-model="interactiveVariant"
            :options="variantOptions"
            label="Variant"
            size="small"
            :color="interactiveColor"
          />
          <SSelect
            v-model="interactiveSize"
            :options="sizeOptions"
            label="Size"
            size="small"
            :color="interactiveColor"
          />
          <SSelect
            v-model="interactiveShape"
            :options="shapeOptions"
            label="Shape"
            size="small"
            :color="interactiveColor"
          />
          <div>
            <label class="text-sm font-medium text-(--s-text-secondary) mb-1.5 block">Color</label>
            <input v-model="interactiveColor" type="color" class="w-full h-9 rounded-lg cursor-pointer border border-(--s-border)" />
          </div>
        </div>
        
        <!-- Toggle options -->
        <div class="flex flex-wrap gap-4 mb-6">
          <SSwitch v-model="showFirstLast" label-after="First/Last" size="small" />
          <SSwitch v-model="showTotal" label-after="Show Total" size="small" />
          <SSwitch v-model="showQuickJump" label-after="Quick Jump" size="small" />
          <SSwitch v-model="showProgress" label-after="Progress" size="small" />
          <SSwitch v-model="isSimple" label-after="Simple Mode" size="small" />
          <SSwitch v-model="hasBackground" label-after="Background" size="small" />
        </div>
        
        <!-- Pagination Preview -->
        <div class="flex justify-center p-6 rounded-xl bg-(--s-bg-primary) border border-(--s-border)">
          <SPagination
            v-model="currentPage"
            :total="totalItems"
            :page-size="pageSize"
            :variant="interactiveVariant"
            :size="interactiveSize"
            :shape="interactiveShape"
            :color="interactiveColor"
            :show-first-last="showFirstLast"
            :show-total="showTotal"
            :show-quick-jump="showQuickJump"
            :show-progress="showProgress"
            :simple="isSimple"
            :background="hasBackground"
          />
        </div>
        
        <div class="mt-4 text-center text-sm text-(--s-text-secondary)">
          Current page: <span class="font-mono font-bold text-(--s-text-primary)">{{ currentPage }}</span>
        </div>
      </div>
    </section>

    <!-- Basic Usage -->
    <section id="basic-usage">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Basic Usage</h2>
      <DemoSection 
        title="Simple Pagination"
        description="Basic pagination with just the required total prop."
        :code="basicCode"
        language="vue"
      >
        <SPagination v-model="currentPage" :total="200" :page-size="10" />
      </DemoSection>
    </section>

    <!-- Variants -->
    <section id="variants">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Variants</h2>
      <DemoSection 
        title="Pagination Variants"
        description="Five visual variants: default, outlined, ghost, minimal, and dots."
        :code="variantsCode"
        language="vue"
      >
        <div class="space-y-6">
          <div class="space-y-2">
            <span class="text-xs font-mono text-(--s-text-tertiary)">default</span>
            <SPagination variant="default" :total="100" :model-value="3" />
          </div>
          <div class="space-y-2">
            <span class="text-xs font-mono text-(--s-text-tertiary)">outlined</span>
            <SPagination variant="outlined" :total="100" :model-value="3" />
          </div>
          <div class="space-y-2">
            <span class="text-xs font-mono text-(--s-text-tertiary)">ghost</span>
            <SPagination variant="ghost" :total="100" :model-value="3" />
          </div>
          <div class="space-y-2">
            <span class="text-xs font-mono text-(--s-text-tertiary)">minimal</span>
            <SPagination variant="minimal" :total="100" :model-value="3" />
          </div>
          <div class="space-y-2">
            <span class="text-xs font-mono text-(--s-text-tertiary)">dots</span>
            <SPagination variant="dots" :total="50" :page-size="10" :model-value="3" />
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Sizes -->
    <section id="sizes">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Sizes</h2>
      <DemoSection 
        title="Pagination Sizes"
        description="Five size options: xs, small, medium, large, and xl."
        :code="sizesCode"
        language="vue"
      >
        <div class="space-y-6">
          <div class="flex flex-col gap-2">
            <span class="text-xs font-mono text-(--s-text-tertiary)">xs</span>
            <SPagination size="xs" :total="100" :model-value="3" />
          </div>
          <div class="flex flex-col gap-2">
            <span class="text-xs font-mono text-(--s-text-tertiary)">small</span>
            <SPagination size="small" :total="100" :model-value="3" />
          </div>
          <div class="flex flex-col gap-2">
            <span class="text-xs font-mono text-(--s-text-tertiary)">medium</span>
            <SPagination size="medium" :total="100" :model-value="3" />
          </div>
          <div class="flex flex-col gap-2">
            <span class="text-xs font-mono text-(--s-text-tertiary)">large</span>
            <SPagination size="large" :total="100" :model-value="3" />
          </div>
          <div class="flex flex-col gap-2">
            <span class="text-xs font-mono text-(--s-text-tertiary)">xl</span>
            <SPagination size="xl" :total="100" :model-value="3" />
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Shapes -->
    <section id="shapes">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Shapes</h2>
      <DemoSection 
        title="Button Shapes"
        description="Three shape options: rounded, square, and pill."
        :code="shapesCode"
        language="vue"
      >
        <div class="space-y-6">
          <div class="flex flex-col gap-2">
            <span class="text-xs font-mono text-(--s-text-tertiary)">rounded</span>
            <SPagination shape="rounded" :total="100" :model-value="3" />
          </div>
          <div class="flex flex-col gap-2">
            <span class="text-xs font-mono text-(--s-text-tertiary)">square</span>
            <SPagination shape="square" :total="100" :model-value="3" />
          </div>
          <div class="flex flex-col gap-2">
            <span class="text-xs font-mono text-(--s-text-tertiary)">pill</span>
            <SPagination shape="pill" :total="100" :model-value="3" />
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Colors -->
    <section id="colors">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Colors</h2>
      <DemoSection 
        title="Custom Colors"
        description="Use any color for the active state."
        :code="colorsCode"
        language="vue"
      >
        <div class="space-y-4">
          <SPagination color="#3b82f6" :total="100" :model-value="3" />
          <SPagination color="#ec4899" :total="100" :model-value="3" />
          <SPagination color="#f59e0b" :total="100" :model-value="3" />
          <SPagination color="#8b5cf6" :total="100" :model-value="3" />
        </div>
      </DemoSection>
    </section>

    <!-- Simple Mode -->
    <section id="simple-mode">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Simple Mode</h2>
      <DemoSection 
        title="Simplified Pagination"
        description="Simple mode shows only prev/next buttons with current page info."
        :code="simpleCode"
        language="vue"
      >
        <div class="space-y-4">
          <SPagination simple :total="100" :page-size="10" :model-value="5" />
          <SPagination simple :total="100" :page-size="10" :model-value="5" color="#8b5cf6" variant="outlined" />
        </div>
      </DemoSection>
    </section>

    <!-- Full Featured -->
    <section id="full-featured">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Full Featured</h2>
      <DemoSection 
        title="All Features Enabled"
        description="Pagination with all features: first/last buttons, total display, quick jump, page size selector, and progress bar."
        :code="fullFeaturedCode"
        language="vue"
      >
        <SPagination 
          v-model="currentPage"
          :total="500"
          :page-size="20"
          show-first-last
          show-total
          show-quick-jump
          show-page-size
          :page-size-options="[10, 20, 50, 100]"
          show-progress
          background
        />
      </DemoSection>
    </section>

    <!-- Animations -->
    <section id="animations">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Animations</h2>
      <DemoSection 
        title="Page Transition Animations"
        description="Choose from scale, fade, slide, or flip animations."
        :code="animationsCode"
        language="vue"
      >
        <div class="space-y-6">
          <div class="flex flex-col gap-2">
            <span class="text-xs font-mono text-(--s-text-tertiary)">scale (default)</span>
            <SPagination animation="scale" :total="100" color="#10b981" />
          </div>
          <div class="flex flex-col gap-2">
            <span class="text-xs font-mono text-(--s-text-tertiary)">fade</span>
            <SPagination animation="fade" :total="100" color="#3b82f6" />
          </div>
          <div class="flex flex-col gap-2">
            <span class="text-xs font-mono text-(--s-text-tertiary)">slide</span>
            <SPagination animation="slide" :total="100" color="#ec4899" />
          </div>
          <div class="flex flex-col gap-2">
            <span class="text-xs font-mono text-(--s-text-tertiary)">flip</span>
            <SPagination animation="flip" :total="100" color="#f59e0b" />
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Custom Templates -->
    <section id="custom-templates">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Custom Templates</h2>
      <DemoSection 
        title="Slot Customization"
        description="Use slots to customize buttons, page numbers, and more."
        :code="customTemplatesCode"
        language="vue"
      >
        <div class="space-y-6">
          <!-- Custom prev/next -->
          <div class="flex flex-col gap-2">
            <span class="text-xs font-mono text-(--s-text-tertiary)">Custom prev/next buttons</span>
            <SPagination :total="100" :model-value="5">
              <template #prev>
                <span class="flex items-center gap-1.5">
                  <span class="mdi mdi-arrow-left-bold"></span>
                  Back
                </span>
              </template>
              <template #next>
                <span class="flex items-center gap-1.5">
                  Forward
                  <span class="mdi mdi-arrow-right-bold"></span>
                </span>
              </template>
            </SPagination>
          </div>
          
          <!-- Custom total format -->
          <div class="flex flex-col gap-2">
            <span class="text-xs font-mono text-(--s-text-tertiary)">Custom total format</span>
            <SPagination 
              :total="247" 
              :page-size="10" 
              :model-value="3"
              show-total
              :total-format="(total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`"
            />
          </div>
          
          <!-- Custom ellipsis -->
          <div class="flex flex-col gap-2">
            <span class="text-xs font-mono text-(--s-text-tertiary)">Custom ellipsis</span>
            <SPagination :total="200" :model-value="10">
              <template #ellipsis>
                <span class="text-(--s-text-tertiary) text-xs">•••</span>
              </template>
            </SPagination>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Loading State -->
    <section id="states">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">States</h2>
      <DemoSection 
        title="Loading & Disabled States"
        description="Show loading spinner or disable pagination."
        :code="statesCode"
        language="vue"
      >
        <div class="space-y-6">
          <div class="flex flex-col gap-2">
            <span class="text-xs font-mono text-(--s-text-tertiary)">loading</span>
            <SPagination :total="100" :model-value="3" loading />
          </div>
          <div class="flex flex-col gap-2">
            <span class="text-xs font-mono text-(--s-text-tertiary)">disabled</span>
            <SPagination :total="100" :model-value="3" disabled />
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Real-world Example -->
    <section id="real-world-example">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Real-world Example</h2>
      <DemoSection 
        title="Data Table Pagination"
        description="Pagination integrated with a data table."
        code="// See full example in source"
        language="vue"
      >
        <div class="rounded-xl border border-(--s-border) overflow-hidden">
          <!-- Table Header -->
          <div class="grid grid-cols-3 gap-4 p-4 bg-(--s-bg-secondary) border-b border-(--s-border)">
            <span class="font-medium text-(--s-text-primary)">ID</span>
            <span class="font-medium text-(--s-text-primary)">Name</span>
            <span class="font-medium text-(--s-text-primary)">Status</span>
          </div>
          
          <!-- Table Body -->
          <div class="divide-y divide-(--s-border)">
            <div 
              v-for="item in items" 
              :key="item.id" 
              class="grid grid-cols-3 gap-4 p-4 transition-colors hover:bg-(--s-bg-secondary)/50"
            >
              <span class="text-(--s-text-secondary) font-mono">{{ item.id }}</span>
              <span class="text-(--s-text-primary)">{{ item.name }}</span>
              <span 
                class="inline-flex items-center gap-1.5 text-sm"
                :class="{
                  'text-emerald-500': item.status === 'Active',
                  'text-amber-500': item.status === 'Pending',
                  'text-blue-500': item.status === 'Complete'
                }"
              >
                <span 
                  class="w-2 h-2 rounded-full"
                  :class="{
                    'bg-emerald-500': item.status === 'Active',
                    'bg-amber-500': item.status === 'Pending',
                    'bg-blue-500': item.status === 'Complete'
                  }"
                ></span>
                {{ item.status }}
              </span>
            </div>
          </div>
          
          <!-- Table Footer with Pagination -->
          <div class="p-4 bg-(--s-bg-secondary) border-t border-(--s-border) flex justify-between items-center">
            <span class="text-sm text-(--s-text-secondary)">
              Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, totalItems) }} of {{ totalItems }}
            </span>
            <SPagination 
              v-model="currentPage"
              :total="totalItems"
              :page-size="pageSize"
              :loading="isLoading"
              @change="handlePageChange"
            />
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- API Reference -->
    <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">API Reference</h2>
    <SApiSection>
      <SApiTable
        title="Props"
        type="props" 
        :props="paginationProps" 
      />

      <SApiTable 
        title="Events" 
        type="events" 
        :events="paginationEvents" 
      />

      <SApiTable 
        title="Slots" 
        type="slots" 
        :slots="paginationSlots"
      />

      <SApiKeyboard :shortcuts="keyboardShortcuts" />
    </SApiSection>
  </div>
</template>
