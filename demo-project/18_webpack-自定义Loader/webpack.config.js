const path = require('path')

module.exports = {
  mode: "development",
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
        test: /\.js$/,
        use: [
          "zt_loader01",
          "zt_loader02",
          "zt_loader03",

          // 给loader传递参数
          {
            loader: "zt_loader04",
            options: {
              name: "wzt",
              age: '18'
            }
          }

          // {
          //   loader: "babel-loader",
          //   options: {
          //     plugins: [],
          //     presets: []
          //   }
          // }
        ]
      },
      // {
      //   test: /\.js$/,
      //   use: "zt_loader01"
      // },
      // {
      //   test: /\.js$/,
      //   use: "zt_loader02",
      //   enforce: "post"
      // },
      // {
      //   test: /\.js$/,
      //   use: "zt_loader03"
      // }
    ]
  }
}

