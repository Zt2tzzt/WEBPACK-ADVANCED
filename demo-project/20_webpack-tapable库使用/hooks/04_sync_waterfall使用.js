const { SyncWaterfallHook } = require('tapable')

class ZtCompiler {
  constructor() {
    this.hooks = {
      // 1.创建 hooks
      waterfallHook: new SyncWaterfallHook(['name', 'age'])
    }

    // 2.用 hooks 监听事件(自定义plugin)
    this.hooks.waterfallHook.tap('event1', (name, age) => {
      console.log('event1 事件监听执行了:', name, age)

      return { xx: 'xx', yy: 'yy' }
    })

    this.hooks.waterfallHook.tap('event2', (name, age) => {
      console.log('event2 事件监听执行了:', name, age)
    })
  }
}

const compiler = new ZtCompiler()
// 3.发出去事件
setTimeout(() => {
  compiler.hooks.waterfallHook.call('zzt', 18)
}, 2000)
