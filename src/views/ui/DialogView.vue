<script setup lang="ts">
import { ref } from 'vue'
import {
  SButton, SCard, SCardContent, SCardHeader, SApiSection, SApiTable,
  SInput, SSelect, SOption, SAlert,
  useDialog, useToast, SToastContainer
} from '../../index'
import type { ApiProp, ApiMethod, DialogVariant } from '../../index'
import DemoSection from '../../components/DemoSection.vue'

const dialog = useDialog()
const toast = useToast()

// Demo state
const lastResult = ref<string>('')
const selectedVariant = ref<DialogVariant>('default')

// Demo functions
async function showConfirm() {
  const confirmed = await dialog.confirm({
    title: 'Confirm Action',
    description: 'Are you sure you want to proceed with this action?',
    confirmText: 'Yes, proceed',
    cancelText: 'Cancel'
  })
  
  lastResult.value = confirmed ? 'User confirmed' : 'User cancelled'
  if (confirmed) {
    toast.success('Action confirmed!')
  }
}

async function showDangerConfirm() {
  const confirmed = await dialog.confirm({
    title: 'Delete Item',
    description: 'This will permanently delete the item. This action cannot be undone.',
    variant: 'danger',
    confirmText: 'Delete',
    cancelText: 'Cancel'
  })
  
  lastResult.value = confirmed ? 'Item deleted' : 'Deletion cancelled'
  if (confirmed) {
    toast.success('Item deleted successfully')
  }
}

async function showWarningConfirm() {
  const confirmed = await dialog.confirm({
    title: 'Change Settings',
    description: 'Changing these settings will require a restart. Do you want to continue?',
    variant: 'warning',
    confirmText: 'Change Settings'
  })
  
  if (confirmed) {
    toast.info('Settings changed')
  }
}

async function showPrompt() {
  const name = await dialog.prompt({
    title: 'Enter Your Name',
    description: 'Please enter your full name to continue.',
    placeholder: 'John Doe',
    required: true
  })
  
  if (name) {
    lastResult.value = `User entered: ${name}`
    toast.success(`Hello, ${name}!`)
  } else {
    lastResult.value = 'User cancelled prompt'
  }
}

async function showPromptWithValidation() {
  const email = await dialog.prompt({
    title: 'Enter Email',
    description: 'We\'ll send a confirmation to this email address.',
    placeholder: 'you@example.com',
    inputType: 'email',
    required: true,
    validate: (value) => {
      if (!value.includes('@')) {
        return 'Please enter a valid email address'
      }
      return true
    }
  })
  
  if (email) {
    toast.success(`Confirmation sent to ${email}`)
  }
}

async function showPasswordPrompt() {
  const password = await dialog.prompt({
    title: 'Enter Password',
    description: 'Please enter your current password to continue.',
    inputType: 'password',
    required: true,
    minLength: 6
  })
  
  if (password) {
    toast.success('Password verified')
  }
}

async function showAlert() {
  await dialog.alert({
    title: 'Success!',
    description: 'Your operation has been completed successfully.',
    variant: 'success',
    buttonText: 'Great!'
  })
  
  lastResult.value = 'Alert dismissed'
}

async function showInfoAlert() {
  await dialog.alert({
    title: 'Did You Know?',
    description: 'You can use keyboard shortcuts to navigate faster. Press Ctrl+K to open the command palette.',
    variant: 'info'
  })
}

async function showVariantDemo() {
  const confirmed = await dialog.confirm({
    title: 'Variant Demo',
    description: `This is a ${selectedVariant.value} variant dialog.`,
    variant: selectedVariant.value
  })
  
  if (confirmed) {
    toast.info(`Confirmed with ${selectedVariant.value} variant`)
  }
}

// Code examples
const confirmCode = `import { useDialog } from 'saka-ui'

const dialog = useDialog()

async function handleDelete() {
  const confirmed = await dialog.confirm({
    title: 'Delete Item',
    description: 'Are you sure you want to delete this item?',
    variant: 'danger',
    confirmText: 'Delete',
    cancelText: 'Cancel'
  })
  
  if (confirmed) {
    await deleteItem()
    toast.success('Item deleted')
  }
}`

const promptCode = `const name = await dialog.prompt({
  title: 'Enter Name',
  description: 'Please enter your full name.',
  placeholder: 'John Doe',
  defaultValue: '',
  required: true,
  validate: (value) => {
    if (value.length < 2) return 'Name is too short'
    return true
  }
})

if (name) {
  console.log('User entered:', name)
}`

const alertCode = `await dialog.alert({
  title: 'Success!',
  description: 'Your changes have been saved.',
  variant: 'success',
  buttonText: 'OK'
})

// Alert returns void, code continues after user clicks OK`

