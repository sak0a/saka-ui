<script setup lang="ts">
import { ref } from 'vue'
import {
  SInput, SButton, SKbd, SKbdShortcut, SApiSection, SApiTable
} from '../../index'
import type { ApiProp, ApiEvent, ApiSlot, ApiMethod } from '../../index'
import DemoSection from '../../components/DemoSection.vue'
import { Sparkles, ShieldCheck, Wrench } from 'lucide-vue-next'

// Demo state
const basicValue = ref('')
const emailValue = ref('')
const passwordValue = ref('')
const searchValue = ref('')
const urlValue = ref('')
const numberValue = ref<number | string>('')
const textareaValue = ref('')

const floatingValue = ref('')
const insideValue = ref('')

const clearableValue = ref('Some text to clear')
const counterValue = ref('')
const prefixValue = ref('')
const suffixValue = ref('')

const validatedEmail = ref('')
const validatedPassword = ref('')
const customValidated = ref('')
const asyncValidated = ref('')

const loginEmail = ref('')
const loginPassword = ref('')
const searchQuery = ref('')
const creditCard = ref('')

// New feature demos
const emailWithSuggestions = ref('')
const digitsOnly = ref('')
const floatValue = ref('')
const lettersOnly = ref('')
const emailSuggestions = ['@gmail.com', '@outlook.com', '@yahoo.com', '@icloud.com', '@proton.me']

// Custom validator simulation
const usernameValidator = async (value: string | number): Promise<string | boolean> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800))
  const strValue = String(value)
  if (strValue.length < 3) return 'Username must be at least 3 characters'
  if (strValue === 'admin') return 'Username already taken'
  return true
}

// Code snippets
const basicCode = `<SInput
  v-model="username"
  label="Username"
  placeholder="Enter your username"
/>

<SInput
  v-model="email"
  type="email"
  label="Email"
  placeholder="name@example.com"
/>

<SInput
  v-model="password"
  type="password"
  label="Password"
  placeholder="••••••••"
  show-password-toggle
/>`

const variantsCode = `<!-- Outlined (default) -->
<SInput variant="outlined" label="Outlined" placeholder="Default style" />

<!-- Filled -->
<SInput variant="filled" label="Filled" placeholder="Filled background" />

<!-- Underlined -->
<SInput variant="underlined" label="Underlined" placeholder="Minimal style" />

<!-- Ghost -->
<SInput variant="ghost" label="Ghost" placeholder="Transparent" />`

const sizesCode = `<SInput size="small" label="Small" placeholder="Small input" />
<SInput size="medium" label="Medium" placeholder="Medium input" />
<SInput size="large" label="Large" placeholder="Large input" />`

const floatingCode = `<!-- Floating label -->
<SInput
  v-model="value"
  label="Floating Label"
  label-placement="floating"
  placeholder="Type something..."
/>

<!-- Inside label -->
<SInput
  v-model="value"
  label="Inside Label"
  label-placement="inside"
  placeholder="Focus to see animation..."
/>`

const iconsCode = `<!-- Left icon with clearable -->
<SInput v-model="search" icon-left="magnify" placeholder="Search..." clearable />

<!-- Right icon -->
<SInput v-model="url" icon-right="link-variant" label="Website" placeholder="https://..." />

<!-- Prefix/suffix text -->
<SInput v-model="price" prefix="$" suffix=".00" label="Price" placeholder="0" type="number" />
<SInput v-model="weight" suffix="kg" label="Weight" placeholder="Enter weight" type="number" />

<!-- Both icons with success -->
<SInput icon-left="account" icon-right="check-circle" label="Username" placeholder="Available username" success />

<!-- Icon with hint -->
<SInput icon-left="email" label="Email" placeholder="user@example.com" hint="We'll never share your email" />`

const validationCode = `<!-- Required field -->
<SInput
  v-model="email"
  type="email"
  label="Email (required)"
  placeholder="Enter your email"
  required
  hint="Validates email format on blur"
/>

<!-- Min/max length -->
<SInput
  v-model="password"
  type="password"
  label="Password (8-20 chars)"
  placeholder="Enter password"
  :min-length="8"
  :max-length="20"
  counter
  show-password-toggle
/>

<!-- Pattern validation -->
<SInput
  v-model="letters"
  label="Pattern (letters only)"
  placeholder="Only letters allowed"
  pattern="^[a-zA-Z]+$"
  hint="Uses regex pattern validation"
/>

<!-- Custom async validator -->
<SInput
  v-model="username"
  label="Username (async check)"
  placeholder="Try 'admin'"
  :validator="checkUsername"
  validate-on="blur"
  hint="Simulates API validation (try 'admin')"
/>`

