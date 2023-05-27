// 默认lodash没有被打包是因为它使用commonjs, rollup默认情况下只会处理es module
const commonjs = require('@rollup/plugin-commonjs')
const nodeResolve = require('@rollup/plugin-node-resolve')

// 使用代码转换和压缩
const { babel } = require('@rollup/plugin-babel')
const terser = require('@rollup/plugin-terser')

module.exports = {
  // 入口
  input: './lib/index.js',
  // 出口
  output: {
    format: 'umd',
    name: 'whyUtils',
    file: './build/bundle.umd.js',
    globals: {
      lodash: '_'
    }
  },
  external: ['lodash'],
  plugins: [
    commonjs(),
    nodeResolve(),
    babel({
      babelHelpers: 'bundled',
      exclude: /node_modules/
    }),
    terser()
  ]
}
