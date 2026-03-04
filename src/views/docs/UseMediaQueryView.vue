<script setup lang="ts">
import {
  SButton, SCard, SCardContent, SCardHeader, SApiSection, SApiTable
} from '../../index'
import { 
  useMediaQuery, 
  useMediaQueries, 
  useBreakpoints, 
  useBreakpoint,
  breakpoints 
} from '../../composables/useMediaQuery'
import type { ApiProp, ApiMethod } from '../../index'
import DemoSection from '../../components/DemoSection.vue'

// Demo: Single query
const isMobile = useMediaQuery('(max-width: 768px)')
const isDark = useMediaQuery(breakpoints.dark)
const prefersReducedMotion = useMediaQuery(breakpoints.reducedMotion)

// Demo: Multiple queries
const screens = useMediaQueries({
  isXs: '(max-width: 480px)',
  isSm: '(max-width: 640px)',
  isMd: '(max-width: 768px)',
  isLg: '(max-width: 1024px)',
  isXl: '(max-width: 1280px)'
})

// Demo: Predefined breakpoints helper
const { isMobile: isMobileDevice, isTablet, isDesktop, isTouch, prefersReducedMotion: prefersMotion } = useBreakpoints()

// Demo: Single breakpoint
const isLandscape = useBreakpoint('landscape')

// Code examples
const basicCode = `import { useMediaQuery } from 'saka-ui'

// Single query
const isMobile = useMediaQuery('(max-width: 768px)')

// In template
<MobileNav v-if="isMobile" />
<DesktopNav v-else />`

const multipleCode = `import { useMediaQueries } from 'saka-ui'

const { isMobile, isTablet, isDesktop } = useMediaQueries({
  isMobile: '(max-width: 767px)',
  isTablet: '(min-width: 768px) and (max-width: 1023px)',
  isDesktop: '(min-width: 1024px)'
})

// Each is a reactive ref
console.log(isMobile.value)  // boolean`

const breakpointsCode = `import { useBreakpoints, useBreakpoint, breakpoints } from 'saka-ui'

// Use the helper with common breakpoints
const { isMobile, isTablet, isDesktop, isDark } = useBreakpoints()

// Or use a single predefined breakpoint
const isLandscape = useBreakpoint('landscape')
const prefersReducedMotion = useBreakpoint('reducedMotion')

// Access predefined queries
console.log(breakpoints.dark)  // '(prefers-color-scheme: dark)'
console.log(breakpoints.touch) // '(hover: none) and (pointer: coarse)'`

const ssrCode = `// SSR-safe by default
// Returns false during SSR, then updates on mount

const isMobile = useMediaQuery('(max-width: 768px)')
// isMobile.value is false during SSR
// Updates to correct value after hydration`

// API Tables
const composableMethods: ApiMethod[] = [
  { name: 'useMediaQuery(query)', description: 'Create a reactive ref for a single media query' },
  { name: 'useMediaQueries(queries)', description: 'Create reactive refs for multiple media queries' },
  { name: 'useBreakpoints()', description: 'Get common responsive breakpoints (isMobile, isTablet, isDesktop, etc.)' },
  { name: 'useBreakpoint(key)', description: 'Use a single predefined breakpoint by key' }
]

