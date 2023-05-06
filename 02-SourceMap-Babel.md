创建 02-source-map 项目，安装 webpack webpack-cli

编写 src/main.js 文件；

编写 webpack.config.js 配置文件。

执行命令 npx webpack 命令。使用 webpack，根据配置文件，进行打包。



Mode 配置

配置文件的 mode 配置。

none，默认只有 entry，output 两个配置，其它都不加。

---

source-map 是什么？

编写一个报错的文件。

配置文件 mode 使用 develop

打包项目。

在 html 文件中，引入 bundle.js 文件，竟然正确地显示了错误信息出现在哪。



配置文件中，配置 devtool: "source-map"

执行 webpack 打包命令。

在 build 目录下，多出了 bundle.js.map 文件。

---

如何使用 source-map

浏览器在执行 bundle.js 时，会解析注释，加载注释中指定的 source-map 文件。

在 chrome 中，开启 source-map

---

分析 source-map



浏览器会更具 source-map 文件，还原出源代码。

---

生产 source-map

在 webpack.config.js 配置文件中，devtool 可配置值有 26 个。



eval 可以还原出源代码，但没有那么准确。

生产环境 devtool 一般设置 none，或 source-map；

开发环境 devtool 一般设置 eval，方便快速编译和调试。

---

不常见的 devtool 设值。



其它没介绍的值，只是上面值的组合。

在开发中，如何选择。

---

为什么需要 babel

webpack 底层使用 babel 对代码进行转换。

---

babel 命令行使用

创建 03- 项目，安装 babel babel/core

查看安装的版本 npx babel --version

---

插件的使用

使用 babel 编译代码，默认还是 ES6 代码。

安装 babel 的转化块级作用域的插件，转换箭头函数的插件。

---

babel 的预设

会自动开启严格模式。

---

babel 的底层原理。和执行原理图

