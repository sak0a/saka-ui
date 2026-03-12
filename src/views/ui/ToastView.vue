<script setup lang="ts">
import { ref } from 'vue'
import {
  SButton, SCard, SCardContent, SCardHeader, SApiSection, SApiTable,
  SSelect, SOption, SInput,
  useToast, SToastContainer
} from '../../index'
import type { ApiProp, ApiMethod, ApiEvent, ToastPosition } from '../../index'
import DemoSection from '../../components/DemoSection.vue'

const toast = useToast()

// Demo state
const selectedPosition = ref<ToastPosition>('top-right')
const customTitle = ref('Custom Toast')
const customDescription = ref('This is a custom message')
const customDuration = ref(5000)

// Demo functions
function showSuccess() {
  toast.success('Operation completed successfully!')
}

function showError() {
  toast.error({
    title: 'Error',
    description: 'Something went wrong. Please try again.'
  })
}

function showWarning() {
  toast.warning({
    title: 'Warning',
    description: 'Please review your changes before proceeding.'
  })
}

function showInfo() {
  toast.info({
    title: 'Information',
    description: 'A new update is available for download.'
  })
}

function showLoading() {
  const loadingToast = toast.loading('Loading data...')
  setTimeout(() => {
    loadingToast.dismiss()
    toast.success('Data loaded successfully!')
  }, 2000)
}

function showCustom() {
  toast.custom({
    title: customTitle.value,
    description: customDescription.value,
    duration: customDuration.value,
    position: selectedPosition.value,
    color: '#8b5cf6'
  })
}

async function showPromise() {
  const fakeApiCall = () => new Promise<{ id: number }>((resolve) => {
    setTimeout(() => resolve({ id: 123 }), 2000)
  })
  
  try {
    await toast.promise(fakeApiCall(), {
      loading: 'Saving changes...',
      success: (data) => `Changes saved! (ID: ${data.id})`,
      error: 'Failed to save changes'
    })
  } catch {
    // Error already shown by toast.promise
  }
}

function showPositioned(position: ToastPosition) {
  toast.info({
    description: `Toast at ${position}`,
    position
  })
}

// Code examples
const basicCode = `import { useToast, SToastContainer } from '@sakoa/ui'

const toast = useToast()

// In template: <SToastContainer />

// Simple messages
toast.success('Changes saved!')
toast.error('Failed to save')
toast.warning('Check your input')
toast.info('New update available')`

const optionsCode = `toast.success({
  title: 'Success',
  description: 'Your changes have been saved.',
  duration: 3000,
  position: 'top-right',
  showProgress: true,
  closable: true,
  icon: 'check-circle',
  onClick: () => console.log('Clicked!'),
  onClose: () => console.log('Closed!')
})`

const promiseCode = `// Show loading → success/error based on promise
toast.promise(
  saveData(),
  {
    loading: 'Saving...',
    success: 'Saved successfully!',
    error: 'Failed to save'
  }
)

// With dynamic messages
toast.promise(submitForm(), {
  loading: 'Submitting...',
  success: (data) => \`Created item #\${data.id}\`,
  error: (err) => \`Error: \${err.message}\`
})`

const loadingCode = `// Loading toasts don't auto-dismiss
const loadingToast = toast.loading('Uploading file...')

// Dismiss when done
await uploadFile()
loadingToast.dismiss()
toast.success('Upload complete!')`

const positionCode = `// Available positions
toast.info({ description: 'Top left', position: 'top-left' })
toast.info({ description: 'Top center', position: 'top-center' })
toast.info({ description: 'Top right', position: 'top-right' })
toast.info({ description: 'Bottom left', position: 'bottom-left' })
toast.info({ description: 'Bottom center', position: 'bottom-center' })
toast.info({ description: 'Bottom right', position: 'bottom-right' })`

// API Tables
const toastMethods: ApiMethod[] = [
  { name: 'success(message | options)', description: 'Show a success toast' },
  { name: 'error(message | options)', description: 'Show an error toast' },
  { name: 'warning(message | options)', description: 'Show a warning toast' },
  { name: 'info(message | options)', description: 'Show an info toast' },
  { name: 'loading(message | options)', description: 'Show a loading toast (no auto-dismiss)' },
  { name: 'custom(options)', description: 'Show a custom styled toast' },
  { name: 'promise(promise, options)', description: 'Show loading → success/error based on promise' },
  { name: 'dismiss(id)', description: 'Dismiss a specific toast by ID' },
  { name: 'dismissAll()', description: 'Dismiss all active toasts' },
  { name: 'configure(config)', description: 'Set global toast configuration' }
]

