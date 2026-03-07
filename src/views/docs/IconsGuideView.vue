<script setup lang="ts">
import { SApiSection } from '../../index'
import DemoSection from '../../components/DemoSection.vue'

const mdiExampleCode = `<template>
  <SButton iconLeft="home">Home</SButton>
  <SButton iconLeft="magnify" iconRight="chevron-down">Search</SButton>
  <SAlert icon="alert" title="Heads up!" description="Something happened." />
</template>`

const componentExampleCode = `<script setup>
import { Search, Heart, ChevronDown } from 'lucide-vue-next'
<\/script>

<template>
  <SButton :iconLeft="Search">Search</SButton>
  <SButton :iconLeft="Search" :iconRight="ChevronDown">Search</SButton>
  <SAlert :icon="Heart" title="Loved!" description="You liked this item." />
</template>`

const iconPropCode = `import type { Component } from 'vue'

// Accepts both MDI string names and Vue component icons
export type IconProp = string | Component

// Helper to check if an icon is a Vue component
export function isIconComponent(icon: IconProp): icon is Component {
  return typeof icon !== 'string'
}`

const iconComponents = [
  { component: 'SButton', props: 'iconLeft, iconRight' },
  { component: 'SGlassButton', props: 'iconLeft, iconRight' },
  { component: 'SInput', props: 'iconLeft, iconRight' },
  { component: 'SAlert', props: 'icon' },
  { component: 'SSelect', props: 'arrowIcon, option.icon' },
  { component: 'SDropdown', props: 'icon' },
  { component: 'SDropdownItem', props: 'icon, trailingIcon' },
  { component: 'SDropdownGroup', props: 'icon' },
  { component: 'SOption', props: 'icon' },
  { component: 'SAccordionItem', props: 'icon, expandIcon' },
  { component: 'SSwitch', props: 'checkedIcon, uncheckedIcon' },
  { component: 'SCheckbox', props: 'icon' },
  { component: 'SRadio', props: 'icon' },
  { component: 'STabs', props: 'pane icon' },
  { component: 'SCardHeader', props: 'icon' },
  { component: 'SDrawerClose', props: 'icon' },
]

