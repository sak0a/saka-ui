# Hybrid Distribution Model — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a shadcn-style "copy components into your project" model alongside the existing npm package, with a CLI (`saka-ui init/add/list/diff`) and a registry of copyable component source files.

**Architecture:** Source Mirror approach — components are authored once in `src/`, a build script copies them into `registry/source/` with rewritten imports, and the CLI copies from registry into the consumer's project. Manifests in `registry/components/*.json` describe each component's files, dependencies, and composable requirements.

**Tech Stack:** TypeScript, Node.js, commander (CLI), prompts (interactive), diff (diff output), fast-glob (file discovery), tsup (CLI bundling)

---

### Task 1: Install CLI dependencies

**Files:**
- Modify: `package.json`

**Step 1: Add CLI dev/bundled dependencies**

Run:
```bash
cd /Users/laurinfrank/Library/CloudStorage/Dropbox/Code/Web/saka-ui
bun add -d commander prompts fast-glob diff tsup @types/prompts @types/diff
```

**Step 2: Verify installation**

Run: `ls node_modules/commander/package.json`
Expected: file exists

**Step 3: Commit**

```bash
git add package.json bun.lock
git commit -m "chore: add CLI dependencies (commander, prompts, fast-glob, diff, tsup)"
```

---

### Task 2: Create registry manifests

**Files:**
- Create: `registry/index.json`
- Create: `registry/components/button.json`
- Create: `registry/components/card.json`
- Create: `registry/components/input.json`

**Step 1: Create registry directory structure**

Run:
```bash
mkdir -p registry/components registry/source
```

**Step 2: Write master index**

Create `registry/index.json`:
```json
{
  "version": "0.1.0",
  "components": ["button", "card", "input"]
}
```

**Step 3: Write button manifest**

Create `registry/components/button.json`:
```json
{
  "name": "button",
  "displayName": "SButton",
  "description": "Button with variants, sizes, icons, ripple effect, and loading state",
  "version": "0.1.0",
  "files": [
    "components/ui/SButton.vue"
  ],
  "dependencies": [],
  "composables": [],
  "peerDependencies": {
    "vue": "^3.2.0"
  },
  "devDependencies": {
    "@mdi/font": "^7.0.0"
  }
}
```

**Step 4: Write card manifest**

Create `registry/components/card.json`:
```json
{
  "name": "card",
  "displayName": "SCard",
  "description": "Card container with elevated, outlined, filled, ghost, and glass variants. Includes header, content, footer, media, and actions subcomponents.",
  "version": "0.1.0",
  "files": [
    "components/ui/card/index.ts",
    "components/ui/card/SCard.vue",
    "components/ui/card/SCardHeader.vue",
    "components/ui/card/SCardContent.vue",
    "components/ui/card/SCardFooter.vue",
    "components/ui/card/SCardMedia.vue",
    "components/ui/card/SCardActions.vue"
  ],
  "dependencies": [],
  "composables": [],
  "peerDependencies": {
    "vue": "^3.2.0"
  },
  "devDependencies": {
    "@mdi/font": "^7.0.0"
  }
}
```

**Step 5: Write input manifest**

Create `registry/components/input.json`:
```json
{
  "name": "input",
  "displayName": "SInput",
  "description": "Text input with variants, floating labels, validation, suggestions, and character filtering",
  "version": "0.1.0",
  "files": [
    "components/ui/SInput.vue"
  ],
  "dependencies": [],
  "composables": [],
  "peerDependencies": {
    "vue": "^3.2.0"
  },
  "devDependencies": {
    "@mdi/font": "^7.0.0"
  }
}
```

**Step 6: Commit**

```bash
git add registry/
git commit -m "feat: add registry manifests for button, card, and input components"
```

---

### Task 3: Build the registry build script

**Files:**
- Create: `scripts/build-registry.ts`

**Step 1: Write the build-registry script**

