<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  SButton, SCard, SCardContent, SCardHeader, SApiSection, SApiTable, SInput
} from '../../index'
import { useDebounce, useDebounceFn, useThrottle, useThrottleFn } from '../../composables/useDebounce'
import type { ApiProp, ApiMethod } from '../../index'
import DemoSection from '../../components/DemoSection.vue'

// Demo: Debounced value
const searchTerm = ref('')
const { value: debouncedSearch, isPending } = useDebounce(searchTerm, 500)
const searchResults = ref<string[]>([])

watch(debouncedSearch, (value) => {
  if (value) {
    searchResults.value = [
      `Result for "${value}" 1`,
      `Result for "${value}" 2`,
      `Result for "${value}" 3`
    ]
  } else {
    searchResults.value = []
  }
})

// Demo: Debounced function
const clickCount = ref(0)
const debouncedClickCount = ref(0)

const debouncedIncrement = useDebounceFn(() => {
  debouncedClickCount.value = clickCount.value
}, 1000)

function handleClick() {
  clickCount.value++
  debouncedIncrement()
}

// Demo: Throttled value
const sliderValue = ref(50)
const { value: throttledSlider } = useThrottle(sliderValue, 200)
const throttleUpdateCount = ref(0)

watch(throttledSlider, () => {
  throttleUpdateCount.value++
})

// Demo: Throttled function
const scrollPosition = ref(0)
const throttledScrollUpdates = ref(0)

const throttledScrollHandler = useThrottleFn(() => {
  throttledScrollUpdates.value++
}, 100)

function simulateScroll() {
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      scrollPosition.value = i * 10
      throttledScrollHandler()
    }, i * 20)
  }
}

// Code examples
const debounceValueCode = `import { ref, watch } from 'vue'
import { useDebounce } from '@sakoa/ui'

const searchTerm = ref('')
const { value: debouncedSearch, isPending } = useDebounce(searchTerm, 500)

// Debounced value updates 500ms after last change
watch(debouncedSearch, (value) => {
  fetchSearchResults(value)
})`

const debounceFnCode = `import { useDebounceFn } from '@sakoa/ui'

const debouncedSave = useDebounceFn(() => {
  saveToServer()
}, 1000)

// Only executes once after 1 second of inactivity
debouncedSave()
debouncedSave()
debouncedSave() // Only this triggers the save`

const throttleValueCode = `import { ref } from 'vue'
import { useThrottle } from '@sakoa/ui'

const scrollY = ref(0)
const { value: throttledScroll } = useThrottle(scrollY, 100)

// Updates at most every 100ms
window.addEventListener('scroll', () => {
  scrollY.value = window.scrollY
})`

const throttleFnCode = `import { useThrottleFn } from '@sakoa/ui'

const throttledLog = useThrottleFn(() => {
  console.log('Throttled!')
}, 1000, { leading: true, trailing: false })

// Executes immediately, then ignores calls for 1 second`

const optionsCode = `// Debounce with max wait
const { value } = useDebounce(input, 500, {
  maxWait: 2000 // Force update after 2 seconds
})

// Immediate execution then debounce
const debouncedFn = useDebounceFn(fn, 500, {
  immediate: true
})

// Throttle options
const { value } = useThrottle(input, 100, {
  leading: true,   // Execute on leading edge
  trailing: false  // Don't execute on trailing edge
})`

// API Tables
const debounceMethodsTable: ApiMethod[] = [
  { name: 'useDebounce(value, delay?, options?)', description: 'Create a debounced reactive value' },
  { name: 'useDebounceFn(fn, delay?, options?)', description: 'Create a debounced function' },
  { name: 'useThrottle(value, delay?, options?)', description: 'Create a throttled reactive value' },
  { name: 'useThrottleFn(fn, delay?, options?)', description: 'Create a throttled function' }
]

const debounceOptionsProps: ApiProp[] = [
  { name: 'immediate', type: 'boolean', default: 'false', description: 'Execute immediately on first call' },
  { name: 'maxWait', type: 'number', default: 'undefined', description: 'Maximum time to wait before forcing execution' }
]

const throttleOptionsProps: ApiProp[] = [
  { name: 'leading', type: 'boolean', default: 'true', description: 'Execute on the leading edge' },
  { name: 'trailing', type: 'boolean', default: 'true', description: 'Execute on the trailing edge' }
]

