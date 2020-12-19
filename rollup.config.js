import typescriptPlugin from '@rollup/plugin-typescript'

export default {
  input: 'src/index.ts',
  output: {
    file: 'public/bundle.js',
    format: 'iife',
    globals: { d3: 'd3' }
  },
  external: ['d3'],
  plugins: [typescriptPlugin()]
}
