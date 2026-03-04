<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from '../composables/useTheme'
import STableOfContents from '../components/STableOfContents.vue'

const route = useRoute()
const { theme, toggleTheme } = useTheme()

// Topic navigation
const topics = [
  { name: 'Components', href: '/ui', icon: 'puzzle', match: '/ui' },
  { name: 'Docs', href: '/docs', icon: 'book-open-variant', match: '/docs' },
  { name: 'Examples', href: '/examples/auth', icon: 'application-brackets', match: '/examples' },
]

// Current section based on route
const currentSection = computed(() => {
  if (route.path.startsWith('/docs')) return 'docs'
  if (route.path.startsWith('/examples')) return 'examples'
  return 'ui'
})

// Component navigation (for /ui)
const uiNavigation = [
  { name: 'Accordion', href: '/ui/accordion', icon: 'chevron-down-box-outline' },
  { name: 'Alerts', href: '/ui/alerts', icon: 'alert-circle-outline' },
  { name: 'Avatar', href: '/ui/avatar', icon: 'account-circle' },
  { name: 'Badges', href: '/ui/badges', icon: 'tag-multiple' },
  { name: 'Buttons', href: '/ui/buttons', icon: 'button-cursor' },
  { name: 'Card', href: '/ui/card', icon: 'card-outline' },
  { name: 'Carousel', href: '/ui/carousel', icon: 'view-carousel' },
  { name: 'Checkbox', href: '/ui/checkbox', icon: 'checkbox-marked' },
  { name: 'Chips', href: '/ui/chips', icon: 'label' },
  { name: 'Color Picker', href: '/ui/color-picker', icon: 'palette' },
  { name: 'Date Picker', href: '/ui/date-picker', icon: 'calendar' },
  { name: 'Dialog', href: '/ui/dialog', icon: 'comment-question-outline' },
  { name: 'Drawer', href: '/ui/drawer', icon: 'dock-bottom' },
  { name: 'Dropdown', href: '/ui/dropdown', icon: 'menu-down' },
  { name: 'Glass Card', href: '/ui/glass-card', icon: 'blur' },
  { name: 'Icons', href: '/ui/icons', icon: 'emoticon' },
  { name: 'Input', href: '/ui/input', icon: 'form-textbox' },
  { name: 'Modal', href: '/ui/modal', icon: 'forum-outline' },
  { name: 'OTP', href: '/ui/otp', icon: 'form-textbox-password' },
  { name: 'Pagination', href: '/ui/pagination', icon: 'page-next' },
  { name: 'Progress', href: '/ui/progress', icon: 'progress-check' },
  { name: 'Morphing Card', href: '/ui/morphing-card', icon: 'card-outline' },
  { name: 'Morphing Modal', href: '/ui/morphing-modal', icon: 'transition' },
  { name: 'Radio', href: '/ui/radio', icon: 'radiobox-marked' },
  { name: 'Select', href: '/ui/select', icon: 'form-dropdown' },
  { name: 'Switch', href: '/ui/switch', icon: 'toggle-switch' },
  { name: 'Table', href: '/ui/table', icon: 'table' },
  { name: 'Tabs', href: '/ui/tabs', icon: 'view-dashboard' },
  { name: 'Toast', href: '/ui/toast', icon: 'bell-outline' },
  { name: 'Tooltips', href: '/ui/tooltips', icon: 'tooltip-text' },
]

// Docs navigation (for /docs)
const docsNavigation = [
  { name: 'Form Validation', href: '/docs/form-validation', icon: 'check-decagram' },
  { name: 'useTheme', href: '/docs/use-theme', icon: 'palette-swatch' },
  { name: 'useClipboard', href: '/docs/use-clipboard', icon: 'content-copy' },
  { name: 'useClickOutside', href: '/docs/use-click-outside', icon: 'cursor-default-click-outline' },
  { name: 'useMediaQuery', href: '/docs/use-media-query', icon: 'responsive' },
  { name: 'useDebounce', href: '/docs/use-debounce', icon: 'timer-sand' },
  { name: 'useLocalStorage', href: '/docs/use-local-storage', icon: 'database-outline' },
  { name: 'useAsync', href: '/docs/use-async', icon: 'loading' },
  { name: 'useHotkey', href: '/docs/use-hotkey', icon: 'keyboard' },
  { name: 'useIntersectionObserver', href: '/docs/use-intersection-observer', icon: 'eye-outline' },
]

