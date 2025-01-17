import { defineConfig } from 'vitest/config'

const exclude = [
  'main.ts',
  'bench.ts',
  'vite.config.ts',
  'vitest.config.ts',
  'node_modules',
  'docs',
  'coverage',
  'dist',
  'example'
];

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      exclude,
    },
    exclude,
  }
})