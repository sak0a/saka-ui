<script setup lang="ts">
import { ref } from 'vue'
import { STooltip, SButton, SApiSection, SApiTable, SApiKeyboard } from '../../index'
import type { ApiProp, ApiEvent, ApiSlot, ApiMethod, KeyboardShortcut } from '../../index'
import DemoSection from '../../components/DemoSection.vue'

// State for manual tooltip demo
const manualTooltipVisible = ref(false)

// API Reference data
const tooltipProps: ApiProp[] = [
  { name: 'placement', type: 'string', default: '\'top\'', description: 'Position: top | bottom | left | right with -start/-end', category: 'Position & Trigger' },
  { name: 'trigger', type: 'string', default: '\'hover\'', description: 'Trigger type: hover | click | focus | manual', category: 'Position & Trigger' },
  { name: 'content', type: 'string', default: 'undefined', description: 'Tooltip text content', category: 'Content' },
  { name: 'showDelay', type: 'number', default: '100', description: 'Delay before showing (ms)', category: 'Timing' },
  { name: 'hideDelay', type: 'number', default: '100', description: 'Delay before hiding (ms)', category: 'Timing' },
  { name: 'offset', type: 'number', default: '8', description: 'Distance from trigger element (px)', category: 'Timing' },
  { name: 'arrow', type: 'boolean', default: 'true', description: 'Show arrow/pointer', category: 'Arrow' },
  { name: 'arrowSize', type: 'number', default: '6', description: 'Arrow size (px)', category: 'Arrow' },
  { name: 'theme', type: 'string', default: '\'dark\'', description: 'Color theme: dark | light | custom', category: 'Theming' },
  { name: 'color', type: 'string', default: 'undefined', description: 'Custom background color', category: 'Theming' },
  { name: 'textColor', type: 'string', default: 'undefined', description: 'Custom text color', category: 'Theming' },
  { name: 'maxWidth', type: 'string', default: '\'300px\'', description: 'Maximum width (CSS value)', category: 'Theming' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable tooltip', category: 'State & Behavior' },
  { name: 'visible', type: 'boolean', default: 'undefined', description: 'Manual visibility control (v-model)', category: 'State & Behavior' },
  { name: 'interactive', type: 'boolean', default: 'false', description: 'Allow hovering over tooltip', category: 'State & Behavior' },
  { name: 'teleport', type: 'string', default: '\'body\'', description: 'Teleport target selector', category: 'Advanced' },
  { name: 'zIndex', type: 'number', default: '9999', description: 'Z-index value', category: 'Advanced' },
  { name: 'transition', type: 'string', default: '\'tooltip-fade\'', description: 'Custom transition name', category: 'Advanced' }
]

const tooltipEvents: ApiEvent[] = [
  { name: '@show', payload: '-', description: 'Emitted when tooltip is shown' },
  { name: '@hide', payload: '-', description: 'Emitted when tooltip is hidden' },
  { name: '@toggle', payload: 'boolean', description: 'Emitted when visibility changes (true/false)' },
  { name: '@update:visible', payload: 'boolean', description: 'For v-model:visible support' }
]

const tooltipSlots: ApiSlot[] = [
  { name: 'default', props: '-', description: 'Trigger element content' },
  { name: 'content', props: '-', description: 'Tooltip content (for rich HTML, overrides content prop)' }
]

const tooltipMethods: ApiMethod[] = [
  { name: 'show()', description: 'Programmatically show the tooltip' },
  { name: 'hide()', description: 'Programmatically hide the tooltip' },
  { name: 'toggle()', description: 'Toggle tooltip visibility' }
]

const tooltipKeyboard: KeyboardShortcut[] = [
  { keys: 'Esc', action: 'Close tooltip' },
  { keys: 'Tab', action: 'Focus trigger (for focus trigger type)' }
]

// Code snippets
const basicUsageCode = `<STooltip content="This is a tooltip">
  <SButton>Hover me</SButton>
</STooltip>

<STooltip content="With custom color" color="#8b5cf6" theme="custom" textColor="#fff">
  <SButton variant="light">Custom color</SButton>
</STooltip>`

const placementsCode = `<!-- Main placements -->
<STooltip content="Top" placement="top">
  <SButton size="small">Top</SButton>
</STooltip>
<STooltip content="Bottom" placement="bottom">
  <SButton size="small">Bottom</SButton>
</STooltip>
<STooltip content="Left" placement="left">
  <SButton size="small">Left</SButton>
</STooltip>
<STooltip content="Right" placement="right">
  <SButton size="small">Right</SButton>
</STooltip>

<!-- Start/End variants -->
<STooltip content="Top Start" placement="top-start">
  <SButton size="small">Top Start</SButton>
</STooltip>
<STooltip content="Top End" placement="top-end">
  <SButton size="small">Top End</SButton>
</STooltip>`

const triggersCode = `<!-- Hover trigger (default) -->
<STooltip content="Hover to show" trigger="hover">
  <SButton>Hover</SButton>
</STooltip>

<!-- Click trigger -->
<STooltip content="Click to toggle" trigger="click">
  <SButton variant="outlined">Click</SButton>
</STooltip>

<!-- Focus trigger -->
<STooltip content="Focus to show" trigger="focus">
  <SButton variant="light">Focus</SButton>
</STooltip>

<!-- Manual trigger -->
<STooltip content="Controlled manually" trigger="manual" :visible="isVisible">
  <SButton variant="ghost">Manual</SButton>
</STooltip>`

const delaysCode = `<!-- Fast (no delay) -->
<STooltip content="Instant tooltip" :show-delay="0" :hide-delay="0">
  <SButton>Instant</SButton>
</STooltip>

<!-- Default delays -->
<STooltip content="Default delays (100ms)">
  <SButton>Default</SButton>
</STooltip>

<!-- Slow delays -->
<STooltip content="Slow tooltip" :show-delay="500" :hide-delay="300">
  <SButton>Slow</SButton>
</STooltip>`

const themesCode = `<!-- Dark theme (default) -->
<STooltip content="Dark theme" theme="dark">
  <SButton>Dark</SButton>
</STooltip>

<!-- Light theme -->
<STooltip content="Light theme" theme="light">
  <SButton variant="outlined">Light</SButton>
</STooltip>

<!-- Custom theme -->
<STooltip 
  content="Custom colors" 
  theme="custom"
  color="#8b5cf6"
  text-color="#ffffff"
>
  <SButton variant="light" color="#8b5cf6">Custom</SButton>
</STooltip>`

const arrowCode = `<!-- With arrow (default) -->
<STooltip content="With arrow" :arrow="true">
  <SButton>With Arrow</SButton>
</STooltip>

<!-- Without arrow -->
<STooltip content="No arrow" :arrow="false">
  <SButton variant="outlined">No Arrow</SButton>
</STooltip>

<!-- Large arrow -->
<STooltip content="Large arrow" :arrow-size="10">
  <SButton variant="light">Large Arrow</SButton>
</STooltip>`

const maxWidthCode = `<!-- Default max-width (300px) -->
<STooltip content="This is a tooltip with the default maximum width of 300 pixels. It will wrap to multiple lines when the content exceeds this width.">
  <SButton>Default Width</SButton>
</STooltip>

<!-- Custom max-width -->
<STooltip 
  content="Narrow tooltip with custom max-width" 
  max-width="150px"
>
  <SButton variant="outlined">Narrow (150px)</SButton>
</STooltip>

<STooltip 
  content="This is a very wide tooltip that can display much more content on a single line before wrapping." 
  max-width="500px"
>
  <SButton variant="light">Wide (500px)</SButton>
</STooltip>`

const richContentCode = `<STooltip placement="right">
  <template #content>
    <div class="space-y-2">
      <div class="font-semibold text-emerald-400">Rich Content</div>
      <div class="text-sm">You can use <strong>HTML</strong> and <em>formatting</em>!</div>
      <div class="flex gap-2 mt-2">
        <span class="px-2 py-1 bg-white/10 rounded text-xs">Tag 1</span>
        <span class="px-2 py-1 bg-white/10 rounded text-xs">Tag 2</span>
      </div>
    </div>
  </template>
  <SButton iconLeft="information">Rich Content</SButton>
</STooltip>`

const interactiveCode = `<STooltip :interactive="true" trigger="hover" :hide-delay="200">
  <template #content>
    <div class="space-y-2">
      <div class="font-semibold">Interactive Tooltip</div>
      <div class="text-sm">You can hover over this tooltip!</div>
      <button class="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm mt-2 transition-colors">
        Click me
      </button>
    </div>
  </template>
  <SButton iconLeft="cursor-default-click">Interactive</SButton>
</STooltip>`

const disabledCode = `<!-- Disabled tooltip -->
<STooltip content="You won't see this" :disabled="true">
  <SButton disabled>Disabled Tooltip</SButton>
</STooltip>

<!-- Enabled for comparison -->
<STooltip content="This one works">
  <SButton>Enabled Tooltip</SButton>
</STooltip>`

const advancedCode = `<!-- User profile preview -->
<STooltip 
  placement="right" 
  :interactive="true"
  max-width="250px"
  theme="light"
  :show-delay="300"
>
  <template #content>
    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400"></div>
        <div>
          <div class="font-semibold text-gray-800">John Doe</div>
          <div class="text-xs text-gray-500">@johndoe</div>
        </div>
      </div>
      <div class="text-sm text-gray-600">Full-stack developer passionate about UI/UX</div>
    </div>
  </template>
  <SButton variant="ghost" iconOnly rounded="full">
    <span class="mdi mdi-account-circle text-2xl"></span>
  </SButton>
</STooltip>

<!-- Help tooltip -->
<STooltip 
  content="This feature helps you accomplish tasks faster by providing shortcuts"
  placement="top"
  max-width="200px"
>
  <button class="text-gray-400 hover:text-gray-600 transition-colors">
    <span class="mdi mdi-help-circle text-xl"></span>
  </button>
</STooltip>

<!-- Action confirmation -->
<STooltip 
  content="Delete this item permanently"
  theme="custom"
  color="#ef4444"
  text-color="#ffffff"
  placement="top"
>
  <SButton variant="light" color="#ef4444" iconOnly>
    <span class="mdi mdi-delete"></span>
  </SButton>
</STooltip>`
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-(--s-text-primary) mb-2">Tooltips</h1>
      <p class="text-lg text-(--s-text-secondary)">
        Advanced tooltip component with smart positioning, multiple triggers, themes, and rich content support.
      </p>
    </header>

    <!-- Features -->
    <article class="space-y-4">
      <h2 class="text-2xl font-bold text-(--s-text-primary)">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 rounded-xl bg-(--s-bg-secondary) border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-arrow-all text-2xl text-emerald-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">12 Placements</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Top, bottom, left, right with start/end alignment variants.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary) border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-gesture-tap text-2xl text-blue-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Multiple Triggers</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Hover, click, focus, or manual control for showing tooltips.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary) border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-palette-outline text-2xl text-rose-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Theme Options</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Dark, light, and fully custom color themes.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary) border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-cursor-pointer text-2xl text-violet-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Interactive Mode</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Allow users to hover over tooltip content without it closing.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary) border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-code-tags text-2xl text-amber-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Rich Content</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Use the content slot for HTML, formatting, buttons, and links.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary) border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-arrow-up-bold text-2xl text-cyan-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Arrow Customization</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Toggle arrow visibility and customize arrow size.</p>
        </div>
      </div>
    </article>

    <!-- Basic Usage -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Basic Usage</h2>
      <DemoSection 
        title="Simple Tooltips"
        description="Tooltips display helpful information when users hover over an element."
        :code="basicUsageCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-4 items-center">
          <STooltip content="This is a tooltip">
            <SButton>Hover me</SButton>
          </STooltip>
          <STooltip content="Beautiful tooltip!" theme="dark">
            <SButton variant="outlined">Dark theme</SButton>
          </STooltip>
          <STooltip content="Light and clean" theme="light">
            <SButton variant="light">Light theme</SButton>
          </STooltip>
          <STooltip content="Custom styled!" color="#8b5cf6" theme="custom" text-color="#fff">
            <SButton variant="ghost">Custom color</SButton>
          </STooltip>
        </div>
      </DemoSection>
    </section>

    <!-- Placements -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Placements</h2>
      <DemoSection 
        title="Tooltip Positions"
        description="Choose from 12 different placement options. Tooltips automatically reposition if they overflow the viewport."
        :code="placementsCode"
        language="vue"
      >
        <div class="space-y-8">
          <!-- Main 4 positions -->
          <div class="flex justify-center">
            <div class="relative inline-grid grid-cols-3 gap-4 items-center justify-items-center" style="width: 400px; height: 200px;">
              <div></div>
              <STooltip content="Top placement" placement="top">
                <SButton size="small">Top</SButton>
              </STooltip>
              <div></div>
              
              <STooltip content="Left placement" placement="left">
                <SButton size="small">Left</SButton>
              </STooltip>
              <div></div>
              <STooltip content="Right placement" placement="right">
                <SButton size="small">Right</SButton>
              </STooltip>
              
              <div></div>
              <STooltip content="Bottom placement" placement="bottom">
                <SButton size="small">Bottom</SButton>
              </STooltip>
              <div></div>
            </div>
          </div>

          <!-- Start/End variants -->
          <div class="space-y-3">
            <div class="text-sm font-medium text-(--s-text-secondary) mb-3">Alignment Variants:</div>
            <div class="flex flex-wrap gap-3">
              <STooltip content="Top Start" placement="top-start">
                <SButton size="small" variant="outlined">Top Start</SButton>
              </STooltip>
              <STooltip content="Top End" placement="top-end">
                <SButton size="small" variant="outlined">Top End</SButton>
              </STooltip>
              <STooltip content="Bottom Start" placement="bottom-start">
                <SButton size="small" variant="outlined">Bottom Start</SButton>
              </STooltip>
              <STooltip content="Bottom End" placement="bottom-end">
                <SButton size="small" variant="outlined">Bottom End</SButton>
              </STooltip>
              <STooltip content="Left Start" placement="left-start">
                <SButton size="small" variant="outlined">Left Start</SButton>
              </STooltip>
              <STooltip content="Left End" placement="left-end">
                <SButton size="small" variant="outlined">Left End</SButton>
              </STooltip>
              <STooltip content="Right Start" placement="right-start">
                <SButton size="small" variant="outlined">Right Start</SButton>
              </STooltip>
              <STooltip content="Right End" placement="right-end">
                <SButton size="small" variant="outlined">Right End</SButton>
              </STooltip>
            </div>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Triggers -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Trigger Types</h2>
      <DemoSection 
        title="Activation Methods"
        description="Control how tooltips are triggered: hover, click, focus, or manual."
        :code="triggersCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-4 items-center">
          <STooltip content="Hover to show (default)" trigger="hover">
            <SButton iconLeft="cursor-default">Hover</SButton>
          </STooltip>
          <STooltip content="Click to toggle visibility" trigger="click">
            <SButton variant="outlined" iconLeft="cursor-default-click">Click</SButton>
          </STooltip>
          <STooltip content="Focus to show, blur to hide" trigger="focus">
            <SButton variant="light" iconLeft="keyboard">Focus (Tab)</SButton>
          </STooltip>
          <STooltip content="Controlled programmatically" trigger="manual" :visible="manualTooltipVisible">
            <SButton variant="ghost" @click="manualTooltipVisible = !manualTooltipVisible">
              Manual: {{ manualTooltipVisible ? 'Hide' : 'Show' }}
            </SButton>
          </STooltip>
        </div>
      </DemoSection>
    </section>

    <!-- Delays -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Show/Hide Delays</h2>
      <DemoSection 
        title="Custom Delays"
        description="Configure delays before showing and hiding tooltips."
        :code="delaysCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-4 items-center">
          <STooltip content="No delay - instant!" :show-delay="0" :hide-delay="0">
            <SButton>Instant (0ms)</SButton>
          </STooltip>
          <STooltip content="Default timing">
            <SButton variant="outlined">Default (100ms)</SButton>
          </STooltip>
          <STooltip content="Takes a moment to appear" :show-delay="500" :hide-delay="300">
            <SButton variant="light">Slow (500ms)</SButton>
          </STooltip>
          <STooltip content="Quick to show, slow to hide" :show-delay="50" :hide-delay="600">
            <SButton variant="ghost">Mixed (50/600ms)</SButton>
          </STooltip>
        </div>
      </DemoSection>
    </section>

    <!-- Themes -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Themes</h2>
      <DemoSection 
        title="Color Themes"
        description="Choose from dark, light, or create custom themes with your own colors."
        :code="themesCode"
        language="vue"
      >
        <div class="space-y-4">
          <div class="flex flex-wrap gap-3 items-center">
            <STooltip content="Dark background, white text" theme="dark">
              <SButton>Dark Theme</SButton>
            </STooltip>
            <STooltip content="Light background, dark text" theme="light">
              <SButton variant="outlined">Light Theme</SButton>
            </STooltip>
          </div>
          <div class="flex flex-wrap gap-3 items-center">
            <STooltip content="Purple custom theme" theme="custom" color="#8b5cf6" text-color="#ffffff">
              <SButton variant="light" color="#8b5cf6">Purple</SButton>
            </STooltip>
            <STooltip content="Emerald custom theme" theme="custom" color="#10b981" text-color="#ffffff">
              <SButton variant="light" color="#10b981">Emerald</SButton>
            </STooltip>
            <STooltip content="Red warning theme" theme="custom" color="#ef4444" text-color="#ffffff">
              <SButton variant="light" color="#ef4444">Red</SButton>
            </STooltip>
            <STooltip content="Cyan custom theme" theme="custom" color="#06b6d4" text-color="#ffffff">
              <SButton variant="light" color="#06b6d4">Cyan</SButton>
            </STooltip>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Arrow Styles -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Arrow Customization</h2>
      <DemoSection 
        title="Arrow Options"
        description="Control arrow visibility and size."
        :code="arrowCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-4 items-center">
          <STooltip content="Default arrow (6px)" :arrow="true">
            <SButton>Default Arrow</SButton>
          </STooltip>
          <STooltip content="No arrow at all" :arrow="false">
            <SButton variant="outlined">No Arrow</SButton>
          </STooltip>
          <STooltip content="Small arrow" :arrow-size="4">
            <SButton variant="light">Small (4px)</SButton>
          </STooltip>
          <STooltip content="Large arrow" :arrow-size="10">
            <SButton variant="ghost">Large (10px)</SButton>
          </STooltip>
        </div>
      </DemoSection>
    </section>

    <!-- Max Width -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Maximum Width</h2>
      <DemoSection 
        title="Width Control"
        description="Set maximum width for tooltip content. Long text will wrap to multiple lines."
        :code="maxWidthCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-4 items-center">
          <STooltip content="This is a tooltip with the default maximum width of 300 pixels. It will wrap to multiple lines when the content exceeds this width and creates a nicely formatted tooltip.">
            <SButton>Default (300px)</SButton>
          </STooltip>
          <STooltip 
            content="This narrow tooltip wraps early due to custom max-width setting" 
            max-width="150px"
          >
            <SButton variant="outlined">Narrow (150px)</SButton>
          </STooltip>
          <STooltip 
            content="This is a very wide tooltip that can display much more content on a single line before wrapping to the next line." 
            max-width="500px"
          >
            <SButton variant="light">Wide (500px)</SButton>
          </STooltip>
        </div>
      </DemoSection>
    </section>

    <!-- Rich Content -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Rich Content</h2>
      <DemoSection 
        title="HTML & Slots"
        description="Use the content slot to render rich HTML content, including formatting, icons, and more."
        :code="richContentCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-4 items-center">
          <STooltip placement="right" max-width="250px">
            <template #content>
              <div class="space-y-2">
                <div class="font-semibold text-emerald-400 flex items-center gap-2">
                  <span class="mdi mdi-information"></span>
                  Rich Content
                </div>
                <div class="text-sm">You can use <strong>HTML</strong> and <em>formatting</em>!</div>
                <div class="flex gap-2 mt-2">
                  <span class="px-2 py-1 bg-white/10 rounded text-xs">Feature 1</span>
                  <span class="px-2 py-1 bg-white/10 rounded text-xs">Feature 2</span>
                </div>
              </div>
            </template>
            <SButton iconLeft="information">Rich Tooltip</SButton>
          </STooltip>

          <STooltip placement="bottom" theme="light" max-width="280px">
            <template #content>
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <span class="mdi mdi-check-circle text-emerald-500 text-xl"></span>
                  <span class="font-semibold text-gray-800">Success!</span>
                </div>
                <div class="text-sm text-gray-600">
                  Your changes have been saved successfully.
                </div>
                <div class="pt-2 border-t border-gray-200">
                  <div class="text-xs text-gray-500">Last saved: 2 minutes ago</div>
                </div>
              </div>
            </template>
            <SButton variant="outlined" iconLeft="content-save">Light Theme Rich</SButton>
          </STooltip>
        </div>
      </DemoSection>
    </section>

    <!-- Interactive -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Interactive Tooltips</h2>
      <DemoSection 
        title="Hoverable Content"
        description="Enable interactive mode to allow users to hover over tooltip content without it disappearing."
        :code="interactiveCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-4 items-center">
          <STooltip :interactive="true" trigger="hover" :hide-delay="200" max-width="220px">
            <template #content>
              <div class="space-y-2">
                <div class="font-semibold">Interactive Tooltip</div>
                <div class="text-sm">Try hovering over this tooltip content!</div>
                <button 
                  class="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm mt-2 transition-colors w-full"
                  @click="() => console.log('Clicked inside tooltip!')"
                >
                  Click me
                </button>
              </div>
            </template>
            <SButton iconLeft="cursor-default-click">Interactive</SButton>
          </STooltip>

          <STooltip :interactive="true" placement="right" theme="light" max-width="200px">
            <template #content>
              <div class="space-y-2">
                <div class="font-semibold text-gray-800">Quick Links</div>
                <div class="space-y-1">
                  <a href="#" class="block text-sm text-blue-600 hover:text-blue-800 hover:underline">Documentation</a>
                  <a href="#" class="block text-sm text-blue-600 hover:text-blue-800 hover:underline">Examples</a>
                  <a href="#" class="block text-sm text-blue-600 hover:text-blue-800 hover:underline">API Reference</a>
                </div>
              </div>
            </template>
            <SButton variant="light" iconLeft="link-variant">Links</SButton>
          </STooltip>
        </div>
      </DemoSection>
    </section>

    <!-- Disabled -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Disabled State</h2>
      <DemoSection 
        title="Disabled Tooltips"
        description="Disabled tooltips won't show even when triggered."
        :code="disabledCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-4 items-center">
          <STooltip content="You won't see this tooltip" :disabled="true">
            <SButton disabled>Disabled Tooltip</SButton>
          </STooltip>
          <STooltip content="This tooltip works normally">
            <SButton>Enabled Tooltip</SButton>
          </STooltip>
        </div>
      </DemoSection>
    </section>

    <!-- Real-World Examples -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Real-World Examples</h2>
      <DemoSection 
        title="Real-World Use Cases"
        description="Combine features for practical applications."
        :code="advancedCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-6 items-center">
          <!-- User profile preview -->
          <STooltip 
            placement="right" 
            :interactive="true"
            max-width="250px"
            theme="light"
            :show-delay="300"
          >
            <template #content>
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <div class="w-10 h-10 rounded-full bg-linear-to-br from-emerald-400 to-cyan-400"></div>
                  <div>
                    <div class="font-semibold text-gray-800">John Doe</div>
                    <div class="text-xs text-gray-500">@johndoe</div>
                  </div>
                </div>
                <div class="text-sm text-gray-600">Full-stack developer passionate about beautiful UIs</div>
                <div class="flex gap-2 pt-2 border-t border-gray-200">
                  <span class="text-xs text-gray-500">✓ Verified</span>
                  <span class="text-xs text-gray-500">• 1.2k followers</span>
                </div>
              </div>
            </template>
            <button class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-(--s-bg-secondary) transition-colors">
              <span class="mdi mdi-account-circle text-2xl text-(--s-text-secondary)"></span>
              <span class="text-sm text-(--s-text-secondary)">Profile</span>
            </button>
          </STooltip>

          <!-- Help icon -->
          <STooltip 
            content="This feature helps you accomplish tasks faster by providing keyboard shortcuts and automations"
            placement="top"
            max-width="220px"
          >
            <button class="text-(--s-text-secondary) hover:text-(--s-text-primary) transition-colors">
              <span class="mdi mdi-help-circle text-xl"></span>
            </button>
          </STooltip>

          <!-- Delete action -->
          <STooltip 
            content="Delete this item permanently"
            theme="custom"
            color="#ef4444"
            text-color="#ffffff"
            placement="top"
          >
            <SButton variant="light" color="#ef4444" iconOnly size="small">
              <span class="mdi mdi-delete"></span>
            </SButton>
          </STooltip>

          <!-- Status indicator -->
          <STooltip 
            placement="bottom"
            theme="custom"
            color="#10b981"
            text-color="#ffffff"
          >
            <template #content>
              <div class="space-y-1">
                <div class="font-semibold">System Status: Operational</div>
                <div class="text-xs opacity-90">All systems running normally</div>
                <div class="text-xs opacity-75 pt-1">Last checked: Just now</div>
              </div>
            </template>
            <div class="flex items-center gap-2 cursor-pointer">
              <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span class="text-sm text-(--s-text-secondary)">Online</span>
            </div>
          </STooltip>
        </div>
      </DemoSection>
    </section>

    <!-- API Reference -->
    <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">API Reference</h2>
    <SApiSection>
      <SApiTable
        title="Props"
        type="props"
        :props="(tooltipProps as ApiProp[])"
      />

      <SApiTable
        title="Events"
        type="events"
        :events="(tooltipEvents as ApiEvent[])"
      />

      <SApiTable
        title="Slots"
        type="slots"
        :slots="(tooltipSlots as ApiSlot[])"
      />

      <SApiTable
        title="Exposed Methods"
        type="methods"
        :methods="(tooltipMethods as ApiMethod[])"
      />

      <SApiKeyboard
        :shortcuts="(tooltipKeyboard as KeyboardShortcut[])"
      />
    </SApiSection>
  </div>
</template>
