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