Create `scripts/build-registry.ts`:
```typescript
/**
 * build-registry.ts
 *
 * Copies component source files from src/ into registry/source/,
 * rewriting path-alias imports (~/...) to relative paths.
 * Validates that all files referenced in manifests exist.
 *
 * Run: npx tsx scripts/build-registry.ts
 */

import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync, rmSync } from 'fs'
import { resolve, dirname, relative, join } from 'path'
import { globSync } from 'fast-glob'

const ROOT = resolve(import.meta.dirname, '..')
const SRC = resolve(ROOT, 'src')
const REGISTRY = resolve(ROOT, 'registry')
const SOURCE_OUT = resolve(REGISTRY, 'source')
const MANIFESTS_DIR = resolve(REGISTRY, 'components')

interface ComponentManifest {
  name: string
  displayName: string
  description: string
  version: string
  files: string[]
  dependencies: string[]
  composables: string[]
  peerDependencies: Record<string, string>
  devDependencies?: Record<string, string>
}

// 1. Clean previous source output
if (existsSync(SOURCE_OUT)) {
  rmSync(SOURCE_OUT, { recursive: true })
}
mkdirSync(SOURCE_OUT, { recursive: true })

// 2. Read master index
const indexPath = resolve(REGISTRY, 'index.json')
const index = JSON.parse(readFileSync(indexPath, 'utf-8'))
const componentNames: string[] = index.components

console.log(`\n📦 Building registry for ${componentNames.length} components...\n`)

// 3. Load all manifests
const manifests: ComponentManifest[] = componentNames.map((name) => {
  const manifestPath = resolve(MANIFESTS_DIR, `${name}.json`)
  if (!existsSync(manifestPath)) {
    throw new Error(`Manifest not found: ${manifestPath}`)
  }
  return JSON.parse(readFileSync(manifestPath, 'utf-8'))
})

// 4. Collect all files to copy (deduplicated)
const filesToCopy = new Set<string>()
const composablesToCopy = new Set<string>()

for (const manifest of manifests) {
  for (const file of manifest.files) {
    filesToCopy.add(file)
  }
  for (const composable of manifest.composables) {
    composablesToCopy.add(composable)
  }
}

// 5. Copy component files
let copiedCount = 0
for (const filePath of filesToCopy) {
  const srcPath = resolve(SRC, filePath)
  const destPath = resolve(SOURCE_OUT, filePath)

  if (!existsSync(srcPath)) {
    throw new Error(`Source file not found: ${srcPath} (referenced in manifest)`)
  }

  mkdirSync(dirname(destPath), { recursive: true })

  // Read, rewrite imports, write
  let content = readFileSync(srcPath, 'utf-8')
  content = rewriteImports(content, filePath)
  writeFileSync(destPath, content, 'utf-8')
  copiedCount++
  console.log(`  ✓ ${filePath}`)
}

// 6. Copy composable files
for (const composableName of composablesToCopy) {
  const fileName = `${composableName}.ts`
  const srcPath = resolve(SRC, 'composables', fileName)
  const destPath = resolve(SOURCE_OUT, 'composables', fileName)

  if (!existsSync(srcPath)) {
    throw new Error(`Composable not found: ${srcPath}`)
  }

  mkdirSync(dirname(destPath), { recursive: true })

  let content = readFileSync(srcPath, 'utf-8')
  content = rewriteImports(content, `composables/${fileName}`)
  writeFileSync(destPath, content, 'utf-8')
  copiedCount++
  console.log(`  ✓ composables/${fileName}`)
}

console.log(`\n✅ Registry built: ${copiedCount} files copied to registry/source/\n`)

// --- Helpers ---

/**
 * Rewrite ~/... path aliases to relative paths within registry/source/.
 * E.g., in a file at components/ui/card/SCard.vue:
 *   import { cardContextKey } from '~/components/ui/card/index'
 *   → import { cardContextKey } from './index'
 *
 *   import { useTheme } from '~/composables/useTheme'
 *   → import { useTheme } from '../../../composables/useTheme'
 */
function rewriteImports(content: string, filePath: string): string {
  const fileDir = dirname(filePath)

  // Match import/export from '~/...' or "~/..."
  return content.replace(
    /(from\s+['"])~\/([^'"]+)(['"])/g,
    (_match, prefix, importPath, suffix) => {
      const relativePath = relative(fileDir, importPath)
      const normalized = relativePath.startsWith('.') ? relativePath : `./${relativePath}`
      return `${prefix}${normalized}${suffix}`
    }
  )
}
```

**Step 2: Run the script to verify**

Run:
```bash
cd /Users/laurinfrank/Library/CloudStorage/Dropbox/Code/Web/saka-ui
npx tsx scripts/build-registry.ts
```

Expected: Output showing 8 files copied (1 button + 6 card + 1 card/index.ts + 1 input = 8 files, 0 composables)

**Step 3: Verify output files exist**

Run:
```bash
find registry/source -type f | sort
```

Expected:
```
registry/source/components/ui/SButton.vue
registry/source/components/ui/SInput.vue
registry/source/components/ui/card/SCard.vue
registry/source/components/ui/card/SCardActions.vue
registry/source/components/ui/card/SCardContent.vue
registry/source/components/ui/card/SCardFooter.vue
registry/source/components/ui/card/SCardHeader.vue
registry/source/components/ui/card/SCardMedia.vue
registry/source/components/ui/card/index.ts
```

**Step 4: Verify import rewriting in card/SCard.vue**

The line `import { cardContextKey } from './index'` should remain unchanged (already relative).

**Step 5: Add registry/source/ to .gitignore**

Add to `.gitignore`:
```
registry/source/
```

This is a build artifact — regenerated from src/ each build.

**Step 6: Commit**

```bash
git add scripts/build-registry.ts .gitignore
git commit -m "feat: add build-registry script to copy src/ into registry/source/"
```

---

### Task 4: Build the CLI — init command

**Files:**
- Create: `cli/index.ts`
- Create: `cli/commands/init.ts`
- Create: `cli/utils/config.ts`
- Create: `cli/utils/logger.ts`

**Step 1: Create CLI directory**

Run:
```bash
mkdir -p cli/commands cli/utils
```

**Step 2: Write logger utility**

