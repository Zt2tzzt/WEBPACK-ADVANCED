# webpack 性能优化 & 代码分离 & 动态导入 & 分包

## 一、webpack 性能优化

目前，webpack 作为前端使用最广泛的打包工具，常见的【面试】题有：

- 可以配置哪些属性来进行 webpack 性能优化？
- 前端有哪些常见的性能优化？（除了其他常见的，也完全可以从 webpack 来回答）

> 【回顾】：防抖，节流，精灵图，回流，重绘...
>
> react 中，mome，高阶组件...

webpack 的性能优化较多，我们可以对其进行分类：

- 优化一：**打包后的结果**（重点），上线时的性能优化；
  - 比如：分包处理、减小包体积、CDN 服务器、压缩丑化，tree shaking...
- 优化二：**优化打包速度**，开发或者构建时，优化打包速度；
  - 比如：exclude、cache-loader...

大多数情况下，会更侧重于优化一，这对于线上的产品影响更大。

在大多数情况下 webpack 都帮我们做好了该有的性能优化：

- 比如配置 `mode` 为 `production` 或者 `development` 时，默认 webpack 的配置信息；
- 但是，我们也可以针对性的，进行自己的项目优化；

## 二、代码分离

代码分离（Code Splitting）是 webpack 一个非常重要的特性：

主要目的是，将代码分离到不同的 bundle 中，之后我们可以按需加载，或者并行加载这些文件；

- 比如默认情况下，所有的 JavaScript 代码都被打包到了一个 bundle.js 文件中，如：
  - 模块化的业务代码；
  - 第三方依赖；
  - 暂时没有用到的模块；
  - ...
- 在首页一次性加载，就会影响首页渲染速度，用户长时间看到的是空白页面。

代码分离，可以分出更小的 bundle，以及控制资源加载优先级，提供代码的加载性能；

Webpack 中常用的代码分离有三种方式：

- 入口起点：使用 entry 配置手动分离代码；
- 防止重复：使用 Entry Dependencies 或者 SplitChunksPlugin 去重和分离代码；
- 动态导入：通过模块的内联函数调用，来分离代码；

除此之外，还有如下方式：

- prefetch、preload；
- SSR（1.加快首屏渲染速度；2.增加 SEO 优化）。

## 三、多入口

了解，用的少。

webpack 默认从一个入口开始打包，形成一个依赖图。

如果需要有多入口，每个入口分别有自己的代码逻辑，那么可在 webpack 配置多入口时。

- 比如配置一个 `index.js` 和 `main.js` 的入口；

创建另一个入口 `mian.js`：

demo-project\05_webpack分包-入口起点\src\main.js

```js
// index.js作为入口
const message = "Hello Main"
console.log(message)

function bar() {
  console.log('bar function exec~')
}
bar()
```

在 `webpack.config.js` 文件中，配置多入口。

- 配置 `entry` 为对象。
- 配置 `output.filename`，使用 placeholder

demo-project\05_webpack分包-入口起点\webpack.config.js

```js
module.exports = {
  mode: 'development',
  devtool: false,
  // entry: './src/index.js',
  entry: {
    index: './src/index.js',
    main: './src/main.js',
  },
  output: {
    path: path.resolve(__dirname, './build'),
    // placeholder
    filename: '[name]-bundle.js',
    clean: true
  },
}
```

> 回顾：\<script defer\>、output.filename 的占位符；

缺点：都依赖相同的库，那么这个库会被打包多次。



入口依赖

在 entry 中，配置 share。

---

webpack 动态导入 掌握

懒加载的概念，vue/react 都有，分包打包。



模拟路由。代码懒加载。

创建 router/about.js，router/categoryu.js

回顾 es6 语法，import 函数。



为打包的文件名，命名。

- 使用 chunkfilename；
- 使用魔法注释。会在 chunkname 中的 [name] 中，生效。

---

splitChunkPlugin

webpack 内置的插件，以前没有，现在内置了

相比起动态导入，不需要 import 才能分包，可自定义分包。



axios，react 等依赖的库，默认会打包在主包中；

如果希望将他们和主包分开，使用自定义分包。



cacheGroups 匹配 node_module 时，\/ 匹配。

默认 minSize: 20kb，只有大于这个数，才会拆包。



splitchunks 自定义配置名称。

当模式改为 production，打包时加了注释。使用 terserPOlugin 插件。



production，development 模式下，打包名称不同。

chunkIds 配置。

---

prefetch 和 preload

通过魔法注释，做预获取或预加载。

---

CDN 加速服务器配置。

---

CSS 单独抽取

