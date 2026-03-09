<script setup lang="ts">
import { ref, computed } from 'vue'
import { SRadio, SRadioGroup, SButton, SApiSection, SApiTable, SApiKeyboard } from '../../index'
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

// Basic usage
const basicValue = ref('option1')

// Sizes
const sizeValue = ref('medium')

// Colors
const colorValue = ref('blue')

// Variants
const variantDefault = ref('a')
const variantFilled = ref('b')
const variantOutlined = ref('c')
const variantButton = ref('option2')

// Orientations
const horizontalValue = ref('react')
const verticalValue = ref('vue')
const gridValue = ref('ts')

// Button style group
const planValue = ref('pro')

// States
const statesValue = ref('enabled')

// Icons
const iconValue = ref('card')

// Real-world example - payment method
const paymentMethod = ref('card')

// Options
const frameworkOptions = [
  { value: 'vue', label: 'Vue.js', icon: 'vuejs' },
  { value: 'react', label: 'React', icon: 'react' },
  { value: 'angular', label: 'Angular', icon: 'angular' },
  { value: 'svelte', label: 'Svelte', icon: 'language-javascript' }
]

const languageOptions = [
  { value: 'ts', label: 'TypeScript' },
  { value: 'js', label: 'JavaScript' },
  { value: 'py', label: 'Python' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'cpp', label: 'C++' }
]

const planOptions = [
  { value: 'free', label: 'Free' },
  { value: 'pro', label: 'Pro' },
  { value: 'enterprise', label: 'Enterprise' }
]

// Code snippets
const basicCode = `<script setup>
import { ref } from 'vue'
const selected = ref('option1')
<\/script>

<template>
  <SRadio v-model="selected" value="option1" label="Option 1" />
  <SRadio v-model="selected" value="option2" label="Option 2" />
  <SRadio v-model="selected" value="option3" label="Option 3" />
</template>`

const sizesCode = `<SRadio v-model="value" value="small" size="small" label="Small" />
<SRadio v-model="value" value="medium" size="medium" label="Medium" />
<SRadio v-model="value" value="large" size="large" label="Large" />`

const colorsCode = `<SRadio v-model="v" value="blue" color="#3b82f6" label="Blue" />
<SRadio v-model="v" value="pink" color="#ec4899" label="Pink" />
<SRadio v-model="v" value="amber" color="#f59e0b" label="Amber" />
<SRadio v-model="v" value="violet" color="#8b5cf6" label="Violet" />
<SRadio v-model="v" value="emerald" color="#10b981" label="Emerald" />`

const variantsCode = `<!-- Default: ring highlight -->
<SRadio v-model="v" value="a" variant="default" label="Option A" />
<SRadio v-model="v" value="b" variant="default" label="Option B" />

<!-- Filled: solid background -->
<SRadio v-model="v" value="a" variant="filled" color="#ec4899" label="Option A" />
<SRadio v-model="v" value="b" variant="filled" color="#ec4899" label="Option B" />

<!-- Outlined: emphasized border -->
<SRadio v-model="v" value="a" variant="outlined" color="#f59e0b" label="Option A" />
<SRadio v-model="v" value="b" variant="outlined" color="#f59e0b" label="Option B" />
<SRadio v-model="v" value="c" variant="outlined" color="#f59e0b" label="Option C" />

<!-- Button: toggle button style -->
<SRadio v-model="v" value="option1" variant="button" color="#8b5cf6" label="Monthly" />
<SRadio v-model="v" value="option2" variant="button" color="#8b5cf6" label="Yearly" />
<SRadio v-model="v" value="option3" variant="button" color="#8b5cf6" label="Lifetime" />`

const groupCode = `<script setup>
const selected = ref('vue')
const options = [
  { value: 'vue', label: 'Vue.js', icon: 'vuejs' },
  { value: 'react', label: 'React', icon: 'react' },
  { value: 'angular', label: 'Angular', icon: 'angular' },
  { value: 'svelte', label: 'Svelte', icon: 'language-javascript' }
]
<\/script>

<template>
  <!-- Horizontal -->
  <SRadioGroup
    v-model="selected"
    :options="options"
    orientation="horizontal"
    color="#3b82f6"
  />

  <!-- Vertical -->
  <SRadioGroup
    v-model="selected"
    :options="options"
    orientation="vertical"
    color="#10b981"
  />

  <!-- Grid (3 columns) -->
  <SRadioGroup
    v-model="selected"
    :options="languageOptions"
    orientation="grid"
    :grid-cols="3"
    color="#f59e0b"
  />
</template>`

