<script setup lang="ts">
import { ref, computed } from 'vue'
import { SCheckbox, SApiSection, SApiTable, SApiKeyboard } from '../../index'
import type { ApiProp, ApiEvent, ApiSlot, KeyboardShortcut } from '../../index'
import DemoSection from '../../components/DemoSection.vue'
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
const _li = (...mdiNames: string[]) => {
  if (iconPack.value === 'mdi') return ''
  return '\n' + lucideImportStatement(mdiNames)
}

// State for demos
const basicCheck = ref(false)
const sizeSmall = ref(false)
const sizeMedium = ref(true)
const sizeLarge = ref(false)
const colorCheck1 = ref(true)
const colorCheck2 = ref(true)
const colorCheck3 = ref(true)
const colorCheck4 = ref(true)
const labelLeft = ref(false)
const labelRight = ref(true)
const _indeterminate = ref(false)
const indeterminateDemo = ref(false)
const roundedCheck = ref(false)
const roundedCheck2 = ref(true)
const iconCheck1 = ref(true)
const iconCheck2 = ref(true)
const iconCheck3 = ref(true)
const _disabledOff = ref(false)
const disabledOn = ref(true)
const loadingCheck = ref(false)
const requiredCheck = ref(false)

// Checkbox group
const selectedFruits = ref<string[]>(['apple'])
const fruits = ['apple', 'banana', 'orange', 'mango', 'grape']

// Task list
const tasks = ref([
  { id: 1, label: 'Complete project proposal', done: true },
  { id: 2, label: 'Review design mockups', done: false },
  { id: 3, label: 'Setup development environment', done: true },
  { id: 4, label: 'Write documentation', done: false },
])

// Select all logic
const allTasksDone = computed(() => tasks.value.every(t => t.done))
const someTasksDone = computed(() => tasks.value.some(t => t.done) && !allTasksDone.value)

const toggleAllTasks = () => {
  const newValue = !allTasksDone.value
  tasks.value.forEach(t => t.done = newValue)
}

// Code snippets
const basicCode = `<script setup>
import { ref } from 'vue'
const isChecked = ref(false)
<\/script>

<template>
  <SCheckbox v-model="isChecked" label="Accept terms and conditions" />
</template>`

const sizesCode = `<SCheckbox v-model="small" size="small" label="Small" />
<SCheckbox v-model="medium" size="medium" label="Medium" />
<SCheckbox v-model="large" size="large" label="Large" />`

const colorsCode = `<SCheckbox v-model="check1" color="#3b82f6" label="Blue" />
<SCheckbox v-model="check2" color="#ec4899" label="Pink" />
<SCheckbox v-model="check3" color="#f59e0b" label="Amber" />
<SCheckbox v-model="check4" color="#8b5cf6" label="Violet" />`

const labelsCode = `<SCheckbox v-model="value" label="Label on the right (default)" />
<SCheckbox
  v-model="value"
  label="Label on the left"
  label-position="left"
/>`

const indeterminateCode = `<SCheckbox
  :model-value="allTasksDone"
  :indeterminate="someTasksDone"
  label="Select All Tasks"
  size="large"
  color="#3b82f6"
  @change="toggleAllTasks"
/>
<SCheckbox
  v-for="task in tasks"
  :key="task.id"
  v-model="task.done"
  :label="task.label"
  color="#10b981"
/>

<SCheckbox
  v-model="indeterminateDemo"
  indeterminate
  label="Always indeterminate"
  color="#8b5cf6"
/>`

const groupCode = `<script setup>
const selected = ref(['apple'])
const fruits = ['apple', 'banana', 'orange', 'mango', 'grape']
<\/script>

<template>
  <SCheckbox
    v-for="fruit in fruits"
    :key="fruit"
    v-model="selected"
    :value="fruit"
    :label="fruit.charAt(0).toUpperCase() + fruit.slice(1)"
    color="#10b981"
  />
</template>`

const roundedCode = `<SCheckbox v-model="value" rounded label="Rounded checkbox" />
<SCheckbox v-model="value2" rounded color="#ec4899" label="Pink rounded" />`

