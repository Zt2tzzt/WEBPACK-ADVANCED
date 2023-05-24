const { AsyncSeriesHook } = require('tapable')

class ZtCompiler {
  constructor() {
    this.hooks = {
      // 1.创建 hooks
      seriesHook: new AsyncSeriesHook(["name", "age"])
    }

    // 2.用 hooks 监听事件(自定义 plugin)
    this.hooks.seriesHook.tapAsync("event1", (name, age, callback) => {
      setTimeout(() => {
        console.log("event1 事件监听执行了:", name, age)
        callback()
      }, 3000);
    })

    this.hooks.seriesHook.tapAsync("event2", (name, age, callback) => {
      setTimeout(() => {
        console.log("event2 事件监听执行了:", name, age)
        callback()
      }, 3000);
    })
  }
}

const compiler = new ZtCompiler()
// 3.发出去事件
setTimeout(() => {
  compiler.hooks.seriesHook.callAsync("zzt", 18, () => {
    console.log("所有任务都执行完成~")
  })
}, 0);
