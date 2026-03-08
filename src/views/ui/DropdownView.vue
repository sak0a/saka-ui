<script setup lang="ts">
import { ref } from 'vue'
import { SDropdown, SDropdownItem, SDropdownDivider, SDropdownGroup, SKbd, SKbdShortcut, SButton, SApiSection, SApiTable, SApiKeyboard } from '../../index'
import type { ApiProp, ApiEvent, ApiSlot, KeyboardShortcut } from '../../index'
import type { DropdownMenuItem } from '../../components/ui/dropdown/SDropdown.vue'
import DemoSection from '../../components/DemoSection.vue'
import { Pencil, Copy, Archive, Trash2, Mail, Link, Code, QrCode, Search, Palette, Keyboard as KeyboardIcon } from 'lucide-vue-next'

// Basic items
const basicItems: DropdownMenuItem[] = [
  { key: 'edit', label: 'Edit', icon: Pencil },
  { key: 'duplicate', label: 'Duplicate', icon: Copy },
  { key: 'archive', label: 'Archive', icon: Archive },
  { key: 'divider1', divider: true },
  { key: 'delete', label: 'Delete', icon: Trash2, danger: true }
]

// Items with descriptions
const richItems: DropdownMenuItem[] = [
  { key: 'email', label: 'Send via Email', icon: Mail, description: 'Send to recipient email address', shortcut: '⌘E' },
  { key: 'link', label: 'Copy Link', icon: Link, description: 'Copy shareable link to clipboard', shortcut: '⌘L' },
  { key: 'embed', label: 'Embed', icon: Code, description: 'Get embed code for websites' },
  { key: 'divider1', divider: true },
  { key: 'qr', label: 'Generate QR Code', icon: QrCode, description: 'Create scannable QR code' }
]

// Grouped items
const groupedItems: DropdownMenuItem[] = [
  { key: 'header-view', header: 'View' },
  { key: 'list', label: 'List View', icon: 'view-list' },
  { key: 'grid', label: 'Grid View', icon: 'view-grid' },
  { key: 'kanban', label: 'Kanban Board', icon: 'view-column' },
  { key: 'header-sort', header: 'Sort By' },
  { key: 'name', label: 'Name', icon: 'sort-alphabetical-ascending' },
  { key: 'date', label: 'Date Modified', icon: 'calendar' },
  { key: 'size', label: 'Size', icon: 'chart-bar' }
]

// Nested dropdown items
const nestedItems: DropdownMenuItem[] = [
  { key: 'new', label: 'New', icon: 'file-plus' },
  { key: 'open', label: 'Open', icon: 'folder-open' },
  { key: 'divider1', divider: true },
  { key: 'export', label: 'Export', icon: 'export' },
  { key: 'import', label: 'Import', icon: 'import' },
  { key: 'divider2', divider: true },
  { key: 'share', label: 'Share', icon: 'share-variant' },
  { key: 'divider3', divider: true },
  { key: 'preferences', label: 'Preferences', icon: 'cog' }
]

// Checkable items
const checkableItems = ref<DropdownMenuItem[]>([
  { key: 'bold', label: 'Bold', icon: 'format-bold', checked: true, shortcut: '⌘B' },
  { key: 'italic', label: 'Italic', icon: 'format-italic', checked: false, shortcut: '⌘I' },
  { key: 'underline', label: 'Underline', icon: 'format-underline', checked: true, shortcut: '⌘U' },
  { key: 'divider1', divider: true },
  { key: 'strike', label: 'Strikethrough', icon: 'format-strikethrough', checked: false }
])

const toggleCheckable = (key: string) => {
  const item = checkableItems.value.find(i => i.key === key)
  if (item && item.checked !== undefined) {
    item.checked = !item.checked
  }
}

