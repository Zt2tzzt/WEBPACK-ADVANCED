const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  mode: 'production',
  devtool: false,
  // entry: './src/index.js',
  entry: './src/main.js',
  output: {
    clean: true,
    path: path.resolve(__dirname, './build'),
    // placeholder
    filename: '[name]-bundle.js',
    // 单独针对分包的文件进行命名
    chunkFilename: '[name]_chunk.js',
    // publicPath: 'http://coderwhycdn.com/'
  },
  resolve: {
    extensions: ['.js', '.json', '.wasm', '.jsx', '.ts']
  },
  devServer: {
    static: ['public', 'content'],
    port: 3000,
    compress: true,
    proxy: {
      '/api': {
        target: 'http://localhost:9000',
        pathRewrite: {
          '^/api': ''
        },
        changeOrigin: true
      }
    },
    historyApiFallback: true
  },
  // 优化配置
  optimization: {
    // 设置生成的chunkId的算法
    // development: named
    // production: deterministic(确定性)
    // webpack4中使用: natural
    chunkIds: 'deterministic',
    // runtime的代码是否抽取到单独的包中(早Vue2脚手架中)
    runtimeChunk: {
      name: "runtime"
    },
    // 分包插件: SplitChunksPlugin
    splitChunks: {
      chunks: "all",
      // 当一个包大于指定的大小时, 继续进行拆包
      // maxSize: 20000,
      // // 将包拆分成不小于minSize的包
      // minSize: 10000,
      minSize: 10,

      // 自己对需要进行拆包的内容进行分包
      cacheGroups: {
        utils: {
          test: /utils/,
          filename: "[id]_utils.js"
        },
        vendors: {
          // /node_modules/
          // window上面 /\
          // mac上面 /
          test: /[\\/]node_modules[\\/]/,
          filename: "[id]_vendors.js"
        }
      }
    },
    // 代码优化: TerserPlugin => 让代码更加简单 => Terser
    minimizer: [
      // JS代码简化
      new TerserPlugin({
        extractComments: false
      })
      // CSS代码简化
    ]
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
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ]
}