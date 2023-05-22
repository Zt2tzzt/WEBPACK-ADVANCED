# runtime 分包 & 预加载 & CDN & 提取 CSS & DLL 库

## 一、runtime 分包

在 `webpack.config.js` 中，配置 `optimization.runtimeChunk`。

表示 runtime 相关的代码，是否要抽取到一个单独的 chunk 中：

runtime 相关的代码，指的是：在运行环境中，解析、加载、模块信息的代码；

- 比如 component、bar 两个模块，通过 `import` 函数动态导入，就是通过 runtime 代码完成的；

将 runtime 代码抽离出来后，有利于浏览器缓存策略：

- 比如：修改了业务代码（main），那么 runtime 和 component、bar 的 chunk 是不需要重新加载的；
- 又比如，修改了 component、bar 的代码，那么 main 中的代码是不需要重新加载的；

设置的值：

- `true`/`multiple`：针对每个入口，打包一个 runtime 文件；
- `single`：打包一个 runtime 文件；
- 对象：其中 `name` 属性，决定 runtimeChunk 的名称；

demo-project\07_webpack分包-自定义分包\webpack.config.js

```js
module.exports = {
  // 优化配置
  optimization: {
    // runtime 的代码是否抽取到单独的包中(早 Vue2 脚手架中)
    runtimeChunk: {
      name: 'runtime'
    }
  }
}
```