// Navigation items
const navItems: DropdownMenuItem[] = [
  { key: 'profile', label: 'Profile', icon: 'account', description: 'View and edit your profile' },
  { key: 'settings', label: 'Settings', icon: 'cog', description: 'Manage preferences' },
  { key: 'billing', label: 'Billing', icon: 'credit-card', description: 'Subscription & payments' },
  { key: 'team', label: 'Team', icon: 'account-group', description: 'Manage team members' },
  { key: 'divider1', divider: true },
  { key: 'docs', label: 'Documentation', icon: 'book-open-variant', trailingIcon: 'open-in-new' },
  { key: 'support', label: 'Support', icon: 'lifebuoy', trailingIcon: 'open-in-new' },
  { key: 'divider2', divider: true },
  { key: 'logout', label: 'Sign out', icon: 'logout', danger: true }
]

// File actions
const fileActions: DropdownMenuItem[] = [
  { key: 'new-file', label: 'New File', icon: 'file-plus', shortcut: '⌘N' },
  { key: 'new-folder', label: 'New Folder', icon: 'folder-plus', shortcut: '⌘⇧N' },
  { key: 'divider1', divider: true },
  { key: 'upload', label: 'Upload File', icon: 'upload', shortcut: '⌘U' },
  { key: 'import', label: 'Import', icon: 'import', description: 'Import from external source' },
  { key: 'divider2', divider: true },
  { key: 'download', label: 'Download All', icon: 'download' }
]

// Colors for demo
const colorItems: DropdownMenuItem[] = [
  { key: 'red', label: 'Red', icon: 'circle' },
  { key: 'orange', label: 'Orange', icon: 'circle' },
  { key: 'yellow', label: 'Yellow', icon: 'circle' },
  { key: 'green', label: 'Green', icon: 'circle' },
  { key: 'blue', label: 'Blue', icon: 'circle' },
  { key: 'purple', label: 'Purple', icon: 'circle' }
]

// Large list for searchable demo
const countryItems: DropdownMenuItem[] = [
  { key: 'us', label: 'United States', icon: 'flag' },
  { key: 'uk', label: 'United Kingdom', icon: 'flag' },
  { key: 'de', label: 'Germany', icon: 'flag' },
  { key: 'fr', label: 'France', icon: 'flag' },
  { key: 'es', label: 'Spain', icon: 'flag' },
  { key: 'it', label: 'Italy', icon: 'flag' },
  { key: 'jp', label: 'Japan', icon: 'flag' },
  { key: 'cn', label: 'China', icon: 'flag' },
  { key: 'kr', label: 'South Korea', icon: 'flag' },
  { key: 'br', label: 'Brazil', icon: 'flag' },
  { key: 'au', label: 'Australia', icon: 'flag' },
  { key: 'ca', label: 'Canada', icon: 'flag' },
  { key: 'mx', label: 'Mexico', icon: 'flag' },
  { key: 'in', label: 'India', icon: 'flag' },
  { key: 'ru', label: 'Russia', icon: 'flag' }
]

// Event handling
const lastSelected = ref<string | null>(null)

const handleSelect = (key: string) => {
  lastSelected.value = key
}

// Code snippets
const basicCode = `<script setup>
import { SDropdown } from 'saka-ui'

const items = [
  { key: 'edit', label: 'Edit', icon: 'pencil' },
  { key: 'duplicate', label: 'Duplicate', icon: 'content-copy' },
  { key: 'archive', label: 'Archive', icon: 'archive' },
  { key: 'divider1', divider: true },
  { key: 'delete', label: 'Delete', icon: 'delete', danger: true }
]
<\/script>

<template>
  <SDropdown :items="items" label="Actions" icon="menu" />
</template>`

const slotCode = `<SDropdown>
  <template #trigger>
    <SButton class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
      <span class="mdi mdi-rocket-launch"></span>
      Quick Actions
    </SButton>
  </template>

  <SDropdownItem item-key="new" icon="plus" label="Create New" description="Start a new project" />
  <SDropdownItem item-key="import" icon="import" label="Import" description="Import existing project" />
  <SDropdownDivider />
  <SDropdownGroup label="Recent">
    <SDropdownItem item-key="project-1" icon="folder" label="My Project" />
    <SDropdownItem item-key="project-2" icon="folder" label="Design System" />
  </SDropdownGroup>
</SDropdown>`

