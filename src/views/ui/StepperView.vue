<script setup lang="ts">
import { ref } from 'vue'
import {
  SStepper,
  SStepperItem,
  SStepperTrigger,
  SStepperIndicator,
  SStepperTitle,
  SStepperDescription,
  SStepperSeparator,
  SStepperContent,
  SButton,
  SInput,
  SApiSection,
  SApiTable,
  SApiKeyboard,
} from '../../index'
import type { ApiProp, ApiEvent, ApiSlot, KeyboardShortcut } from '../../index'
import DemoSection from '../../components/DemoSection.vue'

// ─── Demo State ─────────────────────────────────────────────────────────────────
const basicStep = ref(1)
const lineStep = ref(2)
const verticalStep = ref(1)
const nonLinearStep = ref(1)
const colorStep = ref(1)
const customStep = ref(1)
const disabledStep = ref(1)
const errorStep = ref(2)
const loadingStep = ref(2)
const wizardStep = ref(1)
const formData = ref({ name: '', email: '', plan: '', cardNumber: '' })
const hasPaymentError = ref(true)
const isProcessing = ref(true)
const simulateLoading = () => {
  isProcessing.value = true
  setTimeout(() => { isProcessing.value = false }, 2000)
}

// ─── Code Snippets ──────────────────────────────────────────────────────────────
const basicCode = `<SStepper v-model="basicStep">
  <template #default="{ nextStep, prevStep, canGoNext, canGoPrev, isLastStep }">
    <div class="flex items-center w-full">
      <SStepperItem :step="1">
        <SStepperTrigger>
          <SStepperIndicator />
          <div>
            <SStepperTitle>Account</SStepperTitle>
            <SStepperDescription>Create your account</SStepperDescription>
          </div>
        </SStepperTrigger>
        <SStepperSeparator />
      </SStepperItem>
      <SStepperItem :step="2">
        <SStepperTrigger>
          <SStepperIndicator />
          <div>
            <SStepperTitle>Profile</SStepperTitle>
            <SStepperDescription>Set up your profile</SStepperDescription>
          </div>
        </SStepperTrigger>
        <SStepperSeparator />
      </SStepperItem>
      <SStepperItem :step="3">
        <SStepperTrigger>
          <SStepperIndicator />
          <div>
            <SStepperTitle>Complete</SStepperTitle>
            <SStepperDescription>Review and finish</SStepperDescription>
          </div>
        </SStepperTrigger>
      </SStepperItem>
    </div>

    <SStepperContent :step="1">
      <h3>Create your account</h3>
      <p>Enter your email and password to get started.</p>
    </SStepperContent>
    <SStepperContent :step="2">
      <h3>Set up your profile</h3>
      <p>Add your personal information and preferences.</p>
    </SStepperContent>
    <SStepperContent :step="3">
      <h3>All done!</h3>
      <p>Your account is ready. Welcome aboard!</p>
    </SStepperContent>
  </template>
</SStepper>`

const lineCode = `<SStepper v-model="lineStep" variant="line">
  <template #default="{ nextStep, prevStep, canGoNext, canGoPrev, isLastStep }">
    <div class="flex items-center w-full">
      <SStepperItem :step="1">
        <SStepperTrigger>
          <SStepperIndicator>
            <template #default><span class="mdi mdi-map-marker" /></template>
          </SStepperIndicator>
          <SStepperTitle>Address</SStepperTitle>
          <SStepperDescription>Add your address</SStepperDescription>
        </SStepperTrigger>
        <SStepperSeparator />
      </SStepperItem>
      <SStepperItem :step="2">
        <SStepperTrigger>
          <SStepperIndicator>
            <template #default><span class="mdi mdi-truck" /></template>
          </SStepperIndicator>
          <SStepperTitle>Shipping</SStepperTitle>
          <SStepperDescription>Set your preferred</SStepperDescription>
        </SStepperTrigger>
        <SStepperSeparator />
      </SStepperItem>
      <SStepperItem :step="3">
        <SStepperTrigger>
          <SStepperIndicator>
            <template #default><span class="mdi mdi-credit-card" /></template>
          </SStepperIndicator>
          <SStepperTitle>Payment</SStepperTitle>
          <SStepperDescription>Add any payment</SStepperDescription>
        </SStepperTrigger>
        <SStepperSeparator />
      </SStepperItem>
      <SStepperItem :step="4">
        <SStepperTrigger>
          <SStepperIndicator />
          <SStepperTitle>Checkout</SStepperTitle>
          <SStepperDescription>Confirm your order</SStepperDescription>
        </SStepperTrigger>
      </SStepperItem>
    </div>

    <SStepperContent :step="1">Enter your shipping address</SStepperContent>
    <SStepperContent :step="2">Choose shipping speed</SStepperContent>
    <SStepperContent :step="3">Enter payment details</SStepperContent>
    <SStepperContent :step="4">Review and confirm your order</SStepperContent>
  </template>
</SStepper>`

const verticalCode = `<SStepper v-model="verticalStep" orientation="vertical">
  <template #default="{ nextStep, prevStep, canGoNext, canGoPrev, isLastStep }">
    <SStepperItem :step="1">
      <div class="flex flex-col items-center">
        <SStepperTrigger class="!p-0">
          <SStepperIndicator />
        </SStepperTrigger>
        <SStepperSeparator class="flex-1" />
      </div>
      <div class="flex-1 pb-8">
        <SStepperTrigger class="!px-0">
          <div>
            <SStepperTitle>Account Setup</SStepperTitle>
            <SStepperDescription>Enter your credentials</SStepperDescription>
          </div>
        </SStepperTrigger>
        <SStepperContent :step="1" class="mt-3">
          <!-- content -->
        </SStepperContent>
      </div>
    </SStepperItem>

    <SStepperItem :step="2">
      <div class="flex flex-col items-center">
        <SStepperTrigger class="!p-0">
          <SStepperIndicator />
        </SStepperTrigger>
        <SStepperSeparator class="flex-1" />
      </div>
      <div class="flex-1 pb-8">
        <SStepperTrigger class="!px-0">
          <div>
            <SStepperTitle>Personal Info</SStepperTitle>
            <SStepperDescription>Tell us about yourself</SStepperDescription>
          </div>
        </SStepperTrigger>
        <SStepperContent :step="2" class="mt-3">
          <!-- content -->
        </SStepperContent>
      </div>
    </SStepperItem>

    <SStepperItem :step="3">
      <div class="flex flex-col items-center">
        <SStepperTrigger class="!p-0">
          <SStepperIndicator />
        </SStepperTrigger>
      </div>
      <div class="flex-1">
        <SStepperTrigger class="!px-0">
          <div>
            <SStepperTitle>Confirmation</SStepperTitle>
            <SStepperDescription>Review your details</SStepperDescription>
          </div>
        </SStepperTrigger>
        <SStepperContent :step="3" class="mt-3">
          <!-- content -->
        </SStepperContent>
      </div>
    </SStepperItem>
  </template>
</SStepper>`

