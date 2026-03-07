<script setup lang="ts">
import { ref } from 'vue'
import { SSelect, SButton, SApiSection, SApiTable, SApiKeyboard } from '../../index'
import type { ApiProp, ApiEvent, ApiSlot, KeyboardShortcut } from '../../index'
import DemoSection from '../../components/DemoSection.vue'

// Basic demo
const basicValue = ref(null)
const basicOptions = [
  { value: 'vue', label: 'Vue.js' },
  { value: 'react', label: 'React' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' }
]

// Sizes demo
const sizeSmall = ref(null)
const sizeMedium = ref('medium')
const sizeLarge = ref(null)

// Variants demo
const variantOutlined = ref('vue')
const variantFilled = ref('react')
const variantUnderlined = ref('angular')

// Colors demo
const colorValue1 = ref('option1')
const colorValue2 = ref('option2')
const colorValue3 = ref('option3')
const colorOptions = [
  { value: 'option1', label: 'Option One' },
  { value: 'option2', label: 'Option Two' },
  { value: 'option3', label: 'Option Three' }
]

// Multiple selection demo
const multipleValue = ref(['vue', 'react'])
const multipleOptions = [
  { value: 'vue', label: 'Vue.js', icon: 'vuejs' },
  { value: 'react', label: 'React', icon: 'react' },
  { value: 'angular', label: 'Angular', icon: 'angular' },
  { value: 'svelte', label: 'Svelte', icon: 'flash' },
  { value: 'solid', label: 'Solid.js', icon: 'atom' },
  { value: 'qwik', label: 'Qwik', icon: 'lightning-bolt' }
]

// Searchable demo
const searchValue = ref(null)
const countryOptions = [
  { value: 'us', label: 'United States', icon: 'flag' },
  { value: 'uk', label: 'United Kingdom', icon: 'flag' },
  { value: 'de', label: 'Germany', icon: 'flag' },
  { value: 'fr', label: 'France', icon: 'flag' },
  { value: 'es', label: 'Spain', icon: 'flag' },
  { value: 'it', label: 'Italy', icon: 'flag' },
  { value: 'jp', label: 'Japan', icon: 'flag' },
  { value: 'cn', label: 'China', icon: 'flag' },
  { value: 'kr', label: 'South Korea', icon: 'flag' },
  { value: 'br', label: 'Brazil', icon: 'flag' },
  { value: 'au', label: 'Australia', icon: 'flag' },
  { value: 'ca', label: 'Canada', icon: 'flag' }
]

// With icons and descriptions
const iconValue = ref(null)
const iconOptions = [
  { value: 'email', label: 'Email', icon: 'email', description: 'Send notifications via email' },
  { value: 'sms', label: 'SMS', icon: 'message-text', description: 'Text message alerts' },
  { value: 'push', label: 'Push', icon: 'bell', description: 'Browser push notifications' },
  { value: 'slack', label: 'Slack', icon: 'slack', description: 'Slack channel messages' }
]

// States demo
const disabledValue = ref('option1')
const loadingValue = ref(null)
const isLoading = ref(false)

const simulateLoading = () => {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
  }, 2000)
}

// Clearable demo
const clearableValue = ref('vue')

// Labels and validation
const labelValue = ref(null)
const errorValue = ref(null)
const hintValue = ref(null)

// Rounded demo
const roundedSm = ref('vue')
const roundedFull = ref('react')

// Real-world example
const projectFramework = ref(null)
const projectLanguage = ref('typescript')
const projectFeatures = ref(['auth', 'api'])

const frameworkOptions = [
  { value: 'nextjs', label: 'Next.js', icon: 'react', description: 'The React Framework' },
  { value: 'nuxt', label: 'Nuxt', icon: 'vuejs', description: 'The Intuitive Vue Framework' },
  { value: 'sveltekit', label: 'SvelteKit', icon: 'flash', description: 'Web development, streamlined' },
  { value: 'remix', label: 'Remix', icon: 'disc', description: 'Full Stack Web Framework' }
]

const languageOptions = [
  { value: 'typescript', label: 'TypeScript' },
  { value: 'javascript', label: 'JavaScript' }
]

const featureOptions = [
  { value: 'auth', label: 'Authentication', icon: 'shield-account' },
  { value: 'api', label: 'API Routes', icon: 'api' },
  { value: 'db', label: 'Database', icon: 'database' },
  { value: 'storage', label: 'File Storage', icon: 'folder-multiple' },
  { value: 'realtime', label: 'Realtime', icon: 'lightning-bolt' },
  { value: 'ai', label: 'AI Features', icon: 'robot' }
]

