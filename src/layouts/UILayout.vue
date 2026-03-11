<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from '../composables/useTheme'
import STableOfContents from '../components/STableOfContents.vue'
import SCustomizer from '../components/SCustomizer.vue'
import SSiteSearch from '../components/SSiteSearch.vue'
import { docsNavigation, examplesNavigation, githubRepoUrl, topics, uiNavigation } from '../data/siteNavigation'

const route = useRoute()
const { theme, toggleTheme } = useTheme()

// Current section based on route
const currentSection = computed(() => {
  if (route.path.startsWith('/docs')) return 'docs'
  if (route.path.startsWith('/examples')) return 'examples'
  return 'ui'
})

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
  <div class="h-screen bg-background text-foreground flex flex-col overflow-hidden transition-colors duration-300">
    <!-- Top Navigation Bar -->
    <header class="h-auto shrink-0 border-b border-border bg-card shadow-sm px-4 py-3 transition-colors duration-300 md:h-14 md:px-6 md:py-0">
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
      <!-- Logo -->
        <router-link to="/ui" class="text-xl font-bold bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
          Saka-UI
        </router-link>

      <!-- Section Links -->
        <nav class="flex flex-wrap items-center gap-1">
          <router-link
            v-for="topic in topics"
            :key="topic.name"
            :to="topic.href"
            class="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm"
            :class="route.path.startsWith(topic.match ?? topic.href)
              ? 'bg-primary/15 text-primary font-medium'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'"
          >
            <span :class="['mdi mdi-' + topic.icon, 'text-base']"></span>
            {{ topic.name }}
          </router-link>
        </nav>

        <div class="md:flex-1"></div>

        <div class="flex items-center gap-1.5">
          <SSiteSearch />

          <a
            :href="githubRepoUrl"
            target="_blank"
            rel="noreferrer"
            class="p-2 rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Open the GitHub repository"
          >
            <span class="mdi mdi-github text-xl"></span>
          </a>

          <button
            @click="toggleTheme"
            class="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            :title="'Theme: ' + theme"
          >
            <span :class="['mdi', getThemeIcon(), 'text-xl']"></span>
          </button>
        </div>
      </div>
    </header>

    <!-- Sidebar + Main Content -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Sidebar -->
      <aside class="w-64 border-r border-border bg-card hidden md:flex flex-col transition-colors duration-300">
        <nav class="flex-1 overflow-y-auto pt-4 px-4 space-y-1 pb-8">
          <router-link
            v-for="item in navigation"
            :key="item.name"
            :to="item.href"
            class="flex items-center gap-3 px-2 py-0.5 rounded-lg transition-colors"
            active-class="bg-primary/15 text-primary font-medium"
            inactive-class="text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <span :class="['mdi mdi-' + item.icon, 'text-lg']"></span>
            {{ item.name }}
          </router-link>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto overscroll-contain bg-background transition-colors duration-300">
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

    <!-- Global Customizer -->
    <SCustomizer />
  </div>
</template>