const buttonGroupCode = `<SRadioGroup 
  v-model="plan" 
  :options="plans" 
  variant="button" 
  orientation="horizontal" 
  color="#8b5cf6"
/>`

const iconsCode = computed(() => `<SRadio v-model="v" value="card" ${cp('credit-card')} color="#3b82f6" label="Credit Card" />
<SRadio v-model="v" value="bank" ${cp('bank')} color="#10b981" label="Bank Transfer" />
<SRadio v-model="v" value="paypal" ${cp('wallet')} color="#f59e0b" label="E-Wallet" />`)

const statesCode = `<SRadio v-model="value" value="enabled" label="Enabled" />
<SRadio v-model="value" value="disabled" disabled label="Disabled" />
<SRadio v-model="value" value="loading" loading label="Loading" />`

const paymentMethodCode = `<script setup>
const paymentMethod = ref('card')
const methods = [
  { value: 'card', label: 'Credit / Debit Card', icon: 'credit-card', desc: 'Visa, Mastercard, Amex' },
  { value: 'paypal', label: 'PayPal', icon: 'alpha-p-box', desc: 'Fast & secure checkout' },
  { value: 'bank', label: 'Bank Transfer', icon: 'bank', desc: '1-3 business days' }
]
<\/script>

<template>
  <label v-for="method in methods" :key="method.value">
    <SRadio
      v-model="paymentMethod"
      :value="method.value"
      color="#3b82f6"
    />
    <span>{{ method.label }}</span>
    <p>{{ method.desc }}</p>
  </label>
  <SButton variant="filled" block rounded="xl" color="#3b82f6">
    Continue with {{ paymentMethod }}
  </SButton>
</template>`

// API Reference data
const radioProps: ApiProp[] = [
  { name: 'modelValue', type: 'any', default: 'undefined', description: 'v-model binding value', category: 'Core' },
  { name: 'value', type: 'any', default: 'undefined', description: 'Value this radio represents', category: 'Core' },
  { name: 'size', type: "'small' | 'medium' | 'large'", default: "'medium'", description: 'Radio size', category: 'Appearance' },
  { name: 'color', type: 'string', default: "'var(--s-primary)'", description: 'Selected state color', category: 'Appearance' },
  { name: 'variant', type: "'default' | 'filled' | 'outlined' | 'button'", default: "'default'", description: 'Visual style variant', category: 'Appearance' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable interactions', category: 'State' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Show loading spinner', category: 'State' },
  { name: 'label', type: 'string', default: 'undefined', description: 'Label text', category: 'Label & Icon' },
  { name: 'labelPosition', type: "'left' | 'right'", default: "'right'", description: 'Label placement', category: 'Label & Icon' },
  { name: 'icon', type: 'string', default: 'undefined', description: 'MDI icon name for center', category: 'Label & Icon' },
  { name: 'required', type: 'boolean', default: 'false', description: 'Show a required marker after the label', category: 'Label & Icon' },
  { name: 'name', type: 'string', default: 'undefined', description: 'Native radio input name attribute', category: 'Form Integration' },
  { name: 'error', type: 'string', default: 'undefined', description: 'Inline validation message', category: 'Form Integration' },
  { name: 'radioClass', type: 'string', default: 'undefined', description: 'Additional class for the radio control element', category: 'Appearance' },
  { name: 'labelClass', type: 'string', default: 'undefined', description: 'Additional class for the label text', category: 'Appearance' },
]

