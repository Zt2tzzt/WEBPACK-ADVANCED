如何使用 webpack 性能优化。

---

性能优化，代码分离。

上课画图1

面试，系统优化

三种方式

---

webpack 多入口依赖，了解，用的少。

以前都是一个入口，打包时，形成一个依赖图。

创建多入口 mian.js

在 webpack.config.js 文件中，配置多入口。

- 配置 entry 为对象。
- 配置 output.filename，使用 placeholder

回顾：defs、占位符

缺点：都依赖相同的库，那么这个库会被打包多次。



入口依赖

在 entry 中，配置 share。

---

webpack 动态导入 掌握

懒加载的概念，vue/react 都有，分包打包。



模拟路由。代码懒加载。

创建 router/about.js，router/categoryu.js

回顾 es6 语法，import 函数。



为打包的文件名，命名。

- 使用 chunkfilename；
- 使用魔法注释。会在 chunkname 中的 [name] 中，生效。

---

splitChunkPlugin

webpack 内置的插件，以前没有，现在内置了

相比起动态导入，不需要 import 才能分包，可自定义分包。



axios，react 等依赖的库，默认会打包在主包中；

如果希望将他们和主包分开，使用自定义分包。



cacheGroups 匹配 node_module 时，\/ 匹配。

默认 minSize: 20kb，只有大于这个数，才会拆包。



splitchunks 自定义配置名称。

当模式改为 production，打包时加了注释。使用 terserPOlugin 插件。



production，development 模式下，打包名称不同。

chunkIds 配置。

---

prefetch 和 preload

通过魔法注释，做预获取或预加载。

---

CDN 加速服务器配置。

---

CSS 单独抽取

