import babel from 'rollup-plugin-babel'

export default {
  plugins: [ babel ],
  input: './src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs'
  }
};