const variantsCode = `// Available variants
dialog.confirm({ variant: 'default' })  // Blue - General confirmations
dialog.confirm({ variant: 'danger' })   // Red - Destructive actions
dialog.confirm({ variant: 'warning' })  // Amber - Cautionary actions
dialog.confirm({ variant: 'success' })  // Green - Positive confirmations
dialog.confirm({ variant: 'info' })     // Blue - Informational`

// API Tables
const dialogMethods: ApiMethod[] = [
  { name: 'confirm(options)', description: 'Show a confirm dialog, returns Promise<boolean>' },
  { name: 'prompt(options)', description: 'Show a prompt dialog, returns Promise<string | null>' },
  { name: 'alert(options)', description: 'Show an alert dialog, returns Promise<void>' },
  { name: 'custom(options)', description: 'Show a custom dialog with component, returns Promise<T | null>' },
  { name: 'closeAll()', description: 'Close all open dialogs' }
]

const confirmProps: ApiProp[] = [
  { name: 'title', type: 'string', description: 'Dialog title (required)' },
  { name: 'description', type: 'string', description: 'Dialog description' },
  { name: 'confirmText', type: 'string', default: "'Confirm'", description: 'Confirm button text' },
  { name: 'cancelText', type: 'string', default: "'Cancel'", description: 'Cancel button text' },
  { name: 'variant', type: 'DialogVariant', default: "'default'", description: 'Visual variant' },
  { name: 'icon', type: 'string | boolean', description: 'Icon name or false to hide' },
  { name: 'closeOnBackdrop', type: 'boolean', default: 'true', description: 'Close on backdrop click' },
  { name: 'closeOnEscape', type: 'boolean', default: 'true', description: 'Close on Escape key' }
]

const promptProps: ApiProp[] = [
  { name: 'placeholder', type: 'string', description: 'Input placeholder text' },
  { name: 'defaultValue', type: 'string', default: "''", description: 'Default input value' },
  { name: 'required', type: 'boolean', default: 'false', description: 'Whether input is required' },
  { name: 'inputType', type: 'string', default: "'text'", description: 'Input type (text, password, email, etc.)' },
  { name: 'minLength', type: 'number', description: 'Minimum input length' },
  { name: 'maxLength', type: 'number', description: 'Maximum input length' },
  { name: 'validate', type: '(value: string) => string | true', description: 'Custom validation function' }
]