Create `cli/utils/logger.ts`:
```typescript
/**
 * Simple CLI logger with colored output.
 */

const RESET = '\x1b[0m'
const GREEN = '\x1b[32m'
const YELLOW = '\x1b[33m'
const RED = '\x1b[31m'
const CYAN = '\x1b[36m'
const DIM = '\x1b[2m'
const BOLD = '\x1b[1m'

export const log = {
  info: (msg: string) => console.log(`${CYAN}ℹ${RESET} ${msg}`),
  success: (msg: string) => console.log(`${GREEN}✓${RESET} ${msg}`),
  warn: (msg: string) => console.log(`${YELLOW}⚠${RESET} ${msg}`),
  error: (msg: string) => console.error(`${RED}✗${RESET} ${msg}`),
  dim: (msg: string) => console.log(`${DIM}${msg}${RESET}`),
  bold: (msg: string) => console.log(`${BOLD}${msg}${RESET}`),
  blank: () => console.log(),
}
```

**Step 3: Write config utility**

Create `cli/utils/config.ts`:
```typescript
/**
 * Reads and writes saka-ui.json config in consumer projects.
 */

import { existsSync, readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

export interface SakaUIConfig {
  componentDir: string
  composableDir: string
  typescript: boolean
  overwrite: boolean
}

export const DEFAULT_CONFIG: SakaUIConfig = {
  componentDir: 'src/components/ui',
  composableDir: 'src/composables',
  typescript: true,
  overwrite: false,
}

const CONFIG_FILENAME = 'saka-ui.json'

export function getConfigPath(cwd: string = process.cwd()): string {
  return resolve(cwd, CONFIG_FILENAME)
}

export function configExists(cwd: string = process.cwd()): boolean {
  return existsSync(getConfigPath(cwd))
}

export function readConfig(cwd: string = process.cwd()): SakaUIConfig {
  const configPath = getConfigPath(cwd)
  if (!existsSync(configPath)) {
    throw new Error(`Config not found. Run "saka-ui init" first.`)
  }
  const raw = readFileSync(configPath, 'utf-8')
  return { ...DEFAULT_CONFIG, ...JSON.parse(raw) }
}

export function writeConfig(config: SakaUIConfig, cwd: string = process.cwd()): void {
  const configPath = getConfigPath(cwd)
  writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n', 'utf-8')
}
```

**Step 4: Write init command**

Create `cli/commands/init.ts`:
```typescript
import prompts from 'prompts'
import { existsSync } from 'fs'
import { resolve } from 'path'
import { DEFAULT_CONFIG, writeConfig, configExists, type SakaUIConfig } from '../utils/config.js'
import { log } from '../utils/logger.js'

export async function initCommand() {
  const cwd = process.cwd()

  log.bold('Saka UI — Project Setup')
  log.blank()

  if (configExists(cwd)) {
    const { overwrite } = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: 'saka-ui.json already exists. Overwrite?',
      initial: false,
    })
    if (!overwrite) {
      log.info('Aborted.')
      return
    }
  }

  // Detect TypeScript
  const hasTsConfig = existsSync(resolve(cwd, 'tsconfig.json'))

  const response = await prompts([
    {
      type: 'text',
      name: 'componentDir',
      message: 'Component directory:',
      initial: DEFAULT_CONFIG.componentDir,
    },
    {
      type: 'text',
      name: 'composableDir',
      message: 'Composable directory:',
      initial: DEFAULT_CONFIG.composableDir,
    },
    {
      type: 'confirm',
      name: 'typescript',
      message: 'Use TypeScript?',
      initial: hasTsConfig,
    },
    {
      type: 'confirm',
      name: 'overwriteFiles',
      message: 'Overwrite existing files when adding components?',
      initial: false,
    },
  ])

  if (!response.componentDir) {
    log.error('Setup cancelled.')
    return
  }

  const config: SakaUIConfig = {
    componentDir: response.componentDir,
    composableDir: response.composableDir,
    typescript: response.typescript,
    overwrite: response.overwriteFiles,
  }

  writeConfig(config, cwd)

  log.blank()
  log.success('Created saka-ui.json')
  log.dim(`  Component dir: ${config.componentDir}`)
  log.dim(`  Composable dir: ${config.composableDir}`)
  log.dim(`  TypeScript: ${config.typescript}`)
  log.blank()
  log.info('Next: run "saka-ui add button" to add your first component.')
}
```

**Step 5: Write CLI entry point**

Create `cli/index.ts`:
```typescript
#!/usr/bin/env node

import { Command } from 'commander'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { initCommand } from './commands/init.js'

// Read version from package.json
const pkgPath = resolve(import.meta.dirname, '..', 'package.json')
const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))

const program = new Command()
  .name('saka-ui')
  .description('Saka UI — Copy components into your project')
  .version(pkg.version)

program
  .command('init')
  .description('Initialize Saka UI in your project (creates saka-ui.json)')
  .action(initCommand)

program.parse()
```

**Step 6: Verify CLI compiles**

Run:
```bash
npx tsx cli/index.ts --help
```

Expected: Shows help with `init` command listed.

**Step 7: Commit**

```bash
git add cli/
git commit -m "feat: add CLI skeleton with init command"
```

---

### Task 5: Build the CLI — add command

**Files:**
- Create: `cli/commands/add.ts`
- Create: `cli/utils/registry.ts`
- Create: `cli/utils/copy.ts`
- Modify: `cli/index.ts`

**Step 1: Write registry reader utility**