const radioGroupProps: ApiProp[] = [
  { name: 'modelValue', type: 'any', default: 'undefined', description: 'v-model binding value', category: 'Core' },
  { name: 'options', type: '{ value, label, disabled?, icon? }[]', default: '[]', description: 'Array of radio options', category: 'Core' },
  { name: 'orientation', type: "'horizontal' | 'vertical' | 'grid'", default: "'vertical'", description: 'Layout direction', category: 'Layout' },
  { name: 'size', type: "'small' | 'medium' | 'large'", default: "'medium'", description: 'Inherited size for child radios', category: 'Appearance' },
  { name: 'color', type: 'string', default: 'undefined', description: 'Inherited selected color for child radios', category: 'Appearance' },
  { name: 'variant', type: "'default' | 'filled' | 'outlined' | 'button'", default: "'default'", description: 'Inherited visual variant for child radios', category: 'Appearance' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the entire group', category: 'State' },
  { name: 'gridCols', type: 'number', default: '3', description: 'Columns for grid layout', category: 'Layout' },
  { name: 'gap', type: "'tight' | 'normal' | 'loose'", default: "'normal'", description: 'Spacing between items', category: 'Layout' },
  { name: 'name', type: 'string', default: 'undefined', description: 'Shared native name passed to generated radios', category: 'Form Integration' },
]

const radioEvents: ApiEvent[] = [
  { name: 'update:modelValue', payload: 'any', description: 'Emitted when the radio becomes selected' },
  { name: 'change', payload: '(value, event)', description: 'Emitted after user interaction changes the selected value' }
]

const radioGroupEvents: ApiEvent[] = [
  { name: 'update:modelValue', payload: 'any', description: 'Emitted when the group selection changes' },
  { name: 'change', payload: 'any', description: 'Emitted after the group selection changes' }
]

const radioSlots: ApiSlot[] = [
  { name: 'default', props: '-', description: 'Custom label content' },
  { name: 'icon', props: '-', description: 'Override the selected icon or inner dot content' }
]

const radioGroupSlots: ApiSlot[] = [
  { name: 'default', props: '-', description: 'Custom SRadio children when not using the options prop' }
]

const radioKeyboard: KeyboardShortcut[] = [
  { keys: 'Tab', action: 'Move focus to/from radio group' },
  { keys: ['Space', 'Enter'], action: 'Select focused radio' },
  { keys: ['↑', '←'], action: 'Move to previous option' },
  { keys: ['↓', '→'], action: 'Move to next option' },
]
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- @component SRadio -->
    <!-- @props modelValue, value, size, color, variant, disabled, loading, label, labelPosition, icon, required, name, error, radioClass, labelClass -->
    <!-- @events update:modelValue, change -->
    <!-- @slots default, icon -->
    <!-- @sections features, basic-usage, sizes, colors, variants, radio-groups, button-style-group, custom-icons, states, real-world-example, api-reference -->
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-(--s-text-primary) mb-2">Radio</h1>
      <p class="text-lg text-(--s-text-secondary)">A stunning, customizable radio component for single selections from a group of options.</p>
    </header>

    <!-- Features -->
    <article id="features" class="space-y-4">
      <h2 class="text-2xl font-bold text-(--s-text-primary)">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 rounded-xl bg-emerald-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-radiobox-marked text-2xl text-emerald-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Four Visual Variants</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Default ring, filled background, outlined border, and button toggle styles.</p>
        </div>
        <div class="p-4 rounded-xl bg-blue-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-view-grid text-2xl text-blue-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Radio Group Layouts</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Horizontal, vertical, and grid orientations with gap control.</p>
        </div>
        <div class="p-4 rounded-xl bg-rose-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-palette-outline text-2xl text-rose-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Custom Colors</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Use any CSS color value to customize selection states.</p>
        </div>
        <div class="p-4 rounded-xl bg-violet-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-image-outline text-2xl text-violet-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Custom Icons</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Replace the standard dot with any MDI icon in the center.</p>
        </div>
        <div class="p-4 rounded-xl bg-amber-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-keyboard text-2xl text-amber-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Keyboard Navigation</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Full arrow key navigation with Tab, Space, and Enter support.</p>
        </div>
        <div class="p-4 rounded-xl bg-cyan-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-animation-outline text-2xl text-cyan-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Ripple Effects</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Smooth ripple animations on selection for tactile feedback.</p>
        </div>
      </div>
    </article>

    <!-- Basic Usage -->
    <section id="basic-usage">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Basic Usage</h2>
      <DemoSection 
        title="Simple Radio Selection"
        description="Use v-model to bind multiple radios to the same value for mutual exclusivity."
        :code="basicCode"
        language="vue"
      >
        <div class="flex flex-col gap-3">
          <SRadio v-model="basicValue" value="option1" label="Option 1" />
          <SRadio v-model="basicValue" value="option2" label="Option 2" />
          <SRadio v-model="basicValue" value="option3" label="Option 3" />
          <p class="text-sm text-(--s-text-secondary) mt-2">
            Selected: <code class="font-mono text-emerald-400">{{ basicValue }}</code>
          </p>
        </div>
      </DemoSection>
    </section>

    <!-- Sizes -->
    <section id="sizes">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Sizes</h2>
      <DemoSection 
        title="Radio Sizes"
        description="Three size variants for different contexts."
        :code="sizesCode"
        language="vue"
      >
        <div class="flex flex-wrap items-center gap-8">
          <SRadio v-model="sizeValue" value="small" size="small" label="Small" />
          <SRadio v-model="sizeValue" value="medium" size="medium" label="Medium" />
          <SRadio v-model="sizeValue" value="large" size="large" label="Large" />
        </div>
      </DemoSection>
    </section>

    <!-- Colors -->
    <section id="colors">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Colors</h2>
      <DemoSection 
        title="Custom Colors"
        description="Customize the selection color with any CSS color value."
        :code="colorsCode"
        language="vue"
      >
        <div class="flex flex-wrap items-center gap-8">
          <SRadio v-model="colorValue" value="blue" color="#3b82f6" label="Blue" />
          <SRadio v-model="colorValue" value="pink" color="#ec4899" label="Pink" />
          <SRadio v-model="colorValue" value="amber" color="#f59e0b" label="Amber" />
          <SRadio v-model="colorValue" value="violet" color="#8b5cf6" label="Violet" />
          <SRadio v-model="colorValue" value="emerald" color="#10b981" label="Emerald" />
        </div>
      </DemoSection>
    </section>

    <!-- Variants -->
    <section id="variants">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Variants</h2>
      <DemoSection 
        title="Visual Variants"
        description="Four distinct visual styles for different design needs."
        :code="variantsCode"
        language="vue"
      >
        <div class="space-y-6">
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Default (ring glow)</p>
            <div class="flex gap-6">
              <SRadio v-model="variantDefault" value="a" variant="default" label="Option A" />
              <SRadio v-model="variantDefault" value="b" variant="default" label="Option B" />
            </div>
          </div>
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Filled (solid background)</p>
            <div class="flex gap-6">
              <SRadio v-model="variantFilled" value="a" variant="filled" color="#ec4899" label="Option A" />
              <SRadio v-model="variantFilled" value="b" variant="filled" color="#ec4899" label="Option B" />
            </div>
          </div>
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Outlined (emphasized border)</p>
            <div class="flex gap-6">
              <SRadio v-model="variantOutlined" value="a" variant="outlined" color="#f59e0b" label="Option A" />
              <SRadio v-model="variantOutlined" value="b" variant="outlined" color="#f59e0b" label="Option B" />
              <SRadio v-model="variantOutlined" value="c" variant="outlined" color="#f59e0b" label="Option C" />
            </div>
          </div>
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Button (toggle button style)</p>
            <div class="flex gap-3">
              <SRadio v-model="variantButton" value="option1" variant="button" color="#8b5cf6" label="Monthly" />
              <SRadio v-model="variantButton" value="option2" variant="button" color="#8b5cf6" label="Yearly" />
              <SRadio v-model="variantButton" value="option3" variant="button" color="#8b5cf6" label="Lifetime" />
            </div>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Radio Groups -->
    <section id="radio-groups">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Radio Groups</h2>
      <DemoSection 
        title="SRadioGroup Component"
        description="Use SRadioGroup for automatic keyboard navigation and layout management."
        :code="groupCode"
        language="vue"
      >
        <div class="space-y-6">
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Horizontal</p>
            <SRadioGroup 
              v-model="horizontalValue" 
              :options="frameworkOptions" 
              orientation="horizontal"
              color="#3b82f6"
            />
          </div>
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Vertical</p>
            <SRadioGroup 
              v-model="verticalValue" 
              :options="frameworkOptions" 
              orientation="vertical"
              color="#10b981"
            />
          </div>
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Grid (3 columns)</p>
            <SRadioGroup 
              v-model="gridValue" 
              :options="languageOptions" 
              orientation="grid"
              :grid-cols="3"
              color="#f59e0b"
            />
          </div>
          <p class="text-sm text-(--s-text-secondary)">
            Selected framework: <code class="font-mono text-emerald-400">{{ horizontalValue }}</code>
          </p>
        </div>
      </DemoSection>
    </section>

    <!-- Button Style Group -->
    <section id="button-style-group">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Button Style Group</h2>
      <DemoSection 
        title="Toggle Button Radios"
        description="Perfect for pricing plans, view modes, or any segmented selection."
        :code="buttonGroupCode"
        language="vue"
      >
        <div class="space-y-4">
          <SRadioGroup 
            v-model="planValue" 
            :options="planOptions" 
            variant="button"
            orientation="horizontal"
            color="#8b5cf6"
          />
          <p class="text-sm text-(--s-text-secondary)">
            Selected plan: <code class="font-mono text-violet-400">{{ planValue }}</code>
          </p>
        </div>
      </DemoSection>
    </section>

    <!-- Custom Icons -->
    <section id="custom-icons">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Custom Icons</h2>
      <DemoSection 
        title="Icons in Radio Dot"
        description="Replace the standard dot with a custom MDI icon."
        :code="iconsCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-6">
          <SRadio v-model="iconValue" value="card" :icon="ri('credit-card')" color="#3b82f6" label="Credit Card" />
          <SRadio v-model="iconValue" value="bank" :icon="ri('bank')" color="#10b981" label="Bank Transfer" />
          <SRadio v-model="iconValue" value="paypal" :icon="ri('wallet')" color="#f59e0b" label="E-Wallet" />
        </div>
      </DemoSection>
    </section>

    <!-- States -->
    <section id="states">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">States</h2>
      <DemoSection 
        title="Disabled & Loading"
        description="Control interaction states."
        :code="statesCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-8">
          <SRadio v-model="statesValue" value="enabled" label="Enabled" />
          <SRadio v-model="statesValue" value="disabled" disabled label="Disabled" />
          <SRadio v-model="statesValue" value="loading" loading label="Loading" />
        </div>
      </DemoSection>
    </section>

    <!-- Real-World Example -->
    <section id="real-world-example">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Real-World Example</h2>
      <DemoSection 
        title="Payment Method Selection"
        description="A practical payment method selector implementation."
        :code="paymentMethodCode"
        language="vue"
      >
        <div class="p-6 rounded-xl bg-(--s-bg-primary) border border-(--s-border) max-w-md">
          <h3 class="font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-credit-card-outline text-xl text-blue-400"></span>
            Select Payment Method
          </h3>
          <div class="space-y-3">
            <label 
              v-for="method in [
                { value: 'card', label: 'Credit / Debit Card', icon: 'credit-card', desc: 'Visa, Mastercard, Amex' },
                { value: 'paypal', label: 'PayPal', icon: 'alpha-p-box', desc: 'Fast & secure checkout' },
                { value: 'bank', label: 'Bank Transfer', icon: 'bank', desc: '1-3 business days' }
              ]"
              :key="method.value"
              class="flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer"
              :class="paymentMethod === method.value 
                ? 'border-blue-500/50 bg-blue-500/10' 
                : 'border-(--s-border) hover:border-(--s-text-tertiary)'"
            >
              <SRadio 
                v-model="paymentMethod" 
                :value="method.value" 
                color="#3b82f6"
                class="mt-0.5"
              />
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <span :class="['mdi', `mdi-${method.icon}`, 'text-lg', paymentMethod === method.value ? 'text-blue-400' : 'text-(--s-text-secondary)']"></span>
                  <span class="font-medium text-(--s-text-primary)">{{ method.label }}</span>
                </div>
                <p class="text-sm text-(--s-text-secondary) mt-1">{{ method.desc }}</p>
              </div>
            </label>
          </div>
          <SButton variant="filled" block rounded="lg" color="#3b82f6" class="mt-6 py-3 font-semibold">
            Continue with {{ paymentMethod === 'card' ? 'Card' : paymentMethod === 'paypal' ? 'PayPal' : 'Bank Transfer' }}
          </SButton>
        </div>
      </DemoSection>
    </section>

    <!-- API Reference -->
    <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">API Reference</h2>
    <SApiSection>
      <div class="space-y-8">
        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-radiobox-marked text-(--s-primary)" />
            SRadio
          </h3>
          <SApiTable title="Props" type="props" :props="radioProps" />
          <SApiTable title="Events" type="events" :events="radioEvents" class="mt-6" />
          <SApiTable title="Slots" type="slots" :slots="radioSlots" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-format-list-bulleted text-(--s-primary)" />
            SRadioGroup
          </h3>
          <SApiTable title="Props" type="props" :props="radioGroupProps" />
          <SApiTable title="Events" type="events" :events="radioGroupEvents" class="mt-6" />
          <SApiTable title="Slots" type="slots" :slots="radioGroupSlots" class="mt-6" />
        </div>

        <div>
          <SApiKeyboard title="Keyboard Navigation" :shortcuts="radioKeyboard" />
        </div>
      </div>
    </SApiSection>
  </div>
</template>
