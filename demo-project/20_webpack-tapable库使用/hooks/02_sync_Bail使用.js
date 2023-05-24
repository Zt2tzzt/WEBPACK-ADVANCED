const { SyncBailHook } = require('tapable')

class HYCompiler {
  constructor() {
    this.hooks = {
      // 1.创建hooks
      // bail 的特点: 如果有返回值, 那么可以阻断后续事件继续执行
      bailHook: new SyncBailHook(["name", "age"])
    }


    // 2.用 hooks 监听事件(自定义 plugin)
    this.hooks.bailHook.tap("event1", (name, age) => {
      console.log("event1事件监听执行了:", name, age)
      return 123
    })
    
    this.hooks.bailHook.tap("event2", (name, age) => {
      console.log("event1 事件监听执行了:", name, age)
    })
  }
}

const compiler = new HYCompiler()

// 3.发出去事件
setTimeout(() => {
  compiler.hooks.bailHook.call("zzt", 18)
}, 2000);
