const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: "production",
  // devtool: false,
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, './build'),
    filename: "bundle.js"
  },
  resolveLoader: {
    modules: ["node_modules", "./zt-loaders"]
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: "zt-babel-loader"
        }
      },
      {
        test: /\.md$/,
        use: {
          loader: "zt-md-loader"
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

