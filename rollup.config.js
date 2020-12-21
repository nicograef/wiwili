import typescriptPlugin from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'

export default {
  input: 'src/index.ts',
  output: {
    file: 'public/bundle.js',
    format: 'iife',
    globals: { d3: 'd3' }
  },
  external: ['d3'],
  plugins: [resolve({ preferBuiltins: true, browser: true }), commonjs(), json(), typescriptPlugin()]
}
