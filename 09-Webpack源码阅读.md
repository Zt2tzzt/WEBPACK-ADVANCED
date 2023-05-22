webpack 源码

在 webpack 源码目录中，创建 zzt 文件夹，用于测试。

在 src 目录下，编写源码；

创建 build.js 用于打包；

```js
const webpack = require("../lib/webpack");
const config = require("./webpack.config");

const compiler = webpack(config); // 看源码时，从这个入口开始看。

compiler.run((err, stats) => {
  if (err) {
    console.error(err);
  } else {
    console.log(stats);
  }
});
```

使用调试工具，进行源码阅读。

像 Vue / React 的脚手架，都是直接调用 `webpack` 函数，没有使用 webpack-cli

> 开源吗不是为了面试，而是学习思想；



webpack 创建过程，和 hooks 的作用

webpack 源码非常优秀，但存在大量的回调地狱；

webpack 官方提供了一个库 tapable

```shell
npm install tapable -D
```

核心代码：

```js
import { AsyncSeriesHook } from 'tapable'

// 1.创建 hook
this.hook = {
  run new AsyncSeriesHook(['compiler'])
}

// 2.监听事件
this.hooks.run.tabAsync('zzt', (res) => {})
this.hooks.run.tabAsync('abc', (res) => {})

// 3.使用 hook，触发事件
this.hooks.run.callAsync('abc', () => {
  // 执行下一个操作
})
```



注册 plugins

注册插件可传函数、对象。

对象中必须要有 apply 方法

lib\webpack.js G69



webpack 传入的选项，也会被转为插件。

lib\webpack.js G82



compiler 贯穿打包全流程

创建 compiler 时，会创建 hooks，注册 plugin；

之后 compilation 会在编译模块时，创建出来；

再把结果交给 compiler；

再由 compiler 将结果输出出去。



run 方法

lib\Compiler.js

```js
// 开始执行编译工作
const run = () => {
  this.hooks.beforeRun.callAsync(this, err => {
    if (err) return finalCallback(err);

    this.hooks.run.callAsync(this, err => {
      if (err) return finalCallback(err);

      this.readRecords(err => {
        if (err) return finalCallback(err);

        this.compile(onCompiled);
      });
    });
  });
};
```

可自行编写 plugin

```js
class ZTBeforeCompilerPlugin {
  apply(compiler) {
    compiler.hooks.beforeRun.tapAsync('aaa', (xxx) => {
      // 执行的回调函数
    })
  }
}
```



注册 EntryPlugin 的时候，调用了 apply 方法。其中注册了 EntryPlugin 事件

compilation 使用的地方，开始编译模块。

lib\EntryPlugin.js G50



在 _addEntryItem 方法中，



在 this.addModuleTree 方法中，将入口添加到模块中。



在 this.handleModuleCreation 方法中，处理入口模块。

lib\Compilation.js G2080



在 this.factorizeModule 中，因式分解，对入口 mian.js 中，引入的模块，进行分解；

lib\Compilation.js G1771



this.buildModule 开始构建模块

lib\Compilation.js G1928



发现会将构建的模块，加入到队列中。

lib\Compilation.js G1339



队列的结构，将要构建的模块，加入到队列中，会执行 this._buildModule

lib\Compilation.js G948



在 module.needBuild 方法中，判断哪些模块需要构建

- 有些模块已经构建过，就不用构建了。

lib\Compilation.js G1358



在 module.build 中构建模块，使用了多态。

lib\Compilation.js G1377



在 _doBuild 方法中，拿到上下文的 loader，在 processResult 方法中，处理构建后的结果。

lib\NormalModule.js G749



在 runloader 方法中，使用 loader 构建模块。

使用了单独的库 loader-runner。

lib\NormalModule.js



在 processResult 方法中，return callback(error); 一个模块处理完成。

lib\NormalModule.js G771



又来到 this.factorizeModule 因式分解方法中，处理依赖的另一个模块。

lib\Compilation.js G1771



使用 const newModule = factoryResult.module; 创建一个新模块。

lib\Compilation.js G1806



compilation 完成后，来到 this.hooks.finishMake 中

lib\Compiler.js G1188



其中 compilation.sealseal 方法，用于封存构建的模块，

将打包的模块保存到 chunk 中。

lib\Compilation.js G2800



最后调用 this.hooks.afterCompile 中的 callback，回到 onCompiled 方法中；

lib\Compiler.js G451

使用 this.emitAssets 输出打包后的文件；

lib\Compiler.js 595



理解 webpack 执行流程解析；