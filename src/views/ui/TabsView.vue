<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  STabs, STabPane, STabsList, STabsTrigger, STabsContent, STabsIndicator,
  SApiSection, SApiTable
} from '../../index'
import type { ApiProp, ApiEvent, ApiSlot } from '../../index'
import DemoSection from '../../components/DemoSection.vue'
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

// Compound API states
const compoundLineTab = ref('overview')
const compoundChipTab = ref('react')
const compoundSegmentTab = ref('daily')
const compoundCardTab = ref('general')
const compoundCustomTab = ref('inbox')
const compoundVerticalTab = ref('dashboard')

// Simple API states
const lineTabValue = ref('tab1')
const cardTabValue = ref('general')
const segmentTabValue = ref('option1')
const barTabValue = ref('home')
const animatedTabValue = ref('first')
const chipTabValue = ref('react')
const closableTabs = ref(['doc1', 'doc2', 'doc3'])
const triggerTabValue = ref('hover1')

const handleTabClose = (name: string | number) => {
  const index = closableTabs.value.indexOf(name as string)
  if (index > -1) {
    closableTabs.value.splice(index, 1)
  }
}

// Compound API code snippets
const compoundLineCode = `<STabs v-model="active" type="line">
  <STabsList>
    <STabsTrigger value="overview">Overview</STabsTrigger>
    <STabsTrigger value="details">Details</STabsTrigger>
    <STabsTrigger value="settings">Settings</STabsTrigger>
    <STabsIndicator />
  </STabsList>

  <STabsContent value="overview">
    This is the Overview tab content.
    The underline indicator slides smoothly between tabs.
  </STabsContent>
  <STabsContent value="details">
    This is the Details tab content with more information.
  </STabsContent>
  <STabsContent value="settings">
    Settings and configuration options go here.
  </STabsContent>
</STabs>`

const compoundChipCode = `<STabs v-model="active" type="chip">
  <STabsList>
    <STabsTrigger value="react">React</STabsTrigger>
    <STabsTrigger value="vue">Vue.js</STabsTrigger>
    <STabsTrigger value="angular">Angular</STabsTrigger>
    <STabsTrigger value="svelte">Svelte</STabsTrigger>
    <!-- Morphing pill indicator -->
    <STabsIndicator color="#3b82f6" />
  </STabsList>

  <STabsContent value="react">React framework selected. The pill morphs to each tab.</STabsContent>
  <STabsContent value="vue">Vue.js framework selected. Smooth pill transition!</STabsContent>
  <STabsContent value="angular">Angular framework selected.</STabsContent>
  <STabsContent value="svelte">Svelte framework selected.</STabsContent>
</STabs>`

const compoundSegmentCode = `<STabs v-model="active" type="segment">
  <STabsList>
    <STabsTrigger value="daily">Daily</STabsTrigger>
    <STabsTrigger value="weekly">Weekly</STabsTrigger>
    <STabsTrigger value="monthly">Monthly</STabsTrigger>
    <!-- Morphing background indicator -->
    <STabsIndicator />
  </STabsList>

  <STabsContent value="daily">
    Daily view content. The background morphs between options.
  </STabsContent>
  <STabsContent value="weekly">Weekly view content.</STabsContent>
  <STabsContent value="monthly">Monthly view content.</STabsContent>
</STabs>`

const compoundCardCode = `<STabs v-model="active" type="card">
  <STabsList>
    <STabsTrigger value="general">General</STabsTrigger>
    <STabsTrigger value="advanced">Advanced</STabsTrigger>
    <STabsTrigger value="disabled" :disabled="true">Disabled</STabsTrigger>
    <STabsIndicator />
  </STabsList>

  <STabsContent value="general">General settings panel.</STabsContent>
  <STabsContent value="advanced">Advanced configuration options.</STabsContent>
</STabs>`

const compoundCustomCode = `<STabs v-model="active" type="line" :animated="true">
  <STabsList>
    <STabsTrigger value="inbox" v-slot="{ active }">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full"
          :class="active ? 'bg-emerald-400 animate-pulse' : 'bg-(--s-text-tertiary)'" />
        <span>Inbox</span>
        <span class="text-xs px-1.5 py-0.5 rounded-full"
          :class="active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-(--s-bg-tertiary) text-(--s-text-secondary)'">
          3
        </span>
      </div>
    </STabsTrigger>
    <STabsTrigger value="sent">Sent</STabsTrigger>
    <STabsTrigger value="drafts">Drafts</STabsTrigger>
    <STabsIndicator color="#10b981" />
  </STabsList>

  <STabsContent value="inbox">You have 3 new messages!</STabsContent>
  <STabsContent value="sent">Sent messages archive.</STabsContent>
  <STabsContent value="drafts">Draft messages.</STabsContent>
</STabs>`

