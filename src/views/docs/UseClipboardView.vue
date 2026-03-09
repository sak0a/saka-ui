<script setup lang="ts">
import { ref } from 'vue'
import {
  SButton, SCard, SCardContent, SCardHeader, SApiSection, SApiTable,
  SInput, SToastContainer
} from '../../index'
import { useClipboard } from '../../composables/useClipboard'
import type { ApiProp, ApiMethod } from '../../index'
import DemoSection from '../../components/DemoSection.vue'

const clipboard = useClipboard()

// Demo state
const textToCopy = ref('Hello, World! This is sample text to copy.')
const inputValue = ref('Copy this input value')
const copyStatus = ref<string>('')
const codeElementRef = ref<HTMLElement | null>(null)

// Demo functions
async function handleBasicCopy() {
  const success = await clipboard.copy(textToCopy.value)
  copyStatus.value = success ? 'Copied!' : 'Failed to copy'
  setTimeout(() => { copyStatus.value = '' }, 2000)
}

async function handleCopyWithToast() {
  await clipboard.copy(textToCopy.value, {
    showToast: true,
    successMessage: 'Text copied to clipboard!'
  })
}

async function handleCopyInput() {
  await clipboard.copy(inputValue.value, { showToast: true })
}

async function handleCopyFromElement() {
  await clipboard.copyFromElement(codeElementRef.value, {
    showToast: true,
    successMessage: 'Code copied!'
  })
}

// Code examples
const basicCode = `import { useClipboard } from 'saka-ui'

const clipboard = useClipboard()

// Basic copy
const success = await clipboard.copy('Hello, World!')

if (success) {
  console.log('Copied successfully!')
}`

const toastCode = `// Copy with toast notification
await clipboard.copy('Some text', {
  showToast: true,
  successMessage: 'Copied to clipboard!',
  errorMessage: 'Failed to copy'
})`

const elementCode = `// Copy text from an element
const elementRef = ref<HTMLElement>()

await clipboard.copyFromElement(elementRef.value, {
  showToast: true
})`

const stateCode = `// Access clipboard state
const clipboard = useClipboard()

await clipboard.copy('text')

console.log(clipboard.state.copied)  // true
console.log(clipboard.state.text)    // 'text'
console.log(clipboard.state.error)   // null

// Check API support
if (clipboard.isSupported) {
  console.log('Modern Clipboard API available')
}`

// API Tables
const clipboardMethods: ApiMethod[] = [
  { name: 'copy(text, options?)', description: 'Copy text to clipboard. Returns Promise<boolean>.' },
  { name: 'copyFromElement(element, options?)', description: 'Copy text content from an HTML element.' },
  { name: 'reset()', description: 'Reset the clipboard state.' }
]

const clipboardProps: ApiProp[] = [
  { name: 'isSupported', type: 'boolean', description: 'Whether the Clipboard API is supported' },
  { name: 'state.copied', type: 'boolean', description: 'Whether the last copy was successful' },
  { name: 'state.text', type: 'string | null', description: 'The last copied text' },
  { name: 'state.error', type: 'Error | null', description: 'Any error from the last operation' }
]

