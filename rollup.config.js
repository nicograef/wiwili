import typescript from 'typescript'
import typescriptPlugin from '@rollup/plugin-typescript'
// import resolveNodeModules from '@rollup/plugin-node-resolve'

export default {
  input: 'src/index.ts',
  output: {
    file: 'public/bundle.js',
    format: 'iife',
    globals: { d3: 'd3' }
  },
  external: ['d3'],
  plugins: [
    typescriptPlugin({
      typescript: typescript
    })
    // resolveNodeModules()
  ]
}
