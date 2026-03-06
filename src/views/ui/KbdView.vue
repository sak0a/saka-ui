<script setup lang="ts">
import { SKbd, SKbdShortcut, SButton, SInput, STooltip, SApiSection, SApiTable } from '../../index'
import type { ApiProp, ApiSlot } from '../../index'
import DemoSection from '../../components/DemoSection.vue'

// Code snippets for demos
const basicUsageCode = `<SKbd>Esc</SKbd>
<SKbd>Enter</SKbd>
<SKbd>Shift</SKbd>
<SKbd>Tab</SKbd>
<SKbd>&#8593;</SKbd>
<SKbd>&#8595;</SKbd>
<SKbd>K</SKbd>
<SKbd>&#8984;</SKbd>`

const sizesCode = `<SKbd size="xs">Esc</SKbd>
<SKbd size="sm">Esc</SKbd>
<SKbd size="md">Esc</SKbd>
<SKbd size="lg">Esc</SKbd>`

const variantsCode = `<SKbd variant="default">Esc</SKbd>
<SKbd variant="outlined">Esc</SKbd>
<SKbd variant="flat">Esc</SKbd>
<SKbd variant="ghost">Esc</SKbd>`

const shortcutCode = `<SKbdShortcut :keys="['⌘', 'K']" />
<SKbdShortcut :keys="['Ctrl', 'Shift', 'P']" />
<SKbdShortcut :keys="['Alt', 'Tab']" />
<SKbdShortcut :keys="['⌘', 'C']" separator="" />`

const colorsCode = `<SKbd color="#3b82f6">⌘</SKbd>
<SKbd color="#8b5cf6">K</SKbd>
<SKbd color="#ec4899">Shift</SKbd>
<SKbd color="#10b981">Enter</SKbd>
<SKbdShortcut :keys="['⌘', 'K']" color="#f59e0b" />`

const inlineCode = `<p>
  Press <SKbd size="sm">Esc</SKbd> to close the dialog,
  or <SKbdShortcut :keys="['⌘', 'Enter']" size="sm" /> to confirm.
</p>`

const withComponentsCode = `<!-- Button with shortcut hint -->
<SButton variant="outlined">
  Search
  <SKbdShortcut :keys="['⌘', 'K']" size="xs" variant="flat" class="ml-2 opacity-70" />
</SButton>

<!-- Tooltip with shortcut -->
<STooltip position="top">
  <SButton variant="ghost" iconOnly>
    <span class="mdi mdi-content-copy"></span>
  </SButton>
  <template #content>
    Copy <SKbdShortcut :keys="['⌘', 'C']" size="xs" variant="flat" />
  </template>
</STooltip>`

const realWorldCode = `<!-- Command palette trigger -->
<div class="flex items-center gap-3 px-4 py-2.5 rounded-xl border cursor-pointer hover:bg-(--s-bg-secondary)">
  <span class="mdi mdi-magnify text-(--s-text-secondary)"></span>
  <span class="text-sm text-(--s-text-secondary) flex-1">Search commands...</span>
  <SKbdShortcut :keys="['⌘', 'K']" size="sm" />
</div>

<!-- Menu item with shortcut -->
<div class="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-(--s-bg-secondary)">
  <span class="text-sm">Copy</span>
  <SKbdShortcut :keys="['⌘', 'C']" size="xs" variant="flat" />
</div>`

// API Reference data
const kbdProps: ApiProp[] = [
  { name: 'variant', type: "'default' | 'outlined' | 'flat' | 'ghost'", default: "'default'", description: 'Visual style variant. Default renders a raised 3D keycap look.', category: 'Appearance' },
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Key indicator size', category: 'Appearance' },
  { name: 'color', type: 'string', default: 'undefined', description: 'Custom color override (CSS color value or variable)', category: 'Appearance' },
]

const kbdSlots: ApiSlot[] = [
  { name: 'default', description: 'Key content — text, symbol, or icon (e.g., "Esc", "⌘", "K")' },
]