// Grouped options demo
const groupedValue = ref(null)
const timezoneOptions = [
  { value: 'est', label: 'Eastern Standard Time (EST)', group: 'North America' },
  { value: 'cst', label: 'Central Standard Time (CST)', group: 'North America' },
  { value: 'mst', label: 'Mountain Standard Time (MST)', group: 'North America' },
  { value: 'pst', label: 'Pacific Standard Time (PST)', group: 'North America' },
  { value: 'gmt', label: 'Greenwich Mean Time (GMT)', group: 'Europe & Africa' },
  { value: 'cet', label: 'Central European Time (CET)', group: 'Europe & Africa' },
  { value: 'eet', label: 'Eastern European Time (EET)', group: 'Europe & Africa' },
  { value: 'jst', label: 'Japan Standard Time (JST)', group: 'Asia Pacific' },
  { value: 'cst-china', label: 'China Standard Time (CST)', group: 'Asia Pacific' },
  { value: 'aest', label: 'Australian Eastern Time (AEST)', group: 'Asia Pacific' }
]

// Dense mode demo
const denseValue = ref('vue')
const normalValue = ref('react')

// Creatable demo
const creatableTags = ref<string[]>(['Vue.js', 'React'])
const tagOptions = [
  { value: 'Vue.js', label: 'Vue.js' },
  { value: 'React', label: 'React' },
  { value: 'Angular', label: 'Angular' },
  { value: 'Svelte', label: 'Svelte' }
]
const handleTagCreate = (newTag: string) => {
  tagOptions.push({ value: newTag, label: newTag })
}

// Image/Avatar demo
const userValue = ref(null)
const userOptions = [
  { value: 'user1', label: 'Sarah Johnson', image: 'https://i.pravatar.cc/100?img=1', description: 'Product Manager' },
  { value: 'user2', label: 'Mike Chen', image: 'https://i.pravatar.cc/100?img=3', description: 'Software Engineer' },
  { value: 'user3', label: 'Emily Davis', image: 'https://i.pravatar.cc/100?img=5', description: 'UX Designer' },
  { value: 'user4', label: 'Alex Wilson', image: 'https://i.pravatar.cc/100?img=8', description: 'DevOps Engineer' }
]

// Menu width demo  
const menuWidthValue = ref(null)

// Label placement demo
const labelTopValue = ref(null)
const labelLeftValue = ref(null)
const labelRightValue = ref(null)
const labelBottomValue = ref(null)

// Float Label (label-placeholder) demo
const floatLabelValue1 = ref(null)
const floatLabelValue2 = ref('vue')
const floatLabelValue3 = ref(null)

// Inline Filter demo
const inlineFilterValue = ref(null)
const inlineFilterMultiple = ref<string[]>([])

// Code snippets
const basicCode = `<script setup>
import { ref } from 'vue'
const selected = ref(null)
const options = [
  { value: 'vue', label: 'Vue.js' },
  { value: 'react', label: 'React' },
  { value: 'angular', label: 'Angular' }
]
<\/script>

<template>
  <SSelect v-model="selected" :options="options" placeholder="Select a framework" />
</template>`

const sizesCode = `<SSelect v-model="small" :options="options" size="small" />
<SSelect v-model="medium" :options="options" size="medium" />
<SSelect v-model="large" :options="options" size="large" />`

const variantsCode = `<SSelect v-model="v1" :options="options" variant="outlined" />
<SSelect v-model="v2" :options="options" variant="filled" />
<SSelect v-model="v3" :options="options" variant="underlined" />`

const colorsCode = `<SSelect v-model="value" :options="options" color="#3b82f6" />
<SSelect v-model="value" :options="options" color="#ec4899" />
<SSelect v-model="value" :options="options" color="#f59e0b" />`

const multipleCode = `<script setup>
const selected = ref(['vue', 'react'])
const options = [
  { value: 'vue', label: 'Vue.js', icon: 'vuejs' },
  { value: 'react', label: 'React', icon: 'react' },
  { value: 'angular', label: 'Angular', icon: 'angular' }
]
<\/script>

<template>
  <SSelect 
    v-model="selected" 
    :options="options" 
    multiple 
    :tag-limit="3"
    placeholder="Select frameworks"
  />
</template>`

const searchableCode = `<SSelect 
  v-model="selected" 
  :options="countryOptions" 
  searchable 
  placeholder="Search countries..."
/>`

const floatLabelCode = `<!-- Float label animates from inside to above -->
<SSelect 
  v-model="selected" 
  :options="options"
  label-placeholder="Select Framework"
/>

<!-- With value - label stays above -->
<SSelect 
  v-model="selected" 
  :options="options"
  label-placeholder="Framework"
  clearable
/>`

const inlineFilterCode = `<!-- Type directly in the select trigger to filter -->
<SSelect 
  v-model="selected" 
  :options="options"
  filter
  label-placeholder="Search & Select"
/>

<!-- Inline filter with multiple selection -->
<SSelect 
  v-model="selected" 
  :options="options"
  filter
  multiple
  label-placeholder="Select Tags"
/>`

