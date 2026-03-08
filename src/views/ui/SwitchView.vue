<script setup lang="ts">
import { ref, computed } from 'vue'
import { SSwitch, SApiSection, SApiTable } from '../../index'
import type { ApiProp, ApiEvent, ApiSlot } from '../../index'
import DemoSection from '../../components/DemoSection.vue'
import { useCustomizer } from '../../composables/useCustomizer'
import { iconToCode, getLucideImportName, lucideImportStatement } from '../../lib/iconMap'

const { ri, iconPack } = useCustomizer()

const cv = (mdiName: string) => iconToCode(mdiName, iconPack.value)
const cp = (mdiName: string, attr = 'icon') => {
  if (iconPack.value === 'mdi') return `${attr}="${mdiName}"`
  const name = getLucideImportName(mdiName)
  return name ? `:icon="${name}"` : `${attr}="${mdiName}"`
}
const li = (...mdiNames: string[]) => {
  if (iconPack.value === 'mdi') return ''
  return '\n' + lucideImportStatement(mdiNames)
}

// State for demos
const basicSwitch = ref(false)
const sizeSmall = ref(false)
const sizeMedium = ref(true)
const sizeLarge = ref(false)
const outsetSmall = ref(false)
const outsetMedium = ref(true)
const outsetLarge = ref(false)
const colorSwitch1 = ref(true)
const colorSwitch2 = ref(true)
const colorSwitch3 = ref(true)
const labelSwitch = ref(false)
const labelBothSwitch = ref(true)
const iconSwitch = ref(false)
const disabledOff = ref(false)
const disabledOn = ref(true)
const loadingSwitch = ref(false)
const customValue = ref<string>('inactive')
const settingsNotifications = ref(true)
const settingsDarkMode = ref(false)
const settingsAutoSave = ref(true)
const trackTextSwitch = ref(false)
const trackTextSwitch2 = ref(true)
const customIconSwitch = ref(false)
const customIconSwitch2 = ref(true)

// Code snippets
const basicCode = `<script setup>
import { ref } from 'vue'
const isEnabled = ref(false)
<\/script>

<template>
  <SSwitch v-model="isEnabled" />
</template>`

const sizesCode = `<SSwitch v-model="small" size="small" />
<SSwitch v-model="medium" size="medium" />
<SSwitch v-model="large" size="large" />`

const typesCode = `<!-- Inset (default) -->
<SSwitch v-model="value" type="inset" size="small" />
<SSwitch v-model="value" type="inset" size="medium" />
<SSwitch v-model="value" type="inset" size="large" />

<!-- Outset - thumb larger than track -->
<SSwitch v-model="value" type="outset" size="small" />
<SSwitch v-model="value" type="outset" size="medium" />
<SSwitch v-model="value" type="outset" size="large" />`

const colorsCode = `<SSwitch v-model="switch1" color="#3b82f6" />
<SSwitch v-model="switch2" color="#ec4899" />
<SSwitch v-model="switch3" color="#f59e0b" />`

const labelsCode = `<SSwitch v-model="value" label-after="Enable notifications" />
<SSwitch 
  v-model="value" 
  label-before="Off" 
  label-after="On" 
/>`

const iconsCode = computed(() => `<script setup>${li('check', 'close')}
<\/script>

<template>
  <!-- Using icon names -->
  <SSwitch
    v-model="value"
    ${cp('check', 'checked-icon')}
    ${cp('close', 'unchecked-icon')}
    size="large"
  />

  <!-- Using custom content via slots -->
  <SSwitch v-model="value" size="large">
    <template #checked-icon>🤔</template>
    <template #unchecked-icon>➡️</template>
  </SSwitch>

  <!-- Emoji icons with custom color -->
  <SSwitch v-model="value" size="large" color="#f59e0b">
    <template #checked-icon>☀️</template>
    <template #unchecked-icon>🌙</template>
  </SSwitch>
</template>`)

const trackTextCode = `<!-- Text inside track -->
<SSwitch
  v-model="value"
  checked-text="ON"
  unchecked-text="OFF"
  color="#3b82f6"
/>

<SSwitch
  v-model="value"
  checked-text="Checked"
  unchecked-text="Unchecked"
  color="#10b981"
/>`

const statesCode = `<SSwitch v-model="disabledOff" disabled />
<SSwitch v-model="disabledOn" disabled />
<SSwitch v-model="loadingSwitch" loading />`

const customValuesCode = `<script setup>
const status = ref('inactive')
<\/script>

<template>
  <SSwitch
    v-model="status"
    checked-value="active"
    unchecked-value="inactive"
    color="#8b5cf6"
  />
</template>`

