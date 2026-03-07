<script setup lang="ts">
import { SApiSection } from '../../index'
import DemoSection from '../../components/DemoSection.vue'

const initOutputCode = `$ npx saka-ui init

Saka UI — Project Setup

? Component directory: src/components/ui
? Composable directory: src/composables
? Lib/utils directory: src/lib
? Use TypeScript? Yes
? Overwrite existing files when adding components? No

✔ Created saka-ui.json
  Component dir: src/components/ui
  Composable dir: src/composables
  Lib dir: src/lib
  TypeScript: true

Next: run "saka-ui add button" to add your first component.`

const addExampleCode = `# Add a single component
npx saka-ui add button

# Add multiple components at once
npx saka-ui add button input select

# Skip confirmation prompt
npx saka-ui add button -y`

const addOutputCode = `$ npx saka-ui add button

Components to add:
  Button (2 files)

Composables to copy:
  useFormField.ts

? Proceed? Yes

✔ Done! Components are ready to use and edit.`

const listOutputCode = `$ npx saka-ui list

Saka UI Registry — 30 components available

  Button           A clickable button with variants ✓
  Card             A container with header and content
  Input            Text input with validation support (depends: button)
  Select           Dropdown select component
  ...

Run "saka-ui add <name>" to add a component.`

const diffOutputCode = `$ npx saka-ui diff button

--- registry/components/ui/SButton.vue    registry
+++ local/src/components/ui/SButton.vue   local
@@ -12,7 +12,7 @@
-        filled: 'bg-primary text-primary-foreground hover:brightness-110',
+        filled: 'bg-primary text-primary-foreground hover:brightness-125',`

const configCode = `{
  "componentDir": "src/components/ui",
  "composableDir": "src/composables",
  "libDir": "src/lib",
  "typescript": true,
  "overwrite": false
}`