const iconsCode = computed(() => `<SCheckbox v-model="v1" ${cp('check-bold')} label="Bold check" />
<SCheckbox v-model="v2" ${cp('heart')} color="#ec4899" label="Heart" />
<SCheckbox v-model="v3" ${cp('star')} color="#f59e0b" label="Star" />`)

const statesCode = `<SCheckbox :model-value="false" disabled label="Disabled Off" />
<SCheckbox v-model="disabledOn" disabled label="Disabled On" />
<SCheckbox v-model="loadingCheck" loading label="Loading" />
<SCheckbox v-model="requiredCheck" required label="Required" />`

const taskListCode = `<script setup>
const tasks = ref([
  { id: 1, label: 'Complete project proposal', done: true },
  { id: 2, label: 'Review design mockups', done: false },
  { id: 3, label: 'Setup development environment', done: true },
  { id: 4, label: 'Write documentation', done: false },
])
<\/script>

<template>
  <div v-for="task in tasks" :key="task.id">
    <SCheckbox
      v-model="task.done"
      :label="task.label"
      color="#10b981"
      :class="{ 'line-through opacity-60': task.done }"
    />
  </div>
</template>`

// API Reference data
const checkboxProps: ApiProp[] = [
  { name: 'modelValue', type: 'boolean | string | number | any[]', default: 'false', description: 'v-model binding value', category: 'Core' },
  { name: 'value', type: 'any', default: 'undefined', description: 'Value for array-based checkbox groups', category: 'Core' },
  { name: 'size', type: "'small' | 'medium' | 'large'", default: "'medium'", description: 'Checkbox size', category: 'Appearance' },
  { name: 'color', type: 'string', default: "'var(--s-primary)'", description: 'Checked state background color', category: 'Appearance' },
  { name: 'rounded', type: 'boolean', default: 'false', description: 'Use circular/pill shape', category: 'Appearance' },
  { name: 'icon', type: 'string', default: "'check'", description: 'MDI icon name for checked state', category: 'Appearance' },
  { name: 'label', type: 'string', default: 'undefined', description: 'Label text', category: 'Label' },
  { name: 'labelPosition', type: "'left' | 'right'", default: "'right'", description: 'Label placement relative to checkbox', category: 'Label' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable interactions', category: 'State' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Show loading spinner', category: 'State' },
  { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Show indeterminate/partial state', category: 'State' },
  { name: 'required', type: 'boolean', default: 'false', description: 'Show required indicator (*)', category: 'State' },
  { name: 'name', type: 'string', default: 'undefined', description: 'Form input name attribute', category: 'Form' },
]

const checkboxEvents: ApiEvent[] = [
  { name: 'update:modelValue', payload: 'boolean | string | number | any[]', description: 'Emitted when value changes (for v-model)' },
  { name: 'change', payload: '(value, event)', description: 'Emitted when value changes with native event' },
]

const checkboxSlots: ApiSlot[] = [
  { name: 'default', props: '-', description: 'Custom label content (overrides label prop)' },
  { name: 'icon', props: '-', description: 'Custom icon content for checked state' },
]

const checkboxKeyboard: KeyboardShortcut[] = [
  { keys: 'Tab', action: 'Move focus to checkbox' },
  { keys: 'Space', action: 'Toggle checkbox state' },
  { keys: 'Enter', action: 'Toggle checkbox state' },
]
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- @component SCheckbox -->
    <!-- @props modelValue, value, size, color, rounded, icon, label, labelPosition, disabled, loading, indeterminate, required, name -->
    <!-- @events update:modelValue, change -->
    <!-- @slots default, icon -->
    <!-- @sections features, basic-usage, sizes, colors, labels, indeterminate-state, checkbox-groups, rounded, custom-icons, states, real-world-example, api-reference -->
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-(--s-text-primary) mb-2">Checkbox</h1>
      <p class="text-lg text-(--s-text-secondary)">A versatile checkbox component for single selections, groups, and complex form states.</p>
    </header>

    <!-- Features -->
    <article id="features">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 rounded-xl bg-emerald-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-minus-box text-xl text-emerald-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Indeterminate State</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Support for partial selection states in "select all" patterns.</p>
        </div>
        <div class="p-4 rounded-xl bg-blue-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-checkbox-multiple-marked text-xl text-blue-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Array Binding</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Use array v-model with value prop for checkbox groups.</p>
        </div>
        <div class="p-4 rounded-xl bg-purple-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-star text-xl text-purple-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Custom Icons</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Replace the check icon with any MDI icon like heart or star.</p>
        </div>
        <div class="p-4 rounded-xl bg-amber-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-circle text-xl text-amber-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Rounded Style</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Circular/pill shape option for a different visual appearance.</p>
        </div>
        <div class="p-4 rounded-xl bg-red-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-format-text text-xl text-red-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Flexible Labels</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Position labels on left or right side of the checkbox.</p>
        </div>
        <div class="p-4 rounded-xl bg-cyan-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-keyboard text-xl text-cyan-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Keyboard Support</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Full keyboard navigation with Space and Enter activation.</p>
        </div>
      </div>
    </article>

    <!-- Basic Usage -->
    <section id="basic-usage">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Basic Usage</h2>
      <DemoSection 
        title="Simple Checkbox"
        description="The most basic checkbox with v-model binding for two-way data flow."
        :code="basicCode"
        language="vue"
      >
        <div class="flex items-center gap-6">
          <SCheckbox v-model="basicCheck" label="Accept terms and conditions" />
          <span class="text-sm text-(--s-text-secondary)">
            Value: <code class="font-mono text-emerald-400">{{ basicCheck }}</code>
          </span>
        </div>
      </DemoSection>
    </section>

    <!-- Sizes -->
    <section id="sizes">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Sizes</h2>
      <DemoSection 
        title="Checkbox Sizes"
        description="Three size variants: small, medium (default), and large."
        :code="sizesCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-8 items-center">
          <div class="flex flex-col items-center gap-3">
            <SCheckbox v-model="sizeSmall" size="small" label="Small" />
          </div>
          <div class="flex flex-col items-center gap-3">
            <SCheckbox v-model="sizeMedium" size="medium" label="Medium" />
          </div>
          <div class="flex flex-col items-center gap-3">
            <SCheckbox v-model="sizeLarge" size="large" label="Large" />
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Colors -->
    <section id="colors">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Colors</h2>
      <DemoSection 
        title="Custom Colors"
        description="Customize the checked state color with any valid CSS color value."
        :code="colorsCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-8 items-center">
          <SCheckbox v-model="colorCheck1" color="#3b82f6" label="Blue" />
          <SCheckbox v-model="colorCheck2" color="#ec4899" label="Pink" />
          <SCheckbox v-model="colorCheck3" color="#f59e0b" label="Amber" />
          <SCheckbox v-model="colorCheck4" color="#8b5cf6" label="Violet" />
        </div>
      </DemoSection>
    </section>

    <!-- Labels -->
    <section id="labels">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Labels</h2>
      <DemoSection 
        title="Label Positioning"
        description="Place labels before or after the checkbox."
        :code="labelsCode"
        language="vue"
      >
        <div class="flex flex-col gap-4">
          <SCheckbox v-model="labelRight" label="Label on the right (default)" />
          <SCheckbox v-model="labelLeft" label="Label on the left" label-position="left" />
        </div>
      </DemoSection>
    </section>

    <!-- Indeterminate -->
    <section id="indeterminate-state">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Indeterminate State</h2>
      <DemoSection 
        title="Partial Selection"
        description="Use indeterminate state for 'select all' patterns when only some items are selected."
        :code="indeterminateCode"
        language="vue"
      >
        <div class="space-y-4">
          <div class="p-4 rounded-xl bg-(--s-bg-primary) border border-(--s-border)">
            <SCheckbox 
              :model-value="allTasksDone"
              :indeterminate="someTasksDone"
              label="Select All Tasks"
              size="large"
              color="#3b82f6"
              @change="toggleAllTasks"
            />
            <div class="mt-4 ml-6 space-y-2">
              <SCheckbox 
                v-for="task in tasks" 
                :key="task.id"
                v-model="task.done"
                :label="task.label"
                color="#10b981"
              />
            </div>
          </div>
          <div class="flex gap-4">
            <SCheckbox 
              v-model="indeterminateDemo" 
              indeterminate 
              label="Always indeterminate"
              color="#8b5cf6"
            />
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Checkbox Groups -->
    <section id="checkbox-groups">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Checkbox Groups</h2>
      <DemoSection 
        title="Array-based Selection"
        description="Use an array v-model with individual values to create checkbox groups."
        :code="groupCode"
        language="vue"
      >
        <div class="space-y-4">
          <div class="flex flex-wrap gap-6">
            <SCheckbox 
              v-for="fruit in fruits" 
              :key="fruit"
              v-model="selectedFruits"
              :value="fruit"
              :label="fruit.charAt(0).toUpperCase() + fruit.slice(1)"
              color="#10b981"
            />
          </div>
          <p class="text-sm text-(--s-text-secondary)">
            Selected: <code class="font-mono text-emerald-400">{{ selectedFruits }}</code>
          </p>
        </div>
      </DemoSection>
    </section>

    <!-- Rounded -->
    <section id="rounded">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Rounded</h2>
      <DemoSection 
        title="Pill Shape"
        description="Use the rounded prop for a circular checkbox appearance."
        :code="roundedCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-8 items-center">
          <SCheckbox v-model="roundedCheck" rounded label="Rounded checkbox" />
          <SCheckbox v-model="roundedCheck2" rounded color="#ec4899" label="Pink rounded" />
        </div>
      </DemoSection>
    </section>

    <!-- Custom Icons -->
    <section id="custom-icons">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Custom Icons</h2>
      <DemoSection 
        title="Different Check Icons"
        description="Customize the check icon using any MDI icon name."
        :code="iconsCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-8 items-center">
          <SCheckbox v-model="iconCheck1" :icon="ri('check-bold')" label="Bold check" />
          <SCheckbox v-model="iconCheck2" :icon="ri('heart')" color="#ec4899" label="Heart" />
          <SCheckbox v-model="iconCheck3" :icon="ri('star')" color="#f59e0b" label="Star" />
        </div>
      </DemoSection>
    </section>

    <!-- States -->
    <section id="states">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">States</h2>
      <DemoSection 
        title="Disabled, Loading & Required"
        description="Checkboxes can be disabled, show a loading state, or marked as required."
        :code="statesCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-8 items-center">
          <SCheckbox :model-value="false" disabled label="Disabled Off" />
          <SCheckbox v-model="disabledOn" disabled label="Disabled On" />
          <SCheckbox v-model="loadingCheck" loading label="Loading" />
          <SCheckbox v-model="requiredCheck" required label="Required" />
        </div>
      </DemoSection>
    </section>

    <!-- Real-world Example -->
    <section id="real-world-example">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Real-World Example</h2>
      <DemoSection 
        title="Task List"
        description="A practical task list implementation with checkboxes."
        :code="taskListCode"
        language="vue"
      >
        <div class="p-6 rounded-xl bg-(--s-bg-primary) border border-(--s-border) max-w-md">
          <h3 class="font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-clipboard-check-outline text-xl text-emerald-400"></span>
            My Tasks
          </h3>
          <div class="space-y-3">
            <div 
              v-for="task in tasks" 
              :key="task.id"
              class="flex items-center p-2 rounded-lg transition-colors"
              :class="task.done ? 'bg-(--s-bg-secondary)' : ''"
            >
              <SCheckbox 
                v-model="task.done"
                :label="task.label"
                color="#10b981"
                :class="{ 'line-through opacity-60': task.done }"
              />
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-(--s-border) flex justify-between text-sm text-(--s-text-secondary)">
            <span>{{ tasks.filter(t => t.done).length }} of {{ tasks.length }} completed</span>
            <span class="font-mono text-emerald-400">{{ Math.round(tasks.filter(t => t.done).length / tasks.length * 100) }}%</span>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- API Reference -->
    <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">API Reference</h2>
    <SApiSection>
      <SApiTable title="Props" type="props" :props="checkboxProps" />
      <SApiTable title="Events" type="events" :events="checkboxEvents" />
      <SApiTable title="Slots" type="slots" :slots="checkboxSlots" />
      <SApiKeyboard title="Keyboard Navigation" :shortcuts="checkboxKeyboard" />
    </SApiSection>
  </div>
</template>
