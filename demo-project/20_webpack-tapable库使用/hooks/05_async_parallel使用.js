const { AsyncParallelHook } = require('tapable')

class ZtCompiler {
  constructor() {
    this.hooks = {
      // 1.创建 hooks
      parallelHook: new AsyncParallelHook(["name", "age"])
    }


    // 2.用 hooks 监听事件(自定义plugin)
    this.hooks.parallelHook.tapAsync("event1", (name, age) => {
      setTimeout(() => {
        console.log("event1 事件监听执行了:", name, age)
      }, 3000);
    })

    this.hooks.parallelHook.tapAsync("event2", (name, age) => {
      setTimeout(() => {
        console.log("event2 事件监听执行了:", name, age)
      }, 3000);
    })
  }
}

const compiler = new ZtCompiler()
// 3.发出去事件
setTimeout(() => {
  compiler.hooks.parallelHook.callAsync("zzt", 18)
}, 0);