const breakpointKeys: ApiProp[] = [
  { name: 'xs', type: 'string', default: "'(max-width: 480px)'", description: 'Extra small devices' },
  { name: 'sm', type: 'string', default: "'(max-width: 640px)'", description: 'Small devices' },
  { name: 'md', type: 'string', default: "'(max-width: 768px)'", description: 'Medium devices (tablets)' },
  { name: 'lg', type: 'string', default: "'(max-width: 1024px)'", description: 'Large devices (desktops)' },
  { name: 'xl', type: 'string', default: "'(max-width: 1280px)'", description: 'Extra large devices' },
  { name: '2xl', type: 'string', default: "'(max-width: 1536px)'", description: '2x Extra large devices' },
  { name: 'dark', type: 'string', default: "'(prefers-color-scheme: dark)'", description: 'Prefers dark mode' },
  { name: 'light', type: 'string', default: "'(prefers-color-scheme: light)'", description: 'Prefers light mode' },
  { name: 'reducedMotion', type: 'string', default: "'(prefers-reduced-motion: reduce)'", description: 'Prefers reduced motion' },
  { name: 'portrait', type: 'string', default: "'(orientation: portrait)'", description: 'Portrait orientation' },
  { name: 'landscape', type: 'string', default: "'(orientation: landscape)'", description: 'Landscape orientation' },
  { name: 'touch', type: 'string', default: "'(hover: none) and (pointer: coarse)'", description: 'Touch device' },
  { name: 'mouse', type: 'string', default: "'(hover: hover) and (pointer: fine)'", description: 'Mouse/pointer device' },
  { name: 'retina', type: 'string', default: "'(-webkit-min-device-pixel-ratio: 2)...'", description: 'High resolution display' }
]
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-(--s-text-primary) mb-2">useMediaQuery</h1>
      <p class="text-lg text-(--s-text-secondary)">
        Reactive media query composable for responsive design. SSR-safe with predefined breakpoints.
      </p>
    </header>

    <!-- Live Status -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Live Status</h2>
      <SCard variant="outlined">
        <SCardHeader>
          <h3 class="font-semibold text-(--s-text-primary)">Current Viewport Info</h3>
        </SCardHeader>
        <SCardContent>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- Device Type -->
            <div class="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
              <div class="text-sm text-(--s-text-secondary) mb-1">Device Type</div>
              <div class="font-semibold text-(--s-text-primary)">
                <span v-if="isMobileDevice" class="text-blue-500">Mobile</span>
                <span v-else-if="isTablet" class="text-purple-500">Tablet</span>
                <span v-else-if="isDesktop" class="text-emerald-500">Desktop</span>
              </div>
            </div>

            <!-- Screen Size -->
            <div class="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
              <div class="text-sm text-(--s-text-secondary) mb-1">Screen Size</div>
              <div class="font-semibold text-(--s-text-primary)">
                <span v-if="screens.isXs" class="text-red-500">XS</span>
                <span v-else-if="screens.isSm" class="text-orange-500">SM</span>
                <span v-else-if="screens.isMd" class="text-amber-500">MD</span>
                <span v-else-if="screens.isLg" class="text-lime-500">LG</span>
                <span v-else-if="screens.isXl" class="text-teal-500">XL</span>
                <span v-else class="text-cyan-500">2XL+</span>
              </div>
            </div>

            <!-- Color Scheme -->
            <div class="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
              <div class="text-sm text-(--s-text-secondary) mb-1">Color Scheme</div>
              <div class="font-semibold">
                <span :class="isDark ? 'text-indigo-400' : 'text-amber-500'">
                  {{ isDark ? 'Dark Mode' : 'Light Mode' }}
                </span>
              </div>
            </div>

            <!-- Orientation -->
            <div class="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
              <div class="text-sm text-(--s-text-secondary) mb-1">Orientation</div>
              <div class="font-semibold text-(--s-text-primary)">
                {{ isLandscape ? 'Landscape' : 'Portrait' }}
              </div>
            </div>

            <!-- Input Type -->
            <div class="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
              <div class="text-sm text-(--s-text-secondary) mb-1">Input Type</div>
              <div class="font-semibold text-(--s-text-primary)">
                {{ isTouch ? 'Touch' : 'Mouse/Pointer' }}
              </div>
            </div>

            <!-- Motion Preference -->
            <div class="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
              <div class="text-sm text-(--s-text-secondary) mb-1">Motion Preference</div>
              <div class="font-semibold text-(--s-text-primary)">
                {{ prefersReducedMotion ? 'Reduced Motion' : 'Normal' }}
              </div>
            </div>
          </div>
        </SCardContent>
      </SCard>
    </section>

    <!-- Basic Usage -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Basic Usage</h2>
      <DemoSection
        title="Single Query"
        description="Create a reactive ref that tracks a media query."
        :code="basicCode"
        language="typescript"
      >
        <div class="flex items-center gap-4 flex-wrap">
          <div 
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-all',
              isMobile 
                ? 'bg-blue-500 text-white' 
                : 'bg-slate-200 dark:bg-slate-700 text-(--s-text-secondary)'
            ]"
          >
            Mobile: {{ isMobile ? 'Yes' : 'No' }}
          </div>
          <div 
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-all',
              !isMobile 
                ? 'bg-emerald-500 text-white' 
                : 'bg-slate-200 dark:bg-slate-700 text-(--s-text-secondary)'
            ]"
          >
            Desktop: {{ !isMobile ? 'Yes' : 'No' }}
          </div>
        </div>
        <p class="mt-4 text-sm text-(--s-text-secondary)">
          Resize your browser window to see the values change.
        </p>
      </DemoSection>
    </section>

    <!-- Multiple Queries -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Multiple Queries</h2>
      <DemoSection
        title="Query Object"
        description="Create multiple reactive queries at once."
        :code="multipleCode"
        language="typescript"
      >
        <div class="flex flex-wrap gap-2">
          <div 
            v-for="(value, key) in screens" 
            :key="key"
            :class="[
              'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
              value 
                ? 'bg-emerald-500 text-white' 
                : 'bg-slate-200 dark:bg-slate-700 text-(--s-text-secondary)'
            ]"
          >
            {{ key }}: {{ value ? '✓' : '✗' }}
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Predefined Breakpoints -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Predefined Breakpoints</h2>
      <DemoSection
        title="Built-in Helpers"
        description="Use predefined breakpoints for common scenarios."
        :code="breakpointsCode"
        language="typescript"
        code-only
      />
    </section>

    <!-- SSR Safety -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">SSR Safety</h2>
      <DemoSection
        title="Server-Side Rendering"
        description="The composable is SSR-safe and won't throw errors on the server."
        :code="ssrCode"
        language="typescript"
        code-only
      />
    </section>

    <!-- Responsive Component Example -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Responsive Component</h2>
      <SCard variant="outlined">
        <SCardHeader>
          <h3 class="font-semibold text-(--s-text-primary)">Adaptive Layout</h3>
        </SCardHeader>
        <SCardContent>
          <div 
            :class="[
              'p-6 rounded-lg transition-all duration-300',
              isMobileDevice ? 'bg-blue-100 dark:bg-blue-900/30' : 
              isTablet ? 'bg-purple-100 dark:bg-purple-900/30' : 
              'bg-emerald-100 dark:bg-emerald-900/30'
            ]"
          >
            <div class="flex items-center gap-3 mb-4">
              <span class="text-3xl">
                {{ isMobileDevice ? '📱' : isTablet ? '📱' : '🖥️' }}
              </span>
              <div>
                <h4 class="font-semibold text-(--s-text-primary)">
                  {{ isMobileDevice ? 'Mobile Layout' : isTablet ? 'Tablet Layout' : 'Desktop Layout' }}
                </h4>
                <p class="text-sm text-(--s-text-secondary)">
                  This component adapts based on viewport size
                </p>
              </div>
            </div>
            
            <div :class="isMobileDevice ? 'space-y-2' : 'flex gap-2 flex-wrap'">
              <SButton :size="isMobileDevice ? 'small' : 'medium'" class="w-full sm:w-auto">
                Action 1
              </SButton>
              <SButton :size="isMobileDevice ? 'small' : 'medium'" variant="outlined" class="w-full sm:w-auto">
                Action 2
              </SButton>
              <SButton v-if="!isMobileDevice" :size="isMobileDevice ? 'small' : 'medium'" variant="ghost">
                More Options
              </SButton>
            </div>
          </div>
        </SCardContent>
      </SCard>
    </section>

    <!-- API Reference -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">API Reference</h2>
      
      <SApiSection title="Composables">
        <SApiTable title="Functions" :methods="composableMethods" type="methods" />
      </SApiSection>

      <div class="mt-8">
        <SApiSection title="Predefined Breakpoints">
          <SApiTable title="Keys" :props="breakpointKeys" type="props" />
        </SApiSection>
      </div>
    </section>
  </div>
</template>
