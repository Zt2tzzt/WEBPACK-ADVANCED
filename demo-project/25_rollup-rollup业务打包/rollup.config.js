// 默认lodash没有被打包是因为它使用commonjs, rollup默认情况下只会处理es module
const commonjs = require('@rollup/plugin-commonjs')
const nodeResolve = require('@rollup/plugin-node-resolve')

// 使用代码转换和压缩
const { babel } = require('@rollup/plugin-babel')
const terser = require('@rollup/plugin-terser')
const postcss = require('rollup-plugin-postcss')
const vue = require('rollup-plugin-vue')
const replace = require('@rollup/plugin-replace')
const serve = require('rollup-plugin-serve')
const livereload = require('rollup-plugin-livereload')


const isProduction = process.env.NODE_ENV === "production"
const plugins = [
  commonjs(),
  nodeResolve(),
  babel({
    babelHelpers: "bundled",
    exclude: /node_modules/
  }),
  postcss(),
  vue(),
  replace({
    "process.env.NODE_ENV": JSON.stringify('production'),
    preventAssignment: true
  }),
]

if (isProduction) {
  plugins.push(terser())
} else {
  const extraPlugins = [
    serve({
      port: 8000,
      open: true,
      contentBase: "."
    }),
    livereload()
  ]
  plugins.push(...extraPlugins)
}

module.exports = {
  // 入口
  input: "./src/index.js",
  // 出口
  output: {
    format: "umd",
    name: "whyUtils",
    file: "./build/bundle.umd.js",
    globals: {
      lodash: "_"
    }
  },
  plugins: plugins
}

