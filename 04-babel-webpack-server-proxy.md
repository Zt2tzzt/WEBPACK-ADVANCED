# babel、webpack server proxy

## 一、React jsx 编译

react 使用的语法是 jsx，可以直接使用 babel 来转换。

使用 babel，对 react jsx 代码进行处理，需要如下的插件：

- @babel/plugin-syntax-jsx
- @babel/plugin-transform-react-jsx
- @babel/plugin-transform-react-display-name

同样的，在开发中，不需要一个个去安装这些插件，使用 preset 来配置即可：

安装 *@babel/preset-react*

```shell
npm install @babel/preset-react -D
```

demo-project\04_webpack服务器\babel.config.js

```js
module.exports = {
  presets: [
    ["@babel/preset-env"],
    ["@babel/preset-react"]
  ]
}
```

在项目中，安装 rect、react-dom

```shell
npm install react react-dom
```

编写一个 React 组件 `App.jsx`

demo-project\04_webpack服务器\src\react\App.jsx

```jsx
import React, { memo, useState } from 'react'

const App = memo(() => {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1>App Count: {count}</h1>
      <button onClick={e => setCount(count+1)}>+1</button>
    </div>
  )
})

export default App
```

创建一个模板 `index.html`，将 react 渲染到 `div#root` 中：

demo-project\04_webpack服务器\index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  
  <div id="root"></div>
</body>
</html>
```

demo-project\04_webpack服务器\src\index.js

```js
import App from "./react/App";

// 5.编写react代码
const root = ReactDom.createRoot(document.querySelector("#root"));
root.render(<App />);
```

对 html 模板文件进行打包处理，并添加到打包目录下，引用打包后的 js 文件。

安装 *html-webpack-plugin* 插件。

```shell
npm install html-webpack-plugin -D
```

使用该插件。

demo-project\04_webpack服务器\webpack.config.js

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  plugin: [
    new HtmlWebpackPlugin({
      template: './index.html' // 指定模板文件路径。
    })
  ]
}
```

> js 中也可以写 jsx 代码。



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