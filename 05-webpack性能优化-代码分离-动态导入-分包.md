# webpack 性能优化 & 代码分离 & 动态导入 & 分包

## 一、webpack 性能优化

目前，webpack 作为前端使用最广泛的打包工具，常见的【面试】题有：

- 可以配置哪些属性，来进行 webpack 性能优化？
- 前端有哪些常见的性能优化？（除了其他常见的，也完全可以从 webpack 来回答）

> 【回顾】：防抖，节流，精灵图，回流，重绘...；
>
> react 中，memo，高阶组件...

webpack 的性能优化较多，主要有两种分类：

- 优化一：**打包后的结果**（重点），主要指上线时的性能优化；
  - 比如：分包处理、减小包体积、CDN 服务器、压缩丑化，tree shaking...
- 优化二：**优化打包速度**，开发或者构建时，优化打包速度；
  - 比如：exclude、cache-loader...

大多数情况下，会更侧重于**优化一**，因为这对于线上的产品影响更大。

事实上，在大多数情况下，webpack 默认做好了该有的性能优化：

- 比如：配置 `mode` 为 `production` | `development` 时，默认 webpack 的配置；

也可以针对性的，自行进行项目优化；

## 二、代码分离是什么？

默认情况下，所有的 JS 代码，都被打包到了一个 bundle.js 文件中，如：

- 模块化的业务代码；
- 第三方依赖；
- 暂时没有用到的模块；
- ...

此时，浏览器在加载首页时，会一次性地加载所有代码，影响首屏渲染速度，用户可能长时间看到的是空白页面。

**代码分离（Code Splitting）**，是 webpack 一个非常重要的特性：

主要目的是，将代码分离到不同的 bundle.js（打包文件）中；

浏览器可按需加载，或并行加载这些文件；

代码分离，主要作用是：

- 拆分出更小的 bundle；
- 控制资源加载优先级，

以此提高浏览器加载代码的性能；

Webpack 中常用的代码分离有三种方式：

- 方式一：多入口：使用 `entry` 配置手动分离代码；

  - 防止重复：使用 _Entry Dependencies_ 或者 _SplitChunksPlugin_ 去重和分离代码；

- 方式二：动态导入：通过模块的内置函数（`import`）调用，来分离代码；

- 方式三：自定义分包：使用 `splitChunk` 配置，打包第三方依赖。

除此之外，还有如下方式：

- prefetch、preload；
- SSR（1.加快首屏渲染速度；2.增加 SEO 优化）。

## 三、多入口（了解）

webpack 默认从一个入口（`./src/index.jS`）开始打包，形成一个依赖图。

如果需要有多入口，每个入口分别有自己的代码逻辑，可在 webpack 配置多入口。

- 比如：分别配置一个 `index.js` 和 `main.js` 的入口；

创建另一个入口 `main.js`：

demo-project\05_webpack 分包-入口起点\src\main.js

```js
// index.js 作为入口
const message = 'Hello Main'
console.log(message)

function bar() {
  console.log('bar function exec~')
}
bar()
```

在 `webpack.config.js` 文件中，配置多入口。

- 配置 `entry` 为对象。
- 配置 `output.filename`，使用 placeholder 语法。

demo-project\05_webpack 分包-入口起点\webpack.config.js

```js
module.exports = {
  mode: 'development',
  devtool: false,
  // entry: './src/index.js',
  entry: {
    index: './src/index.js',
    main: './src/main.js'
  },
  output: {
    path: path.resolve(__dirname, './build'),
    // placeholder
    filename: '[name]-bundle.js',
    clean: true
  }
}
```

打包后的 `Index.html` 文件：

demo-project\05_webpack 分包-入口起点\build\index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script defer src="index-bundle.js"></script>
    <script defer src="main-bundle.js"></script>
    <script defer src="shared-bundle.js"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

> 回顾：
>
> - \<script defer\>;
> - output.filename 的占位符；

缺点：两个入口，都依赖相同的库（如 _axios_），这个库会被打包两次。

### 1.防止重复打包

