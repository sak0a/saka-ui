<script setup lang="ts">
import { ref } from 'vue'
import {
  SButton, SCard, SCardContent, SCardHeader, SApiSection, SApiTable,
  SToastContainer, useToast
} from '../../index'
import { useClickOutside } from '../../composables/useClickOutside'
import type { ApiProp, ApiMethod } from '../../index'
import DemoSection from '../../components/DemoSection.vue'

const toast = useToast()

// Demo 1: Basic click outside
const basicBoxRef = ref<HTMLElement | null>(null)
const basicClickCount = ref(0)

useClickOutside(basicBoxRef, () => {
  basicClickCount.value++
  toast.info('Clicked outside the box!')
})

// Demo 2: Dropdown with exclude
const dropdownRef = ref<HTMLElement | null>(null)
const dropdownButtonRef = ref<HTMLElement | null>(null)
const isDropdownOpen = ref(false)

useClickOutside(dropdownRef, () => {
  isDropdownOpen.value = false
}, {
  exclude: [dropdownButtonRef],
  triggerOnEscape: true
})

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value
}

// Demo 3: Modal/Popover with escape
const modalRef = ref<HTMLElement | null>(null)
const isModalOpen = ref(false)

useClickOutside(modalRef, () => {
  isModalOpen.value = false
}, {
  triggerOnEscape: true
})

// Demo 4: Controlled activation
const controlledRef = ref<HTMLElement | null>(null)
const isEnabled = ref(true)
const controlledCount = ref(0)

useClickOutside(controlledRef, () => {
  controlledCount.value++
}, {
  enabled: isEnabled
})

// Code examples
const basicCode = `import { ref } from 'vue'
import { useClickOutside } from 'saka-ui'

const targetRef = ref<HTMLElement>()

useClickOutside(targetRef, () => {
  console.log('Clicked outside!')
})`

const excludeCode = `const dropdownRef = ref<HTMLElement>()
const buttonRef = ref<HTMLElement>()
const isOpen = ref(false)

useClickOutside(dropdownRef, () => {
  isOpen.value = false
}, {
  // Don't close when clicking the toggle button
  exclude: [buttonRef],
  // Also close on Escape key
  triggerOnEscape: true
})`

const controlledCode = `const targetRef = ref<HTMLElement>()
const isEnabled = ref(true)

const { stop, start, isActive } = useClickOutside(
  targetRef,
  () => console.log('Clicked outside'),
  { enabled: isEnabled }
)

// Manually control
stop()   // Stop listening
start()  // Resume listening`

const multipleCode = `// Monitor clicks outside multiple elements
const refs = [
  ref<HTMLElement>(),
  ref<HTMLElement>(),
  ref<HTMLElement>()
]

useClickOutside(refs, () => {
  closeAll()
})`

// API Tables
const clickOutsideMethods: ApiMethod[] = [
  { name: 'useClickOutside(target, handler, options?)', description: 'Set up click outside detection for element(s)' }
]

const returnProps: ApiProp[] = [
  { name: 'stop()', type: 'function', description: 'Stop listening for click outside events' },
  { name: 'start()', type: 'function', description: 'Start listening for click outside events' },
  { name: 'isActive', type: 'boolean', description: 'Whether the listener is currently active' }
]