详见[官方文档](https://webpack.docschina.org/configuration/optimization/#optimizationruntimechunk)。

## 二、prefetch、preload

webpack v4.6.0+，增加了对预获取、预加载的支持。

在使用 `import` 函数动态导入时，使用如下内置指令，来告知浏览器：

- prefetch (预获取)：未来某些导航下可能需要的资源
- preload (预加载)：当前导航下可能需要资源

prefetch 与 preload 指令有何不同？

- preload chunk 会在父 chunk 加载时，以**并行**方式加载；prefetch chunk 会在父 chunk 加载结束后加载。
- preload chunk 具有中等优先级，会立即下载；prefetch chunk 在浏览器闲置时下载。
- preload chunk 用于当前的时刻；prefetch chunk 用于未来的某个时刻。

开发时，推荐使用 prefetch。

在代码中，配置 about，category 模块动态加导入时，使用 prefetch，使用魔法注释。

demo-project\07_webpack 分包-自定义分包\src\main.js

```js
const btn1 = document.createElement('button')
const btn2 = document.createElement('button')
btn1.textContent = '关于'
btn2.textContent = '分类'
document.body.append(btn1)
document.body.append(btn2)

btn1.onclick = function () {
  import(
    /* webpackChunkName: "about" */
    /* webpackPrefetch: true */
    './router/about'
  ).then(res => {
    res.about()
    res.default()
  })
}

btn2.onclick = function () {
  import(
    /* webpackChunkName: "category" */
    /* webpackPrefetch: true */
    './router/category'
  )
}
```

## 三、CDN

CDN 称之为**内容分发网络 Content Delivery Network** 或 **Content Distribution Network**，缩写：CDN。

- 利用相互连接的网络系统，使用最靠近用户的服务器，提供服务；
- 更快、更可靠地，将音乐、图片、视频、应用程序、其他文件...发送给用户；
- 为用户提供，高性能、可扩展性、低成本的网络内容；

![CDN](https://knowledge.sakura.ad.jp/wp-content/uploads/2018/10/cdn-on-440x274.png)

在开发中，使用 CDN 主要是两种方式：

### 1.所有打包文件放在 CDN

打包的所有静态资源，放到 CDN 服务器；

需要购买自己的 CDN 服务器；

- 阿里、腾讯、亚马逊、Google...都可以购买 CDN 服务器；

在 `webpack.config.js` 中，配置 `output.publicPath`，在打包时，添加上自己的 CDN 地址；

demo-project\08_webpack 分包-CDN 服务器\webpack.config.js

```js
module.exports = {
  mode: 'production',
  devtool: false,
  entry: './src/main.js',
  output: {
    clean: true,
    path: path.resolve(__dirname, './build'),
    // placeholder
    filename: '[name]-bundle.js',
    // 单独针对分包的文件进行命名
    chunkFilename: '[name]_chunk.js',
    publicPath: 'http://coderzztcdn.com/'
  }
}
```

打包后的 `index.html` 文件中：

demo-project\08_webpack 分包-CDN 服务器\build\index.html

```html
<script src="https://coderzztcdn.com/runtime-main.bundle.js"></script>
<script src="https://coderzztcdn.com/952_vendors.js"></script>
...
```

### 2.第三方库引用 CDN

通常比较知名的开源框架，会将打包后的源码，放到比较知名的，免费的 CDN 服务器上：

- 国际上知名的 CDN 服务器有：unpkg、JSDelivr、cdnjs；
- 国内好用的 CDN 服务器有：bootcdn；

在项目中，引入的第三方框架，使用 CDN 服务器上的资源，有两步：

1. 通过 webpack 配置，来排除第三方库的打包：
2. 在 html 模块中，自行加入对应的 CDN 服务器地址；

:egg: 案例理解：

比如，项目中使用了 axios、react 两个库。

demo-project\08_webpack 分包-CDN 服务器\src\main.js

```js
import axios from 'axios'
import React from 'react'
```

在 `webpack.config.js` 中，配置 `externals`，注意 key、value 的含义。

demo-project\08_webpack 分包-CDN 服务器\webpack.config.js

```js
module.exports = {
  externals: {
    // key 属性名: 排除的框架的名称
    // value 值: 从 CDN 地址请求下来的 js 中，提供的名称
    react: 'React',
    axios: 'axios'
  }
}
```

在 `index.html` 模板中，加入 CDN 服务器地址：

demo-project\08_webpack 分包-CDN 服务器\index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="https://cdn.bootcdn.net/ajax/libs/axios/1.2.0/axios.min.js"></script>
    <script src="https://cdn.bootcdn.net/ajax/libs/react/18.2.0/umd/react.production.min.js"></script>
  </body>
</html>
```

## 四、shimming

shimming 是一个概念，是某一类功能的统称，用于**预置全局变量**：

shimming 直译为：垫片；表示给代码填充一些垫片来处理一些问题；

- 比如：项目依赖一个第三方的库，该库本身又依赖 *lodash*，但没有对 *lodash* 进行导入（认为全局存在 lodash），
- 那么就要通过 `ProvidePlugin` 来实现 shimming 的效果；
  - key，value 与上面 CDN 的 `externals` 意义相反；

配置 `ProvidePlugin`，在每个模块中，通过一个变量来获取一个 package；

webpack 会在最终的 bundle 中，引入这个模块；

`ProvidePlugin` 是 webpack 默认的一个插件，不需要专门安装；

demo-project\09_webpack垫片-shimming\src\abc.js

```js
// import axios from 'axios'
// import dayjs from 'dayjs'

// 使用了 axios、dayjs 但并未引入。
axios.get('http://123.207.32.32:8000/home/multidata').then(res => {
  console.log(res)
})

// console.log(axios)

console.log(dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'))
```

demo-project\09_webpack垫片-shimming\webpack.config.js

```js
const { ProvidePlugin } = require('webpack')

module.exports = {
  plugins: [
    new ProvidePlugin({
      axios: ['axios', 'default'],
      dayjs: 'dayjs'
    })
  ]
}
```

> 因为 axios 库的导出方式，要使用 axios.default 获取导出的实例。

Webpack 的理念，是使前端开发更加模块化，不推荐随意的使用 shimming。

## 五、css 提取（掌握）

`MiniCssExtractPlugin` 可将打包后的 css，提取到一个独立的 css 文件中；

在 webpack 4+ 中，才可以使用该插件。

安装 mini-css-extract-plugin：

```shell
npm install mini-css-extract-plugin -D
```

在 `webpack.config.js`中，配置 `rules` 和 `plugins`：

demo-project\10_webpack优化-提取css文件\webpack.config.js

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // 'style-loader', 开发阶段
          MiniCssExtractPlugin.loader, // 生产阶段
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    // 完成 css 的提取
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[name]_chunk.css' // 对于动态导入的 css，进行分包，用 `chunkFilename`
    })
  ]
}
```

一般在生产环境下，使用该插件；使用后，就不需要使用 *styled-loader*；

一般在开发环境中使用 *styled-loader*；

## 六、placeholder hash

上面的配置中，给打包的文件命名时，通常会使用 placeholder；

placeholder 中，有几个 hash 相关的占位符，分别是：**hash**、**chunkhash**、**contenthash**

- hash 表示通过，MD4 的散列函数处理，生成一个 128 位的 hash 值（32 个十六进制）；

**hash** 值的生成和整个项目的代码都有关系（不利于浏览器做缓存）：

- 比如：项目打包有两个入口 `index.js` 和 `main.js`；它们分别打包到不同的 bundle 文件中，并且在文件名称中，我们有使用 hash；
- 这时，如果修改了 `index.js` 文件中的内容，那么所有的打包文件的 hash，都会发生变化；

**chunkhash** 可以解决上面的问题，它会根据**不同的打包入口**，进行解析，来生成 hash 值：

- 比如：修改了 `index.js`，那么 `main.js` 的 chunkhash 是不会发生改变的；

**contenthash**（推荐使用）表示生成的文件 hash 名称，只和内容有关系：

- 比如：`index.js`，引入了一个 `style.css`，打包时，该文件要被抽取到一个独立的 css 文件中；
- 这个 css 文件在命名时，如果使用的是 `chunkhash`；那么当 `index.js` 文件的内容发生变化时，css 文件的命名，也会发生变化；
- 这时，使用 contenthash；打包文件名不会改变。

`contentHash` 和 `chunkHash` 的区别，在于**非多入口**的代码分包，名称会有所不同

- 比如 动态导入，自定义分包...

用 css 提取做演示。

demo-project\11_webpack补充-hash的值\webpack.config.js

```js
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
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[contenthash]_[name].css'
    })
  ]
}
```

## 七、dll 库（了解）

DLL 全称是：**动态链接库（Dynamic Link Library**），是为软件在 Windows 中，共享函数库的一种实现方式；

webpack 中，也有内置 DLL 的功能，把能够共享，并且不经常改变的代码，抽取成一个共享的库；

- 这个库，在之后编译的过程中，会被引入到其他项目的代码中；

DLL 库的使用分为两步:

- 第一步：打包一个 DLL 库；
- 第二步：项目中引入 DLL 库；

> 在升级到 webpack4 之后，已经有足够的性能，不需要再使用 dll；
>
> React 和 Vue 脚手架，都移除了 DLL 库。
>
> 知道有这么一个概念即可。