如果 `index.js` 和 `main.js`，都依赖这一个库：_axios_；

那么默认情况下，打包后的两个 bunlde.js，都包含了 _axios_；

配置共享，避免重复打包；在 `entry` 中，配置 `shared`。

demo-project\05_webpack 分包-入口起点\webpack.config.js

```js
module.exports = {
  mode: 'development',
  devtool: false,
  // entry: './src/index.js',
  entry: {
    index: {
      import: './src/index.js',
      dependOn: 'shared'
    },
    main: {
      import: './src/main.js',
      dependOn: 'shared'
    },
    shared: ['axios']
  }
}
```

## 四、动态导入（掌握）

动态导入，也可对代码打包，进行拆分；

webpack 提供了两种实现动态导入的方式：

- 第一种，使用 ECMAScript 中的 `import` 函数，是目前推荐的方式；
- 第二种（不推荐），使用 webpack 遗留的 `require.ensure`，也是 Vue2 中使用的方式；

比如有一个模块 bar.js：

- 在 if 代码块中，判断一个条件成立时加载加载该模块；
- 因不确定这个模块中的代码，一定会被加载，所以，打包时，最好将该模块，拆分成一个独立的 js 文件；
- 没用到该内容时，浏览器不需要加载该模块；
- 这时，就可使用“动态导入“；

在 webpack 中，通过动态导入，会获取到一个对象；默认导出的内容，在该对象的 `default` 属性中，所以需要做解构；

模拟路由。代码懒加载。

创建 `router/about.js`，`router/categoryu.js`

demo-project\06_webpack 分包-动态导入\src\router\about.js

demo-project\06_webpack 分包-动态导入\src\router\category.js

使用 `import` 函数（es6 语法），动态导入模块。

demo-project\06_webpack 分包-动态导入\src\main.js

```js
const btn1 = document.createElement('button')
const btn2 = document.createElement('button')
btn1.textContent = '关于'
btn2.textContent = '分类'
document.body.append(btn1)
document.body.append(btn2)

btn1.onclick = function () {
  import(/* webpackChunkName: "about" */ './router/about').then(res => {
    res.about()
    res.default()
  })
}

btn2.onclick = function () {
  import(/* webpackChunkName: "category" */ './router/category')
}
```

> vue/react 都有配置懒加载，以进行分包打包。

在 `webpack.config.js` 中，为动态导入的模块，打包的文件命名：

- 因为动态导入，一定会打包成独立的文件，所以并不会在 `cacheGroups` 中进行配置；
- 命名动态导入打包后的文件，通常在 `output` 中，通过 `chunkFilename` 属性来配置；
- 默认情况下，placeholder 的 `[name]` 和 `[id]` 名称是一致的；
- 如果要修改 `[name]` 的值，要通过上面 magic comments（魔法注释）的方式；

demo-project\06_webpack 分包-动态导入\webpack.config.js

```js
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
    // 单独针对分包的文件，进行命名
    chunkFilename: '[name]_chunk.js'
  }
}
```

## 五、自定义分包

在 `webpack.config.js` 中，配置 `optimization.splitChunk`；

底层使用 _SplitChunksPlugin_ 来实现：该插件 webpack5 已内置，并提供了默认配置。

- 比如默认配置中，chunks 仅仅针对于异步（async）请求，如 `import` 函数；

_axios_，_react_，...，第三方依赖的库，默认会打包在主包中；如果希望将他们和主包分开，使用自定义分包。

手动配置 `splitChunks`；

demo-project\07_webpack 分包-自定义分包\webpack.config.js

```js
module.exports = {
  // 优化配置
  optimization: {
    // 分包插件: SplitChunksPlugin
    splitChunks: {
      chunks: 'all'
    }
  }
}
```

### 1.配置解析

`chunks`:

- `async`：默认值。
- `all`：表示对同步和异步代码都进行处理。

`minSize`：

- 只有大于这个数，才会拆包。默认 20kb；

`maxSize`：

- 将大于 maxSize 的包，拆分为不小于 minSize 的包；
- 有时，拆分的包，可能还是会大于 maxSize，因为如果一个函数的代码大小，就大于该最大值，是没法再拆分的。