const labelPlacementCode = `<div class="grid gap-6">
  <!-- Vertical -->
  <SSelect label="Top Left" label-placement="top-left" :options="options" />
  <SSelect label="Top Center" label-placement="top-center" :options="options" />
  <SSelect label="Top Right" label-placement="top-right" :options="options" />
  
  <SSelect label="Bottom Right" label-placement="bottom-right" :options="options" />

  <!-- Horizontal -->
  <SSelect label="Left Center" label-placement="left-center" :options="options" />
  <SSelect label="Right Bottom" label-placement="right-bottom" :options="options" />
</div>`

const iconsCode = `const options = [
  { value: 'email', label: 'Email', icon: 'email', description: 'Via email' },
  { value: 'sms', label: 'SMS', icon: 'message-text', description: 'Text alerts' }
]

<SSelect v-model="selected" :options="options" />`

const statesCode = `<SSelect v-model="value" :options="options" disabled />
<SSelect v-model="value" :options="options" loading />
<SSelect v-model="value" :options="options" clearable />`

const labelsCode = `<SSelect 
  v-model="selected" 
  :options="options" 
  label="Framework"
  required
  hint="Choose your preferred framework"
/>

<SSelect 
  v-model="selected" 
  :options="options" 
  label="Framework"
  error="This field is required"
/>`

const realWorldCode = `<script setup>
const framework = ref(null)
const language = ref('typescript')
const features = ref(['auth', 'api'])
<\/script>

<template>
  <div class="space-y-4">
    <SSelect 
      v-model="framework"
      :options="frameworkOptions"
      label="Framework"
      placeholder="Choose a framework"
      searchable
      required
    />
    <SSelect 
      v-model="language"
      :options="languageOptions"
      label="Language"
    />
    <SSelect 
      v-model="features"
      :options="featureOptions"
      label="Features"
      multiple
      searchable
      placeholder="Select features"
    />
  </div>
</template>`

