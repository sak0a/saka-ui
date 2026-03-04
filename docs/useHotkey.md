# useHotkey

A keyboard shortcut composable for Vue 3 with support for key combinations, modifiers, and scoped hotkeys.

## Installation

```typescript
import { useHotkey, useHotkeys } from 'saka-ui'
```

## Basic Usage

```typescript
import { useHotkey } from 'saka-ui'

// Simple hotkey
useHotkey('escape', () => {
  closeModal()
})

// With modifiers
useHotkey('ctrl+s', () => {
  saveDocument()
})

// Multiple modifiers
useHotkey('ctrl+shift+s', () => {
  saveAs()
})
```

## Key Combination Syntax

Hotkeys are specified as strings with `+` separating modifiers and keys:

```typescript
// Single key
useHotkey('escape', handler)
useHotkey('enter', handler)
useHotkey('space', handler)

// With modifiers
useHotkey('ctrl+k', handler)
useHotkey('alt+enter', handler)
useHotkey('shift+delete', handler)
useHotkey('meta+c', handler)  // Cmd on Mac, Win on Windows

// Multiple modifiers
useHotkey('ctrl+shift+p', handler)
useHotkey('ctrl+alt+delete', handler)

// Mac-style aliases
useHotkey('cmd+s', handler)      // Same as meta+s
useHotkey('option+tab', handler) // Same as alt+tab
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `target` | `MaybeRef<HTMLElement \| Window \| Document>` | `window` | Target element |
| `preventDefault` | `boolean` | `false` | Prevent default browser behavior |
| `stopPropagation` | `boolean` | `false` | Stop event propagation |
| `enabled` | `MaybeRef<boolean>` | `true` | Whether hotkey is active |
| `event` | `'keydown' \| 'keyup'` | `'keydown'` | Event to listen for |
| `scope` | `'global' \| 'input' \| 'non-input'` | `'global'` | When to trigger |
| `capture` | `boolean` | `false` | Use capture phase |
| `repeat` | `boolean` | `false` | Trigger on key repeat |

## Return Value

| Property | Type | Description |
|----------|------|-------------|
| `stop` | `() => void` | Stop listening for hotkey |
| `start` | `() => void` | Start listening for hotkey |
| `isActive` | `boolean` | Whether listener is active |

## Prevent Default

Prevent the browser's default behavior for the key combination:

```typescript
// Prevent Ctrl+S from opening browser save dialog
useHotkey('ctrl+s', () => {
  saveDocument()
}, {
  preventDefault: true
})

// Prevent Ctrl+K from opening browser search
useHotkey('ctrl+k', () => {
  openCommandPalette()
}, {
  preventDefault: true,
  stopPropagation: true
})
```

## Scoped Hotkeys

Limit hotkeys to specific contexts:

```typescript
// Only trigger when NOT in an input field
useHotkey('/', () => {
  focusSearchInput()
}, {
  scope: 'non-input'
})

// Only trigger when IN an input field
useHotkey('ctrl+enter', () => {
  submitForm()
}, {
  scope: 'input'
})

// Scoped to specific element
const editorRef = ref<HTMLElement>()

useHotkey('ctrl+b', () => {
  toggleBold()
}, {
  target: editorRef
})
```

## Conditional Hotkeys

Enable/disable hotkeys dynamically:

```typescript
const isEditing = ref(false)

useHotkey('ctrl+s', () => {
  save()
}, {
  enabled: isEditing
})

// Enable when editing starts
function startEditing() {
  isEditing.value = true
}
```

## Multiple Hotkeys

Register multiple hotkeys at once:

```typescript
import { useHotkeys } from 'saka-ui'

useHotkeys({
  'ctrl+s': () => save(),
  'ctrl+z': () => undo(),
  'ctrl+shift+z': () => redo(),
  'ctrl+c': () => copy(),
  'ctrl+v': () => paste(),
  'escape': () => cancel()
}, {
  preventDefault: true
})
```

## Event Handler

Create a hotkey handler for use with `v-on`:

```typescript
import { createHotkeyHandler } from 'saka-ui'

const onKeyDown = createHotkeyHandler({
  'enter': () => submit(),
  'escape': () => cancel(),
  'ctrl+s': () => save()
}, {
  preventDefault: true
})
```

```vue
<template>
  <div @keydown="onKeyDown">
    <!-- Content -->
  </div>
</template>
```

## Key Pressed State

Track whether a key combination is currently pressed:

```typescript
import { useKeyPressed } from 'saka-ui'

const isCtrlPressed = useKeyPressed('ctrl')
const isShiftCtrlK = useKeyPressed('ctrl+shift+k')
```

```vue
<template>
  <div :class="{ 'ctrl-mode': isCtrlPressed }">
    <span v-if="isCtrlPressed">Ctrl is pressed</span>
  </div>
