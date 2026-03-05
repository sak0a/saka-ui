import { existsSync, readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

export interface SakaUIConfig {
  componentDir: string
  composableDir: string
  libDir: string
  typescript: boolean
  overwrite: boolean
}

export const DEFAULT_CONFIG: SakaUIConfig = {
  componentDir: 'src/components/ui',
  composableDir: 'src/composables',
  libDir: 'src/lib',
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