const realWorldCode = computed(() => `<script setup>${li('weather-night', 'weather-sunny')}
<\/script>

<template>
  <div class="settings-panel">
    <SSwitch
      v-model="notifications"
      label-after="Push Notifications"
      color="#10b981"
    />
    <SSwitch
      v-model="darkMode"
      label-after="Dark Mode"
      ${cp('weather-night', 'checked-icon')}
      ${cp('weather-sunny', 'unchecked-icon')}
    />
    <SSwitch
      v-model="autoSave"
      label-after="Auto-save documents"
      color="#3b82f6"
    />
  </div>
</template>`)
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- @component SSwitch -->
    <!-- @props modelValue, type, size, color, disabled, loading, checkedValue, uncheckedValue, labelBefore, labelAfter, checkedIcon, uncheckedIcon, checkedText, uncheckedText -->
    <!-- @events update:modelValue, change -->
    <!-- @slots checked-icon, unchecked-icon -->
    <!-- @sections features, basic-usage, sizes, types, colors, labels, icons, track-text, states, custom-values, real-world-example, api-reference -->
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-(--s-text-primary) mb-2">Switch</h1>
      <p class="text-lg text-(--s-text-secondary)">A toggle switch for binary on/off states with rich customization options.</p>
    </header>

    <!-- Features -->
    <article id="features" class="space-y-4">
      <h2 class="text-2xl font-bold text-(--s-text-primary)">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 rounded-xl bg-emerald-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-toggle-switch text-2xl text-emerald-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Two Visual Types</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Inset (thumb inside track) and outset (thumb extends beyond) styles.</p>
        </div>
        <div class="p-4 rounded-xl bg-blue-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-format-text text-2xl text-blue-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Track Text</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Display ON/OFF or custom text inside the switch track.</p>
        </div>
        <div class="p-4 rounded-xl bg-rose-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-emoticon text-2xl text-rose-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Custom Icons</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Icons or emoji in the thumb via props or slots for checked/unchecked states.</p>
        </div>
        <div class="p-4 rounded-xl bg-violet-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-code-braces text-2xl text-violet-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Custom Values</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Use any values (strings, numbers) instead of boolean true/false.</p>
        </div>
        <div class="p-4 rounded-xl bg-amber-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-label-outline text-2xl text-amber-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Flexible Labels</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Add labels before and/or after the switch for better context.</p>
        </div>
        <div class="p-4 rounded-xl bg-cyan-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-keyboard text-2xl text-cyan-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Keyboard Support</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Full keyboard accessibility with Space and Enter to toggle.</p>
        </div>
      </div>
    </article>

    <!-- Basic Usage -->
    <section id="basic-usage">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Basic Usage</h2>
      <DemoSection 
        title="Simple Toggle"
        description="The most basic switch with v-model binding for two-way data flow."
        :code="basicCode"
        language="vue"
      >
        <div class="flex items-center gap-6">
          <SSwitch v-model="basicSwitch" />
          <span class="text-sm text-(--s-text-secondary)">
            Value: <code class="font-mono text-emerald-400">{{ basicSwitch }}</code>
          </span>
        </div>
      </DemoSection>
    </section>

    <!-- Sizes -->
    <section id="sizes">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Sizes</h2>
      <DemoSection 
        title="Switch Sizes"
        description="Three size variants: small, medium (default), and large."
        :code="sizesCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-8 items-center">
          <div class="flex flex-col items-center gap-3">
            <SSwitch v-model="sizeSmall" size="small" />
            <span class="text-xs font-mono text-(--s-text-secondary)">small</span>
          </div>
          <div class="flex flex-col items-center gap-3">
            <SSwitch v-model="sizeMedium" size="medium" />
            <span class="text-xs font-mono text-(--s-text-secondary)">medium</span>
          </div>
          <div class="flex flex-col items-center gap-3">
            <SSwitch v-model="sizeLarge" size="large" />
            <span class="text-xs font-mono text-(--s-text-secondary)">large</span>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Types -->
    <section id="types">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Types</h2>
      <DemoSection 
        title="Inset &amp; Outset"
        description="Two visual types: inset (thumb inside track) and outset (thumb extends beyond track)."
        :code="typesCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-12 items-center">
          <div class="flex flex-col gap-4">
            <span class="text-sm font-semibold text-(--s-text-primary)">Inset (default)</span>
            <div class="flex flex-wrap gap-6 items-center">
              <div class="flex flex-col items-center gap-3">
                <SSwitch v-model="sizeSmall" type="inset" size="small" />
                <span class="text-xs font-mono text-(--s-text-secondary)">small</span>
              </div>
              <div class="flex flex-col items-center gap-3">
                <SSwitch v-model="sizeMedium" type="inset" size="medium" />
                <span class="text-xs font-mono text-(--s-text-secondary)">medium</span>
              </div>
              <div class="flex flex-col items-center gap-3">
                <SSwitch v-model="sizeLarge" type="inset" size="large" />
                <span class="text-xs font-mono text-(--s-text-secondary)">large</span>
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-4">
            <span class="text-sm font-semibold text-(--s-text-primary)">Outset</span>
            <div class="flex flex-wrap gap-6 items-center">
              <div class="flex flex-col items-center gap-3">
                <SSwitch v-model="outsetSmall" type="outset" size="small" />
                <span class="text-xs font-mono text-(--s-text-secondary)">small</span>
              </div>
              <div class="flex flex-col items-center gap-3">
                <SSwitch v-model="outsetMedium" type="outset" size="medium" />
                <span class="text-xs font-mono text-(--s-text-secondary)">medium</span>
              </div>
              <div class="flex flex-col items-center gap-3">
                <SSwitch v-model="outsetLarge" type="outset" size="large" />
                <span class="text-xs font-mono text-(--s-text-secondary)">large</span>
              </div>
            </div>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Colors -->
    <section id="colors">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Colors</h2>
      <DemoSection 
        title="Custom Colors"
        description="Customize the active color with any valid CSS color value."
        :code="colorsCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-8 items-center">
          <div class="flex flex-col items-center gap-3">
            <SSwitch v-model="colorSwitch1" color="#3b82f6" />
            <span class="text-xs font-mono text-(--s-text-secondary)">Blue</span>
          </div>
          <div class="flex flex-col items-center gap-3">
            <SSwitch v-model="colorSwitch2" color="#ec4899" />
            <span class="text-xs font-mono text-(--s-text-secondary)">Pink</span>
          </div>
          <div class="flex flex-col items-center gap-3">
            <SSwitch v-model="colorSwitch3" color="#f59e0b" />
            <span class="text-xs font-mono text-(--s-text-secondary)">Amber</span>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Labels -->
    <section id="labels">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Labels</h2>
      <DemoSection 
        title="With Labels"
        description="Add text labels before and/or after the switch for better context."
        :code="labelsCode"
        language="vue"
      >
        <div class="flex flex-col gap-6">
          <SSwitch v-model="labelSwitch" label-after="Enable notifications" />
          <SSwitch v-model="labelBothSwitch" label-before="Off" label-after="On" />
        </div>
      </DemoSection>
    </section>

    <!-- Icons -->
    <section id="icons">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Icons</h2>
      <DemoSection 
        title="With Icons"
        description="Display icons inside the toggle thumb using icon names or custom content via slots."
        :code="iconsCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-8 items-center">
          <div class="flex flex-col items-center gap-3">
            <SSwitch
              v-model="iconSwitch"
              :checked-icon="ri('check')"
              :unchecked-icon="ri('close')"
              size="large"
            />
            <span class="text-xs font-mono text-(--s-text-secondary)">Icon props</span>
          </div>
          <div class="flex flex-col items-center gap-3">
            <SSwitch 
              v-model="customIconSwitch" 
              size="large"
            >
              <template #checked-icon>🤔</template>
              <template #unchecked-icon>➡️</template>
            </SSwitch>
            <span class="text-xs font-mono text-(--s-text-secondary)">Custom slots</span>
          </div>
          <div class="flex flex-col items-center gap-3">
            <SSwitch 
              v-model="customIconSwitch2" 
              size="large"
              color="#f59e0b"
            >
              <template #checked-icon>☀️</template>
              <template #unchecked-icon>🌙</template>
            </SSwitch>
            <span class="text-xs font-mono text-(--s-text-secondary)">Emoji icons</span>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Track Text -->
    <section id="track-text">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Track Text</h2>
      <DemoSection 
        title="Text Inside Track"
        description="Display text inside the switch track for ON/OFF or custom labels."
        :code="trackTextCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-8 items-center">
          <div class="flex flex-col items-center gap-3">
            <SSwitch 
              v-model="trackTextSwitch" 
              checked-text="ON"
              unchecked-text="OFF"
              color="#3b82f6"
            />
            <span class="text-xs font-mono text-(--s-text-secondary)">ON/OFF</span>
          </div>
          <div class="flex flex-col items-center gap-3">
            <SSwitch 
              v-model="trackTextSwitch2" 
              checked-text="Checked"
              unchecked-text="Unchecked"
              color="#10b981"
            />
            <span class="text-xs font-mono text-(--s-text-secondary)">Custom text</span>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Disabled & Loading -->
    <section id="states">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">States</h2>
      <DemoSection 
        title="Disabled & Loading"
        description="Switches can be disabled or show a loading state."
        :code="statesCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-8 items-center">
          <div class="flex flex-col items-center gap-3">
            <SSwitch v-model="disabledOff" disabled />
            <span class="text-xs font-mono text-(--s-text-secondary)">Disabled Off</span>
          </div>
          <div class="flex flex-col items-center gap-3">
            <SSwitch v-model="disabledOn" disabled />
            <span class="text-xs font-mono text-(--s-text-secondary)">Disabled On</span>
          </div>
          <div class="flex flex-col items-center gap-3">
            <SSwitch v-model="loadingSwitch" loading />
            <span class="text-xs font-mono text-(--s-text-secondary)">Loading</span>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Custom Values -->
    <section id="custom-values">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Custom Values</h2>
      <DemoSection 
        title="Non-Boolean Values"
        description="Use custom checked/unchecked values instead of true/false."
        :code="customValuesCode"
        language="vue"
      >
        <div class="flex items-center gap-6">
          <SSwitch 
            v-model="customValue" 
            checked-value="active"
            unchecked-value="inactive"
            color="#8b5cf6"
          />
          <span class="text-sm text-(--s-text-secondary)">
            Status: <code class="font-mono text-violet-400">{{ customValue }}</code>
          </span>
        </div>
      </DemoSection>
    </section>

    <!-- Real-world Example -->
    <section id="real-world-example">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Real-World Example</h2>
      <DemoSection 
        title="Settings Panel"
        description="A typical settings panel with multiple switch options."
        :code="realWorldCode"
        language="vue"
      >
        <div class="p-6 rounded-xl bg-(--s-bg-primary) border border-(--s-border) max-w-md space-y-5">
          <h3 class="font-semibold text-(--s-text-primary) mb-4">Preferences</h3>
          <div>
            <SSwitch 
              v-model="settingsNotifications" 
              label-after="Push Notifications"
              color="#10b981"
            />
          </div>
          <div>
            <SSwitch
              v-model="settingsDarkMode"
              label-after="Dark Mode"
              :checked-icon="ri('weather-night')"
              :unchecked-icon="ri('weather-sunny')"
            />
          </div>
          <div>
            <SSwitch 
              v-model="settingsAutoSave" 
              label-after="Auto-save documents"
              color="#3b82f6"
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
        :props="([
          { name: 'modelValue', type: 'boolean | string | number', default: 'false', description: 'v-model binding value', category: 'Core' },
          { name: 'type', type: '\'inset\' | \'outset\'', default: '\'inset\'', description: 'Visual style: inset (thumb inside) or outset (thumb extends)', category: 'Appearance' },
          { name: 'size', type: '\'small\' | \'medium\' | \'large\'', default: '\'medium\'', description: 'Switch size', category: 'Appearance' },
          { name: 'color', type: 'string', default: 'var(--s-primary)', description: 'Active state color', category: 'Appearance' },
          { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable interaction', category: 'State' },
          { name: 'loading', type: 'boolean', default: 'false', description: 'Show loading spinner', category: 'State' },
          { name: 'checkedValue', type: 'any', default: 'true', description: 'Value when checked', category: 'Custom Values' },
          { name: 'uncheckedValue', type: 'any', default: 'false', description: 'Value when unchecked', category: 'Custom Values' },
          { name: 'labelBefore', type: 'string', default: 'undefined', description: 'Label text before switch', category: 'Labels' },
          { name: 'labelAfter', type: 'string', default: 'undefined', description: 'Label text after switch', category: 'Labels' },
          { name: 'checkedIcon', type: 'string', default: 'undefined', description: 'MDI icon name for checked state', category: 'Icons & Track Text' },
          { name: 'uncheckedIcon', type: 'string', default: 'undefined', description: 'MDI icon name for unchecked state', category: 'Icons & Track Text' },
          { name: 'checkedText', type: 'string', default: 'undefined', description: 'Text inside track when checked', category: 'Icons & Track Text' },
          { name: 'uncheckedText', type: 'string', default: 'undefined', description: 'Text inside track when unchecked', category: 'Icons & Track Text' }
        ] as ApiProp[])"
      />

      <SApiTable
        title="Events"
        type="events"
        :events="([
          { name: 'update:modelValue', payload: 'boolean | string | number', description: 'Emitted when value changes (for v-model)' },
          { name: 'change', payload: 'boolean | string | number', description: 'Emitted when value changes' }
        ] as ApiEvent[])"
      />

      <SApiTable
        title="Slots"
        type="slots"
        :slots="([
          { name: 'checked-icon', props: '-', description: 'Custom content for checked state icon' },
          { name: 'unchecked-icon', props: '-', description: 'Custom content for unchecked state icon' }
        ] as ApiSlot[])"
      />
    </SApiSection>
  </div>
</template>
