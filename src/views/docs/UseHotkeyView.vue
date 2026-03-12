<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  SButton, SCard, SCardContent, SCardHeader, SApiSection, SApiTable, SInput
} from '../../index'
import { useHotkey, useHotkeys, useKeyPressed } from '../../composables/useHotkey'
import type { ApiProp, ApiMethod } from '../../index'
import DemoSection from '../../components/DemoSection.vue'

// Demo: Basic hotkey
const saveCount = ref(0)
const lastHotkey = ref('')

useHotkey('ctrl+s', (e) => {
  e.preventDefault()
  saveCount.value++
  lastHotkey.value = 'Ctrl+S'
}, { preventDefault: true })

// Demo: Multiple hotkeys
const actionLog = ref<string[]>([])

function logAction(action: string) {
  actionLog.value.unshift(`${new Date().toLocaleTimeString()}: ${action}`)
  if (actionLog.value.length > 5) actionLog.value.pop()
}

useHotkeys({
  'ctrl+z': () => logAction('Undo'),
  'ctrl+shift+z': () => logAction('Redo'),
  'ctrl+c': () => logAction('Copy'),
  'ctrl+v': () => logAction('Paste'),
  'escape': () => logAction('Escape pressed')
}, { preventDefault: true })

// Demo: Key pressed state
const isCtrlPressed = useKeyPressed('ctrl')
const isShiftPressed = useKeyPressed('shift')
const isAltPressed = useKeyPressed('alt')

// Demo: Scoped hotkey (enabled/disabled)
const isModalOpen = ref(false)
const modalEnabled = computed(() => isModalOpen.value)

useHotkey('escape', () => {
  isModalOpen.value = false
}, { enabled: modalEnabled })

// Demo: Non-input scope
const searchFocused = ref(false)
const searchInputRef = ref<HTMLInputElement>()

useHotkey('/', () => {
  searchInputRef.value?.focus()
  searchFocused.value = true
}, { scope: 'non-input', preventDefault: true })

// Code examples
const basicCode = `import { useHotkey } from '@sakoa/ui'

// Simple hotkey
useHotkey('escape', () => {
  closeModal()
})

// With modifiers
useHotkey('ctrl+s', () => {
  saveDocument()
}, { preventDefault: true })

// Multiple modifiers
useHotkey('ctrl+shift+s', () => {
  saveAs()
})`

const multipleCode = `import { useHotkeys } from '@sakoa/ui'

useHotkeys({
  'ctrl+s': () => save(),
  'ctrl+z': () => undo(),
  'ctrl+shift+z': () => redo(),
  'ctrl+c': () => copy(),
  'ctrl+v': () => paste(),
  'escape': () => cancel()
}, { preventDefault: true })`

const scopeCode = `// Only trigger when NOT in an input field
useHotkey('/', () => {
  focusSearch()
}, { scope: 'non-input' })

// Only trigger when IN an input field
useHotkey('ctrl+enter', () => {
  submitForm()
}, { scope: 'input' })

// Scoped to specific element
const editorRef = ref<HTMLElement>()
useHotkey('ctrl+b', () => toggleBold(), { target: editorRef })`

const enabledCode = `const isEditing = ref(false)

// Only active when editing
useHotkey('ctrl+s', () => save(), {
  enabled: isEditing
})

// Or with computed
const isModalOpen = ref(false)
useHotkey('escape', () => close(), {
  enabled: computed(() => isModalOpen.value)
})`

const keyPressedCode = `import { useKeyPressed } from '@sakoa/ui'

// Track if key is currently held down
const isCtrlPressed = useKeyPressed('ctrl')
const isShiftCtrlK = useKeyPressed('ctrl+shift+k')

// Show UI hints when modifier is pressed
<div v-if="isCtrlPressed">
  Keyboard shortcuts available...
</div>`

// API Tables
const composableMethods: ApiMethod[] = [
  { name: 'useHotkey(combo, handler, options?)', description: 'Register a single keyboard hotkey' },
  { name: 'useHotkeys(bindings, options?)', description: 'Register multiple hotkeys at once' },
  { name: 'createHotkeyHandler(bindings, options?)', description: 'Create handler for v-on directive' },
  { name: 'useKeyPressed(combo)', description: 'Track if a key combination is pressed' }
]

