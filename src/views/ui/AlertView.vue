<script setup lang="ts">
import { ref } from 'vue'
import { SAlert, SButton, SApiSection, SApiTable, SApiKeyboard } from '../../index'
import type { ApiProp, ApiEvent, ApiSlot, ApiMethod, KeyboardShortcut } from '../../index'
import DemoSection from '../../components/DemoSection.vue'
import { Timer, MousePointerClick, Keyboard } from 'lucide-vue-next'

// State for demo
const showToast = ref(false)
const toastCount = ref(0)
const activeToasts = ref<number[]>([])

function triggerToast() {
  const id = toastCount.value++
  activeToasts.value.push(id)
  
  setTimeout(() => {
    activeToasts.value = activeToasts.value.filter(t => t !== id)
  }, 5000)
}

// Code snippets
const basicCode = `<!-- Success Alert -->
<SAlert variant="success" title="Success!" description="Your changes have been saved successfully." />

<!-- Warning Alert -->
<SAlert variant="warning" title="Warning" description="This action cannot be undone." />

<!-- Error Alert -->
<SAlert variant="error" title="Error" description="Something went wrong. Please try again." />

<!-- Info Alert -->
<SAlert variant="info" title="Information" description="This is an informational message." />

<!-- Custom Alert -->
<SAlert variant="custom" color="#8b5cf6" title="Custom" description="A custom colored alert." />`

const sizesCode = `<!-- Small Alert -->
<SAlert size="small" variant="success" title="Small" description="This is a small alert." />

<!-- Medium Alert (default) -->
<SAlert size="medium" variant="info" title="Medium" description="This is a medium alert." />

<!-- Large Alert -->
<SAlert size="large" variant="warning" title="Large" description="This is a large alert." />`

const titlesCode = `<!-- Alert with title only -->
<SAlert variant="success" title="Operation completed successfully!" />

<!-- Alert with title and description -->
<SAlert 
  variant="info" 
  title="Update Available" 
  description="A new version of the application is available. Please update to get the latest features."
/>

<!-- Alert with description only -->
<SAlert variant="warning" description="You have unsaved changes." />`

const autoDismissCode = `<!-- Auto-dismiss with progress bar (default) -->
<SAlert 
  variant="success" 
  title="Auto Dismiss" 
  description="This alert will dismiss in 5 seconds."
  :auto-dismiss="true"
  :duration="5000"
/>

<!-- Auto-dismiss without progress bar -->
<SAlert 
  variant="info" 
  title="No Progress" 
  description="This alert auto-dismisses without showing progress."
  :auto-dismiss="true"
  :show-progress="false"
  :duration="3000"
/>

<!-- Custom duration -->
<SAlert 
  variant="warning" 
  title="Custom Duration" 
  description="This alert dismisses after 10 seconds."
  :auto-dismiss="true"
  :duration="10000"
/>`

const iconsCode = `<!-- Without icon -->
<SAlert variant="success" title="No Icon" :icon="false" />

<!-- Custom icon -->
<SAlert variant="info" title="Custom Icon" icon="rocket" />

<!-- Default icons (auto based on variant) -->
<SAlert variant="success" title="Success Icon" />
<SAlert variant="warning" title="Warning Icon" />
<SAlert variant="error" title="Error Icon" />
<SAlert variant="info" title="Info Icon" />`

const bordersCode = `<!-- No border -->
<SAlert variant="success" title="No Border" border="none" />

<!-- Left border (default) -->
<SAlert variant="info" title="Left Border" border="left" />

<!-- Top border -->
<SAlert variant="warning" title="Top Border" border="top" />

<!-- All borders -->
<SAlert variant="error" title="All Borders" border="all" />`

const actionsCode = `<SAlert variant="warning" title="Confirm Action" description="Are you sure you want to proceed?">
  <template #actions>
    <SButton size="small" variant="light" color="#ef4444">Cancel</SButton>
    <SButton size="small" variant="filled" color="#059669">Confirm</SButton>
  </template>
</SAlert>

<SAlert variant="info" title="Update Available" description="A new version is ready.">
  <template #actions>
    <SButton size="small" variant="link" color="#3b82f6">Learn More</SButton>
    <SButton size="small" variant="filled" color="#3b82f6">Update Now</SButton>
  </template>
</SAlert>`

