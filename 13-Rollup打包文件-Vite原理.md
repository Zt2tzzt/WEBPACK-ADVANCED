# Rollup 打包文件 & Vite 原理

## 一、rollup 插件

### 1.css 文件处理

处理 css 文件，安装 *postcss*、*postcss-preset-env*、*rollup-plugin-postcss*：

```shell
pnpm add postcss rollup-plugin-postcss postcss-preset-env -D
```

在 `rollup.config.js` 中，配置 postcss 的插件：

demo-project\25_rollup-rollup业务打包\rollup.config.js

```js
// 默认lodash没有被打包是因为它使用commonjs, rollup默认情况下只会处理es module
const commonjs = require('@rollup/plugin-commonjs')
const nodeResolve = require('@rollup/plugin-node-resolve')
const postcss = require('rollup-plugin-postcss')

// 使用代码转换和压缩
const { babel } = require('@rollup/plugin-babel')
const terser = require('@rollup/plugin-terser')

module.exports = {
  // 入口
  input: './lib/index.js',
  // 出口
  output: {
    format: 'umd',
    name: 'whyUtils',
    file: './build/bundle.umd.js',
    globals: {
      lodash: '_'
    }
  },
  external: ['lodash'],
  plugins: [
    commonjs(),
    nodeResolve(),
    babel({
      babelHelpers: 'bundled',
      exclude: /node_modules/
    }),
    terser(),
    postcss()
  ]
}

```

在 `postcss.config.js` 中，配置 postcss：

demo-project\25_rollup-rollup业务打包\postcss.config.js

```js
module.exports = {
  plugins: [require("postcss-preset-env")]
}
```

在项目代码中，使用 `user-select: none;` 来测试是否有添加浏览器前缀；默认没有加浏览器前缀。

demo-project\25_rollup-rollup业务打包\src\css\style.css

```css
.title {
  color: red;
  user-select: none;
}
```

demo-project\25_rollup-rollup业务打包\src\index.js

```js
import "./css/style.css"

//...
// DOM操作
const titleEl = document.createElement("h2")
titleEl.textContent = "我是标题, 哈哈哈"
titleEl.className = "title"
document.body.append(titleEl)
```

### 2.vue 文件处理

安装 *vue*、*rollup-plugin-vue*、*@vue/compiler-sfc* 插件：默认安装的是 vue3.x 的版本；

```shell
pnpm add vue rollup-plugin-vue @vue/compiler-sfc -D
```

编写业务代码。

demo-project\25_rollup-rollup业务打包\src\vue\App.vue

```vue
<template>
  <div class="app">
    <h2>App计数器: {{ count }}</h2>
    <button @click="increment">+1</button>
    <button @click="decrement">-1</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(100)
function increment() {
  count.value++
}
function decrement() {
  count.value--
}
</script>

<style scoped>

</style>
```

demo-project\25_rollup-rollup业务打包\src\index.js

```js
import App from './vue/App.vue'

// 编写Vue代码
const app = createApp(App)
app.mount(document.querySelector("#app"))
```

在 `rollup.config.js` 进行配置；

demo-project\25_rollup-rollup业务打包\rollup.config.js

```js
// 默认lodash没有被打包是因为它使用commonjs, rollup默认情况下只会处理es module
const commonjs = require('@rollup/plugin-commonjs')
const nodeResolve = require('@rollup/plugin-node-resolve')

// 使用代码转换和压缩
const { babel } = require('@rollup/plugin-babel')
const terser = require('@rollup/plugin-terser')
const postcss = require('rollup-plugin-postcss')
const vue = require('rollup-plugin-vue')

module.exports = {
  // 入口
  input: "./src/index.js",
  // 出口
  output: {
    format: "umd",
    name: "whyUtils",
    file: "./build/bundle.umd.js",
    globals: {
      lodash: "_"
    }
  },
  plugins: [
    commonjs(),
    nodeResolve(),
    babel({
      babelHelpers: "bundled",
      exclude: /node_modules/
    }),
    postcss(),
    vue()
  ]
}
```