const optionProps: ApiProp[] = [
  { name: 'value', type: 'any', default: 'required', description: 'Option value submitted back to SSelect', category: 'Core' },
  { name: 'label', type: 'string', default: 'undefined', description: 'Display label (falls back to the value)', category: 'Content' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable selection for this option', category: 'State' },
  { name: 'icon', type: 'string', default: 'undefined', description: 'Optional leading MDI icon', category: 'Content' },
  { name: 'description', type: 'string', default: 'undefined', description: 'Secondary supporting text', category: 'Content' },
  { name: 'color', type: 'string', default: 'undefined', description: 'Custom accent color when selected', category: 'Appearance' },
]

const optionSlots: ApiSlot[] = [
  { name: 'default', props: '-', description: 'Custom option label content' },
  { name: 'suffix', props: '-', description: 'Trailing content rendered inline with the option label' }
]

const optionGroupProps: ApiProp[] = [
  { name: 'label', type: 'string', default: 'required', description: 'Group heading text', category: 'Core' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Visually disables the group header; nested options still rely on their own disabled prop', category: 'State' },
  { name: 'collapsible', type: 'boolean', default: 'false', description: 'Allow the group to collapse or expand', category: 'Behavior' },
  { name: 'defaultCollapsed', type: 'boolean', default: 'false', description: 'Initial collapsed state when collapsible is enabled', category: 'Behavior' },
]

const optionGroupSlots: ApiSlot[] = [
  { name: 'label', props: '-', description: 'Custom group header content' },
  { name: 'default', props: '-', description: 'Nested SOption content for the group' }
]
</script>

<template>
  <div class="space-y-8 pb-20">
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-(--s-text-primary) mb-2">Select</h1>
      <p class="text-lg text-(--s-text-secondary)">A highly customizable dropdown select component with search, multiple selection, and stunning visuals.</p>
    </header>

    <!-- Features -->
    <article class="space-y-4">
      <h2 class="text-2xl font-bold text-(--s-text-primary)">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 rounded-xl bg-(--s-bg-secondary) border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-format-list-checks text-2xl text-emerald-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Multiple Selection</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Select multiple options with animated tag display and configurable limits.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary) border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-magnify text-2xl text-blue-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Searchable</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Built-in search functionality to filter through large option lists.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary) border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-plus-circle text-2xl text-rose-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Creatable Options</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Allow users to create new options by typing custom values.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary) border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-group text-2xl text-violet-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Grouped Options</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Organize options with group headers for better categorization.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary) border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-image-outline text-2xl text-amber-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Rich Options</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Options with icons, images, descriptions, and custom colors.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary) border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-keyboard text-2xl text-cyan-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Keyboard Navigation</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Full keyboard support with arrow keys, Home, End, and search typing.</p>
        </div>
      </div>
    </article>

    <!-- Basic Usage -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-4">Basic Usage</h2>
      <DemoSection 
        title="Simple Select"
        description="Basic dropdown with v-model binding and options array."
        :code="basicCode"
        language="vue"
      >
        <div class="max-w-sm space-y-4">
          <SSelect 
            v-model="basicValue" 
            :options="basicOptions" 
            placeholder="Select a framework..."
          />
          <p class="text-sm text-(--s-text-secondary)">
            Selected: <code class="font-mono text-emerald-400">{{ basicValue ?? 'null' }}</code>
          </p>
        </div>
      </DemoSection>
    </section>

    <!-- Sizes -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-4">Sizes</h2>
      <DemoSection 
        title="Select Sizes"
        description="Three size variants: small, medium (default), and large."
        :code="sizesCode"
        language="vue"
      >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="space-y-2">
            <span class="text-xs text-(--s-text-tertiary) uppercase tracking-wider">Small</span>
            <SSelect 
              v-model="sizeSmall" 
              :options="basicOptions" 
              size="small"
              placeholder="Select..."
            />
          </div>
          <div class="space-y-2">
            <span class="text-xs text-(--s-text-tertiary) uppercase tracking-wider">Medium</span>
            <SSelect 
              v-model="sizeMedium" 
              :options="basicOptions" 
              size="medium"
              placeholder="Select..."
            />
          </div>
          <div class="space-y-2">
            <span class="text-xs text-(--s-text-tertiary) uppercase tracking-wider">Large</span>
            <SSelect 
              v-model="sizeLarge" 
              :options="basicOptions" 
              size="large"
              placeholder="Select..."
            />
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Variants -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-4">Variants</h2>
      <DemoSection 
        title="Visual Variants"
        description="Three visual styles: outlined (default), filled, and underlined."
        :code="variantsCode"
        language="vue"
      >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="space-y-2">
            <span class="text-xs text-(--s-text-tertiary) uppercase tracking-wider">Outlined</span>
            <SSelect 
              v-model="variantOutlined" 
              :options="basicOptions" 
              variant="outlined"
            />
          </div>
          <div class="space-y-2">
            <span class="text-xs text-(--s-text-tertiary) uppercase tracking-wider">Filled</span>
            <SSelect 
              v-model="variantFilled" 
              :options="basicOptions" 
              variant="filled"
            />
          </div>
          <div class="space-y-2">
            <span class="text-xs text-(--s-text-tertiary) uppercase tracking-wider">Underlined</span>
            <SSelect 
              v-model="variantUnderlined" 
              :options="basicOptions" 
              variant="underlined"
            />
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Colors -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-4">Colors</h2>
      <DemoSection 
        title="Custom Colors"
        description="Customize the accent color for focus states and selected options."
        :code="colorsCode"
        language="vue"
      >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SSelect 
            v-model="colorValue1" 
            :options="colorOptions" 
            color="#3b82f6"
            placeholder="Blue accent"
          />
          <SSelect 
            v-model="colorValue2" 
            :options="colorOptions" 
            color="#ec4899"
            placeholder="Pink accent"
          />
          <SSelect 
            v-model="colorValue3" 
            :options="colorOptions" 
            color="#f59e0b"
            placeholder="Amber accent"
          />
        </div>
      </DemoSection>
    </section>

    <!-- Multiple Selection -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-4">Multiple Selection</h2>
      <DemoSection 
        title="Multi-Select with Tags"
        description="Enable multiple selection with animated tags display."
        :code="multipleCode"
        language="vue"
      >
        <div class="max-w-md space-y-4">
          <SSelect 
            v-model="multipleValue" 
            :options="multipleOptions" 
            multiple
            searchable
            :tag-limit="3"
            placeholder="Select frameworks..."
          />
          <p class="text-sm text-(--s-text-secondary)">
            Selected: <code class="font-mono text-emerald-400">{{ multipleValue }}</code>
          </p>
        </div>
      </DemoSection>
    </section>

    <!-- Searchable -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-4">Searchable</h2>
      <DemoSection 
        title="Search & Filter"
        description="Enable search input to filter through options."
        :code="searchableCode"
        language="vue"
      >
        <div class="max-w-sm">
          <SSelect 
            v-model="searchValue" 
            :options="countryOptions" 
            searchable
            clearable
            placeholder="Search countries..."
          />
        </div>
      </DemoSection>
    </section>

    <!-- Float Label (Label Placeholder) - Vuesax-inspired -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-4">Float Label</h2>
      <DemoSection 
        title="Animated Label Placeholder"
        description="The label starts inside the field and smoothly animates to the top on focus or when a value is selected. Inspired by Vuesax's label-placeholder pattern."
        :code="floatLabelCode"
        language="vue"
      >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="space-y-2">
            <span class="text-xs text-(--s-text-tertiary) uppercase tracking-wider">Empty</span>
            <SSelect 
              v-model="floatLabelValue1" 
              :options="basicOptions"
              label-placeholder="Select Framework"
              clearable
            />
          </div>
          <div class="space-y-2">
            <span class="text-xs text-(--s-text-tertiary) uppercase tracking-wider">With Value</span>
            <SSelect 
              v-model="floatLabelValue2" 
              :options="basicOptions"
              label-placeholder="Framework"
              clearable
            />
          </div>
          <div class="space-y-2">
            <span class="text-xs text-(--s-text-tertiary) uppercase tracking-wider">With Color</span>
            <SSelect 
              v-model="floatLabelValue3" 
              :options="basicOptions"
              label-placeholder="Choose Option"
              color="#8b5cf6"
              clearable
              required
            />
          </div>
        </div>
        <p class="mt-4 text-sm text-(--s-text-tertiary)">
          Click on any field to see the label float up with a smooth animation.
        </p>
      </DemoSection>
    </section>

    <!-- Inline Filter - Vuesax-inspired -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-4">Inline Filter</h2>
      <DemoSection 
        title="Type-to-Search in Trigger"
        description="Instead of a separate search input inside the dropdown, type directly in the select trigger to filter options. Inspired by Vuesax's filter prop."
        :code="inlineFilterCode"
        language="vue"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-2">
            <span class="text-xs text-(--s-text-tertiary) uppercase tracking-wider">Single Select</span>
            <SSelect 
              v-model="inlineFilterValue" 
              :options="countryOptions"
              filter
              label-placeholder="Search Countries"
              clearable
            />
            <p class="text-xs text-(--s-text-tertiary)">
              Selected: <code class="text-emerald-400">{{ inlineFilterValue ?? 'null' }}</code>
            </p>
          </div>
          <div class="space-y-2">
            <span class="text-xs text-(--s-text-tertiary) uppercase tracking-wider">Multiple Select</span>
            <SSelect 
              v-model="inlineFilterMultiple" 
              :options="multipleOptions"
              filter
              multiple
              :tag-limit="2"
              label-placeholder="Select Frameworks"
            />
            <p class="text-xs text-(--s-text-tertiary)">
              Selected: <code class="text-emerald-400">{{ inlineFilterMultiple }}</code>
            </p>
          </div>
        </div>
        <p class="mt-4 text-sm text-(--s-text-tertiary)">
          Start typing to filter options instantly. The dropdown opens automatically as you type.
        </p>
      </DemoSection>
    </section>

    <!-- With Icons & Descriptions -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-4">Icons & Descriptions</h2>
      <DemoSection 
        title="Rich Options"
        description="Options can include icons and description text."
        :code="iconsCode"
        language="vue"
      >
        <div class="max-w-sm">
          <SSelect 
            v-model="iconValue" 
            :options="iconOptions" 
            placeholder="Select notification type..."
          />
        </div>
      </DemoSection>
    </section>

    <!-- Grouped Options -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-4">Grouped Options</h2>
      <DemoSection 
        title="Options with Group Headers"
        description="Use the 'group' property in options to automatically group them with headers."
        :code="`const options = [
  { value: 'est', label: 'Eastern (EST)', group: 'North America' },
  { value: 'gmt', label: 'GMT', group: 'Europe & Africa' },
  // ...
]