const toastOptionsProps: ApiProp[] = [
  { name: 'title', type: 'string', description: 'Toast title' },
  { name: 'description', type: 'string', description: 'Toast message/description' },
  { name: 'duration', type: 'number', default: '5000', description: 'Duration in ms (0 = no auto-dismiss)' },
  { name: 'position', type: 'ToastPosition', default: "'top-right'", description: 'Position on screen' },
  { name: 'showProgress', type: 'boolean', default: 'true', description: 'Show progress bar' },
  { name: 'closable', type: 'boolean', default: 'true', description: 'Show close button' },
  { name: 'icon', type: 'string | boolean', description: 'Icon name or false to hide' },
  { name: 'color', type: 'string', description: 'Custom color for custom type' },
  { name: 'component', type: 'Component', description: 'Custom Vue component rendered in the toast body' },
  { name: 'componentProps', type: 'Record<string, unknown>', description: 'Props passed through to the custom component' },
  { name: 'onClick', type: '() => void', description: 'Callback when toast is clicked' },
  { name: 'onClose', type: '() => void', description: 'Callback when toast is closed' }
]

const containerProps: ApiProp[] = [
  { name: 'position', type: 'ToastPosition', default: "'top-right'", description: 'Container position' },
  { name: 'maxToasts', type: 'number', default: '5', description: 'Maximum toasts to display' },
  { name: 'gap', type: 'number', default: '8', description: 'Gap between toasts (px)' },
  { name: 'teleport', type: 'boolean | string', default: 'true', description: 'Teleport target' },
  { name: 'zIndex', type: 'number', default: '9999', description: 'Z-index for container' }
]

const toastProps: ApiProp[] = [
  { name: 'id', type: 'string', default: 'required', description: 'Unique toast instance identifier' },
  { name: 'type', type: 'ToastType', default: 'required', description: 'Visual toast type used for styling and defaults' },
  { name: 'title', type: 'string', default: 'undefined', description: 'Toast title' },
  { name: 'description', type: 'string', default: 'undefined', description: 'Toast message/description' },
  { name: 'duration', type: 'number', default: '5000', description: 'Duration in ms for progress display' },
  { name: 'showProgress', type: 'boolean', default: 'true', description: 'Show progress bar' },
  { name: 'closable', type: 'boolean', default: 'true', description: 'Show close button' },
  { name: 'icon', type: 'string | boolean', default: 'undefined', description: 'Icon name or false to hide it' },
  { name: 'color', type: 'string', default: 'undefined', description: 'Custom accent color for custom toasts' },
  { name: 'progress', type: 'number', default: '100', description: 'Current progress percentage' },
  { name: 'paused', type: 'boolean', default: 'false', description: 'Pause the progress timer visually and behaviorally' },
  { name: 'component', type: 'object', default: 'undefined', description: 'Custom Vue component rendered inside the toast' },
  { name: 'componentProps', type: 'Record<string, unknown>', default: 'undefined', description: 'Props forwarded to the custom component' },
]