// Examples navigation (for /examples)
const examplesNavigation = [
  { name: 'Auth Form', href: '/examples/auth', icon: 'login' },
  { name: 'Project Scaffold', href: '/examples/project', icon: 'rocket-launch' },
  { name: 'Form Field', href: '/examples/form-field', icon: 'form-select' },
  { name: 'Credit Card', href: '/examples/credit-card', icon: 'credit-card-outline' },
]

// Dynamic navigation based on section
const navigation = computed(() => {
  if (currentSection.value === 'docs') return docsNavigation
  if (currentSection.value === 'examples') return examplesNavigation
  return uiNavigation
})

const getThemeIcon = () => {
  if (theme.value === 'light') return 'mdi-white-balance-sunny'
  if (theme.value === 'dark') return 'mdi-moon-waning-crescent'
  return 'mdi-monitor'
}
</script>

<template>
  <div class="h-screen bg-(--s-bg-primary) text-(--s-text-primary) flex overflow-hidden transition-colors duration-300">
    <!-- Sidebar -->
    <aside class="w-64 border-r border-(--s-border) bg-(--s-bg-primary) hidden md:flex flex-col h-full transition-colors duration-300">
      <!-- Header -->
      <div class="p-6 shrink-0 flex items-center justify-between">
        <router-link to="/ui" class="text-xl font-bold bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
          Saka-UI
        </router-link>
        <button 
          @click="toggleTheme" 
          class="p-2 rounded-lg hover:bg-(--s-bg-secondary) transition-colors text-(--s-text-secondary) hover:text-(--s-text-primary)"
          :title="'Theme: ' + theme"
        >
          <span :class="['mdi', getThemeIcon(), 'text-xl']"></span>
        </button>
      </div>

      <!-- Topic Navigation -->
      <div class="px-4 pb-3">
        <div class="flex gap-1">
          <router-link
            v-for="topic in topics"
            :key="topic.name"
            :to="topic.href"
            class="flex-1 flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-colors text-xs"
            :class="route.path.startsWith(topic.match) 
              ? 'bg-(--s-primary-alpha) text-(--s-primary) font-medium' 
              : 'text-(--s-text-secondary) hover:bg-(--s-bg-secondary) hover:text-(--s-text-primary)'"
          >
            <span :class="['mdi mdi-' + topic.icon, 'text-lg']"></span>
            {{ topic.name }}
          </router-link>
        </div>
      </div>

      <!-- Divider -->
      <div class="mx-4 border-t border-(--s-border)"></div>

      <!-- Content Navigation -->
      <nav class="flex-1 overflow-y-auto mt-3 px-4 space-y-1 pb-8">
        <router-link
          v-for="item in navigation"
          :key="item.name"
          :to="item.href"
          class="flex items-center gap-3 px-2 py-0.5 rounded-lg transition-colors"
          active-class="bg-(--s-primary-alpha) text-(--s-primary) font-medium"
          inactive-class="text-(--s-text-secondary) hover:bg-(--s-bg-secondary) hover:text-(--s-text-primary)"
        >
          <span :class="['mdi mdi-' + item.icon, 'text-lg']"></span>
          {{ item.name }}
        </router-link>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto overscroll-contain bg-(--s-bg-secondary) transition-colors duration-300">
      <div class="p-8 w-full">
        <div class="max-w-7xl mx-auto flex gap-8">
          <!-- Page content -->
          <div class="flex-1 min-w-0">
            <router-view />
          </div>
          
          <!-- Table of Contents sidebar -->
          <STableOfContents />
        </div>
      </div>
    </main>
  </div>
</template>