</template>
```

## Supported Keys

### Modifier Keys
- `ctrl` / `control`
- `alt` / `option`
- `shift`
- `meta` / `cmd` / `command`

### Special Keys
- `escape` / `esc`
- `enter`
- `space` / `spacebar`
- `tab`
- `delete` / `del`
- `backspace`
- `insert` / `ins`
- `home`, `end`
- `pageup` / `pgup`, `pagedown` / `pgdn`

### Arrow Keys
- `arrowup` / `up`
- `arrowdown` / `down`
- `arrowleft` / `left`
- `arrowright` / `right`

### Function Keys
- `f1` through `f12`

### Letter and Number Keys
- `a` through `z`
- `0` through `9`

## Types

```typescript
type ModifierKey = 'ctrl' | 'alt' | 'shift' | 'meta'
type KeyCombo = string // e.g., 'ctrl+k', 'shift+alt+s', 'escape'

interface HotkeyOptions {
  target?: MaybeRef<HTMLElement | Window | Document | null>
  preventDefault?: boolean
  stopPropagation?: boolean
  enabled?: MaybeRef<boolean>
  event?: 'keydown' | 'keyup'
  scope?: 'global' | 'input' | 'non-input'
  capture?: boolean
  repeat?: boolean
}

interface UseHotkeyReturn {
  stop: () => void
  start: () => void
  isActive: boolean
}

interface ParsedHotkey {
  key: string
  ctrl: boolean
  alt: boolean
  shift: boolean
  meta: boolean
}
```

## Complete Example

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useHotkey, useHotkeys, useKeyPressed, useToast } from 'saka-ui'

const toast = useToast()
const isCommandPaletteOpen = ref(false)
const content = ref('Hello, World!')
const history = ref<string[]>([])
const historyIndex = ref(-1)

// Command palette
useHotkey('ctrl+k', () => {
  isCommandPaletteOpen.value = true
}, { preventDefault: true })

// Close on escape
useHotkey('escape', () => {
  isCommandPaletteOpen.value = false
}, {
  enabled: isCommandPaletteOpen
})

// Editor hotkeys (only when not in command palette)
useHotkeys({
  'ctrl+s': () => {
    toast.success('Saved!')
  },
  'ctrl+z': () => {
    if (historyIndex.value > 0) {
      historyIndex.value--
      content.value = history.value[historyIndex.value]
    }
  },
  'ctrl+shift+z': () => {
    if (historyIndex.value < history.value.length - 1) {
      historyIndex.value++
      content.value = history.value[historyIndex.value]
    }
  }
}, {
  preventDefault: true,
  enabled: computed(() => !isCommandPaletteOpen.value)
})

// Track modifier keys for UI hints
const isCtrlPressed = useKeyPressed('ctrl')
const isShiftPressed = useKeyPressed('shift')

// Quick search (only outside inputs)
useHotkey('/', () => {
  document.getElementById('search-input')?.focus()
}, {
  scope: 'non-input',
  preventDefault: true
})

// Save history on content change
watch(content, (newContent) => {
  history.value = history.value.slice(0, historyIndex.value + 1)
  history.value.push(newContent)
  historyIndex.value = history.value.length - 1
})
</script>

<template>
  <div class="editor">
    <!-- Keyboard hints -->
    <div class="hints" v-if="isCtrlPressed">
      <span>S: Save</span>
      <span>Z: Undo</span>
      <span v-if="isShiftPressed">Z: Redo</span>
      <span>K: Command Palette</span>
    </div>
    
    <!-- Search -->
    <input 
      id="search-input"
      type="text" 
      placeholder="Press / to search..."
    />
    
    <!-- Editor -->
    <textarea v-model="content" class="w-full h-64" />
    
    <!-- Command Palette -->
    <div v-if="isCommandPaletteOpen" class="command-palette">
      <input 
        type="text" 
        placeholder="Type a command..." 
        autofocus
      />
      <ul>
        <li>Save (Ctrl+S)</li>
        <li>Undo (Ctrl+Z)</li>
        <li>Redo (Ctrl+Shift+Z)</li>
      </ul>
    </div>
    
    <!-- Status bar -->
    <div class="status-bar">
      <span>History: {{ historyIndex + 1 }}/{{ history.length }}</span>
    </div>
  </div>
</template>
```

## Use Cases

- **Command palette**: Ctrl+K to open quick actions
- **Save shortcuts**: Ctrl+S to save documents
- **Undo/Redo**: Ctrl+Z and Ctrl+Shift+Z
- **Navigation**: Arrow keys for moving focus
- **Quick search**: / to focus search input
- **Close modals**: Escape to close dialogs
- **Accessibility**: Keyboard navigation for all interactions