<SSelect v-model='selected' :options='timezoneOptions' searchable />`"
        language="vue"
      >
        <div class="max-w-md">
          <SSelect 
            v-model="groupedValue" 
            :options="timezoneOptions" 
            searchable
            placeholder="Select a timezone..."
            label="Timezone"
          />
        </div>
      </DemoSection>
    </section>

    <!-- Dense Mode -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-4">Dense Mode</h2>
      <DemoSection 
        title="Compact Layout"
        description="Use the 'dense' prop for a more compact select with reduced padding."
        :code="`<SSelect :options='options' dense />`"
        language="vue"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg">
          <div class="space-y-2">
            <span class="text-xs text-(--s-text-tertiary) uppercase tracking-wider">Normal</span>
            <SSelect 
              v-model="normalValue" 
              :options="basicOptions" 
            />
          </div>
          <div class="space-y-2">
            <span class="text-xs text-(--s-text-tertiary) uppercase tracking-wider">Dense</span>
            <SSelect 
              v-model="denseValue" 
              :options="basicOptions" 
              dense
            />
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- With Images -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-4">With Images</h2>
      <DemoSection 
        title="Avatar & Image Support"
        description="Options can include images for user avatars or icons using the 'image' property."
        :code="`const options = [
  { value: 'user1', label: 'Sarah Johnson', image: 'https://...', description: 'Manager' },
  { value: 'user2', label: 'Mike Chen', image: 'https://...', description: 'Engineer' }
]

<SSelect v-model='selected' :options='userOptions' />`"
        language="vue"
      >
        <div class="max-w-sm">
          <SSelect 
            v-model="userValue" 
            :options="userOptions"
            label="Assign to"
            placeholder="Select a team member..."
          />
        </div>
      </DemoSection>
    </section>

    <!-- Creatable -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-4">Creatable</h2>
      <DemoSection 
        title="Create New Options"
        description="Enable 'creatable' to allow users to create new options by typing. Works great for tags."
        :code="`<SSelect 
  v-model='tags' 
  :options='tagOptions' 
  multiple 
  searchable 
  creatable
  @create='handleCreate'
