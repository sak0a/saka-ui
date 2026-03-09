<script setup lang="ts">
import { ref, computed } from 'vue'
import { SDropdown, SDropdownItem, SDropdownDivider, SDropdownGroup, SKbdShortcut, SButton, SIcon, SApiSection, SApiTable, SApiKeyboard } from '../../index'
import type { ApiProp, ApiEvent, ApiSlot, KeyboardShortcut } from '../../index'
import type { DropdownMenuItem } from '../../components/ui/dropdown/context'
import DemoSection from '../../components/DemoSection.vue'
import { Search, Palette, Keyboard as KeyboardIcon } from 'lucide-vue-next'
import { useCustomizer } from '../../composables/useCustomizer'
import { iconToCode, getLucideImportName, lucideImportStatement } from '../../lib/iconMap'

const { ri, iconPack } = useCustomizer()

// Code generation helpers
const cv = (mdiName: string) => iconToCode(mdiName, iconPack.value)
const cp = (mdiName: string, attr = 'icon') => {
  if (iconPack.value === 'mdi') return `${attr}="${mdiName}"`
  const name = getLucideImportName(mdiName)
  return name ? `:${attr}="${name}"` : `${attr}="${mdiName}"`
}
const li = (...mdiNames: string[]) => {
  if (iconPack.value === 'mdi') return ''
  return '\n' + lucideImportStatement(mdiNames)
}

// Basic items
const basicItems = computed<DropdownMenuItem[]>(() => [
  { key: 'edit', label: 'Edit', icon: ri('pencil') },
  { key: 'duplicate', label: 'Duplicate', icon: ri('content-copy') },
  { key: 'archive', label: 'Archive', icon: ri('archive') },
  { key: 'divider1', divider: true },
  { key: 'delete', label: 'Delete', icon: ri('delete'), danger: true }
])

// Items with descriptions
const richItems = computed<DropdownMenuItem[]>(() => [
  { key: 'email', label: 'Send via Email', icon: ri('email'), description: 'Send to recipient email address', shortcut: '⌘E' },
  { key: 'link', label: 'Copy Link', icon: ri('link'), description: 'Copy shareable link to clipboard', shortcut: '⌘L' },
  { key: 'embed', label: 'Embed', icon: ri('code-tags'), description: 'Get embed code for websites' },
  { key: 'divider1', divider: true },
  { key: 'qr', label: 'Generate QR Code', icon: ri('qrcode'), description: 'Create scannable QR code' }
])

// Grouped items
const groupedItems = computed<DropdownMenuItem[]>(() => [
  { key: 'header-view', header: 'View' },
  { key: 'list', label: 'List View', icon: ri('view-list') },
  { key: 'grid', label: 'Grid View', icon: ri('view-grid') },
  { key: 'kanban', label: 'Kanban Board', icon: ri('view-column') },
  { key: 'header-sort', header: 'Sort By' },
  { key: 'name', label: 'Name', icon: ri('sort-alphabetical-ascending') },
  { key: 'date', label: 'Date Modified', icon: ri('calendar') },
  { key: 'size', label: 'Size', icon: ri('chart-bar') }
])

// Checkable items - separate state for mutability
const checkStates = ref<Record<string, boolean>>({
  bold: true,
  italic: false,
  underline: true,
  strike: false
})

const checkableItems = computed<DropdownMenuItem[]>(() => [
  { key: 'bold', label: 'Bold', icon: ri('format-bold'), checked: checkStates.value.bold, shortcut: '⌘B' },
  { key: 'italic', label: 'Italic', icon: ri('format-italic'), checked: checkStates.value.italic, shortcut: '⌘I' },
  { key: 'underline', label: 'Underline', icon: ri('format-underline'), checked: checkStates.value.underline, shortcut: '⌘U' },
  { key: 'divider1', divider: true },
  { key: 'strike', label: 'Strikethrough', icon: ri('format-strikethrough'), checked: checkStates.value.strike }
])

const toggleCheckable = (key: string) => {
  if (key in checkStates.value) {
    checkStates.value[key] = !checkStates.value[key]
  }
}

// Navigation items
const navItems = computed<DropdownMenuItem[]>(() => [
  { key: 'profile', label: 'Profile', icon: ri('account'), description: 'View and edit your profile' },
  { key: 'settings', label: 'Settings', icon: ri('cog'), description: 'Manage preferences' },
  { key: 'billing', label: 'Billing', icon: ri('credit-card'), description: 'Subscription & payments' },
  { key: 'team', label: 'Team', icon: ri('account-group'), description: 'Manage team members' },
  { key: 'divider1', divider: true },
  { key: 'docs', label: 'Documentation', icon: ri('book-open-variant'), trailingIcon: ri('open-in-new') },
  { key: 'support', label: 'Support', icon: ri('lifebuoy'), trailingIcon: ri('open-in-new') },
  { key: 'divider2', divider: true },
  { key: 'logout', label: 'Sign out', icon: ri('logout'), danger: true }
])

// File actions
const fileActions = computed<DropdownMenuItem[]>(() => [
  { key: 'new-file', label: 'New File', icon: ri('file-plus'), shortcut: '⌘N' },
  { key: 'new-folder', label: 'New Folder', icon: ri('folder-plus'), shortcut: '⌘⇧N' },
  { key: 'divider1', divider: true },
  { key: 'upload', label: 'Upload File', icon: ri('upload'), shortcut: '⌘U' },
  { key: 'import', label: 'Import', icon: ri('import'), description: 'Import from external source' },
  { key: 'divider2', divider: true },
  { key: 'download', label: 'Download All', icon: ri('download') }
])

