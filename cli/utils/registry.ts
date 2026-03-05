import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'

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

  throw new Error('Cannot find Saka UI registry. Make sure saka-ui is installed.')
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

export function resolveDependencies(
  registryRoot: string,
  name: string,
  visited: Set<string> = new Set()
): ComponentManifest[] {
  if (visited.has(name)) return []
  visited.add(name)

  const manifest = readManifest(registryRoot, name)
  const result: ComponentManifest[] = []

  for (const dep of manifest.dependencies) {
    result.push(...resolveDependencies(registryRoot, dep, visited))
  }

  result.push(manifest)
  return result
}
