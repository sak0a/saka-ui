import { defineConfig } from 'vite' // Vite config

import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isPagesBuild = mode === 'pages'
  const shouldGenerateTypes = !isPagesBuild && mode !== 'ci-bundle'

  return {
    base: isPagesBuild ? './' : undefined,
    plugins: [
      vue(),
      tailwindcss(),
      shouldGenerateTypes && dts({
        insertTypesEntry: true,
        cleanVueFileName: true,
        rollupTypes: false,
        strictOutput: false,
      }),
    ],
    resolve: {
      alias: {
        '~': resolve(__dirname, 'src'),
      },
    },
    build: isPagesBuild
      ? {
          outDir: 'dist-pages',
        }
      : {
          lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'SakaUI',
            fileName: 'saka-ui',
          },
          rollupOptions: {
            external: ['vue'],
            output: {
              globals: {
                vue: 'Vue',
              },
            },
          },
        },
  }
})
