const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const AutoUploadWebpackPlugin = require('./plugins/AutoUploadWebpackPlugin')
const { PASSWORD } = require('./plugins/config')

module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "bundle.js"
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new AutoUploadWebpackPlugin({
      host: "123.207.32.32",
      username: "root",
      password: PASSWORD,
      remotePath: "/root/test"
    })
  ]
}