`cacheGroups`：

- 用于对拆分的包，就行分组，比如一个 _lodash_ 在拆分之后，并不会立即打包，而是会等到有没有其他符合规则的包一起来打包；
- `test` 属性：匹配符合规则的包；
- `name` 属性：拆分包的 name 属性；
- `filename` 属性：拆分包的名称，可以使用 placeholder 属性；

`cacheGroups` 匹配 `utils` 目录下的包；匹配 `node_module` 目录下的包，

- 为适配 Windows 系统，使用 `\/` 匹配。

demo-project\07_webpack 分包-自定义分包\webpack.config.js

```js
module.exports = {
  optimization: {
    // 分包插件: SplitChunksPlugin
    splitChunks: {
      chunks: 'all',
      // 当一个包大于指定的大小时, 继续进行拆包
      // maxSize: 20000,
      // // 将包拆分成不小于minSize的包
      // minSize: 10000,
      minSize: 10,

      // 自己对需要进行拆包的内容进行分包
      cacheGroups: {
        utils: {
          test: /utils/,
          filename: '[id]_utils.js'
        },
        vendors: {
          // /node_modules/
          // window 上面 /\
          // mac 上面 /
          test: /[\\/]node_modules[\\/]/,
          filename: '[id]_vendors.js'
        }
      }
    }
  }
}
```

## 六、消除注释

在 `minimizer` 中，配置 `TerserPlugin` 插件。

### 1.TerserPlugin 插件

webpack 打包时，当 `mode: production`，有对包中的注释进行单独提取。

取消注释的提取，使用 TerserPOlugin 插件进行配置。

```js
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  optimization: {
    // 代码优化: TerserPlugin => 让代码更加简单 => Terser
    minimizer: [
      // JS 代码简化
      new TerserPlugin({
        extractComments: false
      })
    ]
  }
}
```

> 使用 pnpm 时，找不到 terser-webpack-plugin 包，重新安装一下。
>
> ```shell
> pnpm add terser-webpack-plugin -D
> ```

## 七、[id]占位符

在 `optimization` 中，配置 `chunkIds`；

在 webpack 打包时，`mode: production` 和 `mode: development`；两种模式；placeholder 的 `[id]` 打包名称不同。

配置 `optimization.chunkIds`，用于告知 webpack 打包模块文件名中的 id，采用什么算法生成。

有三个比较常见的值：

- `natural`：id 时顺序排列的数字，如 1, 2, 3, ...
  - 打包时会消耗性能，不利于浏览器缓存。
- `named`：`mode: development` 下的默认值，id 是一个可读的名称（如文件的路径，组成的名称）；
- `deterministic`：确定性的，id 在不同的编译模式中，是不变的短数字
  - webpack 4 中，没有这个值；
  - 那个时候如果使用 `natural`，那么在一些编译发生变化时，就会有问题；

最佳实践：

- 开发过程中，推荐使用 `named`；
- 打包过程中，推荐使用 `deterministic`；

demo-project\07_webpack 分包-自定义分包\webpack.config.js

```js
module.exports = {
  // 优化配置
  optimization: {
    // 设置生成的 chunkId 的算法
    // development 模式下用 named
    // production 模式下用 deterministic (确定性)
    // webpack4 中使用: natural
    chunkIds: 'deterministic',
    // 分包插件: SplitChunksPlugin
    splitChunks: {
      chunks: 'all',
      // 当一个包大于指定的大小时, 继续进行拆包
      // maxSize: 20000,
      // // 将包拆分成不小于 minSize 的包
      // minSize: 10000,
      minSize: 10,

      // 自己对需要进行拆包的内容进行分包
      cacheGroups: {
        utils: {
          test: /utils/,
          filename: '[id]_utils.js'
        },
        vendors: {
          // /node_modules/
          // window上面 /\
          // mac上面 /
          test: /[\\/]node_modules[\\/]/,
          filename: '[id]_vendors.js'
        }
      }
    }
  }
}
```