const shortcutProps: ApiProp[] = [
  { name: 'keys', type: 'string[]', default: '—', description: 'Array of key labels to display', category: 'Content' },
  { name: 'separator', type: 'string', default: "'+'", description: 'Separator string between keys', category: 'Content' },
  { name: 'variant', type: "'default' | 'outlined' | 'flat' | 'ghost'", default: "'default'", description: 'Passed to each SKbd instance', category: 'Appearance' },
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Passed to each SKbd instance', category: 'Appearance' },
  { name: 'color', type: 'string', default: 'undefined', description: 'Custom color override, passed to each SKbd instance', category: 'Appearance' },
]
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-(--s-text-primary) mb-2">Kbd</h1>
      <p class="text-lg text-(--s-text-secondary)">Inline keyboard key indicators for displaying shortcuts, hotkeys, and key references.</p>
    </header>

    <!-- Features -->
    <article>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-xml text-xl text-emerald-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Semantic HTML</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Renders native <code class="text-xs px-1 py-0.5 rounded bg-(--s-bg-tertiary)">&lt;kbd&gt;</code> elements for proper accessibility and semantics.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-palette-outline text-xl text-blue-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Four Variants</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Default raised 3D keycap, outlined, flat, and ghost styles for any context.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-resize text-xl text-purple-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Four Sizes</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">From extra small to large — fits inside buttons, tooltips, or standalone text.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-keyboard text-xl text-amber-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Key Combinations</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">SKbdShortcut helper renders multi-key shortcuts with configurable separators.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-invert-colors text-xl text-red-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Custom Colors</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Pass any CSS color to match your brand or highlight specific keys.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-text text-xl text-cyan-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Inline-Friendly</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Designed to sit seamlessly within text, buttons, tooltips, and menu items.</p>
        </div>
      </div>
    </article>

    <!-- Basic Usage -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Basic Usage</h2>
      <DemoSection
        title="Single Keys"
        description="Display individual keyboard keys using the SKbd component."
        :code="basicUsageCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-3 items-center">
          <SKbd>Esc</SKbd>
          <SKbd>Enter</SKbd>
          <SKbd>Shift</SKbd>
          <SKbd>Tab</SKbd>
          <SKbd>&#8593;</SKbd>
          <SKbd>&#8595;</SKbd>
          <SKbd>&#8592;</SKbd>
          <SKbd>&#8594;</SKbd>
          <SKbd>K</SKbd>
          <SKbd>&#8984;</SKbd>
          <SKbd>Space</SKbd>
          <SKbd>Del</SKbd>
        </div>
      </DemoSection>
    </section>

    <!-- Sizes -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Sizes</h2>
      <DemoSection
        title="Key Sizes"
        description="Four size options: xs, sm, md (default), and lg."
        :code="sizesCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-4 items-end">
          <div class="flex flex-col items-center gap-2">
            <SKbd size="xs">Esc</SKbd>
            <span class="text-xs font-mono text-(--s-text-secondary)">xs</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SKbd size="sm">Esc</SKbd>
            <span class="text-xs font-mono text-(--s-text-secondary)">sm</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SKbd size="md">Esc</SKbd>
            <span class="text-xs font-mono text-(--s-text-secondary)">md</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SKbd size="lg">Esc</SKbd>
            <span class="text-xs font-mono text-(--s-text-secondary)">lg</span>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Variants -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Variants</h2>
      <DemoSection
        title="Style Variants"
        description="Four visual variants: default (raised 3D keycap), outlined, flat, and ghost."
        :code="variantsCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-4 items-center">
          <div class="flex flex-col items-center gap-2">
            <SKbd variant="default">Esc</SKbd>
            <span class="text-xs font-mono text-(--s-text-secondary)">default</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SKbd variant="outlined">Esc</SKbd>
            <span class="text-xs font-mono text-(--s-text-secondary)">outlined</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SKbd variant="flat">Esc</SKbd>
            <span class="text-xs font-mono text-(--s-text-secondary)">flat</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SKbd variant="ghost">Esc</SKbd>
            <span class="text-xs font-mono text-(--s-text-secondary)">ghost</span>
          </div>
        </div>

        <div class="mt-6 pt-6 border-t border-(--s-border)">
          <p class="text-sm text-(--s-text-secondary) mb-4">All variants with different keys:</p>
          <div class="space-y-3">
            <div class="flex flex-wrap gap-3 items-center">
              <SKbd variant="default">&#8984;</SKbd>
              <SKbd variant="default">Shift</SKbd>
              <SKbd variant="default">Enter</SKbd>
              <SKbd variant="default">Space</SKbd>
            </div>
            <div class="flex flex-wrap gap-3 items-center">
              <SKbd variant="outlined">&#8984;</SKbd>
              <SKbd variant="outlined">Shift</SKbd>
              <SKbd variant="outlined">Enter</SKbd>
              <SKbd variant="outlined">Space</SKbd>
            </div>
            <div class="flex flex-wrap gap-3 items-center">
              <SKbd variant="flat">&#8984;</SKbd>
              <SKbd variant="flat">Shift</SKbd>
              <SKbd variant="flat">Enter</SKbd>
              <SKbd variant="flat">Space</SKbd>
            </div>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Key Combinations -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Key Combinations</h2>
      <DemoSection
        title="Keyboard Shortcuts"
        description="Use SKbdShortcut to display multi-key combinations with configurable separators."
        :code="shortcutCode"
        language="vue"
      >
        <div class="space-y-4">
          <div class="flex flex-wrap gap-6 items-center">
            <div class="flex flex-col items-center gap-2">
              <SKbdShortcut :keys="['⌘', 'K']" />
              <span class="text-xs text-(--s-text-secondary)">Command Palette</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <SKbdShortcut :keys="['Ctrl', 'Shift', 'P']" />
              <span class="text-xs text-(--s-text-secondary)">Quick Actions</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <SKbdShortcut :keys="['Alt', 'Tab']" />
              <span class="text-xs text-(--s-text-secondary)">Switch Window</span>
            </div>
          </div>
          <div class="pt-4 border-t border-(--s-border)">
            <p class="text-sm text-(--s-text-secondary) mb-3">With different separators:</p>
            <div class="flex flex-wrap gap-6 items-center">
              <div class="flex flex-col items-center gap-2">
                <SKbdShortcut :keys="['⌘', 'C']" separator="+" />
                <span class="text-xs font-mono text-(--s-text-secondary)">separator="+"</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <SKbdShortcut :keys="['⌘', 'C']" separator="" />
                <span class="text-xs font-mono text-(--s-text-secondary)">separator=""</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <SKbdShortcut :keys="['⌘', 'C']" separator="then" />
                <span class="text-xs font-mono text-(--s-text-secondary)">separator="then"</span>
              </div>
            </div>
          </div>
          <div class="pt-4 border-t border-(--s-border)">
            <p class="text-sm text-(--s-text-secondary) mb-3">With variants and sizes:</p>
            <div class="flex flex-wrap gap-6 items-center">
              <SKbdShortcut :keys="['⌘', 'K']" size="xs" variant="flat" />
              <SKbdShortcut :keys="['⌘', 'K']" size="sm" variant="outlined" />
              <SKbdShortcut :keys="['⌘', 'K']" size="md" variant="default" />
              <SKbdShortcut :keys="['⌘', 'K']" size="lg" variant="default" />
            </div>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Custom Colors -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Custom Colors</h2>
      <DemoSection
        title="Colored Keys"
        description="Use the color prop to customize key colors."
        :code="colorsCode"
        language="vue"
      >
        <div class="space-y-4">
          <div class="flex flex-wrap gap-3 items-center">
            <SKbd color="#3b82f6">&#8984;</SKbd>
            <SKbd color="#8b5cf6">K</SKbd>
            <SKbd color="#ec4899">Shift</SKbd>
            <SKbd color="#10b981">Enter</SKbd>
            <SKbd color="#f59e0b">Del</SKbd>
            <SKbd color="#ef4444">Esc</SKbd>
          </div>
          <div class="flex flex-wrap gap-3 items-center">
            <SKbd color="#3b82f6" variant="outlined">&#8984;</SKbd>
            <SKbd color="#8b5cf6" variant="outlined">K</SKbd>
            <SKbd color="#ec4899" variant="outlined">Shift</SKbd>
            <SKbd color="#10b981" variant="outlined">Enter</SKbd>
          </div>
          <div class="flex flex-wrap gap-3 items-center">
            <SKbd color="#3b82f6" variant="flat">&#8984;</SKbd>
            <SKbd color="#8b5cf6" variant="flat">K</SKbd>
            <SKbd color="#ec4899" variant="flat">Shift</SKbd>
            <SKbd color="#10b981" variant="flat">Enter</SKbd>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Inline with Text -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Inline with Text</h2>
      <DemoSection
        title="In Paragraphs"
        description="SKbd is designed to sit naturally inline with surrounding text."
        :code="inlineCode"
        language="vue"
      >
        <div class="space-y-4 max-w-xl">
          <p class="text-sm text-(--s-text-secondary) leading-relaxed">
            Press <SKbd size="sm">Esc</SKbd> to close the dialog, or <SKbdShortcut :keys="['⌘', 'Enter']" size="sm" /> to confirm your changes.
          </p>
          <p class="text-sm text-(--s-text-secondary) leading-relaxed">
            Use <SKbd size="sm">&#8593;</SKbd> and <SKbd size="sm">&#8595;</SKbd> to navigate between items, then press <SKbd size="sm">Enter</SKbd> to select.
          </p>
          <p class="text-sm text-(--s-text-secondary) leading-relaxed">
            Hold <SKbd size="sm">Shift</SKbd> and click to select a range, or press <SKbdShortcut :keys="['⌘', 'A']" size="sm" /> to select all.
          </p>
        </div>
      </DemoSection>
    </section>

    <!-- With Other Components -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">With Other Components</h2>
      <DemoSection
        title="Component Integration"
        description="SKbd works seamlessly inside buttons, tooltips, and other UI elements."
        :code="withComponentsCode"
        language="vue"
      >
        <div class="space-y-6">
          <!-- Buttons with shortcut hints -->
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Buttons with shortcut hints:</p>
            <div class="flex flex-wrap gap-3 items-center">
              <SButton variant="outlined">
                Search
                <SKbdShortcut :keys="['⌘', 'K']" size="xs" variant="flat" class="ml-2 opacity-70" />
              </SButton>
              <SButton variant="light">
                Save
                <SKbdShortcut :keys="['⌘', 'S']" size="xs" variant="flat" class="ml-2 opacity-70" />
              </SButton>
              <SButton variant="ghost">
                Undo
                <SKbdShortcut :keys="['⌘', 'Z']" size="xs" variant="ghost" class="ml-1 opacity-60" />
              </SButton>
            </div>
          </div>

          <!-- Tooltips with shortcuts -->
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Tooltips with keyboard hints:</p>
            <div class="flex flex-wrap gap-3 items-center">
              <STooltip position="top">
                <SButton variant="ghost" iconOnly>
                  <span class="mdi mdi-content-copy"></span>
                </SButton>
                <template #content>
                  <span class="flex items-center gap-2">
                    Copy <SKbdShortcut :keys="['⌘', 'C']" size="xs" variant="flat" />
                  </span>
                </template>
              </STooltip>
              <STooltip position="top">
                <SButton variant="ghost" iconOnly>
                  <span class="mdi mdi-content-paste"></span>
                </SButton>
                <template #content>
                  <span class="flex items-center gap-2">
                    Paste <SKbdShortcut :keys="['⌘', 'V']" size="xs" variant="flat" />
                  </span>
                </template>
              </STooltip>
              <STooltip position="top">
                <SButton variant="ghost" iconOnly>
                  <span class="mdi mdi-magnify"></span>
                </SButton>
                <template #content>
                  <span class="flex items-center gap-2">
                    Search <SKbdShortcut :keys="['⌘', 'K']" size="xs" variant="flat" />
                  </span>
                </template>
              </STooltip>
            </div>
          </div>

          <!-- Menu-like items with shortcuts -->
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Menu items with shortcuts:</p>
            <div class="max-w-xs rounded-xl border border-(--s-border) bg-(--s-bg-secondary)/50 overflow-hidden divide-y divide-(--s-border)/50">
              <div class="flex items-center justify-between px-3 py-2.5 hover:bg-(--s-bg-secondary) cursor-pointer">
                <span class="flex items-center gap-2 text-sm text-(--s-text-primary)">
                  <span class="mdi mdi-content-cut text-(--s-text-secondary)"></span> Cut
                </span>
                <SKbdShortcut :keys="['⌘', 'X']" size="xs" variant="flat" />
              </div>
              <div class="flex items-center justify-between px-3 py-2.5 hover:bg-(--s-bg-secondary) cursor-pointer">
                <span class="flex items-center gap-2 text-sm text-(--s-text-primary)">
                  <span class="mdi mdi-content-copy text-(--s-text-secondary)"></span> Copy
                </span>
                <SKbdShortcut :keys="['⌘', 'C']" size="xs" variant="flat" />
              </div>
              <div class="flex items-center justify-between px-3 py-2.5 hover:bg-(--s-bg-secondary) cursor-pointer">
                <span class="flex items-center gap-2 text-sm text-(--s-text-primary)">
                  <span class="mdi mdi-content-paste text-(--s-text-secondary)"></span> Paste
                </span>
                <SKbdShortcut :keys="['⌘', 'V']" size="xs" variant="flat" />
              </div>
              <div class="flex items-center justify-between px-3 py-2.5 hover:bg-(--s-bg-secondary) cursor-pointer">
                <span class="flex items-center gap-2 text-sm text-(--s-text-primary)">
                  <span class="mdi mdi-select-all text-(--s-text-secondary)"></span> Select All
                </span>
                <SKbdShortcut :keys="['⌘', 'A']" size="xs" variant="flat" />
              </div>
            </div>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Real-World Examples -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Real-World Examples</h2>
      <DemoSection
        title="Practical Patterns"
        description="Common UI patterns that use keyboard key indicators."
        :code="realWorldCode"
        language="vue"
      >
        <div class="space-y-6">
          <!-- Command palette trigger -->
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Command palette trigger:</p>
            <div class="max-w-md flex items-center gap-3 px-4 py-2.5 rounded-xl border border-(--s-border) bg-(--s-bg-secondary)/30 cursor-pointer hover:bg-(--s-bg-secondary)/60 transition-colors">
              <span class="mdi mdi-magnify text-lg text-(--s-text-secondary)"></span>
              <span class="text-sm text-(--s-text-secondary) flex-1">Search commands...</span>
              <SKbdShortcut :keys="['⌘', 'K']" size="sm" />
            </div>
          </div>

          <!-- Search input with shortcut -->
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Search input with shortcut hint:</p>
            <div class="max-w-md">
              <SInput placeholder="Search..." iconLeft="magnify">
                <template #suffix>
                  <SKbdShortcut :keys="['⌘', 'K']" size="xs" variant="flat" />
                </template>
              </SInput>
            </div>
          </div>

          <!-- Navigation hints -->
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Navigation hints:</p>
            <div class="max-w-sm flex items-center justify-center gap-6 p-4 rounded-xl border border-(--s-border) bg-(--s-bg-secondary)/30">
              <div class="flex items-center gap-2 text-sm text-(--s-text-secondary)">
                <SKbd size="sm">&#8593;</SKbd>
                <SKbd size="sm">&#8595;</SKbd>
                <span>Navigate</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-(--s-text-secondary)">
                <SKbd size="sm">Enter</SKbd>
                <span>Select</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-(--s-text-secondary)">
                <SKbd size="sm">Esc</SKbd>
                <span>Close</span>
              </div>
            </div>
          </div>

          <!-- Editor status bar -->
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Editor status bar:</p>
            <div class="max-w-2xl flex items-center justify-between px-4 py-2 rounded-xl border border-(--s-border) bg-(--s-bg-secondary)/30 text-xs text-(--s-text-secondary)">
              <div class="flex items-center gap-4">
                <span>Ln 42, Col 18</span>
                <span>UTF-8</span>
                <span>TypeScript</span>
              </div>
              <div class="flex items-center gap-4">
                <span class="flex items-center gap-1.5">
                  <SKbdShortcut :keys="['⌘', 'P']" size="xs" variant="ghost" /> Go to File
                </span>
                <span class="flex items-center gap-1.5">
                  <SKbdShortcut :keys="['⌘', 'Shift', 'P']" size="xs" variant="ghost" /> Commands
                </span>
              </div>
            </div>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- API Reference -->
    <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">API Reference</h2>
    <SApiSection>
      <SApiTable
        title="SKbd Props"
        type="props"
        :props="kbdProps"
      />

      <SApiTable
        title="SKbd Slots"
        type="slots"
        :slots="kbdSlots"
      />

      <SApiTable
        title="SKbdShortcut Props"
        type="props"
        :props="shortcutProps"
      />
    </SApiSection>
  </div>
</template>
