const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: "development",
  devtool: false,
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, './build'),
    filename: "bundle.js"
  },
  resolveLoader: {
    modules: ["node_modules", "./hy-loaders"]
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: "hybabel-loader"
        }
      },
      {
        test: /\.md$/,
        use: {
          loader: "hymd-loader"
        }
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader"
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin()
  ]
}

