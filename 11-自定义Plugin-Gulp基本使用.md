# 自定义 Plugin & Gulp 基本使用

## 一、Plugins 回顾

CleanWebpackPlugin

HTMLWebpackPlugin

MiniCSSExtractPlugin

CompressionPlugin

等等。。。

这些 Plugin，是如何注册到 webpack 的生命周期中的？

1. 在 `webpack` 函数的 `createCompiler` 方法中，注册了所有的插件；
2. 在注册插件时，会调用插件函数，或者插件对象的 `apply` 方法；
3. 插件函数，或 `apply` 方法，会接收 `compiler` 对象，通过它来注册 Hook 的事件；
4. 某些插件，也会传入一个 `compilation` 对象，也可通过它来注册 Hook 事件；

它们是如何注册到 webpack 生命周期中的？

lib\webpack.js G70

```js
//...
for (const plugin of options.plugins) {
  if (typeof plugin === "function") {
    plugin.call(compiler, compiler);
  } else {
    plugin.apply(compiler);
  }
}
```

## 二、自定义 Plugin

如何开发自己的插件呢？

大部分插件，都可以在社区中找到，推荐使用在维护，经过验证的；

开发一个自己的插件：将静态资源打包完成后，自动上传到服务器；

自定义插件的过程：

1.创建 `AutoUploadWebpackPlugin` 类；

2.编写 `apply` 方法：

- 通过 ssh 连接服务器；
- 删除服务器原来的文件夹；
- 上传静态资源；

3.在 webpack 配置文件中，使用 AutoUploadWebpackPlugin 类；

> 【补充】：两种导出方式的不同：
>
> ```js
> module.exports = AutoUploadWebpackPlugin
> // 对应导入
> const AutoUploadWebpackPlugin = require('./plugin/autoUploadWebpackPlugin')
>
> module.exports.AutoUploadWebpackPlugin = AutoUploadWebpackPlugin
> // 对应导入
> const { AutoUploadWebpackPlugin } = require('./plugin/autoUploadWebpackPlugin')
> ```

### 1.基本结构

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

### 2.AutoUploadWebpackPlugin

主要步骤：

1.获取输出文件夹路径；

2.连接远程服务器 SSH

- 连接远程服务器，要用到一个库 node-ssh

3.将文件夹中资源上传到服务器中；

4.销毁 ssh 连接

5.完成所有操作后，调用 callback

编写自己的 plugin。为 plugin 传入参数。

> webpack [官方文档](https://webpack.docschina.org/api/plugins/)和源码中，都有 compiler 中的 hook 说明。
>
> webpack plugin 贯穿于整个打包的生命周期，每个阶段都有对应的 hook 被调用；
>
> 在 plugin 中，注册 hook，在不同的生命周期，进行相应的操作。

demo-project\21_webpack-自定义Plugin-案例\plugins\AutoUploadWebpackPlugin.js

```js
const { NodeSSH } = require('node-ssh')
const { PASSWORD } = require('./config')

class AutoUploadWebpackPlugin {
  constructor(options) {
    this.ssh = new NodeSSH()
    this.options = options
  }

  apply(compiler) {
    // console.log("AutoUploadWebpackPlugin被注册:")
    // 完成的事情: 注册 hooks 监听事件
    // 等到 assets 已经输出到 output 目录上时, 完成自动上传的功能
    compiler.hooks.afterEmit.tapAsync("AutoPlugin", async (compilation, callback) => {
      // 1.获取输出文件夹路径(其中资源)
      const outputPath = compilation.outputOptions.path

      // 2.连接远程服务器 SSH
      await this.connectServer()

      // 3.删除原有的文件夹中内容
      const remotePath = this.options.remotePath
      this.ssh.execCommand(`rm -rf ${remotePath}/*`)

      // 4.将文件夹中资源上传到服务器中
      await this.uploadFiles(outputPath, remotePath)

      // 5.关闭ssh连接
      this.ssh.dispose()

      // 完成所有的操作后, 调用callback()
      callback()
    })
  }

  async connectServer() {
    await this.ssh.connect({
      host: this.options.host,
      username: this.options.username,
      password: this.options.password
    })
    console.log('服务器连接成功')
  }

  async uploadFiles(localPath, remotePath) {
    const status = await this.ssh.putDirectory(localPath, remotePath, {
      recursive: true,
      concurrency: 10
    })
    if (status) {
      console.log("文件上传服务器成功~")
    }
  }
}

module.exports = AutoUploadWebpackPlugin
module.exports.AutoUploadWebpackPlugin = AutoUploadWebpackPlugin
```

> 服务器上，一般使用 nginx 进行了一些配置；

## 三、gulp 是什么？

A toolkit to automate & enhance your workflow；

一个帮你增加工作流的自动化工具包；

学好 webpack，其它打包工具，都很简单；

## 四、gulp 和 webpack

gulp 的核心理念是：“task runner”

- 定义一系列任务，然后基于文件 Stream 的构建流；使用 gulp 的插件体系，来完成这些任务；

webpack 的核心理念是：“module bundler”

- webpack 是一个模块化的打包工具；
- 可以使用各种各样的 loader 来加载不同的模块；
- 可以使用各种各样的 plugin，在 webpack 打包的生命周期完成其他的任务；

gulp 相对于 webpack 的优缺点：

- gulp 相对于 webpack 思想更加的简单、易用，更适合编写一些自动化的任务；
- gulp 默认是不支持模块化的；
  - 目前大型项目（如 Vue、React、Angular），并不会使用 gulp 来构建；
  - 慢慢地推出历史舞台。

## 五、gulp 基本使用

安装 gulp：

```shell
# 全局安装
npm install gulp -g

# 局部安装
npm install gulp 
```

编写 `gulpfile.js` 文件，在其中创建一个任务：

执行 gulp 命令：

```shell
npx gulp foo
```

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