const optionsProps: ApiProp[] = [
  { name: 'target', type: 'MaybeRef<HTMLElement | Window>', default: 'window', description: 'Target element to attach listener' },
  { name: 'preventDefault', type: 'boolean', default: 'false', description: 'Prevent default browser behavior' },
  { name: 'stopPropagation', type: 'boolean', default: 'false', description: 'Stop event propagation' },
  { name: 'enabled', type: 'MaybeRef<boolean>', default: 'true', description: 'Whether hotkey is active' },
  { name: 'event', type: "'keydown' | 'keyup'", default: "'keydown'", description: 'Event to listen for' },
  { name: 'scope', type: "'global' | 'input' | 'non-input'", default: "'global'", description: 'When to trigger' },
  { name: 'capture', type: 'boolean', default: 'false', description: 'Use capture phase' },
  { name: 'repeat', type: 'boolean', default: 'false', description: 'Trigger on key repeat' }
]

const returnProps: ApiProp[] = [
  { name: 'stop', type: '() => void', description: 'Stop listening for hotkey' },
  { name: 'start', type: '() => void', description: 'Start listening for hotkey' },
  { name: 'isActive', type: 'boolean', description: 'Whether listener is active' }
]

const supportedKeys: ApiProp[] = [
  { name: 'ctrl / control', type: 'Modifier', description: 'Control key' },
  { name: 'alt / option', type: 'Modifier', description: 'Alt/Option key' },
  { name: 'shift', type: 'Modifier', description: 'Shift key' },
  { name: 'meta / cmd / command', type: 'Modifier', description: 'Meta/Command key' },
  { name: 'escape / esc', type: 'Key', description: 'Escape key' },
  { name: 'enter', type: 'Key', description: 'Enter key' },
  { name: 'space / spacebar', type: 'Key', description: 'Space key' },
  { name: 'up / down / left / right', type: 'Key', description: 'Arrow keys' },
  { name: 'a-z, 0-9', type: 'Key', description: 'Letter and number keys' },
  { name: 'f1-f12', type: 'Key', description: 'Function keys' }
]
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-(--s-text-primary) mb-2">useHotkey</h1>
      <p class="text-lg text-(--s-text-secondary)">
        Keyboard shortcut composable with support for key combinations, modifiers, and scoped hotkeys.
      </p>
    </header>

    <!-- Key Pressed Demo -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Modifier Key Status</h2>
      <SCard variant="outlined">
        <SCardHeader>
          <h3 class="font-semibold text-(--s-text-primary)">Currently Pressed</h3>
          <p class="text-sm text-(--s-text-secondary)">Hold modifier keys to see the status change</p>
        </SCardHeader>
        <SCardContent>
          <div class="flex flex-wrap gap-3">
            <div 
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-all',
                isCtrlPressed 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-slate-200 dark:bg-slate-700 text-(--s-text-secondary)'
              ]"
            >
              Ctrl {{ isCtrlPressed ? '✓' : '' }}
            </div>
            <div 
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-all',
                isShiftPressed 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-slate-200 dark:bg-slate-700 text-(--s-text-secondary)'
              ]"
            >
              Shift {{ isShiftPressed ? '✓' : '' }}
            </div>
            <div 
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-all',
                isAltPressed 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-slate-200 dark:bg-slate-700 text-(--s-text-secondary)'
              ]"
            >
              Alt {{ isAltPressed ? '✓' : '' }}
            </div>
          </div>
        </SCardContent>
      </SCard>
    </section>

    <!-- Basic Hotkey Demo -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Basic Hotkey</h2>
      <SCard variant="outlined">
        <SCardHeader>
          <h3 class="font-semibold text-(--s-text-primary)">Try Ctrl+S</h3>
          <p class="text-sm text-(--s-text-secondary)">Press Ctrl+S anywhere on this page</p>
        </SCardHeader>
        <SCardContent class="space-y-4">
          <div class="flex items-center gap-4">
            <div class="text-3xl font-bold">{{ saveCount }}</div>
            <div class="text-sm text-(--s-text-secondary)">
              Times saved
            </div>
          </div>
          <p v-if="lastHotkey" class="text-sm text-emerald-500">
            Last hotkey: {{ lastHotkey }}
          </p>
          <p class="text-sm text-(--s-text-secondary)">
            The default browser save dialog is prevented.
          </p>
        </SCardContent>
      </SCard>
    </section>

    <!-- Multiple Hotkeys Demo -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Multiple Hotkeys</h2>
      <SCard variant="outlined">
        <SCardHeader>
          <h3 class="font-semibold text-(--s-text-primary)">Action Log</h3>
          <p class="text-sm text-(--s-text-secondary)">Try: Ctrl+Z, Ctrl+Shift+Z, Ctrl+C, Ctrl+V, Escape</p>
        </SCardHeader>
        <SCardContent>
          <ul v-if="actionLog.length" class="space-y-1">
            <li 
              v-for="(action, index) in actionLog" 
              :key="index"
              class="text-sm font-mono p-2 rounded bg-slate-100 dark:bg-slate-800"
            >
              {{ action }}
            </li>
          </ul>
          <p v-else class="text-sm text-(--s-text-secondary)">
            Press any of the hotkeys to see the log...
          </p>
        </SCardContent>
      </SCard>
    </section>

    <!-- Non-input Scope Demo -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Scoped Hotkeys</h2>
      <SCard variant="outlined">
        <SCardHeader>
          <h3 class="font-semibold text-(--s-text-primary)">Press "/" to Focus Search</h3>
          <p class="text-sm text-(--s-text-secondary)">Only works when not focused on an input</p>
        </SCardHeader>
        <SCardContent class="space-y-4">
          <SInput 
            ref="searchInputRef"
            placeholder="Search... (press / to focus)"
            @focus="searchFocused = true"
            @blur="searchFocused = false"
          />
          <p class="text-sm text-(--s-text-secondary)">
            Status: {{ searchFocused ? 'Search focused' : 'Press / to focus search' }}
          </p>
        </SCardContent>
      </SCard>
    </section>

    <!-- Conditional Hotkey Demo -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Conditional Hotkeys</h2>
      <SCard variant="outlined">
        <SCardHeader>
          <h3 class="font-semibold text-(--s-text-primary)">Escape to Close Modal</h3>
          <p class="text-sm text-(--s-text-secondary)">Escape hotkey only works when modal is open</p>
        </SCardHeader>
        <SCardContent class="space-y-4">
          <SButton @click="isModalOpen = true">
            Open Modal
          </SButton>
          
          <div 
            v-if="isModalOpen"
            class="p-6 rounded-lg bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500"
          >
            <h4 class="font-semibold mb-2">Modal Content</h4>
            <p class="text-sm text-(--s-text-secondary) mb-4">
              Press Escape to close this modal
            </p>
            <SButton size="sm" @click="isModalOpen = false">
              Close
            </SButton>
          </div>
        </SCardContent>
      </SCard>
    </section>

    <!-- Keyboard Hints -->
    <section v-if="isCtrlPressed">
      <SCard variant="filled" class="border-2 border-blue-500">
        <SCardContent>
          <h3 class="font-semibold text-(--s-text-primary) mb-2">Available Shortcuts</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <div><kbd>S</kbd> Save</div>
            <div><kbd>Z</kbd> Undo</div>
            <div><kbd>Shift+Z</kbd> Redo</div>
            <div><kbd>C</kbd> Copy</div>
          </div>
        </SCardContent>
      </SCard>
    </section>

    <!-- Code Examples -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Code Examples</h2>
      
      <div class="space-y-6">
        <DemoSection
          title="Basic Usage"
          :code="basicCode"
          language="typescript"
          code-only
        />

        <DemoSection
          title="Multiple Hotkeys"
          :code="multipleCode"
          language="typescript"
          code-only
        />

        <DemoSection
          title="Scoped Hotkeys"
          :code="scopeCode"
          language="typescript"
          code-only
        />

        <DemoSection
          title="Conditional Hotkeys"
          :code="enabledCode"
          language="typescript"
          code-only
        />

        <DemoSection
          title="Key Pressed State"
          :code="keyPressedCode"
          language="typescript"
          code-only
        />
      </div>
    </section>

    <!-- API Reference -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">API Reference</h2>
      
      <SApiSection title="Composables">
        <SApiTable title="Functions" :methods="composableMethods" type="methods" />
      </SApiSection>

      <div class="mt-8">
        <SApiSection title="HotkeyOptions">
          <SApiTable title="Properties" :props="optionsProps" type="props" />
        </SApiSection>
      </div>

      <div class="mt-8">
        <SApiSection title="Return Value">
          <SApiTable title="Properties" :props="returnProps" type="props" />
        </SApiSection>
      </div>

      <div class="mt-8">
        <SApiSection title="Supported Keys">
          <SApiTable title="Keys" :props="supportedKeys" type="props" />
        </SApiSection>
      </div>
    </section>
  </div>
</template>