#### 1.错误处理

执行命令打包，发现报错了；

因为在打包的 vue 代码中，用到 `process.env.NODE_ENV`

> 判断全等时，通常把常量放在前面，如 `if('zzt' === name)`

webpack 中，不会出现这个问题，是因为使用了 `definePlugin()` 这个插件，注入了全局环境变量，

在 rollup 中，模拟这个效果；

安装 *@rollup/plugin-replace* 插件，

修改 `rollup.config.js`；打包时，将变量插入到源代码中；

- 配置时，使用 `JSON.stringfy('production')` 或者 ``‘“production”’``

demo-project\25_rollup-rollup业务打包\rollup.config.js

```js
// 默认lodash没有被打包是因为它使用commonjs, rollup默认情况下只会处理es module
const commonjs = require('@rollup/plugin-commonjs')
const nodeResolve = require('@rollup/plugin-node-resolve')

// 使用代码转换和压缩
const { babel } = require('@rollup/plugin-babel')
const terser = require('@rollup/plugin-terser')
const postcss = require('rollup-plugin-postcss')
const vue = require('rollup-plugin-vue')
const replace = require('@rollup/plugin-replace')

module.exports = {
  // 入口
  input: "./src/index.js",
  // 出口
  output: {
    format: "umd",
    name: "whyUtils",
    file: "./build/bundle.umd.js",
    globals: {
      lodash: "_"
    }
  },
  plugins: [
    commonjs(),
    nodeResolve(),
    babel({
      babelHelpers: "bundled",
      exclude: /node_modules/
    }),
    postcss(),
    vue(),
    replace({
      "process.env.NODE_ENV": JSON.stringify('production'),
    }),
  ]
}
```

### 3.搭建本地服务

安装 *rollup-plugin-serve* 搭建服务

```shell
npm install rollup-plugin-serve -D
```

要做到 HMR，即当文件发生变化时，自动刷新浏览器，还要安装 *rollup-plugin-livereload* 插件。

```shell
npm install rollup-plugin-livereload -D
```

修改配置文件 `rollup.config.js`，配置本地服务器。

demo-project\25_rollup-rollup业务打包\rollup.config.js

```js
// 默认lodash没有被打包是因为它使用commonjs, rollup默认情况下只会处理es module
const commonjs = require('@rollup/plugin-commonjs')
const nodeResolve = require('@rollup/plugin-node-resolve')

// 使用代码转换和压缩
const { babel } = require('@rollup/plugin-babel')
const terser = require('@rollup/plugin-terser')
const postcss = require('rollup-plugin-postcss')
const vue = require('rollup-plugin-vue')
const replace = require('@rollup/plugin-replace')
const serve = require('rollup-plugin-serve')
const livereload = require('rollup-plugin-livereload')

module.exports = {
  // 入口
  input: "./src/index.js",
  // 出口
  output: {
    format: "umd",
    name: "whyUtils",
    file: "./build/bundle.umd.js",
    globals: {
      lodash: "_"
    }
  },
  plugins: [
    commonjs(),
    nodeResolve(),
    babel({
      babelHelpers: "bundled",
      exclude: /node_modules/
    }),
    postcss(),
    vue(),
    replace({
      "process.env.NODE_ENV": JSON.stringify('production'),
    }),
    serve({
      port: 8000,
      open: true,
      contentBase: "."
    }),
    livereload()
  ]
}
```

开启本地服务时启动时，开启文件监听

```shell
npx rollup -c -w
```

### 4.区分环境

区分开发、生产环境。

先在 `package.json` 中，创建两个脚本（“script”），并配置参数。

demo-project\25_rollup-rollup业务打包\package.json

```json
{
  "scripts": {
    "build": "rollup -c --environment NODE_ENV:production",
    "serve": "rollup -c --environment NODE_ENV:development -w"
  },
}
```

