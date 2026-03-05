import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'
import { createTwoFilesPatch } from 'diff'
import { readConfig, configExists } from '../utils/config.js'
import { findRegistryRoot, readManifest, readRegistryIndex } from '../utils/registry.js'
import { log } from '../utils/logger.js'

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

    let localContent = readFileSync(localPath, 'utf-8')
    const registryContent = readFileSync(registryPath, 'utf-8')

    // Strip provenance lines from local copy for fair comparison
    localContent = localContent
      .split('\n')
      .filter((line) => !line.startsWith('// @saka-ui/registry') && !line.startsWith('// Source: saka-ui@') && !line.startsWith('// Do not remove this header'))
      .join('\n')

    if (localContent.trim() === registryContent.trim()) {
      continue
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
