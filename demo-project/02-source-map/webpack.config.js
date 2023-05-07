const path = require('path')

module.exports = {
  mode: 'development',
  devtool: 'nosources-source-map',
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'boundle.js'
  }
}
