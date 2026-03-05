import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['cli/index.ts'],
  format: ['esm'],
  outDir: 'dist/cli',
  clean: true,
  splitting: false,
  target: 'node18',
  platform: 'node',
  banner: {
    js: `import { createRequire } from 'module'; const require = createRequire(import.meta.url);`,
  },
})
