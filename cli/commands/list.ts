import { existsSync } from 'fs'
import { resolve } from 'path'
import { findRegistryRoot, readRegistryIndex, readManifest } from '../utils/registry.js'
import { readConfig, configExists } from '../utils/config.js'
import { log } from '../utils/logger.js'

export function listCommand() {
  const cwd = process.cwd()
  const registryRoot = findRegistryRoot()
  const index = readRegistryIndex(registryRoot)

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
