# JS 和 CSS 压缩 & terser & 配置分离 & TreeShaking

## 一、Terser

Terser 是一个用于 JavaScript Parser（解析）、Mangler（绞肉机），Compressor（压缩机）的工具集；

webpack 默认打包的 bumdle，没有进行压缩。

Terser 可用于压缩、丑化代码，让 bundle 变得更小。

早期使用 uglify-js 来压缩、丑化 JavaScript 代码，目前该库已不再维护，并且不支持 ES6+ 的语法；

Terser 是从 uglify-es 库 fork 过来的，并且保留它原来的大部分 API 并适配 uglify-es 和 uglify-js@3 等；

Terser 是一个独立的工具，可以单独安装：

```shell
# 全局安装
npm install terser -g

# 局部安装
npm install terser -D
```

> webpack 中的 Plugin（插件），贯穿于 webpack 打包全全生命周期。
>
> 【面试】：优化方案，可回答 Terser。

### 1.命令行使用

```shell
terser [input files] [options]

# 举例说明
terser js/file1.js -o foo.min.js -c -m
```

命令中，符号的含义，和可传的参数：

`-c`: compress option，更多参数详见[文档](https://github.com/terser/terser#compress-options)

- `arrows`：将 class 或者 object 中的函数，转成箭头函数；
- `arguments`：将函数中使用 `arguments[index]` 转成对应的形参名称；
- `dead_code`：移除不可达的代码（用于 tree shaking）；

`-m` mangle option，更多参数详见[文档](https://github.com/terser/terser#mangle-options)

- `toplevel`：默认值是 `false`，是否对顶层作用域中的变量名称，进行丑化（转换）；
- `keep_classnames`：默认值是 `false`，是否保持依赖的类名称；
- `keep_fnames`：默认值是 `false`，是否保持原来的函数名称；

```shell
npx terser ./src/abc.js -o abc.min.js -c arrows, arguments=true, dead_code -m
toplevel=true, keep_classnames=true, keep_fnames=true
```

### 2.在 webpack 中使用

在 webpack 中，配置 `minimizer` 属性（默认 `production` 模式下，配置了使用 `TerserPlugin`，来处理代码）；

如果对默认配置不满意，也可以自己创建 `TerserPlugin` 的实例，并覆盖相关的配置；

首先，配置 `minimize: true`，表示对代码进行压缩（默认 `production` 模式下，已经打开了）

然后，在 `minimizer` 创建一个 `TerserPlugin`：

- `extractComments`：默认值为 `true`，表示会将注释抽取到一个单独的文件中；
  - 不希望保留注释时，可设置为 `false`；
- `parallel`：使用多进程并发运行提高构建的速度，默认值是 `true`
  - 并发运行的默认数量：os.cpus().length - 1；也可自行设置，通常使用默认值即可；
- `terserOptions`：设置我们的 terser 相关的配置
  - `compress`：设置压缩相关的选项；
  - `mangle`：设置丑化相关的选项，可直接设置为 `true`；
  - `toplevel`：顶层变量是否进行转换；
  - `keep_classnames`：保留类的名称；
  - `keep_fnames`：保留函数的名称；

demo-project\12_webpack 优化-JS-CSS 压缩\webpack.config.js

```js
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  optimization: {
    minimize: true,

    // 代码优化: TerserPlugin => 让代码更加简单 => Terser
    minimizer: [
      // JS压缩的插件: TerserPlugin
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          compress: {
            arguments: true,
            unused: true
          },
          mangle: true,
          // toplevel: false
          keep_fnames: true
        }
      })
    ]
  }
}
```

webpack 中的 `TerserPlugin`，底层用的就是 _Terser_ 工具。

## 二、CSS 压缩

（掌握），webpack 默认没有配置 css 压缩，通常要自行配置

CSS 压缩，通常是去除，无用的空白（空格，换行）；很难修改选择器、属性的名称、值等；

要使用一个插件：_css-minimizer-webpack-plugin_；底层使用 cssnano 工具来优化、压缩 CSS（该工具也可以单独使用）；

1.安装 css-minimizer-webpack-plugin：

```shell
npm install css-minimizer-webpack-plugin -D
```

2.在 `optimization.minimizer` 中配置

`parallel` 可不配置，默认也是 `true`。

demo-project\12_webpack 优化-JS-CSS 压缩\webpack.config.js

```js
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  optimization: {
    minimize: true,

    // 代码优化: TerserPlugin => 让代码更加简单 => Terser
    minimizer: [
      // CSS压缩的插件: CSSMinimizerPlugin
      new CSSMinimizerPlugin({
        parallel: true
      })
    ]
  }
}
```

## 四、配置文件抽取

webpack 配置文件抽取，分生产、开发环境，抽取配置文件。

在 `package.json` 中的 "build"，"serve" 命令后，加上 `--env` 命令。

demo-project\13_webpack 优化-配置的分离\package.json

```json
{
  "scripts": {
    "build": "webpack --config ./config/comm.config.js --env production",
    "serve": "webpack serve --config ./config/comm.config.js --env development"
  }
}
```

webpack 的配置文件 `comm.config.js` 中，使用 `module.exports` 导出一个**函数**。

webpack 会执行这个函数，加载返回的对象。

1.在导出的函数中，会传入 `env` 对象，在其中获取环境变量。

2.安装 _webpack-merge_ 插件。在 `comm.config.js` 中，使用

```shell
pnpm add webpack-merge -D
```

3.在 `comm.config.js` 中，动态的加载 `MiniCssExtractPlugin.loader`

demo-project\13_webpack 优化-配置的分离\config\comm.config.js

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { ProvidePlugin } = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { merge } = require('webpack-merge')
const devConfig = require('./dev.config')
const prodConfig = require('./prod.config')

/**
 * 抽取开发、生产环境的配置文件
 * 1.将配置文件导出的是一个函数, 而不是一个对象
 * 2.从上向下，查看所有的配置属性，应该属于哪一个文件
 * * comm/dev/prod
 * 3.针对单独的配置文件进行定义化
 * * css 加载: 使用的不同的 loader 可以根据 isProduction 动态获取
 */
const getCommonConfig = function (isProdution) {
  return {
    entry: './src/main.js',
    output: {
      clean: true,
      path: path.resolve(__dirname, '../build'),
      // placeholder
      filename: 'js/[name]-bundle.js',
      // 单独针对分包的文件进行命名
      chunkFilename: 'js/[name]_chunk.js'
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
            loader: 'babel-loader'
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
            isProdution ? MiniCssExtractPlugin.loader : 'style-loader',
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
module.exports = function (env) {
  const isProduction = env.production
  let mergeConfig = isProduction ? prodConfig : devConfig
  return merge(getCommonConfig(isProduction), mergeConfig)
}
```

复制两份 `comm.config.js`，更名为 `dev.config.js` 和 `prod.config.js`；

在其中导出的对象，不需要使用函数。

demo-project\13_webpack 优化-配置的分离\config\dev.config.js

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { ProvidePlugin } = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CSSMinimizerPlugin = require('css-minimizer-webpack-plugin')

module.exports = {
  mode: 'development',
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
  plugins: []
}
```

生产环境，所需要的配置更多。

demo-project\13_webpack 优化-配置的分离\config\prod.config.js

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { ProvidePlugin } = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CSSMinimizerPlugin = require('css-minimizer-webpack-plugin')

module.exports = {
  mode: 'production',
  // 优化配置
  optimization: {
    chunkIds: 'deterministic',
    // runtime 的代码是否抽取到单独的包中(早Vue2脚手架中)
    runtimeChunk: {
      name: 'runtime'
    },
    // 分包插件: SplitChunksPlugin
    splitChunks: {
      chunks: 'all',
      minSize: 10,

      // 自己对需要进行拆包的内容进行分包
      cacheGroups: {
        utils: {
          test: /utils/,
          filename: 'js/[id]_utils.js'
        },
        vendors: {
          // /node_modules/
          // window上面 /\
          // mac上面 /
          test: /[\\/]node_modules[\\/]/,
          filename: 'js/[id]_vendors.js'
        }
      }
    },
    minimize: true,
    // 代码优化: TerserPlugin => 让代码更加简单 => Terser
    minimizer: [
      // JS压缩的插件: TerserPlugin
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          compress: {
            arguments: true,
            unused: true
          },
          mangle: true,
          // toplevel: false
          keep_fnames: true
        }
      }),
      // CSS 压缩的插件: CSSMinimizerPlugin
      new CSSMinimizerPlugin({
        // parallel: true
      })
    ]
  },
  plugins: [
    // 完成css的提取
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[name]_chunk.css'
    })
  ]
}
```

## 五、tree shaking

Tree Shaking 是一个术语，在计算机中，表示消除死代码（dead_code）；

该思想最早起源于 LISP 语言，用于消除未调用的代码；

- 未调用的纯函数，无副作用，可以放心的消除（在进行函数式编程时，尽量使用纯函数的原因之一）；

Tree Shaking 也被应用于其他的语言，比如 JavaScript、Dart；

JavaScript 的 Tree Shaking：

- 最早源自打包工具 rollup；
- 依赖于 ES Module 的静态语法分析（静态分析模块的依赖关系）；
- webpack 2 正式内置支持了 ES2015 模块，和检测未使用模块的能力；
- webpack 4 正式扩展了这个能力，可通过 `package.json` 的 `sideEffects` 属性作为标记，告知 webpack 在编译时，哪些文件可以安全的删除掉；
- webpack 5 中，也提供了对部分 CommonJS 模块化方案的 tree shaking 的支持；详见[更新日志](https://github.com/webpack/changelog-v5#commonjs-tree-shaking)。

### 1.webpack 中使用

在 webpack 中，实现 Tree Shaking，可采用两种不同的方案：

- `usedExports`：自动标记未被使用的函数，再通过 Terser 工具，来进行优化；
- `sideEffects`：跳过整个模块/文件，直接查看该文件，是否有副作用；

### 2.usedExports

使用 `usedExports` 方案，打包如下结构的代码：

其中 `mul` 函数，未被使用过。

demo-project\14_webpack 优化-TreeShaking\src\demo\math.js

```js
export function sum(num1, num2) {
  return num1 + num2
}