// Large list for searchable demo
const countryItems = computed<DropdownMenuItem[]>(() => [
  { key: 'us', label: 'United States', icon: ri('flag') },
  { key: 'uk', label: 'United Kingdom', icon: ri('flag') },
  { key: 'de', label: 'Germany', icon: ri('flag') },
  { key: 'fr', label: 'France', icon: ri('flag') },
  { key: 'es', label: 'Spain', icon: ri('flag') },
  { key: 'it', label: 'Italy', icon: ri('flag') },
  { key: 'jp', label: 'Japan', icon: ri('flag') },
  { key: 'cn', label: 'China', icon: ri('flag') },
  { key: 'kr', label: 'South Korea', icon: ri('flag') },
  { key: 'br', label: 'Brazil', icon: ri('flag') },
  { key: 'au', label: 'Australia', icon: ri('flag') },
  { key: 'ca', label: 'Canada', icon: ri('flag') },
  { key: 'mx', label: 'Mexico', icon: ri('flag') },
  { key: 'in', label: 'India', icon: ri('flag') },
  { key: 'ru', label: 'Russia', icon: ri('flag') }
])

// Nested sub-items (extracted from inline arrays)
const shareSubItems = computed<DropdownMenuItem[]>(() => [
  { key: 'email', label: 'Email', icon: ri('email') },
  { key: 'link', label: 'Copy Link', icon: ri('link-variant') },
  { key: 'social', label: 'Social Media', icon: ri('share-variant') }
])

const exportSubItems = computed<DropdownMenuItem[]>(() => [
  { key: 'pdf', label: 'Export as PDF', icon: ri('file-pdf-box') },
  { key: 'docx', label: 'Export as DOCX', icon: ri('file-word-box') },
  { key: 'xlsx', label: 'Export as XLSX', icon: ri('file-excel-box') },
  { key: 'csv', label: 'Export as CSV', icon: ri('file-delimited') }
])

const importSubItems = computed<DropdownMenuItem[]>(() => [
  { key: 'from-file', label: 'From File', icon: ri('file-upload') },
  { key: 'from-url', label: 'From URL', icon: ri('link') },
  { key: 'from-cloud', label: 'From Cloud', icon: ri('cloud-upload') }
])

const editMenuItems = computed<DropdownMenuItem[]>(() => [
  { key: 'undo', label: 'Undo', icon: ri('undo'), shortcut: '⌘Z' },
  { key: 'redo', label: 'Redo', icon: ri('redo'), shortcut: '⌘⇧Z' },
  { key: 'divider1', divider: true },
  { key: 'cut', label: 'Cut', icon: ri('content-cut'), shortcut: '⌘X' },
  { key: 'copy', label: 'Copy', icon: ri('content-copy'), shortcut: '⌘C' },
  { key: 'paste', label: 'Paste', icon: ri('content-paste'), shortcut: '⌘V' },
  { key: 'divider2', divider: true },
  { key: 'select-all', label: 'Select All', icon: ri('select-all'), shortcut: '⌘A' }
])

// Event handling
const lastSelected = ref<string | null>(null)

const handleSelect = (key: string) => {
  lastSelected.value = key
}

// Code snippets - all computed for icon pack reactivity
const basicCode = computed(() => `<script setup>${li('pencil', 'content-copy', 'archive', 'delete', 'menu')}
import { SDropdown } from 'saka-ui'

const items = [
  { key: 'edit', label: 'Edit', icon: ${cv('pencil')} },
  { key: 'duplicate', label: 'Duplicate', icon: ${cv('content-copy')} },
  { key: 'archive', label: 'Archive', icon: ${cv('archive')} },
  { key: 'divider1', divider: true },
  { key: 'delete', label: 'Delete', icon: ${cv('delete')}, danger: true }
]
<\/script>

<template>
  <SDropdown :items="items" label="Actions" ${cp('menu')} />
</template>`)

const slotCode = computed(() => `<SDropdown>
  <template #trigger>
    <SButton class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
      <SIcon ${cp('rocket-launch')} :size="16" />
      Quick Actions
    </SButton>
  </template>

  <SDropdownItem item-key="new" ${cp('plus')} label="Create New" description="Start a new project" />
  <SDropdownItem item-key="import" ${cp('import')} label="Import" description="Import existing project" />
  <SDropdownDivider />
  <SDropdownGroup label="Recent">
    <SDropdownItem item-key="project-1" ${cp('folder')} label="My Project" />
    <SDropdownItem item-key="project-2" ${cp('folder')} label="Design System" />
  </SDropdownGroup>
</SDropdown>`)

const hoverCode = computed(() => `<SDropdown
  :items="items"
  trigger="click"
  label="Click"
  ${cp('cursor-default-click')}
/>
<SDropdown
  :items="items"
  trigger="hover"
  label="Hover"
  ${cp('cursor-default')}
  :show-delay="100"
  :hide-delay="200"
/>
<SDropdown :items="items" trigger="context">
  <template #trigger>
    <div class="px-6 py-4 border-2 border-dashed border-(--s-border) rounded-xl text-(--s-text-secondary) text-sm hover:border-(--s-border-hover) transition-colors cursor-context-menu">
      <SIcon ${cp('mouse-right-click')} :size="16" class="mr-2" />
      Right-click me
    </div>
  </template>
</SDropdown>`)

const placementCode = `<SDropdown :items="items" placement="top-start" label="Top Start" />
<SDropdown :items="items" placement="top" label="Top" />
<SDropdown :items="items" placement="top-end" label="Top End" />
<SDropdown :items="items" placement="left-start" label="Left" />
<SDropdown :items="items" placement="right-start" label="Right" />
<SDropdown :items="items" placement="bottom-start" label="Bottom Start" />
<SDropdown :items="items" placement="bottom" label="Bottom" />
<SDropdown :items="items" placement="bottom-end" label="Bottom End" />`

const animationCode = computed(() => `<SDropdown :items="items" animation="fade" label="Fade" ${cp('blur')} />
<SDropdown :items="items" animation="slide" label="Slide" ${cp('arrow-expand-down')} />
<SDropdown :items="items" animation="scale" label="Scale" ${cp('resize')} />
<SDropdown :items="items" animation="reveal" label="Reveal" ${cp('blur-radial')} />`)

