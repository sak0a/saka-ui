<script setup lang="ts">
import { ref } from 'vue'
import { STabs, STabPane, SApiSection, SApiTable } from '../../index'
import type { ApiProp, ApiEvent, ApiSlot } from '../../index'
import DemoSection from '../../components/DemoSection.vue'

// States for various examples
const lineTabValue = ref('tab1')
const cardTabValue = ref('general')
const segmentTabValue = ref('option1')
const barTabValue = ref('home')
const animatedTabValue = ref('first')
const customTabValue = ref('styled1')
const chipTabValue = ref('react')
const customTemplateTab = ref('inbox')
const verticalLeftTab = ref('dashboard')
const verticalRightTab = ref('settings')
const closableTabs = ref(['doc1', 'doc2', 'doc3'])
const triggerTabValue = ref('hover1')

const handleTabClose = (name: string | number) => {
  const index = closableTabs.value.indexOf(name as string)
  if (index > -1) {
    closableTabs.value.splice(index, 1)
  }
}

// Code snippets for demos
const lineTypeCode = `<STabs v-model="lineTabValue" type="line">
  <STabPane name="tab1" tab="Overview">
    <div class="p-6">Overview content...</div>
  </STabPane>
  <STabPane name="tab2" tab="Details">
    <div class="p-6">Details content...</div>
  </STabPane>
  <STabPane name="tab3" tab="Settings">
    <div class="p-6">Settings content...</div>
  </STabPane>
</STabs>`

const cardTypeCode = `<STabs v-model="cardTabValue" type="card">
  <STabPane name="general" tab="General">
    <div class="p-6">General settings...</div>
  </STabPane>
  <STabPane name="advanced" tab="Advanced">
    <div class="p-6">Advanced settings...</div>
  </STabPane>
  <STabPane name="disabled" tab="Disabled" :disabled="true">
    <div class="p-6">This tab is disabled.</div>
  </STabPane>
</STabs>`

const segmentTypeCode = `<STabs v-model="segmentTabValue" type="segment">
  <STabPane name="option1" tab="Daily">
    <div class="p-6">Daily view...</div>
  </STabPane>
  <STabPane name="option2" tab="Weekly">
    <div class="p-6">Weekly view...</div>
  </STabPane>
  <STabPane name="option3" tab="Monthly">
    <div class="p-6">Monthly view...</div>
  </STabPane>
</STabs>`

const barTypeCode = `<STabs v-model="barTabValue" type="bar">
  <STabPane name="home" tab="Home" icon="home">
    <div class="p-6">Home page...</div>
  </STabPane>
  <STabPane name="search" tab="Search" icon="magnify">
    <div class="p-6">Search...</div>
  </STabPane>
  <STabPane name="profile" tab="Profile" icon="account">
    <div class="p-6">Profile...</div>
  </STabPane>
</STabs>`

const chipTypeCode = `<STabs 
  v-model="chipTabValue" 
  type="chip" 
  :animated="true"
  chip-color="rgba(255, 255, 255, 0.06)"
  chip-active-color="#3b82f6"
>
  <STabPane name="react" tab="React" icon="react">
    <div class="p-6">React framework...</div>
  </STabPane>
  <STabPane name="vue" tab="Vue.js" icon="vuejs">
    <div class="p-6">Vue.js framework...</div>
  </STabPane>
  <STabPane name="angular" tab="Angular" icon="angular">
    <div class="p-6">Angular framework...</div>
  </STabPane>
</STabs>`

const animatedCode = `<STabs v-model="animatedTabValue" type="line" :animated="true" bar-color="#f59e0b">
  <STabPane name="first" tab="First">
    <div class="p-6">First panel with smooth slide animation.</div>
  </STabPane>
  <STabPane name="second" tab="Second">
    <div class="p-6">Second panel with smooth transition!</div>
  </STabPane>
</STabs>`

const customThemingCode = `<STabs 
  v-model="customTabValue" 
  type="line" 
  bar-color="#ec4899"
  tab-class="font-semibold uppercase tracking-wider"
  active-tab-class="text-pink-400"
  panel-class="bg-(--s-bg-secondary)/50 rounded-lg mt-4"
>
  <STabPane name="styled1" tab="Pink Theme">
    <div class="p-6">Custom pink accent...</div>
  </STabPane>
  <STabPane name="styled2" tab="Indigo Theme">
    <div class="p-6">Tailwind classes...</div>
  </STabPane>
</STabs>`