const returnProps: ApiProp[] = [
  { name: 'value', type: 'Ref<T>', description: 'The debounced/throttled value' },
  { name: 'cancel', type: '() => void', description: 'Cancel any pending update' },
  { name: 'flush', type: '() => void', description: 'Immediately apply pending value (debounce only)' },
  { name: 'isPending', type: 'Ref<boolean>', description: 'Whether there is a pending update' }
]
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-(--s-text-primary) mb-2">useDebounce / useThrottle</h1>
      <p class="text-lg text-(--s-text-secondary)">
        Debounce and throttle composables for values and callbacks. Essential for search inputs, scroll handlers, and performance optimization.
      </p>
    </header>

    <!-- Debounced Search Demo -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Debounced Search</h2>
      <SCard variant="outlined">
        <SCardHeader>
          <h3 class="font-semibold text-(--s-text-primary)">Live Demo - Type to Search</h3>
        </SCardHeader>
        <SCardContent class="space-y-4">
          <SInput 
            v-model="searchTerm" 
            placeholder="Type to search (500ms debounce)..."
            class="w-full"
          />
          <div class="flex items-center gap-4 text-sm">
            <span class="text-(--s-text-secondary)">
              Input: <code class="text-(--s-text-primary)">{{ searchTerm || '(empty)' }}</code>
            </span>
            <span class="text-(--s-text-secondary)">
              Debounced: <code class="text-(--s-text-primary)">{{ debouncedSearch || '(empty)' }}</code>
            </span>
            <span v-if="isPending" class="text-amber-500 animate-pulse">
              Waiting...
            </span>
          </div>
          <ul v-if="searchResults.length" class="space-y-1">
            <li 
              v-for="result in searchResults" 
              :key="result"
              class="px-3 py-2 rounded bg-slate-100 dark:bg-slate-800 text-sm"
            >
              {{ result }}
            </li>
          </ul>
        </SCardContent>
      </SCard>
    </section>

    <!-- Debounce Value Code -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Debounce Value</h2>
      <DemoSection
        title="useDebounce"
        description="Debounce a reactive value - updates after the delay when the source stops changing."
        :code="debounceValueCode"
        language="typescript"
        code-only
      />
    </section>

    <!-- Debounced Function Demo -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Debounced Function</h2>
      <DemoSection
        title="useDebounceFn"
        description="Create a debounced callback that only executes after inactivity."
        :code="debounceFnCode"
        language="typescript"
      >
        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <SButton @click="handleClick">
              Click Me Fast!
            </SButton>
            <span class="text-sm text-(--s-text-secondary)">
              Raw clicks: <strong>{{ clickCount }}</strong>
            </span>
            <span class="text-sm text-(--s-text-secondary)">
              Debounced value: <strong>{{ debouncedClickCount }}</strong>
            </span>
          </div>
          <p class="text-sm text-(--s-text-secondary)">
            Click rapidly - the debounced value updates 1 second after you stop clicking.
          </p>
        </div>
      </DemoSection>
    </section>

    <!-- Throttle Value Code -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Throttle Value</h2>
      <DemoSection
        title="useThrottle"
        description="Throttle a reactive value - updates at most once per interval."
        :code="throttleValueCode"
        language="typescript"
      >
        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <input 
              type="range" 
              v-model.number="sliderValue" 
              min="0" 
              max="100"
              class="flex-1"
            />
            <span class="text-sm text-(--s-text-secondary) w-32">
              Raw: {{ sliderValue }} | Throttled: {{ throttledSlider }}
            </span>
          </div>
          <p class="text-sm text-(--s-text-secondary)">
            Drag the slider quickly. Throttled value updates at most every 200ms.
            <br />
            Update count: <strong>{{ throttleUpdateCount }}</strong>
          </p>
        </div>
      </DemoSection>
    </section>

    <!-- Throttled Function Demo -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Throttled Function</h2>
      <DemoSection
        title="useThrottleFn"
        description="Create a throttled callback that limits execution frequency."
        :code="throttleFnCode"
        language="typescript"
      >
        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <SButton @click="simulateScroll">
              Simulate 50 Scroll Events
            </SButton>
            <span class="text-sm text-(--s-text-secondary)">
              Scroll position: {{ scrollPosition }}
            </span>
            <span class="text-sm text-(--s-text-secondary)">
              Throttled updates: <strong>{{ throttledScrollUpdates }}</strong> / 50
            </span>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Options -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Options</h2>
      <DemoSection
        title="Configuration"
        description="Customize debounce and throttle behavior with options."
        :code="optionsCode"
        language="typescript"
        code-only
      />
    </section>

    <!-- API Reference -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">API Reference</h2>
      
      <SApiSection title="Composables">
        <SApiTable title="Functions" :methods="debounceMethodsTable" type="methods" />
      </SApiSection>

      <div class="mt-8">
        <SApiSection title="DebounceOptions">
          <SApiTable title="Properties" :props="debounceOptionsProps" type="props" />
        </SApiSection>
      </div>

      <div class="mt-8">
        <SApiSection title="ThrottleOptions">
          <SApiTable title="Properties" :props="throttleOptionsProps" type="props" />
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