const alertProps: ApiProp[] = [
  { name: 'title', type: 'string', description: 'Alert title (required)' },
  { name: 'description', type: 'string', description: 'Alert description' },
  { name: 'buttonText', type: 'string', default: "'OK'", description: 'Button text' },
  { name: 'variant', type: 'DialogVariant', default: "'info'", description: 'Visual variant' }
]
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- @component useDialog -->
    <!-- @props title, description, confirmText, cancelText, variant, icon, closeOnBackdrop, closeOnEscape, placeholder, defaultValue, required, inputType, minLength, maxLength, validate, buttonText -->
    <!-- @sections quick-demo, confirm-dialog, prompt-dialog, alert-dialog, dialog-variants, common-use-cases, api-reference -->
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-(--s-text-primary) mb-2">useDialog</h1>
      <p class="text-lg text-(--s-text-secondary)">
        Programmatic dialog composable for confirm, prompt, and alert dialogs.
      </p>
    </header>

    <!-- Quick Demo -->
    <section id="quick-demo">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Quick Demo</h2>
      <SCard variant="outlined">
        <SCardContent class="space-y-4">
          <div class="flex flex-wrap gap-3">
            <SButton @click="showConfirm">Confirm Dialog</SButton>
            <SButton color="#ef4444" @click="showDangerConfirm">Danger Confirm</SButton>
            <SButton color="#f59e0b" @click="showWarningConfirm">Warning Confirm</SButton>
            <SButton variant="outlined" @click="showPrompt">Prompt Dialog</SButton>
            <SButton variant="outlined" @click="showAlert">Alert Dialog</SButton>
          </div>
          <SAlert
            v-if="lastResult"
            type="info"
            :description="lastResult"
            closable
            @close="lastResult = ''"
          />
        </SCardContent>
      </SCard>
    </section>

    <!-- Confirm Dialog -->
    <section id="confirm-dialog">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Confirm Dialog</h2>
      <DemoSection
        title="Confirmation Dialogs"
        description="Ask users to confirm actions. Returns true if confirmed, false if cancelled."
        :code="confirmCode"
        language="typescript"
      >
        <div class="flex flex-wrap gap-3">
          <SButton @click="showConfirm">Default Confirm</SButton>
          <SButton color="#ef4444" @click="showDangerConfirm">Danger Confirm</SButton>
          <SButton color="#f59e0b" @click="showWarningConfirm">Warning Confirm</SButton>
        </div>
      </DemoSection>
    </section>

    <!-- Prompt Dialog -->
    <section id="prompt-dialog">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Prompt Dialog</h2>
      <DemoSection
        title="Input Prompts"
        description="Get user input with optional validation. Returns the entered value or null if cancelled."
        :code="promptCode"
        language="typescript"
      >
        <div class="flex flex-wrap gap-3">
          <SButton @click="showPrompt">Basic Prompt</SButton>
          <SButton variant="outlined" @click="showPromptWithValidation">Email Validation</SButton>
          <SButton variant="outlined" @click="showPasswordPrompt">Password Input</SButton>
        </div>
      </DemoSection>
    </section>

    <!-- Alert Dialog -->
    <section id="alert-dialog">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Alert Dialog</h2>
      <DemoSection
        title="Alert Messages"
        description="Show important messages that require acknowledgment. Has only one button."
        :code="alertCode"
        language="typescript"
      >
        <div class="flex flex-wrap gap-3">
          <SButton color="#10b981" @click="showAlert">Success Alert</SButton>
          <SButton color="#3b82f6" @click="showInfoAlert">Info Alert</SButton>
        </div>
      </DemoSection>
    </section>

    <!-- Variants -->
    <section id="dialog-variants">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Dialog Variants</h2>
      <DemoSection
        title="Visual Variants"
        description="Different variants for different use cases. Affects icon and button color."
        :code="variantsCode"
        language="typescript"
      >
        <div class="flex flex-wrap items-end gap-4">
          <SSelect v-model="selectedVariant" label="Variant" class="w-40">
            <SOption value="default">Default</SOption>
            <SOption value="danger">Danger</SOption>
            <SOption value="warning">Warning</SOption>
            <SOption value="success">Success</SOption>
            <SOption value="info">Info</SOption>
          </SSelect>
          <SButton @click="showVariantDemo">Show Dialog</SButton>
        </div>
      </DemoSection>
    </section>

    <!-- Use Cases -->
    <section id="common-use-cases">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Common Use Cases</h2>
      <SCard variant="outlined">
        <SCardHeader>
          <h3 class="font-semibold text-(--s-text-primary)">When to use which dialog</h3>
        </SCardHeader>
        <SCardContent>
          <div class="grid gap-4 md:grid-cols-3">
            <div class="p-4 rounded-lg bg-(--s-bg-secondary)/50 border border-(--s-border)">
              <h4 class="font-medium text-(--s-text-primary) mb-2">Confirm</h4>
              <ul class="text-sm text-(--s-text-secondary) space-y-1">
                <li>• Delete actions</li>
                <li>• Destructive operations</li>
                <li>• Important state changes</li>
                <li>• Logout/Exit</li>
              </ul>
            </div>
            <div class="p-4 rounded-lg bg-(--s-bg-secondary)/50 border border-(--s-border)">
              <h4 class="font-medium text-(--s-text-primary) mb-2">Prompt</h4>
              <ul class="text-sm text-(--s-text-secondary) space-y-1">
                <li>• Rename items</li>
                <li>• Enter values</li>
                <li>• Password confirmation</li>
                <li>• Quick inputs</li>
              </ul>
            </div>
            <div class="p-4 rounded-lg bg-(--s-bg-secondary)/50 border border-(--s-border)">
              <h4 class="font-medium text-(--s-text-primary) mb-2">Alert</h4>
              <ul class="text-sm text-(--s-text-secondary) space-y-1">
                <li>• Success messages</li>
                <li>• Error notifications</li>
                <li>• Important info</li>
                <li>• Acknowledgments</li>
              </ul>
            </div>
          </div>
        </SCardContent>
      </SCard>
    </section>

    <!-- API Reference -->
    <section id="api-reference">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">API Reference</h2>
      
      <SApiSection title="useDialog Methods">
        <SApiTable title="Methods" :methods="dialogMethods" type="methods" />
      </SApiSection>

      <div class="mt-8">
        <SApiSection title="ConfirmOptions">
          <SApiTable title="Properties" :props="confirmProps" type="props" />
        </SApiSection>
      </div>

      <div class="mt-8">
        <SApiSection title="PromptOptions (extends ConfirmOptions)">
          <SApiTable title="Additional Properties" :props="promptProps" type="props" />
        </SApiSection>
      </div>

      <div class="mt-8">
        <SApiSection title="AlertOptions">
          <SApiTable title="Properties" :props="alertProps" type="props" />
        </SApiSection>
      </div>
    </section>
  </div>

  <!-- Toast Container for feedback -->
  <SToastContainer />
</template>