const nonLinearCode = `<SStepper v-model="nonLinearStep" :linear="false">
  <template #default>
    <div class="flex items-center w-full">
      <SStepperItem :step="1">
        <SStepperTrigger>
          <SStepperIndicator />
          <SStepperTitle>Details</SStepperTitle>
        </SStepperTrigger>
        <SStepperSeparator />
      </SStepperItem>
      <SStepperItem :step="2">
        <SStepperTrigger>
          <SStepperIndicator />
          <SStepperTitle>Shipping</SStepperTitle>
        </SStepperTrigger>
        <SStepperSeparator />
      </SStepperItem>
      <SStepperItem :step="3">
        <SStepperTrigger>
          <SStepperIndicator />
          <SStepperTitle>Payment</SStepperTitle>
        </SStepperTrigger>
        <SStepperSeparator />
      </SStepperItem>
      <SStepperItem :step="4">
        <SStepperTrigger>
          <SStepperIndicator />
          <SStepperTitle>Review</SStepperTitle>
        </SStepperTrigger>
      </SStepperItem>
    </div>

    <SStepperContent :step="1">Order Details</SStepperContent>
    <SStepperContent :step="2">Shipping Method</SStepperContent>
    <SStepperContent :step="3">Payment Info</SStepperContent>
    <SStepperContent :step="4">Order Review</SStepperContent>
  </template>
</SStepper>`

const colorCode = `<SStepper v-model="colorStep" color="#8b5cf6">
  <template #default="{ nextStep, prevStep, canGoNext, canGoPrev, isLastStep }">
    <div class="flex items-center w-full">
      <SStepperItem :step="1">
        <SStepperTrigger>
          <SStepperIndicator />
          <div>
            <SStepperTitle>Design</SStepperTitle>
            <SStepperDescription>Create mockups</SStepperDescription>
          </div>
        </SStepperTrigger>
        <SStepperSeparator />
      </SStepperItem>
      <SStepperItem :step="2">
        <SStepperTrigger>
          <SStepperIndicator />
          <div>
            <SStepperTitle>Develop</SStepperTitle>
            <SStepperDescription>Write the code</SStepperDescription>
          </div>
        </SStepperTrigger>
        <SStepperSeparator />
      </SStepperItem>
      <SStepperItem :step="3">
        <SStepperTrigger>
          <SStepperIndicator />
          <div>
            <SStepperTitle>Deploy</SStepperTitle>
            <SStepperDescription>Ship it</SStepperDescription>
          </div>
        </SStepperTrigger>
      </SStepperItem>
    </div>

    <SStepperContent :step="1">Design phase: wireframes, prototypes, and user testing.</SStepperContent>
    <SStepperContent :step="2">Development: implementation, code review, and QA.</SStepperContent>
    <SStepperContent :step="3">Deployment: staging, production, and monitoring.</SStepperContent>
  </template>
</SStepper>`

const errorCode = `<SStepper v-model="errorStep">
  <template #default="{ nextStep, prevStep, canGoNext, canGoPrev }">
    <div class="flex items-center w-full">
      <SStepperItem :step="1" :completed="true">
        <SStepperTrigger>
          <SStepperIndicator />
          <div>
            <SStepperTitle>Personal</SStepperTitle>
            <SStepperDescription>Completed</SStepperDescription>
          </div>
        </SStepperTrigger>
        <SStepperSeparator />
      </SStepperItem>
      <SStepperItem :step="2" :error="hasPaymentError">
        <SStepperTrigger>
          <SStepperIndicator />
          <div>
            <SStepperTitle>Payment</SStepperTitle>
            <SStepperDescription>Card declined</SStepperDescription>
          </div>
        </SStepperTrigger>
        <SStepperSeparator />
      </SStepperItem>
      <SStepperItem :step="3">
        <SStepperTrigger>
          <SStepperIndicator />
          <div>
            <SStepperTitle>Confirm</SStepperTitle>
            <SStepperDescription>Review order</SStepperDescription>
          </div>
        </SStepperTrigger>
      </SStepperItem>
    </div>
  </template>
</SStepper>`

const loadingCode = `<SStepper v-model="loadingStep">
  <template #default="{ nextStep, prevStep, canGoNext, canGoPrev }">
    <div class="flex items-center w-full">
      <SStepperItem :step="1" :completed="true">
        <SStepperTrigger>
          <SStepperIndicator />
          <div>
            <SStepperTitle>Upload</SStepperTitle>
            <SStepperDescription>Files uploaded</SStepperDescription>
          </div>
        </SStepperTrigger>
        <SStepperSeparator />
      </SStepperItem>
      <SStepperItem :step="2" :loading="isProcessing">
        <SStepperTrigger>
          <SStepperIndicator />
          <div>
            <SStepperTitle>Processing</SStepperTitle>
            <SStepperDescription>Analyzing data...</SStepperDescription>
          </div>
        </SStepperTrigger>
        <SStepperSeparator />
      </SStepperItem>
      <SStepperItem :step="3">
        <SStepperTrigger>
          <SStepperIndicator />
          <div>
            <SStepperTitle>Complete</SStepperTitle>
            <SStepperDescription>Waiting</SStepperDescription>
          </div>
        </SStepperTrigger>
      </SStepperItem>
    </div>
  </template>
</SStepper>`

const sizesCode = `<SStepper :model-value="2" size="small">
  <template #default>
    <div class="flex items-center w-full">
      <SStepperItem :step="1" :completed="true">
        <SStepperTrigger>
          <SStepperIndicator />
          <div>
            <SStepperTitle>Account</SStepperTitle>
            <SStepperDescription>Set up credentials</SStepperDescription>
          </div>
        </SStepperTrigger>
        <SStepperSeparator />
      </SStepperItem>
      <SStepperItem :step="2">
        <SStepperTrigger>
          <SStepperIndicator />
          <div>
            <SStepperTitle>Profile</SStepperTitle>
            <SStepperDescription>Personal info</SStepperDescription>
          </div>
        </SStepperTrigger>
        <SStepperSeparator />
      </SStepperItem>
      <SStepperItem :step="3">
        <SStepperTrigger>
          <SStepperIndicator />
          <div>
            <SStepperTitle>Done</SStepperTitle>
            <SStepperDescription>All finished</SStepperDescription>
          </div>
        </SStepperTrigger>
      </SStepperItem>
    </div>
  </template>
</SStepper>

<!-- Also available: size="medium", size="large" -->`

const customIndicatorCode = `<SStepper v-model="customStep">
  <template #default="{ nextStep, prevStep, canGoNext, canGoPrev, isLastStep }">
    <div class="flex items-center w-full">
      <SStepperItem :step="1">
        <SStepperTrigger>
          <SStepperIndicator>
            <template #default><span class="mdi mdi-account" /></template>
          </SStepperIndicator>
          <SStepperTitle>Account</SStepperTitle>
        </SStepperTrigger>
        <SStepperSeparator />
      </SStepperItem>
      <SStepperItem :step="2">
        <SStepperTrigger>
          <SStepperIndicator>
            <template #default><span class="mdi mdi-cog" /></template>
          </SStepperIndicator>
          <SStepperTitle>Settings</SStepperTitle>
        </SStepperTrigger>
        <SStepperSeparator />
      </SStepperItem>
      <SStepperItem :step="3">
        <SStepperTrigger>
          <SStepperIndicator>
            <template #default><span class="mdi mdi-rocket-launch" /></template>
          </SStepperIndicator>
          <SStepperTitle>Launch</SStepperTitle>
        </SStepperTrigger>
      </SStepperItem>
    </div>

    <SStepperContent :step="1">Set up your account credentials.</SStepperContent>
    <SStepperContent :step="2">Configure preferences and integrations.</SStepperContent>
    <SStepperContent :step="3">Ready for launch!</SStepperContent>
  </template>
</SStepper>`

