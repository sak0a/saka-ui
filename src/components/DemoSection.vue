<script setup lang="ts">
import { ref, computed, useSlots } from 'vue'
import { cn } from '~/lib/utils'

defineOptions({ inheritAttrs: false })
import hljs from 'highlight.js/lib/core'
import xml from 'highlight.js/lib/languages/xml'
import javascript from 'highlight.js/lib/languages/javascript'
import css from 'highlight.js/lib/languages/css'
import 'highlight.js/styles/atom-one-dark.css'

// Register languages
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('css', css)
// Alias vue to xml
hljs.registerLanguage('vue', xml)

interface Props {
  title: string
  description?: string
  code: string
  language?: string
  customBackground?: string
  codeOnly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  description: '',
  language: 'markup',
  customBackground: '',
  codeOnly: false
})

const slots = useSlots()
const hasSlotContent = computed(() => !!slots.default)

// Show code by default if codeOnly mode
const isCodeVisible = ref(props.codeOnly)

const highlightedCode = computed(() => {
  // Map language if needed, e.g. vue -> xml is handled by alias or manually
  const lang = props.language
  if (lang && hljs.getLanguage(lang)) {
    return hljs.highlight(props.code, { language: lang }).value
  }
  return hljs.highlightAuto(props.code).value
})

const toggleCode = () => {
  isCodeVisible.value = !isCodeVisible.value
}

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(props.code)
    // You could add a toast notification here
    console.log('Code copied to clipboard!')
  } catch (err) {
    console.error('Failed to copy code:', err)
  }
}
</script>

<template>
  <div v-bind="$attrs" :class="cn('bg-muted rounded-2xl border border-border transition-all duration-300')">
    <!-- Header with title and actions -->
    <div class="flex items-start justify-between p-5 pb-0">
      <div class="flex-1">
        <div class="text-lg font-semibold text-foreground mb-1">{{ title }}</div>
        <p v-if="description" class="text-sm text-muted-foreground mb-4">{{ description }}</p>
      </div>
      
      <!-- Action buttons -->
      <div class="flex items-center gap-2 ml-4">
        <button 
          class="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
          title="Open in sandbox"
        >
          <span class="mdi mdi-cube-outline text-lg"></span>
        </button>
        <button 
          class="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
          title="Edit"
        >
          <span class="mdi mdi-pencil text-lg"></span>
        </button>
        <button 
          @click="copyCode"
          class="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
          title="Copy code"
        >
          <span class="mdi mdi-content-copy text-lg"></span>
        </button>
        <button 
          @click="toggleCode"
          :class="isCodeVisible ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent'"
          class="p-2 rounded-lg transition-colors"
          title="Show code"
        >
          <span class="mdi mdi-code-tags text-lg"></span>
        </button>
      </div>
    </div>
 
    <!-- Demo content slot (only render if has content and not codeOnly) -->
    <div v-if="hasSlotContent && !codeOnly" class="p-5">
      <div :class="[
        'rounded-xl p-6 transition-colors duration-300',
        customBackground || 'bg-background'
      ]">
        <slot />
      </div>
    </div>
 
    <!-- Expandable code panel -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="max-h-0 opacity-0"
      enter-to-class="max-h-[600px] opacity-100"
      leave-from-class="max-h-[600px] opacity-100"
      leave-to-class="max-h-0 opacity-0"
    >
      <div v-show="isCodeVisible" class="border-t border-border overflow-hidden transition-colors duration-300">
        <div class="bg-accent p-6 overflow-x-auto">
          <!-- hljs class added automatically by low-level, but we add it here for styling safety -->
          <pre class="text-sm font-mono"><code class="hljs bg-transparent" v-html="highlightedCode"></code></pre>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* Smooth transitions for code panel */
.transition-all {
  transition-property: all;
}

/* Code styling */
:deep(.hljs) {
  background: transparent !important;
  padding: 0;
  font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
  line-height: 1.6;
}
</style>
