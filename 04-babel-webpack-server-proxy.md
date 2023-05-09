babel 编译 React 的 jsx 代码。

在项目中，安装 rect、react-dom

编写一个 React 组件 App.jsx

创建一个模板 index.html，将 react 渲染到 div#root 中

安装 html-webpack-plugin 插件。使用该插件。

> js 中也可以写 jsx 代码。

为 babel-loader 支持使用的 react jsx 插件和预设。

---

webpack 中 [resolve extensions 配置](https://webpack.docschina.org/configuration/resolve/#resolveextensions)，有三个默认值。

打包时，解析添加的后缀名

---

回顾 TypeScript 代码的编译。

webpack 编译 TypeScript 代码。使用 ts-loader

安装 ts-loader 时，会自动安装 typescript。本质上用 tsc 编译代码。

创建 tsconfig.json 文件。

- tsc --init

---

开发中，通常不使用 ts-loader，而是 babel-loader，编译 TS 代码。

因为 TS 代码中，也会需要 polyfill

使用 babel-loader 的好处，

- 不需要安装 ts-loader
- 可配置 polyfill

---

ts-loader 和 babel-loader 的选择

babel-loader 的缺点：

- 打包时，不会对代码进行类型检测。

---

编译 TypeScript 最佳实践。

编译 TS 代码时，使用 babel-loader；

使用 tsc 实时监听类型错误。

---

webpack 本地服务器。

webpack-dev-server



devServer 的 static，用于对静态资源的打包。

早期是 contentBase，现在是 stat此，默认配置了 public



hotOnly、host 配置

hotOnly 已无效。



port、open、compress 配置。

---

Proxy 代理（重点，一般要自己配置）

开发一个 koa 服务器。

解决跨域问题。



changeOrigin 配置

源码位置 http-proxy/lib/http-proxy/common.js line 100

---

historyApiFallback

将 localhost:8000/about 重定向到 localhost:8000，并使用 html5 的 history 模式，访问 /about

vue、react 脚手架，都配置了这个属性。

---

webpack 性能优化

> 【回顾】：防抖，节流，精灵图，回流，重绘...
>
> react 中，mome，高阶组件...

对结果进行优化（重点）：

压缩丑化，tree shaking。