const customTemplateCode = `<STabs v-model="customTemplateTab" type="line" :animated="true">
  <template #tab="{ pane, active }">
    <div class="flex items-center gap-2">
      <span 
        v-if="pane.name === 'inbox'"
        class="w-2 h-2 rounded-full"
        :class="active ? 'bg-emerald-400 animate-pulse' : 'bg-(--s-text-tertiary)'"
      />
      <span :class="active ? 'font-bold text-emerald-400' : 'text-(--s-text-secondary)'">
        {{ pane.tab }}
      </span>
      <span 
        v-if="pane.name === 'inbox'"
        class="text-xs px-1.5 py-0.5 rounded-full"
        :class="active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-(--s-bg-tertiary) text-(--s-text-secondary)'"
      >3</span>
    </div>
  </template>
  
  <STabPane name="inbox" tab="Inbox">
    <div class="p-6">📬 You have 3 new messages!</div>
  </STabPane>
  <STabPane name="sent" tab="Sent">
    <div class="p-6">📤 Sent messages archive.</div>
  </STabPane>
</STabs>`

const closableCode = `<STabs type="card" :closable="true" @close="handleTabClose">
  <STabPane 
    v-for="tab in closableTabs" 
    :key="tab" 
    :name="tab" 
    :tab="\`Document \${tab.slice(-1)}\`"
  >
    <div class="p-6">Content for {{ tab }}.</div>
  </STabPane>
</STabs>`

const triggerCode = `<STabs v-model="triggerTabValue" type="line" trigger="hover">
  <STabPane name="hover1" tab="Hover Me">
    <div class="p-6">Hovered tab 1</div>
  </STabPane>
  <STabPane name="hover2" tab="Don't Click">
    <div class="p-6">Hovered tab 2</div>
  </STabPane>
  <STabPane name="hover3" tab="Just Hover">
    <div class="p-6">Hovered tab 3</div>
  </STabPane>
</STabs>`

const verticalLeftCode = `<STabs v-model="verticalLeftTab" type="line" placement="left" :animated="true" bar-color="#8b5cf6">
  <STabPane name="dashboard" tab="Dashboard" icon="view-dashboard">
    <div class="p-6">📊 Dashboard overview...</div>
  </STabPane>
  <STabPane name="users" tab="Users" icon="account-group">
    <div class="p-6">👥 Users management...</div>
  </STabPane>
</STabs>`

