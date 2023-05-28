rollup 插件

创建项目 25-...

处理 css 文件

安装 postcss 插件。

使用 user-select: none; 用于测试浏览器前缀；默认没有加浏览器前缀。

安装 postcss-preset-env 插件，在 rollup.config.js 中，配置。

将配置抽取到 postcss.config.js 中。

---

处理 vue 文件

安装 vue、rollup-plugin-vue、@vue/compiler-sfc

编写业务代码。

编写配置文件 rollup.config.js；

执行命令打包，发现报错了。缺少 process

> 判断全等时，通常把常量放在前面，如 `if('zzt' === name)`

webpack 中，不会出现这个问题，是因为使用了 definePlugin() 这个插件，

在 rollup 中，模拟这个效果；

安装 @rollup/plugin-replace 插件，打包时，将变量插入到源代码中；

修改配置文件 rollup.config.js；

- 配置时，使用 `JSON.stringfy('production')` 或者 ``‘“production”’``

---

搭建本地服务

安装 rollup-plugin-serve 插件

修改配置文件，配置本地服务器。

要做到 HMR，还要安装 rollup-plugin-livereload 插件

修改配置文件，

执行命令，打包，并实时监听文件变化。

---

区分开发、生产环境。

现在 package.json 中，创建两个命令（“script”），在命令中，配置参数。

在配置文件中，根据环境变量，判断是否是生产环境。动态生成 plugins 数组。

replace 插件配置 `preventAssignment: true`

---

vite 快速开发工具

vite 是什么？

下一代开发和构建工具是什么？

---

vite 的构造

vite 4 中，开始使用 rollup 3

开发阶段，会对要转换的代码，做简单转换，比如；

- ES6 语法 => 不转换；
- TS => ES6+
- jsx 语法 => 简单转换
- vue 语法 => 简单转换。

使用 ESBuild 做简单转换，相对于 babel 快 10 - 100 倍；

打包时，基于 rollup 打包。

---

理解浏览器原生支持模块化。

创建项目 26-...

> 业务代码中，常用 `main.js` 来命名。

在开发阶段，vite 像直接将 ES6+ 代码，泡在浏览器上，生产阶段使用 rollup 进行打包。



案例理解：

编写业务代码，安装 lodash-es，在 使用完整路径引入。



浏览器直接运行编写的 ES6+ 代码，有如下问题：

1.必须明确写后缀名；

2.如果某一个模块，加载了很多其它 js 文件，那么这些文件都要依次加载；

- 浏览器要将所有的 js 文件请求下来，要发送很多的 http 请求，效率低。

3.如果代码中，有 ts、 jsx、vue...代码，浏览器还是不识别的。

vite 就是为了解决以上问题的。

---

vite 安装

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