# Rollup 打包文件 & Vite 原理

## 一、rollup 插件

### 1.css 文件处理

处理 css 文件，安装 *rollup-plugin-postcss* 插件，还要安装 *postcss*、*postcss-preset-env*：

```shell
pnpm add rollup-plugin-postcss postcss postcss-preset-env -D
```

在 `rollup.config.js` 中，配置 postcss 的插件：

demo-project\25_rollup-rollup业务打包\rollup.config.js

```js
// 默认 lodash 没有被打包是因为它使用 commonjs, rollup 默认情况下只会处理 es module
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

在项目代码中，使用 `user-select: none;` 来测试是否有添加浏览器前缀；

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
// DOM 操作
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
    <h2>App 计数器: {{ count }}</h2>
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

在 `index.js` 中，引入：

demo-project\25_rollup-rollup业务打包\src\index.js

```js
import App from './vue/App.vue'

// 编写 Vue 代码
const app = createApp(App)
app.mount(document.querySelector("#app"))
```

在 `rollup.config.js` 进行配置；

demo-project\25_rollup-rollup业务打包\rollup.config.js

```js
// 默认 lodash 没有被打包，是因为它使用 commonjs, rollup 默认情况下只会处理 es module
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

因为在打包的 vue 代码中，用到 `process.env.NODE_ENV` 全局变量。

> 【补充】：判断全等时，通常把常量放在前面，如 `if('zzt' === name)` 这是一个好习惯。

webpack 中，不会出现这个问题，是因为使用了 `definePlugin()` 这个插件，注入了全局环境变量，

rollup 中，模拟这个效果；

安装 *@rollup/plugin-replace* 插件，

修改 `rollup.config.js`；打包时，将变量插入到源代码中；

- 配置时，使用 `JSON.stringfy('production')` 或者 ``‘“production”’``。

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

本地服务启动时，开启文件监听：

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

在 `rollup.config.js` 配置文件中：

- 根据环境变量，判断此次打包，是否为“生产环境”打包；动态生成 `plugins` 数组。
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

