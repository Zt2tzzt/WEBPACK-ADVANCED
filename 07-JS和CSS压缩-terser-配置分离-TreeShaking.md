Terser



webpack 弄人打包的 bumdle，没有进行压缩。

TerserPlugin 可用于打包压缩。

Plugin 贯穿于 webpack 打包全生命周期。

面试“优化”可回答 Terser

---

命令行使用 terser

-c: compress

-m mangle

分别有哪些参数：

---

webpack 中配置 TerserPlugin



TerserPlugin 底层用的 Terser 工具。

mode: production 模式下，才会筹划压缩，发现可以在此基础上，再做优化。

配置 minimizer 前，先配置 minimize: true（production 模式下，默认为 true）

---

CSS 压缩（掌握）

webpack 默认没有配置，需要自行配置



parallel 默认也是 true。

---

webpack 配置文件抽取，生产、开发环境。



在 webpack 的配置文件中，使用 module.exports 导出一个函数，webpack 会加载这个函数中返回的对象。

在 package.json 中的 build，serve 命令后，加上 --env 命令。

在导出的函数中，会传入 env 对象，在其中获取环境变量。



赋值两份 comm.config.js，更名为 dev.config.js 何 prod.config.js；

在其中导出的对象，不需要使用函数。

生产环境，所需要的配置更多。



安装 webpack-merge 插件。

pnpm add webpack-merge -D

在 comm.config.js 中，使用

在 comm.config.js 中，动态的加载 MiniCssExtractPlugin.loader