import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname, relative, extname } from 'path'
import type { SakaUIConfig } from './config.js'
import type { ComponentManifest } from './registry.js'
import { log } from './logger.js'

const PROVENANCE_PREFIX = '// @saka-ui/registry'

export interface CopyResult {
  file: string
  dest: string
  skipped: boolean
}

export function copyComponentFiles(
  manifest: ComponentManifest,
  registrySourceRoot: string,
  config: SakaUIConfig,
  cwd: string
): CopyResult[] {
  const results: CopyResult[] = []

  for (const filePath of manifest.files) {
    const srcPath = resolve(registrySourceRoot, filePath)
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

    if (extname(filePath) === '.vue') {
      content = content.replace(
        /(<script[^>]*>)\n/,
        `$1\n${header}`
      )
    } else {
      content = `${header}${content}`
    }

    content = rewriteComposableImports(content, destPath, config, cwd)

    writeFileSync(destPath, content, 'utf-8')
    log.success(`Copied: ${config.componentDir}/${relativeToCUI}`)
    results.push({ file: filePath, dest: destPath, skipped: false })
  }

  return results
}

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

function rewriteComposableImports(
  content: string,
  destFilePath: string,
  config: SakaUIConfig,
  cwd: string
): string {
  const destDir = dirname(destFilePath)
  const composableDir = resolve(cwd, config.composableDir)

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

export function readProvenance(filePath: string): { name: string; version: string } | null {
  if (!existsSync(filePath)) return null

  const content = readFileSync(filePath, 'utf-8')
  const match = content.match(/\/\/ @saka-ui\/registry v([\d.]+) — (.+)/)

  if (!match) return null
  return { version: match[1], name: match[2] }
}