const searchableCode = computed(() => `<SDropdown
  :items="countryItems"
  searchable
  search-placeholder="Search countries..."
  label="Select Country"
  ${cp('earth')}
  :width="260"
  max-height="280px"
/>`)

const checkableCode = computed(() => `<script setup>${li('format-text')}
import { ref } from 'vue'
import { SDropdown } from 'saka-ui'

const items = ref([
  { key: 'bold', label: 'Bold', checked: true },
  { key: 'italic', label: 'Italic', checked: false }
])

const onSelect = (key) => {
  const item = items.value.find(i => i.key === key)
  if (item) item.checked = !item.checked
}
<\/script>

<template>
  <SDropdown
    :items="items"
    label="Format"
    ${cp('format-text')}
    :width="220"
    :close-on-select="false"
    @select="onSelect"
  />
</template>`)

const nestedCode = computed(() => `<SDropdown label="File" ${cp('file-document')} :width="220" :close-on-select="false">
  <template #default>
    <SDropdownItem item-key="new" ${cp('file-plus')} label="New" />
    <SDropdownItem item-key="open" ${cp('folder-open')} label="Open" />
    <SDropdownDivider />

    <!-- Nested dropdown for Share -->
    <SDropdown
      :items="[
        { key: 'email', label: 'Email', icon: ${cv('email')} },
        { key: 'link', label: 'Copy Link', icon: ${cv('link-variant')} },
        { key: 'social', label: 'Social Media', icon: ${cv('share-variant')} }
      ]"
      trigger="hover"
      placement="right-start"
      :width="200"
      :close-on-select="false"
    >
      <template #trigger>
        <div class="s-dropdown-item relative flex items-center cursor-pointer transition-all duration-150 select-none mx-1.5 rounded-lg px-3 py-2 text-sm text-(--s-text-primary) hover:bg-(--s-bg-tertiary)">
          <SIcon ${cp('share-variant')} :size="16" class="mr-2.5 text-(--s-text-secondary)" />
          <div class="flex-1 min-w-0">
            <div class="truncate">Share</div>
          </div>
          <SIcon ${cp('chevron-right')} :size="16" class="ml-4 shrink-0 text-(--s-text-tertiary)" />
        </div>
      </template>
    </SDropdown>

    <SDropdownDivider />

    <!-- Nested dropdown for Export -->
    <SDropdown
      :items="[
        { key: 'pdf', label: 'Export as PDF', icon: ${cv('file-pdf-box')} },
        { key: 'docx', label: 'Export as DOCX', icon: ${cv('file-word-box')} },
        { key: 'xlsx', label: 'Export as XLSX', icon: ${cv('file-excel-box')} },
        { key: 'csv', label: 'Export as CSV', icon: ${cv('file-delimited')} }
      ]"
      trigger="hover"
      placement="right-start"
      :width="220"
      :close-on-select="false"
    >
      <template #trigger>
        <div class="s-dropdown-item relative flex items-center cursor-pointer transition-all duration-150 select-none mx-1.5 rounded-lg px-3 py-2 text-sm text-(--s-text-primary) hover:bg-(--s-bg-tertiary)">
          <SIcon ${cp('export')} :size="16" class="mr-2.5 text-(--s-text-secondary)" />
          <div class="flex-1 min-w-0">
            <div class="truncate">Export</div>
          </div>
          <SIcon ${cp('chevron-right')} :size="16" class="ml-4 shrink-0 text-(--s-text-tertiary)" />
        </div>
      </template>
    </SDropdown>

    <!-- Nested dropdown for Import -->
    <SDropdown
      :items="[
        { key: 'from-file', label: 'From File', icon: ${cv('file-upload')} },
        { key: 'from-url', label: 'From URL', icon: ${cv('link')} },
        { key: 'from-cloud', label: 'From Cloud', icon: ${cv('cloud-upload')} }
      ]"
      trigger="hover"
      placement="right-start"
      :width="200"
      :close-on-select="false"
    >
      <template #trigger>
        <div class="s-dropdown-item relative flex items-center cursor-pointer transition-all duration-150 select-none mx-1.5 rounded-lg px-3 py-2 text-sm text-(--s-text-primary) hover:bg-(--s-bg-tertiary)">
          <SIcon ${cp('import')} :size="16" class="mr-2.5 text-(--s-text-secondary)" />
          <div class="flex-1 min-w-0">
            <div class="truncate">Import</div>
          </div>
          <SIcon ${cp('chevron-right')} :size="16" class="ml-4 shrink-0 text-(--s-text-tertiary)" />
        </div>
      </template>
    </SDropdown>

    <SDropdownDivider />
    <SDropdownItem item-key="preferences" ${cp('cog')} label="Preferences" />
  </template>
</SDropdown>`)

// Inline code snippets (extracted from template)
const richCode = computed(() => `items = [
  { key: 'email', label: 'Send via Email', icon: ${cv('email')}, description: 'Send to email', shortcut: '⌘E' },
  { key: 'link', label: 'Copy Link', icon: ${cv('link-variant')}, shortcut: '⌘L' }
]

<SDropdown :items='items' label='Share' ${cp('share-variant')} :width='320' />`)

const groupedCode = computed(() => `items = [
  { key: 'header-view', header: 'View' },
  { key: 'list', label: 'List View', icon: ${cv('view-list')} },
  { key: 'header-sort', header: 'Sort By' },
  { key: 'name', label: 'Name', icon: ${cv('sort-alphabetical-ascending')} }
]

<SDropdown :items='items' label='Display Options' ${cp('tune')} :width='220' />`)