const hoverCode = `<SDropdown
  :items="items"
  trigger="click"
  label="Click"
  icon="cursor-default-click"
/>
<SDropdown
  :items="items"
  trigger="hover"
  label="Hover"
  icon="cursor-default"
  :show-delay="100"
  :hide-delay="200"
/>
<SDropdown :items="items" trigger="context">
  <template #trigger>
    <div class="px-6 py-4 border-2 border-dashed border-(--s-border) rounded-xl text-(--s-text-secondary) text-sm hover:border-(--s-border-hover) transition-colors cursor-context-menu">
      <span class="mdi mdi-mouse-right-click mr-2"></span>
      Right-click me
    </div>
  </template>
</SDropdown>`

const placementCode = `<SDropdown :items="items" placement="top-start" label="Top Start" />
<SDropdown :items="items" placement="top" label="Top" />
<SDropdown :items="items" placement="top-end" label="Top End" />
<SDropdown :items="items" placement="left-start" label="Left" />
<SDropdown :items="items" placement="right-start" label="Right" />
<SDropdown :items="items" placement="bottom-start" label="Bottom Start" />
<SDropdown :items="items" placement="bottom" label="Bottom" />
<SDropdown :items="items" placement="bottom-end" label="Bottom End" />`

const animationCode = `<SDropdown :items="items" animation="fade" label="Fade" icon="blur" />
<SDropdown :items="items" animation="slide" label="Slide" icon="arrow-expand-down" />
<SDropdown :items="items" animation="scale" label="Scale" icon="resize" />
<SDropdown :items="items" animation="reveal" label="Reveal" icon="blur-radial" />`

const searchableCode = `<SDropdown
  :items="countryItems"
  searchable
  search-placeholder="Search countries..."
  label="Select Country"
  icon="earth"
  :width="260"
  max-height="280px"
/>`

const checkableCode = `<script setup>
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
    icon="format-text"
    :width="220"
    :close-on-select="false"
    @select="onSelect"
  />
</template>`