const disabledCode = `<SStepper v-model="disabledStep" :linear="false">
  <template #default>
    <div class="flex items-center w-full">
      <SStepperItem :step="1">
        <SStepperTrigger>
          <SStepperIndicator />
          <SStepperTitle>Available</SStepperTitle>
        </SStepperTrigger>
        <SStepperSeparator />
      </SStepperItem>
      <SStepperItem :step="2" :disabled="true">
        <SStepperTrigger>
          <SStepperIndicator />
          <SStepperTitle>Locked</SStepperTitle>
        </SStepperTrigger>
        <SStepperSeparator />
      </SStepperItem>
      <SStepperItem :step="3">
        <SStepperTrigger>
          <SStepperIndicator />
          <SStepperTitle>Available</SStepperTitle>
        </SStepperTrigger>
        <SStepperSeparator />
      </SStepperItem>
      <SStepperItem :step="4" :disabled="true">
        <SStepperTrigger>
          <SStepperIndicator />
          <SStepperTitle>Locked</SStepperTitle>
        </SStepperTrigger>
      </SStepperItem>
    </div>
  </template>
</SStepper>`

const wizardCode = `<SStepper v-model="wizardStep">
  <template #default="{ nextStep, prevStep, canGoNext, canGoPrev, isLastStep }">
    <div class="flex items-center w-full mb-8">
      <SStepperItem :step="1">
        <SStepperTrigger>
          <SStepperIndicator />
          <div>
            <SStepperTitle>Personal</SStepperTitle>
            <SStepperDescription>Your information</SStepperDescription>
          </div>
        </SStepperTrigger>
        <SStepperSeparator />
      </SStepperItem>
      <SStepperItem :step="2">
        <SStepperTrigger>
          <SStepperIndicator />
          <div>
            <SStepperTitle>Plan</SStepperTitle>
            <SStepperDescription>Choose a plan</SStepperDescription>
          </div>
        </SStepperTrigger>
        <SStepperSeparator />
      </SStepperItem>
      <SStepperItem :step="3">
        <SStepperTrigger>
          <SStepperIndicator />
          <div>
            <SStepperTitle>Payment</SStepperTitle>
            <SStepperDescription>Billing details</SStepperDescription>
          </div>
        </SStepperTrigger>
      </SStepperItem>
    </div>

    <SStepperContent :step="1">
      <SInput v-model="formData.name" label="Full Name" placeholder="John Doe" />
      <SInput v-model="formData.email" label="Email" placeholder="john@example.com" type="email" />
    </SStepperContent>

    <SStepperContent :step="2">
      <!-- Plan selection buttons -->
    </SStepperContent>

    <SStepperContent :step="3">
      <SInput v-model="formData.cardNumber" label="Card Number" placeholder="4242 4242 4242 4242" />
      <!-- Order summary -->
    </SStepperContent>
  </template>
</SStepper>`

