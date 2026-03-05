#!/usr/bin/env node

import { Command } from 'commander'
import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'
import { initCommand } from './commands/init.js'
import { addCommand } from './commands/add.js'
import { listCommand } from './commands/list.js'
import { diffCommand } from './commands/diff.js'

// When bundled, the CLI lives at dist/cli/index.js so we need ../../package.json.
// When running from source, it's cli/index.ts so we need ../package.json.
// We try the bundled path first, then fall back to the source path.
const bundledPkgPath = resolve(import.meta.dirname, '..', '..', 'package.json')
const sourcePkgPath = resolve(import.meta.dirname, '..', 'package.json')
const pkgPath = existsSync(bundledPkgPath) ? bundledPkgPath : sourcePkgPath
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
  .option('-y, --yes', 'Skip confirmation prompt')
  .action((components: string[], opts: { yes?: boolean }) => addCommand(components, opts))

program
  .command('list')
  .description('List available registry components')
  .action(listCommand)

program
  .command('diff')
  .description('Compare local component copy against registry version')
  .argument('<component>', 'Component name to diff')
  .action(diffCommand)

program.parse()
