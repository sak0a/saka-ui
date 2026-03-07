<script setup lang="ts">
import { SApiSection } from '../../index'
import DemoSection from '../../components/DemoSection.vue'

const installCode = `# Using bun
bun add @sakoa/ui

# Using npm
npm install @sakoa/ui`

const initCode = `npx saka-ui init`

const configCode = `{
  "componentDir": "src/components/ui",
  "composableDir": "src/composables",
  "libDir": "src/lib",
  "typescript": true,
  "overwrite": false
}`

const addCode = `# Add a single component
npx saka-ui add button

# Add multiple components
npx saka-ui add button input select`

const listCode = `npx saka-ui list`

const diffCode = `npx saka-ui diff button`

const npmUsageCode = `<script setup lang="ts">
import { SButton } from '@sakoa/ui'
<\/script>

<template>
  <SButton variant="filled">Click me</SButton>
  <SButton variant="outlined" color="#6366f1">Outlined</SButton>
</template>`

const cliUsageCode = `<script setup lang="ts">
// After running: npx saka-ui add button
import SButton from '~/components/ui/SButton.vue'
<\/script>

<template>
  <SButton variant="filled">Click me</SButton>
  <SButton variant="outlined" color="#6366f1">Outlined</SButton>
</template>`
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-12">
    <!-- Page Header -->
    <div>
      <h1 class="text-4xl font-bold text-foreground mb-3">Getting Started</h1>
      <p class="text-lg text-muted-foreground">
        Everything you need to start building with Saka UI — install, configure, and use components in minutes.
      </p>
    </div>

    <!-- Installation -->
    <SApiSection title="Installation" id="installation">
      <div class="space-y-4 text-muted-foreground">
        <p>
          Install Saka UI via your preferred package manager:
        </p>
      </div>
    </SApiSection>

    <DemoSection title="Install Package" :code="installCode" language="bash" code-only />

    <SApiSection title="Peer Dependencies" id="peer-dependencies">
      <div class="space-y-4 text-muted-foreground">
        <p>
          Saka UI requires the following peer dependencies in your project:
        </p>
        <div class="bg-accent rounded-lg p-4 font-mono text-sm text-foreground space-y-1">
          <div>vue <span class="text-muted-foreground">^3.0.0</span></div>
          <div>tailwindcss <span class="text-muted-foreground">^4.0.0</span></div>
        </div>
      </div>
    </SApiSection>

    <!-- CLI Setup -->
    <SApiSection title="CLI Setup" id="cli-setup">
      <div class="space-y-4 text-muted-foreground">
        <p>
          Saka UI provides a CLI that copies component source files directly into your project.
          This gives you full ownership of the code — you can modify components to fit your needs.
        </p>
        <p>
          Start by initializing the configuration file:
        </p>
      </div>
    </SApiSection>

    <DemoSection title="Initialize Config" :code="initCode" language="bash" code-only description="Creates a saka-ui.json config file in your project root." />

    <SApiSection title="Configuration Options" id="configuration-options">
      <p class="text-muted-foreground mb-4">
        The generated <code class="text-xs bg-accent px-1 py-0.5 rounded">saka-ui.json</code> file supports the following options:
      </p>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-border">
              <th class="text-left py-3 px-2 text-foreground font-semibold">Option</th>
              <th class="text-left py-3 px-2 text-foreground font-semibold">Default</th>
              <th class="text-left py-3 px-2 text-foreground font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-border/50">
              <td class="py-2.5 px-2 font-mono text-xs text-foreground">componentDir</td>
              <td class="py-2.5 px-2 font-mono text-xs text-muted-foreground">src/components/ui</td>
              <td class="py-2.5 px-2 text-muted-foreground">Where component files are placed</td>
            </tr>
            <tr class="border-b border-border/50">
              <td class="py-2.5 px-2 font-mono text-xs text-foreground">composableDir</td>
              <td class="py-2.5 px-2 font-mono text-xs text-muted-foreground">src/composables</td>
              <td class="py-2.5 px-2 text-muted-foreground">Where composable files are placed</td>
            </tr>
            <tr class="border-b border-border/50">
              <td class="py-2.5 px-2 font-mono text-xs text-foreground">libDir</td>
              <td class="py-2.5 px-2 font-mono text-xs text-muted-foreground">src/lib</td>
              <td class="py-2.5 px-2 text-muted-foreground">Where utility files (e.g. cn) are placed</td>
            </tr>
            <tr class="border-b border-border/50">
              <td class="py-2.5 px-2 font-mono text-xs text-foreground">typescript</td>
              <td class="py-2.5 px-2 font-mono text-xs text-muted-foreground">true</td>
              <td class="py-2.5 px-2 text-muted-foreground">Generate TypeScript or JavaScript files</td>
            </tr>
            <tr class="border-b border-border/50">
              <td class="py-2.5 px-2 font-mono text-xs text-foreground">overwrite</td>
              <td class="py-2.5 px-2 font-mono text-xs text-muted-foreground">false</td>
              <td class="py-2.5 px-2 text-muted-foreground">Overwrite existing files when adding components</td>
            </tr>
          </tbody>
        </table>
      </div>
    </SApiSection>

    <DemoSection title="Example Config" :code="configCode" language="json" code-only />

    <SApiSection title="CLI Commands" id="cli-commands">
      <p class="text-muted-foreground mb-4">
        Use these commands to manage components in your project:
      </p>
    </SApiSection>

    <DemoSection title="Add Components" :code="addCode" language="bash" code-only description="Copies component source files into your project based on your saka-ui.json config." />
    <DemoSection title="List Available Components" :code="listCode" language="bash" code-only description="Shows all components available in the Saka UI registry." />
    <DemoSection title="Diff Local Changes" :code="diffCode" language="bash" code-only description="Compares your local component files against the registry to see what you have changed." />

    <!-- Distribution Modes -->
    <SApiSection title="Distribution Modes" id="distribution-modes">
      <div class="space-y-4 text-muted-foreground">
        <p>
          Saka UI supports two ways to use components in your project:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-muted rounded-xl p-4 border border-border">
            <div class="font-semibold text-foreground mb-1">npm Package Import</div>
            <p class="text-sm">
              Import components directly from <code class="text-xs bg-accent px-1 py-0.5 rounded">@sakoa/ui</code>.
              Quick setup, automatic updates, but limited customization of component internals.
            </p>
          </div>
          <div class="bg-muted rounded-xl p-4 border border-border">
            <div class="font-semibold text-foreground mb-1">CLI Copy-Paste (Own the Code)</div>
            <p class="text-sm">
              Use <code class="text-xs bg-accent px-1 py-0.5 rounded">npx saka-ui add</code> to copy component source files into your project.
              Full control to modify, extend, or restyle any component.
            </p>
          </div>
        </div>
      </div>
    </SApiSection>

    <!-- Quick Start -->
    <SApiSection title="Quick Start" id="quick-start">
      <p class="text-muted-foreground mb-4">
        Here is a simple example using the SButton component with both distribution modes:
      </p>
    </SApiSection>

    <DemoSection title="npm Package Import" :code="npmUsageCode" language="vue" code-only description="Import components directly from the @sakoa/ui package." />
    <DemoSection title="CLI Copy-Paste" :code="cliUsageCode" language="vue" code-only description="Import from your local project after adding with the CLI." />
  </div>
</template>
