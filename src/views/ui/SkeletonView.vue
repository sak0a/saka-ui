<script setup lang="ts">
import { SSkeleton, SApiSection, SApiTable } from '../../index'
import type { ApiProp } from '../../index'
import DemoSection from '../../components/DemoSection.vue'

// Code snippets
const basicUsageCode = `<SSkeleton width="100%" height="1rem" />
<SSkeleton width="75%" height="1rem" />
<SSkeleton width="50%" height="1rem" />`

const shapesCode = `<!-- Rectangular (default) -->
<SSkeleton width="200px" height="1rem" />

<!-- Circular -->
<SSkeleton shape="circular" size="48px" />

<!-- Rounded / pill -->
<SSkeleton shape="rounded" width="120px" height="2rem" />`

const animationsCode = `<!-- Wave / shimmer (default) -->
<SSkeleton animation="wave" width="100%" height="1rem" />

<!-- Pulse (opacity fade) -->
<SSkeleton animation="pulse" width="100%" height="1rem" />

<!-- No animation -->
<SSkeleton animation="none" width="100%" height="1rem" />`

const sizesCode = `<SSkeleton height="0.5rem" />
<SSkeleton height="1rem" />
<SSkeleton height="1.5rem" />
<SSkeleton height="3rem" />`

const linesCode = `<!-- 3 lines of text -->
<SSkeleton :lines="3" height="0.875rem" />

<!-- 5 lines with custom gap -->
<SSkeleton :lines="5" height="0.75rem" lineGap="0.5rem" />`

const cardSkeletonCode = `<div class="w-80 rounded-xl border border-border bg-card p-4 space-y-4">
  <!-- Image placeholder -->
  <SSkeleton height="180px" borderRadius="0.5rem" />

  <!-- Title -->
  <SSkeleton height="1.25rem" width="70%" />

  <!-- Description lines -->
  <SSkeleton :lines="2" height="0.875rem" />

  <!-- Footer -->
  <div class="flex justify-between items-center pt-2">
    <SSkeleton width="80px" height="2rem" borderRadius="0.375rem" />
    <SSkeleton shape="circular" size="32px" />
  </div>
</div>`

const profileSkeletonCode = `<div class="flex items-center gap-4">
  <SSkeleton shape="circular" size="56px" />
  <div class="flex-1 space-y-2">
    <SSkeleton height="1rem" width="140px" />
    <SSkeleton height="0.75rem" width="200px" />
  </div>
</div>`

const listSkeletonCode = `<div class="space-y-4 w-full max-w-md">
  <div v-for="i in 4" :key="i" class="flex items-center gap-3">
    <SSkeleton shape="circular" size="40px" />
    <div class="flex-1 space-y-1.5">
      <SSkeleton height="0.875rem" :width="i % 2 === 0 ? '60%' : '80%'" />
      <SSkeleton height="0.625rem" width="40%" />
    </div>
  </div>
</div>`

const tableSkeletonCode = `<div class="w-full max-w-lg space-y-3">
  <!-- Table header -->
  <div class="flex gap-4 pb-2 border-b border-border">
    <SSkeleton height="0.75rem" width="30%" />
    <SSkeleton height="0.75rem" width="25%" />
    <SSkeleton height="0.75rem" width="20%" />
    <SSkeleton height="0.75rem" width="25%" />
  </div>
  <!-- Table rows -->
  <div v-for="i in 4" :key="i" class="flex gap-4">
    <SSkeleton height="0.875rem" width="30%" />
    <SSkeleton height="0.875rem" width="25%" />
    <SSkeleton height="0.875rem" width="20%" />
    <SSkeleton height="0.875rem" width="25%" />
  </div>
</div>`