const optionsProps: ApiProp[] = [
  { name: 'exclude', type: 'MaybeElementRef[]', description: 'Elements to exclude from triggering the callback' },
  { name: 'triggerOnEscape', type: 'boolean', default: 'false', description: 'Whether to trigger callback on Escape key press' },
  { name: 'enabled', type: 'MaybeRef<boolean>', default: 'true', description: 'Whether the handler is active' },
  { name: 'event', type: 'string', default: "'pointerdown'", description: "Event to listen for ('click', 'mousedown', 'pointerdown', etc.)" },
  { name: 'capture', type: 'boolean', default: 'true', description: 'Whether to use capture phase' }
]
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-(--s-text-primary) mb-2">useClickOutside</h1>
      <p class="text-lg text-(--s-text-secondary)">
        Detect clicks outside an element. Perfect for dropdowns, modals, and popovers.
      </p>
    </header>

    <!-- Quick Demo -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Quick Demo</h2>
      <SCard variant="outlined">
        <SCardContent>
          <p class="text-sm text-(--s-text-secondary) mb-4">
            Click outside the blue box to trigger the handler. Click count: {{ basicClickCount }}
          </p>
          <div class="flex items-center justify-center p-8 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <div
              ref="basicBoxRef"
              class="w-48 h-32 bg-blue-500 rounded-lg flex items-center justify-center text-white font-medium shadow-lg cursor-pointer hover:bg-blue-600 transition-colors"
            >
              Click outside me
            </div>
          </div>
        </SCardContent>
      </SCard>
    </section>

    <!-- Basic Usage -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Basic Usage</h2>
      <DemoSection
        title="Simple Detection"
        description="Detect when user clicks outside a target element."
        :code="basicCode"
        language="typescript"
        code-only
      />
    </section>

    <!-- Dropdown Example -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Dropdown with Exclude</h2>
      <DemoSection
        title="Exclude Elements"
        description="Exclude specific elements from triggering the callback. Useful for dropdown toggle buttons."
        :code="excludeCode"
        language="typescript"
      >
        <div class="relative inline-block">
          <SButton
            ref="dropdownButtonRef"
            @click="toggleDropdown"
          >
            Toggle Dropdown
            <span class="ml-2">{{ isDropdownOpen ? '▲' : '▼' }}</span>
          </SButton>
          
          <Transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="isDropdownOpen"
              ref="dropdownRef"
              class="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-10 overflow-hidden"
            >
              <div class="py-1">
                <a href="#" class="block px-4 py-2 text-sm text-(--s-text-primary) hover:bg-slate-100 dark:hover:bg-slate-700">
                  Profile
                </a>
                <a href="#" class="block px-4 py-2 text-sm text-(--s-text-primary) hover:bg-slate-100 dark:hover:bg-slate-700">
                  Settings
                </a>
                <a href="#" class="block px-4 py-2 text-sm text-(--s-text-primary) hover:bg-slate-100 dark:hover:bg-slate-700">
                  Sign out
                </a>
              </div>
            </div>
          </Transition>
        </div>
        <p class="mt-4 text-sm text-(--s-text-secondary)">
          Click outside the dropdown to close it. Clicking the button toggles it. Press Escape to close.
        </p>
      </DemoSection>
    </section>

    <!-- Modal Example -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Modal/Popover Example</h2>
      <SCard variant="outlined">
        <SCardHeader>
          <h3 class="font-semibold text-(--s-text-primary)">Click Outside to Close Modal</h3>
        </SCardHeader>
        <SCardContent>
          <SButton @click="isModalOpen = true">
            Open Modal
          </SButton>
          
          <Teleport to="body">
            <Transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0"
              enter-to-class="opacity-100"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <div
                v-if="isModalOpen"
                class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              >
                <div
                  ref="modalRef"
                  class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 max-w-md w-full"
                >
                  <h3 class="text-lg font-semibold text-(--s-text-primary) mb-2">
                    Modal Title
                  </h3>
                  <p class="text-(--s-text-secondary) mb-4">
                    Click outside this modal or press Escape to close it.
                  </p>
                  <div class="flex justify-end">
                    <SButton @click="isModalOpen = false">
                      Close
                    </SButton>
                  </div>
                </div>
              </div>
            </Transition>
          </Teleport>
        </SCardContent>
      </SCard>
    </section>

    <!-- Controlled Activation -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Controlled Activation</h2>
      <DemoSection
        title="Enable/Disable Detection"
        description="Control when the click outside detection is active."
        :code="controlledCode"
        language="typescript"
      >
        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <SButton 
              :variant="isEnabled ? 'filled' : 'outlined'"
              @click="isEnabled = !isEnabled"
            >
              Detection: {{ isEnabled ? 'Enabled' : 'Disabled' }}
            </SButton>
            <span class="text-sm text-(--s-text-secondary)">
              Click count: {{ controlledCount }}
            </span>
          </div>
          <div class="flex items-center justify-center p-8 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <div
              ref="controlledRef"
              :class="[
                'w-48 h-32 rounded-lg flex items-center justify-center text-white font-medium shadow-lg transition-colors',
                isEnabled ? 'bg-emerald-500' : 'bg-slate-400'
              ]"
            >
              {{ isEnabled ? 'Active' : 'Inactive' }}
            </div>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Multiple Elements -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Multiple Elements</h2>
      <DemoSection
        title="Monitor Multiple Targets"
        description="Detect clicks outside any of multiple elements."
        :code="multipleCode"
        language="typescript"
        code-only
      />
    </section>

    <!-- API Reference -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">API Reference</h2>
      
      <SApiSection title="useClickOutside">
        <SApiTable title="Usage" :methods="clickOutsideMethods" type="methods" />
      </SApiSection>

      <div class="mt-8">
        <SApiSection title="Return Value">
          <SApiTable title="Properties" :props="returnProps" type="props" />
        </SApiSection>
      </div>

      <div class="mt-8">
        <SApiSection title="Options">
          <SApiTable title="Properties" :props="optionsProps" type="props" />
        </SApiSection>
      </div>
    </section>
  </div>

  <!-- Toast Container -->
  <SToastContainer />
</template>