const isProduction = process.env.NODE_ENV === "production"
if (isProduction) {
  plugins.push(terser())
} else {
  plugins.push(
    serve({
      port: 8000,
      open: true,
      contentBase: "."
    }),
    livereload()
  )
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
  - 比如：高级的 ES6+ 特性、Jsx、TypeScript、Vue 文件等等；
- 所以要通过构建工具，来对代码进行转换、编译；
  - 类似的工具有 webpack、rollup、parcel；
- 随着项目越来越大，需要处理的 JS 代码，呈指数级增长，模块越来越多；
- 构建工具需要很长的时间，才能开启服务器；HMR 也需要几秒钟，才能在浏览器反应出来；
- 所以也有这样的说法：天下苦 webpack 久矣；

Vite (法语意为 "快速的"，发音 /vit/) 是一种新型前端构建工具，能够显著提升前端开发体验。

## 三、vite 的构造

Vite 主要由两部分组成：

- 一个开发服务器，基于原生 ES 模块，提供了丰富的内建功能，HMR 的速度非常快；
- 一套构建指令，使用 rollup 打包代码，并且是预配置的，可以输出针对生产环境，优化过的静态资源；

在浏览器支持 ES 模块之前，并没有一种原生机制，让开发者以模块化的方式进行开发。

- 这也正是我们对 “打包”这个概念熟悉的原因：“打包”就是使用工具抓取、处理，并将源码中的模块，串联成可以在浏览器中运行的文件。
- 时过境迁，我们见证了诸如 webpack、Rollup、Parcel 等工具的变迁，它们极大地改善了前端开发者的开发体验。
- 然而，当构建越来越大型的应用时（如包含数千个模块的大型项目），需要处理的 JS 代码量，也呈指数级增长。
- 基于 JS 开发的工具，就会开始遇到性能瓶颈：通常需要很长时间（甚至是几分钟！）才能启动开发服务器；
- 即使使用“热模块替换（HMR）”，文件修改后的效果，也需要几秒钟才能在浏览器中反映出来。

Vite 旨在利用生态系统中的新进展，解决上述问题：

- 浏览器开始原生支持 ES 模块，且越来越多 JavaScript 工具，使用“可直接被编译成机器码并运行”的语言编写（如 Go 语言）。
- the rise of JavaScript tools written in compile-to-native languages.

vite 4 中，才开始使用 rollup 3（以前用 rollup 2 打包）；

vite 在开发阶段，开启一个服务，会对要转换的代码，做简单转换，达到浏览器可直接运行的地步即可，比如；

- ES6+ JS 语法 => 不转换；
- TS => ES6+ JS
- jsx 语法 => 简单转换
- vue 语法 => 简单转换。

开发阶段，使用 ESBuild 做简单转换，相对于 babel 快 10 - 100 倍；

生产阶段，打包时，基于 rollup 打包。

## 四、理解浏览器中的模块化

目前，浏览器原生支持模块化；

但如果不借助于其他工具，浏览器直接运行 ESModule 模块化规范的代码，有如下问题：

1.引入模块时，必须明确写后缀名；

2.如果某一个模块，引入了很多 js 文件，那么它们都要依次加载；

- 如 loadash，加载了上百个模块的 js 代码
- 浏览器要将所有的 js 文件请求下来，要发送很多的 http 请求，效率低。

3.如果代码中，有 ts、jsx、vue、less...代码，浏览器仍是不识别的。

:egg: 案例理解：印证以上前两个问题。

安装 *lodash-es*；

```shell
pnpm add lodash-es
```

编写业务代码，使用完整路径引入，明确后缀名。

> 【补充】：业务代码中，常用 `main.js` 来命名。

demo-project\26_vite-vite工具的使用\src\main.js

```js
import _ from '../node_modules/lodash-es/lodash.default.js' // 使用完整路径，明确的后缀名
```

demo-project\26_vite-vite工具的使用\index.html

```html
<script src="./src/main.jsx" type="module"></script>
```

在浏览器中，运行 `index.html`，加载了若干 js 文件，都是 lodash-es 引入的。

事实上，vite 就帮助我们解决了上面三个问题。

- 在开发阶段，vite 开启本地服务器，通过 ESBuild 转换 ES6+ 代码，发送给浏览器；
- 在生产环境，使用 rollup 进行打包。

## 五、vite 安装

安装 vite 工具：

```shell
pnpm add vite
```

使用 vite，来启动项目：

```shell
npx vite
```

开发阶段，使用 vite，开启服务，主要做了三件事：

1.项目中的代码，引入文件时，自动添加后缀名；

2.将要引入的第三方模块，放到一个文件中，以便浏览器一次性请求下来。

- 比如在浏览器中，加载的 *lodash-es* 模块，都在一个文件里。

- 但要修改引入 *lodash-es* 的方式，如下。

```js
import _ from 'lodash-es'
```

3.转换 ts、jsx...这样的特殊语法，

- 比如：可在项目中直接引入 ts 代码。

vite 会开启一个服务器，底层**使用 *connect* 库**，更适合请求的转发（早期用的 koa）

开发阶段，vite 开启的服务器，会去读取 ts 代码，通过 esbuild，直接转成 js 代码（但名称还是 xxx.tx）

## 六、vite 支持 css

vite 默认支持 css 的处理，直接在项目中引入 css 文件即可；

vite 也默认支持 css 预处理器，比如 less；直接在项目中引入 less 文件即可；

- vite 可自动解析 less，但要安装 *less* 编译器；

```shell
pnpm add less -D
```

vite 默认支持 postcss 的转换：

- 但要安装 *postcss*、*postcss-preset-env* 去处理 css 文件

```shell
pnpm add postcss postcss-preset-env -D
```

配置 `postcss.config.js`，为 css 特性，加上浏览器前缀；

demo-project\26_vite-vite工具的使用\postcss.config.js

```js
module.exports = {
  plugins: [require("postcss-preset-env")]
}
```

编写 css

demo-project\26_vite-vite工具的使用\src\css\style.css

```css
body {
  background-color: skyblue;
}
```

编写 less

demo-project\26_vite-vite工具的使用\src\css\normal.less

```less
@mainColor: red;
@mainSize: 20px;

.title {
  font-size: @mainSize;
  color: @mainColor;

  user-select: none;
}
```

在项目中引入 css、less；编写一些 dom 操作，测试样式是否生效。

demo-project\26_vite-vite工具的使用\src\main.jsx

```js
import "./css/style.css"
import "./css/normal.less"

// DOM 操作
const titleEl = document.createElement("h2")
titleEl.textContent = "你好啊, 李银河!"
titleEl.className = "title"
document.body.append(titleEl)
```

## 七、vite 支持 ts

vite 对 TypeScript 是原生支持的：

- 开发阶段，会直接使用 ESBuild 来完成编译：在项目中直接引入即可；
- 生产环境，还是用 rollup 进行打包，用 babel 进行编译的。

开发阶段，查看浏览器中的请求，会发现：请求的依然是后缀名为 “.ts” 的文件：

这是因为 vite 中的服务器 Connect，会对请求进行转发；获取 ts 编译后的代码，返回给浏览器，浏览器可以直接进行解析；

> 注意：在 vite 2 中，已经不再使用 Koa 了，而是使用 Connect 来搭建的本地服务器。

编写 ts 代码：

demo-project\26_vite-vite工具的使用\src\ts\format.ts

```typescript
export function formatPrice(price: number): string {
  return "¥" + price
}
```

引入 ts 代码。

demo-project\26_vite-vite工具的使用\src\main.jsx

```js
import { formatPrice } from './ts/format'

// ts的代码
console.log(formatPrice(10000))
```

## 八、vite 支持 vue

vite 对 vue 提供第一优先级支持：

- Vue 3 单文件组件支持：安装 *@vitejs/plugin-vue* 插件。
- Vue 3 JSX 支持：安装 *@vitejs/plugin-vue-jsx* 插件。
- Vue 2 支持：安装 *underfin/vite-plugin-vue2* 插件。

现在一般使用 vue 3，所以安装如下插件：

```shell
pnpm add @vitejs/plugin-vue -D
```

在 `vite.config.js` 中配置插件：

- 可直接使用 `export default` 这样的 ESModule 语法，vite 默认支持。
- 使用 `defineConfig` 函数，配置项有更好的提示。

demo-project\26_vite-vite工具的使用\vite.config.js

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()]
})
```

demo-project\26_vite-vite工具的使用\src\vue\App.vue

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

在 `main.js` 中，引入：

demo-project\26_vite-vite工具的使用\src\main.jsx

```js
import VueApp from './vue/App.vue'

