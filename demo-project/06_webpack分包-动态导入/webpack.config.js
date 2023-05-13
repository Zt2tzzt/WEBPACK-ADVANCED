const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  devtool: false,
  // entry: './src/index.js',
  entry: './src/main.js',
  output: {
    clean: true,
    path: path.resolve(__dirname, './build'),
    // placeholder
    filename: '[name]-bundle.js',
    // 单独针对分包的文件进行命名
    chunkFilename: '[name]_chunk.js'
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