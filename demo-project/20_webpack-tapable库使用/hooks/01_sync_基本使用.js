const { SyncHook } = require('tapable')

class ZtCompiler {
  constructor() {
    this.hooks = {
      // 1.创建 hooks
      syncHook: new SyncHook(["name", "age"])
    }


    // 2.用 hooks 监听事件(自定义 plugin)
    this.hooks.syncHook.tap("event1", (name, age) => {
      console.log("event1 事件监听执行了:", name, age)
    })
    
    this.hooks.syncHook.tap("event2", (name, age) => {
      console.log("event2 事件监听执行了:", name, age)
    })
  }
}

const compiler = new ZtCompiler()

// 3.发出去事件
setTimeout(() => {
  compiler.hooks.syncHook.call("zzt", 18)
}, 2000);
