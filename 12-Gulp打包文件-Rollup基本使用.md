gulp 文件监听。

---

gulp 项目构建

接下来，我们编写一个案例，通过gulp来开启本地服务和打包：

- 打包html文件；
  - 使用 gulp-htmlmin 插件；
- 打包JavaScript文件；
  - 使用gulp-babel（@babel/core, @babel/preset-env），gulp-terser插件；
- 打包less文件；
  - 使用gulp-less插件；
- html资源注入
  - 使用 gulp-inject 插件；
  - 要在 index.html 中使用特殊注释标识。
  - 注入时，设置相对路径。
- 组合任务，
- 开启本地服务器
  - 使用 browser-sync 插件，非 gulp 专用的插件，可以在别的地方使用；
- 创建打包任务
- 创建开发任务，监听文件。

详细代码见课堂案例~

---

rollup 是什么？

库打包工具。

vite 会基于 rollup 进行打包。

rollup 和 webpack 的异同，适用场景

---

rollup 基本使用

创建项目 24-...

安装 rollup

使用 rollup 命令打包，要指定要应用的环境，比如：

- node 环境，要支持 CommonJS，配置参数 -f cjs
- browser 环境，要有全局对象，配置参数 -f iife
  - 像 jQuery 中，就是 $；
  - 像 dayjs 中，就是 dayjs
- AMD/CMD，配置参数 -f amd
- 所有环境都要支持，配置参数 -f umd，还要 --name 指定名字。

---

rollup 配置文件

名称：rollup.config.js

运行命令，根据配置文件打包

```shell
npx rollup -c
```

使用配置文件，打包各种格式。

---

当代码中使用了 loadash 时，没有被打包，因为 lodash 使用 commonjs，rollup 默认情况下只会处理 es module；

解决 commonjs 和第三方库问题，可参考[官方文档](https://rollupjs.org/introduction/#compatibility)

解决 node_modules 中库的引用。然后执行 npx rollup -c，打包。

配置排除第三方包。

---

插件的使用

rollup 中，好用的插件，参考[官方文档](https://github.com/rollup/awesome)

babel 转换代码

别忘了安装 @babel/core 和 @babel/preset-env

配置 babelHelpers，用于添加 polyfill。

---

terser 代码压缩。