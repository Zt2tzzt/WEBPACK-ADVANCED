回顾使用过的 Plugins。

它们是如何注册到 webpack 生命周期中的？

```js
for (const plugin of options.plugins) {
  if (typeof plugin === "function") {
    plugin.call(compiler, compiler);
  } else {
    plugin.apply(compiler);
  }
}
```



开发自己的 Plugin

理解打包资源的部署方式图解。

将打包好的静态资源文件，自动上传到服务器上。

---

搭建 21-... 项目。

两种导出方式的不同

```js
module.exports = AutoUploadWebpackPlugin
// 对应导入
const AutoUploadWebpackPlugin = require('./plugin/autoUploadWebpackPlugin')

module.exports.AutoUploadWebpackPlugin = AutoUploadWebpackPlugin
// 对应导入
const { AutoUploadWebpackPlugin } = require('./plugin/autoUploadWebpackPlugin')
```

编写一个最简单的自定义插件

```js
class AutoUploadWebpackPlugin {
  apply(compiler) {
    console.log('AutoUploadWebpackPlugin 被注册：', compiler)
  }
}

module.exports = AutoUploadWebpackPlugin
module.exports.AutoUploadWebpackPlugin = AutoUploadWebpackPlugin
```



[官网](https://webpack.docschina.org/api/plugins/)和源码中，都有 compiler 中的 hook 说明。

webpack plugin 贯穿于整个打包的生命周期，每个阶段都有不同的 hook，在 plugin 中，监听 hook，进行对用的操作。



主要步骤：

1.获取输出文件夹路径；

2.连接远程服务器 SSH

3.将文件夹中资源上传到服务器中；

4.销毁 ssh 连接

5.完成所有操作后，调用 callback



连接远程服务器，用用到一个库 node-ssh

编写自己的 plugin。

为 plugin 传入参数。

> 服务器上，一般使用 nginx 进行了一些配置；

---

> 学号 webpack，其它工具都很简单；

自动化工具 gulp

什么是 gulp？

---

gulp 和 webpack

---

gulp 的基本使用

---

创建 gulp 任务

gulp.task 也可创建任务，这种方式用的越来越少。

---

默认任务

---

任务组合

---

读取和写入文件

拷贝文件到指定目录。路径的特殊写法 *

> pipe 方法，是 Node 中的方法。

---

glob 文件匹配规则。

---

gulp 文件监听，在任务中，使用 babel，terser；