const dashboardSkeletonCode = `<div class="w-full max-w-2xl space-y-6">
  <!-- Stats row -->
  <div class="grid grid-cols-3 gap-4">
    <div v-for="i in 3" :key="i"
      class="rounded-xl border border-border bg-card p-4 space-y-2">
      <SSkeleton height="0.75rem" width="60%" />
      <SSkeleton height="1.5rem" width="40%" />
    </div>
  </div>

  <!-- Chart area -->
  <div class="rounded-xl border border-border bg-card p-4 space-y-3">
    <SSkeleton height="1rem" width="30%" />
    <SSkeleton height="200px" borderRadius="0.5rem" />
  </div>

  <!-- Recent items -->
  <div class="rounded-xl border border-border bg-card p-4 space-y-3">
    <SSkeleton height="1rem" width="25%" />
    <div v-for="i in 3" :key="i" class="flex items-center gap-3 py-2">
      <SSkeleton shape="rounded" width="48px" height="32px" />
      <div class="flex-1 space-y-1">
        <SSkeleton height="0.875rem" width="50%" />
        <SSkeleton height="0.625rem" width="30%" />
      </div>
      <SSkeleton width="60px" height="1.5rem" borderRadius="9999px" />
    </div>
  </div>
</div>`

const formSkeletonCode = `<div class="w-full max-w-sm space-y-5">
  <!-- Label + input -->
  <div class="space-y-2">
    <SSkeleton height="0.75rem" width="80px" />
    <SSkeleton height="2.5rem" borderRadius="0.5rem" />
  </div>
  <div class="space-y-2">
    <SSkeleton height="0.75rem" width="100px" />
    <SSkeleton height="2.5rem" borderRadius="0.5rem" />
  </div>
  <div class="space-y-2">
    <SSkeleton height="0.75rem" width="120px" />
    <SSkeleton height="5rem" borderRadius="0.5rem" />
  </div>
  <!-- Button -->
  <SSkeleton height="2.5rem" width="100%" borderRadius="0.5rem" />
</div>`

