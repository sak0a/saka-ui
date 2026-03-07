/**
 * build-registry.ts
 *
 * Copies component source files from src/ into registry/source/,
 * rewriting path-alias imports (~/...) to relative paths.
 * Validates that all files referenced in manifests exist.
 *
 * Run: npx tsx scripts/build-registry.ts
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'fs'
import { resolve, dirname, relative } from 'path'

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

// 4. Copy shared lib files (always included)
const LIB_FILES = ['lib/utils.ts', 'lib/icon.ts']

for (const libFile of LIB_FILES) {
  const srcPath = resolve(SRC, libFile)
  const destPath = resolve(SOURCE_OUT, libFile)

  if (!existsSync(srcPath)) {
    throw new Error(`Shared lib file not found: ${srcPath}`)
  }

  mkdirSync(dirname(destPath), { recursive: true })

  let content = readFileSync(srcPath, 'utf-8')
  content = rewriteImports(content, libFile)
  writeFileSync(destPath, content, 'utf-8')
  console.log(`  ✓ ${libFile} (shared lib)`)
}

// 5. Collect all component files to copy (deduplicated)
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

// 6. Copy component files
let copiedCount = LIB_FILES.length
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

// 7. Copy composable files
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