const kbdCode = computed(() => `<SDropdown>
  <template #trigger>
    <SButton variant="outlined">Edit Menu</SButton>
  </template>
  <template #default>
    <SDropdownItem item-key="cut" ${cp('content-cut')}>
      <div class="flex items-center justify-between w-full">
        <span>Cut</span>
        <SKbdShortcut :keys="['⌘', 'X']" size="xs" variant="flat" />
      </div>
    </SDropdownItem>
    <SDropdownItem item-key="copy" ${cp('content-copy')}>
      <div class="flex items-center justify-between w-full">
        <span>Copy</span>
        <SKbdShortcut :keys="['⌘', 'C']" size="xs" variant="flat" />
      </div>
    </SDropdownItem>
    <SDropdownItem item-key="paste" ${cp('content-paste')}>
      <div class="flex items-center justify-between w-full">
        <span>Paste</span>
        <SKbdShortcut :keys="['⌘', 'V']" size="xs" variant="flat" />
      </div>
    </SDropdownItem>
    <SDropdownDivider />
    <SDropdownItem item-key="select-all" ${cp('select-all')}>
      <div class="flex items-center justify-between w-full">
        <span>Select All</span>
        <SKbdShortcut :keys="['⌘', 'A']" size="xs" variant="flat" />
      </div>
    </SDropdownItem>
  </template>
</SDropdown>`)
</script>

<template>
  <div class="space-y-8 pb-20">
    <!-- @component SDropdown -->
    <!-- @props items, trigger, placement, size, variant, color, animation, closeOnSelect, disabled, arrow, maxHeight, width, minWidth, teleport, zIndex, showDelay, hideDelay, visible, searchable, searchPlaceholder, offset, label, icon, hideArrow -->
    <!-- @events update:visible, open, close, select -->
    <!-- @slots trigger, default, header, footer -->
    <!-- @sections features, basic-usage, using-slots, trigger-modes, sizes, variants, placement, animations, rich-menu-items, grouped-items, nested-dropdowns, checkable-items, searchable, custom-colors, real-world-examples, with-keyboard-shortcuts, api-reference -->
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-(--s-text-primary) mb-2">Dropdown</h1>
      <p class="text-lg text-(--s-text-secondary)">A versatile dropdown menu component for actions, navigation, and context menus with stunning animations.</p>
    </header>

    <!-- Features -->
    <article id="features" class="space-y-4">
      <h2 class="text-2xl font-bold text-(--s-text-primary)">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 rounded-xl bg-emerald-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <SIcon name="gesture-tap" :size="24" class="text-emerald-400" />
            <h3 class="font-semibold text-(--s-text-primary)">Multiple Triggers</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Click, hover, context menu, or manual control for maximum flexibility.</p>
        </div>
        <div class="p-4 rounded-xl bg-blue-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <SIcon name="animation-play" :size="24" class="text-blue-400" />
            <h3 class="font-semibold text-(--s-text-primary)">Rich Animations</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Fade, slide, scale, and reveal animations with smart placement.</p>
        </div>
        <div class="p-4 rounded-xl bg-rose-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <KeyboardIcon class="w-6 h-6 text-rose-400" />
            <h3 class="font-semibold text-(--s-text-primary)">Keyboard Navigation</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Full keyboard support with arrows, Enter, Escape, and shortcuts display.</p>
        </div>
        <div class="p-4 rounded-xl bg-violet-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <Search class="w-6 h-6 text-violet-400" />
            <h3 class="font-semibold text-(--s-text-primary)">Searchable Menu</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Built-in search filtering for long lists of options.</p>
        </div>
        <div class="p-4 rounded-xl bg-amber-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <SIcon name="checkbox-multiple-marked" :size="24" class="text-amber-400" />
            <h3 class="font-semibold text-(--s-text-primary)">Checkable Items</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Toggle items with visual checkmarks for settings menus.</p>
        </div>
        <div class="p-4 rounded-xl bg-cyan-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <Palette class="w-6 h-6 text-cyan-400" />
            <h3 class="font-semibold text-(--s-text-primary)">Customizable</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Sizes, variants, colors, and complete slot support for custom content.</p>
        </div>
      </div>
    </article>

    <!-- Basic Usage -->
    <section id="basic-usage">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-4">Basic Usage</h2>
      <DemoSection
        title="Simple Dropdown"
        description="Basic dropdown with items array. Click the button to open the menu."
        :code="basicCode"
        language="vue"
      >
        <div class="flex flex-wrap items-center gap-4">
          <SDropdown
            :items="basicItems"
            label="Actions"
            :icon="ri('menu')"
            @select="handleSelect"
          />
          <p v-if="lastSelected" class="text-sm text-(--s-text-secondary)">
            Selected: <code class="font-mono text-emerald-400">{{ lastSelected }}</code>
          </p>
        </div>
      </DemoSection>
    </section>

    <!-- With Slots -->
    <section id="using-slots">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-4">Using Slots</h2>
      <DemoSection
        title="Custom Content with Slots"
        description="Use slots for custom triggers and menu items with full control."
        :code="slotCode"
        language="vue"
      >
        <div class="flex flex-wrap items-center gap-4">
          <!-- Custom trigger -->
          <SDropdown @select="handleSelect">
            <template #trigger>
              <SButton class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                <SIcon :icon="ri('rocket-launch')" :size="16" />
                Quick Actions
              </SButton>
            </template>

            <SDropdownItem item-key="new" :icon="ri('plus')" label="Create New" description="Start a new project" />
            <SDropdownItem item-key="import" :icon="ri('import')" label="Import" description="Import existing project" />
            <SDropdownDivider />
            <SDropdownGroup label="Recent">
              <SDropdownItem item-key="project-1" :icon="ri('folder')" label="My Project" />
              <SDropdownItem item-key="project-2" :icon="ri('folder')" label="Design System" />
            </SDropdownGroup>
          </SDropdown>

          <!-- Icon-only trigger -->
          <SDropdown :items="basicItems" hide-arrow @select="handleSelect">
            <template #trigger>
              <SButton variant="ghost" iconOnly class="border border-(--s-border)">
                <SIcon :icon="ri('dots-vertical')" :size="20" />
              </SButton>
            </template>
          </SDropdown>
        </div>
      </DemoSection>
    </section>

    <!-- Trigger Modes -->
    <section id="trigger-modes">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-4">Trigger Modes</h2>
      <DemoSection
        title="Click, Hover & Context Menu"
        description="Different ways to trigger the dropdown menu."
        :code="hoverCode"
        language="vue"
      >
        <div class="flex flex-wrap items-center gap-4">
          <SDropdown
            :items="basicItems"
            trigger="click"
            label="Click"
            :icon="ri('cursor-default-click')"
          />
          <SDropdown
            :items="basicItems"
            trigger="hover"
            label="Hover"
            :icon="ri('cursor-default')"
            :show-delay="100"
            :hide-delay="200"
          />
          <SDropdown
            :items="basicItems"
            trigger="context"
          >
            <template #trigger>
              <div class="px-6 py-4 border-2 border-dashed border-(--s-border) rounded-xl text-(--s-text-secondary) text-sm hover:border-(--s-border-hover) transition-colors cursor-context-menu">
                <SIcon :icon="ri('mouse-right-click')" :size="16" class="mr-2" />
                Right-click me
              </div>
            </template>
          </SDropdown>
        </div>
      </DemoSection>
    </section>

    <!-- Sizes -->
    <section id="sizes">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-4">Sizes</h2>
      <DemoSection
        title="Size Variants"
        description="Three size options: small, medium (default), and large."
        :code="`<SDropdown :items='items' size='small' label='Small' />
