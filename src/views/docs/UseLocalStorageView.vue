<script setup lang="ts">
import { computed } from 'vue'
import {
  SButton, SCard, SCardContent, SCardHeader, SApiSection, SApiTable, SInput, SSwitch
} from '../../index'
import { useLocalStorage, useSessionStorage } from '../../composables/useLocalStorage'
import type { ApiProp, ApiMethod } from '../../index'
import DemoSection from '../../components/DemoSection.vue'

// Demo: Basic localStorage
const { value: userName, remove: clearUserName, exists: userNameExists } = useLocalStorage('demo-username', '')
const { value: counter, remove: clearCounter } = useLocalStorage('demo-counter', 0)

// Demo: Object storage
const { value: preferences } = useLocalStorage('demo-preferences', {
  theme: 'light' as 'light' | 'dark',
  notifications: true,
  fontSize: 16
})

// Demo: Session storage
const { value: sessionData, remove: clearSession } = useSessionStorage('demo-session', {
  visitCount: 0,
  lastPage: '/'
})

// Increment visit count on load
sessionData.value.visitCount++

// Demo: Cart example
const { value: cart, remove: clearCart } = useLocalStorage<{ items: { id: number; name: string; qty: number }[] }>('demo-cart', {
  items: []
})

function addToCart(id: number, name: string) {
  const existing = cart.value.items.find(item => item.id === id)
  if (existing) {
    existing.qty++
  } else {
    cart.value.items.push({ id, name, qty: 1 })
  }
}

const cartTotal = computed(() => cart.value.items.reduce((sum, item) => sum + item.qty, 0))

// Code examples
const basicCode = `import { useLocalStorage } from '@sakoa/ui'

// String value
const { value: userName } = useLocalStorage('username', '')
userName.value = 'John' // Auto-synced to localStorage

// Object value (deep reactivity)
const { value: user } = useLocalStorage('user', { 
  name: 'Guest', 
  email: '' 
})
user.value.name = 'John' // Deep changes also sync`

const sessionCode = `import { useSessionStorage } from '@sakoa/ui'

// Session-only data (cleared on browser close)
const { value: session } = useSessionStorage('auth', {
  token: null,
  expiresAt: null
})

// Form data that persists during session
const { value: formDraft } = useSessionStorage('form-draft', {
  step: 1,
  data: {}
})`

const optionsCode = `const { value } = useLocalStorage('key', defaultValue, {
  // Custom serializer for non-JSON values
  serializer: {
    read: (v) => new Date(v),
    write: (v) => v.toISOString()
  },
  
  // Cross-tab sync (localStorage only)
  syncTabs: true,
  
  // Error handling
  onError: (error) => console.error('Storage error:', error),
  
  // Write default if key doesn't exist
  writeDefaults: true,
  
  // Merge stored value with defaults
  mergeDefaults: true
})`

const methodsCode = `const { value, remove, exists, refresh } = useLocalStorage('key', defaultValue)

// Check if key exists
if (exists()) {
  console.log('Found in storage')
}

// Remove from storage (resets to default)
remove()

// Force refresh from storage
refresh()`

// API Tables
const composableMethods: ApiMethod[] = [
  { name: 'useLocalStorage(key, default, options?)', description: 'Create reactive localStorage value with cross-tab sync' },
  { name: 'useSessionStorage(key, default, options?)', description: 'Create reactive sessionStorage value' },
  { name: 'createStorage(key, default, storage, options?)', description: 'Create reactive storage with custom Storage implementation' }
]

const optionsProps: ApiProp[] = [
  { name: 'serializer', type: 'Serializer<T>', default: 'Auto', description: 'Custom read/write serializer' },
  { name: 'syncTabs', type: 'boolean', default: 'true', description: 'Sync across browser tabs (localStorage only)' },
  { name: 'onError', type: '(error: Error) => void', default: 'console.error', description: 'Error callback' },
  { name: 'writeDefaults', type: 'boolean', default: 'false', description: 'Write default value if key missing' },
  { name: 'listenToStorageChanges', type: 'boolean', default: 'true', description: 'Listen for external changes' },
  { name: 'mergeDefaults', type: 'boolean | function', default: 'false', description: 'Merge stored value with defaults' }
]

