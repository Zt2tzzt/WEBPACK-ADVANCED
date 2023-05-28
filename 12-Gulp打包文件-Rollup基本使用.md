# Gulp 打包文件 & Rollup 基本使用

## 一、gulp 文件监听

gulp api 中的 `watch()` 方法。

利用文件系统（fs）的监控程序（file system watcher），将发生的更改与 gulp 任务执行进行关联。

demo-project\22_gulp-gulp的基本使用\gulpfile.js

```js
const { src, dest, watch } = require('gulp')
const babel = require('gulp-babel')
const terser = require('gulp-terser')

const jsTask = () => {
  return src("./src/**/*.js")
    .pipe(babel())
    .pipe(terser({ mangle: { toplevel: true } }))
    .pipe(dest("./dist"))
}

// watch 函数监听打包内容的改变
watch("./src/**/*.js", jsTask)

module.exports = {
  jsTask
}
```

## 二、gulp 项目构建

使用 gulp，编写一个案例，来开启本地服务和打包：

更多插件见[官方文档](https://gulpjs.com/plugins)；

1.打包 html 文件；

安装 *gulp-htmlmin* 插件；

```shell
pnpm add gulp-htmlmin -D
```

2.打包 js 文件；

安装 *gulp-babel* 插件（同时还要安装 *@babel/core,* *@babel/preset-env*）；

```shell
pnpm add gulp-babel @babel/core @babel/preset-env -D
```

3.安装 *gulp-terser* 插件；

```shell
pnpm add gulp-terser -D
```

4.打包 less 文件；

安装 *gulp-less* 插件；

```shell
pnpm add gulp-less -D
```

5.将打包好的资源，注入到 html 模板文件中

安装 *gulp-inject* 插件；

```shell
pnpm add gulp-inject -D
```

要在 html 模板文件中，使用特殊注释标识。

demo-project\23_gulp-gulp的项目构建\src\index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gulp Projecct</title>
  <!-- inject:css -->
  <!-- endinject -->
</head>
<body>
  <!-- inject:js -->
  <!-- endinject -->
</body>
</html>
```

注入时，设置相对路径。

6.组合任务，

7.开启本地服务器

安装 *browser-sync* 插件（它是非 gulp 专用的插件，可以在别的地方使用）；

```shell
pnpm add browser-sync -D
```

8.环境分离：

- 创建打包任务 `buildTask`。
- 创建开发任务 `serveTask`，监听文件。

demo-project\23_gulp-gulp的项目构建\gulpfile.js

```js
const { src, dest, parallel, series, watch } = require("gulp");

const htmlmin = require("gulp-htmlmin");
const babel = require('gulp-babel')
const terser = require('gulp-terser')
const less = require('gulp-less')

const inject = require('gulp-inject')
const browserSync = require('browser-sync')

// 1.对 html 进行打包
const htmlTask = () => {
  return src("./src/**/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest("./dist"));
};

// 2.对 JavaScript 进行打包
const jsTask = () => {
  return src("./src/**/*.js")
    .pipe(babel({ presets: ["@babel/preset-env"] }))
    .pipe(terser({ toplevel: true }))
    .pipe(dest('./dist'))
};

// 3.对 less 进行打包
const lessTask = () => {
  return src("./src/**/*.less")
    .pipe(less())
    .pipe(dest("./dist"))
}

// 4.在 html 中注入js和css
const injectTask = () => {
  return src('./dist/**/*.html')
    .pipe(inject(src(['./dist/**/*.js', './dist/**/*.css']), { relative: true }))
    .pipe(dest('./dist'))
}

// 创建项目构建的任务
const buildTask = series(parallel(htmlTask, jsTask, lessTask), injectTask)

// 5.开启一个本地服务器
const bs = browserSync.create()
const serve = () => {
  watch("./src/**", buildTask)

  bs.init({
    port: 8080,
    open: true,
    files: './dist/*',
    server: {
      baseDir: './dist'
    }
  })
}

const serveTask = series(buildTask, serve)
// webpack 搭建本地 webpack-dev-server

module.exports = {
  buildTask,
  serveTask
};
```

## 三、rollup 是什么？

官方对 rollup 的定义：

- “Rollup is a module bundler for JavaScript which compiles small pieces of code into something larger and more complex, such as a library or application”.
- Rollup 是一个 JS 的模块化打包工具，可以将小的代码片段，编译到一个大的、复杂的代码中（模块化的概念），比如一个打包库或者一个应用程序；

### 1.与 webpack 对比

我们发现 Rollup 的定义、定位，与 webpack 非常的相似：

打包模块化的区别：

- rollup 也是一个模块化的打包工具，但 Rollup 主要针对 **ESModule 模块化规范**进行打包；
- webpack 默认支持对各种模块化规范，进行打包。

打包文件的区别：

- rollup 更**专注于处理 JS** 代码（当然也可以处理 css、font、vue 等文件）；
- webpack 可以通过 loader，处理各种各样的文件，以及处理它们的依赖关系；

思想理念的区别：

- rollup 的配置和理念，相对于 webpack 来说，更简洁、容易理解；

早期 webpack 不支持 tree shaking 时，rollup 具备更强的优势；

webpack 和 rollup，分别应用在什么场景？

- webpack 通常用于实际的项目开发中；
  - 比如 react、angular 的脚手架，都是基于 webpack 的）；
- rollup 通常用于对**库文件**进行打包。
  - 比如 vue、react、dayjs 源码，都是基于 rollup 打包的；
  - 比如 Vite 底层基于 rollup 打包；

## 四、rollup 基本使用

安装 *rollup*：

```shell
pnpm add rollup -D
```

使用 rollup 命令，进行打包，要指定打包文件，应用的环境，比如：

打包后的文件，要用于 node 环境，就要支持 CommonJS；配置参数 `-f cjs`：

```shell
# 打包 CommonJS 的库
npx rollup ./src/main.js -f cjs -o dist/bundle.js
```

打包后的文件，要用于浏览器环境，就要有全局对象，配置参数 `-f iife`，最好使用 `--name` 指定名字。

- 比如：*jQuery* 中，就是 `$`；
- 比如：*dayjs* 中，就是 `dayjs`。

```shell
# 打包浏览器的库
npx rollup ./src/main.js -f iife --name mathUtil -o dist/bundle.js
```

打包后的文件，要用于 AMD 环境，配置参数 `-f amd`。

```shell
# 打包AMD的库
npx rollup ./src/main.js -f amd -o dist/bundle.js
```

打包后的文件，要在所有环境适配，配置参数 `-f umd`，还要 `--name` 指定名字。

```shell
# 打包通用的库（必须跟上 name）
npx rollup ./src/main.js -f umd --name mathUtil -o dist/bundle.js
```

## 五、rollup 配置文件

rollup 的配置文件名称为：`rollup.config.js`：

在配置文件中，进行配置，打包出在不同环境下使用的库文件（用户可以根据不同的需求来引入）：

demo-project\24_rollup-rollup的库打包\rollup.config.js

```js
module.exports = {
  // 入口
  input: "./lib/index.js",
  // 出口，可以是数组，也可以是对象
  output: [
    {
      format: "umd",
      name: "zztUtils",
      file: "./build/bundle.umd.js"
    },
    {
      format: "amd",
      file: "./build/bundle.amd.js"
    },
    {
      format: "cjs",
      file: "./build/bundle.cjs.js"
    },
    {
      format: "iife",
      name: "zztUtils",
      file: "./build/bundle.browser.js"
    }
  ]
}
```

执行命令，根据配置文件打包：

```shell
npx rollup -c
```

### 1.处理 commonjs 模块

比如，当代码中使用了 *loadash* 库时，该库没有被打包进源代码；

因为 lodash 使用 commonjs 模块化规范；rollup 默认情况下，只会处理 ESModule；

要解决类似于使用 commonjs 引入第三方库问题，详见[官方文档](https://rollupjs.org/introduction/#compatibility)。

安装 *@rollup/plugin-commonjs* 库：

```shell
pnpm add @rollup/plugin-commonjs -D
```

### 2.处理 node_modules 中的模块

*lodash* 不仅使用的是 commonjs 规范，还需要从 node_modules 中，引入。

所以仍然不会被打包，

还需要安装 *@rollup/plugin-node-resolve* 库：

```shell
pnpm add @rollup/plugin-node-resolve -D
```

在配置文件中，配置相应的插件：

demo-project\24_rollup-rollup的库打包\rollup.config.js

```js
// 默认 lodash 没有被打包，是因为它使用 commonjs；
// rollup 默认情况下，只会处理 ESModule
const commonjs = require('@rollup/plugin-commonjs')
const nodeResolve = require('@rollup/plugin-node-resolve')

module.exports = {
  // 入口
  input: "./lib/index.js",
  // 出口
  output: {
    format: "umd",
    name: "zztUtils",
    file: "./build/bundle.umd.js",
    globals: {
      lodash: "_"
    }
  },
  plugins: [
    commonjs(),
    nodeResolve()
  ]
}
```

执行打包命令。

```shell
npx rollup -c
```

### 3.排除第三方包

事实上，作为一个库，并不需要打包 lodash 的代码，而是要让用户自己安装。

在配置文件中配置：打包时，排除 *lodash*。

demo-project\24_rollup-rollup的库打包\rollup.config.js

```js
// 默认 lodash 没有被打包是因为它使用 commonjs, rollup 默认情况下只会处理 es module
const commonjs = require('@rollup/plugin-commonjs')
const nodeResolve = require('@rollup/plugin-node-resolve')

module.exports = {
  // 入口
  input: "./lib/index.js",
  // 出口
  output: {
    format: "umd",
    name: "zztUtils",
    file: "./build/bundle.umd.js",
    globals: {
      lodash: "_"
    }
  },
  external: ["lodash"], // 打包时，排除 lodash
  plugins: [
    commonjs(),
    nodeResolve(),
  ]
}
```

## 六、rollup 插件

rollup 中，好用的插件，参考[官方文档](https://github.com/rollup/awesome)

### 1.babel 转换代码

在 rollup 中，将 ES6 转成 ES5 代码，使用 babel。

安装 rollup 的 babel 插件 *@rollup/plugin-babel*，并安装 *@babel/core*、*@babel/preset-env*：

```shell
npm install @rollup/plugin-babel @babel/core @babel/preset-env -D
```

修改配置文件：配置 `babel.config.js` 文件；

demo-project\24_rollup-rollup的库打包\babel.config.js

```js
module.exports = {
  presets: [
    ["@babel/preset-env"]
  ]
}
```

配置 `babelHelpers`，用于添加 polyfill。

demo-project\24_rollup-rollup的库打包\rollup.config.js

```js
// 默认lodash没有被打包是因为它使用commonjs, rollup默认情况下只会处理es module
const commonjs = require('@rollup/plugin-commonjs')
const nodeResolve = require('@rollup/plugin-node-resolve')

// 使用代码转换和压缩
const { babel } = require('@rollup/plugin-babel')

module.exports = {
  // 入口
  input: "./lib/index.js",
  // 出口
  output: {
    format: "umd",
    name: "zztUtils",
    file: "./build/bundle.umd.js",
    globals: {
      lodash: "_"
    }
  },
  external: ["lodash"],
  plugins: [
    commonjs(),
    nodeResolve(),
    babel({
      babelHelpers: "bundled",
      exclude: /node_modules/ // 排除对 node_modules 中代码的转换。
    }),
  ]
}
```

### 2.terser 压缩代码

在 rollup 中，对代码进行压缩，安装 *@rollup/plugin-terser*：

```shell
npm install @rollup/plugin-terser -D
```

修改配置文件

```js
// 默认lodash没有被打包是因为它使用commonjs, rollup默认情况下只会处理es module
const commonjs = require('@rollup/plugin-commonjs')
const nodeResolve = require('@rollup/plugin-node-resolve')

// 使用代码转换和压缩
const { babel } = require('@rollup/plugin-babel')
const terser = require('@rollup/plugin-terser')

module.exports = {
  // 入口
  input: "./lib/index.js",
  // 出口
  output: {
    format: "umd",
    name: "zztUtils",
    file: "./build/bundle.umd.js",
    globals: {
      lodash: "_"
    }
  },
  external: ["lodash"],
  plugins: [
    commonjs(),
    nodeResolve(),
    babel({
      babelHelpers: "bundled",
      exclude: /node_modules/
    }),
    terser()
  ]
}
```
