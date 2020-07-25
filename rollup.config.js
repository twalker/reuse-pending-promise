import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

export default {
  plugins: [
    resolve(),
    babel({ babelHelpers: 'bundled' })
   ],
  input: './src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs'
  }
};
