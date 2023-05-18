const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { ProvidePlugin } = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { merge } = require('webpack-merge')
const devConfig = require('./dev.config')
const prodConfig = require('./prod.config')

const getCommonConfig = function(isProdution) {
  return {
    entry: './src/demo.js',
    output: {
      clean: true,
      path: path.resolve(__dirname, '../build'),
      // placeholder
      filename: 'js/[name]-bundle.js',
      // 单独针对分包的文件进行命名
      chunkFilename: 'js/[name]_chunk.js',
      // publicPath: 'http://coderwhycdn.com/'
    },
    resolve: {
      extensions: ['.js', '.json', '.wasm', '.jsx', '.ts']
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          use: {
            loader: "babel-loader",
          }
        },
        {
          test: /\.ts$/,
          use: 'babel-loader'
        },
        {
          test: /\.css$/,
          use: [
            // // 'style-loader', //开发阶段
            // MiniCssExtractPlugin.loader, // 生产阶段
            isProdution ? MiniCssExtractPlugin.loader: 'style-loader',
            'css-loader'
          ]
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html',
        cache: true,
        minify: isProdution? {
          // 移除注释
          removeComments: true,
          // 移除属性
          removeEmptyAttributes: true,
          // 移除默认属性
          removeRedundantAttributes: true,
          // 折叠空白字符
          collapseWhitespace: true,
          // 压缩内联的CSS
          minifyCSS: true,
          // 压缩JavaScript
          minifyJS: {
            mangle: {
              toplevel: true
            }
          }
        }: false
      }),
      new ProvidePlugin({
        axios: ['axios', 'default'],
        // get: ['axios', 'get'],
        dayjs: 'dayjs'
      })
    ]
  }  
}


// webpack允许导出一个函数
module.exports = function(env) {
  const isProduction = env.production
  let mergeConfig = isProduction ? prodConfig: devConfig
  return merge(getCommonConfig(isProduction), mergeConfig)
}
