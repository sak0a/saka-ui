import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  typescript: true,
  stylistic: {
    quotes: 'single',
    semi: false,
  },
  rules: {
    'no-console': 'warn',
  },
  ignores: [
    'dist/',
    'dist-pages/',
    'dist-cli/',
    'registry/',
    'node_modules/',
  ],
}, {
  files: ['**/*.vue'],
  rules: {
    'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
  },
})
