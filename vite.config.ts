import { defineConfig } from 'vite' // Vite config

import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    dts({
      insertTypesEntry: true,
      cleanVueFileName: true,
    }),
  ],
  build: {
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
})