const verticalRightCode = `<STabs v-model="verticalRightTab" type="bar" placement="right" :animated="true" bar-color="#10b981">
  <STabPane name="settings" tab="Settings" icon="cog">
    <div class="p-6">⚙️ Settings panel...</div>
  </STabPane>
  <STabPane name="profile" tab="Profile" icon="account">
    <div class="p-6">👤 Profile information...</div>
  </STabPane>
</STabs>`
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-(--s-text-primary) mb-2">Tabs</h1>
      <p class="text-lg text-(--s-text-secondary)">A highly customizable tab component for organizing content.</p>
    </header>

    <!-- Features -->
    <article class="space-y-4">
      <h2 class="text-2xl font-bold text-(--s-text-primary)">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 rounded-xl bg-(--s-bg-secondary) border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-tab text-2xl text-emerald-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Five Tab Types</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Line, card, segment, bar, and chip styles for different use cases.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary) border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-animation-outline text-2xl text-blue-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Smooth Animations</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Optional panel transitions with cubic-bezier easing effects.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary) border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-view-carousel-outline text-2xl text-rose-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Vertical Placement</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Top, bottom, left, and right tab placements for vertical layouts.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary) border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-close-circle text-2xl text-violet-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Closable Tabs</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Optional close buttons for dynamic tab management.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary) border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-palette-swatch-outline text-2xl text-amber-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Custom Theming</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Tailwind classes for tabs, active states, and panels.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary) border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-gesture-tap text-2xl text-cyan-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Trigger Modes</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Click or hover trigger modes for tab switching.</p>
        </div>
      </div>
    </article>

    <!-- Line Type -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Line Type (Default)</h2>
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
              <p class="mt-2 text-sm text-(--s-text-tertiary)">Line type shows an underline indicator on the active tab.</p>
            </div>
          </STabPane>
          <STabPane name="tab2" tab="Details">
            <div class="p-6 text-(--s-text-secondary)">
              <p>This is the Details tab content with more information.</p>
            </div>
          </STabPane>
          <STabPane name="tab3" tab="Settings">
            <div class="p-6 text-(--s-text-secondary)">
              <p>Settings and configuration options go here.</p>
            </div>
          </STabPane>
        </STabs>
      </DemoSection>
    </section>

    <!-- Card Type -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Card Type</h2>
      <DemoSection 
        title="Card Type"
        description="Card type wraps each tab in a bordered card style."
        :code="cardTypeCode"
        language="vue"
      >
        <STabs v-model="cardTabValue" type="card">
          <STabPane name="general" tab="General">
            <div class="p-6 text-(--s-text-secondary)">
              <p>General settings panel.</p>
            </div>
          </STabPane>
          <STabPane name="advanced" tab="Advanced">
            <div class="p-6 text-(--s-text-secondary)">
              <p>Advanced configuration options.</p>
            </div>
          </STabPane>
          <STabPane name="disabled" tab="Disabled" :disabled="true">
            <div class="p-6">This tab is disabled.</div>
          </STabPane>
        </STabs>
      </DemoSection>
    </section>

    <!-- Segment Type -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Segment Type</h2>
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

    <!-- Bar Type -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Bar Type</h2>
      <DemoSection 
        title="Bar Type"
        description="Bar type shows a bottom bar indicator."
        :code="barTypeCode"
        language="vue"
      >
        <STabs v-model="barTabValue" type="bar">
          <STabPane name="home" tab="Home" icon="home">
            <div class="p-6 text-(--s-text-secondary)">
              <p>Home page content.</p>
            </div>
          </STabPane>
          <STabPane name="search" tab="Search" icon="magnify">
            <div class="p-6 text-(--s-text-secondary)">
              <p>Search functionality goes here.</p>
            </div>
          </STabPane>
          <STabPane name="profile" tab="Profile" icon="account">
            <div class="p-6 text-(--s-text-secondary)">
              <p>User profile information.</p>
            </div>
          </STabPane>
        </STabs>
      </DemoSection>
    </section>

    <!-- Chip Type -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Chip Type</h2>
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
          chip-color="rgba(255, 255, 255, 0.06)"
          chip-active-color="#3b82f6"
        >
          <STabPane name="react" tab="React" icon="react">
            <div class="p-6 text-(--s-text-secondary)">
              <p>React framework selected.</p>
            </div>
          </STabPane>
          <STabPane name="vue" tab="Vue.js" icon="vuejs">
            <div class="p-6 text-(--s-text-secondary)">
              <p>Vue.js framework selected.</p>
            </div>
          </STabPane>
          <STabPane name="angular" tab="Angular" icon="angular">
            <div class="p-6 text-(--s-text-secondary)">
              <p>Angular framework selected.</p>
            </div>
          </STabPane>
          <STabPane name="svelte" tab="Svelte">
            <div class="p-6 text-(--s-text-secondary)">
              <p>Svelte framework selected.</p>
            </div>
          </STabPane>
        </STabs>
      </DemoSection>
    </section>

    <!-- Animated Tabs -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Animated Tabs</h2>
      <DemoSection 
        title="Animated Tabs"
        description="Content slides with cubic-bezier easing."
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

    <!-- Custom Theming -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Custom Theming</h2>
      <DemoSection 
        title="Custom Theming"
        description="Tailwind classes can be applied to almost every part."
        :code="customThemingCode"
        language="vue"
      >
        <STabs 
          v-model="customTabValue" 
          type="line" 
          bar-color="#ec4899"
          tab-class="font-semibold uppercase tracking-wider"
          active-tab-class="text-pink-400"
          panel-class="bg-(--s-bg-secondary)/50 rounded-lg mt-4"
        >
          <STabPane name="styled1" tab="Pink Theme">
            <div class="p-6 text-(--s-text-secondary)">
              <p>Custom pink accent color and uppercase tabs.</p>
            </div>
          </STabPane>
          <STabPane name="styled2" tab="Indigo Theme">
            <div class="p-6 text-(--s-text-secondary)">
              <p>Tailwind classes can be applied to almost every part.</p>
            </div>
          </STabPane>
        </STabs>
      </DemoSection>
    </section>

    <!-- Custom Tab Template -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Custom Tab Template</h2>
      <DemoSection 
        title="Custom Tab Template"
        description="Use the tab slot to create custom tab button templates."
        :code="customTemplateCode"
        language="vue"
      >
        <STabs v-model="customTemplateTab" type="line" :animated="true">
          <template #tab="{ pane, active }">
            <div class="flex items-center gap-2">
              <span 
                v-if="pane.name === 'inbox'"
                class="w-2 h-2 rounded-full"
                :class="active ? 'bg-emerald-400 animate-pulse' : 'bg-(--s-text-tertiary)'"
              />
              <span :class="active ? 'font-bold text-emerald-400' : 'text-(--s-text-secondary)'">
                {{ pane.tab }}
              </span>
              <span 
                v-if="pane.name === 'inbox'"
                class="text-xs px-1.5 py-0.5 rounded-full"
                :class="active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-(--s-bg-tertiary) text-(--s-text-secondary)'"
              >3</span>
            </div>
          </template>
          
          <STabPane name="inbox" tab="Inbox">
            <div class="p-6 text-(--s-text-secondary)">
              <p>📬 You have 3 new messages!</p>
            </div>
          </STabPane>
          <STabPane name="sent" tab="Sent">
            <div class="p-6 text-(--s-text-secondary)">
              <p>📤 Sent messages archive.</p>
            </div>
          </STabPane>
        </STabs>
      </DemoSection>
    </section>

    <!-- Closable Tabs -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Closable Tabs</h2>
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

    <!-- Trigger Event -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Trigger Event</h2>
      <DemoSection 
        title="Trigger Event"
        description="Tabs can be triggered on hover."
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

    <!-- Vertical Tabs -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Vertical Tabs</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <DemoSection 
          title="Left Placement"
          description="Vertical tabs with left placement."
          :code="verticalLeftCode"
          language="vue"
        >
          <STabs v-model="verticalLeftTab" type="line" placement="left" :animated="true" bar-color="#8b5cf6">
            <STabPane name="dashboard" tab="Dashboard" icon="view-dashboard">
              <div class="p-6 text-(--s-text-secondary)">
                <p class="text-lg font-semibold text-purple-400">📊 Dashboard</p>
                <p class="mt-2">Your main analytics overview.</p>
              </div>
            </STabPane>
            <STabPane name="users" tab="Users" icon="account-group">
              <div class="p-6 text-(--s-text-secondary)">
                <p class="text-lg font-semibold text-purple-400">👥 Users</p>
                <p class="mt-2">Manage your team members.</p>
              </div>
            </STabPane>
          </STabs>
        </DemoSection>

        <DemoSection 
          title="Right Placement"
          description="Vertical tabs with right placement."
          :code="verticalRightCode"
          language="vue"
        >
          <STabs v-model="verticalRightTab" type="bar" placement="right" :animated="true" bar-color="#10b981">
            <STabPane name="settings" tab="Settings" icon="cog">
              <div class="p-6 text-(--s-text-secondary) text-right">
                <p class="text-lg font-semibold text-emerald-400">⚙️ Settings</p>
                <p class="mt-2">Application settings panel.</p>
              </div>
            </STabPane>
            <STabPane name="profile" tab="Profile" icon="account">
              <div class="p-6 text-(--s-text-secondary) text-right">
                <p class="text-lg font-semibold text-emerald-400">👤 Profile</p>
                <p class="mt-2">Edit your profile information.</p>
              </div>
            </STabPane>
          </STabs>
        </DemoSection>
      </div>
    </section>

    <!-- Real-World Examples -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Real-World Examples</h2>
      <DemoSection 
        title="Settings Panel"
        description="A common tabs pattern for organizing application settings."
        :code="verticalLeftCode"
        language="vue"
      >
        <STabs v-model="verticalLeftTab" type="line" :animated="true">
          <STabPane name="dashboard" tab="Account" icon="account">
            <div class="p-6 text-(--s-text-secondary)">
              <p class="font-semibold mb-2">Account Settings</p>
              <p class="text-sm">Manage your profile, password, and account preferences.</p>
            </div>
          </STabPane>
          <STabPane name="users" tab="Notifications" icon="bell">
            <div class="p-6 text-(--s-text-secondary)">
              <p class="font-semibold mb-2">Notification Preferences</p>
              <p class="text-sm">Configure email, push, and in-app notifications.</p>
            </div>
          </STabPane>
        </STabs>
      </DemoSection>
    </section>

    <!-- API Reference -->
    <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">API Reference</h2>
    <SApiSection>
      <SApiTable
        title="STabs Props"
        type="props"
        :props="([
          { name: 'v-model', type: 'string | number', default: '-', description: 'Active tab value', category: 'Core' },
          { name: 'type', type: '\'line\' | \'card\' | \'segment\' | \'bar\' | \'chip\'', default: '\'line\'', description: 'Tab style variant', category: 'Appearance' },
          { name: 'size', type: '\'small\' | \'medium\' | \'large\'', default: '\'medium\'', description: 'Tab size', category: 'Appearance' },
          { name: 'placement', type: '\'top\' | \'left\' | \'right\' | \'bottom\'', default: '\'top\'', description: 'Tab position (vertical with left/right)', category: 'Appearance' },
          { name: 'animated', type: 'boolean', default: 'false', description: 'Enable morph animation on content', category: 'Behavior' },
          { name: 'closable', type: 'boolean', default: 'false', description: 'Show close buttons on tabs', category: 'Behavior' },
          { name: 'justifyContent', type: '\'flex-start\' | \'center\' | \'flex-end\' | ...', default: '\'flex-start\'', description: 'Tab alignment', category: 'Behavior' },
          { name: 'barColor', type: 'string', default: '\'#63e2b7\'', description: 'Active indicator color', category: 'Theming' },
          { name: 'chipColor', type: 'string', default: '\'rgba(255,255,255,0.08)\'', description: 'Inactive chip background', category: 'Theming' },
          { name: 'chipActiveColor', type: 'string', default: '\'#63e2b7\'', description: 'Active chip background', category: 'Theming' },
          { name: 'tabClass', type: 'string', default: '\'\'', description: 'Classes for all tabs', category: 'Custom Classes' },
          { name: 'activeTabClass', type: 'string', default: '\'\'', description: 'Classes for active tab', category: 'Custom Classes' },
          { name: 'panelClass', type: 'string', default: '\'\'', description: 'Classes for content panel', category: 'Custom Classes' },
          { name: 'tabsWrapperClass', type: 'string', default: '\'\'', description: 'Classes for tabs wrapper', category: 'Custom Classes' },
          { name: 'trigger', type: '\'click\' | \'hover\'', default: '\'click\'', description: 'Trigger mode for switching tabs', category: 'Custom Classes' }
        ] as ApiProp[])"
      />

      <SApiTable
        title="STabPane Props"
        type="props"
        :props="([
          { name: 'name', type: 'string | number', default: 'Required', description: 'Unique identifier' },
          { name: 'tab', type: 'string', default: 'Required', description: 'Tab button label' },
          { name: 'icon', type: 'string', default: '-', description: 'MDI icon name (without mdi- prefix)' },
          { name: 'disabled', type: 'boolean', default: '-', description: 'Disable this tab' },
          { name: 'closable', type: 'boolean', default: '-', description: 'Override parent\'s closable' },
          { name: 'tabClass', type: 'string', default: '-', description: 'Additional classes for this tab button' }
        ] as ApiProp[])"
      />

      <SApiTable
        title="Slots"
        type="slots"
        :slots="([
          { name: '#tab', props: '{ pane, active, disabled, close }', description: 'Custom tab button template. Receives pane info, active state, and close function.' }
        ] as ApiSlot[])"
      />

      <SApiTable
        title="Events"
        type="events"
        :events="([
          { name: '@update:modelValue', payload: 'string | number', description: 'v-model update' },
          { name: '@close', payload: 'string | number', description: 'Tab close clicked' },
          { name: '@before-leave', payload: '(from, to)', description: 'Before switching (return false to cancel)' }
        ] as ApiEvent[])"
      />
    </SApiSection>
  </div>
</template>