在  `rollup.config.js` 配置文件中：

- 根据环境变量，判断是否为“生产环境”打包。动态生成 `plugins` 数组。
- `replace` 插件配置 `preventAssignment: true`；

demo-project\25_rollup-rollup业务打包\rollup.config.js

```js
// 默认lodash没有被打包是因为它使用commonjs, rollup默认情况下只会处理es module
const commonjs = require('@rollup/plugin-commonjs')
const nodeResolve = require('@rollup/plugin-node-resolve')

// 使用代码转换和压缩
const { babel } = require('@rollup/plugin-babel')
const terser = require('@rollup/plugin-terser')
const postcss = require('rollup-plugin-postcss')
const vue = require('rollup-plugin-vue')
const replace = require('@rollup/plugin-replace')
const serve = require('rollup-plugin-serve')
const livereload = require('rollup-plugin-livereload')

const isProduction = process.env.NODE_ENV === "production"
const plugins = [
  commonjs(),
  nodeResolve(),
  babel({
    babelHelpers: "bundled",
    exclude: /node_modules/
  }),
  postcss(),
  vue(),
  replace({
    "process.env.NODE_ENV": JSON.stringify('production'),
    preventAssignment: true
  }),
]

if (isProduction) {
  plugins.push(terser())
} else {
  const extraPlugins = [
    serve({
      port: 8000,
      open: true,
      contentBase: "."
    }),
    livereload()
  ]
  plugins.push(...extraPlugins)
}

module.exports = {
  // 入口
  input: "./src/index.js",
  // 出口
  output: {
    format: "umd",
    name: "whyUtils",
    file: "./build/bundle.umd.js",
    globals: {
      lodash: "_"
    }
  },
  plugins: plugins
}
```

## 二、vite 是什么？

vite 官方的定位：下一代前端开发与构建工具；

- 在实际开发中，编写的代码，往往不能被浏览器直接识别；
  - 比如 ES6+ 语法、TypeScript、Vue 文件等等；
- 所以要通过构建工具，来对代码进行转换、编译；
  - 类似的工具有 webpack、rollup、parcel；
- 随着项目越来越大，需要处理的 JavaScript 代码，呈指数级增长，模块越来越多；
- 构建工具需要很长的时间，才能开启服务器，HMR 也需要几秒钟才能在浏览器反应出来；
- 所以也有这样的说法：天下苦 webpack 久矣；

Vite (法语意为 "快速的"，发音 /vit/) 是一种新型前端构建工具，能够显著提升前端开发体验。

## 三、vite 的构造

Vite 主要由两部分组成：

- 一个开发服务器，它基于原生 ES 模块，提供了丰富的内建功能，HMR 的速度非常快速；
- 一套构建指令，它使用 rollup 打开代码，并且是预配置的，可以输出针对生产环境，优化过的静态资源；

在浏览器支持 ES 模块之前，JavaScript 并没有提供原生机制，让开发者以模块化的方式进行开发。

- 这也正是我们对 “打包”这个概念熟悉的原因：使用工具抓取、处理，并将源码中的模块，串联成可以在浏览器中运行的文件。
- 时过境迁，我们见证了诸如 webpack、Rollup 和 Parcel 等工具的变迁，它们极大地改善了前端开发者的开发体验。
- 然而，当我们开始构建越来越大型的应用时（如包含数千个模块的大型项目相当普遍），需要处理的 JavaScript 代码量也呈指数级增长。

- 基于 JavaScript 开发的工具，就会开始遇到性能瓶颈：通常需要很长时间（甚至是几分钟！）才能启动开发服务器，即使使用模块热替换（HMR），文件修改后的效果也需要几秒钟才能在浏览器中反映出来。

Vite 旨在利用生态系统中的新进展解决上述问题：