<SDropdown :items='items' size='medium' label='Medium' />
<SDropdown :items='items' size='large' label='Large' />`"
        language="vue"
      >
        <div class="flex flex-wrap items-center gap-4">
          <SDropdown :items="basicItems" size="small" label="Small" />
          <SDropdown :items="basicItems" size="medium" label="Medium" />
          <SDropdown :items="basicItems" size="large" label="Large" />
        </div>
      </DemoSection>
    </section>

    <!-- Variants -->
    <section id="variants">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-4">Variants</h2>
      <DemoSection
        title="Visual Variants"
        description="Different visual styles for the dropdown menu."
        :code="`<SDropdown :items='items' variant='default' label='Default' />
<SDropdown :items='items' variant='filled' label='Filled' />
<SDropdown :items='items' variant='glass' label='Glass' />`"
        language="vue"
      >
        <div class="flex flex-wrap items-center gap-4">
          <SDropdown :items="basicItems" variant="default" label="Default" />
          <SDropdown :items="basicItems" variant="filled" label="Filled" />
          <SDropdown :items="basicItems" variant="glass" label="Glass" />
        </div>
      </DemoSection>
    </section>

    <!-- Placement -->
    <section id="placement">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-4">Placement</h2>
      <DemoSection
        title="Menu Positioning"
        description="12 placement options with automatic flip when near viewport edges."
        :code="placementCode"
        language="vue"
      >
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 py-8">
          <div class="flex justify-center">
            <SDropdown :items="basicItems" placement="top-start" label="Top Start" />
          </div>
          <div class="flex justify-center">
            <SDropdown :items="basicItems" placement="top" label="Top" />
          </div>
          <div class="flex justify-center">
            <SDropdown :items="basicItems" placement="top-end" label="Top End" />
          </div>
          <div></div>

          <div class="flex justify-start">
            <SDropdown :items="basicItems" placement="left-start" label="Left" />
          </div>
          <div></div>
          <div></div>
          <div class="flex justify-end">
            <SDropdown :items="basicItems" placement="right-start" label="Right" />
          </div>

          <div class="flex justify-center">
            <SDropdown :items="basicItems" placement="bottom-start" label="Bottom Start" />
          </div>
          <div class="flex justify-center">
            <SDropdown :items="basicItems" placement="bottom" label="Bottom" />
          </div>
          <div class="flex justify-center">
            <SDropdown :items="basicItems" placement="bottom-end" label="Bottom End" />
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Animations -->
    <section id="animations">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-4">Animations</h2>
      <DemoSection
        title="Animation Types"
        description="Four beautiful animation styles for menu transitions."
        :code="animationCode"
        language="vue"
      >
        <div class="flex flex-wrap items-center gap-4">
          <SDropdown :items="basicItems" animation="fade" label="Fade" :icon="ri('blur')" />
          <SDropdown :items="basicItems" animation="slide" label="Slide" :icon="ri('arrow-expand-down')" />
          <SDropdown :items="basicItems" animation="scale" label="Scale" :icon="ri('resize')" />
          <SDropdown :items="basicItems" animation="reveal" label="Reveal" :icon="ri('blur-radial')" />
        </div>
      </DemoSection>
    </section>

    <!-- Rich Items -->
    <section id="rich-menu-items">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-4">Rich Menu Items</h2>
      <DemoSection
        title="Icons, Descriptions & Shortcuts"
        description="Menu items with leading icons, descriptions, and keyboard shortcuts."
        :code="richCode"
        language="javascript"
      >
        <div class="flex flex-wrap items-center gap-4">
          <SDropdown
            :items="richItems"
            label="Share"
            :icon="ri('share-variant')"
            :width="320"
          />

          <SDropdown
            :items="navItems"
            :width="280"
          >
            <template #trigger>
              <div class="flex items-center gap-3 px-3 py-2 bg-(--s-bg-secondary) rounded-xl border border-(--s-border) cursor-pointer hover:border-(--s-border-hover) transition-colors">
                <img src="https://i.pravatar.cc/100?img=3" alt="Avatar" class="w-8 h-8 rounded-full">
                <div class="text-left">
                  <div class="text-sm font-medium text-(--s-text-primary)">John Doe</div>
                  <div class="text-xs text-(--s-text-tertiary)">john@example.com</div>
                </div>
                <SIcon :icon="ri('chevron-down')" :size="16" class="text-(--s-text-tertiary)" />
              </div>
            </template>
          </SDropdown>
        </div>
      </DemoSection>
    </section>

    <!-- Grouped Items -->
    <section id="grouped-items">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-4">Grouped Items</h2>
      <DemoSection
        title="Section Headers"
        description="Organize menu items into groups with headers."
        :code="groupedCode"
        language="javascript"
      >
        <SDropdown
          :items="groupedItems"
          label="Display Options"
          :icon="ri('tune')"
          :width="220"
        />
      </DemoSection>
    </section>

    <!-- Nested Dropdowns -->
    <section id="nested-dropdowns">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-4">Nested Dropdowns</h2>
      <DemoSection
        title="Submenus with Nested Dropdowns"
        description="Create nested dropdown menus using slots. Perfect for complex navigation structures."
        :code="nestedCode"
        language="vue"
      >
        <SDropdown
          label="File"
          :icon="ri('file-document')"
          :width="220"
          :close-on-select="false"
        >
          <template #default>
            <SDropdownItem item-key="new" :icon="ri('file-plus')" label="New" />
            <SDropdownItem item-key="open" :icon="ri('folder-open')" label="Open" />
            <SDropdownDivider />

            <!-- Nested dropdown for Share -->
            <SDropdown
              :items="shareSubItems"
              trigger="hover"
              placement="right-start"
              :width="200"
              :close-on-select="false"
            >
              <template #trigger>
                <div class="s-dropdown-item relative flex items-center cursor-pointer transition-all duration-150 select-none mx-1.5 rounded-lg px-3 py-2 text-sm text-(--s-text-primary) hover:bg-(--s-bg-tertiary)">
                  <SIcon :icon="ri('share-variant')" :size="16" class="mr-2.5 text-(--s-text-secondary)" />
                  <div class="flex-1 min-w-0">
                    <div class="truncate">Share</div>
                  </div>
                  <SIcon :icon="ri('chevron-right')" :size="16" class="ml-4 shrink-0 text-(--s-text-tertiary)" />
                </div>
              </template>
            </SDropdown>

            <SDropdownDivider />

            <!-- Nested dropdown for Export -->
            <SDropdown
              :items="exportSubItems"
              trigger="hover"
              placement="right-start"
              :width="220"
              :close-on-select="false"
            >
              <template #trigger>
                <div class="s-dropdown-item relative flex items-center cursor-pointer transition-all duration-150 select-none mx-1.5 rounded-lg px-3 py-2 text-sm text-(--s-text-primary) hover:bg-(--s-bg-tertiary)">
                  <SIcon :icon="ri('export')" :size="16" class="mr-2.5 text-(--s-text-secondary)" />
                  <div class="flex-1 min-w-0">
                    <div class="truncate">Export</div>
                  </div>
                  <SIcon :icon="ri('chevron-right')" :size="16" class="ml-4 shrink-0 text-(--s-text-tertiary)" />
                </div>
              </template>
            </SDropdown>

            <!-- Nested dropdown for Import -->
            <SDropdown
              :items="importSubItems"
              trigger="hover"
              placement="right-start"
              :width="200"
              :close-on-select="false"
            >
              <template #trigger>
                <div class="s-dropdown-item relative flex items-center cursor-pointer transition-all duration-150 select-none mx-1.5 rounded-lg px-3 py-2 text-sm text-(--s-text-primary) hover:bg-(--s-bg-tertiary)">
                  <SIcon :icon="ri('import')" :size="16" class="mr-2.5 text-(--s-text-secondary)" />
                  <div class="flex-1 min-w-0">
                    <div class="truncate">Import</div>
                  </div>
                  <SIcon :icon="ri('chevron-right')" :size="16" class="ml-4 shrink-0 text-(--s-text-tertiary)" />
                </div>
              </template>
            </SDropdown>

            <SDropdownDivider />
            <SDropdownItem item-key="preferences" :icon="ri('cog')" label="Preferences" />
          </template>
        </SDropdown>
      </DemoSection>
    </section>

    <!-- Checkable Items -->
    <section id="checkable-items">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-4">Checkable Items</h2>
      <DemoSection
        title="Toggle States"
        description="Items with checkbox states for settings and toggle menus."
        :code="checkableCode"
        language="vue"
      >
        <SDropdown
          :items="checkableItems"
          label="Format"
          :icon="ri('format-text')"
          :width="220"
          :close-on-select="false"
          @select="toggleCheckable"
        />
      </DemoSection>
    </section>

    <!-- Searchable -->
    <section id="searchable">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-4">Searchable</h2>
      <DemoSection
        title="Search & Filter"
        description="Built-in search for filtering through long lists."
        :code="searchableCode"
        language="vue"
      >
        <SDropdown
          :items="countryItems"
          searchable
          search-placeholder="Search countries..."
          label="Select Country"
          :icon="ri('earth')"
          :width="260"
          max-height="280px"
        />
      </DemoSection>
    </section>

    <!-- Colors -->
    <section id="custom-colors">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-4">Custom Colors</h2>
      <DemoSection
        title="Accent Colors"
        description="Customize the accent color for checked items and highlights."
        :code="`<SDropdown :items='items' color='#3b82f6' label='Blue' :close-on-select='false' />
