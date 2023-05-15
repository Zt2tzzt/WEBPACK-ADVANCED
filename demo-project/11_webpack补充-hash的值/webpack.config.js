const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.js',
    main: './src/main.js',
  },
  output: {
    clean: true,
    path: path.resolve(__dirname, './build'),
    filename: '[name]_[contenthash]_bundle.js',
    chunkFilename: '[contenthash]_chunk.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[contenthash]_[name].css'
    })
  ]
}