Create `cli/utils/registry.ts`:
```typescript
/**
 * Reads registry manifests from the installed saka-ui package.
 */

import { existsSync, readFileSync, readdirSync } from 'fs'
import { resolve, join } from 'path'

export interface ComponentManifest {
  name: string
  displayName: string
  description: string
  version: string
  files: string[]
  dependencies: string[]
  composables: string[]
  peerDependencies: Record<string, string>
  devDependencies?: Record<string, string>
}

export interface RegistryIndex {
  version: string
  components: string[]
}

/**
 * Find the registry root — either in node_modules/saka-ui/registry
 * or adjacent to the CLI entry (for local dev).
 */
export function findRegistryRoot(): string {
  // Local dev: registry/ is sibling of cli/
  const localRegistry = resolve(import.meta.dirname, '..', '..', 'registry')
  if (existsSync(resolve(localRegistry, 'index.json'))) {
    return localRegistry
  }

  // Installed: node_modules/saka-ui/registry
  const installedRegistry = resolve(process.cwd(), 'node_modules', 'saka-ui', 'registry')
  if (existsSync(resolve(installedRegistry, 'index.json'))) {
    return installedRegistry
  }

  throw new Error(
    'Cannot find Saka UI registry. Make sure saka-ui is installed.'
  )
}

export function readRegistryIndex(registryRoot: string): RegistryIndex {
  const indexPath = resolve(registryRoot, 'index.json')
  return JSON.parse(readFileSync(indexPath, 'utf-8'))
}

export function readManifest(registryRoot: string, name: string): ComponentManifest {
  const manifestPath = resolve(registryRoot, 'components', `${name}.json`)
  if (!existsSync(manifestPath)) {
    throw new Error(`Component "${name}" not found in registry.`)
  }
  return JSON.parse(readFileSync(manifestPath, 'utf-8'))
}

/**
 * Resolve all transitive dependencies for a component.
 * Returns a flat list of manifests in dependency order.
 */
export function resolveDependencies(
  registryRoot: string,
  name: string,
  visited: Set<string> = new Set()
): ComponentManifest[] {
  if (visited.has(name)) return []
  visited.add(name)

  const manifest = readManifest(registryRoot, name)
  const result: ComponentManifest[] = []

  // Resolve dependencies first (depth-first)
  for (const dep of manifest.dependencies) {
    result.push(...resolveDependencies(registryRoot, dep, visited))
  }

  result.push(manifest)
  return result
}
```

**Step 2: Write copy utility**

Create `cli/utils/copy.ts`:
```typescript
/**
 * Copies registry source files into the consumer's project,
 * rewriting imports and injecting provenance headers.
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname, relative, basename, extname } from 'path'
import type { SakaUIConfig } from './config.js'
import type { ComponentManifest } from './registry.js'
import { log } from './logger.js'

const PROVENANCE_PREFIX = '// @saka-ui/registry'

export interface CopyResult {
  file: string
  dest: string
  skipped: boolean
}

/**
 * Copy a component's files from registry/source/ into the consumer project.
 */
export function copyComponentFiles(
  manifest: ComponentManifest,
  registrySourceRoot: string,
  config: SakaUIConfig,
  cwd: string
): CopyResult[] {
  const results: CopyResult[] = []

  for (const filePath of manifest.files) {
    const srcPath = resolve(registrySourceRoot, filePath)

    // Map registry path to consumer path
    // registry: components/ui/SButton.vue → <componentDir>/SButton.vue
    // registry: components/ui/card/SCard.vue → <componentDir>/card/SCard.vue
    const relativeToCUI = filePath.replace(/^components\/ui\//, '')
    const destPath = resolve(cwd, config.componentDir, relativeToCUI)

    if (existsSync(destPath) && !config.overwrite) {
      log.warn(`Skipped (exists): ${config.componentDir}/${relativeToCUI}`)
      results.push({ file: filePath, dest: destPath, skipped: true })
      continue
    }

    if (!existsSync(srcPath)) {
      throw new Error(`Registry source missing: ${srcPath}`)
    }

    mkdirSync(dirname(destPath), { recursive: true })

    let content = readFileSync(srcPath, 'utf-8')

    // Inject provenance header
    const header = [
      `${PROVENANCE_PREFIX} v${manifest.version} — ${manifest.name}`,
      `// Source: saka-ui@${manifest.version}`,
      `// Do not remove this header if you want \`saka-ui diff\` to work.`,
      '',
    ].join('\n')

    // Insert provenance after <script> tag for .vue files, or at top for .ts
    if (extname(filePath) === '.vue') {
      content = content.replace(
        /(<script[^>]*>)\n/,
        `$1\n${header}`
      )
    } else {
      content = `${header}${content}`
    }

    // Rewrite composable imports if needed
    // In copied files, composables live at config.composableDir
    // Components live at config.componentDir
    // We need to calculate the relative path between them
    content = rewriteComposableImports(content, destPath, config, cwd)

    writeFileSync(destPath, content, 'utf-8')
    log.success(`Copied: ${config.componentDir}/${relativeToCUI}`)
    results.push({ file: filePath, dest: destPath, skipped: false })
  }

  return results
}

/**
 * Copy composable files referenced by a manifest.
 */