<SDropdown :items='items' color='#ec4899' label='Pink' :close-on-select='false' />
<SDropdown :items='items' color='#f59e0b' label='Amber' :close-on-select='false' />`"
        language="vue"
      >
        <div class="flex flex-wrap items-center gap-4">
          <SDropdown :items="checkableItems" color="#3b82f6" label="Blue" :close-on-select="false" @select="toggleCheckable" />
          <SDropdown :items="checkableItems" color="#ec4899" label="Pink" :close-on-select="false" @select="toggleCheckable" />
          <SDropdown :items="checkableItems" color="#f59e0b" label="Amber" :close-on-select="false" @select="toggleCheckable" />
        </div>
      </DemoSection>
    </section>

    <!-- File Menu Example -->
    <section id="real-world-examples">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-4">Real-World Examples</h2>
      <DemoSection
        title="Application Menu Bar"
        description="A typical desktop application menu bar with file, edit, and view menus."
        :code="`<SDropdown :items='fileActions' variant='filled' :width='240' hide-arrow>
  <template #trigger>
    <SButton variant='ghost' size='small'>File</SButton>
  </template>
</SDropdown>
<SDropdown :items='editItems' variant='filled' :width='200' hide-arrow>
  <template #trigger>
    <SButton variant='ghost' size='small'>Edit</SButton>
  </template>
