import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'

const config = {
  plugins: [resolve(), babel({babelHelpers: 'bundled'})],
  input: './src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs'
  }
}

export default config