const toastEvents: ApiEvent[] = [
  { name: 'close', payload: '-', description: 'Emitted when the toast close action runs' },
  { name: 'click', payload: '-', description: 'Emitted when the toast body is clicked' }
]
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- @component useToast -->
    <!-- @props title, description, duration, position, showProgress, closable, icon, color, component, componentProps, onClick, onClose, id, type, progress, paused, maxToasts, gap, teleport, zIndex -->
    <!-- @events close, click -->
    <!-- @sections quick-demo, basic-usage, toast-options, promise-based-toasts, loading-toasts, positions, custom-toast, api-reference -->
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-(--s-text-primary) mb-2">useToast</h1>
      <p class="text-lg text-(--s-text-secondary)">
        Toast notification composable with queue management, positioning, and promise-based API.
      </p>
    </header>

    <!-- Quick Demo -->
    <section id="quick-demo">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Quick Demo</h2>
      <SCard variant="outlined">
        <SCardContent class="flex flex-wrap gap-3">
          <SButton color="#10b981" @click="showSuccess">Success</SButton>
          <SButton color="#ef4444" @click="showError">Error</SButton>
          <SButton color="#f59e0b" @click="showWarning">Warning</SButton>
          <SButton color="#3b82f6" @click="showInfo">Info</SButton>
          <SButton variant="outlined" @click="showLoading">Loading → Success</SButton>
          <SButton variant="outlined" @click="showPromise">Promise Toast</SButton>
          <SButton variant="ghost" @click="toast.dismissAll()">Dismiss All</SButton>
        </SCardContent>
      </SCard>
    </section>

    <!-- Basic Usage -->
    <section id="basic-usage">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Basic Usage</h2>
      <DemoSection
        title="Simple Toasts"
        description="Show quick notifications with simple method calls."
        :code="basicCode"
        language="typescript"
        code-only
      />
    </section>

    <!-- Toast Options -->
    <section id="toast-options">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Toast Options</h2>
      <DemoSection
        title="With Options"
        description="Customize toasts with title, description, duration, and more."
        :code="optionsCode"
        language="typescript"
        code-only
      />
    </section>

    <!-- Promise Toasts -->
    <section id="promise-based-toasts">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Promise-based Toasts</h2>
      <DemoSection
        title="Async Operations"
        description="Automatically show loading, success, or error based on promise resolution."
        :code="promiseCode"
        language="typescript"
      >
        <SButton @click="showPromise">
          Try Promise Toast
        </SButton>
      </DemoSection>
    </section>

    <!-- Loading Toasts -->
    <section id="loading-toasts">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Loading Toasts</h2>
      <DemoSection
        title="Manual Control"
        description="Loading toasts don't auto-dismiss. Dismiss them manually when the operation completes."
        :code="loadingCode"
        language="typescript"
      >
        <SButton @click="showLoading">
          Show Loading Toast
        </SButton>
      </DemoSection>
    </section>

    <!-- Positions -->
    <section id="positions">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Positions</h2>
      <DemoSection
        title="Toast Positions"
        description="Toasts can appear in different screen positions."
        :code="positionCode"
        language="typescript"
      >
        <div class="grid grid-cols-3 gap-2 max-w-md">
          <SButton size="sm" variant="outlined" @click="showPositioned('top-left')">
            Top Left
          </SButton>
          <SButton size="sm" variant="outlined" @click="showPositioned('top-center')">
            Top Center
          </SButton>
          <SButton size="sm" variant="outlined" @click="showPositioned('top-right')">
            Top Right
          </SButton>
          <SButton size="sm" variant="outlined" @click="showPositioned('bottom-left')">
            Bottom Left
          </SButton>
          <SButton size="sm" variant="outlined" @click="showPositioned('bottom-center')">
            Bottom Center
          </SButton>
          <SButton size="sm" variant="outlined" @click="showPositioned('bottom-right')">
            Bottom Right
          </SButton>
        </div>
      </DemoSection>
    </section>

    <!-- Custom Toast -->
    <section id="custom-toast">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Custom Toast</h2>
      <SCard variant="outlined">
        <SCardHeader>
          <h3 class="font-semibold text-(--s-text-primary)">Create Custom Toast</h3>
        </SCardHeader>
        <SCardContent class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SInput v-model="customTitle" label="Title" />
            <SInput v-model="customDescription" label="Description" />
            <SInput v-model.number="customDuration" label="Duration (ms)" type="number" />
            <SSelect v-model="selectedPosition" label="Position">
              <SOption value="top-left">Top Left</SOption>
              <SOption value="top-center">Top Center</SOption>
              <SOption value="top-right">Top Right</SOption>
              <SOption value="bottom-left">Bottom Left</SOption>
              <SOption value="bottom-center">Bottom Center</SOption>
              <SOption value="bottom-right">Bottom Right</SOption>
            </SSelect>
          </div>
          <SButton @click="showCustom">Show Custom Toast</SButton>
        </SCardContent>
      </SCard>
    </section>

    <!-- API Reference -->
    <section id="api-reference">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">API Reference</h2>

      <SApiSection>
        <div class="space-y-8">
          <div>
            <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
              <span class="mdi mdi-bell-outline text-(--s-primary)" />
              useToast
            </h3>
            <SApiTable title="Methods" :methods="toastMethods" type="methods" />
          </div>

          <div>
            <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
              <span class="mdi mdi-tune-variant text-(--s-primary)" />
              ToastOptions
            </h3>
            <SApiTable title="Properties" :props="toastOptionsProps" type="props" />
          </div>

          <div>
            <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
              <span class="mdi mdi-message-badge-outline text-(--s-primary)" />
              SToast
            </h3>
            <SApiTable title="Props" :props="toastProps" type="props" />
            <SApiTable title="Events" :events="toastEvents" type="events" class="mt-6" />
          </div>

          <div>
            <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
              <span class="mdi mdi-view-stream-outline text-(--s-primary)" />
              SToastContainer
            </h3>
            <SApiTable title="Props" :props="containerProps" type="props" />
          </div>
        </div>
      </SApiSection>
    </section>
  </div>

  <!-- Toast Container -->
  <SToastContainer position="top-right" />
  <SToastContainer position="top-left" />
  <SToastContainer position="top-center" />
  <SToastContainer position="bottom-right" />
  <SToastContainer position="bottom-left" />
  <SToastContainer position="bottom-center" />
</template>