// API reference
const skeletonProps: ApiProp[] = [
  { name: 'shape', type: "'rectangular' | 'circular' | 'rounded'", default: "'rectangular'", description: 'Shape of the skeleton element' },
  { name: 'animation', type: "'wave' | 'pulse' | 'none'", default: "'wave'", description: 'Animation style. Wave shows a shimmer effect, pulse fades opacity' },
  { name: 'width', type: 'string', default: "'100%'", description: 'CSS width value' },
  { name: 'height', type: 'string', default: "'1rem'", description: 'CSS height value' },
  { name: 'size', type: 'string', default: 'undefined', description: 'Shorthand for equal width and height' },
  { name: 'borderRadius', type: 'string', default: 'undefined', description: 'Custom border radius override' },
  { name: 'lines', type: 'number', default: '1', description: 'Number of skeleton lines to render (last line is shorter)' },
  { name: 'lineGap', type: 'string', default: "'0.75rem'", description: 'Gap between lines when lines > 1' },
  { name: 'skeletonClass', type: 'string', default: 'undefined', description: 'Additional CSS classes for the skeleton element' },
]
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-10 pb-16">
    <!-- @component SSkeleton -->
    <!-- @props shape, animation, width, height, size, borderRadius, lines, lineGap, skeletonClass -->
    <!-- @sections api-reference -->
    <!-- Header -->
    <div>
      <h1 class="text-4xl font-bold text-foreground mb-3">Skeleton</h1>
      <p class="text-lg text-muted-foreground max-w-2xl">
        Placeholder loading indicators that mimic the shape of content being loaded.
        Supports wave shimmer and pulse animations for a polished loading experience.
      </p>

      <!-- Features -->
      <div class="flex flex-wrap gap-2 mt-4">
        <span class="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">Wave & Pulse animations</span>
        <span class="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">Multiple shapes</span>
        <span class="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">Multi-line support</span>
        <span class="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">Composable patterns</span>
        <span class="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">Dark mode aware</span>
      </div>
    </div>

    <!-- Basic Usage -->
    <DemoSection title="Basic Usage" description="Simple skeleton lines with varying widths." :code="basicUsageCode">
      <div class="space-y-3 max-w-md">
        <SSkeleton width="100%" height="1rem" />
        <SSkeleton width="75%" height="1rem" />
        <SSkeleton width="50%" height="1rem" />
      </div>
    </DemoSection>

    <!-- Shapes -->
    <DemoSection title="Shapes" description="Rectangular, circular, and rounded/pill shapes." :code="shapesCode">
      <div class="flex items-center gap-6 flex-wrap">
        <div class="space-y-2 text-center">
          <SSkeleton width="200px" height="1rem" />
          <span class="text-xs text-muted-foreground">Rectangular</span>
        </div>
        <div class="space-y-2 text-center">
          <SSkeleton shape="circular" size="48px" />
          <span class="text-xs text-muted-foreground">Circular</span>
        </div>
        <div class="space-y-2 text-center">
          <SSkeleton shape="rounded" width="120px" height="2rem" />
          <span class="text-xs text-muted-foreground">Rounded</span>
        </div>
      </div>
    </DemoSection>

    <!-- Animations -->
    <DemoSection title="Animations" description="Choose between wave shimmer, pulse fade, or no animation." :code="animationsCode">
      <div class="space-y-4 max-w-md">
        <div class="space-y-1">
          <span class="text-xs text-muted-foreground font-medium">Wave (default)</span>
          <SSkeleton animation="wave" width="100%" height="1rem" />
        </div>
        <div class="space-y-1">
          <span class="text-xs text-muted-foreground font-medium">Pulse</span>
          <SSkeleton animation="pulse" width="100%" height="1rem" />
        </div>
        <div class="space-y-1">
          <span class="text-xs text-muted-foreground font-medium">None</span>
          <SSkeleton animation="none" width="100%" height="1rem" />
        </div>
      </div>
    </DemoSection>

    <!-- Sizes -->
    <DemoSection title="Heights" description="Different heights for various content types." :code="sizesCode">
      <div class="space-y-3 max-w-md">
        <SSkeleton height="0.5rem" />
        <SSkeleton height="1rem" />
        <SSkeleton height="1.5rem" />
        <SSkeleton height="3rem" />
      </div>
    </DemoSection>

    <!-- Multi-line -->
    <DemoSection title="Multi-line Text" description="Render multiple lines at once. The last line is automatically shorter." :code="linesCode">
      <div class="space-y-6 max-w-md">
        <div>
          <span class="text-xs text-muted-foreground font-medium mb-2 block">3 lines</span>
          <SSkeleton :lines="3" height="0.875rem" />
        </div>
        <div>
          <span class="text-xs text-muted-foreground font-medium mb-2 block">5 lines, tight gap</span>
          <SSkeleton :lines="5" height="0.75rem" lineGap="0.5rem" />
        </div>
      </div>
    </DemoSection>

    <!-- Compound: Card -->
    <h2 class="text-2xl font-bold text-foreground">Compound Patterns</h2>
    <p class="text-muted-foreground -mt-6">Compose skeletons to match your actual UI layout.</p>

    <DemoSection title="Card Skeleton" description="A typical content card loading state." :code="cardSkeletonCode">
      <div class="w-80 rounded-xl border border-border bg-card p-4 space-y-4">
        <SSkeleton height="180px" borderRadius="0.5rem" />
        <SSkeleton height="1.25rem" width="70%" />
        <SSkeleton :lines="2" height="0.875rem" />
        <div class="flex justify-between items-center pt-2">
          <SSkeleton width="80px" height="2rem" borderRadius="0.375rem" />
          <SSkeleton shape="circular" size="32px" />
        </div>
      </div>
    </DemoSection>

    <!-- Compound: Profile -->
    <DemoSection title="Profile Skeleton" description="User profile / avatar with text placeholder." :code="profileSkeletonCode">
      <div class="flex items-center gap-4">
        <SSkeleton shape="circular" size="56px" />
        <div class="flex-1 space-y-2">
          <SSkeleton height="1rem" width="140px" />
          <SSkeleton height="0.75rem" width="200px" />
        </div>
      </div>
    </DemoSection>

    <!-- Compound: List -->
    <DemoSection title="List Skeleton" description="Repeated rows for list-style content." :code="listSkeletonCode">
      <div class="space-y-4 w-full max-w-md">
        <div v-for="i in 4" :key="i" class="flex items-center gap-3">
          <SSkeleton shape="circular" size="40px" />
          <div class="flex-1 space-y-1.5">
            <SSkeleton height="0.875rem" :width="i % 2 === 0 ? '60%' : '80%'" />
            <SSkeleton height="0.625rem" width="40%" />
          </div>
        </div>
      </div>
    </DemoSection>

    <!-- Compound: Table -->
    <DemoSection title="Table Skeleton" description="Tabular data loading placeholder." :code="tableSkeletonCode">
      <div class="w-full max-w-lg space-y-3">
        <div class="flex gap-4 pb-2 border-b border-border">
          <SSkeleton height="0.75rem" width="30%" />
          <SSkeleton height="0.75rem" width="25%" />
          <SSkeleton height="0.75rem" width="20%" />
          <SSkeleton height="0.75rem" width="25%" />
        </div>
        <div v-for="i in 4" :key="i" class="flex gap-4">
          <SSkeleton height="0.875rem" width="30%" />
          <SSkeleton height="0.875rem" width="25%" />
          <SSkeleton height="0.875rem" width="20%" />
          <SSkeleton height="0.875rem" width="25%" />
        </div>
      </div>
    </DemoSection>

    <!-- Compound: Dashboard -->
    <DemoSection title="Dashboard Skeleton" description="Full dashboard layout with stats, chart, and list." :code="dashboardSkeletonCode">
      <div class="w-full max-w-2xl space-y-6">
        <div class="grid grid-cols-3 gap-4">
          <div v-for="i in 3" :key="i" class="rounded-xl border border-border bg-card p-4 space-y-2">
            <SSkeleton height="0.75rem" width="60%" />
            <SSkeleton height="1.5rem" width="40%" />
          </div>
        </div>
        <div class="rounded-xl border border-border bg-card p-4 space-y-3">
          <SSkeleton height="1rem" width="30%" />
          <SSkeleton height="200px" borderRadius="0.5rem" />
        </div>
        <div class="rounded-xl border border-border bg-card p-4 space-y-3">
          <SSkeleton height="1rem" width="25%" />
          <div v-for="i in 3" :key="i" class="flex items-center gap-3 py-2">
            <SSkeleton shape="rounded" width="48px" height="32px" />
            <div class="flex-1 space-y-1">
              <SSkeleton height="0.875rem" width="50%" />
              <SSkeleton height="0.625rem" width="30%" />
            </div>
            <SSkeleton width="60px" height="1.5rem" borderRadius="9999px" />
          </div>
        </div>
      </div>
    </DemoSection>

    <!-- Compound: Form -->
    <DemoSection title="Form Skeleton" description="Form layout with labels, inputs, and submit button." :code="formSkeletonCode">
      <div class="w-full max-w-sm space-y-5">
        <div class="space-y-2">
          <SSkeleton height="0.75rem" width="80px" />
          <SSkeleton height="2.5rem" borderRadius="0.5rem" />
        </div>
        <div class="space-y-2">
          <SSkeleton height="0.75rem" width="100px" />
          <SSkeleton height="2.5rem" borderRadius="0.5rem" />
        </div>
        <div class="space-y-2">
          <SSkeleton height="0.75rem" width="120px" />
          <SSkeleton height="5rem" borderRadius="0.5rem" />
        </div>
        <SSkeleton height="2.5rem" width="100%" borderRadius="0.5rem" />
      </div>
    </DemoSection>

    <!-- API Reference -->
    <h2 class="text-2xl font-bold text-foreground mb-6">API Reference</h2>
    <SApiSection>
      <SApiTable title="Props" type="props" :props="skeletonProps" />
    </SApiSection>
  </div>
</template>