- 浏览器开始原生支持 ES 模块，且越来越多 JavaScript 工具使用可直接被编译成机器码并运行的语言编写。
- the rise of JavaScript tools written in compile-to-native languages.

vite 4 中，开始使用 rollup 3

vite 在开发阶段，开启一个服务，会对要转换的代码，做简单转换，比如；

- ES6 语法 => 不转换；
- TS => ES6+
- jsx 语法 => 简单转换
- vue 语法 => 简单转换。

开发阶段，使用 ESBuild 做简单转换，相对于 babel 快 10 - 100 倍；

打包时，基于 rollup 打包。

## 四、理解浏览器中的模块化

浏览器原生支持模块化

但如果不借助于其他工具，浏览器直接运行编写的 ES6+ 代码，有如下问题：

1.必须明确写后缀名；

2.如果某一个模块，加载了很多其它 js 文件，那么这些文件都要依次加载；

- 浏览器要将所有的 js 文件请求下来，要发送很多的 http 请求，效率低。
- 如 loadash，加载了上百个模块的 js 代码

3.如果代码中，有 ts、jsx、vue、less...代码，浏览器还是不识别的。

事实上，vite 就帮助我们解决了上面的所有问题。

> 业务代码中，常用 `main.js` 来命名。

在开发阶段，vite 直接将 ES6+ 代码，跑在浏览器上；生产阶段使用 rollup 进行打包。

:egg: 案例理解：

安装 *lodash-es*；

```shell
pnpm add lodash-es
```

编写业务代码，使用完整路径引入。

demo-project\26_vite-vite工具的使用\src\main.js

```js
import _ from '../node_modules/lodash-es/lodash.default.js'
```

demo-project\26_vite-vite工具的使用\index.html

```html
<script src="./src/main.jsx" type="module"></script>
```

在浏览器中，运行 `index.html`，加载了若干 js 文件，都是 lodash-es 引入的。

## 五、vite 安装

安装 vite 工具：

```shell
npm install vite –g npm install vite -d
```

使用 vite，来启动项目：

```shell
npx vite
```

开发阶段，使用 vite，开启服务


可去掉引入文件的后缀名。

可修改引入 lodash 的路径，vite 会将要加载的文件，放到一个文件中，以便浏览器一次性请求下来。

可在项目中直接引入 ts 代码。



vite 会开启一个服务器，使用 connect 库，更适合请求的转发（早期用的 koa）

开发阶段，vite 开启的服务器，会去读取 ts 代码，通过 esbuild，直接转成 js 代码（但名称还是 xxx.tx）

---

vite 对 css 的支持。

编写 css，在项目中引入。

编写 less，在项目中引入。编写一些 dom 操作。

安装 less 工具（虽然 vite 可自动解析 less，但需要 less 工具），

同理，安装 postcss，postcss-preset-env 去处理 css 文件。

配置 postcss.config.js 中；加上浏览器前缀

---

vite 对 ts 的支持

原生支持，开发阶段，直接使用 esbuild 编译。生产环境，还是用 babel 转换的。

---

vite 对 vue 的支持。

安装对应的插件。

在 vite.config.js  中，进行配置。可直接使用 `export default` 这样的 es6 语法，vite 默认支持。

在其中，使用 defineConfig 函数，有更好的提示。

---

vite 对 react 的支持。

安装 react、react-dom，编写 react 代码。

同样地，jsx, tsx，开发阶段，直接使用 esbuild 编译。生产环境，还是用 babel 转换的。

---

vite 项目打包。

---

vite 脚手架

创建项目 27-...

```shell
# 使用 vite 脚手架，创建各种项目
npm create vite

# 使用基于 vite 的 vue 脚手架，创建 vue 项目。
npm create vue
```

更多配置查看官方文档。

---

ESBuild 解析。

ESBuild 构建速度了解。

为什么这么快？

为什么生产环境不用 ESBuild 打包，详见[官方文档](https://cn.vitejs.dev/guide/why.html#why-not-bundle-with-esbuild)。