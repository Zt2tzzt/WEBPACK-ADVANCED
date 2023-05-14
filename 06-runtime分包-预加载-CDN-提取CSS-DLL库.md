runtimeChunk

---

prefetch 和 preload

开发时，推荐 prefetch

在代码中配置 about，category

---

CDN



平常公司开发，很少这么做，仅仅是第三方库使用 CDN 地址。

第三方库的 CDN 服务器。

注意 externals 的 key、value 含义。

---

shimming（预置全局变量） 是什么？

了解，不推荐使用

使用 ProviderPlugin 进行测试，key，value 与上面 externals 的相反。

因为 axios 库的导出方式，要使用 axios.default

---

> 使用 pnpmn 时，找不到 terser-webpack-plugin 包，安装一下。

MiniCssExtractPlugin 插件（掌握）

使用该插件后，不需要使用 styled-loader（一般在开发环境中使用）

将 css 提取到单独的文件中。

对于动态导入的 css，进行分包，用 `chunkFilename`

---

hash

会根据整个项目的内容改变，不利于浏览器做缓存。

contentHash 和 chunkHash 的区别，动态导入有问题，用 css 提取做演示。

推荐 contentHash

---

了解 dll