const copyOptionsProps: ApiProp[] = [
  { name: 'showToast', type: 'boolean', default: 'false', description: 'Show toast notification on copy' },
  { name: 'successMessage', type: 'string', default: "'Copied to clipboard!'", description: 'Custom success message for toast' },
  { name: 'errorMessage', type: 'string', default: "'Failed to copy to clipboard'", description: 'Custom error message for toast' }
]
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-(--s-text-primary) mb-2">useClipboard</h1>
      <p class="text-lg text-(--s-text-secondary)">
        Copy to clipboard with modern API support, fallback for older browsers, and optional toast notifications.
      </p>
    </header>

    <!-- Quick Demo -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Quick Demo</h2>
      <SCard variant="outlined">
        <SCardContent class="space-y-4">
          <div class="flex items-center gap-3 flex-wrap">
            <SInput v-model="textToCopy" class="flex-1 min-w-64" />
            <SButton @click="handleBasicCopy">
              Copy
            </SButton>
            <SButton variant="outlined" @click="handleCopyWithToast">
              Copy with Toast
            </SButton>
          </div>
          <p v-if="copyStatus" class="text-sm text-emerald-600 dark:text-emerald-400">
            {{ copyStatus }}
          </p>
          <p class="text-sm text-(--s-text-secondary)">
            Clipboard API supported: 
            <span :class="clipboard.isSupported ? 'text-emerald-500' : 'text-red-500'">
              {{ clipboard.isSupported ? 'Yes' : 'No (using fallback)' }}
            </span>
          </p>
        </SCardContent>
      </SCard>
    </section>

    <!-- Basic Usage -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Basic Usage</h2>
      <DemoSection
        title="Simple Copy"
        description="Copy text to clipboard with a simple async function."
        :code="basicCode"
        language="typescript"
        code-only
      />
    </section>

    <!-- With Toast -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Toast Notifications</h2>
      <DemoSection
        title="Copy with Feedback"
        description="Automatically show toast notifications on copy success or failure."
        :code="toastCode"
        language="typescript"
      >
        <SButton @click="handleCopyWithToast">
          Copy with Toast
        </SButton>
      </DemoSection>
    </section>

    <!-- Copy from Input -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Copy from Input</h2>
      <SCard variant="outlined">
        <SCardHeader>
          <h3 class="font-semibold text-(--s-text-primary)">Copy Input Value</h3>
        </SCardHeader>
        <SCardContent class="space-y-4">
          <div class="flex items-center gap-3">
            <SInput v-model="inputValue" class="flex-1" />
            <SButton @click="handleCopyInput">
              Copy
            </SButton>
          </div>
        </SCardContent>
      </SCard>
    </section>

    <!-- Copy from Element -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Copy from Element</h2>
      <DemoSection
        title="Copy Element Content"
        description="Copy text content from any HTML element."
        :code="elementCode"
        language="typescript"
      >
        <div class="space-y-4">
          <pre 
            ref="codeElementRef"
            class="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto text-sm"
          ><code>const greeting = 'Hello, World!'
console.log(greeting)</code></pre>
          <SButton @click="handleCopyFromElement">
            Copy Code
          </SButton>
        </div>
      </DemoSection>
    </section>

    <!-- State -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Clipboard State</h2>
      <DemoSection
        title="Accessing State"
        description="Track copy state and check API support."
        :code="stateCode"
        language="typescript"
      >
        <SCard variant="filled" class="max-w-md">
          <SCardContent class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-(--s-text-secondary)">Last copied:</span>
              <span class="text-(--s-text-primary) font-mono">
                {{ clipboard.state.copied ? `"${clipboard.state.text?.slice(0, 30)}..."` : 'Nothing yet' }}
              </span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-(--s-text-secondary)">Status:</span>
              <span :class="clipboard.state.copied ? 'text-emerald-500' : 'text-(--s-text-secondary)'">
                {{ clipboard.state.copied ? 'Copied' : 'Ready' }}
              </span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-(--s-text-secondary)">Error:</span>
              <span class="text-red-500">
                {{ clipboard.state.error?.message ?? 'None' }}
              </span>
            </div>
          </SCardContent>
        </SCard>
      </DemoSection>
    </section>

    <!-- API Reference -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">API Reference</h2>
      
      <SApiSection title="useClipboard Methods">
        <SApiTable title="Methods" :methods="clipboardMethods" type="methods" />
      </SApiSection>

      <div class="mt-8">
        <SApiSection title="Return Properties">
          <SApiTable title="Properties" :props="clipboardProps" type="props" />
        </SApiSection>
      </div>

      <div class="mt-8">
        <SApiSection title="CopyOptions">
          <SApiTable title="Properties" :props="copyOptionsProps" type="props" />
        </SApiSection>
      </div>
    </section>
  </div>

  <!-- Toast Container -->
  <SToastContainer />
</template>