/>`"
        language="vue"
      >
        <div class="max-w-md">
          <SSelect 
            v-model="creatableTags" 
            :options="tagOptions"
            multiple
            searchable
            creatable
            label="Tags"
            placeholder="Type to add tags..."
            @create="handleTagCreate"
          />
          <p class="mt-2 text-sm text-(--s-text-tertiary)">
            Type something new and press Enter to create a tag
          </p>
        </div>
      </DemoSection>
    </section>

    <!-- Menu Width -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-4">Custom Menu Width</h2>
      <DemoSection 
        title="Menu Width Control"
        description="Use 'menuWidth' prop to set a custom dropdown width."
        :code="`<SSelect :options='options' menu-width='400px' />`"
        language="vue"
      >
        <div class="max-w-sm">
          <SSelect 
            v-model="menuWidthValue" 
            :options="countryOptions"
            searchable
            menu-width="400px"
            placeholder="Select a country..."
          />
        </div>
      </DemoSection>
    </section>

    <!-- States -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-4">States</h2>
      <DemoSection 
        title="Disabled, Loading & Clearable"
        description="Various interactive states for the select component."
        :code="statesCode"
        language="vue"
      >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="space-y-2">
            <span class="text-xs text-(--s-text-tertiary) uppercase tracking-wider">Disabled</span>
            <SSelect 
              v-model="disabledValue" 
              :options="colorOptions" 
              disabled
            />
          </div>
          <div class="space-y-2">
            <span class="text-xs text-(--s-text-tertiary) uppercase tracking-wider">Loading</span>
            <SSelect 
              v-model="loadingValue" 
              :options="colorOptions" 
              :loading="isLoading"
              placeholder="Click to load..."
              @open="simulateLoading"
            />
          </div>
          <div class="space-y-2">
            <span class="text-xs text-(--s-text-tertiary) uppercase tracking-wider">Clearable</span>
            <SSelect 
              v-model="clearableValue" 
              :options="basicOptions" 
              clearable
            />
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Label Placement -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-4">Label Placement</h2>
      <DemoSection 
        title="Custom Label Positioning"
        description="Control the label position using the 'label-placement' prop (top, bottom, left, right)."
        :code="labelPlacementCode"
        language="vue"
      >
        <div class="space-y-8">
          <!-- Vertical -->
          <div>
            <h4 class="text-sm font-semibold uppercase tracking-wider text-(--s-text-tertiary) mb-4">Vertical Placement</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SSelect 
                v-model="labelTopValue" 
                :options="basicOptions"
                label="Top Left"
                label-placement="top-left"
              />
              <SSelect 
                v-model="labelTopValue" 
                :options="basicOptions"
                label="Top Center"
                label-placement="top-center"
              />
              <SSelect 
                v-model="labelTopValue" 
                :options="basicOptions"
                label="Top Right"
                label-placement="top-right"
              />

              <SSelect 
                v-model="labelBottomValue" 
                :options="basicOptions"
                label="Bottom Left"
                label-placement="bottom-left"
              />
              <SSelect 
                v-model="labelBottomValue" 
                :options="basicOptions"
                label="Bottom Center"
                label-placement="bottom-center"
              />
              <SSelect 
                v-model="labelBottomValue" 
                :options="basicOptions"
                label="Bottom Right"
                label-placement="bottom-right"
              />
            </div>
          </div>

          <!-- Horizontal -->
          <div>
            <h4 class="text-sm font-semibold uppercase tracking-wider text-(--s-text-tertiary) mb-4">Horizontal Placement</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-4">
                <SSelect 
                  v-model="labelLeftValue" 
                  :options="basicOptions"
                  label="Left Top"
                  label-placement="left-top"
                />
                <SSelect 
                  v-model="labelLeftValue" 
                  :options="basicOptions"
                  label="Left Center"
                  label-placement="left-center"
                />
                <SSelect 
                  v-model="labelLeftValue" 
                  :options="basicOptions"
                  label="Left Bottom"
                  label-placement="left-bottom"
                />
              </div>

              <div class="space-y-4">
                <SSelect 
                  v-model="labelRightValue" 
                  :options="basicOptions"
                  label="Right Top"
                  label-placement="right-top"
                />
                <SSelect 
                  v-model="labelRightValue" 
                  :options="basicOptions"
                  label="Right Center"
                  label-placement="right-center"
                />
                <SSelect 
                  v-model="labelRightValue" 
                  :options="basicOptions"
                  label="Right Bottom"
                  label-placement="right-bottom"
                />
              </div>
            </div>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Labels & Validation -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-4">Labels & Validation</h2>
      <DemoSection 
        title="Form Integration"
        description="Labels, hints, required indicators, and error states."
        :code="labelsCode"
        language="vue"
      >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SSelect 
            v-model="labelValue" 
            :options="basicOptions"
            label="Framework"
            required
            placeholder="Select..."
          />
          <SSelect 
            v-model="hintValue" 
            :options="basicOptions"
            label="With Hint"
            hint="Choose your preferred framework"
            placeholder="Select..."
          />
          <SSelect 
            v-model="errorValue" 
            :options="basicOptions"
            label="With Error"
            error="This field is required"
            placeholder="Select..."
          />
        </div>
      </DemoSection>
    </section>

    <!-- Rounded -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-4">Border Radius</h2>
      <DemoSection 
        title="Rounded Variants"
        description="Different border radius options."
        :code="`<SSelect rounded='sm' /> <SSelect rounded='full' />`"
        language="vue"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg">
          <SSelect 
            v-model="roundedSm" 
            :options="basicOptions" 
            rounded="sm"
            placeholder="rounded='sm'"
          />
          <SSelect 
            v-model="roundedFull" 
            :options="basicOptions" 
            rounded="full"
            placeholder="rounded='full'"
          />
        </div>
      </DemoSection>
    </section>

    <!-- Real-world Example -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-4">Real-World Example</h2>
      <DemoSection 
        title="Project Configuration"
        description="A practical form for configuring a new project."
        :code="realWorldCode"
        language="vue"
      >
        <div class="p-6 rounded-xl bg-(--s-bg-primary) border border-(--s-border) max-w-lg">
          <h3 class="font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-rocket-launch text-xl text-emerald-400"></span>
            New Project
          </h3>
          <div class="space-y-5">
            <SSelect 
              v-model="projectFramework"
              :options="frameworkOptions"
              label="Framework"
              placeholder="Choose a framework"
              searchable
              required
            />
            <SSelect 
              v-model="projectLanguage"
              :options="languageOptions"
              label="Language"
            />
            <SSelect 
              v-model="projectFeatures"
              :options="featureOptions"
              label="Features"
              multiple
              searchable
              :tag-limit="4"
              placeholder="Select features to include"
            />
            <div class="pt-4 border-t border-(--s-border)">
              <SButton
                block
                color="#10b981"
                class="py-2.5 font-medium"
                :disabled="!projectFramework"
              >
                Create Project
              </SButton>
            </div>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- API Reference -->
    <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">API Reference</h2>
    <SApiSection>
      <div class="space-y-8">
        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-form-dropdown text-(--s-primary)" />
            SSelect
          </h3>
          <SApiTable
            title="Props"
            type="props"
            :props="([
              { name: 'modelValue', type: 'any | any[]', default: 'null', description: 'v-model binding value', category: 'Core' },
              { name: 'options', type: 'SelectOption[]', default: '[]', description: 'Array of options (alternative to slots)', category: 'Core' },
              { name: 'multiple', type: 'boolean', default: 'false', description: 'Enable multiple selection', category: 'Selection Mode' },
              { name: 'searchable', type: 'boolean', default: 'false', description: 'Enable search input in dropdown', category: 'Selection Mode' },
              { name: 'filter', type: 'boolean', default: 'false', description: 'Enable inline filtering (type directly in trigger)', category: 'Selection Mode' },
              { name: 'clearable', type: 'boolean', default: 'false', description: 'Show clear button when has value', category: 'Selection Mode' },
              { name: 'closeOnSelect', type: 'boolean', default: 'auto', description: 'Override whether the menu closes after an option is selected', category: 'Selection Mode' },
              { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the select', category: 'Selection Mode' },
              { name: 'loading', type: 'boolean', default: 'false', description: 'Show loading state', category: 'Selection Mode' },
              { name: 'placeholder', type: 'string', default: '\'Select...\'', description: 'Placeholder text', category: 'Selection Mode' },
              { name: 'labelPlaceholder', type: 'string', default: 'undefined', description: 'Float label that animates from inside to top', category: 'Appearance' },
              { name: 'labelPlacement', type: '\'top\' | \'top-left\' | \'top-center\' | \'top-right\' | \'bottom\' | \'bottom-left\' | \'bottom-center\' | \'bottom-right\' | \'left\' | \'left-top\' | \'left-center\' | \'left-bottom\' | \'right\' | \'right-top\' | \'right-center\' | \'right-bottom\'', default: '\'top\'', description: 'Placement for the static label', category: 'Appearance' },
              { name: 'size', type: '\'small\' | \'medium\' | \'large\'', default: '\'medium\'', description: 'Component size', category: 'Appearance' },
              { name: 'color', type: 'string', default: 'var(--s-primary)', description: 'Accent color', category: 'Appearance' },
              { name: 'variant', type: '\'outlined\' | \'filled\' | \'underlined\'', default: '\'outlined\'', description: 'Visual variant style', category: 'Appearance' },
              { name: 'rounded', type: '\'none\' | \'sm\' | \'md\' | \'lg\' | \'full\'', default: '\'md\'', description: 'Border radius', category: 'Appearance' },
              { name: 'maxHeight', type: 'string', default: '\'280px\'', description: 'Max dropdown height', category: 'Appearance' },
              { name: 'arrowIcon', type: 'string', default: '\'chevron-down\'', description: 'Icon used by the built-in dropdown arrow', category: 'Appearance' },
              { name: 'menuWidth', type: 'string | number', default: 'undefined', description: 'Override the dropdown menu width', category: 'Dropdown Behavior' },
              { name: 'menuAlign', type: '\'start\' | \'end\' | \'center\'', default: '\'start\'', description: 'Horizontal alignment of the dropdown menu', category: 'Dropdown Behavior' },
              { name: 'placement', type: '\'bottom\' | \'top\' | \'auto\'', default: '\'auto\'', description: 'Dropdown placement', category: 'Dropdown Behavior' },
              { name: 'teleport', type: 'boolean | string', default: 'true', description: 'Teleport target for the dropdown overlay', category: 'Dropdown Behavior' },
              { name: 'tagLimit', type: 'number', default: '3', description: 'Max visible tags for multiple', category: 'Multiple Selection' },
              { name: 'creatable', type: 'boolean', default: 'false', description: 'Allow creating a new option from the current query', category: 'Multiple Selection' },
              { name: 'createText', type: 'string', default: '\'Create "{query}"\'', description: 'Template used for the creatable option label', category: 'Multiple Selection' },
              { name: 'noOptionsText', type: 'string', default: '\'No options available\'', description: 'Message shown when there are no options', category: 'Content' },
              { name: 'noResultsText', type: 'string', default: '\'No results found\'', description: 'Message shown when search/filter finds nothing', category: 'Content' },
              { name: 'label', type: 'string', default: 'undefined', description: 'Form label (static positioning)', category: 'Form Integration' },
              { name: 'error', type: 'string', default: 'undefined', description: 'Error message', category: 'Form Integration' },
              { name: 'hint', type: 'string', default: 'undefined', description: 'Hint text below select', category: 'Form Integration' },
              { name: 'required', type: 'boolean', default: 'false', description: 'Show required indicator', category: 'Form Integration' }
            ] as ApiProp[])"
          />

          <SApiTable
            title="Events"
            type="events"
            class="mt-6"
            :events="([
              { name: 'update:modelValue', payload: 'any | any[]', description: 'Emitted when value changes (for v-model)' },
              { name: 'change', payload: '(value, event?)', description: 'Emitted when value changes' },
              { name: 'open', payload: '-', description: 'Dropdown opened' },
              { name: 'close', payload: '-', description: 'Dropdown closed' },
              { name: 'search', payload: 'string', description: 'Search query changed' },
              { name: 'focus', payload: 'FocusEvent', description: 'Select focused' },
              { name: 'blur', payload: 'FocusEvent', description: 'Select blurred' },
              { name: 'create', payload: 'string', description: 'Emitted when a creatable option is confirmed' }
            ] as ApiEvent[])"
          />

          <SApiTable
            title="Slots"
            type="slots"
            class="mt-6"
            :slots="([
              { name: 'default', props: '-', description: 'SOption/SOptionGroup children' },
              { name: 'prefix', props: '-', description: 'Content before the value' },
              { name: 'suffix', props: '-', description: 'Content after the value' },
              { name: 'selected', props: '{ option }', description: 'Custom selected value display' },
              { name: 'option', props: '{ option, selected, highlighted }', description: 'Custom option rendering' },
              { name: 'tag', props: '{ option, remove }', description: 'Custom tag rendering for multiple' },
              { name: 'arrow', props: "{ 'is-open': boolean }", description: 'Override the built-in dropdown arrow' },
              { name: 'empty', props: '-', description: 'Custom empty state' },
              { name: 'loading', props: '-', description: 'Custom loading state' },
              { name: 'header', props: '-', description: 'Content above options' },
              { name: 'footer', props: '-', description: 'Content below options' }
            ] as ApiSlot[])"
          />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-format-list-bulleted-square text-(--s-primary)" />
            SOption
          </h3>
          <SApiTable title="Props" type="props" :props="optionProps" />
          <SApiTable title="Slots" type="slots" :slots="optionSlots" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-folder-outline text-(--s-primary)" />
            SOptionGroup
          </h3>
          <SApiTable title="Props" type="props" :props="optionGroupProps" />
          <SApiTable title="Slots" type="slots" :slots="optionGroupSlots" class="mt-6" />
        </div>

        <div>
          <SApiKeyboard
            title="Keyboard Navigation"
            :shortcuts="([
              { keys: ['Enter', 'Space'], action: 'Open dropdown or select highlighted option' },
              { keys: 'Escape', action: 'Close dropdown' },
              { keys: ['↓', '↑'], action: 'Navigate through options' },
              { keys: ['Home', 'End'], action: 'Jump to first/last option' },
              { keys: 'Tab', action: 'Close dropdown and move focus' }
            ] as KeyboardShortcut[])"
          />
        </div>
      </div>
    </SApiSection>
  </div>
</template>