const statesCode = `<!-- Error state -->
<SInput error="Invalid email address" label="Email" value="invalid-email" />

<!-- Success state -->
<SInput success="Username is available!" label="Username" value="john_doe" />

<!-- Warning state -->
<SInput warning="Password is weak" label="Password" type="password" value="123" />

<!-- Disabled -->
<SInput disabled model-value="Disabled input" label="Disabled" />

<!-- Read-only -->
<SInput readonly model-value="Read-only input" label="Read-only" />

<!-- Loading -->
<SInput loading label="Loading" placeholder="Checking..." />`

const featuresCode = `<!-- Clearable -->
<SInput v-model="text" clearable label="Clearable" hint="Click X to clear" />

<!-- Character counter -->
<SInput
  v-model="bio"
  :max-length="50"
  counter
  label="With Counter"
  placeholder="Type to see counter..."
/>

<!-- Password toggle -->
<SInput
  v-model="password"
  type="password"
  show-password-toggle
  label="Password Toggle"
  placeholder="Click eye to toggle"
/>

<!-- Number input -->
<SInput
  v-model="number"
  type="number"
  :min="0"
  :max="100"
  :step="5"
  label="Number Input"
  placeholder="0-100, step 5"
/>

<!-- Textarea -->
<SInput
  v-model="message"
  type="textarea"
  :rows="4"
  :max-length="200"
  counter
  label="Textarea"
  placeholder="Enter a longer message..."
/>`

const kbdSearchCode = `<!-- Search input with keyboard shortcut hint -->
<SInput placeholder="Search..." iconLeft="magnify">
  <template #suffix>
    <SKbdShortcut :keys="['⌘', 'K']" size="xs" variant="flat" />
  </template>
</SInput>`

