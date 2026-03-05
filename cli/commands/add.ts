import prompts from 'prompts'
import { readConfig, configExists } from '../utils/config.js'
import { findRegistryRoot, readRegistryIndex, resolveDependencies, type ComponentManifest } from '../utils/registry.js'
import { copyComponentFiles, copyComposableFiles } from '../utils/copy.js'
import { log } from '../utils/logger.js'
import { resolve } from 'path'

export async function addCommand(components: string[], opts: { yes?: boolean } = {}) {
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

  for (const name of components) {
    if (!registryIndex.components.includes(name)) {
      log.error(`Unknown component: "${name}"`)
      log.info(`Available: ${registryIndex.components.join(', ')}`)
      process.exit(1)
    }
  }

  const visited = new Set<string>()
  const allManifests: ComponentManifest[] = []
  for (const name of components) {
    allManifests.push(...resolveDependencies(registryRoot, name, visited))
  }

  const allComposables = new Set<string>()
  for (const manifest of allManifests) {
    for (const c of manifest.composables) {
      allComposables.add(c)
    }
  }

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

  let proceed = true
  if (!opts.yes) {
    const response = await prompts({
      type: 'confirm',
      name: 'proceed',
      message: 'Proceed?',
      initial: true,
    })
    proceed = response.proceed
  }

  if (!proceed) {
    log.info('Aborted.')
    return
  }

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