const nestedCode = `<SDropdown label="File" icon="file-document" :width="220" :close-on-select="false">
  <template #default>
    <SDropdownItem item-key="new" icon="file-plus" label="New" />
    <SDropdownItem item-key="open" icon="folder-open" label="Open" />
    <SDropdownDivider />

    <!-- Nested dropdown for Share -->
    <SDropdown
      :items="[
        { key: 'email', label: 'Email', icon: 'email' },
        { key: 'link', label: 'Copy Link', icon: 'link-variant' },
        { key: 'social', label: 'Social Media', icon: 'share-variant' }
      ]"
      trigger="hover"
      placement="right-start"
      :width="200"
      :close-on-select="false"
    >
      <template #trigger>
        <div class="s-dropdown-item relative flex items-center cursor-pointer transition-all duration-150 select-none mx-1.5 rounded-lg px-3 py-2 text-sm text-(--s-text-primary) hover:bg-(--s-bg-tertiary)">
          <span class="mdi mdi-share-variant text-base mr-2.5 text-(--s-text-secondary)"></span>
          <div class="flex-1 min-w-0">
            <div class="truncate">Share</div>
          </div>
          <span class="mdi mdi-chevron-right text-base ml-4 shrink-0 text-(--s-text-tertiary)"></span>
        </div>
      </template>
    </SDropdown>

    <SDropdownDivider />

    <!-- Nested dropdown for Export -->
    <SDropdown
      :items="[
        { key: 'pdf', label: 'Export as PDF', icon: 'file-pdf-box' },
        { key: 'docx', label: 'Export as DOCX', icon: 'file-word-box' },
        { key: 'xlsx', label: 'Export as XLSX', icon: 'file-excel-box' },
        { key: 'csv', label: 'Export as CSV', icon: 'file-delimited' }
      ]"
      trigger="hover"
      placement="right-start"
      :width="220"
      :close-on-select="false"
    >
      <template #trigger>
        <div class="s-dropdown-item relative flex items-center cursor-pointer transition-all duration-150 select-none mx-1.5 rounded-lg px-3 py-2 text-sm text-(--s-text-primary) hover:bg-(--s-bg-tertiary)">
          <span class="mdi mdi-export text-base mr-2.5 text-(--s-text-secondary)"></span>
          <div class="flex-1 min-w-0">
            <div class="truncate">Export</div>
          </div>
          <span class="mdi mdi-chevron-right text-base ml-4 shrink-0 text-(--s-text-tertiary)"></span>
        </div>
      </template>
    </SDropdown>

    <!-- Nested dropdown for Import -->
    <SDropdown
      :items="[
        { key: 'from-file', label: 'From File', icon: 'file-upload' },
        { key: 'from-url', label: 'From URL', icon: 'link' },
        { key: 'from-cloud', label: 'From Cloud', icon: 'cloud-upload' }
      ]"
      trigger="hover"
      placement="right-start"
      :width="200"
      :close-on-select="false"
    >
      <template #trigger>
        <div class="s-dropdown-item relative flex items-center cursor-pointer transition-all duration-150 select-none mx-1.5 rounded-lg px-3 py-2 text-sm text-(--s-text-primary) hover:bg-(--s-bg-tertiary)">
          <span class="mdi mdi-import text-base mr-2.5 text-(--s-text-secondary)"></span>
          <div class="flex-1 min-w-0">
            <div class="truncate">Import</div>
          </div>
          <span class="mdi mdi-chevron-right text-base ml-4 shrink-0 text-(--s-text-tertiary)"></span>
        </div>
      </template>
    </SDropdown>

    <SDropdownDivider />
    <SDropdownItem item-key="preferences" icon="cog" label="Preferences" />
  </template>
</SDropdown>`
</script>

<template>
  <div class="space-y-8 pb-20">
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-(--s-text-primary) mb-2">Dropdown</h1>
      <p class="text-lg text-(--s-text-secondary)">A versatile dropdown menu component for actions, navigation, and context menus with stunning animations.</p>
    </header>

    <!-- Features -->
    <article class="space-y-4">
      <h2 class="text-2xl font-bold text-(--s-text-primary)">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 rounded-xl bg-emerald-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-gesture-tap text-2xl text-emerald-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Multiple Triggers</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Click, hover, context menu, or manual control for maximum flexibility.</p>
        </div>
        <div class="p-4 rounded-xl bg-blue-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-animation-play text-2xl text-blue-400"></span>
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
            <span class="mdi mdi-checkbox-multiple-marked text-2xl text-amber-400"></span>
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
    <section>
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
            icon="menu"
            @select="handleSelect"
          />
          <p v-if="lastSelected" class="text-sm text-(--s-text-secondary)">
            Selected: <code class="font-mono text-emerald-400">{{ lastSelected }}</code>
          </p>
        </div>
      </DemoSection>
    </section>

    <!-- With Slots -->
    <section>
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
                <span class="mdi mdi-rocket-launch"></span>
                Quick Actions
              </SButton>
            </template>
            
            <SDropdownItem item-key="new" icon="plus" label="Create New" description="Start a new project" />
            <SDropdownItem item-key="import" icon="import" label="Import" description="Import existing project" />
            <SDropdownDivider />
            <SDropdownGroup label="Recent">
              <SDropdownItem item-key="project-1" icon="folder" label="My Project" />
              <SDropdownItem item-key="project-2" icon="folder" label="Design System" />
            </SDropdownGroup>
          </SDropdown>

          <!-- Icon-only trigger -->
          <SDropdown :items="basicItems" hide-arrow @select="handleSelect">
            <template #trigger>
              <SButton variant="ghost" iconOnly class="border border-(--s-border)">
                <span class="mdi mdi-dots-vertical text-xl"></span>
              </SButton>
            </template>
          </SDropdown>
        </div>
      </DemoSection>
    </section>

    <!-- Trigger Modes -->
    <section>
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
            icon="cursor-default-click"
          />
          <SDropdown 
            :items="basicItems" 
            trigger="hover" 
            label="Hover"
            icon="cursor-default"
            :show-delay="100"
            :hide-delay="200"
          />
          <SDropdown 
            :items="basicItems" 
            trigger="context"
          >
            <template #trigger>
              <div class="px-6 py-4 border-2 border-dashed border-(--s-border) rounded-xl text-(--s-text-secondary) text-sm hover:border-(--s-border-hover) transition-colors cursor-context-menu">
                <span class="mdi mdi-mouse-right-click mr-2"></span>
                Right-click me
              </div>
            </template>
          </SDropdown>
        </div>
      </DemoSection>
    </section>

    <!-- Sizes -->
    <section>
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
    <section>
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
    <section>
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
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-4">Animations</h2>
      <DemoSection 
        title="Animation Types"
        description="Four beautiful animation styles for menu transitions."
        :code="animationCode"
        language="vue"
      >
        <div class="flex flex-wrap items-center gap-4">
          <SDropdown :items="basicItems" animation="fade" label="Fade" icon="blur" />
          <SDropdown :items="basicItems" animation="slide" label="Slide" icon="arrow-expand-down" />
          <SDropdown :items="basicItems" animation="scale" label="Scale" icon="resize" />
          <SDropdown :items="basicItems" animation="reveal" label="Reveal" icon="blur-radial" />
        </div>
      </DemoSection>
    </section>

    <!-- Rich Items -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-4">Rich Menu Items</h2>
      <DemoSection 
        title="Icons, Descriptions & Shortcuts"
        description="Menu items with leading icons, descriptions, and keyboard shortcuts."
        :code="`items = [
  { key: 'email', label: 'Send via Email', icon: 'email', description: 'Send to email', shortcut: '⌘E' },
  { key: 'link', label: 'Copy Link', icon: 'link-variant', shortcut: '⌘L' }
]