// API Reference
const inputProps: ApiProp[] = [
  { name: 'modelValue', type: 'string | number', default: "''", description: 'Input value (v-model)', category: 'Core' },
  { name: 'type', type: "'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'textarea'", default: "'text'", description: 'Input type', category: 'Core' },
  { name: 'variant', type: "'outlined' | 'filled' | 'underlined' | 'ghost'", default: "'outlined'", description: 'Visual style variant', category: 'Appearance' },
  { name: 'size', type: "'small' | 'medium' | 'large'", default: "'medium'", description: 'Input size', category: 'Appearance' },
  { name: 'rounded', type: "'none' | 'sm' | 'md' | 'lg' | 'full'", default: "'md'", description: 'Border radius', category: 'Appearance' },
  { name: 'label', type: 'string', default: '—', description: 'Label text', category: 'Content' },
  { name: 'placeholder', type: 'string', default: '—', description: 'Placeholder text', category: 'Content' },
  { name: 'labelPlacement', type: "'top' | 'floating' | 'inside' | 'left' | 'right' | ...", default: "'top'", description: 'Label position', category: 'Layout' },
  { name: 'iconLeft', type: 'string', default: '—', description: 'Left MDI icon name', category: 'Icons' },
  { name: 'iconRight', type: 'string', default: '—', description: 'Right MDI icon name', category: 'Icons' },
  { name: 'prefix', type: 'string', default: '—', description: 'Prefix text (e.g. $)', category: 'Content' },
  { name: 'suffix', type: 'string', default: '—', description: 'Suffix text (e.g. kg)', category: 'Content' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disabled state', category: 'State' },
  { name: 'readonly', type: 'boolean', default: 'false', description: 'Read-only state', category: 'State' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Loading state', category: 'State' },
  { name: 'error', type: 'string | boolean', default: '—', description: 'Error message/state', category: 'Validation' },
  { name: 'success', type: 'string | boolean', default: '—', description: 'Success message/state', category: 'Validation' },
  { name: 'warning', type: 'string | boolean', default: '—', description: 'Warning message/state', category: 'Validation' },
  { name: 'hint', type: 'string', default: '—', description: 'Hint text below input', category: 'Content' },
  { name: 'required', type: 'boolean', default: 'false', description: 'Required field', category: 'Validation' },
  { name: 'minLength', type: 'number', default: '—', description: 'Minimum length', category: 'Validation' },
  { name: 'maxLength', type: 'number', default: '—', description: 'Maximum length', category: 'Validation' },
  { name: 'pattern', type: 'string | RegExp', default: '—', description: 'Regex pattern', category: 'Validation' },
  { name: 'validator', type: '(value) => string | boolean | Promise', default: '—', description: 'Custom validator function', category: 'Validation' },
  { name: 'validateOn', type: "'blur' | 'input' | 'submit' | 'never'", default: "'blur'", description: 'When to trigger validation', category: 'Validation' },
  { name: 'clearable', type: 'boolean', default: 'false', description: 'Show clear button', category: 'Features' },
  { name: 'showPasswordToggle', type: 'boolean', default: 'false', description: 'Show password toggle', category: 'Features' },
  { name: 'counter', type: 'boolean', default: 'false', description: 'Show character counter', category: 'Features' },
  { name: 'rows', type: 'number', default: '3', description: 'Textarea rows', category: 'Textarea' },
  { name: 'resize', type: "'none' | 'vertical' | 'horizontal' | 'both'", default: "'vertical'", description: 'Textarea resize', category: 'Textarea' },
  { name: 'autofocus', type: 'boolean', default: 'false', description: 'Auto focus on mount', category: 'Behavior' },
  { name: 'suggestions', type: 'string[]', default: '—', description: 'Autocomplete suggestions list', category: 'Suggestions' },
  { name: 'showSuggestionsOnFocus', type: 'boolean', default: 'true', description: 'Show suggestions when focused', category: 'Suggestions' },
  { name: 'allowOnly', type: "'digits' | 'letters' | 'alphanumeric' | RegExp | Function", default: '—', description: 'Restrict allowed characters', category: 'Input Filtering' },
  { name: 'decimalPlaces', type: 'number', default: '—', description: 'Max decimal places for numbers', category: 'Input Filtering' }
]

const inputEvents: ApiEvent[] = [
  { name: '@update:modelValue', description: 'Emitted when value changes' },
  { name: '@input', description: 'Emitted on each keystroke' },
  { name: '@change', description: 'Emitted when value changes and blurs' },
  { name: '@focus', description: 'Emitted when input is focused' },
  { name: '@blur', description: 'Emitted when input loses focus' },
  { name: '@clear', description: 'Emitted when clear button is clicked' },
  { name: '@enter', description: 'Emitted when Enter key is pressed' },
  { name: '@validate', description: 'Emitted after validation runs' }
]

const inputSlots: ApiSlot[] = [
  { name: 'prefix', description: 'Custom prefix content (left side)' },
  { name: 'suffix', description: 'Custom suffix content (right side)' }
]

const inputMethods: ApiMethod[] = [
  { name: 'focus()', description: 'Focus the input element' },
  { name: 'blur()', description: 'Blur the input element' },
  { name: 'validate()', description: 'Manually trigger validation' }
]
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- @component SInput -->
    <!-- @props modelValue, type, variant, size, rounded, label, placeholder, labelPlacement, iconLeft, iconRight, prefix, suffix, disabled, readonly, loading, error, success, warning, hint, required, minLength, maxLength, pattern, validator, validateOn, clearable, showPasswordToggle, counter, rows, resize, autofocus, suggestions, showSuggestionsOnFocus, allowOnly, decimalPlaces -->
    <!-- @events @update:modelValue, @input, @change, @focus, @blur, @clear, @enter, @validate -->
    <!-- @slots prefix, suffix -->
    <!-- @sections features, basic-usage, variants, sizes, floating-labels, icons-and-affixes, validation-states, validation, advanced-features, email-autocomplete, input-filtering, real-world-examples, with-keyboard-shortcut, api-reference -->
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-(--s-text-primary) mb-2">Input</h1>
      <p class="text-lg text-(--s-text-secondary)">
        Advanced input component with morphing labels, comprehensive validation, and beautiful animations.
      </p>
    </header>

    <!-- Features -->
    <article id="features">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 rounded-xl bg-violet-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-form-textbox text-xl text-violet-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">4 Variants</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Outlined, filled, underlined, and ghost styles for any design.</p>
        </div>
        <div class="p-4 rounded-xl bg-blue-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <Sparkles class="w-5 h-5 text-blue-500" />
            <h3 class="font-semibold text-(--s-text-primary)">Morphing Labels</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Smooth floating label animations with scale and translate transitions.</p>
        </div>
        <div class="p-4 rounded-xl bg-emerald-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <ShieldCheck class="w-5 h-5 text-emerald-500" />
            <h3 class="font-semibold text-(--s-text-primary)">Advanced Validation</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Built-in validators plus custom async validation support.</p>
        </div>
        <div class="p-4 rounded-xl bg-pink-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-state-machine text-xl text-pink-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Visual States</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Error, success, warning, loading, and disabled states.</p>
        </div>
        <div class="p-4 rounded-xl bg-amber-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-shape text-xl text-amber-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Flexible Icons</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Left/right icons plus prefix and suffix text or slots.</p>
        </div>
        <div class="p-4 rounded-xl bg-cyan-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <Wrench class="w-5 h-5 text-cyan-500" />
            <h3 class="font-semibold text-(--s-text-primary)">Rich Features</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Password toggle, clearable, character counter, and more.</p>
        </div>
      </div>
    </article>

    <!-- Basic Usage -->
    <section id="basic-usage">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Basic Usage</h2>
      <DemoSection 
        title="Text Inputs"
        description="Common input types with labels and placeholders."
        :code="basicCode"
        language="vue"
      >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SInput 
            v-model="basicValue" 
            label="Username" 
            placeholder="Enter your username"
          />
          <SInput 
            v-model="emailValue" 
            type="email" 
            label="Email" 
            placeholder="name@example.com"
          />
          <SInput 
            v-model="passwordValue" 
            type="password" 
            label="Password"
            placeholder="••••••••"
            show-password-toggle
          />
        </div>
      </DemoSection>
    </section>

    <!-- Variants -->
    <section id="variants">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Variants</h2>
      <DemoSection 
        title="Input Variants"
        description="Choose from four visual styles to match your design."
        :code="variantsCode"
        language="vue"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SInput variant="outlined" label="Outlined" placeholder="Default style" />
          <SInput variant="filled" label="Filled" placeholder="Filled background" />
          <SInput variant="underlined" label="Underlined" placeholder="Minimal style" />
          <SInput variant="ghost" label="Ghost" placeholder="Transparent" />
        </div>
      </DemoSection>
    </section>

    <!-- Sizes -->
    <section id="sizes">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Sizes</h2>
      <DemoSection 
        title="Input Sizes"
        description="Three size presets for different contexts."
        :code="sizesCode"
        language="vue"
      >
        <div class="flex flex-col md:flex-row items-end gap-6">
          <SInput size="small" label="Small" placeholder="Small input" class="w-full md:w-48" />
          <SInput size="medium" label="Medium" placeholder="Medium input" class="w-full md:w-56" />
          <SInput size="large" label="Large" placeholder="Large input" class="w-full md:w-64" />
        </div>
      </DemoSection>
    </section>

    <!-- Floating Labels -->
    <section id="floating-labels">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Floating Labels</h2>
      <DemoSection 
        title="Morphing Label Animation"
        description="Labels smoothly transition from inside the input to floating above when focused."
        :code="floatingCode"
        language="vue"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <SInput 
            v-model="floatingValue" 
            label="Floating Label"
            label-placement="floating"
            placeholder="Type something..."
          />
          <SInput 
            v-model="insideValue" 
            label="Inside Label"
            label-placement="inside"
            placeholder="Focus to see animation..."
          />
        </div>
      </DemoSection>
    </section>

    <!-- Icons -->
    <section id="icons-and-affixes">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Icons & Affixes</h2>
      <DemoSection 
        title="Icons and Text Affixes"
        description="Add icons, prefix text, or suffix text to enhance inputs."
        :code="iconsCode"
        language="vue"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SInput 
            v-model="searchValue" 
            icon-left="magnify" 
            placeholder="Search..."
            clearable
          />
          <SInput 
            v-model="urlValue" 
            icon-right="link-variant" 
            label="Website" 
            placeholder="https://..."
          />
          <SInput 
            v-model="prefixValue" 
            prefix="$" 
            suffix=".00" 
            label="Price" 
            placeholder="0"
            type="number"
          />
          <SInput 
            v-model="suffixValue" 
            suffix="kg" 
            label="Weight"
            placeholder="Enter weight"
            type="number"
          />
          <SInput 
            icon-left="account" 
            icon-right="check-circle" 
            label="Username"
            placeholder="Available username"
            success
          />
          <SInput 
            icon-left="email" 
            label="Email"
            placeholder="user@example.com"
            hint="We'll never share your email"
          />
        </div>
      </DemoSection>
    </section>

    <!-- Validation States -->
    <section id="validation-states">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Validation States</h2>
      <DemoSection 
        title="Visual Feedback"
        description="Error, success, warning, and other states provide clear visual feedback."
        :code="statesCode"
        language="vue"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SInput 
            error="Invalid email address" 
            label="Email"
            value="invalid-email"
          />
          <SInput 
            success="Username is available!" 
            label="Username"
            value="john_doe"
          />
          <SInput 
            warning="Password is weak" 
            label="Password"
            type="password"
            value="123"
          />
          <SInput 
            disabled 
            model-value="Disabled input" 
            label="Disabled"
          />
          <SInput 
            readonly 
            model-value="Read-only input" 
            label="Read-only"
          />
          <SInput 
            loading 
            label="Loading"
            placeholder="Checking..."
          />
        </div>
      </DemoSection>
    </section>

    <!-- Built-in Validation -->
    <section id="validation">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Validation</h2>
      <DemoSection 
        title="Built-in & Custom Validation"
        description="Automatic validation for email, URL, min/max length, plus custom async validators."
        :code="validationCode"
        language="vue"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SInput 
            v-model="validatedEmail"
            type="email"
            label="Email (required)"
            placeholder="Enter your email"
            required
            hint="Validates email format on blur"
          />
          <SInput 
            v-model="validatedPassword"
            type="password"
            label="Password (8-20 chars)"
            placeholder="Enter password"
            :min-length="8"
            :max-length="20"
            counter
            show-password-toggle
          />
          <SInput 
            v-model="customValidated"
            label="Pattern (letters only)"
            placeholder="Only letters allowed"
            pattern="^[a-zA-Z]+$"
            hint="Uses regex pattern validation"
          />
          <SInput 
            v-model="asyncValidated"
            label="Username (async check)"
            placeholder="Try 'admin'"
            :validator="usernameValidator"
            validate-on="blur"
            hint="Simulates API validation (try 'admin')"
          />
        </div>
      </DemoSection>
    </section>

    <!-- Advanced Features -->
    <section id="advanced-features">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Advanced Features</h2>
      <DemoSection 
        title="Additional Functionality"
        description="Password toggle, clearable inputs, character counters, and textarea support."
        :code="featuresCode"
        language="vue"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SInput 
            v-model="clearableValue" 
            clearable 
            label="Clearable"
            hint="Click X to clear"
          />
          <SInput 
            v-model="counterValue" 
            :max-length="50" 
            counter 
            label="With Counter"
            placeholder="Type to see counter..."
          />
          <SInput 
            v-model="passwordValue" 
            type="password"
            show-password-toggle
            label="Password Toggle"
            placeholder="Click eye to toggle"
          />
          <SInput 
            v-model="numberValue" 
            type="number"
            :min="0"
            :max="100"
            :step="5"
            label="Number Input"
            placeholder="0-100, step 5"
          />
        </div>
        <div class="mt-6">
          <SInput 
            v-model="textareaValue"
            type="textarea"
            :rows="4"
            :max-length="200"
            counter
            label="Textarea"
            placeholder="Enter a longer message..."
          />
        </div>
      </DemoSection>
    </section>

    <!-- Email Suggestions -->
    <section id="email-autocomplete">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Email Autocomplete</h2>
      <DemoSection 
        title="Email Suggestions"
        description="Auto-suggest popular email domains as you type. Press Tab to accept the first suggestion or use arrow keys to navigate."
        :code="`<SInput
  v-model='email'
  type='email'
  label='Email Address'
  :suggestions='emailSuggestions'
  placeholder='Type @ to see suggestions'
  icon-left='email'
  hint='Type your email and see suggestions after @'
/>`"
        language="vue"
      >
        <div class="max-w-md mx-auto">
          <SInput 
            v-model="emailWithSuggestions"
            type="email"
            label="Email Address"
            :suggestions="emailSuggestions"
            placeholder="Type @ to see suggestions"
            icon-left="email"
            hint="Type your email and see suggestions after @"
          />
        </div>
      </DemoSection>
    </section>

    <!-- Input Filtering -->
    <section id="input-filtering">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Input Filtering</h2>
      <DemoSection 
        title="Character Restrictions"
        description="Restrict input to only specific characters. Invalid characters are blocked as you type."
        :code="`<!-- Digits only -->
<SInput v-model='value' allow-only='digits' label='Digits Only' placeholder='Only 0-9 allowed' hint='Try typing letters' />

<!-- Letters only -->
<SInput v-model='value' allow-only='letters' label='Letters Only' placeholder='Only a-z allowed' hint='Try typing numbers' />

<!-- Float with 2 decimal places -->
<SInput v-model='value' allow-only='digits' :decimal-places='2' label='Price (2 decimals)' placeholder='0.00' prefix='$' hint='Max 2 decimal places' />`"
        language="vue"
      >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SInput 
            v-model="digitsOnly"
            allow-only="digits"
            label="Digits Only"
            placeholder="Only 0-9 allowed"
            hint="Try typing letters"
          />
          <SInput 
            v-model="lettersOnly"
            allow-only="letters"
            label="Letters Only"
            placeholder="Only a-z allowed"
            hint="Try typing numbers"
          />
          <SInput 
            v-model="floatValue"
            allow-only="digits"
            :decimal-places="2"
            label="Price (2 decimals)"
            placeholder="0.00"
            prefix="$"
            hint="Max 2 decimal places"
          />
        </div>
      </DemoSection>
    </section>

    <!-- Real-world Examples -->
    <section id="real-world-examples">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Real-world Examples</h2>
      <DemoSection 
        title="Login Form"
        description="A complete login form example."
        :code="`<SInput v-model='email' type='email' label='Email' placeholder='you@example.com' icon-left='email' required />
<SInput v-model='password' type='password' label='Password' placeholder='••••••••' icon-left='lock' show-password-toggle required />
<SButton block>Sign In</SButton>`"
        language="vue"
      >
        <div class="max-w-md mx-auto space-y-4">
          <SInput 
            v-model="loginEmail"
            type="email"
            label="Email"
            placeholder="you@example.com"
            icon-left="email"
            required
          />
          <SInput 
            v-model="loginPassword"
            type="password"
            label="Password"
            placeholder="••••••••"
            icon-left="lock"
            show-password-toggle
            required
          />
          <SButton block class="mt-6">Sign In</SButton>
        </div>
      </DemoSection>

      <div class="mt-8">
        <DemoSection 
          title="Search Bar"
          description="A search input with icon and clear button."
          :code="`<SInput v-model='query' icon-left='magnify' placeholder='Search anything...' clearable variant='filled' rounded='full' size='large' />`"
          language="vue"
        >
          <div class="max-w-lg mx-auto">
            <SInput 
              v-model="searchQuery"
              icon-left="magnify"
              placeholder="Search anything..."
              clearable
              variant="filled"
              rounded="full"
              size="large"
            />
          </div>
        </DemoSection>
      </div>

      <div class="mt-8">
        <DemoSection 
          title="Credit Card Input"
          description="Formatted credit card input with prefix icon."
          :code="`<SInput v-model='cardNumber' icon-left='credit-card' placeholder='4242 4242 4242 4242' label='Card Number' :max-length='19' counter />`"
          language="vue"
        >
          <div class="max-w-md mx-auto">
            <SInput 
              v-model="creditCard"
              icon-left="credit-card"
              placeholder="4242 4242 4242 4242"
              label="Card Number"
              :max-length="19"
              counter
            />
          </div>
        </DemoSection>
      </div>
    </section>

    <!-- With Keyboard Shortcut -->
    <section id="with-keyboard-shortcut">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">With Keyboard Shortcut</h2>
      <DemoSection
        title="Search with Shortcut Hint"
        description="Overlay an SKbdShortcut on top of an input to indicate a keyboard shortcut."
        :code="kbdSearchCode"
        language="vue"
      >
        <div class="max-w-md">
          <SInput placeholder="Search..." iconLeft="magnify">
            <template #suffix>
              <SKbdShortcut :keys="['⌘', 'K']" size="xs" variant="flat" />
            </template>
          </SInput>
        </div>
      </DemoSection>
    </section>

    <!-- API Reference -->
    <section id="api-reference">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">API Reference</h2>
      
      <SApiSection title="SInput">
        <SApiTable title="Props" :props="inputProps" type="props" />
        <SApiTable title="Events" :events="inputEvents" type="events" />
        <SApiTable title="Slots" :slots="inputSlots" type="slots" />
        <SApiTable title="Methods" :methods="inputMethods" type="methods" />
      </SApiSection>
    </section>
  </div>
</template>
