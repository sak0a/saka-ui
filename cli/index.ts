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
