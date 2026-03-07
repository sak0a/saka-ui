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
      type: 'text',
      name: 'libDir',
      message: 'Lib/utils directory:',
      initial: DEFAULT_CONFIG.libDir,
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
    libDir: response.libDir,
    typescript: response.typescript,
    overwrite: response.overwriteFiles,
  }

  writeConfig(config, cwd)

  log.blank()
  log.success('Created saka-ui.json')
  log.dim(`  Component dir: ${config.componentDir}`)
  log.dim(`  Composable dir: ${config.composableDir}`)
  log.dim(`  Lib dir: ${config.libDir}`)
  log.dim(`  TypeScript: ${config.typescript}`)
  log.blank()
  log.info('Next: run "saka-ui add button" to add your first component.')
}