const compoundVerticalCode = `<STabs v-model="active" type="line" placement="left" :animated="true">
  <STabsList>
    <STabsTrigger value="dashboard">Dashboard</STabsTrigger>
    <STabsTrigger value="users">Users</STabsTrigger>
    <STabsTrigger value="reports">Reports</STabsTrigger>
    <STabsIndicator color="#8b5cf6" />
  </STabsList>

  <STabsContent value="dashboard">
    Dashboard — Your main analytics overview.
  </STabsContent>
  <STabsContent value="users">
    Users — Manage your team members.
  </STabsContent>
  <STabsContent value="reports">
    Reports — View analytics and reports.
  </STabsContent>
</STabs>`

// Simple API code snippets
const lineTypeCode = `<STabs v-model="active" type="line">
  <STabPane name="tab1" tab="Overview">This is the Overview tab content.</STabPane>
  <STabPane name="tab2" tab="Details">This is the Details tab content.</STabPane>
  <STabPane name="tab3" tab="Settings">Settings and configuration options.</STabPane>
</STabs>`

const chipTypeCode = `<STabs v-model="active" type="chip" :animated="true"
  chip-active-color="#3b82f6">
  <STabPane name="react" tab="React">React framework selected.</STabPane>
  <STabPane name="vue" tab="Vue.js">Vue.js framework selected.</STabPane>
  <STabPane name="angular" tab="Angular">Angular framework selected.</STabPane>
</STabs>`

const segmentTypeCode = `<STabs v-model="active" type="segment">
  <STabPane name="option1" tab="Daily">Daily view content.</STabPane>
  <STabPane name="option2" tab="Weekly">Weekly view content.</STabPane>
  <STabPane name="option3" tab="Monthly">Monthly view content.</STabPane>
</STabs>`

const barTypeCode = computed(() => `<STabs v-model="active" type="bar">
  <STabPane name="home" tab="Home" ${cp('home')}>Home page content.</STabPane>
  <STabPane name="search" tab="Search" ${cp('magnify')}>Search functionality goes here.</STabPane>
  <STabPane name="profile" tab="Profile" ${cp('account')}>User profile information.</STabPane>
</STabs>`)

const animatedCode = `<STabs v-model="active" type="line" :animated="true" bar-color="#f59e0b">
  <STabPane name="first" tab="First">First panel with smooth slide animation.</STabPane>
  <STabPane name="second" tab="Second">Second panel - notice the smooth transition!</STabPane>
</STabs>`

const closableCode = `<STabs type="card" :closable="true" @close="handleTabClose">
  <STabPane v-for="tab in tabs" :key="tab" :name="tab"
    :tab="\`Document \${tab.slice(-1)}\`">
    Content for {{ tab }}.
  </STabPane>
</STabs>`