const positioningCode = `<script setup>
import { ref } from 'vue'

const showToast = ref(false)

function triggerToast() {
  showToast.value = true
  setTimeout(() => showToast.value = false, 5000)
}
<\/script>

<template>
  <SButton @click="triggerToast">Show Toast</SButton>
  
  <SAlert 
    v-if="showToast"
    variant="success" 
    title="Toast Alert" 
    description="This is a fixed position toast!"
    position="top-right"
    :auto-dismiss="true"
    :duration="5000"
  />
</template>`

const stackedCode = `<script setup>
import { ref } from 'vue'

const activeToasts = ref([])
let toastId = 0

function addToast() {
  const id = toastId++
  activeToasts.value.push(id)
  
  setTimeout(() => {
    activeToasts.value = activeToasts.value.filter(t => t !== id)
  }, 5000)
}
<\/script>

<template>
  <SButton @click="addToast">Add Toast</SButton>
  
  <div class="fixed top-4 right-4 space-y-2 z-50">
    <SAlert
      v-for="id in activeToasts"
      :key="id"
      variant="success"
      title="Notification"
      :description="\`Alert #\${id}\`"
      :auto-dismiss="true"
    />
  </div>
</template>`

const richContentCode = `<SAlert variant="info">
  <template #title>
    <div class="flex items-center gap-2">
      <span class="mdi mdi-account-circle text-xl"></span>
      <span>User Profile Updated</span>
    </div>
  </template>
  <template #default>
    <div class="space-y-2">
      <p>Your profile has been updated with the following changes:</p>
      <ul class="list-disc list-inside space-y-1">
        <li>Display name changed to "John Doe"</li>
        <li>Email updated to john@example.com</li>
        <li>Profile picture uploaded</li>
      </ul>
    </div>
  </template>
  <template #actions>
    <SButton size="small" variant="ghost">Undo</SButton>
    <SButton size="small" variant="filled" color="#059669">View Profile</SButton>
  </template>
</SAlert>`

const customizationCode = `<!-- Custom color -->
<SAlert 
  variant="custom" 
  color="#8b5cf6" 
  title="Custom Purple" 
  description="A custom purple themed alert."
/>

<!-- Without elevation -->
<SAlert variant="info" title="No Shadow" :elevation="false" />

<!-- Without rounded corners -->
<SAlert variant="warning" title="Sharp Corners" :rounded="false" />

<!-- Dismissible on click -->
<SAlert 
  variant="success" 
  title="Click to Dismiss" 
  description="Click anywhere on this alert to dismiss it."
  :dismissible="true"
/>

<!-- Not closable -->
<SAlert variant="error" title="Cannot Close" :closable="false" />`

// API Reference data
const alertProps: ApiProp[] = [
  { name: 'variant', type: "'success' | 'warning' | 'error' | 'info' | 'custom'", default: "'info'", description: 'Visual style of the alert', category: 'Core' },
  { name: 'size', type: "'small' | 'medium' | 'large'", default: "'medium'", description: 'Size of the alert', category: 'Core' },
  { name: 'color', type: 'string', default: '—', description: "Custom color for 'custom' variant", category: 'Core' },
  { name: 'title', type: 'string', default: '—', description: 'Alert title text', category: 'Content' },
  { name: 'description', type: 'string', default: '—', description: 'Alert description text', category: 'Content' },
  { name: 'icon', type: 'string | boolean', default: 'true', description: 'Custom icon name or false to hide, true for default', category: 'Content' },
  { name: 'autoDismiss', type: 'boolean', default: 'false', description: 'Automatically dismiss after duration', category: 'Auto-dismiss' },
  { name: 'duration', type: 'number', default: '5000', description: 'Auto-dismiss duration in milliseconds', category: 'Auto-dismiss' },
  { name: 'showProgress', type: 'boolean', default: 'true', description: 'Show progress bar for auto-dismiss', category: 'Auto-dismiss' },
  { name: 'border', type: "'none' | 'left' | 'top' | 'all'", default: "'left'", description: 'Border style', category: 'Appearance' },
  { name: 'rounded', type: 'boolean', default: 'true', description: 'Apply rounded corners', category: 'Appearance' },
  { name: 'elevation', type: 'boolean', default: 'true', description: 'Add shadow elevation', category: 'Appearance' },
  { name: 'position', type: "'static' | 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'", default: "'static'", description: 'Positioning style (static or fixed)', category: 'Appearance' },
  { name: 'closable', type: 'boolean', default: 'true', description: 'Show close button', category: 'Behavior' },
  { name: 'dismissible', type: 'boolean', default: 'false', description: 'Allow click on alert body to dismiss', category: 'Behavior' }
]