export function mul(num1, num2) {
  return num1 * num2
}
```

demo-project\14_webpack 优化-TreeShaking\src\demo.js

```js
import { sum } from './demo/math'

console.log(sum(20, 30))
```

`mode: production` 模式下，自动开启 `usedExports` 并在 `minimize` 和 `minimize` 上，做了很多优化

为清晰地看到 `usedExports` 的效果，

- 配置 `mode: development`；
- 注释 `minimize`、`minimizer` 配置；

配置 `usedExports: true`：

demo-project\14_webpack 优化-TreeShaking\config\prod.config.js

```js
module.exports = {
  mode: 'development',
  devtool: false,
  // 优化配置
  optimization: {
    // 导入模块时, 分析模块中的哪些函数有被使用, 哪些函数没有被使用.
    usedExports: true
  }
}
```

`usedExports` 会使用注释，在打包后的文件，标识可删除的代码，结合 Terser 可删除掉。

```js
// unused harmony export mul；
function mul(num1, num2) [
  return num1 * num2
]
```

这段注释的意义是，告知 _Terser_ 在优化时，可以删除掉这段代码；

这个时候，配置 `minimize: true`：

- 若配置 `usedExports: false`，mul 函数没有被移除掉；
- 若配置 `usedExports: true`，mul 函数才被移除掉；

所以，`usedExports` 实现 Tree Shaking 是结合 _Terser_ 来完成的。

然而，`usedExports` 没办法做到，删除整个没有使用的模块，因为考虑到，引用的模块，可能存在副作用，如下：

demo-project\14_webpack 优化-TreeShaking\src\demo\parse-lyric.js

```js
// 模块的副作用代码
// 推荐: 在平时编写模块的时候, 尽量编写纯模块
window.lyric = '哈哈哈哈哈'
```

> 推荐，在平时编写模块化代码时，尽量使用”纯模块“。

这种情况，需要使用 `sideEffects` 配置，告诉 webpack 项目中存在副作用的模块，以便更好地进行 tree shaking；

### 3.sideEffects

`sideEffects` 用于告知 webpack compiler，哪些模块有副作用：

- 副作用在这里，可理解为：代码有执行一些特殊的任务，不能仅仅通过 export 来判断这段代码的意义；
- React、JS 的纯函数中，都涉及副作用的概念。

在 `package.json` 中，配置 `"sideEffects": false`，告知 webpack 可以安全的删除项目中所有未用到的 `exports`（表示没有副作用代码）；

demo-project\14_webpack 优化-TreeShaking\package.json

```json
{
  "sideEffects": false
}
```

通常，在项目入口，引入 css 代码，默认也会被 tree shaking 掉。

配置项目中的 css 文件，不要被 tree shaking；

配置项目中有副作用的代码，不要被 tree shaking 掉：

demo-project\14_webpack 优化-TreeShaking\package.json

```json
{
  "sideEffects": ["*.css", "./src/demo/parse-lyric.js"]
}
```

### 4.最佳实践

对项目中 JavaScript 代码，进行 Tree Shaking（生成环境）：

- 在 `optimization` 中配置 `usedExports: true`，来帮助 Terser 进行优化；
- 在 `package.json` 中配置 `sideEffects`，对打包进行优化；
