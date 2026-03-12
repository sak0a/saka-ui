<script setup lang="ts">
import { ref } from 'vue'
import { SPopover, SPopoverTrigger, SPopoverContent, SPopoverClose, SButton, SApiSection, SApiTable, SApiKeyboard } from '../../index'
import type { ApiProp, ApiEvent, ApiSlot, ApiMethod, KeyboardShortcut } from '../../index'
import DemoSection from '../../components/DemoSection.vue'

// State for interactive demo
const emailValue = ref('')

// API Reference data
const popoverProps: ApiProp[] = [
  { name: 'trigger', type: "'click' | 'hover' | 'focus' | 'manual'", default: "'click'", description: 'How the popover is triggered', category: 'Trigger' },
  { name: 'placement', type: "'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'", default: "'bottom'", description: 'Position of the popover relative to the trigger', category: 'Position' },
  { name: 'variant', type: "'default' | 'glass' | 'bordered' | 'elevated'", default: "'default'", description: 'Visual style variant', category: 'Style' },
  { name: 'animation', type: "'fade' | 'scale' | 'slide'", default: "'scale'", description: 'Animation type for show/hide', category: 'Style' },
  { name: 'rounded', type: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'", default: "'xl'", description: 'Border radius size', category: 'Style' },
  { name: 'offset', type: 'number', default: '8', description: 'Distance from trigger element (px)', category: 'Position' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevent popover from opening', category: 'State' },
  { name: 'visible', type: 'boolean', default: 'undefined', description: 'Manual visibility control (v-model)', category: 'State' },
  { name: 'teleport', type: 'boolean | string', default: 'true', description: 'Teleport target for the popover content', category: 'Advanced' },
  { name: 'zIndex', type: 'number', default: '1000', description: 'Z-index of the popover content', category: 'Advanced' },
  { name: 'showDelay', type: 'number', default: '100', description: 'Delay before showing (ms)', category: 'Timing' },
  { name: 'hideDelay', type: 'number', default: '150', description: 'Delay before hiding (ms)', category: 'Timing' },
  { name: 'closeOnClickOutside', type: 'boolean', default: 'true', description: 'Close when clicking outside the popover', category: 'Behavior' },
  { name: 'closeOnEscape', type: 'boolean', default: 'true', description: 'Close when pressing the Escape key', category: 'Behavior' },
]

const popoverEvents: ApiEvent[] = [
  { name: '@update:visible', payload: 'boolean', description: 'Emitted when visibility changes (for v-model)' },
  { name: '@open', payload: '-', description: 'Emitted when popover opens' },
  { name: '@close', payload: '-', description: 'Emitted when popover closes' },
]

const popoverSlots: ApiSlot[] = [
  { name: 'default (SPopover)', props: '-', description: 'Container for SPopoverTrigger and SPopoverContent' },
  { name: 'default (SPopoverTrigger)', props: '-', description: 'The element that triggers the popover' },
  { name: 'default (SPopoverContent)', props: '-', description: 'Content displayed inside the popover panel' },
  { name: 'default (SPopoverClose)', props: '-', description: 'Custom close button content' },
]

const popoverMethods: ApiMethod[] = [
  { name: 'open()', description: 'Programmatically open the popover' },
  { name: 'close()', description: 'Programmatically close the popover' },
  { name: 'toggle()', description: 'Toggle popover visibility' },
]

const popoverKeyboard: KeyboardShortcut[] = [
  { keys: 'Escape', action: 'Close the popover' },
  { keys: 'Enter / Space', action: 'Toggle popover when trigger is focused' },
  { keys: 'Tab', action: 'Natural focus navigation through content' },
]

// Code snippets
const basicUsageCode = `<SPopover trigger="click" placement="bottom">
  <SPopoverTrigger>
    <SButton>Click me</SButton>
  </SPopoverTrigger>
  <SPopoverContent>
    <p class="text-sm">Simple popover content.</p>
  </SPopoverContent>
</SPopover>

<SPopover trigger="click" placement="bottom">
  <SPopoverTrigger>
    <SButton variant="outlined">With Close</SButton>
  </SPopoverTrigger>
  <SPopoverContent>
    <p class="text-sm mb-3">Content with a close button.</p>
    <SPopoverClose />
  </SPopoverContent>
</SPopover>`

const triggerModesCode = `<!-- Click trigger (default) -->
<SPopover trigger="click">
  <SPopoverTrigger>
    <SButton>Click</SButton>
  </SPopoverTrigger>
  <SPopoverContent>
    <p class="text-sm">Click-triggered popover.</p>
  </SPopoverContent>
</SPopover>

<!-- Hover trigger -->
<SPopover trigger="hover">
  <SPopoverTrigger>
    <SButton variant="outlined">Hover</SButton>
  </SPopoverTrigger>
  <SPopoverContent>
    <p class="text-sm">Hover-triggered popover.</p>
  </SPopoverContent>
</SPopover>

<!-- Focus trigger -->
<SPopover trigger="focus">
  <SPopoverTrigger>
    <SButton variant="light">Focus</SButton>
  </SPopoverTrigger>
  <SPopoverContent>
    <p class="text-sm">Focus-triggered popover.</p>
  </SPopoverContent>
</SPopover>`

const placementsCode = `<SPopover placement="top">...</SPopover>
<SPopover placement="bottom">...</SPopover>
<SPopover placement="left">...</SPopover>
<SPopover placement="right">...</SPopover>
<SPopover placement="top-start">...</SPopover>
<SPopover placement="top-end">...</SPopover>
<SPopover placement="bottom-start">...</SPopover>
<SPopover placement="bottom-end">...</SPopover>`

const variantsCode = `<SPopover variant="default">...</SPopover>
<SPopover variant="glass">...</SPopover>
<SPopover variant="bordered">...</SPopover>
<SPopover variant="elevated">...</SPopover>`

const animationsCode = `<SPopover animation="fade">...</SPopover>
<SPopover animation="scale">...</SPopover>
<SPopover animation="slide">...</SPopover>`

const interactiveCode = `<SPopover trigger="click" placement="bottom">
  <SPopoverTrigger>
    <SButton>Subscribe</SButton>
  </SPopoverTrigger>
  <SPopoverContent>
    <div class="space-y-3">
      <p class="text-sm font-medium">Enter your email</p>
      <input
        type="email"
        placeholder="you@example.com"
        class="w-full px-3 py-2 rounded-lg border text-sm"
      />
      <SButton class="w-full" size="sm">Submit</SButton>
    </div>
  </SPopoverContent>
</SPopover>`

const roundedCode = `<SPopover rounded="sm">...</SPopover>
<SPopover rounded="xl">...</SPopover>
<SPopover rounded="full">...</SPopover>`
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-(--s-text-primary) mb-2">Popover</h1>
      <p class="text-lg text-(--s-text-secondary)">
        Floating panel component for contextual content, triggered by click, hover, or focus.
      </p>
    </header>

    <!-- Basic Usage -->
    <section id="basic-usage">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Basic Usage</h2>
      <DemoSection
        title="Simple Popover"
        description="Click a trigger to display floating content. Optionally include a close button."
        :code="basicUsageCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-4 items-center">
          <SPopover trigger="click" placement="bottom">
            <SPopoverTrigger>
              <SButton>Click me</SButton>
            </SPopoverTrigger>
            <SPopoverContent>
              <p class="text-sm text-(--s-text-secondary)">Simple popover content.</p>
            </SPopoverContent>
          </SPopover>

          <SPopover trigger="click" placement="bottom">
            <SPopoverTrigger>
              <SButton variant="outlined">With Close</SButton>
            </SPopoverTrigger>
            <SPopoverContent>
              <p class="text-sm text-(--s-text-secondary) mb-3">Content with a close button.</p>
              <SPopoverClose />
            </SPopoverContent>
          </SPopover>
        </div>
      </DemoSection>
    </section>

    <!-- Trigger Modes -->
    <section id="trigger-modes">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Trigger Modes</h2>
      <DemoSection
        title="Activation Methods"
        description="Popovers can be triggered by click, hover, or focus."
        :code="triggerModesCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-4 items-center">
          <SPopover trigger="click">
            <SPopoverTrigger>
              <SButton>Click</SButton>
            </SPopoverTrigger>
            <SPopoverContent>
              <p class="text-sm text-(--s-text-secondary)">Click-triggered popover.</p>
            </SPopoverContent>
          </SPopover>

          <SPopover trigger="hover">
            <SPopoverTrigger>
              <SButton variant="outlined">Hover</SButton>
            </SPopoverTrigger>
            <SPopoverContent>
              <p class="text-sm text-(--s-text-secondary)">Hover-triggered popover.</p>
            </SPopoverContent>
          </SPopover>

          <SPopover trigger="focus">
            <SPopoverTrigger>
              <SButton variant="light">Focus</SButton>
            </SPopoverTrigger>
            <SPopoverContent>
              <p class="text-sm text-(--s-text-secondary)">Focus-triggered popover.</p>
            </SPopoverContent>
          </SPopover>
        </div>
      </DemoSection>
    </section>

    <!-- Placements -->
    <section id="placements">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Placements</h2>
      <DemoSection
        title="Positioning"
        description="Choose from 12 placement options. The popover repositions automatically if it overflows the viewport."
        :code="placementsCode"
        language="vue"
      >
        <div class="space-y-6">
          <div class="flex flex-wrap gap-3 items-center">
            <SPopover trigger="click" placement="top">
              <SPopoverTrigger>
                <SButton size="sm">Top</SButton>
              </SPopoverTrigger>
              <SPopoverContent>
                <p class="text-sm">Top placement</p>
              </SPopoverContent>
            </SPopover>

            <SPopover trigger="click" placement="bottom">
              <SPopoverTrigger>
                <SButton size="sm">Bottom</SButton>
              </SPopoverTrigger>
              <SPopoverContent>
                <p class="text-sm">Bottom placement</p>
              </SPopoverContent>
            </SPopover>

            <SPopover trigger="click" placement="left">
              <SPopoverTrigger>
                <SButton size="sm">Left</SButton>
              </SPopoverTrigger>
              <SPopoverContent>
                <p class="text-sm">Left placement</p>
              </SPopoverContent>
            </SPopover>

            <SPopover trigger="click" placement="right">
              <SPopoverTrigger>
                <SButton size="sm">Right</SButton>
              </SPopoverTrigger>
              <SPopoverContent>
                <p class="text-sm">Right placement</p>
              </SPopoverContent>
            </SPopover>
          </div>

          <div class="text-sm font-medium text-(--s-text-secondary) mb-3">Alignment Variants:</div>
          <div class="flex flex-wrap gap-3 items-center">
            <SPopover trigger="click" placement="top-start">
              <SPopoverTrigger>
                <SButton size="sm" variant="outlined">Top Start</SButton>
              </SPopoverTrigger>
              <SPopoverContent>
                <p class="text-sm">Top Start</p>
              </SPopoverContent>
            </SPopover>

            <SPopover trigger="click" placement="top-end">
              <SPopoverTrigger>
                <SButton size="sm" variant="outlined">Top End</SButton>
              </SPopoverTrigger>
              <SPopoverContent>
                <p class="text-sm">Top End</p>
              </SPopoverContent>
            </SPopover>

            <SPopover trigger="click" placement="bottom-start">
              <SPopoverTrigger>
                <SButton size="sm" variant="outlined">Bottom Start</SButton>
              </SPopoverTrigger>
              <SPopoverContent>
                <p class="text-sm">Bottom Start</p>
              </SPopoverContent>
            </SPopover>

            <SPopover trigger="click" placement="bottom-end">
              <SPopoverTrigger>
                <SButton size="sm" variant="outlined">Bottom End</SButton>
              </SPopoverTrigger>
              <SPopoverContent>
                <p class="text-sm">Bottom End</p>
              </SPopoverContent>
            </SPopover>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Variants -->
    <section id="variants">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Variants</h2>
      <DemoSection
        title="Visual Styles"
        description="Choose from default, glass, bordered, or elevated variants."
        :code="variantsCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-4 items-center">
          <SPopover trigger="click" variant="default">
            <SPopoverTrigger>
              <SButton>Default</SButton>
            </SPopoverTrigger>
            <SPopoverContent>
              <p class="text-sm">Default variant</p>
            </SPopoverContent>
          </SPopover>

          <SPopover trigger="click" variant="glass">
            <SPopoverTrigger>
              <SButton variant="outlined">Glass</SButton>
            </SPopoverTrigger>
            <SPopoverContent>
              <p class="text-sm">Glass variant</p>
            </SPopoverContent>
          </SPopover>

          <SPopover trigger="click" variant="bordered">
            <SPopoverTrigger>
              <SButton variant="light">Bordered</SButton>
            </SPopoverTrigger>
            <SPopoverContent>
              <p class="text-sm">Bordered variant</p>
            </SPopoverContent>
          </SPopover>

          <SPopover trigger="click" variant="elevated">
            <SPopoverTrigger>
              <SButton variant="ghost">Elevated</SButton>
            </SPopoverTrigger>
            <SPopoverContent>
              <p class="text-sm">Elevated variant</p>
            </SPopoverContent>
          </SPopover>
        </div>
      </DemoSection>
    </section>

    <!-- Animations -->
    <section id="animations">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Animations</h2>
      <DemoSection
        title="Animation Types"
        description="Pick from fade, scale, or slide animations."
        :code="animationsCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-4 items-center">
          <SPopover trigger="click" animation="fade">
            <SPopoverTrigger>
              <SButton>Fade</SButton>
            </SPopoverTrigger>
            <SPopoverContent>
              <p class="text-sm">Fade animation</p>
            </SPopoverContent>
          </SPopover>

          <SPopover trigger="click" animation="scale">
            <SPopoverTrigger>
              <SButton variant="outlined">Scale</SButton>
            </SPopoverTrigger>
            <SPopoverContent>
              <p class="text-sm">Scale animation</p>
            </SPopoverContent>
          </SPopover>

          <SPopover trigger="click" animation="slide">
            <SPopoverTrigger>
              <SButton variant="light">Slide</SButton>
            </SPopoverTrigger>
            <SPopoverContent>
              <p class="text-sm">Slide animation</p>
            </SPopoverContent>
          </SPopover>
        </div>
      </DemoSection>
    </section>

    <!-- Interactive Content -->
    <section id="interactive-content">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Interactive Content</h2>
      <DemoSection
        title="Form Inside Popover"
        description="Popovers can contain interactive elements like inputs and buttons."
        :code="interactiveCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-4 items-center">
          <SPopover trigger="click" placement="bottom">
            <SPopoverTrigger>
              <SButton>Subscribe</SButton>
            </SPopoverTrigger>
            <SPopoverContent>
              <div class="space-y-3">
                <p class="text-sm font-medium text-(--s-text-primary)">Enter your email</p>
                <input
                  v-model="emailValue"
                  type="email"
                  placeholder="you@example.com"
                  class="w-full px-3 py-2 rounded-lg border border-(--s-border) bg-(--s-bg-secondary) text-sm text-(--s-text-primary) outline-none focus:border-(--s-primary)"
                />
                <SButton class="w-full" size="sm">Submit</SButton>
              </div>
            </SPopoverContent>
          </SPopover>
        </div>
      </DemoSection>
    </section>

    <!-- Rounded -->
    <section id="rounded">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Rounded</h2>
      <DemoSection
        title="Border Radius"
        description="Control the border radius of the popover panel."
        :code="roundedCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-4 items-center">
          <SPopover trigger="click" rounded="sm">
            <SPopoverTrigger>
              <SButton size="sm">Small</SButton>
            </SPopoverTrigger>
            <SPopoverContent>
              <p class="text-sm">rounded="sm"</p>
            </SPopoverContent>
          </SPopover>

          <SPopover trigger="click" rounded="xl">
            <SPopoverTrigger>
              <SButton size="sm" variant="outlined">XL (default)</SButton>
            </SPopoverTrigger>
            <SPopoverContent>
              <p class="text-sm">rounded="xl"</p>
            </SPopoverContent>
          </SPopover>

          <SPopover trigger="click" rounded="full">
            <SPopoverTrigger>
              <SButton size="sm" variant="light">Full</SButton>
            </SPopoverTrigger>
            <SPopoverContent>
              <p class="text-sm">rounded="full"</p>
            </SPopoverContent>
          </SPopover>
        </div>
      </DemoSection>
    </section>

    <!-- API Reference -->
    <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">API Reference</h2>
    <SApiSection>
      <SApiTable
        title="Props"
        type="props"
        :props="(popoverProps as ApiProp[])"
      />

      <SApiTable
        title="Events"
        type="events"
        :events="(popoverEvents as ApiEvent[])"
      />

      <SApiTable
        title="Slots"
        type="slots"
        :slots="(popoverSlots as ApiSlot[])"
      />

      <SApiTable
        title="Exposed Methods"
        type="methods"
        :methods="(popoverMethods as ApiMethod[])"
      />

      <SApiKeyboard
        :shortcuts="(popoverKeyboard as KeyboardShortcut[])"
      />
    </SApiSection>
  </div>
</template>