const triggerCode = `<STabs v-model="active" type="line" trigger="hover">
  <STabPane name="hover1" tab="Hover Me">Hover over the tabs to switch!</STabPane>
  <STabPane name="hover2" tab="Don't Click">No need to click, just hover.</STabPane>
  <STabPane name="hover3" tab="Just Hover">Smooth switching on mouse enter.</STabPane>
</STabs>`
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- @component STabs -->
    <!-- @props modelValue, type, size, placement, animated, closable, trigger, justifyContent, barColor, chipColor, chipActiveColor, tabsWrapperClass, tabClass, activeTabClass, panelClass -->
    <!-- @events update:modelValue, close, before-leave -->
    <!-- @slots default, tab -->
    <!-- @sections features, subcomponents -->
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-(--s-text-primary) mb-2">Tabs</h1>
      <p class="text-lg text-(--s-text-secondary)">
        A highly customizable tab component with both simple and compound APIs.
      </p>
    </header>

    <!-- Features -->
    <article id="features" class="space-y-4">
      <h2 class="text-2xl font-bold text-(--s-text-primary)">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 rounded-xl bg-emerald-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-puzzle-outline text-2xl text-emerald-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Compound API</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Composable subcomponents for full layout control and custom trigger content.</p>
        </div>
        <div class="p-4 rounded-xl bg-blue-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-shape-outline text-2xl text-blue-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Morphing Indicator</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">STabsIndicator morphs between tabs as underline, pill, or background.</p>
        </div>
        <div class="p-4 rounded-xl bg-rose-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-tab text-2xl text-rose-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Five Tab Types</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Line, card, segment, bar, and chip styles for different use cases.</p>
        </div>
        <div class="p-4 rounded-xl bg-violet-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-animation-outline text-2xl text-violet-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Smooth Animations</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Optional panel transitions with cubic-bezier easing effects.</p>
        </div>
        <div class="p-4 rounded-xl bg-amber-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-view-carousel-outline text-2xl text-amber-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Vertical Placement</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Top, bottom, left, and right tab placements.</p>
        </div>
        <div class="p-4 rounded-xl bg-cyan-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-layers-outline text-2xl text-cyan-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Dual API</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Simple STabPane for quick use, compound API for full control.</p>
        </div>
      </div>
    </article>

    <!-- ============================================ -->
    <!-- COMPOUND API SECTION -->
    <!-- ============================================ -->
    <div>
      <h2 class="text-3xl font-bold text-(--s-text-primary) mb-2">Compound API</h2>
      <p class="text-(--s-text-secondary) mb-8">
        Full control over layout, triggers, and the morphing indicator using composable subcomponents.
      </p>

      <!-- Line with Indicator -->
      <section class="mb-10">
        <h3 class="text-2xl font-bold text-(--s-text-primary) mb-6">Line with Morphing Indicator</h3>
        <DemoSection
          title="Line Type"
          description="Underline indicator smoothly morphs between tabs."
          :code="compoundLineCode"
          language="vue"
        >
          <STabs v-model="compoundLineTab" type="line">
            <STabsList>
              <STabsTrigger value="overview">Overview</STabsTrigger>
              <STabsTrigger value="details">Details</STabsTrigger>
              <STabsTrigger value="settings">Settings</STabsTrigger>
              <STabsIndicator />
            </STabsList>

            <STabsContent value="overview">
              <div class="p-6 text-(--s-text-secondary)">
                <p>This is the Overview tab content.</p>
                <p class="mt-2 text-sm text-(--s-text-tertiary)">The underline indicator slides smoothly between tabs.</p>
              </div>
            </STabsContent>
            <STabsContent value="details">
              <div class="p-6 text-(--s-text-secondary)">
                <p>This is the Details tab content with more information.</p>
              </div>
            </STabsContent>
            <STabsContent value="settings">
              <div class="p-6 text-(--s-text-secondary)">
                <p>Settings and configuration options go here.</p>
              </div>
            </STabsContent>
          </STabs>
        </DemoSection>
      </section>

      <!-- Chip with Morphing Pill -->
      <section class="mb-10">
        <h3 class="text-2xl font-bold text-(--s-text-primary) mb-6">Chip with Morphing Pill</h3>
        <DemoSection
          title="Chip Type"
          description="Pill indicator morphs between chip tabs with a colored background."
          :code="compoundChipCode"
          language="vue"
        >
          <STabs v-model="compoundChipTab" type="chip">
            <STabsList>
              <STabsTrigger value="react">React</STabsTrigger>
              <STabsTrigger value="vue">Vue.js</STabsTrigger>
              <STabsTrigger value="angular">Angular</STabsTrigger>
              <STabsTrigger value="svelte">Svelte</STabsTrigger>
              <STabsIndicator color="#3b82f6" />
            </STabsList>

            <STabsContent value="react">
              <div class="p-6 text-(--s-text-secondary)">
                <p>React framework selected. The pill morphs to each tab.</p>
              </div>
            </STabsContent>
            <STabsContent value="vue">
              <div class="p-6 text-(--s-text-secondary)">
                <p>Vue.js framework selected. Smooth pill transition!</p>
              </div>
            </STabsContent>
            <STabsContent value="angular">
              <div class="p-6 text-(--s-text-secondary)">
                <p>Angular framework selected.</p>
              </div>
            </STabsContent>
            <STabsContent value="svelte">
              <div class="p-6 text-(--s-text-secondary)">
                <p>Svelte framework selected.</p>
              </div>
            </STabsContent>
          </STabs>
        </DemoSection>
      </section>

      <!-- Segment with Morphing Background -->
      <section class="mb-10">
        <h3 class="text-2xl font-bold text-(--s-text-primary) mb-6">Segment with Morphing Background</h3>
        <DemoSection
          title="Segment Type"
          description="iOS-style segmented control with a morphing background indicator."
          :code="compoundSegmentCode"
          language="vue"
        >
          <STabs v-model="compoundSegmentTab" type="segment">
            <STabsList>
              <STabsTrigger value="daily">Daily</STabsTrigger>
              <STabsTrigger value="weekly">Weekly</STabsTrigger>
              <STabsTrigger value="monthly">Monthly</STabsTrigger>
              <STabsIndicator />
            </STabsList>

            <STabsContent value="daily">
              <div class="p-6 text-(--s-text-secondary)">
                <p>Daily view content. The background morphs between options.</p>
              </div>
            </STabsContent>
            <STabsContent value="weekly">
              <div class="p-6 text-(--s-text-secondary)">
                <p>Weekly view content.</p>
              </div>
            </STabsContent>
            <STabsContent value="monthly">
              <div class="p-6 text-(--s-text-secondary)">
                <p>Monthly view content.</p>
              </div>
            </STabsContent>
          </STabs>
        </DemoSection>
      </section>

      <!-- Card with Morphing Background -->
      <section class="mb-10">
        <h3 class="text-2xl font-bold text-(--s-text-primary) mb-6">Card with Morphing Background</h3>
        <DemoSection
          title="Card Type"
          description="Card-style tabs with a morphing background indicator and disabled state."
          :code="compoundCardCode"
          language="vue"
        >
          <STabs v-model="compoundCardTab" type="card">
            <STabsList>
              <STabsTrigger value="general">General</STabsTrigger>
              <STabsTrigger value="advanced">Advanced</STabsTrigger>
              <STabsTrigger value="disabled" :disabled="true">Disabled</STabsTrigger>
              <STabsIndicator />
            </STabsList>

            <STabsContent value="general">
              <div class="p-6 text-(--s-text-secondary)">
                <p>General settings panel.</p>
              </div>
            </STabsContent>
            <STabsContent value="advanced">
              <div class="p-6 text-(--s-text-secondary)">
                <p>Advanced configuration options.</p>
              </div>
            </STabsContent>
          </STabs>
        </DemoSection>
      </section>

      <!-- Custom Trigger Content -->
      <section class="mb-10">
        <h3 class="text-2xl font-bold text-(--s-text-primary) mb-6">Custom Trigger Content</h3>
        <DemoSection
          title="Custom Triggers"
          description="STabsTrigger's slot exposes { active, disabled } for fully custom trigger content."
          :code="compoundCustomCode"
          language="vue"
        >
          <STabs v-model="compoundCustomTab" type="line" :animated="true">
            <STabsList>
              <STabsTrigger value="inbox" v-slot="{ active }">
                <div class="flex items-center gap-2">
                  <span
                    class="w-2 h-2 rounded-full"
                    :class="active ? 'bg-emerald-400 animate-pulse' : 'bg-(--s-text-tertiary)'"
                  />
                  <span>Inbox</span>
                  <span
                    class="text-xs px-1.5 py-0.5 rounded-full"
                    :class="active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-(--s-bg-tertiary) text-(--s-text-secondary)'"
                  >3</span>
                </div>
              </STabsTrigger>
              <STabsTrigger value="sent">Sent</STabsTrigger>
              <STabsTrigger value="drafts">Drafts</STabsTrigger>
              <STabsIndicator color="#10b981" />
            </STabsList>

            <STabsContent value="inbox">
              <div class="p-6 text-(--s-text-secondary)">
                <p>You have 3 new messages!</p>
              </div>
            </STabsContent>
            <STabsContent value="sent">
              <div class="p-6 text-(--s-text-secondary)">
                <p>Sent messages archive.</p>
              </div>
            </STabsContent>
            <STabsContent value="drafts">
              <div class="p-6 text-(--s-text-secondary)">
                <p>Draft messages.</p>
              </div>
            </STabsContent>
          </STabs>
        </DemoSection>
      </section>

      <!-- Vertical Tabs -->
      <section class="mb-10">
        <h3 class="text-2xl font-bold text-(--s-text-primary) mb-6">Vertical Tabs</h3>
        <DemoSection
          title="Vertical Placement"
          description="Compound API with left placement and vertical morphing indicator."
          :code="compoundVerticalCode"
          language="vue"
        >
          <STabs v-model="compoundVerticalTab" type="line" placement="left" :animated="true">
            <STabsList>
              <STabsTrigger value="dashboard">Dashboard</STabsTrigger>
              <STabsTrigger value="users">Users</STabsTrigger>
              <STabsTrigger value="reports">Reports</STabsTrigger>
              <STabsIndicator color="#8b5cf6" />
            </STabsList>

            <STabsContent value="dashboard">
              <div class="p-6 text-(--s-text-secondary)">
                <p class="text-lg font-semibold text-purple-400">Dashboard</p>
                <p class="mt-2">Your main analytics overview.</p>
              </div>
            </STabsContent>
            <STabsContent value="users">
              <div class="p-6 text-(--s-text-secondary)">
                <p class="text-lg font-semibold text-purple-400">Users</p>
                <p class="mt-2">Manage your team members.</p>
              </div>
            </STabsContent>
            <STabsContent value="reports">
              <div class="p-6 text-(--s-text-secondary)">
                <p class="text-lg font-semibold text-purple-400">Reports</p>
                <p class="mt-2">View analytics and reports.</p>
              </div>
            </STabsContent>
          </STabs>
        </DemoSection>
      </section>
    </div>

    <!-- ============================================ -->
    <!-- SIMPLE API SECTION -->
    <!-- ============================================ -->
    <div>
      <h2 class="text-3xl font-bold text-(--s-text-primary) mb-2">Simple API</h2>
      <p class="text-(--s-text-secondary) mb-8">
        Quick setup using STabPane for straightforward tab layouts.
      </p>

      <!-- Line Type -->
      <section class="mb-10">
        <h3 class="text-2xl font-bold text-(--s-text-primary) mb-6">Line Type (Default)</h3>
        <DemoSection
          title="Line Type"
          description="Line type shows an underline indicator on the active tab."
          :code="lineTypeCode"
          language="vue"
        >
          <STabs v-model="lineTabValue" type="line">
            <STabPane name="tab1" tab="Overview">
              <div class="p-6 text-(--s-text-secondary)">
                <p>This is the Overview tab content.</p>
              </div>
            </STabPane>
            <STabPane name="tab2" tab="Details">
              <div class="p-6 text-(--s-text-secondary)">
                <p>This is the Details tab content.</p>
              </div>
            </STabPane>
            <STabPane name="tab3" tab="Settings">
              <div class="p-6 text-(--s-text-secondary)">
                <p>Settings and configuration options.</p>
              </div>
            </STabPane>
          </STabs>
        </DemoSection>
      </section>

      <!-- Chip Type -->
      <section class="mb-10">
        <h3 class="text-2xl font-bold text-(--s-text-primary) mb-6">Chip Type</h3>
        <DemoSection
          title="Chip Type"
          description="Chip type displays tabs as colorful pills."
          :code="chipTypeCode"
          language="vue"
        >
          <STabs
            v-model="chipTabValue"
            type="chip"
            :animated="true"
            chip-active-color="#3b82f6"
          >
            <STabPane name="react" tab="React">
              <div class="p-6 text-(--s-text-secondary)">
                <p>React framework selected.</p>
              </div>
            </STabPane>
            <STabPane name="vue" tab="Vue.js">
              <div class="p-6 text-(--s-text-secondary)">
                <p>Vue.js framework selected.</p>
              </div>
            </STabPane>
            <STabPane name="angular" tab="Angular">
              <div class="p-6 text-(--s-text-secondary)">
                <p>Angular framework selected.</p>
              </div>
            </STabPane>
          </STabs>
        </DemoSection>
      </section>

      <!-- Bar Type -->
      <section class="mb-10">
        <h3 class="text-2xl font-bold text-(--s-text-primary) mb-6">Bar Type</h3>
        <DemoSection
          title="Bar Type"
          description="Bar type shows a bottom bar indicator with icons."
          :code="barTypeCode"
          language="vue"
        >
          <STabs v-model="barTabValue" type="bar">
            <STabPane name="home" tab="Home" :icon="ri('home')">
              <div class="p-6 text-(--s-text-secondary)">
                <p>Home page content.</p>
              </div>
            </STabPane>
            <STabPane name="search" tab="Search" :icon="ri('magnify')">
              <div class="p-6 text-(--s-text-secondary)">
                <p>Search functionality goes here.</p>
              </div>
            </STabPane>
            <STabPane name="profile" tab="Profile" :icon="ri('account')">
              <div class="p-6 text-(--s-text-secondary)">
                <p>User profile information.</p>
              </div>
            </STabPane>
          </STabs>
        </DemoSection>
      </section>

      <!-- Segment Type -->
      <section class="mb-10">
        <h3 class="text-2xl font-bold text-(--s-text-primary) mb-6">Segment Type</h3>
        <DemoSection
          title="Segment Type"
          description="Segment type looks like iOS segmented controls."
          :code="segmentTypeCode"
          language="vue"
        >
          <STabs v-model="segmentTabValue" type="segment">
            <STabPane name="option1" tab="Daily">
              <div class="p-6 text-(--s-text-secondary)">
                <p>Daily view content.</p>
              </div>
            </STabPane>
            <STabPane name="option2" tab="Weekly">
              <div class="p-6 text-(--s-text-secondary)">
                <p>Weekly view content.</p>
              </div>
            </STabPane>
            <STabPane name="option3" tab="Monthly">
              <div class="p-6 text-(--s-text-secondary)">
                <p>Monthly view content.</p>
              </div>
            </STabPane>
          </STabs>
        </DemoSection>
      </section>

      <!-- Animated Content -->
      <section class="mb-10">
        <h3 class="text-2xl font-bold text-(--s-text-primary) mb-6">Animated Content</h3>
        <DemoSection
          title="Animated Tabs"
          description="Content transitions with cubic-bezier easing."
          :code="animatedCode"
          language="vue"
        >
          <STabs v-model="animatedTabValue" type="line" :animated="true" bar-color="#f59e0b">
            <STabPane name="first" tab="First">
              <div class="p-6 text-(--s-text-secondary)">
                <p>First panel with smooth slide animation.</p>
              </div>
            </STabPane>
            <STabPane name="second" tab="Second">
              <div class="p-6 text-(--s-text-secondary)">
                <p>Second panel - notice the smooth transition!</p>
              </div>
            </STabPane>
          </STabs>
        </DemoSection>
      </section>

      <!-- Closable Tabs -->
      <section class="mb-10">
        <h3 class="text-2xl font-bold text-(--s-text-primary) mb-6">Closable Tabs</h3>
        <DemoSection
          title="Closable Tabs"
          description="Click the X to close tabs."
          :code="closableCode"
          language="vue"
        >
          <STabs type="card" :closable="true" @close="handleTabClose">
            <STabPane
              v-for="tab in closableTabs"
              :key="tab"
              :name="tab"
              :tab="`Document ${tab.slice(-1)}`"
            >
              <div class="p-6 text-(--s-text-secondary)">
                <p>Content for {{ tab }}.</p>
              </div>
            </STabPane>
          </STabs>
          <p v-if="closableTabs.length === 0" class="p-4 text-center text-(--s-text-tertiary) rounded-xl mt-4 border border-dashed border-(--s-border)">All tabs closed!</p>
        </DemoSection>
      </section>

      <!-- Hover Trigger -->
      <section class="mb-10">
        <h3 class="text-2xl font-bold text-(--s-text-primary) mb-6">Hover Trigger</h3>
        <DemoSection
          title="Trigger Event"
          description="Tabs can be triggered on hover instead of click."
          :code="triggerCode"
          language="vue"
        >
          <STabs v-model="triggerTabValue" type="line" trigger="hover">
            <STabPane name="hover1" tab="Hover Me">
              <div class="p-6 text-(--s-text-secondary)">
                <p>Hover over the tabs to switch!</p>
              </div>
            </STabPane>
            <STabPane name="hover2" tab="Don't Click">
              <div class="p-6 text-(--s-text-secondary)">
                <p>No need to click, just hover.</p>
              </div>
            </STabPane>
            <STabPane name="hover3" tab="Just Hover">
              <div class="p-6 text-(--s-text-secondary)">
                <p>Smooth switching on mouse enter.</p>
              </div>
            </STabPane>
          </STabs>
        </DemoSection>
      </section>
    </div>

    <!-- ============================================ -->
    <!-- SUBCOMPONENTS -->
    <!-- ============================================ -->
    <section id="subcomponents">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Subcomponents</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 rounded-xl border border-(--s-border) bg-(--s-bg-secondary)">
          <code class="text-sm font-mono text-emerald-400">STabs</code>
          <p class="text-sm text-(--s-text-secondary) mt-1">Root context provider. Manages active tab, type, size, and provides context.</p>
        </div>
        <div class="p-4 rounded-xl border border-(--s-border) bg-(--s-bg-secondary)">
          <code class="text-sm font-mono text-emerald-400">STabsList</code>
          <p class="text-sm text-(--s-text-secondary) mt-1">Container for tab triggers. Provides layout and refs for indicator positioning.</p>
        </div>
        <div class="p-4 rounded-xl border border-(--s-border) bg-(--s-bg-secondary)">
          <code class="text-sm font-mono text-emerald-400">STabsTrigger</code>
          <p class="text-sm text-(--s-text-secondary) mt-1">Individual tab button. Exposes <code>{ active, disabled }</code> via slot for custom content.</p>
        </div>
        <div class="p-4 rounded-xl border border-(--s-border) bg-(--s-bg-secondary)">
          <code class="text-sm font-mono text-emerald-400">STabsContent</code>
          <p class="text-sm text-(--s-text-secondary) mt-1">Content panel that shows when its value matches the active tab. Supports transitions.</p>
        </div>
        <div class="p-4 rounded-xl border border-(--s-border) bg-(--s-bg-secondary)">
          <code class="text-sm font-mono text-emerald-400">STabsIndicator</code>
          <p class="text-sm text-(--s-text-secondary) mt-1">Animated indicator that morphs between tabs. Adapts to type: underline, pill, or background.</p>
        </div>
        <div class="p-4 rounded-xl border border-(--s-border) bg-(--s-bg-secondary)">
          <code class="text-sm font-mono text-emerald-400">STabPane</code>
          <p class="text-sm text-(--s-text-secondary) mt-1">Simple API only. Registers itself and renders content in the panel area.</p>
        </div>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- API REFERENCE -->
    <!-- ============================================ -->
    <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">API Reference</h2>
    <SApiSection>
      <div class="space-y-8">
        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-tab text-(--s-primary)" />
            STabs
          </h3>
          <SApiTable
            title="Props"
            type="props"
            :props="([
              { name: 'modelValue', type: 'string | number', default: 'undefined', description: 'Active tab value (use with v-model)', category: 'Core' },
              { name: 'type', type: '\'line\' | \'card\' | \'segment\' | \'bar\' | \'chip\'', default: '\'line\'', description: 'Tab style variant', category: 'Appearance' },
              { name: 'size', type: '\'small\' | \'medium\' | \'large\'', default: '\'medium\'', description: 'Tab size', category: 'Appearance' },
              { name: 'placement', type: '\'top\' | \'left\' | \'right\' | \'bottom\'', default: '\'top\'', description: 'Tab position (vertical with left/right)', category: 'Appearance' },
              { name: 'animated', type: 'boolean', default: 'false', description: 'Enable panel transition animations', category: 'Behavior' },
              { name: 'closable', type: 'boolean', default: 'false', description: 'Show close buttons on tabs (simple API)', category: 'Behavior' },
              { name: 'trigger', type: '\'click\' | \'hover\'', default: '\'click\'', description: 'Trigger mode for switching tabs', category: 'Behavior' },
              { name: 'justifyContent', type: 'TabJustify', default: '\'flex-start\'', description: 'Tab alignment (flex-start, center, etc.)', category: 'Layout' },
              { name: 'barColor', type: 'string', default: 'var(--s-primary)', description: 'Active indicator color', category: 'Theming' },
              { name: 'chipColor', type: 'string', default: 'var(--s-accent)', description: 'Inactive chip background (simple API)', category: 'Theming' },
              { name: 'chipActiveColor', type: 'string', default: 'var(--s-primary)', description: 'Active chip background (simple API)', category: 'Theming' },
              { name: 'tabsWrapperClass', type: 'string', default: '\'\'', description: 'Classes for the tabs wrapper element', category: 'Custom Classes' },
              { name: 'tabClass', type: 'string', default: '\'\'', description: 'Classes for all tabs (simple API)', category: 'Custom Classes' },
              { name: 'activeTabClass', type: 'string', default: '\'\'', description: 'Classes for active tab (simple API)', category: 'Custom Classes' },
              { name: 'panelClass', type: 'string', default: '\'\'', description: 'Classes for content panel (simple API)', category: 'Custom Classes' }
            ] as ApiProp[])"
          />
          <SApiTable
            title="Events"
            type="events"
            :events="([
              { name: 'update:modelValue', payload: 'string | number', description: 'v-model update when tab changes' },
              { name: 'close', payload: 'string | number', description: 'Tab close button clicked (simple API)' },
              { name: 'before-leave', payload: '(from, to)', description: 'Emitted before switching tabs' }
            ] as ApiEvent[])"
            class="mt-6"
          />
          <SApiTable
            title="Slots"
            type="slots"
            :slots="([
              { name: 'default', props: '-', description: 'Compose STabsList, STabsTrigger, STabsContent, or simple STabPane children' },
              { name: 'tab', props: '{ pane, active, disabled, close }', description: 'Customize the simple-API tab trigger template for each registered pane' }
            ] as ApiSlot[])"
            class="mt-6"
          />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-view-carousel-outline text-(--s-primary)" />
            STabPane
          </h3>
          <SApiTable
            title="Props"
            type="props"
            :props="([
              { name: 'name', type: 'string | number', default: 'Required', description: 'Unique identifier' },
              { name: 'tab', type: 'string', default: 'Required', description: 'Tab button label' },
              { name: 'icon', type: 'string', default: '-', description: 'MDI icon name (without mdi- prefix)' },
              { name: 'disabled', type: 'boolean', default: '-', description: 'Disable this tab' },
              { name: 'closable', type: 'boolean', default: '-', description: 'Override parent closable setting' },
              { name: 'tabClass', type: 'string', default: '-', description: 'Additional classes for this tab button' }
            ] as ApiProp[])"
          />
          <SApiTable
            title="Slots"
            type="slots"
            :slots="([
              { name: 'default', props: '-', description: 'Panel content for the tab' }
            ] as ApiSlot[])"
            class="mt-6"
          />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-format-list-bulleted text-(--s-primary)" />
            STabsList
          </h3>
          <SApiTable
            title="Props"
            type="props"
            :props="([
              { name: 'type', type: 'TabType', default: 'inherited', description: 'Override tab type from parent STabs' },
              { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes' }
            ] as ApiProp[])"
          />
          <SApiTable
            title="Slots"
            type="slots"
            :slots="([
              { name: 'default', props: '-', description: 'Tab triggers and optional indicator component' }
            ] as ApiSlot[])"
            class="mt-6"
          />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-radiobox-marked text-(--s-primary)" />
            STabsTrigger
          </h3>
          <SApiTable
            title="Props"
            type="props"
            :props="([
              { name: 'value', type: 'string | number', default: 'Required', description: 'Unique identifier matching STabsContent value' },
              { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable this trigger' },
              { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes' }
            ] as ApiProp[])"
          />
          <SApiTable
            title="Slots"
            type="slots"
            :slots="([
              { name: 'default', props: '{ active: boolean, disabled: boolean }', description: 'Custom trigger content with reactive state' }
            ] as ApiSlot[])"
            class="mt-6"
          />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-text-box-outline text-(--s-primary)" />
            STabsContent
          </h3>
          <SApiTable
            title="Props"
            type="props"
            :props="([
              { name: 'value', type: 'string | number', default: 'Required', description: 'Unique identifier matching STabsTrigger value' },
              { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes' }
            ] as ApiProp[])"
          />
          <SApiTable
            title="Slots"
            type="slots"
            :slots="([
              { name: 'default', props: '-', description: 'Content rendered for the active tab' }
            ] as ApiSlot[])"
            class="mt-6"
          />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-minus text-(--s-primary)" />
            STabsIndicator
          </h3>
          <SApiTable
            title="Props"
            type="props"
            :props="([
              { name: 'color', type: 'string', default: 'inherited', description: 'Override indicator color (defaults to barColor from STabs)' },
              { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes' }
            ] as ApiProp[])"
          />
        </div>
      </div>
    </SApiSection>
  </div>
</template>