// ─── API Documentation ──────────────────────────────────────────────────────────
const stepperProps: ApiProp[] = [
  { name: 'modelValue', type: 'number', default: 'undefined', description: 'Active step number. Supports v-model binding.', category: 'Core' },
  { name: 'defaultValue', type: 'number', default: '1', description: 'Initial active step in uncontrolled mode (without v-model).', category: 'Core' },
  { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Layout direction. Horizontal renders steps in a row, vertical stacks them with content inline.', category: 'Layout' },
  { name: 'variant', type: "'default' | 'line'", default: "'default'", description: "Visual variant. 'line' centers indicators on a track with labels below (like a progress bar).", category: 'Appearance' },
  { name: 'linear', type: 'boolean', default: 'true', description: 'Enforce sequential step completion. When false, any step can be clicked freely.', category: 'Behavior' },
  { name: 'clickable', type: 'boolean', default: 'true', description: 'Allow clicking step triggers to navigate. When false, navigation is only possible via slot methods.', category: 'Behavior' },
  { name: 'size', type: "'small' | 'medium' | 'large'", default: "'medium'", description: 'Controls the size of indicators, text, and spacing across all child components.', category: 'Appearance' },
  { name: 'color', type: 'string', default: 'undefined', description: 'Custom color for active/completed indicators and separators. Accepts any CSS color value.', category: 'Theming' },
  { name: 'animated', type: 'boolean', default: 'true', description: 'Enable/disable transition animations on content panels and indicator state changes.', category: 'Behavior' },
]

const stepperEvents: ApiEvent[] = [
  { name: 'update:modelValue', payload: 'number', description: 'Emitted when the active step changes. Used by v-model.' },
  { name: 'change', payload: '(value: number, oldValue: number)', description: 'Emitted with both the new and previous step values.' },
]

const stepperSlots: ApiSlot[] = [
  { name: 'default', props: '{ modelValue, totalSteps, isFirstStep, isLastStep, canGoNext, canGoPrev, nextStep, prevStep, goToStep, isCompleted, isActive }', description: 'Root slot with navigation state and helpers. canGoNext/canGoPrev reflect error, loading, and disabled blocking.' },
]

const stepperItemProps: ApiProp[] = [
  { name: 'step', type: 'number', default: '—', description: 'Step number identifier. Must be unique across all items. Required.', category: 'Core' },
  { name: 'completed', type: 'boolean', default: 'undefined', description: 'Manually override step as completed, bypassing automatic tracking.', category: 'Core' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevent navigation to this step. Trigger becomes non-interactive.', category: 'Behavior' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Show a loading spinner in the indicator. Overrides number/check display.', category: 'Behavior' },
  { name: 'error', type: 'boolean', default: 'false', description: 'Show error state with red indicator and alert icon.', category: 'Behavior' },
  { name: 'optional', type: 'boolean', default: 'false', description: 'Mark step as optional. Does not affect navigation logic.', category: 'Behavior' },
]

const stepperItemSlots: ApiSlot[] = [
  { name: 'default', props: "{ state: 'active' | 'completed' | 'inactive' | 'error' | 'loading' }", description: 'Step item content with current computed state.' },
]

const stepperTriggerProps: ApiProp[] = [
  { name: 'class', type: 'string', default: 'undefined', description: 'Additional CSS classes for the trigger button.', category: 'Appearance' },
]

const stepperTriggerSlots: ApiSlot[] = [
  { name: 'default', props: "{ state: 'active' | 'completed' | 'inactive' | 'error' | 'loading' }", description: 'Trigger content with current step state.' },
]

const stepperIndicatorProps: ApiProp[] = [
  { name: 'class', type: 'string', default: 'undefined', description: 'Additional CSS classes for the indicator circle.', category: 'Appearance' },
]

const stepperIndicatorSlots: ApiSlot[] = [
  { name: 'default', props: '{ step: number }', description: 'Custom content for active/inactive state. Replaces the step number.' },
  { name: 'completed', props: '{ step: number }', description: 'Custom icon for the completed state. Defaults to a checkmark.' },
  { name: 'error', props: '{ step: number }', description: 'Custom icon for the error state. Defaults to an alert circle.' },
  { name: 'loading', props: '{ step: number }', description: 'Custom content for the loading state. Defaults to a spinning loader.' },
]

const stepperContentProps: ApiProp[] = [
  { name: 'step', type: 'number', default: '—', description: 'Step number this content belongs to. Must match a SStepperItem step. Required.', category: 'Core' },
  { name: 'forceMount', type: 'boolean', default: 'false', description: 'Keep content in DOM when inactive. Useful for preserving form state across steps.', category: 'Behavior' },
]

const stepperSeparatorProps: ApiProp[] = [
  { name: 'class', type: 'string', default: 'undefined', description: 'Additional CSS classes for the separator line.', category: 'Appearance' },
]

const stepperTitleProps: ApiProp[] = [
  { name: 'class', type: 'string', default: 'undefined', description: 'Additional CSS classes for the title text.', category: 'Appearance' },
]

const stepperDescriptionProps: ApiProp[] = [
  { name: 'class', type: 'string', default: 'undefined', description: 'Additional CSS classes for the description text.', category: 'Appearance' },
]

const keyboardShortcuts: KeyboardShortcut[] = [
  { keys: ['Tab'], action: 'Move focus into and out of the stepper triggers' },
  { keys: ['Enter', 'Space'], action: 'Activate the focused step (if navigation is allowed)' },
]
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- @component SStepper -->
    <!-- @props modelValue, defaultValue, orientation, variant, linear, clickable, size, color, animated -->
    <!-- @events update:modelValue, change -->
    <!-- @slots default -->
    <!-- @sections basic-usage, line-variant, vertical-orientation, sizes, non-linear-navigation, custom-color, custom-indicators, states, form-wizard, api-reference -->
    <!-- Page Header -->
    <div>
      <h1 class="text-4xl font-extrabold text-foreground mb-2">Stepper</h1>
      <p class="text-lg text-muted-foreground">
        A multi-step progress indicator for forms, wizards, checkout flows, and sequential workflows.
        Supports horizontal and vertical layouts, a line variant, linear and non-linear navigation,
        custom indicators, error/loading states, and smooth directional content transitions.
      </p>
    </div>

    <!-- ────────────────────────────────────────────────────────────────────── -->
    <h2 class="text-2xl font-bold text-foreground">Basic Usage</h2>

    <DemoSection
      title="Default Horizontal"
      description="Steps arranged horizontally with linear navigation. The nextStep() helper auto-marks the current step as completed."
      :code="basicCode"
    >
      <SStepper v-model="basicStep">
        <template #default="{ nextStep, prevStep, canGoNext, canGoPrev, isLastStep }">
          <div class="flex items-center w-full">
            <SStepperItem :step="1">
              <SStepperTrigger>
                <SStepperIndicator />
                <div>
                  <SStepperTitle>Account</SStepperTitle>
                  <SStepperDescription>Create your account</SStepperDescription>
                </div>
              </SStepperTrigger>
              <SStepperSeparator />
            </SStepperItem>
            <SStepperItem :step="2">
              <SStepperTrigger>
                <SStepperIndicator />
                <div>
                  <SStepperTitle>Profile</SStepperTitle>
                  <SStepperDescription>Set up your profile</SStepperDescription>
                </div>
              </SStepperTrigger>
              <SStepperSeparator />
            </SStepperItem>
            <SStepperItem :step="3">
              <SStepperTrigger>
                <SStepperIndicator />
                <div>
                  <SStepperTitle>Complete</SStepperTitle>
                  <SStepperDescription>Review and finish</SStepperDescription>
                </div>
              </SStepperTrigger>
            </SStepperItem>
          </div>

          <div class="relative mt-8 overflow-hidden">
            <SStepperContent :step="1">
              <div class="rounded-xl border border-border p-6">
                <h3 class="text-lg font-semibold mb-2 text-foreground">Create your account</h3>
                <p class="text-sm text-muted-foreground">Enter your email and password to get started.</p>
              </div>
            </SStepperContent>
            <SStepperContent :step="2">
              <div class="rounded-xl border border-border p-6">
                <h3 class="text-lg font-semibold mb-2 text-foreground">Set up your profile</h3>
                <p class="text-sm text-muted-foreground">Add your personal information and preferences.</p>
              </div>
            </SStepperContent>
            <SStepperContent :step="3">
              <div class="rounded-xl border border-border p-6">
                <h3 class="text-lg font-semibold mb-2 text-foreground">All done!</h3>
                <p class="text-sm text-muted-foreground">Your account is ready. Welcome aboard!</p>
              </div>
            </SStepperContent>
          </div>

          <div class="flex justify-between mt-6">
            <SButton @click="prevStep" :disabled="!canGoPrev" variant="outlined" size="small">
              <span class="mdi mdi-arrow-left mr-1.5" /> Back
            </SButton>
            <SButton @click="nextStep" :disabled="!canGoNext" size="small">
              {{ isLastStep ? 'Done' : 'Next' }} <span v-if="!isLastStep" class="mdi mdi-arrow-right ml-1.5" />
            </SButton>
          </div>
        </template>
      </SStepper>
    </DemoSection>

    <!-- ────────────────────────────────────────────────────────────────────── -->
    <h2 class="text-2xl font-bold text-foreground">Line Variant</h2>

    <DemoSection
      title="Indicator Track"
      description="The line variant centers indicators on a horizontal track with titles and descriptions below. Ideal for checkout flows and order processes."
      :code="lineCode"
    >
      <SStepper v-model="lineStep" variant="line">
        <template #default="{ nextStep, prevStep, canGoNext, canGoPrev, isLastStep: _isLastStep }">
          <div class="flex items-center w-full">
            <SStepperItem :step="1">
              <SStepperTrigger>
                <SStepperIndicator>
                  <template #default><span class="mdi mdi-map-marker" /></template>
                </SStepperIndicator>
                <SStepperTitle>Address</SStepperTitle>
                <SStepperDescription>Add your address</SStepperDescription>
              </SStepperTrigger>
              <SStepperSeparator />
            </SStepperItem>
            <SStepperItem :step="2">
              <SStepperTrigger>
                <SStepperIndicator>
                  <template #default><span class="mdi mdi-truck" /></template>
                </SStepperIndicator>
                <SStepperTitle>Shipping</SStepperTitle>
                <SStepperDescription>Set your preferred</SStepperDescription>
              </SStepperTrigger>
              <SStepperSeparator />
            </SStepperItem>
            <SStepperItem :step="3">
              <SStepperTrigger>
                <SStepperIndicator>
                  <template #default><span class="mdi mdi-credit-card" /></template>
                </SStepperIndicator>
                <SStepperTitle>Payment</SStepperTitle>
                <SStepperDescription>Add any payment</SStepperDescription>
              </SStepperTrigger>
              <SStepperSeparator />
            </SStepperItem>
            <SStepperItem :step="4">
              <SStepperTrigger>
                <SStepperIndicator />
                <SStepperTitle>Checkout</SStepperTitle>
                <SStepperDescription>Confirm your order</SStepperDescription>
              </SStepperTrigger>
            </SStepperItem>
          </div>

          <div class="relative mt-8 overflow-hidden">
            <SStepperContent :step="1">
              <div class="rounded-xl border border-border p-6 text-center">
                <p class="text-sm text-muted-foreground">Enter your shipping address</p>
              </div>
            </SStepperContent>
            <SStepperContent :step="2">
              <div class="rounded-xl border border-border p-6 text-center">
                <p class="text-sm text-muted-foreground">Choose shipping speed</p>
              </div>
            </SStepperContent>
            <SStepperContent :step="3">
              <div class="rounded-xl border border-border p-6 text-center">
                <p class="text-sm text-muted-foreground">Enter payment details</p>
              </div>
            </SStepperContent>
            <SStepperContent :step="4">
              <div class="rounded-xl border border-border p-6 text-center">
                <p class="text-sm text-muted-foreground">Review and confirm your order</p>
              </div>
            </SStepperContent>
          </div>

          <div class="flex justify-between mt-6">
            <SButton @click="prevStep" :disabled="!canGoPrev" variant="outlined" size="small">Back</SButton>
            <SButton @click="nextStep" :disabled="!canGoNext" size="small">Next</SButton>
          </div>
        </template>
      </SStepper>
    </DemoSection>

    <!-- ────────────────────────────────────────────────────────────────────── -->
    <h2 class="text-2xl font-bold text-foreground">Vertical Orientation</h2>

    <DemoSection
      title="Vertical Layout"
      description="Steps stacked vertically with the indicator column on the left and content on the right. A separator line connects indicators."
      :code="verticalCode"
    >
      <SStepper v-model="verticalStep" orientation="vertical" class="max-w-lg">
        <template #default="{ nextStep, prevStep, canGoNext: _canGoNext, canGoPrev: _canGoPrev, isLastStep: _isLastStep }">
          <SStepperItem :step="1">
            <div class="flex flex-col items-center">
              <SStepperTrigger class="!p-0">
                <SStepperIndicator />
              </SStepperTrigger>
              <SStepperSeparator class="flex-1" />
            </div>
            <div class="flex-1 pb-8">
              <SStepperTrigger class="!px-0">
                <div>
                  <SStepperTitle>Account Setup</SStepperTitle>
                  <SStepperDescription>Enter your credentials</SStepperDescription>
                </div>
              </SStepperTrigger>
              <SStepperContent :step="1" class="mt-3">
                <div class="rounded-xl border border-border p-4">
                  <p class="text-sm text-muted-foreground mb-4">Choose a username and password for your account.</p>
                  <SButton @click="nextStep" size="small">Continue</SButton>
                </div>
              </SStepperContent>
            </div>
          </SStepperItem>

          <SStepperItem :step="2">
            <div class="flex flex-col items-center">
              <SStepperTrigger class="!p-0">
                <SStepperIndicator />
              </SStepperTrigger>
              <SStepperSeparator class="flex-1" />
            </div>
            <div class="flex-1 pb-8">
              <SStepperTrigger class="!px-0">
                <div>
                  <SStepperTitle>Personal Info</SStepperTitle>
                  <SStepperDescription>Tell us about yourself</SStepperDescription>
                </div>
              </SStepperTrigger>
              <SStepperContent :step="2" class="mt-3">
                <div class="rounded-xl border border-border p-4">
                  <p class="text-sm text-muted-foreground mb-4">Add your name, bio, and profile picture.</p>
                  <div class="flex gap-2">
                    <SButton @click="prevStep" variant="outlined" size="small">Back</SButton>
                    <SButton @click="nextStep" size="small">Continue</SButton>
                  </div>
                </div>
              </SStepperContent>
            </div>
          </SStepperItem>

          <SStepperItem :step="3">
            <div class="flex flex-col items-center">
              <SStepperTrigger class="!p-0">
                <SStepperIndicator />
              </SStepperTrigger>
            </div>
            <div class="flex-1">
              <SStepperTrigger class="!px-0">
                <div>
                  <SStepperTitle>Confirmation</SStepperTitle>
                  <SStepperDescription>Review your details</SStepperDescription>
                </div>
              </SStepperTrigger>
              <SStepperContent :step="3" class="mt-3">
                <div class="rounded-xl border border-border p-4">
                  <p class="text-sm text-muted-foreground mb-4">Everything looks good!</p>
                  <div class="flex gap-2">
                    <SButton @click="prevStep" variant="outlined" size="small">Back</SButton>
                    <SButton size="small" color="#22c55e">
                      <span class="mdi mdi-check mr-1.5" /> Submit
                    </SButton>
                  </div>
                </div>
              </SStepperContent>
            </div>
          </SStepperItem>
        </template>
      </SStepper>
    </DemoSection>

    <!-- ────────────────────────────────────────────────────────────────────── -->
    <h2 class="text-2xl font-bold text-foreground">Sizes</h2>

    <DemoSection
      title="Size Variants"
      description="Three size variants control indicator dimensions, text size, and spacing across all subcomponents."
      :code="sizesCode"
    >
      <div class="space-y-10">
        <div v-for="size in (['small', 'medium', 'large'] as const)" :key="size">
          <p class="text-xs font-mono text-muted-foreground mb-4">size="{{ size }}"</p>
          <SStepper :model-value="2" :size="size">
            <template #default>
              <div class="flex items-center w-full">
                <SStepperItem :step="1" :completed="true">
                  <SStepperTrigger>
                    <SStepperIndicator />
                    <div>
                      <SStepperTitle>Account</SStepperTitle>
                      <SStepperDescription>Set up credentials</SStepperDescription>
                    </div>
                  </SStepperTrigger>
                  <SStepperSeparator />
                </SStepperItem>
                <SStepperItem :step="2">
                  <SStepperTrigger>
                    <SStepperIndicator />
                    <div>
                      <SStepperTitle>Profile</SStepperTitle>
                      <SStepperDescription>Personal info</SStepperDescription>
                    </div>
                  </SStepperTrigger>
                  <SStepperSeparator />
                </SStepperItem>
                <SStepperItem :step="3">
                  <SStepperTrigger>
                    <SStepperIndicator />
                    <div>
                      <SStepperTitle>Done</SStepperTitle>
                      <SStepperDescription>All finished</SStepperDescription>
                    </div>
                  </SStepperTrigger>
                </SStepperItem>
              </div>
            </template>
          </SStepper>
        </div>
      </div>
    </DemoSection>

    <!-- ────────────────────────────────────────────────────────────────────── -->
    <h2 class="text-2xl font-bold text-foreground">Non-linear Navigation</h2>

    <DemoSection
      title="Free Navigation"
      description="When linear is false, all steps are clickable regardless of completion order. Great for settings or review flows."
      :code="nonLinearCode"
    >
      <SStepper v-model="nonLinearStep" :linear="false">
        <template #default>
          <div class="flex items-center w-full">
            <SStepperItem :step="1">
              <SStepperTrigger>
                <SStepperIndicator />
                <SStepperTitle>Details</SStepperTitle>
              </SStepperTrigger>
              <SStepperSeparator />
            </SStepperItem>
            <SStepperItem :step="2">
              <SStepperTrigger>
                <SStepperIndicator />
                <SStepperTitle>Shipping</SStepperTitle>
              </SStepperTrigger>
              <SStepperSeparator />
            </SStepperItem>
            <SStepperItem :step="3">
              <SStepperTrigger>
                <SStepperIndicator />
                <SStepperTitle>Payment</SStepperTitle>
              </SStepperTrigger>
              <SStepperSeparator />
            </SStepperItem>
            <SStepperItem :step="4">
              <SStepperTrigger>
                <SStepperIndicator />
                <SStepperTitle>Review</SStepperTitle>
              </SStepperTrigger>
            </SStepperItem>
          </div>

          <div class="relative mt-8 overflow-hidden">
            <SStepperContent :step="1">
              <div class="rounded-xl bg-muted/50 border border-border p-8 text-center">
                <span class="mdi mdi-account-outline text-4xl text-muted-foreground mb-3 block" />
                <p class="font-medium text-foreground mb-1">Order Details</p>
                <p class="text-sm text-muted-foreground">Review and edit your items</p>
              </div>
            </SStepperContent>
            <SStepperContent :step="2">
              <div class="rounded-xl bg-muted/50 border border-border p-8 text-center">
                <span class="mdi mdi-truck-outline text-4xl text-muted-foreground mb-3 block" />
                <p class="font-medium text-foreground mb-1">Shipping Method</p>
                <p class="text-sm text-muted-foreground">Choose delivery option</p>
              </div>
            </SStepperContent>
            <SStepperContent :step="3">
              <div class="rounded-xl bg-muted/50 border border-border p-8 text-center">
                <span class="mdi mdi-credit-card-outline text-4xl text-muted-foreground mb-3 block" />
                <p class="font-medium text-foreground mb-1">Payment Info</p>
                <p class="text-sm text-muted-foreground">Enter billing details</p>
              </div>
            </SStepperContent>
            <SStepperContent :step="4">
              <div class="rounded-xl bg-muted/50 border border-border p-8 text-center">
                <span class="mdi mdi-check-circle-outline text-4xl text-muted-foreground mb-3 block" />
                <p class="font-medium text-foreground mb-1">Order Review</p>
                <p class="text-sm text-muted-foreground">Confirm and place order</p>
              </div>
            </SStepperContent>
          </div>
        </template>
      </SStepper>
    </DemoSection>

    <!-- ────────────────────────────────────────────────────────────────────── -->
    <h2 class="text-2xl font-bold text-foreground">Custom Color</h2>

    <DemoSection
      title="Themed Stepper"
      description="The color prop applies a custom accent to active/completed indicators and completed separator lines."
      :code="colorCode"
    >
      <SStepper v-model="colorStep" color="#8b5cf6">
        <template #default="{ nextStep, prevStep, canGoNext: _canGoNext, canGoPrev, isLastStep }">
          <div class="flex items-center w-full">
            <SStepperItem :step="1">
              <SStepperTrigger>
                <SStepperIndicator />
                <div>
                  <SStepperTitle>Design</SStepperTitle>
                  <SStepperDescription>Create mockups</SStepperDescription>
                </div>
              </SStepperTrigger>
              <SStepperSeparator />
            </SStepperItem>
            <SStepperItem :step="2">
              <SStepperTrigger>
                <SStepperIndicator />
                <div>
                  <SStepperTitle>Develop</SStepperTitle>
                  <SStepperDescription>Write the code</SStepperDescription>
                </div>
              </SStepperTrigger>
              <SStepperSeparator />
            </SStepperItem>
            <SStepperItem :step="3">
              <SStepperTrigger>
                <SStepperIndicator />
                <div>
                  <SStepperTitle>Deploy</SStepperTitle>
                  <SStepperDescription>Ship it</SStepperDescription>
                </div>
              </SStepperTrigger>
            </SStepperItem>
          </div>

          <div class="relative mt-8 overflow-hidden">
            <SStepperContent :step="1">
              <div class="rounded-xl border border-border p-6">
                <p class="text-sm text-muted-foreground">Design phase: wireframes, prototypes, and user testing.</p>
              </div>
            </SStepperContent>
            <SStepperContent :step="2">
              <div class="rounded-xl border border-border p-6">
                <p class="text-sm text-muted-foreground">Development: implementation, code review, and QA.</p>
              </div>
            </SStepperContent>
            <SStepperContent :step="3">
              <div class="rounded-xl border border-border p-6">
                <p class="text-sm text-muted-foreground">Deployment: staging, production, and monitoring.</p>
              </div>
            </SStepperContent>
          </div>

          <div class="flex justify-between mt-6">
            <SButton @click="prevStep" :disabled="!canGoPrev" variant="outlined" size="small">Back</SButton>
            <SButton @click="nextStep" :disabled="isLastStep" size="small" color="#8b5cf6">Next</SButton>
          </div>
        </template>
      </SStepper>
    </DemoSection>

    <!-- ────────────────────────────────────────────────────────────────────── -->
    <h2 class="text-2xl font-bold text-foreground">Custom Indicators</h2>

    <DemoSection
      title="Icon Indicators"
      description="Replace step numbers with custom icons using the indicator slot. The checkmark animation still applies on completion."
      :code="customIndicatorCode"
    >
      <SStepper v-model="customStep">
        <template #default="{ nextStep, prevStep, canGoNext, canGoPrev, isLastStep: _isLastStep }">
          <div class="flex items-center w-full">
            <SStepperItem :step="1">
              <SStepperTrigger>
                <SStepperIndicator>
                  <template #default><span class="mdi mdi-account" /></template>
                </SStepperIndicator>
                <SStepperTitle>Account</SStepperTitle>
              </SStepperTrigger>
              <SStepperSeparator />
            </SStepperItem>
            <SStepperItem :step="2">
              <SStepperTrigger>
                <SStepperIndicator>
                  <template #default><span class="mdi mdi-cog" /></template>
                </SStepperIndicator>
                <SStepperTitle>Settings</SStepperTitle>
              </SStepperTrigger>
              <SStepperSeparator />
            </SStepperItem>
            <SStepperItem :step="3">
              <SStepperTrigger>
                <SStepperIndicator>
                  <template #default><span class="mdi mdi-rocket-launch" /></template>
                </SStepperIndicator>
                <SStepperTitle>Launch</SStepperTitle>
              </SStepperTrigger>
            </SStepperItem>
          </div>

          <div class="relative mt-8 overflow-hidden">
            <SStepperContent :step="1">
              <div class="rounded-xl border border-border p-6">
                <p class="text-sm text-muted-foreground">Set up your account credentials and verify your email.</p>
              </div>
            </SStepperContent>
            <SStepperContent :step="2">
              <div class="rounded-xl border border-border p-6">
                <p class="text-sm text-muted-foreground">Configure preferences, notifications, and integrations.</p>
              </div>
            </SStepperContent>
            <SStepperContent :step="3">
              <div class="rounded-xl border border-border p-6">
                <p class="text-sm text-muted-foreground">Ready for launch! Review everything and go live.</p>
              </div>
            </SStepperContent>
          </div>

          <div class="flex justify-between mt-6">
            <SButton @click="prevStep" :disabled="!canGoPrev" variant="outlined" size="small">Back</SButton>
            <SButton @click="nextStep" :disabled="!canGoNext" size="small">Next</SButton>
          </div>
        </template>
      </SStepper>
    </DemoSection>

    <!-- ────────────────────────────────────────────────────────────────────── -->
    <h2 class="text-2xl font-bold text-foreground">States</h2>

    <DemoSection
      title="Error State"
      description="A step with an error blocks forward navigation. The Next button and forward step clicks are disabled until the error is resolved. Use the toggle to see the behavior."
      :code="errorCode"
    >
      <SStepper v-model="errorStep">
        <template #default="{ nextStep, prevStep, canGoNext, canGoPrev }">
          <div class="flex items-center w-full">
            <SStepperItem :step="1" :completed="true">
              <SStepperTrigger>
                <SStepperIndicator />
                <div>
                  <SStepperTitle>Personal</SStepperTitle>
                  <SStepperDescription>Completed</SStepperDescription>
                </div>
              </SStepperTrigger>
              <SStepperSeparator />
            </SStepperItem>
            <SStepperItem :step="2" :error="hasPaymentError">
              <SStepperTrigger>
                <SStepperIndicator />
                <div>
                  <SStepperTitle>Payment</SStepperTitle>
                  <SStepperDescription>{{ hasPaymentError ? 'Card declined' : 'Enter details' }}</SStepperDescription>
                </div>
              </SStepperTrigger>
              <SStepperSeparator />
            </SStepperItem>
            <SStepperItem :step="3">
              <SStepperTrigger>
                <SStepperIndicator />
                <div>
                  <SStepperTitle>Confirm</SStepperTitle>
                  <SStepperDescription>Review order</SStepperDescription>
                </div>
              </SStepperTrigger>
            </SStepperItem>
          </div>

          <div class="relative mt-6 overflow-hidden">
            <SStepperContent :step="2">
              <div class="rounded-xl border p-4" :class="hasPaymentError ? 'border-error/50 bg-error/5' : 'border-border'">
                <p class="text-sm text-muted-foreground mb-3">
                  {{ hasPaymentError ? 'Payment failed. Fix the error to continue.' : 'Payment details accepted.' }}
                </p>
                <SButton size="small" :variant="hasPaymentError ? 'filled' : 'outlined'" @click="hasPaymentError = !hasPaymentError">
                  <span class="mdi mr-1.5" :class="hasPaymentError ? 'mdi-check' : 'mdi-alert-circle'" />
                  {{ hasPaymentError ? 'Fix Error' : 'Simulate Error' }}
                </SButton>
              </div>
            </SStepperContent>
          </div>

          <div class="flex justify-between mt-4">
            <SButton @click="prevStep" :disabled="!canGoPrev" variant="outlined" size="small">Back</SButton>
            <SButton @click="nextStep" :disabled="!canGoNext" size="small">Next</SButton>
          </div>
        </template>
      </SStepper>
    </DemoSection>

    <DemoSection
      title="Loading State"
      description="A loading step blocks forward navigation until the async operation completes. The spinner indicates work in progress."
      :code="loadingCode"
    >
      <SStepper v-model="loadingStep">
        <template #default="{ nextStep, prevStep, canGoNext, canGoPrev }">
          <div class="flex items-center w-full">
            <SStepperItem :step="1" :completed="true">
              <SStepperTrigger>
                <SStepperIndicator />
                <div>
                  <SStepperTitle>Upload</SStepperTitle>
                  <SStepperDescription>Files uploaded</SStepperDescription>
                </div>
              </SStepperTrigger>
              <SStepperSeparator />
            </SStepperItem>
            <SStepperItem :step="2" :loading="isProcessing">
              <SStepperTrigger>
                <SStepperIndicator />
                <div>
                  <SStepperTitle>Processing</SStepperTitle>
                  <SStepperDescription>{{ isProcessing ? 'Analyzing data...' : 'Ready' }}</SStepperDescription>
                </div>
              </SStepperTrigger>
              <SStepperSeparator />
            </SStepperItem>
            <SStepperItem :step="3">
              <SStepperTrigger>
                <SStepperIndicator />
                <div>
                  <SStepperTitle>Complete</SStepperTitle>
                  <SStepperDescription>Waiting</SStepperDescription>
                </div>
              </SStepperTrigger>
            </SStepperItem>
          </div>

          <div class="relative mt-6 overflow-hidden">
            <SStepperContent :step="2">
              <div class="rounded-xl border border-border p-4">
                <p class="text-sm text-muted-foreground mb-3">
                  {{ isProcessing ? 'Processing in progress. Navigation is blocked.' : 'Processing complete. You may continue.' }}
                </p>
                <SButton size="small" @click="simulateLoading" :disabled="isProcessing">
                  <span class="mdi mdi-refresh mr-1.5" /> {{ isProcessing ? 'Processing...' : 'Start Processing' }}
                </SButton>
              </div>
            </SStepperContent>
          </div>

          <div class="flex justify-between mt-4">
            <SButton @click="prevStep" :disabled="!canGoPrev" variant="outlined" size="small">Back</SButton>
            <SButton @click="nextStep" :disabled="!canGoNext" size="small">Next</SButton>
          </div>
        </template>
      </SStepper>
    </DemoSection>

    <DemoSection
      title="Disabled Steps"
      description="Individual steps can be disabled to prevent navigation. They appear dimmed and are non-interactive."
      :code="disabledCode"
    >
      <SStepper v-model="disabledStep" :linear="false">
        <template #default>
          <div class="flex items-center w-full">
            <SStepperItem :step="1">
              <SStepperTrigger>
                <SStepperIndicator />
                <SStepperTitle>Available</SStepperTitle>
              </SStepperTrigger>
              <SStepperSeparator />
            </SStepperItem>
            <SStepperItem :step="2" :disabled="true">
              <SStepperTrigger>
                <SStepperIndicator />
                <SStepperTitle>Locked</SStepperTitle>
              </SStepperTrigger>
              <SStepperSeparator />
            </SStepperItem>
            <SStepperItem :step="3">
              <SStepperTrigger>
                <SStepperIndicator />
                <SStepperTitle>Available</SStepperTitle>
              </SStepperTrigger>
              <SStepperSeparator />
            </SStepperItem>
            <SStepperItem :step="4" :disabled="true">
              <SStepperTrigger>
                <SStepperIndicator />
                <SStepperTitle>Locked</SStepperTitle>
              </SStepperTrigger>
            </SStepperItem>
          </div>
        </template>
      </SStepper>
    </DemoSection>

    <!-- ────────────────────────────────────────────────────────────────────── -->
    <h2 class="text-2xl font-bold text-foreground">Form Wizard</h2>

    <DemoSection
      title="Multi-Step Form"
      description="A practical multi-step form with inputs, plan selection, and a summary review step."
      :code="wizardCode"
    >
      <SStepper v-model="wizardStep">
        <template #default="{ nextStep, prevStep, canGoNext, canGoPrev, isLastStep }">
          <div class="flex items-center w-full mb-8">
            <SStepperItem :step="1">
              <SStepperTrigger>
                <SStepperIndicator />
                <div>
                  <SStepperTitle>Personal</SStepperTitle>
                  <SStepperDescription>Your information</SStepperDescription>
                </div>
              </SStepperTrigger>
              <SStepperSeparator />
            </SStepperItem>
            <SStepperItem :step="2">
              <SStepperTrigger>
                <SStepperIndicator />
                <div>
                  <SStepperTitle>Plan</SStepperTitle>
                  <SStepperDescription>Choose a plan</SStepperDescription>
                </div>
              </SStepperTrigger>
              <SStepperSeparator />
            </SStepperItem>
            <SStepperItem :step="3">
              <SStepperTrigger>
                <SStepperIndicator />
                <div>
                  <SStepperTitle>Payment</SStepperTitle>
                  <SStepperDescription>Billing details</SStepperDescription>
                </div>
              </SStepperTrigger>
            </SStepperItem>
          </div>

          <div class="relative overflow-hidden">
            <SStepperContent :step="1">
              <div class="space-y-4 max-w-md">
                <SInput v-model="formData.name" label="Full Name" placeholder="John Doe" />
                <SInput v-model="formData.email" label="Email" placeholder="john@example.com" type="email" />
              </div>
            </SStepperContent>

            <SStepperContent :step="2">
              <div class="grid grid-cols-3 gap-4 max-w-lg">
                <SButton
                  v-for="plan in ['Free', 'Pro', 'Enterprise']"
                  :key="plan"
                  :class="[
                    'rounded-xl border-2 p-5 text-center transition-all duration-200 h-auto flex-col',
                    formData.plan === plan
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border hover:border-primary/40'
                  ]"
                  variant="ghost"
                  @click="formData.plan = plan"
                >
                  <span class="font-semibold text-foreground">{{ plan }}</span>
                  <p class="text-xs text-muted-foreground mt-1">
                    {{ plan === 'Free' ? '$0/mo' : plan === 'Pro' ? '$19/mo' : '$99/mo' }}
                  </p>
                </SButton>
              </div>
            </SStepperContent>

            <SStepperContent :step="3">
              <div class="space-y-4 max-w-md">
                <SInput v-model="formData.cardNumber" label="Card Number" placeholder="4242 4242 4242 4242" />
                <div class="rounded-xl bg-muted/50 border border-border p-4">
                  <p class="text-xs font-semibold text-foreground mb-2">Order Summary</p>
                  <div class="space-y-1 text-sm text-muted-foreground">
                    <p><span class="text-foreground font-medium">Name:</span> {{ formData.name || '—' }}</p>
                    <p><span class="text-foreground font-medium">Email:</span> {{ formData.email || '—' }}</p>
                    <p><span class="text-foreground font-medium">Plan:</span> {{ formData.plan || '—' }}</p>
                  </div>
                </div>
              </div>
            </SStepperContent>
          </div>

          <div class="flex justify-between mt-6">
            <SButton @click="prevStep" :disabled="!canGoPrev" variant="outlined" size="small">
              <span class="mdi mdi-arrow-left mr-1.5" /> Back
            </SButton>
            <SButton @click="nextStep" :disabled="!canGoNext" size="small">
              {{ isLastStep ? 'Submit' : 'Continue' }}
              <span v-if="!isLastStep" class="mdi mdi-arrow-right ml-1.5" />
              <span v-else class="mdi mdi-check ml-1.5" />
            </SButton>
          </div>
        </template>
      </SStepper>
    </DemoSection>

    <!-- ────────────────────────────────────────────────────────────────────── -->
    <h2 class="text-2xl font-bold text-foreground">API Reference</h2>

    <SApiSection title="API Reference" data-toc-section>
      <div class="space-y-10">
        <div>
          <h3 class="text-xl font-semibold text-foreground mb-4">SStepper</h3>
          <p class="text-sm text-muted-foreground mb-4">Root container. Manages state, provides context to children, and exposes navigation helpers through its default slot.</p>
          <SApiTable title="Props" type="props" :props="stepperProps" />
          <SApiTable title="Events" type="events" :events="stepperEvents" class="mt-6" />
          <SApiTable title="Slots" type="slots" :slots="stepperSlots" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-foreground mb-4">SStepperItem</h3>
          <p class="text-sm text-muted-foreground mb-4">Wraps a single step. Registers itself with the root, tracks state, and provides context to trigger/indicator/content children.</p>
          <SApiTable title="Props" type="props" :props="stepperItemProps" />
          <SApiTable title="Slots" type="slots" :slots="stepperItemSlots" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-foreground mb-4">SStepperTrigger</h3>
          <p class="text-sm text-muted-foreground mb-4">Interactive button for each step. Handles click events, focus, and ARIA. Rendered as a native &lt;button&gt;.</p>
          <SApiTable title="Props" type="props" :props="stepperTriggerProps" />
          <SApiTable title="Slots" type="slots" :slots="stepperTriggerSlots" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-foreground mb-4">SStepperIndicator</h3>
          <p class="text-sm text-muted-foreground mb-4">Circular badge showing step number, checkmark (completed), spinner (loading), or alert icon (error). Custom content via default slot.</p>
          <SApiTable title="Props" type="props" :props="stepperIndicatorProps" />
          <SApiTable title="Slots" type="slots" :slots="stepperIndicatorSlots" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-foreground mb-4">SStepperContent</h3>
          <p class="text-sm text-muted-foreground mb-4">Content panel for each step. Animated transitions with directional awareness (slides forward/backward based on navigation).</p>
          <SApiTable title="Props" type="props" :props="stepperContentProps" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-foreground mb-4">SStepperSeparator</h3>
          <p class="text-sm text-muted-foreground mb-4">Visual connector between steps. Changes color on completion. Adapts to horizontal/vertical orientation and line variant.</p>
          <SApiTable title="Props" type="props" :props="stepperSeparatorProps" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-foreground mb-4">SStepperTitle</h3>
          <p class="text-sm text-muted-foreground mb-4">Label text. Adjusts size and color based on step state.</p>
          <SApiTable title="Props" type="props" :props="stepperTitleProps" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-foreground mb-4">SStepperDescription</h3>
          <p class="text-sm text-muted-foreground mb-4">Secondary text below the title. Always muted color, smaller font size.</p>
          <SApiTable title="Props" type="props" :props="stepperDescriptionProps" />
        </div>

        <SApiKeyboard title="Keyboard Navigation" :shortcuts="keyboardShortcuts" />
      </div>
    </SApiSection>
  </div>
</template>