export function copyComposableFiles(
  composableNames: string[],
  registrySourceRoot: string,
  config: SakaUIConfig,
  cwd: string
): CopyResult[] {
  const results: CopyResult[] = []

  for (const name of composableNames) {
    const fileName = `${name}.ts`
    const srcPath = resolve(registrySourceRoot, 'composables', fileName)
    const destPath = resolve(cwd, config.composableDir, fileName)

    if (existsSync(destPath) && !config.overwrite) {
      log.warn(`Skipped (exists): ${config.composableDir}/${fileName}`)
      results.push({ file: `composables/${fileName}`, dest: destPath, skipped: true })
      continue
    }

    if (!existsSync(srcPath)) {
      throw new Error(`Registry composable missing: ${srcPath}`)
    }

    mkdirSync(dirname(destPath), { recursive: true })

    let content = readFileSync(srcPath, 'utf-8')

    // Add provenance header
    const header = [
      `${PROVENANCE_PREFIX} v0.1.0 — composable:${name}`,
      `// Source: saka-ui@0.1.0`,
      `// Do not remove this header if you want \`saka-ui diff\` to work.`,
      '',
    ].join('\n')

    content = `${header}${content}`

    writeFileSync(destPath, content, 'utf-8')
    log.success(`Copied: ${config.composableDir}/${fileName}`)
    results.push({ file: `composables/${fileName}`, dest: destPath, skipped: false })
  }

  return results
}

/**
 * Rewrite relative composable imports in copied component files.
 * The registry source uses relative paths like ../../composables/useTheme
 * but in the consumer project, composables are at config.composableDir.
 */
function rewriteComposableImports(
  content: string,
  destFilePath: string,
  config: SakaUIConfig,
  cwd: string
): string {
  const destDir = dirname(destFilePath)
  const composableDir = resolve(cwd, config.composableDir)

  // Match imports that reference ../composables/ (relative paths from registry build)
  return content.replace(
    /(from\s+['"])(\.\.\/)*composables\/([^'"]+)(['"])/g,
    (_match, prefix, _dots, composablePath, suffix) => {
      const absoluteComposable = resolve(composableDir, composablePath)
      let rel = relative(destDir, absoluteComposable)
      if (!rel.startsWith('.')) rel = `./${rel}`
      return `${prefix}${rel}${suffix}`
    }
  )
}

/**
 * Read provenance header from a copied file.
 * Returns { name, version } or null if not found.
 */
export function readProvenance(filePath: string): { name: string; version: string } | null {
  if (!existsSync(filePath)) return null

  const content = readFileSync(filePath, 'utf-8')
  const match = content.match(
    /\/\/ @saka-ui\/registry v([\d.]+) — (.+)/
  )

  if (!match) return null
  return { version: match[1], name: match[2] }
}
```

**Step 3: Write add command**

Create `cli/commands/add.ts`:
```typescript
import prompts from 'prompts'
import { readConfig, configExists } from '../utils/config.js'
import { findRegistryRoot, readRegistryIndex, resolveDependencies, type ComponentManifest } from '../utils/registry.js'
import { copyComponentFiles, copyComposableFiles } from '../utils/copy.js'
import { log } from '../utils/logger.js'
import { resolve } from 'path'

export async function addCommand(components: string[]) {
  const cwd = process.cwd()

  if (!configExists(cwd)) {
    log.error('No saka-ui.json found. Run "saka-ui init" first.')
    process.exit(1)
  }

  if (components.length === 0) {
    log.error('Please specify at least one component. Example: saka-ui add button')
    process.exit(1)
  }

  const config = readConfig(cwd)
  const registryRoot = findRegistryRoot()
  const registryIndex = readRegistryIndex(registryRoot)
  const sourceRoot = resolve(registryRoot, 'source')

  // Validate component names
  for (const name of components) {
    if (!registryIndex.components.includes(name)) {
      log.error(`Unknown component: "${name}"`)
      log.info(`Available: ${registryIndex.components.join(', ')}`)
      process.exit(1)
    }
  }

  // Resolve all dependencies
  const visited = new Set<string>()
  const allManifests: ComponentManifest[] = []
  for (const name of components) {
    allManifests.push(...resolveDependencies(registryRoot, name, visited))
  }

  // Collect all composables
  const allComposables = new Set<string>()
  for (const manifest of allManifests) {
    for (const c of manifest.composables) {
      allComposables.add(c)
    }
  }

  // Show summary
  log.bold('Components to add:')
  for (const m of allManifests) {
    log.info(`  ${m.displayName} (${m.files.length} files)`)
  }
  if (allComposables.size > 0) {
    log.blank()
    log.bold('Composables to copy:')
    for (const c of allComposables) {
      log.info(`  ${c}.ts`)
    }
  }
  log.blank()

  const { proceed } = await prompts({
    type: 'confirm',
    name: 'proceed',
    message: 'Proceed?',
    initial: true,
  })

  if (!proceed) {
    log.info('Aborted.')
    return
  }

  // Copy files
  log.blank()
  for (const manifest of allManifests) {
    copyComponentFiles(manifest, sourceRoot, config, cwd)
  }

  if (allComposables.size > 0) {
    copyComposableFiles([...allComposables], sourceRoot, config, cwd)
  }

  log.blank()
  log.success('Done! Components are ready to use and edit.')
}
```

**Step 4: Register add command in CLI entry**

Modify `cli/index.ts` to add:
```typescript
#!/usr/bin/env node