const configOptions = [
  { option: 'componentDir', default: '"src/components/ui"', desc: 'Directory where component .vue files are copied' },
  { option: 'composableDir', default: '"src/composables"', desc: 'Directory where shared composables are copied' },
  { option: 'libDir', default: '"src/lib"', desc: 'Directory for utility files like utils.ts (cn function)' },
  { option: 'typescript', default: 'true', desc: 'Whether to use TypeScript. Auto-detected from tsconfig.json during init' },
  { option: 'overwrite', default: 'false', desc: 'Whether saka-ui add should overwrite existing files without asking' },
]
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-12">
    <!-- Page Header -->
    <div>
      <h1 class="text-4xl font-bold text-foreground mb-3">CLI</h1>
      <p class="text-lg text-muted-foreground">
        The Saka UI CLI copies component source code directly into your project. You own the code — customize it however you like.
      </p>
    </div>

    <!-- Overview -->
    <SApiSection title="Overview" id="overview">
      <div class="space-y-4 text-muted-foreground">
        <p>
          Saka UI follows the open-code model popularized by shadcn/ui. Instead of importing components from a package, the CLI copies the source files into your project. This means:
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bg-muted rounded-xl p-4 border border-border">
            <div class="font-semibold text-foreground mb-1">Full Ownership</div>
            <p class="text-sm">Every component file lives in your codebase. Modify anything freely.</p>
          </div>
          <div class="bg-muted rounded-xl p-4 border border-border">
            <div class="font-semibold text-foreground mb-1">No Lock-in</div>
            <p class="text-sm">No runtime dependency on Saka UI. Remove the CLI after adding components.</p>
          </div>
          <div class="bg-muted rounded-xl p-4 border border-border">
            <div class="font-semibold text-foreground mb-1">Smart Imports</div>
            <p class="text-sm">Import paths are rewritten to match your project's directory structure.</p>
          </div>
        </div>
      </div>
    </SApiSection>

    <!-- saka-ui init -->
    <SApiSection title="saka-ui init" id="init">
      <div class="space-y-4 text-muted-foreground">
        <p>
          Initialize your project by creating a <code class="text-xs bg-accent px-1 py-0.5 rounded">saka-ui.json</code> configuration file in the project root.
        </p>
        <div class="bg-accent rounded-lg px-4 py-3 font-mono text-sm text-foreground">
          npx saka-ui init
        </div>
        <p>
          The command will interactively prompt you for:
        </p>
        <ul class="list-disc list-inside space-y-1 text-sm">
          <li><strong class="text-foreground">Component directory</strong> — where <code class="text-xs bg-accent px-1 py-0.5 rounded">.vue</code> files are copied (default: <code class="text-xs bg-accent px-1 py-0.5 rounded">src/components/ui</code>)</li>
          <li><strong class="text-foreground">Composable directory</strong> — where shared composables are copied (default: <code class="text-xs bg-accent px-1 py-0.5 rounded">src/composables</code>)</li>
          <li><strong class="text-foreground">Lib/utils directory</strong> — where utility files like <code class="text-xs bg-accent px-1 py-0.5 rounded">utils.ts</code> are placed (default: <code class="text-xs bg-accent px-1 py-0.5 rounded">src/lib</code>)</li>
          <li><strong class="text-foreground">TypeScript</strong> — auto-detected from <code class="text-xs bg-accent px-1 py-0.5 rounded">tsconfig.json</code></li>
          <li><strong class="text-foreground">Overwrite</strong> — whether to overwrite existing files when adding components (default: no)</li>
        </ul>
        <p class="text-sm">
          If <code class="text-xs bg-accent px-1 py-0.5 rounded">saka-ui.json</code> already exists, you will be asked whether to overwrite it.
        </p>
      </div>
    </SApiSection>

    <DemoSection title="Example Output" :code="initOutputCode" language="bash" code-only />

    <!-- saka-ui add -->
    <SApiSection title="saka-ui add" id="add">
      <div class="space-y-4 text-muted-foreground">
        <p>
          Add one or more components to your project. The CLI resolves transitive dependencies automatically, so if a component depends on another, both will be added.
        </p>
        <div class="space-y-2">
          <p class="text-sm font-semibold text-foreground">What happens when you run add:</p>
          <ol class="list-decimal list-inside space-y-1 text-sm">
            <li>Validates component names against the registry</li>
            <li>Resolves all transitive dependencies</li>
            <li>Shows a summary of files to be copied and asks for confirmation</li>
            <li>Copies component files, composables, and shared lib files (e.g. <code class="text-xs bg-accent px-1 py-0.5 rounded">utils.ts</code>)</li>
            <li>Rewrites import paths based on your <code class="text-xs bg-accent px-1 py-0.5 rounded">saka-ui.json</code> config</li>
            <li>Adds provenance headers for <code class="text-xs bg-accent px-1 py-0.5 rounded">diff</code> support</li>
          </ol>
        </div>
        <p class="text-sm">
          Use the <code class="text-xs bg-accent px-1 py-0.5 rounded">-y</code> flag to skip the confirmation prompt.
        </p>
      </div>
    </SApiSection>

    <DemoSection title="Usage" :code="addExampleCode" language="bash" code-only />
    <DemoSection title="Example Output" :code="addOutputCode" language="bash" code-only />

    <!-- saka-ui list -->
    <SApiSection title="saka-ui list" id="list">
      <div class="space-y-4 text-muted-foreground">
        <p>
          Show all available components in the Saka UI registry. If you have a <code class="text-xs bg-accent px-1 py-0.5 rounded">saka-ui.json</code> config, components that are already installed in your project are marked with a checkmark.
        </p>
        <div class="bg-accent rounded-lg px-4 py-3 font-mono text-sm text-foreground">
          npx saka-ui list
        </div>
      </div>
    </SApiSection>

    <DemoSection title="Example Output" :code="listOutputCode" language="bash" code-only />

    <!-- saka-ui diff -->
    <SApiSection title="saka-ui diff" id="diff">
      <div class="space-y-4 text-muted-foreground">
        <p>
          Compare your local copy of a component against the current registry version. Shows a colored unified diff of any changes you have made. Provenance headers added during <code class="text-xs bg-accent px-1 py-0.5 rounded">add</code> are stripped before comparison for a clean diff.
        </p>
        <div class="bg-accent rounded-lg px-4 py-3 font-mono text-sm text-foreground">
          npx saka-ui diff button
        </div>
        <p class="text-sm">
          This is useful before upgrading to see what local customizations you would need to re-apply.
        </p>
      </div>
    </SApiSection>

    <DemoSection title="Example Output" :code="diffOutputCode" language="diff" code-only />

    <!-- Configuration -->
    <SApiSection title="Configuration (saka-ui.json)" id="configuration">
      <div class="space-y-4 text-muted-foreground">
        <p>
          The <code class="text-xs bg-accent px-1 py-0.5 rounded">saka-ui.json</code> file in your project root controls how the CLI copies and transforms files.
        </p>
      </div>
    </SApiSection>

    <DemoSection title="Full Config Shape" :code="configCode" language="json" code-only />

    <SApiSection title="Config Options" id="config-options">
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
            <tr v-for="opt in configOptions" :key="opt.option" class="border-b border-border/50">
              <td class="py-2.5 px-2 font-mono text-xs text-foreground">{{ opt.option }}</td>
              <td class="py-2.5 px-2 font-mono text-xs text-primary">{{ opt.default }}</td>
              <td class="py-2.5 px-2 text-muted-foreground">{{ opt.desc }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </SApiSection>
  </div>
</template>