const sIconCode = `<!-- MDI icon via slot -->
<SIcon name="home" />

<!-- Vue component icon via prop -->
<SIcon :component="Search" />

<!-- With custom size -->
<SIcon name="alert" class="text-2xl" />`
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-12">
    <!-- Page Header -->
    <div>
      <h1 class="text-4xl font-bold text-foreground mb-3">Icons Guide</h1>
      <p class="text-lg text-muted-foreground">
        How to use icons in Saka UI components. Supports both MDI font icons (string names) and Vue component icons (Lucide, Heroicons, Phosphor, etc.).
      </p>
    </div>

    <!-- Overview -->
    <SApiSection title="Overview" id="overview">
      <div class="space-y-4 text-muted-foreground">
        <p>
          Saka UI supports two icon approaches that can be used interchangeably across all components:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-muted rounded-xl p-4 border border-border">
            <div class="font-semibold text-foreground mb-1">MDI Font Icons (String)</div>
            <p class="text-sm">Pass the icon name as a string. Requires the <code class="text-xs bg-accent px-1 py-0.5 rounded">@mdi/font</code> package.</p>
          </div>
          <div class="bg-muted rounded-xl p-4 border border-border">
            <div class="font-semibold text-foreground mb-1">Vue Component Icons</div>
            <p class="text-sm">Import and bind a Vue component directly. Works with any icon library that exports Vue components.</p>
          </div>
        </div>
        <p>
          All components with icon props accept both formats via the <code class="text-xs bg-accent px-1 py-0.5 rounded">IconProp</code> type (<code class="text-xs bg-accent px-1 py-0.5 rounded">string | Component</code>).
        </p>
      </div>
    </SApiSection>

    <!-- MDI Icons -->
    <SApiSection title="MDI Icons (String)" id="mdi-icons">
      <div class="space-y-4 text-muted-foreground">
        <p>
          Pass the icon name as a plain string. Saka UI will render it using the <code class="text-xs bg-accent px-1 py-0.5 rounded">mdi-{name}</code> class from the <code class="text-xs bg-accent px-1 py-0.5 rounded">@mdi/font</code> package.
        </p>
        <p>
          Install the MDI font if you haven't already:
        </p>
        <div class="bg-accent rounded-lg p-4 font-mono text-sm text-foreground">
          npm install @mdi/font
        </div>
        <p class="text-sm">
          Then import it in your entry file: <code class="text-xs bg-accent px-1 py-0.5 rounded">import '@mdi/font/css/materialdesignicons.css'</code>
        </p>
      </div>
    </SApiSection>

    <DemoSection title="MDI Icon Examples" :code="mdiExampleCode" language="vue" code-only />

    <!-- Component Icons -->
    <SApiSection title="Component Icons (Lucide, etc.)" id="component-icons">
      <div class="space-y-4 text-muted-foreground">
        <p>
          Import the icon component from your preferred library and pass it directly using <code class="text-xs bg-accent px-1 py-0.5 rounded">v-bind</code> (the colon prefix). This works with any Vue icon component library:
        </p>
        <ul class="list-disc list-inside space-y-1 text-sm">
          <li><code class="text-xs bg-accent px-1 py-0.5 rounded">lucide-vue-next</code></li>
          <li><code class="text-xs bg-accent px-1 py-0.5 rounded">@heroicons/vue</code></li>
          <li><code class="text-xs bg-accent px-1 py-0.5 rounded">@phosphor-icons/vue</code></li>
          <li>Any custom SVG component</li>
        </ul>
      </div>
    </SApiSection>

    <DemoSection title="Component Icon Examples" :code="componentExampleCode" language="vue" code-only />

    <!-- IconProp Type -->
    <SApiSection title="IconProp Type" id="icon-prop-type">
      <div class="space-y-4 text-muted-foreground">
        <p>
          The <code class="text-xs bg-accent px-1 py-0.5 rounded">IconProp</code> type is defined in <code class="text-xs bg-accent px-1 py-0.5 rounded">~/lib/icon</code> and exported from <code class="text-xs bg-accent px-1 py-0.5 rounded">@sakoa/ui</code>. It accepts either a string (MDI name) or a Vue <code class="text-xs bg-accent px-1 py-0.5 rounded">Component</code>.
        </p>
        <p>
          The <code class="text-xs bg-accent px-1 py-0.5 rounded">isIconComponent()</code> helper function is available for custom components that need to detect which icon type was passed and render accordingly.
        </p>
      </div>
    </SApiSection>

    <DemoSection title="IconProp Definition" :code="iconPropCode" language="typescript" code-only />

    <!-- Components Supporting Icons -->
    <SApiSection title="Components Supporting Icons" id="components-supporting-icons">
      <p class="text-muted-foreground mb-6">
        The following components accept icon props. All props use the <code class="text-xs bg-accent px-1 py-0.5 rounded">IconProp</code> type and support both string and component icons.
      </p>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-border">
              <th class="text-left py-3 px-2 text-foreground font-semibold">Component</th>
              <th class="text-left py-3 px-2 text-foreground font-semibold">Icon Props</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in iconComponents" :key="item.component" class="border-b border-border/50">
              <td class="py-2.5 px-2 font-mono text-xs text-foreground">{{ item.component }}</td>
              <td class="py-2.5 px-2 font-mono text-xs text-primary">{{ item.props }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </SApiSection>

    <!-- SIcon Wrapper -->
    <SApiSection title="SIcon Wrapper Component" id="sicon-wrapper">
      <div class="space-y-4 text-muted-foreground">
        <p>
          The <code class="text-xs bg-accent px-1 py-0.5 rounded">SIcon</code> component is a standalone icon wrapper that supports both rendering approaches. Use it when you need to display an icon outside of other Saka UI components.
        </p>
        <p>
          It accepts a <code class="text-xs bg-accent px-1 py-0.5 rounded">component</code> prop for Vue component icons, or a <code class="text-xs bg-accent px-1 py-0.5 rounded">name</code> prop (or default slot) for MDI font icons.
        </p>
      </div>
    </SApiSection>

    <DemoSection title="SIcon Usage" :code="sIconCode" language="vue" code-only />
  </div>
</template>