import { Command } from 'commander'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { initCommand } from './commands/init.js'
import { addCommand } from './commands/add.js'

const pkgPath = resolve(import.meta.dirname, '..', 'package.json')
const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))

const program = new Command()
  .name('saka-ui')
  .description('Saka UI — Copy components into your project')
  .version(pkg.version)

program
  .command('init')
  .description('Initialize Saka UI in your project (creates saka-ui.json)')
  .action(initCommand)

program
  .command('add')
  .description('Add components to your project')
  .argument('<components...>', 'Component names to add')
  .action(addCommand)

program.parse()
```

**Step 5: Verify add command compiles**

Run:
```bash
npx tsx cli/index.ts add --help
```

Expected: Shows help for add command.

**Step 6: Commit**

```bash
git add cli/
git commit -m "feat: add CLI 'add' command with dependency resolution and file copying"
```

---

### Task 6: Build the CLI — list command

**Files:**
- Create: `cli/commands/list.ts`
- Modify: `cli/index.ts`

**Step 1: Write list command**

Create `cli/commands/list.ts`:
```typescript
import { existsSync } from 'fs'
import { resolve } from 'path'
import { findRegistryRoot, readRegistryIndex, readManifest } from '../utils/registry.js'
import { readConfig, configExists } from '../utils/config.js'
import { log } from '../utils/logger.js'

