创建 18-自定义loader项目

---

loader 是什么？

---

创建 zt_loader01.js，在其中导出一个函数。

在 webpack.config.js 中，直接使用该 loader，回去 node_moudule 下查找，找不到。

- 要写成 "./zt_loaders/zt_loader02.js"
- 或配置 resolveLoader: { modules: ["node_modules", "/zt-loaders"] }

回顾 content 配置的作用。

---

loader 的执行顺序。



可以给 loader 加 pitch 属性；

它会被自动执行，执行顺序与 normal-lopader 相反，即是正序，原理。



执行顺序和 enforce

---

同步的 loader

在同步的 loader 中，可以使用 callback，第一个参数是 null

但是不能再异步代码中使用。



异步的 loader

与同步 loader 区分，在于 this.async() 调用。

---

传入和获取参数。

使用 this.getOptions() 获取传参。



检验参数

要用到官方提供的校验库 schema-utils

validate(schema, option); schema 是 json 格式的校验规则；

---

自己编写 babel-loader

创建 19_... 项目。

安装 @babel/core

---

自己编写 md-loader

安装 marked 库。

loader 返回的结果，必须是模块化的内容。



在 webpack.config.js 中，安装 html-webpack-plugin

输出 index.html 文件，在其中展示 md 文本。



对样式进行优化，安装 css-loader、style-loader



安装 hightlight.js 库，为代码提供高亮；

可自行编写样式；也可使用 highlight.js 提供的默认 css 样式。

---

webpack Plugin

webpack 和 tapable



tapable 有哪些 hook

分类

---

单独安装 tapable 库

使用时，一般分为三个步骤：

1. 创建 hook
2. 用 hook 监听事件
3. 用 hook 发送事件

编写 01_同步_基本使用.js

---

同步 hook

BailHook 的使用。



LoopHook 的使用。



waterfall 的使用