const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { ProvidePlugin } = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { merge } = require('webpack-merge')
const devConfig = require('./dev.config')
const prodConfig = require('./prod.config')

/**
 * 抽取开发和生产环境的配置文件
 * 1.将配置文件导出的是一个函数, 而不是一个对象
 * 2.从上向下查看所有的配置属性应该属于哪一个文件
 * * comm/dev/prod
 * 3.针对单独的配置文件进行定义化
 * * css加载: 使用的不同的loader可以根据isProduction动态获取
 */

const getCommonConfig = function(isProdution) {
  return {
    entry: './src/main.js',
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
        template: './index.html'
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