export function listCommand() {
  const cwd = process.cwd()
  const registryRoot = findRegistryRoot()
  const index = readRegistryIndex(registryRoot)

  // Check which components are already installed
  let config = null
  if (configExists(cwd)) {
    try {
      config = readConfig(cwd)
    } catch {
      // ignore
    }
  }

  log.bold(`Saka UI Registry — ${index.components.length} components available\n`)

  for (const name of index.components) {
    const manifest = readManifest(registryRoot, name)

    // Check if already installed
    let installed = false
    if (config) {
      const firstFile = manifest.files[0]
      const relativeToCUI = firstFile.replace(/^components\/ui\//, '')
      const destPath = resolve(cwd, config.componentDir, relativeToCUI)
      installed = existsSync(destPath)
    }

    const status = installed ? ' \x1b[32m✓\x1b[0m' : ''
    const depInfo = manifest.dependencies.length > 0
      ? ` (depends: ${manifest.dependencies.join(', ')})`
      : ''

    console.log(
      `  ${manifest.displayName.padEnd(16)} ${manifest.description}${depInfo}${status}`
    )
  }

  log.blank()
  if (!configExists(cwd)) {
    log.info('Run "saka-ui init" to set up your project, then "saka-ui add <name>" to add components.')
  } else {
    log.info('Run "saka-ui add <name>" to add a component.')
  }
}
```

**Step 2: Register list command in cli/index.ts**

Add import and command registration:
```typescript
import { listCommand } from './commands/list.js'

// ... after add command:

program
  .command('list')
  .description('List available registry components')
  .action(listCommand)
```

**Step 3: Verify**

Run:
```bash
npx tsx cli/index.ts list
```

Expected: Shows 3 components (button, card, input) with descriptions.

**Step 4: Commit**

```bash
git add cli/
git commit -m "feat: add CLI 'list' command to show available components"
```

---

### Task 7: Build the CLI — diff command

**Files:**
- Create: `cli/commands/diff.ts`
- Modify: `cli/index.ts`

**Step 1: Write diff command**

Create `cli/commands/diff.ts`:
```typescript
import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'
import { createTwoFilesPatch } from 'diff'
import { readConfig, configExists } from '../utils/config.js'
import { findRegistryRoot, readManifest, readRegistryIndex } from '../utils/registry.js'
import { readProvenance } from '../utils/copy.js'
import { log } from '../utils/logger.js'

// ANSI color helpers for diff output
const RED = '\x1b[31m'
const GREEN = '\x1b[32m'
const CYAN = '\x1b[36m'
const RESET = '\x1b[0m'

function colorDiff(patch: string): string {
  return patch
    .split('\n')
    .map((line) => {
      if (line.startsWith('+++') || line.startsWith('---')) return `${CYAN}${line}${RESET}`
      if (line.startsWith('+')) return `${GREEN}${line}${RESET}`
      if (line.startsWith('-')) return `${RED}${line}${RESET}`
      if (line.startsWith('@@')) return `${CYAN}${line}${RESET}`
      return line
    })
    .join('\n')
}

export function diffCommand(componentName: string) {
  const cwd = process.cwd()

  if (!configExists(cwd)) {
    log.error('No saka-ui.json found. Run "saka-ui init" first.')
    process.exit(1)
  }

  const config = readConfig(cwd)
  const registryRoot = findRegistryRoot()
  const registryIndex = readRegistryIndex(registryRoot)
  const sourceRoot = resolve(registryRoot, 'source')

  if (!registryIndex.components.includes(componentName)) {
    log.error(`Unknown component: "${componentName}"`)
    log.info(`Available: ${registryIndex.components.join(', ')}`)
    process.exit(1)
  }

  const manifest = readManifest(registryRoot, componentName)
  let hasDiffs = false

  for (const filePath of manifest.files) {
    const relativeToCUI = filePath.replace(/^components\/ui\//, '')
    const localPath = resolve(cwd, config.componentDir, relativeToCUI)
    const registryPath = resolve(sourceRoot, filePath)

    if (!existsSync(localPath)) {
      log.warn(`Not installed: ${config.componentDir}/${relativeToCUI}`)
      continue
    }

    if (!existsSync(registryPath)) {
      log.error(`Registry source missing: ${filePath}. Run build first.`)
      continue
    }

    // Read both files, strip provenance header from local for fair comparison
    let localContent = readFileSync(localPath, 'utf-8')
    const registryContent = readFileSync(registryPath, 'utf-8')

    // Strip provenance lines from local copy for comparison
    localContent = localContent
      .split('\n')
      .filter((line) => !line.startsWith('// @saka-ui/registry') && !line.startsWith('// Source: saka-ui@') && !line.startsWith('// Do not remove this header'))
      .join('\n')

    if (localContent.trim() === registryContent.trim()) {
      continue // No changes
    }

    hasDiffs = true
    const patch = createTwoFilesPatch(
      `registry/${filePath}`,
      `local/${config.componentDir}/${relativeToCUI}`,
      registryContent,
      localContent,
      'registry',
      'local'
    )
    console.log(colorDiff(patch))
  }

  if (!hasDiffs) {
    log.success(`${manifest.displayName}: no changes from registry version.`)
  }
}
```

**Step 2: Register diff command in cli/index.ts**

Add import and command:
```typescript
import { diffCommand } from './commands/diff.js'

// ... after list command:

program
  .command('diff')
  .description('Compare local component copy against registry version')
  .argument('<component>', 'Component name to diff')
  .action(diffCommand)
```

**Step 3: Verify**

Run:
```bash
npx tsx cli/index.ts diff --help
```

Expected: Shows help for diff command.

**Step 4: Commit**

```bash
git add cli/
git commit -m "feat: add CLI 'diff' command to compare local vs registry versions"
```

---

### Task 8: Bundle CLI and wire into package.json

**Files:**
- Create: `scripts/build-cli.ts`
- Modify: `package.json`

**Step 1: Create CLI build script using tsup**

Create `scripts/build-cli.ts`:
```typescript
/**
 * Build script for the CLI.
 * Uses tsup to bundle cli/index.ts → dist/cli/index.mjs
 * with all dependencies inlined.
 */
import { execSync } from 'child_process'

execSync(
  'npx tsup cli/index.ts --format esm --out-dir dist/cli --dts false --clean --no-splitting --banner.js "#!/usr/bin/env node"',
  { stdio: 'inherit' }
)
```

**Step 2: Update package.json**

Add `bin`, update `files`, update `scripts`:

In `package.json`, add/modify these fields:
```json
{
  "bin": {
    "saka-ui": "./dist/cli/index.mjs"
  },
  "files": [
    "dist",
    "registry"
  ],
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build && tsx scripts/build-registry.ts",
    "build:cli": "tsx scripts/build-cli.ts",
    "build:all": "vue-tsc && vite build && tsx scripts/build-registry.ts && tsx scripts/build-cli.ts",
    "preview": "vite preview"
  }
}
```

**Step 3: Test full build**

Run:
```bash
cd /Users/laurinfrank/Library/CloudStorage/Dropbox/Code/Web/saka-ui
bun run build:all
```

Expected: Library builds, registry builds (8 files), CLI bundles to `dist/cli/index.mjs`.

**Step 4: Test CLI via dist output**

Run:
```bash
node dist/cli/index.mjs --help
```

Expected: Shows CLI help with all 4 commands.

**Step 5: Commit**

```bash
git add scripts/build-cli.ts package.json
git commit -m "feat: bundle CLI into dist/cli/index.mjs, wire bin entry in package.json"
```

---

### Task 9: Component extension surface — add class merge props

**Files:**
- Modify: `src/components/ui/SButton.vue`
- Modify: `src/components/ui/card/SCard.vue`

Note: SInput.vue already has `inputClass`, `labelClass`, `wrapperClass` props. No changes needed there.

**Step 1: Add contentClass and iconClass to SButton**

In `src/components/ui/SButton.vue`, add to the Props interface:
```typescript
  /** Custom class for content wrapper */
  contentClass?: string
  /** Custom class for icon elements */
  iconClass?: string
```

Add defaults:
```typescript
  contentClass: undefined,
  iconClass: undefined,
```

Add `inheritAttrs: false` to script setup (add `defineOptions`):
```typescript
defineOptions({ inheritAttrs: false })
```

Add `v-bind="$attrs"` to the root `<component>` element.

Apply `contentClass` to the content span:
```html
<span
  class="s-button__content flex items-center justify-center gap-2"
  :class="[contentClass, { 'opacity-0': loading && preserveSize }]"
>
```

Apply `iconClass` to icon spans:
```html
<span
  v-if="iconLeft"
  :class="['mdi', `mdi-${iconLeft}`, iconSizes, iconClass]"
/>
```

**Step 2: Add headerClass, contentClass, footerClass to SCard**

In `src/components/ui/card/SCard.vue`, add to Props interface:
```typescript
  /** Custom class for the card root when using $attrs forwarding */
  headerClass?: string
  /** Custom class override */
  contentClass?: string
  /** Custom class override */
  footerClass?: string
```

Add `defineOptions({ inheritAttrs: false })` and `v-bind="$attrs"` on root.

**Step 3: Verify existing build still works**

Run:
```bash
bun run build
```

Expected: Successful build with no errors.

**Step 4: Commit**

```bash
git add src/components/ui/SButton.vue src/components/ui/card/SCard.vue
git commit -m "feat: add class merge props and inheritAttrs:false to SButton and SCard"
```

---

### Task 10: Write documentation

**Files:**
- Create: `docs/open-code-mode.md`
- Create: `docs/cli-quickstart.md`
- Create: `docs/customization-strategy.md`
- Create: `docs/upgrade-strategy.md`

**Step 1: Write open-code-mode.md**

Create `docs/open-code-mode.md` with sections:
- What is Open-code mode?
- Package mode vs Open-code mode comparison table
- When to use which
- How they coexist

**Step 2: Write cli-quickstart.md**

Create `docs/cli-quickstart.md` with:
- Installation
- `saka-ui init` walkthrough
- `saka-ui add button` walkthrough
- `saka-ui list` example
- `saka-ui diff button` example

**Step 3: Write customization-strategy.md**

Create `docs/customization-strategy.md` with:
- Decision tree: props → CSS vars → source edits
- When to use props (behavior, a11y, variants)
- When to use CSS variables (colors, spacing, typography)
- When to edit source (layout changes, structural modifications)

**Step 4: Write upgrade-strategy.md**

Create `docs/upgrade-strategy.md` with:
- Using `saka-ui diff` to see changes
- Manual merge workflow
- When to re-add (overwrite) vs merge
- Version tracking via provenance headers

**Step 5: Commit**

```bash
git add docs/
git commit -m "docs: add open-code mode, CLI quickstart, customization, and upgrade guides"
```

---

### Task 11: End-to-end smoke test

**Step 1: Build everything**

Run:
```bash
cd /Users/laurinfrank/Library/CloudStorage/Dropbox/Code/Web/saka-ui
bun run build:all
```

Expected: All builds pass.

**Step 2: Test CLI init in a temp directory**

Run:
```bash
mkdir -p /tmp/saka-test && cd /tmp/saka-test
echo '{"name":"test","type":"module"}' > package.json
mkdir -p node_modules/saka-ui
# Symlink the built package
ln -sf /Users/laurinfrank/Library/CloudStorage/Dropbox/Code/Web/saka-ui/dist node_modules/saka-ui/dist
ln -sf /Users/laurinfrank/Library/CloudStorage/Dropbox/Code/Web/saka-ui/registry node_modules/saka-ui/registry
ln -sf /Users/laurinfrank/Library/CloudStorage/Dropbox/Code/Web/saka-ui/package.json node_modules/saka-ui/package.json
```

**Step 3: Test init**

Run (non-interactive):
```bash
cd /tmp/saka-test
echo '{"componentDir":"src/components/ui","composableDir":"src/composables","typescript":true,"overwrite":false}' > saka-ui.json
```

**Step 4: Test add**

Run:
```bash
cd /Users/laurinfrank/Library/CloudStorage/Dropbox/Code/Web/saka-ui
npx tsx cli/index.ts list
```

Expected: Shows 3 components.

**Step 5: Test existing library build is unchanged**

Run:
```bash
cd /Users/laurinfrank/Library/CloudStorage/Dropbox/Code/Web/saka-ui
ls -la dist/saka-ui.js dist/saka-ui.umd.cjs dist/style.css dist/index.d.ts
```

Expected: All 4 files exist and are non-empty.

**Step 6: Clean up**

```bash
rm -rf /tmp/saka-test
```

**Step 7: Final commit if any fixes were needed**

```bash
git add -A
git status
# Only commit if there are actual changes
```

---

### Task 12: Final report

**Step 1: Create report**

Create a brief summary of:
- What was implemented
- Known limitations
- Next recommended components to onboard

This should be reported verbally to the user, not committed as a file.

**What was implemented:**
- Registry manifests for button, card, input
- Build script (`scripts/build-registry.ts`) to sync src/ → registry/source/
- CLI with 4 commands: init, add, list, diff
- CLI bundled to dist/cli/index.mjs via tsup
- Class merge props added to SButton and SCard
- Documentation: 4 guides + 1 ADR
- Package.json updated with bin entry and build scripts

**Known limitations:**
- Only 3 of 40+ components in registry
- No automated tests for CLI (manual smoke test only)
- `diff` command does simple text comparison, not AST-aware
- No `update` command yet (manual re-add workflow)
- Provenance header stripping in diff is line-based

**Next recommended components:**
1. `glass-button` — depends on nothing, tests composable-free path
2. `glass-card` — depends on `card` + `useTheme`, tests composable copying
3. `checkbox`, `switch`, `select` — popular form controls
4. `modal` — tests compound component with many subcomponents