<SDropdown :items='items' label='Share' icon='share-variant' :width='320' />`"
        language="javascript"
      >
        <div class="flex flex-wrap items-center gap-4">
          <SDropdown 
            :items="richItems" 
            label="Share"
            icon="share-variant"
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
                <span class="mdi mdi-chevron-down text-(--s-text-tertiary)"></span>
              </div>
            </template>
          </SDropdown>
        </div>
      </DemoSection>
    </section>

    <!-- Grouped Items -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-4">Grouped Items</h2>
      <DemoSection 
        title="Section Headers"
        description="Organize menu items into groups with headers."
        :code="`items = [
  { key: 'header-view', header: 'View' },
  { key: 'list', label: 'List View', icon: 'view-list' },
  { key: 'header-sort', header: 'Sort By' },
  { key: 'name', label: 'Name', icon: 'sort-alphabetical-ascending' }
]

<SDropdown :items='items' label='Display Options' icon='tune' :width='220' />`"
        language="javascript"
      >
        <SDropdown 
          :items="groupedItems" 
          label="Display Options"
          icon="tune"
          :width="220"
        />
      </DemoSection>
    </section>

    <!-- Nested Dropdowns -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-4">Nested Dropdowns</h2>
      <DemoSection 
        title="Submenus with Nested Dropdowns"
        description="Create nested dropdown menus using slots. Perfect for complex navigation structures."
        :code="nestedCode"
        language="vue"
      >
        <SDropdown 
          label="File"
          icon="file-document"
          :width="220"
          :close-on-select="false"
        >
          <template #default>
            <SDropdownItem item-key="new" icon="file-plus" label="New" />
            <SDropdownItem item-key="open" icon="folder-open" label="Open" />
            <SDropdownDivider />
            
            <!-- Nested dropdown for Share -->
            <SDropdown 
              :items="[
                { key: 'email', label: 'Email', icon: 'email' },
                { key: 'link', label: 'Copy Link', icon: 'link-variant' },
                { key: 'social', label: 'Social Media', icon: 'share-variant' }
              ]"
              trigger="hover"
              placement="right-start"
              :width="200"
              :close-on-select="false"
            >
              <template #trigger>
                <div class="s-dropdown-item relative flex items-center cursor-pointer transition-all duration-150 select-none mx-1.5 rounded-lg px-3 py-2 text-sm text-(--s-text-primary) hover:bg-(--s-bg-tertiary)">
                  <span class="mdi mdi-share-variant text-base mr-2.5 text-(--s-text-secondary)"></span>
                  <div class="flex-1 min-w-0">
                    <div class="truncate">Share</div>
                  </div>
                  <span class="mdi mdi-chevron-right text-base ml-4 shrink-0 text-(--s-text-tertiary)"></span>
                </div>
              </template>
            </SDropdown>
            
            <SDropdownDivider />
            
            <!-- Nested dropdown for Export -->
            <SDropdown 
              :items="[
                { key: 'pdf', label: 'Export as PDF', icon: 'file-pdf-box' },
                { key: 'docx', label: 'Export as DOCX', icon: 'file-word-box' },
                { key: 'xlsx', label: 'Export as XLSX', icon: 'file-excel-box' },
                { key: 'csv', label: 'Export as CSV', icon: 'file-delimited' }
              ]"
              trigger="hover"
              placement="right-start"
              :width="220"
              :close-on-select="false"
            >
              <template #trigger>
                <div class="s-dropdown-item relative flex items-center cursor-pointer transition-all duration-150 select-none mx-1.5 rounded-lg px-3 py-2 text-sm text-(--s-text-primary) hover:bg-(--s-bg-tertiary)">
                  <span class="mdi mdi-export text-base mr-2.5 text-(--s-text-secondary)"></span>
                  <div class="flex-1 min-w-0">
                    <div class="truncate">Export</div>
                  </div>
                  <span class="mdi mdi-chevron-right text-base ml-4 shrink-0 text-(--s-text-tertiary)"></span>
                </div>
              </template>
            </SDropdown>
            
            <!-- Nested dropdown for Import -->
            <SDropdown 
              :items="[
                { key: 'from-file', label: 'From File', icon: 'file-upload' },
                { key: 'from-url', label: 'From URL', icon: 'link' },
                { key: 'from-cloud', label: 'From Cloud', icon: 'cloud-upload' }
              ]"
              trigger="hover"
              placement="right-start"
              :width="200"
              :close-on-select="false"
            >
              <template #trigger>
                <div class="s-dropdown-item relative flex items-center cursor-pointer transition-all duration-150 select-none mx-1.5 rounded-lg px-3 py-2 text-sm text-(--s-text-primary) hover:bg-(--s-bg-tertiary)">
                  <span class="mdi mdi-import text-base mr-2.5 text-(--s-text-secondary)"></span>
                  <div class="flex-1 min-w-0">
                    <div class="truncate">Import</div>
                  </div>
                  <span class="mdi mdi-chevron-right text-base ml-4 shrink-0 text-(--s-text-tertiary)"></span>
                </div>
              </template>
            </SDropdown>
            
            <SDropdownDivider />
            <SDropdownItem item-key="preferences" icon="cog" label="Preferences" />
          </template>
        </SDropdown>
      </DemoSection>
    </section>

    <!-- Checkable Items -->
    <section>
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
          icon="format-text"
          :width="220"
          :close-on-select="false"
          @select="toggleCheckable"
        />
      </DemoSection>
    </section>

    <!-- Searchable -->
    <section>
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
          icon="earth"
          :width="260"
          max-height="280px"
        />
      </DemoSection>
    </section>

    <!-- Colors -->
    <section>
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
    <section>
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
              :items="[
                { key: 'undo', label: 'Undo', icon: 'undo', shortcut: '⌘Z' },
                { key: 'redo', label: 'Redo', icon: 'redo', shortcut: '⌘⇧Z' },
                { key: 'divider1', divider: true },
                { key: 'cut', label: 'Cut', icon: 'content-cut', shortcut: '⌘X' },
                { key: 'copy', label: 'Copy', icon: 'content-copy', shortcut: '⌘C' },
                { key: 'paste', label: 'Paste', icon: 'content-paste', shortcut: '⌘V' },
                { key: 'divider2', divider: true },
                { key: 'select-all', label: 'Select All', icon: 'select-all', shortcut: '⌘A' }
              ]" 
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
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">With Keyboard Shortcuts</h2>
      <DemoSection
        title="Menu Items with Shortcuts"
        description="Use SKbdShortcut inside dropdown items to display keyboard shortcut hints."
        code="<SDropdown>
  <template #trigger>
    <SButton variant=&quot;outlined&quot;>Edit Menu</SButton>
  </template>
  <template #default>
    <SDropdownItem item-key=&quot;cut&quot; icon=&quot;content-cut&quot;>
      <div class=&quot;flex items-center justify-between w-full&quot;>
        <span>Cut</span>
        <SKbdShortcut :keys=&quot;['⌘', 'X']&quot; size=&quot;xs&quot; variant=&quot;flat&quot; />
      </div>
    </SDropdownItem>
    <SDropdownItem item-key=&quot;copy&quot; icon=&quot;content-copy&quot;>
      <div class=&quot;flex items-center justify-between w-full&quot;>
        <span>Copy</span>
        <SKbdShortcut :keys=&quot;['⌘', 'C']&quot; size=&quot;xs&quot; variant=&quot;flat&quot; />
      </div>
    </SDropdownItem>
    <SDropdownItem item-key=&quot;paste&quot; icon=&quot;content-paste&quot;>
      <div class=&quot;flex items-center justify-between w-full&quot;>
        <span>Paste</span>
        <SKbdShortcut :keys=&quot;['⌘', 'V']&quot; size=&quot;xs&quot; variant=&quot;flat&quot; />
      </div>
    </SDropdownItem>
    <SDropdownDivider />
    <SDropdownItem item-key=&quot;select-all&quot; icon=&quot;select-all&quot;>
      <div class=&quot;flex items-center justify-between w-full&quot;>
        <span>Select All</span>
        <SKbdShortcut :keys=&quot;['⌘', 'A']&quot; size=&quot;xs&quot; variant=&quot;flat&quot; />
      </div>
    </SDropdownItem>
  </template>
</SDropdown>"
        language="vue"
      >
        <SDropdown>
          <template #trigger>
            <SButton variant="outlined">Edit Menu</SButton>
          </template>
          <template #default>
            <SDropdownItem item-key="cut" icon="content-cut">
              <div class="flex items-center justify-between w-full">
                <span>Cut</span>
                <SKbdShortcut :keys="['⌘', 'X']" size="xs" variant="flat" />
              </div>
            </SDropdownItem>
            <SDropdownItem item-key="copy" icon="content-copy">
              <div class="flex items-center justify-between w-full">
                <span>Copy</span>
                <SKbdShortcut :keys="['⌘', 'C']" size="xs" variant="flat" />
              </div>
            </SDropdownItem>
            <SDropdownItem item-key="paste" icon="content-paste">
              <div class="flex items-center justify-between w-full">
                <span>Paste</span>
                <SKbdShortcut :keys="['⌘', 'V']" size="xs" variant="flat" />
              </div>
            </SDropdownItem>
            <SDropdownDivider />
            <SDropdownItem item-key="select-all" icon="select-all">
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
            <span class="mdi mdi-menu-down text-(--s-primary)" />
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
              { name: 'icon', type: 'string', default: 'undefined', description: 'Leading icon (MDI name)' },
              { name: 'trailingIcon', type: 'string', default: 'undefined', description: 'Trailing icon' },
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
            <span class="mdi mdi-menu-right text-(--s-primary)" />
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
            <span class="mdi mdi-minus text-(--s-primary)" />
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
            <span class="mdi mdi-folder-multiple-outline text-(--s-primary)" />
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