</SDropdown>
<SDropdown :items='viewItems' variant='filled' :width='220' hide-arrow>
  <template #trigger>
    <SButton variant='ghost' size='small'>View</SButton>
  </template>
</SDropdown>`"
        language="vue"
      >
        <div class="p-4 bg-(--s-bg-secondary) rounded-xl border border-(--s-border)">
          <div class="flex items-center gap-1 p-1 bg-(--s-bg-tertiary) rounded-lg w-fit">
            <SDropdown
              :items="fileActions"
              variant="filled"
              :width="240"
              hide-arrow
            >
              <template #trigger>
                <SButton variant="ghost" size="small">File</SButton>
              </template>
            </SDropdown>
            <SDropdown
              :items="editMenuItems"
              variant="filled"
              :width="200"
              hide-arrow
            >
              <template #trigger>
                <SButton variant="ghost" size="small">Edit</SButton>
              </template>
            </SDropdown>
            <SDropdown
              :items="groupedItems"
              variant="filled"
              :width="220"
              hide-arrow
            >
              <template #trigger>
                <SButton variant="ghost" size="small">View</SButton>
              </template>
            </SDropdown>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- With Keyboard Shortcuts -->
    <section id="with-keyboard-shortcuts">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">With Keyboard Shortcuts</h2>
      <DemoSection
        title="Menu Items with Shortcuts"
        description="Use SKbdShortcut inside dropdown items to display keyboard shortcut hints."
        :code="kbdCode"
        language="vue"
      >
        <SDropdown>
          <template #trigger>
            <SButton variant="outlined">Edit Menu</SButton>
          </template>
          <template #default>
            <SDropdownItem item-key="cut" :icon="ri('content-cut')">
              <div class="flex items-center justify-between w-full">
                <span>Cut</span>
                <SKbdShortcut :keys="['⌘', 'X']" size="xs" variant="flat" />
              </div>
            </SDropdownItem>
            <SDropdownItem item-key="copy" :icon="ri('content-copy')">
              <div class="flex items-center justify-between w-full">
                <span>Copy</span>
                <SKbdShortcut :keys="['⌘', 'C']" size="xs" variant="flat" />
              </div>
            </SDropdownItem>
            <SDropdownItem item-key="paste" :icon="ri('content-paste')">
              <div class="flex items-center justify-between w-full">
                <span>Paste</span>
                <SKbdShortcut :keys="['⌘', 'V']" size="xs" variant="flat" />
              </div>
            </SDropdownItem>
            <SDropdownDivider />
            <SDropdownItem item-key="select-all" :icon="ri('select-all')">
              <div class="flex items-center justify-between w-full">
                <span>Select All</span>
                <SKbdShortcut :keys="['⌘', 'A']" size="xs" variant="flat" />
              </div>
            </SDropdownItem>
          </template>
        </SDropdown>
      </DemoSection>
    </section>

    <!-- API Reference -->
    <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">API Reference</h2>
    <SApiSection>
      <div class="space-y-8">
        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <SIcon name="menu-down" :size="16" class="text-(--s-primary)" />
            SDropdown
          </h3>
          <SApiTable
            title="Props"
            type="props"
            :props="([
              { name: 'items', type: 'DropdownMenuItem[]', default: 'undefined', description: 'Array of menu items (alternative to slots)', category: 'Core' },
              { name: 'trigger', type: '\'click\' | \'hover\' | \'context\' | \'manual\'', default: '\'click\'', description: 'How to trigger the dropdown', category: 'Core' },
              { name: 'placement', type: 'DropdownPlacement', default: '\'bottom-start\'', description: 'Menu placement (12 options)', category: 'Positioning' },
              { name: 'size', type: '\'small\' | \'medium\' | \'large\'', default: '\'medium\'', description: 'Component size', category: 'Appearance' },
              { name: 'variant', type: '\'default\' | \'filled\' | \'glass\'', default: '\'default\'', description: 'Visual variant style', category: 'Appearance' },
              { name: 'color', type: 'string', default: 'var(--s-primary)', description: 'Accent color for checked items', category: 'Appearance' },
              { name: 'animation', type: '\'fade\' | \'slide\' | \'scale\' | \'reveal\'', default: '\'scale\'', description: 'Animation type', category: 'Appearance' },
              { name: 'closeOnSelect', type: 'boolean', default: 'true', description: 'Close menu when item is selected', category: 'Behavior' },
              { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the dropdown', category: 'Behavior' },
              { name: 'arrow', type: 'boolean', default: 'false', description: 'Show arrow pointing to trigger', category: 'Appearance' },
              { name: 'maxHeight', type: 'string', default: '\'320px\'', description: 'Maximum menu height', category: 'Appearance' },
              { name: 'width', type: 'number | string', default: 'undefined', description: 'Fixed menu width', category: 'Appearance' },
              { name: 'minWidth', type: 'string', default: '\'180px\'', description: 'Minimum menu width', category: 'Appearance' },
              { name: 'teleport', type: 'boolean | string', default: 'true', description: 'Teleport target for menu', category: 'Rendering' },
              { name: 'zIndex', type: 'number', default: '1000', description: 'Z-index for dropdown', category: 'Rendering' },
              { name: 'showDelay', type: 'number', default: '100', description: 'Delay before showing (hover)', category: 'Timing' },
              { name: 'hideDelay', type: 'number', default: '150', description: 'Delay before hiding (hover)', category: 'Timing' },
              { name: 'visible', type: 'boolean', default: 'undefined', description: 'Manual visibility control', category: 'Control' },
              { name: 'searchable', type: 'boolean', default: 'false', description: 'Enable search filtering', category: 'Features' },
              { name: 'searchPlaceholder', type: 'string', default: '\'Search...\'', description: 'Search input placeholder', category: 'Features' },
              { name: 'offset', type: 'number', default: '6', description: 'Offset from trigger (px)', category: 'Positioning' },
              { name: 'label', type: 'string', default: 'undefined', description: 'Default trigger button text', category: 'Trigger' },
              { name: 'icon', type: 'string', default: 'undefined', description: 'Default trigger button icon', category: 'Trigger' },
              { name: 'hideArrow', type: 'boolean', default: 'false', description: 'Hide chevron on trigger button', category: 'Trigger' }
            ] as ApiProp[])"
          />
          <SApiTable
            title="DropdownMenuItem Interface"
            type="props"
            :props="([
              { name: 'key', type: 'string', default: '-', description: 'Unique identifier for the item' },
              { name: 'label', type: 'string', default: '-', description: 'Display text' },
              { name: 'icon', type: 'IconProp', default: 'undefined', description: 'Leading icon (MDI name or Lucide component)' },
              { name: 'trailingIcon', type: 'IconProp', default: 'undefined', description: 'Trailing icon' },
              { name: 'description', type: 'string', default: 'undefined', description: 'Description text below label' },
              { name: 'shortcut', type: 'string', default: 'undefined', description: 'Keyboard shortcut display' },
              { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the item' },
              { name: 'danger', type: 'boolean', default: 'false', description: 'Destructive action styling' },
              { name: 'checked', type: 'boolean', default: 'undefined', description: 'Checkable state' },
              { name: 'divider', type: 'boolean', default: 'false', description: 'Render as divider line' },
              { name: 'header', type: 'string', default: 'undefined', description: 'Render as section header' },
              { name: 'onClick', type: '() => void', default: 'undefined', description: 'Click handler' }
            ] as ApiProp[])"
            class="mt-6"
          />
          <SApiTable
            title="Events"
            type="events"
            :events="([
              { name: 'update:visible', payload: 'boolean', description: 'Visibility changed (for v-model:visible)' },
              { name: 'open', payload: '-', description: 'Dropdown opened' },
              { name: 'close', payload: '-', description: 'Dropdown closed' },
              { name: 'select', payload: '(key: string, item?: DropdownMenuItem)', description: 'Item selected' }
            ] as ApiEvent[])"
            class="mt-6"
          />
          <SApiTable
            title="Slots"
            type="slots"
            :slots="([
              { name: 'trigger', props: '-', description: 'Custom trigger element' },
              { name: 'default', props: '-', description: 'Menu content (SDropdownItem children)' },
              { name: 'header', props: '-', description: 'Content above menu items' },
              { name: 'footer', props: '-', description: 'Content below menu items' }
            ] as ApiSlot[])"
            class="mt-6"
          />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <SIcon name="menu-right" :size="16" class="text-(--s-primary)" />
            SDropdownItem
          </h3>
          <SApiTable
            title="Props"
            type="props"
            :props="([
              { name: 'itemKey', type: 'string', default: '-', description: 'Unique key (required)' },
              { name: 'label', type: 'string', default: 'undefined', description: 'Item text' },
              { name: 'icon', type: 'string', default: 'undefined', description: 'Leading icon' },
              { name: 'trailingIcon', type: 'string', default: 'undefined', description: 'Trailing icon' },
              { name: 'description', type: 'string', default: 'undefined', description: 'Description text' },
              { name: 'shortcut', type: 'string', default: 'undefined', description: 'Keyboard shortcut' },
              { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the item' },
              { name: 'danger', type: 'boolean', default: 'false', description: 'Danger styling' },
              { name: 'checked', type: 'boolean', default: 'undefined', description: 'Checkable state' },
              { name: 'color', type: 'string', default: 'undefined', description: 'Custom accent color' }
            ] as ApiProp[])"
          />
          <SApiTable
            title="Events"
            type="events"
            :events="([
              { name: 'click', payload: 'MouseEvent', description: 'Emitted when the item is activated' },
              { name: 'update:checked', payload: 'boolean', description: 'Emitted when a checkable item toggles' }
            ] as ApiEvent[])"
            class="mt-6"
          />
          <SApiTable
            title="Slots"
            type="slots"
            :slots="([
              { name: 'default', props: '-', description: 'Custom primary item content' },
              { name: 'trailing', props: '-', description: 'Trailing content after shortcuts and icons' }
            ] as ApiSlot[])"
            class="mt-6"
          />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <SIcon name="minus" :size="16" class="text-(--s-primary)" />
            SDropdownDivider
          </h3>
          <SApiTable
            title="Props"
            type="props"
            :props="([
              { name: 'margin', type: 'string', default: '\'4px\'', description: 'Vertical spacing above and below the divider' }
            ] as ApiProp[])"
          />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <SIcon name="folder-multiple-outline" :size="16" class="text-(--s-primary)" />
            SDropdownGroup
          </h3>
          <SApiTable
            title="Props"
            type="props"
            :props="([
              { name: 'label', type: 'string', default: '-', description: 'Required. Group header label' },
              { name: 'icon', type: 'string', default: 'undefined', description: 'Optional icon shown next to the group label' }
            ] as ApiProp[])"
          />
          <SApiTable
            title="Slots"
            type="slots"
            :slots="([
              { name: 'default', props: '-', description: 'Grouped dropdown items rendered below the label' }
            ] as ApiSlot[])"
            class="mt-6"
          />
        </div>

        <div>
          <SApiKeyboard
            title="Keyboard Navigation"
            :shortcuts="([
              { keys: ['Enter', 'Space'], action: 'Open dropdown or select highlighted item' },
              { keys: 'Escape', action: 'Close dropdown' },
              { keys: ['↓', '↑'], action: 'Navigate through menu items' },
              { keys: ['Home', 'End'], action: 'Jump to first/last item' },
              { keys: 'Tab', action: 'Close dropdown and move focus' }
            ] as KeyboardShortcut[])"
          />
        </div>
      </div>
    </SApiSection>
  </div>
</template>
