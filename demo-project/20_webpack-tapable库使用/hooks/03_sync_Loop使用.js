const { SyncLoopHook } = require('tapable')

let count = 0

class HYCompiler {
  constructor() {
    this.hooks = {
      // 1.创建 hooks
      loopHook: new SyncLoopHook(["name", "age"])
    }


    // 2.用 hooks 监听事件(自定义plugin)
    this.hooks.loopHook.tap("event1", (name, age) => {
      if (count < 5) {
        console.log("event1 事件监听执行了:", name, age)
        count++
        return true
      }
    })
    
    this.hooks.loopHook.tap("event2", (name, age) => {
      console.log("event2 事件监听执行了:", name, age)
    })
  }
}

const compiler = new HYCompiler()

// 3.发出去事件
setTimeout(() => {
  compiler.hooks.loopHook.call("zzt", 18)
}, 2000);