const alertEvents: ApiEvent[] = [
  { name: '@close', description: 'Emitted when alert is closed by user' },
  { name: '@dismiss', description: 'Emitted when alert auto-dismisses' }
]

const alertSlots: ApiSlot[] = [
  { name: 'default', description: 'Main content area (replaces description prop)' },
  { name: 'title', description: 'Custom title content (replaces title prop)' },
  { name: 'icon', description: 'Custom icon content (replaces default variant icon)' },
  { name: 'actions', description: 'Action buttons or links displayed below the content' }
]

const alertMethods: ApiMethod[] = [
  { name: 'close()', description: 'Programmatically close the alert' },
  { name: 'pause()', description: 'Pause the auto-dismiss timer' },
  { name: 'resume()', description: 'Resume the auto-dismiss timer' }
]

const keyboardShortcuts: KeyboardShortcut[] = [
  { keys: 'Escape', action: 'Close the alert (when closable)' }
]
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-(--s-text-primary) mb-2">Alerts</h1>
      <p class="text-lg text-(--s-text-secondary)">
        Display important messages and notifications to users with customizable alerts supporting multiple variants, sizes, and interactive features.
      </p>
    </header>

    <!-- Features -->
    <article>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-palette-outline text-xl text-emerald-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Multiple Variants</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Five built-in variants (success, warning, error, info, custom) with appropriate colors and icons.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <Timer class="w-5 h-5 text-blue-500" />
            <h3 class="font-semibold text-(--s-text-primary)">Auto-dismiss</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Automatically dismiss alerts with configurable duration and visual progress indicator.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-map-marker text-xl text-purple-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Flexible Positioning</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Static or fixed positioning for toast-style notifications in corners or center.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <MousePointerClick class="w-5 h-5 text-amber-500" />
            <h3 class="font-semibold text-(--s-text-primary)">Action Buttons</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Add interactive buttons using the actions slot for confirm/cancel dialogs.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-pause-circle-outline text-xl text-red-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Pause on Hover</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Auto-dismiss timer pauses when hovering over the alert and resumes on mouse leave.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <Keyboard class="w-5 h-5 text-cyan-500" />
            <h3 class="font-semibold text-(--s-text-primary)">Keyboard Support</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Press Escape to close alerts with full keyboard accessibility support.</p>
        </div>
      </div>
    </article>

    <!-- Basic Usage -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Basic Usage</h2>
      <DemoSection 
        title="Alert Variants"
        description="Choose from five different variants to match the message type. Each variant has predefined colors and icons."
        :code="basicCode"
        language="vue"
      >
        <div class="space-y-3">
          <SAlert variant="success" title="Success!" description="Your changes have been saved successfully." />
          <SAlert variant="warning" title="Warning" description="This action cannot be undone." />
          <SAlert variant="error" title="Error" description="Something went wrong. Please try again." />
          <SAlert variant="info" title="Information" description="This is an informational message." />
          <SAlert variant="custom" color="#8b5cf6" title="Custom" description="A custom colored alert." />
        </div>
      </DemoSection>
    </section>

    <!-- Sizes -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Sizes</h2>
      <DemoSection 
        title="Alert Sizes"
        description="Three size options to fit different contexts and layouts."
        :code="sizesCode"
        language="vue"
      >
        <div class="space-y-3">
          <SAlert size="small" variant="success" title="Small" description="This is a small alert." />
          <SAlert size="medium" variant="info" title="Medium" description="This is a medium alert." />
          <SAlert size="large" variant="warning" title="Large" description="This is a large alert." />
        </div>
      </DemoSection>
    </section>

    <!-- Titles and Descriptions -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Titles & Descriptions</h2>
      <DemoSection 
        title="Content Variations"
        description="Use titles alone, descriptions alone, or both together for maximum flexibility."
        :code="titlesCode"
        language="vue"
      >
        <div class="space-y-3">
          <SAlert variant="success" title="Operation completed successfully!" />
          <SAlert 
            variant="info" 
            title="Update Available" 
            description="A new version of the application is available. Please update to get the latest features."
          />
          <SAlert variant="warning" description="You have unsaved changes." />
        </div>
      </DemoSection>
    </section>

    <!-- Auto Dismiss -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Auto Dismiss</h2>
      <DemoSection 
        title="Automatic Dismissal"
        description="Alerts can automatically dismiss after a specified duration. Hover to pause the timer."
        :code="autoDismissCode"
        language="vue"
      >
        <div class="space-y-3">
          <SAlert 
            variant="success" 
            title="Auto Dismiss" 
            description="This alert will dismiss in 5 seconds. Hover to pause."
            :auto-dismiss="true"
            :duration="5000"
          />
          <SAlert 
            variant="info" 
            title="No Progress" 
            description="This alert auto-dismisses without showing progress."
            :auto-dismiss="true"
            :show-progress="false"
            :duration="3000"
          />
          <SAlert 
            variant="warning" 
            title="Custom Duration" 
            description="This alert dismisses after 10 seconds."
            :auto-dismiss="true"
            :duration="10000"
          />
        </div>
      </DemoSection>
    </section>

    <!-- Custom Icons -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Icons</h2>
      <DemoSection 
        title="Icon Customization"
        description="Use default variant icons, custom icons, or hide the icon entirely."
        :code="iconsCode"
        language="vue"
      >
        <div class="space-y-3">
          <SAlert variant="success" title="No Icon" :icon="false" />
          <SAlert variant="info" title="Custom Icon" icon="rocket" />
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <SAlert variant="success" title="Success Icon" description="Default check-circle icon" />
            <SAlert variant="warning" title="Warning Icon" description="Default alert icon" />
            <SAlert variant="error" title="Error Icon" description="Default alert-circle icon" />
            <SAlert variant="info" title="Info Icon" description="Default information icon" />
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Borders -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Border Styles</h2>
      <DemoSection 
        title="Border Options"
        description="Choose from different border styles to emphasize alerts."
        :code="bordersCode"
        language="vue"
      >
        <div class="space-y-3">
          <SAlert variant="success" title="No Border" border="none" />
          <SAlert variant="info" title="Left Border" border="left" description="Default border style" />
          <SAlert variant="warning" title="Top Border" border="top" />
          <SAlert variant="error" title="All Borders" border="all" />
        </div>
      </DemoSection>
    </section>

    <!-- Actions -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Action Buttons</h2>
      <DemoSection 
        title="Alerts with Actions"
        description="Add action buttons to alerts for user interaction."
        :code="actionsCode"
        language="vue"
      >
        <div class="space-y-3">
          <SAlert variant="warning" title="Confirm Action" description="Are you sure you want to proceed?">
            <template #actions>
              <SButton size="small" variant="light" color="#ef4444">Cancel</SButton>
              <SButton size="small" variant="filled" color="#059669">Confirm</SButton>
            </template>
          </SAlert>

          <SAlert variant="info" title="Update Available" description="A new version is ready.">
            <template #actions>
              <SButton size="small" variant="link" color="#3b82f6">Learn More</SButton>
              <SButton size="small" variant="filled" color="#3b82f6">Update Now</SButton>
            </template>
          </SAlert>
        </div>
      </DemoSection>
    </section>

    <!-- Positioning -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Positioning</h2>
      <DemoSection 
        title="Toast-style Alerts"
        description="Use fixed positioning for toast-style notifications. Click the button to see a toast in the top-right corner."
        :code="positioningCode"
        language="vue"
      >
        <div class="space-y-3">
          <SButton @click="showToast = !showToast">
            {{ showToast ? 'Hide Toast' : 'Show Toast' }}
          </SButton>
          <p class="text-sm text-(--s-text-secondary)">
            Position options: top, bottom, top-left, top-right, bottom-left, bottom-right
          </p>
        </div>
      </DemoSection>

      <SAlert 
        v-if="showToast"
        variant="success" 
        title="Toast Alert" 
        description="This is a fixed position toast!"
        position="top-right"
        :auto-dismiss="true"
        :duration="5000"
        @dismiss="showToast = false"
      />
    </section>

    <!-- Stacked Alerts -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Stacked Alerts</h2>
      <DemoSection 
        title="Multiple Alerts"
        description="Stack multiple alerts using a container. Click to add new toasts."
        :code="stackedCode"
        language="vue"
      >
        <SButton @click="triggerToast">Add Toast Notification</SButton>
      </DemoSection>

      <div class="fixed top-4 right-4 space-y-2 z-50 max-w-md">
        <TransitionGroup name="toast-list">
          <SAlert
            v-for="id in activeToasts"
            :key="id"
            variant="success"
            title="Notification"
            :description="`Alert #${id + 1}`"
            :auto-dismiss="true"
            :duration="5000"
            @dismiss="activeToasts = activeToasts.filter(t => t !== id)"
          />
        </TransitionGroup>
      </div>
    </section>

    <!-- Rich Content -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Rich Content</h2>
      <DemoSection 
        title="Custom Content"
        description="Use slots to create complex alert content with custom layouts."
        :code="richContentCode"
        language="vue"
      >
        <SAlert variant="info">
          <template #title>
            <div class="flex items-center gap-2">
              <span class="mdi mdi-account-circle text-xl"></span>
              <span>User Profile Updated</span>
            </div>
          </template>
          <template #default>
            <div class="space-y-2">
              <p>Your profile has been updated with the following changes:</p>
              <ul class="list-disc list-inside space-y-1">
                <li>Display name changed to "John Doe"</li>
                <li>Email updated to john@example.com</li>
                <li>Profile picture uploaded</li>
              </ul>
            </div>
          </template>
          <template #actions>
            <SButton size="small" variant="ghost">Undo</SButton>
            <SButton size="small" variant="filled" color="#059669">View Profile</SButton>
          </template>
        </SAlert>
      </DemoSection>
    </section>

    <!-- Customization -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Customization</h2>
      <DemoSection 
        title="Advanced Customization"
        description="Fine-tune the appearance and behavior of alerts."
        :code="customizationCode"
        language="vue"
      >
        <div class="space-y-3">
          <SAlert 
            variant="custom" 
            color="#8b5cf6" 
            title="Custom Purple" 
            description="A custom purple themed alert."
          />
          <SAlert variant="info" title="No Shadow" :elevation="false" description="Alert without elevation shadow" />
          <SAlert variant="warning" title="Sharp Corners" :rounded="false" description="Alert with sharp corners" />
          <SAlert 
            variant="success" 
            title="Click to Dismiss" 
            description="Click anywhere on this alert to dismiss it."
            :dismissible="true"
          />
          <SAlert variant="error" title="Cannot Close" description="This alert has no close button" :closable="false" />
        </div>
      </DemoSection>
    </section>

    <!-- Real-World Examples -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Real-World Examples</h2>
      <DemoSection 
        title="Notification System"
        description="Common alert patterns used in real applications for form validation, success messages, and error handling."
        :code="customizationCode"
        language="vue"
      >
        <div class="space-y-4">
          <SAlert type="success" closable>
            <template #title>Payment Successful</template>
            Your order #12345 has been confirmed. A confirmation email has been sent.
          </SAlert>
          <SAlert type="danger" closable>
            <template #title>Authentication Failed</template>
            Invalid credentials. Please check your email and password.
          </SAlert>
          <SAlert type="warning">
            <template #title>Session Expiring</template>
            Your session will expire in 5 minutes. Save your work to avoid losing changes.
          </SAlert>
        </div>
      </DemoSection>
    </section>

    <!-- API Reference -->
    <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">API Reference</h2>
    <SApiSection>
      <SApiTable title="Props" type="props" :props="alertProps" />
      <SApiTable title="Events" type="events" :events="alertEvents" />
      <SApiTable title="Slots" type="slots" :slots="alertSlots">
        <div class="mt-4 p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <h4 class="text-sm font-semibold text-(--s-text-primary) mb-3">Example: Using the actions slot</h4>
          <pre class="text-xs bg-(--s-bg-tertiary) p-3 rounded-lg overflow-x-auto"><code class="text-(--s-text-secondary)">&lt;SAlert variant="warning" title="Confirm Action" description="Are you sure?"&gt;
  &lt;template #actions&gt;
    &lt;SButton size="small" variant="light" color="#ef4444"&gt;Cancel&lt;/SButton&gt;
    &lt;SButton size="small" variant="filled" color="#059669"&gt;Confirm&lt;/SButton&gt;
  &lt;/template&gt;
&lt;/SAlert&gt;</code></pre>
        </div>
      </SApiTable>
      <SApiTable title="Exposed Methods" type="methods" :methods="alertMethods" />
      <SApiKeyboard :shortcuts="keyboardShortcuts" />
    </SApiSection>
  </div>
</template>

<style scoped>
/* Toast list transitions */
.toast-list-enter-active,
.toast-list-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-list-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-list-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-list-move {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