// Vue代码渲染
const app = createApp(VueApp)
app.mount(document.querySelector("#app"))
```

## 九、vite 支持 react

vite 默认支持对 .jsx、.tsx 文件的处理，同样开箱即用；

- 开发阶段，通过 ESBuild 来完成的编译：
- 生产环境，用 rollup 进行打包，用 babel 进行编译的。

所以，直接在项目中引入 react 的代码即可；

安装 *react*、*react-dom*；

```shell
pnpm add react react-dom
```

编写 react 代码。

demo-project\26_vite-vite工具的使用\src\react\App.jsx

```jsx
import React, { useState } from 'react'

function App() {
  const [count, setCount] = useState(100)

  return (
    <div className="app">
      <h2>React App 计数器: {count}</h2>
      <button onClick={e => setCount(count+1)}>+1</button>
      <button onClick={e => setCount(count-1)}>-1</button>
    </div>
  )
}

export default App
```

将 `main.js` 的后缀名，修改为 `.jsx`；

demo-project\26_vite-vite工具的使用\src\main.jsx

```js
import ReactApp from './react/App.jsx'
import React from 'react'
import ReactDom from 'react-dom/client'

// React 代码渲染
const root = ReactDom.createRoot(document.querySelector("#root"))
root.render(<ReactApp />)
```

## 十、vite 项目打包

打包项目，执行命令：

```shell
npx vite build
```

开启一个本地服务，来预览打包后的效果，执行命令：

```shell
npx vite preview
```

## 十一、vite 脚手架

在开发中，几乎不会使用 vite 从零搭建项目，vite 提供了对应的脚手架工具；

实际上，Vite 提供了两个工具：

- *vite*：相当于是一个构件工具，类似于 webpack、rollup；
- *@vitejs/create-app*：类似 *vue-cli*、*create-react-app*；

使用 vite 脚手架，创建项目：

```shell
# 使用 vite 脚手架，创建项目，可以是 vue、react、... 项目
npm create vite
yarn create vite
pnpm create vite

# 使用基于 vite 的 vue 脚手架，创建 vue 项目。
npm create vue
```

更多配置查看官方文档。

## 十二、ESBuild 解析

ESBuild 的特点：

- 超快的构建速度，并且不需要缓存；
- 支持 ESModule 和 CommonJS 的模块化；
- 支持 ES6 的 Tree Shaking；
- 支持 Go、JavaScript 的 API（本身由 Go 编写）；
- 支持 TypeScript、JSX 等语法编译；
- 支持 SourceMap；
- 支持代码压缩；
- 支持扩展其他插件；

ESBuild 构建速度和其它工具对比。

![ESBuild构建速度](NodeAssets/ESBuild构建速度.jpg)

ESBuild 为什么这么快呢？

- 使用 Go 语言编写，无需经过字节码，直接转换成机器码运行；
- ESBuild 可以充分利用 CPU 的多核，尽可能让它们饱和运行；
- ESBuild 是从零开始编写的，没有依赖第三方库，从一开始就能够考虑各种性能问题；
- ....

为什么生产环境不用 ESBuild 打包，详见[官方文档](https://cn.vitejs.dev/guide/why.html#why-not-bundle-with-esbuild)。