const returnProps: ApiProp[] = [
  { name: 'value', type: 'Ref<T>', description: 'Reactive storage value' },
  { name: 'remove', type: '() => void', description: 'Remove value from storage' },
  { name: 'exists', type: '() => boolean', description: 'Check if key exists in storage' },
  { name: 'refresh', type: '() => void', description: 'Force refresh from storage' }
]
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-(--s-text-primary) mb-2">useLocalStorage / useSessionStorage</h1>
      <p class="text-lg text-(--s-text-secondary)">
        Reactive browser storage with cross-tab synchronization, type safety, and SSR support.
      </p>
    </header>

    <!-- Live Demo: Basic -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Live Demo</h2>
      <SCard variant="outlined">
        <SCardHeader>
          <h3 class="font-semibold text-(--s-text-primary)">Persistent Values</h3>
          <p class="text-sm text-(--s-text-secondary)">These values persist across page reloads</p>
        </SCardHeader>
        <SCardContent class="space-y-6">
          <!-- String value -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-(--s-text-primary)">Username (localStorage)</label>
            <div class="flex items-center gap-3">
              <SInput v-model="userName" placeholder="Enter your name..." class="flex-1" />
              <SButton variant="outlined" size="small" @click="clearUserName">
                Clear
              </SButton>
            </div>
            <p class="text-xs text-(--s-text-secondary)">
              Exists in storage: {{ userNameExists() ? 'Yes' : 'No' }}
            </p>
          </div>

          <!-- Counter -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-(--s-text-primary)">Counter (localStorage)</label>
            <div class="flex items-center gap-3">
              <SButton size="small" @click="counter--">-</SButton>
              <span class="w-12 text-center font-mono text-lg">{{ counter }}</span>
              <SButton size="small" @click="counter++">+</SButton>
              <SButton variant="outlined" size="small" @click="clearCounter">
                Reset
              </SButton>
            </div>
          </div>

          <!-- Session data -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-(--s-text-primary)">Session Data (sessionStorage)</label>
            <div class="flex items-center gap-3 text-sm">
              <span class="text-(--s-text-secondary)">
                Visits this session: <strong>{{ sessionData.visitCount }}</strong>
              </span>
              <SButton variant="ghost" size="small" @click="clearSession">
                Clear Session
              </SButton>
            </div>
          </div>
        </SCardContent>
      </SCard>
    </section>

    <!-- Object Storage Demo -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Object Storage</h2>
      <SCard variant="outlined">
        <SCardHeader>
          <h3 class="font-semibold text-(--s-text-primary)">User Preferences</h3>
          <p class="text-sm text-(--s-text-secondary)">Deep reactivity - changes to nested properties are synced</p>
        </SCardHeader>
        <SCardContent class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Theme -->
            <div class="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
              <div class="text-sm text-(--s-text-secondary) mb-2">Theme</div>
              <div class="flex items-center gap-2">
                <SButton 
                  :variant="preferences.theme === 'light' ? 'filled' : 'outlined'" 
                  size="small"
                  @click="preferences.theme = 'light'"
                >
                  Light
                </SButton>
                <SButton 
                  :variant="preferences.theme === 'dark' ? 'filled' : 'outlined'" 
                  size="small"
                  @click="preferences.theme = 'dark'"
                >
                  Dark
                </SButton>
              </div>
            </div>

            <!-- Notifications -->
            <div class="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
              <div class="text-sm text-(--s-text-secondary) mb-2">Notifications</div>
              <SSwitch v-model="preferences.notifications" />
            </div>

            <!-- Font Size -->
            <div class="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
              <div class="text-sm text-(--s-text-secondary) mb-2">Font Size: {{ preferences.fontSize }}px</div>
              <input 
                type="range" 
                v-model.number="preferences.fontSize" 
                min="12" 
                max="24"
                class="w-full"
              />
            </div>
          </div>
        </SCardContent>
      </SCard>
    </section>

    <!-- Cart Example -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Shopping Cart Example</h2>
      <SCard variant="outlined">
        <SCardHeader>
          <h3 class="font-semibold text-(--s-text-primary)">Persistent Cart</h3>
          <p class="text-sm text-(--s-text-secondary)">Cart persists across page reloads</p>
        </SCardHeader>
        <SCardContent class="space-y-4">
          <div class="flex flex-wrap gap-2">
            <SButton size="small" @click="addToCart(1, 'Widget A')">Add Widget A</SButton>
            <SButton size="small" @click="addToCart(2, 'Widget B')">Add Widget B</SButton>
            <SButton size="small" @click="addToCart(3, 'Widget C')">Add Widget C</SButton>
            <SButton variant="outlined" size="small" @click="clearCart">Clear Cart</SButton>
          </div>
          
          <div v-if="cart.items.length" class="space-y-2">
            <div 
              v-for="item in cart.items" 
              :key="item.id"
              class="flex items-center justify-between p-2 rounded bg-slate-100 dark:bg-slate-800"
            >
              <span>{{ item.name }}</span>
              <span class="font-mono">x{{ item.qty }}</span>
            </div>
            <div class="text-right font-semibold">
              Total items: {{ cartTotal }}
            </div>
          </div>
          <div v-else class="text-sm text-(--s-text-secondary)">
            Cart is empty
          </div>
        </SCardContent>
      </SCard>
    </section>

    <!-- Basic Usage -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Basic Usage</h2>
      <DemoSection
        title="useLocalStorage"
        description="Create reactive values that persist to localStorage."
        :code="basicCode"
        language="typescript"
        code-only
      />
    </section>

    <!-- Session Storage -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Session Storage</h2>
      <DemoSection
        title="useSessionStorage"
        description="Session storage clears when the browser closes. Good for temporary data."
        :code="sessionCode"
        language="typescript"
        code-only
      />
    </section>

    <!-- Options -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Options</h2>
      <DemoSection
        title="Configuration"
        description="Customize storage behavior with options."
        :code="optionsCode"
        language="typescript"
        code-only
      />
    </section>

    <!-- Methods -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Return Methods</h2>
      <DemoSection
        title="Utility Methods"
        description="Additional methods for storage management."
        :code="methodsCode"
        language="typescript"
        code-only
      />
    </section>

    <!-- API Reference -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">API Reference</h2>
      
      <SApiSection title="Composables">
        <SApiTable title="Functions" :methods="composableMethods" type="methods" />
      </SApiSection>

      <div class="mt-8">
        <SApiSection title="StorageOptions">
          <SApiTable title="Properties" :props="optionsProps" type="props" />
        </SApiSection>
      </div>

      <div class="mt-8">
        <SApiSection title="Return Value">
          <SApiTable title="Properties" :props="returnProps" type="props" />
        </SApiSection>
      </div>
    </section>
  </div>
</template>
